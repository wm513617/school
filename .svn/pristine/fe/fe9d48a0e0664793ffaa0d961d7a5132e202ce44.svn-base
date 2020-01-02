<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import Vue from 'vue'
import layerConfig from 'assets/2DMap/meta/layer'
import drawConfig from 'assets/2DMap/meta/draw'
import videoTrans from 'assets/2DMap/feature/apply/video'
import alarmTrans from 'assets/2DMap/feature/apply/alarm'
import transAlarmHelp from 'assets/2DMap/feature/apply/alarmHelp'
import transPatrol from 'assets/2DMap/feature/apply/patrol'
import highLight from 'assets/2DMap/feature/edit/highLight'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import utils from 'assets/3DMap/utils/index.js'
import mapUtils from 'assets/3DMap/mapUtil.js'
import gridUtil from 'assets/3DMap/gridUtil.js'
import DrawTrack from '../components/track/DrawTrack'
import { transCoorinates } from '../panelTools/panels/flight/init'
import { RESOURCETYPE, VIDEOTYPEKEY, FEATURETYPE, VIDEOICONLAYERMAP, CAMERATYPE } from 'assets/2DMap/meta/common'
import VideoLayer from './layers/video'
import GridLayer from './layers/grid'
import CommonAlarmLayer from './layers/commonAlarm'
import FireAlarmLayer from './layers/fireAlarm'
import AlarmBoxLayer from './layers/alarmBox'
import AlarmColumnLayer from './layers/alarmColumn'
import PatrolLayer from './layers/patrol'
import featureBase from 'assets/2DMap/feature/base'
export default {
  data() {
    return {
      context: null,
      drawTrack: null,
      measureLayer: JSON.parse(JSON.stringify(layerConfig.measure)), // 量算图层
      isFocusOn3DMap: true, // 鼠标焦点是否在3D视图上
      floorOneData: {
        center: [],
        extent: [],
        mapUrl: ''
      },
      currentSMID: '',
      buildIngAlarm: null,
      allAlarmingFeatureList: [],
      index: 0,
      videoLayer: layerConfig.video, // 视频点位图层配置
      alarmingLayer: layerConfig.alarming, // 正在报警点位图层配置
      patrolLayer: layerConfig.patrol, // 巡更点图层配置
      commonAlarmLayer: layerConfig.commonAlarm, // 普通报警图层配置
      fireAlarmLayer: layerConfig.fireAlarm, // 消防点位图层配置
      positionLayer: layerConfig.highLightLocateLayer, // 高亮定位图层配置
      alarmBoxLayer: layerConfig.alarmBox, // 报警求助图层配置
      gridLayer: layerConfig.grid, // 楼层内网格图层配置----
      alarmColumnLayer: layerConfig.alarmColumn,
      areaQuery: drawConfig.areaQuery, // 二维的绘制区域绘制控件样式配置-----
      keyTypes: {},
      clearExtentDraw: false,
      selectedEntitys: [],
      count: 0,
      twinkFlag: false,
      twinkleCounter: 0 // 闪烁计数器
    }
  },
  mixins: [VideoLayer, GridLayer, CommonAlarmLayer, FireAlarmLayer, AlarmBoxLayer, AlarmColumnLayer, PatrolLayer],
  computed: {
    ...mapGetters('map3DApplyIX', [
      'isCameraSpear', // 点位-枪机
      'isHalfBall', // 点位-半球
      'isFastBall', // 点位-快球
      'isFullShot', // 点位-全景
      'isInfrared', // 点位-红外枪机
      'isAlarm', // 点位-普通报警
      'isFire', // 点位-消防报警
      'isAlarmBox', // 点位-报警箱
      'isAlarmPillar', // 点位-报警柱
      'isKeepWatch', // 点位-巡更
      'isSinglePawn', // 点位-单兵
      'isSingleHead', // 点位-单兵头像
      'isShowName', // 是否显示名称标签
      'isShowGrid', // 是否显示网格
      'videoCheckedList'
    ]),
    ...mapGetters(['singleAllList']),
    ...mapGetters('map3DApplyIX', ['isPointChooseStatus', 'attrInfo', 'isMeasurePanel3D', 'measureModeIndoor']),
    ...mapState({
      floorData: ({ tdFloor }) => tdFloor.floorData,
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      ready: ({ tdIndex }) => tdIndex.ready, // 三维地图是否加载完成的标识----
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式----
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 三维地图和楼层平面图切换的标识
      active3DDraw: ({ tdIndex }) => tdIndex.active3DDraw, // 三维绘制工具的开启关闭
      drawType3D: ({ tdIndex }) => tdIndex.drawType3D, // 三维绘制几何类型
      clampMode3D: ({ tdIndex }) => tdIndex.clampMode3D, // 三维绘制贴物模式
      videoFeatureList: ({ tdPoint }) => tdPoint.videoFeatureList, // 普通视频点位
      fireAlarmFeatureList: ({ tdPoint }) => tdPoint.fireAlarmFeatureList, // 消防报警点位
      alarmColumnFeatureList: ({ tdPoint }) => tdPoint.alarmColumnFeatureList, // 报警柱位
      alarmBoxFeatureList: ({ tdPoint }) => tdPoint.alarmBoxFeatureList, // 报警箱位
      patrolFeatureList: ({ tdPoint }) => tdPoint.patrolFeatureList, // 巡更点位
      alarmFeatureList: ({ tdPoint }) => tdPoint.alarmFeatureList, // 普通报警点位
      alarmingFeatureList: ({ tdPoint }) => tdPoint.alarmingFeatureList, // 报警闪烁点位
      highLightFeatureList: ({ tdPoint }) => tdPoint.highLightFeatureList, // 高亮定位点位
      highLightLabelList: ({tdPoint}) => tdPoint.highLightLabelList, // 高亮数据
      gridFeatureList: ({ tdPoint }) => tdPoint.gridFeatureList, // 网格列表要素
      gridLabelFeatureList: ({ tdPoint }) => tdPoint.gridLabelFeatureList, // 网格名称要素
      showPopup: ({ tdIndex }) => tdIndex.showPopup, // 选择实体的Cartesian3世界坐标---韩杰---2018-10-26 09:25:13
      selectedEntity: ({ tdIndex }) => tdIndex.selectedEntity, // 选择的实体---韩杰---2018-10-26 09:25:13
      selectedEntityScreenCo: ({ tdIndex }) => tdIndex.selectedEntityScreenCo, // 选择实体的Cartesian3世界坐标---韩杰---2018-10-26 09:25:13
      mapResource: ({ tdPoint }) => tdPoint.mapResource, // 地图资源，包括通道资源，巡更资源
      buildIngAlarmObj: ({ tdPoint }) => tdPoint.buildIngAlarmObj, // 楼宇汇聚闪烁对象
      selectBoxVideoData: ({ tdPoint }) => tdPoint.selectBoxVideoData,
      selectBoxSingleData: ({ tdPoint }) => tdPoint.selectBoxSingleData,
      previewPointList: ({ tdPoint }) => tdPoint.previewPointList,
      isBoxChoosePreView: ({ tdPoint }) => tdPoint.isBoxChoosePreView,
      videoList: ({ tdPoint }) => tdPoint.videoList,
      isBoxChooseClosed: ({ tdPoint }) => tdPoint.isBoxChooseClosed,
      area2DDrawActive: ({ tdIndex }) => tdIndex.area2DDrawActive,
      floorAlarmPoints: ({ tdPoint }) => tdPoint.floorAlarmPoints,
      buildingArr: ({ tdPoint }) => tdPoint.buildingArr,
      showDrawTrack: ({ tdIndex }) => tdIndex.showDrawTrack, // 是否显示绘制轨迹---韩杰---2018-10-25
      trackCoMap: ({ tdIndex }) => tdIndex.trackCoMap, // 轨迹坐标map(key: 坐标点信息，value：三维坐标)---韩杰---2018-10-25
      layerSettingsMap: ({ tdIndex }) => tdIndex.layerSettingsMap, // 图层设置map(key: 图层名称， value: 图层设置信息)
      realSingleMap3D: ({ tdIndex }) => tdIndex.realSingleMap3D, // 实时单兵缓存(key: 单兵用户标识，value：单兵用户信息)
      showSingleHeads3D: ({ tdIndex }) => tdIndex.showSingleHeads3D, // 显示的单兵头像数组
      selelctedSingle3D: ({ tdIndex }) => tdIndex.selelctedSingle3D, // 选择的单兵
      singleRealTrackCoords3D: ({ tdIndex }) => tdIndex.singleRealTrackCoords3D, // 单兵实时轨迹坐标
      activeAlarmInfo3D: ({ alarmThreeD }) => alarmThreeD.activeAlarmInfo3D,
      allAlarmEntities: ({ tdPoint }) => tdPoint.allAlarmEntities, // 所有报警实体
      normalAlarmList: ({ alarmThreeD }) => alarmThreeD.normalAlarmList, // 普通报警
      fireAlarmList: ({ alarmThreeD }) => alarmThreeD.fireAlarmList, // 消防报警
      videoAlarmList: ({ alarmThreeD }) => alarmThreeD.videoAlarmList, // 视频报警
      intelligentAlarmList: ({ alarmThreeD }) => alarmThreeD.intelligentAlarmList, // 智能报警
      alarmHelpList: ({ alarmThreeD }) => alarmThreeD.alarmHelpList // 报警求助
    /*  patrolShow: ({ patrolAlarm }) => patrolAlarm.patrolShow, // 获取巡更或单兵报警弹出框状态
      patrolModalType: ({ patrolAlarm }) => patrolAlarm.patrolModalType, // 巡更类型
      patrolAlarmData: ({ patrolAlarm }) => patrolAlarm.patrolAlarmData, // 巡更单条报警数据
      singleAlarmData: ({ patrolAlarm }) => patrolAlarm.singleAlarmData, // 单兵单条报警数据
      talkDataInfo: ({ patrolAlarm }) => patrolAlarm.talkDataInfo // 消息信息 */
    })
    /* patrolAloneData(val) {
      let alarmAloneData
      switch (this.patrolModalType) {
        case 'AttrPatrol':
          alarmAloneData = this.patrolAlarmData
          break
        case 'AttrSinglePawn':
          alarmAloneData = this.singleAlarmData
          break
        case 'talkAlarm':
          alarmAloneData = this.talkDataInfo
          break
      }
      return alarmAloneData
    } */
  },
  watch: {
    measureModeIndoor: {
      handler(newMode) {
        if (newMode && newMode.type) {
          this.measureLayer.actived = newMode.isMeasure
          this.measureLayer.type = newMode.type
          if (!newMode.panelVisible) { // 隐藏室内量算面板时，清空量算绘制内容
            this.measureLayer.clear = true
          }
        }
      },
      deep: true
    },
    measureLayer: {
      handler(measure) {
        if (!measure.actived && this.measureModeIndoor.isMeasure) {
          let mode = {isMeasure: false}
          this.changeMeasureModeIndoor(mode) // 关闭室内量算状态
        }
      },
      deep: true
    },
    selelctedSingle3D: {
      handler(newData, oldData) {
        if (oldData && oldData.isOpenTrack && newData.id !== oldData.id && newData.isOpenTrack) {
          this.changePreSelectedState3D(oldData.id)
        }
        this.controlSingleRealTrackState(newData.isOpenTrack)
      },
      deep: true
    },
    singleRealTrackCoords3D: {
      handler(newArr, oldArr) {
        // console.log('单兵实时旧位置数组：', oldArr, ', 新位置数组：', newArr)
        this.drawTrack.clearTrack()
        this.controlSingleRealTrackShow() // 控制单兵实时轨迹显示
      },
      deep: true
    },
    twinkFlag(val) {
      if (val) {
        this.alarmTwink3D(this.buildingArr)
      } else {
        this.alarmTwink3D([])
      }
    },
    isBoxChoosePreView(val) {
      if (val) {
        this.$refs.selectBoxVideoModal.openModal(this.$lodash.cloneDeep(this.previewPointList))
      }
    },
    isBoxChooseClosed(val) {
      if (val) {
        this.closeSelectModel()
      }
    },
    // 监听楼层数据的变化切换楼层地图
    floorData: {
      handler(val) {
        if (val) {
          this.setAlarmingList([])
          this.setHighLightList([]) // 清空高亮要素
          this.setHighLightLabelList(null)
          let mode = {panelVisible: false, isMeasure: false}
          this.changeMeasureModeIndoor(mode) // 关闭室内量算工具
          this.$emit('sendEvent', { type: 'floor', data: JSON.parse(JSON.stringify(val)) })
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
          this.floorOneData.mapUrl = floor.picture.path
          // 加载楼层中点位控制列表默认要显示的点位
          this.$nextTick(() => {
            this.displayAllFloorResourcePoint()
            this.handleSelectedFeature() // 处理选择树节点
            let object = this.floorAlarmPoints[this.floorData._id]
            for (const key in object) {
              if (object.hasOwnProperty(key)) {
                const element = object[key]
                let type = this.getType(element)
                this.addAlarmingFloorPoint(element, key, type)
              }
            }
            this.allAlarmingFeatureList = this.$lodash.cloneDeep(this.alarmingFeatureList)
            this.locationToCenter()
          })
        }
      },
      deep: true,
      immediate: true
    },
    alarmingFeatureList: {
      handler(val) {
        // if (val.length > 0) {
        this.allAlarmingFeatureList = this.$lodash.cloneDeep(val)
        // }
        //
      },
      deep: true
    }
    // attrInfo: {
    //   handler(val) {
    //     this.handleSelectedFeature() // 处理选择的树节点
    //   },
    //   deep: true
    // }
  },
  methods: {
    ...mapMutations(['CHANGE_IS_SHOW_PT_ATTR', 'DETEL_CURRENT_GRID_3D', 'DETEL_HIGHLIGHT_LABEL_TEXT', 'SAVE_PATROL_STUATES', 'GET_PATROL_TYPE', 'SAVE_SINGLE_DATA']),
    ...mapActions([
      'setReady',
      'getSinglePatrolPoint',
      'getSinglePatrolPointWithoutUpdateState',
      'pushSelectSingleList',
      'setAreaDialogShow',
      'set3DActiveDraw',
      'get3DSelectBoxData',
      'getResourcePointsByChannelType',
      'getAllPatrolPoint',
      'setMapResource',
      'setShowBuildingAlarm',
      'getOneBuildById',
      'getOneBuildByIdWithoutUpdateState',
      'setIsOuter',
      'setAlarmingList',
      'setShowPopup',
      'setSelectedEntity',
      'setSelectedEntityScreenCo',
      'getResourceById',
      'getResourceByIdWithoutUpdateState',
      'updateVideoDragList',
      'getOneFloorPatrols',
      'getGridList',
      'setGridList',
      'setFirAlarmList',
      'setAlarmList',
      'setAlarmBoxList',
      'setAlarmColumnList',
      'setPatrolList',
      'setVideoList',
      'getResourceById',
      'getMap3DOneGridById',
      'getUserOne',
      'getMap3DParamConfig',
      'getAllBuild',
      'set2DAreaDraw',
      'getAssistHoleList',
      'getAssistHoleById',
      'getAssistHoleByIdWithoutUpdateState',
      'getLayerSettingsList',
      'setPreviewPointList',
      'setShowSingleHeads3D',
      'setSingleRealTrackCoords3D',
      'setHighLightList',
      'setHighLightLabelList',
      'setCurrentHighLightGrid',
      'setIsBoxChoosePreview',
      'setBoltipcLabelFeatures',
      'setHalfBallipcLabelFeatures',
      'setFastBallipcLabelFeatures',
      'setAllViewipcLabelFeatures',
      'setRedBoltipcLabelFeatures',
      'setCommonAlarmLabelFeatures',
      'setFireAlarmLabelFeatures',
      'setAlarmBoxLabelFeatures',
      'setAlarmColumnLabelFeatures',
      'setPatrolLabelFeatures',
      'setCurrentGrid3D',
      'setGridLabelList'
    ]),
    ...mapActions('map3DApplyIX', ['changeToolsPanelToBoxChoose', 'changeBoxChooseSecPanelStatus', 'switchToolsPanel', 'changeMeasureModeIndoor']),
    /**
     * @msg: 返回底图
     */
    goBack() {
      this.setHighLightList([]) // 清空高亮要素
      this.setHighLightLabelList(null)
      this.setIsOuter(true)
    },
    controlSingleRealTrackState(flag) {
      if (flag) {
        let {...realSingle} = this.selelctedSingle3D
        if (realSingle) {
          let coords = [Number(realSingle.geo.lon), Number(realSingle.geo.lat), mapUtils.TDDEFAULTOPS.trackPointHeight]
          this.setSingleRealTrackCoords3D([coords])
        }
      } else { // 清除轨迹
        this.drawTrack.clearTrack()
        this.setSingleRealTrackCoords3D([]) // 清空实时单兵轨迹坐标
      }
    },
    controlSingleRealTrackShow() { // 控制单兵实时轨迹显示
      if (this.singleRealTrackCoords3D && this.singleRealTrackCoords3D.length > 0) {
        let positions = transCoorinates.WSG84ArrToWorldPositions(this.context, this.singleRealTrackCoords3D)
        this.drawTrack.drawSingleRealTrack(positions) // 绘制轨迹
      }
    },
    // 三维地图加载完成调用的方法-----
    readyEvt(param) {
      // --------------------------------限制相机视角高度----------------------
      // param.viewer.scene.screenSpaceCameraController.minimumZoomDistance = mapUtils.TDDEFAULTOPS.minCameraHeight // 相机的高度的最小值
      // param.viewer.scene.screenSpaceCameraController.maximumZoomDistance = mapUtils.TDDEFAULTOPS.maxCameraHeight // 相机高度的最大值
      this.context = param
      this.drawTrack = new DrawTrack(this.context)
      let scene = param.viewer.scene
      let widget = param.viewer.cesiumWidget
      let { dataSet, dataSource, dataUrl, key, mapUrl, layer, perspective } = this.map3DConfig
      let { showDrawTrack, trackCoMap } = this
      try {
        let promise = scene.open(mapUrl)
        param.Cesium.when(promise, layers => {
          Vue.prototype.$context = param
          this.setReady(true) // 地图图层加载完成的标志，其他组件可以以此为标志调用地图的方法
          let layerName = layer || (dataSet + '@' + dataSource)
          let scenelayer = scene.layers.find(layerName)
          if (scenelayer) {
            // 设置拾取图层查询条件
            scenelayer.setQueryParameter({
              url: dataUrl,
              dataSourceName: dataSource,
              dataSetName: dataSet,
              keyWord: key
            })
            this.adjustSceneByLayerSettings(layerName) // 根据图层设置信息调整场景
            this.setMapView(perspective, scenelayer) // 设置地图视图方位
            this.regMapListeners() // 注册键盘按下的监听
            this.reloadAlarmingEntities() // 重载报警点位模型
            this.displayAllResourcePoint()
            this.activeAlarmInfo3D && this.locationFocus3D()
            if (showDrawTrack && trackCoMap && trackCoMap.size > 0) { // 显示绘制轨迹，有轨迹位置信息时
              this.$emit('drawTrack') // 抛出绘制轨迹
            }
          }
        })
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          let title = '渲染时发生错误，已停止渲染。'
          widget.showErrorPanel(title, undefined, e)
        }
      }
    },
    adjustSceneByLayerSettings(layerName) {
      // 根据图层设置信息调整场景
      let scene = this.context.viewer.scene
      let layers = scene._layers.layerQueue // 获取地图图层数组
      // 初始化图层选择参数
      for (let layerItem of layers) {
        layerItem.clearMemoryImmediately = false // 图层关闭释放视野之外的设置
        if (layerName === layerItem.name) {
          layerItem.selectedColor = this.context.Cesium.Color.FUCHSIA
        } else {
          layerItem.selectedColor = this.context.Cesium.Color.WHITE
        }
      }
      for (const settings of this.layerSettingsMap.values()) {
        let layer = scene.layers.find(settings.name)
        if (layer) {
          // 图层
          layer.selectedColor = settings.selected
            ? (settings.selectedColor ? this.context.Cesium.Color.fromCssColorString(settings.selectedColor) : this.context.Cesium.Color.FUCHSIA)
            : this.context.Cesium.Color.WHITE
          layer.hue = settings.hue
          layer.saturation = settings.saturation
          layer.brightness = settings.brightness
        } else if (settings.name === 'viewer') {
          // 视图
          let skyAtmosphere = scene.skyAtmosphere
          if (skyAtmosphere) {
            skyAtmosphere.hueShift = settings.hue
            skyAtmosphere.saturationShift = settings.saturation
            skyAtmosphere.brightnessShift = settings.brightness
          }
        }
      }
    },
    handleBuildingFeature(bid) {
      // 处理点击楼宇元素
      if (this.buildIngAlarmObj[bid]) {
        this.currentSMID = bid
        this.buildIngAlarm = JSON.parse(JSON.stringify(this.buildIngAlarmObj[bid]))
        this.changeTreeData(this.buildIngAlarm)
        this.setShowBuildingAlarm(true)
      } else {
        // 楼宇如果没有报警---抛出事件--显示楼宇属性面板--------
        this.getOneBuildById(bid).then(res => {
          this.$emit('sendEvent', { type: mapUtils.CHANNELTYPE.building, data: res })
        })
      }
    },
    removeBuildingNameLabel() {
      if (!this.isShowName) {
        // 移除楼宇名称标签
        let labels = mapUtils.entitys.labels
        for (const label of labels) {
          // 遍历楼宇名称标签
          this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
        }
      }
    },
    // 根据点位控制多选框的选择项，加载默认的资源---
    displayAllFloorResourcePoint() {
      // 消防报警
      if (this.isFire) {
        this.loadDefaultMapResourcePoint({ sid: this.floorData._id, channelTypes: mapUtils.pointTypes.fireAlarm }).then(
          res => {
            let alarms = alarmTrans.transFeatures(res, this.fireAlarmLayer, this.mapMode)
            let copyAlarms = JSON.parse(JSON.stringify(alarms))
            this.setFirAlarmList(alarms)
            if (this.isShowName) {
              let arr = []
              for (let item of copyAlarms) {
                this.setClickLabelFeatures(item.attributes, arr, this.fireAlarmLabelLayer)
              }
              arr && this.setFireAlarmLabelFeatures(arr)
            } else {
              this.setFireAlarmLabelFeatures([])
            }
          }
        )
      } else {
        this.setFirAlarmList([])
        this.setFireAlarmLabelFeatures([])
      }
      // 普通报警
      if (this.isAlarm) {
        this.loadDefaultMapResourcePoint({
          sid: this.floorData._id,
          channelTypes: mapUtils.pointTypes.commonAlarm
        }).then(res => {
          let alarms = alarmTrans.transFeatures(res, this.commonAlarmLayer, this.mapMode)
          let copyAlarms = JSON.parse(JSON.stringify(alarms))
          this.setAlarmList(alarms)
          if (this.isShowName) {
            let arr = []
            for (let item of copyAlarms) {
              this.setClickLabelFeatures(item.attributes, arr, this.commonAlarmLabelLayer)
            }
            arr && this.setCommonAlarmLabelFeatures(arr)
          } else {
            this.setCommonAlarmLabelFeatures([])
          }
        })
      } else {
        this.setAlarmList([])
        this.setCommonAlarmLabelFeatures([])
      }
      // 报警箱
      if (this.isAlarmBox) {
        this.loadDefaultMapResourcePoint({
          tab: mapUtils.TABTYPE.alarmHelp,
          sid: this.floorData._id,
          channelTypes: mapUtils.pointTypes.vedio
        }).then(res => {
          let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmBoxResource)
          let alarmBoxs = transAlarmHelp.transFeatures(result, this.alarmBoxLayer, this.mapMode)
          let copyAlarmBoxs = JSON.parse(JSON.stringify(alarmBoxs))
          this.setAlarmBoxList(alarmBoxs)
          if (this.isShowName) {
            let arr = []
            for (let item of copyAlarmBoxs) {
              this.setClickLabelFeatures(item.attributes, arr, this.alarmBoxLabelLayer)
            }
            arr && this.setAlarmBoxLabelFeatures(arr)
          } else {
            this.setAlarmBoxLabelFeatures([])
          }
        })
      } else {
        this.setAlarmBoxList([])
        this.setAlarmBoxLabelFeatures([])
      }
      // 报警柱
      if (this.isAlarmPillar) {
        this.loadDefaultMapResourcePoint({
          tab: mapUtils.TABTYPE.alarmHelp,
          sid: this.floorData._id,
          channelTypes: mapUtils.pointTypes.vedio
        }).then(res => {
          let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmColumnResource)
          let alarmColumns = transAlarmHelp.transFeatures(result, this.patrolLayer, this.mapMode)
          let copyAlarmColumns = JSON.parse(JSON.stringify(alarmColumns))
          this.setAlarmColumnList(alarmColumns)
          if (this.isShowName) {
            let arr = []
            for (let item of copyAlarmColumns) {
              this.setClickLabelFeatures(item.attributes, arr, this.alarmColumnLabelLayer)
            }
            arr && this.setAlarmColumnLabelFeatures(arr)
          } else {
            this.setAlarmColumnLabelFeatures([])
          }
        })
      } else {
        this.setAlarmColumnList([])
        this.setAlarmColumnLabelFeatures([])
      }
      // 巡更点位
      if (this.isKeepWatch) {
        this.getOneFloorPatrols(this.floorData._id).then(res => {
          let patrols = transPatrol.transFeatures(res, this.patrolLayer, this.mapMode)
          let copyPatrols = JSON.parse(JSON.stringify(patrols))
          this.setPatrolList(patrols)
          if (this.isShowName) {
            let arr = []
            for (let item of copyPatrols) {
              this.setClickLabelFeatures(item.attributes, arr, this.patrolLabelLayer)
            }
            arr && this.setPatrolLabelFeatures(arr)
          } else {
            this.setPatrolLabelFeatures([])
          }
        })
      } else {
        this.setPatrolList([])
        this.setPatrolLabelFeatures([])
      }
      // 网格
      if (this.isShowGrid) {
        this.getGridList({ id: this.floorData._id }).then(res => {
          let features = gridUtil.convertGridDatasToFeatures(res)
          // let CopyFeatures = JSON.parse(JSON.stringify(features))
          this.setGridList(features)
          this.setGridLabelList(res)
          if (this.isShowName) {
            for (let item of this.gridLabelFeatureList) {
              this.setCurrentGrid3D(item)
            }
          } else {
            this.DETEL_CURRENT_GRID_3D() // 网格
          }
        })
      } else {
        this.setGridList([])
        this.DETEL_CURRENT_GRID_3D() // 网格
      }
      // 视频
      if (this.videoCheckedList.length) {
        this.loadDefaultMapResourcePoint({
          tab: mapUtils.TABTYPE.video,
          sid: this.floorData._id,
          channelTypes: mapUtils.pointTypes.vedio
        }).then(res => {
          let videoArr = res.filter(item => this.videoCheckedList.includes(item.monitortype))
          let vedios = videoTrans.transIconFeatures(videoArr, this.videoLayer, 0, this.mapMode)
          this.setVideoList(vedios)
          let copyVedios = JSON.parse(JSON.stringify(vedios))
          if (this.isShowName) { // 如果勾选名称标签
            if (this.isCameraSpear) { // 枪机
              let arr = []
              let filterFeature = copyVedios.filter(item => item.attributes.sRType === VIDEOTYPEKEY.boltipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.boltipcLabelLayer)
              }
              arr && this.setBoltipcLabelFeatures(arr)
            } else {
              this.setBoltipcLabelFeatures([])
            }
            if (this.isHalfBall) { // 点位-半球
              let arr = []
              let filterFeature = copyVedios.filter(item => item.attributes.sRType === VIDEOTYPEKEY.halfBallipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.halfBallipcLabelLayer)
              }
              arr && this.setHalfBallipcLabelFeatures(arr)
            } else {
              this.setHalfBallipcLabelFeatures([])
            }
            if (this.isFastBall) { // 点位-快球
              let arr = []
              let filterFeature = copyVedios.filter(item => item.attributes.sRType === VIDEOTYPEKEY.fastBallipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.fastBallipcLabelLayer)
              }
              arr && this.setFastBallipcLabelFeatures(arr)
            } else {
              this.setFastBallipcLabelFeatures([])
            }
            if (this.isFullShot) { // 点位-全景
              let arr = []
              let filterFeature = copyVedios.filter(item => item.attributes.sRType === VIDEOTYPEKEY.allViewipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.allViewipcLabelLayer)
              }
              arr && this.setAllViewipcLabelFeatures(arr)
            } else {
              this.setAllViewipcLabelFeatures([])
            }
            if (this.isInfrared) { // 点位-红外枪机
              let arr = []
              let filterFeature = copyVedios.filter(item => item.attributes.sRType === VIDEOTYPEKEY.redBoltipc)
              for (let item of filterFeature) {
                this.setClickLabelFeatures(item.attributes, arr, this.redBoltipcLabelLayer)
              }
              arr && this.setRedBoltipcLabelFeatures(arr)
            } else {
              this.setRedBoltipcLabelFeatures([])
            }
          } else {
            this.setBoltipcLabelFeatures([])
            this.setHalfBallipcLabelFeatures([])
            this.setFastBallipcLabelFeatures([])
            this.setAllViewipcLabelFeatures([])
            this.setRedBoltipcLabelFeatures([])
          }
        })
      } else {
        this.setVideoList([])
        this.setBoltipcLabelFeatures([])
        this.setHalfBallipcLabelFeatures([])
        this.setFastBallipcLabelFeatures([])
        this.setAllViewipcLabelFeatures([])
        this.setRedBoltipcLabelFeatures([])
      }
    },
    // 设置点击事件视频悬浮显示名称要素
    setClickLabelFeatures(attr, arr, labelLayer) {
      let labelFeature = featureBase.getHoverLabelFeature(attr, labelLayer)
      arr.push(labelFeature)
    },
    displayAllResourcePoint() {
      // 获取辅助杆列表
      let info = this.activeAlarmInfo3D && JSON.parse(JSON.stringify(this.activeAlarmInfo3D))
      const alarmId = info && (info.chanId || info.channelId || (info.bondCarmerRes && info.bondCarmerRes._id) || info._id || (info.message && info.message._id) || (info.uniqueId || info._id || info.uid) || (info.point3D && info.point3D._id))
      console.log('选中的报警资源标识：', alarmId)
      this.getAssistHoleList()
        .then(res => {
          res.forEach((res, index) => {
            res.type = mapUtils.CHANNELTYPE.assist
          })
          utils.addEntitysToMap(this.keyTypes.pole, res, this.mapMode, this.context, false)
          if (this.isShowName) {
            let vaildHole = res.filter(item => item.hasOwnProperty('name'))
            for (let item of vaildHole) {
              let locValues = item.loc.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              let labelEntity = utils.addLabel(this.context, position, item.name, item._id, 'assistClick')
              mapUtils.entitys.labels.push(labelEntity)
            }
          } else {
            let labels = mapUtils.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        })
        .catch(err => {
          console.log('获取辅助杆列表数据失败：', err)
        })
      if (this.isFire) {
        this.loadDefaultMapResourcePoint({ channelTypes: mapUtils.pointTypes.fireAlarm }).then(res => {
          let fireArr = res.filter(item => item._id !== alarmId)
          utils.addEntitysToMap(this.keyTypes.fireAlarm, fireArr, this.mapMode, this.context, false)
          if (this.isShowName) {
            for (let item of fireArr) {
              let locValues = item.point3D.loc.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              let labelEntity = utils.addLabel(this.context, position, item.name, item._id)
              mapUtils.entitys.labels.push(labelEntity)
            }
          } else {
            let labels = mapUtils.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        })
      }
      if (this.isAlarm) {
        this.loadDefaultMapResourcePoint({ channelTypes: mapUtils.pointTypes.commonAlarm }).then(res => {
          let commonArr = res.filter(item => item._id !== alarmId)
          utils.addEntitysToMap(this.keyTypes.commonAlarm, commonArr, this.mapMode, this.context, false)
          if (this.isShowName) {
            let labelEntity
            for (let item of commonArr) {
              let locValues = item.point3D.loc.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              if (item.type === 1) { // 普通报警
                labelEntity = utils.addLabel(this.context, position, item.name, item._id)
              } else { // 报警主机报警
                labelEntity = utils.addLabel(this.context, position, item.name, item._id)
              }
              mapUtils.entitys.labels.push(labelEntity)
            }
          } else {
            let labels = mapUtils.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        })
      }
      if (this.isKeepWatch) {
        this.getAllPatrolPoint().then(res => {
          let patrolArr = res.filter(item => item._id !== alarmId)
          utils.addEntitysToMap(this.keyTypes.patrol, patrolArr, this.mapMode, this.context, false)
          if (this.isShowName) {
            for (let item of patrolArr) {
              let locValues = item.point3D.geo.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              let labelEntity = utils.addLabel(this.context, position, item.devName, item._id)
              mapUtils.entitys.labels.push(labelEntity)
            }
          } else {
            let labels = mapUtils.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        })
      }
      if (this.isAlarmBox) {
        this.loadDefaultMapResourcePoint({
          tab: mapUtils.TABTYPE.alarmHelp,
          channelTypes: mapUtils.pointTypes.vedio
        }).then(res => {
          let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmBoxResource)
          let alarmBoxArr = result.filter(item => item._id !== alarmId)
          utils.addEntitysToMap(this.keyTypes.alarmBox, alarmBoxArr, this.mapMode, this.context, false)
          if (this.isShowName) {
            for (let item of alarmBoxArr) {
              let locValues = item.point3D.loc.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              let labelEntity = utils.addLabel(this.context, position, item.name, item._id)
              mapUtils.entitys.labels.push(labelEntity)
            }
          } else {
            let labels = mapUtils.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        })
      }
      if (this.isAlarmPillar) {
        this.loadDefaultMapResourcePoint({
          tab: mapUtils.TABTYPE.alarmHelp,
          channelTypes: mapUtils.pointTypes.vedio
        }).then(res => {
          let result = mapUtils.getAlarmBoxOrColumnByType(res, mapUtils.CHANNELTYPE.alarmColumnResource)
          let alarmColumnArr = result.filter(item => item._id !== alarmId)
          utils.addEntitysToMap(this.keyTypes.alarmColumn, alarmColumnArr, this.mapMode, this.context, false)
          if (this.isShowName) {
            for (let item of alarmColumnArr) {
              let locValues = item.point3D.loc.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
              let labelEntity = utils.addLabel(this.context, position, item.name, item._id)
              mapUtils.entitys.labels.push(labelEntity)
            }
          } else {
            let labels = mapUtils.entitys.labels
            for (const label of labels) { // 遍历楼宇名称标签
              this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        })
      }
      // 是否显示标签----
      this.getAllBuild().then(res => {
        /* res.forEach(item => {
           if (item.center && item.height) {
             let coValues = item.center.split(',').map(item => Number(item)) // 二维经纬度坐标数组
             let position = { lon: coValues[0], lat: coValues[1], height: item.height }
             let labelEntity = utils.addLabel(this.context, position, item.name)
             if (labelEntity) {
               mapUtils.entitys.labels.push(labelEntity)
             }
           }
         }) */
        if (this.isShowName) {
          res.forEach(item => {
            if (item.center && item.height) {
              let coValues = item.center.split(',').map(item => Number(item)) // 二维经纬度坐标数组
              let position = { lon: coValues[0], lat: coValues[1], height: item.height }
              let labelEntity = this.context.viewer.entities.getById(item.name)
              if (!labelEntity) {
                labelEntity = utils.addLabel(this.context, position, item.name, item._id, mapUtils.CHANNELTYPE.building)
                if (labelEntity) {
                  mapUtils.entitys.labels.push(labelEntity)
                }
              }
            }
          })
        } else {
          let labels = mapUtils.entitys.labels
          for (const label of labels) { // 遍历楼宇名称标签
            this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
          }
          mapUtils.entitys.labels = []
        }
      })
      // 是否显示在线单兵----
      /* if (this.isSinglePawn) {
      } */
      if (this.videoCheckedList.length) {
        this.loadDefaultMapResourcePoint({ tab: mapUtils.TABTYPE.video, channelTypes: mapUtils.pointTypes.vedio }).then(
          res => {
            if (res && res.length > 0) {
              let videoArr = res.filter(item => item._id !== alarmId && this.videoCheckedList.includes(item.monitortype))
              // let result = appResource.fitlerArrByTypes(videoArr, this.videoCheckedList)
              utils.addEntitysToMap(this.keyTypes.vedio, videoArr, this.mapMode, this.context, false)
              if (this.isShowName) {
                for (let item of videoArr) {
                  for (let item2 of mapUtils.entitys.vedio) {
                    if (item._id === item2._id) {
                      let locValues = item.point3D.loc.split(',').map(item => Number(item))
                      let position = { lon: locValues[0], lat: locValues[1], height: locValues[2] }
                      let labelEntity = utils.addLabel(this.context, position, item.name, item._id, mapUtils.CHANNELTYPE.vedioResource)// 'video'
                      mapUtils.entitys.labels.push(labelEntity)
                    }
                  }
                }
              } else {
                let labels = mapUtils.entitys.labels
                for (const label of labels) { // 遍历楼宇名称标签
                  this.context.viewer.entities.remove(label) // 实体集合中移除名称标签
                }
                mapUtils.entitys.labels = []
              }
            }
          }
        )
      }
    },
    // 增加视频弹框
    addVideoPreview(id) {
      this.getResourceById(id).then(res => {
        if (res.status) {
          let eid = res.eid
          if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
            this.updateVideoDragList(res)
          } else {
            this.warningMsg('该设备已禁用！')
          }
        } else {
          this.warningMsg('该设备不在线！')
        }
      })
    },
    async loadDefaultMapResourcePoint(param) {
      let result = []
      result = await this.getResourcePointsByChannelType(param)
      return result
    },
    // 根据拾取点位的类型跳转页面--------
    async switchDetailPage(id, type) {
      if (type === mapUtils.CHANNELTYPE.patrol) {
        let patrolData = await this.getSinglePatrolPoint(id)
        this.$emit('sendEvent', { type, data: patrolData })
      }
      if (
        type === mapUtils.CHANNELTYPE.vedioResource ||
        type === mapUtils.CHANNELTYPE.commonAlarmResource ||
        type === mapUtils.CHANNELTYPE.fireAlarmResource ||
        type === mapUtils.CHANNELTYPE.alarmHostResource ||
        type === mapUtils.CHANNELTYPE.alarmBoxResource ||
        type === mapUtils.CHANNELTYPE.alarmColumnResource
      ) {
        let resource = await this.getResourceById(id)
        if (type === mapUtils.CHANNELTYPE.vedioResource && this.isPointChooseStatus) {
          console.log(resource, 'resource')
          let repeat = false
          let previewPointLArr = JSON.parse(JSON.stringify(this.previewPointList))
          for (const key in previewPointLArr) {
            const item = previewPointLArr[key]
            if (item._id === resource._id) {
              repeat = true
              continue
            }
          }
          if (!repeat) {
            let pointResource = JSON.parse(JSON.stringify(resource))
            pointResource.ip = pointResource.eid.ip
            pointResource.port = pointResource.eid.cport
            pointResource.eid = pointResource.eid._id
            previewPointLArr.push(pointResource)
            console.log(pointResource, 'pointResource')
            this.setPreviewPointList(previewPointLArr)
            this.switchToolsPanel(true)
            this.changeToolsPanelToBoxChoose('boxChoose')
          }
        } else {
          this.$emit('sendEvent', { type, data: resource })
        }
      }
      if (type === mapUtils.CHANNELTYPE.grid) {
        let grid = await this.getMap3DOneGridById(id)
        this.$emit('sendEvent', { type, data: grid })
      }
      if (type === mapUtils.CHANNELTYPE.single) {
        let user = await this.getUserOne(id)
        if (this.isPointChooseStatus) {
          this.pushSelectSingleList(user.data)
          this.switchToolsPanel(true)
          this.changeToolsPanelToBoxChoose('boxChoose')
          return
        }
        this.$emit('sendEvent', { type, data: user })
      }
      if (type === 'singleAlarm') { // 单兵报警显示报警视频弹窗
        let currentData = this.singleAllList.find(item => item.uniqueId === id)
        let components = this.$parent.$children // 查询所有同级组件
        let locationToolComponent = components.find(item => item.$options['_componentTag'] === 'PanelTools')
        let machToolComponent = locationToolComponent.$children.find(item => item.$options['_componentTag'] === 'IndividualPolice')
        if (currentData) {
          machToolComponent.videoCall(currentData)
        }
      }
      if (type === 'patrolAlarm') { // 巡更报警显示报警视频弹窗
        let currentData = this.singleAllList.find(item => item._id === id)
        let components = this.$parent.$children // 查询所有同级组件
        let locationToolComponent = components.find(item => item.$options['_componentTag'] === 'PanelTools')
        let machToolComponent = locationToolComponent.$children.find(item => item.$options['_componentTag'] === 'IndividualPolice')
        if (currentData) {
          machToolComponent.deal(currentData)
        }
      }
      if (type === 'alarmInput') { // 普通报警显示报警视频弹窗
        let currentData = this.normalAlarmList.find(item => item.chanId === id)
        let components = this.$parent.$children // 查询所有同级组件
        let locationToolComponent = components.find(item => item.$options['_componentTag'] === 'PanelTools')
        let machToolComponent = locationToolComponent.$children.find(item => item.$options['_componentTag'] === 'AlarmList')
        if (currentData) {
          machToolComponent.openModal(currentData)
        }
      }
      if (type === 'alarmMoveSense') { // 视频报警显示报警视频弹窗
        let currentData = this.videoAlarmList.find(item => item.chanId === id)
        let components = this.$parent.$children // 查询所有同级组件
        let locationToolComponent = components.find(item => item.$options['_componentTag'] === 'PanelTools')
        let machToolComponent = locationToolComponent.$children.find(item => item.$options['_componentTag'] === 'VideoAlarm')
        if (currentData) {
          machToolComponent.openModal(currentData)
        }
      }
      // 智能报警显示报警视频弹窗
      if (type === 'perimeter' || type === 'faceControl' || type === 'vioRetrograde' || type === 'vioPark' || type === 'vioTurnLeft' || type === 'vioTurnRight') {
        let currentData = this.intelligentAlarmList.find(item => item.channelId === id)
        let components = this.$parent.$children // 查询所有同级组件
        let locationToolComponent = components.find(item => item.$options['_componentTag'] === 'PanelTools')
        let machToolComponent = locationToolComponent.$children.find(item => item.$options['_componentTag'] === 'IntelligentAlarm')
        if (currentData) {
          machToolComponent.openModal(currentData)
        }
      }
      if (type === 'fireAlarm') { // 消防报警 显示报警视频弹窗
        let currentData = this.fireAlarmList.find(item => item.channelId === id)
        let components = this.$parent.$children // 查询所有同级组件
        let locationToolComponent = components.find(item => item.$options['_componentTag'] === 'PanelTools')
        let machToolComponent = locationToolComponent.$children.find(item => item.$options['_componentTag'] === 'FireAlarmList')
        if (currentData) {
          machToolComponent.openModal(currentData)
        }
      }
      // 报警求助 显示报警视频弹窗
      console.log(type, id)
      console.log(this.alarmHelpList)
    },
    // 获取点位浮层信息

    async getSwitchFloatDetail(id, type, coordinats) {
      if (
        type === mapUtils.CHANNELTYPE.vedioResource || // 视频
        type === mapUtils.CHANNELTYPE.commonAlarmResource || // 普通报警
        type === mapUtils.CHANNELTYPE.fireAlarmResource || // 消防报警
        type === mapUtils.CHANNELTYPE.alarmHostResource || // 报警主机报警
        type === mapUtils.CHANNELTYPE.alarmBoxResource || // 报警箱
        type === mapUtils.CHANNELTYPE.alarmColumnResource // 报警柱
      ) {
        let resource = await this.getResourceByIdWithoutUpdateState(id)
        let locValues = resource.point3D.loc.split(',').map(item => Number(item))

        let position = { lon: coordinats[0], lat: coordinats[1], height: locValues[2] }
        if (mapUtils.entitys.labels.length === 0) {
          let labelEntity = utils.addLabel(this.$context, position, resource.name, resource._id, type)
          // mapUtils.entitys.labels = []
          mapUtils.entitys.labels.push(labelEntity)
        }
      } else if (type === mapUtils.CHANNELTYPE.patrol) { // 巡更
        let resource = await this.getSinglePatrolPointWithoutUpdateState(id)
        let locValues = resource.point3D.geo.split(',').map(item => Number(item))
        // eslint-disable-next-line standard/object-curly-even-spacing
        let position = { lon: coordinats[0], lat: coordinats[1], height: locValues[2]}
        if (mapUtils.entitys.labels.length === 0) {
          let labelEntity = utils.addLabel(this.$context, position, resource.devName, resource._id, mapUtils.CHANNELTYPE.patrol)
          // mapUtils.entitys.labels = []
          mapUtils.entitys.labels.push(labelEntity)
        }
      } else if (type === mapUtils.CHANNELTYPE.assist) { // 辅助杆
        let resource = await this.getAssistHoleByIdWithoutUpdateState(id)
        let locValues = resource.loc.split(',').map(item => Number(item))
        let position = { lon: coordinats[0], lat: coordinats[1], height: locValues[2] }
        if (mapUtils.entitys.labels.length === 0) {
          let labelEntity = utils.addLabel(this.$context, position, resource.name, resource._id, mapUtils.CHANNELTYPE.assist)
          //  mapUtils.entitys.labels = []
          mapUtils.entitys.labels.push(labelEntity)
        }
      }
    },
    // 单击楼层平面地图的回调方法
    mapClickEvt(evt) {
      if (this.measureLayer.actived) { // 室内量算时，阻止点击事件冒泡
        return
      }
      let attributes = evt.attributes
      if (attributes && attributes.id) { // 选中要素
        if (this.attrInfo && this.attrInfo.data && this.attrInfo.data._id !== attributes.id) {
          this.setHighLightList([]) // 清空高亮要素
          this.setHighLightLabelList(null)
        } else if (attributes && attributes.mapsign && (attributes.mapsign.signtype === 1 || attributes.mapsign.signtype === 2)) {
          this.highLightSelectedAreaFeature(attributes)
        } else {
          this.highLightSelectedFeature(attributes)
        }
        let attrType = attributes.hasOwnProperty('rType') ? attributes.rType : attributes.type
        // 根据点位类型切换属性面板，显示点位的属性--------
        this.switchDetailPage(attributes.id, attrType)
      } else { // 未选中要素时，显示楼层属性面板信息
        this.$emit('sendEvent', { type: 'floor', data: JSON.parse(JSON.stringify(this.floorData)) })
      }
    },
    highLightSelectedAreaFeature(attr) { // 面绘制完后定位
      if (attr.id && attr.loc) {
        let centerCoordinates = spaceUtil.getMultiLineStringCenter(attr.loc)
        if (centerCoordinates) {
          let feature = highLight.getLocateFeature(attr.id, centerCoordinates)
          this.setHighLightList([feature])
        }
      }
    },
    mapMoveEvt(evt) {
      if (this.isShowName) { // 如果勾选名称标签拦截移动事件
        return
      }

      if (evt.attributes) {
        let attr = JSON.parse(JSON.stringify(evt.attributes))
        if (attr.hasOwnProperty('rType')) {
          switch (attr.rType) { // 判断要素资源
            case RESOURCETYPE.video: // 视频
              this.handleHoverVideoFeature(attr)
              break
            case RESOURCETYPE.commonAlarm: // 普通报警
              this.handleHoverCommonAlarmFeature(attr)
              break
            case RESOURCETYPE.fireAlarm: // 消防报警
              this.handleHoverFireAlarmFeature(attr)
              break
            case RESOURCETYPE.alarmHost: // 报警主机报警
              this.handleHoverAlarmHostFeature(attr)
              break
            case RESOURCETYPE.alarmBox: // 报警箱
              this.handleHoverAlarmBoxFeature(attr)
              break
            case RESOURCETYPE.alarmColumn: // 报警柱
              this.handleHoverAlarmColumnFeature(attr)
              break
            case RESOURCETYPE.patrol: // 巡更
              this.handleHoverPatrolFeature(attr)
              break
              /* case RESOURCETYPE.doorControl: // 门禁
              this.handleHoverDoorControlFeature(attr)
              break */
              /* case RESOURCETYPE.single: // 单兵
              this.handleHoverSingleFeature(attr)
              break */
            case RESOURCETYPE.grid:
              this.handleHoverGridFeature(attr)
              break
              /* case RESOURCETYPE.building: // 建筑物
              this.handleHoverBuildingFeature(attr)
              break */
            /* case RESOURCETYPE.alarming: // 点位报警
              this.handleAlarmPointFeature(attr)
              break */
            default:
              break
          }
        } else { // 网格
          let { id } = attr
          if (this.highLightLabelList) {
            if (id === this.highLightLabelList._id) {
              this.handleHoverHighLightGridFeature(this.highLightLabelList)
            } else {
              let currentData = this.gridLabelFeatureList.find(item => item._id === id)
              this.handleHoverGridFeature(currentData)
            }
          } else {
            let currentData = this.gridLabelFeatureList.find(item => item._id === id)
            this.handleHoverGridFeature(currentData)
          }

          /* this.getMap3DOneGridById(id).then(res => {
            this.handleHoverGridFeature(res)
          }, err => {
            console.log(err)
          }) */
        }
      } else {
        this.clearVideoHoverFeatures() // 清空视频悬浮显示要素
        this.clearGridHoverFeatures() // 清空网格悬浮显示要素
        this.clearHighLightGridHoverFeatures()
        this.clearCommonAlarmHoverFeatures() // 清空普通报警悬浮显示要素
        this.clearFireAlarmHoverFeatures() // 清空消防报警悬浮显示要素
        this.clearAlarmBoxHoverFeatures() // 清空报警箱悬浮显示要素
        this.clearAlarmColumnHoverFeatures() // 清空报警柱悬浮显示要素
        this.clearPatrolHoverFeatures() // 清空巡更悬浮显示要素
      }
    },
    highLightSelectedFeature(attr) { // 高亮选中的要素
      // console.log('高亮选中的要素：', this.attrInfo)
      if (attr.id && attr.loc) {
        let coods = attr.loc.split(',').map(item => Number(item))
        let feature = highLight.getLocateFeature(attr.id, coods)
        this.setHighLightList([feature])
        this.setHighLightLabelList(this.attrInfo.data)
      }
    },
    // 楼层平面地图加载完成调用的方法
    getMap(obj) {
      Vue.prototype.$context2D = obj // 绑定2D地图引擎
      this.handleSelectedFeature() // 处理选择树节点
      // 切换到楼层平面地图后，如果报警要素列表中有值，楼层平面地图中的点位接收到报警，点位的闪烁----
      if (this.allAlarmingFeatureList.length) {
        this.allAlarmingFeatureList = this.$lodash.cloneDeep(this.alarmingFeatureList)
        this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render()
      }
      this.locationToCenter()
    },
    handleSelectedFeature() { // 处理选择树节点
      if (this.attrInfo && this.attrInfo.data && this.attrInfo.type === 'AttrGrid') { // 网格
        let gridData = JSON.parse(JSON.stringify(this.attrInfo.data))
        if (this.floorData && gridData.sid === this.floorData._id) { // 网格在当前楼层
          let features = gridUtil.convertGridDatasToFeatures([gridData])
          this.setHighLightList(features)
          this.setHighLightLabelList(gridData)
          if (this.isShowName) {
            this.setCurrentHighLightGrid(gridData)
          } else {
            this.DETEL_HIGHLIGHT_LABEL_TEXT()
          }
          let center = gridData.center.split(',').map(item => Number(item))
          this.$context2D && this.$context2D.map.getView().setCenter(center)
        } else {
          this.CHANGE_IS_SHOW_PT_ATTR(false)
        }
      }
    },
    getType(data) {
      let type
      if (data.alarmInfo) {
        if (data.alarmInfo.machineType) {
          type = data.alarmInfo.machineType
        } else {
          type = data.alarmInfo.eventType
        }
      } else {
        type = 'patrolAlarm'
      }
      return type
    },
    addAlarmingFloorPoint(data, id, type) {
      let fea
      let alarmingFea = JSON.parse(JSON.stringify(this.alarmingFeatureList))
      let repeat = false
      alarmingFea.forEach((item, index) => {
        if (item.attributes.id === id) {
          repeat = true
        }
      })
      if (!repeat) {
        if (type === 'commonAlarm') {
          fea = utils.addAlarmingFea(data, 'alarmInput')
        } else if (type === 'patrolAlarm') {
          fea = utils.addAlarmingFea(data, 'patrol')
        } else if (type === 'acceptHelp' || type === 'askHelp') {
          fea = utils.addAlarmingFea(data, 'alarmBox')
        } else if (type === 'fireFailure') {
          fea = utils.addAlarmingFea(data, 'fireAlarm')
        } else { // fireAlarm 视频类型 alarmInput alarmBox (alarmZone)
          fea = utils.addAlarmingFea(data, type)
        }
        if (fea) {
          alarmingFea.push(fea)
          this.setAlarmingList(alarmingFea)
        }
      }
    },
    // 楼层平面图点位闪烁调用的方法---胡红勋添加
    alarmingTwinkEvt() {
      if (this.alarmingFeatureList.length > 0) {
        this.index = this.index >= 120 ? 0 : this.index
        let num = this.index % 30
        if (num < 5) {
          // this.setAlarmingList([])
          this.allAlarmingFeatureList = []
        } else {
          this.allAlarmingFeatureList = this.$lodash.cloneDeep(this.alarmingFeatureList)
        }
        this.index++
        this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render()
      }
    },
    // 三维绘制工具绘制范围完成后调用----
    drawFinish(res) {
      let wkt = ''
      let sid = ''
      if (this.is3DMapOuter) {
        this.set3DActiveDraw(false)
        if (res && res.result.object.positions.length > 0) {
          let postion = []
          res.result.object.positions.forEach(item => {
            let loc = this.context.Cesium.Cartographic.fromCartesian(item)
            let longitude = this.context.Cesium.Math.toDegrees(loc.longitude)
            let latitude = this.context.Cesium.Math.toDegrees(loc.latitude)
            postion.push([longitude, latitude])
          })
          let location = []
          if (postion.length) {
            postion.forEach(item => {
              location.push(item.join(' '))
            })
          }
          let endPoint = location[0]
          wkt = 'MULTIPOLYGON(((' + location.join(',') + ',' + endPoint + ')))'
          console.log('绘制的范围字符串：' + wkt)
        }
      } else {
        sid = this.floorData._id
        wkt = res.wkt
        this.set2DAreaDraw(false)
      }
      this.get3DSelectBoxData({ wkt, sid })
        .then(() => {
          if (this.is3DMapOuter) {
            this.selectedEntitys.forEach(elem => {
              elem.model.color = this.context.Cesium.Color.WHITE
            })
            this.selectedEntitys = []
            this.selectBoxVideoData.forEach(res => {
              let _entity = mapUtils.getVedioEntityById(res._id)
              if (_entity) {
                this.selectedEntitys.push(_entity)
                _entity.model.color = this.context.Cesium.Color.RED
              }
            })
            this.selectBoxSingleData.forEach(res => {
              let _entity = mapUtils.getVedioEntityById(res._id)
              if (_entity) {
                this.selectedEntitys.push(_entity)
                _entity.model.color = this.context.Cesium.Color.RED
              }
            })
            if (this.selectedEntitys.length) {
              this.context.viewer.zoomTo(this.selectedEntitys)
            }
          }
          this.changeToolsPanelToBoxChoose('boxChoose')
          // this.$refs.selectBoxVideoModal.openModal(this.$lodash.cloneDeep(this.selectBoxVideoData))
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 三维绘制工具激活后调用
    handlerActiveDraw() { },
    // 单击回退按钮调用的方法---
    rebackOuter() { },
    // 打开要素气泡框---韩杰---2018-10-25 18:04:09
    openFeaturePopup(entity) {
      // if (entity) {
      //   this.setShowPopup(true)
      //   let cartesian3Co = entity.position._value
      //   let cartesian2Co = this.context.Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.context.viewer.scene, cartesian3Co) // 世界坐标转换为屏幕坐标
      //   console.log('选中要素的位置：', cartesian3Co.toString())
      //   let entityObj = {name: entity.name, position: entity.position._value}
      //   this.setSelectedEntity(entityObj)
      //   this.setSelectedEntityScreenCo(cartesian2Co)
      // } else {
      //   this.setShowPopup(false)
      // }
      // this.setIsOuter(true)
    },
    // 关闭要素弹出气泡---韩杰---2018-10-25 18:06:38
    closePopup() {
      this.setShowPopup(false)
      this.setSelectedEntity({})
      this.setSelectedEntityScreenCo({})
    },
    closeSelectModel() {
      if (this.is3DMapOuter) {
        this.clearExtentDraw = true
        this.selectedEntitys.forEach(elem => {
          elem.model.color = this.context.Cesium.Color.WHITE
        })
      }
      this.setIsBoxChoosePreview(false)
      this.setPreviewPointList([])
      this.setAreaDialogShow(false)
    },
    locationToCenter() {
      if (this.activeAlarmInfo3D) { // 点击报警消息定位
        if (this.activeAlarmInfo3D.alarmTypeToMap === 'singleAlarm') { return }
        let info = JSON.parse(JSON.stringify(this.activeAlarmInfo3D))
        const item = info.map3D || info.point3D || (info.bondCarmerRes && info.bondCarmerRes.point3D) || (info.message && info.message.point3D)
        if (!item) { return }
        if (item.isouter) {
          const id = info.chanId || info.channelId || (info.bondCarmerRes && info.bondCarmerRes._id) || info._id || (info.message && info.message._id) || (info.uniqueId || info._id || info.uid) || (info.point3D && info.point3D._id)
          utils.focueOnALarm(id, this.$context)
        } else {
          const loc = (item.geo || item.loc).split(',').map(item => Number(item))
          this.$context2D && this.$context2D.map.getView().setCenter(loc)
        }
      }
    }
  },
  mounted() {
    this.keyTypes = mapUtils.getKeyType()
    this.getMap3DParamConfig()
    this.getLayerSettingsList() // 获取图层设置信息
  },
  beforeDestroy() {
    this.setReady(false)
    this.relieveMapListeners() // 解除地图监听
    this.context && this.context.viewer.destroy()
  }
}
</script>

<style>
</style>
