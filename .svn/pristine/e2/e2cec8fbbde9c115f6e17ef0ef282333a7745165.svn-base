import { mapGetters } from 'vuex'
import { RESICONOID} from 'assets/fengMap/meta/common'
import { addPoint, addLayer, markerTypes } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters('fengMap', ['alarmColumnfmResourceArr'])
  },
  watch: {
    // 监听报警柱点位右侧勾选状态
    alarmColumn(val) {
      this.changeAlarmColumnPointLayerState(RESICONOID.alarmColumn, val)
      this.changeAlarmColumnLabelLayerState(RESICONOID.alarmColumn, val && this.isNameTitle)
    },
    // 监听左侧名称标签状态
    isNameTitle(val) {
      this.changeAlarmColumnLabelLayerState(RESICONOID.alarmColumn, val && this.alarmColumn)
    },
    alarmColumnfmResourceArr: {
      handler(arr) {
        this.addfmAlarmColumnPoint(arr, RESICONOID.alarmColumn)
      },
      deep: true
    }
  },
  methods: {
    addfmAlarmColumnPoint(arr, type) {
      this.queryDefaultfmIconByOid(type).then(res => {
        for (let i = 0; i < arr.length; i++) {
          this.drawAlarmColumnPoint(arr[i], res.files, type)
        }
      }, err => {
        console.log('common alarmColumn icon:', err)
      })
    },
    drawAlarmColumnPoint(item, iconFiles, type) {
      let icon = null
      let files = null
      if (item.point && item.point.mid && item.point.mid.files) {
        files = item.point.mid.files
      } else {
        files = iconFiles
      }
      if (item.eid.hasOwnProperty('deviceStatus')) {
        if (item.eid.deviceStatus) { // 设备启用
          icon = files.find(item => item.status === 'online').path
        } else {
          icon = files.find(item => item.status === 'stopped').path
        }
      } else { // 没有此属性为启用
        icon = files.find(item => item.status === 'online').path
      }
      this.addAlarmColumnMarkers({
        gpos: item.point.loc,
        icon: icon,
        type: type,
        id: item._id
      }) // 添加图标图层标注
      this.addAlarmColumnTextMarkers(type, item)
    },
    addAlarmColumnMarkers(obj) {
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
        this.initfmAlarmColumnLayers(obj.type)
      }
      this[layer] && this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.type, {id: im.renderNode.id, channelId: obj.id})
    },
    addAlarmColumnTextMarkers(type, item) {
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
    initfmAlarmColumnLayers(type) {
      // 添加图标图层
      this.addAlarmColumnLayer('iconLayer', markerTypes.marker, type)
      // 添加文字图层
      this.addAlarmColumnLayer('labelLayer', markerTypes.label, type)
    },
    addAlarmColumnLayer(layerType, markerType, type) {
      const layerName = layerType + type
      let show
      if (markerType === markerTypes.marker) {
        this[layerName] = new fengmap.FMImageMarkerLayer()
        show = this.alarmColumn // 定义报警图标根据右侧普通报警选项勾选状态是否显示
      } else if (markerType === markerTypes.label) {
        this[layerName] = new fengmap.FMTextMarkerLayer()
        show = this.alarmColumn && this.isNameTitle // 定义报警名称根据右侧报警选项和名称标签选项勾选状态是否显示
      }
      this.fmgroup.addLayer(this[layerName])
      this[layerName].show = show // 图层默认显隐
      addLayer(this[layerName]._scene.id, {type: type, markerType: markerType})
    },
    changeAlarmColumnPointLayerState(type, flag) {
      if (this['iconLayer' + type]) {
        this['iconLayer' + type].show = flag
      }
    },
    changeAlarmColumnLabelLayerState(type, flag) {
      if (this['labelLayer' + type]) {
        this['labelLayer' + type].show = flag
      }
    }
  }
}
