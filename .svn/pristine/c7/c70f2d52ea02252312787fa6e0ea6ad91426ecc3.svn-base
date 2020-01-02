// 地图事件处理逻辑
import { mapMutations, mapActions } from 'vuex'
import { GEOMETRYTYPE, RESOURCETYPE } from 'assets/2DMap/meta/common'
export default {
  computed: {
  },
  methods: {
    ...mapMutations(['SET_EDIT_RIGHT_PAGE_STATE', 'SET_SELECTED_MAP_POINT_RES']),
    ...mapActions(['getCommonPointResById', 'getPatrolPointResById', 'getDoorControlPointResById', 'setSelectedTreeNode']),
    handleMapClick(param) { // 处理地图单击事件
      if (this.pointDrawActive || this.lineDrawActive || this.areaDrawActive) { // 绘制要素时
        return
      }
      console.log('处理地图点击，选中的数据：', param)
      if (param.attributes) {
        this.setSelectedTreeNode(null) // 设置地图选中的树节点
        let {feature, type, attributes} = param
        let attr = JSON.parse(JSON.stringify(attributes))
        if (!(this.selectedPointRes && this.selectedPointRes._id === attr.id)) {
          if (feature && type === GEOMETRYTYPE.POINT) { // 点要素时，激活编辑工具
            this.currentEditFeature = feature
            this.SET_FEATURE_EDIT_ACTIVE(true)
          }
          this.editResourceInfo(attr) // 编辑资源信息
        }
      }
    },
    editResourceInfo(attr) { // 编辑资源信息
      let {id, rType} = attr
      let getResByPointIdFun = null
      let editPage = null
      switch (rType) {
        case RESOURCETYPE.video: // 视频
          getResByPointIdFun = this.getCommonPointResById
          editPage = { page: 'videoPage', detail: 'edit' }
          break
        case RESOURCETYPE.commonAlarm: // 普通报警
          getResByPointIdFun = this.getCommonPointResById
          editPage = { page: 'alarmPage', detail: 'edit' }
          break
        case RESOURCETYPE.fireAlarm: // 消防报警
          getResByPointIdFun = this.getCommonPointResById
          editPage = { page: 'alarmPage', detail: 'edit' }
          break
        case RESOURCETYPE.alarmHost: // 报警主机
          getResByPointIdFun = this.getCommonPointResById
          editPage = { page: 'alarmPage', detail: 'edit' }
          break
        case RESOURCETYPE.alarmBox: // 报警箱
          getResByPointIdFun = this.getCommonPointResById
          editPage = { page: 'alarmHelp', detail: 'edit' }
          break
        case RESOURCETYPE.alarmColumn: // 报警柱
          getResByPointIdFun = this.getCommonPointResById
          editPage = { page: 'alarmHelp', detail: 'edit' }
          break
        case RESOURCETYPE.patrol: // 巡更
          editPage = { page: 'patrolEditPage', detail: 'edit' }
          getResByPointIdFun = this.getPatrolPointResById
          break
        case RESOURCETYPE.doorControl: // 门禁
          editPage = { page: 'doorControlEditPage', detail: 'edit' }
          getResByPointIdFun = this.getDoorControlPointResById
          break
        default:
          break
      }
      if (getResByPointIdFun && editPage) {
        this.SET_EDIT_RIGHT_PAGE_STATE(editPage)
        getResByPointIdFun(id).then(res => {
          let data = JSON.parse(JSON.stringify(res))
          data.rType = rType
          this.SET_SELECTED_MAP_POINT_RES(data) // 设置当前地图选中的点位资源
        })
      }
    },
    handleMapZoomChange(param) { // 处理地图缩放级别变化
      if (param.zoom) {
        console.log('地图缩放级别变化：', param)
        let zoom = Math.ceil(param.zoom)
        this.setMapZoom(zoom)
      }
    },
    handkeMapMouseMove(param) { // 处理地图鼠标移动事件
      let {feature, attributes} = param
      if (this.editActive && feature && attributes && attributes.type.indexOf('Sector') < 0) { // 编辑要素时且悬浮要素不是可视域时
        if ((this.currentGrid && attributes.id === this.currentGrid._id) || (this.currentBuilding && attributes.id === this.currentBuilding._id) || (this.selectedPointRes && attributes.id === this.selectedPointRes._id)) {
          this.currentEditFeature = feature // 编辑控件设置要编辑的要素
        }
      }
    }
  }
}
