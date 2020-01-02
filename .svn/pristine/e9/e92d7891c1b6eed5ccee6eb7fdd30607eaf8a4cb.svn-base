const AlarmCfg = mongoose.model('alarmCfg')
const Resource = mongoose.model('Resource')
const _ = require('lodash')
const Device = mongoose.model('Device')
const actionRule = [
  {
    status: true,
    beginTime: 0,
    endTime: 86399,
    actionVideo: true,
    actionOutPut: false,
    actionEmail: false,
    actionWall: false
  },
  {
    status: false,
    beginTime: 0,
    endTime: 86399,
    actionVideo: true,
    actionOutPut: true,
    actionEmail: true,
    actionWall: true
  },
  {
    status: false,
    beginTime: 0,
    endTime: 86399,
    actionVideo: true,
    actionOutPut: true,
    actionEmail: true,
    actionWall: true
  },
  {
    status: false,
    beginTime: 0,
    endTime: 86399,
    actionVideo: true,
    actionOutPut: true,
    actionEmail: true,
    actionWall: true
  }
]
exports.upgrade = async () => {
  await updateFireAlarmCfg()
  await updateDevice()
}
/**
 * 消防防区已经配置联动视频的，联动规则1更新为已勾选状态
 */
async function updateFireAlarmCfg () {
  try {
    const fireResourceIds = await Resource.distinct('_id', { type: { $in: [11, 12] } })
    const fireAlarmCfgs = await AlarmCfg.find({ resource: { $in: fireResourceIds } })
      .lean()
      .exec()

    if (!_.isEmpty(fireAlarmCfgs)) {
      const resIds = []
      for (let item of fireAlarmCfgs) {
        if (item.actionVideo && !_.isEmpty(item.actionVideo)) {
          resIds.push(item.resource)
        }
      }
      await AlarmCfg.updateMany({ resource: { $in: resIds } }, { actionRule: actionRule })
      await Resource.updateMany({ _id: { $in: resIds } }, { actionConfig: true })
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
/**
 * 同步添加设备启用停用字段
 */
async function updateDevice () {
  try {
    const devList = await Device.find({ deviceStatus: { $exists: false } }).exec()
    const devIds = []
    devList.map(item => devIds.push(item._id + ''))
    await Device.updateMany({ _id: { $in: devIds } }, { deviceStatus: 1 }).exec()
    console.log('update End!!!')
  } catch (err) {
    console.log(err)
    throw err
  }
}
