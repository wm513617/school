import { mapGetters, mapActions, mapMutations } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
/* import areaTrans from 'assets/2DMap/feature/apply/area'
import areaStyle from 'assets/2DMap/areaStyle' */
export default {
  data() {
    return {
      gridLabelNames: layerConfig.gridLabel
    }
  },
  methods: {
    ...mapActions([
      'setGridList',
      'setCurrentGrid3D'
    ]),
    ...mapMutations(['DETEL_CURRENT_GRID_3D']),
    handleHoverGridFeature(attr) { // 处理悬浮网格要素
      //  console.log('处理鼠标悬浮网格要素，要素信息：', attr)
      this.setCurrentGrid3D(attr)
    },
    clearGridHoverFeatures() { // 清空网格悬浮要素
      this.DETEL_CURRENT_GRID_3D()
    }
  },
  computed: {
    ...mapGetters('tdIndex', {gridFeatures: 'gridLabels'})
  }
}
