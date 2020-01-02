<template>
  <div id="playback">
    <ul class="header">
      <li @click="showName='video'" :class="{'active':showName=='video'}">常规回放</li>
      <li @click="showName='picture'" :class="{'active':showName=='picture'}">图片检索</li>
      <li @click="showName='download'" :class="{'active':showName=='download'}">下载</li>
    </ul>

    <div class="main">
      <playRecord v-if="showName=='video'"></playRecord>
      <pictureRecord v-if="showName=='picture'"></pictureRecord>
      <playDownload v-if="showName=='download'"></playDownload>
    </div>
  </div>
</template>
<script>
import playRecord from './playback/playrecord/playrecord.vue'
import pictureRecord from './playback/playpicture/pictureRecord.vue'
import playDownload from './playback/downloadrecord/playDownload.vue'
export default {
  name: 'playback',
  components: {
    playRecord,
    pictureRecord,
    playDownload
  },
  data() {
    return {
      showName: 'video'
    }
  },
  mounted() {
  },
  methods: {
  },
  beforeDestroy() {
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style scoped>
#playback {
  height: 100%;
  width: 100%;
  position: relative;
  padding: 5px;
  background: #1e2225;
  min-width: 1280px;
}
#playback > .header {
  width: 100%;
  height: 32px;
  line-height: 30px;
  font-size: 14px;
  color: #fff;
  border-bottom: 1px solid #e4e4e4;
}
#playback .header li {
  float: left;
  padding: 0 15px;
  cursor: pointer;
  list-style: none;
}
#playback .header li.active,
#playback .header li:hover {
  color: #00a5e3;
  border-bottom: 2px solid #00a5e3;
}
#playback > .main {
  width: 100%;
  padding-top: 10px;
  height: calc(100% - 30px);
}
</style>
