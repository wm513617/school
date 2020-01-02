/**
 * 系统参数设置
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SysparamtersSchema = new Schema({
  name: String, // 平台名称
  logo: String, // 平台logo
  titlecolor: String, // 标题蓝背景
  titlefont: String, // 标题栏字体
  loginimg: String, // 登陆页面图片
  alarmlog: Number, // 报警/事件日志天数
  equipmentlog: Number, // 设备/系统日志天数
  operationlog: Number, // 操作日志天数
  configlog: Number, // 配置日志天数
  transport: {
    // 传输协议
    type: String,
    enum: ['TCP', 'UDP', 'group']
  },
  picture: {
    // 画质选择
    type: String,
    enum: ['auto', 'fluency', 'quality']
  },
  screenshot: String, // 截图保存格式
  videotape: String, // 本地录像格式
  creatdbtime: Number, // 文件分表时间间隔
  // 2D 还是 3D 地图
  mapType: {
    enable: {
      type: [String],
      default: ['2D', '3D']
    },
    default: {
      type: String,
      default: '2D'
    }
  },
  // 单兵rtmp流配置
  rtmp: String,
  // 录像存储服务器
  storage: String,
  // 录像存储路径,范围1-16
  path: Number,
  // 离地高度
  height: Number,
  // 消防页面按钮开启
  fireOpen: Boolean,
  // 报警页面按钮开启
  alarmOpen: Boolean,
  // 邮件设置
  sendName: String, // 发件人名称
  email: String, // 发件人邮箱地址
  smtpServer: String, // smtp服务器地址
  smtpPort: Number, // smtp服务器端口
  ssl: Boolean, // 是否启用ssl
  serverAuth: Boolean, // 是否启用服务器认证
  userName: String, // 用户名
  password: String, // 密码
  isShowCollect: { // 是否仅显示收藏的联系人
    type: Boolean,
    default: true
  }
})
mongoose.model('Sysparamters', SysparamtersSchema)
