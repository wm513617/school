/* eslint-disable new-cap */
/* eslint-disable no-undef */
import { mapGetters, mapActions } from 'vuex'
import { RESICONOID } from 'assets/2DMap/meta/common'
import { addPoint, addLayer, markerTypes } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {
      oidArr: {
        boltipc: RESICONOID.boltipc,
        redBoltipc: RESICONOID.redBoltipc,
        halfBallipc: RESICONOID.halfBallipc,
        fastBallipc: RESICONOID.fastBallipc,
        allViewipc: RESICONOID.allViewipc,
        verface: RESICONOID.verfaceipc,
        traffic: RESICONOID.trafficipc
      }
    }
  },
  computed: {
    ...mapGetters('fengMap', [
      'boltipcfmResourceArr',
      'halfBallipcfmResourceArr',
      'fastBallipcfmResourceArr',
      'allViewipcfmResourceArr',
      'redBoltipcfmResourceArr',
      'verfaceipcfmResourceArr',
      'trafficipcfmResourceArr',
      'boltipc', // 枪机
      'redBoltipc', // 红外枪机
      'halfBallipc', // 半球
      'fastBallipc', // 快球
      'allViewipc', // 全景
      'verface', // 人脸抓拍
      'traffic', // 交通抓拍
      'sector'
    ])
  },
  watch: {
    boltipc(val) {
      this.changePointLayerState(RESICONOID.boltipc, val)
      this.changeSectorLayerState(RESICONOID.boltipc, val && this.sector)
    },
    redBoltipc(val) {
      this.changePointLayerState(RESICONOID.redBoltipc, val)
      this.changeSectorLayerState(RESICONOID.redBoltipc, val && this.sector)
    },
    halfBallipc(val) {
      this.changePointLayerState(RESICONOID.halfBallipc, val)
      this.changeSectorLayerState(RESICONOID.halfBallipc, val && this.sector)
    },
    fastBallipc(val) {
      this.changePointLayerState(RESICONOID.fastBallipc, val)
      this.changeSectorLayerState(RESICONOID.fastBallipc, val && this.sector)
    },
    allViewipc(val) {
      this.changePointLayerState(RESICONOID.allViewipc, val)
      this.changeSectorLayerState(RESICONOID.allViewipc, val && this.sector)
    },
    verface(val) {
      this.changePointLayerState(RESICONOID.verfaceipc, val)
      this.changeSectorLayerState(RESICONOID.verfaceipc, val && this.sector)
    },
    traffic(val) {
      this.changePointLayerState(RESICONOID.trafficipc, val)
      this.changeSectorLayerState(RESICONOID.trafficipc, val && this.sector)
    },
    sector(val) {
      for (let i in this.oidArr) {
        this.changeSectorLayerState(this.oidArr[i], val && this[i])
      }
    },
    boltipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.boltipc)
      },
      deep: true
    },
    halfBallipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.halfBallipc)
      },
      deep: true
    },
    fastBallipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.fastBallipc)
      },
      deep: true
    },
    allViewipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.allViewipc)
      },
      deep: true
    },
    redBoltipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.redBoltipc)
      },
      deep: true
    },
    verfaceipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.verfaceipc)
      },
      deep: true
    },
    trafficipcfmResourceArr: { // 枪机
      handler(arr) { // 添加图层和marker
        this.addfmVideoPoint(arr, RESICONOID.trafficipc)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('fengMap', [
      'savefmResourcePoint'
    ]),
    initfmVideosLayers() { // 初始化添加不同类型的图层
      for (let i in this.oidArr) {
        // 添加图标图层
        this.addVideoLayer('layer', markerTypes.marker, i)
        // 添加可视域图层
        this.addVideoLayer('sectorLayer', markerTypes.sector, i)
      }
    },
    addVideoLayer(layerType, markerType, i) {
      const m = this.oidArr[i]
      let layerName = layerType + m
      let show
      if (markerType === markerTypes.marker) {
        this[layerName] = new fengmap.FMImageMarkerLayer()
        show = this[i]
      } else if (markerType === markerTypes.sector) {
        this[layerName] = new fengmap.FMPolygonMarkerLayer()
        show = this[i] && this.sector
      }
      this.fmgroup.addLayer(this[layerName])
      this[layerName].show = show // 图层默认显隐
      addLayer(this[layerName]._scene.id, {type: m, markerType: markerType})
    },
    addVideoMarkers(obj) { // 添加点位
      const gpos = obj.gpos.split(',')
      const im = new fengmap.FMImageMarker({
        x: gpos[0], // 标注x坐标点
        y: gpos[1], // 标注y坐标点
        url: obj.icon, // 设置图片路径
        size: 32, // 设置图片显示尺寸
        height: gpos[2] || 5 // 标注高度，大于model的高度
      })
      const layer = 'layer' + obj.subtype
      if (!this[layer]) {
        this.initfmVideosLayers()
      }
      this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.subtype, {id: im.renderNode.id, channelId: obj.id})
    },
    addfmVideoPoint(arr, type) { // 获取默认图标，添加 type类 所有的点位
      this.queryDefaultfmIconByOid(type).then(res => {
        let icon
        let files = res.files
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].point && arr[i].point.mid && arr[i].point.mid.files) {
            files = arr[i].point.mid.files
          }
          files && files.map(item => { if (item.status === 'online') { icon = item.path } })
          this.addVideoMarkers({
            gpos: arr[i].point.loc,
            icon: icon,
            subtype: type,
            id: arr[i]._id
          })
          this.addSectorMarkers(type, arr[i])
        }
      }).catch(err => {
        console.log('bolt icon:', err)
      })
    },
    addVideoResToMap(coods) { // 添加视频资源到地图中
      if (this.fengMap) {
        let level = Math.floor(this.fengMap.mapScaleLevel)
        let firm = (this.selectedFMapPointRes && this.selectedFMapPointRes.eid && this.selectedFMapPointRes.eid.manufacturer) ? this.selectedFMapPointRes.eid.manufacturer : '-'
        let radius = this.isfmOuter ? 50 : 10
        const loc = coods.split(',')
        let point = {
          class: level, // 点位层级
          firm, // 厂商
          principal: [{ name: '', mobile: '' }], // 联系方式
          loc: loc[0] + ',' + loc[1], // 经纬度
          radius, // 照射半径
          angle: 0, // 点位角度
          viewshed: 90, // 可视域
          isouter: this.isfmOuter,
          projection: this.mapProjection // 当前地图投影坐标系
        }
        if (this.activeFMap) {
          point.mapId = this.activeFMap // 地图标识 this.activeMapConfig.mapId
        }
        let videoData = JSON.parse(JSON.stringify(this.selectedFMapPointRes))
        videoData.point = point
        this.savefmResourcePoint({ _id: videoData._id, body: videoData }).then(res => {
          const oid = this.getVideoSubtype(videoData)
          this.addVideoMarkers({gpos: coods, icon: this.defaultfmPointIcon.files[0].path, subtype: oid, id: videoData._id})
          this.addSectorMarkers(oid, videoData)
          this.setPointStatus()
          this.successMsg('视频点位添加成功')
          this.updatePointTreeCount('video')
        }).catch(err => {
          this.SET_POINT_FMDRAW_ACTIVE(false)
          this.$Modal.confirm({
            title: '警告',
            content: '<p>' + err.response.data.message + '</p>'
          })
        })
      }
    },
    changePointLayerState(type, val) { // 控制显隐
      if (this['layer' + type]) { this['layer' + type].show = val }
    },
    addSectorMarkers(type, resource) { // 添加可视域
      const data = resource.point
      data.startAngle = data.angle - data.viewshed / 2
      data.endAngle = data.angle + data.viewshed / 2
      let points = []
      const loc = data.loc.split(',').map(item => Number(item))
      let center = {x: loc[0], y: loc[1]} // 中心点
      let { radius, segments = 60, endAngle = 360, startAngle = 0 } = data
      let angle = endAngle - startAngle // 扇形角度
      let anglePer = angle / segments // 每个分割扇形角度
      points.push(center)
      for (let i = 1; i < segments; ++i) { // 遍历分割数量，将旋转后的点放入点集中
        let rotatedAngle = (i * anglePer + startAngle) * Math.PI / 180
        let point = {x: center.x + radius * Math.cos(rotatedAngle), y: center.y + radius * Math.sin(rotatedAngle)} // 计算旋转点
        points.push(point)
      }
      points.push(center)
      const polygonMarker = new fengmap.FMPolygonMarker({
        alpha: 0.5, // 设置透明度
        lineWidth: 0.1, // 设置边框线的宽度
        color: '#ff8800',
        height: loc[2] || 5, // 设置高度*/
        points: points // 多边形坐标点
      })
      this['sectorLayer' + type].addMarker(polygonMarker) // 文本标注层添加文本Marker
      addPoint(markerTypes.sector, type, {id: polygonMarker.renderNode.id, channelId: resource._id})
    },
    changeSectorLayerState(type, val) { // 控制可视域显隐
      if (this['sectorLayer' + type]) { this['sectorLayer' + type].show = val }
    }
  }
}
