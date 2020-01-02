// 网格图层
import { mapGetters, mapActions } from 'vuex'
import { RESOURCETYPE } from 'assets/2DMap/meta/common'
import layerConfig from 'assets/2DMap/meta/layer'
import areaStyle from 'assets/2DMap/areaStyle'
import areaTrans from 'assets/2DMap/feature/apply/area'
import highLight from 'assets/2DMap/feature/edit/highLight'
export default {
  data() {
    return {
      gridLayer: layerConfig.grid, // 网格图层
      gridLabelLayer: layerConfig.gridLabel // 网格名称图层
    }
  },
  computed: {
    ...mapGetters({
      gridResources: 'gridResourceArr', // 网格资源数据
      grids: 'gridFeatures', // 网格要素
      gridLabels: 'gridLabelFeatures', // 网格名称要素
      selectedTreeNode: 'selectedTreeNode', // 选中的树节点
      currentGrid: 'currentGrid' // 当前的网格数据
    }),
    queryGridsFun() { // 查询网格数据函数
      return this.isMapOuter ? this.loadGridsByMapId : this.loadGridsByFloorId
    }
  },
  watch: {
    gridResources: {
      handler(arr) {
        this.controlGridShow()
        this.controlGridLabelShow()
      },
      deep: true
    },
    isGrid(flag) { // 网格显隐
      this.controlGridShow()
      this.controlGridLabelShow()
    },
    currentGrid: { // 当前网格数据
      handler(data) {
        if (data && this.selectedTreeNode && this.selectedTreeNode.type === RESOURCETYPE.grid) {
          if (this.isMapOuter && !data.sid) { // 楼外且网格无楼层 或 楼内且网格在当前楼层
            this.handleSelectGrid(data) // 处理选择网格节点
          } else { // 楼内
            if (this.currentFloor && data.sid === this.currentFloor._id) { // 网格所在楼层时当前楼层时
              this.handleSelectGrid(data) // 处理选择网格节点
            }
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    ...mapActions([
      'loadGridsByMapId',
      'loadGridsByFloorId',
      'setGridFestures',
      'setGridLabelFestures'
    ]),
    loadQueryGrids() { // 加载查询到的网格数据
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = this.currentFloor._id
      }
      this.queryGridsFun(query)
    },
    handleSelectGrid(data) { // 处理选择网格节点
      let gridFeatures = areaTrans.transFeatures([data], areaStyle.gridStyle, this.gridLayer)
      this.SET_LOCATE_AREA_FEATURES(gridFeatures)
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
    controlGridLabelShow() {
      if (this.isGrid && this.isNameTitle) {
        this.loadGridLabelFeatures() // 转换网格要素数据
      } else {
        this.setGridLabelFestures([])
      }
    },
    loadGridLabelFeatures() { // 转换网格要素数据
      let gridFeatures = areaTrans.transFeatures(this.gridResources, areaStyle.gridLabelStyle, this.gridLabelLayer)
      this.setGridLabelFestures(gridFeatures)
    },
    controlGridShow() {
      if (this.isGrid) {
        this.loadGridFeatures() // 转换网格要素数据
      } else {
        this.setGridFestures([])
      }
    },
    loadGridFeatures() { // 转换网格要素数据
      let gridFeatures = areaTrans.transFeatures(this.gridResources, areaStyle.gridStyle, this.gridLayer)
      this.setGridFestures(gridFeatures)
    },
    handleHoverGridFeature(attr) { // 处理悬浮网格要素
      // console.log('处理鼠标悬浮网格要素，要素信息：', attr)
      if (attr.type === this.gridLayer.name && !this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称要素
        let labelFeature = areaTrans.getHoverLabelFeature(attr, areaStyle.gridLabelStyle, this.gridLabelLayer)
        labelFeature && labelFeature && this.setGridLabelFestures([labelFeature])
      }
    },
    clearGridHoverFeatures() { // 清空网格悬浮要素
      if (!this.isNameTitle) {
        this.setGridLabelFestures([])
      }
    }
  }
}
