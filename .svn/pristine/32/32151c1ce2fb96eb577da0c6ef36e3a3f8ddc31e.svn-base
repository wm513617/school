<!--编辑模式 控制视频点位的视频预览和录像回放 页面-->
<template>
  <div class="mapVedioPalyInfo">
    <!-- 视频预览 -->
    <div class="mapAppVideoPlay">
      <div v-if="videoMol === 'video'">
        <div class="mapAppVideoTittle">
          <div class="detail">视频预览----{{pointDataMol.name}}</div>
          <div class="close" @click="close">关闭</div>
        </div>
        <div class="mapAppVideoPre">
          <MapVideoPreview :videoParam="pointDataMol" :toggle.sync="videoMol"></MapVideoPreview>
        </div>
      </div>
      <div v-if="videoMol === 'playBack'">
        <div class="mapAppVideoTittle">
          <div class="detail">录像回放----{{pointDataMol.name}}</div>
          <div class="close" @click="close">关闭</div>
        </div>
        <div class="mapAppVideoPLayback">
          <MapVideoPlayback :videoParam="pointDataMol" :toggle.sync="videoMol"></MapVideoPlayback>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import MapVideoPreview from 'components/video/map3Dvideo/MapVideoPreview'
import MapVideoPlayback from 'components/video/map3Dvideo/MapVideoPlayback'
export default {
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
      if (val === 'playBack') {
        this.$store.commit('SET_CURNODE', this.pointDataMol)
      }
    }
  },
  created() {},
  computed: {
    ...mapState({
      pointDataMol: ({ mapGisData }) => mapGisData.pointData
    })
  },
  methods: {
    ...mapMutations(['SET_EDITDETAIL_STATE', 'SET_CURNODE']),
    close() {
      this.$store.commit('SET_EDITDETAIL_STATE', '')
    }
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
  height: 38px;
  line-height: 38px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
}

.mapAppVideoTittle .reback {
  float: left;
  margin: 0 24px;
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
