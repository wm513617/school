<template>
  <div class='content'>
    <div class="bs-left" style="padding-top:8px;">
      <VTree :treeData="orgTreeData" :activeId="orgId" @node-click="nodeClick"></VTree>
    </div>
    <div class="bs-mains">
      <div class="feature-btn">
        <DatePicker type="datetimerange" :options="options" v-model="searchTime" placeholder="请选择时间" style="width: 300px"></DatePicker>
        <Input v-model="name" placeholder="用户名" :maxlength="64" style="margin-left:8px;width:200px;"></Input>
        <Select v-model="searchStatus" placeholder="状态" style="margin-left:8px;width:200px;">
          <Option v-for="item in status" :key="item.value" :value="item.value">{{item.label}}</Option>
        </Select>
        <Input v-model="action" placeholder="操作内容" :maxlength="64" style="width:200px;margin-left:8px;"></Input>
        <Button type="ghost" icon="search" style="margin-left:8px;" @click="getSingleRecords">搜索</Button>
        <Button type="ghost" icon="ivu-icon iconfont icon-export" style="margin-left:8px;" @click="exportFile">导出</Button>
        <Button type="ghost" icon="ivu-icon iconfont icon-refresh" style="margin-left:8px;" @click="clearSearch">清空条件</Button>
      </div>
      <div class="table-box single-table" ref="tableBox">
        <Table size="small" :height="tableHeight" highlight-row :columns="column" :data="logLists" @on-row-click="rowClick" @on-selection-change="selectChange" v-resize="resizeFun"></Table>
        <div class="picture-col">
          <div class="picture-title">其他</div>
          <div class="picture-box">
            <img :src="singlePicture || defaultImg">
          </div>
        </div>
        <div class="table-footer">
          <div style="float:right;">
            <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :page-size="pageLimit" :current="pageCur" @on-page-size-change="pageSizeChange" :total="pageTotal" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImg from '../../../static/noImg1.png'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      tableHeight: 420,
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      orgId: '',
      logLists: [], // 表格数据
      status: [
        {value: '成功', label: '成功'},
        {value: '失败', label: '失败'}
      ],
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      pageTotal: 0,
      column: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'name',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'realname',
          align: 'center'
        },
        {
          title: '时间',
          key: 'time',
          align: 'center',
          render: (h, params) => {
            return h('span', this.$moment(params.row.time * 1000).format('YYYY-MM-DD kk:mm:ss'))
          }
        },
        {
          title: '设备SN码',
          key: 'sn',
          align: 'center'
        },
        {
          title: '操作名称',
          key: 'actionName',
          align: 'center'
        },
        {
          title: '操作内容',
          key: 'actionContent',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center'
        },
        {
          title: '',
          key: '',
          align: 'center',
          width: 200
        }
      ],
      selectedId: [], // 列表选中数据id
      singlePicture: '',
      defaultImg: defaultImg,
      searchTime: [], // 搜索时间
      name: '', // 搜索用户名
      searchStatus: '', // 搜索状态
      action: '' // 搜索内容
    }
  },
  computed: {
    ...mapState({
      orgTreeData: ({ orgSetting }) => orgSetting.orgTreeData
    })
  },
  created() {
    this.getOrgTree(3).then(res => {
      this.orgId = res.data._id
      this.getSingleRecords()
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapActions(['getOrgTree', 'getSingleLog']),
    resizeFun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
    },
    // 获取单兵日志信息
    getSingleRecords() {
      let param = {
        page: this.pageCur,
        limit: this.pageLimit,
        orgid: this.orgId,
        actionContent: this.action,
        status: this.searchStatus || '',
        name: this.name,
        startTime: '',
        endTime: ''
      }
      if (this.searchTime[0] && this.searchTime[1]) {
        param.startTime = new Date(this.searchTime[0]).valueOf() / 1000
        param.endTime = new Date(this.searchTime[1]).valueOf() / 1000
      }
      this.getSingleLog(param).then(res => {
        this.logLists = res.data.results
        this.pageTotal = Number(res.headers['x-bsc-count'])
        this.singlePicture = this.logLists[0] ? (this.logLists[0].photo ? this.logLists[0].photo : this.defaultImg) : this.defaultImg
        this.selectedId = []
      }).catch(() => {
        this.errorMsg('获取单兵日志失败')
      })
    },
    nodeClick(node) {
      this.orgId = node._id
      this.getSingleRecords()
    },
    // 点击列表某一行
    rowClick(data) {
      this.singlePicture = data.photo
    },
    selectChange(selection) {
      this.selectedId = selection.map(item => {
        return item._id
      })
    },
    clearSearch() {
      this.searchTime = []
      this.name = ''
      this.searchStatus = ''
      this.action = ''
      this.getSingleRecords()
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.getSingleRecords()
    },
    pageChange(page) {
      this.pageCur = page
      this.getSingleRecords()
    },
    exportFile() {
      const ids = this.selectedId.join(',')
      let elemIF = document.getElementById('dow')
      if (!elemIF) {
        elemIF = document.createElement('iframe')
        elemIF.id = 'dow'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      elemIF.src = window.location.origin + `/api/setting/sentry/export/?singleLogIds=${ids}`
    }
  }
}
</script>

<style scoped lang='less'>
.content {
  width: 100%;
  position: relative;
  display: flex;
  padding: 16px 0;
}
.bs-mains {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  width: calc(~'100% - 288px');
  height: calc(~'100% - 32px');
  margin-left: 288px;
  background: #1c3053;
  min-height: 670px;
  overflow: hidden;
  padding: 16px 0 0;
  .feature-btn {
    width: 100%;
    flex: 0 0 32px;
    padding: 0 24px;
    margin-bottom: 12px;
    height: 32px;
    line-height: 32px;
  }
  .table-box {
    height: calc(~'100% - 44px');
  }
}
.picture-col {
  width: 200px;
  height: 260px;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 60px;
  font-weight: bold;
  .picture-title {
    height: 32px;
    text-align: center;
    line-height: 32px;
    background-color: #244575;
  }
  .picture-box {
    flex: 1;
    padding: 8px 20px;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style>
.single-table .ivu-table {
  width: 100%;
}
</style>
