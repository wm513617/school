<template>
  <div class="emergencyCommon">
    <div class="common-main">
      <div class="main-header">
        <div class="header-left">
          <Button type="ghost" @click="openAddMod('新建预案')" :disabled="isAdd">添加</Button>
          <Button type="ghost" @click="closeAddModal" :disabled="isRemove">删除</Button>
        </div>
        <div class="header-right">
          <Input placeholder="请输入..." style="width: 240px;border-radius: 4px;" v-model="searchKey" @on-change='searchChange'>
            <Button v-show="!isClose" slot="append" icon="ios-search"  @click="searchEmergency"></Button>
            <Button v-show="isClose" slot="append" icon="close-round" @click="clearEmergency"></Button>
          </Input>
        </div>
      </div>
      <div class="main-table" ref="tableBox" v-resize="resizeFun">
        <div class="main-table-content">
          <Table size="small" highlight-row :height="tableHeight" :columns="tableColumns" :data="dataList" @on-row-click="selelctRow" @on-selection-change="selectRow" :row-class-name="rowClassName"></Table>
        </div>
      </div>
      <div class="main-footer">
        <div style="float: right;">
          <Page show-sizer :page-size-opts="$PageInfo.size" :show-total="true"  :show-elevator="true" :page-size="pageLimit" :total="pageInfo.count" :current="pageCur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
    </div>
    <div class="emergencyPhoto">
      <h5>预案缩略图</h5>
      <div style="height:240px;margin: 10px auto 10px;border:1px dotted #fff">
        <img v-show="formData.planPhoto" :src="formData.planPhoto" style="width:100%;height:100%" />
      </div>
    </div>
    <!-- 添加按钮弹框 -->
    <Modal :mask-closable="false" v-model="isAddModal" :title="modalTitle" width="480" @on-cancel="orgCancel('orgFormData')">
      <div class="org-modal-form">
        <Form :model="orgFormData" label-position="left" :label-width="100" ref="orgFormData" :rules="orgFormRole">
          <Form-item label="预案类型">
            {{ alarmName }}
          </Form-item>
          <Form-item label="预案名称" prop="name">
            <Input v-model="orgFormData.name"/>
          </Form-item>
          <Form-item label="预案图片" prop="photoName">
            <Upload ref="upload" action="/api/upload/file?type=image" name="file" :format="['jpg','png','bmp','jpeg']" :on-exceeded-size="exceededSize"   :on-success="uploadLaneSuc" :on-format-error="laneFormatError" :show-upload-list="false">
              <Input :readonly='true' v-model="orgFormData.photoName" placeholder="选择文件" style="width: 306px">
                <Button slot="append" icon="ios-cloud-upload-outline">浏览</Button>
              </Input>
            </Upload>
            <p>600px*600px，支持jpeg和png格式</p>
          </Form-item>
          <div  :key="index" v-for="(item, index) in orgFormData.group">
            <Form-item label="执行人" :prop="'group.'+ index + '.name'"  :rules="{max: 64,message: '不能超过64位字符', trigger: 'change'}">
              <Row>
                <Col span="18">
                    <Input v-model="item.name"/>
                </Col>
                <Col span="3" v-show="item.index">
                    <Button type="dashed" @click="handleAdd(item.name)" icon="plus-round"></Button>
                </Col>
                <Col span="3">
                    <Button type="ghost" @click="handleRemove(item.name)" icon="close-round"></Button>
                </Col>
              </Row>
            </Form-item>
            <Form-item label="电话" :prop="'group.'+ index + '.phone'" :rules="{pattern:/^((1[34578]\d{9})|(0\d{2,3}-?\d{7,8}))$/,message: '请输入正确的电话格式', trigger: 'change'}">
              <Row>
                <Col span="18">
                    <Input v-model="item.phone"/>
                </Col>
              </Row>
            </Form-item>
          </div>
          <Form-item label="备注信息" prop="remark">
            <Input v-model="orgFormData.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入..." />
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="orgCancel('orgFormData')">取消</Button>
        <Button type="primary" @click="orgSave('orgFormData')">确认</Button>
      </div>
    </Modal>
    <!-- 详情按钮弹框 -->
    <Modal :mask-closable="false" v-model="isDetailsModal" title="预案详情" width="900">
      <div class="detailsModal">
        <div class="details-left">
          <img :src="formData.planPhoto" v-show="formData.planPhoto" style="width:100%;">
        </div>
        <div class="details-right">
          <Form>
            <Form-item label="预案类型">
              {{ alarmName }}
            </Form-item>
            <Form-item label="预案名称">
              {{detailsData.name}}
            </Form-item>
            <div :key="index" v-for="(item, index) in detailsData.group">
              <Form-item label="执行人">
                <span style="word-break: break-all;">{{item.name}}</span>
                <span>{{item.phone}}</span>
              </Form-item>
            </div>
            <Form-item label="备注">
              <Input readonly v-model="detailsData.remark" type="textarea" :rows="3" :autosize="{minRows: 5, maxRows: 8}" placeholder="请输入文本信息。。。"/>
            </Form-item>
          </Form>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  props: {
    plan: {
      type: String
    },
    isShow: {
      type: Boolean
    }
  },
  components: {
  },
  data() {
    // 64位字符
    const verifyName = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 64) {
        return callback(new Error('不能超过64位字符'))
      } else {
        callback()
      }
    }
    // 200位字符
    const verifyRemark = (rule, value, callback) => {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 200) {
        return callback(new Error('不能超过200位字符'))
      } else {
        callback()
      }
      // if (value === '' || value === undefined || value === null) {
      //   callback()
      // }
      // const r = /^([\u4e00-\u9fa5]|[0-9]|[,]|[，]|[。]|[.]|[“]|[”]){0,200}$/
      // if (!r.test(value)) {
      //   callback(new Error('请输入200位以内的数字、字母或汉字!'))
      // } else {
      //   callback()
      // }
    }
    return {
      personnel: [],
      index: 0,
      planList: [3, 4, 6, 7, 9, 10, 11, 13, 15, 17, 18, 20],
      isAdd: true,
      alarmName: '',
      commonList: [],
      searchKey: '',
      pageLimit: this.$PageInfo.limit,
      pageCur: 1,
      isRemove: true,
      rowId: '',
      selectRecord: [],
      planId: '',
      isDetailsModal: false,
      modalTitle: '',
      dataList: [],
      isClose: false,
      formData: {
        planPhoto: ''
      },
      detailsData: {
        group: [{
          name: '',
          phone: '',
          position: ''
        }],
        planPhoto: '',
        remark: '',
        name: ''
      },
      orgFormData: {
        group: [{
          name: '',
          phone: '',
          position: ''
        }],
        plan: '普通报警',
        planId: '',
        planPhoto: '',
        remark: '',
        photoName: '',
        name: ''
      },
      isAddModal: false,
      tableHeight: 0,
      tableColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 70,
          align: 'center',
          ellipsis: true
        },
        {
          key: 'name',
          title: '预案名称',
          width: 260,
          align: 'center',
          ellipsis: true
        },
        {
          title: '执行人',
          ellipsis: true,
          width: 120,
          render: (h, params) => {
            let str = []
            params.row.group.map(item => {
              str.push(item.name)
            })
            return h('span', str.toString())
          }
        },
        {
          key: 'remark',
          title: '备注',
          align: 'center',
          ellipsis: true
        },
        {
          type: 'action',
          title: '操作',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.reviseAddModal(params.row)
                    }
                  }
                },
                '修改'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.infoAddModal(params.row)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      orgFormRole: {
        name: [
          { required: true, message: '预案名称不能为空', trigger: 'change' },
          { validator: this.$bsValidate.validateStr64, trigger: 'change' },
          { required: true, validator: verifyName, trigger: 'change' }
        ],
        photoName: [{ required: true, message: '请上传预案图片', trigger: 'change' }],
        remark: [{ validator: verifyRemark, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapState({
      pageInfo: ({ emergencyMan }) => emergencyMan.pageInfo
    }),
    ...mapGetters(['emergencyData'])
  },
  watch: {
    'commonList': {
      handler(newDataList) {
        this.dataList = newDataList
        // this.formData.planPhoto = ''
      }
    },
    'plan': {
      handler(newplan) {
        let planNmber = this.planList.findIndex((value, index) => {
          return value === Number(newplan)
        })
        if (planNmber === -1) {
          this.isAdd = true
        } else {
          this.isAdd = false
        }
        this.planId = newplan
      }
    },
    isShow() {
      this.pageCur = 1
      this.openMenuname()
    }
  },
  methods: {
    ...mapActions(['emergencyAction', 'addOneEmPlan', 'setEmergency', 'deleteplan']),
    openMenuname() {
      this.emergencyAction({
        planId: this.plan,
        key: this.searchKey ? this.searchKey : '',
        page: this.pageCur,
        limit: this.pageLimit
      }).then(() => {
        this.commonList = this.emergencyData
        if (this.commonList.length > 0) {
          this.formData.planPhoto = this.commonList[0].planPhoto
        } else {
          this.formData.planPhoto = ''
        }
        this.rowClassName = this.rowClassStyle
        this.plan = this.plan
        switch (Number(this.plan)) {
          case 3:
            this.alarmName = '普通报警预案'
            break
          case 4:
            this.alarmName = '普通报警预案'
            break
          case 6:
            this.alarmName = '视频报警预案'
            break
          case 7:
            this.alarmName = '视频报警预案'
            break
          case 9:
            this.alarmName = '智能报警预案'
            break
          case 10:
            this.alarmName = '智能报警预案'
            break
          case 11:
            this.alarmName = '智能报警预案'
            break
          case 13:
            this.alarmName = '消防报警预案'
            break
          case 15:
            this.alarmName = '报警求助预案'
            break
          case 17:
            this.alarmName = '单兵报警预案'
            break
          case 18:
            this.alarmName = '单兵报警预案'
            break
          case 20:
            this.alarmName = '手工报警预案'
            break
        }
      }).catch(err => {
        console.log(err, '获取失败')
      })
    },
    // 默认第一行样式
    rowClassName() {},
    rowClassStyle(row, index) {
      if (index === 0) {
        return 'ivu-table-row-highlight'
      }
      return ''
    },
    // 点击分页
    pageChange(n) {
      this.pageCur = n
      this.openMenuname()
    },
    pageSizeChange(n) {
      this.pageLimit = n
      this.openMenuname()
    },
    /**
     * 点击一行显示预案内容
     * @method selelctRow
     * @param {Array} row 单行信息
     */
    selelctRow(row) {
      const rowData = JSON.parse(JSON.stringify(row))
      this.formData.planPhoto = rowData.planPhoto
      this.rowClassName = function() {}
    },
    /**
     * 搜索框内容改变
     * @method searchChange
     */
    searchChange() {
      this.isClose = false
      this.searchString = ''
    },
    /**
     * 上传成功
     * @method uploadLaneSuc
     */
    uploadLaneSuc(res, file, filelist) {
      this.orgFormData.planPhoto = res.path
      this.orgFormData.photoName = file.name
    },
    laneFormatError(file) {
      this.warningMsg('图片 ' + file.name + ' 格式不正确，请上传 jpg, png, bmp 或 jpeg 格式的图片。')
    },
    exceededSize(file) {
      this.warningMsg('图片 ' + file.name + ' 大小超过限制，请上传小于20M的图片。')
    },
    /**
     * 搜索按钮
     * @method searchEmergency
     */
    searchEmergency() {
      this.openMenuname()
      this.isClose = true
    },
    clearEmergency() {
      this.isClose = false
      this.searchKey = ''
      this.openMenuname()
    },
    /**
     * 添加按钮
     * @method openAddMod
     */
    openAddMod(title) {
      this.modalTitle = title
      this.orgFormData = {
        group: [{
          name: '',
          phone: '',
          position: '',
          index: true
        }],
        plan: this.alarmName,
        planPhoto: '',
        remark: '',
        photoName: '',
        planId: this.planId
      }
      this.isAddModal = true
    },
    /**
     * 执行人添加
     * @method handleAdd
     */
    handleAdd(val) {
      if (!val) {
        this.$Notice.error({
          title: '执行人不能为空'
        })
        return
      } else {
        this.orgFormData.group.push({
          name: '',
          phone: '',
          position: '',
          index: true
        })
      }
      for (let i = 0; i < this.orgFormData.group.length; i < i++) {
        if (this.orgFormData.group[i].name !== '') {
          this.orgFormData.group[i].index = false
        }
        if (this.orgFormData.group.length > 4) {
          this.orgFormData.group[i].index = false
        }
      }
    },
    // 删除弹窗多余的管理人员
    handleRemove(val) {
      const number = this.orgFormData.group.length - 1
      for (let i = 0; i < this.orgFormData.group.length; i < i++) {
        if (this.orgFormData.group[i].name === val) {
          if (this.orgFormData.group.length > 1) {
            this.orgFormData.group.splice(i, 1)
          }
        }
      }
      if (number < 5 && number > 1) {
        this.orgFormData.group[number - 1].index = true
      } else if (number === 1) {
        this.orgFormData.group[0].index = true
      }
    },
    /**
     * 修改按钮
     * @method reviseAddModal
     */
    reviseAddModal(val) {
      this.modalTitle = '修改预案'
      this.isAddModal = true
      if (val) {
        this.rowId = val._id
        this.orgFormData = {
          group: val.group,
          plan: val.plan,
          planId: val.planId,
          planPhoto: val.planPhoto,
          remark: val.remark,
          photoName: val.photoName,
          name: val.name
        }
        this.alarmName = this.orgFormData.plan
      }
    },
    /**
     * 删除按钮
     * @method closeAddModal
     */
    closeAddModal() {
      this.$Modal.confirm({
        title: '删除确认',
        content: '确认删除预案吗？',
        onOk: () => {
          this.deleteplan(this.checkAll).then(() => {
            this.emergencyAction({planId: this.planId}).then(() => {
              this.openMenuname()
              this.$Notice.success({
                title: '预案删除成功'
              })
              this.isRemove = true
            })
          })
        }
      })
    },
    /**
     * 复选变化
     * @method selectRow
     */
    selectRow(rows) {
      this.checkAll = []
      for (let item of rows) {
        this.checkAll.push(item._id)
      }
      if (this.checkAll.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
    },
    /**
     * 详情按钮
     * @method infoAddModal
     */
    infoAddModal(val) {
      if (val) {
        this.detailsData = {
          group: val.group,
          plan: val.plan,
          planId: val.planId,
          planPhoto: val.planPhoto,
          remark: val.remark,
          photoName: val.photoName,
          name: val.name
        }
        this.alarmName = this.detailsData.plan
      }
      this.isDetailsModal = true
    },
    /**
     * 取消按钮
     * @method orgCancel
     */
    orgCancel(name) {
      this.isAddModal = false
      this.$refs[name].resetFields()
      this.openMenuname()
    },
    /**
     * 确认按钮
     * @method orgSave
     */
    orgSave(name) {
      const group = JSON.parse(JSON.stringify(this.orgFormData.group))
      this.$refs[name].validate(valid => {
        const groupName = []
        if (valid) {
          group.map(item => {
            groupName.push(item.name)
          })
          const groupNewName = [...new Set(groupName)]
          if (groupName.length !== groupNewName.length) {
            this.$Notice.error({
              title: '预案执行人员不能重复'
            })
            return
          }
          if (this.orgFormData.group.length > 5) {
            this.$Notice.error({
              title: '预案执行人员不能超过五个'
            })
            return
          }
          if (this.modalTitle === '新建预案') {
            this.addOneEmPlan(this.orgFormData).then(() => {
              this.openMenuname()
              this.isAddModal = false
              this.$refs[name].resetFields()
              this.$Notice.success({
                title: '预案添加成功'
              })
            }).catch(err => {
              this.$Notice.error({
                title: err
              })
              console.log(err, '新建失败')
            })
          } else if (this.modalTitle === '修改预案') {
            this.setEmergency({id: this.rowId, body: this.orgFormData}).then(() => {
              this.openMenuname()
              this.isAddModal = false
              this.$refs[name].resetFields()
              this.$Notice.success({
                title: '预案修改成功'
              })
            }).catch(err => {
              this.$Notice.error({
                title: err
              })
              console.log(err, '修改失败')
            })
          } else {
            this.isAddModal = false
          }
        }
      })
    },
    /**
     * 表格高度调节
     * @method resizeFun
     */
    resizeFun() {
      this.tableHeight = this.$refs['tableBox'].offsetHeight
    }
  },
  created() {
    this.openMenuname()
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
  }
}
</script>
<style lang="less" scoped>
.emergencyCommon {
  height: 100%;
  display: flex;
  justify-content: space-between;
  .common-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    background: #1c3053;
    height: 100%;
    width: 80%;
    .main-header {
      background: #1b3153;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
    }
    .main-table {
      flex: 1;
      display: flex;
      .main-table-content {
        width: calc(~'80% - 230px');
        background: #1c3053;
        display: flex;
        flex-direction: column;
        position: absolute;
      }
    }
    .main-footer {
      padding: 3px 10px;
      background-color: #244575;
      border: none;
      height: 40px;
    }
  }
  .emergencyPhoto {
    padding: 55px 20px;
    width: 20%;
    background: #1c3053;
    h5 {
      background: #244575;
      text-align: center;
      height: 32px;
      line-height: 32px;
      font-size: 12px;
    }
  }
}
.detailsModal {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 460px;
  .details-left {
    width: 60%;
  }
  .details-right {
    width: 40%;
    margin-left: 20px;
    padding: 12px 24px;
    overflow: auto;
    span {
      margin: 0 18px 0 12px;
    }
  }
}
</style>
