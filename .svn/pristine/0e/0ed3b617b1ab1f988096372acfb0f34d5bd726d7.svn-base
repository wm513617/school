<template>
  <div id="panel">
    <div class="top-line"
         @click="canClose&&(isOpen = !isOpen)">
      <div class="left">
        <i class="title">{{title}}</i>
        <i class="iconfont"
           :title="state? $t('video.config'): $t('video.invoke')"
           :style="{color: iconColor}"
           v-if="statee !== null"
           @click.stop="statee = !statee"
           :class="{'icon-peizhi':statee, 'icon-diaoyong': !statee}">
        </i>
      </div>

      <div class="right">
        <i class="iconfont"
           v-if="canClose"
           :class="{'icon-arrow-up':isOpen,'icon-arrow-down': !isOpen}">
        </i>
      </div>
    </div>
    <div class="content"
         v-if="isOpen">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iconColor: {
      default: '#20a0ff'
    },
    state: {
      default: null
    },
    canClose: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      statee: this.state,
      isOpen: this.value
    }
  },
  watch: {
    statee(newValue) {
      this.$emit('stateChanged', newValue)
    },
    isOpen(newValue) {
      this.$emit('input', newValue)
    },
    value(newValue) {
      this.isOpen = newValue
    }
  }

}
</script>

<style scoped>
#panel:hover>.top-line>.left>.title {
  color: #fc6e30;
}

#panel .top-line {
  cursor: pointer;
  height: 40px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  user-select: none;
}

#panel .top-line .left {
  float: left;
  height: 40px;
  margin-left: 20px;
}

#panel .top-line .right {
  float: right;
  height: 40px;
  margin-right: 20px;
}

#panel .top-line i {
  cursor: pointer;
  float: left;
  font-style: normal;
  line-height: 40px;
  margin-right: 10px;
}
</style>
