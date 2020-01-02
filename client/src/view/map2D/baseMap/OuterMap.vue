<template>
  <div>
    <div class="mapItem" v-for="(item) in mapConfigArr" :key="item.mapId" v-show="activeMapConfig.mapId === item.mapId">
      <bs-map v-if="activeMapConfig.mapId === item.mapId" class="mapHome" :projection="mapProjection" :center="activeMapConfig.center" :extent="activeMapxtent || activeMapConfig.extent" :zoom="activeMapConfig.zoom || defaultZoom" :updateSize="isUpdate" @ready="bsMapReady" :resolutions="activeMapConfig.resolutions" :showRotate="true" @singleclick="handleMapClick" @dblclick="handleMapDBClick" @zoom="handleMapZoomChange" @mousemove="handkeMapMouseMove">
        <!-- geo蓝星 -->
        <div v-if="activeMapConfig.mapType === 'geoserver'">
          <bs-wtmslayer :url="activeMapConfig.mapUrl" :layerName="activeMapConfig.layerName" :gridNames="activeMapConfig.gridSets" :matrixSet="activeMapConfig.matrixSet" :showOverView="true" :origin="activeMapConfig.origin" @overViewMapReady="handleOverViewMapReady"></bs-wtmslayer>
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
        <!-- 单兵头像 -->
        <single-head v-for="item in showSingleHeads2D" :key="item.id" :data="item"/>
        <!-- 区域绘制 -->
        <bs-draw :id="areaQuery.id" :name="areaQuery.name" :type="areaQuery.type" :actived="areaDrawActive" :layerStyle="areaQuery.layerStyle" :drawStyle="areaQuery.drawStyle" @drawend="drawAreaFinish"></bs-draw>
        <!-- 量算 -->
        <bs-measure :id="measureLayer.id" :name="measureLayer.name" :type="measureLayer.type" :actived.sync="measureLayer.actived" :clear.sync="measureLayer.clear"></bs-measure>
        <bs-infowindow class="feature-infoPanel" v-if="!isInfoPanelFixed && showMapResourceAttributes" :position="mapResourceAttributes.position">
          <component :is="mapResourceAttributes.type"></component>
        </bs-infowindow>
      </bs-map>
    </div>
    <NodePopup v-for="node in faceHistoryTrackNodes" :key="node.id" :node="node" :map="map" :olLib="olLib" @changeShowModel="changeShowModel" @currentPopupTop="currentPopupTop"></NodePopup>
    <div v-if="!isPlatformTrack">
      <FaceHead  v-for="item in faceHeadIcons" :key="item.id" :data="item"></FaceHead>
    </div>
    <AlarmModal v-if="showModel === '1'" :show="showModel === '1'" @close="showModel = '0'" type="passer" :picInfo="picInfo"></AlarmModal>
    <VehicleTrajectory :picInfo="picInfo" @close="showModel = '0'" v-if="showModel === '2'" :show="showModel === '2'"></VehicleTrajectory>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getExtent } from 'assets/2DMap/MapUtil.js'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import drawAreaCtrl from './ctrl/drawArea'
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
import AlarmingLayer from './layers/outerAlarming'
import AreaAlarmingLayer from './layers/AreaOuterAlarming'
import SingleHead from './singleHead'
import NodePopup from 'components/face/NodePopup'
import realAlarming from './layers/realAlarming'
import appFaceAlarm from '../alarmFun/faceTrack/appFaceAlarm'
import FaceHead from '../alarmFun/faceTrack/FaceHead'
import singTimeoutAlarm from './layers/singTimeoutAlarm'
import AttrVideo from '../components/PTattribute/attributes/AttrVideo'
import AttrAlarm from '../components/PTattribute/attributes/AttrAlarm'
import AttrAlarmHelp from '../components/PTattribute/attributes/AttrAlarmHelp'
import AttrPatrol from '../components/PTattribute/attributes/AttrPatrol'
import AttrSinglePawn from '../components/PTattribute/attributes/AttrSinglePawn'
import AttrBuilding from '../components/PTattribute/attributes/AttrBuilding'
import AttrGrid from '../components/PTattribute/attributes/AttrGrid'
import AttrDoorControl from '../components/PTattribute/attributes/AttrDoorControl'
import AttrBuildingAlarm from '../components/PTattribute/attributes/AttrBuildingAlarm'
import VehicleTrajectory from '../components/track/trajectory/VehicleTrajectory'
import AlarmModal from '../../veriface/alarmsearch/AlarmModal.vue'
import trackFun from '../components/track/trajectory/trackFun.vue'
export default {
  components: { SingleHead, FaceHead, NodePopup, AttrVideo, AttrAlarm, AttrAlarmHelp, AttrPatrol, AttrSinglePawn, AttrBuilding, AttrGrid, AttrDoorControl, AttrBuildingAlarm, VehicleTrajectory, AlarmModal },
  mixins: [ baseCtrl, eventCtrl, drawAreaCtrl, GridLayer, BuildingLayer, VideoLayer, CommonAlarmLayer, FireAlarmLayer, AlarmHostLayer, AlarmColumnLayer, AlarmBoxLayer, PatrolLayer, DoorControlLayer, AlarmingLayer, AreaAlarmingLayer, realAlarming, appFaceAlarm, singTimeoutAlarm, trackFun ],
  data() {
    return {
      activeMapxtent: null, // 当前地图边界
      isUpdate: true
    }
  },
  computed: {
    ...mapGetters(['mapResourceAttributes', 'showMapResourceAttributes', 'isMapOuter', 'mapProjection', 'isBsMapReady', 'mapZoom', 'toolVisible', 'activeMapConfig',
      'showDrawTrack2D', 'trackCoordinates2D', 'mapConfigArr', 'showSingleHeads2D']),
    ...mapGetters('map2DApplyIX', [
      'alarmColumn', // 报警柱
      'alarmBox', // 报警箱
      'isNameTitle', // 名称标签
      'isInfoPanelFixed', // 信息标签面板是否固定
      'isPlatformTrack', // 接力追踪状态
      'faceHistoryTrackNodes' // 人像历史轨迹节点数组
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
        { key: this.singleLayer, value: this.singles }, // 单兵
        { key: this.highLightAreaLayer, value: this.locateAreaFeatures }, // 区域高亮
        { key: this.alarmingLayer, value: this.outerAlarmPointFeatures }, // 实时点位报警
        { key: this.alarmingLabelLayer, value: this.outerAlarmPointLabels },
        { key: this.alarmingAreaLayer, value: this.buildingAreaAlarmingFeatures }, // 实时区域报警
        { key: this.singleTimeoutAlarmLayer, value: this.singleTimeoutAlarmFeatures } // 超时定点报警图层
      ]
      const video = [
        { key: this.buildingLayer, value: this.buildings }, // 楼宇
        { key: this.buildingLabelLayer, value: this.buildingLabels },
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
    toolVisible: {
      handler(flag) {
        this.changeControlsPosition()
      },
      immediate: true
    },
    activeMapConfig: {
      handler(item) {
        if (item && item._id) {
          this.computeActiveMapParams(item)
          this.initFeaturesShowByFlag() // 初始化控制点位显隐
        }
      },
      deep: true,
      immediate: true
    },
    showDrawTrack2D(flag) {
      if (flag) {
        this.drawTrack.drawTrackLine(this.trackCoordinates2D)
        this.drawTrack.addTrackNodes()
        this.drawTrack.controlAnimation()
      } else {
        this.setTrackCoordinates2D([])
        this.setFaceHistoryTrackNodes([])
        this.drawTrack.clearTrack()
        this.$nextTick(() => {
          this.showModel = '0'
        })
      }
    }
  },
  created() {
    this.SET_LOCATE_AREA_FEATURES([])
    this.loadMapConfigArr()
      .then(res => {
        this.loadQueryRealSingles() // 加载查询的实时单兵列表
      })
      .catch(err => {
        console.log('地图信息获取失败，请联系管理员', err)
      })
  },
  methods: {
    ...mapActions(['loadMapConfigArr', 'setIsBSMapReady', 'setMapZoom', 'setTrackCoordinates2D']),
    ...mapActions('map2DApplyIX', [
      'setFaceHistoryTrackNodes' // 设置人像历史轨迹节点数据
    ]),
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

<style scoped lang='less'>
.bs-mains {
    position: absolute;
    left: 0;
    width: 900px;
    height: 600px;
    margin-left: 288px;
    background: #1c3053;
    overflow-x: hidden;
    padding: 16px 0 0;
    top: 164px;
}
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
.feature-infoPanel {
  width: 240px;
  height: auto;
  background: #1b3153;
}
</style>
