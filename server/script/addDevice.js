'use strict'
const mongoose = require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/bs-security')
mongoose.connect('mongodb://127.0.0.1:27017/reda')
var Schema = mongoose.Schema
// mongoose.model('Resource', new Schema())
require('./resource.model.js')
require('./device.model.js')
mongoose.model('OrgRes', new Schema())
mongoose.model('Orgs', new Schema())
// mongoose.model('Device', new Schema())
// const Resource = mongoose.model('Resource')
// const orgRes = mongoose.model('OrgRes')
const orgs = mongoose.model('Orgs')
const Device = mongoose.model('Device')
// 1.1.81.16  reda
let obj = {
  one: 1,
  two: 1,
  three: 81,
  four: 16
}
let objArr = ['four', 'three', 'two', 'one']
const kk = async (maximum = 10) => {
  // let dev = await Device.findOne({ bigtype: 0 }).lean().exec()
  let dev = {
    bigtype: 2,
    type: 'doorAccess',
    manufacturer: 'smed',
    protocol: 'rtsp',
    ipcount: 0,
    defenseicount: 0,
    defenseocount: 0,
    intercomcount: 0,
    decodecount: 0,
    voicecount: 0,
    encodingcount: 0,
    videoinputcount: 0,
    entranceguardcount: 0,
    status: false,
    intelligent: 0,
    intelligentalarm: false,
    devicealarm: false,
    monitorypointalarm: false,
    connMode: 'active',
    mainStream: '',
    subStream: '',
    OnlineRateStatus: 3,
    name: 'ppp',
    model: '0',
    ip: '101.10.10.10',
    deviceid: 1111111,
    cport: 4500,
    username: 'zouxinrui',
    password: '123456',
    deviceStatus: 1
  }
  let orgList = await orgs.find({ type: 0 })
  // delete dev._id
  // delete dev._v
  // delete dev.createdAt
  // delete dev.updatedAt
  let sum = 0
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
    // for (const iterator of objArr) {
    //   if (obj[iterator] < 255) {
    //     obj[iterator] = obj[iterator] + 1
    //     break
    //   } else {
    //     console.log('没有可以用的 ip 了-----')
    //     return
    //   }
    // }
    dev.oid = orgList[Math.round(Math.random() * (orgList.length - 1))]._id
    dev.ip = `${obj.one}.${obj.two}.${obj.three}.${obj.four}`
    let createObj = await Device.insertMany([dev])
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
kk(500)
