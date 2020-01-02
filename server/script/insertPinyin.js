'use strict'
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/bs-security')
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/org/org.model')
require('../api/sys/resource/resource.model')
require('../api/sys/tvWall/plan/plan.model')
require('../api/sys/tvWall/polling/polling.model')
require('../api/sys/tvWall/scene/scene.model')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const Plan = mongoose.model('Plan')
const Polling = mongoose.model('Polling')
const Scene = mongoose.model('Scene')
const Promise = require('bluebird')
const tool = require('../common/tools')
async function transferPinyin () {
  try {
    const [orgs, resources, plans, pollings, scenes] = await Promise.all([
      Org.find({}).exec(),
      Resource.find({}).exec(),
      Plan.find({}).exec(),
      Polling.find({}).exec(),
      Scene.find({}).exec()
    ])
    const temp = [...orgs, ...resources, ...plans, ...pollings, ...scenes].map(item => {
      item.pinyin = tool.transferPinyin(item.name)
      return item.save()
    })
    try {
      await Promise.all(temp)
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
  }
}
transferPinyin().then(() => {
  process.exit(1)
}).catch((err) => {
  console.log(err)
})
