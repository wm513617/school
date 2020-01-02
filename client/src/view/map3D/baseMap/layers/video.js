import layerConfig from 'assets/2DMap/meta/layer'
import { VIDEOTYPEKEY, FEATURETYPE, VIDEOICONLAYERMAP, CAMERATYPE } from 'assets/2DMap/meta/common'
import featureBase from 'assets/2DMap/feature/base'
import { mapGetters, mapActions } from 'vuex'
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
    handleHoverVideoFeature(attr) { // 处理鼠标悬浮视频图标要素
      let {monitoryPointGenera, sRType} = attr
      monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
      let featureLayer = this.macthVideoFeatureLayer(monitoryPointGenera, sRType, FEATURETYPE.label) // 匹配视频子类型名称图层
      let setLabelFeaturesFun = this.macthSetVideoFeaturesFun(monitoryPointGenera, sRType, FEATURETYPE.label) // 匹配视频子类型要素设置函数
      let labelFeature = featureBase.getHoverLabelFeature(attr, featureLayer)
      labelFeature && setLabelFeaturesFun([labelFeature])
    },
    macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) { // 匹配视频要素要素
      let featureLayer = this.boltipcLayer
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            /* featureLayer = this.boltipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.boltipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.boltipcLabelLayer
            } */
            featureLayer = this.boltipcLabelLayer
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            /* featureLayer = this.halfBallipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.halfBallipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.halfBallipcLabelLayer
            } */
            featureLayer = this.halfBallipcLabelLayer
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            /* featureLayer = this.fastBallipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.fastBallipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.fastBallipcLabelLayer
            } */
            featureLayer = this.fastBallipcLabelLayer
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            /* featureLayer = this.allViewipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.allViewipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.allViewipcLabelLayer
            } */
            featureLayer = this.allViewipcLabelLayer
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
          /*  featureLayer = this.redBoltipcLayer
            if (featureType === FEATURETYPE.geometry) { // 可视域
              featureLayer = this.redBoltipcSectorLayer
            } else if (featureType === FEATURETYPE.label) { // 标注
              featureLayer = this.redBoltipcLabelLayer
            } */
            featureLayer = this.redBoltipcLabelLayer
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        /* featureLayer = this.verfaceipcLayer
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureLayer = this.verfaceipcSectorLayer
        } else if (featureType === FEATURETYPE.label) { // 标注
          featureLayer = this.verfaceipcLabelLayer
        } */
        featureLayer = this.verfaceipcLabelLayer
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        /* featureLayer = this.trafficipcLayer
        if (featureType === FEATURETYPE.geometry) { // 可视域
          featureLayer = this.trafficipcSectorLayer
        } else if (featureType === FEATURETYPE.label) { // 标注
          featureLayer = this.trafficipcLabelLayer
        } */
        featureLayer = this.trafficipcLabelLayer
      }
      return featureLayer
    },
    macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, featureType) { // 匹配要素设置函数
      let setFeaturesFun = this.setBoltipcFeatures
      if (monitoryPointGenera === CAMERATYPE.normalipc) { // 普通ipc
        switch (monitortype) {
          case VIDEOTYPEKEY.boltipc: // 枪机
            /* setFeaturesFun = this.setBoltipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setBoltipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setBoltipcLabelFeatures
            } */
            setFeaturesFun = this.setBoltipcLabelFeatures
            break
          case VIDEOTYPEKEY.halfBallipc: // 半球
            /* setFeaturesFun = this.setHalfBallipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setHalfBallipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setHalfBallipcLabelFeatures
            } */
            setFeaturesFun = this.setHalfBallipcLabelFeatures
            break
          case VIDEOTYPEKEY.fastBallipc: // 快球
            /* setFeaturesFun = this.setFastBallipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setFastBallipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setFastBallipcLabelFeatures
            } */
            setFeaturesFun = this.setFastBallipcLabelFeatures
            break
          case VIDEOTYPEKEY.allViewipc: // 全景
            /* setFeaturesFun = this.setAllViewipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setAllViewipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setAllViewipcLabelFeatures
            } */
            setFeaturesFun = this.setAllViewipcLabelFeatures
            break
          case VIDEOTYPEKEY.redBoltipc: // 红外枪机
            /* setFeaturesFun = this.setRedBoltipcFeatures
            if (featureType === FEATURETYPE.geometry) { // 可视域
              setFeaturesFun = this.setRedBoltipcSectorFeatures
            } else if (featureType === FEATURETYPE.label) { // 标注
              setFeaturesFun = this.setRedBoltipcLabelFeatures
            } */
            setFeaturesFun = this.setRedBoltipcLabelFeatures
            break
        }
      } else if (monitoryPointGenera === CAMERATYPE.verfaceipc) { // 人脸抓拍
        /* setFeaturesFun = this.setVerfaceipcFeatures
        if (featureType === FEATURETYPE.geometry) { // 可视域
          setFeaturesFun = this.setVerfaceipcSectorFeatures
        } else if (featureType === FEATURETYPE.label) { // 标注
          setFeaturesFun = this.setVerfaceipcLabelFeatures
        } */
        setFeaturesFun = this.setVerfaceipcLabelFeatures
      } else if (monitoryPointGenera === CAMERATYPE.trafficipc) { // 交通抓拍
        /* setFeaturesFun = this.setTrafficipcFeatures
        if (featureType === FEATURETYPE.geometry) { // 可视域
          setFeaturesFun = this.setTrafficipcSectorFeatures
        } else if (featureType === FEATURETYPE.label) { // 标注
          setFeaturesFun = this.setTrafficipcLabelFeatures
        } */
        setFeaturesFun = this.setTrafficipcLabelFeatures
      }
      return setFeaturesFun
    },
    clearVideoHoverFeatures() { // 清空视频悬浮显示要素
      this.clearVideoHoverLabelFeatures() // 清空悬浮显示名称要素
    },
    clearVideoHoverLabelFeatures() {
      this.setBoltipcLabelFeatures([]) // 枪机
      this.setHalfBallipcLabelFeatures([]) // 半球
      this.setFastBallipcLabelFeatures([]) // 快球
      this.setAllViewipcLabelFeatures([]) // 全景
      this.setRedBoltipcLabelFeatures([]) // 红外枪机
      this.setVerfaceipcLabelFeatures([]) // 人脸抓拍
      this.setTrafficipcLabelFeatures([]) // 交通抓拍
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
    })
  }
}
