/**
 * 量算工具类
 * @export
 * @class
 */
import MouseTip from './MouseTip'
var _context = null // 三维视图内容

export default class {
  /**
   * 量算工具类构造方法
   * @param context 三维视图内容
   * @param clampMode 量算贴对象模式（0：空间量算，1：贴地量算）
   */
  constructor(context, clampMode) {
    _context = context
    this.isFocusOnMap = false // 焦点是否在地图上
    this.tips = '<p>左键双击、右键单击结束绘制</p><p>或按Esc键结束测量</p>'
    this.tooltip = new MouseTip(_context.viewer.container)
    this.handlerDis = new _context.Cesium.MeasureHandler(_context.viewer, _context.Cesium.MeasureMode.Distance, clampMode) // 距离量算工具
    this.handlerArea = new _context.Cesium.MeasureHandler(_context.viewer, _context.Cesium.MeasureMode.Area, clampMode) // 面积量算工具
    this.handlerHeight = new _context.Cesium.MeasureHandler(_context.viewer, _context.Cesium.MeasureMode.DVH) // 高度量算工具
    this.screenSpaceEventHandler = new _context.Cesium.ScreenSpaceEventHandler(_context.viewer.canvas) // 屏幕空间事件处理
    this.regMsasureListeners() // 注册量算监听
  }
  /**
   * 注册量算监听
   */
  regMsasureListeners() {
    this.handlerDis.measureEvt.addEventListener(result => {
      this.handleMeasureDistance(result)
    }) // 监听距离变化事件
    this.handlerDis.activeEvt.addEventListener(isActive => {
      this.handleMeasureActiveEvt(isActive)
    }) // 监听距离测量状态是否激活
    this.handlerArea.measureEvt.addEventListener(result => {
      this.handleMeasureArea(result)
    }) // 监听面积变化事件
    this.handlerArea.activeEvt.addEventListener(isActive => {
      this.handleMeasureActiveEvt(isActive)
    }) // 监听面积测量状态是否激活
    this.handlerHeight.measureEvt.addEventListener(result => {
      this.handleMeasureHeight(result)
    }) // 监听高度变化事件
    this.handlerHeight.activeEvt.addEventListener(isActive => {
      this.handleMeasureActiveEvt(isActive)
    }) // 监听高度测量状态是否激活
    this.screenSpaceEventHandler.setInputAction(movement => {
      this.deactiveAll() // 关闭量算测量工具
    }, _context.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK) // 监听双击事件
    document.addEventListener('keydown', event => {
      this.handlePressKeydown(event)
    }) // 监听键盘按下
    _context.viewer.container.addEventListener('mouseenter', event => {
      this.isFocusOnMap = true
    }) // 监听鼠标移入地图
    _context.viewer.container.addEventListener('mouseleave', event => {
      this.isFocusOnMap = false
    }) // 监听鼠标移出地图
  }
  /**
   * 处理测量距离，距离变化
   */
  handleMeasureDistance(result) {
    this.screenSpaceEventHandler.removeInputAction(_context.Cesium.ScreenSpaceEventType.MOUSE_MOVE) // 移除地图鼠标移动事件
    this.tooltip.setVisible(false) // 隐藏鼠标提示
    let distance = Number(result.distance)
    distance = distance > 1000 ? (distance / 1000).toFixed(2) + 'km' : distance.toFixed(2) + 'm'
    this.handlerDis.disLabel.text = '距离:' + distance
  }
  /**
   * 处理测量面积，面积变化
   */
  handleMeasureArea(result) {
    this.screenSpaceEventHandler.removeInputAction(_context.Cesium.ScreenSpaceEventType.MOUSE_MOVE) // 移除地图鼠标移动事件
    this.tooltip.setVisible(false) // 隐藏鼠标提示
    let area = Number(result.area)
    area = area > 1000000 ? (area / 1000000).toFixed(2) + 'km²' : area.toFixed(2) + '㎡'
    this.handlerArea.areaLabel.text = '面积:' + area
  }
  /**
   * 处理测量高度，高度变化
   */
  handleMeasureHeight(result) {
    this.screenSpaceEventHandler.removeInputAction(_context.Cesium.ScreenSpaceEventType.MOUSE_MOVE) // 移除地图鼠标移动事件
    this.tooltip.setVisible(false) // 隐藏鼠标提示
    var distance = Number(result.distance) > 1000 ? (Number(result.distance) / 1000).toFixed(2) + 'km' : Number(result.distance) + 'm'
    var vHeight = Number(result.verticalHeight) > 1000 ? (Number(result.verticalHeight) / 1000).toFixed(2) + 'km' : Number(result.verticalHeight) + 'm'
    var hDistance = Number(result.horizontalDistance) > 1000 ? (Number(result.horizontalDistance) / 1000).toFixed(2) + 'km' : Number(result.horizontalDistance) + 'm'
    this.handlerHeight.disLabel.text = '空间距离:' + distance
    this.handlerHeight.vLabel.text = '垂直高度:' + vHeight
    this.handlerHeight.hLabel.text = '水平距离:' + hDistance
  }
  /**
   * 处理测量工具激活状态变化
   * @param context 测量工具是否激活
   */
  handleMeasureActiveEvt(isActive) {
    if (isActive) {
      _context.viewer.enableCursorStyle = false
      _context.viewer._element.style.cursor = ''
    } else {
      _context.viewer.enableCursorStyle = true
    }
  }
  /**
   * 激活测量距离
   */
  activeMeasureDistance() {
    this.deactiveAll()
    this.handlerDis && this.handlerDis.activate()
    this.screenSpaceEventHandler.setInputAction(movement => {
      this.showMouseTips(movement.endPosition)
    }, _context.Cesium.ScreenSpaceEventType.MOUSE_MOVE) // 监听地图视图鼠标移动事件
  }
  /**
   * 激活测量面
   */
  activeMeasureArea() {
    this.deactiveAll()
    this.handlerArea && this.handlerArea.activate()
    this.screenSpaceEventHandler.setInputAction(movement => {
      this.showMouseTips(movement.endPosition)
    }, _context.Cesium.ScreenSpaceEventType.MOUSE_MOVE) // 监听地图视图鼠标移动事件
  }
  /**
   * 激活测量高度
   */
  activeMeasureHeight() {
    this.deactiveAll()
    this.handlerHeight && this.handlerHeight.activate()
    this.screenSpaceEventHandler.setInputAction(movement => {
      this.showMouseTips(movement.endPosition)
    }, _context.Cesium.ScreenSpaceEventType.MOUSE_MOVE) // 监听地图视图鼠标移动事件
  }
  /**
   * 显示鼠标提示
   */
  showMouseTips(position) {
    this.tooltip.setVisible(true) // 显示鼠标提示
    this.tooltip.showAt(position, this.tips)
  }
  /**
   * 关闭量算测量工具
   */
  deactiveAll() {
    this.handlerDis && this.handlerDis.deactivate()
    this.handlerArea && this.handlerArea.deactivate()
    this.handlerHeight && this.handlerHeight.deactivate()
  }
  /**
   * 清空所有量算绘制
   */
  clearAll() {
    this.handlerDis && this.handlerDis.clear()
    this.handlerArea && this.handlerArea.clear()
    this.handlerHeight && this.handlerHeight.clear()
  }
  /**
   * 改变测量工具的贴对象模式
   */
  changeClampMode(mode) {
    this.handlerDis.clampMode = mode
    this.handlerArea.clampMode = mode
  }
  /**
   * 处理假盘按下
   */
  handlePressKeydown(event) {
    if (this.isFocusOnMap && event.keyCode === 27) { // 按下ESC
      this.deactiveAll() // 关闭量算测量工具
    }
  }
  /**
   * 解除测量工具的监听
   */
  relieveMeasureListeners() {
    this.tooltip.destory() // 销毁鼠标提示
    document.removeEventListener('keydown', event => {
      this.handlePressKeydown(event)
    }) // 移除键盘按下的监听
    _context.viewer.container.removeEventListener('mouseenter', event => {
      this.isFocusOnMap = true
    }) // 移除鼠标移入地图的监听
    _context.viewer.container.removeEventListener('mouseleave', event => {
      this.isFocusOnMap = false
    }) // 移除鼠标移出地图的监听
    this.screenSpaceEventHandler.destroy() // 解除屏幕空间处理上的事件监听
  }
}
