// 地图基础控制逻辑
import Vue from 'vue'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { RESOURCETYPE, VIDEOTYPEKEY, CAMERATYPE, MPSIGNKEY } from 'assets/2DMap/meta/common'
import DrawTrack from 'assets/2DMap/utils/DrawTrack'
import SingleRealTrack from '../../alarmFun/singleTrack/SingleRealTrack'
import layerConfig from 'assets/2DMap/meta/layer'
import highLight from 'assets/2DMap/feature/edit/highLight'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
export default {
  data() {
    return {
      drawTrack: null, // 轨迹绘制工具（人员、车辆、巡更）
      singleRealTrack: null, // 单兵实时轨迹绘制工具
      measureLayer: JSON.parse(JSON.stringify(layerConfig.measure)), // 量算图层
      highLightAreaLayer: layerConfig.highLightArea,
      highLightLocateLayer: layerConfig.highLightLocateLayer,
      defaultZoom: 2,
      navZoomStyle: { // 地图导航缩放工具样式
        nav: { // 导航样式
          top: 'unset',
          left: 'unset',
          right: '70px',
          bottom: '425px'
        },
        zoom: { // 缩放样式
          top: 'unset',
          left: 'unset',
          right: '97px',
          bottom: '420px'
        }
      }
    }
  },
  computed: {
    ...mapGetters(['isMapOuter', 'toolVisible', 'measureMode2D', 'locateAreaFeatures', 'locateFeatures', 'selectedMapPointRes', 'isBsMapReady']),
    ...mapGetters('map2DApplyIX', [
      'isNameTitle', // 名称标签
      'isGrid', // 网格
      'isBuilding', // 楼宇
      'gun', // 枪机
      'hemisphere', // 半球
      'fastBall', // 快球
      'panorama', // 全景
      'infraRed', // 红外枪机
      'verface', // 人脸抓拍
      'traffic', // 交通抓拍
      'visualField', // 可视域
      'alarm', // 普通报警
      'fireControl', // 消防报警
      'alarmColumn', // 报警柱
      'alarmBox', // 报警箱
      'isPoint', // 巡更
      'removeSingle', // 移动单兵
      'singlePic', // 单兵头像
      'singleIdList', // 显示分组单兵标识列表
      'isDoorControl' // 门禁
    ]),
    olLib() {
      return this.$context2D ? this.$context2D.ol : null
    },
    map() {
      return this.$context2D ? this.$context2D.map : null
    }
  },
  watch: {
    isNameTitle: { // 名称标签显隐
      handler(flag) {
        this.controlNameTitleShow() // 控制名称标签的显隐
      },
      immediate: true
    },
    measureMode2D: {
      handler(newMode) {
        if (newMode && newMode.type) {
          this.measureLayer.actived = newMode.panelVisible && newMode.isMeasure
          this.measureLayer.type = newMode.type
          if (!newMode.panelVisible) { // 隐藏量算面板时，清空量算绘制内容
            this.measureLayer.clear = true
          }
        }
      },
      deep: true
    },
    measureLayer: {
      handler(measure) {
        if (!measure.actived && this.measureMode2D.isMeasure) {
          this.changeMeasureActived2D(false)
        }
      },
      deep: true
    },
    selectedMapPointRes: { // 选中地图资源数据变化
      handler(res) {
        if (res) {
          let data = JSON.parse(JSON.stringify(res))
          this.locateSelectedMapPointRes(data) // 定位选择的地图资源点位
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_SHOW_MAP_RESOURCE_ATTRIBUTES', 'SET_LOCATE_AREA_FEATURES', 'SET_LOCATE_FEATURES']),
    ...mapActions(['changeMeasureActived2D']),
    bsMapReady(param) { // 地图加载完成处理
      Vue.prototype.$context2D = param
      this.setIsBSMapReady(true)
      this.isMapOuter && this.changeControlsPosition()
      let zoom = Math.ceil(param.map.getView().getZoom())
      this.setMapZoom(zoom) // 设置地图缩放级别
      this.loadQueryVideos() // 加载查询视频数据
      if (this.isMapOuter) {
        this.drawTrack = new DrawTrack(param)
        this.singleRealTrack = new SingleRealTrack(param)
      }
      this.handleSelectFeature() // 处理选择要素
    },
    handleSelectFeature() { // 处理选择要素
      if (this.currentGrid && this.selectedTreeNode && this.selectedTreeNode.type === RESOURCETYPE.grid) {
        this.handleSelectGrid(this.currentGrid) // 处理选择网格节点
      } else if (this.currentBuilding && this.selectedTreeNode && this.selectedTreeNode.type === RESOURCETYPE.building) {
        this.handleSelectBuilding(this.currentBuilding) // 处理选择楼宇节点
      } else if (this.selectedMapPointRes && this.selectedTreeNode && this.selectedTreeNode.type === RESOURCETYPE.video) {
        // 点位与当前地图一致时
        if ((this.isMapOuter && !this.selectedMapPointRes.point.sid) || (this.currentFloor && !this.selectedMapPointRes.point.isouter && this.selectedMapPointRes.point.sid === this.currentFloor._id)) {
          let data = JSON.parse(JSON.stringify(this.selectedMapPointRes))
          this.locateSelectedMapPointRes(data) // 定位选中地图资源
        } else {
          this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false) // 关闭资源属性面板
        }
      } else {
        this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false) // 关闭资源属性面板
      }
    },
    locateSelectedMapPointRes(data) { // 定位选中地图资源
      if (data && data._id && data.point) {
        if ((this.isMapOuter && !data.point.sid) || (this.currentFloor && !data.point.isouter && data.point.sid === this.currentFloor._id)) {
          // (地图在楼外，点位也在楼外时) 或 (楼层地图，点位在楼层地图，点位所在楼层时当前楼层时)
          this.locateSelectedPoint(data) // 定位选中点位
        } else {
          this.SET_LOCATE_FEATURES([])
        }
      } else {
        this.SET_LOCATE_FEATURES([])
      }
    },
    locateSelectedPoint(data) { // 定位选中点位
      if (data.point) {
        let center = data.point.geo || data.point.loc
        if (data.mapsign) {
          if (data.mapsign.signtype === MPSIGNKEY.lineString) {
            center = spaceUtil.getMultiLineStringCenter(center)
          } else if (data.mapsign.signtype === MPSIGNKEY.polygon) {
            center = spaceUtil.getMultiPolygonCenter(center)
          }
        }
        // console.log('定位选中点位位置：', center)
        let centerCoordinates = Array.isArray(center) ? center : center.split(',').map(item => Number(item))
        // console.log('定位选中点位位置坐标：', centerCoordinates)
        if (this.selectedTreeNode && this.selectedTreeNode.type === data.type && this.selectedTreeNode._id === data._id) { // 选中树节点，定位到地图中心
          this.locateInMapCenter(centerCoordinates)
        }
        let feature = highLight.getLocateFeature(data._id, centerCoordinates)
        this.SET_LOCATE_FEATURES([feature])
      }
    },
    initFeaturesShowByFlag() { // 初始化控制点位显隐
      this.loadQueryGrids() // 加载查询到的网格数据
      if (this.isMapOuter) { // 楼层外地图
        this.loadQueryBuildings() // 加载查询到的楼宇数据
        this.controlSingleShow() // 控制移动单兵显隐
      }
      this.loadQueryCommonAlarms() // 加载查询的普通报警数据
      this.loadQueryFireAlarms() // 加载查询的消防报警数据
      this.loadAlarmHostResources() // 加载报警主机资源数据
      this.loadAlarmColumnResources() // 加载报警柱点位资源
      this.loadAlarmBoxResources() // 加载报警箱点位资源
      this.loadQueryPatrols() // 加载查询的巡更数据
      this.loadDoorControlResources() // 加载门禁点位资源
    },
    controlNameTitleShow() { // 控制名称标签的显隐
      this.controlGridLabelShow() // 控制网格名称的显隐
      if (this.isMapOuter) { // 楼层外地图
        this.controlBuildingLabelShow() // 控制楼宇名称的显隐
      }
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机名称显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球名称显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球名称显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景名称显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机名称显隐
      this.controlSubVideoLabelShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍名称显隐
      this.controlSubVideoLabelShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍名称显隐
      this.controlCommonAlarmLabelShow() // 控制普通报警名称显隐
      this.controlFireAlarmLabelShow() // 控制消防报警名称显隐
      this.controlAlarmHostLabelShow() // 控制报警主机名称显示
      this.controlAlarmColumnLabelShow() // 控制报警柱名称显示
      this.controlAlarmBoxLabelShow() // 控制报警箱名称显示
      this.controlPatrolLabelShow() // 控制巡更名称的显隐
      this.controlDoorControlLabelShow() // 控制门禁名称的显隐
    },
    changeControlsPosition() { // 改变地图控制控件的位置
      if (this.$context2D) { // 判断地图记载完成,修改地图控制器的位置
        let controls = this.$context2D.map.getControls().getArray()
        for (const control of controls) {
          if (control.controlName === 'RotateControl') { // 地图旋转控制器
            let targets = document.getElementsByClassName(control.className)
            for (let target of targets) {
              target.style.top = this.toolVisible ? '10px' : '24px'
              target.style.right = this.toolVisible ? '70px' : '4px'
            }
          } else if (control.controlName === 'OverViewMap') { // 缩略图控制器
            let targets = document.getElementsByClassName(control.className)
            for (let target of targets) {
              target.style.right = this.toolVisible ? '64px' : '0px'
              target.style.bottom = '0px'
            }
          }
        }
        let targets = document.getElementsByClassName('ol-rotate')
        for (let target of targets) {
          target.style.display = 'none'
        }
      }
      // 修改地图导航缩放工具的位置
      this.navZoomStyle.nav.right = this.toolVisible ? '70px' : '4px'
      this.navZoomStyle.zoom.right = this.toolVisible ? '97px' : '31px'
    },
    handleOverViewMapReady(control) { // 处理地图缩略图组件加载完成
      // console.log('地图缩略图组件加载完成：', control)
      if (control && control.className) {
        let targets = document.getElementsByClassName(control.className)
        for (let target of targets) {
          target.style.right = this.toolVisible ? '64px' : '0px'
          target.style.bottom = '0px'
        }
      }
    },
    locateInMapCenter(center) { // 定位到地图中心
      if (this.$context2D) { // 判断地图记载完成，设置地图中心
        this.$context2D.map.getView().setCenter(center)
      }
    },
    getLayerById(layerId) { // 根据id获取图层
      let targetLayer = null
      if (this.$context2D) { // 判断地图记载完成,获取指定图层
        let layers = this.$context2D.map.getLayers().getArray()
        for (const layer of layers) {
          let id = layer.get('id')
          if (id === layerId) {
            targetLayer = layer
          }
        }
      }
      return targetLayer
    },
    clearFeaturesInLayer(layerId) { // 删除图层内的要素
      let layer = this.getLayerById(layerId)
      layer && layer.getSource().clear()
    },
    showFeaturesList(recourse, alarmList, type, subType) { // 报警闪烁时不显示普通点位或区域
      const alarmingArr = alarmList ? JSON.parse(JSON.stringify(alarmList)).slice(0, 20) : []
      const arr = []
      for (let i = 0; i < recourse.length; i++) {
        let tag = 0
        for (let j = 0; j < alarmingArr.length; j++) {
          const item = alarmingArr[j]
          if (item) {
            if (type === 'video' && (subType === VIDEOTYPEKEY[item.alarmTypeToMap] || item.alarmTypeToMap === 'faceAlarm') && (item.channelId === recourse[i]._id || item.chanId === recourse[i]._id || item.res === recourse[i]._id)) {
              tag++
              break
            } else if (type === 'building') {
              const soBid = item.bondCarmerRes && item.bondCarmerRes.point && item.bondCarmerRes.point.bid
              const id = soBid || (item.map2D && item.map2D.bid) || (item.point && item.point.bid)
              if (id === recourse[i]._id) {
                tag++
                break
              }
            } else if (type && item.alarmTypeToMap === type && ((item.bondCarmerRes && (item.bondCarmerRes._id === recourse[i]._id)) || (item.channelId && item.channelId === recourse[i]._id) || (item.chanId && item.chanId === recourse[i]._id) || (item._id && (item._id === recourse[i]._id || item._id === recourse[i].id)) || (item.uid && item.uid === recourse[i].id))) {
              tag++
              break
            }
          }
        }
        if (!tag) {
          arr.push(recourse[i])
        }
      }
      // console.log('点位图标过滤条件及结果', recourse, alarmList, type, subType, arr)
      return arr
    }
  }
}
