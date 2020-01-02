import Vue from 'vue'
import store from '../store'

export const get = (param) => {
  return new Promise((resolve, reject) => {
    Vue.http.get(param.url, {
      params: param.query || {},
      headers: param.headers || {}
    }).then(res => {
      if (res.status === 401) {
        reject('与服务器断开连接')
        store.dispatch('logoutFun')
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
export const post = (param, config = {}) => {
  return new Promise((resolve, reject) => {
    Vue.http.post(param.url, param.body, config).then(res => {
      if (res.status === 401) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('与服务器断开连接')
        store.dispatch('logoutFun')
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
export const put = (param, config = {}) => {
  return new Promise((resolve, reject) => {
    Vue.http.put(param.url, param.body, config).then(res => {
      if (res.status === 401) {
        reject(new Error('与服务器断开连接'))
        store.dispatch('logoutFun')
      } else {
        resolve(res)
      }
    }).catch(err => reject(err))
  })
}
export const remove = (param, config = {}) => {
  return new Promise((resolve, reject) => {
    Vue.http.delete(param.url, config).then(res => {
      if (res.status === 401) {
        reject('与服务器断开连接')
        store.dispatch('logoutFun')
      } else {
        resolve(res)
      }
    }).catch(err => reject(err))
  })
}
