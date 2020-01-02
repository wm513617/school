<!-- 视频结构化追踪-视频预览组件 -->
<template>
  <div>
    <DragX ref="dragx" title="结构化追踪-视频预览" @close="closePreviewModal" eventType="track" :position="initPosition">
      <div class="preview-container"><PreviewPlugin :isButton="true" :defaultPane="5" :iconShow="iconShowParams" ref="preview"/></div>
    </DragX>
  </div>
</template>
<script>
import DragX from 'components/dragx/Dragx.vue'
import PreviewPlugin from 'components/videoComponentsNew/previewPlugin.vue'
export default {
  name: 'VideosPreview',
  components: { DragX, PreviewPlugin },
  data() {
    return {
      initPosition: {
        // 摄像机列表初始化位置
        left: 849,
        right: 72
      },
      iconShowParams: {
        stopAll: false, // 关闭全部预览
        stop: false, // 关闭单个预览
        screenshot: false, // 截图
        speech: false, // 对讲
        volume: false, // 音量调节
        fullScreen: true, // 全屏
        multiScreen: false, // 画面分割
        panePage: true, // 上一屏、下一屏
        panePageNum: true // 当前屏页码
      }
    }
  },
  props: {
    visiable: {
      // 摄像机列表是否可见
      type: Boolean,
      default: false
    },
    videos: {
      // 视频数据
      type: Array,
      default: () => []
    }
  },
  watch: {
    videos: {
      handler(arr) {
        if (arr && arr.length) {
          this.previewVideos() // 预览视频
        } else {
          this.stopPreviewVideos(true) // 关闭预览视频，保留视频播放插件
        }
      },
      deep: true
    }
  },
  mounted() {
    this.previewVideos() // 预览视频
  },
  methods: {
    closePreviewModal() {
      // 关闭预览弹窗
      this.$emit('update:visiable', false) // 更新列表显示状态
    },
    previewVideos() {
      // 预览视频
      let preview = this.$refs.preview
      if (preview && preview.openAll && this.videos && this.videos.length) {
        preview.openAll(this.videos)
      }
    },
    stopPreviewVideos(flag) {
      // 关闭预览视频，flag 是否保留视频播放插件
      let preview = this.$refs.preview
      if (preview && preview.stopPreviewALL) {
        preview.stopPreviewALL(flag) // 关闭全部预览
      }
    }
  },
  beforeDestroy() {
    this.stopPreviewVideos(false) // 关闭预览视频，销毁视频播放插件
  }
}
</script>
<style scoped>
.preview-container {
  width: 750px;
  height: 450px;
  margin: 6px 8px;
}
</style>
