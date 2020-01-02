import { post } from '../base'
/**
 * 输出控制api
 */
export const outputControlApi = payload => {
  const param = {
    url: '/ctl/setDevAlarmOutPut',
    body: payload
  }
  return post(param)
}
