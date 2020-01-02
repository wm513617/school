<template>
    <div class="mapEditParam" style="flex:1;display:flex;">
      <div class="bs-content">
        <div class="bs-left">
          <Menu theme="dark" @on-select="seletRoute" :active-name="activeTab" width="100%">
            <Menu-group title="系统配置">
              <Menu-item name="/mapEdit/param/TwoImensional">2/3D配置</Menu-item>
              <Menu-item name="/mapEdit/param/TwoMapIcon">二维地图图标库</Menu-item>
              <Menu-item name="/mapEdit/param/threeMapMode">三维地图模型库</Menu-item>
              <Menu-item name="/mapEdit/param/callCenterConfig">110呼叫中心配置</Menu-item>
            </Menu-group>
          </Menu>
        </div>
        <div class="bs-main">
          <router-view></router-view>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  beforeCreate() {
    this.$router.replace({ path: '/mapEdit/param/TwoImensional' })
  },
  computed: {
    activeTab() {
      return this.$route.path
    }
  },
  methods: {
    seletRoute(name) {
      // this.$route.path = name
      this.$router.replace({ path: name })
    }
  }
}
</script>

<style scoped>
  .ivu-menu-vertical .ivu-menu-item-group-title {
    padding-left: 10px !important;
    background-color: #ddd !important;
    color: #fff !important;
  }

  .ivu-menu-light {
    width: 298px !important;
  }

  /*.system {
    width: 100%;
    height: 100%;
    padding-top: 10px;
  }*/

  .content {
    height: 100%;
    display: -ms-flexbox;
    display: flex;
    -ms-flex: 1;
    flex: 1;
    padding: 0 10px;
  }

  .left {
    height: 100%;
    -ms-flex: 0 0 300px;
    flex: 0 0 300px;
    background: #171717;
  }

  .main {
    width: 100%;
    padding: 0 20px;
  }
  .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
    box-shadow: none;
    border-bottom: 1px solid rgba(58, 90, 139, 0.4);
  }
</style>
