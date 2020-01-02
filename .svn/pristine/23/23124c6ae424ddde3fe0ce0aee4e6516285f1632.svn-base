/*
 * @Description: 视频结构化布控任务 schema
 * @Author: wanglei
 * @Date: 2019-07-18 11:26:55
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-19 11:17:18
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const structEnum = require('../structure.enum')

const StructureDefenseTask = new Schema(
  {
    // 布控名称
    taskName: {
      type: String,
      required: true,
      unique: [true, '布控名称重复'],
      default: '',
      maxlength: [16, '布控名称最长 16 个字符']
    },
    // 布控原因
    reason: {
      type: String,
      default: ''
    },
    // 长期布控
    always: {
      type: Boolean,
      default: true
    },
    // 上传图片
    picture: {
      type: String,
      default: ''
    },
    // 布控的服务器
    structServer: [
      {
        // 视频结构化服务器
        serverId: {
          type: Schema.Types.ObjectId,
          ref: 'structureserver'
        },
        // 视频结构化服务器返回的布控任务id
        taskId: {
          type: Number,
          default: -1
        },
        status: {
          type: Number,
          default: -1,
          // 0 成功 | 1 失败
          validate: val => [-1, 0, 1].includes(val)
        }
      }
    ],
    // 布控分类
    taskType: {
      type: Number,
      // 与视频结构化服务器中定义的分类一致
      // 10 车辆 | 11 行人 | 12 两轮车
      validate: val => [10, 11, 12].includes(val)
    },
    // 布控条件，跟视频结构化服务器保持一致
    taskCondition: {
      // 开始时间
      startTime: {
        type: Number,
        default: 0
      },
      // 结束时间
      endTime: {
        type: Number,
        default: 0
      },
      // 年龄
      ageCode: {
        type: Number,
        // 0 未识别 | 1 儿童 | 2 青年 | 3 中年 | 4 老年 | 5 少年
        validate: val => Object.values(structEnum.AgeCodeEnum).includes(val)
      },
      // 是否抱小孩
      babyCode: {
        type: Number,
        // 0 未识别 | 1 抱小孩 | 2 未抱小孩 | 3 背小孩
        validate: val => Object.values(structEnum.BabyCodeEnum).includes(val)
      },
      // 拎东西
      bagCode: {
        type: Number,
        // 0 未识别 | 1 未拎东西 | 2 拎东西
        validate: val => Object.values(structEnum.BagCodeEnum).includes(val)
      },
      // 下衣颜色
      bottomColorCode: {
        type: Number,
        // 0 未识别 | 1 灰 | 2 白 | 3 红 | 4 绿 | 5 蓝 | 6 黄 | 7 黑 | 8 紫色 | 9 深灰
        validate: val => Object.values(structEnum.BottomColorCodeEnum).includes(val)
      },
      // 下衣款式
      bottomTypeCode: {
        type: Number,
        // 0 未识别 | 1 长裤 | 2 短裤 | 3 七分裤 | 4 裙子
        validate: val => Object.values(structEnum.BottomTypeCodeEnum).includes(val)
      },
      // 发型
      hairCode: {
        type: Number,
        // 0 未识别 | 1 长发 | 2 短发 | 3 马尾 | 4 被遮挡 | 5 盘发
        validate: val => Object.values(structEnum.HairCodeEnum).includes(val)
      },
      // 帽子
      hatCode: {
        type: Number,
        // 0 未识别 | 1 未戴帽子 | 2 戴帽子 | 3 戴头盔 | 4 连衣帽 | 5 头巾
        validate: val => Object.values(structEnum.HatCodeEnum).includes(val)
      },
      // 双肩包
      knapsackCode: {
        type: Number,
        // 0 未识别 | 1 未背包 | 2 双肩包 | 3 未确定
        validate: val => Object.values(structEnum.KnapsackCodeEnum).includes(val)
      },
      // 朝向
      orientationCode: {
        type: Number,
        // 0 未识别 | 1 前 | 2 后 | 3 侧 | 4 左 | 5 右
        validate: val => Object.values(structEnum.OrientationCodeEnum).includes(val)
      },
      // 性别
      sexCode: {
        type: Number,
        // 0 未识别 | 1 男 | 2 女
        validate: val => Object.values(structEnum.SexCodeEnum).includes(val)
      },
      // 打伞
      umbrellaCode: {
        type: Number,
        // 0 未识别 | 1 未打伞 | 2 打伞
        validate: val => Object.values(structEnum.UmbrellaCodeEnum).includes(val)
      },
      // 上衣颜色
      upperColorCode: {
        type: Number,
        // 0 未识别 | 1 白色 | 2 黑色 | 3 红色 | 4 黄色 | 5 灰色 | 6 蓝色 | 7 绿色 | 8 紫色 | 9 深灰
        validate: val => Object.values(structEnum.UpperColorCodeEnum).includes(val)
      },
      // 上衣款式
      upperTypeCode: {
        type: Number,
        // 0 未识别 | 1 长袖 | 2 短袖 | 3 羽绒服 | 4 普通外套 | 5 无外套
        validate: val => Object.values(structEnum.UpperTypeCodeEnum).includes(val)
      },
      // 骑车人
      riderCode: {
        type: Number,
        // 1 有 | 2 无
        validate: val => Object.values(structEnum.RiderCodeEnum).includes(val)
      },
      // 目标类型 布控两轮车时选择两轮车类型，自行车、摩托车
      targetType: {
        type: Number,
        validate: val => [structEnum.TypeCodeEnum.BIKE, structEnum.TypeCodeEnum.MOTORCYCLE].includes(val)
      },
      // 车辆 品牌、型号及年款组合（三段式）
      style: {
        type: String
      },
      // 车牌号码
      carPlateNumber: {
        type: String
      },
      // 车牌类型
      carPlateType: {
        type: String
      },
      // 车辆类型
      carKindCode: {
        type: String
      },
      // 车辆颜色
      carColorCode: {
        type: String
      }
    }
  },
  { timestamps: true }
)

mongoose.model('structuredefensetask', StructureDefenseTask)
