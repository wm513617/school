/*
 * 机构订阅
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:50:57
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 14:50:57
 */

const postal = require('postal')
// const config = require('../../../../config').backend
// const rp = require('request-promise')

const { delOrgs } = require('../../bstar/org.interface')

// 机构删除订阅
postal.subscribe({
  channel: 'orgs',
  topic: 'item.delete',
  callback: async function (data, envelope) {
    if (data && data.id) {
      await delOrgs({ orgIds: [data.id], ctx: data.ctx })
    }
  }
})

// // 删除机构时调用北京接口
// async function delOrgs(orgIds) {
//   const options = {
//     method: 'DELETE',
//     uri: `${config.serviceUrl}/api/auth/devs`,      // 删除设备
//     body: {
//       orgIds: orgIds,
//       channelIds: []
//     },
//     json: true,
//     timeout: 5000       // 请求超时5s
//   }
//   try {
//     await rp(options)
//   } catch (err) {
//     throw err
//   }
// }
