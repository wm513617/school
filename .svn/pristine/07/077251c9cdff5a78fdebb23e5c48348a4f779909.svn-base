'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://10.111.0.51:27017/bs-security', { useNewUrlParser: true })
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/org/org.model')
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/resource/resource.model')

const Resource = mongoose.model('Resource')

async function findRepeatFireRes () {
  try {
    const fireReses = await Resource.find({ type: 11 }).lean().exec()
    const fireResMap = {}
    const repeat = []
    fireReses.forEach(item => {
      const key = item.devloop + '-' + item.chan
      !fireResMap[key] && (fireResMap[key] = [])
      fireResMap[key] = [...fireResMap[key], item]
    })
    for (var key in fireResMap) {
      if (fireResMap[key].length > 1) {
        fireResMap[key].forEach(item => {
          if (item.isImport) {
            repeat.push(item._id + '')
          }
        })
      }
    }
    await Resource.deleteMany({ _id: { $in: repeat } })
    console.log(repeat)
  } catch (error) {
    console.log(error)
  }
}
findRepeatFireRes().then(() => {
  process.exit(1)
})
