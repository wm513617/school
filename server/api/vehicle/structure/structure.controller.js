'use strict'

var fs = require('fs')
const config = require('../../../../config').backend
var rp = require('request-promise')
var ServerSetting = require('mongoose').model('ServerSetting')

/**
 * 获取显示列表
 */
exports.list = async (ctx) => {
  const serverData = await getServerData() // 读取服务器数据
  const treeData = await sendData(serverData, {
    type: 'get'
  }, 'GET', '/business/channelconfig.php')
  const arr = []
  if (treeData.errorCode === 0) {
    treeData.data.forEach(d => {
      d.children.forEach(c => {
        const temp = c.channelConfigObject.InputSrc
        if (temp.SrcType === 4) {
          arr.push({
            channelid: c.channelId,
            channelName: c.channelName,
            startTime: temp.HttpFileSrc.StartTime,
            endTime: temp.HttpFileSrc.EndTime,
            rtmp: c.RtmpAddress,
            filePath: temp.HttpFileSrc.FilePath,
            serid: serverData._id
          })
        }
      })
    })
  }
  ctx.body = arr
}
/**
 * 添加通道
 */
exports.add = async (ctx, next) => {
  try {
    ctx.set('loginfo', encodeURI('其他-添加通道'))
    const postData = ctx.request.body
    const serid = postData.serid
    const channelName = postData.channelName
    const serverData = await getServerData(serid) // 读取服务器数据
    const defaultConfigStr = await getDefaultConfigStr(serverData, postData)
    const addoptions = {
      type: 'add',
      channelName: channelName,
      nodeType: 2,
      parentId: 1,
      vsTypeId: 0,
      httpPort: '',
      isAutoStart: 0,
      channelConfig: defaultConfigStr
    }
    const result = await sendData(serverData, addoptions)
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message
      })
    }
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 更新通道请求
 */
exports.update = async (ctx) => {
  ctx.set('loginfo', encodeURI('其他-修改通道'))
  try {
    const updateObj = ctx.request.body
    const serverData = await getServerData(updateObj.serid)

    // 拼接修改对象
    const updateSemoObj = {
      type: 'update',
      channelId: updateObj.channelid,
      channelName: updateObj.channelName,
      channelConfig: await getDefaultConfigStr(serverData, updateObj)
    }
    // 提交数据
    const result = await sendData(serverData, updateSemoObj)
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message
      })
    }
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 删除通道
 */
exports.del = async (ctx) => {
  ctx.set('loginfo', encodeURI('其他-删除通道'))
  try {
    const result = await simpleAction(ctx, 'delete')
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message,
        type: 'sys'
      })
    }
    fs.unlinkSync(config.videoDir + ctx.query.filePath.split('/static/video')[1])
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 开始执行通道
 */
exports.startAction = async (ctx) => {
  ctx.set('loginfo', encodeURI('其他-开始执行通道'))
  try {
    const result = await simpleAction(ctx, 'addExecute')
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message,
        type: 'sys'
      })
    }
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 停止执行通道
 */
exports.stopAction = async (ctx) => {
  ctx.set('loginfo', encodeURI('其他-停止执行通道'))
  try {
    const result = await simpleAction(ctx, 'removeExecute')
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message,
        type: 'sys'
      })
    }
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 关闭通道开机自启
 */
exports.disableAtion = async (ctx) => {
  ctx.set('loginfo', encodeURI('其他-关闭通道开机自启'))
  try {
    const result = await simpleAction(ctx, 'disable')
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message,
        type: 'sys'
      })
    }
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 开启通道开机自启
 */
exports.enableAction = async (ctx) => {
  ctx.set('loginfo', encodeURI('其他-开启通道开机自启'))
  try {
    const result = await simpleAction(ctx, 'enable')
    if (result.errorCode !== 0) {
      return ctx.throw(500, {
        message: result.message,
        type: 'sys'
      })
    }
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, {
      code: 2101,
      message: error.message,
      type: 'sys'
    })
  }
}

/**
 * 读取服务器配置获取ip和端口
 * @param {String} serid 服务器ID
 */
const getServerData = async (serid) => {
  const data = await ServerSetting.findOne(serid ? { _id: serid, type: 1 } : { type: 1 }, 'ip webport').exec()
  return data
}

/**
 * 发送请求数据
 * @param {Object} serverData 服务器请求数据对象
 * @param {Object} postDatas 提交操作数据对象
 */
const sendData = async (serverData, postDatas, method = 'POST', uri = '/business/channelconfig.php') => {
  const options = {
    method: method,
    uri: 'http://' + serverData.ip + ':' + serverData.webport + uri,
    body: postDatas,
    json: true
  }
  const data = await rp(options)
  return data
}

/**
 * 获取深晶默认配置
 * @param {Object} serverData 服务器请求数据对象
 * @param {Object} obj 请求数据对象
 */
const getDefaultConfigStr = async (serverData, obj) => {
  const configDefault = await rp('http://' + serverData.ip + ':' + serverData.webport + '/business/channelconfig.php?type=getDefaultConfig')
  const defaultConfigObject = JSON.parse(configDefault).data.defaultConfigObject
  const fileUrl = `http://${getIPAdress()}${obj.filePath}`
  defaultConfigObject.InputSrc.SrcType = 4
  defaultConfigObject.InputSrc.HttpFileSrc = {
    FilePath: fileUrl,
    StartTime: obj.startTime,
    EndTime: obj.endTime,
    PlaySpeed: 1
  }
  return JSON.stringify(defaultConfigObject)
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

/**
 * 执行简单的指令
 * @param {*} ctx 上下文对象
 * @param {String} action 请求指令
 */
const simpleAction = async (ctx, action, method = 'POST') => {
  const channelid = ctx.query.channelid
  const serid = ctx.query.serid
  const serverData = await getServerData(serid) // 读取服务器配置获取ip和端口
  const delOptions = {
    type: action,
    channelId: channelid
  }
  const result = await sendData(serverData, delOptions, method)
  return result
}
