<template>
  <div class="repair-unit bs-content">
    <div class="bs-main">
      <div class="bsMainChild">
        <div class="tab-content-alarm">
          <div class="page-top">
            <Button type='ghost' class='commonStyle ivu-btn ivu-btn-ghost' icon="ivu-icon ivu-icon-plus" @click="deviceSingleAdd">添加</Button>
            <Button type="ghost" class='commonStyle ivu-btn ivu-btn-ghost' icon="edit" @click="deviceEditModal" :disabled="!isDeviceChecked">修改</Button>
            <Button type='ghost' class='commonStyle ivu-btn ivu-btn-ghost' icon="ios-trash-outline" @click="deviceDeleteOpen" :disabled="!isDeviceChecked">删除</Button>
            <Button type="ghost" class='commonStyle ivu-btn ivu-btn-ghost' icon="android-refresh" @click="Refresh">刷新</Button>
          </div>
          <div class="table-relative">
            <div class="table-body credit-card-record">
              <Table style="margin-top: 16px;" size="small" :columns="tableColumns" :data="MaintenUnitDataList" :height="tableHeight" @on-selection-change="selectDeviceRow"></Table>
            </div>
          </div>
          <div class="page-style">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
          </div>
        </div>
      </div>
    </div>
    <Modal :mask-closable="false" v-model="deviceAddModal" width="780" :title="isEditDevice?'修改维保单位':'添加维保单位'" @onCancel="addRepairUnitCancel">
      <Form :model="deviceFormData" label-position="left" :label-width="80" ref="deviceVideOneForm" :rules="deviceFormRole" style="padding:0px 10px">
        <Form-item label="单位名称" prop="maintenanceVendor">
          <Input style="width:70%" v-model="deviceFormData.maintenanceVendor"></Input>
        </Form-item>
        <Form-item label="联系人1" prop="contacts[0].contact" :show-message='false'>
          <Col span="8" style="margin-right:28px">
          <Form-item prop="contacts[0].contact">
            <Input placeholder="姓名" v-model="deviceFormData.contacts[0].contact"></Input>
          </Form-item>
          </Col>
          <Col span="6" style="margin-right:28px">
          <Form-item prop="contacts[0].phone">
            <Input placeholder="电话" v-model="deviceFormData.contacts[0].phone"></Input>
          </Form-item>
          </Col>
          <Col span="7">
          <Form-item prop="contacts[0].email">
            <Input placeholder="邮件地址" v-model="deviceFormData.contacts[0].email"></Input>
          </Form-item>
          </Col>
        </Form-item>
        <Form-item label="联系人2">
          <Col span="8" style="margin-right:28px">
          <Form-item prop="contacts[1].contact">
            <Input placeholder="姓名" v-model="deviceFormData.contacts[1].contact"></Input>
          </Form-item>
          </Col>
          <Col span="6" style="margin-right:28px">
          <Form-item prop="contacts[1].phone">
            <Input placeholder="电话" v-model="deviceFormData.contacts[1].phone"></Input>
          </Form-item>
          </Col>
          <Col span="7">
          <Form-item prop="contacts[1].email">
            <Input placeholder="邮件地址" v-model="deviceFormData.contacts[1].email"></Input>
          </Form-item>
          </Col>
        </Form-item>
        <Form-item label="联系人3">
          <Col span="8" style="margin-right:28px">
          <Form-item prop="contacts[2].contact">
            <Input placeholder="姓名" v-model="deviceFormData.contacts[2].contact"></Input>
          </Form-item>
          </Col>
          <Col span="6" style="margin-right:28px">
          <Form-item prop="contacts[2].phone">
            <Input placeholder="电话" v-model="deviceFormData.contacts[2].phone"></Input>
          </Form-item>
          </Col>
          <Col span="7">
          <Form-item prop="contacts[2].email">
            <Input placeholder="邮件地址" v-model="deviceFormData.contacts[2].email"></Input>
          </Form-item>
          </Col>
        </Form-item>
        <Form-item label="联系人4">
          <Col span="8" style="margin-right:28px">
          <Form-item prop="contacts[3].contact">
            <Input placeholder="姓名" v-model="deviceFormData.contacts[3].contact"></Input>
          </Form-item>
          </Col>
          <Col span="6" style="margin-right:28px">
          <Form-item prop="contacts[3].phone">
            <Input placeholder="电话" v-model="deviceFormData.contacts[3].phone"></Input>
          </Form-item>
          </Col>
          <Col span="7">
          <Form-item prop="contacts[3].email">
            <Input placeholder="邮件地址" v-model="deviceFormData.contacts[3].email"></Input>
          </Form-item>
          </Col>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click='addRepairUnitCancel'>取消</Button>
        <Button type="primary" @click='editOk("deviceVideOneForm")'>确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  data() {
    // 输入框校验
    const checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('维修单位名称不能为空'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('不可以输入空格'))
      } else if ((value + '').length > 32) {
        callback(new Error('维修单位名称取值范围为1-32字符！'))
      } else {
        callback()
      }
    }
    const checkNameOne = (rule, value, callback) => {
      if (!value) {
        callback(new Error('联系人1姓名不能为空'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('不可以输入空格'))
      } else if ((value + '').length > 16) {
        callback(new Error('联系人姓名取值范围为1-16字符！'))
      } else {
        callback()
      }
    }
    // 次要联系人姓名校验
    const checkNameElse = (rule, value, callback) => {
      if ((value + '').length > 16) {
        callback(new Error('联系人姓名取值范围为1-16字符！'))
      } else if (value.indexOf(' ') !== -1) {
        callback(new Error('不可以输入空格'))
      } else {
        callback()
      }
    }
    // 电话号码
    const checkPhoneNumOne = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/
      if (!value) {
        callback(new Error('联系人1电话不能为空'))
      } else if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的电话号码！'))
      }
    }
    // 次要联系人电话
    const checkPhoneNumElse = (rule, value, callback) => {
      let reg = /^1[34578]\d{9}$/
      if (!value || reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的电话号码！'))
      }
    }
    const checkEmailAddr = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (!value || reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮件地址！'))
      }
    }
    return {
      deviceSelectIds: [],
      isDeviceChecked: false,
      deviceFormData: {
        maintenanceVendor: '',
        contacts: [
          {
            contact: '',
            email: '',
            phone: ''
          },
          {
            contact: '',
            email: '',
            phone: ''
          },
          {
            contact: '',
            email: '',
            phone: ''
          },
          {
            contact: '',
            email: '',
            phone: ''
          }
        ]
      },
      deviceFormRole: {
        maintenanceVendor: [{ required: true, validator: checkName, trigger: 'change' }],
        'contacts[0].contact': [{ required: true, validator: checkNameOne, trigger: 'change' }],
        'contacts[1].contact': [{ required: true, validator: checkNameElse, trigger: 'change' }],
        'contacts[2].contact': [{ required: true, validator: checkNameElse, trigger: 'change' }],
        'contacts[3].contact': [{ required: true, validator: checkNameElse, trigger: 'change' }],
        'contacts[0].phone': [{ required: true, validator: checkPhoneNumOne, trigger: 'change' }],
        'contacts[1].phone': [{ required: true, validator: checkPhoneNumElse, trigger: 'change' }],
        'contacts[2].phone': [{ required: true, validator: checkPhoneNumElse, trigger: 'change' }],
        'contacts[3].phone': [{ required: true, validator: checkPhoneNumElse, trigger: 'change' }],
        'contacts[0].email': [{ validator: checkEmailAddr, trigger: 'change' }],
        'contacts[1].email': [{ validator: checkEmailAddr, trigger: 'change' }],
        'contacts[2].email': [{ validator: checkEmailAddr, trigger: 'change' }],
        'contacts[3].email': [{ validator: checkEmailAddr, trigger: 'change' }]
      },
      deviceAddModal: false,
      isEditDevice: false,
      pageLimit: this.$PageInfo.limit,
      tableHeight: 435,
      inPageNum: '',
      startNum: 1,
      tableColumns: [
        {
          type: 'selection',
          width: 90,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 200,
          align: 'center'
        },
        {
          title: '单位名称',
          key: 'maintenanceVendor',
          minWidth: 200,
          ellipsis: true
        },
        {
          title: '联系人',
          key: 'contact'
          // width: 120,
          // ellipsis: true
        },
        {
          title: '联系电话',
          key: 'phone'
          // width: 100
        },
        {
          title: '邮件地址',
          key: 'email'
          // width: 100
        }
      ],
      // 维修单位列表数据
      MaintenUnitDataList: []
    }
  },
  computed: {
    ...mapState({
      repairUnitData: ({ opsConfig }) => opsConfig.repairUnitData,
      editorUnitInfo: ({ opsConfig }) => opsConfig.editorUnitInfo,
      pageShowData: ({ opsConfig }) => opsConfig.pageShowData
    })
  },
  created() {
    this.getRepairUnitList()
  },
  mounted() {
    // this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
    const bodyHeight = this.$root.$el.clientHeight
    this.tableWrrpHeight = (bodyHeight - 210 < 520 ? 520 : bodyHeight - 210) + 'px'
    this.tableHeight = this.tableWrrpHeight.split('px')[0] - 40
  },
  methods: {
    ...mapActions(['getRepairUnit', 'addRepairUnit', 'delRepairUnit', 'getEditorRepairInfo', 'editorRepairUnit']),
    ...mapMutations(['SET_REPAIRNIT_DATA']),
    // 获取维修单位列表
    getRepairUnitList() {
      // this.MaintenUnitDataList = []
      const getUnitEnterParams = {
        page: this.startNum,
        limit: this.pageLimit
      }
      this.getRepairUnit(getUnitEnterParams)
        .then(suc => {
          this.MaintenUnitDataList = JSON.parse(JSON.stringify(this.repairUnitData.devList))
          for (let i = 0; i < this.repairUnitData.devList.length; i++) {
            this.MaintenUnitDataList[i].maintenanceVendor = this.repairUnitData.devList[i].maintenanceVendor
            this.MaintenUnitDataList[i].contact = this.repairUnitData.devList[i].contacts[0].contact
            this.MaintenUnitDataList[i].phone = this.repairUnitData.devList[i].contacts[0].phone
            this.MaintenUnitDataList[i].email = this.repairUnitData.devList[i].contacts[0].email
          }
          this.inPageNum = Number(this.pageShowData.counts)
        })
        .catch(err => {
          this.errorMsg('获取列表失败！' + err.response.data.message)
          console.log('vuex getRepairUnit error: ' + err)
        })
    },
    // 点击修改按钮，修改弹出框，获取当前要修改的单位信息
    deviceEditModal() {
      if (this.deviceSelectIds.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
        return
      }
      this.getEditorRepairInfo(this.deviceSelectIds[0])
        .then(suc => {
          this.deviceFormData.maintenanceVendor = this.editorUnitInfo.maintenanceVendor
          for (let i = 0; i < this.editorUnitInfo.contacts.length; i++) {
            this.deviceFormData.contacts[i].contact = this.editorUnitInfo.contacts[i].contact
            this.deviceFormData.contacts[i].email = this.editorUnitInfo.contacts[i].email
            this.deviceFormData.contacts[i].phone = this.editorUnitInfo.contacts[i].phone
          }
        })
        .catch(err => {
          console.log('getEditorRepairInfo error: ' + err)
        })
      this.isEditDevice = true
      this.deviceAddModal = true
    },
    // 维修单位删除的方法
    deviceDeleteOpen() {
      if (this.deviceSelectIds.length === 0) {
        this.warningMsg('请选择需要删除的维修单位')
        return
      }
      this.createDeviceDelModel()
    },
    createDeviceDelModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选维修单位吗？</p>',
        onOk: () => {
          this.deviceDeleteSave()
        },
        onCancel: () => {}
      })
    },
    deviceDeleteSave() {
      this.delRepairUnit(this.deviceSelectIds)
        .then(suc => {
          this.successMsg('删除成功')
          this.isDeviceChecked = false
          this.getRepairUnitList()
        })
        .catch(err => {
          this.errorMsg('删除失败！' + err.response.data.message)
          console.log('vuex delRepairUnit error: ' + err)
        })
    },
    // 选中复选框获取每个的ID
    selectDeviceRow(sels) {
      if (sels.length === 0) {
        this.isDeviceChecked = false
      } else {
        this.isDeviceChecked = true
      }
      this.deviceSelectIds = []
      for (let sel of sels) {
        this.deviceSelectIds.push(sel._id)
      }
    },
    // 点击添加按钮，弹出添加弹出框
    deviceSingleAdd() {
      this.isEditDevice = false
      this.deviceAddModal = true
      this.$refs.deviceVideOneForm.resetFields()
    },
    // 分页功能(每页限制多少条)
    pageSizeChange(n) {
      this.pageLimit = n
      this.getRepairUnitList()
    },
    // 当前在多少页(跳至多少页)
    pageChange(n) {
      this.startNum = n
      this.getRepairUnitList()
    },
    // 弹出框取消
    addRepairUnitCancel() {
      this.deviceAddModal = false
    },
    // 添加、编辑模态框确认
    editOk(name) {
      // 编辑
      if (this.isEditDevice) {
        this.$refs[name].validate(valid => {
          if (valid) {
            this.editorRepairUnit({ addParams: this.deviceFormData, id: this.deviceSelectIds[0] })
              .then(suc => {
                this.successMsg('修改成功')
                this.getRepairUnitList()
                this.deviceAddModal = false
                this.isDeviceChecked = false
              })
              .catch(err => {
                this.errorMsg('修改失败！' + err.response.data.message)
                console.log('editorRepairUnit error: ' + err)
              })
          } else {
            this.warningMsg('请填写正确的信息')
          }
        })
      } else {
        // 添加
        this.$refs[name].validate(valid => {
          if (valid) {
            this.addRepairUnit(this.deviceFormData)
              .then(suc => {
                this.successMsg('添加成功')
                this.getRepairUnitList()
                this.deviceAddModal = false
              })
              .catch(err => {
                this.errorMsg('添加失败！' + err.response.data.message)
                console.log('addRepairUnit error: ' + err)
              })
          } else {
            this.warningMsg('请填写正确的信息')
          }
        })
      }
    },
    // 刷新
    Refresh() {
      this.getRepairUnitList()
      this.isDeviceChecked = false
    }
  }
}
</script>

<style scoped>
.commonStyle {
  margin-right: 8px;
  height: 32px;
  /* line-height: 32px; */
}
.flex-1 {
  position: relative;
}
.bs-table-box {
  position: absolute;
  left: 0;
  right: 0;
  height: 100%;
  background: #1c3053;
}
.bs-main {
  min-height: 670px;
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
  padding: 0px;
  background: #1c3053;
}
.page-top {
  margin: 15px 0px 0px 24px;
  height: 33px;
  line-height: 33px;
}
.table-relative {
  position: relative;
  height: 454px;
  margin: 0px;
  width: 100%;
}
.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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
.rt {
  float: right;
}
</style>
