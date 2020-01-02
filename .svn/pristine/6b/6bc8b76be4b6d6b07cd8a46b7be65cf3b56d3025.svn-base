/*
 * @Author: wanglei
 * @Date: 2019-04-29 18:37:51
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-06-03 10:29:52
 */
/**
 * 将 Grid、Building、Resource、PatrolPoint、Security 表中的 principal 同步到
 * Principal 新表
 * 网格、楼宇、视频点位、报警点位、消防点位、求助点位、巡更点位、门禁点位、单兵人员
 * 为了实现通讯录这个新功能，需将以前的各点位的联系人统一存放到新表
 *
 * 执行顺序
 * 1. 进行项目部署的目录
 * 2. 执行 cd server/script 命令，进入到该脚本所在的目录下
 * 3. 执行 node syncPrincipal.js 命令
 * 4. 查看打印日志，没有报错即脚本执行完成
 */

'use strict'
const mongoose = require('mongoose')
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/device/device.model')
require('../api/map/building/building.model')
require('../api/map/grid/grid.model')
require('../api/map/storey/storey.model')
require('../api/sys/resource/resource.model')
require('../api/sys/sentry/security.model')
require('../api/sys/sentry/points.model')
require('../api/map/addressbook/addressbook.model')
require('../api/map/addressbook/principal.model')
const Building = mongoose.model('Building')
const Grid = mongoose.model('Grid')
const Storey = mongoose.model('Storey')
const Resource = mongoose.model('Resource')
// const OrgRes = mongoose.model('OrgRes')
const Security = mongoose.model('Security')
const PatrolPoint = mongoose.model('PatrolPoint')
const AddressBook = mongoose.model('AddressBook')
const Principal = mongoose.model('Principal')
const config = require('../../config')
const { AddressBookEnum } = require('../common/enum')
const _ = require('lodash')
console.log(config.backend.mongo.uri)
mongoose.connect(config.backend.mongo.uri)
// mongoose.connect('mongodb://192.168.20.7/bs-security')

async function syncPrincipal () {
  try {
    const [builds, grids, storeys, resources, securitys, patrols] = await Promise.all([
      Building.find({}, 'pid mapId name').populate('').lean().exec(),
      Grid.find({}, 'pids mapId name').lean().exec(),
      Storey.find({}, 'pid mapId name').lean().exec(),
      Resource.find({}, 'point.principal point.mapId eid type').populate('eid', 'type').lean().exec(),
      Security.find({}, 'realname phone').lean().exec(),
      PatrolPoint.find({}, 'charger phone point.mapid').lean().exec()
    ])
    let principalTasks = []
    let addressTasks = []
    // 楼宇
    builds.forEach(element => {
      const addressPromise = AddressBook.create({
        groupId: element._id,
        mapId: element.mapId || null,
        type: AddressBookEnum.BUILDING
      })
      addressTasks.push(addressPromise)
      element.pid.map(async item => {
        const principalPromise = await Principal.create({
          type: AddressBookEnum.BUILDING,
          buildId: element._id,
          groupName: element.name,
          name: item.name || '',
          mobile: item.mobile || '',
          mapId: element.mapId || null
        })
        await Building.findByIdAndUpdate(element._id, { pid: [] }).lean().exec()
        await Building.findByIdAndUpdate(element._id, { $push: { pid: principalPromise._id } }).lean().exec()
      })
    })
    // 网格
    grids.forEach(element => {
      const addressPromise = AddressBook.create({
        groupId: element._id,
        mapId: element.mapId || null,
        type: AddressBookEnum.GRID
      })
      addressTasks.push(addressPromise)
      element.pids.map(async item => {
        const principalPromise = await Principal.create({
          type: AddressBookEnum.GRID,
          gridId: element._id,
          groupName: element.name,
          name: item.name || '',
          mobile: item.mobile || '',
          mapId: element.mapId || null
        })
        await Grid.findByIdAndUpdate(element._id, { pids: [] })
        await Grid.findByIdAndUpdate(element._id, { $push: { pids: principalPromise._id } }).lean().exec()
      })
    })
    // 巡更点位
    patrols.map(async item => {
      const mapId = item.point ? item.point.mapid : null
      const addressPromise = AddressBook.create({
        groupId: item._id,
        mapId: mapId,
        type: AddressBookEnum.PATROL_POINT
      })
      addressTasks.push(addressPromise)
      const principalPromise = await Principal.create({
        type: AddressBookEnum.PATROL_POINT,
        patrolId: item._id,
        groupName: '巡更点位',
        name: item.charger || '',
        mobile: item.phone || '',
        mapId: mapId
      })
      await PatrolPoint.findByIdAndUpdate(item._id, { principal: principalPromise._id }).lean().exec()
    })
    // 资源点位
    for (let element of resources) {
      if (_.isUndefined(element.point) || _.isUndefined(element.point.principal)) {
        continue
      } else {
        element.point.principal.map(async item => {
          const conditions = getPointTypeAndGroupName(element.type, element.eid.type)
          const principalPromise = await Principal.create({
            type: conditions.pointType,
            groupName: conditions.groupName,
            resourceId: element._id,
            name: item.name || '',
            mobile: item.mobile || '',
            mapId: element.point.mapId || null
          })
          await Resource.findByIdAndUpdate(element._id, { 'point.principal': [] })
          await Resource.findByIdAndUpdate(element._id, { $push: { 'point.principal': principalPromise._id } })
          // principalTasks.push(principalPromise)
          const addressPromise = AddressBook.create({
            groupId: element._id,
            mapId: element.point.mapId || null,
            type: conditions.pointType
          })
          addressTasks.push(addressPromise)
        })
      }
    }
    // 单兵人员
    securitys.map(item => {
      const principalPromise = Principal.create({
        type: AddressBookEnum.SECURITY_PERSON,
        securityId: item._id,
        groupName: '单兵人员',
        name: item.realname || '',
        mobile: item.phone || ''
      })
      principalTasks.push(principalPromise)
      // 单兵没有 mapId
      const addressPromise = AddressBook.create({
        groupId: item._id,
        mapId: item.mapId || null,
        type: AddressBookEnum.SECURITY_PERSON
      })
      addressTasks.push(addressPromise)
    })
    // 楼层
    storeys.map(async item => {
      const principalPromise = await Principal.create({
        type: AddressBookEnum.STOREY,
        storeyId: item._id,
        groupName: item.name,
        name: item.pid.name || '',
        mobile: item.pid.mobile || '',
        mapId: item.mapId
      })
      await Storey.findByIdAndUpdate(item._id, { pid: principalPromise._id }).lean().exec()
    })
    try {
      const principalResults = await Promise.all(principalTasks)
      console.log('sync principal data: done')
      console.log('insert security person data count: ' + principalResults.length)
      const addressResults = await Promise.all(addressTasks)
      console.log('sync addressbook data: done')
      console.log('insert data count: ' + addressResults.length)
      console.log('脚本执行完毕')
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }
}

// 根据 type 类型来获取需要更新的数据
function getPointTypeAndGroupName (type, eidType) {
  let retObj = {
    pointType: '',
    groupName: ''
  }
  const alarmHelpTypes = ['alarmPillar', 'alarmBox']
  switch (type) {
    case 0:
      if (alarmHelpTypes.includes(eidType)) {
        // 求助点位
        retObj.pointType = AddressBookEnum.HELP_POINT
        retObj.groupName = '求助点位'
      } else {
        // 视频点位
        retObj.pointType = AddressBookEnum.VIDEO_POINT
        retObj.groupName = '视频点位'
      }
      break
    case 1:
      // 报警点位
      retObj.pointType = AddressBookEnum.ALARM_POINT
      retObj.groupName = '报警点位'
      break
    case 11:
      // 消防点位
      retObj.pointType = AddressBookEnum.FIRE_POINT
      retObj.groupName = '消防点位'
      break
    case 9:
      // 报警点位
      retObj.pointType = AddressBookEnum.ALARM_POINT
      retObj.groupName = '报警点位'
      break
    case 4:
      // 门禁点位
      retObj.pointType = AddressBookEnum.DOOR_POINT
      retObj.groupName = '门禁点位'
      break
    default:
      break
  }
  return retObj
}

syncPrincipal().then(() => {
  process.exit(1)
}).catch((err) => {
  console.log(err)
})
