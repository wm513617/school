<template>
  <div style="position: relative">
    <div class="bs-crumb" v-for="(crumb, index) in crumbs" :key="crumb.id">
      <div class="bs-crumb-item" @click="emitValue(crumb)">{{crumb[textName]}}</div>
      <div class="bs-crumb-sep" :class="[isShowSelect&&showIndex === index? 'actived': '']" v-if="crumbs[index][childName]" @click="e => selectOther(index, e)">
        <i class="fa" :class="[isShowSelect&&showIndex === index ? 'fa-angle-down' : 'fa-angle-right']"></i>
      </div>

    </div>
    <div class="bs-crumb-select" :style="{left: `${selectLeft-10}px`}" v-show="isShowSelect">
      <input id="hiddenInput" type="text" @blur="blurEvent" />
      <ul style="list-style:none;margin: 0;padding: 0;">
        <li class="bs-crumb-select-item" v-for="item in list" :key="item.id" @click="emitValue(item)">{{item[textName]}}</li>
      </ul>
    </div>
  </div>
</template>
<script>

export default {
  name: 'bs-crumb',
  props: {
    data: {
      required: true
    },
    value: {
      required: true
    },
    childName: {
      default: 'child'
    },
    textName: {
      default: 'text'
    }
  },
  data() {
    return {
      isShowSelect: false,
      showIndex: -1,
      selectLeft: 0,
      list: [],
      timer: -1
    }
  },
  computed: {
    crumbs() {
      const crumbs = []
      filterCrumbs(this.data[0], crumbs, this.value, this.childName)
      return crumbs
    }
  },
  methods: {
    emitValue(v) {
      this.$emit('input', v.id)
      this.$emit('update:node', v)
      this.hideSelect()
    },
    selectOther(index, event) {
      this.selectLeft = event.target.offsetLeft
      if (index === this.showIndex) {
        this.hideSelect()
      } else {
        this.showSelect(index)
      }
    },
    showSelect(index) {
      this.showIndex = index
      this.list = this.crumbs[index][this.childName] || []
      this.stopBlurEvent()
      this.$nextTick(() => {
        this.isShowSelect = true
        this.focus()
      })
    },
    hideSelect() {
      this.showIndex = -1
      this.isShowSelect = false
    },
    focus() {
      this.$nextTick(() => {
        const input = this.$el.querySelector('#hiddenInput')
        if (input !== null) {
          input.focus()
        }
      })
    },
    blurEvent() {
      this.timer = setTimeout(() => {
        this.hideSelect()
      }, 200)
    },
    stopBlurEvent() {
      clearTimeout(this.timer)
    }
  }
}

function filterCrumbs(data, resultList, id, childName) {
  if (!data) {
    return false
  }
  let isMatch = false
  resultList.push(data)
  if (data.id === id) {
    isMatch = true
  } else if (data[childName]) {
    try {
      data[childName].forEach((ch) => {
        isMatch = filterCrumbs(ch, resultList, id, childName)
        if (isMatch) {
          throw new Error('break forEach')
        }
      })
    } catch (e) { }
  }
  if (!isMatch) {
    // 没有匹配上 这次弹出
    resultList.pop()
  }
  return isMatch
}

</script>
<style>
.bs-crumb,
.bs-crumb-item,
.bs-crumb-sep {
  display: inline-block;
  cursor: pointer;
}
#hiddenInput {
  position: absolute;
  top: -9999px;
}
.bs-crumb-select {
  position: absolute;
  overflow-y: auto;
}
.bs-crumb-select-item {
  cursor: pointer;
}
</style>
