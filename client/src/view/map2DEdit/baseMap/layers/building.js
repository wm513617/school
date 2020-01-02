// 楼宇图层
import { mapGetters, mapActions } from 'vuex'
// import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import layerConfig from 'assets/2DMap/meta/layer'
import areaStyle from 'assets/2DMap/areaStyle'
import areaTrans from 'assets/2DMap/feature/edit/area'
export default {
  data() {
    return {
      buildingLayer: layerConfig.building
    }
  },
  computed: {
    ...mapGetters({
      buildingResources: 'buildingResourceArr', // 楼宇资源数据
      buildings: 'buildingFeatures' // 楼宇要素
    })
  },
  watch: {
    buildingResources: {
      handler(arr) {
        this.loadBuildingFeatures() // 转换网格要素数据
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadBuildingsByMapId',
      'setBuildingFestures'
    ]),
    loadBuildingFeatures() { // 转换楼宇要素数据
      let buildingFeatures = areaTrans.transFeatures(this.buildingResources, areaStyle.buildStyleWithLabel, this.buildingLayer)
      this.setBuildingFestures(buildingFeatures)
    },
    refreshCurrentBuildingFeature(building) { // 刷新当前楼宇要素
      let featureArr = this.buildings.filter(item => item.attributes.id !== building._id)
      let feature = areaTrans.transOneFeature(building, areaStyle.buildStyleWithLabel, this.buildingLayer)
      featureArr.push(feature)
      this.setBuildingFestures(featureArr)
    }
  }
}
