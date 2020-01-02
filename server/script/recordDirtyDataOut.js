/*
 * @Author: lushengying
 * @Date: 2019-06-06 10:29:56
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-06-11 15:59:08
 */

require('./resource.model')

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/bs-security')
const Resource = mongoose.model('Resource')
const fs = require('fs')
async function exportError() {
  try {
    const errList = await Resource.aggregate([
      {
        $match: { shareServer: { $exists: true } }
      },
      {
        $lookup:
          { from: 'records', localField: '_id', foreignField: 'resource', as: 'recodes' }
      },
      {
        $match: { recodes: { $exists: true } }
      },
      {
        $project:
        {
          resourceId: '$_id',
          name: 1,
          recodes: '$recodes'
        }
      }
    ])
    const outArr = []
    errList.map(i => {
      i.recodes.map(
        j => {
          outArr.push(JSON.stringify({
            'recodeName': i.name,
            'recodeInfo': j
          }))
        })
    })
    fs.writeFileSync('./recordGBError.json', outArr)
  } catch (err) {
    console.log(err.message)
  }
}

async function exportRepetitionError() {
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
          record_ids: { $push: '$recodes._id' },
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
    errList.map(i => {
      outArr.push(JSON.stringify(i))
    })
    fs.writeFileSync('./recordRepetError.json', `[${outArr}]`)
  } catch (err) {
    console.log(err.message)
  }
}

exportError().then(() => {
  console.log('export recordGBError.json succeed!!!')
  exportRepetitionError().then(() => {
    console.log('export recordRepetError.json succeed!!!')
    process.exit(1)
  }).catch((err) => {
    console.log(err)
  })
}).catch((err) => {
  console.log(err)
})
