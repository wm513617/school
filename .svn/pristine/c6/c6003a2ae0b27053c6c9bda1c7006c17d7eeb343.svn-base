import {
  get,
  put,
  post
} from '../../http/base'
import { MAPMODE } from 'assets/2DMap/meta/common'
const state = {
  styleState: 0,
  styles: {
    // 平台名字描述
    name: '',
    // 字体
    fontfamily: '',
    // 字体大小
    fontSize: '',
    // 字体颜色
    fontColor: '',
    // 字体斜体
    fontItalic: '',
    // 字体粗细
    fontRegular: '',
    // 标题栏背景
    uploadColor: '',
    // logo
    uploadLogoPicture: '',
    // 标题栏背景
    uploadBackgroundPicture: ''
  },
  parameters: {
    // 报警/事件日志天数
    alarmlog: '',
    // 设备/系统日志天数
    equipmentlog: '',
    // 操作日志天数
    operationlog: '',
    // 配置日志天数
    configlog: '',
    // 传输协议
    transport: 'TCP',
    // 画质选择
    picture: '流畅优先',
    // 是否开启回放切片
    playbackSlice: '开',
    // 截图格式
    screenshot: 'JPG',
    // 本地录像格式
    videotape: 'AVI',
    // 下载录像格式
    downloadVideoType: 'AVI',
    // 下载音频格式
    downloadAudioType: 'MP3',
    // 案件下载的格式
    caseDownLoadType: 'AVI',
    // 截图路径
    screenshotPath: 'C:\\BC8100\\Capture',
    // 本地录像路径
    localVideoPath: 'C:\\BC8100\\Rerord',
    // 下载录像路径
    downloadVideoPath: 'C:\\BC8100\\Download',
    // 案件下载的路径
    caseDownLoadPath: 'C:\\BC8100\\CaseDownload'
  },
  initialPassword: '',
  serverVersion: '',
  mapModeSetting: { // 地图模式设置
    enableList: [MAPMODE.mode2D, MAPMODE.mode3D], //, ,MAPMODE.modeEdit
    defaultMode: MAPMODE.mode2D,
    map3DType: MAPMODE.mapType3D.superMap
  }
}
const getters = {
  styleState(state) {
    return state.styleState
  },
  getMenuStyle(state) {
    return state.styles
  },
  getParameter(state) {
    return state.parameters
  },
  mapModeSetting(state) { // 获取地图模式设置
    return state.mapModeSetting
  }
}
const mutations = {
  // 获取平台参数
  GET_PLATFORM(state, playod) {
    state.styleState = 1
    state.styles.name = playod.name
    const fonts = JSON.parse(playod.titlefont)
    state.styles.fontfamily = fonts.font
    state.styles.fontSize = fonts.size
    state.styles.fontColor = fonts.fontColor
    state.styles.fontItalic = fonts.fontItalic
    state.styles.fontRegular = fonts.fontRegular
    state.styles.uploadColor = playod.titlecolor
    state.styles.uploadLogoPicture = playod.logo
    state.styles.uploadBackgroundPicture = playod.loginimg
    state.parameters.alarmlog = playod.alarmlog
    state.parameters.equipmentlog = playod.equipmentlog
    state.parameters.operationlog = playod.operationlog
    state.parameters.configlog = playod.configlog
    // 浏览器导航标题
    localStorage.setItem('domTitle', playod.name)
    let dom = document.getElementsByTagName('title')[0]
    if (dom.innerText !== playod.name) {
      dom.innerText = playod.name
    }
  },
  // 保存平台参数
  SET_PLATFORM(state, playod) {
    state.styleState = 1
    state.styles.name = playod.name
    const fonts = JSON.parse(playod.titlefont)
    state.styles.fontfamily = fonts.font
    state.styles.fontSize = fonts.size
    state.styles.fontColor = fonts.fontColor
    state.styles.fontItalic = fonts.fontItalic
    state.styles.fontRegular = fonts.fontRegular
    state.styles.uploadColor = playod.titlecolor
    state.styles.uploadLogoPicture = playod.logo
    state.styles.uploadBackgroundPicture = playod.loginimg
  },
  // 保存系统参数
  SET_PARAMETER(state, playod) {
    state.parameters.alarmlog = playod.alarmlog
    state.parameters.equipmentlog = playod.equipmentlog
    state.parameters.operationlog = playod.operationlog
    state.parameters.configlog = playod.configlog
  },
  // 保存本地配置播放参数
  SET_PLAYCONF(state, playod) {
    state.parameters.transport = playod.transport
    state.parameters.picture = playod.picture
    state.parameters.playbackSlice = playod.playbackSlice || '开'
  },
  // 保存本地配置存储参数
  SET_VIDEOCONF(state, playod) {
    state.parameters.screenshot = playod.screenshot
    state.parameters.videotape = playod.videotape
    state.parameters.downloadVideoType = playod.downloadVideoType
    state.parameters.downloadAudioType = playod.downloadAudioType
    state.parameters.screenshotPath = playod.screenshotPath
    state.parameters.localVideoPath = playod.localVideoPath
    state.parameters.downloadVideoPath = playod.downloadVideoPath
  },
  // 保存服务器版本
  GET_SERVERVERSION(state, playod) {
    state.serverVersion = playod
  },
  SET_MAP_MODE_SETTING(state, setting) { // 设置地图模式配置
    for (const key in setting) {
      if (state.mapModeSetting.hasOwnProperty(key)) {
        state.mapModeSetting[key] = setting[key]
      }
    }
  }
}

const actions = {
  // 获取所有类型的数据信息
  getPlatform({
    commit,
    state
  }, playod) {
    const param = {
      url: '/setting/sysparamters'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_PLATFORM', res.data)
        resolve(res)
      }).catch((err) => {
        console.log('getPlatform error: ' + err)
        reject(err)
      })
    })
  },
  // 保存参数
  setPlatform({
    commit,
    state
  }, playod) {
    const param = {
      body: playod,
      url: '/setting/sysparamters'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('setPlatform error: ' + err)
        reject(err)
      })
    })
  },
  // 测试Email
  getEmailServer({
    commit,
    state
  }, playod) {
    const param = {
      body: playod,
      url: '/setting/auth'
    }
    return post(param)
  },
  // 获取koala地址
  getFaceServer({
    commit,
    state
  }, payload) {
    const param = {
      // body: payload,
      url: '/human/pass/server'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch((err) => {
        console.log('getFaceServer error: ' + err)
        reject(err)
      })
    })
  },
  // 设置koala地址
  setFaceServer({
    commit,
    state
  }, payload) {
    const param = {
      body: {
        host: payload
      },
      url: '/human/pass/server'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('setFaceServer error: ' + err)
        reject(err)
      })
    })
  },
  // 时间配置  设备校时
  // 获取服务器时间和自动校时信息
  getProofInfo({
    commit,
    state
  }, playod) {
    const param = {
      url: '/setting/proof'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 发送手动校时请求
  manualProof({
    commit
  }, playod) {
    const param = {
      url: '/setting/proof/time'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        console.log(res)
        resolve(res)
      }).catch((err) => {
        console.log('manualProof error: ' + err)
        reject(err)
      })
    })
  },
  // 增加或者修改自动校时信息
  setAutoProof({
    commit,
    state
  }, playod) {
    const param = {
      body: playod,
      url: '/setting/proof'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('setAutoProof error: ' + err)
        reject(err)
      })
    })
  },
  // 获取2D/3D默认配置
  getTwoImensionalInfo({commit}) {
    const param = {
      url: '/setting/maptype'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        // let mapType = res.data.mapType ? '2D' : '3D'
        let arr = res.data.mapType.enable
        // arr.push('param')
        let setting = { enableList: arr, defaultMode: res.data.mapType.default, map3DType: res.data.mapType.map3DType }
        commit('SET_MAP_MODE_SETTING', setting)
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 设置2D/3D默认配置
  setTwoImensionalInfo({
    commit,
    state
  }, obj) {
    // console.log(obj)
    const param = {
      body: obj,
      url: '/setting/maptype'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 获取服务器版本
  getServerVersion({
    commit,
    state
  }, playod) {
    const param = {
      url: '/service/getbackversion'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        let serverArr = res.data.split(',')
        let dateArr = serverArr[0].split('')
        let serverV = 'BC8100_V2.1.0_B' + dateArr[2] + dateArr[3] + dateArr[5] + dateArr[6] + dateArr[8] + dateArr[9] + '_R' + serverArr[1]
        commit('GET_SERVERVERSION', serverV)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  getVideoConf({
    commit,
    state,
    getters
  }, playod) {
    if (!getters.plugin.valid) {
      return
    }
    let localVideoConf = getters.plugin.ReadFileInfo('C:\\BC8100\\VideoConfig.ini')
    if (localVideoConf) {
      commit('SET_VIDEOCONF', JSON.parse(localVideoConf))
    } else {
      let defaultVideoConf = {
        screenshot: 'JPG',
        videotape: 'AVI',
        downloadVideoType: 'AVI',
        downloadAudioType: 'MP3',
        screenshotPath: 'C:\\BC8100\\Capture',
        localVideoPath: 'C:\\BC8100\\Rerord',
        downloadVideoPath: 'C:\\BC8100\\Download'
      }
      commit('SET_VIDEOCONF', defaultVideoConf)
    }
    let localPlayConf = getters.plugin.ReadFileInfo('C:\\BC8100\\PlayConfig.ini')
    if (localPlayConf) {
      commit('SET_PLAYCONF', JSON.parse(localPlayConf))
    } else {
      let defaultPlayConf = {
        transport: 'TCP',
        picture: '流畅优先',
        playbackSlice: '开'
      }
      commit('SET_PLAYCONF', defaultPlayConf)
    }
  },
  setMapModeSetting({commit}, setting) { // 设置地图模式配置
    commit('SET_MAP_MODE_SETTING', setting)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
