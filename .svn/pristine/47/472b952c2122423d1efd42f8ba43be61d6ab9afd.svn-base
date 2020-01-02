/*
 * 模型接口
 * @Author: chenkaibo
 * @Date: 2018-10-28 17:04:13
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-23 13:22:34
 */
'use strict'

const { handleSysException, getChildren } = require('../../../../common/tools')
const ModelService = require('./model.service')
const modelService = new ModelService()
const _ = require('lodash')
// 添加模型
exports.add = async ctx => {
  try {
    if (_.isEmpty(ctx.request.body)) {
      ctx.throw(500, { code: 500, message: '请求参数不能为空！' })
    }
    const models = await modelService.findByQuery({ name: ctx.request.body.name })
    if (models.length) {
      ctx.throw(500, { code: 500, message: '模型名称重复！' })
    }
    if (ctx.request.body.name.length > 64) {
      ctx.throw(500, { code: 500, message: '模型名称超过指定长度' })
    }
    // 指定默认模型
    const defaultModels = await modelService.findByQuery({ oid: ctx.request.body.oid, default: true })
    if (!defaultModels.length) {
      Object.assign(ctx.request.body, { default: true })
    }
    const res = await modelService.add(ctx.request.body)
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}
// 获取列表
exports.getList = async ctx => {
  try {
    const rootId = 'root'
    const treeData = require('./modelOrg')
    const arrayList = []
    treeData2ArrayList([treeData], arrayList)
    const oid = ctx.query.oid || rootId
    let childrenIds = []
    childrenIds = getChildren(childrenIds, arrayList, oid)
    childrenIds.unshift(oid)
    const query = { oid: { $in: childrenIds } }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek + '' || '' })
    const { count, result } = await modelService.getList(query, ctx.query.page)
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': Math.ceil(count / ctx.query.page.limit),
      'X-BSC-CUR': parseInt(ctx.query.page.page),
      'X-BSC-LIMIT': parseInt(ctx.query.page.limit)
    })
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}
function treeData2ArrayList (treeData, arrayList) {
  for (var item of treeData) {
    const obj = {}
    obj._id = item._id
    obj.name = item.name
    item.pid && (obj.pid = item.pid)
    arrayList.push(obj)
    if (_.has(item, 'children')) {
      treeData2ArrayList(item.children, arrayList)
    }
  }
}
// 获取一组模型
exports.getGroup = async ctx => {
  try {
    const query = { oid: ctx.query.oid }
    ctx.query.status && (query['files.status'] = ctx.query.status)
    const results = await modelService.findByQuery(query)
    ctx.body = results
  } catch (error) {
    handleSysException(error)
  }
}
// 文件上传
exports.uploadFile = async ctx => {
  try {
    const name = ctx.request.body.files.file.name
    const path = `/image/model/${/gltf/.test(name) ? 'file' : 'picture'}/${name}`
    ctx.body = { name, path }
  } catch (error) {
    handleSysException(error)
  }
}
// 批量修改模型
exports.batchUpdate = async ctx => {
  try {
    const oid = ctx.query.oid || ''
    if (!oid) {
      ctx.throw(500, { message: '没有传递参数' })
    }
    const rootId = 'root'
    const treeData = require('./modelOrg')
    const arrayList = []
    treeData2ArrayList([treeData], arrayList)
    const org = arrayList.find(item => {
      if (item.pid === rootId && item._id === oid) {
        return true
      }
    })
    if (!org) {
      ctx.throw(500, { message: '不是类别根节点' })
    }
    let childrenIds = []
    childrenIds = getChildren(childrenIds, arrayList, oid)
    childrenIds.unshift(oid)
    const query = { oid: { $in: childrenIds } }
    await modelService.updateMany(query, ctx.request.body)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

// 获取模型参数
exports.getParmas = async ctx => {
  try {
    const oid = ctx.query.oid || ''
    if (!oid) {
      ctx.throw(500, { message: '没有传递参数' })
    }
    // const rootId = 'root'
    const treeData = require('./modelOrg')
    const arrayList = []
    treeData2ArrayList([treeData], arrayList)
    // const org = arrayList.find(item => {
    //   if (item.pid === rootId && item._id === oid) {
    //     return true
    //   }
    // })
    // if (!org) {
    //   ctx.throw(500, { message: '不是类别根节点' })
    // }
    let childrenIds = []
    childrenIds = getChildren(childrenIds, arrayList, oid)
    childrenIds.unshift(oid)
    const query = { oid: { $in: childrenIds } }
    let model = await modelService.findOne(query)
    const { brightness, height, scale } = model
    ctx.status = 200
    ctx.body = { brightness: brightness || 0, height: height || 0, scale: scale || 1.0 }
  } catch (error) {
    handleSysException(error)
  }
}

// 修改单个模型
exports.updateOne = async ctx => {
  try {
    await modelService.updateById(ctx.params.id, ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 修改模型默认值
exports.updateDefault = async ctx => {
  try {
    const model = await modelService.findById(ctx.params.id)
    const query = { oid: model.oid }
    const results = await modelService.findByQuery(query)
    await modelService.updateMany({ _id: { $in: results.map(item => item._id) } }, { default: false })
    // 取消时
    if (ctx.request.body.default === false) {
      // 当前是否为内置图标
      if (model.isDelete === false) {
        // 当前有其他图标时,取一个作为默认图标
        if (results.length > 1) {
          await modelService.updateById(ctx.params.id, ctx.request.body)
          await modelService.updateById(_.get(results.find(item => item._id + '' !== ctx.params.id), '_id', ''), { default: true })
        } else {
          let defaultId = _.get(results.find(item => item.isDelete === false), '_id')
          await modelService.updateById(defaultId, { default: true })
        }
      } else {
        // 当前非内置
        let defaultId = _.get(results.find(item => item.isDelete === false), '_id')
        await modelService.updateById(defaultId, { default: true })
      }
    } else {
      await modelService.updateById(ctx.params.id, ctx.request.body)
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 模型删除
exports.delete = async ctx => {
  try {
    const mids = ctx.accept.headers['x-bsc-ids'].split(',')
    const length = await modelService.checkModelkUsed(mids)
    if (length) {
      ctx.throw(500, { code: 500, message: '模型已被使用，无法删除' })
    }
    const model = await modelService.findById(mids)
    if (!_.get(model, 'isDelete', true)) {
      ctx.throw(500, { code: 500, message: '模型为内置模型，无法删除' })
    }
    if (_.get(model, 'default', false)) {
      ctx.throw(500, { code: 500, message: '模型为默认模型，无法删除' })
    }
    await modelService.delete(mids)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 获取模型机构
exports.getModelOrg = ctx => {
  try {
    ctx.body = require('./modelOrg')
  } catch (error) {
    handleSysException(error)
  }
}
