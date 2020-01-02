<template>
  <div class="DrawPolygon">

  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import MouseTip from 'assets/fengMap/utils/mousetip/MouseTip.js'
export default {
  data() {
    return {
      pointMarkers: [], // 描点位标注集合
      pointMarkersXYZ: [], // 描点位坐标集合
      currentlineMarker: [], // 当前线路标注两条
      tooltip: null, // 鼠标提示工具
      defaultHeight: 4, // 设置所有图形高度
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
      mouseMovePolygonMarkerLayer: null, // 创建多边形标注图层(鼠标跟随点位图层)
      polygonMarkerLayer: null, // new fengmap.FMPolygonMarkerLayer(), // 创建多边形标注图层(鼠标点击圆形点位图层)
      polygonMarkerLayer1: null, // // 创建多边形标注图层(鼠标双击多边形点位图层)
      clickTimeId: null, // 单击事件的执行ID
      polygonMarkerLayer1List: []
    }
  },
  props: {
    fengMap: { // 地图对象
      type: Object
    }
  },
  computed: {
    ...mapGetters('fengMapDraw', ['isLineDrawActive']),
    ...mapGetters('fengMap', ['boxChooseSecPanelStatus'])
  },
  watch: {
    isLineDrawActive(flag) {
      if (flag) {
        if (this.fengMap) {
          if (!this.tooltip) {
            let container = this.fengMap.MapOptions.container.parentNode
            this.tooltip = new MouseTip(container) // 构造鼠标提示工具
          }
          this.tooltip.setVisible(flag)
          this.fengMap && this.fengMap.MapOptions.container.addEventListener('mousemove', this.mouseMoveFn, false)
          this.fengMap && this.fengMap.MapOptions.container.addEventListener('click', this.mouseClickFn, false)
          this.fengMap && this.fengMap.MapOptions.container.addEventListener('dblclick', this.mouseDBclickFn, false)
          this.mouseMovePolygonMarkerLayer = new fengmap.FMPolygonMarkerLayer() // 创建多边形标注图层(鼠标跟随点位图层)mouseDBclickFn
          this.polygonMarkerLayer = new fengmap.FMPolygonMarkerLayer() // 创建多边形标注图层(鼠标点击圆形点位图层)
          this.polygonMarkerLayer1 = new fengmap.FMPolygonMarkerLayer() // 创建多边形标注图层(鼠标双击多边形点位图层)
          let groupLayer = this.fengMap.getFMGroup(this.fengMap.focusGroupID) // 获取楼层图层
          groupLayer.addLayer(this.mouseMovePolygonMarkerLayer) // // 从当前楼层图层上添加鼠标移动的多边形标注图层
          groupLayer.addLayer(this.polygonMarkerLayer) // // 从当前楼层图层上添加点击事件时多边形圆形标注图层
          groupLayer.addLayer(this.polygonMarkerLayer1) // // 从当前楼层图层上添加右键点击事件时多边形标注图层
        }
      } else {
        this.tooltip && this.tooltip.setVisible(flag) // 关闭鼠标提示
        this.fengMap && this.fengMap.MapOptions.container.removeEventListener('mousemove', this.mouseMoveFn, false)
        this.fengMap && this.fengMap.MapOptions.container.removeEventListener('click', this.mouseClickFn, false)
        this.fengMap && this.fengMap.MapOptions.container.removeEventListener('dblclick', this.mouseDBclickFn, false)
      }
    },
    boxChooseSecPanelStatus(val) {
      if (!val) {
        for (let item of this.polygonMarkerLayer1List) {
          item.removeAll()
        }
        this.polygonMarkerLayer1List = []
      }
    }
  },
  methods: {
    ...mapActions('fengMapDraw', ['closeDrawFn']),
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
        this.tooltip.msg = '<p>单击开始绘制</p>'
      } else {
        if (this.pointMarkers.length < 3) {
          this.tooltip.msg = '<p>单击继续绘制,双击取消绘制</p>'
        } else {
          this.tooltip.msg = '<p>单击继续绘制,双击完成绘制</p>'
        }
        let mouseCoord = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight) // 获取当前鼠标对应的地图坐标
        let pointCoords = [...this.pointMarkersXYZ, mouseCoord] // 设置所有点位坐标和当前鼠标坐标集合
        let results = [
          { // 画线前的准备
            groupId: this.fengMap.focusGroupID,
            points: pointCoords
          }
        ]
        if (this.pointMarkersXYZ.length >= 2) {
          let pointCoords1 = [this.pointMarkersXYZ[0], mouseCoord]
          results[1] = {
            groupId: this.fengMap.focusGroupID,
            points: pointCoords1
          }
        }
        this.drawLines(results)
      }
    }, // 鼠标移动
    mouseClickFn(event) { // 鼠标点击
      clearTimeout(this.clickTimeId) // 取消上次延时未执行的方法
      this.clickTimeId = setTimeout(() => {
        let mouseCoord = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight)
        let obj = {}
        obj.domEvent = event
        obj.mapCoord = {x: mouseCoord.x, y: mouseCoord.y, z: mouseCoord.z}
        this.clickHandler(obj)
      }, 50)
    },
    drawLines(results) {
      this.currentlineMarker.length && this.fengMap.clearLineMark(this.currentlineMarker) // 清除之前的折线marker
      for (let i = 0; i < results.length; i++) {
        let item = results[i]
        let line = new fengmap.FMLineMarker() // 创建线marker
        let seg = new fengmap.FMSegment() // 创建点集
        seg.groupId = item.groupId
        seg.points = item.points
        line.addSegment(seg)
        this.fengMap.drawLineMark(line, this.lineStyle)
        this.currentlineMarker[i] = line
      }
    },
    clickHandler(event) { // 地图单击绘制主函数
      let coord = JSON.parse(JSON.stringify(event.mapCoord))
      let obj = {...coord}
      let polygonMarker = new fengmap.FMPolygonMarker({
        color: this.mouseMoveCircle.color, // 设置颜色
        alpha: this.mouseMoveCircle.alpha, // 设置透明度
        lineWidth: this.mouseMoveCircle.lineWidth, // 设置边框线的宽度
        height: this.defaultHeight, // 设置高度*/
        points: {
          type: this.mouseMoveCircle.type, // 设置为圆形
          center: obj, // 设置当前此形状的中心坐标
          radius: this.mouseMoveCircle.radius, // 设置半径
          segments: this.mouseMoveCircle.segments// 设置段数，默认为40段
        }
      })
      this.polygonMarkerLayer.addMarker(polygonMarker)
      this.pointMarkers.push(polygonMarker) //  = this.polygonMarkerLayer.markers // 存入当前圆形点位
      this.pointMarkersXYZ.push(obj)
    },
    mouseDBclickFn(event) {
      // 取消上次延时未执行的方法
      clearTimeout(this.clickTimeId)
      let mouseCoord = this.fengMap.coordScreenToMap(event.x, event.y, this.defaultHeight)
      let obj = {}
      obj.domEvent = event
      obj.mapCoord = {x: mouseCoord.x, y: mouseCoord.y, z: mouseCoord.z}
      this.clickHandler(obj) // 重新调用单击事件来加上终止点位
      if (this.pointMarkersXYZ.length > 2) {
        let polygonMarker = new fengmap.FMPolygonMarker({
          color: this.mouseMoveCircle.color, // 设置颜色
          alpha: this.mouseMoveCircle.alpha, // 设置透明度
          lineWidth: this.mouseMoveCircle.lineWidth, // 设置边框线的宽度
          height: this.defaultHeight, // 设置高度*/
          points: this.pointMarkersXYZ
        })
        this.polygonMarkerLayer1.addMarker(polygonMarker)
        this.polygonMarkerLayer1List.push(this.polygonMarkerLayer1)
        let wktStr = 'POLYGON(('
        for (let item of this.pointMarkersXYZ) {
          wktStr += item.x + ' ' + item.y + ','
        }
        wktStr = wktStr.slice(0, wktStr.length - 1) + '))'
        this.$emit('update:drawFlish', {wktStr})
      }
      this.mouseMovePolygonMarkerLayer.removeAll() // 清除所有跟随鼠标的点位
      this.polygonMarkerLayer.removeAll() // 清除所有点击鼠标的点位
      this.pointMarkers = [] // 清除当前点位markers集合数组
      this.pointMarkersXYZ = [] // 清除所有点击鼠标的点位坐标
      this.currentlineMarker.length && this.fengMap.clearLineMark(this.currentlineMarker) // 清除当前的折线marker
      this.currentlineMarker = [] // 初始化当前折线集合
      this.polygonMarkerLayer1 = null // 清空当前多边形图层
      this.closeDrawFn('MultiPolygon') // 禁止继续绘制,取消激活
    }
  }
}

</script>

<style scoped>

</style>
