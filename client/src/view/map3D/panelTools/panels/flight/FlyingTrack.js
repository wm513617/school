/**
 * 飞行轨迹绘制类
 */
import mapUtil from 'assets/3DMap/mapUtil.js'
// 飞行轨迹样式
const TRACKSTYLE = {
  lineWidth: 4, // 线宽
  lineColor: '#D0021B', // 线颜色
  lineOutlineWidth: 0, // 线边框宽度
  lineOutlineColor: 'rgba(0, 0, 0, 1)', // 线边框颜色
  lineClampToGround: true, // 线是否贴地
  lineZIndex: 10001, // 线zIndex
  pointColor: '#057AFC', // 点颜色
  pointPixelSize: 7.5,
  pointOutlineColor: '#FFFFFF', // 点边框颜色
  movingPointOutlineColor: '#D0021B', // 线颜色
  pointOutlineWidth: 2, // 点边框宽度
  pointZIndex: 10002, // 点zIndex
  movingPointZIndex: 10004, // 点zIndex
  animateStep: 30,
  pathResolution: 1,
  pathGlowPower: 0.1,
  labelFont: '14pt monospace', // 路线节点标题字体
  labelOutlineWidth: 2, // 路线节点标题边框宽度
  labelOffset: {x: 0, y: -10}, // 路线节点标题偏移
  labelZIndex: 10003, // 路线节点标题zIndex
  labelBGColor: 'rgba(24,44,76,0.5)' // 路线节点标题背景色
}

export default class {
  /**
   * 构造方法
   * @param context 三维视图内容
   * @param coMap 点位坐标map集合
   */
  constructor(context) {
    this.viewer = context.viewer
    this.Cesium = context.Cesium
    this.startDate = this.Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16)) // 开始时间
    this.stopDate = null // 结束时间
    this.flyingMarker = null // 飞行标注
    this.removeOnTickCallBack = null // 移除时钟变化的回调
    this.routePositions = [] // 路线的位置数组
    this.routeLength = 0
    this.passedLength = 0
    this.geoLocation = null
    this.entityArray = [] // 绘制轨迹添加实体数组
  }

  /**
   * 绘制飞行路线
   * @param {*} positions
   */
  drawFlyingTrack(positions) {
    this.clear()
    if (positions.length > 0) {
      this.addTrackLine(positions)
      this.addTrackLineNodes(positions)
      this.viewer.zoomTo(this.entityArray)
    }
  }

  /**
   * 添加轨迹线
   */
  addTrackLine(positions) { // 绘制轨迹线
    let routeLine = this.viewer.entities.add({
      polyline: {
        positions: positions,
        width: TRACKSTYLE.lineWidth,
        material: new this.Cesium.PolylineOutlineMaterialProperty({
          color: this.Cesium.Color.fromCssColorString(TRACKSTYLE.lineColor),
          outlineWidth: TRACKSTYLE.lineOutlineWidth,
          outlineColor: this.Cesium.Color.fromCssColorString(TRACKSTYLE.lineOutlineColor)
        }),
        zIndex: TRACKSTYLE.lineZIndex,
        clampToGround: TRACKSTYLE.lineClampToGround
      }
    })
    this.entityArray.push(routeLine)
  }

  /**
   * 添加轨迹线节点
   */
  addTrackLineNodes(positions) { // 添加点位和信息
    for (let position of positions) {
      let pointEntity = this.viewer.entities.add({
        position: position,
        point: {
          pixelSize: TRACKSTYLE.pointPixelSize,
          color: this.Cesium.Color.fromCssColorString(TRACKSTYLE.pointColor),
          outlineColor: this.Cesium.Color.fromCssColorString(TRACKSTYLE.pointOutlineColor),
          outlineWidth: TRACKSTYLE.pointOutlineWidth,
          zIndex: TRACKSTYLE.pointZIndex
        }
      })
      this.entityArray.push(pointEntity) // 添加点位实体
    }
  }

  /**
   * 飞行漫游
   * @param {*} positions Cartesian3坐标数组
   */
  flyingRoute(positions, route) {
    this.clear() // 清空绘制
    if (positions.length > 0) {
      this.geoLocation = route.coordinates[0]
      this.routePositions = positions
      this.getRouteLength()
      let { isCircle, isShowRoute, speed, viewMode, viewHeight, isShowMarker } = route
      let seconds = TRACKSTYLE.animateStep * (positions.length - 1) // 飞行的总时间，秒数
      this.timeSettings(seconds, isCircle, speed) // 时间设置
      let property = new this.Cesium.SampledPositionProperty() // 构造位置属性对象
      for (let index = 0; index < positions.length; index++) { // 遍历位置数组
        let time = this.Cesium.JulianDate.addSeconds(this.startDate, index * 30, new this.Cesium.JulianDate()) // 时间
        let position = positions[index] // 位置
        property.addSample(time, position) // 添加位置属性对象中
        if (isShowMarker) { // 显示标记时
          let label = '第 ' + (index + 1) + ' 点'
          this.addRouteNode(position, label)
        }
      }
      let flyingParam = this.getFlyingEntityParam(property, isShowRoute)
      this.flyingMarker = this.viewer.entities.add(flyingParam)
      this.entityArray.push(this.flyingMarker) // 添加点位实体
      this.setViewMode(viewMode, viewHeight)
    }
  }

  /**
   * 获取路线的长度
   */
  getRouteLength() {
    this.routeLength = 0 // 路线总长度
    for (let i = 1; i < this.routePositions.length; i++) {
      let segmentLength = this.Cesium.Cartesian3.distance(this.routePositions[i - 1], this.routePositions[i])
      this.routeLength += segmentLength
    }
  }

  /**
   * 获取飞行实体参数
   * @param {*} property 时间，位置属性
   * @param {*} isShowRoute 是否显示路线
   * @returns
   */
  getFlyingEntityParam(property, isShowRoute) {
    let flyingParam = {
      availability: new this.Cesium.TimeIntervalCollection([new this.Cesium.TimeInterval({
        start: this.startDate,
        stop: this.stopDate
      })]),
      position: property,
      orientation: new this.Cesium.VelocityOrientationProperty(property),
      point: {
        pixelSize: TRACKSTYLE.pointPixelSize,
        color: this.Cesium.Color.fromCssColorString(TRACKSTYLE.pointColor),
        outlineColor: this.Cesium.Color.fromCssColorString(TRACKSTYLE.movingPointOutlineColor),
        outlineWidth: TRACKSTYLE.pointOutlineWidth,
        zIndex: TRACKSTYLE.movingPointZIndex
      }
    }
    if (isShowRoute) {
      flyingParam.path = {
        resolution: TRACKSTYLE.pathResolution,
        material: new this.Cesium.PolylineGlowMaterialProperty({
          glowPower: TRACKSTYLE.pathGlowPower,
          color: this.Cesium.Color.fromCssColorString(TRACKSTYLE.lineColor),
          outlineWidth: TRACKSTYLE.lineOutlineWidth,
          outlineColor: this.Cesium.Color.fromCssColorString(TRACKSTYLE.lineOutlineColor)
        }),
        width: TRACKSTYLE.lineWidth,
        zIndex: TRACKSTYLE.lineZIndex
      }
    }
    return flyingParam
  }

  /**
   * 添加飞行路线节点
   * @param {*} position 位置
   * @param {*} label 显示文本
   */
  addRouteNode(position, label) {
    let pointParam = {
      position: position,
      point: {
        pixelSize: TRACKSTYLE.pointOutlineWidth,
        color: this.Cesium.Color.fromCssColorString(TRACKSTYLE.pointColor),
        outlineColor: this.Cesium.Color.fromCssColorString(TRACKSTYLE.pointOutlineColor),
        outlineWidth: TRACKSTYLE.pointOutlineWidth,
        zIndex: TRACKSTYLE.pointZIndex
      }
    }
    if (label) { // 是否有文本信息
      pointParam.label = {
        text: label,
        font: TRACKSTYLE.labelFont,
        style: this.Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: TRACKSTYLE.labelOutlineWidth,
        showBackground: true,
        backgroundColor: this.Cesium.Color.fromCssColorString(TRACKSTYLE.labelBGColor),
        verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new this.Cesium.Cartesian2(TRACKSTYLE.labelOffset.x, TRACKSTYLE.labelOffset.y),
        zIndex: TRACKSTYLE.labelZIndex
      }
    }
    let pointEntity = this.viewer.entities.add(pointParam)
    this.entityArray.push(pointEntity) // 添加点位实体
  }

  /**
   * 时间设置
   * @param {*} seconds
   */
  timeSettings(seconds, isCircle, speed) {
    this.stopDate = this.Cesium.JulianDate.addSeconds(this.startDate, seconds, new this.Cesium.JulianDate()) // 设置飞行结束时间
    this.viewer.clock.startTime = this.startDate.clone()
    this.viewer.clock.stopTime = this.stopDate.clone()
    this.viewer.clock.currentTime = this.startDate.clone()
    this.viewer.clock.clockRange = this.Cesium.ClockRange.CLAMPED // 设置时钟范围不循环
    if (isCircle) {
      this.viewer.clock.clockRange = this.Cesium.ClockRange.LOOP_STOP // 设置时钟范围循环
    }
    this.viewer.clock.multiplier = speed // 设置时间变化量
    this.removeOnTickCallBack = this.viewer.clock.onTick.addEventListener(clock => {
      this.handleClockUpdate(clock)
    })
  }

  /**
   * 处理时钟变化
   * @param {*} clock
   */
  handleClockUpdate(clock) { // 处理时钟更新
    let seconds = clock.currentTime.secondsOfDay - clock.startTime.secondsOfDay
    let index = seconds / TRACKSTYLE.animateStep
    this.passedLength = 0
    let i = 0
    for (i = 0; i < index - 1; i++) {
      let segmentLength = this.Cesium.Cartesian3.distance(this.routePositions[i], this.routePositions[i + 1])
      this.passedLength += segmentLength
    }
    let geoPosition = new this.Cesium.Cartesian3(0, 0, 0)
    this.Cesium.Cartesian3.lerp(this.routePositions[i], this.routePositions[i + 1], index - i, geoPosition)
    let geoSegmentLength = this.Cesium.Cartesian3.distance(this.routePositions[i], geoPosition)
    this.passedLength += geoSegmentLength
    // 计算定位的位置
    let cartographic = this.Cesium.Cartographic.fromCartesian(geoPosition)
    let { longitude, latitude, height } = cartographic
    longitude = this.Cesium.Math.toDegrees(longitude)
    latitude = this.Cesium.Math.toDegrees(latitude)
    this.geoLocation = [longitude, latitude, height]
  }

  /**
   * 谁知视图模式
   * @param {*} viewMode 视图模式
   */
  setViewMode(viewMode, viewHeight) {
    if (viewMode === mapUtil.VIEWMODE.tracklook) {
      this.viewer.trackedEntity = this.flyingMarker
    } else if (viewMode === mapUtil.VIEWMODE.followlook) {
      this.viewer.trackedEntity = undefined
      this.viewer.zoomTo(this.entityArray, new this.Cesium.HeadingPitchRange(this.Cesium.Math.toRadians(-90), this.Cesium.Math.toRadians(-15), viewHeight))
    } if (viewMode === mapUtil.VIEWMODE.overlook) {
      this.viewer.trackedEntity = undefined
      this.viewer.zoomTo(this.entityArray, new this.Cesium.HeadingPitchRange(0, this.Cesium.Math.toRadians(-90), viewHeight))
    }
  }

  /**
   * 清除绘制
   */
  clear() {
    if (this.entityArray && this.entityArray.length > 0) {
      for (const entity of this.entityArray) { // 遍历实体数组，从3D视图中移除实体
        this.viewer.entities.remove(entity)
      }
    }
    this.viewer.trackedEntity = undefined
    this.flyingMarker = null
    this.entityArray = [] // 绘制轨迹添加实体数组
    this.routePositions = [] // 清空路线数组
    this.routeLength = 0 // 重置路线的长度
    this.passedLength = 0 // 重置经过的长度
    this.geoLocation = null // 定位位置
    if (this.removeOnTickCallBack) { // 时钟变化回调移除函数
      this.removeOnTickCallBack()
      this.removeOnTickCallBack = null
    }
  }
}
