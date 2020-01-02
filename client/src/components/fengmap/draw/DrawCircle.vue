<script>
/* eslint-disable no-undef */
// 地图绘制圆形逻辑
import MouseTip from 'assets/fengMap/utils/mousetip/MouseTip.js'
export default {
  name: 'draw-circle',
  render() { return {} },
  data() {
    return {
      tooltip: null,
      mouseTips: '<p>单击绘制圆心</p>',
      circleCenterPoint: null,
      drawEndPoint: null,
      tempLayer: null,
      circleLayer: null,
      lineMarker: null,
      radius: 0,
      lineStyle: { // 绘制线的样式
        lineWidth: 2,
        alpha: 0.8,
        lineType: fengmap.FMLineType.FULL,
        color: '#FF0000',
        dash: {
          size: 5,
          gap: 0
        }
      },
      centerPointStyle: { // 圆心点的样式
        color: '#FF0000',
        alpha: 0.3,
        lineWidth: 0.01,
        height: 3,
        points: {
          type: 'circle',
          center: {
            x: 0,
            y: 0
          },
          radius: 0.01,
          segments: 64
        }
      },
      circleStyle: { // 圆心点的样式
        color: '#ff0000',
        alpha: 0.3,
        lineWidth: 0.01,
        height: 3,
        points: {
          type: 'circle',
          center: {
            x: 0,
            y: 0
          },
          radius: 0,
          segments: 64
        }
      }
    }
  },
  props: {
    fengMap: { // 是否激活
      type: Object
    },
    actived: { // 是否激活
      type: Boolean,
      default: false
    },
    clear: { // 是否清除圆的绘制
      type: Boolean,
      default: false
    },
    drawStyle: { // 绘制样式
      type: Object,
      default: function() {
        return {color: '#ff0000'}
      }
    }
  },
  computed: {
  },
  watch: {
    actived(flag) { // 绘制是否激活
      if (this.fengMap) {
        if (!this.tooltip) {
          let container = this.fengMap.MapOptions.container.parentNode
          this.tooltip = new MouseTip(container) // 构造鼠标提示工具
        }
        this.tooltip.setVisible(flag)
        if (flag) {
          this.drawCircle() // 绘制圆形
        } else {
          this.clearDrawCircle() // 清除绘制
        }
      }
    },
    clear(flag) { // 是否激活清除圆的绘制
      flag && this.clearCircleLayer() // 清空圆形图层
    },
    'drawStyle.color'(color) { // 监听绘制颜色变化
      this.lineStyle.color = color
      this.centerPointStyle.color = color
      this.circleStyle.color = color
    }
  },
  mounted() {
    if (this.drawStyle.color) {
      this.lineStyle.color = this.drawStyle.color
      this.centerPointStyle.color = this.drawStyle.color
      this.circleStyle.color = this.drawStyle.color
    }
  },
  methods: {
    // 绘制圆形
    drawCircle() {
      this.clearDrawCircle() // 清除绘制圆形
      this.tooltip.msg = '<p>单击绘制圆心</p>'
      this.initTempDrawLayer() // 初始化临时绘制图层
      this.fengMap.MapOptions.container.addEventListener('click', this.handleClickEvent)
      this.fengMap.MapOptions.container.addEventListener('mousemove', this.handleMouseMoveEventBD)
    },
    // 初始化临时绘制图层
    initTempDrawLayer() {
      let group = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
      if (!this.tempLayer) {
        this.tempLayer = new fengmap.FMPolygonMarkerLayer()
        group.addLayer(this.tempLayer)
      }
      if (!this.circleLayer) {
        this.circleLayer = new fengmap.FMPolygonMarkerLayer()
        group.addLayer(this.circleLayer)
      }
    },
    handleClickEvent(event) {
      if (this.actived) {
        // console.log('绘制圆形过程中捕获到的点击事件：', event)
        let point1 = this.fengMap.coordScreenToMap(event.x, event.y, 4)
        event.preventDefault() // 阻止事件默认方法
        event.stopPropagation() // 阻止事件冒泡
        if (!this.circleCenterPoint) {
          this.circleCenterPoint = point1
          this.centerPointStyle.points.center = {x: this.circleCenterPoint.x, y: this.circleCenterPoint.y}
          let circleMaker = new fengmap.FMPolygonMarker(this.centerPointStyle) // 添加圆心
          this.tempLayer.addMarker(circleMaker)
        } else {
          this.drawEndPoint = point1
          let radius = Math.sqrt(Math.pow(this.circleCenterPoint.x - this.drawEndPoint.x, 2) + Math.pow(this.circleCenterPoint.y - this.drawEndPoint.y, 2))
          // console.log('获取到绘制圆的半径：', radius)
          let circleParams = { center: [this.circleCenterPoint.x, this.circleCenterPoint.y], radius, segments: 64 }
          this.circleStyle.points.center = { x: circleParams.center[0], y: circleParams.center[1] }
          this.circleStyle.points.radius = circleParams.radius
          this.circleStyle.points.segments = circleParams.segments
          let circleMaker = new fengmap.FMPolygonMarker(this.circleStyle) // 绘制圆
          this.circleLayer.addMarker(circleMaker)
          this.circleCenterPoint = null
          this.drawEndPoint = null
          let circleWKTStr = this.getCircleWKTStr(circleParams)
          // console.log('获取到圆形的wkt字符串：', circleWKTStr)
          this.$emit('drawend', {center: circleParams.center, radius, wktStr: circleWKTStr}) // 抛出绘制完成
        }
      }
    },
    // 获取圆形WKT字符串
    getCircleWKTStr(attr) {
      let { center, radius, segments = 64, endAngle = 360, startAngle = 0 } = attr
      let angle = endAngle - startAngle // 扇形角度
      let anglePer = angle / segments // 每个分割扇形角度
      let startPoint = [center[0] + radius * Math.cos(0), center[1] + radius * Math.sin(0)]
      let wktStr = 'POLYGON((' + startPoint[0] + ' ' + startPoint[1] + ','
      for (let i = 1; i < segments; ++i) { // 遍历分割数量，将旋转后的点放入点集中
        let rotatedAngle = (i * anglePer + startAngle) * Math.PI / 180
        let cur = [center[0] + radius * Math.cos(rotatedAngle), center[1] + radius * Math.sin(rotatedAngle)] // 计算旋转点
        wktStr += cur[0] + ' ' + cur[1] + ','
      }
      wktStr += startPoint[0] + ' ' + startPoint[1] + '))'
      return wktStr
    },
    // 处理绘制过程中捕获到的鼠标移动事件
    handleMouseMoveEventBD(event) {
      if (this.actived) {
        // console.log('绘制圆形过程中捕获到的鼠标移动事件：', event)
        if (this.circleCenterPoint && !this.drawEndPoint) {
          this.tooltip.msg = '<p>单击绘制半径</p>'
          let point1 = this.fengMap.coordScreenToMap(event.x, event.y, 4)
          if (this.lineMarker) {
            this.fengMap.clearLineMark(this.lineMarker)
          }
          this.lineMarker = new fengmap.FMLineMarker()
          let seg = new fengmap.FMSegment()
          seg.groupId = this.fengMap.focusGroupID
          seg.points = [this.circleCenterPoint, point1]
          this.lineMarker.addSegment(seg)
          this.fengMap.drawLineMark(this.lineMarker, this.lineStyle)
        }
      }
    },
    // 清除绘制圆形
    clearDrawCircle() {
      this.fengMap.MapOptions.container.removeEventListener('click', this.handleClickEvent)
      this.fengMap.MapOptions.container.removeEventListener('mousemove', this.handleMouseMoveEventBD)
      if (this.tempLayer) {
        let group = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
        group.removeLayer(this.tempLayer)
        this.tempLayer.removeAll()
        this.tempLayer.dispose()
        this.tempLayer = null
      }
      this.lineMarker && this.fengMap.clearLineMark(this.lineMarker)
      this.circleCenterPoint = null
      this.lineMarker = null
    },
    // 清空圆形图层
    clearCircleLayer() {
      if (this.circleLayer) {
        let group = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
        group.removeLayer(this.circleLayer)
        this.circleLayer.removeAll()
        this.circleLayer.dispose()
        this.circleLayer = null
      }
      this.$emit('update:clear', false) // 关闭清空状态
    }
  }
}
</script>
