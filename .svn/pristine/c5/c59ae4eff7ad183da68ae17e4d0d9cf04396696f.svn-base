<template>
  <div class="bs-content">
    <div class="bs-left">
      <VTree @node-click="nodeClick" :activeId="orgInfo.id" :treeData="orgTreeData"></VTree>
    </div>
    <div class="right-content">
      <Tabs :animated="false" @on-click="showTab" style="flex: 0 0 56px;">
        <TabPane label="对讲"></TabPane>
        <TabPane label="广播"></TabPane>
      </Tabs>
      <talkback v-if="tabName === 0" :oid="oid"></talkback>
      <radioBroadcast v-if="tabName === 1" :oid="oid"></radioBroadcast>
    </div>
  </div>
</template>
<script>
import VTree from '../../components/tree/VTree'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import radioBroadcast from './common/radioBroadcast'
import talkback from './common/talkback'
export default {
  components: {
    VTree,
    radioBroadcast,
    talkback
  },
  data() {
    return {
      oid: '',
      orgInfo: {
        id: '',
        orgName: ''
      },
      tabName: 0,
      isAdd: true,
      getType: 1,
      taskPower: false,
      pageLimit: this.$PageInfo.limit
    }
  },
  computed: {
    ...mapGetters(['plugins']),
    ...mapState({
      orgTreeData: state => {
        return state.orgSetting.orgTreeData
      }
    })
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['UPDATE_PAGEINFO']),
    ...mapActions([
      'getTaskList',
      'searchTalkbackHistory'
    ]),
    // 点击巡更人员机构树获取任务数据
    nodeClick(item) {
      console.log('机构树', item)
      this.oid = item._id
      // this.isAdd = false
      // this.getType = 1
      this.orgInfo.id = item._id
      this.orgInfo.orgName = item.name
      // this.getTaskList({ org: item._id, limit: this.pageLimit })
      if (this.tabName === 0) {
        const data = {
          // name: 'admin',
          starttime: '',
          endtime: '',
          page: 1,
          limit: 100,
          oid: item._id
        }
        this.searchTalkbackHistory(data)
      }
    },
    showTab(val) {
      this.tabName = val
    }
  }
}
</script>

<style lang="less"  scoped>
.right-content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.object-box {
  width:0;
  height: 0;
}
.flex-1 {
  position: relative;
  overflow: hidden;
}
.bs-table-box {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background: #1c3053;
}
.ivu-table-tip{
  overflow-x: hidden !important;
}
.handle-left {
  flex: 0 0 300px;
  padding: 12px 24px;
}
.handle-left > Button {
  margin-right: 8px;
}
.handle-right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  padding: 12px 24px;
}
.topBar{
  background: #1b3153;
}
.handle-right > div {
  display: inline-block;
  margin: 0 10px;
}
.handle-right > Button {
  margin-left: 8px;
}
.ivu-date-picker {
  width: 170px;
}
.task-point {
  width: calc(~'100% - 40px');
  display: inline-block;
}
// 弹出框右侧样式
.modal-right {
  padding: 10px;
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 0;
  border-left: 1px solid #171717;
  right: -260px;
  width: 260px;
  height: 100%;
  background: #1c3053;
}
.modal-right .ivu-date-picker {
  width: 180px;
}
.point-tree {
  flex: 1;
  border: 1px solid #ccc;
  margin: 10px 0;
  overflow: auto;
}
.condition {
  height: 26px;
  margin: 26px 0;
  width: 100%;
}
.condition > * {
  display: inline-block;
}
.condition > span {
  width: 80px;
  line-height: 24px;
  color: #fff;
}
.black_over{
    // display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #081526;
    z-index: 9999;
    opacity: 0.8;
}
/*弹框*/
.popup{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -328px;
    width: 600px;
    height: 656px;
    background-color: #1b3153;
    z-index: 99999;
    border-radius: 10px;
    border: 1px solid #1b3153;
}
.modal-top{
    font-size: 14px;
    height: 38px;
    padding: 10px 24px;
    border-radius: 8px 8px 0 0;
    background-color: #0f2343;;
}
.control-bar i{
  margin-right: 10px;
  cursor: pointer;
}
.control-bar .volume{
  margin-right: 10px;
}
.control-bar .duration{
  float: right;
  margin-top: 7px;
}
</style>
<style>
.ivu-table-tip {
  overflow-x: hidden !important;
}
</style>
