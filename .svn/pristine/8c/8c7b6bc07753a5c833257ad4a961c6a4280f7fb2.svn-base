<!--地图基础组件 用于报警管理、消防报警、校内交通的智能研判、电子巡更模块的地图-->
<template>
  <div class="mapBase">
    <div class="BSMapMain">
      <div v-if="isAppOuter" class="mapPositionCenter">
        <div class="flagClss">
          <bs-map v-for="(item, index) in mapConfigList" :key="index"  v-show="activeMap === item.mapId" class="mapHome" :center="activeMapCenter || item.center" :extent="item.extent" :zoom="2" ref="mapContainer" :updateSize="isUpdate" @zoom="mapZoomEvt" @click="selectFeatureEvt">
            <div v-if="mapServrConfig.type === 'gis'">
              <!-- geo -->
              <div v-if="mapServrConfig.mapType === 'geoserver'">
                <bs-wtmslayer :url="item.mapUrl" :layerName="item.layerName" :matrixSet="item.matrixSet" :origin="item.origin"></bs-wtmslayer>
              </div>
              <!-- 超图 -->
              <div v-if="mapServrConfig.mapType === 'iserver'">
                <bs-supermaplayer :url="item.mapUrl"></bs-supermaplayer>
              </div>
            </div>
            <!-- 静态底图模式 -->
            <div v-if="mapServrConfig.type === 'static'">
              <bs-staticlayer :url="item.mapUrl"></bs-staticlayer>
            </div>
            <bs-navigation></bs-navigation>
            <bs-compass></bs-compass>
            <bs-mapTypeSwitch></bs-mapTypeSwitch>
            <bs-zoombar sytle="color:#000000;"></bs-zoombar>
            <slot></slot>
          </bs-map>
        </div>
      </div>
      <div v-if="!isAppOuter" class="mapPositionCenter">
        <div class="mapFloor">
          <div class="mapFloorHeader">
            <div class="mapFloorBtn" @click="rebackOuter">返回</div>
          </div>
          <div class="mapFloorFooter">
            <bs-map class="mapHome" :center="activeMapCenter || levelData.bid.center.split(',')" :extent="levelData.bid.scope.split(',')" :zoom="levelData.class" ref="mapFloorContainer" :updateSize="isUpdate">
              <bs-staticlayer :url="'/api/upload?id=' + levelData.picture.id"></bs-staticlayer>
              <slot></slot>
            </bs-map>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'mapBase',
  components: {},
  data() {
    return {
      appFlag: false
    }
  },
  props: {
    // 中心点
    activeMapCenter: {
      type: Array,
      default: () => []
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    isAppOuter: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    activeMap(val) {
      // console.log(val)
    }
  },
  computed: {
    ...mapState({
      mapServrConfig: ({ mapGisData }) => mapGisData.mapServrConfig, // 地图服务器配置
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList, // 地图列表
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      activeMap: ({ mapGisData }) => mapGisData.activeMap // 当前活动地图
    })
  },
  methods: {
    ...mapMutations(['SET_ISAPPOUTER_STATE']),
    // 返回
    rebackOuter() {
      this.$emit('rebackOuter', true)
    },
    selectFeatureEvt(obj) {
      this.$emit('selectFeatureEvt', obj)
    },
    // 地图缩放级别变化时，视频点位显示或隐藏
    mapZoomEvt(obj) {
      this.$emit('mapZoomEvt', obj)
    }
  },
  beforeDestroy() { }
}
</script>
<style scoped>
.mapBase {
  clear: both;
  display: flex;
  flex: 1;
}
.mapBase .map_tips {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  text-align: center;
  border: 1px solid #fff;
  vertical-align: center;
  padding-top: 43%;
}
.mapBase .BSMapMain {
  width: 100%;
  display: flex;
  flex: 1;
}
.mapBase .BSMapMain .mapPositionCenter {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.mapBase .BSMapMain .mapTittle {
  width: 100%;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  clear: both;
  background-color: #0f2243;
}
.mapBase .BSMapMain .mapTittle .mapTittleItem {
  float: left;
  padding: 0 10px;
  cursor: pointer;
}
.mapBase .BSMapMain .mapTittle .active {
  background-color: #1c3053;
}
.mapBase .BSMapMain .mapPositionCenter .flagClss {
  width: 100%;
  display: flex;
  flex: 1;
  border: 1px soli red;
}
.mapBase .BSMapMain .flagClss .mapHome {
  display: flex;
  flex: 1;
  position: relative;
}
.mapFloor {
  display: flex;
  flex: 1;
  float: left;
  height: 100%;
  flex-direction: column;
}
.mapPositionCenter .mapFloor .mapFloorHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
}
.mapPositionCenter .mapFloor .mapFloorHeader .mapFloorBtn {
  height: 40px;
  width: 60px;
  text-align: center;
  line-height: 40px;
  background-color: #1c3053;
}
</style>
