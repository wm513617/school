const config = require('../../../../config').backend
const mongoose = require('mongoose')
const { NODE_ENV } = process.env
process.env.NODE_ENV = NODE_ENV || 'production'
mongoose.Promise = require('bluebird')
mongoose.connect(config.mongo.uri, config.mongo.options)
require('../../../common/load.model')
const { SDKFaceV3Adapter } = require('./faceV3Adapter')

let [initConfig, singleton] = [{ resources: [] }, null]

singleton = new SDKFaceV3Adapter()
singleton.run(initConfig)

process.on('message', message => {
  console.log('resource', message)
  singleton.reconfig(message)
})
