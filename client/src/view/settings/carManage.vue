<template>
  <div id="carManage" class="bs-content">
    <div class="bs-left">
      <div class="control-box">
        <div class='sidebar'>
          <a @click="orgClick">机构资源</a>
        </div>
        <div class="tree-org">
          <carTree @orgActive="orgActive"></carTree>
        </div>
      </div>
      <div class="sidebar">
        <Menu theme="dark" width="100%" @on-select="isNowPathActive" :active-name="route">
          <Menu-group title="智能交通参数配置">
            <Menu-item name="/settings/vehicle/server" style="text-align:left;">
              智能分析服务器管理
            </Menu-item>
          </Menu-group>
        </Menu>
      </div>
    </div>
    <router-view ref="firstRow"></router-view>
  </div>
</template>
<script>
import carTree from './carPage/carTree'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    carTree
  },
  data() {
    return {
      route: ''
    }
  },
  computed: {
    ...mapState({
      crossingList: state => state.vehicle.crossingList
    })
  },
  methods: {
    ...mapMutations(['LANE_CLEAR']),
    ...mapActions(['getCrossList', 'getResourceList', 'getLaneList']),
    orgClick() {
      if (this.$route.path !== '/settings/vehicle/org') {
        this.$router.replace('/settings/vehicle/org')
      }
      this.route = ''
    },
    isNowPathActive(name) {
      this.$router.replace(name)
      this.route = name
    },
    // 机构树点击
    orgActive() {
      if (this.$route.path !== '/settings/vehicle/org') {
        this.$router.replace('/settings/vehicle/org')
      }
      this.route = ''
      this.getResourceList({ page: 1 })
      this.getCrossList(1).then(() => {
        if (this.crossingList.list[0]) {
          this.getLaneList({ page: 1, list: this.crossingList.list[0]._id })
          this.$refs['firstRow'].rowClassName = function(row, index) {
            if (index === 0) {
              return 'ivu-table-row-highlight'
            }
            return ''
          }
        } else {
          this.LANE_CLEAR()
        }
      })
    }
  },
  created() {
    this.route = this.$route.path
  }
}
</script>
<style lang="less" scoped>
#carManage {
  padding: 16px 0;

  .sidebar {
    height: auto;

    a {
      display: block;
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      background-color: #0f2243;
    }
  }

  .tree-org {
    min-height: 500px;
    padding-top: 10px;
  }
}
</style>
