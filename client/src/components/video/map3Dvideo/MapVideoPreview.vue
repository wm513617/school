<!--编辑模式 视频点位的视频预览功能 页面-->
<template>
  <div class="MapVideoPreview" :style="isFullscreen ? 'height: 100%;width: 100%;position: fixed;left:0;top:0;': 'height: 100%; padding: 10px 12px 0;'" v-resize="resizeFn">
    <div v-if="isFullscreen" style="height: 100%;width: 100%;position: absolute;left:0;top:0;">
      <iframe v-if="isFullscreen" style="height: 100%;width: 100%;border: 0 none;"></iframe>
    </div>
    <SimplePreviewPlugin :style="isFullscreen ? 'height: 100%;width: 100%;position: absolute;left:0;top:0;': 'height:335px'" :propsFullscreen="isFullscreen" @KeyboardCallback="KeyboardCallback" @on-click="clickChange" ref="frame" @speechState="speechState"></SimplePreviewPlugin>
    <div v-if="isFullscreen && toolbarShow" style="height: 40px;line-height:40px;position: absolute;left:0;bottom:0;width: 100%;">
      <iframe v-if="isFullscreen && toolbarShow" style="height: 100%;width: 100%;position: absolute;left:0;top:0;border: 0 none;z-index: 200;"></iframe>
      <div style="height: 100%;width: 100%;position: absolute;left:0;top:0;z-index: 3000;background: #333;">
        <div class="full-btn-con iconfont">
          <button class="iconfont" title="隐藏" @click.stop="toolbarShow = false">&#xe73e;</button>
          <button class="iconfont" :class="[!pluginState.isSpeech ? 'icon-shipinleiduijiangjinyong' : 'icon-shipinlei-duijiang']" style="cursor: pointer;" title="对讲" @click="intercomClick()"></button>
          <button @click="getCapture" title="截图">&#xe67a;</button>
          <button v-if="isShowAllButton" @click="PTZfn" title="云台">&#xe659;</button>
          <div style="position:relative">
            <button @click="pluginState.isVolumeOpen? closeSound(): openSound()" :title="!pluginState.isVolumeOpen? '静音': '声音'">{{pluginState.isVolumeOpen? '&#xe678;': '&#xe697;'}}</button>
            <div v-show="pluginState.isVolumeOpen" :style="{visibility: pluginState.isVolumeOpen ? 'visible' : 'hidden'}" style="height:30px;margin:-5px 0 0 3px;display:inline-block;vertical-align:middle;position:absolute;left:30px;top:10px;">
              <slider style="width:60px" color="#20a1ff" :size="100" :minValue='0' @on-change="setVolume" show-tip="never" v-model="volume">
              </slider>
            </div>
          </div>
          <button class="icon iconfont icon-tv-wall" title="快速上墙" v-if="!buttonShow.includes('wall')" @click="showTowallBtn"></button>
          <button @click="fullscreen" title="全屏">&#xe672;</button>
        </div>
      </div>
    </div>
    <div class="btn-con iconfont" style="display:inline-block;margin-left:10px" v-if="!isFullscreen">
      <button v-if="isShowAllButton" @click="pluginState.isPlay? stop(): open()" :title="pluginState.isPlay? '停止': '预览'">{{pluginState.isPlay? '&#xe676;': '&#xe679;'}}</button>
      <button class="iconfont" :class="[!pluginState.isSpeech ? 'icon-shipinleiduijiangjinyong' : 'icon-shipinlei-duijiang']" style="cursor: pointer;" title="对讲" @click="intercomClick()"></button>
      <button @click="getCapture" title="截图">&#xe67a;</button>
      <button v-if="isShowAllButton" @click="PTZfn" title="云台">&#xe659;</button>
      <button @click="pluginState.isVolumeOpen? closeSound(): openSound()" :title="!pluginState.isVolumeOpen? '静音': '声音'">{{pluginState.isVolumeOpen? '&#xe678;': '&#xe697;'}}</button>
      <div v-show="pluginState.isVolumeOpen" :style="{visibility: pluginState.isVolumeOpen ? 'visible' : 'hidden'}" style="height:30px;margin:-5px 0 0 3px;display:inline-block;vertical-align:middle">
        <slider style="width:60px" color="#20a1ff" :size="100" :minValue='0' @on-change="setVolume" show-tip="never" v-model="volume">
        </slider>
      </div>
      <button class="icon iconfont icon-tv-wall" title="快速上墙" v-if="!buttonShow.includes('wall')" @click="showTowallBtn"></button>
    </div>
    <div class="btn-con iconfont" style="float:right;margin-right:10px" v-if="!isFullscreen">
      <button @click="fullscreen" title="全屏">&#xe672;</button>
      <button v-if="isShowAllButton" @click="changeToBack" title="录像回放">&#xe650;</button>
    </div>
    <!-- 上墙弹框 -->
    <Modal id="quickTowall" v-model="showTowall" title="快速上墙" :mask-closable="false" :transition-names="[]">
      <iframe v-if="showTowall" style="z-index:0"></iframe>
      <QuickToWall v-if="showTowall" style="position:relative" :camera="cameraId"></QuickToWall>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="showTowall=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import SimplePreviewPlugin from 'components/video/SimplePreviewPlugin'
import { mapState, mapActions } from 'vuex'
import QuickToWall from 'view/video/tvwall/QuickToWall'
export default {
  components: {
    SimplePreviewPlugin,
    QuickToWall
  },
  props: {
    videoParam: {
      type: Object,
      required: true
    },
    isShowAllButton: {
      type: Boolean,
      default: true
    },
    buttonShow: {
      // 用来显示隐藏按钮的
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      pluginState: {
        isPlay: false,
        isVolumeOpen: false,
        isPTZ: false,
        isSpeech: false
      },
      showSlider: false,
      volume: 50,
      power: [],
      showTowall: false,
      cameraId: '',
      isFullscreen: false, // 全屏
      toolbarShow: false // 窗口内功能条显示
    }
  },
  computed: {
    ...mapState({}),
    openParam() {
      if (!this.videoParam._id) {
        return
      }
      let p = {
        id: this.videoParam._id,
        ip: this.videoParam.eid.ip,
        port: this.videoParam.eid.cport,
        channel: this.videoParam.chan,
        streamType: this.videoParam.stream,
        type: 'video',
        vendor: this.videoParam.eid.manufacturer,
        pType: this.videoParam.type
      }
      if (this.videoParam.nodeId) {
        p = {
          ...p,
          gbDevId: this.videoParam.nodeId,
          shareServer: this.videoParam.shareServer
        }
      }
      return p
    }
  },
  methods: {
    ...mapActions(['recordLog', 'getCameraPower', 'getMonitorList', 'getTVList', 'setToolVisible']),
    setVolume(v) {
      this.plugin.setVolume(v)
    },
    async open(params = this.openParam) {
      if (!params) {
        return
      }
      this.power = await this.getCameraPower(this.openParam.id)
      if ((!this.power || !this.power.includes('preview')) && !this.openParam.pType) {
        this.$Notice.warning({ desc: `${params.name || ''}没有权限！`, title: '警告' })
        return
      }
      const success = await this.plugin.open(params)
      if (success) {
        this.pluginState.isPlay = true
        this.cameraId = params.id
        this.recordLog({
          logType: '操作日志',
          module: '电子地图',
          operateName: '视频预览',
          operateContent: '开始视频预览',
          target: this.videoParam.name,
          deviceIp: this.videoParam.nodeId ? this.videoParam.gbPlaDevIp : this.videoParam.eid.ip
        })
        if (params.ip) {
          this.plugin.setStreamIp(params.ip)
        }
      }
    },
    stop(params) {
      this.pluginState = {
        isPlay: false,
        isPTZ: false,
        isVolumeOpen: false,
        isSpeech: false
      }
      this.volume = 50
      this.cameraId = ''
      if (!this.videoParam || !this.videoParam.eid) {
        return
      }
      this.recordLog({
        logType: '操作日志',
        module: '电子地图',
        operateName: '视频预览',
        operateContent: '停止视频预览',
        target: this.videoParam.name,
        deviceIp: this.videoParam.nodeId ? this.videoParam.gbPlaDevIp : this.videoParam.eid.ip
      })
      return this.plugin.close()
    },
    getCapture() {
      this.recordLog({
        logType: '操作日志',
        module: '电子地图',
        operateName: '截图',
        operateContent: '截图',
        target: this.videoParam.name,
        deviceIp: this.videoParam.nodeId ? this.videoParam.gbPlaDevIp : this.videoParam.eid.ip
      })
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
      // if (this.plugin.isFullscreen) {
      //   this.plugin.cancelFullscreen()
      // } else {
      //   this.plugin.fullScreen()
      // }
      if (this.isFullscreen) {
        this.isFullscreen = false
        this.$emit('changeFullscreen', false)
        this.exitFullscreen()
      } else {
        this.requestFullscreen()
        this.isFullscreen = true
        this.$emit('changeFullscreen', true)
        this.setToolVisible(false) // 地图工具边条隐藏
      }
    },
    KeyboardCallback(keyCode, val) {
      console.log(+keyCode, 'keyCode88')
      if (+keyCode === 27) {
        this.isFullscreen = false
        this.$emit('changeFullscreen', false)
        this.exitFullscreen()
      }
    },
    clickChange(index, val) {
      console.log(index, 'index888')
      this.toolbarShow = true
    },
    openSound() {
      if (!this.plugin.openSound()) {
        this.pluginState.isVolumeOpen = true
        this.setVolume(50)
      }
    },
    closeSound() {
      if (!this.plugin.closeSound()) {
        this.pluginState.isVolumeOpen = false
        this.volume = 50
      }
    },
    PTZfn() {
      if ((!this.power || !this.power.includes('cloudControl')) && !this.openParam.pType) {
        this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        return
      }
      const type = this.videoParam.monitortype
      if (type === 0 || type === 1) {
        this.warningMsg('此镜头不支持云台功能')
        return
      }
      if (this.pluginState.isPlay) {
        this.recordLog({
          logType: '操作日志',
          module: '电子地图',
          operateName: '云台控制',
          operateContent: '云台控制',
          target: this.videoParam.name,
          deviceIp: this.videoParam.nodeId ? this.videoParam.gbPlaDevIp : this.videoParam.eid.ip
        })
        if (this.isPTZ) {
          this.plugin.closeDome()
        } else {
          this.plugin.openDome()
        }
        this.isPTZ = !this.isPTZ
      }
    },
    changeToBack() {
      if ((!this.power || !this.power.includes('playback'))) {
        this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        return
      }
      if (this.pluginState.isPlay) {
        this.plugin.close()
      }
      this.$emit('update:toggle', 'playBack')
    },
    intercomClick() {
      if (!this.pluginState.isPlay) {
        return
      }
      if (this.pluginState.isSpeech) {
        this.plugin.stopSpeech()
        this.plugin.closeSpeech()
        this.pluginState.isSpeech = false
      } else {
        this.plugin.closeSound() // 对讲和伴音互斥
        this.pluginState.isVolumeOpen = false
        this.plugin.openSpeechEx()
      }
    },
    speechState(v) {
      // 对讲反馈的状态
      this.pluginState.isSpeech = v
    },
    showTowallBtn() {
      // 上墙
      this.getTVList().then(() => {
        this.getMonitorList()
      })
      if (this.pluginState.isPlay) {
        this.showTowall = true
      } else {
        this.$Notice.warning({ desc: `请选择镜头！`, title: '警告' })
      }
    },
    /**
     * 页面尺寸改变事件
     * 解决360浏览器全屏模式下keydown事件不触发问题
     */
    resizeFn() {
      if (
        !(
          document.fullscreenEnabled ||
          window.fullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenEnabled
        )
      ) {
        this.escFn({ which: 27 })
      }
    }
  },
  mounted() {
    this.$root.$on('eventName', target => {
      // this.functionName(target)
    })
    this.$nextTick(() => {
      this.plugin = this.$refs.frame
      console.log(this.openParam, '点击面板打开视频')
      this.open(this.openParam)
    })
    this.escFn = e => {
      if (e.which === 27 || e.keyCode === 27) {
        this.exitFullscreen()
        this.isFullscreen = false
        this.$emit('changeFullscreen', false)
      }
    }
    document.addEventListener('keydown', this.escFn, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.escFn, false)
    if (this.pluginState.isPlay) {
      this.plugin.close()
    }
    this.plugin = null
    this.cameraId = ''
  }
}
</script>
<style scoped>
.MapVideoPreview {
  padding: 0px 5px;
}
.MapVideoPreview .video-plugin-box .video-plugin-inBox .container,
.MapVideoPreview .video-plugin-box .video-plugin-inBox .active,
.MapVideoPreview .video-plugin-box .video-plugin-inBox .bdr,
.MapVideoPreview .video-plugin-box .video-plugin-inBox .bdr1 {
  border: 0px !important;
  margin: 0 !important;
}
.btn-con {
  line-height: 45px;
}
.full-btn-con {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.btn-con button,
.full-btn-con button {
  border: 0 none;
  background: transparent;
  color: #fff;
  padding: 0 5px;
  outline: 0 none;
  cursor: pointer;
}
.btn-con button:hover,
.full-btn-con button:hover {
  color: #20adff;
}
.full-btn-con button {
  font-size: 20px;
}
#quickTowall iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  border: 0 none;
  top: 0;
  left: 0;
}
</style>
<style>
.MapVideoPreview .ivu-slider-button-wrap {
  top: -7px;
}
#quickTowall .ivu-modal {
  width: fit-content !important;
}
</style>
