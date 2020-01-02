<template>
  <div style="width: 100%; height: 100%;" class="passing-record">
    <div class="header">
      <div class="clearfix">
        <div class="top-item lf">
          <span class="lab">卡口</span>
          <p style="position:absolute;z-index:999;left: 94px;top: 23px;">{{cross}}</p>
          <Select style="width:200px;" v-model="cross" :placeholder="treePlaceholder">
            <!-- <Option v-for="item in crossList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
            <v-tree ref='tree' :treeData="crossList" :options="options" @node-click="HandleNode" :activeId="agencyId" />
          </Select>
        </div>
        <div class="top-item lf">
          <span class="lab">车牌号码</span>
          <Input v-model="plateInfo" :maxlength="10" placeholder="请输入车牌号码" style="width: 200px" :class="{'ivu-form-item-error': rulesError.errorBrandJudge}"/>
        </div>
        <div class="top-item lf">
          <span class="lab">车型</span>
          <Select style="width:200px;" v-model="vehicleType">
            <Option v-for="item in vehicleTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="top-item lf">
          <span class="lab">车辆品牌</span>
          <Select style="width:200px;" v-model="plateType">
            <Option v-for="item in plateTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
      <div class="clearfix top-secondline">
        <div class="top-item lf">
          <span class="lab">车身颜色</span>
          <Select style="width:200px;" v-model="vehicleColor">
            <Option v-for="item in vehicleColorList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="top-item lf">
          <span class="lab">车速范围</span>
          <Select style="width:200px;" v-model="speedMin" placeholder="请选择最小车速">
            <Option v-for="item in speedMinList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select> -
          <Select style="width:200px;" v-model="speedMax" placeholder="请选择最大车速">
            <Option v-for="item in speedMaxList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
        <div class="top-item lf">
          <span class="lab">起始时间</span>
          <DatePicker style="width:200px;" :value="defaultStartTime" type="datetime" placeholder="请选择起始时间" @on-change="ChangeSearchStime"></DatePicker>
        </div>
        <div class="top-item lf">
          <span class="lab">结束时间</span>
          <DatePicker style="width:200px;" :value="defaultEndTime" type="datetime" placeholder="请选择结束时间" @on-change="ChangeSearchEtime"></DatePicker>
        </div>
        <Button class="lookfor" @click="SearchRecordPass">查询</Button>
        <Button @click="Export">导出</Button>
      </div>
    </div>
    <div class="tab-line">
      <Tabs :animated="false" @on-click="tickTabs" v-show="isChoose">
        <Tab-pane label="全部" name="whole"></Tab-pane>
        <!-- <Tab-pane label="内部" name="inside"></Tab-pane>
        <Tab-pane label="外部" name="external"></Tab-pane>
        <Tab-pane label="未登记" name="unregistered"></Tab-pane> -->
      </Tabs>
      <div class="arrangement-format">
        <span :class="isChoose?'isActive':''" @click="Tetram"><i class="iconfont icon-4ptz"></i></span>
        <span :class="!isChoose?'isActive':''" @click="ListArrangement"><i class="iconfont icon-180-180"></i></span>
      </div>
    </div>
    <div style="height: calc(100% - 185px);overflow-y:scroll;" ref="tableBox" v-resize="resizeFun">
      <div style="padding:0 20px;" v-show="isChoose">
        <Row type="flex" justify="start" :gutter="30">
          <Col span="4" v-for="(item, index) in tableData" :key="index">
            <div class="img-item" @click="DetailInfo(item)" :style="'height:'+ (tableWidth-350)/6 + 'px'">
              <img class="item-bg" :src="item.vehiclePic?item.vehiclePic:'/static/noImg1.png'" @error="imgErr" alt="无图片">
              <div class="bottom-model">
                <div class="left-info lf">
                  <p>{{item.plateInfo}}</p>
                  <p>卡口：{{item.cameraName}}</p>
                  <p>过车时间：{{formatTime(item.time*1000)}}</p>
                </div>
                <!-- <div class="right-licenseplate rf" style="margin:15px 10px 0 0;">{{item.plateInfo}}</div> -->
              </div>
              <div class="all-model">
                <div class="left-info lf">
                  <p>{{item.plateInfo}}</p>
                  <p>卡口：{{item.cameraName}}</p>
                  <p>过车时间：{{formatTime(item.time*1000)}}</p>
                  <!-- <p>车型：{{vehicleTypeObj[item.vehicleType]}}</p> -->
                  <!-- <p>车辆品牌：{{plateTypeObj[item.plateType]}}</p> -->
                  <!-- <p>颜色：{{vehicleColorObj[item.vehicleColor]}}</p> -->
                  <p>车速：{{item.vehicleSpeed}}Km/h</p>
                </div>
                <div class="right-licenseplate"></div>
              </div>
            </div>
          </Col>
        </Row>
        <p style="text-align:center;margin-top:300px;" v-if="tableData.length === 0">暂无数据</p>
      </div>
      <div class="table-box" ref="tableBox" v-show="!isChoose">
        <div class="table-box-content">
          <Table :height="tableHeight" border :columns="columns" :data="tableData"></Table>
        </div>
      </div>
    </div>
    <div class="table-footer">
      <div style="float:right;">
        <!-- <Page :show-total="true" :show-elevator="true" :current="1"></Page> -->
        <Page :show-total="true" show-sizer :page-size-opts="pageSize" @on-page-size-change="PageSizeChange" :page-size="pageInfo.limit" :show-elevator="true" :total="pageInfo.counts" :current="pageInfo.cur" @on-change="ChangePage"></Page>
      </div>
    </div>
    <!-- 过车记录详情界面 -->
    <Modal
      v-model="modal"
      title="过车详情"
      width="900">
      <div class="clearfix" style="position:relative">
        <div class="modal-img lf" >
          <picturePreview
            :url="modalInfo.vehiclePic?modalInfo.vehiclePic:'/static/noImg1.png'"
            :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
            :isBodyShow="false"
          ></picturePreview>
<!--          <img class="item-bg" :src="modalInfo.vehiclePic?modalInfo.vehiclePic:'/static/noImg1.png'" @error="imgErr" alt="无图片">-->
          <!-- <span class="prev" @click="PrevPng"><i class="iconfont icon-jiantou-copy"></i></span>
          <span class="next" @click="NextPng"><i class="iconfont icon-jiantou"></i></span>
          <span class="tips">{{imgIndex + 1}}/{{imgArr.length}}个图片</span> -->
        </div>
        <div class="madal-info lf">
          <div><span class="span-lable">车牌号码：</span><span class="span-info">{{modalInfo.plateInfo}}</span></div>
          <div><span class="span-lable">卡口：</span><span class="span-info">{{modalInfo.cameraName}}</span></div>
          <div><span class="span-lable">过车时间：</span><span class="span-info">{{formatTime(modalInfo.time*1000)}}</span></div>
          <div><span class="span-lable">过车速度：</span><span class="span-info">{{modalInfo.vehicleSpeed}}Km/h</span></div>
          <div><span class="span-lable">限制速度：</span><span class="span-info">20Km/h</span></div>
          <div><span class="span-lable">车型：</span><span class="span-info">{{vehicleTypeObj[modalInfo.vehicleType > 7?1:modalInfo.vehicleType]}}</span></div>
          <div><span class="span-lable">车辆品牌：</span><span class="span-info">{{plateTypeObj[modalInfo.plateType]}}</span></div>
          <div><span class="span-lable">车身颜色：</span><span class="span-info">{{vehicleColorObj[modalInfo.vehicleColor]}}</span></div>
          <!-- <div><span class="span-lable">车主姓名：</span><span class="span-info">耿啸</span></div>
          <div><span class="span-lable">手机号码：</span><span class="span-info">18335298523</span></div>
          <div><span class="span-lable">车辆属性：</span><span class="span-info">未登记</span></div>
          <div><span class="span-lable">车辆状态：</span><span class="span-info">正常</span></div>
          <div><span class="span-lable">单位：</span><span class="span-info">品园六楼东南侧</span></div>
          <div><span class="span-lable">备注：</span><span class="span-info">品园六楼东南侧</span></div> -->
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import src_one from '../../../../assets/images/bl.png'
import src_two from '../../../../assets/images/4.jpg'
import src_three from '../../../../assets/images/mbh.png'
import picturePreview from './picturePreview.vue'
export default {
  components: {
    picturePreview
  },
  data() {
    return {
      agencyId: '',
      treePlaceholder: '请选择...',
      hkDeviceIndexCode: '',
      pageInfo: {
        pages: 0,
        cur: 1,
        limit: 100,
        counts: 0
      },
      options: {
        showFolder: true
      },
      rulesError: {
        errorBrandJudge: false,
        errorNmaeJudge: false
      },
      pageSize: [25, 50, 100, 200],
      imgSrc: '',
      imgArr: [src_one, src_two, src_three],
      imgIndex: 0,
      isChoose: true,
      modal: false,
      modalInfo: {},
      rowHeight: 0,
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 100,
          align: 'center'
        },
        {
          title: '车牌号码',
          key: 'plateInfo',
          align: 'center'
        },
        // {
        //   title: '车主姓名',
        //   key: 'name',
        //   align: 'center'
        // },
        {
          title: '过车时间',
          key: 'time',
          align: 'center',
          render: (h, params) => {
            return h('span', this.formatTime(params.row.time * 1000))
          }
        },
        {
          title: '卡口',
          key: 'cameraName',
          align: 'center'
        },
        // {
        //   title: '车辆属性',
        //   key: 'attribute',
        //   align: 'center'
        // },
        {
          title: '车型',
          key: 'vehicleType',
          align: 'center',
          render: (h, params) => {
            console.log('params', params)
            return h('span', this.vehicleTypeObj[params.row.vehicleType > 7 ? 1 : params.row.vehicleType])
          }
        },
        {
          title: '车辆品牌',
          key: 'plateType',
          align: 'center',
          render: (h, params) => {
            return h('span', this.plateTypeObj[params.row.plateType])
          }
        },
        {
          title: '车辆颜色',
          key: 'vehicleColor',
          align: 'center',
          render: (h, params) => {
            return h('span', this.vehicleColorObj[params.row.vehicleColor])
          }
        },
        {
          title: '车速',
          key: 'vehicleSpeed',
          align: 'center',
          render: (h, params) => {
            return h('span', params.row.vehicleSpeed + 'Km/h')
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    // this.show(params.index)
                    this.DetailInfo(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      tableData: [],
      cross: '', // 卡口编号
      crossList: [], // 卡口编号选项
      plateInfo: '', // 车牌号码
      vehicleType: '', // 车型
      vehicleTypeList: [], // 车型选项
      vehicleTypeObj: {}, // 车型id与lable对应关系
      plateType: '', // 车辆品牌
      plateTypeList: [], // 车辆品牌选项
      plateTypeObj: {}, // 车辆品牌id与lable对应关系
      vehicleColor: '', // 车辆颜色
      vehicleColorList: [], // 车辆颜色选项
      vehicleColorObj: {}, // 车辆颜色id与lable对应关系
      speedMin: '', // 最小车速
      speedMinList: [
        {
          value: '10',
          label: '10Km/h'
        },
        {
          value: '20',
          label: '20Km/h'
        },
        {
          value: '30',
          label: '30Km/h'
        },
        {
          value: '40',
          label: '40Km/h'
        },
        {
          value: '50',
          label: '50Km/h'
        },
        {
          value: '60',
          label: '60Km/h'
        },
        {
          value: '70',
          label: '70Km/h'
        },
        {
          value: '80',
          label: '80Km/h'
        },
        {
          value: '90',
          label: '90Km/h'
        },
        {
          value: '100',
          label: '100Km/h'
        }
      ], // 最小车速选项
      speedMax: '', // 最大车速
      speedMaxList: [
        {
          value: '10',
          label: '10Km/h'
        },
        {
          value: '20',
          label: '20Km/h'
        },
        {
          value: '30',
          label: '30Km/h'
        },
        {
          value: '40',
          label: '40Km/h'
        },
        {
          value: '50',
          label: '50Km/h'
        },
        {
          value: '60',
          label: '60Km/h'
        },
        {
          value: '70',
          label: '70Km/h'
        },
        {
          value: '80',
          label: '80Km/h'
        },
        {
          value: '90',
          label: '90Km/h'
        },
        {
          value: '100',
          label: '100Km/h'
        }
      ], // 最大车速选项
      startTime: '', // 起始时间
      endTime: '', // 结束时间
      defaultStartTime: '', // 默认起始时间
      defaultEndTime: '', // 默认结束时间
      tableHeight: 0,
      tableWidth: 0
    }
  },
  computed: {
  },
  created() {
    this.GetIntellTraRecordConstant()
    // 进入页面获取当日凌晨到当前时间所有数据
    this.startTime = new Date(new Date().setHours(0, 0, 0, 0))
    this.defaultStartTime = new Date(new Date().setHours(0, 0, 0, 0))
    this.endTime = Date.parse(new Date())
    this.defaultEndTime = new Date()
    console.log(this.startTime)
    // this.endTime
    this.SearchRecordPass()
    // 获取卡口信息
    this.getBayonetList().then(res => {
      this.crossList = [res.data]
    }).catch(err => {
      console.log(err)
      this.errorMsg('获取卡口数据失败')
    })
  },
  watch: {
    plateInfo: {
      handler(newVal, oldVal) {
        this.rulesJudge(newVal, 'carNumber')
      },
      deep: true
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
    this.tableWidth = this.$refs['tableBox'].offsetWidth
  },
  methods: {
    ...mapActions(['getIntellTraRecordPass', 'getIntellTraRecordConstant', 'getIntellTraRecordPassExport', 'getBayonetList']),
    // 时间格式转换
    formatTime(time) {
      var datetime = new Date(time)
      // 获取年月日时分秒值  slice(-2)过滤掉大于10日期前面的0
      var year = datetime.getFullYear()
      var month = ('0' + (datetime.getMonth() + 1)).slice(-2)
      var date = ('0' + datetime.getDate()).slice(-2)
      var hour = ('0' + datetime.getHours()).slice(-2)
      var minute = ('0' + datetime.getMinutes()).slice(-2)
      var second = ('0' + datetime.getSeconds()).slice(-2)
      // 拼接
      var result = `${year}-${month}-${date} ${hour}:${minute}:${second}`
      // 返回
      return result
    },
    resizeFun() {
      this.tableWidth = this.$refs['tableBox'].offsetWidth
    },
    // 表单验证
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
    tickTabs() {

    },
    // 选择卡口
    HandleNode(node) {
      console.log('node', node)
      this.cross = node.name
      if (node.isRoot) {
        this.agencyId = ''
      } else {
        this.agencyId = node.id
      }
      if (this.cross) {
        this.treePlaceholder = ''
      }
      if (node.devChnId) {
        this.hkDeviceIndexCode = node.devChnId
      } else {
        this.hkDeviceIndexCode = ''
      }
    },
    Tetram() {
      this.isChoose = !this.isChoose
      this.pageSize = [25, 50, 100, 200]
      this.pageInfo.limit = 100
      this.SearchRecordPass()
    },
    ListArrangement() {
      this.isChoose = !this.isChoose
      this.pageSize = [25, 50, 100, 200]
      this.pageInfo.limit = 100
      this.SearchRecordPass()
    },
    DetailInfo(info) {
      this.modal = true
      this.modalInfo = info
      if (this.imgArr.length > 0) {
        this.imgSrc = this.imgArr[0]
      }
    },
    PrevPng() {
      if (this.imgIndex === 0) {
        this.imgIndex = this.imgArr.length - 1
      } else {
        this.imgIndex -= 1
      }
      this.imgSrc = this.imgArr[this.imgIndex]
    },
    NextPng() {
      if (this.imgIndex + 1 === this.imgArr.length) {
        this.imgIndex = 0
      } else {
        this.imgIndex += 1
      }
      this.imgSrc = this.imgArr[this.imgIndex]
    },
    // 获取开始时间
    ChangeSearchStime(time) {
      if (time) {
        this.startTime = Date.parse(time)
      } else {
        this.startTime = ''
      }
    },
    // 获取结束时间
    ChangeSearchEtime(time) {
      if (time) {
        this.endTime = Date.parse(time)
      } else {
        this.endTime = ''
      }
    },
    // 获取常量信息
    GetIntellTraRecordConstant() {
      this.getIntellTraRecordConstant().then(res => {
        let response = res.data
        this.vehicleTypeObj = response.vehicleType
        this.plateTypeObj = response.plateType
        this.vehicleColorObj = response.vehicleColor
        this.plateTypeList = this.ObjToSelectArrary(response.plateType)
        this.vehicleColorList = this.ObjToSelectArrary(response.vehicleColor)
        this.vehicleTypeList = this.ObjToSelectArrary(response.vehicleType)
      }).catch(err => {
        console.log('获取常量信息出错', err)
      })
    },
    // 对象格式转换为select数组格式
    ObjToSelectArrary(obj) {
      let selectArr = []
      for (let item in obj) {
        let selectObj = {
          value: item,
          label: obj[item]
        }
        selectArr.push(selectObj)
      }
      return selectArr
    },
    // 查询过车记录
    SearchRecordPass() {
      let params = {
        cross: this.hkDeviceIndexCode,
        orgId: this.agencyId,
        plateInfo: this.plateInfo,
        vehicleType: this.vehicleType === '' ? '' : parseInt(this.vehicleType),
        plateType: this.plateType === '' ? '' : parseInt(this.plateType),
        vehicleColor: this.vehicleColor === '' ? '' : parseInt(this.vehicleColor),
        speedMin: this.speedMin === '' ? '' : parseInt(this.speedMin),
        speedMax: this.speedMax === '' ? '' : parseInt(this.speedMax),
        startTime: parseInt(this.startTime / 1000),
        endTime: parseInt(this.endTime / 1000),
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit
      }
      // 检索基本条件筛选
      if (this.startTime > this.endTime) {
        this.$Notice.warning({
          title: '开始时间不能大于结束时间'
        })
      } else if (parseInt(this.speedMin) > parseInt(this.speedMax)) {
        this.$Notice.warning({
          title: '最小时速不能大于最大时速'
        })
      } else {
        this.getIntellTraRecordPass(params).then(res => {
          console.log('数据是', res)
          if (res.data) {
            let headerInfo = res.headers
            this.pageInfo = {
              pages: parseInt(headerInfo['x-bsc-pages']),
              cur: parseInt(headerInfo['x-bsc-cur']),
              limit: parseInt(headerInfo['x-bsc-limit']),
              counts: parseInt(headerInfo['x-bsc-count'])
            }
          }
          this.tableData = res.data
        }).catch(err => {
          console.log('查询过车记录失败', err)
        })
      }
    },
    // 导出
    Export() {
      let params = {
        cross: this.hkDeviceIndexCode,
        orgId: this.agencyId,
        plateInfo: this.plateInfo,
        vehicleType: this.vehicleType,
        plateType: this.plateType,
        vehicleColor: this.vehicleColor,
        speedMin: this.speedMin,
        speedMax: this.speedMax,
        startTime: this.startTime / 1000,
        endTime: this.endTime / 1000,
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit
      }
      let arr = []
      for (let key in params) {
        arr.push(`${key}=${params[key]}`)
      }
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      this.elemIF.src = `${window.location.origin}/api/intelliTraffic/record/passExport?${arr.join('&')}`
      // this.elemIF.src = `${window.location.origin}/api/intelliTraffic/record/checkExport` // 暂不传参
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
    },
    // 切换页码切换数据
    ChangePage(n) {
      this.pageInfo.cur = n
      this.SearchRecordPass()
    },
    // 切换每页条数
    PageSizeChange(n) {
      this.pageInfo.limit = n
      this.SearchRecordPass()
    },
    imgErr(e) {
      e.target.src = '/static/noImg1.png'
    }
  }
}
</script>

<style scoped lang='less'>
::-webkit-scrollbar {
/*隐藏滚轮*/
  display: none;
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
</style>
<style lang="less">
.lf {
  float: left;
}
.rf {
  float: right;
}
.clearfix:after {
  content: '';
  display: block;
  vertical-align: middle;
  clear: both;
}
.hourPicker {
  .ivu-time-picker-cells-list {
    display: none;
    &:first-child {
      display: block;
      text-align: center;
      width: 100%;
      li {
        text-indent: 60px;
      }
    }
  }
}
.top-secondline{
  margin-top: 20px;
}
.header {
  height: 100px;
  .top-item {
    margin: 0 10px;
    .lab {
      margin-right: 10px;
      display: inline-block;
      width: 60px;
      text-align: center;
    }
  }
  .lookfor{
    margin-right: 10px;
  }
}
.tab-line{
  position: relative;
  background-color: #0f2343;
  height: 43px;
  .arrangement-format {
    position: absolute;
    right: 10px;
    top: 5px;
    span {
      cursor: pointer;
    }
    .icon-4ptz:before {
      color: #3c5073;
      font-size: 24px;
    }
    .icon-180-180:before {
      color: #3c5073;
      font-size: 24px;
    }
    .isActive {
      .icon-4ptz:before {
        color: #44b7fa;
        font-size: 24px;
      }
      .icon-180-180:before {
        color: #44b7fa;
        font-size: 24px;
      }
    }
  }
}
.img-item {
  background-color: #fff;
  position: relative;
  margin-top: 30px;
  cursor: pointer;
  .item-bg {
    width: 100%;
    height: 100%;
  }
  .bottom-model {
    background-color: rgba(0, 0, 0, .7);
    width: 100%;
    height: 50%;
    position: absolute;
    bottom: 0;
    display: block;
    .left-info {
      width: 95%;
      height: 100%;
      p {
        width: 100%;
        font-size: 14px;
        margin-top: 3%;
        margin-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .all-model {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .7);
    position: absolute;
    top: 0;
    display: none;
    .left-info {
      width: 94%;
      height: 100%;
      p {
        width: 100%;
        font-size: 14px;
        margin-top: 3%;
        margin-left: 10px;
      }
    }
  }
}
.img-item:hover {
  .bottom-model {
    display: none;
  }
  .all-model {
    display: block;
  }
}
.modal-img {
  width: 500px;
  height: 350px;
  /*position: relative;*/
  img {
    width: 100%;
    // height: 100%;
  }
  .next {
    position: absolute;
    top: 50%;
    right: 0;
    width: 50px;
    height: 50px;
    margin-top: -25px;
    background-color: rgba(225, 235, 236, 0.5);
    border-radius: 10px 0 0 10px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .prev {
    position: absolute;
    top: 50%;
    left: 0;
    width: 50px;
    height: 50px;
    margin-top: -25px;
    background-color: rgba(225, 235, 236, 0.5);
    border-radius: 0 10px 10px 0;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .tips {
    position: absolute;
    left: 5%;
    bottom: 5%;
    display: block;
    padding: 5px 8px;
    background-color: rgba(0, 0, 0, .5);
    font-size: 14px;
  }
}
.madal-info {
  font-size: 14px;
  div {
    margin-bottom: 20px;
    .span-lable {
      width: 100px;
      text-align: right;
      display: inline-block;
    }
    .span-info {
      display: inline-block;
      width: 200px;
    }
  }
}
.table-box {
  height: calc(~'100%');
  width: 100%;
}
.table-box .table-box-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.passing-record .icon-jiantou:before {
  font-size: 25px;
  color: rgba(0, 0, 0, 0.4);
}
.passing-record .icon-jiantou-copy:before {
  font-size: 25px;
  color: rgba(0, 0, 0, 0.4);
}
</style>
