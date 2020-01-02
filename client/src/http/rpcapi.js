import Vue from 'vue'
import _ from 'lodash'
import CryptoJS from 'crypto-js'
const Base64 = require('js-base64').Base64

var id = 0
// 获取登录后的带token的后半部分url
function getUrlTokenQuery() {
  const key = 'Bluesky-G2-001'
  const timestamp = (Date.parse(new Date()) / 1000).toString()
  const tokenStr = CryptoJS.HmacSHA1(timestamp, key).toString()
  const token = Base64.encode(tokenStr)
  return `&timestamp=${timestamp}&token=${token}`
}

export const rpcCall = (url, method, params, addTokenQuery = false) => {
  ++id
  var requestData = {
    jsonrpc: '2.0',
    id: id,
    method: 'brest',
    params: {
      call: method,
      args: params
    }
  }
  // 服务端口为8000
  // url = 'http://localhost:8000' + url
  if (addTokenQuery) {
    url += getUrlTokenQuery()
  }
  return Vue.http.post(url, requestData, { timeout: 60000, baseURL: '' }).then((resp) => {
    if (resp.status !== 200) {
      return Promise.reject(resp.data)
    }
    if (_.isString(resp.data)) {
      try {
        resp.data = JSON.parse(resp.data)
      } catch (err) {
        console.log('rpcCall exception')
        console.log(err)
        resp.data = err
        resp.data.result = { errno: -1 }
      }
    }
    return resp.data
  })
}

export const newRpcCall = (url, method, params, addTokenQuery = false) => {
  return new Promise((resolve, reject) => {
    rpcCall(url, method, params, addTokenQuery).then((suc) => {
      const result = suc.result
      if (result.errno !== '0') {
        reject(result.errno)
        return
      }
      resolve(result.args)
    }).catch(err => {
      reject(err)
    })
  })
}

export const rpcGet = (url, method, params, addTokenQuery = false) => {
  return url + '&call=' + method + ((obj) => {
    let str = ''
    for (const i in obj) {
      str += '&' + i + '=' + obj[i]
    }
    return str
  })(params)
}
