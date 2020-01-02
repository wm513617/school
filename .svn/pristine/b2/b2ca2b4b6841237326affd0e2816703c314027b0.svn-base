<template>
  <div class="warning" style="flex:1;display:flex;height:100%;">
    <div class="bs-content warning-content">
      <div style="background: #1C3053;flex:1;position: relative">
        <div class="content-top">
          <div class="top-cell">
            <div class="top-info">
              <span>机构/位置：</span>
              <p style="position:absolute;z-index:999;left: 118px;top: 18px;">{{formItem.agency}}</p>
              <Select v-model="formItem.agency" style="width:200px" :placeholder="treePlaceholder">
                <v-tree ref='tree' :treeData="treeData" :options="options" @node-click="handleNode" :activeId="agencyId" />
              </Select>
            </div>
            <div class="top-info">
              <span>报警名称：</span>
              <Input v-model="formItem.dispositionvalue" placeholder="请输入..." style="width: 200px" />
            </div>
            <div class="top-info top-info-time">
              <span class="info-time">报警时间：</span>
              <BSdateRange @timeChange="alarmStartTimeChange" :upside='false' :datetime="formItem.startTime" :width='200' :height='32' style="float:left"></BSdateRange>
              <span class="inquire-line">-</span>
              <BSdateRange @timeChange="alarmEndTimeChange" :upside='false' :datetime="formItem.endTime" :width='200' :height='32' style="float:left"></BSdateRange>
            </div>
            <div class="top-info" style="padding-right: 0px">
              <span>报警级别：</span>
              <Select v-model="formItem.level" style="width:200px">
                <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="top-cell">
            <div class="top-info">
              <span>报警类型：</span>
              <template>
                <!-- <Cascader :data="alarmTypeList" :render-format="format" style="width:200px; float:left" v-model="alarmTypeValue"></Cascader> -->
                <Select v-model="formItem.alarmType" style="width:200px" placeholder="请选择">
                  <Option v-for="item in alarmTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </template>
            </div>
            <div class="top-info">
              <span>处理状态：</span>
              <Select v-model="formItem.alarmSure" style="width:200px">
                <Option v-for="item in alarmSureList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="top-info top-info-time">
              <span class="info-time">停止时间：</span>
              <BSdateRange @timeChange="resStartTimeChange" :upside='false' :datetime="formItem.resStartTime" :width='200' :height='32' style="float:left"></BSdateRange>
              <span class="inquire-line">-</span>
              <BSdateRange @timeChange="resEndTimeChange" :upside='false' :datetime="formItem.resEndTime" :width='200' :height='32' style="float:left"></BSdateRange>
            </div>
            <div class="top-info" style="padding-right: 0px">
              <span>警情处理：</span>
              <Select v-model="formItem.alarmDealName" style="width:200px" placeholder="请选择">
                <Option v-for="item in alarmDealSetList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="top-cell">
            <div class="top-info">
              <span>警情类型：</span>
              <Select v-model="formItem.warnType" style="width:200px">
                <Option v-for="item in warnTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="top-info top-info-sure">
              <span class="info-time">确认时间：</span>
              <BSdateRange @timeChange="confirmStartTimeChange" :upside='false' :datetime="formItem.confirmStartTime" :width='200' :height='32' style="float:left" :disable="sureTimeStuates"></BSdateRange>
              <span class="inquire-line">-</span>
              <BSdateRange @timeChange="confirmEndTimeChange" :upside='false' :datetime="formItem.confirmEndTime" :width='200' :height='32' style="float:left" :disable="sureTimeStuates"></BSdateRange>
            </div>
            <div class="top-info inquire-btn">
              <Button type="ghost" @click="inquire" :loading="inquireLoading">查询</Button>
              <Button type="ghost" @click="backUpClick" :disabled="backUpBtn">备份</Button>
              <Button type="ghost" @click="downLoadClick" :disabled="downLoadBtn">下载</Button>
            </div>
          </div>
        </div>
        <div class="main-table" ref="tableBox" v-resize="resizeFun">
          <div class="main-table-content">
              <Table :height="tableHeight" :columns="columnsTitle" :data="countList" size="small" highlight-row @on-row-click="currentClick"></Table>
          </div>
        </div>
        <div class="main-footer">
          <div style="float: right;">
            <Page show-sizer placement='top' :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :show-total="true" :show-elevator="true" :total="totalPage" :page-size="Number(limit)" :current="Number(currentPage)" @on-change="pageChange"></Page>
          </div>
        </div>
        <div v-if="alarmmodal">
          <AlarmDetailModal :alarmmodal="alarmmodal" :warningDetail="warningDetail" @close="alarmmodal = false"></AlarmDetailModal>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import './style/warning.css'
import VTree from '../../components/tree/VTree.vue'
import AlarmDetailModal from './fireAlarmDetailModal.vue'
import alarmTypeData from '../warning/mixinsJs/alarmTypeData.js'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VTree,
    AlarmDetailModal
  },
  mixins: [alarmTypeData],
  data() {
    return {
      startDate: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      tableHeight: 0,
      formItem: {
        // 机构
        agency: '',
        // 源名称
        dispositionvalue: '',
        // 级别
        level: '',
        // 报警类型
        alarmType: 'all',
        // 报警分类
        alarmCategory: '',
        // 报警确认
        alarmSure: 'all',
        // 报警开始时间
        startTime: '', // new Date(new Date().toLocaleDateString()),
        // 报警结束时间
        endTime: '',
        // 通道默认值
        defaultChannel: '',
        // 警情处理
        alarmDealName: '',
        // 警情类型
        warnType: '',
        // 接听/停止开始时间
        resStartTime: '',
        // 接听/停止结束时间
        resEndTime: '',
        // 确认报警开始时间
        confirmStartTime: '',
        // 确认报警结束时间
        confirmEndTime: ''
      },
      // 确认报警弹出框
      alarmmodal: false,
      // 机构
      agencyList: [],
      // agency: '下拉机构树',
      // 级别
      levelList: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '1'
        },
        {
          value: '2',
          label: '2'
        },
        {
          value: '3',
          label: '3'
        },
        {
          value: '4',
          label: '4'
        },
        {
          value: '5',
          label: '5'
        },
        {
          value: '6',
          label: '6'
        },
        {
          value: '7',
          label: '7'
        },
        {
          value: '8',
          label: '8'
        },
        {
          value: '9',
          label: '9'
        }
      ],
      // 报警分类
      alarmCategoryList: [],
      // 报警确认
      alarmSureList: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'unProcess',
          label: '未确认'
        },
        {
          value: 'process',
          label: '已确认'
        },
        {
          value: 'ignore',
          label: '已清除'
        }
      ],
      columnsTitle: [
        {
          type: 'index',
          title: '序号',
          width: 60
        },
        {
          title: '报警名称',
          key: 'name',
          // minWidth: 150,
          render: (h, params) => {
            let name = params.row.name
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: name
                }
              },
              name
            )
          }
        },
        {
          title: '报警时间',
          key: 'time',
          width: 160
        },
        {
          title: '停止时间',
          key: 'endTime',
          // key: 'answerTime',
          width: 160
        },
        {
          title: '机构/位置',
          key: 'orgName',
          render: (h, params) => {
            let address = params.row.orgName || '无'
            return h('div', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: address
              }
            }, address)
          }
        },
        {
          title: '报警源',
          key: 'srcName',
          render: (h, params) => {
            let name = params.row.srcName
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: name
                }
              },
              name
            )
          }
          // width: 100
        },
        {
          title: '报警分类',
          key: 'eventType'
        },
        {
          title: '报警类型',
          key: 'subtype'
          // width: 200,
          // render: (h, params) => {
          //   let alarmType = params.row.subtype ? this.allAlarmType[params.row.subtype] : '无'
          //   // this.warningDetail.typevalue = alarmType
          //   return h('span', {}, alarmType)
          // }
        },
        {
          title: '报警级别',
          key: 'level',
          width: 90
        },
        {
          title: '处理情况',
          key: 'dealState',
          width: 90
        },
        {
          title: '确认时间',
          key: 'ackTime',
          // key: 'other',
          width: 160
        },
        {
          title: '警情处理',
          key: 'alarmDeal'
          // width: 200
        },
        {
          title: '警情类型',
          key: 'situationType'
          // width: 200
        },
        {
          title: '警情信息',
          key: 'alertInfo'
          // width: 200
        },
        {
          title: '操作',
          key: 'operat',
          // width: 250,
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
                    this.show(params.row)
                  }
                }
              }, '查看详情')
            ])
          }
        }
      ],
      countList: [],
      showtimeList: [],
      listLength: '',
      options: {
        showFolder: true
      },
      treeData: [], // 机构树
      agencyId: '',
      alarmTypeValue: [],
      alarmTypeList: [
        { value: 'all', label: '全部' },
        { value: 'smoke', label: '感烟' },
        { value: 'temperature', label: '感温' },
        { value: 'hydrant', label: '消防栓' },
        { value: 'handNewspaper', label: '手报' }
      ],
      // 分页
      totalPage: 0,
      currentPage: 1,
      limit: this.$PageInfo.limit,
      startTimestamp: '', // 开始时间时间戳
      endTimestamp: '', // 结束时间时间戳
      sureStartTime: '', // 确认开始时间时间戳
      sureEndTime: '', // 确认结束结束时间戳
      stopStartTime: '', // 接听/停止开始时间戳
      stopEndTime: '', // 接听/停止结束时间戳
      setLevel: '', // 等级
      // 详细信息
      warningDetail: {},
      orgId: '',
      inquireLoading: false,
      devId: '',
      haha: '1',
      alarmTypemeth: '',
      isShowBigImg: false,
      alarmDealSetList: [], // 警情处理列表
      warnTypeList: [], // 警情类型列表
      warnPlanList: [],
      warnDealSetList: [],
      warnTypeSetList: [],
      eventType: '',
      treePlaceholder: '请选择...',
      sureTimeStuates: true, // 确认时间框状态
      inquireType: '',
      inquireInfo: {
        smoke: 'smoke',
        temperature: 'temperature',
        hydrant: 'hydrant',
        handNewspaper: 'handNewspaper',
        helpSeek: 'helpSeek',
        perimeterAlarm: 'perimeterAlarm',
        intrusionAlarm: 'intrusionAlarm',
        electricFence: 'electricFence'
      },
      currentRow: '',
      backUpBtn: false, // 备份按钮
      downLoadBtn: false // 下载按钮
    }
  },
  methods: {
    ...mapMutations(['WARNING_LIST', 'SET_WARNINGORGTREE_DATA', 'GET_WARNIN_DATA', 'GET_TYPE_DATA']),
    ...mapActions(['getWarningOrgTree', 'getWarningNews', 'getSortData', 'getWarningTypeTree', 'confirmWarning', 'getAlarmHostPowers', 'getAlarmDealSetList', 'getPrearranged', 'putBackupAlarmInfo', 'downloadInfo']),
    resizeFun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
    },
    // 报警开始时间
    alarmStartTimeChange(val) {
      this.formItem.startTime = val.date
      if (this.formItem.startTime > this.formItem.endTime) {
        this.formItem.endTime = this.formItem.startTime
      }
    },
    alarmEndTimeChange(val) {
      this.formItem.endTime = val.date
      if (this.formItem.startTime > this.formItem.endTime) {
        this.formItem.startTime = this.formItem.endTime
      }
    },
    // 报警/接听时间
    resStartTimeChange(val) {
      this.formItem.resStartTime = val.date
      if (this.formItem.resStartTime > this.formItem.resEndTime) {
        this.formItem.resEndTime = this.formItem.resStartTime
      }
    },
    resEndTimeChange(val) {
      this.formItem.resEndTime = val.date
      if (this.formItem.resStartTime > this.formItem.resEndTime) {
        this.formItem.resStartTime = this.formItem.resEndTime
      }
    },
    // 确认时间：
    confirmStartTimeChange(val) {
      this.formItem.confirmStartTime = val.date
      if (this.formItem.confirmStartTime > this.formItem.confirmEndTime) {
        this.formItem.confirmEndTime = this.formItem.confirmStartTime
      }
    },
    confirmEndTimeChange(val) {
      this.formItem.confirmEndTime = val.date
      if (this.formItem.confirmStartTime > this.formItem.confirmEndTime) {
        this.formItem.confirmStartTime = this.formItem.confirmEndTime
      }
    },
    format(labels, selectedData) {
      const index = labels.length - 1
      const data = selectedData[index] || false
      if (data && data.code) {
        return labels[index] + ' - ' + data.code
      }
      return labels[index]
    },
    // 机构树
    handleNode(node, mark) {
      this.formItem.agency = node.name
      this.treeData.forEach((item, index) => {
        if (node._id === item._id) {
          this.agencyId = ''
        } else {
          this.agencyId = node._id
        }
      })
      if (this.formItem.agency) {
        this.treePlaceholder = ''
      }
    },
    // 查看详情按钮
    show(row) {
      if (row.eventType === '违章报警') {
        row.carType = row.carType ? this.carTypes[row.carType] : ''
        row.carDirect = row.carDirect ? this.carDirect[row.carDirect] : ''
      }
      if (row.eventType === '人像布控') {
        row.gender = row.gender === 1 ? '女' : row.gender === 2 ? '男' : ''
      }
      this.warningDetail = JSON.parse(JSON.stringify(row))
      this.alarmmodal = true
    },
    showBigImg() {
      this.isShowBigImg = true
    },
    pageChange(page) {
      this.currentPage = page
      this.haha = '0'
      this.getTableData()
    },
    pageSizeChange(n) {
      this.limit = n
      this.getTableData()
    },
    // 查询
    inquire() {
      this.haha = '1'
      this.inquireLoading = true
      this.getTableData()
    },
    getTableData() {
      console.log('-------报警类型', this.formItem.alarmType)
      // 时间转换
      this.startTimestamp = Date.parse(new Date(this.formItem.startTime)) / 1000
      this.endTimestamp = Date.parse(new Date(this.formItem.endTime)) / 1000
      this.sureStartTime = Date.parse(new Date(this.formItem.confirmStartTime)) / 1000
      this.sureEndTime = Date.parse(new Date(this.formItem.confirmEndTime)) / 1000
      this.stopStartTime = Date.parse(new Date(this.formItem.resStartTime)) / 1000
      this.stopEndTime = Date.parse(new Date(this.formItem.resEndTime)) / 1000
      if (!this.sureTimeStuates && this.formItem.confirmStartTime === '' && this.formItem.confirmEndTime === '') {
        this.inquireLoading = false
        this.$Notice.warning({
          title: '失败',
          desc: '时间不能为空！',
          duration: 2,
          top: 200
        })
      } else {
        if (this.formItem.level === '') {
          this.setLevel = 0
        } else {
          this.setLevel = this.formItem.level
        }
        if (this.haha === '1') {
          this.currentPage = 1
        }
        if (this.formItem.alarmType === 'all') {
          this.alarmTypeMeth = 'smoke' + ',' + 'temperature' + ',' + 'hydrant' + ',' + 'handNewspaper'
        } else if (this.formItem.alarmType === 'smoke' || this.formItem.alarmType === 'temperature' || this.formItem.alarmType === 'hydrant' || this.formItem.alarmType === 'handNewspaper') {
          this.alarmTypeMeth = this.formItem.alarmType
          this.inquireType = 'fire'
        }
        const payload = {
          // 机构
          orgId: this.agencyId,
          // 源名称
          srcName: this.formItem.dispositionvalue,
          // 级别
          level: this.setLevel * 1,
          // 报警类型
          alarmType: this.alarmTypeMeth,
          // 报警分类
          alarmClassifyId: this.formItem.alarmCategory === 'all' ? '' : this.formItem.alarmCategory,
          // 报警确认
          // deal: this.formItem.alarmSure,
          dealState: this.formItem.alarmSure === 'all' ? '' : this.formItem.alarmSure,
          // 开始时间
          beginTime: this.startTimestamp * 1,
          // 结束时间
          endTime: this.endTimestamp * 1,
          // 一页多少条
          limit: this.limit,
          // 当前请求第几页
          page: this.currentPage,
          // 警情处理
          alarmDeal: this.formItem.alarmDealName === 'all' ? '' : this.formItem.alarmDealName,
          // 警情类型
          situationType: this.formItem.warnType === 'all' ? '' : this.formItem.warnType,
          type: 'fire'
        }
        // 报警确认开始时间和确认结束时间
        if (this.sureStartTime && this.sureEndTime) {
          payload.confirmStartTime = this.sureStartTime
          payload.confirmEndTime = this.sureEndTime
        }
        // 报警接听/停止时间
        if (this.stopStartTime && this.stopEndTime) {
          payload.responsStartTime = this.stopStartTime
          payload.responsEndTime = this.stopEndTime
        }
        this.getWarningNews(payload).then(res => {
          this.inquireLoading = false
          let arryData = []
          arryData = JSON.parse(JSON.stringify(res.data))
          arryData.forEach((item, index) => {
            let alarmContent
            if (item.ackContent && item.ackContent !== 'auto_ack') {
              alarmContent = JSON.parse(item.ackContent)
            }
            item.alarmDeal = alarmContent ? alarmContent.alarmDeal : ''
            item.situationType = alarmContent ? alarmContent.situationType : ''
            item.alertInfo = alarmContent ? alarmContent.alarmContent : ''
            item.time = this.$moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
            item.ackTime = item.ackTime ? this.$moment(item.ackTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            item.endTime = item.endTime ? this.$moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            if (item.eventType === 'manualAlarm') {
              item.name = item.srcName
            }
            if (item.dealState === 'ignore') {
              item.dealState = '已清除'
            } else if (item.dealState === 'process') {
              item.dealState = '已确认'
            } else {
              item.dealState = '未确认'
            }
            if (item.eventType === 'patrolAlarm' || item.eventType === 'individualAlarm') {
              item.realName = item.message.realname || item.message.sender
              item.position = item.message.position ? item.message.position : ''
              item.phone = item.message.phone ? item.message.phone : ''
              item.charger = item.message.charger ? item.message.charger : ''
              item.content = item.message.content ? item.message.content : ''
            }
            if (item.subtype && item.eventType) {
              item.eventType = this.alarmSort[item.eventType]
              item.subtype = this.allAlarmType[item.subtype]
            } else if (!item.subtype && item.eventType && item.eventType !== 'focusAttention') {
              item.subtype = this.allAlarmType[item.eventType]
              item.eventType = this.alarmSort[item.eventType]
            } else if (!item.subtype && item.eventType && item.eventType === 'focusAttention') {
              item.subtype = item.attentionType ? item.attentionType : ''
              item.eventType = this.alarmSort[item.eventType]
            } else if (item.subtype && !item.eventType) {
              this.inquireType = 'fire'
              item.eventType = this.alarmSort[item.subtype]
              item.subtype = this.allAlarmType[item.subtype]
            }
          })
          this.countList = arryData
          this.haha = '1'
          this.inquireType = ''
          // this.totalPage = this.waringPage.total
          this.totalPage = Number(res.headers['x-bsc-count'])
        }).catch(err => {
          this.inquireLoading = false
          console.log('inquire error: ' + err)
        })
      }
    },
    currentClick(now, old) {
      this.currentRow = now._id
    },
    // 备份
    backUpClick() {
      if (this.countList.length) {
        if (this.currentRow) {
          this.$Modal.confirm({
            title: '警告',
            content: '<p>确认备份该条报警信息吗?</p>',
            onOk: () => {
              this.backUpBtn = true
              this.downLoadBtn = true
              this.backUpClickInfo()
            }
          })
        } else {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择一条报警信息',
            duration: 2,
            top: 200
          })
        }
      }
    },
    backUpClickInfo() {
      this.putBackupAlarmInfo({ id: this.currentRow }).then(res => {
        this.backUpBtn = false
        this.downLoadBtn = false
        if (res.data !== 'OK') {
          this.$Notice.warning({
            title: '提示',
            desc: '该条报警已备份',
            duration: 2,
            top: 200
          })
        } else {
          this.$Notice.success({
            title: '提示',
            desc: '备份成功',
            duration: 2,
            top: 200
          })
        }
      }).catch((err) => {
        console.log('putBackupAlarmInfo error: ', err)
        this.backUpBtn = false
        this.downLoadBtn = false
      })
    },
    // 下载
    downLoadClick() {
      if (this.countList.length) {
        if (this.currentRow) {
          this.$Modal.confirm({
            title: '警告',
            content: '<p>确认下载该条报警信息吗?</p>',
            onOk: () => {
              this.backUpBtn = true
              this.downLoadBtn = true
              this.downLoadClickInfo()
            }
          })
        } else {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择一条报警信息',
            duration: 2,
            top: 200
          })
        }
      }
    },
    downLoadClickInfo() {
      let iframe = document.getElementsByTagName('iframe').length
      let link
      if (iframe) {
        link = document.getElementsByTagName('iframe')[0]
      } else {
        link = document.createElement('iframe')
      }
      link.src = window.location.origin + `/api/warning/query/download/` + this.currentRow
      link.style.display = 'none'
      document.body.appendChild(link)
      this.backUpBtn = false
      this.downLoadBtn = false
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
  },
  computed: {
    ...mapState({
      historyList: ({ warningCount }) => warningCount.historyList,
      warningOrgTreeData: ({ warningCount }) => warningCount.warningOrgTreeData,
      warningTypeTreeData: ({ warningCount }) => warningCount.warningTypeTreeData,
      partentAlarmName: ({ warningCount }) => warningCount.partentAlarmName,
      allAlarmType: ({ warningCount }) => warningCount.allAlarmType,
      alarmData: ({ warningCount }) => warningCount.alarmData
    }),
    ...mapGetters(['enabledSort', 'getInquireData', 'carTypes', 'carDirect'])
  },
  created() {
    if (this.$route.query.alarmSureFalse) {
      this.formItem.alarmSure = 'false'
    }
    if (this.$route.query.type) {
      let con = this.$route.query.type
      if (con === 'alarmHelp' || con === 'manualAlarm') {
        this.alarmTypeValue.push(con)
      } else {
        this.alarmTypeValue.push(con)
        this.alarmTypeValue.push(con)
      }
    }
    if (this.$route.query.endTime) {
      this.formItem.endTime = new Date(decodeURIComponent(this.$route.query.endTime))
    } else {
      this.formItem.endTime = new Date()
    }
    if (this.$route.query.startTime) {
      this.formItem.startTime = new Date(decodeURIComponent(this.$route.query.startTime))
      setTimeout(() => {
        this.inquire()
      }, 0)
    } else {
      this.formItem.startTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    }
    this.formItem.resStartTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    this.formItem.resEndTime = new Date()
    // this.formItem.confirmStartTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    // this.formItem.confirmEndTime = new Date()
    this.formItem.level = this.levelList[0].value
    this.getSortData().then(resp => {
      let typeList = JSON.parse(JSON.stringify(this.enabledSort))
      typeList.unshift({ value: 'all', label: '全部' })
      this.alarmCategoryList = JSON.parse(JSON.stringify(typeList))
      this.formItem.alarmCategory = this.alarmCategoryList[0].value
    }).catch(err => {
      console.log('getSortData error: ' + err)
    })
    if (!this.alarmTypeValue[0]) {
      this.alarmTypeValue.push('all')
    }
    this.getWarningOrgTree(this.orgType).then(() => {
      this.treeData = JSON.parse(JSON.stringify(this.warningOrgTreeData))
    }).catch(err => {
      console.log('getWarningOrgTree error: ' + err)
    })
    // 获取警情处理列表
    this.getAlarmDealSetList({ page: 1, limit: 100 }).then((res) => {
      res.data.forEach(item => {
        this.alarmDealSetList.push({ label: item.name, value: item.name })
        this.warnDealSetList.push({ label: item.name, value: item.name })
      })
      this.alarmDealSetList.unshift({ value: 'all', label: '全部' })
      this.formItem.alarmDealName = this.alarmDealSetList[0].value
    }).catch(err => {
      console.log('getFireAlarmDealList error: ', err)
      this.errorMsg('警情处理列表获取失败')
    })
    // 获取警情确认列表
    this.getPrearranged({ page: 1, limit: 100 }).then((res) => {
      this.warnPlanList = JSON.parse(JSON.stringify(res.data))
      res.data.forEach(item => {
        this.warnTypeList.push({ label: item.name, value: item.name })
        this.warnTypeSetList.push({ label: item.name, value: item.name })
      })
      this.warnTypeList.unshift({ value: 'all', label: '全部' })
      this.formItem.warnType = this.warnTypeList[0].value
    }).catch(err => {
      console.log('getPrearranged error: ', err)
      this.errorMsg('警情确认列表获取失败')
    })
  },
  watch: {
    'formItem.alarmSure': {
      deep: true,
      handler(newValue) {
        if (newValue === 'process') {
          this.sureTimeStuates = false
          this.formItem.confirmStartTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
          this.formItem.confirmEndTime = new Date()
        } else {
          this.sureTimeStuates = true
          this.formItem.confirmStartTime = ''
          this.formItem.confirmEndTime = ''
          this.sureStartTime = ''
          this.sureEndTime = ''
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bgColor {
  background-color: #ddd;
}

.warning .warning-content {
  padding: 16px 0;
  overflow: hidden;
}

i {
  font-style: normal;
}

b {
  font-weight: normal;
}

.top ul li,
.playback ul li {
  display: block;
  overflow: hidden;
  list-style-type: none;
  margin: 10px 0;
}

.top ul li p {
  float: left;
  margin-right: 70px;
  margin-bottom: 10px;
}

.page-style {
  width: 100%;
  height: 40px;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px;
  background: #244575;
  overflow: inherit;
}

.top ul li p b {
  float: left;
  width: 120px;
  color: #fff;
}

.inquire {
  margin: 0 0 12px 110px;
}

.inquire button {
  margin-left: 10px;
  height: 30px;
  padding: 0 40px !important;
}
.modalMessage {
  min-width: 100%;
  line-height: 100%;
  padding: 0 10px;
  height: 636px;
}
.overFlowStyle {
  overflow: auto;
}
.modalMessage .left>ul li {
  margin-bottom: 10px;
}

.modalMessage i {
  float: left;
  width: 60px;
  margin-right: 20px;
}

.left ul li p {
  width: 100%;
  padding-left: 60px;
}

.showtime {
  height: 100px;
  width: 260px;
  border: 1px solid #5d5d5d;
}

.showtime p {
  padding: 5px 10px;
}

.imageBox {
  width: 100%;
  height: 100%;
}

.imageBox > .images {
  width: 100%;
  height: calc(100% - 1px);
  overflow: auto;
}

.yesmessage {
  width: 340px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.yesmessage b {
  float: left;
  width: 60px;
  margin-right: 20px;
}

.video {
  width: 400px;
  height: 300px;
  margin-bottom: 10px;
  border: 1px solid #5d5d5d;
  position: absolute;
  left: 24px;
}
.novideo {
  width: 400px;
  height: 300px;
  margin-bottom: 10px;
  border: 1px solid #5d5d5d;
  line-height: 300px;
  text-align: center;
  position: absolute;
  left: 24px;
}

.imgArea {
  width: 400px;
  height: 300px;
  border: 1px solid #5d5d5d;
  line-height: 300px;
  display: inline-block;
  margin: 30px -10px 0;
}
.btn {
  text-align: center;
  margin-top: 15px;
}

.btn button {
  margin-left: 30px;
}

.ivu-input-number {
  font-size: 12px;
  position: absolute;
  right: 55px !important;
  top: 50%;
  margin-top: -6px;
}

.ivu-cascader-menu:last-child {
  border-right-color: transparent;
  margin-right: -1px;
  width: 150px !important;
}

.colStyle {
  padding: 0 40px;
}
.table-query-list {
  position: absolute;
  top: 166px;
  height: calc(100% - 166px);
}
.bigImg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.3, 0.3);
  opacity: 1;
  z-index: 1001;
}
.big-img-mask {
  background: #000813;
  opacity: 0.7;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.big-img-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.content-top {
  padding: 0 20px 20px
}
.content-table {
  position: relative;
}
.table-box {
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0px;
}
.top-cell {
  width: 100%;
  display: flex;
  padding: 6px 0;
  // justify-content: space-around
}
.top-cell .top-info {
  padding: 10px 0px 0px 10px;
  position: relative;
  width: 22%;
}
.top-cell .top-info-time {
  width: 35%
}
.top-cell .top-info-sure {
  width: 36%;
  padding: 10px 0 0 8px;
}
.top-cell .top-info span {
  float: left;
  width: 100px;
  height: 32px;
  line-height: 32px;
}
.top-cell .top-info .inquire-line {
  width: 20px;
  text-align: center;
}
.info-time {
  float: left;
}
.main-table {
  // flex: 1;
  // display: flex;
  height: calc(~'100% - 224px');
  width: 100%;
}
.main-table-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
}
.main-footer {
  padding: 3px 10px;
  background-color: #244575;
  border: none;
  height: 40px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.inquire-btn button {
  width: 100px;
}
</style>
