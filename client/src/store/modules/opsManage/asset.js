import { getOperateListApi, getAssetsListApi, getEquipmentDetailsApi, setEquipmentDetailsApi, setMaintenanceApi, getChartApi } from '../../../http/opsManage/assetManage.api'

const state = {
  operateList: [], // 资产管理厂商列表
  assetsList: {}, // 资产统计详情
  detailList: {}, // 设备详情信息
  chartList: {} // 图表数据
}
const mutations = {
  GET_OPERATE_LIST(state, payload) {
    state.operateList = payload.data.devList
  },
  GET_ASSETS_LIST(state, payload) {
    state.assetsList = payload
  },
  GET_QUIPMENT_DETAIL(state, payload) {
    state.detailList = payload
  },
  GET_CHART_LIST(state, payload) {
    state.chartList = payload
  }
}
const actions = {
/*
* 获取资产管理厂商列表
*/
  getOperateList({ commit }) {
    return getOperateListApi().then(res => {
      res.data.devList.forEach(element => {
        let arr = []
        element.contacts.forEach(item => {
          if (item.contact !== '') {
            arr.push(JSON.parse(JSON.stringify(item)))
          }
        })
        element.contacts = JSON.parse(JSON.stringify(arr))
      })
      commit('GET_OPERATE_LIST', res)
      return res
    }).catch(err => {
      return err
    })
  },
  /*
  * 获取资产统计详情
  */
  getAssetsList({ commit, rootState }, query) {
    query.oid = rootState.orgSetting.orgActiveId
    return getAssetsListApi(query).then(res => {
      commit('GET_ASSETS_LIST', res)
      return res
    }).catch(err => {
      return err
    })
  },
  /*
  * 获取详情信息
  */
  getEquipmentDetails({ commit }, query) {
    return getEquipmentDetailsApi(query).then(res => {
      commit('GET_QUIPMENT_DETAIL', res)
      return res
    }).catch(err => {
      return err
    })
  },
  /**
   *设置详情信息
   */
  setEquipmentDetails({ commit }, query) {
    return setEquipmentDetailsApi(query).then(res => {
      return res
    }).catch(err => {
      return err
    })
  },
  /**
   *批量设置维保
   */
  setMaintenance({ commit }, query) {
    return setMaintenanceApi(query).then(res => {
      return res
    }).catch(err => {
      return err
    })
  },
  /**
   *图表数据获取
   */
  getChart({ commit, rootState }, query) {
    query.orgActiveId = rootState.orgSetting.orgActiveId
    return getChartApi(query).then(res => {
      commit('GET_CHART_LIST', res)
      return res
    }).catch(err => {
      return err
    })
  }
}
export default {
  state,
  mutations,
  actions
}
