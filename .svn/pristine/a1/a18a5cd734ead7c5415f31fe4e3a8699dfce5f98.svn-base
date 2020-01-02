import { getAlarmTreeApi, getAlarmInputApi, getFireAlarmApi, getVideoAlarmApi, getAlarmOrgTreeApi, addNormalAlarmApi, deleteNormalAlarmApi, editNormalAlarmApi, editMoreNormalAlarmApi, getDeviceTreeApi, getLinkActionApi, saveLinkActionApi, getAlarmHostApi, getAlarmHelpApi, editAlarmHelpApi, getTrafficTreeApi, getTrafficAlarmApi, getFaceAlarmTreeApi, getFaceAlarmApi, getAlarmDelayApi, setAlarmDelayApi, getTvWallListApi, getTvWallSceneApi, getMonitorTreeApi, getMonitorAlarmApi, addMonitorAlarmApi, getIntelligentAlarmApi, editMonitorAlarmApi, editMoreMonitorAlarmApi, deleteMonitorAlarmApi, addIntelligentAlarmApi, deleteIntelligentAlarmApi, editIntelligentAlarmApi, editMoreIntelligentAlarmApi, getFireHostListApi, getEquipmentAlarmApi, getEquipmentTreeApi, addEquipmentAlarmApi, editDeviceAlarmApi, deleteDeviceAlarmApi, addFireAlarmApi, saveMoreLinkActionApi, addMoreFireAlarmApi, deleteFireAlarmApi, editFireAlarmApi, editMoreFireAlarmApi, moveFireAlarmApi, editTrafficAlarmApi, getFireHostCountApi, getAllAlarmTabNumberApi, syncFireAlarmApi } from 'http/alarmManage.api.js'
const state = {
  orgTreeData: [], // 机构树
  orgIdList: [],
  allTabNumber: {
    faceAlarmNo: 0,
    trafficLaneNo: 0,
    alarmClientNo: 0,
    monitoryPointAlarmNo: 0,
    intelligentAlarmNo: 0,
    deviceAlarmNo: 0,
    alarmInputNo: 0,
    alarmHostNo: 0,
    fireAlarmNo: 0,
    alarmOutputNo: 0
  }
}
const mutations = {
  GET_ALARM_ORG_TREE(state, data) {
    state.orgTreeData = [data]
  },
  // 获取父及子机构ID
  SET_ORGID_LIST(state, data) {
    state.orgIdList = data
  },
  SET_ALL_TAB_NUMBER(state, data) {
    state.allTabNumber = data
  },
  SET_ONE_TAB_NUMBER(state, payload) {
    state.allTabNumber[payload.type] = payload.count
  }
}
const actions = {
  /**
   * 获取 报警管理左侧 机构树
   */
  getAlarmOrgTree({commit}) {
    return new Promise((resolve, reject) => {
      getAlarmOrgTreeApi().then(res => {
        resolve(res)
        commit('GET_ALARM_ORG_TREE', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },

  /**
   * 获取 添加 报警输入、报警主机、报警输出 时的设备资源树
   * @param {string} oid 跟机构id
   * @param {number} orgtype  0
   * @param {string} channelTypes '1,7':报警输入  '10,9'：报警主机 '2,10':报警输出
   * @param {string} bigTypes '0,5':报警输入 '1':报警主机 '0,1': 报警输出
   */
  getNormalAlarmAddTree({commit}, data) {
    return getAlarmTreeApi(data)
  },

  /**
   * 获取 报警输入、报警输出 列表数据
   * @param {string} oid 当前机构id
   * @param {number} never -1:显示子机构下  0：不显示子机构
   * @param {string} seek 搜索内容
   * @param {number} page 页码
   * @param {number} limit 页条数
   * @param {string} channelTypes '1,9':报警输入  '2,10'报警输出
   * @param {string} config '1':勾选显示未配置联动  '0': 未勾选未配置联动
   */
  getNormalAlarmInData({commit}, data) {
    return getAlarmInputApi(data)
  },
  /**
   * 添加 报警输入、报警输出、报警主机
   * @param {object} data
   * @property {string} oid
   * @property {Array} rids
   * @property {object} body
   */
  addAlarmInputData({commit}, data) {
    return addNormalAlarmApi(data)
  },
  // 删除 报警输入、报警输出、报警主机
  deleteAlarmInputData({commit}, data) {
    return deleteNormalAlarmApi(data)
  },
  // 修改 报警输入、报警输出、报警主机
  editAlarmInputData({commit}, data) {
    return editNormalAlarmApi(data)
  },
  // 批量修改 报警输入/报警主机、报警输出
  editMoreAlarmInputData({commit}, data) {
    return editMoreNormalAlarmApi(data)
  },
  /**
   * 获取 报警主机
   * @param {Object} data
   * @property {Number} page 页码
   * @property {Number} limit 页条数
   * @property {String} oid 机构id
   * @property {Number} type 设备类型 '9'
   * @property {String} never -1:显示子机构下  0：不显示子机构
   * @property {String} seek 搜索
   * @returns
   */
  getAlarmHostData({commit}, data) {
    return getAlarmHostApi(data)
  },
  /**
   * 获取 消防报警 列表数据
   * @param {number} page 页码
   * @param {number} limit 页条数
   * @param {string} seek 搜索内容
   * @param {string} oid 当前机构id
   * @param {number} never -1:显示子机构下  0：不显示子机构
   * @param {string} type 11
   */
  getFireAlarmData({commit}, data) {
    return getFireAlarmApi(data)
  },

  /**
   * 获取 智能报警/监控点报警 列表数据
   * @param {string} oid  当前选中机构id
   * @param {number} never -1:显示子机构下  0：不显示子机构
   * @param {string} seek 搜索内容
   * @param {number} page 当前页
   * @param {number} limit 一页显示多少条
   * @param {string} category 'intelligentAlarm'：智能报警   'monitoryPointAlarm':监控点报警
   */
  getVideoAlarmData({commit}, data) {
    return getVideoAlarmApi(data)
  },
  /**
   * 获取 设备报警 数据
   * @param {string} oid 当前机构id
   * @param {number} never -1:显示子机构下  0：不显示子机构
   * @param {string} seek 搜索内容
   * @param {number} page 页码
   * @param {number} limit 页条数
   * @param {number} config 0: 不勾选  1:勾选了只显示未配置联动
   */
  getEquipmentAlarmData({commit}, data) {
    return getEquipmentAlarmApi(data)
  },
  /**
   * 添加 设备报警 数据
   * @param {object} data
   * @property {string} oid
   * @property {Array} rids
   * @property {object} body
   */
  addEquipmentData({commit}, data) {
    return addEquipmentAlarmApi(data)
  },
  /**
   * 修改 设备报警
   * @param {*} data
   * @returns
   */
  editDeviceAlarmData({commit}, data) {
    return editDeviceAlarmApi(data)
  },
  /**
   * 删除 报设备报警
   * @param {String} data 删除报警主机的id
   */
  deleteDeviceAlarmData({commit}, data) {
    return deleteDeviceAlarmApi(data)
  },
  /**
   * 获取 报警求助 数据
   * @param {object} data
   * @property {String} name 搜索内容
   * @property {Number} page 页码
   * @property {Number} limit 页条数
   * @returns
   */
  getAlarmHelpData({commit}, data) {
    return getAlarmHelpApi(data)
  },
  /**
   * 修改 报警求助
   * @param {*} data
   * @returns
   */
  editAlarmHelpData({commit}, data) {
    return editAlarmHelpApi(data)
  },
  /**
   * 获取 智能交通 左侧机构树
   * @param {*} data
   * @returns
   */
  getTrafficTreeData({commit}, data) {
    return getTrafficTreeApi(data)
  },
  /**
   * 获取 智能交通 报警数据
   * @param {Object} data
   * @property {String} deptId
   * @property {String} sid
   * @property {String} recursive 0
   * @property {String} key
   * @property {Number} page
   * @property {Number} limit
   * @property {Number} config 1：勾选显示未配置联动 0：未勾选
   * @returns
   */
  getTrafficAlarmData({commit}, data) {
    return getTrafficAlarmApi(data)
  },
  /**
   * 修改 智能交通报警
   * @param {Object} data
   * @property {String} id 资源id
   * @property {Object} body 修改信息
   */
  editTrafficAlarmData({commit}, data) {
    return editTrafficAlarmApi(data)
  },
  /**
   * 获取人像布控报警 左侧机构树
   * @param {*} data
   * @returns
   */
  getFaceAlarmTreeData({commit}, data) {
    return getFaceAlarmTreeApi(data)
  },
  /**
   * 获取 人像布控 报警数据
   * @param {Object} data
   * @property {Number} page
   * @property {Number} limit
   * @property {String} oid
   * @property {String} type 0
   * @property {Number} never 0 -1
   * @property {String} seek
   * @property {Number} config 1：勾选显示未配置联动 0：未勾选
   * @returns
   */
  getFaceAlarmData({commit}, data) {
    return getFaceAlarmApi(data)
  },
  /**
   * 获取 联动配置 机构树设备树/报警输出
   * @param {string} orgtype  0
   * @param {string} channelTypes  0视频资源 10输出
   * @param {string} resId  资源id
   * @param {string} never  显示其他机构：-1勾选  0不勾选
   * @param {string} oid  机构id
   */
  getDeviceTreeData({commit}, data) {
    return getDeviceTreeApi(data)
  },
  /**
   * 获取 设备报警树
   * @param {string} oid  机构id
   */
  getEquipmentTreeData({commit}, data) {
    return getEquipmentTreeApi(data)
  },
  /**
   * 获取 报警的联动配置
   * @param {string} data 报警资源id
   */
  getLinkActionData({commit}, data) {
    return getLinkActionApi(data)
  },

  /**
   * 保存 报警联动配置
   * @param {Object} data
   * @returns
   */
  saveLinkActionData({commit}, data) {
    return saveLinkActionApi(data)
  },
  /**
   * 批量联动配置
   */
  saveMoreLinkActionData({commit}, data) {
    return saveMoreLinkActionApi(data)
  },
  /**
   * 获取 报警延时 配置
   */
  getAlarmDelayData({commit}, data) {
    return getAlarmDelayApi()
  },
  /**
   * 修改 报警延时 配置
   */
  setAlarmDelayData({commit}, data) {
    return setAlarmDelayApi(data)
  },
  // 获取父及子机构ID
  setOrgIdList({
    commit,
    state
  }, data) {
    commit('SET_ORGID_LIST', data)
  },
  // 获取 联动配置中 联动电视墙列表
  getTvWallList({commit}, data) {
    return getTvWallListApi()
  },
  // 获取 联动电视墙场景
  getTvWallSceneList({commit}, data) {
    return getTvWallSceneApi(data)
  },
  // 获取 监控点/智能报警 添加时 机构设备树
  getMonitorTree({commit}, data) {
    return getMonitorTreeApi(data)
  },
  /**
   * 获取 监控点 报警数据
   * @param {Object} data
   * @property {Number} page
   * @property {Number} limit
   * @property {String} oid
   * @property {Number} never 0 -1
   * @property {String} seek
   * @property {Number} config 1：勾选显示未配置联动 0：未勾选
   */
  getMonitorAlarmData({commit}, data) {
    return getMonitorAlarmApi(data)
  },
  /**
   * 添加 监控点报警
   * @param {Object} data
   * @property {String} orgId
   * @property {String} objs // 添加 资源信息: rid name chan
   * @property {String} subtype
   * @property {Number} level
   * @property {String} alarmtemplate
   * @property {Number} minintervaltime
   * @property {Object} alarmaffirm
   */
  addMonitorAlarmData({commit}, data) {
    return addMonitorAlarmApi(data)
  },
  /**
   * 修改 单个 监控点报警
   * @param {Object} data
   * @property {String} id 资源id
   * @property {Object} body 修改信息
   */
  editMonitorAlarmData({commit}, data) {
    return editMonitorAlarmApi(data)
  },
  /**
   * 批量修改 监控点报警
   * @param {Object} data
   * @property {String} ids
   * @property {Object} body
   */
  editMoreMonitorAlarmData({commit}, data) {
    return editMoreMonitorAlarmApi(data)
  },
  /**
   * 删除 监控点 报警
   */
  deleteMonitorAlarmData({commit}, ids) {
    return deleteMonitorAlarmApi(ids)
  },
  /**
   *获取 智能报警 报警数据
   * @param {Object} data
   * @property {Number} page
   * @property {Number} limit
   * @property {String} oid
   * @property {Number} never 0 -1
   * @property {String} seek
   * @property {Number} config 1：勾选显示未配置联动 0：未勾选
   */
  getIntelligentAlarmData({commit}, data) {
    return getIntelligentAlarmApi(data)
  },
  /**
   * 添加 智能报警
   * @param {Object} data
   * @property {String} orgId
   * @property {String} objs // 添加 资源信息: rid name chan
   * @property {String} subtype
   * @property {Number} level
   * @property {String} alarmtemplate
   * @property {Number} minintervaltime
   * @property {Object} alarmaffirm
   */
  addIntelligentAlarmData({commit}, data) {
    return addIntelligentAlarmApi(data)
  },
  /**
   * 删除 智能报警
   */
  deleteIntelligentAlarmData({commit}, ids) {
    return deleteIntelligentAlarmApi(ids)
  },
  /**
   * 修改单个 智能报警
   * @param {Object} data
   * @property {String} id 资源id
   * @property {Object} body 修改信息
   */
  editIntelligentAlarmData({commit}, data) {
    return editIntelligentAlarmApi(data)
  },
  /**
   * 批量修改 智能报警
   * @param {Object} data
   * @property {String} ids
   * @property {Object} body
   */
  editMoreIntelligentAlarmData({commit}, data) {
    return editMoreIntelligentAlarmApi(data)
  },
  /**
   * 获取 消防主机下拉列表数据
   * @param {Number} page
   * @param {Number} limit
   * @param {Number} never -1
   * @param {String} oid 跟机构id
   */
  getFireHostList({commit}, data) {
    return getFireHostListApi(data)
  },
  /**
   * 添加 消防报警
   */
  addFireAlarmData({commit}, data) {
    return addFireAlarmApi(data)
  },
  // 批量 添加消防报警
  addMoreFireAlarmData({commit}, data) {
    return addMoreFireAlarmApi(data)
  },
  // 删除 消防报警
  deleteFireAlarmData({commit}, data) {
    return deleteFireAlarmApi(data)
  },
  /**
   * 修改单个 消防报警
   * @param {Object} data
   * @property {String} id
   * @property {Object} body
   */
  editFireAlarmData({commit}, data) {
    return editFireAlarmApi(data)
  },
  /**
   * 批量 修改 消防报警
   * @param {Object} data
   * @property {String} ids
   * @property {Object} body
   */
  editMoreFireAlarmData({commit}, data) {
    return editMoreFireAlarmApi(data)
  },

  moveFireAlarmData({commit}, data) {
    return moveFireAlarmApi(data)
  },
  /**
   * 消防报警 获取 消防主机剩余数量
   */
  getFireHostCountData({commit}, data) {
    return getFireHostCountApi(data)
  },
  /**
   * 获取 所有报警tab数量
   */
  getAllAlarmTabNumber({commit}, data) {
    return new Promise((resolve, reject) => {
      getAllAlarmTabNumberApi(data).then(res => {
        commit('SET_ALL_TAB_NUMBER', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getOneAlarmTabNumber({commit}, data) {
    commit('SET_ONE_TAB_NUMBER', data)
  },
  /* 科大国创 同步接口 */
  syncFireAlarm() {
    return syncFireAlarmApi()
  }
}
export default {
  state,
  mutations,
  actions
}
