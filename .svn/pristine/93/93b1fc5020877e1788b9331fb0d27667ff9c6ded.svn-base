<template>
  <div style="width: 100%; height: 100%;" class="violation">
    <div class="main-content">
      <div class="toolbar">
        <div class="left-bar">
          <span class="left-label">车牌号码</span>
          <Input v-model="plateNumber" placeholder="请输入车牌号码" style="width: 180px" :class="{'ivu-form-item-error': rulesError.errorBrandJudge}"> </Input>
        </div>
        <!-- <div class="left-bar">
          <span class="left-label">车辆属性</span>
          <Select v-model="formItem.type" style="width:160px">
            <Option v-for="item in carTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div> -->
        <!-- <div class="left-bar">
          <span class="left-label">车主姓名</span>
          <Input class="iview-input" v-model="carName" placeholder="请输入用户名" style="width: 160px" :class="{'ivu-form-item-error': rulesError.errorNmaeJudge}"> </Input>
        </div> -->
        <div class="left-bar" style="position:relative">
          <span class="left-label">违停球</span>
          <!-- <Select v-model="violation" style="width:160px">
            <Option v-for="item in carTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select> -->
          <p style="position:absolute;z-index:999;left: 50px;top: 7px;">{{violation}}</p>
          <Select v-model="violation" style="width:180px" :placeholder="treePlaceholder">
            <v-tree ref='tree' :treeData="carTypeList" :options="options" @node-click="handleNode" :activeId="agencyId" />
          </Select>
        </div>
        <div class="left-bar">
          <span class="left-label">选择时间</span>
          <!-- <DatePicker class="iview-input" type="daterange" confirm v-model="dateRange" placeholder="请选择时间" @on-change="getDateRange" style="width: 200px"></DatePicker>
           -->
          <BSdateRange @timeChange="confirmStartTimeChange" :upside='false' :datetime="confirmStartTime" :width='180' :height='32' style="float:left"></BSdateRange>
          <span class="inquire-line">-</span>
          <BSdateRange @timeChange="confirmEndTimeChange" :upside='false' :datetime="confirmEndTime" :width='180' :height='32' style="float:left"></BSdateRange>
        </div>
        <Button @click="confirmSearch">检索</Button>
        <Button @click="exportClick">导出</Button>
      </div>
      <div class="table-container" ref="tableContainer">
        <Table :columns="columns" :width="tableWidth" :height="tableHeight" :data="recordList" size="small"></Table>
      </div>
      <div class="paging-container">
        <Page :total="page.total" :page-size="page.pageSize" :current="page.current" :page-size-opts="$PageInfo.size" @on-page-size-change="handlePageSizeChange" @on-change="handlePageChange" show-total show-sizer show-elevator></Page>
      </div>
    </div>
    <Modal v-model="modal" title="报警详情" width="860" :mask-closable="false" @on-cancel="cancel">
      <div class="modal-content" style="position: relative">
        <div class="left-video">
          <div class="left-img" v-if="!imgStatus">
<!--            <img :src="formItem.vehiclePic ? formItem.vehiclePic : '/static/noImg1.png'" alt="暂无图片">-->
            <picturePreview
              :url="formItem.vehiclePic ? formItem.vehiclePic : '/static/noImg1.png'"
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
        <div class="right-form">
          <div class="alarm-info">
            <!-- <h5>告警信息</h5> -->
            <Form ref="formItem" :model="formItem" :label-width="110">
              <FormItem label='车牌号码：'>
                  {{formItem.plateInfo}}
              </FormItem>
              <FormItem label='违停球：'>
                  {{formItem.cameraName}}
              </FormItem>
              <FormItem label='告警时间：'>
                  {{formItem.time}}
              </FormItem>
              <FormItem label='速度：'>
                  <p>{{ formItem.vehicleSpeed }}<i v-if="formItem.vehicleSpeed" style="font-style: normal;padding-left:5px;width:20px">Km/h</i></p>
              </FormItem>
              <FormItem label='限制速度：'>
                  <p>{{ formItem.limitSpeed }}<i v-if="formItem.limitSpeed" style="font-style: normal;padding-left:5px;width:20px">Km/h</i></p>
              </FormItem>
              <FormItem label='车型：'>
                  {{formItem.vehicleType}}
              </FormItem>
              <FormItem label='车辆品牌：'>
                  {{formItem.plateType}}
              </FormItem>
              <FormItem label='车身颜色：'>
                  {{formItem.vehicleColor}}
              </FormItem>
            </Form>
          </div>
          <!-- <div class="alarm-info">
            <h5>其余车辆信息</h5>
            <Form ref="formItem" :model="formItem" :label-width="110">
              <FormItem label='车主姓名：'>
                  {{formItem.name}}
              </FormItem>
              <FormItem label='车辆属性：'>
                  {{formItem.type}}
              </FormItem>
              <FormItem label='手机号码：'>
                  {{formItem.phoneNum}}
              </FormItem>
              <FormItem label='车辆状态：'>
                  {{formItem.carStatus}}
              </FormItem>
              <FormItem label='邮箱：'>
                  {{formItem.email}}
              </FormItem>
              <FormItem label='单位：'>
                  {{formItem.unit}}
              </FormItem>
              <FormItem label='备注：'>
                  {{formItem.remark}}
              </FormItem>
            </Form>
          </div> -->
          <!-- <div class="alarm-info">
            <p class="icon iconfont icon-view-quick" @click="switchVideo">查看视频</p>
          </div> -->
        </div>
      </div>
      <div slot="footer">
          <Button @click="detailsConfirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VideoPage from './VideoPage'
import picturePreview from './picturePreview'
export default {
  components: {
    VideoPage,
    picturePreview
  },
  data() {
    return {
      plateNumber: '',
      carName: '',
      violation: '',
      modal: false,
      // 开始时间
      confirmStartTime: (() => {
        const date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        return date
      })(),
      // 结束时间
      confirmEndTime: (() => {
        const date = new Date()
        return date
      })(),
      tableWidth: null,
      tableHeight: null,
      page: {
        total: 0,
        current: 1,
        pageSize: this.$PageInfo.limit
      },
      formItem: {},
      columns: [
        {
          title: '序号',
          key: 'index',
          type: 'index',
          width: 200,
          align: 'left'
        },
        {
          title: '车牌号码',
          key: 'plateInfo'
        },
        // {
        //   title: '车辆属性',
        //   key: 'carType'
        // },
        {
          title: '违停球',
          key: 'cameraName',
          width: 300
        },
        // {
        //   title: '车主姓名',
        //   key: 'carName',
        //   width: 300
        // },
        // {
        //   title: '手机号码',
        //   key: 'phoneNum'
        // },
        {
          title: '违章时间',
          key: 'violationTime',
          render: (h, param) => {
            let time = param.row.time ? this.$moment(param.row.time * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', time)
          }
        },
        {
          title: '操作',
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
      ],
      recordList: [
        // {
        //   carNumber: '123456987',
        //   carType: '大众',
        //   violation: '2222',
        //   carName: '李三',
        //   phoneNum: '15029635896',
        //   violationTime: '2019-07-16 15:30:22',
        //   vehicleSpeed: 20,
        //   limitSpeed: 30,
        //   vehicleType: 8
        // }
      ],
      carTypeList: [],
      rulesError: {
        errorBrandJudge: false,
        errorNmaeJudge: false
      },
      imgStatus: false,
      agencyId: '',
      options: {
        showFolder: true
      },
      treePlaceholder: '请选择...',
      hkDeviceIndexCode: '',
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
    this.getBayonetList().then((res) => {
      this.carTypeList = JSON.parse(JSON.stringify([res.data]))
    }).catch(() => {
      this.errorMsg('违停球获取失败')
    })
    this.confirmSearch()
  },
  watch: {
    // 车牌号码
    'plateNumber'(newval) {
      this.rulesJudge(newval, 'brand')
    },
    // 车主姓名
    'carName'(newval) {
      this.rulesJudge(newval, 'name')
    }
  },
  methods: {
    ...mapActions(['getVioParkRecord', 'exportVioParkExport', 'getBayonetList', 'getIntellTraRecordConstant']),
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
    // 机构树
    handleNode(node, mark) {
      this.violation = node.name
      if (node.isRoot) {
        this.agencyId = ''
      } else {
        this.agencyId = node.id
      }
      if (this.violation) {
        this.treePlaceholder = ''
      }
      if (node.devChnId) {
        this.hkDeviceIndexCode = node.devChnId
      } else {
        this.hkDeviceIndexCode = ''
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
        if (type === 'brand') {
          this.rulesError.errorBrandJudge = true
        } else {
          this.rulesError.errorNmaeJudge = true
        }
        this.$Notice.warning({
          desc: '不能超过10位字符',
          duration: 1
        })
      } else {
        if (type === 'brand') {
          this.rulesError.errorBrandJudge = false
        } else {
          this.rulesError.errorNmaeJudge = false
        }
      }
    },
    confirmSearch() {
      if (this.confirmStartTime === '' && this.confirmEndTime === '') {
        this.inquireLoading = false
        this.$Notice.warning({
          title: '失败',
          desc: '时间不能为空！',
          duration: 2,
          top: 200
        })
        return
      }
      // 时间转换
      let startTime = Date.parse(new Date(this.confirmStartTime)) / 1000
      let endTime = Date.parse(new Date(this.confirmEndTime)) / 1000
      if (startTime > endTime) {
        this.$Notice.warning({
          title: '失败',
          desc: '开始时间不能大于结束时间',
          duration: 2,
          top: 200
        })
      } else {
        const prams = {
          plateInfo: this.plateNumber,
          orgId: this.agencyId,
          cross: this.hkDeviceIndexCode,
          startTime: startTime,
          endTime: endTime,
          limit: this.page.pageSize,
          page: this.page.current
        }
        // console.log('记录查询', prams)
        this.getVioParkRecord(prams).then((res) => {
          let arryData = []
          arryData = JSON.parse(JSON.stringify(res.data))
          this.recordList = arryData
          this.page.total = Number(res.headers['x-bsc-count'])
        }).catch(() => {
          this.errorMsg('数据检索失败')
        })
      }
    },
    // 确认时间：
    confirmStartTimeChange(val) {
      this.confirmStartTime = val.date
      if (this.confirmStartTime > this.confirmEndTime) {
        this.confirmEndTime = this.confirmStartTime
      }
    },
    confirmEndTimeChange(val) {
      this.confirmEndTime = val.date
      if (this.confirmStartTime > this.confirmEndTime) {
        this.confirmStartTime = this.confirmEndTime
      }
    },
    handlePageChange(pageNum) {
      this.page.current = pageNum
    },
    handlePageSizeChange() {
    },
    // 详情按钮
    details(data) {
      let dataInfo = JSON.parse(JSON.stringify(data))
      if (dataInfo.vehicleType > 7) {
        dataInfo.vehicleType = 1
      }
      dataInfo.carStatus = this.vehicleStateConstList[data.vehicleState]
      dataInfo.vehicleType = dataInfo.vehicleType ? this.vehicleTypeObj[dataInfo.vehicleType] : ''
      dataInfo.plateType = dataInfo.plateType ? this.plateTypeObj[dataInfo.plateType] : ''
      dataInfo.vehicleColor = dataInfo.vehicleColor ? this.vehicleColorObj[dataInfo.vehicleColor] : ''
      dataInfo.time = dataInfo.time ? this.$moment(dataInfo.time * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
      this.formItem = dataInfo
      this.modal = true
    },
    detailsConfirm() {
      this.modal = false
      this.imgStatus = false
    },
    cancel() {
      this.imgStatus = false
    },
    // 切换视频
    switchVideo() {
      if (this.imgStatus) {
        this.imgStatus = false
      } else {
        this.imgStatus = true
      }
    },
    // 导出
    exportClick() {
      // 时间转换
      const params = {
        plateInfo: this.plateNumber,
        orgId: this.agencyId,
        cross: this.hkDeviceIndexCode,
        startTime: Date.parse(new Date(this.confirmStartTime)) / 1000,
        endTime: Date.parse(new Date(this.confirmEndTime)) / 1000,
        limit: this.page.pageSize,
        page: this.page.current
      }
      let list = []
      for (let val in params) {
        list.push(`${val}=${params[val]}`)
      }
      if (this.recordList.length) {
        let elemIF = document.getElementById('dow')
        if (!elemIF) {
          elemIF = document.createElement('iframe')
          elemIF.id = 'dow'
          elemIF.style.display = 'none'
          document.body.appendChild(elemIF)
        }
        elemIF.src = window.location.origin + `/api/intelliTraffic/record/vioParkExport?` + list.join('&')
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.tableWidth = this.$refs['tableContainer'].offsetWidth
      this.tableHeight = this.$refs['tableContainer'].offsetHeight
    }, 0)
  }
}
</script>

<style scoped lang='less'>
.violation {
  width: 100%;
  height: 100%;
  display: flex;
  .weekdays {
    display: inline-block !important;
  }
  .main-content {
    background-color: #1b3153;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .toolbar {
      // display: flex;
      margin-bottom: 16px;
      .left-bar {
        // flex: 1;
        // margin-right: 140px;
        float: left;
        margin: 0 8px;
        .left-label {
          float: left;
          margin-right: 5px;
          line-height: 32px;
        }
        .inquire-line {
          float: left;
          line-height: 32px;
          margin: 0 4px;
        }
        .iview-input {
          margin-right: 8px;
        }
      }
      button {
        margin-right: 8px;
        height: 32px;
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
.modal-content {
  display: flex;
  .left-video {
    // width: 600px;
    // float: left;
    flex: 1;
    .left-img {
      width: 100%;
      height: 350px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .right-form {
    width: 260px;
    .alarm-info {
      margin-bottom: 10px;
      h5 {
        margin-bottom: 6px;
      }
      .ivu-form-item {
        margin-bottom: 4px !important;
      }
    }
  }
}
</style>
