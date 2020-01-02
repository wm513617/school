import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
export default {
  data() {
    return {
      alarmBoxLabelNames: layerConfig.alarmBoxLabel,
      alarmColumnLabelNames: layerConfig.alarmColumnLabel
    }
  },
  methods: {
    ...mapActions('tdIndex', [
      'setAlarmHelpBoxLabelFeatures',
      'setAlarmHelpColmunLabelFeatures'
    ]),
    handleHoverAlarmBoxFeature(attr) {
      if (attr.type === this.alarmHelpLayer.name) { // 悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmBoxLabelNames)
        labelFeature && this.setAlarmHelpBoxLabelFeatures([labelFeature])
      }
    },
    handleHoverAlarmColumnFeature(attr) {
      if (attr.type === this.alarmColumnHelpLayer.name) { // 悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.alarmColumnLabelNames)
        labelFeature && this.setAlarmHelpColmunLabelFeatures([labelFeature])
      }
    },
    clearAlarmBoxHoverFeatures() {
      this.setAlarmHelpBoxLabelFeatures([])
    },
    clearAlarmColumnHoverFeatures() {
      this.setAlarmHelpColmunLabelFeatures([])
    }
  },
  computed: {
    ...mapGetters('tdIndex', {alarmHelpBoxLabelFeatures: 'alarmHelpBoxLabels', alarmHelpColumnLabelFeatures: 'alarmHelpColumnLabels'})
  }
}
