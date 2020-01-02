<!--单兵视频通话-->
<template>
  <div class="video-call">
    <span v-if="!isPlaying  && !isLoading" class="icon iconfont icon-play" @click="openVideo"></span>
    <Spin v-if="isLoading" fix style="background-color:#1c3053">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
    <div class="plu-collter" :style="position">
      <div class="sing-plugin">
        <SimplePreviewPlugin ref="frame" @on-dblclick="fullscreen"></SimplePreviewPlugin>
      </div>
      <div class="btn-con">
        <span>{{hour}}:{{minute}}:{{second}}</span>
        <span class="icon iconfont icon-b_icon__screenshot" @click="getPicture" title="截图"></span>
        <span class="icon iconfont" :class="[openSound ? 'icon-volume' : 'icon-mute']" title="声音" @click="toggleSound"></span>
        <span class="icon iconfont icon-guaduan" title="挂断" @click="closeVideo"></span>
        <span class="icon iconfont icon-full-screen" @click="fullscreen" title="全屏"></span>
        <span :class="['icon', 'iconfont', isRecording? 'icon-videotape' : 'icon-videotape-stop']" :title="isRecording ? '关闭录像' : '开启录像'" @click="videoRecording"></span>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * id 巡更单兵的id,必须
 * uniqueId 单兵报警的id,预留
 * $emit('stopCalling') 挂断视频时的事件
 */
import SimplePreviewPlugin from 'components/video/SimplePreviewPlugin'
import { read } from '../../storage/index.js'
import alarm from 'src/socket/alarm.js'
import { getSocket } from 'src/socket/socket.js'

import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    SimplePreviewPlugin
  },
  props: {
    id: {
      type: [String, Number],
      require: true,
      default: ''
    },
    uniqueId: {
      type: [String, Number],
      default: ''
    },
    isPcToApp: { // true:平台发起对讲  false:app端发起对讲
      type: Boolean,
      default: true
    },
    isSingleAlarm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDisabled: false, // 挂断后延迟2s 才可继续开启对讲
      isLoading: false,
      soldierId: this.id,
      isPcToAppFlag: this.isPcToApp,
      isPlaying: false, // 是否正在视频通话
      isRecording: true, // 是否正在录像
      callInfo: null,
      canStart: true,
      connectInfo: null,
      openSound: true,
      recordId: '', // 创建的 单兵录像记录的id
      time: 0,
      hour: '00',
      minute: '00',
      second: '00',
      timerId: null,
      timeId: null
    }
  },
  computed: {
    ...mapGetters(['plugin']),
    plugin() {
      return this.$refs.frame
    },
    position() {
      if (this.isPlaying) {
        return {
          position: 'absolute',
          left: 0,
          top: 0
        }
      } else {
        return {
          position: 'absolute',
          left: '-9999px',
          top: '-9999px'
        }
      }
    }
  },
  methods: {
    ...mapActions(['getSinglePawnVideo', 'getSingleStream', 'stopSingleStream', 'startRecord', 'stopRecord', 'recordLog', 'getTalkbackStream', 'startTalkback', 'stopTalkback', 'createTalkRecord', 'refrashTalkRecord', 'createPCTalkRecord', 'noticeAppPullAudio']),
    openVideo() {
      if (this.isDisabled) { return }
      this.isLoading = true
      this.getTalkbackStream({ appid: this.soldierId, pcid: read('userId'), type: this.isPcToAppFlag ? 'PC' : 'APP' }).then(res => {
        this.callInfo = res.data
        console.log(res, 'getTalkbackStream')
        // PC主动发起
        if (this.isPcToAppFlag) {
          const param = {
            src: 'PC',
            destId: this.soldierId,
            url: res.data.url
          }
          return this.startTalkback(param).then(res => {
            if (this.isSingleAlarm) {
              return this.createPCTalkRecord({command: 'open', id: this.soldierId, webName: read('user.username'), uniqueId: this.uniqueId})
            }
          }).catch(err => {
            console.log(err, 'startTalkback error')
            this.warningMsg('视频对讲开启失败')
          })
        } else {
          // app端发起
          const data = {
            src: 'APP',
            srcId: this.soldierId,
            destId: read('userId'),
            mode: 2,
            avInfo: {
              url: res.data.url
            }
          }
          getSocket().emit('server:intercom.connect', data, fn => {
            console.log(fn)
          })
        }
      }).catch(err => {
        console.log(err, '获取流地址失败')
        this.warningMsg('开启视频对讲失败')
      })
    },
    // 与单兵App连接成功，开始计时 对讲
    connectComplete(data) {
      console.log(data, 'connectComplete')
      this.connectInfo = data
      const param = {
        url: data.avInfo.url,
        dsId: this.callInfo.dsId, // dsServerId
        dir: this.callInfo.dir // 存储目录
      }
      console.log(param, 'getSingleStream-param')
      this.getSingleStream(param).then(res => {
        this.openPlugin(data, res, param)
      }).catch(err => {
        console.log(err, '开启视频对讲失败')
        this.isPlaying = false
        this.isLoading = false
        this.errorMsg('开启视频对讲失败')
      })
    },
    async openPlugin(data, res, param) {
      // 创建 一条单兵记录
      const value = {
        webName: read('user.username'),
        appName: this.connectInfo.appName,
        dsId: this.callInfo.dsId,
        sn: this.connectInfo.sn,
        startTime: Date.now()
      }
      if (!this.isSingleAlarm) {
        this.createTalkRecord(value).then(res => {
          console.log(res.data, '创建 记录')
          this.recordId = res.data._id
        }).catch(err => {
          console.log(err, '创建 记录失败')
        })
      }
      const cmdStrPull = {
        url: data.avInfo.url
      }
      const objPull = {
        port: res.tsPort + '',
        ip: res.tsIp,
        cmdStr: cmdStrPull
      }
      // 插件 拉取 音频流
      console.log(objPull, 'openVideoCall')
      const state2 = await this.plugin.openVideoCall(objPull)
      console.log(state2, 'state2')
      if (state2) {
        this.timeId = setInterval(() => {
          let flag = this.plugin.plugin.SetPlayStretchBlt(1, 1, true)
          if (flag === 1) {
            clearInterval(this.timeId)
          }
        }, 100)
        this.isDisabled = true
        this.isPlaying = true
        this.isLoading = false
        this.startTiming()
        try {
          const soundState = await this.plugin.openSound()
          if (soundState === 0) {
            this.openSound = true
          }
          console.log(soundState, 'soundState')
        } catch (error) {
          console.log(error, 'openSound error')
        }
        const cmdStrPush = {
          talkMode: 1,
          url: data.avInfo.url
        }
        const objPush = {
          port: res.taPort + '',
          ip: res.taIp,
          cmdStr: JSON.stringify(cmdStrPush)
        }
        // 插件 推送 音频流
        console.log(JSON.stringify(objPush), 'openSpeechEx 参数')
        const state1 = await this.plugin.openAppSpeechEx(JSON.stringify(objPush))
        console.log(state1, 'push plugin')
        if (state1 === 0) {
          try {
            const state3 = this.plugin.startSpeechMobile()
            console.log(state3, ' startSpeechMobile')
            // 推送音频流成功，通知app端拉取音频流
            this.noticeAppPullAudio(data).catch((err) => {
              console.log(err, '通知app拉取音频流失败')
            })
          } catch (error) {
            console.log(error, 'startSpeechMobile error')
          }
        } else {
          this.warningMsg('语音对讲失败')
        }
        this.startRecord(param).then(res => {
          if (!this.isSingleAlarm) {
            const result = res.data
            const data = {
              id: this.recordId,
              body: {
                startTime: result ? (result.startTime ? result.startTime : Date.now()) : Date.now()
              }
            }
            return this.refrashTalkRecord(data)
          }
        }).catch(err => {
          console.log(err, '录像开启失败')
        })
        this.successMsg('开启视频成功')
      } else {
        this.isPlaying = false
        this.isLoading = false
        this.warningMsg('开启视频对讲失败')
      }
    },
    closeVideo() {
      if (this.connectInfo) {
        const param = {
          src: this.connectInfo.src,
          srcId: this.connectInfo.srcId,
          destId: this.connectInfo.destId
        }
        this.stopTalkback(param).then(() => {
          this.closePlugin()
          this.stopSingleStream({url: this.callInfo.url})
        }).catch((err) => {
          console.log(err, '关闭视频对讲失败')
          // this.$emit('stopCalling')
        })
      } else {
        let param = {}
        if (this.isPcToAppFlag) {
          param = {
            src: 'PC',
            srcId: read('userId'),
            destId: this.soldierId
          }
        } else {
          param = {
            src: 'APP',
            srcId: this.soldierId,
            destId: read('userId')
          }
        }
        this.stopTalkback(param).catch(err => {
          console.log(err, '通知手机关流失败')
        })
        this.isPlaying = false
        this.isLoading = false
      }
    },
    appCloseVideo() {
      if (this.connectInfo) {
        this.closePlugin()
        this.stopSingleStream({url: this.callInfo.url}).catch(err => {
          console.log(err)
        })
      }
    },
    async closePlugin() {
      this.connectInfo = null
      if (!this.isPlaying) {
        return
      }
      const state = await this.plugin.closeVideoCall()
      console.log(state, '插件关闭视频状态')
      if (state) {
        this.stopRecord({url: this.callInfo.url}).then(res => {
          if (!this.isSingleAlarm) {
            const param = {
              id: this.recordId,
              body: {
                endTime: Date.now()
              }
            }
            return this.refrashTalkRecord(param)
          }
        }).catch(err => {
          console.log(err, '录像关闭失败')
        })
        const soundState = await this.plugin.closeSound()
        const stopspeechState = await this.plugin.stopSpeech()
        const speechState = await this.plugin.closeSpeech()
        console.log(speechState, stopspeechState, soundState, '停止对讲状态/关闭对讲状态/声音关闭状态')
        this.isPcToAppFlag = true
        this.isPlaying = false
        this.isLoading = false
        setTimeout(() => {
          this.isDisabled = false
        }, 2000)
        // this.$emit('stopCalling')
      } else {
        this.isPcToAppFlag = true
        this.isPlaying = false
        this.isLoading = false
        setTimeout(() => {
          this.isDisabled = false
        }, 2000)
        // this.$emit('stopCalling')
      }
      if (this.timerId) {
        clearTimeout(this.timerId)
      }
      this.time = 0
    },
    videoRecording() { // 录像
      if (this.isRecording) {
        this.stopRecord({ url: this.callInfo.url }).then(() => {
          this.isRecording = !this.isRecording
        }).catch((err) => {
          console.log(err, '手机停止录像失败')
        })
      } else {
        const param = {
          url: this.callInfo.url,
          dsId: this.callInfo.dsId, // dsServerId
          dir: this.callInfo.dir // 存储目录
        }
        this.startRecord(param).then(() => {
          this.isRecording = !this.isRecording
        }).catch((err) => {
          console.log(err, '手机开始录像失败')
        })
      }
    },
    fullscreen() {
      if (this.plugin.isFullscreen) {
        this.plugin.cancelFullscreen()
      } else {
        this.plugin.fullScreen()
      }
    },
    getPicture() {
      if (this.isPlaying) {
        this.plugin.getScreenshot()
      }
    },
    // 声音切换
    toggleSound() {
      this.openSound = !this.openSound
      if (this.openSound) {
        this.plugin.openSound()
      } else {
        this.plugin.closeSound()
      }
    },
    closeTalk(e) {
      if (this.connectInfo) {
        const param = {
          src: this.connectInfo.src,
          srcId: this.connectInfo.srcId,
          destId: this.connectInfo.destId
        }
        this.stopTalkback(param) // 断开 对讲
      }
      if (this.isPlaying) {
        this.stopSingleStream({url: this.callInfo.url}) // 手机关流
        this.stopRecord({url: this.callInfo.url}) // 手机停止录像
        if (!this.isSingleAlarm) {
          this.refrashTalkRecord({ id: this.recordId, body: { endTime: Date.now() } }) // 设置结束时间
        }
      }
      this.isPlaying = false
      this.connectInfo = null
    },
    startTiming() {
      this.time++
      let h = parseInt(this.time / 3600)
      let m = parseInt((this.time - h * 3600) / 60)
      let s = this.time - h * 3600 - m * 60
      this.hour = h < 10 ? `0${h}` : (h + '')
      this.minute = m < 10 ? `0${m}` : (m + '')
      this.second = s < 10 ? `0${s}` : (s + '')
      this.timerId = setTimeout(() => {
        this.startTiming()
      }, 1000)
    }
  },
  created() {
    alarm.on('intercomComplete', this.connectComplete)
    // alarm.on('intercomDisconnect', this.connectClose)
    window.addEventListener('beforeunload', this.closeTalk)
  },
  beforeDestroy() {
    alarm.remove('intercomComplete', this.connectComplete)
    // 解决 非正常关闭时，app端关流，数据库不记录结束时间
    this.closeTalk()
    if (this.timerId) {
      clearTimeout(this.timerId)
    }
    clearInterval(this.timeId)
    // alarm.remove('intercomDisconnect', this.connectClose)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.closeTalk)
  }
}
</script>
<style lang="less" scoped>
.video-call {
  width: 100%;
  height: 100%;
  padding: 0px 5px;
  background-color: #1c3053;
  display: flex;
  justify-content: center;
  align-items:center;
  position: relative;
  .sing-plugin {
    width: 100%;
    height: ~'calc(100% - 32px)';
  }
}
.plu-collter {
  width:100%;
  height: 100%;
}
.video-call .icon-play {
  font-size: 60px;
  line-height: 60px;
  cursor: pointer;
}
.btn-con {
  line-height: 30px;
  display:inline-block;
  margin-left:10px;
  position: absolute;
  bottom: 0;
  right: 10px;
}
.btn-con span {
  user-select: none;
  cursor: pointer;
  margin-left: 15px;
}
.btn-con .icon-guaduan,
.btn-con .icon-videotape-stop,
.btn-con .icon-videotape {
  border: 0 none;
  background: transparent;
  color: #fff;
  padding: 0 5px;
  outline: 0 none;
}
.btn-con .icon-guaduan:hover,
.btn-con .icon-videotape-stop:hover,
.btn-con .icon-videotape:hover {
  color: #20adff;
}
.demo-spin-icon-load{
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
</style>
