/*
* @Author: chenkaibo
* @Date: 2018-06-05 15:18:00
* @Last Modified by: chenkaibo
* @Last Modified time: 2018-06-05 15:28:54
*/

const { req } = require('./req')

// 删除机构时调用北京接口
exports.delOrgs = ({ orgIds, ctx }) => {
  return req({
    ctx: ctx,
    url: `/api/auth/devs`, // 删除机构时调用北京接口
    method: 'DELETE',
    body: {
      orgIds: orgIds,
      channelIds: []
    }
  })
}
