// 门禁图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
import transDoorControl from 'assets/2DMap/feature/apply/doorControl'
export default {
  data() {
    return {
      doorControlLayer: layerConfig.doorControl,
      doorControlLabelLayer: layerConfig.doorControlLabel
    }
  },
  computed: {
    ...mapGetters({
      doorControlResources: 'doorControlResourceArr', // 门禁资源数据
      doorControls: 'doorControlFeatures', // 门禁要素
      doorControlLabels: 'doorControlLabelFeatures' // 门禁名称要素
    }),
    queryDoorControlsFun() { // 查询门禁数据函数
      return this.isMapOuter ? this.loadDoorControlByMapId : this.loadDoorControlByFloorId
    }
  },
  watch: {
    isDoorControl(flag) { // 门禁点位显隐
      this.controlDoorControlShow() // 控制门禁要素显示
      this.controlDoorControlLabelShow() // 控制门禁名称要素显示
    },
    doorControlResources: {
      handler(arr) {
        this.controlDoorControlShow() // 控制门禁要素显示
        this.controlDoorControlLabelShow() // 控制门禁名称要素显示
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadDoorControlByMapId',
      'loadDoorControlByFloorId',
      'setDoorControlFeatures',
      'setDoorControlLabelFeatures'
    ]),
    loadDoorControlResources() { // 加载门禁点位资源
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = this.currentFloor._id
      }
      this.queryDoorControlsFun(query)
    },
    controlDoorControlShow() { // 控制门禁要素显示
      if (this.isDoorControl) {
        this.loadDoorControlFeatures() // 转换门禁要素数据
      } else {
        this.setDoorControlFeatures([])
      }
    },
    loadDoorControlFeatures() {
      let doorControlFeatures = transDoorControl.transFeatures(this.doorControlResources, this.doorControlLayer)
      this.setDoorControlFeatures(doorControlFeatures)
    },
    controlDoorControlLabelShow() { // 控制门禁名称要素显示
      if (this.isDoorControl && this.isNameTitle) {
        this.loadDoorControlLabelFeatures() // 转换门禁名称要素数据
      } else {
        this.setDoorControlLabelFeatures([])
      }
    },
    loadDoorControlLabelFeatures() { // 加载门禁名称要素
      let labelFeatures = featureBase.transLabelFeatures(this.doorControlResources, this.doorControlLabelLayer)
      this.setDoorControlLabelFeatures(labelFeatures)
    },
    handleHoverDoorControlFeature(attr) { // 处理鼠标悬浮门禁图标要素
      // console.log('处理鼠标悬浮门禁图标要素，要素信息：', attr)
      if (attr.type === this.doorControlLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.doorControlLabelLayer)
        labelFeature && this.setDoorControlLabelFeatures([labelFeature])
      }
    },
    clearDoorControlHoverFeatures() { // 清空门禁悬浮要素显示
      if (!this.isNameTitle) {
        this.setDoorControlLabelFeatures([])
      }
    }
  }
}
