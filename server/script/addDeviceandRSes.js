'use strict'
const mongoose = require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/bs-security')
mongoose.connect('mongodb://127.0.0.1:27017/reda')
var Schema = mongoose.Schema
require('./resource.model.js')
require('./device.model.js')
require('./orgRes.model.js')

mongoose.model('Orgs', new Schema())
const OrgRes = mongoose.model('OrgRes')
const Orgs = mongoose.model('Orgs')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
const tool = require('../common/tools')
// 1.1.81.16  reda
let obj = {
  one: 1,
  two: 1,
  three: 81,
  four: 16
}
let objArr = ['four', 'three', 'two', 'one']
const kk = async (maximum = 10) => {
  let dev = {
    cport: 22,
    dport: 22,
    manufacturer: 'bstar',
    model: 'unknown',
    name: '7.155_视频通道_通道1',
    nodeId: '34020000001328298069',
    shareServer: '5c1336ba05dcf77b867c32a3',
    shareType: 'ipc',
    bigtype: 0.0,
    status: false,
    deviceStatus: 1
  }
  // let dev = await Device.findOne({ bigtype: 0 }).lean().exec()
  let orgList = await Orgs.find({ type: 0 })
  // delete dev._id
  // delete dev._v
  // delete dev.createdAt
  // delete dev.updatedAt
  let sum = 0
  // const rootorg = await Orgs.find({ type: 0, isroot: true }).exec()
  // console.log(rootorg, '------------')
  while (sum <= maximum) {
    for (let index = 0; index < objArr.length; index++) {
      let iterator = objArr[index]
      if (obj[iterator] < 255) {
        obj[iterator] = obj[iterator] + 1
        break
      } else {
        if (index >= objArr.length - 1) {
          console.log('没有可以用的 ip 了-----')
          return
        }
        obj[objArr[index + 1]] = obj[objArr[index + 1]] + 1
        obj[iterator] = 0
        continue
      }
    }
    let index = Math.round(Math.random() * (orgList.length - 1))
    dev.oid = orgList[index]._id
    dev.ip = `${obj.one}.${obj.two}.${obj.three}.${obj.four}`
    let createObj = await Device.insertMany([dev])
    // 每个设备添加5个资源
    const name = createObj[0].name
    for (var i = 0; i < 5; i++) {
      let videos = []
      videos.push({
        eid: createObj[0]._id,
        chan: i,
        type: 0,
        ip: createObj[0].ip,
        port: createObj[0].cport,
        rtsp: {
          main: 'rtsp://ip:port/main/id=1',
          sub: 'rtsp://ip:port/sub/id=2'
        },
        name: `${name}_视频通道_通道${i}`,
        pinyin: tool.transferPinyin(`${name}_视频通道_通道${i}`)
      })
      let resourceObj = await Resource.insertMany(videos)
      // 给资源分配机构
      let patchRes = {}
      patchRes['org'] = orgList[index]._id
      patchRes['resource'] = resourceObj[0]._id
      patchRes['rootorg'] = '5b7bb55f62692e1bb668d6a6'
      patchRes['islane'] = false
      patchRes['type'] = 0
      await OrgRes.insertMany(patchRes)
    }
    if (createObj.length !== 0) {
      console.log(createObj[0].ip + ':' + createObj[0].cport, '创建成功返回')
    } else {
      console.log('创建失败：' + createObj)
      return
    }
    sum++
  }
  console.log('本次执行创建个数：' + sum)
  console.log('--------------')
  console.log('本次执行ip到达：' + `${obj.one}.${obj.two}.${obj.three}.${obj.four}`)
}
kk(2000)
