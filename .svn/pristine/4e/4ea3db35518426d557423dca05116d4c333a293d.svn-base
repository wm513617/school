<template>
  <div style="width: 100%; height: 100%;position: relative">
    <div class="top-content">
      <div class="top-info">
        <span>车牌号码</span>
        <Input v-model="formItem.carNumber" :maxlength="10" placeholder="请输入..." style="width: 180px" :class="rulesError.errorBrandJudge ? 'ivu-form-item-error' : ''" />
      </div>
      <!-- <div class="top-info">
        <span>车辆属性</span>
        <Select v-model="formItem.carProperty" style="width:180px">
          <Option v-for="item in carPropertyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="top-info">
        <span>车主姓名</span>
        <Input v-model="formItem.ownerName" :maxlength="10" placeholder="请输入..." style="width: 180px" :class="rulesError.errorNmaeJudge ? 'ivu-form-item-error' : ''"/>
      </div> -->
      <div class="top-info" style="position: relative">
        <span>卡口</span>
        <p style="position:absolute;z-index:999;left: 42px;top: 8px;">{{formItem.bayonet}}</p>
        <Select v-model="formItem.bayonet" style="width:180px" :placeholder="treePlaceholder">
          <!-- <Option v-for="item in bayonetList" :value="item.code" :key="item.code">{{ item.name }}</Option> -->
          <v-tree ref='tree' :treeData="bayonetList" :options="options" @node-click="handleNode" :activeId="agencyId" />
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
      <Table :height="tableHeight" :columns="columnsTitle" :data="countList" size="small" :width="tableWidth"></Table>
    </div>
    <div class="main-footer">
      <div style="float: right;">
        <Page show-sizer placement='top' :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :show-total="true" :show-elevator="true" :total="totalPage" :page-size="Number(limit)" :current="Number(currentPage)" @on-change="pageChange"></Page>
      </div>
    </div>
    <Modal v-model="isShowSpeedDetail" title="报警详情" width="1000" :mask-closable="false" @on-cancel="cancel">
      <div style="display: flex;position: relative"  >
        <div class="detail-left">
          <div class="left-img" v-if="!imgStatus">
<!--            <img :src="detailData.vehiclePic ? detailData.vehiclePic : '/static/noImg1.png'" alt="暂无图片">-->
            <picturePreview
              :url="detailData.vehiclePic ? detailData.vehiclePic : '/static/noImg1.png'"
              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
              :isBodyShow="false"
            ></picturePreview>
          </div>
          <div class="left-img" v-if="imgStatus">
            <VideoPage :videoHeight="350"></VideoPage>
          </div>
        </div>
        <div class="detail-right">
          <!-- <p style="font-size:14px;font-weight: bold">告警信息</p> -->
          <ul>
            <li>
              <i>车牌号码：</i>
              <p :title='detailData.plateInfo'>{{ detailData.plateInfo }}</p>
            </li>
            <li>
              <i>卡口：</i>
              <p :title='detailData.cameraName'>{{ detailData.cameraName }}</p>
            </li>
            <li>
              <i>告警时间：</i>
              <p :title='detailData.time'>{{ $moment(parseInt(detailData.time) * 1000).format("YYYY-MM-DD HH:mm:ss") }}</p>
            </li>
            <li>
              <i>速度：</i>
              <p :title='detailData.vehicleSpeed'>{{ detailData.vehicleSpeed }}<i v-if="detailData.vehicleSpeed" style="float:right;padding-left:5px;width:20px">Km/h</i></p>
            </li>
            <li>
              <i>限制速度：</i>
              <p :title='detailData.limitSpeed'>{{ detailData.limitSpeed }}<i v-if="detailData.limitSpeed" style="float:right;padding-left:5px;width:20px">Km/h</i></p>
            </li>
            <li>
              <i>车型：</i>
              <p>{{ detailData.vehicleType  }}</p>
            </li>
            <li>
              <i>车辆品牌：</i>
              <p>{{ detailData.plateType  }}</p>
            </li>
            <li>
              <i>车身颜色：</i>
              <p>{{ detailData.vehicleColor }}</p>
            </li>
          </ul>
          <!-- <p style="font-size:14px;font-weight: bold">其余车辆信息</p>
          <ul>
            <li>
              <i>车主姓名：</i>
              <p :title='countList[0].endTime'>{{ countList[0].endTime }}</p>
            </li>
            <li>
              <i>车辆属性：</i>
              <p :title='countList[0].endTime'>{{ countList[0].endTime }}</p>
            </li> -->
            <!-- <li>
              <i>手机号码：</i>
              <p :title='countList[0].endTime'>{{ countList[0].endTime }}</p>
            </li>
            <li>
              <i>车辆状态：</i>
              <p :title='this.vehicleStateConstList[detailData.vehicleState]'>{{ this.vehicleStateConstList[detailData.vehicleState] }}</p>
            </li>
            <li>
              <i>邮箱：</i>
              <p :title='detailData.subtype'>{{ detailData.subtype }}</p>
            </li>
            <li>
              <i>单位：</i>
              <p :title='detailData.subtype'>{{ detailData.subtype }}</p>
            </li>
            <li>
              <i>备注：</i>
              <p :title='detailData.subtype'>{{ detailData.subtype }}</p>
            </li>
          </ul> -->
          <!-- <p class="icon iconfont icon-view-quick" style="cursor: pointer" @click="switchVideo">查看视频</p> -->
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="closeDetail">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VideoPage from './VideoPage'
import picturePreview from './picturePreview'
import moment from 'moment'
export default {
  components: {
    VideoPage,
    picturePreview
  },
  data() {
    return {
      agencyId: '',
      hkDeviceIndexCode: '',
      treePlaceholder: '请选择...',
      options: {
        showFolder: true
      },
      detailData: {},
      elemIF: null,
      imgStatus: false,
      rulesError: {
        errorBrandJudge: false,
        errorNmaeJudge: false
      },
      isShowSpeedDetail: false,
      countList: [
        // {
        //   plateInfo: '车牌号码',
        //   cameraName: '待定',
        //   vehicleSpeed: '速度',
        //   limitSpeed: '限制速度',
        //   time: 18 // 违章时间
        // }
      ],
      tableHeight: 0,
      tableWidth: null,
      // 分页
      totalPage: 0,
      currentPage: 1,
      limit: this.$PageInfo.limit,
      formItem: {
        carNumber: '',
        carProperty: '',
        ownerName: '',
        bayonet: '',
        confirmStartTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
        confirmEndTime: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      carPropertyList: [
        { label: '全部', value: '全部' },
        { label: '内部', value: '内部' },
        { label: '外部', value: '外部' },
        { label: '未登记', value: '未登记' }
      ],
      // 获取智能交通平台的所有卡口摄像机
      bayonetList: [],
      columnsTitle: [
        {
          type: 'index',
          title: '序号',
          width: 100
        },
        {
          title: '车牌号码',
          key: 'plateInfo',
          width: 180
        },
        {
          title: '卡口',
          key: 'cameraName',
          width: 260,
          render: (h, params) => {
            let cameraName = params.row.cameraName
            return h(
              'div',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: cameraName
                }
              },
              cameraName
            )
          }
        },
        {
          title: '速度',
          key: 'vehicleSpeed',
          width: 160,
          render: (h, params) => {
            let speed = params.row.vehicleSpeed + 'Km/h'
            return h('span', {
            }, speed)
          }
        },
        {
          title: '限制速度',
          key: 'limitSpeed',
          width: 160,
          render: (h, params) => {
            let speed = params.row.limitSpeed + 'Km/h'
            return h('span', {
            }, speed)
          }
        },
        {
          title: '违章时间',
          key: 'time',
          render: (h, params) => {
            let text = params.row.time ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {
            }, text)
          }
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
                    this.showDetail(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      vehicleTypeObj: '', // 车型
      plateTypeObj: '', // 车辆品牌
      vehicleColorObj: '' // 车辆颜色
    }
  },
  computed: {
    ...mapState({
      vehicleStateConstList: state => state.smartTrafficRecord.vehicleStateConstList
    })
  },
  created() {
    this.GetIntellTraRecordConstant()
    this.research()
    this.getBayonetList().then(res => {
      this.bayonetList = JSON.parse(JSON.stringify([res.data]))
      console.log(this.bayonetList, '获取到的卡口数据')
    }).catch(err => {
      console.log(err)
      this.errorMsg('获取卡口数据失败')
    })
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
    ...mapActions(['getSpeedingRecord', 'getBayonetList', 'getIntellTraRecordConstant']),
    // 获取常量信息
    GetIntellTraRecordConstant() {
      this.getIntellTraRecordConstant().then(res => {
        let response = res.data
        this.vehicleTypeObj = response.vehicleType
        this.plateTypeObj = response.plateType
        this.vehicleColorObj = response.vehicleColor
      }).catch(err => {
        console.log('获取常量信息出错', err)
      })
    },
    /**
     * 查询超速记录列表
     */
    getSpeedRecordList() {
      this.countList = []
      const data = {
        plateInfo: this.formItem.carNumber, // 车牌号码
        orgId: this.agencyId, // 机构id
        cross: this.hkDeviceIndexCode, // 卡口
        page: this.currentPage,
        limit: this.limit,
        startTime: Date.parse(new Date(this.formItem.confirmStartTime)) / 1000,
        endTime: Date.parse(new Date(this.formItem.confirmEndTime)) / 1000
      }
      this.getSpeedingRecord(data).then(res => {
        this.countList = res.data
        this.totalPage = Number(res.headers['x-bsc-count'])
      }).catch(err => {
        console.log(err)
        this.errorMsg('获取数据失败')
      })
    },
    // 机构树
    handleNode(node, mark) {
      this.formItem.bayonet = node.name
      if (node.isRoot) {
        this.agencyId = ''
      } else {
        this.agencyId = node.id
      }
      if (this.formItem.bayonet) {
        this.treePlaceholder = ''
      }
      if (node.devChnId) {
        this.hkDeviceIndexCode = node.devChnId
      } else {
        this.hkDeviceIndexCode = ''
      }
    },
    // 切换视频
    switchVideo() {
      if (this.imgStatus) {
        this.imgStatus = false
      } else {
        this.imgStatus = true
      }
    },
    cancel() {
      this.imgStatus = false
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
    closeDetail() {
      this.imgStatus = false
      this.isShowSpeedDetail = false
    },
    showDetail(data) {
      this.isShowSpeedDetail = true
      let dataInfo = JSON.parse(JSON.stringify(data))
      if (data.vehicleType > 7) {
        data.vehicleType = 1
      }
      dataInfo.vehicleType = data.vehicleType ? this.vehicleTypeObj[data.vehicleType] : ''
      dataInfo.plateType = data.plateType ? this.plateTypeObj[data.plateType] : ''
      dataInfo.vehicleColor = data.vehicleColor ? this.vehicleColorObj[data.vehicleColor] : ''
      this.detailData = dataInfo
    },
    pageSizeChange(n) {
      this.limit = n
      // this.getTableData()
    },
    pageChange(page) {
      this.currentPage = page
      // this.getTableData()
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
      this.getSpeedRecordList()
    },
    // 导出记录
    exportData() {
      const params = {
        plateInfo: this.formItem.carNumber, // 车牌号码
        orgId: this.agencyId, // 机构id
        cross: this.hkDeviceIndexCode, // 卡口
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
      this.elemIF.src = `${window.location.origin}/api/intelliTraffic/record/overspeedExport?${arr.join('&')}`
      // this.elemIF.src = `${window.location.origin}/api/intelliTraffic/record/overspeedExport` // 暂不传参
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
    }
  }
}
</script>

<style scoped lang='less'>
.left-img {
  height: 350px;
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
  margin-bottom: 20px;
}
.detail-right ul li i {
  float: left;
  font-style: normal;
  text-align: right;
  width: 100px;
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
  // height: 100%;
}
.main-table-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
