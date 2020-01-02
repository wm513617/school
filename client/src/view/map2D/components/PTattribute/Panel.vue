<template>
  <!-- <transition name="shrink"> -->
  <div>
    <div class="panel" v-if="isInfoPanelFixed && showMapResourceAttributes" :class="{'offset': isShowToolsPanel || isGridStatistic}">
      <component :is="mapResourceAttributes.type"></component>
      <div class="btn-panel-shrink" @click="hidePanel">
        <div class="shape" title="收起">
          <Icon class="icon" type="chevron-up" />
        </div>
      </div>
    </div>
    <div class="grid-statistic" v-if="isGridStatistic && showMapResourceAttributes">
      <MapCount/>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
import AttrVideo from './attributes/AttrVideo'
import AttrAlarm from './attributes/AttrAlarm'
import AttrAlarmHelp from './attributes/AttrAlarmHelp'
import AttrPatrol from './attributes/AttrPatrol'
import AttrSinglePawn from './attributes/AttrSinglePawn'
import AttrBuilding from './attributes/AttrBuilding'
import AttrGrid from './attributes/AttrGrid'
import AttrDoorControl from './attributes/AttrDoorControl'
import AttrBuildingAlarm from './attributes/AttrBuildingAlarm'
import MapCount from '../../panelTools/panels/mapCount'
import { RESOURCETYPE } from 'src/assets/2DMap/meta/common'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
export default {
  components: { AttrVideo, AttrAlarm, AttrAlarmHelp, AttrPatrol, AttrSinglePawn, AttrBuilding, AttrGrid, AttrDoorControl, MapCount, AttrBuildingAlarm },
  computed: {
    ...mapState({
      isGridStatistic: ({ map2DApplyIX }) => map2DApplyIX.isGridStatistic
    }),
    ...mapGetters(['mapResourceAttributes', 'showMapResourceAttributes', 'selectedTreeNode', 'selectedMapPointRes', 'currentGrid', 'currentBuilding']),
    ...mapGetters('map2DApplyIX', ['isShowToolsPanel', 'isInfoPanelFixed'])
  },
  methods: {
    ...mapMutations(['SET_SHOW_MAP_RESOURCE_ATTRIBUTES', 'SET_LOCATE_AREA_FEATURES', 'SET_LOCATE_FEATURES']),
    ...mapMutations('map2DApplyIX', ['CHANGE_IS_GRID_STATISTIC']),
    ...mapActions(['setSelectedMapPointRes', 'setCurrentGrid', 'setCurrentBuilding']),
    ...mapMutations('mapAlarm', ['CHANGE_REPORT_POLICE', 'CHANGE_REPORT_POLICE_RESOURCE']),
    hidePanel() { // 隐藏面板
      let rType = this.mapResourceAttributes.rType
      switch (rType) {
        case RESOURCETYPE.grid:
          this.setCurrentGrid(null)
          break
        case RESOURCETYPE.building:
          this.setCurrentBuilding(null)
          break
        default:
          this.setSelectedMapPointRes(null)
          break
      }
      // this.SET_LOCATE_AREA_FEATURES([]) // 清空区域定位要素
      // this.SET_LOCATE_FEATURES([]) // 清空点位定位要素
      this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false) // 关闭资源属性面板
      this.isGridStatistic && this.CHANGE_IS_GRID_STATISTIC(!this.isGridStatistic) // 关闭网格统计面板
    },
    changeRoportPoliceStatus() {
      if (this.selectedMapPointRes && this.mapResourceAttributes.type === 'AttrVideo') {
        this.CHANGE_REPORT_POLICE(true)
        this.CHANGE_REPORT_POLICE_RESOURCE([{resource: this.selectedMapPointRes._id}])
      } else {
        this.CHANGE_REPORT_POLICE(false)
        this.CHANGE_REPORT_POLICE_RESOURCE([])
      }
    }
  },
  watch: {
    showMapResourceAttributes(flag) { // 是否显示属性信息面板
      if (!flag) {
        this.SET_LOCATE_AREA_FEATURES([]) // 清空区域定位要素
        this.SET_LOCATE_FEATURES([]) // 清空点位定位要素
      }
    },
    mapResourceAttributes(val) { // 监听面板类型变化, 控制一键报案显隐
      this.changeRoportPoliceStatus()
      if (val.type !== 'AttrGrid') {
        this.isGridStatistic && this.CHANGE_IS_GRID_STATISTIC(false)
      }
    },
    selectedMapPointRes(val) { // 监听视频面板显隐, 控制一键报案显隐
      this.changeRoportPoliceStatus()
    }
  },
  beforeDestroy() {
  }
}
</script>

<style lang="less" scoped>
  .panel {
    position: absolute;
    width: 240px;
    height: auto;
    right: 64px;
    top: 0;
    z-index: 10;
    background: #1b3153;
    &.offset {
      right: 336px;
    }
    .btn-panel-shrink {
      width: 86px;
      height: 16px;
      position: absolute;
      left: 50%;
      margin-left: -43px;
      bottom: -16px;
      cursor: pointer;
      overflow: hidden;
      .shape {
        position: absolute;
        bottom: -16px;
        width: 86px;
        height: 16px;
        border: 16px solid transparent;
        border-top: 16px solid #0f2343;
      }
      .icon {
        position: absolute;
        bottom: 1px;
        left: 50%;
        margin-left: -4px;
      }
    }
  }
  // 收缩过渡动画
  // .shrink-enter-active {
  //   transition: all .3s ease;
  // }
  // .shrink-leave-active {
  //   transition: all .3s ease;
  // }
  .shrink-enter, .shrink-leave-to {
    transform: translateY(-240px);
    opacity: 0;
  }
  .grid-statistic {
    width: 272px;
    height: 100%;
    position: absolute;
    z-index: 99;
    right: 64px;
  }
</style>
