<template>
  <!-- 刷卡记录 -->
  <div class="bs-content" style="overflow: inherit;">
    <div class="bs-left">
      <SrvSideBar @tigger-door='canClickSearch' :srvCfg='false'></SrvSideBar>
    </div>
    <div class="bs-main">
      <div class="bsMainChild">
        <div class="tab-content-alarm">
          <div class="feature-btn">
            <!--  :options='options1' -->
            <DatePicker type="datetime" @on-change="changeStartTime" :value="searchData.valueStart" format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" style="width: 218px"></DatePicker>
            <span style="margin:0 10px">至</span>
            <!--  -->
            <DatePicker type="datetime" @on-change="changeEndTime" :value="searchData.valueEnd" format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" style="width: 218px"></DatePicker>
            <Button type="ghost" icon="search" @click="search(1)" style="margin:0 15px;">搜索</Button>
            <Button type="ghost" icon="refresh" @click="refash">刷新</Button>
          </div>
          <div class="table-relative" ref="tableBox">
            <Table v-if = 'tableHeight && tableWidth' size="small" :columns = "importTitle" :data = "importData" :height = "tableHeight" :width = 'tableWidth'></Table>
          </div>
          <div class="page-style">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
          </div>
        </div>
        <!--模态框-->
      
      </div>
    </div>
  </div>
</template>
<script>
import './common.css'

import SrvSideBar from './srvSideBar.vue'

export default {
  name: 'cardBlog',
  components: {
    SrvSideBar
  },
  data() {
    return {
      // 绑定到前端同时发送给后端的数据
      searchData: {
        workNum: '',
        option: -1,
        valueStart: this.$moment().format('YYYY-MM-DD 00:00:00'),
        valueEnd: this.$moment().format('YYYY-MM-DD HH:mm:ss')
      },
      importTitle: [
        {
          title: '报警时间',
          key: 'time'
        },
        {
          title: '门禁名称',
          key: 'name'
        },
        {
          title: '所属机构',
          key: 'direction'
        },
        {
          title: '报警类型',
          key: 'type'
        },
        {
          title: '录像回放',
          key: 'video',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'default',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {}
                  }
                },
                '录像回放'
              )
            ])
          }
        }
      ],
      importData: [
        {
          time: 'John Brown',
          name: 'dadd',
          direction: 'New York No. 1 Lake Park',
          type: '321'
        },
        {
          time: 'John Brown',
          name: 'dadd',
          direction: 'New York No. 1 Lake Park',
          type: '321'
        },
        {
          time: 'John Brown',
          name: 'dadd',
          direction: 'New York No. 1 Lake Park',
          type: '321'
        },
        {
          time: 'John Brown',
          name: 'dadd',
          direction: 'New York No. 1 Lake Park',
          type: '321'
        }
      ],
      // 分页
      inPageNum: '',
      pageLimit: this.$PageInfo.limit,
      startNum: 1,
      // 列表高度
      tableHeight: '',
      tableWidth: ''
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
      this.tableWidth = this.$refs['tableBox'].offsetWidth
    })
  },
  computed: {},
  methods: {
    canClickSearch(doorId) {
      this.getTreeNode = doorId.id
    },
    // 改变页面初始时间
    changeStartTime(val) {
      this.searchData.valueStart = val
    },
    // 改变页面结束时间
    changeEndTime(val) {
      this.searchData.valueEnd = val
    },
    refash() {},
    cancel() {},
    // 分页功能
    pageChange(page) {
      this.search(page)
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.search(1)
    }
  }
}
</script>

<style lang="less" scoped>
.bsMainChild {
  width: 100%;
  height: 100%;
  .tab-content-alarm {
    width: 100%;
    height: 100%;
    background-color: #1c3053;
    display: flex;
    flex-direction: column;
    .feature-btn {
      height: 64px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: 24px;
    }
    .table-relative {
      flex: 1;
      overflow-y: auto;
    }
    .page-style {
      height: 40px;
      line-height: 40px;
      padding-right: 16px;
      background-color: #244575;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }
  .videoShowOther .videoList {
    width: 200px;
    height: 180px;
    text-align: center;
    margin-top: 20px;
  }
  .videoShowOther .videoList:first-child {
    margin: 0;
  }
  .videoShowOther .exitModel {
    width: 200px;
    font-size: 16px;
    text-align: center;
    height: 40px;
    margin: 15px 0px 0px 2px;
  }
}
</style>
