'use strict'

const router = require('koa-router')()
const controller = require('./ctrl.controller')

router.get('/devinfo', controller.getDeviceInfoByRtsp) // 根据rtsp流地址获取设备信息（人脸or车辆直接使用打开后的流）

module.exports = router
