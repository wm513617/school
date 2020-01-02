<template>
  <div style="height: 100%">
    <div style="height:100%">
      <SimplePlaybackPlugin :style="{height: pluginHeight}" ref="frame"></SimplePlaybackPlugin>
      <div class="btn-con" style="display:inline-block;margin-left:10px;" :style="{width: sliderW}">
        <PlaybackProgress :disabled="dis" :value="pvalue" :allTime="allTime" @on-mousedown="clearTimer" @on-mouseup="!dis&&startTimer()" @on-change="jumpPlay">
        </PlaybackProgress>
      </div>
      <div class="btn-con" style="float:right;margin-right:10px">
        <button :class="['iconfont', pluginState.isPlay? 'icon-pause': 'icon-play']" @click="pluginState.isPlay? pause(): resume()"></button>
        <button class="iconfont icon-stop" @click="stop"></button>
        <button :class="['iconfont', pluginState.isVolumeOpen? 'icon-mute': 'icon-volume']" v-if="!buttonShow.includes('volume')" @click="pluginState.isVolumeOpen? closeSound(): openSound()"></button>
        <button class="iconfont icon-b_icon__screenshot" @click="getCapture"></button>
        <button class="iconfont icon-full-screen" v-if="!buttonShow.includes('screen')" @click="fullscreen"></button>
        <button class="icon iconfont icon-xiazai" @click="download"></button>
      </div>
    </div>
  </div>
</template>
<script>
import SimplePlaybackPlugin from 'components/video/SimplePlaybackPlugin'
import PlaybackProgress from 'components/video/PlaybackProgress'
import { AV_RECORD_LIST } from 'http/video.api'
export default {
  components: {
    SimplePlaybackPlugin,
    PlaybackProgress
  },
  props: {
    videoParam: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean
    },
    pluginHeight: {
      type: String,
      default: '320px'
    },
    sliderW: {
      type: String,
      default: '500px'
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
    const now = new Date()
    return {
      pluginState: {
        isPlay: false,
        isVolumeOpen: false,
        isStopped: true
      },
      startTime: 0,
      endTime: 0,
      pickDate: now,
      resultList: [],
      playingIndex: -1,
      dsIp: null,
      pvalue: 0,
      curTime: 0,
      eTime: 0,
      sTime: 0,
      loading: false
    }
  },
  computed: {
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
    show(s) {
      if (s) {
        this.playRecord()
      } else {
        this.stop()
      }
    },
    curTime(t) {
      const pvalue = t - this.sTime * 1000
      this.pvalue = pvalue < 0 ? this.jumpValue || 0 : pvalue
    },
    pvalue(p) {
      if (p >= this.allTime) {
        this.stop()
      }
    }
  },
  methods: {
    findStrmInfo(infos, time) {
      let info = {}
      infos.forEach(item => {
        const timeInfo = item.evtTblInfo
        if (time >= timeInfo.startTime && time < timeInfo.endTime) {
          info = item.strmInfo
          return false
        }
      })
      return info
    },
    playRecord() {
      const p = this.videoParam
      AV_RECORD_LIST({
        devIp: p.devIp,
        devPort: p.devPort,
        channel: p.channel,
        startTime: p.startTime,
        endTime: p.endTime,
        streamType: p.streamType
      })
        .then(async suc => {
          const result = suc.data.result
          if (!result) {
            this.warningMsg('未查询到录像')
            return
          }
          this.dsIp = result.dsIp
          if (result.eventList.length) {
            const param = {
              strmInfo: this.findStrmInfo(result.eventList, p.startTime),
              start: p.startTime,
              end: p.endTime
            }
            const state = await this.open(param)
            if (state) {
              this.sTime = param.start
              this.eTime = param.end
              this.pluginState.isPlay = true
              this.pluginState.isStopped = false
              this.startTimer()
              this.openSound()
            }
          } else {
            this.warningMsg('未查询到录像')
          }
        })
        .catch(e => {
          console.log('AV_RECORD_LIST error:', e)
          this.errorMsg('录像查询失败')
        })
    },
    open(param = this.tmpParam) {
      this.tmpParam = param
      return this.plugin.open({
        dsIp: this.dsIp,
        startTime: param.start,
        endTime: param.end,
        strmInfo: param.strmInfo
      })
    },
    stop() {
      this.clearTimer()
      this.plugin.close()
      this.pluginState.isPlay = false
      this.pluginState.isStopped = true
      this.playingIndex = -1
      this.pvalue = 0
      this.$nextTick(() => {
        this.sTime = this.eTime = 0
        this.jumpValue = 0
      })
    },
    resume() {
      if (this.pluginState.isStopped) {
        this.playRecord()
      } else {
        this.plugin.resume()
        this.pluginState.isPlay = true
      }
    },
    pause() {
      this.plugin.pause()
      this.pluginState.isPlay = false
    },
    getCapture() {
      if (this.dis) {
        return
      }
      const state = this.plugin.getCapture()
      if (state === 0) {
        this.successMsg('保存成功')
      } else if (state !== 1) {
        this.errorMsg('保存失败')
        console.log('save capture error', state)
      }
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
    formatTimeValue(date) {
      const d = this.pickDate
      d.setHours(date.getHours())
      d.setMinutes(date.getMinutes())
      d.setSeconds(date.getSeconds())
      return parseInt(d.getTime() / 1000)
    },
    formatTime(time) {
      const date = new Date(time * 1000)
      return this.$moment(date).format('YYYY-MM-DD HH:mm:ss')
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
      this.tmpParam.start = this.sTime + parseInt(v / 1000)
      this.open()
    },
    download() {
      // 下载
      if (!this.tmpParam) { return }
      let param = {
        dsIp: this.dsIp,
        startTime: this.tmpParam.start,
        endTime: this.tmpParam.end,
        strmInfo: this.tmpParam.strmInfo
      }
      this.plugin.recordDump(param)
    }
  },
  beforeDestroy() {
    this.stop()
  }
}
</script>
<style lang="less" scoped>
.btn-con {
  line-height: 43px;
  height: 40px;

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

.playBackMain .playBackLeft .playBackLeftMain {
  padding: 10px;
  padding-bottom: 0px;
}

.playBackMain .playBackLeft .playBackLeftMain .playInput {
  height: 26px;
  line-height: 26px;
  width: 100%;
}

.playBackMain .playBackLeft .playBackLeftMain .playInput .timeSelect {
  display: inline-block;
}

.playBackMain .playBackLeft .playBackLeftMain > div {
  margin-bottom: 10px;
}

.playBackMain .playBackLeft .playBackLeftMain .closeBtn {
  margin: 0px;
  height: 26px;
  line-height: 26px;
}

.playBackMain .playBackLeft .ivu-date-picker {
  width: 135px;
}
.list-ui li {
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
  color: #bfbfbf;

  &:hover {
    background: rgb(39, 40, 34);
  }

  &.active {
    background: #434343;
    color: #00a5e3;
  }
}
</style>
