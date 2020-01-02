<!-- 模型预览组件 -->
<template>
  <div class="previewer">
    <sm-viewer v-if="map3DConfig && groundLayer" cesiumPath="/static/supermap3d" ref="tdMap" :navigation="false" @ready="loadViewerReady">
    </sm-viewer>
    <div v-if="!map3DConfig" class="msg-tip"><span>请先配置3D地图服务</span></div>
    <div v-if="!hasGroundInView" class="msg-tip"><span>请先设置地面图层</span></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import utils from 'assets/3DMap/utils/index.js'
import mapUtil from 'assets/3DMap/mapUtil.js'
import Handle from './handle'
export default {
  name: 'ModelPreview',
  mixins: [Handle],
  data() {
    return {
      isMapReady: false,
      hasGroundInView: false, // 三维视图中是否有地面
      modelEntities: [], // 模型实体数组
      alarmingEntities: [], // 报警模型数组
      groundLayer: null, // 地面图层
      twinkleCounter: 0 // 闪烁计数器
    }
  },
  computed: {
    ...mapState({
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      layerSettingsMap: ({ tdIndex }) => tdIndex.layerSettingsMap // 图层设置map(key: 图层名称， value: 图层设置信息)
    })
  },
  created() {
    this.getMap3DParamConfig() // 获取3D地图服务配置
    this.getGroundLayerSettings().then(res => {
      console.log('获取到的地面图层设置信息：', res)
      if (res && res !== 'null') {
        this.groundLayer = res
      }
    }).catch(err => {
      console.log('获取地面图层设置信息失败：', err)
    })
    this.getLayerSettingsList() // 获取图层设置信息
  },
  methods: {
    ...mapActions([
      'getMap3DParamConfig',
      'getLayerSettingsList',
      'getGroundLayerSettings'
    ]),
    loadViewerReady(param) {
      let { viewer, Cesium } = param
      // 去掉地图上的商标
      let widget = viewer.cesiumWidget
      if (widget.creditContainer) {
        widget.creditContainer.style.display = 'none'
      }
      var scene = viewer.scene
      var { mapUrl, perspective } = this.map3DConfig
      try {
        var promise = scene.open(mapUrl)
        Cesium.when(promise, layers => {
          if (this.groundLayer) {
            let scenelayer = scene.layers.find(this.groundLayer.name)
            if (scenelayer) {
              this.hasGroundInView = true
              this.adjustSceneByLayerSettings() // 根据图层设置信息调整场景
              if (perspective) { // 有视角信息时，地图定位到给定视角
                viewer.camera.setView({
                  destination: Cesium.Cartesian3.fromDegrees(perspective.longitude, perspective.latitude, perspective.height),
                  orientation: {
                    heading: Cesium.Math.toRadians(perspective.heading),
                    pitch: Cesium.Math.toRadians(perspective.pitch),
                    roll: Cesium.Math.toRadians(perspective.roll)
                  }
                })
              } else { // 无视角信息时地图缩放到显示图层
                viewer.zoomTo(scenelayer)
              }
              viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK) // 移除默认双击事件
              viewer.scene.postRender.addEventListener(this.handleScenePostRender) // 视图场景更新事件
              this.isMapReady = true
              this.$emit('mapReady', param)
            }
          }
        })
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          var title = '渲染时发生错误，已停止渲染。'
          widget.showErrorPanel(title, undefined, e)
        }
      }
    },
    adjustSceneByLayerSettings() { // 根据图层设置信息调整场景
      let { viewer, Cesium } = this.$refs.tdMap
      let layers = viewer.scene.layers.layerQueue
      for (const settings of this.layerSettingsMap.values()) {
        let layer = viewer.scene.layers.find(settings.name)
        if (layer) { // 图层
          layer.selectedColor = settings.selected ? (settings.selectedColor ? Cesium.Color.fromCssColorString(settings.selectedColor) : Cesium.Color.FUCHSIA) : Cesium.Color.WHITE
          layer.hue = settings.hue
          layer.saturation = settings.saturation
          layer.brightness = settings.brightness
        } else if (settings.name === 'viewer') { // 视图
          let skyAtmosphere = viewer.scene.skyAtmosphere
          if (skyAtmosphere) {
            skyAtmosphere.hueShift = settings.hue
            skyAtmosphere.saturationShift = settings.saturation
            skyAtmosphere.brightnessShift = settings.brightness
          }
        }
      }
      for (let i = 0; i < layers.length; i++) { // 遍历视图的图层，只显示地面图层
        let layer = layers[i]
        layer.clearMemoryImmediately = false // 图层关闭释放视野之外的设置
        if (layer._name !== this.groundLayer.name) {
          layer.visible = false
        }
      }
    },
    changeModelBrightness(brightness) { // 改变模型亮度
      if (this.modelEntities && this.modelEntities.length > 0) {
        let { viewer, Cesium } = this.$refs.tdMap
        for (let modelEntity of this.modelEntities) {
          if (modelEntity.existModel) {
            let colorParam = utils.getModelExtraColorParam(Cesium, brightness) // 获取模型附加颜色参数
            modelEntity.model.color = colorParam.color
            modelEntity.model.colorBlendAmount = colorParam.amount
          }
        }
        viewer.zoomTo(this.modelEntities)
      }
    },
    changeModelHeight(heightPlus) { // 改变模型高度
      if (this.modelEntities && this.modelEntities.length > 0) {
        let { viewer, Cesium } = this.$refs.tdMap
        for (let modelEntity of this.modelEntities) {
          let position = modelEntity.position._value
          let cartographic = Cesium.Cartographic.fromCartesian(position) // 经纬度高度对象
          cartographic.height = heightPlus
          let newPosition = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
          modelEntity.position = newPosition // 修改模型位置
        }
        viewer.zoomTo(this.modelEntities)
      }
    },
    changeModelScale(scale) { // 改变模型大小
      if (this.modelEntities && this.modelEntities.length > 0) {
        let { viewer } = this.$refs.tdMap
        for (let modelEntity of this.modelEntities) {
          modelEntity.model.scale = scale // 修改模型大小
        }
        viewer.zoomTo(this.modelEntities)
      }
    },
    clearEntityModels() { // 清空实体模型
      let { viewer } = this.$refs.tdMap
      viewer.entities.removeAll() // 视图中清空所有实体
      this.modelEntities = []
      this.alarmingEntities = []
    },
    addEntities(models) { // 添加资源模型
      let { viewer } = this.$refs.tdMap
      this.clearEntityModels() // 清空实体模型
      console.log('资源模型变化：', JSON.parse(JSON.stringify(models)))
      if (models && models.length > 0) {
        let centerCoordinats = this.getCenterCoordinats() // 获取视图中心点的经纬度高度坐标数组
        for (let i = 0; i < models.length; i++) {
          const model = models[i]
          let deltaX = i * mapUtil.RESOURCESTATUS.deltaXStep
          let wgs84Co = utils.getMovedLocation(centerCoordinats, deltaX, 0) // 获取经纬度坐标位置
          let [...location] = centerCoordinats // 深拷贝中心点经纬度坐标
          location[0] = wgs84Co[0] // 更新经度
          location[1] = wgs84Co[1] // 更新纬度
          this.addEntitiesByOid(model, location)
        }
      }
      viewer.zoomTo(this.modelEntities)
    }
  },
  beforeDestroy() {
    let { viewer } = this.$refs.tdMap
    viewer.destroy()
  }
}
</script>

<style scoped>
.previewer {
  width: 100%;
  height: 100%;
  position: relative;
}
.msg-tip {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font: normal bold 14px/30px Microsoft Yahe,sans-serif;
}
</style>
