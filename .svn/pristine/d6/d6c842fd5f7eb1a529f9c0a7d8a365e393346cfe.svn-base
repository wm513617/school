/*
 * @Description: 视频结构化服务器信息
 * @Author: wanglei
 * @Date: 2019-06-26 14:40:42
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-26 10:27:01
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { UUIDGeneratorNode } = require('../../../common/tools')
const { ServerStatusCodeEnum } = require('../structure.enum')

const StructureServerSchema = new Schema(
  {
    // 服务器名称
    name: {
      type: String,
      maxlength: 16,
      required: [true, '服务器名称必填']
    },
    // 算法厂家
    algorithm: {
      type: String,
      enum: ['BSR-SM'],
      required: [true, '算法厂家必填']
    },
    // 服务器编号
    code: {
      type: Number,
      required: [true, '服务器编号必填'],
      min: [1, '最小值为 1'],
      max: [999, '最大值为 999']
    },
    // 视频授权路数
    authNum: {
      type: Number,
      required: [true, '视频授权路数必填'],
      min: [1, '最小值为 1'],
      max: [999, '最大值为 999'],
      default: 20
    },
    // ip 地址
    ip: {
      type: String,
      required: [true, 'ip 地址必填'],
      unique: [true, 'ip 地址不可重复']
    },
    // 端口
    port: {
      type: String,
      required: [true, '端口必填']
    },
    // 绑定的资源
    res: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    // 视频结构化服务器用户名
    username: {
      type: String,
      default: 'admin'
    },
    // 视频结构化服务器密码
    password: {
      type: String,
      default: 'intedio'
    },
    // 结构化服务器的内部唯一标识，内部用，不对外开放，主要用来标识推送过来的数据是哪一台服务器的
    structServerId: {
      type: String,
      default: ''
    },
    // 服务状态
    serverStatus: {
      type: Number,
      default: ServerStatusCodeEnum.START,
      validate: val => Object.values(ServerStatusCodeEnum).includes(val)
    }
  },
  { timestamps: true }
)

StructureServerSchema.pre('save', function (next) {
  this.structServerId = UUIDGeneratorNode()
  next()
})

mongoose.model('structureserver', StructureServerSchema)
