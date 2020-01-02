<template>
    <div class="video-diagnostic" v-resize="resize">
        <div class="video-diagnostic-l">
            <BsOrgTree :orgType="0" orgTitle="选择机构" :isSetting="false" @call='clickTree'></BsOrgTree>
        </div>
        <div class="video-diagnostic-r">
           <div class="video-diagnostic-r-table-title">
               <Button class="btn-rt lf" type="ghost" icon="ios-loop-strong" @click="getVideoDiagnosticList(1)">刷新</Button>
               <Button class="btn-rt lf" type="ghost" icon="archive" @click="deviceExport" style="margin-right:8px">导出</Button>
               <Button class="btn-rt lf" type="ghost" @click="addOpenModal" style="margin-right:24px"><Icon type="plus-round"></Icon>创建工单</Button>
               <Checkbox v-model="isShowSubMechanism" class="chk-style lf"  @on-change="resetPaging">显示子机构设备</Checkbox>
               <!-- <div class="btn-rt rt">
                <Button type="ghost" @click="resetPaging">搜索</Button>
               </div> -->
               <div class="btn-rt rt">
                  <Input v-model="keyword" :disabled="isAssetType || isAssetStatus" placeholder="请输入设备名称或设备IP" style="width: 240px">
                    <Button slot="append" @click="resetPaging">搜索</Button>
                  </Input>
               </div>
               <div class="btn-rt rt">
                    <span>诊断异常项：</span>
                    <Select @on-change="resetPaging" :disabled="isAssetType || isSearch"  v-model="assetStatus" style="width:150px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
               </div>
               <div class="btn-rt rt">
                    <span>在线状态：</span>
                    <Select @on-change="resetPaging" :disabled="isAssetStatus || isSearch"  v-model="assetType" style="width:150px">
                        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
               </div>
           </div>
           <div class="video-diagnostic-r-table" ref="tableBox">
                <Table size="small" :height="tableHeight" @on-selection-change="selectServeRow" :columns="columns" :data="tableData"></Table>
           </div>
           <div class="video-diagnostic-footer">
             <div class="video-diagnostic-page rt">
                <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :total="total" :page-size="pagesize" :current="page" @on-change="onChange" @on-page-size-change="onPageSizeChange"></Page>
             </div>
           </div>
        </div>
        <Modal v-model="particulars" scrollable width="1200" cancel-text='关闭' @on-cancel="clearAwayVideoParam" class-name='diagnostic-modal'>
            <p slot="header" style="color:#fff">
              <span>诊断详情</span>
              <span class="two-title"> - {{titleHeader}}</span>
            </p>
            <div class="modal-sum">
              <div class="modal-preview">
                <div class="modal-preview-l">
                  <div class="modal-preview-l-t">
                    实时视频
                  </div>
                  <div class="modal-preview-l-b">
                    <AlarmMainPreview :showCloseBtn="false" :videoWidth="580" :videoParam="videoParam"></AlarmMainPreview>
                  </div>
                </div>
                <div class="modal-preview-r">
                  <div class="modal-preview-r-t">
                   诊断截图
                  </div>
                  <div class="modal-preview-r-b">
                    <img ref="diagnoseImg">
                  </div>
                </div>
              </div>
              <div class="modal-status">
                <div class="modal-status-t">
                  <ul>
                    <li v-for="(item, index) in diagnoseStatusList" v-html="item" :key="index"></li>
                  </ul>
                </div>
                <div class="modal-status-b">
                  <ul>
                    <li v-for="(item, index) in statusArry" :key="index" class="diagnostic-status">
                      <div :style="{'backgroundColor': item === 1 ? 'red' : item === 0 ? '#19be6b' : '#ccc'}"></div>
                    </li>
                    <li>{{endTime}}</li>
                  </ul>
                </div>
              </div>
            </div>
        </Modal>
        <OrderDialog v-if="dialogVisible" :orderTitle="orderTitle" :defaultTreeChecked="changeCheckedArry" :defaultTreeBigType="defaultTreeBigType" :dialogVisible="dialogVisible" @cancel='cancelOrder' ref="orderDialog"></OrderDialog>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import BsOrgTree from '../../components/BSorgTree.vue'
import AlarmMainPreview from '../../view/warning/AlarmMainPreview'
import { getVideoDiagnosticListApi, getVideoDiagnosticDetailsApi } from '../../http/opsManage/diagnostic.api.js'
// import { constants } from 'fs'
import OrderDialog from './workOrder/OrderDialog'
export default {
  data() {
    return {
      // 开流传参
      videoParam: {},
      tableHeight: '',
      isAssetType: false,
      isAssetStatus: false,
      isSearch: false,
      diagnoseStatusList: ['信号<br/>缺失', '清晰度<br/>异常', '画面<br/>遮挡', '场景<br/>切换', '亮度<br/>异常', '画面<br/>冻结', '噪声<br/>检测', '偏色<br/>检测', 'PTZ<br/>失控', '最后检测时间'],
      pagesize: 100,
      page: 1,
      total: 0,
      statusArry: [1, 2, 3, 2, 1, 6, 3, 7, 5],
      tableData: [],
      endTime: '2018-10-18 15:16:06',
      titleHeader: '1号楼摄像头',
      particulars: false,
      isShowSubMechanism: true,
      assetStatus: 0,
      assetType: 2,
      keyword: '',
      dialogVisible: false,
      orderTitle: '创建工单',
      changeCheckedArry: [],
      defaultTreeBigType: 0,
      statusList: [
        { value: 0, label: '全部' },
        { value: 1, label: '场景切换' },
        { value: 2, label: '清晰度异常' },
        { value: 3, label: '画面遮挡' },
        { value: 4, label: '亮度异常' },
        { value: 5, label: '信号缺失' },
        { value: 6, label: '画面冻结' },
        { value: 7, label: '噪声监测' },
        { value: 8, label: '偏色监测' },
        { value: 9, label: 'PTZ失控' }
      ],
      typeList: [
        { value: 0, label: '离线' },
        { value: 1, label: '在线' },
        { value: 2, label: '全部' }
      ],
      columns: [
        {
          type: 'selection',
          align: 'left',
          width: 60
        },
        {
          type: 'index',
          width: 80,
          title: '序号'
        },
        {
          title: '通道名称',
          minWidth: 160,
          ellipsis: true,
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
          title: '在线状态',
          ellipsis: true,
          align: 'center',
          render: (h, params) => {
            let backgroundColor = params.row.status === 0 ? 'red' : '#19be6b'
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '设备IP',
          key: 'ip',
          width: 160
        },
        {
          title: '信号缺失',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[0] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '清晰度异常',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[1] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '画面遮挡',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[2] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '场景切换',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[3] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '亮度异常',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[4] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '画面冻结',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[5] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '噪声检测',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[6] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '偏色检测',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[7] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: 'PTZ失控',
          align: 'center',
          render: (h, params) => {
            let backgroundColor
            if (params.row.diagnosis) {
              if (params.row.diagnosis[8] === 0) {
                backgroundColor = '#19be6b'
              } else {
                backgroundColor = 'red'
              }
            } else {
              backgroundColor = '#ccc'
            }
            return h('div', {
              style: {
                borderRadius: '50%',
                width: '15px',
                height: '15px',
                backgroundColor: backgroundColor,
                margin: '0 auto'
              }
            })
          }
        },
        {
          title: '最后检测时间',
          align: 'center',
          width: 160,
          render: (h, params) => {
            let str = params.row.time
            if (str) {
              str = params.row.time
            } else {
              str = '-'
            }
            return h('span', str)
          }
        },
        {
          title: '诊断详情',
          align: 'center',
          key: 'details',
          render: (h, params) => {
            return h('span',
              {
                on: {
                  click: () => {
                    this.getVideoDiagnosticDetails(params.row._id, params.row.diagnid)
                    this.endTime = params.row.time
                    this.titleHeader = params.row.name
                    this.statusArry = params.row.diagnosis || [2, 2, 2, 2, 2, 2, 2, 2, 2]
                    this.particulars = true
                    this.videoParam = {
                      id: params.row._id,
                      ip: params.row.ip,
                      port: params.row.cport,
                      channel: params.row.chan,
                      streamType: params.row.stream,
                      type: 'video',
                      vendor: params.row.manufacturer
                    }
                  }
                }
              },
              [
                h('Icon', {
                  props: {
                    type: 'clipboard',
                    size: 18
                  },
                  style: {
                    cursor: 'pointer'
                  }
                })
              ]
            )
          }
        }
      ]
    }
  },
  components: {
    BsOrgTree,
    AlarmMainPreview,
    OrderDialog
  },
  computed: {
    ...mapState({
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId
    })
  },
  watch: {
    assetStatus(val) {
      if (val !== 0) {
        this.isAssetStatus = true
      } else {
        this.isAssetStatus = false
      }
    },
    assetType(val) {
      if (val !== 2) {
        this.isAssetType = true
      } else {
        this.isAssetType = false
      }
    },
    keyword(val) {
      if (val !== '') {
        this.isSearch = true
      } else {
        this.isSearch = false
      }
    }
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 96
  },
  methods: {
    ...mapActions(['recordLog']),
    clearAwayVideoParam() {
      this.videoParam = {}
    },
    resize() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight - 96
    },
    onPageSizeChange(val) {
      this.page = 1
      this.pagesize = val
      this.getVideoDiagnosticList()
    },
    onChange(val) {
      this.page = val
      this.getVideoDiagnosticList()
    },
    clickTree() {
      this.resetPaging()
    },
    addOpenModal() { // 创建工单
      if (this.changeCheckedArry.length > 0) {
        this.orderTitle = '创建工单'
        // const treeBigType = [0, 2, 3, 9, 12]
        // this.defaultTreeBigType = treeBigType[this.activeTab]
        this.dialogVisible = true
      } else {
        this.$Notice.warning({ title: '警告', desc: '请选择一个设备' })
      }
    },
    cancelOrder(val) { // 关闭工单弹窗
      this.dialogVisible = val
    },
    selectServeRow(val) {
      console.log(val, 'val')
      this.changeCheckedArry = val
    },
    // 需要重置分页
    resetPaging() {
      this.page = 1
      this.getVideoDiagnosticList()
    },
    // 获取视频诊断列表
    getVideoDiagnosticList(val) {
      let recursion = this.isShowSubMechanism ? 1 : 0
      const params = {
        oid: this.orgActiveId,
        page: this.page,
        limit: this.pagesize,
        recursion: recursion, // 是否查询子机构
        diagnosis: this.assetStatus, // 异常类别
        seek: this.keyword
      }
      if (this.assetType === 2) {
        params.status = ''
      } else {
        params.status = this.assetType
      }
      getVideoDiagnosticListApi(params).then(res => {
        this.tableData = res.data
        if (res.data.length !== 0) {
          this.total = Number(res.headers['x-bsc-count'])
        } else {
          this.total = 0
        }
        if (val) {
          this.$Notice.success({ title: '成功', desc: '列表获取成功' })
        }
      }).catch(err => {
        this.$Notice.error({ title: '失败', desc: '列表获取失败' })
        console.log(err)
      })
    },
    // 获取诊断详情
    getVideoDiagnosticDetails(id, diagnid) {
      getVideoDiagnosticDetailsApi(id, diagnid).then(res => {
        this.$refs['diagnoseImg'].src = `data:image/png;base64,${res.data.pic}`
      }).catch(err => {
        this.$refs['diagnoseImg'].src = ``
        console.log(err)
        this.$Notice.error({ title: '失败', desc: '诊断详情获取失败！' })
      })
    },
    deviceExport() {
      // 导出
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      let recursion, status
      recursion = this.isShowSubMechanism ? 1 : 0
      if (this.assetType === 2) {
        status = ''
      } else {
        status = this.assetType
      }
      this.elemIF.src = window.location.origin + `/api/setting/operation/videoDiagnosis/export?oid=${this.orgActiveId}&recursion=${recursion}&diagnosis=${this.assetStatus}&status=${status}`
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
      this.recordLog({ logType: '操作日志', module: '运维管理', operateName: '导出诊断结果', operateContent: '导出诊断结果' })
    }
  }
}
</script>
<style>
.diagnostic-modal .ivu-btn-primary {
  display: none;
}
</style>
<style scoped>
.lf {
  float: left;
}
.rt {
  float: right;
}
.video-diagnostic {
    min-width: 1600px;
    width: 100%;
    height: 100%;
    padding: 20px 0;
    display: flex;
}
.video-diagnostic-l {
    width: 272px;
    background: #1b3153;
    margin-right: 16px;
}
.video-diagnostic-r {
    flex: 1;
    background: #1c3053;
    position: relative;
    display: flex;
    flex-direction: column;
}
.video-diagnostic-r-table {
  position: absolute;
  top: 56px;
  width: 100%;
  height: 100%;
  flex: 1;
}
.video-diagnostic-r-table-title {
    background-color: #1c3054;
    padding: 12px 36px 12px 24px;
    overflow: hidden;
}
.btn-rt {
  margin-right: 8px;
}
.chk-style {
  height: 30px;
  line-height: 30px;
}
.two-title {
  font-size: 12px;
}
.modal-sum {
  height: 500px;
  display: flex;
  flex-direction: column;
}
.modal-preview {
  flex: 1;
  display: flex;
}
.modal-status {
  height: 100px;
  display: flex;
  flex-direction: column;
}
.modal-status-t {
  flex: 1;
}
.modal-status-b {
  flex: 1;
}
.modal-preview-l {
  width: 550px;
  margin-right: 56px;
  display: flex;
  flex-direction: column;
}
.modal-preview-r {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.modal-preview-l-t,.modal-preview-r-t {
  height: 20px;
  background-color: #ccc;
  padding-left: 8px;
  line-height: 20px;
  color: #000;
}
.modal-preview-l-b {
  flex: 1;
}
.modal-preview-l-b .mapVideoPreview {
  padding: 0px!important;
}
.modal-preview-r-b {
  width: 100%;
  height: 363px;
  background: #F7F7F7;
}
.modal-preview-r-b img {
  width: 100%;
  height: 100%;
}
.modal-status-t ul,.modal-status-b ul {
  display: flex;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.modal-status-t ul li,.modal-status-b ul li {
  flex: 1;
  font-size: 12px;
}
.modal-status-t ul li:last-of-type,.modal-status-b ul li:last-of-type {
  flex: none;
  width: 120px;
  line-height: 35.2px;
  text-align: center;
}
.diagnostic-status div{
  background-color: red;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-left: 7px;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
.video-diagnostic-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
  padding: 3px 10px;
  background-color: #244575;
}
</style>
