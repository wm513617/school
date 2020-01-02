import { mapMutations, mapGetters, mapActions } from 'vuex'
import { VIDEOTYPEKEY, CAMERATYPE, RESICONOID, RESOURCETYPE } from 'assets/fengMap/meta/common'
import videoLayer from './video'
import commonAlarmLayer from './commonAlarm'
import fireAlarm from './fireAlarm'
import alarmColumn from './alarmColumn'
import alarmBox from './alarmBox'
import doorControl from './doorControl'
import patrol from './patrol'
export default {
  data() {
    return {}
  },
  mixins: [videoLayer, commonAlarmLayer, fireAlarm, alarmColumn, alarmBox, doorControl, patrol],
  methods: {
    ...mapActions('fengMap', ['queryDefaultfmIconByOid', 'loadFMSubVideosByMapId', 'loadFMSubVideosByFloorId', 'loadFMCommonAlarmByMapId', 'loadfmAlarmResourceByFloorId', 'loadfmFireAlarmByMapId', 'loadfmAlarmHelpRes', 'loadfmDoorByMapId', 'loadfmDoorByFloorId', 'loadfmPatrolByMapId', 'loadfmPatrolByFloorId']),
    // 初始加载地图上的资源
    initGetMapPointShow() {
      this.loadVideoResources() // 加载视频资源数据
      this.loadCommonAlarmResources() // 加载普通报警资源数据
      this.loadFireAlarmResources() // 加载消防报警资源数据
      this.loadAlarmColumnResources() // 加载报警柱资源数据
      this.loadAlarmBoxResources() // 加载报警柱资源数据
      this.loadDoorControlResources() // 加载门禁资源数据
      this.loadPatrolResources() // 加载巡更资源数据
    },
    // 加载查询视频数据
    loadVideoResources() {
      this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc, CAMERATYPE.normalipc) // 枪机
      this.loadQuerySubVideos(VIDEOTYPEKEY.halfBallipc, CAMERATYPE.normalipc) // 半球
      this.loadQuerySubVideos(VIDEOTYPEKEY.fastBallipc, CAMERATYPE.normalipc) // 快球
      this.loadQuerySubVideos(VIDEOTYPEKEY.allViewipc, CAMERATYPE.normalipc) // 全景
      this.loadQuerySubVideos(VIDEOTYPEKEY.redBoltipc, CAMERATYPE.normalipc) // 红外枪机
      this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc, CAMERATYPE.verfaceipc) // 人脸抓拍
      this.loadQuerySubVideos(VIDEOTYPEKEY.boltipc, CAMERATYPE.trafficipc) // 交通抓拍
    },
    // 加载查询的视频数据
    loadQuerySubVideos(monitortype, monitoryPointGenera) {
      let query = {}
      // 监控业务类型（0：普通ipc、1：人脸抓拍、2：交通抓拍）
      typeof monitoryPointGenera !== 'undefined' && (query.monitoryPointGenera = monitoryPointGenera)
      // 监控类型（0：枪机、1：红外:2：半球、3：快球、4：全景）
      typeof monitortype !== 'undefined' && (query.monitortype = monitortype)
      query.mapId = '5da526ae8bd570426c912984'
      this.isfmOuter ? this.loadFMSubVideosByMapId(query) : this.loadFMSubVideosByFloorId({...query, floorId: ''})
    },
    // 加载查询普通报警数据
    loadCommonAlarmResources() {
      this.loadQuerySubCommontAlarms(RESOURCETYPE.commonAlarm)
    },
    // 加载查询普通报警数据
    loadQuerySubCommontAlarms(channelTypes) {
      let query = {channelTypes, floorId: ''}
      let mapId = '5da526ae8bd570426c912984'
      this.isfmOuter ? this.loadFMCommonAlarmByMapId(mapId) : this.loadfmAlarmResourceByFloorId(query) //  根据楼层标识加载普通报警、消防报警、报警主机
    },
    // 加载查询消防报警数据
    loadFireAlarmResources() {
      this.loadQuerySubFireAlarms(RESOURCETYPE.fireAlarm)
    },
    // 加载查询消防报警数据
    loadQuerySubFireAlarms(channelTypes) {
      let query = {channelTypes, floorId: ''}
      let mapId = '5da526ae8bd570426c912984'
      this.isfmOuter ? this.loadfmFireAlarmByMapId(mapId) : this.loadfmAlarmResourceByFloorId(query) //  根据楼层标识加载普通报警、消防报警、报警主机
    },
    // 加载查询报警柱数据
    loadAlarmColumnResources() {
      this.loadQuerySubAlarm(RESOURCETYPE.alarmColumn)
    },
    // 加载查询报警箱数据
    loadAlarmBoxResources() {
      this.loadQuerySubAlarm(RESOURCETYPE.alarmBox)
    },
    // 加载查询报警柱数据或报警箱数据
    loadQuerySubAlarm(channelTypes) {
      let queryRes = {alarm: channelTypes, mapId: '5da526ae8bd570426c912984'}
      let queryFoolrRes = {alarm: channelTypes, sId: ''}
      this.isfmOuter ? this.loadfmAlarmHelpRes(queryRes) : this.loadfmAlarmHelpRes(queryFoolrRes)
    },
    // 加载门禁数据
    loadDoorControlResources() {
      this.loadQuerySubDoorControl()
    },
    loadQuerySubDoorControl() {
      let mapId = '5da526ae8bd570426c912984'
      let floorId = ''
      this.isfmOuter ? this.loadfmDoorByMapId(mapId) : this.loadfmDoorByFloorId(floorId)
    },
    // 加载巡更数据
    loadPatrolResources(){
      this.loadQuerySubPatrol()
    },
    loadQuerySubPatrol(){
      let mapId = '5da526ae8bd570426c912984'
      let floorId = ''
      this.isfmOuter ? this.loadfmPatrolByMapId(mapId) : this.loadfmPatrolByFloorId(floorId)
    }
  },
  computed: {
    // 左侧面板勾选框状态
    ...mapGetters('fengMapApplyInteractive', {
      boltipc: 'gun',
      halfBallipc: 'hemisphere',
      fastBallipc: 'fastBall',
      allViewipc: 'panorama',
      redBoltipc: 'infraRed',
      verface: 'verface',
      traffic: 'traffic',
      sector: 'visualField',
      commonAlarm: 'alarm',
      fireAlarm: 'fireControl',
      alarmColumn: 'alarmColumn',
      alarmBox: 'alarmBox',
      isDoorControl: 'isDoorControl',
      patrol: 'isPoint',
      isNameTitle: 'isNameTitle'
    })
  }
}
