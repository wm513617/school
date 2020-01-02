/*
 * @Author: linhang
 * @Date: 2018-12-20 17:23:37
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-24 20:16:58
 */
class Store {
  constructor () {
    this.session = {}
    this.loginTimes = {}
  }
  /**
   * 设置session
   * @param {*} id // session唯一标识
   */
  // setSession (id) {
  //   this.session[id] = 'online'
  // }
  /**
   * 销毁session
   * @param {*} id // session标识
   */
  // clearSession (id) {
  //   delete this.session[id]
  // }
  /**
   * 获取session信息
   * @param {*} id // session标识
   */
  // getSession () {
  //   return this.session
  // }
  /**
   * 设置登录次数
   * @param {*} id // session标识
   * @param {*} expire // 过期时间
   */
  setLoginTimes (id, expire) {
    const now = new Date().getTime()
    if (this.loginTimes[id]) {
      this.loginTimes[id].times++
      this.loginTimes[id].expire = now + expire
    } else {
      this.loginTimes[id] = { times: 1, expire: now + expire }
    }
  }
  /**
   * 解除锁定
   * @param {*} name
   * @param {*} time
   */
  unlockUser (name, time) {
    setTimeout(() => {
      delete this.loginTimes[name]
    }, time * 1000)
  }
  /**
   * 获取登录次数信息
   * @param {*} id session标识
   */
  getLoginTimes (id) {
    return this.loginTimes[id]
  }
  /**
   * 清除登录次数
   * @param {*} id session标识
   */
  clearLoginTime (id) {
    delete this.loginTimes[id]
  }
}

module.exports = new Store()
