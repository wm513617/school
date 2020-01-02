<template>
  <div>
     <!-- 返回按钮 -->
      <div class="go-back iconfont icon-upper-level" :style="{left: isPlatformTrack ? '405px' : '310px'}" @click="goOuterMap"></div>
      <!--楼层平面图地图部分  -->
      <div class="mapFloorFooter">
        <bs-staticmap class="mapHome" :projection="mapProjection" :url="currentFloorData.mapUrl" :center="currentFloorData.center" :extent="currentFloorData.extent" @ready="bsMapReady" @singleclick="handleMapClick"  @dblclick="handleMapDBClick" @zoom="handleMapZoomChange" @mousemove="handkeMapMouseMove">
          <!-- 点位资源矢量图层 -->
          <bs-layer v-for="(item,index) in layerArr" :key="index"  :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
          <!-- 区域绘制 -->
          <bs-draw :id="areaQuery.id" :name="areaQuery.name" :type="areaQuery.type" :actived="areaDrawActive" :layerStyle="areaQuery.layerStyle" :drawStyle="areaQuery.drawStyle" @drawend="drawAreaFinish"></bs-draw>
          <!-- 量算 -->
          <bs-measure :id="measureLayer.id" :name="measureLayer.name" :type="measureLayer.type" :actived.sync="measureLayer.actived" :clear.sync="measureLayer.clear"></bs-measure>
          <bs-infowindow class="feature-infoPanel" v-if="!isInfoPanelFixed && showMapResourceAttributes" :position="mapResourceAttributes.position">
            <component :is="mapResourceAttributes.type"></component>
          </bs-infowindow>
        </bs-staticmap>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getExtent } from 'assets/2DMap/MapUtil.js'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import drawAreaCtrl from './ctrl/drawArea'
import GridLayer from './layers/grid'
import VideoLayer from './layers/video'
import CommonAlarmLayer from './layers/commonAlarm'
import FireAlarmLayer from './layers/fireAlarm'
import AlarmHostLayer from './layers/alarmHost'
import AlarmColumnLayer from './layers/alarmColumn'
import AlarmBoxLayer from './layers/alarmBox'
import PatrolLayer from './layers/patrol'
import DoorControlLayer from './layers/doorControl'
import AlarmingLayer from './layers/buildingAlarming'
import realAlarming from './layers/realAlarming'
import AttrVideo from '../components/PTattribute/attributes/AttrVideo'
import AttrAlarm from '../components/PTattribute/attributes/AttrAlarm'
import AttrAlarmHelp from '../components/PTattribute/attributes/AttrAlarmHelp'
import AttrPatrol from '../components/PTattribute/attributes/AttrPatrol'
import AttrGrid from '../components/PTattribute/attributes/AttrGrid'
import AttrDoorControl from '../components/PTattribute/attributes/AttrDoorControl'
export default {
  components: { AttrVideo, AttrAlarm, AttrAlarmHelp, AttrPatrol, AttrGrid, AttrDoorControl },
  mixins: [ baseCtrl, eventCtrl, drawAreaCtrl, GridLayer, VideoLayer, CommonAlarmLayer, FireAlarmLayer, AlarmHostLayer, AlarmColumnLayer, AlarmBoxLayer, PatrolLayer, DoorControlLayer, AlarmingLayer, realAlarming ],
  data() {
    return {
      currentFloorData: {
        center: [],
        extent: [],
        mapUrl: ''
      }
    }
  },
  computed: {
    ...mapGetters(['mapResourceAttributes', 'showMapResourceAttributes', 'isMapOuter', 'mapProjection', 'isBsMapReady', 'mapZoom', 'currentFloor']),
    ...mapGetters('map2DApplyIX', [
      'isNameTitle', // 名称标签
      'isInfoPanelFixed', // 信息标签面板是否固定
      'isPlatformTrack'
    ]),
    layerArr() {
      const normal = [
        { key: this.gridLayer, value: this.grids }, // 网格
        { key: this.gridLabelLayer, value: this.gridLabels },
        { key: this.boltipcSectorLayer, value: this.boltipcSectors }, // 视频-枪机
        { key: this.boltipcLabelLayer, value: this.boltipcLabels },
        { key: this.halfBallipcSectorLayer, value: this.halfBallipcSectors }, // 视频-半球
        { key: this.halfBallipcLabelLayer, value: this.halfBallipcLabels },
        { key: this.fastBallipcSectorLayer, value: this.fastBallipcSectors }, // 视频-快球
        { key: this.fastBallipcLabelLayer, value: this.fastBallipcLabels },
        { key: this.allViewipcSectorLayer, value: this.allViewipcSectors }, // 视频-全景
        { key: this.allViewipcLabelLayer, value: this.allViewipcLabels },
        { key: this.redBoltipcSectorLayer, value: this.redBoltipcSectors }, // 视频-红外枪机
        { key: this.redBoltipcLabelLayer, value: this.redBoltipcLabels },
        { key: this.verfaceipcSectorLayer, value: this.verfaceipcSectors }, // 视频-人脸抓拍
        { key: this.verfaceipcLabelLayer, value: this.verfaceipcLabels },
        { key: this.trafficipcSectorLayer, value: this.trafficipcSectors }, // 视频-交通抓拍
        { key: this.trafficipcLabelLayer, value: this.trafficipcLabels },
        { key: this.commonAlarmLayer, value: this.commonAlarms }, // 普通报警
        { key: this.commonAlarmLabelLayer, value: this.commonAlarmLabels },
        { key: this.fireAlarmLayer, value: this.fireAlarms }, // 消防报警
        { key: this.fireAlarmLabelLayer, value: this.fireAlarmLabels },
        { key: this.alarmHostLayer, value: this.alarmHosts }, // 报警主机
        { key: this.alarmHostLabelLayer, value: this.alarmHostLabels },
        { key: this.alarmColumnLayer, value: this.alarmColumns }, // 报警柱
        { key: this.alarmColumnLabelLayer, value: this.alarmColumnLabels },
        { key: this.alarmBoxLayer, value: this.alarmBoxs }, // 报警箱
        { key: this.alarmBoxLabelLayer, value: this.alarmBoxLabels },
        { key: this.patrolLayer, value: this.patrols }, // 巡更
        { key: this.patrolLabelLayer, value: this.patrolLabels },
        { key: this.doorControlLayer, value: this.doorControls }, // 门禁
        { key: this.doorControlLabelLayer, value: this.doorControlLabels },
        { key: this.highLightAreaLayer, value: this.locateAreaFeatures }, // 区域高亮
        { key: this.alarmingLayer, value: this.outerAlarmPointFeatures }, // 实时点位报警
        { key: this.alarmingLayer, value: this.buildingAlarmingFeatures },
        { key: this.alarmingLabelLayer, value: this.outerAlarmPointLabels }
      ]
      const video = [
        { key: this.boltipcLayer, value: this.boltipcs }, // 视频-枪机
        { key: this.halfBallipcLayer, value: this.halfBallipcs }, // 视频-半球
        { key: this.fastBallipcLayer, value: this.fastBallipcs }, // 视频-快球
        { key: this.allViewipcLayer, value: this.allViewipcs }, // 视频-全景
        { key: this.redBoltipcLayer, value: this.redBoltipcs }, // 视频-红外枪机
        { key: this.verfaceipcLayer, value: this.verfaceipcs }, // 视频-人脸抓拍
        { key: this.trafficipcLayer, value: this.trafficipcs }, // 视频-交通抓拍
        { key: this.highLightLocateLayer, value: this.locateFeatures } // 高亮定位
      ]
      if (this.isPlatformTrack) {
        return video
      } else {
        return video.concat(normal)
      }
    }
  },
  watch: {
    currentFloor: { // 当前楼层的数据
      handler(data) {
        if (data && data._id) {
          this.SET_LOCATE_AREA_FEATURES([])
          this.setMapParams(data) // 设置地图参数
          this.initFeaturesShowByFlag() // 初始化控制点位显隐
          this.isBsMapReady && this.loadQueryVideos() // 加载查询视频数据
          this.handleSelectFeature() // 处理选择要素
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.SET_LOCATE_AREA_FEATURES([])
    this.initFeaturesShowByFlag() // 初始化控制点位显隐
  },
  methods: {
    ...mapActions(['setIsBSMapReady', 'setMapZoom', 'setIsMapOuter', 'clearAreaFeatures', 'clearPointFeatures']),
    setMapParams(data) { // 设置地图参数数据
      let floor = JSON.parse(JSON.stringify(data))
      let width = 200
      let height = 100
      if (floor.picture.size) {
        width = floor.picture.size.width
        height = floor.picture.size.height
      }
      this.currentFloorData.center = floor.bid.center.split(',').map(item => Number(item))
      this.currentFloorData.zoom = floor.class
      let floorExtent = floor.bid.scope.split(',').map(item => Number(item))
      let levelExtent = getExtent(floorExtent, [width, height])
      this.currentFloorData.extent = levelExtent
      this.currentFloorData.mapUrl = floor.picture.path
    },
    goOuterMap() { // 返回到楼外地图
      this.clearAreaFeatures() // 清空区域要素
      this.clearPointFeatures() // 清空点位要素
      this.setIsMapOuter(true)
    }
  },
  beforeDestroy() {
    this.setIsBSMapReady(false)
  }
}
</script>

<style scoped>
.go-back {
  position: absolute;
  /* left: 310px; */
  top: 24px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #1c3053;
  cursor: pointer;
  z-index: 20;
  border-radius: 4px;
}
.mapFloorFooter {
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
.mapHome {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
.feature-infoPanel {
  width: 240px;
  height: auto;
  background: #1b3153;
}
</style>
