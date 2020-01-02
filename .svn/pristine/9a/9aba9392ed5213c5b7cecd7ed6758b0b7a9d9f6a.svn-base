import { merge } from 'lodash'
import { post, get } from '../../http/base.js'
import { saveMulti, clearMulti, save, read, clear } from '../../storage'
import { userInfoTest, getDutyUserList } from '../../http/user.api'
import validate from '../../validate.js'
// eslint-disable-next-line camelcase
import {
  username,
  orgId,
  access_token, // eslint-disable-line
  refresh_token, // eslint-disable-line
  faceRecognitionrole,
  homePagerole,
  peopleTrafficrole,
  securityMonitorrole,
  vehicleRecognizerole,
  videoStructuredrole,
  sysConfrole,
  webPri,
  themelistFlag,
  momentmunuList
} from '../../stored'
import { STORE_KEY_USERNAME, STORE_KEY_ACCESS_TOKEN, STORE_KEY_REFRESH_TOKEN, STORE_KEY_ORGID } from '../../constants'
import moment from 'moment'
import { connectAlarm, disconnectAlarm } from 'src/socket/alarm.js'

function ajax(url) {
  return new Promise((resolve, reject) => {
    let oAjax
    if (window.XMLHttpRequest) {
      oAjax = new XMLHttpRequest()
    } else {
      oAjax = new window.ActiveXObject('Microsoft.XMLHTTP')
    }
    oAjax.open('GET', url, true)
    oAjax.send()
    oAjax.onreadystatechange = function() {
      if (oAjax.readyState === 4) {
        if (oAjax.status === 200) {
          resolve(JSON.parse(oAjax.responseText))
        } else {
          reject(oAjax.status)
        }
      }
    }
  })
}

const keepStorageList = ['useSubStream', 'filterState', 'confirmedAlarm', 'alarm2DFilterState', 'fengMapAlarmFilterState', 'alarm2DFilterLevel', 'fengMapAlarmFilterLevel', 'alarm2Dswitch', 'fengMapAlarmswitch', '2DPointState', 'fengMapApplayPointState']
const state = {
  _id: '',
  role: 'guest',
  username: username,
  orgId,
  access_token, // eslint-disable-line
  refresh_token, // eslint-disable-line
  loginTimeFlag: '',
  loginInforImg: '',
  loginInname: '',
  loginText: '',
  faceRecognitionrole,
  homePagerole,
  peopleTrafficrole,
  securityMonitorrole,
  vehicleRecognizerole,
  videoStructuredrole,
  sysConfrole,
  webPri,
  momentmunuList,
  themelistFlag,
  mainMenu: [
    {
      name: '业务功能模块',
      children: []
    },
    {
      name: '功能管理模块',
      children: []
    }
  ],
  BStagList: [],
  auth: false
}

const mutations = {
  SET_USERAUTH(state, data) {
    state.auth = data
  },
  SET_MAINMENU(state, data) {
    clear('BStagList')
    state.BStagList = []
    if (data) {
      state.mainMenu = data
      validate.getTag(data, state.BStagList)
      save('BStagList', JSON.stringify(state.BStagList))
    }
  },
  SET_MOMENTMUNULIST(state, val) {
    state.momentmunuList = val
  },
  SET_THEME_LIST_FLAG(state, val) {
    state.themelistFlag = val
  },
  SET_LOGIN_IMG(state, val) {
    state.loginInforImg = val
  },
  SET_LOGIN_NAME_TITLE(state, val) {
    state.loginInname = val
  },
  // set user info
  SET_USER_INFO(state, userInfo) {
    merge(state, userInfo)
  },
  SET_USER_ID(state, id) {
    state._id = id
  },
  SET_LOGIN_TIME(state, time) {
    state.loginTimeFlag = time
  },
  SET_JURISDICTION(state, list) {
    state.faceRecognitionrole = list.faceRecognition || {}
    state.homePagerole = list.homePage || {}
    state.peopleTrafficrole = list.peopleTraffic || {}
    state.securityMonitorrole = list.securityMonitor || {}
    state.vehicleRecognizerole = list.vehicleRecognize || {}
    state.videoStructuredrole = list.videoStructured || {}
    state.sysConfrole = list.sysConf || {}
    state.webPri = list || {}
  },
  // after logout
  LOGOUT(state) {
    state._id = ''
    state.username = ''
    state.role = 'guest'
    state.access_token = '' // eslint-disable-line
    state.refresh_token = '' // eslint-disable-line
    state.faceRecognitionrole = {}
    state.homePagerole = {}
    state.peopleTrafficrole = {}
    state.securityMonitorrole = {}
    state.vehicleRecognizerole = {}
    state.videoStructuredrole = {}
    state.sysConfrole = {}
    state.webPri = {}
    state.momentmunuList = []
    state.themelistFlag = ''
  },
  LOGIN_TEXT(state, payLoad) {
    state.loginText = payLoad
  }
}

const actions = {
  checkBSRoleTag({ state }, payload) {
    var hasRole = state.BStagList.includes(payload)
    return hasRole
  },
  getMainMenu({ state, commit }, payLoad) {
    return new Promise((resolve, reject) => {
      if (state.BStagList.length) {
        resolve()
        return
      }
      var menu = null
      if (read('mainMenu') && read('mainMenu') !== 'undefined') {
        menu = JSON.parse(read('mainMenu'))
      }
      if (menu) {
        return commit('SET_MAINMENU', menu)
      }
    })
  },
  // 设置导航栏的菜单
  setMenueList({ commit, dispatch, state }, payload) {
    return new Promise((resolve, reject) => {
      commit('SET_MOMENTMUNULIST', payload)
      save('memueList', JSON.stringify(payload))
      resolve(payload)
    })
  },
  // 搜索用户权限树是否包含目标模块地址，判断用户访问权限
  setUsrAuth({ commit, state }, payload) {
    if (payload.url !== '/navigation' && payload.url !== '/login') {
      const shortUrl = payload.url.split('/')
      if (shortUrl.length > 3) {
        payload.url = shortUrl.slice(0, 3).join('/')
      }
      if (state.mainMenu) {
        var module =
          state.mainMenu[0] && state.mainMenu[0].children &&
          state.mainMenu[0].children.find(item => {
            return item.children && item.children.find(li => (li.url === payload.url || (li.children && li.children.find(el => el.url === payload.url))))
          })
        if (!module) {
          module =
            state.mainMenu[1] && state.mainMenu[1].children &&
            state.mainMenu[1].children.find(item => {
              return item.children && item.children.find(li => (li.url === payload.url || (li.children && li.children.find(el => el.url === payload.url))))
            })
        }
        commit('SET_USERAUTH', module !== undefined)
        payload = module || {
          children: []
        }
        commit('SET_MOMENTMUNULIST', JSON.parse(JSON.stringify(payload)))
        save('memueList', JSON.stringify(payload))
      }
    } else {
      commit('SET_USERAUTH', true)
    }
  },
  loginFun({ commit, dispatch }, payload) {
    const params = {
      body: payload,
      // url: '/auth/login'
      url: '/setting/user/login'
    }
    return new Promise((resolve, reject) => {
      post(params)
        .then(res => {
          var data = res['data']
          if (data.code === 200 && data.token) {
            // getUserInfo('eyJhbGciOiAiZGVzIiwgInR5cGUiOiAiSldUIn0=.eyJpZCI6IDE1MTU1NzE4MjUsICJyb2xlIjogImFkbWluIiwgInVzZXIiOiAiZGRtMSIsICJ0aW1lb3V0IjogMTAsICJjdGltZSI6IDE0OTg0NTg0NTYuMjE2fQ==.x7P+YDil+ipRdu87n1mCsQ==').then(user => {
            const userInfo = merge(
              {},
              {
                username: data.name,
                access_token: data.token, // eslint-disable-line
                refresh_token: '', // eslint-disable-line
                code: data.code,
                orgId: data.orgId,
                userId: data.userId,
                roleId: data.roleId,
                _id: data.userId,
                actionTree: data.actionTree.length > 0 ? data.actionTree[0].children : [],
                duty: data.duty
              }
            )
            commit('SET_USER_INFO', userInfo)
            saveMulti([
              {
                key: STORE_KEY_USERNAME,
                value: userInfo.username
              },
              {
                key: STORE_KEY_ACCESS_TOKEN,
                value: userInfo.access_token // eslint-disable-line
              },
              {
                key: STORE_KEY_REFRESH_TOKEN,
                value: userInfo.refresh_token // eslint-disable-line
              },
              {
                key: STORE_KEY_ORGID,
                value: userInfo.orgId
              }
            ])
            save('mainMenu', JSON.stringify(userInfo.actionTree))
            save('homeRoute', '/navigation')
            save('userId', userInfo.userId)
            save('roleId', userInfo.roleId)
            save('duty', userInfo.duty)
            save('actionTreeId', data.actionTree.length > 0 ? data.actionTree[0]._id : '')
            save('loginTime', moment().format('YYYY-MM-DD HH:mm:ss'))
            commit('SET_LOGIN_TIME', moment().format('YYYY-MM-DD HH:mm:ss'))
            connectAlarm()
            dispatch('alarmWarning')
            dispatch('getTwoImensionalInfo')
            // dispatch('getvideoOrg') // 登录后获取一次机构树，缓解预览回放加载慢
            dispatch('getUserListApi', userInfo.userId)
            resolve(userInfo)
          } else {
            resolve(data)
          }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getUserId({ commit }) {
    commit('SET_USER_ID', read('userId'))
  },

  // get logo and login image
  getLoginImg({ commit }) {
    const params = {
      query: {},
      url: '/setting/loginimgs'
      // url: '/setting/user/logout'
    }
    return new Promise((resolve, reject) => {
      get(params)
        .then(res => {
          resolve(res)
          commit('SET_ORGTREE_DATA', res.data)
        })
        .catch(err => reject(err))
    })
  },
  logoutFun({ commit, dispatch }, payLoad) {
    const params = {
      query: {},
      url: '/setting/user/logout'
    }
    return new Promise((resolve, reject) => {
      post(params)
        .then(res => {
          resolve(res)
          commit('LOGOUT')
          clearMulti([STORE_KEY_USERNAME, STORE_KEY_ORGID, STORE_KEY_ACCESS_TOKEN, STORE_KEY_REFRESH_TOKEN])
          clearLocalStorage()
          clear('', true)
          // window.localStorage.clear()
          // 报警连接断开
          dispatch('clearWarningList')
          disconnectAlarm()
        })
        .catch(err => {
          commit('LOGOUT')
          clearMulti([STORE_KEY_USERNAME, STORE_KEY_ORGID, STORE_KEY_ACCESS_TOKEN, STORE_KEY_REFRESH_TOKEN])
          clearLocalStorage()
          // window.localStorage.clear()
          console.log('this.logoutFun' + err)
        })
    })
  },
  //  ukey写入key值
  programmerUkey({ commit }, id) {
    return ajax(`http://127.0.0.1:47651/ukey/write/${id}`)
  },
  // ukey插入监听
  monitorUkey() {
    return ajax('http://127.0.0.1:47651/ukey/info')
  },
  setMainMenu({ commit }, payload) {
    commit('SET_MAINMENU', payload)
  },
  // 交接班用户检测
  testUserInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      userInfoTest(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取可以交接班的用户列表
  // 追加了一些字段
  getDutyUserNameList() {
    return getDutyUserList()
  }
}

const getters = {
  getUserAuth() {
    return state.auth
  },
  getUserDuty() {
    return state.duty
  },
  momentmunuList() {
    return state.momentmunuList
  },
  getsysmenu() {
    return state.sysmenu
  },
  getmenuList() {
    return state.menuList
  },
  themelistFlag() {
    return state.themelistFlag
  },
  webPri(state) {
    return state.webPri
  },
  userId(state) {
    return state._id
  },
  faceRecognitionrole(state) {
    return state.faceRecognitionrole
  },
  homePagerole(state) {
    return state.homePagerole
  },
  peopleTrafficrole(state) {
    return state.peopleTrafficrole
  },
  securityMonitorrole(state) {
    return state.securityMonitorrole
  },
  vehicleRecognizerole(state) {
    return state.vehicleRecognizerole
  },
  videoStructuredrole(state) {
    return state.videoStructuredrole
  },
  sysConfrole(state) {
    return state.sysConfrole
  },
  getLoginInforImg(state) {
    return state.loginInforImg
  },
  getLoginInname(state) {
    return state.loginInname
  },
  userRole(state) {
    return state.role
  },
  accessToken(state) {
    return state.access_token // eslint-disable-line
  },
  username(state) {
    return state.username
  },
  loggedIn(state) {
    return !!(state.username && state.access_token) // eslint-disable-line
  },
  getloginTimeFlag(state) {
    return state.loginTimeFlag
  }
}

function clearLocalStorage() {
  // 清除localStorage但是保留keepList里的例外
  const keep = {}
  const storage = window.localStorage
  keepStorageList.forEach(key => {
    const value = storage.getItem(key)
    if (value) {
      keep[key] = value
    }
  })
  storage.clear()
  for (const key in keep) {
    storage.setItem(key, keep[key])
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
