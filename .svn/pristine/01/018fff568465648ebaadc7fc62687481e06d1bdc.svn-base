<template>
  <div id="alarmVideoMadel">
    <bs-video v-if="!showDownload" :pluginCOM="plugin" :count="5" :styles="styles" @dblclick="switchStyle"
    @update:state="updateState" ref="bsvideo" style="height:280px"></bs-video>
    <div class="no-plugin" :style="{height: '325px', background: 'rgb(64, 64, 64)'}" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
    </div>
    <div class='videoPart'>
      <div class='operaVideo'>
        <span class="item iconfont" :class="[!state.isSpeech ? 'icon-shipinleiduijiangjinyong' : 'icon-shipinlei-duijiang']" title="对讲" @click="intercomClick()"></span>
        <span class="item iconfont icon-screenshot" @click="videoScreenshot" title="截图"></span>
        <span class="item iconfont" @click="videoVolume" :title="state.isVolumeOpen? '静音': '声音'" :class="[!state.isVolumeOpen ? 'icon-mute': 'icon-volume']"></span>
        <span class="item iconfont icon-full-screen" @click="fullScreen" title="全屏"></span>
      </div>
    </div>
    <div style="position: relative;">
    <Timeline v-model="timelineValue" :stepTimeLine="stepTimeLine" :disabled="false" :recordInfo="recordInfo" @forwardTop="handleDragTop"  @ondrag="handleDrag"  @mouseDown="clearTimer" ref="timeline" :isModel="true" style="width: calc(100% - 15px);"></Timeline>
    </div>
  </div>
</template>
<script>
import plugin from '../new/plugin.vue'
import versionCheck from '../pluginVersionCheck'
import Timeline from 'components/timeLine'
import { AV_RECORD_LIST } from 'http/video.api'
let videoPlugin
export default {
  components: {
    Timeline
  },
  mixins: [versionCheck],
  props: {
    videos: {
      default: () => {
        return []
      }
    },
    videoParam: { // 播放镜头参数
      type: Array,
      required: true
    },
    stepTimeLine: {
      type: Number,
      default: 7
    }
  },
  data() {
    const styleLarge = {
      width: '420px',
      height: '275px',
      left: '0px',
      top: 0
    }
    const styleSmall = {
      width: '100px',
      height: '65px',
      right: '0px'
    }
    return {
      plugin,
      modelShow: false,
      pvalue: 0,
      state: {
        isPlay: false,
        isStopped: true,
        isVolumeOpen: false,
        volumeValue: 0,
        isFullScreen: false,
        isSpeech: false
      },
      styles: [
        styleLarge,
        {
          ...styleSmall,
          top: 0
        },
        {
          ...styleSmall,
          top: '70px'
        },
        {
          ...styleSmall,
          top: '140px'
        },
        {
          ...styleSmall,
          top: '210px'
        }
      ],
      mainIndex: 0,
      curTime: 0,
      isPreview: true,
      timer: null,
      usePage: 'video',
      timelineValue: (() => {
        const d = new Date()
        d.setHours(12)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
      })(),
      recordInfo: [],
      videoParams: []
    }
  },
  computed: {
    dis() {
      return this.state.isStopped || this.isPreview
    }
  },
  watch: {
    videoParam(val) {
      this.stopAll()
      videoPlugin = videoPlugin || this.getPlugin(0)
      this.open()
    }
  },
  methods: {
    switchStyle(index) { // 大小窗口切换
      if (index === this.mainIndex) {
        return
      }
      const temp = this.styles[this.mainIndex]
      this.$set(this.styles, this.mainIndex, this.styles[index])
      this.$set(this.styles, index, temp)
      this.mainIndex = index
      videoPlugin = this.getPlugin(this.mainIndex)
      this.updateState(this.mainIndex, videoPlugin.pluginState)
    },
    getPlugin(index) {
      return this.$refs.bsvideo.getCOM(index)
    },
    videoPause() { // 暂停
      videoPlugin.videoPause()
    },
    videoStop() { // 停止
      videoPlugin.videoStop()
    },
    videoScreenshot() { // 全屏
      if (this.state.isPlay) {
        videoPlugin.videoScreenshot()
      }
    },
    videoVolume() { // 打开伴音
      if (this.state.isPlay) {
        videoPlugin.videoVolume()
      }
    },
    startTimer() {
      this.clearTimer()
      const infos = this.recordInfo[0].eventVideo
      let info = []
      if (infos.length) {
        info = infos[infos.length - 1]
      }
      this.timer = setInterval(() => {
        if (this.isPreview) {
          info.end = new Date().getTime()
          this.$refs.timeline.chengeTime(info.end)
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
    },
    updateState(index, s) {
      if (index === this.mainIndex) {
        Object.assign(this.state, s)
      }
    },
    setVolume(v) {
      videoPlugin.setVolume(v)
    },
    queryInfo(index, item) {
      AV_RECORD_LIST({
        devIp: item.devIp,
        devPort: item.devPort,
        channel: item.channel,
        startTime: parseInt(
          this.$moment()
            .add(-1, 'days')
            .toDate()
            .getTime() / 1000
        ),
        endTime: parseInt(new Date().getTime() / 1000)
      }).then(suc => {
        this.videoParams[index].queryResult = suc.data.result
      })
    },
    // 查询一天前到现在的记录
    getTimelineInfo(info) {
      return new Promise(resolve => {
        AV_RECORD_LIST({
          devIp: info.devIp,
          devPort: info.devPort,
          channel: info.channel,
          startTime: parseInt(
            this.$moment()
              .add(-1, 'days')
              .toDate()
              .getTime() / 1000
          ),
          endTime: parseInt(new Date().getTime() / 1000)
        }).then(suc => {
          const result = suc.data.result
          if (!result || result.eventList.length === 0) {
            this.$Notice.error({ title: '警告', desc: '查询无录像' })
          }
          this.videoParams[this.mainIndex].queryResult = result
          const timelineinfo = { timedVideo: [], eventVideo: [] }
          if (result && result.eventList && result.eventList.length !== 0) {
            result.eventList.forEach(item => {
              if (item.evtTblInfo.evtType === 800) {
                timelineinfo.timedVideo.push({
                  start: item.evtTblInfo.startTime * 1000,
                  end: item.evtTblInfo.endTime * 1000
                })
              } else {
                timelineinfo.eventVideo.push({
                  start: item.evtTblInfo.startTime * 1000,
                  end: item.evtTblInfo.endTime * 1000
                })
              }
            })
          }
          timelineinfo.eventVideo.push({
            start: new Date().getTime() - 1000,
            end: new Date().getTime() + 1000
          })
          this.$set(this.recordInfo, 0, timelineinfo)
          resolve()
        })
      })
    },
    // 预览
    async open() {
      this.stopAll()
      this.isPreview = true
      const list = [...this.videoParam]
      list.forEach(async(node, i) => {
        if (i < 5) {
          let param = {
            id: node.channelId,
            orgPath: node.orgPath || '',
            name: node.name || '',
            type: 'video',
            streamType: node.streamType,
            ip: node.devIp,
            port: node.devPort,
            channel: node.channel,
            vendor: node.manufacturer
          }
          if (node.nodeId) {
            param = {
              ...param,
              gbDevId: node.nodeId,
              shareServer: node.shareServer
            }
          }
          this.$set(this.videoParams, i, param)
          videoPlugin = this.getPlugin(i)
          // videoPlugin.previewOpen(param)
          this.openPreview(videoPlugin, param)
          if (i === this.mainIndex) {
            await this.getTimelineInfo(node)
            this.startTimer('preview')
          } else {
            this.queryInfo(i, node)
          }
        }
      })
      videoPlugin = this.getPlugin(this.mainIndex)
    },
    async openPreview(plugin, param) {
      plugin.previewOpen(param)
    },
    stopAll() {
      this.clearTimer()
      for (let i = 0; i < 5; i++) {
        if (this.getPlugin(i).plugin) {
          this.getPlugin(i).videoStop()
        }
      }
      this.$nextTick(() => {
        this.recordInfo = []
        this.timelineValue = new Date().getTime()
      })
    },
    fullScreen() {
      videoPlugin.fullScreen()
    },
    handleDragTop() {
      this.timerStart = new Date().getTime()
      this.videoParams.forEach((info, index) => {
        if (info && !this.isPreview) {
          this.changeToPreview(index)
        }
      })
      this.isPreview = true
      this.startTimer('preview')
    },
    handleDrag(value) {
      value = String(value).slice(0, 10)
      const now = new Date().getTime() - this.timerStart
      if (this.timerStart && now < 1000) {
        return
      }
      this.isPreview = false
      if (this.allPlugin) {
        this.videoParams.forEach((param, index) => {
          if (param) {
            this.changeToPlayback(index, value)
          }
        })
      } else {
        this.changeToPlayback(this.mainIndex, value)
      }
    },
    changeToPreview(frameIndex) {
      const info = this.videoParams[frameIndex]
      this.openPreview(this.getPlugin(frameIndex), info)
    },
    changeToPlayback(frameIndex, timeValue) {
      const param = this.videoParams[frameIndex].queryResult
      if (!param || !param.eventList.length) {
        // 无回放录像段定时器还跟预览走
        this.timer = setInterval(() => {
          let t = this.getTimeValue('preview')
          if (t > 0) {
            this.$refs.timeline.chengeTime(t)
          }
        }, 1000)
        this.$Notice.error({ title: '警告', desc: '无可用录像段' })
        return
      }
      this.openPlayback(frameIndex, {
        startTime: parseInt(timeValue),
        endTime: parseInt(new Date().getTime() / 1000),
        dsIp: param.dsIp,
        strmInfo: param.eventList[0].strmInfo,
        dsPort: '9000'
      })
      this.clearTimer()
      this.timer = setInterval(() => {
        let t = this.getTimeValue('record')
        if (t > 0) {
          // this.timelineValue = t
          this.$refs.timeline.chengeTime(t)
        }
      }, 1000)
    },
    async openPlayback(index, param) {
      let state = await this.getPlugin(index).videoPlay(param)
      if (state !== 0) {
        this.$Notice.error({ title: '警告', desc: '回放画面开流失败' })
      }
    },
    getTimeValue(type) {
      if (type !== 'preview') {
        let t = videoPlugin.getPlayerCurTime()
        if (t) {
          t = JSON.parse(t)
          if (t.success) {
            return t.msCur
          }
        }
      }
      return new Date().getTime()
    },
    intercomClick() { // 打开或者关闭对讲
      if (!this.state.isPlay) {
        return
      }
      if (!this.isPreview) {
        this.$Notice.error({ title: '警告', desc: '回放时无法开启对讲！' })
        return
      }
      if (this.state.isSpeech) {
        videoPlugin.stopSpeech()
        videoPlugin.closeSpeech()
        this.state.isSpeech = false
      } else {
        videoPlugin.closeVolume() // 对讲和伴音互斥
        this.state.isVolumeOpen = false
        videoPlugin.openSpeechEx()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.videoParam, 'this.videoParam')
      if (this.videoParam.length) {
        videoPlugin = this.getPlugin(0)
        this.open()
      }
    })
  },
  beforeDestroy() {
    this.clearTimer()
    videoPlugin = null
  }
}
</script>
<style lang="less" scoped>
.no-plugin {
  position: relative;
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
#alarmVideoMadel {
  width: 550px;
  height: 415px;
  background: #1b315c;
  position: absolute;
  z-index: 9999999999;
  overflow: hidden;
}
#alarmVideoMadel .mask {
  width: 100%;
  height: 85px;
  position: absolute;
  z-index: 99999;
  bottom: 0;
  cursor: no-drop;
}
#alarmVideoMadel .line {
  position: absolute;
  bottom: 0;
}
.videoPart {
  margin: 10px;
}
.videoPart .operaVideo span {
  display: inline-block;
  margin: 0px 15px 0px 0px;
  cursor: pointer;
}
</style>
