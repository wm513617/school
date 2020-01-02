import { get, post, put, remove } from './base'

// 获取服务器信息
export const getServerInfoApi = () => {
  const param = {
    url: '/map/call'
  }
  return get(param)
}

// 新增服务器信息
export const postServerInfoApi = playod => {
  const param = {
    url: '/map/call',
    body: playod
  }
  return post(param)
}

// 获取坐席列表
export const getSeatListApi = () => {
  const param = {
    url: '/map/call/phone'
  }
  return get(param)
}

// 新增坐席信息
export const postAddSeatInfoApi = playod => {
  const param = {
    url: '/map/call/phone',
    body: playod
  }
  return post(param)
}

// 修改坐席信息
export const putModifySeatInfoApi = playod => {
  const param = {
    url: '/map/call/phone/' + playod._id,
    body: playod.body
  }
  return put(param)
}

// 删除坐席信息
export const removeSeatInfoApi = playod => {
  const param = {
    url: '/map/call/phone/' + playod._id
  }
  return remove(param)
}

// 登录坐席
export const postLoginSeatInfoApi = playod => {
  const param = {
    url: '/map/call/login',
    body: playod
  }
  return post(param)
}

// 退出坐席
export const postLoginOutSeatInfoApi = playod => {
  const param = {
    url: '/map/call/logout',
    body: playod
  }
  return post(param)
}

// 外呼电话
export const postDialApi = playod => {
  const param = {
    url: '/map/call/dial',
    body: playod
  }
  return post(param)
}

// 挂断电话
export const postHangupApi = playod => {
  const param = {
    url: '/map/call/hangup',
    body: playod
  }
  return post(param)
}

// 获取坐席列表
export const getSeatGroupApi = playod => {
  const param = {
    url: '/map/call/queue'
  }
  return get(param)
}
