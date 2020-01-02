/*
 * @Author: hansen.liuhao
 * @Date: 2018-12-17 16:16:09
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-17 17:04:33
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Layer3D = new Schema(
  {
    // 图层的名称
    name: {
      type: String,
      required: true
    },
    // 图层是否在地图中可选中
    selected: {
      type: Boolean
    },
    // 色调
    hue: Number,
    // 饱和度
    saturation: Number,
    // 亮度
    brightness: Number,
    // 选中颜色
    selectedColor: String,
    // 是否设为地面
    isGround: Boolean
  },
  { timestamps: true }
)

Layer3D.path('name').validate(function (value) {
  return new Promise((resolve, reject) => {
    this.model('Layer3D').countDocuments({ name: value }, function (error, count) {
      if (error) {
        resolve(false)
      } else {
        resolve(!count)
      }
    })
  })
}, '图层已存在，不能再次创建')

mongoose.model('Layer3D', Layer3D)
