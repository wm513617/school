<template>
  <scrollBar class="bs-scroll" :style="{height}" @move.stop="emitMove" :option="option" :wheelSpeed="wheelSpeed" ref="sb">
    <slot></slot>
  </scrollBar>
</template>
<script>
// 多写一层是由于updated触发问题
import scrollBar from './scrollBar.vue'
import { debounce } from 'lodash'

export default {
  name: 'bs-scroll',
  components: { scrollBar },
  props: {
    height: {
      default: '100%',
      type: String
    },
    option: {
      type: Object
    },
    wheelSpeed: {
      type: Number,
      default: 40
    }
  },
  methods: {
    updateScroll(t) {
      this.$refs.sb.updateScroll(t)
    },
    update() {
      this.$nextTick(() => {
        const t = this.getScrollTop()
        this.updateScroll()
        const conHeight = this.$el.offsetHeight
        if (this.$overview) {
          const viewHeight = this.$overview.offsetHeight
          if (viewHeight > conHeight) {
            this.setScrollTop(t)
          }
        }
      })
    },
    setScrollTop(t) {
      if (t < 0) {
        t = 0
      } else if (this.$overview) {
        const conHeight = this.$el.offsetHeight
        const viewHeight = this.$overview.offsetHeight
        if (t > viewHeight - conHeight) {
          t = viewHeight - conHeight
        }
      }
      this.updateScroll(t)
    },
    getScrollTop() {
      if (this.$overview) {
        const top = this.$overview.style.top || '0'
        return Math.abs(parseInt(top))
      } else {
        return 0
      }
    },
    emitMove() {
      if (this.emove) {
        this.emove()
      }
    },
    _emove() {
      this.$emit('on-scroll')
      const top = this.getScrollTop()
      if (top === 0) {
        this.$emit('scroll-top')
      } else if (this.$overview) {
        const conHeight = this.$el.offsetHeight
        const viewHeight = this.$overview.offsetHeight
        if (top + conHeight === viewHeight) {
          this.$emit('scroll-bottom')
        }
      }
    }
  },
  created() {
    this.emove = debounce(this._emove.bind(this), 200)
  },
  mounted() {
    this.update()
    this.$overview = this.$el.querySelector('.overview')
  },
  beforeDestroy() {
    delete this.emove
    delete this.$overview
  }
}
</script>
<style>
.scrollbar {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
</style>
