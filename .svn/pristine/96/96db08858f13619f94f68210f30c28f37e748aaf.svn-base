<template>
  <div class="maintenanceLog bs-content">
    <div class="bs-main">
      <div class="bsMainChild" ref='height'>
        <div class="tab-content-alarm">
          <div class="page-top">
            <span style="padding-left:0px" class="lable-style">开始时间: </span>
            <!-- <DatePicker type="datetime" @on-change="changeStartTime" :value="searchData.valueStart" format="yyyy-MM-dd HH:mm:ss" placeholder="开始时间" style="width: 218px;margin-right:10px"></DatePicker> -->
            <BSdateRange  @timeChange="changeStartTime" :datetime="searchData.valueStart" :width='218' :height='32' style="display: inline-block"></BSdateRange>
            <span class="lable-style">结束时间: </span>
            <!-- <DatePicker type="datetime" @on-change="changeEndTime" :value="searchData.valueEnd" format="yyyy-MM-dd HH:mm:ss" placeholder="结束时间" style="width: 218px"></DatePicker> -->
            <BSdateRange  @timeChange="changeEndTime" :datetime="searchData.valueEnd" :width='218' :height='32' style="display: inline-block"></BSdateRange>
            <label class="lable-style">日志类型</label>
            <Select style="width:150px;margin:0px 10px;" v-model="searchData.choice" placeholder="请选择">
              <Option v-for="item in logTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
             <label class="lable-style">服务器</label>
            <Select style="width:150px;margin:0px 10px;" :disabled="searchData.choice !== '7'" v-model="searchData.serve" placeholder="请选择">
              <Option v-for="item in serveListData" :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
            <div class="input">
              <Form :model="searchData" :rules="deviceFormRole" ref="keyWordRef">
                <Form-item prop="workNum">
                  <Input v-model="searchData.workNum" placeholder="设备名称/IP关键字"></Input>
                </Form-item>
              </Form>
            </div>
            <Button type="ghost" class="btn-style" @click="search('keyWordRef')" style="width:80px;margin-left:10px">
              <span class="iconfont icon-details"></span>查询</Button>
            </Button>
            <Button type="ghost" class="btn-style" @click="exportLog" style="width:80px">
              <span class="iconfont icon-export"></span>导出</Button>
            </Button>
          </div>
          <div class="table-relative">
            <div class="table-body credit-card-record">
              <Table style="margin-top: 20px;" size="small" :columns="logListTitle" :data="logDataList" :height="tableHeight"></Table>
            </div>
          </div>
          <div class="page-style">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
          </div>
          <Modal v-model="detailsModal" title="日志详情" @on-cancel="cancel" width="650">
            <Form ref="formValidate" :model="formValidate" :label-width="100">
                <FormItem label="检索时间：" prop="time">
                    <span>{{formValidate.time}}</span>
                </FormItem>
                <FormItem label="设备名称：" prop="name">
                    <span>{{formValidate.name}}</span>
                </FormItem>
                <FormItem label="所属机构：" prop="organization">
                    <span>{{formValidate.organization}}</span>
                </FormItem>
                <FormItem label="IP地址：" prop="IP">
                    <span>{{formValidate.IP}}</span>
                </FormItem>
                <FormItem label="诊断项：" prop="item">
                    <span>{{formValidate.item}}</span>
                </FormItem>
                <FormItem label="异常项：" prop="abnormal">
                    <span>{{formValidate.abnormal}}</span>
                </FormItem>
                <FormItem label="诊断截图：" prop="screenshot" :label-width="0">
                  <div class="form-img"><img :src="formValidate.screenshot" alt=""></div>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type='ghost' class='commonStyle ivu-btn ivu-btn-ghost' @click="cancel">关闭</Button>
            </div>
        </Modal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import './log.css'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // 关键字校验
    const checkKeyword = (rule, value, callback) => {
      if (this.checkstr(value) > 32) {
        callback(new Error('最多支持输入32字符！'))
      } else {
        callback()
      }
    }
    return {
      formValidate: {
        name: '',
        time: '',
        organization: '',
        IP: '',
        item: '',
        abnormal: '',
        screenshot: ''
      },
      elemIF: null,
      bigtype: '0',
      orgFormRole: 32,
      detailsModal: false,
      searchData: {
        choice: '0',
        valueStart: this.$moment().format('YYYY-MM-DD 00:00:00'),
        valueEnd: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        workNum: '',
        serve: 0
      },
      // 日志类型
      logTypeOptions: [
        { label: '设备上线', value: '0' },
        { label: '设备离线', value: '1' },
        { label: '录像缺失', value: '2' },
        { label: '视频流中断', value: '3' },
        { label: '存储写入失败', value: '4' },
        { label: '服务上线', value: '5' },
        { label: '服务离线', value: '6' },
        { label: '视频诊断异常', value: '7' }
      ],
      // 服务器选择框列表
      serveListData: [],
      startNum: 1,
      // 列表高度
      tableHeight: '',
      // 日志列表数据
      logDataList: [],
      // 日志列表表头
      logListTitle: [
        {
          type: 'index',
          title: '序号',
          width: 150,
          align: 'left'
        },
        {
          title: '时间',
          key: 'createTime',
          width: 200
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 200,
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
                  title: params.row.name
                }
              },
              params.row.name
            )
          }
        },
        {
          title: '设备IP',
          key: 'ip',
          minWidth: 200,
          ellipsis: true
        },
        {
          title: '设备类型',
          key: 'type',
          minWidth: 200,
          ellipsis: true
        },
        {
          title: '所属机构',
          key: 'orgs',
          minWidth: 200,
          ellipsis: true
        },
        {
          title: '日志类型',
          key: 'status',
          minWidth: 200,
          ellipsis: true
        },
        {
          title: '详情',
          key: 'details',
          minWidth: 200,
          ellipsis: true,
          render: (h, params) => {
            let icon = false
            if (params.row.status === '视频诊断') {
              icon = true
            } else {
              icon = false
            }
            return h('div', [
              h('span', {
                class: {
                  iconfont: true,
                  'icon-details': icon
                },
                style: {
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.details(params.row)
                  }
                }
              })
            ])
          }
        }
      ],
      // 诊断项
      diagnosis: [
        {
          vlaue: 'SCSensitivity',
          label: '场景切换异常'
        },
        {
          vlaue: 'ACSensitivity',
          label: '清晰度异常'
        },
        {
          vlaue: 'VCSensitivity',
          label: '人为画面遮挡'
        },
        {
          vlaue: 'ABSensitivity',
          label: '亮度异常'
        },
        {
          vlaue: 'SMSensitivity',
          label: '信号缺失'
        },
        {
          vlaue: 'PFSensitivity',
          label: '画面冻结'
        },
        {
          vlaue: 'NDSensitivity',
          label: '噪声监测'
        },
        {
          vlaue: 'PCSensitivity',
          label: '偏色检测'
        },
        {
          vlaue: 'PTZSensitivity',
          label: 'ptz失控'
        }
      ],
      // 分页
      inPageNum: '',
      pageLimit: this.$PageInfo.limit,
      deviceFormRole: {
        workNum: [{ validator: checkKeyword, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      logData: ({ opsManage }) => opsManage.logData,
      pageShowData: ({ opsManage }) => opsManage.pageShowData,
      logServe: ({ opsManage }) => opsManage.logServe,
      logDetails: ({ opsManage }) => opsManage.logDetails
    })
  },
  created() {
    this.getLogServe().then(res => {
      this.serveListData = this.logServe
      this.search('keyWordRef')
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
    this.tableHeight = this.$refs['height'].offsetHeight - 109
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
    this.elemIF = null
  },
  methods: {
    ...mapActions(['getLogData', 'getLogServe', 'getLogDetails', 'recordLog']),
    getLogList(name) {
      const maintenanceLogParams = {
        start: this.searchData.valueStart ? this.$moment(this.searchData.valueStart).unix() : '',
        end: this.searchData.valueEnd ? this.$moment(this.searchData.valueEnd).unix() : '',
        type: this.searchData.choice,
        // bigtype: this.bigtype,
        seek: this.searchData.workNum,
        page: this.startNum,
        limit: this.pageLimit
      }
      if (this.searchData.choice === '7') {
        if (this.serveListData[0]) {
          maintenanceLogParams.ip = this.serveListData[this.searchData.serve].ip
          maintenanceLogParams.port = this.serveListData[this.searchData.serve].port
        } else {
          this.errorMsg('缺少服务器参数')
        }
      }
      if (maintenanceLogParams.start && maintenanceLogParams.end && maintenanceLogParams.start > maintenanceLogParams.end) {
        this.errorMsg('搜索开始时间不能大于结束时间')
        return
      }
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getLogData(maintenanceLogParams).then(suc => {
            this.logDataList = JSON.parse(JSON.stringify(this.logData))
            if (maintenanceLogParams.type === '7') {
              for (let n = 0; n < this.logData.length; n++) {
                this.logDataList[n].createTime = this.logData[n].time
              }
            } else {
              for (let i = 0; i < this.logData.length; i++) {
                this.logDataList[i].createTime = this.$moment(this.logData[i].createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
              }
            }
            this.inPageNum = Number(this.pageShowData.counts) || 0
          }).catch(err => {
            this.errorMsg('获取列表失败！')
            console.log('getLogData error: ' + err)
          })
        } else {
          this.warningMsg('请填写正确的查询条件')
        }
      })
    },
    // 页面查询按钮
    search(name) {
      this.startNum = 1
      this.getLogList(name)
      let body = {
        logType: '操作日志',
        module: '运维管理',
        operateName: '查询运维日志',
        operateContent: '查询运维日志'
      }
      this.recordLog(body)
    },
    /**
     * 获取日志详情
     */
    details(row) {
      let item = ''
      let abnormal = ''
      this.detailsModal = true
      this.diagnosis.forEach((value, index) => {
        if (row.diagnosis[index] === 0) {
          item += value.label + '、'
        } else {
          abnormal += value.label + '、'
        }
      })
      item = item.slice(0, -1)
      abnormal = abnormal.slice(0, -1)
      this.getLogDetails({ id: row._id, diagnid: row.diagnid }).then(res => {
        this.formValidate.name = row.name
        this.formValidate.time = row.createTime
        this.formValidate.organization = row.orgs
        this.formValidate.IP = row.ip
        this.formValidate.item = item
        this.formValidate.abnormal = abnormal
        if (!this.logDetails.error) {
          this.formValidate.screenshot = 'data:image/png;base64,' + this.logDetails.info.pic
        } else {
          this.formValidate.screenshot = ''
        }
      }).catch(err => {
        console.log(err)
        // this.errorMsg('详情获取失败')
      })
    },
    // 改变开始时间
    changeStartTime(val) {
      this.searchData.valueStart = val.dateTimes
    },
    // 改变结束时间
    changeEndTime(val) {
      this.searchData.valueEnd = val.dateTimes
    },
    // 分页功能
    pageChange(n) {
      this.startNum = n
      this.getLogList('keyWordRef')
    },
    // 每页显示的条数
    pageSizeChange(n) {
      this.pageLimit = n
      this.getLogList('keyWordRef')
    },
    // 日志导出
    exportLog() {
      this.elemIF = document.createElement('iframe')
      if (this.searchData.choice === '7') {
        if (this.serveListData[0]) {
          this.elemIF.src = window.location.origin +
          `/api/setting/operation/logExport?start=${
            this.searchData.valueStart ? this.$moment(this.searchData.valueStart).unix() : ''
          }&end=${
            this.searchData.valueEnd ? this.$moment(this.searchData.valueEnd).unix() : ''
          }&type=${
            this.searchData.choice
          }&seek=${
            this.searchData.workNum
          }&ip=${
            this.serveListData[this.searchData.serve].ip
          }&port=${
            this.serveListData[this.searchData.serve].port
          }`
        } else {
          this.errorMsg('缺少服务器参数')
        }
      } else {
        this.elemIF.src = window.location.origin +
        `/api/setting/operation/logExport?start=${
          this.searchData.valueStart ? this.$moment(this.searchData.valueStart).unix() : ''
        }&end=${
          this.searchData.valueEnd ? this.$moment(this.searchData.valueEnd).unix() : ''
        }&type=${
          this.searchData.choice
        }&seek=${
          this.searchData.workNum
        }`
      }
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
      let body = {
        logType: '操作日志',
        module: '运维管理',
        operateName: '导出运维日志',
        operateContent: '导出运维日志'
      }
      this.recordLog(body)
    },
    // 汉字的字节长度
    checkstr(str) {
      let num = str.length
      let arr = str.match(/[^\\\\\\\\\\\\\\\\x00-\\\\\\\\\\\\\\\\x80]/ig)
      if (arr != null) {
        num += arr.length
      }
      return num
    },
    cancel() {
      this.detailsModal = false
    },
    resizefun() {
      this.tableHeight = this.$refs['height'].offsetHeight - 109
    }
  }
}
</script>

<style scoped>
.bs-main {
  background: #1c3053;
  overflow: hidden;
}
.bsMainChild {
  width: 100%;
  background: #1c3053;
  position: relative;
}
.tab-content-alarm {
  width: 100%;
  height: calc(100% - 16px);
  padding: 0px;
  background: #1c3053;
}
.page-top {
  margin: 16px 0px 0px 24px;
  height: 33px;
  line-height: 33px;
}
.page-top .input {
  width: 200px;
  display: inline-block;
  margin: 0 10px 0 10px;
  padding: 0;
}
.page-top > button {
  margin-right: 10px;
  width: 100px;
}
.table-relative {
  position: relative;
  height: calc(100% - 33px);
  margin: 0px;
  width: 100%;
}
.page-style {
  width: 100%;
  border-top: none;
  /* overflow: hidden; */
  padding: 3px 12px;
  background: #244575;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.table-body {
  position: absolute;
  width: 100%;
  /* height: 100%; */
  box-sizing: border-box;
}
.rt {
  float: right;
}
.lable-style {
  display: inline-block;
  padding-left: 10px;
  height: 32px;
  line-height: 32px;
}
.btn-style {
  margin-right: 8px;
}
.btn-style span {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
}
.form-img{
  width: 100%;
  height: 310px;
  padding-top: 10px;
}
.form-img img{
  width:100%;
  height: 100%;
}
.ivu-form-item{
  margin-bottom: 15px;
}
</style>
