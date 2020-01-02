// 消防报警图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE, MPSIGNKEY } from 'assets/2DMap/meta/common'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
export default {
  data() {
    return {
      fireAlarmLayer: layerConfig.fireAlarm
    }
  },
  computed: {
    ...mapGetters({
      fireAlarmResources: 'fireAlarmResourceArr', // 消防报警资源数据
      fireAlarms: 'fireAlarmFeatures' // 消防报警要素
    }),
    queryFireAlarmsFun() { // 查询消防报警数据函数
      return this.isMapOuter ? this.loadFireAlarmsByMapId : this.loadResourceByFloorId
    }
  },
  watch: {
    fireAlarmResources: {
      handler(arr) {
        this.isFireAlarm && this.loadFireAlarmFeatures() // 加载消防报警要素数据
      },
      deep: true
    },
    isFireAlarm(flag) { // 消防报警显隐
      if (flag) {
        this.loadFireAlarmFeatures() // 加载普通报警要素
      } else {
        this.setFireAlarmFeatures([])
      }
    }
  },
  methods: {
    ...mapActions([
      'loadFireAlarmsByMapId',
      'loadResourceByFloorId',
      'setFireAlarmFeatures'
    ]),
    loadFireAlarmResources() { // 加载消防报警资源数据
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = { floorId: this.currentFloor._id, channelTypes: RESOURCETYPE.fireAlarm }
      }
      this.queryFireAlarmsFun(query)
    },
    loadFireAlarmFeatures() { // 加载消防报警要素数据
      let features = alarmTrans.transFeatures(this.fireAlarmResources, this.fireAlarmLayer)
      this.setFireAlarmFeatures(features)
    },
    initCurrentFireAlarmFeature(fireAlarm) {
      let page = this.mapEditRightPage.page
      if (page === 'alarmPage' && !this.isFireAlarm) { // 编辑消防报警资源并且不显示消防报警要素时
        let copyedData = JSON.parse(JSON.stringify(fireAlarm))
        let alarmFeature = alarmTrans.transOneFeature(copyedData, this.fireAlarmLayer)
        this.setFireAlarmFeatures([alarmFeature])
      }
    },
    refreshCurrentFireAlarmFeature(fireAlarm) {
      let page = this.mapEditRightPage.page
      if (page === 'alarmPage' || this.isFireAlarm) { // 编辑消防报警资源或显示消防报警要素时
        let alarmArr = this.fireAlarms.filter(item => item.attributes.id !== fireAlarm._id)
        if (this.isFireAlarm || fireAlarm._id === this.selectedPointRes._id) { // 显示消防报警要素或当前消防报警数据是当前地图选择的数据时，添加当前消防报警要素
          let alarmFeature = alarmTrans.transOneFeature(fireAlarm, this.fireAlarmLayer)
          alarmFeature && alarmArr.push(alarmFeature)
        }
        this.setFireAlarmFeatures(alarmArr)
      } else {
        this.setFireAlarmFeatures([])
      }
    },
    addFireAlarmResToMap(coods) { // 添加消防报警资源到地图中
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
        this.loadFireAlarmResources() // 加载消防报警资源
        let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter) // 改变变价树计数状态
        this.successMsg('消防报警点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
