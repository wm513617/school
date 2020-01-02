<template>
  <div>
    <div class="panel" v-if="isInfoPanelFixed && getShowFengMapResourceAttributesPanel">
      <component :is="getFengMapResourceAttributes.compontentType" ></component>
      <div class="btn-panel-shrink" @click="hidePanel">
        <div class="shape" title="收起">
          <Icon class="icon" type="chevron-up" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapGetters, mapActions} from 'vuex'
import AttrAlarm from './attributes/AttrAlarm'
import AttrAlarmHelp from './attributes/AttrAlarmHelp'
import AttrDoorControl from './attributes/AttrDoorControl'
import AttrPatrol from './attributes/AttrPatrol'
import AttrSingle from './attributes/AttrSingle'
import AttrVideo from './attributes/AttrVideo'
export default {
  name: 'panel',
  computed: {
    ...mapGetters('fengMapPoint', ['getFengMapResourceAttributes', 'getShowFengMapResourceAttributesPanel']),
    ...mapGetters('fengMapApplyInteractive', ['isShowToolsPanel', 'isInfoPanelFixed']) // 固定悬浮状态
  },
  methods: {
    ...mapMutations('fengMapPoint', ['SET_FENGMAP_PANEL_STATUS']),
    hidePanel() {
      this.SET_FENGMAP_PANEL_STATUS(false) // 设置固定面板显隐状态
    }
  },
  components: {
    AttrAlarm,
    AttrAlarmHelp,
    AttrDoorControl,
    AttrPatrol,
    AttrSingle,
    AttrVideo
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
