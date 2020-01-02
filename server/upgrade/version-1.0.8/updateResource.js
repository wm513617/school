/*
 * @Author: linhang
 * @Date: 2019-06-16 17:34:12
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 19:09:15
 */
const Resource = mongoose.model('Resource')
exports.upgrade = async () => {
  await updateResource()
}
/**
 * 给消防资源isdelayrecord字段设置为true,delayrecord设置为30
 */
async function updateResource () {
  try {
    const resources = await Resource.find({ type: { $in: [11, 12] } })
      .lean()
      .exec()
    if (!_.isEmpty(resources)) {
      for (let item of resources) {
        const obj = { isdelayrecord: true, delayrecord: 30 }
        await Resource.updateOne({ _id: item._id }, obj)
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
