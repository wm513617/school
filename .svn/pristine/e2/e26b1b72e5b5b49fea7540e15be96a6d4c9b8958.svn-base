<template>
  <!-- <transition name="shrink"> -->
    <div v-show="isShowPTattr" class="panel" :class="{'offset': isShowToolsPanel}">
      <component :is="attrInfo.type"></component>
      <div class="btn-panel-shrink" @click="closeAttr">
        <div class="shape">
          <Icon class="icon" type="chevron-up" />
        </div>
      </div>
    </div>
  <!-- </transition> -->
</template>

<script>
import AttrVideo from './attributes/AttrVideo'
import AttrAlarm from './attributes/AttrAlarm'
import AttrAlarmHelp from './attributes/AttrAlarmHelp'
import AttrModel from './attributes/AttrModel'
import AttrPatrol from './attributes/AttrPatrol'
import AttrSinglePawn from './attributes/AttrSinglePawn'
import AttrBuilding from './attributes/AttrBuilding'
import AttrFloor from './attributes/AttrFloor'
import AttrGrid from './attributes/AttrGrid'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: { AttrVideo, AttrAlarm, AttrAlarmHelp, AttrModel, AttrPatrol, AttrSinglePawn, AttrBuilding, AttrFloor, AttrGrid },
  computed: {
    ...mapGetters('map3DApplyIX', ['isShowPTattr', 'attrInfo', 'isShowToolsPanel'])
  },
  methods: {
    ...mapActions(['setHighLightList', 'setHighLightLabelList']),
    ...mapActions('map3DApplyIX', ['cleanAttrInfo', 'closePTattr']),
    closeAttr() {
      this.setHighLightList([])
      this.setHighLightLabelList(null)
      this.closePTattr()
    }
  },
  beforeDestroy() {
    this.cleanAttrInfo()
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
</style>
