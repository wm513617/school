// 报警主机图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import featureBase from 'assets/2DMap/feature/base'
import alarmTrans from 'assets/2DMap/feature/apply/alarm'
export default {
  data() {
    return {
      alarmHostLayer: layerConfig.alarmHost,
      alarmHostLabelLayer: layerConfig.alarmHostLabel
    }
  },
  computed: {
    ...mapGetters({
      alarmHostResources: 'alarmHostResourceArr', // 报警主机资源数据
      alarmHosts: 'alarmHostFeatures', // 报警主机要素
      alarmHostLabels: 'alarmHostLabelFeatures' // 报警主机名称要素
    }),
    queryAlarmHostsFun() { // 查询报警主机数据函数
      return this.isMapOuter ? this.loadAlarmHostsByMapId : this.loadResourceByFloorId
    }
  },
  watch: {
    alarmHostResources: {
      handler(arr) {
        this.controlAlarmHostShow() // 控制报警主机显示
        this.controlAlarmHostLabelShow() // 控制报警主机名称显示
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadAlarmHostsByMapId',
      'loadResourceByFloorId',
      'setAlarmHostFeatures',
      'setAlarmHostLabelFeatures'
    ]),
    loadAlarmHostResources() { // 加载报警主机资源数据
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = { floorId: this.currentFloor._id, channelTypes: RESOURCETYPE.alarmHost }
      }
      this.queryAlarmHostsFun(query)
    },
    controlAlarmHostShow() { // 控制报警主机显示
      this.loadAlarmHostFeatures() // 加载报警主机要素数据
    },
    loadAlarmHostFeatures() { // 加载报警主机要素数据
      let features = alarmTrans.transFeatures(this.alarmHostResources, this.alarmHostLayer)
      this.setAlarmHostFeatures(features)
    },
    controlAlarmHostLabelShow() { // 控制报警主机名称显示
      if (this.isNameTitle) {
        this.loadAlarmHostLabelFeatures() // 转换报警主机名称要素数据
      } else {
        this.setAlarmHostLabelFeatures([])
      }
    },
    loadAlarmHostLabelFeatures() { // 转换报警主机名称要素数据
      let labelFeatures = featureBase.transLabelFeatures(this.alarmHostResources, this.alarmHostLabelLayer)
      this.setAlarmHostLabelFeatures(labelFeatures)
    },
    handleHoverAlarmHostFeature(attr) { // 处理鼠标悬浮报警主机图标要素
      // console.log('处理鼠标悬浮报警主机图标要素，要素信息：', attr)
      if (attr.type === this.alarmHostLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmHostLabelLayer)
        labelFeature && this.setAlarmHostLabelFeatures([labelFeature])
      }
    },
    clearAlarmHostHoverFeatures() { // 清空报警主机悬浮要素显示
      if (!this.isNameTitle) {
        this.setAlarmHostLabelFeatures([])
      }
    }
  }
}
