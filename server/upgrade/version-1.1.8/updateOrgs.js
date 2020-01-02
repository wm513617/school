/** 现场机构树 (type=0)
 * 数据过滤，清除脏数据
 * @Author: SongXiaoshan
 * @Date: 2019-11-29 16:29:14
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2019-11-29 16:53:07
 */

'use strict'
const mongoose = require('mongoose')
const Org = mongoose.model('Org')
const Key = mongoose.model('Key')

exports.upgrade = async () => {
  await update()
}

const update = async () => {
  try {
    // 首次
    let keyVal = 0
    // 修改Key
    let selectOrg = [
      { $match: { $and: [{ type: 0 }, { isroot: true }] } },
      { $sort: { order: 1 } },
      { $project: { name: 1, order: 1, _id: 1, pid: 1 } }
    ]
    await updateFun(JSON.parse(JSON.stringify(await Org.aggregate(selectOrg))), keyVal, selectOrg)
  } catch (error) {
    console.log(error)
    throw error
  }
}
const updateFun = async (list, keyVal, selectOrg) => {
  try {
    let res = []
    for (let e of list) {
      // 修改order
      await Org.findByIdAndUpdate(e._id, { order: keyVal }).exec()
      keyVal++
      // 查找子级
      selectOrg[0] = { $match: { pid: mongoose.Types.ObjectId(e._id) } }
      let _d = await Org.aggregate(selectOrg)
      res.push(...JSON.parse(JSON.stringify(_d)))
    }
    if (res.length) {
      return updateFun(res, --keyVal, selectOrg)
    } else {
      // 修改order
      await Key.findByIdAndUpdate('org_0', { key: --keyVal }).exec()
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
