<template>
  <div style="height: 100%">
    <AlarmVideoPreview :class="{outofscreen: isPlayback === true}" :toggleView.sync="isPlayback" ref="AlarmVideoPreview" @emergencyPlan="emergencyPlan"></AlarmVideoPreview>
    <AlarmVideoPlayback :class="{outofscreen: isPlayback === false, noshow: isPlayback === null}" :toggleView.sync="isPlayback" ref="AlarmVideoPlayback" @emergencyPlan="emergencyPlan"></AlarmVideoPlayback>
  </div>
</template>
<script>
import AlarmVideoPreview from './AlarmVideoPreview'
import AlarmVideoPlayback from './AlarmVideoPlayback'
export default {
  components: {
    AlarmVideoPreview,
    AlarmVideoPlayback
  },
  props: {
    selectedInfo: {
      default: null
    }
  },
  data() {
    return {
      isPlayback: null
    }
  },
  methods: {
    closeVideo(p) {
      if (this.isPlayback) {
        // 如果在处警页面 要把处警的视频关了
        this.$refs.AlarmVideoPlayback.closeVideo(p)
      }
      return this.$refs.AlarmVideoPreview.closeVideo(p)
    },
    closeAllVideo() {
      return this.$refs.AlarmVideoPreview.closeAllVideo()
    },
    pushNewVideo(p) {
      return this.$refs.AlarmVideoPreview.pushNewVideo(p)
    },
    emergencyPlan(v) {
      this.$emit('emergencyPlan', v)
    }
  },
  mounted() {
    this.isPlayback = false
  }
}
</script>
<style scoped lang="less">
.outofscreen {
  position: absolute;
  top: -9999px;
}

.noshow {
  visibility: hidden;
}

</style>
