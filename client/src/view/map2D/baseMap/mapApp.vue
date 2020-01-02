<template>
  <div class="mapGroup">
    <div v-if="loading" class="mapLoading">
      电子地图加载中...
    </div>
    <div v-else-if="mapConfigArr.length === 0" class="mapLoading">
      电子地图加载失败，请联系管理员...
    </div>
    <div v-if="isPlatformTrack" class="map-track-tip">地图进入接力追踪模式，功能锁定中，点此<span class="out-track" @click="closetrack">&nbsp;退出</span></div>
    <outer-map v-if="isMapOuter" class="mapContainer"></outer-map>
    <building-map v-else class="mapContainer"></building-map>
    <i class="iconfont icon-you" style="display: none;"></i><!-- 轨迹箭头隐藏，勿删！！！ -->
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OuterMap from './OuterMap'
import BuildingMap from './BuildingMap'
import alarmFun from '../alarmFun/alarmFun'
export default {
  components: {OuterMap, BuildingMap},
  mixins: [ alarmFun ],
  computed: {
    ...mapGetters(['isMapOuter', 'mapConfigArr', 'loading']),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack'])
  },
  methods: {
    ...mapActions(['setIsBSMapReady', 'setIsMapOuter', 'setMapPreviewPointList', 'setIsSelectBoxRelayTrack']),
    ...mapActions('map2DApplyIX', ['setIsPlatformTrack', 'closePTattr', 'changeToolsPanelToBoxChoose', 'switchToolsPanel']),
    closetrack() {
      this.setIsPlatformTrack(false)
      this.closePTattr(false)
      this.setMapPreviewPointList([])
      this.changeToolsPanelToBoxChoose('')
      this.switchToolsPanel(false)
      this.setIsSelectBoxRelayTrack(false)
      let _a = JSON.parse(sessionStorage.getItem('trackEvent')).path
      sessionStorage.removeItem('trackEvent')
      this.$router.replace(_a)
    }
  },
  beforeDestroy() {
    this.setIsBSMapReady(false)
  }
}
</script>

<style scoped>
.mapGroup {
  width: 100%;
  height: 100%;
}
.mapLoading {
  position: relative;
  color: white;
  text-align: center;
  vertical-align: center;
  padding-top: 25%;
}
.mapContainer {
  width: 100%;
  height: 100%;
}
.mapItem {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
.mapHome {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.map-track-tip {
  clear: both;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
  border-radius: 4px;
  position: absolute;
  top: 20px;
  left: 50%;
  margin-left: -131px;
  z-index: 1000;
  padding: 0 5px;
}
.out-track {
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}
</style>
