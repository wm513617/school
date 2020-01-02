<template>
  <div>
     <!-- 返回按钮 -->
      <div class="go-back iconfont icon-upper-level" @click="goOuterMap"></div>
      <!--楼层平面图地图部分  -->
      <div class="mapFloorFooter">
        <bs-staticmap class="mapHome" :projection="mapProjection" :url="currentFloorData.mapUrl" :center="currentFloorData.center" :extent="currentFloorData.extent" @ready="bsMapReady" @click="handleMapClick" @zoom="handleMapZoomChange" @mousemove="handkeMapMouseMove">
          <!-- 点位资源矢量图层 -->
          <bs-layer v-for="(item) in layerArr" :key="item.key.id" :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
           <!-- 多边形要素绘制 -->
          <bs-draw :id="polygonDraw.id" ref="polygonDrawer" :name="polygonDraw.name" :type="polygonDraw.type" :actived="polygonDraw.actived" :drawStyle="polygonDraw.drawStyle" :layerStyle="polygonDraw.layerStyle" @drawend="drawPolygonEnd"></bs-draw>
          <!-- 线要素绘制 -->
          <bs-draw :id="lineStringDraw.id" :name="lineStringDraw.name" :type="lineStringDraw.type" :actived="lineStringDraw.actived" :drawStyle="lineStringDraw.drawStyle" :layerStyle="lineStringDraw.layerStyle"  @drawend="drawLineStringEnd"></bs-draw>
          <!-- 点位要素绘制 -->
          <bs-draw :id="pointDraw.id" :name="pointDraw.name" :type="pointDraw.type" :actived="pointDraw.actived" :drawStyle="pointDraw.drawStyle" @drawend="drawPointEnd"></bs-draw>
          <!-- 要素编辑 -->
          <bs-edit :actived="editActive" :features="currentEditFeature" @modifystart="editFeatureStart" @modifyend="editFeatureEnd"></bs-edit>
        </bs-staticmap>
      </div>
      <div v-if="!isBuildingEdit && currentFloor && currentFloor._id" class="floor-list">
        <p class="floor-list-title">楼层列表</p>
        <div class="floor-box">
          <div class="floorItem" v-for="(item, index) in levelList" :key="index" @click="changeFocusFloor(item)">
            <p class="floorIcon" :class="{'floorIconActive': item._id === currentFloor._id}" :title="item.name">{{item.name}}</p>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getExtent } from 'assets/2DMap/MapUtil.js'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import featureDrawCtrl from './ctrl/featureDraw'
import GridLayer from './layers/grid'
import VideoLayer from './layers/video'
import CommonAlarmLayer from './layers/commonAlarm'
import FireAlarmLayer from './layers/fireAlarm'
import AlarmHostLayer from './layers/alarmHost'
import AlarmColumnLayer from './layers/alarmColumn'
import AlarmBoxLayer from './layers/alarmBox'
import PatrolLayer from './layers/patrol'
import DoorControlLayer from './layers/doorControl'
export default {
  components: {},
  mixins: [ baseCtrl, eventCtrl, featureDrawCtrl, GridLayer, VideoLayer, CommonAlarmLayer, FireAlarmLayer, AlarmHostLayer, AlarmColumnLayer, AlarmBoxLayer, PatrolLayer, DoorControlLayer ],
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
    ...mapState({
      mapEditRightPage: ({ mapIndex }) => mapIndex.mapEditRightPage,
      levelList: ({ mapArea }) => mapArea.levelList // 楼层列表
    }),
    ...mapGetters(['isMapOuter', 'mapProjection', 'isBsMapReady', 'mapZoom', 'mapConfigArr', 'activeMapConfig', 'currentFloor', 'locateFeatures']),
    layerArr() {
      return [
        { key: this.gridLayer, value: this.grids }, // 网格
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
        { key: this.alarmColumnLayer, value: this.alarmColumns }, // 报警柱
        { key: this.alarmHostLayer, value: this.alarmHosts }, // 报警主机
        { key: this.alarmBoxLayer, value: this.alarmBoxs }, // 报警箱
        { key: this.patrolLayer, value: this.patrols }, // 巡更
        { key: this.doorControlLayer, value: this.doorControls }, // 门禁
        { key: this.highLightLocateLayer, value: this.locateFeatures } // 高亮定位
      ]
    },
    isBuildingEdit() { // 是否是楼宇编辑
      const {page, detail} = this.mapEditRightPage
      return page === 'buildEditPage' && detail === 'edit'
    }
  },
  watch: {
    currentFloor: { // 当前楼层的数据
      handler(data) {
        if (data && data._id) {
          this.setMapParams(data) // 设置地图参数
          this.initShowFeatures() // 初始化显示要素
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    ...mapMutations(['SET_EDIT_RIGHT_PAGE_STATE', 'SET_FEATURE_EDIT_ACTIVE']),
    ...mapActions(['setIsBSMapReady', 'setMapZoom', 'setIsMapOuter', 'clearAreaFeatures', 'clearPointFeatures', 'getPatrolPointTree', 'get2DAlarmHelpOrgTree', 'setCurrentFloor', 'getFoorById', 'clearAreaFeatures', 'clearPointFeatures']),
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
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭编辑视频点位的控件
      this.SET_EDIT_RIGHT_PAGE_STATE({ page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      this.setIsMapOuter(true)
      this.getPatrolPointTree()
      this.get2DAlarmHelpOrgTree({ mapType: '2D' })
    },
    // 改变当前焦点楼层
    changeFocusFloor(data) {
      this.getFoorById(data._id).then(res => {
        this.clearAreaFeatures() // 清空区域要素
        this.setCurrentFloor(res)
        this.clearPointFeatures() // 清空点位要素
        if (this.isMapOuter) {
          this.setIsMapOuter(false) // 设置地图为楼内
        }
        this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: 'floorEditPage', detail: 'edit' })
      }).catch(err => {
        console.log('获取楼层数据失败，失败信息：', err)
      })
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
  left: 340px;
  top: 18px;
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
.floor-list {
  position: absolute;
  right: 0;
  width: 300px;
  bottom: 0;
  height: 18%;
  background: #1c3053;
}
.floor-list .floor-list-title{
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding-left: 16px;
}
.floor-list .floor-box{
  height: calc(100% - 56px);
  width: 100%;
  overflow-y: auto;
  padding-left: 12px;
}
.floor-box .floorItem {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  padding: 0px 4px;
  border-radius: 10px;
  border: 1px solid #5676a9;
  margin-right: 4px;
  clear: both;
  cursor: default;
}
.floor-box .floorItem .floorIcon {
  float: left;
  height: 20px;
  line-height: 20px;
  font-size: 10px;
  padding: 0 2px;
  cursor: pointer;
}
.floor-box .floorItem .floorIcon:hover, .floor-box .floorItem .floorIconActive {
  color: #20adff;
}
</style>
