import { get } from 'http/base.js'

const http = {
  get
}

function getList({
  limit,
  page,
  userName = null,
  startTime = null,
  endTime = null,
  logType = null,
  state = null,
  target = null,
  operateContent = null
}) {
  const params = {
    limit,
    page,
    userName,
    startTime,
    endTime,
    logType,
    state,
    target,
    operateContent
  }
  return http
    .get({
      url: 'setting/user/log',
      query: params
    })
    .then(res => res)
    .catch(err => err.response)
}

export default {
  getList
}
