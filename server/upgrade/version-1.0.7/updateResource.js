/*
 * @Author: linhang
 * @Date: 2019-06-16 17:34:12
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 19:09:01
 */
const Resource = mongoose.model('Resource')
exports.upgrade = async () => {
  await updateResource()
}
/**
 * 给资源表alarmaffirm添加handaffirm2字段
 */
async function updateResource () {
  try {
    const resources = await Resource.find({ alarmaffirm: { $exists: true } })
      .lean()
      .exec()
    if (!_.isEmpty(resources)) {
      for (let item of resources) {
        const alarmaffirm = item.alarmaffirm
        alarmaffirm.handaffirm2 = { status: false }
        await Resource.updateOne({ _id: item._id }, { alarmaffirm: alarmaffirm })
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
