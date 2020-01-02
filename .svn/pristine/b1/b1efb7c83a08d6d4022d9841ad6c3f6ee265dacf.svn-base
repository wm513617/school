const state = {
  popInfoWindow: new Map(),
  clearPopInfoWindow: '', // 按照类型删除对应的弹出框   all表示全部删除  faceSnap 抓拍图片  alarmTrack 报警轨迹头像 single 单兵 personTrack 人像历史轨迹节点 vehicleTrack 车辆轨迹节点
  faceHeadDatas: [], // 当前绘制的头像数组
  faceHeadMap: new Map(), // 当前绘制的头像Map
  showDetailModel: '', // 是否显示详情框    ''不显示  personTrack显示人像详情框  vehicleTrack显示车辆详情框
  detailModel: {} // 详情框数据
}
const mutations = {
  // 清除头像
  SET_CLEAR_POP_INFO_WINDOW(state, payload) {
    if (payload) {
      const deletePop = []
      state.popInfoWindow.forEach((item, key) => {
        if (payload && (payload === 'all' || key.indexOf(payload) > -1 || (payload === 'historyTrack' && (key.indexOf('personTrack') > -1 || key.indexOf('vehicleTrack') > -1)))) {
          item.close()
          deletePop.push(key)
        }
      })
      deletePop.forEach(item => {
        state.popInfoWindow.delete(item)
      })
    }
  },
  // 保存头像弹框
  SET_POP_INFO_WINDOW(state, data) {
    !state.popInfoWindow.has(data.key) && state.popInfoWindow.set(data.key, data.popMarker)
  },
  // 保存当前绘制的头像数组
  SET_FACE_HEAD_DATAS(state, arr) {
    if (arr && arr.length) {
      arr.forEach(item => {
        if (item.faceType === 'faceSnap') {
          state.faceHeadMap.set(item.pointId, item)
        } else {
          const key = item.userId + '_' + item.pointId
          state.faceHeadMap.set(key, item)
        }
      })
    } else {
      state.faceHeadMap = arr || new Map()
    }
    state.faceHeadDatas = [...state.faceHeadMap.values()]
  },
  // 添加头像
  ADD_FACE_HEAD_DATAS(state, data) {
    if (data.faceType === 'faceSnap') {
      state.faceHeadMap.set(data.pointId, data)
    } else {
      const key = data.userId + '_' + data.pointId
      state.faceHeadMap.set(key, data)
    }
    state.faceHeadDatas = [...state.faceHeadMap.values()]
  },
  // 通过类型删除绘制的头像数组
  DELETE_FACE_HEAD_DATAS(state, payload) {
    state.faceHeadDatas.forEach(item => {
      if (payload) {
        if (payload === 'historyTrack') {
          if (item.faceType === 'personTrack' || item.faceType === 'vehicleTrack') {
            const key = item.userId + '_' + item.pointId
            state.faceHeadMap.delete(key)
          }
        } else if (payload === 'face') {
          if (item.faceType === 'faceSnap' || item.faceType === 'alarmTrack' || item.faceType === 'single') {
            const key = item.faceType === 'faceSnap' ? item.pointId : (item.userId + '_' + item.pointId)
            state.faceHeadMap.delete(key)
          }
        } else if (payload === item.faceType) {
          if (item.faceType === 'faceSnap') {
            state.faceHeadMap.delete(item.pointId, item)
          } else {
            const key = item.userId + '_' + item.pointId
            state.faceHeadMap.delete(key, item)
          }
        }
      }
    })
    state.faceHeadDatas = [...state.faceHeadMap.values()]
  },
  // 通过id删除当前绘制的头像数组
  DELETE_ID_FACE_HEAD_DATAS(state, payload) {
    state.faceHeadDatas.forEach(item => {
      if (item.id === payload) {
        if (item.faceType === 'faceSnap') {
          state.faceHeadMap.delete(item.pointId, item)
        } else {
          const key = item.userId + '_' + item.pointId
          state.faceHeadMap.delete(key, item)
        }
      }
    })
    state.faceHeadDatas = [...state.faceHeadMap.values()]
  },
  // 清除头像数据
  CLEAR_FACE_HEAD_DATAS(state, map) {
    state.faceHeadMap = map
    let [...faceHeadDatasArr] = state.faceHeadMap.values()
    state.faceHeadDatas = faceHeadDatasArr
  },
  // 保存详情框数据
  SET_DETAIL_MODEL(state, data) {
    state.detailModel = data
  },
  // 设置当前是否显示详情框
  SET_SHOW_DETAIL_MODEL(state, payload) {
    state.showDetailModel = payload
  }
}
const actions = {
  // 清除头像
  setClearPopInfoWindow({ commit }, payload) {
    commit('SET_CLEAR_POP_INFO_WINDOW', payload)
  },
  // 保存头像弹框
  setPopInfoWindow({ commit }, data) {
    commit('SET_POP_INFO_WINDOW', data)
  },
  // 保存当前绘制的头像数组
  setFaceHeadDatas({ commit }, arr) {
    commit('SET_FACE_HEAD_DATAS', arr)
  },
  // 添加头像
  addFaceHeadDatas({ commit }, data) {
    commit('ADD_FACE_HEAD_DATAS', data)
  },
  // 删除当前绘制的头像数组
  deleteFaceHeadDatas({ commit }, payload) {
    commit('DELETE_FACE_HEAD_DATAS', payload)
  },
  // 通过id删除当前绘制的头像数组
  deleteIdFaceHeadDatas({ commit }, payload) {
    commit('DELETE_ID_FACE_HEAD_DATAS', payload)
  },
  // 清空头像数组
  clearFaceHeadDatas({ commit }, map) {
    commit('CLEAR_FACE_HEAD_DATAS', map)
  },
  // 保存详情框数据
  setDetailModel({ commit }, data) {
    commit('SET_DETAIL_MODEL', data)
  },
  // 设置当前是否显示详情框
  setShowDetailModel({ commit }, payload) {
    commit('SET_SHOW_DETAIL_MODEL', payload)
    !payload && commit('SET_DETAIL_MODEL', {})
  }
}
const getters = {
  // 头像弹框
  popInfoWindow(state) {
    return state.popInfoWindow
  },
  // 清除头像
  clearPopInfoWindow(state) {
    return state.clearPopInfoWindow
  },
  // 当前绘制的头像数组
  faceHeadDatas(state) {
    return state.faceHeadDatas
  },
  // 是否显示详情框
  showDetailModel(state) {
    return state.showDetailModel
  },
  // 详情框数据
  detailModel(state) {
    return state.detailModel
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
