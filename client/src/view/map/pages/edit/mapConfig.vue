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
        <div v-if="mapConfigFrom.type === 'static'" class="staticClass">
          <FormItem label="文件选择" prop="service">
            <Row>
              <Col span="19">
                <Input v-model="mapConfigFrom.service" disabled placeholder="请选择地图文件" style="float:left" />
              </Col>
              <Col span="4">
                <Upload ref="upload" action="/api/upload" :show-upload-list="false" :before-upload="handleBeforeUpload" :on-success="uploadEditSuccess" :multiple="false" :format="['jpg','jpeg','png']" :on-format-error="mapFormatError">
                  <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
                </Upload>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="范围" prop="range">
            <Input v-model="mapConfigFrom.range" :placeholder="mapStaticPlaceholder" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'iserver'">
          <FormItem label="服务器地址" prop="service">
            <Input v-model="mapConfigFrom.service" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type ===  'geoserver'">
          <FormItem label="服务器地址" prop="service">
            <Input v-model="mapConfigFrom.service" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'baiduMap'">
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
          <FormItem label="级别" prop="service">
            <Input v-model="mapConfigFrom.level" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'googleMap'">
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
          <FormItem label="级别" prop="service">
            <Input v-model="mapConfigFrom.level" placeholder="" />
          </FormItem>

        </div>
        <div v-if="mapConfigFrom.type === 'tianMap'">
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
          <FormItem label="级别" prop="service">
            <Input v-model="mapConfigFrom.level" placeholder="" />
          </FormItem>
        </div>
        <div v-if="mapConfigFrom.type === 'gaodeMap'">
          <FormItem label="中心点" prop="service">
            <Input v-model="mapConfigFrom.centerPoint" placeholder="" />
          </FormItem>
          <FormItem label="级别" prop="service">
            <Input v-model="mapConfigFrom.level" placeholder="" />
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
        type: 'geoserver',
        centerPoint: '',
        range: '',
        service: '',
        level: ''
      },
      mapStaticPlaceholder: '',
      serviceUrl: '',
      pictureObj: {},
      uploadList: [], // 上传列表
      // 表单验证
      ruleValidate: {
        type: [{ required: true, message: '请选择地图类型', trigger: 'blur' }],
        service: [{ required: true, validator: mapServerCheck, trigger: 'change' }],
        range: [{ required: true, validator: mapExtentCheck, trigger: 'change' }],
        centerPoint: [{ required: true, message: '请输入地图中心点', trigger: 'change' }],
        level: [{ required: true, message: '请输入地图级别', trigger: 'change' }]
      },
      // 地图数据源
      mapDataOrgin: [
        { text: '蓝星', label: 'geoserver', valve: 'geoserver', disable: false },
        { text: '超图', label: 'iserver', valve: 'iserver', disable: false },
        { text: '谷歌', label: 'googleMap', valve: 'googleMap', disable: true },
        { text: '百度', label: 'baiduMap', valve: 'baiduMap', disable: true },
        { text: '天地图', label: 'tianMap', valve: 'tianMap', disable: true },
        { text: '高德', label: 'gaodeMap', valve: 'gaodeMap', disable: true },
        { text: '静态', label: 'static', valve: 'static', disable: false }
      ],
      staticExtentDefaut: '116.24261269642659,40.21687592760154,116.27199903984895,40.2462622710239',
      confirmButton: false
    }
  },
  computed: {
    ...mapState({
      mapConfigMol: ({ mapPageState }) => mapPageState.mapConfigMol,
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList, // 地图列表
      mapStaticInfo: ({ mapGisData }) => mapGisData.mapStaticInfo
    })
  },
  watch: {
    'mapConfigFrom.type'(val) {
      let data = JSON.parse(JSON.stringify(this.mapConfigList))
      if (data.length > 0) {
        if (val === data[0].mapType) {
          this.mapConfigFrom.type = data[0].mapType
          let url = null
          if (this.mapConfigFrom.type === 'iserver') {
            url = data[0].mapUrl.substring(0, data[0].mapUrl.lastIndexOf('maps') + 4)
          } else {
            url = data[0].mapUrl
          }
          this.mapConfigFrom.service = url
        } else {
          this.mapConfigFrom.service = ''
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
    ...mapActions(['getConfig', 'getIserverConfig', 'setMapServerList', 'getMapServerList', 'deleteMapData']),
    ...mapMutations(['SET_MAPCONFIGMOL_STATE', 'SET_MAPSTATIC_INFO', 'SET_EDITRIGHTPAGE_STATE']),
    handleBeforeUpload() {
      // this.confirmButton = true
    },
    // 图片上传
    uploadEditSuccess(val) {
      this.pictureObj = val
      this.$store.commit('SET_MAPSTATIC_INFO', val)
      this.mapConfigFrom.service = '/api/upload?id=' + val.id
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
        this.$store.commit('SET_MAPCONFIGMOL_STATE', false)
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
          this.deleteMapData(this.activeMap)
            .then(res => {
              this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
              this.cannel()
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
          if (this.serviceUrl === this.mapConfigFrom.service) {
            this.$store.commit('SET_MAPCONFIGMOL_STATE', false)
            return
          }
          if (this.mapConfigFrom.type === 'iserver') {
            let index = this.mapConfigFrom.service.length - 'maps'.length
            if (index !== this.mapConfigFrom.service.lastIndexOf('maps')) {
              this.mapConfigFrom.service = ''
              this.warningMsg('地图服务地址有误，请重新输入')
              this.modalLoading = false
            } else {
              this.modalLoading = true
              this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
              this.mapTypeChoose(this.mapConfigFrom)
            }
          } else {
            this.modalLoading = true
            this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
            this.mapTypeChoose(this.mapConfigFrom)
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
      let type = val.type
      let mapUrl = val.service
      if (type === 'iserver') {
        console.log('超图')
        const reqUrl = this.mapConfigFrom.service + '.xml'
        this.getConfig(reqUrl)
          .then(res => {
            this.setIserMapLIst(res, type)
            this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
          })
          .catch(err => {
            this.modalLoading = false
            console.log(err)
            this.warningMsg(err)
          })
      } else if (type === 'geoserver') {
        console.log('蓝星Geo')
        //  const reqUrl = 'http://' + parseurl(mapUrl, true).host + '/geoserver/wms?service=WMS&request=GetCapabilities'
        const reqUrl = mapUrl + '?request=GetCapabilities'
        this.getConfig(reqUrl)
          .then(res => {
            this.setGeoMapLIst(res, type, mapUrl)
            this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
          })
          .catch(err => {
            this.modalLoading = false
            this.warningMsg(err)
          })
      } else if (type === 'static') {
        console.log('静态底图')
        this.getStaticMapList(mapUrl, type)
      }
    },
    // 获取地图列表
    getMapListInit() {
      this.getMapServerList()
        .then(ress => {
          if (ress.length > 0) {
            this.modalLoading = false
            // 配置地图的弹框消失
            this.$store.commit('SET_MAPCONFIGMOL_STATE', false)
            this.deleteMapData(this.activeMap)
              .then(res => {
                this.$store.commit('SET_EDITHIGHTLIGHT_LIST', [])
                this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
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
      this.setMapServerList(mapFeatureList)
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
    // 设置geo地图列表
    setGeoMapLIst(res, type, mapUrl) {
      // 获取切片方案数据集-----
      const getTileMatrixSet = (tileMatrixSets, name) => {
        let tileMatixSet = null
        for (let index in tileMatrixSets) {
          const tileMatixSetName = tileMatrixSets[index]['ows:Identifier'][0]
          if (tileMatixSetName === name) {
            tileMatixSet = tileMatrixSets[index]
            break
          }
        }
        return tileMatixSet && tileMatixSet.TileMatrix
      }
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
          const layerTitle = layerInfo['ows:Title'][0]
          const layerName = layerInfo['ows:Identifier'][0]
          const layerExtent = layerInfo['ows:WGS84BoundingBox'][0]
          const matrixSet = layerInfo.TileMatrixSetLink[0].TileMatrixSet[0]
          const leftCorner = layerExtent['ows:LowerCorner'][0].trim().split(/\s+/)
          const upperCorner = layerExtent['ows:UpperCorner'][0].trim().split(/\s+/)
          const extent = [
            parseFloat(leftCorner[0]),
            parseFloat(leftCorner[1]),
            parseFloat(upperCorner[0]),
            parseFloat(upperCorner[1])
          ]
          const x = (extent[0] + extent[2]) / 2
          const y = (extent[1] + extent[3]) / 2
          let resolutions = []
          let gridSets = []
          const tileSet = getTileMatrixSet(tileSets, matrixSet)
          for (let index in tileSet) {
            const gridset = tileSet[index]['ows:Identifier'][0]
            gridSets.push(gridset)
            resolutions.push(Number(gridset))
          }
          mapFeatureList.push({
            extent: extent,
            center: [x, y],
            mapName: layerTitle,
            layerName,
            matrixSet,
            origin: [extent[0], extent[3]],
            mapUrl: mapUrl,
            mapType: type,
            resolutions,
            gridSets
          })
        }
        this.setMapServerList(mapFeatureList)
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
          return this.getIserverConfig(reqUrl + '.json')
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
            this.setMapServerList(mapIserList)
              .then(res => {
                this.modalLoading = false
                // 获取地图列表
                this.getMapListInit()
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
      this.mapConfigFrom.type = data[0].mapType
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
