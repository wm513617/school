/* eslint-disable no-undef */
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      hightLayer: null
    }
  },
  computed: {
    ...mapGetters('fengMap', ['selectedFMapPointRes'])
  },
  watch: {
    selectedFMapPointRes(val) {
      if (val && val.point) {
        this.addHightMarkers({
          gpos: val.point.loc,
          icon: '/static/mapimg/fmselect.png'
        })
      } else {
        this.changeHightLayerState(false)
      }
    }
  },
  methods: {
    initfmHighthLayers() { // 初始化添加不同类型的图层
      this.hightLayer = new fengmap.FMImageMarkerLayer()
      this.fmgroup.addLayer(this.hightLayer)
    },
    addHightMarkers(obj) { // 添加点位
      if (this.hightLayer) {
        this.hightLayer.removeAll()
      } else {
        this.initfmHighthLayers()
      }
      const gpos = obj.gpos.split(',')
      const im = new fengmap.FMImageMarker({
        x: gpos[0], // 标注x坐标点
        y: gpos[1], // 标注y坐标点
        url: obj.icon, // 设置图片路径
        size: 18, // 设置图片显示尺寸
        height: gpos[2] || 5 // 标注高度，大于model的高度
      })
      this.hightLayer.addMarker(im)
      this.changeHightLayerState(true)
    },
    changeHightLayerState(val) { // 控制显隐
      if (this.hightLayer) { this.hightLayer.show = val }
    }
  }
}
