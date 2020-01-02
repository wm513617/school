<template>
  <div id="preview" v-resize="resize">
    <!--视频-->
    <div class="main" :class="{'noRight':!showControl}" ref="main">
      <videoImgBg class="videosbg" v-if="showBackView" :count="count" :active="bgactive" :imgList="imgList" :style="{height: `calc(100% - ${slotHeight}px)`}"></videoImgBg>

      <div class="videos" ref="videos" @dragover.prevent.stop @drop.prevent.stop="handleDrop" :style="{bottom: videoBottom + 'px',top: videoTop + 'px'}">
        <video-frame @BackViewShowfn='BackViewShowfn' :pluginCount="16" :clickInit="false" :defaultShowscreen="4" :slotHeight="slotHeight" :state.sync="state" @close='close' :playingCount.sync="playingCount" toolbar='preview' class="frame" ref="frame" @activeChange="avtiveChange" :bgColor="'#404040'"></video-frame>
      </div>
      <video-buttons :style="{'height': btnheight + 'px', 'z-index': 9}" ref="buttons"></video-buttons>
    </div>
    <!--左边机构、收藏夹-->
    <div class='left'>
      <VideoMenu ref="VideoMenu" @changeNodeId="changeNodeId"></VideoMenu>
    </div>
    <!--右边 云台-->
    <div class='right' v-show='showControl'>
      <bs-scroll ref="scroller">
        <PreviewControler></PreviewControler>
      </bs-scroll>
    </div>
    <div class="noControl" @click='changeControl' :class="{'noRight':!showControl}">
      <Icon type="chevron-right" v-if='showControl'></Icon>
      <Icon type="chevron-left" v-if='!showControl'></Icon>
    </div>
    <div class="ivu-modal-wrap backView" v-if="showBackView">
      <div class="mapAppVideoPLayback" v-if="showBackView">
        <videoSiteBlack :videoParam="backViewObj" @pbClose="pbClose"></videoSiteBlack>
      </div>
    </div>

  </div>
</template>

<script>
import PreviewControler from './preview/PreviewControler.vue'
import VideoButtons from './preview/VideoButtons.vue'
import VideoMenu from 'components/videoMenu/VideoMenu.vue'
import videoSiteBlack from 'components/video/videoSiteBlack'
import videoImgBg from './preview/videoImgBg'
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'preview',
  components: {
    PreviewControler,
    VideoButtons,
    VideoMenu,
    videoSiteBlack,
    videoImgBg
  },
  data() {
    return {
      // 是否显示历史回放
      showBackView: false,
      // 历史回放的数据对象
      backViewObj: {},
      showVideo: false,
      showControl: true,
      slotHeight: 80,
      btnheight: 40,
      // 视频的状态
      state: {
        // 是否播放
        isPlay: '',
        // 是否鸟瞰
        isBoost: '',
        // 是否打开伴音
        isVolumeOpen: '',
        // 是否是在录像
        isRecording: '',
        // 是否是在中心录像
        isCentreRecording: '',
        // 是否对讲
        isSpeech: '',
        // 是否正在轮训
        isPoll: '',
        // 音量
        volumeValue: 0,
        // 码流  main是主码流
        streamType: 'main',
        scale: '自适应',
        streamId: ''
      },
      videoBottom: 60,
      videoTop: 0,
      count: 4,
      bgactive: 0,
      imgList: {},
      playingCount: 0
    }
  },
  computed: {
    // 获取视频对象
    plugin() {
      return this.$refs.frame
    },
    pluginData() {
      return this.$refs.frame.pluginData
    }
  },
  watch: {
    playingCount(c) {
      // console.log(c, window.localStorage.useSubStream)
      // if (window.localStorage.useSubStream === 'true' && c >= 9) {
      //   this.plugin.toggleAllSubStream()
      // }
    }
  },
  methods: {
    ...mapMutations(['SET_FAVID', 'SET_ORGID']),
    ...mapActions(['getMonitorList', 'getTVList', 'getFavorites']),
    avtiveChange(i) {
      if (this.pluginData[i]) {
        this.SET_ORGID(this.pluginData[i].id)
        this.SET_FAVID(this.pluginData[i].id)
        try {
          // const node = this.$refs.VideoMenu.$refs.org.$refs.tree.$refs.tree.getNode(this.pluginData[i].id)
          this.$refs.VideoMenu.$refs.org.activeNode = { _id: this.pluginData[i].id }
          let node = {
            // 现场视频 历史视频 功能 在切换焦点时没有改变 curNode 的值 导致 日历上显示是否有录像信息错误 20190424 拿不到节点值 拼接几个需要的值使用
            chan: this.pluginData[i].channel,
            eid: {
              ip: this.pluginData[i].ip,
              cport: this.pluginData[i].port
            }
          }
          this.$store.commit('SET_CURNODE', node)
        } catch (err) {
          console.log(err)
        }
      }
    },
    changeNodeId(id) {
      for (const i in this.pluginData) {
        if (this.pluginData[i].id === id) {
          this.plugin.activedIndex = parseInt(i)
        }
      }
    },
    changeVw() {
      this.$nextTick(() => {
        if (!this.$refs.videos) {
          return
        }
        const vw = this.$refs.videos.offsetWidth
        if (vw < 900) {
          this.slotHeight = 56
          this.btnheight = 56
        } else {
          this.slotHeight = 56
          this.btnheight = 56
        }
      })
    },
    changeControl() {
      this.showControl = !this.showControl
    },
    close(id) {},
    handleDrop(e) {
      const data = e.dataTransfer.getData('Text')
      const target = $(e.target)
      target.click()
      // const index = +target.attr('index')
      // this.plugin.activedIndex = index
      this.plugin.plugin.handleDrop(data)
    },
    BackViewShowfn(i, data) {
      if (i !== undefined && data) {
        // this.plugin.getCapture()
        this.imgList = {}
        this.plugin.plugins.forEach((plugin, j) => {
          if (plugin.pluginState.isStopped) {
            return
          }
          if (plugin.pluginState.isPlay) {
            this.imgList[j] = plugin.getCapture({ type: 1, quality: 5 })
          }
        })
        setTimeout(() => {
          this.count = this.plugin.showscreen
          this.bgactive = this.plugin.activedIndex
          this.showBackView = true
        }, 100)
        this.backViewObj = data
        this.videoBottom = -10000
        this.videoTop = -10000
      }
    },
    pbClose() {
      this.showBackView = false
      this.videoBottom = 60
      this.videoTop = 0
    },
    scorll() {
      this.$refs.scroller && this.$refs.scroller.update()
    },
    resize() {
      this.changeVw()
      this.$refs.scroller.update()
    }
  },
  mounted() {
    this.changeVw()
    this.getTVList().then(() => {
      this.getMonitorList()
    })
    this.getFavorites()
  },
  beforeDestroy() {
    if (window.CollectGarbage) {
      window.CollectGarbage()
    }
  }
}
</script>

<style scoped>
.mapAppVideoPLayback {
  width: 846px;
  height: 458px;
  position: fixed;
  left: calc(50% - 400px);
  top: calc(50% - 300px);
  background: #0a111c;
}
#preview {
  padding: 16px 0px;
  font-size: 12px;
  height: 100%;
  width: 100%;
  min-width: 1240px;
  background: #0c1b32;
  color: #fff;
  position: relative;
  min-width: 1280px;
}
#preview .left {
  width: 272px;
  height: calc(100% - 32px);
  /* float: left; */
  position: absolute;
  background: #1b3153;
}
#preview .left ul {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 10px;
}
#preview .left ul li {
  width: 60px;
  float: left;
}
#preview .left ul li.active {
  border-bottom: 2px solid #00a5e3;
}
#preview .left ul li.btn {
  float: right;
  font-size: 16px;
}
#preview .right {
  width: 290px;
  height: calc(100%);
  float: left;
}
#preview .main {
  margin-right: 16px;
  margin-left: 288px;
  float: left;
  position: relative;
  height: 100%;
  width: calc(100% - 600px);
  min-width: 596px;
}
#preview .main .videos,
#preview .main .videosbg {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 60px;
  top: 0;
}
#preview .main .videosbg {
  height: calc(100% - 60px);
}
#preview .main.noRight {
  width: calc(100% - 305px);
  margin-right: 0px;
}
.noControl {
  position: absolute;
  right: 296px;
  top: calc(50% - 25px);
  width: 16px;
  height: 45px;
  margin-top: -15px;
  line-height: 45px;
  text-align: center;
  color: #00a5e3;
  background: #1b3153;
}
.noControl.noRight {
  right: 0px;
}
</style>
