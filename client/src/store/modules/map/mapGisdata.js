import { get, post, put, remove } from 'http/base'
import toTreeData from '../../../assets/js/toTreeData'
const state = {
  // 地图信息列表
  mapConfigList: [],
  // 地图编辑模式资源列表
  mapSourceList: [],
  // 地图编辑模式添加视频点位时的节点信息
  addVedioNodeInfo: null,
  // 地图编辑模式当前操作的视频点位对象
  editCurrentVedioFeature: null,
  // 地图编辑模式当前操作视频点位的可视域
  editCurrentVedioSector: null,
  // 编辑视频点位位置时的对象
  editVedioPosition: null,
  // 编辑模式视频点位数组
  editVedioIpcList: [],
  // 编辑模式加载到地图上的视频点位数组
  editVedioIpcInMapList: [],
  // 编辑模式视频点位可视域数组
  editVedioSectorList: [],
  // 编辑模式加载到地图上的视频点位可视域数组
  editVedioSectorInMapList: [],
  // 网格列表
  gridList: [],
  gridSelectList: [],
  // 单个网格信息
  gridData: {},
  // 楼宇列表
  buildList: [],
  // 单个楼宇信息
  buildData: {},
  // 楼层列表
  levelList: [],
  // 楼层信息
  levelData: {},
  // 点位信息
  pointData: {},
  // 普通报警点位
  commonAlarmData: {},
  // 地图信息
  oneMapInfo: {
    extent: [],
    center: [],
    layerName: '',
    matrixSet: '',
    origin: [],
    mapUrl: 'http://192.168.20.138:8089/geoserver/gwc/service/wmts'
  },
  mapList: [],
  activeMap: '',
  activeMapType: '',
  currentMapExtent: [], // 当前操作地图的范围
  oneMapPointList: '',
  // 单个地图网格列表
  oneMapGidList: [],
  oneMapBuildList: [],
  mapOrgTree: [],
  mapGridStic: {},
  mapBuildStic: {},
  mapFloorStic: {},
  mapStaticInfo: null, // 地图静态底图有关信息
  editMapZoom: 1, // 编辑模式当前地图的放大级别
  editFloorZoom: 16, // 编辑模式当前楼层的放大级别
  appTreeNodeInfo: null, // 应用模式树节点
  appRapidPosition: null, // 应用模式，是否触发快速定位
  measureActive: false, // 应用模式,测距工具开启状态
  editIsOneLevel: false, // 编辑模式，是否是同一个图层
  hightLightList: [], // 编辑模式，高亮数组
  floorDatas: [], // 胡红勋添加
  floorId: '', // 胡红勋添加楼层的唯一标识
  editFloorId: '', // 胡红勋添加,楼层的唯一标识
  editFloorDatas: [],
  defaultActive: 'baseInfo', // 编辑模式右侧面板tab页defaultActive
  activeMapCenter: {
    time: new Date().getTime()
  } // 胡红勋 2018-628
  // 红勋 2018-628
}
const getters = {
  mapConfigList: state => {
    return state.mapConfigList
  },
  activeMap: state => {
    return state.activeMap
  },
  editFloorJsonDatas: state => {
    // 通过方法访问
    let jsonObj = {}
    for (let index in state.editFloorDatas) {
      jsonObj[state.editFloorDatas[index].pointId] = state.editFloorDatas[index]
    }
    return jsonObj
  },
  mapConfigJsonList: state => {
    // 通过方法访问
    let jsonObj = {}
    for (let index in state.mapConfigList) {
      jsonObj[state.mapConfigList[index].mapId] = state.mapConfigList[index]
    }
    return jsonObj
  }
}
const mutations = {
  // 设置中心点 胡红勋---2018-6-28
  SET_ACTIVE_MAP_CENTER(state, data) {
    if (data.id) {
      state.activeMapCenter[data.id] = data
      state.activeMapCenter.time = new Date().getTime()
    } else {
      state.activeMapCenter = {}
      state.activeMapCenter.time = new Date().getTime()
    }
  },
  // 胡红勋添加，保存楼层Id
  SET_FLOOR_ID(state, data) {
    state.floorId = data
  },
  // 地图编辑模式右侧tab页defaultActive
  SET_EDITRIGHTPAGE_DEFAULTACTIVE(state, data) {
    state.defaultActive = data
  },
  SET_EDIT_FLOOR_DATAS(state, data) {
    state.editFloorDatas = data
  },
  // 胡红勋添加，保存楼层Id
  SET_EDITFLOOR_ID(state, data) {
    state.editFloorId = data
  },
  // 胡红勋添加，设置保存楼宇下的所有楼层信息
  // SET_FLOORDATAS_LIST(state, data) {
  //   state.floorDatas = state.floorDatas.concat(data)
  //   // let hash = {}
  //   state.floorDatas = state.floorDatas.reduce(function(item, next) {
  //     // hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
  //     return item
  //   }, [])
  // },
  SET_FLOORDATAS_NULL(state, data) {
    state.floorDatas = data
  },
  // 编辑模式，高亮数组
  SET_EDITHIGHTLIGHT_LIST(state, data) {
    state.hightLightList = data
  },
  // 编辑模式，是否是同一个图层
  SET_EDITISONE_LEVEL(state, data) {
    state.editIsOneLevel = data
  },
  // 应用模式,测距工具开启状态
  SET_MEASURE_ACTIVE(state, data) {
    state.measureActive = data
  },
  // 应用模式，是否触发快速定位
  SET_APPRAPID_POSITION(state, data) {
    state.appRapidPosition = data
  },
  // 应用模式树节点
  SET_APPTREENODE_INFO(state, data) {
    state.appTreeNodeInfo = data
  },
  // 编辑模式当前楼层的放大级别
  SET_EDITFLOOR_ZOOM(state, data) {
    state.editFloorZoom = data
  },
  // 编辑模式当前地图的放大级别
  SET_EDITMAP_ZOOM(state, data) {
    state.editMapZoom = data
  },
  // 地图静态底图有关信息
  SET_MAPSTATIC_INFO(state, data) {
    state.mapStaticInfo = data
  },
  // 设置地图列表
  SET_MAPSERVER_LIST(state, data) {
    for (let da of data) {
      da.value = da.mapId
      da.label = da.layerName
      state.activeMapCenter[da.mapId] = {} // 初始化地图中心点的属性--胡红勋添加-201806-28
    }
    state.mapConfigList = data
    state.oneMapInfo = data[0]
    state.activeMap = data[0].mapId
    state.activeMapType = data[0].mapType
    state.currentMapExtent = data[0].extent
  },
  // 当前激活状态地图
  SET_MAPACTIVE_STATE(state, data) {
    state.activeMap = data
    state.mapConfigList.forEach(element => {
      if (element.mapId === data) {
        state.oneMapInfo = element
        state.currentMapExtent = element.extent
        state.activeMapType = element.mapType
      }
    })
  },
  // 单个地图
  SET_MAP_STATE(state, data) {
    state.oneMapInfo = data
    state.activeMap = data.mapId
    state.currentMapExtent = data.extent
    state.activeMapType = data.mapType
  },
  // 地图编辑模式添加视频点位时的节点信息
  SET_ADDVEDIONODE_INFO(state, data) {
    state.addVedioNodeInfo = data
  },
  // 地图编辑模式当前操作的视频点位对象
  SET_EDITCURRENTVEDIO_FEATURE(state, data) {
    state.editCurrentVedioFeature = data
  },
  // 地图编辑模式当前操作视频点位的可视域
  SET_EDITCURRENTVEDIO_SECTOR(state, data) {
    state.editCurrentVedioSector = data
  },
  // 编辑模式视频点位数组
  SET_EDITVEDIOIPC_LIST(state, data) {
    state.editVedioIpcList = data
  },
  // 编辑模式加载到地图上的视频点位数组
  SET_EDITVEDIOIPCINMAP_LIST(state, data) {
    state.editVedioIpcInMapList = data
  },
  // 编辑模式加载到地图上的视频点位可视域数组
  SET_EDITVEDIOSECTORINMAP_LIST(state, data) {
    state.editVedioSectorInMapList = data
  },
  // 编辑模式视频点位可视域数组
  SET_EDITVEDIOSECTOR_LIST(state, data) {
    state.editVedioSectorList = data
  },
  // 编辑视频点位位置时的对象
  SET_EDITVEDIO_POSITION(state, data) {
    state.editVedioPosition = data
  },
  // 地图点位资源
  GET_RESOURCEORG_TREE(state, data) {
    state.mapSourceList = data
  },
  // 网格列表
  SET_GRID_LIST(state, data) {
    state.gridList = data
    let gridArr = JSON.parse(JSON.stringify(data))
    let gridNewArr = [
      {
        value: '',
        label: '无'
      }
    ]
    gridArr.forEach(element => {
      let obj = {
        value: element._id,
        label: element.name
      }
      let newObj = Object.assign(element, obj)
      gridNewArr.push(newObj)
    })
    state.gridSelectList = gridNewArr
  },
  // 单个网格信息
  GET_ONEGRID_DATA(state, data) {
    state.gridData = data
    state.activeMap = data.mapId
  },
  // 楼宇列表
  SET_BUILD_LIST(state, data) {
    state.buildList = data
  },
  // 单个楼宇信息
  GET_ONEBUILD_DATA(state, data) {
    state.buildData = data
    state.activeMap = data.mapId
  },
  // 楼层列表
  SET_LEVEL_LIST(state, data) {
    state.levelList = data
  },
  // 楼层信息
  GET_ONELEVEL_DATA(state, data) {
    state.levelData = data
  },
  // 点位信息
  GET_POINT_DATA(state, data) {
    state.pointData = data
  },
  // 普通报警点位
  // GET_COMMONALARM_DATA(state, data) {
  //   state.commonAlarmData = data
  // },
  // 指定地图下多有点位
  GET_ONEMAPPOINT_LIST(state, data) {
    state.oneMapPointList = data
  },
  // 指定地图下所有网格
  GET_ONEMAPGRID_LIST(state, data) {
    state.oneMapGidList = data
  },
  // 指定地图下所有楼宇
  GET_ONEMAPBUILD_LIST(state, data) {
    state.oneMapBuildList = data
  },
  // 地图结构树
  GET_MAPORG_TREE(state, data) {
    state.mapOrgTree = data
  },
  // 网格统计
  GET_GRID_STATISTIC(state, data) {
    state.mapGridStic = data
  },
  // 楼宇统计
  GET_BUILD_STATISTIC(state, data) {
    state.mapBuildStic = data
  },
  // 楼层统计
  GET_FLOOR_STATISTIC(state, data) {
    state.mapFloorStic = data
  }
}

const actions = {
  /**
   * 胡红勋,获取所有楼层内的有位置的点位
   */
  getAllFLoorPoints({ state, commit }, type) {
    const param = {
      url: '/map/point/all?mapType=' + type
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          const points = res.data
          let floorsArr = []
          for (let index in points) {
            let device = points[index]
            let pointId = device._id
            let point = device.point
            let building = point.sid.bid
            let levelCenter = building.center.split(',').map(item => Number(item))
            let levelExtent = building.scope.split(',').map(item => Number(item))
            let mapUrl = '/api/upload?id=' + point.sid.picture.id
            floorsArr.push({
              center: levelCenter,
              extent: levelExtent,
              zoom: point.sid.class,
              mapUrl,
              id: point.sid._id,
              pointId
            })
          }
          // let hash = {}
          // floorsArr = floorsArr.reduce((item, next) => {
          //   hash[next.id] ? '' : (hash[next.id] = true && item.push(next))
          //   return item
          // }, [])
          // commit('SET_EDIT_FLOOR_DATAS', floorsArr)
          // let floorsArr = []
          // for (let index in res) {
          //   let val = res[index]
          //   let levelCenter = val.bid.center.split(',').map(item => Number(item))
          //   let levelExtent = val.bid.scope.split(',').map(item => Number(item))
          //   let mapUrl = '/api/upload?id=' + val.picture.id
          //   let floorData = { center: levelCenter, extent: levelExtent, zoom: val.class, mapUrl }
          //   floorsArr.push(floorData)
          //   commit('SET_FLOORDATAS_LIST', floorsArr)
          // }
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 清库
  deleteMapData({ state }, playod) {
    const param = {
      url: '/map/maplist/' + playod
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
  // 获取地图列表
  getConfig({ commit }, url) {
    if (url.indexOf('geoserver') > 0) {
      // geoserver地图服务
      return new Promise((resolve, reject) => {
        let xmlhttp = new window.XMLHttpRequest()
        xmlhttp.open('GET', url, true)
        xmlhttp.send(null)
        xmlhttp.onreadystatechange = function(res) {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            resolve(res.currentTarget.responseText)
          }
          // 胡红勋添加，请求超时的判断方法
          setTimeout(() => {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              // resolve(res.currentTarget.responseText)
            } else {
              reject(new Error('请求超时，请核实该地图服务器是否开启'))
            }
          }, 5000)
        }
      })
    } else if (url.indexOf('iserver') > 0) {
      // iserver地图服务
      return new Promise((resolve, reject) => {
        let xmlhttp = new window.XMLHttpRequest()
        xmlhttp.open('GET', url, true)
        xmlhttp.send(null)
        xmlhttp.onreadystatechange = function(res) {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            resolve(res.currentTarget.responseText)
          }
          // 胡红勋添加，请求超时的判断方法
          setTimeout(() => {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              // resolve(res.currentTarget.responseText)
            } else {
              reject(new Error('请求超时，请核实该地图服务器是否开启'))
            }
          }, 5000)
        }
      })
    } else {
      console.log('地图服务解析有误，请联系管理员')
    }
  },
  // 获取超图
  getIserverConfig({ commit }, url) {
    return new Promise((resolve, reject) => {
      let xmlhttp = new window.XMLHttpRequest()
      xmlhttp.open('GET', url, true)
      xmlhttp.send(null)
      xmlhttp.onreadystatechange = function(res) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          resolve(res.currentTarget.responseText)
        }
      }
    })
  },
  setMapCenter({ commit }, playod) {
    const param = {
      body: {
        center: playod.center
      },
      url: '/map/maplist/' + playod.mapId
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 设置地图配置 ---暂时没用
  setMapServerConfig({ commit }, playod) {
    const param = {
      body: playod,
      url: '/map/maplist'
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 设置地图列表
  setMapServerList({ commit }, list) {
    const param = {
      body: list,
      url: '/map/maplist'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取地图列表 --- 调用的同时后端清空所有资源
  getMapServerList({ commit }) {
    const param = {
      url: '/map/maplist'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('SET_MAPSERVER_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取设备资源
  getResourceOrg({ commit }, floorId) {
    const param = {
      url: '/setting/resource/tree/map/multiresource',
      query: {
        orgtype: 0,
        channelTypes: '0,1',
        maptype: '2d'
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
          commit('GET_RESOURCEORG_TREE', toTreeData(arr))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取网格列表 /map/point/all
  getGrid({ commit }, playod) {
    const param = {
      // url: '/map/grid'
      url: '/map/grid/mapid?mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('SET_GRID_LIST', res.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定网格
  getOneGrid({ commit }, playod) {
    const param = {
      url: '/map/grid/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_ONEGRID_DATA', res.data)
        })
        .catch(err => {
          reject(err)
          commit('GET_ONEGRID_DATA', '')
        })
    })
  },
  // 修改指定网格
  editOneGrid({ state }, playod) {
    const param = {
      body: playod,
      url: '/map/grid/' + playod._id
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
  // 删除指定网格
  deleteOneGrid({ state }, playod) {
    const param = {
      query: playod,
      url: '/map/grid/' + playod
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
  // 添加网格
  addOneGrid({ commit }, playod) {
    const param = {
      body: playod,
      url: '/map/grid'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取所有楼宇列表 /map/
  getBuild({ commit }, playod) {
    const param = {
      url: '/map/building/mapid?mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('SET_BUILD_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定楼宇, 胡红勋修改
  getOneBuild({ commit }, playod) {
    const param = {
      url: '/map/building/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          const building = res.data
          resolve(building)
          commit('GET_ONEBUILD_DATA', building)
          let levelCenter = building.center.split(',').map(item => Number(item))
          let levelExtent = building.scope.split(',').map(item => Number(item))
          let floorsArr = []
          const floors = building.sids
          for (let index in floors) {
            let floor = floors[index]
            let mapUrl = '/api/upload?id=' + floor.picture.id
            let floorData = {
              center: levelCenter,
              extent: levelExtent,
              zoom: floor.class,
              mapUrl,
              id: floor._id
            }
            floorsArr.push(floorData)
          }
          commit('SET_FLOORDATAS_LIST', floorsArr)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改指定网格
  editOneBuild({ state }, playod) {
    const param = {
      body: playod,
      url: '/map/building/' + playod._id
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
  // 删除指定网格
  deleteOneBuild({ state }, playod) {
    const param = {
      query: playod,
      url: '/map/building/' + playod
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
  // 添加楼宇
  addOneBuild({ commit }, playod) {
    const param = {
      body: playod,
      url: '/map/building'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取所有楼层列表
  getLevel({ commit }, playod) {
    const param = {
      url: '/map/building/' + playod + '/storey'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('SET_LEVEL_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定楼层
  getOneLevel({ commit }, playod) {
    const param = {
      url: '/map/storey/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONELEVEL_DATA', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改指定楼层
  editOneLevel({ state }, playod) {
    const param = {
      body: playod,
      url: '/map/storey/' + playod._id
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
  // 删除指定楼层
  deleteOneLevel({ state }, playod) {
    const param = {
      query: playod,
      url: '/map/storey/' + playod
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
  // 添加楼层
  addOneLevel({ commit }, playod) {
    const param = {
      body: playod,
      url: '/map/storey'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定点位
  getOnePoint({ commit }, playod) {
    const param = {
      url: '/map/point/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          // if (res.data.mapsign) {
          //   commit('GET_COMMONALARM_DATA', res.data)
          // }
          commit('GET_POINT_DATA', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改|添加资源点位
  setOnePoint({ commit }, playod) {
    const param = {
      body: playod.body,
      url: '/map/point/' + playod._id
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
  // 删除资源点位
  delOnePoint({ commit }, playod) {
    const param = {
      body: playod,
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
  // 获取指定地图所有视频点位
  getOneMapPoint({ commit }, playod) {
    const param = {
      url: '/map/point/mapid?mapId=' + playod + '&channelType=0'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPPOINT_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定地图所有点位
  getOneMapGrid({ commit }, playod) {
    const param = {
      url: '/map/grid/mapid?mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPGRID_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定地图所有点位
  getOneMapBuild({ commit }, playod) {
    const param = {
      url: '/map/building/mapid?mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_ONEMAPBUILD_LIST', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取地图结构树
  getMapOrgTree({ commit }, playod) {
    const param = {
      url: '/map/zone/tree?mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          let arrOrg = []
          arrOrg.push(JSON.parse(JSON.stringify(res.data)))
          commit('GET_MAPORG_TREE', toTreeData(arrOrg))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 统计
  getStatData({ commit }, playod) {
    let param = {
      url: '/map/zone/statistic',
      body: {
        wkt: playod
      }
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 网格统计
  getGridStatData({ commit }, playod) {
    let param = {
      url: '/map/grid/' + playod + '/statistic'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_GRID_STATISTIC', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 楼宇统计
  getBuildStatData({ commit }, playod) {
    let param = {
      url: '/map/building/' + playod + '/statistic'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_BUILD_STATISTIC', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 楼层统计
  getFloorStatData({ commit }, playod) {
    let param = {
      url: '/map/storey/' + playod + '/statistic'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('GET_FLOOR_STATISTIC', res.data)
        })
        .catch(err => reject(err))
    })
  },
  setEditHighLightList({ commit }, data) {
    commit('SET_EDITHIGHTLIGHT_LIST', data)
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
