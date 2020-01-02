// 楼内 实时报警图层
import { mapState, mapGetters, mapMutations } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import alarmingTrans from 'assets/2DMap/feature/apply/alarming'
let timer = null
export default {
  data() {
    return {
      alarmingLayer: layerConfig.alarming,
      buildingAlarmingOpacity: 1 // 报警透明度
    }
  },
  computed: {
    ...mapGetters('mapAlarm', ['buildingAlarmingFeatures', 'buildingAlarming', 'sixTypeAlarmBuildList', 'allVideoAlarmBuildList', 'sosAlarmBuildList']),
    ...mapGetters(['currentFloor', 'activeMapConfig']),
    ...mapGetters('map2DApplyIX', ['isAutoPosition']),
    ...mapState({
      alarmNewOne: ({ mapAlarm }) => mapAlarm.alarmNewOne // 最新的 报警数据
    })
  },
  watch: {
    buildingAlarming() {
      this.getAlarmingFeatures()
    },
    alarmNewOne(item) {
      if (!this.isAutoPosition) { return }
      let bid
      let isouter
      let sid
      if (item && item.map2D) {
        bid = item.map2D.bid
        isouter = item.map2D.isouter
        sid = item.map2D.sid
      }
      if (item && item.point) {
        bid = item.point.bid
        isouter = item.point.isouter
        sid = item.point.sid
      }
      if (item && item.bondCarmerRes && item.bondCarmerRes.point) {
        bid = item.bondCarmerRes.point.bid
        isouter = item.bondCarmerRes.point.isouter
        sid = item.bondCarmerRes.point.sid
      }
      if (this.currentFloor.bid && this.currentFloor.bid._id === bid) {
        if (isouter || this.currentFloor._id !== sid) {
          this.setIsMapOuter(true)
        } else {
          this.buildingToCenter()
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAlarmingFeatures()
    })
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_BUILDING_ALARMING_FEATURES']),
    getAlarmingFeatures(loop) {
      const alarmArr = this.sixTypeAlarmBuildList.concat(this.allVideoAlarmBuildList, this.sosAlarmBuildList)
      const list = JSON.parse(JSON.stringify(alarmArr))
      const arr = []
      for (let i = 0; i < list.length; i++) {
        const item = { ...list[i] }
        let bid
        let sid
        if (item.point) {
          bid = item.point.bid
          sid = item.point.sid
        }
        if (item.map2D) {
          bid = item.map2D.bid
          sid = item.map2D.sid
        }
        if (item.bondCarmerRes && item.bondCarmerRes.point) {
          bid = item.bondCarmerRes.point.bid
          sid = item.bondCarmerRes.point.sid
        }
        if (this.currentFloor && this.currentFloor.bid && this.currentFloor.bid._id === bid && this.currentFloor._id === sid) {
          arr.push(item)
        }
      }
      if (list.length > 0) {
        this.buildingAlarmingOpacity = this.buildingAlarmingOpacity === 1 ? 0.01 : 1
        let features = alarmingTrans.transPointAlarmFeatures(arr, this.buildingAlarmingOpacity)
        features = this.$lodash.compact(features)
        this.SET_BUILDING_ALARMING_FEATURES(features)
        if (!loop) {
          this.buildingToCenter()
        }
        if (!timer) {
          this.loopTwining()
        }
      }
    },
    loopTwining() {
      const alarmArr = this.sixTypeAlarmBuildList.concat(this.allVideoAlarmBuildList, this.sosAlarmBuildList)
      const list = JSON.parse(JSON.stringify(alarmArr))
      if (list.length > 0) {
        timer = setInterval(() => {
          if (this.buildingAlarmingFeatures.length > 0) {
            this.getAlarmingFeatures('noloop')
          }
        }, 600)
      } else {
        clearInterval(timer)
      }
    },
    buildingToCenter() {
      const obj = this.alarmNewOne
      let loc = ''
      let bid = ''
      let sid
      if (obj && obj.map2D) {
        loc = obj.map2D && obj.map2D.geo.split(',').map(item => Number(item))
        bid = obj.map2D && obj.map2D.bid
        sid = obj.map2D && obj.map2D.sid
      }
      if (obj && obj.point) {
        const item = obj.point
        loc = item && item.loc.split(',').map(item => Number(item))
        bid = obj.point && obj.point.bid
        sid = obj.point && obj.point.sid
      }
      if (obj && obj.bondCarmerRes && obj.bondCarmerRes.point) {
        const item = obj.bondCarmerRes.point
        loc = item && item.loc.split(',').map(item => Number(item))
        bid = obj.bondCarmerRes.point && obj.bondCarmerRes.point.bid
        sid = obj.bondCarmerRes.point && obj.bondCarmerRes.point.sid
      }
      if (loc && this.currentFloor.bid && this.currentFloor.bid._id === bid && this.currentFloor._id === sid) {
        this.locateInMapCenter(loc)
      }
    }
  },
  beforeDestroy() {
    clearInterval(timer)
    timer = null
  }
}
