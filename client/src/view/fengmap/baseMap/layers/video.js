import { mapGetters } from 'vuex'
import { RESICONOID } from 'assets/fengMap/meta/common'
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
      'trafficipcfmResourceArr'
    ])
  },
  watch: {
    // 监听视频个点位勾选状态
    boltipc(val) {
      this.changePointLayerState(RESICONOID.boltipc, val)
      this.changeSectorLayerState(RESICONOID.boltipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.boltipc, val && this.isNameTitle)
    },
    redBoltipc(val) {
      this.changePointLayerState(RESICONOID.redBoltipc, val)
      this.changeSectorLayerState(RESICONOID.redBoltipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.redBoltipc, val && this.isNameTitle)
    },
    halfBallipc(val) {
      this.changePointLayerState(RESICONOID.halfBallipc, val)
      this.changeSectorLayerState(RESICONOID.halfBallipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.halfBallipc, val && this.isNameTitle)
    },
    fastBallipc(val) {
      this.changePointLayerState(RESICONOID.fastBallipc, val)
      this.changeSectorLayerState(RESICONOID.fastBallipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.fastBallipc, val && this.isNameTitle)
    },
    allViewipc(val) {
      this.changePointLayerState(RESICONOID.allViewipc, val)
      this.changeSectorLayerState(RESICONOID.allViewipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.allViewipc, val && this.isNameTitle)
    },
    verface(val) {
      this.changePointLayerState(RESICONOID.verfaceipc, val)
      this.changeSectorLayerState(RESICONOID.verfaceipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.verfaceipc, val && this.isNameTitle)
    },
    traffic(val) {
      this.changePointLayerState(RESICONOID.trafficipc, val)
      this.changeSectorLayerState(RESICONOID.trafficipc, val && this.sector)
      this.changeLabelLayerState(RESICONOID.trafficipc, val && this.isNameTitle)
    },
    sector(val) { // 监听右侧可视域状态
      for (let i in this.oidArr) {
        this.changeSectorLayerState(this.oidArr[i], val && this[i]) // 传入当前资源类型 并判断可视域和当前右侧资源是否勾选
      }
    },
    isNameTitle(val) { // 监听右侧名称标签状态
      for (let i in this.oidArr) {
        this.changeLabelLayerState(this.oidArr[i], val && this[i]) // 传入当前资源类型 并判断名称标签和当前右侧资源是否勾选
      }
    },
    // 监听视频各点位数据
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

    initfmVideosLayers() { // 初始化添加不同类型的图层
      for (let i in this.oidArr) {
        // 添加图标图层
        this.addVideoLayer('iconLayer', markerTypes.marker, i)
        // 添加文字图层
        this.addVideoLayer('labelLayer', markerTypes.label, i)
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
        show = this[i] // 定义视频图标根据右侧对应视频框选状态是否显示
      } else if (markerType === markerTypes.sector) {
        this[layerName] = new fengmap.FMPolygonMarkerLayer()
        show = this[i] && this.sector // 定义视频可视域根据右侧可视域框选状态是否显示
      } else if (markerType === markerTypes.label) {
        this[layerName] = new fengmap.FMTextMarkerLayer()
        show = this[i] && this.isNameTitle // 右侧视频对应是否勾选并且名称标签是否勾选
      }
      this.fmgroup.addLayer(this[layerName])
      this[layerName].show = show // 图层默认显隐
      addLayer(this[layerName]._scene.id, {type: m, markerType: markerType})
    },
    addfmVideoPoint(arr, type) { // 获取默认图标，添加 type类 所有的点位
      this.queryDefaultfmIconByOid(type).then(res => {
        for (let item of arr) {
          let icon = null
          if (item.eid.hasOwnProperty('deviceStatus')) { // 有此属性
            if (item.eid.deviceStatus) { // 设备启用
              if (item.status) {
                icon = res.files.find(item => item.status === 'online').path
              } else {
                icon = res.files.find(item => item.status === 'offline').path
              }
            } else {
              icon = res.files.find(item => item.status === 'stopped').path
            }
          } else { // 没有此属性为启用
            if (item.status) {
              icon = res.files.find(item => item.status === 'online').path
            } else {
              icon = res.files.find(item => item.status === 'offline').path
            }
          }
          this.addVideoMarkers({
            gpos: item.point.loc,
            icon: icon,
            subtype: type,
            id: item._id
          })
          this.addTextMarkers(type, item)
          this.addSectorMarkers(type, item)
        }
      }).catch(err => {
        console.log('bolt icon:', err)
      })
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
      const layer = 'iconLayer' + obj.subtype
      if (!this[layer]) {
        this.initfmVideosLayers()
      }
      this[layer] && this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.subtype, {id: im.renderNode.id, channelId: obj.id})
    },
    addTextMarkers(type, item) {
      const gpos = item.point.loc.split(',')
      const tm = new fengmap.FMTextMarker({
        name: item.name,
        x: gpos[0], // 标注x坐标点
        y: gpos[1], // 标注y坐标点
        // 文字标注样式设置
        fillcolor: '255,255,255', // 填充色
        fontsize: 12, // 字体大小
        strokecolor: '0,0,0', // 边框色
        alpha: 1 // 文本标注透明度
      })
      tm.height = 20
      this['labelLayer' + type] && this['labelLayer' + type].addMarker(tm)
      addPoint(markerTypes.label, type, {id: tm.renderNode.id, channelId: item.id})
    },
    addSectorMarkers(type, item) { // 添加可视域
      let data = item.point
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
      addPoint(markerTypes.sector, type, {id: polygonMarker.renderNode.id, channelId: item.id})
    },
    changePointLayerState(type, val) { // 控制点位显隐
      if (this['iconLayer' + type]) { this['iconLayer' + type].show = val }
    },
    changeSectorLayerState(type, val) { // 控制可视域显隐
      if (this['sectorLayer' + type]) { this['sectorLayer' + type].show = val }
    },
    changeLabelLayerState(type, val) { // 控制名称标签显隐
      this['labelLayer' + type] && (this['labelLayer' + type].show = val)
    }
  }
}
