import { get, put, remove } from 'http/base'
import { getSocket } from 'src/socket/socket.js'
import { read } from '../../../storage/index'
import toTreeData from '../../../assets/js/toTreeData'
const state = {
  mapAlarmList: [], // 地图编辑模式报警资源列表
  editAlarmDraw: false, // 地图编辑模式绘制报警点位控件状态
  editAlarmList: [], // 编辑模式报警点位数组
  editAlarmInMapList: [],
  editCurrentAlarm: null, // 地图编辑模式当前操作的报警点位对象
  editAlarmCheck: true, // 编辑模式消防点位的勾选状况
  oneMapAlarmData: {},
  oneMapAlarmList: [],
  oneMapAlarmCheck: {},
  oneFloorAlarmList: [],
  appAlarmCheck: false, // 应用模式，报警点位的勾选状况
  appAlarmCommonCheck: false, // 应用模式，普通报警点位的勾选状况
  appCommonAlarmList: [], // 应用模块，普通报警点位数组
  appAlarmInMapList: [], // 应用模块，报警点位数组
  appAlarmList: [], // 应用模式，报警和普通报警点位总数组
  floorCommonAlarmList: [],
  commonAlarmList: [], // 普通报警数组集合
  appAlarmingList: [], // 正在报警的总点位数组
  appCurrentAlarmingList: [], // 当前页面正在报警的点位数组(地图和楼层)
  appFloorAlarmingList: [], // 楼层中的正在报警的点位数组
  fireAlarmList: [], // 报警消息列表
  eventTypeList: {
    alarmInput: '报警输入',
    alarmOut: '报警输出',
    alarmVideoLost: '视频丢失',
    vehicleBlack: '车辆识别黑名单',
    vehicleWhite: '车辆白名单',
    vehicleDispatch: '车辆布控',
    faceBlack: '人脸识别',
    faceWhite: '人脸白名单',
    faceDispatch: '人脸布控',
    alarmMoveSense: '移动侦测',
    videoMask: '视频遮挡',
    sceneSwitch: '镜头移位',
    definitionAbnormal: '清晰度异常',
    brightnessAbnormal: '亮度异常',
    noise: '噪声检测',
    colorCast: '偏色控制',
    signalLoss: '信号缺失',
    screenFreeze: '画面冻结',
    perimeter: '周界保护',
    tripwire: '绊线',
    leftObject: '遗留物检测',
    missingObject: '物品丢失',
    peopleCount: '人数统计',
    fight: '斗殴',
    loitering: '人员滞留',
    approach: '人员贴近',
    armyGuard: '哨兵管控',
    atmCare: 'ATM看护',
    hardDiskFailure: '硬盘故障',
    hardDiskFull: '硬盘满',
    fanAbnormal: '风扇异常',
    networkDown: '网络断开',
    mainBoardAbnormal: '主板异常',
    channelAbnormal: '通道异常',
    temperatureAbnormal: '温度异常',
    timeAbnormal: '时间异常',
    ipConflict: 'IP地址冲突',
    illegalNetworkAccess: '非法本地访问',
    damagedDiskSectors: '硬盘坏道',
    ipcMacCheckException: 'MAC校验异常',
    lingerDetection: '徘徊检测',
    doubleCordon: '双警戒线',
    retrogradeDetection: '逆行检测',
    fireAlarm: '消防报警',
    fireFailure: '消防故障',
    askHelp: '报警求助'
  },
  fireAlarmingData: {},
  appAlarmInData: {},
  alarmType: 'all',
  addAlarmInfo: null, // 编辑模式,点击切换校区时，添加报警点位所需参数
  alarmIngOne: {},
  appMoveSinglePosition: null, // 移动单兵推送的实时位置
  socketCloseState: false, // socket是否正常断开
  endHelp: [] // 已确认报警助消息
}
const getters = {}
const mutations = {
  // 已确认报警助消息
  SET_ENDHELP(state, data) {
    state.endHelp = data
  },
  ADDENDHELP(state, data) {
    let repeat = false
    if (state.endHelp.length) {
      state.endHelp.forEach((item, index) => {
        if (item.devId === data.devId) {
          repeat = true
        }
      })
    }
    if (!repeat) {
      state.endHelp.push(data)
    }
    this.commit('SET_ENDHELP', state.endHelp)
  },
  SET_SOCKETCLOSESTATE(state, data) {
    state.socketCloseState = data
  },
  // 移动单兵推送的实时位置
  SET_APPMOVESINGLE_POSITION(state, data) {
    state.appMoveSinglePosition = data
  },
  // 楼层中的正在报警的点位数组
  SET_APPFLOORALARMING_LIST(state, data) {
    state.appFloorAlarmingList = data
  },
  // 编辑模式消防点位的勾选状况
  SET_EDITALARM_CHECK(state, data) {
    state.editAlarmCheck = data
  },
  // 点击切换校区时，添加报警点位所需参数
  SET_ADDALARM_INFO(state, data) {
    state.addAlarmInfo = data
  },
  // 当前页面正在报警的点位数组(地图和楼层)
  SET_APPCURRENTALARMING_LIST(state, data) {
    state.appCurrentAlarmingList = data
  },
  // 正在报警的点位数组
  SET_APPALARMING_LIST(state, data) {
    state.appAlarmingList = data
  },
  // 应用模块，报警点位数组
  SET_APPALARMINMAP_LIST(state, data) {
    state.appAlarmInMapList = data
  },
  // 应用模块，普通报警点位数组
  SET_APPCOMMONALARM_LIST(state, data) {
    state.appCommonAlarmList = data
  },
  // 应用模式，普通报警点位的勾选状况
  SET_APPCOMMONALARM_CHECK(state, data) {
    state.appAlarmCommonCheck = data
  },
  // 应用模式，报警和普通报警点位总数组
  SET_APPALARM_LIST(state, data) {
    state.appAlarmList = data
  },
  // 应用模式，报警点位的勾选状况
  SET_APPALARM_CHECK(state, data) {
    state.appAlarmCheck = data
  },
  // 地图编辑模式当前操作的报警点位对象
  SET_EDITCURRENT_ALARM(state, data) {
    state.editCurrentAlarm = data
  },
  // 编辑模式报警点位数组
  SET_EDITALARM_LIST(state, data) {
    state.editAlarmList = data
  },
  SET_EDITALARMINMAP_LIST(state, data) {
    state.editAlarmInMapList = data
  },
  // 地图编辑模式绘制报警点位控件状态
  SET_EDITALARDRAW_STATE(state, data) {
    state.editAlarmDraw = data
  },
  // 地图报警资源
  GET_ALARMORG_TREE(state, data) {
    state.mapAlarmList = data
  },
  // 单个报警资源
  GET_ONEALARM_ONE(state, data) {
    state.oneMapAlarmData = data
  },
  // 防区列表
  GET_ONEMAPALARMLIST_LIST(state, data) {
    state.oneMapAlarmList = data
  },
  // 查看报警
  GET_ONEMAPALARM_DATA(state, data) {
    state.oneMapAlarmCheck = data
  },
  // 忽略报警
  SET_ONEMAPALARM_DATA(state, data) {
    state.fireAlarmList.splice(data, 1)
  },
  // 清除
  CLEAR_ONEMAPALARM_DATA(state, data) {
    state.fireAlarmList = data
  },
  // 获取当前楼层下的所有报警点位
  GET_ONEFLOORALARMLIST_LIST(state, data) {
    state.oneFloorAlarmList = data
  },
  SET_MAPRECEIVE_WARNNING(state, dataParam) {
    let data = JSON.parse(JSON.stringify(dataParam))
    if (data.type === 'patrolAlarm') {
      if (!data.map3D.geo && !data.map2D.geo) {
        return
      }
    } else {
      if (!data.point3D && !data.point && !data.bondCarmerRes) {
        return
      }
    }
    let arr = JSON.parse(JSON.stringify(state.fireAlarmList))
    state.fireAlarmingData = data
    if (data.type && (data.type === 'commonAlarm' || data.type === 'fireAlarm')) {
      // 普通报警、消防报警
      let eventType = data.eventType.toString()
      data.eventTypeName = state.eventTypeList[eventType] || '其他'
      if (arr.length === 0) {
        arr.push({
          name: data.name,
          param: [data],
          type: data.type
        })
      } else {
        let eventNameRepeat = false
        arr.forEach(element => {
          if (element.name === data.name) {
            eventNameRepeat = true
            let isRepeat = false
            if (element.param[0].point3D) {
              let newElement = element.param[0].point3D._id
              if (newElement === data.point3D._id) {
                isRepeat = true
                element.param.unshift(data)
              }
            } else {
              let newElement = element.param[0].point._id
              if (newElement === data.point._id) {
                isRepeat = true
                element.param.unshift(data)
              }
            }
            if (!isRepeat) {
              if (arr.length >= 50) {
                arr.pop()
              }
              arr.unshift({
                name: data.name,
                param: [data],
                type: data.type
              })
            }
          }
        })
        if (!eventNameRepeat) {
          if (arr.length >= 50) {
            arr.pop()
          }
          arr.unshift({
            name: data.name,
            param: [data],
            type: data.type
          })
        }
      }
      state.fireAlarmList = JSON.parse(JSON.stringify(arr))
    } else if (data.type && data.type === 'askHelp') {
      // 报警求助
      let eventType = data.eventType.toString()
      data.eventTypeName = state.eventTypeList[eventType] || '其他'
      if (arr.length === 0) {
        arr.push({
          name: data.name,
          param: [data],
          type: data.type
        })
      } else {
        let eventNameRepeat = false
        arr.forEach(element => {
          if (element.name === data.name) {
            eventNameRepeat = true
            let isRepeat = false
            if (element.param[0].bondCarmerRes.point3D) {
              let newElement = element.param[0].bondCarmerRes._id
              if (newElement === data.bondCarmerRes._id) {
                isRepeat = true
                element.param.unshift(data)
              }
            } else {
              let newElement = element.param[0].bondCarmerRes._id
              if (newElement === data.bondCarmerRes._id) {
                isRepeat = true
                element.param.unshift(data)
              }
            }
            if (!isRepeat) {
              if (arr.length >= 50) {
                arr.pop()
              }
              arr.unshift({
                name: data.name,
                param: [data],
                type: data.type
              })
            }
          }
        })
        if (!eventNameRepeat) {
          if (arr.length >= 50) {
            arr.pop()
          }
          arr.unshift({
            name: data.name,
            param: [data],
            type: data.type
          })
        }
      }
      state.fireAlarmList = JSON.parse(JSON.stringify(arr))
    } else if (data.type && data.type === 'singleAlarm') {
      if (arr.length === 0) {
        arr.push({
          name: data.user.realname,
          photo: data.user.photo,
          param: [data],
          type: data.type
        })
      } else {
        let singleeventNameRepeat = false
        arr.forEach(element => {
          if (element.type === 'singleAlarm' && element.name === data.user.realname) {
            singleeventNameRepeat = true
            let isRepeat = false
            let newElement = element.param[0].user._id
            if (element.param[0].user && newElement === data.user._id) {
              isRepeat = true
              element.param.unshift(data)
            }
            if (!isRepeat) {
              if (arr.length >= 50) {
                arr.pop()
              }
              arr.unshift({
                name: data.user.realname,
                photo: data.user.photo,
                param: [data],
                type: data.type
              })
            }
          }
        })
        if (!singleeventNameRepeat) {
          if (arr.length >= 50) {
            arr.pop()
          }
          arr.unshift({
            name: data.user.realname,
            photo: data.user.photo,
            param: [data],
            type: data.type
          })
        }
      }
      state.fireAlarmList = JSON.parse(JSON.stringify(arr))
    } else if (data.type && data.type === 'patrolAlarm') {
      // 巡更报警
      if (arr.length === 0) {
        arr.push({
          name: data.message.sender || '',
          devId: data.message.devId || '',
          param: [data],
          type: data.type
        })
      } else {
        let patroleventNameRepeat = false
        arr.forEach(element => {
          if (element.devId === data.message.devId) {
            patroleventNameRepeat = true
            let isRepeat = false
            let newElement = element.param[0].message.devId
            if (element.param[0].message.devId && newElement === data.message.devId) {
              isRepeat = true
              element.param.unshift(data)
            }
            if (!isRepeat) {
              if (arr.length >= 50) {
                arr.pop()
              }
              arr.unshift({
                name: data.message.sender,
                devId: data.message.devId,
                param: [data],
                type: data.type
              })
            }
          }
        })
        if (!patroleventNameRepeat) {
          if (arr.length >= 50) {
            arr.pop()
          }
          arr.unshift({
            name: data.message.sender,
            devId: data.message.devId,
            param: [data],
            type: data.type
          })
        }
      }
      state.fireAlarmList = JSON.parse(JSON.stringify(arr))
    }
  },
  // 地图id获取普通报警
  GET_ONEMAPCOMMONALARM_LIST(state, data) {
    state.commonAlarmList = data
  },
  // 楼层id获取普通报警
  GET_ONEFLOORCOMMONALARM_LIST(state, data) {
    state.floorCommonAlarmList = data
  },
  // 设置接收报警的类型
  SET_APPALARM_TYPE(state, data) {
    state.alarmType = data
  },
  // 当前点击的闪烁图标参数
  SET_ALARMING_DATA(state, data) {
    state.alarmIngOne = data
  }
}
let mapWarningWebsocket
const actions = {
  // SET_APPALARM_LIST
  setAppAlarmList({ commit }, data) {
    commit('SET_APPALARM_LIST', data)
  },
  // SET_APPCURRENTALARMING_LIST
  setAppCurrentAlarmingList({ commit }, data) {
    commit('SET_APPCURRENTALARMING_LIST', data)
  },
  // SET_APPFLOORALARMING_LIST
  setAppFloorAlarmingList({ commit }, data) {
    commit('SET_APPFLOORALARMING_LIST', data)
  },
  // SET_APPALARMING_LIST
  setAppAlarmingList({ commit }, data) {
    commit('SET_APPALARMING_LIST', data)
  },
  // 获取报警资源
  getAlarmOrg({ commit }, floorId) {
    const param = {
      url: '/setting/resource/tree/map/firealarmin',
      query: {
        orgtype: 0,
        channelTypes: '11,9'
      }
    }
    if (floorId) {
      param.query.storeyId = floorId
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          let arr = []
          arr.push(JSON.parse(JSON.stringify(res.data)))
          commit('GET_ALARMORG_TREE', toTreeData(arr))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取单个报警资源
  getOneAlarm({ commit }, playod) {
    const param = {
      url: '/map/point/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEALARM_ONE', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改|添加资源点位
  setOneAlarm({ commit }, playod) {
    const param = {
      body: playod.body,
      url: '/map/point/' + playod._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          console.log(res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除资源点位
  delOneAlarm({ commit }, playod) {
    const param = {
      url: '/map/point/' + playod
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据地图id获取防区
  getOneMapArarlList({ commit }, playod) {
    const param = {
      url: '/setting/resource/list/map/firealarmin?orgtype=0&maptype=2d&channelTypes=11,9&mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPALARMLIST_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据楼层id获取防区
  getOneFloorArarlList({ commit }, playod) {
    const param = {
      url: '/map/storey/' + playod + '/point?channelTypes=11'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEFLOORALARMLIST_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 建立socket获取报警列表信息
  mapReceivePatrolWarnning({ commit, state }) {
    // 监听单兵报警
    getSocket().on('server:patrol.alarm', data => {
      if (data.type === 'sentry_alarm' || data.type === 'patrol_alarm') {
        if (data.type === 'sentry_alarm') {
          // 单兵报警
          data.type = 'singleAlarm'
        } else if (data.type === 'patrol_alarm' && data.msgType === 1) {
          data.type = 'patrolAlarm'
        }
        switch (state.alarmType) {
          case 'all':
            // 接收全部报警
            commit('SET_MAPRECEIVE_WARNNING', data)
            break
          case 'stopReceive':
            // 暂停接收
            break
          case 'patrolalarm':
            // 接受单兵报警
            commit('SET_MAPRECEIVE_WARNNING', data)
            break
          default:
            commit('SET_MAPRECEIVE_WARNNING', data)
        }
      }
      if (data.type === 'sentry_geo') {
        commit('SET_APPMOVESINGLE_POSITION', data) // 移动单兵的实时位置信息
      }
    })
  },
  // 建立socket获取报警列表信息
  mapReceiveWarnning({ commit, state }) {
    let commitData = data => {
      switch (state.alarmType) {
        case 'all':
          // 接收全部报警
          commit('SET_MAPRECEIVE_WARNNING', data)
          break
        case 'stopReceive':
          // 暂停接收
          break
        case 'patrolalarm':
          // 接受单兵报警
          commit('SET_MAPRECEIVE_WARNNING', data)
          break
        default:
          commit('SET_MAPRECEIVE_WARNNING', data)
      }
    }
    // 监听巡更报警
    getSocket().on('server:patrol.alarm', data => {
      console.log(data, 'data')
      data.type = 'patrolAlarm'
      commitData(data)
    })
    let username = read('user.username')
    let sendSocket = {
      name: username
    }
    // 监听单兵报警
    getSocket().on('server:sentry.alarm', data => {
      console.log(data, 'data')
      data.type = 'singleAlarm'
      commitData(data)
    })
    // 监听单兵位置
    getSocket().on('server:sentry.location', data => {
      console.log(data, 'data')
      data.type = 'sentry_geo'
      commit('SET_APPMOVESINGLE_POSITION', data) // 移动单兵的实时位置信息
    })
    // 监听消防报警和普通报警
    /* global WebSocket */
    mapWarningWebsocket = new WebSocket('ws://' + window.location.host + '/api/ws/alarm')
    // mapWarningWebsocket = new WebSocket('ws://192.168.20.7/api/ws/alarm')
    mapWarningWebsocket.onopen = event => {
      mapWarningWebsocket.send(JSON.stringify(sendSocket))
    }
    mapWarningWebsocket.onmessage = event => {
      let data = JSON.parse(event.data)
      // commit('allAlarmToBeSure', data)
      // if (data.alarmInfo) {
      switch (state.alarmType) {
        case 'all':
          // 接收全部报警
          if (
            data.alarmInfo &&
            data.alarmInfo.eventType &&
            (data.alarmInfo.eventType === 'fireAlarm' || data.alarmInfo.eventType === 'fireFailure')
          ) {
            data.alarmInfo.type = 'fireAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'askHelp') {
            data.alarmInfo.type = 'askHelp'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'endHelp') {
            data.alarmInfo.type = 'acceptHelp'
            commit('ADDENDHELP', data.alarmInfo)
          } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'alarmInput') {
            data.alarmInfo.type = 'commonAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          } else {
            if (data.type === 'ackInfo' && data.ackInfo && data.ackInfo.eventType === 'fireAlarm') {
              data.ackInfo.type = 'fireAlarm'
            }
            // commit('SET_MAPRECEIVE_WARNNING', data.ackInfo)
          }
          break
        case 'fireAlarm':
          // 接受消防报警
          if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'fireAlarm') {
            data.alarmInfo.type = 'fireAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          } else if (data.type === 'ackInfo' && data.ackInfo && data.ackInfo.eventType === 'fireAlarm') {
            data.ackInfo.type = 'fireAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.ackInfo)
          }
          break
        case 'commonAlarm':
          // 接受普通报警
          if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType !== 'fireAlarm') {
            data.alarmInfo.type = 'commonAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          } else if (data.type === 'ackInfo' && data.ackInfo && data.ackInfo.eventType !== 'fireAlarm') {
            data.ackInfo.type = 'commonAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.ackInfo)
          }
          break
        case 'stopReceive':
          // 暂停接收
          break
        default:
          commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
      }
      // }
    }
    mapWarningWebsocket.onerror = event => {
      // let data = JSON.parse(event.data)
      console.log(event)
    }
  },
  // 监听websocket关闭重连
  wsRelink({ commit, state }) {
    mapWarningWebsocket.onclose = function(event) {
      if (!state.socketCloseState) {
        this.mapReceiveWarnning()
      }
    }
  },
  // 关闭webScoket
  closeMapWranWebsocket({ commit, state }) {
    if (mapWarningWebsocket) {
      commit('SET_APPALARM_TYPE', 'all')
      mapWarningWebsocket.close()
      commit('SET_SOCKETCLOSESTATE', true)
      commit('CLEAR_ONEMAPALARM_DATA', [])
    }
  },
  // 根据楼层id获取普通报警
  getOneFloorCommonAlarm({ commit }, playod) {
    const param = {
      url: '/map/storey/' + playod + '/point?channelTypes=1'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEFLOORCOMMONALARM_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据地图id获取普通报警
  getOneMapCommAlarm({ commit }, playod) {
    const param = {
      url: '/map/point/mapid?mapId=' + playod + '&channelType=1'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPCOMMONALARM_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 布撤防操作
  setDefensestatus({ commit }, playod) {
    const param = {
      body: playod.body,
      url: '/map/point/' + playod.id + '/defensestatus'
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
  // 布防操作
  setDefenseOn({ commit }, id) {
    const param = {
      body: {
        type: 'res'
      },
      // url: '/map/point/' + playod.id + '/defensestatus'
      url: '/setting/alarm/' + id + '/arm'
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
  // 撤防操作
  setDefenseOff({ commit }, id) {
    const param = {
      body: {
        type: 'res'
      },
      // url: '/map/point/' + playod.id + '/defensestatus'
      url: '/setting/alarm/' + id + '/disarm'
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
  // 建立socket获取普通报警列表信息
  mapReceiveCommonAlarm({ commit, state }) {
    let username = read('user.username')
    let sendSocket = {
      name: username
    }
    // 监听消防报警和普通报警
    /* global WebSocket */
    mapWarningWebsocket = new WebSocket('ws://' + window.location.host + '/api/ws/alarm')
    // mapWarningWebsocket = new WebSocket('ws://192.168.0.36/api/ws/alarm')
    mapWarningWebsocket.onopen = event => {
      mapWarningWebsocket.send(JSON.stringify(sendSocket))
    }
    mapWarningWebsocket.onmessage = event => {
      let data = JSON.parse(event.data)
      // commit('allAlarmToBeSure', data)
      switch (state.alarmType) {
        case 'all':
        case 'commonAlarm':
          // 接收全部报警
          if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'alarmInput') {
            data.alarmInfo.type = 'commonAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          } else if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'askHelp') {
            data.alarmInfo.type = 'askHelp'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          }
          break
        case 'stopReceive':
          // 暂停接收
          break
        default:
      }
    }
    mapWarningWebsocket.onerror = event => {
      // let data = JSON.parse(event.data)
      console.log(event)
    }
  },
  // 建立socket获取消防报警列表信息
  mapReceiveFireAlarm({ commit, state }) {
    let username = read('user.username')
    let sendSocket = {
      name: username
    }
    mapWarningWebsocket = new WebSocket('ws://' + window.location.host + '/api/ws/alarm')
    // mapWarningWebsocket = new WebSocket('ws://10.111.0.51/api/ws/alarm')
    mapWarningWebsocket.onopen = event => {
      mapWarningWebsocket.send(JSON.stringify(sendSocket))
    }
    mapWarningWebsocket.onmessage = event => {
      let data = JSON.parse(event.data)
      // commit('allAlarmToBeSure', data)
      switch (state.alarmType) {
        case 'all':
        case 'fireAlarm':
          // 接受消防报警
          if (data.alarmInfo && data.alarmInfo.eventType && data.alarmInfo.eventType === 'fireAlarm') {
            data.alarmInfo.type = 'fireAlarm'
            commit('SET_MAPRECEIVE_WARNNING', data.alarmInfo)
          }
          break
        case 'stopReceive':
          // 暂停接收
          break
        default:
      }
    }
    mapWarningWebsocket.onerror = event => {
      // let data = JSON.parse(event.data)
      console.log(event)
    }
  },
  setEditAlarmList({ commit }, data) {
    commit('SET_EDITALARM_LIST', data)
  },
  setEditAlarmInMap({ commit }, data) {
    commit('SET_EDITALARMINMAP_LIST', data)
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
