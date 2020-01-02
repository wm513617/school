/**
 * 鼠标提示工具类
 */
import './pretty.css'

export default class {
  /**
   * 构造方法
   */
  constructor(element) {
    this.container = null
    this.titleElement = null
    this.msg = '' // 提示信息
    this.active = false // 初始化禁用
    this.createTipConatiner(element)
  }
  /**
   * 创建提示容器
   */
  createTipConatiner(element) {
    this.container = document.createElement('div')
    this.container.className = 'twipsy right'
    let arrow = document.createElement('div') // 箭头元素
    arrow.className = 'twipsy-arrow'
    this.container.appendChild(arrow)
    this.titleElement = document.createElement('div') // 信息容器
    this.titleElement.className = 'twipsy-inner'
    this.container.appendChild(this.titleElement)
    element.appendChild(this.container)
    this.container.style.display = 'none' // 初始化不显示提示
    this.container.parentNode.addEventListener('mousemove', event => { // 监听提示框父节点容器上的鼠标移动
      this.active && this.handleMousemoveParentNode(event)
    }, false)
    this.container.addEventListener('mousemove', event => { // 监听提示框容器上的鼠标移动
      this.active && this.handleMousemoveContainer(event)
    }, false)
  }
  /**
   * 处理鼠标移动
   */
  handleMousemoveParentNode(event) {
    event.preventDefault()
    event.stopPropagation()
    this.showAt({x: event.offsetX, y: event.offsetY}, this.msg)
  }
  /**
   * 处理鼠标移动
   */
  handleMousemoveContainer(event) {
    event.preventDefault()
    event.stopPropagation()
    let left = Number(this.container.style.left.substr(0, this.container.style.left.length - 2))
    let top = Number(this.container.style.top.substr(0, this.container.style.top.length - 2))
    this.showAt({x: left + event.offsetX, y: top + event.offsetY}, this.msg)
  }
  /**
   * 设置提示容器是否可见
   */
  setVisible(flag) {
    this.active = flag
    this.container.style.display = flag ? 'block' : 'none'
  }
  /**
   * 设置提示容器显示的位置及信息
   */
  showAt(position, msg) {
    if (position && msg) {
      this.setVisible(true)
      this.titleElement.innerHTML = msg
      this.container.style.left = position.x + 10 + 'px'
      this.container.style.top = (position.y - this.container.clientHeight / 2) + 'px'
      this.msg = msg
    }
  }
  /**
   * 提示容器销毁方法
   */
  destory() {
    this.container.parentNode.removeEventListener('mousemove', event => { // 移除提示框事件监听
      this.handleMousemoveParentNode(event)
    }, true)
    this.container.removeEventListener('mousemove', event => { // 移除提示框父节点事件监听
      this.handleMousemoveContainer(event)
    }, true)
    this.container && this.container.parentNode.removeChild(this.container)
  }
}
