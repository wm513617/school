<!--应用模式 接收所有报警业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appFireAlarm from '../../../../../assets/map/app/appFireAlarm'
import appAlarm from '../../../../../assets/map/app/appAlarm'
import ALARMTYPE from '../../../../../assets/map/app/alarmType'
import appPatrolIpc from '../../../../../assets/map/app/appPatrolIpc.js'
import STATE from '../../../../../assets/map/edit/state.js'
export default {
  data() {
    return {
      index: 1
    }
  },
  computed: {
    ...mapState({
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      appPatrolList: ({ patrolData }) => patrolData.appPatrolList,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      fireAlarmingData: ({ mapAlarmData }) => mapAlarmData.fireAlarmingData, // 接收消防报警信息
      appCurrentAlarmingList: ({ mapAlarmData }) => mapAlarmData.appCurrentAlarmingList,
      appPageRight: ({ mapPageState }) => mapPageState.appPageRight,
      appAlarmCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCheck, // 消防点位勾选状态
      appAlarmCommonCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCommonCheck,
      appPatrolCheck: ({ patrolData }) => patrolData.appPatrolCheck,
      appFloorAlarmingList: ({ mapAlarmData }) => mapAlarmData.appFloorAlarmingList,
      appMoveSingleList: ({ mobilePatrol }) => mobilePatrol.appMoveSingleList,
      isOpenAlarm: ({ mapPageState }) => mapPageState.isOpenAlarm
    })
  },
  watch: {
    isAppOuter(val) {
      this.$store.commit('SET_APPALARMING_LIST', [])
      if (val) {
        this.$store.commit('SET_APPFLOORALARMING_LIST', [])
      } else {
        this.$store.commit('SET_APPCURRENTALARMING_LIST', [])
      }
    },
    // 正在报警的所有对象
    appCurrentAlarmingList(alarminglist) {
      if (this.isAppOuter) {
        this.aralmingAppFeatures = JSON.parse(JSON.stringify(alarminglist))
      }
    },
    // 楼层中正在报警的所有对象
    appFloorAlarmingList(alarminglist) {
      if (!this.isAppOuter) {
        this.aralmingAppFeatures = JSON.parse(JSON.stringify(alarminglist))
      }
    },
    // 接收消防报警信息
    fireAlarmingData(val) {
      let param = JSON.parse(JSON.stringify(val))
      if (val.type === 'patrolAlarm' && this.mapMode === 'point') {
        if (param.map2D.geo) {
          // 巡更报警
          let lonlat = param.map2D.geo.split(',')
          this.activeMapCenter = [parseFloat(lonlat[0]), parseFloat(lonlat[1])]
        }
      } else if (val.type === 'singleAlarm' && param[this.mapMode]) {
        this.activeMapCenter = [param.point.loc, param.point.lat]
      } else {
        // 消防报警，普通报警
        let loc
        if (param[this.mapMode]) {
          loc = param[this.mapMode].loc.split(',')
          this.activeMapCenter = [parseFloat(loc[0]), parseFloat(loc[1])]
        }
      }
      this.receiveFireAlarmData(param)
    }
  },
  methods: {
    ...mapActions([
      'getOneBuild',
      'getOneMapCommAlarm',
      'getOneMapArarlList',
      'getOneMapAllPatrolList',
      'getOneFloorPatrolList',
      'setAllAlarmPointFea'
    ]),
    ...mapMutations([
      'SET_APPDETAIL_STATE',
      'SET_APPCOMMONALARM_LIST',
      'SET_APPALARM_LIST',
      'SET_MAPACTIVE_STATE',
      'SET_ISAPPOUTER_STATE',
      'SET_APPCURRENTALARMING_LIST',
      'SET_APPPATROL_LIST',
      'SET_APPFLOORALARMING_LIST',
      'SET_2D_ALARMING_LIST',
      'removePatrolFea'
    ]),
    // 接收socket推送的消防报警信息
    receiveFireAlarmData(param) {
      if (param.type === 'fireAlarm' || param.type === 'commonAlarm') {
        // 消防报警，普通报警
        this.dealAlarm(param)
      } else if (param.type === 'patrolAlarm') {
        // 巡更报警
        this.dealPatrolAlarm(param)
      } else {
        // 单兵报警
        this.dealSingleAlarm(param)
      }
    },
    // 单兵报警
    dealSingleAlarm(param) {
      if (!param.point) {
        return
      }
      this.addSingleAlarmingFeature(param)
    },
    // 巡更报警
    dealPatrolAlarm(param) {
      if (!param.map2D.geo) {
        return
      }
      // 当楼层中的点位报警时，当前如果在地图上，则楼宇闪烁，
      // 如果在该点位的楼层中，则点位闪烁，如果不在该点位的楼层中，则跳到地图上
      if (this.activeMap !== param.map2D.mapId) {
        // 报警点位不在当前地图上时，跳转地图
        this.$store.commit('SET_MAPACTIVE_STATE', param.map2D.mapId)
      }
      if (!param.map2D.isouter) {
        if (this.isAppOuter) {
          this.patrolConverTwink(param)
        } else {
          if (param.map2D.sid !== this.levelData._id) {
            // 如果报警点位不在当前楼层，则跳回到地图中
            this.$store.commit('SET_ISAPPOUTER_STATE', true)
            this.patrolConverTwink(param)
          } else {
            let alarmObj = this.addPatrolAlarmingFeature(param)
            this.addCurrentFloorAlarming(alarmObj, param)
          }
        }
      } else {
        if (this.isAppOuter) {
          this.addPatrolAlarmingFeature(param)
        } else {
          this.$store.commit('SET_ISAPPOUTER_STATE', true)
          this.patrolConverTwink(param)
        }
      }
    },
    // 普通报警，消防报警
    dealAlarm(param) {
      if (!param.point) {
        return
      }
      // 报警点位不在当前地图上时，跳转地图
      if (this.activeMap !== param.point.mapId) {
        this.$store.commit('SET_MAPACTIVE_STATE', param.point.mapId)
      }
      // 当楼层中的点位报警时，当前如果在地图上，则楼宇闪烁
      // 如果在该点位的楼层中，则点位闪烁，如果不在该点位的楼层中，则跳到地图上
      if (!param.point.isouter) {
        // 当前报警点位是楼层中
        if (this.isAppOuter) {
          this.alarmBuildTwink(param)
        } else {
          if (param.point.sid !== this.levelData._id) {
            // 如果报警点位不在当前楼层，则且回到地图中
            this.$store.commit('SET_ISAPPOUTER_STATE', true)
            this.alarmBuildTwink(param)
          } else {
            let alarmObj = this.addFireAlarmingFeature(param)
            this.addCurrentFloorAlarming(alarmObj, param)
          }
        }
      } else {
        if (this.isAppOuter) {
          this.addFireAlarmingFeature(param)
        } else {
          this.$store.commit('SET_ISAPPOUTER_STATE', true)
          this.addFireAlarmingFeature(param)
        }
      }
    },
    // 加载楼层中的报警点位
    addCurrentFloorAlarming(alarmObj, param) {
      let currentFloorAlarmings = JSON.parse(JSON.stringify(this.appFloorAlarmingList))
      let isCuurentContain = appAlarm.isContainerAlarmingFeature(currentFloorAlarmings, param.point._id)
      if (!isCuurentContain) {
        // 不包含
        if (alarmObj.alarming) {
          currentFloorAlarmings.push(alarmObj.alarming)
        }
        this.$store.commit('SET_APPFLOORALARMING_LIST', currentFloorAlarmings)
      }
    },
    // 判断当前地图/楼层的报警数组中是否包含当前推送过来的报警对象
    currentAlarmingsIsContainer(alarmObj, param) {
      let currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
      let id = null
      if (!param.point) {
        id = param._id
      } else {
        id = param.point._id
      }
      let isCuurentContain = appAlarm.isContainerAlarmingFeature(currentAlarmings, id)
      if (!isCuurentContain) {
        // 不包含
        if (alarmObj.alarming) {
          currentAlarmings.push(alarmObj.alarming)
        }
        this.$nextTick(() => {
          this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
        })
      }
    },
    // 巡更汇聚闪烁
    patrolConverTwink(param) {
      let alarmObj = appAlarm.addPatrolConverTwink(this.appPatrolList, this.appAlarmingList, param)
      this.$store.commit('SET_APPPATROL_LIST', alarmObj.patrolList) // 巡更点位
      this.$store.commit('SET_APPALARMING_LIST', alarmObj.alarminglist)
      this.currentAlarmingsIsContainer(alarmObj, param)
    },
    // 楼宇闪烁
    alarmBuildTwink(param) {
      this.getOneBuild(param.point.bid)
        .then(res => {
          let alarmObj = appAlarm.addTwinkBuild(this.appAlarmingList, param, res.loc)
          this.$store.commit('SET_APPALARMING_LIST', alarmObj.alarminglist)
          this.currentAlarmingsIsContainer(alarmObj, param)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加正在报警的消防点位到地图上
    addFireAlarmingFeature(param) {
      let alarmObj = appAlarm.addFireAlarming(this.appAlarmList, this.appAlarmingList, param)
      this.$store.commit('SET_APPALARM_LIST', alarmObj.alarmlist) // 消防、普通报警
      this.$nextTick(() => {
        this.$store.commit('SET_APPALARMING_LIST', alarmObj.alarminglist)
      })
      this.currentAlarmingsIsContainer(alarmObj, param)
      return alarmObj
    },
    // 添加正在报警的巡更点位到地图上
    addPatrolAlarmingFeature(param) {
      let alarmObj = appAlarm.addPatrolAlarming(this.appPatrolList, this.appAlarmingList, param)
      this.$store.commit('SET_APPPATROL_LIST', alarmObj.patrolList) // 巡更点位
      this.$store.commit('SET_APPALARMING_LIST', alarmObj.alarminglist)
      this.currentAlarmingsIsContainer(alarmObj, param)
      return alarmObj
    },
    // 添加移动单兵的报警点位到地图上，只存在在地图上
    addSingleAlarmingFeature(param) {
      let singleObj = appAlarm.addSingleAlarming(this.appMoveSingleList, this.appAlarmingList, param)
      this.$store.commit('SET_APPMOVESINGLE_LIST', singleObj.singleList) // 单兵点位
      this.$store.commit('SET_APPALARMING_LIST', singleObj.alarminglist)
      this.currentAlarmingsIsContainer(singleObj, param)
      return singleObj
    },
    // 报警点位闪烁事件
    alarmTwinkEvt(event) {
      if (this.appAlarmingList.length > 0) {
        let alarmingList = JSON.parse(JSON.stringify(this.appAlarmingList))
        let currentAlarmings = null
        if (this.isAppOuter) {
          currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
        } else {
          currentAlarmings = JSON.parse(JSON.stringify(this.appFloorAlarmingList))
        }
        this.index = this.index >= 120 ? 0 : this.index
        let num = this.index % 30
        if (num < 5) {
          alarmingList = appAlarm.controlAlarmingShowOrHide(alarmingList, currentAlarmings, false)
        } else {
          alarmingList = appAlarm.controlAlarmingShowOrHide(alarmingList, currentAlarmings, true)
        }
        if (this.isAppOuter) {
          this.$store.commit('SET_APPCURRENTALARMING_LIST', alarmingList)
        } else {
          this.$store.commit('SET_APPFLOORALARMING_LIST', alarmingList)
        }
        this.index++
        if (this.isAppOuter) {
          this.$refs.mapAppContainer[0] && this.$refs.mapAppContainer[0].render()
        } else {
          this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render()
        }
      }
    },
    // 处理消防报警
    processFireAlarmingInfo(alarming, id) {
      let alarmlist = JSON.parse(JSON.stringify(this.appAlarmList))
      let isCommonAlarm = alarming.attributes.isCommonAlarm
      if (isCommonAlarm) {
        // 判断当前处理的报警点位是普通报警
        if (this.appAlarmCommonCheck) {
          // 点位元素中普通报警是否勾选
          this.getOneMapCommAlarm(this.activeMap)
            .then(res => {
              let alarmObj = appFireAlarm.addAlarm(alarmlist, res, this.isAppOuter)
              let alarmAll = alarmObj.alarmList
              let alarmCol = appFireAlarm.deleteOrChangeStateById(alarmlist, alarmAll, id, STATE.ARMIMG)
              alarmlist = alarmCol.alarmList
              this.$store.commit('SET_APPALARM_LIST', alarmlist)
            })
            .catch(err => {
              console.log(err)
            })
        }
      } else {
        // 判断是否是楼宇在闪烁
        if (alarming.attributes.type !== 'buildalarm') {
          if (this.appAlarmCheck) {
            // 点位元素中消防报警是否勾选
            this.getOneMapArarlList(this.activeMap)
              .then(res => {
                let alarmObj = appFireAlarm.addAlarm(alarmlist, res, this.isAppOuter)
                let alarmAll = alarmObj.alarmList
                let alarmCol = appFireAlarm.deleteOrChangeStateById(alarmlist, alarmAll, id, STATE.ARMIMG)
                alarmlist = alarmCol.alarmList
                this.$store.commit('SET_APPALARM_LIST', alarmlist)
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    // 处理巡更报警后，如果巡更点位勾选着，需要添加地图/楼层中的巡更点位
    cancelAlarmAddPatrolIpc(patrollist, res, id) {
      let patrolAll = appPatrolIpc.addStrogePatrolIpc(patrollist, res, this.isAppOuter)
      let patrolCol = appPatrolIpc.deleteOrChangeStateById(patrollist, patrolAll, id, STATE.ARMIMG)
      patrollist = patrolCol.patrolList
      this.$store.commit('SET_APPPATROL_LIST', patrollist)
    },
    // 处理巡更报警
    processPatrolAlarmingInfo(alarming, id) {
      let patrollist = JSON.parse(JSON.stringify(this.appPatrolList))
      if (id) {
        // 判断当前处理的报警点位是不是普通报警
        if (this.appPatrolCheck) {
          // 点位元素中普通报警是否勾选
          if (this.isAppOuter) {
            // 巡更（地图包括楼层中的，楼层中以数组形式展示）
            this.getOneMapAllPatrolList({ mapid: this.activeMap })
              .then(res => {
                this.cancelAlarmAddPatrolIpc(patrollist, res, id)
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            // 加载楼层中的巡更点位
            this.getOneFloorPatrolList(this.levelData._id)
              .then(res => {
                this.cancelAlarmAddPatrolIpc(patrollist, res, id)
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    // 处理报警信息
    processAlarmingInfo(id) {
      let alarminglist = JSON.parse(JSON.stringify(this.appAlarmingList))
      let currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
      let alarming = appAlarm.getFeatureById(alarminglist, id)
      if (alarming) {
        let type = alarming.attributes.alarmType
        if (type === ALARMTYPE.FIRE || type === ALARMTYPE.COMMON) {
          // 处理消防报警
          this.processFireAlarmingInfo(alarming, id)
        }
        if (type === ALARMTYPE.PATROL) {
          this.processPatrolAlarmingInfo(alarming, id) // 处理巡更报警
        }
      }
      alarminglist = appAlarm.deleteAlarmById(alarminglist, id)
      currentAlarmings = appAlarm.deleteAlarmById(currentAlarmings, id)
      this.$store.commit('SET_APPALARMING_LIST', alarminglist)
      this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
    }
  },
  beforeDestroy() {
    // 清空报警点位
    this.$store.commit('SET_APPALARMING_LIST', [])
    this.$store.commit('SET_APPALARM_LIST', [])
    this.$store.commit('SET_APPCURRENTALARMING_LIST', [])
  },
  mounted() {
    // 清空报警点位
    this.$store.commit('SET_APPALARMING_LIST', [])
    this.$store.commit('SET_APPALARM_LIST', [])
    this.$store.commit('SET_APPCURRENTALARMING_LIST', [])
  }
}
</script>
