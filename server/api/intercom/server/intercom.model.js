/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-25 17:17:24
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-14 13:51:40
 * @description: 对讲服务器配置
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const intercomServerSchema = new Schema(
  {
    // 服务器名称
    name: {
      type: String,
      required: [true, '名称必输'],
      maxlength: [64, '名称最大64个字符']
    },
    // 服务对应影子设备[用户检测设备进行自登陆]
    device: {
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    // ip地址
    ip: {
      type: String,
      required: [true, '服务器IP地址必输']
    },
    // 端口
    cport: {
      type: Number,
      required: [true, '服务器端口必输'],
      min: [0, '端口号必须大于0'],
      max: [65535, '端口号必须小于65535']
    },
    // 用户名
    username: {
      type: String,
      required: [true, '用户名必输'],
      maxlength: [64, '名称最大64个字符']
    },
    // 密码
    password: {
      type: String,
      required: [true, '密码必输'],
      maxlength: [64, '名称最大64个字符']
    },
    // 存储服务器
    dsServer: {
      type: String,
      required: [true, '存储服务器']
    },
    // 存储路径
    dsPath: {
      type: String,
      required: [true, '存储路径']
    }
  },
  { timestamps: true }
)
mongoose.model('IntercomServerConf', intercomServerSchema)
