<template>
  <div class="container" :class="{ active: isActive&&!noBorder, bdr: boder, bdr1: !boder}" @click="clickEvent" @dblclick="doubleClickEvent" :index="index" @mouseout="startShowTimer">
    <div style="position:relative;height:100%;vertical-align:middle" :class="{outofscreen: isSyncPause || isCapPause}" :index="index">
      <div v-if="init" class="objectBox">
        <object ref="object" type="application/x-webplayercontrol" ></object>
      </div>
    </div>
    <img style="position:relative;width:100%;height:100%;vertical-align:middle;background:black;z-index:1;" v-if="isCapPause" :src="capImg" />
    <div style="position:absolute;width:100%;height:100%;vertical-align:middle;background:black;top:0;left:0;" v-if="isSyncPause"></div>
    <!--
    <div class="pause-img" v-if="false" v-show="recordPauseState">
      <iframe></iframe>
      <img v-if="false" :src="imgSrc" style="width:100%;height:100%"/>
    </div>
    -->
    <!-- 快速云台按钮 目前等待提供图标-->
    <template v-if="(toolbar==='preview'&&showPTZ&&toolbarShow&&pluginState.isPlay&&!$parent.pollId&&!isReviewOpen)">
    <div class="buttonBars"  @mouseup.stop="controlDome(item.addess,0)" @mousedown.stop="controlDome(item.addess)" v-for="(item, i) in xy" :key="i" :style="{left: `calc(50% + ${-20 + item.x}px)`, top: `calc(50% + ${-20 + item.y}px)`}">
      <iframe></iframe>
      <div class="buttonBar-box buttonBar-boxs" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" style="width: 100%; height: 100%" alt="">
        <!-- <i class="icon iconfont icon-shang" style="width: 20px; height: 20px; font-size: 20px; color: #000000"></i> -->
      </div>
    </div>
    </template>
    <!-- 快速云台按钮 isReviewOpen end -->
    <!-- 正常视频播放按钮 star -->
    <div v-if="((toolbar==='preview' || toolbar==='capture') && toolbarShow && pluginState.isPlay && !$parent.pollId && !isReviewOpen && activedIndex === index)" class="buttonBar" @mouseout.stop="startShowTimer" @mouseover.stop>
      <iframe v-if="(toolbar==='preview' || toolbar==='capture')&&toolbarShow&&pluginState.isPlay"></iframe>
      <div class="buttonBar-box">
        <div style="float: left">
          <i class="icon iconfont icon-hidemenu-copy-copy" title="隐藏" @click.stop="toolbarShow = false"></i>
        </div>
        <div style="float: right;">
          <i class="icon iconfont icon-preview-stop" :class="[pluginState.isPlay? '': 'disable']" title="关闭预览" @click="quickStop()"></i>

          <i class="icon iconfont" :class="[pluginState.isPlay? '': 'disable',pluginState.isPoll?'disable':'',!pluginState.isVolumeOpen? 'icon-mute': 'icon-volume']" :title="[pluginState.isVolumeOpen? '关闭伴音': '开启伴音']" @click="pluginState.isVolumeOpen? closeSound(): $parent.openSound()"></i>

          <i class="icon iconfont icon-yuntai" v-if="toolbar!=='capture'" :class="{disable: disablePTZ}" title="云台" @click="PTZClick()"></i>

          <i class="icon iconfont" :class="[pluginState.isPlay? '': 'disable',pluginState.isPoll?'disable':'',!pluginState.isBoost? 'icon-nk-close': 'icon-niaokan']" :title="[pluginState.isBoost? '关闭鸟瞰': '开启鸟瞰']" @click="pluginState.isPoll?'':boost()"></i>
          <i class="icon iconfont icon-tv-wall" :class="[pluginState.isPlay? '': 'disable',pluginState.isPoll?'disable':'']" title="快速上墙" @click="showWall=pluginState.isPlay&&true"></i>
          <i class="icon iconfont icon-view-quick" v-if="toolbar!=='capture'" :class="[pluginState.isPlay? '': 'disable',pluginState.isPoll?'disable':'']" title="快速回放" @click="nowDateSave();celerityPlayback()"></i>
          <i class="icon iconfont icon-history-query " v-if="toolbar!=='capture'" :class="[pluginState.isPlay? '': 'disable',pluginState.isPoll?'disable':'']" title="历史回放" @click="BackViewShowfn"></i>
          <i class="icon iconfont" :class="[fs2? 'icon-exit-full-screen' : 'icon-quanpingfangda']" :title="fs2 ? '退出全屏' : '全屏'" @click="newFullScreen"></i>
        </div>
      </div>

    </div>
    <!-- 快速回放按钮 -->
    <div v-if="isReviewOpen" class="buttonBar" @mouseout.stop="startShowTimer" @mouseover.stop>
      <iframe v-show="toolbar==='preview'&&toolbarShow&&isReviewOpen"></iframe>
      <div class="buttonBar-box">
        <div style="float: left">
          <i class="icon iconfont icon-hidemenu-copy-copy" title="隐藏" @click.stop="toolbarShow = false"></i>
        </div>
        <div style="float: right;width: calc(100% - 45px);text-align: right">
          <i class="icon iconfont" :class="[reviewButton.isPlay? 'icon-pause': 'icon-play']" :title="[reviewButton.isPlay? '暂停': '播放']" @click="backViewStop"></i>
          <!-- <i class="icon iconfont icon-stop" title="停止"
          @click="APIs.recordPlugin.stop(plugin)"
          ></i> backViewBack -->
          <i class="icon iconfont icon-stop" title="停止" @click="backViewBack"></i>
          <i class="icon iconfont icon-screenshot " title="截图" @click="$parent.getPicture()"></i>
          <i class="icon iconfont icon-download " title="下载" @click="downBackVideo"></i>
          <!-- <i :class="['icon', 'iconfont', backViewStreamIcon[streamIconCount] ]" @click="selStream" title="码流"></i> -->
          <i class="icon iconfont icon-history-query" title="历史回放" @click="BackViewShowfn"></i>

          <!-- 进度条 -->
          <playbackProgress :allTime="BACKTIME" :basics="VnowTime" :value="backPlan" :disabled="false" style="width: calc(100% - 215px);height:20px; padding-left:10px; display:inline-block" @on-change="backMousehange" @on-mousedown="backMousedown" @on-mouseup="backMouseup"></playbackProgress>

          <i @click="backViewBack" title="返回" class="icon iconfont icon-recovery" style="transform: rotate(180deg);display: inline-block;"></i>
          <!-- <i  @click="upDateTime"  title="返回" class="icon iconfont icon-recovery" style="transform: rotate(180deg);display: inline-block;" ></i> -->
        </div>
      </div>

    </div>
    <!-- 上墙弹框 -->
    <Modal class="quickTowall" v-if="toolbar==='preview' || toolbar==='capture'" v-model="showWall" title="快速上墙" :mask-closable="false" :transition-names="[]">
      <iframe v-if="showWall" style="z-index:0"></iframe>
      <QuickToWall v-if="showWall" style="margin:0 auto" :camera="cameraId"></QuickToWall>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="showWall=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import API from './pluginImp'
import QuickToWall from 'view/video/tvwall/QuickToWall'
import cp from './mixins/capturePause'
import backV from './mixins/backView'
import centreRecord from './mixins/centreRecord'
import { YUNNAN_CTRL_SET, recordUserLog } from 'src/http/video.api.js'
import { mapActions, mapState } from 'vuex'
//  快速回放中的进度条组件  待使用
import PlaybackProgress from 'components/video/PlaybackProgress1'
// 快速云台按钮的圆的半径
const R = 100
export default {
  name: 'VideoPlugin',
  mixins: [cp, backV, centreRecord],
  components: {
    QuickToWall,
    PlaybackProgress
  },
  props: {
    index: {
      type: Number,
      default: 0
    },
    activedIndex: {
      type: Number,
      default: -1
    },
    clickInit: {
      type: Boolean,
      required: true
    },
    toolbar: {
      type: String
    },
    pType: {
      type: String
    },
    noBorder: {
      type: Boolean
    }
  },
  data() {
    return {
      init: false,
      pluginType: this.pType,
      // 镜头类型
      monitorType: '',
      toolbarShow: false,
      boder: true,
      isSyncPause: false,
      showWall: false,
      cameraId: '',
      paramlist: [],
      timed: null,
      pollNum: 0,
      isPolling: false,
      fs2: false,
      power: [],
      // imgSrc: '',
      pluginState: {
        isPlay: false, // 正在播放
        isStopped: true, // 播放完毕
        isBoost: false, // 鸟瞰状态
        isVolumeOpen: false, // 伴音
        isRecording: false, // 录像
        isCentreRecording: false, // 录像
        isSpeech: false, // 对讲
        isFrame: false, // 逐帧、I帧
        isPoll: false,
        isFullScreen: false,
        volumeValue: 0,
        streamType: 'main',
        speed: '1',
        scale: '自适应',
        streamId: '' // 标记下联设备，记录信息为：下联回放开流id/下联预览shareServer
      },
      reviewButton: {
        isPlay: false // 正在播放
      },
      pluginAPI: API.emptyPlugin,
      // 是否显示历史回放
      showBackView: false,
      // 是否显示快速云台
      showPTZ: false,
      // 需要回放的数据
      backViewData: {},
      openStreamInfo: {}, // 播放成功后的流信息
      picConfig: '',
      tOpen: '' // 断线重连开流定时器
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    }),
    // 禁用云台
    disablePTZ() {
      return this.monitorType === 0 || this.monitorType === 1 || !this.pluginState.isPlay || this.isPolling // 枪机和红外枪机时禁用
    },
    isActive() {
      return this.activedIndex === this.index
    },
    // Math.sqrt(R)
    xy: () => [
      { x: 0, y: -R, angle: '0', addess: 'tiltUp', img: '/static/yuntai/bottom1.png' },
      { x: 0, y: R, angle: '180', addess: 'tiltDown', img: '/static/yuntai/bottom1.png' },
      { x: -R, y: 0, angle: '-90', addess: 'panLeft', img: '/static/yuntai/bottom1.png' },
      { x: R, y: 0, angle: '90', addess: 'panRight', img: '/static/yuntai/bottom1.png' },
      {
        x: -Math.sqrt((R * R) / 2),
        y: -Math.sqrt((R * R) / 2),
        angle: '-90',
        addess: 'swayUpLeft',
        img: '/static/yuntai/bottom2.png'
      },
      {
        x: -Math.sqrt((R * R) / 2),
        y: Math.sqrt((R * R) / 2),
        angle: '-180',
        addess: 'swayDownLeft',
        img: '/static/yuntai/bottom2.png'
      },
      {
        x: Math.sqrt((R * R) / 2),
        y: -Math.sqrt((R * R) / 2),
        angle: '0',
        addess: 'swayUpRight',
        img: '/static/yuntai/bottom2.png'
      },
      {
        x: Math.sqrt((R * R) / 2),
        y: Math.sqrt((R * R) / 2),
        angle: '90',
        addess: 'swayDownRight',
        img: '/static/yuntai/bottom2.png'
      }
    ],
    APIs() {
      return API
    }
  },
  watch: {
    pluginType() {
      if (this.init && this.plugin && this.plugin.valid) {
        this.pluginAPI = API[this.pluginType + 'Plugin']
      }
    },
    init(i) {
      if (i) {
        this.$nextTick(function() {
          this.initPlugin()
        })
      } else {
        this.removePlugin()
      }
    },
    activedIndex(index) {
      if (this.isActive) {
        this.emitState()
        if (!this.init && this.clickInit) {
          this.init = true
        }
      }
    },
    pluginState: {
      deep: true,
      handler: function(state) {
        if (this.isActive) {
          this.emitState()
        }
      }
    },
    'pluginState.isPlay': function(isPlay) {
      if (isPlay) {
        this.cameraId = this.$parent.pluginData[this.index] ? this.$parent.pluginData[this.index].id : ''
      }
    }
  },
  methods: {
    ...mapActions(['gbRecordOpen', 'getCameraPower', 'upPlayindId', 'getPlatformID', 'gbQueryRecordList']),
    removePlugin() {
      // ff bug: 不删除插件
      // this.$el.querySelector('.oc').innerHTML = ''
    },
    disablePlugin() {
      this.init = false
    },
    emitState() {
      this.$emit('update:pluginState', this.pluginState)
    },
    activePlugin() {
      this.$emit('update:activedIndex', this.index)
    },
    updateToolbarTimer() {
      this.clearShowTimer()
      this.startShowTimer()
    },
    clearShowTimer() {
      clearTimeout(this.showTimer)
      this.toolbarShow = false
      this.showPTZ = false
    },
    startShowTimer() {
      // clearTimeout(this.showTimer)
      // this.showTimer = setTimeout(() => {
      //   this.toolbarShow = false
      //   this.showPTZ = false
      // }, 10000)
    },
    showToolbar() {
      this.toolbarShow = true
      this.startShowTimer()
    },
    clickEvent() {
      this.activePlugin()
      this.showToolbar()
    },
    // 改变插件播放类型 现场， 回放
    setPluginType(type) {
      this.pluginType = type
    },
    doubleClickEvent() {
      this.$emit('on-dblclick', this.index)
    },
    pluginClickEvent(idx, status) {
      if (status === 1) {
        this.clickEvent()
      } else if (this.pluginState.isFullScreen) {
        this.fullScreen()
      } else {
        this.doubleClickEvent()
      }
    },
    pluginEscCall(index, type, keyCode) {
      if (+keyCode === 27) {
        this.exitFullscreen() // 解决360下插件获得焦点无法正常退出全屏问题
        this.$parent.escFn({ which: 27 })
      }
      if (this.pluginState.isFullScreen && +keyCode === 27) {
        this.fullScreen()
        // this.pluginState.isFullScreen = false
      }
    },
    async initPluginType(type) {
      this.init = true
      await this.$nextTick()
      this.initPlugin()
      this.setPluginType(type)
    },
    initPlugin() {
      this.plugin = this.$refs.object
      if (this.plugin && this.plugin.valid) {
        this.pluginAPI = API[this.pluginType + 'Plugin']
        setTimeout(() => {
          this.plugin.SetMouseStatusCallback(this.pluginClickEvent)
          this.plugin.SetKeyboardCallback(this.pluginEscCall)
          this.plugin.SetNotifyCallback(() => {
            // 回调预览的时候是断线；回放的时候是播放完毕
            this.$parent.$emit('playEnd', this.index)
            if (
              (this.$route.path === '/play_video/realtime' && !this.$parent.pollId) ||
              this.$route.path === '/veriface/Capture' ||
              this.$route.path === '/vehicle/detection'
            ) {
              // 在预览界面并且不是轮巡,在人像识别界面,车辆识别界面才会断线重连
              let inParam = JSON.parse(JSON.stringify(this.openStreamInfo))
              this.quickStop()
              this.timerOpen(inParam)
            }
          })
        }, 100)
      }
    },
    async checkInit() {
      if (!this.init) {
        this.init = true
        await this.$nextTick()
        this.initPlugin()
      }
    },
    timerOpen(inParam) {
      // 断线后定时重新开流
      this.tOpen = setInterval(() => {
        this.$parent.assignOpen(this.index, inParam)
      }, 10000)
    },
    clearTOpen() {
      // 清除断线重新开流定时器
      clearInterval(this.tOpen)
      this.tOpen = null
    },
    setShowmode(mode) {},
    async open(param, noPower) {
      await this.checkInit()
      if (!param) {
        return
      }
      if ('monitorType' in param) {
        this.monitorType = param.monitorType
      }
      if (this.pluginType === 'preview' && this.pluginState.isPlay && param.gbDevId) {
        // 国标切换码流需要先关流
        await this.stop(false)
      }
      if (this.pluginType === 'preview' && param.id && !noPower) {
        this.power = await this.getCameraPower(param.id)
        if (!this.power || !this.power.includes('preview')) {
          this.$Notice.warning({ desc: `${param.name || ''}没有权限！`, title: '警告' })
          return
        }
      }
      return new Promise((resolve, reject) => {
        this.pluginAPI.open(this.plugin, param).then(state => {
          if (this.pluginType === 'record') {
            // 回放重新开流就按倍数来
            let playbackVideoModule = this.$parent.$parent
            if (playbackVideoModule.speedList instanceof Array) {
              // 这个组件用的地方太多了， 修改东西一点要确定唯一性
              let obj = playbackVideoModule.speedList.filter(item => playbackVideoModule.selectedSpeed === item.label)
              playbackVideoModule.clickSpeed(obj[0])
            }
          }
          const pictureSel = this.parameters.picture === '流畅优先' ? 0 : 1
          this.plugin.RealSetPlayMode(pictureSel) // 设置预览播放模式
          if (param.ip) {
            this.pluginAPI.setTipsText(this.plugin, param.ip)
          }
          if (state === 0 || (state.open && state.state === 0)) {
            this.pluginState.isStopped = false
            this.pluginState.isPlay = true
            this.pluginState.isFrame = false
            if (param.streamType) {
              this.pluginState.streamType = param.streamType
            }
            this.$parent.playingCount++
            this.$parent.ADD_PLAYINGID(param.id)
            if (param.gbDevId) {
              // 下联设备开流记录shareServer
              this.pluginState.streamId = param.shareServer
            }
            if (this.$route.path === '/play_video/realtime') {
              this.clearTOpen()
            }
            resolve(state)
            this.openStreamInfo = this.$parent.pluginData[this.index]
            this.setPreviewLog('open') // 预览日志
            if (this.pluginType === 'preview') {
              this.picConfig = this.GetPlayerPicParam({
                devIp: param.ip,
                port: param.port,
                channel: param.channel
              }).then(res => {
                this.picConfig = res
              })
            }
          } else {
            if (this.tOpen) {
              // 断线重连状态不做提示
            } else if (param.streamType === 'sub1' || param.streamType === 'sub2') {
              this.$Notice.warning({
                title: '提示',
                desc: `${param.streamType === 'sub1' ? '子码流' : '第三码流'}开流失败！`
              })
            } else {
              this.$Notice.warning({ title: '提示', desc: '开流失败！' })
            }
            resolve(state)
          }
        })
      })
    },
    setStream(streamType) {
      this.pluginState.streamType = streamType
    },
    syncResume(param, res) {
      if (res) {
        this.$parent.pluginData[this.index] = res
      }
      if (this.isSyncPause === false) {
        return
      }
      this.isSyncPause = false
      return this.open(param)
    },
    resume() {
      const state = this.pluginAPI.resume(this.plugin)
      if (this.pluginState.isFrame) {
        this.setPlayerMode(0)
      }
      if (state) {
        // fail
      } else {
        // this.imgSrc = ''
        this.pluginState.isPlay = true
        this.pluginState.isFrame = false
      }
    },
    syncPause() {
      // 同步回放时的pause
      this.isSyncPause = true
      this.pause()
    },
    pause() {
      if (!this.plugin) {
        return
      }
      const state = this.pluginAPI.pause(this.plugin)
      if (state) {
        // fail
      } else {
        // while (this.pluginType === 'record' && !this.imgSrc) {
        //   this.imgSrc = this.getCapture({ type: 1, quality: 100 })
        // }
        this.pluginState.isPlay = false
      }
    },
    /**
     * 停止播放
     * 停止视频时，是否销毁插件，默认为true
     */
    stop(isDestroyPlugin = true) {
      this.isSyncPause = false
      this.isCapPause = false
      this.capImg = ''
      if (!this.init) {
        return 0
      }
      this.pluginState.isPlay && this.setPreviewLog('stop', this.openStreamInfo) // 预览日志
      this.openStreamInfo = {}
      const state = this.pluginAPI.stop(this.plugin)
      if (state) {
        // fail
      } else {
        if (this.pluginState.isCentreRecording) {
          this.stopCentreRecord()
        }
        this.pluginState.isStopped = true
        this.pluginState.isPlay = false
        this.pluginState.isBoost = false
        this.pluginState.isVolumeOpen = false
        this.pluginState.isRecording = false
        this.pluginState.isCentreRecording = false
        this.pluginState.isSpeech = false
        this.pluginState.streamType = 'main'
        this.pluginState.scale = '自适应'
        this.pluginState.speed = '1'
        this.pluginState.streamId = ''
        this.$parent.playingCount--
        this.picConfig = ''
        this.showPTZ = false
      }
      if (!this.clickInit && isDestroyPlugin) {
        this.init = false
        this.plugin = null
      }
    },
    quickStop() {
      if (this.tOpen) {
        this.clearTOpen()
      }
      this.stop()
      if (this.$route.path === '/veriface/Capture') {
        let arr = JSON.parse(sessionStorage.getItem('playingCameraList'))
        arr[this.$parent.activedIndex] = null
        sessionStorage.setItem('playingCameraList', JSON.stringify(arr))
      }
      if (this.$parent.pluginData[this.$parent.activedIndex]) {
        const id = this.$parent.pluginData[this.$parent.activedIndex].id
        // this.$parent.DEL_PLAYINGID(id)
        delete this.$parent.pluginData[this.$parent.activedIndex]
        this.$parent.$emit('close', id)
      }
      const arr = []
      for (const key in this.$parent.pluginData) {
        arr.push(this.$parent.pluginData[key].id)
      }
      this.upPlayindId(arr)
      this.clearPollTimed()
    },
    // BackViewShowfn 历史回放
    BackViewShowfn() {
      if (!this.power || !this.power.includes('playback')) {
        this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        return
      }
      // return
      if (this.$root.isFullscreen) {
        return
      }
      this.showBackView = true
      const data = this.$parent.pluginData[this.$parent.activedIndex]
      this.backViewData = {
        eid: {
          ip: data.ip,
          cport: data.port,
          dport: data.dport,
          _id: data.pid
        },
        chan: data.channel,
        name: data.name || '',
        nodeId: data.gbDevId || null,
        shareServer: data.shareServer || null
      }
      this.$parent.$emit('BackViewShowfn', this.$parent.activedIndex, this.backViewData)
    },
    openSound() {
      if (!this.plugin) {
        return
      }
      const state = this.pluginAPI.openSound(this.plugin)
      if (state) {
        // fail
      } else {
        this.pluginState.isVolumeOpen = true
        this.setVolume(50)
      }
    },
    closeSound() {
      if (!this.plugin) {
        return
      }
      const state = this.pluginAPI.closeSound(this.plugin)
      if (state) {
        // fail
      } else {
        this.pluginState.isVolumeOpen = false
      }
    },
    getVolume() {
      const result = this.pluginAPI.getVolume(this.plugin)
      if (result.success) {
        this.pluginState.volumeValue = result.Volume
      } else {
        // fail
      }
    },
    setVolume(value) {
      const state = this.pluginAPI.setVolume(this.plugin, value)
      if (state) {
        // fail
      } else {
        this.pluginState.volumeValue = value
      }
    },
    boost(isb) {
      if (typeof isb !== 'boolean') {
        isb = !this.pluginState.isBoost
      }
      const state = this.pluginAPI.boost(this.plugin)
      if (state) {
        // fail
      } else {
        this.pluginState.isBoost = isb
      }
    },
    fullScreen(isFull = !this.pluginState.isFullScreen) {
      this.pluginAPI.fullScreen(this.plugin, isFull)
      this.pluginState.isFullScreen = isFull
    },
    getCapture(param = { type: 1, quality: 50 }) {
      return this.pluginAPI.getCapture(this.plugin, param)
    },
    setScale(value) {
      const state = this.pluginAPI.setScale(this.plugin, value)
      value.auto ? (this.pluginState.scale = '原比例') : (this.pluginState.scale = '自适应')
      return state
    },
    getPicture(param) {
      this.setPreviewLog('getPicture', this.openStreamInfo) // 预览日志
      const state = this.pluginAPI.getPicture(this.plugin, param)
      if (state) {
        // fail
      } else {
      }
      return state
    },
    // 录像
    openRecording(param) {
      this.setPreviewLog('openRecording') // 预览日志
      const state = this.pluginAPI.openRecording(this.plugin, param)
      if (state) {
        // fail
      } else {
        this.pluginState.isRecording = true
      }
      return state
    },
    isRecording() {
      const state = this.pluginAPI.isRecording(this.plugin)
      if (state) {
        // fail
      } else {
      }
    },
    closeRecording() {
      if (!this.plugin) {
        return
      }
      this.setPreviewLog('closeRecording') // 预览日志
      const state = this.pluginAPI.closeRecording(this.plugin)
      if (state) {
        // fail
      } else {
        this.pluginState.isRecording = false
      }
      return state
    },
    openSpeechEx(param) {
      const state = this.pluginAPI.openSpeechEx(this.plugin, param)
      if (state) {
      } else {
      }
      return state
    },
    // 对讲
    openSpeech(param) {
      const state = this.pluginAPI.openSpeech(this.plugin, param)
      if (state) {
      } else {
      }
    },
    startSpeech() {
      const state = this.pluginAPI.startSpeech(this.plugin)
      if (state) {
      } else {
        this.setPreviewLog('startSpeech', this.openStreamInfo) // 预览日志
        this.pluginState.isSpeech = true
      }
      return state
    },
    stopSpeech() {
      const state = this.pluginAPI.stopSpeech(this.plugin)
      if (state) {
      } else {
        this.pluginState.isSpeech && this.setPreviewLog('stopSpeech', this.openStreamInfo) // 预览日志
        this.pluginState.isSpeech = false
      }
      return state
    },
    closeSpeech() {
      const state = this.pluginAPI.closeSpeech(this.plugin)
      if (state) {
      } else {
        this.pluginState.isSpeech = false
      }
      return state
    },
    // 视频回放相关
    getPlayerTime() {
      const state = this.pluginAPI.getPlayerTime(this.plugin)
      if (state) {
      } else {
      }
      return state
    },
    getPlayerCurTime() {
      const state = this.pluginAPI.getPlayerCurTime(this.plugin)
      if (state) {
      } else {
      }
      return state
    },
    // 打开回放
    recordOpen(param) {
      const state = this.pluginAPI.recordOpen(this.plugin, param)
      if (state) {
      } else {
      }
      return state
    },
    // 设置播放速度
    setPlayerRate(param) {
      const state = this.pluginAPI.setPlayerRate(this.plugin, param)
      if (param.nScale === 1) {
        this.pluginState.speed = param.nRate + ''
      } else {
        this.pluginState.speed = param.nRate + '/' + param.nScale
      }
      if (state) {
      } else {
      }
      return state
    },
    setPlayerMode(param) {
      const state = this.pluginAPI.setPlayerMode(this.plugin, param)
      if (state) {
      } else {
        this.pluginState.isFrame = true
        this.pluginAPI.resume(this.plugin)
      }
      return state
    },
    // 录像下载
    recordDump(param) {
      const state = this.pluginAPI.recordDump(this.plugin, param)
      if (state) {
      } else {
      }
      return state
    },
    setDumpStare(param, callback) {
      const state = this.pluginAPI.setDumpStare(this.plugin, param, callback)
      if (state) {
      } else {
      }
      return state
    },
    stopDump(param) {
      const state = this.pluginAPI.stopDump(this.plugin, param)
      if (state) {
      } else {
      }
      return state
    },
    getDumpIsEnd(param) {
      const state = this.pluginAPI.getDumpIsEnd(this.plugin, param)
      if (state) {
      } else {
      }
      return state
    },
    // 切片
    getRecordSlice(param, callback) {
      // if (!this.pluginState.isPlay) { return }
      const state = this.pluginAPI.getRecordSlice(this.plugin, param, callback)
      if (state) {
      } else {
      }
      return state
    },
    getFileBrowser(param) {
      const state = this.pluginAPI.getFileBrowser(this.plugin, param)
      if (state) {
      } else {
      }
      return state
    },
    getFileBrowserEx(param) {
      return this.pluginAPI.getFileBrowserEx(this.plugin, param)
    },
    getDir() {
      const state = this.pluginAPI.getDir(this.plugin)
      if (state) {
      } else {
      }
      return state
    },
    // 打开前端回放
    async NVRopen(data) {
      await this.checkInit()
      this.pluginState.isPlay && (await this.pluginAPI.stop(this.plugin))
      this.$parent.pluginData[this.index] = data
      const state = await this.pluginAPI.NVRopen(this.plugin, data) // 调用普通前端设备开流接口
      if (state.state === 0) {
        this.pluginState.isStopped = false
        this.pluginState.isPlay = true
        this.$nextTick(_ => {
          this.isSyncPause = false
        })
      } else {
      }
      return state
    },
    // 打开国标设备回放
    async gbOpen(data, bool = true) {
      await this.checkInit()
      bool && (this.$parent.pluginData[this.index] = data)
      const res = await this.gbRecordOpen(data).catch(err => err)
      let state
      if (this.pluginAPI.gbOpen) {
        state = await this.pluginAPI.gbOpen(this.plugin, data, res)
      } else {
        state = await this.APIs.recordPlugin.gbOpen(this.plugin, data, res)
      }
      if (state === 0) {
        this.pluginState.isStopped = false
        this.pluginState.isPlay = true
        this.pluginState.streamId = res.data.streamId
        this.$nextTick(_ => {
          this.isSyncPause = false
        })
      } else {
      }
      return state
    },
    // 获取图像调节
    GetPlayerPicParam(data) {
      const state = this.pluginAPI.GetPlayerPicParam(this.plugin, data)
      if (state) {
      } else {
      }
      return state
    },
    // 修改图像调节
    SetPlayerPicParam(data) {
      const state = this.pluginAPI.SetPlayerPicParam(this.plugin, data)
      if (state) {
      } else {
      }
      return state
    },
    handleDrop(data) {
      if (this.$parent.pollId) {
        return
      }
      this.clearPollTimed()
      if (/^\{.*\}$/.test(data)) {
        const fav = JSON.parse(data)
        if ('creator' in fav && fav.children && fav.children.length > 0 && fav.ispolling === 'true') {
          this.paramlist = []
          fav.children.forEach(item => {
            if ('eid' in item) {
              this.paramlist.push({
                id: item._id.split('_')[0],
                type: 'video',
                streamType: this.pluginState.streamType,
                ip: item.eid.ip,
                port: item.eid.cport,
                channel: item.chan,
                vendor: item.eid.manufacturer
              })
            }
          })
          if (this.paramlist.length > 0) {
            this.pollNum = 0
            this.isPolling = true
            this.$parent.SET_POLLINGID({
              i: this.index,
              id: fav._id
            })
            this.pollTimed(fav.pollingtime)
            this.pollMethod()
            this.pluginState.isPoll = true
          }
        }
      }
    },
    pollMethod() {
      if (this.paramlist.length <= 0) {
        this.clearPollTimed()
      }
      if (this.pollNum >= this.paramlist.length) {
        this.pollNum = 0
      }
      this.stop()
      this.open(this.paramlist[this.pollNum])
      this.$parent.pluginData[this.index] = this.paramlist[this.pollNum]
      this.pollNum++
    },
    pollTimed(t) {
      this.timed = setInterval(() => {
        this.pollMethod()
      }, t * 1000)
    },
    clearPollTimed() {
      clearInterval(this.timed)
      if (this.isPolling || this.pluginState.isPoll) {
        this.$parent.EMPTY_PLAYINGID()
      }
      this.pluginState.isPoll = false

      this.pollNum = 0
      this.paramlist = []
      this.isPolling = false
      this.$parent.pluginData[this.index] = ''
      this.$parent.DEL_POLLINGID({
        i: this.index,
        id: ''
      })
    },
    // 显示关闭快速云台 showPTZ = !showPTZ
    PTZClick(data) {
      if (this.disablePTZ) {
        return
      }
      if (!this.power || !this.power.includes('cloudControl')) {
        this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        return
      }
      this.showPTZ = !this.showPTZ
    },
    // 云台点击事件
    controlDome(ctrlCmdEnum, speed = 3, presetIndex = 1, route = 1, stopTime = 5, opt = 1, channel = 1) {
      if (!this.pluginState.isPlay) {
        return
      }
      const item = this.openStreamInfo
      if (!item) {
        return Promise.reject(new Error(false))
      }
      let devInfo = {}
      if (item.gbDevId) {
        const id = window.serverId[item.shareServer]
        devInfo = {
          gbPlaDevIp: id.ip,
          gbPlaDevPort: id.port,
          gbDevId: item.gbDevId,
          gbPlaNvrId: id.serverId
        }
      } else {
        devInfo = {
          devIp: item.ip,
          devPort: item.port
        }
      }
      const param = {
        devCtl: {
          ctrlCmdEnum: ctrlCmdEnum,
          speed: speed,
          presetIndex: presetIndex,
          route: route,
          stopTime: stopTime,
          opt: opt,
          channel: item.channel || channel
        },
        devInfo: devInfo
      }
      // 记录日志
      recordUserLog({
        logType: '操作日志', // 1操作日志 || 2管理日志 Number
        module: '现场视频', // 操作模块 String
        operateName: '云台控制', // 操作名称 String
        operateContent: '云台控制', // 操作内容 String
        target: item.name, // 操作对象 String
        deviceIp: item.gbDevId ? window.serverId[item.shareServer].ip : item.ip // 设备ip String
      })
      return new Promise((resolve, reject) => {
        YUNNAN_CTRL_SET(param, item.id, item.type)
          .then(suc => {
            resolve(suc)
          })
          .catch(error => {
            reject(error)
            console.log(`云台控制${ctrlCmdEnum}接口错误码：`, error)
          })
      })
    },
    setPreviewLog(type, item = this.$parent.pluginData[this.index]) {
      if (this.pluginType !== 'preview' || !item) {
        return
      }
      const contentList = {
        open: { operateName: '视频预览', operateContent: '开始视频预览' },
        stop: { operateName: '视频预览', operateContent: '停止视频预览' },
        startSpeech: { operateName: '对讲', operateContent: '开启对讲' },
        stopSpeech: { operateName: '对讲', operateContent: '关闭对讲' },
        getPicture: { operateName: '截图', operateContent: '截图' },
        openRecording: { operateName: '本地录像', operateContent: '开始本地录像' },
        closeRecording: { operateName: '本地录像', operateContent: '关闭本地录像' },
        openCentreRecord: { operateName: '中心录像', operateContent: '开始中心录像' },
        stopCentreRecord: { operateName: '中心录像', operateContent: '关闭中心录像' }
      }
      const param = {
        ...contentList[type],
        logType: '操作日志',
        module: '现场视频',
        target: item.name,
        deviceIp: item.gbDevId ? window.serverId[item.shareServer].ip : item.ip // 设备ip String
      }
      if (!param.target || !param.deviceIp) {
        return
      }
      recordUserLog(param)
    }
  },
  created() {
    if (this.$parent.bgColor === '#000') {
      this.boder = false
    }
    if (this.isActive && this.clickInit) {
      this.init = true
    }
  },
  mounted() {
    window.unbeforeunload = () => {
      // console.log('w-i-n-d-o-w.o-n-b-e-f-o-r-e-u-n-l-o-a-d')
      if (this.pluginState.isCentreRecording) {
        this.stopCentreRecord()
      }
    }
  },
  beforeDestroy() {
    // 判断如果正在进行中心录像就将其关闭
    if (this.pluginState.isCentreRecording) {
      this.stopCentreRecord()
    }
    this.clearPollTimed()
    clearTimeout(this.showTimer)
    clearInterval(this.tOpen)
    if (this.plugin && this.plugin.valid) {
      this.plugin.SetMouseStatusCallback(null)
      this.plugin.SetKeyboardCallback(null)
      this.plugin.SetNotifyCallback(null)
    }
    this.plugin = null
    this.init = false
  }
}
</script>
<style>
.quickTowall .ivu-modal {
  width: fit-content !important;
}
.ivu-modal-close {
  z-index: 19;
}
</style>
<style scoped lang="less">
.mapAppVideoPLayback {
  width: 100vw;
  height: 100vh;
}

.container {
  display: inline-block;
  box-sizing: content-box;
  border: 2px solid transparent;
  vertical-align: middle;
  position: relative;
  padding: 0;
  width: 100%;
  height: 100%;
}

object,
.objectBox,
.pause-img {
  width: 100%;
  height: 100%;
  position: relative;
}

div.container.active {
  border: 2px solid #4699f9;
  margin: 0;
}

.container.bdr {
  border: 1px solid #000;
  margin: 1px;
}

.container.bdr1 {
  border: 1px solid #444;
  margin: 1px;
}

.buttonBar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  z-index: 2;

  .buttonBar-box {
    position: absolute;
    background: #333;
    width: 100%;
    height: 100%;
    z-index: 100;
    bottom: 0;
  }

  .iconfont {
    font-size: 20px;
    margin: 0 8px;
    cursor: pointer;

    :hover {
      color: #00a5e3;
    }
  }

  .disable,
  .disable:hover {
    color: #878282;
  }
}
.split-16 {
  .buttonBar {
    line-height: 30px;

    .iconfont {
      font-size: 16px;
    }
  }
}

.buttonBars {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  background: #ddddee;

  .buttonBar-box {
    position: absolute;
    // background: #000;
    width: 100%;
    height: 100%;
    z-index: 100;
    bottom: 0;
  }

  .iconfont {
    font-size: 20px;
    margin: 0 8px;
    cursor: pointer;

    :hover {
      color: #00a5e3;
    }
  }

  .disable,
  .disable:hover {
    color: #878282;
  }
}

iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  border: 0 none;
  top: 0;
  left: 0;
}

.outofscreen {
  position: absolute !important;
  top: -9999px;
}

// #app-main.fs #play-back .video-plugin-inBox {
//   position: fixed;
//   left: 0;
//   top: 0;
//   height: calc(~'100% - 100px') !important;
//   background: rgb(64, 64, 64);
//   right: 0;
//   z-index: 99999;
// }
#app-main.fs div:not(.MapVideoPlayback) .fs2 .video-plugin-inBox .container:not(.active) {
  position: absolute;
  top: -9999px;
}
#app-main.fs div:not(.MapVideoPlayback) .fs2 .video-plugin-inBox .container.active {
  width: calc(~'100% - 4px') !important;
  height: calc(~'100% - 4px') !important;
}
.fs .icon-quanpingfangda {
  display: none;
}
.fs .icon-history-query {
  cursor: not-allowed;
  color: #a0a0a0;
}
</style>
