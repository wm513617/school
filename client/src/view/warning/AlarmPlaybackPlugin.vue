<template>
  <div class="bg" @click="clickEvent"  v-resize="resize" ref='bsBackMain'>
    <div v-show="isShowVideo" class="bg-video" @dblclick="dblclickEvent">
      <video :src="videoUrl" autoplay="true" :width="videoWidth + 'px'" :height="videoHeight + 'px'" ref="videoBack" @ended="myVideoEnd" :id="'patrolvideoback'+index"></video>
    </div>
    <div v-if="isShowImg&&!isShowPlugin" @dblclick="dblclickEvent" class="img-box">
      <!-- <img :src="[isShowImg?isShowImg[0]:'']" alt="无图" :title="imgTitle" :class="[isShowImg[1]? 'twoImg' : 'oneImg']"/> -->
      <!-- <img :src="[isShowImg[1]?isShowImg[1]:'']" alt="无图" :title="imgTitle" v-if="isShowImg[1]" :class="[isShowImg[1]? 'twoImg' : 'oneImg']"/> -->
      <img :src="isShowImg" alt="无图" :title="imgTitle" class="oneImg"/>
    </div>
    <div v-if="(isShowImg||isShowVideo)&&!isShowPlugin&&toolbarShow" class="img-btn">
      <i class="icon iconfont icon-hidemenu-copy-copy" title="隐藏" @click.stop="toolbarShow = false"></i>
      <i class="icon iconfont icon-history-query" @click="emergencyPlan" title="打开应急预案"></i>
      <div class="div-null" v-if="isShowVideo">
        <slider color="#20a1ff" :range="true" :size="100" :minValue='0' v-model="sliderValue" style="display:flex;flex:1"></slider>
      </div>
      <div class="div-null" v-else></div>
      <i class="icon iconfont" :class="[!videoPaused ? 'icon-pause' : 'icon-play']" :title="[!videoPaused ? '暂停': '播放']" v-show="isShowVideo" @click="myVideoPlay()"></i>
      <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()"></i>
    </div>
    <div class="showplay-box" v-if="isShowPlay">
      <i class="icon iconfont icon-play" style="font-size: 60px;line-height: 60px;cursor: pointer;" @click="openSoldierVideo"></i>
    </div>
    <div v-if="isShowPlugin" style="width:100%;height:100%;">
      <object type="application/x-webplayercontrol"></object>
    </div>
    <!-- <bs-cover class="btn-con" v-model="isCover" v-if="isCover && isShowPlugin">
      <i class="icon iconfont icon-large-window" @click="exchange(index)" title="大窗口显示"></i>
    </bs-cover> -->
    <bs-cover class="btn-con" v-if="$BShasPower('BS-ALARM-RECEIVE-WARNING')&&toolbarShow&&pluginState.isPlay" v-show="isShowPlugin" v-model="isShowPlugin">
      <div class="btn-con-box">
        <i class="icon iconfont icon-hidemenu-copy-copy" title="隐藏" @click.stop="toolbarShow = false"></i>
        <i class="icon iconfont icon-history-query" @click="emergencyPlan" title="打开应急预案"></i>
        <div class="div-null"></div>
        <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()"></i>
        <i class="icon iconfont" :class="[pluginState.isVolumeOpen? 'icon-volume': 'icon-mute']" :title="[pluginState.isVolumeOpen? '关闭伴音': '开启伴音']" @click="pluginState.isVolumeOpen? closeSound(): openSound()"></i>
        <i class="icon iconfont icon-yuntai" :class="{disable: disablePTZ||!pluginState.isPreview}" title="云台" @click="PTZClick()" v-if="!connectInfo"></i>
        <i class="icon iconfont" :class="[pluginState.isPlay? '': 'disable',!pluginState.isBoost? 'icon-nk-close': 'icon-niaokan']" :title="[pluginState.isBoost? '关闭鸟瞰': '开启鸟瞰']" @click="boost()"></i>
        <i class="icon iconfont icon-tv-wall" :class="[pluginState.isPlay? '': 'disable']" title="快速上墙" @click="toWallBtn()" v-if="!connectInfo"></i>
        <i class="icon iconfont" :class="[pluginState.isFullScreen ? 'icon-exit-full-screen' : 'icon-quanpingfangda']" :title="pluginState.isFullScreen ? '退出全屏' : '全屏'" @click="fullscreen"></i>
      </div>
    </bs-cover>
    <!-- <div v-show="(showPTZ&&pluginState.isPlay)" class="buttonBars" @mouseup.stop="controlDome(item.addess,0)" @mousedown.stop="controlDome(item.addess)" v-for="(item, i) in xy" :key="i" :style="{left: `calc(50% + ${-20 + item.x}px)`, top: `calc(50% + ${-20 + item.y}px)`}">
      <bs-cover v-model="showPTZ" class="buttonBar-box" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" />
      </bs-cover>
    </div> -->
    <div v-show="(showPTZ&&pluginState.isPlay)" class="buttonBars" @mouseup.stop="controlDome(item.addess,0)" @mousedown.stop="controlDome(item.addess)" v-for="(item, i) in xy" :key="i" :style="{left: item.x, top: item.y}">
      <bs-cover v-model="showPTZ" class="buttonBar-box" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" />
      </bs-cover>
    </div>
    <Modal class="quickTowall" v-model="showWall" title="快速上墙" :mask-closable="false" :transition-names="[]">
      <iframe v-if="showWall" style="z-index:0"></iframe>
      <QuickToWall v-if="showWall" style="position:relative" :camera="cameraId"></QuickToWall>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="showWall=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import Slider from 'components/Slider'
import { preview, playback } from 'components/bsvue'
import { AV_STREAM_START, getDownID } from 'http/video.api'
import { mapGetters, mapState, mapActions } from 'vuex'
import QuickToWall from 'view/video/tvwall/QuickToWall'
import { YUNNAN_CTRL_SET, recordUserLog } from 'src/http/video.api.js'
import { TALK_STREAM_START } from '../../http/video.api'
import { access_token } from '../../stored.js' // eslint-disable-line
import alarmVSPlanInfo from './mixinsJs/alarmVSPlanInfo.js'
// import { clearInterval } from 'timers';
import { read } from '../../storage/index.js'
import alarm from 'src/socket/alarm.js'

const previewOpen = (
  p,
  { streamType, vendor, ip, port, channel, tsPort, tsIp, gbPlaDevIp, gbPlaDevPort, gbDevId, gbPlaNvrId }
) => {
  let cmd = {
    streamType,
    // vendor,
    // session: '',
    devIp: ip,
    devPort: port,
    channel
  }
  if (gbDevId) {
    cmd = { gbPlaDevIp, gbPlaDevPort, gbDevId, gbPlaNvrId }
  }
  const param = JSON.stringify({
    port: tsPort + '',
    ip: tsIp,
    cmdStr: JSON.stringify(cmd)
  })
  return p.OpenRealStreamEx(param)
}
export default {
  name: 'AlarmPlaybackPlugin',
  components: {
    QuickToWall,
    Slider
  },
  props: ['index'],
  mixins: [alarmVSPlanInfo],
  data() {
    // const R = 100
    return {
      mainIndex: 0,
      isShowPlugin: false,
      isFullscreen: false,
      pluginState: {
        isPlay: false, // 正在播放
        isStopped: true, // 播放完毕
        isBoost: false, // 鸟瞰状态
        isVolumeOpen: false, // 伴音
        isPreview: true, // 是否预览
        isSpeech: false, // 对讲
        isFullScreen: false, // 全屏
        volumeValue: 0, // 音量
        streamType: 'main',
        speed: '1',
        scale: '自适应',
        streamId: '' // 标记下联设备，记录信息为：下联回放开流id/下联预览shareServer
      },
      showPTZ: false,
      disablePTZ: true, // 禁用云台
      openStreamInfo: {}, // 播放成功后的流信息
      imgTitle: '', // 图片标题
      cameraId: '',
      showWall: false,
      toolbarShow: false, // 播放工具栏
      // isPreview: false, // 是否预览
      // xy: [
      //   { x: 0, y: -R, angle: '0', addess: 'tiltUp', img: '/static/yuntai/bottom1.png' },
      //   { x: 0, y: R, angle: '180', addess: 'tiltDown', img: '/static/yuntai/bottom1.png' },
      //   { x: -R, y: 0, angle: '-90', addess: 'panLeft', img: '/static/yuntai/bottom1.png' },
      //   { x: R, y: 0, angle: '90', addess: 'panRight', img: '/static/yuntai/bottom1.png' },
      //   {
      //     x: -Math.sqrt(R * R / 2),
      //     y: -Math.sqrt(R * R / 2),
      //     angle: '-90',
      //     addess: 'swayUpLeft',
      //     img: '/static/yuntai/bottom2.png'
      //   },
      //   {
      //     x: -Math.sqrt(R * R / 2),
      //     y: Math.sqrt(R * R / 2),
      //     angle: '-180',
      //     addess: 'swayDownLeft',
      //     img: '/static/yuntai/bottom2.png'
      //   },
      //   {
      //     x: Math.sqrt(R * R / 2),
      //     y: -Math.sqrt(R * R / 2),
      //     angle: '0',
      //     addess: 'swayUpRight',
      //     img: '/static/yuntai/bottom2.png'
      //   },
      //   {
      //     x: Math.sqrt(R * R / 2),
      //     y: Math.sqrt(R * R / 2),
      //     angle: '90',
      //     addess: 'swayDownRight',
      //     img: '/static/yuntai/bottom2.png'
      //   }
      // ],
      xy: [
        { x: '50%', y: '20%', angle: '0', addess: 'tiltUp', img: '/static/yuntai/bottom1.png' },
        { x: '50%', y: '70%', angle: '180', addess: 'tiltDown', img: '/static/yuntai/bottom1.png' },
        { x: '25%', y: '45%', angle: '-90', addess: 'panLeft', img: '/static/yuntai/bottom1.png' },
        { x: '75%', y: '45%', angle: '90', addess: 'panRight', img: '/static/yuntai/bottom1.png' },
        { x: '32%', y: '28.5%', angle: '-90', addess: 'swayUpLeft', img: '/static/yuntai/bottom2.png' },
        { x: '32%', y: '63.5%', angle: '-180', addess: 'swayDownLeft', img: '/static/yuntai/bottom2.png' },
        { x: '67%', y: '28.5%', angle: '0', addess: 'swayUpRight', img: '/static/yuntai/bottom2.png' },
        { x: '67%', y: '63.5%', angle: '90', addess: 'swayDownRight', img: '/static/yuntai/bottom2.png' }
      ],
      isShowImg: false,
      isShowVideo: false, // 是否显示video标签
      videoUrl: '', // video标签的src地址
      videoHeight: '',
      videoWidth: '',
      myVideo: '',
      videoPaused: false,
      myVideoTimer: '',
      myVideoOneTimer: '',
      sliderValue: 0,
      isShowPlay: false, // 显示单兵一键报警播放按钮
      connectInfo: null, // 单兵连接成功后的报警推送信息
      recordId: '', // 创建的 单兵录像记录的id
      SingleRes: null // 单兵获取流接口信息
    }
  },
  computed: {
    isCover() {
      return this.mainIndex !== this.index
    },
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    }),
    ...mapGetters(['getParameter'])
  },
  methods: {
    ...mapActions([
      'getMonitorList',
      'getTVList',
      'getVideoConf',
      'getTalkbackStream',
      'startTalkback',
      'createPCTalkRecord',
      'createTalkRecord',
      'getSingleStream',
      'startRecord',
      'stopRecord',
      'stopTalkback',
      'refrashTalkRecord',
      'stopSingleStream',
      'noticeAppPullAudio'
    ]),
    exchange(index) {
      this.$parent.$emit('exchange', index)
    },
    resize() {
      // 窗口大小调整,设置video标签宽高
      const DOMBsMain = this.$refs['bsBackMain']
      this.videoHeight = DOMBsMain.offsetHeight
      this.videoWidth = DOMBsMain.offsetWidth
    },
    setMainIndex(index) {
      this.mainIndex = index
    },
    setPluginCallback() {
      this.plugin.SetKeyboardCallback((index, type, keyCode) => {
        if (+keyCode === 27) {
          preview.normalScreen(this.plugin)
        }
      })
      if (this.plugin) {
        this.plugin.SetMouseStatusCallback((index, state) => {
          if (state === 1) {
            this.$el.click()
          } else if (state === 2) {
            this.dblclickEvent()
          }
        })
      }
    },
    showPlugin() {
      this.isShowPlugin = true
      return new Promise(resolve => {
        this.$nextTick(() => {
          this.plugin = this.$el.querySelector('object')
          if (!this.plugin.valid) {
            return
          }
          this.setPluginCallback()
          resolve()
        })
      })
    },
    async openPreview(param) {
      console.log(param, 'param1010101010')
      if (param.eventType === 'soldier' || param.eventType === 'individualAlarm') {
        this.openStreamInfo = JSON.parse(JSON.stringify(param))
        this.isShowPlay = true
        return
      }
      this.cameraId = ''
      this.openStreamInfo = {}
      // param.url = []
      // param.url[0] = '/static/yuntai/bottom1.png'
      // param.url[1] = '/static/yuntai/bottom2.png'
      if (param.url && param.url.length !== 0) {
        this.isShowPlugin = false
        this.isShowVideo = false
        this.isShowImg = param.url
        let eventTypeName = this.alarmVSPlanInfoList[param.eventType].CNname || ''
        this.imgTitle =
          '报警名称：' +
          param.alarmName +
          '\n' +
          '报警类型：' +
          eventTypeName +
          '\n' +
          '报警级别：' +
          param.level +
          '\n' +
          '报警时间：' +
          this.$moment(param.time * 1000).format('YYYY-MM-DD HH:mm:ss')
        this.openStreamInfo = JSON.parse(JSON.stringify(param))
        this.$el.click()
        return
      }
      if (param.video) {
        this.isShowPlugin = false
        this.isShowImg = false
        this.isShowVideo = true
        this.videoUrl = param.video
        this.openStreamInfo = JSON.parse(JSON.stringify(param))
        this.myVideoTimer = setInterval(this.myVideoProgress, 1000)
        this.pluginState.isPlay = true
        this.pluginState.isVolumeOpen = true
        this.myVideo.volume = 0.5
        this.pluginState.volumeValue = 50
        this.$el.click()
        return
      }
      this.pluginState.isPreview = true
      if (param.monitorType >= 2) {
        this.disablePTZ = false
      }
      this.cameraId = param.id
      await this.showPlugin()
      try {
        if (param.gbDevId) {
          const r = await getDownID(param.shareServer)
          param.gbPlaNvrId = r.data.serverId
          param.gbPlaDevIp = r.data.ip
          param.gbPlaDevPort = r.data.port
        }
        await AV_STREAM_START(param)
          .then(res => {
            if (res.data && res.data !== -1) {
              this.pluginState.isPlay = true
              previewOpen(this.plugin, {
                ...param,
                tsIp: res.data.tsIp,
                tsPort: res.data.tsPort
              })
              let eventTypeName = ''
              if (this.alarmVSPlanInfoList.hasOwnProperty(param.eventType)) {
                eventTypeName = this.alarmVSPlanInfoList[param.eventType].CNname
              }
              if (param.ip) {
                let strTools =
                  '报警名称：' +
                  param.alarmName +
                  '\n' +
                  '报警类型：' +
                  eventTypeName +
                  '\n' +
                  '报警级别：' +
                  param.level +
                  '\n' +
                  '报警时间：' +
                  this.$moment(param.time * 1000).format('YYYY-MM-DD HH:mm:ss') +
                  '\n' +
                  '镜头IP：' +
                  param.ip
                const bShowStream = false // 是否显示码流信息
                this.plugin.SetStreamPlayerToolStringEx(strTools, bShowStream)
              }
            }
            // else {
            //   this.errorMsg(`第${this.index+1}窗口打开视频失败`)
            // }
          })
          .catch(err => {
            console.log(err, 'err')
            this.errorMsg(`第${this.index + 1}窗口打开视频失败`)
          })
      } catch (e) {
        console.error('open alarm video error', e)
      }
      this.openStreamInfo = JSON.parse(JSON.stringify(param))
    },
    async openSoldierVideo() {
      // 单兵开流
      this.isShowPlay = false
      await this.showPlugin()
      this.getTalkbackStream({ appid: this.openStreamInfo.uid, pcid: read('userId'), type: 'PC' })
        .then(res => {
          this.openStreamInfo = { ...this.openStreamInfo, ...res.data }
          console.log(this.openStreamInfo, 'getTalkbackStream')
          // PC主动发起
          const param = {
            src: 'PC',
            destId: this.openStreamInfo.uid,
            url: res.data.url
          }
          return this.startTalkback(param)
            .then(suc => {
              console.log(suc, 'suc9999')
              alarm.on('intercomComplete', this.connectComplete)
              return this.createPCTalkRecord({
                command: 'open',
                id: this.openStreamInfo.uid,
                webName: read('user.username'),
                uniqueId: this.openStreamInfo.uniqueId
              })
            })
            .catch(err => {
              console.log(err, 'startTalkback error')
              this.warningMsg('视频对讲开启失败')
              this.openStreamInfo = {}
              this.iniSoliderStatus()
              alarm.remove('intercomComplete', this.connectComplete)
            })
        })
        .catch(err => {
          console.log(err, '获取流地址失败')
          this.warningMsg('开启视频对讲失败')
          this.openStreamInfo = {}
          this.iniSoliderStatus()
          alarm.remove('intercomComplete', this.connectComplete)
        })
    },
    // 与单兵App连接成功，开始计时 对讲
    connectComplete(data) {
      console.log(data, 'connectComplete')
      this.connectInfo = data
      // 创建 一条单兵记录
      // const value = {
      //   webName: read('user.username'),
      //   appName: data.appName,
      //   dsId: this.openStreamInfo.dsId,
      //   sn: data.sn
      // }
      // this.createTalkRecord(value)
      //   .then(res => {
      //     console.log(res.data, '创建 记录')
      //     this.recordId = res.data._id
      //   })
      //   .catch(err => {
      //     console.log(err, '创建 记录失败')
      //   })
      const param = {
        url: data.avInfo.url,
        dsId: this.openStreamInfo.dsId, // dsServerId
        dir: this.openStreamInfo.dir // 存储目录
      }
      console.log(param, 'getSingleStream-param')
      this.getSingleStream(param)
        .then(res => {
          this.SingleRes = res
          this.openSoldierPlugin(data, res, param)
        })
        .catch(err => {
          console.log(err, '开启视频对讲失败')
          this.pluginState.isPlay = false
          this.errorMsg('开启视频对讲失败')
        })
      alarm.remove('intercomComplete', this.connectComplete)
    },
    async openSoldierPlugin(data, res, param) {
      // 插件单兵开流
      const cmdStrPull = {
        url: data.avInfo.url
      }
      const objPull = {
        port: res.tsPort + '',
        ip: res.tsIp,
        cmdStr: JSON.stringify(cmdStrPull)
      }
      // 插件 拉取 音频流
      console.log(objPull, 'objPull22222')
      const state2 = await this.plugin.OpenRealStreamEx(JSON.stringify(objPull))
      console.log(state2, 'state2')
      if (state2 === 0) {
        this.pluginState.isPlay = true
        let eventTypeName = this.alarmVSPlanInfoList[this.openStreamInfo.eventType].CNname || ''
        let strTools =
          '报警人：' +
          this.openStreamInfo.realname +
          '\n' +
          '报警类型：' +
          eventTypeName +
          '\n' +
          '报警级别：' +
          this.openStreamInfo.level +
          '\n' +
          '报警时间：' +
          this.$moment(this.openStreamInfo.time * 1000).format('YYYY-MM-DD HH:mm:ss')
        const bShowStream = false // 是否显示码流信息
        this.plugin.SetStreamPlayerToolStringEx(strTools, bShowStream)
        this.timeId = setInterval(() => {
          // 设置原比例播放，取流慢时加定时器
          let flag = this.plugin.SetPlayStretchBlt(1, 1, true)
          if (flag === 1) {
            clearInterval(this.timeId)
          }
        }, 100)
        this.soliderSpeech()
        this.startRecord(param)
          // .then(res => {
          //   const result = res.data
          //   const dataParam = {
          //     id: this.recordId,
          //     body: {
          //       startTime: result ? (result.startTime ? result.startTime : Date.now()) : Date.now()
          //     }
          //   }
          //   return this.refrashTalkRecord(dataParam)
          // })
          .catch(err => {
            console.log(err, '录像开启失败')
          })
        this.successMsg('开启视频成功')
      } else {
        this.pluginState.isPlay = false
        this.warningMsg('开启视频对讲失败')
      }
    },
    async soliderSpeech() {
      // 单兵对讲
      this.openSound()
      const cmdStrPush = {
        talkMode: 1,
        url: this.connectInfo.avInfo.url
      }
      const objPush = {
        port: this.SingleRes.taPort + '',
        ip: this.SingleRes.taIp,
        cmdStr: JSON.stringify(cmdStrPush)
      }
      // 插件 推送 音频流
      console.log(objPush, '单兵对讲参数')
      const state1 = await this.plugin.OpenSpeechEx(JSON.stringify(objPush))
      console.log(state1, 'push plugin')
      if (state1 === 0) {
        try {
          const state3 = this.plugin.StartSpeechMobile(false)
          console.log(state3, ' startSpeechMobile')
          this.pluginState.isSpeech = true
          this.noticeAppPullAudio(this.connectInfo).catch(err => {
            console.log(err, '通知app拉取音频流失败')
          })
        } catch (error) {
          console.log(error, 'startSpeechMobile error')
        }
      } else {
        this.warningMsg('语音对讲失败')
        this.pluginState.isSpeech = false
      }
    },
    async openPlayback(param) {
      if (this.isShowImg) {
        return
      }
      await this.showPlugin()
      this.pluginState.isPreview = false
      playback.open(this.plugin, param)
    },
    /**
     * 关闭视频
     * 关闭时 是否注销插件
     */
    close(isDestroyPlugin = true) {
      if (this.openStreamInfo.eventType === 'soldier' || this.openStreamInfo.eventType === 'individualAlarm') {
        this.closeSoldierVideo()
        return
      }
      this.toolbarShow = false
      if (this.isShowImg) {
        this.isShowImg = ''
        this.imgTitle = ''
        this.openStreamInfo = {}
        this.toolbarShow = false
        return
      }
      if (this.isShowVideo) {
        this.isShowVideo = false
        this.videoUrl = ''
        this.openStreamInfo = {}
        this.toolbarShow = false
        this.pluginState.isPlay = false
        this.closeSound()
        clearInterval(this.myVideoTimer)
        this.myVideoTimer = null
        clearTimeout(this.myVideoOneTimer)
        this.myVideoOneTimer = null
        return
      }
      if (!this.plugin) {
        return
      }
      preview.stop(this.plugin)
      if (isDestroyPlugin) {
        this.plugin.SetKeyboardCallback(null)
        this.plugin = null
        this.isShowPlugin = false
        this.pluginState.isPlay = false
        this.pluginState.isSpeech = false
      }
      this.openStreamInfo = {}
    },
    closeSoldierVideo() {
      // 单兵关流
      let urlInfo = this.openStreamInfo.url
      // let stopId = this.recordId
      if (this.connectInfo) {
        const param = {
          src: this.connectInfo.src,
          srcId: this.connectInfo.srcId,
          destId: this.connectInfo.destId
        }
        this.stopTalkback(param)
          .then(() => {
            this.closeSoldierPlugin()
            this.stopSingleStream({ url: urlInfo })
          })
          .catch(err => {
            console.log(err, '关闭视频对讲失败')
            this.iniSoliderStatus()
          })
      } else {
        let param = {
          src: 'PC',
          srcId: read('userId'),
          destId: this.openStreamInfo.uid
        }
        this.stopTalkback(param).catch(err => {
          console.log(err, '通知手机关流失败')
        })
        this.iniSoliderStatus()
      }
    },
    async closeSoldierPlugin() {
      // 关闭单兵视频插件
      if (!this.pluginState.isPlay) {
        return
      }
      let urlInfo = this.openStreamInfo.url
      // let stopId = this.recordId
      const state = await this.plugin.CloseRealStream()
      console.log(state, '插件关闭视频状态')
      if (state === 0) {
        this.stopRecord({ url: urlInfo })
          // .then(res => {
          //   const param2 = {
          //     id: stopId,
          //     body: {
          //       endTime: Date.now()
          //     }
          //   }
          //   return this.refrashTalkRecord(param2)
          // })
          .catch(err => {
            console.log(err, '录像关闭失败')
          })
        this.closeSound()
        this.stopSpeech()
        this.closeSpeech()
        this.iniSoliderStatus()
      } else {
        this.iniSoliderStatus()
      }
    },
    iniSoliderStatus() {
      // 初始化单兵状态
      this.plugin = null
      this.isShowPlugin = false
      this.pluginState.isBoost = false
      this.pluginState.isVolumeOpen = false
      this.pluginState.isSpeech = false
      this.pluginState.isPlay = false
      this.connectInfo = null
      this.SingleRes = null
      this.recordId = ''
      this.toolbarShow = false
      this.isShowPlay = false
    },
    fullscreen() {
      this.isFullscreen = !this.isFullscreen
      preview.fullScreen(this.plugin)
    },
    getCapture() {
      // const type = this.parameters.screenshot === 'JPG' ? 'JPG Files (*.jpg)' : 'BMP Files (*.bmp)'
      // let path = playback.saveFile(this.plugin, this.screenshot, type)
      // if (!path) {
      //   return
      // }
      // if (this.parameters.screenshot === 'JPG') {
      //   path = path + '.JPG'
      // }
      // if (this.parameters.screenshot === 'BMP') {
      //   path = path + '.BMP'
      // }
      // playback.saveCapture(this.plugin, path)
      if (!this.pluginState.isPlay) {
        return
      }
      this.getVideoConf() // 同步localStorage数据到本地配置
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let picName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      const state = JSON.parse(this.plugin.GetPlayerPicture(path, picType))
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      }
    },
    // stopSpeech() {
    //   preview.stopSpeech(this.plugin)
    // },
    // closeSpeech() {
    //   preview.closeSpeech(this.plugin)
    // },
    // openSpeechEx(param) {
    //   const state = preview.openSpeech(this.plugin, param)
    //   let state2
    //   if (state === 0) {
    //     state2 = preview.startSpeech(this.plugin)
    //   }
    //   if (state !== 0 || state2 !== 0) {
    //     this.errorMsg('开启对讲失败')
    //   }
    // },
    getPlayerCurTime() {
      return playback.getCurTime(this.plugin)
    },
    clickEvent() {
      // 点击显示播放工具栏
      if (!this.toolbarShow) {
        this.toolbarShow = true
      }
    },
    myVideoPlay() {
      // video标签暂停或者播放
      console.log(this.myVideo, 'this.myVideo')
      if (this.myVideo.paused) {
        this.myVideo.play()
        this.videoPaused = false
        this.myVideoProgress()
        this.myVideoTimer = setInterval(this.myVideoProgress, 1000)
      } else {
        this.myVideo.pause()
        this.videoPaused = true
        clearInterval(this.myVideoTimer)
      }
    },
    myVideoEnd() {
      // video标签播放结束
      this.videoPaused = true
      this.myVideoOneTimer = setTimeout(() => {
        clearInterval(this.myVideoTimer)
        this.myVideoTimer = null
      }, 1000)
    },
    myVideoProgress() {
      // video标签播放进度条
      this.sliderValue = parseInt((this.myVideo.currentTime * 100) / this.myVideo.duration)
    },
    quickStop() {
      // 关闭预览
      this.close()
    },
    closeSound() {
      // 关闭伴音
      if (this.isShowVideo) {
        this.myVideo.muted = true
        this.pluginState.isVolumeOpen = false
        this.pluginState.volumeValue = 50
        return
      }
      if (this.pluginState.isVolumeOpen && !preview.closeSound(this.plugin)) {
        this.pluginState.isVolumeOpen = false
      }
    },
    openSound() {
      // 打开伴音
      this.$parent.$parent.closeAllVolume()
      if (this.isShowVideo) {
        this.myVideo.muted = false
        this.pluginState.isVolumeOpen = true
        this.myVideo.volume = 0.5
        this.pluginState.volumeValue = 50
        return
      }
      if (!this.pluginState.isVolumeOpen && !preview.openSound(this.plugin)) {
        this.pluginState.isVolumeOpen = true
        this.setVolume(50)
        this.getVolume()
      }
    },
    setVolume(value) {
      // 设置音量
      if (this.isShowVideo) {
        this.myVideo.volume = value / 100
        return
      }
      const state = preview.setVolume(this.plugin, value)
      if (state) {
        // fail
      } else {
        this.pluginState.volumeValue = value
      }
    },
    getVolume() {
      // 获取音量
      this.pluginState.volumeValue = preview.getVolume(this.plugin)
    },
    PTZClick() {
      // 云台开关
      if (this.disablePTZ || !this.pluginState.isPreview) {
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
        target: item.cameraName, // 操作对象 String
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
    boost() {
      // 鸟瞰
      if (!preview.boost(this.plugin)) {
        this.pluginState.isBoost = !this.pluginState.isBoost
      }
    },
    toWallBtn() {
      // 上墙
      this.getTVList().then(() => {
        this.getMonitorList()
      })
      this.showWall = this.pluginState.isPlay && true
    },
    stopSpeech() {
      // 停止对讲
      preview.stopSpeech(this.plugin)
    },
    closeSpeech() {
      // 关闭对讲
      if (this.pluginState.isSpeech && !preview.closeSpeech(this.plugin)) {
        this.pluginState.isSpeech = false
      }
    },
    openSpeechEx() {
      // 打开对讲
      if (this.openStreamInfo.eventType === 'soldier' || this.openStreamInfo.eventType === 'individualAlarm') {
        this.soliderSpeech()
        return
      }
      const params = {}
      params.devList = []
      params.devList[0] = {
        devIp: this.openStreamInfo.ip,
        port: this.openStreamInfo.port,
        channel: this.openStreamInfo.channel,
        istalk: 'talk'
      }
      // 请求对讲接口
      TALK_STREAM_START(params)
        .then(res => {
          res = JSON.parse(JSON.stringify(res))
          const cmd = {
            params: {
              args: {
                token: access_token, // eslint-disable-line
                devList: [
                  {
                    ip: params.devList[0].devIp,
                    port: params.devList[0].port,
                    channel: params.devList[0].channel,
                    isTalk: 'talk'
                  }
                ]
              }
            }
          }
          const openState = this.plugin.OpenSpeechEx(
            JSON.stringify({
              ip: res.data.taIp,
              port: res.data.taPort + '',
              cmdStr: JSON.stringify(cmd)
            })
          )
          let startState = 1
          if (!openState) {
            startState = preview.startSpeech(this.plugin)
          }
          if (!openState && !startState) {
            this.pluginState.isSpeech = true
            this.$Notice.success({ desc: '开启对讲成功！', title: '提示' })
          } else {
            this.$Notice.error({ title: '失败', desc: '开启对讲失败！' })
            this.pluginState.isSpeech = false
          }
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '对讲请求失败！' })
          this.pluginState.isSpeech = false
          console.log(err, '对讲请求失败！')
        })
    },
    dblclickEvent() {
      this.$parent.$emit('dblclickEvent', this.index)
    },
    emergencyPlan() {
      let planValue = this.alarmVSPlanInfoList[this.openStreamInfo.eventType].typeValue || 3
      this.$parent.$emit('emergencyPlan', planValue)
    }
  },
  mounted() {
    this.myVideo = document.getElementById('patrolvideoback' + this.index)
    const DOMBsMain = this.$refs['bsBackMain']
    this.$nextTick(function() {
      this.videoHeight = DOMBsMain.offsetHeight
      this.videoWidth = DOMBsMain.offsetWidth
    })
  },
  beforeDestroy() {
    this.close()
  }
}
</script>
<style>
.quickTowall .ivu-modal {
  width: fit-content !important;
}
</style>
<style lang="less" scoped>
object {
  height: 100%;
  width: 100%;
}
.bg {
  background: rgb(64, 64, 64);
  box-sizing: border-box;
  border: 2px solid #1f2224;
  height: 100%;
  position: relative;
}
.bg-video {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
.bg-video video {
  height: 100%;
  flex: 1;
}
.bs-actived .bg {
  border: 2px solid #348ff3;
  padding: 0;
}
.btn-con {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  background: #000;
  // padding-right: 5px;
  // text-align: right;

  i {
    font-size: 20px;
    margin: 0 2%;
    position: relative;
    cursor: pointer;

    &:hover {
      color: #00a5e3;
    }
  }
}
.btn-con-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.btn-con-box .disable,
.btn-con-box .disable:hover {
  color: #878282;
}
.buttonBars {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  background: #ddddee;
}
.buttonBars .buttonBar-box {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  bottom: 0;
}
.buttonBars img {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.quickTowall iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  border: 0 none;
  top: 0;
  left: 0;
}
.bg .img-box,
.bg .showplay-box {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg .img-btn {
  position: absolute;
  width: 100%;
  z-index: 100;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #244575;
  i {
    font-size: 20px;
    margin: 0 8px;
    position: relative;
    cursor: pointer;

    &:hover {
      color: #00a5e3;
    }
  }
}
.bg .oneImg {
  width: 100%;
  height: 100%;
}
.bg .twoImg {
  width: 50%;
  height: 100%;
}
.div-null {
  display: flex;
  flex: 1;
  padding: 0 12px;
}
</style>
