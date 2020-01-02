// 实时报警点位和区域图层
import { mapMutations, mapGetters } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
export default {
  data() {
    return {
      alarmingLayer: layerConfig.alarming,
      alarmingLabelLayer: layerConfig.alarmingLabel
    }
  },
  computed: {
    ...mapGetters('mapAlarm', {
      outerAlarmPointLabels: 'outerAlarmPointLabels' // 点位报警名称要素
    })
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_OUTER_ALARM_POINT_LABELS']),
    handleAlarmPointFeature(attr) {
      if (attr.type === this.alarmingLayer.name) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmingLabelLayer)
        labelFeature && this.SET_OUTER_ALARM_POINT_LABELS([labelFeature])
      }
    },
    clearRealAlarmLabelFeatures() {
      this.SET_OUTER_ALARM_POINT_LABELS([])
    }
  }
}
