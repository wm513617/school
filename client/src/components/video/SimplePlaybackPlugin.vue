<template>
  <div class="bg">
    <div class="objectBox" v-if="isShowPlugin" :style="{position:'absolute',top:pluTop,left: pluLeft }">
      <object type="application/x-webplayercontrol"></object>
    </div>
    <img style="position:absolute;top:0;left:0;width:100%;height:100%" :src="imgSrc" draggable='false' v-if="imgSrc"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { playback } from 'components/bsvue'
import pluginImp from 'components/video/pluginImp'
export default {
  name: 'SimplePlaybackPlugin',
  data() {
    return {
      isShowPlugin: false,
      isFullscreen: false,
      imgSrc: '',
      pluTop: 0,
      pluLeft: 0
    }
  },
  computed: {
    ...mapState({ parameters: ({ platform }) => platform.parameters })
  },
  methods: {
    ...mapActions(['getVideoConf']),
    async NVRopen(param, isPlay) {
      if (!isPlay) {
        await this.showPlugin()
      }
      const state = await pluginImp.recordPlugin.NVRopen(this.plugin, param)
      return state
    },
    async gbOpen(param, res) {
      if (!this.isShowPlugin) {
        await this.showPlugin()
      }
      const state = await pluginImp.recordPlugin.gbOpen(this.plugin, param, res)
      return state
    },
    setPluginCallback() {
      this.plugin.SetKeyboardCallback((index, type, keyCode) => {
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
      this.plugin.SetNotifyCallback(() => {
        this.$emit('playEnd')
      })
    },
    cancelPluginCallback() {
      this.plugin.SetKeyboardCallback(null)
      this.plugin.SetMouseStatusCallback(null)
      this.plugin.SetNotifyCallback(null)
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
            resolve()
          }, 500)
        })
      })
    },
    async open(param, isPlay) {
      if (!isPlay) { await this.showPlugin() }
      return playback.open(this.plugin, param) === 0
    },
    resume() {
      return playback.resume(this.plugin)
    },
    pause() {
      return playback.pause(this.plugin)
    },
    fullScreen() {
      playback.fullScreen(this.plugin)
      this.isFullscreen = true
    },
    cancelFullscreen() {
      playback.normalScreen(this.plugin)
      this.isFullscreen = false
    },
    getSaveFilePath(type, file) {
      return playback.saveFile(this.plugin, type, file)
    },
    getCapture() {
      const path = playback.saveFile(this.plugin, 'jpg', 'JPG Files (*.jpg)')
      if (typeof path === 'number') {
        return 1
      }
      return playback.saveCapture(this.plugin, path.slice(-3) === 'jpg' ? path : path + '.jpg')
    },
    openSound() {
      return playback.openSound(this.plugin)
    },
    closeSound() {
      return playback.closeSound(this.plugin)
    },
    setVolume(v) {
      return playback.setVolume(this.plugin, v)
    },
    close() {
      if (!this.plugin) {
        return
      }
      playback.stop(this.plugin)
      this.cancelPluginCallback()
      this.plugin = null
      this.isShowPlugin = false
    },
    getPlayerCurTime() {
      return playback.getCurTime(this.plugin)
    },
    moveToCapture() {
      this.imgSrc = playback.getCapture(this.plugin, 10)
      this.pluTop = '-9999px'
      this.pluLeft = '-9999px'
    },
    moveToBack() {
      this.imgSrc = ''
      this.pluTop = '0'
      this.pluLeft = '0'
    },
    pawnOpen(obj) { // 单兵回放
      return this.showPlugin().then(() => {
        const param = JSON.stringify({
          port: obj.port,
          ip: obj.ip,
          beginTime: obj.beginTime,
          endTime: obj.endTime,
          cmdStr: JSON.stringify(obj.cmdStr)
        })
        return this.plugin.OpenRecordPlayerEx(param) === 0
      })
    },
    // 截图功能
    getScreenshot() {
      this.getVideoConf() // 同步localStorage数据到本地配置
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let picName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      let param = {
        path: path,
        type: picType
      }
      const state = JSON.parse(
        pluginImp.recordPlugin.getPicture(this.plugin, param)
      )
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      }
    },
    // 下载功能
    recordDump(param) {
      this.getVideoConf() // 同步localStorage数据到本地配置
      const videoType = this.parameters.downloadVideoType.toLowerCase()
      let videoName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + videoType
      let path = this.parameters.downloadVideoPath + '\\' + videoName.toString()
      let strFileDir = this.parameters.downloadVideoPath + '\\download.txt'
      let creatDir = this.plugin.SaveFileInfo(strFileDir, 'download')
      if (creatDir) {
        this.$Notice.warning({ desc: '创建目录文件失败', title: '警告' })
        return
      }
      let recordParam = {
        startTime: param.startTime,
        endTime: param.endTime,
        strmInfo: param.strmInfo,
        dsIp: param.dsIp,
        path: path
      }
      return pluginImp.recordPlugin.recordSave(this.plugin, recordParam)
    }
  },
  beforeDestroy() {
    this.close()
  }
}
</script>
<style scoped>
.objectBox, object {
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
</style>
