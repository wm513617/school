
import {get, post, remove} from './base'

export const getDutyListApi = (name) => get({
  url: '/business/duty/dutylist' + name,
  query: {}
})

export const getDutyByNameApi = (name) => get({
  url: '/business/duty/byname',
  query: name
})
export const getNoticeApi = () => get({
  url: '/business/duty/notice',
  query: {}
})
export const setNoticeApi = (body) => post({
  url: '/business/duty/notice',
  body: body
})
export const deletedNoticeApi = (body) => remove({
  url: '/business/duty/notice',
  body: body
})
