<template>
  <div class="bs-content" style="overflow:hidden">
    <div class="bs-left">
      <div style='width: 100%;'>
        <div class='doorTitle'>交通管理
          <i v-if="$BShasPower('BS-SETTING-TRAFFIC-ORG')" class="iconfont icon-refresh refresh" style="float:right;font-size: 22px;margin-right:15px;" title="同步" @click='synchronize'></i>
        </div>
        <div style="width:100%;padding:10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
        </div>
        <div class="tree-org">
          <bs-scroll ref="moveScroller">
            <v-tree ref='tree' :treeData="serverTree" :activeId="activeId" :options="options" @node-click="clickNode" :searchVal="searchVal" @on-expand="$refs.moveScroller.update()"></v-tree>
          </bs-scroll>
        </div>
      </div>
      <div style='width: 100%;'>
        <Menu ref="menu" theme="dark" width="100%" @on-select="isNowPathActive" :active-name="route">
          <Menu-group title="系统参数配置">
            <Menu-item name='/settings/traffic/trafficServer'>服务器配置</Menu-item>
            <Menu-item name='/settings/traffic/trafficHighSet'>高级参数配置</Menu-item>
          </Menu-group>
        </Menu>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      treeData: [],
      serverId: '', // 智能交通服务器文档id
      activeId: '', // 部门id
      route: '',
      searchVal: '',
      options: {
        moreRoot: true
        // showSearch: false
      },
      departmentId: ''
    }
  },
  props: {},
  computed: {
    ...mapState({
      serverTree: ({ traffic }) => traffic.serverTree
    })
  },
  created() {
  },
  watch: {},
  methods: {
    ...mapMutations(['SID_DEPTID', 'SET_SERVER_TREE']),
    ...mapActions(['getTrafficSerList', 'syncTrafficServer', 'getTrafficSerLane']),
    // 点击树
    clickNode(node) {
      if (this.$route.path !== '/settings/traffic/trafficDevice') {
        this.$router.replace('/settings/traffic/trafficDevice')
        return this.getTrafficSerList({ struct: 'tree' }).then(suc => {
          this.treeData = JSON.parse(JSON.stringify(suc.data))
          if (this.treeData[0]) {
            this.serverId = this.treeData[0].type ? this.treeData[0].type : this.treeData[0].sid
            this.activeId = this.treeData[0]._id
            this.departmentId = this.treeData[0].id ? this.treeData[0].id : this.treeData[0]._id
            this.SID_DEPTID({ serverId: this.serverId, departmentId: this.departmentId, devType: node.type })
          }
        }).catch(err => {
          console.log('getTrafficSerList tree ' + err)
        })
      }
      this.route = ''
      this.serverId = node.type ? node.type : node.sid
      this.activeId = node._id // 部门id
      this.departmentId = node.id ? node.id : node._id
      console.log('nodenode', this.serverId)
      this.SID_DEPTID({ serverId: this.serverId, departmentId: this.departmentId, devType: node.type })
    },
    // 同步
    synchronize() {
      if (this.serverId) {
        this.syncTrafficServer(this.serverId).then(suc => {
          // this.treeData = []
          if (suc.data.length) {
            let type
            this.treeData.forEach((item) => {
              if (item.type === suc.data[0].type) {
                this.activeId = item.type
                this.departmentId = item.id ? item.id : item.type
                type = item.type
                if (suc.data[0].children && suc.data[0].children.length) {
                  item.children = []
                  item.children = JSON.parse(JSON.stringify(suc.data[0].children))
                } else {
                  item.children = []
                }
              }
            })
            this.SET_SERVER_TREE(JSON.parse(JSON.stringify(this.treeData)))
            this.SID_DEPTID({ serverId: this.serverId, departmentId: this.departmentId, devType: type })
            this.successMsg('同步成功!')
          }
        }).catch(err => {
          this.errorMsg('同步失败!')
          console.log('syncTrafficServer tree ' + err)
        })
      }
    },
    // 点击服务器配置
    isNowPathActive(name) {
      this.$router.replace(name)
      this.route = name
    }
  },
  mounted() {
    this.route = this.$route.path
    this.getTrafficSerList({ struct: 'tree' }).then(suc => {
      this.treeData = JSON.parse(JSON.stringify(suc.data))
      if (this.treeData[0]) {
        this.serverId = this.treeData[0].type ? this.treeData[0].type : this.treeData[0].sid
        this.activeId = this.treeData[0]._id
        this.departmentId = this.treeData[0].id ? this.treeData[0].id : this.treeData[0]._id
        this.SID_DEPTID({ serverId: this.serverId, departmentId: this.departmentId, devType: this.treeData[0].type })
        console.log('获取树数据', this.serverId)
      }
    }).catch(err => {
      console.log('getTrafficSerList tree ' + err)
    })
  }
}
</script>
<style scoped>
.doorTitle {
  width: 100%;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  background-color: #0f2243;
}
.active {
  background-color: #2f497a;
}
.refresh:hover {
  cursor: pointer;
}
/* .bottomPart {
  width: 100%;
} */
.jiexian {
  position: absolute;
  width: 90%;
  height: 0;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  left: 50%;
  margin-left: -45%;
}
.tree-org {
  height: 500px;
  overflow: auto;
}
@media (max-width: 1600px) {
  .tree-org {
    height: 400px;
  }
}
</style>
