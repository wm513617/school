let timestamp = '' // 初始时间时间戳 初始时在时间轴中间
let centralTime = 0// 时间轴中间的时间
let everyPxSecond = 0 // 每像素对应的秒数，
// 时间刻度轴
export let timerShaft = {
  // 时间轴总共有60个刻度
  timePeriod: 0, // 周期 单位 S
  canvas: {},
  // timestamp: '', // 初始时间时间戳 初始时在时间轴中间
  scaleSeconds: 0, // 每个刻度代表秒数
  context: {},
  widthCanvas: 0, // CANVAS 宽度
  marginTop: 25, // 时间轴线与上边框距离
  timeScaleHeight: 20, // 时间轴高度
  longScale: 16, // 长刻度
  ShortScale: 10, // 短刻度
  scaleSpacing: 0, // 刻度间距
  aboutSpacing: 300, // 时间轴左右间距
  timeTop: 13, // 时间显示位置 top
  timeLeft: 20, // 时间显示位置，
  centralPoint: 0, // 时间轴中心点
  moment: {},
  clientX: 0, // 鼠标按下时的位置
  clientY: 0,
  isMousedown: false, // 是否点击事件
  moveDistance: 0, // 累计移动距离,
  // centralTime: 0, // 时间轴中间的时间
  mousemoveCallback: () => {}, // 拖动时间轴回调函数 参数为 移动距离
  mouseupCallback: () => {}, // 鼠标抬起或移出父盒子回调函数
  moveOver: () => {}, // 移动最终位置时触发， 鼠标抬起 或鼠标移出
  /**
   * @description: 初始化canvas DOM
   * @param {type} 标签的 dom
   * currentTime : 中间时间
   * moment: moment 插件
   * dom: 要监听的鼠标dom
   * @return:
   */
  init(canvas, moment, currentTime, timePeriod, dom) {
    this.moveDistance = 0
    dom = dom ? document.querySelector(dom) : canvas.parentNode.parentNode.parentNode
    this.moment = moment
    this.canvas = canvas
    canvas.width = canvas.parentNode.offsetWidth
    canvas.height = canvas.parentNode.offsetHeight
    this.timePeriod = timePeriod
    timestamp = this.moment(currentTime).unix() // 当前时间时间戳
    // centralTime = this.moment(currentTime).format('YYYY-MM-DD  HH:mm:ss')
    centralTime = this.moment(currentTime).unix()
    // console.log(centralTime, 66)
    this.context = canvas.getContext('2d')
    this.widthCanvas = canvas.width
    this.scaleSpacing = this.widthCanvas / 60
    this.scaleSeconds = timePeriod / 60
    everyPxSecond = this.timePeriod / this.widthCanvas // ，每像素对应的时间 s
    this.centralPoint = Math.floor(this.widthCanvas / 2) // 时间轴中心点
    // this.moment = moment
    this.drawing()
    // canvas.parentNode.parentNodeonmousedown = (e) => {
    dom.onmousedown = (e) => {
      this.clientX = e.clientX
      this.clientY = e.clientY
      this.isMousedown = true
    }
    dom.onmousemove = (e) => {
      if (this.isMousedown) {
        this.drawing(e.clientX - this.clientX + this.moveDistance, 0)
        this.mousemoveCallback(e.clientX - this.clientX + this.moveDistance, centralTime)
        this.countCentralTime(e.clientX - this.clientX + this.moveDistance)
      }
    }
    dom.onmouseup = (e) => {
      this.isMousedown = false
      this.moveDistance += (e.clientX - this.clientX)
      this.mouseupCallback(this.moveDistance)
      this.countCentralTime(this.moveDistance)
      this.moveOver(centralTime)
    }
    dom.onmouseleave = (e) => {
      console.log('yichu')
      e.stopPropagation()
      e.preventDefault()
      if (this.isMousedown) {
        this.isMousedown = false
        this.mouseupCallback(this.moveDistance)
        this.countCentralTime(this.moveDistance)
        this.moveOver(centralTime)
      }
    }
  },
  drawing(X = 0, Y = 0) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 开始绘画
    this.context.beginPath()
    this.context.rect(0, this.marginTop + Y, this.widthCanvas + this.aboutSpacing * 2, this.timeScaleHeight)
    this.context.fillStyle = 'rgba(82,98,124,0.5)'
    this.context.fill() // 画出长方形底
    this.context.beginPath()
    this.context.moveTo(this.centralPoint + X, this.marginTop + this.timeScaleHeight + Y)
    this.context.lineTo(this.centralPoint + X, this.marginTop + this.timeScaleHeight - this.longScale + Y)
    this.context.fillStyle = 'rgb(255,255,255)' // 时间为颜色
    this.context.fillText(this.moment(timestamp * 1000).format('HH:mm:ss'), this.centralPoint + X - this.timeLeft, this.marginTop + this.timeScaleHeight - this.longScale + Y - this.timeTop)
    this.context.stroke() // 时间轴中心点
    let scaleNumberLeft = Math.floor((this.centralPoint + this.aboutSpacing + (X >= 0 ? X : 0) / this.scaleSpacing))
    let scaleNumberRight = Math.floor((this.centralPoint + this.aboutSpacing + (X <= 0 ? Math.abs(X) : 0) / this.scaleSpacing))
    for (let index = 1; index < scaleNumberLeft; index++) {
      this.context.beginPath()
      if (index % 5 === 0) {
        this.left(index, true, X, Y)
      } else {
        this.left(index, false, X, Y)
      }
      // context.fillStyle='rgb(0,0,0)'
      this.context.stroke()
    }
    for (let index = 1; index < scaleNumberRight; index++) {
      this.context.beginPath()
      if (index % 5 === 0) {
        this.right(index, true, X, Y)
      } else {
        this.right(index, false, X, Y)
      }
      // context.fillStyle='rgb(0,0,0)'
      this.context.stroke()
    }
  },
  moveDrawing(time) {
    // 根据传入时间算出时间轴偏移距离 并重新绘制
    let movePx = (this.widthCanvas / this.timePeriod) * (timestamp - time)
    this.moveDistance = movePx
    this.drawing(this.moveDistance)
  },
  left(index, isFive, X, Y) {
    let terminus = this.marginTop + this.timeScaleHeight - (isFive ? this.longScale : this.ShortScale) // 长刻度还是短刻度
    this.context.moveTo(this.centralPoint - (index * this.scaleSpacing) + X, this.marginTop + this.timeScaleHeight + Y)
    this.context.lineTo(this.centralPoint - (index * this.scaleSpacing) + X, terminus + Y)
    if (isFive) {
      let time = this.moment((timestamp - index * this.scaleSeconds) * 1000).format('HH:mm:ss')
      this.context.fillText(time, this.centralPoint - (index * this.scaleSpacing) + X - this.timeLeft, terminus + Y - this.timeTop)
    }
  },
  right(index, isFive, X, Y) {
    let terminus = this.marginTop + this.timeScaleHeight - (isFive ? this.longScale : this.ShortScale) // 长刻度还是短刻度
    this.context.moveTo(this.centralPoint + (index * this.scaleSpacing) + X, this.marginTop + this.timeScaleHeight + Y)
    this.context.lineTo(this.centralPoint + (index * this.scaleSpacing) + X, terminus + Y)
    if (isFive) {
      let time = this.moment((timestamp + index * this.scaleSeconds) * 1000).format('HH:mm:ss')
      this.context.fillText(time, this.centralPoint + (index * this.scaleSpacing) + X - this.timeLeft, terminus + Y - this.timeTop)
    }
  },
  countCentralTime(moveDistance) {
    let time = (this.timePeriod / this.widthCanvas) * moveDistance
    // centralTime = this.moment((timestamp - time) * 1000).format('YYYY-MM-DD  HH:mm:ss')
    centralTime = timestamp - time
    // console.log(centralTime)
  },
  formatting() {
    return timestamp
  }
}
// 录像条
export class VideoShaft {
//    * obj: 录像条的信息
//    *  {
//    *    timing: [{s,e}, {}],
//    *     event: ...
//    * }
  constructor(dom, obj, moment) {
    this.obj = obj
    this.canvas = document.createElement('canvas')
    // dom.appendChild(this.canvas) // 先设置宽度在放dom 否则获取的offsetWidth有问题
    this.canvas.width = dom.offsetWidth
    this.canvas.height = dom.offsetHeight
    dom.appendChild(this.canvas)
    this.moment = moment
    this.context = this.canvas.getContext('2d')
    this.drawing()
  }
  drawing(isMove) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // this.context.beginPath()
    // this.context.rect(0, 0, this.canvas.width, 8)
    // this.context.fillStyle = 'rgb(153,153,153)'
    // this.context.fill()
    // this.context.stroke()

    // this.context.beginPath()
    // this.context.rect(0, 8, this.canvas.width, 8)
    // this.context.fillStyle = 'rgb(153,153,153)'
    // this.context.fill()
    // this.context.stroke()
    // 定时录像段\
    // console.log(centralTime, '', everyPxSecond)
    for (let index = 0; index < this.obj.timing.length; index++) {
      let start = this.moment(this.obj.timing[index].start).unix() // 开始时间戳
      let over = this.moment(this.obj.timing[index].over).unix() // 开始时间戳
      let centrePoint = this.canvas.width / 2 // 中心点距离
      let startPoint = ((start - centralTime) / everyPxSecond) + centrePoint
      let timingWidth = Math.abs(((over - centralTime) / everyPxSecond) + centrePoint - startPoint)
      this.context.beginPath()
      this.context.rect(startPoint, 9, timingWidth, 8) // 录像段高度 8 px
      this.context.fillStyle = 'rgb(0,153,0)'
      this.context.fill()
      this.context.stroke()
    }
    // 事件录像条
    for (let index = 0; index < this.obj.event.length; index++) {
      let start = this.moment(this.obj.event[index].start).unix() // 开始时间戳
      let over = this.moment(this.obj.event[index].over).unix() // 开始时间戳
      let centrePoint = this.canvas.width / 2 // 中心点距离
      let startPoint = ((start - centralTime) / everyPxSecond) + centrePoint
      // 确定长方形宽度
      let timingWidth = Math.abs(((over - centralTime) / everyPxSecond) + centrePoint - startPoint)
      this.context.beginPath()
      this.context.rect(((start - centralTime) / everyPxSecond) + centrePoint, 0, timingWidth, 8) // 录像段高度 8 px
      this.context.fillStyle = 'rgb(0,0,255)'
      this.context.fill()
      this.context.stroke()
    }
  }
}
