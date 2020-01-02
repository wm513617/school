/*
 * @Author: linhang
 * @Date: 2019-07-16 10:05:41
 * @Last Modified by: linhang
 * @Last Modified time: 2019-08-21 09:25:20
 */
'use strict'
const rp = require('request-promise').defaults({ json: true })
module.exports = async option => {
  try {
    const defaults = {
      timeout: 5000
    }
    option = Object.assign(defaults, option)
    option.uri = encodeURI(`http://${option.host.ip}:${option.host.port}/${option.queryStr}`)
    delete option.host
    delete option.queryStr
    const data = await rp(option)
    return data
  } catch (error) {
    throw error
  }
}
