<!--手机单兵回放-->
<template>
  <div class="pawn-back">
    <SimplePlaybackPlugin ref="frame" @on-dblclick="fullscreen"></SimplePlaybackPlugin>
    <div class="btn-con process-bar">
      <PlaybackProgress :disabled="noPlay" :value="pvalue" :allTime="allTime" @on-mousedown="clearTimer" @on-mouseup="!noPlay&&startTimer()" @on-change="jumpPlay">
      </PlaybackProgress>
    </div>
    <div class="btn-con">
      <button @click="phoneBackPlay()" :class="['iconfont', playState.isPlay? 'icon-pause': 'icon-play']"></button>
      <button @click="stop" class="iconfont icon-stop"></button>
      <button :class="['iconfont', 'icon-xiazai', isDown?'btn-con-disabled':'']" @click="download"></button>
      <div @mouseenter="showVolume = true" @mouseleave="showVolume = false" class="set-volume">
        <button @click="playState.isVolumeOpen? closeSound(): openSound()" :class="['iconfont', playState.isVolumeOpen? 'icon-mute': 'icon-volume']"></button>
        <div class="slider-box" :style="{bottom: (showVolume || isDragging)&&playState.isVolumeOpen? '-16px': '-9999px' }">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!playState.isVolumeOpen" v-model="volume">
          </slider>
        </div>
      </div>
      <button @click="getCapture" class="iconfont icon-b_icon__screenshot"></button>
      <button @click="fullscreen" class="iconfont icon-full-screen"></button>
    </div>
  </div>
</template>
<script>
/**
 * videoParam 回放视频的参数,包含name、sn、startTime、dsId、webName
 */
import Slider from 'components/Slider'
import SimplePlaybackPlugin from 'components/video/SimplePlaybackPlugin'
import PlaybackProgress from 'components/video/PlaybackProgress'
import { mapActions } from 'vuex'
let timer = null
export default {
  components: {
    SimplePlaybackPlugin,
    PlaybackProgress,
    Slider
  },
  props: {
    videoParam: {
      type: Object,
      required: true,
      default: () => {
        return {
          name: '',
          sn: '',
          startTime: 0,
          dsId: '',
          webName: ''
        }
      }
    }
  },
  data() {
    return {
      playState: {
        isPlay: false, // 播放\停止 状态
        isVolumeOpen: false,
        isStopped: true // 播放\停止 状态
      },
      dsIp: null,
      pvalue: 0,
      curTime: 0,
      eTime: 0,
      sTime: 0,
      showVolume: false,
      isDragging: false,
      volume: 50,
      playParam: null,
      downList: null,
      isDown: false
    }
  },
  computed: {
    noPlay() {
      return this.playState.isStopped
    },
    allTime() {
      return (this.eTime - this.sTime) * 1000
    }
  },
  watch: {
    curTime(t) {
      const pvalue = t - this.sTime * 1000
      this.pvalue = pvalue < 0 ? this.jumpValue || 0 : pvalue
    },
    pvalue(p) {
      if (p && this.allTime && p >= this.allTime) {
        this.stop()
      }
    },
    'playState.volumeValue'(v) {
      this.volume = v
    }
  },
  methods: {
    ...mapActions(['queryRecord', 'recordDump']),
    searchRecord() {
      console.log(this.videoParam, 'phonequery')
      if (!this.videoParam.name) {
        this.showErr('查询无录像！')
        return
      }
      const param = {
        appName: this.videoParam.name,
        webName: this.videoParam.webName,
        sn: this.videoParam.sn,
        dsId: this.videoParam.dsId,
        startTime: this.videoParam.startTime,
        endTime: parseInt(this.videoParam.startTime) + 600, // start + 10min
        page: 1,
        rows: 50
      }
      this.queryRecord(param).then((res) => {
        console.log(res)
        if (!res.total) {
          this.showErr('查询无录像！')
          return
        }
        this.downList = res.eventList // 存储数据用于下载
        this.dsIp = res.dsIp
        // 回放开始时间，结束时间修改为查询到的第一条录像的时间
        // const startArr = []
        // const endArr = []
        // for (let i = 0; i < res.eventList.length; i++) {
        //   startArr.push(res.eventList[i].evtTblInfo.startTime)
        //   endArr.push(res.eventList[i].evtTblInfo.endTime)
        // }
        // this.sTime = Math.min.apply(null, startArr)
        // this.eTime = Math.max.apply(null, endArr)

        if (res.eventList[0]) {
          this.sTime = res.eventList[0].evtTblInfo.startTime
          this.eTime = res.eventList[0].evtTblInfo.endTime
        }

        const obj = {
          eventList: {
            timeInfo: {
              startTime: this.sTime,
              endTime: this.eTime
            },
            strmInfo: {
              ...res.eventList[0].strmInfo,
              name: param.name,
              sn: param.sn
            }
          }
        }
        this.playParam = {
          ip: res.dsIp,
          port: res.dsPort + '',
          beginTime: this.sTime + '',
          endTime: this.eTime + '',
          cmdStr: {
            params: {
              jsonrpc: '2.0',
              id: '1',
              method: 'brest',
              call: 'AV.Record.playopen',
              args: obj
            }
          }
        }
        this.pawnPlay(this.playParam)
      }).catch((err) => {
        console.log(err, '单兵回放')
        this.showErr('录像查询失败！')
      })
    },
    async pawnPlay(param) {
      const state = await this.plugin.pawnOpen(param)
      if (!state) {
        this.showErr('回放录像失败！')
      } else {
        this.startTimer()
        this.playState.isPlay = true
        this.playState.isStopped = false
      }
    },
    stop() {
      this.plugin.close()
      this.playState.isPlay = false
      this.playState.isStopped = true
      this.playState.isVolumeOpen = false
      this.clearTimer()
      this.pvalue = 0
      this.$nextTick(() => {
        this.sTime = this.eTime = 0
        this.jumpValue = 0
      })
    },
    phoneBackPlay() {
      if (this.noPlay) {
        this.playParam.beginTime = this.sTime
        this.pawnPlay(this.playParam)
      } else if (this.playState.isPlay) {
        this.pause()
      } else {
        this.resume()
      }
    },
    resume() { // 恢复播放
      if (!this.noPlay) {
        this.plugin.resume()
        this.playState.isPlay = true
      }
    },
    pause() { // 暂停
      if (!this.noPlay) {
        this.plugin.pause()
        this.playState.isPlay = false
      }
    },
    getCapture() {
      if (!this.noPlay) {
        const state = this.plugin.getCapture()
        if (state === 0) {
          this.successMsg('保存成功')
        } else if (state !== 1) {
          this.errorMsg('保存失败')
          console.log('save error state', state)
        }
      }
    },
    fullscreen() {
      if (!this.noPlay) {
        if (this.plugin.isFullscreen) {
          this.plugin.cancelFullscreen()
        } else {
          this.plugin.fullScreen()
        }
      }
    },
    openSound() {
      if (!this.noPlay) {
        this.plugin.openSound()
        this.setVolume(50)
        this.playState.isVolumeOpen = true
      }
    },
    closeSound() {
      if (!this.noPlay) {
        this.plugin.closeSound()
        this.playState.isVolumeOpen = false
      }
    },
    showErr(msg) {
      this.$Notice.error({
        title: '错误',
        desc: msg,
        duration: 3
      })
    },
    startTimer() {
      this.clearTimer()
      timer = setInterval(() => {
        let t = this.plugin.getPlayerCurTime()
        if (t > 0) {
          this.curTime = t
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(timer)
    },
    jumpPlay(v) {
      this.jumpValue = v
      this.playParam.beginTime = this.sTime + parseInt(v / 1000)
      this.plugin.pawnOpen(this.playParam)
      console.log('视频跳转播放', this.plugin.pawnOpen(this.playParam))
      this.startTimer()
      this.dragHook()
    },
    dragHook() {
      if (this.playState.isVolumeOpen) {
        this.openSound()
      }
    },
    setVolume(v) {
      if (!this.playState.isPlay) { return }
      this.plugin.setVolume(v)
      this.volume = v
    },
    download() {
      if (this.playState.isStopped) {
        return
      }
      if (!this.isDown) {
        this.isDown = true
        const type = 'bsr'
        const file = this.strFilter[type]
        const path = this.plugin.getSaveFilePath(type, file)
        if (typeof path !== 'number') {
          for (let i = 0; i < this.downList.length; i++) {
            this.dw(this.downList[i], path + String(i))
          }
        }
      }
    },
    dw(downParam, path) {
      const obj = {
        eventList: {
          timeInfo: {
            startTime: downParam.evtTblInfo.startTime,
            endTime: downParam.evtTblInfo.endTime
          },
          strmInfo: {
            ...downParam.strmInfo,
            name: this.videoParam.name,
            sn: this.videoParam.sn
          }
        }
      }
      let param = {
        ip: this.dsIp + '',
        port: 9000 + '',
        fileName: path,
        beginTime: downParam.evtTblInfo.startTime + '',
        endTime: downParam.evtTblInfo.endTime + '',
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
      this.recordDump(param)
    }
  },
  async mounted() {
    await this.$nextTick()
    this.plugin = this.$refs.frame
    this.searchRecord()
  },
  beforeDestroy() {
    if (!this.noPlay) {
      this.stop()
    }
    this.clearTimer()
  }
}
</script>
<style lang="less" scoped>
.btn-con {
  line-height: 30px;
  height: 30px;
  float: right;
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
.btn-con-disabled {
  line-height: 30px;
  height: 30px;
  button {
    border: 0 none;
    background: transparent;
    color: #cacaca;
    padding: 0 5px;
    outline: 0 none;
    cursor: default;
  }
}
.pawn-back {
  width: 100%;
  height: 100%;
}

.list-ui li {
  padding: 6px 8px;
  cursor: pointer;
  user-select: none;
  color: #bfbfbf;
  &:hover {
    background: #20365c;
  }
  &.active {
    background: #2a436a;
    color: #00a5e3;
  }
}

.set-volume {
  display: inline-block;
  position: relative;
  .slider-box {
    position: absolute;
    width: 90px;
    display: inline-block;
    left: -50%;
    .bsr-slider-horizontal {
      padding: 0 12px;
      line-height: 20px;
    }
  }
}
.process-bar {
  display: inline-block;
  width: 100%;
  overflow: hidden;
}
</style>
