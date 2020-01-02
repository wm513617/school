import { get, put, post, remove } from '../../../http/base'
const state = {
  tempData: [] // 时间模板计划
}
const getters = {
  enabledTemp(state) {
    let tempOption = []
    if (state.tempData !== undefined && state.tempData.length !== 0) {
      state.tempData.map((v) => {
        tempOption.push({
          value: v._id,
          label: v.name
        })
      })
    }
    return tempOption
  }
}
const mutations = {
  GET_ALARM_DATA(state, data) {
    state.tempData = data
  }
  // ADD_ALARM_TEMP(state, data) { }
}
const actions = {
  // 获取报警时间模板
  getAlarmTemp({ commit, state }) {
    const param = {
      url: 'setting/alarmcfg/timetemplate'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ALARM_DATA', res.data)
      }).catch(err => reject(err))
    })
  },

  // 增加报警时间模板
  addAlarmTemp({ commit, state }, data) {
    const param = {
      body: data,
      url: 'setting/alarmcfg/timetemplate'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
        // commit('ADD_ALARM_TEMP', res.data)
      }).catch(err => reject(err))
    })
  },

  // 更新报警时间模板
  editAlarmTemp({ commit, state }, data) {
    const param = {
      body: data,
      url: 'setting/alarmcfg/timetemplate/' + data._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  // 删除报警时间模板
  delAlarmTemp({ commit, state }, id) {
    const param = {
      url: 'setting/alarmcfg/timetemplate/' + id
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 修改数据保存，进行/api/notice/plan请求
  getNewPlan({ commit, state }) {
    const param = {
      url: '/api/notice/plan'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
