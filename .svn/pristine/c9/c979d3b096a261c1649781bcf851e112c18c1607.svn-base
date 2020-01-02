/**
 * 统计平台所有资源信息，包括'序号', '通道名称', '所属设备', '所属机构', '通道IP', '通道号', '监控点类型'
 */
const mongoose = require('mongoose')
const moment = require('moment')
const xlsx = require('node-xlsx')
const fs = require('fs')
require('../../server/api/sys/orgRes/orgRes.model')
require('../../server/api/sys/device/device.model')
require('../../server/api/sys/org/org.model')
const ResourceSchema = new mongoose.Schema({
  name: String,
  ip: String,
  eid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  }
})
mongoose.model('Resource', ResourceSchema)
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
mongoose.connect('mongodb://127.0.0.1/bs-security')
async function exportResource () {
  console.time('统计完成，用时：')
  const res = await Resource.find({}, 'eid name ip chan monitortype')
    .populate({ path: 'eid', select: 'name ip' })
    .lean()
    .exec()
  const orgRes = await OrgRes.find({ islane: false }, 'org resource')
    .populate({ path: 'org', select: 'name' })
    .lean()
    .exec()
  const data = [['序号', '通道名称', '所属设备', '所属机构', '通道IP', '通道号', '监控点类型']]
  // monitortype:0: '枪机',1: '红外枪机',2: '半球',3: '快球', 4: '全景'
  for (let i in res) {
    res[i].monitortype =
      res[i].monitortype === 0
        ? '枪机'
        : res[i].monitortype === 1
          ? '红外枪机'
          : res[i].monitortype === 2
            ? '半球'
            : res[i].monitortype === 3
              ? '快球'
              : '全景'
    for (let j in orgRes) {
      if (res[i]._id + '' === orgRes[j].resource + '') {
        const orgName = orgRes[j].org.name ? orgRes[j].org.name : '未知机构'
        const rowData = [
          Number(i) + 1 + '',
          res[i]['name'],
          res[i]['eid']['name'],
          orgName,
          res[i]['eid']['ip'],
          res[i]['chan'] + '',
          res[i]['monitortype']
        ]
        data.push(rowData)
        break
      }
    }
    if ((Number(i) % 100 === 0 && Number(i) !== 0) || Number(i) === res.length - 1) {
      console.log(`---共计${res.length}条，已统计${Number(i)}条---`)
    }
  }
  const ColInfos = [
    { width: 25 },
    { width: 25 },
    { width: 25 },
    { width: 25 },
    { width: 25 },
    { width: 25 },
    { width: 25 }
  ]
  const option = { '!cols': ColInfos }
  var buffer = xlsx.build([{ name: '校园平台资源通道统计', data: data }], option)
  const date = moment().format('YYYY-MM-DD')
  const file = `校园平台资源通道统计-${date}.xlsx`
  fs.writeFileSync(file, buffer)
  console.timeEnd('统计完成，用时：')
}
exportResource()
  .then(() => {
    process.exit(0)
  })
  .catch(err => {
    console.log('统计出错：', err)
    process.exit(0)
  })
