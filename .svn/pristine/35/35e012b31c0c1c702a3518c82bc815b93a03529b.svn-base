import {
  getAlarmMainDevicesApi,
  getResOfDeviceByMainIdApi,
  getResActionApi,
  protectionActionApi,
  removalActionApi,
  removeActionApi,
  branchActionApi,
  withdrawActionApi,
  getAlarmDevStatus,
  getAllAlarmDevStatus,
  getAllAlarmDevStatusAuto
} from '../../../http/alarmMainFrame.api.js'

const state = {
  alarmMainDevices: [],
  resDataById: [],
  resActions: []
}

const mutations = {
  GET_ALARM_MAIN_DEVICES(state, payload) {
    state.alarmMainDevices = payload
  },
  GET_RESDATA_BY_DEVICESID(state, payload) {
    state.resDataById = payload
  },
  GET_RES_ACTION(state, payload) {
    state.resActions = payload
  }
}

const actions = {
  /*
   * 获取报警主机设备列表
   */
  getAlarmMainDevices({ commit, rootState }, data) {
    if (data.status === 'all') {
      delete data.status
    }
    if (data.alarmStatus === 'all') {
      delete data.alarmStatus
    }
    return new Promise((resolve, reject) => {
      getAlarmMainDevicesApi(data)
        .then(res => {
          commit('GET_ALARM_MAIN_DEVICES', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /*
   * 获取报警主机报警输入列表
   */
  getResOfDeviceByMainId({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      getResOfDeviceByMainIdApi(data)
        .then(res => {
          commit('GET_RESDATA_BY_DEVICESID', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /*
   * 获取报警输入资源联动视频
   */
  getResAction({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      getResActionApi(data)
        .then(res => {
          commit('GET_RES_ACTION', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /*
   * 布防
   */
  protectionAction({ commit }, data) {
    return new Promise((resolve, reject) => {
      protectionActionApi(data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   *撤防
   */
  removalAction({ commit }, data) {
    return new Promise((resolve, reject) => {
      removalActionApi(data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   *清除
   */
  removeAction({ commit }, data) {
    return new Promise((resolve, reject) => {
      removeActionApi(data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   *旁路
   */
  branchAction({ commit }, id) {
    return new Promise((resolve, reject) => {
      branchActionApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   *撤旁
   */
  withdrawAction({ commit }, id) {
    return new Promise((resolve, reject) => {
      withdrawActionApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * 获取单个报警主机状态--暂时无效接口，先保留
   */
  getAlarmDevStatus(store, id) {
    return getAlarmDevStatus({ id })
      .then(res => res)
      .catch(error => error.response)
  },
  /**
   * 获取所有报警主机及防区状态
   */
  getAllAlarmDevStatus(store, payload) {
    return getAllAlarmDevStatus(payload)
  },
  /**
   * 自动获取所有报警主机及防区状态
   */
  getAllAlarmDevStatusAuto(store, payload) {
    return getAllAlarmDevStatusAuto(payload)
  }
}

const getters = {
  /*
   * 报警主机列表数据
   */
  alarmMainDevicesData(state) {
    return state.alarmMainDevices
  },
  /*
   * 报警主机报警输入列表数据
   */
  alarmInDataById(state) {
    return state.resDataById
  },
  /*
   * 报警输入联动数据（下拉框数据）
   */
  resActionsSelList(state) {
    let list = []
    if (state.resActions.length !== 0) {
      state.resActions.map(item => {
        if (item && item._id && item.resource) {
          list.push({
            value: item.resource._id,
            label: item.resource.name,
            mainCamera: item.mainCamera
          })
        }
      })
    } else {
      list.push({
        value: '',
        label: '无联动视频'
      })
    }
    return list
  },
  /*
   * 报警输入联动数据
   */
  resActionsData(state) {
    return state.resActions.map(item => {
      return item.resource
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
