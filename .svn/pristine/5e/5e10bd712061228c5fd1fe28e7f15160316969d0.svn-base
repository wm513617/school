// 报警柱图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE, MAPMODE } from 'assets/2DMap/meta/common'
import transAlarmHelp from 'assets/2DMap/feature/edit/alarmHelp'
export default {
  data() {
    return {
      alarmColumnLayer: layerConfig.alarmColumn
    }
  },
  computed: {
    ...mapGetters({
      alarmColumnResources: 'alarmColumnResourceArr', // 报警柱资源数据
      alarmColumns: 'alarmColumnFeatures' // 报警柱要素
    })
  },
  watch: {
    alarmColumnResources: {
      handler(arr) {
        this.isAlarmColumn && this.loadAlarmColumnFeatures() // 加载报警箱要素数据
      },
      deep: true
    },
    isAlarmColumn(flag) { // 报警柱显隐
      if (flag) {
        this.loadAlarmColumnFeatures() // 加载报警柱要素
      } else {
        this.setAlarmColumnFeatures([])
      }
    }
  },
  methods: {
    ...mapActions([
      'queryAlarmHelpRes',
      'setAlarmColumnFeatures',
      'get2DAlarmHelpOrgTree'
    ]),
    loadAlarmColumnResources() { // 加载报警柱点位资源
      let query = {alarm: RESOURCETYPE.alarmColumn}
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query.sId = this.currentFloor._id
      }
      this.queryAlarmHelpRes(query)
    },
    loadAlarmColumnFeatures() { // 加载报警柱点位要素
      let features = transAlarmHelp.transFeatures(this.alarmColumnResources, this.alarmColumnLayer)
      this.setAlarmColumnFeatures(features)
    },
    initCurrentAlarmColumnFeature(alarmColumn) { // 初始化当前报警柱要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmHelp' && !this.isAlarmColumn) { // 编辑报警柱资源并且不显示报警柱要素时
        let cppyedData = JSON.parse(JSON.stringify(alarmColumn))
        let alarmColumnFeature = transAlarmHelp.transOneFeature(cppyedData, this.alarmColumnLayer)
        this.setAlarmColumnFeatures([alarmColumnFeature])
      }
    },
    refreshCurrentAlarmColumnFeature(alarmColumn) { // 刷新当前报警柱要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmHelp' || this.isAlarmColumn) { // 编辑报警柱资源或显示报警柱要素时，还原报警柱要素
        let alarmColumnArr = this.alarmColumns.filter(item => item.attributes.id !== alarmColumn._id)
        if (this.isAlarmColumn || alarmColumn._id === this.selectedPointRes._id) { // 显示报警柱要素或当前报警柱数据是当前地图选择数的据时，添加当前报警柱要素
          let alarmColumnFeature = transAlarmHelp.transOneFeature(alarmColumn, this.alarmColumnLayer)
          alarmColumnFeature && alarmColumnArr.push(alarmColumnFeature)
        }
        this.setAlarmColumnFeatures(alarmColumnArr)
      } else {
        this.setAlarmColumnFeatures([])
      }
    },
    addAlarmColumnResToMap(coods) { // 添加报警柱资源到地图中
      let point = {
        principal: [{ name: '', mobile: '' }], // 联系方式
        loc: coods.toString(), // 经纬度
        isouter: this.isMapOuter,
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
      this.saveCommonPointRes({ _id: resData._id, body: resData }).then(res => {
        this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
        this.SET_SELECTED_MAP_POINT_RES(null) // 设置当前地图选中的点位资源
        this.loadAlarmColumnResources() // 加载报警柱资源
        let query = {mapType: MAPMODE.mode2D} // 查询条件
        if (!this.isMapOuter && this.currentFloor) {
          query.floorId = this.currentFloor._id
        }
        this.get2DAlarmHelpOrgTree(query)
        this.successMsg('报警柱点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
