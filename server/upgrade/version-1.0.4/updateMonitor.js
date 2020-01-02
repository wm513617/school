/*
 * @Author: linhang
 * @Date: 2019-06-14 13:40:40
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 19:15:07
 */

const Monitor = mongoose.model('Monitor')

exports.upgrade = async () => {
  await updateMonitor()
}
/**
 * 电视墙监视器编号重置
 */
async function updateMonitor () {
  try {
    const monList = await Monitor.find({}).exec()

    await Promise.all(
      monList.map(item => {
        while (item.code.length > 3 && item.code.substr(0, 1) === '0') {
          item.code = item.code.substr(1)
        }
        console.log(item.code)
        return item.save()
      })
    )
  } catch (err) {
    console.log(err)
    throw err
  }
}
