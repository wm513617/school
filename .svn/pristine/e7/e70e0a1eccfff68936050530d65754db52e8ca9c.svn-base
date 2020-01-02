/*
 * 人脸数据缓存(实现质量优先方案)
 * @Author: chenkaibo
 * @Date: 2018-12-14 11:22:41
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-07 14:35:41
 */
'use strict'
let cache = {}
const config = require('../../../../config').backend
const tool = require('../../../common/tools')
const filePath = config.fileDirs.facePasserPictureDir
const postal = require('postal')
const moment = require('moment')
const fs = require('fs')
const TIMEGAP = 5000
const INTERGAP = 2000
let intervalHandleId
/**
 * 人脸识别数据在缓存中查找，如果存在则比较质量是否满足最优，
 * 最优情况下会返回上次写入到磁盘中的文件路径并重新写入图片到该路径进行覆盖，
 * @param {string} track 人员trackid
 * @param {number} quality 识别信息中图片的质量
 * @param {string} cameraId 识别人脸的镜头
 * @param {string} id 数据库记录id
 * @returns {object} 缓存查询的结果
 */
module.exports.lookup = function ({ track, quality, cameraId, id, isdefense }) {
  const currentTime = new Date().getTime()
  if (!cache[cameraId]) {
    cache[cameraId] = {}
  }
  const cameraTrack = cache[cameraId]
  if (!cameraTrack[track]) {
    cameraTrack[track] = {}
  }
  const trackRecord = cameraTrack[track]
  if (trackRecord.updateTime) {
    trackRecord.updateTime = currentTime
    if (quality > trackRecord.quality) {
      if (trackRecord.isdefense && isdefense === trackRecord.isdefense) {
        trackRecord.quality = quality
        return {
          isFsWrite: true,
          status: 'update',
          faceImagePath: trackRecord.faceImagePath,
          fullImagePath: trackRecord.fullImagePath,
          id: trackRecord.id,
          isdefense: isdefense
        }
      }
      if (!trackRecord.isdefense && isdefense === trackRecord.isdefense) {
        return {
          isFsWrite: true,
          status: 'update',
          faceImagePath: trackRecord.faceImagePath,
          fullImagePath: trackRecord.fullImagePath,
          id: trackRecord.id,
          isdefense: isdefense
        }
      }
    }
    // 路人变成布控报警
    if (!trackRecord.isdefense && isdefense !== trackRecord.isdefense) {
      return {
        isFsWrite: true,
        status: 'update',
        faceImagePath: trackRecord.faceImagePath,
        fullImagePath: trackRecord.fullImagePath,
        id: trackRecord.id,
        passby2defense: true
      }
    }
    return { isFsWrite: false }
  }
  trackRecord.createTime = trackRecord.updateTime = currentTime
  trackRecord.quality = quality
  trackRecord.isdefense = isdefense
  trackRecord.id = id
  const nowDate = moment().format('YYYY-MM-DD')
  const basePath = `${filePath}/${nowDate}/${cameraId}`
  const faceImagePath = `${basePath}/${track}_${currentTime}_face.jpg`
  const fullImagePath = `${basePath}/${track}_${currentTime}_full.jpg`
  if (!fs.existsSync(basePath)) {
    tool.mkdirsSync(basePath)
  }
  trackRecord.faceImagePath = faceImagePath
  trackRecord.fullImagePath = fullImagePath
  return { isFsWrite: true, status: 'insert', faceImagePath, fullImagePath }
}
/**
 * 启动人脸质量优先缓存检查机制
 * 缓存中会保留每个镜头最后一个人信息中质量最高的的记录。
 * 系统在规定间隔的时间去检查缓存，过间隔时间内有人员质量没有变动的话，
 * 则不认为人员已经走出镜头，不会在有质量更高的图片出现。清除人员trackid
 */
function startInterval () {
  if (!intervalHandleId) {
    intervalHandleId = setInterval(() => {
      const currentTime = new Date().getTime()
      const keys = Object.keys(cache)
      if (keys.length) {
        for (const cammera of keys) {
          const cameraTrack = cache[cammera]
          for (const trackId of Object.keys(cameraTrack)) {
            if (cameraTrack[trackId].updateTime + TIMEGAP <= currentTime) {
              delete cameraTrack[trackId]
            }
          }
        }
      }
    }, INTERGAP)
  }
}
//  系统默认启动质量优先
startInterval()
/**
 * 取消人脸质量优先
 * 清理缓存
 */
function stopInterval () {
  if (intervalHandleId) {
    clearInterval(intervalHandleId)
  }
  cache = {}
}
/**
 * 订阅开启质量优先
 */
postal.subscribe({
  channel: 'faceParameter',
  topic: 'open.passer',
  callback: function () {
    startInterval()
  }
})
/**
 * 订阅取消质量优先
 */
postal.subscribe({
  channel: 'faceParameter',
  topic: 'colse.passer',
  callback: function () {
    stopInterval()
  }
})
