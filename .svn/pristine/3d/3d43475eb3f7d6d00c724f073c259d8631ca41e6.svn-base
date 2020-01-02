/*
 * @Author: linhang
 * @Date: 2019-07-03 17:16:12
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-15 14:35:27
 */
'use strict'
const mongoose = require('mongoose')
const logUri = require('../../config').backend.mongo.logUri
const logUriAuth = require('../../config').backend.mongo.logUriAuth
let db = null
async function getDb () {
  if (db) {
    return db
  }
  try {
    db = await mongoose.createConnection(logUri, logUriAuth)
  } catch (err) {
    db = await mongoose.createConnection(logUri)
  }
  return db
}
module.exports = getDb
