// 地图基础控制逻辑
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
export default {
  data() {
    return {
      highLightLocateLayer: layerConfig.highLightLocateLayer,
      defaultZoom: 2,
      navZoomStyle: { // 地图导航缩放工具样式
        nav: { // 导航样式
          top: '80px',
          left: '342px',
          right: 'unset',
          bottom: 'unset'
        },
        zoom: { // 缩放样式
          top: '130px',
          left: '364px',
          right: 'unset',
          bottom: 'unset'
        }
      }
    }
  },
  computed: {
    ...mapGetters('map2DEditIX', {
      isBoltipc: 'boltipc', // 枪机
      isRedBoltipc: 'redBoltipc', // 红外枪机
      isHalfBallipc: 'halfBallipc', // 半球
      isFastBallipc: 'fastBallipc', // 快球
      isAllViewipc: 'allViewipc', // 全景
      isVerface: 'verface', // 人脸抓拍
      isTraffic: 'traffic', // 交通抓拍
      isSector: 'sector', // 可视域
      isCommonAlarm: 'commonAlarm', // 普通报警
      isFireAlarm: 'fireAlarm', // 消防报警
      isAlarmColumn: 'alarmColumn', // 报警柱
      isAlarmBox: 'alarmBox', // 报警箱
      isPatrol: 'isPatrol', // 巡更
      isDoorControl: 'isDoorControl', // 门禁
      editTreeChangeCounter: 'editTreeChangeCounter' // 编辑树计数器
    })
  },
  watch: {
  },
  methods: {
    ...mapActions('map2DEditIX', ['changeEditTreeChangeCounter']),
    ...mapActions([
      'saveCommonPointRes' // 保存点位资源数据
    ]),
    bsMapReady(param) { // 地图加载完成处理
      Vue.prototype.$context2D = param
      this.setIsBSMapReady(true)
      this.isMapOuter && this.changeControlsPosition()
      let zoom = Math.ceil(param.map.getView().getZoom())
      this.setMapZoom(zoom) // 设置地图缩放级别
      this.locateSelectedFeature()
    },
    locateSelectedFeature() { // 定位到选中的要素
      if (this.selectedPointRes && this.selectedPointRes.point) {
        let data = JSON.parse(JSON.stringify(this.selectedPointRes))
        this.highlightLocateFeature(data)
      }
    },
    initShowFeatures() {
      if (this.isMapOuter) { // 楼外地图
        this.loadGridsByMapId(this.activeMapConfig.mapId) // 加载网格数据
        this.loadBuildingsByMapId(this.activeMapConfig.mapId) // 加载楼宇
      } else {
        if (this.currentFloor && this.currentFloor._id) {
          this.loadGridsByFloorId(this.currentFloor._id) // 加载楼内网格数据
        }
      }
      this.loadVideoResources() // 加载视频资源数据
      this.loadCommonAlarmResources() // 加载普通报警资源数据
      this.loadFireAlarmResources() // 加载消防报警资源数据
      this.loadAlarmHostResources() // 加载报警主机资源数据
      this.loadAlarmColumnResources() // 加载报警柱资源数据
      this.loadAlarmBoxResources() // 加载报警箱资源数据
      this.loadPatrolResources() // 加载巡更点位资源数据
      this.loadDoorControlResources() // 加载门禁点位资源数据
    },
    changeControlsPosition() { // 改变地图控制控件的位置
      if (this.$context2D) { // 判断地图记载完成,修改地图控制器的位置
        let controls = this.$context2D.map.getControls().getArray()
        for (const control of controls) {
          if (control.controlName === 'RotateControl') { // 地图旋转控制器
            let targets = document.getElementsByClassName(control.className)
            for (let target of targets) {
              target.style.top = '24px'
              target.style.left = this.leftPanelShow ? '340px' : '10px'
            }
          } else if (control.controlName === 'OverViewMap') { // 缩略图控制器
            let targets = document.getElementsByClassName(control.className)
            for (let target of targets) {
              target.style.right = '0px'
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
      this.navZoomStyle.nav.left = this.leftPanelShow ? '342px' : '12px'
      this.navZoomStyle.zoom.left = this.leftPanelShow ? '364px' : '34px'
    },
    handleOverViewMapReady(control) { // 处理地图缩略图组件加载完成
      // console.log('地图缩略图组件加载完成：', control)
      if (control && control.className) {
        let targets = document.getElementsByClassName(control.className)
        for (let target of targets) {
          target.style.right = '0px'
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
    getFeatureById(layerId, featureId) {
      let feature = null
      let layer = this.getLayerById(layerId)
      if (layer) {
        feature = layer.getSource().getFeatureById(featureId)
      }
      return feature
    },
    clearFeaturesInLayer(layerId) { // 删除图层内的要素
      let layer = this.getLayerById(layerId)
      layer && layer.getSource().clear()
    }
  }
}
