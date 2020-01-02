<template>
<!-- 对讲 -->
  <Dragx title="单兵对讲" :index="3" @close="close">
    <div class="content-left">
      <div class="left-top">
        <div class="photo">
          <img class="avator" :src="soldierImg ? `/api/upload/?id=${soldierImg}` : '/static/noSolider.jpg'" alt="加载失败">
        </div>
        <div class="solider-names">
          <span>{{soldierInfo.name}}</span>
          <span style="margin-left:12px;">{{soldierInfo.org}}</span>
        </div>
        <div class="time">{{hour}}:{{minute}}:{{second}}</div>
      </div>
      <div class="left-bottom">
        <div class="iconfont talk-icon" :class="{'icon-shipinlei-duijiang': talkOpen, 'icon-shipinleiduijiangjinyong': !talkOpen}" @click="toggleTalk"></div>
        <div class="iconfont talk-icon" :class="{'icon-volume': openSound, 'icon-mute': !openSound}" @click="toggleSound"></div>
        <div style="display:flex;">
          <div class="circle" :style="{backgroundColor: recording ? 'red' : '#5676a9'}"></div>
          <i-switch size="large" v-model="recording" @on-change="toggleRecord">
            <span slot="open">ON</span>
            <span slot="close">OFF</span>
          </i-switch>
        </div>
      </div>
    </div>
  </Dragx>
</template>

<script>
// soldierImg: 单兵人员头像
// soldierInfo: 单兵人员信息  {name, org, id}
// $emit('close'): 关闭事件
import alarm from 'src/socket/alarm.js'
import { getSocket } from 'src/socket/socket.js'
import Dragx from '../dragx/Dragx.vue'
import { TALK_STREAM_START } from '../../http/video.api'
import { read } from '../../storage/index.js'
import { access_token } from '../../stored.js' // eslint-disable-line
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    Dragx
  },
  props: {
    isPcToApp: { // true:平台发起对讲  false:app端发起对讲
      type: Boolean,
      default: true
    },
    soldierImg: {
      type: String,
      // default: '/static/noSolider.jpg'
      default: ''
    },
    soldierInfo: {
      type: Object,
      default: () => {
        return {
          name: '',
          org: '',
          sn: '',
          id: ''
        }
      }
    },
    appUrl: { // app端发起的对讲的话 socket接收到的url
      type: String,
      default: ''
    }
  },
  data() {
    return {
      talkOpen: true, // 广播开启
      recording: true, // 是否开始录音
      openSound: true, // 音量开启状态
      time: 0,
      hour: '00',
      minute: '00',
      second: '00',
      callInfo: null,
      connectInfo: null
    }
  },
  computed: {
    ...mapGetters(['plugins'])
  },
  created() {
    alarm.on('intercomComplete', this.connectComplete)
    alarm.on('intercomDisconnect', this.connectClose)
  },
  mounted() {
    this.getTalkbackStream({ appid: this.soldierInfo.id, pcid: read('userId'), type: 'PC'}).then(res => {
      this.callInfo = res.data
      console.log(res, 'getTalkbackStream')
      // PC主动发起
      if (this.isPcToApp) {
        const param = {
          src: 'PC',
          destId: this.soldierInfo.id,
          url: res.data.url
        }
        return this.startTalkback(param).catch(err => {
          console.log(err, 'startTalkback error')
          this.warningMsg('对讲开启失败')
        })
      } else {
        // app端发起
        const data = {
          src: 'APP',
          srcId: this.soldierInfo.id,
          destId: read('userId'),
          mode: 1,
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
      this.warningMsg('开启对讲失败')
    })
  },
  methods: {
    ...mapActions(['startTalkback', 'stopTalkback', 'getTalkbackStream', 'getSingleStream', 'stopSingleStream', 'startRecord', 'stopRecord']),
    // 关闭对讲
    close() {
      if (this.connectInfo) {
        const param = {
          src: this.connectInfo.src,
          srcId: this.connectInfo.srcId,
          destId: this.connectInfo.destId
        }
        this.stopTalkback(param).catch((err) => {
          this.errorMsg('关闭对讲失败！')
          console.log(err)
        })
      } else {
        this.$emit('close')
      }
    },
    // 监听到 对讲断开
    connectClose(data) {
      if (!this.connectInfo) { return }
      this.stopSingleStream({url: this.connectInfo.avInfo.url}).then(() => {
        const state = this.plugins.CloseSpeech()
        if (!state) {
          this.stopRecord({url: this.callInfo.url}).catch(err => {
            console.log(err, '录音关闭失败')
          })
          this.$emit('close')
        } else {
          this.errorMsg('关闭对讲失败！')
        }
      }).catch(err => {
        console.log(err, 'stopSingleStream error')
      })
    },
    toggleTalk() {
      this.close()
    },
    toggleSound() {
      this.openSound = !this.openSound
      if (this.openSound) {
        this.plugins.OpenPlayerSound()
      } else {
        this.plugins.StopPlayerSound()
      }
    },
    toggleRecord(flag) {
      if (!this.callInfo) { return }
      if (flag) {
        this.startRecord({url: this.callInfo.url, dsId: this.callInfo.dsId, dir: this.callInfo.dir})
      } else {
        this.stopRecord({url: this.callInfo.url})
      }
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
      console.log(param, '222')
      this.getSingleStream(param).then(res => {
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
        const state1 = this.plugins.OpenSpeechEx(JSON.stringify(objPush))
        let startState = 1
        if (state1 === 0) {
          startState = this.plugins.StartSpeech()
        } else {
          this.warningMsg('开启对讲失败')
          return
        }
        const cmdStrPull = {
          url: data.avInfo.url
        }
        const objPull = {
          port: res.tsPort + '',
          ip: res.tsIp,
          cmdStr: JSON.stringify(cmdStrPull)
        }
        // 插件 拉取 音频流
        const state2 = this.plugins.OpenRealStreamEx(JSON.stringify(objPull))
        if (state1 === 0 && state2 === 0) {
          this.startTiming()
          this.startRecord(param).catch(err => {
            console.log(err, '录音开启失败')
          })
          this.successMsg('开启对讲成功')
        } else {
          this.warningMsg('开启对讲失败')
        }
      }).catch(err => {
        this.errorMsg('开启对讲失败')
      })
    },
    startTiming() {
      this.time++
      let h = parseInt(this.time / 3600)
      let m = parseInt((this.time - h * 3600) / 60)
      let s = this.time - h * 3600 - m * 60
      this.hour = h < 10 ? `0${h}` : (h + '')
      this.minute = m < 10 ? `0${m}` : (m + '')
      this.second = s < 10 ? `0${s}` : (s + '')
      setTimeout(() => {
        this.startTiming()
      }, 1000)
    },
    inTreeExpand() {
      this.$refs.inTreeScroll.update()
    }
  },
  beforeDestroy() {
    this.plugins.CloseSpeech()
    alarm.remove('intercomComplete', this.startTalkback)
  }
}
</script>

<style scoped lang='less'>
.content-left {
  width: 300px;
  height: 360px;
  border-left: 1px solid rgba(58, 90, 139, 0.4);
  border-bottom: 1px solid rgba(58, 90, 139, 0.4);
  border-right: 1px solid rgba(58, 90, 139, 0.4);
  .left-top {
    height: 280px;
    border-bottom: 1px solid rgba(58, 90, 139, 0.4);
    font-size: 14px;
    .photo {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      .avator {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        float: left;
        background-size: contain;
      }
    }
    .solider-names {
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .time {
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
  }
  .left-bottom {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    .talk-icon {
      cursor: pointer;
      font-size: 24px;
      margin-right: 35px;
    }
    .circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 12px;
    }
  }
}
</style>
