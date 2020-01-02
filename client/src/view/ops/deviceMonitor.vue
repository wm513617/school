<template>
  <div id="device-monitor" class="video-monitor bs-content" >
    <div class="video-monitor-left bs-left">
      <BsOrgTree :orgType="0" orgTitle="选择机构" :isSetting="false" @call='clickTree'></BsOrgTree>
    </div>
    <div class="bs-main" ref='bsMain'>
      <div class="video-monitor-right">
        <TableTab @on-tab-click="changeTab" :tabs="deviceTabs" :isCount="true"></TableTab>
        <div class="tab-content">
          <div class="feature-btn">
            <Button type="ghost" class="btn-style" @click="deviceExport">
              <span class="iconfont icon-export"></span>导出</Button>
            <Button type="ghost" class="btn-style" @click="refresh">
              <span class="iconfont icon-refresh"></span>刷新</Button>
            <Button type="ghost" class="btn-style" @click="addOpenModal" v-if="activeTab !== 4">
              <span class="iconfont icon-add"></span>创建工单</Button>
            <Checkbox v-model="never" style="margin-left:24px">显示子机构资源</Checkbox>
              <Tooltip max-width="400" class="help-style iconfont icon-help" placement="bottom">
                <div max-width="400" slot="content">
                  <p>指标详解</p>
                  <p>【在线状态】-指设备通过心跳监测是否在线</p>
                  <p>【在线率】-当日在线时长/当日至当前时间的时长，是一个相对比值</p>
                  <p>【离线时长】- 当日，设备离线的总时长</p>
                </div>
            </Tooltip>
            <!-- <Button @click="updateData(1)" class="rt" style="margin-left:8px">搜索</Button> -->
            <Input v-model="inSearchName" placeholder="请输入设备名称或设备IP" style="width: 240px;" class="rt">
            <Button slot="append" @click="updateData(1)">搜索</Button>
            </Input>
            <div class="rt interval" v-if="activeTab === 0 || activeTab === 1 || activeTab === 2">
              <div class="lf">在线率：</div>
              <Select v-model="onLineRate" style="width:125px" class="rt">
                <Option v-for="item in onLineRates" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="rt interval">
              <div class="lf">在线状态：</div>
              <Select v-model="onLineState" style="width:125px" class="rt">
                <Option v-for="item in onLineStates" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <VideoEquipment v-if="activeTab === 0" :tableHeight='tableHeight' @openModal='openModal' :videoData='videoData' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor' @changeChecked="changeChecked"></VideoEquipment>
          <WarningFacility v-if="activeTab === 1" :tableHeight='tableHeight' @openModal='openModal' :videoData='alarmData' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor' @changeChecked="changeChecked"></WarningFacility>
          <FireFightingApparatus v-if="activeTab === 2" :tableHeight='tableHeight' @openModal='openModal' :videoData='fireControlData' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor' @changeChecked="changeChecked"></FireFightingApparatus>
          <DecodingDevice v-if="activeTab === 3" :tableHeight='tableHeight' @openModal='openModal' :videoData='decodeData' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor' @changeChecked="changeChecked"></DecodingDevice>
          <!-- <Servers v-if="activeTab === 4" :tableHeight='tableHeight' @openModal='openModal' :videoData='videoData' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor'></Servers> -->
          <PlatformServices v-if="activeTab === 4" :tableHeight='tableHeight' @openModal='openModal' :videoData='platformServices' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor' @changeChecked="changeChecked"></PlatformServices>
          <div class="table-footer">
            <div class="rt">
              <Page show-sizer :page-size-opts="[20, 50, 100, 200]" @on-page-size-change="pageSizeChange" :show-total="true" :show-elevator="true" :total="inPageTotal" :page-size="inpageLimit" :current="inPageCur"  @on-change="pageChange"></Page>
            </div>
          </div>
        </div>
      </div>
      <OnlineDetails :pageNumProp='pageNumProp' :pageNumArray='pageNumArray' :timeData='onlineTime' :counts='onlineTimeDataCounts' :detailData='onlineTimeData' :modalShow='modalShow' @cancel='cancel' :offlineColor='offlineColor' :onlineColor='onlineColor' :basicColor='basicColor' @sendData='getTimeData' :deviceName='deviceName'></OnlineDetails>
    </div>
    <OrderDialog v-if="dialogVisible" :orderTitle="orderTitle" :defaultTreeChecked="changeCheckedArry" :defaultTreeBigType="defaultTreeBigType" :dialogVisible="dialogVisible" @cancel='cancelOrder' ref="orderDialog"></OrderDialog>
  </div>
</template>

<script>
import TableTab from '../settings/equipment/tableTab'
import { mapActions, mapState } from 'vuex'
import BsOrgTree from '../../components/BSorgTree.vue'
import OnlineDetails from '../../components/timeBarDIV/onlineDetails.vue'
import DecodingDevice from './deviceModule/DecodingDevice'
import FireFightingApparatus from './deviceModule/FireFightingApparatus'
import PlatformServices from './deviceModule/PlatformServices'
// import Servers from './deviceModule/Servers'
import VideoEquipment from './deviceModule/VideoEquipment'
import WarningFacility from './deviceModule/WarningFacility'
import OrderDialog from './workOrder/OrderDialog'
export default {
  components: {
    BsOrgTree,
    OnlineDetails,
    VideoEquipment,
    DecodingDevice,
    FireFightingApparatus,
    PlatformServices,
    // Servers,
    WarningFacility,
    TableTab,
    OrderDialog
  },
  data() {
    return {
      pageNumProp: 15,
      pageNumArray: [15, 30],
      elemIF: null,
      tableHeight: 420,
      inPageCur: 1,
      inpageLimit: 20,
      inSearchName: '',
      activeTab: 0,
      DOMBsMain: null,
      onlineColor: '#62c370',
      basicColor: '#aaaaaa',
      offlineColor: '#c42847',
      onLineState: 0,
      onLineStates: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '在线'
        },
        {
          value: 2,
          label: '离线'
        }
      ],
      onLineRate: 0,
      onLineRates: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '异常'
        }
      ],
      modalShow: false,
      deviceTabs: [
        {
          title: '视频设备',
          value: 0,
          disabled: false,
          active: true,
          number: 0
        },
        {
          title: '报警设备',
          value: 1,
          disabled: false,
          active: false,
          number: 0
        },
        {
          title: '消防设备',
          value: 2,
          disabled: false,
          active: false,
          number: 0
        },
        {
          title: '解码设备',
          value: 3,
          disabled: false,
          active: false,
          number: 0
        },
        // {
        //   title: '服务器',
        //   value: 4,
        //   disabled: false,
        //   active: false,
        //   number: 0
        // },
        {
          title: '平台服务',
          value: 4,
          disabled: false,
          active: false,
          number: 0
        }
      ],
      never: true,
      selectedRow: null,
      OnlineDetailsDate: null,
      deviceName: '',
      dialogVisible: false,
      orderTitle: '创建工单',
      orderId: '',
      changeCheckedArry: [],
      defaultTreeBigType: 0
    }
  },
  computed: {
    ...mapState({
      videoData: ({ opsManage }) => opsManage.videoData,
      onlineTime: ({ opsManage }) => opsManage.onlineTime,
      onlineTimeData: ({ opsManage }) => opsManage.onlineTimeData,
      inPageTotal: ({ opsManage }) => opsManage.inPageTotal,
      deviceNum: ({ opsManage }) => opsManage.deviceNum,
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId,
      onlineTimeDataCounts: ({ opsManage }) => opsManage.onlineTimeDataCounts,
      alarmData: ({ opsManage }) => opsManage.alarmData,
      fireControlData: ({ opsManage }) => opsManage.fireControlData,
      decodeData: ({ opsManage }) => opsManage.decodeData,
      platformServices: ({ opsManage }) => opsManage.platformServices
    })
  },
  watch: {
    onLineState() {
      this.updateData(1)
    },
    activeTab(val) {
      this.updateData(1)
    },
    never() {
      this.updateData(1)
    },
    onLineRate() {
      this.updateData(1)
    }
  },
  created() {},
  mounted() {
    this.DOMBsMain = this.$refs['bsMain']
    this.$nextTick(function() {
      this.tableHeight = this.DOMBsMain.offsetHeight - 136
    })
    window.onresize = () => {
      // 固定分页位置
      this.tableHeight = this.DOMBsMain.offsetHeight - 136
    }
  },
  beforeDestroy() {
    window.onresize = null
    this.elemIF = null
  },
  methods: {
    ...mapActions(['getDeviceData', 'getDeviceNum', 'getOnlineTime', 'recordLog']),
    addOpenModal() { // 创建工单
      if (this.changeCheckedArry.length > 0) {
        this.orderTitle = '创建工单'
        const treeBigType = [0, 2, 3, 9, 12]
        this.defaultTreeBigType = treeBigType[this.activeTab]
        this.dialogVisible = true
      } else {
        this.$Notice.warning({ title: '警告', desc: '请选择一个设备' })
      }
    },
    changeChecked(val) {
      console.log(val, 'val')
      this.changeCheckedArry = val
    },
    cancelOrder(val) { // 关闭工单弹窗
      this.dialogVisible = val
    },
    getData(n) {
      // 获取详细数据
      if (n) {
        this.inPageCur = n
      }
      const params = {}
      params.page = this.inPageCur
      params.limit = this.inpageLimit
      params.bigtype = this.activeTab
      params.seek = this.inSearchName
      if (Number(this.activeTab) !== 4) { // 平台服务模块与其他模块参数不同
        if (this.onLineRate === 0) {
          params.OnlineRateStatus = ''
        } else {
          params.OnlineRateStatus = this.onLineRate
        }
        params.never = this.never ? -1 : 0
        if (this.onLineState === 1) {
          params.status = true
        } else if (this.onLineState === 2) {
          params.status = false
        } else {
          params.status = ''
        }
      } else {
        if (this.onLineState === 0) {
          params.status = ''
        } else {
          params.status = this.onLineState
        }
      }
      this.getDeviceData(JSON.parse(JSON.stringify(params))).catch(() => {
        this.$Notice.error({ title: '失败', desc: '获取设备详情失败' })
      })
    },
    refresh() {
      // 刷新
      this.inPageCur = 1
      const params = {}
      params.page = this.inPageCur
      params.limit = this.inpageLimit
      params.bigtype = this.activeTab
      params.seek = this.inSearchName
      if (Number(this.activeTab) !== 4) { // 平台服务模块与其他模块参数不同
        if (this.onLineRate === 0) {
          params.OnlineRateStatus = ''
        } else {
          params.OnlineRateStatus = this.onLineRate
        }
        params.never = this.never ? -1 : 0
        if (this.onLineState === 1) {
          params.status = true
        } else if (this.onLineState === 2) {
          params.status = false
        } else {
          params.status = ''
        }
      } else {
        if (this.onLineState === 0) {
          params.status = ''
        } else {
          params.status = this.onLineState
        }
      }
      this.getDeviceData(JSON.parse(JSON.stringify(params)))
        .then(suc => {
          this.$Notice.success({ title: '成功', desc: '刷新成功' })
        })
        .catch(() => {
          this.$Notice.error({ title: '失败', desc: '刷新失败' })
        })
    },
    getEquipmentNum() {
      // 获取设备数量
      this.getDeviceNum(this.never)
        .then(res => {
          this.deviceNum.forEach((e, index) => {
            this.deviceTabs[index].number = e
          })
        })
        .catch(() => {
          this.$Notice.error({ title: '失败', desc: '获取设备数量失败' })
        })
    },
    changeTab(obj) {
      // 切换标签页清空设置
      this.onLineState = 0
      this.onLineRate = 0
      this.inSearchName = ''
      this.changeCheckedArry = []
      this.activeTab = JSON.parse(JSON.stringify(obj.index))
    },
    openModal(row) {
      // 打开详情模块
      this.modalShow = true
      this.selectedRow = row
      this.getOnlineTimeData()
    },
    getOnlineTimeData() {
      // 获取在线详情数据
      if (!this.selectedRow) {
        return
      }
      let params = {}
      params = JSON.parse(JSON.stringify(this.OnlineDetailsDate))
      this.deviceName = this.selectedRow.name
      params.ip = this.selectedRow.ip
      params.port = this.selectedRow.cport
      params.type = this.selectedRow.serverType
      if (this.activeTab !== 4) {
        params.LogType = 1
      } else {
        params.LogType = 3
      }
      this.getOnlineTime(params)
        .then(res => {
        })
        .catch(() => {
          this.$Notice.error({ title: '失败', desc: '获取设备在线时长失败' })
        })
    },
    deviceExport() {
      // 导出
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      if (Number(this.activeTab) !== 4) {
        this.elemIF.src =
        window.location.origin +
        `/api/setting/operation/deviceExport?oid=${this.orgActiveId}&bigtype=${this.activeTab}&never=${
          this.never ? -1 : 0
        }`
      } else {
        this.elemIF.src =
        window.location.origin +
        `/api/setting/operation/deviceExport?oid=${this.orgActiveId}&bigtype=${this.activeTab}&seek=${this.inSearchName}&status=${this.onLineState === 0 ? '' : this.onLineState}`
      }
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
      this.recordLog({ logType: '操作日志', module: '运维管理', operateName: '导出设备检测列表', operateContent: '导出设备检测列表' })
    },
    cancel(val) {
      // 关闭详情模块
      this.modalShow = val
    },
    clickTree() {
      // 点击机构数更新数据
      this.inPageCur = 1
      this.updateData()
    },
    updateData(page) {
      // 更新全部数据
      this.getData(page)
      this.getEquipmentNum()
    },
    pageChange(n) {
      // 切换页面
      this.inPageCur = n
      this.getData()
    },
    pageSizeChange(n) {
      // 切换每页数量
      this.inpageLimit = n
      this.getData()
    },
    getTimeData(data) {
      // 获取详情页配置信息
      this.OnlineDetailsDate = data
      this.getOnlineTimeData()
    }
  }
}
</script>
<style>
#device-monitor .ivu-tooltip-inner {
  max-width: none !important;
}
</style>
<style scoped>
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
.page-style {
  width: 100%;
  height: 40px;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px;
  background: #244575;
}
.lf {
  float: left;
}

.rt {
  float: right;
}
.tab-content {
  display: flex;
  flex-direction: column;
  background: #1c3053;
}
.feature-btn {
  margin: 12px 24px;
  height: 32px;
  line-height: 32px;
  position: relative;
}
.btn-style {
  margin-right: 8px;
}
.btn-style span {
  display: inline-block;
  margin-right: 5px;
  font-size: 12px;
}
.interval {
  margin-right: 8px;
}
.help-style {
  /* position: absolute;
  top: -47px;
  left: 710px; */
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
}
.help-style:hover {
  color: #fda54b;
}
</style>
