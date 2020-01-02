<template>
  <div class="layout-content bs-content">
    <div class="bs-left" v-show="leftStatus">
      <Menu theme="dark" :active-name="route" width="auto" @on-select="openPage">
        <Menu-item name="/veriface/PasserSearch/condition">
          条件检索
        </Menu-item>
        <Menu-item name="/veriface/PasserSearch/searchpic">
          以图搜图
        </Menu-item>
      </Menu>
    </div>
    <div class="bs-left icon">
      <span class="left-icon" :style="{right: leftStatus? '-16px': '-32px'}" @click="leftStatus = !leftStatus">
        <i :class="['ivu-icon', leftStatus?'ivu-icon-ios-arrow-left': 'ivu-icon-ios-arrow-right']"></i>
      </span>
    </div>
    <div class="bs-main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'passerSearch',
  data() {
    return {
      leftStatus: true
    }
  },
  computed: {
    ...mapState({
      imageToSearch: state => state.veriface.imageToSearch
    })
  },
  watch: {
    imageToSearch() {
      if (this.imageToSearch) { // 跳转后直接搜图时更改active-name
        this.route = '/veriface/PasserSearch/searchpic'
      }
    }
  },
  methods: {
    openPage(e) {
      this.$router.replace(e)
      this.route = e
    }
  },
  created() {
    this.route = this.$route.path
  },
  activated() {
    this.$router.replace(this.route)
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.bs-left {
  position: relative;
  overflow: initial;
}
.bs-left.icon {
  flex: 0;
  margin-right: 0;
}
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
.left-icon {
  height: 85px;
  width: 16px;
  cursor: pointer;
  z-index: 1000;
  position: absolute;
  display: block;
  top: 40%;
  border: 16px solid transparent;
  border-left: 16px solid #0f2343;
  color: #fff;
  line-height: 53px;
  font-size: 20px;
}
.left-icon i{
  margin-left: -11px
}
</style>
