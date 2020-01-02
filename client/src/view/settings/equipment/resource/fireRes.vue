<template>
  <div class="res-table-video">
    <div class="table-header">
      <TableTab :tabs="fireTabs" @on-tab-click="deviceResTabClick" :isCount="true"></TableTab>
      <div class="table-header-actions clear">
        <div class="actions-btn">
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="plus" @click="addDeviceRes" :disabled="this.deviceId !== 'notExist' ? false : true">添加</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="edit" @click="openEditDeviceResInfo" :disabled="!isDeviceResChecked">修改</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="trash-a" @click="openDeviceResDelModel" :disabled="!isDeviceResChecked">删除</Button>
          <Upload style="display:inline-block;" ref="upload" name="file" :headers="headerObj" :action="'/api/setting/resource/import?eid='+this.deviceId+'&type=11'" :format="['xls','xlsx']" :on-success="uploadSuc" :on-error="uploadError" :on-format-error="formatError" :show-upload-list="false">
            <Button type="ghost" icon="ivu-icon iconfont icon-import">导入</Button>
          </Upload>
          <Button type="ghost" @click="exportData">
            <i class="ivu-icon iconfont icon-export" style="font-size:14px;"></i>&nbsp;导出
          </Button>
          <Button type="ghost" icon="refresh" @click="refreshDeviceResTable(deviceId)">刷新</Button>
          <Button type="ghost" v-if="$BShasPower('BS-SETTING-EQUIPMENT-FIRE-MANAGE')" icon="plus" @click="addPatchDeviceRes" :disabled="this.deviceId !== 'notExist' ? false : true">批量添加</Button>
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
    <!-- 输入防区弹窗 -->
    <AlarmInRes ref="AlarmInRes" :alarmInResShow="alarmInResShow" :isLoading="isLoading" :isAlarmResEdit="isAlarmResEdit" :alarmInResFormData="alarmInResFormData" @save="saveAlarmInRes" @cancel="cancelAlarmInRes" :chanList="chanList" :deviceName="deviceName" :activeResName="activeResName" :activeChannelType="activeChannelType" :isPatch="isPatch" @savePatch="savePatchAlarm"></AlarmInRes>
  </div>
</template>
<script>
import TableTab from '../tableTab'
import AlarmInRes from '../modal/alarmInRes'
import { mapActions, mapGetters } from 'vuex'
export default {
  components: {
    TableTab,
    AlarmInRes
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
    },
    resourcesType: {
      type: String
    }
  },
  data() {
    return {
      // type: 0：视频通道 1：视频报警输入 2：视频报警输出通道 3：对讲通道 4：门禁通道 5：解码通道 6：音频通道 7：解码报警输入
      // 8：解码报警输出 9：报警主机报警输入 10：报警主机报警输出 11：消防输入防区 12：消防输出防区
      headerObj: { Authorization: '' },
      // 报警tab
      fireTabs: [
        {
          title: '输入防区',
          value: 'alarmInput',
          type: 11,
          disabled: false,
          active: true,
          number: 0,
          isHide: false
        }
      ],
      deviceResColumns: [],
      alarmInResColumns: [
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
          title: '输入防区名称',
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
          title: '设备回路',
          key: 'devloop',
          align: 'left',
          ellipsis: true
        },
        {
          title: '防区编号',
          key: 'chan',
          align: 'left'
        },
        {
          title: '级别',
          key: 'level',
          align: 'left'
        },
        {
          title: '布防时间',
          key: 'alarmtemplate',
          align: 'left',
          render: (h, params) => {
            let text = ''
            if (!params.row.alarmtemplate) {
              text = ''
            } else {
              this.enabledTemp.map(item => {
                if (item.value === params.row.alarmtemplate) {
                  text = item.label
                }
              })
            }
            return h('span', text)
          }
        },
        {
          title: '最大延时',
          key: 'maxdelaytime',
          align: 'left'
        },
        {
          title: '最小间隔',
          key: 'minintervaltime',
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
      isAlarmResEdit: false,
      alarmInResFormData: {},
      alarmInResPlus: {
        eid: '',
        type: 11,
        name: '',
        chan: 0,
        level: 1,
        devloop: 0, // 设备回路
        // alarmtype: '',  不存在报警分类
        alarmtemplate: '',
        maxdelaytime: 300,
        minintervaltime: 300,
        mapsign: {
          // 地图标识
          signflag: false,
          signtype: 0 // 0:图标,1:线,2:区域
          // signvalue: ''
        },
        alarmaffirm: {
          // 报警确认
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
      isPatch: false, // 是否为批量添加
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['enabledSort', 'enabledLevel', 'enabledTemp', 'accessToken'])
  },
  created() {
    this.headerObj.Authorization = `Bearer ${this.accessToken}`
    this.deviceResColumns = this.alarmInResColumns
    // 获取分类数据
    // this.getSortData()
    // 获取时间模板
    this.getAlarmTemp()
      .then()
      .catch(err => {
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
      // this.getDeviceInfo(newId).then(suc => {
      // console.log(suc)
      // this.deviceTabType = suc.bigtype
      // 报警主机下的资源
      // if (this.deviceTabType === 1) {
      for (let d in this.fireTabs) {
        this.fireTabs[d].active = false
      }
      this.activeResTab = this.fireTabs[0].value
      this.activeResName = this.fireTabs[0].title
      this.activeChannelType = this.fireTabs[0].type
      this.fireTabs[0].active = true
      // }
      // })
    },
    // 监听tab变化转换Columns
    activeResTab(newId) {
      if (this.activeResTab === 'alarmInput') {
        this.deviceResColumns = this.alarmInResColumns
      }
    }
  },
  methods: {
    ...mapActions([
      'getSortData',
      'getAlarmTemp',
      'getAlarmLevel',
      'getDeviceInfo',
      'getResOfDeviceById',
      'addOneResToDevice',
      'getNotOccupyChannel',
      'getSingleResource',
      'saveResourceInfo',
      'addPatchRes',
      'recordLog',
      'deleteToPlayTheInput'
    ]),
    // 导入成功
    uploadSuc() {
      this.refreshDeviceResTable(this.deviceId)
      this.successMsg('导入成功')
    },
    // 导入失败
    uploadError(file, err, fileList) {
      if (err.code === 1019) {
        this.errorMsg(err.message)
      } else {
        this.errorMsg('导入数据有误！')
      }
    },
    // 上传的文件类型限制（xls、xlsx）
    formatError(file) {
      this.warningMsg('文件 ' + file.name + ' 格式不正确，请上传xls、xlsx格式的表格。')
    },
    // 导出
    exportData() {
      let elemIF = document.createElement('iframe')
      elemIF.src =
        window.location.origin + `/api/setting/resource/export?eid=${this.deviceId}&type=${this.deviceAllResData[this.activeResTab][0].type}`
      elemIF.style.display = 'none'
      document.body.appendChild(elemIF)
    },
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
        for (let v = 0; v < this.fireTabs.length; v++) {
          this.fireTabs[v].number = 0
        }
      } else {
        this.getResOfDeviceById(id)
          .then(suc => {
            this.deviceAllResData = suc
            for (let v = 0; v < this.fireTabs.length; v++) {
              this.fireTabs[v].number = suc[this.fireTabs[v].value].length
            }
            // this.successMsg('数据刷新成功')
          })
          .catch(err => {
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
      this.isAlarmResEdit = false
      // 获取指定设备下未占用的通道号
      this.chanList = []
      // this.getNotOccupyChannel({ type: this.activeChannelType, deviceId: this.deviceId }).then(suc => {
      //   if (suc.length === 0) {
      //     this.warningMsg('设备无多余通道,无法继续添加资源')
      //     return
      //   } else {
      //     for (let i = 0; i < suc.length; i++) {
      //       this.chanList.push({ value: suc[i], label: suc[i] })
      //     }
      //     // 添加报警
      if (this.activeResTab === 'alarmInput') {
        this.addAlarmInput()
      }
      //     // if (this.activeResTab === 'alarmOutput') { this.addAlarmOutput() }
      //   }
      // }).catch((err) => {
      //   console.log('getNotOccupyChannel error: ' + err)
      // })
    },
    // 添加报警输入
    addAlarmInput() {
      this.isPatch = false
      this.alarmInResShow = true
      let alarmtemplate = ''
      if (this.enabledTemp.length !== 0) {
        alarmtemplate = this.enabledTemp[0].value
      }
      this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, {
        eid: this.deviceId,
        chan: 0,
        name: this.deviceName + '_' + this.activeResName + '_' + 0 + '_' + 0,
        alarmtemplate: alarmtemplate
      })
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
      this.isPatch = false
      this.isAlarmResEdit = true
      this.getSingleResource(this.deviceResSelectIds[0]).then(suc => {
        if (this.activeResTab === 'alarmInput') {
          this.alarmInResShow = true
          this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, suc)
          this.alarmInResFormData.devloop = Number(suc.devloop)
        }
      })
    },
    modalReset(name) {
      if (this.activeResTab === 'alarmInput') {
        this.alarmInResShow = false
        this.$refs['AlarmInRes'].$refs[name].resetFields()
      }
    },
    // 报警资源模态框的保存
    saveAlarmInRes(data, name) {
      let type = this.isAlarmResEdit ? '修改' : '添加'
      this.recordLog({
        logType: '管理日志',
        module: '设备管理',
        operateName: '设备' + type,
        operateContent: data.name,
        target: '消防主机-输入防区-' + type,
        deviceIp: data.ip
      })
      if (!this.isAlarmResEdit) {
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
        target: '消防主机-输入防区-删除',
        deviceIp: this.deviceResSelectIds
      })
      // 普通资源删除
      this.deleteToPlayTheInput(this.deviceResSelectIds)
        .then(suc => {
          this.successMsg('资源删除成功')
          this.refreshDeviceResTable(this.deviceId)
        })
        .catch(err => {
          console.log('deleteToPlayTheInput error: ' + err)
          this.errorMsg(err.response.status === 504 ? '服务器请求超时' : err.response.data.message)
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
    },
    // 批量添加
    addPatchDeviceRes() {
      this.isPatch = true
      this.isAlarmResEdit = false
      let alarmtemplate = ''
      if (this.enabledTemp.length !== 0) {
        alarmtemplate = this.enabledTemp[0].value
      }
      this.alarmInResFormData = Object.assign({}, this.alarmInResPlus, {
        eid: this.deviceId,
        chan: 0,
        fireInputNum: 1,
        alarmtemplate: alarmtemplate
      })
      delete this.alarmInResFormData.name
      this.alarmInResShow = true
    },
    savePatchAlarm(data, name) {
      this.isLoading = true
      this.addPatchRes(data)
        .then(() => {
          this.isLoading = false
          this.alarmInResShow = false
          this.successMsg('资源批量添加成功')
          this.refreshDeviceResTable(this.deviceId)
          this.$refs['AlarmInRes'].$refs[name].resetFields()
        })
        .catch(err => {
          this.isLoading = false
          this.alarmInResShow = false
          let status = err.response.status
          this.errorMsg(status === 504 ? '服务器请求超时' : err.response.data.message)
          this.deviceResSelectIds = []
        })
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
