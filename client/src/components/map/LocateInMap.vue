<!-- 地图定位组件 -->
<template>
  <div class="LocateInMap">
    <div v-if="loading" class='map_tips'>加载中...</div>
    <div v-else-if="mapConfigList.length === 0" class='map_tips'>地图无配置信息，不能显示</div>
    <div v-else class="TMapMain">
      <div class="mapPositionCenter">
        <div class="flagClss" v-for="(item) in mapConfigList" v-show="activeMap === item.mapId" :key="item.mapId">
          <bs-map v-if="activeMap === item.mapId" class="mapHome" :projection="mapProjection" :zoom="item.zoom || defaultZoom" :center="locateCoordinates || item.center" :extent="activeMapxtent || item.extent" ref="bsMap" :updateSize="isUpdate" :resolutions="item.resolutions" @ready="loadBSMapReady">
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
            <!-- 矢量要素图层 -->
            <bs-layer v-for="(item) in layerArr" :key="item.key.id" :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
          </bs-map>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { getExtent } from 'assets/2DMap/MapUtil'
import layerConfig from 'assets/2DMap/meta/layer'
import highLight from 'assets/2DMap/feature/edit/highLight'
import TransformCoord from 'assets/2DMap/utils/transformcoord'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import { toMercator } from '@turf/projection'
import { point } from '@turf/helpers'
import { PROJ } from 'assets/2DMap/meta/common.js'
export default {
  name: 'LocateInMap',
  data() {
    return {
      defaultZoom: 2,
      activeMapxtent: null, // 当前地图边界
      loading: true, // 地图加载中
      activeMap: '', // 当前显示的地图标识
      isUpdate: false, // 是否更新
      map: null, // 地图
      olLib: null, // 地图类库
      highLightLocateLayer: layerConfig.highLightLocateLayer,
      locateFeatures: [],
      locateCoordinates: null // 地图中心
    }
  },
  props: { // 父组件传入的数据
    type: { // 要素类型（patrol: 巡更，single：单兵）
      type: String
    },
    geo: { // 要素位置信息
      type: String
    }
  },
  computed: {
    ...mapState({
      mapConfigList: ({ mapIndex }) => mapIndex.mapConfigArr, // 地图配置列表
      mapProjection: ({ mapIndex }) => mapIndex.mapProjection // 当前地图投影参考坐标系
    }),
    layerArr() {
      return [
        { key: this.highLightLocateLayer, value: this.locateFeatures } // 定位
      ]
    }
  },
  watch: {
    type: { // 要素类型
      handler(val) {
        this.locateInMapCenter() // 定位到地图中心
      },
      immediate: true
    },
    geo: { // 要素位置
      handler(val) {
        this.locateInMapCenter() // 定位到地图中心
      },
      immediate: true
    },
    locateCoordinates(arr) {
      this.zoomToMapCenter() // 缩放至地图中心
    }
  },
  created() {
    this.loadMapConfigArr() // 获取地图服务列表
      .then(res => {
        this.getMapConfigList(res)
      })
      .catch(err => {
        console.log('地图信息获取失败，请联系管理员', err)
      })
  },
  mounted() {
    this.$nextTick(() => {})
  },
  methods: {
    ...mapActions(['loadMapConfigArr']),
    getMapConfigList(val) { // 获取地图配置列表
      if (val && val.length > 0) {
        this.loading = false
        if (val[0].mapId) {
          this.activeMap = val[0].mapId
          this.computeActiveMapParams(val[0])
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
    loadBSMapReady(param) { // 加载加载完成
      this.olLib = param.ol
      this.map = param.map
      this.locateInMapCenter() // 定位到地图中心
      this.zoomToMapCenter() // 缩放至地图中心
    },
    locateInMapCenter() { // 定位到地图中心
      if (this.activeMap && this.geo) { // 位置信息
        let coordinates = this.geo.split(',').map(item => Number(item)) // 转换坐标数组
        console.log('转换的坐标数组：', JSON.parse(JSON.stringify(coordinates)))
        if (coordinates && coordinates.length >= 2) { // 坐标有效时
          let loc = coordinates.slice(0, 2) // 截取二维坐标
          console.log('截取到的二维坐标：', loc)
          if (this.type === RESOURCETYPE.single) { // 单兵要素时，要进行坐标转换
            loc = TransformCoord.wgs84togcj02(loc[0], loc[1])
            if (this.mapProjection !== PROJ.EPSG4326) {
              loc = toMercator(point(loc)).geometry.coordinates
            }
          }
          this.locateCoordinates = loc // 设置地图中心
          let locateFeature = highLight.getLocateFeature(this.type, loc) // 定位要素
          this.locateFeatures = [locateFeature]
        } else {
          this.locateFeatures = []
        }
      } else {
        this.locateFeatures = []
      }
    },
    zoomToMapCenter() { // 缩放至地图中心
      if (this.map && this.olLib && this.locateCoordinates && this.locateCoordinates.length) { // 地图加载完成且有定位坐标数据时
        // let pointGeometry = new this.olLib.geom.Point(this.locateCoordinates)
        this.map.getView().setCenter(this.locateCoordinates)
      }
    }
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.LocateInMap {
  width: 100%;
  height: 100%;
  clear: both;
  display: flex;
  flex: 1;
}

.LocateInMap .map_tips {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  text-align: center;
  border: 1px solid #fff;
  /* vertical-align: center; */
  /* padding-top: 43%; */
}

.LocateInMap .TMapMain {
  width: 100%;
  display: flex;
  flex: 1;
}

.LocateInMap .TMapMain .mapPositionCenter {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.LocateInMap .TMapMain .mapPositionCenter .flagClss {
  width: 100%;
  display: flex;
  flex: 1;
  border: 1px soli red;
}

.LocateInMap .TMapMain .flagClss .mapHome {
  display: flex;
  flex: 1;
  position: relative;
}
</style>
