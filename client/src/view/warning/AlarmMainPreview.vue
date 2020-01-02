<!--报警主机 切换通道时的视频预览功能 页面-->
<template>
  <div class="mapVideoPreview" :style="{'width': videoWidth + 'px'}">
    <!-- <button type="button" class="closeBtn icon iconfont icon-close1" v-show="showCloseBtn" @click="onClose"></button> -->
    <simple-previewPlugin ref="frame" style="height:365px" :style="{'width': (videoWidth - 30) + 'px'}" @on-click="controlOver"></simple-previewPlugin>
    <div class="overOperate" :style="{'width': (videoWidth - 30) + 'px'}" v-show="displayOperate">
      <iframe></iframe>
      <div style="float:left;">
        <i class="icon iconfont playStyle" :class="{'icon-preview': !isplay, 'icon-preview-stop':isplay, 'disable': playState}"
        :title="[isplay ? '关闭预览' : '打开预览']" @click="controlPlay(isplay)"></i>
      </div>
    </div>
  </div>
</template>
<script>
import SimplePreviewPlugin from 'components/video/SimplePreviewPlugin'
export default {
  components: {
    SimplePreviewPlugin
  },
  props: {
    // 是否显示关闭按钮
    showCloseBtn: {
      type: Boolean,
      default: true
    },
    // 视频组件宽度
    videoWidth: {
      type: Number,
      default: 550
    },
    // 视频层是否有点击事件
    isOverlay: {
      type: Boolean,
      default: true
    },
    // 开流所需参数
    videoParam: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isplay: false, // 当前是否在播放
      playState: false, // 播放按钮是否禁用
      displayOperate: false, // 叠加层是否显示
      repeatPlayParam: {} // 重新开流时需要的参数
    }
  },
  computed: {
    openParam() {
      if (!this.videoParam.id) { return }
      let channelMessage = {
        id: this.videoParam._id,
        ip: this.videoParam.eid.ip,
        port: this.videoParam.eid.cport,
        channel: this.videoParam.chan,
        streamType: this.videoParam.stream,
        type: 'video',
        vendor: this.videoParam.eid.manufacturer
      }
      if (this.videoParam.nodeId) {
        channelMessage = {
          ...channelMessage,
          gbDevId: this.videoParam.nodeId,
          shareServer: this.videoParam.shareServer
        }
      }
      return channelMessage
    }
  },
  // 监听通道变化
  watch: {
    videoParam: {
      handler: function() {
        if (this.videoParam.id) {
          this.onClose()
          this.open(this.videoParam)
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 控制预览功能遮罩层
     */
    controlOver() {
      if (!this.isOverlay) { return }
      this.displayOperate = !this.displayOperate
    },
    /**
     * 开流
    */
    async open(params = this.openParam) {
      this.repeatPlayParam = params
      console.log('执行开流')
      await this.plugin.open(params)
      this.isplay = true
      if (this.isOverlay) {
        this.displayOperate = true
      }
    },
    /**
     * 关流
    */
    onClose() {
      console.log('执行关流')
      this.plugin.close()
      this.isplay = false
      this.$emit('needClearParam')
    },
    /**
     * 控制当前按钮是要开流还是关流
     */
    controlPlay(val) {
      if (val) {
        // 当前是预览状态，需要关闭预览
        this.onClose()
      } else {
        // 当前是关闭预览状态，需要打开预览,通知父组件
        this.open(this.repeatPlayParam)
      }
    }
  },
  async mounted() {
    await this.$nextTick()
    this.plugin = this.$refs.frame
  },
  beforeDestroy() {
    this.onClose()
    this.plugin = null
  }
}
</script>
<style scoped>
.mapVideoPreview {
  height: 100%;
  padding: 0 5px;
  position: relative;
}
.closeBtn {
  float:right;
  /* line-height: 46px;
  height: 46px; */
  font-size: 13px;
  color: #a8a8a8 !important;
  outline: none;
  opacity: 1 !important;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
.overOperate {
  height: 40px;
  background: black;
  position:absolute;
  top:325px;
}
iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 0 none;
  z-index: 100;
  top: 0;
  left: 0;
}
.playStyle{
  display: inline-block;
  margin: 5px 10px;
  cursor: pointer;
  position: absolute;
  z-index: 9999;
}
.disable,
.disable:hover {
  color: #878282;
}
</style>
