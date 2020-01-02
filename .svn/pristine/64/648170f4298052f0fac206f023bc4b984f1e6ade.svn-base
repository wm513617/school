<!--编辑模式 视频点位的右边编辑框的页面-->
<template>
  <div class="videoPoint">
    <div class="videoPointHeader">
      <div class="pointHeaderTittle">
        <p>视频点位</p>
      </div>
      <div class="pointHeaderContent iconfont">
        <div @click="preView" class="icon-videotape" title="预览"></div>
        <div @click="delPoint" class="icon-delete" title="删除"></div>
      </div>
    </div>
    <div class="videoPointContent">
      <div class="pointContentHeader">
        <p class="pointTittle">基本信息</p>
      </div>
      <div class="videoMain">
         <bs-scroll ref="scroller">
          <div class="pointMainHome">
            <Form ref="pointData" :model="pointData" :rules="ruleValidate" :label-width="70" label-position="left">
              <Form-item label="资源名称" prop="name">
                <Input :maxlength="64" v-model="pointData.name" placeholder="请输入" />
              </Form-item>
              <Form-item label="可见范围" prop="class">
                <InputNumber :max="28" :min="0" :maxlength='2' v-model="pointData.class" placeholder="最大28级"></InputNumber>
              </Form-item>
              <Form-item label="厂商" prop="firm">
                <Input v-model="pointData.firm" placeholder="请输入厂商" disabled/>
              </Form-item>
              <!-- 联系方式 -->
              <contentWay :principal.sync="pointData.principal"></contentWay>
              <Form-item label='经纬度'>
                <Input v-model="pointData.loc" disabled/>
              </Form-item>
            </Form>
            <div class='tabs'>
              <div class="tab" :class="{actived: activedTab === 'img'}" @click="activedTab = 'img';$refs.scroller.update()">图标</div>
              <div class="tab" :class="{actived: activedTab === 'see'}" @click="activedTab = 'see';$refs.scroller.update()">可视域</div>
            </div>
            <div v-show="activedTab === 'img'" class="img-icon">
              <Carousel v-if="iconList.length > 0" v-model="selectedModelIndex" :height="210" :dots="null" arrow="always" loop @on-change="changeIconURI">
                <CarouselItem v-for="(item, index) in iconList" :key="index">
                    <div class="carouselItem"><img :src="item.files[0].path"></div>
                </CarouselItem>
              </Carousel>
            </div>
            <div class="pointTittle" v-show="activedTab === 'see'">
              <Checkbox v-model="posInfoFlag" @on-change="vedioPosition">可视域</Checkbox>
            </div>
            <Form ref="pointDataAn" v-show="activedTab === 'see'" :model="pointData" :label-width="70" :rules="ruleValidate" label-position="left">
              <Form-item label="照射半径" prop="radius">
                <InputNumber :max="150" :disabled="!posInfoFlag" :min="0" v-model="pointData.radius" @input="radiusInput"></InputNumber>米
              </Form-item>
              <Form-item label="可视角度" prop="viewshed">
                <InputNumber :max="150" :disabled="!posInfoFlag" :min="0" v-model="pointData.viewshed" @input="anglesInput"></InputNumber>°
              </Form-item>
              <Form-item label="点位角度" prop="angle">
                <InputNumber :max="360" :min="-360" v-model="pointData.angle" @input="rangeInput"></InputNumber>°
              </Form-item>
            </Form>
            <div v-show="activedTab === 'see'">
              <svg width="200px" height="200px" class="svgclass" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <text x="185" y="105" fill="#FFF">0°</text>
                <text x="90" y="15" fill="#FFF">90°</text>
                <text x="0" y="105" fill="#FFF">180°</text>
                <text x="90" y="200" fill="#FFF">270°</text>
                <line x1="30" y1="100" x2="180" y2="100" style="stroke:rgb(255,255,255);stroke-width:1" />
                <line x1="100" y1="20" x2="100" y2="180" style="stroke:rgb(255,255,255);stroke-width:1" />
                <g id="ringIdMax">
                  <g ref="ringId">
                    <path ref="ring" fill="#20a1ff" />
                    <circle cx="100" cy="100" r="10" stroke="black" stroke-width="1" fill="#FFF" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </bs-scroll>
      </div>
    </div>
    <div class="videoPointFooter">
      <Button type="ghost" @click="mapPointCannel('pointData')" style="margin-right: -3px">取消</Button>
      <Button type="primary" @click="mapPointSave('pointData')" style="margin-left: 16px">保存</Button>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import contentWay from 'components/map/contentWay'
import { isInvalidPrincipal } from 'components/map/formCheck'
import { FEATURETYPE, VIDEOTYPEKEY, CAMERATYPE, POINTSTATE } from 'assets/2DMap/meta/common'
import layerConfig from 'assets/2DMap/meta/layer'
import videoTrans from 'assets/2DMap/feature/edit/video'
export default {
  components: {
    contentWay
  },
  data() {
    const nameValid = (rule, value, callback) => { // 名称校验
      value = value.replace(/(^\s*)|(\s*$)/g, '')
      if (value && value.length > 0) {
        let len = 0
        for (let i = 0; i < value.length; i++) {
          const code = Number(value[i].charCodeAt(0))
          if (code > 127) {
            len += 2
          } else {
            len++
          }
        }
        if (len > 64) {
          return callback(new Error('不能超过64位字符'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('名称不能为空'))
      }
    }
    return {
      // 点位信息
      pointData: {},
      // 点位信息表单验证规则
      ruleValidate: {
        name: [{ required: true, validator: nameValid, trigger: 'change' }],
        class: [{ required: true, message: '请输入可见范围' }]
      },
      posInfoFlag: false,
      pointAngle: 0,
      pastPointAngle: 0,
      selectedModelIndex: 0,
      activedTab: 'img',
      iconList: [], // 可用图标列表
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
      trafficipcSectorLayer: layerConfig.trafficipcSector,
      setVideoFeatures: null, // 设置视频要素
      setVideoSectorFeatures: null, // 设置视频覆盖区域要素
      videos: [], // 视频要素
      videoSectors: [] // 视频覆盖区域要素
    }
  },
  computed: {
    ...mapState({
      detail: ({ mapIndex }) => mapIndex.mapEditRightPage.detail,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig,
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      levelData: ({ mapArea }) => mapArea.currentFloor
    }),
    ...mapGetters({
      pointDataMol: 'selectedMapPointRes', // 视频资点位数据
      isOuter: 'isMapOuter', // 楼内外地图的标志
      mapProjection: 'mapProjection', // 当前地图投影方式
      drawFeatureLoc: 'drawFeatureLoc', // 绘制的点位位置
      sectorChecked: 'videoEditSectorChecked', // 视频编辑时覆盖区域是否勾选
      boltipcs: 'boltipcFeatures', // 枪机要素
      boltipcSectors: 'boltipcSectorFeatures', // 枪机覆盖区域要素
      halfBallipcs: 'halfBallipcFeatures', // 半球要素
      halfBallipcSectors: 'halfBallipcSectorFeatures', // 半球覆盖区域要素
      fastBallipcs: 'fastBallipcFeatures', // 快球要素
      fastBallipcSectors: 'fastBallipcSectorFeatures', // 快球覆盖区域要素
      allViewipcs: 'allViewipcFeatures', // 全景要素
      allViewipcSectors: 'allViewipcSectorFeatures', // 全景覆盖区域要素
      redBoltipcs: 'redBoltipcFeatures', // 红外枪机要素
      redBoltipcSectors: 'redBoltipcSectorFeatures', // 视频覆盖区域要素
      verfaceipcs: 'verfaceipcFeatures', // 脸抓拍要素
      verfaceipcSectors: 'verfaceipcSectorFeatures', // 人脸抓拍覆盖区域要素
      trafficipcs: 'trafficipcFeatures', // 交通抓拍要素
      trafficipcSectors: 'trafficipcSectorFeatures' // 交通抓拍覆盖区域要素
    }),
    ...mapGetters('map2DEditIX', {
      isBoltipc: 'boltipc', // 枪机
      isRedBoltipc: 'redBoltipc', // 红外枪机
      isHalfBallipc: 'halfBallipc', // 半球
      isFastBallipc: 'fastBallipc', // 快球
      isAllViewipc: 'allViewipc', // 全景
      isVerface: 'verface', // 人脸抓拍
      isTraffic: 'traffic', // 交通抓拍
      isSector: 'sector', // 可视域
      editTreeChangeCounter: 'editTreeChangeCounter' // 编辑树计数器
    })
  },
  watch: {
    pointDataMol: { // 点位信息
      handler(val) {
        if (val && val._id) {
          this.initPageData(val)
          this.rangeInput(this.pointData.angle)
          this.getIconList({oid: this.pointData.mid.oid}).then(res => {
            this.iconList = JSON.parse(JSON.stringify(res.data))
            for (let i = 0; i < this.iconList.length; i++) {
              if (this.iconList[i]._id === this.pointData.mid._id) {
                this.selectedModelIndex = i
                return
              }
            }
          })
        }
      },
      deep: true
    },
    pointData: { // 点位信息
      handler(val) {
        if (val) {
          this.SET_VIDEO_EDIT_POINT_DATA(JSON.parse(JSON.stringify(val)))
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('map2DEditIX', ['changeEditTreeChangeCounter']),
    ...mapActions([
      'saveCommonPointRes',
      'delOnePointApi',
      'getIconList', // 图标切换列表
      'loadSubVideosByMapId',
      'loadSubVideosByFloorId',
      'setBoltipcFeatures',
      'setBoltipcSectorFeatures',
      'setHalfBallipcFeatures',
      'setHalfBallipcSectorFeatures',
      'setFastBallipcFeatures',
      'setFastBallipcSectorFeatures',
      'setAllViewipcFeatures',
      'setAllViewipcSectorFeatures',
      'setRedBoltipcFeatures',
      'setRedBoltipcSectorFeatures',
      'setVerfaceipcFeatures', // 人脸抓拍
      'setVerfaceipcSectorFeatures',
      'setTrafficipcFeatures', // 交通抓拍
      'setTrafficipcSectorFeatures'
    ]),
    ...mapMutations([
      'SET_FEATURE_EDIT_ACTIVE', // 地图编辑点位位置的控件
      'SET_EDIT_RIGHT_PAGE_STATE',
      'SET_EDITDETAIL_STATE',
      'SET_VIDEO_EDIT_SECTOR_CHECKED', // 设置视频编辑时覆盖区域是否勾选
      'SET_VIDEO_EDIT_POINT_DATA', // 设置视频编辑时点位状态
      'SET_DEFAULT_POINT_ICON' // 设置默认图标
    ]),
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
    matchVideoFeatureArr(monitoryPointGenera, monitortype, featureType) { // 匹配视频子类型要素数据
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
    macthVideoFeatureLayer(monitoryPointGenera, monitortype, featureType) { // 匹配视频图层
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
    changeIconURI(oldIndex, newIndex) { // 改变模型
      if (this.setVideoFeatures && this.iconList && this.iconList.length > newIndex) {
        let icon = this.iconList[newIndex]
        this.SET_DEFAULT_POINT_ICON(icon) // 设置默认点位图标文件
        this.pointData.mid = icon
        if (icon.files && icon.files.length > 0) {
          let iconUrl = icon.files[0].path // 模型文件的地址
          for (const file of icon.files) {
            if (file.status === POINTSTATE.ONLINE) {
              iconUrl = file.path
              break
            }
          }
          let {monitoryPointGenera, monitortype} = this.pointDataMol
          monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
          this.videos = this.matchVideoFeatureArr(monitoryPointGenera, monitortype, FEATURETYPE.icon)
          let videoArr = JSON.parse(JSON.stringify(this.videos))
          for (let video of videoArr) {
            if (video.attributes.id === this.pointDataMol._id) {
              if (video.symbol && video.symbol.iconStyle) {
                video.symbol.iconStyle.url = iconUrl
              }
            }
          }
          this.setVideoFeatures(videoArr)
        }
      }
    },
    initPageData(val) {
      this.activedTab = 'img'
      this.posInfoFlag = false
      this.iconList = []
      let pointDataVal = JSON.parse(JSON.stringify(val))
      this.pointData = pointDataVal.point
      this.pointData.name = pointDataVal.name
      if (pointDataVal.eid) {
        if (pointDataVal.eid.manufacturer) {
          this.pointData.firm = pointDataVal.eid.manufacturer
        } else {
          this.pointData.firm = '-'
        }
      } else {
        this.pointData.firm = '-'
      }
      if (!this.pointData.principal || !this.pointData.principal.length) {
        this.pointData.principal = [{name: '', mobile: ''}]
      }
      this.radiusInput(this.pointData.radius)
      this.anglesInput(this.pointData.viewshed)
      let {monitoryPointGenera, monitortype} = pointDataVal
      monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
      this.videoLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, FEATURETYPE.icon)
      this.videoSectorLayer = this.macthVideoFeatureLayer(monitoryPointGenera, monitortype, FEATURETYPE.geometry)
      this.videos = this.matchVideoFeatureArr(monitoryPointGenera, monitortype, FEATURETYPE.icon)
      this.videoSectors = this.matchVideoFeatureArr(monitoryPointGenera, monitortype, FEATURETYPE.geometry)
      this.setVideoFeatures = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.icon)
      this.setVideoSectorFeatures = this.macthSetVideoFeaturesFun(monitoryPointGenera, monitortype, FEATURETYPE.geometry)
    },
    // 视频点位 调整位置勾选
    vedioPosition(flag) {
      this.SET_VIDEO_EDIT_SECTOR_CHECKED(flag)
      if (flag) {
        this.updateCurrnetSector()
      } else {
        !this.isSector && this.setVideoSectorFeatures && this.setVideoSectorFeatures([])
      }
    },
    // 照射半径
    radiusInput(val) {
      this.sectorChecked && this.updateCurrnetSector()
    },
    // 可视角度
    anglesInput(val) {
      let svgMax = parseInt(val)
      let path = this.$refs.ring
      let ringId = this.$refs.ringId
      this.setSvg(ringId, path, svgMax, 50, 100)
      if (ringId.setAttribute) {
        ringId.setAttribute('transform', 'rotate(' + (135 - svgMax) + ', 100,100)')
      }
      this.pointAngle = -(parseInt(val) - 90) / 2
      ringId.setAttribute('transform', 'rotate(' + parseFloat(this.pointAngle) + ', 100,100)')
      this.sectorChecked && this.updateCurrnetSector()
    },
    // 点位角度
    rangeInput(val) {
      /* global ringIdMax */
      let newVal = -val + this.pointAngle
      this.pastPointAngle = parseFloat(newVal) + parseFloat(this.pointData.viewshed) / 2
      ringIdMax.setAttribute('transform', 'rotate(' + this.pastPointAngle + ', 100,100)')
      this.updateCurrentVideo() // 更新当前视频要素
      this.sectorChecked && this.updateCurrnetSector() // 更新当前视频覆盖区域要素
    },
    updateCurrnetSector() { // 更新当前视频覆盖区域要素
      if (this.setVideoSectorFeatures) {
        let video = JSON.parse(JSON.stringify(this.pointDataMol))
        video.point = JSON.parse(JSON.stringify(this.pointData))
        video.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : video.point.loc
        let sectorArr = this.videoSectors.filter(item => item.attributes.id !== video._id)
        let sectorFeature = videoTrans.transOneSectorFeature(video, this.videoSectorLayer)
        sectorArr.push(sectorFeature)
        this.setVideoSectorFeatures(sectorArr)
      }
    },
    updateCurrentVideo() { // 更新当前视频要素
      if (this.setVideoFeatures) {
        let video = JSON.parse(JSON.stringify(this.pointDataMol))
        video.point = JSON.parse(JSON.stringify(this.pointData))
        let videoArr = this.videos.filter(item => item.attributes.id !== video._id)
        let videoFeature = videoTrans.transOneIconFeature(video, this.videoLayer)
        videoArr.push(videoFeature)
        this.setVideoFeatures(videoArr)
      }
    },
    /**
     * @param {*} ringId 绘制扇形的外层画布
     * @param {*} path 绘制扇形的div
     * @param {*} progress
     * @param {*} r 半径
     * @param {*} z 中心点坐标
     */
    setSvg(ringId, path, progress, r, z) {
      path.setAttribute('transform', 'translate(' + z + ',' + z + ')')
      let degrees = progress
      let rad = degrees * (Math.PI / 180)
      let x = (Math.sin(rad) * r).toFixed(2)
      let y = -(Math.cos(rad) * r).toFixed(2)
      let lenghty = window.Number(degrees > 180)
      let descriptions = ['M', 0, 0, 'v', -r, 'A', r, r, 0, lenghty, 1, x, y, 'z']
      path.setAttribute('d', descriptions.join(' '))
    },
    // 取消保存
    mapPointCannel(name) {
      this.$refs[name].resetFields()
      this.closeEditVePoCon()
    },
    // 保存
    mapPointSave(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.pointData.principal) {
            let result = isInvalidPrincipal(this.pointData.principal)
            if (result.flag && result.msg) {
              this.errorMsg(result.msg)
            } else {
              if (typeof this.pointData.radius === 'number' && this.pointData.radius >= 0) {
                if (typeof this.pointData.viewshed === 'number' && this.pointData.viewshed >= 0) {
                  if (typeof this.pointData.angle === 'number') {
                    this.onePointSave() // 表单校验通过执行保存操作
                  } else {
                    this.errorMsg('请输入点位角度')
                  }
                } else {
                  this.errorMsg('请输入可视角度')
                }
              } else {
                this.errorMsg('请输入照射半径')
              }
            }
          }
        }
      })
    },
    // 点位入库
    onePointSave() {
      let id = this.pointDataMol && this.pointDataMol._id
      let pointDataEdit = JSON.parse(JSON.stringify(this.pointDataMol))
      pointDataEdit.point = this.pointData
      if (this.drawFeatureLoc) {
        pointDataEdit.point.loc = this.drawFeatureLoc
        pointDataEdit.point.projection = this.mapProjection
      }
      pointDataEdit.name = this.pointData.name
      this.saveCommonPointRes({ _id: id, body: pointDataEdit })
        .then(res => {
          this.closeEditVePoCon()
          let {monitortype, monitoryPointGenera} = pointDataEdit
          monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
          this.getMapResource(monitortype, monitoryPointGenera)
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('视频点位修改失败：', data)
          let msg = data.message ? data.message : '视频点位修改失败'
          this.errorMsg(msg)
        })
    },
    // 关闭视频点位编辑位置的控件
    closeEditVePoCon() {
      this.SET_DEFAULT_POINT_ICON(null) // 清空默认图标
      this.$store.commit('SET_FEATURE_EDIT_ACTIVE', false) // 关闭编辑视频点位的控件
      this.SET_VIDEO_EDIT_SECTOR_CHECKED(false) // 清空点位可视域选中状态
      this.SET_VIDEO_EDIT_POINT_DATA(null) // 清空视频编辑点位信息
      if (this.isOuter) {
        this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: '', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
    },
    // 删除点位
    deleteVedioAndSector(id) {
      this.closeEditVePoCon()
    },
    // 删除点位
    delPoint() {
      let video = JSON.parse(JSON.stringify(this.pointDataMol))
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认删除所选视频点位吗？</p>',
        onOk: () => {
          this.delOnePointApi(video._id)
            .then(res => {
              this.successMsg('视频点位删除成功')
              this.deleteVedioAndSector(video._id)
              // 获取地图点位资源
              this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: '', detail: 'show' })
              let {monitortype, monitoryPointGenera} = video
              monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
              this.getMapResource(monitortype, monitoryPointGenera)
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('视频点位删除失败')
            })
        },
        onCancel: () => {}
      })
    },
    // 预览
    preView() {
      if (this.pointDataMol.status) {
        let eid = this.pointDataMol.eid
        if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
          this.$store.commit('UPDATE_POINT_VIDEO_LIST', this.pointDataMol)
        } else {
          this.warningMsg('该设备已禁用！')
        }
      } else {
        this.warningMsg('该设备不在线！')
      }
    },
    // 获取地图点位资源
    getMapResource(monitortype, monitoryPointGenera) {
      let counter = {optTab: 'video', count: this.editTreeChangeCounter.count + 1}
      this.changeEditTreeChangeCounter(counter)
      if (this.isOuter) {
        this.loadSubVideosByMapId({monitortype, mapId: this.activeMapConfig.mapId, monitoryPointGenera})
      } else {
        this.loadSubVideosByFloorId({monitortype, floorId: this.levelData._id, monitoryPointGenera})
      }
    }
  },
  mounted() {
    if (this.pointDataMol && this.pointDataMol._id) {
      this.initPageData(this.pointDataMol)
      this.rangeInput(this.pointData.angle)
      this.getIconList({oid: this.pointData.mid.oid}).then(res => {
        this.iconList = JSON.parse(JSON.stringify(res.data))
        for (let i = 0; i < this.iconList.length; i++) {
          if (this.iconList[i]._id === this.pointData.mid._id) {
            this.selectedModelIndex = i
            return
          }
        }
      })
    }
  }
}
</script>
<style scoped>
.videoPoint,
.videoPoint .videoPointContent,
.videoPoint .videoPointContent .videoMain {
  display: flex;
  flex: 1;
  flex-direction: column;
  /* padding: 0px 20px; */
}
.pointMainHome {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0px 20px;
}
.videoPoint .videoPointHeader {
  height: 38px;
  width: 100%;
  line-height: 38px;
  clear: both;
  background-color: #0f2343;
  font-size: 14px;
  cursor: default;
}

.videoPoint .videoPointHeader .pointHeaderTittle {
  float: left;
  margin-left: 20px;
}

.videoPoint .videoPointHeader .pointHeaderContent {
  float: right;
  margin-right: 20px;
  cursor: pointer;
}
.videoPoint .videoPointHeader .pointHeaderContent div {
  display: inline;
  margin: 0px 10px;
  font-size: 14px;
  cursor: pointer;
  font-style: normal;
}
.videoPoint .videoPointHeader .pointHeaderContent div:hover {
  color: #20adff;
}

.videoPointContent .pointContentHeader {
  width: 100%;
  height: 50px;
}

.videoPointContent .pointContentHeader .pointTittle {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  margin: 0 10px;
  padding: 0 10px;
  margin-bottom: 10px;
  cursor: pointer;
  border-bottom: 1px solid #4996f9;
}

.videoPoint .videoPointFooter {
  height: 40px;
  width: 100%;
  line-height: 40px;
  clear: both;
  text-align: center;
}
.tabs {
  display: flex;
  justify-content: center
}
.tab {
  width: 25%;
  text-align: center;
  padding-bottom: 4px;
  cursor: pointer;
}
.actived {
  border-bottom: 1px solid #4996f9;
}
/* 走马灯项的样式 */
.carouselItem {
  width: 190px;
  height: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #20adff;
}
/* 走马灯项下图片的样式 */
.carouselItem img {
  max-width: 180px;
  max-height: 180px;
}
 /* 覆盖iview走马灯项的样式 */
.ivu-carousel-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.img-icon {
  height: 210px;
}
</style>
