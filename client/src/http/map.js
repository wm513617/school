import Vue from 'vue'
export const get = (param) => {
  return Vue.http.get(param.url, {
    params: param.query || {}
  })
}
export const post = (param) => {
  return Vue.http.post(param.url, param.body)
}
export const put = (param) => {
  return Vue.http.put(param.url, param.body)
}
export const remove = (param) => {
  return Vue.http.delete(param.url, {
    params: param.query || {}
  })
}
