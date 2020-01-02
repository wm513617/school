// 普通报警图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import { RESOURCETYPE, MPSIGNKEY } from 'assets/2DMap/meta/common'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
export default {
  data() {
    return {
      commonAlarmLayer: layerConfig.commonAlarm
    }
  },
  computed: {
    ...mapGetters({
      commonAlarmResources: 'commonAlarmResourceArr', // 普通报警资源数据
      commonAlarms: 'commonAlarmFeatures' // 普通报警要素
    }),
    queryCommonAlarmsFun() { // 查询普通报警数据函数
      return this.isMapOuter ? this.loadCommonAlarmsByMapId : this.loadResourceByFloorId
    }
  },
  watch: {
    commonAlarmResources: {
      handler(arr) {
        this.isCommonAlarm && this.loadCommonAlarmFeatures() // 加载普通报警要素数据
      },
      deep: true
    },
    isCommonAlarm(flag) { // 普通报警显隐
      if (flag) {
        this.loadCommonAlarmFeatures() // 加载普通报警要素
      } else {
        this.setCommonAlarmFeatures([])
      }
    }
  },
  methods: {
    ...mapActions([
      'loadCommonAlarmsByMapId', // 根据地图标识加载普通报警点位
      'loadResourceByFloorId', // 根据楼层获取资源
      'setCommonAlarmFeatures' // 设置普通报警要素数据
    ]),
    loadCommonAlarmResources() { // 加载普通报警资源数据
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = { floorId: this.currentFloor._id, channelTypes: RESOURCETYPE.commonAlarm }
      }
      this.queryCommonAlarmsFun(query)
    },
    loadCommonAlarmFeatures() { // 加载普通报警要素数据
      let features = alarmTrans.transFeatures(this.commonAlarmResources, this.commonAlarmLayer)
      this.setCommonAlarmFeatures(features)
    },
    initCurrentCommonAlarmFeature(commonAlarm) { // 初始化当前普通报警要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmPage' && !this.isCommonAlarm) { // 编辑普通报警资源并且不显示普通报警资源时
        let copyedData = JSON.parse(JSON.stringify(commonAlarm))
        let alarmFeature = alarmTrans.transOneFeature(copyedData, this.commonAlarmLayer)
        this.setCommonAlarmFeatures([alarmFeature])
      }
    },
    refreshCurrentCommonAlarmFeature(commonAlarm) { // 还原当前普通报警要素
      let page = this.mapEditRightPage.page
      if (page === 'alarmPage' || this.isCommonAlarm) { // 编辑普通报警资源或显示普通报警要素时
        let alarmArr = this.commonAlarms.filter(item => item.attributes.id !== commonAlarm._id) // 过滤掉当前数据
        if (this.isCommonAlarm || commonAlarm._id === this.selectedPointRes._id) { // 显示普通报警要素或当前数据是当前地图选中的数据时，添加当前普通报警要素
          let alarmFeature = alarmTrans.transOneFeature(commonAlarm, this.commonAlarmLayer)
          alarmFeature && alarmArr.push(alarmFeature)
        }
        this.setCommonAlarmFeatures(alarmArr)
      } else {
        this.setCommonAlarmFeatures([])
      }
    },
    addCommonAlarmResToMap(coods) { // 添加普通报警资源到地图中
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
        this.loadCommonAlarmResources() // 加载普通报警资源
        let counter = {optTab: 'alarm', count: this.editTreeChangeCounter.count + 1}
        this.changeEditTreeChangeCounter(counter) // 改变变价树计数状态
        this.successMsg('普通报警点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
