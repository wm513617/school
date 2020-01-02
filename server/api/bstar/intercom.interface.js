/*
 * @Author: chenkaibo
 * @Date: 2018-06-05 15:18:13
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-16 13:37:55
 */

const { req } = require('./req')
/**
 * 录像查询
 */
exports.shibangopentalk = (ctx, body) => {
  try {
    return req({
      ctx,
      url: '/api/ctl/shibangopentalk',
      method: 'POST',
      body
    })
  } catch (error) {
    console.log(error)
  }
}

exports.shibangclosetalk = (ctx, body) => {
  try {
    return req({
      ctx,
      url: '/api/ctl/shibangclosetalk',
      method: 'POST',
      body
    })
  } catch (error) {
    console.log(error)
  }
}

exports.shibanganswertalk = (ctx, body) => {
  try {
    return req({
      ctx,
      url: '/api/ctl/shibanganswertalk',
      method: 'POST',
      body
    })
  } catch (error) {
    console.log(error)
  }
}
