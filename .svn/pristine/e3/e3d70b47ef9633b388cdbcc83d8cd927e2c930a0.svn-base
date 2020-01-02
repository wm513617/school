<template>
  <div ref="leftPanel" class="map-position-left" :style="panelStyle">
    <p class="iconfont" :class="[leftFMPanelShow?'icon-shrink':'icon-extend']" @click="togglePanelShow"></p>
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
import mapEditTree from './FMapEdittree'
import mapPointControl from './pointControlEdit'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    mapEditTree,
    mapPointControl
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('fengMap', ['leftFMPanelShow']),
    panelStyle() {
      return { width: '330px' }
    }
  },
  methods: {
    ...mapActions('fengMap', ['setLeftPanelShow']),
    togglePanelShow() {
      let panelShow = !this.leftFMPanelShow
      this.setLeftPanelShow(panelShow)
      if (panelShow) {
        this.$refs['leftPanel'].style.left = '0'
      } else {
        this.$refs['leftPanel'].style.left = '-330px'
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
  bottom: 24px;
  display: -ms-flexbox;
  display: flex;
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
