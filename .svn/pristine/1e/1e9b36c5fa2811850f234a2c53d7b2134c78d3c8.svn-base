/*
 * 电视墙接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:06:12
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-12-17 13:59:05
 */

'use strict'
const mongoose = require('mongoose')
const Wall = mongoose.model('Wall')
const Scene = mongoose.model('Scene')
const Plan = mongoose.model('Plan')
const Polling = mongoose.model('Polling')
const Monitor = mongoose.model('Monitor')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const Origin = mongoose.model('Origin')
const JointCfg = mongoose.model('JointCfg')
const Layout = mongoose.model('Layout')
const PlatformServer = mongoose.model('PlatformServer')
const ObjectId = mongoose.Types.ObjectId
const {
  setMonitorCfg,
  getMonitorCfg,
  openWall,
  openVodWall,
  frontVodWall,
  closeWall,
  closeAll,
  keepingState,
  getState,
  switchScene,
  vallDisplay,
  getJointLayout,
  setJointLayout,
  fullDisplay
} = require('../../../bstar/tvwall.interface')
const { getNowScene, checkDeviceSwitch } = require('../tool')
const _ = require('lodash')
const { handleSysException } = require('../../../../common/tools')
const { getWallAuth } = require('../../role/role.controller')

// 获取当前状态后转为实时场景
const getNewScene = async (ctx, rtscene) => {
  try {
    let state = null
    try {
      state = await getState(ctx)
    } catch (error) {
      ctx.throw(500, {
        code: error.error ? error.error : 3,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/currentstate?'
      })
    }
    const newScene = {
      name: rtscene.name,
      wall: rtscene.wall,
      polling: null,
      info: []
    }
    if (_.isEmpty(state.monitorConf)) {
      rtscene.info &&
        rtscene.info.forEach(item => {
          if (ctx.request.body.monitor && ctx.request.body.panecount) {
            if (item.monitor + '' === ctx.request.body.monitor + '') {
              item.panecount = ctx.request.body.panecount
            }
          }
        })
      newScene.info = [...rtscene.info.toObject()]
    } else {
      const tempInfo = rtscene.info.toObject()
      const sceneObj = {}
      tempInfo.forEach(item => {
        sceneObj[item.monitor] = item
      })
      for (const item of state.monitorConf) {
        const infoItem = {
          monitor: '', // 监视器位置
          type: 0, // 屏幕类型
          panecount: 1,
          resources: []
        }
        for (var temp of item.panePlay) {
          const obj = {
            code: 1, // 窗格号
            resource: '' // 通道
          }
          let resource
          if (temp.gbDevId) {
            resource = await Resource.findOne({ nodeId: temp.gbDevId }).exec()
          } else {
            resource = await Resource.findOne({ ip: temp.devIp, chan: parseInt(temp.channel) }).exec()
          }
          obj.code = temp.pane || ''
          obj.resource = resource ? resource._id : ''
          obj.code && obj.resource && infoItem.resources.push(obj)
        }
        // 查找出监视器对应的解码器通道
        const monitorChan = await Resource.findOne({ ip: item.devIp, chan: item.monitor, type: 5 }, '_id')
          .lean()
          .exec()
        const monitor = await Monitor.findOne({ channel: monitorChan._id, wall: rtscene.wall + '' }, ' _id')
          .lean()
          .exec()
        if (!monitor) {
          continue
        }
        infoItem.monitor = monitor ? monitor._id.toString() : ''
        infoItem.type = _.get(sceneObj[monitor._id + ''], 'type', '') || 0
        infoItem.panecount = item.paneCount
        newScene.info.push(infoItem)
        delete sceneObj[monitor._id + '']
      }
      if (Object.keys(sceneObj).length) {
        for (const item in sceneObj) {
          newScene.info.push(sceneObj[item])
        }
      }
    }
    await Wall.findByIdAndUpdate(rtscene.wall, { selectedplan: null })
    return newScene
  } catch (error) {
    throw error
  }
}
// 获取当前状态后转为实时场景
// const getNewScene2 = async (ctx, rtscene) => {
//   try {
//     let state = null
//     try {
//       state = await getState(ctx)
//     } catch (error) {
//       throw error
//     }
//     console.log(JSON.stringify(state))
//     const newScene = {
//       name: rtscene.name,
//       wall: rtscene.wall,
//       polling: null,
//       info: []
//     }
//     if (_.isEmpty(state.monitorConf)) {
//       rtscene.info && rtscene.info.forEach(item => {
//         if (ctx.request.body.monitor && ctx.request.body.panecount) {
//           if (item.monitor + '' === ctx.request.body.monitor + '') item.panecount = ctx.request.body.panecount
//         }
//       })
//       newScene.info = [...rtscene.info.toObject()]
//     } else {
//       // 查找出所有解码设备
//       const monitorsDev = await Monitor.find({ wall: ctx.params.id }).populate('channel').exec()
//       let devs = monitorsDev.map(item => item.equipment + '')
//       devs = [...new Set(devs)]
//       // 获取所有解码器配置
//       let monitorCfg = []
//       for (var item of devs) {
//         const dev = await Device.findById(item).exec()
//         if (dev.status) {
//           let cfg
//           try {
//             cfg = await getMonitorCfg(ctx, {
//               devInfo: {
//                 devIp: dev.ip,
//                 devPort: dev.cport,
//                 vendor: 1,
//                 version: '1.1',
//                 username: dev.username,
//                 password: dev.password,
//                 flag: 1
//               }
//             })
//           } catch (error) {
//             throw error
//           }
//           const obj = {
//             ip: dev.ip,
//             port: dev.cport
//           }
//           const tempArr = new Array(cfg.MonitorCfgPrmArr.length)
//           _.fill(tempArr, obj)
//           _.merge(cfg.MonitorCfgPrmArr, tempArr)
//           monitorCfg = [...monitorCfg, ...cfg.MonitorCfgPrmArr]
//         }
//       }
//       for (var mcfg of monitorCfg) {
//         const monitorChan = await Resource.findOne({ ip: mcfg.ip, chan: mcfg.monitor, type: 5 }, '_id').lean().exec()
//         const monitor = await Monitor.find({ channel: monitorChan, wall: rtscene.wall + '' }, ' _id').exec()
//         // 如果在数据库没有找到对应监视器，continue
//         if (_.isEmpty(monitor)) continue
//         mcfg.monitorId = monitor[0] ? monitor[0]._id + '' : ''
//         for (const item of state.monitorConf) {
//           if (mcfg.ip + '' === item.devIp + '' && mcfg.monitor + '' === item.monitor + '') {
//             const infoItem = {
//               monitor: '', // 监视器位置
//               type: 0, // 屏幕类型
//               panecount: 1,
//               resources: []
//             }
//             for (var temp of item.panePlay) {
//               const obj = {
//                 code: 1, // 窗格号
//                 resource: '' // 通道
//               }
//               const resource = await Resource.find({ ip: temp.devIp, chan: parseInt(temp.channel) }).exec()
//               obj.code = temp.pane
//               obj.resource = resource[0]._id
//               obj.code && obj.resource && infoItem.resources.push(obj)
//             }
//             const tempInfo = rtscene.info.toObject()
//             // 查找出监视器对应的解码器通道
//             const monitorChan = await Resource.findOne({ ip: item.devIp, chan: item.monitor, type: 5 }, '_id').exec()
//             const monitor = await Monitor.find({ channel: monitorChan, wall: rtscene.wall + '' }, ' _id').exec()
//             infoItem.monitor = monitor[0] ? monitor[0]._id.toString() : ''
//             infoItem.type = item.monitor ? tempInfo[item.monitor - 1].type : ''
//             infoItem.panecount = mcfg.paneCnt
//             newScene.info.push(infoItem)
//           }
//         }
//       }
//       // 筛选出和实时状态下不存在的
//       for (const item of newScene.info) {
//         for (var i = 0; i < monitorCfg.length; i++) {
//           if (item.monitor + '' === monitorCfg[i].monitorId + '') {
//             monitorCfg.splice(i, 1)
//           }
//         }
//       }
//       monitorCfg.length && monitorCfg.forEach(item => {
//         const infoItem = {
//           monitor: '', // 监视器位置
//           type: 0, // 屏幕类型
//           panecount: item.paneCnt,
//           resources: []
//         }
//         if (item.monitorId) {
//           infoItem.monitor = item.monitorId + ''
//           if (item._id + '' === item.monitorId + '') {
//             infoItem.panecount = item.panecount
//           }
//           newScene.info.push(infoItem)
//         }
//       })
//     }
//     await Wall.findByIdAndUpdate(rtscene.wall, { selectedplan: null })
//     return newScene
//   } catch (error) {
//     throw error
//   }
// }
exports.get = async ctx => {
  // 获取电视墙的所有配置信息
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取电视墙配置'))
    const walls = await Wall.find()
      .populate('layout')
      .exec()
    const wallsId = walls.map(item => item._id)
    const all = await Promise.all([
      Scene.find({ wall: { $in: wallsId } }).exec(),
      Plan.find({ wall: { $in: wallsId } }).exec(),
      Polling.find({ wall: { $in: wallsId } }).exec(),
      Monitor.find({ wall: { $in: wallsId } }).exec()
    ])
    const wallsCfg = await Promise.all(
      walls.map(async item => {
        item = item.toObject()
        const allNeed = all.map(arr => arr.filter(({ wall }) => JSON.stringify(wall) === JSON.stringify(item._id)))
        const keys = ['scenes', 'plans', 'pollings', 'monitors']
        keys.forEach((key, index) => {
          item[key] = allNeed[index]
        })
        if (item.selectedplan) {
          const plan = await Plan.findById(item.selectedplan).exec()
          const scene = getNowScene(plan)
          if (scene) {
            await Wall.findByIdAndUpdate(item._id, { selectedscene: scene })
            item.selectedscene = scene
          }
        }
        return item
      })
    )
    ctx.status = 200
    ctx.body = wallsCfg
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
// 获取电视墙列表
exports.getList = async ctx => {
  // 获取电视墙的所有配置信息
  const ADMINID = '5be27279e74ee9376c681111'
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取电视墙配置'))
    if (_.isEmpty(ctx.query.roleid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let find = {}
    if (ctx.query.roleid !== ADMINID) {
      let wallList = await getWallAuth(ctx.query.roleid)
      find = { _id: { $in: wallList } }
    }
    const [walls, origins] = await Promise.all([
      Wall.find(find)
        .populate([{ path: 'layout' }, { path: 'rtscene', populate: { path: 'polling', select: 'name' } }, { path: 'selectedplan' }])
        .lean(),
      Origin.find({}).lean()
    ])
    // const [originMapping, promiseLaunch] = [{}, []]
    const originMapping = {}
    for (var item of origins) {
      let monitor
      item.decodechan &&
        (monitor = await Monitor.findOne({ channel: item.decodechan }, '_id')
          .lean()
          .exec())
      monitor && (originMapping[item.jointorigin + ''] = monitor._id)
    }
    /* for (const item of origins) {
       if (item.decodechan) {
         promiseLaunch.push(
           Monitor.findOne({ channel: item.decodechan }, 'channel')
             .lean()
             .exec()
         )
       }
     }
     const monitors = await Promise.all(promiseLaunch)
     for (const item of origins) {
       const monitor = monitors.find(el => el.channel.toString() === item.decodechan.toString())
       if (monitor) {
         originMapping[item.jointorigin + ''] = monitor._id
       }
    } */
    await Promise.all(walls.map(async wall => {
      const selectedplan = _.get(wall, 'selectedplan', false)
      if (selectedplan) {
        const sceneIds = getNowScene(selectedplan)
        if (sceneIds) {
          const sceneInfo = await Scene.findOne({ _id: sceneIds })
            .lean()
            .exec()
          delete sceneInfo._id
          delete sceneInfo.name
          await Scene.findByIdAndUpdate(wall.rtscene._id, sceneInfo).exec()
          const updateData = { selectedscene: sceneIds }
          if (sceneInfo.layout) {
            updateData.layout = sceneInfo.layout
          }
          const upWall = await Wall.findByIdAndUpdate(wall._id, updateData).populate([{ path: 'layout' }, { path: 'rtscene', populate: { path: 'polling', select: 'name' } }])
            .lean()

          wall.selectedplan = upWall.selectedplan
          wall.selectedscene = upWall.selectedscene
          wall.layout = upWall.layout
          wall.rtscene = upWall.rtscene
          wall.defaultscene = upWall.defaultscene
        }
        if (wall.layout && wall.layout.wininfo) {
          wall.layout.wininfo.forEach(item => {
            originMapping[item.jointorigin + ''] && (item.monitor = originMapping[item.jointorigin + ''])
          })
        }
      } else if (wall.layout && wall.layout.wininfo) {
        wall.layout.wininfo.forEach(item => {
          originMapping[item.jointorigin + ''] && (item.monitor = originMapping[item.jointorigin + ''])
        })
      }
    }))
    ctx.status = 200
    ctx.body = walls
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}

exports.add = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-添加电视墙'))
    const wallId = new ObjectId()
    console.log(wallId + '')
    ctx.request.body._id = wallId
    const wallDocs = ctx.request.body
    const rtscene = {
      name: '实时场景',
      wall: wallId,
      info: []
    }
    const setMonitorReqBody = {
      sceneswitch: [
        {
          isSceneswitch: false,
          cameraGroup: {
            cameraList: [],
            interval: 0
          },
          monitorConf: []
        }
      ]
    }
    if (ctx.request.body.jointcontroller) {
      try {
        // 初始化源,初始化监视器,初始化场景
        const { oriArr, monitorArr, setMonitorData } = await initOriginMonitorScene(ctx, wallId + '')
        // 初始化拼接控制器场景
        const devInfo = {
          devIp: ctx.request.body.jointcontroller.info.ip,
          port: ctx.request.body.jointcontroller.info.port
        }
        const layoutArr = await initJointLayout(ctx, wallId + '', devInfo)
        // 创建监视器
        const docs = await Monitor.create(monitorArr)
        docs.forEach(doc => {
          rtscene.info.push({ monitor: doc._id, type: 0, panecount: 4, resources: [] })
        })
        try {
          setMonitorData.forEach(item => {
            setMonitorCfg(ctx, item)
          })
        } catch (error) {
          ctx.throw(500, {
            code: error.error,
            message: '操作未成功,请重试一下',
            type: 'sys',
            errInfo: '/api/wall/setdecodercfg'
          })
        }
        await Promise.all([
          // 创建源
          Origin.create(oriArr),
          // 创建布局
          Layout.create(layoutArr)
        ])
        const layout = await Layout.findOne({ sceneid: -1 }, '_id wininfo')
          .populate({
            path: 'wininfo.monitor',
            select: 'channel startcode',
            populate: { path: 'channel', select: 'ip port chan' }
          })
          .lean()
          .exec()
        wallDocs.layout = layout._id
        setMonitorReqBody.sceneswitch[0].monitorConf = layout.wininfo
          .filter(item => item.monitor)
          .map(item => {
            return {
              devIp: item.monitor.channel.ip,
              devPort: item.monitor.channel.port,
              monitor: item.monitor.channel.chan,
              playType: 0,
              paneCount: 4,
              paneTag: item.monitor.startcode,
              panePlay: []
            }
          })
      } catch (error) {
        await Promise.all([
          Origin.deleteMany({ wall: wallId }),
          Monitor.deleteMany({ wall: wallId }),
          Layout.deleteMany({ wall: wallId })
        ])
        throw error
      }
    }
    const sdoc = await Scene.create(rtscene)
    wallDocs.rtscene = sdoc._id
    const doc = await Wall.create(wallDocs)
    try {
      await switchScene(ctx, setMonitorReqBody)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/sceneswitch'
      })
    }
    // 更新布局的电视墙id
    await Layout.findByIdAndUpdate(ctx.request.body.layout, { wall: wallId })
    ctx.status = 201
    ctx.body = [doc._id]
  } catch (error) {
    handleSysException(error)
  }
}

// 初始化源,初始化监视器,初始化场景
async function initOriginMonitorScene(ctx, wall) {
  try {
    const origin = await Origin.find({ wall }).exec()
    const jointcontroller = ctx.request.body.jointcontroller
    if (_.isEmpty(origin)) {
      // 查找出已经配置监视器的解码通道
      const monitorDecodeChan = await Monitor.find({}, 'channel')
        .lean()
        .exec()
      const ids = monitorDecodeChan.map(item => item.channel)
      // 查找出所有的解码通道
      const [decodeChan, jointChan] = await Promise.all([
        Resource.find({ type: 5, _id: { $nin: ids } }, '_id chan eid')
          .populate({ path: 'eid', select: 'ip cport username password' })
          .sort('chan')
          .exec(),
        Resource.find({ ip: jointcontroller.info.ip, port: jointcontroller.info.port, type: 15 }, '_id chan')
          .sort('chan')
          .exec()
      ])
      if (!decodeChan || !decodeChan.length) {
        ctx.throw(500, { code: 500, message: '无可用的解码通道' })
      }
      const oriArr = []
      const monitorArr = []
      const setMonitorData = []
      let i = 0
      while (i < jointChan.length) {
        const oriObj = {
          wall
        }
        oriObj.jointorigin = jointChan[i]._id
        oriArr.push(oriObj)
        i++
      }
      i = 0
      while (i < decodeChan.length) {
        const moniObj = {
          wall,
          name: `解码器${i + 1}`,
          code: `00${i + 1}`,
          // position: i + 1,
          startcode: 1
        }
        while (moniObj.code.length > 3 && moniObj.code.substr(0, 1) === '0') {
          moniObj.code = moniObj.code.substr(1)
        }
        if (oriArr[i]) {
          oriArr[i].decodechan = decodeChan[i]._id
        }
        if (decodeChan[i]) {
          moniObj.channel = decodeChan[i]._id
          // moniObj.jointorigin = jointChan[i]._id
          moniObj.equipment = decodeChan[i].eid._id
          monitorArr.push(moniObj)
          setMonitorData.push({
            devInfo: {
              devIp: decodeChan[i].eid.ip,
              devPort: decodeChan[i].eid.cport,
              vendor: 1,
              version: '',
              username: decodeChan[i].eid.username,
              password: decodeChan[i].eid.password,
              flag: 1
            },
            devCtl: {
              MonitorCfgPrmArr: [
                {
                  monitor: decodeChan[i].chan,
                  paneCnt: 4
                }
              ]
            }
          })
        }
        i++
      }
      return {
        oriArr,
        monitorArr,
        setMonitorData
      }
    }
  } catch (error) {
    throw error
  }
}
// 初始化所有拼接控制器布局
async function initJointLayout(ctx, wall, devinfo) {
  try {
    const body = {
      devInfo: devinfo,
      screenScenesArr: [{ sScreenId: 0, scenesIdList: [] }]
    }
    console.log(JSON.stringify(body))
    let data
    try {
      data = await getJointLayout(ctx, body)
    } catch (error) {
      ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        options: { url: error.options.baseUrl + error.options.url, reqBody: error.options.body },
        errInfo: '/api/ctl/stictchingScenesCfgGet'
      })
    }
    const jointDev = await Device.findOne({ ip: devinfo.devIp, cport: devinfo.port }, '_id')
      .lean()
      .exec()
    const jointRes = await Resource.find({ eid: jointDev._id }, '_id chan')
      .lean()
      .exec()
    const jointResMapping = {}
    jointRes.forEach(res => {
      jointResMapping[res.chan] = res._id + ''
    })
    // 获取改电视墙下的所有监视器
    // const monitors = await Monitor.find({ wall }, '_id jointorigin').lean().exec()
    // const monotorMapping = {}
    // monitors.forEach(m => {
    //   monotorMapping[m.jointorigin + ''] = m._id + ''
    // })
    const docs = []
    data.sceenScenesInfoArr[0].scenesInfoArr.forEach(item => {
      const layout = {}
      layout.sceneid = item.scenesId
      layout.name = `拼控布局${item.scenesId}`
      layout.row = item.swScreenInfo.rVScreenNum
      layout.column = item.swScreenInfo.rHScreenNum
      layout.screeninfo = {
        width: item.swScreenInfo.rScreenW,
        height: item.swScreenInfo.rScreenH,
        hinterval: item.swScreenInfo.rHInterval,
        vinterval: item.swScreenInfo.rVInterval
      }
      layout.wininfo = item.swScreenInfo.winInfoList.map(item => {
        return {
          winnumber: item.wId,
          jointorigin: jointResMapping[item.sourceChl],
          // monitor: monotorMapping[jointResMapping[item.wId + 1]],
          left: item.left,
          right: item.right,
          top: item.top,
          bottom: item.bottom
        }
      })
      layout.wall = wall
      docs.push(layout)
    })
    return docs
    // ctx.status = 200
    // ctx.body = docs
  } catch (error) {
    handleSysException(error)
  }
}
exports.modify = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-修改电视墙'))
    await Wall.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
exports.getMonitorByWall = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取电视墙下的监视器'))
    const wall = await Wall.findById(ctx.params.id)
      .populate('rtscene')
      .lean()
      .exec()
    const rtscene = wall.rtscene.info
    const rtsceneMapping = {}
    rtscene.forEach(item => {
      rtsceneMapping[item.monitor + ''] = item.panecount
    })
    const monitors = await Monitor.find({ wall: ctx.params.id })
      .populate([
        {
          path: 'equipment',
          select: 'ip cport name dport'
        },
        {
          path: 'channel',
          select: 'ip port type name'
        }
      ])
      .lean()
      .exec()
    monitors.map(item => {
      item.panecount = rtsceneMapping[item._id + '']
      return item
    })
    ctx.status = 200
    ctx.body = monitors
  } catch (error) {
    console.log(error)
    return ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
exports.getPlanByWall = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取电视墙下的预案'))
    const plans = await Plan.find({ wall: ctx.params.id }).exec()
    ctx.status = 200
    ctx.body = plans
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}

exports.getSceneByWall = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取电视墙下的场景'))
    const scenes = await Scene.find({ wall: ctx.params.id }).exec()
    ctx.status = 200
    ctx.body = scenes
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}

exports.getPollingByWall = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取电视墙下的轮询'))
    const pollings = await Polling.find({ wall: ctx.params.id })
      .populate({ path: 'channels', select: 'name' })
      .exec()
    ctx.status = 200
    ctx.body = pollings
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-删除电视墙'))
    const wall = ctx.params.id
    const wallDoc = await Wall.findById(ctx.params.id)
      .lean()
      .exec()
    if (wallDoc.jointcontroller) {
      Origin.deleteMany({ wall }).exec()
    }
    await Promise.all([
      Wall.findByIdAndRemove(wall).exec(),
      Scene.deleteMany({ wall }).exec(),
      Polling.deleteMany({ wall }).exec(),
      Plan.deleteMany({ wall }).exec(),
      Monitor.deleteMany({ wall }).exec(),
      Layout.deleteMany({ wall }).exec()
    ])
    ctx.status = 200
  } catch (error) {
    console.log(error)
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}

exports.open = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-上墙'))
    const { monitor, number, resource } = ctx.request.body
    const monitorObj = await Monitor.findById(monitor)
      .populate('equipment channel')
      .exec()
    const resourceObj = await Resource.findById(resource)
      .populate('eid')
      .exec()
    const devIds = [monitorObj.equipment._id, resourceObj.eid._id]

    const checkDevice = await checkDeviceSwitch(devIds)

    if (!_.isEmpty(checkDevice)) {
      return ctx.throw(500, { message: `设备停用` })
    }

    const data = {
      decodeIp: monitorObj.equipment.ip,
      decodePort: monitorObj.equipment.cport,
      monitor: monitorObj.channel.chan
    }
    try {
      await keepingState(ctx, data)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/keepingstate'
      })
    }
    const body = {
      devInfo: {
        devIp: monitorObj.equipment.ip,
        devPort: monitorObj.equipment.cport,
        vendor: 1,
        version: '1.1',
        username: monitorObj.equipment.username,
        password: monitorObj.equipment.password,
        flag: 1
      }
    }
    try {
      if (resourceObj.gbDevId && resourceObj.nodeId) {
        const gbServer = await PlatformServer.findById(resourceObj.shareServer).lean()
        body.devCtl = {
          stream: resourceObj.stream,
          monitor: monitorObj.channel.chan,
          streamType: monitorObj.channel.stream,
          pane: number || 1,
          streamConnPort: resourceObj.eid.dport,
          gbPlaDevIp: resourceObj.gbPlaDevIp,
          gbPlaDevPort: +resourceObj.gbPlaDevPort,
          gbDevId: resourceObj.nodeId,
          gbPlaNvrId: gbServer.serverId || ''
        }
      } else {
        body.devCtl = {
          stream: resourceObj.stream,
          monitor: monitorObj.channel.chan,
          streamType: monitorObj.channel.stream,
          pane: number || 1,
          channel: resourceObj.chan,
          devIp: resourceObj.eid.ip,
          devPort: resourceObj.eid.cport,
          streamConnPort: resourceObj.eid.dport
        }
      }
      await openWall(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error ? error.error : 3,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/open'
      })
    }
    const { rtscene } = await Wall.findById(ctx.params.id)
      .populate('rtscene')
      .exec()
    let newScene = null
    try {
      newScene = await getNewScene(ctx, rtscene)
    } catch (error) {
      throw error
    }
    // 更新轮询组
    const pollingArr = await getRealPollings(monitor)
    newScene.polling = pollingArr
    await Scene.findByIdAndUpdate(rtscene._id, newScene).exec()
    await Wall.findByIdAndUpdate(newScene.wall, { selectedplan: null })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
exports.openVod = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-回放上墙'))
    const { monitor, number, resource } = ctx.request.body
    const monitorObj = await Monitor.findById(monitor)
      .populate('equipment channel')
      .exec()
    const resourceObj = await Resource.findById(resource)
      .populate('eid')
      .exec()
    const data = {
      decodeIp: monitorObj.equipment.ip,
      decodePort: monitorObj.equipment.cport,
      monitor: monitorObj.channel.chan
    }
    const devIds = [monitorObj.equipment._id, resourceObj.eid._id]
    const checkDevice = await checkDeviceSwitch(devIds)
    if (!_.isEmpty(checkDevice)) {
      return ctx.throw(500, { message: `设备停用` })
    }

    try {
      await keepingState(ctx, data)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/keepingstate'
      })
    }
    const body = {
      devInfo: {
        devIp: monitorObj.equipment.ip,
        devPort: monitorObj.equipment.cport,
        vendor: 1,
        version: '1.1',
        username: monitorObj.equipment.username,
        password: monitorObj.equipment.password,
        flag: 1
      },
      devCtl: {
        monitor: monitorObj.channel.chan,
        streamType: monitorObj.channel.stream,
        pane: number || 1,
        channel: resourceObj.chan,
        devIp: resourceObj.eid.ip,
        devPort: resourceObj.eid.cport,
        streamConnPort: resourceObj.eid.dport,
        dsIp: ctx.request.body.ds.dsIp,
        dsPort: ctx.request.body.ds.dsPort
      },
      dsCmdContent: ctx.request.body.dsCmdContent
    }

    try {
      await openVodWall(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error ? error.error : 3,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/openvod'
      })
    }
    const { rtscene } = await Wall.findById(ctx.params.id)
      .populate('rtscene')
      .exec()
    let newScene = null
    try {
      newScene = await getNewScene(ctx, rtscene)
    } catch (error) {
      throw error
    }
    // 更新轮询组
    const pollingArr = await getRealPollings(monitor)
    newScene.polling = pollingArr
    await Scene.findByIdAndUpdate(rtscene._id, newScene).exec()
    await Wall.findByIdAndUpdate(newScene.wall, { selectedplan: null })
    ctx.status = 200
    ctx.body = body
  } catch (err) {
    handleSysException(err)
  }
}

// 前端国标回放上墙
exports.frontVod = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-前端回放上墙'))
    const { monitor, number, resource } = ctx.request.body
    const monitorObj = await Monitor.findById(monitor)
      .populate('equipment channel')
      .exec()
    const resourceObj = await Resource.findById(resource)
      .populate('eid')
      .exec()
    const data = {
      decodeIp: monitorObj.equipment.ip,
      decodePort: monitorObj.equipment.cport,
      monitor: monitorObj.channel.chan
    }
    const devIds = [monitorObj.equipment._id, resourceObj.eid._id]
    const checkDevice = await checkDeviceSwitch(devIds)

    if (!_.isEmpty(checkDevice)) {
      return ctx.throw(500, { message: `设备停用` })
    }
    try {
      await keepingState(ctx, data)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/keepingstate'
      })
    }
    const body = {
      devInfo: {
        devIp: monitorObj.equipment.ip,
        devPort: monitorObj.equipment.cport,
        vendor: 1,
        version: '1.1',
        username: monitorObj.equipment.username,
        password: monitorObj.equipment.password,
        flag: 1
      },
      devCtl: {
        monitor: monitorObj.channel.chan,
        streamType: monitorObj.channel.stream,
        pane: number || 1,
        channel: resourceObj.chan,
        devIp: resourceObj.eid.ip,
        devPort: resourceObj.eid.cport,
        streamConnPort: resourceObj.eid.dport,
        tsIp: ctx.request.body.ts.tsIp,
        tsPort: ctx.request.body.ts.tsPort,
        streamIdLong: ctx.request.body.streamIdLong
      }
    }

    if (resourceObj.gbDevId && resourceObj.nodeId) {
      const gbServer = await PlatformServer.findById(resourceObj.shareServer).lean()
      body.devCtl.gbPlaDevIp = resourceObj.gbPlaDevIp
      body.devCtl.gbPlaDevPort = +resourceObj.gbPlaDevPort
      body.devCtl.gbPlaNvrId = gbServer.serverId
      body.devCtl.gbDevId = resourceObj.nodeId
      delete body.devCtl.devIp
      delete body.devCtl.devPort
    }

    try {
      await frontVodWall(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error ? error.error : 3,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/opendevvod'
      })
    }
    const { rtscene } = await Wall.findById(ctx.params.id)
      .populate('rtscene')
      .exec()
    let newScene = null
    try {
      newScene = await getNewScene(ctx, rtscene)
    } catch (error) {
      throw error
    }
    // 更新轮询组
    const pollingArr = await getRealPollings(monitor)
    newScene.polling = pollingArr
    await Scene.findByIdAndUpdate(rtscene._id, newScene).exec()
    await Wall.findByIdAndUpdate(newScene.wall, { selectedplan: null })
    ctx.status = 200
    ctx.body = body
  } catch (err) {
    handleSysException(err)
  }
}

exports.close = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-关闭一个监视器'))
    const { monitor, number } = ctx.request.body
    const monitorObj = await Monitor.findById(monitor)
      .populate('equipment channel')
      .exec()
    const { rtscene } = await Wall.findById(ctx.params.id)
      .populate({
        path: 'rtscene',
        populate: {
          path: 'polling',
          select: 'monitorsinfo'
        }
      })
      .exec()
    const option = {
      devInfo: {
        devIp: monitorObj.equipment.ip,
        devPort: monitorObj.equipment.cport,
        vendor: 1,
        version: '1.1',
        username: monitorObj.equipment.username,
        password: monitorObj.equipment.password,
        flag: 1
      },
      devCtl: {
        monitor: monitorObj.channel.chan,
        pane: number
      }
    }
    try {
      await closeWall(ctx, option)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/close'
      })
    }
    rtscene.info.forEach(item2 => {
      if (item2.monitor + '' === monitorObj._id + '') {
        const index = item2.resources.findIndex(item3 => item3.code === number)
        if (index !== -1) {
          item2.resources.splice(index, 1)
        }
      }
    })
    const newScene = rtscene.toObject()
    // 更新轮询组
    const pollingArr = await getRealPollings(monitor)
    newScene.polling = pollingArr
    await Scene.findByIdAndUpdate(rtscene._id, newScene).exec()
    ctx.status = 200
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
    handleSysException(err)
  }
}
exports.setMonitorCfg = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-窗口分割'))
    // 传入监视器id和分割数
    const { monitor, panecount, isMouse } = ctx.request.body
    const monitorObj = await Monitor.findById(monitor)
      .populate('equipment channel')
      .exec()
    const data = {
      decodeIp: monitorObj.equipment.ip,
      decodePort: monitorObj.equipment.cport,
      monitor: monitorObj.channel.chan,
      mouse: isMouse
    }
    const devIds = [monitorObj.equipment._id]
    const checkDevice = await checkDeviceSwitch(devIds)

    if (!_.isEmpty(checkDevice)) {
      return ctx.throw(500, { message: `设备停用` })
    }
    try {
      await keepingState(ctx, data)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/keepingstate'
      })
    }
    const body = {
      devInfo: {
        devIp: monitorObj.equipment.ip,
        devPort: monitorObj.equipment.cport,
        vendor: 1,
        version: '1.1',
        username: monitorObj.equipment.username,
        password: monitorObj.equipment.password,
        flag: 1
      },
      devCtl: {
        MonitorCfgPrmArr: [
          {
            monitor: monitorObj.channel.chan,
            paneCnt: panecount
          }
        ]
      }
    }
    try {
      await setMonitorCfg(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/setdecodercfg'
      })
    }
    const { rtscene } = await Wall.findById(ctx.params.id)
      .populate('rtscene')
      .exec()
    // 解码器设置成功后更新实时场景中对应监视器的分割数
    rtscene.info.forEach(item => {
      if (item.monitor + '' === monitor + '') {
        item.panecount = panecount
      }
    })
    let newScene = null
    try {
      newScene = await getNewScene(ctx, rtscene)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/currentstate?'
      })
    }
    // 更新轮询组
    const pollingArr = await getRealPollings(monitor)
    newScene.polling = pollingArr
    await Scene.findByIdAndUpdate(rtscene._id, newScene).exec()
    await Wall.findByIdAndUpdate(newScene.wall, { selectedplan: null })
    ctx.status = 200
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
    handleSysException(err, '', err.message)
  }
}

exports.closeAll = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-关闭所有监视器'))
    try {
      await keepingState(ctx)
    } catch (error) {
      console.log(error)
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/keepingstate'
      })
    }
    const wallid = ctx.params.id
    const { rtscene } = await Wall.findById(wallid)
      .populate('rtscene')
      .exec()
    const monitorids = rtscene.info.map(item => item.monitor)
    const monitors = await Monitor.find({ _id: { $in: monitorids } }).exec()
    const devices = [...new Set(monitors.map(item => item.toObject().equipment))]
    const devCfg = await Device.find({ _id: { $in: devices } }).exec()
    const option = {
      devList: devCfg.map(item => {
        return {
          devIp: item.ip,
          devPort: item.cport
        }
      })
    }
    try {
      await closeAll(ctx, option)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/closeall'
      })
    }
    let blankScene = null
    // try {
    //   blankScene = await getNewScene(ctx, rtscene)
    //   console.log(blankScene)
    // } catch (error) {
    //   console.log('blankScene errror', error)
    //   return ctx.throw(500, { code: 3, message: '操作未成功,请重试一下' })
    // }
    rtscene.info.forEach(item => {
      item.resources = []
    })
    rtscene.polling = null
    blankScene = rtscene
    await Scene.findByIdAndUpdate(rtscene._id, blankScene.toObject()).exec()
    await Wall.findByIdAndUpdate(wallid, { selectedplan: null, selectedscene: null })
    ctx.status = 200
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
    handleSysException(err)
  }
}

exports.showNo = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-显示编号'))
    const show = ctx.request.body.show
    const monitors = ctx.request.body.monitors
    if (_.isEmpty(monitors)) {
      ctx.throw(500, { code: 12, message: '请先配置监视器' })
    }
    const datas = await Monitor.find({ _id: { $in: monitors } }, 'code channel equipment')
      .populate([{ path: 'equipment', select: '_id ip cport' }, { path: 'channel', select: 'chan' }])
      .exec()
    const _body = { decoderList: [] }
    datas.forEach(n =>
      _body.decoderList.push({
        devIp: n.equipment.ip,
        devPort: n.equipment.cport,
        display: show,
        code: n.code,
        chan: n.channel.chan
      })
    )
    console.log(JSON.stringify(_body))
    const result = await vallDisplay(ctx, _body)
    ctx.body = result
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1, message: '系统内部错误' })
  }
}
// 由于支持多轮询(多屏轮询)，需要在打断轮询操作后，更新当前轮询组
async function getRealPollings(monitor) {
  try {
    const monitorInfo = await Monitor.findById(monitor, 'wall').exec()
    const realScenePollingArr = await Scene.find({ wall: monitorInfo.wall, name: '实时场景' }, 'polling').exec()
    const pollingArr = realScenePollingArr[0].polling
    const result = []
    if (pollingArr && pollingArr.length) {
      for (var item of pollingArr) {
        const pollingMonitorsInfo = await Polling.findById(item, 'monitorsinfo').exec()
        const pollingMonitorsInfoArr = pollingMonitorsInfo.monitorsinfo
        if (pollingMonitorsInfoArr.findIndex(polling => polling + '' === monitor + '') === -1) {
          result.push(item)
        }
      }
    }
    return result
  } catch (error) {
    console.log(error)
  }
}

// 获取拼接控制器
exports.getJointController = async ctx => {
  try {
    const devs = await Device.find({ bigtype: 9 }, 'manufacturer ip cport').exec()
    ctx.body = devs
  } catch (error) {
    handleSysException(error)
  }
}
// 拼控配置
exports.jointConfig = async ctx => {
  try {
    const jointCfg = await JointCfg.findOne({}).exec()
    if (jointCfg) {
      await JointCfg.findByIdAndUpdate(jointCfg._id, ctx.request.body).exec()
    } else {
      await JointCfg.create(ctx.request.body)
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 获取拼控配置
exports.getJointConfig = async ctx => {
  try {
    const jointCfg = await JointCfg.findOne({}).exec()
    ctx.status = 200
    ctx.body = jointCfg
  } catch (error) {
    handleSysException(error)
  }
}

// 获取拼控布局
exports.getJointLayout = async ctx => {
  try {
    const body = {
      devInfo: {
        devIp: ctx.request.body.ip,
        port: ctx.request.body.port
      },
      screenScenesArr: [{ sScreenId: 0, scenesIdList: [-1] }]
    }
    let data
    try {
      data = await getJointLayout(ctx, body)
    } catch (error) {
      ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/ctl/stictchingScenesCfgGet'
      })
    }
    const jointDev = await Device.findOne({ ip: ctx.request.body.ip, cport: ctx.request.body.port }, '_id')
      .lean()
      .exec()
    const jointRes = await Resource.find({ eid: jointDev._id }, '_id chan')
      .lean()
      .exec()
    const jointResMapping = {}
    jointRes.forEach(res => {
      jointResMapping[res.chan] = res._id
    })
    const layout = {}
    layout.sceneid = data.sceenScenesInfoArr[0].scenesInfoArr[0].scenesId
    layout.name =
      data.sceenScenesInfoArr[0].scenesInfoArr[0].swScreenInfo.rHScreenNum +
      '*' +
      data.sceenScenesInfoArr[0].scenesInfoArr[0].swScreenInfo.rVScreenNum
    layout.row = data.sceenScenesInfoArr[0].scenesInfoArr[0].swScreenInfo.rHScreenNum
    layout.column = data.sceenScenesInfoArr[0].scenesInfoArr[0].swScreenInfo.rVScreenNum
    layout.info = data.sceenScenesInfoArr[0].scenesInfoArr[0].swScreenInfo.winInfoList.map(item => {
      return { screennumber: item.wId, jointorigin: jointResMapping[item.sourceChl] }
    })
    const doc = await Layout.create(layout)
    ctx.status = 201
    ctx.body = doc._id
  } catch (error) {
    handleSysException(error)
  }
}

// 设置拼接控制器布局
exports.setJointLayout = async ctx => {
  try {
    const body = {
      devInfo: {
        devIp: ctx.request.body.ip,
        port: ctx.request.body.port
      },
      scenesCall: { sScreenId: 0, scenesId: ctx.request.body.sceneid }
    }
    const joinStatus = await Device.findOne(body.devInfo, 'deviceStatus').exec()
    if (!_.isEmpty(joinStatus) && _.get(joinStatus, 'deviceStatus') === 1) {
      ctx.thorw(500, { message: '拼控未启用', type: 'sys' })
    }
    try {
      await setJointLayout(ctx, body)
    } catch (error) {
      ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/ctl/stictchingScenesCall'
      })
    }
    // 更新当前电视墙的布局
    const layout = await Layout.findOne({ sceneid: ctx.request.body.sceneid, wall: ctx.request.body.tvwall }, '_id')
      .lean()
      .exec()
    await Wall.findByIdAndUpdate(ctx.request.body.tvwall, { layout: layout._id })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
exports.getDecodeChan = async ctx => {
  try {
    const res = await Resource.find({ type: 5 }, 'ip port name')
      .lean()
      .exec()
    ctx.status = 200
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}
exports.updateAllJointLayout = async ctx => {
  try {
    const body = {
      devInfo: {
        devIp: ctx.request.body.ip,
        port: ctx.request.body.port
      },
      screenScenesArr: [{ sScreenId: 0, scenesIdList: [] }]
    }
    console.log(JSON.stringify(body))
    let data
    try {
      data = await getJointLayout(ctx, body)
    } catch (error) {
      // ctx.throw(500, { code: error.error, message: '操作未成功,请重试一下', type: 'sys', options: { url: error.options.baseUrl + error.options.url, reqBody: error.options.body } })
      ctx.throw({ code: typeof error.error === 'number' ? error.error : 501, message: error.message })
    }
    // 删除电视墙的所有布局
    // await Layout.deleteMany({ wall: ctx.request.body.wall }).exec()
    const jointDev = await Device.findOne({ ip: ctx.request.body.ip, cport: ctx.request.body.port }, '_id')
      .lean()
      .exec()
    const jointRes = await Resource.find({ eid: jointDev._id }, '_id chan')
      .lean()
      .exec()
    const jointResMapping = {}
    jointRes.forEach(res => {
      jointResMapping[res.chan] = res._id + ''
    })
    // 获取改电视墙下的所有监视器
    const monitors = await Monitor.find({ wall: ctx.request.body.wall }, '_id jointorigin')
      .lean()
      .exec()
    const monotorMapping = {}
    monitors.forEach(m => {
      monotorMapping[m.jointorigin + ''] = m._id + ''
    })
    const existLayouts = await Layout.find({ wall: ctx.request.body.wall }, 'sceneid').lean()
    const existSceneIds = existLayouts.map(item => item.sceneid)
    const updateDocs = []
    const createDocs = []
    data.sceenScenesInfoArr[0].scenesInfoArr.forEach(item => {
      const layout = {}
      layout.sceneid = item.scenesId
      layout.name = `拼控布局${item.scenesId}`
      layout.row = item.swScreenInfo.rVScreenNum
      layout.column = item.swScreenInfo.rHScreenNum
      layout.screeninfo = {
        width: item.swScreenInfo.rScreenW,
        height: item.swScreenInfo.rScreenH,
        hinterval: item.swScreenInfo.rHInterval,
        vinterval: item.swScreenInfo.rVInterval
      }
      layout.wininfo = item.swScreenInfo.winInfoList.map(item => {
        return {
          winnumber: item.wId,
          // monitor: monotorMapping[jointResMapping[item.sourceChl]],
          jointorigin: jointResMapping[item.sourceChl],
          left: item.left,
          right: item.right,
          top: item.top,
          bottom: item.bottom
        }
      })
      layout.wall = ctx.request.body.wall
      if (existSceneIds.includes(item.scenesId)) {
        updateDocs.push(layout)
      } else {
        createDocs.push(layout)
      }
    })
    // await Layout.create(docs)
    // 更新布局
    await Promise.all([
      ...updateDocs.map(item => Layout.findOneAndUpdate({ sceneid: item.sceneid }, item).exec()),
      Layout.create(createDocs)
    ])
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 窗格全屏
 * @param {*}
 */
exports.fullDisplay = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-窗口分割'))
    // 传入监视器id和分割数
    const { monitor, pane, showMax, wall } = ctx.request.body
    const monitorObj = await Monitor.findById(monitor)
      .populate('equipment channel')
      .exec()
    const body = {
      devInfo: {
        devIp: monitorObj.equipment.ip,
        devPort: monitorObj.equipment.cport,
        vendor: 1,
        version: '1.1',
        username: monitorObj.equipment.username,
        password: monitorObj.equipment.password,
        flag: 1
      },
      devCtl: {
        monitor: monitorObj.channel.chan,
        pane,
        showMax
      }
    }
    console.log(JSON.stringify(body))
    try {
      await fullDisplay(ctx, body)
    } catch (error) {
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/fullplay'
      })
    }
    let panecount
    if (showMax) {
      panecount = 1
    } else {
      try {
        const cfg = await getMonitorCfg(ctx, { devInfo: body.devInfo })
        cfg.MonitorCfgPrmArr.forEach(item => {
          if (monitorObj.channel.chan + '' === item.monitor + '') {
            panecount = item.paneCnt
          }
        })
      } catch (error) {
        return ctx.throw(500, {
          code: error.error,
          message: '操作未成功,请重试一下',
          type: 'sys',
          errInfo: '/api/wall/getdecoderability'
        })
      }
    }
    const { rtscene } = await Wall.findById(wall)
      .populate('rtscene')
      .lean()
      .exec()
    // 解码器设置成功后更新实时场景中对应监视器的分割数
    rtscene.info.forEach(item => {
      if (item.monitor + '' === monitor + '') {
        item.panecount = panecount
      }
    })
    await Scene.findByIdAndUpdate(rtscene._id, rtscene).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
