/*
 * @Description: 修改 2D 和 3D 地图图片存储路径
 * 将以前图片存储在数据库的形式改为存储到服务器的磁盘路径
 *
 * 测试用途
 *
 * @Author: wanglei
 * @Date: 2019-07-01 11:31:27
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-07-02 11:41:43
 */
'use strict'
require('../api/map/building/building.model')
require('../api/map/storey/storey.model')
require('../api/map3D/storey3D/storey.model')
require('../api/sys/setting/sysparamters.model')
const mongoose = require('mongoose')
const Storey = mongoose.model('Storey')
const Building = mongoose.model('Building')
const Storey3D = mongoose.model('Storey3D')
const gfs = require('../common/gridfs.util')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const randomString = require('randomstring')
const config = require('../../config')
const { mkdirsSync } = require('../common/tools')
console.log(config.backend.mongo.uri)
mongoose.connect(config.backend.mongo.uri)

const updatePicPath = async () => {
  try {
    const [storeys, buildings, storey3ds] = await Promise.all([
      Storey.find({}, '_id picture')
        .lean()
        .exec(),
      Building.find({}, '_id picture')
        .lean()
        .exec(),
      Storey3D.find({}, '_id picture')
        .lean()
        .exec()
    ])
    await Promise.all([updateStoreysPic(storeys), updateBuildingsPic(buildings), updateStoreys3DPic(storey3ds)])
  } catch (error) {
    console.log(error)
    throw error
  }
}

// 更新楼层中图片的存储路径
const updateStoreysPic = async storeys => {
  const savedPath = config.backend.fileDirs.storeyPicDir
  mkdirsSync(savedPath)
  let success = 0
  let notExistsNum = 0
  for (let item of storeys) {
    const { picture } = item
    const info = await gfs.getFileInfoByIdFromGFS({ id: picture.id + '' })
    if (!info.length) {
      notExistsNum++
      continue
    }
    const extname = path.extname(picture.name)
    const newName = `${randomString.generate(10)}${new Date().getTime}.${extname}`
    const picExists = fs.existsSync(`${savedPath}/${picture.name}`)
    let fileName = picExists ? newName : picture.name
    await writePicture(picture.id + '', `${savedPath}/${picture.name}`)
    const filePath = `/image/storey/${fileName}`
    await Storey.findByIdAndUpdate(item._id, { $unset: { 'picture.id': 1 }, 'picture.path': filePath })
      .lean()
      .exec()
    success++
  }
  console.log(`storey total count: ${storeys.length} success count: ${success}/${storeys.length} picture not exists: ${notExistsNum}`)
  console.log(`update storey done`)
}

// 更新 3D 楼层中图片的存储路径
const updateStoreys3DPic = async storey3ds => {
  const savedPath = config.backend.fileDirs.storeyPicDir
  mkdirsSync(savedPath)
  let success = 0
  let notExistsNum = 0
  for (let item of storey3ds) {
    const { picture } = item
    const info = await gfs.getFileInfoByIdFromGFS({ id: picture.id + '' })
    if (!info.length) {
      notExistsNum++
      continue
    }
    const extname = path.extname(picture.name)
    const newName = `${randomString.generate(10)}${new Date().getTime}.${extname}`
    const picExists = fs.existsSync(`${savedPath}/${picture.name}`)
    let fileName = picExists ? newName : picture.name
    await writePicture(picture.id + '', `${savedPath}/${fileName}`)
    const filePath = `/image/storey/${fileName}`
    await Storey3D.findByIdAndUpdate(item._id, { $unset: { 'picture.id': 1 }, 'picture.path': filePath })
      .lean()
      .exec()
    success++
  }
  console.log(`storey3d total count: ${storey3ds.length} success count: ${success}/${storey3ds.length} picture not exists: ${notExistsNum}`)
  console.log(`update storey3d done`)
}

// 更新楼宇图片的存储路径
const updateBuildingsPic = async buildings => {
  const savedPath = config.backend.fileDirs.buildingPicDir
  mkdirsSync(savedPath)
  let success = 0
  let notExistsNum = 0
  for (let item of buildings) {
    const picId = _.get(item, 'picture', '')
    const info = await gfs.getFileInfoByIdFromGFS({ id: picId })
    if (!picId || !info.length) {
      notExistsNum++
      continue
    }
    let fileName = info[0].filename
    const extname = path.extname(fileName)
    const newName = `${randomString.generate(10)}${new Date().getTime}.${extname}`
    const picExists = fs.existsSync(`${savedPath}/${fileName}`)
    fileName = picExists ? newName : fileName
    await writePicture(picId, `${savedPath}/${fileName}`)
    const filePath = `/image/building/${fileName}`
    await Building.findByIdAndUpdate(item._id, { picture: { name: info[0].filename, path: filePath } })
      .lean()
      .exec()
    success++
  }
  console.log(`building total count: ${buildings.length} success count: ${success}/${buildings.length} picture not exists: ${notExistsNum}`)
  console.log(`update building done`)
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
  }
}

updatePicPath()
  .then(() => {
    process.exit(1)
  })
  .catch(err => {
    console.log(err)
  })
