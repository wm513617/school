/*
 * @Author: lushengying
 * @Date: 2019-06-06 10:29:56
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-06-18 13:18:02
 */

require('./resource.model')
require('./record.model')
require('../api/sys/video/storage/storage.model')

const _ = require('lodash')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/bs-security')
const Resource = mongoose.model('Resource')
const Record = mongoose.model('Record')
const Storage = mongoose.model('Storage')

async function updateUserAndRole() {
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

async function clearRepetitionError() {
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
    console.log('Delete Repetition succeed!!!')
    console.log('Repetition Count:', outArr.length)
    const resulet = await mongoose.model('Record').collection.createIndex({ resource: 1, takeType: 1 }, { unique: true, background: true })
    console.log(resulet)
  } catch (err) {
    console.log(err.message)
  }
}

updateUserAndRole().then(() => {
  clearRepetitionError().then(() => {
    process.exit(1)
  }).catch((err) => {
    console.log(err)
  })
}).catch((err) => {
  console.log(err)
})
