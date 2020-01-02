/*
 * @Description: 视频结构化服务器配置 service
 * @Author: wanglei
 * @Date: 2019-06-27 11:35:32
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-09-23 10:19:40
 */
'use strict'

const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
const StructureServer = mongoose.model('structureserver')
const rp = require('request-promise')
const _ = require('lodash')
const postal = require('postal')
const { AnalysisStatusCodeEnum, VideoClassCodeEnum } = require('../structure.enum')
const { tranformPromiseAll } = require('../../../common/tools')

const activeServerConnection = async data => {
  const result = await loginServer(data)
  if (Number(result.body.errorCode) !== 0) {
    throw new Error(`用户登录出错 - ${result.message}`)
  }
  if (_.get(data, 'addResources', []).length) {
    await bindResource(data)
  }
  if (_.get(data, 'removeResources', []).length) {
    await unBindResource(data)
  }
}

/**
 * 向视频结构化服务器绑定资源，即新增通道
 * @param {object} data 服务器请求数据对象
 */
const bindResource = async data => {
  try {
    const resIds = _.get(data, 'addResources', [])
    if (resIds.length <= 0) {
      return
    }
    const resArr = await Resource.find({ _id: { $in: resIds } }, 'name rtsp')
      .lean()
      .exec()
    const addChannelArr = resArr.map(item => addChannel(data, item))
    await Promise.all(tranformPromiseAll(addChannelArr))
  } catch (error) {
    console.log({ message: '新增通道失败', error: error })
    throw new Error(`向视频结构化服务器绑定资源失败: ${error.message}`)
  }
}

/**
 * 向视频结构化服务器解绑资源，即删除通道
 * @param {object} data 服务器请求数据对象
 */
const unBindResource = async data => {
  try {
    const resIds = _.get(data, 'removeResources', [])
    if (resIds.length <= 0) {
      return
    }
    const ress = await Resource.find({ _id: { $in: resIds } }, 'videoStructure')
      .lean()
      .exec()
    const deleteChannelArr = ress.map(item => deleteChannel(data, item))
    await Promise.all(tranformPromiseAll(deleteChannelArr))
  } catch (error) {
    throw new Error(`向视频结构化服务器中解绑资源失败: ${error.message}`)
  }
}

const addChannel = async (data, resItem) => {
  const defaultConfigStr = await getDefaultConfigStr(data, resItem.name, resItem.rtsp.main)
  // 请求视频结构化服务器的参数
  const postDatas = {
    type: 'add',
    channelName: resItem.name,
    nodeType: 2,
    parentId: 1,
    vsTypeId: 0,
    httpPort: '',
    isAutoStart: 1,
    channelConfig: defaultConfigStr
  }
  const result = await sendData(data, postDatas)
  if (Number(result.errorCode) !== 0) {
    console.log(`新增通道失败 - ${resItem} - ${result.message}`)
    return
  }
  const rtmpResult = await sendData(data, { type: 'getTaskDetail', channelId: result.channelId })
  if (Number(rtmpResult.errorCode) !== 0) {
    console.log(`新增通道 - ${resItem} - ${rtmpResult.message}`)
  }
  let videoStructure
  if (data.server.id) {
    videoStructure = {
      structureServer: data.server.id,
      analysisStatus: AnalysisStatusCodeEnum.NOTSTART,
      channelId: result.channelId,
      rtmp: _.get(rtmpResult, 'data.rtmpAddress', '')
    }
  } else {
    videoStructure = {
      analysisStatus: AnalysisStatusCodeEnum.NOTSTART,
      channelId: result.channelId,
      rtmp: _.get(rtmpResult, 'data.rtmpAddress', '')
    }
  }
  // 开启通道分析
  const analysisResult = await channelAnalysis(data, result.channelId, 'addExecute')
  if (Number(analysisResult.errorCode) !== 0) {
    videoStructure.analysisStatus = AnalysisStatusCodeEnum.ANALYZFAIL
  } else {
    videoStructure.analysisStatus = AnalysisStatusCodeEnum.ANALYZING
  }
  // 打开通道编码, 默认编码等级 3
  const encodeResult = await channelEncode(data, 'startEncode', result.channelId)
  if (Number(encodeResult.errorCode) !== 0) {
    console.log(`开启 ${data.server.ip}-${result.channelId} 视频通道编码失败: ${encodeResult.message}`)
  }
  await Resource.findByIdAndUpdate(resItem._id, { videoStructure: videoStructure })
    .lean()
    .exec()
}

const deleteChannel = async (data, resItem) => {
  // 先停止分析通道分析，再删除通道
  await channelAnalysis(data, resItem.videoStructure.channelId, 'removeExecute')
  const result = await sendData(data, { type: 'delete', channelId: resItem.videoStructure.channelId })
  if (Number(result.errorCode) !== 0) {
    console.log(`删除通道失败 - ${resItem} - ${result.message}`)
  } else {
    await Resource.findByIdAndUpdate(resItem, {
      videoStructure: { analysisStatus: AnalysisStatusCodeEnum.NOTSTART, channelId: -1 }
    })
      .lean()
      .exec()
    await StructureServer.findByIdAndUpdate(resItem.videoStructure.structureServer, { $pull: { res: resItem._id } })
      .lean()
      .exec()
  }
}

/**
 * 测试目标服务器是否可用
 * @param {object} data 服务器请求数据对象
 */
const loginServer = async data => {
  try {
    const postDatas = {
      type: 'login',
      UserAccount: _.get(data, 'data.UserAccount', 'admin'),
      UserPassword: _.get(data, 'data.UserPassword', 'intedio')
    }
    const options = {
      method: 'POST',
      uri: `http://${data.server.ip}:${data.server.port}/business/userlogic.php`,
      body: postDatas,
      json: true,
      resolveWithFullResponse: true,
      timeout: 1000 * 10
    }
    const response = await rp(options)
    const result = {
      body: response.body,
      cookie: response.headers['set-cookie'][0]
    }
    return result
  } catch (error) {
    throw new Error('找不到指定Ip/Port的服务器')
  }
}

/**
 * 获取深晶默认配置
 * @param {Object} data 服务器请求数据对象
 * @param {String} channelName 通道名称
 */
const getDefaultConfigStr = async (data, channelName, rtsp) => {
  const configDefault = await sendData(data, { type: 'getDefaultConfig' })
  const defaultConfigObject = configDefault.data.defaultConfigObject
  defaultConfigObject.InputSrc.SrcType = 1
  defaultConfigObject.ChannelName = channelName
  defaultConfigObject.InputSrc.RtspSrc = {
    Address: _.replace(rtsp, 'ip:port', data.server.rtspIp),
    ProtocolType: 1 // 0 UDP | 1 TCP
  }
  return JSON.stringify(defaultConfigObject)
}

/**
 * 根据请求指令，开启，关闭通道分析
 * 开启、关闭通道开机自启
 * @param {object} data 服务器数据
 * @param {number} channelId 视频结构化中的通道id
 * @param {string} action 请求指令
 * @param {string} method 请求方式
 */
const channelAnalysis = async (data, channelId, action, method = 'GET') => {
  const options = {
    type: action,
    channelId: channelId
  }
  const result = await sendData(data, options, method)
  return result
}

/**
 * 开启或关闭视频通道编码
 * @param {object} serverData 服务器数据
 * @param {string} type 开启或关闭
 * @param {number} encodeLevel 视频编码等级
 * @param {number} channelId 视频通道id，关闭时需要
 */
const channelEncode = async (
  serverData,
  type,
  channelId,
  encodeLevel = VideoClassCodeEnum.SUPERPOSE_ONECLASS_ZH_CODE
) => {
  let optionsType = {
    startEncode: {
      type: type,
      id: channelId,
      encodeLevel: encodeLevel
    },
    stopEncode: {
      type: type,
      id: channelId
    }
  }
  const result = await sendData(serverData, optionsType[type], 'GET', '/business/seemideo.php')
  return result
}

/**
 * 开启服务
 * @param {object} serverData 视频结构化服务器数据对象
 */
const startWeb = async serverData => {
  const postDatas = {
    type: 'startWeb',
    ismock: false,
    isasync: true,
    isDensity: false
  }
  try {
    const result = await sendData(serverData, postDatas, 'GET', '/business/seemideo.php')
    return Object.assign(result, { serverId: serverData.serverId, serverName: serverData.serverName })
  } catch (error) {
    throw Error(error)
  }
}

/**
 * 停止服务
 * @param {object} serverData 视频结构化服务器数据对象
 */
const stopWeb = async serverData => {
  const postDatas = {
    type: 'stopWeb'
  }
  try {
    const result = await sendData(serverData, postDatas, 'GET', '/business/seemideo.php')
    return Object.assign(result, { serverId: serverData.serverId, serverName: serverData.serverName })
  } catch (error) {
    throw Error(error)
  }
}

/**
 * 设置布控报警数据的推送地址
 * @param {object} serverData 视频结构化服务器数据对象
 * @param {number} status 0 不推送 | 1 推送
 */
const setIdentifyPushAddress = async (serverData, status) => {
  try {
    const postDatas = {
      id: 1, // 是别数据 1 | 布控数据 2
      userId: 1, // 用户的唯一id admin用户
      mode: 1, // 推送模式 1 http | 2 kafka
      type: 'recognize', // 识别数据
      pushField: [1, 2, 3], // 1 大图 | 2 小图 | 3 结构化数据 | 4 特征值
      imageType: '1', // 图片类型 1 url地址 | base64数据
      url: `http://${getIPAdress()}:${process.env.NODE_PORT}/api/structure/identify`,
      status: status // 0 不推送 | 1 推送
    }
    const result = await sendData(serverData, postDatas, 'POST', '/business/push.php')
    return result
  } catch (error) {
    throw new Error(`设置识别数据回调接口出错 - ${error.message}`)
  }
}

/**
 * 设置布控报警数据的推送地址
 * @param {object} serverData 视频结构化服务器数据对象
 * @param {number} status 0 不推送 | 1 推送
 */
const setDefenseAlarmPushAddress = async (serverData, status) => {
  try {
    const postDatas = {
      id: 2, // 是别数据 1 | 布控数据 2
      userId: 1, // 用户的唯一id admin用户
      mode: 1, // 推送模式 1 http | 2 kafka
      type: 'monitor', // 识别数据
      pushField: [1, 2, 3], // 1 大图 | 2 小图 | 3 结构化数据 | 4 特征值
      imageType: '1', // 图片类型 1 url地址 | base64数据
      url: `http://${getIPAdress()}:${process.env.NODE_PORT}/api/structure/defense/task/alarm`,
      status: status // 0 不推送 | 1 推送
    }
    const result = await sendData(serverData, postDatas, 'POST', '/business/push.php')
    return result
  } catch (error) {
    throw new Error(`设置布控报警数据回调接口出错 - ${error.message}`)
  }
}

/**
 * 发送请求数据
 * @param {Object} serverData 服务器请求数据对象
 * @param {Object} postDatas 提交操作数据对象
 */
const sendData = async (serverData, postDatas, method = 'GET', uri = '/business/channelconfig.php') => {
  const options = {
    method: method,
    uri: `http://${serverData.server.ip}:${serverData.server.port}${uri}`,
    body: postDatas,
    json: true
  }
  const result = await rp(options)
  return result
}

/**
 * 带 cookie 发送请求数据
 * @param {*} serverData 服务器请求数据对象
 * @param {*} postDatas 提交操作数据对象
 * @param {*} cookie cookie
 * @param {*} method 请求方式
 * @param {*} uri 请求地址
 */
const sendDataWithCookie = async (serverData, postDatas, cookie, method = 'POST', uri = '/business/userlogic.php') => {
  const options = {
    method: method,
    uri: `http://${serverData.server.ip}:${serverData.server.port}${uri}`,
    body: postDatas,
    headers: { cookie: cookie },
    json: true
  }
  const result = await rp(options)
  return result
}

const getIPAdress = () => {
  var interfaces = require('os').networkInterfaces()
  for (var devName in interfaces) {
    const iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

// 同步视频结构化服务器中视频通道的在线情况
const syncResOnlineList = async () => {
  try {
    let promises = []
    let tasks = []
    const statusType = {
      '0': AnalysisStatusCodeEnum.NOTSTART,
      '1': AnalysisStatusCodeEnum.ANALYZING,
      '3': AnalysisStatusCodeEnum.STOPED,
      '6': AnalysisStatusCodeEnum.ANALYZFAIL,
      '10': AnalysisStatusCodeEnum.ANALYZFAIL
    }
    const serverArr = await StructureServer.find({}, 'ip port')
      .lean()
      .exec()
    for (let server of serverArr) {
      const serverData = {
        server: {
          ip: server.ip,
          port: server.port
        }
      }
      // 0 未开始 | 1 分析中 | 2 已停止 | 3 解码失败
      const [notStart, starting, stopped, decodeFail] = await Promise.all([
        sendData(serverData, { type: 'getTaskList', taskStatus: 0 }, 'GET', '/business/channelconfig.php'), // 未开始
        sendData(serverData, { type: 'getTaskList', taskStatus: 1 }, 'GET', '/business/channelconfig.php'), // 分析中
        sendData(serverData, { type: 'getTaskList', taskStatus: 3 }, 'GET', '/business/channelconfig.php'), // 已停止
        sendData(serverData, { type: 'getTaskList', taskStatus: 6 }, 'GET', '/business/channelconfig.php') // 解码失败
      ])
      let notStartTasks = notStart.errorCode === 0 && notStart.tasks && notStart.tasks.length ? notStart.tasks : []
      let startingTasks = starting.errorCode === 0 && starting.tasks && starting.tasks.length ? starting.tasks : []
      let stoppedTasks = stopped.errorCode === 0 && stopped.tasks && stopped.tasks.length ? stopped.tasks : []
      let decodeFailTasks =
        decodeFail.errorCode === 0 && decodeFail.tasks && decodeFail.tasks.length ? decodeFail.tasks : []
      let tempArr = _.concat(notStartTasks, startingTasks, stoppedTasks, decodeFailTasks)
      tasks = tasks.concat(tempArr)
      for (let item of tempArr) {
        const updatePromise = Resource.updateOne(
          { 'videoStructure.structureServer': server._id, 'videoStructure.channelId': item.jobid },
          { 'videoStructure.analysisStatus': statusType[item.status] }
        ).exec()
        promises.push(updatePromise)
      }
    }
    await Promise.all(promises)
  } catch (error) {
    console.log(`同步视频结构化服务器视频通道在线情况失败 - ${error.message}`)
  }
}

const getServerData = async serverId => {
  const server = await StructureServer.findById(serverId, 'ip port username password')
    .lean()
    .exec()
  return {
    server: {
      ip: server.ip,
      port: server.port,
      UserAccount: server.username,
      UserPassword: server.password
    }
  }
}

// 开启或关闭视频编码或修改视频编码等级
postal.subscribe({
  channel: 'videoStructure',
  topic: 'param.startOrStopCode',
  callback: async function (data, envelope) {
    try {
      const ress = await Resource.find({ 'videoStructure.structureServer': { $exists: true } }, 'videoStructure')
        .and([{ 'videoStructure.channelId': { $ne: -1 } }])
        .populate('videoStructure.structureServer', 'ip port')
        .lean()
        .exec()
      for (let item of ress) {
        const serverData = {
          server: {
            ip: item.videoStructure.structureServer.ip,
            port: item.videoStructure.structureServer.port
          }
        }
        if (data.type === 'startEncode') {
          // 开启编码，或修改编码等级，需要先关闭编码，才能修改编码
          const result = await channelEncode(serverData, data.type, item.videoStructure.channelId, data.encodeLevel)
          // 1417 encode is started already 编码已经启动
          if (Number(result.errorCode) === 1417) {
            await channelEncode(serverData, 'stopEncode', item.videoStructure.channelId)
            await channelEncode(serverData, 'startEncode', item.videoStructure.channelId, data.encodeLevel)
          }
        } else {
          await channelEncode(serverData, 'stopEncode', item.videoStructure.channelId)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
})

// 修改绑定的视频通道名称时，同步修改结构化服务器中的通道名称
postal.subscribe({
  channel: 'devices',
  topic: 'item.notice',
  callback: async function (data, envelope) {
    try {
      const { varyData = [] } = data.data
      if (varyData.length) {
        const { resourceId, after } = varyData[0]
        const ress = await Resource.findOne({ _id: resourceId, 'videoStructure.structureServer': { $exists: true } })
          .populate('videoStructure.structureServer', 'ip port')
          .lean()
          .exec()
        if (!_.isNull(ress)) {
          const serverData = {
            server: {
              ip: ress.videoStructure.structureServer.ip,
              port: ress.videoStructure.structureServer.port
            }
          }
          const configResult = await sendData(serverData, {
            type: 'getTaskDetail',
            channelId: ress.videoStructure.channelId
          })
          if (Number(configResult.errorCode) === 0) {
            // 请求视频结构化服务器的参数
            const postDatas = {
              type: 'update',
              channelId: ress.videoStructure.channelId,
              channelName: after.channelName,
              nodeType: 2,
              parentId: 1,
              vsTypeId: 0,
              httpPort: '',
              isAutoStart: 1,
              channelConfig: JSON.stringify(configResult.data.param)
            }
            const result = await sendData(serverData, postDatas)
            console.log(`同步修改绑定的视频通道名称-resourceId: ${resourceId}-${Number(result.errorCode) === 0 ? '成功' : '失败'}`)
          }
        }
      }
    } catch (error) {
      console.log(`同步结构化服务器修改通道名称失败-${error}`)
    }
  }
})

// 在设备管理删除设备时同步删除绑定在视频结构化上的视频通道
postal.subscribe({
  channel: 'videoStructure',
  topic: 'delete.videoChannel',
  callback: async function (data, envelope) {
    try {
      let { resources = [] } = data
      if (resources.length) {
        for (let item of resources) {
          if (_.isNull(item) || _.isUndefined(item)) {
            continue
          }
          const serverData = await getServerData(item.videoStructure.structureServer)
          const result = await sendData(serverData, { type: 'delete', channelId: item.videoStructure.channelId })
          if (Number(result.errorCode) !== 0) {
            console.log(`删除通道失败 - ${item} - ${result.message}`)
          } else {
            await StructureServer.findByIdAndUpdate(item.videoStructure.structureServer, { $pull: { res: item._id } })
              .lean()
              .exec()
          }
        }
      }
    } catch (error) {
      console.log(`删除设备时同步删除视频结构化视频通道失败-${error}`)
    }
  }
})

module.exports = {
  activeServerConnection,
  loginServer,
  sendData,
  unBindResource,
  sendDataWithCookie,
  startWeb,
  stopWeb,
  setIdentifyPushAddress,
  setDefenseAlarmPushAddress,
  syncResOnlineList,
  getServerData
}
