<template>
  <div class="ViedorelayTrack">
    <div class="main" v-if="!showDownload" ref="main">
      <!-- 左侧时间选择器 -->
      <div class="body-left">
        <Calendar @clicktest="clicktest" ref="calender" width="230" :title="null" :timeLimit="timeLimit"></Calendar>
        <div class="condition">
          <span>精确时间</span>
          <BStimePicker @timeChange='timeChange' :width='160' :height='26'></BStimePicker>
        </div>
        <div class="searchbtn">
          <Button type="primary" :disabled="isEdit ? false : Boolean(markTime.length)" :loading="loading" @click="videoFilter()" class="theme-btn">检索</Button>
        </div>
      </div>
      <!-- 右侧视频播放窗口 -->
      <div class="body-right">
        <!-- 视频播放插件 -->
        <bs-video :pluginCOM="plugin" :count="1" @update:state="updateState" ref="bsvideo"></bs-video>
        <!-- 视频控件 -->
        <div class='videocontrol'>
          <!-- 视频控制按钮 -->
          <div class='videoPart'>
            <span class="item iconfont" :title="state.isPlay ? '暂停' : '播放'" :class="[state.isPlay?'icon-pause':'icon-play',{'disable': isEdit ? !state.isOpenFlow : !Boolean(markTime.length) }]" @click="()=>{state.isPlay?videoPause():openPlay()}"></span>
            <span class="item iconfont icon-stop" title="停止" :class="{'disable': !state.isOpenFlow}" @click="stop"></span>
            <span class="item iconfont" :title="state.isVolumeOpen? '静音': '声音'" :class="[!state.isVolumeOpen ? 'icon-mute': 'icon-volume',{'disable': !state.isOpenFlow}]" @click="videoVolume"></span>
            <span class="item iconfont icon-full-screen" title="全屏" :class="{'disable': !state.isOpenFlow}" @click="debounceFullScreen"></span>
            <span class="item iconfont icon-Location" title="起点标记" :class="{'disable': !(state.isOpenFlow && isEdit && state.isPlay)}"  @click="markTimeClick('start')"></span>
            <span class="item iconfont icon-Location" title="终点标记" :class="{'disable': !(state.isOpenFlow && isEdit && state.isPlay && endIconBtn)}"  @click="markTimeClick('end')"></span>
            <div class="volumeTem" :style="{'display': state.isVolumeOpen ? 'inline-block' : 'none' }">
              <i class="item iconfont icon-volume" :class="{'disable' :!state.isOpenFlow}" title="音量"></i>
              <div class="slider-box">
                <slider color="#20a1ff" :size="100" :min="0" :tip-format="()=>{return null}" @on-change="setVolume" :disabled="!state.isVolumeOpen" v-model="volumeValue"></slider>
              </div>
            </div>
          </div>
          <!-- 时间轴 -->
          <div class="timeline">
            <Timeline v-model="timerStart" :recordInfo="recordInfo" @forwardTop="handleDragTop"  @ondrag="handleDrag" :showThumb="1" @mouseDown="clearTimer" ref="timeline" :isModel="true" :stepLength.sync="stepLength" @clickCaseLine="(val)=>{caseActive=val}" :caseTime="caseTime"></Timeline>
          </div>
        </div>
      </div>
    </div>
    <!-- 安装插件提示 -->
    <div class="no-plugin" v-else>
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
    </div>
  </div>
</template>

<script>
/**
 * 本组件为【接力追踪】视频组件
 * 相关说明
 * 1、单页面该组件的父级dom元素不可使用display:none，若使用，需使用v-if隔离；
 * 2、传入值：
 *    videoNode：【Object】选中资源的全部data，需满足开流需求
 *    markTime：【Array】为时间段标记，可不填
 *      eg：markTime:[{startTime:, endTime:}]
 *    isEdit: 【Boolean】是否可编辑时间节点，true-可编辑；false-不可编辑
 * 3、传出值：
 *    caseTime：【Object】标记的时间
 *      eg: caseTime: {start: (s), end:(s)}
 * 4、调用方法
 * this.$refs.**.stop()
 */
import { mapActions, mapMutations } from 'vuex'
import plugin from 'components/video/new/plugin.vue' // 插件
import versionCheck from 'components/video/pluginVersionCheck.js' // 插件版本监测
import Timeline from 'components/timeLine.vue' // 时间轴
import Calendar from 'components/common/BScalendar.vue' // 时间选择器
import { AV_RECORD_LIST } from '@src/http/video.api.js'
import hook from '@src/view/video/playback/playrecord/requestHook.js'
import timelineCalc from '@src/view/video/playback/playrecord/timelineCalc.js' // 时间轴需要绘制的部分

export default {
  name: 'ViedorelayTrack',
  components: { Timeline, Calendar },
  mixins: [versionCheck, timelineCalc, hook], // 混入
  props: {
    // 选中的节点
    videoNode: {
      type: Object
    },
    // 标记时间
    markTime: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 是否可编辑
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    /**
     * 未知原因bug
     * 当step为默认7时
     * 初次开流，显示刻度不对
     * 当通过修改【比例】后正常
     * 当修该比例后再改回7，正常
     * 使用更小的比例，正常
     * 初步怀疑为窗口过小，导致刻度div的width大于div之间的距离造成挤压
     */
    this.$refs.timeline.step = 4
  },
  computed: {
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
    }
  },
  watch: {
    'state.isOpenFlow'(val) {
      // 返回是否开/关流
      this.$emit('isOpenFlow', val)
      // 由于第一次开流会有时间轴位置不正确的现象
      console.log('initTimeList')
      if (val) {
        this.$refs.timeline.initTimeList()
      }
    },
    caseTime: {
      handler(val) {
        if (val.start) {
          this.endIconBtn = true
        } else {
          this.endIconBtn = false
        }
      },
      deep: true,
      immediate: true
    },
    videoNode(val) {
      if (JSON.stringify(val) === '{}') {
        this.SET_CURNODE('')
      } else {
        this.SET_CURNODE(val)
      }
    }
  },
  data() {
    return {
      plugin,
      state: {
        isPlay: false, // 播放状态：true播放,false暂停
        isStopped: true, // 是否停止
        isVolumeOpen: false, // 是否打开声音
        volumeValue: 0, // 声音大小
        isFullScreen: false, // 是否全屏
        isOpenFlow: false // 是否开流
      },
      usePage: 'video', // 插件版本监测 用
      debounceFullScreen: this.$lodash.debounce(this.fullScreen, 300), // 全屏
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
      detectionTimer: null, // 监测定时器
      // 默认的时间轴值
      defaultTimelineValue: new Date().setHours(0, 0, 0, 0),
      // 时间选择器返回的数据赋值
      selectTime: {
        dateVal: new Date(), // 日期
        timeVal: '00:00:00' // 时间
      },
      loading: false, // 按钮——加载中的状态
      fileType: 'all',
      stepLength: 7200, // 时间轴一格的时间长度
      // 时间轴
      timerStart: new Date().setHours(12, 0, 0, 0),
      allCollect: 0, // 是否全部都是收藏 0:全部都不是收藏;1:全部都是收藏;2:收藏/非收藏 混合
      resourceList: {}, // 资源是查询数据
      volumeValue: 50, // 声音的默认大小
      caseActive: false, // 是否选中
      caseTime: {}, // 主窗口的时间标记数据
      endIconBtn: true // 终点标记是否可以使用
    }
  },
  methods: {
    ...mapActions([
      'getTVList',
      'getMonitorList',
      'openWall',
      'getVideoConf',
      'getCameraPower',
      'setResource',
      'recordLog'
    ]),
    ...mapMutations(['SET_CURNODE']),
    // 点击标记 起始、结束、删除 按钮
    markTimeClick(status) {
      if (!this.state.isOpenFlow) {
        return
      }
      if (!this.isEdit) {
        return
      }
      let _t = { ...this.caseTime }
      if (status === 'start') {
        _t.start = this.timestamp()
        _t.start -= _t.start % 1000
      } else if (status === 'end') {
        if (!_t.start) {
          this.$Notice.warning({ title: '警告', desc: '需先标记起始标记' })
          return
        }
        _t.end = this.timestamp()
        _t.end -= _t.end % 1000
      }
      // 判断标记时间
      if (_t.start && _t.end) {
        if (_t.start >= _t.end) {
          this.$Notice.warning({
            title: '警告',
            desc: '开始时间不能大于等于结束时间'
          })
          return
        } else if (_t.end - _t.start <= 1) {
          this.$Notice.warning({
            title: '警告',
            desc: '标记时间过短'
          })
          return
        }
      }
      let _s = {}
      if (_t.start) {
        _s.start = _t.start / 1000
      }
      if (_t.end) {
        _s.end = _t.end / 1000
      }
      this.$emit('caseTime', _s)
      this.caseTime = { ..._t }
    },
    // 获取插件
    getPlugin() {
      return this.$refs.bsvideo.getCOM(0)
    },
    // 更新参数状态
    updateState(index, s) {
      Object.assign(this.state, s)
    },
    // 添加单个时间轴对象
    addTimelineInfo(time) {
      console.log('addTimelineInfo', time)
      if (time) {
        this.recordInfo = []
        let eventList = this.resourceList.eventList
        let catchedTimelineInfo = this.catchCalcTimeline(eventList, time, this.stepLength)
        let obj = {
          ...catchedTimelineInfo,
          ip: this.resourceList.dsIp,
          resId: this.videoNode._id
        }
        this.markTime.map(e => {
          if (e.resource === this.videoNode._id) {
            if (e.startTime.toString().length === 10) {
              e.startTime = e.startTime * 1000
              e.endTime = e.endTime * 1000
            } else {
              e.startTime -= e.startTime % 1000
              e.endTime -= e.endTime % 1000
            }
            this.caseTime = { start: e.startTime, end: e.endTime }
          }
        })
        if (!obj.timedVideo.length && !obj.eventVideo.length) {
          // 添加一个假的为了能出黑色的底条
          obj.timedVideo.push({
            start: 1000,
            end: 1001
          })
        }
        this.$set(this.recordInfo, 0, obj)
      } else {
        console.log('chengeTime')
        this.$refs.timeline.chengeTime(this.defaultTimelineValue)
      }
      this.clearTimer()
    },
    // 开始时间
    startTimer() {
      this.clearTimer()
      console.log('startTimer-------------')
      this.timer = setInterval(() => {
        console.log('startTimer', this.state.isOpenFlow)
        if (this.state.isOpenFlow) {
          this.$refs.timeline.chengeTime(this.timestamp())
        }
      }, 1000)
    },
    // 清空定时器
    clearTimer() {
      console.log('clearTimer')
      clearInterval(this.timer)
      clearInterval(this.detectionTimer)
    },
    // 播放
    openPlay() {
      if (this.state.isOpenFlow) {
        this.getPlugin().videoResume()
        this.$nextTick(() => {
          this.state.isPlay = true
        })
      } else if (!this.isEdit) {
        // 开流
        this.caseTime = {}
        if (this.markTime[0].endTime) {
          this.caseTime.end = this.markTime[0].end * 1000
          this.timerStart = this.caseTime.end
        }
        if (this.markTime[0].startTime) {
          this.caseTime.start = this.markTime[0].startTime * 1000
          this.timerStart = this.caseTime.start
        }
        // 查询的起始时间
        let param = {
          startTime: parseInt(this.timerStart / 1000) - 12 * 60 * 60,
          endTime: parseInt(this.timerStart / 1000) + 12 * 60 * 60
        }
        this.queryRecordPlay(
          this.queryRecordOpen(param, this.videoNode),
          parseInt(this.timerStart / 1000),
          this.videoNode
        )
      }
    },
    // 停止
    stop() {
      if (this.state.isOpenFlow) {
        this.getPlugin().videoStop()
        this.getPlugin().isShowPlugin = false
        this.getPlugin().collected = false
        this.getPlugin().pluginState.isPlay = false
        this.getPlugin().pluginState.isStopped = true
        this.getPlugin().pluginState.isFullScreen = false
        this.getPlugin().init = false
        this.clearTimer()
        this.$nextTick(() => {
          this.state.isPlay = false
          this.state.isOpenFlow = false
          this.recordInfo = []
          this.state.isStopped = true
          this.caseTime = {}
        })
      }
    },
    // 全屏
    fullScreen() {
      if (this.state.isOpenFlow) {
        this.getPlugin().fullScreen()
      }
    },
    // 暂停
    videoPause() {
      if (this.state.isOpenFlow) {
        this.getPlugin().videoPause()
        this.$nextTick(() => {
          this.state.isPlay = false
        })
      }
    },
    // 打开伴音
    videoVolume() {
      if (this.state.isOpenFlow) {
        this.state.isVolumeOpen = !this.state.isVolumeOpen
        this.getPlugin().videoVolume()
      }
    },
    // 设置音量
    setVolume(v) {
      this.getPlugin().setVolume(v)
    },
    // 时间选择器——组件返回的日期时间(getTime())
    clicktest(time, date) {
      this.selectTime.dateVal = date
      this.$refs.calender.dateLimit.maxTime = new Date().getTime() // 赋值可选则的最大时间为现在时间
    },
    // 时间选择器——精确时间组件——传入值
    timeChange(val) {
      this.selectTime.timeVal = val
    },
    // 检索按钮
    async videoFilter() {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      let _t = this.selectTime.dateVal
      _t.setHours(this.selectTime.timeVal.split(':')[0])
      _t.setMinutes(this.selectTime.timeVal.split(':')[1])
      _t.setSeconds(this.selectTime.timeVal.split(':')[2])
      if (_t.getTime() > new Date().getTime()) {
        this.$Notice.warning({ title: '警告', desc: '精确时间不能超过当前时间！' })
        return
      }
      this.timerStart = Date.parse(_t)
      // 查询的起始时间
      let param = {
        startTime: parseInt(this.timerStart / 1000) - 12 * 60 * 60,
        endTime: parseInt(this.timerStart / 1000) + 12 * 60 * 60
      }
      if (!this.videoNode._id) {
        this.$Notice.warning({ desc: '请选择一个摄像头！', title: '警告' })
        return
      }
      let power = await this.getCameraPower(this.videoNode._id)
      if ((!power || !power.includes('playback'))) {
        return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      }
      this.caseTime = {}
      this.queryRecordPlay(
        this.queryRecordOpen(param, this.videoNode),
        parseInt(this.timerStart / 1000),
        this.videoNode
      )
      this.loading = true
    },
    // 查询对象
    queryRecordOpen(param, data) {
      const pros = []
      let _data = {
        eventType: this.eventtype,
        ip: data.eid.ip || data.ip,
        devIp: data.eid.ip || data.ip,
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
    queryRecordPlay(param, realTime, item) {
      Promise.all(param)
        .then(res => {
          // 为时间轴传基础数据
          if (!res[0].data.result.eventList.length) {
            this.loading = false
            this.errorMsg('该时段无录像')
            return
          }
          this.resourceList = {
            ...res[0].data.result,
            name: this.videoNode.name,
            res: this.videoNode._id,
            channel: this.videoNode.channel,
            devIp: this.videoNode.eid.ip,
            devPort: this.videoNode.eid.cport
          }
          // 渲染画面
          this.getPlugin()
            .syncRecordOpen(res[0], realTime)
            .then(() => {
              this.state.isPlay = true
              /**
               * 当选定时间不在查询的录像段的时间内时
               * 且只有一条录像段
               */
              let str = res[0].data.result.eventList[0].evtTblInfo.startTime
              let end = res[0].data.result.eventList[res[0].data.result.eventList.length - 1].evtTblInfo.endTime
              if (str > realTime) {
                realTime = str
              } else if (end < realTime) {
                realTime = end
              }
              this.addTimelineInfo(realTime * 1000)
              this.loading = false
              this.state.isOpenFlow = true
              this.startTimer()
              this.detectionTimer = setInterval(() => {
                this.detectionTimeFun()
              }, 10000)
            })
            .catch(error => {
              console.log(error)
              this.getPlugin().init = false
              this.loading = false
              this.errorMsg('开流失败')
            })
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.getPlugin().init = false
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
      if (!this.resourceList.eventList || !this.resourceList.eventList.length) {
        return
      }
      let param = {
        startTime: parseInt(timeValue) / 1000 - 12 * 60 * 60,
        endTime: parseInt(timeValue) / 1000 + 12 * 60 * 60
      }
      this.queryRecordPlay(this.queryRecordOpen(param, this.videoNode), parseInt(timeValue / 1000), this.videoNode)
    },
    // 正在播放的视频的时间戳
    timestamp() {
      let _time = this.getPlugin().plugin.GetPlayerCurTime()
      console.log(_time)
      _time = JSON.parse(_time)
      if (_time.success && _time.msCur) {
        return _time.msCur
      } else {
        return 0
      }
    },
    //  监测有没有下一段录像
    detectionTimeFun() {
      let time = Math.floor(this.timerStart / 1000)
      if (JSON.stringify(this.resourceList) === '{}' || this.resourceList.total === 0) {
        return
      }
      const info = this.findNextTimeInfo(time, this.resourceList.eventList)
      if (info.end && info.end - time < 10) {
        // 即将结束
        const nextInfo = this.findNextTimeInfo(info.end + 3, this.resourceList.eventList)
        if (nextInfo.end) {
          // 如果要关闭的3秒内有下一段录像 就不关了
          return
        }
        setTimeout(() => {
          this.stop()
        }, (info.end - time) * 1000)
      } else if (info.start && info.start - time < 10) {
        // 即将开始
        let _d = {
          data: {
            result: {
              ...this.resourceList
            }
          }
        }
        setTimeout(() => {
          this.getPlugin().syncRecordOpen(_d, info.start)
        }, (info.start - time) * 1000)
      }
    },
    // 查找下一段录像的信息
    findNextTimeInfo(time, eventList) {
      // 让 查询出来的录像信息 按开始时间排序
      const sortFunc = (pre, next) => {
        if (pre.sTime) {
          // 前端录像
          return pre.sTime - next.sTime
        } else if (pre.startTime) {
          // 下联设备录像
          return pre.startTime - next.startTime
        }
        // 中心录像
        return pre.evtTblInfo.startTime - next.evtTblInfo.startTime
      }
      let res = {}
      let list = this.$lodash.cloneDeep(eventList)
      eventList = eventList.sort(sortFunc)
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        // nitem 为下一个录像段
        let nitem = {}
        if (index < list.length - 1) {
          nitem = list[index + 1]
        }
        // 判断播放时间
        if (index === 0 && this.getRecordStartTime(item) >= time) {
          // 若 录像段开始时间(第一段) >= 要求播放时间
          // 则将播放时间修改为最近的有效时间（路录像段的开始时间）
          // 【播放时间 < 录像段开始时间】
          res = {
            start: this.getRecordStartTime(item)
          }
          break
        } else if (this.getRecordStartTime(item) <= time && time < this.getRecordEndTime(item)) {
          // 若 录像段开始时间 <= 要求播放时间 && 录像段结束时间 > 要求播放时间
          // 【录像段开始时间 < 播放时间 < 录像段结束时间】
          res = {
            end: this.getRecordEndTime(item)
          }
          break
        } else if (this.getRecordEndTime(item) <= time && this.getRecordStartTime(nitem) > time) {
          // 若 录像段结束时间 <= 要求播放时间 && 录像段开始时间 > 要求播放时间
          // 【录像段结束时间 < 播放时间】
          // 当播放时间大于当前录像段结束时间时，判断下一个录像段
          // 即 当 【当前】录像段结束时间 <= 要求播放时间 && 【下一个】录像段开始时间 > 要求播放时间
          res = {
            start: this.getRecordStartTime(nitem)
          }
          break
        }
      }
      return res
    },
    // 记录开始时间
    getRecordStartTime(obj) {
      if (!obj.evtTblInfo && !obj.sTime && !obj.startTime) {
        return 0
      }
      if (obj.sTime) {
        return obj.sTime
      } else if (obj.startTime) {
        return obj.startTime
      } else {
        return obj.evtTblInfo.startTime
      }
    },
    // 记录结束时间
    getRecordEndTime(obj) {
      if (!obj.evtTblInfo && !obj.eTime && !obj.endTime) {
        return 0
      }
      if (obj.eTime) {
        return obj.eTime
      } else if (obj.endTime) {
        return obj.endTime
      } else {
        return obj.evtTblInfo.endTime
      }
    }
  },
  beforeDestroy() {
    this.clearTimer()
    this.SET_CURNODE('')
    if (this.getPlugin()) {
      // this.stop()
    }
  }
}
</script>

<style>
#quickTowall .ivu-modal {
  width: fit-content !important;
}
</style>

<style scoped lang='less'>
.ViedorelayTrack {
  width: 100%;
  height: 100%;
  .main {
    display: flex;
    .body-left {
      margin: 10px;
      width: 230px;
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
      width: ~'calc(100% - 230px - 40px)';
      position: relative;
      .bs-video {
        height: ~'calc(100% - 90px)';
        position: relative;
        & /deep/ .bs-video-single {
          position: absolute;
          background: rgb(64, 64, 64);
        }
      }
      .videocontrol {
        position: relative;
        height: 90px;
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
.disable {
  color: #878282 !important;
}
</style>
