/*
 * @Author: litao
 * @Date: 2019-07-26 09:21:13
 * 该模块主要提供对人车同检的(核验分数)进行维护
 * -----------------------------README-----------------------------
 * backup()   备份报警信息
 * download() 下载备份文件
 * zipBuffer() 私有方法 将文件夹转换为zip流
 * copyImage() 私有方法  复制图片文件
 * downloadVideo() 私有方法 下载多个视频文件
 * generatorDocx() 私有方法 生成world文档
 * worker() 私有方法 执行下载单个视频文件
 * floderName() 私有方法 获取指定目录下所有的文件夹名称,并返回最大的文件夹名称
 */

'use strict'
const mongoose = require('mongoose')
const AlarmRemark = mongoose.model('AlarmRemark')
const Record = mongoose.model('Record')
const Resource = mongoose.model('Resource')

const _ = require('lodash')
const moment = require('moment')
const request = require('request')
const path = require('path')
const fs = require('fs')
const zipdir = require('zip-dir')
const { Document, Packer, Paragraph, HeadingLevel } = require('docx')
const rq = require('../../bstar/req')

const TYPE = require('./type')
const AlarmLogController = require('./alarmLog.controller')
const { handleSysException } = require('../../../common/tools')
const Config = require('../../../../config').backend

const backup = async ctx => {
  const { id } = ctx.params
  // 创建目录
  const dir = path.join(Config.fileDirs.alarmBackUpDir, `/${id}`)
  try {
    const AlarmLog = await AlarmLogController.getAlarmLogModel()
    const log = await AlarmLog.findById(id).lean()
    const remarks = await AlarmRemark.find({ alarmId: log._id }, 'remarks').lean()

    let isBackup = false
    const historyVideos = []

    if (fs.existsSync(dir)) {
      isBackup = true
      // 如果目录存在，则目录下所有的文件
      const files = fs.readdirSync(dir)
      files.forEach(file => {
        // 删除历史docx文件
        path.extname(file) === '.docx' && fs.unlinkSync(path.join(dir, `/${file}`))
        // 获取所有已经下载的视频文件名称
        path.extname(file) === '.mp4' && historyVideos.push({ success: true, fileName: path.basename(file) })
      })
    } else {
      // 如果目录不存在，则创建目录
      fs.mkdirSync(dir)
    }

    if (log['eventType'] === 'faceControl' && !isBackup) {
      // const [f1, f2, f3, f4, ...faceFiles] = log['faceImage'].split('/')
      // const faceImagePath = path.join(Config.fileDirs.facePasserPictureDir, `/${faceFiles.join('/')}`)
      const faceImagePath = getFileDiskPath(log['faceImage'], Config.fileDirs.facePasserPictureDir)
      const faceFileName = path.basename(faceImagePath)
      copyImage(faceImagePath, path.join(dir, `/${faceFileName}`))

      // const [u1, u2, ...userFiles] = log['userImage'].split('/')
      // const userImagePath = path.join(Config.fileDirs.faceUserPictureDir, `/${userFiles.join('/')}`)
      const userImagePath = getFileDiskPath(log['userImage'], Config.fileDirs.faceUserPictureDir)
      const userFileName = path.basename(userImagePath)
      copyImage(userImagePath, path.join(dir, `/${userFileName}`))
    } else if (['vioRetrograde', 'vioPark', 'vioTurnLeft', 'vioTurnRight'].includes(log['eventType'])) {
      const vioImage =
        log['carImgUrl'] || log['carImg1Url'] || log['carImg2Url'] || log['carNumPic'] || log['combinedPicUrl']
      // const [u1, u2, ...vioFiles] = vioImage.split('/')
      // const vioImagePath = path.join(Config.fileDirs.faceUserPictureDir, `/${vioFiles.join('/')}`)
      const vioImagePath = getFileDiskPath(vioImage, Config.fileDirs.faceUserPictureDir)
      const vioFileName = path.basename(vioImagePath)
      copyImage(vioImagePath, path.join(dir, `/${vioFileName}`))
    }
    let videos = log.action
    // 如果时第一次备份，则需要获取视频并下载视频文件以及导出文档
    if (!isBackup) {
      let videoPaths = []
      if (videos && videos.length > 0) {
        videoPaths = await downloadVideo(videos, dir)
      }
      generatorDocx(log, remarks, dir, videoPaths)
    } else {
      generatorDocx(log, remarks, dir, historyVideos)
    }

    ctx.status = 200
  } catch (error) {
    fs.rmdirSync(dir)
    handleSysException(error)
  }
}

const download = async ctx => {
  const { id } = ctx.params
  const fileName = `${moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.zip`
  const dir = path.join(Config.fileDirs.alarmBackUpDir, `/${id}`)
  if (!fs.existsSync(dir)) {
    ctx.body = {
      success: false,
      message: '未找到备份文件,请先备份!'
    }
    return
  }
  const buffer = await zipBuffer(dir)

  ctx.type = 'application/vnd-openxmlformats'
  ctx.attachment(fileName)
  ctx.body = buffer
}

const status = async ctx => {
  const { id } = ctx.params
  const dir = path.join(Config.fileDirs.alarmBackUpDir, `/${id}`)
  const result = { backup: true }
  if (!fs.existsSync(dir)) {
    result.backup = false
  } else {
    result.backup = fs.readdirSync(dir).some(file => {
      return path.extname(file) === '.docx'
    })
  }
  ctx.body = result
}

module.exports = {
  backup,
  download,
  status
}

const zipBuffer = dir => {
  return new Promise((resolve, reject) => {
    zipdir(dir, (err, buffer) => {
      if (err) {
        resolve([])
        return
      }
      resolve(buffer)
    })
  })
}

const copyImage = (_src, _dst) => {
  if (fs.existsSync(_src)) {
    const stat = fs.statSync(_src)
    if (stat.isFile()) {
      const readable = fs.createReadStream(_src)
      const writable = fs.createWriteStream(_dst)
      readable.pipe(writable)
    }
  }
}

const downloadVideo = async (videos, baseDir) => {
  let downloadUrls = []
  const records = []
  for (const resource of videos) {
    let result = await Record.find({ resource: resource.channelId.toString() }).lean()
    if (!result) {
      result = await Resource.find({ _id: resource.channelId.toString() }).lean()
    }
    records.push(result)
  }
  videos.forEach((item, index) => {
    const streamType = getVideoStreamType(records[index])
    if (streamType === '') {
      downloadUrls.push('')
    } else {
      downloadUrls.push(
        rq.req({
          url: '/api/record/mp4download',
          method: 'POST',
          body: {
            startTime: item.startTime,
            endTime: item.endTime,
            channel: item.channel,
            devIp: item.devIp,
            devPort: item.devPort,
            streamType: streamType,
            fileName: 'name1'
          }
        })
      )
    }
  })
  const results = []
  downloadUrls = await Promise.all(downloadUrls)
  for (let i = 0; i < downloadUrls.length; i++) {
    const item = downloadUrls[i]
    const savePath = path.join(baseDir, `/${videos[i].channelName}.mp4`)
    const result = await worker(item.url, savePath)
    results.push(result)
  }
  return results
}

const worker = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(filepath)
    request
      .get(url)
      .on('end', data => {
        resolve({ success: true, fileName })
      })
      .on('error', msg => {
        resolve({ success: false, fileName })
      })
      .pipe(fs.createWriteStream(filepath))
  })
}
const generatorDocx = async (log, remarks, baseDir, videos) => {
  const fileName = `${moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}`
  const savePath = path.join(baseDir, `${fileName}.docx`)
  const doc = new Document()
  doc.Styles.createParagraphStyle('Heading3', 'Heading 3')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(25)
    .bold()
    .spacing({ after: 120 })
  doc.createParagraph('报警信息').style('Heading3')
  const obj = TYPE[log['eventType']]
  Object.keys(obj).forEach((key, index) => {
    let value = obj[key]
    let svalue = _.get(log, key)
    if (typeof value === 'object') {
      const _obj = Object.assign(value)
      value = _obj.name
      svalue = _obj.format(svalue)
    }
    doc.createParagraph(`${value}:${svalue || '无'}`)
  })
  doc.createParagraph('')
  doc.createParagraph('报警视频信息').style('Heading3')
  if (videos.length > 0) {
    videos.forEach(item => {
      doc.createParagraph(`通道名称:${path.basename(item.fileName, '.mp4')}`)
      doc.createParagraph(`视频文件:${!item.success ? '视频下载失败' : item.fileName}`)
    })
  }
  if (remarks.length > 0) {
    doc.createParagraph('')
    doc.createParagraph('报警备注').style('Heading3')
    remarks.forEach(item => {
      if (item.remarks.length > 0) {
        item.remarks.forEach(remark => {
          doc.createParagraph(`${moment(remark.time).format('YYYY-MM-DD HH:mm:ss')}:${remark.remark}`)
        })
      }
    })
  }
  const packer = new Packer()
  const buffer = await packer.toBuffer(doc)
  fs.writeFileSync(savePath, buffer)
}

/**
 * 网络地址转换磁盘路径
 * @param {*} filePath
 * @param {*} prefix
 */
const getFileDiskPath = (filePath, prefix) => {
  const lastPath = path.basename(prefix)
  const regex = new RegExp(`.*/${lastPath}`)
  return filePath.replace(regex, prefix)
}

const getVideoStreamType = records => {
  if (records.length > 0) {
    let record = _.find(records, { takeType: 'eventVideo' })
    if (!record) {
      record = _.find(records, { takeType: 'timeVideo' })
    }
    if (!record) {
      record = _.find(records, 'stream')
      return record && record.stream
    } else {
      return record.streamType
    }
  }
  return ''
}
