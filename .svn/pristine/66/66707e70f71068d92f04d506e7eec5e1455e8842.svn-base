<template>
  <div class="bg">
     <div v-if="isShowPlugin" class="objectBox" :style="{position:'absolute',top:pluTop,left: pluLeft }">
       <object type="application/x-webplayercontrol"></object>
      </div>
    <img style="position:absolute;top:0;left:0;width:100%;height:100%" :src="imgSrc" v-if="imgSrc" draggable='false'/>
    <div v-show="isPTZ" class="buttonBars" @mouseup.stop="controlDome(item.addess,0)" @mousedown.stop="controlDome(item.addess)" v-for="(item, i) in xy" :key="i" :style="{left: `calc(100% - ${PTZmargin + item.x}px)`, top: `calc(100% - ${PTZmargin + item.y}px)`}">
      <bs-cover v-model="isPTZ" class="buttonBar-box buttonBar-boxs" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" />
      </bs-cover>
    </div>
  </div>
</template>
<script>
import { preview } from 'components/bsvue'
import { AV_STREAM_START, YUNNAN_CTRL_SET } from 'http/video.api'
import { mapActions, mapState } from 'vuex'
import { TALK_STREAM_START } from '../../http/video.api'
import { access_token } from '../../stored.js' // eslint-disable-line
const previewOpen = (
  p,
  { streamType, vendor, ip, port, channel, tsPort, tsIp, gbPlaDevIp, gbPlaDevPort, gbDevId, gbPlaNvrId }
) => {
  let cmd = {
    streamType: streamType || 'main',
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
  name: 'SimplePreviewPlugin',
  props: {
    propsFullscreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const R = 50
    return {
      isShowPlugin: false,
      isPTZ: false,
      isFullscreen: false,
      saveParam: null,
      xy: [
        { x: R, y: 2 * R, angle: '0', addess: 'tiltUp', img: '/static/yuntai/bottom1.png' },
        { x: R, y: 0, angle: '180', addess: 'tiltDown', img: '/static/yuntai/bottom1.png' },
        { x: 2 * R, y: R, angle: '-90', addess: 'panLeft', img: '/static/yuntai/bottom1.png' },
        { x: 0, y: R, angle: '90', addess: 'panRight', img: '/static/yuntai/bottom1.png' },
        {
          x: 2 * R,
          y: 2 * R,
          angle: '-90',
          addess: 'swayUpLeft',
          img: '/static/yuntai/bottom2.png'
        },
        {
          x: 2 * R,
          y: 0,
          angle: '-180',
          addess: 'swayDownLeft',
          img: '/static/yuntai/bottom2.png'
        },
        {
          x: 0,
          y: 2 * R,
          angle: '0',
          addess: 'swayUpRight',
          img: '/static/yuntai/bottom2.png'
        },
        {
          x: 0,
          y: 0,
          angle: '90',
          addess: 'swayDownRight',
          img: '/static/yuntai/bottom2.png'
        }
      ],
      imgSrc: '',
      pluTop: 0,
      pluLeft: 0
    }
  },
  computed: {
    ...mapState({ parameters: ({ platform }) => platform.parameters }),
    PTZmargin() {
      return this.propsFullscreen ? 70 : 30
    }
  },
  methods: {
    ...mapActions(['getPlatformID', 'getVideoConf']),
    setPluginCallback() {
      this.plugin.SetKeyboardCallback((index, type, keyCode) => {
        this.$emit('KeyboardCallback', keyCode)
        if (+keyCode === 27) {
          this.cancelFullscreen()
        }
      })
      this.plugin.SetMouseStatusCallback((index, status) => {
        if (status === 1) {
          this.$emit('on-click', index)
        } else {
          this.$emit('on-dblclick', index)
        }
      })
    },
    cancelPluginCallback() {
      this.plugin.SetKeyboardCallback(null)
      this.plugin.SetMouseStatusCallback(null)
    },
    showPlugin() {
      this.isShowPlugin = true
      return new Promise(resolve => {
        this.$nextTick(() => {
          this.plugin = this.$el.querySelector('object')
          if (!this.plugin.valid) {
            return
          }
          setTimeout(() => {
            this.setPluginCallback()
          }, 100)
          resolve()
        })
      })
    },
    async open(param) {
      await this.showPlugin()
      try {
        if (param.gbDevId) {
          const r = await this.getPlatformID(param.shareServer)
          param.gbPlaNvrId = r.serverId
          param.gbPlaDevIp = r.ip
          param.gbPlaDevPort = r.port
        }
        const res = await AV_STREAM_START(param)
        this.saveParam = {
          ...param,
          tsIp: res.data.tsIp,
          tsPort: res.data.tsPort
        }
        let state = previewOpen(this.plugin, this.saveParam)
        return state === 0
      } catch (e) {
        console.error('open alarm video error', e)
        this.errorMsg('打开视频失败')
      }
    },
    setStreamIp(ip) {
      this.plugin.SetStreamPlayerToolString('IP:' + ip)
    },
    close() {
      if (!this.plugin) {
        return
      }
      this.saveParam = null
      preview.stop(this.plugin)
      this.isPTZ = false
      this.cancelPluginCallback()
      this.plugin = null
      this.isShowPlugin = false
    },
    getCapture() {
      // 截图,需要手动选择保存路径
      const path = preview.saveFile(this.plugin, 'jpg', 'JPG Files (*.jpg)')
      if (typeof path === 'number') {
        return 1
      }
      return preview.saveCapture(this.plugin, path.slice(-3) === 'jpg' ? path : path + '.jpg')
    },
    getScreenshot() {
      // 截图,自动应用本地配置保存路径
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
    fullScreen() {
      preview.fullScreen(this.plugin)
      this.isFullscreen = true
    },
    cancelFullscreen() {
      preview.normalScreen(this.plugin)
      this.isFullscreen = false
    },
    openSound() {
      console.log(this.plugin.OpenPlayerSound, 'this.plugin.OpenPlayerSound')
      return this.plugin.OpenPlayerSound()
    },
    closeSound() {
      return this.plugin.StopPlayerSound()
    },
    setVolume(v) {
      return preview.setVolume(this.plugin, v)
    },
    openDome() {
      this.isPTZ = true
    },
    closeDome() {
      this.isPTZ = false
    },
    controlDome(ctrlCmdEnum, speed = 3, presetIndex = 1, route = 1, stopTime = 5, opt = 1, channel = 1) {
      const item = this.saveParam
      if (!item) {
        return Promise.reject(new Error(false))
      }
      let devInfo = {}
      if (item.gbDevId) {
        const id = this.getPlatformID(item.shareServer)
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
    moveToCapture() {
      this.imgSrc = preview.getCapture(this.plugin, 10)
      this.pluTop = '-9999px'
      this.pluLeft = '-9999px'
    },
    moveToBack() {
      this.imgSrc = ''
      this.pluTop = '0'
      this.pluLeft = '0'
    },
    async openVideoCall(obj) {
      // 打开视频通话
      await this.showPlugin()
      const param = JSON.stringify({
        port: String(obj.port),
        ip: String(obj.ip),
        cmdStr: JSON.stringify(obj.cmdStr)
      })
      console.log(param, 'openVideoCall param')
      console.log(this.plugin, 'plugin')
      console.log(this.plugin.OpenRealStreamEx, 'plugin.OpenRealStreamEx')
      const state = this.plugin.OpenRealStreamEx(param)
      console.log(state, 'OpenRealStreamEx')
      return state === 0
    },
    closeVideoCall() {
      // 关闭视频通话
      return preview.stop(this.plugin) === 0
    },
    stopSpeech() {
      return this.plugin.StopSpeech()
    },
    closeSpeech() {
      return this.plugin.CloseSpeech()
    },
    startSpeechMobile() {
      console.log(this.plugin, 'this.plugin')
      console.log(this.plugin.StartSpeechMobile, 'this.plugin.StartSpeechMobile')
      return this.plugin.StartSpeechMobile(false)
    },
    openSpeechEx() {
      const params = {}
      params.devList = []
      params.devList[0] = {
        devIp: this.saveParam.ip,
        port: this.saveParam.port,
        channel: this.saveParam.channel,
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
            this.$Notice.success({ desc: '开启对讲成功！', title: '提示' })
            this.$emit('speechState', true)
          } else {
            this.$Notice.error({ title: '失败', desc: '开启对讲失败！' })
            this.$emit('speechState', false)
          }
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '对讲请求失败！' })
          console.log(err, '对讲请求失败！')
          this.$emit('speechState', false)
        })
    },
    openAppSpeechEx(param) {
      console.log(this.plugin.OpenSpeechEx, 'this.plugin.OpenSpeechEx')
      return this.plugin.OpenSpeechEx(param)
    }
  },
  beforeDestroy() {
    // this.close()
  }
}
</script>
<style lang="less" scoped>
object,
.objectBox {
  height: 100%;
  width: 100%;
}
.bg {
  background: rgb(64, 64, 64);
  box-sizing: border-box;
  border: 1px solid #1f2224;
  height: 100%;
  position: relative;
}
.buttonBars {
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
