<template src='./SysLog.html'>
</template>

<script>
import sysLogApi from 'src/http/sys/sysLog.js'
import _ from 'lodash'
import moment from 'moment'

class SysLog {
  constructor(sysLog) {
    this.userName = _.get(sysLog, 'userName', '-')
    this.date = this._getTime(_.get(sysLog, 'time', '-'))
    this.userIP = _.get(sysLog, 'clientIp', '-')
    this.logType = _.get(sysLog, 'logType', '-')
    this.module = _.get(sysLog, 'module', '-')
    this.operation = _.get(sysLog, 'operateName', '-')
    this.action = _.get(sysLog, 'operateContent', '-')
    this.object = _.get(sysLog, 'target', '-')
    this.objectIP = _.get(sysLog, 'deviceIp', '-')
    this.status = _.get(sysLog, 'state', '-')
  }

  _getTime(time) {
    return time === '-' ? '-' : moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
  }
}

export default {
  data() {
    return {
      elemIF: null,
      dateRange: [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')],
      searchName: null,
      logType: null,
      status: null,
      object: null,
      action: null,
      tableWidth: null,
      tableHeight: null,
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      columns: [
        {
          title: '用户名',
          key: 'userName'
        },
        {
          title: '时间',
          key: 'date'
        },
        {
          title: '用户IP',
          key: 'userIP'
        },
        {
          title: '日志类别',
          key: 'logType'
        },
        {
          title: '模块',
          key: 'module'
        },
        {
          title: '操作名称',
          key: 'operation'
        },
        {
          title: '操作内容',
          // key: 'action',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.action
                }
              },
              params.row.action
            )
          }
        },
        {
          title: '操作对象',
          // key: 'object',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.object
                }
              },
              params.row.object
            )
          }
        },
        {
          title: '对象IP',
          // key: 'objectIP',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.objectIP
                }
              },
              params.row.objectIP
            )
          }
        },
        {
          title: '状态',
          key: 'status'
        }
      ],
      data: []
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    setTimeout(() => {
      this.tableWidth = this.$refs['tableContainer'].offsetWidth
      this.tableHeight = this.$refs['tableContainer'].offsetHeight
    }, 0)
  },
  methods: {
    exportList() {
      let params = {}

      if (this.searchName) {
        params.userName = this.searchName
      }

      if (this.dateRange && this.dateRange[0]) {
        params.startTime = this.$moment(`${this.$moment(this.dateRange[0]).format('YYYY-MM-DD')} 00:00:00`).unix()
        params.endTime = this.$moment(`${this.$moment(this.dateRange[1]).format('YYYY-MM-DD')} 23:59:59`).unix()
      }

      if (this.logType) {
        params.logType = this.logType
      }

      if (this.status) {
        params.state = this.status
      }

      if (this.object) {
        params.target = this.object
      }

      if (this.action) {
        params.operateContent = this.action
      }

      let arr = []

      for (let key in params) {
        arr.push(`${key}=${params[key]}`)
      }

      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      this.elemIF.src = `${window.location.origin}/api/setting/user/export?${arr.join('&')}`
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
    },
    clearSearch() {
      this.dateRange = null
      this.searchName = null
      this.logType = null
      this.status = null
      this.object = null
      this.action = null

      this.initList()
    },
    initList() {
      let params = {
        limit: this.page.pageSize,
        page: this.page.current
      }

      if (this.searchName) {
        params.userName = this.searchName
      }

      if (this.dateRange && this.dateRange[0]) {
        params.startTime = this.$moment(`${this.$moment(this.dateRange[0]).format('YYYY-MM-DD')} 00:00:00`).unix()
        params.endTime = this.$moment(`${this.$moment(this.dateRange[1]).format('YYYY-MM-DD')} 23:59:59`).unix()
        console.log('params', params)
      }

      if (this.logType) {
        params.logType = this.logType
      }

      if (this.status) {
        params.state = this.status
      }

      if (this.object) {
        params.target = this.object
      }

      if (this.action) {
        params.operateContent = this.action
      }

      sysLogApi
        .getList(params)
        .then(res => {
          this.data = res.data.map(item => {
            return new SysLog(item)
          })

          const headers = res.headers

          if (headers['x-bsc-count'] && headers['x-bsc-cur'] && headers['x-bsc-limit']) {
            this.page = {
              total: parseInt(headers['x-bsc-count']),
              current: parseInt(headers['x-bsc-cur']),
              pageSize: parseInt(headers['x-bsc-limit'])
            }
          }
        })
        .catch(error => {
          this.$Notice.error({
            title: '错误提示！',
            desc: error.message
          })
        })
    },
    handlePageSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.initList()
    },
    handlePageChange(pageNum) {
      this.page.current = pageNum
      this.initList()
    },
    getDateRange(data) {
      this.dateRange = data
    },
    confirmSearch() {
      this.initList()
    }
  }
}
</script>

<style lang="less">
#sys-log {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  .main-content {
    background-color: #1b3153;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .toolbar {
      display: flex;
      padding: 12px 24px;
      min-height: 54px;
      .left-bar {
        .iview-input,
        .ivu-select {
          margin-right: 8px;
        }
      }
      button {
        margin-right: 8px;
      }
    }
    .table-container {
      flex-grow: 1;
      overflow-y: auto;
    }
    .paging-container {
      display: flex;
      min-height: 38px;
      padding: 0 16px;
      align-items: center;
      justify-content: flex-end;
      background-color: #244575;
      user-select: none;
    }
  }
}
</style>
