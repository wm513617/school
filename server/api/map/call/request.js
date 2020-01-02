/*
 * @Author: linhang
 * @Date: 2019-07-16 10:05:41
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-25 14:07:24
 */
'use strict'
const rp = require('request-promise').defaults({ json: true })
module.exports = async (options, auth) => {
  try {
    const defaults = {
      timeout: 5000,
      method: 'get',
      headers: {
        Authorization: auth
      }
    }
    options = Object.assign(defaults, options)
    options.uri = encodeURI(
      `http://${options.option.ip}:${options.option.port}/spcc/interface/json/${options.option.queryStr}`
    )
    delete options.option
    const data = await rp(options)
    return data
  } catch (error) {
    throw error
  }
}
