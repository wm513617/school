<template>
  <div id="doorPlaybackModal">
    <bs-video :pluginCOM="plugin" :count="4" :styles="styles" @dblclick="switchStyle" @update:state="updateState" ref="bsvideo"></bs-video>
    <div class='videoPart'>
      <div class='operaVideo'>
        <i title='播放' v-show='!state.isPlay' class='icon iconfont icon-play' @click='videoPlay'></i>
        <i title='暂停' v-show='state.isPlay' class='icon iconfont icon-pause' @click='videoPause'></i>
        <i title='停止' class='icon iconfont icon-stop' @click='videoStop'></i>
        <i title='截图' class='icon iconfont icon-screenshot' @click='videoScreenshot'></i>
        <i title='下载' class='icon iconfont icon-download' @click='videoDownLoad'></i>
        <i title='音量' class='icon iconfont icon-volume' @click="videoVolume"></i>
        <div v-if="state.isVolumeOpen" style='width:100px;display:inline-block;vertical-align:top'>
          <Slider color="#20a1ff" :size="100" :minValue="0" @on-change="setVolume" :value="state.volumeValue" style='margin-top: 5px;'>
          </Slider>
        </div>
      </div>
    </div>
    <playbackProgress :allTime="allTime" :disabled="dis" :value="pvalue" @on-mousedown="clearTimer" @on-mouseup="!dis&&startTimer()" @on-change="jumpPlay" style="width: 680px;margin-left:10px"></playbackProgress>
  </div>
</template>
<script>
import plugin from 'components/video/new/plugin.vue'
import playbackProgress from 'components/video/PlaybackProgress.vue'
import query from './query.js'
let videoPlugin
export default {
  components: {
    playbackProgress
  },
  mixins: [query],
  props: {
    videos: {
      default: () => {
        const s = []
        s.push({
          startTime: 1521425648,
          endTime: 1521428250,
          dsIp: '192.168.14.88',
          dsPort: 0,
          strmInfo: {
            ch: 1,
            ip: 3232239210,
            devType: 0,
            pType: 0,
            mType: 1,
            cStrName: '',
            mac: '',
            resolution: 0,
            port: 3721,
            sType: 1
          }
        })
        return s
      }
    }
  },
  data() {
    const styleLarge = {
      width: '680px',
      height: '580px',
      left: '10px',
      top: 0
    }
    const styleSmall = {
      width: '240px',
      height: '180px',
      right: '10px'
    }
    return {
      plugin,
      modelShow: false,
      pvalue: 0,
      videosCopy: [],
      videosTimeinfo: [],
      state: {
        isPlay: false,
        isStopped: true,
        isVolumeOpen: false,
        volumeValue: 0
      },
      styles: [
        styleLarge,
        {
          ...styleSmall,
          top: 0
        },
        {
          ...styleSmall,
          top: '200px'
        },
        {
          ...styleSmall,
          bottom: 0
        }
      ],
      mainIndex: 0,
      curTime: 0
    }
  },
  computed: {
    allTime() {
      return (this.eTime - this.sTime) * 1000
    },
    mainParam() {
      return this.videosCopy[this.mainIndex] || {}
    },
    mainInfoParam() {
      return this.videosTimeinfo[this.mainIndex] || {}
    },
    dis() {
      return this.state.isStopped
    },
    sTime() {
      return this.mainInfoParam.startTime || 0
    },
    eTime() {
      return this.mainInfoParam.endTime || 0
    }
  },
  watch: {
    curTime(t) {
      const pvalue = t - this.sTime * 1000
      this.pvalue = pvalue < 0 ? this.jumpValue || 0 : pvalue
    }
  },
  methods: {
    switchStyle(index) {
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
    videoPlay() {
      if (!this.state.isStopped) {
        videoPlugin.videoResume()
      } else {
        if (this.mainParam.strmInfo) {
          videoPlugin.videoPlay(this.mainParam)
          this.startTimer()
        }
      }
    },
    videoPause() {
      videoPlugin.videoPause()
    },
    videoStop() {
      videoPlugin.videoStop()
      this.resetVideo()
    },
    videoScreenshot() {
      videoPlugin.videoScreenshot()
    },
    videoDownLoad() {
      videoPlugin.videoDownLoad(this.mainParam)
    },
    videoVolume() {
      videoPlugin.videoVolume()
    },
    startTimer() {
      this.clearTimer()
      this.timer = setInterval(() => {
        if (!this.mainInfoParam.startTime) {
          this.curTime = 0
        } else {
          let t = videoPlugin.getPlayerCurTime()
          if (t) {
            t = JSON.parse(t)
            if (t.success) {
              this.curTime = t.msCur
            }
          }
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
    },
    jumpPlay(v) {
      this.mainParam.startTime = this.sTime + parseInt(v / 1000)
      this.state.isStopped = true
      this.videoPlay()
      this.state.isStopped = false
    },
    resetVideo() {
      this.pvalue = 0
      this.mainParam.startTime = this.mainInfoParam.startTime
    },
    updateState(index, s) {
      if (index === this.mainIndex) {
        Object.assign(this.state, s)
      }
    },
    setVolume(v) {
      videoPlugin.setVolume(v)
    }
  },
  mounted() {
    videoPlugin = this.getPlugin(0)
  },
  beforeDestroy() {
    this.clearTimer()
    videoPlugin = null
  }
}
</script>
<style>
.videoPart {
  margin: 10px;
  margin-bottom: 0;
}
.videoPart .operaVideo .iconfont {
  font-size: 24px;
  display: inline-block;
  margin: 0px 15px 0px 0px;
  cursor: pointer;
}
#doorPlaybackModal .bs-video {
  position: relative;
  height: 580px;
}
#doorPlaybackModal .bs-video-single {
  position: absolute;
  background: rgb(64, 64, 64);
}
</style>
