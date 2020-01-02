/**
 * 人脸统计年龄、性别特征模型
 * @time: 2017-6-27
 * @author: hansen
 *
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faceFeatrureStaticSchema = new Schema({
  // 年龄在0-9之间
  level0: {
    type: Number,
    default: 0
  },
  // 年龄在10-19之间
  level1: {
    type: Number,
    default: 0
  },
  // 年龄在20-29之间
  level2: {
    type: Number
  },
  // 年龄在30-39之间
  level3: {
    type: Number,
    default: 0
  },
  // 年龄在40-49之间
  level4: {
    type: Number,
    default: 0
  },
  // 年龄在50-59之间
  level5: {
    type: Number,
    default: 0
  },
  // 年龄在60-69之间
  level6: {
    type: Number,
    default: 0
  },
  // 年龄在70-79之间
  level7: {
    type: Number,
    default: 0
  },
  // 年龄在80-89之间
  level8: {
    type: Number,
    default: 0
  },
  // 年龄在80-89之间
  level9: {
    type: Number,
    default: 0
  },
  // 男性
  male: {
    type: Number,
    default: 0
  },
  // 女性
  female: {
    type: Number,
    default: 0
  },
  // 统计日期
  date: {
    type: Number,
    index: true
  }
}, { timestamps: true })

mongoose.model('FaceFeaStatic', faceFeatrureStaticSchema)
