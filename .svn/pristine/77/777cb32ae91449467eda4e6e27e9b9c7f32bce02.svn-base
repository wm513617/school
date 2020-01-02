<!--编辑模式 地图配置页面-->
<template>
  <Modal v-model="mapConfigMol" class="mapConfigHome" width="600" :mask-closable="false" :closable="false">
    <p slot="header" class="mapConfigHeader">
      <span>地图配置</span>
    </p>
    <div class="mapConfigContent">
      <Form ref="mapConfigFrom" :rules="ruleValidate" :model="mapConfigFrom" :label-width="100" label-position="left">
        <FormItem label="地图数据源" prop="type">
          <RadioGroup v-model="mapConfigFrom.type" @on-change="mapTypeChange">
            <Radio v-for="(item, index) in mapDataOrgin" :key="index" :label="item.label" :value="item.value" :disabled="item.disable">
              <span>{{item.text}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <div style='margin: -12px 0 24px 100px;'>
          <RadioGroup>
            <Radio v-for="(item, index) in mapDataOrginDisable" :key="index" :label="item.label" :value="item.value" :disabled="item.disable">
              <span>{{item.text}}</span>
            </Radio>
          </RadioGroup>
        </div>
        <div v-if="mapConfigFrom.type === 'static'" class="staticClass">
          <FormItem label="文件选择" prop="service">
            <Row>
              <Col span="19">
                <Input v-model="mapConfigFrom.service" disabled placeholder="请选择地图文件" style="float:left" />
              </Col>
              <Col span="4">
                <Upload ref="upload" action="/api/upload/file?category=map&type=image" :show-upload-list="false" :before-upload="handleBeforeUpload" :on-success="uploadEditSuccess" :multiple="false" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
                  <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
                </Upload>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="范围" prop="range">
            <Input v-model="mapConfigFrom.range" :placeholder="mapStaticPlaceholder" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'iserver'">
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="服务器地址" prop="service">
            <Input v-model="mapConfigFrom.service" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type ===  'geoserver'">
          <FormItem label="瓦片类型" prop="tileType">
            <RadioGroup v-model="mapConfigFrom.tileType">
              <Radio label="geoserver"></Radio>
              <Radio label="arcgis"></Radio>
          </RadioGroup>
          </FormItem>
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <div v-if="mapConfigFrom.tileType ===  'arcgis'">
            <FormItem label="图层名称" prop="targeLayerName">
              <Input v-model="mapConfigFrom.targeLayerName" placeholder="" />
            </FormItem>
          </div>
          <FormItem label="服务器地址" prop="service">
            <Input v-model="mapConfigFrom.service" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'baiduMap'">
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'googleMap'">
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'tianMap'">
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'gaodeMap'">
          <FormItem label="默认级别" prop="zoom">
            <InputNumber :max="22" :min="0" :step="1" v-model="mapConfigFrom.zoom" style="width: 100%;"></InputNumber>
          </FormItem>
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
        </div>
      </Form>
    </div>
    <div slot="footer">
      <Button type="text" @click="cannel" style="margin-right: -4px">取消</Button>
      <Button type="text" v-if="activeMap" @click="init" style="margin-right: -3px;margin-left: 16px">初始化</Button>
      <Button type="primary" :disabled="confirmButton" style="margin-left: 16px" :loading="modalLoading" @click="confirm('mapConfigFrom')">确认</Button>
    </div>
  </Modal>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import spaceAnalysisUtil from '../../../../assets/map/spaceAnalysisUtil.js'
import xml2js from 'xml2js'
import { getMapResolutions } from '../../../../../static/opengis/index'
import { toMercator } from '@turf/projection'
import { point } from '@turf/helpers'
import { PROJ } from 'assets/2DMap/meta/common.js'
// import parseurl from 'url-parse'
export default {
  data() {
    // 静态地图范围
    const mapExtentCheck = (rule, value, callback) => {
      let r = /^([0-9]|[,]|[.]|[-])+[0-9]$/g
      if (value === '') {
        return callback(new Error('地图范围不能为空'))
      }
      if (r.test(value)) {
        let array = value.split(',')
        let s3 = parseFloat(array[0]) >= parseFloat(array[2]) || parseFloat(array[1]) >= parseFloat(array[3])
        if (s3) {
          return callback(new Error('请输入正确的地图范围'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入正确格式的地图范围'))
      }
    }
    const mapServerCheck = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入地图服务'))
      } else {
        if (this.mapConfigFrom.type === 'geoserver') {
          if (value.lastIndexOf('wmts') < 0) {
            return callback(new Error('输入的地址无效！！'))
          } else {
            callback()
          }
        }
        if (this.mapConfigFrom.type === 'iserver') {
          if (value.lastIndexOf('maps') < 0) {
            return callback(new Error('输入的地址无效！！'))
          } else {
            callback()
          }
        }
        if (this.mapConfigFrom.type === 'static') {
          callback()
        }
      }
    }
    return {
      modalLoading: false,
      mapConfigFrom: {
        name: '',
        tileType: 'geoserver',
        type: 'geoserver',
        centerPoint: '',
        range: '',
        service: '',
        zoom: 0
      },
      mapStaticPlaceholder: '',
      serviceUrl: '',
      existMapConfig: {}, // 已存在的地图配置
      mapStaticInfo: {},
      uploadList: [], // 上传列表
      // 表单验证
      ruleValidate: {
        type: [{ required: true, message: '请选择地图类型', trigger: 'blur' }],
        service: [{ required: true, validator: mapServerCheck, trigger: 'change' }],
        tileType: [{ required: true, message: '请选择切片图类型', trigger: 'change' }],
        targeLayerName: [{ required: true, message: '请输入指定图层名称', trigger: 'change' }],
        range: [{ required: true, validator: mapExtentCheck, trigger: 'change' }],
        centerPoint: [{ required: true, message: '请输入地图中心点', trigger: 'change' }]
      },
      // 地图数据源
      mapDataOrgin: [
        { text: '蓝星', label: 'geoserver', valve: 'geoserver', disable: false },
        { text: '超图', label: 'iserver', valve: 'iserver', disable: false },
        { text: '静态', label: 'static', valve: 'static', disable: false }
      ],
      mapDataOrginDisable: [
        { text: '谷歌', label: 'googleMap', valve: 'googleMap', disable: true },
        { text: '百度', label: 'baiduMap', valve: 'baiduMap', disable: true },
        { text: '天地图', label: 'tianMap', valve: 'tianMap', disable: true },
        { text: '高德', label: 'gaodeMap', valve: 'gaodeMap', disable: true }
      ],
      staticExtentDefaut: '116.24261269642659,40.21687592760154,116.27199903984895,40.2462622710239',
      confirmButton: false
    }
  },
  computed: {
    ...mapState({
      mapConfigMol: ({ mapIndex }) => mapIndex.mapConfigMol,
      activeMap: ({ mapIndex }) => mapIndex.activeMapConfig.mapId,
      mapConfigList: ({ mapIndex }) => mapIndex.mapConfigArr // 地图列表
    })
  },
  watch: {
    'mapConfigFrom.type'(val) {
      let data = JSON.parse(JSON.stringify(this.mapConfigList))
      if (data.length > 0) {
        if (val === data[0].mapType) {
          this.mapConfigFrom.type = data[0].mapType
          this.mapConfigFrom.tileType = data[0].tileType // 切片类型
          this.mapConfigFrom.targeLayerName = data[0].layerName // 目标图层名称
          let url = null
          if (this.mapConfigFrom.type === 'iserver') {
            url = data[0].mapUrl.substring(0, data[0].mapUrl.lastIndexOf('maps') + 4)
          } else {
            url = data[0].mapUrl
          }
          this.mapConfigFrom.service = url
        } else {
          this.mapConfigFrom.service = ''
          this.mapConfigFrom.zoom = 0
          this.mapConfigFrom.range = this.staticExtentDefaut
        }
      }
    },
    'mapConfigFrom.range'(val) {
      if (val) {
        this.mapStaticPlaceholder = '输入格式:[minx, miny, maxx, maxy]'
      }
    }
  },
  methods: {
    ...mapActions(['get2DConfig', 'get2DIserverConfig', 'setMapServerListApi', 'updateMapServerList', 'loadMapConfigArr', 'deleteMapDataApi']),
    ...mapMutations(['SET_MAP_CONFIG_MOL_STATE', 'SET_EDIT_RIGHT_PAGE_STATE']),
    handleBeforeUpload() {
      // this.confirmButton = true
    },
    // 图片上传
    uploadEditSuccess(val) {
      this.mapStaticInfo = val
      this.mapConfigFrom.service = val.path
      // this.confirmButton = false
    },
    mapFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg、jpeg 或 png 格式的图片。'
      })
    },
    // 地图类型改变
    mapTypeChange(val) {
      this.modalLoading = false
      console.log(val)
    },
    // cannel
    cannel() {
      if (this.activeMap) {
        this.SET_MAP_CONFIG_MOL_STATE(false)
      } else {
        this.$router.replace('/navigation')
      }
    },
    // 地图初始化
    init() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>初始化将会清空当前地图的所有内容</p>',
        onOk: () => {
          this.deleteMapDataApi(this.activeMap)
            .then(res => {
              document.location.reload() // 刷新当前页面
              // this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
              // this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: 'gridEditPage', detail: 'show' })
              // this.cannel()
            })
            .catch(err => {
              console.log(err)
            })
        },
        onCancel: () => {}
      })
    },
    confirm(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.existMapConfig.mapType === this.mapConfigFrom.type && this.existMapConfig.tileType === this.mapConfigFrom.tileType && this.existMapConfig.layerName === this.mapConfigFrom.targeLayerName && this.serviceUrl === this.mapConfigFrom.service) {
            if (this.existMapConfig.zoom !== this.mapConfigFrom.zoom) { // 缩放级别不同时，更新地图服务列表数据
              let configs = JSON.parse(JSON.stringify(this.mapConfigList))
              let updateConfigPromises = [] // 更新地图服务配置的 Promise 数组
              for (let config of configs) { // 遍历地图服务配置列表，更新地图服务配置的缩放级别
                config.zoom = this.mapConfigFrom.zoom
                let updateConfigPromise = this.updateMapServerList(config)
                updateConfigPromises.push(updateConfigPromise)
              }
              Promise.all(updateConfigPromises).then(results => {
                document.location.reload() // 刷新当前页面
              })
            } else {
              this.SET_MAP_CONFIG_MOL_STATE(false)
            }
          } else {
            if (this.mapConfigFrom.type === 'iserver') {
              let index = this.mapConfigFrom.service.length - 'maps'.length
              if (index !== this.mapConfigFrom.service.lastIndexOf('maps')) {
                this.mapConfigFrom.service = ''
                this.mapConfigFrom.zoom = 0
                this.warningMsg('地图服务地址有误，请重新输入')
                this.modalLoading = false
              } else {
                this.modalLoading = true
                this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: '', detail: 'show' })
                this.mapTypeChoose(this.mapConfigFrom)
              }
            } else {
              this.modalLoading = true
              this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: '', detail: 'show' })
              this.mapTypeChoose(this.mapConfigFrom)
            }
          }
        }
      })
    },
    // 根据静态底图的范围得到底图中心点
    getMapCenterByExtent(extent) {
      return spaceAnalysisUtil.getCenterByPolygonExtent(extent)
    },
    // 电子地图类型选择
    mapTypeChoose(val) {
      let type = val.type // 服务类型
      let mapUrl = val.service
      if (type === 'iserver') {
        // console.log('超图')
        const reqUrl = this.mapConfigFrom.service + '.xml'
        this.get2DConfig(reqUrl)
          .then(res => {
            this.setIserMapLIst(res, type)
            // this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
          })
          .catch(err => {
            this.modalLoading = false
            console.log(err)
            this.warningMsg(err)
          })
      } else if (type === 'geoserver') {
        // console.log('蓝星Geo')
        //  const reqUrl = 'http://' + parseurl(mapUrl, true).host + '/geoserver/wms?service=WMS&request=GetCapabilities'
        let tileType = this.mapConfigFrom.tileType
        const reqUrl = mapUrl + '?request=GetCapabilities'
        this.get2DConfig(reqUrl)
          .then(res => {
            if (tileType === 'geoserver') {
              this.setGeoServerTileMapList(res, type, mapUrl)
            } else if (tileType === 'arcgis') {
              this.setGWCArcGisTileMap(res, type, mapUrl)
            }
          })
          .catch(err => {
            this.modalLoading = false
            this.warningMsg(err)
          })
      } else if (type === 'static') {
        // console.log('静态底图')
        this.getStaticMapList(mapUrl, type)
      }
    },
    // 获取地图列表
    getMapListInit() {
      this.loadMapConfigArr()
        .then(ress => {
          if (ress.length > 0) {
            this.modalLoading = false
            // 配置地图的弹框消失
            this.SET_MAP_CONFIG_MOL_STATE(false)
            this.deleteMapDataApi(this.activeMap)
              .then(res => {
                // this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
                this.$store.commit('SET_EDIT_RIGHT_PAGE_STATE', { page: '', detail: 'show' })
                this.cannel()
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
        .catch(errr => {
          console.log(errr)
          this.modalLoading = false
          this.warningMsg('地图服务获取失败，请联系管理员')
        })
    },
    // 获取静态地图列表
    getStaticMapList(url, type) {
      // 静态底图需要设置范围以及根据范围获取中心点
      let staticCenter = this.getMapCenterByExtent(this.mapConfigFrom.range)
      let staticExtent = this.mapConfigFrom.range.split(',')
      staticExtent = [
        parseFloat(staticExtent[0]),
        parseFloat(staticExtent[1]),
        parseFloat(staticExtent[2]),
        parseFloat(staticExtent[3])
      ]
      let mapFeatureList = []
      mapFeatureList.push({
        extent: staticExtent,
        center: staticCenter,
        layerName: this.mapStaticInfo.name,
        matrixSet: this.mapStaticInfo.name,
        mapName: this.mapStaticInfo.name.split('.')[0],
        origin: [119.17222378045, 34.12738221145],
        mapUrl: url,
        mapType: type
      })
      // 地图列表入库
      this.setMapServerListApi(mapFeatureList)
        .then(res => {
          this.modalLoading = false
          document.location.reload() // 刷新当前页面
        })
        .catch(err => {
          this.modalLoading = false
          this.warningMsg('地图设置失败，请重新设置')
          console.log(err)
        })
    },
    getTileMatrixSet(tileMatrixSets, name) { // 获取瓦片的切片网格
      let tileMatixSet = null
      for (let index in tileMatrixSets) {
        const tileMatixSetName = tileMatrixSets[index]['ows:Identifier'][0]
        if (tileMatixSetName === name) {
          tileMatixSet = tileMatrixSets[index]
          break
        }
      }
      return tileMatixSet && tileMatixSet.TileMatrix
    },
    // 设置geoserver瓦片地图列表
    setGeoServerTileMapList(res, type, mapUrl) {
      const {tileType, zoom} = this.mapConfigFrom
      // 获取切片方案数据集-----
      xml2js.parseString(res, (err, result) => {
        if (err) {
          this.warningMsg('地图服务解析失败，请联系管理员')
          return
        }
        let mapFeatureList = []
        const layerInfos = result.Capabilities.Contents[0].Layer
        const tileSets = result.Capabilities.Contents[0].TileMatrixSet
        for (let i = 0; i < layerInfos.length; i++) {
          const layerInfo = layerInfos[i]
          const layerName = layerInfo['ows:Identifier'][0]
          const layerExtent = layerInfo['ows:WGS84BoundingBox'][0]
          const leftCorner = layerExtent['ows:LowerCorner'][0].trim().split(/\s+/)
          const upperCorner = layerExtent['ows:UpperCorner'][0].trim().split(/\s+/)
          const extent = [
            parseFloat(leftCorner[0]),
            parseFloat(leftCorner[1]),
            parseFloat(upperCorner[0]),
            parseFloat(upperCorner[1])
          ]
          let tileOrigin = [extent[0], extent[3]] // 切片起点
          const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
          const layerTitle = layerInfo['ows:Title'][0]
          const matrixSet = layerInfo.TileMatrixSetLink[0].TileMatrixSet[0]
          let resolutions = []
          let gridSets = []
          const tileSet = this.getTileMatrixSet(tileSets, matrixSet)
          for (let index in tileSet) {
            const gridset = tileSet[index]['ows:Identifier'][0]
            gridSets.push(gridset)
            resolutions.push(Number(gridset))
          }
          mapFeatureList.push({
            extent,
            center,
            zoom,
            mapName: layerTitle,
            layerName,
            matrixSet,
            origin: tileOrigin,
            mapUrl: mapUrl,
            mapType: type, // 地图服务类型
            tileType: tileType, // 瓦片类型
            resolutions,
            gridSets
          })
        }
        this.setMapServerListApi(mapFeatureList)
          .then(res => {
            this.modalLoading = false
            document.location.reload() // 刷新当前页面
          })
          .catch(err => {
            this.modalLoading = false
            this.warningMsg('地图服务设置失败，请重新设置')
            console.log(err)
          })
      })
    },
    // 设置geowebcache arcgis瓦片地图
    setGWCArcGisTileMap(res, type, mapUrl) {
      const {tileType, targeLayerName, zoom} = this.mapConfigFrom
      xml2js.parseString(res, (err, result) => {
        if (err) {
          this.warningMsg('地图服务解析失败，请联系管理员')
          return
        }
        let tilingSchemeUrl = mapUrl.replace('service/wmts', targeLayerName + '/conf.xml')
        this.get2DConfig(tilingSchemeUrl).then(tilingSchemeXmlRes => {
          // console.log('xmlRes: ', xmlRes)
          xml2js.parseString(tilingSchemeXmlRes, (err, tilingSchemeXmlResObj) => {
            if (err) {
              this.warningMsg('地图服务解析失败，请联系管理员')
              return
            }
            // console.log('xmlresultObj: ', tilingSchemeXmlResObj)
            let tileCacheInfo = tilingSchemeXmlResObj.CacheInfo.TileCacheInfo[0]
            let tileOrigin = [Number(tileCacheInfo.TileOrigin[0].X[0]), Number(tileCacheInfo.TileOrigin[0].Y[0])] // 切片起点
            let projectionCode = PROJ.PREID + tileCacheInfo.SpatialReference[0].WKID[0] // 投影坐标
            // console.log('projectionCode：', projectionCode)
            let resolutions = []
            // console.log('解析到的切片起点：', tileOrigin)
            let LODInfos = tileCacheInfo.LODInfos[0].LODInfo
            for (const LODInfo of LODInfos) {
              let resolution = Number(LODInfo.Resolution[0])
              resolutions.push(resolution)
            }
            // console.log('解析到的分辨率组：', resolutions)
            let mapFeatureList = []
            const layerInfos = result.Capabilities.Contents[0].Layer
            const tileSets = result.Capabilities.Contents[0].TileMatrixSet
            for (let i = 0; i < layerInfos.length; i++) {
              const layerInfo = layerInfos[i]
              const layerName = layerInfo['ows:Identifier'][0]
              if (targeLayerName && targeLayerName !== layerName) { // grcgis切片只只加载指定图层
                continue
              }
              const layerExtent = layerInfo['ows:WGS84BoundingBox'][0]
              let lowerCorner = layerExtent['ows:LowerCorner'][0].trim().split(/\s+/)
              let upperCorner = layerExtent['ows:UpperCorner'][0].trim().split(/\s+/)
              if (projectionCode !== PROJ.EPSG4326) { // 投影坐标系不是EPSG4326时，左上、右下点转换为墨卡托坐标
                lowerCorner = toMercator(point([ Number(lowerCorner[0]), Number(lowerCorner[1]) ])).geometry.coordinates
                upperCorner = toMercator(point([ Number(upperCorner[0]), Number(upperCorner[1]) ])).geometry.coordinates
                // console.log('lowerCorner to Mercator', lowerCorner)
                // console.log('upperCorner to Mercator', upperCorner)
              }
              const extent = [ Number(lowerCorner[0]), Number(lowerCorner[1]), Number(upperCorner[0]), Number(upperCorner[1]) ]
              const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
              const layerTitle = layerInfo['ows:Title'][0]
              const matrixSet = layerInfo.TileMatrixSetLink[0].TileMatrixSet[0]
              let gridSets = []
              const tileSet = this.getTileMatrixSet(tileSets, matrixSet)
              for (let index in tileSet) {
                const gridset = tileSet[index]['ows:Identifier'][0]
                gridSets.push(gridset)
              }
              mapFeatureList.push({
                extent,
                center,
                zoom,
                mapName: layerTitle,
                layerName,
                matrixSet,
                origin: tileOrigin,
                mapUrl: mapUrl,
                mapType: type,
                tileType: tileType,
                resolutions,
                gridSets,
                projection: projectionCode
              })
            }
            this.setMapServerListApi(mapFeatureList).then(res => { // 设置地图服务配置列表
              this.modalLoading = false
              document.location.reload() // 刷新当前页面
            }).catch(err => {
              this.modalLoading = false
              this.warningMsg('地图服务设置失败，请重新设置')
              console.log(err)
            })
          })
        })
      })
    },
    // 设置超图地图列表
    setIserMapLIst(val, type) {
      xml2js.parseString(val, (err, result) => {
        if (err) {
          this.warningMsg('地图服务解析失败，请联系管理员')
          return
        }
        let param = result.list.ChildResource
        let newparam = {}
        const promises = param.map(element => {
          let reqUrl = element.path[0]
          newparam[element.name[0]] = element.path[0]
          return this.get2DIserverConfig(reqUrl + '.json')
        })
        let mapIserList = []
        Promise.all(promises)
          .then(resp => {
            resp.forEach(element => {
              let res = JSON.parse(element)
              const { left, bottom, right, top } = res.bounds
              const extent = [parseFloat(left), parseFloat(bottom), parseFloat(right), parseFloat(top)]
              const center = [parseFloat(res.center.x), parseFloat(res.center.y)]
              let resolutions = getMapResolutions(newparam[res.name], res).slice(2, 8)
              mapIserList.push({
                extent: extent,
                center: center,
                mapName: res.name,
                layerName: res.name,
                matrixSet: res.name,
                origin: [parseFloat(left), parseFloat(top)],
                mapUrl: newparam[res.name],
                mapType: type,
                resolutions
              })
            })
            // 将地图列表入库
            this.setMapServerListApi(mapIserList)
              .then(res => {
                this.modalLoading = false
                document.location.reload() // 刷新当前页面
              })
              .catch(err => {
                this.modalLoading = false
                this.warningMsg('地图服务设置失败，请重新设置')
                console.log(err)
              })
          })
          .catch(err => {
            this.modalLoading = false
            console.log(err)
            this.warningMsg('地图服务解析失败，请联系管理员')
          })
      })
    }
  },
  created() {
    let data = JSON.parse(JSON.stringify(this.mapConfigList))
    if (data.length > 0) {
      this.existMapConfig = data[0]
      this.mapConfigFrom.zoom = data[0].zoom
      this.mapConfigFrom.type = data[0].mapType // 地图类型
      this.mapConfigFrom.tileType = data[0].tileType // 切片类型
      this.mapConfigFrom.targeLayerName = data[0].layerName // 目标图层名称
      if (this.mapConfigFrom.type === 'iserver') {
        this.serviceUrl = data[0].mapUrl.substring(0, data[0].mapUrl.lastIndexOf('maps') + 4)
      } else {
        this.serviceUrl = data[0].mapUrl
      }
      this.mapConfigFrom.service = this.serviceUrl
      this.mapConfigFrom.range = data[0].extent.toString()
    }
  }
}
</script>
<style scoped>
.mapConfigHome {
  width: 600px;
}

.mapConfigHome .mapConfigHeader {
  font-size: 14px;
  color: #fff;
}

.mapConfigContent {
  margin: 0 10px;
}
</style>
