<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import appFireAlarm from '../../assets/map/app/appFireAlarm'
export default {
  data() {
    return {
      index: 1
    }
  },
  computed: {
    ...mapState({
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      receiveFireWarning: ({ warningDispose }) => warningDispose.receiveFireWarning,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      appCurrentAlarmingList: ({ mapAlarmData }) => mapAlarmData.appCurrentAlarmingList

    })
  },
  watch: {
    appAlarmList(alarmlist) {
      this.alarmAppFeatures = JSON.parse(JSON.stringify(alarmlist))
    },
    // 接收消防报警信息
    receiveFireWarning(val) {
      let param = JSON.parse(JSON.stringify(val))
      if (!param.point) {
        return
      }
      if (this.activeMap !== param.point.mapId) { // 报警点位不在当前地图上时，跳转地图
        this.$store.commit('SET_MAPACTIVE_STATE', param.point.mapId)
      }
      // 当楼层中的点位报警时，当前如果在地图上，则楼宇闪烁，
      // 如果在该点位的楼层中，则点位闪烁，如果不在该点位的楼层中，则跳到地图上
      if (!param.point.isouter) {
        if (this.isAppOuter) {
          this.alarmBuildTwink(param)
        } else {
          if (param.point.sid !== this.levelData._id) { // 如果报警点位不在当前楼层，则且回到地图中
            this.$store.commit('SET_ISAPPOUTER_STATE', true)
            this.alarmBuildTwink(param)
          } else {
            let alarmingObj = appFireAlarm.addAlarming(this.appAlarmList, param)
            this.addAlarmingFeature(alarmingObj, param)
          }
        }
      } else {
        let alarmingObj = appFireAlarm.addAlarming(this.appAlarmList, param)
        this.addAlarmingFeature(alarmingObj, param)
      }
    }
  },
  methods: {
    ...mapActions(['CloseFireWebscoket', 'getOneMapArarlList', 'getUseType', 'getFirePlan', 'getfireAlarmOrgTree', 'getOneMapGrid', 'receiveWarnning', 'confirmWarnMessages', 'getOneLevel']),
    ...mapMutations(['SET_APPALARM_LIST', 'SET_MAPACTIVE_STATE', 'SET_ISAPPOUTER_STATE', 'SET_APPALARMING_LIST', 'SET_APPCURRENTALARMING_LIST', 'SET_APPDETAIL_STATE']),
    // 楼宇闪烁
    alarmBuildTwink(param) {
      this.getOneLevel(param.point.sid).then(res => {
        let alarmingObj = appFireAlarm.addTwinkBuild(this.appAlarmList, param, res.bid.loc)
        this.addAlarmingFeature(alarmingObj, param)
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加正在报警的点位到地图上
    addAlarmingFeature(alarmingObj, param) {
      let alarmingList = JSON.parse(JSON.stringify(this.appAlarmingList))
      let isContain = appFireAlarm.isContainerAlarmingFeature(alarmingList, param.point._id)
      if (!isContain) {
        if (alarmingObj.alarming) {
          let isExist = appFireAlarm.isContainerAlarmingFeature(alarmingList, alarmingObj.alarming.attributes.id)
          if (!isExist) {
            alarmingList.push(alarmingObj.alarming)
          }
        }
        this.$store.commit('SET_APPALARMING_LIST', alarmingList)
      }
      let currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
      let isCuurentContain = appFireAlarm.isContainerAlarmingFeature(currentAlarmings, param.point._id)
      if (!isCuurentContain) {
        if (alarmingObj.alarming) {
          let isCurrentExist = appFireAlarm.isContainerAlarmingFeature(currentAlarmings, alarmingObj.alarming.attributes.id)
          if (!isCurrentExist) {
            currentAlarmings.push(alarmingObj.alarming)
          }
        }
        this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
      }
      this.$store.commit('SET_APPALARM_LIST', alarmingObj.alarmList)
    },
    // 报警点位闪烁事件
    alarmTwinkEvt(event) {
      if (this.appAlarmingList.length > 0) {
        // let alarmingList = appFireAlarm.getAlarmingsByIsOuter(this.appAlarmingList, this.isAppOuter, this.levelData._id)
        let alarmingList = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
        // let alarmingList = JSON.parse(JSON.stringify(this.appAlarmingList))
        let alarmList = JSON.parse(JSON.stringify(this.appAlarmList))
        this.index = this.index >= 120 ? 0 : this.index
        let num = this.index % 30
        if (num < 5) {
          alarmList = appFireAlarm.controlAlarmingShowOrHide(alarmList, alarmingList, false)
        } else {
          alarmList = appFireAlarm.controlAlarmingShowOrHide(alarmList, alarmingList, true)
        }
        this.$store.commit('SET_APPALARM_LIST', alarmList)
        this.index++
        if (this.isAppOuter) {
          this.$refs.fireMapContainer.$refs.mapAppContainer[0].render()
        } else {
          this.$refs.fireMapContainer.$refs.mapFloorContainer.render()
        }
      }
    },
    // 处理消防报警
    processFireAlarmingInfo(array) {
      let alarmlist = JSON.parse(JSON.stringify(this.appAlarmList))
      let currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
      array.forEach(element => {
        if (element.point !== undefined && element.point._id !== undefined) {
          alarmlist = appFireAlarm.deleteAlarmById(alarmlist, element.point._id)
          currentAlarmings = appFireAlarm.deleteAlarmById(currentAlarmings, element.point._id)
          this.$store.commit('SET_APPALARM_LIST', alarmlist)
          this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
        }
      })
    },
    // 地图点击事件
    selectFeatureEvt(obj) {
      console.log('地图点击事件', obj)
    }
  }
}
</script>
