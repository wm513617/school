import { getSpecialDevChannel, getNotDevVideoChannel } from '../../http/resource/device.api'
import { getRootNum, getOrgList } from '../../http/resource/org.api'
import { getResourceInfo, getCountList, getResourceTree, saveResourceList, getSingleList, saveResourcePut, saveRtspPut, addDevChannel, addDevBatch, addAlarm, editAlarm, delAlarm, getAlarmOne, getRtspServer, editRtspServer, getRtspTree, addPutRtsp } from '../../http/resource/resource.api'
import axios from 'axios'
const state = {
  resourceTableData: [],
  resourceCounts: 0,
  rootId: ''
}

const mutations = {
  SET_RESOURCETABLE_DATA(state, data) {
    state.resourceTableData = []
    state.resourceTableData = data
  },
  SET_RESOURCETABLE_PAGE(state, payload) {
    state.resourceCounts = Number(payload.headers['x-bsc-count'])
  },
  SET_ROOTID(state, id) {
    state.rootId = id
  }
}

const actions = {
  // 获取所有类型资源的数据信息
  getResourceByType({
    state,
    commit,
    rootState
  }, payload) {
    let isCommit = 1
    payload.isCommit === 0 && (isCommit = payload.isCommit)
    delete payload.isCommit
    payload.oid = rootState.orgSetting.orgActiveId
    return new Promise((resolve, reject) => {
      getResourceInfo(payload).then(res => {
        if (isCommit) {
          commit('SET_RESOURCETABLE_DATA', res.data)
          commit('SET_RESOURCETABLE_PAGE', res)
        }
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取跟机构下资源数量
  getRootRescounts({
    state,
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      getResourceInfo(payload).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取资源数量
  getResourceCount({
    state,
    commit,
    rootState
  }) {
    let obj = {}
    obj.oid = rootState.orgSetting.orgActiveId
    const param = {
      query: obj
    }
    return new Promise((resolve, reject) => {
      getCountList(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取根ID
  getRootId({
    state,
    commit
  }) {
    getRootNum().then((res) => {
      commit('SET_ROOTID', res.data._id)
    }).catch(err => {
      console.log('获取失败', err)
    })
  },
  // 获取资源分配树（已分配资源不显示）
  // /setting/resource/distributiontree
  getVideoResTree({
    state,
    commit,
    rootState
  }, obj) {
    const param = {
      query: {
        oid: !obj.all ? rootState.orgSetting.orgActiveId : null,
        intelligent: obj.intelligent,
        type: obj.type,
        orgtype: obj.orgtype,
        bigtype: obj.bigtype,
        tab: obj.tab
      }
    }
    return new Promise((resolve, reject) => {
      getResourceTree(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 保存資源分配
  saveResourceToOrg({
    state,
    commit,
    rootState
  }, rids) {
    const param = {
      body: {
        oid: rootState.orgSetting.orgActiveId,
        rids: rids
      }
    }
    return new Promise((resolve, reject) => {
      saveResourceList(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  //  改批量
  deleteResource({
    commit,
    state
  }, arrId) {
    // return Promise.all(arrId.map(id => {
    //   // console.log(id)
    //   const param = {
    //     url: '/setting/resource/' + id
    //   }
    //   return remove(param)
    // }))
    // const ids = arrId.join(',')
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: '/setting/resource/patch',
        data: {
          ids: arrId
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  deleteToPlayTheInput({commit}, arrId) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: '/setting/resource/patch/fire',
        data: {
          ids: arrId
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  //  改批量
  unbindResource({
    commit,
    state
  }, obj) {
    const ids = obj.arrId.join(',')
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: '/setting/resource/unbind?type=' + obj.type,
        headers: {
          'x-bsc-ids': ids
        }
      }, {

      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取单一资源信息
  getSingleResource({
    commit,
    state
  }, id) {
    return new Promise((resolve, reject) => {
      getSingleList(id).then(res => {
        if (!res.data.precord) { res.data.precord = '' }
        if (!res.data.delayrecord) { res.data.delayrecord = '' }
        if (!res.data.keyCode) { res.data.keyCode = '' }
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取导航树内容 Org
  getOrgName({
    commit,
    state
  }, obj) {
    return new Promise((resolve, reject) => {
      getOrgList(obj).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 保存资源信息
  saveResourceInfo({
    commit,
    state
  }, obj) {
    return new Promise((resolve, reject) => {
      saveResourcePut(obj).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 保存rtsp信息
  saveRtspInfo({
    commit,
    state
  }, obj) {
    return new Promise((resolve, reject) => {
      saveRtspPut(obj).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  //  改批量
  changeResourceOrg({
    commit,
    state
  }, obj) {
    const ids = obj.arrId.join(',')
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: '/setting/resource/org',
        headers: {
          'x-bsc-ids': ids
        },
        data: {
          oid: obj.oid
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 资源名称同步 改批量
  channelNameSync({
    commit,
    state
  }, obj) {
    const ids = obj.arrId.join(',')
    console.log(obj)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/setting/resource/sync/' + obj.syncTtype,
        headers: {
          'x-bsc-ids': ids
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 主码流子码流批量设置
  batchSetStreams({
    commit,
    state
  }, obj) {
    const ids = obj.arrId.join(',')
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: '/setting/resource/',
        headers: {
          'x-bsc-ids': ids
        },
        data: {
          stream: obj.streamType
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取指定设备下未占用的通道号
  getNotOccupyChannel({
    commit,
    state
  }, obj) {
    return new Promise((resolve, reject) => {
      getSpecialDevChannel(obj).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取视频通道未被监控点使用的通道
  getNotAlarmChannel({
    commit,
    state
  }, obj) {
    return new Promise((resolve, reject) => {
      getNotDevVideoChannel(obj).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 向设备添加一个新的通道
  addOneResToDevice({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      addDevChannel(payload).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 向设备批量添加资源
  addPatchRes({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      addDevBatch(payload).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 添加报警点监控
  addPointAlarm({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      addAlarm(payload).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 修改监控点报警
  editPointAlarm({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      editAlarm(payload).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 删除监控点报警
  deletePointAlarm({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      delAlarm(payload).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取单个监控点报警
  getOnePointAlarm({
    commit,
    state
  }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmOne(payload).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取流服务器配置信息
  getRtspCfg() {
    return new Promise((resolve, reject) => {
      getRtspServer().then(res => resolve(res.data)).catch(err => reject(err.response.data.message))
    })
  },
  // 修改流服务器配置信息
  editRtspCfg({ commit }, payload) {
    return new Promise((resolve, reject) => {
      editRtspServer(payload).then(res => resolve(res.data)).catch(err => reject(err.response.data.message))
    })
  },
  // 获取rtsp机构资源树（已分配资源不显示）
  getRtspResourceTree({
    state,
    commit,
    rootState
  }, obj) {
    obj.pid = !obj.all ? rootState.orgSetting.orgActiveId : null
    delete obj.all
    return new Promise((resolve, reject) => {
      getRtspTree(obj).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  /**
   * 添加资源rtsp数据
   */
  addResourceRtsp({ commit }, obj) {
    return new Promise((resolve, reject) => {
      addPutRtsp(obj).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  /**
   * 获取资源rtsp数据
   */
  getUnusedRtspData({ commit }, ids) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: '/setting/resource/unusedrtspid',
        headers: {
          'x-bsc-ids': ids.join(',')
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  /**
   * 删除资源rtsp配置
   */
  delResourceRtsp({ commit }, obj) {
    const ids = obj.arrId.join(',')
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: '/setting/resource/rtsp',
        headers: {
          'x-bsc-ids': ids
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  }
}

const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
