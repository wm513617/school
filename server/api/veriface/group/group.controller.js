/*
 * @Author: chenkaibo
 * @Date: 2018-06-05 14:24:32
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-03-07 16:00:16
 */
'use strict'
const mongoose = require('mongoose')
const VeriGroup = mongoose.model('VeriGroup')
const VeriUser = mongoose.model('VeriUser')
const fs = require('fs')
const config = require('../../../../config').backend
const { handleSysException } = require('../../../common/tools')
const sdkInterface = require('../sdk.interface')

exports.index = async ctx => {
  try {
    const data = await VeriGroup.find({}).lean()
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 增加底库
 */
exports.add = async ctx => {
  try {
    const postData = ctx.request.body
    const [maxRepositroy, isExist] = await Promise.all([
      VeriGroup.countDocuments(),
      VeriGroup.findOne({ name: postData.name }).lean()
    ])
    if (maxRepositroy >= 128) {
      return ctx.throw(500, { code: 0, message: '底库数量不能超过128个' })
    }
    if (isExist) {
      return ctx.throw(500, { code: 0, message: '该名称已经已经存在' })
    }
    let id = new mongoose.Types.ObjectId()
    id = id.toString()
    const result = await sdkInterface.addMultiSvrGroup(id)
    try {
      await VeriGroup.create(Object.assign(postData, { _id: id }))
    } catch (error) {
      await sdkInterface.delMultiSvrGroup(id)
    }
    ctx.status = 201
    ctx.headers['location'] = ctx.url + '/' + id
    ctx.body = result
  } catch (error) {
    handleSysException(error, 500)
  }
}
/**
 * 删除底库
 */
exports.del = async ctx => {
  const id = ctx.params.id
  try {
    const repositroy = await VeriUser.find({ group: id }, 'image').lean()
    const userImages = repositroy.map(item => item.image)
    const [result] = await Promise.all([
      sdkInterface.delMultiSvrGroup(id),
      VeriUser.deleteMany({ group: id }),
      VeriGroup.findByIdAndRemove(id)
    ])
    // 删除用户图片
    userImages.forEach(img => {
      fs.unlink(img, function (err) {
        if (err) {
          console.log(err.message)
        }
      })
    })
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改底库信息
 */
exports.put = async ctx => {
  const id = ctx.params.id
  try {
    const isExist = await VeriGroup.findOne({ name: ctx.request.body.name, _id: { $ne: id } }).exec()
    if (isExist) {
      return ctx.throw(500, { code: 0, message: '该名称已经已经存在' })
    }
    await VeriGroup.findByIdAndUpdate(id, ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取所有布控音频
 */
exports.getAudio = async ctx => {
  try {
    const dirArr = fs.readdirSync(config.fileDirs.defenseAudioDir)
    ctx.body = dirArr
  } catch (error) {
    handleSysException(error)
  }
}
