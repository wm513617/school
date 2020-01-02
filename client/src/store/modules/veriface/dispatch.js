import {
  getTaskList,
  addTaskList,
  setTaskList,
  delTaskList,
  getFacePointTree,
  getVeriFaceGroup,
  cancelVeriFaceGroup
} from '../../../http/veriface/dispatch.api'
const actions = {
  // 获取布控任务列表
  getControlTaskList({ commit }, { page, limit }) {
    return new Promise((resolve, reject) => {
      getTaskList(page, limit)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  addControlTaskList({ commit }, parmas) {
    return new Promise((resolve, reject) => {
      addTaskList(parmas)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  setControlTaskList({ commit }, parmas) {
    return new Promise((resolve, reject) => {
      setTaskList(parmas)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  delControlTaskList({ commit }, parmas) {
    return new Promise((resolve, reject) => {
      delTaskList(parmas)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取底库列表
  getFaceGroupList({ commit }) {
    return new Promise((resolve, reject) => {
      getVeriFaceGroup()
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取点位树资源
  getFaceTree({ commit }) {
    return new Promise((resolve, reject) => {
      getFacePointTree()
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量布控、撤控
  cancelFaceGroupList({ commit }, parmas) {
    return new Promise((resolve, reject) => {
      cancelVeriFaceGroup(parmas)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }
}

export default {
  actions
}
