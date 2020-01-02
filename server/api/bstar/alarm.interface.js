/**
 * 北京-发送报警接口
 * @time:2017-8-1
 * @author: hansen
 */

'use strict'
const request = require('./req').req

// 发送报警信息
const alarmNotification = body => {
  try {
    request({
      url: '/api/recvalarm/smart',
      method: 'POST',
      body
    })
  } catch (error) {
    console.log(error)
  }
}
// 发送报警信息
const alarmFace = body => {
  try {
    request({
      url: '/api/alarm/manualalarm',
      method: 'POST',
      body
    }).catch(err => {
      console.log(err.message)
    })
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  alarmNotification,
  alarmFace
}
