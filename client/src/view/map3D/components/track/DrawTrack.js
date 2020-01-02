const minPointNnm = 5 // 显示动态线最小的显示点位数量

export default class {
  /**
   * 构造方法
   * @param context 三维视图内容
   * @param coMap 点位坐标map集合
   */
  constructor(context, coMap = null, drawType = {}) {
    this.viewer = context.viewer
    this.Cesium = context.Cesium
    this.coMap = coMap
    this.entityArray = [] // 绘制轨迹添加实体数组
    this.trackOps = this.defaultOps() // 默认属性
    drawType.color && (this.trackOps.lineColor = drawType.color)
  }

  /**
   * 默认属性
   */
  defaultOps() {
    return {
      lineWidth: 8, // 线宽
      lineColor: 'rgba(0, 0, 255, 0.8)', // 线颜色
      lineOutlineWidth: 0, // 线边框宽度
      lineOutlineColor: 'rgba(0, 0, 0, 1)', // 线边框颜色
      lineClampToGround: true, // 线是否何地贴合
      lineZIndex: 10001, // 线zIndex
      pointColor: 'rgba(255, 0, 0, 1)', // 点颜色
      pointOutlineColor: 'rgba(255, 255, 255, 1)', // 点边框颜色
      pointOutlineWidth: 2, // 点边框宽度
      pointZIndex: 10002, // 点zIndex
      labelFont: '14pt monospace', // 点标题字体
      labelOutlineWidth: 2, // 点标题边框宽度
      labelOffset: {x: 0, y: -9}, // 点标题偏移
      labelZIndex: 10003, // 点标题zIndex
      streamingTime: 2500 // 线流动效果周期
    }
  }

  /**
   * 绘制轨迹
   */
  drawTrack() {
    let positions = [...this.coMap.values()] // 位置坐标数组
    this.addTrackLine(positions) // 绘制轨迹线
    this.addPointLabel() // 添加点位和信息
    if (this.coMap.size >= minPointNnm) {
      this.addStreamLine(positions) // 添加动态效果
    }
    this.viewer.zoomTo(this.entityArray, new this.Cesium.HeadingPitchRange(0, this.Cesium.Math.toRadians(-90)))
  }

  drawLineTrack(coMap = null) {
    this.coMap = coMap
    this.drawTrack()
  }

  /**
   * 绘制单兵实时轨迹
   */
  drawSingleRealTrack(positions) {
    // 绘制轨迹线
    let lineEntity = this.viewer.entities.add({
      polyline: {
        positions: positions,
        width: this.trackOps.lineWidth,
        material: new this.Cesium.PolylineOutlineMaterialProperty({
          color: this.Cesium.Color.fromCssColorString(this.trackOps.lineColor),
          outlineWidth: this.trackOps.lineOutlineWidth,
          outlineColor: this.Cesium.Color.fromCssColorString(this.trackOps.lineOutlineColor)
        }),
        zIndex: this.trackOps.lineZIndex,
        clampToGround: this.trackOps.lineClampToGround
      }
    })
    this.entityArray.push(lineEntity)
    // 添加轨迹线节点
    for (let position of positions) {
      let pointEntity = this.viewer.entities.add({
        position: position,
        point: {
          pixelSize: this.trackOps.lineOutlineWidth,
          color: this.Cesium.Color.fromCssColorString(this.trackOps.pointColor),
          outlineColor: this.Cesium.Color.fromCssColorString(this.trackOps.pointOutlineColor),
          outlineWidth: this.trackOps.pointOutlineWidth,
          zIndex: this.trackOps.pointZIndex
        }
      })
      this.entityArray.push(pointEntity) // 添加点位实体
    }
    // 添加动态效果
    if (positions.length >= minPointNnm) {
      this.addStreamLine(positions) // 添加动态效果
    }
    this.viewer.zoomTo(this.entityArray, new this.Cesium.HeadingPitchRange(0, this.Cesium.Math.toRadians(-90)))
  }

  /**
   * 添加轨迹线
   */
  addTrackLine(positions) { // 绘制轨迹线
    // let positions = [...this.coMap.values()] // 位置坐标数组
    let lineEntity = this.viewer.entities.add({
      polyline: {
        positions: positions,
        width: this.trackOps.lineWidth,
        material: new this.Cesium.PolylineOutlineMaterialProperty({
          color: this.Cesium.Color.fromCssColorString(this.trackOps.lineColor),
          outlineWidth: this.trackOps.lineOutlineWidth,
          outlineColor: this.Cesium.Color.fromCssColorString(this.trackOps.lineOutlineColor)
        }),
        zIndex: this.trackOps.lineZIndex,
        clampToGround: this.trackOps.lineClampToGround
      }
    })
    this.entityArray.push(lineEntity)
  }

  /**
   * 添加点位和标题
   */
  addPointLabel() { // 添加点位和信息
    for (let [attr, position] of this.coMap.entries()) {
      console.log('点位信息：', attr, '点位位置：', position.toString())
      let pointEntity = this.viewer.entities.add({
        position: position,
        point: {
          pixelSize: this.trackOps.lineOutlineWidth,
          color: this.Cesium.Color.fromCssColorString(this.trackOps.pointColor),
          outlineColor: this.Cesium.Color.fromCssColorString(this.trackOps.pointOutlineColor),
          outlineWidth: this.trackOps.pointOutlineWidth,
          zIndex: this.trackOps.pointZIndex
        },
        label: {
          text: attr.label,
          font: this.trackOps.labelFont,
          style: this.Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: this.trackOps.labelOutlineWidth,
          verticalOrigin: this.Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new this.Cesium.Cartesian2(this.trackOps.labelOffset.x, this.trackOps.labelOffset.y),
          zIndex: this.trackOps.labelZIndex
        }
      })
      this.entityArray.push(pointEntity) // 添加点位实体
    }
  }

  /**
   * 添加动态线效果
   */
  addStreamLine(positions) {
    // let positions = [...this.coMap.values()] // 位置信息
    let animateTime = this.trackOps.streamingTime // 动画持续时间为5秒
    // let animateTime = 2500 // 动画持续时间为5秒
    let start = 0 // 开始时间
    let streamLineEntity = this.viewer.entities.add({
      polyline: {
        positions: new this.Cesium.CallbackProperty((time, result) => {
          let end = this.Cesium.JulianDate.toDate(time).getTime()
          if (start === 0) {
            start = end
          }
          let index = ((end - start) % animateTime) / animateTime * positions.length // index可能是小数，可根据情况进行取整
          return positions.slice(index - 1, index + 1) // 选取临近的两点组成线段的位置
        }, false),
        width: this.trackOps.lineWidth,
        material: this.Cesium.Color.WHITE.withAlpha(0.5), // 设置颜色
        zIndex: 1005,
        clampToGround: true
      }
    })
    this.entityArray.push(streamLineEntity)
  }

  /**
   * 清除轨迹的绘制
   */
  clearTrack() {
    if (this.entityArray && this.entityArray.length > 0) {
      for (const entity of this.entityArray) {
        this.viewer.entities.remove(entity)
      }
    }
    this.coMap = null
    this.entityArray = []
  }
}
