const config = require('../../../config').backend
const _ = require('lodash')
const rp = require('request-promise').defaults({ baseUrl: config.serviceUrl })
exports.req = async ({ ctx = null, url, method = 'GET', body = {}, headers = {}, timeout = 10000 }) => {
  const reqHeader = {}
  if (_.hasIn(ctx, 'header.authorization')) {
    reqHeader.headers = {
      Authorization: `Bearer ${ctx.headers.authorization}`
    }
  }
  // 合并请求头
  _.assign(reqHeader.headers, headers)
  return rp(
    _.assign(
      {
        method: method,
        uri: url,
        body: body,
        json: true,
        timeout: timeout
      },
      reqHeader
    )
  )
}
