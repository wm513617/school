/**
 * 报警采用pubsub，提供多种报警类型供订阅，使用说明如下
 * *******************************************************
 * 1. 需要收报警的地方，import alarm from '本文件路径'
 * 2. alarm.on(类型, callback) 例：接收除巡更、单兵外的所有报警,可用类型下面给出
 * const receiveAllAlarm = data => console.log('alarm', data)
 * alarm.on('all', receiveAllAlarm)
 * 3.重点，重点，重点，不需要继续收报警时调用
 *    alarm.remove(on的类型, receiveAllAlarm) 移除callback
 * *******************************************************
 * 常用类型：
 * all --- 全部类型的报警不包括巡更、单兵报警
 * confirmAlarm --- 报警确认的消息
 * patrol --- 巡更报警
 * singlePawn --- 单兵报警
 * singlePawnLoc --- 单兵实时位置
 * singlePawnMsg --- 单兵消息采集
 * patrolConfirm --- 巡更报警确认消息
 * patrolStatus --- 巡更状态更新
 * singleStatus --- 巡更app状态更新
 * intercomComplete --- 对讲连接成功
 * singleTimeOut --- 单兵超时报警
 * intercomReceiving --- 接收对讲
 * *******************************************************
 * 类型详见26行ALARM_TYPES、95行EXTEND中定义的类型
 */

import { getWebSocket, getSocket, getNoticeWebSocket } from './socket'

// 报警事件的枚举
const ALARM_TYPES = [
  'alarmInput', // '报警输入'
  'alarmOut', // '报警输出',
  'alarmZone', // '报警防区'
  'alarmGT', // 电子围栏
  'perimeterAlarm', // 周界报警
  'intrusionAlarm', // 入侵报警
  'electricFence', // 电子围栏
  'focusAttention', // '重点关注'
  // 智能类
  'perimeter', // '周界保护',
  'tripwire', // '绊线',
  'leftObject', // '物品遗留',
  'missingObject', // '物品丢失',
  'loitering', // '非法停留',
  'retrogradeDetection', // '逆行检测',
  'lingerDetection', // '徘徊检测',
  'doubleCordon', // '双警戒线',
  'blackList', // '黑名单',
  'whiteList', // '白名单',
  'dispatch', // '布控',
  'areaInvade', // '区域入侵',
  'fastMove', // '快速移动',
  'parkDetect', // '停车检测',
  'humanAssemble', // '人员聚集',
  'objectMove', // '物品搬移',
  // 监控点类
  'alarmMoveSense', // '移动侦测',
  'videoMask', // '视频遮挡',
  'sceneSwitch', // '镜头移位',
  'definitionAbnormal', // '清晰度异常',
  'brightnessAbnormal', // '亮度异常',
  'screenFreeze', // '画面冻结',
  'noise', // '噪声检测',
  'signalLoss', // '信号缺失',
  'colorCast', // '偏色检测',
  // 消防类
  'fireAlarm', // '消防报警',
  'fireFailure', // '消防故障',
  // 违章报警
  'vioRetrograde', // '违章逆行',
  'vioPark', // '违章停车',
  'vioTurnLeft', // '违章左转',
  'vioTurnRight', // '违章右转',
  // 报警求助
  'askHelp', // '请求对讲',
  'acceptHelp', // '接受对讲',
  'endHelp', // '结束对讲',
  // 设备报警
  'hardDiskFailure', // 'sd卡故障',
  'hardDiskFull', // 'sd卡满',
  'networkDown', // '网络断开',
  'ipConflict', // 'IP冲突',
  'timeAbnormal', // '时间异常',
  'illegalNetworkAccess', // '非法网络访问',
  // 其他
  'alarmVideoLost', // '视频丢失',
  'vehicleBlack', // '车辆识别黑名单',
  'vehicleWhite', // '车辆白名单',
  'vehicleDispatch', // '车辆布控',
  'faceBlack', // '人脸识别',
  'faceWhite', // '人脸白名单',
  'faceDispatch', // '人脸布控',
  'peopleCount', // '人数统计',
  'fight', // '斗殴',
  'approach', // '人员贴近',
  'armyGuard', // '哨兵管控',
  'atmCare', // 'ATM看护',
  'fanAbnormal', // '风扇异常',
  'mainBoardAbnormal', // '主板异常',
  'channelAbnormal', // '通道异常',
  'temperatureAbnormal', // '温度异常',
  'damagedDiskSectors', // '硬盘坏道',
  'ipcMacCheckException' // 'MAC校验异常'
]
const EXTEND = [
  'all', // 全部类型的报警不包括巡更、单兵报警
  'confirmAlarm', // 确认报警的消息
  'talkback', // 对讲推送
  'preplan', // 电视墙预案执行
  'patrol', // 巡更报警
  'singlePawn', // 单兵报警
  'singlePawnLoc', // 单兵实时位置
  'singlePawnMsg', // 单兵消息采集
  'patrolConfirm', // 巡更报警确认消息
  'patrolStatus', // 巡更状态更新
  'singleStatus', // 巡更app状态更新
  'intercomComplete', // 对讲连接成功
  'intercomDisconnect', // 对讲连接断开
  'singleTimeOut', // 单兵超时报警
  'intercomReceiving', // 接收对讲
  'structurAlarmData', // 实时结构化当天实时 布控报警数据
  'structureIdentify' // 实时结构化当天 实时抓拍数据
]
const ALARM_EVENTS = ALARM_TYPES.concat(EXTEND)

class PubSub {
  constructor(events) {
    this.list = {}
    events.forEach(v => {
      this.list[v] = []
    })
  }

  on(ev, callback) {
    if (this.list[ev]) {
      this.list[ev].push(callback)
      return true
    } else {
      return false
    }
  }

  emit(ev, data) {
    // 防止其他callback修改data，data拷贝
    const dataStr = JSON.stringify(data)
    if (this.list[ev]) {
      this.list[ev].forEach(v => {
        new Promise(() => { v(JSON.parse(dataStr)) }).catch(err => { console.log('alarm callback error:', err, v) })
      })
      return true
    } else {
      return false
    }
  }

  remove(ev, callback) {
    if (callback && this.list[ev]) {
      this.list[ev].forEach((v, i) => {
        if (v === callback) {
          this.list[ev].splice(i, 1)
        }
      })
      return true
    } else {
      return false
    }
  }
}

const alarm = new PubSub(ALARM_EVENTS)

export function connectAlarm() {
  // 接收报警socket
  const websocket = getWebSocket()
  websocket.onmessage = msgEvent => {
    const data = JSON.parse(msgEvent.data)
    if (data.type) {
      switch (data.type) {
        case 'alarmInfo':
          // 各种报警类型的接收
          alarm.emit(data.alarmInfo.eventType, data.alarmInfo)
          // 所有报警的推送
          alarm.emit('all', data)
          break
        case 'ackInfo':
          // 确认报警的推送
          alarm.emit('confirmAlarm', data.ackInfo)
          break
        case 'noticeInfo':
          // 确认对讲的推送
          alarm.emit('talkback', data)
          break
      }
    } else {
      console.log('未知websocket消息:', data)
    }
  }

  // 确认报警，通知类socket
  const noticeWebsocket = getNoticeWebSocket()
  noticeWebsocket.onmessage = msgEvent => {
    const data = JSON.parse(msgEvent.data)
    if (data.type) {
      switch (data.type) {
        case 'ackInfo':
          // 确认报警的推送
          alarm.emit('confirmAlarm', data.ackInfo)
          break
        case 'noticeInfo':
          // 确认对讲的推送
          alarm.emit('talkback', data)
          break
        case 'preplanNotice':
          // 确认对讲的推送
          alarm.emit('preplan', data)
          break
      }
    } else {
      console.log('未知noticeWebsocket消息:', data)
    }
  }

  const socketIO = getSocket()
  // 巡更app状态更新
  socketIO.on('patrol:sentry.status', data => {
    alarm.emit('singleStatus', data)
  })
  // 巡更状态更新
  socketIO.on('server:patrol.status', data => {
    alarm.emit('patrolStatus', data)
  })
  // 巡更报警
  socketIO.on('server:patrol.alarm', data => {
    alarm.emit('patrol', data)
  })
  // 单兵消息采集
  socketIO.on('server:sentry.message', data => {
    alarm.emit('singlePawnMsg', data)
  })
  // 单兵实时位置
  socketIO.on('server:sentry.location', data => {
    alarm.emit('singlePawnLoc', data)
  })
  // 单兵超时报警
  socketIO.on('server:sentry.timeOut', data => {
    alarm.emit('singleTimeOut', data)
  })
  // 单兵报警
  socketIO.on('server:sentry.alarm', data => {
    alarm.emit('singlePawn', data)
  })
  // 巡更报警确认消息
  socketIO.on('server:patrol.confirm', data => {
    alarm.emit('patrolConfirm', data)
  })
  // 对讲 连接成功
  socketIO.on('server:intercom.complete', data => {
    alarm.emit('intercomComplete', data)
  })
  // 对讲 连接断开
  socketIO.on('server:intercom.disconnect', data => {
    alarm.emit('intercomDisconnect', data)
  })
  // 监听对讲请求
  socketIO.on('server:intercom.request', data => {
    alarm.emit('intercomReceiving', data)
  })
  // 实时结构化当天实时 布控报警数据
  socketIO.on('structDefenseAlarm:alarm', data => {
    alarm.emit('structurAlarmData', data)
  })
  // 实时结构化当天 实时抓拍数据
  socketIO.on('videoStructure:identify', data => {
    alarm.emit('structureIdentify', data)
  })
}

export function disconnectAlarm() {
  const websocket = getWebSocket()
  websocket.close()
  const noticeWebsocket = getNoticeWebSocket()
  noticeWebsocket.close()
  const socketIO = getSocket()
  socketIO.close()
}

export default alarm
