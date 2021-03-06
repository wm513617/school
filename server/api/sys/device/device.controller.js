/*
 * 设备接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:48:21
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-27 15:50:18
 */

'use strict'

const mongoose = require('mongoose')
const Device = mongoose.model('Device')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
const OrgAlarm = mongoose.model('OrgAlarm')
const AlarmTimeTemplate = mongoose.model('alarmTimeTemplate')
const _ = require('lodash')
// const request = require('request')
const tool = require('../../../common/tools')
const paging = require('../../paging')
const rp = require('../../bstar/req').req
const wallInterface = require('../../bstar/tvwall.interface')
const postal = require('postal')
const xlsx = require('node-xlsx')
const DeviceAlarm = mongoose.model('DeviceAlarm')
const IntelligentAlarm = mongoose.model('IntelligentAlarm')
const MonitoryPointAlarm = mongoose.model('MonitoryPointAlarm')
const Origin = mongoose.model('Origin')
const { handleSysException } = tool
const User = mongoose.model('User')
const ResProperty = mongoose.model('ResProperty')
const {
  devOnlineList,
  devLogin,
  devLogout,
  syncOnlineList,
  getDevinfo,
  getDevConf,
  fireAlarmChange,
  getKDFireAlarmList,
  syncOnlineRedisList
} = require('../../bstar/dev.interface')
const Rtsp = require('../../../common/rtsp')
const { getServer } = require('../../bstar/server.interface')
const rtspServer = new Rtsp()
const fs = require('fs')
const { ORG_TYPE, DEV_TYPE } = require('../../../common/constant')
const { res } = require('../../platform/generateNum')
const Role = mongoose.model('Role')
const moment = require('moment')
// 修改某个设备信息
exports.updateOne = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('设备管理-修改设备'))
  const deviceId = ctx.params.id
  try {
    // 修改设备 没必要查机构吧 20190417 2.0修改 去掉
    // const org = await Org.findById(ctx.request.body.oid).exec()
    // if (_.isEmpty(org)) {
    //   return ctx.throw(404, { code: 1003, message: '该机构不存在' })
    // }
    let flag = false
    const resList = await Device.find({ ip: ctx.request.body.ip, cport: ctx.request.body.cport })
    resList.forEach(item => {
      if (item && item._id + '' !== ctx.params.id + '') {
        flag = true
      }
    })
    if (flag) {
      return ctx.throw(500, { code: 1003, message: '该设备已存在' })
    }
    const oldDevice = await Device.findById(deviceId).exec()
    const { ip, intelligent, cport } = ctx.request.body
    const newDevice = await Device.findByIdAndUpdate(deviceId, ctx.request.body, { new: true }).exec()
    // 更新设备下资源信息
    await Resource.updateMany({ eid: deviceId }, { $set: { ip: ip, intelligent: intelligent, port: cport } })
    // 0：视频通道 1：报警输入 2：报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7: 解码报警输入 8:解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区
    // 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区 ,15 拼接输入通道
    // 判断是否有修改资源数量 并添加新的资源
    // 0：视频设备1：报警主机2：门禁设备3：ip对讲4：巡更设备5：解码器6：网络键盘,7：消防主机, 8:智能交通, 9:拼接控制器
    let resourceTypeList = {
      0: [
        { type: 0, name: '视频通道', field: 'ipcount' }, // ipcount
        { type: 1, name: '报警输入', field: 'defenseicount' }, // defenseicount
        { type: 2, name: '报警输出', field: 'defenseocount' } // defenseocount
      ],
      1: [
        { type: 10, name: '报警防区', field: 'defenseicount' }, // defenseicount //是董强翁_报警输出_通道1   是董强翁_报警防区_通道1
        { type: 11, name: '报警输出', field: 'defenseocount' } // defenseocount //是董强翁_报警输出_通道1   是董强翁_报警防区_通道1
      ],
      5: [
        { type: 7, name: '报警防区', field: 'defenseicount' }, // defenseicount
        { type: 8, name: '报警输出', field: 'defenseocount' }, // defenseocount
        { type: 5, name: '解码通道', field: 'decodecount' }, // decodecount
        { type: 6, name: '音频通道', field: 'voicecount' } // voicecount
      ],
      9: [
        { type: 15, name: '输入源', field: 'jointinputcount' } // jointinputcount
      ]
    }
    let addResList = []
    let videoList = [] // 专为视频通道定义数组，为了加国标字段
    if (resourceTypeList[newDevice.bigtype]) {
      // 修改需要新加 资源的走
      for (let index = 0; index < resourceTypeList[newDevice.bigtype].length; index++) {
        let element = resourceTypeList[newDevice.bigtype][index]
        let chanList = []
        for (let index = 1; index <= Number(newDevice[element.field]); index++) {
          chanList.push(index)
        }
        let res = await Resource.find({ eid: newDevice._id, type: element.type }) // 查询已有的资源通道
        let exist = res.map(item => {
          return item.chan
        })
        for (const item of chanList) {
          if (!exist.includes(item)) {
            let id
            if (element.type === 0) {
              // 视频资源才需要id
              id = rtspServer.getUnusedIds()
            }
            let obj = {
              eid: newDevice._id,
              chan: item,
              type: element.type,
              ip: newDevice.ip,
              port: newDevice.cport,
              intelligent: newDevice.intelligent,
              name: `${newDevice.name}_${element.name}_通道${item}`,
              pinyin: tool.transferPinyin(`${newDevice.name}_${element.name}_通道${item}`)
            }
            if (element.type === 0) {
              obj.rtsp = {
                main: `rtsp://ip:port/main/id=${id}`,
                sub: `rtsp://ip:port/sub/id=${id}`
              }
            }
            let alarmt = [1, 2, 10, 11, 7, 8]
            if (alarmt.includes(element.type)) {
              const alarmTemplateRes = await AlarmTimeTemplate.findOne({}, '_id').lean()
              if (alarmTemplateRes._id) {
                obj.alarmtemplate = alarmTemplateRes._id
              }
              obj.level = 1 // 级别
              // obj.alarmtype 报警分类 2.0 版本去掉了 与林航确认
            }
            if (element.type === 0) {
              videoList.push(obj)
            } else {
              addResList.push(obj) // 所有要生成的资源 都放在这个数组里
            }
          }
        }
      }
    }
    let gbDevIdOrg = await Org.findOne({ _id: newDevice.oid }, 'gbDevId')
    videoList = await res(videoList, gbDevIdOrg.gbDevId) // 给视频资源添加国标字段
    await Resource.insertMany([...addResList, ...videoList]) // 添加资源
    await Resource.updateMany({ eid: deviceId }, { ip, intelligent }, { multi: true })
    const alterData = tool.filterAlterData(oldDevice.toObject(), newDevice.toObject())
    const noticeCon = ['username', 'ip', 'password', 'cport', 'manufacturer', 'accessServerIp']
    const sameData = tool.filterData(alterData, noticeCon)
    if (sameData.length) {
      postal.publish({
        channel: 'devices',
        topic: 'item.notice',
        data: {
          ctx: ctx,
          data: {
            module: 'dev',
            varyData: [
              {
                before: {
                  devIp: oldDevice.ip + '',
                  devPort: +oldDevice.cport
                },
                after: {
                  devIp: newDevice.ip + '',
                  devPort: +newDevice.cport
                }
              }
            ],
            newData: []
          }
        }
      })
    }
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
exports.synchronousFire = async ctx => {
  try {
    await fireControlKdfireSync(ctx)
    ctx.body = { message: '国创设备同步成功' }
  } catch (err) {
    return ctx.throw(500, { code: 1019, message: '国创设备同步失败' })
  }
}
// 国创消防数据同步
let fireControlKdfireSync = async ctx => {
  try {
    // let typeFilter = ['温感', '烟感', '手报', '消防栓']
    let typeFilter = {
      温感: 'temperature',
      烟感: 'smoke',
      手报: 'handNewspaper',
      消报: 'hydrant'
    }
    let addFire = async arr => {
      // 新增设备
      let frieArr = []
      let orgRes = []
      let alarmtimetemplates = await AlarmTimeTemplate.findOne({ name: '全天24小时' }, '_id')
      let orgRoot = await Org.findOne({ type: 0, isroot: true })
      for (const iterator of arr) {
        frieArr.push({
          updateTime: iterator.updateTime,
          fireBuildingStructureId: iterator.fireBuildingStructureId,
          fireBuildingStructureName: iterator.location,
          fireControlId: iterator.id,
          name: iterator.name,
          // orgId: orgRoot._id,
          eid: iterator.eid,
          alarmtemplate: alarmtimetemplates._id,
          level: 1,
          type: 11,
          subtype: typeFilter[iterator.fcFacilitiesCategoryName]
        })
      }
      let resource = await Resource.insertMany(frieArr)
      for (const iterator of resource) {
        orgRes.push({
          org: orgRoot._id,
          resource: iterator._id,
          rootorg: orgRoot._id
        })
      }
      await OrgRes.insertMany(orgRes)
    }
    let manufacturer = ctx.request.body.manufacturer || 'kdfire' // 没有参数就是同步
    let fireDevice = await Device.find({ manufacturer: manufacturer, bigtype: 7 }, '_id ip cport')
    if (!fireDevice.length) {
      ctx.throw(500, { code: 1019, message: '请先添加设备' })
    }
    let arr = []
    for (const iterator of fireDevice) {
      arr.push(getKDFireAlarmList({ devIp: iterator.ip, devPort: iterator.cport }))
    }
    let resultAlarmList = await Promise.all(arr)
    let alarmListObj = {} // 接口返回数据
    // let typeFilterArr = Object.keys(typeFilter)
    for (let index = 0; index < resultAlarmList.length; index++) {
      const element = JSON.parse(resultAlarmList[index])
      if (element.status === 200) {
        for (const item of element.data) {
          // if (!typeFilterArr.includes(item.fcFacilitiesCategoryName)) { continue } // 不是这四种类型过滤掉
          item.eid = fireDevice[index]._id
          alarmListObj[item.id] = item
        }
      }
    }
    let resourceFire = await Resource.find({ type: 11, fireControlId: { $exists: true } })
    if (!resourceFire.length) {
      // 数据库无数据直接添加吧
      let addArr = []
      for (const key in alarmListObj) {
        addArr.push(alarmListObj[key])
      }
      await addFire(addArr)
      return
    }
    let resourceFireObj = {} // mongdb 数据
    for (const item of resourceFire) {
      resourceFireObj[item.fireControlId] = item
    }
    let addArr = []
    for (const key in alarmListObj) {
      if (resourceFireObj[key]) {
        // 两边都有看是否有过更新
        if (moment(alarmListObj[key].updateTime).unix() > moment(resourceFireObj[key].updateTime).unix()) {
          // 数据有过更新 需要同步
          let fire = alarmListObj[key]
          // 更新下建筑id、建筑名称、更新时间、
          await Resource.updateOne(
            { _id: resourceFireObj[key]._id },
            {
              $set: {
                updateTime: fire.updateTime,
                fireBuildingStructureId: fire.fireBuildingStructureId,
                fireBuildingStructureName: fire.location
              }
            }
          )
        }
      } else {
        // 这里面是需要新增的设备
        addArr.push(alarmListObj[key])
      }
    }
    // 调用添加
    await addFire(addArr)
    let removeId = []
    for (const key in resourceFireObj) {
      if (!alarmListObj[key]) {
        // 这是需要删除的数据
        removeId.push(resourceFireObj[key]._id)
      }
    }
    await Resource.remove({ type: 11, _id: { $in: removeId } })
    await OrgRes.remove({ resource: { $in: removeId } })
  } catch (err) {
    console.error(err)
    ctx.throw(500, { code: 1019, message: '国创设备同步失败' })
  }
}
// 添加设备
exports.add = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-添加设备'))
  delete ctx.request.body._id
  let newDevice
  try {
    const org = await Org.findById(ctx.request.body.oid).exec()
    if (_.isEmpty(org)) {
      return ctx.throw(404, { code: 1003, message: '该机构不存在' })
    }
    if (org.shareType) {
      return ctx.throw(500, { code: 1019, message: '下联机构不能添加设备' })
    }
    const rst = await Device.countDocuments({ ip: ctx.request.body.ip, cport: ctx.request.body.cport }).exec()
    if (rst) {
      return ctx.throw(500, { code: 1019, message: '该设备已存在' })
    }
    if (Number(ctx.request.body.bigtype) === 7) {
      // 消防主机不予许添加不同厂家设备
      let fireDevice = await Device.findOne({ bigtype: 7 })
      if (fireDevice) {
        fireDevice = await Device.findOne({ manufacturer: ctx.request.body.manufacturer, bigtype: 7 })
        if (!fireDevice) {
          // 消防主机有数据 没有当前添加厂商则不允许添加
          return ctx.throw(500, { code: 1019, message: '不支持不同厂家的设备同时添加' })
        }
      }
    }
    newDevice = await Device.create(ctx.request.body) // 添加设备
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'dev',
          varyData: [],
          newData: [
            {
              devIp: newDevice.ip + '',
              devPort: +newDevice.cport
            }
          ]
        }
      }
    })
    // 如果是拼接控制器，获取拼接控制器得输入源
    // if (ctx.request.body.bigtype === 9) {
    //   try {
    //     const jointInfo = await getJointInput(ctx, { devIp: ctx.request.body.ip, devPort: Number(ctx.request.body.cport) })
    //     ctx.request.body.jointinputcount = jointInfo.carStateInfoArr && jointInfo.carStateInfoArr.length
    //   } catch (error) {
    //     ctx.throw(500, { code: error.error, message: '请求第三方接口异常', type: 'sys' })
    //   }
    // }
    // 操作机构表
    await Resource.insertPatch(newDevice, ctx.request.body, rtspServer, org.gbDevId) // 批量生成多个资源
    // 若添加解码设备，需更新拼接源
    if (newDevice.bigtype === DEV_TYPE.DECODER) {
      const origin = await Origin.find({}, '_id').exec()
      const decodes = await Resource.find({ oid: newDevice._id }, '_id').exec()
      // 拼接源存在的情况下更新
      if (origin) {
        const oriArr = []
        decodes.forEach(item => {
          oriArr.push({ decodechan: item._id })
        })
        Origin.create()
      }
    }
    ctx.status = 201
    ctx.body = [newDevice._id]
  } catch (err) {
    console.log(err)
    if (newDevice) {
      // 删除设备和对应的资源
      await Device.findByIdAndRemove(newDevice._id).exec()
      await Resource.deleteMany({ eid: newDevice._id }).exec()
    }
    handleSysException(err)
  }
}
// 批量添加设备
exports.insertPatch = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-批量添加设备'))
    var retIds = []
    const data = ctx.request.body
    const org = await Org.findById(data[0].oid).exec()
    if (_.isEmpty(org)) {
      return ctx.throw(404, { code: 1003, message: '该机构不存在' })
    }
    // if (org.isroot) {   // 如果是根机构
    //   return ctx.throw(404, { code: 1004, message: '根机构不允许直接操作' })
    // }
    let newDevice

    for (var item of data) {
      const rst = await Device.countDocuments({ ip: item.ip, cport: item.cport }).exec()
      if (rst) {
        ctx.throw(500, { code: 1019, message: `设备:${item.name},设备已存在` })
        break
      }
      const rst2 = await Device.countDocuments({ name: item.name }).exec()
      if (rst2) {
        ctx.throw(500, { code: 1020, message: `设备:${item.name},设备名称已存在` })
        break
      }
      newDevice = await Device.create(item) // 添加设备
      // 操作机构表
      retIds.push(newDevice._id)
      await Resource.insertPatch(newDevice, item, rtspServer) // 批量生成多个资源
      // 根据设备通道数量批量生成资源
      postal.publish({
        channel: 'devices',
        topic: 'item.notice',
        data: {
          ctx: ctx,
          data: {
            module: 'dev',
            varyData: [],
            newData: [
              {
                devIp: newDevice.ip + '',
                devPort: +newDevice.cport
              }
            ]
          }
        }
      })
    }
    ctx.status = 200
    ctx.body = retIds
  } catch (err) {
    handleSysException(err)
  }
}

// 获取各个设备名称
exports.names = async (ctx, next) => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-获取设备名称'))
    const names = await Device.distinct('name').exec()
    ctx.body = _.isEmpty(names) ? [] : names
  } catch (err) {
    handleSysException(err)
  }
}
// 获取设备列表(是否显示子机构设备: query参数never)
exports.getAll = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-获取设备列表'))
  let allChildrenIds = []
  let errMsg
  if (!ctx.query.oid) {
    ctx.throw(404, { code: 1010, message: '请求参数不能为空' })
  }
  try {
    try {
      // syncOnlineList()
      syncOnlineRedisList()
    } catch (error) {
      // 将所有设备置为离线
      const devIds = (await Device.find('_id').exec()).map(item => item._id + '')
      Device.updateMany({ _id: { $in: devIds } }, { status: false }).exec()
      errMsg = '同步设备状态接口调用异常，设备状态同步失败!'
    }
    const query = { bigtype: ctx.query.bigtype }
    if (parseInt(ctx.query.never) === -1) {
      // 如果传入机构：oid
      const orgs = await Org.find({ type: ORG_TYPE.LOCALE }, '_id name pid')
        .sort('order')
        .exec() // -devices
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
      allChildrenIds.unshift(ctx.query.oid + '')
      query.oid = {
        $in: allChildrenIds
      }
    } else {
      query.oid = ctx.query.oid
    }
    if (ctx.query.seek) {
      if (ctx.query.seek.match(/\./)) {
        ctx.query.seek = ctx.query.seek.replace(/\./, '\\.')
      }
      query.$or = [{ ip: { $regex: ctx.query.seek + '' || '' } }, { name: { $regex: ctx.query.seek + '' || '' } }]
    } else {
      if (typeof ctx.query.status !== 'undefined') {
        query.status = Boolean(Number(ctx.query.status))
      }
    }
    // query.shareServer = { $exists: false }
    query.type = { $nin: ['alarmBox', 'alarmPillar'] }
    const resultObj = await paging.listQuery(
      Device,
      query,
      '',
      'order',
      ctx.query.page,
      { path: 'oid', select: '_id name' },
      ctx
    )
    // 同步报警主机设备报警状态
    // if (Number(ctx.query.bigtype) === 1 && ctx.query.module === 'alarmHost') {
    //   try {
    //     const res = []
    //     const deviceAlarms = await alarmStatus(ctx, { devIp: 'shike', devPort: 2302 })
    //     for (let item1 of resultObj.results) {
    //       for (let item2 of deviceAlarms) {
    //         // if (ctx.query.alarmStatus) {
    //         //   if (ctx.query.alarmStatus === item2.armStatus && item1.ip === item2.devIp && item1.cport === item2.devPort) {
    //         //     item1._doc.alarmStatus = item2.armStatus
    //         //     res.push(item1)
    //         //   }
    //         // } else {
    //         // if (item1.ip === item2.devIp && item1.cport === item2.devPort) {
    //         //   item1._doc.alarmStatus = item2.armStatus || ''
    //         //   res.push(item1)
    //         // }
    //         if (item1.ip === item2.devIp) {
    //           item1._doc.alarmStatus = item2.armStatus || ''
    //           res.push(item1)
    //         }
    //       }
    //     }
    //     resultObj.results = res
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

    ctx.body = { devList: _.isEmpty(resultObj.results) ? [] : resultObj.results, errMsg }
  } catch (err) {
    handleSysException(err)
  }
}
// 获取单个设备
exports.getOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-获取单个设备'))
    const result = await Device.findById(ctx.params.id).exec()
    ctx.body = _.isEmpty(result) ? {} : result
  } catch (err) {
    handleSysException(err)
  }
}
// 设备移动
exports.moveDevice = async ctx => {
  try {
    const oid = ctx.request.body.oid
    const _ids = ctx.request.body._ids
    const org = await Org.findById(oid).exec()
    if (org.shareType) {
      return ctx.throw(500, { code: 1019, message: '设备不能移动下联机构' })
    }
    if (!oid && _ids) {
      ctx.throw(404, { code: 1010, message: '请求参数不能为空' })
    }
    await Device.updateMany({ _id: { $in: _ids } }, { oid }).exec()
    // 设备移动后，设备报警相应移动
    await DeviceAlarm.updateMany({ eid: { $in: _ids } }, { orgId: oid })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 获取设备树
exports.getDeviceTree = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-获取设备树'))
  let allChildrenIds = []
  let orgs = []
  !ctx.query.oid && (ctx.query.oid = ctx.state.user.orgId)
  try {
    orgs = await Org.find({ type: ctx.query.orgtype || ORG_TYPE.LOCALE })
      .lean()
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid + '')
    orgs = await Org.find({ _id: { $in: allChildrenIds } })
      .sort({ order: -1 })
      .lean()
      .exec()
    const orgTemp = new Array(orgs.length)
    _.fill(orgTemp, { _doc: { isOrg: true } })
    _.merge(orgs, orgTemp)
    const devices = await Device.find(
      { oid: { $in: orgs.map(org => org._id + '') }, bigtype: ctx.query.bigtype || DEV_TYPE.VIDEO },
      '_id name status oid'
    )
      .sort('name')
      .lean()
      .exec()
    const devTemp = new Array(devices.length)
    _.fill(devTemp, { _doc: { equip: true } })
    _.merge(devices, devTemp)
    const devMapping = {}
    devices.forEach(dev => {
      !devMapping[dev.oid + ''] && (devMapping[dev.oid + ''] = [])
      devMapping[dev.oid + ''] = [...devMapping[dev.oid + ''], dev]
    })
    orgs.forEach(org => {
      !org.children && (org.children = [])
      devMapping[org._id + ''] && (org.children = [...org.children, ...devMapping[org._id + '']])
    })
    const treeDatas = tool.transData2Tree(orgs, '_id', 'pid', true)
    ctx.body = _.isEmpty(treeDatas) ? {} : treeDatas[0]
  } catch (err) {
    handleSysException(err)
  }
}
// 获取设备树2.0
exports.getDeviceTreeNew = async ctx => {
  try {
    let allChildrenIds = []
    let orgs = []
    orgs = await Org.find({ type: ORG_TYPE.LOCALE }, 'name isroot pid type')
      .sort({ order: -1 })
      .lean()
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid)
    orgs = orgs.filter(org => allChildrenIds.includes(org._id + ''))
    orgs.forEach(org => {
      org = Object.assign(org, { isOrg: true })
    })
    const orgIds = orgs.map(org => org._id + '')
    const devices = await Device.find(
      {
        oid: { $in: orgIds },
        bigtype: ctx.query.bigtype || DEV_TYPE.VIDEO,
        type: { $nin: ['alarmBox', 'alarmPillar'] }
      },
      '_id name status oid'
    )
      .lean()
      .exec()
    devices.forEach(dev => {
      dev = Object.assign(dev, { equip: true })
    })
    // 给机构添加children字段
    orgs.forEach(org => {
      org.children = []
      devices.forEach(device => {
        if (device.oid + '' === org._id + '') {
          org.children.push(device)
        }
      })
    })
    orgs = tool.deleteNoChildrenOrgs(orgs)
    const treeDatas = tool.transData2Tree(orgs, '_id', 'pid', true)
    let deviceTree = _.isEmpty(treeDatas) ? {} : treeDatas[0]
    ctx.body = deviceTree
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 用户管理模块-角色管理获取机构设备资源树
 */
exports.getChannelTree = async ctx => {
  try {
    let orgs = await Org.find({ type: ctx.query.orgtype }, 'name pid isroot')
      .sort({ order: -1 })
      .lean()
      .exec()
    const orgids = orgs.map(org => org._id)
    let devices = await Device.find({ oid: { $in: orgids }, bigtype: ctx.query.bigtype }, 'name oid')
      .lean()
      .exec()
    const devids = []
    devices.forEach(item => {
      devids.push(item._id)
      Object.assign(item, { equip: true })
    })
    const resources = await Resource.find({ eid: { $in: devids }, type: ctx.query.channeltype }, 'name eid')
      .lean()
      .exec()
    const resMap = {}
    resources.forEach(res => {
      !resMap[res.eid] && (resMap[res.eid] = [])
      resMap[res.eid].push(res)
    })
    // 过滤没有资源的设备
    devices = devices.filter(item => resMap[item._id])
    const devMap = {}
    devices.forEach(dev => {
      !devMap[dev.oid] && (devMap[dev.oid] = [])
      devMap[dev.oid].push(dev)
    })
    orgs.forEach(org => {
      org.isOrg = true
      if (devMap[org._id]) {
        devMap[org._id].forEach(dev => {
          dev.children = resMap[dev._id]
        })
      }
      org.children = devMap[org._id] || []
    })
    orgs = tool.deleteNoChildrenOrgs(orgs)
    const data = tool.transData2Tree(orgs, '_id', 'pid', true).pop()
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
// 获取通道树
exports.getAuthChannelTree = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-获取通道树'))
  let allChildrenIds = []
  let orgs = []
  let mainFlag = true
  let userDataInfo
  !ctx.query.pid && (ctx.query.pid = ctx.state.user.orgId)
  try {
    // 获取用户权限数据
    const userData = (
      await User.findById(ctx.query.userid, 'userData')
        .lean()
        .exec()
    ).userData
    switch (Number(ctx.query.bigtype)) {
      case 0: {
        userDataInfo = userData.video
        break
      }
      case 5: {
        userDataInfo = userData.decode
        break
      }
    }
    orgs = await Org.find({ type: ctx.query.orgtype || ORG_TYPE.LOCALE }, '_id name pid')
      .sort({ order: -1 })
      .exec() // -devices
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.pid)
    allChildrenIds.unshift(ctx.query.pid + '')
    orgs = await Org.find(
      {
        _id: {
          $in: allChildrenIds
        }
      },
      '_id name pid isroot'
    )
      .sort('name')
      .lean()
      .exec()
    const orgids = orgs.map(org => org._id)
    // 获取所有设备
    const devices = await Device.find({ oid: { $in: orgids }, bigtype: ctx.query.bigtype }, 'name oid status')
      .lean()
      .exec()
    const devids = devices.map(dev => dev._id)
    // 获取所有资源
    const resources = await Resource.find({ eid: { $in: devids }, type: ctx.query.channeltype })
      .lean()
      .exec()
    const arr = new Array(devices.length)
    _.fill(arr, { equip: true })
    _.merge(devices, arr)
    const resMapping = {}
    const userResMapping = {}
    const userDevMapping = {}
    const userPowerMapping = {}
    // 获取资源|power的mapping
    userDataInfo.res.length &&
      userDataInfo.res.forEach(item => {
        !userPowerMapping[item.id + ''] && (userPowerMapping[item.id + ''] = [])
        userPowerMapping[item.id + ''] = [...userPowerMapping[item.id + ''], ...item.power]
      })
    // 获取相应的id数组
    const userResIds = userDataInfo.res.map(item => item.id + '')
    const userDevIds = userDataInfo.device
    const userOrgIds = userDataInfo.org

    resources.forEach(res => {
      if (userResIds && userDevIds.length) {
        // 判断资源是否有云台权限
        if (userPowerMapping[res._id + ''] && userPowerMapping[res._id + ''].length) {
          res.power = userPowerMapping[res._id + '']
          if (userPowerMapping[res._id + ''].length === 5) {
            res.checked = 2
          } else {
            res.checked = 1
            mainFlag = false
          }
          // 获取用户权限数据(设备|资源)mapping
          !userResMapping[res.eid + ''] && (userResMapping[res.eid + ''] = [])
          userResMapping[res.eid + ''] = [...userResMapping[res.eid + ''], res]
        } else {
          // 若无云台权限，判断是否有资源权限
          if (userResIds.includes(res._id + '')) {
            res.checked = 1
            res.power = []
            mainFlag = false
            // 获取用户权限数据(设备|资源)mapping
            !userResMapping[res.eid + ''] && (userResMapping[res.eid + ''] = [])
            userResMapping[res.eid + ''] = [...userResMapping[res.eid + ''], res]
          } else {
            res.checked = 0
            res.power = []
            mainFlag = false
          }
        }
      } else {
        res.checked = 0
        res.power = []
        mainFlag = false
      }
      // 获取(设备|资源)mapping
      !resMapping[res.eid + ''] && (resMapping[res.eid + ''] = [])
      resMapping[res.eid + ''] = [...resMapping[res.eid + ''], res]
    })
    const devMapping = {}
    devices.forEach(dev => {
      // 控制半选的flag
      let flag = true
      // 判断设备是否有权限
      if (userResMapping[dev._id + ''] && userResMapping[dev._id + ''].length) {
        if (userResMapping[dev._id + ''].length === resMapping[dev._id + ''].length) {
          resMapping[dev._id + ''].forEach(item => {
            if (item.checked !== 2) {
              flag = false
            }
          })
          if (flag) {
            dev.checked = 2
          } else {
            dev.checked = 1
            mainFlag = false
          }
        } else {
          dev.checked = 1
          mainFlag = false
        }
      } else {
        dev.checked = 0
        mainFlag = false
      }
      // 获取用户权限的(机构|设备)mapping
      if (userDevIds.includes(dev._id + '')) {
        !userDevMapping[dev.oid + ''] && (userDevMapping[dev.oid + ''] = [])
        userDevMapping[dev.oid + ''] = [...userDevMapping[dev.oid + ''], dev]
      }
      // 获取(机构|设备)mapping
      !devMapping[dev.oid + ''] && (devMapping[dev.oid + ''] = [])
      devMapping[dev.oid + ''] = [...devMapping[dev.oid + ''], dev]
    })
    // 找出所有不在权限数据里的机构，并将checked置为0
    orgs.forEach(org => {
      if (!userOrgIds.includes(org._id + '')) {
        org.checked = 0
      }
    })
    // 遍历机构，更改状态
    orgs.forEach(org => {
      let flag = true
      // 判断设备所在机构是否具有数据权限
      if (userDevMapping[org._id + ''] && userDevMapping[org._id + ''].length) {
        if (userDevMapping[org._id + ''].length === devMapping[org._id + ''].length) {
          let childrenIds = []
          childrenIds = tool.getChildren(childrenIds, orgs, org._id + '')
          if (childrenIds.length) {
            // 过滤该节点下的所有子机构
            const childOrgs = orgs.filter(org => childrenIds.includes(org._id + ''))
            // 判断改节点下的子节点机构是否存在半选
            childOrgs.forEach(child => {
              if ((child.checked || child.checked === 0) && child.checked !== 2) {
                flag = false
              }
            })
            const childDevs = devices.filter(dev => childrenIds.includes(dev.oid + ''))
            childDevs.forEach(child => {
              if (child.checked !== 2) {
                flag = false
              } else {
                resMapping[child._id + ''].forEach(res => {
                  if (res.checked !== 2) {
                    flag = false
                  }
                })
              }
            })
          }
          devMapping[org._id + ''].forEach(item => {
            if (item.checked !== 2) {
              flag = false
            } else {
              resMapping[item._id + ''].forEach(res => {
                if (res.checked !== 2) {
                  flag = false
                }
              })
            }
          })
          if (flag) {
            org.checked = 2
          } else {
            org.checked = 1
            mainFlag = false
          }
        } else {
          org.checked = 1
          mainFlag = false
        }
        // 判断机构是否存在于权限数据中
      } else if (userOrgIds.includes(org._id + '')) {
        // 获取机构子节点
        let childrenIds = []
        childrenIds = tool.getChildren(childrenIds, orgs, org._id + '')
        // childrenIds.shift(org._id + '')
        // 获取机构子节点对应的设备
        if (childrenIds.length) {
          // 过滤该节点下的所有子机构
          const childOrgs = orgs.filter(org => childrenIds.includes(org._id + ''))
          // 判断改节点下的子节点机构是否存在半选
          childOrgs.forEach(child => {
            if ((child.checked || child.checked === 0) && child.checked !== 2) {
              flag = false
            }
          })
          if (mainFlag) {
            org.checked = 2
          } else {
            // 判断改节点下的资源是否存在半选
            const childDevs = devices.filter(dev => childrenIds.includes(dev.oid + ''))
            childDevs.forEach(child => {
              if (child.checked !== 2) {
                flag = false
              } else {
                resMapping[child._id + ''].forEach(res => {
                  if (res.checked !== 2) {
                    flag = false
                  }
                })
              }
            })
            if (flag) {
              org.checked = 2
            } else {
              org.checked = 1
            }
          }
        } else {
          org.checked = 2
        }
      } else {
        org.checked = 0
      }
      // 将设备和资源挂载于机构
      devMapping[org._id + ''] &&
        devMapping[org._id + ''].forEach(dev => {
          dev.children = resMapping[dev._id + '']
        })
      !org.children && (org.children = [])
      devMapping[org._id + ''] && (org.children = [...org.children, ...devMapping[org._id + '']])
    })
    orgs = orgs.map(item => {
      item.isOrg = true
      return item
    })
    const treeDatas = tool.transData2Tree(orgs, '_id', 'pid', true)
    ctx.body = _.isEmpty(treeDatas) ? {} : treeDatas[0]
  } catch (err) {
    handleSysException(err)
  }
}

// 删除设备
exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-删除设备'))
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(404, { code: 1010, message: '参数不能为空' })
    }
    const deviceFlag = await Device.findById(ids[0]).exec()
    const resources = await Resource.find(
      { eid: { $in: ids }, type: parseInt(deviceFlag.bigtype) },
      '_id videoStructure'
    ).exec()
    for (var item of ids) {
      const device = await Device.findById(item).exec()
      if (_.isEmpty(device)) {
        return ctx.throw(404, { code: 1010, message: '该设备不存在' })
      }
      // 查找设备对应的资源表
      const res = await Resource.find({ eid: item }).exec()
      // 删除资源机构关系表数据
      res.forEach(async item => {
        await OrgRes.deleteMany({ resource: item._id }).exec()
      })
      // 如果资源中存在智能报警，删除对应的机构报警关系表
      res.forEach(async item => {
        await OrgAlarm.deleteMany({ resource: item._id }).exec()
      })
      // 删除设备对应的资源
      await Resource.deleteMany({ eid: item }).exec()
      // 回收rtsp流
      res.forEach(async item => {
        if (res.rtsp) {
          const rtspId = res.rtsp.main.split('=').pop()
          // 回收当前资源的rtsp id
          rtspServer.setUnusedIds(Number(rtspId))
        }
      })
      // 删除该设备
      await Device.findByIdAndRemove(item).exec()
      // 设备更新通知
      postal.publish({
        channel: 'devices',
        topic: 'item.notice',
        data: {
          ctx: ctx,
          data: {
            module: 'dev',
            varyData: [
              {
                before: {
                  devIp: device.ip + '',
                  devPort: +device.cport
                },
                after: {}
              }
            ],
            newData: []
          }
        }
      })
    }
    if (parseInt(deviceFlag.bigtype) === DEV_TYPE.DECODER || parseInt(deviceFlag.bigtype) === DEV_TYPE.FINE_TRACK) {
      // 删除拼接源对应关系
      Origin.deleteMany({ $or: [{ decodechan: { $in: resources } }, { jointorigin: { $in: resources } }] })
    }
    if (parseInt(deviceFlag.bigtype) === DEV_TYPE.DECODER) {
      // 查找设备对应的资源
      postal.publish({
        channel: 'devices',
        topic: 'item.deleteDecoder',
        data: {
          equipment: ids,
          resources
        }
      })
    } else {
      postal.publish({
        channel: 'devices',
        topic: 'item.deleteIPC',
        data: {
          equipment: ids,
          resources
        }
      })
      // const resIPCIds = await Resource.find({ eid: { $in: ids } }, '_id')
      postal.publish({
        channel: 'resources',
        topic: 'array.delete',
        data: {
          ctx,
          ids: resources.map(item => item._id)
        }
      })
      postal.publish({
        channel: 'alarm',
        topic: 'alarmCfg',
        data: {
          ids: resources.map(item => item._id)
        }
      })
      postal.publish({
        channel: 'alarm',
        topic: 'fireAlarmCfg',
        data: {
          ids: resources.map(item => item._id)
        }
      })
      postal.publish({
        channel: 'videoStructure',
        topic: 'delete.videoChannel',
        data: {
          resources: resources.filter(item => _.get(item, 'videoStructure.structureServer', undefined) !== undefined)
        }
      })
    }
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 获取各类设备的设备总数
exports.counts = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-获取各类设备总数'))
    let allChildrenIds = []
    if (parseInt(ctx.query.never) === -1) {
      // 统计所有子孙机构
      const orginfo = await Org.findById(ctx.query.id).exec()
      const orgs = await Org.find({ type: orginfo.type || ORG_TYPE.LOCALE }, '_id pid').exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.id)
    }
    allChildrenIds.unshift(ctx.query.id + '')
    const arr = []
    for (let i = 0; i <= 10; i++) {
      arr.push(
        Device.countDocuments({
          oid: {
            $in: allChildrenIds
          },
          bigtype: i
        }).exec()
      )
    }
    ctx.body = await Promise.all(arr)
  } catch (err) {
    handleSysException(err)
  }
}

// 首页中各个设备统计
exports.countIndex = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-统计设备'))
    const devices = await Device.find({}).exec() // 查找类型的所有设备
    const total = { online: 0, offline: 0, total: devices.length || 0 } // 设备统计对象
    const counts = new Array(8) // 数量统计
    counts.fill(0)
    devices.forEach(item => {
      if (!counts[item.bigtype]) {
        counts[item.bigtype] = 0
      }
      counts[item.bigtype]++
      parseInt(item.status) === 1 || item.status ? total.online++ : total.offline++
    })
    ctx.body = {
      total: total,
      counts: counts
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 获取指定设备下的所有资源
exports.getResource = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-获取设备资源'))
  const eid = ctx.params.id // 设备id
  try {
    const device = await Device.findById(eid).exec() // 设备信息
    if (_.isEmpty(device)) {
      return ctx.throw(500, { code: 1010, message: '该设备不存在' })
    }
    // 按照当前角色所拥有的资源权限过滤资源
    const query = { eid: eid }
    const roleId = ctx.state.user.role
    if (roleId !== '5be27279e74ee9376c681111') {
      let resIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      // const role = await Role.findById(roleId, 'resources')
      //   .lean()
      //   .exec()
      query._id = { $in: resIds }
    }
    const reses = await Resource.find(
      query,
      'type name chan ip port monitortype stream protocol model alarm level alarmtype alarmouttype alarmtemplate maxdelaytime minintervaltime durationtime exportdelaytime mapsign alarmaffirm devloop'
    ).exec()
    const totalArr = []
    reses.forEach(item => {
      if (!totalArr[item['type']]) {
        totalArr[item['type']] = []
      }
      totalArr[item['type']] = [...totalArr[item['type']], item.toObject()]
    })
    let monitoryPointAlarmArr // 监控点报警
    let intelligentAlarmArr // 智能报警
    let deviceAlarmArr // 设备报警
    const ipcResids = totalArr[0] && totalArr[0].map(item => item._id)
    // 获取设备报警,获取监控点报警,获取智能报警
    const [deviceAlarms, monitoryPointAlarms, intelligentAlarms] = await Promise.all([
      DeviceAlarm.find({ eid }).exec(),
      MonitoryPointAlarm.find({ rid: { $in: ipcResids } }).exec(),
      IntelligentAlarm.find({ rid: { $in: ipcResids } }).exec()
    ])
    if (deviceAlarms.length) {
      deviceAlarmArr = deviceAlarms
    }
    if (!deviceAlarms.length && device.devicealarm) {
      deviceAlarmArr = []
    }

    if (monitoryPointAlarms.length) {
      monitoryPointAlarmArr = monitoryPointAlarms
    }
    if (!monitoryPointAlarms.length && device.monitorypointalarm) {
      monitoryPointAlarmArr = []
    }

    if (intelligentAlarms.length) {
      intelligentAlarmArr = intelligentAlarms
    }
    if (!intelligentAlarms.length && device.intelligent) {
      intelligentAlarmArr = []
    }
    // 按通道号排序
    const videoArr = sort(totalArr[0], 'chan')
    // 刷新消防主机防区的时候发送通知
    if (!_.isEmpty(totalArr[11]) && ctx.query.action === 'button') {
      const device = await Device.findById(totalArr[11][0].eid)
        .lean()
        .exec()
      let varyData = []
      totalArr[11].forEach(item => {
        const obj = {
          before: {
            slotNo: Number(item.devloop),
            zoneNo: item.chan
          },
          after: {
            slotNo: Number(item.devloop),
            zoneNo: item.chan
          }
        }
        varyData.push(obj)
      })
      const data = {
        module: 'firealarm',
        newData: [
          {
            devIp: device.ip,
            devPort: device.cport,
            vendor: device.manufacturer,
            type: 'update'
          }
        ],
        varyData: varyData
      }
      try {
        await fireAlarmChange({ ctx, data })
      } catch (err) {
        return ctx.throw(500, { code: 500, message: `请求第三方接口'/api/notice/info'异常`, type: 'sys' })
      }
    }
    ctx.body = {
      video: videoArr || [], // 视频通道
      alarmInput: totalArr[1] || totalArr[9] || totalArr[11] || totalArr[7] || [], // 报警输入
      alarmOutput: totalArr[2] || totalArr[10] || totalArr[12] || totalArr[8] || [], // 报警输出
      intercom: totalArr[3] || [], // 对讲通道
      entranceGuard: [], // 门禁通道暂时为空
      decode: totalArr[5] || [], // 解码通道
      voice: totalArr[6] || [], // 音频通道
      deviceAlarm: deviceAlarmArr || [], // 设备报警
      monitoryPointAlarm: monitoryPointAlarmArr || [], // 监控点报警
      intelligentAlarm: intelligentAlarmArr || [], // 智能报警
      jointInput: totalArr[15] || []
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 获取指定设备类型下的设备列表
exports.getTypeDevice = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-获取制定类型的设备列表'))
    const results = await Device.find({ bigtype: ctx.params.type }, '').exec()
    ctx.body = _.isEmpty(results) ? [] : results
  } catch (err) {
    handleSysException(err)
  }
}

// 获取指定设备指定通道的详情数据
exports.getResinfo = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-获取设备通道详情'))
  const { id, type } = ctx.params
  try {
    const reses = await Resource.find({ eid: id, type: type }).exec()
    ctx.body = reses
  } catch (err) {
    handleSysException(err)
  }
}

// 修改设备报警
exports.updateAlarm = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-修改设备报警'))
    const deviceId = ctx.params.id // 设备id
    const alarmId = ctx.params.aid // 报警id
    const device = await Device.findById(deviceId).exec()
    if (_.isEmpty(device)) {
      return ctx.throw(500, { code: 1010, message: '该设备不存在' })
    }
    let matchedIndex = -1
    // let matchedAlarmIndex = -1
    let nameFlag = false
    let typeFlag = false
    for (let i = 0; i < device.alarm.length; i++) {
      if ('' + device.alarm[i]._id === '' + alarmId) {
        matchedIndex = i
      }
      if ('' + device.alarm[i]._id !== '' + alarmId && ctx.request.body.type + '' === device.alarm[i].type + '') {
        typeFlag = true
      }
      if ('' + device.alarm[i]._id !== '' + alarmId && ctx.request.body.name + '' === device.alarm[i].name + '') {
        nameFlag = true
      }
    }
    if (nameFlag) {
      return ctx.throw(500, { code: 1012, message: `该名称已存在` })
    }
    if (typeFlag) {
      return ctx.throw(500, { code: 1013, message: `该报警类型已存在` })
    }

    if (!_.isEmpty(device.alarm) && parseInt(matchedIndex) !== -1) {
      device.alarm[matchedIndex] = _.merge(device.alarm[matchedIndex], ctx.request.body)
    }
    await device.save()
    // postal.publish({
    //   channel: 'devices',
    //   topic: 'item.notice',
    //   data: {
    //     ctx: ctx
    //   }
    // })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 删除某条设备报警
exports.delAlarm = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-删除单个设备报警'))
    const deviceId = ctx.params.id // 设备id
    const alarmId = ctx.params.aid // 报警id
    const device = await Device.findById(deviceId).exec()
    if (_.isEmpty(device)) {
      return ctx.throw(500, { code: 1010, message: '该设备不存在' })
    }
    for (let i = 0; i < device.alarm.length; i++) {
      if ('' + device.alarm[i]._id === '' + alarmId) {
        device.alarm.splice(i, 1)
      }
    }
    await device.save()
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 批量删除设备报警
exports.delAlarmPatch = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-批量删除设备报警'))
  const deviceId = ctx.params.id // 设备id
  const alarmIds = ctx.request.header['x-bsc-ids'].split(',') || [] // 报警ids
  try {
    const device = await Device.findById(deviceId).exec()
    if (_.isEmpty(device)) {
      return ctx.throw(500, { code: 1010, message: '该设备不存在' })
    }
    const newAlarms = []
    for (let i = 0; i < device.alarm.length; i++) {
      if (alarmIds.indexOf(device.alarm[i]._id + '') === -1) {
        newAlarms.push(device.alarm[i])
      }
    }
    device.alarm = newAlarms
    await device.save()
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 新增一条设备报警数据
exports.addAlarm = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-新增设备报警'))
    const deviceId = ctx.params.id // 设备id
    const device = await Device.findById(deviceId).exec()
    if (_.isEmpty(device)) {
      return ctx.throw(500, { code: 1010, message: '该设备不存在' })
    }
    if (_.isEmpty(device.alarm)) {
      device.alarm = []
    }
    let existedType = ''
    let existedName = ''
    device.alarm.forEach(item => {
      if (ctx.request.body.type + '' === item.type + '') {
        existedType = item.type
      }
      if (ctx.request.body.name === item.name) {
        existedName = item.name
      }
    })
    if (existedType) {
      return ctx.throw(500, { code: 1013, message: `该报警类型已存在` })
    }
    if (existedName) {
      return ctx.throw(500, { code: 1012, message: '该名称已存在' })
    }
    device.alarm.push(ctx.request.body)
    await device.save()
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 获取指定设备未使用的通道号
exports.getUnusedChanCode = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-获取设备未使用的通道号'))
    const mapping = {
      0: 'ipcount',
      1: 'defenseicount',
      2: 'defenseocount',
      3: 'intercomcount',
      4: 'entranceguardcount',
      5: 'decodecount',
      6: 'voicecount',
      7: 'encodingcount',
      8: 'videoinputcount',
      15: 'jointinputcount'
    }
    let type
    const eid = ctx.params.id
    type = ctx.query.type
    const [device, resources] = await Promise.all([Device.findById(eid).exec(), Resource.find({ eid, type }).exec()])
    if (+type === 7 || +type === 9 || +type === 11) {
      type = 1
    }
    if (+type === 8 || +type === 10 || +type === 12) {
      type = 2
    }
    const count = device[mapping[type]] || 0
    const rcode = resources.map(item => item.chan)
    const canUseChan = []
    for (let i = 1; i <= count; i++) {
      if (rcode.indexOf(i) === -1) {
        canUseChan.push(i)
      }
    }
    ctx.status = 200
    ctx.body = canUseChan
  } catch (err) {
    handleSysException(err)
  }
}
exports.getUnConfigAlarm = async ctx => {
  try {
    const mapping = {
      intelligentAlarm: IntelligentAlarm,
      monitoryPointAlarm: MonitoryPointAlarm
    }
    const resources = await Resource.find({ eid: ctx.params.id, type: 0 }, 'chan').exec()
    const resArr = resources.map(item => {
      return { chan: item.chan, _id: item._id }
    })
    const canUseRes = []
    for (var item of resArr) {
      const num = await mapping[ctx.query.category].countDocuments({ rid: item._id, chan: item.chan }).exec()
      if (!num) {
        canUseRes.push(item)
      }
    }
    ctx.body = sort(canUseRes, 'chan')
  } catch (error) {
    handleSysException(error)
  }
}
// 远程获取设备信息，视频设备和解码器设备信息 // 设备类型0：视频设备1：报警主机2：门禁设备3：ip对讲4：巡更设备5：解码器6：网络键盘
exports.getDeviceinfo = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-获取远程设备信息'))
  const device = ctx.query // 设备对象{ip:xxx port:xxx}
  if (_.isEmpty(device)) {
    return ctx.throw(500, { code: 1010, message: '设备不存在' })
  }
  try {
    let result
    switch (parseInt(device.type)) {
      case 0: {
        result = await getDevinfo({ device, ctx })
        break
      }
      case 5: {
        const body = {
          devInfo: {
            devIp: device.ip,
            devPort: parseInt(device.port),
            username: device.username,
            password: device.password
          }
        }
        result = await wallInterface.getMonitorCfg(ctx, body)
        result = {
          ChanCount: result.MonitorCfgPrmArr.length
        }
      }
    }

    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 1017, message: '请求接口异常', type: 'sys' })
    }
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
// 设备重启
exports.restartDev = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-重启设备'))
  const device = ctx.request.body
  try {
    const options = {
      ctx,
      method: 'POST',
      url: `/api/dev/reboot`,
      body: {
        devInfo: {
          devIp: device.ip,
          devPort: parseInt(device.port)
        },
        devCtl: {
          channel: 1 // ipc设备目前写死为1
        }
      },
      json: true,
      timeout: 5000
    }
    await rp(options)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 设备登录
exports.login = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-设备登录'))
  const devId = ctx.request.body.id
  const device = await Device.findById(devId).exec()
  try {
    await devLogin({ device: device, ctx: ctx })
    postal.publish({
      channel: 'devices',
      topic: 'item.login',
      data: {
        device: device,
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 设备登出
exports.logout = async ctx => {
  ctx.set('loginfo', encodeURI('设备管理-设备登出'))
  const devId = ctx.request.body.id
  const device = await Device.findById(devId).exec()
  try {
    await devLogout({ device: device, ctx: ctx })
    postal.publish({
      channel: 'devices',
      topic: 'item.logout',
      data: {
        device: device,
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 返回所有在线的设备列表 // api/dev/onlinelist
exports.getDevOnline = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('设备管理-获取在线设备列表'))
    const ret = await devOnlineList()
    const onlineList = ret.devOnlineList ? ret.devOnlineList : []
    ctx.body = onlineList
  } catch (err) {
    // console.log(err)
    return ctx.throw(500, { code: 1017, message: '设备状态接口同步异常', type: 'sys' })
  }
}

// 同步设备在线状态
exports.syncOnlineList = async ctx => {
  try {
    // console.log('同步设备在线状态')
    await syncOnlineList()
  } catch (err) { }
}
// 设备信息导入
exports.deviceImport = async ctx => {
  try {
    const org = await Org.findById(ctx.query.oid).lean()
    if (org.shareType) {
      return ctx.throw(500, { code: 1019, message: '下联机构不能添加设备' })
    }
    // 解析文件
    const devInfos = xlsx.parse(ctx.request.body.files.file.path)
    const doc = []
    let newDoc = []
    let bigtype = ctx.query.bigtype
    devInfos.forEach(val => {
      val.data.shift()
      // if (val.data.length > 200) {
      //   ctx.throw(500, { code: 500, message: '一个机构节点下导入设备不能超过200条' })
      // }
      for (const item of val.data) {
        if (item.length === 0) {
          continue
        } // 表格会有空的行
        const dev = {
          bigtype: bigtype,
          oid: ctx.query.oid,
          name: item[0],
          manufacturer: bigtype === '0' ? item[2] : item[1],
          ip: bigtype === '0' ? item[4] : bigtype === '5' ? item[4] : bigtype === '9' ? item[2] : item[3],
          cport: bigtype === '0' ? item[5] : bigtype === '5' ? item[5] : bigtype === '9' ? item[3] : item[4]
        }
        if (dev.ip === undefined) {
          continue
        }
        if (bigtype !== '10') {
          // 短信猫设备没有为 COM
          if (dev.ip.split('.').length !== 4) {
            ctx.throw(500, { code: 500, message: `导入数据格式不符` })
          }
        }
        switch (bigtype) {
          case '0':
            dev.series = item[3]
            dev.dport = item[6]
            dev.username = item[7]
            dev.password = item[8]
            dev.type = item[1] // 2.0修改为1之前为2
            dev.ipcount = item[9]
            dev.defenseicount = item[10]
            dev.defenseocount = item[11]
            // dev.intercomcount = item[13] 2.0 去掉
            break
          case '1':
            dev.model = item[2]
            dev.intranetIp = item[3]
            dev.username = item[5]
            dev.password = item[6]
            dev.defenseicount = item[7]
            dev.defenseocount = item[8]
            break
          case '5':
            dev.type = item[2]
            dev.model = item[3]
            dev.username = item[6]
            dev.password = item[7]
            dev.decodecount = item[8]
            dev.voicecount = item[9]
            dev.defenseicount = item[10]
            dev.defenseocount = item[11]
            dev.accessServerIp = item[12]
            break
          case '7':
            dev.model = item[2]
            dev.intranetIp = item[3]
            dev.username = item[5]
            dev.password = item[6]
            dev.alarmTesponseTime = item[7]
            dev.alarmMaximumQuantity = item[7] || item[7] === 0 ? Number(item[7]) * 512 : ''
            break
          case '9':
            dev.jointinputcount = item[4]
            break
          case '6':
            dev.model = item[2]
            break
          case '10':
            dev.series = item[2]
            dev.type = 'sim'
            break
        }
        if (dev.name && dev.ip && dev.cport) {
          doc.push(dev)
        }
      }
    })
    if (!doc.length) {
      ctx.throw(500, { message: '无可用数据' })
      return
    }
    for (var item of doc) {
      // 查重
      const device = await Device.find({ ip: item.ip, cport: item.cport }).exec() // 查表，返回到device中
      if (device.length) {
        // 若有查出值则打断
        continue
      } else {
        // 将导入的数据push到newDoc中
        newDoc.push(item)
      }
    }
    if (!newDoc.length) {
      // 若查出值返回500错误，报‘重复数据’
      ctx.throw(500, { code: 1019, message: '重复数据' })
      return
    }
    const newDeviceArr = await Device.create(newDoc)
    const docs = []
    let videos = []
    let id
    newDeviceArr.forEach(newDevice => {
      const deviceObj = newDevice.toObject()
      const {
        ipcount = 0,
        defenseicount = 0,
        defenseocount = 0,
        intercomcount = 0,
        decodecount = 0,
        voicecount = 0,
        jointinputcount = 0
      } = deviceObj
      for (let i = 1; i <= ipcount; i++) {
        id = rtspServer.getUnusedIds()
        videos.push({
          eid: newDevice._id,
          chan: i,
          type: 0,
          ip: newDevice.ip,
          port: newDevice.cport,
          rtsp: {
            main: `rtsp://ip:port/main/id=${id}`,
            sub: `rtsp://ip:port/sub/id=${id}`
          },
          name: `${newDevice.name}_视频通道_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_视频通道_通道${i}`)
        })
      }
      for (let i = 1; i <= defenseicount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          type:
            newDevice.bigtype === 0
              ? 1
              : newDevice.bigtype === 1
                ? 9
                : newDevice.bigtype === 5
                  ? 7
                  : newDevice.bigtype === 7
                    ? 11
                    : 1,
          ip: newDevice.ip,
          port: newDevice.cport,
          name: newDevice.bigtype === 0 ? `${newDevice.name}_报警输入_通道${i}` : `${newDevice.name}_报警防区_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_报警输入_通道${i}`)
        })
      }
      for (let i = 1; i <= defenseocount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          ip: newDevice.ip,
          port: newDevice.cport,
          type:
            newDevice.bigtype === 0
              ? 2
              : newDevice.bigtype === 1
                ? 10
                : newDevice.bigtype === 5
                  ? 8
                  : newDevice.bigtype === 7
                    ? 12
                    : 2,
          name: `${newDevice.name}_报警输出_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_报警输出_通道${i}`)
        })
      }
      for (let i = 1; i <= intercomcount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          ip: newDevice.ip,
          port: newDevice.cport,
          type: 3,
          name: `${newDevice.name}_设备对讲_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_设备对讲_通道${i}`)
        })
      }
      for (let i = 1; i <= decodecount; i++) {
        docs.push({
          eid: newDevice._id,
          ip: newDevice.ip,
          port: newDevice.cport,
          chan: i,
          type: 5,
          intelligent: newDevice.intelligent,
          name: `${newDevice.name}_解码通道_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_解码通道_通道${i}`)
        })
      }
      for (let i = 1; i <= voicecount; i++) {
        docs.push({
          eid: newDevice._id,
          ip: newDevice.ip,
          port: newDevice.cport,
          chan: i,
          type: 6,
          intelligent: newDevice.intelligent,
          name: `${newDevice.name}_音频通道_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_音频通道_通道${i}`)
        })
      }
      for (let i = 1; i <= jointinputcount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          type: 15,
          ip: newDevice.ip,
          port: newDevice.cport,
          name: `${newDevice.name}_输入源_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_输入源_通道${i}`)
        })
      }
    })
    // ipc/nvr视频通道添加国标字段
    videos = await res(videos, org.gbDevId)
    // 批量生产资源
    await Resource.create(docs.concat(videos))
    fs.unlinkSync(ctx.request.body.files.file.path)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 设备信息导出
exports.deviceExport = async ctx => {
  try {
    const orgName = await Org.findById(ctx.query.oid, 'name').exec()
    const allOrgs = await Org.find({ type: 0 }).exec()
    let allChildrenIds = []
    allChildrenIds = tool.getChildren(allChildrenIds, allOrgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid)
    let data
    let fieldNames = []
    let tableHeaderXlsx
    if (ctx.query.bigtype === '0') {
      data = [
        [
          '设备名称',
          '设备类型',
          '设备厂商',
          '设备型号',
          'IP地址',
          '控制端口',
          '数据端口',
          '用户名',
          '密码',
          '视频通道数量',
          '报警输入数量',
          '报警输出数量'
        ]
      ]
      fieldNames = [
        'name',
        'type',
        'manufacturer',
        'series',
        'ip',
        'cport',
        'dport',
        'username',
        'password',
        'ipcount',
        'defenseicount',
        'defenseocount'
      ]
      tableHeaderXlsx = '视频设备'
    } else if (ctx.query.bigtype === '1') {
      // 2.0 版本 去掉 内网地址 项  报警主机 消防主机
      // 设备名称、厂商、型号、内网地址、主机地址、控制端口、用户名、密码、报警防区数量、报警输出数量。
      data = [
        ['设备名称', '设备厂商', '设备型号', '主机地址', '控制端口', '用户名', '密码', '报警防区数量', '报警输出数量']
      ]
      fieldNames = [
        'name',
        'manufacturer',
        'model',
        'ip',
        'cport',
        'username',
        'password',
        'defenseicount',
        'defenseocount'
      ]
      tableHeaderXlsx = '报警主机'
    } else if (ctx.query.bigtype === '5') {
      // 设备名称、厂商、设备类型、设备型号、IP地址、端口、用户名、密码、接入服务器、解码通道数量、音频通道数量、报警输入通道、报警输出通道
      data = [
        [
          '设备名称',
          '设备厂商',
          '设备类型',
          '设备型号',
          'IP地址',
          '数据端口',
          '用户名',
          '密码',
          '解码通道数量',
          '音频通道数量',
          '报警输入通道',
          '报警输出通道',
          '接入服务器'
        ]
      ]
      fieldNames = [
        'name',
        'manufacturer',
        'type',
        'model',
        'ip',
        'cport',
        'username',
        'password',
        'decodecount',
        'voicecount',
        'defenseicount',
        'defenseocount',
        'accessServerIp'
      ]
      tableHeaderXlsx = '解码器'
    } else if (ctx.query.bigtype === '7') {
      // 设备名称、厂商、型号、ip地址、控制端口、用户名、密码、报警响应时间
      // 设备名称、厂商、型号、内网地址、主机地址、控制端口、用户名、密码、报警相应时间
      data = [['设备名称', '设备厂商', '设备型号', '主机地址', '控制端口', '用户名', '密码', '报警响应时间']]
      fieldNames = ['name', 'manufacturer', 'model', 'ip', 'cport', 'username', 'password', 'alarmTesponseTime']
      tableHeaderXlsx = '消防主机'
    } else if (ctx.query.bigtype === '9') {
      // 设备名称、设备厂商、主机地址、端口、、输入通道数量
      data = [['设备名称', '设备厂商', '主机地址', '控制端口', '输入通道数量']]
      fieldNames = ['name', 'manufacturer', 'ip', 'cport', 'jointinputcount']
      tableHeaderXlsx = '拼接控制器'
    } else if (ctx.query.bigtype === '6') {
      // 设备名称、设备厂商、设备型号、主机地址、控制端口
      data = [['设备名称', '设备厂商', '设备型号', '主机地址', '控制端口']]
      fieldNames = ['name', 'manufacturer', 'model', 'ip', 'cport']
      tableHeaderXlsx = '网络键盘'
    } else if (ctx.query.bigtype === '10') {
      // 设备名称、厂商、型号、控制端口
      data = [['设备名称', '设备厂商', '设备型号', '接入方式', '控制端口']]
      fieldNames = ['name', 'manufacturer', 'series', 'ip', 'cport']
      tableHeaderXlsx = '短信猫'
    }
    // const devMapping = ['视频设备', '报警主机', '门禁设备', 'ip对讲', '巡更设备', '解码器', '网络键盘', '消防主机']
    const devices = await Device.find(
      { oid: { $in: allChildrenIds }, bigtype: ctx.query.bigtype, type: { $nin: ['alarmBox', 'alarmPillar'] } },
      fieldNames.join(' ')
    ).exec()
    // 将设备信息Push到sheet
    devices.forEach(item => {
      let arr = []
      fieldNames.forEach(val => {
        arr.push(item[val])
      })
      data.push(arr)
    })
    // 设置列样式
    const ColInfos = [
      { width: 15 },
      {},
      {},
      {},
      {},
      { width: 15 },
      {},
      {},
      {},
      {},
      { width: 15 },
      { width: 15 },
      { width: 15 },
      { width: 15 }
    ]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: tableHeaderXlsx, data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
    ctx.attachment(orgName.name + '-' + tableHeaderXlsx + '-' + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}
// 按通道号排序
function sort (arr, cond) {
  let temp
  const length = arr ? arr.length : 0
  for (let i = 0; i < length; i++) {
    for (let j = i; j < length - 1; j++) {
      if (arr[i][cond] > arr[j + 1][cond]) {
        temp = arr[i]
        arr[i] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}
exports.refreshResource = async ctx => {
  try {
    const device = await Device.findById(ctx.params.id)
      .lean()
      .exec()
    const data = {
      devInfo: {
        devIp: device.ip,
        devPort: device.cport
      }
    }
    const remoteRes = (await getDevConf({ data, ctx })).ChanCfgPrmArr
    const reses = await Resource.find({ eid: ctx.params.id, type: 0 }).exec()
    let flag = false
    for (var res of reses) {
      remoteRes.forEach(item => {
        if (+item.channel === +res.chan) {
          if (item.devIp) {
            res.ip = item.devIp
            flag = true
          }
        }
      })
      if (flag) {
        // const id = res._id
        // delete res._id
        // await Resource.findByIdAndUpdate(id, res)
        await res.save()
      }
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
exports.getDeviceBySeries = async ctx => {
  try {
    const devices = await Device.find({ series: ctx.query.series }, '_id')
      .lean()
      .exec()
    const devIds = devices.map(dev => dev._id)
    const resources = await Resource.find({ eid: { $in: devIds } }, 'name')
    ctx.body = resources
  } catch (error) {
    handleSysException(error)
  }
}
// 获取 接入服务器
exports.serviceList = async ctx => {
  try {
    const service = await getServer(ctx, 'ds')
    ctx.body = service
  } catch (err) {
    handleSysException(err)
  }
}
// 设备启用停用状态修改
exports.setDeviceStatus = async ctx => {
  try {
    const ids = ctx.request.body.ids
    const arr = [0, 1] // 1:启用,0:停用
    if (ids.length < 1) {
      ctx.throw(500, { message: '修改状态数组不能为空' })
    }
    if (!arr.includes(Number(ctx.request.body.status))) {
      ctx.throw(500, { message: '状态参数不合法' })
    }
    let requestlog = []
    let device = await Device.find(
      { _id: ctx.request.body.ids },
      {
        ip: 1,
        cport: 1,
        intranetIp: 1,
        intranetPort: 1,
        manufacturer: 1,
        username: 1,
        password: 1,
        bigtype: 1,
        connMode: 1,
        status: 1
      }
    )
    if (Number(ctx.request.body.status) === 0) {
      // 设备停用需要给北京发登出操作
      for (const item of device) {
        if (item.status) {
          // 设备不在线不给北京发登出  否则报500错误
          if (item.manufacturer === 'guangtuo') {
            // 如果是 广拓报警主机 发 服务器ip
            item.ip = item.intranetIp
            item.cport = item.intranetPort
          }
          requestlog.push(devLogout({ device: item, ctx }))
        }
      }
    }
    await Promise.all(requestlog)
    await Device.updateMany({ _id: { $in: ids } }, { $set: { deviceStatus: ctx.request.body.status } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 获取视频通道树2.0,报警管理模块用
 */

exports.getChannelTreeForAlarm = async ctx => {
  try {
    const oid = ctx.query.oid
    const orgType = ctx.query.orgtype
    const bigType = ctx.query.bigtype

    const orgids = []
    const filterDevices = []

    let orgs = await Org.find({ type: orgType }, 'name isroot pid type')
      .sort({ order: -1 })
      .lean()
      .exec()
    const allChildrenIds = tool.getChildren([], orgs, oid)
    allChildrenIds.unshift(oid)

    orgs = orgs.filter(item => {
      orgids.push(item._id)
      const result = allChildrenIds.includes(item._id.toString())
      return result
    })

    const devices = await Device.find(
      {
        oid: { $in: orgids },
        bigtype: bigType,
        type: {
          $in: [
            'ipc',
            'nvr',
            'softDecoder',
            'hardDecoder',
            'doorAccess',
            'ticketGate',
            'fire',
            'keyboard',
            'alarmHost',
            'fingerPrint',
            'talkServer',
            'traffic',
            'stictchingCon'
          ]
        }
      },
      'name oid status'
    )
      .lean()
      .exec()

    const deviceIds = devices.map(item => {
      // 给设备添加equip字段，表明是设备
      const newItem = Object.assign(item, { equip: true })
      return newItem._id
    })
    let resources = await Resource.find(
      { eid: { $in: deviceIds }, type: ctx.query.channeltype },
      'chan name monitortype status stream point eid nodeId'
    )
      .lean()
      .exec()
    // 过滤掉没有分配过的资源
    const orgRes = await OrgRes.find({}, 'resource')
      .lean()
      .exec()
    const distributedResIds = orgRes.map(item => item.resource.toString())
    resources = resources.filter(item => distributedResIds.includes(item._id.toString()))

    // 给device添加children资源
    const resourceObj = _.groupBy(resources, 'eid')
    for (let i = 0, l = devices.length; i < l; i++) {
      const device = devices[i]
      const resource = resourceObj[device._id]
      if (resource) {
        device.children = resource
        filterDevices.push(device)
      }
    }

    // 给org添加children设备
    const deviceObj = _.groupBy(filterDevices, 'oid')
    for (let i = 0, l = orgs.length; i < l; i++) {
      const org = orgs[i]
      const device = deviceObj[org._id]
      if (device) {
        org.children = device
      }
    }
    // 过滤自身和子机构没有设备的机构
    orgs = tool.deleteNoChildrenOrgs(orgs)
    const treeDatas = tool.transData2Tree(orgs, '_id', 'pid', true)
    const data = _.isEmpty(treeDatas) ? {} : treeDatas[0]
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
// exports.getChannelTreeForAlarm = async ctx => {
//   try {
//     let allChildrenIds = []
//     let orgs = []
//     orgs = await Org.find({ type: ctx.query.orgtype }, 'name isroot pid type')
//       .sort({ order: -1 })
//       .lean()
//       .exec()
//     allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
//     allChildrenIds.unshift(ctx.query.oid)
//     orgs = orgs.filter(item => {
//       return allChildrenIds.includes(item._id + '')
//     })
//     const orgids = orgs.map(org => org._id)
//     const devices = await Device.find(
//       { oid: { $in: orgids }, bigtype: ctx.query.bigtype, type: { $nin: ['alarmBox', 'alarmPillar'] } },
//       'name oid status'
//     )
//       .lean()
//       .exec()
//     const deviceIds = devices.map(item => item._id)
//     let resources = await Resource.find({ eid: { $in: deviceIds }, type: ctx.query.channeltype })
//       .lean()
//       .exec()
//     // 过滤掉没有分配过的资源
//     const orgRes = await OrgRes.find({}, 'resource')
//       .lean()
//       .exec()
//     const distributedResIds = orgRes.map(item => item.resource + '')
//     resources = resources.filter(item => distributedResIds.includes(item._id + ''))
//     // 给设备添加equip字段，表明是设备
//     devices.forEach(item => {
//       item = Object.assign(item, { equip: true })
//     })
//     // 给device添加children资源
//     devices.forEach(dev => {
//       dev.children = []
//       resources.forEach(res => {
//         if (res.eid + '' === dev._id + '') {
//           dev.children.push(res)
//         }
//       })
//     })
//     // 过滤没有资源的设备
//     const filterDevices = devices.filter(dev => !_.isEmpty(dev.children))
//     // 给org添加children设备
//     orgs.forEach(org => {
//       org.children = []
//       filterDevices.forEach(dev => {
//         if (dev.oid + '' === org._id + '') {
//           org.children.push(dev)
//         }
//       })
//     })
//     // 过滤自身和子机构没有设备的机构
//     orgs = tool.deleteNoChildrenOrgs(orgs)
//     const treeDatas = tool.transData2Tree(orgs, '_id', 'pid', true)
//     ctx.body = _.isEmpty(treeDatas) ? {} : treeDatas[0]
//   } catch (err) {
//     handleSysException(err)
//   }
// }
