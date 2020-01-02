<!--编辑模式 控制视频点位的视频预览和录像回放 页面-->
<template>
  <div class="mapVedioPalyInfo" >
    <!-- 视频预览 -->
    <div class="mapAppVideoPlay" @mousedown.stop="handleMouseDown" @mouseup.stop="handleMouseUp">
      <div v-if="videoMol === 'video'">
        <div class="mapAppVideoTittle">
          <div class="detail">视频预览----{{mapResource.name}}</div>
          <div class="close" @click="close">关闭</div>
        </div>
        <div class="mapAppVideoPre">
          <MapVideoPreview :videoParam="mapResource" ref="mapVideo" :toggle.sync="videoMol"></MapVideoPreview>
        </div>
      </div>
      <div v-if="videoMol === 'playBack'">
        <div class="mapAppVideoTittle">
          <div class="detail">录像回放----{{mapResource.name}}</div>
          <div class="close" @click="close">关闭</div>
        </div>
        <div class="mapAppVideoPLayback">
          <MapVideoPlayback :videoParam="mapResource" ref="mapVideo" :toggle.sync="videoMol"></MapVideoPlayback>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import MapVideoPreview from 'components/video/map3Dvideo/MapVideoPreview'
import MapVideoPlayback from 'components/video/map3Dvideo/MapVideoPlayback'
export default {
  props: ['mapResource'],
  components: {
    MapVideoPreview,
    MapVideoPlayback
  },
  data() {
    return {
      videoMol: 'video'
    }
  },
  watch: {
    videoMol(val) {
      console.log(val)
      if (val === 'playBack') {
        this.$store.commit('SET_CURNODE', this.mapResource)
      }
    }
  },
  created() {},
  computed: {
    ...mapState({
      videoList: ({ tdPoint }) => tdPoint.videoList
    })
  },
  methods: {
    ...mapActions(['setVideoPreviewFlag', 'setVideoDragList']),
    close() {
      console.log('this.mapResource', this.mapResource)
      let list = JSON.parse(JSON.stringify(this.videoList))
      list.forEach((item, index) => {
        if (item.data._id === this.mapResource._id) {
          list.splice(index, 1)
          this.setVideoDragList(list)
        }
      })
    },
    handleMouseDown() {
      this.$refs['mapVideo'].plugin.moveToCapture()
    },
    handleMouseUp() {
      this.$refs['mapVideo'].plugin.moveToBack()
    }
  },
  mounted() {
    console.log('this.mapResource', this.mapResource)
  }
}
</script>
<style scoped>
.mapVedioPalyInfo {
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  border-radius: 5px;
}

.mapVedioPalyInfo .mapAppVideoInfo {
  width: 220px;
}

.mapVedioPalyInfo .mapAppVideoPlay .mapAppVideoPre {
  width: 600px;
  height: 400px;
}

.mapAppVideoTittle {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  cursor: move;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
}

.mapAppVideoTittle .reback {
  float: left;
  margin: 0 10px;
}

.mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}

.mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}

.mapVedioPalyInfo .mapAppVideoPlay .mapAppVideoPLayback {
  min-width: 835px;
  height: 400px;
}

.mapVedioPalyInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: 1px solid #444444;
}
</style>
