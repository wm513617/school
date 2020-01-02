<!-- 视频结构化追踪-视频回放组件 -->
<template>
  <div>
    <DragX ref="dragx" title="结构化追踪-视频回放" @close="closePlaybackModal" eventType="track" :position="initPosition" :index="99999" :active="true">
      <div class="playback-container"><PlaybackPlugin ref="playback" :defaultPane="4" :configuration="playbackConfiguration" :appendButtos="['showmodeShow']" /></div>
    </DragX>
  </div>
</template>
<script>
import DragX from 'components/dragx/Dragx.vue'
import PlaybackPlugin from 'components/videoComponentsNew/playbackPlugin.vue'
export default {
  name: 'VideosPlayback',
  components: { DragX, PlaybackPlugin },
  data() {
    return {
      initPosition: { // 摄像机列表初始化位置
        left: 849,
        right: 72
      },
      playbackConfiguration: { // 回放配置参数
        progressBar: false, // 进度条
        timeline: false
      }
    }
  },
  props: {
    visiable: { // 摄像机列表是否可见
      type: Boolean,
      default: false
    },
    videos: { // 视频数据
      type: Array,
      default: () => []
    }
  },
  watch: {
    videos: {
      handler(arr) {
        console.log('回放视频播放参数：', JSON.parse(JSON.stringify(arr)))
        if (arr && arr.length) {
          this.playbackVideos() // 回放视频
        } else {
          this.stopPlaybackVideos(true) // 关闭回放视频，保留视频播放插件
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.playbackVideos() // 回放视频
    })
  },
  methods: {
    closePlaybackModal() { // 关闭回放弹窗
      this.$emit('update:visiable', false) // 更新列表显示状态
    },
    playbackVideos() { // 预览视频
      let playback = this.$refs.playback
      if (playback && playback.structuringPlayback && this.videos && this.videos.length) {
        playback.structuringPlayback(this.videos)
      }
    },
    stopPlaybackVideos(flag) { // 关闭预览视频，flag 是否保留视频播放插件
      let playback = this.$refs.playback
      if (playback && playback.stop) {
        playback.stop(undefined, flag) // 关闭全部预览
      }
    }
  },
  beforeDestroy() {
    this.stopPlaybackVideos(false) // 关闭回放视频，销毁视频播放插件
  }
}
</script>
<style scoped>
.playback-container {
  width: 750px;
  height: 450px;
  margin: 6px 8px;
}
</style>
