<template src='./DutyShift.html'>
</template>

<script>
import { renderWithTitle } from 'src/common/render.js'
import shiftApi from 'src/http/business/duty/shift.js'
import _ from 'lodash'
import moment from 'moment'

class ShiftInfo {
  constructor(shiftInfo) {
    this.beforeName = _.get(shiftInfo, 'user.name', '-')
    this.afterName = _.get(shiftInfo, 'takeUser.name', '-')
    this.endTime = this._getTime(_.get(shiftInfo, 'time', '-'))
    this.startTime = this._getTime(_.get(shiftInfo, 'loginTime', '-'))
    this.periodOfTime = `${this.startTime} 至 ${this.endTime} `
    this.alarmProcess = `${_.get(shiftInfo, 'undealAlarm', '-')}`
    this.alarmProcessAll = `${_.get(shiftInfo, 'allAlarm', '-')}`
    this.receiveAlarmProcess = `${_.get(shiftInfo, 'undealTask', '-')}`
    this.receiveAlarmProcessAll = `${_.get(shiftInfo, 'allTask', '-')}`
    this.logbook = _.get(shiftInfo, 'logCount', '-')
    this.comment = _.get(shiftInfo, 'remark', '-')
    this.normalCount = _.get(shiftInfo, 'normalCount', '-')
    this.videoCount = _.get(shiftInfo, 'videoCount', '-')
    this.intelligentCount = _.get(shiftInfo, 'intelligentCount', '-')
    this.alarmHelpCount = _.get(shiftInfo, 'alarmHelpCount', '-')
    this.fireAlarmCount = _.get(shiftInfo, 'fireAlarmCount', '-')
    this.singleCount = _.get(shiftInfo, 'singleCount', '-')
    this.systemExceptionCount = _.get(shiftInfo, 'systemExceptionCount', '-')
    this.manualAlarmCount = _.get(shiftInfo, 'manualAlarmCount', '-')
  }
  _getTime(time) {
    return time === '-' ? '-' : moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
  }
}

export default {
  data() {
    return {
      searchName: null,
      dateRange: null,
      tableWidth: null,
      tableHeight: null,
      Modal: false,
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      formItem: {
        heir: '',
        successor: '',
        time: '',
        date: '',
        remark: ''
      },
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 60,
          align: 'center'
        },
        {
          title: '交班人',
          key: 'beforeName'
        },
        {
          title: '接班人',
          key: 'afterName'
        },
        {
          title: '交接时间',
          key: 'endTime',
          width: 200
        },
        {
          title: '当班时间段',
          key: 'periodOfTime',
          width: 300
        },
        {
          title: '普通报警',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'normalAlarm')
                      }
                    }
                  },
                  params.row.normalCount
                )
              ])
            } else {
              return h('span', `${params.row.normalCount}`)
            }
          }
        },
        {
          title: '视频报警',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'videoAlarm')
                      }
                    }
                  },
                  params.row.videoCount
                )
              ])
            } else {
              return h('span', `${params.row.videoCount}`)
            }
          }
        },
        {
          title: '智能报警',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'intelligent')
                      }
                    }
                  },
                  params.row.intelligentCount
                )
              ])
            } else {
              return h('span', `${params.row.intelligentCount}`)
            }
          }
        },
        {
          title: '报警求助',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'alarmHelp')
                      }
                    }
                  },
                  params.row.alarmHelpCount
                )
              ])
            } else {
              return h('span', `${params.row.alarmHelpCount}`)
            }
          }
        },
        {
          title: '消防报警',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'fireAlarm')
                      }
                    }
                  },
                  params.row.fireAlarmCount
                )
              ])
            } else {
              return h('span', `${params.row.fireAlarmCount}`)
            }
          }
        },
        {
          title: '单兵报警',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'individualPolice')
                      }
                    }
                  },
                  params.row.singleCount
                )
              ])
            } else {
              return h('span', `${params.row.singleCount}`)
            }
          }
        },
        {
          title: '系统异常',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true)
                      }
                    }
                  },
                  params.row.systemExceptionCount
                )
              ])
            } else {
              return h('span', `${params.row.systemExceptionCount}`)
            }
          }
        },
        {
          title: '手工报警',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goWarningCount(startTime, endTime, true, 'manualAlarm')
                      }
                    }
                  },
                  params.row.manualAlarmCount
                )
              ])
            } else {
              return h('span', `${params.row.manualAlarmCount}`)
            }
          }
        },
        {
          title: '报警案件',
          key: '',
          render: (h, params) => {
            let startTime = params.row.startTime
            let endTime = params.row.endTime
            if (startTime !== '-' && endTime !== '-') {
              return h('div', [
                h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.goReceiveAlarm(startTime, endTime, true)
                      }
                    }
                  },
                  params.row.receiveAlarmProcessAll
                )
              ])
            } else {
              return h('span', `${params.row.receiveAlarmProcessAll}`)
            }
          }
        },
        {
          title: '详情',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                on: {
                  click: () => {
                    this.details(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
        // {
        //   title: '报警处理（未处理/全部）',
        //   key: 'alarmProcess',
        //   render: (h, params) => {
        //     const that = this
        //     let startTime = params.row.startTime
        //     let endTime = params.row.endTime
        //     if (startTime !== '-' && endTime !== '-') {
        //       return h('div', [
        //         h(
        //           'a',
        //           {
        //             on: {
        //               click:() => {
        //                 this.goWarningCount(startTime, endTime, true)
        //               }
        //             }
        //           },
        //           params.row.alarmProcess
        //         ),
        //         h('span', '/'),
        //         h(
        //           'a',
        //           {
        //             on: {
        //               click:() => {
        //                 this.goWarningCount(startTime, endTime)
        //               }
        //             }
        //           },
        //           params.row.alarmProcessAll
        //         )
        //       ])
        //     } else {
        //       return h('span', `${params.row.alarmProcess}/${params.row.alarmProcessAll}`)
        //     }
        //   }
        // },
        // {
        //   title: '接警任务（未处理/全部）',
        //   key: 'receiveAlarmProcess',
        //   render: (h, params) => {
        //     const that = this
        //     let startTime = params.row.startTime
        //     let endTime = params.row.endTime
        //     if (startTime !== '-' && endTime !== '-') {
        //       return h('div', [
        //         h(
        //           'a',
        //           {
        //             on: {
        //               click() {
        //                 return that.goReceiveAlarm(startTime, endTime, true)
        //               }
        //             }
        //           },
        //           params.row.receiveAlarmProcess
        //         ),
        //         h('span', '/'),
        //         h(
        //           'a',
        //           {
        //             on: {
        //               click() {
        //                 return that.goReceiveAlarm(startTime, endTime)
        //               }
        //             }
        //           },
        //           params.row.receiveAlarmProcessAll
        //         )
        //       ])
        //     } else {
        //       return h('span', `${params.row.receiveAlarmProcess}/${params.row.receiveAlarmProcessAll}`)
        //     }
        //   }
        // },
        // {
        //   title: '值班日志',
        //   key: 'logbook',
        //   render: (h, params) => {
        //     const that = this
        //     let startTime = params.row.startTime
        //     let endTime = params.row.endTime
        //     if (startTime !== '-' && endTime !== '-') {
        //       return h('div', [
        //         h(
        //           'a',
        //           {
        //             on: {
        //               click() {
        //                 return that.goDutyManageLog(startTime, endTime)
        //               }
        //             }
        //           },
        //           params.row.logbook
        //         )
        //       ])
        //     } else {
        //       return h('span', `${params.row.logbook}`)
        //     }
        //   }
        // },
        // {
        //   title: '备注',
        //   minWidth: 100,
        //   ellipsis: true,
        //   key: 'comment',
        //   render: (h, params) => {
        //     return renderWithTitle(h, params.row.comment)
        //   }
        // }
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
    goDutyManageLog(startTime = null, endTime = null) {
      this.$router.push({
        path: '/business/dutyManage/log',
        query: {
          startTime,
          endTime
        }
      })
    },
    goReceiveAlarm(startTime = null, endTime = null, alarmSureFalse = null) {
      this.$router.push({
        path: '/business/caseManagement',
        query: {
          startTime,
          endTime,
          alarmSureFalse
        }
      })
    },
    goWarningCount(startTime = null, endTime = null, alarmSureFalse = null, type = null) {
      this.$router.push({
        path: '/warning/count',
        query: {
          startTime,
          endTime,
          alarmSureFalse,
          type
        }
      })
    },
    details(item) {
      this.Modal = true
      this.formItem = {
        heir: item.beforeName,
        successor: item.afterName,
        time: item.endTime,
        date: item.periodOfTime,
        remark: item.comment
      }
    },
    detailsConfirm() {
      this.Modal = false
    },
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
          this.data = res.data.map(item => {
            return new ShiftInfo(item)
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
  width: 100%;
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
