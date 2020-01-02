<template>
  <div class="TabPane"
       v-show="show">
    <slot></slot>
  </div>
</template>
<script>
import UUID from '../../assets/common/UUID'
export default {
  name: 'BStabPane',
  props: {
    prefixCls: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '自定义'
    },
    id: {
      type: String,
      default() {
        return UUID()
      }
    },
    icon: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    closable: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    updateNav() {
      this.$parent.updateNav()
    }
  },
  watch: {
    label() {
      this.updateNav()
    },
    icon() {
      this.updateNav()
    },
    disabled() {
      this.updateNav()
    }
  },
  ready() {
    this.updateNav()
  }
}
</script>

<style scoped>

</style>
