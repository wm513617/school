<template>
  <div class="res-table-video">
    <div class="table-header">
      <TableTab :tabs="jointTabs" @on-tab-click="deviceResTabClick" :isCount="true"></TableTab>
      <div class="table-header-actions clear">
        <div class="actions-btn">
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="plus" @click="addDeviceRes" :disabled="this.deviceId !== 'notExist' ? false : true">添加</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="edit" @click="openEditDeviceResInfo" :disabled="!isDeviceResChecked">修改</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="trash-a" @click="openDeviceResDelModel" :disabled="!isDeviceResChecked">删除</Button>
          <Button type="ghost" icon="refresh" @click="refreshDeviceResTable(deviceId)">刷新</Button>
          <Button type="ghost" icon="chevron-up" v-if="isHide" style="float:right;margin-right:0;" @click="$emit('changeTable')"></Button>
          <Button type="ghost" icon="chevron-down" v-else style="float:right;margin-right:0;" @click="$emit('changeTable')"></Button>
        </div>
      </div>
    </div>
    <div class="table-relative" :style="{height: `${tableHeight}px`}">
      <div class="table-body">
        <Table size="small" :columns="deviceResColumns" :data="deviceAllResData[activeResTab]" @on-selection-change="selectDeviceResRow" :highlight-row="true" :height="tableHeight" width="100%"></Table>
      </div>
    </div>
    <!-- 输入源弹窗 -->
    <!-- <JointInRes ref="JointInRes" :jointResShow="jointResShow" :isJointResEdit="isJointResEdit" :JointResFormData="JointResFormData" @save="saveJointInRes" @cancel="cancelJointInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName" :activeChannelType="activeChannelType"></JointInRes> -->
    <Modal :mask-closable="false" v-model="jointResShow" :title="isJointResEdit?'资源修改':'资源添加'" width="500" @on-cancel="cancelJointInRes('JointResFormData')">
      <Form :model="JointResFormData" :label-width="100" ref="JointResFormData" label-position="left" style="padding: 0 20px;">
        <Form-item label="输入源名称" prop="name">
          <Input v-model="JointResFormData.name"></Input>
        </Form-item>
        <Form-item label="通道号">
          <Select v-model="JointResFormData.chan" @on-change="chanChange">
          <!-- <Select v-model="JointResFormData.chan" @on-change="chanChange" v-if="!isJointResEdit"> -->
            <Option v-for="item in chanList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- <Input v-model="JointResFormData.chan" :disabled="isJointResEdit" v-if="isJointResEdit"></Input> -->
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="cancelJointInRes('JointResFormData')">取消</Button>
        <Button type="primary" @click="saveJointInRes(JointResFormData,'JointResFormData')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import TableTab from '../tableTab'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    TableTab
  },
  props: {
    // 点击设备的ID
    deviceId: {
      type: String
    },
    // 点击设备的name
    deviceName: {
      type: String
    },
    tableHeight: {
      type: Number
    },
    isHide: {
      type: Boolean
    }
  },
  data() {
    return {
      // type: 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入
      // 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区
      // 报警tab
      isResEdit: false,
      jointTabs: [
        {
          title: '输入源',
          value: 'jointInput',
          type: 15,
          disabled: false,
          active: true,
          number: 0,
          isHide: false
        }
      ],
      deviceResColumns: [],
      jointInResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        },
        {
          title: '序号',
          align: 'left',
          type: 'index',
          width: 80
        },
        {
          title: '输入通道名称',
          key: 'name',
          align: 'left'
        },
        {
          title: '通道号',
          key: 'chan',
          align: 'left'
        }
      ],
      deviceAllResData: [],
      activeResTab: 'jointInput',
      activeResName: '',
      activeChannelType: 0,
      deviceResSelectIds: [],
      deviceResSelectIdsDel: [],
      isDeviceResChecked: false,
      // 报警输入的资源
      jointResShow: false,
      jointInResModal: false,
      isJointResEdit: false, // 通道号是否禁用状态
      JointResFormData: {
        eid: '',
        chan: 0,
        type: 13,
        name: ''
      },
      chanList: [] // 通道号备选
    }
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledLevel', 'enabledTemp'])
  },
  created() {
    this.deviceResColumns = this.jointInResColumns
  },
  watch: {
    // 监听设备变化
    deviceId(newId) {
      this.refreshDeviceResTable(newId)
      for (let d in this.jointTabs) {
        this.jointTabs[d].active = false
      }
      this.activeResTab = this.jointTabs[0].value
      this.activeResName = this.jointTabs[0].title
      this.activeChannelType = this.jointTabs[0].type
      this.jointTabs[0].active = true
    },
    // 监听tab变化转换Columns
    activeResTab(newId) {
      if (this.activeResTab === 'jointInput') {
        this.deviceResColumns = this.jointInResColumns
      }
    }
  },
  methods: {
    ...mapActions([
      'getSortData',
      'getJointTemp',
      'getJointLevel',
      'getDeviceInfo',
      'getResOfDeviceById',
      'addOneResToDevice',
      'getNotOccupyChannel',
      'deleteResource',
      'getSingleResource',
      'saveResourceInfo',
      'addPatchRes',
      'recordLog'
    ]),
    // 名称
    chanChange(val) {
      this.JointResFormData.name = this.deviceName + '_' + this.activeResName + '_通道' + val
    },
    // 点击tab
    deviceResTabClick(tab) {
      this.activeResTab = tab.obj.value
      this.activeResName = tab.obj.title
      this.activeChannelType = tab.obj.type
      this.deviceResSelectIds = []
      this.deviceResSelectIdsDel = []
      this.isDeviceResChecked = false
    },
    // 获取某一个设备下的资源列表
    refreshDeviceResTable(id) {
      if (id === 'notExist') {
        this.deviceAllResData = {}
        for (let v = 0; v < this.jointTabs.length; v++) {
          this.jointTabs[v].number = 0
        }
      } else {
        this.getResOfDeviceById(id)
          .then(suc => {
            this.deviceAllResData = suc

            for (let v = 0; v < this.jointTabs.length; v++) {
              let val = this.jointTabs[v].value
              if (!suc[val]) {
                this.warningMsg('服务器无数据返回')
              }
              this.jointTabs[v].number = suc[val] ? suc[val].length : 0
            }
            // this.successMsg('数据刷新成功')
          })
          .catch(err => {
            console.log('getResOfDeviceById 111error: ' + err)
          })
      }
      this.deviceResSelectIds = []
      this.deviceResSelectIdsDel = []
      this.isDeviceResChecked = false
    },
    // 资源的添加
    addDeviceRes() {
      this.isJointResEdit = false
      // 获取指定设备下未占用的通道号
      this.chanList = []
      this.getNotOccupyChannel({ type: this.activeChannelType, deviceId: this.deviceId })
        .then(suc => {
          if (suc.length === 0) {
            this.warningMsg('设备无多余通道,无法继续添加资源')
          } else {
            for (let i = 0; i < suc.length; i++) {
              this.chanList.push({ value: suc[i], label: suc[i] })
            }
            if (this.activeResTab === 'jointInput') {
              this.addJointInput()
            }
          }
        })
        .catch(err => {
          console.log('getNotOccupyChannel error: ' + err)
        })
    },
    // 添加输入源
    addJointInput() {
      this.jointResShow = true
      this.JointResFormData = {
        eid: this.deviceId,
        chan: this.chanList[0].value,
        type: this.jointTabs[0].type,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value
      }
    },
    // 资源的修改
    openEditDeviceResInfo() {
      if (this.deviceResSelectIds.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
        return
      }
      Promise.all([
        this.getSingleResource(this.deviceResSelectIds[0]),
        this.getNotOccupyChannel({ type: this.activeChannelType, deviceId: this.deviceId })
      ])
        .then(res => {
          if (this.activeResTab === 'jointInput') {
            this.chanList = []
            this.jointResShow = true
            this.isJointResEdit = true
            this.JointResFormData = JSON.parse(JSON.stringify(res[0]))
            res[1].push(res[0].chan)
            res[1].sort()
            for (let item of res[1]) {
              this.chanList.push({ value: item, label: item })
            }
          }
        })
        .catch(err => {
          console.log('openEditDeviceResInfo err' + err)
        })
    },
    modalReset(name) {
      if (this.activeResTab === 'jointInput') {
        this.jointResShow = false
        this.$refs[name].resetFields()
      }
    },
    // 资源模态框的保存
    saveJointInRes(data, name) {
      let type = this.isJointResEdit ? '修改' : '添加'
      this.recordLog({
        logType: '管理日志',
        module: '设备管理',
        operateName: '设备' + type,
        operateContent: data.name,
        target: '报警主机-输入源-' + type,
        deviceIp: data.ip
      })
      if (!this.isJointResEdit) {
        this.addOneResToDevice(data)
          .then(() => {
            this.successMsg('资源添加成功')
            this.refreshDeviceResTable(this.deviceId)
            this.modalReset(name)
          })
          .catch(err => {
            console.log('addOneResToDevice error: ' + err)
            this.errorMsg(err)
            this.deviceResSelectIds = []
            this.deviceResSelectIdsDel = []
          })
      } else {
        this.saveResourceInfo({ form: data, id: data._id })
          .then(() => {
            this.successMsg('资源信息修改成功')
            this.refreshDeviceResTable(this.deviceId)
            this.modalReset(name)
          })
          .catch(err => {
            this.errorMsg(err)
            this.deviceResSelectIds = []
            this.deviceResSelectIdsDel = []
            console.log('saveResourceInfo error: ' + err)
          })
      }
    },
    // 报警资源模态框的取消
    cancelJointInRes(name) {
      this.modalReset(name)
    },
    // 资源的删除
    openDeviceResDelModel() {
      if (this.deviceResSelectIds.length === 0) {
        this.warningMsg('请选择所需要删除的资源')
      } else {
        this.createDeviceResDelModel()
      }
    },
    createDeviceResDelModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选资源吗？</p>',
        onOk: () => {
          this.deviceResDelModelSave()
        },
        onCancel: () => {
          // this.deviceResSelectIds = []
        }
      })
    },
    deviceResDelModelSave() {
      let logName = []
      this.deviceResSelectIdsDel.forEach(item => {
        logName.push(item.name)
      })
      this.recordLog({
        logType: '管理日志',
        module: '设备管理',
        operateName: '设备删除',
        operateContent: logName.join(','),
        target: '报警主机-输入源-删除',
        deviceIp: this.deviceResSelectIds
      })
      // 普通资源删除
      this.deleteResource(this.deviceResSelectIds)
        .then(suc => {
          this.successMsg('资源删除成功')
          this.refreshDeviceResTable(this.deviceId)
        })
        .catch(err => {
          console.log('deleteResource error: ' + err)
          this.errorMsg(err)
          // this.deviceResSelectIds = []
        })
    },
    // 勾选
    selectDeviceResRow(sels) {
      sels.length === 0 ? (this.isDeviceResChecked = false) : (this.isDeviceResChecked = true)
      this.deviceResSelectIds = []
      this.deviceResSelectIdsDel = []
      for (let sel of sels) {
        this.deviceResSelectIdsDel.push(sel)
        this.deviceResSelectIds.push(sel._id)
      }
    }
  }
}
</script>
<style scoped>
.table-header-actions {
  height: 50px;
  padding: 0 10px;
  background-color: #1c3054;
  margin: 0;
}

/*按钮和inpu框*/

.actions-btn {
  width: 100%;
  float: left;
  margin-top: 10px;
}

.actions-btn .ivu-btn {
  margin-right: 10px;
  /*height: 32px;
  padding: 0 10px;*/
}

.actions-btn .ivu-select {
  margin-right: 10px;
}

/*视频通道弹出框样式*/

.res-add-form {
  /*margin-top: 20px;*/
  padding: 0px 10px;
}

.res-add-form .check-input .ivu-col-span-8 {
  width: 100px;
  height: 32px;
  line-height: 32px;
}

.res-add-form .check-input .ivu-col-span-16 {
  width: 296px;
  height: 56px;
}

.formTip {
  display: inline-block;
  color: red;
  height: 24px;
  line-height: 24px;
}

.check-input .ivu-col-span-16 input {
  display: inline-block;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #ffffff;
  background-color: #1c3053;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  outline: none;
}

.check-input .ivu-col-span-16 input:hover {
  border: 1px solid #33b7e9;
}

.check-input .ivu-col-span-16 input:focus {
  border: 1px solid #33b7e9;
}

.check-input .ivu-col-span-16 .redBorder {
  border: 1px solid red;
}

.check-input .ivu-col-span-16 .redBorder:hover {
  border: 1px solid red;
}

.check-input .ivu-col-span-16 .redBorder:focus {
  border: 1px solid red;
}

.table-relative {
  position: relative;
}

.table-body {
  width: 100%;
  position: absolute;
}
</style>
