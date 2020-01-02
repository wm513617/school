import { get, put, remove } from 'http/base'
import toTreeData from '../../../../assets/js/toTreeData'
const state = {
  onePartrol: {},
  partrolData: [],
  editPatrolDraw: false, // 巡更绘制控件
  editPatrolList: [], // 编辑模式巡更点位数组
  editPatrolInMapList: [], // 编辑模式地图上巡更点位数组
  editPatrolCheck: true, // 编辑模式巡更点位勾选状况
  appPatrolList: [], // 应用模式巡更点位数组
  appPatrolLineList: [], // 应用模式巡更任务数组（巡更点位连线）
  oneMapPartrolList: [],
  editCurrentPatrol: null,
  onePartrolStic: 0,
  onePartrolList: [],
  patrolOrgList: [],
  patrolListDescription: [], // 2d巡更轨迹点位绘制列表
  isShowPatrolList: false, // 是否显示2d巡更轨迹点位绘制列表
  oneAllMapPartrolList: [],
  oneFloorPartrolList: [],
  appPatrolCheck: false, // 应用模式巡更点位勾选状况
  patrolConverData: {},
  onePatrolStic: 0,
  addPatrolInfo: null // 编辑模式,点击切换校区时，添加巡更点位所需参数
}
const getters = {
  isShowPatrolList: state => {
    return state.isShowPatrolList
  },
  patrolListDescription: state => {
    return state.patrolListDescription
  }
}
const mutations = {
  // 编辑模式巡更点位勾选状况
  SET_EDITPATROL_CHECK(state, data) {
    state.editPatrolCheck = data
  },
  // 应用模式巡更任务数组（巡更点位连线）
  SET_APPPATROLLINE_LIST(state, data) {
    state.appPatrolLineList = data
  },
  // 点击切换校区时，添加巡更点位所需参数
  SET_ADDPATROL_INFO(state, data) {
    state.addPatrolInfo = data
  },
  // 应用模式巡更点位数组（包括线
  SET_APPPATROL_LIST(state, data) {
    state.appPatrolList = data
  },
  SET_APPPATROL_CHECK(state, data) {
    state.appPatrolCheck = data
  },
  GET_PARTROL_TREE(state, data) {
    state.partrolData = data
  },
  GET_ONEPARTROL_DATA(state, data) {
    state.onePartrol = data
  },
  // 单个巡更点位统计信息
  GET_ONEPARTROL_STIC(state, data) {
    state.onePartrolStic = data
  },
  // 巡更绘制控件
  SET_PATROLDRAW_STATE(state, data) {
    state.editPatrolDraw = data
  },
  SET_PATROL_LIST(state, data) {
    state.editPatrolList = data
  },
  SET_PATROL_LIST_DESCRIPTION(state, data) {
    state.patrolListDescription = data
  },
  SET_IS_SHOW_PATROL_LIST(state, data) {
    state.isShowPatrolList = data
  },
  SET_PATROLINMAP_LIST(state, data) {
    state.editPatrolInMapList = data
  },
  // 单个地图下的巡更点位
  GET_ONEMAPPARTROL_LIST(state, data) {
    state.oneMapPartrolList = data
  },
  SET_CURRENT_PATROL(state, data) {
    state.editCurrentPatrol = data
  },
  // 获取巡更组织列表
  GET_ONEMAPPARTROLORG_LIST(state, data) {
    let arr = JSON.parse(JSON.stringify(data))
    let newArr = []
    if (arr.length) {
      arr.forEach(element => {
        let obj = {
          value: element._id,
          label: element.name
        }
        let newObj = Object.assign(element, obj)
        newArr.push(newObj)
      })
    } else {
      newArr = [
        {
          value: '',
          label: '无'
        }
      ]
    }
    state.patrolOrgList = newArr
  },
  GET_ONEMAPALLPARTROL_LIST(state, data) {
    state.oneAllMapPartrolList = data
  },
  GET_ONEFLOORPARTROL_LIST(state, data) {
    state.oneFloorPartrolList = data
  },
  SET_PATROLCONVER_DATA(state, data) {
    state.patrolConverData = data
  },
  GET_ONEFPARTROL_STATIC(state, data) {
    state.onePatrolStic = data
  }
}
const actions = {
  // 获取巡更点位树
  getPatrolPoint({ commit }, floorId) {
    const param = {
      url: '/setting/sentry/point/tree',
      query: {}
    }
    if (floorId) {
      param.query.storeyId = floorId
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_PARTROL_TREE', toTreeData(res.data))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取单个巡更点位
  getOnePatrol({ commit }, playod) {
    const param = {
      url: '/setting/sentry/point/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEPARTROL_DATA', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取单个巡更点位
  getOnePatrolStic({ commit }, playod) {
    const param = {
      url: '/setting/sentry/point/' + playod + '/statistic'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEPARTROL_STIC', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 编辑单个巡更点位
  editOnePatrol({ commit }, playod) {
    const param = {
      body: playod,
      url: '/setting/sentry/point/' + playod._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 编辑单个巡更点位
  removeOnePatrol({ commit }, playod) {
    const param = {
      url: '/setting/sentry/point/clean/' + playod
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据地图id获取巡更列表
  getOneMapPatrolList({ commit }, playod) {
    console.log(playod)
    const param = {
      url: '/setting/sentry/point/statistic',
      query: {
        mapid: playod.mapid,
        orgid: playod.orgid
      }
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPPARTROL_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取巡更组织列表
  getPatrolOrgList({ commit }, playod) {
    const param = {
      url: 'setting/org/list?type=4'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPPARTROLORG_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定地图的巡更点位
  getOneMapAllPatrolList({ commit }, playod) {
    const param = {
      url: '/setting/sentry/point/map/' + playod.mapid
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPALLPARTROL_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定楼层的巡更点位
  getOneFloorPatrolList({ commit }, playod) {
    const param = {
      url: '/setting/sentry/point/store/' + playod + '?mapType=3d'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEFLOORPARTROL_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定楼层的巡更点位
  getOnePatrolstatistic({ commit }, playod) {
    const param = {
      url: '/setting/sentry/point/' + playod + '/statistic'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEFPARTROL_STATIC', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setPatrolListDescription({ commit }, playod) {
    commit('SET_PATROL_LIST_DESCRIPTION', playod)
  },
  setIsShowPatrolList({ commit }, playod) {
    commit('SET_IS_SHOW_PATROL_LIST', playod)
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
