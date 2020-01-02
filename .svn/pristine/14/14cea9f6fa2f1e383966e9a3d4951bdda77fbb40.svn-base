<template>
  <div style="position:'relative';height:100%;" id="newPlugin">
    <div @dblclick="emitDblclick" style="height: 100%">
      <object type="application/x-webplayercontrol" v-if="init" id='objPlugin'></object>
    </div>
    <bs-cover class="btn-con" v-if="init" v-show="isShowPlugin" v-model="isShowPlugin">
      <div class="btn-con-box">
        <i class="iconfont icon-pingtaihulian" v-show="showChangeVideo" title="大小窗口切换" @click="emitChangeVideo"></i>
      </div>
    </bs-cover>
  </div>
</template>

<script>
import API from '../pluginImp'
import { mapState, mapActions } from 'vuex'
import { TALK_STREAM_START } from '../../../http/video.api'
import { access_token } from '../../../stored.js' // eslint-disable-line
let recordPlugin
let previewPlugin
export default {
  name: 'plugin',
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      init: false,
      plugin: null,
      pluginState: {
        isPlay: false,
        isStopped: true,
        isVolumeOpen: false,
        volumeValue: 0,
        isFullScreen: false,
        isSpeech: false
      },
      saveParam: '',
      isShowPlugin: false,
      showChangeVideo: true
    }
  },
  computed: {
    ...mapState({
      strFilter: ({ videoOrg }) => videoOrg.strFilter,
      parameters: ({ platform }) => platform.parameters
    })
  },
  watch: {
    pluginState: {
      deep: true,
      handler(v) {
        this.$parent.$emit('update:state', this.index, v)
      }
    }
  },
  methods: {
    ...mapActions(['getVideoConf']),
    initPlugin() {
      return new Promise(resolve => {
        if (this.init) {
          resolve()
        } else {
          this.init = true
          this.$nextTick(() => {
            this.plugin = this.$el.querySelector('object')
            if (this.plugin && this.plugin.valid) {
              recordPlugin = API.recordPlugin
              previewPlugin = API.previewPlugin
              setTimeout(() => {
                this.plugin.SetMouseStatusCallback(this.pluginClickEvent)
                this.plugin.SetKeyboardCallback(this.pluginEscCall)
                resolve()
              }, 100)
            } else {
              recordPlugin = API.emptyPlugin
              previewPlugin = API.emptyPlugin
            }
          })
        }
      })
    },
    pluginClickEvent(index, status) {
      if (status === 1) {
        this.$el.click()
      } else {
        this.emitDblclick()
      }
    },
    pluginEscCall(index, type, keyCode) {
      if (this.pluginState.isFullScreen && +keyCode === 27) {
        this.fullScreen(false)
      }
    },
    emitDblclick() {
      this.$parent.$emit('dblclick', this.index)
      if (this.pluginState.isFullScreen) {
        this.fullScreen(false)
      }
    },
    emitChangeVideo() {
      this.$parent.$emit('changeVideo', this.index)
    },
    async videoPlay(param) {
      await this.initPlugin()
      const state = await recordPlugin.open(this.plugin, param)
      if (state.open) {
        this.pluginState.isStopped = false
        this.pluginState.isPlay = true
        if (this.pluginState.isVolumeOpen) {
          this.pluginState.isVolumeOpen = false
          this.videoVolume()
        }
      }
      return state.state
    },
    async recordOpen(param) {
      await this.initPlugin()
      const obj = {}
      obj.eventList = {}
      obj.eventList.timeInfo = {}
      obj.eventList.strmInfo = {}
      obj.eventList.timeInfo.startTime = param.data.result.eventList[0].evtTblInfo.startTime
      obj.eventList.timeInfo.endTime = Date.parse(new Date()) / 1000
      obj.eventList.strmInfo = param.data.result.eventList[0].strmInfo
      let params = {
        ip: param.data.result.dsIp + '',
        port: 9000 + '',
        beginTime: param.data.result.eventList[0].evtTblInfo.startTime + '',
        endTime: Date.parse(new Date()) / 1000 + '',
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
      params = JSON.stringify(params)
      return this.plugin.OpenRecordPlayerEx(params)
    },
    async syncRecordOpen(param, realTime) {
      await this.initPlugin()
      this.pluginState.isStopped = false
      this.pluginState.isPlay = true
      const obj = {}
      obj.eventList = {}
      obj.eventList.timeInfo = {}
      obj.eventList.strmInfo = {}
      obj.eventList.timeInfo.startTime = realTime
      obj.eventList.timeInfo.endTime = Date.parse(new Date()) / 1000
      obj.eventList.strmInfo = param.data.result.eventList[0].strmInfo
      let params = {
        ip: param.data.result.dsIp + '',
        port: 9000 + '',
        beginTime: realTime + '',
        endTime: Date.parse(new Date()) / 1000 + '',
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
      params = JSON.stringify(params)
      return this.plugin.OpenRecordPlayerEx(params)
    },
    showPlugin() {
      this.isShowPlugin = true
    },
    videoResume() {
      this.pluginState.isPlay = true
      return recordPlugin.resume(this.plugin)
    },
    videoPause() {
      this.pluginState.isPlay = false
      return recordPlugin.pause(this.plugin)
    },
    videoStop() {
      this.pluginState.isStopped = true
      this.pluginState.isPlay = false
      this.pluginState.isVolumeOpen = false
      return recordPlugin.stop(this.plugin)
    },
    videoScreenshot() {
      this.getVideoConf() // 同步localStorage数据到本地配置
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let picName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      const state = JSON.parse(
        recordPlugin.getPicture(this.plugin, {
          path: path,
          type: picType
        })
      )
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `<p>截图已保存到</p>${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图失败！' })
      }
    },
    videoVolume() {
      if (this.pluginState.isVolumeOpen) {
        this.closeVolume()
      } else {
        this.openVolume()
      }
    },
    closeVolume() {
      // 关闭伴音
      recordPlugin.closeSound(this.plugin)
      this.pluginState.isVolumeOpen = false
      this.pluginState.volumeValue = 0
    },
    openVolume() {
      // 打开伴音
      recordPlugin.openSound(this.plugin)
      recordPlugin.setVolume(this.plugin, 50)
      this.pluginState.isVolumeOpen = true
      this.pluginState.volumeValue = 50
    },
    setVolume(v) {
      recordPlugin.setVolume(this.plugin, v)
      this.pluginState.volumeValue = v
    },
    stopSpeech() {
      // 停止对讲
      previewPlugin.stopSpeech(this.plugin)
    },
    closeSpeech() {
      // 关闭对讲
      previewPlugin.closeSpeech(this.plugin)
      this.pluginState.isSpeech = false
    },
    openSpeechEx() {
      // 开启对讲
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
            startState = previewPlugin.startSpeech(this.plugin)
          }
          if (!openState && !startState) {
            this.pluginState.isSpeech = true
            this.$Notice.success({ desc: '开启对讲成功！', title: '提示' })
          } else {
            this.pluginState.isSpeech = false
            this.$Notice.error({ title: '失败', desc: '开启对讲失败！' })
          }
        })
        .catch(err => {
          this.pluginState.isSpeech = false
          this.$Notice.error({ title: '失败', desc: '对讲请求失败！' })
          console.log(err, '对讲请求失败！')
        })
    },
    videoDownLoad(param) {
      this.getVideoConf() // 同步localStorage数据到本地配置
      const videoType = this.parameters.downloadVideoType.toLowerCase()
      let videoName = this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + videoType
      let path = this.parameters.downloadVideoPath + '\\' + videoName.toString()
      let strFileDir = this.parameters.downloadVideoPath + '\\download.txt'
      let creatDir = this.plugin.SaveFileInfo(strFileDir, videoName)
      if (creatDir) {
        this.$Notice.warning({ desc: '创建目录文件失败', title: '警告' })
        return
      }
      recordPlugin
        .recordSave(this.plugin, {
          ...param,
          path
        })
        .then(_ => {
          this.successMsg('下载成功')
        })
        .catch(_ => {
          this.errorMsg('下载失败')
        })
    },
    getPlayerCurTime() {
      return recordPlugin.getPlayerCurTime(this.plugin)
    },
    // 预览
    async previewOpen(param) {
      this.saveParam = ''
      await this.initPlugin()
      const state = await previewPlugin.open(this.plugin, param)
      if (state.open) {
        this.saveParam = param
        this.pluginState.isStopped = false
        this.pluginState.isPlay = true
        this.pluginState.isVolumeOpen = false
        if (param.ip) {
          previewPlugin.setTipsText(this.plugin, param.ip)
        }
      } else {
        this.$Notice.error({ title: '失败', desc: '开流失败！' })
      }
    },
    previewStop(param) {
      this.pluginState.isStopped = true
      this.pluginState.isPlay = false
      this.pluginState.isVolumeOpen = false
      return previewPlugin.stop(this.plugin)
    },
    fullScreen(isFull = true) {
      recordPlugin.fullScreen(this.plugin, isFull)
      this.pluginState.isFullScreen = !this.pluginState.isFullScreen
    },
    // 帧播放
    frameToPlay(param) {
      this.pluginState.isPlay = false
      return recordPlugin.setPlayerMode(this.plugin, param)
    }
  },
  beforeDestroy() {
    if (this.plugin && this.plugin.valid) {
      this.plugin.SetMouseStatusCallback(null)
      this.plugin = null
    }
  }
}
</script>

<style>
#newPlugin #objPlugin {
  width: 100%;
  height: 100%;
}
#alarmVideoMadel .bs-video,
#selectBoxVideo .bs-video {
  position: relative;
  height: 326px;
  width: 527px;
}
#alarmVideoMadel .bs-video-single,
#selectBoxVideo .bs-video-single {
  position: absolute;
  background: rgb(64, 64, 64);
}
.bs-actived {
  border: 1px solid #348ff3;
}
/**
* 视频窗口上的按钮样式
*/
#newPlugin .btn-con {
  z-index: 101;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: right;
  background: transparent;
}
#newPlugin .btn-con .btn-con-box {
  padding-right: 2px;
  background-color: #111;
}
#newPlugin .btn-con .btn-con-box .disable,
#newPlugin .btn-con .btn-con-box .disable:hover {
  color: #878282;
}
#newPlugin .btn-con .btn-con-box .iconfont {
  font-size: 16px;
  margin: 0 2%;
  cursor: pointer;
}
#newPlugin .btn-con .iconfont:hover {
  color: #00a5e3;
}
</style>
