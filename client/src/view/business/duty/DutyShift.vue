<template src='./DutyShift.html'>
</template>

<script>
import shiftApi from 'src/http/business/duty/shift.js'

export default {
  data() {
    return {
      searchName: null,
      dateRange: null,
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
          key: 'name'
        },
        {
          title: '开始时间',
          key: 'startTime'
        },
        {
          title: '结束时间',
          key: 'endTime'
        }
      ],
      data: []
    }
  },
  created() {
    this.initList()
  },
  mounted() {
    this.tableWidth = this.$refs['tableContainer'].offsetWidth
    this.tableHeight = this.$refs['tableContainer'].offsetHeight
  },
  methods: {
    initList() {
      let params = {
        limit: this.page.pageSize,
        page: this.page.current
      }

      if (this.searchName) {
        params.name = this.searchName
      }

      if (this.dateRange && this.dateRange[0]) {
        params.startTime = new Date(this.dateRange[0]).getTime() / 1000
        params.endTime = new Date(this.dateRange[1]).getTime() / 1000
      }

      shiftApi
        .getList(params)
        .then(res => {
          this.data = res.data.results.map(item => {
            return {
              name: item.userName || '-',
              startTime: this.$moment(item.loginTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
              endTime: item.logoutTime ? this.$moment(item.logoutTime * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'
            }
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
#duty-shift {
  height: 100%;
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
        .iview-input {
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
