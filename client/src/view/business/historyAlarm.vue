<template>
  <div class="historyAlarm" id="historyAlarm">
    <div class="tab-content-alarm" style="text-align:center;width:100%;font-size:12px;height:100%;" ref="tableBox">
      <div class="feature-btn">
        <Input v-model="inSearchName" placeholder="请输入事件名称、报警人" style="width: 200px;" />
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="startTime" :editable="false" :clearable="false"></DatePicker>
        <b>至</b>
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="endTime" :editable="false" :clearable="false"></DatePicker>
        <Select v-model="stateListValue" style="width: 200px">
          <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="ghost" icon="search" @click="search">搜索</Button>
      </div>
      <div class="table-relative flex-1" style="margin-top:12px;">
        <div class="table-body">
          <Table size="small" :columns="historyTitle" :data="historyData" :height="tableHeight"></Table>
        </div>
      </div>
      <div class="table-footer" style="text-align:right;">
        <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <div v-if="openModal">
      <Modal v-model="openModal" title="事件详情" width='550' :mask-closable="false">
        <Form label-position="left" :label-width="62" :model="historyModal" ref="historyModal" style="padding: 0 20px;">
          <Form-item label="事件编号" class="showInputStyle">
            <Input v-model="historyModal.eventCode" disabled/>
          </Form-item>
          <Form-item label="事件名称" class="showInputStyle">
            <Input v-model="historyModal.eventName" disabled/>
          </Form-item>
          <Form-item label="报警人" class="showInputStyle">
            <Input v-model="historyModal.person" disabled/>
          </Form-item>
          <Form-item label="联系方式" class="showInputStyle">
            <Input v-model="historyModal.phone" disabled/>
          </Form-item>
          <Form-item label="报警时间" class="showInputStyle">
            <Input v-model="historyModal.alarmTime" disabled/>
          </Form-item>
          <Form-item label="事件来源" class="showInputStyle">
            <Input v-model="historyModal.source" disabled/>
          </Form-item>
          <Form-item label="记录人" class="showInputStyle">
            <Input v-model="historyModal.recordPerson" disabled/>
          </Form-item>
          <Form-item label="联系方式" class="showInputStyle">
            <Input v-model="historyModal.phone" disabled/>
          </Form-item>
          <Form-item label="事件描述">
            <Input type="textarea" v-model="historyModal.description" disabled/>
          </Form-item>
          <Form-item label="是否解决">
            <Radio-group v-model="state">
              <Radio label="1" disabled>已解决</Radio>
              <Radio label="2" disabled>未解决</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="是否关闭">
            <Radio-group v-model="close">
              <Radio label="1" disabled>关闭</Radio>
              <Radio label="2" disabled>不关闭</Radio>
            </Radio-group>
          </Form-item>
          <div>
            <p>解决记录</p>
            <div style="width: 100%;height: 50px;text-align:center;line-height:50px;border:1px solid #aaa;" v-if="historyModal.detail && historyModal.detail.length===0">暂无记录</div>
            <Timeline class="businessTimelineStyle">
              <TimelineItem v-for="(item,index) in historyModal.detail" :key="index">
                <span class="timespan" v-if="item.handleTime">时间：{{$moment(parseInt(item.handleTime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
                <span class="timespan" v-if="item.person">处理人：{{item.person}}</span>
                <span class="timespan" v-if="item.phone">联系电话：{{item.phone}}</span>
                <span class="timespan" v-if="item.detail && item.handleTime">处理详情：{{item.detail}}</span>
              </TimelineItem>
            </Timeline>
          </div>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="cancel">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import './business.css'
export default {
  components: {},
  mixins: [],
  data() {
    return {
      inSearchName: '',
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      tableHeight: 500,
      startTime: '',
      endTime: new Date(),
      stateListValue: 0,
      stateList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '已解决',
          value: 1
        },
        {
          label: '未解决',
          value: 2
        }
      ],
      historyTitle: [
        {
          type: 'index',
          width: 60,
          align: 'left'
        },
        {
          title: '事件编号',
          key: 'eventCode',
          align: 'left',
          minWidth: 100
        },
        {
          title: '事件名称',
          key: 'eventName',
          align: 'left',
          minWidth: 150,
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
                  title: params.row.eventName
                }
              },
              params.row.eventName
            )
          }
        },
        {
          title: '报警人',
          key: 'person',
          minWidth: 150,
          align: 'left'
        },
        {
          title: '联系方式',
          key: 'phone',
          minWidth: 150,
          align: 'left'
        },
        {
          title: '报警时间',
          key: 'alarmTime',
          minWidth: 150,
          align: 'left',
          render: (h, params) => {
            var text = params.row.alarmTime
              ? this.$moment(parseInt(params.row.alarmTime) * 1000).format('YYYY-MM-DD HH:mm:ss')
              : ''
            return h('span', text)
          }
        },
        {
          title: '是否解决',
          key: 'state',
          minWidth: 150,
          align: 'left',
          render: (h, params) => {
            var name = ''
            if (params.row.state === 1) {
              name = '已解决'
            } else if (params.row.state === 2) {
              name = '未解决'
            } else {
              name = ''
            }
            return h('span', name)
          }
        },
        {
          title: '是否关闭',
          key: 'close',
          minWidth: 250,
          align: 'left',
          render: (h, params) => {
            var name = ''
            if (params.row.close) {
              name = '已关闭'
            } else {
              name = '未关闭'
            }
            return h('span', name)
          }
        },
        {
          title: '详情',
          key: 'config',
          minWidth: 250,
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
      state: '1',
      close: '1',
      historyModal: {
        id: '',
        eventCode: '',
        eventName: '',
        person: '',
        phone: '',
        alarmTime: '',
        description: '',
        recordPerson: '',
        source: '',
        handleTime: '',
        detail: [],
        state: '1',
        close: true
      },
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      }
    }
  },
  computed: {
    ...mapState({
      historyDataStore: ({ businessAlarm }) => businessAlarm.historyDataStore
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 90
  },
  methods: {
    ...mapActions(['getHistoryData', 'recordLog']),
    getTableData() {
      if (this.startTime !== '' && this.endTime !== '') {
        var startTimeData = Date.parse(new Date(this.startTime)) / 1000
        var endTimeData = Date.parse(new Date(this.endTime)) / 1000
        if (startTimeData === endTimeData) {
          this.errorMsg('开始时间与结束时间不能相等')
        } else if (startTimeData >= endTimeData) {
          this.errorMsg('开始时间不能大于结束时间')
        }
      } else if (this.endTime === '') {
        this.errorMsg('结束时间不能为空')
        return
      } else {
        startTimeData = ''
        endTimeData = Date.parse(new Date()) / 1000
      }
      this.getHistoryData({
        name: this.inSearchName,
        startTime: startTimeData,
        endTime: endTimeData,
        state: this.stateListValue,
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit
      })
        .then(res => {
          this.historyData = this.historyDataStore
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
        })
        .catch(() => {
          console.log('获取历史记录失败')
        })
    },
    search() {
      this.getTableData()
    },
    historyMessage(index, value) {
      this.historyModal.detail = []
      this.historyModal = value === {} ? this.historyModal : value
      if (value.createTime) {
        this.historyModal.detail = value.detail
        this.historyModal.detail.unshift({ handleTime: value.createTime, detail: '创建事件' })
      }
      if (value.closeTime) {
        this.historyModal.detail = value.detail
        this.historyModal.detail.push({ handleTime: value.closeTime, detail: '关闭事件' })
      }
      this.historyModal.alarmTime = this.$moment(parseInt(value.alarmTime) * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.historyModal.source = value.source === '0' ? '电话记录' : '现场记录'
      this.state = this.historyModal.state === 1 ? '1' : '2'
      this.close = this.historyModal.close === true ? '1' : '2'
      this.openModal = true
    },
    cancel() {
      this.openModal = false
    },
    pageChange(n) {
      this.pageInfo.cur = n
      this.getTableData()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getTableData()
    }
  },
  watch: {},
  created() {
    this.getTableData()
  }
}
</script>

<style  scoped>
.historyAlarm {
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

.feature-btn > button {
  margin-left: 24px;
  width: 70px;
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
  /* height: 650px; */
  margin: 0px;
  width: 100%;
}
.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
