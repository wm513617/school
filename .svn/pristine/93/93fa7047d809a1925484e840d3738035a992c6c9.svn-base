// 普通报警图层
import { mapState, mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import alarmTrans from 'assets/2DMap/feature/apply/alarm'
export default {
  data() {
    return {
      commonAlarmLayer: layerConfig.commonAlarm,
      commonAlarmLabelLayer: layerConfig.commonAlarmLabel
    }
  },
  computed: {
    ...mapState({
      normalAlarmList: ({ mapAlarm }) => mapAlarm.normalAlarmList
    }),
    ...mapGetters({
      commonAlarmResources: 'commonAlarmResourceArr', // 普通报警资源数据
      commonAlarms: 'commonAlarmFeatures', // 普通报警要素
      commonAlarmLabels: 'commonAlarmLabelFeatures' // 普通报警名称要素
    }),
    queryCommonAlarmsFun() { // 查询普通报警数据函数
      return this.isMapOuter ? this.loadCommonAlarmsByMapId : this.loadResourceByFloorId
    }
  },
  watch: {
    commonAlarmResources: {
      handler(arr) {
        this.controlCommonAlarmShow() // 控制普通报警显示
        this.controlCommonAlarmLabelShow() // 控制普通报警名称显示
      },
      deep: true
    },
    alarm(flag) { // 普通报警点位显隐
      this.controlCommonAlarmShow() // 控制普通报警显示
      this.controlCommonAlarmLabelShow() // 控制普通报警名称显示
    },
    normalAlarmList() {
      if (this.alarm) {
        this.loadCommonAlarmFeatures()
      }
    }
  },
  methods: {
    ...mapActions([
      'loadCommonAlarmsByMapId',
      'loadResourceByFloorId',
      'setCommonAlarmResources',
      'setCommonAlarmFeatures',
      'setCommonAlarmLabelFeatures'
    ]),
    loadQueryCommonAlarms() { // 加载查询的普通报警数据
      let query = {}
      if (this.isMapOuter) { // 楼外地图，根据地图标识查询
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = { floorId: this.currentFloor._id, channelTypes: RESOURCETYPE.commonAlarm }
      }
      this.queryCommonAlarmsFun(query)
    },
    controlCommonAlarmShow() { // 控制普通报警显示
      if (this.alarm) {
        this.loadCommonAlarmFeatures() // 转换普通报警要素数据
      } else {
        this.setCommonAlarmFeatures([])
      }
    },
    loadCommonAlarmFeatures() { // 加载普通报警要素
      const arr = this.showFeaturesList(this.commonAlarmResources, this.normalAlarmList, 'alarmInput') // 报警闪烁时不显示普通点位
      let features = alarmTrans.transFeatures(arr, this.commonAlarmLayer)
      this.setCommonAlarmFeatures(features)
    },
    controlCommonAlarmLabelShow() { // 控制普通报警名称显示
      if (this.alarm && this.isNameTitle) {
        this.loadCommonAlarmLabelFeatures() // 转换普通报警名称要素数据
      } else {
        this.setCommonAlarmLabelFeatures([])
      }
    },
    loadCommonAlarmLabelFeatures() { // 加载普通报警要素
      let labelFeatures = featureBase.transLabelFeatures(this.commonAlarmResources, this.commonAlarmLabelLayer)
      this.setCommonAlarmLabelFeatures(labelFeatures)
    },
    handleHoverCommonAlarmFeature(attr) { // 处理鼠标悬浮普通报警图标要素
      // console.log('处理鼠标悬浮普通报警图标要素，要素信息：', attr)
      if (attr.type === this.commonAlarmLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.commonAlarmLabelLayer)
        labelFeature && this.setCommonAlarmLabelFeatures([labelFeature])
      }
    },
    clearCommonAlarmHoverFeatures() { // 清空普通报警悬浮要素显示
      if (!this.isNameTitle) {
        this.setCommonAlarmLabelFeatures([])
      }
    }
  }
}
