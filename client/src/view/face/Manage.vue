<template>
  <div class="layout-content bs-content">
    <div class="bs-left">
      <Menu theme="dark" :active-name="setActive" width="auto" @on-select="openPage">
        <Menu-group title="人员管理">
          <Menu-item name="/face/manage/list">
            黑白名单
          </Menu-item>
        </Menu-group>
      </Menu>
    </div>
    <div class="bs-main">
        <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FaceSearch',
  data() {
    return {}
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
