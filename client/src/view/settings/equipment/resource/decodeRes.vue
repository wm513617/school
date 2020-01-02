<template>
  <div class="res-table-video">
    <div class="table-header">
      <TableTab :tabs="decodeTabs" @on-tab-click="deviceResTabClick" :isCount="true"></TableTab>
      <div class="table-header-actions clear">
        <div class="actions-btn">
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-DECODE-MANAGE')" icon="plus" @click="addDeviceRes" :disabled="this.deviceId !== 'notExist' ? false : true">添加</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-DECODE-MANAGE')" icon="edit" @click="openEditDeviceResInfo" :disabled="!isDeviceResChecked">修改</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-DECODE-MANAGE')" icon="trash-a" @click="openDeviceResDelModel" :disabled="!isDeviceResChecked">删除</Button>
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
    <!-- 报警输入弹窗 -->
    <AlarmInRes ref="AlarmInRes" :alarmInResShow="alarmInResShow" :isAlarmResEdit="isResEdit" :alarmInResFormData="alarmInResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName" :activeChannelType="activeChannelType"></AlarmInRes>
    <!-- 报警输出弹窗 -->
    <AlarmOutRes ref="AlarmOutRes" :alarmOutResShow="alarmOutResShow" :isAlarmResEdit="isResEdit" :alarmOutResFormData="alarmOutResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName"></AlarmOutRes>
    <!-- 解码通道、音频通道 弹窗 -->
    <DecodeVoiceRes ref="DecodeVoiceRes" :resShow="resShow" :isResEdit="isResEdit" :formData="resFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName"></DecodeVoiceRes>
  </div>
</template>
<script>
import TableTab from '../tableTab'
import AlarmInRes from '../modal/alarmInRes'
import AlarmOutRes from '../modal/alarmOutRes'
import DecodeVoiceRes from '../modal/decodeVoiceRes'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    TableTab,
    AlarmInRes,
    AlarmOutRes,
    DecodeVoiceRes
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
      // tableHeight: 232,
      // type: 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入
      // 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区
      // 解码tab
      decodeTabs: [
        {
          title: '解码通道',
          value: 'decode',
          type: 5,
          // disabled: false,
          active: true,
          number: 0
          // isHide: false
        }, {
          title: '音频通道',
          value: 'voice',
          type: 6,
          // disabled: false,
          active: false,
          number: 0
          // isHide: false
        }
        // {
        //   title: '报警输入',
        //   value: 'alarmInput',
        //   type: 7,
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }, {
        //   title: '报警输出',
        //   value: 'alarmOutput',
        //   type: 8,
        //   disabled: false,
        //   active: false,
        //   number: 0,
        //   isHide: false
        // }
      ],
      deviceResColumns: [],
      decodeChanResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '通道号',
          key: 'chan',
          align: 'left'
        }, {
          title: '解码通道名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }
      ],
      voiceChanResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '通道号',
          key: 'chan',
          align: 'left'
        }, {
          title: '音频通道名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }
      ],
      alarmInResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '防区编号',
          key: 'chan',
          align: 'left'
        }, {
          title: '报警输入名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }, {
          title: '级别',
          key: 'level',
          align: 'left'
        }, {
          title: '报警分类',
          key: 'alarmtype',
          align: 'left',
          render: (h, params) => {
            let text = ''
            this.enabledSort.map((item) => {
              if (item.value === params.row.alarmtype) {
                text = item.label
              }
            })
            return h('span', text)
          }
        }, {
          title: '布防时间',
          key: 'alarmtemplate',
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (!params.row.alarmtemplate) {
              text = ''
            } else {
              this.enabledTemp.map((item) => {
                if (item.value === params.row.alarmtemplate) {
                  text = item.label
                }
              })
            }
            return h('span', text)
          }
        }, {
          title: '最大延时',
          key: 'maxdelaytime',
          align: 'left'
        }, {
          title: '最小间隔',
          key: 'minintervaltime',
          align: 'left'
        }
      ],
      alarmOutResColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'left'
        }, {
          title: '防区编号',
          key: 'chan',
          align: 'left'
        }, {
          title: '报警输出名称',
          key: 'name',
          align: 'left',
          render: (h, params) => {
            return h('span', {
              style: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              },
              domProps: {
                title: params.row.name
              }
            }, params.row.name)
          }
        }, {
          title: '输出类型',
          key: 'alarmouttype',
          align: 'left',
          render: (h, params) => {
            let text = params.row.alarmouttype === '0' ? '常开' : '常闭'
            return h('span', text)
          }
        }, {
          title: '持续时间',
          key: 'durationtime',
          align: 'left'
        }, {
          title: '输出延时',
          key: 'exportdelaytime',
          align: 'left'
        }
      ],
      deviceAllResData: [],
      activeResTab: 'alarmInput',
      activeResName: '',
      activeChannelType: 0,
      deviceResSelectIds: [],
      deviceResSelectIdsDel: [],
      isDeviceResChecked: false,
      // 报警输入的资源
      alarmInResShow: false,
      isResEdit: false,
      alarmInResFormData: {},
      alarmInResPlus: {
        eid: '',
        type: 7,
        name: '',
        chan: 1,
        level: 1,
        alarmtype: '',
        alarmtemplate: '',
        maxdelaytime: 300,
        minintervaltime: 300,
        mapsign: { // 地图标识
          signflag: false,
          signtype: 0 // 0:图标,1:线,2:区域
          // signvalue: ''
        },
        alarmaffirm: { // 报警确认
          affirmflag: true,
          autoaffirm: {
            status: false,
            intervaltime: 20
          },
          handaffirm: {
            status: true
          }
        }
      },
      chanList: [],
      // 报警输出的资源
      alarmOutResShow: false,
      alarmOutResFormData: {},
      // 解码、音频 资源
      resShow: false,
      resFormData: {}
    }
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledLevel', 'enabledTemp'])
  },
  created() {
    this.deviceResColumns = this.decodeChanResColumns
    // 获取分类数据
    this.getSortData().then().catch((err) => {
      console.log('getSortData error: ' + err)
    })
    // 获取时间模板
    this.getAlarmTemp().then().catch((err) => {
      console.log('getAlarmTemp error: ' + err)
    })
    // 获取报警级别
    // this.getAlarmLevel()
  },
  watch: {
    // 监听设备变化
    deviceId(newId) {
      this.refreshDeviceResTable(newId)
      // 获取当前设备的信息改变TAB和TABLE的title
      for (let d in this.decodeTabs) {
        this.decodeTabs[d].active = false
      }
      this.activeResTab = this.decodeTabs[0].value
      this.activeResName = this.decodeTabs[0].title
      this.activeChannelType = this.decodeTabs[0].type
      this.decodeTabs[0].active = true
      // this.getDeviceInfo(newId).then(suc => {
      //   if (suc.type === 'softDecoder') {
      //     this.decodeTabs[1].isHide = true
      //     this.decodeTabs[2].isHide = true
      //     this.decodeTabs[3].isHide = true
      //   } else {
      //     this.decodeTabs[1].isHide = false
      //     this.decodeTabs[2].isHide = false
      //     this.decodeTabs[3].isHide = false
      //   }
      // })
    },
    // 监听tab变化转换Columns
    activeResTab(newId) {
      if (this.activeResTab === 'alarmInput') {
        this.deviceResColumns = this.alarmInResColumns
      } else if (this.activeResTab === 'alarmOutput') {
        this.deviceResColumns = this.alarmOutResColumns
      } else if (this.activeResTab === 'decode') {
        this.deviceResColumns = this.decodeChanResColumns
      } else if (this.activeResTab === 'voice') {
        this.deviceResColumns = this.voiceChanResColumns
      }
    }
  },
  methods: {
    ...mapActions(['getSortData', 'getAlarmTemp', 'getAlarmLevel', 'getDeviceInfo', 'getResOfDeviceById', 'addOneResToDevice',
      'getNotOccupyChannel', 'deleteResource', 'getSingleResource', 'saveResourceInfo', 'recordLog']),
    // 点击tab
    deviceResTabClick(tab) {
      this.activeResTab = tab.obj.value
      this.activeResName = tab.obj.title
      this.activeChannelType = tab.obj.type
      this.deviceResSelectIds = []
      this.deviceResSelectIdsDel = []
      // this.alarmResSelectArr = []
      this.isDeviceResChecked = false
    },
    // 获取某一个设备下的资源列表
    refreshDeviceResTable(id) {
      if (id === 'notExist') {
        this.deviceAllResData = {}
        for (let v = 0; v < this.decodeTabs.length; v++) {
          this.decodeTabs[v].number = 0
        }
      } else {
        this.getResOfDeviceById(id).then(suc => {
          this.deviceAllResData = suc
          for (let v = 0; v < this.decodeTabs.length; v++) {
            this.decodeTabs[v].number = suc[this.decodeTabs[v].value].length
          }
          // this.successMsg('数据刷新成功')
        }).catch((err) => {
          console.log('getResOfDeviceById error: ' + err)
        })
      }
      this.deviceResSelectIds = []
      this.deviceResSelectIdsDel = []
      // this.alarmResSelectArr = []
      this.isDeviceResChecked = false
    },
    // 资源的添加
    addDeviceRes() {
      this.isResEdit = false
      // 获取指定设备下未占用的通道号
      this.chanList = []
      this.getNotOccupyChannel({ type: this.activeChannelType, deviceId: this.deviceId }).then(suc => {
        if (suc.length === 0) {
          this.warningMsg('设备无多余通道,无法继续添加资源')
        } else {
          for (let i = 0; i < suc.length; i++) {
            this.chanList.push({ value: suc[i], label: suc[i] })
          }
          // 添加报警
          if (this.activeResTab === 'alarmInput') { this.addAlarmInput() } else if (this.activeResTab === 'alarmOutput') { this.addAlarmOutput() } else if (this.activeResTab === 'decode' || this.activeResTab === 'voice') { this.decodeVoiceAddRes() }
        }
      }).catch((err) => {
        console.log('getNotOccupyChannel error: ' + err)
      })
    },
    // 添加报警输入
    addAlarmInput() {
      this.alarmInResShow = true
      let alarmtype = ''
      let alarmtemplate = ''
      if (this.enabledSort.length !== 0) {
        alarmtype = this.enabledSort[0].value
      }
      if (this.enabledTemp.length !== 0) {
        alarmtemplate = this.enabledTemp[0].value
      }
      this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, {
        eid: this.deviceId,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value,
        chan: this.chanList[0].value,
        alarmtemplate: alarmtemplate,
        alarmtype: alarmtype
      })
    },
    // 添加报警输出
    addAlarmOutput() {
      this.alarmOutResShow = true
      this.alarmOutResFormData = {
        eid: this.deviceId,
        type: 8,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value,
        chan: this.chanList[0].value,
        alarmouttype: '0',
        durationtime: 10,
        exportdelaytime: 0
      }
    },
    // 添加解码、音频 资源
    decodeVoiceAddRes() {
      this.resShow = true
      this.resFormData = {
        eid: this.deviceId,
        type: this.activeChannelType,
        name: this.deviceName + '_' + this.activeResName + '_通道' + this.chanList[0].value,
        chan: this.chanList[0].value
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
      this.isResEdit = true
      this.getSingleResource(this.deviceResSelectIds[0]).then(suc => {
        if (this.activeResTab === 'alarmInput') {
          this.alarmInResShow = true
          this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, suc)
        } else if (this.activeResTab === 'alarmOutput') {
          this.alarmOutResShow = true
          this.alarmOutResFormData = suc
        } else if (this.activeResTab === 'decode' || this.activeResTab === 'voice') {
          this.resShow = true
          this.resFormData = suc
        }
      })
    },
    modalReset(name) {
      if (this.activeResTab === 'alarmInput') {
        this.alarmInResShow = false
        this.$refs['AlarmInRes'].$refs[name].resetFields()
      } else if (this.activeResTab === 'alarmOutput') {
        this.alarmOutResShow = false
        this.$refs['AlarmOutRes'].$refs[name].resetFields()
      } else if (this.activeResTab === 'decode' || this.activeResTab === 'voice') {
        this.resShow = false
        this.$refs['DecodeVoiceRes'].$refs[name].resetFields()
      }
    },
    // 报警资源模态框的保存
    saveAlarmInRes(data, name) {
      let type = this.isResEdit ? '修改' : '添加'
      this.recordLog({
        logType: '管理日志',
        module: '设备管理',
        operateName: '设备' + type,
        operateContent: data.name,
        target: '解码器-解码通道-' + type,
        deviceIp: data.ip
      })
      if (!this.isResEdit) {
        this.addOneResToDevice(data).then(() => {
          this.successMsg('资源添加成功')
          this.refreshDeviceResTable(this.deviceId)
          this.modalReset(name)
        }).catch((err) => {
          this.errorMsg(err)
          this.deviceResSelectIds = []
          this.deviceResSelectIdsDel = []
          console.log('addOneResToDevice error: ' + err)
        })
      } else {
        this.saveResourceInfo({ form: data, id: data._id }).then(() => {
          this.successMsg('资源信息修改成功')
          this.refreshDeviceResTable(this.deviceId)
          this.modalReset(name)
        }).catch((err) => {
          this.errorMsg(err)
          this.deviceResSelectIds = []
          this.deviceResSelectIdsDel = []
          console.log('saveResourceInfo error: ' + err)
        })
      }
    },
    // 报警资源模态框的取消
    cancelAlarmInRes(name) {
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
        target: '解码器-解码通道-删除',
        deviceIp: this.deviceResSelectIds
      })
      // 普通资源删除
      this.deleteResource(this.deviceResSelectIds).then(suc => {
        this.successMsg('资源删除成功')
        this.refreshDeviceResTable(this.deviceId)
      }).catch((err) => {
        console.log('deleteResource error: ' + err)
        this.errorMsg(err)
        // this.deviceResSelectIds = []
      })
    },
    // 勾选
    selectDeviceResRow(sels) {
      sels.length === 0 ? this.isDeviceResChecked = false : this.isDeviceResChecked = true
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
  height: 54px;
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
  margin-right: 8px;
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
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
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
