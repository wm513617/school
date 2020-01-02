<template>
  <div id="duty-manage">
    <div class="left-menu">
      <Menu theme="dark" :active-name="activeName" @on-select="handleRouter" width="auto">
        <MenuGroup title="">
          <MenuItem name='DutyList'>值班列表</MenuItem>
          <!-- <MenuItem name='DutyLog'>值班日志</MenuItem> -->
          <!-- <MenuItem name='ShiftLog'>交接班日志</MenuItem> -->
          <MenuItem name='DutyPlan'>排班计划</MenuItem>
          <MenuItem name='DutyTemplate'>排班模板</MenuItem>
          <MenuItem name='DutyPersonnel'>人员列表</MenuItem>
          <MenuItem name='DutyTime'>值班时长</MenuItem>
          <MenuItem name='DutyNotice'>值班公告</MenuItem>
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
  name: 'DutyManage',
  data() {
    return {
      activeName: ''
    }
  },
  watch: {
    $route(val) {
      switch (val.name) {
        case 'DutyList':
          this.activeName = 'DutyList'
          break
        case 'DutyLog':
          this.activeName = 'DutyLog'
          break
        case 'ShiftLog':
          this.activeName = 'ShiftLog'
          break
        case 'DutyPlan':
          this.activeName = 'DutyPlan'
          break
        case 'DutyTemplate':
          this.activeName = 'DutyTemplate'
          break
        case 'DutyPersonnel':
          this.activeName = 'DutyPersonnel'
          break
        case 'DutyTime':
          this.activeName = 'DutyTime'
          break
        case 'DutyNotice':
          this.activeName = 'DutyNotice'
          break
        default:
          break
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    const routerName = to.name
    // 当页面刷新时修改侧边栏选中项
    next(vm => {
      switch (routerName) {
        case 'DutyList':
          vm.activeName = 'DutyList'
          break
        case 'DutyLog':
          vm.activeName = 'DutyLog'
          break
        case 'ShiftLog':
          vm.activeName = 'ShiftLog'
          break
        case 'DutyPlan':
          vm.activeName = 'DutyPlan'
          break
        case 'DutyTemplate':
          vm.activeName = 'DutyTemplate'
          break
        case 'DutyPersonnel':
          vm.activeName = 'DutyPersonnel'
          break
        case 'DutyTime':
          vm.activeName = 'DutyTime'
          break
        case 'DutyNotice':
          vm.activeName = 'DutyNotice'
          break
        default:
          break
      }
    })
  },
  methods: {
    handleRouter(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang="less" scoped>
#duty-manage {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 16px 0;
  .left-menu {
    background-color: #1b3153;
    width: 272px;
  }
  .right-content {
    margin-left: 16px;
    flex-grow: 1;
  }
}
</style>
