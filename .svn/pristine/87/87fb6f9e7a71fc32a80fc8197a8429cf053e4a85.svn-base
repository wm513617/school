'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://10.111.0.230:27017/bs-security', { useNewUrlParser: true })
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/org/org.model')
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/device/device.model')
require('../api/sys/resource/resource.model')
require('../api/sys/alarmCfg/fireCfg.model')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const FireAlarmCfg = require('mongoose').model('fireAlarmCfg')
const xlsx = require('node-xlsx')
const path = require('path')
const filePath = './test2.xlsx'
// 设备信息导入
async function fireResImport () {
  try {
    const existFireReses = await Resource.find({ type: 11 }, 'devloop chan name').lean().exec()
    const fireDevloopChanMap = {}
    existFireReses.forEach(item => {
      fireDevloopChanMap[item.devloop + '-' + item.chan] = 1
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
    const orgNames = []
    const resDevloopChanOrgNameMap = {}
    fireResInfo.forEach(item => {
      devIps.push(item[1])
      orgNames.push(item[0])
      resDevloopChanOrgNameMap[item[3] + '-' + item[4]] = item[0]
      if (item[5]) { resIps.push(item[5]) }
      if (item[6]) { resIps.push(item[6]) }
      if (item[7]) { resIps.push(item[7]) }
      if (item[8]) { resIps.push(item[8]) }
    })
    const devIpsSetArr = [...new Set(devIps)]
    const fireDevs = await Device.find({ ip: { $in: devIpsSetArr } }, '_id ip').lean().exec()
    // 消防主机id-ip  map
    const devIpIdMap = {}
    fireDevs.forEach(item => {
      devIpIdMap[item.ip] = item._id + ''
    })
    const resIpsSetArr = [...new Set(resIps)]
    const linkReses = await Resource.find({ ip: { $in: resIpsSetArr } }, '_id ip name').lean().exec()
    // 资源ip-id map
    const linkResIpIdNameMap = {}
    linkReses.forEach(item => {
      linkResIpIdNameMap[item.ip] = {
        resource: item._id + '',
        name: item.name
      }
    })
    // 机构名称-机构id map
    const orgNameIdMap = {}
    const orgNamesSetArr = [...new Set(orgNames)]
    const orgs = await Org.find({ name: { $in: orgNamesSetArr } }, '_id name').lean().exec()
    orgs.forEach(item => {
      orgNameIdMap[item.name] = item._id + ''
    })
    // 资源名称-机构id map
    const resDevloopChanOrgIdMap = {}
    for (let item in resDevloopChanOrgNameMap) {
      resDevloopChanOrgIdMap[item] = orgNameIdMap[resDevloopChanOrgNameMap[item]]
    }
    const OrgReses = await OrgRes.find({ resource: { $in: linkReses.map(item => item._id) }, rootorg: '5b7bb55f62692e1bb668d6a6', islane: false }, 'resource org').lean().exec()
    // 资源-机构map
    const OrgResMap = {}
    OrgReses.forEach(item => {
      OrgResMap[item.resource + ''] = item.org + ''
    })
    // 获取设备信息的doc
    for (let item of fireResInfo) {
      if (fireDevloopChanMap[item[3] + '-' + item[4]]) { continue }
      const fireRes = {
        eid: devIpIdMap[item[1]],
        name: item[2],
        devloop: item[3],
        type: 11,
        chan: item[4],
        ip: item[1],
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
        alarmtemplate: '5b7bb55f62692e1bb668d68c',
        isImport: true
      }
      fireResDocs.push(fireRes)
    }
    // 批量生产资源
    const fireResources = await Resource.create(fireResDocs)
    // 合并生成的消防资源和已存在的消防资源
    const mergeFireResources = fireResources && fireResources.length ? [...fireResources, ...existFireReses] : existFireReses
    // 获取已存在的orgres
    const orgIdsArr = []
    for (let item in orgNameIdMap) {
      orgIdsArr.push(orgNameIdMap[item])
    }
    const existOrgRes = await OrgRes.find({ org: { $in: orgIdsArr } }).lean().exec()
    const existResOrgMap = {}
    existOrgRes.forEach(item => {
      existResOrgMap[item.resource + ''] = 1
    })

    // 生成消防资源与机构的关系
    const fireResOrgs = []
    //   if(fireResources && fireResources.length) {
    for (let item of mergeFireResources) {
      if (existResOrgMap[item._id + '']) { continue }
      const orgRes = {
        islane: false,
        rootorg: '5b7bb55f62692e1bb668d6a6',
        resource: item._id + '',
        org: resDevloopChanOrgIdMap[item.devloop + '-' + item.chan] || '5b7bb55f62692e1bb668d6a6',
        isImport: true
      }
      fireResOrgs.push(orgRes)
    }
    await OrgRes.create(fireResOrgs)
    //   }
    // 创建的消防资源name-id
    const createResDevloopChanIdMap = {}
    mergeFireResources.forEach(item => {
      createResDevloopChanIdMap[item.devloop + '-' + item.chan] = item._id + ''
    })
    // 获取已存在的联动配置

    const existFireCfgs = await FireAlarmCfg.find({}).populate({ path: 'resource', select: 'name devloop chan' }).lean().exec()
    const fireCfgResDevloopChanMap = {}
    existFireCfgs.length && existFireCfgs.forEach(item => {
      fireCfgResDevloopChanMap[item.devloop + '-' + item.chan] = 1
    })
    for (let item of fireResInfo) {
      if (fireCfgResDevloopChanMap[item[3] + '-' + item[4]]) { continue }
      if (!item[5] && !item[6] && !item[7] && !item[8]) { continue }
      const fireCfg = {
        resource: createResDevloopChanIdMap[item[3] + '-' + item[4]],
        actionVideo: [],
        isImport: true
      }
      const action = {
        mainCamera: true,
        client: true,
        videoWall: false,
        electronicMap: true,
        record: true
      }
      if (item[5]) {
        action.resource = linkResIpIdNameMap[item[5]].resource
        action.channelName = linkResIpIdNameMap[item[5]].name
        action.orgId = OrgResMap[linkResIpIdNameMap[item[5]].resource]
        fireCfg.actionVideo.push(action)
      }
      if (item[6]) {
        action.resource = linkResIpIdNameMap[item[6]].resource
        action.channelName = linkResIpIdNameMap[item[6]].name
        action.orgId = OrgResMap[linkResIpIdNameMap[item[6]].resource]
        fireCfg.actionVideo.push(action)
      }
      if (item[7]) {
        action.resource = linkResIpIdNameMap[item[7]].resource
        action.channelName = linkResIpIdNameMap[item[7]].name
        action.orgId = OrgResMap[linkResIpIdNameMap[item[7]].resource]
        fireCfg.actionVideo.push(action)
      }
      if (item[8]) {
        action.resource = linkResIpIdNameMap[item[8]].resource
        action.channelName = linkResIpIdNameMap[item[8]].name
        action.orgId = OrgResMap[linkResIpIdNameMap[item[8]].resource]
        fireCfg.actionVideo.push(action)
      }
      fireCfgDocs.push(fireCfg)
    }
    await FireAlarmCfg.create(fireCfgDocs)
  } catch (error) {
    console.log(error)
  }
}
fireResImport().then(() => {
  process.exit(1)
}).catch((err) => {
  console.log(err)
})
