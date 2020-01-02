/*
 * @Author: chenkaibo
 * @Date: 2018-06-05 14:24:07
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-04 19:32:40
 */
const rp = require('request-promise').defaults({ json: true })

const req = async options => {
  const defaults = { timeout: 5000 }
  options = Object.assign(defaults, options)
  options.uri = `http://${options.host.ip}:${options.host.port}/${options.uri}`
  delete options.host
  return rp(options)
}

exports.req = req
