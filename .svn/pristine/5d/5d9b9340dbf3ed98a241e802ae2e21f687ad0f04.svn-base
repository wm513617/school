<template>
  <div class="bs-content" style="overflow:hidden">
    <div class="bs-left">
      <div class="sidebar">
        <a @click="orgClick">选择机构</a>
        <div class="tree-org">
          <bs-scroll ref="moveScroller">
            <v-tree ref='tree' :treeData="treeData" :activeId="activeId" :options="options" @node-click="getChildNode" @on-expand="$refs.moveScroller.update()"></v-tree>
          </bs-scroll>
        </div>
      </div>
      <div class="sidebar">
        <Menu :theme="'dark'" :width="menuWidth" @on-select="isNowPathActive" :active-name="route">
          <Menu-group title="录像参数配置">
            <Menu-item name="/settings/video/plan" v-if="$BShasPower('BS-SETTING-VIDEO-PLAN')">
              计划模板
            </Menu-item>
            <Menu-item name="/settings/video/holiday" v-if="$BShasPower('BS-SETTING-VIDEO-HOLIDAY')">
              节假日
            </Menu-item>
          </Menu-group>
        </Menu>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import './videoPage/style/manage.css'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Video',
  data() {
    return {
      activeId: '',
      menuWidth: '280',
      route: '',
      treeData: [],
      options: {
        showSearch: false
      }
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['getTree'])
  },
  methods: {
    ...mapActions(['getOrgTree']),
    orgClick() {
      const orgRouter = '/settings/video/homepage'
      // for (var item of this.configList) {
      //   item.isActive = false
      // }
      this.$router.replace(orgRouter)
      this.route = ''
    },
    isNowPathActive(name) {
      this.$router.replace(name)
      this.route = name
    },
    // 删除数据的open属性
    // deleteOpen(current) {
    //   for (let i = 0; i < current.length; i++) {
    //     if ((current[i].children) && (current[i].children.length > 0)) {
    //       delete current[i].open
    //       this.deepCopy(current[i].children)
    //     }
    //   }
    // },
    // 点击某个节点
    getChildNode(node) {
      if (this.$route.path !== '/settings/video/homepage') {
        this.$router.replace('/settings/video/homepage')
      }
      this.route = ''
      this.activeId = node._id
      // this.deleteOpen(node)
      this.$store.commit('TREE_SET_NODE', node._id)
    }
  },
  mounted() {
    this.route = this.$route.path
    this.getOrgTree(0)
      .then(suc => {
        this.treeData = JSON.parse(JSON.stringify([suc.data]))
        this.$store.commit('TREE_SET_NODE', this.treeData[0]._id)
        this.activeId = this.treeData[0]._id
      })
      .catch(err => {
        console.log('get tree err' + err)
      })
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
}

.sidebar {
  width: 272px;
  height: auto;
}

.sidebar > a {
  display: block;
  // padding-left: 20px;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
}

.tree-org {
  height: 530px;
  overflow: auto;
}
</style>
