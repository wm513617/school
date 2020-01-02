<template>
  <div class="query">
    <div class="query-content">
      <Row>
        <Col span="24">
        <div class="query-inquire">
          <div class="search">
            <Select v-model="logType" style="width:300px" clearable>
              <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="ghost" @click="inquire">查询</Button>
          </div>
          </Input>
        </div>
        </Col>
        <Col span="24">
        <div class="table">
          <div class="query-table">
            <Table :columns="columnsTitle" :data="countList" size="small" :highlight-row="true"></Table>
          </div>
          <div class="table-footer" style="overflow: hidden">
            <div style="float: right;">
              <Page :total="totalPage" :current="currentPage" :page-size="pageSize" @on-change="pageChange" show-total show-elevator></Page>
            </div>
          </div>
        </div>
        </Col>
      </Row>
    </div>
    <!--<a download=""
             href=""
             target="blank"
             id="downfile"></a>-->
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import Blob from 'blob'
import { saveAs } from '../../assets/js/FileSaver.js'
export default {
  data() {
    return {
      columnsTitle: [
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '日志链接',
          key: 'link'
        },
        {
          title: '操作',
          key: 'operat',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                on: {
                  click: e => {
                    this.show(params.row)
                  }
                }
              },
              '下载'
            )
          }
        }
      ],
      countList: [],
      typeList: [
        {
          value: 'error',
          label: 'error'
        },
        {
          value: 'response',
          label: 'response'
        }
      ],
      logType: '',
      // 分页
      totalPage: 0,
      currentPage: 1,
      pageSize: 5
    }
  },
  mounted() {},
  methods: {
    ...mapMutations(['GET_LOG']),
    ...mapActions(['getLog', 'upLoadLog']),
    // 查询
    inquire() {
      this.getLog({
        page: this.currentPage,
        limit: this.pageSize,
        type: this.logType
      })
        .then(resp => {
          console.log(this.logList)
          this.countList = JSON.parse(JSON.stringify(this.logList))
          console.log(this.logList)
          this.totalPage = this.countList.length
        })
        .catch(err => {
          console.log('getLog error: ' + err)
        })
    },
    // 下载按钮
    show(row) {
      this.upLoadLog('/log/' + row.link)
        .then(exportLog => {
          // var logFile = exportLog.request.responseURL
          // var a = document.getElementById('downfile')
          // a.href = logFile
          // a.click()
          // var downTxt = $.ajax({ url: logFile, async: false, contentType: 'text/plain;charset=gb2312' })
          var blob = new Blob([exportLog.data], {
            type: 'text/plain;charset=gb2312'
          })
          saveAs(blob, row.link)
        })
        .catch(err => {
          console.log('getLog error: ' + err)
        })
    },
    // 分页
    pageChange(page) {
      this.currentPage = page
      this.inquire(page)
    }
  },
  computed: {
    ...mapState({
      logList: ({ query }) => query.logList
    })
  },
  created() {}
}
</script>
<style>
.query {
  width: 100%;
  min-width: 1280px;
}

.query .query-content {
  margin: 0 20px;
}

.query .query-inquire {
  overflow: hidden;
  margin: 20px 0;
}

.query .search {
  float: right;
}

.query .search button {
  margin-left: 10px;
}

.query .ivu-table-tip table {
  height: 434px !important;
}

.query .ivu-table-body {
  height: 434px !important;
}
</style>
