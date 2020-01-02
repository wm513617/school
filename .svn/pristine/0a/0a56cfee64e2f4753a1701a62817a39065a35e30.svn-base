<!--编辑模式 视频点位的录像回放功能 页面-->
<template>
  <div class="MapVideoPlayback" style="height: 100%; padding:6px 5px; 0">
    <div class="playBackLeft" style="display:inline-block; vertical-align:middle;height:100%">
      <div v-show="showSearch">
        <Calendar :width="220" style="margin:0 auto;" @clicktest="(str, date) => pickDate = date" @range="range => rangeTime = range" ref="calendar" :showSign="sourceType===1" :daterange="sourceType===2"></Calendar>
        <div class="playBackLeftMain">
          <div class="playInput">
            <span>文件来源</span>
            <div class="timeSelect">
              <Select v-model="sourceType" size="small" ref="sourceType" style="width:135px;">
                <Option v-for="item in sourceList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="playInput">
            <span>开始时间</span>
            <div class="timeSelect">
              <Time-picker type="time" v-model="startTime" placeholder="选择时间" size="small"></Time-picker>
            </div>
          </div>
          <div class="playInput">
            <span>结束时间</span>
            <div class="timeSelect">
              <Time-picker type="time" v-model="endTime" placeholder="选择时间" size="small"></Time-picker>
            </div>
          </div>
          <div>
            <Button type="primary" @click="searchRecord" :loading="loading">搜索</Button>
          </div>
        </div>
      </div>
      <div v-show="!showSearch" style="height:100%">
        <bs-scroll style="height: calc(100% - 46px)">
          <ul class="list-ui">
            <li :class="{active: index===playingIndex}" v-for="(item, index) in resultList" :key="index" @dblclick="playIndex(index)">
              <span>{{item.stime}}</span>
              <span style="float:right">{{item.duration}}</span>
            </li>
          </ul>
          <div style="padding: 10px" v-show="!resultList.length">
            无录像
          </div>
        </bs-scroll>
        <div style="padding-left: 10px">
          <Button type="primary" @click="showSearch=true">返回</Button>
        </div>
      </div>
    </div>
    <div style="display:inline-block; vertical-align:middle;height:100%;width: 550px;">
      <SimplePlaybackPlugin style="height: 330px" ref="frame" @on-dblclick="fullscreen" @playEnd="pluginState.isPlay?stop:''"></SimplePlaybackPlugin>
      <div class="btn-con" style="display:inline-block;margin-left:10px; width: 215px;">
        <PlaybackProgress :disabled="dis" :value="pvalue" :allTime="allTime" @on-mousedown="clearTimer" @on-mouseup="!dis&&startTimer()" @on-change="jumpPlay">
        </PlaybackProgress>
      </div>
      <div :class="playBackAllButton ? 'btnConDisabled' :'btn-con'" style="float:right;margin-right:10px;line-height:42px;" class="iconfont">
        <button @click="pluginState.isPlay? pause(): resume()" :title="pluginState.isPlay? '暂停': '播放'">{{pluginState.isPlay? '&#xe64d;': '&#xe666;'}}</button>
        <button @click="stop" title="停止">&#xe675;</button>
        <videoButtonTemplate ref="videoButtonTemplate" @playbackSpeed="playbackSpeed" width="26px" height="42px" :disable="!pluginState.isPlay"></videoButtonTemplate>
        <videoButtonTemplate buttonName="forward" @setPlayerMode="setPlayerMode" width="26px" height="42px" :disable="!pluginState.isPlay"></videoButtonTemplate>
        <button @click="download" :title="downloadList[curRecord]?'取消':'下载'">{{downloadList[curRecord]?'&#xe723;':'&#xe76d;'}}</button>
        <div class="setVolume" @mouseenter="showVolume = true" @mouseleave="showVolume = false">
          <button @click="pluginState.isVolumeOpen? closeSound(): openSound()" :title="!pluginState.isVolumeOpen? '静音': '声音'">{{!pluginState.isVolumeOpen? '&#xe697;': '&#xe678;'}}</button>
          <!--  -->
          <div class="slider-box" :style="{left: (showVolume || isDragging)&&pluginState.isVolumeOpen? '-100%': '-9999px' }">
            <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!pluginState.isVolumeOpen" v-model="volume">
            </slider>
          </div>
        </div>
        <button @click="getCapture" title="截图">&#xe67a;</button>
        <button @click="fullscreen" title="全屏">&#xe672;</button>
        <i class="icon iconfont icon-tv-wall" style="cursor: pointer;" :class="[!pluginState.isPlay ? 'disabled' : '']" title="快速上墙" @click="toWallBtn"></i>
        <button @click="$emit('update:toggle', 'video')" title="视频预览">&#xe679;</button>
      </div>
      <!-- <div class="btn-con iconfont">
        <button style="float:right" @click="$emit('update:toggle', 'video')" title="视频预览">&#xe679;</button>
      </div> -->
    </div>
     <Modal class="quickTowall" v-model="showWall" title="快速上墙" :mask-closable="false" :transition-names="[]">
      <iframe v-if="showWall" style="z-index:0;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
      <QuickToWall v-if="showWall" ref="toWall"  @checkWall="checkWall" :isPlayback="true" style="position:relative;" :camera="videoParam._id"></QuickToWall>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="showWall=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import 'components/Scroll'
import Slider from 'components/Slider'
import SimplePlaybackPlugin from 'components/video/SimplePlaybackPlugin'
import PlaybackProgress from 'components/video/PlaybackProgress'
import Calendar from 'components/common/BScalendar.vue'
import NVRplayback from 'components/video/mixins/NVRplayback'
import QuickToWall from 'view/video/tvwall/QuickToWall'
import videoButtonTemplate from '../../../components/videoComponentsNew/videoButtonTemplate'
import { vodCtrl } from '../../../http/video.api'
import moment from 'moment'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
const TIMEFORMAT = 'HH:mm:ss'
export default {
  components: {
    SimplePlaybackPlugin,
    PlaybackProgress,
    Calendar,
    Slider,
    QuickToWall,
    videoButtonTemplate
  },
  mixins: [NVRplayback],
  props: {
    videoParam: {
      type: Object,
      required: true
    }
  },
  data() {
    const now = new Date()
    return {
      selectedSpeed: {}, // 倍数信息
      wallBack: {}, // 上墙返回信息
      playBackAllButton: false,
      pluginState: {
        isPlay: false,
        isVolumeOpen: false,
        isStopped: true
      },
      startTime: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      endTime: (() => {
        const date = new Date()
        return date
      })(),
      pickDate: now,
      showSearch: true,
      resultList: [],
      playingIndex: -1,
      dsIp: null,
      pvalue: 0,
      curTime: 0,
      eTime: 0,
      sTime: 0,
      loading: false,
      showVolume: false,
      isDragging: false,
      volume: 50,
      curRecord: '',
      downloadList: {},
      serverId: null,
      rangeTime: null,
      isGbDevice: false, // 是否上下联设备
      showWall: false // 上墙弹窗状态

    }
  },
  computed: {
    ...mapGetters(['plugins']),
    ...mapState({
      strFilter: ({ videoOrg }) => videoOrg.strFilter,
      parameters: ({ platform }) => platform.parameters
    }),
    plugin() {
      return this.$refs.frame
    },
    dis() {
      return this.pluginState.isStopped
    },
    allTime() {
      return (this.eTime - this.sTime) * 1000
    }
  },
  watch: {
    resultList(val) {
      // 查询无录像时，录像下面的按钮置灰
      if (val.length.toString() === '0') {
        this.playBackAllButton = true
      } else {
        this.playBackAllButton = false
      }
    },
    curTime(t) {
      const pvalue = t - this.sTime * 1000
      this.pvalue = pvalue < 0 ? this.jumpValue || 0 : pvalue
    },
    pvalue(p) {
      if (p >= this.allTime && p && this.allTime) {
        this.stop()
      }
    },
    'pluginState.volumeValue'(v) {
      this.volume = v
    },
    sourceType(val) {
      if (val === 1) {
        this.$refs.calendar.startDate = null
        this.$refs.calendar.endDate = null
        this.rangeTime = null
      }
    }
  },
  methods: {
    ...mapMutations(['ADD_DOWNLOADLIST', 'CLOSE_DOWNLOAD', 'UP_DOWNLOADSTATE']),
    ...mapActions([
      'recordDump',
      'backupDownloadList',
      'queryRecordlist',
      'getPlatformID',
      'gbQueryRecordList',
      'gbRecordOpen',
      'gbPlayBackCtrl',
      'recordLog',
      'getCameraPower',
      'getVideoConf',
      'getMonitorList',
      'getTVList'
    ]),
    playbackVodCtrl(control) {
      // 发流控协议
      if (Object.keys(this.wallBack).length === 0) {
        return
      }
      vodCtrl({
        devInfo: this.wallBack.devInfo,
        devCtl: {
          control,
          monitor: this.wallBack.devCtl.monitor,
          pane: this.wallBack.devCtl.pane
        }
      })
    },
    playbackSpeed(seed) {
      // 回放倍数调节
      this.selectedSpeed = seed
      let status = this.plugin.plugin.SetRecordPlayerRate(seed.value.nRate, seed.value.nScale)
      if (Number(status) === 0) {
        this.playbackVodCtrl(seed.control)
      }
    },
    setPlayerMode() {
      let state = this.plugin.plugin.SetRecordPlayerMode(1)
      if (!state) {
        this.plugin.plugin.StartRecordPlay()
        this.pluginState.isPlay = false
      } else {
        this.errorMsg('逐帧回放失败')
      }
    },
    queryFirstPlay() {
      this.playIndex(0)
    },
    dealWithList(list = []) {
      if (list.length) {
        const time = this.formatTimeValue(this.startTime)
        const item0 = list[0]
        if (item0.evtTblInfo.startTime <= time && time < item0.evtTblInfo.endTime) {
          item0.evtTblInfo.startTime = time
        }
      }
      return list
    },
    playIndex(index) {
      if (index === this.playingIndex) {
        return
      }
      this.recordLog({
        logType: '操作日志',
        module: '电子地图',
        operateName: '录像回放',
        operateContent: '开始录像回放',
        target: this.videoParam.name,
        deviceIp: this.serverId ? this.serverId.ip : this.videoParam.eid.ip
      })
      if (this.sourceType === 2) {
        this.NvrOpen(index)
        return
      }
      if (this.isGbDevice) {
        this.gbOpen(index)
        return
      }
      const param = this.$lodash.cloneDeep(this.resultList[index])
      if (param) {
        this.pvalue = 0
        this.$nextTick(() => {
          this.sTime = this.eTime = 0
          this.jumpValue = 0
        })
        return this.open(param).then(() => {
          this.playingIndex = index
          this.sTime = param.evtTblInfo.startTime
          this.eTime = param.evtTblInfo.endTime
          this.startTimer()
          this.curRecord = param.evtTblInfo.startTime + '' + param.evtTblInfo.endTime
        })
      }
    },
    async open(param = this.tmpParam, type) {
      if (this.pluginState.isPlay && !type) { this.stop() }
      if (param) {
        this.tmpParam = param
        this.pluginState.isVolumeOpen = false
        const state = await this.plugin.open(
          {
            dsIp: this.dsIp,
            startTime: param.evtTblInfo.startTime,
            endTime: param.evtTblInfo.endTime,
            strmInfo: param.strmInfo
          },
          this.pluginState.isPlay
        )
        if (state) {
          this.pluginState.isPlay = true
          this.pluginState.isStopped = false
        }
      }
    },
    stop() {
      this.plugin.close()
      this.curRecord = ''
      this.pluginState.isPlay = false
      this.pluginState.isStopped = true
      this.pluginState.isVolumeOpen = false
      this.playbackVodCtrl(2)
      this.$refs.videoButtonTemplate.selectedSpeed = this.$refs.videoButtonTemplate.speedList[4] // 播放速度恢复
      this.clearTimer()
      this.playingIndex = -1
      this.pvalue = 0
      this.$nextTick(() => {
        this.sTime = this.eTime = 0
        this.jumpValue = 0
      })
      this.recordLog({
        logType: '操作日志',
        module: '电子地图',
        operateName: '录像回放',
        operateContent: '停止录像回放',
        target: this.videoParam.name,
        deviceIp: this.serverId ? this.serverId.ip : this.videoParam.eid.ip
      })
    },
    resume() {
      if (this.dis) {
        return
      }
      if (this.isGbDevice && this.pluginState.streamId) {
        this.gbPlayCtrl(1)
      }
      // 先去掉逐帧播放
      this.plugin.plugin.SetRecordPlayerMode(0)
      this.plugin.resume()
      this.playbackVodCtrl(this.selectedSpeed.control || 3) // 已当前倍数控流
      this.pluginState.isPlay = true
    },
    pause() {
      if (this.isGbDevice && this.pluginState.streamId) {
        this.gbPlayCtrl(2)
      }
      this.plugin.pause()
      this.playbackVodCtrl(1)
      this.pluginState.isPlay = false
    },
    getCapture() {
      if (this.dis) {
        return
      }
      // const state = this.plugin.getCapture()
      // if (state === 0) {
      //   this.successMsg('保存成功')
      // } else if (state !== 1) {
      //   this.errorMsg('保存失败')
      //   console.log('save error state', state)
      // }
      this.plugin.getScreenshot()
    },
    fullscreen() {
      if (this.dis) {
        return
      }
      if (this.plugin.isFullscreen) {
        this.plugin.cancelFullscreen()
      } else {
        this.plugin.fullScreen()
      }
    },
    openSound() {
      if (this.dis) {
        return
      }
      this.plugin.openSound()
      this.setVolume(50)
      this.pluginState.isVolumeOpen = true
    },
    closeSound() {
      if (this.dis) {
        return
      }
      this.plugin.closeSound()
      this.pluginState.isVolumeOpen = false
    },
    // 高级
    playBackSenior() {
      this.$emit('seniorClick')
    },
    showErr(msg) {
      this.$Notice.error({
        title: '错误',
        desc: msg,
        duration: 3
      })
    },
    checkTime() {
      if (!this.startTime) {
        this.showErr('开始时间不能为空')
        return false
      } else if (!this.endTime) {
        this.showErr('结束时间不能为空')
        return false
      } else if (moment(this.startTime, TIMEFORMAT).valueOf() >= moment(this.endTime, TIMEFORMAT).valueOf()) {
        this.showErr('结束时间必须大于开始时间')
        return false
      } else if (this.pickDate === null) {
        this.showErr('日期未选择')
        return false
      }
      return true
    },
    formatTimeValue(timeStr, time = this.pickDate) {
      const date = moment(timeStr, TIMEFORMAT).toDate()
      time.setHours(date.getHours())
      time.setMinutes(date.getMinutes())
      time.setSeconds(date.getSeconds())
      return parseInt(time.getTime() / 1000)
    },
    formatTime(time) {
      const date = new Date(time * 1000)
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatSpendTime(start, end) {
      let value = end - start
      if (!value) {
        value = 0
      }
      const seconds = value % 60
      value = parseInt(value / 60)
      const minutes = value % 60
      value = parseInt(value / 60)
      return [value, minutes, seconds]
        .map((item, index) => {
          if (index) {
            return ('00' + item).slice(-2)
          } else {
            return item
          }
        })
        .filter(item => item)
        .join(':')
    },
    async searchRecord() {
      if (!this.checkTime()) {
        return
      }
      this.power = await this.getCameraPower(this.videoParam._id)
      if ((!this.power || !this.power.includes('playback')) && !this.videoParam.type) {
        this.$Notice.warning({ desc: `${this.videoParam.name || ''}没有权限！`, title: '警告' })
        return
      }
      this.stop()
      let time = {
        startTime: this.formatTimeValue(this.startTime),
        endTime: this.formatTimeValue(this.endTime)
      }
      this.loading = true
      if (this.sourceType === 2) {
        if (!this.rangeTime) {
          this.$Notice.warning({ title: '警告', desc: '请选择正确的时间段！' })
          this.loading = false
          return
        }
        time = {
          startTime: this.formatTimeValue(this.startTime, this.rangeTime.startDate),
          endTime: this.formatTimeValue(this.endTime, this.rangeTime.endDate)
        }
        return this.searchNVR(this.videoParam, time)
      }
      if (this.videoParam.nodeId) {
        this.isGbDevice = true
        this.gbQuerySingle(this.videoParam, time)
        return
      }
      this.queryRecordlist({
        devIp: this.videoParam.eid.ip,
        devPort: this.videoParam.eid.cport,
        streamType: 'all',
        channel: this.videoParam.chan,
        startTime: time.startTime,
        endTime: time.endTime,
        eventType: ['all'],
        typeName: '',
        typeContent: '',
        page: 1,
        rows: 50
      })
        .then(suc => {
          this.loading = false
          this.resultList = this.dealWithList(suc.data.result.eventList).filter(
            item => item.evtTblInfo.startTime !== item.evtTblInfo.endTime
          )
          this.dsIp = suc.data.result.dsIp
          this.resultList.forEach(val => {
            val.stime = this.formatTime(val.evtTblInfo.startTime)
            val.duration = this.formatSpendTime(val.evtTblInfo.startTime, val.evtTblInfo.endTime)
          })
          this.showSearch = false
          this.queryFirstPlay()
        })
        .catch(e => {
          console.log(e, '录像查询')
          // console.error(e, '录像查询')
          this.loading = false
          this.showErr('查询录像失败')
        })
    },
    /**
     * 上下联设备录像查询
     */
    async gbQuerySingle(param, { startTime, endTime }) {
      this.serverId = await this.getPlatformID(param.shareServer)
      let queryParam = {
        recordType: 'all',
        gbPlaDevIp: this.serverId.ip, // 设备ip,
        gbPlaDevPort: this.serverId.port, // 设备端口,
        parentId: this.serverId.serverId, // 国标平台id,
        childId: param.nodeId, // 国标设备id,
        streamType: 'main',
        channel: param.chan,
        startTime,
        endTime
      }
      this.gbQueryRecordList(queryParam)
        .then(res => {
          this.loading = false
          if (res.data.result === 'error' || res.data.total === 0) {
            this.resultList = []
          } else {
            res.data.recordList.forEach(val => {
              val.stime = this.formatTime(val.startTime)
              val.duration = this.formatSpendTime(val.startTime, val.endTime)
              this.resultList.push(val)
            })
          }
          this.showSearch = false
        })
        .catch(err => {
          this.loading = false
          this.showErr('查询录像失败')
          console.error(err)
        })
    },
    /**
     * 下联设备播放
     */
    async gbOpen(index, startTime) {
      const param = this.$lodash.cloneDeep(this.resultList[index])
      const openParam = {
        gbPlaDevIp: this.serverId.ip,
        gbPlaDevPort: this.serverId.port,
        parentId: this.serverId.serverId,
        childId: this.videoParam.nodeId,
        channel: param.channel,
        startTime: startTime || param.startTime,
        endTime: param.endTime,
        streamType: 'main'
      }
      try {
        const res = await this.gbRecordOpen(openParam).catch(err => err)
        const state = await this.plugin.gbOpen(openParam, res)
        if (state === 0) {
          // 按钮状态变化
          this.pluginState.isPlay = true
          this.pluginState.isStopped = false
          this.playingIndex = index
          this.sTime = startTime || param.startTime
          this.eTime = param.endTime
          this.startTimer()
          this.curRecord = param.startTime + '' + param.endTime
        }
      } catch (err) {
        console.log(err)
      }
    },
    gbPlayCtrl(type = 1, seekTime = parseInt(this.getPluginCurtime() / 1000)) {
      this.gbPlayBackCtrl({
        gbPlaDevIp: this.serverId.ip,
        gbPlaDevPort: this.serverId.port,
        parentId: this.serverId.serverId,
        childId: this.videoParam.nodeId,
        playHandle: this.pluginState.streamId,
        ctrlType: type,
        speed: 1,
        seekTime: seekTime
      })
    },
    // 下联设备下载
    async gbDownLoad(path) {
      const param = this.$lodash.cloneDeep(this.resultList[this.playingIndex])
      const openParam = {
        gbPlaDevIp: this.serverId.ip,
        gbPlaDevPort: this.serverId.port,
        parentId: this.serverId.serverId,
        childId: this.videoParam.nodeId,
        channel: param.channel,
        startTime: param.startTime,
        endTime: param.endTime,
        streamType: 'main',
        downLoad: 'Download'
      }
      const res = await this.gbRecordOpen(openParam).catch(() => this.$Notice.warning({ title: '警告', desc: '请求错误！' }))
      if (!res) { return }
      const obj = {
        ip: res.data.TsIp,
        port: res.data.TsPort + '',
        fileName: path,
        beginTime: param.startTime + '',
        endTime: param.endTime + '',
        cmdStr: JSON.stringify({
          streamId: res.data.streamId
        })
      }
      return obj
    },
    getPluginCurtime() {
      let time = this.plugin.getPlayerCurTime()
      time = JSON.parse(time)
      if (time.success && time.msCur) {
        return time.msCur
      } else {
        return 0
      }
    },
    startTimer() {
      this.clearTimer()
      this.timer = setInterval(() => {
        let t = this.plugin.getPlayerCurTime()
        if (t > 0) {
          this.curTime = t
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
    },
    jumpPlay(v) {
      this.jumpValue = v
      if (this.sourceType === 2) {
        this.tmpParam.playInfo.sTime = this.sTime + parseInt(v / 1000)
        this.NvrOpen(this.playingIndex, this.tmpParam)
      } else if (this.isGbDevice) {
        this.gbOpen(this.playingIndex, this.sTime + parseInt(v / 1000))
      } else {
        this.tmpParam.evtTblInfo.startTime = this.sTime + parseInt(v / 1000)
        this.open(this.tmpParam, 1)
        this.startTimer()
      }
      this.dragHook()
    },
    dragHook() {
      if (this.pluginState.isVolumeOpen) {
        this.openSound()
      }
    },
    setVolume(v) {
      if (!this.pluginState.isPlay) {
        return
      }
      this.plugin.setVolume(v)
      this.volume = v
    },
    closeDown() {
      this.plugins.CloseRecordDump(this.downloadList[this.curRecord])
      this.CLOSE_DOWNLOAD(+this.downloadList[this.curRecord])
      delete this.downloadList[this.curRecord]
    },
    async download() {
      this.power = await this.getCameraPower(this.videoParam._id)
      if ((!this.power || !this.power.includes('download'))) {
        this.$Notice.warning({ desc: '没有权限！', title: '警告' })
        return
      }
      if (this.pluginState.isStopped) {
        return
      }
      if (this.downloadList[this.curRecord]) {
        this.closeDown()
        return
      }
      this.getVideoConf() // 同步localStorage数据到本地配置
      const videoType = this.parameters.downloadVideoType.toLowerCase()
      let videoName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + videoType
      let path = this.parameters.downloadVideoPath + '\\' + videoName.toString()
      let strFileDir = this.parameters.downloadVideoPath + '\\download.txt'
      let creatDir = this.plugin.plugin.SaveFileInfo(strFileDir, 'download')
      if (creatDir) {
        this.$Notice.warning({ desc: '创建目录文件失败', title: '警告' })
        return
      }
      if (typeof path !== 'number') {
        this.dw(path)
      }
    },
    async dw(path) {
      let param, startTime, endTime, event
      if (this.sourceType === 2) {
        param = await this.nvrDownLoad(path)
      } else if (this.videoParam.nodeId) {
        param = await this.gbDownLoad(path)
      } else {
        event = this.tmpParam
        const obj = {}
        obj.eventList = {}
        obj.eventList.timeInfo = {}
        obj.eventList.timeInfo.startTime = startTime = event.evtTblInfo.startTime
        obj.eventList.timeInfo.endTime = endTime = event.evtTblInfo.endTime
        obj.eventList.strmInfo = event.strmInfo
        param = {
          ip: this.dsIp + '',
          port: 9000 + '',
          fileName: path,
          beginTime: obj.eventList.timeInfo.startTime + '',
          endTime: obj.eventList.timeInfo.endTime + '',
          cmdStr: JSON.stringify({
            params: {
              jsonrpc: '2.0',
              id: '1',
              method: 'brest',
              call: 'AV.Record.playopen',
              args: obj
            }
          })
        }
      }
      if (!param) { return }
      const curRecord = param.beginTime + '' + param.endTime
      const DATEFORMAT = 'YYYY-MM-DD HH:mm:ss'
      param = JSON.stringify(param)
      const dump = JSON.parse(this.plugins.OpenRecordDump(param))
      let item
      if (this.sourceType === 2) {
        item = {
          openParam: this.openParam,
          param: param,
          name: this.videoParam.name,
          startTime: this.$moment(this.openParam.sTime * 1000).format(DATEFORMAT),
          endTime: this.$moment(this.openParameTime * 1000).format(DATEFORMAT),
          size: this.tmpParam.playInfo.size,
          type: this.tmpParam.playInfo.evtType,
          pre: '--',
          dumpHandle: '',
          state: ''
        }
      } else if (this.videoParam.nodeId) {
        item = {}
      } else {
        item = {
          openParam: null,
          param: param,
          name: this.videoParam.name,
          startTime: this.$moment(startTime * 1000).format(DATEFORMAT),
          endTime: this.$moment(endTime * 1000).format(DATEFORMAT),
          size: event.evtTblInfo.size,
          type: event.evtTblInfo.evtType,
          pre: '--',
          dumpHandle: '',
          state: ''
        }
      }
      this.recordLog({
        logType: '操作日志',
        module: '电子地图',
        operateName: '录像下载',
        operateContent: `开始时间:${item.startTime},结束时间:${item.endTime}`,
        target: this.videoParam.name,
        deviceIp: this.serverId ? this.serverId.ip : this.videoParam.eid.ip
      })
      if (dump.success) {
        this.$Notice.warning({ title: '提示', desc: `录像开始下载,下载路径为${path}` })
        this.downloadList[curRecord] = dump.DumpHandle
        item.dumpHandle = dump.DumpHandle
        item.state = '下载中'
        this.plugins.SetRecordDumpNotifyCallback(dump.DumpHandle, () => {
          this.plugins.CloseRecordDump(dump.DumpHandle)
          delete this.downloadList[curRecord]
          this.UP_DOWNLOADSTATE(+dump.DumpHandle)
        })
      } else {
        this.this.$Notice.warning({ title: '提示', desc: `下载失败` })
        item.state = '下载失败'
        console.log('下载出错')
      }
      this.ADD_DOWNLOADLIST(item)
      this.backupDownloadList()
    },
    // 上墙
    toWallBtn() {
      // 上墙
      if (!this.pluginState.isPlay) {
        return
      }
      this.getTVList().then(() => {
        this.getMonitorList()
      })
      this.showWall = true
    },
    findStrmInfo(eventList, time) {
      // return 1111
      // 找出当前播放录像段的strminfo
      for (const iterator of eventList) {
        if (iterator.evtTblInfo.startTime < time && time < iterator.evtTblInfo.endTime) {
          return iterator.evtTblInfo
        }
      }
    },
    // 快速上墙
    async checkWall(i) {
      // if (!this.isasyn) {
      //   return
      // }
      // console.log('checkWall', i)
      let eventList, ds, streamId, ts
      // const cutTime = JSON.parse(this.plugin.getPlayerCurTime())
      // if (!cutTime.success) {
      //   return
      // }
      // if (this.isNVR) {
      // const nvrOpenRes = await this.$parent.nvrVodOpen({ time: cutTime.msCur / 1000 })
      // ts = {
      //   tsPort: nvrOpenRes.TsPort,
      //   tsIp: nvrOpenRes.TsIp
      // }
      // streamId = nvrOpenRes.streamId
      // } else if (this.state.streamId) {
      // const gbOpenRes = await this.$parent.gbVodOpen({ time: cutTime.msCur / 1000 })
      // ts = {
      //   tsPort: gbOpenRes.TsPort,
      //   tsIp: gbOpenRes.TsIp
      // }
      // streamId = gbOpenRes.streamId
      // } else {
      // 中心回放上墙吧
      // this.activePluginData = this.$lodash.cloneDeep(this.resourceList[this.plugin.activedIndex])
      // const event = this.findStrmInfo(this.activePluginData.eventList, parseInt(cutTime.msCur / 1000))
      let startTime = parseInt(this.plugin.getPlayerCurTime() / 1000)
      ds = {
        dsIp: this.dsIp,
        dsPort: 9000
      }
      eventList = {
        timeInfo: {
          startTime: startTime,
          endTime: parseInt(this.resultList[this.resultList.length - 1].evtTblInfo.endTime)
        },
        strmInfo: this.findStrmInfo(this.resultList, startTime)
      }
      eventList = {
        params: {
          jsonrpc: '2.0',
          id: '1',
          method: 'brest',
          call: 'AV.Record.playopen',
          args: {
            eventList: eventList
          }
        }
      }
      this.$refs.toWall.addToWall(this.videoParam._id, i, eventList, ds, streamId, ts).then(r => {
        this.wallBack = JSON.parse(JSON.stringify(r.data || {}))
      })
    }
  },
  mounted() {
    this.$refs.calendar.dateLimit.maxTime = new Date().getTime()
  },
  beforeDestroy() {
    this.clearTimer()
    this.downloadList = null
    this.stop()
  }
}
</script>
<style lang="less" scoped>
.btn-con {
  line-height: 30px;
  height: 30px;

  button {
    border: 0 none;
    background: transparent;
    color: #fff;
    padding: 0 5px;
    outline: 0 none;
    cursor: pointer;
  }

  button:hover {
    color: #20adff;
  }
}
.btnConDisabled {
  line-height: 30px;
  height: 30px;

  button {
    border: 0 none;
    background: transparent;
    color: #cacaca;
    padding: 0 5px;
    outline: 0 none;
    cursor: default;
  }
}

.MapVideoPlayback {
  display: flex;
  justify-content: space-around;
  user-select: none;
}

.MapVideoPlayback .playBackLeft {
  width: 220px;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

.MapVideoPlayback .playBackLeft .playBackLeftMain {
  padding: 10px;
  padding-bottom: 0px;
}

.MapVideoPlayback .playBackLeft .playBackLeftMain .playInput {
  line-height: 26px;
  width: 100%;
}

.MapVideoPlayback .playBackLeft .playBackLeftMain .playInput > span {
  height: 26px;
  line-height: 26px;
  width: 60px;
}

.MapVideoPlayback .playBackLeft .playBackLeftMain .playInput .timeSelect {
  display: inline-block;
  // width: 140px;
}

.MapVideoPlayback .playBackLeft .playBackLeftMain > div {
  margin-bottom: 5px;
}

.MapVideoPlayback .playBackLeft .playBackLeftMain .closeBtn {
  margin: 0px;
  height: 26px;
  line-height: 26px;
}

.MapVideoPlayback .playBackLeft .ivu-date-picker {
  width: 135px;
}

.list-ui li {
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
  color: #bfbfbf;

  &:hover {
    background: #20365c;
  }

  &.active {
    background: #2a436a;
    color: #00a5e3;
  }
}

.setVolume {
  display: inline-block;
  position: relative;

  .slider-box {
    position: absolute;
    width: 90px;
    display: inline-block;
    left: -100%;
    bottom: 0;

    .bsr-slider-horizontal {
      padding: 0 12px;
      line-height: 20px;
    }
  }
}

.playback-speed {
  display: inline-block;
  width: 26px;
}
</style>
