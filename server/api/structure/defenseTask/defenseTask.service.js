/*
 * @Description: 视频结构化布控管理
 * @Author: wanglei
 * @Date: 2019-07-02 16:16:01
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-12-24 09:10:37
 */
'use strict'

const mongoose = require('mongoose')
const StructureServer = mongoose.model('structureserver')
const StructureDefenseTask = mongoose.model('structuredefensetask')
const Resource = mongoose.model('Resource')
const postal = require('postal')
const { influxdb } = require('../identify/influxdb/influxdb')
const { sendDataWithCookie, sendData, loginServer } = require('../server/structureServer.service')

const operateTypes = {
  add: (serverData, postDatas, cookie) =>
    sendDataWithCookie(serverData, postDatas, cookie, 'POST', '/api/warning/task/add'),
  edit: (serverData, postDatas, cookie) =>
    sendDataWithCookie(serverData, postDatas, cookie, 'POST', '/api/warning/task/edit'),
  delete: (serverData, postDatas, cookie) =>
    sendDataWithCookie(serverData, postDatas, cookie, 'POST', '/api/warning/task/delete'),
  approve: (serverData, postDatas, cookie) =>
    sendDataWithCookie(serverData, postDatas, cookie, 'POST', '/api/warning/task/approve'),
  approveinfo: (serverData, postDatas, cookie) =>
    sendDataWithCookie(serverData, postDatas, cookie, 'POST', '/api/warning/task/approveinfo'),
  mylists: (serverData, postDatas, cookie) =>
    sendDataWithCookie(serverData, postDatas, cookie, 'GET', '/api/warning/task/mylists')
}

const setPushDefenseTaskToStruct = async (serverData, task, type) => {
  const channelIds = await getAllChannelIdFromStructServer(serverData)
  const taskCondition = getTaskCondition(task)
  const response = await loginServer(serverData)
  const postDatas = {
    // TODO:改进为取值更安全的情况
    approveUserId: response.body.userInfo[0].UserID,
    taskName: task.taskName,
    taskType: task.taskType,
    judgeWarnType: '4', // 预警方式 2 发短信 | 4 声音
    judgeCase: task.reason,
    taskCondition: Object.assign(taskCondition, { analysisTaskId: channelIds })
  }
  const result = await operateTypes[type](serverData, postDatas, response.cookie)
  // 新增布控任务需要审批才能生效
  if (type === 'add') {
    const postBody = { taskId: result.data, isPass: 1 } // 0 不通过 | 1 表示不通过
    await operateTypes.approve(serverData, postBody, response.cookie)
  }
  return result
}

const setDeleteDefenseTaskToStruct = async (serverData, taskId, type) => {
  const response = await loginServer(serverData)
  const postDatas = { taskId: taskId }
  const result = operateTypes[type](serverData, postDatas, response.cookie)
  return result
}

const getDefenseTaskListsFromStruct = async serverData => {
  const response = await loginServer(serverData)
  const result = operateTypes.mylists(serverData, {}, response.cookie)
  return result
}

const getTaskCondition = task => {
  let taskCondition = {
    analysisTaskId: '',
    adStartTime: '00:00:00',
    adEndTime: '23:59:59',
    adTimeType: 'day',
    adTimeDay: '1'
  }
  return Object.assign(taskCondition, task.taskCondition)
}

const getAllChannelIdFromStructServer = async serverData => {
  const postDatas = { type: 'get' }
  const result = await sendData(serverData, postDatas)
  if (Number(result.errorCode) !== 0) {
    return ''
  }
  let channelIds = []
  for (let item of result.data) {
    channelIds.push(item.channelId)
  }
  return channelIds.join(',')
}

// 获取布控报警推送过来的数据详情
const getStructDefenseAlarmData = async ctx => {
  const data = ctx.request.body
  const { judge_result: judgeResult = [] } = data
  if (!judgeResult.length) {
    return []
  }
  let alarmData = []
  let pointsArr = []
  for (let item of judgeResult) {
    const judge = _.get(item, 'textData.business.judge', undefined)
    if (_.isUndefined(judge) || _.isNull(judge)) {
      continue
    }
    let { objectId, objectType } = judge
    // 两轮车布控报警需要将 objectType 改成两轮车的
    const rideObjectId = _.get(item, 'textData.basic.rideObjectDetail.objectId', '')
    const rideObjectType = _.get(item, 'textData.basic.rideObjectDetail.objectType', '')
    if (rideObjectId) {
      objectId = rideObjectId
    }
    if (rideObjectType) {
      objectType = rideObjectType
    }
    const taskId = _.get(item, 'textData.business.judge.judgeDetail[0].taskId', 0)
    const postDatas = { id: objectId }
    const serverIp = _.replace(ctx.ip, '::ffff:', '')
    const { port, _id: serverId } = await StructureServer.findOne({ ip: serverIp }, 'port')
      .lean()
      .exec()
    // 根据推送过来的布控任务 id，查询是否咱们平台的添加的布控任务
    const defenseTasks = await StructureDefenseTask.find({
      structServer: { $elemMatch: { serverId: serverId, taskId: taskId } }
    })
      .lean()
      .exec()
    if (defenseTasks.length === 0) {
      continue
    }
    const serverData = { server: { ip: serverIp, port: port } }
    const response = await loginServer(serverData)
    const taskResult = await operateTypes['approveinfo'](serverData, { taskId: taskId, queryType: 1 }, response.cookie)
    let taskName = Number(taskResult.errorCode) === 0 ? _.get(taskResult, 'data.taskName', '') : ''
    const result = await sendData(serverData, postDatas, 'GET', '/client/getallinfo.php')
    if (Number(result.errorCode) !== 0 || result.data.channelName === '已删除') {
      continue
    }
    const videoChannel = result.data.channelId
    const res = await Resource.findOne({ 'videoStructure.channelId': videoChannel }, '_id')
      .lean()
      .exec()
    // 过滤掉非平台绑定视频通道推送的布控报警数据
    if (_.isNull(res) || _.isUndefined(res)) {
      continue
    }
    const bigImageUrl = _.get(result, 'path')
    const smallImageUrl = _.replace(bigImageUrl, 'getimage', 'getimagethumb')
    const fieldsObject = getDefenseAlarmDataByType(objectType, result.data)
    Object.assign(fieldsObject, {
      bigImageUrl: bigImageUrl,
      smallImageUrl: smallImageUrl,
      channelName: result.data.channelName,
      resourceId: res._id + '',
      objectId: objectId,
      structServerIp: serverIp,
      defenseTaskId: `${serverIp}-${taskId}`
    })
    alarmData.push(Object.assign({}, fieldsObject, { taskName: taskName }))
    pointsArr.push({
      measurement: 'defenseAlarms',
      fields: fieldsObject,
      tags: {
        videoChannel: res._id,
        taskName: taskName
      },
      timestamp: `${Number(result.data.timestamp)}${String(process.hrtime.bigint()).slice(-6)}`
    })
  }
  if (pointsArr.length) {
    await influxdb.writePoints(pointsArr)
  }
  return alarmData
}

// 分别处理行人、车辆、两轮车的布控报警数据
const getDefenseAlarmDataByType = (type, data) => {
  let result = {}
  switch (type) {
    case 'bike':
      result = getDefenseBikeData(data)
      break
    case 'pedestrain':
      result = getDefensePedestrainData(data)
      break
    case 'vehicle':
      result = getDefenseVehicleData(data)
      break
    default:
      break
  }
  return result
}

// 获取行人的数据
const getDefensePedestrainData = data => {
  let fieldsObject = {}
  fieldsObject.guid = _.get(data, 'guid', '')
  fieldsObject.type = _.get(data, 'type', 0)
  fieldsObject.bodyRect = _.get(data, 'bodyRect', '0, 0, 0, 0')
  fieldsObject.captureTime = _.get(data, 'timestamp', 0)
  fieldsObject.outTimestamp = _.get(data, 'outTimestamp', 0)
  fieldsObject.dealWith = 0 // 未处理
  fieldsObject.ageCode = _.get(data, 'ageCode', 0)
  fieldsObject.babyCode = _.get(data, 'babyCode', 0)
  fieldsObject.bagCode = _.get(data, 'bagCode', 0)
  fieldsObject.barrowCode = _.get(data, 'barrowCode', 0)
  fieldsObject.bottomColorCode = _.get(data, 'bottomColorCode', 0)
  fieldsObject.bottomTypeCode = _.get(data, 'bottomCode', 0)
  fieldsObject.glassesCode = _.get(data, 'glassesCode', 0)
  fieldsObject.hairCode = _.get(data, 'hairCode', 0)
  fieldsObject.hatCode = _.get(data, 'hatCode', 0)
  fieldsObject.knapsackCode = _.get(data, 'knapsackCode', 0)
  fieldsObject.maskCode = _.get(data, 'maskCode', 0)
  fieldsObject.orientationCode = _.get(data, 'orientationCode', 0)
  fieldsObject.sexCode = _.get(data, 'sexCode', 0)
  fieldsObject.trolleyCaseCode = _.get(data, 'trolleyCaseCode', 0)
  fieldsObject.umbrellaCode = _.get(data, 'umbrellaCode', 0)
  fieldsObject.upperColorCode = _.get(data, 'upperColorCode', 0)
  fieldsObject.upperTextureCode = _.get(data, 'upperTextureCode', 0)
  fieldsObject.upperTypeCode = _.get(data, 'upperCode', 0)
  return fieldsObject
}

// 获取车辆的数据
const getDefenseVehicleData = data => {
  let fieldsObject = {}
  fieldsObject.guid = _.get(data, 'guid', '')
  fieldsObject.type = _.get(data, 'type', 0)
  fieldsObject.carRect = _.get(data, 'carRect', 0)
  fieldsObject.captureTime = _.get(data, 'timestamp', 0)
  fieldsObject.outTimestamp = _.get(data, 'outTimestamp', 0)
  fieldsObject.dealWith = 0 // 未处理
  fieldsObject.plateLicence = _.get(data, 'plateLicence', '未识别')
  fieldsObject.plateTypeCode = _.get(data, 'plateTypeCode', 0)
  fieldsObject.plateColorCode = _.get(data, 'plateColorCode', 0)
  fieldsObject.plateFlagCode = _.get(data, 'plateFlagCode', 0)
  fieldsObject.brandName = _.get(data, 'carStyleName', 0)
  fieldsObject.carKindCode = _.get(data, 'carKindCode', 0)
  fieldsObject.mistakeCode = _.get(data, 'mistakeCode', 0)
  fieldsObject.colorCode = _.get(data, 'colorCode', 0)
  fieldsObject.crashCode = _.get(data, 'crashCode', 0)
  fieldsObject.callCode = _.get(data, 'callCode', 0)
  fieldsObject.rackCode = _.get(data, 'rackCode', 0)
  fieldsObject.spareTireCode = _.get(data, 'spareTireCode', 0)
  fieldsObject.sunroofCode = _.get(data, 'sunroofCode', 0)
  fieldsObject.dangerCode = _.get(data, 'dangerCode', 0)
  fieldsObject.mainDriverBeltCode = _.get(data, 'mainDriverBeltCode', 0)
  fieldsObject.coDriverBeltCode = _.get(data, 'coDriverBeltCode', 0)
  fieldsObject.slagCode = _.get(data, 'slagCode', 0)
  fieldsObject.tagCode = _.get(data, 'tagCode', 0)
  fieldsObject.paperCode = _.get(data, 'paperCode', 0)
  fieldsObject.sunCode = _.get(data, 'sunCode', 0)
  fieldsObject.dropCode = _.get(data, 'dropCode', 0)
  fieldsObject.mannedCode = _.get(data, 'mannedCode', 0)
  fieldsObject.convertibleCode = _.get(data, 'convertibleCode', 0)
  return fieldsObject
}

// 获取两轮车的数据
const getDefenseBikeData = data => {
  let fieldsObject = {}
  fieldsObject.isPedestrain = _.get(data, 'isPedestrain', 0)
  return Object.assign(fieldsObject, getDefensePedestrainData(data))
}

// 删除视频结构化服务器时，同步删除其中所有的布控任务
postal.subscribe({
  channel: 'videoStructure',
  topic: 'defenseTask.delete',
  callback: async function (data, envelope) {
    try {
      const tasks = await StructureDefenseTask.find({ structServer: { $elemMatch: { serverId: data.serverId } } })
        .lean()
        .exec()
      for (let task of tasks) {
        const structServer = _.get(task, 'structServer', [])
        if (structServer.length) {
          for (let item of structServer) {
            const { taskId, serverId } = item
            if (serverId + '' !== data.serverId) {
              continue
            }
            await setDeleteDefenseTaskToStruct(data.serverData, taskId, 'delete')
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
})

module.exports = {
  setDeleteDefenseTaskToStruct,
  setPushDefenseTaskToStruct,
  getStructDefenseAlarmData,
  getDefenseTaskListsFromStruct
}
