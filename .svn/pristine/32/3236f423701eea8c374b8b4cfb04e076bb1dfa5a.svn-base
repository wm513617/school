<template>
  <div>
    <div class="mapItem" v-for="(item) in mapConfigArr" :key="item.mapId" v-show="activeMapConfig.mapId === item.mapId">
      <bs-map  v-if="activeMapConfig.mapId === item.mapId" class="mapHome" :projection="mapProjection" :center="activeMapConfig.center" :extent="activeMapxtent || activeMapConfig.extent" :zoom="activeMapConfig.zoom || defaultZoom" :updateSize="isUpdate" @ready="bsMapReady" :resolutions="activeMapConfig.resolutions" :showRotate="true" @click="handleMapClick" @zoom="handleMapZoomChange" @mousemove="handkeMapMouseMove">
        <!-- geo蓝星 -->
        <div v-if="activeMapConfig.mapType === 'geoserver'">
          <bs-wtmslayer :url="activeMapConfig.mapUrl" :layerName="activeMapConfig.layerName" :gridNames="activeMapConfig.gridSets" :matrixSet="activeMapConfig.matrixSet" :showOverView="true" :origin="activeMapConfig.origin"></bs-wtmslayer>
        </div>
        <!-- 超图 -->
        <div v-if="activeMapConfig.mapType === 'iserver'">
          <bs-supermaplayer :url="activeMapConfig.mapUrl" :showOverView="true" @overViewMapReady="handleOverViewMapReady"></bs-supermaplayer>
        </div>
        <!-- 静态底图模式 -->
        <div v-if="activeMapConfig.mapType === 'static'">
          <bs-staticlayer :url="activeMapConfig.mapUrl" :showOverView="true" @overViewMapReady="handleOverViewMapReady"></bs-staticlayer>
        </div>
        <!-- 导航缩放工具 -->
        <bs-navzoombar :navZoomStyle="navZoomStyle"></bs-navzoombar>
        <!-- 点位资源矢量图层 -->
        <bs-layer v-for="(item) in layerArr" :key="item.key.id" :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
        <!-- 多边形要素绘制 -->
        <bs-draw :id="polygonDraw.id" ref="polygonDrawer" :name="polygonDraw.name" :type="polygonDraw.type" :actived="polygonDraw.actived" :drawStyle="polygonDraw.drawStyle" :layerStyle="polygonDraw.layerStyle" @drawend="drawPolygonEnd"></bs-draw>
        <!-- 线要素绘制 -->
        <bs-draw :id="lineStringDraw.id" :name="lineStringDraw.name" :type="lineStringDraw.type" :actived="lineStringDraw.actived" :drawStyle="lineStringDraw.drawStyle" :layerStyle="lineStringDraw.layerStyle" @drawend="drawLineStringEnd"></bs-draw>
        <!-- 点位要素绘制 -->
        <bs-draw :id="pointDraw.id" :name="pointDraw.name" :type="pointDraw.type" :actived="pointDraw.actived" :drawStyle="pointDraw.drawStyle" @drawend="drawPointEnd"></bs-draw>
        <!-- 要素编辑 -->
        <bs-edit :actived="editActive" :features="currentEditFeature" @modifystart="editFeatureStart" @modifyend="editFeatureEnd"></bs-edit>
      </bs-map>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getExtent } from 'assets/map/MapUtil.js'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import featureDrawCtrl from './ctrl/featureDraw'
import GridLayer from './layers/grid'
import BuildingLayer from './layers/building'
import VideoLayer from './layers/video'
import CommonAlarmLayer from './layers/commonAlarm'
import FireAlarmLayer from './layers/fireAlarm'
import AlarmHostLayer from './layers/alarmHost'
import AlarmColumnLayer from './layers/alarmColumn'
import AlarmBoxLayer from './layers/alarmBox'
import PatrolLayer from './layers/patrol'
import DoorControlLayer from './layers/doorControl'
export default {
  mixins: [ baseCtrl, eventCtrl, featureDrawCtrl, GridLayer, BuildingLayer, VideoLayer, CommonAlarmLayer, FireAlarmLayer, AlarmHostLayer, AlarmColumnLayer, AlarmBoxLayer, PatrolLayer, DoorControlLayer ],
  data() {
    return {
      activeMapxtent: null, // 当前地图边界
      isUpdate: true
    }
  },
  computed: {
    ...mapGetters(['isMapOuter', 'mapProjection', 'isBsMapReady', 'mapConfigArr', 'activeMapConfig', 'leftPanelShow', 'locateFeatures']),
    layerArr() {
      return [
        { key: this.gridLayer, value: this.grids }, // 网格
        { key: this.buildingLayer, value: this.buildings }, // 楼宇
        { key: this.boltipcLayer, value: this.boltipcs }, // 视频-枪机
        { key: this.boltipcSectorLayer, value: this.boltipcSectors },
        { key: this.halfBallipcLayer, value: this.halfBallipcs }, // 视频-半球
        { key: this.halfBallipcSectorLayer, value: this.halfBallipcSectors },
        { key: this.fastBallipcLayer, value: this.fastBallipcs }, // 视频-快球
        { key: this.fastBallipcSectorLayer, value: this.fastBallipcSectors },
        { key: this.allViewipcLayer, value: this.allViewipcs }, // 视频-全景
        { key: this.allViewipcSectorLayer, value: this.allViewipcSectors },
        { key: this.redBoltipcLayer, value: this.redBoltipcs }, // 视频-红外枪机
        { key: this.redBoltipcSectorLayer, value: this.redBoltipcSectors },
        { key: this.verfaceipcLayer, value: this.verfaceipcs }, // 视频-人脸抓拍
        { key: this.verfaceipcSectorLayer, value: this.verfaceipcSectors },
        { key: this.trafficipcLayer, value: this.trafficipcs }, // 视频-交通抓拍
        { key: this.trafficipcSectorLayer, value: this.trafficipcSectors },
        { key: this.commonAlarmLayer, value: this.commonAlarms }, // 普通报警
        { key: this.fireAlarmLayer, value: this.fireAlarms }, // 消防报警
        { key: this.alarmHostLayer, value: this.alarmHosts }, // 报警主机
        { key: this.alarmColumnLayer, value: this.alarmColumns }, // 报警柱
        { key: this.alarmBoxLayer, value: this.alarmBoxs }, // 报警箱
        { key: this.patrolLayer, value: this.patrols }, // 巡更
        { key: this.doorControlLayer, value: this.doorControls }, // 门禁
        { key: this.highLightLocateLayer, value: this.locateFeatures } // 高亮定位
      ]
    }
  },
  watch: {
    leftPanelShow(flag) {
      this.changeControlsPosition()
    },
    activeMapConfig: {
      handler(item) {
        if (item && item._id) {
          this.computeActiveMapParams(item)
          this.initShowFeatures() // 初始化显示要素
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.loadMapConfigArr()
      .then(res => {
      })
      .catch(err => {
        console.log('地图信息获取失败，请联系管理员', err)
      })
  },
  methods: {
    ...mapActions(['loadMapConfigArr', 'setIsBSMapReady', 'setMapZoom', 'clearPointFeatures', 'clearPointFeatures']),
    // 计算地图参数
    computeActiveMapParams(item) {
      let extent = item.extent
      if (item.mapType === 'static') { // 静态地图，计算地图边界
        extent = getExtent(extent, [item.size.width, item.size.height])
      }
      this.activeMapxtent = extent
    }
  },
  beforeDestroy() {
    this.setIsBSMapReady(false)
  }
}
</script>

<style scoped>
.mapItem {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
.mapHome {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>
