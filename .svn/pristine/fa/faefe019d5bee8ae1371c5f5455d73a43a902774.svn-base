<template>
  <div class="mapGroup">
    <div v-if="loading" class="mapLoading">
      电子地图加载中...
    </div>
    <outer-map v-if="isMapOuter" class="mapContainer"></outer-map>
    <building-map v-else class="mapContainer"></building-map>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OuterMap from './OuterMap'
import BuildingMap from './BuildingMap'
export default {
  components: {OuterMap, BuildingMap},
  computed: {
    ...mapGetters(['isMapOuter', 'mapConfigArr', 'loading'])
  },
  methods: {
    ...mapActions(['setIsBSMapReady', 'setIsMapOuter'])
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
</style>
