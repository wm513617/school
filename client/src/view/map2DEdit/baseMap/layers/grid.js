// 网格图层
// import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import areaStyle from 'assets/2DMap/areaStyle'
import areaTrans from 'assets/2DMap/feature/edit/area'
export default {
  data() {
    return {
      gridLayer: layerConfig.grid // 网格图层
    }
  },
  computed: {
    ...mapGetters({
      gridResources: 'gridResourceArr', // 网格资源数据
      grids: 'gridFeatures' // 网格要素
    })
  },
  watch: {
    gridResources: {
      handler(arr) {
        this.loadGridFeatures() // 转换网格要素数据
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadGridsByMapId',
      'loadGridsByFloorId',
      'setGridFestures'
    ]),
    loadGridFeatures() { // 转换网格要素数据
      let gridFeatures = areaTrans.transFeatures(this.gridResources, areaStyle.gridStyleWithLabel, this.gridLayer)
      this.setGridFestures(gridFeatures)
    },
    refreshCurrentGridFeature(grid) { // 刷新当前网格要素
      let featureArr = this.grids.filter(item => item.attributes.id !== grid._id)
      let feature = areaTrans.transOneFeature(grid, areaStyle.gridStyleWithLabel, this.gridLayer)
      featureArr.push(feature)
      this.setGridFestures(featureArr)
    }
  }
}
