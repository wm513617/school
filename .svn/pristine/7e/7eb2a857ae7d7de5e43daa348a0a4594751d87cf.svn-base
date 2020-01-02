// 巡更、单兵图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import transPatrol from 'assets/2DMap/feature/edit/patrol'
export default {
  data() {
    return {
      patrolLayer: layerConfig.patrol
    }
  },
  computed: {
    ...mapGetters({
      patrolResources: 'patrolResourceArr', // 巡更资源数据
      patrols: 'patrolFeatures' // 巡更要素
    }),
    queryPatrolsFun() { // 查询巡更数据函数
      return this.isMapOuter ? this.loadPatrolsByMapId : this.loadPatrolByFloorId
    }
  },
  watch: {
    isPatrol(flag) { // 巡更点位显隐
      if (flag) {
        this.loadPatrolFeatures() // 加载巡更点位要素
      } else {
        this.setPatrolFeatures([])
      }
    },
    patrolResources: {
      handler(arr) {
        this.isPatrol && this.loadPatrolFeatures() // 加载巡更点位要素数据
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'loadPatrolsByMapId',
      'loadPatrolByFloorId',
      'setPatrolFeatures',
      'savePatrolPointRes',
      'getPatrolPointTree'
    ]),
    loadPatrolResources() { // 加载巡更点位资源
      let query = ''
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query = this.activeMapConfig.mapId
      } else { // 楼层地图，根据楼层标识加载
        query = this.currentFloor._id
      }
      this.queryPatrolsFun(query)
    },
    loadPatrolFeatures() { // 加载巡更点位要素
      let patrolFeatures = transPatrol.transFeatures(this.patrolResources, this.patrolLayer)
      this.setPatrolFeatures(patrolFeatures)
    },
    initCurrentPatrolFeature(patrol) { // 初始化当前巡更要素
      let page = this.mapEditRightPage.page
      if (page === 'patrolEditPage' && !this.isPatrol) { // 编辑巡更资源并且不显示巡更要素时
        let copyedData = JSON.parse(JSON.stringify(patrol))
        let patrolFeature = transPatrol.transOneFeature(copyedData, this.patrolLayer)
        this.setPatrolFeatures([patrolFeature])
      }
    },
    refreshCurrentPatrolFeature(patrol) { // 刷新当前巡更要素
      let page = this.mapEditRightPage.page
      if (page === 'patrolEditPage' || this.isPatrol) { // 编辑巡更资源或显示巡更要素时
        let patrolArr = this.patrols.filter(item => item.attributes.id !== patrol._id)
        if (this.isPatrol || patrol._id === this.selectedPointRes._id) { // 显示巡更要素或当前巡更数据是当前地图选择的数据时，添加当前巡更要素
          let patrolFeature = transPatrol.transOneFeature(patrol, this.patrolLayer)
          patrolFeature && patrolArr.push(patrolFeature)
        }
        this.setPatrolFeatures(patrolArr)
      } else {
        this.setPatrolFeatures([])
      }
    },
    addPatrolResToMap(coods) { // 添加巡更资源到地图中.
      let point = {
        geo: coods.toString(), // 经纬度
        projection: this.mapProjection // 当前地图投影坐标系
      }
      if (this.activeMapConfig && this.activeMapConfig.mapId) {
        point.mapid = this.activeMapConfig.mapId // 地图标识
      }
      if (this.currentFloor) {
        point.bid = this.currentFloor.bid._id // 楼宇标识
        point.sid = this.currentFloor._id // 楼层标识
      }
      let resData = JSON.parse(JSON.stringify(this.selectedPointRes))
      resData.point = point
      this.savePatrolPointRes(resData).then(res => {
        this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
        this.SET_SELECTED_MAP_POINT_RES(null) // 设置当前地图选中的点位资源
        this.loadPatrolResources() // 加载消防报警资源
        let query = (!this.isMapOuter && this.currentFloor) ? this.currentFloor._id : null // 查询条件
        this.getPatrolPointTree(query) // 加载视频资源树
        this.successMsg('巡更点位添加成功')
      }).catch(err => {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>' + err.response.data.message + '</p>'
        })
      })
    }
  }
}
