// 消防报警图层
import { mapState, mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import alarmTrans from 'assets/2DMap/feature/apply/alarm'
export default {
  data() {
    return {
      fireAlarmLayer: layerConfig.fireAlarm,
      fireAlarmLabelLayer: layerConfig.fireAlarmLabel
    }
  },
  computed: {
    ...mapState({
      fireAlarmList: ({ mapAlarm }) => mapAlarm.fireAlarmList
    }),
    ...mapGetters({
      fireAlarmResources: 'fireAlarmResourceArr', // 消防报警资源数据
      fireAlarms: 'fireAlarmFeatures', // 消防报警要素
      fireAlarmLabels: 'fireAlarmLabelFeatures' // 消防报警名称要素
    }),
    queryFireAlarmsFun() { // 查询消防报警数据函数
      return this.isMapOuter ? this.loadFireAlarmsByMapId : this.loadResourceByFloorId
    }
  },
  watch: {
    fireAlarmResources: {
      handler(arr) {
        this.controlFireAlarmShow() // 控制消防报警显示
        this.controlFireAlarmLabelShow() // 控制消防报警名称显示
      },
      deep: true
    },
    fireControl(flag) { // 消防报警点位显隐
      this.controlFireAlarmShow() // 控制消防报警显示
      this.controlFireAlarmLabelShow() // 控制消防报警名称显示
    },
    fireAlarmList() {
      if (this.fireControl) { this.loadFireAlarmFeatures() }
    }
  },
  methods: {
    ...mapActions([
      'loadFireAlarmsByMapId',
      'loadResourceByFloorId',
      'setFireAlarmFeatures',
      'setFireAlarmLabelFeatures'
    ]),
    loadQueryFireAlarms() { // 加载查询的消防报警数据
      let query = {}
      if (this.isMapOuter) { // 楼外地图，根据地图标识查询
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = { floorId: this.currentFloor._id, channelTypes: RESOURCETYPE.fireAlarm }
      }
      this.queryFireAlarmsFun(query)
    },
    controlFireAlarmShow() { // 控制消防报警显示
      if (this.fireControl) {
        this.loadFireAlarmFeatures() // 转换消防报警要素数据
      } else {
        this.setFireAlarmFeatures([])
      }
    },
    loadFireAlarmFeatures() { // 转换消防报警要素数据
      const arr = this.showFeaturesList(this.fireAlarmResources, this.fireAlarmList, 'fireAlarm') // 报警闪烁时不显示普通点位
      let features = alarmTrans.transFeatures(arr, this.fireAlarmLayer)
      this.setFireAlarmFeatures(features)
    },
    controlFireAlarmLabelShow() { // 控制消防报警名称显示
      if (this.fireControl && this.isNameTitle) {
        this.loadFireAlarmLabelFeatures() // 转换消防报警名称要素数据
      } else {
        this.setFireAlarmLabelFeatures([])
      }
    },
    loadFireAlarmLabelFeatures() { // 转换消防报警名称要素数据
      let labelFeatures = featureBase.transLabelFeatures(this.fireAlarmResources, this.fireAlarmLabelLayer, 0, this.isMapOuter)
      this.setFireAlarmLabelFeatures(labelFeatures)
    },
    handleHoverFireAlarmFeature(attr) { // 处理鼠标悬浮消防报警图标要素
      // console.log('处理鼠标悬浮消防报警图标要素，要素信息：', attr)
      if (attr.type === this.fireAlarmLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.fireAlarmLabelLayer)
        labelFeature && this.setFireAlarmLabelFeatures([labelFeature])
      }
    },
    clearFireAlarmHoverFeatures() { // 清空消防报警悬浮要素显示
      if (!this.isNameTitle) {
        this.setFireAlarmLabelFeatures([])
      }
    }
  }
}
