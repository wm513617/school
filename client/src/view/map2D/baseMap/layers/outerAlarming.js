// 楼外 实时报警图层
import { mapState, mapGetters, mapMutations } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import alarmingTrans from 'assets/2DMap/feature/apply/alarming'
let timer = null
export default {
  data() {
    return {
      alarmingLayer: layerConfig.alarming,
      outerAlarmingOpacity: 1 // 报警透明度
    }
  },
  computed: {
    ...mapGetters('mapAlarm', ['outerAlarmPointFeatures', 'outerAlarming', 'sixTypeAlarmPointList', 'allVideoAlarmPointList', 'sosAlarmPointList']),
    ...mapGetters(['activeMapConfig']),
    ...mapGetters('map2DApplyIX', ['isAutoPosition']),
    ...mapState({
      alarmNewOne: ({ mapAlarm }) => mapAlarm.alarmNewOne // 最新的 报警数据
    })
  },
  watch: {
    outerAlarming() {
      this.getAlarmingFeatures()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAlarmingFeatures()
    })
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_OUTER_ALARM_POINT_FEATURES']),
    getAlarmingFeatures(loop) { // socket 数据转换为要素数据
      const alarmArr = this.sixTypeAlarmPointList.concat(this.allVideoAlarmPointList, this.sosAlarmPointList)
      const list = JSON.parse(JSON.stringify(alarmArr))
      const arr = []
      for (let i = 0; i < list.length; i++) {
        if (list[i]) {
          const item = { ...list[i] }
          const sosMapId = item.bondCarmerRes && item.bondCarmerRes.point && item.bondCarmerRes.point.mapId
          const mapId = (item.point && item.point.mapId) || (item.map2D && item.map2D.mapId) || sosMapId
          if (this.activeMapConfig.mapId === mapId) {
            arr.push(item)
          }
        }
      }
      if (list.length > 0) {
        this.outerAlarmingOpacity = this.outerAlarmingOpacity === 1 ? 0.01 : 1
        let features = alarmingTrans.transPointAlarmFeatures(arr, this.outerAlarmingOpacity)
        features = this.$lodash.compact(features)
        this.SET_OUTER_ALARM_POINT_FEATURES(features)
        if (!loop) {
          this.outerToCenter()
        }
        if (!timer) {
          this.loopTwining()
        }
      }
    },
    loopTwining() { // 报警点位闪烁
      const alarmArr = this.sixTypeAlarmPointList.concat(this.allVideoAlarmPointList, this.sosAlarmPointList)
      const list = JSON.parse(JSON.stringify(alarmArr))
      if (list.length > 0) {
        timer = setInterval(() => {
          if (this.outerAlarmPointFeatures.length > 0) {
            this.getAlarmingFeatures('noloop')
          }
        }, 600)
      } else {
        clearInterval(timer)
      }
    },
    outerToCenter() { // 设置地图中心位置
      if (!this.isAutoPosition) { return }
      const obj = this.alarmNewOne
      let loc = ''
      let mapId = ''
      let bid
      if (obj && obj.map2D) {
        loc = obj.map2D && obj.map2D.geo.split(',').map(item => Number(item))
        mapId = obj.map2D && obj.map2D.mapId
        bid = obj.map2D && obj.map2D.bid
      }
      if (obj && obj.point) {
        if (obj.alarmTypeToMap === 'singleAlarm') {
          loc = [Number(obj.point.lon), Number(obj.point.lat)]
          mapId = this.activeMapConfig.mapId
        } else {
          const item = obj.point
          loc = item && item.loc.split(',').map(item => Number(item))
          mapId = obj.point && obj.point.mapId
          bid = obj.point && obj.point.bid
        }
      }
      if (obj && obj.bondCarmerRes && obj.bondCarmerRes.point) {
        const item = obj.bondCarmerRes.point
        loc = item && item.loc.split(',').map(item => Number(item))
        mapId = obj.bondCarmerRes.point && obj.bondCarmerRes.point.mapId
        bid = obj.bondCarmerRes.point && obj.bondCarmerRes.point.bid
      }
      if (mapId) {
        if (loc && this.activeMapConfig.mapId === mapId) {
          this.locateInMapCenter(loc)
        }
      } else {
        bid && this.getBuildingData(bid).then((res) => {
          mapId = res.mapId
          if (loc && this.activeMapConfig.mapId === mapId) {
            this.locateInMapCenter(loc)
          }
        }).catch((err) => {
          console.log('获取楼宇信息进行中心定位：', err)
        })
      }
    }
  },
  beforeDestroy() {
    clearInterval(timer)
    timer = null
  }
}
