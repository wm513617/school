<template>
  <div>
    <bs-video class="frame-con" :style="{height: frameHeight}" :count="7" :showNum="showscreen" :styles="styles" :pluginCOM="AlarmPlaybackPlugin" @update:activedVM="activedVMChange" @exchange="exchangeStyle" ref="frame" @dblclickEvent="dblclickEvent" @emergencyPlan="emergencyPlan"></bs-video>

    <div class="theme-title" style="padding: 10px">
      <!-- <button class="theme-btn tv-btn" @click="speech">{{isSpeech? '关闭对讲': '开启对讲'}}</button> -->
      <button class="theme-btn tv-btn" @click="getCapture">截图</button>
      <button class="theme-btn tv-btn" @click="outputControl">输出控制</button>
      <!-- <button class="theme-btn tv-btn" @click="fullscreen">全屏</button> -->
      <button v-if="false" class="theme-btn tv-btn">处理流程</button>
      <button class="theme-btn tv-btn" @click="toggleViewBtn">返回接警模式</button>
      <div @mouseenter="showVolume = true" @mouseleave="showVolume = false" style="float:right;display:flex;align-items:center">
        <div style="margin:0 8px;font-size:20px;" class="realbtn iconfont" :class="[!state.isPlay ? 'disable': '', !state.isVolumeOpen ? 'icon-mute': 'icon-volume']" title="音量"  @click="soundOpen"></div>
        <div style="width:120px" :style="{opacity: (showVolume||isDragging)&&state.isPlay?1:0 }">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!state.isVolumeOpen" v-model="state.volumeValue">
          </slider>
        </div>
      </div>
      <div style="float:right;font-size:20px;margin:0 8px;" class="realbtn iconfont" :class="[state.isPlay&&state.isPreview&&!patrolVideoStatus()? '': 'disable', !state.isSpeech ? 'icon-shipinleiduijiangjinyong' : 'icon-shipinlei-duijiang']" title="对讲" @click="intercomClick()">
      </div>
    </div>
    <div style="position: relative;">
      <!-- <Timeline :recordInfo="recordInfo" :value="timelineValue" :canForward="false" @forwardTop="handleDragTop" @ondrag="handleDrag" ref="timeline"></Timeline> -->
      <Timeline v-model="timelineValue" :disabled="false" :recordInfo="recordInfo" @forwardTop="handleDragTop"  @ondrag="handleDrag"  @mouseDown="stopTimer" ref="timeline"></Timeline>
    </div>
  </div>
</template>
<script>
import Slider from 'components/Slider'
import AlarmPlaybackPlugin from './AlarmPlaybackPlugin'
import Timeline from 'components/timeLine'
import { mapState, mapActions } from 'vuex'
import { AV_RECORD_LIST } from 'http/video.api'
export default {
  components: {
    Timeline,
    Slider
  },
  props: {
    toggleView: {
      type: Boolean
    }
  },
  data() {
    return {
      // 输出控制入参
      outputColPrams: {
        devInfo: {
          devIp: '127.0.0.1',
          devPort: 80
        },
        outputList: []
      },
      AlarmPlaybackPlugin,
      mainIndex: 0,
      isPreview: true,
      styles: [
        {
          left: 0,
          top: 0,
          width: '75%',
          height: '66.6%',
          position: 'absolute'
        },
        {
          left: '75%',
          top: 0,
          width: '25%',
          height: '33.3%',
          position: 'absolute'
        },
        {
          left: '75%',
          top: '33.3%',
          width: '25%',
          height: '33.3%',
          position: 'absolute'
        },
        {
          left: 0,
          bottom: '0.1%',
          height: '33.3%',
          width: '25%',
          position: 'absolute'
        },
        {
          left: '25%',
          bottom: '0.1%',
          width: '25%',
          height: '33.3%',
          position: 'absolute'
        },
        {
          left: '50%',
          bottom: '0.1%',
          width: '25%',
          height: '33.3%',
          position: 'absolute'
        },
        {
          left: '75%',
          bottom: '0.1%',
          width: '25%',
          height: '33.3%',
          position: 'absolute'
        }
      ],
      // frameHeight: '700px',
      recordInfo: [],
      timelineValue: (() => {
        const d = new Date()
        d.setHours(12)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
      })(),
      allPlugin: true,
      videoParams: [],
      isSpeech: false,
      showVolume: false,
      state: {
        isPlay: false, // 正在播放
        isStopped: true, // 播放完毕
        isBoost: false, // 鸟瞰状态
        isVolumeOpen: false, // 伴音
        isPreview: true, // 是否预览
        isSpeech: false, // 对讲
        isFullScreen: false, // 全屏
        volumeValue: 0, // 音量
        streamType: 'main',
        speed: '1',
        scale: '自适应',
        streamId: '' // 标记下联设备，记录信息为：下联回放开流id/下联预览shareServer
      },
      isDragging: false,
      activedIndex: -1,
      showscreen: 7,
      oldStyles: [],
      screenHeight: document.body.clientHeight // 监听屏幕比例变化
    }
  },
  computed: {
    ...mapState({
      activeAllWarnInfo: ({ warningDispose }) => warningDispose.activeWarnInfo,
      activeFireAlarmInfo: ({ firecontrol }) => firecontrol.activeWarnInfo,
      alarmPageData: ({ warningDispose }) => warningDispose.alarmPageData
    }),
    frames() {
      return this.$refs.frame
    },
    frameHeight() {
      return this.screenHeight > 700 ? this.screenHeight - 360 + 'px' : '340px'
    },
    activeWarnInfo() {
      if (this.alarmPageData === 'alarmPage') {
        return this.activeAllWarnInfo
      } else {
        return this.activeFireAlarmInfo
      }
    }
  },
  watch: {
    toggleView(d) {
      if (!d) {
        this.closeAll()
      } else {
        this.openAllPreview()
        this.resizeTimeline()
        // this.$nextTick(() => {
        //   this.setHeight()
        // })
      }
    },
    activeWarnInfo() {
      this.closeAll(true)
      if (this.toggleView) {
        this.isPreview = true
        this.openAllPreview()
      }
    }
  },
  methods: {
    ...mapActions(['outputCol', 'getSingleResource']),
    /**
     * 输出控制
     */
    outputControl() {
      console.log(this.activeWarnInfo, 'activeWarnInfo')
      this.outputColPrams.devInfo.devIp = this.activeWarnInfo.devIp
      this.outputColPrams.devInfo.devPort = this.activeWarnInfo.devPort
      if (!this.activeWarnInfo.actionOutCtl) {
        return
      }
      for (let i = 0; i < this.activeWarnInfo.actionOutCtl.length; i++) {
        console.log(this.activeWarnInfo.actionOutCtl[i], 'actionOutCtl')
        let obj = {}
        if (this.activeWarnInfo.actionOutCtl[i].runMode === 1) {
          // 自动 反状态
          obj = {
            outputNo: this.activeWarnInfo.actionOutCtl[i].channel,
            status: !this.activeWarnInfo.actionOutCtl[i].runAction ? 'off' : 'on'
          }
        } else {
          // 手动动 先本状态 再反状态
          obj = {
            outputNo: this.activeWarnInfo.actionOutCtl[i].channel,
            status: this.activeWarnInfo.actionOutCtl[i].runAction ? 'off' : 'on'
          }
        }
        this.outputColPrams.outputList.push(obj)
      }
      console.log(this.outputColPrams, 'this.outputColPrams')
      this.outputCol(this.outputColPrams)
        .then(suc => {
          this.successMsg('添加成功')
        })
        .catch(err => {
          this.errorMsg('添加失败！' + err.response.data.message)
          console.log('outputCol error: ' + err)
        })
    },
    resizeTimeline() {
      this.$nextTick(() => {
        this.$refs.timeline.resizefun()
      })
    },
    exchangeStyle(index) {
      const s = this.styles[this.mainIndex]
      this.styles[this.mainIndex] = this.styles[index]
      this.styles[index] = s
      this.mainIndex = index
      Array(7)
        .fill()
        .forEach((_, i) => {
          this.frames.getCOM(i).setMainIndex(index)
        })
    },
    closeVideo(p) {
      if (p.uid === this.activeWarnInfo.groupId || p.uniqueId === this.activeWarnInfo.groupId) {
        this.closeAll(true)
        // this.stopTimer()
        this.$emit('update:toggleView', false)
      }
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
    getTimelineInfo() {
      let info
      if (this.activeWarnInfo.action) {
        info = this.$lodash.find(this.activeWarnInfo.action, item => item.mainCamera)
      } else {
        info = this.$lodash.find(this.activeWarnInfo.actionList, item => item.main)
      }
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
          } else {
            timelineinfo.eventVideo.push({
              start: new Date().getTime() - 1000,
              end: new Date().getTime() + 1000
            })
          }
          this.$set(this.recordInfo, 0, timelineinfo)
          resolve()
        })
      })
    },
    startTimer(type) {
      // const infos = this.recordInfo[0].eventVideo.length ? this.recordInfo[0].eventVideo : this.recordInfo[0].timedVideo
      const infos = this.recordInfo[0].eventVideo
      let info = []
      if (infos.length) {
        info = infos[infos.length - 1]
      }
      this.stopTimer()
      this.timer = setInterval(() => {
        if (this.isPreview) {
          info.end = new Date().getTime()
          this.$refs.timeline.chengeTime(info.end)
        }
      }, 1000)
    },
    getTimeValue(type) {
      if (type === 'preview') {
        return new Date().getTime()
      } else {
        if (this.videoParams[this.mainIndex].url && this.videoParams[this.mainIndex].url.length > 0) {
          if (this.videoParams[this.mainIndex + 1]) {
            return this.frames.getCOM(this.mainIndex + 1).getPlayerCurTime()
          } else {
            return -1
          }
        } else {
          return this.frames.getCOM(this.mainIndex).getPlayerCurTime()
        }
      }
    },
    stopTimer() {
      clearInterval(this.timer)
    },
    _handleDrag(value) {
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
    _handleDragTop() {
      this.timerStart = new Date().getTime()
      this.videoParams.forEach((info, index) => {
        if (info) {
          this.changeToPreview(index)
        }
      })
      this.isPreview = true
      this.startTimer('preview')
    },
    closeAll(isDestroyPlugin) {
      Array(7)
        .fill()
        .forEach((_, index) => {
          this.frames.getCOM(index).close(isDestroyPlugin)
        })
      this.stopTimer()
      this.recordInfo = []
      this.timelineValue = new Date().getTime()
    },
    changeToPlayback(frameIndex, timeValue) {
      const param = this.videoParams[frameIndex].queryResult
      if (!param || !param.eventList.length) {
        return
      }
      if (this.videoParams[frameIndex].url && this.videoParams[frameIndex].url.length > 0) {
        return
      }
      this.openPlayback(frameIndex, {
        startTime: parseInt(timeValue),
        endTime: parseInt(new Date().getTime() / 1000),
        dsIp: param.dsIp,
        strmInfo: param.eventList[0].strmInfo
      })
      this.stopTimer()
      this.timer = setInterval(() => {
        let t = this.getTimeValue('record')
        if (t > 0) {
          // this.timelineValue = t
          this.$refs.timeline.chengeTime(t)
        }
      }, 1000)
    },
    changeToPreview(frameIndex) {
      const info = this.videoParams[frameIndex]
      if (info.url && info.url.length > 0) {
        return
      }
      this.openPreview(frameIndex, {
        id: '',
        type: 'video',
        ip: info.devIp,
        port: info.devPort,
        channel: info.channel,
        vendor: info.manufacturer,
        streamType: info.streamType
      })
    },
    async openInfo(index, info) {
      console.log(info, 'info9999')
      this.$set(this.videoParams, index, info)
      const warnInfo = this.activeWarnInfo
      let cameraType = '' // 镜头类型
      let cameraName = '' // 镜头名称
      let cameraStream = '' // 镜头码流
      if (info.channelId) {
        await this.getSingleResource(info.channelId)
          .then(res => {
            cameraType = res.monitortype
            cameraName = res.name
            cameraStream = res.stream
          })
          .catch(err => {
            console.log(err, 'err')
          })
      }
      let imgUrl = ''
      let videoUrl = ''
      if (info.message) {
        imgUrl = info.url
        if (info.message.video) {
          videoUrl = info.message.video
        }
      }
      console.log(warnInfo, 'warnInfo9999')
      return this.openPreview(index, {
        id: info.channelId || '',
        type: 'video',
        ip: info.devIp || '',
        port: info.devPort || '',
        channel: info.channel || '',
        vendor: info.manufacturer || '',
        streamType: cameraStream || 'main',
        monitorType: cameraType,
        cameraName: cameraName,
        uid: warnInfo.uid || warnInfo.groupId,
        alarmName: warnInfo.name || warnInfo.title || '',
        level: warnInfo.level || 1,
        eventType: warnInfo.eventType,
        time: warnInfo.time,
        url: imgUrl || warnInfo.photo,
        video: videoUrl || warnInfo.video,
        uniqueId: warnInfo.uniqueId || '',
        sn: warnInfo.sn || '',
        realname: warnInfo.realname || ''
      })
    },
    openPreview(index, param) {
      this.frames.getCOM(index).openPreview(param)
    },
    closePreview(index) {
      this.frames.getCOM(index).close()
    },
    openPlayback(index, param) {
      this.frames.getCOM(index).openPlayback(param)
    },
    closePlayback(index) {
      this.closePreview(index)
    },
    async _openAllPreview() {
      this.closeAll(false)
      let info = this.activeWarnInfo
      let main
      if (info.action) {
        main = this.$lodash.find(info.action, item => item.mainCamera)
      } else {
        main = this.$lodash.find(info.actionList, item => item.main && item.client)
      }
      if (info.eventType === 'patrol' || info.eventType === 'patrolAlarm') {
        if ((info.url && info.url.length > 0) || info.video) {
          this.openInfo(this.mainIndex, info)
          // await this.getTimelineInfo()
          return
        }
      } else if (info.eventType === 'individualAlarm' || info.eventType === 'soldier') {
        this.openInfo(this.mainIndex, info)
        // await this.getTimelineInfo()
        return
      }
      if (!main && !info.url) {
        this.closeAll(true)
        return
      }
      let addIndex = 0
      if (info.url && info.url.length > 0) {
        this.openInfo(this.mainIndex, info)
        addIndex++
      }
      this.openInfo(addIndex, main)
      await this.getTimelineInfo()
      if (info.actionList && info.actionList.length) {
        info.actionList
          .filter(v => !v.main && v.client)
          .forEach((item, index) => {
            if (index === this.mainIndex) {
              addIndex++
            }
            this.openInfo(index + addIndex, item)
            this.queryInfo(index + addIndex, item)
          })
      }
      if (info.action && info.action.length) {
        info.action
          .filter(v => !v.mainCamera)
          .forEach((item, index) => {
            if (index === this.mainIndex) {
              addIndex++
            }
            this.openInfo(index + addIndex, item)
            this.queryInfo(index + addIndex, item)
          })
      }
      this.startTimer('preview')
    },
    // fullscreen() {
    //   this.frames.getCOM(this.mainIndex).fullscreen()
    // },
    getCapture() {
      this.frames.getCOM(this.activedIndex).getCapture()
    },
    // speech() {
    //   if (this.isSpeech) {
    //     this.frames.getCOM(this.mainIndex).stopSpeech()
    //     this.frames.getCOM(this.mainIndex).closeSpeech()
    //   } else {
    //     const info = this.videoParams[this.mainIndex]
    //     this.frames.getCOM(this.mainIndex).openSpeechEx({
    //       id: '',
    //       type: 'video',
    //       ip: info.devIp,
    //       port: info.devPort,
    //       channel: info.channel,
    //       vendor: info.manufacturer,
    //       streamType: info.streamType
    //     })
    //   }
    // },
    // setHeight() {
    //   this.frameHeight = this.$el.querySelector('.frame-con').clientWidth / 1100 * 600 + 'px'
    // },
    closeAllVolume() {
      // 关闭7个插件的伴音
      Array(7)
        .fill()
        .forEach((_, index) => {
          this.frames.getCOM(index).closeSound()
        })
    },
    closeAllSpeech() {
      // 关闭7个插件的对讲
      Array(7)
        .fill()
        .forEach((_, index) => {
          this.frames.getCOM(index).closeSpeech()
        })
    },
    soundOpen() {
      if (this.state.isVolumeOpen) {
        this.frames.getCOM(this.activedIndex).closeSound()
      } else {
        this.frames.getCOM(this.activedIndex).openSound()
      }
    },
    setVolume(v) {
      // 设置音量
      if (!this.state.isPlay) {
        return
      }
      this.frames.getCOM(this.activedIndex).setVolume(v)
    },
    activedVMChange(v) {
      this.activedIndex = v.index
      this.state = v.pluginState
    },
    intercomClick() {
      // 点击对讲按钮
      if (!this.state.isPlay || !this.state.isPreview || this.patrolVideoStatus()) {
        return
      }
      if (this.state.isSpeech) {
        this.frames.getCOM(this.activedIndex).stopSpeech()
        this.frames.getCOM(this.activedIndex).closeSpeech()
        this.frames.getCOM(this.activedIndex).closeSound()
      } else {
        this.closeAllVolume()
        this.closeAllSpeech()
        this.frames.getCOM(this.activedIndex).openSpeechEx()
      }
    },
    dblclickEvent(index) {
      if (this.showscreen !== 1) {
        this.oldStyles = JSON.parse(JSON.stringify(this.styles))
        this.styles.forEach((item, idx) => {
          if (idx === index) {
            ;(item.left = '0px'), (item.top = '0px'), (item.width = '100%'), (item.height = '100%')
          } else {
            ;(item.left = '99999px'), (item.top = '99999px'), (item.width = '0%'), (item.height = '0%')
          }
        })
        this.showscreen = 1
      } else {
        this.styles = JSON.parse(JSON.stringify(this.oldStyles))
        this.showscreen = 7
      }
    },
    toggleViewBtn() {
      this.$emit('update:toggleView', false)
      this.styles = JSON.parse(JSON.stringify(this.oldStyles))
      this.showscreen = 7
    },
    emergencyPlan(v) {
      this.$emit('emergencyPlan', v)
    },
    patrolVideoStatus() {
      return this.$refs.frame.$children[this.activedIndex].isShowVideo
    }
  },
  created() {
    this.openAllPreview = this.$lodash.debounce(this._openAllPreview.bind(this), 100)
    this.handleDragTop = this.$lodash.debounce(this._handleDragTop.bind(this), 500)
    this.handleDrag = this.$lodash.debounce(this._handleDrag.bind(this), 100)
    this.oldStyles = JSON.parse(JSON.stringify(this.styles))
  },
  mounted() {
    // this.setHeight()
    this.resizeFn = () => {
      return (() => {
        window.screenHeight = document.body.clientHeight
        this.screenHeight = window.screenHeight
      })()
    }
    window.addEventListener('resize', this.resizeFn)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.closeAll(true)
    this.openAllPreview = null
    this.handleDragTop = null
    this.handleDrag = null
    window.removeEventListener('resize', this.resizeFn)
    this.resizeFn = null
  }
}
</script>
<style scoped lang="less">
.frame-con {
  height: 700px;
  position: relative;
}

.frame {
  position: absolute;
}

.tv-btn {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 5px;
  border: 1px solid transparent;
}

iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  border: 0 none;
}

.btn-con {
  position: absolute;
  right: 1px;
  left: 1px;
  bottom: 1px;
  background: #000;
  padding-right: 5px;
  text-align: right;

  i {
    font-size: 20px;
    position: relative;
    cursor: pointer;

    &:hover {
      color: #00a5e3;
    }
  }
}

.theme-btn {
  border: 1px solid #00a5e3;
  background: #00a5e3;
  color: #fff;

  &:hover {
    background: #44add5;
  }
}
.theme-title {
  .realbtn:hover {
    cursor: pointer;
    color: #fda548;
  }
  .realbtn:active {
    color: #c47019;
  }
  .disable {
    color: #9298a4;
    cursor: not-allowed;

    &:hover {
      color: #9298a4;
      cursor: not-allowed;
    }
  }
}
.playback-div {
  height: 100%;
}
</style>
