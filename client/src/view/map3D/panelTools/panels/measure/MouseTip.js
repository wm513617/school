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
    this.container.addEventListener('mousemove', event => { // 监听容器上的鼠标移动
      this.handleMousemove(event)
    })
  }
  /**
   * 处理鼠标移动
   */
  handleMousemove(event) {
    this.showAt({x: event.clientX, y: event.clientY}, this.message)
  }
  /**
   * 设置提示容器是否可见
   */
  setVisible(flag) {
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
    this.container.removeEventListener('mousemove', event => { // 移除事件监听
      this.handleMousemove(event)
    })
    this.container && this.container.parentNode.removeChild(this.container)
  }
}
