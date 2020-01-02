<script>
/* eslint-disable no-undef */
// 测量多边形面积逻辑
import MouseTip from 'assets/fengMap/utils/mousetip/MouseTip.js'
import { toMercator, toWgs84 } from '@turf/projection'
import { point, polygon } from '@turf/helpers'
import area from '@turf/area'
import centroid from '@turf/centroid'

export default {
  name: 'measure-polygon',
  render() { return {} },
  data() {
    return {
      tooltip: null, // 鼠标提示工具
      mouseTips: '<p>单击开始绘制</p>', // 鼠标提示
      drawPoints: [], // 绘制多边形顶点数组
      tempLayer: null, // 临时绘制多边形标注图层
      tempPopMarker: null, // 临时多边形面积标注
      popMarkerMap: new Map(), // 多边形面积标注缓存（key：多边形标注的唯一标识（polygonMarker.renderNode.uuid）， value: popMarker）
      polygonLayer: null, // 多边形标注图层
      lineMarker: null, // 线标注
      defaultHeight: 4, // 标注默认的高度
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
      startPointStyle: { // 起始点的样式
        color: '#FF0000',
        alpha: 0.3,
        lineWidth: 0.01,
        height: 4,
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
      polygonStyle: { // 多边形的样式
        color: '#ff0000',
        alpha: 0.3,
        lineWidth: 0.01,
        height: 4,
        points: []
      }
    }
  },
  props: {
    fengMap: { // 蜂鸟地图对象
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
          this.drawPolygon() // 绘制
        } else {
          this.clearDrawPolygon() // 清除绘制
        }
      }
    },
    clear(flag) { // 是否激活清除绘制
      flag && this.clearPolygonLayer() // 清空绘制
    },
    'drawStyle.color'(color) { // 监听绘制颜色变化
      this.lineStyle.color = color
      this.startPointStyle.color = color
      this.polygonStyle.color = color
    }
  },
  mounted() {
    if (this.drawStyle.color) {
      this.lineStyle.color = this.drawStyle.color
      this.startPointStyle.color = this.drawStyle.color
      this.polygonStyle.color = this.drawStyle.color
    }
  },
  methods: {
    // 绘制
    drawPolygon() {
      this.clearDrawPolygon() // 清除绘制
      this.tooltip.msg = '<p>单击开始绘制</p>'
      this.initTempDrawLayer() // 初始化临时绘制图层
      this.fengMap.MapOptions.container.addEventListener('click', this.handleClickEvent)
      this.fengMap.MapOptions.container.addEventListener('dblclick', this.handleDBClickEvent)
      this.fengMap.MapOptions.container.addEventListener('mousemove', this.handleMouseMoveEvent)
    },
    // 初始化临时绘制图层
    initTempDrawLayer() {
      let group = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
      if (!this.tempLayer) {
        this.tempLayer = new fengmap.FMPolygonMarkerLayer()
        group.addLayer(this.tempLayer)
      }
      if (!this.polygonLayer) {
        this.polygonLayer = new fengmap.FMPolygonMarkerLayer()
        group.addLayer(this.polygonLayer)
      }
    },
    handleClickEvent(event) {
      if (this.actived) {
        // console.log('绘制过程中捕获到的单击事件：', event)
        let point = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight)
        this.drawPoints.push(point)
        if (this.drawPoints.length === 1) {
          if (this.tempLayer) {
            this.tempLayer.removeAll()
            let startPoint = JSON.parse(JSON.stringify(this.startPointStyle))
            startPoint.points.center = point
            let startPointMaker = new fengmap.FMPolygonMarker(startPoint)
            this.tempLayer.addMarker(startPointMaker)
          }
        }
        event.preventDefault() // 阻止事件默认方法
        event.stopPropagation() // 阻止事件冒泡
      }
    },
    handleDBClickEvent(event) {
      if (this.actived) {
        console.log('绘制过程中捕获到的双击事件：', event)
        if (this.drawPoints.length > 2) { // 绘制点大于2个，结束绘制
          // console.log('绘制点大于2个，结束绘制')
          let points = JSON.parse(JSON.stringify(this.drawPoints))
          let polygonParams = JSON.parse(JSON.stringify(this.polygonStyle))
          polygonParams.points = points
          let polygonMarker = new fengmap.FMPolygonMarker(polygonParams)
          this.polygonLayer.addMarker(polygonMarker) // 添加多边形Marker
          this.$emit('update:actived', false) // 关闭绘制激活状态
          const polygonMarkerUUid = polygonMarker.renderNode.uuid
          let polygonCoordinates = []
          for (const polygonPoint of polygonParams.points) {
            let wgs84Point = toWgs84(point([polygonPoint.x, polygonPoint.y]))
            polygonCoordinates.push(wgs84Point.geometry.coordinates)
          }
          polygonCoordinates.push(polygonCoordinates[0])
          // console.log('绘制的多边形 wgs84 坐标：', JSON.parse(JSON.stringify(polygonCoordinates)))
          let polygonGeometry = polygon([polygonCoordinates])
          let polygonArea = area(polygonGeometry)
          let center = toMercator(centroid(polygonGeometry))
          let areaDes = polygonArea >= 10000 ? '面积：' + (polygonArea / 10000).toFixed(4) + ' km<sup>2</sup>' : '面积：' + polygonArea.toFixed(2) + ' m<sup>2</sup>'
          // console.log('绘制的多边形面积：', areaDes)
          // console.log('计算到的多边形的中心点：', center)
          if (this.tempPopMarker) {
            this.tempPopMarker.close()
            this.tempPopMarker = null
          }
          let ctlOpt = {
            mapCoord: {
              x: center.geometry.coordinates[0],
              y: center.geometry.coordinates[1],
              height: 4,
              groupID: this.fengMap.focusGroupID
            },
            width: 168,
            height: 50,
            content: '<div style="background: rgb(255, 255, 255); border: 2px solid red; color: rgb(51, 51, 51); font-size: 12px; font-family: 宋体, Simsun; padding: 1px 4px; border-radius: 4px; line-height: 24px;"><span>' + areaDes + '<i id="' + polygonMarkerUUid + '" class="iconfont icon-fail" title="关闭" style="cursor: pointer; color: #ff0000; float: right;"></i></span></div>'
          }
          let popMarker = new fengmap.FMPopInfoWindow(this.fengMap, ctlOpt)
          $('.fm-control-popmarker') && $('.fm-control-popmarker').css({'background': 'none', 'border': 'none', 'padding': 'none'})
          $('.fm-control-popmarker input') && $('.fm-control-popmarker input').css('display', 'none')
          $('.fm-control-popmarker span.fm-control-popmarker-bot') && $('.fm-control-popmarker span.fm-control-popmarker-bot').css('display', 'none')
          $('.fm-control-popmarker span.fm-control-popmarker-top') && $('.fm-control-popmarker span.fm-control-popmarker-top').css('display', 'none')
          $('#' + polygonMarkerUUid).click(this.clearPolygonMarker)
          this.popMarkerMap.set(polygonMarkerUUid, popMarker)
        }
      }
    },
    // 处理绘制过程中捕获到的鼠标移动事件
    handleMouseMoveEvent(event) {
      if (this.actived) {
        // console.log('绘制过程中捕获到的鼠标移动事件：', event)
        let pointCoord = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight)
        if (this.drawPoints.length === 0) { // 0个点显示点
          if (this.tempLayer) {
            this.tempLayer.removeAll()
            let startPoint = JSON.parse(JSON.stringify(this.startPointStyle))
            startPoint.points.center = pointCoord
            let startPointMaker = new fengmap.FMPolygonMarker(startPoint)
            this.tempLayer.addMarker(startPointMaker)
          }
        } else if (this.drawPoints.length === 1) { // 1个点显示线
          this.tooltip.msg = '<p>单击继续绘制</p>'
          this.lineMarker && this.fengMap.clearLineMark(this.lineMarker)
          this.lineMarker = new fengmap.FMLineMarker()
          let seg = new fengmap.FMSegment()
          seg.groupId = this.fengMap.focusGroupID
          seg.points = [this.drawPoints[0], pointCoord]
          this.lineMarker.addSegment(seg)
          this.fengMap.drawLineMark(this.lineMarker, this.lineStyle)
        } else if (this.drawPoints.length > 1) { // 多余1个点开始显示面
          this.tooltip.msg = '<p>单击继续绘制，双击结束绘制</p>'
          if (this.lineMarker) {
            this.fengMap.clearLineMark(this.lineMarker)
            this.lineMarker = null
          }
          if (this.tempLayer) {
            this.tempLayer.removeAll()
            let polygonParams = JSON.parse(JSON.stringify(this.polygonStyle))
            polygonParams.points = JSON.parse(JSON.stringify(this.drawPoints))
            polygonParams.points.push(pointCoord)
            let polygonMarker = new fengmap.FMPolygonMarker(polygonParams)
            this.tempLayer.addMarker(polygonMarker) // 添加多边形Marker
            let polygonCoordinates = []
            for (const polygonPoint of polygonParams.points) {
              let wgs84Point = toWgs84(point([polygonPoint.x, polygonPoint.y]))
              polygonCoordinates.push(wgs84Point.geometry.coordinates)
            }
            polygonCoordinates.push(polygonCoordinates[0])
            // console.log('绘制的多边形 wgs84 坐标：', JSON.parse(JSON.stringify(polygonCoordinates)))
            let polygonGeometry = polygon([polygonCoordinates])
            let polygonArea = area(polygonGeometry)
            let center = toMercator(centroid(polygonGeometry))
            let areaDes = polygonArea >= 10000 ? '面积：' + (polygonArea / 10000).toFixed(4) + ' km<sup>2</sup>' : '面积：' + polygonArea.toFixed(2) + ' m<sup>2</sup>'
            // console.log('绘制的多边形面积：', areaDes)
            // console.log('计算到的多边形的中心点：', center)
            if (this.tempPopMarker) {
              this.tempPopMarker.close()
              this.tempPopMarker = null
            }
            let ctlOpt = {
              mapCoord: {
                x: center.geometry.coordinates[0],
                y: center.geometry.coordinates[1],
                height: 4,
                groupID: this.fengMap.focusGroupID
              },
              width: 140,
              height: 50,
              content: '<div style="background: rgb(255, 255, 255); border: 2px solid red; color: rgb(51, 51, 51); font-size: 12px; font-family: 宋体, Simsun; padding: 1px 4px; border-radius: 4px; line-height: 24px;"><span>' + areaDes + '</span></div>'
            }
            this.tempPopMarker = new fengmap.FMPopInfoWindow(this.fengMap, ctlOpt)
            $('.fm-control-popmarker') && $('.fm-control-popmarker').css({'background': 'none', 'border': 'none', 'padding': 'none'})
            $('.fm-control-popmarker input') && $('.fm-control-popmarker input').css('display', 'none')
            $('.fm-control-popmarker span.fm-control-popmarker-bot') && $('.fm-control-popmarker span.fm-control-popmarker-bot').css('display', 'none')
            $('.fm-control-popmarker span.fm-control-popmarker-top') && $('.fm-control-popmarker span.fm-control-popmarker-top').css('display', 'none')
          }
        }
      }
    },
    // 清除绘制圆形
    clearDrawPolygon() {
      this.fengMap.MapOptions.container.removeEventListener('click', this.handleClickEvent)
      this.fengMap.MapOptions.container.removeEventListener('dblclick', this.handleDBClickEvent)
      this.fengMap.MapOptions.container.removeEventListener('mousemove', this.handleMouseMoveEvent)
      if (this.tempLayer) {
        let group = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
        group.removeLayer(this.tempLayer)
        this.tempLayer.removeAll()
        this.tempLayer.dispose()
        this.tempLayer = null
      }
      this.lineMarker && this.fengMap.clearLineMark(this.lineMarker)
      this.lineMarker = null
      this.drawPoints = []
    },
    clearPolygonMarker(event) { // 清除多边形标注
      // console.log('清除多边形标注：', event)
      // 清除多边形面积标注
      let polygonMarkerUUid = event.target.id
      if (this.popMarkerMap && this.popMarkerMap.has(polygonMarkerUUid)) {
        let popMarker = this.popMarkerMap.get(polygonMarkerUUid) // 获取面积标注
        popMarker.close() // 关闭面积标注
        this.popMarkerMap.delete(polygonMarkerUUid) // 从标注map中移除此多边形的面积标注
      }
      // 清除多边形标注
      for (let polygonMarker of this.polygonLayer.markers) { // 遍历多边形标注移除多边形标注
        if (polygonMarkerUUid === polygonMarker.renderNode.uuid) {
          this.polygonLayer.removeMarker(polygonMarker)
          break
        }
      }
    },
    // 清空圆形图层
    clearPolygonLayer() {
      // 清空所有多边形面积标注
      if (this.popMarkerMap && this.popMarkerMap.size) {
        for (let popMarker of this.popMarkerMap.values()) { // 遍历多边形面积标注缓存
          popMarker.close() // 关闭面积标注
        }
      }
      this.popMarkerMap = new Map() // 清空缓存
      // 清空所有多边形标注
      if (this.polygonLayer) { // 多边形图层
        let group = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
        group.removeLayer(this.polygonLayer)
        this.polygonLayer.removeAll()
        this.polygonLayer.dispose()
        this.polygonLayer = null
      }
      this.$emit('update:clear', false) // 关闭清空状态
    }
  }
}
</script>
