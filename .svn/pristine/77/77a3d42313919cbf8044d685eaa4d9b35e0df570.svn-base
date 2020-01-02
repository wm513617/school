'use strict'
/**
 * 文件上传
 */
var gfs = require('../../common/gridfs.util')
const config = require('../../../config').backend
const { cfgUploadDir } = require('../../common/tools')
const { CONTENT_TYPE } = require('../../common/constant')

exports.upload = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('其他-文件上传'))
  // const file = ctx.request.body.files.image
  // ctx.body = await gfs.uploadFileToGFS(file.path, file.name, ctx.params.type || 'fs')
  try {
    ctx.body = await gfs.uploadFileToGFS(ctx.request.body.files.file.path, ctx.request.body.files.file.name, ctx)
  } catch (err) {
    return ctx.throw(500, { code: 4101, message: err.message })
  }
}
/**
 * 根据文件分类获取文件集合
 */
exports.getFilesByTag = async (ctx, next) => {
  // const filetype = ctx.query.filetype || ''
  const tag = ctx.query.tag || ''
  if (!tag) {
    return ctx.throw(500, { code: 4201, message: 'type args not found' })
  }
  try {
    ctx.body = await gfs.getFileInfoByTagFromGFS(tag, ctx.query.type)
  } catch (err) {
    return ctx.throw(500, { code: 4101, message: err.message })
  }
}

// 获取上传的图片
exports.getImg = async ctx => {
  if (!ctx.query.id || ctx.query.id === 'undefined') {
    return ctx.throw(400, { code: 4201, message: '参数有误' })
  }
  try {
    const readstream = await gfs.readFileByIdFromGFS(ctx.query)
    const info = await gfs.getFileInfoByIdFromGFS(ctx.query)
    if (info.length > 0) {
      const result = info[0].filename.split('.')

      const contentType = CONTENT_TYPE[result[result.length - 1]] || 'text/plain'
      ctx.response.set({
        'Content-Type': contentType
        // 'Content-Disposition': `attachment;filename=${info[0].filename}`
      })
      ctx.body = readstream
    } else {
      return ctx.throw(404, { code: 4201, message: '文件未找到' })
    }
  } catch (err) {
    return ctx.throw(500, { code: 4101, message: err.message })
  }
}

exports.del = async ctx => {
  try {
    if (!ctx.query.id || ctx.query.id === 'undefined') {
      return ctx.throw(400, { code: 4201, message: '参数有误' })
    }
    gfs.deleteFileByIdFromGFS(ctx.query)
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 新版本的文件上传接口，可以配置上传文件保存到系统目录
 * @param {*} ctx
 * @param {*} next
 */
exports.uploadFile = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('其他-文件上传'))
  try {
    // 避免koa-body循环调用此函数 不可删除，配置koa-body
    if (ctx.request.body && ctx.request.body.files) {
      return ''
    }
    const type = ctx.query.type || 'image'
    const category = ctx.query.category
    const pathMap = {
      common: config.fileDirs.picCommon,
      image: config.fileDirs.picCommon,
      'face/user': config.fileDirs.faceUserPictureDir,
      video: config.fileDirs.videoCommon,
      temp: config.fileDirs.tempDir,
      storey: config.fileDirs.storeyPicDir,
      building: config.fileDirs.buildingPicDir,
      map: config.fileDirs.mapPicDir,
      nonVehicle: config.fileDirs.nonVehicleDir,
      nonVehicleTemp: config.fileDirs.nonVehicleTempDir,
      peopleDir: config.fileDirs.peopleDir,
      'motorVehicle/driver': config.fileDirs.motorDriverPicDir,
      motorDriverTemp: config.fileDirs.motorDriverTempDir
    }
    const upload = cfgUploadDir(pathMap[category || type])
    await upload(ctx, next)
    const name = ctx.request.body.files.file.name
    ctx.body = {
      name: name,
      path: `/${type}/${category || 'common'}/${name}`
    }
  } catch (err) {
    return ctx.throw(500, { code: 4101, message: err.message })
  }
}
