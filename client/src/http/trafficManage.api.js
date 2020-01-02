import {
  get, put
} from './base'

/* 交通管理高级参数获取 */
export const trafficHighList = (data) => {
  const params = {
    url: '/setting/traffic/server/verification/list'
  }
  return get(params)
}
/*  交通管理高级参数编辑 */
export const trafficHighEdit = (data) => {
  const params = {
    body: {
      score: data.score,
      days: data.days
    },
    url: '/setting/traffic/server/verification/edit/' + data.id
  }
  return put(params)
}
