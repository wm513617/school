/*
 * @Description: 定时任务配置表
 * @Author: wanglei
 * @Date: 2019-08-13 14:54:40
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-05 17:46:02
 */
'use strict'
const sched = require('../common/schedule')

module.exports = function () {
  // 车辆统计 每个小时统计一次数据
  const statistic = require('../api/vehicle/statistic/statistics.controller').index
  const verifaceStatistic = require('../api/veriface/statistic/statistics.controller').add
  const todaySocket = require('../api/veriface/statistic/statistics.controller').todaySocket
  const syncDevOnlineList = require('../api/sys/device/device.controller').syncOnlineList
  const updateSDKUserState = require('../api/veriface/user/user.controller').updateSDKUserState
  const syncAttentionStatus = require('../api/face/attention/attention.controller').syncAttentionStatus
  const addHistory = require('../api/business/duty/duty.controller').addHistory
  const { scheduleRecord } = require('../api/patrol/patrol.controller')
  const { clearPatrolTimeOutCount } = require('../api/patrol/patrol.controller')
  // const operationCreateLog = require('../api/sys/operation/log').createLog
  const { deleteFacePicture } = require('../api/veriface/param/param.controller')
  const { cleanTrash, clearDir } = require('../common/system.tool')
  const { staticsPeopleAmount } = require('../api/veriface/identify/veriface.controller')
  const { deleteSdkPicture } = require('../api/veriface/param/param.controller')
  const updateFileConnectTime = require('../api/sys/setting/setting.controller').updateFileConnectTime // 创建分表
  const { deleteDevicesByAlarmClients } = require('../common/system.tool')
  const { deleteExpiredSysLogs } = require('../api/sys/setting/setting.controller')
  const { VehicleCheckFailureData } = require('../api/sys/intelligentTraffic/peopleVehicle/peopleVehicle.controller')
  const updateMotorVehicleState = require('../api/sys/intelligentTraffic/motorVehicle/controller/motorVehicle.controller')
    .schedule
  const clearPassVehicleData = require('../api/sys/intelligentTraffic/motorVehicle/controller/motorVehicle.controller')
    .clearSchedule
  const { pushTodayDataCount } = require('../api/structure/statistic/statistic.service')
  const { syncResOnlineList } = require('../api/structure/server/structureServer.service')
  const { getPhoneStatus } = require('../api/map/call/serverConfig.controller')
  const passage = require('../api/through/passage/passage.controller')
  sched.addSchedule({ rule: '0 0 * * * *', operation: statistic })
  sched.addSchedule({ rule: '30 59 * * * *', operation: verifaceStatistic }) // sdk 每小时59分30秒统计一次
  sched.addSchedule({ rule: '50 0 0 * * *', operation: addHistory }) //  每日0小时0分50秒 创建值班时间记录
  sched.addSchedule({ rule: '30 0 0 * * *', operation: updateSDKUserState }) // sdk 每日0小时0分30秒修改一次布控状态
  sched.addSchedule({ rule: '*/30 * * * * *', operation: syncDevOnlineList }) // 每隔30s同步一次设备状态
  sched.addSchedule({ rule: '0 0 0 * * *', operation: syncAttentionStatus })
  // sched.addSchedule({ rule: '30 0 0 * * *', operation: operationCreateLog }) // sdk 每日0小时0分30秒创建设备昨日日志
  sched.addSchedule({ rule: require('../../config').backend.createFileConnectTime, operation: updateFileConnectTime })
  sched.addSchedule({ rule: '0 35 0 * * *', operation: scheduleRecord })
  sched.addSchedule({ rule: '0 35 0 * * *', operation: clearPatrolTimeOutCount }) // 每天清空超时 一键报警的统计
  sched.addSchedule({ rule: '0 30 0 * * *', operation: clearDir }) // 每天清理临时目录
  sched.addSchedule({ rule: '0 0 1 * * *', operation: cleanTrash }) // 每天凌晨1点清理一次系统冗余数据
  sched.addSchedule({ rule: '0 1 8 * * *', operation: deleteFacePicture }) // 每日8时1分0秒清理一次31天前存储路人图片的文件夹
  sched.addSchedule({ rule: '*/10 * * * * *', operation: todaySocket }) // 每隔10s向界面推送一次人脸统计数据
  sched.addSchedule({ rule: '*/15 * * * * *', operation: staticsPeopleAmount }) // 每隔15+s向界面推送一次人脸统计数据
  sched.addSchedule({ rule: '*/5 * 0-7 * * *', operation: deleteSdkPicture }) // 隔5s删除sdk服务器路人库图片5000张
  sched.addSchedule({ rule: '0 30 0 * * *', operation: deleteDevicesByAlarmClients }) // 清理和报警终端相关的脏数据
  sched.addSchedule({ rule: '0 40 0 * * *', operation: deleteExpiredSysLogs }) // 清除系统参数中操作日志保存天数之外的系统日志
  sched.addSchedule({ rule: '*/15 * * * * *', operation: VehicleCheckFailureData }) // 每隔15s向界面推送一次人车同检核验失败次数
  sched.addSchedule({ rule: '*/15 * * * * *', operation: pushTodayDataCount }) // 每隔 15s 向前端推送一次视频结构化统计的今日数据
  sched.addSchedule({ rule: '*/30 * * * * *', operation: syncResOnlineList }) // 每隔 30s 同步一次视频结构化服务器中视频通道的状态
  sched.addSchedule({ rule: '0 0 2 * * *', operation: updateMotorVehicleState }) // 每天凌晨2点检查机动车是否过期
  sched.addSchedule({ rule: '0 0 3 * * *', operation: clearPassVehicleData }) // 每天凌晨3点检查过车记录是否在默认设置的时间之内
  sched.addSchedule({ rule: '*/2 * * * * *', operation: getPhoneStatus }) // 每隔2s推送一次地图配置110服务器的座机状态
  sched.addSchedule({ rule: '*/25 * * * *', operation: passage.timeRefreshToken }) // 每25分钟刷新一下商汤的token
  sched.addSchedule({ rule: '0 0 4 * * *', operation: passage.setDeleteTask }) // 每天凌晨4点检查一次通行记录，超出时间范围的删除
}
