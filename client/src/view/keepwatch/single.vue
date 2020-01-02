<template>
  <div class="message">
    <div class="bs-left">
      <VTree @node-click="nodeClick" :activeId="searchData.org" :treeData="orgTreeData"></VTree>
    </div>
    <div class="right-content">
      <Tabs :animated="false" @on-click="showTab" style="flex: 0 0 56px;">
        <TabPane label="异常信息"></TabPane>
        <TabPane label="一键报警"></TabPane>
      </Tabs>
      <singleAbnormal v-if="tabName === 0" :orgId="orgId"></singleAbnormal>
      <singleAlarm v-if="tabName === 1" :orgId="orgId"></singleAlarm>
    </div>
  </div>
</template>
<script>
import singleAbnormal from './singleAbnormal'
import singleAlarm from './singleAlarm'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    singleAbnormal,
    singleAlarm
  },
  data() {
    return {
      orgId: '',
      tabName: 0,
      searchData: {
        type: '',
        key: '',
        startTime: '',
        endTime: '',
        org: '',
        limit: this.$PageInfo.limit
      }
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ orgSetting }) => {
        return orgSetting.orgTreeData
      }
    })
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ...mapActions([
      'getMessageList',
      'getSingleList'
    ]),
    // 点击机构树节点，根据机构ID 获取消息记录
    nodeClick(item) {
      this.getType = 1
      this.searchData.org = item._id
      this.orgId = item._id
      if (this.tabName === 0) {
        const data = {
          type: '1,2',
          key: '',
          startTime: '',
          endTime: '',
          org: item._id,
          limit: this.$PageInfo.limit
        }
        this.getMessageList(data)
      } else {
        this.getSingleList(this.searchData)
      }
    },
    showTab(val) {
      this.tabName = val
    }
  }
}
</script>

<style lang="less"  scoped>
.message {
  display: flex;
  width: 100%;
  padding: 16px 0;
  // .left-content {
  //   background-color: #1b3153;
  //   width: 272px;
  // }
  .right-content {
    // margin-left: 16px;
    // flex: 1;
    // flex-direction: column-reverse;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>

<style>
</style>
