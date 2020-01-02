/**
 * 报警级别模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TimeTemplateSchem = new Schema({
  name: String,
  elements: {
    week1: [{
      endTime: Number,
      beginTime: Number
    }],
    week2: [{
      endTime: Number,
      beginTime: Number
    }],
    week3: [{
      endTime: Number,
      beginTime: Number
    }],
    week4: [{
      endTime: Number,
      beginTime: Number
    }],
    week5: [{
      endTime: Number,
      beginTime: Number
    }],
    week6: [{
      endTime: Number,
      beginTime: Number
    }],
    week7: [{
      endTime: Number,
      beginTime: Number
    }],
    week8: [{
      endTime: Number,
      beginTime: Number
    }]
  }
})
mongoose.model('alarmTimeTemplate', TimeTemplateSchem)
