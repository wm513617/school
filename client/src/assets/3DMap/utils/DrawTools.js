/**
 * 绘制工具类
 * @export
 * @class
 */
import MouseTip from './mousetip/MouseTip.js'
var _context = null // 三维视图内容
const DRAWTIPS = {
  point: '<p>点击绘制一个点</p>',
  lineStart: '<p>点击绘制第一个点</p>',
  lineDrawing: '<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>',
  polygonStart: '<p>点击绘制第一个点</p>',
  polygonDrawing: '<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>',
  marker: '<p>点击绘制地标</p>'

}

export default class {
  /**
   * 绘制工具类构造方法
   * @param context 三维视图内容
   */
  constructor(context) {
    _context = context
    this.toolTip = new MouseTip(_context.viewer.container)
    this.pointDrawer = new _context.Cesium.DrawHandler(_context.viewer, _context.Cesium.DrawMode.Point) // 点绘制工具
    this.lineDrawer = new _context.Cesium.DrawHandler(_context.viewer, _context.Cesium.DrawMode.Line) // 线绘制工具
    this.polygonDrawer = new _context.Cesium.DrawHandler(_context.viewer, _context.Cesium.DrawMode.Polygon, 0) // 面绘制工具
    this.markerDrawer = new _context.Cesium.DrawHandler(_context.viewer, _context.Cesium.DrawMode.Marker) // 地标绘制工具
    this.regDrawListeners() // 注册绘制监听
  }
  /**
   * 注册绘制监听
   */
  regDrawListeners() {
    this.regPointDrawerListeners() // 注册绘制点的监听
    this.regLineDrawerListeners() // 注册绘制线的监听
    this.regPolygonDrawerListeners() // 注册绘制面的监听
    this.regMarkerDrawerListeners() // 注册绘制地标的监听
  }
  /**
   * 注册绘制点的监听
   */
  regPointDrawerListeners() {
    this.pointDrawer.activeEvt.addEventListener(this.handleDrawActiveEvt)
    this.pointDrawer.movingEvt.addEventListener(windowPosition => {
      this.toolTip.showAt(windowPosition, DRAWTIPS.point)
    })
    this.pointDrawer.drawEvt.addEventListener(result => {
      this.toolTip.setVisible(false)
    })
  }
  /**
   * 注册绘制线的监听
   */
  regLineDrawerListeners() {
    this.lineDrawer.activeEvt.addEventListener(this.handleDrawActiveEvt)
    this.lineDrawer.movingEvt.addEventListener(windowPosition => {
      if (this.lineDrawer.isDrawing) {
        this.toolTip.showAt(windowPosition, DRAWTIPS.lineDrawing)
      } else {
        this.toolTip.showAt(windowPosition, DRAWTIPS.lineStart)
      }
    })
    this.lineDrawer.drawEvt.addEventListener(result => {
      this.toolTip.setVisible(false)
    })
  }
  /**
   * 注册绘制面的监听
   */
  regPolygonDrawerListeners() {
    this.polygonDrawer.activeEvt.addEventListener(this.handleDrawActiveEvt)
    this.polygonDrawer.movingEvt.addEventListener(windowPosition => {
      if (this.polygonDrawer.isDrawing) {
        this.toolTip.showAt(windowPosition, DRAWTIPS.polygonDrawing)
      } else {
        this.toolTip.showAt(windowPosition, DRAWTIPS.polygonStart)
      }
    })
    this.polygonDrawer.drawEvt.addEventListener(result => {
      this.toolTip.setVisible(false)
    })
  }
  /**
   * 注册绘制地标的监听
   */
  regMarkerDrawerListeners() {
    this.markerDrawer.activeEvt.addEventListener(this.handleDrawActiveEvt)
    this.markerDrawer.movingEvt.addEventListener(windowPosition => {
      this.toolTip.showAt(windowPosition, DRAWTIPS.marker)
    })
    this.markerDrawer.drawEvt.addEventListener(result => {
      this.toolTip.setVisible(false)
    })
  }
  /**
   * 处理绘制工具激活状态变化
   * @param {*} isActive 工具是否激活
   */
  handleDrawActiveEvt(isActive) {
    if (isActive === true) {
      _context.viewer.enableCursorStyle = false
      _context.viewer._element.style.cursor = ''
    } else {
      _context.viewer.enableCursorStyle = true
    }
  }
  /**
   * 禁用绘制
   */
  deactiveAll() {
    this.pointDrawer && this.pointDrawer.deactivate()
    this.lineDrawer && this.lineDrawer.deactivate()
    this.polygonDrawer && this.polygonDrawer.deactivate()
    this.markerDrawer && this.markerDrawer.deactivate()
  }
  /**
   * 清空所有绘制
   */
  clearAll() {
    this.pointDrawer && this.pointDrawer.clear()
    this.lineDrawer && this.lineDrawer.clear()
    this.polygonDrawer && this.polygonDrawer.clear()
    this.markerDrawer && this.markerDrawer.clear()
  }
  /**
   * 激活点绘制工具
   */
  activePointDraw() {
    this.deactiveAll()
    this.pointDrawer && this.pointDrawer.activate()
  }
  /**
   * 激活线绘制工具
   */
  activeLineDraw() {
    this.deactiveAll()
    this.lineDrawer && this.lineDrawer.activate()
  }
  /**
   * 激活面绘制工具
   */
  activePolygonDraw() {
    this.deactiveAll()
    this.polygonDrawer && this.polygonDrawer.activate()
  }
  /**
   * 激活地标绘制工具
   */
  activeMarkerDraw() {
    this.deactiveAll()
    this.markerDrawer && this.markerDrawer.activate()
  }
  /**
   * 解除绘制工具的监听
   */
  relieveMeasureListeners() {
    this.toolTip && this.toolTip.destory() // 销毁鼠标提示
  }
}
