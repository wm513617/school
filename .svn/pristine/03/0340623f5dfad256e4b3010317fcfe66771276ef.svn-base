<template>
  <div class="car-menu">
    <Menu mode="horizontal" v-on:on-select="changeRouter" :active-name="currentRoute">
      <Menu-item name="/vehicle/detection">
        实时过车
      </Menu-item>
      <Menu-item name="/vehicle/deploy">
        布控管理
      </Menu-item>
      <Menu-item name="/vehicle/manage">
        车辆管理
      </Menu-item>
      <Menu-item name="/vehicle/analyze">
        智能研判
      </Menu-item>
      <Menu-item name="/vehicle/stat">
        数据统计
      </Menu-item>
      <Menu-item name="/vehicle/query">综合查询</Menu-item>
    </Menu>
  </div>
</template>
<script>
export default {
  name: 'BScarMenu',
  data() {
    return {
      currentRoute: ''
    }
  },
  created() {
    if (this.$router.currentRoute.path.indexOf('/vehicle/deploy') !== -1) {
      this.currentRoute = '/vehicle/deploy'
    } else
    if (this.$router.currentRoute.path.indexOf('/vehicle/stat') !== -1) {
      this.currentRoute = '/vehicle/stat'
    } else if (this.$router.currentRoute.path.indexOf('/vehicle/query') !== -1) {
      this.currentRoute = '/vehicle/query'
    } else {
      this.currentRoute = this.$router.currentRoute.path
    }
  },
  methods: {
    changeRouter(val) {
      this.$router.replace(val)
    }
  }
}
</script>
<style lang="less" scoped>
.car-menu {
  flex: 0 0 40px;
  padding-bottom: 10px;
  ul {
    height: 40px;
    line-height: 40px;
  }
}
</style>
