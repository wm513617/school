import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '../router'
import { Notice } from 'bs-iview'
// Vue.http.options.emulateJSON = true
// Vue.http.options.root = '/api'

const requestMap = {}

// response interceptor
axios.interceptors.request.use(request => {
  let key
  // abort the same post request
  if (/POST|PUT|DELETE/.test(request.method)) {
    key = `${request.method}${request.url}${JSON.stringify(request.body)}`
    // abort the existed request
    if (key && requestMap[key]) {
      key = null
      setTimeout(() => {
        request.abort()
      })
    } else {
      requestMap[key] = request
    }
  }
  if (store.getters.loggedIn) {
    // if logged in, add the token to the header
    request.headers.common.Authorization = `Bearer ${
      store.getters.accessToken
    }`
  }
  return request
})

axios.interceptors.response.use(
  response => {
    // delete current request in the map
    const request = response.request
    let key
    if (/POST|PUT|DELETE/.test(request.method)) {
      key = `${request.method}${request.url}${JSON.stringify(request.body)}`
      delete requestMap[key]
    }
    return response
  },
  error => {
    switch (error.response.status) {
      // case 400:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E400')
      //   })
      //   break
      // case 401:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E401')
      //   })
      //   break
      // case 403:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E403')
      //   })
      //   break
      // case 404:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E404')
      //   })
      //   break
      case 412:
        Vue.$Notice.error({
          title: Vue.t('http.error.E412')
        })
        break
      // case 500:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.E500')
      //   })
      //   break
      // default:
      //   Vue.$Notice.error({
      //     title: Vue.t('http.error.others'),
      //   })
    }
    return Promise.reject(error)
  }
)
