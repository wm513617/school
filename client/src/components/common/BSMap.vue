<template>
  <div class="BSMap">
    <div v-if="loading" class='map_tips'>加载中...</div>
    <div v-else-if="mapConfigList.length === 0" class='map_tips'>地图无配置信息，不能显示</div>
    <div v-else class="BSMapMain">
      <div v-if="isAppOuter" class="mapPositionCenter">
        <div class="mapTittle">
          <div v-for="(item, index) in mapConfigList" class="mapTittleItem" :class="{active: activeMap === item.mapId, noActive: activeMap !== item.mapId}" :key="index" @click="mapClick(item)">{{item.mapName}}</div>
        </div>
        <div class="flagClss">
          <bs-map v-for="(item, index) in mapConfigList" :key="index" v-if="activeMap === item.mapId" class="mapHome" :center="activeMapCenter || item.center" :extent="activeMapxtent || item.extent" :zoom="1" ref="mapAppContainer" :updateSize="isUpdate" @zoom="mapZoomEvt" @click="selectFeatureEvt" @postcompose="alarmTwinkEvt" :resolutions="item.resolutions" :isStaitic="item.mapType === 'static' ? true : false">
            <!-- geo -->
            <div v-if="item.mapType === 'geoserver'">
              <bs-wtmslayer :url="item.mapUrl" :layerName="item.layerName" :gridNames="item.gridSets" :matrixSet="item.matrixSet" :origin="item.origin"></bs-wtmslayer>
            </div>
            <!-- 超图 -->
            <div v-if="item.mapType === 'iserver'">
              <bs-supermaplayer :url="item.mapUrl"></bs-supermaplayer>
            </div>
            <!-- 静态底图模式 -->
            <div v-if="item.mapType === 'static'">
              <bs-staticlayer :url="item.mapUrl"></bs-staticlayer>
            </div>
            <slot></slot>
          </bs-map>
        </div>
      </div>
      <div v-if="!isAppOuter" class="mapPositionCenter">
        <div class="mapTittle">
          <div class="mapTittleItem">{{floorData.name}}</div>
        </div>
        <div class="flagClss">
          <bs-map class="mapHome" :center="floorData.center" :extent="floorData.extent" :zoom="floorData.zoom" ref="mapFloorContainer" :updateSize="isUpdate" :minZoom="0" :maxZoom="30" :isStaitic=" true" @zoom="mapZoomEvt" @click="selectFeatureEvt" @postcompose="alarmTwinkEvt">
            <bs-staticlayer :url="floorData.mapUrl" :extent="floorData.extent"></bs-staticlayer>
            <slot></slot>
          </bs-map>
        </div>
      </div>
    </div>
    <!--地图类型切换结束-->
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { getExtent } from 'assets/map/MapUtil.js'
export default {
  name: 'BSMap',
  components: {},
  data() {
    return {
      resolutions: [
        2.5152827955346596e-5,
        1.8864620966509947e-5,
        1.2576413977673298e-5,
        6.288206988836649e-6,
        2.5152827955346597e-6,
        1.2576413977673299e-6
      ],
      loading: true,
      activeMap: '',
      activeMapItem: null, // 当前地图配置项
      activeMapxtent: null, // 当前地图边界
      appFlag: false,
      isUpdate: false,
      floorData: {
        center: [],
        extent: [],
        zoom: 2,
        mapUrl: ''
      }
    }
  },
  props: {
    // 中心点
    activeMapCenter: {
      type: Array
    }
  },
  created() {
    this.getMapServerList()
      .then(res => {
        this.getMapConfigList(res)
        this.appFlag = true
      })
      .catch(err => {
        console.log('地图信息获取失败，请联系管理员', err)
      })
  },
  mounted() {
    this.$nextTick(function() {})
  },
  computed: {
    ...mapState({
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList, // 地图列表
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter, // 楼层内外
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      activeMapOne: ({ mapGisData }) => mapGisData.activeMap // 当前地图id
    })
  },
  watch: {
    isAppOuter(val) {
      if (val) {
        // this.getMapConfigList(this.mapConfigList) // 解决消防报警模块点击网格或楼宇从楼层跳回之前的地图
      }
    },
    levelData(val) {
      this.getLevelMapData(val)
    },
    activeMapOne(val) {
      this.activeMap = val
      this.getActiveMapItem() // 获取当前地体配置项
    },
    activeMapItem: {
      handler(item) {
        this.computeActiveMapParams(item)
      },
      deep: true
    }
    // activeMapCenter(val) {
    //   this.activeMapCenter = val
    // }
  },
  methods: {
    ...mapActions(['getMapServerList', 'getMapOrgTree']),
    ...mapMutations(['SET_MAPACTIVE_STATE']),
    // 获取当前地体配置项
    getActiveMapItem() {
      for (const item of this.mapConfigList) {
        if (this.activeMap === item.mapId) {
          this.activeMapItem = item
          break
        }
      }
    },
    // 计算地图参数
    computeActiveMapParams(item) {
      let extent = item.extent
      if (item.mapType === 'static') { // 静态地图，计算地图边界
        extent = getExtent(extent, [item.size.width, item.size.height])
      }
      this.activeMapxtent = extent
    },
    mapClick(val) {
      this.activeMap = val.mapId
      this.$store.commit('SET_MAPACTIVE_STATE', val.mapId)
      this.getMapOrgTreeEvt(val.mapId)
    },
    // 地图缩放级别变化时，视频点位显示或隐藏
    mapZoomEvt(obj) {
      // console.log(obj)
    },
    // 获取地图结构树
    getMapOrgTreeEvt(val) {
      this.getMapOrgTree(val)
        .then(res => {
          // console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取地图信息
    getLevelMapData(data) {
      const val = JSON.parse(JSON.stringify(data))
      const floorExtent = val.bid.scope.split(',').map(item => Number(item))
      const levelCenter = val.bid.center.split(',').map(item => Number(item))
      this.floorData.center = levelCenter
      this.floorData.extent = floorExtent
      this.floorData.mapUrl = '/api/upload?id=' + val.picture.id
      this.floorData.zoom = val.class
      this.floorData.name = val.name
    },
    // 获取楼层信息
    getMapConfigList(val) {
      if (val.length > 0) {
        this.loading = false
        if (val[0].mapId) {
          this.activeMap = val[0].mapId
          this.getMapOrgTreeEvt(this.activeMap)
          this.$emit('initMap', this.activeMap)
        }
      }
    },
    // 报警闪烁事件
    alarmTwinkEvt(val) {
      this.$emit('postcompose', val)
    },
    // 地图点击事件
    selectFeatureEvt(val) {
      this.$emit('click', val)
    }
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.BSMap {
  width: 100%;
  height: 100%;
  clear: both;
  display: flex;
  flex: 1;
}

.BSMap .map_tips {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  text-align: center;
  border: 1px solid #fff;
  /* vertical-align: center; */
  /* padding-top: 43%; */
}

.BSMap .BSMapMain {
  width: 100%;
  display: flex;
  flex: 1;
}

.BSMap .BSMapMain .mapPositionCenter {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.BSMap .BSMapMain .mapTittle {
  width: 100%;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  clear: both;
  background-color: #0f2243;
}

.BSMap .BSMapMain .mapTittle .mapTittleItem {
  float: left;
  padding: 0 10px;
  cursor: pointer;
}

.BSMap .BSMapMain .mapTittle .active {
  background-color: #1b3153;
  color: #fff;
}
.BSMap .BSMapMain .mapTittle .noActive {
  color: #8597ad;
}

.BSMap .BSMapMain .mapPositionCenter .flagClss {
  width: 100%;
  display: flex;
  flex: 1;
  border: 1px soli red;
}

.BSMap .BSMapMain .flagClss .mapHome {
  display: flex;
  flex: 1;
  position: relative;
}
</style>
