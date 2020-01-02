<template>
  <div>
    <BStabs active-ref='2' @on-click="tabIndex">
      <BStabPane ref='1' label='123'>123 Hello word</BStabPane>
      <BStabPane ref='2' label='456'>456 Hello word</BStabPane>
      <BStabPane ref='3' label='789'>789 Hello word</BStabPane>
    </BStabs>
  </div>
</template>
<script>
import BStabs from './BStabs'
import BStabPane from './BStabPane'
export default {
  components: {
    BStabs, BStabPane
  },
  data() {
    return {
      nowTabIndex: ''
    }
  },
  methods: {
    tabIndex(item) {
      // item ==> {key: item.key, index: item.index}
      this.nowTabIndex = item.index // 当前所在tab页的index
    }
  }
}
</script>
