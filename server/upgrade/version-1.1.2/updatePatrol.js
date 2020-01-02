/* 迁移巡更，单兵有关表的图片到磁盘
 * @Author: linhang
 * @Date: 2019-07-23 19:08:40
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-31 14:17:38
 */

'use strict'
const mongoose = require('mongoose')
const Security = mongoose.model('Security')
const gfs = require('../../common/gridfs.util')
const fs = require('fs')
const path = require('path')
const randomString = require('randomstring')
const config = require('../../../config')

exports.upgrade = async () => {
  await update()
}
const update = async () => {
  try {
    const data = await Security.find({}, 'photo').lean()
    await uploadPic(data)
  } catch (error) {
    console.log(error)
    throw error
  }
}
const uploadPic = async data => {
  try {
    const savePath = config.backend.fileDirs.picCommon
    let i = 0
    for (let item of data) {
      if (item.photo) {
        const info = await gfs.getFileInfoByIdFromGFS({ id: item.photo })
        if (info.length) {
          const extName = path.extname(info[0].filename)
          const newName = `${randomString.generate(10)}${new Date().getTime()}${extName}`
          await writePicture(item.photo, `${savePath}/${newName}`)
          const filePath = `/image/common/${newName}`
          await Security.findByIdAndUpdate(item._id, { photo: filePath })
          i++
        }
      }
    }
    console.log('------查询出Security表图片张数：', i)
    console.log('------Security表图片存储迁移完成')
  } catch (error) {
    console.log(error)
    throw error
  }
}

/**
 * 从数据库中下载图片到指定存储路径
 * @param {*} picId 图片id
 * @param {*} savedPath 保存路径
 */
const writePicture = async (picId, filePath) => {
  try {
    const readStream = await gfs.readFileByIdFromGFS({ id: picId })
    const writeStream = fs.createWriteStream(filePath)
    await new Promise((resolve, reject) => {
      const flow = readStream.pipe(writeStream)
      flow.on('finish', () => {
        resolve()
      })
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}
