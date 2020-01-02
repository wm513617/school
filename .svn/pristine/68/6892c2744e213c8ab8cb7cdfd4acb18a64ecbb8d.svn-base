// 单兵超时定点报警图层
import { mapState, mapGetters, mapMutations } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import alarmingTrans from 'assets/2DMap/feature/apply/alarming'
let timer = null
export default {
  data() {
    return {
      singleTimeoutAlarmLayer: layerConfig.singleAlarming,
      singleTimeoutOpacity: 1 // 报警透明度
    }
  },
  computed: {
    ...mapState({
      singleTimeoutList: ({ mapAlarm }) => mapAlarm.singleTimeoutList
    }),
    ...mapGetters('mapAlarm', ['singleTimeoutAlarmFeatures'])
  },
  watch: {
    singleTimeoutList() {
      this.getSingleAlarmingFeatures()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getSingleAlarmingFeatures()
    })
  },
  methods: {
    ...mapMutations('mapAlarm', ['SET_SINGLE_TIMEOUT_ALARM_FEATURES']),
    getSingleAlarmingFeatures() { // socket 数据转换为要素数据
      const list = JSON.parse(JSON.stringify(this.singleTimeoutList))
      const arr = []
      for (let i = 0; i < list.length; i++) {
        if (list[i]) {
          const item = { ...list[i] }
          if (item.point) {
            arr.push(item)
          }
        }
        if (list.length > 0) {
          this.singleTimeoutOpacity = this.singleTimeoutOpacity === 1 ? 0.01 : 1
          let features = alarmingTrans.transPointAlarmFeatures(arr, this.singleTimeoutOpacity)
          this.SET_SINGLE_TIMEOUT_ALARM_FEATURES(features)
          if (!timer) {
            this.loopTwiningSingle()
          }
        }
      }
    },
    loopTwiningSingle() { // 点位闪烁
      if (this.singleTimeoutAlarmFeatures.length > 0) {
        timer = setInterval(() => {
          if (this.singleTimeoutAlarmFeatures.length > 0) {
            this.getSingleAlarmingFeatures()
          }
        }, 450)
      } else {
        clearInterval(timer)
      }
    }
  },
  beforeDestroy() {
    clearInterval(timer)
    timer = null
  }
}
