import { post, put } from './base'

// PC 发起对讲 通知手机端
export const startTalkbackApi = data => {
  const param = {
    url: 'patrol/speech',
    body: data
  }
  return post(param)
}

// 获取 对讲 流地址
export const getTalkbackStreamApi = data => {
  const param = {
    url: 'patrol/speech/url',
    body: data
  }
  return post(param)
}

// 通知 app端拉取音频流
export const noticeAppPullAudioApi = data => {
  const param = {
    url: 'patrol/speech/appPull',
    body: data
  }
  return post(param)
}

// 断开对讲
export const stopTalkbackApi = data => {
  const param = {
    url: 'patrol/speech/disconnet',
    body: data
  }
  return post(param)
}

// 创建单兵录像记录
export const createTalkRecordApi = data => {
  const param = {
    url: 'patrol/speech/history',
    body: data
  }
  return post(param)
}

// 更新单兵录像记录
export const refrashTalkRecordApi = data => {
  const param = {
    url: 'patrol/speech/history/' + data.id,
    body: data.body
  }
  return put(param)
}

// 对手机广播
export const openPhoneBroadcastApi = data => {
  const param = {
    url: 'phone/startbroadcast',
    body: data
  }
  return post(param)
}

// 停止对手机广播
export const stopPhoneBroadcastApi = data => {
  const param = {
    url: 'phone/stopbroadcast',
    body: data
  }
  return post(param)
}

// PC发送广播请求 通知手机端
export const startBroadcastApi = data => {
  const param = {
    url: 'patrol/broadcast',
    body: data
  }
  return post(param)
}
// 获取广播流地址
export const getBroadcastStreamApi = data => {
  const param = {
    url: 'patrol/broadcast/url',
    body: data
  }
  return post(param)
}

// 断开 广播
export const stopBroadcastApi = data => {
  const param = {
    url: 'patrol/broadcast/disconnet',
    body: data
  }
  return post(param)
}

export const addBroadcastAppApi = data => {
  const param = {
    url: 'patrol/broadcast/join',
    body: data
  }
  return post(param)
}

// 平台发起一键报警 创建记录
export const createPCTalkRecordApi = data => {
  const param = {
    url: 'patrol/user/create',
    body: data
  }
  return post(param)
}

// 创建广播记录
export const createBroadcastRecordApi = data => {
  const param = {
    url: 'patrol/radio/history',
    body: data
  }
  return post(param)
}

// 更新广播记录
export const refrashBroadcastRecordApi = data => {
  const param = {
    url: 'patrol/radio/history/' + data.id,
    body: data.body
  }
  return put(param)
}

// 开启广播录音
export const startBroadcastRecordApi = data => {
  const param = {
    url: 'phone/startbroadcastrecord',
    body: data
  }
  return post(param)
}
