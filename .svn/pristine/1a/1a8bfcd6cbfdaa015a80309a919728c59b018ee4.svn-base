/*
 * 设备相关订阅
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:48:52
 * @Last Modified by: linhang
 * @Last Modified time: 2019-04-19 10:02:42
 */

const postal = require('postal')

const { devLogin, devLogout, devNotice } = require('../../bstar/dev.interface')
const { updateMonitorChannelAndDevice } = require('../tvWall/monitor/monitor.controller')
const { updateSenceResource } = require('../tvWall/scene/scene.controller')
const { updatePollingResource } = require('../tvWall/polling/polling.controller')
const { updateFavouriteResource } = require('../favorite/favorite.controller')
// 设备登录订阅
postal.subscribe({
  channel: 'devices',
  topic: 'item.login',
  callback: async function (data, envelope) {
    if (data && data.device) {
      await devLogin({ device: data.device, ctx: data.ctx })
    }
  }
})

// 设备登出订阅
postal.subscribe({
  channel: 'devices',
  topic: 'item.logout',
  callback: async function (data, envelope) {
    if (data && data.device) {
      await devLogout({ device: data.device, ctx: data.ctx })
    }
  }
})

// 设备资源更新通知
postal.subscribe({
  channel: 'devices',
  topic: 'item.notice',
  callback: async function (data, envelope) {
    await devNotice({ ctx: data.ctx, data: data.data })
  }
})

// 设备信息更新通知
// postal.subscribe({
//   channel: 'devices',
//   topic: 'item.update',
//   callback: async function (data, envelope) {
//     await devUpdate({ ctx: data.ctx })
//   }
// })

// IPC设备删除订阅
postal.subscribe({
  channel: 'devices',
  topic: 'item.deleteIPC',
  callback: async function (data, envelope) {
    await Promise.all([updateFavouriteResource(data), updateSenceResource(data), updatePollingResource(data)])
  }
})
// 解码器设备删除订阅
postal.subscribe({
  channel: 'devices',
  topic: 'item.deleteDecoder',
  callback: async function (data, envelope) {
    await updateMonitorChannelAndDevice(data)
  }
})

// // 设备登陆接口
// async function devLogin(device) {
//   const options = {
//     method: 'POST',
//     uri: `${config.serviceUrl}/api/dev/login`,      // 获取设备信息接口
//     body: {
//       devIp: device.ip,
//       devPort: parseInt(device.cport),
//       vendor: device.manufacturer,
//       username: device.username,
//       passwd: device.password,
//       devType: parseInt(device.bigtype) === 5 ? 'decoder' : device.type,
//       connMode: device.connMode || 'active'
//     },
//     json: true,
//     timeout: 5000       // 请求超时5s
//   }
//   try {
//     return await rp(options)
//   } catch (err) {
//     throw err
//   }
// }

// // 设备资源更新通知接口
// async function devNotice() {
//   const options = {
//     method: 'GET',
//     uri: `${config.serviceUrl}/api/notice/dev`,
//     body: {},
//     json: true,
//     timeout: 5000       // 请求超时5s
//   }
//   try {
//     await rp(options)
//   } catch (err) {
//     throw err
//   }
// }

// // 设备登出
// async function devLogout(device) {
//   const options = {
//     method: 'POST',
//     uri: `${config.serviceUrl}/api/dev/logout`,      // 获取设备信息接口
//     body: {
//       devIp: device.ip,
//       devPort: parseInt(device.cport),
//       vendor: device.manufacturer
//     },
//     json: true,
//     timeout: 5000       // 请求超时5s
//   }
//   try {
//     return await rp(options)
//   } catch (err) {
//     throw err
//   }
// }
