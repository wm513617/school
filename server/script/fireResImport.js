'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://10.111.0.230:27017/bs-security', { useNewUrlParser: true })
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/device/device.model')
require('../api/sys/resource/resource.model')
require('../api/sys/alarmCfg/fireCfg.model')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const OrgRes = mongoose.model('OrgRes')
const FireAlarmCfg = require('mongoose').model('fireAlarmCfg')
const xlsx = require('node-xlsx')
const path = require('path')
const filePath = './test4.xlsx'
// 设备信息导入
async function fireResImport () {
  try {
    const existFireReses = await Resource.find({ type: 11 }, 'name')
      .lean()
      .exec()
    const fireResNameMap = {}
    existFireReses.forEach(item => {
      fireResNameMap[item.name] = 1
    })
    // 解析文件
    const xlsxInfos = xlsx.parse(path.resolve(__dirname, filePath))
    const fireResDocs = []
    const fireCfgDocs = []
    // 获取表单资源
    xlsxInfos[0].data.shift()
    const fireResInfo = xlsxInfos[0].data
    // 拼装资源ip对于_id及机构_id
    const resIps = []
    const devIps = []
    fireResInfo.forEach(item => {
      devIps.push(item[0])
      if (item[4]) {
        resIps.push(item[4])
      }
      if (item[5]) {
        resIps.push(item[5])
      }
      if (item[6]) {
        resIps.push(item[6])
      }
      if (item[7]) {
        resIps.push(item[7])
      }
    })
    const devIpsSetArr = [...new Set(devIps)]
    const fireDevs = await Device.find({ ip: { $in: devIpsSetArr } }, '_id ip')
      .lean()
      .exec()
    // 消防主机id-ip  map
    const devIpIdMap = {}
    fireDevs.forEach(item => {
      devIpIdMap[item.ip] = item._id + ''
    })
    const resIpsSetArr = [...new Set(resIps)]
    const fireReses = await Resource.find({ ip: { $in: resIpsSetArr } }, '_id ip name')
      .lean()
      .exec()
    // 资源ip-id map
    const resIpIdNameMap = {}
    fireReses.forEach(item => {
      resIpIdNameMap[item.ip] = {
        resource: item._id + '',
        name: item.name
      }
    })
    const OrgReses = await OrgRes.find(
      { resource: { $in: fireReses.map(item => item._id) }, rootorg: '5b7bb55f62692e1bb668d6a6', islane: false },
      'resource org'
    )
      .lean()
      .exec()
    // 资源-机构map
    const OrgResMap = {}
    OrgReses.forEach(item => {
      OrgResMap[item.resource + ''] = item.org + ''
    })
    // 获取设备信息的doc
    for (var item of fireResInfo) {
      if (fireResNameMap[item.name]) {
        continue
      }
      const fireRes = {
        eid: devIpIdMap[item[0]],
        name: item[1],
        devloop: item[2],
        type: 11,
        chan: item[3],
        ip: item[0],
        mapsign: {
          signflag: true,
          signtype: 0
        },
        alarmaffirm: {
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          }
        },
        monitortype: 0,
        stream: 'main',
        status: 1,
        maxdelaytime: 300,
        minintervaltime: 300,
        level: 1,
        alarmtemplate: '5b7bb55f62692e1bb668d69b',
        isImport: true
      }
      fireResDocs.push(fireRes)
    }
    // 批量生产资源
    const fireResources = await Resource.create(fireResDocs)
    // 生成消防资源与机构的关系
    const fireResOrgs = []
    fireResources.forEach(item => {
      const orgRes = {
        islane: false,
        rootorg: '5b7bb55f62692e1bb668d6a6',
        resource: item._id + '',
        org: '5bf15f13d24fff2030542b96',
        isImport: true
      }
      fireResOrgs.push(orgRes)
    })
    await OrgRes.create(fireResOrgs)
    // 已创建的消防资源ip-id
    const createResChanIdMap = {}
    fireResources.forEach(item => {
      createResChanIdMap[item.chan] = item._id + ''
    })
    for (let item of fireResInfo) {
      if (!item[4] && !item[5] && !item[6] && !item[7]) {
        continue
      }
      const fireCfg = {
        resource: createResChanIdMap[item[3]],
        actionVideo: []
      }
      const action = {
        mainCamera: true,
        client: true,
        videoWall: false,
        electronicMap: true,
        record: true,
        isImport: true
      }
      if (item[4]) {
        action.resource = resIpIdNameMap[item[4]].resource
        action.channelName = resIpIdNameMap[item[4]].name
        action.orgId = OrgResMap[resIpIdNameMap[item[4]].resource]
        fireCfg.actionVideo.push(action)
      }
      if (item[5]) {
        action.resource = resIpIdNameMap[item[5]].resource
        action.channelName = resIpIdNameMap[item[5]].name
        action.orgId = OrgResMap[resIpIdNameMap[item[5]].resource]
        fireCfg.actionVideo.push(action)
      }
      if (item[6]) {
        action.resource = resIpIdNameMap[item[6]].resource
        action.channelName = resIpIdNameMap[item[6]].name
        action.orgId = OrgResMap[resIpIdNameMap[item[6]].resource]
        fireCfg.actionVideo.push(action)
      }
      if (item[7]) {
        action.resource = resIpIdNameMap[item[7]].resource
        action.channelName = resIpIdNameMap[item[7]].name
        action.orgId = OrgResMap[resIpIdNameMap[item[7]].resource]
        fireCfg.actionVideo.push(action)
      }
      fireCfgDocs.push(fireCfg)
    }
    await FireAlarmCfg.create(fireCfgDocs)
  } catch (error) {
    console.log(error)
  }
}
fireResImport()
  .then(() => {
    process.exit(1)
  })
  .catch(err => {
    console.log(err)
  })
