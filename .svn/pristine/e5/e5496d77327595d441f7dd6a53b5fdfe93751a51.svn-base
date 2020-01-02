/*
 * @Author: lushengying
 * @Date: 2019-08-07 16:49:46
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-30 17:51:17
*/
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const config = require('../../../../../config').backend
const rp = require('request-promise')
const RECORDPATH = '/opt/bstar/video/case' // 录像存储路径
const zipController = require('./zipController/zipController')
const { NODE_ENV } = process.env
process.env.NODE_ENV = NODE_ENV || 'production'

process.on('message', async alarmInfo => {
  try {
    const { type, resources } = alarmInfo
    console.log('子进程的数据是=======', alarmInfo)
    if (type === 'exit') {
      process.exit()
    }
    const videoPath = path.join(RECORDPATH, resources._id)
    await dirCheck(videoPath) // 创建文件夹
    const reqList = [] // 录像查询
    console.log('准备进入循环==============')
    if (alarmInfo.zipType === 'tracking') {
      let startArr = []
      let endArr = []
      resources.resourceList.map((item) => {
        if (item.startTime) {
          startArr.push(item.startTime)
        }
        if (item.endTime) {
          endArr.push(item.endTime)
        }
      })
      let maxStart = Math.max.apply(Math, startArr)
      let maxEnd = 0
      if (endArr.length) {
        maxEnd = Math.max.apply(Math, endArr)
      }
      resources.resourceList.map((item) => {
        if (!item.endTime) {
          if (maxEnd && item.startTime < maxEnd) {
            item.endTime = maxEnd
          } else if (maxEnd && item.startTime >= maxEnd) {
            item.endTime = maxStart + 10
          } else if (!maxEnd && item.startTime < maxStart) {
            item.endTime = maxStart
          } else if (!maxEnd && item.startTime >= maxStart) {
            item.endTime = maxStart + 10
          }
        }
      })
    }
    resources.resourceList.map(info => {
      console.log('这是info的数据============', info)
      _.get(info, 'tagTime', []).map(tag => {
        console.log('这是tag的数据============', tag)
        reqList.push((
          async function () {
            const obj = {}
            const body = {
              'devIp': info.resource.eid.ip,
              'devPort': info.resource.eid.cport,
              'channel': info.resource.chan,
              'eventType': ['all'],
              'typeName': '',
              'typeContent': '',
              'startTime': tag.startTime,
              'endTime': tag.endTime,
              'streamType': 'all',
              'page': 1,
              'rows': 100
            }
            console.log('查询录像的请求参数==============', body)
            obj.eventInfo = {
              eventName: resources.eventName,
              _id: resources._id
            }
            obj.resource = info.resource
            obj.tag = tag
            obj.query = null
            obj['query'] = await queryRecord(
              { body }
            )
            console.log('query参数==============', obj)
            return obj
          }
        )())
      })
    })
    const reqResult = await Promise.all(reqList) // 录像查询结果
    let downList = downloadTask(reqResult)
    const downResult = []
    for (let i = 0, downLength = downList.length; i < downLength; i++) {
      const obj = await downLoadRecord(downList[i])
      downResult.push(obj)
    }
    let completeStatus = true
    downResult.map(status => {
      if (status.success === false) {
        completeStatus = false
      }
    })
    console.log('==============准备进入压缩任务')
    await zipController.zip(alarmInfo.resources, alarmInfo.zipType, alarmInfo.info)
    console.log('==========任务已经执行完毕，准备发送消息')
    process.send({
      type: 'complete',
      completeStatus,
      resourcesId: resources._id,
      backupType: resources.backupType
    })
    process.exit()
  } catch (error) {
    console.log('================================ 进入子进程 error' + error)
    process.exit()
  }
})

async function dirCheck (videoPath) {
  // const exists = await fs.access(videoPath, error => {
  //   console.log('error', error)
  // })
  // if (exists) {
  //   deleteall(videoPath) // 清除已下载内容
  // }
  // noinspection JSAnnotator
  deleteall(videoPath) // 每次创建文件夹之前都要将旧的文件夹删除掉
  mkdirsSync(videoPath) // 创建文件目录
}

function deleteall (path) {
  // var files = []
  // if (fs.existsSync(path)) {
  //   files = fs.readdirSync(path)
  //   files.forEach(function (file, index) {
  //     var curPath = path + '/' + file
  //     if (fs.statSync(curPath).isDirectory()) { // recurse
  //       deleteall(curPath)
  //     } else { // delete file
  //       fs.unlinkSync(curPath)
  //     }
  //   })
  //   fs.rmdirSync(path)
  // }
  if (fs.existsSync(path)) {
    let files = fs.readdirSync(path)
    for (let item of files) {
      let curPath = `${path}/${item}`
      fs.unlinkSync(curPath)
    }
    fs.rmdirSync(path)
  }
}

// 创建文件夹
function mkdirsSync (dirname) {
  console.log('======创建的文件夹名称是', dirname)
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

// 创建下载任务
function downloadTask (recordHistory) {
  const downList = []
  recordHistory.map(record => {
    const { resource, tag, query, eventInfo } = record
    let i = 1
    _.get(query, 'result.eventList', []).map(event => {
      let obj = {}
      if (tag.startTime <= event.evtTblInfo.startTime) {
        if (tag.endTime >= event.evtTblInfo.startTime && tag.endTime <= event.evtTblInfo.endTime) {
          obj.startTime = event.evtTblInfo.startTime
          obj.endTime = tag.endTime
        } else if (tag.endTime >= event.evtTblInfo.startTime) {
          obj.startTime = event.evtTblInfo.startTime
          obj.endTime = event.evtTblInfo.endTime
        }
      } else {
        if (tag.startTime <= event.evtTblInfo.endTime && tag.endTime <= event.evtTblInfo.endTime) {
          obj.startTime = tag.startTime
          obj.endTime = tag.endTime
        } else if (tag.startTime <= event.evtTblInfo.endTime) {
          obj.startTime = tag.startTime
          obj.endTime = event.evtTblInfo.endTime
        }
      }
      if (!_.isEmpty(obj)) {
        obj.dPort = 9002
        obj.dsIp = query.result.dsIp
        obj.cStrName = event.strmInfo.cStrName
        obj.ch = event.strmInfo.ch
        obj.devType = event.strmInfo.devType
        obj.ip = event.strmInfo.ip
        obj.mType = event.strmInfo.mType
        obj.mac = event.strmInfo.mac
        obj.port = event.strmInfo.port
        obj.ptype = event.strmInfo.pType
        obj.resolution = event.strmInfo.resolution
        obj.sType = event.strmInfo.sType
        obj.fileName = `${eventInfo._id}/${eventInfo.eventName}-${resource.name}-${moment(tag.startTime * 1000).format('YYYY-MM-DD HH-mm-ss')}-${moment(tag.endTime * 1000).format('YYYY-MM-DD HH-mm-ss')}-${i}`
        downList.push(obj)
        i++
      }
    })
  })
  return downList
}

// 查询录像
async function queryRecord ({ url = `${config.serviceUrl}/api/record/query`, method = 'POST', body = {} }) {
  return rp({
    method: method,
    url: url,
    body: body,
    json: true
  })
}

// 执行下载录像
async function downLoadRecord (downInfo) {
  const URI = `http://${downInfo.dsIp || ''}:${downInfo.dPort || ''}/rest/2.0/school/auth_none?session=&call=download&startTime=${downInfo.startTime || ''}&endTime=${downInfo.endTime || ''}&cStrName=${downInfo.cStrName || ''}&ch=${downInfo.ch || 0}&devType=${downInfo.devType || 0}&ip=${downInfo.ip || 0}&mType=${downInfo.mType || 0}&mac=${downInfo.mac || ''}&port=${downInfo.port || 80}&ptype=${downInfo.ptype || 0}&resolution=${downInfo.resolution || 0}&sType=${downInfo.sType || 0}&fileName=`
  console.log('URL-------------------->', URI)
  const options = {
    method: 'GET',
    // uri: 'http://192.168.14.67:9002/rest/2.0/school/auth_none?session=&call=download&startTime=1562894038&endTime=1562898078&cStrName=&ch=2&devType=0&ip=3232237395&mType=1&mac=&port=3721&ptype=0&resolution=0&sType=1&fileName=name1',
    uri: URI,
    json: true
  }
  // let writeStream = fs.createWriteStream(`${downInfo.fileName || ''}.mp4`, { autoClose: true })
  // const res = await rp(URI)
  let writeStream = fs.createWriteStream(`${RECORDPATH}/${downInfo.fileName}.mp4`, { autoClose: true })
  const res = rp(options)
  return new Promise((resolve, reject) => {
    try {
      res.pipe(writeStream)
      writeStream.on('finish', function () {
        resolve({ success: true })
      })
      writeStream.on('pipe', (src) => {
        console.log('有数据正通过管道流入写入器')
      })
      writeStream.on('error', function (error) {
        console.log('error===============1', error)
        resolve({ success: false, downInfo: downInfo })
      })
    } catch (error) {
      console.log('error=================2', error)
      resolve({ success: false, downInfo: downInfo })
    }
  })
}
