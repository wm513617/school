import { get } from './base'
export const getSingleLogApi = data => {
  const param = {
    url: '/setting/sentry/log',
    query: data
  }
  return get(param)
}
