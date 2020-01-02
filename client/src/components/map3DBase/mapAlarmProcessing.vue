<template>
  <div class="map-base">
    <div v-if="is3DMapOuter && map3DConfig" class="mapPositionCenter">
      <sm-viewer cesiumPath="/static/supermap3d" class="viewer"  @ready="readyEvt" :animation="false" :selectionIndicator="true" :shouldAnimate="true" :navigation="false">
      </sm-viewer>
    </div>
    <!-- 三维地图的显示区域 -->
    <!--楼层平面图的显示区域  -->
    <div v-if="!is3DMapOuter" class="mapPositionCenter">
      <!--楼层平面图地图部分  -->
      <div class="mapFloorFooter">
        <bs-staticmap class="mapHome" :url="floorOneData.mapUrl" :center="floorOneData.center" :extent="floorOneData.extent" ref="mapFloorContainer" @click="mapClickEvt" @ready="getMap"  @postcompose="alarmingTwinkEvt">
            <!-- 普通报警点位图层 胡红勋添加 -->
            <bs-layer v-if="modeType === 'alarmProcessing'"  :id="commonAlarmLayer.id" :name="commonAlarmLayer.name"  :zIndex="4" :features="alarmFeatureList"></bs-layer>
            <!-- 巡更点位 胡红勋添加-->
            <bs-layer v-if="modeType === 'patrol'" :id="patrolLayer.id" :name="patrolLayer.name"  :zIndex="3" :features="patrolFeatureList"></bs-layer>
            <!-- 消防报警点位图层 胡红勋添加 -->
            <bs-layer v-if="modeType === 'fireAlarm'" :id="fireAlarmLayer.id" :name="fireAlarmLayer.name"  :zIndex="6" :features="fireAlarmFeatureList"></bs-layer>
            <!-- 报警箱图层 胡红勋-->
            <bs-layer v-if="modeType === 'alarmProcessing'"  :id="alarmBoxLayer.id" :name="alarmBoxLayer.name"  :zIndex="5" :features="alarmBoxFeatureList"></bs-layer>
            <!-- 报警柱图层 胡红勋-->
            <bs-layer v-if="modeType === 'alarmProcessing'"  :id="alarmColumnLayer.id" :name="alarmColumnLayer.name"  :zIndex="7" :features="alarmColumnFeatureList"></bs-layer>
             <!-- 所有点位的报警闪烁图层 胡红勋，显示报警的信息 -->
            <bs-layer :id="alarmingLayer.id" :name="alarmingLayer.name"  :zIndex="9" :features="alarmingFeatureList"></bs-layer>
        </bs-staticmap>
      </div>
    </div>
  </div>
</template>

<script>
import mapBase from './mapBase.js'
import alarmBase from './alarmFunBase'
export default {
  props: {
    modeType: {
      type: String,
      default: 'alarmProcessing'
    }
  },
  mixins: [mapBase, alarmBase]
}
</script>
<style scoped>
.map-base {
  height: 100%;
  display: flex;
}
.mapAppComponent {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
}
.mapPositionCenter {
  width: 100%;
}
.mapAppComponent .mapPositionCenter,
.mapPositionCenter .mapPositionMain {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  clear: both;
}
.mapAppComponent .mapPositionCenter .flagClss,
.mapAppComponent .mapPositionCenter .mapFloorFooter {
  position: relative;
  display: flex;
  flex: 1;
}
.mapAppComponent .mapPositionCenter .mapFloorCon {
  flex: 1;
  display: flex;
  flex-direction: row;
  clear: both;
}
.mapAppComponent .mapPositionCenter .mapFloor {
  display: flex;
  flex: 1;
  float: left;
  height: 100%;
  flex-direction: column;
}
.mapAppComponent .mapPositionCenter .mapFloor .mapFloorHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
}
.mapFloorBtn {
  height: 40px;
  width: 60px;
  text-align: center;
  line-height: 40px;
  background-color: #1c3053;
}
.mapHome {
  display: flex;
  flex: 1;
}
</style>
