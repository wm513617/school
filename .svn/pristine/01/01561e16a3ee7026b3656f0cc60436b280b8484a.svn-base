<template>
  <div class="bs-content">
    <div class="bs-left">
      <VTree @node-click="nodeClick" :activeId="searchData.org" :treeData="orgTreeData"></VTree>
    </div>
    <div class="bs-main flex-column ">
      <div class="main-handle flex-between topBar">
        <div class="handle-left">
          <Button v-if="$BShasPower('BS-PATROL-MESSAGE')" type="ghost" @click="add" icon="plus">新建</Button>
          <Button v-if="$BShasPower('BS-PATROL-MESSAGE')" type="ghost" :disabled="isRemove" @click="removeMsgs" icon="trash-a">删除</Button>
          <Button type="ghost" @click="refresh" icon="android-refresh">刷新</Button>
        </div>
        <div class="handle-right">
          <Input v-model="searchData.key" placeholder="消息关键字" style="width: 150px"></Input>
          <div>
            <DatePicker ref='startTime' type="date" @on-change="searchStartTimeChange" placeholder="开始日期" :editable="false"></DatePicker>
            <span>至</span>
            <DatePicker ref='endTime' type="date" @on-change="searchEndTimeChange" placeholder="结束日期" :editable="false"></DatePicker>
          </div>
          <Button @click="searchMessage" icon="ios-search">搜索</Button>
        </div>
      </div>
      <div ref="tableBox" class="flex-1">
        <div class="table-body">
          <Table @on-selection-change="selectRow" :height="tableHeight" size="small" highlight-row ref="currentRowTable" :columns="tableColumns" :data="messageList">
          </Table>
          <div class="table-footer">
            <div style="float: right;">
              <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :show-total="true" :page-size="searchData.limit" :show-elevator="true" :total="pageInfo.count" :current="pageInfo.cur" @on-change="changePage"></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <msgModal :modalType="modalType" :modalIsShow.sync="modalShow"></msgModal>
    <msgInfoModal @replyClick="replyMsg" :data="msgInfo" :modalInfoIsShow.sync="msgInfoShow" :modalType="modalType"></msgInfoModal>
  </div>
</template>
<script>
import msgInfoModal from '../keepwatch/common/msgInfo'
import msgModal from '../keepwatch/common/msgModal'
import moment from 'moment'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    msgInfoModal,
    msgModal
  },
  data() {
    return {
      deleList: [],
      allMessageList: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 0,
          label: '常规'
        },
        {
          value: 1,
          label: '报警'
        },
        {
          value: 2,
          label: '保修'
        }
      ],
      modalType: 1,
      replyUser: {
        realName: '',
        userId: ''
      },
      getType: 1,
      modalShow: false,
      isRemove: true,
      msgInfoShow: false,
      dataList: [],
      tableHeight: 435,
      msgInfo: null,
      selectData: [],
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 70,
          align: 'center'
        },
        {
          title: '标题',
          key: 'title'
        },
        {
          title: '时间',
          align: 'center',
          width: 180,
          render: (h, param) => {
            return h('span', moment(param.row.createdAt).format('YYYY-MM-DD HH:mm'))
          }
        },
        {
          title: '发件人',
          key: 'sender',
          align: 'center',
          ellipsis: true
        },
        {
          title: '收件人',
          ellipsis: true,
          render: (h, params) => {
            let str = []
            params.row.receiver.map(item => {
              str.push(item.realName)
            })
            return h('span', str.toString())
          }
        },
        {
          title: '操作',
          width: 180,
          align: 'center',
          render: (h, params) => {
            if (this.$BShasPower('BS-PATROL-MESSAGE')) {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.row)
                      }
                    }
                  },
                  '详情'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            } else {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.showDetail(params.row)
                      }
                    }
                  },
                  '详情'
                )
              ])
            }
          }
        }
      ],
      searchData: {
        type: '0',
        key: '',
        startTime: '',
        endTime: '',
        org: '',
        limit: this.$PageInfo.limit
      },
      activeId: ''
    }
  },
  computed: {
    ...mapState({
      messageList: ({ patrol }) => patrol.messageList,
      orgTreeData: ({ orgSetting }) => {
        return orgSetting.orgTreeData
      },
      pageInfo: state => {
        return state.patrol.pageInfo
      }
    })
  },
  created() {
    this.UPDATE_PAGEINFO()
    this.getOrgTree(3)
    this.getMessageList({ limit: this.searchData.limit, type: this.searchData.type })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  beforeDestroy() {
    this.clearMessageList()
  },
  methods: {
    ...mapMutations(['UPDATE_PAGEINFO']),
    ...mapActions([
      'getMessageList',
      'getMessageById',
      'searchMessageList',
      'getOrgTree',
      'getUserList',
      'getSentryUserTree',
      'deleteMessage',
      'recordLog',
      'clearMessageList'
    ]),
    // 新建消息
    add() {
      this.modalShow = true
      this.modalType = 1
    },
    // 修改消息查询条件的开始时间和结束时间
    searchStartTimeChange(time) {
      if (time) {
        this.searchData.startTime = this.$moment(time).format('X')
      } else {
        this.searchData.startTime = ''
      }
    },
    searchEndTimeChange(time) {
      if (time) {
        this.searchData.endTime = this.$moment(time).format('X')
      } else {
        this.searchData.endTime = ''
      }
    },
    // 点击机构树节点，根据机构ID 获取消息记录
    nodeClick(item) {
      this.getType = 1
      this.searchData.org = item._id
      // this.searchData.limit = this.pageLimit
      this.getMessageList(this.searchData)
    },
    // 删除单条信息
    remove(item) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除消息吗?</p>',
        loading: true,
        onOk: () => {
          this.deleteMessage(item._id).then(res => {
            this.$Notice.success({
              title: '删除成功'
            })
            this.$Modal.remove()
            this.getMessageList(this.searchData)
          })
          this.recordLog({
            logType: '操作日志',
            module: '电子巡查',
            operateName: '删除消息',
            operateContent: '删除消息',
            target: item.title
          }).catch(err => console.log(err))
        }
      })
    },
    selectRow(rows) {
      if (rows.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
      this.selectData = rows
    },
    // 批量删除消息
    removeMsgs() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除消息吗?</p>',
        loading: true,
        onOk: () => {
          const ids = []
          this.selectData.map(item => {
            ids.push(item._id)
          })
          this.deleteMessage(ids).then(res => {
            if (this.selectData.length) {
              this.isRemove = true
            }
            this.$Notice.success({
              title: '删除成功'
            })
            this.$Modal.remove()
            this.getMessageList(this.searchData)
          })
          this.selectData.forEach(element => {
            this.deleList.push(element.title)
          })
          this.recordLog({
            logType: '操作日志',
            module: '电子巡查',
            operateName: '删除消息',
            operateContent: '删除消息',
            target: this.deleList.join()
          }).catch(err => console.log(err))
        }
      })
    },
    // 点击刷新
    refresh() {
      this.searchData.key = ''
      this.searchData.org = ''
      this.$refs.startTime.handleClear()
      this.$refs.endTime.handleClear()
      this.getMessageList({ limit: this.searchData.limit, type: this.searchData.type })
    },
    // 检索消息
    searchMessage() {
      let goon = true
      if (this.searchData.startTime && this.searchData.endTime) {
        if (this.searchData.startTime > this.searchData.endTime) {
          this.$Notice.warning({
            title: '开始时间不能大于结束时间'
          })
          goon = false
        } else if ((this.searchData.endTime - this.searchData.startTime) / 86400 > 30) {
          goon = false
          this.$Notice.warning({
            title: '日期范围不能大于一个月'
          })
        }
      }
      if (goon) {
        this.getType = 2
        this.searchData.org = ''
        let param = {
          key: this.searchData.key,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          limit: this.searchData.limit,
          type: this.searchData.type
        }
        this.searchMessageList(param)
      }
    },
    // 查看消息详情
    showDetail(data) {
      this.getMessageById({ id: data._id }).then(res => {
        this.msgInfo = res
        this.msgInfoShow = true
      })
    },
    changePage(n) {
      let param = Object.assign({ page: n }, this.searchData)
      if (this.getType === 1) {
        this.getMessageList(param)
      } else {
        this.searchMessageList(param)
      }
    },
    pageSizeChange(n) {
      this.searchData.limit = n
      // this.searchData.page = 1
      if (this.getType === 1) {
        this.getMessageList(this.searchData)
      } else {
        this.searchMessageList(this.searchData)
      }
    },
    clicktest(e) {},
    // 点击消息回复
    replyMsg(data) {
      this.modalType = data.type
      this.replyUser.realName = data.sender
      this.replyUser.userId = data._id
      // this.modalShow = true
    },
    addMsgOk() {
      this.getMessageList(this.searchData)
    }
  }
}
</script>

<style lang="less"  scoped>
.flex-1 {
  position: relative;
  overflow: hidden;
}
.date-search {
  position: absolute;
  right: 0px;
  width: 290px;
  height: 100%;
  background: #1b3153;
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
.topBar {
  background: #1b3153;
}
.handle-right > div {
  display: inline-block;
  margin: 0 10px;
}
.handle-right > button {
  margin-left: 8px;
}
.search-btn {
  padding: 10px;
  text-align: center;
  button {
    width: 100px;
    height: 32px;
  }
}
.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style>
