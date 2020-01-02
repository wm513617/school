/*
 * @Author: wanglei
 * @Date: 2019-04-11 14:45:45
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-19 16:12:24
 */
'use strict'
const mongoose = require('mongoose')
const FlightModel = mongoose.model('Flight')
const { handleSysException } = require('../../../common/tools')

exports.getAllFlights = async (ctx) => {
  ctx.set('flightinfo', encodeURI('飞行漫游-获取所有飞行路线'))
  try {
    const flights = await FlightModel.find({})
      .lean()
      .exec()
    ctx.body = flights
  } catch (error) {
    handleSysException(error)
  }
}

exports.getOneFlight = async (ctx) => {
  ctx.set('flightinfo', encodeURI('飞行漫游-获取单个飞行路线'))
  try {
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不全' })
    }
    const flight = await FlightModel.findById(id)
      .lean()
      .exec()
    ctx.body = flight
  } catch (error) {
    handleSysException(error)
  }
}

exports.updateOneFlight = async (ctx) => {
  ctx.set('flightinfo', encodeURI('飞行漫游-添加飞行路线'))
  try {
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不全' })
    }
    const flight = ctx.request.body
    // mongoose findOneAndUpdate 方法默认关闭验证器功能
    await FlightModel.findOneAndUpdate({_id: id}, flight, { upsert: true, runValidators: true })
    ctx.status = 200
    ctx.body = {
      flightId: id
    }
  } catch (error) {
    handleSysException(error)
  }
}

exports.deleteOneFilght = async (ctx) => {
  ctx.set('flightinfo', encodeURI('飞行漫游-删除飞行路线'))
  try {
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不全' })
    }
    // 删除飞行路线
    const flight = await FlightModel.findByIdAndRemove(id).exec()
    ctx.status = 200
    ctx.body = {
      flightId: flight.id
    }
  } catch (error) {
    handleSysException(error)
  }
}

exports.addOneFlight = async (ctx) => {
  ctx.set('flightinfo', encodeURI('飞行漫游-添加飞行路线'))
  try {
    const flight = ctx.request.body
    if (!flight) {
      ctx.throw(500, { code: 2001, message: '参数不全' })
    }
    const newFlight = await FlightModel.create(flight)
    ctx.body = {
      flightId: newFlight.id
    }
  } catch (error) {
    handleSysException(error)
  }
}
