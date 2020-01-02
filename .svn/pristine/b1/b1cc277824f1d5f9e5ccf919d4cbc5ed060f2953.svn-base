/*
 * 诊断服务器操作类
 * @Author: lushengying
 * @Date: 2018-10-23 10:54:45
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-11-09 17:04:47
 */

const ServerModel = require('mongoose').model('Server')
const OrgModel = require('mongoose').model('Org')
const OrgResModel = require('mongoose').model('OrgRes')
const ResourceModel = require('mongoose').model('Resource')
const paging = require('../../../paging')
// const req = require('../../..//bstar/req.js').req
const _ = require('lodash')
const rp = require('request-promise')
const moment = require('moment')

class Server {
  // 根据_id进行查询
  async findById (id) {
    try {
      const results = await ServerModel.findById(id).exec()
      return results
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 根据_id进行查询
  async find (search) {
    try {
      const results = await ServerModel.find(search).exec()
      return results
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 创建服务器
  async create (body) {
    try {
      const results = await ServerModel.create(body)
      return results
    } catch (err) {
      throw new Error({ msg: '创建失败', info: err })
    }
  }

  // 更新服务器
  async update (search, update) {
    try {
      const results = await ServerModel.updateOne(search, update)
      return results
    } catch (err) {
      throw new Error({ msg: '更新失败', info: err })
    }
  }
  // 删除服务器
  async delete (id) {
    try {
      const results = await ServerModel.findByIdAndDelete(id)
      return results
    } catch (err) {
      throw new Error({ msg: '删除失败', info: err })
    }
  }

  // 服务器总数
  async count (search) {
    try {
      const results = await ServerModel.countDocuments(search)
      return results
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 诊断服务器列表
  async page (ctx) {
    try {
      const resultObj = await paging.listQuery(
        ServerModel,
        ctx.query.select,
        'name ip port type remark',
        'order',
        ctx.query.page,
        '',
        ctx
      )
      return resultObj.results
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 获取指定机构
  async getOrg (search, selection) {
    try {
      return await OrgModel.find(search, selection)
        .lean()
        .sort('order')
        .exec()
    } catch (error) {
      throw new Error({ msg: '查询失败', info: error })
    }
  }

  // 获取指定机构下所有资源
  async getOrgRes (search) {
    try {
      const orgResData = await OrgResModel.find(search).exec()
      const data = []
      orgResData.forEach(item => {
        item.resource && data.push(item.resource)
      })
      return data
    } catch (error) {
      throw new Error({ msg: '查询失败', info: error })
    }
  }

  // 获取机构下展示通道
  async resourcePage (search, selection, sort, pageObj, population, ctx) {
    try {
      const resultObj = await paging.listQuery(ResourceModel, search, selection, sort, pageObj, population, ctx)
      return resultObj.results
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 获取机构下所有通道
  async resourceAll (search, selection, populate) {
    try {
      const results = await ResourceModel.find(search, selection)
        .populate(populate)
        .exec()
      return results
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 获取通道的诊断服务器结果
  async getVideoDiagnosisAll (search, ctx) {
    try {
      const server = await this.find({}) // 获取当前全部服务器
      if (_.isEmpty(server)) {
        return []
      }
      const reqData = [] // 存放返回值
      const option = {
        url: `http://${server[0].ip}:${server[0].port}/channels/diagnosis/result/`, // 诊断服务器诊断列表
        method: 'post',
        body: search
      }
      try {
        const data = await this.req(option)
        if (data && data.result) {
          reqData.push(data.result)
          if (search.page !== 0) {
            ctx.set({
              'X-BSC-COUNT': data.total,
              'X-BSC-PAGES': Math.ceil(data.total / search.perpage),
              'X-BSC-CUR': parseInt(search.page),
              'X-BSC-LIMIT': parseInt(search.perpage)
            })
          }
        }
      } catch (error) {}

      return _.flatten(reqData) // 完成后减少层数
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 获取通道的诊断服务器结果
  async getVideoInfo (search) {
    try {
      const server = await this.find({}) // 获取当前全部服务器
      if (_.isEmpty(server)) {
        return null
      }
      // 依次请求服务器
      const option = {
        url: `http://${server[0].ip}:${server[0].port}/channels/diagnosis/capture/`, // 获取通道的诊断截图
        method: 'post',
        body: search
      }
      const data = await this.req(option)
      return data
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }

  // 获取诊断服务器日志
  async getVideoDiagnosisLog (ctx, isExport) {
    const ip = ctx.query.search.ip
    const port = ctx.query.search.port
    if (_.isEmpty(ip) || _.isEmpty(port)) {
      ctx.throw(500, { msg: '参数不能为空' })
    }
    const startTime = ctx.query.search.start ? moment(ctx.query.search.start * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
    const endTime = ctx.query.search.end ? moment(ctx.query.search.end * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
    let search = {
      page: +ctx.query.page.page || 1,
      perpage: +ctx.query.page.limit || 10,
      starttime: startTime,
      endtime: endTime,
      queryfilter: ctx.query.search.seek || ''
    }
    if (isExport) {
      search.page = 0
      search.perpage = 0
    }
    const option = {
      url: `http://${ip}:${port}/channels/diagnosis/log/`, // 诊断服务器诊断列表
      method: 'post',
      body: search
    }
    try {
      const reqData = await this.req(option)
      ctx.set({
        'X-BSC-COUNT': reqData.total,
        'X-BSC-PAGES': Math.ceil(reqData.total / search.perpage),
        'X-BSC-CUR': parseInt(search.page),
        'X-BSC-LIMIT': parseInt(search.perpage)
      })
      return reqData.log
    } catch (error) {
      return []
    }
  }

  // 获取诊断服务器日志详情
  async getVideoDiagnosisLogInfo (id, diagnid) {
    try {
      const info = await this.getVideoInfo({
        channel: id,
        diagnid: diagnid
      })
      const status = await ResourceModel.findOne({ _id: id }, 'status').exec()
      return {
        info: info || '',
        status: _.at(status, 'status')[0] || 0
      }
    } catch (err) {
      throw new Error({ msg: '查询失败', info: err })
    }
  }
  async req ({ url, method = 'POST', body = {} }) {
    return rp({
      method: method,
      uri: url,
      body: body,
      json: true
    })
  }
  // 获取mongos查询出数组获取的id
  arrGetId (arr) {
    let data = []
    arr.map(item => {
      item._id && data.push(item._id + '')
    })
    return data
  }
}

module.exports = Server
