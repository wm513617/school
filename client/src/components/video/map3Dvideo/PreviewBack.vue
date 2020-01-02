<!--4弹窗播放视频 页面-->
<template>
<div>
  <MapVideoPreview v-if="videoMol === 'video'" :videoParam="mapResource" ref="mapVideo" :toggle.sync="videoMol" @changeFullscreen="changeFullscreen" :style="fullscreenStatus ? '' :'width:600px'"></MapVideoPreview>
  <MapVideoPlayback v-if="videoMol === 'playBack'" :videoParam="mapResource" ref="mapVideo" :toggle.sync="videoMol" style="height:388px;min-width:835px;padding-top:12px;"></MapVideoPlayback>
</div>
</template>
<script>
import MapVideoPreview from './MapVideoPreview'
import MapVideoPlayback from './MapVideoPlayback'
export default {
  name: 'previde-back',
  props: ['mapResource'],
  components: {
    MapVideoPreview,
    MapVideoPlayback
  },
  data() {
    return {
      videoMol: 'video',
      fullscreenStatus: false
    }
  },
  watch: {
    videoMol(val) {
      if (val === 'playBack') {
        this.$store.commit('SET_CURNODE', JSON.parse(JSON.stringify(this.mapResource)))
      }
      this.$emit('getType', val)
    }
  },
  created() {},
  computed: {},
  methods: {
    handleMouseDown() {
      this.$refs['mapVideo'].plugin.moveToCapture()
    },
    handleMouseUp() {
      this.$refs['mapVideo'].plugin.moveToBack()
    },
    changeFullscreen(val) {
      this.fullscreenStatus = val
      console.log(this.fullscreenStatus, 'fullscreenStatus')
    }
  },
  mounted() {}
}
</script>
<style scoped>
</style>
