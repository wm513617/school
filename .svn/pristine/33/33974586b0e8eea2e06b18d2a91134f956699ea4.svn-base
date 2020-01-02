// 视频图层
import { mapGetters, mapActions, mapMutations } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
import { VIDEOTYPEKEY, FEATURETYPE, CAMERATYPE, DEFAULTOPS } from 'assets/2DMap/meta/common'
export default {
  data() {
    return {
      boltipcLayer: layerConfig.boltipc, // 枪机
      boltipcSectorLayer: layerConfig.boltipcSector,
      halfBallipcLayer: layerConfig.halfBallipc, // 半球
      halfBallipcSectorLayer: layerConfig.halfBallipcSector,
      fastBallipcLayer: layerConfig.fastBallipc, // 快球
      fastBallipcSectorLayer: layerConfig.fastBallipcSector,
      allViewipcLayer: layerConfig.allViewipc, // 全景
      allViewipcSectorLayer: layerConfig.allViewipcSector,
      redBoltipcLayer: layerConfig.redBoltipc, // 红外枪机
      redBoltipcSectorLayer: layerConfig.redBoltipcSector,
      verfaceipcLayer: layerConfig.verfaceipc, // 人脸抓拍
      verfaceipcSectorLayer: layerConfig.verfaceipcSector,
      trafficipcLayer: layerConfig.trafficipc, // 交通抓拍
      trafficipcSectorLayer: layerConfig.trafficipcSector
    }
  },
  computed: {
    ...mapGetters({
      sectorChecked: 'videoEditSectorChecked', // 视频编辑时覆盖区域是否勾选
      videoPoint: 'videoEditPointData', // 视频编辑点位信息
      boltipcResources: 'boltipcResourceArr', // 枪机资源数组
      boltipcs: 'boltipcFeatures', // 枪机要素
      boltipcSectors: 'boltipcSectorFeatures', // 枪机覆盖区域要素
      halfBallipcResources: 'halfBallipcResourceArr', // 半球资源数组
      halfBallipcs: 'halfBallipcFeatures', // 半球要素
      halfBallipcSectors: 'halfBallipcSectorFeatures', // 半球覆盖区域要素
      fastBallipcResources: 'fastBallipcResourceArr', // 快球资源数组
      fastBallipcs: 'fastBallipcFeatures', // 快球要素
      fastBallipcSectors: 'fastBallipcSectorFeatures', // 快球覆盖区域要素
      allViewipcResources: 'allViewipcResourceArr', // 全景资源数组
      allViewipcs: 'allViewipcFeatures', // 全景要素
      allViewipcSectors: 'allViewipcSectorFeatures', // 全景覆盖区域要素
      redBoltipcResources: 'redBoltipcResourceArr', // 红外枪机资源数组
      redBoltipcs: 'redBoltipcFeatures', // 红外枪机要素
      redBoltipcSectors: 'redBoltipcSectorFeatures', // 视频覆盖区域要素
      verfaceipcResources: 'verfaceipcResourceArr', // 人脸抓拍资源数组
      verfaceipcs: 'verfaceipcFeatures', // 脸抓拍要素
      verfaceipcSectors: 'verfaceipcSectorFeatures', // 人脸抓拍覆盖区域要素
      trafficipcResources: 'trafficipcResourceArr', // 交通抓拍资源数组
      trafficipcs: 'trafficipcFeatures', // 交通抓拍要素
      trafficipcSectors: 'trafficipcSectorFeatures' // 交通抓拍覆盖区域要素
    }),
    querySubVideosFun() {
      return this.isMapOuter ? this.loadSubVideosByMapId : this.loadSubVideosByFloorId
    }
  },
  watch: {
    boltipcResources: { // 枪机
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.isBoltipc) // 控制枪机显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.isBoltipc) // 控制枪机可视域显隐
      },
      deep: true
    },
    halfBallipcResources: { // 半球
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.isHalfBallipc) // 控制半球显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.isHalfBallipc) // 控制半球可视域显隐
      },
      deep: true
    },
    fastBallipcResources: { // 快球
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.isFastBallipc) // 控制快球显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.isFastBallipc) // 控制快球可视域显隐
      },
      deep: true
    },
    allViewipcResources: { // 全景
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.isAllViewipc) // 控制全景显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.isAllViewipc) // 控制全景可视域显隐
      },
      deep: true
    },
    redBoltipcResources: { // 红外枪机
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.isRedBoltipc) // 控制红外枪机显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.isRedBoltipc) // 控制红外枪机可视域显隐
      },
      deep: true
    },
    verfaceipcResources: { // 人脸抓拍
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.isVerface) // 控制人脸抓拍显隐
        this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.isVerface) // 控制人脸抓拍可视域显隐
      },
      deep: true
    },
    trafficipcResources: { // 交通抓拍
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.isTraffic) // 控制交通抓拍显隐
        this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.isTraffic) // 控制交通抓拍可视域显隐
      },
      deep: true
    },
    isBoltipc(flag) { // 视频-枪机显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, flag) // 控制枪机显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, flag) // 控制枪机可视域显隐
    },
    isHalfBallipc(flag) { // 视频-半球显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, flag) // 控制半球显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, flag) // 控制半球可视域显隐
    },
    isFastBallipc(flag) { // 视频-快球显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, flag) // 控制快球显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, flag) // 控制快球可视域显隐
    },
    isAllViewipc(flag) { // 视频-全景显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, flag) // 控制全景显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, flag) // 控制全景可视域显隐
    },
    isRedBoltipc(flag) { // 视频-红外枪机显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, flag) // 控制红外枪机显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, flag) // 控制红外枪机可视域显隐
    },
    isVerface(flag) { // 视频-人脸抓拍显隐
      this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, flag) // 控制人脸抓拍显隐
      this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, flag) // 控制人脸抓拍可视域显隐
    },
    isTraffic(flag) { // 视频-交通抓拍显隐
      this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, flag) // 控制交通抓拍显隐
      this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, flag) // 控制交通抓拍可视域显隐
    },
    isSector(flag) { // 可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.isBoltipc) // 控制枪机可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.isHalfBallipc) // 控制半球可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.isFastBallipc) // 控制快球可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.isAllViewipc) // 控制全景可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.isRedBoltipc) // 控制红外枪机可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.isVerface) // 控制人脸抓拍可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.isTraffic) // 控制交通抓拍可视域显隐
    }
  },
  methods: {
    ...mapMutations([
      'SET_DEFAULT_POINT_ICON', // 设置默认点位图标
      'SET_SELECTED_MAP_POINT_RES' // 设置地图选中的点位资源
    ]),
    ...mapActions([
      'loadSubVideosByMapId',
      'loadSubVideosByFloorId',
      'setBoltipcResourceArr', // 枪机
      'setBoltipcFeatures',
      'setBoltipcSectorFeatures',
      'setHalfBallipcResourceArr', // 半球
      'setHalfBallipcFeatures',
      'setHalfBallipcSectorFeatures',
      'setFastBallipcResourceArr', // 快球
      'setFastBallipcFeatures',
      'setFastBallipcSectorFeatures',
      'setAllViewipcResourceArr', // 全景
      'setAllViewipcFeatures',
      'setAllViewipcSectorFeatures',
      'setRedBoltipcResourceArr', // 红外枪机
      'setRedBoltipcFeatures',
      'setRedBoltipcSectorFeatures',
      'setVerfaceipcResourceArr', // 人脸抓拍
      'setVerfaceipcFeatures',
      'setVerfaceipcSectorFeatures',
      'setTrafficipcResourceArr', // 交通抓拍
      'setTrafficipcFeatures',
      'setTrafficipcSectorFeatures'
    ]),
    loadVideoResources() { // 加载查询视频数据
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc) // 普通ipc
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc)
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc)
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc)
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc)
      this.loadQuerySubVideos(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc) // 人脸抓拍
      this.loadQuerySubVideos(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc) // 交通抓拍
    },
    loadQuerySubVideos(monitoryPointGenera, monitortype) { // 加载查询的视频数据
      let query = {}
      typeof monitoryPointGenera !== 'undefined' && (query.monitoryPointGenera = monitoryPointGenera) // 监控业务类型（0：普通ipc、1：人脸抓拍、2：交通抓拍）
      typeof monitortype !== 'undefined' && (query.monitortype = monitortype) // 监控类型（0：枪机、1：红外:2：半球、3：快球、4：全景）
      if (this.isMapOuter && this.activeMapConfig.mapId) {
        query.mapId = this.activeMapConfig.mapId
      } else if (this.currentFloor._id) {
        query.floorId = this.currentFloor._id
      }
      this.querySubVideosFun(query)
    },
    macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, featureType) { // 匹配要素设置函数
      let setFeaturesFun = this.setBoltipcFeatures
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            setFeaturesFun = this.setBoltipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setBoltipcSectorFeatures
            }
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            setFeaturesFun = this.setHalfBallipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setHalfBallipcSectorFeatures
            }
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            setFeaturesFun = this.setFastBallipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setFastBallipcSectorFeatures
            }
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            setFeaturesFun = this.setAllViewipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setAllViewipcSectorFeatures
            }
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            setFeaturesFun = this.setRedBoltipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setRedBoltipcSectorFeatures
            }
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        setFeaturesFun = this.setVerfaceipcFeatures
        if (featureType === FEATURETYPE.geometry) { // 可视域
          setFeaturesFun = this.setVerfaceipcSectorFeatures
        }
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        setFeaturesFun = this.setTrafficipcFeatures
        if (featureType === FEATURETYPE.geometry) { // 可视域
          setFeaturesFun = this.setTrafficipcSectorFeatures
        }
      }
      return setFeaturesFun
    },
    matchVideoResourceArr(monitoryPointGenera, monitortype) { // 匹配视频子类型资源数据
      let resourceArr = []
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            resourceArr = this.boltipcResources
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            resourceArr = this.halfBallipcResources
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            resourceArr = this.fastBallipcResources
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            resourceArr = this.allViewipcResources
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            resourceArr = this.redBoltipcResources
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        resourceArr = this.verfaceipcResources
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        resourceArr = this.trafficipcResources
      }
      return resourceArr
    },
    matchVideoFeatureArr(monitoryPointGenera, monitortype, featureType = FEATURETYPE.icon) { // 匹配视频子类型要素数据
      let featureArr = []
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            featureArr = this.boltipcs
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureArr = this.boltipcSectors
            }
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            featureArr = this.halfBallipcs
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureArr = this.halfBallipcSectors
            }
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            featureArr = this.fastBallipcs
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureArr = this.fastBallipcSectors
            }
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            featureArr = this.allViewipcs
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureArr = this.allViewipcSectors
            }
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            featureArr = this.redBoltipcs
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureArr = this.redBoltipcSectors
            }
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        featureArr = this.verfaceipcs
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureArr = this.verfaceipcSectors
        }
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        featureArr = this.trafficipcs
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureArr = this.trafficipcSectors
        }
      }
      return featureArr
    },
    matchSubVideoState(monitoryPointGenera, monitortype) { // 匹配视频子类型显隐状态
      let flag = false
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            flag = this.isBoltipc
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            flag = this.isHalfBallipc
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            flag = this.isFastBallipc
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            flag = this.isAllViewipc
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            flag = this.isRedBoltipc
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        flag = this.isVerface
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        flag = this.isTraffic
      }
      return flag
    },
    macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType = FEATURETYPE.icon) { // 匹配视频要素要素
      let featureLayer = this.boltipcLayer
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            featureLayer = this.boltipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.boltipcSectorLayer
            }
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            featureLayer = this.halfBallipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.halfBallipcSectorLayer
            }
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            featureLayer = this.fastBallipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.fastBallipcSectorLayer
            }
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            featureLayer = this.allViewipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.allViewipcSectorLayer
            }
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            featureLayer = this.redBoltipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.redBoltipcSectorLayer
            }
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        featureLayer = this.verfaceipcLayer
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureLayer = this.verfaceipcSectorLayer
        }
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        featureLayer = this.trafficipcLayer
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureLayer = this.trafficipcSectorLayer
        }
      }
      return featureLayer
    },
    controlSubVideoShow(monitoryPointGenera, monitortype, visible) { // 控制视频子类型显隐
      let setFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.icon) // 匹配视频子类型要素设置函数
      if (visible) {
        this.loadSubVideoFeatures(monitoryPointGenera, monitortype, setFeaturesFun, FEATURETYPE.icon) // 转换视频子类型数据
      } else {
        setFeaturesFun([])
      }
    },
    loadSubVideoFeatures(monitoryPointGenera, monitortype, setFeaturesFun, featureType) { // 转换视频子类型数据
      let resourceArr = this.matchVideoResourceArr(monitoryPointGenera, monitortype) // 匹配视频子类型资源数据
      let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) // 匹配视频子类型名称图层
      let resourceArrCp = JSON.parse(JSON.stringify(resourceArr))
      let features = videoTrans.transIconFeatures(resourceArrCp, featureLayer)
      setFeaturesFun(features)
    },
    controlSubVideoSectorShow(monitoryPointGenera, monitortype, iconVisible) { // 控制视频子类型可视域显隐
      let setFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.geometry) // 匹配视频子类型要素设置函数
      if (iconVisible && this.isSector) {
        this.loadSubVideoSectorFeatures(monitoryPointGenera, monitortype, setFeaturesFun, FEATURETYPE.geometry) // 转换视频子类型可视域要素数据
      } else {
        setFeaturesFun([])
      }
    },
    loadSubVideoSectorFeatures(monitoryPointGenera, monitortype, setFeaturesFun, featureType) { // 转换视频子类型可视域要素数据
      let resourceArr = this.matchVideoResourceArr(monitoryPointGenera, monitortype) // 匹配视频子类型资源数据
      let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) // 匹配视频子类型名称图层
      let resourceArrCp = JSON.parse(JSON.stringify(resourceArr))
      let sectorFeatures = videoTrans.transSectorFeatures(resourceArrCp, featureLayer)
      setFeaturesFun(sectorFeatures)
    },
    refreshCurrentVideoFeature(video) { // 刷新当前视频要素
      let page = this.mapEditRightPage.page
      let {monitoryPointGenera, monitortype} = video
      monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
      let subVideoState = this.matchSubVideoState(monitoryPointGenera, monitortype) // 设置可视域要素函数
      let subVideoIcons = this.matchVideoFeatureArr(monitoryPointGenera, monitortype, FEATURETYPE.icon) // 图标要素
      let iconFeatureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, FEATURETYPE.icon) // 图标图层
      let setIconFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, video.monitortype, FEATURETYPE.icon) // 设置图标要素函数
      let subVideoSectors = this.matchVideoFeatureArr(monitoryPointGenera, monitortype, FEATURETYPE.geometry) // 可视域要素
      let sectorFeatureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, FEATURETYPE.geometry) // 可视域图册
      let setSectorsFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.geometry) // 设置可视域要素函数
      if (page === 'videoPage' || subVideoState) { // 编辑视频资源或显示视频要素时，还原视频要素
        let videoArr = subVideoIcons.filter(item => item.attributes.id !== video._id)
        if (subVideoState || video._id === this.selectedPointRes._id) { // 显示视频要素或当前视频是地图选中的点位数据时
          let videoFeature = videoTrans.transOneIconFeature(video, iconFeatureLayer)
          videoArr.push(videoFeature)
        }
        setIconFeaturesFun(videoArr)
      } else { // 不显示视频要素时，清空要素
        setIconFeaturesFun([])
      }
      if (this.isSector || this.sectorChecked) { // 显示所有可视域或显示当前编辑视频可视域时
        let clonedVideo = JSON.parse(JSON.stringify(video))
        if (this.videoPoint) {
          clonedVideo.point = JSON.parse(JSON.stringify(this.videoPoint))
          clonedVideo.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : video.point.loc
        }
        let sectorArr = subVideoSectors.filter(item => item.attributes.id !== clonedVideo._id)
        let sectorFeature = videoTrans.transOneSectorFeature(clonedVideo, sectorFeatureLayer)
        sectorArr.push(sectorFeature)
        setSectorsFeaturesFun(sectorArr)
      } else { // 不显示可视域时，清空要素
        setSectorsFeaturesFun([])
      }
    },
    addVideoResToMap(coods) { // 添加视频资源到地图中
      if (this.$context2D) {
        let level = Math.floor(this.$context2D.map.getView().getZoom())
        let firm = (this.selectedPointRes && this.selectedPointRes.eid && this.selectedPointRes.eid.manufacturer) ? this.selectedPointRes.eid.manufacturer : '-'
        let radius = this.isMapOuter ? 50 : 10
        let monitortype = this.selectedPointRes.monitortype
        let point = {
          class: level, // 点位层级
          firm, // 厂商
          principal: [{ name: '', mobile: '' }], // 联系方式
          loc: coods.toString(), // 经纬度
          radius, // 照射半径
          angle: DEFAULTOPS.ballIpcTypes.includes(monitortype) ? DEFAULTOPS.ballIpcAdjustAngle : 0, // 点位角度
          viewshed: 90, // 可视域
          isouter: this.isMapOuter,
          projection: this.mapProjection // 当前地图投影坐标系
        }
        if (this.activeMapConfig && this.activeMapConfig.mapId) {
          point.mapId = this.activeMapConfig.mapId // 地图标识
        }
        if (this.currentFloor) {
          point.bid = this.currentFloor.bid._id // 楼宇标识
          point.sid = this.currentFloor._id // 楼层标识
        }
        let videoData = JSON.parse(JSON.stringify(this.selectedPointRes))
        videoData.point = point
        this.saveCommonPointRes({ _id: videoData._id, body: videoData }).then(res => {
          this.SET_DEFAULT_POINT_ICON(null) // 设置默认点位图标文件
          this.SET_SELECTED_MAP_POINT_RES(null) // 设置当前地图选中的点位资源
          this.SET_POINT_DRAW_ACTIVE(false) // 关闭点位绘制状态
          let {monitortype, monitoryPointGenera} = videoData
          monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
          this.loadQuerySubVideos(monitoryPointGenera, monitortype) // 加载子视频资源
          let counter = {optTab: 'video', count: this.editTreeChangeCounter.count + 1}
          this.changeEditTreeChangeCounter(counter) // 改变编辑树计数器状态
          this.successMsg('视频点位添加成功')
        }).catch(err => {
          this.$Modal.confirm({
            title: '警告',
            content: '<p>' + err.response.data.message + '</p>'
          })
        })
      }
    }
  }
}
