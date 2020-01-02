<template>
  <div class="mapAppComponent">
    <!-- 三维气泡弹出框 -->
    <feature-popup v-show="showPopup"></feature-popup>
    <!-- 实时单兵头像 -->
    <!-- <div class="single-head-group"></div> -->
    <!-- 三维地图的显示区域 -->
    <alarm-tree v-show="showBuildingAlarm && is3DMapOuter" :buildIngAlarm="treeData"/>
    <div v-if="is3DMapOuter && map3DConfig" class="mapPositionCenter">
      <sm-viewer cesiumPath="/static/supermap3d" class="viewer"  @ready="readyEvt" :animation="false" :selectionIndicator="true" :shouldAnimate="true">
        <!-- 三维地图的绘制工具 -->
        <sm-draw :actived='active3DDraw' type='Polygon' clampMode='space' @drawend='drawFinish' @active="handlerActiveDraw" :isClear.sync="clearExtentDraw"></sm-draw>
        <!-- <drag-box v-if="videoList.length" /> -->
      </sm-viewer>
    </div>
    <!-- 三维地图的显示区域 -->
    <!--楼层平面图的显示区域  -->
    <div v-if="!is3DMapOuter" class="mapPositionCenter">
      <!-- 返回按钮 -->
      <div class="go-back iconfont icon-upper-level" @click="goBack"></div>
      <!--楼层平面图地图部分  -->
      <div class="mapFloorFooter">
        <bs-staticmap class="mapHome" :url="floorOneData.mapUrl" :center="floorOneData.center" :extent="floorOneData.extent" ref="mapFloorContainer" @mousemove="mapMoveEvt"  @click="mapClickEvt" @ready="getMap"  @postcompose="alarmingTwinkEvt">
          <!-- 楼层内网格图层 -->
         <!-- <bs-layer :id="gridLayer.id" :name="gridLayer.name" :zIndex="gridLayer.zIndex" :features="gridFeatureList"></bs-layer>-->
          <!--普通视频点位  -->
          <bs-layer v-for="(item) in layerArr" :key="item.key.id" :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
          <!-- 巡更点位 -->
          <!--<bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :zIndex="patrolLayer.zIndex" :features="patrolFeatureList"></bs-layer>-->
          <!-- 普通报警点位图层 -->
          <!--<bs-layer :id="commonAlarmLayer.id" :name="commonAlarmLayer.name" :zIndex="commonAlarmLayer.zIndex" :features="alarmFeatureList"></bs-layer>-->
          <!-- 消防报警点位图层 -->
          <!--<bs-layer :id="fireAlarmLayer.id" :name="fireAlarmLayer.name" :zIndex="fireAlarmLayer.zIndex" :features="fireAlarmFeatureList"></bs-layer>-->
          <!-- 报警柱图层 -->
          <!--<bs-layer :id="alarmColumnLayer.id" :name="alarmColumnLayer.name" :zIndex="alarmColumnLayer.zIndex" :features="alarmColumnFeatureList"></bs-layer>-->
          <!-- 报警箱图层 -->
          <!--<bs-layer :id="alarmBoxLayer.id" :name="alarmBoxLayer.name" :zIndex="alarmBoxLayer.zIndex" :features="alarmBoxFeatureList"></bs-layer>-->
          <!-- 所有点位的报警闪烁图层 显示报警的信息 -->
          <bs-layer :id="alarmingLayer.id" :name="alarmingLayer.name" :zIndex="alarmingLayer.zIndex" :features="allAlarmingFeatureList"></bs-layer>
          <!-- 高亮图层 -->
          <!--<bs-layer :id="positionLayer.id" :name="positionLayer.name" :zIndex="positionLayer.zIndex" :features="highLightFeatureList" ></bs-layer>-->
          <bs-draw :id="areaQuery.id" :name="areaQuery.name" :type="areaQuery.type" :actived="area2DDrawActive" :layerStyle="areaQuery.layerStyle" :drawStyle="areaQuery.drawStyle" @drawend="drawFinish"></bs-draw>
          <!-- 量算 -->
          <bs-measure :id="measureLayer.id" :name="measureLayer.name" :type="measureLayer.type" :actived.sync="measureLayer.actived" :clear.sync="measureLayer.clear"></bs-measure>
        </bs-staticmap>
      </div>
    </div>
    <!--楼层平面图的显示区域  -->
    <selectBoxVideo @close='closeSelectModel' ref='selectBoxVideoModal'></selectBoxVideo>
  </div>
</template>

<script>
import mapBase from './applyBase'
import featurePopup from './featurePopup'
import alarmTree from '../alarmFun/alarmTree'
import alarmFun from '../alarmFun/alarmFun'
import selectBoxVideo from '../panelTools/alarmVideo/selectBoxVideo'
import mapControl from './mapControl'
export default {
  mixins: [mapBase, alarmFun, mapControl],
  components: {
    alarmTree,
    featurePopup,
    selectBoxVideo
  },
  computed: {
    layerArr() {
      const normal = [
        { key: this.gridLayer, value: this.gridFeatureList }, // 网格
        { key: this.positionLayer, value: this.highLightFeatureList }, // 高亮配置
        { key: this.boltipcLayer, value: this.videoFeatureList }, // 视频
        { key: this.boltipcLabelLayer, value: this.boltipcLabels }, // 枪机label
        { key: this.halfBallipcLabelLayer, value: this.halfBallipcLabels }, // 半球label
        { key: this.fastBallipcLabelLayer, value: this.fastBallipcLabels }, // 快球label
        { key: this.allViewipcLabelLayer, value: this.allViewipcLabels }, // 全景label
        { key: this.redBoltipcLabelLayer, value: this.redBoltipcLabels }, // 红外枪机label
        /* { key: this.verfaceipcLabelLayer, value: this.verfaceipcLabels }, // 人脸label
        { key: this.trafficipcLabelLayer, value: this.trafficipcLabels }, // 交通label */
        { key: this.commonAlarmLayer, value: this.alarmFeatureList }, // 普通报警
        { key: this.commonAlarmLabelLayer, value: this.commonAlarmLabels },
        { key: this.fireAlarmLayer, value: this.fireAlarmFeatureList }, // 消防报警
        { key: this.fireAlarmLabelLayer, value: this.fireAlarmLabels },
        { key: this.alarmBoxLayer, value: this.alarmBoxFeatureList }, // 报警箱
        { key: this.alarmBoxLabelLayer, value: this.alarmBoxLabels },
        { key: this.alarmColumnLayer, value: this.alarmColumnFeatureList }, // 报警柱
        { key: this.alarmColumnLabelLayer, value: this.alarmColumnLabels },
        { key: this.patrolLayer, value: this.patrolFeatureList }, // 巡更
        { key: this.patrolLabelLayer, value: this.patrolLabels }
      ]
      return normal
    }
  }
}
</script>

<style scoped>
.mapAppComponent {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
}
.mapAppComponent .mapPositionCenter,
.mapPositionCenter .mapPositionMain {
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
.go-back {
  position: absolute;
  left: 306px;
  top: 24px;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #1c3053;
  cursor: pointer;
  z-index: 20;
  border-radius: 4px;
}
</style>
