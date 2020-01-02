/*
 * @Author: hansen.liuhao
 * @Date: 2019-01-07 20:27:29
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-06-21 16:37:40
 */
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const Storage = mongoose.model('Storage')
const OrgRes = mongoose.model('OrgRes')
const Record = mongoose.model('Record')
const Snapshot = mongoose.model('Snapshot')
const { getChildren, clearDir } = require('./tools')
const config = require('../../config').backend
const AlarmClient = mongoose.model('alarmClient')
const Device = mongoose.model('Device')

/**
 * 清理系统异常情况下，未被删除的冗余数据
 *  @param {number} type 机构类型
 */

exports.cleanTrash = async () => {
  const type = 0
  const [rootId, orgs] = await Promise.all([Org.findOne({ type: type, isroot: true }).lean(), Org.find({ type: type }, 'name pid isroot').lean()])
  let org = []
  const resIds = []
  org = getChildren(org, orgs, rootId._id.toString())
  org.push(rootId)
  const orgRes = await OrgRes.find({ org: { $in: org } })
  orgRes.forEach(item => {
    if (item.resource) {
      resIds.push(item.resource.toString())
    }
  })
  const data = await Resource.find({ _id: { $in: resIds } }).lean()
  const notFound = []
  for (const id of resIds) {
    if (!data.find(item => item._id.toString() === id)) {
      notFound.push(id)
    }
  }
  console.log('system clean redundant data,total is===%s', notFound.length)
  // if (notFound.length) {
  await Promise.all([
    OrgRes.deleteMany({ resource: { $in: notFound } }),
    Storage.deleteMany({ $or: [{ resource: { $in: notFound } }, { server: { $exists: false } }] }),
    Record.deleteMany({ resource: { $in: notFound } }),
    Snapshot.deleteMany({ resource: { $in: notFound } })
  ])
  // }
}

/**
 * 清理临时目录文件
 */
exports.clearDir = () => {
  try {
    const dir = config.fileDirs.tempDir
    clearDir(dir)
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 清理和报警终端相关的device表和resource表脏数据
 */
exports.deleteDevicesByAlarmClients = async () => {
  try {
    const [deviceIds, camerDevIds] = await Promise.all([
      Device.distinct('_id', { type: { $in: ['alarmPillar', 'alarmBox'] } }),
      AlarmClient.distinct('camerDevId', {})
    ])
    const devIds = deviceIds.map(item => item + '')
    const camerIds = camerDevIds.map(item => item + '')
    let unusedDeviceIds = _.difference(devIds, camerIds)
    unusedDeviceIds = unusedDeviceIds.map(item => mongoose.Types.ObjectId(item))
    if (!_.isEmpty(unusedDeviceIds)) {
      const unusedDeviceCount = unusedDeviceIds.length
      await Device.deleteMany({ _id: { $in: unusedDeviceIds } })
      console.log(`---删除与报警终端关联的设备devices表脏数据${unusedDeviceCount}条---`)
      const unusedResources = await Resource.find({ eid: { $in: unusedDeviceIds } })
        .lean()
        .exec()
      if (!_.isEmpty(unusedResources)) {
        const unusedResourcesCount = unusedResources.length
        console.log(`---删除与报警终端关联的资源resources表脏数据${unusedResourcesCount}条---`)
      }
    }
    await clearStorage()
    await clearRepetitionError()
  } catch (error) {
    console.log(error)
  }
}

async function clearStorage () {
  try {
    const rIds = await Resource.find({ shareServer: { $exists: true } }, '_id').lean()
    const resultStorage = await Storage.deleteMany({
      resource: {
        $in: rIds.map(item => item._id + '')
      }
    }).exec()
    if (resultStorage.ok) {
      console.log('Delete Storage succeed!!!')
      console.log('Delete Storage Count:', resultStorage.n || 0)
    }
    const resultRecode = await Record.deleteMany({
      resource: {
        $in: rIds.map(item => item._id + '')
      }
    }).exec()
    if (resultRecode.ok) {
      console.log('Delete Recode succeed!!!')
      console.log('Delete Recode Count:', resultRecode.n || 0)
    }
  } catch (err) {
    console.log(err.message)
  }
}

async function clearRepetitionError () {
  try {
    const errList = await Resource.aggregate([
      {
        $lookup:
          { from: 'records', localField: '_id', foreignField: 'resource', as: 'recodes' }
      },
      { $project: { name: '$name', recodes: '$recodes' } },
      { $unwind: '$recodes' },
      {
        $group:
        {
          _id: { 'resource_id': '$recodes.resource', 'takeType': '$recodes.takeType' },
          records: { $push: '$recodes' },
          recordLength: { $sum: 1 }
        }
      },
      {
        $match: {
          recordLength: { $gte: 2 }
        }
      }
    ])
    const outArr = []
    for (let i in errList) {
      const arr = _.get(errList[i], 'records', [])
      const obj = _.maxBy(arr, item => item.updatedAt)
      arr.map(item => {
        if (item._id !== obj._id) {
          outArr.push(item._id + '')
        }
      })
    }
    await Record.deleteMany({ _id: { $in: outArr } }).exec()
  } catch (err) {
    console.log(err.message)
  }
}
