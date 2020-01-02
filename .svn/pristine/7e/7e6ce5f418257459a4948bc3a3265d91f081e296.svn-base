<template>
  <div style="height: 100%">
    <SimplePlaybackPlugin :style="{'height': videoHeight + 'px'}" ref="frame"></SimplePlaybackPlugin>
    <div class="relative">
      <div class="iconc">
        <i class="icon iconfont" :class="{'icon-play': !state.isPlay, 'icon-pause': state.isPlay}" :title="state.isPlay? '暂停':'播放'" @click="state.isPlay?pause():play()"></i>
      </div>
      <div style="margin-left:30px;width:50%;display: inline-block;">
        <PlaybackProgress :value="pvalue" :allTime="allTime" :disabled="dis" @on-mousedown="clearTimer" @on-mouseup="!dis&&startTimer()" @on-change="jumpPlay">
        </PlaybackProgress>
      </div>
      <div class="setVolume" style="margin-left:5px">
        <i class="icon iconfont icon-full-screen" :title="state.isVolumeOpen? '静音': '声音'" :class="[!state.isVolumeOpen ? 'icon-mute': 'icon-volume']" @click="state.isVolumeOpen? closeSound(): openSound()"></i>
        <div class="slider-box" :style="{bottom: '-26px', opacity: state.isPlay && state.isVolumeOpen? 1: 0}">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!state.isVolumeOpen" v-model="volume">
          </slider>
        </div>
      </div>
      <div class="iconc" style="right:60px;left:auto;" @click="screenshot">
        <i class="icon iconfont icon-screenshot" title="截图"></i>
      </div>
      <div class="iconc" :class="{'disabled': isDownload }" style="right:30px;left: auto;" @click="download">
        <i class="icon iconfont icon-xiazai" title="下载"></i>
      </div>
      <div class="iconc" style="right: 1px;left: auto;">
        <i class="icon iconfont icon-full-screen" title="全屏" @click="fullscreen"></i>
      </div>
    </div>
  </div>
</template>
<script>
import SimplePlaybackPlugin from 'components/video/SimplePlaybackPlugin'
import PlaybackProgress from 'components/video/PlaybackProgress'
import { mapState } from 'vuex'
import { AV_RECORD_LIST } from 'http/video.api'
import Slider from 'components/Slider'
export default {
  components: {
    SimplePlaybackPlugin,
    PlaybackProgress,
    Slider
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    videoHeight: {
      type: Number,
      default: 260
    }
  },
  data() {
    return {
      isDownload: false, // 下载状态
      startTime: 0,
      endTime: 0,
      curTime: 0,
      pvalue: 0,
      jumpValue: 0,
      playId: '',
      state: {
        isPlay: false,
        isStopped: true,
        isVolumeOpen: false
      },
      showVolume: false,
      isDragging: false,
      volume: 50
    }
  },
  computed: {
    ...mapState({
      channel: ({ warningCount }) => warningCount.channel
    }),
    allTime() {
      return this.endTime - this.startTime
    },
    frame() {
      return this.$refs.frame
    },
    dis() {
      return this.state.isStopped
    }
  },
  watch: {
    open(o) {
      if (!o) {
        this.clearTimer()
        this.closePlay()
      } else {
        this.startOpen()
      }
    },
    pvalue() {
      if (this.pvalue >= this.allTime) {
        this.closePlay()
      }
    },
    curTime(t) {
      const pvalue = t - this.startTime
      this.pvalue = pvalue < 0 ? this.jumpValue || 0 : pvalue
    },
    channel() {
      this.startOpen()
    }
  },
  methods: {
    startOpen() {
      if (this.channel.channelId === this.playId) {
        return
      }
      this.closePlay()
      if (this.open && this.channel.record) {
        this.openPlay(this.channel.startTime - 2)
        this.startTime = this.channel.startTime * 1000
        this.endTime = this.channel.endTime * 1000
      } else {
        this.$Notice.warning({
          title: '提示',
          desc: '此通道无录像',
          duration: 5
        })
      }
    },
    async queryRecord() {
      // const power = await this.getCameraPower(this.channel.channelId)
      // if (!power || !power.includes('playbackDownload')) {
      //   this.$Notice.warning({ desc: `${this.channel.name || ''}没有权限！`, title: '警告' })
      //   return
      // }
      const t = this.channel
      return AV_RECORD_LIST({
        devIp: t.devIp,
        devPort: t.devPort,
        channel: t.channel,
        eventType: ['all'],
        typeName: '',
        typeContent: '',
        startTime: t.startTime,
        endTime: t.endTime,
        streamType: 'all',
        page: 1,
        rows: 50
      })
    },
    async openPlay(time) {
      this.playId = this.channel.channelId
      if (!this.record) {
        try {
          this.record = await this.queryRecord()
        } catch (e) {}
      }
      if (!this.record) {
        this.$Notice.error({
          title: '错误',
          desc: '录像参数获取失败',
          duration: 5
        })
        return
      } else if (!this.record.data.result.total) {
        this.$Notice.error({
          title: '错误',
          desc: '查询无此录像',
          duration: 5
        })
        return
      }
      const record = this.record.data.result
      const state = await this.frame.open({
        dsIp: record.dsIp,
        strmInfo: record.eventList[0].strmInfo,
        startTime: time,
        endTime: this.channel.endTime
      })
      if (state) {
        this.startTimer()
        this.state.isPlay = true
        this.state.isStopped = false
        if (this.state.isVolumeOpen) {
          this.openSound()
        }
      } else {
        this.errorMsg('开启回放失败')
      }
    },
    closePlay() {
      this.playId = ''
      this.frame.close()
      this.state.isPlay = false
      this.state.isStopped = true
      this.state.isVolumeOpen = false
      this.pvalue = 0
      this.jumpValue = 0
      this.record = null
    },
    jumpPlay(v) {
      this.jumpValue = v
      this.openPlay(parseInt((this.startTime + v) / 1000))
    },
    play() {
      if (this.state.isStopped) {
        this.openPlay(this.channel.startTime - 2)
      } else {
        this.startTimer()
        this.frame.resume()
        this.state.isPlay = true
      }
    },
    pause() {
      this.clearTimer()
      this.frame.pause()
      this.state.isPlay = false
    },
    getTimeInfo() {
      this.startTime = this.channel.startTime * 1000
      this.endTime = this.channel.endTime * 1000
    },
    startTimer() {
      this.clearTimer()
      this.timerHandler = setInterval(() => {
        if (!this.state.isPlay) {
          return
        }
        let t = this.frame.getPlayerCurTime()
        if (t > 0) {
          this.curTime = t
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timerHandler)
    },
    openSound() {
      if (this.dis) {
        return
      }
      this.frame.openSound()
      this.setVolume(this.volume || 50)
      this.state.isVolumeOpen = true
    },
    closeSound() {
      if (this.dis) {
        return
      }
      this.frame.closeSound()
      this.state.isVolumeOpen = false
    },
    setVolume(v) {
      if (!this.state.isPlay) {
        return
      }
      this.frame.setVolume(v)
      this.volume = v
    },
    fullscreen() {
      this.frame.fullScreen()
    },
    screenshot() {
      // 截图
      this.frame.getScreenshot()
    },
    download() {
      if (this.isDownload) { return } // 不让连续多次点下载
      this.isDownload = true
      // 下载
      const record = this.record.data.result
      let param = {
        dsIp: record.dsIp,
        strmInfo: record.eventList[0].strmInfo,
        startTime: this.channel.startTime,
        endTime: this.channel.endTime
      }
      this.frame.recordDump(param).then(res => {
        this.successMsg('下载完成!')
        this.isDownload = false
      }).catch(err => {
        this.errorMsg('下载失败!')
        this.isDownload = false
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.channel) {
        this.startOpen()
      }
    })
  },
  beforeDestroy() {
    this.clearTimer()
    this.closePlay()
  }
}
</script>
<style lang="less" scoped>
.relative {
  position: relative;
}

.iconc {
  position: absolute;
  left: 1px;
  top: 15px;

  i {
    font-size: 20px;
    cursor: pointer;
  }
}
.setVolume {
  display: inline-block;
  position: absolute;
  i {
    position: absolute;
    top: 11px;
    width: 30px;
    left: 1px;
    font-size: 20px;
    cursor: pointer;
  }
  .slider-box {
    position: absolute;
    width: 85px;
    display: inline-block;
    left: 16px;
    .bsr-slider-horizontal {
      padding: 0 10px;
      line-height: 20px;
    }
  }
}
.disabled {
  color: #747474 !important;
}
</style>
