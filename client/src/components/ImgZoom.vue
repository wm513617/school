/**
  支持拖拽  鼠标中心点放大缩小，默认显示自动居中
  只需要 传入 imgSrc  图片路径即可，
  width height 设置可视区域范围
*/
<template>
 <div class='img-zoom' :style="{
      'width': parentWidth,
      'height': parentHeight,
    }">
    <div class='img-box' ref='imgBox' @wheel.stop="scrollFunc"
    @mousedown.stop="mousedown"
    @mouseup.stop="mouseup"
    @mousemove.stop="mousemove"
    @mouseout.stop="mouseout"
    :style="{
      'width': imgBoxWidth,
      'height': imgBoxHeight,
        'left': offsetX + 'px',
        'top': offsetY + 'px',
      }">
      <img :src='imgSrc' class='img-self' ref='imgSelf' alt='没有图片'>
    </div>
 </div>
</template>

<script>
export default {
  data() {
    return {
      imgBox: null,
      multiple: 1,
      offsetX: 0,
      offsetY: 0,
      isDrag: false,
      mousedownXY: {
        x: 0,
        y: 0
      },
      imgAttribute: {
        width: 0,
        height: 0
      }
    }
  },
  props: {
    width: {
      type: [Number, String],
      default: 800
    },
    height: {
      type: [Number, String],
      default: 500
    },
    imgSrc: {
      type: String,
      default:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544164010795&di=ba31a02eb895a160400e9129fa1fb5b4&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F018c295788ab400000012e7eefd64a.jpg'
    }
  },
  computed: {
    parentWidth() {
      if (typeof this.width === 'number') {
        return this.width + 'px'
      } else {
        return this.width
      }
    },
    parentHeight() {
      if (typeof this.height === 'number') {
        return this.height + 'px'
      } else {
        return this.height
      }
    },
    imgBoxWidth() {
      return this.imgAttribute.width * this.multiple + 'px'
    },
    imgBoxHeight() {
      return this.imgAttribute.height * this.multiple + 'px'
    }
  },
  watch: {},
  methods: {
    scrollFunc(e) {
      // 监听滚轮事件
      e = e || window.event
      e.preventDefault()
      if (e.deltaY) {
        if (e.deltaY > 0) {
          // 当滑轮向下滚动时
          this.offsetX += e.offsetX * 0.1
          this.offsetY += e.offsetY * 0.1
          this.multiple *= 0.9
        }
        if (e.deltaY < 0) {
          // 当滑轮向上滚动时
          this.offsetX += -e.offsetX * 0.1
          this.offsetY += -e.offsetY * 0.1
          this.multiple *= 1.1
        }
      }
    },
    mousedown(e) {
      e.preventDefault()
      this.isDrag = true
      this.mousedownXY = {
        x: e.clientX,
        y: e.clientY
      }
    },
    mouseup(e) {
      e.preventDefault()
      this.isDrag = false
    },
    mousemove(e) {
      e.preventDefault()
      if (!this.isDrag) {
        return
      }
      this.offsetX -= this.mousedownXY.x - e.clientX
      this.offsetY -= this.mousedownXY.y - e.clientY
      this.mousedownXY = {
        x: e.clientX,
        y: e.clientY
      }
    },
    mouseout(e) {
      e.preventDefault()
      this.isDrag = false
    }
  },
  created() {},
  mounted() {
    this.imgBox = this.$refs.imgBox
    this.$nextTick(() => {
      // 创建对象
      let img = new Image()
      // 改变图片的src
      img.src = this.imgSrc
      img.onload = () => {
        this.imgAttribute = {
          width: img.width,
          height: img.height
        }
        if (this.width > this.imgAttribute.width && this.height > this.imgAttribute) {
          this.multiple = 1
        } else if (this.imgAttribute.width / this.imgAttribute.height <= this.width / this.height) {
          this.multiple = this.height / this.imgAttribute.height > 1 ? 1 : this.height / this.imgAttribute.height
        } else if (this.imgAttribute.width / this.imgAttribute.height > this.width / this.height) {
          this.multiple = this.width / this.imgAttribute.width > 1 ? 1 : this.width / this.imgAttribute.width
        }
        this.$nextTick(() => {
          this.offsetX = (this.width - this.imgAttribute.width * this.multiple) / 2
          this.offsetY = (this.height - this.imgAttribute.height * this.multiple) / 2
        })
      }
    })
  },
  beforeDestroy() {}
}
</script>

<style scoped>
.img-zoom {
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}
.img-box {
  position: absolute;
}
.img-self {
  width: 100%;
}
</style>
