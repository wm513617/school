
/*
 * @Author: linhang
 * @Date: 2018-09-10 09:23:23
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-11 16:09:20
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-09-10 19:51:03
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2019-10-26 15:54:36
 */

'use strict'
const mongoose = require('mongoose')
const fs = require('fs')
const AlarmEvent = mongoose.model('AlarmEvent')
const Tracking = mongoose.model('tracking')
const _ = require('lodash')
const moment = require('moment')
const paging = require('../../paging')
const config = require('../../../../config').backend
const sendKoa = require('koa-send')
const { handleSysException } = require('../../../common/tools')
const { childProcessZip, childProcessExecl } = require('../childprocess/childProcessExcelAndPdf')

// 获取接警事件
exports.getAlarmEvent = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取接警事件'))
    const search = ctx.query.search
    search.close = false
    if (search.deal && search.deal === '0') {
      search['detail.0'] = { $exists: 0 }
    }
    if (search.startTime && search.endTime) {
      search.alarmTime = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    search.$or = [{ eventName: { $regex: search.name || '' } }, { person: { $regex: search.name || '' } }, { studentNum: { $regex: search.name || '' } }]
    delete search.startTime
    delete search.endTime
    delete search.name
    delete search.deal
    const results = await paging.listQuery(AlarmEvent, search, '', { alarmTime: -1 }, ctx.query.page, '', ctx)
    ctx.body = results.results
  } catch (err) {
    handleSysException(err)
  }
}
// 新建接警事件
exports.create = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-新建接警事件'))
    const alarmEvent = ctx.request.body
    const n = Math.floor(Math.random() * 10000) + ''
    const eventCode = moment().format('YYYYMMDD') + _.padStart(n, 4, '0')
    alarmEvent.eventCode = eventCode
    alarmEvent.createTime = moment().unix()
    alarmEvent.close = false
    await AlarmEvent.create(alarmEvent)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
// 修改接警事件
exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改接警事件'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const alarmEvent = ctx.request.body
    if (_.get(alarmEvent, '.resourceList', false)) {
      alarmEvent.resourceList = alarmEvent.resourceList.map(item => {
        if (_.get(item, 'tagTime', false)) {
          item.tagTime = _.get(item, 'tagTime', []).map(tag => {
            return {
              startTime: tag.startTime > alarmEvent.startTime ? tag.startTime : alarmEvent.startTime,
              endTime: tag.endTime > alarmEvent.endTime ? tag.endTime : alarmEvent.endTime
            }
          }
          )
        }
        return item
      })
    }
    await AlarmEvent.findByIdAndUpdate(id, alarmEvent)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 删除接警事件
exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除接警事件'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await AlarmEvent.remove({ _id: { $in: ids } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 处理接警事件
exports.handleAlarm = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-处理接警事件'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const data = ctx.request.body
    const detail = data.detail
    const alarmEvent = await AlarmEvent.findById(id)
      .lean()
      .exec()
    if (alarmEvent.detail) {
      alarmEvent.detail.push(detail[0])
    } else {
      alarmEvent.detail = detail
    }
    if (data.close) {
      alarmEvent.closeTime = moment().unix()
    }
    alarmEvent.state = data.state
    alarmEvent.close = data.close
    await AlarmEvent.findByIdAndUpdate(id, alarmEvent)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 查询历史接警事件
exports.getAlarmHistory = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询历史接警事件'))
    const search = ctx.query.search
    if (search.startTime && search.endTime) {
      search.alarmTime = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    search.$or = [{ eventName: { $regex: search.name || '' } }, { studentNum: { $regex: search.name || '' } }, { person: { $regex: search.name || '' } }]
    if (Number(search.state) === 0) {
      delete search.state
    } else if (Number(search.state) === 1) {
      search.state = 1
    } else if (Number(search.state) === 2) {
      search.state = 2
    }
    search.close = true
    delete search.startTime
    delete search.endTime
    delete search.name
    const results = await paging.listQuery(AlarmEvent, search, '', { alarmTime: -1 }, ctx.query.page, '', ctx)
    ctx.body = results.results
  } catch (err) {
    handleSysException(err)
  }
}

exports.getAlarmResource = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询当前全部案件所属资源'))
    const select = {}
    if (ctx.query.state) {
      select.state = ctx.query.state
    }
    const result = await AlarmEvent.find(select, '_id eventName resourceList')
      // .populate({ path: 'resourceList', select: 'chan stream ip port protocol model rtsp ' })
      .populate({ path: 'resourceList.resource', select: 'chan stream ip port protocol model rtsp ' })
      .exec()
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAlarmInfo = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询案件详情'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const [result, trackingInfo] = await Promise.all([
      AlarmEvent.findById(id)
        .populate({ path: 'resourceList.resource', select: 'name eid chan', populate: { path: 'eid' } })
        .lean()
        .exec(),
      Tracking.findOne({ eventId: id }, '-close -eventId')
        .populate({ path: 'mapList.resource', select: 'eid name chan', populate: { path: 'eid', select: 'cport ip' } })
        .lean()
        .exec()
    ])
    _.remove(result.resourceList, e => !e.resource) // 若删除资源数据，则将该条数据全部清空
    if (trackingInfo) {
      _.remove(trackingInfo.mapList, e => !e.resource)
      result.trackingInfo = trackingInfo
    }
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}

exports.updateRecodeTime = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改录像时间'))
    const id = ctx.params.id
    const rid = ctx.params.rid
    let tag = ctx.request.body
    if (_.isEmpty(id) || _.isEmpty(rid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const query = {
      _id: id,
      resourceList: { $elemMatch: { resource: rid } }
    }
    const { startTime, endTime } = await AlarmEvent.findOne(query, 'startTime endTime')
      .lean()
      .exec()
    tag = tag.map(item => {
      return {
        startTime: item.startTime < startTime ? startTime : item.startTime,
        endTime: item.endTime > endTime ? endTime : item.endTime,
        tagName: item.tagName
      }
    })
    const tagTime = tag
    await AlarmEvent.updateOne(query, { 'resourceList.$.tagTime': tagTime }).exec()
    ctx.body = 201
  } catch (err) {
    handleSysException(err)
  }
}

exports.getAlarmTree = async ctx => {
  try {
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let project = [
      '_id',
      'eventName',
      'startTime',
      'endTime',
      'resourceList.isMark',
      'resource._id',
      'resource.chan',
      'resource.name',
      'eid.ip',
      'eid.cport',
      'eid.dport',
      'resource'
    ]
    let projectObj = {}
    for (const iterator of project) {
      projectObj[iterator] = 1
    }
    let select = [
      { $match: { close: false, _id: mongoose.Types.ObjectId(id) } },
      { $lookup: { from: 'resources', localField: 'resourceList.resource', foreignField: '_id', as: 'resource' } },
      { $lookup: { from: 'devices', localField: 'resource.eid', foreignField: '_id', as: 'eid' } }
      // { $project: projectObj }
    ]
    let children = await AlarmEvent.aggregate(select)
    children = children.map(item => {
      item.resource.forEach((element, index) => {
        for (let index = 0; index < item.resourceList.length; index++) {
          const res = item.resourceList[index]
          if (res.resource + '' === element._id + '') {
            element.isMark = res.isMark
            break
          }
        }
        element.eid = item.eid[index]
      })
      return item
    })
    ctx.body = [
      {
        eventName: '案件列表',
        root: true,
        resource: children
      }
    ]
  } catch (err) {
    handleSysException(err)
  }
}

// 只显示名称
exports.getAlarmTreeName = async ctx => {
  try {
    let select = {
      close: false
    }
    let list = await AlarmEvent.find(select, 'eventName _id').exec()
    ctx.body = list
  } catch (err) {
    handleSysException(err)
  }
}

// 导出案件详情
exports.exportZip = async (ctx, next) => {
  // let resources = {
  //   mapList: [
  //     {
  //       startTime: 1578898000
  //     },
  //     {
  //       startTime: 1568980100,
  //       endTime: 1568980200
  //     },
  //     {
  //       startTime: 1568980200
  //     },
  //     {
  //       startTime: 1568980300
  //     }
  //   ]
  // }
  try {
    // let startArr = []
    // let endArr = []
    // resources.mapList.map((item) => {
    //   if (item.startTime) {
    //     startArr.push(item.startTime)
    //   }
    //   if (item.endTime) {
    //     endArr.push(item.endTime)
    //   }
    // })
    // let maxStart = Math.max.apply(Math, startArr)
    // let maxEnd = 0
    // if (endArr.length) {
    //   maxEnd = Math.max.apply(Math, endArr)
    // }
    // resources.mapList.map((item) => {
    //   if (!item.endTime) {
    //     if (maxEnd && item.startTime < maxEnd) {
    //       item.endTime = maxEnd
    //     } else if (maxEnd && item.startTime >= maxEnd) {
    //       item.endTime = maxStart + 10
    //     } else if (!maxEnd && item.startTime < maxStart) {
    //       item.endTime = maxStart
    //     } else if (!maxEnd && item.startTime >= maxStart) {
    //       item.endTime = maxStart + 10
    //     }
    //   }
    // })
    // ctx.body = {
    //   maxEnd: maxEnd,
    //   maxStart: maxStart,
    //   startArr: startArr,
    //   endArr: endArr,
    //   data: resources.mapList
    // }
    const name = `${ctx.params.name}.zip`
    const path = `${config.fileDirs.alarmBackUpDir}/${name}`
    if (fs.existsSync(path)) {
      if (ctx.query.type === 'find') { // 如果是查询该文件是否存在
        ctx.body = {
          code: 200,
          message: '文件存在'
        }
      } else {
        await sendKoa(ctx, path, { root: '/' })
      }
    } else {
      ctx.body = {
        code: 500,
        path: path,
        message: '文件不存在'
      }
    }
  } catch (err) {
    handleSysException(err)
  }
  // try {
  //   const id = ctx.params.id
  //   if (!id) {
  //     ctx.throw(500, { code: 2001, message: '参数不能为空' })
  //   }
  //   const alarmInfo = await AlarmEvent.findOne({ _id: id }).populate({ path: 'resourceList.resource', select: 'name' }).lean().exec()
  //   const templatePath = path.resolve(__dirname, './template.xml')
  //   const template = fs.readFileSync(templatePath)
  //   let templateStr = template.toString()
  //   let resourceList = ''
  //   let detailList = ``
  //   _.get(alarmInfo, 'resourceList', []).map(item => {
  //     _.get(item, 'tagTime', []).map(tag => {
  //       resourceList += `   <tr height="24" style='height:14.40pt;'>
  //       <td class="xl72" height="24" colspan="2" style='height:14.40pt;border-right:none;border-bottom:none;' x:str>
  //        ${_.get(item, 'resource.name', '')}-${moment(_.get(tag, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}-${moment(_.get(tag, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}
  //       </td>
  //       <td colspan="4" style='mso-ignore:colspan;'></td>
  //      </tr>`
  //     })
  //   })
  //   _.get(alarmInfo, 'detail', []).map(item => {
  //     detailList += `   <tr height="24" style='height:14.40pt;'>
  //     <td class="xl71" height="24" style='height:14.40pt;' x:str="'${moment(_.get(item, 'handleTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}">${moment(_.get(item, 'handleTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}</td>
  //     <td x:str>${item.detail}</td>
  //     <td colspan="4" style='mso-ignore:colspan;'></td>
  //    </tr>`
  //   })
  //   const name = `${_.get(alarmInfo, 'eventName', '')}-${_.get(alarmInfo, 'person', '')}`
  //   const data = new Map([
  //     [/{eventName-person}/, name],
  //     [/{eventName}/, alarmInfo.eventName || ''],
  //     [/{person}/, alarmInfo.person || ''],
  //     [/{gender}/, _.get(alarmInfo, 'gender', 1) === 1 ? '男' : '女'],
  //     [/{age}/, alarmInfo.age || ''],
  //     [/{nationality}/, alarmInfo.nationality || ''],
  //     [/{department}/, alarmInfo.department || ''],
  //     [/{identityNum}/, alarmInfo.identityNum || ''],
  //     [/{address}/, alarmInfo.address || ''],
  //     [/{phone}/, alarmInfo.phone || ''],
  //     [/{incidentAddress}/, alarmInfo.incidentAddress || ''],
  //     [/{mark}/, alarmInfo.mark || ''],
  //     [/{studentNum}/, alarmInfo.studentNum || ''],
  //     [/{isRecode}/, alarmInfo.isRecode === true ? '是' : '否'],
  //     [/{startTime}/, moment(_.get(alarmInfo, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
  //     [/{startTimestr}/, `"'${moment(_.get(alarmInfo, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
  //     [/{endTime}/, moment(_.get(alarmInfo, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
  //     [/{endTimestr}/, `"'${moment(_.get(alarmInfo, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
  //     [/{alarmTime}/, moment(_.get(alarmInfo, 'alarmTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
  //     [/{alarmTimestr}/, `"'${moment(_.get(alarmInfo, 'alarmTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
  //     [/{description}/, alarmInfo.description || ''],
  //     [/{resourceList}/, resourceList || ''],
  //     [/{detailList}/, detailList || '']
  //   ])
  //   data.forEach((value, key) => {
  //     templateStr = templateStr.replace(key, value)
  //   })
  //   ctx.type = 'application/vnd.openxmlformats'
  //   const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
  //   ctx.attachment(`${name}-` + timeStr + '.xlsx'.toString('utf8'))
  //   ctx.body = Buffer.from(templateStr)
  // } catch (err) {
  //   handleSysException(err)
  // }
}

// 获取存储情况
exports.getCapacity = async ctx => {
  const RECORDPATH = '/opt/bstar/video/case' // 录像存储路径
  try {
    // const { exec } = require('child_process')
    await new Promise((resolve, reject) => {
      const { exec } = require('child_process')
      exec(`df ${RECORDPATH} -h`, (error, stdout, stderr) => {
        // exec('dir', (error, stdout, stderr) => {
        if (error) {
          reject(new Error())
        } else if (stderr) {
          reject(new Error())
        } else {
          resolve(stdout)
        }
      })
    }).then(data => {
      // 各变量返回的数据格式
      // data = '文件系统        容量  已用  可用 已用% 挂载点\n/dev/sda3       197G   86G  102G   46% /opt\n'
      // list = [
      //   '文件系统        容量  已用  可用 已用% 挂载点',
      //   '/dev/sda3       197G   86G  102G   46% /opt',
      //   ''
      // ]
      // info = ['/dev/sda3', '197G', '86G', '102G', '46%', '/opt']
      const list = data.split(/\n/)
      const info = list[1].split(/\s+/)
      ctx.body = {
        percentage: (info[4] && info[4]) || '0%', // 已用百分比
        sum: (info[1] && info[1].replace('G', '')) || '0', // 总空间
        surplus: (info[2] && info[2].replace('G', '')) || '0' // 已用空间
      }
    }).catch(() => {
      ctx.throw(500, { code: 2001, message: '获取数据错误' })
    })
  } catch (err) {
    handleSysException(err)
  }
}

const DownloadTaskController = require('./child/taskController') // 下载Controller
const RECORDPATH = '/opt/bstar/video/case' // 录像存储路径

// 显示下载状态
exports.remoteStatus = async ctx => {
  const downloadTask = DownloadTaskController.getSingleton()
  ctx.body = downloadTask.getStatus()
  ctx.status = 200
}

// 远程下载，并将数据写为excel，并放入图片
exports.remoteDownload = async ctx => {
  console.log('==========')
  try {
    const alarmInfo = await AlarmEvent.findOneAndUpdate({ _id: ctx.params.id }, { isSave: 1 })
      .populate({ path: 'resourceList.resource', select: 'name port chan eid', populate: { path: 'eid', select: 'ip cport' } }).lean()
    const downloadTask = DownloadTaskController.getSingleton()
    console.log('查询的数据是=============', alarmInfo)
    alarmInfo.backupType = 1
    await downloadTask.start(alarmInfo, 'alarm', 1) // 参数1仅起到占位符的作用
    // const templatePath = path.resolve(__dirname, './template.xml')
    // const template = fs.readFileSync(templatePath)
    // let templateStr = template.toString()
    // let resourceList = ''
    // let detailList = ``
    // _.get(alarmInfo, 'resourceList', []).map(item => {
    //   _.get(item, 'tagTime', []).map(tag => {
    //     resourceList += `   <tr height="24" style='height:14.40pt;'>
    //     <td class="xl72" height="24" colspan="2" style='height:14.40pt;border-right:none;border-bottom:none;' x:str>
    //      ${_.get(item, 'resource.name', '')}-${moment(_.get(tag, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}-${moment(_.get(tag, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}
    //     </td>
    //     <td colspan="4" style='mso-ignore:colspan;'></td>
    //    </tr>`
    //   })
    // })
    // _.get(alarmInfo, 'detail', []).map(item => {
    //   detailList += `   <tr height="24" style='height:14.40pt;'>
    //   <td class="xl71" height="24" style='height:14.40pt;' x:str="'${moment(_.get(item, 'handleTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}">${moment(_.get(item, 'handleTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}</td>
    //   <td x:str>${item.detail}</td>
    //   <td colspan="4" style='mso-ignore:colspan;'></td>
    //  </tr>`
    // })
    // const name = `${_.get(alarmInfo, 'eventName', '')}-${_.get(alarmInfo, 'person', '')}`
    // const data = new Map([
    //   [/{eventName-person}/, name],
    //   [/{eventName}/, alarmInfo.eventName || ''],
    //   [/{person}/, alarmInfo.person || ''],
    //   [/{gender}/, _.get(alarmInfo, 'gender', 1) === 1 ? '男' : '女'],
    //   [/{age}/, alarmInfo.age || ''],
    //   [/{nationality}/, alarmInfo.nationality || ''],
    //   [/{department}/, alarmInfo.department || ''],
    //   [/{identityNum}/, alarmInfo.identityNum || ''],
    //   [/{address}/, alarmInfo.address || ''],
    //   [/{phone}/, alarmInfo.phone || ''],
    //   [/{incidentAddress}/, alarmInfo.incidentAddress || ''],
    //   [/{mark}/, alarmInfo.mark || ''],
    //   [/{studentNum}/, alarmInfo.studentNum || ''],
    //   [/{isRecode}/, alarmInfo.isRecode === true ? '是' : '否'],
    //   [/{startTime}/, moment(_.get(alarmInfo, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
    //   [/{startTimestr}/, `"'${moment(_.get(alarmInfo, 'startTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
    //   [/{endTime}/, moment(_.get(alarmInfo, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
    //   [/{endTimestr}/, `"'${moment(_.get(alarmInfo, 'endTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
    //   [/{alarmTime}/, moment(_.get(alarmInfo, 'alarmTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')],
    //   [/{alarmTimestr}/, `"'${moment(_.get(alarmInfo, 'alarmTime', 0) * 1000).format('YYYY-MM-DD HH:mm:ss')}"`],
    //   [/{description}/, alarmInfo.description || ''],
    //   [/{resourceList}/, resourceList || ''],
    //   [/{detailList}/, detailList || '']
    // ])
    // data.forEach((value, key) => {
    //   templateStr = templateStr.replace(key, value)
    // })
    // let buffer = Buffer.from(templateStr)
    // let timeStr = moment(Date.now()).format('YYYY-MM-DD')
    // // ${alarmInfo.eventCode}
    // if (!fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}`)) { // 检查该文件目录是否存在
    //   fs.mkdirSync(`${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}`)
    // }
    // let excelName = `${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}/${name}-` + timeStr + '.xlsx'
    // fs.writeFileSync(excelName, buffer)
    // // fs.createWriteStream(excelName, buffer)
    // // fs.writeFileSync(`${config.fileDirs.alarmBackUpDir}/${name}-` + timeStr + '.xlsx', buffer)
    // alarmInfo.images.forEach((item) => {
    //   let fileName = item.path.split('/')[3]
    //   if (fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${fileName}`)) { // 检查该文件是否存在
    //     let readStream = fs.createReadStream(`${config.fileDirs.alarmBackUpDir}/${fileName}`)
    //     let writeStream = fs.createWriteStream(`${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}/${fileName}`)
    //     readStream.pipe(writeStream)
    //   }
    // })
    ctx.status = 201
    // if (fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}`)) { // 检查目录是否存在
    //   zipdir(`${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}`, { saveTo: `${config.fileDirs.alarmBackUpDir}/${alarmInfo.eventCode}.zip` }, (err, buffer) => {
    //     if (err) {
    //       console.log('压缩失败')
    //     } else {
    //       console.log('压缩成功')
    //     }
    //   })
    // }
  } catch (err) {
    handleSysException(err)
  }
}

// 删除下载
exports.removeFile = async ctx => {
  try {
    const downloadTask = DownloadTaskController.getSingleton()
    const alarmInfo = await AlarmEvent.findOneAndUpdate({ _id: ctx.params.id }, { isSave: 0 })
    const videoPath = path.join(RECORDPATH, alarmInfo.eventCode + '')
    downloadTask.deleteDir(videoPath)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 案件管理导出压缩的 execl 和 pdf 文件压缩包
exports.exportExeclAndPdf = async ctx => {
  try {
    let { alarmEventIds = '' } = ctx.query
    alarmEventIds = alarmEventIds === '' ? [] : alarmEventIds.split(',')
    const alarmEvents = await AlarmEvent.find({ _id: { $in: alarmEventIds } })
      .lean()
      .exec()
    if (!alarmEvents.length) {
      ctx.throw(500, { code: 500, message: '没有数据' })
    }
    alarmEvents.map(item => {
      if (!item.isRecode && !item.close) {
        item.state = '初始' // 初始 已创建但未调取录像
      }
      if (item.isRecode && !item.close) {
        item.state = '已调取' // 已调取录像但未关闭案件
      }
      if (item.close) {
        item.state = '已关闭'
      }
      return item
    })
    const fileName = moment(new Date()).format('YYYY-MM-DD HH-mm-ss')
    // 创建需要压缩的文件夹
    const dirPath = `${config.fileDirs.alarmEventExeclAndPdfDir}/${fileName}`
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    // 导出案件管理
    const excelParams = {
      type: 'export',
      rows: alarmEvents,
      columns: alarmEventColumns,
      sheetName: '案件管理信息',
      filePath: `${dirPath}/${fileName}.xlsx`,
      style: {
        row: { height: 20 }
      }
    }
    await childProcessExecl(excelParams)
    const pdfParams = {
      type: 'alarmEvent',
      data: alarmEvents,
      dirPath: dirPath, // 生成压缩包
      filePath: `${dirPath}/${fileName}.pdf`
    }
    const result = await childProcessZip(pdfParams)
    if (result.code === 200) {
      ctx.attachment(result.zipPath)
      await sendKoa(ctx, result.zipPath, { root: '/' })
    } else {
      ctx.status = 500
      ctx.body = '导出失败'
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 案件管理 excel 导出列的信息
const alarmEventColumns = [
  {
    name: '案件编号',
    type: 'String',
    key: 'eventCode',
    size: 15
  },
  {
    name: '案件名称',
    type: 'String',
    key: 'eventName',
    size: 30
  },
  {
    name: '事发地址',
    type: 'String',
    key: 'incidentAddress',
    size: 15
  },
  {
    name: '报案人',
    type: 'String',
    key: 'person',
    size: 15
  },
  {
    name: '性别',
    type: 'Enum',
    default: { 1: '男', 2: '女' },
    key: 'gender',
    size: 15
  },
  {
    name: '年龄',
    type: 'Number',
    key: 'age',
    size: 15
  },
  {
    name: '学号',
    type: 'String',
    key: 'studentNum',
    size: 15
  },
  {
    name: '联系电话',
    type: 'String',
    key: 'phone',
    size: 15
  },
  {
    name: '民族',
    type: 'String',
    key: 'nationality',
    size: 15
  },
  {
    name: '单位/院系',
    type: 'String',
    key: 'department',
    size: 15
  },
  {
    name: '住址',
    type: 'String',
    key: 'address',
    size: 15
  },
  {
    name: '身份证号',
    type: 'String',
    key: 'identityNum',
    size: 15
  },
  {
    name: '状态',
    type: 'String',
    key: 'state',
    size: 15
  },
  {
    name: '案件开始时间',
    type: 'Date',
    key: 'startTime',
    size: 15
  },
  {
    name: '案件结束时间',
    type: 'Date',
    key: 'endTime',
    size: 15
  },
  {
    name: '报警时间',
    type: 'Date',
    key: 'alarmTime',
    size: 15
  },
  {
    name: '创建时间',
    type: 'Date',
    key: 'createTime',
    size: 15
  },
  {
    name: '事件描述',
    type: 'String',
    key: 'description',
    size: 15
  },
  {
    name: '备注',
    type: 'String',
    key: 'mark',
    size: 15
  }
]
