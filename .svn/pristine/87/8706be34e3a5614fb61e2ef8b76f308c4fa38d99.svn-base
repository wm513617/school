<template>
  <div class="feng-map">
    <!-- 加载地图容器 -->
    <div id="fengMap" >
      <draw-circle :fengMap="fengMap" :actived='drawCircleParams.actived' :clear.sync="drawCircleParams.clear" :drawStyle='drawCircleParams.drawStyle' @drawend="handleDrawCircle"></draw-circle>
      <draw-polygon ref="drawPolygon" :fengMap="fengMap" :drawFlish.sync = "drawData"></draw-polygon>
      <draw-line :fengMap="fengMap" :actived='drawLineActived'></draw-line>
      <face-head v-for="node in faceHeadDatas" :key="node.pointId" :node="node" :fontColor="node.fontColor" :borderColor="node.borderColor" :fengMap="fengMap"></face-head>
      <measured-distance :fengMap="fengMap" :actived.sync='measureDistanceParams.actived' :clear.sync="measureDistanceParams.clear" :drawStyle='measureDistanceParams.drawStyle'></measured-distance>
      <measure-polygon :fengMap="fengMap" :actived.sync='measurePolygonParams.actived' :clear.sync="measurePolygonParams.clear" :drawStyle='measurePolygonParams.drawStyle'></measure-polygon>
    </div>
    <AlarmModal v-if="showDetailModel === 'personTrack'" :show="showDetailModel === 'personTrack'" @close="setShowDetailModel('')" type="passer" :picInfo="detailModel"></AlarmModal>
    <VehicleTrajectory :picInfo="detailModel" @close="setShowDetailModel('')" v-if="showDetailModel === 'vehicleTrack'" :show="showDetailModel === 'vehicleTrack'"></VehicleTrajectory>
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import DrawCircle from 'components/fengmap/draw/DrawCircle'
import DrawPolygon from 'components/fengmap/draw/DrawPolygon'
import DrawLine from 'components/fengmap/draw/DrawLine'
import FaceHead from 'components/fengmap/faceHead/FaceHead'
import AlarmModal from '../../veriface/alarmsearch/AlarmModal.vue'
import VehicleTrajectory from '../components/track/trajectory/VehicleTrajectory'
import MeasuredDistance from 'components/fengmap/measure/MeasuredDistance'
import MeasurePolygon from 'components/fengmap/measure/MeasurePolygon'
import { GEOMETRYTYPE } from 'assets/2DMap/meta/common'
import pointResource from './layers/pointResource'
import alarmFun from '../alarmFun/alarmFun'
import appFaceAlarm from '../alarmFun/faceTrack/appFaceAlarm'
export default {
  name: 'FengMapApply',
  mixins: [baseCtrl, eventCtrl, pointResource, alarmFun, appFaceAlarm],
  components: {
    DrawCircle,
    DrawPolygon,
    DrawLine,
    FaceHead,
    AlarmModal,
    VehicleTrajectory,
    MeasuredDistance,
    MeasurePolygon
  },
  data() {
    return {
      isLoading: false,
      fengMap: null, // map变量
      drawData: null,
      drawCircleParams: {
        actived: false,
        clear: false,
        drawStyle: {color: '#ff0000'}
      },
      measurePolygonParams: {
        actived: false,
        clear: false,
        drawStyle: {color: '#ff0000'}
      },
      measureDistanceParams: {
        actived: false,
        clear: false,
        drawStyle: {color: '#ff0000'}
      }
    }
  },
  props: {},
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.isLoading = true
      this.loadFengMap()
    })
  },
  computed: {
    ...mapState({
      fmapID: ({ fengMap }) => fengMap.fmapID,
      fmapLoadComplete: ({ fengMap }) => fengMap.fmapLoadComplete,
      isfmOuter: ({ fengMap }) => fengMap.isfmOuter
    }),
    ...mapGetters('map2DApplyIX', ['isShowToolsPanel', 'isInfoPanelFixed']), // 固定悬浮状态
    ...mapGetters('fengMap', ['fmapShowTrackModal', 'measureMode', 'boxChooseSecPanelStatus', 'fmapShowDrawTrack']),
    ...mapGetters('fengMapDraw', ['isCircleDrawActive']),
    ...mapGetters('fengMapApplyInteractive', ['isShowToolsPanel', 'isInfoPanelFixed']), // 固定悬浮状态
    ...mapGetters('fengMapPoint', ['getShowFengMapResourceAttributesPanel', 'getShowFengMapResourceAttributesPanelSolids']),
    ...mapGetters('fengMapFace', ['faceHeadDatas', 'showDetailModel', 'detailModel']),
    ...mapGetters('fengMapLine', ['drawLineActived'])
  },
  watch: {
    drawData(data) {
      console.log(data)
    },
    fmapShowDrawTrack(flag) {
      if (!flag) {
        this.deleteLineTrackLoc()
        this.deleteFaceHeadDatas('historyTrack')
        this.setShowDetailModel('')
      }
    },
    measureMode: {
      handler(newMode) {
        if (newMode && newMode.type) {
          if (newMode.type === GEOMETRYTYPE.POLYLINE) { // 测量线时
            this.measureDistanceParams.actived = newMode.panelVisible && newMode.isMeasure
          } if (newMode.type === GEOMETRYTYPE.POLYGON) { // 测量面时
            this.measurePolygonParams.actived = newMode.panelVisible && newMode.isMeasure
          }
          if (!newMode.panelVisible) { // 隐藏量算面板时，清空量算绘制内容
            this.measureDistanceParams.clear = true
            this.measurePolygonParams.clear = true
          }
        }
      },
      deep: true
    },
    measurePolygonParams: {
      handler(params) {
        if (!params.actived && this.measureMode.isMeasure) {
          this.changeMeasureActived(false)
        }
      },
      deep: true
    },
    measureDistanceParams: {
      handler(params) {
        if (!params.actived && this.measureMode.isMeasure) {
          this.changeMeasureActived(false)
        }
      },
      deep: true
    },
    boxChooseSecPanelStatus(flag) { // 是否显示框选面板
      if (!flag) {
        this.drawCircleParams.clear = true
      }
    },
    isCircleDrawActive(flag) { // 圆绘制状态
      this.drawCircleParams.actived = flag
    }
  },
  methods: {
    ...mapMutations('fengMap', ['SET_FMAP', 'SET_FM_OUTER', 'SET_FMAP_ID', 'SET_LOAD_STATUS']),
    ...mapActions('fengMap', ['changeMeasureActived']),
    ...mapActions('fengMapDraw', ['closeDrawFn']),
    ...mapActions('fengMapFace', ['setShowDetailModel', 'setFaceHeadDatas', 'deleteFaceHeadDatas']),
    ...mapActions('fengMapLine', ['deleteLineTrackLoc']),
    ...mapActions('measured', ['setMeasuredDistanceActive']),
    ...mapMutations('fengMapPoint', ['SET_FENGMAP_PANEL_STATUS', 'SET_FENGMAP_PANEL_STATUS_SOLIDS']),
    handleDrawCircle(param) { // 圆绘制完成
      console.log('圆绘制完成，参数：', param)
      this.closeDrawFn(GEOMETRYTYPE.CIRCLE)
    }
  }
}
</script>
<style >
  .feng-map, #fengMap {
    width: 100%;
    height: 100%
  }
</style>
