<template>
  <div class="layout-content bs-content">
    <div class="bs-left">
      <Menu theme="dark" :active-name="setActive" width="auto" @on-select="openPage">
        <Menu-group title="历史检索">
          <Menu-item name="/pass/search/compare">
            对比记录检索
          </Menu-item>
          <Menu-item name="/pass/search/stranger">
            陌生人检索
          </Menu-item>
        </Menu-group>
      </Menu>
    </div>
    <div class="bs-main">
      <div class="layout-content-main">
        <transition mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'passSearch',
  data() {
    return {
    }
  },
  computed: {
    setActive() {
      return this.$route.path
    }
  },
  methods: {
    openPage(e) {
      this.$router.replace(e)
    }
  }
}
</script>
<style scoped>
  .layout-content {
    min-height: 100%;
    width: 100%;
    padding: 16px 0;
  }
  .layout-content-main {
    flex: 1;
    margin-bottom: 2px;
    background: #1c3054;
  }
</style>
