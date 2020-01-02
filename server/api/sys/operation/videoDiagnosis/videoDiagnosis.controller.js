/*
 * 诊断服务器相关接口
 * @Author: lushengying
 * @Date: 2018-10-23 09:48:21
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-11-09 16:11:44
 */

'use strict'

// const mongoose = require('mongoose')
// const { handleSysException } = require('../../../../common/tools')
const { handleSysException, getChildren } = require('../../../../common/tools')
// const Org = mongoose.model('Org')
// const OrgRes = mongoose.model('OrgRes')
// const Resource = mongoose.model('Resource')
// const Record = mongoose.model('Record')
// const Storage = mongoose.model('Storage')
// const xlsx = require('node-xlsx')
const _ = require('lodash')
// const tool = require('../../../common/tools')
const Service = require('./videoDiagnosis.service')
const service = new Service()
const xlsx = require('node-xlsx')

// 视频诊断列表
exports.getAll = async ctx => {
  try {
    const oid = ctx.query.oid // 机构id
    const DIAGNOPTIONAll = 0 // 诊断结果为全部
    const diagnoption = parseInt(ctx.query.search.diagnosis) || DIAGNOPTIONAll
    let search = ctx.query.search
    if (_.isEmpty(oid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let orgIds = [] // 机构Id数组
    let resIds = [] // 资源iD
    if (search.recursion === '1') {
      // 查询父机构
      const orgData = await service.getOrg({ type: 0 }, 'name pid isroot', 'order') // 获取所有机构
      orgIds = getChildren(orgIds, orgData, oid)
      orgIds.push(oid)
      resIds = await service.getOrgRes({ org: { $in: orgIds } }) // 获取指定机构下资源Id
    } else {
      resIds = await service.getOrgRes({ org: oid }) // 获取指定机构下资源Id
    }
    // 是否查询诊断结果
    let resData // 通道查询结果
    let find // 通道查询条件
    let resId // 资源id
    let reqObj // 请求参数
    search._id = { $in: resIds }
    search.type = 0
    delete ctx.query.search.diagnoption
    delete search.diagnosis
    delete search.pagesize
    delete search.oid
    delete search.recursion
    delete search.seek
    if (_.isEmpty(search.status)) {
      delete search.status
    }
    if (diagnoption === DIAGNOPTIONAll) {
      // 流程为查询该机构下通道并处理分页
      find = {
        $and: [search],
        $or: [
          {
            ip: {
              $regex: ctx.query.seek + '' || ''
            }
          },
          {
            name: {
              $regex: ctx.query.seek + '' || ''
            }
          }
        ]
      }
      resData = await service.resourcePage(
        find,
        '_id ip name stream chan eid status',
        'order',
        ctx.query.page,
        {
          path: 'eid',
          select: '_id cport manufacturer'
        },
        ctx
      ) // 获取分页后的通道信息
      resId = service.arrGetId(resData)
      // 不进行分页时，诊断服务器请求接口page、parpage传递传递为0
      reqObj = {
        channs: resId,
        diagnoption: diagnoption,
        queryfilter: '',
        page: 0,
        perpage: 0
      }
    } else {
      find = {
        $and: [search]
      }
      // 需查询诊断结果,流程为返回该机构下全部通道交由诊断服务器并附带分页信息,在后续处理中由诊断服务器进行分页处理显示
      resData = await service.resourceAll(find, '_id ip name stream chan status eid', {
        path: 'eid',
        select: '_id cport manufacturer'
      })
      resId = service.arrGetId(resData)
      reqObj = {
        channs: resId,
        diagnoption: diagnoption,
        queryfilter: '',
        page: ctx.query.page.page,
        perpage: ctx.query.page.limit
      }
    }
    // 请求接口时需判断是否进行视频诊断搜索，如进行诊断结果结果搜索需传递分页信息。
    let reqData = await service.getVideoDiagnosisAll(reqObj, ctx) // 获取诊断服务器返回结果
    const data = []
    // 拼接数据
    if (diagnoption === DIAGNOPTIONAll) {
      for (let i = 0, resLength = resData.length; i < resLength; i++) {
        let obj = {
          _id: resData[i]._id,
          name: resData[i].name,
          status: resData[i].status,
          ip: resData[i].ip,
          stream: resData[i].stream,
          chan: resData[i].chan,
          cport: resData[i].eid.cport,
          manufacturer: resData[i].eid.manufacturer
        }
        for (let j = 0, reqLength = reqData.length; j < reqLength; j++) {
          if (resData[i]._id + '' === reqData[j].channel) {
            obj.time = reqData[j].time
            obj.diagnosis = reqData[j].diagnosis
            obj.diagnid = reqData[j].diagnid
          }
        }
        data.push(obj)
      }
    } else {
      for (let j = 0, reqLength = reqData.length; j < reqLength; j++) {
        let obj = {
          _id: reqData[j].channel,
          time: reqData[j].time,
          diagnosis: reqData[j].diagnosis,
          diagnid: reqData[j].diagnid
        }
        for (let i = 0, resLength = resData.length; i < resLength; i++) {
          if (resData[i]._id + '' === reqData[j].channel) {
            obj.name = resData[i]._doc.name
            obj.status = resData[i]._doc.status
            obj.ip = resData[i]._doc.ip
            obj.stream = resData[i]._doc.stream
            obj.chan = resData[i]._doc.chan
            obj.cport = resData[i]._doc.eid.cport
            obj.manufacturer = resData[i]._doc.eid.manufacturer
          }
        }
        data.push(obj)
      }
    }
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

exports.export = async ctx => {
  try {
    const oid = ctx.query.oid // 机构id
    const DIAGNOPTIONAll = 0 // 诊断结果为全部
    const diagnoption = parseInt(ctx.query.search.diagnosis) || DIAGNOPTIONAll
    let search = ctx.query.search
    if (_.isEmpty(oid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let orgIds = [] // 机构Id数组
    let resIds = [] // 资源iD
    if (search.recursion === '1') {
      // 查询父机构
      const orgData = await service.getOrg({ type: 0 }, 'name pid isroot', 'order') // 获取所有机构
      orgIds = getChildren(orgIds, orgData, oid)
      orgIds.push(oid)
      resIds = await service.getOrgRes({ org: { $in: orgIds } }) // 获取指定机构下资源Id
    } else {
      resIds = await service.getOrgRes({ org: oid }) // 获取指定机构下资源Id
    }
    // 是否查询诊断结果
    let resData // 通道查询结果
    let find // 通道查询条件
    let resId // 资源id
    let reqObj // 请求参数
    search._id = { $in: resIds }
    search.type = 0
    delete ctx.query.search.diagnoption
    delete search.diagnosis
    delete search.pagesize
    delete search.oid
    delete search.recursion
    delete search.seek
    if (_.isEmpty(search.status)) {
      delete search.status
    }
    if (diagnoption === DIAGNOPTIONAll) {
      // 流程为查询该机构下通道并处理分页
      find = {
        $and: [search],
        $or: [
          {
            ip: {
              $regex: ctx.query.seek || ''
            }
          },
          {
            name: {
              $regex: ctx.query.seek || ''
            }
          }
        ]
      }
      resData = await service.resourceAll(find, '_id ip name stream chan eid status', {
        path: 'eid',
        select: '_id cport manufacturer'
      }) // 获取分页后的通道信息
      resId = service.arrGetId(resData)
      // 不进行分页时，诊断服务器请求接口page、parpage传递传递为0
      reqObj = {
        channs: resId,
        diagnoption: diagnoption,
        queryfilter: '',
        page: 0,
        perpage: 0
      }
    } else {
      find = {
        $and: [search]
      }
      // 需查询诊断结果,流程为返回该机构下全部通道交由诊断服务器并附带分页信息,在后续处理中由诊断服务器进行分页处理显示
      resData = await service.resourceAll(find, '_id ip name stream chan status eid', {
        path: 'eid',
        select: '_id cport manufacturer'
      })
      resId = service.arrGetId(resData)
      reqObj = {
        channs: resId,
        diagnoption: diagnoption,
        queryfilter: '',
        page: 0,
        perpage: 0
      }
    }
    // 请求接口时需判断是否进行视频诊断搜索，如进行诊断结果结果搜索需传递分页信息。
    let reqData = await service.getVideoDiagnosisAll(reqObj, ctx) // 获取诊断服务器返回结果
    const raw = [] // 原始数据
    // 拼接数据
    if (diagnoption === DIAGNOPTIONAll) {
      for (let i = 0, resLength = resData.length; i < resLength; i++) {
        let obj = {
          _id: resData[i]._id,
          name: resData[i].name,
          status: resData[i].status,
          ip: resData[i].ip
          // stream: resData[i].stream,
          // chan: resData[i].chan,
          // cport: resData[i].eid.cport,
          // manufacturer: resData[i].eid.manufacturer
        }
        for (let j = 0, reqLength = reqData.length; j < reqLength; j++) {
          if (resData[i]._id + '' === reqData[j].channel) {
            obj.time = reqData[j].time
            obj.diagnosis = reqData[j].diagnosis
          }
        }
        raw.push(obj)
      }
    } else {
      for (let j = 0, reqLength = reqData.length; j < reqLength; j++) {
        let obj = {
          _id: reqData[j].channel,
          time: reqData[j].time,
          diagnosis: reqData[j].diagnosis
        }
        for (let i = 0, resLength = resData.length; i < resLength; i++) {
          if (resData[i]._id + '' === reqData[j].channel) {
            obj.name = resData[i]._doc.name
            obj.status = resData[i]._doc.status
            obj.ip = resData[i]._doc.ip
            // obj.stream = resData[i]._doc.stream
            // obj.chan = resData[i]._doc.chan
            // obj.cport = resData[i]._doc.eid.cport
            // obj.manufacturer = resData[i]._doc.eid.manufacturer
          }
        }
        raw.push(obj)
      }
    }

    const data = [
      [
        '通道名称',
        '在线状态',
        '设备IP',
        '信号确实',
        '清晰度异常',
        '画面遮挡',
        '场景切换',
        '亮度异常',
        '画面冻结',
        '噪声检测',
        '偏色检测',
        'PTZ失控',
        '最后监测时间'
      ]
    ]
    // 将设备信息Push到sheet
    raw.forEach(item => {
      const arr = [
        item.name,
        item.status === 1 ? '在线' : '离线',
        item.ip,
        diagnosis(_.at(item, ['diagnosis[0]'])[0]),
        diagnosis(_.at(item, ['diagnosis[1]'])[0]),
        diagnosis(_.at(item, ['diagnosis[2]'])[0]),
        diagnosis(_.at(item, ['diagnosis[3]'])[0]),
        diagnosis(_.at(item, ['diagnosis[4]'])[0]),
        diagnosis(_.at(item, ['diagnosis[5]'])[0]),
        diagnosis(_.at(item, ['diagnosis[6]'])[0]),
        diagnosis(_.at(item, ['diagnosis[7]'])[0]),
        diagnosis(_.at(item, ['diagnosis[8]'])[0]),
        item.time || '--'
      ]
      data.push(arr)
    })
    const ColInfos = [
      { width: 22 },
      { width: 10 },
      { width: 18 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 12 },
      { width: 22 }
    ]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: '视频诊断信息', data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
    ctx.attachment(`视频诊断日志-${timeStr}.xlsx`.toString('utf8'))
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}
function diagnosis (num) {
  let str = '--'
  if (typeof num === 'number') {
    if (num === 1) {
      str = '异常'
    } else {
      str = '正常'
    }
  }
  return str
}
// 视频诊断详情图片
exports.videoInfo = async ctx => {
  try {
    const id = ctx.params.id
    const diagnid = ctx.params.diagnid
    if (_.isEmpty(id) || _.isEmpty(diagnid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    ctx.body = await service.getVideoInfo({
      channel: id,
      diagnid: diagnid
    })
  } catch (error) {
    handleSysException(error)
  }
}

// 获取服务器列表
exports.getServer = async ctx => {
  try {
    if (ctx.query.page) {
      ctx.body = await service.page(ctx)
    } else {
      ctx.body = await service.find({})
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 获取服务器详情
exports.serverInfo = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    ctx.body = await service.findById(id)
  } catch (error) {
    handleSysException(error)
  }
}

// 添加服务器
let addLock = true // 避免多次点击造成添加
exports.addServer = async ctx => {
  try {
    if (addLock) {
      addLock = false
      const cont = await service.count()
      if (cont >= 1) {
        ctx.throw(500, { code: 2001, message: '暂无法添加更多' })
      } else {
        ctx.body = await service.create(ctx.request.body)
        ctx.status = 201
      }
    }
    addLock = true
  } catch (error) {
    addLock = true
    handleSysException(error)
  }
}

// 更新服务器
exports.upServer = async ctx => {
  try {
    const id = ctx.params.id
    const body = ctx.request.body
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let find = {
      _id: id
    }
    ctx.body = await service.update(find, body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 删除服务器
exports.delServer = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    ctx.body = await service.delete(id)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
