<template>
  <Modal v-if="des" v-model="value1" :title="title" :width="width" :mask-closable="maskClosable" :closable="closable" :transfer="transfer" :transition-names="['1', '2']">
    <bs-cover v-model="value1">
      <slot></slot>
    </bs-cover>
    <div slot="footer" style="position:relative; z-index: 99">
      <Button type="ghost" @click="$emit('on-cancel')">取消</Button>
      <Button type="primary" @click="$emit('on-ok')">确定</Button>
    </div>
  </Modal>
</template>
<script>
export default {
  name: 'bs-modal',
  props: [
    'value', 'title', 'width', 'maskClosable', 'closable', 'transfer'
  ],
  data() {
    return {
      des: false
    }
  },
  computed: {
    value1: {
      get() {
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  watch: {
    value: {
      handler(v) {
        if (v) {
          this.des = true
        }
      },
      immediate: true
    }
  }
}
</script>
<style>
.ivu-modal-close {
  z-index: 999;
}
</style>
