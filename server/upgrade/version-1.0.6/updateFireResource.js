/*
 * @Author: linhang
 * @Date: 2019-06-16 17:34:12
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 19:08:49
 */
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
exports.upgrade = async () => {
  await updateFireResource()
}
/**
 * 给消防资源添加orgId
 */
async function updateFireResource () {
  try {
    const resourceIds = await Resource.distinct('_id', { type: { $in: [11, 12] } })
    const orgResList = await OrgRes.find({ resource: { $in: resourceIds } })
      .lean()
      .exec()
    if (!_.isEmpty(orgResList)) {
      for (let item of orgResList) {
        await Resource.updateOne({ _id: item.resource }, { orgId: item.org })
      }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}
