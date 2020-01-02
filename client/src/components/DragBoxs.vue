<template>
  <!-- 可兼容多个窗口时的拖拽 -->
  <div class="modal-container" @click="setIndex" :style="{zIndex: active?index + 1:index-1}">

    <div v-if="modal" class="modal-box">
      <iframe v-show="isIframe" class="iframe"></iframe>
      <div class="modal-box-title">
        <div class="detail">{{title}}</div>
        <div class="close iconfont icon-close1" @click="close"></div>
        <div class="scale iconfont icon-reduce" @click="changeContext" v-if="isShowZoom"></div>
      </div>
      <div class="modal-context-box" :style="boxPosition">
        <slot name="context"></slot>
        <slot name="footer"></slot>
      </div>
    </div>

    <slot v-else></slot>
  </div>
</template>
<script>
/**
 * boxSize 可拖拽区域大小,该大小相较于父元素而言
 * modal 是否加模态框
 * onlySlot 不使用组件模态框
 * title 标题
 * index 设置的z-index
 * active 是否为焦点窗口
 * position 窗口默认显示位置
 * $emit('setzIndex') 触发点击事件
 * $emit('close') 关闭窗口
 */
export default {
  data() {
    return {
      box: null,
      isMove: false,
      positionX: 0,
      positionY: 0,
      isShow: true,
      boxPosition: null
    }
  },
  props: {
    isShowZoom: {
      type: Boolean,
      default: true
    },
    isIframe: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    onlySlot: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '标题'
    },
    boxSize: {
      type: Object,
      default: () => {
        return {
          width: 0,
          height: 0
        }
      }
    },
    // 根据 active 和 index 来设置 z-index 值
    index: {
      type: [Number, String],
      default: 1
    },
    active: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => {
        return {
          left: 690,
          top: 80
        }
      }
    }
  },
  mounted() {
    if (this.position) {
      this.$el.style.left = this.position.left + 'px'
      this.$el.style.top = this.position.top + 'px'
    }
    if (this.onlySlot) {
      this.box = this.$el
      this.move()
    }
    if (this.modal) {
      this.titleMove()
    }
  },
  watch: {
    modal() {
      if (this.modal) {
        this.titleMove()
      } else {
        this.removeListener()
      }
    }
  },
  computed: {
    boxW() {
      if (this.boxSize.width && this.boxSize.height) {
        return this.boxSize.width
      } else {
        return window.innerWidth
      }
    },
    boxH() {
      if (this.boxSize.width && this.boxSize.height) {
        return this.boxSize.height
      } else {
        return window.innerHeight
      }
    }
  },
  methods: {
    setIndex() {
      this.$emit('setzIndex')
    },
    titleMove() {
      const timer = setTimeout(() => {
        this.box = this.$el.querySelector('.modal-box-title')
        this.move()
        clearInterval(timer)
      }, 1000)
    },
    move() {
      this.isMove = false
      if (this.box) {
        this.box.addEventListener('mousedown', this.handleMouseDown, true)
        document.addEventListener('mousemove', this.handleMouseMove, true)
        document.addEventListener('mouseup', this.handleMoveStatus, true)
      }
    },
    handleMouseDown(e) {
      this.isMove = true
      this.$emit('setzIndex')
      this.positionX = e.clientX - parseInt(this.$el.offsetLeft)
      this.positionY = e.clientY - parseInt(this.$el.offsetTop)
    },
    handleMouseMove(e) {
      if (this.isMove) {
        e = window.event || e
        const tarW = this.$el.offsetWidth || this.$el.scrollWidth
        const tarH = this.$el.offsetHeight || this.$el.scrollHeight
        let left = e.clientX - this.positionX
        let top = e.clientY - this.positionY
        if (left <= 0) {
          left = 0
        } else if (left >= this.boxW - tarW) {
          left = this.boxW - tarW
        }
        if (top <= 0) {
          top = 0
        } else if (top >= this.boxH - tarH) {
          top = this.boxH - tarH
        }
        this.$el.style.left = left + 'px'
        this.$el.style.top = top + 'px'
      }
    },
    handleMoveStatus() {
      this.isMove = false
    },
    close() {
      this.isShow = true
      this.$emit('close')
    },
    changeContext() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.boxPosition = null
      } else {
        this.boxPosition = {
          position: 'absolute',
          top: '-9999px',
          right: '-9999px',
          height: '0px'
        }
      }
    },
    removeListener() {
      if (this.box) {
        this.box.removeEventListener('mousedown', this.handleMouseDown)
        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('mouseup', this.handleMoveStatus)
      }
    }
  },
  beforeDestroy() {
    this.removeListener()
  }
}
</script>
<style scoped>
.modal-container {
  user-select: none;
  position: fixed;
}

.modal-container * {
  user-select: none;
}
.modal-box {
  color: #fff;
  font-size: 12px;
  background-color: #1c3053;
  border-radius: 5px;
}

.modal-box-title {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
  cursor: move;
}
.modal-box-title .detail {
  float: left;
  margin: 0 10px;
}

.modal-box-title .close {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}
.modal-box-title .scale {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}
.modal-context-box {
  padding: 15px;
}
.iframe {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 8px;
  z-index: -1;
}
</style>
