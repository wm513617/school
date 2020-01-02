import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
// import layerConfig from 'assets/3DMap/MapConfig.js'
import utils from 'assets/3DMap/utils/index.js'
import mapUtils from 'assets/3DMap/mapUtil.js'
// import appPatrol from 'assets/3DMap/appPatrolIpc.js'
// import appResource from 'assets/3DMap/appResource.js'
// import gridUtil from 'assets/3DMap/gridUtil.js'
export default {
  data() {
    return {
      floorOneData: {
        center: [],
        extent: [],
        mapUrl: ''
      },
      keyTypes: {},
      context: null,
      count: 0,
      twinkFlag: false,
      twinkleCounter: 0 // 闪烁计数器
    }
  },
  computed: {
    ...mapState({
      floorData: ({ tdFloor }) => tdFloor.floorData,
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 三维地图和楼层平面图切换的标识
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式---
      buildingArr: ({ tdPoint }) => tdPoint.buildingArr,
      layerSettingsMap: ({ tdIndex }) => tdIndex.layerSettingsMap // 图层设置map(key: 图层名称， value: 图层设置信息)
    })
  },
  watch: {
    twinkFlag(val) {
      if (val) {
        this.alarmTwink3D(this.buildingArr)
      } else {
        this.alarmTwink3D([])
      }
    },
    // 监听楼层数据的变化切换楼层地图
    floorData(val) {
      if (val) {
        let width = 200
        let height = 100
        let floor = JSON.parse(JSON.stringify(val))
        if (floor.picture.size) {
          width = floor.picture.size.width
          height = floor.picture.size.height
        }
        this.floorOneData.center = floor.bid.center.split(',').map(item => Number(item))
        let levelExtent = utils.getExtent(this.floorOneData.center, [width, height])
        this.floorOneData.extent = levelExtent
        this.floorOneData.mapUrl = '/api/upload?id=' + floor.picture.id
        // 加载楼层中点位控制列表默认要显示的点位-----
        this.displayAllFloorResourcePoint()
      }
    }
  },
  methods: {
    ...mapActions([
      'getResourcePointsByChannelType',
      'getAssistHoleList',
      'setReady',
      'getAllPatrolPoint',
      'getMap3DParamConfig',
      'getLayerSettingsList'
    ]),
    ...mapActions('map3DApplyIX', ['changeShow']),
    // 三维地图加载完成调用的方法-----
    readyEvt(param) {
      // --------------------------------限制相机视角高度----------------------
      param.viewer.scene.screenSpaceCameraController.minimumZoomDistance = mapUtils.TDDEFAULTOPS.minCameraHeight // 相机的高度的最小值
      param.viewer.scene.screenSpaceCameraController.maximumZoomDistance = mapUtils.TDDEFAULTOPS.maxCameraHeight // 相机高度的最大值
      param.viewer.bottomContainer.style.display = 'none'
      this.context = param
      let scene = param.viewer.scene
      let widget = param.viewer.cesiumWidget
      let { dataSet, dataSource, dataUrl, key, mapUrl, layer, perspective } = this.map3DConfig
      try {
        let promise = scene.open(mapUrl)
        param.Cesium.when(promise, layers => {
          Vue.prototype.$context = param
          this.setReady(true) // 地图图层加载完成的标志，其他组件可以以此为标志调用地图的方法
          let layerName = layer || (dataSet + '@' + dataSource)
          let scenelayer = scene.layers.find(layerName)
          // 设置拾取图层查询条件
          scenelayer.setQueryParameter({
            url: dataUrl,
            dataSourceName: dataSource,
            dataSetName: dataSet,
            keyWord: key
          })
          param.viewer.scene.postRender.addEventListener(this.handleScenePostUpdate)
          this.adjustSceneByLayerSettings() // 根据图层设置信息调整场景
          // 设置地图方位
          if (perspective) { // 有视角信息时，地图定位到给定视角
            param.viewer.camera.setView({
              destination: param.Cesium.Cartesian3.fromDegrees(perspective.longitude, perspective.latitude, perspective.height),
              orientation: {
                heading: param.Cesium.Math.toRadians(perspective.heading),
                pitch: param.Cesium.Math.toRadians(perspective.pitch),
                roll: param.Cesium.Math.toRadians(perspective.roll)
              }
            })
          } else { // 无视角信息时地图缩放到显示图层
            param.viewer.zoomTo(scenelayer)
          }
          this.displayAllResourcePoint()
        })
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          let title = '渲染时发生错误，已停止渲染。'
          widget.showErrorPanel(title, undefined, e)
        }
      }
    },
    adjustSceneByLayerSettings() { // 根据图层设置信息调整场景
      let scene = this.$context.viewer.scene
      for (const settings of this.layerSettingsMap.values()) {
        let layer = scene.layers.find(settings.name)
        if (layer) { // 图层
          layer.selectedColor = settings.selected ? (settings.selectedColor ? this.$context.Cesium.Color.fromCssColorString(settings.selectedColor) : this.$context.Cesium.Color.FUCHSIA) : this.$context.Cesium.Color.WHITE
          layer.hue = settings.hue
          layer.saturation = settings.saturation
          layer.brightness = settings.brightness
        } else if (settings.name === 'viewer') { // 视图
          let skyAtmosphere = scene.skyAtmosphere
          if (skyAtmosphere) {
            skyAtmosphere.hueShift = settings.hue
            skyAtmosphere.saturationShift = settings.saturation
            skyAtmosphere.brightnessShift = settings.brightness
          }
        }
      }
    },
    handleScenePostUpdate(scene, time) {
      if (this.twinkleCounter > mapUtils.RESOURCESTATUS.twinkleStep) {
        this.twinkleCounter = 0
        for (const item of this.allAlarmEntities) { // 有报警实体时，改变实体状态
          let {id, existModel} = item
          if (!existModel) {
            let alarmingEntity = this.context.viewer.entities.getById(id) // 获取当前实体对象
            if (alarmingEntity) {
              alarmingEntity.model.colorBlendAmount = (alarmingEntity.model.colorBlendAmount._value === 0) ? mapUtils.RESOURCESTATUS.colorAmount : 0
            }
          }
        }
        if (this.buildingArr) { // 有楼内报警时，改变楼宇闪烁状态
          this.twinkFlag = !this.twinkFlag
        }
      } else {
        this.twinkleCounter++
      }
    },
    displayAllResourcePoint() {
      console.log(this.modeType, 'this.modeType')
      // 获取辅助杆列表
      this.getAssistHoleList()
        .then(res => {
          res.forEach(res => {
            res.type = mapUtils.CHANNELTYPE.assist
          })
          utils.addEntitysToMap(this.keyTypes.pole, res, this.mapMode, this.context)
        })
        .catch(err => {
          console.log('获取辅助杆列表数据失败：', err)
        })
      switch (this.modeType) {
        case 'alarmProcessing':
          this.changeShow({type: 'isAlarm', val: true})
          this.changeShow({type: 'isAlarmBox', val: true})
          this.changeShow({type: 'isAlarmPillar', val: true})
          this.loadDefaultMapResourcePoint({ channelTypes: mapUtils.pointTypes.commonAlarm }).then(res => {
            utils.addEntitysToMap(this.keyTypes.commonAlarm, res, this.mapMode, this.context, false)
          })
          this.loadDefaultMapResourcePoint({
            tab: mapUtils.TABTYPE.alarmHelp,
            channelTypes: mapUtils.pointTypes.vedio
          }).then(res => {
            let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmBoxResource)
            utils.addEntitysToMap(this.keyTypes.alarmBox, result, this.mapMode, this.context, false)
          })
          this.loadDefaultMapResourcePoint({
            tab: mapUtils.TABTYPE.alarmHelp,
            channelTypes: mapUtils.pointTypes.vedio
          }).then(res => {
            let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmColumnResource)
            utils.addEntitysToMap(this.keyTypes.alarmColumn, result, this.mapMode, this.context, false)
          })
          break
        case 'fireAlarm':
          this.changeShow({type: 'isFire', val: true})
          this.loadDefaultMapResourcePoint({ channelTypes: mapUtils.pointTypes.fireAlarm }).then(res => {
            utils.addEntitysToMap(this.keyTypes.fireAlarm, res, this.mapMode, this.context, false)
          })
          break
        case 'patrol':
          this.changeShow({type: 'isSinglePawn', val: true})
          this.changeShow({type: 'isKeepWatch', val: true})
          this.getAllPatrolPoint().then(res => {
            utils.addEntitysToMap(this.keyTypes.patrol, res, this.mapMode, this.context, false)
          })
          break
        default:
          break
      }
    },
    async loadDefaultMapResourcePoint(param) {
      let result = []
      result = await this.getResourcePointsByChannelType(param)
      return result
    }
  },
  mounted() {
    this.keyTypes = mapUtils.getKeyType()
    this.getMap3DParamConfig()
    this.getLayerSettingsList() // 获取图层设置信息
  }
}
