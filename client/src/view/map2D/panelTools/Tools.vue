<template>
  <section class="tools" :style="{height: !toolVisible? 0 : '100%'}">
    <button class="btn-shrink" @click="changeToolVisible" title="收起">
        <Icon :type="toolVisible ? 'chevron-right' : 'chevron-left'" />
      </button>
    <section class="tool-area" :class="{'hidden': !toolVisible}">
      <ul class="tool-list" :class="{'hidden': !toolVisible}">
        <li title="统计">
          <i
            @click="openPanel('MapCount')"
            class="icon iconfont icon-tongji1"
            :class="{
              'active': toolsPanelActive === 'MapCount',
              'animation-flicker-red': toolsPanelActive !== 'MapCount' && toolsPanelIsUnread('MapCount')
            }"
            type="ios-alarm"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li class="cut-off-line" title="框选">
          <i @click="showSecPanel()" class="icon iconfont icon-b_icon__screenshot" :class="{'active': chooseDraw}" type="ios-crop">
            <div class="box-choose" ref="secPanel" :class="{'sec-panel-show':!boxChooseSecPanelStatus}">
              <p class="icon iconfont icon-dianxuan" title="点选" @click.stop="boxChooseStatus(boxChooseTypes.point)"></p>
              <p class="icon iconfont icon-radio-sel" title="圆形框选" @click.stop="boxChooseStatus(boxChooseTypes.circle)"></p>
              <p class="icon iconfont icon-kuangxuan1" title="多边形框选" @click.stop="boxChooseStatus(boxChooseTypes.polygon)"></p>
            </div>
          </i>
        </li>
        <li v-if="filterState.isCommonAlarm.checked" title="普通报警">
          <i
            @click="openPanel('AlarmList')"
            class="icon iconfont icon-baojing2"
            :class="{
              'active': toolsPanelActive === 'AlarmList',
              'animation-flicker-red': toolsPanelActive !== 'AlarmList' && toolsPanelIsUnread('AlarmList')
            }"
            type="ios-alarm"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-if="filterState.isAlarmVideo.checked" title="视频报警">
          <i
            @click="openPanel('VideoAlarm')"
            class="icon iconfont icon-shipinbaojing"
            :class="{
              'active': toolsPanelActive === 'VideoAlarm',
              'animation-flicker-red': toolsPanelActive !== 'VideoAlarm' && toolsPanelIsUnread('VideoAlarm')
            }"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-if="filterState.isIntelligence.checked" title="智能报警">
          <i
            @click="openPanel('IntelligentAlarm')"
            class="icon iconfont icon-zhinengbaojing"
            :class="{
              'active': toolsPanelActive === 'IntelligentAlarm',
              'animation-flicker-red': toolsPanelActive !== 'IntelligentAlarm' && toolsPanelIsUnread('IntelligentAlarm')
            }"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-if="filterState.isFireControl.checked" title="消防报警">
          <i
            @click="openPanel('FireAlarmList')"
            class="icon iconfont icon-xiaofangbaojing11"
            :class="{
              'active': toolsPanelActive === 'FireAlarmList',
              'animation-flicker-red': toolsPanelActive !== 'FireAlarmList' && toolsPanelIsUnread('FireAlarmList')
            }"
            type="ios-bell"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-if="filterState.isAlarmHelp.checked" title="报警求助报警">
          <i
            @click="openPanel('AlarmHelpList')"
            class="icon iconfont icon-baojingqiuzhu1"
            :class="{
              'active': toolsPanelActive === 'AlarmHelpList',
              'animation-flicker-red': toolsPanelActive !== 'AlarmHelpList' && toolsPanelIsUnread('AlarmHelpList')
            }"
            type="android-hand"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-if="filterState.isAlarmSingle.checked" title="单兵报警">
          <i
            @click="openPanel('IndividualPolice')"
            class="icon iconfont icon-yidongdanbing"
            :class="{
              'active': toolsPanelActive === 'IndividualPolice',
              'animation-flicker-red': toolsPanelActive !== 'IndividualPolice' && toolsPanelIsUnread('IndividualPolice')
            }"
            type="man"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li class="cut-off-line" title="手工报警">
          <i
            @click="openManualarmModal"
            class="icon iconfont icon-shougongbaojing1"
            :class="{
              'active': toolsPanelActive === 'ManualAlarm'
            }"
            :style="{'cursor': showVideo || isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li title="一键报案">
          <i
            @click="openReportPolice"
            class="icon iconfont icon-yijianbaoan"
            :class="{
              'active': toolsPanelActive === 'ReportPolice'
            }"
            :style="{'cursor': showVideo || isPlatformTrack ? 'not-allowed' : (isReportPolice ? 'pointer': 'not-allowed')}"
          ></i>
        </li>
        <!-- 通讯录 -->
        <li title="通讯录">
          <i
            @click="openPanel('mapContact')"
            :class="{
              'active': toolsPanelActive === 'mapContact'
            }"
            class="icon iconfont icon-user-info"
            type="ios-shuffle-strong"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li title="轨迹刻画" v-if="isMapOuter && isBsMapReady">
          <i
            @click="changeTrackStatus"
            class="icon iconfont icon-guijichaxun1"
            :class="{'active': showTrackModal2D || showDrawTrack2D}"
            type="ios-shuffle-strong"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li title="量算" v-if="isBsMapReady">
          <i @click="changeMeasureStatus"
            class="icon iconfont icon-ceju"
            :class="{'active': isMeasurePanel}"
            type="ios-paperplane"
            :style="{'cursor': isPlatformTrack ? 'not-allowed' : 'pointer'}"
          >
            <div v-if="isMeasurePanel" class="measure-box">
              <Button type="text" size="small" @click.stop="measureDistance" style="margin-left: 6px">测距</Button>
              <Button type="text" size="small" @click.stop="measureArea">测面</Button>
            </div>
          </i>
        </li>
      </ul>
    </section>
    <!-- 二级面板 -->
    <div class="panel" :class="{'hidden': !isShowToolsPanel}">
      <MapCount @isUnread="v => { chnageToolIsUnread({type: 'MapCount', value: v}) }" v-show="toolsPanelActive === 'MapCount' && !isPlatformTrack" />
      <AlarmList ref="AlarmList" @isUnread="v => { chnageToolIsUnread({type: 'AlarmList', value: v}) }" v-show="toolsPanelActive === 'AlarmList' && !isPlatformTrack" />
      <VideoAlarm ref="VideoAlarm" @isUnread="v => { chnageToolIsUnread({type: 'VideoAlarm', value: v}) }" v-show="toolsPanelActive === 'VideoAlarm' && !isPlatformTrack"/>
      <IntelligentAlarm ref="IntelligentAlarm" @isUnread="v => { chnageToolIsUnread({type: 'IntelligentAlarm', value: v}) }" v-show="toolsPanelActive === 'IntelligentAlarm' && !isPlatformTrack" />
      <FireAlarmList ref="FireAlarmList" @isUnread="v => { chnageToolIsUnread({type: 'FireAlarmList', value: v}) }" v-show="toolsPanelActive === 'FireAlarmList' && !isPlatformTrack" />
      <AlarmHelpList ref="AlarmHelpList" @isUnread="v => { chnageToolIsUnread({type: 'AlarmHelpList', value: v}) }" v-show="toolsPanelActive === 'AlarmHelpList' && !isPlatformTrack" />
      <!-- <SinglePawnList @isUnread="v => { chnageToolIsUnread({type: 'SinglePawnList', value: v}) }" v-show="toolsPanelActive === 'SinglePawnList'" /> -->
      <IndividualPolice ref="IndividualPolice" @isUnread="v => { chnageToolIsUnread({type: 'IndividualPolice', value: v}) }" v-show="toolsPanelActive === 'IndividualPolice' && !isPlatformTrack" />
      <mapContact @isUnread="v => { chnageToolIsUnread({type: 'mapContact', value: v}) }" v-show="toolsPanelActive === 'mapContact' && !isPlatformTrack" />
      <!-- <Flight v-show="toolsPanelActive === 'Flight'" /> -->
      <box-choose v-if="toolsPanelActive === 'boxChoose'" @openRelayTrack="openRelayTrack"/>
      <!-- v-show="toolsPanelActive === 'boxChoose'" -->
      <div class="btn-panel-shrink" @click="closeToolsPanel" v-show="toolsPanelActive !== 'boxChoose'">
        <div class="shape">
          <Icon class="icon" type="chevron-right" />
        </div>
      </div>
    </div>
    <!-- 框选视频弹窗 -->
    <div v-if="isSelectBoxPreview">
      <selectBoxVideo @close='closeSelectModel' ref='selectBoxVideoModal' :pointList="previewPointList"></selectBoxVideo>
    </div>
    <!-- 接力追踪弹窗 -->
    <selectBoxRelayTrack @close='closeSelectBoxRelayTrack' ref='selectBoxRelayTrackModal'></selectBoxRelayTrack>
    <!-- 报警视频弹框 -->
    <!-- 报警视频弹框 || 报警轨迹弹框 || 一键报案弹窗-->
    <div>
      <mapAlarmAppVideo v-if="showVideo && !isPlatformTrack" @close='closeModal' :alarmData='itemAlarmInput' :alarmInputList="alarmList" :type="alarmModalType" @turnToTrail="turnToTrail"/>
      <!-- <AlarmTrail /> -->
      <IndividualModal v-if="patrolShow && !isPlatformTrack" :patrolData='patrolAloneData' :patrolAlarmDataList="singleAllList" :type="patrolModalType" @closePatrolModal="closePatModal"/>
      <!-- 一键报警弹窗 -->
      <CaseModal v-if="showReportPolice && !isPlatformTrack" :openModal='showReportPolice' :showSelectCamera="false" @cancelModal="cancelModal" modalTitle="新建案件" :cameraList="reportPoliceResource" />
      <!-- <Talkback v-if="isTalkModal" :isPcToApp="false" :soldierInfo="talkDataInfo.soldierInfo" @close="talkCloseClick(talkDataInfo.soldierInfo)"></Talkback> -->
    </div>
  </section>
</template>

<script>
import MapCount from './panels/mapCount'
import AlarmList from './panels/AlarmList.vue'
import FireAlarmList from './panels/FireAlarmList'
import AlarmHelpList from './panels/AlarmHelpList'
import selectBoxVideo from './panels/selectBoxVideo'
import selectBoxRelayTrack from './panels/selectBoxRelayTrack'
import boxChoose from './panels/boxChoose'
// import AlarmTrail from './panels/AlarmTrail'
import mapAlarmAppVideo from './alarmVideo/mapAlarmAppVideo'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { GEOMETRYTYPE } from 'assets/2DMap/meta/common'
import IntelligentAlarm from './panels/IntelligentAlarm'
import VideoAlarm from './panels/VideoAlarm'
import IndividualPolice from './panels/IndividualPolice'
import IndividualModal from './panels/IndividualChildren/individualModal'
import CaseModal from '../../business/caseModal'
import { read } from 'src/storage/index'
import mapContact from './panels/mapContact'
import { getSocket } from 'src/socket/socket.js'
import MouseTip from 'assets/2DMap/utils/mousetip/MouseTip.js'
import { getTrackingxg } from '@src/http/business/tracking.api'
import highLight from 'assets/2DMap/feature/edit/highLight'
export default {
  components: {
    MapCount,
    AlarmList,
    FireAlarmList,
    AlarmHelpList,
    // Flight,
    boxChoose,
    selectBoxVideo,
    selectBoxRelayTrack,
    // AlarmTrail,
    // Measure,
    mapAlarmAppVideo,
    IntelligentAlarm,
    VideoAlarm,
    IndividualPolice,
    IndividualModal,
    CaseModal,
    mapContact
  },
  data() {
    return {
      chooseDraw: false,
      boxChooseTypes: {
        polygon: GEOMETRYTYPE.MULTIPOLYGON,
        circle: GEOMETRYTYPE.CIRCLE,
        point: GEOMETRYTYPE.POINT
      },
      toolStyleObj: { right: '0px' }, // 工具栏动态样式
      showReportPolice: false,
      toolTiper: null, // 鼠标提示工具
      pointChooseMsg: '<span><i class="icon iconfont icon-dianxuan"></i> 点选要素</span>'
    }
  },
  computed: {
    ...mapState({
      playbackPointList: ({ mapPoint }) => mapPoint.playbackPointList, // 框选回放视频列表
      isOpenTrail: ({ map2DApplyIX }) => map2DApplyIX.isOpenTrail, // 人脸轨迹数据
      isSelectBoxPreview: ({ mapPoint }) => mapPoint.isSelectBoxPreview, // 是否打开框选预览
      isSelectBoxRelayTrack: ({ mapPoint }) => mapPoint.isSelectBoxRelayTrack, // 是否打开接力追踪
      previewPointList: ({ mapPoint }) => mapPoint.previewPointList,
      showVideo: ({ mapAlarm }) => mapAlarm.showVideo, // 各报警类型视频弹框控制
      itemAlarmInput: ({ mapAlarm }) => mapAlarm.itemAlarmInput,
      normalAlarmList: ({ mapAlarm }) => mapAlarm.normalAlarmList, // 普通报警
      fireAlarmList: ({ mapAlarm }) => mapAlarm.fireAlarmList, // 消防报警
      alarmModalType: ({ mapAlarm }) => mapAlarm.alarmModalType,
      alarmHelpList: ({ mapAlarm }) => mapAlarm.alarmHelpList, // 报警求助
      videoAlarmList: ({ mapAlarm }) => mapAlarm.videoAlarmList, // 视频报警
      intelligentAlarmList: ({ mapAlarm }) => mapAlarm.intelligentAlarmList, // 智能报警
      patrolAlarmList: ({ patrol2DAlarm }) => patrol2DAlarm.patrolAlarmList, // 巡更报警
      patrolModalType: ({ patrol2DAlarm }) => patrol2DAlarm.patrolModalType,
      patrolShow: ({ patrol2DAlarm }) => patrol2DAlarm.patrolShow,
      patrolAlarmData: ({ patrol2DAlarm }) => patrol2DAlarm.patrolAlarmData,
      singleAlarmData: ({ patrol2DAlarm }) => patrol2DAlarm.singleAlarmData, // 单兵单条报警数据
      singleAlarmList: ({ patrol2DAlarm }) => patrol2DAlarm.singleAlarmList, // 单兵
      isReportPolice: ({ mapAlarm }) => mapAlarm.isReportPolice,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig,
      isBsMapReady: ({ mapIndex }) => mapIndex.isBsMapReady,
      showTrackModal2D: ({ mapIndex }) => mapIndex.showTrackModal2D,
      showDrawTrack2D: ({ mapIndex }) => mapIndex.showDrawTrack2D,
      isGridStatistic: ({ map2DApplyIX }) => map2DApplyIX.isGridStatistic,
      talkDataInfo: ({ patrol2DAlarm }) => patrol2DAlarm.talkDataInfo,
      isTalkModal: ({ patrol2DAlarm }) => patrol2DAlarm.isTalkModal,
      reportPoliceResource: ({ mapAlarm }) => mapAlarm.reportPoliceResource,
      filterState: ({ map2DApplyIX }) => map2DApplyIX.filterState,
      boxChooseType: ({ map2DApplyIX }) => map2DApplyIX.boxChooseType,
      mapConfigArr: ({ mapIndex }) => mapIndex.mapConfigArr
    }),
    ...mapGetters('patrol2DAlarm', ['singleAllList']),
    ...mapGetters('map2DApplyIX', [
      'isShowToolsPanel',
      'toolsPanelActive',
      'toolsPanelIsUnread',
      'boxChooseSecPanelStatus',
      'isShowPTattr',
      'alarmFilter',
      'isPointChoose',
      'isPlatformTrack'
    ]),
    ...mapGetters({
      isMapOuter: 'isMapOuter', // 楼内外地图标志
      currentFloor: 'currentFloor', // 当前楼层
      toolVisible: 'toolVisible', // 消防报警资源数据
      isMeasurePanel: 'isMeasurePanel2D' // 消防报警要素
    }),
    alarmList() {
      let alarmLists = []
      switch (this.alarmModalType) {
        case 'AlarmList':
          alarmLists = JSON.parse(JSON.stringify(this.normalAlarmList))
          break
        case 'FireAlarmList':
          alarmLists = JSON.parse(JSON.stringify(this.fireAlarmList))
          break
        case 'AlarmHelpList':
          alarmLists = JSON.parse(JSON.stringify(this.alarmHelpList))
          break
        case 'VideoAlarm':
          alarmLists = JSON.parse(JSON.stringify(this.videoAlarmList))
          break
        case 'IntelligentAlarm':
          alarmLists = JSON.parse(JSON.stringify(this.intelligentAlarmList))
          break
      }
      return alarmLists
    },
    patrolAloneData(val) {
      let alarmAloneData
      switch (this.patrolModalType) {
        case 'AttrPatrol':
          alarmAloneData = this.patrolAlarmData
          break
        case 'AttrSinglePawn':
          alarmAloneData = this.singleAlarmData
          break
        case 'talkAlarm':
          alarmAloneData = this.talkDataInfo
          break
      }
      return alarmAloneData
    }
  },
  watch: {
    isBsMapReady(val) {
      if (val) {
        this.getMapAllAlarmList()
      }
    },
    toolVisible: {
      handler(flag) {
        this.toolStyleObj.right = flag ? '0px' : '-64px'
        this.switchTools() // 工具栏切换
        this.CHANGE_IS_OPEN_FIRST_TOOL_PANNEL(flag)
      },
      immediate: true
    },
    isMapOuter(flag) {
      if (!this.isPlatformTrack) {
        this.closeBoxChoose() // 关闭框选相关状态
      }
      this.setMeasurePanelVisible2D(false) // 关闭量算工具
    },
    currentFloor: {
      // 当前楼层的数据
      handler(data) {
        if (data && data._id && !this.isPlatformTrack) {
          this.closeBoxChoose() // 关闭框选相关状态
        }
      },
      deep: true,
      immediate: true
    },
    isShowPTattr(val) {
      if (val) {
        this.chooseDraw = false
        this.setMeasurePanelVisible2D(false) // 关闭2D量算状态
        this.changeBoxChooseSecPanelStatus(false)
      }
    },
    // 接力追踪
    isSelectBoxRelayTrack(val) {
      if (val) {
        // 打开
        this.$refs.selectBoxRelayTrackModal.openModal()
      } else {
        // 关闭
        this.$refs.selectBoxRelayTrackModal.closeMode()
        this.setMapPreviewPointList([])
        this.switchToolsPanel(false)
      }
    },
    isMeasurePanel(flag) {
      if (flag) {
        // 开启量算时
        this.closeToolsPanel() // 关闭其他面板
        if (this.showTrackModal2D || this.showDrawTrack2D) {
          this.controlTrackSearch() // 控制轨迹查询显示
        }
      }
    },
    showVideo(val) {
      if (val) {
        this.SAVE_ISMODAL_SURE_OR_CLEAN(false)
      } else {
        this.SAVE_ITEM_ALARM_INPUT({})
        this.SAVE_ISMODAL_SURE_OR_CLEAN(true)
      }
    },
    toolsPanelActive() {
      this.changePoliceStatus()
    },
    previewPointList: {
      // 框选预览视频变化
      handler(arr) {
        this.changePoliceStatus() // 改变一键报案的状态
      },
      deep: true
    },
    'filterState.isCommonAlarm.checked': {
      handler() {
        if (this.toolsPanelActive === 'AlarmList') {
          this.closeToolsPanel()
        }
      },
      deep: true
    },
    'filterState.isAlarmVideo.checked': {
      handler() {
        if (this.toolsPanelActive === 'VideoAlarm') {
          this.closeToolsPanel()
        }
      },
      deep: true
    },
    'filterState.isIntelligence.checked': {
      handler() {
        if (this.toolsPanelActive === 'IntelligentAlarm') {
          this.closeToolsPanel()
        }
      },
      deep: true
    },
    'filterState.isFireControl.checked': {
      handler() {
        if (this.toolsPanelActive === 'FireAlarmList') {
          this.closeToolsPanel()
        }
      },
      deep: true
    },
    'filterState.isAlarmHelp.checked': {
      handler() {
        if (this.toolsPanelActive === 'AlarmHelpList') {
          this.closeToolsPanel()
        }
      },
      deep: true
    },
    'filterState.isAlarmSingle.checked': {
      handler() {
        if (this.toolsPanelActive === 'IndividualPolice') {
          this.closeToolsPanel()
        }
      },
      deep: true
    },
    isPointChoose(flag) {
      // 点选状态
      this.initToolTiper() // 初始化提示工具
      if (flag) {
        this.$context2D.map.on('pointermove', this.changeToolTiperShowPosition)
      } else {
        this.$context2D.map.un('pointermove', this.changeToolTiperShowPosition)
        this.toolTiper.setVisible(false)
      }
    }
  },
  created() {
    getSocket().emit('patrol:instant.message', { usrid: read('userId') })
    /**
     * *************************************************************************************************************
     * 判断 是否为跳转过来进入要进入【接力追踪模式】的
     */
    // 若有路由传参时，则为【接力追踪】事件
    if (JSON.stringify(this.$route.params) !== '{}') {
      sessionStorage.setItem('trackEvent', JSON.stringify(this.$route.params))
    }
    // 当时用【sessionStorage.removeItem('trackEvent')】清空时，该键值清空
    // sessionStorage.getItem('trackEvent')  为 null
    // 当【sessionStorage】有【trackEvent】字段时，则为【接力追踪】模式（应对刷新状态）
    if (sessionStorage.getItem('trackEvent')) {
      this.SET_PLATFORM_TRACK(true) // 进入【接力追踪】模式
      getTrackingxg(JSON.parse(sessionStorage.getItem('trackEvent')).id)
        .then(res => {
          // console.log('接力追踪事件', res.data)
          // 过滤，当查询的资源id无数据时，会返回'ok'
          if (res.data === 'ok') {
            this.$Notice.warning({
              title: '警告',
              desc: '未查询到该视频通道资源'
            })
            return
          }
          // 左侧列表数据
          this.TRACK_INFO_TO_MAP_TAB(res.data) // 追踪信息
          // 右侧列表数据
          /**
           * res.data.resourceList为视频资源数据，
           * 修改数据格式
           * res.data.resourceList = [{ startTime: (s), endTime: (s), resource: {(资源的数据)}}]
           * 将startTime和endTime的data存入resource的collectTime中，方便使用
           * 修改数据格式，将时间保存在 resource.collectTime 中
           */
          res.data.mapList.forEach(e => {
            if (e.resource) {
              e.resource.collectTime = { startTime: e.startTime * 1000, endTime: e.endTime * 1000 }
              this.PUSH_PLAYBACK_VIDEO_DATA_LIST(e.resource)
            }
          })
          if (this.playbackPointList.length === 1) {
            const node = this.playbackPointList[0]
            this.toMapCenter(node._id)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  methods: {
    ...mapActions('map2DApplyIX', [
      'openToolsPanel',
      'closeToolsPanel',
      'chnageToolIsUnread',
      'changeBoxChooseSecPanelStatus',
      'switchToolsPanel',
      'closePTattr',
      'openAlarmTrail',
      'changeOpenAlarmPanel',
      'changeBoxChooseType',
      'getMap2DResouseList',
      'getMap2DAlarmList',
      'changeToolsPanelToBoxChoose',
      'changeIsPointChoose'
    ]),
    ...mapActions([
      'setAreaDrawActive',
      'setIsSelectBoxPreview',
      'setMapPreviewPointList',
      'setToolVisible',
      'emergencyAction',
      'setMeasurePanelVisible2D',
      'changeMeasureMode2D',
      'setIsSelectBoxRelayTrack',
      'setSelect2DSingleList',
      'changeShowTrackModal2D',
      'changeShowDrawTrack2D',
      'getCommonPointResById',
      'setActiveMapConfig',
      'setIsMapOuter',
      'getFoorById',
      'setCurrentFloor'
    ]),
    ...mapActions('mapAlarm', ['getMapAlarmList', 'getMapAllAlarmList']),
    ...mapMutations('mapAlarm', [
      'CHANGE_SHOWVIDEO',
      'SAVE_ISMODAL_SURE_OR_CLEAN',
      'SAVE_ITEM_ALARM_INPUT',
      'CLEAR_ALL_ALARM_LIST',
      'GET_ALARM_MODAL_TYPE',
      'CHANGE_REPORT_POLICE',
      'SAVE_ALARM_CHANGE',
      'CHANGE_REPORT_POLICE_RESOURCE',
      'SET_FACE_IMAGE_URL' // 报警跳转轨迹追踪，路径存储
    ]),
    ...mapMutations('patrol2DAlarm', [
      'SAVE_PATROL_STUATES',
      'SAVE_PATROL_ID',
      'SAVE_MODAL_STATUS'
    ]),
    ...mapMutations(['SET_SHOW_MAP_RESOURCE_ATTRIBUTES', 'SET_CHECKEDVIDEO_POINT_LIST', 'PUSH_PLAYBACK_VIDEO_DATA_LIST', 'SET_LOCATE_FEATURES']),
    ...mapMutations('map2DApplyIX', [
      'CHANGE_IS_OPEN_FIRST_TOOL_PANNEL',
      'CHANGE_IS_GRID_STATISTIC',
      'SET_PLATFORM_TRACK',
      'TRACK_INFO_TO_MAP_TAB'
    ]),
    initToolTiper() {
      if (!this.toolTiper && this.$context2D) {
        let targetElement = this.$context2D.map.getTargetElement()
        this.toolTiper = new MouseTip(targetElement)
      }
    },
    changeToolTiperShowPosition(event) {
      // 改变提示工具的显示位置
      // console.log('鼠标移动位置：', event)
      this.toolTiper.showAt({ x: event.pixel[0], y: event.pixel[1] }, this.pointChooseMsg)
    },
    closeModal() {
      this.CHANGE_SHOWVIDEO(false)
      this.changeOpenAlarmPanel(false)
    },
    // 关闭巡更、单兵弹出框
    closePatModal() {
      this.SAVE_PATROL_STUATES(false)
      this.changeOpenAlarmPanel(false)
      this.SAVE_MODAL_STATUS(false)
    },
    changeToolVisible() {
      // 处理工具栏显隐状态变化
      this.setToolVisible(!this.toolVisible)
    },
    switchTools() {
      if (!this.toolVisible) {
        this.closeToolsPanel()
      }
    },
    showSecPanel() {
      // 改变框选面板
      this.chooseDraw = !this.chooseDraw
      let status = this.boxChooseSecPanelStatus
      status = !status
      this.changeBoxChooseSecPanelStatus(status) // 显示框选类型
      if (this.toolsPanelActive !== 'boxChoose') {
        this.openToolsPanel('')
        this.switchToolsPanel(false) // 是否显示二级面板
      }
      this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false) // 关闭资源信息面板
    },
    closeBoxChoose() {
      // 关闭框选相关状态
      this.chooseDraw = false
      this.changeBoxChooseSecPanelStatus(false)
      this.setAreaDrawActive(false) // 关闭区域绘制
      this.changeIsPointChoose(false) // 关闭点选
      if (this.toolsPanelActive === 'boxChoose') {
        // 工具面板未框选面板时
        this.switchToolsPanel(false) // 编辑工具面板
      }
    },
    changeTrackStatus() {
      // 改变轨迹状态
      this.changeIsPointChoose(false)
      this.setMeasurePanelVisible2D(false) // 关闭量算
      this.closeBoxChoose() // 关闭框选
      this.openToolsPanel('')
      this.switchToolsPanel(false) // 是否显示二级面板
      this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false) // 关闭资源信息面板
      this.controlTrackSearch() // 控制轨迹查询显示
    },
    controlTrackSearch() {
      // 控制轨迹查询显示
      if (this.showTrackModal2D || this.showDrawTrack2D) {
        this.changeShowTrackModal2D(false) // 设置不显示轨迹查询弹出框
        this.changeShowDrawTrack2D(false) // 设置不显示绘制轨迹
      } else if (!this.showTrackModal2D) {
        // 未打开轨迹查询弹出框时
        this.changeShowTrackModal2D(true) // 设置显示轨迹查询弹出框
      }
    },
    openPanel(v) {
      if (this.isPlatformTrack) {
        return
      }
      this.changeIsPointChoose(false)
      this.chooseDraw = false
      this.setMeasurePanelVisible2D(false) // 关闭量算状态
      this.changeBoxChooseSecPanelStatus(false) // 关闭框选
      this.openToolsPanel(v)
      if (this.isGridStatistic) {
        this.CHANGE_IS_GRID_STATISTIC(false)
      }
      if (v === 'MapCount') {
        this.getMap2DResouseList(this.activeMapConfig.mapId)
        this.getMap2DAlarmList(this.activeMapConfig.mapId)
        return
      }
      const alarms = [
        'AlarmList',
        'VideoAlarm',
        'IntelligentAlarm',
        'FireAlarmList',
        'AlarmHelpList',
        'IndividualPolice'
      ]
      if (alarms.includes(v)) {
        this.$refs[v].expand()
      }
    },
    boxChooseStatus(type) {
      this.changeIsPointChoose(false)
      // 涉及点选不清除预览资源
      if (this.boxChooseType !== this.boxChooseTypes.point && type !== this.boxChooseTypes.point) {
        this.setMapPreviewPointList([])
      }
      // 框选时，删除高亮
      this.SET_LOCATE_FEATURES([])
      // 改变框选状态
      this.changeBoxChooseType(type) // 改变框选类型
      if (type === GEOMETRYTYPE.POINT) {
        // 点选
        this.changeIsPointChoose(true) // 开启点选
      } else if ([GEOMETRYTYPE.MULTIPOLYGON, GEOMETRYTYPE.CIRCLE].includes(type)) {
        // 框选
        this.setAreaDrawActive(true) // 激活区域绘制
      }
      this.showSecPanel()
      this.$refs && this.$refs.selectBoxRelayTrackModal && this.$refs.selectBoxRelayTrackModal.scaleModal(true)
      // this.closeToolsPanel()
    },
    openRelayTrack() {
      this.$refs && this.$refs.selectBoxRelayTrackModal && this.$refs.selectBoxRelayTrackModal.scaleModal(false)
    },
    changeMeasureStatus() {
      if (this.isPlatformTrack) {
        return
      }
      this.changeIsPointChoose(false)
      // 改变量算状态
      let status = !this.isMeasurePanel
      this.setMeasurePanelVisible2D(status)
    },
    measureDistance() {
      // 测距
      let type = GEOMETRYTYPE.POLYLINE
      this.changeMeasureMode2D(type) // 改变2D量算模式
    },
    measureArea() {
      // 测面
      let type = GEOMETRYTYPE.POLYGON
      this.changeMeasureMode2D(type) // 改变2D量算模式
    },
    openManualarmModal() {
      // 手工报警
      if (this.showVideo || this.isPlatformTrack) {
        return
      }
      const param = {
        time: Date.now() / 1000,
        organization: '',
        name: '',
        level: 1,
        eventTypeName: '手工报警',
        actionList: {},
        isNameDisabled: false,
        alarmaffirm: {
          handaffirm: {
            status: false
          },
          handaffirm2: {
            status: true
          }
        }
      }
      this.CHANGE_SHOWVIDEO(true)
      this.GET_ALARM_MODAL_TYPE('ManualAlarm')
      this.SAVE_ITEM_ALARM_INPUT(param)
      this.changeOpenAlarmPanel(true)
      this.emergencyAction({ planId: '20' })
      this.changeIsPointChoose(false)
    },
    openReportPolice() {
      if (this.showVideo || this.isPlatformTrack) {
        return
      }
      if (this.isReportPolice) {
        // 可以打开一键报案
        this.changeIsPointChoose(false)
        this.CHANGE_REPORT_POLICE(true)
        this.GET_ALARM_MODAL_TYPE('ReportPolice')
        this.showReportPolice = !this.showReportPolice
      }
    },
    closeReportPolice() {
      // 关闭一键报案弹窗
      this.CHANGE_SHOWVIDEO(false)
      this.GET_ALARM_MODAL_TYPE('')
      this.showReportPolice = false
    },
    closeSelectModel() {
      this.setIsSelectBoxPreview(false)
    },
    // 关闭接力追踪视屏窗口
    closeSelectBoxRelayTrack() {
      this.setMapPreviewPointList([])
      this.setSelect2DSingleList([])
      this.setAreaDrawActive(false)
      this.changeIsPointChoose(false) // 关闭点选
      this.changeToolsPanelToBoxChoose('')
      this.switchToolsPanel(false)
      this.setIsSelectBoxRelayTrack(false)
      this.isBackTrack = false
      this.setIsSelectBoxPreview(false)
      this.SET_PLAYBACK_TRACK_VODEO_LIST([])
    },
    changePoliceStatus() {
      if (this.isShowToolsPanel && this.toolsPanelActive === 'boxChoose' && this.previewPointList.length > 0) {
        this.CHANGE_REPORT_POLICE(true)
        const resourceIdArr = []
        for (let i = 0; i < this.previewPointList.length; i++) {
          resourceIdArr.push({ resource: this.previewPointList[i]._id })
        }
        this.CHANGE_REPORT_POLICE_RESOURCE(resourceIdArr)
      } else {
        this.CHANGE_REPORT_POLICE(false)
        this.CHANGE_REPORT_POLICE_RESOURCE([])
      }
    },
    // 关闭一键报警弹窗
    cancelModal(flag) {
      this.showReportPolice = flag
    },
    toMapCenter(id) {
      this.getCommonPointResById(id).then(res => {
        const data = JSON.parse(JSON.stringify(res))
        if (data.point) {
          let mapId = data.point.mapId
          if (!mapId) {
            return
          }
          let loc = data.point.loc
          let isouter = data.point.isouter
          let sid = data.point.sid
          if (mapId !== this.activeMapConfig.mapId) {
            for (const config of this.mapConfigArr) {
              if (mapId === config.mapId) {
                this.setActiveMapConfig(config) // 设置当前地图配置
                this.setIsMapOuter(true)
                break
              }
            }
          }
          let id = data._id
          if (this.$context2D.map) {
            if (this.isMapOuter) {
              if (isouter) {
                this.pointToCenter(loc, id)
              } else {
                this.getFoorById(sid).then(res => {
                  this.setCurrentFloor(res)
                  this.setIsMapOuter(false)
                  this.pointToCenter(loc, id)
                })
              }
            } else {
              if (isouter) {
                this.setIsMapOuter(true)
                this.setCurrentFloor({})
                this.pointToCenter(loc, id)
              } else {
                if (this.currentFloor._id === sid) {
                  this.pointToCenter(loc, id)
                } else {
                  this.getFoorById(sid).then(res => {
                    this.setCurrentFloor(res)
                    this.setIsMapOuter(false)
                    this.pointToCenter(loc, id)
                  })
                }
              }
            }
          }
        } else {
          this.warningMsg('该资源未添加到地图！')
        }
      })
    },
    pointToCenter(center, id) {
      let centerCoordinates = center.split(',').map(item => Number(item))
      setTimeout(() => {
        this.$context2D && this.$context2D.map.getView().setCenter(centerCoordinates)
      }, 100)
      let feature = highLight.getLocateFeature(id, centerCoordinates)
      this.SET_LOCATE_FEATURES([feature])
    },
    // 跳转至 轨迹追踪
    turnToTrail(img) {
      this.SET_FACE_IMAGE_URL(img)
      this.changeTrackStatus()
    }
  },
  beforeDestroy() {
    this.toolTiper && this.toolTiper.destory() // 销毁鼠标提示
    this.closeToolsPanel()
    this.setMeasurePanelVisible2D(false)
    this.CHANGE_SHOWVIDEO(false)
    this.CHANGE_REPORT_POLICE(false)
    this.CLEAR_ALL_ALARM_LIST()
  }
}
</script>

<style lang="less" scoped>
.sec-panel-show {
  visibility: hidden;
}
.box-choose {
  position: absolute;
  left: -34px;
  top: 86px;
  background: #4391ed;
  width: 34px;
  text-align: center;
  // transition: all 0.3s ease-in-out;
  p.icon {
    font-size: 20px !important;
  }
}
.tools {
  width: 64px;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  z-index: 9;
  .tool-area {
    display: flex;
    flex: auto;
    width: 100%;
    margin-top: 20px;
    // overflow: hidden;
    .tool-list {
      display: flex;
      flex-direction: column;
      flex: auto;
      padding: 0 6px;
      background-color: rgba(15, 35, 67, 0.8);
      // transition: all 0.3s ease;
      transform: translateX(0);
      &.hidden {
        display: none;
      }
      li {
        display: flex;
        flex: auto;
        width: 100%;
        justify-content: center;
        align-items: center;
        &.cut-off-line {
          border-bottom: 1px solid rgba(58, 90, 139, 0.4);
        }
        .icon {
          color: #fff;
          font-size: 32px;
          cursor: pointer;
          &.active {
            color: #4699f9;
          }
        }
        .active {
          color: #4699f9;
        }
        .measure-box {
          width: 96px;
          position: absolute;
          left: -96px;
          bottom: 0;
          background: rgba(15, 35, 67, 0.8);
        }
      }
    }
  }
  .panel {
    width: 272px;
    height: 100%;
    display: block;
    position: absolute;
    top: 0;
    left: -272px;
    background: #0f2343;
    // transition: all 0.3s ease;
    z-index: -1;
    &.hidden {
      left: 76px;
    }
    .btn-panel-shrink {
      width: 16px;
      height: 86px;
      position: absolute;
      top: 50%;
      left: -16px;
      cursor: pointer;
      overflow: hidden;
      .shape {
        position: absolute;
        left: -16px;
        height: 86px;
        border: 16px solid transparent;
        border-right: 16px solid rgba(15, 35, 67, 0.8);
      }
      .icon {
        position: absolute;
        left: 5px;
        top: 50%;
        margin-top: -6px;
      }
    }
  }
}
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
</style>
