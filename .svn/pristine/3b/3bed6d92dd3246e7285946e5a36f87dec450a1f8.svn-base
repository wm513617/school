import { get, post, put, remove } from '../../../http/base'
import { getVideoStructuredParamApi, setVideoStructuredParamApi, getVideoStructuredParamFaceApi, getVideoStructuredParamEditApi, syncLibraryApi } from '../../../http/videoStructured/setting.api'
import { DateFormat } from '../../../assets/js/socketCharts'
const state = {
  // 视频结构化基本配置信息
  videoStructuredData: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 50,
    count: 0,
    offline: 0,
    online: 0,
    analyzeOffline: 0,
    analyzeOnline: 0

  },
  // 视频结构化服务器配置信息
  serverPageInfo: {
    pages: 0,
    curPage: 1,
    limit: 10,
    count: 0,
    list: []
  },
  // 视频结构化高级参数配置信息
  videoStructuredParam: {
    isStartVideoAddMessage: false, // 视频叠加结构化信息
    isStartVideoCode: false, // 开启视频编码
    isStartDrawBox: true, // 原图中绘制矩形框
    leaveVal: 3, // 视频等级值
    saveTime: 30 // 结构化数据保存
  },
  // 视频结构化服务器已使用储存空间统计信息配置
  videoStructuredChartsOption: {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 鼠标悬浮上去的竖线
        type: 'line'
      },
      formatter: function(params) {
        let result = params[0].value[0]
        result += '<br/>'
        result += params[0].seriesName + '：'
        result += isNaN(params[0].value[1]) ? 0 : (params[0].value[1]).toFixed(2) + 'G'
        return result
      }
    },
    title: {
      text: '已使用储存空间（单位G）',
      left: 'center',
      textStyle: {
        color: '#ffffff'
      }
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    textStyle: {
      color: '#ffffff'
    },
    xAxis: {
      type: 'time',
      interval: 6000, // 设置x轴分隔间隔
      boundaryGap: false,
      nameTextStyle: {
        color: '#ffffff'
      },
      axisLine: {
        lineStyle: {
          color: '#5676a9'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        },
        // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
        formatter: function(value, index) {
          let date = new Date(value)
          let formateHours = date.getHours()
          let formateMinutes = date.getMinutes()
          let formateSeconds = date.getSeconds()
          if (formateHours < 10) {
            formateHours = '0' + formateHours
          }
          if (formateMinutes < 10) {
            formateMinutes = '0' + formateMinutes
          }
          if (formateSeconds < 10) {
            formateSeconds = '0' + formateSeconds
          }
          let texts = formateHours + ':' + formateMinutes + ':' + formateSeconds // + '\n' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          return texts
        }
      },
      splitLine: {
        show: false
      }

    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      max: null,
      axisLabel: {
        formatter: '{value}G',
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#5676a9'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#152848'
        }
      }
    },
    series: {
      name: '已使用储存空间（单位G）',
      type: 'line',
      data: [],
      showSymbol: false,
      itemStyle: {normal: {
        color: '#86BAEE',
        areaStyle: {color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#86BAEE' // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }},
        lineStyle: {
          color: '#86BAEE' // 改变折线颜色
        }

      }
      }
    }

  },
  // 视频结构化服务器已使用CPU统计信息配置
  videoStructuredChartsOptionCPU: {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 鼠标悬浮上去的竖线
        type: 'line'
      },
      formatter: function(params) {
        let result = params[0].value[0]
        result += '<br/>'
        result += params[0].seriesName + '：'
        result += isNaN(params[0].value[1]) ? 0 : (params[0].value[1]).toFixed(2) + 'G'
        return result
      }
    },
    title: {
      text: '已使用CPU（单位%）',
      left: 'center',
      textStyle: {
        color: '#ffffff'
      }
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    textStyle: {
      color: '#ffffff'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      interval: 6000, // 设置x轴分隔间隔
      nameTextStyle: {
        color: '#ffffff'
      },
      axisLine: {
        lineStyle: {
          color: '#5676a9'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        },
        // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
        formatter: function(value, index) {
          let date = new Date(value)
          let formateHours = date.getHours()
          let formateMinutes = date.getMinutes()
          let formateSeconds = date.getSeconds()
          if (formateHours < 10) {
            formateHours = '0' + formateHours
          }
          if (formateMinutes < 10) {
            formateMinutes = '0' + formateMinutes
          }
          if (formateSeconds < 10) {
            formateSeconds = '0' + formateSeconds
          }
          let texts = formateHours + ':' + formateMinutes + ':' + formateSeconds// + '\n' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          return texts
        }
      },
      splitLine: {
        show: false
      }

    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      max: null,
      axisLabel: {
        formatter: '{value}%',
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#5676a9'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#152848'
        }
      }
    },
    series: {
      name: '已使用CPU（单位%）',
      type: 'line',
      data: [],
      showSymbol: false,
      itemStyle: {normal: {
        color: '#86BAEE',
        areaStyle: {color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#86BAEE' // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }},
        lineStyle: {
          color: '#86BAEE' // 改变折线颜色
        }

      }
      }
    }
  },
  // 视频结构化服务器已使用内存统计信息配置
  videoStructuredChartsOptionMemory: {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 鼠标悬浮上去的竖线
        type: 'line'
      },
      formatter: function(params) {
        let result = params[0].value[0]
        result += '<br/>'
        result += params[0].seriesName + '：'
        result += isNaN(params[0].value[1]) ? 0 : (params[0].value[1]).toFixed(2) + 'G'
        return result
      }
    },
    title: {
      text: '已使用内存（单位G）',
      left: 'center',
      textStyle: {
        color: '#ffffff'
      }
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    textStyle: {
      color: '#ffffff'
    },
    xAxis: {
      type: 'time',
      interval: 6000, // 设置x轴分隔间隔
      boundaryGap: false,
      nameTextStyle: {
        color: '#ffffff'
      },
      axisLine: {
        lineStyle: {
          color: '#5676a9'
        }
      },
      axisLabel: {
        textStyle: {
          color: '#fff'
        },
        // 使用函数模板，函数参数分别为刻度数值（类目），刻度的索引
        formatter: function(value, index) {
          let date = new Date(value)
          let formateHours = date.getHours()
          let formateMinutes = date.getMinutes()
          let formateSeconds = date.getSeconds()
          if (formateHours < 10) {
            formateHours = '0' + formateHours
          }
          if (formateMinutes < 10) {
            formateMinutes = '0' + formateMinutes
          }
          if (formateSeconds < 10) {
            formateSeconds = '0' + formateSeconds
          }
          let texts = formateHours + ':' + formateMinutes + ':' + formateSeconds// + '\n' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
          return texts
        }
      },
      splitLine: {
        show: false
      }

    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      max: null,
      axisLabel: {
        formatter: '{value}G',
        textStyle: {
          color: '#fff'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#5676a9'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#152848'
        }
      }
    },
    series: {
      name: '已使用内存（单位G）',
      type: 'line',
      data: [],
      showSymbol: false,
      itemStyle: {normal: {
        color: '#86BAEE',
        areaStyle: {color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#86BAEE' // 0% 处的颜色
          }, {
            offset: 1, color: '#ffffff' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }},
        lineStyle: {
          color: '#86BAEE' // 改变折线颜色
        }

      }
      }
    }
  },
  // 监控服务器列表
  monitoringLists: [], // 图表总数据
  chartStatus: 0, // 默认初始化数据状态
  obj: {} // 默认初始化图表数据

}
const mutations = {
  GET_VIDEOSTRUCTURED_RESOURCES(state, payload) {
    state.videoStructuredData.list = payload.data
    state.videoStructuredData.pages = Number(payload.headers['x-bsc-pages']) // 总页码
    /* state.videoStructuredData.curPage = Number(payload.headers['x-bsc-cur']) */
    state.videoStructuredData.count = Number(payload.headers['x-bsc-count'])
    state.videoStructuredData.limit = Number(payload.headers['x-bsc-limit'])
    state.videoStructuredData.offline = Number(payload.headers['x-bsc-offline'])
    state.videoStructuredData.online = Number(payload.headers['x-bsc-online'])
    state.videoStructuredData.analyzeOnline = Number(payload.headers['x-bsc-analyzing'])
    state.videoStructuredData.analyzeOffline = Number(payload.headers['x-bsc-analyzfail'])
  },
  UPDATE_VIDEOSTRUCTURED_SERVER_PAGEINFO(state, payload) {
    state.serverPageInfo.list = payload.data.results
    state.serverPageInfo.list.forEach(function(item, index) {
      item.IdIndex = index
    })
    state.serverPageInfo.pages = Number(payload.headers['x-bsc-pages'])
    state.serverPageInfo.curPage = Number(payload.headers['x-bsc-cur'])
    state.serverPageInfo.count = Number(payload.headers['x-bsc-count'])
    state.serverPageInfo.limit = Number(payload.headers['x-bsc-limit'])
  },
  SET_VIDEOSTRUCTURED_PARAM(state, payload) {
    if (payload === '') {
      state.videoStructuredParam = {
        isStartVideoAddMessage: false, // 视频叠加结构化信息
        isStartVideoCode: false, // 开启视频编码
        isStartDrawBox: true, // 原图中绘制矩形框
        leaveVal: 3, // 视频等级值
        saveTime: 30 // 结构化数据保存
      }
    } else {
      state.videoStructuredParam = {
        isStartVideoAddMessage: payload.superpose === 1, // 视频叠加结构化信息
        isStartVideoCode: payload.startCode === 1, // 开启视频编码
        isStartDrawBox: payload.drawRectangle === 1, // 原图中绘制矩形框
        leaveVal: payload.codeClass, // 视频等级值
        saveTime: payload.saveTime// 结构化数据保存
      }
    }
  },
  INIT_VIDEO_STRUCTURED_CHARTS_OPTION_Data_STATUS(state) {
    state.chartStatus = 0
    state.obj = {}
  },
  // 每三秒请求socket获取已使用硬盘容量存入vuex内
  PUSH_VIDEO_STRUCTURED_CHARTS_OPTION(state, {current, data}) {
    state.chartStatus++
    if (state.chartStatus === 1) { // 第一次进入
      for (let item of data) {
        state.obj[item.name] = [{time: current, disk: {total: Number(item.data.slaves.disk[1]) / 1024, value: Number(item.data.slaves.disk[0]) / 1024}, ram: {total: Number(item.data.slaves.ram[1]) / 1024 / 1024, value: Number(item.data.slaves.ram[0]) / 1024 / 1024}, cpu: {total: 100, value: item.data.slaves.cpu ? Number(item.data.slaves.cpu) : 0}}]
      }
    } else {
      for (let item of data) {
        if (state.obj[item.name].length === 10) {
          state.obj[item.name].shift()
          state.obj[item.name].push({time: current, disk: {total: Number(item.data.slaves.disk[1]) / 1024, value: Number(item.data.slaves.disk[0]) / 1024}, ram: {total: Number(item.data.slaves.ram[1]) / 1024 / 1024, value: Number(item.data.slaves.ram[0]) / 1024 / 1024}, cpu: {total: 100, value: item.data.slaves.cpu ? Number(item.data.slaves.cpu) : 0}})
        } else {
          state.obj[item.name].push({time: current, disk: {total: Number(item.data.slaves.disk[1]) / 1024, value: Number(item.data.slaves.disk[0]) / 1024}, ram: {total: Number(item.data.slaves.ram[1]) / 1024 / 1024, value: Number(item.data.slaves.ram[0]) / 1024 / 1024}, cpu: {total: 100, value: item.data.slaves.cpu ? Number(item.data.slaves.cpu) : 0}})
        }
      }
    }
    let arr = []
    for (let key in state.obj) {
      let obj = {}
      obj.name = key
      obj.objOption = JSON.parse(JSON.stringify(state.videoStructuredChartsOption)) // 拷贝默认视频结构化服务器已使用储存空间统计信息配置
      obj.objOption.tooltip.formatter = function(params) {
        let result = params[0].value[0]
        result += '<br/>'
        result += params[0].seriesName + '：'
        result += isNaN(params[0].value[1]) ? 0 : (params[0].value[1]).toFixed(2) + 'G'
        return result
      }
      obj.objOption.xAxis.axisLabel.formatter = function(value) {
        let date = new Date(value)
        let formateHours = date.getHours()
        let formateMinutes = date.getMinutes()
        let formateSeconds = date.getSeconds()
        if (formateHours < 10) {
          formateHours = '0' + formateHours
        }
        if (formateMinutes < 10) {
          formateMinutes = '0' + formateMinutes
        }
        if (formateSeconds < 10) {
          formateSeconds = '0' + formateSeconds
        }
        let texts = formateHours + ':' + formateMinutes + ':' + formateSeconds // + '\n' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        return texts
      }

      obj.objMemoryOption = JSON.parse(JSON.stringify(state.videoStructuredChartsOptionMemory)) // 拷贝默认视频结构化服务器已使用内存统计信息配置
      obj.objMemoryOption.tooltip.formatter = function(params) {
        let result = params[0].value[0]
        result += '<br/>'
        result += params[0].seriesName + '：'
        result += isNaN(params[0].value[1]) ? 0 : (params[0].value[1]).toFixed(2) + 'G'
        return result
      }
      obj.objMemoryOption.xAxis.axisLabel.formatter = function(value) {
        let date = new Date(value)
        let formateHours = date.getHours()
        let formateMinutes = date.getMinutes()
        let formateSeconds = date.getSeconds()
        if (formateHours < 10) {
          formateHours = '0' + formateHours
        }
        if (formateMinutes < 10) {
          formateMinutes = '0' + formateMinutes
        }
        if (formateSeconds < 10) {
          formateSeconds = '0' + formateSeconds
        }
        let texts = formateHours + ':' + formateMinutes + ':' + formateSeconds // + '\n' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        return texts
      }

      obj.objCpuOption = JSON.parse(JSON.stringify(state.videoStructuredChartsOptionCPU)) // 拷贝默认视频结构化服务器已使用CPU统计信息配置
      obj.objCpuOption.tooltip.formatter = function(params) {
        let result = params[0].value[0]
        result += '<br/>'
        result += params[0].seriesName + '：'
        result += isNaN(params[0].value[1]) ? 0 : (params[0].value[1]).toFixed(2) + '%'
        return result
      }
      obj.objCpuOption.xAxis.axisLabel.formatter = function(value) {
        let date = new Date(value)
        let formateHours = date.getHours()
        let formateMinutes = date.getMinutes()
        let formateSeconds = date.getSeconds()
        if (formateHours < 10) {
          formateHours = '0' + formateHours
        }
        if (formateMinutes < 10) {
          formateMinutes = '0' + formateMinutes
        }
        if (formateSeconds < 10) {
          formateSeconds = '0' + formateSeconds
        }
        let texts = formateHours + ':' + formateMinutes + ':' + formateSeconds // + '\n' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        return texts
      }
      for (let item of state.obj[key]) {
        // 储存空间
        obj.objOption.series.data.push({value: [item.time, item.disk.value]}) // {value: [DateFormat(new Date(refreshCPUTime)), data_in.value / 1024]}
        if (!obj.objOption.yAxis.max) {
          obj.objOption.yAxis.max = item.disk.total.toFixed(2)
        }
        // 内存统计
        obj.objMemoryOption.series.data.push({value: [item.time, item.ram.value]})
        if (!obj.objMemoryOption.yAxis.max) {
          obj.objMemoryOption.yAxis.max = item.ram.total.toFixed(2)
        }
        // cpu
        obj.objCpuOption.series.data.push({value: [item.time, item.cpu.value]})
        if (!obj.objCpuOption.yAxis.max) {
          obj.objCpuOption.yAxis.max = item.cpu.total.toFixed(2)
        }
      }
      arr.push(obj)
    }
    state.monitoringLists = arr
  }
}
const actions = {
  /* ************************以下是资源配置相关*************************** */
  // 获取视频结构化资源列表
  getVideoStructuredResources({ state, commit }, query) { // getVerifaceResources
    const param = {
      query: query,
      url: '/setting/resource'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('GET_VIDEOSTRUCTURED_RESOURCES', res)
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  getVideoStructuredParamFace({ state, commit }, query) { // 获取视频结构化设备信息getVerifaceParamFace
    if (!query.oid) {
      return
    }
    getVideoStructuredParamFaceApi(query).then(res => {
      commit('GET_VIDEOSTRUCTURED_RESOURCES', res)
    }).catch(err => console.log(err))
  },
  // 添加视频结构化资源addVerifaceResources
  addVideoStructuredResources({ state, commit }, body) {
    return post({
      body,
      url: '/setting/resource/distribute'
    })
  },
  /* ************************以下是服务器配置相关*************************** */
  // 添加服务器addVerifaceServer
  addVideoStructuredServer({ state, commit }, body) {
    return new Promise((resolve, reject) => {
      post({
        body,
        url: '/structure/server'
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除单个服务器delVerifaceServer
  delVideoStructuredServer({ state, commit }, { id }) {
    return remove({
      url: `/structure/server/${id}`
    })
  },
  // 删除多个服务器delVerifaceServers
  delVideoStructuredServers({ state, commit }, ids) {
    let params = {
      url: '/structure/server/batchDelete',
      body: ids
    }
    return post(params)
  },
  // 修改单个服务器setVerifaceServer
  setVideoStructuredServer({ state, commit }, body) {
    return put({
      body: body.data,
      url: `/structure/server/${body.id}`
    })
  },
  // 获取服务器getVerifaceServer
  getVideoStructuredServer({ state, commit }, {limit, page}) {
    return get({
      url: `/structure/server`,
      query: {
        limit: limit,
        page: page
      }
    }).then(res => {
      commit('UPDATE_VIDEOSTRUCTURED_SERVER_PAGEINFO', res)
      // resolve(res)
    }).catch(err => console(err))
  },
  // 移动时获取机构树getVerifaceSettingOrgTree
  getVideoStructuredSettingOrgTree({ state, commit }, body) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/org/tree',
        query: {
          type: 8
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取服务器配置绑定资源机构树getVerifaceTree
  getVideoStructuredTree({ state, commit }, body) {
    /* return new Promise((resolve, reject) => {
      get({
        url: '/setting/resource/tree',
        query: {
          orgtype: 8,
          type: 0
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    }) */
    return get({url: '/structure/video/tree?serverId=' + body._id})
  },
  // 移动资源到指定机构changeVerifaceResourceOrg
  changeVideoStructuredResourceOrg({ state }, payload) {
    const param = {
      url: '/setting/resource/org',
      body: {
        oid: payload.oid
      }
    }
    const config = {
      headers: {
        'x-bsc-ids': payload.ids
      }
    }
    return new Promise((resolve, reject) => {
      put(param, config)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量解绑资源unbindVerifaceResource
  unbindVideoStructuredResource({ state }, payload) {
    const param = {
      url: `/structure/video/resource/unbind?type=${payload.type}`
    }
    const config = {
      headers: {
        'x-bsc-ids': payload.ids
      }
    }
    return new Promise((resolve, reject) => {
      remove(param, config)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 单个资源详情（修改）getSingleVerifaceResource
  getSingleVideoStructuredResource({ commit, state }, id) {
    const param = {
      url: '/setting/resource/' + id
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          if (!res.data.precord) { res.data.precord = '' }
          if (!res.data.delayrecord) { res.data.delayrecord = '' }
          if (!res.data.keyCode) { res.data.keyCode = '' }
          resolve(res.data)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 同步底库
  syncLibraryApi({ commit, state }, id) {
    return syncLibraryApi(id)
  },
  // 资源修改保存saveVerifaceResourceInfo
  saveVideoStructuredResourceInfo({ commit, state }, obj) {
    const param = {
      body: obj.form,
      url: '/setting/resource/' + obj.id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  getVideoStructuredParam({ commit }) { // 获取视频结构化设置高级参数getVerifaceParam
    return getVideoStructuredParamApi().then(data => {
      commit('SET_VIDEOSTRUCTURED_PARAM', data.data)
      return data.data
    })
  },
  setVideoStructuredParam({ commit }, payload) { // 设置视频结构化高级参数setVerifaceParam
    return setVideoStructuredParamApi(payload).then(commit('SET_VIDEOSTRUCTURED_PARAM', payload))
  },
  /* 视频结构化参数恢复默认 */

  setDefaultVideoStructuredParamApi({ commit }, payload) {
    const params = {
      url: '/structure/param/default'
    }
    return post(params).then(function(res) {
      commit('SET_VIDEOSTRUCTURED_PARAM', payload)
      return res
    })
  },
  getVideoStructuredParamEdit({ commit }, payload) { // 点击编辑时获取单条资源信息getVerifaceParamEdit
    return getVideoStructuredParamEditApi(payload).then((res) => {
      return res.data
    }).catch((err) => {
      console.log(err)
    })
  },
  /* getVideoStructuredOrgTree() {
    var param = {
      url: 'setting/resource/tree',
      query: {
        orgtype: 6,
        type: 0
      }
    }
    return new Promise((resolve, reject) => {
      return get(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  } */
  getSocketVideoStructuredChartsOption({commit}) {
    get({url: '/structure/server/status/monitor'}).then(res => {
      let current = DateFormat(new Date()) // moment().format('HH:mm:ss')
      let data = res.data
      commit('PUSH_VIDEO_STRUCTURED_CHARTS_OPTION', {current, data})
    }, err => {
      console.log(err)
    })
  },
  // 开始分析
  startAnalyz({commit}, payload) {
    const params = {
      url: '/structure/video/resource/batch/startanalyz',
      body: payload
    }
    return post(params)
  },
  // 停止分析
  stopAnalyz({commit}, payload) {
    const params = {
      url: '/structure/video/resource/batch/stopanalyz',
      body: payload
    }
    return post(params)
  },
  // 导出授权文件
  exportAuthorizationFile({commit}, payload) {
    return get({url: '/structure/server/' + payload.id + '/export'})
  },
  // 导入授权文件
  importAuthorizationFile({commit}, payload) {
    let params = {
      url: '/structure/server/' + payload.id + '/import',
      body: payload
    }
    return post(params)
  },
  // 批量启动服务
  startService({commit},payload){
    let params = {
      url: '/structure/server/batchStartWeb',
      body: payload
    }
    return post(params)
  },
  // 批量停止服务
  stopService({commit},payload){
    let params = {
      url: '/structure/server/batchStopWeb',
      body: payload
    }
    return post(params)
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
