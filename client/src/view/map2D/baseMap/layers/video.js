// 视频图层
import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/apply/video'
import featureBase from 'assets/2DMap/feature/base'
import { VIDEOTYPEKEY, FEATURETYPE, VIDEOICONLAYERMAP, CAMERATYPE } from 'assets/2DMap/meta/common'
export default {
  data() {
    return {
      boltipcLayer: layerConfig.boltipc, // 枪机
      boltipcSectorLayer: layerConfig.boltipcSector,
      boltipcLabelLayer: layerConfig.boltipcLabel,
      halfBallipcLayer: layerConfig.halfBallipc, // 半球
      halfBallipcSectorLayer: layerConfig.halfBallipcSector,
      halfBallipcLabelLayer: layerConfig.halfBallipcLabel,
      fastBallipcLayer: layerConfig.fastBallipc, // 快球
      fastBallipcSectorLayer: layerConfig.fastBallipcSector,
      fastBallipcLabelLayer: layerConfig.fastBallipcLabel,
      allViewipcLayer: layerConfig.allViewipc, // 全景
      allViewipcSectorLayer: layerConfig.allViewipcSector,
      allViewipcLabelLayer: layerConfig.allViewipcLabel,
      redBoltipcLayer: layerConfig.redBoltipc, // 红外枪机
      redBoltipcSectorLayer: layerConfig.redBoltipcSector,
      redBoltipcLabelLayer: layerConfig.redBoltipcLabel,
      verfaceipcLayer: layerConfig.verfaceipc, // 人脸抓拍
      verfaceipcSectorLayer: layerConfig.verfaceipcSector,
      verfaceipcLabelLayer: layerConfig.verfaceipcLabel,
      trafficipcLayer: layerConfig.trafficipc, // 交通抓拍
      trafficipcSectorLayer: layerConfig.trafficipcSector,
      trafficipcLabelLayer: layerConfig.trafficipcLabel
    }
  },
  computed: {
    ...mapGetters({
      boltipcResources: 'boltipcResourceArr', // 枪机资源数组
      boltipcs: 'boltipcFeatures', // 枪机要素
      boltipcSectors: 'boltipcSectorFeatures', // 枪机覆盖区域要素
      boltipcLabels: 'boltipcLabelFeatures', // 枪机名称要素
      halfBallipcResources: 'halfBallipcResourceArr', // 半球资源数组
      halfBallipcs: 'halfBallipcFeatures', // 半球要素
      halfBallipcSectors: 'halfBallipcSectorFeatures', // 半球覆盖区域要素
      halfBallipcLabels: 'halfBallipcLabelFeatures', // 半球名称要素
      fastBallipcResources: 'fastBallipcResourceArr', // 快球资源数组
      fastBallipcs: 'fastBallipcFeatures', // 快球要素
      fastBallipcSectors: 'fastBallipcSectorFeatures', // 快球覆盖区域要素
      fastBallipcLabels: 'fastBallipcLabelFeatures', // 快球名称要素
      allViewipcResources: 'allViewipcResourceArr', // 全景资源数组
      allViewipcs: 'allViewipcFeatures', // 全景要素
      allViewipcSectors: 'allViewipcSectorFeatures', // 全景覆盖区域要素
      allViewipcLabels: 'allViewipcLabelFeatures', // 全景名称要素
      redBoltipcResources: 'redBoltipcResourceArr', // 红外枪机资源数组
      redBoltipcs: 'redBoltipcFeatures', // 视频要素
      redBoltipcSectors: 'redBoltipcSectorFeatures', // 视频覆盖区域要素
      redBoltipcLabels: 'redBoltipcLabelFeatures', // 视频名称要素
      verfaceipcResources: 'verfaceipcResourceArr', // 人脸抓拍资源数组
      verfaceipcs: 'verfaceipcFeatures', // 脸抓拍要素
      verfaceipcSectors: 'verfaceipcSectorFeatures', // 人脸抓拍覆盖区域要素
      verfaceipcLabels: 'verfaceipcLabelFeatures', // 视频名称要素
      trafficipcResources: 'trafficipcResourceArr', // 交通抓拍资源数组
      trafficipcs: 'trafficipcFeatures', // 交通抓拍要素
      trafficipcSectors: 'trafficipcSectorFeatures', // 交通抓拍覆盖区域要素
      trafficipcLabels: 'trafficipcLabelFeatures' // 视频名称要素
    }),
    ...mapGetters('mapAlarm', ['allVideoAlarmPointList', 'allVideoAlarmBuildList', 'sixTypeAlarmPointList']),
    ...mapGetters('map2DApplyIX', ['isPlatformTrack']),
    querySubVideosFun() {
      return this.isMapOuter ? this.loadSubVideosByMapId : this.loadSubVideosByFloorId
    }
  },
  watch: {
    boltipcResources: { // 枪机
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机名称显隐
      },
      deep: true
    },
    halfBallipcResources: { // 半球
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球名称显隐
      },
      deep: true
    },
    fastBallipcResources: { // 快球
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球名称显隐
      },
      deep: true
    },
    allViewipcResources: { // 全景
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景名称显隐
      },
      deep: true
    },
    redBoltipcResources: { // 红外枪机
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机显隐
        this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机名称显隐
      },
      deep: true
    },
    verfaceipcResources: { // 人脸抓拍
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍显隐
        this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍名称显隐
      },
      deep: true
    },
    trafficipcResources: { // 交通抓拍
      handler(arr) {
        this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍显隐
        this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍可视域显隐
        this.controlSubVideoLabelShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍名称显隐
      },
      deep: true
    },
    gun(flag) { // 视频-枪机显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, flag) // 控制枪机显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, flag) // 控制枪机可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, flag) // 控制枪机名称显隐
    },
    hemisphere(flag) { // 视频-半球显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, flag) // 控制半球显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, flag) // 控制半球可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, flag) // 控制半球名称显隐
    },
    fastBall(flag) { // 视频-快球显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, flag) // 控制快球显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, flag) // 控制快球可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, flag) // 控制快球名称显隐
    },
    panorama(flag) { // 视频-全景显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, flag) // 控制全景显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, flag) // 控制全景可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, flag) // 控制全景名称显隐
    },
    infraRed(flag) { // 视频-红外枪机显隐
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, flag) // 控制红外枪机显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, flag) // 控制红外枪机可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, flag) // 控制红外枪机名称显隐
    },
    verface(flag) { // 视频-人脸抓拍显隐
      this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍显隐
      this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍名称显隐
    },
    traffic(flag) { // 视频-交通抓拍显隐
      this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍显隐
      this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍名称显隐
    },
    visualField(flag) { // 可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机可视域显隐
      this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍名称显隐
      this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍名称显隐
    },
    mapZoom(zoom) { // 地图缩放级别
      console.log('地图缩放层级变化：', zoom)
      this.showVideoFeaturesByZoom() // 根据地图缩放层级显示视频要素
    },
    allVideoAlarmPointList() {
      this.alarmToFilterFeature()
    },
    allVideoAlarmBuildList() {
      this.alarmToFilterFeature()
    },
    isPlatformTrack() { // 地图是否是接力追踪模式
      this.trackLoadVideos()
    }
  },
  methods: {
    ...mapActions([
      'loadSubVideosByMapId',
      'loadSubVideosByFloorId',
      'setBoltipcResourceArr', // 枪机
      'setBoltipcFeatures',
      'setBoltipcSectorFeatures',
      'setBoltipcLabelFeatures',
      'setHalfBallipcResourceArr', // 半球
      'setHalfBallipcFeatures',
      'setHalfBallipcSectorFeatures',
      'setHalfBallipcLabelFeatures',
      'setFastBallipcResourceArr', // 快球
      'setFastBallipcFeatures',
      'setFastBallipcSectorFeatures',
      'setFastBallipcLabelFeatures',
      'setAllViewipcResourceArr', // 全景
      'setAllViewipcFeatures',
      'setAllViewipcSectorFeatures',
      'setAllViewipcLabelFeatures',
      'setRedBoltipcResourceArr', // 红外枪机
      'setRedBoltipcFeatures',
      'setRedBoltipcSectorFeatures',
      'setRedBoltipcLabelFeatures',
      'setVerfaceipcResourceArr', // 人脸抓拍
      'setVerfaceipcFeatures',
      'setVerfaceipcSectorFeatures',
      'setVerfaceipcLabelFeatures',
      'setTrafficipcResourceArr', // 交通抓拍
      'setTrafficipcFeatures',
      'setTrafficipcSectorFeatures',
      'setTrafficipcLabelFeatures'
    ]),
    showVideoFeaturesByZoom() { // 根据地图缩放层级显示视频要素
      const gun = this.isPlatformTrack ? true : this.gun
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, gun) // 控制枪机显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun) // 控制枪机名称显隐
      const hemisphere = this.isPlatformTrack ? true : this.hemisphere
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, hemisphere) // 控制半球显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere) // 控制半球名称显隐
      const fastBall = this.isPlatformTrack ? true : this.fastBall
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, fastBall) // 控制快球显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall) // 控制快球名称显隐
      const panorama = this.isPlatformTrack ? true : this.panorama
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, panorama) // 控制全景显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama) // 控制全景名称显隐
      const infraRed = this.isPlatformTrack ? true : this.infraRed
      this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, infraRed) // 控制红外枪机显隐
      this.controlSubVideoSectorShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed) // 控制红外枪机名称显隐
      const verface = this.isPlatformTrack ? true : this.verface
      this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, verface) // 控制人脸抓拍显隐
      this.controlSubVideoSectorShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface) // 控制人脸抓拍名称显隐
      const traffic = this.isPlatformTrack ? true : this.traffic
      this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, traffic) // 控制交通抓拍显隐
      this.controlSubVideoSectorShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍可视域显隐
      this.controlSubVideoLabelShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic) // 控制交通抓拍名称显隐
    },
    macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, featureType) { // 匹配要素设置函数
      let setFeaturesFun = this.setBoltipcFeatures
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            setFeaturesFun = this.setBoltipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setBoltipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setBoltipcLabelFeatures
            }
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            setFeaturesFun = this.setHalfBallipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setHalfBallipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setHalfBallipcLabelFeatures
            }
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            setFeaturesFun = this.setFastBallipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setFastBallipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setFastBallipcLabelFeatures
            }
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            setFeaturesFun = this.setAllViewipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setAllViewipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setAllViewipcLabelFeatures
            }
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            setFeaturesFun = this.setRedBoltipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setRedBoltipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setRedBoltipcLabelFeatures
            }
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        setFeaturesFun = this.setVerfaceipcFeatures
        if (featureType === FEATURETYPE.geometry) { // 可视域
          setFeaturesFun = this.setVerfaceipcSectorFeatures
        } else if (featureType === FEATURETYPE.label) { // 标注
          setFeaturesFun = this.setVerfaceipcLabelFeatures
        }
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        setFeaturesFun = this.setTrafficipcFeatures
        if (featureType === FEATURETYPE.geometry) { // 可视域
          setFeaturesFun = this.setTrafficipcSectorFeatures
        } else if (featureType === FEATURETYPE.label) { // 标注
          setFeaturesFun = this.setTrafficipcLabelFeatures
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
    macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) { // 匹配视频要素要素
      let featureLayer = this.boltipcLayer
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            featureLayer = this.boltipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.boltipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.boltipcLabelLayer
            }
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            featureLayer = this.halfBallipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.halfBallipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.halfBallipcLabelLayer
            }
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            featureLayer = this.fastBallipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.fastBallipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.fastBallipcLabelLayer
            }
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            featureLayer = this.allViewipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.allViewipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.allViewipcLabelLayer
            }
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            featureLayer = this.redBoltipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.redBoltipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.redBoltipcLabelLayer
            }
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        featureLayer = this.verfaceipcLayer
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureLayer = this.verfaceipcSectorLayer
        } else if (featureType === FEATURETYPE.label) { // 标注
          featureLayer = this.verfaceipcLabelLayer
        }
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        featureLayer = this.trafficipcLayer
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureLayer = this.trafficipcSectorLayer
        } else if (featureType === FEATURETYPE.label) { // 标注
          featureLayer = this.trafficipcLabelLayer
        }
      }
      return featureLayer
    },
    loadQueryVideos() { // 加载查询视频数据
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc) // 普通ipc
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc)
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc)
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc)
      this.loadQuerySubVideos(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc)
      this.loadQuerySubVideos(CAMERATYPE.verfaceipc) // 人脸抓拍
      this.loadQuerySubVideos(CAMERATYPE.trafficipc) // 交通抓拍
    },
    loadQuerySubVideos(monitoryPointGenera, monitortype) { // 加载查询的视频数据
      if (this.isBsMapReady) {
        let query = {}
        typeof monitoryPointGenera !== 'undefined' && (query.monitoryPointGenera = monitoryPointGenera) // 监控业务类型（0：普通ipc、1：人脸抓拍、2：交通抓拍）
        typeof monitortype !== 'undefined' && (query.monitortype = monitortype) // 监控类型（0：枪机、1：红外:2：半球、3：快球、4：全景）
        if (this.isMapOuter && this.activeMapConfig.mapId) {
          query.mapId = this.activeMapConfig.mapId
        } else if (this.currentFloor._id) {
          query.floorId = this.currentFloor._id
        }
        this.querySubVideosFun(query).then(() => {
          this.trackLoadVideos() // 接力追踪模式下，加载所有的视频
        })
      }
    },
    controlSubVideoShow(monitoryPointGenera, monitortype, visible) { // 控制视频子类型显隐
      let setFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.icon) // 匹配视频子类型要素设置函数
      if (this.isBsMapReady && visible) { // 地图加载完成 并且 资源显示时
        this.loadSubVideoFeatures(monitoryPointGenera, monitortype, setFeaturesFun, FEATURETYPE.icon) // 转换视频子类型数据
      } else {
        setFeaturesFun([])
      }
    },
    loadSubVideoFeatures(monitoryPointGenera, monitortype, setFeaturesFun, featureType) { // 转换视频子类型数据
      if (this.isBsMapReady && this.$context2D) { // 地图加载完成时
        let resourceArr = this.matchVideoResourceArr(monitoryPointGenera, monitortype) // 匹配视频子类型资源数据
        let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) // 匹配视频子类型名称图层
        let resourceArrCp = JSON.parse(JSON.stringify(resourceArr))
        const faceAlarm = JSON.parse(JSON.stringify(this.sixTypeAlarmPointList)).filter(item => { return item.alarmTypeToMap === 'faceAlarm' })
        const alarmList = faceAlarm.concat(JSON.parse(JSON.stringify(this.allVideoAlarmPointList))).concat(this.allVideoAlarmBuildList)
        const arr = this.showFeaturesList(resourceArrCp, alarmList, 'video', monitortype) // 报警闪烁时不显示普通点位
        let zoom = Math.ceil(this.$context2D.map.getView().getZoom())
        let features = videoTrans.transIconFeatures(arr, featureLayer, zoom)
        setFeaturesFun(features)
      }
    },
    controlSubVideoSectorShow(monitoryPointGenera, monitortype, iconVisible) { // 控制视频子类型可视域显隐
      let setFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.geometry) // 匹配视频子类型要素设置函数
      if (this.isBsMapReady && iconVisible && this.visualField) { // 地图加载完成、视频资源图标显示、可视域显示时
        this.loadSubVideoSectorFeatures(monitoryPointGenera, monitortype, setFeaturesFun, FEATURETYPE.geometry) // 转换视频子类型可视域要素数据
      } else {
        setFeaturesFun([])
      }
    },
    loadSubVideoSectorFeatures(monitoryPointGenera, monitortype, setFeaturesFun, featureType) { // 转换视频子类型可视域要素数据
      if (this.isBsMapReady && this.$context2D) { // 地图加载完成时
        let resourceArr = this.matchVideoResourceArr(monitoryPointGenera, monitortype) // 匹配视频子类型资源数据
        let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) // 匹配视频子类型名称图层
        let resourceArrCp = JSON.parse(JSON.stringify(resourceArr))
        let zoom = Math.ceil(this.$context2D.map.getView().getZoom())
        let sectorFeatures = videoTrans.transSectorFeatures(resourceArrCp, featureLayer, zoom)
        setFeaturesFun(sectorFeatures)
      }
    },
    controlSubVideoLabelShow(monitoryPointGenera, monitortype, iconVisible) { // 控制视频子类型名称显隐
      let setFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.label) // 匹配视频子类型要素设置函数
      if (this.isBsMapReady && iconVisible && this.isNameTitle) { // 地图加载完成、视频资源图标显示、名称标签显示时
        this.loadSubVideoLabelFeatures(monitoryPointGenera, monitortype, setFeaturesFun, FEATURETYPE.label) // 转换枪机名称要素数据
      } else {
        setFeaturesFun([])
      }
    },
    loadSubVideoLabelFeatures(monitoryPointGenera, monitortype, setFeaturesFun, featureType) { // 转换视频子类型名称要素数据
      if (this.isBsMapReady && this.$context2D) { // 地图加载完成时
        let resourceArr = this.matchVideoResourceArr(monitoryPointGenera, monitortype) // 匹配视频子类型资源数据
        let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) // 匹配视频子类型名称图层
        let resourceArrCp = JSON.parse(JSON.stringify(resourceArr))
        let zoom = Math.ceil(this.$context2D.map.getView().getZoom())
        let labelFeatures = featureBase.transLabelFeatures(resourceArrCp, featureLayer, zoom)
        setFeaturesFun(labelFeatures)
      }
    },
    handleHoverVideoFeature(attr) { // 处理鼠标悬浮视频图标要素
      // console.log('处理鼠标悬浮视频图标要素，要素信息：', attr)
      let [...videoIconTypes] = VIDEOICONLAYERMAP.values()
      if (videoIconTypes.includes(attr.type)) {
        let {monitoryPointGenera, sRType} = attr
        monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
        if (!this.isNameTitle) { // 名称标签隐藏时，悬浮显示名称标签
          let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, sRType, FEATURETYPE.label) // 匹配视频子类型名称图层
          let setLabelFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, sRType, FEATURETYPE.label) // 匹配视频子类型要素设置函数
          let labelFeature = featureBase.getHoverLabelFeature(attr, featureLayer)
          labelFeature && setLabelFeaturesFun([labelFeature])
        }
        if (!this.visualField) { // 可视域隐藏时，悬浮显示可视域
          let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, sRType, FEATURETYPE.geometry) // 匹配视频子类型名称图层
          let setSectorFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, sRType, FEATURETYPE.geometry) // 匹配视频子类型要素设置函数
          let sectorFeature = videoTrans.getHoverSectorFeature(attr, featureLayer)
          setSectorFeaturesFun([sectorFeature])
        }
      }
    },
    clearVideoHoverFeatures() { // 清空视频悬浮显示要素
      this.clearVideoHoverSectorFeatures() // 清空悬浮显示可视域要素
      this.clearVideoHoverLabelFeatures() // 清空悬浮显示名称要素
    },
    clearVideoHoverSectorFeatures() { // 清空悬浮显示可视域要素
      if (this.visualField) { // 显示可视域时
        !this.gun && this.setBoltipcSectorFeatures([]) // 枪机
        !this.hemisphere && this.setHalfBallipcSectorFeatures([]) // 半球
        !this.fastBall && this.setFastBallipcSectorFeatures([]) // 快球
        !this.panorama && this.setAllViewipcSectorFeatures([]) // 全景
        !this.infraRed && this.setRedBoltipcSectorFeatures([]) // 红外枪机
        !this.verface && this.setVerfaceipcSectorFeatures([]) // 交通抓拍
        !this.traffic && this.setTrafficipcSectorFeatures([]) // 人脸抓拍
      } else { // 隐藏可视域时
        this.setBoltipcSectorFeatures([]) // 枪机
        this.setHalfBallipcSectorFeatures([]) // 半球
        this.setFastBallipcSectorFeatures([]) // 快球
        this.setAllViewipcSectorFeatures([]) // 全景
        this.setRedBoltipcSectorFeatures([]) // 红外枪机
        this.setVerfaceipcSectorFeatures([]) // 人脸抓拍
        this.setTrafficipcSectorFeatures([]) // 交通抓拍
      }
    },
    clearVideoHoverLabelFeatures() { // 清空悬浮显示名称要素
      if (this.isNameTitle) { // 显示名称标签时
        !this.gun && this.setBoltipcLabelFeatures([]) // 枪机
        !this.hemisphere && this.setHalfBallipcLabelFeatures([]) // 半球
        !this.fastBall && this.setFastBallipcLabelFeatures([]) // 快球
        !this.panorama && this.setAllViewipcLabelFeatures([]) // 全景
        !this.infraRed && this.setRedBoltipcLabelFeatures([]) // 红外枪机
        !this.verface && this.setVerfaceipcLabelFeatures([]) // 人脸抓拍
        !this.traffic && this.setTrafficipcLabelFeatures([]) // 交通抓拍
      } else { // 隐藏名称标签时
        this.setBoltipcLabelFeatures([]) // 枪机
        this.setHalfBallipcLabelFeatures([]) // 半球
        this.setFastBallipcLabelFeatures([]) // 快球
        this.setAllViewipcLabelFeatures([]) // 全景
        this.setRedBoltipcLabelFeatures([]) // 红外枪机
        this.setVerfaceipcLabelFeatures([]) // 人脸抓拍
        this.setTrafficipcLabelFeatures([]) // 交通抓拍
      }
    },
    alarmToFilterFeature() {
      let type
      if (this.gun) {
        type = VIDEOTYPEKEY.boltipc
        this.controlSubVideoShow(CAMERATYPE.normalipc, type, this.gun)
      }
      if (this.hemisphere) {
        type = VIDEOTYPEKEY.halfBallipc
        this.controlSubVideoShow(CAMERATYPE.normalipc, type, this.hemisphere)
      }
      if (this.fastBall) {
        type = VIDEOTYPEKEY.fastBallipc
        this.controlSubVideoShow(CAMERATYPE.normalipc, type, this.fastBall)
      }
      if (this.panorama) {
        type = VIDEOTYPEKEY.allViewipc
        this.controlSubVideoShow(CAMERATYPE.normalipc, type, this.panorama)
      }
      if (this.infraRed) {
        type = VIDEOTYPEKEY.redBoltipc
        this.controlSubVideoShow(CAMERATYPE.normalipc, type, this.infraRed)
      }
      if (this.verface) {
        type = VIDEOTYPEKEY.boltipc
        this.controlSubVideoShow(CAMERATYPE.verfaceipc, type, this.verface)
      }
      if (this.traffic) {
        type = VIDEOTYPEKEY.boltipc
        this.controlSubVideoShow(CAMERATYPE.trafficipc, type, this.traffic)
      }
    },
    trackLoadVideos() {
      if (this.isPlatformTrack) {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, true)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, true)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, true)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, true)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, true)
        this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, true)
        this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, true)
      } else {
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.boltipc, this.gun)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.halfBallipc, this.hemisphere)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.fastBallipc, this.fastBall)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.allViewipc, this.panorama)
        this.controlSubVideoShow(CAMERATYPE.normalipc, VIDEOTYPEKEY.redBoltipc, this.infraRed)
        this.controlSubVideoShow(CAMERATYPE.verfaceipc, VIDEOTYPEKEY.boltipc, this.verface)
        this.controlSubVideoShow(CAMERATYPE.trafficipc, VIDEOTYPEKEY.boltipc, this.traffic)
      }
    }
  }
}
