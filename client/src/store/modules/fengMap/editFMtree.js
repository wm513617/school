// 地图编辑 左侧面板
import { getAlarmHelpOrgTreeApi, getPatrolPointApi } from 'http/map2d'
import toTreeData from 'assets/js/toTreeData'
const state = {
  leftFMPanelShow: true, // 左侧控制面板是否显示
  alarmHelpFMTree: [], // 报警求助 资源树
  partrolFMTree: [], // 巡更资源树
  doorControlFMTree: [], // 门禁资源树
  selectedfmTreeNode: {}, // 选中的树节点
  editFMTreeChangeCounter: { // 编辑树变化计数
    count: 0,
    optTab: ''
  },
  pointFMDrawActive: false, // 点绘制是否激活
  lineFMDrawActive: false // 点绘制是否激活
}
const getters = {
  leftFMPanelShow: state => { // 获取左侧控制面板是否向左收起
    return state.leftFMPanelShow
  },
  selectedfmTreeNode: state => { // 获取选中的树节点
    return state.selectedfmTreeNode
  },
  editFMTreeChangeCounter(state) { // 编辑树计数变化
    return state.editFMTreeChangeCounter
  },
  pointFMDrawActive: state => { // 获取点位绘制激活状态
    return state.pointFMDrawActive
  },
  lineFMDrawActive: state => { // 获取线绘制激活状态
    return state.lineFMDrawActive
  }
}
const mutations = {
  SET_LEFT_PANEL_SHOW(state, flag) {
    state.leftFMPanelShow = flag
  },
  SET_SELECTED_FMTREE_NODE(state, node) { // 设置选中的树节点
    state.selectedfmTreeNode = node
  },
  RESET_ALL_MAP_STATE_2D() { // 重置所有地图状态
    state.leftFMPanelShow = true // 默认左侧控制栏的显示
  },
  SET_ALARM_HELP_FMTREE(state, data) { // 报警求助 资源树
    state.alarmHelpFMTree = data
  },
  GET_PARTROL_FMTREE(state, data) { // 巡更资源树
    state.partrolFMTree = data
  },
  SET_DOORCONTROL_FMTREE(state, data) { // 门禁资源树
    state.doorControlFMTree = data
  },
  CHANGE_EDIT_FMTREE_CHANGE_COUTER(state, counter) {
    state.editFMTreeChangeCounter = counter
  },
  SET_POINT_FMDRAW_ACTIVE(state, flag) { // 设置点位绘制激活状态
    if (flag) {
      state.lineFMDrawActive = false
      // area.state.areaDrawActive = false
    }
    state.pointFMDrawActive = flag
  },
  SET_LINE_FMDRAW_ACTIVE(state, flag) { // 设置线绘制激活状态
    if (flag) {
      state.pointFMDrawActive = false
      // area.state.areaDrawActive = false
    }
    state.lineFMDrawActive = flag
  }
}

const actions = {
  setLeftPanelShow({ commit }, flag) {
    commit('SET_LEFT_PANEL_SHOW', flag)
  },
  setSelectedfmTreeNode({ commit }, node) {
    commit('SET_SELECTED_FMTREE_NODE', node)
  },
  getAlarmHelpFMTree({ commit }, playod) { // 获取报警求助树
    return new Promise((resolve, reject) => {
      getAlarmHelpOrgTreeApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_ALARM_HELP_FMTREE', [res.data])
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getPatrolPointFMTree({ // 获取巡更资源树
    commit
  }, playod) {
    return new Promise((resolve, reject) => {
      getPatrolPointApi(playod)
        .then(res => {
          resolve(res.data)
          commit('GET_PARTROL_FMTREE', toTreeData(res.data))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getDoorControlFMTree({ commit, state }, floorId) { // 获取门禁资源树
    let dcTree = window.localStorage.getItem('dcTree')
    if (dcTree) {
      let treeData = JSON.parse(dcTree)
      if (treeData && treeData.length > 0) {
        let resourceArr = JSON.parse(JSON.stringify(treeData[0].children))
        if (floorId) { // 传入楼层标识，过滤未添加或指定楼层的数据
          resourceArr = resourceArr.filter(item => !item.hasOwnProperty('point') || (item.hasOwnProperty('point') && !item.point.isouter))
        } else { // 未传入楼层标识，过滤未添加或楼外的数据
          resourceArr = resourceArr.filter(item => !item.hasOwnProperty('point') || (item.hasOwnProperty('point') && item.point.isouter))
        }
        treeData[0].children = resourceArr
        commit('SET_DOORCONTROL_FMTREE', toTreeData(treeData))
      }
    }
  },
  changeEditFMTreeChangeCounter({commit}, counter) { // 改变编辑树计数状态
    commit('CHANGE_EDIT_FMTREE_CHANGE_COUTER', counter)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
