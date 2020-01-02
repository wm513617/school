<template>
  <div id="carCount" class="vehicle">
    <div class="bs-content" @click="detailModal=false">
      <div class="bs-left">
        <Menu theme="dark" :active-name="activeTab" @on-select="seletRoute" width="100%">
          <Menu-group title="综合查询">
            <Menu-item name="/vehicle/query/pass">过车查询</Menu-item>
            <!--<Menu-item name="/vehicle/query/violation">违章查询</Menu-item>
            <Menu-item name="/vehicle/query/fakePlate">套牌查询</Menu-item>-->
          </Menu-group>
        </Menu>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {}
  },
  computed: {
    activeTab() {
      return this.$route.path
    }
  },
  methods: {
    seletRoute(name) {
      // console.log(name)
      // this.$route.path = name
      this.$router.replace({ path: name })
    }
  }
}
</script >
<style scoped>
#carCount {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.bs-main {
  flex-direction: column;
}

.car-handle {
  flex: 0 0 60px;
  padding: 10px 0px;
}

.car-handle button {
  margin-right: 20px;
}

.car-list {
  flex: 1;
}

.ivu-menu-item-active {
  background: #ececec;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.modal-footer button {
  width: 100px;
}

.modal-left {
  flex: 0 0 350px;
}

.modal-right {
  flex: 1;
  justify-content: center;
}

.ivu-icon-search {
  font-size: 30px;
  background: #fff;
  color: deepskyblue;
  cursor: pointer;
}

.time-rang {
  display: flex;
}

.time-rang span {
  width: 50px;
  text-align: center;
}
</style>
