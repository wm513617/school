// 巡更、单兵图层
import { mapGetters, mapActions, mapState } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'

export default {
  data() {
    return {
      patrolLayer: layerConfig.patrol,
      patrolLabelLayer: layerConfig.patrolLabel
    }
  },
  computed: {
    ...mapGetters({
      patrolLabels: 'patrolLabelFeatures' // 巡更名称要素
    })
  },
  methods: {
    ...mapActions([
      'setPatrolLabelFeatures'
    ]),
    handleHoverPatrolFeature(attr) { // 处理鼠标悬浮巡更图标要素
      // console.log('处理鼠标悬浮巡更图标要素，要素信息：', attr)
      let labelFeature = featureBase.getHoverLabelFeature(attr, this.patrolLabelLayer)
      labelFeature && this.setPatrolLabelFeatures([labelFeature])
    },
    clearPatrolHoverFeatures() { // 清空巡更悬浮要素显示
      this.setPatrolLabelFeatures([])
    }
  }
}
