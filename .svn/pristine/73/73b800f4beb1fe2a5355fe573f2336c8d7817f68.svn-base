// 报警箱图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
export default {

  data() {
    return {
      alarmBoxLayer: layerConfig.alarmBox,
      alarmBoxLabelLayer: layerConfig.alarmBoxLabel
    }
  },
  computed: {
    ...mapGetters({
      alarmBoxLabels: 'alarmBoxLabelFeatures' // 报警箱名称要素
    })
  },
  methods: {
    ...mapActions([
      'setAlarmBoxLabelFeatures'
    ]),
    handleHoverAlarmBoxFeature(attr) { // 处理鼠标悬浮报警箱图标要素
      // console.log('处理鼠标悬浮报警箱图标要素，要素信息：', attr)
      let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmBoxLabelLayer)
      labelFeature && this.setAlarmBoxLabelFeatures([labelFeature])
    },
    clearAlarmBoxHoverFeatures() { // 清空报警箱悬浮要素显示
      this.setAlarmBoxLabelFeatures([])
    }
  }
}
