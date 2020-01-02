<template>
  <div class="video-monitor-tree">
    <Tabs :animated="false" active-key="org" @on-click="treeTabsClick">
      <TabPane label="按机构" name="org">
        <div class="input" style="width:100%;padding:10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
        </div>
        <div class="video-monitor-tree-wrap">
          <bs-scroll>
            <v-tree ref='tree' style="height:100%;" :treeData="orgsTreeData" :options="options" @node-click="treeNodeClick" :activeId="activeId" :searchVal="searchVal" @on-expand="$refs.scroller.update()"></v-tree>
          </bs-scroll>
        </div>
      </TabPane>
      <TabPane label="按设备" name="device">
        <div class="input" style="width:100%;padding:10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
        </div>
        <div class="video-monitor-tree-wrap">
          <bs-scroll ref="scroller">
            <v-tree ref='tree' style="height:100%;" :treeData="devicesTreeData" :options="options" @node-click="treeNodeClick" :activeId="activeId" :searchVal="searchVal" @on-expand="$refs.scroller.update()"></v-tree>
          </bs-scroll>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import './orgTree.css'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchVal: '',
      orgsTreeData: [],
      devicesTreeData: [],
      options: {
        showFolder: true
      },
      activeTab: '',
      activeId: ''
    }
  },
  created() {
    // 获取机构树可以直接调用公共组件orgSettings
    this.getOrgTree(0).then(() => {
      this.orgsTreeData = JSON.parse(JSON.stringify(this.orgTreeData))
      this.activeId = this.orgsTreeData[0]._id
      this.activeTab = 'org'
      const params = {
        id: this.activeId,
        key: this.activeTab
      }
      this.$emit('on-click', params)
    }).catch(err => {
      console.log('getOrgTree error: ' + err)
    })
    this.getOpsDeviceTree().then(() => {
      this.devicesTreeData = JSON.parse(JSON.stringify(this.deviceTreeData))
    }).catch(err => {
      console.log('getOpsDeviceTree error: ' + err)
    })
    this.activeTab = 'org'
  },
  computed: {
    ...mapState({
      orgTreeData: ({ orgSetting }) => orgSetting.orgTreeData,
      deviceTreeData: ({ opsManage }) => opsManage.deviceTreeData
    })
  },
  methods: {
    ...mapActions([
      'getOrgTree',
      'getOpsDeviceTree',
      'setOrgActiveId',
      'setOrgActiveName'
    ]),
    treeTabsClick(key) {
      let id
      if (key === 'org') {
        id = this.orgsTreeData[0]._id
      } else {
        id = this.devicesTreeData[0].children[0]._id
      }
      this.$emit('on-click', { id: id, key: key })
      this.activeTab = key
    },
    treeNodeClick(node, mark) {
      this.activeId = node._id
      const params = {
        id: this.activeId,
        key: this.activeTab
      }
      this.$emit('on-click', params)
    }
  }
}
</script>

<style scoped>
.video-monitor-tree {
  width: 100%;
  height: 100%;
}
</style>
