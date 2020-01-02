import { get } from '../base'

/**
 * 获取跟ID
 */
export const getRootNum = () => {
  const param = {
    url: '/setting/org/root/0'
  }
  return get(param)
}

/**
 * 获取导航Org内容
 */
export const getOrgList = (obj) => {
  const param = {
    query: {
      type: obj.type
    },
    url: '/setting/org/' + obj.id
  }
  return get(param)
}
