/*
 * @Description: 商汤刷新Token方法
 * @Author: MeiChen
 * @Date: 2019-11-11
 */
const configModel = require('../serviceConfig/serviceConfig.model')
const rp = require('request-promise')
global.senseTimeToken = { // 用一个全局变量存储token，以作为多模块间共享
  token: '',
  base64: ''
}
module.exports = {
  async refreshToken () { // 刷新商汤服务器用户token
    let senseConfig = await configModel.findOne({type: 2}).lean(true)
    if (senseConfig !== null) {
      let userToken = await rp({
        method: 'POST',
        url: `http://${senseConfig.ip}:${senseConfig.port}/senseguard-oauth2/api/v1/login`,
        json: true,
        body: {
          username: senseConfig.userName,
          password: senseConfig.passWord
        }
      })
      global.senseTimeToken = {
        token: userToken.accessToken,
        base64: Buffer.from(userToken.accessToken).toString('base64')
      }
    }
  },
  async getToken () { // 获取用户token
    if (!global.senseTimeToken.token) { // 第一次检测，如果token字段为空，则先获取一次token
      await this.refreshToken()
    }
    return global.senseTimeToken
  }
}
