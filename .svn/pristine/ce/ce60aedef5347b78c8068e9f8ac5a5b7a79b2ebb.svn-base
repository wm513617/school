<!--编辑模式 主页面-->
<template>
  <div class="MapComponent">
    <div class="feng-map">
      <FengMapEdit></FengMapEdit>
      <mapEditHeader :style="{'right': page === '' ? '24px' :'320px'}"/>
    </div>
    <panelSearch></panelSearch>
    <div class="mapPosRight" v-if='page !== ""'>
      <mapEditInfo></mapEditInfo>
    </div>
    <!-- 地图服务配置 -->
    <div v-if="mapConfigMol">
      <mapConfig/>
    </div>
    <!-- 中心点重置 -->
    <mapSetting v-if='mapSettingMol'/>
  </div>
</template>
<script>
import panelSearch from './panelSearch/panelSearch'
import FengMapEdit from './baseMap/FengMapEdit'
import mapEditInfo from './pages/mapEditInfo'
import mapEditHeader from './pages/edit/mapEditHeader'
import 'assets/js/fmindexedDB.js'
import mapConfig from './pages/edit/mapConfig'
import mapSetting from './pages/edit/mapSetting'
import { mapState } from 'vuex'
export default {
  components: {
    FengMapEdit,
    mapEditInfo,
    mapEditHeader,
    mapConfig,
    mapSetting,
    panelSearch
  },
  mixins: [],
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      mapConfigMol: ({ mapIndex }) => mapIndex.mapConfigMol, // 地图服务配置
      mapSettingMol: ({ mapIndex }) => mapIndex.mapSettingMol, // 中心点重置
      page: ({ fengMap }) => fengMap.FMEditRightPage.page // 编辑模式地图右侧页面详细
    })
  },
  watch: {
  },
  methods: {
  },
  mounted() {
  },
  beforeDestroy() {
  }
}
</script>
<style lang="less" scoped>
.MapComponent {
  display: flex;
  flex: 1;
}
.feng-map {
  display: flex;
  flex: 1;
}
.mapPosRight {
  position: fixed;
  right: 0;
  top: 89px;
  display: flex;
  height: 75%;
  width: 300px;
  background: #1c3053;
  z-index: 999;
}
.mapEditHeader {
  position: fixed;
  top: 79px;
  display: flex;
}
</style>
