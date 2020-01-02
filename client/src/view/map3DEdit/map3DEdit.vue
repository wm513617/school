<template>
  <div class="map-3d">
    <!-- 左侧搜索结构、点位面板 -->
    <section class="panel-search">
      <panel-search />
    </section>
    <!-- 右侧收缩工具栏面板 -->
    <section class="panel-tools">
      <panel-tools />
    </section>
    <!-- 全屏底图 -->
    <section class="base-map">
      <base-map />
    </section>
  </div>
</template>

<script>
// 引入三个模块组件
import baseMap from './baseMap/map3DEdit'
import panelSearch from './panelSearch/panelSearch'
import panelTools from './panelTools/panelTools'
export default {
  components: {
    baseMap,
    panelSearch,
    panelTools
  }
}
</script>

<style lang="less" scoped>
.map-3d {
  width: 100%;
  height: 100%;
  position: relative;
  .base-map {
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .panel-tools {
    height: calc(~'100% - 10px');
    position: absolute;
    top: 10px;
    right: 0;
    z-index: 99;
  }
  .panel-search {
    position: absolute;
    z-index: 99;
  }
}
</style>
