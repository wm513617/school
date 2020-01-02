/*
 * @Author: hansen.liuhao
 * @Date: 2018-10-18 11:43:38
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-05-13 14:22:13
 */
const mongoose = require('mongoose')
// const paging = require('../paging')
const moment = require('moment')
const RecodeCopyLog = mongoose.model('RecodeCopyLog')
const Devpatrol = mongoose.model('Devpatrol')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
const paging = require('../../paging')

class logService {
  // 列表
  async getReAll (ctx) {
    try {
      const query = {}
      if (ctx.query.seek) {
        // query.name = {
        //   $regex: ctx.query.seek + '' || ''
        // }
        query.$or = [
          {"name": {$regex: ctx.query.seek + '' || ''}},
          {"user": {$regex: ctx.query.seek + '' || ''}}
        ]
      }
      if (ctx.query.time) {
        query.time = {
          $gte: Number(
            moment(Number(ctx.query.time))
              .startOf('day')
              .format('x')
          ),
          $lte: Number(
            moment(Number(ctx.query.time))
              .endOf('day')
              .format('x')
          )
        }
      }
      const results = await paging.listQuery(
        RecodeCopyLog,
        query,
        'name time info resourceList associate recodeStatus mark',
        '',
        ctx.query.page,
        { path: 'resourceList.resource', select: 'name' },
        ctx
      )
      return results
    } catch (error) {
      throw error
    }
  }
  // 创建录像拷贝记录
  async createRe (body) {
    try {
      const recodeLog = new RecodeCopyLog(body)
      const results = await recodeLog.save()
      return results
    } catch (error) {
      throw error
    }
  }
  // 更新录像拷贝记录
  async updateRe (id, body) {
    try {
      const results = RecodeCopyLog.findByIdAndUpdate(id, body).exec()
      return results
    } catch (error) {
      throw error
    }
  }
  // 删除
  async deleteRe (id) {
    try {
      const results = RecodeCopyLog.deleteMany({ _id: { $in: id } }).exec()
      return results
    } catch (error) {
      throw error
    }
  }
  // 列表
  async getDeAll (ctx) {
    try {
      const query = {
        checkName: {
          $regex: ctx.query.seek + '' || ''
        }
      }
      if (ctx.query.time) {
        query.time = {
          $gte: Number(
            moment(Number(ctx.query.time))
              .startOf('day')
              .format('x')
          ),
          $lte: Number(
            moment(Number(ctx.query.time))
              .endOf('day')
              .format('x')
          )
        }
      }
      const results = await paging.listQuery(
        Devpatrol,
        query,
        'checkName time devList contact contactTime engineerName phone',
        '',
        ctx.query.page,
        { path: 'devList.device', select: 'name' },
        ctx
      )
      return results
    } catch (error) {
      throw error
    }
  }
  // 创建设备巡查记录
  async createDe (body) {
    try {
      const devpatrol = new Devpatrol(body)
      const results = await devpatrol.save()
      return results
    } catch (error) {
      throw error
    }
  }
  // 更新设备巡查记录
  async updateDe (id, body) {
    try {
      const results = Devpatrol.findByIdAndUpdate(id, body).exec()
      return results
    } catch (error) {
      throw error
    }
  }
  // 删除
  async deleteDe (id) {
    try {
      const results = Devpatrol.deleteMany({ _id: { $in: id } }).exec()
      return results
    } catch (error) {
      throw error
    }
  }

  //  result
  async getDevice () {
    try {
      const results = Device.find({ bigtype: 0 }, '_id name').exec()
      return results
    } catch (error) {
      throw error
    }
  }
  //  result
  async getResource () {
    try {
      const results = Resource.find({ type: 0 }, '_id name').exec()
      return results
    } catch (error) {
      throw error
    }
  }
}

module.exports = logService
