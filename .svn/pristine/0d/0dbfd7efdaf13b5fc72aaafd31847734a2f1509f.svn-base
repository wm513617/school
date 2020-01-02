<template>
  <div id="log-manage">
    <div class="left-menu">
      <Menu theme="dark" :active-name="activeName" @on-select="handleRouter" width="auto">
        <MenuGroup title="">
          <MenuItem name='shiftingDuty'>交接班记录</MenuItem>
          <MenuItem name='videoCopy'>录像拷贝记录</MenuItem>
        </MenuGroup>
      </Menu>
    </div>
    <div class="right-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'logManage',
  data() {
    return {
      activeName: 'shiftingDuty'
    }
  },
  created() {
    this.activeName = this.$route.name
  },
  methods: {
    handleRouter(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="less" scoped>
#log-manage {
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 828px;
  padding: 16px 0;
  .left-menu {
    background-color: #1b3153;
    width: 272px;
  }
  .right-content {
    margin-left: 16px;
    flex-grow: 1;
    background:  #1b3153;
  }
}
</style>
