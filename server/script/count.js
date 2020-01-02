const date = '2019-06-09'
const mongoose = require('mongoose')
const moment = require('moment')
const _ = require('lodash')
const xlsx = require('node-xlsx')
const fs = require('fs')
const ResourceSchema = new mongoose.Schema({
  name: String,
  ip: String
})
mongoose.model('Resource', ResourceSchema)
require('../api/veriface/identify/veriface.model')
require('../api/veriface/server/server.model')
// require('./resource.model')
const FaceData = mongoose.model('VerifaceIdentify')
const Server = mongoose.model('FaceServer')
const Resource = mongoose.model('Resource')
mongoose.connect('mongodb://127.0.0.1/bs-security')
async function countFace () {
  console.time('统计完成，用时')
  const timeArr = []
  const dateSecond = Number(moment(date).format('X'))
  for (let i = 0; i < 25; i++) {
    const time = dateSecond + i * 3600
    timeArr.push(time)
  }
  const servers = await Server.find()
    .lean()
    .exec()
  let resIds = []
  servers.forEach(item => {
    if (!_.isEmpty(item.res)) {
      resIds = resIds.concat(item.res)
    }
  })
  const reses = await Resource.find({ _id: { $in: resIds } }, 'name ip')
    .lean()
    .exec()
  const dataArr = []
  console.log(`---视频资源数量：${reses.length}---`)
  let i = 0
  for (let res of reses) {
    const promiseList = []
    for (let i = 0; i < 24; i++) {
      promiseList.push(FaceData.countDocuments({ time: { $gte: timeArr[i], $lte: timeArr[i + 1] }, resIp: res.ip }))
    }
    const rowData = await Promise.all(promiseList)
    rowData.unshift(res.ip)
    rowData.unshift(res.name)
    dataArr.push(rowData)
    i++
    console.log(`---第${i}个视频资源统计完成---`)
  }
  const headerData = ['资源名称', '资源ip', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  dataArr.unshift(headerData)
  const ColInfos = [{ width: 20 }, { width: 20 }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  const option = { '!cols': ColInfos }
  var buffer = xlsx.build([{ name: '抓拍人数统计', data: dataArr }], option)
  //   const file = `抓拍人数统计-${moment().format('YYYY-MM-DD-HH:mm:ss')}.xlsx`
  const file = `抓拍人数统计-${date}.xlsx`
  fs.writeFileSync(file, buffer)
  console.timeEnd('统计完成，用时')
}
countFace()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.log(`------统计出错：${JSON.stringify(err)}`)
    process.exit(0)
  })
