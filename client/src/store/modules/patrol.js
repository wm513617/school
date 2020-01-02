import { get, post, put, remove } from '../../http/base'
import { getSingleLogApi } from 'http/singleLog.api.js'
// import { getSocket } from 'src/socket/socket.js'
const state = {
  singleInfo: [],
  singleList: [],
  taskList: [],
  recordList: [],
  recordInfo: {},
  messageList: [],
  patrolUserList: [],
  userTasks: [],
  messagesOfTask: [],
  PhoneAudiolist: [],
  PhoneAudioDsip: '',
  PhoneQuerylist: [],
  PhoneAudioMsg: [],
  PhoneQueryMsg: [],
  TalkBacklist: [],
  TalkBackMsg: [],
  TalkUserlist: [],
  // DsId: '',
  pageInfo: {
    pages: 0,
    cur: 1,
    limit: 10,
    counts: 0
  },
  watchReceiveAlarm: {},
  watchMoveSinglePosition: null
}
const mutations = {
  UPDATE_SINGLE_INFO(state, data) {
    state.singleInfo = data
  },
  UPDATE_SINGLE_LIST(state, data) {
    state.singleList = data
  },
  UPDATE_TASK_LIST(state, data) {
    state.taskList = data
  },
  UPDATE_RECORD_LIST(state, data) {
    state.recordList = data
  },
  UPDATE_RECORD_INFO(state, data) {
    state.recordInfo = data
  },
  UPDATE_MESSAGE_LIST(state, data) {
    state.messageList = data
  },
  CLEAR_MESSAGE_LIST() {
    state.messageList = []
  },
  UPDATE_PHONEAUDIO_LIST(state, data) {
    state.PhoneAudiolist = data
  },
  UPDATE_PHONEAUDIO_DSIP(state, data) {
    state.PhoneAudioDsip = data
  },
  UPDATE_PHONEAUDIO_INFO(state, data) {
    state.PhoneAudioMsg = data
  },
  UPDATE_PHONEQUERY_LIST(state, data) {
    state.PhoneQuerylist = data
  },
  UPDATE_PHONEQUERY_INFO(state, data) {
    state.PhoneQueryMsg = data
  },
  UPDATE_TALKBACK_LIST(state, data) {
    state.TalkBacklist = data
  },
  UPDATE_TALKBACK_INFO(state, data) {
    state.TalkBackMsg = data
  },
  UPDATE_TALKUSER_LIST(state, data) {
    state.TalkUserlist = data
  },
  // UPDATE_DSID(state, data) {
  //   state.DsId = data
  // },
  UPDATE_PAGEINFO(state, data) {
    if (data) {
      state.pageInfo.pages = parseInt(data['x-bsc-pages'])
      state.pageInfo.count = parseInt(data['x-bsc-count'])
      state.pageInfo.cur = parseInt(data['x-bsc-cur'])
      state.pageInfo.limit = parseInt(data['x-bsc-limit'])
    } else {
      state.pageInfo.pages = 0
      state.pageInfo.count = 0
      state.pageInfo.cur = 1
      state.pageInfo.limit = 10
    }
  },
  UPDATE_PATROL_USERLIST(state, data) {
    data.map((item, index) => {
      data[index].isSingleAlarm = false
    })
    // state.patrolUserList = data
  },
  UPDATE_USER_TASKS(state, data) {
    state.userTasks = []
    state.userTasks = data
  },
  UPDATE_TASK_OF_MSG(state, data) {
    state.messagesOfTask = data
  }
}
const actions = {
  searchRecordRuning({ commit }, payload) {
    const param = {
      url: '/patrol/record/running/query',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_PATROL_USERLIST', res.data)
          commit('UPDATE_PAGEINFO', res.headers)
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  getPatrolUsers({ commit }, payload) {
    const param = {
      url: '/patrol/record/running',
      query: payload || {}
    }
    param.query.limit = 100
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_PATROL_USERLIST', res.data)
          commit('UPDATE_PAGEINFO', res.headers)
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  getPatrolUserTasks({ commit }, payload) {
    const param = {
      url: `/patrol/record/${payload.userId}/date`,
      query: payload
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('UPDATE_USER_TASKS', res.data)
        })
        .catch(err => reject(err))
    })
  },
  getMsgsForTask({ commit }, payload) {
    const param = {
      url: `/patrol/message/task/${payload.id}`
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_TASK_OF_MSG', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取带巡更人员的机构树
  getSentryUserTree() {
    const param = {
      url: 'setting/sentry/user/tree'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取待点位的机构树
  getSentryPointTree() {
    const param = {
      url: 'setting/sentry/point/tree'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },

  getTaskById({ commit }, payload) {
    const param = {
      url: 'patrol/task/' + payload.id
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取任务列表
  getTaskList({ commit }, payload) {
    const param = {
      url: 'patrol/task',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_TASK_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 搜索任务列表
  searchTaskList({ commit }, payload) {
    const param = {
      url: 'patrol/task/query',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_TASK_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 添加任务
  addTask({ state, commit }, payload) {
    const param = {
      url: '/patrol/task',
      body: payload
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 修改任务
  updateTask({ state }, payload) {
    const param = {
      url: `/patrol/task/${payload._id}`,
      body: payload
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 单个删除巡更任务
  deleteTask({ state }, payload) {
    const param = {
      url: '/patrol/task/' + payload.id
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量删除巡更任务
  deleteTasks({ state }, ids) {
    const param = {
      url: '/patrol/task'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': ids
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取巡更记录数据
  getRecordList({ state, commit }, payload) {
    const param = {
      url: '/patrol/record',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_RECORD_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 搜做巡更记录数据
  searchRecordList({ state, commit }, payload) {
    const param = {
      url: '/patrol/record/query',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_RECORD_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 单条巡更记录详情
  getRecordInfo({ commit, state }, payload) {
    const param = {
      url: `/patrol/record/${payload.id}`,
      query: {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('UPDATE_RECORD_INFO', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 批量删除巡更记录
  deleteRecord({ state, commit }, payload) {
    const param = {
      url: '/patrol/record',
      body: payload
    }
    var ids = []
    payload.map(item => {
      ids.push(item._id)
    })
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': ids
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取消息列表
  getMessageList({ state, commit }, payload) {
    var param = {
      url: '/patrol/message',
      query: payload || {}
    }

    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_MESSAGE_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  clearMessageList({commit}) {
    commit('CLEAR_MESSAGE_LIST')
  },
  getMessageById({ commit }, payload) {
    var param = {
      url: `/patrol/message/${payload.id}`
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 检索消息列表
  searchMessageList({ commit }, payload) {
    var param = {
      url: '/patrol/message/query',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_MESSAGE_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 新建消息
  addMessage({ state }, payload) {
    var param = {
      url: '/patrol/message',
      body: payload
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 删除消息
  deleteMessage({ commit, state }, ids) {
    var param = {
      url: `/patrol/message`
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': ids
        }
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  updateTaskMessage({ commit, state }, payload) {
    const param = {
      url: `/patrol/message/${payload.id}`,
      body: payload
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取单兵报警记录数据
  getSingleList({ state, commit }, payload) {
    const param = {
      url: '/patrol/warnning',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_SINGLE_LIST', res.data.results)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 单条单兵报警记录数据
  getSingleInfo({ commit, state }, payload) {
    const param = {
      url: `/patrol/warnning/${payload.id}`,
      query: {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('UPDATE_SINGLE_INFO', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 单个删除单兵报警
  deleteWarnning({ state }, payload) {
    const param = {
      url: '/patrol/warnning/' + payload.id
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量删除
  deleteAllWarnning({
    commit
  }, payload) {
    const param = {
      url: '/patrol/warnning'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload.join(',')
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 单兵一键报警确认
  updatePatrolAlarm({ commit, state }, payload) {
    const param = {
      url: `/patrol/alarm/${payload.id}`,
      body: payload
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 获取单兵操作日志
  getSingleLog({commit}, payload) {
    return getSingleLogApi(payload)
  },
  // 电子巡查广播对讲获取录音列表
  searchPhoneAudio({ commit, state }, payload) {
    const param = {
      url: 'patrol/radio/history',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          console.log('广播数据', res)
          if (res.data.length > 0) {
            commit('UPDATE_PHONEAUDIO_LIST', res.data)
            commit('UPDATE_PHONEAUDIO_DSIP', res.data[0].dsIp)
          }
        })
        .catch(err => reject(err))
    })
  },
  // 电子巡查广播对讲删除录音列表
  deletePhoneAudio({ commit, state }, payload) {
    const param = {
      url: 'patrol/radio/history/' + payload.id
    }
    // remove(param).then(res => {
    //   console.log('删除请求', res)
    //   if (res.status === 200) {
    //     return Promise.resolve('删除成功')
    //   }
    // })
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 电子巡查广播对讲广播获取开流信息
  getAudioStrmInfo({ commit }, payload) {
    const param = {
      url: 'record/phoneAudioQuery',
      body: payload
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 电子巡查广播对讲获取对讲视频
  searchPhoneQuery({ commit, state }, payload) {
    const param = {
      url: '/record/phonequery',
      body: payload
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          console.log('数据', res)
          commit('UPDATE_PHONEQUERY_LIST', res.data.eventList)
          commit('UPDATE_PHONEQUERY_INFO', res.data)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 电子巡查对讲获取用户列表
  getTalkBackList({ commit, state }, payload) {
    const param = {
      url: '/patrol/webuser?all=1',
      body: payload
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          let arr = []
          res.data.map(item => {
            let obj = {
              value: item.name,
              label: item.name
            }
            arr.push(obj)
          })
          console.log('用户数据', arr)
          commit('UPDATE_TALKUSER_LIST', arr)
        })
        .catch(err => reject(err))
    })
  },
  // 电子巡查对讲获取列表数据
  searchTalkbackHistory({ commit }, payload) {
    const param = {
      url: 'patrol/speech/history',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          console.log('对讲数据', res)
          commit('UPDATE_TALKBACK_LIST', res.data)
          commit('UPDATE_TALKBACK_INFO', res.data)
          commit('UPDATE_PAGEINFO', res.headers)
        })
        .catch(err => reject(err))
    })
  },
  // 电子巡查对讲删除列表数据
  deleteTalkbackHistory({ commot }, payload) {
    const param = {
      url: `patrol/speech/history/${payload.id}`
    }
    return remove(param).then(res => {
      return Promise.resolve(res)
    })
  },
  // 电子巡查广播获取dsId
  getDisId({ commit }, payload) {
    const param = {
      url: 'patrol/speech/dsid',
      query: payload || {}
    }
    return get(param).then(res => {
      return Promise.resolve(res)
    })
  }
}
export default {
  state,
  actions,
  mutations
}
