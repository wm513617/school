/*
 * @Author: wanglei
 * @Date: 2019-05-21 09:10:16
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-05-29 16:01:28
 */
/**
 * 将原先每次启动后端服务的自动执行刷新内置图标和模型的逻辑单独抽出来，
 * 不需要每次启动服务时都执行一次，改为需要刷新内置图标和模型时，单独执行此
 * 脚本即可
 *
 * 进入该脚本文件所在的目录，执行 NODE_ENV=production node initIconAndModel.js 命令即可
 */

'use strict'
const mongoose = require('mongoose')
require('../api/sys/setting/model/model')
require('../api/sys/setting/icon/icon.model')
const Model = mongoose.model('Model')
const Icon = mongoose.model('Icon')
const config = require('../../config')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const modelList = require('../config/map3DModel/model.json')
const modelPath = path.resolve(__dirname, '../config/map3DModel/file')
const modelFiles = fs.readdirSync(path.resolve(__dirname, modelPath))
const iconList = require('../config/map2DIcon/icon.json')
const iconPath = path.resolve(__dirname, '../config/map2DIcon/file')
const iconFiles = fs.readdirSync(path.resolve(__dirname, iconPath))
console.log('数据库地址' + config.backend.mongo.uri)
mongoose.connect(config.backend.mongo.uri)

let readFilePromise = function (path, file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${path}/${file}`, (err, originBuffer) => {
      if (err) {
        console.log(`readFile ${file} error ${err}`)
        reject(err)
      } else {
        resolve(originBuffer)
      }
    })
  })
}

let writeFilePromise = function (dir, file, originBuffer) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${dir}/${file}`, originBuffer, err => {
      if (err) {
        console.log(`writeFile ${dir}/${file} error ${err}`)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function initIconAndModel () {
  try {
    // 更新模型库
    for (let file of modelFiles) {
      const originBuffer = await readFilePromise(modelPath, file)
      let dir = config.backend.fileDirs.modelPictureDir
      if (file.split('.').indexOf('gltf') === 1) {
        dir = config.backend.fileDirs.modelFileDir
      }
      await writeFilePromise(dir, file, originBuffer)
    }

    for (let item of modelList) {
      item.files.forEach(file => {
        file.path = file.name === '' ? '' : '/image/model/file/' + file.name
      })
      item.picture.path = item.picture.name === '' ? '' : '/image/model/picture/' + item.picture.name
      const model = await Model.findById(item._id, 'oid name').lean().exec()
      if (_.isNull(model)) {
        await Model.findByIdAndUpdate(item._id, item, { upsert: true }).exec()
      } else {
        const modelWithOid = await Model.find({ oid: model.oid }, 'default name').lean().exec()
        // 这里判断内置的模型是否已经为默认，true 为默认的不用更改，false 不是默认的，则将内置的模型的 default 改为 false
        const flag = modelWithOid.some(elements => elements.default && item._id + '' === elements._id + '')
        if (flag) {
          await Model.findByIdAndUpdate(item._id, item, { upsert: true }).lean().exec()
        } else {
          item.default = false
          await Model.findByIdAndUpdate(item._id, item, { upsert: true }).lean().exec()
        }
      }
    }

    // 更新图标库
    for (let file of iconFiles) {
      const originBuffer = await readFilePromise(iconPath, file)
      const iconDir = config.backend.fileDirs.iconPictureDir
      await writeFilePromise(iconDir, file, originBuffer)
    }

    for (let item of iconList) {
      item.files.forEach(file => {
        file.path = file.name === '' ? '' : '/image/icon/picture/' + file.name
      })
      const icon = await Icon.findById(item._id, 'oid name').lean().exec()
      if (_.isNull(icon)) {
        await Icon.findByIdAndUpdate(item._id, item, { upsert: true }).exec()
      } else {
        const iconsWithOid = await Icon.find({ oid: icon.oid }, 'default name').lean().exec()
        // 这里判断内置的图标是否已经为默认，true 为默认的不用更改，false 不是默认的，则将内置的图标的 default 改为 false
        const flag = iconsWithOid.some(elements => elements.default && item._id + '' === elements._id + '')
        if (flag) {
          await Icon.findByIdAndUpdate(item._id, item, { upsert: true }).lean().exec()
        } else {
          item.default = false
          await Icon.findByIdAndUpdate(item._id, item, { upsert: true }).lean().exec()
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}

initIconAndModel().then(() => {
  console.log('执行完毕')
  process.exit(1)
}).catch((err) => {
  console.log(err)
})
