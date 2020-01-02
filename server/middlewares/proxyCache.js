/*
 * @Author: hansen.liuhao
 * @Date: 2018-06-20 11:07:31
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-05-30 17:50:12
 */

const URL = require('url').URL
const request = require('request')
let host = ''

exports.proxyHost = address => {
  address = address.replace(/http:\/\//g, '')
  host = 'http://' + address
}

exports.proxy = options => {
  return new Promise((resolve, reject) => {
    if (host === '') {
      reject(new Error('找不到主机'))
    }
    var ctx = options.ctx
    var url = new URL(ctx.path, host)
    var opt = {
      url: url + (ctx.querystring ? '?' + ctx.querystring : ''),
      headers: ctx.header,
      encoding: null,
      followRedirect: true,
      method: ctx.method
    }
    opt.headers.host = host.slice(host.indexOf('://') + 3).replace(/\/$/, '')
    request(opt, function(error, res) {
      if (error) {
        throw error
      }
      ctx.status = res.statusCode
      for (var name in res.headers) {
        if (name === 'transfer-encoding') {
          continue
        }
        ctx.set(name, res.headers[name])
      }
      ctx.body = res.body
      resolve()
    })
  })
}
