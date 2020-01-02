/**
 * 设备信息类
 * @time 2017-06-08
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DeviceSchema = new Schema(
  {
    bigtype: {
      // 设备大类   0：视频设备1：报警主机2：门禁设备3：ip对讲4：巡更设备5：解码器6：网络键盘,7：消防主机, 8:智能交通, 9:拼接控制器, 10:短信猫, 11: 对讲设备
      type: Number,
      default: 0,
      min: 0,
      max: 11,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    },
    type: {
      // 设备类型
      type: String,
      default: 'ipc',
      enum: [
        'ipc',
        'nvr',
        'softDecoder',
        'hardDecoder', // 硬解码器
        'doorAccess',
        'ticketGate',
        'fire',
        'keyboard',
        'alarmHost',
        'fingerPrint',
        'talkServer',
        'traffic',
        'stictchingCon',
        'alarmBox',
        'alarmPillar',
        'sim', // 短信猫 type
        'intercom' // 对讲设备
      ]
    },
    manufacturer: {
      type: String,
      default: 'dahua'
      // enum: ['dahua', 'hikvision', 'bstar', 'onvif','lida', "guangtuo", 'jindi', 'kdfire']
    }, // 厂商
    model: String, // 设备型号
    series: String, // 设备型号
    ip: {
      // ip地址  广拓报警主机 服务器地址 | 短信猫接入方式（COM）
      type: String
      // required: true
    },
    // accessWay: {
    //   type: String,
    //   default: 'COM',
    //   enum: ['COM']
    // }, // 短信猫接入方式 COM
    accessServerIp: String, // 解码器 接入服务器ip
    intranetIp: String, // 内网ip | 广拓报警主机 服务器地址
    intranetPort: String, // 广拓报警主机 服务器端口
    adapterIp: String, // 适配器ip
    adapterPort: Number, // 适配器端口
    cport: Number, // 控制端口 | 广拓报警主机端口 | 短信猫端口
    dport: Number, // 数据端口
    protocol: {
      type: String,
      default: 'tcp',
      enum: ['tcp', 'udp', 'rtp', 'rtsp']
    }, // 传输协议
    username: {
      type: String
      // required: true
    }, // 用户名
    password: {
      type: String
      // required: true
    }, // 密码
    name: {
      // 设备名称
      type: String
      // required: true
    },
    ipcount: {
      type: Number,
      default: 0
    }, // ip通道数
    defenseicount: {
      type: Number,
      default: 0
    }, // 报警输入数量
    defenseocount: {
      type: Number,
      default: 0
    }, // 报警输出数量
    intercomcount: {
      type: Number,
      default: 0
    }, // 设备对讲数量
    decodecount: {
      type: Number,
      default: 0
    }, // 解码通道数
    voicecount: {
      type: Number,
      default: 0
    }, // 音频通道数
    encodingcount: {
      type: Number,
      default: 0
    }, // 编码通道数
    videoinputcount: {
      type: Number,
      default: 0
    }, // 视频输入通道数
    entranceguardcount: {
      type: Number,
      default: 0
    }, // 门禁通道数
    jointinputcount: {
      type: Number
    }, // 拼接控制器输入通道数
    status: {
      // 状态（false：离线 true：在线）
      type: Boolean,
      default: false // 默认离线添加
    },
    oid: {
      // 所属机构
      type: Schema.Types.ObjectId,
      ref: 'Org'
    },
    intelligent: {
      // 智能级别 //废物(在智能报警管理配置)
      type: Number,
      default: 0,
      required: true,
      enum: [0, 1, 2, 3] // 0：不支持智能 1普通智能 2人脸分析 3车辆识别
    },
    intelligentalarm: {
      // 智能报警显示
      type: Boolean,
      default: false
    },
    devicealarm: {
      // 设备报警显示
      type: Boolean,
      default: false
    },
    monitorypointalarm: {
      // 监控点报警显示
      type: Boolean,
      default: false
    },
    connMode: {
      type: String,
      default: 'active',
      enum: ['active', 'passive']
    },
    mainStream: {
      // 主码流url
      type: String,
      default: ''
    },
    subStream: {
      // 子码流url
      type: String,
      default: ''
    },
    deviceid: {
      // 设备编号
      type: Number
    },
    gridinstartnum: {
      type: Number // 消防主机防区输入起始编号
    },
    gridoutstartnum: {
      type: Number // 消防主机防区输出起始编号
    },
    shareServer: String, // 共享服务器
    shareType: String, // 共享类型
    nodeId: String, // 国标节点Id
    OnlineRateStatus: {
      type: Number, // 在线率是否异常 1: 正常 2：非正常 3：无记录
      default: 3
    },
    exid: {
      // 所属维修机构
      type: Schema.Types.ObjectId,
      ref: 'DeviceExtend'
    },
    alarmTesponseTime: {
      // 报警相应时间--消防主机
      type: Number,
      max: 300,
      min: 0
    },
    alarmMaximumQuantity: {
      // 报警最大数量--消防主机
      type: Number
    },
    deviceStatus: {
      // 设备启用/停用状态
      type: Number,
      required: true,
      default: 1,
      max: 1,
      min: 0,
      enum: [0, 1] // 1: 启用 0: 停用
    }
  },
  { timestamps: true }
)

/**
 * Methods
 */
DeviceSchema.methods = {}
mongoose.model('Device', DeviceSchema)
