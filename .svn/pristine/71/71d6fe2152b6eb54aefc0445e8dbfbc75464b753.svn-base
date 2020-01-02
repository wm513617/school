<template>
  <dragBoxs ref="relayTrackDragx" :title="title" v-if="modalShow" eventType="track" :canClose="false" :position="position" @changeContext.once="minimumFun">
    <div id="selectBoxRelayTrack" ref="selectBoxRelayTrack" style="min-width:1000px;" :style="{'width':clientW + 'px'}">
      <div class="main" v-show="!showDownload">
        <!-- 左侧时间选择器 -->
        <div class="body-left">
          <Calendar :width="ModalStyle.calendarWidth" @clicktest="clicktest" ref="calender" :title="null" :timeLimit="timeLimit"></Calendar>
          <div class="condition">
            <span>精确时间</span>
            <BStimePicker :datetime='timeVal' @timeChange='timeChange' :width='160' :height='26'></BStimePicker>
          </div>
          <div class="searchbtn">
            <Button type="primary" :disabled="disabledBut" :loading="loading" @click="videoFilter()" class="theme-btn">检索</Button>
          </div>
        </div>
        <!-- 右侧视频播放窗口 -->
        <div class="body-right">
          <!-- 视频播放插件 -->
          <bs-video :pluginCOM="plugin" :count="5" :styles="styles" :style="{'height': ModalStyle.pluginHeight + 'px'}" v-if="!showDownload && modalShow" @singleClick="singleClick" @changeVideo="changeScreen" @update:state="updateState" ref="bsvideo"></bs-video>
          <!-- 视频控件 -->
          <div class='videocontrol'>
            <!-- 视频控制按钮 -->
            <div class='videoPart'>
              <span class="item iconfont" :title="state.isPlay?'暂停':'播放'" :class="[state.isPlay?'icon-pause':'icon-play',{'disable': !state.isPlay && !disabledIcon}]" @click="()=>{state.isPlay?videoPause():openPlay()}"></span>
              <span class="item iconfont icon-stop" title="停止" :class="{'disable': !state.isPlay && !state.isPlay && !disabledIcon}" @click="stopAll"></span>
              <span class="item iconfont icon-xiazai" title="下载" :class="{'disable': !state.isPlay && !disabledIcon}" @click="openDownload"></span>
              <span class="item iconfont" :title="state.isVolumeOpen? '静音': '声音'" :class="[!state.isVolumeOpen ? 'icon-mute': 'icon-volume',{'disable': !state.isPlay && !disabledIcon}]" @click="videoVolume"></span>
              <span class="item iconfont icon-screenshot" title="截图" :class="{'disable': !state.isPlay && !disabledIcon}" @click="videoScreenshot"></span>
              <span class="item iconfont icon-frame-forward" title="逐帧进" :class="{'disable': !state.isPlay && !disabledIcon}" @click="framePlay"></span>
              <span class="item iconfont icon-full-screen" title="全屏" :class="{'disable': !state.isPlay && !disabledIcon}" @click="debounceFullScreen"></span>
              <span class="item iconfont icon-tv-wall" title="快速上墙" :class="{'disable': !state.isPlay && !disabledIcon}" @click="(state.isPlay===true)&&(showTowall=true)"></span>
              <span class="item iconfont icon-Location" title="起点标记" :class="{'disable': state.isPlay ? !caseEdit : true}"  @click="markTime('start')"></span>
              <span class="item iconfont icon-Location" title="终点标记" :class="{'disable': state.isPlay ? !caseEdit : true}"  @click="markTime('end')"></span>
              <span class="item iconfont icon-delete" title="删除标记"  :class="{'disable': !caseEdit}" @click="markTime('delete')"></span>
              <div class="volumeTem" :style="{opacity: state.isVolumeOpen?1:0 }">
                <i class="item iconfont icon-volume" :class="{'disable' :!state.isPlay}" title="音量"></i>
                <div class="slider-box">
                  <slider color="#20a1ff" :size="100" :min="0" :tip-format="()=>{return null}" @on-change="setVolume" :disabled="!state.isVolumeOpen" v-model="volumeValue"></slider>
                </div>
              </div>
            </div>
            <!-- 时间轴 -->
            <div class="timeline">
              <Timeline v-model="timerStart" :recordInfo="recordInfo" @forwardTop="handleDragTop"  @ondrag="handleDrag"  @mouseDown="clearTimer" ref="timeline" :isModel="true" :stepLength.sync="stepLength" @clickCaseLine="(val)=>{caseActive=val}" :caseTime="caseTime"></Timeline>
            </div>
          </div>
        </div>
      </div>
      <!-- 安装插件提示 -->
      <div class="no-plugin" v-if="showDownload">
        <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
        <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
      </div>
    </div>
    <!-- 上墙弹框 -->
    <!-- <Modal id="quickTowall" v-model="showTowall" title="快速上墙" :mask-closable="false" :transition-names="[]">
      <iframe v-if="showTowall" style="z-index:0"></iframe>
      <QuickToWall v-if="showTowall" style="margin:0 auto" :camera="cameraId"></QuickToWall>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="showTowall=false">关闭</Button>
      </div>
    </Modal> -->
  </dragBoxs>
</template>

<script>
/**
 * 接力追踪 【vuex】相关资料
 * -state
 * isSelectBoxRelayTrack  ——  Boolean  ——  是否打开接力追踪
 * playbackTrackVideoList ——  Array ——  接力追踪数据
 * playbackPointList  —— Array ——  框选回放视频列表
 * videoCheckedNum  —— Number ——  视频列表选中的数量
 * -mutations
 * SET_PLAYBACK_TRACK_VODEO_LIST  ——  设置【接力追踪模式】视频数据
 * SET_VIDEO_CHECKED_NUM  ——  设置列表选中数量
 * SET_TRACK_COLLECTIONTIME ——  设置【标记时间】
 * SET_PLAYBACK_POINT_LIST  ——  设置【接力追踪模式】列表数据(上移、下移、删除、清空)
 * PUSH_PLAYBACK_VIDEO_DATA_LIST  ——  添加【接力追踪模式】列表数据
 * PUT_PLAYBACK_POINT_LIST  ——  更新列表的选中项，同时修改【接力追踪】和【回放列表】数据
 * SORT_PLAYBACK_LIST ——  排序
 * -actions
 * clearTrackVideoDataList  —— 【接力追踪】事件关流清空
 * saveTrackingRecord ——  【接力追踪】事件修改 接口
 * setMapPlaybackPointList  ——  设置回放视频列表
 */
import { mapState, mapActions, mapMutations } from 'vuex'
import dragBoxs from 'components/dragx/Dragx.vue' // 地图官方 弹窗功能模板
import plugin from 'components/video/new/plugin.vue' // 插件
import QuickToWall from '@src/view/video/tvwall/QuickToWall' // 快速上墙
import versionCheck from 'components/video/pluginVersionCheck.js' // 插件版本监测
import Timeline from 'components/timeLine.vue' // 时间轴
import Calendar from 'components/common/BScalendar.vue' // 时间选择器
import { AV_RECORD_LIST } from '@src/http/video.api.js'
import hook from '@src/view/video/playback/playrecord/requestHook.js'
import timelineCalc from '@src/view/video/playback/playrecord/timelineCalc.js' // 时间轴需要绘制的部分
import { batchDownloadVideoSegments } from '@src/components/videoComponentsNew/playback'

let videoPlugin // 视频插件
export default {
  name: 'selectBoxRelayTrack',
  components: { dragBoxs, QuickToWall, Timeline, Calendar },
  mixins: [versionCheck, timelineCalc, hook], // 混入
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters, // 获得基础配置信息
      playbackTrackVideoList: ({ mapPoint }) => mapPoint.playbackTrackVideoList, // 接力追踪数据
      isSelectBoxRelayTrack: ({ mapPoint }) => mapPoint.isSelectBoxRelayTrack, // 接力追踪关闭
      playbackPointList: ({ mapPoint }) => mapPoint.playbackPointList, // 右侧视频列表数据
      showTrackInfoTabData: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.showTrackInfoTabData // 地图上显示的追踪信息
    }),
    // 上墙触发
    cameraId() {
      return this.videoListScreen[0].data._id ? this.videoListScreen[0].data._id : ''
    },
    eventtype() {
      if (this.fileType === 'event') {
        const arr = []
        this.checkAllGroup.forEach(item => {
          if (item === '移动侦测') {
            arr.push('alarmMoveSense')
          }
          if (item === '视频丢失') {
            arr.push('alarmVideoLost')
          }
          if (item === '视频遮挡') {
            arr.push('videoMask')
          }
          if (item === '报警输入') {
            arr.push('alarmInput')
          }
        })
        return arr
      } else {
        return [this.fileType]
      }
    },
    caseEdit() {
      // 是否可编辑/删除
      if (this.videoListScreen[0].data && this.videoListScreen[0].data.collectTime) {
        if (this.videoListScreen[0].data.collectTime.startTime && this.videoListScreen[0].data.collectTime.endTime && !this.caseActive) {
          return false
        }
      }
      return true
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 设置播放窗口的大小、位置
      let _w = document.body.clientWidth
      let _h = document.body.clientHeight
      let _mw = _w - 736 - 32 - 20
      // 弹窗宽度
      if (_mw < 1000) {
        this.clientW = 1000
      } else {
        this.clientW = _mw
      }
      // 弹窗左偏移
      this.position.left = Number(_w * 0.5 - this.clientW / 2 + 32)
      // 弹窗上偏移
      // 计算播放窗口的宽、高、位置
      let _p1w = (this.clientW - 20 - 260 - 20) * 0.8
      let _sh = 3
      let _p1h = (_p1w / 16) * 9
      let _p2h = (_p1h - _sh * 3) / 4
      let _p2w = (_p2h * 16) / 9
      this.styles.forEach((e, i) => {
        if (i === 0) {
          e.width = _p1w + 'px'
          e.height = _p1h + 'px'
          e.left = 0
          e.top = 0
        } else {
          e.width = _p2w + 'px'
          e.height = _p2h + 'px'
          e.left = _p1w + 3 + 'px'
          e.top = (i - 1) * (_sh + _p2h) + 'px'
        }
      })
      // 由于plugin为absolute，故人为写高度
      this.ModalStyle.pluginHeight = (_p1w / 16) * 9 + 10
      // 弹窗的上偏移(居中显示)
      this.position.right = Number((_h - this.ModalStyle.pluginHeight - 40 - 20 - 91 - 5) / 2)
    })
  },
  data() {
    return {
      plugin,
      title: '',
      state: {
        isPlay: false, // 是否播放
        isStopped: true, // 是否停止
        isVolumeOpen: false, // 是否打开声音
        volumeValue: 0, // 声音大小
        isFullScreen: false, // 是否全屏
        isOpenFlow: false // 是否开流
      },
      modalShow: false, // 弹窗显隐
      showTowall: false, // 上墙
      mainIndex: 0, // 主屏
      usePage: 'video', // 插件版本监测 用
      debounceFullScreen: this.$lodash.debounce(this.fullScreen, 300), // 全屏
      // 5个窗口的样式
      styles: [{}, {}, {}, {}, {}],
      // 时间选择器——日期限制
      timeLimit: (() => {
        const date = new Date()
        let y = date.getFullYear()
        let m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return { minTime: '1900-01-01', maxTime: `${y}-${m}-${d}` }
      })(),
      recordInfo: [], // 时间轴使用的数据对象
      timer: null, // 时间轴定时器
      // 默认的时间轴值
      defaultTimelineValue: (() => {
        const d = new Date()
        d.setHours(12)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
      })(),
      // 时间选择器——选择时间参数传值
      timeVal: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      dateVal: new Date(), // 时间选择器返回的数据赋值
      loading: false, // 按钮——加载中的状态
      fileType: 'all',
      stepLength: 7200, // 时间轴一格的时间长度
      timerStart: (() => {
        // 时间轴-起始时间
        const d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
      })(),
      clickBtn: false, // 时间轴会自动触发，设置的开关
      disabledBut: false, // 是否禁用检索按钮
      disabledIcon: false, // 图标的禁用
      allCollect: 0, // 是否全部都是收藏 0:全部都不是收藏;1:全部都是收藏;2:收藏/非收藏 混合
      difftime: null, // 时间差
      videoListCount: 0, // 视屏的数量
      isFramePlay: false, // 是否逐帧播放
      videoListScreen: [
        // 视频插件对应数据
        // data 为右侧资源列表传入数据，resource 为开流时返回的数据eventList等
        { id: 0, data: {}, resource: {} },
        { id: 1, data: {}, resource: {} },
        { id: 2, data: {}, resource: {} },
        { id: 3, data: {}, resource: {} },
        { id: 4, data: {}, resource: {} }
      ],
      volumeValue: 50, // 声音的默认大小
      clientW: 1000, // 窗口的宽度
      // 默认接力追踪弹窗位置
      position: {
        right: 90, // 不懂为何组件里将top写成right
        left: '51%'
      },
      ModalStyle: {
        calendarWidth: 260,
        pluginHeight: 345
      },
      caseActive: false, // 是否选中
      caseTime: {}, // 主窗口的时间标记数据
      collectNum: 0 // 标记时间的数量
    }
  },
  watch: {
    playbackTrackVideoList(newval, oldval) {
      /**
       * 当开流时
       * 增项自动开流
       * 减项自动关流
       */
      let newlen = newval.length
      let oldlen = oldval.length
      this.videoListCount = newlen
      let _data = this.$lodash.cloneDeep(newval)
      if (newlen > 5) {
        this.warningMsg('播放视频数量不得超过 5 个')
        return
      }
      if (this.modalShow && newlen && (!oldlen || _data[0]._id !== oldval[0]._id)) {
        this.SET_CURNODE(_data[0])
      } else if (!newlen) {
        this.SET_CURNODE('')
      }
      // 当 增加 || 减少 || 交换位置 时
      if (newlen > oldlen) {
        // 增加时
        this.videoListScreen[oldlen].data = this.$lodash.cloneDeep(newval[oldlen])
        // 当开流时 自动开流
        if (this.state.isOpenFlow) {
          // 查询时间为播放时间的前后12小时
          let param = {
            startTime: parseInt(this.timestamp() / 1000) - 12 * 60 * 60,
            endTime: parseInt(this.timestamp() / 1000) + 12 * 60 * 60
          }
          // 定点开流
          this.queryRecordPlay(
            this.queryRecordOpen(param, newval[oldlen]),
            parseInt(this.timestamp() / 1000),
            newval[oldlen],
            this.videoListScreen[oldlen].id
          )
          this.SORT_PLAYBACK_LIST({ main: 'trackList', data: _data })
        }
      } else if (newlen < oldlen) {
        // 减少时
        let changeIndex = newlen // 改变的数据的下标
        for (let i = 0; i < newlen; i++) {
          if (oldval[i]._id !== newval[i]._id) {
            changeIndex = i
            break
          }
        }
        this.videoListScreen[changeIndex].data = {}
        this.videoListScreen[changeIndex].resource = {}
        this.videoListScreen.forEach((e, i, arr) => {
          if (i !== 4 && i >= changeIndex) {
            if (!this.state.isOpenFlow) {
              // 关流时
              // 当为开流时，自动将上移 data 和 resource
              e.data = this.$lodash.cloneDeep(arr[i + 1].data)
              arr[i + 1].data = {}
            } else {
              // 当开流时 自动关流
              if (i === changeIndex) {
                this.stop(e.id)
              }
              if (newlen && i < newlen) {
                this.switchStyle(arr[i].id, arr[i + 1].id)
              }
            }
          }
        })
        this.SORT_PLAYBACK_LIST({ main: 'trackList', data: _data })
      } else if ((newlen === oldlen) !== 0) {
        // 相等时
        let tmp = [] // 交换位置的下标
        for (let i = 0; i < newlen; i++) {
          if (this.videoListScreen[i].data._id !== newval[i]._id) {
            // 当数据的顺序发生改变时
            tmp.push(i)
            if (tmp.length === 2) {
              break
            }
          }
        }
        if (tmp.length === 2) {
          if (tmp[0] !== tmp[1] && this.videoListScreen[tmp[0]].data._id === newval[tmp[1]]._id) {
            this.switchStyle(this.videoListScreen[tmp[0]].id, this.videoListScreen[tmp[1]].id)
          }
        } else if (!tmp.length) {
          this.videoListScreen[0].data = newval[0]
        }
      }
      // 判断是否全是有标记时间
      let collectCount = 0
      for (let e of newval) {
        // 一个标准的时间段必须有开始时间，可以没有结束时间
        if (e.collectTime && e.collectTime.startTime) {
          collectCount++
        }
      }
      // 如果没有开流
      if (!this.state.isOpenFlow) {
        if (collectCount === 0) {
          // 全部都不是收藏
          // console.log('全部都不是收藏')
          this.disabledBut = false
          this.disabledIcon = false
          this.allCollect = 0
        } else if (collectCount === newlen && newlen !== 0) {
          // 全部都是收藏
          // console.log('全部都是收藏')
          this.disabledBut = true
          this.disabledIcon = true
          this.allCollect = 1
        } else {
          // console.log('收藏/非收藏 混合')
          this.disabledBut = true
          this.disabledIcon = true
          this.allCollect = 2
        }
      }
      // 设置plugin
      setTimeout(() => {
        if (newlen && !this.showDownload) {
          videoPlugin = videoPlugin || this.getPlugin(0)
        }
      }, 500)
    },
    // 当播放窗口为0时
    videoListCount(val) {
      this.$nextTick(() => {
        if (!val) {
          this.state.isPlay = false
          this.state.isStopped = true
          this.state.isOpenFlow = false
          this.clickBtn = false
          this.recordInfo = []
          this.caseTime = {}
          this.isFramePlay = false
          this.disabledIcon = false
        }
      })
    },
    // 监测当前已标记了几个资源
    playbackPointList(val) {
      let _n = 0
      val.map(e => {
        if (e.collectTime && e.collectTime.startTime) {
          _n++
        }
      })
      this.collectNum = _n
    },
    // 由于单击事件轴后会自动清空定时任务，所以手工添加定时器
    caseActive(val) {
      this.startTimer()
    }
  },
  methods: {
    ...mapActions([
      'clearTrackVideoDataList',
      'getTVList',
      'getMonitorList',
      'openWall',
      'getVideoConf',
      'getCameraPower',
      'setResource',
      'recordLog'
    ]),
    ...mapMutations(['SET_CURNODE', 'SORT_PLAYBACK_LIST', 'SET_TRACK_COLLECTIONTIME']),
    // 点击大小窗口切换
    changeScreen(index) {
      let _data = this.$lodash.cloneDeep(this.playbackTrackVideoList)
      let tmp = []
      this.videoListScreen.map((e, i) => {
        if (e.id === index || e.id === this.mainIndex) {
          tmp.push(i)
        }
      })
      let tmp1 = _data[tmp[0]]
      this.$set(_data, tmp[0], _data[tmp[1]])
      this.$set(_data, tmp[1], tmp1)
      this.SORT_PLAYBACK_LIST({ main: 'trackList', data: _data })
    },
    // 大小视频窗口切换fun
    switchStyle(aIndex, bIndex) {
      /**
       * aIndex 和 bIndex 为 plugin 的index
       */
      // 获取下标
      let tmp = []
      this.videoListScreen.forEach((e, i) => {
        if (e.id === aIndex || e.id === bIndex) {
          tmp.push(i)
        }
      })
      // 交换位置
      // -数据
      let tmp1 = this.videoListScreen[tmp[0]]
      this.$set(this.videoListScreen, tmp[0], this.videoListScreen[tmp[1]])
      this.$set(this.videoListScreen, tmp[1], tmp1)
      // -样式
      let tmp2 = this.styles[bIndex]
      this.$set(this.styles, bIndex, this.styles[aIndex])
      this.$set(this.styles, aIndex, tmp2)
      if ((this.mainIndex === aIndex || this.mainIndex === bIndex) && this.state.isOpenFlow) {
        this.addTimelineInfo(this.timestamp())
      }
      videoPlugin.showChangeVideo = true
      // 变更主屏id
      if (this.mainIndex === aIndex) {
        this.mainIndex = bIndex
      } else if (this.mainIndex === bIndex) {
        this.mainIndex = aIndex
      }
      // 变更ref
      videoPlugin = this.getPlugin(this.mainIndex)
      // 变更视频组件 参数
      videoPlugin.showChangeVideo = false
      videoPlugin.pluginState = this.$lodash.cloneDeep(this.state)
    },
    // 点击标记 起始、结束、删除 按钮
    markTime(status) {
      if (!this.caseEdit) {
        return
      }
      // 判断是否有16个资源被标记
      if (this.collectNum >= 16 && !this.caseActive) {
        this.warningMsg('接力追踪仅支持16路视频标记录像段！！')
        return
      }
      let _data = this.$lodash.cloneDeep(this.videoListScreen[0].data)
      if (!_data.collectTime) {
        _data.collectTime = {}
      }
      if (status === 'start') {
        _data.collectTime.startTime = this.timestamp()
        if (_data.collectTime.endTime) {
          if (_data.collectTime.endTime > _data.collectTime.startTime) {
            this.caseTime = {
              start: _data.collectTime.startTime,
              end: _data.collectTime.endTime
            }
          } else if (_data.collectTime.endTime < _data.collectTime.startTime) {
            this.caseTime = {
              start: _data.collectTime.endTime,
              end: _data.collectTime.startTime
            }
            _data.collectTime.startTime = this.caseTime.start
            _data.collectTime.endTime = this.caseTime.end
          }
        }
      } else if (status === 'end') {
        _data.collectTime.endTime = this.timestamp()
        if (_data.collectTime.startTime) {
          if (_data.collectTime.endTime > _data.collectTime.startTime) {
            this.caseTime = {
              start: _data.collectTime.startTime,
              end: _data.collectTime.endTime
            }
          } else if (_data.collectTime.endTime < _data.collectTime.startTime) {
            this.caseTime = {
              start: _data.collectTime.endTime,
              end: _data.collectTime.startTime
            }
            _data.collectTime.startTime = this.caseTime.start
            _data.collectTime.endTime = this.caseTime.end
          }
        }
      } else if (status === 'delete') {
        _data.collectTime.startTime = null
        _data.collectTime.endTime = null
        this.caseTime = {}
      }
      if (_data.collectTime.startTime && _data.collectTime.endTime && _data.collectTime.endTime === _data.collectTime.startTime) {
        this.errorMsg('开始标记时间和结束标记时间不得相同')
        return
      }
      this.SET_TRACK_COLLECTIONTIME(_data)
    },
    // 单击获得上部按钮栏
    singleClick(index) {
      for (let index = 0; index < 5; index++) {
        this.getPlugin(index).isShowPlugin = false
        this.getPlugin(index).showChangeVideo = true
      }
      this.getPlugin(index).isShowPlugin = true
      if (index === this.mainIndex) {
        this.getPlugin(index).showChangeVideo = false
      }
    },
    // 获取插件
    getPlugin(index) {
      if (this.isSelectBoxRelayTrack) {
        return this.$refs.bsvideo.getCOM(index)
      }
    },
    // 更新参数状态
    updateState(index, s) {
      if (index === this.mainIndex) {
        Object.assign(this.state, s)
      }
    },
    // 添加单个时间轴对象
    addTimelineInfo(time) {
      if (time) {
        this.recordInfo = []
        let eventList = this.videoListScreen[0].resource.eventList
        let catchedTimelineInfo = this.catchCalcTimeline(eventList, time, this.stepLength)
        let obj = {
          ...catchedTimelineInfo,
          ip: this.videoListScreen[0].resource.dsIp,
          label: this.videoListScreen[0].data.name,
          resId: this.videoListScreen[0].data._id
        }
        let collectTime = this.videoListScreen[0].data.collectTime
        // 若有标记时间
        if (collectTime) {
          this.caseTime = { start: collectTime.startTime, end: collectTime.endTime }
        } else {
          this.caseTime = {}
        }
        // 添加一个假的为了能出黑色的底条
        if (!obj.timedVideo.length && !obj.eventVideo.length) {
          obj.timedVideo.push({ start: 1000, end: 1001 })
        }
        this.$set(this.recordInfo, 0, obj)
        // 强行刷新时间轴
        this.$nextTick(() => {
          this.$refs.timeline.initTimeList()
        })
      } else {
        this.clearTimer()
        this.$refs.timeline.chengeTime(this.defaultTimelineValue)
      }
    },
    // 开始时间
    startTimer() {
      this.clearTimer()
      this.timer = setInterval(() => {
        if (this.state.isPlay) {
          this.$refs.timeline.chengeTime(this.timestamp())
        }
      }, 1000)
    },
    // 清空定时器
    clearTimer() {
      clearInterval(this.timer)
    },
    // 打开弹窗
    openModal() {
      this.modalShow = true
      this.SET_CURNODE(this.playbackTrackVideoList[0]) // 初次打开时，强制请求第一个资源的状态
      // 当时间被遮挡时，隐藏
      this.$nextTick(() => {
        this.$refs.timeline.step = 1 // 使初始时间轴刻度为12m
        if (this.clientW <= 1120) {
          let _d = document.querySelectorAll('#time-line > .calendar > .calendar-text')
          _d[0].style.display = 'none'
          // this.$refs['timeline'].$el.children[0].children[0].style.display = 'none'
        }
      })
    },
    // 关闭弹窗
    closeMode() {
      this.modalShow = false
      this.clearTimer()
    },
    // 播放
    openPlay() {
      if (this.state.isOpenFlow) {
        // 已经开流时
        // 以当前时间播放
        this.videoListScreen.forEach((item, index, arr) => {
          if (item.data._id !== undefined) {
            if (this.isFramePlay) {
              // 是逐帧播放时
              this.getPlugin(item.id).frameToPlay(0)
              this.isFramePlay = false
            }
            this.getPlugin(item.id).videoResume()
          }
        })
      } else {
        // 未开流时
        /**
         * 判断是否有时间节点
         * 若有时间节点
         * 以最大的时间节点播放
         */
        // ！全部都不是收藏
        if (this.allCollect) {
          let _str = []
          let _end = []
          this.videoListScreen
            .filter(e => e.data.collectTime)
            .map(e => {
              // 如果有数据时
              if (e.data.collectTime.startTime) {
                _str.push(e.data.collectTime.startTime)
              }
              if (e.data.collectTime.endTime) {
                _end.push(e.data.collectTime.endTime)
              }
            })
          _str.sort()
          _end.sort()
          if (_str[_str.length - 1] < _end[_end.length - 1]) {
            this.timerStart = _end[_end.length - 1]
          } else {
            this.timerStart = _str[_str.length - 1] + 10000 // 最后的标记为开始标记，则后延10s
          }
          let param = {
            startTime: parseInt(this.timerStart / 1000) - 12 * 60 * 60,
            endTime: parseInt(this.timerStart / 1000) + 12 * 60 * 60
          }
          this.videoListScreen.forEach(item => {
            if (item.data._id !== undefined) {
              this.queryRecordPlay(
                this.queryRecordOpen(param, item.data),
                parseInt(this.timerStart / 1000),
                item.data,
                item.id
              )
            }
          })
          let _data = this.$lodash.cloneDeep(this.playbackTrackVideoList)
          this.SORT_PLAYBACK_LIST({ main: 'trackList', data: _data })
        }
      }
    },
    // 停止
    stop(index) {
      this.getPlugin(index).videoStop()
      this.getPlugin(index).isShowPlugin = false
      this.getPlugin(index).collected = false
      this.getPlugin(index).pluginState.isPlay = false
      this.getPlugin(index).pluginState.isStopped = true
      this.getPlugin(index).pluginState.isFullScreen = false
      this.getPlugin(index).init = false
    },
    // 停止全部
    stopAll() {
      if (this.clickBtn) {
        this.videoListScreen.forEach(item => {
          if (item.data._id !== undefined) {
            this.stop(item.id)
            item.data = {}
            item.resource = {}
          }
        })
        let d = new Date()
        d.setHours(0)
        d.setMinutes(0)
        d.setSeconds(0)
        this.timerStart = d.getTime()
        this.addTimelineInfo()
        this.clearTrackVideoDataList() // 恢复初始化
      }
    },
    // 逐帧进
    framePlay() {
      if (this.clickBtn) {
        if (!this.state.isOpenFlow) {
          return
        }
        for (let item of this.videoListScreen) {
          if (item.data._id !== undefined) {
            if (this.isFramePlay) {
              this.getPlugin(item.id).videoResume()
            } else {
              this.getPlugin(item.id).frameToPlay(1)
            }
            this.isFramePlay = true
          }
        }
        this.$nextTick(() => {
          this.state.isPlay = false
        })
      }
    },
    // 全屏
    fullScreen() {
      if (this.state.isPlay && this.clickBtn) {
        videoPlugin.fullScreen()
      }
    },
    // 暂停
    videoPause() {
      if (this.clickBtn) {
        this.videoListScreen.forEach((item, index, arr) => {
          if (item.data._id !== undefined) {
            this.getPlugin(item.id).videoPause()
          }
        })
        this.$nextTick(() => {
          this.state.isPlay = false
        })
      }
    },
    // 截图
    videoScreenshot() {
      if (this.state.isPlay && this.clickBtn) {
        videoPlugin.videoScreenshot()
      }
    },
    // 下载
    openDownload() {
      if (!this.state.isOpenFlow) {
        return
      }
      if (this.clickBtn) {
        this.getVideoConf()
        let _t = Math.floor(this.timestamp() / 1000)
        let _data = [
          {
            channel: this.videoListScreen[0].data.chan,
            startTime: _t - 1,
            endTime: _t + 3,
            devIp: this.videoListScreen[0].data.eid.ip,
            name: this.videoListScreen[0].data.eid.name,
            devPort: this.videoListScreen[0].data.eid.cport,
            fileName: `${this.parameters.downloadVideoPath}\\${this.showTrackInfoTabData.name}_${this.videoListScreen[0].data.name}${this.videoListScreen[0].data.eid.name}_${this.$moment((_t - 1) * 1000).format('YYYYMMDDHHmmss')}_${this.$moment((_t + 3) * 1000).format('YYYYMMDDHHmmss')}.${this.parameters.downloadVideoType.toLowerCase()}`
          }
        ]
        batchDownloadVideoSegments(_data)
          .then(res => {
            this.warningMsg(`录像开始下载, 下载路径为:  ${this.parameters.downloadVideoPath}`)
          })
          .catch(err => {
            console.log(err)
            this.warningMsg('下载失败请稍后重试')
          })
      }
    },
    // 打开伴音
    videoVolume() {
      this.state.isVolumeOpen = !this.state.isVolumeOpen
      if (this.state.isPlay && this.clickBtn) {
        videoPlugin.videoVolume()
      }
    },
    // 设置音量
    setVolume(v) {
      videoPlugin.setVolume(v)
    },
    // 时间选择器——组件返回的日期时间(getTime())
    clicktest(time, date) {
      this.dateVal = date
      this.$parent.calendarTime = date
      this.$refs.calender.dateLimit.maxTime = new Date().getTime() // 赋值可选则的最大时间为现在时间
    },
    // 时间选择器——精确时间组件——传入值
    timeChange(val) {
      if (typeof val === 'object') {
        this.timeVal = val
      } else {
        const t = val.split(':')
        const date = new Date()
        date.setHours(t[0] || 0)
        date.setMinutes(t[1] || 0)
        date.setSeconds(t[2] || 0)
        this.timeVal = date
      }
    },
    // 检索按钮
    async videoFilter() {
      if (!this.$store.getters.plugin.valid) {
        this.warningMsg('请先下载插件，或当前浏览器不支持插件！')
        return
      }
      if (!this.playbackTrackVideoList.length) {
        this.warningMsg('请选中设备')
        return
      }
      this.dateVal.setHours(this.timeVal.getHours())
      this.dateVal.setMinutes(this.timeVal.getMinutes())
      this.dateVal.setSeconds(this.timeVal.getSeconds())
      if (this.dateVal.getTime() > new Date().getTime()) {
        this.warningMsg('精确时间不能超过当前时间！')
        return
      }
      this.timerStart = Date.parse(this.dateVal)
      // this.stopAll()
      // 查询的起始时间
      let param = {
        startTime: parseInt(this.timerStart / 1000) - 12 * 60 * 60,
        endTime: parseInt(this.timerStart / 1000) + 12 * 60 * 60
      }
      this.videoListScreen.forEach(item => {
        if (item.data._id !== undefined) {
          this.queryRecordPlay(
            this.queryRecordOpen(param, item.data),
            parseInt(this.timerStart / 1000),
            item.data,
            item.id
          )
        }
      })
      let _data = this.$lodash.cloneDeep(this.playbackTrackVideoList)
      if (!_data.length) {
        this.warningMsg('请选择一个摄像头！')
        return
      }
      this.loading = true
      this.SORT_PLAYBACK_LIST({ main: 'trackList', data: _data })
    },
    // 查询对象
    queryRecordOpen(param, data) {
      const pros = []
      let _data = {
        eventType: this.eventtype,
        ip: data.eid.ip || data.ip,
        devIp: data.eid.ip || data.ip,
        // devPort: data.eid.cport,
        devPort: data.eid.cport || data.port,
        channel: data.chan,
        streamType: data.stream,
        ...param
      }
      pros.push(
        AV_RECORD_LIST({
          devIp: _data.devIp,
          channel: _data.channel,
          devPort: _data.devPort,
          streamType: _data.streamType ? _data.streamType : 'all',
          eventType: _data.eventType ? _data.eventType : ['all'],
          typeName: '',
          typeContent: '',
          startTime: _data.startTime,
          endTime: _data.endTime,
          rows: 50,
          page: 1
        })
      )
      return pros
    },
    // 播放
    queryRecordPlay(param, realTime, item, index) {
      Promise.all(param)
        .then(res => {
          // 渲染画面
          this.getPlugin(index)
            .syncRecordOpen(res[0], realTime)
            .then(() => {
              this.clickBtn = true
              this.disabledIcon = true
              this.state.isPlay = true
              /**
               * 改为绘制主屏的
               */
              if (index === this.mainIndex) {
                /**
                 * 当选定时间不在查询的录像段的时间内时
                 * 且只有一条录像段
                 */
                let str, end
                res[0].data.result.eventList.map((item, i) => {
                  if (item.strmInfo === undefined) {
                    return
                  }
                  if (i === 0) {
                    str = item.evtTblInfo.startTime
                  }
                  if (i === res[0].data.result.eventList.length - 1) {
                    end = item.evtTblInfo.endTime
                  }
                })
                if (str > realTime) {
                  realTime = str
                } else if (end < realTime) {
                  realTime = end
                }
                this.startTimer()
                this.addTimelineInfo(realTime * 1000)
              }
              this.loading = false
              this.state.isOpenFlow = true
            })
            .catch(error => {
              console.log(error)
              this.getPlugin(index).init = false
              this.clickBtn = true
              this.loading = false
              this.errorMsg('开流失败')
            })
          // 为时间轴传基础数据
          this.videoListScreen.forEach(e => {
            if (e.id === index) {
              e.resource = res[0].data.result
            }
          })
          videoPlugin = this.getPlugin(this.mainIndex)
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.getPlugin(index).init = false
          this.errorMsg('通道数据查询失败')
        })
    },
    // 时间轴拖拽,且没有超过现在的时间时
    handleDrag(value) {
      value = String(value).slice(0, 10)
      const now = new Date().getTime() - this.timerStart
      // 拖拽小于1s不触发
      if (this.timerStart && now < 1000) {
        return
      }
      this.changeToPlayback(value * 1000)
      this.state.isPlay = true
    },
    // 时间轴拖拽,拖拽位置超过现在的时间时
    handleDragTop() {
      this.timerStart = new Date().getTime()
      this.changeToPlayback(this.timerStart)
      this.state.isPlay = true
    },
    // 由拖拽时间轴修改回放
    changeToPlayback(timeValue) {
      if (!this.videoListScreen[0].resource.eventList || !this.videoListScreen[0].resource.eventList.length) {
        return
      }
      let param = {
        startTime: parseInt(timeValue) / 1000 - 12 * 60 * 60,
        endTime: parseInt(timeValue) / 1000 + 12 * 60 * 60
      }
      this.videoListScreen.forEach((item, index, arr) => {
        if (item.data._id !== undefined) {
          this.queryRecordPlay(this.queryRecordOpen(param, item.data), parseInt(timeValue) / 1000, item.data, item.id)
        }
      })
    },
    // 正在播放的视频的时间戳
    timestamp() {
      let time = this.getPlugin(this.mainIndex).plugin.GetPlayerCurTime()
      time = JSON.parse(time)
      if (time.success && time.msCur !== 0) {
        return time.msCur
      }
      // 当视频资源发生变故，无资源时，自动关闭当前视频
      // console.log(this.$refs.timeline.now)
      // if (time !== undefined) {
      //   return time
      // } else {
      //   this.stop(this.mainIndex)
      // }
      // 当视频资源发生变故，无资源时，自动创建假的时间
      if (time === undefined) {
        time = new Date(this.$refs.timeline.now).getTime() + 1000
      }
      return time
    },
    // 是第一次点击最小化时，最小化图标居中显示
    minimumFun() {
      const ele = this.$el ? this.$el.querySelector('.map-image-box') : {}
      setTimeout(() => {
        ele.style.left = 'calc(50% - 50px)'
      }, 10)
    },
    scaleModal(tomin) {
      const min = this.$refs && this.$refs.relayTrackDragx && this.$refs.relayTrackDragx.min
      const arr = ['true', 'false']
      if (arr.includes(String(tomin)) && arr.includes(String(min)) && tomin !== min) {
        this.$refs.relayTrackDragx.changeContext()
      }
    }
  },
  beforeDestroy() {
    // 视频插件
    this.stopAll()
    videoPlugin = null
    this.SET_CURNODE('')
  }
}
</script>

<style>
#quickTowall .ivu-modal {
  width: fit-content !important;
}
</style>

<style scoped lang='less'>
#selectBoxRelayTrack {
  .main {
    display: flex;
    .body-left {
      margin: 10px;
      .container {
        margin: 0 auto;
      }
      .condition {
        margin: 30px 0;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        & > span {
          font-size: 14px;
        }
      }
      .searchbtn {
        text-align: center;
      }
    }
    .body-right {
      margin: 10px;
      width: ~'calc(100% - 20px - 260px - 20px)';
      position: relative;
      .bs-video {
        height: 345px;
        & /deep/ .bs-video-single {
          position: absolute;
          background: rgb(64, 64, 64);
        }
      }
      .videocontrol {
        position: relative;
        .videoPart {
          padding: 3px 10px;
          position: absolute;
          width: ~'calc(100% - 100px)';
          z-index: 1;
          .item {
            font-size: 18px;
            cursor: pointer;
            margin-right: 9px;
            &:hover {
              color: #20a1ff;
            }
          }
          .volumeTem {
            display: inline-block;
            position: absolute;
            top: 3px;
            right: 80px;
            .slider-box {
              width: 120px;
              display: inline-block;
              padding: 0px 10px;
              position: absolute;
              top: -5px;
              left: 20px;
            }
          }
        }
        .timeline {
          position: relative;
          width: 100%;
          margin-bottom: 5px;
          #time-line {
            position: relative;
            & /deep/ .calendar {
              text-align: center !important;
              height: 31px;
              line-height: 34px;
              margin: 0;
              .calendar-text {
                font-size: 13px;
              }
            }
            & /deep/ .signs {
              display: none;
            }
            & /deep/ .content {
              margin: 0;
              height: 60px;
            }
          }
        }
      }
    }
  }
}
.no-plugin {
  position: relative;
  height: 325px;
  background: rgb(64, 64, 64);
  & a {
    position: absolute;
    font-size: 24px;
    left: calc(~'50% - 120px');
    top: calc(~'50% - 18px');
    color: #00a5e3;
  }

  & .ivu-icon {
    position: absolute;
    font-size: 24px;
    left: calc(~'50% + 120px');
    top: calc(~'50% - 18px');
    margin-top: 6px;
    margin-left: 10px;
    cursor: help;
    color: #00a5e3;
  }
}
iframe {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  border: 0 none;
}
.showTowall {
  position: absolute;
  list-style: none;
  bottom: 26px;
  left: -385px;
  background-color: #1b3153;
  color: #fff;
  border: 1px solid #00a5e3;
  border-radius: 0 0 3px 3px;
  text-align: center;
}
.disable {
  color: #878282 !important;
}
</style>
