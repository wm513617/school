import {
  get,
  put,
  post,
  remove
} from '../../../http/base'
import { getAlarmDeal, addAlarmDeal, reviseAlarmDeal, deleteAlarmDeal, getAlarmDealStatus, reviseAlarmDealStatus } from 'http/alarm.api.js'
const state = {
  alarmDealList: [], // 警情处理
  levelData: [], // 报警级别数据
  policeData: [], // 警笛数据
  PrearrangedData: [], // 预案数据
  voiceData: [], // 上传的警笛文件数据
  planPageNum: 0,
  policePageNum: 0,
  alarmDealStatus: {
    id: '',
    isAlarmEnable: false
  }
}
const getters = {
  enabledLevel(state) {
    let levelOption = []
    if (state.levelData !== undefined) {
      state.levelData.map((v) => {
        levelOption.push({
          value: v.level,
          label: v.level
        })
      })
    }
    return levelOption
  }
}
const mutations = {
  // 1-1.获取报警级别配置
  GET_ALARM_LEVEL(state, payload) {
    state.levelData = payload
  },
  // 2-1.获取警笛文件
  GET_POLICE_FILE(state, payload) {
    state.policeData = payload
  },
  // 2-2.获取已上传的警笛铃声
  GET_VOICE_FILE(state, payload) {
    state.voiceData = payload
  },
  // 2-3.警笛文件试听
  GET_AUDITION_DATA(state, payload) {
    state.auditionData = payload
  },
  // 3-1.获取预案
  GET_PREARRANGED(state, payload) {
    state.PrearrangedData = payload
  },
  // 预案分页
  SET_PLAN_PAGE(state, payload) {
    state.planPageNum = Number(payload['x-bsc-count'])
  },
  // 警笛分页
  SET_POLICE_PAGE(state, payload) {
    state.policePageNum = Number(payload['x-bsc-count'])
  },
  // 警情处理
  GET_AlARM_DEAL_LIST(state, payload) {
    state.alarmDealList = payload.map(item => {
      return {
        id: item._id,
        name: item.name
      }
    })
  },
  GET_ALARM_DEAL_STATUS(state, payload) {
    if (payload) {
      state.alarmDealStatus.id = payload._id
      state.alarmDealStatus.isAlarmEnable = payload.alarmOpen || false
    }
  }
}
const actions = {
  // 1-1.报警级别配置-获取
  getAlarmLevel({
    commit,
    state
  }) {
    const param = {
      url: 'setting/alarmcfg/level'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ALARM_LEVEL', res.data)
      }).catch(err => reject(err))
    })
  },
  // 1-2.报警级别配置-更新
  editAlarmLevel({
    commit,
    state
  }, data) {
    const param = {
      body: data,
      url: 'setting/alarmcfg/level/' + data._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  // 2-1.警笛文件-获取
  getPoliceFile({
    commit,
    state
  }, payload) {
    const param = {
      query: {
        page: payload.page,
        limit: payload.limit
      },
      url: 'setting/alarmcfg/audio'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_POLICE_FILE', res.data.results)
        commit('SET_POLICE_PAGE', res.headers)
      }).catch(err => reject(err))
    })
  },
  // 2-2.警笛文件-增加
  addPoliceFile({
    commit,
    state
  }, data) {
    const param = {
      body: data,
      url: 'setting/alarmcfg/audio'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 2-3.警笛文件-删除
  delPoliceFile({
    commit,
    state
  }, id) {
    const param = {
      url: 'setting/alarmcfg/audio/' + id
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 2-4.警笛文件-更新
  editPoliceFile({
    commit,
    state
  }, data) {
    const param = {
      body: data,
      url: 'setting/alarmcfg/audio/' + data._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 2-5.获取已上传的警笛铃声
  getVoiceData({
    commit,
    state
  }) {
    const param = {
      url: 'upload/tag?type=sys&tag=audio'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_VOICE_FILE', res.data)
      }).catch(err => reject(err))
    })
  },

  // 3-1.预案-获取
  getPrearranged({
    commit,
    state
  }, payload) {
    const param = {
      query: {
        page: payload ? payload.page : 1,
        limit: payload ? payload.limit : 50
      },
      url: 'setting/alarmcfg/plan'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_PREARRANGED', res.data)
        commit('SET_PLAN_PAGE', res.headers)
      }).catch(err => reject(err))
    })
  },
  // 3-2.预案-增加
  addPrearranged({
    commit,
    state
  }, data) {
    const param = {
      body: data,
      url: 'setting/alarmcfg/plan'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 3-3.预案-删除
  delPrearranged({
    commit,
    state
  }, id) {
    const param = {
      url: 'setting/alarmcfg/plan/' + id
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 3-4.预案-更新
  editPrearranged({
    commit,
    state
  }, data) {
    const param = {
      body: data.plan,
      url: 'setting/alarmcfg/plan/' + data._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 获取警情处理数据
  getAlarmDealSetList({commit}, data) {
    return new Promise((resolve, reject) => {
      getAlarmDeal(data).then(resp => {
        commit('GET_AlARM_DEAL_LIST', resp.data)
        resolve(resp)
      }).catch(err => {
        console.error('getDecoderListApi', err)
        reject(err)
      })
    })
  },
  // 警情处理addAlarmDeal
  addAlarmDealSet({commit}, data) {
    return addAlarmDeal(data)
  },
  // 修改警情处理reviseAlarmDeal
  reviseAlarmDealSet({commit}, data) {
    return reviseAlarmDeal(data)
  },
  // 删除deleteAlarmDeal
  deleteAlarmDealSet({commit}, data) {
    return deleteAlarmDeal(data)
  },
  // 获取警情处理启用状态
  getAlarmDealStatusSet({commit}, data) {
    return new Promise((resolve, reject) => {
      getAlarmDealStatus().then(resp => {
        commit('GET_ALARM_DEAL_STATUS', resp.data)
        resolve(resp)
      }).catch(err => {
        console.error('getDecoderListApi', err)
        reject(err)
      })
    })
  },
  // 修改警情处理启用状态
  reviseAlarmDealStatusSet({commit}, data) {
    return reviseAlarmDealStatus(data)
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
