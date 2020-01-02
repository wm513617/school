// 消防报警图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'

export default {
  data() {
    return {
      fireAlarmLayer: layerConfig.fireAlarm,
      fireAlarmLabelLayer: layerConfig.fireAlarmLabel
    }
  },
  computed: {
    ...mapGetters({
      fireAlarmLabels: 'fireAlarmLabelFeatures' // 消防报警名称要素
    })
  },
  methods: {
    ...mapActions([
      'setFireAlarmLabelFeatures'
    ]),
    handleHoverFireAlarmFeature(attr) { // 处理鼠标悬浮消防报警图标要素
      // console.log('处理鼠标悬浮消防报警图标要素，要素信息：', attr)
      let labelFeature = featureBase.getHoverLabelFeature(attr, this.fireAlarmLabelLayer)
      labelFeature && this.setFireAlarmLabelFeatures([labelFeature])
    },
    clearFireAlarmHoverFeatures() { // 清空消防报警悬浮要素显示
      this.setFireAlarmLabelFeatures([])
    }
  }
}
