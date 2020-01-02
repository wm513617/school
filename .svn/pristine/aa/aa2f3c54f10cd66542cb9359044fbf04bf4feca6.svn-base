// 报警箱图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE, MAPMODE } from 'assets/2DMap/meta/common'
import transAlarmHelp from 'assets/2DMap/feature/edit/alarmHelp'
export default {
  data() {
    return {
      alarmBoxLayer: layerConfig.alarmBox
    }
  },
  computed: {
    ...mapGetters({
      alarmBoxResources: 'alarmBoxResourceArr', // 报警箱资源数据
      alarmBoxs: 'alarmBoxFeatures' // 报警箱要素
    })
  },
  watch: {
    alarmBoxResources: {
      handler(arr) {
        this.isAlarmBox && this.loadAlarmBoxFeatures() // 加载报警箱要素数据
      },
      deep: true
    },
    isAlarmBox(flag) { // 报警箱显隐
      if (flag) {
        this.loadAlarmBoxFeatures() // 加载报警箱要素
      } else {
        this.setAlarmBoxFeatures([])
      }
    }
  },
  methods: {
    ...mapActions([
      'queryAlarmHelpRes',
      'setAlarmBoxFeatures',
      'get2DAlarmHelpOrgTree'
    ]),
    loadAlarmBoxResources() { // 加载报警箱点位资源
      let query = {alarm: RESOURCETYPE.alarmBox}
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
      } else { // 楼层地图
        query.sId = this.currentFloor._id
      }
      this.queryAlarmHelpRes(query)
    },
    loadAlarmBoxFeatures() { // 加载报警箱点位要素
      let features = transAlarmHelp.transFeatures(this.alarmBoxResources, this.alarmBoxLayer)
      this.setAlarmBoxFeatures(features)
    },
    initCurrentAlarmBoxFeature(alarmBox) { // 初始化当前报警箱要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmHelp' && !this.isAlarmBox) { // 编辑报警箱资源并且不显示报警箱要素时
        let copyedData = JSON.parse(JSON.stringify(alarmBox))
        let alarmBoxFeature = transAlarmHelp.transOneFeature(copyedData, this.alarmBoxLayer)
        this.setAlarmBoxFeatures([alarmBoxFeature])
      }
    },
    refreshCurrentAlarmBoxFeature(alarmBox) { // 刷新当前报警箱要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmHelp' || this.isAlarmBox) { // 编辑报警箱资源或显示报警箱要素时，还原报警箱要素
        let alarmBoxArr = this.alarmBoxs.filter(item => item.attributes.id !== alarmBox._id)
        if (this.isAlarmBox || alarmBox._id === this.selectedPointRes._id) { // 显示报警箱要素或当前报警箱数据是当前地图选中的数据时，添加当前报警箱要素
          let alarmBoxFeature = transAlarmHelp.transOneFeature(alarmBox, this.alarmBoxLayer)
          alarmBoxFeature && alarmBoxArr.push(alarmBoxFeature)
        }
        this.setAlarmBoxFeatures(alarmBoxArr)
      } else {
        this.setAlarmBoxFeatures([])
      }
    },
    addAlarmBoxResToMap(coods) { // 添加报警箱资源到地图中
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
        this.loadAlarmBoxResources() // 加载报警箱资源
        let query = {mapType: MAPMODE.mode2D} // 查询条件
        if (!this.isMapOuter && this.currentFloor) {
          query.floorId = this.currentFloor._id
        }
        this.get2DAlarmHelpOrgTree(query)
        this.successMsg('报警箱点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
