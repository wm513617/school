'use strict'
const mongoose = require('mongoose')
const Favorite = mongoose.model('Favorite')
// 根据用户获取收藏夹
exports.getByUser = async ctx => {
  try {
    const favorites = await Favorite.find({ owners: ctx.params.id }).populate({
      path: 'resources',
      populate: {
        path: 'eid'
      }
    }).exec()
    ctx.status = 200
    ctx.body = favorites
  } catch (error) {
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
// 获取单个
exports.get = async ctx => {
  try {
    const favorite = await Favorite.findById(ctx.params.id).populate({
      path: 'resources',
      populate: {
        path: 'eid'
      }
    }).exec()
    ctx.status = 200
    ctx.body = favorite
  } catch (error) {
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
// 添加收藏夹
exports.add = async ctx => {
  try {
    const res = await Favorite.find({ name: ctx.request.body.name, creator: ctx.request.body.creator })
    if (res.length) {
      ctx.throw(500, { code: 5, message: '该名称已存在' })
    }
    const favorite = new Favorite(ctx.request.body)
    const doc = await favorite.save()
    ctx.status = 201
    ctx.set('Location', doc._id)
    ctx.body = [doc._id]
  } catch (err) {
    ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
  }
}
// 修改
exports.modify = async ctx => {
  try {
    const { userId, favId } = ctx.params
    if (userId !== ctx.request.body.creator) { return ctx.throw(500, { code: 1, message: '没有操作权限' }) }
    const res = await Favorite.find({ name: ctx.request.body.name, creator: ctx.request.body.creator })
    let flag = false
    res.forEach(item => {
      if (item._id + '' !== favId + '' && item.name + '' === ctx.request.body.name + '' && item.creator + '' === ctx.request.body.creator + '') { flag = true }
    })
    if (flag) {
      ctx.throw(500, { code: 5, message: '该名称已存在' })
    }
    await Favorite.findByIdAndUpdate(favId, ctx.request.body).exec()
    ctx.status = 200
  } catch (err) {
    ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
  }
}
// 删除
exports.delete = async ctx => {
  try {
    const { userId, favId } = ctx.params
    const favorite = await Favorite.findById(favId).exec()
    if (userId !== favorite.creator) {
      favorite.owners = favorite.owners.filter(item => item !== userId)
      await Favorite.findByIdAndUpdate(favId, favorite).exec()
    } else {
      await Favorite.findByIdAndRemove(favId)
    }
    ctx.status = 200
  } catch (error) {
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
// 更新单个资源
exports.updateOneFavoriteResource = async resource => {
  try {
    const favourites = await Favorite.find({}).exec()
    favourites && favourites.forEach(async item => {
      item.resources = item.resources.filter(item => item + '' !== resource._id + '')
      await item.save()
    })
  } catch (error) {
    console.log(error)
  }
}
// 批量更新
exports.updateFavouriteResource = async data => {
  try {
    const { resources } = data
    const favourites = await Favorite.find({}).exec()
    const resLength = resources ? resources.length : 0
    const favLength = favourites ? favourites.length : 0
    for (let i = 0; i < resLength; i++) {
      for (let j = 0; j < favLength; j++) {
        favourites[j].resources.forEach(item => {
          if (resources[i]._id) {
            if ((item + '') === (resources[i]._id + '')) {
              if (item instanceof mongoose.mongo.ObjectID) {
                favourites[j].resources.deleteMany(item)
              } else {
                favourites[j].resources.deleteMany(item + '')
              }
            }
          }
        })
      }
    }
    favourites.forEach(async item => { await Favorite.findByIdAndUpdate(item._id, item) })
  } catch (error) {
    console.log(error)
  }
}
