import { mapGetters } from 'vuex'
import { RESICONOID } from 'assets/fengMap/meta/common'
import { addPoint, addLayer, markerTypes } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters('fengMap', ['patrolResourceArr'])
  },
  watch: {
    // 监听巡更点位左侧勾选状态
    patrol(val) {
      this.changePatrolPointLayerState(RESICONOID.commonPatrol, val)
      this.changePatrolLabelLayerState(RESICONOID.commonPatrol, val && this.isNameTitle)
    },
    // 监听左侧名称标签状态
    isNameTitle(val) {
      this.changePatrolLabelLayerState(RESICONOID.commonPatrol, val && this.patrol)
    },
    patrolResourceArr: {
      handler(arr) {
        this.addfmPatrolPoint(arr, RESICONOID.commonPatrol)
      },
      deep: true
    }
  },
  methods: {
    addfmPatrolPoint(arr, type) {
      this.queryDefaultfmIconByOid(type).then(res => {
        for (let i = 0; i < arr.length; i++) {
          this.drawPatrolPoint(arr[i], res.files, type)
        }
      }, err => {
        console.log('common doorControl icon:', err)
      })
    },
    drawPatrolPoint(item, iconFiles, type) {
      let icon = null
      let files = null
      if (item.point && item.point.mid && item.point.mid.files) {
        files = item.point.mid.files
      } else {
        files = iconFiles
      }
      icon = files.find(item => item.status === 'online').path
      this.addPatrolMarkers({
        gpos: item.point.geo,
        icon: icon,
        type: type,
        id: item._id
      }) // 添加图标图层标注
      this.addPatrolTextMarkers(type, item)
    },
    addPatrolMarkers(obj) {
      const gpos = obj.gpos.split(',')
      const im = new fengmap.FMImageMarker({
        x: gpos[0], // 标注x坐标点
        y: gpos[1], // 标注y坐标点
        url: obj.icon, // 设置图片路径
        size: 32, // 设置图片显示尺寸
        height: gpos[2] || 5 // 标注高度，大于model的高度
      })
      const layer = 'iconLayer' + obj.type
      if (!this[layer]) {
        this.initfmPatrolLayers(obj.type)
      }
      this[layer] && this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.type, {id: im.renderNode.id, channelId: obj.id})
    },
    addPatrolTextMarkers(type, item) {
      const gpos = item.point.geo.split(',')
      const tm = new fengmap.FMTextMarker({
        name: item.devName,
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
    initfmPatrolLayers(type) {
      // 添加图标图层
      this.addPatrolLayer('iconLayer', markerTypes.marker, type)
      // 添加文字图层
      this.addPatrolLayer('labelLayer', markerTypes.label, type)
    },
    addPatrolLayer(layerType, markerType, type) {
      const layerName = layerType + type
      let show
      if (markerType === markerTypes.marker) {
        this[layerName] = new fengmap.FMImageMarkerLayer()
        show = this.patrol // 定义门禁根据右侧门禁选项勾选状态是否显示
      } else if (markerType === markerTypes.label) {
        this[layerName] = new fengmap.FMTextMarkerLayer()
        show = this.patrol && this.isNameTitle // 定义门禁名称根据右侧门禁选项和名称标签选项勾选状态是否显示
      }
      this.fmgroup.addLayer(this[layerName])
      this[layerName].show = show // 图层默认显隐
      addLayer(this[layerName]._scene.id, {type: type, markerType: markerType})
    },
    changePatrolPointLayerState(type, flag) {
      if (this['iconLayer' + type]) {
        this['iconLayer' + type].show = flag
      }
    },
    changePatrolLabelLayerState(type, flag) {
      if (this['labelLayer' + type]) {
        this['labelLayer' + type].show = flag
      }
    }
  }
}
