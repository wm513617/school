<template>
  <div style="width: 100%; height: 100%;position: relative">
    <div class="top-content">
      <div class="top-info">
        <span>核验结果</span>
        <Select v-model="formItem.carProperty" style="width:180px">
          <Option v-for="item in carPropertyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="top-info">
        <span>车牌号码</span>
        <Input v-model="formItem.carNumber" :maxlength="10" placeholder="请输入..." style="width: 180px" :class="rulesError.errorBrandJudge ? 'ivu-form-item-error' : ''" />
      </div>
      <div class="top-info">
        <span>车主姓名</span>
        <Input v-model="formItem.ownerName" :maxlength="10" placeholder="请输入..." style="width: 180px" :class="rulesError.errorNmaeJudge ? 'ivu-form-item-error' : ''"/>
      </div>
      <div class="top-info" style="position:relative">
        <span>位置</span>
        <!-- <p style="position:absolute;z-index:999;left: 50px;top: 8px;">{{formItem.position}}</p> -->
        <Select v-model="formItem.position" style="width:180px">
          <Option v-for="item in positionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="top-info top-info-sure">
        <span class="info-time">选择时间</span>
        <BSdateRange @timeChange="confirmStartTimeChange" :upside='false' :datetime="formItem.confirmStartTime" :width='180' :height='32' style="float:left"></BSdateRange>
        <span class="inquire-line">-</span>
        <BSdateRange @timeChange="confirmEndTimeChange" :upside='false' :datetime="formItem.confirmEndTime" :width='180' :height='32' style="float:left"></BSdateRange>
      </div>
      <div class="top-info inquire-btn">
        <Button type="ghost" @click="research">查询</Button>
      </div>
      <div class="top-info inquire-btn">
        <Button type="ghost" @click="exportData">导出</Button>
      </div>
    </div>
    <div class="main-table" ref="tableBox" v-resize="resizeFun">
      <div class="main-table-content">
        <Table :height="tableHeight" :width="tableWidth" :columns="columnsTitle" :data="countList" size="small" highlight-row></Table>
      </div>
    </div>
    <div class="main-footer">
      <div style="float: right;">
        <Page show-sizer placement='top' :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :show-total="true" :show-elevator="true" :total="totalPage" :page-size="Number(limit)" :current="Number(currentPage)" @on-change="pageChange"></Page>
      </div>
    </div>
    <AlarmModal :type='type' v-if='showAlarmModal' :show='showAlarmModal' :picInfo='userDetailInfo' @close='close'></AlarmModal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AlarmModal from '../personVehicle/AlarmModal'
import moment from 'moment'
export default {
  components: {
    AlarmModal
  },
  data() {
    return {
      agencyId: '',
      options: {
        showFolder: true
      },
      type: 'alarm',
      showAlarmModal: false,
      userDetailInfo: {},
      imgStatus: false,
      rulesError: {
        errorBrandJudge: false,
        errorNmaeJudge: false
      },
      countList: [
        // { 本地测试数据
        //   plateNo: 'John Brown',
        //   gateName: 18,
        //   recordName: 'New York No. 1 Lake Park',
        //   recordContact: '2016-10-03',
        //   time: '5',
        //   checkResult: '6',
        //   similar: '0%',
        //   recordPlateNo: 'p',
        //   recordDriverPic: '/static/noImg1.png',
        //   vehiclePic: '/static/noImg1.png'
        // }
      ],
      tableHeight: 0,
      tableWidth: 0,
      // 分页
      totalPage: 0,
      currentPage: 1,
      limit: this.$PageInfo.limit,
      formItem: {
        carNumber: '',
        carProperty: 'all',
        ownerName: '',
        position: '',
        confirmStartTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
        confirmEndTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      carPropertyList: [
        { label: '全部', value: 'all' },
        { label: '提取失败', value: '0' },
        { label: '核验成功', value: '1' },
        { label: '核验失败', value: '2' }
      ],
      // 位置-包含通道的机构树
      positionList: [],
      columnsTitle: [
        {
          type: 'index',
          title: '序号',
          width: 60
        },
        {
          title: '车牌号码',
          key: 'plateNo'
        },
        {
          title: '位置',
          key: 'gateName'
          // width: 160
        },
        {
          title: '车主姓名',
          key: 'recordName'
        },
        {
          title: '手机号码',
          key: 'recordContact'
        },
        {
          title: '时间',
          key: 'time',
          render: (h, params) => {
            let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {
            }, text)
          }
        },
        {
          title: '核验结果',
          key: 'checkResult',
          render: (h, params) => {
            let address = params.row.checkResult === 0 ? '提取失败' : (params.row.checkResult === 1 ? '核验成功' : '核验失败')
            return h('div', {
            }, address)
          }
        },
        {
          title: '操作',
          key: 'operat',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small'
                },
                style: {
                  // marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDetail(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      peopleVehicleOrg: state => state.vehicle.peopleVehicleOrg,
      videoOrg: state => state.vehicle.videoOrg // 测试用的车辆机构数据
    })
  },
  created() {
    this.getLocationLists()
    this.research()
    this.getVideoOrg()
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
    this.tableWidth = this.$refs['tableBox'].offsetWidth
  },
  watch: {
    'formItem.carNumber': {
      handler(newVal, oldVal) {
        this.rulesJudge(newVal, 'carNumber')
      },
      deep: true
    },
    'formItem.ownerName': {
      handler(newVal, oldVal) {
        this.rulesJudge(newVal, 'ownerName')
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getPepleVehicle', 'getVideoOrg', 'getLocation']),
    // 机构树
    handleNode(node, mark) {
      this.formItem.position = node.name
      this.peopleVehicleOrg.forEach((item, index) => {
        if (node._id === item._id) {
          this.agencyId = ''
        } else {
          this.agencyId = node._id
        }
      })
      // if (this.formItem.position) {
      //   this.treePlaceholder = ''
      // }
    },
    /**
     * 查询人车同检记录列表
     */
    getPeopleVehicleList() {
      this.countList = []
      const data = {
        checkResult: this.formItem.carProperty, // 核验结果
        plateInfo: this.formItem.carNumber, // 车牌号码
        name: this.formItem.ownerName, // 车主姓名
        gateName: this.formItem.position, // 位置
        page: this.currentPage,
        limit: this.limit,
        startTime: Date.parse(new Date(this.formItem.confirmStartTime)) / 1000,
        endTime: Date.parse(new Date(this.formItem.confirmEndTime)) / 1000
      }
      this.getPepleVehicle(data).then(res => {
        this.countList = res.data
        this.totalPage = Number(res.headers['x-bsc-count'])
      }).catch(err => {
        console.log(err)
        this.errorMsg('获取数据失败')
      })
    },
    getLocationLists() {
      this.getLocation().then(res => {
        if (res.data instanceof Array) {
          res.data.forEach(item => {
            this.positionList.push({label: item, value: item})
          })
        }
      }).catch(err => {
        console.log(err, '获取位置列表失败')
      })
    },
    close() {
      this.pbClose()
      this.showAlarmModal = false
    },
    pbClose() {
      this.showBackView = false
      this.videoBottom = 60
      this.videoTop = 0
    },
    // 切换视频
    switchVideo() {
      if (this.imgStatus) {
        this.imgStatus = false
      } else {
        this.imgStatus = true
      }
    },
    rulesJudge(newval, type) {
      const nativecode = newval.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 10) {
        if (type === 'carNumber') {
          this.rulesError.errorBrandJudge = true
        } else {
          this.rulesError.errorNmaeJudge = true
        }
        this.$Notice.warning({
          desc: '不能超过10位字符',
          duration: 1
        })
      } else {
        if (type === 'carNumber') {
          this.rulesError.errorBrandJudge = false
        } else {
          this.rulesError.errorNmaeJudge = false
        }
      }
    },
    showDetail(data) {
      console.log(data, '点击展示详情数据')
      // 主页面人员对比详情的弹窗 props value 值
      let item = this.$lodash.clone(data)
      this.userDetailInfo = item
      this.showAlarmModal = true
    },
    pageSizeChange(n) {
      this.limit = n
      this.getPeopleVehicleList()
    },
    pageChange(page) {
      this.currentPage = page
      this.getPeopleVehicleList()
    },
    resizeFun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
      this.tableWidth = this.$refs['tableBox'].offsetWidth
    },
    // 选择时间开始
    confirmStartTimeChange(val) {
      console.log(val, val.date)
      this.formItem.confirmStartTime = val.date
      if (this.formItem.confirmStartTime > this.formItem.confirmEndTime) {
        this.formItem.confirmEndTime = this.formItem.confirmStartTime
      }
    },
    // 选择时间结束
    confirmEndTimeChange(val) {
      this.formItem.confirmEndTime = val.date
      if (this.formItem.confirmStartTime > this.formItem.confirmEndTime) {
        this.formItem.confirmStartTime = this.formItem.confirmEndTime
      }
    },
    // 查询
    research() {
      if (this.rulesError.errorNmaeJudge || this.rulesError.errorBrandJudge) {
        this.$Notice.warning({
          desc: '车牌号码/车主姓名不能超过10位字符',
          duration: 1
        })
        return
      }
      this.inquireLoading = true
      this.getPeopleVehicleList()
    },
    exportData() {
      const params = {
        checkResult: this.formItem.carProperty, // 核验结果
        plateInfo: this.formItem.carNumber, // 车牌号码
        name: this.formItem.ownerName, // 车主姓名
        gateName: this.formItem.position, // 位置
        page: this.currentPage,
        limit: this.limit,
        startTime: Date.parse(new Date(this.formItem.confirmStartTime)) / 1000,
        endTime: Date.parse(new Date(this.formItem.confirmEndTime)) / 1000
      }
      let arr = []
      for (let key in params) {
        arr.push(`${key}=${params[key]}`)
      }
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      this.elemIF.src = `${window.location.origin}/api/intelliTraffic/record/checkExport?${arr.join('&')}`
      // this.elemIF.src = `${window.location.origin}/api/intelliTraffic/record/checkExport` // 暂不传参
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
    }
  }
}
</script>

<style scoped lang='less'>
.left-img {
  height: 450px;
  margin-right: 30px;
  img {
    width: 100%;
    height: 100%;
  }
}
.error-style {
  border:1px solid red;
  box-sizing: border-box;
  border-radius: 4px;
}
.mains-left {
  width: 40%;
  height: 100%;
  margin-left: -100%;
  float: left;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
}
.mains-right {
  width: 100%;
  height: 100%;
  padding-left: 40%;
  float: left;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  .mains-right-box {
    flex: 1;
    padding: 0 24px;
  }
}
.detail-left {
  width: 60%;
}
.detail-right {
  width: 40%;
}
.detail-right ul {
  padding-left: 14px;
}
.detail-right ul li {
  height: 20px;
  margin: 5px 0;
}
.detail-right ul li i {
  font-style: normal;
  float: left;
}
.detail-right ul li p {
  float: left;
}
.total-box {
  font-size: 20px;
  margin-bottom: 12px;
}
.chart-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  p {
    height: 30px;
    font-size: 14px;
    color: #fff;
    line-height: 30px;
    background: #0f2243;
    padding-left: 24px;
  }
  .chart-info {
    flex: 1;
  }
}
.text-box {
  position: absolute;
  left: 0;
  font-size: 12px;
  top: 0;
  height: 32px;
  max-width: 176px;
  padding-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
  z-index: 999;
}
.top-content {
  width: 100%;
  display: flex;
}
.top-info {
  margin: 0 8px;
}
.top-info span {
  margin-right: 5px;
}
.info-time {
  float: left;
  height: 32px;
  line-height:32px;
}
.inquire-line {
  float: left;
  width: 20px;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.main-table {
  margin-top: 16px;
  height: calc(~'100% - 88px');
  width: 100%;
}
.main-table-content {
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  // position: absolute;
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
</style>
