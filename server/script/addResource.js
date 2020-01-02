'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/reda')
var Schema = mongoose.Schema
require('./resource.model.js')
require('./device.model.js')
mongoose.model('Device', new Schema())
mongoose.model('Resource', new Schema())
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
// 1.1.81.16  reda
const kk = async (maximum = 5) => {
  let resource = await Resource.findOne({ type: 0 }).lean().exec()
  console.log(resource, '11111111111')
  let deviceList = await Device.find({ bigtype: 0 }).lean().exec()

  delete resource._id
  delete resource._v
  delete resource.createdAt
  delete resource.updatedAt
  let sum = 0
  while (sum <= maximum) {
    for (var i = 0; i < deviceList.length; i++) {
      resource.eid = deviceList[i]._id
      resource.ip = deviceList[i].ip
      console.log(resource.eid, '222222222')
      let createObj = await Resource.insertMany([resource])
      console.log(createObj, '44444')
      if (createObj.length !== 0) {
        console.log(createObj[0].ip + ':' + createObj[0].cport, '创建成功返回')
      } else {
        console.log('创建失败：' + createObj)
        return
      }
    }
    sum++
  }
  console.log('本次执行创建个数：' + sum)
  console.log('--------------')
}
kk(1)
