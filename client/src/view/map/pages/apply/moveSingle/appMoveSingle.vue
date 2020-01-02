<!--应用模式 移动单兵业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appMoveSingle from '../../../../../assets/map/app/appMoveSingle'
export default {
  computed: {
    ...mapState({
      appPatrolLineList: ({ patrolData }) => patrolData.appPatrolLineList,
      mobilePatrolList: ({ mobilePatrol }) => mobilePatrol.mobilePatrolList, // 当前巡更人员
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      appMoveSingleList: ({ mobilePatrol }) => mobilePatrol.appMoveSingleList,
      currentMapExtent: ({ mapGisData }) => mapGisData.currentMapExtent,
      appMoveSinglePosition: ({ mapAlarmData }) => mapAlarmData.appMoveSinglePosition,
      appMoveSingleCheck: ({ mobilePatrol }) => mobilePatrol.appMoveSingleCheck
    })
  },
  watch: {
    // 巡更连线数组
    appPatrolLineList(patrollinelist) {
      this.patrollineFeatures = JSON.parse(JSON.stringify(patrollinelist))
    },
    mobilePatrolList(moveSinglelist) {
      let array = JSON.parse(JSON.stringify(moveSinglelist))
      let singlelist = appMoveSingle.addMoveSingleIpc(this.appMoveSingleList, array, this.currentMapExtent)
      this.$store.commit('SET_APPMOVESINGLE_LIST', singlelist)
    },
    appMoveSingleList(val) {
      this.singleAppFeatures = JSON.parse(JSON.stringify(val))
    },
    // 移动单兵的位置信息推送
    appMoveSinglePosition(val) {
      if (this.appMoveSingleCheck) {
        let singlelist = appMoveSingle.changeSinglePositionById(this.appMoveSingleList, val)
        this.$store.commit('SET_APPMOVESINGLE_LIST', singlelist)
      }
    }
  },
  methods: {
    ...mapActions(['getOneSingle']),
    ...mapMutations(['SET_APPMOVESINGLE_LIST']),
    // 地图单击事件
    selectMobileSingleEvt(id) {
      if (id) {
        this.getOneSingle(id)
          .then(res => {
            this.$store.commit('SET_APPDETAIL_STATE', 'moveSingleApp')
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  mounted() {
    // this.posi = { lon: 119.17659633238947, lat: 34.11956259304917 }
  },
  beforeDestroy() {
    this.$store.commit('SET_APPMOVESINGLE_LIST', [])
  }
}
</script>
