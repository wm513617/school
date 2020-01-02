/*
 * @Author: linhang
 * @Date: 2019-04-25 11:08:15
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-18 16:03:24
 */

const redis = require('./redis')
const Role = mongoose.model('Role')
const ResProperty = mongoose.model('ResProperty')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const _ = require('lodash')
const postal = require('postal')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const { ORG_TYPE } = require('../common/constant')
const AlarmClients = mongoose.model('alarmClient')

/**
 * 将每个角色下的每个资源的权限写入redis缓存
 */
module.exports = async function writeRedis () {
  try {
    const roles = await Role.find({ _id: { $ne: '5be27279e74ee9376c681111' } }, '_id')
      .lean()
      .exec()
    // 查询所有视频通道，如果资源属于视频资源,默认有报警清除，确认权限
    const videoResProperty = ['alarmReceive', 'alarmConfirm', 'alarmClean']
    let resourceIds = await Resource.distinct('_id', { type: 0 })
    resourceIds = resourceIds.map(item => item + '')
    // 查询人脸资源，排除在外，人脸资源在角色管理里边有配置的地方
    const faceOrg = await Org.find({ type: ORG_TYPE.FACE_CAPTURE }, '_id').lean()
    let faceResIds = await OrgRes.distinct('resource', { rootorg: faceOrg._id, islane: false })
    faceResIds = faceResIds.map(item => item + '')
    resourceIds = resourceIds.filter(item => !faceResIds.includes(item))
    // 查询报警终端alrmclients关联的资源resource表，其type也为0，但是报警求助的资源有配置权限的地方
    const deviceIds = await AlarmClients.distinct('camerDevId', {})
    let alarmResIds = await Resource.distinct('_id', { eid: { $in: deviceIds } })
    alarmResIds = alarmResIds.map(item => item + '')
    resourceIds = resourceIds.filter(item => !alarmResIds.includes(item))
    // 查询权限表
    for (let role of roles) {
      const property = await ResProperty.find({ role: role._id })
        .lean()
        .exec()
      if (property.length) {
        for (let item of property) {
          if (_.isNumber(item.type)) {
            const resId = item.resource || item.id
            const key = item.role + '' + resId + item.type
            let obj = {
              properties: _.isEmpty(item.properties) ? [] : item.properties // 考虑意外情况，item.properties为null,undefined
            }
            if (resourceIds.includes(item.resource + '')) {
              obj.properties = _.uniq(obj.properties.concat(videoResProperty))
            }
            const value = JSON.stringify(obj)
            await redis.set(key, value)
          }
        }
      }
    }
    // 智能交通的报警默认拥有报警确认，接收，清除的权限
    await updateRedisByTraffic()
    console.log('报警权限写入redis缓存完成')
  } catch (err) {
    console.log(`报警权限写入redis缓存出错：${err.message}`)
  }
}
// 某个角色资源权限修改后，更新缓存
postal.subscribe({
  channel: 'role',
  topic: 'role.update',
  callback: async data => {
    await updateRedisByRoleId(data)
  }
})
// 某个角色资源权限修改后，更新缓存
const updateRedisByRoleId = async data => {
  try {
    const roleId = data.roleId
    const videoResProperty = ['alarmReceive', 'alarmConfirm', 'alarmClean']
    let resourceIds = await Resource.distinct('_id', { type: 0 })
    resourceIds = resourceIds.map(item => item + '')
    const property = await ResProperty.find({ role: roleId })
      .lean()
      .exec()
    // 查询人脸资源，排除在外，人脸资源在角色管理里边有配置的地方
    const faceOrg = await Org.findOne({ type: ORG_TYPE.FACE_CAPTURE, isroot: true }, '_id').lean()
    if (faceOrg) {
      let faceResIds = await OrgRes.distinct('resource', { rootorg: faceOrg._id, islane: false })
      faceResIds = faceResIds.map(item => item + '')
      resourceIds = resourceIds.filter(item => !faceResIds.includes(item))
    }
    // 查询报警终端alrmclients关联的资源resource表，其type也为0，但是报警求助的资源有配置权限的地方
    const deviceIds = await AlarmClients.distinct('camerDevId', {})
    let alarmResIds = await Resource.distinct('_id', { eid: { $in: deviceIds } })
    alarmResIds = alarmResIds.map(item => item + '')
    resourceIds = resourceIds.filter(item => !alarmResIds.includes(item))
    // 查询权限表
    if (property.length) {
      for (let item of property) {
        if (_.isNumber(item.type)) {
          const resId = item.resource || item.id
          const key = item.role + '' + resId + item.type
          let obj = {
            properties: _.isEmpty(item.properties) ? [] : item.properties // 考虑意外情况，item.properties为null,undefined
          }
          if (resourceIds.includes(item.resource + '')) {
            obj.properties = obj.properties.concat(videoResProperty)
          }
          const value = JSON.stringify(obj)
          await redis.set(key, value)
        }
      }
      console.log('角色资源权限改变后更新该角色的资源权限的redis缓存')
    }
  } catch (err) {
    console.log('更新缓存出错')
  }
}
// 在智能交通页面从智能交通服务器同步设备到device表时，更新缓存
postal.subscribe({
  channel: 'redis',
  topic: 'traffic.sync',
  callback: async () => {
    await updateRedisByTraffic()
  }
})

const updateRedisByTraffic = async () => {
  try {
    const roleIds = await Role.distinct('_id', { _id: { $ne: '5be27279e74ee9376c681111' } })
      .lean()
      .exec()
    // 查询所有type为traffic的设备
    const deviceIds = await Device.distinct('_id', { type: 'traffic' })
    // 智能交通的报警默认拥有报警确认，接收，清除的权限
    const propObj = {
      properties: ['alarmReceive', 'alarmConfirm', 'alarmClean']
    }
    if (!_.isEmpty(deviceIds)) {
      for (let roleId of roleIds) {
        for (let devId of deviceIds) {
          const key = roleId + '' + devId + '0'
          const value = JSON.stringify(propObj)
          redis.set(key, value)
        }
      }
    }
    console.log('更新智能交通报警权限redis缓存完成')
  } catch (err) {
    console.log('更新redis缓存出错')
  }
}
