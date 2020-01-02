<template>
  <div class="bg" @dblclick="$parent.$emit('on-dblclick', index)" :index="index" :style="{background: bgColor.color}">
    <div v-if="isShowPlugin" class="object-box">
      <object ref="object" class="object-box" type="application/x-webplayercontrol" v-if="isShowPlugin"></object>
    </div>
    <div v-show="showTVNum" class="shownum">{{tvnum}}</div>
    <div v-show="isPTZ" class="buttonBars" @mouseup.stop="controlDome(item.addess,0)" @mousedown.stop="controlDome(item.addess)" v-for="(item, i) in xy" :key="i" :style="{left: `calc(50% + ${-20 + item.x}px)`, top: `calc(50% + ${-20 + item.y}px)`}">
      <bs-cover v-model="isPTZ" class="buttonBar-box buttonBar-boxs" :style="{transform: `rotate(${item.angle}deg)`, textAlign: 'center'}">
        <img :src="item.img" />
      </bs-cover>
    </div>
  </div>
</template>
<script>
import { preview } from 'components/bsvue'
import { AV_STREAM_START, YUNNAN_CTRL_SET } from 'http/video.api'
import { mapActions } from 'vuex'
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
  name: 'TVWallVideoPlugin',
  props: {
    index: {
      type: Number
    },
    pindex: {
      type: Number
    },
    bgColor: {
      default: () => {
        return {}
      }
    }
  },
  data() {
    const R = 100
    return {
      isShowPlugin: false,
      isPlay: false,
      isVolumeOpen: false,
      showTVNum: false,
      isPTZ: false,
      isFullscreen: false,
      saveParam: null,
      xy: [
        { x: 0, y: -R, angle: '0', addess: 'tiltUp', img: '/static/yuntai/bottom1.png' },
        { x: 0, y: R, angle: '180', addess: 'tiltDown', img: '/static/yuntai/bottom1.png' },
        { x: -R, y: 0, angle: '-90', addess: 'panLeft', img: '/static/yuntai/bottom1.png' },
        { x: R, y: 0, angle: '90', addess: 'panRight', img: '/static/yuntai/bottom1.png' },
        {
          x: -Math.sqrt(R * R / 2),
          y: -Math.sqrt(R * R / 2),
          angle: '-90',
          addess: 'swayUpLeft',
          img: '/static/yuntai/bottom2.png'
        },
        {
          x: -Math.sqrt(R * R / 2),
          y: Math.sqrt(R * R / 2),
          angle: '-180',
          addess: 'swayDownLeft',
          img: '/static/yuntai/bottom2.png'
        },
        {
          x: Math.sqrt(R * R / 2),
          y: -Math.sqrt(R * R / 2),
          angle: '0',
          addess: 'swayUpRight',
          img: '/static/yuntai/bottom2.png'
        },
        {
          x: Math.sqrt(R * R / 2),
          y: Math.sqrt(R * R / 2),
          angle: '90',
          addess: 'swayDownRight',
          img: '/static/yuntai/bottom2.png'
        }
      ]
    }
  },
  computed: {
    tvnum() {
      let s = ''
      // const pindex = this.pindex + 1
      const index = this.index + 1
      // if (pindex <= 9) {
      //   s += '0'
      // }
      // s += pindex
      if (index <= 9) {
        s += '0'
      }
      s += index
      return s
    }
  },
  methods: {
    ...mapActions(['getPlatformID']),
    setPluginCallback() {
      this.plugin.SetKeyboardCallback((index, type, keyCode) => {
        if (+keyCode === 27) {
          this.cancelFullscreen()
        }
      })
      this.plugin.SetMouseStatusCallback((index, status) => {
        if (status === 1) {
          this.$emit('on-click', this.index)
          this.$el.click()
        } else {
          this.$parent.$emit('on-dblclick', this.index)
        }
      })
    },
    cancelPluginCallback() {
      this.plugin.SetKeyboardCallback(null)
      this.plugin.SetMouseStatusCallback(null)
    },
    setShowTVNum(s) {
      this.showTVNum = s
    },
    showPlugin() {
      this.isShowPlugin = true
      return new Promise(resolve => {
        this.$nextTick(() => {
          this.plugin = this.$refs.object
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
        if (param.nodeId) {
          const r = await this.getPlatformID(param.shareServer)
          param.gbPlaNvrId = r.serverId
          param.gbPlaDevIp = r.ip
          param.gbPlaDevPort = r.port
          param.gbDevId = param.nodeId
        }
        const res = await AV_STREAM_START(param)
        this.saveParam = {
          ...param,
          tsIp: res.data.tsIp,
          tsPort: res.data.tsPort
        }
        const r = previewOpen(this.plugin, this.saveParam) === 0
        if (r) {
          this.isPlay = true
        }
        return r
      } catch (e) {
        console.error('open alarm video error', e)
        this.errorMsg('打开视频失败')
      }
    },
    close() {
      if (!this.plugin) {
        return
      }
      this.isPlay = false
      this.isVolumeOpen = false
      this.saveParam = null
      this.isPTZ = false
      preview.stop(this.plugin)
      this.cancelPluginCallback()
      this.plugin = null
      this.isShowPlugin = false
    },
    getCapture() {
      const path = preview.saveFile(this.plugin, 'jpg', 'JPG Files (*.jpg)')
      if (!path) {
        return 1
      }
      return preview.saveCapture(this.plugin, path)
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
      if (!this.isPlay) {
        return
      }
      const res = preview.openSound(this.plugin) === 0
      if (res) {
        this.isVolumeOpen = true
      }
      return res
    },
    closeSound() {
      if (!this.isPlay) {
        return
      }
      const res = preview.closeSound(this.plugin) === 0
      if (res) {
        this.isVolumeOpen = false
      }
      return res
    },
    openDome() {
      if (!this.isPlay) {
        return
      }
      this.isPTZ = true
    },
    closeDome() {
      if (!this.isPlay) {
        return
      }
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
    }
  },
  beforeDestroy() {
    this.close()
  }
}
</script>
<style lang="less" scoped>
.object-box {
  height: 100%;
  width: 100%;
}
.bg {
  box-sizing: border-box;
  border: 1px solid #444;
  padding: 1px;
  height: 100%;
  position: relative;
}
.a-frame .bs-actived .bg {
  border: 2px solid #348ff3;
  padding: 0;
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
.shownum {
  color: #bfbfbf;
  position: absolute;
  width: 30px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  top: calc(~'50% - 10px');
  left: calc(~'50% - 15px');
}
</style>
