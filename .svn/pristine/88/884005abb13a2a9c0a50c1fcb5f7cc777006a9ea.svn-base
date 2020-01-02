'use strict'
/**
 * 参数设置
 */
var Sysparamters = require('mongoose').model('Sysparamters')
var Resource = require('mongoose').model('Resource')
var ServerSetting = require('mongoose').model('ServerSetting')
var paging = require('../../paging')
var _ = require('lodash')
var postal = require('postal')
const { handleSysException } = require('../../../common/tools')
const nodemailer = require('nodemailer')
/**
 * 获取参数信息
 */
exports.sysparamters = async (ctx, next) => {
  try {
    const results = await Sysparamters.findOne({}).exec()
    ctx.body = results
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 系统参数新增
 */

exports.sysparamtersAdd = async (ctx, next) => {
  const newVehicleDefense = {
    // name: '平台1',
    // logo: 'LOGO地址',
    // titlecolor: '标题地址 ',
    // titlefont: '标题栏字体',
    // loginimg: '登陆页面图片',
    // alarmlog: 10,
    // equipmentlog: 20,
    // operationlog: 15,
    // configlog: 13, // 配置日志天数
    // transport: 'TCP',
    // picture: 'auto',
    // screenshot: 'png', // 截图保存格式
    // videotape: 'avi' // 本地录像格式
  }

  try {
    const vehicleDefense = await Sysparamters.create(newVehicleDefense)
    ctx.status = 201
    ctx.body = vehicleDefense
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 系统参数修改
 */
exports.sysparamtersUpdate = async (ctx, next) => {
  try {
    await Sysparamters.findOneAndUpdate({}, ctx.request.body, { upsert: true }).exec()
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 获取服务器信息列表
 */
exports.serverIndex = async (ctx, next) => {
  const search = ctx.query.search
  try {
    const results = await paging.listQuery(ServerSetting, search, '', { _id: -1 }, ctx.query.page, '', ctx)
    if (_.isEmpty(results)) {
      ctx.status = 404
      return
    }
    ctx.body = results.results
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 获取登录页logo和登陆图片
 */
exports.getLoginImgs = async (ctx, next) => {
  try {
    ctx.body = await Sysparamters.findOne({}, 'logo loginimg name').exec()
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 智能服务器新增
 */
exports.serverAdd = async (ctx, next) => {
  const addObj = ctx.request.body
  try {
    const result = await ServerSetting.create(addObj)
    // 发布服务器更新消息
    postal.publish({ channel: 'server', topic: 'item.message', data: {} })
    ctx.status = 201
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 智能服务器修改
 */
exports.serverUpdate = async (ctx, next) => {
  const id = ctx.params.id
  const updateObj = ctx.request.body
  try {
    const result = await ServerSetting.findByIdAndUpdate(id, updateObj)
    // 发布服务器更新消息
    postal.publish({ channel: 'server', topic: 'item.message', data: {} })
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 服务器删除
 */

exports.serverDelete = async (ctx, next) => {
  const id = ctx.params.id
  try {
    const checkResult = await Resource.countDocuments({ server: id }).exec()
    if (checkResult) {
      return ctx.throw(500, { code: 4201, message: '该服务器正被使用,无法删除!' })
    } else {
      ctx.body = await ServerSetting.findByIdAndRemove(id)
      // 发布服务器更新消息
      postal.publish({ channel: 'server', topic: 'item.message', data: {} })
    }
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 服务器批量删除
 */
exports.serverBatchDelete = async (ctx, next) => {
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  try {
    const checkResult = await Resource.countDocuments({ server: { $in: ids } }).exec()
    if (checkResult) {
      return ctx.throw(500, { code: 4201, message: '存在正被使用的服务器,无法删除!' })
    } else {
      ctx.body = await ServerSetting.deleteMany({ _id: { $in: ids } })
      // 发布服务器更新消息
      postal.publish({ channel: 'server', topic: 'item.message', data: {} })
    }
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}
/**
 * 修改文件表全局时间间隔
 */
exports.updateFileConnectTime = async (ctx, next) => {
  try {
    const time = Math.floor(new Date().getTime() / 1000)
    global.createFileConnectTime = time
    await Sysparamters.update({ creatdbtime: time })
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

// 获取地图类型，2D或者3D
exports.getMapType = async ctx => {
  try {
    let sysparamter = await Sysparamters.findOne({}, 'mapType').exec()
    if (!sysparamter.mapType.enable || !sysparamter.mapType.default) {
      sysparamter.mapType = { enable: ['2D', '3D'], default: '2D' }
    }
    ctx.body = sysparamter
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

exports.updateMapType = async ctx => {
  try {
    let mapType = ctx.request.body.mapType
    const id = ctx.request.body._id
    // 参数检查
    if (!mapType || !id) {
      ctx.throw(500, { code: 4001, message: '请求参数不合法' })
    }
    const mapEnum = {
      MapArr: ['2D', '3D'],
      Map2D: '2D',
      Map3D: '3D'
    }
    for (let item of mapType.enable) {
      if (!mapEnum.MapArr.includes(item)) {
        ctx.throw(500, { code: 4001, message: '地图启用参数不合法' })
      }
    }
    // 地图默认设置只接受 2D 和 3D 这两个值
    const defaultSet = _.isEqual(mapType.default, mapEnum.Map2D) || _.isEqual(mapType.default, mapEnum.Map3D)
    if (!defaultSet) {
      ctx.throw(500, { code: 4001, message: '地图默认设置参数不合法' })
    }
    // 只启用 2D 时，默认只能设置 2D
    // 只启用 3D 时，默认只能设置 3D
    if (_.isEqual(mapType.enable, [mapEnum.Map2D])) {
      mapType.default = mapEnum.Map2D
    } else if (_.isEqual(mapType.enable, [mapEnum.Map3D])) {
      mapType.default = mapEnum.Map3D
    }
    await Sysparamters.findByIdAndUpdate(id, { mapType: mapType }).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 邮件服务器测试
 */
exports.serverAuth = async ctx => {
  try {
    const data = await Sysparamters.findOne({}, 'sendName email smtpServer smtpPort ssl serverAuth userName password').exec()
    const transportOption = {
      host: data.smtpServer,
      port: data.smtpPort,
      secure: false, // use TLS
      auth: {
        user: data.userName, // generated ethereal user
        pass: data.password // generated ethereal password
      },
      ignoreTLS: true
    }
    let transporter = nodemailer.createTransport(transportOption)
    let mailOptions = {
      from: data.email, // sender address
      to: data.email, // list of receivers
      subject: 'bstar email test', // Subject line
      text: 'bstar email test' // plain text body
    }
    // send mail with defined transport object
    await transporter.sendMail(mailOptions)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
const moment = require('moment')
const LogDetail = mongoose.model('LogDetail')
/**
 * 根据系统参数中操作日志保存天数删除日志
 */
exports.deleteExpiredSysLogs = async () => {
  try {
    const sysParameter = await Sysparamters.findOne()
      .lean()
      .exec()
    const days = sysParameter.operationlog // 日志保存天数
    const date = moment()
      .subtract(days, 'days')
      .format('YYYY-MM-DD')
    const milliTime = moment(date).format('X') // days天前的秒数时间戳
    await LogDetail.deleteMany({ time: { $lte: milliTime } })
  } catch (err) {
    console.log(err)
  }
}
