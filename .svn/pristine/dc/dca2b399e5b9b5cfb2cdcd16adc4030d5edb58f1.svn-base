import { read } from '../../storage/index'
import { startBroadcastApi, startTalkbackApi, getTalkbackStreamApi, createTalkRecordApi, refrashTalkRecordApi, stopTalkbackApi, openPhoneBroadcastApi, stopPhoneBroadcastApi, getBroadcastStreamApi, stopBroadcastApi, addBroadcastAppApi, createPCTalkRecordApi, noticeAppPullAudioApi, createBroadcastRecordApi, refrashBroadcastRecordApi, startBroadcastRecordApi } from 'http/broadcastAndTalk.api'
const actions = {
  // 向node端发送广播请求
  startBroadcast(state, payload) {
    const param = {
      destId: payload.destId,
      srcId: read('userId'),
      avInfo: {
        url: payload.url
      },
      name: read('user.username')
    }
    return startBroadcastApi(param)
  },
  // 向node端发送对讲请求
  startTalkback(state, payload) {
    const param = {
      src: payload.src,
      srcId: read('userId'),
      destId: payload.destId,
      mode: 2,
      avInfo: {
        url: payload.url
      }
    }
    return startTalkbackApi(param)
  },
  // 获取对讲 流地址
  getTalkbackStream(state, payload) {
    return getTalkbackStreamApi(payload)
  },
  // 记录 单兵录像
  createTalkRecord(state, payload) {
    return createTalkRecordApi(payload)
  },
  // 更新 单兵录像
  refrashTalkRecord(state, payload) {
    return refrashTalkRecordApi(payload)
  },
  // 通知app端拉取音频流
  noticeAppPullAudio(state, payload) {
    return noticeAppPullAudioApi(payload)
  },
  // 断开 对讲
  stopTalkback(state, payload) {
    const param = {
      src: payload.src,
      srcId: payload.srcId,
      destId: payload.destId
    }
    return stopTalkbackApi(param)
  },
  // 手机打开广播
  openPhoneBroadcast(state, payload) {
    return openPhoneBroadcastApi(payload)
  },
  // 停止与手机广播请求
  stopPhoneBroadcast(state, payload) {
    return stopPhoneBroadcastApi(payload)
  },
  // 获取广播流地址
  getBroadcastURL(state, payload) {
    return getBroadcastStreamApi(payload)
  },
  // 断开 广播
  stopBroadcast(state, payload) {
    const param = {
      srcId: read('userId'),
      destId: payload.destId,
      avInfo: {
        url: payload.url
      }
    }
    return stopBroadcastApi(param)
  },
  // 添加广播用户
  addBroadcastApp(state, payload) {
    return addBroadcastAppApi(payload)
  },
  createPCTalkRecord(state, payload) {
    return createPCTalkRecordApi(payload)
  },
  // 创建广播记录
  createBroadcastRecord(state, payload) {
    return createBroadcastRecordApi(payload)
  },
  // 更新广播记录
  refrashBroadcastRecord(state, payload) {
    return refrashBroadcastRecordApi(payload)
  },
  // 开启广播录音
  startBroadcastRecord(state, payload) {
    return startBroadcastRecordApi(payload)
  }
}
export default {
  actions
}
