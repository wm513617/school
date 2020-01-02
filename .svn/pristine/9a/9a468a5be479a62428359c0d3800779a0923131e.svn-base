<!--应用模式 巡更点位业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appPatrolIpc from '../../../../../assets/map/app/appPatrolIpc'
export default {
  computed: {
    ...mapState({
      onePartrolData: ({ patrolData }) => patrolData.onePartrol, // 单个巡更点位
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      oneFloorPartrolList: ({ patrolData }) => patrolData.oneFloorPartrolList, // 单个楼层的所有巡更点位
      oneAllMapPartrolList: ({ patrolData }) => patrolData.oneAllMapPartrolList, // 单个地图的所有巡更点位
      appPatrolCheck: ({ patrolData }) => patrolData.appPatrolCheck,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      appPatrolList: ({ patrolData }) => patrolData.appPatrolList,
      levelData: ({ mapGisData }) => mapGisData.levelData
    })
  },
  watch: {
    // 当前地图上所有的巡更点位
    oneAllMapPartrolList(patrollist) {
      if (this.appPatrolCheck) {
        let features = JSON.parse(JSON.stringify(patrollist))
        let patrols = appPatrolIpc.addStrogePatrolIpc(this.appPatrolList, features, this.isAppOuter)
        this.$store.commit('SET_APPPATROL_LIST', patrols)
      }
    },
    // 楼层中所有的巡更点位
    oneFloorPartrolList(patrollist) {
      this.$store.commit('SET_APPPATROL_LIST', [])
      if (this.appPatrolCheck) {
        let features = JSON.parse(JSON.stringify(patrollist))
        let patrols = appPatrolIpc.addStrogePatrolIpc(this.appPatrolList, features, false)
        this.$store.commit('SET_APPPATROL_LIST', patrols)
      }
    },
    // 地图和楼层切换时，加载巡更点位资源
    isAppOuter(val) {
      this.$store.commit('SET_APPPATROL_LIST', [])
      if (val) {
        if (this.appPatrolCheck) {
          this.getOneMapAllPatrolList({ mapid: this.activeMap })
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        }
      } else {
        if (this.levelData._id) {
          this.getOneFloorPatrolList(this.levelData._id)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    // 巡更点为数组
    appPatrolList(patrollist) {
      this.patrolFeatures = JSON.parse(JSON.stringify(patrollist))
    },
    activeMap(val) {
      this.$store.commit('SET_APPPATROL_LIST', [])
      if (this.appPatrolCheck) {
        this.getOneMapAllPatrolList({ mapid: val, orgid: '' })
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  methods: {
    ...mapActions(['getOnePatrol', 'getOneMapAllPatrolList', 'getOnePatrolstatistic', 'getOneFloorPatrolList']),
    ...mapMutations(['SET_APPDETAIL_STATE', 'SET_APPPATROL_LIST']),
    selectPatrolEvt(id) {
      if (id) {
        let onePatrol = this.getOnePatrol(id)
        let onePatrolstatistic = this.getOnePatrolstatistic(id)
        Promise.all([onePatrol, onePatrolstatistic])
          .then(res => {
            this.$store.commit('SET_APPDETAIL_STATE', 'patrolApp')
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('巡更点位信息获取失败')
          })
      }
    }
  },
  beforeDestroy() {
    this.$store.commit('SET_APPPATROL_LIST', [])
    this.$store.commit('SET_APPDETAIL_STATE', '')
  }
}
</script>
