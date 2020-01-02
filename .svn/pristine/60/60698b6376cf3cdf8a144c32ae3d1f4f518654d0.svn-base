/**
 * 北京-录像管理通知接口
 * @time:2017-8-1
 * @author: hansen
 */

'use strict'
const request = require('./req').req
// 计划模板增加、删除、更新通知接口
const info = (ctx, data) => {
  return request({
    ctx,
    method: 'POST',
    body: data,
    url: '/api/notice/info'
  })
}
module.exports = {
  info
}
