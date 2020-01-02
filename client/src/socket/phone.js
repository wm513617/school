import { read } from '../storage'
const PHONE_WEBSOCKET_URL = 'ws://124.205.241.254:18081/spcc/cti'

// 报警事件的枚举
const STATUS_TYPES = [
  'OnConnect_cb',
  'OnDisconnect_cb',
  'OnLoginSuccess_cb',
  'OnLoginFail_cb',
  'OnLogOutSuccess_cb',
  'extensionList_cb',
  'OnIncommingRing_cb',
  'OnIncommingAnswer_cb',
  'OnOutboundRinging_cb',
  'OnOutbound_cb',
  'OnHangup_cb',
  'OnBusy_cb',
  'OnFree_cb',
  'OnStatusChanged_cb',
  'OnCallStatus_cb',
  'OnQueueStatusChanged_cb'
]
const EXTEND = [
  'sendWebSocket',
  'login',
  'getExtenList',
  'connectPhone',
  'dial',
  'hangup'
]
const STATUS_EVENTS = STATUS_TYPES.concat(EXTEND)

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
    const dataStr = JSON.stringify(arguments)
    if (this.list[ev]) {
      this.list[ev].forEach(v => {
        new Promise(() => { v(JSON.parse(dataStr)) }).catch(err => { console.log('phone callback error:', err, v) })
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

const phone = new PubSub(STATUS_EVENTS)
/*
 * 连接websocket
 * */
function connectPhone() {
  const websocket = getWebSocket()
  websocket.onmessage = msgEvent => {
    // const data = JSON.parse(msgEvent.data)
    // if (data.type) {
    //   switch (data.type) {
    //     case 'alarmInfo':
    //       // 各种报警类型的接收
    //       phone.emit(data.alarmInfo.eventType, data.alarmInfo)
    //       // 所有报警的推送
    //       phone.emit('all', data)
    //       break
    //     case 'ackInfo':
    //       // 确认报警的推送
    //       phone.emit('confirmAlarm', data.ackInfo)
    //       break
    //   }
    // } else {
    //   console.log('未知websocket消息:', data)
    // }
    const obj = msgEvent.data
    const data = obj.split('\n')
    let object = {}
    data.forEach(function(value) {
      if (value !== '') {
        let objData = value.split(':')
        object[objData[0]] = objData[1]
      }
    })
    var messageType = object.messageType
    if (messageType === 'event') {
      var name = object.name
      if (name === 'call status') {
        phone.emit('OnCallStatus_cb', object.call, object.number)
      }
      if (name === 'outbound ringing') {
        phone.emit('OnOutboundRinging_cb', object.number, object.callid)
      }
      if (name === 'outbound answered') {
        phone.emit('OnOutbound_cb', object.number, object.callid, object.province, object.city, object.isp)
      }
      if (name === 'incomming ringing') {
        phone.emit('OnIncommingRing_cb', object.number, object.callid, object.autodial, object.province, object.city, object.isp, object.data)
      }
      if (name === 'incomming answered') {
        phone.emit('OnIncommingAnswer_cb', object.number, object.callid, object.autodial, object.province, object.city, object.isp, object.data)
      }
      if (name === 'hangup') {
        phone.emit('OnHangup_cb')
        phone.emit('OnFree_cb')
      }
      if (name === 'status changed') {
        phone.emit('OnStatusChanged_cb', object.reg, object.call, object.agent, object.busy, object.number)
      }
      if (name === 'queue status') {
        phone.emit('OnQueueStatusChanged_cb', object.idle, object.agent, object.guest, object.queue)
      }
      if (name === 'busy status') {
        if (object.busy === '') {
          phone.emit('OnFree_cb')
        } else {
          phone.emit('OnBusy_cb', object.busy)
        }
      }
    } else if (messageType === 'heartbeat response') {
    } else if (messageType === 'command response') {
      let command = object.command
      if (command === 'login') {
        if (object.success === 'true') {
          phone.emit('OnLoginSuccess_cb')
          if (object.busy === '') {
            phone.emit('OnFree_cb')
          } else {
            phone.emit('OnBusy_cb', object.busy)
          }
        } else {
          phone.emit('OnLoginFail_cb', object.resultText)
        }
      }
      if (command === 'logout') {
        if (object.success) {
          phone.emit('OnLogOutSuccess_cb')
        }
      }
      if (command === 'getExtensionList') {
        if (object.success) {
          let test = object.resultText
          let index = test.indexOf(',')
          let message = ''
          message += '['
          if (index > 0) {
            let messageList = test.split(',')
            console.log(messageList.length)
            for (let i = 0; i < messageList.length; i++) {
              let tList = messageList[i].split('|')
              if (i === messageList.length - 1) {
                message += '{"exten":"' + tList[0] + '","name":"' + tList[1] + '","loginId":"' + tList[2] + '","sector":"' + tList[3] + '","group":"' + tList[4] + '","state":"' + tList[5] + '","busy":"' + tList[6] + '"}'
              } else {
                message += '{"exten":"' + tList[0] + '","name":"' + tList[1] + '","loginId":"' + tList[2] + '","sector":"' + tList[3] + '","group":"' + tList[4] + '","state":"' + tList[5] + '","busy":"' + tList[6] + '"},'
              }
            }
          } else {
            let testList = test.split('|')
            message += '{"exten":"' + testList[0] + '","name":"' + testList[1] + '","loginId":"' + testList[2] + '","sector":"' + testList[3] + '","group":"' + testList[4] + '","state":"' + testList[5] + '","busy":"' + testList[6] + '"}'
          }
          message += ']'
          phone.emit('extensionList_cb', message)
        }
      }
    }
  }
}
/*
 * 获取websocket
 * */
let websocket = null
function getWebSocket() {
  if (!websocket || websocket.readyState !== 1) {
    return openWebSocket()
  }
  return websocket
}
/*
 * 打开websocket
 * */
function openWebSocket() {
  const params = {
    name: read('user.username')
  }
  websocket = new WebSocket(PHONE_WEBSOCKET_URL)
  websocket.onopen = () => {
    phone.emit('OnConnect_cb')
    websocket.send(JSON.stringify(params))
  }
  websocket.onerror = err => {
    console.log('websocket error:', err)
  }
  return websocket
}
/*
 * 发送websocket请求
 * */
function sendWebSocket(strSend) {
  if (!!websocket && websocket.readyState === 1) {
    return websocket.send(strSend)
  }
}
/*
 * 坐席登录
 * */
function login(data) {
  if (data[6] == null) {
    data[6] = ''
  }
  if (data[7] == null) {
    data[7] = ''
  }
  if (data[8] == null) { data[8] = '' }
  if (data[9] !== '0' && data[9] !== '1' && data[9] !== '2' && data[9] !== '3') {
    data[9] = '0'
  }
  const strSend = 'command:login\nagent:' + data[1] + '\nextension:' + data[2] + '\nqueue:' + data[3] + '\nstaffid:' + data[4] + '\nbusyString:' + data[5] + '\nskill:' + data[6] + '\nsecid:' + data[7] + '\nsecname:' + data[8] + '\nautoacw:' + data[9] + '\n\n'
  sendWebSocket(strSend)
}
/*
 * 获取坐席列表
 * */
function getExtenList(data) {
  if (data[1] == null || data[1] === '') { data[1] = 'all' }
  if (data[2] == null) { data[2] = '' }
  if (data[3] == null) { data[3] = '' }
  const strSend = 'command:getExtensionList\ntype:' + data[1] + '\nsecid:' + data[2] + '\nqueue:' + data[3] + '\n\n'
  sendWebSocket(strSend)
}
/*
 * 外呼电话
 * */
function dial(data) {
  if (data[2] == null) { data[2] = '' }
  if (data[3] == null) { data[3] = '' }
  if (data[4] == null) { data[4] = '' }
  if (data[5] == null) { data[5] = '' }
  const strSend = 'command:dial\ndialString:' + data[1] + '\ncusid:' + data[2] + '\ncusname:' + data[3] + '\nproid:' + data[4] + '\nproname:' + data[5] + '\n\n'
  sendWebSocket(strSend)
}
/*
 * 挂断电话
 * */
function hangup() {
  var strSend = 'command:hangup\n\n'
  sendWebSocket(strSend)
}

phone.on('connectPhone', connectPhone)
phone.on('sendWebSocket', sendWebSocket)
phone.on('login', login)
phone.on('getExtenList', getExtenList)
phone.on('dial', dial)
phone.on('hangup', hangup)

export default phone
