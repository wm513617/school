import { mapGetters, mapActions } from 'vuex'
import layerConfig from 'assets/2DMap/meta/layer'
import featureBase from 'assets/2DMap/feature/base'
// import videoTrans from 'assets/2DMap/feature/apply/video'
// import { VIDEOTYPEKEY, FEATURETYPE, VIDEOICONLAYERMAP, CAMERATYPE } from 'assets/2DMap/meta/common'
export default {
  data() {
    return {
      /* boltipcLayer: layerConfig.boltipc, // 枪机
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
      trafficipcLabelLayer: layerConfig.trafficipcLabel, */
      videoLabelNames: layerConfig.videoLabel
    }
  },
  methods: {
    ...mapActions('tdIndex', [
      'setVideoLabelFeatures'
    ]),
    /* macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, featureType) { // 匹配要素设置函数
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
     // console.log(monitoryPointGenera, monitortype, featureType)
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
    }, */
    handleHoverVideoFeature(attr) { // 处理鼠标悬浮视频图标要素
      if (attr.type === this.videoLayer.name) { // 悬浮显示名称要素
        let labelFeature = featureBase.getHoverLabelFeature(attr, this.videoLabelNames)
        labelFeature && this.setVideoLabelFeatures([labelFeature])
      }
    },
    clearVideoHoverFeatures() { // 清空要素
      this.setVideoLabelFeatures([])
    }
  },
  computed: {
    /* ...mapGetters({
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
    }), */
    ...mapGetters('tdIndex', {videoLabelFeatures: 'videoLabels'}) // isShowNameEdit:'dbcdef',

  }
}
