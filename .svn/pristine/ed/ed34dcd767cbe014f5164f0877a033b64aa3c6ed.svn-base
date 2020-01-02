/*
 * 电视墙工具类
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:10:22
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-06-12 13:22:36
 */
const Device = mongoose.model('Device')

exports.getNowScene = plan => {
  const now = new Date()
  const nowS = now.getTime()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  const zeroTody = now.getTime()
  const time = Math.ceil((nowS - zeroTody) / 1000)
  const target = plan.info.find(({ start, end }) => time >= start && time <= end)
  return target && target.scene
}
exports.checkAddName = async (schema, name, wall) => {
  const res = await schema.find({ name, wall })
  return res.length
}
exports.checkModifyName = async (schema, id, name, wall) => {
  const res = await schema.find({ name, wall })
  let flag = false
  res.forEach(item => {
    if (item._id + '' !== id + '' && item.name + '' === name + '') {
      flag = true
    }
  })
  return flag
}
exports.checkDeviceSwitch = async ids => {
  const DEVICEOFF = 0
  // 0：视频设备
  // 5：解码器
  // 9:拼接控制器
  // 6：网络键盘

  const switchs = await Device.find({ _id: { $in: ids } }, '_id bigtype deviceStatus name').exec()
  const offDev = switchs.filter(item => item.deviceStatus === DEVICEOFF)
  if (!_.isEmpty(offDev)) {
    // const TYPE = {
    //   0: '视频设备',
    //   5: '解码器',
    //   6: '拼接控制器',
    //   9: '网络键盘'
    // }
    // let list = ''
    // offDev.map(item => (list += `${TYPE[item.bigtype]}-${item.name}`))
    // throw new Error(`设备被停用 ${list}`)
    return offDev
  }
}
