const CryptoJS = require('crypto-js')
const Base64 = require('js-base64').Base64
const rp = require('request-promise')

var id = 0
/**
 * 获取登录后的带token的后半部分url
 * @returns token query url string
 */
function getUrlTokenQuery () {
  const key = 'Bluesky-G2-001'
  const timestamp = (Date.parse(new Date()) / 1000).toString()
  const tokenStr = CryptoJS.HmacSHA1(timestamp, key).toString()
  const token = Base64.encode(tokenStr)
  return `&timestamp=${timestamp}&token=${token}`
}

/**
 * rpc远程调用
 * @param {string} ip
 * @param {number} port
 * @param {string} url
 * @param {string} method
 * @param {object} params
 * @param {boolean} addTokenQuery
 */
const rpcCall = async (ip, port, url, method, params, addTokenQuery = false) => {
  var requestData = {
    jsonrpc: '2.0',
    id: ++id,
    method: 'brest',
    params: {
      call: method,
      args: params
    }
  }
  if (addTokenQuery) {
    url += getUrlTokenQuery()
  }
  const options = {
    method: 'post',
    uri: `${ip}:${port}${url}`,
    body: requestData,
    json: true
  }
  try {
    const result = await rp(options)
    return {
      result: result,
      err: ''
    }
  } catch (err) {
    return {
      result: null,
      err: err
    }
  }
}

exports.rpcCall = rpcCall
