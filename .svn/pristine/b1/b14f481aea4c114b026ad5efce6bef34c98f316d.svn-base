<!--应用模式 视频点位业务逻辑-->
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appIpc from '../../../../../assets/map/app/appIpc'
export default {
  watch: {
    // 当前地图上所有的点位
    oneMapPointList(val) {
      console.log(val, 'val')
      this.addVedio(val)
      this.controlVedioShowByZoom(this.currentZoom)
    },
    // 视频点位图层数组
    appVedioIpcList(vedioFeatures) {
      console.log('vedioFeatures', vedioFeatures)
      this.videoIpcFeatures = JSON.parse(JSON.stringify(vedioFeatures))
    },
    // 视频可视域图层数组
    appVedioSectorList(sectorFeatures) {
      this.sectorFeatures = JSON.parse(JSON.stringify(sectorFeatures))
    },
    // 楼层和地图的切换监听
    isAppOuter(val) {
      if (val) {
        this.addVedio(this.oneMapPointList)
      } else {
        this.addVedio(this.floorVedioResourceList)
      }
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    // 楼层中的视频点位资源
    floorVedioResourceList(val) {
      this.addVedio(val)
    },
    // 点击点位获取视频点位，居中
    pointData(val) {
      if (!val) {
        return
      }
      if (!val.mapsign) {
        this.$store.commit('SET_APPDETAIL_STATE', 'pointApp')
        // let center = this.oneMapInfo.center
        // this.posi = { lon: center[0], lat: center[1] }
      }
    },
    // 视频点位离线、在线状态推送
    appVedioIpcStatusList(val) {
      this.addVedio(val)
    }
  },
  computed: {
    ...mapState({
      appVedioIpcStatusList: ({ mapVedioData }) => mapVedioData.appVedioIpcStatusList,
      pointData: ({ mapGisData }) => mapGisData.pointData,
      // oneMapInfo: ({ mapGisData }) => mapGisData.oneMapInfo,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      appVedioIpcList: ({ mapVedioData }) => mapVedioData.appVedioIpcList,
      appVedioSectorList: ({ mapVedioData }) => mapVedioData.appVedioSectorList,
      oneMapPointList: ({ mapGisData }) => mapGisData.oneMapPointList, // 单个地图点位列表
      floorVedioResourceList: ({ mapVedioData }) => mapVedioData.floorVedioResourceList,
      appVedioIpcInMapList: ({ mapVedioData }) => mapVedioData.appVedioIpcInMapList,
      appVedioSectorInMapList: ({ mapVedioData }) => mapVedioData.appVedioSectorInMapList,
      appCheckList: ({ mapVedioData }) => mapVedioData.appCheckList
    })
  },
  methods: {
    ...mapActions(['getOnePoint']),
    ...mapMutations([
      'SET_APPVEDIOIPC_LIST',
      'SET_APPVEDIOSECTOR_LIST',
      'SET_APPVEDIOIPCINMAP_LIST',
      'SET_APPVEDIOSECTORINMAP_LIST',
      'SET_APPDETAIL_STATE',
      'SET_APPDETAIL_STATE'
    ]),
    // 根据地图放大级别显示或隐藏视频点位
    controlVedioShowByZoom(zoom) {
      let vedioSectors = appIpc.checkVedioByType({
        vedioList: this.appVedioIpcInMapList,
        sectorList: this.appVedioSectorInMapList,
        checkList: this.appCheckList
      })
      let vediolist = appIpc.controlVedioVisibleByLevel(vedioSectors.vediolist, zoom)
      if (this.appCheckList.indexOf('sector') > -1) {
        let sectorlist = appIpc.controlVedioVisibleByLevel(vedioSectors.sectorlist, zoom)
        this.$store.commit('SET_APPVEDIOSECTOR_LIST', sectorlist)
      }
      console.log('1', vediolist)
      this.$store.commit('SET_APPVEDIOIPC_LIST', vediolist)
    },
    // 视频点位可视域半开启功能
    queryVedio(obj) {
      if (this.appCheckList.indexOf('sector') <= -1) {
        let vedioArray = JSON.parse(JSON.stringify(this.videoIpcFeatures))
        let result = appIpc.findVedioSectorByPosition(vedioArray, obj, this.currentZoom)
        let sectorlist = []
        if (result.flag) {
          let sectorsInMap = JSON.parse(JSON.stringify(this.appVedioSectorInMapList))
          let id = result.info.attributes.id
          let sector = appIpc.getFeatureById(sectorsInMap, id)
          sectorlist = [sector]
        } else {
          sectorlist = []
        }
        this.$store.commit('SET_APPVEDIOSECTOR_LIST', sectorlist)
      }
    },
    // 视频点位的点击事件
    selectVdeio(id) {
      this.$store.commit('SET_APPDETAIL_STATE', '')
      this.getOnePoint(id)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // 加载已入库的视频点位
    addVedio(array) {
      let vediolist = appIpc.addVedio(array)
      let sectorlist = appIpc.addSector(array)
      this.$store.commit('SET_APPVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_APPVEDIOIPCINMAP_LIST', vediolist)
      this.$store.commit('SET_APPVEDIOSECTORINMAP_LIST', sectorlist)
      console.log('1', vediolist)
    },
    // 保存视频点位和可视域
    commitVediosAndSectors(vediolist, sectorlist) {
      this.$store.commit('SET_APPVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_APPVEDIOIPCINMAP_LIST', vediolist)
      this.$store.commit('SET_APPVEDIOSECTOR_LIST', sectorlist)
      this.$store.commit('SET_APPVEDIOSECTORINMAP_LIST', sectorlist)
    }
  },
  beforeDestroy() {
    console.log('1')
    // 清空视频点位和可视域图层数组
    this.$store.commit('SET_APPVEDIOIPC_LIST', [])
    this.$store.commit('SET_APPVEDIOIPCINMAP_LIST', [])
    this.$store.commit('SET_APPVEDIOSECTOR_LIST', [])
    this.$store.commit('SET_APPVEDIOSECTORINMAP_LIST', [])
  }
}
</script>
