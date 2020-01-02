/**
 * 人脸识别用服务接口
 * @time:2017-7-10
 * @author: hansen
 */
'use strict'
const mongoose = require('mongoose')
const ServerSetting = mongoose.model('ServerSetting')
const Algorithm = mongoose.model('FaceAlgorithm')
const _ = require('lodash')
const CONSTANTS = require('../face.constants').FACE
const rp = require('request-promise').defaults({ jar: true, json: true })
let [config, algorithm, isOpen, isLogin, host] = [null, null, false, false, '']
const { proxyHost } = require('../../../middlewares/proxyCache')

// 初始化加载服务配置及算法
const init = async () => {
  // 获取服务配置
  config = await ServerSetting.findOne({ type: CONSTANTS.SERVERCFG.TYPE })
  if (_.isNull(config)) {
    return false
  }
  // 获取算法配置
  algorithm = await Algorithm.findOne({ type: config.vender })
  proxyHost(config.ip)
  if (_.isNull(algorithm)) {
    return false
  }
  return true
}
// 登录系统
const login = async () => {
  try {
    const response = await rp({
      method: algorithm.loginApi.method,
      url: host + algorithm.loginApi.url,
      headers: algorithm.loginApi.headers,
      timeout: algorithm.timeout || 1000,
      resolveWithFullResponse: true,
      form: {
        username: config.username,
        password: config.password
      }
    })
    if (response.body && response.body.code === 0) {
      isLogin = true
    }
  } catch (error) {
    // console.log('location: face.service.js->login fail')
    console.log(error.message)
  }
}
// 检测服务器是否可用
const checkOpen = () => {
  if (!isOpen) {
    throw new Error('服务器配置或者算法配置找不到，人脸服务已经锁定！')
  }
}
exports.startUpOrUpdateServerCfg = async () => {
  const isTure = await init()
  if (!isTure) {
    isOpen = false
    return
  }
  isOpen = true // 获取服务配置或者算法后重新打开服务
  isLogin = false // 获取服务配置或者算法后重新登录
  host = 'http://' + config.ip + ':' + (config.port || 80)
}
exports.createPerson = async params => {
  try {
    checkOpen()
    if (!isLogin) {
      await login()
    }
    const result = await rp({
      uri: host + algorithm.createUserApi.url,
      method: algorithm.createUserApi.method,
      body: params.data
    })
    return result
  } catch (error) {
    // console.log('location: face.service.js->create user info')
    console.log(error.message)
    isLogin = false
    return null
  }
}
exports.updatePerson = async params => {
  try {
    const url = host + algorithm.updateUserApi.url.toString().replace(/:id/, params.id)
    checkOpen()
    if (!isLogin) {
      await login()
    }
    const result = await rp({
      uri: url,
      method: algorithm.updateUserApi.method,
      body: params.data
    })
    return result
  } catch (error) {
    // console.log('location: face.service.js->update user info')
    console.log(error.message)
    isLogin = false
    return null
  }
}
exports.removePerson = async params => {
  try {
    const url = host + algorithm.deleteUserApi.url.toString().replace(/:id/, params.id)
    checkOpen()
    if (!isLogin) {
      await login()
    }
    const result = await rp({
      uri: url,
      method: algorithm.deleteUserApi.method
    })
    return result
  } catch (error) {
    // console.log('location: face.service.js->delete user info')
    console.log(error.message)
    isLogin = false
    return null
  }
}
exports.uploadImage = async params => {
  try {
    checkOpen()
    if (!isLogin) {
      await login()
    }
    const result = await rp({
      uri: host + algorithm.uploadApi.url,
      method: algorithm.uploadApi.method,
      formData: params
    })
    return result
  } catch (error) {
    // console.log('location: face.service.js->upload face picture')
    console.log(error.message)
    isLogin = false
    return null
  }
}
exports.getHistroy = async params => {
  try {
    checkOpen()
    if (!isLogin) {
      await login()
    }
    const result = await rp({
      uri: host + algorithm.historyApi.url,
      method: algorithm.historyApi.method,
      resolveWithFullResponse: true,
      timeout: 1000,
      qs: params
    })
    const body = {
      data: result.body.data,
      time: parseInt(new Date(result.headers['date']).valueOf() / 1000)
    }
    return body
  } catch (error) {
    // console.log('location: face.service.js->get face history data')
    console.log(error.message)
    isLogin = false
    return null
  }
}
