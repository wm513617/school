'use strict'
/**
 * 存放自增长id的模型
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')

const KeySchema = new Schema({
  _id: { // 实例应该是你的其它model的名字
    type: String
    // unique: true,
    // index: true
  },
  key: { // 每次使用时的自增长ID
    type: Number,
    default: 1
  }
})

KeySchema.statics = {
  getKeyById: async function (keyId) { // 每次调用递增key
    try {
      let doc = await this.findById(keyId).exec()
      if (_.isEmpty(doc)) {
        const obj = {}
        obj._id = keyId
        await this.create(obj)
      } else {
        await this.where({
          _id: keyId
        }).update({
          $inc: { key: 1 }
        }).exec()
      }
      doc = await this.findById(keyId).exec()
      return doc.key
    } catch (err) {
      console.error(err)
      return null
    }
  }
}

mongoose.model('Key', KeySchema)
