/*
 * @Author: hansen.liuhao
 * @Date: 2019-08-27 11:35:
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-29 11:46:01
 * @description: 获取智能交通服务海康9600组织与设备
 */

const { req } = require('./req')

/**
 * 获取智能交通海康9600组织
 */
exports.getHikVison9600Org = async (ctx, body) => {
  try {
    return req({
      ctx: ctx,
      url: `/api/hkplat/organiza`,
      method: 'POST',
      body: body,
      timeout: 20000
    })
  } catch (err) {
    console.log(err.message)
    return []
  }
}
/**
 * 获取智能交通海康9600设备
 */
exports.getHikVison9600Device = async (ctx, body) => {
  try {
    return req({
      ctx: ctx,
      url: `/api/hkplat/device`,
      method: 'POST',
      body: body,
      timeout: 20000
    })
  } catch (err) {
    console.log(err.message)
    return []
  }
}
