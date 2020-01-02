/*
 * @Author: linhang
 * @Date: 2019-06-16 17:34:12
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-21 18:37:40
 */
const Resource = mongoose.model('Resource')
const AlarmClient = mongoose.model('alarmClient')
exports.upgrade = async () => {
  await updateResource()
}
async function updateResource () {
  try {
    const resources = await Resource.find({ type: { $in: [9, 10, 11, 12] } })
    for (let item of resources) {
      item.alarmaffirm.handaffirm.status = false
      item.alarmaffirm.handaffirm2.status = true
      await item.save()
    }
    const clients = await AlarmClient.find()
    for (let item of clients) {
      item.handaffirm = {
        status: false
      }
      item.handaffirm2 = {
        status: true
      }
      await item.save()
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
