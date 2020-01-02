<template>
  <div class="log-main operateLog" v-resize="resizeFun">
    <div class="log-table" ref="tableBox">
      <div class="table-header">
        <DatePicker type="date" v-model="startTime" placeholder="开始时间"></DatePicker>
        <span>至</span>
        <DatePicker type="date" v-model="endTime" placeholder="结束时间" class="date-style"></DatePicker>
        <Button @click="searchLog" type="ghost">查询</Button>
      </div>
      <div class="table-content">
        <div class="table-body">
          <Table :height="tableHeight" size="small" :highlight-row="true" :columns="columns" :data="logList"></Table>
        </div>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-total show-elevator show-sizer :total="count" :current="logTerm.page" :page-size="logTerm.limit" @on-change="changePage" :page-size-opts="$PageInfo.size" @on-page-size-change="sizeChange"></Page>
        </div>
      </div>
    </div>
    <Modal :mask-closable="false" v-model="logShow" width="800" title="操作日志详细信息" @on-cancel="cancel">
      <Form :model="infoForm" label-position="left" :label-width="80" inline>
        <FormItem label="登录时间">
          <Input disabled v-model="infoForm.loginTime" class="input-style"></Input>
        </FormItem>
        <FormItem label="下线时间">
          <Input disabled v-model="infoForm.logoutTime" class="input-style"></Input>
        </FormItem>
        <FormItem label="在线时长" style="width: 100%;">
          <Input disabled v-model="infoForm.onlineTime" class="input-style"></Input>
        </FormItem>
        <FormItem label="操作记录">
          <Select v-model="type" class="input-style" @on-change="typechange">
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="table-content">
        <div class="table-body">
          <Table height="400" size="small" :highlight-row="true" :columns="infoColumns" :data="detailLogList"></Table>
        </div>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-total show-elevator show-sizer :total="detailTerm.count" :current="detailTerm.page" :page-size="detailTerm.limit" @on-change="changeDetailPage" :page-size-opts="$PageInfo.size" @on-page-size-change="sizeDetailChange"></Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="cancel" type="primary">退出</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { renderWithTitle } from 'src/common/render.js'
import moment from 'moment'
export default {
  name: 'operateLog',
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableHeight: 0,
      count: 0,
      logShow: false,
      type: '-1',
      startTime: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
      logTerm: {
        name: '',
        id: '',
        startTime: '',
        endTime: '',
        limit: 100,
        page: 1
      },
      detailTerm: {
        count: 0,
        limit: 100,
        page: 1
      },
      infoForm: {},
      logList: [],
      detailLogList: [],
      columns: [
        {
          title: '用户名',
          key: 'userName',
          align: 'left'
        },
        {
          title: '姓名',
          key: 'user',
          align: 'left',
          ellipsis: true
        },
        {
          title: '登录时间',
          key: 'loginTime',
          align: 'left',
          ellipsis: true
        },
        {
          title: '下线时间',
          key: 'logoutTime',
          align: 'left',
          ellipsis: true
        },
        {
          title: '在线时长',
          key: 'onlineTime',
          align: 'left'
        },
        {
          title: '客户端类型',
          key: 'clientType',
          align: 'left'
        },
        {
          title: 'IP地址',
          key: 'ip',
          align: 'left',
          ellipsis: true
        },
        {
          title: 'MAC地址',
          key: 'macIp',
          align: 'left',
          ellipsis: true
        },
        {
          title: '详细',
          key: 'detail',
          align: 'left',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.detail(params)
                  }
                }
              }, '详细')
            ])
          }
        }
      ],
      infoColumns: [
        {
          title: '时间',
          key: 'time',
          align: 'left',
          width: 150,
          render: (h, param) => {
            return h('span', moment(param.row.time * 1000).format('YYYY-MM-DD HH:mm:ss'))
          }
        },
        {
          title: '动作',
          key: 'operateName',
          align: 'left',
          ellipsis: true,
          render: (h, param) => {
            return renderWithTitle(h, param.row.operateName)
          }
        },
        {
          title: '对象',
          key: 'target',
          align: 'left',
          ellipsis: true,
          render: (h, param) => {
            return renderWithTitle(h, param.row.target)
          }
        },
        {
          title: '描述',
          key: 'operateContent',
          align: 'left',
          ellipsis: true,
          render: (h, param) => {
            return renderWithTitle(h, param.row.operateContent)
          }
        }
      ],
      typeList: [
        { label: '全部', value: '-1' }
      ]
    }
  },
  computed: {
    ...mapGetters(['userLogs']),
    ...mapState({
      userLogList: ({userManage}) => userManage.userLogList
    })
  },
  watch: {
    userId(val) {
      this.logTerm.id = val
      this.getLogs()
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 96
  },
  methods: {
    ...mapActions([
      'getUserLog',
      'getUserDetailList',
      'getModuleList'
    ]),
    /**
     * 页码改变的回调，返回改变后的页码
     * @method changePage/changeDetailPage
     * @param {number} page 页码
     */
    changePage(page) {
      this.logTerm.page = page
      this.getLogs()
    },
    changeDetailPage(page) {
      this.detailTerm.page = page
      this.getDetaiList()
    },
    /**
     * 切换每页条数时的回调，返回切换后的每页条数
     * @method sizeChange/sizeDetailChange
     * @param {number} size 每页条数
     */
    sizeChange(size) {
      this.logTerm.limit = size
      this.getLogs()
    },
    sizeDetailChange(size) {
      this.detailTerm.limit = size
      this.getDetaiList()
    },
    /**
     * 选中日志详情
     * @method detail
     * @param {Object} data 选中行信息
     */
    detail(data) {
      if (this.typeList.length === 1) {
        this.getModuleList().then(suc => {
          suc.data.map(v => {
            this.typeList.push({ label: v, value: v })
          })
        }).catch(err => {
          console.log(err)
        })
      }
      this.detailTerm = {
        count: 0,
        limit: 100,
        page: 1
      }
      this.infoForm = data.row
      this.logShow = true
      this.getDetaiList()
    },
    /**
     * 操作日志详细信息关闭
     * @method cancel
     */
    cancel() {
      this.logShow = false
      this.type = '-1'
      this.detailLogList = []
    },
    /**
     * 表格高度调节
     * @method resizeFun
     */
    resizeFun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight - 96
    },
    /**
     * 操作日志查询
     * @method searchLog
     */
    searchLog() {
      if (this.startTime !== '' && this.endTime !== '') {
        let start = moment(this.startTime).isBefore(this.endTime)
        if (start) {
          this.getLogs()
        } else {
          this.warningMsg('开始时间必须小于结束时间')
        }
      } else {
        this.warningMsg('开始时间和结束时间不能为空')
      }
    },
    /**
     * 操作类型切换操作日志详情查询
     * @method typechange
     */
    typechange() {
      this.detailTerm = {
        count: 0,
        limit: 100,
        page: 1
      }
      this.getDetaiList()
    },
    /**
     * 获取操作日志
     * @method getLogs
     */
    getLogs() {
      this.logTerm.startTime = moment(this.startTime).format('X')
      this.logTerm.endTime = moment(this.endTime).format('X')
      this.getUserLog(this.logTerm).then(suc => {
        this.count = this.userLogs.count
        this.logList = this.userLogs.logs
      }).catch(err => {
        console.log(err)
        this.warningMsg('获取日志失败')
      })
    },
    /**
     * 获取操作日志筛选
     * @method getDetaiList
     */
    getDetaiList() {
      const detailData = {
        startTime: moment(this.infoForm.loginTime).format('X'),
        endTime: moment(this.infoForm.logoutTime).format('X'),
        name: this.infoForm.userName,
        key: this.type === '-1' ? '' : this.type,
        limit: this.detailTerm.limit,
        page: this.detailTerm.page
      }
      this.getUserDetailList(detailData).then(suc => {
        this.detailLogList = this.userLogList.logs
        this.detailTerm.count = this.userLogList.count
      }).catch(err => {
        console.log(err)
        this.warningMsg('获取日志详情失败')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.log-main {
  height: calc(~'100% - 38px');
  .log-table {
    height: 100%;
    .table-header {
      padding: 12px 24px;
      .date-style {
        width: 220px;
        margin-right: 20px;
      }
    }
  }
}
.input-style {
  width:200px;
  margin-right: 20px;
}
</style>
