/* eslint-disable no-undef */
import { getLineStyle, defaultLineStyle } from 'components/fengmap/draw/DrawLineStyle'
const state = {
  drawHeight: 4, // 线的高度
  lineDrawStyle: {}, // 线绘制样式
  lineTrackLoc: [], // 轨迹刻画（人像、车辆、巡更）的点位存储
  lineTrackMarkers: new Map(), // 轨迹刻画（人像、车辆、巡更）的marker存储
  lineRealTrackLocMap: new Map(), // 实时轨迹的点位存储
  lineRealTrackLoc: [], // 实时轨迹的点位存储
  lineRealDrawMarkers: new Map(), // 实时轨迹的marker存储
  lineDrawLoc: [], // 报警线的点位存储
  lineDrawMarkers: new Map(), // 报警线的marker存储
  lineStringLoc: {}, // 已绘制线存储
  drawLineActived: false, // 激活线绘制工具
  drawLineClear: false, // 清除当前绘制的线
  isShowLineTrack: false // 是否显示轨迹刻画（人像、车辆、巡更）
}
const mutations = {
  // 绘制线的样式操作
  REVERT_LINE_STRING_STYLE(state) {
    let lineDrawStyle = JSON.parse(JSON.stringify(defaultLineStyle))
    lineDrawStyle.godColor = '#FF0000'
    lineDrawStyle.godEdgeColor = '#FF0000'
    lineDrawStyle.color = '#FF0000'
    lineDrawStyle.noAnimate = true
    lineDrawStyle.lineTypeDes = 0
    state.lineDrawStyle = lineDrawStyle
  },
  UPDATE_LINE_STRING_STYLE(state, data) {
    let lineDrawStyle = JSON.parse(JSON.stringify(state.lineDrawStyle))
    const drawStyle = getLineStyle(lineDrawStyle, data)
    state.lineDrawStyle = drawStyle
  },
  // 轨迹的操作
  SET_LINE_TRACK_LOC(state, item) {
    const defaultStyle = JSON.parse(JSON.stringify(defaultLineStyle))
    const drawStyle = getLineStyle(defaultStyle, item.drawStyle)
    const locParams = {
      drawStyle: drawStyle,
      type: item.type,
      points: item.points
    }
    state.lineTrackLoc.push(locParams)
  },
  DELETE_LINE_TRACK_LOC(state) {
    state.lineTrackLoc = []
  },
  SET_LINE_TRACK_MARKERS(state, map) {
    state.lineTrackMarkers = map
  },
  CHANGE_LINE_TRACK_MARKERS(state, data) {
    if (state.lineTrackMarkers.has(data.key)) {
      state.lineTrackMarkers.delete(data.key)
    }
    state.lineTrackMarkers.set(data.key, data.marker)
  },
  DELETE_LINE_TRACK_MARKERS(state, payload) {
    state.lineTrackMarkers.delete(payload)
  },
  // 实时轨迹的操作
  UPDATE_LINE_REAL_TRACK_LOC(state, map) {
    state.lineRealTrackLocMap = map
    state.lineRealTrackLoc = [...state.lineRealTrackLocMap.values()]
  },
  SET_LINE_REAL_TRACK_LOC(state, item) {
    const defaultStyle = JSON.parse(JSON.stringify(defaultLineStyle))
    const drawStyle = getLineStyle(defaultStyle, item.drawStyle)
    const locParams = {
      drawStyle: drawStyle,
      type: item.type,
      points: item.points
    }
    state.lineRealTrackLocMap.set(type, locParams)
    state.lineRealTrackLoc = [...state.lineRealTrackLocMap.values()]
  },
  DELETE_LINE_REAL_TRACK_LOC(state, arr) {
    if (arr && arr.length && typeof arr !== 'string') {
      arr.forEach(type => {
        if (state.lineRealTrackLocMap.has(type)) { state.lineRealTrackLocMap.delete(type) }
      })
    } else if (arr && typeof arr === 'string') {
      state.lineRealTrackLoc.forEach(item => {
        if (item.type.indexOf(arr) > -1) { state.lineRealTrackLocMap.delete(item.type) }
      })
    } else {
      state.lineRealTrackLocMap = new Map()
    }
    state.lineRealTrackLoc = [...state.lineRealTrackLocMap.values()]
  },
  SET_LINE_REAL_TRACK_MARKERS(state, map) {
    state.lineRealDrawMarkers = map
  },
  CHANGE_LINE_REAL_TRACK_MARKERS(state, data) {
    if (state.lineRealDrawMarkers.has(data.key)) {
      state.lineRealDrawMarkers.delete(data.key)
    }
    state.lineRealDrawMarkers.set(data.key, data.marker)
  },
  DELETE_LINE_REAL_TRACK_MARKERS(state, payload) {
    state.lineRealDrawMarkers.delete(payload)
  },
  // 已保存绘制线的操作
  SET_LINE_DRAW_LOC(state, item) {
    const defaultStyle = JSON.parse(JSON.stringify(defaultLineStyle))
    const drawStyle = getLineStyle(defaultStyle, item.drawStyle)
    drawStyle.noAnimate = true
    const locParams = {
      drawStyle: drawStyle,
      type: item.type,
      points: item.points
    }
    state.lineDrawLoc.push(locParams)
  },
  DELETE_LINE_DRAW_LOC(state, arr) {
    if (arr && arr.length) {
      const trackLoc = []
      state.lineTrackLoc.forEach(item => {
        arr.forEach(type => {
          if (type !== item.type) {
            trackLoc.push(item)
          }
        })
      })
      state.lineTrackLoc = trackLoc
    } else {
      state.lineTrackLoc = []
    }
  },
  SET_LINE_DRAW_MARKERS(state, map) {
    state.lineDrawMarkers = map
  },
  CHANGE_LINE_DRAW_MARKERS(state, data) {
    if (state.lineDrawMarkers.has(data.key)) {
      state.lineDrawMarkers.delete(data.key)
    }
    state.lineDrawMarkers.set(data.key, data.marker)
  },
  DELETE_LINE_DRAW_MARKERS(state, payload) {
    state.lineDrawMarkers.delete(payload)
  },
  // 保存刚绘制完的线
  SET_LINE_STRING_LOC(state, data) {
    state.lineStringLoc = data
  },
  // 开启线绘制
  SET_DRAW_LINE_ACTIVED(state, flag) {
    state.drawLineActived = flag
  },
  // 清除当前绘制的线
  SET_DRAW_LINE_CLEAR(state, flag) {
    state.drawLineClear = flag
  }
}
const actions = {
  // 绘制线的样式操作
  revertLineStringStyle({ commit }) {
    commit('REVERT_LINE_STRING_STYLE')
  },
  updateLineStringStyle({ commit }, flag) {
    commit('UPDATE_LINE_STRING_STYLE', flag)
  },
  // 轨迹的操作
  updateLineTrackLoc({ commit }, map) {
    commit('UPDATE_LINE_REAL_TRACK_LOC', map)
  },
  setLineTrackLoc({ commit }, data) {
    commit('SET_LINE_TRACK_LOC', data)
  },
  deleteLineTrackLoc({ commit }) {
    commit('DELETE_LINE_TRACK_LOC')
  },
  setLineTrackMarkers({ commit }, map) {
    commit('SET_LINE_TRACK_MARKERS', map)
  },
  changeLineTrackMarkers({ commit }, data) {
    commit('CHANGE_LINE_TRACK_MARKERS', data)
  },
  deleteLineTrackMarkers({ commit }, payload) {
    commit('DELETE_LINE_TRACK_MARKERS', payload)
  },
  // 实时轨迹的操作
  setLineRealTrackLoc({ commit }, arr) {
    commit('SET_LINE_REAL_TRACK_LOC', arr)
  },
  deleteLineRealTrackLoc({ commit }, arr) {
    commit('DELETE_LINE_REAL_TRACK_LOC', arr)
  },
  setLineRealTrackMarkers({ commit }, map) {
    commit('SET_LINE_REAL_TRACK_MARKERS', map)
  },
  changeLineRealTrackMarkers({ commit }, data) {
    commit('CHANGE_LINE_REAL_TRACK_MARKERS', data)
  },
  deleteLineRealTrackMarkers({ commit }, payload) {
    commit('DELETE_LINE_REAL_TRACK_MARKERS', payload)
  },
  // 已保存绘制线的操作
  setLineDrawLoc({ commit }, item) {
    commit('SET_LINE_DRAW_LOC', item)
  },
  deleteLineDrawLoc({ commit }, arr) {
    commit('DELETE_LINE_DRAW_LOC', arr)
  },
  setLineDrawMarkers({ commit }, map) {
    commit('SET_LINE_DRAW_MARKERS', map)
  },
  changeLineDrawMarkers({ commit }, data) {
    commit('CHANGE_LINE_DRAW_MARKERS', data)
  },
  deleteLineDrawMarkers({ commit }, payload) {
    commit('DELETE_LINE_DRAW_MARKERS', payload)
  },
  // 保存刚绘制完的线
  setLineStringLoc({ commit }, data) {
    commit('SET_LINE_STRING_LOC', data)
  },
  // 开启线绘制
  setDrawLineActived({ commit }, flag) {
    commit('SET_DRAW_LINE_ACTIVED', flag)
  },
  // 清除当前绘制的线
  setDrawLineClear({ commit }, flag) {
    commit('SET_DRAW_LINE_CLEAR', flag)
  }
}
const getters = {
  // 线绘制样式
  lineDrawStyle(state) {
    return state.lineDrawStyle
  },
  // 线的高度
  drawHeight(state) {
    return state.drawHeight
  },
  // 已绘制线存储
  lineStringLoc(state) {
    return state.lineStringLoc
  },
  // 激活线绘制工具
  drawLineActived(state) {
    return state.drawLineActived
  },
  // 清除当前绘制的线
  drawLineClear(state) {
    return state.drawLineClear
  },
  // 轨迹刻画（人像、车辆、巡更）的点位存储
  lineTrackLoc(state) {
    return state.lineTrackLoc
  },
  // 轨迹刻画（人像、车辆、巡更）的marker存储
  lineTrackMarkers(state) {
    return state.lineTrackMarkers
  },
  // 报警线的点位存储
  lineDrawLoc(state) {
    return state.lineDrawLoc
  },
  // 报警线的marker存储
  lineDrawMarkers(state) {
    return state.lineDrawMarkers
  },
  // 实时轨迹的点位存储
  lineRealTrackLoc(state) {
    return state.lineRealTrackLoc
  },
  // 实时轨迹的marker存储
  lineRealDrawMarkers(state) {
    return state.lineRealDrawMarkers
  },
  // 是否显示轨迹刻画（人像、车辆、巡更）
  isShowLineTrack(state) {
    return state.isShowLineTrack
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
