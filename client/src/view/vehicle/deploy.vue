<template>
  <div id="deploy" class="vehicle">
    <div class="bs-content">
      <div class="bs-left">
        <Menu theme="dark" :active-name="activeTab" @on-select="seletRoute" width="100%">
          <Menu-group title="布控管理">
            <Menu-item name="/vehicle/deploy/exact" v-if="accurateControl">精准布控</Menu-item>
            <Menu-item name="/vehicle/deploy/black" v-if="blacklistControl">黑名单布控</Menu-item>
          </Menu-group>
        </Menu>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      // 权限
      accurateControl: true,
      blacklistControl: true
    }
  },
  computed: {
    ...mapGetters(['vehicleRecognizerole']),
    activeTab() {
      return this.$route.path
    }
  },
  methods: {
    ...mapActions(['getVideoOrg', 'getDirection', 'getBrand', 'getCarType', 'getCarColor']),
    seletRoute(name) {
      // console.log(name)
      // this.$route.path = name
      this.$router.replace({ path: name })
    }
  },
  created() {
    this.getVideoOrg()
    this.getDirection()
    this.getBrand()
    this.getCarType()
    this.getCarColor()
    // this.accurateControl = this.vehicleRecognizerole.executeControlManager && this.vehicleRecognizerole.executeControlManager.accurateControl
    // this.blacklistControl = this.vehicleRecognizerole.executeControlManager && this.vehicleRecognizerole.executeControlManager.blacklistControl
  }
}
</script >
<style lang="less" scoped>
.ivu-upload-drag {
  border: 0px !important;
}

.ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  color: #fff !important;
}
</style>
