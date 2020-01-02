'use strict'
const mongoose = require('mongoose')
const Building = mongoose.model('Building')
const Grid = mongoose.model('Grid')
const Storey = mongoose.model('Storey')
const AddressBook = mongoose.model('AddressBook')
const Principal = mongoose.model('Principal')
const Security = mongoose.model('Security')
const Resource = mongoose.model('Resource')
const PatrolPoint = mongoose.model('PatrolPoint')
const MapList = mongoose.model('MapList')
const { AddressBookEnum } = require('../../common/enum')
// const _ = require('lodash')

exports.upgrade = async () => {
  try {
    await updateAddressBook()
  } catch (error) {
    throw Error(error)
  }
}

const updateAddressBook = async () => {
  try {
    const {
      grids,
      builds,
      storeys,
      resources,
      securitys,
      patrols,
      addressBooks,
      principals,
      mapList
    } = await findAllPrincipals()
    await createPointAddressBook(mapList)
    // 先执行创建楼宇的，再执行创建楼层的
    await createBuildAddressBook(builds)
    await createStoreyAddressBook(storeys)
    await Promise.all([
      createGridAddressBook(grids),
      createResourceAddressBook(resources),
      createPatrolPointAddressBook(patrols),
      createSecurityAddressBook(securitys)
    ])
    await deleteOldAddressBook(addressBooks, principals)
  } catch (error) {
    throw Error(error)
  }
}

const findAllPrincipals = async () => {
  try {
    const [
      grids,
      builds,
      storeys,
      resources,
      securitys,
      patrols,
      addressBooks,
      principals,
      mapList
    ] = await Promise.all([
      Grid.find({}, '_id pids mapId name')
        .populate({ path: 'pids', select: '_id name mobile collect' })
        .lean()
        .exec(),
      Building.find({}, '_id pid mapId name')
        .populate({ path: 'pid', select: '_id name mobile collect' })
        .lean()
        .exec(),
      Storey.find({}, '_id pid mapId name bid')
        .populate({ path: 'pid', select: '_id name mobile collect' })
        .lean()
        .exec(),
      Resource.find({ point: { $exists: true } }, '_id point.principal point.mapId eid type')
        .populate([{ path: 'eid', select: 'type' }, { path: 'point.principal', select: '_id name mobile collect' }])
        .lean()
        .exec(),
      Security.find({}, '_id realname phone')
        .lean()
        .exec(),
      PatrolPoint.find({ point: { $exists: true } }, '_id charger phone point.mapid')
        .populate({ path: 'principal', select: '_id name mobile collect' })
        .lean()
        .exec(),
      AddressBook.find({}, '_id')
        .lean()
        .exec(),
      Principal.find({}, '_id')
        .lean()
        .exec(),
      MapList.find({}, '_id')
        .lean()
        .exec()
    ])
    return {
      grids: grids,
      builds: builds,
      storeys: storeys,
      resources: resources,
      securitys: securitys,
      patrols: patrols,
      addressBooks: addressBooks,
      principals: principals,
      mapList: mapList
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建视频、报警、消防、求助、巡更点位分组
const createPointAddressBook = async mapList => {
  try {
    for (const map of mapList) {
      await AddressBook.create([
        {
          name: '视频点位',
          order: 10001,
          type: AddressBookEnum.VIDEO_POINT,
          mapId: map._id
        },
        {
          name: '报警点位',
          order: 10002,
          type: AddressBookEnum.ALARM_POINT,
          mapId: map._id
        },
        {
          name: '消防点位',
          order: 10003,
          type: AddressBookEnum.FIRE_POINT,
          mapId: map._id
        },
        {
          name: '求助点位',
          order: 10004,
          type: AddressBookEnum.HELP_POINT,
          mapId: map._id
        },
        {
          name: '巡更点位',
          order: 10005,
          type: AddressBookEnum.PATROL_POINT,
          mapId: map._id
        }
      ])
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建网格通讯录数据
const createGridAddressBook = async grids => {
  try {
    for (const grid of grids) {
      const { order = 0, collect = false } =
        (await AddressBook.findOne({ groupId: grid._id })
          .lean()
          .exec()) || {}
      const { _id: addressBookId } = await AddressBook.create({
        type: AddressBookEnum.GRID,
        mapId: grid.mapId,
        name: grid.name,
        order: order,
        collect: collect
      })
      for (const item of grid.pids) {
        if (!item.name && !item.mobile) {
          await Grid.findByIdAndUpdate(grid._id, { $pull: { pids: item._id } })
            .lean()
            .exec()
          continue
        }
        const { _id: principalId } = await Principal.create({
          name: item.name,
          mobile: item.mobile,
          collect: item.collect || false,
          addressBookId: addressBookId,
          mapId: grid.mapId,
          type: AddressBookEnum.GRID,
          gridId: grid._id
        })
        await Grid.findByIdAndUpdate(grid._id, { $push: { pids: principalId } })
      }
      await Grid.findByIdAndUpdate(grid._id, { addressBookId: addressBookId })
        .lean()
        .exec()
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建楼宇通讯录数据
const createBuildAddressBook = async builds => {
  try {
    for (const build of builds) {
      const { order = 0, collect = false } =
        (await AddressBook.findOne({ groupId: build._id + '' })
          .lean()
          .exec()) || {}
      const { _id: addressBookId } = await AddressBook.create({
        type: AddressBookEnum.BUILDING,
        mapId: build.mapId,
        name: build.name,
        order: order,
        collect: collect
      })
      for (let item of build.pid) {
        if (!item.name && !item.mobile) {
          await Building.findByIdAndUpdate(build._id, { $pull: { pid: item._id } })
            .lean()
            .exec()
          continue
        }
        const { _id: principalId } = await Principal.create({
          name: item.name,
          mobile: item.mobile,
          collect: item.collect || false,
          addressBookId: addressBookId,
          mapId: build.mapId,
          type: AddressBookEnum.BUILDING,
          buildId: build._id
        })
        await Building.findByIdAndUpdate(build._id, { $push: { pid: principalId } })
      }
      await Building.findByIdAndUpdate(build._id, { addressBookId: addressBookId })
        .lean()
        .exec()
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建楼层通讯录数据，需要等楼宇的创建好之后再执行
const createStoreyAddressBook = async storeys => {
  try {
    for (const storey of storeys) {
      const { addressBookId } =
        (await Building.findById(storey.bid, 'addressBookId mapId')
          .lean()
          .exec()) || {}
      if (!addressBookId) {
        continue
      }
      const { _id: principalId } = await Principal.create({
        name: _.get(storey, 'pid.name', ''),
        mobile: _.get(storey, 'pid.mobile', ''),
        type: AddressBookEnum.STOREY,
        addressBookId: addressBookId,
        mapId: storey.mapId,
        storeyId: storey._id
      })
      await Storey.findByIdAndUpdate(storey._id, { pid: principalId })
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建视频、报警、求助、消防、求助点位通讯录数据
const createResourceAddressBook = async resources => {
  try {
    for (const resource of resources) {
      const pointType = getPointType(resource.type, resource.eid.type)
      const { _id: addressBookId } = await AddressBook.findOne({ type: pointType, mapId: resource.point.mapId })
        .lean()
        .exec()
      for (const item of resource.point.principal) {
        if (!item.name && !item.mobile) {
          await Resource.findByIdAndUpdate(resource._id, { $pull: { 'point.principal': item._id } })
          continue
        }
        const { _id: principalId } = await Principal.create({
          name: item.name,
          mobile: item.mobile,
          collect: item.collect || false,
          addressBookId: addressBookId,
          mapId: resource.point.mapId,
          type: pointType,
          resourceId: resource._id
        })
        await Resource.findByIdAndUpdate(resource._id, { $push: { 'point.principal': principalId } })
      }
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建巡更点位通讯录数据
const createPatrolPointAddressBook = async patrols => {
  try {
    for (const patrol of patrols) {
      const { _id: addressBookId } = await AddressBook.findOne({
        type: AddressBookEnum.PATROL_POINT,
        mapId: patrol.point.mapid
      })
        .lean()
        .exec()
      if (patrol.principal.name && patrol.principal.mobile) {
        const { _id: principalId } = await Principal.create({
          name: patrol.principal.name,
          mobile: patrol.principal.mobile,
          collect: patrol.principal.collect || false,
          addressBookId: addressBookId,
          mapId: patrol.point.mapid,
          type: AddressBookEnum.PATROL_POINT,
          patrolId: patrol._id
        })
        await PatrolPoint.findByIdAndUpdate(patrol._id, { principal: principalId })
          .lean()
          .exec()
      }
    }
  } catch (error) {
    throw Error(error)
  }
}

// 创建单兵人员通讯录数据
const createSecurityAddressBook = async securitys => {
  try {
    const { _id: addressBookId } = await AddressBook.create({
      name: '单兵人员',
      order: 10006,
      type: AddressBookEnum.SECURITY_PERSON
    })
    for (const security of securitys) {
      await Principal.create({
        name: security.realname,
        mobile: security.phone || '',
        type: AddressBookEnum.SECURITY_PERSON,
        securityId: security._id,
        addressBookId: addressBookId
      })
    }
  } catch (error) {
    throw Error(error)
  }
}

// 删除以前通讯录旧有的数据
const deleteOldAddressBook = async (addressBooks, principals) => {
  try {
    addressBooks = addressBooks.map(item => item._id + '')
    principals = principals.map(item => item._id + '')
    await Promise.all([
      AddressBook.deleteMany({ _id: { $in: addressBooks } }),
      Principal.deleteMany({ _id: { $in: principals } })
    ])
  } catch (error) {
    throw Error(error)
  }
}

// 根据 type 类型来获取需要更新的数据
const getPointType = (type, eidType) => {
  let pointType = ''
  const alarmHelpTypes = ['alarmPillar', 'alarmBox']
  switch (type) {
    case 0:
      if (alarmHelpTypes.includes(eidType)) {
        // 求助点位
        pointType = AddressBookEnum.HELP_POINT
      } else {
        // 视频点位
        pointType = AddressBookEnum.VIDEO_POINT
      }
      break
    case 1:
      // 报警点位
      pointType = AddressBookEnum.ALARM_POINT
      break
    case 11:
      // 消防点位
      pointType = AddressBookEnum.FIRE_POINT
      break
    case 9:
      // 报警点位
      pointType = AddressBookEnum.ALARM_POINT
      break
    case 4:
      // 门禁点位
      pointType = AddressBookEnum.DOOR_POINT
      break
    default:
      break
  }
  return pointType
}
