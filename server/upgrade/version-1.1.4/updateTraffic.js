/* 智能交通接口数据结构变更，升级原有系统中英泰智数据
 * @Author: hansen.liuhao
 * @Date: 2019-08-30 09:50:13
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-30 16:38:57
 */

'use strict'
const mongoose = require('mongoose')
const TrafficLane = mongoose.model('TrafficLane')
const Device = mongoose.model('Device')
const ThirdPartyOrg = mongoose.model('ThirdPartyOrg')
const TrafficAlarmCfg = mongoose.model('TrafficAlarmCfg', new mongoose.Schema({}))

exports.upgrade = async () => {
  await update()
}
const update = async () => {
  try {
    const servers = await Device.find({ bigtype: 8, manufacturer: 'ytz' })
    const alarms = await TrafficAlarmCfg.find({}).lean()
    for (const server of servers) {
      const sid = server._id.toString()
      const lanes = await TrafficLane.find({ sid })
      const metadata = { lane: [], org: [] }
      lanes.forEach(item => {
        if (!_.find(metadata.org, { id: item.deptId })) {
          metadata.org.push({
            name: item.deptName,
            id: item.deptId,
            pid: item.deptParent,
            origin: server._id
          })
        }
      })
      metadata.org.forEach(doc => {
        if (doc.pid === doc.id) {
          doc.isroot = true
        }
        doc.type = sid
      })
      await ThirdPartyOrg.create(metadata.org)
      for (const lane of lanes) {
        const cfg = alarms.find(item => item.devcode === lane.devChnId)
        if (cfg) {
          lane.level = cfg.level
          lane.alarmaffirm = cfg.alarmaffirm
          lane.alarmtemplate = cfg.alarmtemplate
          lane.save()
        }
      }
      await TrafficAlarmCfg.deleteMany({})
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
