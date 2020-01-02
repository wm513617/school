<template>
  <div class="feng-map">
    <!-- 加载地图容器 -->
    <div id="fengMap">
      <draw-line :fengMap="fengMap" :actived='drawLineActived' :clear="drawLineClear" @drawend="handleDrawLine"></draw-line>
      <face-head v-for="node in faceHeadDatas" :key="node.pointId" :node="node" :fengMap="fengMap" @drawend="handleFaceHead"></face-head>
    </div>
    <div style="position: absolute; z-index: 999; top: 20; left: 20;">
      <!-- <button @click="locateInMapCenter([ 12947741.018056273460388, 4861209.993831714615226 ])">locate</button>
      <button @click="regDrawPointMouseTip">showmousetip</button>
      <button @click="unRegDrawPointMouseTip">hidemousetip</button> -->
      <br />
      <button @click="startDrawLines">startDrawLines</button>
      <button @click="endDrawLines">endDrawLines</button>
      <button @click="clearLineMark">clearLineMark</button>
    </div>
    <div class="control-box iconfont">
      <div class="control-item">
        <p class="icon-focusing" title="回到中心点"></p>
      </div>
      <div class="control-item">
        <p class="icon-icon" title="指北针"></p>
      </div>
      <div class="control-item">
        <p class="icon-add" title="放大"></p>
      </div>
      <div class="control-item">
        <p class="icon-reduce" title="缩小"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { getMarkerById, deletePointById, markerTypes } from 'assets/fengMap/meta/pointData.js'
import baseCtrl from './ctrl/base'
import eventCtrl from './ctrl/event'
import featureDraw from './ctrl/featureDraw'
import pointResource from './layers/pointResource'
import hightLayer from './layers/hightLoc'
import videoLayer from './layers/video'
import doorLayer from './layers/doorControl'
import commonAlarmLayer from './layers/commonAlarm'
import DrawLine from 'components/fengmap/draw/DrawLine'
import FaceHead from 'components/fengmap/faceHead/FaceHead'
export default {
  name: 'FengMapEdit',
  components: { DrawLine, FaceHead },
  mixins: [baseCtrl, eventCtrl, featureDraw, hightLayer, pointResource, videoLayer, doorLayer, commonAlarmLayer],
  data() {
    return {
      isLoading: false,
      fengMap: null, // map变量
      fmgroup: null
    }
  },
  props: {},
  created() {
    this.loadMapConfigArr()
      .then(res => {
      })
      .catch(err => {
        console.log('地图信息获取失败，请联系管理员', err)
      })
  },
  mounted() {
    this.$nextTick(() => {
      this.isLoading = true
      this.loadFengMap()
    })
  },
  computed: {
    ...mapGetters('fengMapFace', ['faceHeadDatas']),
    ...mapGetters('fengMap', ['deleteResource', 'updateFMEditIcon']),
    ...mapGetters('fengMapLine', ['drawLineActived', 'drawLineClear']),
    ...mapState({
      fmapID: ({ fengMap }) => fengMap.fmapID,
      fmapLoadComplete: ({ fengMap }) => fengMap.fmapLoadComplete,
      isfmOuter: ({ fengMap }) => fengMap.isfmOuter,
      selectedFMapPointRes: ({ fengMap }) => fengMap.selectedFMapPointRes,
      activeFMap: ({ fengMap }) => fengMap.activeFMap
    })
  },
  watch: {
    deleteResource(val) {
      if (val.type && val.channelId) {
        this.deleteResourcePoint(val.type, val.channelId)
      }
    },
    updateFMEditIcon(val) { // 图标切换
      this.updateCurIcon(val)
    }
  },
  methods: {
    ...mapMutations('fengMap', ['SET_FM_OUTER', 'SET_FMAP_ID', 'SET_LOAD_STATUS', 'SET_DEL_MARKER_POINT', 'UPDATE_FMEDIT_ICON']),
    ...mapActions('fengMap', ['changeFMeditRightPage']),
    ...mapActions(['loadMapConfigArr']),
    ...mapActions('fengMapFace', ['setFaceHeadDatas']),
    ...mapActions('fengMapLine', ['setLineStringStyle', 'setLineStringLoc', 'setLineTrackLoc', 'setDrawLineActived', 'setDrawLineClear']),
    enableMeasurePolygon() { // 开启测量多边形
      this.measurePolygonParams.actived = true
    },
    handleMeasurePolygonEnd(param) { // 测量多边形完成
      console.log('测量多边形完成，参数：', param)
      this.measurePolygonParams.actived = false
    },
    clearMeasurePolygon() { // 清空测量多边形绘制
      this.measurePolygonParams.actived = false
      this.measurePolygonParams.clear = true
    },
    // 线绘制完成
    handleDrawLine(param) { // 线绘制完成
      console.log('线绘制完成，参数：', param)
    },
    // 开启绘制线
    startDrawLines() {
      this.setDrawLineActived(true)
    },
    // 结束绘制线
    endDrawLines() {
      this.setDrawLineActived(false)
    },
    // 清除绘制
    clearLineMark() {
      this.setDrawLineActived(false)
      this.setDrawLineClear(true)
    },
    handleFaceHead(node, popMarker) {
      console.log('头像绘制完成')
    },
    deleteResourcePoint(type, id) { // 删除点位，图标
      let markerId
      const layerTypes = {
        'layer': markerTypes.marker,
        'sectorLayer': markerTypes.sector
      }
      for (const i in layerTypes) {
        markerId = getMarkerById(layerTypes[i], type, id)
        let im
        this[i + type].markers.map(item => { if (item.renderNode.id === markerId) { im = item } })
        im && this[i + type].removeMarker(im)
      }
      deletePointById(type, markerId) // 删除存储数据
      this.changeHightLayerState(false) // 高亮图层隐藏
      if (this.selectedFMapPointRes && this.selectedFMapPointRes._id === id) {
        this.changeFMeditRightPage({ page: '', detail: 'show' }) // 编辑面板关闭
      }
      this.SET_DEL_MARKER_POINT({type: '', channelId: ''}) // 清除 删除的资源信息
    },
    updateCurIcon(val) { // 切换图标
      if (val.length) {
        const files = this.$lodash.cloneDeep(val[1].files)
        const oid = val[0]
        const markerId = getMarkerById(markerTypes.marker, oid, val[2])
        let im
        this['layer' + oid] && this['layer' + oid].markers.map(item => { if (item.renderNode.id === markerId) { im = item } })
        im && files && files.map(item => { if (item.status === 'online' || item.status === 'open') { im.url = item.path } })
        this.UPDATE_FMEDIT_ICON([])
      }
    }
  },
  beforeDestroy() {
    this.tooltip.destory() // 销毁提示工具
  }
}
</script>
<style scoped>
  .feng-map, #fengMap {
    width: 100%;
    height: 100%
  }
  .control-box {
    position: absolute;
    z-index: 999;
    right: 4px;
    bottom: 4px;
    width: 162px;
    height: 40px;
    line-height: 40px;
    background-color: #0f2343;
    border-radius: 4px;
    color: #fff !important;
  }
  .control-box .control-item:hover {
    color: #4699f9;
  }
  .control-box .control-item {
    display: inline;
    margin: 0px 8px;
    cursor: pointer;
  }
  .control-box .control-item p {
    display: inline;
    font-size: 16px;
  }
</style>
