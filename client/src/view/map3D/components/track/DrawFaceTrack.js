export default class {
  /**
   * 构造方法
   * @param context 三维视图内容
   * @param coMap 点位坐标map集合
   */
  constructor(context, coMap = null) {
    this.viewer = context.viewer
    this.Cesium = context.Cesium
    this.coMap = coMap
    this.entityArray = [] // 绘制轨迹添加实体数组
    this.trackOps = this.defaultOps() // 默认属性
  }

  /**
   * 默认属性
   */
  defaultOps() {
    return {
      lineWidth: 8 // 线宽
    }
  }

  /**
   * 人像绘制
   */
  drawFaceTrack() {
    let items = [...this.coMap.values()] // 位置坐标数组
    if (items && items.length) {
      for (let item of items) {
        this.drawSuspension(item)
      }
    }
  }
  drawSuspension(item) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, l, r) {
      // 开始绘制
      this.beginPath()
      this.moveTo(r, 0)
      this.lineTo(x - r, 0)
      this.arcTo(x, 0, x, r, r)
      this.lineTo(x, y - l - r)
      this.arcTo(x, y - l, x - r, y - l, r)
      this.lineTo(x / 2 + l, y - l)
      this.lineTo(x / 2, y)
      this.lineTo(x / 2 - l, y - l)
      this.lineTo(r, y - l)
      this.arcTo(0, y - l, 0, y - l - r, r)
      this.lineTo(0, r)
      this.arcTo(0, 0, r, 0, r)
      this.closePath()
      this.lineWidth = 0.02 * x
      this.strokeStyle = '#D0021B'
      this.fillStyle = '#fff'
      this.fill()
      this.stroke()
      return this
    }
    var scale = 0.05
    var localImg = new Image()
    localImg.src = item.passImage
    localImg.onload = () => {
      var canvas = document.createElement('canvas')
      var context = canvas.getContext('2d')
      var into = document.createElement('canvas')
      var ctx2 = into.getContext('2d')
      let min = Math.min(localImg.width, localImg.height) > 140 ? Math.min(localImg.width, localImg.height) : Math.max(localImg.width, localImg.height) // 获取图片宽高的最小值
      min = min > 140 ? min : 140
      scale = 8 / min
      canvas.width = min
      canvas.height = min
      into.width = min
      into.height = min
      ctx2.drawImage(localImg, 0.1 * min, 0.02 * min, 0.8 * min, 0.71 * min)
      ctx2.fillStyle = 'rgba(255,255,255,0.9)'
      ctx2.fillRect(0.814 * min, 0.01 * min, 0.176 * min, 0.1 * min)
      // ctx2.fill()
      var pattern = context.createPattern(into, 'no-repeat')
      context.roundRect(min, min, 0.06 * min, 0.05 * min)
      context.font = 0.06 * min + 'px Arial'
      context.fillStyle = 'rgba(153, 153, 153, 0.3)'
      context.fillRect(0.01 * min, 0.01 * min, 0.98 * min, 0.73 * min)
      context.fillStyle = pattern
      context.fill()
      this.drawText(context, item.deviceName, 0.05 * min, 0.75 * min, 0.9 * min, 0.2 * min, 'rgba(70,49,49,0.80)')
      // this.drawText(context, item.similar + '%', 0.824 * min, 0.04 * min, 0.2 * min, 0.1 * min, '#08BA53')
      // context.textAlign = 'right'
      context.fillStyle = 'rgba(8,186,83,0.80)'
      context.fillText(item.passCount + '次', 0.824 * min, 0.86 * min)
      // context.fill()
      context.fillStyle = '#08BA53'
      context.fillText(item.similar + '%', 0.824 * min, 0.08 * min)
      // context.fill()
      // this.drawText(context, item.passCount + '次', 0.824 * min, 0.83 * min, 0.2 * min, 0.1 * min, 'rgba(8,186,83,0.80)')

      var point = item.coordinates
      if (point && point.length) {
        let faceEntity = this.viewer.entities.add({
          position: this.Cesium.Cartesian3.fromDegrees(Number(point[0]), Number(point[1]), (Number(point[2]) || 10) + (scale * min * 0.5)),
          billboard: {
            image: canvas,
            scale: scale,
            sizeInMeters: true
          }
        })
        this.entityArray.push(faceEntity) // 添加点位实体
      }
    }
  }

  /**
   * 人像文字换行处理
   */
  drawText(ctx, text, x, y, width, height, color) {
    console.log(text)
    let oldBaseLine = ctx.textBaseline
    ctx.textBaseline = 'hanging'
    let lineHeight = parseInt(ctx.font) // ctx.font必须以'XXpx'开头
    // 计算每一行
    let lines = []
    let curLine = ''
    for (let char of text) {
      let nextLine = curLine + char
      if (char === '\n' || ctx.measureText(nextLine).width > width) {
        lines.push(curLine)
        curLine = char === '\n' ? '' : char
      } else {
        curLine = nextLine
      }
    }
    lines.push(curLine)
    // 逐行画文本
    let lineY = y
    for (let line of lines) {
      let lineX
      if (ctx.textAlign === 'center') {
        lineX = x + width / 2
      } else if (ctx.textAlign === 'right') {
        lineX = x + width
      } else {
        lineX = x
      }
      ctx.fillStyle = color
      ctx.fillText(line, lineX, lineY, width)
      lineY += lineHeight + 5
    }
    ctx.textBaseline = oldBaseLine
  }

  clearFaceTrack() {
    if (this.entityArray && this.entityArray.length > 0) {
      for (const entity of this.entityArray) {
        this.viewer.entities.remove(entity)
      }
    }
    this.coMap = null
    this.entityArray = []
  }
}
