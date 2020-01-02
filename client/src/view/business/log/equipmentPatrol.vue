<template>
    <div class="equipment-copy">
        <div class="equipment-head">
            <div class="row">
                <Input v-model="username" placeholder="请输入检查人" style="width: 200px" />
            </div>
            <div class="row">
                <DatePicker v-model="dateTime" type="date" placeholder="请输入日期" style="width: 200px"></DatePicker>
            </div>
            <Button icon="search" @click='search'>检索</Button>
            <Button @click='addEquipment' icon="plus">添加</Button>
            <Button icon="edit" @click='updateEquipment' :disabled='isChecked'>修改</Button>
            <Button icon="trash-a" @click='deleteEquip' :disabled='isChecked'>删除</Button>
        </div>
        <div class="table">
            <div class="table-box">
                <Table :columns="columns1" :data="devLogList" @on-selection-change="selectServeRow"></Table>
            </div>
        </div>
        <div class="foot-page">
            <Page class="rt" show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :current='Number(startNum)' :total="Number(inPageNum)" :page-size="Number(pageLimit)" @on-change="pageChange" show-elevator show-total></Page>
        </div>
        <Modal v-model="addModal" :title="isAdd ? '添加设备巡查记录' : '修改设备巡查纪录'" width='700'>
            <Form ref="formValidate" :label-width="110" :model="formValidate" inline>
                <FormItem label='巡查时间' prop='patrolTime'>
                    <DatePicker v-model="formValidate.patrolTime" type="date" placeholder="选择时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label='检查人' prop='userName'>
                    <Input style="width: 200px" v-model="formValidate.userName" placeholder="请输入检查人"/>
                </FormItem>
                <FormItem label='选择设备'>
                    <Select v-model="formValidate.facility" filterable style="width:400px">
                        <Option v-for="item in facilityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label='设备问题' prop='issue'>
                    <Input v-model="formValidate.issue" style="width: 400px" placeholder="请输入设备问题"/>
                    <Button style="margin-left: 10px" @click='addModalList'>+</Button>
                </FormItem>
                <FormItem label='设备列表'>
                    <Table width='550' height='232' border :columns="columns2" :data="modalList"></Table>
                </FormItem>
                <FormItem label='是否联系工程师' prop='animal'>
                    <RadioGroup v-model="formValidate.animal" style="width: 200px">
                        <Radio style='margin-right: 10px' label="是"></Radio>
                        <Radio label="否"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label='联系时间' prop='contactTime'>
                    <DatePicker type="date" v-model="formValidate.contactTime" placeholder="选择联系时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label='工程师姓名' prop='name'>
                    <Input style="width: 200px" v-model="formValidate.name" placeholder="请输入工程师姓名"/>
                </FormItem>
                <FormItem label='联系方式' prop='contact'>
                    <Input style="width: 200px" v-model="formValidate.contact" placeholder="请输入联系方式"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="confirm">确定</Button>
                <Button @click="cancel">取消</Button>
            </div>
        </Modal>

        <Modal v-model="detailsModal" title="详情" width='700'>
            <Form ref="formDetails" :model="formDetails" :label-width="110" inline>
                <FormItem label='巡查时间'>
                    <DatePicker type="date" :disabled='true' :readonly='true' v-model="formDetails.patrolTime" placeholder="选择时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label='检查人'>
                    <Input style="width: 200px" :disabled='true' v-model="formDetails.userName" placeholder="请输入检查人"/>
                </FormItem>
                <FormItem label='设备列表'>
                    <div style="width: 300px">{{modalList2.length}}</div>
                </FormItem>
                <FormItem label=''>
                    <Table width='550' height='232' border :columns="columns3" :data="modalList2"></Table>
                </FormItem>
                <FormItem label='是否联系工程师'>
                    <RadioGroup v-model="formDetails.animal" style="width: 200px">
                        <Radio style='margin-right: 10px' :label="formDetails.animal"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label='联系时间'>
                    <DatePicker type="date" :disabled="true" :readonly='true' v-model="formDetails.contactTime" placeholder="选择时间" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label='工程师姓名'>
                    <Input style="width: 200px" :disabled='true' v-model="formDetails.name" placeholder="请输入工程师姓名"/>
                </FormItem>
                <FormItem label='联系方式'>
                    <Input style="width: 200px" :disabled='true' v-model="formDetails.contact" placeholder="请输入联系方式"/>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="detailsConfirm">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      username: '',
      startNum: 1,
      dateTime: new Date(),
      inPageNum: '',
      pageLimit: this.$PageInfo.limit,
      addModal: false,
      isAdd: true,
      isChecked: true,
      formValidate: {
        patrolTime: new Date(),
        userName: '',
        facility: '',
        issue: '',
        animal: '是',
        contactTime: new Date(),
        name: '',
        contact: ''
      },
      formDetails: {
        patrolTime: new Date(),
        userName: '',
        animal: '是',
        contactTime: new Date(),
        name: '',
        contact: ''
      },
      facilityList: [],
      detailsModal: false,
      selectItem: '',
      selectedIndex: [],
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '检查人',
          key: 'checkName'
        },
        {
          title: '检查设备数量',
          key: 'number'
        },
        {
          title: '是否练习工程师',
          key: 'contact'
        },
        {
          title: '详情',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.details(params.row)
                  }
                }
              }, '详情')
            ])
          }
        }
      ],
      devLogList: [
      ],
      columns2: [
        {
          title: '设备名称',
          key: 'device'
        },
        {
          title: '设备问题',
          key: 'info'
        },
        {
          title: '#',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                on: {
                  click: () => {
                    this.deleteDevList(params.index)
                  }
                }
              }, '-')
            ])
          }
        }
      ],
      modalList: [],
      columns3: [
        {
          title: '设备名称',
          key: 'device'
        },
        {
          title: '设备问题',
          key: 'info'
        }
      ],
      modalList2: []
    }
  },
  created() {
    this.getDevLogList()
    this.getDeviceList().then(res => {
      console.log(res)
      res.data.forEach((item, index) => {
        this.facilityList.push({
          value: index,
          label: item.name,
          id: item._id
        })
      })
    }).catch(err => {
      console.log(err + '获取镜头列表错误')
    })
  },
  methods: {
    ...mapActions([ 'postAddDevInfoLog', 'getDevInfoLog', 'deleteDevInfoLog', 'updateDevInfoLog', 'getDeviceList']),
    pageSizeChange() {
      this.getDevLogList()
    },
    pageChange() {
      this.getDevLogList()
    },
    getDevLogList() {
      const body = {
        seek: this.username,
        time: this.$moment(this.date).valueOf(),
        page: this.startNum,
        limit: this.pageLimit
      }
      this.getDevInfoLog(body).then(res => {
        console.log(res, '54545')
        if (res.data[0]) {
          this.devLogList = res.data
          this.devLogList.forEach((item, index) => {
            item.date = this.$moment(item.time).format('YYYY-MM-DD')
            item.number = item.devList.length
            item.contact = item.contact ? '是' : '否'
          })
        }
        this.inPageNum = res.data.length
      }).catch((err) => {
        console.log(err + '获取录像拷贝日志列表失败')
      })
    },
    addEquipment() {
      this.addModal = true
      this.isAdd = true
    },
    addModalList() {
      if (this.formValidate.facility !== '') {
        console.log(this.formValidate.facility, '33333')
        this.modalList.push({
          device: this.facilityList[this.formValidate.facility].label,
          info: this.formValidate.issue,
          id: this.facilityList[this.formValidate.facility].id
        })
      } else {
        this.warningMsg('请选择录像镜头')
      }
    },
    deleteDevList(index) {
      this.modalList.splice(index, 1)
    },
    cancel() {
      this.modalList = []
      this.$refs['formValidate'].resetFields()
      this.addModal = false
    },
    confirm() {
      let devList = []
      console.log(this.modalList, '65666666')
      this.modalList.forEach((item, index) => {
        devList.push({
          device: item.id,
          info: item.info
        })
      })
      const body = {
        checkName: this.formValidate.userName,
        time: this.$moment(this.formValidate.patrolTime).valueOf(),
        contact: this.formValidate.animal === '是',
        contactTime: this.$moment(this.formValidate.contactTime).valueOf(),
        engineerName: this.formValidate.name,
        phone: this.formValidate.contact,
        devList: devList
      }
      if (this.isAdd) {
        this.postAddDevInfoLog(body).then(res => {
          this.cancel()
          this.successMsg('添加成功')
          this.getDevLogList()
        }).catch(err => {
          console.log(err + '添加失败')
          this.warningMsg('添加失败')
        })
      } else {
        this.updateDevInfoLog({id: this.selectItem[0]._id, content: body}).then(() => {
          this.cancel()
          this.successMsg('修改成功')
          this.getDevLogList()
        }).catch(err => {
          console.log(err + '修改失败')
          this.warningMsg('修改失败')
        })
      }
    },
    show(val) {
      this.detailsModal = true
    },
    detailsConfirm() {
      this.detailsModal = false
    },
    search() {
      this.getDevLogList()
    },
    updateEquipment() {
      if (this.selectedIndex.length !== 1) {
        this.$Modal.confirm({
          title: '提示',
          content: '一次只能修改一个！'
        })
      } else {
        this.addModal = true
        this.isAdd = false
        console.log(this.selectItem[0], '555555')
        this.formValidate.userName = this.selectItem[0].checkName
        this.formValidate.patrolTime = this.$moment(this.selectItem[0].time).format('YYYY-MM-DD')
        this.formValidate.contactTime = this.$moment(this.selectItem[0].contactTime).format('YYYY-MM-DD')
        this.formValidate.name = this.selectItem[0].engineerName
        this.formValidate.animal = this.selectItem[0].contact
        this.formValidate.contact = this.selectItem[0].phone
        this.selectItem[0].devList.forEach((item, index) => {
          this.modalList.push({
            device: item.device.name,
            info: item.info,
            id: item.device._id
          })
        })
      }
    },
    deleteEquip() {
      if (this.selectedIndex.length === 0) {
        this.warningMsg('请选择需要删除的记录')
        return
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选维修单位吗？</p>',
        onOk: () => {
          this.equipDelete()
        },
        onCancel: () => {}
      })
    },
    equipDelete() {
      console.log(this.selectedIndex)
      this.deleteDevInfoLog(this.selectedIndex)
        .then(() => {
          this.isChecked = false
          this.getDevLogList()
          this.successMsg('删除成功')
        })
        .catch(() => {
          this.errorMsg('删除失败')
        })
    },
    selectServeRow(sel) {
      this.selectedIndex = []
      if (sel.length === 0) {
        this.isChecked = true
      } else {
        this.isChecked = false
      }
      sel.forEach((v, n) => {
        this.selectedIndex.push(v._id)
      })
      this.selectItem = sel
    },
    details(val) {
      this.detailsModal = true
      this.formDetails = {
        patrolTime: this.$moment(val.time).format('YYYY-MM-DD'),
        userName: val.checkName,
        animal: val.contact,
        contactTime: this.$moment(val.contactTime).format('YYYY-MM-DD'),
        name: val.engineerName,
        contact: val.phone
      }
      val.devList.forEach((item, index) => {
        this.modalList2.push({
          device: item.device.name,
          info: item.info,
          id: item.device._id
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
    .equipment-copy{
        width: 100%;
        height: 100%;
        position: relative;
        .equipment-head{
            width: 100%;
            padding: 12px 24px;
            .row{
                display: inline-block;
                margin-right: 8px;
            }
            button{
                margin-right: 8px;
            }
        }
        .table{
            width: 100%;
            position: relative;
            .table-box{
                position: absolute;
                width: 100%;
            }
        }
        .foot-page{
            width: 100%;
            border-top: none;
            padding: 3px 24px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #244575;
        }
        .rt{
            float: right;
        }
    }
</style>
