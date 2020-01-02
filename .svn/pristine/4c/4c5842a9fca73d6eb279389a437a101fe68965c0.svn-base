import {
  post, get, put, remove
} from './base'

/* 获取对讲服务器配置 */
export const getTalkServerApi = () => {
  const param = {
    url: '/intercom/conf/server'
  }
  return get(param)
}

/* 修改服务器配置 */
export const editTalkServerApi = data => {
  const param = {
    url: '/intercom/conf/server',
    body: data
  }
  return put(param)
}

/* 获取对讲台麦列表 */
export const getTalkMicroPhoneApi = data => {
  const param = {
    url: '/intercom/conf/microphone',
    query: data
  }
  return get(param)
}

/* 添加对讲台麦 */
export const addTalkMicroPhoneApi = data => {
  const param = {
    url: '/intercom/conf/microphone',
    body: data
  }
  return post(param)
}

/* 修改对讲台麦 */
export const editTalkMicroPhoneApi = data => {
  const param = {
    url: '/intercom/conf/microphone/' + data.id,
    body: data.body
  }
  return put(param)
}

/* 删除对讲台麦 */
export const deleteTalkMicroPhoneApi = data => {
  console.log(data, '22222222')
  const param = {
    url: '/intercom/conf/microphone'
  }
  return remove(param, {data: data})
}

/* 获取对讲终端列表 */
export const getTalkTerminalApi = data => {
  const param = {
    url: '/intercom/conf/terminal',
    query: data
  }
  return get(param)
}

/* 添加对讲终端 */
export const addTalkTerminalApi = data => {
  const param = {
    url: '/intercom/conf/terminal',
    body: data
  }
  return post(param)
}

/* 修改对讲终端 */
export const editTalkTerminalApi = data => {
  const param = {
    url: '/intercom/conf/terminal/' + data.id,
    body: data.body
  }
  return put(param)
}

/* 删除对讲终端 */
export const deleteTalkTerminalApi = data => {
  const param = {
    url: '/intercom/conf/terminal'
  }
  return remove(param, {data: data})
}
