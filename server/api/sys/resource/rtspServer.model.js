/*
 * @Author: chenkaibo
 * @Date: 2018-08-22 11:15:35
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-22 11:20:30
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RtspServer = new Schema({
  url: String,
  port: Number,
  username: String,
  password: String,
  rtspcount: Number
})

mongoose.model('RtspServer', RtspServer)
