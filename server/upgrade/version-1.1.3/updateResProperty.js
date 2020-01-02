/*
 * @Author: linhang
 * @Date: 2019-08-23 20:51:36
 * @Last Modified by: linhang
 * @Last Modified time: 2019-09-09 19:24:33
 */
'use strict'
const ResProperty = mongoose.model('ResProperty')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const Wall = mongoose.model('Wall')
const Role = mongoose.model('Role')
exports.upgrade = async () => {
  await updateResProperty()
}
const updateResProperty = async () => {
  try {
    // 资源类型-0视频通道，1报警设备，2消防设备，3报警求助设备，5人脸设备，4电视墙
    // 报警设备
    const alarmResources = await Resource.find({ type: { $in: [1, 9] } }, '_id').lean()
    const alarmResIds = alarmResources.map(item => item._id + '')
    // 消防设备
    const fireResources = await Resource.find({ type: 11 }, '_id').lean()
    const fireResIds = fireResources.map(item => item._id + '')
    // 报警求助设备
    const devices = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }).lean()
    const devIds = devices.map(item => item._id + '')
    const alarmHelpResources = await Resource.find({ eid: { $in: devIds } }).lean()
    const alarmHelpResIds = alarmHelpResources.map(item => item._id + '')
    // 电视墙
    const walls = await Wall.find().lean()
    const wallIds = walls.map(item => item._id + '')
    // 视频资源
    const videoResources = await Resource.find({ type: 0 }, '_id').lean()
    let videoResIds = videoResources.map(item => item._id + '')
    videoResIds = videoResIds.filter(item => !alarmHelpResIds.includes(item))
    // 改写数据
    const data = await ResProperty.find()
    let [a, b, c, d, e] = [0, 0, 0, 0, 0]
    for (let item of data) {
      if (videoResIds.includes(item.resource + '')) {
        item.type = 0
        await item.save()
        a++
      } else if (alarmResIds.includes(item.resource + '')) {
        item.type = 1
        await item.save()
        b++
      } else if (fireResIds.includes(item.resource + '')) {
        item.type = 2
        await item.save()
        c++
      } else if (alarmHelpResIds.includes(item.resource + '')) {
        item.type = 3
        await item.save()
        d++
      } else if (wallIds.includes(item.resource + '')) {
        item.type = 4
        await item.save()
        e++
      }
    }
    console.log(a, b, c, d, e)
    await Role.updateMany({}, { $unset: { resources: 1 } })
    console.log('------resproperties表升级完成')
  } catch (error) {
    console.log(error)
    throw error
  }
}
