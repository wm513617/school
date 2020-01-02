<template>
  <!-- 用户管理 最外层 -->
  <div class="bs-user userManage">
    <Tabs class="bs-tabs" @on-click="changeTabs" :value="activeTab">
      <Tab-pane label="用户管理" name="/settings/user/custom" v-if="customPower">
      </Tab-pane>
      <Tab-pane label="角色管理" name="/settings/user/role" v-if="rolePower"></Tab-pane>
      <!-- 提测时注释掉 权限分配， 只对开发开放 -->
      <!-- <Tab-pane label="权限分配" name="/settings/user/powerdist"></Tab-pane> -->
      <Tab-pane label="安全策略" name="/settings/user/safe" v-if="safePower"></Tab-pane>
    </Tabs>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  created() {
    if (this.customPower) {
      return this.$router.replace({ path: '/settings/user/custom' })
    }
    if (this.rolePower) {
      return this.$router.replace({ path: '/settings/user/role' })
    }
    if (this.safePower) {
      return this.$router.replace({ path: '/settings/user/safe' })
    }
  },
  computed: {
    activeTab() {
      return this.$route.path
    },
    customPower() {
      return this.$BShasPower('BS-SETTING-USER-CUSTOM') || this.$BShasPower('BS-SETTING-USER-CUSTOM-PAGE')
    },
    rolePower() {
      return this.$BShasPower('BS-SETTING-USER-ROLE') || this.$BShasPower('BS-SETTING-USER-ROLE-PAGE')
    },
    safePower() {
      return this.$BShasPower('BS-SETTING-USER-SAFE')
    }
  },
  methods: {
    /**
     * Tab标签切换
     * @method changeTabs
     * @param {String} name 路径
     */
    changeTabs(name) {
      this.$router.replace({ path: name })
    }
  }
}
</script>
<style lang="less" scoped>
.bs-user {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-bottom: 16px;
  .bs-tabs {
    flex: 0 0 40px;
    margin-bottom: 16px;
  }
}
</style>
