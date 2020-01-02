/*
 * 地图点位socket推送
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:32:40
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 14:32:40
 */

'use strict'
// 实时获取点位状态信息

const Resource = require('mongoose').model('Resource')

module.exports = async (io, changeArr) => {
  try {
    io.sockets.emit('server:devStatus', changeArr)
    const reses = await getAllResState()
    const ret = [] // {点位id：设备状态}
    let tmp
    reses.forEach(item => {
      if (item.point) {
        tmp = []
        tmp.push(item.point._id + '')
        tmp.push(item.status)
        ret.push(tmp)
      }
    })
    io.sockets.emit('server:devOnline', ret)
  } catch (err) {
    console.log(err)
  }
}

// 获取所有的资源点位状态
async function getAllResState () {
  return Resource.find({ point: { $nin: [null, undefined] } }, 'point status').exec()
}
