<template>
  <div class="bs-video">
    <div class="bs-video-single" v-for="index in count" :key="index - 1" :style="_styles[index - 1]" :class="{'bs-out': isOut(index-1), 'bs-actived': index - 1 === activedIndex}" @click="clickActive(index - 1)">
      <div class="bs-video-single-container"></div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'bs-video',
  props: {
    count: {
      default: 1,
      type: Number
    },
    showNum: {
      default: 1,
      type: Number
    },
    styles: {
      default: null
    },
    COMprops: {
      default: () => {
        return []
      }
    },
    pluginCOM: {
      required: true
    },
    curPage: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      _styles: [],
      activedIndex: -1,
      COMVM: []
    }
  },
  watch: {
    showNum() {
      this.computeStyles()
      if (this.activedIndex > this.showNum - 1) {
        this.activedIndex = 0
      }
    },
    styles(s) {
      this._styles = s
    }
    // activedIndex: { // watch 的数值变成0 不触发
    //   handler(i) {
    //     console.log(i, this.COMVM[i].index, 'this.COMVM[i]this.COMVM[i]')
    //     this.$emit('update:activedVM', this.COMVM[i])
    //     this.$emit('singleClick', i)
    //   },
    //   deep: true
    // }
  },
  methods: {
    clickActive(index) {
      this.$emit('update:activedVM', this.COMVM[index])
      this.$emit('singleClick', index)
      this.activedIndex = index
    },
    mountCOM() {
      const divs = this.$el.querySelectorAll('.bs-video-single-container')
      const v = Vue.component(this.pluginCOM.name)
      for (let index = 0; index < this.count; index++) {
        const propsData = {
          index,
          ...this.COMprops[index]
        }
        const vm = new v({ propsData, parent: this })
        vm.$mount(divs[index])
        this.COMVM.push(vm)
      }
      this.activedIndex = 0
    },
    computeStyles() {
      if (this.styles) {
        this._styles = this.styles
      } else {
        this._styles = []
        const styles = []
        const sqrtNum = Math.sqrt(this.showNum)
        const per = (100 / sqrtNum).toFixed(2) + '%'
        const style = {
          width: per,
          height: per
        }
        let i = this.count
        while (i--) {
          styles.push({ ...style })
        }
        this._styles = styles
      }
    },
    isOut(index) {
      if (this.styles) {
        return false
      }
      const min = this.curPage * this.showNum
      let max = (this.curPage + 1) * this.showNum
      if (max > this.count) {
        max = this.count
      }
      return !(index >= min && index < max)
    },
    getCOM(index) {
      return this.COMVM[index]
    },
    activeFrame(index) {
      this.activedIndex = index
    }
  },
  created() {
    this.computeStyles()
    if (!this.pluginCOM.name) {
      throw new Error('pluginCOM组件对象必须有name属性')
    }
    Vue.component(this.pluginCOM.name, this.pluginCOM)
  },
  mounted() {
    this.mountCOM()
  },
  beforeDestroy() {
    this.COMVM.forEach(vm => vm.$destroy())
  }
}
</script>
<style>
.bs-video-single {
  display: inline-block;
  vertical-align: middle;
}
.bs-out {
  position: absolute;
  top: -99999px;
  width: 10px !important;
  height: 10px !important;
}
</style>
