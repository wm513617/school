<!--应用模式 点击视频点位的气泡弹框页面 -->
<template>
  <div class="mapAppInfoPoint">
    <div v-if="!videoPlay" class="mapAppVideoInfo">
      <div class="mapAppInfoTittle">
        <div class="mapAppVideoTittle">
          <div class="detail">设备信息</div>
          <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
        </div>
      </div>
      <div class="mapAppInfoContent">
        <div class="infoTop">
          <div class="infoDetail">
            <div class="infoLabel">名称</div>
            <div class="infoValue">{{pointDataMol.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">状态</div>
            <div class="infoValue">{{pointDataMol.status === 0 ? '离线':'在线'}}</div>
          </div>
          <!-- <div class="infoDetail">
              <div class="infoLabel">所属网格</div>
              <div class="infoValue">{{pointDataMol.name}}</div>
            </div> -->
          <div class="infoDetail">
            <div class="infoLabel">厂商</div>
            <div class="infoValue">{{ (pointDataMol.eid && pointDataMol.eid.manufacturer) ? pointDataMol.eid.manufacturer : '-'}}</div>
          </div>
          <div v-for="(item, index) in pointDataMol.point.principal" :key="index">
            <div class="infoDetail">
              <div class="infoLabel">负责人</div>
              <div class="infoValue">{{item.name}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">电话</div>
              <div class="infoValue">{{item.mobile}}</div>
            </div>
          </div>
          <Button type="primary" @click="videoPreview">视频预览</Button>
          <Button type="primary" @click="videoPlayBack">录像回放</Button>
        </div>
      </div>
    </div>
    <!-- 视频预览 -->
    <div v-if="videoPlay" class="mapAppVideoPlay">
      <div v-if="videoMol === 'video'">
        <div class="mapAppVideoTittle">
          <div class="reback iconfont icon-move-left" @click="reback" title="返回"></div>
          <div class="detail">视频预览----{{pointDataMol.name}}</div>
          <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
        </div>
        <div class="mapAppVideoPre">
          <MapVideoPreview :videoParam="pointDataMol" :toggle.sync="videoMol"></MapVideoPreview>
        </div>
      </div>
      <div v-if="videoMol === 'playBack'">
        <div class="mapAppVideoTittle">
          <div class="reback iconfont icon-move-left" @click="reback" title="返回"></div>
          <div class="detail">录像回放----{{pointDataMol.name}}</div>
          <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
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
      videoPlay: false,
      videoMol: 'video'
    }
  },
  computed: {
    ...mapState({
      pointDataMol: ({ mapGisData }) => mapGisData.pointData,
      appPageDetail: ({ mapAreaData }) => mapAreaData.appPageDetail
    })
  },
  watch: {
    pointDataMol(val) {
      this.videoPlay = false
    }
  },
  methods: {
    ...mapMutations(['SET_APPDETAIL_STATE']),
    videoPreview() {
      this.videoPlay = true
      this.videoMol = 'video'
    },
    videoPlayBack() {
      this.videoPlay = true
      this.videoMol = 'playBack'
      this.$store.commit('SET_CURNODE', this.pointDataMol)
    },
    reback() {
      this.videoPlay = false
    },
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
      this.$store.commit('SET_CURNODE', [])
    }
  },
  beforeDestroy() {
    this.videoPlay = false
  }
}
</script>
<style scoped>
.mapAppInfoPoint {
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  border-radius: 5px;
  display: flex;
  flex: 1;
  /* width: 300px; */
}
.mapAppInfoPoint .mapAppVideoInfo {
  width: 300px;
}
.mapAppInfoPoint .mapAppVideoPlay .mapAppVideoPre {
  width: 600px;
  height: 400px;
}
.mapAppInfoPoint .mapAppVideoTittle {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
}
.mapAppInfoPoint .mapAppVideoTittle .reback {
  float: left;
  margin: 0 10px;
}
.mapAppInfoPoint .mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}
.mapAppInfoPoint .mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}
.mapAppInfoPoint .mapAppVideoPlay .mapAppVideoPLayback {
  width: 800px;
  height: 400px;
}
.mapAppInfoPoint .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: #1c3053;
}
.mapAppInfoPoint .mapAppInfoContent {
  width: 100%;
  clear: both;
  padding: 10px;
}
.mapAppInfoPoint .mapAppInfoContent .infoDetail {
  width: 100%;
  height: 26px;
  line-height: 26px;
  clear: both;
}
.mapAppInfoPoint .mapAppInfoContent .infoDetail .infoLabel {
  width: 60px;
}
.mapAppInfoPoint .mapAppInfoContent .infoDetail > div {
  float: left;
}
</style>
