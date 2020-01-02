<template>
  <div class="map-3d">
    <!-- 左侧搜索结构、点位面板 -->
    <section class="panel-search-wrap">
      <PanelSearch />
    </section>
    <!-- 右侧收缩工具栏面板 -->
    <section class="panel-tools">
      <PanelTools/>
    </section>
    <!-- 全屏底图 -->
    <section class="base-map">
      <feng-map></feng-map>
    </section>
    <!-- 初始不显示的组件，零散弹框面板 -->
    <section class="substitute-modules">
      <!-- 应急预案及单兵列表 -->
      <planAndSingleList/>
      <PTattributes />
      <DragVideo v-if="pointVideoList.length" modelType="2D"/>
      <seatList v-if="showSeatList"></seatList>
      <RelayTrack />
      <TrackModal></TrackModal>
      <!-- <DragBox v-if="videoList.length"/> -->
    </section>
  </div>
</template>

<script>
import alarm from '../../socket/alarm.js'
import FengMap from './baseMap/FengMap.vue'
import PanelTools from './panelTools/Tools'
import PanelSearch from './panelSearch/PanelSearch'
import PlanAndSingleList from './panelSearch/PlanAndSingleList'
import RelayTrack from './panelSearch/RelayTrack'
import PTattributes from './components/PTattributes/Panel'
import DragVideo from 'components/video/DragVideo'
import seatList from './panelTools/seatModel/seatList'
import TrackModal from './components/track/TrackModal'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    FengMap,
    PanelTools,
    PanelSearch,
    PlanAndSingleList,
    RelayTrack,
    PTattributes,
    DragVideo,
    seatList,
    TrackModal

  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      pointVideoList: ({ mapIndex }) => mapIndex.pointVideoList,
      trackList: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.trackList, // 人脸轨迹数据
      showSeatList: ({ phone }) => phone.showSeatList
    }),
    ...mapGetters(['toolVisible']),
    ...mapGetters('fengMapApplyInteractive', ['isShowToolsPanel', 'isInfoPanelFixed']), // 固定悬浮状态
    ...mapGetters('fengMapPoint', ['getFengMapResourceAttributes', 'getShowFengMapResourceAttributesPanel'])
  },
  methods: {
    ...mapMutations(['CHANGE_POINT_VIDEO_LIST']),
    ...mapActions(['recordLog']),
    ...mapActions('phone', ['updateExtensionStatus']),
    ...mapActions('map3DApplyIX', [
      'openPTattr' // 打开点位属性面板
    ]),
    /* ...mapMutations('fengMapPoint',['SET_FENGMAP_PANEL_STATUS']), // 设置面板显示或隐藏
    ...mapActions('fengMapPoint',['setFengMapResourceAttributes']),// 设置面板属性
    panelFn(type){
      this.SET_FENGMAP_PANEL_STATUS(true)
      let attr = null
      switch (type) {
        case 'AttrAlarm': attr={ type:type, name:'报警点位'} ; break
        case 'AttrAlarmHelp':  attr={ type:type, name:'报警求助点位'} ; break
        case 'AttrDoorControl':  attr={ type:type, name:'门禁点位'} ; break
        case 'AttrPatrol':  attr={ type:type, name:'巡更点位'} ; break
        case 'AttrSingle':  attr={ type:type, name:'单兵点位'} ; break
        case 'AttrVideo':  attr={ type:type, name:'视频点位'}
      }
      this.setFengMapResourceAttributes(attr)
    }, */
    // 日志记录
    saveLog(data) {
      this.recordLog(data).then(suc => {
        console.log('日志记录成功')
      }).catch(err => {
        console.log('日志记录失败 ' + err)
      })
    },
    // 接收除外单兵&巡更的所有报警
    saveAllAlram(data) {
      console.log('saveAllAlram', data)
    },
    // 接收巡更
    savePatrolAlram() {},
    // 接收单兵位置
    saveSinglePawnLoc() {},
    // 单兵一键报警
    saveSinglePawnAlram() {},
    // 巡更状态
    saveSentryStatusAlram() {},
    // 确认报警回调
    confirmAlram() {},
    /**
     * 监听所有socket，同步状态到store中（方法未实现。。。）
     * 1.注意处理报警确认行为，及时清理store
     * 2.在2D销毁时，及时清理store
     */
    bindSocket() {
      alarm.on('all', this.saveAllAlram)
      alarm.on('patrol', this.savePatrolAlram)
      alarm.on('singlePawn', this.saveSinglePawnAlram)
      alarm.on('singlePawnLoc', this.saveSinglePawnLoc)
      alarm.on('sentryStatus', this.saveSentryStatusAlram)
      alarm.on('patrolConfirm', this.confirmAlram)
    },
    removeSocket() {
      alarm.remove('all', this.saveAllAlram)
      alarm.remove('patrol', this.savePatrolAlram)
      alarm.remove('singlePawn', this.saveSinglePawnAlram)
      alarm.remove('singlePawnLoc', this.saveSinglePawnLoc)
      alarm.remove('sentryStatus', this.saveSentryStatusAlram)
      alarm.remove('patrolConfirm', this.confirmAlram)
    }
  },
  created() {
    this.bindSocket()
    this.saveLog({
      logType: '操作日志',
      module: '电子地图',
      operateName: '二维地图',
      operateContent: '进入二维地图'
    })
    this.updateExtensionStatus()
  },
  beforeDestroy() {
    this.removeSocket()
    this.saveLog({
      logType: '操作日志',
      module: '电子地图',
      operateName: '二维地图',
      operateContent: '离开二维地图'
    })
    this.CHANGE_POINT_VIDEO_LIST([])
    sessionStorage.removeItem('trackEvent')
  }
}
</script>

<style lang="less" scoped>
.map-3d {
  width: 100%;
  height: 100%;
  position: relative;
  .btn-shrink {
    position: absolute;
    z-index: 99;
    right: 0;
    top: 0;
    height: 20px;
    width: 64px;
    background-color: rgba(15, 35, 67, 0.8);
    border: none;
    color: #fff;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  .base-map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
