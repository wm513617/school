<!--应用模式 消防、普通报警点位业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appFireAlarm from '../../../../../assets/map/app/appFireAlarm'
import appAlarm from '../../../../../assets/map/app/appAlarm'
import ALARMTYPE from '../../../../../assets/map/app/alarmType'
export default {
  computed: {
    ...mapState({
      oneMapAlarmList: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmList, // 防区列表
      oneMapAlarmData: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmData, // 报警资源
      oneMapAlarmCheck: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmCheck, // 查看报警资源
      oneFloorAlarmList: ({ mapAlarmData }) => mapAlarmData.oneFloorAlarmList,
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      appAlarmCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCheck, // 消防点位勾选状态
      appAlarmCommonCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCommonCheck,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      commonAlarmList: ({ mapAlarmData }) => mapAlarmData.commonAlarmList,
      floorCommonAlarmList: ({ mapAlarmData }) => mapAlarmData.floorCommonAlarmList,
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList
    })
  },
  watch: {
    // 单个报警源信息
    oneMapAlarmCheck(val) {
      if (val) {
        let obj = null
        if (val.type === 'commonAlarm' || val.type === 'fireAlarm') {
          this.$store.commit('SET_APPDETAIL_STATE', 'alarmAppVideo')
          if (val.param[0].point && val.param[0].point.loc) {
            obj = val.param[0].point.loc.split(',')
          } else {
            obj = val.param[0].point3D.loc.split(',')
          }
          this.posi = { lon: parseFloat(obj[0]), lat: parseFloat(obj[1]) }
        } else if (val.type === 'patrolAlarm') {
          // this.$store.commit('SET_APPDETAIL_STATE', 'alarmAppPatrol')
          // obj = val.param[0].geo.split(',')
          // this.posi = { lon: parseFloat(obj[0]), lat: parseFloat(obj[1]) }
        } else if (val.type === 'askHelp') {
          this.$store.commit('SET_APPDETAIL_STATE', 'alarmAppVideo')
          // this.posi = { lon: val.param[0].point.lon, lat: val.param[0].point.lat }
        } else {
          // this.$store.commit('SET_APPDETAIL_STATE', 'alarmAppVideo')
          this.posi = { lon: val.param[0].point.lon, lat: val.param[0].point.lat }
        }
      }
    },
    // 地图中消防点位资源
    oneMapAlarmList(alarmlist) {
      if (this.appAlarmCheck) {
        let features = JSON.parse(JSON.stringify(alarmlist))
        let alarms = this.addAlarmToMap(features, this.isAppOuter)
        this.$store.commit('SET_APPALARMINMAP_LIST', alarms)
      }
    },
    // 楼层中消防点位资源
    oneFloorAlarmList(val) {
      this.$store.commit('SET_APPALARM_LIST', [])
      this.addFloorAlarmToMap()
    },
    // 楼层中的普通报警点位数组
    floorCommonAlarmList(val) {
      this.$store.commit('SET_APPCURRENTALARMING_LIST', [])
      this.addFloorCommonAlarmToMap()
    },
    // 地图和楼层切换时，加载所有的消防点位和普通报警点位
    isAppOuter(val) {
      this.$store.commit('SET_APPALARM_LIST', [])
      this.$store.commit('SET_APPCURRENTALARMING_LIST', [])
      this.$store.commit('SET_APPFLOORALARMING_LIST', [])
      if (val) {
        this.addMapAlarmAndCommonAlarm()
      } else {
        this.addFloorAlarmToMap()
        this.addFloorCommonAlarmToMap()
      }
    },
    // 切换地图时，加载所有的消防点位和普通报警点位
    activeMap(val) {
      this.$store.commit('SET_APPALARM_LIST', [])
      this.$store.commit('SET_APPCURRENTALARMING_LIST', [])
      this.addMapAlarmAndCommonAlarm()
    },
    // 消防报警图层数组
    appAlarmList(val) {
      this.aralmAppFeatures = JSON.parse(JSON.stringify(val))
    },
    // 普通报警点位数组
    commonAlarmList(val) {
      if (this.appAlarmCommonCheck) {
        let features = JSON.parse(JSON.stringify(val))
        features = this.addCommonAlarmType(features)
        let commonFeatures = this.addAlarmToMap(features, this.isAppOuter)
        this.$store.commit('SET_APPCOMMONALARM_LIST', commonFeatures)
      }
    }
  },
  methods: {
    ...mapActions(['getOnePoint', 'getOneAlarm', 'getOneMapArarlList', 'getOneMapCommAlarm', 'getOneBuild']),
    ...mapMutations([
      'SET_APPDETAIL_STATE',
      'SET_APPCOMMONALARM_LIST',
      'SET_APPALARM_LIST',
      'SET_APPCURRENTALARMING_LIST',
      'SET_APPALARMINMAP_LIST',
      'SET_APPFLOORALARMING_LIST'
    ]),
    // 给普通报警添加标志方便用
    addCommonAlarmType(features) {
      features.forEach(element => {
        element.alarmType = ALARMTYPE.COMMON
      })
      return features
    },
    // 消防报警点位的点位事件
    selectAlarmEvt(attr, _id) {
      if (attr.state === 'alarmimg') {
        this.$store.commit('SET_ALARMING_DATA', attr.param)
        // this.$store.commit('SET_APPDETAIL_STATE', 'alarmAppVideoPre')
      }
      if (_id) {
        if (attr.state === 'save' || attr.state === 'alarmimg' || attr.state === 'arming') {
          // let alarmType = attr.alarmType
          // if (alarmType === ALARMTYPE.COMMON) {
          //   this.getOnePoint(_id).then(res => {
          //     this.$store.commit('SET_APPDETAIL_STATE', 'alarmApp')
          //   }).catch(err => {
          //     console.log(err)
          //     this.errorMsg('报警点位信息获取失败')
          //   })
          // } else {
          this.getOneAlarm(_id)
            .then(res => {
              console.log(res)
              this.$store.commit('SET_APPDETAIL_STATE', 'alarmApp')
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('报警点位信息获取失败')
            })
          // }
        }
      }
    },
    // 楼层中获取消防报警
    addFloorAlarmToMap() {
      if (this.appAlarmCheck) {
        let alarmlist = this.addAlarmToMap(this.oneFloorAlarmList, false)
        this.$store.commit('SET_APPALARMINMAP_LIST', alarmlist)
      }
    },
    // 楼层中加载普通报警
    addFloorCommonAlarmToMap() {
      if (this.appAlarmCommonCheck) {
        let features = JSON.parse(JSON.stringify(this.floorCommonAlarmList))
        features = this.addCommonAlarmType(features)
        let commonFeatures = this.addAlarmToMap(features, false)
        this.$store.commit('SET_APPCOMMONALARM_LIST', commonFeatures)
      }
    },
    // 加载地图中的消防报警和普通报警
    addMapAlarmAndCommonAlarm() {
      if (this.appAlarmCheck) {
        this.getOneMapArarlList(this.activeMap)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
      if (this.appAlarmCommonCheck) {
        this.getOneMapCommAlarm(this.activeMap)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 加载消防点位到地图上/楼层上
    addAlarmToMap(features, isOuter) {
      let alarmObj = appFireAlarm.addAlarm(this.appAlarmList, features, isOuter)
      alarmObj.alarmList = appAlarm.deleteAlarmingFromList(alarmObj.alarmList, this.appAlarmingList)
      this.$store.commit('SET_APPALARM_LIST', alarmObj.alarmList)
      return alarmObj.commonAlarms
    }
  },
  beforeDestroy() {
    // 清空消防点位
    this.$store.commit('SET_APPALARM_LIST', [])
    this.$store.commit('SET_APPALARMINMAP_LIST', [])
  },
  mounted() {
    this.$store.commit('SET_APPALARM_LIST', [])
  }
}
</script>
