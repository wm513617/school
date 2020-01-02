<template>
  <div class="single-most-outer" @click.stop="clickEvent(null,1)" @dblclick="clickEvent(null,2)">
    <div class="single-outer">
      <!-- 插件 -->
      <div class="plugin-video" :class="{'small-button': paneMark!==0 && defaultPane===5 && !isMaximize}" :style="singleStatus.isSyncPlay ? 'position: fixed;top: -9999px;': ''" v-if="singleStatus.isPlugin&&singleStatus.playStatus">
        <object ref="object" type="application/x-webplayercontrol"></object>
        <iframe v-if="(singleStatus.isButton && singleStatus.isPlay) && pluginIconShow.showBottomIcon"></iframe>
        <div class="plugin-button" v-if="singleStatus.isButton && singleStatus.isPlay" @dblclick.stop>
          <div class="plugin-button-box">
            <i class="icon iconfont icon-hidemenu-copy-copy" title="隐藏" @click.stop="toolbarShow" v-if="pluginIconShow.hidemenuIcon"></i>
            <div class="div-null"></div>
            <i class="icon iconfont icon-preview-stop" title="关闭预览" @click="quickStop()" v-if="pluginIconShow.previewStopIcon"></i>
            <i class="icon iconfont" :class="[singleStatus.showVolume&&singleStatus.isPlay? 'icon-volume': 'icon-mute']" title="开启伴音" @click="changeSound()" v-if="pluginIconShow.muteIcon"></i>
            <i class="icon iconfont icon-yuntai" :class="{disable: !(singleStatus.source.monitortype >= 2)}" title="云台" @click="PTZClick()" v-if="pluginIconShow.yuntaiIcon"></i>
            <i class="icon iconfont" :class="[singleStatus.isBoost? 'icon-nk-close' : 'icon-niaokan']" :title="[singleStatus.isBoost?'关闭鸟瞰':'开启鸟瞰']" @click="boost()" v-if="pluginIconShow.niaokanIcon"></i>
            <i class="icon iconfont icon-tv-wall" title="快速上墙" @click="toWallBtn()" v-if="pluginIconShow.tvwallIcon"></i>
            <i class="icon iconfont icon-quanpingfangda" title="全屏" @click="fullScreen" v-if="pluginIconShow.quanpingfangdaIcon"></i>
          </div>
        </div>
      </div>
      <!-- 视频遮盖 -->
      <div class="sync-play-shade" v-if="singleStatus.isSyncPlay && !singleStatus.img"></div>
      <img class="sync-play-img" v-if="singleStatus.isSyncPlay && singleStatus.img" :src="singleStatus.img" >
      <div class="sync-play-shade" v-if="singleStatus.isSyncPlay && singleStatus.isMiddlePlay"><span @click="$emit('middlePlay', paneMark)" class="icon iconfont icon-play"></span></div>
      <!-- h5 -->
      <div class="label-video" ref="rtmpvideo" v-show="!singleStatus.isPlugin&&singleStatus.playStatus">
      </div>
    </div>
    <div v-show="(showPTZ&&singleStatus.isPlay)" class="PTZbuttonBars" @mouseup.stop="controlDome(item.addess,0)" @mousedown.stop="controlDome(item.addess)" v-for="(item, i) in xy" :key="i" :style="{left: item.x, top: item.y}">
      <bs-cover v-model="showPTZ" class="buttonBar-box" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" :title="item.addess"/>
      </bs-cover>
    </div>
  </div>
</template>
<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { mapState, mapActions } from 'vuex'
import { YUNNAN_CTRL_SET, recordUserLog } from 'src/http/video.api.js'
export default {
  props: {
    singleStatus: {
      type: Object,
      default: () => {
        return {
          isPlugin: true, // 插件播放还是h5
          playStatus: false, // 画面是否在使用
          isButton: false, // 是否显示插件悬浮条
          isPlay: false, // 是否播放
          img: '' // 图片遮盖的base64
        }
      }
    },
    paneMark: {
      // 当前窗格号
      type: Number,
      default: 0
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 4
    },
    isMaximize: {
      // 单画面(双击)
      type: Boolean,
      default: false
    },
    pluginIconShow: {
      // 单个插件内图标是否显示
      type: Object,
      default: () => {
        return {
          showBottomIcon: true, // 图标按钮条
          hidemenuIcon: true, // 隐藏
          previewStopIcon: true, // 关闭预览
          muteIcon: true, // 开启伴音
          yuntaiIcon: true, // 云台
          niaokanIcon: true, // 开启鸟瞰
          tvwallIcon: true, // 快速上墙
          quanpingfangdaIcon: true // 全屏
        }
      }
    }
  },
  data() {
    return {
      player: null,
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
      showPTZ: false, // 窗口内显示云台
      tOpen: '' // 预览断线重连开流定时器（仅在插件模式）
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    })
  },
  mounted() {
    this.$nextTick(function() {
      setTimeout(() => {
        if (this.$refs.object) {
          this.$refs.object.SetMouseStatusCallback(this.clickEvent)
          this.$refs.object.SetKeyboardCallback(this.pluginEscCall)
          this.$refs.object.SetNotifyCallback(this.notifyCallback)
        }
      }, 100)
    })
  },
  watch: {
    'singleStatus.playStatus': {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            if (this.$refs.object) {
              this.$refs.object.SetMouseStatusCallback(this.clickEvent)
              this.$refs.object.SetKeyboardCallback(this.pluginEscCall)
              this.$refs.object.SetNotifyCallback(this.notifyCallback)
            }
          })
        } else {
          this.$nextTick(() => {
            if (this.$refs.object) {
              this.$refs.object.SetMouseStatusCallback(null)
              this.$refs.object.SetKeyboardCallback(null)
              this.$refs.object.SetNotifyCallback(null)
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getVideoConf', 'getMonitorList', 'getTVList']),
    // 返回参数 index：插件窗格号 clicktype：单机还是双击
    clickEvent(index, clickType) {
      this.$emit('updateStatus', this.paneMark, { isButton: this.singleStatus.isPlay }, 'isButton')
      this.$emit('clickEvent', index, clickType, this.paneMark)
    },
    openRtmp(rtmp) {
      this.$refs.rtmpvideo.innerHTML = `<video ref="video" style="width:100%;height:100%" id="player${
        this.paneMark
      }" class="video-js"><source src="${rtmp}" type="rtmp/flv"></video>`
      let options = {
        autoplay: true,
        controls: true,
        muted: true,
        controlBar: {
          // 配置控制栏
          timeDivider: false, // 时间分割线
          durationDisplay: false, // 总时间
          progressControl: false, // 进度条
          // customControlSpacer: true, // 未知
          fullscreenToggle: true // 全屏
        },
        techOrder: ['flash'],
        flash: {
          swf: `http://${window.location.host}/static/plugin/video-js.swf`
        }
      }
      if (this.player) {
        this.stopRtmp()
      }
      this.$nextTick(() => {
        this.player = videojs(document.querySelector(`#player${this.paneMark}`), options, function() {})
        this.player.on('pause', () => {
          // 暂停事件
          this.clickEvent(null, 1)
          this.$emit('updateStatus', this.paneMark, { isPlay: false })
        })
        this.player.on('play', () => {
          this.clickEvent(null, 1)
          this.$emit('updateStatus', this.paneMark, { isPlay: true })
        })
        this.player.on('volumechange', () => {
          this.volumechange()
        })
        this.$emit('updateStatus', this.paneMark, { isPlay: true, isPlugin: false, playStatus: true, isButton: false })
      })
      this.$emit('updateStatus', this.paneMark, { isPlay: true }) // $nextTick 是异步 先改成播放状态
    },
    stopRtmp() {
      if (this.singleStatus.isPlay || this.singleStatus.playStatus) {
        this.player && this.player.dispose()
        this.$emit('updateStatus', this.paneMark, { isPlay: false, playStatus: false, source: '' })
      }
    },
    toolbarShow() {
      this.$emit('updateStatus', this.paneMark, { isButton: false })
    },
    getCapture() {
      // 截图
      this.getVideoConf() // 同步localStorage数据到本地配置
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let cameraName = this.singleStatus.source ? this.singleStatus.source.cameraName : this.singleStatus.result.name // 回放预览公用 数据兼荣
      let picName = cameraName + '_' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      const state = this.$refs.object.GetPlayerPicture(path, picType)
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      }
    },
    volumechange() {
      // video标签改变音量
      if (this.player.volume() === 0) {
        this.$emit('updateStatus', this.paneMark, { volumeValue: 50, showVolume: false })
      } else {
        this.$emit('updateStatus', this.paneMark, { volumeValue: this.player.volume() * 100, showVolume: true })
      }
    },
    quickStop() {
      let obj = { isPlay: false, playStatus: false, isBoost: false, source: '' }
      if (!this.singleStatus.isPlugin) {
        // rtmp 停止
        this.stopRtmp()
      } else {
        if (this.singleStatus.isPlay) {
          this.$refs.object.CloseRealStream()
          this.showPTZ = false
        }
      }
      let elementSource = JSON.parse(JSON.stringify(this.singleStatus.source))
      if (elementSource) {
        this.$parent.$emit('stopBack', elementSource)
      }
      this.$emit('updateStatus', this.paneMark, obj)
    },
    notifyCallback() { // 预览断线回调
      console.log('预览断线回调')
      let inParam = JSON.parse(JSON.stringify(this.singleStatus.source))
      this.$parent.stopPreview(this.paneMark)
      this.timerOpen(inParam)
    },
    timerOpen(inParam) {
      // 断线后定时重新开流
      this.tOpen = setInterval(() => {
        this.$parent.openIndexPreview(inParam, this.paneMark)
      }, 10000)
    },
    clearTOpen() {
      // 清除断线重新开流定时器
      clearInterval(this.tOpen)
      this.tOpen = null
    },
    boost() {
      // 鸟瞰
      if (!this.singleStatus.isPlay) {
        return
      }
      this.$refs.object.SetPlayLocalBoost()
      this.$emit('updateStatus', this.paneMark, { isBoost: !this.singleStatus.isBoost })
    },
    fullScreen() {
      // 全屏
      if (!this.singleStatus.isPlay) {
        return
      }
      if (this.singleStatus.isPlugin) {
        if (!this.singleStatus.fullScreen) {
          this.$refs.object.SetPlayFullScreen()
        }
      } else {
        this.player.requestFullscreen()
      }
      this.$emit('updateStatus', this.paneMark, { fullScreen: true })
    },
    toWallBtn() {
      // 上墙
      this.$parent.toWallBtn()
    },
    PTZClick() {
      // 云台开关
      if (!(this.singleStatus.source.monitortype >= 2)) {
        return
      }
      this.showPTZ = !this.showPTZ
    },
    // 云台点击事件
    controlDome(ctrlCmdEnum, speed = 3, presetIndex = 1, route = 1, stopTime = 5, opt = 1, channel = 1) {
      if (!this.singleStatus.isPlay) {
        return
      }
      const item = this.singleStatus.source
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
          devIp: item.devIp,
          devPort: item.devPort
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
        module: '视频结构化', // 操作模块 String
        operateName: '云台控制', // 操作名称 String
        operateContent: '云台控制', // 操作内容 String
        target: item.cameraName, // 操作对象 String
        deviceIp: item.gbDevId ? window.serverId[item.shareServer].ip : item.devIp // 设备ip String
      })
      return new Promise((resolve, reject) => {
        YUNNAN_CTRL_SET(param, item.resId, 'video')
          .then(suc => {
            resolve(suc)
          })
          .catch(error => {
            reject(error)
            console.log(`云台控制${ctrlCmdEnum}接口错误码：`, error)
          })
      })
    },
    pluginEscCall(index, type, keyCode) {
      // 监听键盘Esc
      if (this.singleStatus.fullScreen && +keyCode === 27) {
        this.exitFullScreen()
      }
    },
    exitFullScreen() {
      // 退出全屏
      console.log(this.singleStatus, 'this.singleStatus')
      if (this.singleStatus.isPlugin) {
        this.$refs.object.SetPlayNormalScreen()
      } else {
        this.player.requestFullscreen()
      }
      this.$emit('updateStatus', this.paneMark, { fullScreen: false })
    },
    changeSound() {
      // 音量开关
      if (!this.singleStatus.isPlay) {
        return
      }
      if (this.singleStatus.showVolume) {
        this.closeSound()
      } else {
        this.openSound()
        this.setSoundValue(50)
      }
    },
    openSound() {
      // 打开伴音
      if (this.singleStatus.isPlugin) {
        this.$refs.object.OpenPlayerSound()
      } else {
        this.player.muted(false)
      }
      this.$emit('updateStatus', this.paneMark, { showVolume: true })
    },
    closeSound() {
      // 关闭伴音
      if (this.singleStatus.isPlugin) {
        this.$refs.object.StopPlayerSound()
      } else {
        this.player.muted(true)
      }
      this.$emit('updateStatus', this.paneMark, { showVolume: false, volumeValue: 50 })
    },
    setSoundValue(value) {
      // 设置伴音大小
      if (this.singleStatus.isPlugin) {
        this.$refs.object.SetPlayerVolume(value)
      } else {
        this.player.volume(value / 100)
      }
      this.$emit('updateStatus', this.paneMark, { volumeValue: value })
    },
    getSoundValue() {
      // 获取伴音大小
      if (!this.singleStatus.isPlay) {
        return
      }
      if (this.singleStatus.isPlugin) {
        return JSON.parse(this.$refs.object.GetPlayerVolume())
      } else {
        return { Volume: this.player.volume() * 100, success: true }
      }
    },
    setStreamPlayerToolStringEx(strTools, bShowStream) {
      // 设置码流提示字符串
      // strTools:需要追加的提示字符串
      // bShowStream:是否显示码流信息
      if (!this.singleStatus.isPlay) {
        return
      }
      return this.$refs.object.SetStreamPlayerToolStringEx(strTools, bShowStream)
    },
    getCoverPic() {
      // 视频截图
      return new Promise(resolve => {
        let src = ''
        let i = 5
        while (i-- && !src) {
          src = this.$refs.object.GetRealPicturebyBase64(1, 50)
        }
        resolve(src)
      })
    },
    async caseProcessCover() {
      // 遮盖
      const src = await this.getCoverPic()
      if (src) {
        this.$parent.videoStatusArr[0].isMiddlePlay = true
        this.$parent.videoStatusArr[0].img = src
        this.$parent.videoStatusArr[0].isSyncPlay = true
        this.closeSound()
      }
    },
    caseProcessShow() {
      // 恢复显示
      if (
        this.$parent.videoStatusArr[0].img ||
        this.$parent.videoStatusArr[0].isSyncPlay ||
        this.$parent.videoStatusArr[0].isMiddlePlay
      ) {
        this.$parent.videoStatusArr[0].img = ''
        this.$parent.videoStatusArr[0].isSyncPlay = false
        this.$parent.videoStatusArr[0].isMiddlePlay = false
      }
    }
  },
  beforeDestroy() {
    this.clearTOpen()
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang="less" scoped>
.single-most-outer {
  position: relative;
  z-index: 99;
  vertical-align: middle;
  box-sizing: border-box;
  border: 1.5px solid #000;
  display: inline-block;
  font-size: 12px;
  width: 100%;
  height: 100%;
}
.single-outer {
  position: relative;
  width: 100%;
  height: 100%;
  .sync-play-shade {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-color: #000;
    span {
      font-size: 100px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
  }
  .sync-play-img {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    vertical-align: middle;
    width: 100%;
    z-index: 2;
  }
  .plugin-video,
  .label-video {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
  .plugin-video {
    position: relative;
    object {
      position: absolute;
      width: 100%;
      height: 100%;
    }
    iframe {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      background: #333;
      border: 0px;
    }
    .plugin-button {
      width: 100%;
      height: 30px;
      position: absolute;
      bottom: 0px;
      .plugin-button-box {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .disable,
        .disable:hover {
          color: #878282;
        }
        .div-null {
          display: flex;
          flex: 1;
        }
        i {
          font-size: 20px;
          margin: 0 8px;
          cursor: pointer;
        }
      }
    }
  }
  .small-button {
    iframe {
      height: 15px;
    }
    .plugin-button {
      height: 15px;
      .plugin-button-box {
        i {
          font-size: 12px;
          margin: 0 3px;
        }
      }
    }
  }
}
.PTZbuttonBars {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 2;
  background: #ddddee;
  .buttonBar-box {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 100;
    bottom: 0;
  }
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
