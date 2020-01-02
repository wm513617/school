/*
 * 资源模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:57:10
 * @Last Modified by: mikey.zhaopengey.zhaopeng
 * @Last Modified time: 2019-10-11 15:27:45
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var OrgRes = mongoose.model('OrgRes')
// const AlarmLevel = mongoose.model('alarmLevel')
const AlarmType = mongoose.model('alarmType')
const AlarmTimeTemplate = mongoose.model('alarmTimeTemplate')
const tool = require('../../../common/tools')
const { AnalysisStatusCodeEnum } = require('../../structure/structure.enum')

// 资源点位schema2d
var PointSchema = new Schema({
  name: {
    // 点位名称（应该区别于资源名）
    type: String
  },
  class: Number, // 可见层级
  loc: {
    // 2d坐标
    type: String
  },
  radius: Number, // 照射角度
  angle: Number, // 点位角度
  isouter: {
    // 是否楼层外设备
    type: Boolean,
    default: true
  },
  // 负责人
  principal: [{
    type: Schema.Types.ObjectId,
    ref: 'Principal'
  }],
  charge: {
    type: String // 负责单位
  },
  desc: {
    // 简介
    type: String
  },
  minviewshed: Number, // 可视域1
  maxviewshed: Number, // 可视域2
  // tag: {          // 标识
  //   type: Number,
  //   default: 1,
  //   enum: [0, 1, 2]       // 0：none 1：网格内 2：楼层内
  // }
  sid: {
    // 所属楼层
    type: Schema.Types.ObjectId,
    ref: 'Storey'
  },
  mapId: {
    type: Schema.Types.ObjectId, // 承载底图
    ref: 'MapList'
  },
  projection: { // 点位坐标——投影坐标系
    type: String,
    default: 'EPSG:4326'
  },
  bid: {
    type: Schema.Types.ObjectId,
    ref: 'Building'
  },
  mid: {
    // 图标标识
    type: Schema.Types.ObjectId,
    ref: 'Icon'
  },
  viewshed: {
    type: Number
  },
  rgbcolor: {
    // 颜色
    type: String
  },
  style: {
    borderstyle: {
      // 边框样式
      type: String
    },
    borderwidth: {
      // 边框宽度
      type: String
    },
    bordercolor: {
      // 边框颜色
      type: String
    },
    bodertransparency: {
      // 边框透明度
      type: Number
    },
    fillcolor: {
      // 填充颜色
      type: String
    },
    fillcolortransparency: {
      // 填充透明度
      type: Number
    },
    font: {
      // 字体
      type: String
    },
    fontcolor: {
      // 字体颜色
      type: String
    },
    fontregular: {
      // 字体粗细
      type: String
    },
    fontsize: {
      // 字体大小
      type: String
    }
  }
})
// 资源点位schema3d
var Point3DSchema = new Schema({
  name: {
    // 点位名称（应该区别于资源名）
    type: String
  },
  loc: {
    // 3d坐标
    type: String
  },
  isouter: {
    // 是否楼层外设备
    type: Boolean,
    default: true
  },
  principal: [
    {
      // 负责人
      name: {
        type: String
      },
      mobile: {
        type: String
      }
    }
  ],
  class: {
    type: Number // 可见层级
  },
  sid: {
    // 所属楼层
    type: Schema.Types.ObjectId,
    ref: 'Storey3D'
  },
  bid: {
    // 所属楼宇
    type: Schema.Types.ObjectId,
    ref: 'Building3D'
  },
  mid: {
    // 模型id
    type: Schema.Types.ObjectId,
    ref: 'Model'
  },
  // 图标id 因为3D地图楼层内是2D地图，所以楼内的点位图标需添加图标库的
  iid: {
    type: Schema.Types.ObjectId,
    ref: 'Icon'
  },
  // 模型大小
  scale: {
    type: Number
  },
  // 模型高度
  height: {
    type: Number
  },
  // 模型朝向角
  heading: {
    type: Number
  },
  // 模型俯仰角
  pitch: {
    type: Number
  },
  // 模型滚动角
  roll: {
    type: Number
  },
  style: {
    borderStyle: { // 边框样式
      type: String
    },
    borderWidth: { // 边框宽度
      type: String
    },
    borderColor: { // 边框颜色
      type: String
    },
    borderTransparency: { // 边框透明度
      type: Number
    },
    fillColor: { // 填充颜色
      type: String
    },
    fillColorTransparency: { // 填充透明度
      type: Number
    },
    font: { // 字体
      type: String
    },
    fontColor: { // 字体颜色
      type: String
    },
    fontRegular: { // 字体粗细
      type: String
    },
    fontSize: { // 字体大小
      type: String
    }
  }
})
var ResourceSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Org'
    },
    name: {
      type: String,
      required: true
    }, // 通道名称
    chan: {
      type: Number,
      default: 1,
      required: true
    }, // 通道号
    type: {
      // 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区 ,15 拼接输入通道
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15],
      index: true
    },
    monitoryPointGenera: {
      // 监控点类型(小类)  0:普通, 1:人脸抓拍, 2:车辆抓拍
      type: Number,
      default: 0,
      enum: [0, 1, 2]
    },
    monitortype: {
      // 监控点类型
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4] // 0:枪机,1:红外枪机,2:半球,3:快球,4:全景
    },
    stream: {
      // 码流
      type: String,
      default: 'main',
      enum: ['main', 'sub1', 'sub2', 'pic'] // 主码流：main  子码流：sub1  第三码流：sub2  图片流：pic
    },
    keycode: String, // 键盘控制号
    status: {
      // 状态
      type: Number,
      default: 0,
      enum: [0, 1] // 0:停用,1:启用
    },
    isprerecord: {
      type: Boolean,
      default: false
    }, // 是否开启预录
    isdelayrecord: {
      type: Boolean,
      default: true
    }, // 是否开启延录
    precord: {
      type: Number,
      default: 10
    }, // 预录时间
    delayrecord: {
      type: Number,
      default: 30
    }, // 延录时间
    ip: String, // ip
    port: Number, // 端口号
    protocol: String, // 协议
    model: String, // 设备型号
    eid: {
      // 所属设备
      type: Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true
    },
    point: PointSchema, // 2d点位信息（子文档嵌套）
    point3D: Point3DSchema, // 3d点位信息（子文档嵌套）
    rtsp: {
      main: {
        // 主码流rtsp
        type: String
      },
      sub: {
        // 子码流rtsp
        type: String
      }
    }, // rtsp视频流地址（预留）
    channelid: Number, // 视频资源通道号（车辆使用）
    intelligent: {
      // 0：不支持智能 1普通智能 2人脸分析 3车辆识别
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3]
    },
    passway: {
      // 出入口定义（0：普通 1：入口 2：出口）
      type: Number,
      default: 0,
      enum: [0, 1, 2]
    },
    server: {
      // 智能分析服务器id
      type: Schema.Types.ObjectId,
      ref: 'ServerSetting'
    },
    hasserver: {
      // 是否分配智能分析服务器
      type: Boolean,
      default: false
    },
    analysisType: {
      // 分析类型
      type: Number,
      required: true,
      default: 0,
      enum: [0, 1] // 0:通行系统 1：抓拍系统
    },
    level: {
      // 级别
      type: Number
    },
    alarmtype: {
      // 报警分类
      type: Schema.Types.ObjectId,
      ref: 'alarmType'
    },
    alarmouttype: {
      // 报警输出类型
      type: String,
      enum: [0, 1], // 0:常开，1:常闭
      default: 0
    },
    alarmtemplate: {
      // 布撤防时间
      type: Schema.Types.ObjectId,
      ref: 'alarmTimeTemplate'
    },
    maxdelaytime: {
      // 最大延迟时间
      type: Number,
      default: 300
    },
    minintervaltime: {
      // 最小间隔时间
      type: Number,
      default: 300
    },
    durationtime: {
      // 持续时间
      type: Number,
      default: 10
    },
    exportdelaytime: {
      // 输出延迟时间
      type: Number,
      default: 0
    },
    devloop: {
      type: String
    },
    mapsign: {
      // 地图标识
      signflag: {
        type: Boolean
      },
      signtype: {
        type: Number,
        enum: [0, 1, 2] // 0:图标,1:线,2:区域
      },
      signvalue: {
        type: String
      }
    },
    alarmaffirm: {
      // 报警确认
      affirmflag: {
        type: Boolean
      },
      // 自动确认
      autoaffirm: {
        status: {
          type: Boolean
        },
        intervaltime: {
          type: Number // 时间间隔
        }
      },
      // 手动一级确认
      handaffirm: {
        status: {
          type: Boolean
        }
      },
      // 手动二级确认2.0新增字段
      handaffirm2: {
        status: {
          type: Boolean
        }
      }
    },
    subtype: String, // 报警子类型2.0新增字段
    // 是否进行了联动配置2.0新增
    actionConfig: Boolean,
    // 绑定资源
    res: {
      type: [Schema.Types.ObjectId],
      ref: 'Resource'
    },
    pinyin: String,
    shareServer: String, // 共享服务器
    shareType: String, // 共享类型
    nodeId: String, // 分享的节点ID
    gbPlaDevIp: String, // 国际设备IP 或者平台IP
    gbPlaDevPort: String, // 国际设备或者平台的PORT
    gbDevId: String, // 国际设备编码
    gbParentDevId: String, // 国际设备父节点编码
    gbPlaNvrId: String, // 国标平台或者NVR国标编码
    // 视频结构化
    videoStructure: {
      // 视频结构化服务器
      structureServer: {
        type: Schema.Types.ObjectId,
        ref: 'structureserver'
      },
      // 分析状态
      analysisStatus: {
        type: Number,
        default: 0,
        // 0 未开始 | 1 分析中 | 2 已停止 | 3 解码失败
        validate: val => Object.values(AnalysisStatusCodeEnum).includes(val)
      },
      // 通道id，是视频结构化服务器中绑定该资源返回的通道id, 0 代表已从结构化服务器中解绑
      channelId: {
        type: Number,
        default: -1
      },
      // rtmp地址
      rtmp: {
        type: String,
        default: ''
      }
    },
    updateTime: String, // 国创消防更新时间
    fireBuildingStructureId: Number, // 国创消防建筑id
    fireBuildingStructureName: String, // 国创消防建筑名称
    fireControlId: Number // 国创消防资源id
  },
  { timestamps: true }
)

// static methods
ResourceSchema.statics = {
  /**
   * 判断某个资源(rid)有已经分配给某机构
   * @param rootorg 该机构的根机构对象
   * @return true:已经分配 false：未分配过
   */
  isDistributed: async function (rid, rootorg) {
    // 查找根机构id
    const count = await OrgRes.count({
      resource: rid,
      rootorg: rootorg._id
    }).exec()
    return !!count
  },
  // 0：视频通道 1：报警输入 2：输出通道 3：对讲通道 4：门禁通道
  insertPatch: async function (newDevice, countObj, Rtsp, gbDevId) {
    // const level = (await AlarmLevel.findOne({ level: 1 }, '_id').lean().exec())._id + ''
    const { res } = require('../../platform/generateNum')

    const level = 1
    const alarmTypeRes = await AlarmType.findOne({}, '_id')
      .lean()
      .exec()
    let alarmtype
    alarmTypeRes && (alarmtype = alarmTypeRes._id)
    const alarmTemplateRes = await AlarmTimeTemplate.findOne({}, '_id')
      .lean()
      .exec()
    let alarmtemplate
    alarmTemplateRes && (alarmtemplate = alarmTemplateRes._id)
    const docs = []
    let id
    let videos = []
    const {
      ipcount = 0,
      defenseicount = 0,
      defenseocount = 0,
      intercomcount = 0,
      decodecount = 0,
      voicecount = 0,
      encodingcount = 0,
      videoinputcount = 0,
      entranceguardcount = 0,
      jointinputcount = 0
    } = countObj
    for (let i = 1; i <= ipcount; i++) {
      let name = ''
      if (ipcount !== 1) {
        name = `${newDevice.name}_视频通道_通道${i}`
      } else {
        name = newDevice.name
      }
      id = Rtsp.getUnusedIds()
      videos.push({
        eid: newDevice._id,
        chan: i,
        type: 0,
        ip: newDevice.ip,
        port: newDevice.cport,
        rtsp: {
          main: `rtsp://ip:port/main/id=${id}`,
          sub: `rtsp://ip:port/sub/id=${id}`
        },
        intelligent: newDevice.intelligent,
        name: name,
        pinyin: tool.transferPinyin(name)
      })
    }
    if (alarmtemplate) {
      for (let i = 1; i <= defenseicount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          type: newDevice.bigtype === 0 ? 1 : newDevice.bigtype === 1 ? 9 : newDevice.bigtype === 5 ? 7 : newDevice.bigtype === 7 ? 11 : 1,
          ip: newDevice.ip,
          port: newDevice.cport,
          level,
          alarmtype,
          alarmtemplate,
          intelligent: newDevice.intelligent,
          name: newDevice.bigtype === 0 ? `${newDevice.name}_报警输入_通道${i}` : `${newDevice.name}_报警防区_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_报警输入_通道${i}`)
        })
      }
      for (let i = 1; i <= defenseocount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          ip: newDevice.ip,
          port: newDevice.cport,
          type: newDevice.bigtype === 0 ? 2 : newDevice.bigtype === 1 ? 10 : newDevice.bigtype === 5 ? 8 : newDevice.bigtype === 7 ? 12 : 2,
          level,
          alarmtype,
          alarmtemplate,
          intelligent: newDevice.intelligent,
          name: `${newDevice.name}_报警输出_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_报警输出_通道${i}`)
        })
      }
    } else {
      for (let i = 1; i <= defenseicount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          type: newDevice.bigtype === 0 ? 1 : newDevice.bigtype === 1 ? 9 : newDevice.bigtype === 5 ? 7 : newDevice.bigtype === 7 ? 11 : 1,
          ip: newDevice.ip,
          port: newDevice.cport,
          level,
          alarmtype,
          intelligent: newDevice.intelligent,
          name: newDevice.bigtype === 0 ? `${newDevice.name}_报警输入_通道${i}` : `${newDevice.name}_报警防区_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_报警输入_通道${i}`)
        })
      }
      for (let i = 1; i <= defenseocount; i++) {
        docs.push({
          eid: newDevice._id,
          chan: i,
          ip: newDevice.ip,
          port: newDevice.cport,
          type: newDevice.bigtype === 0 ? 2 : newDevice.bigtype === 1 ? 10 : newDevice.bigtype === 5 ? 8 : newDevice.bigtype === 7 ? 12 : 2,
          level,
          alarmtype,
          intelligent: newDevice.intelligent,
          name: `${newDevice.name}_报警输出_通道${i}`,
          pinyin: tool.transferPinyin(`${newDevice.name}_报警输出_通道${i}`)
        })
      }
    }
    for (let i = 1; i <= intercomcount; i++) {
      docs.push({
        eid: newDevice._id,
        chan: i,
        ip: newDevice.ip,
        port: newDevice.cport,
        type: 3,
        intelligent: newDevice.intelligent,
        name: `${newDevice.name}_设备对讲_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_设备对讲_通道${i}`)
      })
    }
    for (let i = 1; i <= entranceguardcount; i++) {
      docs.push({
        eid: newDevice._id,
        ip: newDevice.ip,
        port: newDevice.cport,
        chan: i,
        type: 4,
        intelligent: newDevice.intelligent,
        name: `${newDevice.name}_门禁通道_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_门禁通道_通道${i}`)
      })
    }
    for (let i = 1; i <= decodecount; i++) {
      docs.push({
        eid: newDevice._id,
        ip: newDevice.ip,
        port: newDevice.cport,
        chan: i,
        type: 5,
        intelligent: newDevice.intelligent,
        name: `${newDevice.name}_解码通道_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_解码通道_通道${i}`)
      })
    }
    for (let i = 1; i <= voicecount; i++) {
      docs.push({
        eid: newDevice._id,
        ip: newDevice.ip,
        port: newDevice.cport,
        chan: i,
        type: 6,
        intelligent: newDevice.intelligent,
        name: `${newDevice.name}_音频通道_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_音频通道_通道${i}`)
      })
    }
    for (let i = 1; i <= encodingcount; i++) {
      docs.push({
        eid: newDevice._id,
        ip: newDevice.ip,
        port: newDevice.cport,
        chan: i,
        type: 7,
        intelligent: newDevice.intelligent,
        name: `${newDevice.name}_编码通道_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_编码通道_通道${i}`)
      })
    }
    for (let i = 1; i <= videoinputcount; i++) {
      docs.push({
        eid: newDevice._id,
        chan: i,
        type: 8,
        ip: newDevice.ip,
        port: newDevice.cport,
        intelligent: newDevice.intelligent,
        name: `${newDevice.name}_视频输入_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_视频输入_通道${i}`)
      })
    }
    for (let i = 1; i <= jointinputcount; i++) {
      docs.push({
        eid: newDevice._id,
        chan: i,
        type: 15,
        ip: newDevice.ip,
        port: newDevice.cport,
        name: `${newDevice.name}_输入源_通道${i}`,
        pinyin: tool.transferPinyin(`${newDevice.name}_输入源_通道${i}`)
      })
    }
    try {
      // ipc/nvr视频通道添加国标字段
      videos = await res(videos, gbDevId)
      await this.insertMany(docs.concat(videos))
    } catch (err) {
      throw err
    }
  }
}

mongoose.model('Resource', ResourceSchema)
