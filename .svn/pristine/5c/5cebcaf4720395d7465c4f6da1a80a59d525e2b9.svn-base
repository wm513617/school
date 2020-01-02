/*
 * @Description:
 * @Author: MeiChen
 * @Date: 2019-08-20 15:13:04
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-22 15:45:44
 */
const passageModel = require('./passage.model')
const guardModel = require('../zkteco/guard.model')
const usersModel = require('../users/users.model')
const doorModule = require('../zkteco/door.model')
const readModule = require('../zkteco/read.model')
const configModel = require('../serviceConfig/serviceConfig.model')
const senseTimeFace = require('../senseTime/senseTime.model')
const peopleCard = require('./peopleCard.model')
const peopleCardDevice = require('../zkteco/peopleId.model')
const { passageUser } = require('./socketio')
const Org = mongoose.model('Org')
const resource = mongoose.model('Resource')
const rp = require('request-promise')
const moment = require('moment')
const senseToken = require('../senseTime/refreshToken.js')
const config = require('../../../../config').backend
const fs = require('fs')
// const outPut = fs.createWriteStream('./senseguard-out.log')
// const errorOutput = fs.createWriteStream('./senseguard-err.log')
// const logger = new console.Console(outPut, errorOutput)
let time = new Date().getTime() // 生成一个时间戳
async function getServerConfig (type) { // 获取服务配置对应数据
  /*
  * 参数type number类型 1 对应门禁服务器 2 对应人脸服务器
  * */
  return configModel.findOne({type: type}).lean(true)
}
async function getPassageEvent () { // 获取中控产生的刷卡通行记录，写入数据库，并给客户端推送
  let serverConfig = await getServerConfig(1)
  async function getData () { // 获取中控的通行记录
    let options = {
      method: 'GET',
      url: `http://${serverConfig.ip}:${serverConfig.port}/api/transaction/monitor?timestamp=${time}&access_token=${serverConfig.token}`
    }
    let data = JSON.parse(await rp(options))
    data.data.forEach((item) => {
      item.date = moment(item.eventTime).format('YYYY-MM-DD')
    })
    return data.data
  }
  let guardEvent = []
  if (serverConfig !== null) {
    guardEvent = await getData() // 从第三方获取实时门禁事件数据
  }
  let creatList = []
  let guardSn = []
  let userPin = []
  guardEvent.forEach((item) => {
    guardSn.push(item.devSn)
    userPin.push(item.pin)
  })
  if (guardSn.length && userPin.length) { // 如果没有通行记录则不执行后面的方法
    let guardData = await guardModel.find({'sn': {$in: guardSn}}).populate('orgId').lean(true) // 获取门禁设备数据
    let userData = await usersModel.find({'uid': {$in: userPin}}).populate('org').lean(true) // 获取用户数据
    let doorArr = []
    guardEvent.forEach((item) => {
      let data = {
        uid: item.pin,
        eventTime: item.eventTime,
        date: item.date,
        createdTimeMs: new Date(item.eventTime).getTime(),
        card: item.cardNo,
        description: item.eventName,
        validator: item.verifyModeName,
        readerName: item.readerName,
        read: [],
        camera: []
      }
      userData.forEach((user) => {
        if (item.pin === user.uid) {
          data.name = user.name
          data.type = user.type
          data.org = user.org._id
          data.url = user.image || ''
          data.orgName = user.org.name
          data.phone = user.phone || ''
          data.sex = user.sex
        }
      })
      guardData.forEach(async (guard) => {
        if (item.devSn === guard.sn) {
          data.guardId = guard._id
          doorArr.push({guardData: guard._id, name: item.eventPointName})
        }
      })
      creatList.push(data)
    })
    try {
      let doorData = await doorModule.find({$or: doorArr}).lean(true)
      let doorIdArr = doorData.map((item) => {
        return item._id
      })
      let readData = await readModule.find({door_Id: {$in: doorIdArr}}).lean(true)
      doorData.forEach((door) => {
        creatList.forEach((item) => {
          if (door.guardData.toString() === item.guardId.toString()) {
            item.address = door._id
            item.addressName = door.name
          }
        })
      })
      readData.forEach((read) => {
        creatList.forEach((item) => {
          if (read.door_Id.toString() === item.address.toString() && read.name === item.readerName) {
            item.read.push(read._id)
            item.camera = read.cameraData
            item.readerState = read.readerState
          }
        })
      })
      // console.log('creatList', creatList)
      if (creatList.length) {
        await passageModel.create(creatList)
        passageUser(creatList)
      }
    } catch (err) {
      console.log(err)
    }
  }
}
async function getPeopleCard () { // 获取中控刷身份证的通行记录
  let serverConfig = await getServerConfig(1)
  async function getData () { // 获取中控的通行记录
    let options = {
      method: 'GET',
      url: `http://${serverConfig.ip}:${serverConfig.port}/api/device/pidMonitor?timestamp=${time}&access_token=${serverConfig.token}`
    }
    if (serverConfig !== null) {
      return JSON.parse(await rp(options))
    } else {
      return {}
    }
  }
  let data = await getData()
  if (data.data) {
    let deviceData = await peopleCardDevice.find({}).lean(true)
    data.data.forEach((item) => {
      let fileName = new Date().getTime()
      let photoBuffer = Buffer.from(item.photo, 'base64')
      let liveBuffer = Buffer.from(item.livePhoto, 'base64')
      fs.writeFileSync(`${config.fileDirs.peoplePassage}/${fileName}_photo.jpg`, photoBuffer)
      fs.writeFileSync(`${config.fileDirs.peoplePassage}/${fileName}_live.jpg`, liveBuffer)
      item.photoUrl = `/image/peoplePassage/${fileName}_photo.jpg`
      item.livePhotoUrl = `/image/peoplePassage/${fileName}_live.jpg`
      item.createdTimeMs = fileName // 文件名实际就为时间戳
      delete item.photo
      delete item.livePhoto
      deviceData.forEach((device) => {
        if (item.id === device.id) {
          if (device.cameraData.length) {
            item.cameraData = device.cameraData
          }
          if (device.readerState) {
            item.readerState = device.readerState
          }
        }
      })
    })
    await peopleCard.create(data.data)
  }
}
setInterval(() => {
  getPassageEvent()
  getPeopleCard()
}, 2000)
async function createdParameter (ctx) { // 格式化查询条件参数
  let findDbData = {
    createdTimeMs: {
      $gte: ctx.request.body.startTime,
      $lte: ctx.request.body.endTime
    },
    validator: {
      $in: ctx.request.body.validator
    }
  }
  let orgStatus = true
  ctx.request.body.validator.forEach((item) => {
    if (item === '陌生人' || item === '非活体攻击' || item === '密码攻击') {
      orgStatus = false
    }
  })
  if (orgStatus) {
    findDbData.type = {
      $in: ctx.request.body.type
    }
    let orgIdArr = [ctx.request.body.org] // 机构ID数组
    async function getOrgList (orgId) { // 递归获取所有机构的机构ID
      try {
        let getOrgData = await Org.aggregate([{ $match: { pid: mongoose.Types.ObjectId(orgId) } }])
        if (getOrgData.length) {
          for (let i = 0; i < getOrgData.length; i++) {
            orgIdArr.push(getOrgData[i]._id)
            await getOrgList(getOrgData[i]._id)
          }
        }
      } catch (err) {
        console.log('err', err)
        ctx.throw(500, { code: 500, message: '递归格式化机构出错' })
      }
    }
    if (ctx.request.body.org !== 'all') { // 如果不是全部组织
      await getOrgList(ctx.request.body.org)
      findDbData.org = {
        $in: orgIdArr
      }
    }
  }
  if (ctx.request.body.address.type === 'door') {
    findDbData.address = { // 门/通道id
      $in: ctx.request.body.address.arr
    }
  } else if (ctx.request.body.address.type === 'face') {
    findDbData.faceAddress = { // 人脸识别机
      $in: ctx.request.body.address.arr
    }
  }
  if (ctx.request.body.description || ctx.request.body.name || ctx.request.body.uid) { // 如果有事件描述描或姓名或人员编号，则需要做模糊匹配
    let keyArr = []
    if (ctx.request.body.description) {
      let keyStr = new RegExp(ctx.request.body.description.trim(), 'i') // 不区分大小写
      keyArr.push({'description': {$regex: keyStr}})
    }
    if (ctx.request.body.name) {
      let keyStr = new RegExp(ctx.request.body.name.trim(), 'i') // 不区分大小写
      keyArr.push({'name': {$regex: keyStr}})
    }
    if (ctx.request.body.uid) {
      let keyStr = new RegExp(ctx.request.body.uid.trim(), 'i') // 不区分大小写
      keyArr.push({'uid': {$regex: keyStr}})
    }
    findDbData.$or = keyArr
  }
  return findDbData
}
async function cardCreateParameter (ctx) { // 人证核验机查询条件格式化
  let findDbData = {
    createdTimeMs: {
      $gte: parseInt(ctx.query.startTime),
      $lt: parseInt(ctx.query.endTime)
    }
  }
  if (ctx.query.devName) {
    let keyStr = new RegExp(ctx.query.devName.trim(), 'i') // 不区分大小写
    findDbData.devName = {$regex: keyStr}
  }
  if (ctx.query.name) {
    let keyStr = new RegExp(ctx.query.name.trim(), 'i') // 不区分大小写
    findDbData.name = {$regex: keyStr}
  }
  if (ctx.query.code) {
    let keyStr = new RegExp(ctx.query.code.trim(), 'i') // 不区分大小写
    findDbData.code = {$regex: keyStr}
  }
  // if (ctx.query.devName || ctx.query.name || ctx.query.code) {
  //   let keyArr = []
  //   if (ctx.query.devName) {
  //     let keyStr = new RegExp(ctx.query.devName.trim(), 'i') // 不区分大小写
  //     keyArr.push({'devName': {$regex: keyStr}})
  //   }
  //   if (ctx.query.name) {
  //     let keyStr = new RegExp(ctx.query.name.trim(), 'i') // 不区分大小写
  //     keyArr.push({'name': {$regex: keyStr}})
  //   }
  //   if (ctx.query.code) {
  //     let keyStr = new RegExp(ctx.query.code.trim(), 'i') // 不区分大小写
  //     keyArr.push({'code': {$regex: keyStr}})
  //   }
  //   findDbData.$or = keyArr
  // }
  return findDbData
}
module.exports = {
  async timeRefreshToken () { // 定时任务调用刷新token的方法
    await senseToken.refreshToken()
  },
  async refreshToken (ctx, next) { // 前端调用刷新token并返回base64加密token
    try {
      await senseToken.refreshToken()
      // currentToken = await senseToken.getToken()
      ctx.body = {
        code: 200,
        token: global.senseTimeToken.base64
      }
    } catch (err) {
      ctx.throw(500, { code: 500, message: '刷新失败' })
    }
  },
  async currentNewList (ctx, next) { // 获取当前最新的通行X条记录数据
    let size = ctx.request.body.size || 16
    try {
      let white = await passageModel.find({type: 2}).limit(size).sort({'_id': -1}).populate('org').populate('address').populate('faceAddress').lean(true) // 白名单通行记录
      let black = await passageModel.find({type: 0}).limit(size).sort({'_id': -1}).populate('org').populate('address').populate('faceAddress').lean(true) // 黑名单通行记录
      let gray = await passageModel.find({type: 1}).limit(size).sort({'_id': -1}).populate('org').populate('address').populate('faceAddress').lean(true) // 灰名单通行记录
      let date = new Date()
      let year = date.getFullYear() // 年
      let month = (date.getMonth()) + 1 // 月
      let data = date.getDate() // 日
      let currentDay = new Date(`${year}-${month}-${data}`).getTime() // 当天0点的时间戳
      let currentTime = date.getTime() // 当前时间的时间戳
      let count = await passageModel.countDocuments({
        type: {
          $in: [0, 1]
        },
        createdTimeMs: {
          $gte: currentDay,
          $lte: currentTime
        }
      })
      white.forEach((item) => {
        if (item.currentUrl) {
          item.currentUrl = `${item.currentUrl}/${global.senseTimeToken.base64}`
          item.addressName = item.faceAddress.deviceName
        } else {
          item.addressName = item.address ? item.address.name : ''
          item.currentUrl = `${item.url}`
        }
      })
      black.forEach((item) => {
        if (item.currentUrl) {
          item.currentUrl = `${item.currentUrl}/${global.senseTimeToken.base64}`
          item.addressName = item.faceAddress.deviceName
        } else {
          item.addressName = item.address ? item.address.name : ''
          item.currentUrl = `${item.url}`
        }
      })
      gray.forEach((item) => {
        if (item.currentUrl) {
          item.currentUrl = `${item.currentUrl}/${global.senseTimeToken.base64}`
          item.addressName = item.faceAddress.deviceName
        } else {
          item.addressName = item.address ? item.address.name : ''
          item.currentUrl = `${item.url}`
        }
      })
      ctx.body = {
        code: 200,
        waring: count,
        message: 'success',
        white: white,
        black: black,
        gray: gray
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取失败' })
    }
  },
  async getPassgeList (ctx, next) { // 获取通行历史记录
    let pageSize = parseInt(ctx.request.body.pageSize)
    let pageNum = parseInt(ctx.request.body.pageNum)
    let findDbData = await createdParameter(ctx)
    try {
      let count = await passageModel.countDocuments(findDbData)
      let list = await passageModel.find(findDbData, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}).populate('org').populate('address').populate('faceAddress').sort({'_id': -1}).lean(true)
      let uidArr = list.map((item) => {
        if (item.currentUrl && item.faceAddress) {
          item.currentUrl = `${item.currentUrl}/${global.senseTimeToken.base64}`
          item.addressName = item.faceAddress.deviceName
        } else {
          item.addressName = item.address ? item.address.name : ''
          item.currentUrl = item.url
        }
        return item.uid
      })
      let userData = await usersModel.find({uid: {$in: uidArr}}).lean(true)
      userData.forEach((user) => {
        list.forEach((item) => {
          if (user.uid === item.uid) {
            item.sex = user.sex
          }
        })
      })
      ctx.body = {
        code: 200,
        count: Math.ceil(count / pageSize),
        length: count,
        list: list,
        start: new Date(ctx.request.body.startTime),
        end: new Date(ctx.request.body.endTime),
        message: 'success'
      }
    } catch (err) {
      console.log('err=======', err)
      ctx.throw(500, { code: 500, message: '获取通行记录失败' })
    }
  },
  async exportPassage (ctx, next) { // 导出对应通行记录
    let findDbData = await createdParameter(ctx)
    try {
      let length = await passageModel.countDocuments(findDbData)
      if (length > 30000) { // 最多导出3万条通行数据
        ctx.body = {
          code: 500,
          message: '最多导出三万条数据，请重新筛选'
        }
      } else {
        let list = await passageModel.find(findDbData).populate('org').populate('address').populate('faceAddress').lean(true)
        list.forEach((item) => {
          if (item.currentUrl) {
            item.currentUrl = `${item.currentUrl}/${global.senseTimeToken.base64}`
            item.addressName = item.faceAddress.deviceName
          } else {
            item.addressName = item.address ? item.address.name : ''
          }
        })
        ctx.body = {
          code: 200,
          list: list,
          start: new Date(ctx.request.body.startTime),
          end: new Date(ctx.request.body.endTime),
          message: 'success'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取通行记录失败' })
    }
  },
  async setDeleteTask () { // 设置定时任务，每天0点检查通行记录，删除大于保存天数的数据
    let config = await configModel.find({type: 3}).lean(true)
    let lang = parseInt(config[0].timeLang) * 24 * 60 * 60 * 1000 // 通行记录保存多少天毫秒值
    let date = new Date()
    let year = date.getFullYear() // 年
    let month = (date.getMonth()) + 1 // 月
    let data = date.getDate() // 日
    let currentDay = new Date(`${year}-${month}-${data}`).getTime()
    let timeMs = (parseInt(currentDay)) - lang
    try {
      await passageModel.remove({createdTimeMs: {$lt: timeMs}}) // 若大于了保存的天数，则需要删除刷脸或刷卡的通行记录
      await peopleCard.remove({createdTimeMs: {$lt: timeMs}}) // 若大于了保存的天数，则需要删除刷身份证的通行记录
    } catch (err) {
      console.log('删除失败', err)
    }
  },
  async findVieoMessage (ctx, next) { // 根据相机ID查询对应的视频信息
    try {
      let list = await resource.find({'_id': {$in: ctx.request.body.camera}})
      ctx.body = {
        code: 200,
        data: list,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '查询视频信息失败' })
    }
  },
  async senseguardPassage (ctx, next) { // 商汤调用推送通行数据
    ctx.body = {
      code: 200
    }
    try {
      let data = ctx.request.body
      // global.senseTimeResult++
      // console.log('========统计的次数是', global.senseTimeResult)
      let uid = ''
      let passageData = {}
      if (data.targetInfo) { // 如果没有人员编号的字段，就认为是陌生人
        uid = data.targetInfo.target.identity
        if (uid) { // 如果有对应的人员编号
          let userData = await usersModel.find({'uid': uid}).lean(true)
          if (userData.length) { // 如果有找到用户
            passageData.name = userData[0].name
            passageData.url = userData[0].url || ''
            passageData.type = userData[0].type
            passageData.org = userData[0].org
            passageData.card = userData[0].card || ''
            passageData.uid = uid,
            passageData.sex = userData[0].sex || ''
          } else {
            passageData.name = data.targetInfo.target.name
          }
        } else {
          passageData.name = data.targetInfo.target.name
        }
      } else {
        passageData.name = ''
      }
      let serverConfig = await getServerConfig(2)
      let device = await senseTimeFace.findOne({'deviceId': data.taskInfo.task.deviceId}).lean(true)
      if (device) {
        passageData.camera = device.cameraData
        passageData.readerState = device.deviceState
        passageData.faceAddress = device._id
        passageData.addressName = device.deviceName
      }
      passageData.date = moment(data.detectInfo.captureDate).format('YYYY-MM-DD')
      passageData.eventTime = data.detectInfo.captureDate
      passageData.createdTimeMs = data.detectInfo.capturedTime
      passageData.currentUrl = `http://${serverConfig.ip}:${serverConfig.port}/${ctx.request.body.detectInfo.faceInfo.portraitImageInfo.url}`
      // console.log('========URL是', ctx.request.body.detectInfo.faceInfo.portraitImageInfo.url)
      if (data.comparedType === 0) {
        passageData.validator = '白名单比中'
      } else if (data.comparedType === 1) {
        passageData.validator = '陌生人'
      } else if (data.comparedType === 2) {
        passageData.validator = '非活体攻击'
      } else if (data.comparedType === 3) {
        passageData.validator = '密码攻击'
      } else if (data.comparedType === 4) {
        passageData.validator = '白名单异常-人像有效期无效'
      } else if (data.comparedType === 6) {
        passageData.validator = '白名单异常-不在有效时间范围'
      } else if (data.comparedType === 8) {
        passageData.validator = '白名单异常-无设备权限'
      } else if (data.comparedType === 9) {
        passageData.validator = '黑名单警告'
      }
      console.log('======人脸数据是', passageData)
      await passageModel.create([passageData])
      passageData.currentUrl = `${passageData.currentUrl}/${global.senseTimeToken.base64}`
      passageUser([passageData])
      // logger.log(JSON.stringify(data))
    } catch (err) {
      // console.log('err==========商汤的错误日志是', err)
      // logger.error('错误日志是', err, '数据是', JSON.stringify(ctx.request.body))
      ctx.throw(500, { code: 500, message: '失败' })
    }
  },
  async getAllDevice (ctx, next) { // 获取所有读头和人脸识别机
    try {
      let door = await doorModule.find({}).lean(true)
      let face = await senseTimeFace.find({}).lean(true)
      let arr = []
      door.forEach((item) => {
        arr.push({
          _id: item._id,
          name: item.name,
          type: 'door'
        })
      })
      face.forEach((item) => {
        arr.push({
          _id: item._id,
          name: item.deviceName,
          type: 'face'
        })
      })
      ctx.body = {
        code: 200,
        arr: arr,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '失败' })
    }
  },
  async getPeopleCard (ctx, next) { // 获取人证核验机的通行记录
    try {
      let findDbData = await cardCreateParameter(ctx)
      console.log('========', findDbData)
      let pageSize = parseInt(ctx.query.pageSize)
      let pageNum = parseInt(ctx.query.pageNum)
      let count = await peopleCard.countDocuments(findDbData)
      let list = await peopleCard.find(findDbData, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}).sort({'_id': -1}).lean(true)
      ctx.body = {
        code: 200,
        count: Math.ceil(count / pageSize),
        length: count,
        list: list,
        start: new Date(ctx.query.startTime),
        end: new Date(ctx.query.endTime),
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取通行记录失败' })
    }
  },
  async exportPeopleCard (ctx, body) { // 获取导出人证核验机通行记录数据
    try {
      let findDbData = await cardCreateParameter(ctx)
      let count = await peopleCard.countDocuments(findDbData)
      if (count > 30000) {
        ctx.body = {
          code: 500,
          message: '最多导出三万条数据，请重新筛选'
        }
      } else {
        let list = await peopleCard.find(findDbData).lean(true)
        ctx.body = {
          code: 200,
          list: list,
          start: new Date(ctx.query.startTime),
          end: new Date(ctx.query.endTime),
          message: 'success'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取通行记录失败' })
    }
  }
}
