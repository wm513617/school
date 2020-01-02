/* import areaTrans from 'assets/2DMap/feature/apply/area'
import areaStyle from 'assets/2DMap/areaStyle' */
import gridTrans from 'assets/3DMap/gridUtil'
import layerConfig from 'assets/2DMap/meta/layer'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      gridLayer: layerConfig.grid, // 网格图层
      gridLabelLayer: layerConfig.gridLabel // 网格名称图层
    }
  },
  methods: {
    ...mapActions([
      'setGridList',
      'setCurrentGrid3D',
      'setCurrentHighLightGrid'
    ]),
    ...mapMutations(['DETEL_CURRENT_GRID_3D', 'DETEL_HIGHLIGHT_LABEL_TEXT']),
    handleHoverGridFeature(attr) { // 处理悬浮网格要素
      this.setCurrentGrid3D(attr)
    },
    clearGridHoverFeatures() { // 清空网格悬浮要素
      this.DETEL_CURRENT_GRID_3D()
    },
    handleHoverHighLightGridFeature(attr) { // 处理高亮悬浮网格要素
      this.setCurrentHighLightGrid(attr)
    },
    clearHighLightGridHoverFeatures() { // 清空网格悬浮要素
      this.DETEL_HIGHLIGHT_LABEL_TEXT()
    }
  },
  computed: {
    ...mapState({
      gridFeatureList: ({ tdPoint }) => tdPoint.gridFeatureList // 网格列表要素
    })
  }
}
