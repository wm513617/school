/*
 * @Author: chenkaibo
 * @Date: 2018-06-05 15:03:40
 * @Last Modified by: dfk
 * @Last Modified time: 2019-10-23 11:57:04
 */

// 设备相关的接口（调用北京）
const { req } = require('./req')
const Device = require('mongoose').model('Device')
const Resource = require('mongoose').model('Resource')
// const postal = require('postal')
const devOnline = require('../../api/map/point/point.socket')
const _ = require('lodash')
const redis = require('../../config/redis')

// 获取用户权限
exports.getUser = ({ ctx, username }) => {
  return req({
    ctx: ctx,
    method: 'get',
    url: `/api/auth/getuser?username=${username}`,
    body: {}
  })
}

// 设备登陆接口
exports.devLogin = ({ device, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/dev/login`,
    method: 'post',
    body: {
      devIp: device.ip,
      devPort: parseInt(device.cport),
      vendor: device.manufacturer,
      username: device.username,
      passwd: device.password,
      devType: parseInt(device.bigtype) === 5 ? 'decoder' : device.type,
      connMode: device.connMode || 'active'
    }
  })
}

exports.deviceLogin = ({ device, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/dev/login`,
    method: 'post',
    body: {
      devIp: device.ip,
      devPort: parseInt(device.cport),
      vendor: device.manufacturer,
      username: device.username,
      passwd: device.password,
      devType: 'python',
      connMode: 'active',
      verison: 2
    }
  })
}

// 手动校时
exports.devManualTime = ({ ctx, data }) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/devManualTime`,
    method: 'post',
    body: data
  }).catch(error => {
    console.log(error)
  })
}
// 自动校时
exports.devNotice = ({ ctx, data }) => {
  return req({
    ctx: ctx,
    url: `/api/notice/info`,
    method: 'post',
    body: data
  }).catch(error => {
    console.log(error)
  })
}
// 获取设备信息
exports.getDevConf = ({ data, ctx }) => {
  return req({
    ctx,
    method: 'POST',
    url: `/api/dev/conf`, // 获取设备信息接口
    body: data
  })
}
// 更新设备配置信息
exports.updateDevConf = ({ data, ctx }) => {
  return req({
    ctx,
    method: 'PUT',
    url: `/api/dev/conf`, // 更新设备信息接口
    body: data
  })
}
// 设备登出
exports.devLogout = ({ device, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/dev/logout`,
    method: 'post',
    body: {
      devIp: device.ip,
      devPort: parseInt(device.cport),
      vendor: device.manufacturer
    }
  })
}

// 同步设备在线状态(无需添加auth请求头)
exports.syncOnlineList = async () => {
  try {
    const [ret, devs] = await Promise.all([
      devOnlineList(),
      Device.find({ shareServer: { $exists: false }, manufacturer: { $ne: 'guangtuo' } }, 'ip cport status').exec()
    ])
    const onlineList = ret.devOnlineList ? ret.devOnlineList : []
    // 同步非平台互联推送的虚拟设备
    // const devs = await Device.find({ shareServer: { $exists: false } }, 'ip cport status').exec()
    if (_.isArray(onlineList) && _.isArray(devs)) {
      // let status
      const changeArray = []
      const online = new Set()
      const offline = new Set()
      const onlineMap = new Map(
        onlineList.map(item => {
          return [item.devIp + '' + item.port, true]
        })
      )
      for (let i = 0; i < devs.length; i++) {
        // status = false
        var obj = {
          _id: '',
          status: false,
          resStatus: 0
        }
        if (devs[i].status) {
          const temp = onlineMap.get(devs[i].ip + '' + devs[i].cport)
          if (!temp) {
            obj._id = devs[i]._id
            changeArray.push(obj)
            offline.add(devs[i]._id + '')
          }
        } else {
          const temp = onlineMap.get(devs[i].ip + '' + devs[i].cport)
          if (temp) {
            obj._id = devs[i]._id
            obj.status = true
            obj.resStatus = 1
            changeArray.push(obj)
            online.add(devs[i]._id + '')
          }
        }
      }
      if (changeArray.length) {
        await Promise.all([
          Device.updateMany({ _id: { $in: [...online] } }, { status: true }, { multi: true }),
          Device.updateMany({ _id: { $in: [...offline] } }, { status: false }, { multi: true }),
          Resource.updateMany({ eid: { $in: [...online] } }, { status: 1 }, { multi: true }),
          Resource.updateMany({ eid: { $in: [...offline] } }, { status: 0 }, { multi: true })
        ])
        // 视频点位实时更新
        await devOnline(require('../../bin/www').socketio, changeArray)
      }
    }

    // 广拓报警主机同步
    let guangtuoObj = await Device.findOne({ bigtype: 1, manufacturer: 'guangtuo' }, 'ip')
    if (!guangtuoObj) {
      // 如果没有广拓报警主机就不同步设备状态
      return
    }
    try {
      let [alarmDevs, alarms] = await Promise.all([
        Device.find({ bigtype: 1, manufacturer: 'guangtuo' }, 'ip cport status').exec(),
        alarmDevsList()
      ])
      if (!(alarms instanceof Array)) {
        // 北京接口返回可能为空 不是数组
        alarms = []
      }
      if (_.isArray(alarms) && _.isArray(alarmDevs)) {
        const changeArray = []
        const online = new Set()
        const offline = new Set()
        const alarOnline = []
        alarms.map(item => {
          if (item.devState === 1) {
            return alarOnline.push([item.devIp, true])
          }
        })
        const onlineMap = new Map(alarOnline)
        for (let i = 0; i < alarmDevs.length; i++) {
          // status = false
          var arrObj = {
            _id: '',
            status: false,
            resStatus: 0
          }
          if (alarmDevs[i].status) {
            const temp = onlineMap.get(alarmDevs[i].ip)
            if (!temp) {
              arrObj._id = alarmDevs[i]._id
              changeArray.push(arrObj)
              offline.add(alarmDevs[i]._id + '')
            }
          } else {
            const temp = onlineMap.get(alarmDevs[i].ip)
            if (temp) {
              arrObj._id = alarmDevs[i]._id
              arrObj.status = true
              arrObj.resStatus = 1
              changeArray.push(arrObj)
              online.add(alarmDevs[i]._id + '')
            }
          }
        }
        if (changeArray.length) {
          await Promise.all([
            Device.updateMany({ _id: { $in: [...online] } }, { status: true }, { multi: true }),
            Device.updateMany({ _id: { $in: [...offline] } }, { status: false }, { multi: true })
          ])
          // 视频点位实时更新
          await devOnline(require('../../bin/www').socketio, changeArray)
        }
      }
    } catch (error) {
      await Device.updateMany({ bigtype: 1, manufacturer: 'guangtuo' }, { status: false }, { multi: true })
    }
  } catch (err) {
    console.log('syncOnlineList error:', err.message)
  }
}
async function writeRedis () {
  // const deviceData = await Device.find({ shareServer: { $exists: false }, manufacturer: { $ne: 'guangtuo' } }, 'ip cport status').exec()
  const deviceData = await Device.find({}, 'ip cport status').exec()
  // 在redis中存入所有设备的ip和端口
  const deviceIds = []
  const dataObject = {}
  for (var item of deviceData) {
    deviceIds.push(item._id + '')
    let objectKey = item.ip + ':' + item.cport
    dataObject[objectKey] = item._id + ''
  }
  const reply = await redis.exists('deviceIds')
  if (reply === 1) {
    await redis.del('deviceIds')
  }
  await Promise.all([
    redis.set('deviceIps', JSON.stringify(dataObject)),
    redis.lpush('deviceIds', deviceIds)
  ])
}
// 同步设备在线状态(无需添加auth请求头)
exports.syncOnlineRedisList = async () => {
  try {
    // 同步redis中的最新数据
    await writeRedis()
    // 从redis中读取所有的设备id
    console.time('test')
    const allDeviceIds = await redis.lrange('deviceIds', 0, -1)
    // 随机取出全部设备的百分之九十认为是在线的
    let onlineDeviceIds = allDeviceIds.slice(0, 27000)
    let onlineSet = new Set(onlineDeviceIds)
    let allSet = new Set(allDeviceIds)
    // let offlineDeviceIds = Array.from(new Set([...allSet].filter(x => !onlineSet.has(x))))
    let offlineDeviceIds = Array.from(new Set([...allSet].filter(x => !onlineSet.has(x))))
    await Promise.all([
      Device.updateMany({ _id: { $in: onlineDeviceIds } }, { status: true }, { multi: true }),
      Device.updateMany({ _id: { $in: offlineDeviceIds } }, { status: false }, { multi: true }),
      Resource.updateMany({ eid: { $in: onlineDeviceIds } }, { status: 1 }, { multi: true }),
      Resource.updateMany({ eid: { $in: offlineDeviceIds } }, { status: 0 }, { multi: true })
      // Device.updateMany({ _id: { $nin: offlineDeviceIds } }, { status: true }, { multi: true }),
      // Device.updateMany({ _id: { $in: offlineDeviceIds } }, { status: false }, { multi: true }),
      // Resource.updateMany({ eid: { $nin: offlineDeviceIds } }, { status: 1 }, { multi: true }),
      // Resource.updateMany({ eid: { $in: offlineDeviceIds } }, { status: 0 }, { multi: true })
    ])
    console.timeEnd('test')
    console.log('-------------------')
  } catch (err) {
    console.log('syncOnlineRedisList error:', err.message)
  }
}
// // 同步设备在线状态(无需添加auth请求头)
// exports.syncOnlineRedisList = async () => {
//   try {
//     // 同步redis中的最新数据
//     await writeRedis()
//     // 从redis中读取所有的设备id
//     console.time('test')
//     const [ret, devs, deviceIpString] = await Promise.all([
//       devOnlineList(),
//       redis.lrange('deviceIds', 0, -1),
//       redis.get('deviceIps')
//     ])
//     // 获取所有在线设备的id
//     const onlineList = ret.devOnlineList ? ret.devOnlineList : []
//     let online = []
//     for (var item of onlineList) {
//       let Key = item.devIp + ':' + item.port
//       if (deviceIpString) {
//         online.push(JSON.parse(deviceIpString) ? JSON.parse(deviceIpString)[Key] : '')
//       }
//     }
//     // 求差集得到所有离线设备的id
//     // let offline = devs.concat(online).filter(v => devs.includes(v) ^ online.includes(v))
//     let offline = []
//     let changeArray = []
//     for (let i = 0; i < devs.length; i++) {
//       var obj = {
//         _id: '',
//         status: false,
//         resStatus: 0
//       }
//       if (devs[i].status) {
//         const temp = online.find(devs[i].ip + ':' + devs[i].cport)
//         if (!temp) {
//           obj._id = devs[i]._id
//           changeArray.push(obj)
//           offline.push(devs[i]._id + '')
//         }
//       } else {
//         const temp = online.find(devs[i].ip + ':' + devs[i].cport)
//         if (temp) {
//           obj._id = devs[i]._id
//           obj.status = true
//           obj.resStatus = 1
//           changeArray.push(obj)
//         }
//       }
//     }
//     await Promise.all([
//       Device.updateMany({ _id: { $in: online } }, { status: true }, { multi: true }),
//       Device.updateMany({ _id: { $in: offline } }, { status: false }, { multi: true }),
//       Resource.updateMany({ eid: { $in: online } }, { status: 1 }, { multi: true }),
//       Resource.updateMany({ eid: { $in: offline } }, { status: 0 }, { multi: true })
//     ])
//     console.timeEnd('test')
//     // 视频点位实时更新
//     await devOnline(require('../../bin/www').socketio, changeArray)
//     // 广拓报警主机同步
//     let guangtuoObj = await Device.findOne({ bigtype: 1, manufacturer: 'guangtuo' }, 'ip')
//     if (!guangtuoObj) {
//       // 如果没有广拓报警主机就不同步设备状态
//       return
//     }
//     try {
//       let [alarmDevs, alarms] = await Promise.all([
//         Device.find({ bigtype: 1, manufacturer: 'guangtuo' }, 'ip cport status').exec(),
//         alarmDevsList()
//       ])
//       if (!(alarms instanceof Array)) {
//         // 北京接口返回可能为空 不是数组
//         alarms = []
//       }
//       if (_.isArray(alarms) && _.isArray(alarmDevs)) {
//         const changeArray = []
//         const online = new Set()
//         const offline = new Set()
//         const alarOnline = []
//         alarms.map(item => {
//           if (item.devState === 1) {
//             return alarOnline.push([item.devIp, true])
//           }
//         })
//         const onlineMap = new Map(alarOnline)
//         for (let i = 0; i < alarmDevs.length; i++) {
//           // status = false
//           var arrObj = {
//             _id: '',
//             status: false,
//             resStatus: 0
//           }
//           if (alarmDevs[i].status) {
//             const temp = onlineMap.get(alarmDevs[i].ip)
//             if (!temp) {
//               arrObj._id = alarmDevs[i]._id
//               changeArray.push(arrObj)
//               offline.add(alarmDevs[i]._id + '')
//             }
//           } else {
//             const temp = onlineMap.get(alarmDevs[i].ip)
//             if (temp) {
//               arrObj._id = alarmDevs[i]._id
//               arrObj.status = true
//               arrObj.resStatus = 1
//               changeArray.push(arrObj)
//               online.add(alarmDevs[i]._id + '')
//             }
//           }
//         }
//         if (changeArray.length) {
//           await Promise.all([
//             Device.updateMany({ _id: { $in: [...online] } }, { status: true }, { multi: true }),
//             Device.updateMany({ _id: { $in: [...offline] } }, { status: false }, { multi: true })
//           ])
//           // 视频点位实时更新
//           await devOnline(require('../../bin/www').socketio, changeArray)
//         }
//       }
//     } catch (error) {
//       await Device.updateMany({ bigtype: 1, manufacturer: 'guangtuo' }, { status: false }, { multi: true })
//     }
//   } catch (err) {
//     console.log('syncOnlineRedisList error:', err.message)
//   }
// }

/**
 * 获取所有在线设备（无需添加auth头）
 */
function devOnlineList () {
  return req({
    method: 'get',
    url: `/api/dev/onlinelist`,
    body: {},
    json: true,
    timeout: 5000 // 请求超时5s
  })
}

/**
 * 获取报警在线设备（无需添加auth头）
 */
function alarmDevsList () {
  return req({
    method: 'post',
    url: `/api/ctl/alarmstate`,
    body: {
      devIp: 'guangtuo',
      devPort: 2303
    },
    json: true,
    timeout: 5000 // 请求超时5s
  })
}

exports.devOnlineList = devOnlineList

// 设备重启
exports.restartDev = ({ device, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/dev/reboot`,
    method: 'post',
    body: {
      devInfo: {
        devIp: device.ip,
        devPort: parseInt(device.port)
      },
      devCtl: {
        channel: 1 // ipc设备目前写死为1
      }
    }
  })
}

// 在线获取设备信息
exports.getDevinfo = async ({ device, ctx }) => {
  if (_.isEmpty(device)) {
    return {}
  }
  try {
    const result = await req({
      ctx: ctx,
      url: `/api/dev/conf`, // 获取设备信息接口
      method: 'post',
      body: {
        devInfo: {
          devIp: device.ip,
          devPort: parseInt(device.port)
        }
      }
    })
    if (_.isEmpty(result)) {
      return {}
    }
    return {
      AlarmInputCount: result.AlarmInputCfgPrmArr ? result.AlarmInputCfgPrmArr.length : 0, // 报警输入数
      AlarmOutputCount: result.AlarmOutputCfgPrmArr ? result.AlarmOutputCfgPrmArr.length : 0, // 报警输出数
      ChanCount: result.ChanCfgPrmArr ? result.ChanCfgPrmArr.length : 0, // 视频通道数
      intercomCount: result.ChanCfgPrmArr ? result.ChanCfgPrmArr.length : 0, // 对讲数
      model: result.type ? result.type : '', // 设备型号
      name: result.name ? result.name : '' // 设备名称
    }
  } catch (err) {
    return {}
  }
}

// 删除通道
exports.delChans = ({ chanIds, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/auth/devs`, // 删除北京通道
    method: 'DELETE',
    body: {
      orgIds: [],
      channelIds: chanIds
    }
  })
}

// 删除报警输入
exports.delAlarmInputs = ({ chanId, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/alarmin`, // 删除报警输入
    method: 'DELETE',
    body: {},
    headers: {
      'X-BSC-IDS': `channelId;${chanId}`
    }
  })
}

// 删除报警输出
exports.delAlarmOutputs = ({ chanId, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/alarmout`, // 删除报警输出
    method: 'DELETE',
    body: {},
    headers: {
      'X-BSC-IDS': `channelId;${chanId}`
    }
  })
}

// 删除智能报警
exports.delIntelligenceAlarms = ({ chanIds, ctx }) => {
  const ids = chanIds.join(',')
  return req({
    ctx: ctx,
    url: `/api/alarm/intelligencealarm`, // 删除智能报警
    method: 'DELETE',
    body: {},
    headers: {
      'X-BSC-IDS': `channelId;${ids}`
    }
  })
}

// 获取所有的报警输入、输出、智能报警(已分配的)
exports.getAllAlarms = async ({ ctx }) => {
  const alarmIn = {
    ctx,
    method: 'GET',
    url: `/api/alarm/listalarmin`, // 报警输入
    body: {},
    json: true,
    timeout: 5000 // 请求超时5s
  }
  const alarmOut = {
    ctx,
    method: 'GET',
    url: `/api/alarm/listalarmout`, // 报警输出
    body: {},
    json: true,
    timeout: 5000 // 请求超时5s
  }
  const intelligenceAlarm = {
    ctx,
    method: 'GET',
    url: `/api/alarm/listintelligencealarm`, // 智能报警
    body: {},
    json: true,
    timeout: 5000 // 请求超时5s
  }
  try {
    let [alarmInList, alarmOutList, intelligenceAlarmList] = await Promise.all([
      req(alarmIn),
      req(alarmOut),
      req(intelligenceAlarm)
    ])
    alarmInList = alarmInList.AlarminList ? alarmInList.AlarminList : []
    alarmOutList = alarmOutList.AlarmOutList ? alarmOutList.AlarmOutList : []
    intelligenceAlarmList = intelligenceAlarmList.IntelligenceAlarmList
      ? intelligenceAlarmList.IntelligenceAlarmList
      : []
    const existedHash = {}
    const newIntelligenceAlarmList = []
    intelligenceAlarmList.forEach(item => {
      if (!existedHash[item.channelId + '']) {
        existedHash[item.channelId + ''] = true
        newIntelligenceAlarmList.push(item)
      }
    })
    intelligenceAlarmList = newIntelligenceAlarmList
    return { alarmInList, alarmOutList, intelligenceAlarmList }
  } catch (err) {
    console.log(err.message)
    return { alarmInList: [], alarmOutList: [], intelligenceAlarmList: [] }
  }
}

// 获取所有的报警输入(已分配的)
exports.getAllAlarmIns = async ({ ctx }) => {
  try {
    const alarmInList = await req({
      ctx: ctx,
      url: `/api/alarm/listalarmin`, // 报警输入
      method: 'GET',
      body: {}
    })
    return alarmInList.AlarminList ? alarmInList.AlarminList : []
  } catch (err) {
    console.log(err.message)
    return []
  }
}

// 获取所有的报警输出(已分配的)
exports.getAllAlarmOuts = async ({ ctx }) => {
  try {
    const alarmInList = await req({
      ctx: ctx,
      url: `/api/alarm/listalarmout`, // 报警输出
      method: 'GET',
      body: {}
    })
    return alarmInList.AlarmOutList ? alarmInList.AlarmOutList : []
  } catch (err) {
    console.log(err.message)
    return []
  }
}

// 获取所有的智能报警(已分配的)
exports.getAllIntelligenceAlarms = async ({ ctx }) => {
  // eslint-disable-line
  try {
    const alarmInList = await req({
      ctx: ctx,
      url: `/api/alarm/intelligencealarm`, // 智能报警
      method: 'GET',
      body: {}
    })
    return alarmInList.IntelligenceAlarmList ? alarmInList.IntelligenceAlarmList : []
  } catch (err) {
    console.log(err.message)
    return []
  }
}

// 根据用户名获取用户信息
exports.getUserInfoByName = async ({ uname, ctx }) => {
  try {
    const userinfo = await req({
      ctx: ctx,
      url: `/api/auth/getuser?username=${uname}`,
      method: 'GET',
      body: {}
    })
    return userinfo.alarmDev && userinfo.alarmDev.channeList ? userinfo.alarmDev.channeList : []
  } catch (err) {
    console.log(err.message)
    return {}
  }
}

// 添加报警输入
exports.addAlarmIn = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/alarmin`, // 添加报警输入
    method: 'POST',
    body: ctx.request.body
  })
}

// 删除报警输入
exports.delAlarmIn = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/alarmin`, // 删除报警输入
    method: 'DELETE',
    body: ctx.request.body,
    headers: ctx.headers
  })
}

// 添加报警输出
exports.addAlarmOut = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/alarmout`, // 添加报警输出
    method: 'POST',
    body: ctx.request.body
  })
}

// 删除报警输出
exports.delAlarmOut = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/alarmout`, // 删除报警输出
    method: 'DELETE',
    body: ctx.request.body,
    headers: ctx.headers
  })
}

// 添加智能报警
exports.addIntelligenceAlarm = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/intelligencealarm`, // 添加智能报警
    method: 'POST',
    body: ctx.request.body
  })
}

// 删除智能报警
exports.delIntelligenceAlarm = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/intelligencealarm`, // 删除智能报警
    method: 'delete',
    body: ctx.request.body,
    headers: ctx.headers
  })
}
// 添加输入防区
exports.addFireAlarmIn = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/firealarm/add`, // 添加输入防区
    method: 'POST',
    body: ctx.request.body
  })
}

// 删除输入防区
exports.delFireAlarmIn = ({ ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/alarm/firealarm/del`, // 删除输入防区
    method: 'post',
    body: {
      fireAlarmList: ctx.query.ids.split(',').map(item => {
        return { _id: item }
      })
    }
  })
}

// 获取拼接控制器源
exports.getJointInput = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/stictchingInputStateGet`,
    method: 'post',
    body
  })
}

// 布防
exports.alarmArm = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmarm`,
    method: 'post',
    body
  })
}

// 撤防
exports.alarmDisarm = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmdisarm`,
    method: 'post',
    body
  })
}

// 报警清除
exports.alarmClean = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmclean`,
    method: 'post',
    body
  })
}

// 旁路
exports.alarmBypass = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmbypass`,
    method: 'post',
    body
  })
}

// 撤旁
exports.alarmPass = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmpass`,
    method: 'post',
    body
  })
}

// 电子围栏设备(厂商都是guagntuo)的布防，撤防，报警清除，旁路，撤旁
exports.AlarmControl = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmdevctrl`,
    method: 'post',
    body
  })
}
// 获取设备的布撤防状态
exports.alarmStatus = (ctx, body) => {
  return req({
    ctx: ctx,
    url: `/api/ctl/alarmstatus`,
    method: 'post',
    body
  })
}
// 修改消防主机的输入防区的时候向北京发送通知
exports.fireAlarmChange = ({ ctx, data }) => {
  return req({
    ctx: ctx,
    url: `api/ctl/setDevFireAlarm`,
    method: 'post',
    body: data
  }).catch(err => {
    console.log(err)
  })
}
// 修改平台互联配置，向北京发送通知
exports.platformConfigChange = () => {
  return req({
    url: '/api/ctl/cfgSgwServer',
    method: 'post',
    body: {}
  })
}
// 获取国创消防设备
exports.getKDFireAlarmList = (data) => {
  return req({
    url: '/api/ctl/getKDFireAlarmList',
    method: 'post',
    body: data
  })
}
