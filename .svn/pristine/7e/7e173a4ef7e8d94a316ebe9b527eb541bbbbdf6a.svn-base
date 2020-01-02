<template>
  <div class="asset-manage bs-content" v-resize="resize">
    <div class="asset-manage-left bs-left">
      <BsOrgTree :orgType="0" orgTitle="选择机构" :isSetting="false" @call='clickTree'></BsOrgTree>
    </div>
    <div class="bs-main">
      <div class="asset-manage-right">
        <div class="asset-chart">
          <p class="asset-title">资产统计
              <i id="chart-refresh" class="ivu-icon ivu-icon-refresh" @click="getChartList(1)"></i>
          </p>
          <assetChart :isRoot="isRootOrg" :chartList="chartList"></assetChart>
        </div>
        <div class="asset-table">
          <p class="asset-title">详细信息</p>
          <div class="table-btn">
            <Button class="btn-rt lf" type="ghost" icon="edit" @click="openAsset(0)">修改</Button>
            <Button @click="assetsInitList(1)" class="btn-rt lf" type="ghost" icon="ios-loop-strong">刷新</Button>
            <Button class="btn-rt lf" type="ghost" icon="archive" @click="deviceExport">导出</Button>
            <Button class="btn-rt lf" type="ghost" icon="settings" @click="openRepair" style="margin-right:24px">设置维保</Button>
            <Checkbox v-model="isShowSubMechanism" @on-change="resetPaging" class="chk-style lf">显示子机构设备</Checkbox>
            <!-- <div class="btn-rt rt">
              <Button type="ghost" @click="resetPaging" icon="ios-search">搜索</Button>
            </div> -->
            <div class="btn-rt rt">
              <Input v-model="keyword" placeholder="请输入设备名称或设备IP" style="width: 240px">
                <Button slot="append" @click="resetPaging">搜索</Button>
              </Input>
            </div>
            <div class="btn-rt rt">
              <span>维保状态：</span>
              <Select @on-change="resetPaging"  v-model="assetStatus" style="width:150px">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="btn-rt rt">
              <span>资产类型：</span>
              <Select @on-change="resetPaging"  v-model="assetType" style="width:150px">
                <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="table-box" style="height: calc(100% - 94px);" ref="tableBox">
            <Table @on-selection-change="selectionChange" size="small" :height="tableHeight" :columns="columns" :data="tableData"></Table>
            <div class="table-footer">
              <div class="rt">
                <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true" :show-elevator="true" :total="inPageTotal" :page-size="inpageLimit" :current="inPageCur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <assetModal :Allnumtype="Allnumtype.label" :listDetails="listDetails" :detailList="detailList" @modificationSave="modificationSave" :assetTitle="assetTitle" :assetShow="assetSwitch" :repairShow="repairSwitch" :edit="isEdit" :selected="assetSelected" @cancel="closeModal" @installMaintenance="installMaintenance"></assetModal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BsOrgTree from '../../components/BSorgTree.vue'
import assetChart from './assetManage/assetChart.vue'
import assetModal from './assetManage/assetModal.vue'
export default {
  name: 'assetManage',
  components: {
    BsOrgTree,
    assetChart,
    assetModal
  },
  data() {
    return {
      typeList: [
        { value: '0', label: '摄像机', type: 'type', typeValue: 0 },
        { value: '1', label: '录像机', type: 'type', typeValue: 'nvr' },
        { value: '2', label: '报警主机', type: 'bigtype', typeValue: 1 },
        { value: '3', label: '消防主机', type: 'bigtype', typeValue: 7 },
        { value: '4', label: '报警探头', type: 'type', typeValue: 1 },
        { value: '5', label: '消防探头', type: 'type', typeValue: 11 },
        { value: '6', label: '报警柱', type: 'type', typeValue: 13 },
        { value: '7', label: '报警箱', type: 'type', typeValue: 14 },
        { value: '8', label: '闸机', type: 'bigtype', typeValue: 2 },
        { value: '9', label: '解码器', type: 'bigtype', typeValue: 5 },
        { value: '10', label: '网络键盘', type: 'bigtype', typeValue: 6 },
        { value: '11', label: '拼接控制器', type: 'bigtype', typeValue: 9 }
      ],
      // 选中项
      checkedItem: [],
      Allnumtype: { value: '0', label: '摄像机', type: 'type', typeValue: 0 },
      // 详情
      listDetails: {},
      assetTitle: '资产详情',
      // 资产类型
      numtype: null,
      isShowSubMechanism: true,
      assetType: '0',
      assetStatus: '0',
      tableHeight: 0,
      inPageTotal: 12,
      inPageCur: 1,
      inpageLimit: this.$PageInfo.limit,
      isEdit: true,
      assetSwitch: false,
      repairSwitch: false,
      keyword: '',
      assetSelected: [],
      tableData: [],
      statusList: [{ value: '0', label: '全部' }, { value: '1', label: '在保' }, { value: '2', label: '过保' }],
      columns: [
        {
          type: 'selection',
          align: 'left',
          width: 80
        },
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '设备名称',
          key: 'name'
        },
        {
          title: '所属机构',
          minWidth: 160,
          ellipsis: true,
          render: (h, params) => {
            let name = params.row.eid ? params.row.eid.oid.name : params.row.oid.name
            return h(
              'span',
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
          title: 'IP地址',
          render: (h, params) => {
            let ip
            if (params.row.ip) {
              ip = params.row.ip
            } else if (params.row.talkIp) {
              ip = params.row.talkIp
            } else {
              ip = ''
            }
            return h('span', ip)
          }
        },
        {
          title: '厂商',
          render: (h, params) => {
            let manufacturer
            if (params.row.eid) {
              manufacturer = params.row.eid.manufacturer
            } else if (params.row.manufacturer) {
              manufacturer = params.row.manufacturer
            } else {
              manufacturer = params.row.camerDevId.manufacturer
            }
            switch (manufacturer) {
              case 'dahua':
                manufacturer = '大华'
                break
              case 'bstar':
                manufacturer = '蓝色星际'
                break
              case 'hikvision':
                manufacturer = '海康'
                break
              case 'onvif':
                manufacturer = 'onvif'
                break
              case 'custom':
                manufacturer = '自定义'
                break
              case 'lida':
                manufacturer = '利达'
                break
              case 'juanxin':
                manufacturer = '巨安信'
                break
              default:
                manufacturer = params.row.manufacturer
            }
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: manufacturer
                }
              },
              manufacturer
            )
          }
        },
        {
          title: '设备类型',
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
                  title: this.Allnumtype.label
                }
              },
              this.Allnumtype.label
            )
          }
        },
        {
          title: '建设时间',
          key: 'createdAt',
          minWidth: 140,
          ellipsis: true,
          render: (h, params) => {
            // 这个地方后台返回有三种可能，1.没有这个字段 2.返回为‘-’ 3.返回一个时间
            let str = params.row.createdAt
            if (str) {
              if (str !== '-') {
                str = this.$moment(str).format('YYYY-MM-DD HH:mm:ss')
              }
            } else {
              str = '-'
            }
            return h('span', str)
          }
        },
        {
          title: '维保厂商',
          key: 'maintenanceVendor'
        },
        {
          title: '维保状态',
          key: 'insurance',
          render: (h, params) => {
            let insurance = params.row.insurance === 1 ? '在保' : '过保'
            let color = params.row.insurance === 1 ? '#fff' : '#ff0000'
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: color
                },
                domProps: {
                  title: insurance
                }
              },
              insurance
            )
          }
        },
        {
          title: '详情',
          key: 'details',
          render: (h, params) => {
            return h(
              'span',
              {
                on: {
                  click: () => {
                    this.assetTitle = '资产详情'
                    this.getEquipmentDetails({ id: params.row._id, type: this.numtype })
                    this.listDetails = params.row
                    this.openAsset(1)
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
  computed: {
    ...mapState({
      assetsList: ({ opsManage }) => opsManage.assetsList,
      detailList: ({ opsManage }) => opsManage.detailList,
      chartList: ({ opsManage }) => opsManage.chartList,
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId,
      isRootOrg: ({ orgSetting }) => orgSetting.isRootOrg
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapActions(['getAssetsList', 'getEquipmentDetails', 'setEquipmentDetails', 'getChart', 'setMaintenance', 'recordLog']),
    resize() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
    },
    // 需要重置分页
    resetPaging() {
      this.inPageCur = 1
      this.assetsInitList()
      this.getChartList()
    },
    // 机构树回调
    clickTree(data) {
      if (this.isRootOrg && this.typeList.length < 12) {
        this.typeList.splice(6, 0,
          { value: '6', label: '报警柱', type: 'type', typeValue: 13 },
          { value: '7', label: '报警箱', type: 'type', typeValue: 14 },
          { value: '8', label: '闸机', type: 'bigtype', typeValue: 2 })
      }
      if (!this.isRootOrg && this.typeList.length === 12) {
        this.typeList.splice(6, 3)
      }
      this.resetPaging()
    },
    // 设置详情信息
    modificationSave(val) {
      let constructTime = Math.round(this.$moment(val.constructTime).valueOf() / 1000)
      let startTime = Math.round(this.$moment(val.startTime).valueOf() / 1000)
      let endTime = Math.round(this.$moment(val.endTime).valueOf() / 1000)
      const params = {
        id: this.checkedItem[0]._id,
        body: {
          type: this.numtype, // 设备类型
          constructTime: constructTime, // 建设时间
          longitude: String(val.longitude), // 经度
          latitude: String(val.latitude), // 纬度
          InstallPosition: val.InstallPosition, // 安装位置
          district: val.district, // 警区
          locationExtension: Number(val.locationExtension), // 位置类型拓展
          site: Number(val.site), // 安装位置
          usage: Number(val.usage), // 摄像机用途
          fill: Number(val.fill), // 摄像机补光
          monitoPosition: Number(val.monitoPosition),
          supportGB: Number(val.supportGB), // 监视方位
          controllable: Number(val.controllable), // 是否可控
          maintenanceVendor: val.maintenanceVendor, // 维保厂商
          contacts: val.contact, // 联系人
          phone: val.phone,
          email: val.email,
          startTime: Number(startTime), // 维保开始
          endTime: Number(endTime) // 维保结束
        }
      }
      this.setEquipmentDetails(params).then(res => {
        if (res.data === 'OK') {
          this.$Notice.success({ title: '成功', desc: '修改成功' })
          this.assetsInitList()
        }
      }).catch(err => {
        console.log(err)
        this.$Notice.error({ title: '失败', desc: '修改失败' })
      })
      this.recordLog({ logType: '操作日志', module: '运维管理', operateName: '修改资产', operateContent: '修改资产', target: this.listDetails.name, deviceIp: this.listDetails.ip })
    },
    selectionChange(val) {
      this.checkedItem = val
    },
    // 获取图表数据
    getChartList(val) {
      let never
      never = this.isShowSubMechanism ? -1 : 1
      this.getChart({ never: never })
        .then(res => {
          // 如果是刷新 提示信息
          if (val === 1) {
            this.$Notice.success({ title: '成功', desc: '图表数据获取成功' })
          }
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: '图表数据获取失败' })
          console.log(err)
        })
    },
    deviceExport() {
      // 导出
      if (!this.elemIF) {
        this.elemIF = document.createElement('iframe')
      }
      let never = this.isShowSubMechanism ? -1 : 1
      let insurance = this.assetStatus === '0' ? '' : Number(this.assetStatus)
      let bigtype = ''
      if (this.assetType === '1') {
        bigtype = 'bigtype=0'
      }
      this.elemIF.src = window.location.origin + `/api/setting/operation/assetsExport?oid=${this.orgActiveId}&numtype=${Number(this.Allnumtype.value)}&never=${never}&insurance=${insurance}&${this.Allnumtype.type}=${this.Allnumtype.typeValue}&seek=${this.keyword}&&${bigtype}`
      this.elemIF.style.display = 'none'
      document.body.appendChild(this.elemIF)
      this.recordLog({ logType: '操作日志', module: '运维管理', operateName: '导出资产', operateContent: '导出资产' })
    },
    // 获取资产统计详情
    assetsInitList(val) {
      if (!this.isRootOrg && (this.assetType === '6' || this.assetType === '7' || this.assetType === '8')) {
        this.tableData = []
        return
      }
      let never, insurance
      never = this.isShowSubMechanism ? -1 : 1
      insurance = this.assetStatus === '0' ? '' : Number(this.assetStatus)
      for (let index = 0; index < this.typeList.length; index++) {
        if (this.typeList[index].value === this.assetType) {
          this.Allnumtype = this.typeList[index]
          break
        }
      }
      const params = {
        page: this.inPageCur,
        limit: this.inpageLimit,
        numtype: Number(this.Allnumtype.value), // 设备类型
        never: never,
        insurance: insurance, // 在线状态
        seek: this.keyword // 搜索字段
      }
      params[this.Allnumtype.type] = this.Allnumtype.typeValue
      if (this.assetType === '1') {
        params.bigtype = 0
      }
      this.getAssetsList(params)
        .then(res => {
          this.tableData = this.assetsList.data
          this.inPageTotal = Number(this.assetsList.headers['x-bsc-count'])
          this.numtype = Number(this.Allnumtype.value)
          this.checkedItem = []
          // 如果是刷新 提示信息
          if (val === 1) {
            this.$Notice.success({ title: '成功', desc: '列表获取成功' })
          }
        })
        .catch(err => {
          console.log(err)
          this.$Notice.error({ title: '失败', desc: '列表获取失败' })
        })
    },
    // 批量设置维保
    installMaintenance(val) {
      let ids = []
      let targets = []
      let deviceIps = []
      this.checkedItem.forEach(item => {
        ids.push(item._id)
        targets.push(item.name)
        deviceIps.push(item.ip)
      })
      let startTime = Math.round(this.$moment(val.startTime).valueOf() / 1000)
      let endTime = Math.round(this.$moment(val.endTime).valueOf() / 1000)
      const params = {
        ids: ids,
        config: {
          type: this.numtype, // 设备类型
          maintenanceVendor: val.maintenanceVendor, // 维保厂商
          contacts: val.contact,
          phone: val.phone,
          email: val.email,
          startTime: Number(startTime),
          endTime: Number(endTime)
        }
      }
      this.setMaintenance(params)
        .then(res => {
          if (res.data) {
            this.$Notice.success({ title: '成功', desc: '批量设置维保成功' })
            this.assetsInitList()
          } else {
            this.$Notice.error({ title: '失败', desc: '批量设置维保失败' })
          }
          this.repairSwitch = false
        })
        .catch(err => {
          console.log(err)
          this.repairSwitch = false
          this.$Notice.error({ title: '失败', desc: '批量设置维保失败' })
        })
      this.recordLog({ logType: '操作日志', module: '运维管理', operateName: '设置维保', operateContent: '设置维保', target: targets.join(), deviceIp: deviceIps.join() })
    },
    // 修改按钮入口
    openAsset(data) {
      this.isEdit = data === 0 ? Boolean(1) : Boolean(0)
      if (data === 0) {
        if (this.checkedItem.length !== 1) {
          this.$Notice.warning({ title: '警告', desc: '请选择一个设备' })
          return
        }
        this.getEquipmentDetails({ id: this.checkedItem[0]._id, type: this.numtype }).then(res => {
          this.listDetails = this.checkedItem[0]
          this.assetTitle = '修改资产'
        })
      }
      this.assetSwitch = true
    },
    openRepair() {
      if (this.checkedItem.length < 1) {
        this.$Notice.warning({ title: '警告', desc: '请至少选择一个设备' })
        return
      }
      this.repairSwitch = true
    },
    closeModal() {
      this.assetSwitch = false
      this.repairSwitch = false
    },
    pageChange(val) {
      this.inPageCur = val
      this.assetsInitList()
    },
    pageSizeChange(val) {
      this.inpageLimit = val
      this.assetsInitList()
    }
  }
}
</script>
<style scoped>
.lf {
  float: left;
}
.rt {
  float: right;
}
.asset-manage {
  padding: 20px 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.asset-manage-right {
  height: 100%;
  width: 100%;
  background: #1c3053;
}
.bs-main {
  padding: 0;
  background-color: #0c1b32;
}
.asset-chart {
  width: 100%;
  height: 420px;
}
.asset-table {
  width: 100%;
  height: calc(100% - 420px);
}
.asset-title {
  position: relative;
  height: 38px;
  line-height: 36px;
  background: #0f2343;
  font-size: 14px;
  padding-left: 24px;
}
.table-btn {
  padding: 12px 24px;
  overflow: hidden;
}
.btn-rt {
  margin-right: 8px;
}
.chk-style {
  height: 30px;
  line-height: 30px;
}
.page-style {
  width: 100%;
  height: 40px;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px;
  background: #244575;
}
#chart-refresh {
  position: absolute;
  right: 4%;
  top: 8px;
  font-size: 20px;
  cursor: pointer;
}
</style>
