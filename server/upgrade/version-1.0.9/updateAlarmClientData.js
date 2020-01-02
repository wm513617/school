/*
 * @Author: linhang
 * @Date: 2019-06-16 17:34:12
 * @Last Modified by: linhang
 * @Last Modified time: 2019-10-14 09:31:21
 */
const Resource = mongoose.model('Resource')
const AlarmClient = mongoose.model('alarmClient')
const AlarmCfg = mongoose.model('alarmCfg')
exports.upgrade = async () => {
  await updateAlarmClientCfg()
}
/**
 * 恢复报警求助报警配置的资源通道名称
 */
async function updateAlarmClientCfg () {
  try {
    const alarmClientIds = await AlarmClient.distinct('_id', {})
    const alarmCfgs = await AlarmCfg.find({ resource: { $in: alarmClientIds } })
      .lean()
      .exec()

    if (!_.isEmpty(alarmCfgs)) {
      for (let item of alarmCfgs) {
        const actionVideo = item.actionVideo
        if (actionVideo && !_.isEmpty(actionVideo)) {
          const arr = []
          for (let res of actionVideo) {
            const resource = await Resource.findById(res.resource)
              .lean()
              .exec()
            const obj = res
            if (resource) {
              obj.channelName = resource.name
            } else {
              obj.channelName = ''
            }
            // obj.channelName = resource.name ? resource.name : ''
            arr.push(obj)
          }
          await AlarmCfg.findByIdAndUpdate(item._id, { actionVideo: arr })
        }
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
