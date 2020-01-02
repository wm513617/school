<template>
  <section class="tools">
    <button class="btn-shrink" @click="switchTools">
      <Icon :type="isToolShow ? 'chevron-right' : 'chevron-left'" />
    </button>
    <section class="tool-area">
      <ul class="tool-list" :class="{'hidden': !isToolShow}">
        <li class="cut-off-line">
          <i @click="showSecPanel()" class="icon iconfont icon-b_icon__screenshot" :class="{'active': choose3DDraw}" type="ios-crop">
            <div class="box-choose" ref="secPanel" :class="{'sec-panel-show':!boxChooseSecPanelStatus}">
              <p class="icon iconfont icon-dianxuan" title="点选" @click.stop="togglePointChooseStatus"></p>
              <p class="icon iconfont icon-kuangxuan1" title="框选" @click.stop="boxChooseStatus"></p>
            </div>
          </i>
        </li>
        <li>
          <i
            @click="openPanel('normalAlarmList')"
            class="icon iconfont icon-baojing2"
            :class="{
              'active': toolsPanelActive === 'normalAlarmList',
              'animation-flicker-red': toolsPanelActive !== 'normalAlarmList' && toolsPanelIsUnread('normalAlarmList')
            }"
            type="ios-alarm"
          ></i>
        </li>
        <li>
          <i
            @click="openPanel('videoAlarmList')"
            class="icon iconfont icon-shipinbaojing"
            :class="{
              'active': toolsPanelActive === 'videoAlarmList',
              'animation-flicker-red': toolsPanelActive !== 'videoAlarmList' && toolsPanelIsUnread('videoAlarmList')
            }"
          ></i>
        </li>
        <li>
          <i
            @click="openPanel('intelligentAlarmList')"
            class="icon iconfont icon-zhinengbaojing"
            :class="{
              'active': toolsPanelActive === 'intelligentAlarmList',
              'animation-flicker-red': toolsPanelActive !== 'intelligentAlarmList' && toolsPanelIsUnread('intelligentAlarmList')
            }"
          ></i>
        </li>
        <li>
          <i
            @click="openPanel('fireAlarmList')"
            class="icon iconfont icon-xiaofangbaojing11"
            :class="{
              'active': toolsPanelActive === 'fireAlarmList',
              'animation-flicker-red': toolsPanelActive !== 'fireAlarmList' && toolsPanelIsUnread('fireAlarmList')
            }"
            type="ios-bell"
          ></i>
        </li>
        <li>
          <i
            @click="openPanel('alarmHelpList')"
            class="icon iconfont icon-baojingqiuzhu1"
            :class="{
              'active': toolsPanelActive === 'alarmHelpList',
              'animation-flicker-red': toolsPanelActive !== 'alarmHelpList' && toolsPanelIsUnread('alarmHelpList')
            }"
            type="android-hand"
          ></i>
        </li>
        <li>
          <i
            @click="openPanel('IndividualPolice')"
            class="icon iconfont icon-yidongdanbing"
            :class="{
              'active': toolsPanelActive === 'IndividualPolice',
              'animation-flicker-red': toolsPanelActive !== 'IndividualPolice' && toolsPanelIsUnread('IndividualPolice')
            }"
            type="man"
          ></i>
        </li>
        <li class="cut-off-line">
          <i
            @click="openManualarmModal"
            class="icon iconfont icon-shougongbaojing1"
            :class="{
              'active': toolsPanelActive === 'ManualAlarm'
            }"
            :style="{'cursor': showVideo ? 'not-allowed' : 'pointer'}"
          ></i>
        </li>
        <li v-show="is3DMapOuter && ready">
          <i
            @click="changeTrackStatus"
            class="icon iconfont icon-guijichaxun1"
            :class="{'active': showTrackModal || showDrawTrack}"
            type="ios-shuffle-strong"
          ></i>
        </li>
        <li>
          <i
            @click="changeMeasureStatus"
            class="icon iconfont icon-ceju"
            :class="{'active': (is3DMapOuter && isMeasurePanel3D) || (!is3DMapOuter && isMeasurePanelIndoor)}"
            type="ios-paperplane"
          >
          </i>
            <Measure v-if="is3DMapOuter && isMeasurePanel3D" ref="measure" class="measure-box-outdoor"></Measure>
            <div v-else-if="!is3DMapOuter && isMeasurePanelIndoor" class="measure-box-indoor">
              <Button type="text" size="small" @click.stop="measureDistance" style="margin-left: 6px">测距</Button>
              <Button type="text" size="small" @click.stop="measureArea">测面</Button>
            </div>
        </li>
        <li v-show="is3DMapOuter && ready">
          <i
            @click="openPanel('Flight')"
            class="icon iconfont icon-feihang"
            :class="{'active': toolsPanelActive === 'Flight'}"
            type="ios-paperplane"
          >
          </i>
        </li>
      </ul>
    </section>
    <!-- 二级面板 -->
    <div class="panel" :class="{'hidden': !isShowToolsPanel}">
      <VideoAlarm ref="videoAlarmList" @isUnread="v => { chnageToolIsUnread({type: 'videoAlarmList', value: v}) }" v-show="toolsPanelActive === 'videoAlarmList'"/>
      <AlarmList ref="normalAlarmList" @isUnread="v => { chnageToolIsUnread({type: 'normalAlarmList', value: v}) }" v-show="toolsPanelActive === 'normalAlarmList'" />
      <IntelligentAlarm ref="intelligentAlarmList" @isUnread="v => { chnageToolIsUnread({type: 'intelligentAlarmList', value: v}) }" v-show="toolsPanelActive === 'intelligentAlarmList'" />
      <FireAlarmList ref="fireAlarmList" @isUnread="v => { chnageToolIsUnread({type: 'fireAlarmList', value: v}) }" v-show="toolsPanelActive === 'fireAlarmList'" />
      <AlarmHelpList ref="alarmHelpList" @isUnread="v => { chnageToolIsUnread({type: 'alarmHelpList', value: v}) }" v-show="toolsPanelActive === 'alarmHelpList'" />
      <!-- <SinglePawnList @isUnread="v => { chnageToolIsUnread({type: 'SinglePawnList', value: v}) }" v-show="toolsPanelActive === 'SinglePawnList'" /> -->
      <IndividualPolice ref="IndividualPolice" @isUnread="v => { chnageToolIsUnread({type: 'IndividualPolice', value: v}) }" v-show="toolsPanelActive === 'IndividualPolice'" />
      <Flight v-show="toolsPanelActive === 'Flight'" />
      <box-choose @region="$emit('region')" v-if="toolsPanelActive === 'boxChoose'"/>
      <!-- v-show="toolsPanelActive === 'boxChoose'" -->
      <div class="btn-panel-shrink" @click="closeToolsPanel" v-show="toolsPanelActive !== 'boxChoose'">
        <div class="shape">
          <Icon class="icon" type="chevron-right" />
        </div>
      </div>
    </div>
    <!-- 报警视频弹框 -->
    <div>
      <mapAlarmAppVideo v-if="showVideo" @close='closeModal' :alarmData='itemAlarmInput' :alarmInputList="alarmList" :type="alarmModalType"/>
      <IndividualModal v-if="patrolShow" :patrolData='patrolAloneData' :patrolAlarmDataList="singleAllList" :type="patrolModalType" @closePatrolModal="closePatModal"/>
    </div>
  </section>
</template>

<script>
import AlarmList from './panels/AlarmList.vue'
import FireAlarmList from './panels/FireAlarmList'
import AlarmHelpList from './panels/AlarmHelpList'
import IndividualPolice from './panels/IndividualPolice'
import Flight from './panels/Flight'
import boxChoose from './panels/boxChoose'
import Measure from './panels/Measure'
import mapAlarmAppVideo from './alarmVideo/mapAlarmAppVideo'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import IntelligentAlarm from './panels/IntelligentAlarm'
import VideoAlarm from './panels/VideoAlarm'
import IndividualModal from './panels/IndividualChildren/individualModal'
import {GeometryType} from 'assets/3DMap/GeometryType.js'
import { read } from 'src/storage/index'
import { getSocket } from 'src/socket/socket.js'
export default {
  components: {
    AlarmList,
    FireAlarmList,
    AlarmHelpList,
    IndividualPolice,
    Flight,
    boxChoose,
    Measure,
    mapAlarmAppVideo,
    IntelligentAlarm,
    VideoAlarm,
    IndividualModal
  },
  data() {
    return {
      isToolShow: true,
      choose3DDraw: false
    }
  },
  computed: {
    ...mapState({
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 三维地图和楼层平面图切换的标识
      ready: ({ tdIndex }) => tdIndex.ready, // 三维地图是否加载完成的标识----
      showTrackModal: ({ tdIndex }) => tdIndex.showTrackModal, // 是否显示轨迹查询弹出框
      showDrawTrack: ({ tdIndex }) => tdIndex.showDrawTrack, // 是否显示绘制轨迹
      active3DDraw: ({ tdIndex }) => tdIndex.active3DDraw, // 框选激活
      showVideo: ({ alarmThreeD }) => alarmThreeD.showVideo, // 各报警类型视频弹框控制
      itemAlarmInput: ({ alarmThreeD }) => alarmThreeD.itemAlarmInput,
      normalAlarmList: ({ alarmThreeD }) => alarmThreeD.normalAlarmList, // 普通报警
      fireAlarmList: ({ alarmThreeD }) => alarmThreeD.fireAlarmList, // 消防报警
      alarmModalType: ({ alarmThreeD }) => alarmThreeD.alarmModalType,
      alarmHelpList: ({ alarmThreeD }) => alarmThreeD.alarmHelpList, // 报警求助
      videoAlarmList: ({ alarmThreeD }) => alarmThreeD.videoAlarmList, // 视频报警
      intelligentAlarmList: ({ alarmThreeD }) => alarmThreeD.intelligentAlarmList, // 智能报警
      patrolAlarmList: ({ patrolAlarm }) => patrolAlarm.patrolAlarmList, // 巡更报警
      patrolModalType: ({ patrolAlarm }) => patrolAlarm.patrolModalType,
      patrolShow: ({ patrolAlarm }) => patrolAlarm.patrolShow,
      patrolAlarmData: ({ patrolAlarm }) => patrolAlarm.patrolAlarmData,
      singleAlarmData: ({ patrolAlarm }) => patrolAlarm.singleAlarmData, // 单兵单条报警数据
      singleAlarmList: ({ patrolAlarm }) => patrolAlarm.singleAlarmList, // 单兵
      talkDataInfo: ({ patrolAlarm }) => patrolAlarm.talkDataInfo
      // isTalkModal: ({ patrolAlarm }) => patrolAlarm.isTalkModal
    }),
    ...mapGetters('map3DApplyIX', ['isShowToolsPanel', 'toolsPanelActive', 'toolsPanelIsUnread', 'boxChooseSecPanelStatus', 'isShowPTattr', 'isMeasurePanel3D', 'isMeasurePanelIndoor']),
    ...mapGetters(['singleAllList']),
    alarmList() {
      let alarmLists = []
      switch (this.alarmModalType) {
        case 'AlarmList':
          alarmLists = this.normalAlarmList
          break
        case 'FireAlarmList':
          alarmLists = this.fireAlarmList
          break
        case 'AlarmHelpList':
          alarmLists = this.alarmHelpList
          break
        case 'VideoAlarm':
          alarmLists = this.videoAlarmList
          break
        case 'IntelligentAlarm':
        case 'FaceAlarm':
          alarmLists = this.intelligentAlarmList
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
    ready(val) {
      if (val) {
        this.getMap3DAllAlarmList()
      }
    },
    isShowPTattr(val) {
      if (val) {
        this.choose3DDraw = false
        this.closeMeasurePanel() // 关闭量算面板
        this.changeBoxChooseSecPanelStatus(false)
      }
    },
    isMeasurePanel3D(flag) {
      if (flag) { // 开启量算时
        this.closeToolsPanel() // 关闭其他面板
        if (this.showTrackModal || this.showDrawTrack) { // 轨迹高亮时
          this.$emit('Locus') // 抛出轨迹控制处理事件
        }
      } else { // 关闭量算时，清空测量工具
        if (this.is3DMapOuter) {
          let measureTools = this.$refs.measure ? this.$refs.measure.meatureTools : null
          if (measureTools) {
            measureTools.clearAll() // 清空绘制
            measureTools.deactiveAll() // 关闭绘制
          }
        } else {
          let mode = {isMeasure: false}
          this.changeMeasureModeIndoor(mode) // 关闭室内量算状态
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
    is3DMapOuter(newFlag, oldFlag) { // 楼内外地图变化监听
      this.closeMeasurePanel() // 关闭量算面板
    }
  },
  created() {
    getSocket().emit('patrol:instant.message', { usrid: read('userId') })
  },
  methods: {
    ...mapActions(['set3DActiveDraw', 'emergencyAction', 'getMapAlarmList', 'getMap3DAllAlarmList']),
    ...mapActions('map3DApplyIX', ['changeMeasureModeIndoor', 'changeIsMeasurePanel3D', 'openToolsPanel', 'closeToolsPanel', 'chnageToolIsUnread', 'changeBoxChooseSecPanelStatus', 'changePointChooseStatus', 'switchToolsPanel', 'closePTattr', 'changeOpenAlarmPanel']),
    ...mapMutations(['CHANGE_SHOWVIDEO', 'SAVE_ISMODAL_SURE_OR_CLEAN', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_PATROL_STUATES', 'CLEAR_ALL_ALARM_LIST', 'GET_ALARM_MODAL_TYPE', 'SAVE_PATROL_RELY_STUATES', 'SAVE_TALK_STUATES', 'SAVE_PATROL_ID', 'SAVE_MODAL_STATUS']),
    ...mapMutations('map3DApplyIX', ['CHANGE_IS_OPEN_FIRST_TOOL_PANNEL']),
    measureDistance() { // 测距
      let mode = {type: GeometryType.POLYLINE, isMeasure: true}
      this.changeMeasureModeIndoor(mode) // 改变室内量算模式
    },
    measureArea() { // 测面
      let mode = {type: GeometryType.POLYGON, isMeasure: true}
      this.changeMeasureModeIndoor(mode) // 改变室内量算模式
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
    switchTools() {
      this.isToolShow = !this.isToolShow
      this.CHANGE_IS_OPEN_FIRST_TOOL_PANNEL(this.isToolShow)
      if (!this.isToolShow) {
        this.closeToolsPanel()
      }
    },
    showSecPanel() {
      this.closePTattr(false)
      this.choose3DDraw = !this.choose3DDraw
      let status = this.boxChooseSecPanelStatus
      status = !status
      this.changeBoxChooseSecPanelStatus(status)
      this.openToolsPanel('')
      this.switchToolsPanel(false)
    },
    openPanel(v) {
      this.openToolsPanel(v)
      this.choose3DDraw = false
      this.closeMeasurePanel(false) // 关闭量算面板
      this.changeBoxChooseSecPanelStatus(false)
      const alarms = ['normalAlarmList', 'videoAlarmList', 'intelligentAlarmList', 'fireAlarmList', 'alarmHelpList', 'IndividualPolice']
      if (alarms.includes(v)) {
        this.$refs[v].expand()
      }
    },
    togglePointChooseStatus() {
      this.set3DActiveDraw(false) // 关闭区域绘制
      this.changePointChooseStatus(true) // 开启点选状态
      this.showSecPanel()
    },
    boxChooseStatus() {
      this.showSecPanel()
      this.closeToolsPanel()
      this.changePointChooseStatus(false) // 关闭点选状态
      this.$emit('region')
    },
    changeTrackStatus() { // 改变轨迹状态
      this.closeMeasurePanel() // 关闭量算面板
      this.closeToolsPanel()
      this.$emit('Locus') // 抛出改变轨迹状态事件
    },
    changeMeasureStatus() { // 改变量算状态
      if (this.is3DMapOuter) {
        let flag = !this.isMeasurePanel3D
        this.changeIsMeasurePanel3D(flag) // 控制2D量算面板是否显示
      } else {
        let flag = !this.isMeasurePanelIndoor
        let mode = {}
        if (!flag) {
          mode = {panelVisible: flag, isMeasure: flag}
        } else {
          mode = {panelVisible: flag}
        }
        this.changeMeasureModeIndoor(mode) // 关闭室内量算面板
      }
    },
    closeMeasurePanel() { // 关闭量算面板
      if (this.is3DMapOuter) {
        this.changeIsMeasurePanel3D(false) // 关闭3D量算面板
      } else {
        let mode = {panelVisible: false, isMeasure: false}
        this.changeMeasureModeIndoor(mode) // 关闭室内量算面板
      }
    },
    openManualarmModal() { // 手工报警
      if (this.showVideo) { return }
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
    }
  },
  beforeDestroy() {
    this.closeToolsPanel()
    this.CHANGE_SHOWVIDEO(false)
    this.SAVE_PATROL_STUATES(false)
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
  top: 30px;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9;
  .btn-shrink {
    flex: 0 0 20px;
    width: 100%;
    background-color: rgba(15, 35, 67, 0.8);
    border: none;
    color: #fff;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
  .tool-area {
    display: flex;
    flex: auto;
    width: 100%;
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
        transform: translateX(64px);
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
        .measure-box-outdoor {
          width: 130px;
          position: absolute;
          left: -130px;
          background: rgba(15, 35, 67, 0.8);
        }
        .measure-box-indoor {
          height: 36px;
          line-height: 36px;
          width: 96px;
          position: absolute;
          left: -96px;
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
</style>
