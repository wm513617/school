import _ from 'lodash'

export default {
  name: 'dragContainer',
  props: {
    position: {
      type: Object,
      default() {
        return {
          left: 0,
          top: 0
        }
      }
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    selectAreaClassName: {
      type: String,
      default: null
    } // 提供一个容器的选择器 只有在这里可以拖动
  },
  data() {
    return {
      isMouseDown: false,
      elementDragContainer: null,
      mouseDownPositon: {
        x: null,
        y: null
      },
      moveRange: null
    }
  },
  mounted() {
    this.elementDragContainer = this.$refs.dragContainer
    this.moveRange = this.getMoveRange()
    this.$el.style.setProperty('z-index', this.zIndex)

    let elementSelectArea

    if (this.selectAreaClassName) {
      elementSelectArea = this.elementDragContainer.querySelector('.' + this.selectAreaClassName)
      elementSelectArea.style.cursor = 'move'
      elementSelectArea.onmousedown = event => {
        this.handleMouseDown(event)
      }
    } else {
      this.elementDragContainer.onmousedown = event => {
        this.handleMouseDown(event)
      }
    }

    document.onmousemove = event => {
      this.handleMouseMove(event)
    }
    document.onmouseup = event => {
      this.handleMouseUp(event)
    }
    window.onresize = _.debounce(() => {
      this.moveRange = this.getMoveRange()
    }, 150)

    this.setDragContainerPosition(this.position.left, this.position.ltop)
  },
  methods: {
    handleMouseDown(event) {
      this.isMouseDown = true
      this.mouseDownPositon.x = event.clientX - this.position.left
      this.mouseDownPositon.y = event.clientY - this.position.top
    },
    handleMouseMove(event) {
      if (!(this.elementDragContainer && this.isMouseDown && this.moveRange)) {
        return
      }

      const offsetX = event.clientX - this.mouseDownPositon.x
      const offsetY = event.clientY - this.mouseDownPositon.y

      this.position.left = offsetX
      this.position.top = offsetY

      this.setDragContainerPosition(offsetX, offsetY)
    },
    handleMouseUp() {
      this.isMouseDown = false
    },
    getMoveRange() {
      const maskWidth = document.querySelector('body').offsetWidth
      const maskHeight = document.querySelector('body').offsetHeight

      const containerWidth = this.elementDragContainer.offsetWidth
      const containerHeight = this.elementDragContainer.offsetHeight

      const range = {
        left: maskWidth - containerWidth - 300,
        top: maskHeight - containerHeight
      }
      return range
    },
    setDragContainerPosition(offsetX, offsetY) {
      if (offsetX >= 0 && offsetX <= this.moveRange.left) {
        this.elementDragContainer.style.setProperty('left', offsetX + 'px')
      } else if (offsetX > this.moveRange.left) {
        this.elementDragContainer.style.setProperty('left', this.moveRange.left + 'px')
      } else {
        this.elementDragContainer.style.setProperty('left', 0 + 'px')
      }

      if (offsetY >= 0 && offsetY <= this.moveRange.top) {
        this.elementDragContainer.style.setProperty('top', offsetY + 'px')
      } else if (offsetY > this.moveRange.top) {
        this.elementDragContainer.style.setProperty('top', this.moveRange.top + 'px')
      } else {
        this.elementDragContainer.style.setProperty('top', 0 + 'px')
      }
    }
  }
}
