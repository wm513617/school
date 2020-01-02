// 报警主机图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE, MPSIGNKEY } from 'assets/2DMap/meta/common'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
export default {
  data() {
    return {
      alarmHostLayer: layerConfig.alarmHost
    }
  },
  computed: {
    ...mapGetters({
      alarmHostResources: 'alarmHostResourceArr', // 报警主机资源数据
      alarmHosts: 'alarmHostFeatures' // 报警主机要素
    }),
    queryAlarmHostsFun() { // 查询报警主机数据函数
      return this.isMapOuter ? this.loadAlarmHostsByMapId : this.loadResourceByFloorId
    }
  },
  watch: {
    alarmHostResources: {
      handler(arr) {
        // this.isAlarmHost && this.loadAlarmHostFeatures() // 加载报警主机要素数据
        this.loadAlarmHostFeatures() // 加载报警主机要素数据
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadAlarmHostsByMapId',
      'loadResourceByFloorId',
      'setAlarmHostFeatures'
    ]),
    loadAlarmHostResources() { // 加载报警主机资源数据
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = { floorId: this.currentFloor._id, channelTypes: RESOURCETYPE.alarmHost }
      }
      this.queryAlarmHostsFun(query)
    },
    loadAlarmHostFeatures() { // 加载报警主机要素数据
      let features = alarmTrans.transFeatures(this.alarmHostResources, this.alarmHostLayer)
      this.setAlarmHostFeatures(features)
    },
    initCurrentAlarmHostFeature(alarmHost) { // 还原当前报警主机要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmPage') { // 编辑报警主机资源时
        // if (page === 'alarmPage' && !this.isAlarmHost) { // 编辑报警主机资源并且不显示报警报警主机要素时
        let copyedData = JSON.parse(JSON.stringify(alarmHost))
        let alarmFeature = alarmTrans.transOneFeature(copyedData, this.alarmHostLayer)
        this.setAlarmHostFeatures([alarmFeature])
      }
    },
    refreshCurrentAlarmHostFeature(alarmHost) { // 初始化当前报警主机要素
      // let page = this.mapEditRightPage.page
      // if (page === 'alarmPage' || true) { // 编辑报警主机资源或显示报警报警主机要素时
      // if (page === 'alarmPage' || this.isAlarmHost) { // 编辑报警主机资源时
      let alarmArr = this.alarmHosts.filter(item => item.attributes.id !== alarmHost._id)
      // if (alarmHost._id === this.selectedPointRes._id) { // 显示报警柱主机要素或当前报警主机数据是当前地图选择的数据时，提那家当前报警主机要素
      let alarmFeature = alarmTrans.transOneFeature(alarmHost, this.alarmHostLayer)
      alarmFeature && alarmArr.push(alarmFeature)
      // }
      this.setAlarmHostFeatures(alarmArr)
      // } else {
      //   this.setAlarmHostFeatures([])
      // }
    },
    addAlarmHostResToMap(coods) { // 添加报警主机资源到地图中
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
      resData.mapsign = {signflag: true, signtype: MPSIGNKEY.point}
      resData.point = point
      this.saveCommonPointRes({ _id: resData._id, body: resData }).then(res => {
        this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
        this.SET_SELECTED_MAP_POINT_RES(null) // 设置当前地图选中的点位资源
        this.loadAlarmHostResources() // 加载报警主机资源
        let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter) // 改变变价树计数状态
        this.successMsg('报警主机点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
