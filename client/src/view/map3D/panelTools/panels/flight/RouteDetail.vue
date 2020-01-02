<!-- 飞行路线详情面板 -->
<template>
  <div class="detail-container">
    <Form :label-width="75" label-position="left">
      <FormItem label="名称">
        <Input v-model="selectedRoute.name" readonly style="width: 85%;"/>
      </FormItem>
      <FormItem label="视角">
        <Select v-model="selectedRoute.viewMode" disabled style="width: 85%;">
            <Option v-for="(item, index) in viewModes" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
      </FormItem>
      <FormItem v-if="showViewHeight" label="视角高度">
        <Input v-model="selectedRoute.viewHeight" readonly style="width: 85%;"/>
      </FormItem>
      <FormItem label="速度">
        <Input v-model="selectedRoute.speed" readonly style="width: 85%;"/>
      </FormItem>
      <FormItem label="经度">
        <Input v-model="geoMarker.coordinate[0]" readonly style="width: 85%;"/> °
      </FormItem>
      <FormItem label="纬度">
        <Input v-model="geoMarker.coordinate[0]" readonly style="width: 85%;"/> °
      </FormItem>
      <FormItem label="高度">
        <Input v-model="geoMarker.coordinate[1]" readonly style="width: 85%;"/> 米
      </FormItem>
      <FormItem label="路线总长">
        <Input v-model="geoMarker.routeLength" readonly style="width: 85%;"/> 米
      </FormItem>
      <FormItem label="漫游长度">
        <Input v-model="geoMarker.passedLength" readonly style="width: 85%;"/> 米
      </FormItem>
      <FormItem label="漫游进度">
        <Progress :percent="passedProgress" status="active" :stroke-width="5" style="width: 175px;"/>
      </FormItem>
    </Form>
    <div class="detail-foot">
      <Button title="暂停漫游动画" @click="stopTravelFlying">暂停</Button>
      <Button type="primary" title="播放漫游动画" @click="playTravelFlying">播放</Button>
    </div>
  </div>
</template>
<script>
import { viewModes } from './init'
import mapUtil from 'assets/3DMap/mapUtil.js'
export default {
  data() {
    return {
      viewModes: viewModes // 视角模式
    }
  },
  props: {
    selectedRoute: {
      type: Object,
      default: null
    },
    geoMarker: {
      type: Object
    }
  },
  computed: {
    showViewHeight() { // 是否显示视角高度
      let flag = true
      if (this.selectedRoute.viewMode === mapUtil.VIEWMODE.tracklook) {
        flag = false
      }
      return flag
    },
    passedProgress() { // 飞行进度
      let progress = 0
      if (this.geoMarker.routeLength !== 0) {
        progress = (this.geoMarker.passedLength / this.geoMarker.routeLength) * 100
      }
      return Number(progress.toFixed(2))
    }
  },
  methods: {
    stopTravelFlying() {
      this.$context.viewer.clock.shouldAnimate = false
    },
    playTravelFlying() {
      let clock = this.$context.viewer.clock
      clock.shouldAnimate = true
      if (clock.currentTime.secondsOfDay >= clock.stopTime.secondsOfDay) {
        clock.currentTime = clock.startTime
      }
    }
  },
  mounted() {

  }
}
</script>
<style scoped>
.detail-container {
  overflow-x: hidden;
  overflow-y: auto;
}
.detail-foot {
  margin-top: 24px;
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.detail-foot button {
  margin: 0 8px;
  height: 32px;
}
</style>
