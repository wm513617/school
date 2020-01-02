<template>
  <div class="warn">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    activeTab() {
      return this.$route.path
    }
  },
  methods: {
    seletRoute(name) {
      this.$router.replace({ path: name })
    }
  }
}
</script>
<style scoped>
.warn {
  width: 100%;
  min-width: 1280px;
  /*background: #1e2225;*/
}

.top {
  width: 100%;
  height: 60px;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item:hover,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu-active,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu:hover {
  height: 30px !important;
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item,
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
  height: 30px !important;
}
</style>
