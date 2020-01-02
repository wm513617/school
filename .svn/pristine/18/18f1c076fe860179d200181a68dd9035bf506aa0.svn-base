import { mapGetters } from 'vuex'
import { RESICONOID} from 'assets/fengMap/meta/common'
import { addPoint, addLayer, markerTypes } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters('fengMap', ['commonAlarmfmResourceArr'])
  },
  watch: {
    // 监听普通报警点位右侧勾选状态
    commonAlarm(val) {
      this.changeCommonAlarmPointLayerState(RESICONOID.commonAlarm, val)
      this.changeCommonAlarmLabelLayerState(RESICONOID.commonAlarm, val && this.isNameTitle)
    },
    isNameTitle(val) { // 监听右侧名称标签状态
      this.changeCommonAlarmLabelLayerState(RESICONOID.commonAlarm, val && this.commonAlarm) // 传入当前资源类型 并判断名称标签和当前右侧资源是否勾选
    },
    commonAlarmfmResourceArr: {
      handler(arr) { // 添加图层和marker
        this.addfmCommonAlarmPoint(arr, RESICONOID.commonAlarm)
      },
      deep: true
    }
  },
  methods: {
    addfmCommonAlarmPoint(arr, type) {
      this.queryDefaultfmIconByOid(type).then(res => {
        for (let i = 0; i < arr.length; i++) {
          this.drawPoint(arr[i], res.files, type)
          /* const signtype = arr[i].mapsign && arr[i].mapsign.signtype
          if (signtype === MPSIGNKEY.point) {
            this.drawPoint(arr[i], res.files, type)
          } else if (signtype === MPSIGNKEY.lineString) {

          } else if (signtype === MPSIGNKEY.polygon) {

          } else {
            this.drawPoint(arr[i], res.files, type)
          } */
        }
      }, err => {
        console.log('common alarm icon:', err)
      })
    },
    drawPoint(item, iconFiles, type) {
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
      // files && files.map(item => { if (item.status === 'online') { icon = item.path } })
      this.addCommonAlarmMarkers({
        gpos: item.point.loc,
        icon: icon,
        type: type,
        id: item._id
      }) // 添加图标图层标注
      this.addCommonAlarmTextMarkers(type, item)
    },
    addCommonAlarmMarkers(obj) { // 添加点位
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
        this.initfmCommonAlarmLayers(obj.type)
      }
      this[layer] && this[layer].addMarker(im)
      // 将marker ID 与 资源ID 绑定存储到 全局变量
      addPoint(markerTypes.marker, obj.type, {id: im.renderNode.id, channelId: obj.id})
    },
    addCommonAlarmTextMarkers(type, item) {
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
    initfmCommonAlarmLayers(type) { // 初始化添加不同类型的图层
      // 添加图标图层
      this.addCommonAlarmLayer('iconLayer', markerTypes.marker, type)
      // 添加文字图层
      this.addCommonAlarmLayer('labelLayer', markerTypes.label, type)
    },
    addCommonAlarmLayer(layerType, markerType, type) {
      const layerName = layerType + type
      let show
      if (markerType === markerTypes.marker) {
        this[layerName] = new fengmap.FMImageMarkerLayer()
        show = this.commonAlarm // 定义报警图标根据右侧普通报警选项勾选状态是否显示
      } else if (markerType === markerTypes.label) {
        this[layerName] = new fengmap.FMTextMarkerLayer()
        show = this.commonAlarm && this.isNameTitle // 定义报警名称根据右侧报警选项和名称标签选项勾选状态是否显示
      }
      this.fmgroup.addLayer(this[layerName])
      this[layerName].show = show // 图层默认显隐
      addLayer(this[layerName]._scene.id, {type: type, markerType: markerType})
    },
    changeCommonAlarmPointLayerState(type, flag) {
      if (this['iconLayer' + type]) {
        this['iconLayer' + type].show = flag
      }
    },
    changeCommonAlarmLabelLayerState(type, flag) {
      if (this['labelLayer' + type]) {
        this['labelLayer' + type].show = flag
      }
    }
  }
}
