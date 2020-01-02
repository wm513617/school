/*
 * @Author: linhang
 * @Date: 2019-06-15 09:21:53
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-15 10:30:07
 */
/**
 * 删除与报警终端关联的设备表和资源表脏数据
 */
const mongoose = require('mongoose')
const _ = require('lodash')
require('../api/sys/alarmhelp/client.model')
require('../api/sys/device/device.model')
const ResourceSchema = new mongoose.Schema({
  name: String,
  ip: String
})
mongoose.model('Resource', ResourceSchema)
const AlarmClient = mongoose.model('alarmClient')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
mongoose.connect('mongodb://127.0.0.1/bs-security')
async function check () {
  try {
    const [deviceIds, camerDevIds] = await Promise.all([
      Device.distinct('_id', { type: { $in: ['alarmPillar', 'alarmBox'] } }),
      AlarmClient.distinct('camerDevId', {})
    ])
    const devIds = deviceIds.map(item => item + '')
    const camerIds = camerDevIds.map(item => item + '')
    let unusedDeviceIds = _.difference(devIds, camerIds)
    unusedDeviceIds = unusedDeviceIds.map(item => mongoose.Types.ObjectId(item))
    if (!_.isEmpty(unusedDeviceIds)) {
      const unusedDeviceCount = unusedDeviceIds.length
      await Device.deleteMany({ _id: { $in: unusedDeviceIds } })
      console.log(`---删除与报警终端关联的设备devices表脏数据${unusedDeviceCount}条---`)
      const unusedResources = await Resource.find({ eid: { $in: unusedDeviceIds } })
        .lean()
        .exec()
      if (!_.isEmpty(unusedResources)) {
        const unusedResourcesCount = unusedResources.length
        console.log(`---删除与报警终端关联的资源resources表脏数据${unusedResourcesCount}条---`)
      }
    }
  } catch (err) {
    console.log(`---执行脚本出错：${err}---`)
  }
}
check()
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    process.exit(0)
  })
