/*
 * @Author: zhangminbo
 * @Date: 2018-09-05 19:01:57
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-11 10:34:26
 * @Last Modified by: dfk
 * @Last Modified time: 2019-09-22 16:47:51
 */
/**
 * Populate DB with admin user data on server start
 */

'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Org = mongoose.model('Org')
const Sysparamters = mongoose.model('Sysparamters')
const FireAlarmConf = require('mongoose').model('fireAlarmConf')
const Dict = mongoose.model('Dict')
const Action = mongoose.model('Action')
const PlatformServer = mongoose.model('PlatformServer')
const PlanTemplate = mongoose.model('PlanTemplate')
const FaceAlgorithm = mongoose.model('FaceAlgorithm')
const Strategy = require('mongoose').model('Strategy')
const AlarmType = require('mongoose').model('alarmType')
const AlarmLevel = require('mongoose').model('alarmLevel')
const AlarmTimeTemplate = require('mongoose').model('alarmTimeTemplate')
const Role = mongoose.model('Role')
const Model = mongoose.model('Model')
const Icon = mongoose.model('Icon')
const StructureParam = mongoose.model('structureparam')
const { VideoClassCodeEnum, StartCodeEnum, DrawRectangleCodeEnum } = require('../api/structure/structure.enum')
const fs = require('fs')
const path = require('path')
const config = require('../../config')
const _ = require('lodash')
const FaceParameter = mongoose.model('FaceParameter')
const Resource = mongoose.model('Resource')
const VerificationScore = mongoose.model('verificationscore')
// const Property = mongoose.model('ResProperty')
// const TYPE = 0 // 视频资源type为0
// 更新旧的角色和用户数据
Role.find({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!_.isEmpty(data)) {
    data = JSON.parse(JSON.stringify(data))
    const roleIds = []
    data.forEach(item => {
      if (_.has(item, 'roleName')) {
        roleIds.push(item._id)
      }
    })
    if (!_.isEmpty(roleIds)) {
      Role.deleteMany({ _id: { $in: roleIds } }, (err, data) => {
        if (err) {
          throw err
        }
        console.log('finished del old roles data')
      })
    }
  }
})
// 删除旧的用户数据
User.find({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!_.isEmpty(data)) {
    data = JSON.parse(JSON.stringify(data))
    const userIds = []
    data.forEach(item => {
      if (_.has(item, 'orgId')) {
        userIds.push(item._id)
      }
    })
    if (!_.isEmpty(userIds)) {
      User.deleteMany({ _id: { $in: userIds } }, (err, data) => {
        if (err) {
          throw err
        }
        console.log('finished del old users data')
      })
    }
  }
})
Role.find({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!_.isEmpty(data)) {
    if (!_.has(data[0], 'order')) {
      for (let i in data) {
        data[i].order = Number(i) + 1
        data[i].loginType = 1
        data[i].save()
      }
    }
  }
})
User.find({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!_.isEmpty(data)) {
    for (let i in data) {
      data[i].order = Number(i) + 1
      data[i].save()
    }
  }
})
// 添加默认角色数据
const actions = require('./actions.json')
const actIds = actions.map(item => {
  return item._id
})
const roleObj = {
  _id: '5be27279e74ee9376c681111',
  name: '超级管理员',
  actions: actIds,
  order: 1,
  loginType: 1
}
Role.findOne({ _id: '5be27279e74ee9376c681111' }, (err, data) => {
  if (err) {
    throw err
  }
  if (!data) {
    Role.create(roleObj, (err, data) => {
      if (err) {
        throw err
      }
      console.log('finished init Role')
    })
  } else {
    Role.findByIdAndUpdate(roleObj._id, { actions: actIds }, (err, data) => {
      if (err) {
        throw err
      }
      console.log('finished update Role')
    })
  }
})
// 添加默认用户数据
const userObj = {
  _id: '5be27d69e74eeee76c682222',
  name: 'admin',
  pwd: '21232f297a57a5a743894a0e4a801fc3', // admin
  realName: '初始账户',
  role: roleObj._id,
  level: 1,
  exptime: -1,
  order: 1
}
User.findOne({ _id: '5be27d69e74eeee76c682222' }, (err, data) => {
  if (err) {
    throw err
  }
  if (!data) {
    User.create(userObj, (err, data) => {
      if (err) {
        throw err
      }
      console.log('finished init User')
    })
  }
})
Action.remove(function (err) {
  if (err) {
    throw err
  }
  Action.create(require('./actions.json'), function () {
    console.log('finished init Action')
  })
})
// 初始化抓拍参数
FaceParameter.findOne({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!data) {
    const obj = {
      pattern: 'face',
      output: 1,
      passby: true,
      saveTime: 30,
      capacity: 3000
    }
    FaceParameter.create(obj, (err, data) => {
      if (err) {
        throw err
      }
    })
  }
})
Org.find({ type: 0, isroot: true }, function (err, org) {
  if (err) {
    throw err
  }
  if (!org.length) {
    Org.create(
      {
        name: '根节点-现场',
        type: 0,
        order: 0,
        isroot: true
      },
      function (err, orgData) {
        if (err) {
          throw err
        }
        require('../api/platform/generateNum').orgAndresInitGbDeviceId()
      }
    )
  }
  // else {
  //   // initUser(org[0]._id)
  //   // require('../api/platform/generateNum').orgAndresInitGbDeviceId()
  // }
})

Org.find(
  {
    type: 1,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-车辆',
          type: 1,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(1)')
        }
      )
    }
  }
)

Org.find(
  {
    type: 2,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-人脸',
          type: 2,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(2)')
        }
      )
    }
  }
)

Org.find(
  {
    type: 3,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-单兵',
          type: 3,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(3)')
        }
      )
    }
  }
)

Org.find(
  {
    type: 4,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-巡更点位',
          type: 4,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(4)')
        }
      )
    }
  }
)

Org.find(
  {
    type: 5,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-应急预案',
          type: 5,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(5)')
        }
      )
    }
  }
)
Org.find(
  {
    type: 6,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-人脸抓拍',
          type: 6,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(6)')
        }
      )
    }
  }
)
Org.find(
  {
    type: 7,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '组织机构', // 班组列表
          type: 7,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(7)')
        }
      )
    } else {
      if (org[0].name !== '组织机构') {
        Org.update({
          type: 7,
          isroot: true
        }, {name: '组织机构'}, function () {
          console.log('班组列表 名称修改为 组织机构')
        })
      }
    }
  }
)
// Org.find({ type: 10, isroot: true }, (err, res) => {
//   if (err) {
//     throw err
//   }
//   if (!res.length) {
//     Org.create(
//       {
//         name: '人民大学',
//         type: 10,
//         isroot: true
//       },
//       (errs, response) => {
//         if (errs) {
//           console.log('初始化插入大学根机构错误')
//         } else {
//           console.log('初始化插入大学根机构成功')
//         }
//       }
//     )
//   }
// })
Org.find(
  {
    type: 8,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-视频结构化',
          type: 8,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(8)')
        }
      )
    }
  }
)

Org.find(
  {
    type: 9,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '根节点-电动车',
          type: 9,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(9)')
        }
      )
    }
  }
)
Org.find(
  {
    type: 10,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '默认根机构',
          type: 10,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(10)')
        }
      )
    }
  }
)
Org.find(
  {
    type: 11,
    isroot: true
  },
  function (err, org) {
    if (err) {
      throw err
    }
    if (!org.length) {
      Org.create(
        {
          name: '默认设备根机构',
          type: 11,
          order: 0,
          isroot: true
        },
        function () {
          console.log('finished populating org(11)')
        }
      )
    }
  }
)

StructureParam.find({}, (err, res) => {
  if (err) {
    throw err
  }
  if (!res.length) {
    StructureParam.create({
      startCode: StartCodeEnum.START,
      codeClass: VideoClassCodeEnum.SUPERPOSE_ONECLASS_ZH_CODE,
      drawRectangle: DrawRectangleCodeEnum.DRAW,
      saveTime: 30
    })
  }
})

Sysparamters.find({}, function (err, sys) {
  if (err) {
    throw err
  }
  if (!sys.length) {
    Sysparamters.create(
      {
        name: '园区综合性管理平台',
        titlecolor: '#171717',
        titlefont: '{"font":"微软雅黑","size":"16","fontColor":"#FFFFFF","fontItalic":"normal","fontRegular":"normal"}',
        alarmlog: 120,
        equipmentlog: 120,
        operationlog: 120,
        configlog: 120,
        transport: 'TCP',
        picture: 'auto',
        screenshot: 'JPG',
        videotape: 'AVI',
        creatdbtime: Math.floor(new Date() / 1000)
      },
      function () {
        require('./initAudioFile') // 初始化报警音频文件（文件目录在public/alarmAudio）
        console.log('finished init Sysparamters')
      }
    )
  } else {
    require('./initAudioFile') // 初始化报警音频文件（文件目录在public/alarmAudio）
  }
})

const dictDatas = [
  {
    code: '4',
    name: '小汽车',
    type: 'vehicle'
  },
  {
    code: '5',
    name: '三轮车',
    type: 'vehicle'
  },
  {
    code: '6',
    name: '巴士车',
    type: 'vehicle'
  },
  {
    code: '7',
    name: '面包车',
    type: 'vehicle'
  },
  {
    code: '8',
    name: '卡车',
    type: 'vehicle'
  },
  {
    code: '1',
    name: '布控车辆',
    type: 'vehicleListType'
  },
  {
    code: '1',
    name: '精准布控',
    type: 'defenseType'
  },
  {
    code: '2',
    name: '黑名单布控',
    type: 'defenseType'
  },
  {
    code: '0',
    name: '陌生车辆',
    type: 'vehicleListType'
  },
  {
    code: '2',
    name: '白名单',
    type: 'vehicleListType'
  },
  {
    code: '3',
    name: '黑名单',
    type: 'vehicleListType'
  },
  {
    code: '4',
    name: '正常车辆',
    type: 'vehicleListType'
  },
  {
    code: '3',
    name: '白名单布控',
    type: 'defenseType'
  },
  {
    type: 'alarmType',
    code: '1',
    name: '车辆布控'
  },
  {
    type: 'alarmType',
    code: '2',
    name: '人员布控'
  },
  {
    type: 'alarmType',
    name: '黑名单',
    code: '3'
  },
  {
    type: 'vehicleColor',
    code: '1',
    name: '黑色'
  },
  {
    type: 'vehicleColor',
    code: '2',
    name: '蓝色'
  },
  {
    type: 'vehicleColor',
    code: '4',
    name: '绿色'
  },
  {
    type: 'vehicleColor',
    code: '5',
    name: '灰色'
  },
  {
    type: 'vehicleColor',
    code: '6',
    name: '白色'
  },
  {
    type: 'vehicleColor',
    code: '7',
    name: '红色'
  },
  {
    type: 'vehicleColor',
    code: '8',
    name: '黄色'
  },
  {
    type: 'vehicleColor',
    code: '9',
    name: '粉色'
  },
  {
    type: 'vehicleColor',
    code: '10',
    name: '紫色'
  },
  {
    type: 'vehicleColor',
    code: '11',
    name: '青色'
  },
  {
    type: 'vehicleColor',
    code: '12',
    name: '深灰色'
  },
  {
    type: 'vehicleColor',
    code: '13',
    name: '金色'
  }
]

Dict.find({}, function (err, sys) {
  if (err) {
    throw err
  }
  if (!sys.length) {
    Dict.create(dictDatas, function () {
      console.log('finished init Dict')
    })
  }
})
// 初始化计划模板
PlanTemplate.find({}, function (err, result) {
  if (err) {
    throw err
  }
  if (!result.length) {
    PlanTemplate.insertMany([
      {
        name: '全天',
        elements: [
          {
            week: 1,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 2,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 3,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 4,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 5,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 6,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 7,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 8,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          }
        ]
      },
      {
        name: '工作时间',
        elements: [
          {
            week: 1,
            timeList: [
              {
                endTime: 72000,
                beginTime: 28800
              }
            ]
          },
          {
            week: 2,
            timeList: [
              {
                endTime: 72000,
                beginTime: 28800
              }
            ]
          },
          {
            week: 3,
            timeList: [
              {
                endTime: 72000,
                beginTime: 28800
              }
            ]
          },
          {
            week: 4,
            timeList: [
              {
                endTime: 72000,
                beginTime: 28800
              }
            ]
          },
          {
            week: 5,
            timeList: [
              {
                endTime: 72000,
                beginTime: 28800
              }
            ]
          },
          {
            week: 6,
            timeList: []
          },
          {
            week: 7,
            timeList: []
          },
          {
            week: 8,
            timeList: []
          }
        ]
      },
      {
        name: '工作日24小时',
        elements: [
          {
            week: 1,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 2,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 3,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 4,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 5,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 6,
            timeList: []
          },
          {
            week: 7,
            timeList: []
          },
          {
            week: 8,
            timeList: []
          }
        ]
      },
      {
        name: '节假日',
        elements: [
          {
            week: 1,
            timeList: []
          },
          {
            week: 2,
            timeList: []
          },
          {
            week: 3,
            timeList: []
          },
          {
            week: 4,
            timeList: []
          },
          {
            week: 5,
            timeList: []
          },
          {
            week: 6,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 7,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          },
          {
            week: 8,
            timeList: [
              {
                beginTime: 0,
                endTime: 86400
              }
            ]
          }
        ]
      }
    ])
  }
})
FaceAlgorithm.find({}, function (err, result) {
  if (err) {
    throw err
  }
  if (!result.length) {
    FaceAlgorithm.insertMany([
      {
        loginApi: {
          url: '/auth/login',
          method: 'POST',
          headers: {
            'User-Agent': 'Koala Admin'
          }
        },
        createUserApi: {
          url: '/subject',
          method: 'POST'
        },
        updateUserApi: {
          url: '/subject/:id',
          method: 'PUT'
        },
        deleteUserApi: {
          url: '/subject/:id',
          method: 'DELETE'
        },
        historyApi: {
          url: '/event/events',
          method: 'GET'
        },
        uploadApi: {
          url: '/subject/photo',
          method: 'POST'
        },
        timeout: 1000,
        type: 'BSR-KS'
      }
    ])
  }
})

FireAlarmConf.find({}, function (err, sys) {
  if (err) {
    throw err
  }
  if (!sys.length) {
    FireAlarmConf.create(
      {
        ismap: true
      },
      function () {
        console.log('finished init FireAlarmConf')
      }
    )
  }
})

Strategy.find({}, function (err, act) {
  if (err) {
    throw err
  }
  if (!act.length) {
    Strategy.create(
      {
        passwordType: 'low',
        loginCount: 5,
        lockTime: 5,
        initPassword: 'admin'
      },
      function () {
        console.log('finished init Strategy')
      }
    )
  }
})

AlarmType.find({}, function (err, data) {
  if (err) {
    throw err
  }
  if (!data.length) {
    const arr = []
    for (var i = 1; i < 10; i++) {
      const temp = {
        name: '分类' + i
      }
      temp.actionRule = []
      for (var j = 0; j < 4; j++) {
        temp.actionRule.push({
          status: false,
          actionVideo: false,
          endTime: 86399,
          beginTime: 0,
          actionOutPut: false
        })
      }
      arr.push(temp)
    }
    AlarmType.insertMany(arr, function () {
      console.log('finished init AlarmType')
    })
  }
})
AlarmLevel.find({}, function (err, data) {
  if (err) {
    throw err
  }
  if (!data.length) {
    const arr = []
    for (var i = 1; i < 10; i++) {
      arr.push({
        level: i
      })
    }
    AlarmLevel.insertMany(arr, function () {
      console.log('finished init AlarmLevel')
    })
  }
})
PlatformServer.find({ type: 'loc' }, function (err, data) {
  if (err) {
    throw err
  }
  if (!data.length) {
    PlatformServer.create(
      {
        name: '设备根节点',
        type: 'loc',
        userName: '',
        pwd: ''
      },
      function () {
        console.log('finished init PlatformServer')
      }
    )
  }
})
AlarmTimeTemplate.find({}, function (err, data) {
  if (err) {
    throw err
  }
  if (!data.length) {
    AlarmTimeTemplate.insertMany(
      [
        {
          name: '全天24小时',
          elements: {
            week8: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week7: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week6: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week5: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week4: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week3: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week2: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week1: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ]
          }
        },
        {
          name: '工作日8小时',
          elements: {
            week5: [
              {
                endTime: 64800,
                beginTime: 32400
              }
            ],
            week4: [
              {
                endTime: 64800,
                beginTime: 32400
              }
            ],
            week3: [
              {
                endTime: 64800,
                beginTime: 32400
              }
            ],
            week2: [
              {
                endTime: 64800,
                beginTime: 32400
              }
            ],
            week1: [
              {
                endTime: 64800,
                beginTime: 32400
              }
            ]
          }
        },
        {
          name: '工作日24小时',
          elements: {
            week5: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week4: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week3: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week2: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ],
            week1: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ]
          }
        },
        {
          name: '节假日',
          elements: {
            week8: [
              {
                endTime: 86400,
                beginTime: 0
              }
            ]
          }
        }
      ],
      function () {
        console.log('finished init AlarmTimeTemplate')
      }
    )
  }
})

// 更新初始模型库
let modelList = require('./map3DModel/model.json')
const modelPath = path.resolve(__dirname, './map3DModel/file')
const modelFiles = fs.readdirSync(path.resolve(__dirname, modelPath))

modelFiles.forEach(file => {
  fs.readFile(modelPath + '/' + file, (err, originBuffer) => {
    if (err) {
      console.log(file)
    } else {
      let dir = config.backend.fileDirs.modelPictureDir
      if (file.split('.').indexOf('gltf') === 1) {
        dir = config.backend.fileDirs.modelFileDir
      }
      if (!fs.existsSync(`${dir}/${file}`)) {
        fs.writeFile(dir + '/' + file, originBuffer, err => {
          if (err) {
            console.log(file)
          }
        })
      }
    }
  })
})

modelList.map(async item => {
  item.files.forEach(async file => {
    file.path = file.name === '' ? '' : '/image/model/file/' + file.name
  })
  item.picture.path = item.picture.name === '' ? '' : '/image/model/picture/' + item.picture.name
  const model = await Model.findById(item._id, 'oid name')
    .lean()
    .exec()
  if (_.isNull(model)) {
    await Model.findByIdAndUpdate(item._id, item, { upsert: true }).exec()
  } else {
    const modelWithOid = await Model.find({ oid: model.oid }, 'default name')
      .lean()
      .exec()
    // 这里判断内置的模型是否已经为默认，true 为默认的不用更改，false 不是默认的，则将内置的模型的 default 改为 false
    const flag = modelWithOid.some(elements => elements.default && item._id + '' === elements._id + '')
    if (flag) {
      await Model.findByIdAndUpdate(item._id, item, { upsert: true })
        .lean()
        .exec()
    } else {
      item.default = false
      await Model.findByIdAndUpdate(item._id, item, { upsert: true })
        .lean()
        .exec()
    }
  }
})

// 更新初始图标库
let iconList = require('./map2DIcon/icon.json')
const iconPath = path.resolve(__dirname, './map2DIcon/file')
const iconFiles = fs.readdirSync(path.resolve(__dirname, iconPath))
const iconDir = config.backend.fileDirs.iconPictureDir

iconFiles.forEach(file => {
  fs.readFile(iconPath + '/' + file, (err, originBuffer) => {
    if (err) {
      console.log(file)
    } else {
      if (!fs.existsSync(`${iconDir}/${file}`)) {
        fs.writeFile(iconDir + '/' + file, originBuffer, err => {
          if (err) {
            console.log(file)
          }
        })
      }
    }
  })
})

iconList.map(async item => {
  item.files.forEach(async file => {
    file.path = file.name === '' ? '' : '/image/icon/picture/' + file.name
  })
  const icon = await Icon.findById(item._id, 'oid name')
    .lean()
    .exec()
  if (_.isNull(icon)) {
    await Icon.findByIdAndUpdate(item._id, item, { upsert: true }).exec()
  } else { // 此处代码多余先注释掉
    // const iconsWithOid = await Icon.find({ oid: icon.oid }, 'default name')
    //   .lean()
    //   .exec()
    // // 这里判断内置的图标是否已经为默认，true 为默认的不用更改，false 不是默认的，则将内置的图标的 default 改为 false
    // const flag = iconsWithOid.some(elements => elements.default && item._id + '' === elements._id + '')
    // if (flag) {
    //   await Icon.findByIdAndUpdate(item._id, item, { upsert: true })
    //     .lean()
    //     .exec()
    // } else {
    //   item.default = false
    //   await Icon.findByIdAndUpdate(item._id, item, { upsert: true })
    //     .lean()
    //     .exec()
    // }
  }
})

// 对旧的数据点位数据进行更新
Resource.aggregate(
  [
    {
      $match: {
        point: { $exists: true },
        'point.mid': null
      }
    },
    {
      $group: {
        _id: {
          type: '$type',
          monitortype: '$monitortype'
        },
        resId: { $push: '$_id' }
      }
    },
    {
      $project: {
        _id: 0,
        type: {
          $concat: [{ $toString: '$_id.type' }, { $toString: '$_id.monitortype' }]
        },
        resId: 1
      }
    }
  ],
  async (err, resPoint) => {
    if (err) {
      console.log(err)
    }
    Promise.all(
      resPoint.map(item => {
        Icon.findOne({ oid: item.type, default: true }, (err, icon) => {
          if (err) {
            console.log(err)
          } else {
            if (icon) {
              const ids = _.map(item.resId, item => item + '')
              Resource.updateMany({ _id: { $in: ids } }, { 'point.mid': icon._id.toString() }).exec()
            }
          }
        })
      })
    )
  }
)

// 初始化 报警延时
const AlarmDelay = require('mongoose').model('alarmDelay')
AlarmDelay.find({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!data.length) {
    AlarmDelay.create(
      {
        delay: 30
      },
      () => {
        console.log('finished init alarmDelay')
      }
    )
  }
})
// 修改旧报警输入数据，增加subtype字段
Resource.find({ type: 1, subtype: { $exists: false } }, (err, data) => {
  if (err) {
    throw err
  }
  if (data.length) {
    for (let i in data) {
      data[i].subtype = 'helpSeek'
      data[i].save()
    }
  }
})
// 修改旧报警主机报警输入数据，增加subtype字段
Resource.find({ type: 9, subtype: { $exists: false } }, (err, data) => {
  if (err) {
    throw err
  }
  if (data.length) {
    for (let i in data) {
      data[i].subtype = 'perimeterAlarm'
      data[i].save()
    }
  }
})
// 修改旧消防主机输入防区数据，增加subtype字段
Resource.find({ type: 11, subtype: { $exists: false } }, (err, data) => {
  if (err) {
    throw err
  }
  if (data.length) {
    for (let i in data) {
      data[i].subtype = 'smoke'
      data[i].save()
    }
  }
})
// 修改旧监控点报警数据，加subtype字段
const MonitoryPointAlarm = mongoose.model('MonitoryPointAlarm')
MonitoryPointAlarm.find({ subtype: { $exists: false } }, (err, data) => {
  if (err) {
    throw err
  }
  if (data.length) {
    for (let i in data) {
      data[i].subtype = 'alarmMoveSense'
      data[i].save()
    }
  }
})
// 修改旧智能报警数据，加subtype字段
const IntelligentAlarm = mongoose.model('IntelligentAlarm')
IntelligentAlarm.find({ subtype: { $exists: false } }, (err, data) => {
  if (err) {
    throw err
  }
  if (data.length) {
    for (let i in data) {
      data[i].subtype = 'perimeter'
      data[i].save()
    }
  }
})

// 初始化(人车同检查)核验分数
VerificationScore.find({}, (err, data) => {
  if (err) {
    throw err
  }
  if (!data.length) {
    VerificationScore.create(
      {
        score: config.backend.intelligentTraffic.score,
        days: config.backend.intelligentTraffic.days
      },
      () => {
        console.log('finished init verification score')
      }
    )
  }
})

// 运维地址配置格式化
let fatOpsConfig = async () => {
  function getIPAdress () {
    var interfaces = require('os').networkInterfaces()
    for (var devName in interfaces) {
      var iface = interfaces[devName]
      for (var i = 0; i < iface.length; i++) {
        var alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
  }
  try {
    const opsConfig = mongoose.model('opsConfig')
    let docArr = await opsConfig.find()
    let opsIp = ''
    if (process.env.operationUrl === '127.0.0.1') {
      opsIp = `${getIPAdress()}:${process.env.operationPort}`
    } else {
      opsIp = `${process.env.operationUrl}:${process.env.operationPort}`
    }
    if (docArr.length > 1) {
      await opsConfig.remove({})
      let opsDoc = new opsConfig({ opsIp: opsIp })
      opsDoc.save()
    } else if (docArr.length === 0) {
      let opsDoc = new opsConfig({ opsIp: opsIp })
      opsDoc.save()
    } else {
      if (process.env.operationUrl === '127.0.0.1') {
        return
      }
      if (docArr[0].opsIp !== opsIp) {
        await opsConfig.updateOne({_id: docArr[0]._id}, {opsIp: opsIp})
      }
    }
  } catch (err) {
    console.log('运维地址配置出错：' + err)
  }
}
fatOpsConfig()
