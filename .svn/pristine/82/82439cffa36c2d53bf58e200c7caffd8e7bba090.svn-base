/*
 * @Author: linhang
 * @Date: 2019-06-14 13:40:40
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 19:18:09
 */
const AlarmClient = mongoose.model('alarmClient')
const AlarmCfg = mongoose.model('alarmCfg')
const _ = require('lodash')
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
  try {
    // 把报警终端的联动配置信息迁移到新的alarmcfg表中
    const alarmClientCfgs = await AlarmClient.find()
      .lean()
      .exec()
    if (!_.isEmpty(alarmClientCfgs)) {
      for (let item of alarmClientCfgs) {
        if (item.actionVideo && !_.isEmpty(item.actionVideo)) {
          const obj = {
            resource: item._id,
            actionVideo: item.actionVideo,
            actionRule: actionRule
          }
          await AlarmClient.update({ _id: item._id }, { actionConfig: true })
          await AlarmCfg.create(obj)
        }
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
