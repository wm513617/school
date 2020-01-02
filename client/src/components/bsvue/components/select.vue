<template>
  <div class="bs-select">
    <div class="bs-slt-tog" :class="{open: isOpen}" @click="f">
      <input ref="input" type="text" @blur="close" @focus="open" /> {{getLabel(value)}}
      <i class="fa" :class="[isOpen ? 'fa-caret-up' : 'fa-caret-down']"></i>
    </div>
    <bs-cover v-model="isOpen" class="bs-slt-drp" :class="{hidden: !isOpen}">
      <bsscroll ref="scroller" v-if="hasScroll" :height="`${scrollNum * 30}px`" :option="scrollOptions" @mousedown.native="cancelClose">
        <ul>
          <li v-for="(item, i) in options" :key="i" :class="{selected: item.value === value}" class="bs-slt-item" @mousedown.stop="clickItem(item)">{{item.label}}</li>
        </ul>
      </bsscroll>
      <ul v-else>
        <li v-for="(item, i) in options" :key="i" :class="{selected: item.value === value}" class="bs-slt-item" @mousedown="clickItem(item)">{{item.label}}</li>
      </ul>
    </bs-cover>
  </div>
</template>
<script>
import bsscroll from './scroll/scrollForSelect.vue'
export default {
  name: 'bsr-select',
  components: { bsscroll },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      required: true
    },
    scrollNum: {
      type: Number,
      default: 4
    },
    scrollOptions: {
      default: null
    }
  },
  data() {
    return {
      isOpen: false,
      isFirst: true
    }
  },
  computed: {
    hasScroll() {
      return this.options.length > this.scrollNum
    }
  },
  watch: {
    isOpen(o) {
      if (o) {
        this.initScoll()
      }
    },
    options() {
      this.isFirst = true
    }
  },
  methods: {
    clickItem(item) {
      this.$emit('input', item.value)
      this.isOpen = false
    },
    getSelectedItem() {
      const res = this.options.filter(item => item.value === this.value)
      return res.length ? res[0] : {}
    },
    getSelectedIndex() {
      let index = -1
      this.options.forEach((item, i) => {
        if (item.value === this.value) {
          index = i
        }
      })
      return index
    },
    getLabel(value) {
      const i = this.getSelectedItem()
      return i.label === undefined ? '请选择' : i.label
    },
    open() {
      this.isOpen = true
    },
    close() {
      setTimeout(() => {
        if (this.prevent) {
          this.prevent = false
          this.focus()
        } else {
          this.isOpen = false
        }
      }, 100)
    },
    cancelClose() {
      this.prevent = true
    },
    focus() {
      this.$refs.input.focus()
    },
    f() {
      if (!this.isOpen) { this.focus() }
    },
    initScoll() {
      const i = this.getSelectedIndex()
      if (this.hasScroll) {
        this.$nextTick(() => {
          if (this.isFirst) {
            this.isFirst = false
            this.$refs.scroller.update()
          }
          if (i !== -1) {
            this.$refs.scroller.setScrollTop(i * 30)
          }
        })
      }
    }
  },
  mounted() {
    this.ff = this.focus.bind(this)
  },
  beforeDestroy() {
    document.removeEventListener('mouseup', this.ff)
    delete this.ff
  }
}
</script>
<style lang="less">
.bs-select {
  position: relative;
  .hidden {
    display: none;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    padding: 5px 12px;
    height: 30px;
    font-size: 12px;
    line-height: 20px;
    user-select: none;
    box-sizing: border-box;
    cursor: pointer;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &.selected {
      background: rgba(70, 153, 249, 0.9);
    }
    &:hover {
      background: #657ca8;
    }
  }
  .fa {
    position: absolute;
    right: 10px;
    font-size: 14px;
    color: #fff;
    top: 8px;
  }
  input {
    position: absolute;
    top: -9999px;
  }
}
.bs-slt-tog {
  border: 1px solid #5676a9;
  border-radius: 3px;
  font-size: 12px;
  padding: 5px 12px;
  color: #fff;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &.open,
  &:hover {
    border-color: #6badfa;
  }
}
.bs-slt-drp {
  border: 1px solid #6badfa;
  position: absolute;
  z-index: 9;
  border-radius: 3px;
  background: #1c3053;
  margin: 5px 0;
  width: 100%;
}
</style>
