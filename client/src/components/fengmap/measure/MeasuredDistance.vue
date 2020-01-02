<script>
/* eslint-disable no-undef */
// 测距逻辑
import MouseTip from 'assets/fengMap/utils/mousetip/MouseTip.js'
export default {
  name: 'measuredDistance',
  render() { return {} },
  data() {
    return {
      pointMarkers: [], // 描点位标注集合
      pointMarkersXYZ: [], // 描点位坐标集合
      lineMarkers: [], // 所有路线标注集合
      currentlineMarker: null, // 当前线路标注
      tooltip: null, // 鼠标提示工具
      // 设置跟随鼠标移动的圆形标注样式
      mouseMoveCircle: {
        color: 'red', // 设置颜色
        alpha: 0.5, // 设置透明度
        lineWidth: 0.01, // 设置边框线的宽度
        type: 'circle',
        radius: 0.01, // 设置半径
        segments: 40// 设置段数，默认为40段
      },
      // 设置折线样式
      lineStyle: {
        color: '#FF0000', // 设置线的颜色
        lineWidth: 3, // 设置线的宽度
        alpha: 0.8, // 设置线的透明度
        lineType: fengmap.FMLineType.dotDash,
        dash: {
          size: 6, // 设置线的大小
          gap: 0 // 0为实线，大于0为虚线
        }
      },
      defaultHeight: 4, // 设置所有图形高度
      mouseMovePolygonMarkerLayer: null, // new fengmap.FMPolygonMarkerLayer(), // 创建多边形标注图层(鼠标跟随点位图层)
      polygonMarkerLayer: null, // new fengmap.FMPolygonMarkerLayer(), // 创建多边形标注图层(鼠标点击点位图层)
      totalDistance: 0, // 总距离
      startPopMarker: null, // 起点的弹窗
      distancePopMarker: null, // 长度的弹窗
      distancePopMarkerCloseId: 1, // 长度的弹窗右上角关闭按钮ID
      polygonPopMarker: [], // 所有折线上弹窗集合
      clickTimeId: null // 单击事件的执行ID
    }
  },
  props: {
    fengMap: { // 地图对象
      type: Object
    },
    actived: { // 是否激活
      type: Boolean,
      default: false
    },
    clear: { // 是否清除绘制
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
  watch: {
    actived(flag) { // 绘制是否激活
      if (flag) { // 监听点选鼠标移动事件
        if (this.fengMap) {
          if (!this.tooltip) {
            let container = this.fengMap.MapOptions.container.parentNode
            this.tooltip = new MouseTip(container) // 构造鼠标提示工具
          }
          this.tooltip.setVisible(flag)
          this.fengMap && this.fengMap.MapOptions.container.addEventListener('mousemove', this.mouseMoveFn, false)
          this.fengMap && this.fengMap.MapOptions.container.addEventListener('click', this.mouseClickFn, false)
          this.fengMap && this.fengMap.MapOptions.container.addEventListener('dblclick', this.mouseDBclickFn, false)
          this.mouseMovePolygonMarkerLayer = new fengmap.FMPolygonMarkerLayer() // 创建多边形标注图层(鼠标跟随点位图层)
          this.polygonMarkerLayer = new fengmap.FMPolygonMarkerLayer() // 创建多边形标注图层(鼠标点击点位图层)
          let groupLayer = this.fengMap.getFMGroup(this.fengMap.focusGroupID) // 获取楼层图层
          groupLayer.addLayer(this.mouseMovePolygonMarkerLayer) // // 从当前楼层图层上添加鼠标移动的多边形标注图层
          groupLayer.addLayer(this.polygonMarkerLayer) // // 从当前楼层图层上添加点击事件时多边形标注图层
        }
      } else { // 移除鼠标移动事件
        this.tooltip && this.tooltip.setVisible(flag) // 关闭鼠标提示
        this.fengMap && this.fengMap.MapOptions.container.removeEventListener('mousemove', this.mouseMoveFn, false)
        this.fengMap && this.fengMap.MapOptions.container.removeEventListener('click', this.mouseClickFn, false)
        this.fengMap && this.fengMap.MapOptions.container.removeEventListener('dblclick', this.mouseDBclickFn, false)
      }
    },
    clear(flag) { // 是否激活清除绘制
      flag && this.clearDistance() // 清空绘制
    },
    'drawStyle.color'(color) { // 监听绘制颜色变化
      this.mouseMoveCircle.color = color
      this.lineStyle.color = color
    }
  },
  methods: {
    mouseMoveFn(event) {
      let mouseCoordToMap = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight)
      let polygonMarker = new fengmap.FMPolygonMarker({
        color: this.mouseMoveCircle.color, // 设置颜色
        alpha: this.mouseMoveCircle.alpha, // 设置透明度
        lineWidth: this.mouseMoveCircle.lineWidth, // 设置边框线的宽度
        height: this.defaultHeight, // 设置高度*/
        points: {
          type: this.mouseMoveCircle.type, // 设置为圆形
          center: {...mouseCoordToMap}, // 设置此形状的中心坐标
          radius: this.mouseMoveCircle.radius, // 设置半径
          segments: this.mouseMoveCircle.segments// 设置段数，默认为40段
        }
      })
      this.mouseMovePolygonMarkerLayer.removeAll() // 清除所有跟随鼠标的点位
      this.mouseMovePolygonMarkerLayer.addMarker(polygonMarker) // 添加跟随鼠标的点位
      if (this.pointMarkers.length === 0) {
        this.tooltip.msg = '<p>单击开始绘制，双击取消绘制</p>'
      } else {
        this.tooltip.msg = '<p>单击继续绘制,双击完成绘制</p>'
        this.drawLine(event)
      }
    },
    mouseClickFn(event) {
      clearTimeout(this.clickTimeId) // 取消上次延时未执行的方法
      // 执行延时
      this.clickTimeId = setTimeout(() => {
        let clickCoordToMap = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight)
        let polygonMarker = new fengmap.FMPolygonMarker({
          color: this.mouseMoveCircle.color, // 设置颜色
          alpha: this.mouseMoveCircle.alpha, // 设置透明度
          lineWidth: this.mouseMoveCircle.lineWidth, // 设置边框线的宽度
          height: this.defaultHeight, // 设置高度*/
          points: {
            type: this.mouseMoveCircle.type, // 设置为圆形
            center: {...clickCoordToMap}, // 设置当前此形状的中心坐标
            radius: this.mouseMoveCircle.radius, // 设置半径
            segments: this.mouseMoveCircle.segments// 设置段数，默认为40段
          }
        })
        this.polygonMarkerLayer.addMarker(polygonMarker)
        this.pointMarkers.push(polygonMarker) //  = this.polygonMarkerLayer.markers // 存入当前圆形点位
        this.pointMarkersXYZ.push({...clickCoordToMap}) // 存入当前点位坐标
        if (this.pointMarkers.length === 1) { // 设置起点提示信息
          this.setInfoWindow({...clickCoordToMap}, true)
        }
      }, 50)
    },
    setInfoWindow({x, y, z}, isStartPoint, lineMarker) {
      let infoWindowConfig = {
        mapCoord: {
          x,
          y,
          z,
          height: this.defaultHeight,
          groupID: this.fengMap.focusGroupID
        },
        width: 100,
        height: 50,
        content: '',
        closeCallBack: () => {}
      }
      if (isStartPoint) {
        infoWindowConfig.content = '<div style="background: rgb(255, 255, 255); border: 2px solid red; color: rgb(51, 51, 51); font-size: 12px; font-family: 宋体, Simsun; padding: 1px 4px; border-radius: 4px; line-height: 24px;text-align: center"><span>起点</span></div>'
        infoWindowConfig.width = 40
        if (!this.startPopMarker) {
          this.startPopMarker = new fengmap.FMPopInfoWindow(this.fengMap, infoWindowConfig)
        }
      } else {
        infoWindowConfig.content = '<div style="background: rgb(255, 255, 255); border: 2px solid red; color: rgb(51, 51, 51); font-size: 12px; font-family: 宋体, Simsun; padding: 1px 4px; border-radius: 4px; line-height: 24px;"><span>总长度：' + Math.round(this.totalDistance) + '<i id="' + this.distancePopMarkerCloseId + '" class="iconfont icon-fail" title="关闭" style="cursor: pointer; color: #ff0000; float: right;display: none"></i>' + 'm</span></div>'
        infoWindowConfig.width = 140
        if (!this.distancePopMarker) {
          this.distancePopMarker = new fengmap.FMPopInfoWindow(this.fengMap, infoWindowConfig)
        } else {
          this.distancePopMarker.close()
          this.distancePopMarker = new fengmap.FMPopInfoWindow(this.fengMap, infoWindowConfig)
        }
      }
      lineMarker && $('#' + this.distancePopMarkerCloseId).click({startPopMarker: this.startPopMarker, distancePopMarker: this.distancePopMarker, lineMarker}, this.clearPolygonMarker)
      $('.fm-control-popmarker') && $('.fm-control-popmarker').css({'background': 'none', 'border': 'none', 'padding': 0})
      $('.fm-control-popmarker input') && $('.fm-control-popmarker input').css('display', 'none')
      $('.fm-control-popmarker span.fm-control-popmarker-bot') && $('.fm-control-popmarker span.fm-control-popmarker-bot').css('display', 'none')
      $('.fm-control-popmarker span.fm-control-popmarker-top') && $('.fm-control-popmarker span.fm-control-popmarker-top').css('display', 'none')
    },
    drawLine(event) {
      this.currentlineMarker && this.fengMap.clearLineMark(this.currentlineMarker) // 清除之前的折线marker
      let mouseCoord = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight) // 获取当前鼠标对应的地图坐标
      let pointCoords = [...this.pointMarkersXYZ, mouseCoord] // 设置所有点位坐标和当前鼠标坐标集合
      let results = { // 画线前的准备
        groupId: this.fengMap.focusGroupID,
        points: pointCoords
      }
      let line = new fengmap.FMLineMarker() // 创建线marker
      let seg = new fengmap.FMSegment() // 创建点集
      seg.groupId = results.groupId // 设置点集楼层ID
      seg.points = results.points // 设置点集坐标集合
      line.addSegment(seg)
      this.fengMap.drawLineMark(line, this.lineStyle) // 绘制当前折线
      this.currentlineMarker = line // 当前路线标注
      this.computedDistance(mouseCoord)
      this.distancePopMarkerCloseId++
      this.setInfoWindow({...mouseCoord}, false, line) // 设置终点弹框
    },
    computedDistance(mouseCoord) {
      let x = mouseCoord.x
      let y = mouseCoord.y
      let PointCoord = this.pointMarkersXYZ[this.pointMarkersXYZ.length - 1]
      let PointCoordX = PointCoord.x
      let PointCoordY = PointCoord.y
      let compute1 = ((x - PointCoordX) * (x - PointCoordX)) + ((y - PointCoordY) * (y - PointCoordY))
      let compute2 = Math.sqrt(compute1)
      this.totalDistance += compute2
    },
    mouseDBclickFn(event) {
      // 取消上次延时未执行的方法
      clearTimeout(this.clickTimeId)
      this.mouseMovePolygonMarkerLayer.removeAll() // 清除所有跟随鼠标的点位
      this.polygonMarkerLayer.removeAll() // 清除所有点击鼠标的点位
      this.pointMarkers = [] // 清除当前点位markers集合数组
      this.pointMarkersXYZ = [] // 清除所有点击鼠标的点位坐标
      this.polygonPopMarker.push({startPopMarker: this.startPopMarker, distancePopMarker: this.distancePopMarker})
      this.startPopMarker = null // 初始化起点的弹窗
      this.distancePopMarker = null // 初始化长度的弹窗
      this.lineMarkers.push(this.currentlineMarker) // 存入当前路线标注
      this.$emit('update:actived', false) // 关闭绘制激活状态
      this.currentlineMarker = null // 初始化当前线路marker
      $('#' + this.distancePopMarkerCloseId).css('display', 'block')
    },
    clearPolygonMarker(event) { // 清除当前标注
      // 删除lineMarkers内对应的line
      for (let i = 0; i < this.lineMarkers.length; i++) {
        if (this.lineMarkers[i] === event.data.lineMarker) {
          this.lineMarkers.splice(i, 1)
          break
        }
      }
      // 删除polygonPopMarker内对应的PopMarker
      for (let i = 0; i < this.polygonPopMarker.length; i++) {
        if (this.polygonPopMarker[i].startPopMarker === event.data.startPopMarker || this.polygonPopMarker[i].distancePopMarker === event.data.distancePopMarker) {
          this.polygonPopMarker.splice(i, 1)
        }
      }
      // 清空当前起点pop
      event.data.startPopMarker && event.data.startPopMarker.close()
      // 清空当前终点pop
      event.data.distancePopMarker && event.data.distancePopMarker.close()
      // 清除当前折线
      event.data.lineMarker && this.fengMap.clearLineMark(event.data.lineMarker)
    },
    clearDistance() {
      this.lineMarkers.length && this.fengMap.clearLineMark(this.lineMarkers)
      this.lineMarkers = []
      this.polygonPopMarker.forEach(item => {
        item.startPopMarker.close()
        item.distancePopMarker.close()
      })
      this.polygonPopMarker = []
      this.$emit('update:clear', false) // 关闭清空状态
    }
  }
}
</script>

<style scoped>

</style>
