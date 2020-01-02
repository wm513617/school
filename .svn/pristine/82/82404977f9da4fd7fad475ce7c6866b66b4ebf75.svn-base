import { getDutyListApi, getDutyByNameApi, getNoticeApi, setNoticeApi, deletedNoticeApi } from '../../../http/business'
import moment from 'moment'

const state = {
  dutyName: [],
  dutylistData: [],
  dutyOptions: [],
  todayDuty: {},
  caseID: '', // 案件处理 选中案件
  caseEdit: false, // 案件处理 是否编辑
  caseIndex: '', // 案件处理 事件录像段下标
  caseMarkingToogle: true // 案件处理【起、终标记】true【始】false【终】
}
const getters = {}
const mutations = {
  // 设置 案件处理 选中资源
  // 设置 案件处理 选中案件
  SET_CASE_ID(state, data) {
    state.caseID = data
  },
  // 设置案件处理 是否编辑
  SET_CASE_EDIT(state, data) {
    state.caseEdit = data
  },
  // 案件处理 事件录像段下标
  SET_CASE_INDEX(state, data) {
    state.caseIndex = data
  },
  // 案件处理 起始标记 显隐开关（仅在创建时启用）
  SET_CASE_MARKING_TOOGLE(state, data) {
    state.caseMarkingToogle = data
  },
  /**
   * 值班表名数组
   */
  SET_DUTY_OPTIONS(state, list) {
    state.dutyOptions = []
    state.dutylistData = []
    state.todayDuty = {}
    if (list.names) {
      list.names.forEach((v, n) => {
        state.dutyOptions.push({
          value: v,
          label: v
        })
      })
    }
  },
  /**
   * 值班表数据
   */
  SET_DUTY_LIST_DATA(state, list) {
    state.dutylistData = []
    state.dutyName = []
    if (list.plans[0] && list.plans[0].template && list.plans[0].template.detail) {
      list.plans[0].template.detail.forEach((v, n) => {
        state.dutyName.push('name' + n)
      })
      list.plans[0].detail.forEach((v, n) => {
        const obj = {}
        if (list.plans[0].planTimeType === 'month') {
          obj.date = n + 1
        } else if (list.plans[0].planTimeType === 'week') {
          obj.week = n + 1
        } else {
          obj.time = moment(v.date).format('YYYY-MM-DD')
        }
        v.staffs.forEach((val, index) => {
          let name = ''
          val.forEach((itme, n2) => {
            if (itme.realname) {
              name += itme.realname + '、'
            } else {
              name = ''
            }
          })
          obj[state.dutyName[index]] = name.slice(0, -1)
        })
        state.dutylistData.push(obj)
      })
    }
  },
  /**
   * 今日值班数据
   */
  SET_TODAY_DUTY: function(state, list) {
    if (list.todayDuty.time) {
      state.todayDuty.date = moment(list.todayDuty.time).format('ll')
      state.todayDuty.time = list.todayDuty.time
    }
    if (list.todayDuty.template) {
      state.todayDuty.content = []
      list.todayDuty.template.forEach((v, n) => {
        state.todayDuty.content.push({
          shift: v.shiftName,
          dutytime: v.startTime + '~' + v.endTime
        })
      })
      list.todayDuty.staffs[0].staffs.forEach((v1, n1) => {
        state.todayDuty.content[n1].people = []
        v1.forEach((v2, n2) => {
          state.todayDuty.content[n1].people.push({
            name: v2.realname,
            title: v2.title,
            phone: v2.phone
          })
        })
      })
    }
  }
}
/**
 * 获取值班列表
 */
const actions = {
  /**
   * 获取初始化列表
   */
  getDutyList({
    commit
  }, name) {
    return new Promise((resolve, reject) => {
      name = name || ''
      getDutyListApi(name)
        .then(res => {
          commit('SET_DUTY_OPTIONS', res.data)
          commit('SET_DUTY_LIST_DATA', res.data)
          commit('SET_TODAY_DUTY', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * 根据表名获取列表信息
   */
  getDutyByName({
    commit
  }, name) {
    return new Promise((resolve, reject) => {
      name = name || ''
      getDutyByNameApi(name)
        .then(res => {
          commit('SET_DUTY_OPTIONS', res.data)
          commit('SET_DUTY_LIST_DATA', res.data)
          commit('SET_TODAY_DUTY', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getNotice({ commit }) {
    return getNoticeApi()
  },
  setNotice({ commit }, body) {
    return setNoticeApi(body)
  },
  deletedNotice({ commit }) {
    return deletedNoticeApi()
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
