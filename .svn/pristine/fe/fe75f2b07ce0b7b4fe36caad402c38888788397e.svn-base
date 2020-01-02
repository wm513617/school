/*
 * @Author: linhang
 * @Date: 2019-06-14 13:40:40
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 19:37:28
 */
const FireAlarmCfg = mongoose.model('fireAlarmCfg')
const AlarmCfg = mongoose.model('alarmCfg')
const _ = require('lodash')
/**
 * 消防防区的配置信息从旧表迁入新表
 */
exports.upgrade = async () => {
  try {
    const fireCfgs = await FireAlarmCfg.find()
      .lean()
      .exec()
    if (!_.isEmpty(fireCfgs)) {
      for (let item of fireCfgs) {
        const obj = {
          resource: item.resource,
          actionVideo: item.actionVideo
        }
        await AlarmCfg.create(obj)
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
