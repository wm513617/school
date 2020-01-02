// 门禁图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import transDoorControl from 'assets/2DMap/feature/edit/doorControl'
export default {
  data() {
    return {
      doorControlLayer: layerConfig.doorControl
    }
  },
  computed: {
    ...mapGetters({
      doorControlResources: 'doorControlResourceArr', // 报警箱资源数据
      doorControls: 'doorControlFeatures' // 报警箱要素
    }),
    queryDoorControlsFun() { // 查询门禁数据函数
      return this.isMapOuter ? this.loadDoorControlByMapId : this.loadDoorControlByFloorId
    }
  },
  watch: {
    isDoorControl(flag) { // 门禁点位显隐
      if (flag) {
        this.loadDoorControlFeatures() // 加载门禁点位要素
      } else {
        this.setDoorControlFeatures([])
      }
    },
    doorControlResources: {
      handler(arr) {
        this.isDoorControl && this.loadDoorControlFeatures() // 加载门禁点位要素数据
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadDoorControlByMapId',
      'loadDoorControlByFloorId',
      'setDoorControlFeatures',
      'addDoorControlPointRes',
      'getDoorControlTree'
    ]),
    loadDoorControlResources() { // 加载门禁点位资源
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = this.currentFloor._id
      }
      this.queryDoorControlsFun(query)
    },
    loadDoorControlFeatures() { // 加载门禁点位要素
      let doorControlFeatures = transDoorControl.transFeatures(this.doorControlResources, this.doorControlLayer)
      this.setDoorControlFeatures(doorControlFeatures)
    },
    initCurrentDoorControlFeature(doorControl) { // 初始化当前门禁要素
      let page = this.mapEditRightPage.page
      if (page === 'doorControlEditPage' && !this.isDoorControl) { // 编辑门禁资源并且不显示门禁要素时
        let copyedData = JSON.parse(JSON.stringify(doorControl))
        let doorControlFeature = transDoorControl.transOneFeature(copyedData, this.doorControlLayer)
        this.setDoorControlFeatures([doorControlFeature])
      }
    },
    refreshCurrentDoorControlFeature(doorControl) { // 刷新当前门禁要素
      let page = this.mapEditRightPage.page
      if (page === 'doorControlEditPage' || this.isDoorControl) { // 编辑门禁资源或显示门禁要素时
        let doorControlArr = this.doorControls.filter(item => item.attributes.id !== doorControl._id)
        if (this.isDoorControl || doorControl._id === this.selectedPointRes._id) { // 显示门禁要素或当前门禁数据是当前地图选择的数据时，添加当前门禁要素
          let doorControlFeature = transDoorControl.transOneFeature(doorControl, this.doorControlLayer)
          doorControlFeature && doorControlArr.push(doorControlFeature)
        }
        this.setDoorControlFeatures(doorControlArr)
      } else {
        this.setDoorControlFeatures([])
      }
    },
    addDoorControlResToMap(coods) { // 添加门禁资源到地图中
      let point = {
        principal: [{ name: '', mobile: '' }], // 联系方式
        loc: coods.toString(), // 经纬度
        isouter: this.isMapOuter,
        mid: this.pointIcon,
        projection: this.mapProjection // 当前地图投影坐标系
      }
      if (this.activeMapConfig && this.activeMapConfig.mapId) {
        point.mapId = this.activeMapConfig.mapId // 地图标识
      }
      if (this.currentFloor) {
        point.bid = this.currentFloor.bid._id // 楼宇标识
        point.sid = this.currentFloor._id // 楼层标识
      }
      let resData = JSON.parse(JSON.stringify(this.selectedPointRes))
      resData.point = point
      this.addDoorControlPointRes(resData).then(res => {
        this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
        this.SET_SELECTED_MAP_POINT_RES(null) // 设置当前地图选中的点位资源
        this.loadDoorControlResources() // 加载门禁点位资源
        let query = (!this.isMapOuter && this.currentFloor) ? this.currentFloor._id : null // 查询条件
        this.getDoorControlTree(query) // 加载视频资源树
        this.successMsg('门禁点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
