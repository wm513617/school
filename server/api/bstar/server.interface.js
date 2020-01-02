/*
* 服务器调取接口
* @Author: lushengying
* @Date: 2018-09-18 14:37:05
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-10-10 14:47:25
*/

const { req } = require('./req')

// 获取服务器列表 Servername值为 da:获取所有DA信息。ds:获取所有ds信息。ts:获取所有ts信息
exports.getServer = async (ctx, servertype) => {
  try {
    const serverlist = await req({
      ctx: ctx,
      url: `/api/service/list?servername=${servertype}`,
      method: 'GET',
      body: {}
    })
    return serverlist
  } catch (err) {
    console.log(err.message)
    return []
  }
}
