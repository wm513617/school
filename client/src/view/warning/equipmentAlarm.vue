<template>
  <div class="warning" style="flex:1;display:flex;height:100%;">
    <div class="bs-content warning-content">
      <div style="background: #1C3053;flex:1;position: relative">
        <div class="content-top">
          <div class="top-cell">
            <div class="top-info">
              <span>报警名称：</span>
              <Input v-model="formItem.dispositionvalue" placeholder="请输入..." style="width: 180px" />
            </div>
            <div class="top-info">
              <span>设备类型：</span>
              <Select v-model="formItem.devType" style="width:180px">
                <Option v-for="item in devTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="top-info">
              <span class="info-time">报警时间：</span>
              <BSdateRange @timeChange="alarmStartTimeChange" :upside='false' :datetime="formItem.startTime" :width='200' :height='32' style="float:left"></BSdateRange>
              <span class="inquire-line">-</span>
              <BSdateRange @timeChange="alarmEndTimeChange" :upside='false' :datetime="formItem.endTime" :width='200' :height='32' style="float:left"></BSdateRange>
            </div>
            <div class="top-info">
              <span>机构/位置：</span>
              <p style="position:absolute;z-index:999;left: 90px;top: 18px;">{{formItem.agency}}</p>
              <Select v-model="formItem.agency" style="width:180px" :placeholder="agencyDefault">
                <v-tree ref='tree' :treeData="treeData" :options="options" @node-click="handleNode" :activeId="agencyId" />
              </Select>
            </div>
            <div class="top-info">
              <span>报警级别：</span>
              <Select v-model="formItem.level" style="width:140px">
                <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="top-info inquire-btn">
              <Button type="ghost" @click="inquire" :loading="inquireLoading">查询</Button>
            </div>
          </div>
        </div>
        <div class="main-table" ref="tableBox" v-resize="resizeFun">
          <div class="main-table-content">
              <Table :height="tableHeight" :columns="columnsTitle" :data="countList" size="small" :highlight-row="true"></Table>
          </div>
        </div>
        <div class="main-footer">
          <div style="float: right;">
            <Page show-sizer placement='top' :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :show-total="true" :show-elevator="true" :total="totalPage" :page-size="Number(limit)" :current="Number(currentPage)" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import './style/warning.css'
import VTree from '../../components/tree/VTree.vue'
import alarmTypeData from './mixinsJs/alarmTypeData.js'
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    VTree
  },
  mixins: [alarmTypeData],
  data() {
    return {
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      tableHeight: 0,
      formItem: {
        // 机构
        agency: '',
        // 报警名称
        dispositionvalue: '',
        // 级别
        level: '',
        // 设备类型
        devType: 'all',
        // 报警开始时间
        startTime: '', // new Date(new Date().toLocaleDateString()),
        // 报警结束时间
        endTime: ''
      },
      // 查询筛选弹出框
      inquireModal: false,
      // 级别
      levelList: [
        {value: '0', label: '全部'},
        {value: '1', label: '1'},
        {value: '2', label: '2'},
        {value: '3', label: '3'},
        {value: '4', label: '4'},
        {value: '5', label: '5'},
        {value: '6', label: '6'},
        {value: '7', label: '7'},
        {value: '8', label: '8'},
        {value: '9', label: '9'}
      ],
      // 报警确认
      devTypeList: [
        {value: 'all', label: '全部'},
        {value: 'devVideo', label: '视频设备'},
        {value: 'alarmHost', label: '报警主机'},
        {value: 'decoder', label: '解码器'}
      ],
      columnsTitle: [
        {
          type: 'index',
          title: '序号',
          width: 200
        },
        {
          title: '报警类型',
          key: 'subtype',
          width: 200,
          render: (h, params) => {
            let alarmType = params.row.subtype ? this.allAlarmType[params.row.subtype] : '无'
            // this.warningDetail.typevalue = alarmType
            return h('span', {}, alarmType)
          }
        },
        {
          title: '报警时间',
          key: 'time',
          width: 300,
          render: (h, params) => {
            let time = this.$moment(params.row.time * 1000).format('YYYY-MM-DD HH:mm:ss')
            return h('div', {}, time)
          }
        },
        {
          title: '报警源',
          key: 'srcName',
          width: 300,
          render: (h, params) => {
            let name = params.row.srcName || '无'
            return h('div', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: name
              }
            }, name)
          }
        },
        {
          title: '机构',
          key: 'orgName',
          width: 300
        },
        {
          title: '设备类型',
          key: 'type',
          width: 300,
          render: (h, params) => {
            let alarmType = this.equipmentSort[params.row.subtype]
            return h('span', {}, alarmType)
          }
        },
        {
          title: '报警级别',
          key: 'level'
          // width: 200
        }
      ],
      countList: [],
      showtimeList: [],
      listLength: '',
      options: {
        showFolder: true
      },
      inquireLoading: false,
      treeData: [], // 机构树
      agencyId: '',
      // 分页
      totalPage: 0,
      currentPage: 1,
      limit: this.$PageInfo.limit,
      startTimestamp: '', // 开始时间时间戳
      endTimestamp: '', // 结束时间时间戳
      setLevel: '', // 等级
      agencyDefault: '请选择',
      alarmTypeMeth: ''
    }
  },
  watch: {
    'formItem.agency': {
      handler(newValue) {
        if (newValue) {
          this.agencyDefault = ''
        }
      }
    }
  },
  methods: {
    ...mapMutations([]),
    ...mapActions(['getWarningOrgTree', 'getWarningNews']),
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
      // this.agencyId = node._id
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
      // 时间转换
      this.startTimestamp = Date.parse(new Date(this.formItem.startTime)) / 1000
      this.endTimestamp = Date.parse(new Date(this.formItem.endTime)) / 1000
      if (this.formItem.endTime !== '' && this.formItem.startTime !== '') {
        if (this.startTimestamp === this.endTimestamp) {
          this.inquireLoading = false
          this.$Notice.warning({
            title: '警告',
            desc: '开始时间和结束时间不能相同！',
            duration: 2,
            top: 200
          })
        } else if (this.startTimestamp >= this.endTimestamp) {
          this.inquireLoading = false
          this.$Notice.warning({
            title: '警告',
            desc: '开始时间不能大于结束时间！',
            duration: 2,
            top: 200
          })
        } else {
          this.inquireModal = true
          if (this.formItem.level === '') {
            this.setLevel = 0
          } else {
            this.setLevel = this.formItem.level
          }
          if (this.haha === '1') {
            this.currentPage = 1
          }
          if (this.formItem.devType === 'all' || this.formItem.devType === 'devVideo') {
            let arry = []
            for (let i in this.equipmentDataTotal) {
              arry.push(i)
              this.alarmTypeMeth = arry.join(',')
            }
          } else {
            this.alarmTypeMeth = 'noAlarm'
          }
          this.getWarningNews({
            // 机构
            orgId: this.agencyId,
            // 源名称
            srcName: this.formItem.dispositionvalue,
            // 级别
            level: this.setLevel * 1,
            // 报警类型
            alarmType: this.alarmTypeMeth,
            // 开始时间
            beginTime: this.startTimestamp * 1,
            // 结束时间
            endTime: this.endTimestamp * 1,
            // 一页多少条
            limit: this.limit,
            // 当前请求第几页
            page: this.currentPage,
            resType: 'noResTime'
          }).then(res => {
            this.inquireLoading = false
            this.countList = res.data
            this.haha = '1'
            // this.totalPage = this.waringPage.total
            this.totalPage = Number(res.headers['x-bsc-count'])
          }).catch(err => {
            this.inquireLoading = false
            console.log('inquire error: ' + err)
          })
        }
      } else {
        this.inquireLoading = false
        this.$Notice.warning({
          title: '失败',
          desc: '时间不能为空！',
          duration: 2,
          top: 200
        })
      }
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
      allAlarmType: ({ warningCount }) => warningCount.allAlarmType
    }),
    ...mapGetters(['enabledSort', 'getInquireData'])
  },
  created() {
    if (this.$route.query.alarmSureFalse) {
      this.formItem.alarmSure = 'false'
    }
    if (this.$route.query.endTime) {
      this.formItem.endTime = new Date(decodeURIComponent(this.$route.query.endTime))
    } else {
      this.formItem.endTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
    if (this.$route.query.startTime) {
      console.log('开始时间', this.$route.query.startTime)
      this.formItem.startTime = new Date(decodeURIComponent(this.$route.query.startTime))
      setTimeout(() => {
        this.inquire()
      }, 0)
    } else {
      this.formItem.startTime = this.$moment(new Date().setHours(0, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
    }
    this.formItem.level = this.levelList[0].value
    this.getWarningOrgTree(this.orgType).then(() => {
      this.treeData = JSON.parse(JSON.stringify(this.warningOrgTreeData))
    }).catch(err => {
      console.log('getWarningOrgTree error: ' + err)
    })
    this.getTableData()
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
  margin-bottom: 20px;
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
  justify-content: space-around
}
.top-cell .top-info {
  padding: 10px 0px 0px 10px;
  position: relative;
}
.top-cell .top-info span {
  float: left;
  width: 70px;
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
