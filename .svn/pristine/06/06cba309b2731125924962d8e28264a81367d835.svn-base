import {
  getTVListApi,
  addTVWallApi,
  setTVWallApi,
  addLayoutApi,
  delLayoutApi,
  chanLayoutApi,
  addControlApi,
  getControlApi,
  getDecoderListApi,
  getChannelCfgApi,
  getAllLayoutListApi,
  getPollingApi,
  setPollingApi,
  exePollingApi,
  deletePollingApi,
  addPollingApi,
  getScenesApi,
  deleteSceneApi,
  addSceneApi,
  renameSceneApi,
  getRtsceneApi,
  setSceneApi,
  getPlansApi,
  setPlanApi,
  deletePlanApi,
  addPlanApi,
  executePlanApi,
  deleteDecoderApi,
  addDecoderApi,
  setDecoderApi,
  getMonitorListApi,
  openWallApi,
  closeWallApi,
  closeAllWallApi,
  setScreenSplitApi,
  toggleShowNum,
  getDeviceInfosApi,
  getOriginApi,
  getChannelApi,
  getOriginToChannelApi,
  updateOriginApi,
  getJointLayoutApi,
  setJointLayoutApi,
  deleteWallApi,
  updateLayoutApi,
  fullDisplayApi,
  treeLoadingApi
} from '../../http/tvwall.api'
import { recordUserLog } from '../../http/video.api'
const state = {
  tvwall: {},
  sceneList: [],
  pollingList: [],
  planList: [],
  monitorList: [],
  allLayoutList: [],
  layoutList: [],
  decoderList: [],
  channels: {},
  channelList: [],
  rtscene: { info: [] },
  tabIndex: 0,
  enableController: false, // 启用拼接控制器
  allTvWallList: [],
  wallNames: [],
  controllerInfo: [],
  originList: [],
  nowIndex: 0,
  orginChannelList: []
}
const getters = {
  layout(state) {
    return state.tvwall.layout || { column: 1, row: 1 }
  },
  jointcontroller(state) {
    return state.tvwall.jointcontroller
  },
  bgBoxStyle(state, getters) {
    return {
      width: 1 / getters.layout.column * 100 + '%',
      height: 1 / getters.layout.row * 100 + '%',
      // height: `calc(${1 / getters.layout.row * 100}% - ${30 / getters.layout.row}px)`,
      position: 'relative',
      border: '1px solid #000',
      background: '#b1b1b1'
    }
  },
  bgTV(state, getters) {
    return getters.layout.column * getters.layout.row
  }
}
const mutations = {
  SET_TVWALL(state, wall) {
    state.tvwall = wall
    if (wall.rtscene) {
      state.rtscene = wall.rtscene
    }
  },
  SET_ALL_LAYOUT_LIST(state, list) {
    list.sort((a, b) => {
      return a.sceneid - b.sceneid
    })
    state.allLayoutList = list
  },
  SET_LAYOUT(state, layout) {
    state.layout = layout
  },
  SET_POLLING_LIST(state, list) {
    state.pollingList = list
  },
  SET_SCENE_LIST(state, list) {
    state.sceneList = list.filter(item => item._id !== state.rtscene._id)
  },
  SET_PLAN_LIST(state, list) {
    state.planList = list
  },
  SET_DECODER_LIST(state, list) {
    state.decoderList = list
  },
  SET_CHANNEL_LIST(state, list) {
    state.channelList = list
  },
  SET_CHANNELS(state, payload) {
    state.channels = payload
  },
  ADD_CHANNELS(state, payload) {
    state.channels[payload.id] = payload.list
  },
  SET_MONITOR_LIST(state, list) {
    state.monitorList = list
  },
  SET_RT_SCENE(state, scene) {
    state.rtscene = scene
  },
  SET_RT_SCENE_ID(state, id) {
    state.tvwall.rtscene = id
  },
  SET_DEFAULT_SCENE(state, id) {
    state.tvwall.defaultscene = id
  },
  SET_TABLE_INDEX(state, index) {
    state.tabIndex = index
  },
  SET_ENABLE_CONTROLLER(state, value) {
    state.enableController = value
  },
  SAVE_ALL_TV_WALL(state, arr) {
    const arrN = []
    for (const item in arr) {
      arrN.push({ name: arr[item].name })
    }
    state.wallNames = arrN
    state.allTvWallList = arr
  },
  SET_CONTROL_INFO(state, arr) {
    const newArr = []
    for (const j in arr) {
      let n = -1
      for (const i in newArr) {
        if (newArr[i].value === arr[j].manufacturer) {
          n = i
        }
      }
      if (n === -1) {
        newArr.push({
          value: arr[j].manufacturer,
          label: arr[j].manufacturer,
          ip: [
            {
              value: arr[j].ip,
              label: arr[j].ip,
              cport: arr[j].cport
            }
          ]
        })
      } else {
        newArr[n].ip.push({
          label: arr[j].ip,
          value: arr[j].ip,
          cport: arr[j].cport
        })
      }
    }
    state.controllerInfo = newArr
  },
  SET_ORIGIN_LIST(state, list) {
    const arr = []
    const notArr = []
    list.forEach(item => {
      const obj = {
        _id: item._id,
        codeId: item.decodechan ? item.decodechan._id : '',
        code: item.decodechan ? item.decodechan.name : '空',
        originId: item.jointorigin ? item.jointorigin._id : '',
        origin: item.jointorigin ? item.jointorigin.name : ''
      }
      obj.num = Number(obj.origin.replace(/[^0-9]/ig, ''))
      if (arr.length === 0) {
        if (Number.isNaN(arr.num)) {
          notArr.push(obj)
        } else {
          arr.push(obj)
        }
      } else {
        if (Number.isNaN(obj.num)) {
          return notArr.push(obj)
        }
        if (arr[arr.length - 1].num > obj.num) {
          arr.splice(arr.length - 1, 0, obj)
        } else {
          arr.push(obj)
        }
      }
    })
    arr.sort((a, b) => {
      return a.num - b.num
    })
    state.originList = notArr.length !== 0 ? arr.concat(notArr) : arr
  },
  SET_INDEX(state, index) {
    state.nowIndex = index
  },
  SET_ORGIN_CHANNEL_LIST(state, list) {
    const lists = list.map(ele => {
      return {
        codeId: ele._id,
        code: ele.name,
        label: ele.name
      }
    })
    lists.push({
      code: '空',
      label: '空'
    })
    state.orginChannelList = lists
  }
}
const actions = {
  getTVList({ commit, state }) { // 获取监控中心列表
    return new Promise((resolve, reject) => {
      getTVListApi()
        .then(resp => {
          commit('SAVE_ALL_TV_WALL', resp.data)
          if (resp.data.length > 0) {
            commit('SET_TVWALL', resp.data[state.nowIndex])
            let resule = !!resp.data[state.nowIndex].jointcontroller
            commit('SET_ENABLE_CONTROLLER', resule)
          }
          resolve(resp)
        })
        .catch(err => {
          console.error('getTVListApi', err)
          reject(err)
        })
    })
  },
  async addTVWall({ dispatch }, param) {
    if (param.jointcontroller) {
      delete param.layout
    } else {
      if (!param.layout) {
        let name = param.name
        param.layout = (await dispatch('addLayout', param)).data._id
        param.name = name
      }
    }
    return addTVWallApi(param)
  },
  setTVWall({ state }, params) {
    return new Promise((resolve, reject) => {
      setTVWallApi(state.tvwall._id, params)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addLayout({ state }, param) {
    state.tvwall && (param.wall = state.tvwall._id)
    !param.isTvwall && (param.name = param.row + '*' + param.column)
    return new Promise((resolve, reject) => {
      addLayoutApi(param)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  delLayout({ commit }, id) {
    return new Promise((resolve, reject) => {
      delLayoutApi(id)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  chanLayout({ commit }, param) {
    return new Promise((resolve, reject) => {
      chanLayoutApi(param)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addControl({ commit }, param) {
    return new Promise((resolve, reject) => {
      addControlApi(param)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getControl({ commit }) {
    return new Promise((resolve, reject) => {
      getControlApi()
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getDecoderList({ commit }) {
    return new Promise((resolve, reject) => {
      getDecoderListApi()
        .then(resp => {
          commit('SET_DECODER_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          console.error('getDecoderListApi', err)
          reject(err)
        })
    })
  },
  getChannelCfg({ state, commit }, id) {
    if (state.channels[id]) {
      return new Promise(resolve => {
        commit('SET_CHANNEL_LIST', state.channels[id])
        resolve()
      })
    } else {
      return new Promise((resolve, reject) => {
        getChannelCfgApi(id)
          .then(resp => {
            commit('SET_CHANNEL_LIST', resp.data)
            commit('ADD_CHANNELS', {
              list: resp.data,
              id: id
            })
            resolve(resp)
          })
          .catch(err => {
            console.error('getChannelCfgApi', err)
            reject(err)
          })
      })
    }
  },
  clearCfg({ commit }) {
    commit('SET_CHANNEL_LIST', [])
    commit('SET_DECODER_LIST', [])
    commit('SET_CHANNELS', {})
  },
  async getAllLayoutList({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAllLayoutListApi(state.tvwall._id)
        .then(resp => {
          commit('SET_ALL_LAYOUT_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          console.error('getAllLayoutListApi', err)
          reject(err)
        })
    })
  },
  async setTVLayout({ dispatch }, params) {
    await dispatch('setTVWall', {
      layout: params._id
    })
    dispatch('getRtscene')
    return dispatch('getTVList')
  },
  getPolling({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPollingApi(state.tvwall._id)
        .then(resp => {
          commit('SET_POLLING_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          console.error('getPollingApi', err)
          reject(err)
        })
    })
  },
  setPolling({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      setPollingApi(state.tvwall._id, params)
        .then(resp => {
          dispatch('getPolling')
          dispatch('getRtscene')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  exePolling({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      exePollingApi(id)
        .then(resp => {
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deletePolling({ dispatch, state }, pollingId) {
    return new Promise((resolve, reject) => {
      deletePollingApi(pollingId, state.tvwall._id)
        .then(resp => {
          dispatch('getPolling')
          dispatch('getRtscene')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addPolling({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      addPollingApi(params, state.tvwall._id)
        .then(resp => {
          dispatch('getPolling')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getScenes({ commit, state }) {
    return new Promise((resolve, reject) => {
      getScenesApi(state.tvwall._id)
        .then(resp => {
          commit('SET_SCENE_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteScene({ dispatch, state }, sceneId) {
    const p = {}
    if (sceneId === state.tvwall.selectedscene) {
      p.selectedscene = null
    }
    if (sceneId === state.tvwall.defaultscene) {
      p.defaultscene = null
    }
    if (Object.keys(p).length) {
      dispatch('setTVWall', p).then(resp => {
        dispatch('getTVList')
      })
    }
    return new Promise((resolve, reject) => {
      deleteSceneApi(sceneId)
        .then(resp => {
          dispatch('getScenes')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addScene({ dispatch, state, commit }, param) {
    return new Promise((resolve, reject) => {
      addSceneApi(param, state.tvwall._id)
        .then(resp => {
          if (param.isRt) {
            dispatch('setRtscene', resp.data)
            commit('SET_RT_SCENE_ID', resp.data)
          } else {
            if (param.first) {
              dispatch('setDefaultScene', resp.data)
            }
            dispatch('getScenes')
          }
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addSaveScene({ dispatch, state }, param) {
    const obj = { ...state.rtscene }
    obj.layout = state.tvwall.layout._id
    obj.name = param.name
    obj.first = param.first
    delete obj._id
    return dispatch('addScene', obj)
  },
  renameScene({ dispatch }, { id, name }) {
    return new Promise((resolve, reject) => {
      renameSceneApi(id, name)
        .then(resp => {
          dispatch('getScenes')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  changeCurScene({ dispatch, state }, param) {
    var pa = {
      isSceneswitch: true,
      id: state.rtscene._id,
      info: param.info,
      _id: param._id,
      name: param.name,
      layout: param.layout,
      polling: param.polling
    }
    return dispatch('setScene', pa).then(resp => {
      dispatch('setTVWall', {
        selectedscene: param.id
      }).then(resp => {
        dispatch('getTVList')
        dispatch('getMonitorList')
      })
    })
  },
  getRtscene({ commit, state }) {
    return new Promise((resolve, reject) => {
      getRtsceneApi(state.rtscene._id)
        .then(resp => {
          commit('SET_RT_SCENE', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setRtscene({ dispatch }, rtid) {
    return dispatch('setTVWall', {
      rtscene: rtid
    }).then(resp => {
      dispatch('getRtscene', rtid)
    })
  },
  setScene({ dispatch, state }, params) {
    // console.log(params)
    return new Promise((resolve, reject) => {
      setSceneApi(params, state.tvwall._id)
        .then(resp => {
          if (params.isRt) {
            dispatch('getRtscene')
          } else {
            dispatch('getScenes')
          }
          dispatch('getTVList')
          resolve(resp)
        }).catch(err => {
          dispatch('getTVList')
          reject(err)// {message:'场景执行失败'}{response:{data:{message:'场景执行失败'}}}
        })
    })
  },
  updateRtScene({ dispatch, state }, param) {
    dispatch('setTVWall', {
      selectedscene: null
    })

    // console.log(state.tvwall)
    return dispatch('setScene', {
      id: state.tvwall.rtscene,
      layout: state.tvwall.layout,
      isRt: true,
      isSceneswitch: param.isSceneswitch,
      name: state.rtscene.name,
      polling: param.polling || null,
      info: param.info || state.rtscene.info
    })
  },
  setDefaultScene({ dispatch, commit }, id) {
    return dispatch('setTVWall', {
      defaultscene: id
    }).then(() => {
      commit('SET_DEFAULT_SCENE', id)
    })
  },
  getPlans({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPlansApi(state.tvwall._id)
        .then(resp => {
          commit('SET_PLAN_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setPlan({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      setPlanApi(state.tvwall._id, params)
        .then(resp => {
          dispatch('getPlans')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deletePlan({ dispatch, state }, planId) {
    return new Promise((resolve, reject) => {
      deletePlanApi(state.tvwall._id, planId)
        .then(resp => {
          dispatch('getPlans')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addPlan({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      addPlanApi(state.tvwall._id, params)
        .then(resp => {
          dispatch('getPlans')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  executePlan({ dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      executePlanApi(id)
        .then(resp => {
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteDecoder({ dispatch }, ids) {
    // debugger
    return new Promise((resolve, reject) => {
      deleteDecoderApi(ids)
        .then(resp => {
          dispatch('getRtscene')
          dispatch('getMonitorList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  addDecoder({ dispatch, state }, params) {
    return new Promise((resolve, reject) => {
      addDecoderApi(state.tvwall._id, params)
        .then(resp => {
          dispatch('getMonitorList')
          dispatch('getRtscene')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setDecoder({ dispatch }, params) {
    return new Promise((resolve, reject) => {
      setDecoderApi(params)
        .then(resp => {
          dispatch('getRtscene')
          dispatch('getMonitorList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getMonitorList({ state, commit }) { // 获取解码器列表
    if (state.tvwall._id) {
      return new Promise((resolve, reject) => {
        getMonitorListApi(state.tvwall._id)
          .then(resp => {
            commit('SET_MONITOR_LIST', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  openWall({ state, dispatch }, { monitor, number, resource, eventList, ds, streamId, ts }) {
    return new Promise((resolve, reject) => {
      openWallApi(state.tvwall._id, monitor, number, resource, eventList, ds, streamId, ts)
        .then(resp => {
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  closeWall({ state, dispatch }, { monitor, number }) {
    return new Promise((resolve, reject) => {
      closeWallApi(state.tvwall._id, monitor, number)
        .then(resp => {
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  closeAllWall({ state, dispatch }) {
    return new Promise((resolve, reject) => {
      closeAllWallApi(state.tvwall._id)
        .then(resp => {
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setScreenSplit({ state, dispatch }, { monitor, panecount, isMouse }) {
    return new Promise((resolve, reject) => {
      setScreenSplitApi(state.tvwall._id, monitor, panecount, isMouse)
        .then(resp => {
          dispatch('getMonitorList')
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  toggleShowNumAPI({ commit }, { monitors, show }) {
    return new Promise((resolve, reject) => {
      toggleShowNum(monitors, show)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getDeviceInfos({ commit }) {
    return new Promise((resolve, reject) => {
      getDeviceInfosApi()
        .then(resp => {
          commit('SET_CONTROL_INFO', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getOrigin({ commit, state }) {
    return new Promise((resolve, reject) => {
      getOriginApi(state.tvwall._id)
        .then(resp => {
          commit('SET_ORIGIN_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取通道列表
  getChannel({ commit }) {
    return new Promise((resolve, reject) => {
      getChannelApi()
        .then(resp => {
          commit('SET_ORGIN_CHANNEL_LIST', resp.data)
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getOriginToChannel({ commit }, id) {
    return new Promise((resolve, reject) => {
      getOriginToChannelApi(id)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateOrigin({ commit }, param) {
    return new Promise((resolve, reject) => {
      updateOriginApi(param)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getJointLayout({ commit }, reqData) {
    return new Promise((resolve, reject) => {
      getJointLayoutApi(reqData)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setJointLayout({ state }, id) {
    return new Promise((resolve, reject) => {
      setJointLayoutApi(
        state.tvwall.jointcontroller.info.ip,
        state.tvwall.jointcontroller.info.port,
        id,
        state.tvwall._id
      )
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  deleteWall({ dispatch }, wallId) {
    return new Promise((resolve, reject) => {
      deleteWallApi(wallId)
        .then(resp => {
          dispatch('getTVList')
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  updateLayout({ state }) {
    const params = {
      ip: state.tvwall.jointcontroller.info.ip,
      port: state.tvwall.jointcontroller.info.port,
      wall: state.tvwall._id
    }
    return new Promise((resolve, reject) => {
      updateLayoutApi(params)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  fullDisplay({ state, dispatch }, params) {
    params.wall = state.tvwall._id
    return new Promise((resolve, reject) => {
      fullDisplayApi(params)
        .then(resp => {
          resolve(resp)
          dispatch('getTVList')
          dispatch('getMonitorList')
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  recordLog({ commit }, params) {
    return new Promise((resolve, reject) => {
      recordUserLog(params)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  treeLoading({ commit }, params) {
    return treeLoadingApi(params)
  }
}
export default { state, getters, mutations, actions }
