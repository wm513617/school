// 报警柱图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
export default {
  data() {
    return {
      alarmColumnLayer: layerConfig.alarmColumn,
      alarmColumnLabelLayer: layerConfig.alarmColumnLabel
    }
  },
  computed: {
    ...mapGetters({
      alarmColumnLabels: 'alarmColumnLabelFeatures' // 报警柱名称要素
    })
  },
  methods: {
    ...mapActions([
      'setAlarmColumnLabelFeatures'
    ]),
    handleHoverAlarmColumnFeature(attr) { // 处理鼠标悬浮报警柱图标要素
      // console.log('处理鼠标悬浮报警柱图标要素，要素信息：', attr)
      let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmColumnLabelLayer)
      labelFeature && this.setAlarmColumnLabelFeatures([labelFeature])
    },
    clearAlarmColumnHoverFeatures() { // 清空报警柱悬浮要素显示
      this.setAlarmColumnLabelFeatures([])
    }
  }
}
