import { getSocket } from 'src/socket/socket.js'

import {
  getServerInfoApi, // 获取服务器配置信息
  postServerInfoApi, // 保存服务器配置信息
  getSeatListApi, // 获取坐席列表信息
  postAddSeatInfoApi, // 新增坐席
  putModifySeatInfoApi, // 修改坐席
  removeSeatInfoApi, // 删除坐席
  postLoginSeatInfoApi, // 登录坐席
  postLoginOutSeatInfoApi, // 注销坐席
  postDialApi, // 外呼电话
  postHangupApi, // 挂断电话
  getSeatGroupApi // 获取坐席组信息
} from 'src/http/callCenter.api'

const state = {
  showSeatList: false,
  isCall: false,
  selectedMobile: '',
  phoneSocketPort: '',
  phoneSocketIP: '',
  seatList: [],
  freeSeatList: [],
  currentSeat: '',
  groupNames: [],
  serverSaveStatus: false,
  prefix: '1', // 坐席外呼前缀，  手机/座机（后天加两位前缀）  1     分机（后台加一位前缀）  2    自定义电话（后台不用加前缀） 3
  mill: ''
}
const mutations = {
  UPDATE_EXTENSION_STATUS(state, data) {
    // console.log('接收到坐席状态变化：' + data.extension + '----' + data.status + ' ==== ' + (state.currentSeat || '未选择话机') + '----' + state.isCall)
    let currentTime = parseInt(new Date().getTime() / 1000)
    let time = currentTime - state.mill
    if (data.extension === state.currentSeat && data.status === '空闲' && time > 4) {
      state.isCall = false
      state.selectedMobile = ''
      state.currentSeat = ''
    }
    const freeData = []
    if (state.seatList.length > 0) {
      for (let seat = 0; seat < state.seatList.length; seat++) {
        if (state.seatList[seat].extension === data.extension) {
          state.seatList[seat].status = data.status
        }
        if (state.seatList[seat].status === '空闲') {
          freeData.push(state.seatList[seat])
        }
      }
    }
    state.freeSeatList = freeData
  },
  SET_GROUP_LIST(state, data) {
    state.groupNames = data
  },
  SET_SEAT_LIST_SHOW(state, data) {
    state.showSeatList = data
  },
  SET_PHONE_CALL(state, data) {
    state.isCall = data
  },
  SET_PHONE_NUM(state, data) {
    state.selectedMobile = data
  },
  SET_PHONE_MODAL_IP(state, data) {
    state.phoneSocketIP = data
  },
  SET_PHONE_MODAL_PORT(state, data) {
    state.phoneSocketPort = data
  },
  SET_SEAT_MODAL_LIST(state, data) {
    state.seatList = data
  },
  SET_FREE_SEAT_MODAL_LIST(state, data) {
    const freeData = []
    if (data.length > 0) {
      for (let d = 0; d < data.length; d++) {
        if (data[d].status === '空闲') {
          freeData.push(data[d])
        }
      }
    }
    state.freeSeatList = freeData
  },
  SET_CURRENT_SEAT(state, data) {
    state.currentSeat = data || ''
  },
  SET_SERVER_SAVE_STATUS(state, data) {
    state.serverSaveStatus = data
  },
  SET_SEAT_PREFIX(state, data) {
    state.prefix = data
  },
  SET_UPDATE_MILL(state, data) {
    state.mill = data
  }
}
const actions = {
  /**
  * 设置坐席列表的坐席状态
  */
  updateExtensionStatus({ commit, state }) {
    getSocket().on('extensionStatus', (res) => {
      if (res.length > 0) {
        for (let seat = 0; seat < res.length; seat++) {
          if (state.currentSeat === res[seat].extension) {
            if (res[seat].status !== '空闲') {
              commit('SET_PHONE_CALL', true)
            }
          }
          commit('UPDATE_EXTENSION_STATUS', res[seat])
        }
      }
    })
  },
  /**
   * 设置坐席列表是否显示
   */
  setSeatListShow({ commit }, data) {
    commit('SET_SEAT_LIST_SHOW', data)
  },
  /**
   * 设置是否正在呼叫中
   */
  setPhoneCall({ commit }, data) {
    commit('SET_PHONE_CALL', data)
  },
  /**
   * 设置选中的手机号
   */
  setPhoneNum({ commit }, data) {
    commit('SET_PHONE_NUM', data)
  },
  /**
   * socket的port
   */
  setPhoneModalPort({ commit }, data) {
    commit('SET_PHONE_MODAL_PORT', data)
  },
  /**
   * socket的IP
   */
  setPhoneModalIP({ commit }, data) {
    commit('SET_PHONE_MODAL_IP', data)
  },
  /**
   * 更新坐席列表
   */
  setSeatList({ commit }, data) {
    commit('SET_SEAT_MODAL_LIST', data)
  },
  /**
   * 更新空闲坐席列表
   */
  setFreeSeatList({ commit }, data) {
    commit('SET_FREE_SEAT_MODAL_LIST', data)
  },
  /**
   * 更新当前选中坐席
   */
  setCurrentSeat({ commit }, data) {
    commit('SET_CURRENT_SEAT', data)
  },
  /**
   * 更新服务器是否保存
   */
  setServerSaveStatus({ commit }, data) {
    commit('SET_SERVER_SAVE_STATUS', data)
  },
  /**
   * 更新坐席外呼前缀
   */
  setSeatPrefix({ commit }, data) {
    commit('SET_SEAT_PREFIX', data)
  },
  /**
   * 获取服务器数据
   */
  getServerInfo(state, payload) {
    return getServerInfoApi()
  },
  /**
   * 保存/修改服务器数据
   */
  postServerInfo(state, payload) {
    return postServerInfoApi(payload)
  },
  /**
   * 新增坐席数据
   */
  postSeatInfo(state, payload) {
    const param = {
      name: payload.name,
      extension: payload.extension,
      groupName: payload.groupName
    }
    return postAddSeatInfoApi(param)
  },
  /**
   * 修改坐席列表
   */
  putLoginSeatInfo(state, payload) {
    const param = {
      _id: payload._id,
      body: {
        name: payload.name,
        extension: payload.extension,
        groupName: payload.groupName
      }
    }
    return putModifySeatInfoApi(param)
  },
  /**
   * 删除坐席数据
   */
  removeSeatInfo(state, payload) {
    return removeSeatInfoApi({ _id: payload._id })
  },
  /**
   * 获取坐席列表
   */
  getSeatList(state, payload) {
    return getSeatListApi()
  },
  /**
   * 登录坐席
   */
  postLoginSeatInfo(state, payload) {
    return postLoginSeatInfoApi({ name: payload.name, extension: payload.extension, groupName: payload.groupName })
  },
  /**
   * 退出坐席
   */
  postLoginOutSeatInfo(state, payload) {
    return postLoginOutSeatInfoApi({ name: payload.name, extension: payload.extension, groupName: payload.groupName })
  },
  /**
   * 外呼电话
   */
  postDial(state, payload) {
    return postDialApi(payload)
  },
  /**
   * 挂断电话
   */
  postHangup(state, payload) {
    return postHangupApi({ extension: payload.extension })
  },
  /**
   * 更新外呼电话的时间
   */
  setUpdateMill({ commit }, payload) {
    return commit('SET_UPDATE_MILL', parseInt(new Date().getTime() / 1000))
  },
  /**
   * 获取坐席组名
   */
  getSeatGroup({
    commit,
    state
  }, payload) {
    return getSeatGroupApi().then(result => {
      console.log('坐席组名获取成功')
      if (result && result.data) {
        commit('SET_GROUP_LIST', result.data || [])
      }
    }).catch(err => {
      console.log(err.response.data.message)
      commit('SET_GROUP_LIST', ['ceshi'])
    })
  }
}
const getter = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getter
}
