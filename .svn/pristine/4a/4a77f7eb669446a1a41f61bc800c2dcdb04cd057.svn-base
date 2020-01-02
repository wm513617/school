// 楼内 实时报警 楼外 楼宇闪烁
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import areaStyle from 'assets/2DMap/areaStyle'
import alarmingTrans from 'assets/2DMap/feature/apply/alarming'
let timer = null
export default {
  data() {
    return {
      alarmingAreaLayer: layerConfig.alarmingArea,
      buildingAlarmFeaturesArr: [],
      curArr: [],
      alarmingAreaOpacity: 1 // 报警不透明度
    }
  },
  computed: {
    ...mapState({
      buildingIdInfo: ({ mapAlarm }) => mapAlarm.buildingIdInfo
    }),
    ...mapGetters('mapAlarm', ['buildingAreaAlarmingFeatures', 'buildingAlarming', 'sixTypeAlarmBuildList', 'allVideoAlarmBuildList', 'sosAlarmBuildList']),
    ...mapGetters(['activeMapConfig'])
  },
  watch: {
    buildingAlarming() {
      this.getBuildingAlarmList()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getBuildingAlarmList()
    })
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_BUILDING_AREA_ALARMING_FEATURES', 'PUSH_BUILD_ALARM_ARR', 'SET_BUILD_ALARM_ARR']),
    ...mapActions(['getBuildingData']),
    getBuildingAlarmList() {
      const alarmArr = this.sixTypeAlarmBuildList.concat(this.allVideoAlarmBuildList, this.sosAlarmBuildList)
      const list = JSON.parse(JSON.stringify(alarmArr))
      const pros = []
      const proData = []
      const featureArr = []
      for (let i = 0; i < list.length; i++) {
        const item = { ...list[i] }
        const soBid = item.bondCarmerRes && item.bondCarmerRes.point && item.bondCarmerRes.point.bid
        const id = soBid || (item.map2D && item.map2D.bid) || (item.point && item.point.bid)
        if (this.curArr.indexOf(id) === -1) {
          if (this.buildingIdInfo.hasOwnProperty(id)) {
            featureArr.push(this.buildingIdInfo[id].data)
          } else {
            proData.push(item)
            this.curArr.push(id)
            id && pros.push(this.getBuildingData(id))
          }
        }
      }
      Promise.all(pros).then((res) => {
        this.curArr = []
        if (res.length) {
          for (let j = 0; j < proData.length; j++) {
            if (res[j] && res[j].mapId === this.activeMapConfig.mapId) {
              featureArr.push(res[j])
              this.PUSH_BUILD_ALARM_ARR({
                key: res[j]._id,
                data: res[j]
              })
            }
          }
        }
        this.buildingAlarmFeaturesArr = featureArr
        this.getBuildingAlarmingFeatures()
      })
    },
    getBuildingAlarmingFeatures(loop) { // socket 数据转换为要素数据
      const alarmArr = this.sixTypeAlarmBuildList.concat(this.allVideoAlarmBuildList, this.sosAlarmBuildList)
      if (alarmArr.length) {
        this.alarmingAreaOpacity = this.alarmingAreaOpacity === 1 ? 0.01 : 1
        let features = alarmingTrans.transAreaAlarmFeatures(this.buildingAlarmFeaturesArr, areaStyle.buildAlarmStyle, this.alarmingAreaOpacity)
        features = this.$lodash.compact(features)
        this.SET_BUILDING_AREA_ALARMING_FEATURES(features)
        if (!loop) {
          this.outerToCenter()
        }
        if (!timer) {
          this.buildingTwining()
        }
      }
    },
    buildingTwining() { // 报警点位闪烁
      const alarmArr = this.sixTypeAlarmBuildList.concat(this.allVideoAlarmBuildList, this.sosAlarmBuildList)
      const list = JSON.parse(JSON.stringify(alarmArr))
      if (list.length > 0) {
        timer = setInterval(() => {
          if (this.buildingAreaAlarmingFeatures.length > 0) {
            this.getBuildingAlarmingFeatures('noloop')
          }
        }, 600)
      } else {
        clearInterval(timer)
      }
    }
  },
  beforeDestroy() {
    clearInterval(timer)
    timer = null
    this.SET_BUILD_ALARM_ARR({})
  }
}
