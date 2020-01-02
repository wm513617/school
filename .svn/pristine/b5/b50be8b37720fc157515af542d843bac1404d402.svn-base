<template>
  <div class="map-3d">
    <!-- 左侧搜索结构、点位面板 -->
    <section class="panel-search-wrap">
      <PanelSearch />
    </section>
    <!-- 右侧收缩工具栏面板 -->
    <section class="panel-tools">
      <PanelTools @region="region" @Locus="controlTrackSearch"/>
    </section>
    <!-- 全屏底图 -->
    <section class="base-map">
      <base-map @sendEvent="openPTattr" @drawTrack="drawTrackOnMap"/>
    </section>
    <!-- 初始不显示的组件，零散弹框面板 -->
    <section class="substitute-modules">
      <!-- 应急预案及单兵列表 -->
      <planAndSingleList/>
      <PTattribute />
      <TrackModal></TrackModal>
      <DragVideo v-if="videoList.length" modelType="3D"/>
    </section>
  </div>
</template>

<script>
import baseMap from './baseMap/map3DApp'
import PanelTools from './panelTools/Tools'
import PanelSearch from './panelSearch/PanelSearch'
import PlanAndSingleList from './panelSearch/PlanAndSingleList'
import PTattribute from './components/PTattribute/Panel'
import TrackModal from './components/track/TrackModal'
import DrawTrack from './components/track/DrawTrack'
import DrawFaceTrack from './components/track/DrawFaceTrack'
import DragVideo from 'components/video/DragVideo'
import { mapState, mapActions } from 'vuex'
import appFaceAlarm from './alarmFun/appFaceAlarm'
import { transCoorinates } from './panelTools/panels/flight/init'
import FlyingTrack from './panelTools/panels/flight/FlyingTrack'
import mapUtil from 'assets/3DMap/mapUtil.js'
export default {
  mixins: [appFaceAlarm],
  components: {
    baseMap,
    PanelTools,
    PanelSearch,
    PlanAndSingleList,
    PTattribute,
    TrackModal,
    DragVideo
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      showTrackModal: ({ tdIndex }) => tdIndex.showTrackModal, // 是否显示轨迹查询弹出框---韩杰---2018-10-25
      showDrawTrack: ({ tdIndex }) => tdIndex.showDrawTrack, // 是否显示绘制轨迹---韩杰---2018-10-25
      trackCoMap: ({ tdIndex }) => tdIndex.trackCoMap, // 轨迹坐标map(key: 坐标点信息，value：三维坐标)---韩杰---2018-10-25
      faceTrackCoMap: ({ tdIndex }) => tdIndex.faceTrackCoMap, // 人像信息 --- anli  --- 20190920
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter,
      videoList: ({tdPoint}) => tdPoint.videoList,
      isCommonAlarm: ({ map3DApplyIX }) => map3DApplyIX.filterState.isCommonAlarm
    })
  },
  watch: {
    trackCoMap: {
      handler(newVal) {
        if (newVal) {
          console.log('监听到轨迹坐标map变化：', newVal)
          this.drawTrackOnMap(newVal) // 在地图上绘制轨迹
        }
      },
      deep: true
    },
    faceTrackCoMap: {
      handler(newVal) {
        if (newVal) {
          console.log('监听到人像map变化：', newVal)
          this.drawFaceTrackOnMap(newVal) // 在地图上绘制人像
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'set3DActiveDraw',
      'setShowTrackModal', // 设置是否显示轨迹查询弹窗---韩杰---2018-11-7 10:02:04
      'setShowDrawTrack', // 设置是否显示绘制轨迹---韩杰---2018年11月7日10:02:27
      'setTrackCoMap', // 设置轨迹坐标---韩杰---2018年11月7日10:02:47
      'setFaceTrackCoMap',
      'set2DAreaDraw',
      'recordLog',
      'setVideoDragList'
    ]),
    ...mapActions('map3DApplyIX', [
      'openPTattr' // 打开点位属性面板
    ]),
    region() {
      if (this.is3DMapOuter) {
        this.set3DActiveDraw(true)
      } else {
        this.set2DAreaDraw(true)
      }
    },
    /**
     * 控制轨迹查询
     */
    controlTrackSearch() {
      if (this.showTrackModal || this.showDrawTrack) {
        // 显示绘制轨迹时
        if (this.trackDrawer) {
          this.clearTrackOnMap() // 清空地图上绘制的轨迹
        }
        if (this.faceTrackDrawer) {
          this.clearFaceTrackOnMap() // 清空地图上绘制的人像
        }
        this.setShowTrackModal(false) // 设置不显示轨迹查询弹出框
        this.setShowDrawTrack(false) // 设置不显示绘制轨迹
      } else if (!this.showTrackModal) {
        // 未打开轨迹查询弹出框时
        this.setShowTrackModal(true) // 设置显示轨迹查询弹出框
      }
    },
    drawTrackOnMap() {
      // 在地图上轨迹绘制
      // this.trackDrawer = new DrawTrack(this.$context, this.trackCoMap)
      // this.trackDrawer.drawTrack() // 绘制轨迹
      const coordinates = [
        // [116.27678426187629, 40.16969279953479, 9.908051661193483],
        // [116.27748492936594, 40.16812757074154, 13.684093148125996],
        // [116.27574249157522, 40.168161637726236, 10.196365028280738],
        // [116.27553441034333, 40.16939016492593, 29.106133435976247]
      ]
      const points = [...this.trackCoMap.values()]
      for (let point of points) {
        const coord = point.split(',')
        const coordArr = [Number(coord[0]), Number(coord[1]), Number(coord[2]) || 0]
        coordinates.unshift(coordArr)
      }
      const coordinatesRoute = {
        coordinates: coordinates,
        description: '',
        isCircle: 0,
        isShowMarker: 0,
        isShowRoute: 1,
        name: 'test',
        speed: 3, // 移动速度
        viewHeight: 537, // 视角高度
        viewMode: mapUtil.VIEWMODE.overlook // 视角
      }
      if (coordinates.length > 0) {
        let positions = transCoorinates.WSG84ArrToWorldPositions(this.$context, coordinates)
        this.trackDrawer = this.flyingTrack || new FlyingTrack(this.$context)
        this.trackDrawer.flyingRoute(positions, coordinatesRoute)
      }
    },
    clearTrackOnMap() {
      // 清空地图上绘制的轨迹
      // this.trackDrawer.clearTrack()
      this.trackDrawer.clear()
      this.setTrackCoMap(null)
      this.trackDrawer = null
    },
    drawFaceTrackOnMap() {
      // 在地图上人像绘制
      this.faceTrackDrawer = new DrawFaceTrack(this.$context, this.faceTrackCoMap)
      this.faceTrackDrawer.drawFaceTrack() // 绘制轨迹
    },
    clearFaceTrackOnMap() {
      // 清空地图上人像
      this.faceTrackDrawer.clearFaceTrack()
      this.setFaceTrackCoMap(null)
      this.faceTrackDrawer = null
    },
    // 日志记录
    saveLog(data) {
      this.recordLog(data).then(suc => {
        console.log('日志记录成功')
      }).catch(err => {
        console.log('日志记录失败 ' + err)
      })
    }
  },
  created() {
    this.saveLog({
      logType: '操作日志',
      module: '电子地图',
      operateName: '三维地图',
      operateContent: '进入三维地图'
    })
  },
  beforeDestroy() {
    this.saveLog({
      logType: '操作日志',
      module: '电子地图',
      operateName: '三维地图',
      operateContent: '离开三维地图'
    })
    this.setVideoDragList([])
  }
}
</script>

<style lang="less" scoped>
.map-3d {
  width: 100%;
  height: 100%;
  position: relative;
  .base-map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .panel-tools {
    height: 100%;
  }
}
</style>
