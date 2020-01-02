<template>
  <div ref="leftPanel" class="map-position-left" :style="panelStyle">
    <p class="iconfont" :class="[panelShow?'icon-shrink':'icon-extend']" @click="togglePanelShow"></p>
    <Tabs value="mapOrganization">
      <TabPane label="地图结构" name="mapOrganization">
        <map-edit-tree />
      </TabPane>
      <TabPane  label="点位元素" name="mapPointElement">
        <map-point-control />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import mapEditTree from './3DMapEdittree'
import mapPointControl from './pointControlEdit'
import { mapState } from 'vuex'

export default {
  components: {
    mapEditTree,
    mapPointControl
  },
  data() {
    return {
      panelShow: true
    }
  },
  computed: {
    ...mapState({
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter // 判断是3d地图还是平面地图
    }),
    panelStyle() {
      return this.is3DMapOuter ? { width: '330px' } : { width: '300px' }
    }
  },
  methods: {
    togglePanelShow() {
      this.panelShow = !this.panelShow
      if (this.panelShow) {
        this.$refs['leftPanel'].style.left = '0'
      } else {
        this.$refs['leftPanel'].style.left = this.is3DMapOuter ? '-330px' : '-300px'
      }
    }
  }
}
</script>

<style scoped>
.map-position-left {
  position: fixed;
  left: 0;
  top: 89px;
  display: -ms-flexbox;
  display: flex;
  height: 75%;
  width: 330px;
  background: #1c3053;
  flex-direction: column;
  z-index: 2;
  opacity: 0.78;
  /* transition: all 0.2s ease-in-out; */
}
.mapPositionLeftClass {
  display: flex;
  flex: 1;
  background: #1c3053;
  flex-direction: column;
}
.iconfont {
  position: absolute;
  top: 45%;
  right: -16px;
  width: 16px;
  height: 50px;
  border-radius: 0 6px 6px 0;
  background: #1c3053;
  text-align: center;
  line-height: 50px;
}
.map-position-left .ivu-tabs {
  display: flex !important;
  flex: 1 !important;
  flex-direction: column !important;
}
</style>
<style>
.map-position-left .ivu-tabs .ivu-tabs-content-animated {
  display: flex !important;
  flex: 1 !important;
  /* flex-direction: column !important; */
}
</style>
