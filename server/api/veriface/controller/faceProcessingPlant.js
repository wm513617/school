/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:18
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-12-06 14:46:05
 */
'use strict'
const mongoose = require('mongoose')
const VerifaceIdentify = mongoose.model('VerifaceIdentify')
// var _ = require('lodash')
const VeriGroup = mongoose.model('VeriGroup')
const VeriUser = mongoose.model('VeriUser')
const DefenseTask = mongoose.model('DefenseTask')
const FaceParameter = mongoose.model('FaceParameter')
const config = require('../../../../config').backend
const { mkdirsSync } = require('../../../common/tools')
const fs = require('fs')
const moment = require('moment')
const sdkInterface = require('../sdk.interface')
const Alarm = require('../../bstar/alarm.interface')
const faceCache = require('./face.cache')

const CACHESTATUS_INSERT = 'insert'
const QUALITYPROPRITY = 1 // 质量优先
const FACERECOGNIZETYPE = 'recognize' // 人脸识别数据类型
const STREAM = Symbol('Stream')
let PASSBY // 路人库[需要对识别且质量比数据库极中差的，删除在SDK路人底库图片中该图片]

exports.streamIdntify = async (data, res, host) => {
  try {
    data = JSON.parse(data)
    if (!PASSBY) {
      PASSBY = await VeriGroup.findOne({ name: '路人库' }).lean()
    }
    const now = moment()
    const cameraId = res._id.toString()
    if (data.type === FACERECOGNIZETYPE) {
      const timestamp = now.unix()
      // 人像识别入库基础数据组装
      const faceData = {
        dateTime: moment(now).format('YYYY-MM-DD'),
        hour: now.hour(),
        time: timestamp,
        timestamp: Number(now.format('x')),
        res: res._id,
        resName: res.name,
        resIp: res.ip,
        resPort: res.port,
        resChannel: res.chan,
        isdefense: false,
        gender: Math.round(data.face.attrs.gender.male) + 1,
        age: Math.round(data.face.attrs.age)
      }
      const [denfenseGroups, faceSvrCfg] = await Promise.all([
        getDefenseGroup(cameraId),
        FaceParameter.findOne().lean()
      ])
      const identifies = []
      data.result &&
        data.result.forEach(group => {
          const repository = denfenseGroups.find(item => item._id.toString() === group.group)
          if (repository) {
            group.photos.forEach(photo => {
              if (repository.similar < photo.score) {
                identifies.push({
                  similar: photo.score.toFixed(0),
                  group: group.group,
                  id: photo.id,
                  userImage: photo.tag,
                  repository: repository
                })
              }
            })
          }
        })
      const faceImageBuffer = Buffer.from(data.face.crop.image, 'base64')
      let fullImageBuffer
      let isRightHandle = false
      if (faceSvrCfg.pattern.includes('full') && data.full && data.full.image) {
        fullImageBuffer = Buffer.from(data.full.image, 'base64')
      }
      if (identifies.length > 0) {
        for (let i = 0; i < identifies.length; i++) {
          let face = identifies[i]
          face = Object.assign(face, faceData)
          const user = await VeriUser.findOne({ image: face.userImage }).lean()
          if (user) {
            face.userId = user._id
            face.userGender = user.gender
            face.userName = user.name
            face.userAge = user.age
            face.userCode = user.code || ''
            face.remark = user.remark || ''
            face.isdefense = true
            face.groupName = face.repository.name + '布控'
            face.defenseTime = face.repository.defenseTime
            face.alarmAudio = face.repository.alarmAudio
            face.color = face.repository.color
            // 质量优先模式
            if (faceSvrCfg.output === QUALITYPROPRITY) {
              if (i > 0) {
                data.track = data.track + 1000 + i
              }
              isRightHandle = await useQualityPryMode({
                faceSvrCfg,
                cameraId,
                faceData: face,
                fullImageBuffer,
                faceImageBuffer,
                data,
                host
              })
              if (isRightHandle) {
                continue
              }
            } else {
              await useFullAmoutMode({
                faceData: face,
                faceImageBuffer,
                fullImageBuffer,
                data,
                timestamp,
                host
              })
            }
            if (face.isdefense) {
              publishFaceAlarm(face)
            }
            process.send({ type: 'add', data: face })
            // socket.veriFaceData(face)
          }
        }
      } else {
        if (faceSvrCfg.passby) {
          faceData.group = PASSBY._id.toString()
          faceData.groupName = '路人库'
          // 质量优先模式
          if (faceSvrCfg.output === QUALITYPROPRITY) {
            isRightHandle = await useQualityPryMode({
              faceSvrCfg,
              cameraId,
              faceData,
              fullImageBuffer,
              faceImageBuffer,
              data,
              host
            })
            if (isRightHandle) {
              return
            }
          } else {
            await useFullAmoutMode({
              faceData,
              faceImageBuffer,
              fullImageBuffer,
              data,
              timestamp,
              host
            })
          }
          // process.send(faceData)
          process.send({ type: 'add', data: faceData })
          // socket.veriFaceData(faceData)
        } else {
          // 人脸服务器不开启路人库，识别信息只推送不存储
          faceData.faceImage = getBase64Image(data.face.crop.image)
          faceData.fullImage = getBase64Image(data.full.image)
          // socket.veriFaceData(faceData)
          // process.send(faceData)
          process.send({ type: 'add', data: faceData })
          return
        }
      }
    } else {
      process.send({ type: 'unknow', data: data })
      // socket.veriFaceData(data)
    }
  } catch (error) {
    console.log(error)
  }
}
/**
 * 抓拍机实时识别处理功能
 * 获取当前布控底库，对比检索布控底库，找到满足相似度大于报警阈值的图片，报警入库，小于相似度报警阈值，当做陌生人处理
 */
exports.captureIdentify = async (fullImageBuffer, faceImageBuffer, resource) => {
  try {
    const [now, cameraId] = [moment(), resource._id.toString()]
    let [denfenseGroups, faceSvrCfg] = await Promise.all([getDefenseGroup(cameraId), FaceParameter.findOne().lean()])
    const host = { ip: resource.serverIp, port: resource.serverPort }
    const timestamp = now.unix()
    const groups = []
    denfenseGroups.forEach(item => {
      groups.push(item._id.toString())
    })
    // 人像识别入库基础数据组装
    const faceData = {
      dateTime: moment(now).format('YYYY-MM-DD'),
      hour: now.hour(),
      time: timestamp,
      timestamp: Number(now.format('x')),
      res: resource._id,
      resName: resource.name,
      resIp: resource.ip,
      resPort: resource.port,
      resChannel: resource.chan,
      isdefense: false
    }
    if (!PASSBY) {
      PASSBY = await VeriGroup.findOne({ name: '路人库' }).lean()
    }
    let data = null
    if (groups.length > 0) {
      const tempImageName = Math.random().toString(36) + '.jpg'
      data = await sdkInterface.searchByImgBuffer(groups, tempImageName, faceImageBuffer, host)
    }
    if (data) {
      const identifies = []
      faceData.age = Math.round(data.face.attrs.age)
      faceData.gender = Math.round(data.face.attrs.gender.male) + 1
      // 当前图片与底库多个人相似并且大于底库相似度报警阈值
      data.groups.map(group => {
        const repository = denfenseGroups.find(item => item._id.toString() === group.group)
        if (repository) {
          group.photos.map(photo => {
            if (repository.similar < photo.score) {
              identifies.push({
                similar: photo.score.toFixed(0),
                group: group.group,
                id: photo.id,
                userImage: photo.tag,
                repository: repository
              })
            }
          })
        }
      })
      for (let face of identifies) {
        face = Object.assign(face, faceData)
        const user = await VeriUser.findOne({ image: face.userImage }).lean()
        if (user) {
          face.userId = user._id
          face.userGender = user.gender
          face.userName = user.name
          face.userAge = user.age
          face.userCode = user.code || ''
          face.remark = user.remark || ''
          face.isdefense = true
          face.groupName = face.repository.name + '布控'
          face.defenseTime = face.repository.defenseTime
          face.alarmAudio = face.repository.alarmAudio
          face.color = face.repository.color
          // await inspectDefenseStatus(face.repository, face, cameraId)
          delete face.repository
          await useCaptureMode({
            cameraId,
            faceData: face,
            fullImageBuffer,
            faceImageBuffer,
            timestamp,
            host
          })
          if (face.isdefense) {
            publishFaceAlarm(face)
          }
          // socket.veriFaceData(face)
          process.send({ type: 'add', data: face })
        }
      }
      if (identifies.length > 0) {
        return
      }
    }
    if (faceSvrCfg.passby) {
      faceData.group = PASSBY._id.toString()
      faceData.groupName = '路人库'
      await useCaptureMode({
        cameraId,
        faceData,
        fullImageBuffer,
        faceImageBuffer,
        timestamp,
        host
      })
      // socket.veriFaceData(faceData)
      process.send({ type: 'add', data: faceData })
    } else {
      // 人脸服务器不开启路人库，识别信息只推送不存储
      if (data.face && data.face.crop && data.face.crop.image) {
        faceData.faceImage = getBase64Image(data.face.crop.image)
      }
      if (data.full && data.full.image) {
        faceData.fullImage = getBase64Image(data.full.image)
      }
      // socket.veriFaceData(faceData)
      // process.send(faceData)
      process.send({ type: 'add', data: faceData })
      return
    }
  } catch (err) {
    console.log(err)
    console.log('captureIdentify==', err.message)
  }
}

/**
 *  质量优先模式下，人脸数据缓存处理及入库、磁盘写入等操作
 * @param {object} faceSvrCfg 人脸服务器参数配置
 * @param {object} faceData 人脸入库数据
 * @param {object} cameraId 视频通道id
 * @param {object} data 人脸识别数据
 * @returns {boolean}
 */
const useQualityPryMode = async ({ faceSvrCfg, faceData, faceImageBuffer, fullImageBuffer, cameraId, data, host }) => {
  try {
    let id = new mongoose.Types.ObjectId().toString()
    // id = id.toString()
    // 人脸识别数据缓存处理
    const hit = faceCache.lookup({
      track: data.track,
      cameraId,
      quality: data.face.quality,
      id,
      isdefense: faceData.isdefense
    })
    if (hit.isFsWrite) {
      fsAsyncWrite(hit.faceImagePath, faceImageBuffer)
      faceData.faceImage = getUrlPath(hit.faceImagePath)
      if (faceSvrCfg.pattern.includes('full') && fullImageBuffer) {
        fsAsyncWrite(hit.fullImagePath, fullImageBuffer)
        faceData.fullImage = getUrlPath(hit.fullImagePath)
      }
      if (hit.status === CACHESTATUS_INSERT) {
        faceData._id = id
        faceData.trackid = data.track
        const result = await sdkInterface.uploadImageToSDK(
          hit.faceImagePath,
          faceImageBuffer,
          PASSBY._id.toString(),
          host
        )
        if (result.id) {
          faceData.idAndTag = result.id + '/' + host.ip + '/' + hit.faceImagePath.split('/').pop()
          faceData.groupImgId = result.id
          faceData.isCreateSync = true
        } else {
          faceData.isCreateSync = false
        }
        await VerifaceIdentify.create(faceData)
      } else {
        const existVeriface = await VerifaceIdentify.findById(hit.id).lean()
        if (existVeriface) {
          const result = await sdkInterface.uploadImageToSDK(
            hit.faceImagePath,
            faceImageBuffer,
            PASSBY._id.toString(),
            host
          )
          let doc = {}
          if (hit.isdefense) {
            doc = {
              similar: faceData.similar,
              group: faceData.group,
              userImage: faceData.userImage
            }
          }
          if (hit.passby2defense) {
            doc = {
              similar: faceData.similar,
              group: faceData.group,
              userImage: faceData.userImage,
              userId: faceData._id,
              userGender: faceData.gender,
              userName: faceData.name,
              userAge: faceData.age,
              userCode: faceData.code || '',
              remark: faceData.remark || '',
              isdefense: true,
              groupName: faceData.repository.name + '布控',
              defenseTime: faceData.repository.defenseTime,
              alarmAudio: faceData.repository.alarmAudio,
              color: faceData.repository.color
            }
          }
          if (result.id) {
            Object.assign(doc, {
              groupImgId: result.id,
              idAndTag: result.id + '/' + host.ip + '/' + hit.faceImagePath.split('/').pop(),
              isUpdateSync: true
            })
            sdkInterface.removeServerImage(PASSBY._id.toString(), existVeriface.groupImgId, host).catch(err => {
              console.log('removeServerImage: encounter error,message=', err.message)
            })
          } else {
            Object.assign(doc, { isUpdateSync: false })
          }
          await VerifaceIdentify.findByIdAndUpdate(hit.id, doc)
          // socket.veriFaceNotify({ _id: hit.id })
          process.send({ type: 'notify', data: { _id: hit.id } })
          return !hit.passby2defense
        }
      }
    } else {
      return true
    }
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
/**
 *  全量模式下，人脸数据缓存处理及入库、磁盘写入等操作
 * @param {object} faceSvrCfg 人脸服务器参数配置
 * @param {object} faceData 人脸入库数据
 * @param {object} cameraId 视频通道id
 * @param {object} data 人脸识别数据
 * @returns {boolean}
 */
const useFullAmoutMode = async ({ faceData, faceImageBuffer, fullImageBuffer, data, timestamp, host }) => {
  try {
    const [faceImagePath, fullImagePath] = getImageFsPath(data.track, timestamp)
    fsAsyncWrite(faceImagePath, faceImageBuffer)
    faceData.faceImage = getUrlPath(faceImagePath)
    if (fullImageBuffer) {
      fsAsyncWrite(fullImagePath, fullImageBuffer)
      faceData.fullImage = getUrlPath(fullImagePath)
    }
    const result = await sdkInterface.uploadImageToSDK(faceImagePath, faceImageBuffer, PASSBY._id.toString(), host)
    if (result.id) {
      faceData.idAndTag = result.id + '/' + host.ip + '/' + faceImagePath.split('/').pop()
      faceData.groupImgId = result.id
      faceData.isCreateSync = true
    } else {
      faceData.isCreateSync = false
    }
    await VerifaceIdentify.create(faceData)
  } catch (error) {
    throw error
  }
}
/**
 *  抓拍模式下，人脸数据缓存处理及入库、磁盘写入等操作
 * @param {object} faceSvrCfg 人脸服务器参数配置
 * @param {object} faceData 人脸入库数据
 * @param {object} cameraId 视频通道id
 * @param {object} data 人脸识别数据
 * @returns {boolean}
 */
const useCaptureMode = async ({ faceData, fullImageBuffer, faceImageBuffer, timestamp, host, cameraId }) => {
  try {
    const [faceImagePath, fullImagePath] = getImageFsPath('', timestamp, cameraId, 'capture')
    fsAsyncWrite(faceImagePath, faceImageBuffer)
    faceData.faceImage = getUrlPath(faceImagePath)
    if (fullImageBuffer) {
      fsAsyncWrite(fullImagePath, fullImageBuffer)
      faceData.fullImage = getUrlPath(fullImagePath)
    }
    const result = await sdkInterface.uploadImageToSDK(faceImagePath, faceImageBuffer, PASSBY._id.toString(), host)
    if (result.id) {
      faceData.idAndTag = result.id + '/' + host.ip + '/' + faceImagePath.split('/').pop()
      faceData.groupImgId = result.id
      faceData.isCreateSync = true
    } else {
      faceData.isCreateSync = false
    }
    await VerifaceIdentify.create(faceData)
  } catch (error) {
    throw error
  }
}

/**
 * 查找当前正在布控的底库
 * @param {string} cameraId  视频通道Id
 */
const getDefenseGroup = async cameraId => {
  const nowTime = moment().unix()
  let groups = []
  const defenseTasks = await DefenseTask.find({ vaild: true })
    .populate('groups')
    .lean()
  defenseTasks.forEach(task => {
    if (task.always || (nowTime >= task.startTime && nowTime <= task.endTime)) {
      if (task.points.map(item => item.toString()).includes(cameraId)) {
        task.groups.forEach(group => {
          if (task.always) {
            group.defenseTime = '永久'
          } else {
            group.defenseTime = `${moment(task.startTime).format('YYYY-MM-DD hh:mm:dd')}~${moment(task.endTime).format(
              'YYYY-MM-DD hh:mm:dd'
            )}`
          }
        })
        groups = groups.concat(task.groups)
      }
    }
  })
  return groups
}

/**
 * 图片物理路径转换成网络路径
 * @param {string} imagePath  图片的物理路径
 * @param {string} separator  分隔字符串
 * @returns {string} 图片网络路径
 */
const getUrlPath = (imagePath, separator = 'passer') => {
  return `/image/face/passer${imagePath.split(separator).pop()}`
}
/**
 * 图片Base64格式
 * @param {string} imagePath  图片的物理路径
 * @returns {string} 图片的base格式
 */
const getBase64Image = base64Code => {
  return `data:image/jpeg;base64,${base64Code}`
}
/**
 * 组装识别图片的磁盘写入物理路径
 * @param {number} track 人脸识别的人员trackId
 * @param {number} timestamp 当前识别处理时间
 * @returns {array} 人脸图片与全景图的路径
 */
const getImageFsPath = (track, timestamp, resourceId, mode = STREAM) => {
  const nowDate = moment().format('YYYY-MM-DD')
  const basePath = `${config.fileDirs.facePasserPictureDir}/${nowDate}/${resourceId}`
  if (!fs.existsSync(basePath)) {
    mkdirsSync(basePath)
  }
  if (mode === STREAM) {
    return ['face', 'full'].map(item => `${basePath}/${track}_${timestamp}_${item}.jpg`)
  } else {
    return ['face', 'full'].map(item => `${basePath}/${Math.random().toString(36)}_${timestamp}_${item}.jpg`)
  }
}

/**
 * 异步将文件buffer写入磁盘。
 * 统一处理回调
 * @param {number} fielPath 文件路径
 * @param {number} fileBuffer 文件buffer
 */
const fsAsyncWrite = (fielPath, fileBuffer) => {
  fs.writeFile(fielPath, fileBuffer, err => {
    if (err) {
      console.log(`message==`, err.message)
    }
  })
}
/**
 * 推送人脸报警
 */
const publishFaceAlarm = data => {
  try {
    const alarm = {}
    alarm.devIp = data.resIp
    alarm.devPort = data.resPort
    alarm.channel = data.resChannel
    alarm.eventType = 'faceControl'
    alarm.dealState = 'unProcess'
    alarm.extraInfo = data
    Alarm.alarmFace(alarm)
  } catch (err) {
    console.log(err.message)
  }
}
