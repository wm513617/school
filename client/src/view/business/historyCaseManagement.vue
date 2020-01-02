<template>
  <div class="historyCaseManagement">
    <div class="tab-content-alarm" style="text-align:center;width:100%;font-size:12px;height:100%;" ref="tableBox">
      <div class="feature-btn">
        <Input v-model="inEventCode" placeholder="请输入案件名称、报警人、学号" clearable style="width: 200px;"/>
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="startTime" placeholder="请选择开始时间" :editable="false" :clearable="false"></DatePicker>
        <b>至</b>
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="endTime" placeholder="请选择结束时间" :editable="false" :clearable="false"></DatePicker>
        <Button icon="search" class="tabBtn" @click="search">搜索</Button>
        <Button icon="android-download" class="tabBtn" @click="downClick" :disabled="disBtn">下载案件</Button>
        <Button icon="trash-a" class="tabBtn" @click="deletEvent">删除录像</Button>
        <Button icon="archive" class="tabBtn" @click="exportFiles" :disabled="!selEventData.length">导出</Button>
        <span class="memory" :style="memoryColor">录像存储空间： {{ memory.surplus || 0 }}GB / {{ memory.sum || 0 }}GB</span>
      </div>
      <div class="table-relative">
        <div class="table-body">
          <Table size="small" :columns="historyTitle" :data="historyData" :height="tableHeight" @on-selection-change="selectEvent"></Table>
        </div>
      </div>
      <div class="table-footer" style="text-align:right;">
        <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <resultDelModal :openModal="openModal" v-if="openModal" ref="canceChildren" :formData="formData" @cancelModal="cancel"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import resultDelModal from './resultDelModal'
import './business.css'
import {
  deleteVideo,
  getSearchhistory,
  getCaseAlarmDetails,
  getExport
} from '@src/http/business/caseProcessing.api.js'
import { download } from '@src/common/download.js'
import { getMemory } from '@src/http/business/tracking.api'
export default {
  components: {
    resultDelModal
  },
  data() {
    return {
      selEventData: [], // 选中项
      formData: {},
      inEventCode: '',
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      memory: {}, // 空间大小 相关参数
      memoryColor: '', // 空间大小颜色
      tableHeight: 500,
      startTime: '',
      endTime: '',
      historyTitle: [
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '案件编号',
          key: 'eventCode',
          align: 'center',
          minWidth: 100
        },
        {
          title: '案件名称',
          key: 'eventName',
          align: 'center',
          minWidth: 250
        },
        {
          title: '报警人',
          key: 'person',
          align: 'center',
          minWidth: 80
        },
        {
          title: '学号',
          key: 'studentNum',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '联系电话',
          key: 'phone',
          minWidth: 100,
          align: 'center'
        },
        {
          title: '登记时间',
          key: 'alarmTime',
          minWidth: 150,
          align: 'center',
          render: (h, params) => {
            let text = params.row.alarmTime ? this.$moment(params.row.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', text)
          }
        },
        {
          title: '是否调取录像',
          key: 'isRecode',
          minWidth: 80,
          align: 'center',
          render: (h, params) => {
            let name = ''
            if (params.row.isRecode) {
              name = '是'
            } else {
              name = '否'
            }
            return h('span', name)
          }
        },
        {
          title: '录像保存状态',
          key: 'isSave',
          minWidth: 60,
          align: 'center',
          render: (h, params) => {
            let name = ''
            switch (params.row.isSave) {
              case 0:
                name = '未保存'
                break
              case 1:
                name = '保存中'
                break
              case 2:
                name = '保存成功'
                break
              default:
                name = '保存失败'
                break
            }
            return h('span', name)
          }
        },
        {
          title: '详情',
          key: 'config',
          align: 'left',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.historyMessage(params.index, params.row)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      historyData: [],
      openModal: false,
      pageInfo: {
        cur: 1,
        count: 0,
        limit: 25
      },
      disBtn: true // 是否禁用【案件下载】按钮
    }
  },
  computed: {
    ...mapState({ parameters: ({ platform }) => platform.parameters })
  },
  mounted() {
    this.getAlarmHistory()
    this.getMemory()
    // 配置表格高度
    const el = this.$el.querySelector('.table-relative')
    this.tableHeight = el.offsetHeight
  },
  methods: {
    ...mapActions(['getVideoConf']),
    // 获取内存大小
    getMemory() {
      getMemory() // 内存容量接口
        .then(res => {
          this.memory = res.data
          if (res.data.percentage >= '90%') {
            this.memoryColor = 'color:red'
          } else if (res.data.percentage >= '80%') {
            this.memoryColor = 'color:yellow'
          } else {
            this.memoryColor = 'color:lawngreen'
          }
        })
        .catch(err => {
          console.log('获取内存大小失败', err)
        })
    },
    // 搜索
    search() {
      this.getAlarmHistory('搜索')
    },
    // 获取历史数据列表
    getAlarmHistory(v) {
      if (Date.parse(this.startTime) > Date.parse(this.endTime)) {
        this.warningMsg('开始时间不能大于结束时间，请重新选择时间')
        return
      }
      const param = {
        startTime: this.startTime ? Math.floor(Date.parse(this.startTime) / 1000) : '',
        endTime: this.endTime ? Math.floor(Date.parse(this.endTime) / 1000) : '',
        name: this.inEventCode,
        limit: this.pageInfo.limit,
        page: this.pageInfo.cur
        // close: 2
      }
      getSearchhistory(param)
        .then(res => {
          this.historyData = res.data
          this.pageInfo.count = parseFloat(res.headers['x-bsc-count'])
          if (v) {
            this.successMsg(v + '成功')
          }
        })
        .catch(err => {
          console.log(err)
          if (v) {
            this.errorMsg(v + '失败')
          } else {
            this.errorMsg('获取历史列表失败，请刷新重试')
          }
        })
    },
    // 结果详情
    historyMessage(index, value) {
      this.openModal = true
      getCaseAlarmDetails(value._id)
        .then(res => {
          this.formData = res.data
        })
        .catch(err => {
          console.log(err)
          this.noticeErr('结果详情数据获取失败，请稍后尝试')
        })
    },
    // 选择事件
    selectEvent(item) {
      this.selEventData = item
      if (item.length === 1) {
        this.disBtn = false
      } else {
        this.disBtn = true
      }
    },
    // 删除录像
    deletEvent() {
      if (this.selEventData.length) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>是否确认删除该条数据录像</p>',
          onOk: () => {
            let _d = []
            this.selEventData.map(e => {
              _d.push(deleteVideo(e._id))
              // _d.push(deleteVideo(e.eventCode))
            })
            Promise.all(_d)
              .then(res => {
                this.successMsg('删除成功')
                this.getAlarmHistory()
              })
              .catch(err => {
                console.log(err)
                this.errorMsg('删除失败')
                this.getAlarmHistory()
              })
          },
          onCancel: () => {}
        })
      } else {
        this.warningMsg('请选择一个要删除的追踪信息')
      }
    },
    // 弹框显示隐藏
    cancel() {
      this.openModal = false
    },
    // 分页
    pageChange(n) {
      this.pageInfo.cur = n
      this.getAlarmHistory()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getAlarmHistory()
    },
    // 下载案件
    downClick() {
      if (this.disBtn) { return }
      //  下载zip
      getExport(`${this.selEventData[0].eventCode}?type=find`)
        .then(res => {
          if (res.data.code === 200) {
            let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/business/alarm/export/${this.selEventData[0].eventCode}`
            window.open(url)
          } else {
            this.errorMsg('未找到备份文件')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 导出
    exportFiles() {
      if (!this.selEventData.length) { return }
      let _data = []
      this.selEventData.map(e => _data.push(e._id))
      let url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/business/alarm/exportAlarm/zip?alarmEventIds=${_data.join()}`
      let name = `${this.$moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.zip`
      download(url, name, () => {}, () => { this.errorMsg('导出文件下载失败！') })
    }
  }
}
</script>

<style scoped>
.feature-btn Button.tabBtn {
  margin-left: 15px;
}
.historyCaseManagement {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
}
.tab-content-alarm {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}
.panel {
  width: 100%;
  height: 38px;
  line-height: 44px;
  font-size: 14px;
  background-color: #1c3053;
  text-align: left;
  padding: 0 0 0 20px;
  margin-bottom: 16px;
}
.feature-btn {
  margin: 0 24px;
  height: 30px;
  line-height: 30px;
  text-align: left;
}

table {
  border-collapse: collapse;
}

.rank-config .ivu-radio-wrapper {
  font-size: 14px;
}

.ivu-table-tbody .ivu-table-row .ivu-table-cell {
  font-size: 12px;
}

.rank-config {
  width: 100%;
  flex: 0 0 50px;
  line-height: 50px;
  text-align: left;
  padding: 0 0 0 20px;
  font-size: 14px;
  background: #1c3053;
}

.plan-manage {
  flex: 1;
  background-color: #1c3053;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.page-style {
  width: 100%;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px 5px 0;
  background: #244575;
}

table {
  border-collapse: collapse;
}

.ivu-table tbody tr:hover td {
  background-color: #0a111c;
}
.edit-btn {
  color: #57a3f3;
  cursor: pointer;
}

.jdbutton {
  margin-left: 80px;
}
.timespan {
  display: inherit;
}
.businessTimelineStyle {
  position: relative;
  top: -16px;
  left: 75px;
  width: 84%;
  height: 175px;
  overflow: auto;
  padding: 5px 20px;
  border-radius: 4px;
  border: 1px solid #5676a9;
}
.showInputStyle {
  width: 215px;
  margin-right: 14px;
  margin-left: 0px;
  display: inline-block;
}
.showInputStyle .ivu-form-item-content {
  margin-left: 62px;
}
.table-relative {
  position: relative;
  height: calc(100% - 74px);
  margin-top: 12px;
  width: 100%;
}
.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.resultDel {
  padding: 0 30px;
}
.eventsDelLeft {
  float: left;
  width: 40%;
  /* color: #000000;*/
  font-size: 14px;
}
.eventsDelLeft > p {
  padding-top: 15px;
}
.eventsDelLeft > p:last-child {
  padding-bottom: 15px;
}
.eventsDelLeft > p > span:first-child {
  display: inline-block;
  width: 100px;
  /* float: left; */
}
.eventsDelLeft > p > span:last-child {
  display: inline-block;
  width: 200px;
}
.eventsDelRight {
  float: left;
  width: 60%;
  padding-top: 15px;
}
.cameraInfo,
.cameraTime {
  margin-top: 15px;
}
.selectCamera > span:first-child,
.cameraInfo > span:first-child,
.cameraTime > span:first-child {
  display: inline-block;
  width: 100px;
}
.timeLine {
  margin-top: 15px;
}
.timeLine >>> .ivu-timeline-item-tail {
  border-left-color: #5676a9;
}
.memory {
  float: right;
  padding-right: 15px;
  padding-top: 5px;
  font-size: 14px;
}
</style>
