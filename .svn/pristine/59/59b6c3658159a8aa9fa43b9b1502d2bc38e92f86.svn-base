<template>
  <div class="bs-progress-bar" @mousedown="md">
    <div class="bs-bar" :style="{width: innerWidth}"></div>
  </div>
</template>

<script>
export default {
  name: 'bs-progressbar',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      time: this.value,
      outWidth: 0,
      canMove: false,
      changed: false,
      start: 0
    }
  },
  computed: {
    scale() {
      return this.max / this.outWidth
    },
    innerWidth() {
      return this.time / this.scale + 'px'
    }
  },
  watch: {
    value(newValue) {
      this.time = newValue
      this.$emit('on-input', newValue)
      this.changed = true
    }
  },
  methods: {
    setTime(clientX) {
      let x = clientX - this.start
      x = x < 0 ? 0 : (x > this.outWidth ? this.outWidth : x)
      this.time = x * this.scale
      this.$emit('input', this.time)
      this.$emit('on-input', this.time)
    },
    md({ clientX }) {
      if (!this.disabled) {
        this.setTime(clientX)
        this.canMove = true
      }
    },
    mm({ clientX }) {
      if (!this.canMove) { return }
      this.setTime(clientX)
    },
    mu() {
      this.canMove = false
      this.$emit('mouseup', this.time)
      if (this.changed) {
        this.$emit('on-change', this.time)
        this.changed = false
      }
    }
  },
  mounted() {
    window.onresize = () => {
      this.outWidth = this.$el.offsetWidth
      this.start = this.$el.getBoundingClientRect().left
    }
    window.onresize()
    document.onmousemove = this.mm
    document.onmouseup = this.mu
  },
  beforeDestroy() {
    window.onresize = null
    document.onmousemove = null
    document.onmouseup = null
  }
}
</script>

<style lang="less" scoped>
.bs-progress-bar {
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  .bs-bar {
    height: 100%;
    border-radius: 10px;
  }
}
</style>
