<template>
  <div class="video-bottom video-buttons">
    <div class="video-bottom-left">

      <div class="realbtn iconfont icon-preview-stopall" :class="{disable: !playingCount}" @click="stopPreview" title="关闭全部预览"></div>

      <div class="realbtn iconfont icon-screenshot" :class="{'disable' :!state.isPlay}" @click="getCapture" title="截图"></div>

      <div class="realbtn iconfont" :class="[state.isPlay? '': 'disable',!state.isVolumeOpen? 'icon-sound-close':'icon-sound']" @click="soundOpen" :title="!state.isVolumeOpen? '关闭伴音':'开启伴音'"></div>

      <div @mouseenter="showVolume = true" @mouseleave="showVolume = false" style="display:inline-block;">
        <div class="realbtn iconfont icon-volume" :class="{'disable' :!state.isPlay}" title="音量"></div>
        <div class="slider-box" style="width:120px;display:inline-block;" :style="{opacity: (showVolume||isDragging)&&state.isPlay&&state.isVolumeOpen?1:0 }">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!state.isVolumeOpen" v-model="volume">
          </slider>
        </div>
      </div>

    </div>

    <div class="video-bottom-right">

      <div class="realbtn iconfont icon-multi-screen" title="页面分割" @mouseenter="(showFrame = true)&&(hoverScreen=plugin.showscreen)" @mouseleave="showFrame = false">
        <ul v-show="showFrame" class="multi-screen">
          <i class="triangle"></i>
          <li v-for="(item, i) in frameList" @mouseover="hoverScreen=item.value" :class="{active: hoverScreen==item.value}" @click='changeFrame(item)' :key="i">{{item.label}}
            <i v-if="i < 2" class="ivu-icon ivu-icon-arrow-down-b" @click.stop="showSubChek=!showSubChek"></i>
          </li>
          <li><Checkbox style="margin-right: 0;" v-show="showFrame&&showSubChek&&(hoverScreen===9||hoverScreen===16)" class="sub-stream-check" v-model="useSubStream">子码流预览</Checkbox></li>
        </ul>
      </div>

      <div class="realbtn iconfont icon-full-screen" @click="fullscreen" :class="{'disable' :!state.isPlay}" title="全屏"></div>

    </div>

    <!-- <div class="video-bottom-bottom" v-show="showFrame||(state.isPlay&&(showVideotape||showIntercom||showAdv||showStream||showPattern))"></div>
    <div class="video-bottom-jiexian"></div> -->

    <Modal v-model="confirmModal" title="提示" :width="416" :transition-names="['1', '2']">
      <iframe v-if="confirmModal"></iframe>
      <div>
        <i class="ivu-icon ivu-icon-help-circled" style="color:#ff9900;font-size:36px;vertical-align:middle;margin:10px 20px 10px"></i>确定要关闭全部预览吗?
      </div>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="confirmModal=false">取消</Button>
        <Button type="primary" @click="stopAll">确定</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
import Slider from './Slider'
import { mapState, mapActions } from 'vuex'
export default {
  components: { Slider },
  props: {
  },
  data() {
    return {
      playingCount: 0,
      isEnter: false,
      hoverScreen: '',
      hoverStream: '',
      hoverPattern: '',
      isDragging: false,
      showPreviewOpen: false,
      showVideotape: false,
      showIntercom: false,
      showStream: false,
      showPattern: false,
      showSubChek: false,
      useSubStream: true,
      scale: '自适应',
      showFrame: false,
      frameList: [
        { label: '16画面', value: 16 },
        { label: '9画面', value: 9 },
        { label: '4画面', value: 4 },
        { label: '单画面', value: 1 }
      ],
      volume: 50, // 音量
      showTowall: false,
      picType: 0,
      showVolume: false,
      openselectFav: false,
      favoritesList: [],
      confirmModal: false,
      favoritesName: '',
      nowName: '',
      localPlayer: '本地录像',
      recordpath: '',
      isSpeech: false,
      showAdv: false
    }
  },
  computed: {
    ...mapState({
      curNode: ({ videoOrg }) => videoOrg.curNode,
      parameters: ({ platform }) => platform.parameters,
      strFilter: ({ videoOrg }) => videoOrg.strFilter,
      favData: ({ videoOrg }) => videoOrg.favData,
      pollId: ({ videoOrg }) => videoOrg.pollId
    }),
    plugin() {
      return this.$parent.$refs.frame
    },
    state() {
      return this.$parent.state
    }
  },
  watch: {
    'state.volumeValue'(v) {
      this.volume = v
    },
    showTowall(s) {
      if (s) {
        this.cameraId = this.activeResource.id
      }
    },
    useSubStream(s) {
      window.localStorage.useSubStream = s
    }
  },
  methods: {
    ...mapActions(['addFavorites', 'setFavorites']),
    stopPreview() {
      if (!this.playingCount) {
        return
      }
      this.confirmModal = true
    },
    stopAll() {
      this.plugin.stopAll()
      this.plugin.clearTOpenAll()
      if (this.$route.path === '/veriface/Capture') {
        sessionStorage.setItem('playingCameraList', JSON.stringify([]))
      }
      this.confirmModal = false
    },
    soundOpen() { // 伴音
      if (!this.state.isPlay) { return }
      if (!this.state.isVolumeOpen) {
        this.plugin.openSound()
        this.plugin.setVolume(50)
        this.plugin.getVolume()
        if (this.state.isSpeech) {
          this.intercomClick()
        }
      }
      if (this.state.isVolumeOpen) { this.plugin.closeSound() }
    },
    setVolume(v) { // 设置音量
      if (!this.state.isPlay) { return }
      this.plugin.setVolume(v)
      this.plugin.getCapture()
    },
    getCapture() { // 抓图
      if (!this.state.isPlay) { return }
      this.plugin.getPicture()
    },
    changeFrame(val) { // 多画面
      // this.showFrame = false
      this.plugin.setShowscreen(val.value)
    },
    fullscreen() { // 全屏
      if (!this.state.isPlay) { return }
      if (this.$root.isFullscreen) {
        this.exitFullscreen()
        this.$root.$el.classList.remove('fs')
        this.fs2 = false
        this.$parent.isSingleFullscreen = false
        this.$root.isFullscreen = false
      } else {
        this.$root.$el.classList.add('fs')
        this.fs2 = true
        this.requestFullscreen()
        this.$parent.isSingleFullscreen = true
        this.$root.isFullscreen = true
      }
    }
  },
  created() {
    if (window.localStorage.useSubStream === undefined) {
      window.localStorage.useSubStream = true
    }
    this.useSubStream = window.localStorage.useSubStream === 'true'
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
}

.video-bottom {
  height: 40px !important;
  width: 100%;
  padding: 0;
  position: absolute;
  bottom: 0px;
  background: #1b3153;
  font-size: 12px;
  padding: 0 8px;
}

.video-bottom .video-bottom-left {
  float: left;
  /* margin: 8px 0 8px 0; */
}

.video-bottom .video-bottom-right {
  float: right;
  /* margin: 8px 0 8px 0; */
}

.video-bottom .realbtn {
  padding: 5px 11px;
  height: 36px;
  color: #cfd7e6;
  /* background: #5676aa; */
  /* margin-left: 18px; */
  display: inline-block;
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  font-size: 20px;
}

.video-bottom .realbtn.disable,
.video-bottom .realbtn.disable:hover {
  color: #9298a4;
  /* background: #5676aa; */
  cursor: not-allowed;
}
.video-bottom .realbtn:hover {
  /* background: #fa893b; */
  color: #fda548;
}
.video-bottom .realbtn:active {
  color: #c47019;
  /* background: #d66c23; */
}

.video-bottom .video-bottom-right .realbtn {
  /* margin-right: 18px; */
  margin-left: 0;
}
.video-bottom .showTowall {
  position: absolute;
  list-style: none;
  bottom: 26px;
  left: 0;
  background-color: #1b3153;
  color: #fff;
  border: 1px solid #00a5e3;
  border-radius: 0 0 3px 3px;
  text-align: center;
}
.video-bottom ul {
  z-index: 99999;
  position: absolute;
  list-style: none;
  bottom: 2px;
  color: #fffafa;
  text-align: center;
}
.video-bottom .showTowall {
  width: 150px;
  height: 150px;
  left: -40px;
  z-index: 99999;
}
.quickToWall {
  width: 100%;
  height: 100%;
  z-index: 99999;
}

.video-bottom ul li {
  position: relative;
  z-index: 199999999;
  font-size: 12px;
  line-height: 12px;
  display: inline-block;
  padding: 0 15px;
  border-right: 1px solid rgb(85, 119, 169);
}
.video-bottom ul li:last-child {
  border-right: 0;
}

.video-bottom ul li.active,
.video-bottom ul li:hover {
  color: #fa8a3b;
}
.video-bottom ul li.disable,
.video-bottom ul li.disable:hover {
  color: #878282;
  cursor: not-allowed;
}

.video-bottom ul i {
  display: block;
  position: absolute;
  background: #355284;
  width: 16px;
  height: 16px;
  transform: rotate(45deg);
}

iframe {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}

li.ivu-select-item {
  padding: 7px 16px;
}

.video-bottom-bottom {
  width: 100%;
  height: 40px;
  background: #355284;
  position: absolute;
  left: 0;
  bottom: 0;
}
.video-bottom-jiexian {
  width: 100%;
  border-top: 1px solid #142441;
  border-bottom: 1px solid #263e69;
  position: absolute;
  left: 0;
  bottom: 40px;
}
.multi-screen {
  width: 270px;
  left: -273px;
  background: #335589;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
}
.multi-screen i {
  bottom: 8px;
  left: 260px;
}
.stream-set,
.display-scale,
.recplayback {
  width: 300px;
  left: -130px;
}
.stream-set i,
.display-scale i,
.recplayback i,
.intercom i {
  bottom: 18px;
  left: 140px;
}
.intercom {
  width: 306px;
  left: -130px;
}
.iconmore {
  width: 300px;
  left: -155px;
}
.iconmore i {
  bottom: 20px;
  left: 162px;
}
.sub-stream-check {
  position: absolute;
  width: 100px;
  bottom: 16px;
  right: 148px;
  height: 40px;
  line-height: 40px;
  z-index: 99;
  color: #fff;
}
.video-bottom .ivu-icon-arrow-down-b {
  background: none;
  transform: none;
  font-style: normal;
  right: -1px;
  left: auto;
  bottom: -3px;
}
</style>
