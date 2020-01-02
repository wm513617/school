<template>
  <div class="MapComponent">
    <!-- 三维地图部分 开始 -->
    <!-- 地图配置弹出框 -->
    <param-config-modal />
    <view-setting />
    <!-- 楼层平面地图头部 -->
    <div class="mapHeader" ref="mapHeader">
      <span v-if="!is3DMapOuter" class="iconfont icon-zuo" @click="goBack" title="返回"></span>
      <span v-if="is3DMapOuter" class="iconfont icon-fuzhugan" @click="addPole" title="添加立杆"></span>
      <span v-if="is3DMapOuter" class="iconfont icon-loufangdianwei" @click="building" title="楼宇"></span>
      <span v-if="is3DMapOuter" class="iconfont icon-ditupeizhi" @click="mapSetting" title="地图配置"></span>
      <span v-if="is3DMapOuter" class="iconfont icon-preview" @click="mapViewSetting" title="视角配置"></span>
      <span v-if="!is3DMapOuter" class="iconfont icon-grid" @click="addGrid" title="网格"></span>
    </div>
    <div class="mapPositionCenter" v-if="is3DMapOuter && map3DConfig" ref="mapBase">
        <sm-viewer cesiumPath="/static/supermap3d" class="viewer"  @ready="readyEvt" :animation="false" :selectionIndicator="true">
          <sm-draw :actived='active3DDraw' type='Point' clampMode='space' @drawend="drawPointFinish" :isClear.sync='isClearTempDrawPositon'></sm-draw>
          <sm-draw :actived='active3DChangePositionDraw' type='Point' clampMode='space' @drawend="changeModelPosition" :isClear.sync='isClearTempEditPositon'></sm-draw>
        </sm-viewer>
        <!-- 弹窗 -->
        <dragContainer v-if="videoPreviewFlag" selectAreaClassName='mapAppVideoTittle' :position="{left: dragContainerPositionLeft, top: 0}">
          <!-- <mapEditInfoWindow></mapEditInfoWindow> -->
          <video-preview />
        </dragContainer>
    </div>
     <!-- 三维地图部分 结束-->
    <!-- 楼层内平面地图部分 -->
    <div v-if="!is3DMapOuter" class="mapPositionCenter">
      <!-- 楼层平面地图部分开始 -->
      <div class="mapFloorFooter">
        <bs-staticmap class="mapHome" :url="floorOneData.mapUrl" :center="floorOneData.center" :extent="floorOneData.extent" ref="mapFloorContainer"  @click="mapClickEvt" @ready="getMap" @mousemove="handleMapMouseMove">
            <!-- 楼层内网格图层
            <bs-layer :id="gridLayer.id" :name="gridLayer.name" :features="gridFeatureList" :zIndex="gridLayer.zIndex" ></bs-layer>
            &lt;!&ndash; 视频点位图层 &ndash;&gt;
            <bs-layer :id="videoLayer.id" :name="videoLayer.name" :features="videoFeatureList" :zIndex="videoLayer.zIndex"></bs-layer>
            &lt;!&ndash; 报警点位图层 &ndash;&gt;
            <bs-layer :id="commonAlarmLayer.id" :name="commonAlarmLayer.name" :features="alarmFeatureList" :zIndex="commonAlarmLayer.zIndex"></bs-layer>
            &lt;!&ndash; 报警求助图层 &ndash;&gt;
            <bs-layer :id="alarmHelpLayer.id" :name="alarmHelpLayer.name" :features="alarmHelpFeatureList" :zIndex="alarmHelpLayer.zIndex"></bs-layer>
            &lt;!&ndash; 巡更图层 &ndash;&gt;
            <bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :features="patrolFeatureList" :zIndex="patrolLayer.zIndex"></bs-layer>-->
          <bs-layer v-for="(item) in layerArr" :key="item.key.id" :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
            <!-- 高亮图层 -->
            <bs-layer :id="positionLayer.id" :name="positionLayer.name" :features="highLightFeatureList" :zIndex="positionLayer.zIndex"></bs-layer>
            <!-- 临时编辑图层 -->
            <bs-layer :id="editLayer.id"  :name="editLayer.name"   :features="editFeaturesList" :zIndex="editLayer.zIndex" ref="editLayer"></bs-layer>
            <!-- 楼层平面地图网格/区域要素的绘制工具 -->
            <bs-draw  :id="gridConfig.id" :name="gridConfig.name" :type="gridConfig.type" :actived="active2DGridDraw" :drawStyle='gridConfig.drawStyle' :layerStyle="gridConfig.layerStyle" @drawend="drawGridFinish"></bs-draw>
            <!-- 线要素绘制 -->
            <bs-draw :id="lineStringDraw.id" :name="lineStringDraw.name" :type="lineStringDraw.type" :actived="active2DStringDraw" :drawStyle="lineStringDraw.drawStyle" :layerStyle="lineStringDraw.layerStyle" @drawend="drawLineStringEnd"></bs-draw>
            <!--楼层平面点要素的绘制工具   -->
            <bs-draw :id="pointDraw.id" :name="pointDraw.name" :type="pointDraw.type" :actived="active2DDraw" :drawStyle='pointDraw.drawStyle' @drawend="drawPointFinish"></bs-draw>
            <!-- 楼层平面地图的编辑工具 -->
            <bs-edit :actived="active2DEdit" :features="editFeature" @modifystart="editFeatureStart" @modifyend="editFeatureEnd"></bs-edit>
        </bs-staticmap>
      </div>
      <!-- 楼层平面地图部分结束 -->
      <!-- 视频弹窗 -->
      <dragContainer v-if="videoPreviewFlag" selectAreaClassName='mapAppVideoTittle' :position="{left: dragContainerPositionLeft, top: 0}">
        <video-preview />
      </dragContainer>
    </div>
    <!-- 结束 -->
  </div>
</template>

<script>
import mapBase from './editBase'
import paramConfigModal from './ParamConfigModal'
import videoPreview from '../video/3DMapVideo'
import dragContainer from 'components/drag/DragContainer.vue'
import viewSetting from './viewSetting'
import mapControl from './mapControl'
import editDraw from './editDraw'
export default {
  mixins: [mapBase, mapControl, editDraw],
  components: {
    paramConfigModal,
    dragContainer,
    videoPreview,
    viewSetting
  },
  computed: {
    layerArr() {
      const normal = [
        { key: this.gridLayer, value: this.gridFeatureList }, // 网格
        // { key: this.gridLabelNames, value: this.gridFeatures },
        { key: this.videoLayer, value: this.videoFeatureList }, // 视频
        {key: this.videoLabelNames, value: this.videoLabelFeatures},
        { key: this.commonAlarmLayer, value: this.alarmFeatureList }, // 报警(普通报警、报警主机、消防报警)
        { key: this.alarmLabelNames, value: this.alarmLabelFeatures },
        { key: this.alarmHelpLayer, value: this.alarmHelpFeatureList }, // 报警求助
        { key: this.alarmBoxLabelNames, value: this.alarmHelpBoxLabelFeatures }, // 报警箱label
        { key: this.alarmColumnLabelNames, value: this.alarmHelpColumnLabelFeatures }, // 报警柱label
        { key: this.patrolLayer, value: this.patrolFeatureList }, // 巡更
        { key: this.patrolLabelNames, value: this.patrolFeatures }
      ]
      return normal
    }
  }
}
</script>

<style scoped>
.MapComponent {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.mapPositionCenter {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.MapComponent .mapPositionCenter .flagClss,
.MapComponent .mapPositionCenter .mapFloorFooter {
  position: relative;
  display: flex;
  flex: 1;
}
.mapFloorCon {
  flex: 1;
  display: flex;
  flex-direction: row;
  clear: both;
}
.mapFloor {
  display: flex;
  flex: 1;
  float: left;
  height: 100%;
  flex-direction: column;
}
.MapComponent .mapHeader {
  height: 37px;
  width: auto;
  line-height: 30px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
  position: absolute;
  right: 170px;
  top: 2px;
  z-index: 2;
  border-radius: 4px;
  padding: 5px 0;
  /* transition: all .3s ease-in-out .1s; */
}
.mapHeader span {
  margin: 0 12px;
  cursor: pointer;
}
.mapFloorBtn {
  height: 40px;
  width: 60px;
  text-align: center;
  line-height: 40px;
  background-color: #1c3053;
}
.MapComponent .mapPositionCenter .mapHome {
  flex: 1;
}
</style>
