// 点位图层公用方法
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { VIDEOTYPEKEY, CAMERATYPE, RESICONOID, RESOURCETYPE } from 'assets/2DMap/meta/common'
import { getPointById } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters('fengMap', [
      'selectedFMapPointRes', // 选中的视频资源
      'defaultfmPointIcon', // 当前资源的默认图标
      'editFMTreeChangeCounter'
    ])
  },
  watch: {
  },
  methods: {
    ...mapMutations('fengMap', ['SET_DEFAULT_FMPOINT_ICON', 'SET_POINT_FMDRAW_ACTIVE']),
    ...mapActions('fengMap', [
      'setSelectedMapPointRes', // 设置当前选中的资源
      'changeEditFMTreeChangeCounter', // 设置机构数刷新
      // 根据id查询资源详细信息（视频、普通报警、报警主机、消防报警、报警柱、报警箱）
      'getfmResourceById',
      // 加载视频资源
      'loadFMSubVideosByMapId',
      'loadFMSubVideosByFloorId',
      // 加载门禁资源
      'loadfmDoorByFloorId',
      'loadfmDoorByMapId',
      'getDoorfmPointResById',
      // 加载普通报警资源
      'loadFMCommonAlarmByMapId',
      // 加载报警主机资源
      'loadfmAlarmHostByMapId',
      // 加载消防报警资源
      'loadfmFireAlarmByMapId',
      // 加载楼内 普通报警、报警主机、消防报警
      'loadfmAlarmResourceByFloorId',
      // 加载报警求助资源
      'loadfmAlarmHelpRes',
      // 加载巡更资源
      'loadfmPatrolByMapId',
      'loadfmPatrolByFloorId',
      'getfmPatrolResById',
      // 配置右侧编辑面板
      'changeFMeditRightPage',
      // 获取默认图标
      'queryDefaultfmIconByOid'
    ]),
    getVideoSubtype(data) { // 获取视频标识
      let { monitortype, monitoryPointGenera } = data
      monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
      let oid = null
      if (monitoryPointGenera === CAMERATYPE.normalipc) {
        if (monitortype === VIDEOTYPEKEY.boltipc) {
          oid = RESICONOID.boltipc
        } else if (monitortype === VIDEOTYPEKEY.redBoltipc) {
          oid = RESICONOID.redBoltipc
        } else if (monitortype === VIDEOTYPEKEY.halfBallipc) {
          oid = RESICONOID.halfBallipc
        } else if (monitortype === VIDEOTYPEKEY.fastBallipc) {
          oid = RESICONOID.fastBallipc
        } else if (monitortype === VIDEOTYPEKEY.allViewipc) {
          oid = RESICONOID.allViewipc
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) {
        oid = RESICONOID.verfaceipc
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) {
        oid = RESICONOID.trafficipc
      }
      return oid
    },
    setPointStatus(icon, data) { // 点击树节点设置相应参数， 添加完点位，清除相应参数
      this.SET_DEFAULT_FMPOINT_ICON(icon || null) // 设置默认点位图标文件
      this.setSelectedMapPointRes(data || null) // 设置当前地图选中的点位资源
      let status
      if (icon || data) { status = true } else { status = false }
      this.SET_POINT_FMDRAW_ACTIVE(status) // 点位绘制状态
    },
    addResourceToMap(rType, coods) { // 点击地图添加资源到地图中
      if (rType === RESOURCETYPE.video) { // 视频
        this.addVideoResToMap(coods)
      } else if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
        this.addCommonAlarmResToMap(coods)
      } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
        // this.addFireAlarmResToMap(coods)
      } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
        // this.addAlarmHostResToMap(coods)
      } else if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
        // this.addAlarmColumnResToMap(coods)
      } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
        // this.addAlarmBoxResToMap(coods)
      } else if (rType === RESOURCETYPE.patrol) { // 巡更
        // this.addPatrolResToMap(coods)
      } else if (rType === RESOURCETYPE.doorControl) { // 门禁
        this.addDoorControlResToMap(coods)
      }
    },
    // 初始加载地图上的资源
    initGetMapPointShow() {
      this.loadVideoResources() // 加载视频资源数据
      this.loadDoorControlResources() // 加载门禁点位资源数据
      this.loadAllCommonAlarmRes()
      this.loadAllAlarmHostRes()
      this.loadAllFireAlarmRes()
      this.loadAlarmHelpResources()
      this.loadAllPatrolRes()
    },
    updatePointTreeCount(type) {
      let counter = {optTab: type, count: this.editFMTreeChangeCounter.count + 1}
      this.changeEditFMTreeChangeCounter(counter) // 改变编辑树计数器状态
    },
    loadQuerySubVideos(monitortype, monitoryPointGenera) { // 加载查询的视频数据
      let query = {}
      // 监控业务类型（0：普通ipc、1：人脸抓拍、2：交通抓拍）
      typeof monitoryPointGenera !== 'undefined' && (query.monitoryPointGenera = monitoryPointGenera)
      // 监控类型（0：枪机、1：红外:2：半球、3：快球、4：全景）
      typeof monitortype !== 'undefined' && (query.monitortype = monitortype)
      // if (this.isfmOuter && this.activeMapConfig.mapId) {
      //   query.mapId = this.activeMapConfig.mapId
      query.mapId = this.activeFMap
      // } else if (this.currentFloor._id) {
      //   query.floorId = this.currentFloor._id
      // }
      this.isfmOuter ? this.loadFMSubVideosByMapId(query) : this.loadFMSubVideosByFloorId(query)
    },
    loadVideoResources() { // 加载查询视频数据
      this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc, CAMERATYPE.normalipc) // ,  普通ipc
      this.loadQuerySubVideos(VIDEOTYPEKEY.halfBallipc, CAMERATYPE.normalipc)
      this.loadQuerySubVideos(VIDEOTYPEKEY.fastBallipc, CAMERATYPE.normalipc)
      this.loadQuerySubVideos(VIDEOTYPEKEY.allViewipc, CAMERATYPE.normalipc)
      this.loadQuerySubVideos(VIDEOTYPEKEY.redBoltipc, CAMERATYPE.normalipc)
      this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc, CAMERATYPE.verfaceipc) // 人脸抓拍
      this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc, CAMERATYPE.trafficipc) // 交通抓拍
    },
    loadAllCommonAlarmRes() { // 加载普通报警点位
      if (this.isfmOuter) {
        this.loadFMCommonAlarmByMapId(this.activeFMap)
      } else {
        this.loadfmAlarmResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.commonAlarm })
      }
    },
    loadAllAlarmHostRes() { // 加载报警主机点位
      if (this.isfmOuter) {
        this.loadfmAlarmHostByMapId(this.activeFMap)
      } else {
        this.loadfmAlarmResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.alarmHost })
      }
    },
    loadAllFireAlarmRes() { // 加载消防报警点位
      if (this.isfmOuter) {
        this.loadfmFireAlarmByMapId(this.activeFMap)
      } else {
        this.loadfmAlarmResourceByFloorId({ floorId: this.levelData._id, channelTypes: RESOURCETYPE.fireAlarm })
      }
    },
    loadAlarmHelpResources(type) { // 加载报警求助点位资源
      let query = {alarm: type}
      if (this.isfmOuter) {
        query.mapId = this.activeFMap
      } else { // 楼层地图，根据楼层标识加载
        query.sId = this.levelData._id
      }
      this.loadfmAlarmHelpRes(query)
    },
    loadAllPatrolRes() { // 加载巡更点位
      if (this.isfmOuter) {
        this.loadfmPatrolByMapId(this.activeFMap)
      } else {
        this.loadfmPatrolByFloorId(this.levelData._id)
      }
    },
    loadDoorControlResources() { // 加载门禁点位
      if (this.isfmOuter) {
        this.loadfmDoorByMapId(this.activeFMap)
      } else {
        this.loadfmDoorByFloorId(this.levelData._id)
      }
    },
    setSelectRes(scene, id) { // 点击自定义添加点位图标时，添加高亮显示
      let fun
      let editPage = { page: '', detail: 'show' }
      if (id) {
        const obj = getPointById(scene, id)
        if (!obj) { return }
        let { type, channelId } = obj
        if (type === RESICONOID.boltipc || type === RESICONOID.redBoltipc || type === RESICONOID.halfBallipc || type === RESICONOID.fastBallipc || type === RESICONOID.allViewipc || type === RESICONOID.verfaceipc || type === RESICONOID.trafficipc) {
          fun = this.getfmResourceById
          editPage = { page: 'videoPage', detail: 'edit' }
        } else if (type === RESICONOID.doorControl) {
          fun = this.getDoorfmPointResById
          editPage = { page: 'doorControlEditPage', detail: 'edit' }
        } else if (type === RESICONOID.commonAlarm) {
          fun = this.getfmResourceById
          editPage = { page: 'alarmPage', detail: 'edit' }
        }
        if (fun) {
          fun(channelId).then(res => {
            this.setSelectedMapPointRes(res)
            this.changeEditPoint(editPage)
          })
        }
      }
    },
    changeEditPoint(info) {
      info && this.changeFMeditRightPage(info) // 设置地图右侧编辑页面
      // const isChangeLoc = info.page ? true : false
      // this.SET_FEATURE_EDIT_ACTIVE(isChangeLoc) // 开启编辑点位位置的控件
    }
  }
}
