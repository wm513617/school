import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
export default {
  data() {
    return {
      patrolLabelNames: layerConfig.patrolLabel
    }
  },
  methods: {
    ...mapActions('tdIndex', [
      'setPatrolLabelFeatures'
    ]),
    handleHoverPatrolFeature(attr) {
      if (attr.type === this.patrolLayer.name) { // 悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.patrolLabelNames)
        labelFeature && this.setPatrolLabelFeatures([labelFeature])
      }
    },
    clearPatrolHoverFeatures() {
      this.setPatrolLabelFeatures([])
    }
  },
  computed: {
    ...mapGetters('tdIndex', {patrolFeatures: 'patrolLabels'})
  }
}
