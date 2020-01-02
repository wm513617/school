<!-- 人像识别模块轨迹追踪地图组件 -->
<template>
  <div class="TMap">
    <div v-if="loading" class='map_tips'>加载中...</div>
    <div v-else-if="mapConfigList.length === 0" class='map_tips'>地图无配置信息，不能显示</div>
    <div v-else class="TMapMain">
      <div class="mapPositionCenter">
        <div class="flagClss" v-for="(item) in mapConfigList" v-show="activeMap === item.mapId" :key="item.mapId">
          <bs-map v-if="activeMap === item.mapId" class="mapHome" :projection="mapProjection" :center="item.center" :extent="activeMapxtent || item.extent" :zoom="item.zoom || defaultZoom" ref="bsMap" :updateSize="isUpdate" :resolutions="item.resolutions" @ready="loadBSMapReady">
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
          </bs-map>
        </div>
      </div>
      <NodePopup v-for="(node, index) in trackNodes" :key="index" :node="node" :map="map" :olLib="olLib" @changeShowModel="changeShowModel" @currentPopupTop="currentPopupTop"></NodePopup>
      <AlarmModal v-if="showModel === '1'" :show="showModel === '1'" @close="showModel = '0'" type="passer" :picInfo="picInfo"></AlarmModal>
    </div>
    <i class="iconfont icon-you" style="display: none;"></i><!-- 轨迹箭头隐藏，勿删！！！ -->
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import DrawTrack from 'assets/2DMap/utils/DrawTrack'
import NodePopup from 'components/face/NodePopup'
import AlarmModal from '../alarmsearch/AlarmModal.vue'
import trackFun from '../../map2D/components/track/trajectory/trackFun.vue'
import { getExtent } from 'assets/2DMap/MapUtil'
export default {
  name: 'TMap',
  components: { NodePopup, AlarmModal },
  mixins: [ trackFun ],
  data() {
    return {
      activeMapxtent: null, // 当前地图边界
      defaultZoom: 2,
      loading: true, // 地图加载中
      activeMap: '', // 当前显示的地图标识
      isUpdate: false, // 是否更新
      map: null, // 地图
      olLib: null, // 地图类库
      drawTrack: null // 轨迹绘制工具
    }
  },
  computed: {
    ...mapState({
      mapConfigList: ({ mapIndex }) => mapIndex.mapConfigArr, // 地图配置列表
      trackList: ({ veriface }) => veriface.trackList, // 人脸轨迹数据
      mapProjection: ({ mapIndex }) => mapIndex.mapProjection // 当前地图投影坐标系
    }),
    trackNodes() { // 位置坐标数组
      return this.drawTrack ? this.drawTrack.lineNodes : []
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
  watch: {
    trackList: { // 监听地图资源变化
      handler(newArr) {
        console.log('人脸轨迹列表：', newArr)
        this.getTrackLineCoords() // 获取轨迹线的坐标数组
        this.getTrackNodes() // 获取轨迹节点信息数据
      },
      deep: true
    },
    trackNodes: {
      handler(newArr) {
        console.log('人脸节点数据变化：', newArr)
      },
      deep: true
    }
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
      this.drawTrack = new DrawTrack(param)
    },
    getTrackLineCoords() { // 获取轨迹线的坐标
      let lineCoords = []
      for (let index = this.trackList.length - 1; index >= 0; index--) {
        const item = this.trackList[index]
        if (item.res && item.res.point) {
          let point = item.res.point
          let coord = this.getPointCoodinates(point)
          if (coord && coord.length > 0) {
            lineCoords.push(coord)
          }
        }
      }
      // console.log('人脸轨迹线坐标数组：', lineCoords)
      if (lineCoords && lineCoords.length > 0) {
        this.drawTrack.drawTrackLine(lineCoords)
      } else {
        if (this.trackList && this.trackList.length > 0) {
          this.warningMsg('无位置数据，请确认设备已添加到地图中！')
        }
      }
    },
    getTrackNodes() { // 获取轨迹节点信息数据
      let trackNodeMap = new Map() // 节点map(key: 人脸设备标识, value: 地图需要显示的信息对象：{pointId:设备标识, passImage:最新经过抓拍图片地址, similar:相似度, deviceName:设备名称, passCount:经过次数, timestamp:最新经过时间, coordinates:坐标})
      for (const item of this.trackList) {
        let pointId = item.res._id
        if (pointId) {
          let node = null
          if (trackNodeMap.has(pointId)) { // 节点map中已有设备信息
            node = trackNodeMap.get(pointId)
            node.passCount += 1
            if (node.timestamp < item.timestamp) {
              node.passImage = item.faceImage || node.passImage
              node.similar = item.similar || node.similar
            }
          } else { // 节点map中没有设备信息
            let point = item.res.point
            if (point) {
              let coord = this.getPointCoodinates(point) // 获取点位坐标
              if (coord && coord.length > 0) {
                node = {
                  pointId: pointId, // 设备标识
                  passImage: item.faceImage, // 最新经过抓拍图片地址
                  similar: item.similar, // 相似度
                  deviceName: item.resName, // 设备名称
                  passCount: 1, // 经过次数
                  timestamp: item.timestamp, // 最新经过时间
                  time: item.time, // 识别时间
                  coordinates: coord, // 设备的坐标
                  info: item,
                  isFaceTrack: true // 区分人脸识别轨迹追踪和地图历史轨迹
                }
              }
            }
          }
          if (node) {
            trackNodeMap.set(pointId, node) // 将节点放入map中
          }
        }
      }
      let lineNodes = [...trackNodeMap.values()]
      // console.log('人脸轨迹线节点信息数组：', lineNodes)
      if (lineNodes && lineNodes.length > 0) {
        this.drawTrack.addTrackNodes(lineNodes)
      }
    },
    getPointCoodinates(point) { // 获取点位坐标
      let coord = [] // 点位坐标数组
      let loc = ''
      if (point.hasOwnProperty('isouter') && point.isouter) { // 楼外点位
        loc = point.loc
      } else if (point.hasOwnProperty('bid') && point.bid && point.bid.center) { // 楼内点位
        loc = point.bid.center
      }
      if (loc) {
        coord = loc.split(',').map(item => Number(item))
      }
      return coord
    },
    clearTrack() { // 清除轨迹绘制
      this.drawTrack.clearTrack()
      this.$forceUpdate() // 强制刷新
    },
    trackAnimate() {
      this.drawTrack.controlAnimation()
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
