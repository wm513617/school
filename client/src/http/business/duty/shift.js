import { get } from 'http/base.js'

const http = {
  get
}

function getList({ name = null, startTime = null, endTime = null, limit, page }) {
  const params = { key: name, startTime, endTime, limit, page }
  return http
    .get({
      url: 'setting/user/changeLog',
      query: params
    })
    .then(res => res)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

export default {
  getList
}
