<template>
  <div class="video-monitor bs-content">
    <div class="video-monitor-left bs-left">
      <OrgTree @on-click="treeNodeClick"></OrgTree>
    </div>
    <div class="bs-main">
      <div class="video-monitor-right">
        <div class="video-monitor-right-action clear">
          <div class="fl">
            <Button v-if="false">手动监测</Button>
            <Button icon="refresh" @click="refreshChannelsTable" style="margin-right:8px">刷新</Button>
            <Button @click="exportChannelsTable" style="margin-right:8px">
              <i class="ivu-icon iconfont icon-export" style="font-size:14px;"></i>&nbsp;导出
            </Button>
            <Button type="ghost" @click="addOpenModal" style="margin-right:24px"><Icon type="plus-round"></Icon>创建工单</Button>
            <Select placeholder="在线状态" @on-change="getChannelsTable" v-model="onlineState" style="width: 120px">
              <Option v-for="item in onlineStateOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select placeholder="录像完整性" @on-change="getChannelsTable" v-model="videoFull" style="width:120px;margin-right:24px">
              <Option v-for="item in videoFullOpts" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Checkbox v-model="isChild" @on-change="changeShowChild">显示子机构设备</Checkbox>
            <Tooltip max-width="400" class="help-style iconfont icon-help" placement="bottom">
                <div max-width="400" slot="content">
                  <p>指标详解</p>
                  <p>【在线状态】-指视频通道的在线状态</p>
                  <p>【正在录像】-指视频通道当前是否正在录像</p>
                  <p>【以录时长】-当前通道已经录像的总时长</p>
                  <p>【录像完整率】-指当前通道当日的录像完整率</p>
                </div>
          </Tooltip>
          </div>
          <div class="fr">
            <Input v-model="keywords" @keyup.enter.native="clickSearchButton" placeholder="请输入设备名称、设备IP" style="width: 240px">
              <Button slot="append" @click="clickSearchButton">搜索</Button>
            </Input>
            <!-- <Button @click="clickSearchButton" style="margin-left:8px">搜索</Button> -->
          </div>
        </div>
        <div class="video-monitor-right-table" ref="tableWrap">
          <Table size="small" :height="tableHeight" :columns="channelsTableColumns" @on-selection-change="selectServeRow" :data="channelsTableData" :highlight-row="true" width="100%" style="overflow:auto"></Table>
          <div class="table-footer">
            <div style="float: right;">
              <Page
              :total="channelsCounts"
              :current="pageselect"
              :page-size="pagelimit"
              @on-change="changePageNumber"
              @on-page-size-change="changePageSize"
              :page-size-opts="[20, 50, 100, 200]"
              show-total show-elevator show-sizer></Page>
            </div>
          </div>
        </div>
      </div>
    </div>
    <onlineDetails ref="videoDetails"
                  :modalShow="videoDetailsShow"
                  :timeData="videoDetailsTitle"
                  :detailData="videoDetailsData"
                  :counts="videoDetailsCounts"
                  :onlineColor="onlineColor"
                  :offlineColor="offlineColor"
                  :basicColor="basicColor"
                  :deviceName="activeRow.name"
                  :isDevice="isDevice"
                  modalName="录像详情"
                  onlineName="录像正常"
                  offlineName="录像异常"
                  baseName="未配置录像"
                  @sendData="videoDetailsQuery"
                  @cancel="videoDetailsCancel"></onlineDetails>
  <onlineDetails ref="videoAnalysis"
                  :modalShow="videoAnalysisShow"
                  :timeData="videoAnalysisTitle"
                  :detailData="videoAnalysisData"
                  :counts="videoAnalysisCounts"
                  :onlineColor="onlineColor"
                  :offlineColor="offlineColor"
                  :basicColor="basicColor"
                  :deviceName="activeRow.name"
                  :isDevice="isDevice"
                  modalName="录像详情"
                  onlineName="录像正常"
                  offlineName="录像异常"
                  baseName="未配置录像"
                  @sendData="videoAnalysisQuery"
                  @cancel="videoAnalysisCancel"></onlineDetails>
  <OrderDialog v-if="dialogVisible" :orderTitle="orderTitle" :defaultTreeChecked="changeCheckedArry" :defaultTreeBigType="defaultTreeBigType" :dialogVisible="dialogVisible" @cancel='cancelOrder' ref="orderDialog"></OrderDialog>
  </div>
</template>

<script>
import OrgTree from './videoMonitor/orgTree'
import onlineDetails from '../../components/timeBarDIV/onlineDetails'
import { mapState, mapActions } from 'vuex'
import OrderDialog from './workOrder/OrderDialog'
export default {
  components: {
    OrgTree,
    onlineDetails,
    OrderDialog
  },
  data() {
    return {
      // 表头
      channelsTableColumns: [
        {
          type: 'selection',
          align: 'left',
          width: 80
        },
        {
          title: '序号',
          type: 'index',
          align: 'left',
          width: 80
        },
        {
          title: '通道名称',
          key: 'name',
          align: 'left',
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
          align: 'left'
        },
        {
          title: '在线状态',
          align: 'center',
          render: (h, params) => {
            let color = params.row.status ? '#19be6b' : '#ed3f14'
            return h('div', {
              style: {
                'background': color,
                'margin': '0 auto',
                'height': '10px',
                'width': '10px',
                'border-radius': '50%'
              }
            })
          }
        },
        {
          title: '正在录像',
          key: 'videoing',
          align: 'center',
          render: (h, params) => {
            let text = params.row.state ? '是' : '否'
            return h('span', text)
          }
        },
        {
          title: '已录时长',
          key: 'duration',
          align: 'left',
          render: (h, params) => {
            let time = params.row.videoTime
            let text = ''
            if (typeof time === 'number') {
              text = `${Math.trunc(time / (3600 * 24))}天${Math.trunc(time % (3600 * 24) / 3600)}小时`
            } else {
              text = '--'
            }
            return h('span', text)
          }
        },
        {
          title: '录像完整率',
          key: 'videoRate',
          align: 'left',
          minWidth: 100,
          render: (h, params) => {
            let percent
            let num = Number((params.row.videoRate).slice(0, -1))
            if (num) {
              percent = num
            } else {
              percent = 0
            }
            return h('i-progress', {
              props: {
                'percent': percent
              }
            })
          }
        },
        {
          title: '录像详情',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                'cursor': 'pointer'
              },
              on: {
                click: () => {
                  this.activeRow = params.row
                  this.videoDetailsShow = true
                  this.isDevice = true
                  this.videoDetailsQuery()
                }
              }
            }, [
              h('Icon', {
                props: {
                  type: 'document-text',
                  size: 28
                }
              })
            ])
          }
        },
        {
          title: '分析比对',
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                'cursor': 'pointer'
              },
              on: {
                click: () => {
                  this.activeRow = params.row
                  this.videoAnalysisShow = true
                  this.isDevice = false
                  this.videoAnalysisQuery()
                }
              }
            }, [
              h('Icon', {
                props: {
                  type: 'stats-bars',
                  size: 28
                }
              })
            ])
          }
        },
        {
          title: '最后检测时间',
          key: 'time',
          align: 'left',
          render: (h, params) => {
            let text
            if (Number(params.row.lastTime)) {
              text = this.$moment(params.row.lastTime * 1000).format('YYYY-MM-DD')
            } else {
              text = '--'
            }
            return h('span', text)
          }
        }
      ],
      // 在线状态
      onlineStateOpts: [
        {
          value: 2,
          label: '全部'
        }, {
          value: 1,
          label: '在线'
        }, {
          value: 0,
          label: '离线'
        }
      ],
      // 录像完整率
      videoFullOpts: [
        {
          value: 0,
          label: '全部'
        }, {
          value: 1,
          label: '完整'
        }, {
          value: 2,
          label: '不完整'
        }
      ],
      dialogVisible: false,
      orderTitle: '创建工单',
      changeCheckedArry: [],
      defaultTreeBigType: 0,
      onlineState: 2,
      videoFull: 0,
      isChild: true,
      pagelimit: 20,
      pageselect: 1,
      keywords: '',
      seek: '',
      treeid: '',
      treekey: '',
      isSearch: '',
      tableHeight: 500,
      // 录像详情参数
      videoDetailsShow: false,
      videoDetailsParams: {},
      activeRow: {},
      // 分析比对参数
      videoAnalysisShow: false,
      videoAnalysisParams: {},
      onlineColor: '#62c370',
      basicColor: '#aaaaaa',
      offlineColor: '#c42847',
      isDevice: true,
      elemIF: null,
      newonlineState: '',
      newvideoFull: ''
    }
  },
  computed: {
    ...mapState({
      channelsTableData: ({ opsManage }) => opsManage.channelsTableData, // 录像列表
      channelsCounts: ({ opsManage }) => opsManage.channelsCounts, // 数据总条数
      videoDetailsTitle: ({ opsManage }) => opsManage.videoDetailsTitle,
      videoDetailsCounts: ({ opsManage }) => opsManage.videoDetailsCounts,
      videoDetailsData: ({ opsManage }) => opsManage.videoDetailsData,
      videoAnalysisTitle: ({ opsManage }) => opsManage.videoAnalysisTitle,
      videoAnalysisCounts: ({ opsManage }) => opsManage.videoAnalysisCounts,
      videoAnalysisData: ({ opsManage }) => opsManage.videoAnalysisData
    })
  },
  watch: {
  },
  created() {
    this.paramsInit()
  },
  mounted() {
    this.tableHeight = this.$refs['tableWrap'].offsetHeight - 40
    window.onresize = () => {
      this.tableHeight = this.$refs['tableWrap'].offsetHeight - 40
    }
  },
  methods: {
    ...mapActions(['getChannelTableByTree', 'getVideoDetailsData', 'getVideoAnalysisData', 'recordLog']),
    /**
     * 设置初始值
     */
    paramsInit() {
      this.pageselect = 1
      this.pagelimit = 20
      this.keywords = ''
      this.seek = ''
      this.onlineState = 2
      this.videoFull = 0
    },
    treeNodeClick(params) {
      this.treeid = params.id
      this.treekey = params.key
      this.getChannelsTable()
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
      console.log(val, 'val123')
      this.changeCheckedArry = val
    },
    /**
     * 页码数改变
     */
    changePageNumber(n) {
      this.pageselect = n
      this.getChannelsTable()
    },
    /**
     * 每页条数改变
     */
    changePageSize(n) {
      this.pagelimit = n
      this.getChannelsTable()
    },
    /**
     * 搜索
     */
    clickSearchButton() {
      this.pageselect = 1
      this.seek = this.keywords
      this.getChannelsTable()
    },
    /**
     * 显示子机构设备
     */
    changeShowChild() {
      this.getChannelsTable()
    },
    /**
     * 刷新
     */
    refreshChannelsTable() {
      this.pageselect = 1
      this.getChannelsTable()
    },
    /**
     * 获取录像监测列表
     */
    getChannelsTable() {
      const params = {
        page: this.pageselect,
        limit: this.pagelimit,
        recursion: this.isChild ? 1 : 0,
        seek: this.seek
      }
      if (this.treekey === 'org') {
        params.org = this.treeid
      } else {
        params.server = this.treeid
      }
      if (this.onlineState === 2) {
        params.status = ''
      } else {
        params.status = this.onlineState
      }
      if (this.videoFull === 0) {
        params.RateStatus = ''
      } else {
        params.RateStatus = this.videoFull
      }
      this.getChannelTableByTree(params).then(suc => {
      }).catch(err => {
        console.log('vuex getChannelTableByOrg error: ' + err)
      })
    },
    /**
     * 录像详情弹出框返回数据
     */
    videoDetailsQuery(query) {
      this.videoDetailsParams = query || this.videoDetailsParams
      if (!this.activeRow.ip) {
        return
      }
      this.videoDetailsParams.ip = this.activeRow.ip
      this.videoDetailsParams.channel = this.activeRow.channel
      this.videoDetailsParams.port = this.activeRow.port
      this.getVideoDetailsData(this.videoDetailsParams).catch(err => {
        console.log('getVideoDetailsData err:' + err)
      })
    },
    /**
     * 录像详情关闭
     */
    videoDetailsCancel() {
      this.videoDetailsShow = false
    },
    /**
     * 分析比对弹出框返回数据
     */
    videoAnalysisQuery(query) {
      this.videoAnalysisParams = query || this.videoAnalysisParams
      if (!this.activeRow.ip) {
        return
      }
      this.videoAnalysisParams.ip = this.activeRow.ip
      this.videoAnalysisParams.channel = this.activeRow.channel
      this.videoAnalysisParams.port = this.activeRow.port
      this.getVideoAnalysisData(this.videoAnalysisParams).catch(err => {
        console.log('getVideoAnalysisData err:' + err)
      })
    },
    /**
     * 分析比对弹出框关闭
     */
    videoAnalysisCancel() {
      this.videoAnalysisShow = false
    },
    /**
     * 导出功能
     */
    exportChannelsTable() {
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      let org = ''
      if (this.treekey === 'org') {
        org = 'org'
      } else {
        org = 'server'
      }
      if (this.onlineState !== 2) {
        this.newonlineState = this.onlineState
      }
      if (this.videoFull !== 0) {
        this.newvideoFull = this.videoFull
      }
      this.elemIF.src =
        window.location.origin +
        `/api/setting/operation/videoExport?recursion=${this.isChild ? 1 : 0}&seek=${this.seek}&status=${this.newonlineState}&${org}=${this.treeid}&RateStatus=${this.newvideoFull}`
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
      this.recordLog({ logType: '操作日志', module: '运维管理', operateName: '导出录像检测列表', operateContent: '导出录像检测列表' })
    }
  },
  beforeDestroy() {
    this.elemIF = null
  }
}
</script>
<style>
.video-monitor .ivu-tooltip-inner {
  max-width: none !important;
}
</style>
<style scoped>
/* 公共样式 */
.fl {
  float: left;
}
.fr {
  float: right;
}
.clear:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
/* 整体左右布局 */
.video-monitor {
  padding: 20px 0;
  width: 100%;
  height: 100%;
}
.video-monitor-right {
  height: 100%;
  width: 100%;
  background: #1c3053;
}
.bs-main {
  padding: 0;
  background-color: #0c1b32;
  overflow: hidden;
}
/* 右侧按钮布局及样式 */
.video-monitor-right-action {
  background-color: #1c3054;
  padding: 12px 24px;
}
.video-monitor-right-action > div:nth-child(1) > .ivu-btn,
.ivu-select {
  margin-right: 12px;
}
/* 右侧表格布局 */
.video-monitor-right-table {
  height: calc(100% - 56px);
}
/* .help-style {
  font-size: 14px;
  color: #fda54b;
  cursor: pointer;
} */
.help-style {
  /* position: absolute;
  top: -47px;
  left: 580px; */
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
}
.help-style:hover {
  color: #fda54b;
}
</style>
