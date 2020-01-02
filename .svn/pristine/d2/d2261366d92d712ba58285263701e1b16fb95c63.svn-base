import { get } from '../base'
import Vue from 'vue'
import store from '../../store'
/**
 *获取历史对讲列表
 * */
export const getHistoryIntercomListApi = data => {
  const param = {
    url: '/intercom/scense/history',
    query: data
  }
  return get(param)
}
/**
 * 下载历史对讲数据
 * */
export const exportHistoryIntercomDetailApi = data => {
  const param = {
    url: '',
    body: {}
  }
  return get(param)
}
/**
 * 删除历史对讲数据
 * */
export const deleteHistoryIntercomDetailApi = data => {
  const param = {
    url: '/intercom/scense/history',
    body: data || {}
  }
  return new Promise((resolve, reject) => {
    Vue.http.delete(param.url, {
      data: param.body
    }).then(res => {
      if (res.status === 401) {
        reject('与服务器断开连接')
        store.dispatch('logoutFun')
      } else {
        resolve(res)
      }
    }).catch(err => reject(err))
  })
}
