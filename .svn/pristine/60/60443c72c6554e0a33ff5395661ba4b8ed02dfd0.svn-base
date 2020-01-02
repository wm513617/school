<!--应用模式 网格楼宇业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import areaUtil from '../../../../../assets/map/areaUtil'
import appStatis from '../../../../../assets/map/app/appStatis.js'
import layerConfig from '../../../../../assets/map/MapConfig.js'
import appAlarm from '../../../../../assets/map/app/appAlarm.js'
import areaStyle from '../../../style/areaStyle'
export default {
  computed: {
    ...mapState({
      mapIsStatic: ({ mapPageState }) => mapPageState.isStatic, // 触发统计
      oneMapGidList: ({ mapGisData }) => mapGisData.oneMapGidList, // 单个地图网格列表
      appBuildList: ({ mapAreaData }) => mapAreaData.appBuildList,
      gridData: ({ mapGisData }) => mapGisData.gridData,
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      isCloseAllGrid: ({ mapAreaData }) => mapAreaData.isCloseAllGrid,
      isCloseAllBuild: ({ mapAreaData }) => mapAreaData.isCloseAllBuild,
      oneMapBuildList: ({ mapGisData }) => mapGisData.oneMapBuildList, // 单个地图楼宇列表
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      appTreeNodeInfo: ({ mapGisData }) => mapGisData.appTreeNodeInfo
    })
  },
  watch: {
    // 点击节点时清空当前地图上的网格和楼宇
    appTreeNodeInfo() {
      if (this.isCloseAllBuild) {
        this.buildAppFeatures = []
      }
      if (this.isCloseAllGrid) {
        this.gridAppFeatures = []
      }
    },
    // 统计工具
    mapIsStatic(val) {
      this.statistics.actived = val
    },
    'statistics.actived'(val) {
      if (val) {
        this.$store.commit('SET_MEASURE_ACTIVE', false) // 关闭测量工具
      }
    },
    oneMapGidList(val) {
      this.gridAppFeatures = []
      if (val) {
        this.gridAppFeatures = areaUtil.areaManage(val, areaStyle.gridStyle, layerConfig.gridAppType)
      }
    },
    appBuildList(val) {
      this.buildAppFeatures = []
      if (val) {
        this.buildAppFeatures = areaUtil.areaManage(val, areaStyle.buildStyle, layerConfig.buildAppType)
      }
    },
    // 单个网格信息
    gridData(val) {
      if (val) {
        this.$store.commit('SET_APPDETAIL_STATE', '')
        this.centerTurn(val)
        if (this.isCloseAllGrid) {
          this.gridAppFeatures = areaUtil.areaManage([val], areaStyle.gridStyle, layerConfig.gridAppType)
        }
        this.getGridStatData(val._id)
          .then(res => {
            this.$store.commit('SET_APPDETAIL_STATE', 'gridApp')
            this.$store.commit('SET_ISAPPOUTER_STATE', true)
          })
          .catch(err => {
            this.errorMsg('参数获取失败')
            console.log(err)
          })
        // let newVal = JSON.parse(JSON.stringify([val]))
        // this.gridAppFeatures = areaUtil.areaManage(newVal, areaStyle.gridStyle, layerConfig.gridAppType)
      }
    },
    // 单个楼宇信息
    buildData(val) {
      if (this.appPageDetail === 'patrolConver') {
        // 解决点击巡更汇聚的点位时弹出楼宇的信息框
        return
      }
      if (val) {
        let alarmingBuild = appAlarm.getFeatureByattr(this.appAlarmingList, 'bid', val._id)
        if (!alarmingBuild) {
          this.$store.commit('SET_APPDETAIL_STATE', '')
          this.centerTurn(val)
          let oneBuildStic = this.getBuildStatData(val._id)
          let oneBuildLsvel = this.getLevel(val._id)
          Promise.all([oneBuildStic, oneBuildLsvel])
            .then(res => {
              this.$store.commit('SET_APPDETAIL_STATE', 'buildApp')
              this.$store.commit('SET_ISAPPOUTER_STATE', true)
            })
            .catch(err => {
              this.errorMsg('参数获取失败')
              console.log(err)
            })
        }
        // let newVal = JSON.parse(JSON.stringify([val]))
        // this.buildAppFeatures = areaUtil.areaManage(newVal, areaStyle.buildStyle, layerConfig.buildAppType)
      }
    },
    isCloseAllGrid(val) {
      if (val) {
        this.gridAppFeatures = []
        if (this.appPageDetail === 'gridApp') {
          this.$store.commit('SET_APPDETAIL_STATE', '')
        }
      }
    },
    isCloseAllBuild(val) {
      if (val) {
        this.buildAppFeatures = []
        if (this.appPageDetail === 'buildApp') {
          this.$store.commit('SET_APPDETAIL_STATE', '')
        }
      }
    },
    levelData(data) {
      if (!data) {
        return
      }
      // this.$store.commit('SET_ISAPPOUTER_STATE', false) // 切换到楼层内
      // this.$store.commit('SET_ISOUTER_STATE', true) // 切换到楼层内
      this.activeMapCenter = null
      let val = JSON.parse(JSON.stringify(data))
      this.$store.commit('SET_APPDETAIL_STATE', '')
      // let levelCenter = val.bid.center.split(',').map(item => Number(item))
      // let levelExtent = val.bid.scope.split(',').map(item => Number(item))
      // let extent = [parseFloat(levelExtent[0]), parseFloat(levelExtent[1]), parseFloat(levelExtent[2]), parseFloat(levelExtent[3])]
      // if (parseFloat(levelExtent[0]) > parseFloat(levelExtent[2])) {
      //   extent = [parseFloat(levelExtent[2]), parseFloat(levelExtent[1]), parseFloat(levelExtent[0]), parseFloat(levelExtent[3])]
      // }
      // if (parseFloat(levelExtent[1]) > parseFloat(levelExtent[3])) {
      //   extent = [parseFloat(levelExtent[2]), parseFloat(levelExtent[3]), parseFloat(levelExtent[0]), parseFloat(levelExtent[1])]
      // }
      // this.floorData.center = [parseFloat(levelCenter[0]), parseFloat(levelCenter[1])]
      // this.floorData.extent = extent
      // this.floorData.zoom = data.class
      // this.$nextTick(() => {
      //   this.$refs.mapFloorContainer.setLevel(20)
      // })
      // this.floorData.center = levelCenter
      // this.floorData.extent = levelExtent
      // this.floorData.zoom = data.class
      // this.floorData.mapUrl = '/api/upload?id=' + val.picture.id
      let oneBuildLeval = this.getLevel(val.bid._id) // 获取当前楼宇下的所有楼层
      let oneFloorLsvel = this.getFloorStatData(val._id) // 获取当前楼层统计信息
      let oneFloorResources = this.getFloorResources(val._id) // 获取当前楼层的所有视频资源
      let oneFloorAlarm = this.getOneFloorArarlList(val._id) // 获取当前楼层的所有报警
      let oneFloorPatrol = this.getOneFloorPatrolList(val._id) // 获取当前楼层的所有巡更点位
      let oneFloorCommonAlarm = this.getOneFloorCommonAlarm(val._id) // 获取当前楼层的所有普通报警
      Promise.all([oneBuildLeval, oneFloorResources, oneFloorLsvel, oneFloorPatrol, oneFloorAlarm, oneFloorCommonAlarm])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    }
  },
  methods: {
    ...mapActions([
      'getOneGrid',
      'getOneBuild',
      'getLevel',
      'getStatData',
      'getGridStatData',
      'getBuildStatData',
      'getFloorResources',
      'getFloorStatData',
      'getOneFloorPatrolList',
      'getOneFloorArarlList',
      'getOneFloorCommonAlarm'
    ]),
    ...mapMutations(['SET_APPDETAIL_STATE', 'SET_MAPSTATIC_STATE', 'SET_MEASURE_ACTIVE']),
    // 胡红勋添加-----半闭合方法
    queryBuilding(obj) {
      if (!this.isCloseAllBuild) {
        return
      }
      let buildlist = JSON.parse(JSON.stringify(this.oneMapBuildList))
      if (buildlist.length > 0) {
        let res = areaUtil.findBuildingByExtent(buildlist, obj)
        if (res.flag) {
          const building = res.info
          if (this.buildingInfo) {
            if (this.buildingInfo._id === building._id) {
              return
            } else {
              this.buildingInfo = building
            }
          } else {
            this.buildingInfo = building
          }
          this.buildAppFeatures = areaUtil.areaManage([building], areaStyle.buildStyle, layerConfig.buildAppType)
        } else {
          this.buildAppFeatures = []
          this.buildingInfo = null
        }
      }
    },
    selectGridEvt(id) {
      this.getOneGrid(id)
        .then(res => {
          this.$store.commit('SET_APPDETAIL_STATE', 'gridApp')
        })
        .catch(err => {
          this.errorMsg('参数获取失败')
          console.log(err)
        })
    },
    selectBuildEvt(id) {
      this.getOneBuild(id)
        .then(res => {})
        .catch(err => {
          this.errorMsg('参数获取失败')
          console.log(err)
        })
    },
    // 统计
    statisticsApp(val) {
      this.$store.commit('SET_MAPSTATIC_STATE', false)
      this.getStatData(val.wkt)
        .then(res => {
          let online = res.data.camera.online
          let offline = res.data.camera.offline
          let building = res.data.building
          let grid = res.data.grid
          this.statChartOptions = appStatis.addStaticPop({ online, offline, building, grid })
          this.statModal = true
          this.$refs.mapAppContainer[0].clearLayerFeatures(this.statistics.id)
        })
        .catch(err => {
          this.errorMsg('统计错误')
          console.log(err)
          this.$refs.mapAppContainer[0].clearLayerFeatures(this.statistics.id)
        })
    }
  },
  beforeDestroy() {
    this.buildAppFeatures = []
    this.gridAppFeatures = []
    this.$store.commit('GET_ONELEVEL_DATA', null) // 清除楼层的信息
  }
}
</script>
