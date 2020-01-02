<template>
  <Dialog :title="orderTitle" :visible="dialogVisible" width="770px" class="work-order" @close="cancel" :close-on-press-escape="false" :close-on-click-modal="false">
    <div>1、基本信息</div>
    <div class="form-top">
      <Form :inline="true" :model="formBasicInfo" label-width="80px" label-position="left" class="dialog-form" :disabled="orderTitle==='维修确认'||orderTitle==='工单详情'">
        <FormItem label="工单编号" class="dialog-formitem-label">
          <Input v-model="formBasicInfo.serial" class="dialog-formitem" disabled></Input>
        </FormItem>
        <FormItem label="报修人" class="dialog-formitem-label">
          <Input v-model="formBasicInfo.repairsName" class="dialog-formitem"></Input>
        </FormItem>
        <FormItem label="报修时间" class="dialog-formitem-label">
          <Input v-model="formBasicInfo.repairsTime" class="dialog-formitem"></Input>
        </FormItem>
        <FormItem label="设备类型" class="dialog-formitem-label">
          <Select v-model="formBasicInfo.deviceType" class="dialog-formitem" @change="changedeviceType">
            <Option v-for="item in deviceTypeList" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="报修原因" class="dialog-formitem-label">
          <Select v-model="formBasicInfo.repairsReason" class="dialog-formitem">
            <Option v-for="item in repairsReasonList" :key="item.value" :label="item.label" :value="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="维修时间" class="dialog-formitem-label">
          <DatePicker type="date" placeholder="选择日期" v-model="formBasicInfo.maintenanceTime" class="dialog-formitem"></DatePicker>
        </FormItem>
        <FormItem label="设备列表" class="dialog-formitem-label">
          <Input v-model="searchInputVal" placeholder="搜索设备" class="dialog-formitem-line" suffix-icon="el-icon-search"></Input>
          <Tree ref="devTree" :data="devTreeData" show-checkbox node-key="_id" :props="defaultProps" :default-checked-keys="defaultChecked" :filter-node-method="filterNode" @check="checkTreeChange" class="dialog-formitem-tree">
            <span slot-scope="{ node, data }">
              <i :class="[data.tierType === 'org' ? 'iconfont icon-organise' : 'iconfont icon-equipment']"></i>
              <span>{{ node.label }}</span>
            </span>
          </Tree>
          <Input v-model="formBasicInfo.devNameList" type="textarea" class="dialog-formitem-line"></Input>
        </FormItem>
      </Form>
    </div>
    <div>2、派发信息</div>
    <div class="form-top">
      <Form :inline="true" :model="formPayoutInfo" label-width="80px" label-position="left" class="dialog-form" :disabled="orderTitle==='维修确认'||orderTitle==='工单详情'">
        <FormItem label="维保厂商" class="dialog-formitem-label">
          <Select v-model="formPayoutInfo.maintenanceVendor" class="dialog-formitem" @change="changeVendor">
            <Option v-for="item in VendorLinkmanList" :key="item.index" :label="item.maintenanceVendor" :value="item.maintenanceVendor"></Option>
          </Select>
        </FormItem>
        <FormItem label="联系人" class="dialog-formitem-label">
          <Select v-model="formPayoutInfo.linkman" class="dialog-formitem" @change="changeLinkman">
            <Option v-for="item in linkmanList" :key="item.index" :label="item.contact" :value="item.contact"></Option>
          </Select>
        </FormItem>
        <FormItem label="联系电话" class="dialog-formitem-label">
          <Input v-model="formPayoutInfo.maintenancePhone" class="dialog-formitem" disabled></Input>
        </FormItem>
        <FormItem class="dialog-formitem-label">
          <Checkbox v-model="formPayoutInfo.isSmsAlert">发送短信提醒</Checkbox>
        </FormItem>
      </Form>
    </div>
    <div>3、维修确认</div>
    <div class="form-top">
      <Form :inline="true" :model="formNotarize" label-width="80px" label-position="left" class="dialog-form" :disabled="orderTitle!=='维修确认'">
        <FormItem label="确认人"class="dialog-formitem-label">
          <Input v-model="formNotarize.notarizeName" class="dialog-formitem"></Input>
        </FormItem>
        <FormItem label="确认时间" class="dialog-formitem-label">
          <!-- <Input v-model="formNotarize.notarizeTime" class="dialog-formitem"></Input> -->
          <DatePicker type="datetime" placeholder="选择日期" v-model="formNotarize.notarizeTime" class="dialog-formitem"></DatePicker>
        </FormItem>
        <FormItem label="维修人" class="dialog-formitem-label">
          <Select v-model="formNotarize.accendant" class="dialog-formitem" @change="changeAccendant">
            <Option v-for="item in accendantList" :key="item.index" :label="item.contact" :value="item.contact"></Option>
          </Select>
        </FormItem>
        <FormItem label="联系电话" class="dialog-formitem-label">
          <Input v-model="formNotarize.accendantPhone" class="dialog-formitem" disabled></Input>
        </FormItem>
        <FormItem label="备注信息" class="dialog-formitem-label">
          <Input v-model="formNotarize.remark" type="textarea" class="dialog-formitem-line"></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer" class="dialog-footer">
      <Button @click="cancel">取 消</Button>
      <Button type="primary" @click="saveBtn">确 定</Button>
    </div>
  </Dialog>
</template>
<script>
import { Dialog, Button, Form, FormItem, Input, Select, Option, Checkbox, DatePicker, Tree, Icon } from 'element-ui'
import { mapGetters } from 'vuex'
import { getOperationConfigList, getDevOrgTreeApi, putAddWorkOrderApi, getWorkOrderInfoApi, postEditWorkOrderApi, postNotarizeOrderApi } from '../../../http/workOrder.api.js'
export default {
  name: 'OrderDialog',
  components: {
    Dialog,
    Button,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Checkbox,
    DatePicker,
    Tree,
    Icon
  },
  props: {
    dialogVisible: { // 是否开启工单弹窗
      type: Boolean,
      default: false
    },
    orderTitle: { // 工单标题
      type: String,
      default: '创建工单'
    },
    orderId: { // 工单id
      type: String,
      default: ''
    },
    defaultTreeChecked: { // 机构树默认选中的设备数据
      type: Array,
      default: []
    },
    defaultTreeBigType: { // 机构树默认大类
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formBasicInfo: { // 基本信息
        serial: '',
        repairsName: '',
        repairsTime: '',
        deviceType: 0,
        repairsReason: 0,
        maintenanceTime: '',
        devNameList: ''
      },
      formPayoutInfo: { // 派发信息
        maintenanceVendor: '',
        linkman: '',
        maintenancePhone: '',
        isSmsAlert: true
      },
      formNotarize: { // 维修确认
        notarizeName: '',
        notarizeTime: '',
        accendant: '',
        accendantPhone: '',
        remark: ''
      },
      deviceTypeList: [
        {label: '摄像机', value: 0},
        {label: '录像机', value: 1},
        {label: '报警主机', value: 2},
        {label: '消防主机', value: 3},
        {label: '报警探头', value: 4},
        {label: '消防探头', value: 5},
        {label: '报警柱', value: 6},
        {label: '报警箱', value: 7},
        {label: '闸机', value: 8},
        {label: '解码器', value: 9},
        {label: '网络键盘', value: 10},
        {label: '拼接控制器', value: 11},
        {label: '其他', value: 12}
      ],
      repairsReasonList: [
        {label: '设备离线', value: 0},
        {label: '设备异常', value: 1},
        {label: '录像异常', value: 2},
        {label: '视频质量异常', value: 3},
        {label: '其他', value: 4}
      ],
      VendorLinkmanList: [], // 维保厂商及联系人信息
      linkmanList: [], // 联系人信息
      accendantList: [], // 维修人信息
      devTreeData: [], // 机构树数据
      defaultProps: { // 机构树对应字段
        children: 'children',
        label: 'name'
      },
      searchInputVal: '', // 机构树搜索框
      deviceList: [], // 机构树选中设备数据
      defaultChecked: [] // 机构树默认选中的设备数据
    }
  },
  computed: {
    ...mapGetters(['username'])
  },
  watch: {
    searchInputVal(val) {
      this.$refs.devTree.filter(val)
    }
  },
  methods: {
    cancel() { // 关闭
      this.$emit('cancel', false)
    },
    filterNode(value, data) { // 机构树搜索
      if (!value) { return true }
      return data.name.indexOf(value) !== -1
    },
    checkTreeChange(key, node) { // 机构树选择
      if (node.checkedNodes.length > 0) {
        this.deviceList = node.checkedNodes.filter(item => {
          return item.tierType !== 'org'
        })
        let devListArry = []
        this.deviceList.forEach(item => {
          devListArry.push(item.name + '_' + item.ip)
        })
        this.formBasicInfo.devNameList = devListArry.join('\n')
      } else {
        this.deviceList = []
        this.formBasicInfo.devNameList = ''
      }
    },
    changedeviceType(val) { // 改变设备类型
      this.getDevTreeData()
      this.deviceList = []
      this.formBasicInfo.devNameList = ''
    },
    changeVendor(val) { // 改变维保厂商
      for (let index = 0; index < this.VendorLinkmanList.length; index++) {
        if (this.VendorLinkmanList[index].maintenanceVendor === val) {
          this.formPayoutInfo.linkman = this.VendorLinkmanList[index].contacts[0].contact || ''
          this.formPayoutInfo.maintenancePhone = this.VendorLinkmanList[index].contacts[0].phone || ''
          this.linkmanList = this.VendorLinkmanList[index].contacts
          break
        }
      }
    },
    changeLinkman(val) { // 改变联系人
      for (let index = 0; index < this.linkmanList.length; index++) {
        if (this.linkmanList[index].contact === val) {
          this.formPayoutInfo.maintenancePhone = this.linkmanList[index].phone || ''
          break
        }
      }
    },
    changeAccendant(val) { // 改变维修人
      for (let index = 0; index < this.accendantList.length; index++) {
        if (this.accendantList[index].contact === val) {
          this.formNotarize.accendantPhone = this.accendantList[index].phone || ''
          break
        }
      }
    },
    saveBtn() { // 确定
      if (this.orderTitle === '工单详情') {
        this.$emit('cancel', false)
        return
      }
      const param = {
        repairsName: this.formBasicInfo.repairsName,
        repairsTime: parseInt(new Date(this.formBasicInfo.repairsTime).getTime() / 1000),
        deviceType: this.formBasicInfo.deviceType,
        repairsReason: this.formBasicInfo.repairsReason,
        maintenanceTime: parseInt(new Date(this.formBasicInfo.maintenanceTime).getTime() / 1000),
        deviceList: this.deviceList,
        devNameList: JSON.stringify(this.formBasicInfo.devNameList),
        maintenanceVendor: this.formPayoutInfo.maintenanceVendor,
        linkman: this.formPayoutInfo.linkman,
        maintenancePhone: this.formPayoutInfo.maintenancePhone,
        isSmsAlert: this.formPayoutInfo.isSmsAlert
      }
      if (this.orderTitle === '创建工单') {
        putAddWorkOrderApi(param).then(res => {
          this.$Notice.success({ title: '成功', desc: this.orderTitle + '成功' })
          this.$emit('cancel', false)
        }).catch(err => {
          console.log(err, 'err')
          this.$Notice.error({ title: '失败', desc: this.orderTitle + '失败' })
          this.$emit('cancel', false)
        })
      } else if (this.orderTitle === '维修确认') {
        const param = {
          notarizeName: this.formNotarize.notarizeName,
          notarizeTime: parseInt(new Date(this.formNotarize.notarizeTime).getTime() / 1000),
          accendant: this.formNotarize.accendant,
          accendantPhone: this.formNotarize.accendantPhone,
          remark: this.formNotarize.remark
        }
        postNotarizeOrderApi(this.orderId, param).then(res => {
          this.$Notice.success({ title: '成功', desc: this.orderTitle + '成功' })
          this.$emit('cancel', false)
        }).catch(err => {
          console.log(err, 'err')
          this.$Notice.error({ title: '失败', desc: this.orderTitle + '失败' })
          this.$emit('cancel', false)
        })
      } else {
        postEditWorkOrderApi(this.orderId, param).then(res => {
          console.log(res, this.orderTitle + 'res')
          this.$Notice.success({ title: '成功', desc: this.orderTitle + '成功' })
          this.$emit('cancel', false)
        }).catch(err => {
          console.log(err, this.orderTitle + 'err')
          this.$Notice.error({ title: '失败', desc: this.orderTitle + '失败' })
          this.$emit('cancel', false)
        })
      }
    },
    getDevTreeData() { // 获取机构树数据
      getDevOrgTreeApi(this.formBasicInfo.deviceType).then(res => {
        this.devTreeData = [res.data]
      }).catch(err => {
        console.log(err, '设备树数据err')
        this.$Notice.error({ title: '失败', desc: '获取机构树数据失败' })
      })
    },
    getMaintenanceVendorData() { // 获取维保厂商
      getOperationConfigList().then(res => {
        if (this.orderTitle === '创建工单') {
          this.VendorLinkmanList = res.data.devList
          this.linkmanList = this.VendorLinkmanList[0].contacts
          this.formPayoutInfo.maintenanceVendor = this.VendorLinkmanList[0].maintenanceVendor || ''
          this.formPayoutInfo.linkman = this.VendorLinkmanList[0].contacts[0].contact || ''
          this.formPayoutInfo.maintenancePhone = this.VendorLinkmanList[0].contacts[0].phone || ''
        } else {
          this.VendorLinkmanList = res.data.devList
          this.VendorLinkmanList.forEach(item => {
            if (item.maintenanceVendor === this.formPayoutInfo.maintenanceVendor) {
              this.linkmanList = item.contacts
              this.accendantList = item.contacts
            }
          })
          console.log(this.linkmanList, 'this.linkmanList')
        }
      }).catch(err => {
        console.log(err, '创建工单err')
        this.$Notice.error({ title: '失败', desc: '获取维保厂商失败' })
      })
    }
  },
  created() {
    if (this.orderTitle === '创建工单') {
      if (this.defaultTreeChecked.length > 0) {
        this.formBasicInfo.deviceType = this.defaultTreeBigType
        this.deviceList = this.defaultTreeChecked
        let devListArry = []
        this.defaultTreeChecked.forEach(item => {
          this.defaultChecked.push(item._id)
          devListArry.push(item.name + '_' + item.ip)
        })
        this.formBasicInfo.devNameList = devListArry.join('\n')
      }
      this.getDevTreeData()
      this.getMaintenanceVendorData()
      this.formBasicInfo.repairsName = this.username || ''
      this.formBasicInfo.repairsTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.formBasicInfo.maintenanceTime = this.$moment(new Date().getTime() + 7 * 24 * 3600 * 1000).format('YYYY-MM-DD HH:mm:ss')
    } else {
      getWorkOrderInfoApi(this.orderId).then(res => {
        this.formBasicInfo.serial = res.data[0].serial
        this.formBasicInfo.repairsName = res.data[0].repairsName
        this.formBasicInfo.repairsTime = this.$moment(res.data[0].repairsTime * 1000).format('YYYY-MM-DD HH:mm:ss')
        this.formBasicInfo.deviceType = res.data[0].deviceType
        this.formBasicInfo.repairsReason = res.data[0].repairsReason
        this.formBasicInfo.maintenanceTime = res.data[0].maintenanceTime * 1000
        this.formBasicInfo.devNameList = res.data[0].devNameList ? JSON.parse(res.data[0].devNameList) : ''
        this.formPayoutInfo.maintenanceVendor = res.data[0].maintenanceVendor
        this.formPayoutInfo.linkman = res.data[0].linkman
        this.formPayoutInfo.maintenancePhone = res.data[0].maintenancePhone
        this.formPayoutInfo.isSmsAlert = res.data[0].isSmsAlert
        this.deviceList = res.data[0].deviceList
        this.getDevTreeData()
        res.data[0].deviceList.forEach(item => {
          this.defaultChecked.push(item._id)
        })
        this.getMaintenanceVendorData()
        if (this.orderTitle === '维修确认') {
          this.formNotarize.notarizeName = this.username || ''
          this.formNotarize.notarizeTime = new Date().getTime()
        }
        if (this.orderTitle === '工单详情') {
          this.formNotarize.notarizeName = res.data[0].notarizeName || ''
          this.formNotarize.notarizeTime = res.data[0].notarizeTime * 1000 || ''
          this.formNotarize.accendant = res.data[0].accendant || ''
          this.formNotarize.accendantPhone = res.data[0].accendantPhone || ''
          this.formNotarize.remark = res.data[0].remark || ''
        }
      }).catch(err => {
        console.log(err, '工单详情-err')
        this.$Notice.error({ title: '失败', desc: '获取工单详情失败' })
      })
    }
  }
}
</script>
<style>
.el-select {
    margin-right: 24px;
    background-color: #1b3153;
}
.el-select .el-input__inner{
    color: #fff;
    border-radius: 4px;
    border: 1px solid #5676a9;
    background-color: #1b3153;
    height: 30px;
    line-height: 30px;
}
.el-select-dropdown {
    background-color: #1b3153;
    border: 1px solid #4699f9;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: rgba(70,153,249,.9);
}
.el-select-dropdown__item {
    color: #fff;
}
.el-scrollbar {
  background-color: #1b3153;
}
.el-date-editor .el-range-separator {
  color: #fff;
  width: 7%;
}
.el-date-editor .el-range-input {
  color: #fff;
  background-color: #1b3153;
}
.el-date-range-picker__content.is-left {
  background-color: #1b3153;
  color: #fff;
}
.el-date-range-picker .el-picker-panel__content {
  color: #fff;
  background-color: #1b3153;
  border: 1px solid #657CA8;
}
.el-date-table td.in-range div {
  background-color: #4699f9;
}
.el-range-editor--small.el-input__inner {
  border: 1px solid #657CA8;
  background-color: #1b3153;
}
.el-popper[x-placement^=bottom] {
  border: 1px solid #657CA8;
}
.el-picker-panel__footer, .el-date-range-picker__time-header, .el-input__inner {
  background-color: #1b3153;
  color: #fff;
}
.el-time-spinner__item.active:not(.disabled) {
  background-color: #4699f9;
}
.el-picker-panel {
  background-color: #1b3153;
  color: #fff;
}
.el-date-picker__header-label {
  color: #fff;
}
</style>
<style lang="less">
  @import './Theme.less';
</style>
<style scoped>
.dialog-formitem-line {
  width: 553px;
}
.form-top {
  margin: 10px;
}
.dialog-formitem-label {
  margin-left: 35px;
}
.dialog-formitem {
  width: 200px;
  margin-right: 24px;
}
.dialog-formitem-tree {
  width: 553px;
  margin-bottom: 10px;
  height: 100px;
  overflow: auto;
}
</style>
