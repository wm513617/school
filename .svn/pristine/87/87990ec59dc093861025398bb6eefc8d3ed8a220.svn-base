<!--编辑模式 主页面-->
<template>
  <div class="MapComponent">
    <div class="base-map">
      <mapEdit></mapEdit>
      <mapEditHeader :style="{'right': page === '' ? '24px' :'320px'}"/>
    </div>
    <panelSearch></panelSearch>
    <div class="mapPosRight" v-if='page !== ""'>
      <mapEditInfo></mapEditInfo>
    </div>
    <!-- 弹窗 -->
    <!-- <dragContainer v-if="editPageDetail" selectAreaClassName='mapAppVideoTittle' :position="{left: dragContainerPositionLeft, top: 0}"> -->
    <!-- </dragContainer> -->
    <div v-if="mapConfigMol">
      <mapConfig/>
    </div>
    <mapSetting v-if='mapSettingMol'/>
    <DragVideo v-if="pointVideoList.length"  modelType="2DEdit"/>
  </div>
</template>
<script>
import panelSearch from './panelSearch/panelSearch'
import mapEditInfo from './pages/mapEditInfo'
import mapEditHeader from './pages/edit/mapEditHeader'
import DragVideo from 'components/video/DragVideo'
import mapEdit from './baseMap/mapEdit'
import mapConfig from './pages/edit/mapConfig'
import mapSetting from './pages/edit/mapSetting'
import { mapState } from 'vuex'
export default {
  components: {
    panelSearch,
    mapConfig,
    DragVideo,
    mapSetting,
    mapEditHeader,
    mapEditInfo,
    mapEdit
  },
  mixins: [],
  data() {
    return {
    }
  },
  computed: {
    ...mapState({
      pointVideoList: ({ mapIndex }) => mapIndex.pointVideoList,
      page: ({ mapIndex }) => mapIndex.mapEditRightPage.page, // 编辑模式地图右侧页面详细
      mapConfigMol: ({ mapIndex }) => mapIndex.mapConfigMol,
      mapSettingMol: ({ mapIndex }) => mapIndex.mapSettingMol,
      detail: ({ mapIndex }) => mapIndex.mapEditRightPage.detail
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
.base-map {
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
}
.mapEditHeader {
  position: fixed;
  top: 79px;
  display: flex;
}
</style>
