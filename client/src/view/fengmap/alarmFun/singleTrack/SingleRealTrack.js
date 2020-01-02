/**
 * 2D地图轨迹绘制工具类
 */
const SPEED = 5 // 轨迹动画的播放速率
const STEPTIME = 10000 // 轨迹动画的节点间隔时间（单位：毫秒）
const TRACKZINDEX = 9999 // 轨迹的zIndex
const DEFAULTOPS = {
  route: 'route',
  node: 'node',
  geoMarker: 'geoMarker',
  routeWidth: 4, // 路线线宽
  routeColor: '#D0021B' // 路线线颜色
}
let _ol = null // 地图类库
const STYLE = {
  /**
   * 轨迹路线的样式
   * @param {*} feature 要素
   * @returns 样式
   */
  routeStyle(feature, trackColor, arrowImg) {
    // 路线样式.
    let geometry = feature.get('geometry') // 获取要素的几何图形
    let styles = [] // 样式数组
    styles.push(
      new _ol.style.Style({
        stroke: new _ol.style.Stroke({
          color: trackColor,
          width: DEFAULTOPS.routeWidth
        }),
        zIndex: TRACKZINDEX + 1
      })
    )
    let lineCoordinates = geometry.getCoordinates()
    if (lineCoordinates && lineCoordinates.length >=2) {
      let lastStart = lineCoordinates[lineCoordinates.length - 2]
      let lastEnd = lineCoordinates[lineCoordinates.length - 1]
      let dx = lastEnd[0] - lastStart[0] // x方向上的变化量
      let dy = lastEnd[1] - lastStart[1] // y方向上的变化量
      if (dx !== 0 || dy !== 0) { // 判断 lastStart 和 lastEnd 坐标不同时
        let rotation = Math.atan2(dy, dx) // 旋转角度
        let segment = new _ol.geom.LineString([lastStart, lastEnd]) // 线段
        let pos = segment.getCoordinateAt(0.97) // 计算
        // console.log('遍历线的每个线段-lastEnd: ', lastEnd, ', 遍历线的每个线段-lastEnd: ', pos)
        styles.push(
          new _ol.style.Style({
            geometry: new _ol.geom.Point(pos), // 剪头的位置
            text: new _ol.style.Text({
              font: 'normal 24px iconfont',
              text: window.getComputedStyle(document.querySelector('.icon-you'), ':before').getPropertyValue('content').replace(/"/g, ''), // 获取伪类样式的内容
              fill: new _ol.style.Fill({ color: trackColor }),
              textBaseline: 'middle',
              rotation: -rotation
            }),
            zIndex: TRACKZINDEX + 2
          })
        )
      }
    }
    return styles
  },

  /**
   * 节点样式
   * @param {*} feature 要素
   * @returns 样式
   */
  nodeStyle(feature) {
    let style = new _ol.style.Style({
      image: new _ol.style.Circle({
        radius: 7.5,
        fill: new _ol.style.Fill({ color: '#057AFC' }),
        stroke: new _ol.style.Stroke({
          color: '#FFFFFF',
          width: 2
        })
      }),
      zIndex: TRACKZINDEX + 3
    })
    return style
  },

  /**
   * 定位图标样式
   * @param {*} feature 要素
   * @returns 样式
   */
  geoMarkerStyle(feature) {
    // 定位图标样式
    let style = new _ol.style.Style({
      image: new _ol.style.Circle({
        radius: 7.5,
        fill: new _ol.style.Fill({ color: '#69c260' }),
        stroke: new _ol.style.Stroke({
          color: '#FFFFFF',
          width: 2
        })
      }),
      zIndex: TRACKZINDEX + 4
    })
    return style
  }
}

export default class {
  /**
   * 构造方法
   * @param context 构造参数
   */
  constructor(params) {
    _ol = params.ol // 地图引擎类库
    this.map = params.map // 地图对象
    this.id = params.id || 'SingleRealTrack' // 标识
    this.trackColor = params.trackColor || DEFAULTOPS.routeColor // 轨迹颜色
    this.trackSource = new _ol.source.Vector({ wrapX: false }) // 轨迹矢量图层数据源
    this.trackLayer = new _ol.layer.Vector({ // 构造轨迹矢量图层
      source: this.trackSource, // 数据源
      style: feature => {
        let type = feature.get('type')
        switch (type) {
          case DEFAULTOPS.route:
            return STYLE.routeStyle(feature, this.trackColor) // 路线样式
          case DEFAULTOPS.node:
            return STYLE.nodeStyle(feature) // 节点图标样式
        }
      },
      zIndex: TRACKZINDEX
    })
    this.map.addLayer(this.trackLayer)
    this.lineCoords = [] // 轨迹坐标数组
  }

  /**
   * 绘制轨迹路线
   * @param {*} lineCoords 线坐标
   */
  drawTrackLine(lineCoords, trackColor) {
    if (lineCoords && lineCoords.length > 0) {
      this.trackColor = trackColor || DEFAULTOPS.routeColor // 轨迹颜色
      this.lineCoords = lineCoords
      let lineGeometry = new _ol.geom.LineString(lineCoords)
      let routeFeature = new _ol.Feature({
        type: DEFAULTOPS.route,
        geometry: lineGeometry
      })
      this.trackSource.addFeature(routeFeature) // 添加路线要素
    }
  }

  /**
   * 添加轨迹线节点
   */
  addTrackNodes() {
    this.addLineNodes(this.lineCoords)
  }

  /**
  * 添加线节点
  * @param {*} lineCoords 线节点信息数组
  */
  addLineNodes(lineCoords) {
    if (lineCoords && lineCoords.length > 0) {
      this.lineCoords = lineCoords
      // 添加路线节点
      for (let i = 0; i < this.lineCoords.length; i++) {
        let pointFeature = new _ol.Feature({
          type: DEFAULTOPS.node,
          geometry: new _ol.geom.Point(this.lineCoords[i])
        })
        this.trackSource.addFeature(pointFeature)
      }
    }
  }

  /**
   * 清除轨迹绘制
   */
  clearTrack() {
    // 清除轨迹
    this.trackSource.clear() // 清空绘制数据源
    this.lineCoords = []
  }
}
