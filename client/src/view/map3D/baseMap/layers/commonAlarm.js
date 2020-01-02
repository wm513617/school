// 普通报警图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
export default {
  data() {
    return {
      commonAlarmLayer: layerConfig.commonAlarm,
      commonAlarmLabelLayer: layerConfig.commonAlarmLabel
    }
  },
  methods: {
    ...mapActions([
      'setCommonAlarmLabelFeatures'
    ]),
    handleHoverCommonAlarmFeature(attr) { // 处理鼠标悬浮普通报警图标要素
      //  console.log('处理鼠标悬浮普通报警图标要素，要素信息：', attr)
      let labelFeature = featureBase.getHoverLabelFeature(attr, this.commonAlarmLabelLayer)
      labelFeature && this.setCommonAlarmLabelFeatures([labelFeature])
    },
    clearCommonAlarmHoverFeatures() { // 清空普通报警悬浮要素显示
      this.setCommonAlarmLabelFeatures([])
    }
  },
  computed: {
    ...mapGetters({
      commonAlarmLabels: 'commonAlarmLabelFeatures' // 普通报警名称要素
    })
  }
}
