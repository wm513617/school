/*
 * @Description: 通讯录
 * @Author: wanglei
 * @Date: 2019-10-23 14:09:40
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-01 10:28:07
 */
'use strict'
const AddressBook = require('mongoose').model('AddressBook')
const Principal = require('mongoose').model('Principal')
const Grid = require('mongoose').model('Grid')
const Building = require('mongoose').model('Building')
const Security = require('mongoose').model('Security')
const { handleSysException } = require('../../../common/tools')
const { AddressBookEnum } = require('../../../common/enum')

exports.getAddressBook = async ctx => {
  try {
    const mapId = ctx.query.mapId || ''
    if (!mapId) {
      ctx.throw(500, { code: 4001, message: '缺少地图参数' })
    }
    const addressBooks = await AddressBook.find(
      { $or: [{ mapId: mapId }, { type: AddressBookEnum.SECURITY_PERSON }] },
      'name type collect order mapId'
    )
      .sort({ order: 1 })
      .lean()
      .exec()
    for (let item of addressBooks) {
      const principalArr = await Principal.find({ addressBookId: item._id }, '_id addressBookId')
        .lean()
        .exec()
      if (principalArr.length) {
        item.hasPrincipal = true
      } else {
        item.hasPrincipal = false
      }
    }
    const invaildMapId = addressBooks.map(item => item.type !== AddressBookEnum.SECURITY_PERSON)
    if (!invaildMapId.length) {
      let docArr = [
        { type: AddressBookEnum.VIDEO_POINT, mapId: mapId, name: '视频点位' },
        { type: AddressBookEnum.ALARM_POINT, mapId: mapId, name: '报警点位' },
        { type: AddressBookEnum.FIRE_POINT, mapId: mapId, name: '消防点位' },
        { type: AddressBookEnum.HELP_POINT, mapId: mapId, name: '求助点位' },
        { type: AddressBookEnum.PATROL_POINT, mapId: mapId, name: '巡更点位' }
      ]
      await AddressBook.create(docArr)
      const invaildMapIdAddressBook = await AddressBook.find(
        { $or: [{ mapId: mapId }, { type: AddressBookEnum.SECURITY_PERSON }] },
        'name type collect order mapId'
      )
        .sort({ order: 1 })
        .lean()
        .exec()
      ctx.body = invaildMapIdAddressBook
    }
    ctx.body = addressBooks
  } catch (error) {
    handleSysException(error)
  }
}

exports.getPrincipal = async ctx => {
  try {
    const id = ctx.params.id
    const principals = await Principal.find({ addressBookId: id })
      .populate([{ path: 'storeyId', select: 'name' }])
      .lean()
      .exec()
    ctx.body = principals
  } catch (error) {
    handleSysException(error)
  }
}

exports.search = async ctx => {
  try {
    const { keyword = '', mapId = '' } = ctx.query || {}
    if (!keyword) {
      ctx.throw(500, { code: 4001, message: '缺少搜索关键字' })
    }
    if (!mapId) {
      ctx.throw(500, { code: 4001, message: '缺少地图参数' })
    }
    const addressBooks = await AddressBook.find({
      $or: [{ mapId: mapId }, { type: AddressBookEnum.SECURITY_PERSON }],
      name: { $regex: keyword }
    })
      .lean()
      .exec()
    const principals = await Principal.find({
      $and: [
        { $or: [{ mapId: mapId }, { type: AddressBookEnum.SECURITY_PERSON }] },
        { $or: [{ name: { $regex: keyword } }, { mobile: { $regex: keyword } }] }
      ]
    })
      .populate([
        { path: 'addressBookId', select: 'type name collect order mapId _id' },
        { path: 'storeyId', select: 'name _id' }
      ])
      .lean()
      .exec()
    let addressBookMap = new Map()
    for (let item of addressBooks) {
      const obj = {
        _id: item._id + '',
        name: item.name,
        order: item.order,
        collect: item.collect,
        type: item.type,
        mapId: item.mapId,
        storeys: [],
        principals: []
      }
      addressBookMap.set(item._id + '', obj)
    }
    for (let item of principals) {
      if (!item.addressBookId) {
        continue
      }
      if (addressBookMap.has(item.addressBookId._id + '')) {
        if (item.type === AddressBookEnum.STOREY) {
          addressBookMap.get(item.addressBookId._id + '').storeys.push({
            name: item.storeyId.name,
            principal: { _id: item._id + '', name: item.name, mobile: item.mobile, collect: item.collect }
          })
        } else {
          addressBookMap.get(item.addressBookId._id + '').principals.push({
            _id: item._id,
            name: item.name,
            mobile: item.mobile,
            mapId: item.mapId,
            collect: item.collect,
            mobile2: item.mobile2 || '',
            telephone: item.telephone || '',
            extension: item.extension || ''
          })
        }
      } else {
        const obj = {
          _id: item.addressBookId._id + '',
          name: item.addressBookId.name,
          type: item.addressBookId.type,
          order: item.addressBookId.order,
          collect: item.addressBookId.collect,
          mapId: item.addressBookId.mapId,
          storeys: [],
          principals: []
        }
        if (item.type === AddressBookEnum.STOREY) {
          obj.storeys.push({
            name: item.storeyId.name,
            principal: { _id: item._id + '', name: item.name, mobile: item.mobile, collect: item.collect }
          })
        } else {
          obj.principals.push({
            _id: item._id + '',
            name: item.name,
            mobile: item.mobile,
            collect: item.collect,
            mobile2: item.mobile2 || '',
            telephone: item.telephone || '',
            extension: item.extension || ''
          })
        }
        addressBookMap.set(item.addressBookId._id + '', obj)
      }
    }
    ctx.body = Array.from(addressBookMap.values())
  } catch (error) {
    handleSysException(error)
  }
}

exports.searchCollectPrincipal = async ctx => {
  try {
    const { keyword = '', mapId = '' } = ctx.query || {}
    const principals = await Principal.find({
      collect: true,
      $and: [
        { $or: [{ mapId: mapId }, { type: AddressBookEnum.SECURITY_PERSON }] },
        { $or: [{ name: { $regex: keyword } }, { mobile: { $regex: keyword } }] }
      ]
    })
      .lean()
      .exec()
    ctx.body = principals
  } catch (error) {
    handleSysException(error)
  }
}

exports.getCollectPrincipal = async ctx => {
  try {
    const mapId = ctx.query.mapId
    const principals = await Principal.find({
      $or: [{ mapId: mapId }, { type: AddressBookEnum.SECURITY_PERSON }],
      collect: true
    })
      .and([{ name: { $nin: ['', null, undefined] } }, { mobile: { $nin: ['', null, undefined] } }])
      .lean()
      .exec()
    ctx.body = principals
  } catch (error) {
    handleSysException(error)
  }
}

exports.addPrincipal = async ctx => {
  try {
    const addressBookId = ctx.params.id
    const body = ctx.request.body
    const { type = '', principals = [], mapId = '' } = await AddressBook.findById(
      addressBookId,
      'type principals mapId'
    )
      .lean()
      .exec()
    if (!body.name && !body.mobile) {
      ctx.throw(500, { code: 4001, message: '姓名和电话不能为空' })
    }
    if (body.name.length > 16) {
      ctx.throw(500, { code: 4001, message: '姓名不能超过16个字符' })
    }
    if (body.mobile.length > 18) {
      ctx.throw(500, { code: 4001, message: '电话不能超过16个字符' })
    }
    if (type === AddressBookEnum.SECURITY_PERSON) {
      ctx.throw(500, { code: 4001, message: '单兵人员不支持增加人员' })
    }
    if ([AddressBookEnum.BUILDING, AddressBookEnum.GRID].includes(type) && principals.length >= 3) {
      ctx.throw(500, { code: 4001, message: '已超过限定人数，不能新增人员' })
    }
    const { _id: principalId } = await Principal.create(
      Object.assign(body, { mapId: mapId, addressBookId: addressBookId, type: type })
    )
    if (type === AddressBookEnum.BUILDING) {
      await Building.findOneAndUpdate({ addressBookId: addressBookId, $push: { pid: principalId } })
        .lean()
        .exec()
    }
    if (type === AddressBookEnum.GRID) {
      await Grid.findOneAndUpdate({ addressBookId: addressBookId, $push: { pids: principalId } })
        .lean()
        .exec()
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.addGroup = async ctx => {
  try {
    const body = ctx.request.body
    const { name = '', mapId = '' } = body
    if (!name) {
      ctx.throw(500, { code: 4001, message: '缺少组名称' })
    }
    if (name.length > 16) {
      ctx.throw(500, { code: 4001, message: '组名称超过指定长度' })
    }
    if (!mapId) {
      ctx.throw(500, { code: 4001, message: '缺少地图参数' })
    }
    const count = await AddressBook.countDocuments({ type: AddressBookEnum.OTHER, mapId: mapId })
    if (count > 100) {
      ctx.throw(500, { code: 4001, message: '新建分组超过指定个数' })
    }
    await AddressBook.create(Object.assign(body, { type: AddressBookEnum.OTHER }))
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.updatePrincipal = async ctx => {
  try {
    const id = ctx.params.id
    const body = ctx.request.body
    const principal = await Principal.findByIdAndUpdate(id, body)
      .lean()
      .exec()
    if (principal.type === AddressBookEnum.SECURITY_PERSON) {
      await Security.findByIdAndUpdate(principal.securityId, { phone: body.mobile })
        .lean()
        .exec()
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.collectPrincipal = async ctx => {
  try {
    const id = ctx.params.id
    const body = ctx.request.body
    const { addressBookId = '' } = await Principal.findByIdAndUpdate(id, body)
      .lean()
      .exec()
    const collects = await Principal.find({ addressBookId: addressBookId })
      .lean()
      .exec()
    if (collects.every(item => item.collect === body.collect)) {
      await AddressBook.findByIdAndUpdate(addressBookId, { collect: body.collect })
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 传分组的 _id
exports.orderGroup = async ctx => {
  try {
    const orders = ctx.request.body
    if (orders.length === 0) {
      ctx.throw(500, { code: 4001, message: '参数不正确' })
    }
    for (let [index, item] of orders.entries()) {
      await AddressBook.findByIdAndUpdate(item, { order: index })
        .lean()
        .exec()
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.updateGroup = async ctx => {
  try {
    const id = ctx.params.id
    const { name = '' } = ctx.request.body
    if (!name) {
      ctx.throw(500, { code: 4001, message: '缺少姓名' })
    }
    await AddressBook.findByIdAndUpdate(id, { name: name })
      .lean()
      .exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.collectGroup = async ctx => {
  try {
    const id = ctx.params.id
    const body = ctx.request.body
    await AddressBook.findByIdAndUpdate(id, body)
      .lean()
      .exec()
    await Principal.updateMany({ addressBookId: id }, body)
      .lean()
      .exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.deleteGroup = async ctx => {
  try {
    const id = ctx.params.id
    const type = AddressBookEnum.OTHER
    await Promise.all([
      AddressBook.findOneAndRemove({ _id: id, type: type })
        .lean()
        .exec(),
      Principal.deleteMany({ addressBookId: id })
        .lean()
        .exec()
    ])
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.deletePrincipal = async ctx => {
  try {
    const id = ctx.params.id
    const principal = await Principal.findById(id)
      .lean()
      .exec()
    if (principal.type === AddressBookEnum.SECURITY_PERSON) {
      ctx.throw(500, { code: 4001, message: '单兵人员不支持删除' })
    }
    const data = await Principal.findByIdAndRemove(id)
      .lean()
      .exec()
    if (data.type === AddressBookEnum.BUILDING && data.buildId) {
      await Building.findByIdAndUpdate(data.buildId, { $pull: { pid: data._id } })
    } else if (data.type === AddressBookEnum.GRID && data.gridId) {
      await Grid.findByIdAndUpdate(data.gridId, { $pull: { pids: data._id } })
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
