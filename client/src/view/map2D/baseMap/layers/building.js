// 楼宇图层
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import layerConfig from 'assets/2DMap/meta/layer'
import areaUtil from 'assets/2DMap/areaUtil'
import areaStyle from 'assets/2DMap/areaStyle'
import areaTrans from 'assets/2DMap/feature/apply/area'
import highLight from 'assets/2DMap/feature/edit/highLight'
export default {
  data() {
    return {
      buildingLayer: layerConfig.building,
      buildingLabelLayer: layerConfig.buildingLabel
    }
  },
  computed: {
    ...mapGetters({
      buildingResources: 'buildingResourceArr', // 楼宇资源数据
      buildings: 'buildingFeatures', // 楼宇要素
      buildingLabels: 'buildingLabelFeatures', // 楼宇名称要素
      selectedTreeNode: 'selectedTreeNode', // 选中的树节点
      currentBuilding: 'currentBuilding' // 当前的楼宇数据
    }),
    ...mapGetters('mapAlarm', ['buildingAlarming', 'sixTypeAlarmBuildList', 'allVideoAlarmBuildList', 'sosAlarmBuildList']),
    ...mapGetters('map2DApplyIX', [ 'isPlatformTrack' ]) // 接力追踪状态
  },
  watch: {
    buildingResources: {
      handler(arr) {
        this.controlBuildingShow()
        this.controlBuildingLabelShow()
      },
      deep: true
    },
    isBuilding(flag) { // 楼宇显隐
      this.controlBuildingShow()
      this.controlBuildingLabelShow()
    },
    currentBuilding: { // 当前楼宇数据
      handler(data) {
        if (data && this.selectedTreeNode && this.selectedTreeNode.type === RESOURCETYPE.building) {
          this.handleSelectBuilding(data) // 处理选择楼宇节点
        }
      },
      deep: true,
      immediate: true
    },
    buildingAlarming() {
      if (this.isBuilding) {
        this.loadBuildingFeatures()
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_LOCATE_FEATURES'
    ]),
    ...mapActions([
      'loadBuildingsByMapId',
      'setBuildingFestures',
      'setBuildingLabelFestures'
    ]),
    loadQueryBuildings() { // 加载查询到的楼宇数据
      if (this.activeMapConfig.mapId) {
        this.loadBuildingsByMapId(this.activeMapConfig.mapId)
      }
    },
    handleSelectBuilding(data) { // 处理选择楼宇节点
      let buildingFeatures = areaTrans.transFeatures([data], areaStyle.buildStyle, this.buildingLayer)
      this.SET_LOCATE_AREA_FEATURES(buildingFeatures)
      let { center } = data
      if (center) { // 有中心点信息，定位楼宇到地图的中
        let centerCoValues = center.split(',').map(item => Number(item))
        if (this.selectedTreeNode && this.selectedTreeNode._id === data._id) {
          this.locateInMapCenter(centerCoValues)
        }
        let feature = highLight.getLocateFeature(data._id, centerCoValues)
        this.SET_LOCATE_FEATURES([feature])
      }
    },
    controlBuildingLabelShow() { // 控制建筑物名称的显隐
      if (this.isBuilding && this.isNameTitle) {
        this.loadBuildingLabelFeatures() // 转换楼宇要素数据
      } else {
        this.setBuildingLabelFestures([])
      }
    },
    loadBuildingLabelFeatures() { // 转换楼宇要素数据
      let buildingFeatures = areaTrans.transFeatures(this.buildingResources, areaStyle.buildLabelStyle, this.buildingLabelLayer)
      this.setBuildingLabelFestures(buildingFeatures)
    },
    controlBuildingShow() { // 控制建筑物的显隐
      if (this.isBuilding || this.isPlatformTrack) {
        this.loadBuildingFeatures() // 转换楼宇要素数据
      } else {
        this.setBuildingFestures([])
      }
    },
    loadBuildingFeatures() { // 转换楼宇要素数据
      let arr
      if (this.isPlatformTrack) {
        arr = this.buildingResources
      } else {
        const buildAlarming = JSON.parse(JSON.stringify(this.sixTypeAlarmBuildList)).concat(JSON.parse(JSON.stringify(this.allVideoAlarmBuildList)), JSON.parse(JSON.stringify(this.sosAlarmBuildList)))
        arr = this.showFeaturesList(this.buildingResources, buildAlarming, 'building')
      }
      let buildingFeatures = areaTrans.transFeatures(arr, areaStyle.buildStyle, this.buildingLayer)
      this.setBuildingFestures(buildingFeatures)
    },
    handleHoverBuildingFeature(attr) { // 处理悬浮楼宇要素
      // console.log('处理鼠标悬浮楼宇要素，要素信息：', attr)
      let isHighLight = this.judgeIsBuildingHighLight(attr.id) // 判断楼宇是否高亮
      let showArea = this.isBuilding || isHighLight // 楼宇区域是否显示
      if ((attr.type === this.buildingLayer.name && showArea && !this.isNameTitle) || (attr.isAlarm)) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = areaTrans.getHoverLabelFeature(attr, areaStyle.buildLabelStyle, this.buildingLabelLayer)
        labelFeature && this.setBuildingLabelFestures([labelFeature])
      }
    },
    queryBuildingByLoc(param) { // 根据位置查询楼宇数据
      if (!this.isBuilding) { // 隐藏楼宇要素时
        if (this.buildingResources && this.buildingResources.length > 0) {
          this.loadQueryBuildFeature(param) // 加载查询到的宇要素
        } else {
          if (this.activeMapConfig.mapId) {
            this.loadBuildingsByMapId(this.activeMapConfig.mapId).then(res => {
              this.loadQueryBuildFeature(param) // 加载查询到的宇要素
            })
          }
        }
      }
    },
    loadQueryBuildFeature(param) { // 加载查询到的宇要素
      let [...buildings] = this.buildingResources
      if (buildings.length > 0) {
        let res = areaUtil.findBuildingByExtent(buildings, param)
        if (res.flag) {
          let isHighLight = this.judgeIsBuildingHighLight(res.info._id)
          if (!isHighLight) {
            let buildingFeatures = areaTrans.transFeatures([res.info], areaStyle.buildStyle, this.buildingLayer)
            this.setBuildingFestures(buildingFeatures)
          }
        } else {
          this.setBuildingFestures([])
        }
      }
    },
    judgeIsBuildingHighLight(buildingId) { // 判断楼宇是否高亮
      let isHighLight = false
      for (let feature of this.locateAreaFeatures) {
        if (feature.attributes) {
          let { attributes } = feature
          if (buildingId === attributes.id) {
            isHighLight = true
          }
        }
      }
      return isHighLight
    },
    clearBuildingHoverFeatures() { // 清空楼宇悬浮要素
      if (!this.isNameTitle) {
        this.setBuildingLabelFestures([])
      }
    }
  }
}
