/** 
 * 人车同检核验分数 Schema
*/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VerificationScore = new Schema({

  /* 人车同检查核验分数 */
  score: {
    type: Number
  },
  /* 人车同检数据保存天数 */
  days: {
    type: Number
  }
}, { timestamps: true }
)

mongoose.model('verificationscore', VerificationScore)

