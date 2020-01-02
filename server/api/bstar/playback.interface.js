/*
 * @Author: chenkaibo
* @Date: 2018-06-05 15:18:13
* @Last Modified by:   chenkaibo
* @Last Modified time: 2018-06-05 15:18:13
*/

const req = require('./req')
/**
 * 录像查询
 */
exports.query = (ctx) => {
  try {
    return req({
      ctx,
      url: '/api/record/query',
      method: 'POST'
    })
  } catch (error) {
    console.log(error)
  }
}

exports.playback = (ctx) => {
  try {
    return req({
      ctx,
      url: ''
    })
  } catch (error) {
    console.log(error)
  }
}
