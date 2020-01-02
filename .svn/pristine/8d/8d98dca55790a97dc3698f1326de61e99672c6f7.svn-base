'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/bs-security')
require('../api/sys/org/org.model')
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/resource/resource.model')
require('../api/platform/server.model')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
const PlatformServer = mongoose.model('PlatformServer')
const Promise = require('bluebird')
const { generateDevieId } = require('../api/platform/generateNum')

const syncGb = async () => {
  try {
    console.log('tranform data start')
    const locServer = await PlatformServer.findOne({ type: 'loc' }).exec()
    // 只做视频资源 和报警输入资源
    const ress = await Resource.find({ type: { $in: [0, 9] } }, '_id type').exec()
    const ipcRes = []
    const alarmIn = []
    ress.forEach(n => {
      n.type ? alarmIn.push(n._id) : ipcRes.push(n._id)
    })

    // 资源编码字典,ipc和报警同属资源可以用同一个字典
    const resDict = []
    const resIds = [] // 资源id集合

    // 生成ipc 编码集合
    const ipcNums = await generateDevieId('ipc', ipcRes.length)
    ipcRes.forEach((n, i) => {
      resDict[n._id + ''] = ipcNums[i]
      resIds.push(n._id + '')
    })

    // 生成alarmIn 编码集合
    const alarmNums = await generateDevieId('alarmIn', alarmIn.length)
    alarmIn.forEach((n, i) => {
      resDict[n._id + ''] = alarmNums[i]
      resIds.push(n._id + '')
    })

    // 生成机构编码
    // 这里只取现场视频机构
    const orgDict = {} // 机构编码字典
    const orgs = await Org.find({ type: 0 }, '_id pid isroot').exec()
    const orgNums = await generateDevieId('org', orgs.length)
    orgs.forEach((n, i) => {
      orgDict[n._id + ''] = orgNums[i]
    })

    // 更新集合
    const promiselist = []

    // 添加机构更新集
    orgs.forEach(n => {
      promiselist.push(
        Org.findByIdAndUpdate(n._id, {
          // gbParentDevId: n.isroot ? locServer.serverId : orgDict[n.pid + ''], // 根节点去国标设备平台服务器Id
          gbParentDevId: orgDict[n.pid + ''] || locServer.serverId.substr(10),
          gbDevId: orgDict[n._id + '']
        })
      )
    })
    // 添加资源更新集
    const orgres = await OrgRes.find({ resource: { $in: resIds } }, 'org resource')
      .lean()
      .exec()
    orgres.forEach(n => {
      if (orgDict[n.org + ''] && resDict[n.resource + '']) {
        promiselist.push(
          Resource.findByIdAndUpdate(n.resource, {
            gbParentDevId: orgDict[n.org + ''], // 根节点去国标设备平台服务器Id
            gbDevId: resDict[n.resource + '']
          })
        )
      }
    })
    await Promise.all(promiselist)
    console.log('gbDevice init finished !')
    process.exit(1)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
syncGb()
