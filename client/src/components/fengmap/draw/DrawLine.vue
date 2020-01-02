<script>
/* eslint-disable no-undef */
// 地图绘制线逻辑
import MouseTip from 'assets/fengMap/utils/mousetip/MouseTip.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'draw-line',
  render() { return {} },
  data() {
    return {
      tooltip: null,
      clickTips: '<p>单击添加线节点</p>',
      mouseTips: '<p>单击添加线节点，双击结束绘制</p>',
      lineTempMarker: null, // 绘制时的临时点位marker
      tempLineStringLoc: '', // 绘制时的临时点位坐标
      isDrawing: false,
      preSelectPoint: {}, // 绘制时，存储当前点击的点坐标
      borderStyleSelect: [
        { // 线样式
          value: fengmap.FMLineType.FULL,
          label: '实线'
        }, {
          value: fengmap.FMLineType.DASH,
          label: '虚线'
        }, {
          value: fengmap.FMLineType.DOTTED,
          label: '点线'
        }, {
          value: fengmap.FMLineType.FMARROW,
          label: '带有箭头样式的导航线样式'
        }
      ]
    }
  },
  props: {
    fengMap: { // 地图
      type: Object
    },
    actived: { // 是否激活
      type: Boolean,
      default: false
    },
    clear: { // 是否清除线的绘制
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('fengMapLine', ['lineDrawStyle', 'drawHeight', 'lineTrackLoc', 'lineTrackMarkers', 'lineDrawLoc', 'lineDrawMarkers', 'lineRealTrackLoc', 'lineRealDrawMarkers']),
    ...mapGetters('fengMap', ['fmapShowDrawTrack']),
    drawStyle() {
      const lineStyle = JSON.parse(JSON.stringify(this.lineDrawStyle))
      lineStyle.lineType = this.borderStyleSelect[lineStyle.lineTypeDes || 0].value
      delete lineStyle.lineTypeDes
      return lineStyle
    }
  },
  watch: {
    actived(flag) { // 绘制是否激活
      if (this.fengMap) {
        if (!this.tooltip) {
          let container = this.fengMap.MapOptions.container.parentNode
          this.tooltip = new MouseTip(container) // 构造鼠标提示工具
        }
        this.tooltip.msg = this.clickTips
        this.tooltip.setVisible(flag)
        if (flag) {
          this.revertLineStringStyle()
          this.fengMap.MapOptions.container.addEventListener('click', this.listenerClick)
          this.fengMap.MapOptions.container.addEventListener('dblclick', this.listenerDblclick)
          this.fengMap.MapOptions.container.addEventListener('mousemove', this.listenerMousemove)
        } else {
          this.fengMap.MapOptions.container.removeEventListener('click', this.listenerClick)
          this.fengMap.MapOptions.container.removeEventListener('dblclick', this.listenerDblclick)
          this.fengMap.MapOptions.container.removeEventListener('mousemove', this.listenerMousemove)
          this.curLineDrawResults = ''
        }
      }
    },
    clear(flag) { // 清除当前绘制数据
      if (flag) {
        this.tempLineStringLoc = ''
        this.preSelectPoint = {}
        this.setLineStringLoc({})
        this.clearTempLineMark()
      }
    },
    fmapShowDrawTrack(flag) { // 是否显示轨迹刻画（人像、车辆、巡更）
      this.clearLineTrackMarks()
      if (flag && this.lineTrackLoc && this.lineTrackLoc.length > 0) {
        const lineDrawResults = this.getTrackPoints(this.lineTrackLoc)
        this.drawLines(lineDrawResults, 'track')
      }
    },
    lineDrawLoc: { // 报警线的点位
      handler(data) {
        this.clearLineDrawMarks()
        if (data && data.length) {
          data.forEach(item => {
            const lineDrawResults = this.getDrawPoints(item, item.drawStyle)
            this.drawLines(lineDrawResults, 'draw')
          })
        }
      },
      deep: true
    },
    lineRealTrackLoc: { // 实时轨迹点位
      handler(data) {
        this.clearLineRealTrackMarks()
        if (data && data.length) {
          const lineDrawResults = this.getTrackPoints(data)
          this.drawLines(lineDrawResults, 'real')
        }
      },
      deep: true
    },
    drawStyle: { // 线样式（只有在绘制中触发）
      handler(val) {
        if (this.actived && this.tempLineStringLoc) {
          const lineDrawResults = this.getDrawPoints({ loc: this.tempLineStringLoc })
          this.preSelectPoint = {}
          this.clearTempLineMark()
          setTimeout(() => {
            this.drawLines(lineDrawResults)
          }, 500)
          this.setLineStringLoc({
            points: this.tempLineStringLoc,
            drawStyle: this.drawStyle
          })
        }
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('fengMapLine', [
      'revertLineStringStyle',
      'setLineStringLoc', // 保存已绘制的数据
      'changeLineTrackMarkers', // 添加轨迹刻画（人像、车辆、巡更）marker
      'deleteLineTrackMarkers', // 删除轨迹刻画（人像、车辆、巡更）marker
      'changeLineDrawMarkers', // 添加报警线marker
      'deleteLineDrawMarkers', // 删除报警线marker
      'deleteLineRealTrackMarkers', // 删除实时轨迹线marker
      'changeLineRealTrackMarkers'
    ]),
    // 单击事件
    listenerClick(event) {
      console.log('click' + event)
      if (this.actived) {
        event.preventDefault() // 阻止事件默认方法
        event.stopPropagation() // 阻止事件冒泡
        let coord = this.fengMap.coordScreenToMap(event.x, event.y, this.drawHeight) // 屏幕坐标转换地图坐标
        if (this.preSelectPoint.x === coord.x && this.preSelectPoint.y === coord.y) { return } // 双击时不保存第二次click数据
        this.preSelectPoint = coord // 暂存当前点击的点坐标
        const point = coord.x + ',' + coord.y
        if (this.tempLineStringLoc) {
          // 绘制线时，已添加点位
          if (this.isDrawing) {
            // 正在绘制中
            this.tempLineStringLoc += (',' + point)
          } else {
            // 绘制第二条线时
            this.tempLineStringLoc += ('|' + point)
          }
        } else {
          // 绘制线时，添加的第一个点位
          this.tempLineStringLoc = point
        }
        this.isDrawing = true // 绘制中
      }
    },
    // 双击事件
    listenerDblclick(event) {
      console.log('dblclick' + event)
      if (this.actived) {
        event.preventDefault() // 阻止事件默认方法
        event.stopPropagation() // 阻止事件冒泡
        this.isDrawing = false // 暂停绘制
        this.setLineStringLoc({
          points: this.tempLineStringLoc,
          drawStyle: this.drawStyle
        })
      }
    },
    // 鼠标移动事件
    listenerMousemove(e) {
      console.log('mousemove' + event)
      if (this.actived && this.tempLineStringLoc && this.isDrawing) {
        let coord = this.fengMap.coordScreenToMap(event.x, event.y, this.drawHeight) // 屏幕坐标转换地图坐标
        const point = this.tempLineStringLoc + ',' + coord.x + ',' + coord.y // 拼接坐标点
        const lineDrawResults = this.getDrawPoints({ loc: point }) // 坐标点字符串转换渲染数据结构
        this.drawLines(lineDrawResults) // 绘制线
      }
      if (this.actived) { this.tooltip.msg = this.isDrawing ? this.mouseTips : this.clickTips } // 修改鼠标提示内容
    },
    // 绘制线
    drawLines(lineDrawResults, type) {
      // 清除已绘制的marker
      this.clearTempLineMark()
      // 循环results中坐标点集合，通过坐标点绘制路径线
      this.lineTempMarker = null
      const lineDrawMarker = new fengmap.FMLineMarker()
      for (let i = 0; i < lineDrawResults.length; i++) {
        let lineMarker = null
        if (this.actived) {
          // 不存在marker时，添加新的marker
          !this.lineTempMarker && (this.lineTempMarker = new fengmap.FMLineMarker())
          lineMarker = this.lineTempMarker
        } else if (type === 'draw') {
          lineMarker = lineDrawMarker
          const key = lineDrawResults[i].type || 'lineMarker'
          const map = {key: key, marker: lineMarker}
          this.changeLineDrawMarkers(map)
        } else {
          // 每条轨迹为一个新的marker
          lineMarker = new fengmap.FMLineMarker()
          const key = lineDrawResults[i].type || 'lineMarker'
          const map = {key: key, marker: lineMarker}
          if (type === 'track') {
            this.changeLineTrackMarkers(map)
          } else if (type === 'real') {
            this.changeLineRealTrackMarkers(map)
          }
        }
        const points = this.getNaviResults(lineDrawResults[i].points)
        this.drawLineTool(points, lineMarker, lineDrawResults[i].drawStyle)
      }
      this.$emit('drawend', lineDrawResults) // 抛出绘制完成
    },
    // 绘制线工具
    drawLineTool(points, lineMarker, drawStyle) {
      if (points && points.length) {
        // 创建FMSegment点集，一个点集代表一条折线
        let seg = new fengmap.FMSegment()
        seg.groupId = this.fengMap.focusGroupID
        seg.points = points
        // 将FMSegment绘制到线marker上
        lineMarker.addSegment(seg)
        // 绘制轨迹
        this.fengMap.drawLineMark(lineMarker, drawStyle || this.drawStyle)
      }
    },
    // 删除轨迹刻画（人像、车辆、巡更）marker
    clearLineTrackMarks(val) {
      const lineTrackMarkers = [...this.lineTrackMarkers]
      lineTrackMarkers.forEach(item => {
        if (!val || item[0] === val) {
          this.fengMap.clearLineMark(item[1])
          this.deleteLineTrackMarkers(item[0])
        }
      })
    },
    // 删除报警线marker
    clearLineDrawMarks(val) {
      const lineDrawMarkers = [...this.lineDrawMarkers]
      lineDrawMarkers.forEach(item => {
        if (!val || item[0] === val) {
          this.fengMap.clearLineMark(item[1])
          this.deleteLineDrawMarkers(item[0])
        }
      })
    },
    // 删除报警线marker
    clearLineRealTrackMarks(val) {
      const lineRealDrawMarkers = [...this.lineRealDrawMarkers]
      lineRealDrawMarkers.forEach(item => {
        if (!val || item[0] === val) {
          this.fengMap.clearLineMark(item[1])
          this.deleteLineRealTrackMarkers(item[0])
        }
      })
    },
    // 删除临时绘制线marker
    clearTempLineMark() {
      this.lineTempMarker && (this.fengMap.clearLineMark(this.lineTempMarker))
      this.lineTempMarker = null
    },
    // loc 组装绘制线数据
    getDrawPoints(points, drawStyle) {
      const lineLoc = points.loc.split('|')
      const results = []
      lineLoc.forEach(item => {
        const items = this.stringLocToPoint({
          points: item,
          drawStyle: drawStyle || JSON.parse(JSON.stringify(this.drawStyle)),
          type: points.type
        })
        results.push(items)
      })
      return results
    },
    // loc 组装轨迹数据
    getTrackPoints(lineTrackLoc) {
      const results = []
      const obj = JSON.parse(JSON.stringify(lineTrackLoc))
      obj.forEach(item => {
        item.drawStyle.lineType = this.borderStyleSelect[item.drawStyle.lineTypeDes || 0].value
        delete item.lineTypeDes
        const items = this.stringLocToPoint(item)
        results.push(items)
      })
      return results
    },
    // 字符串转对象
    stringLocToPoint(item) {
      const items = {
        type: item.type,
        points: [],
        drawStyle: item.drawStyle
      }
      let x = ''
      item.points.split(',').forEach((value, index) => {
        if (index % 2 === 1) {
          const point = {
            x: Number(x),
            y: Number(value)
            // z: this.drawHeight
          }
          items.points.push(point)
        }
        x = value
      })
      return items
    },
    // 构造路径分析
    getNaviResults(points) {
      const naviAnalyser = new fengmap.FMNaviAnalyser(this.fengMap)
      var points3d = []
      for (let p = 0; p < points.length; p++) {
        if (points[p + 1]) {
          // 根据已加载的fengmap.FMMap导航分析，判断路径规划是否成功
          const analyzeNaviResult = naviAnalyser.analyzeNavi(this.fengMap.focusGroupID, points[p], this.fengMap.focusGroupID, points[p + 1], fengmap.FMNaviMode.MODULE_BEST)
          if (fengmap.FMRouteCalcuResult.ROUTE_SUCCESS !== analyzeNaviResult) {
            return
          }
          // 获取路径分析结果对象，所有路线集合
          var results = naviAnalyser.getNaviResults()
          for (let i = 0; i < results.length; i++) {
            const result = results[i]
            // 路径线点集合
            const pointList = result.getPointList()
            pointList.forEach(point => {
              points3d.push({
                // x坐标点
                'x': point.x,
                // y坐标点
                'y': point.y,
                // 线标注高度
                'z': this.drawHeight
              })
            })
          }
        }
      }
      naviAnalyser.dispose()
      return points3d
    }
  },
  beforeDestroy() {
  }
}
</script>
