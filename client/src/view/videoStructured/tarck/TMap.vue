<!-- 视频结构化追踪地图组件 -->
<template>
  <div class="TMap">
    <i class="iconfont icon-you" style="display: none;"></i><!-- 轨迹箭头隐藏，勿删！！！ -->
    <div v-if="loading" class='map_tips'>加载中...</div>
    <div v-else-if="mapConfigList.length === 0" class='map_tips'>地图无配置信息，不能显示</div>
    <div v-else class="TMapMain">
      <div class="mapPositionCenter">
        <div class="flagClss" v-for="(item) in mapConfigList" v-show="activeMap === item.mapId" :key="item.mapId">
          <bs-map v-if="activeMap === item.mapId" class="mapHome" :projection="mapProjection" :center="item.center" :extent="activeMapxtent || item.extent" :zoom="item.zoom || defaultZoom" ref="bsMap" :updateSize="isUpdate" :resolutions="item.resolutions" @ready="loadBSMapReady" @mousemove="handTMapMouseMove">
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
            <!-- 点位资源矢量图层 -->
            <bs-layer v-for="(item) in layerArr" :key="item.key.id" :id="item.key.id" :name="item.key.name" :features="item.value" :type="item.key.type" :zIndex="item.key.zIndex"></bs-layer>
            <!-- 区域绘制 -->
            <bs-draw :id="areaQuery.id" :name="areaQuery.name" :type="areaQuery.type" :actived="drawActive" :layerStyle="areaQuery.layerStyle" :drawStyle="areaQuery.drawStyle" @drawend="drawAreaFinish"></bs-draw>
          </bs-map>
        </div>
      </div>
    </div>
    <i class="iconfont icon-you" style="display: none;"></i><!-- 轨迹箭头隐藏，勿删！！！ -->
  </div>
</template>
<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import { getExtent } from 'assets/2DMap/MapUtil'
import layerConfig from 'assets/2DMap/meta/layer'
import drawConfig from 'assets/2DMap/meta/draw'
import videoTrans from 'assets/2DMap/feature/apply/video'
import DrawTrack from 'assets/2DMap/utils/DrawTrack'
import {RESOURCETYPE, VIDEOTYPEKEY, CAMERATYPE, VIDEOICONLAYERMAP} from 'assets/2DMap/meta/common'
import featureBase from 'assets/2DMap/feature/base'
export default {
  name: 'TMap',
  data() {
    return {
      activeMapxtent: null, // 当前地图边界
      defaultZoom: 2,
      loading: true, // 地图加载中
      activeMap: '', // 当前显示的地图标识
      isUpdate: false, // 是否更新
      map: null, // 地图
      olLib: null, // 地图类库
      structuredVideoLayer: layerConfig.boltipc, // 结构化视频图层
      structuredVideos: [], // 结构化视频要素
      areaQuery: JSON.parse(JSON.stringify(drawConfig.areaQuery)), // 区域绘制
      drawTrack: null, // 轨迹绘制工具
      boltipcSectorLayer: layerConfig.boltipcSector, // 枪机可视域
      boltipcLabelLayer: layerConfig.boltipcLabel, // 枪机lable
      halfBallipcSectorLayer: layerConfig.halfBallipcSector,
      halfBallipcLabelLayer: layerConfig.halfBallipcLabel,
      fastBallipcSectorLayer: layerConfig.fastBallipcSector,
      fastBallipcLabelLayer: layerConfig.fastBallipcLabel,
      allViewipcSectorLayer: layerConfig.allViewipcSector,
      allViewipcLabelLayer: layerConfig.allViewipcLabel,
      redBoltipcSectorLayer: layerConfig.redBoltipcSector,
      redBoltipcLabelLayer: layerConfig.redBoltipcLabel,
      verfaceipcSectorLayer: layerConfig.verfaceipcSector,
      verfaceipcLabelLayer: layerConfig.verfaceipcLabel,
      trafficipcSectorLayer: layerConfig.trafficipcSector,
      trafficipcLabelLayer: layerConfig.trafficipcLabel,
      highLightLocateLayer: layerConfig.highLightLocateLayer
    }
  },
  props: {
    drawActive: { // 绘制状态
      type: Boolean,
      default: false
    },
    trackCoordinates: { // 轨迹坐标数组
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      mapConfigList: ({ mapIndex }) => mapIndex.mapConfigArr, // 地图配置列表
      mapProjection: ({ mapIndex }) => mapIndex.mapProjection // 当前地图投影坐标系
    }),
    layerArr() {
      return [
        { key: this.structuredVideoLayer, value: this.structuredVideos }, // 结构化视频图标图层
        { key: this.boltipcSectorLayer, value: this.boltipcSectors }, // 视频-枪机
        { key: this.boltipcLabelLayer, value: this.boltipcLabels }, // 枪机label
        { key: this.halfBallipcSectorLayer, value: this.halfBallipcSectors }, // 视频-半球
        { key: this.halfBallipcLabelLayer, value: this.halfBallipcLabels }, // 半球label
        { key: this.fastBallipcSectorLayer, value: this.fastBallipcSectors }, // 视频-快球
        { key: this.fastBallipcLabelLayer, value: this.fastBallipcLabels }, // 快球label
        { key: this.allViewipcSectorLayer, value: this.allViewipcSectors }, // 视频-全景
        { key: this.allViewipcLabelLayer, value: this.allViewipcLabels }, // 全景label
        { key: this.redBoltipcSectorLayer, value: this.redBoltipcSectors }, // 视频-红外枪机
        { key: this.redBoltipcLabelLayer, value: this.redBoltipcLabels }, // 红外枪机label
        { key: this.verfaceipcSectorLayer, value: this.verfaceipcSectors }, // 视频-人脸抓拍
        { key: this.verfaceipcLabelLayer, value: this.verfaceipcLabels }, // 人脸label
        { key: this.trafficipcSectorLayer, value: this.trafficipcSectors }, // 视频-交通抓拍
        { key: this.trafficipcLabelLayer, value: this.trafficipcLabels }, // 交通label
        { key: this.highLightLocateLayer, value: this.getSelectPointHeightLightFeatures } // 框选点位标记
      ]
    },
    ...mapGetters({
      boltipcSectors: 'boltipcSectorFeatures', // 枪机覆盖区域要素
      boltipcLabels: 'boltipcLabelFeatures', // 枪机名称要素
      halfBallipcSectors: 'halfBallipcSectorFeatures', // 半球覆盖区域要素
      halfBallipcLabels: 'halfBallipcLabelFeatures', // 半球名称要素
      fastBallipcSectors: 'fastBallipcSectorFeatures', // 快球覆盖区域要素
      fastBallipcLabels: 'fastBallipcLabelFeatures', // 快球名称要素
      allViewipcSectors: 'allViewipcSectorFeatures', // 全景覆盖区域要素
      allViewipcLabels: 'allViewipcLabelFeatures', // 全景名称要素
      redBoltipcSectors: 'redBoltipcSectorFeatures', // 红外覆盖区域要素
      redBoltipcLabels: 'redBoltipcLabelFeatures', // 红外名称要素
      verfaceipcSectors: 'verfaceipcSectorFeatures', // 人脸抓拍覆盖区域要素
      verfaceipcLabels: 'verfaceipcLabelFeatures', // 人脸名称要素
      trafficipcSectors: 'trafficipcSectorFeatures', // 交通抓拍覆盖区域要素
      trafficipcLabels: 'trafficipcLabelFeatures' // 交通名称要素
    }),
    ...mapGetters('structuredTrack', ['getSelectPointHeightLightFeatures'])
  },
  watch: {
    activeMap(val) { // 当前地图标识
      if (val) {
        let query = {mapId: val}
        this.loadStructuredVideos(query)
      }
    },
    drawActive(flag) { // 绘制状态
      if (!flag) {
        this.clearFeaturesInLayer(this.areaQuery.id)
      }
    },
    trackCoordinates: {
      handler(arr) {
        if (this.drawTrack) {
          this.drawTrack.clearTrack() // 清空轨迹
          if (arr && arr.length) { // 轨迹坐标有效时
            this.drawTrackLine() // 绘制轨迹
          }
        }
      },
      deep: true
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
    ...mapActions(['loadMapConfigArr', 'setBoltipcLabelFeatures', 'setBoltipcSectorFeatures', 'setHalfBallipcLabelFeatures', 'setHalfBallipcSectorFeatures', 'setFastBallipcLabelFeatures', 'setFastBallipcSectorFeatures', 'setAllViewipcLabelFeatures', 'setAllViewipcSectorFeatures', 'setRedBoltipcLabelFeatures', 'setRedBoltipcSectorFeatures', 'setVerfaceipcLabelFeatures', 'setVerfaceipcSectorFeatures', 'setTrafficipcLabelFeatures', 'setTrafficipcSectorFeatures']),
    ...mapActions('structuredTrack', ['loadStructuredVideosByMapId', 'getStructuredVideosInArea']),
    getMapConfigList(val) { // 获取地图配置列表
      if (val && val.length > 0) {
        this.loading = false
        if (val[0].mapId) {
          this.activeMap = val[0].mapId
          this.computeActiveMapParams(val[0])
        }
      }
    },
    computeActiveMapParams(item) { // 计算地图参数
      let extent = item.extent
      if (item.mapType === 'static') { // 静态地图，计算地图边界
        extent = getExtent(extent, [item.size.width, item.size.height])
      }
      this.activeMapxtent = extent
    },
    loadBSMapReady(param) { // 加载加载完成
      this.olLib = param.ol
      this.map = param.map
      this.drawTrack = new DrawTrack(param) // 构造轨迹绘制工具
      if (this.trackCoordinates && this.trackCoordinates.length) { // 轨迹坐标有效时
        this.drawTrackLine() // 绘制轨迹
      }
    },
    loadStructuredVideos(query) { // 加载结构化视频资源数据
      this.loadStructuredVideosByMapId(query).then(res => {
        // console.log('加载到的结构化视频资源数据：', JSON.parse(JSON.stringify(res)))
        this.structuredVideos = videoTrans.transIconFeatures(res, this.structuredVideoLayer, 999)
        // console.log('加载到的结构化视频资源要素：', JSON.parse(JSON.stringify(this.structuredVideos)))
      })
    },
    drawAreaFinish(param) { // 绘制区域完成
      // console.log('绘制区域完成，绘制参数：', param)
      this.$emit('drawFinish', param)
    },
    getLayerById(layerId) { // 根据id获取图层
      let targetLayer = null
      if (this.map) { // 判断地图记载完成,获取指定图层
        let layers = this.map.getLayers().getArray()
        for (const layer of layers) {
          let id = layer.get('id')
          if (id === layerId) {
            targetLayer = layer
          }
        }
      }
      return targetLayer
    },
    clearFeaturesInLayer(layerId) { // 删除图层内的要素
      let layer = this.getLayerById(layerId)
      layer && layer.getSource().clear()
    },
    drawTrackLine() { // 绘制轨迹
      this.drawTrack.drawTrackLine(this.trackCoordinates)
      this.drawTrack.addTrackNodes()
      this.drawTrack.controlAnimation()
    },
    handTMapMouseMove(params) {
      let [...videoIconTypes] = VIDEOICONLAYERMAP.values()
      let { attributes } = params
      if (attributes) {
        if (videoIconTypes.includes(attributes.type)) {
          // eslint-disable-next-line no-unused-vars
          let featureLayer = this.boltipcLabelLayer
          // eslint-disable-next-line no-unused-vars
          let featureSectorLayer = this.boltipcSectorLayer
          // eslint-disable-next-line no-unused-vars
          let setFeaturesFun = this.setBoltipcLabelFeatures
          // eslint-disable-next-line no-unused-vars
          let setSectorFeaturesFun = this.setBoltipcSectorFeatures
          if (attributes.monitoryPointGenera === CAMERATYPE.normalipc) {
            if (attributes.rType === RESOURCETYPE.video) {
              switch (attributes.sRType) {
                case VIDEOTYPEKEY.boltipc :
                  featureLayer = this.boltipcLabelLayer
                  featureSectorLayer = this.boltipcSectorLayer
                  setFeaturesFun = this.setBoltipcLabelFeatures
                  setSectorFeaturesFun = this.setBoltipcSectorFeatures
                  break
                case VIDEOTYPEKEY.halfBallipc:
                  featureLayer = this.halfBallipcLabelLayer
                  featureSectorLayer = this.halfBallipcSectorLayer
                  setFeaturesFun = this.setHalfBallipcLabelFeatures
                  setSectorFeaturesFun = this.setHalfBallipcSectorFeatures
                  break
                case VIDEOTYPEKEY.fastBallipc:
                  featureLayer = this.fastBallipcLabelLayer
                  featureSectorLayer = this.fastBallipcSectorLayer
                  setFeaturesFun = this.setFastBallipcLabelFeatures
                  setSectorFeaturesFun = this.setFastBallipcSectorFeatures
                  break
                case VIDEOTYPEKEY.allViewipc:
                  featureLayer = this.allViewipcLabelLayer
                  featureSectorLayer = this.allViewipcSectorLayer
                  setFeaturesFun = this.setAllViewipcLabelFeatures
                  setSectorFeaturesFun = this.setAllViewipcSectorFeatures
                  break
                case VIDEOTYPEKEY.redBoltipc:
                  featureLayer = this.redBoltipcLabelLayer
                  featureSectorLayer = this.redBoltipcSectorLayer
                  setFeaturesFun = this.setRedBoltipcLabelFeatures
                  setSectorFeaturesFun = this.setRedBoltipcSectorFeatures
              }
            }
          } else if (attributes.monitoryPointGenera === CAMERATYPE.verfaceipc) {
            featureLayer = this.verfaceipcLabelLayer
            featureSectorLayer = this.verfaceipcSectorLayer
            setFeaturesFun = this.setVerfaceipcLabelFeatures
            setSectorFeaturesFun = this.setVerfaceipcSectorFeatures
          } else if (attributes.monitoryPointGenera === CAMERATYPE.trafficipc) {
            featureLayer = this.trafficipcLabelLayer
            featureSectorLayer = this.trafficipcSectorLayer
            setFeaturesFun = this.setTrafficipcLabelFeatures
            setSectorFeaturesFun = this.setTrafficipcSectorFeatures
          }
          let labelFeature = featureBase.getHoverLabelFeature(attributes, featureLayer)
          labelFeature && setFeaturesFun([labelFeature])
          let sectorFeature = videoTrans.getHoverSectorFeature(attributes, featureSectorLayer)
          sectorFeature && setSectorFeaturesFun([sectorFeature])
        }
      } else {
        this.setBoltipcLabelFeatures([]) // 枪机
        this.setBoltipcSectorFeatures([]) // 枪机可视域
        this.setHalfBallipcLabelFeatures([]) // 半球
        this.setHalfBallipcSectorFeatures([]) // 半球可视域
        this.setFastBallipcLabelFeatures([]) // 快球
        this.setFastBallipcSectorFeatures([]) // 快球可视域
        this.setAllViewipcLabelFeatures([]) // 全景
        this.setAllViewipcSectorFeatures([]) // 全景可视域
        this.setRedBoltipcLabelFeatures([]) // 红外枪机
        this.setRedBoltipcSectorFeatures([]) // 红外枪机可视域
        this.setVerfaceipcLabelFeatures([]) // 人脸抓拍
        this.setVerfaceipcSectorFeatures([]) // 人脸抓拍可视域
        this.setTrafficipcLabelFeatures([]) // 交通抓拍
        this.setTrafficipcSectorFeatures([]) // 交通抓拍可视域
      }
    }
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.TMap {
  width: 100%;
  height: 100%;
  clear: both;
  display: flex;
  flex: 1;
}

.TMap .map_tips {
  position: relative;
  width: 100%;
  height: 100%;
  color: white;
  text-align: center;
  border: 1px solid #fff;
  /* vertical-align: center; */
  /* padding-top: 43%; */
}

.TMap .TMapMain {
  width: 100%;
  display: flex;
  flex: 1;
}

.TMap .TMapMain .mapPositionCenter {
  width: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.TMap .TMapMain .mapPositionCenter .flagClss {
  width: 100%;
  display: flex;
  flex: 1;
  border: 1px soli red;
}

.TMap .TMapMain .flagClss .mapHome {
  display: flex;
  flex: 1;
  position: relative;
}
</style>
