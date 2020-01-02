<template>
  <div style="height:100%">
    <div class="no-plugin" style="height: 100%;background:#404040;" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
    </div>
    <bs-video :pluginCOM="AlarmPreviewPlugin" :count="16" :showNum="showscreen" :curPage="curPage" style="height: 100%" @handleAlarm="handle" @emergencyPlan="emergencyPlan" @update:activedVM="activedVMChange" ref="frame" v-if="!showDownload" @dblclickEvent="dblclickEvent"></bs-video>
    <div class="theme-title" style="padding:6px 10px">
      <div class="realbtn iconfont icon-multi-screen" title="页面分割" @mouseenter="(hoverShowscreen=showscreen)&&(showscreenShow=true)" @mouseleave="showscreenShow=false">
        <ul class="multi-screen" v-show="showscreenShow">
          <i></i>
          <li v-for="screen in showscreenList" :key="screen.value" @mouseenter="hoverShowscreen=screen.value" :class="{active: screen.value===hoverShowscreen}" @click="showscreen = screen.value">{{screen.label+'画面'}}</li>
        </ul>
      </div>
      <div @mouseenter="showVolume = true" @mouseleave="showVolume = false" style="float:right;display:flex;align-items:center;">
        <div style="margin:0 8px;" class="realbtn iconfont" :class="[!state.isPlay ? 'disable': '', !state.isVolumeOpen ? 'icon-mute': 'icon-volume']" title="音量"  @click="soundOpen"></div>
        <div style="width:120px" :style="{opacity: (showVolume||isDragging)&&state.isPlay?1:0 }">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!state.isVolumeOpen" v-model="state.volumeValue">
          </slider>
        </div>
      </div>
      <div style="float:right;" class="realbtn iconfont" :class="[(state.isPlay&&!patrolVideoStatus()) ? '': 'disable', !state.isSpeech ? 'icon-shipinleiduijiangjinyong' : 'icon-shipinlei-duijiang']" title="对讲" @click="intercomClick()">
      </div>
    </div>
  </div>
</template>
<script>
import Slider from 'components/Slider'
import AlarmPreviewPlugin from './AlarmPreviewPlugin'
import { mapState, mapActions, mapMutations } from 'vuex'
import versionCheck from '../../components/video/pluginVersionCheck'
import { getSocket } from 'src/socket/socket.js'
import { read } from '../../storage/index.js'
export default {
  components: { Slider },
  mixins: [versionCheck],
  data() {
    return {
      AlarmPreviewPlugin,
      showscreen: 9,
      showscreenList: [
        {
          value: 1,
          label: '单'
        },
        {
          value: 4,
          label: '四'
        },
        {
          value: 9,
          label: '九'
        },
        {
          value: 16,
          label: '十六'
        }
      ],
      showscreenShow: false,
      hoverShowscreen: 1,
      playingVideos: [],
      usePage: 'video',
      showVolume: false,
      state: {
        isPlay: false, // 正在播放
        isStopped: true, // 播放完毕
        isBoost: false, // 鸟瞰状态
        isVolumeOpen: false, // 伴音
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
      curPage: 0,
      oldShowscreen: 9
    }
  },
  computed: {
    ...mapState({
      videoWarnList: ({ warningDispose }) => warningDispose.videoWarnList,
      activeWarnInfo: ({ warningDispose }) => warningDispose.activeWarnInfo,
      activeFireAlarmInfo: ({ firecontrol }) => firecontrol.activeWarnInfo,
      fireAlarmVideos: ({ firecontrol }) => firecontrol.fireAlarmVideos,
      alarmPageData: ({ warningDispose }) => warningDispose.alarmPageData
    }),
    ...mapMutations(['SPLICE_CLOSE_DATA', 'SPLICE_FIREALARM_VIDEOS']),
    videos() {
      if (this.alarmPageData === 'fireAlarmPage') {
        return this.fireAlarmVideos
      } else {
        return this.videoWarnList
      }
    },
    highlightIndex() {
      if (this.alarmPageData === 'alarmPage') {
        return this.$lodash.findIndex(this.playingVideos, item => item && item.uid === this.activeWarnInfo.groupId)
      } else {
        return this.$lodash.findIndex(this.playingVideos, item => item && item.uid === this.activeFireAlarmInfo.groupId)
      }
    },
    frames() {
      return this.$refs.frame
    }
  },
  watch: {
    highlightIndex(h) {
      if (h !== -1) {
        this.frames.activeFrame(h)
      }
    },
    videos() {
      this.openVideos()
    }
  },
  methods: {
    ...mapActions(['setActiveWarnInfo', 'getCameraPower', 'getSingleResource']),
    openVideos() {
      if (this.videos.length !== 0) {
        this.videos.forEach(v => {
          let findV = this.$lodash.find(this.playingVideos, pv => pv && pv.uid === v.uid)
          if (!findV) {
            if (v.url && v.url.length !== 0) {
              v.url.forEach(r => {
                if (r) {
                  this.pushNewImg({ ...v, url: r })
                }
              })
            } else {
              this.pushNewVideo(v)
            }
          }
        })
      }
    },
    pushNewImg(item) {
      const index = this.findAvailableIndex()
      if (index === -1) {
        return
      }
      if (index === this.playingVideos.length) {
        this.playingVideos.push(item)
      } else if (!this.playingVideos[index]) {
        this.$set(this.playingVideos, index, item)
      } else if (item.level >= this.playingVideos[index].level) {
        this.$set(this.playingVideos, index, item)
      } else {
        return
      }
      this.frames.activeFrame(index)
      const frame = this.frames.getCOM(index)
      frame.close()
      console.log(item, 'item6666')
      if (item.date && item.moment) {
        let hourmin = item.moment.split(':')
        let datetime = new Date(item.date * 1000)
        datetime.setHours(hourmin[0])
        datetime.setMinutes(hourmin[1])
        item.time = new Date(datetime) / 1000
      }
      let p = {
        id: '',
        type: 'video',
        ip: item.devIp,
        port: item.devPort,
        channel: item.channel,
        vendor: item.manufacturer,
        streamType: item.streamType || 'main',
        url: item.url,
        uid: item.uid,
        alarmName: item.name || item.title,
        level: item.level,
        eventType: item.eventType,
        time: item.time
      }
      if (item.nodeId) {
        p = {
          ...p,
          gbDevId: item.nodeId,
          shareServer: item.shareServer
        }
      }
      frame.open(p)
    },
    async pushNewVideo(item) {
      console.log(item, 'item6666')
      let changeItem = JSON.parse(JSON.stringify(item))
      let mainItem
      if (changeItem.actionList) {
        mainItem = this.$lodash.find(changeItem.actionList, changeItem => changeItem.main && changeItem.client)
      } else if (changeItem.video) {
        mainItem = changeItem
      } else if (changeItem.eventType === 'soldier') {
        mainItem = changeItem
      }
      if (!mainItem) {
        return
      }
      // if (mainItem.main && !mainItem.client) {
      //   return
      // }
      const index = this.findAvailableIndex()
      if (index === -1) {
        return
      }
      if (index === this.playingVideos.length) {
        this.playingVideos.push(changeItem)
      } else if (!this.playingVideos[index]) {
        this.$set(this.playingVideos, index, changeItem)
      } else if (changeItem.level >= this.playingVideos[index].level) {
        this.$set(this.playingVideos, index, changeItem)
      } else {
        return
      }
      // const power = await this.getCameraPower(mainItem.channelId)
      // if (!power || !power.includes('preview')) {
      //   this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      //   return
      // }
      let cameraType = '' // 镜头类型
      let cameraName = '' // 镜头名称
      let cameraStream = '' // 镜头码流
      if (mainItem.channelId) {
        await this.getSingleResource(mainItem.channelId)
          .then(res => {
            cameraType = res.monitortype
            cameraName = res.name
            cameraStream = res.stream
          })
          .catch(err => {
            console.log(err, 'err')
          })
      }
      this.frames.activeFrame(index)
      const frame = this.frames.getCOM(index)
      frame.close()
      console.log(item, 'item8888')
      console.log(changeItem, 'changeItem8888')
      let p = {
        id: mainItem.channelId,
        type: 'video',
        ip: mainItem.devIp,
        port: mainItem.devPort,
        channel: mainItem.channel,
        vendor: mainItem.manufacturer,
        streamType: cameraStream || 'main',
        monitorType: cameraType,
        cameraName: cameraName,
        uid: changeItem.uid,
        alarmName: changeItem.name,
        level: changeItem.level,
        eventType: changeItem.eventType,
        time: changeItem.time,
        video: changeItem.video || '',
        uniqueId: changeItem.uniqueId || '',
        sn: changeItem.sn || '',
        realname: changeItem.realname || ''
      }
      if (mainItem.nodeId) {
        p = {
          ...p,
          gbDevId: mainItem.nodeId,
          shareServer: mainItem.shareServer
        }
      }
      frame.open(p).catch(err => {
        console.log(err)
        frame.close()
        // 如果开流失败，不再占用窗格且清除store种报警视频数据
        this.$set(this.playingVideos, index, null)
        if (this.alarmPageData === 'alarmPage') {
          this.$store.commit('SPLICE_CLOSE_DATA', item)
        } else if (this.alarmPageData === 'fireAlarmPage') {
          this.SPLICE_FIREALARM_VIDEOS(item)
        }
      })
    },
    closeAllVideo() {
      Array(16)
        .fill()
        .forEach((_, index) => {
          this.frames.getCOM(index).close()
        })
      this.playingVideos = []
      this.frames.activeFrame(0)
    },
    closeVideo(item) {
      console.log(item, 'item33333')
      console.log(this.playingVideos, 'this.playingVideos3333')
      let index = -1
      if (item.eventType === 'individualAlarm') {
        index = this.$lodash.findIndex(this.playingVideos, it => it && it.uid === item.message.uid)
      } else {
        index = this.$lodash.findIndex(this.playingVideos, it => it && it.uid === item.uid)
      }
      if (index !== -1) {
        this.$set(this.playingVideos, index, null)
        // this.playingVideos.splice(index, 1)
        this.frames.getCOM(index).close()
        if (this.alarmPageData === 'alarmPage') {
          this.$store.commit('SPLICE_CLOSE_DATA', item)
        } else if (this.alarmPageData === 'fireAlarmPage') {
          this.SPLICE_FIREALARM_VIDEOS(item)
        }
      }
    },
    closeAllVolume() {
      Array(16)
        .fill()
        .forEach((_, index) => {
          this.frames.getCOM(index).closeSound()
        })
    },
    closeAllSpeech() {
      // 关闭7个插件的对讲
      Array(16)
        .fill()
        .forEach((_, index) => {
          this.frames.getCOM(index).closeSpeech()
        })
    },
    findAvailableIndex() {
      const list = this.playingVideos
      const nullIndex = this.$lodash.findIndex(list, it => it === null)
      if (nullIndex !== -1) {
        return nullIndex
      } else if (list.length < this.showscreen) {
        // 未满
        return list.length
      } else {
        // 找报警级别最低的
        let minLevel = 10
        let minIndex = -1
        let minTime
        this.playingVideos.forEach((item, index) => {
          if (!item) {
            minIndex = index
          } else if (item.level < minLevel) {
            // 数字越小的级别最低
            minLevel = +item.level
            minIndex = index
            minTime = item.time
          } else if (item.level === minLevel) {
            if (item.time < minTime) {
              minTime = item.time
              minIndex = index
            }
          }
        })
        return minIndex
      }
    },
    handle(index) {
      const info = this.playingVideos[index]
      this.setActiveWarnInfo(info)
      this.$emit('update:toggleView', true)
    },
    soundOpen() {
      console.log(this.activedIndex, 'activedIndex888')
      console.log(this.patrolVideoStatus(), 'patrolVideoStatus888')
      if (!this.state.isPlay) {
        return
      }
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
      if (!this.state.isPlay || this.patrolVideoStatus()) {
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
      if (this.showscreen === 1) {
        this.showscreen = this.oldShowscreen
        this.curPage = 0
      } else {
        this.oldShowscreen = this.showscreen
        this.showscreen = 1
        this.curPage = index
      }
    },
    emergencyPlan(v) {
      this.$emit('emergencyPlan', v)
    },
    patrolVideoStatus() {
      return this.$refs.frame.$children[this.activedIndex].isShowVideo
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.videoWarnList.length > 0) {
        this.openVideos()
      }
    })
  },
  created() {
    getSocket().emit('patrol:instant.message', { usrid: read('userId') })
  },
  beforeDestroy() {
    this.closeAllVideo()
  }
}
</script>
<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
}

.theme-title {
  width: calc(100% - 16px);
  /*position: relative;*/
  height: 56px;
  /*width: 100%;*/
  padding: 0;
  position: absolute;
  bottom: 0px;
  background: #1b3153;
}

.theme-title .realbtn {
  padding: 6px 10px;
  height: 36px;
  width: 38px;
  color: #cfd7e6;
  /* background: #5676aa;
  margin-left: 18px; */
  display: inline-block;
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  font-size: 20px;
}

.theme-title .realbtn.disable,
.theme-title .realbtn.disable:hover {
  color: #9298a4;
  /* background: #5676aa; */
  cursor: not-allowed;
}

.theme-title .realbtn:hover {
  /* background: #fa893b; */
  color: #fda548;
}

.theme-title .realbtn:active {
  color: #c47019;
  /* background: #d66c23; */
}

.theme-title .theme-title-right .realbtn {
  /* margin-right: 18px; */
  margin-left: 0;
}

.theme-title ul {
  z-index: 99999;
  position: relative;
  list-style: none;
  bottom: 36px;
  color: #fffafa;
  text-align: center;
  /* padding-top: 23px; */
}

.theme-title ul li {
  position: relative;
  z-index: 199999999;
  font-size: 12px;
  line-height: 12px;
  display: inline-block;
  padding: 0 15px;
  border-right: 1px solid rgb(85, 119, 169);
}

.theme-title ul li:last-child {
  border-right: 0;
}

.theme-title ul li.active,
.theme-title ul li:hover {
  color: #fa8a3b;
}

.theme-title ul li.disable,
.theme-title ul li.disable:hover {
  color: #878282;
  cursor: not-allowed;
}

.theme-title ul i {
  display: block;
  position: absolute;
  background: #355284;
  width: 14px;
  height: 14px;
  transform: rotate(45deg);
}

.multi-screen {
  width: 300px;
  left: 32px;
  background: #335589;
  height: 40px;
  line-height: 40px;
  border-radius: 3px;
}

.multi-screen i {
  bottom: 12px;
  left: -7px;
}

.theme-title-bottom {
  width: 100%;
  height: 40px;
  background: #355284;
  position: absolute;
  left: 0;
  bottom: 0px;
}

.theme-title-jiexian {
  width: 100%;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  /* border-bottom: 1px solid #263e69; */
  position: absolute;
  left: 0;
  bottom: 40px;
}
</style>
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
</style>
