import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
export default {
  data() {
    return {
      alarmLabelNames: layerConfig.commonAlarmLabel
    }
  },
  methods: {
    ...mapActions('tdIndex', [
      'setAlarmLabelFeatures'
    ]),
    handleHoverCommonAlarmFeature(attr) {
      if (attr.type === this.commonAlarmLayer.name) { // 悬浮显示名称要素
        let locArr = attr.loc.split(',')
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmLabelNames)
        locArr.length > 2 && labelFeature.geom.points && (labelFeature.geom.points = spaceUtil.getMultiLineStringCenter(labelFeature.geom.points) || labelFeature.geom.points)
        labelFeature && this.setAlarmLabelFeatures([labelFeature])
        // console.log(labelFeature)
      }
    },
    clearAlarmHoverFeatures() {
      this.setAlarmLabelFeatures([])
    }
  },
  computed: {
    ...mapGetters('tdIndex', {alarmLabelFeatures: 'alarmLabels'})
  }
}
