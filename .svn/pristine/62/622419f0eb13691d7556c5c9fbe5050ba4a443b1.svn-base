/*
 * 图标接口
 * @Author: lushengying
 * @Date: 2019-02-11 10:09:21
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-25 11:40:48
 */
'use strict'

const { handleSysException, getChildren } = require('../../../../common/tools')
const IconService = require('./icon.service')
const iconService = new IconService()
const _ = require('lodash')
// 添加图标
exports.add = async ctx => {
  try {
    if (_.isEmpty(ctx.request.body)) {
      ctx.throw(500, { code: 500, message: '请求参数不能为空！' })
    }
    if (ctx.request.body.name.length > 64) {
      ctx.throw(500, { code: 500, message: '图标名称长度超过指定长度！' })
    }
    const models = await iconService.findByQuery({ name: ctx.request.body.name })
    if (models.length) {
      ctx.throw(500, { code: 500, message: '图标名称重复！' })
    }
    // 获取此类图标
    const icons = await iconService.findByQuery({ oid: ctx.request.body.oid })
    let iconData = JSON.parse(JSON.stringify(ctx.request.body))
    if (icons.length) { // 绑定此类图标是否旋转
      iconData.isRotate = icons[0].isRotate
    }
    const res = await iconService.add(iconData)
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}
// 获取单一默认模型
exports.getOne = async ctx => {
  try {
    const oid = ctx.params.oid
    if (_.isEmpty(oid)) {
      ctx.throw(500, { code: 500, message: '请求参数不能为空！' })
    }
    const select = _.merge(ctx.query.search, { oid: oid })
    const res = await iconService.findOne(select)
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}
// 获取列表
exports.getList = async ctx => {
  try {
    const rootId = 'root'
    const treeData = require('./iconOrg')
    const arrayList = []
    treeData2ArrayList([treeData], arrayList)
    const oid = ctx.query.oid || rootId
    let childrenIds = []
    childrenIds = getChildren(childrenIds, arrayList, oid)
    childrenIds.unshift(oid)
    const query = { oid: { $in: childrenIds } }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek + '' || '' })
    const { count, result } = await iconService.getList(query, ctx.query.page)
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
// 获取一组图标
exports.getGroup = async ctx => {
  try {
    const query = { oid: ctx.query.oid }
    ctx.query.status && (query['files.status'] = ctx.query.status)
    const results = await iconService.findByQuery(query)
    ctx.body = results
  } catch (error) {
    handleSysException(error)
  }
}
// 文件上传
exports.uploadFile = async ctx => {
  try {
    const name = ctx.request.body.files.file.name
    const path = `/image/icon/picture/${name}`
    ctx.body = { name, path }
  } catch (error) {
    handleSysException(error)
  }
}
// 批量修改图标
exports.batchUpdate = async ctx => {
  try {
    const oid = ctx.query.oid || ''
    if (!oid) {
      ctx.throw(500, { message: '没有传递参数' })
    }
    const rootId = 'root'
    const treeData = require('./iconOrg')
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
    await iconService.updateMany(query, ctx.request.body)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

// // 获取图标参数
// exports.getParmas = async ctx => {
//   try {
//     const oid = ctx.query.oid || ''
//     if (!oid) {
//       ctx.throw(500, { message: '没有传递参数' })
//     }
//     // const rootId = 'root'
//     const treeData = require('./iconOrg')
//     const arrayList = []
//     treeData2ArrayList([treeData], arrayList)
//     // const org = arrayList.find(item => {
//     //   if (item.pid === rootId && item._id === oid) {
//     //     return true
//     //   }
//     // })
//     // if (!org) {
//     //   ctx.throw(500, { message: '不是类别根节点' })
//     // }
//     let childrenIds = []
//     childrenIds = getChildren(childrenIds, arrayList, oid)
//     childrenIds.unshift(oid)
//     const query = { oid: { $in: childrenIds } }
//     const { brightness, height } = await iconService.findOne(query)
//     ctx.status = 200
//     ctx.body = { brightness: brightness || 0, height: height || 0 }
//   } catch (error) {
//     handleSysException(error)
//   }
// }

// 修改单个图标
exports.updateOne = async ctx => {
  try {
    await iconService.updateById(ctx.params.id, ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 修改图标默认值
exports.updateDefault = async ctx => {
  try {
    const model = await iconService.findById(ctx.params.id)
    const query = { oid: model.oid }
    const results = await iconService.findByQuery(query) // 当前类型全部
    await iconService.updateMany({ _id: { $in: results.filter(item => item._id) } }, { default: false })
    if (ctx.request.body.default === false) {
      // 取消时
      if (model.isDelete === false) {
        // 当前是否为内置图标
        if (results.length > 1) {
          // 当前有其他图标时,取一个作为默认图标
          await iconService.updateById(ctx.params.id, ctx.request.body)
          await iconService.updateById(_.get(results.find(item => item._id + '' !== ctx.params.id), '_id', ''), {
            default: true
          })
        } else {
          let defaultId = _.get(results.find(item => item.isDelete === false), '_id')
          await iconService.updateById(defaultId, { default: true })
        }
      } else {
        // 当前非内置
        let defaultId = _.get(results.find(item => item.isDelete === false), '_id')
        await iconService.updateById(defaultId, { default: true })
      }
    } else {
      await iconService.updateById(ctx.params.id, ctx.request.body)
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 图标删除
exports.delete = async ctx => {
  try {
    const mids = ctx.accept.headers['x-bsc-ids'].split(',')
    const length = await iconService.checkIconkUsed(mids)
    if (length) {
      ctx.throw(500, { code: 500, message: '当前图标，无法删除' })
    }
    await iconService.delete(mids)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 获取图标机构
exports.getModelOrg = ctx => {
  try {
    ctx.body = require('./iconOrg')
  } catch (error) {
    handleSysException(error)
  }
}

// 修改图标是否旋转
exports.updateRotate = async ctx => {
  try {
    const oid = ctx.params.oid
    const isRotate = ctx.request.body.isRotate
    await iconService.updateMany({ oid: oid }, { isRotate: isRotate })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
