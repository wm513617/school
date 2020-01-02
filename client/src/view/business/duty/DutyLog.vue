<template>
  <div class="dutylog" id="dutylog">
    <div class="tab-content-alarm" style="text-align:center;width:100%;font-size:12px;height:100%;" ref="tableBox">
      <div class="feature-btn">
        <div style="float:right;margin-right:24px;">
        <Input v-model="inSearchName" placeholder="请输入值班人或事件名称" style="width: 200px;" />
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="startTime" :editable="false" :clearable="false"></DatePicker>
        <b>至</b>
        <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="endTime" :editable="false" :clearable="false"></DatePicker>
        <Button type="ghost" icon="search" @click="search" style="margin-left:24px;">搜索</Button>
        </div>
        <Button type="ghost" icon="plus" @click="openAddMod('新建事件')">新建</Button>
        <Button type="ghost" icon="edit" :disabled="cantClick" @click="openEditMod('修改事件')">修改</Button>
        <Button type="ghost" icon="trash-a" :disabled="cantClick" @click="delAlarm">删除</Button>
        <Button type="ghost" icon="refresh" @click="freshData">刷新</Button>
      </div>
      <div class="table-relative flex-1" style="margin-top:12px;">
        <div class="table-body">
          <Table size="small" :columns="dutyLogTitle" :data="dutyLogTableData" :height="tableHeight" @on-selection-change="dutyLogInSel"></Table>
        </div>
      </div>
      <div class="table-footer" style="text-align:right;">
        <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
      </div>
    </div>
    <!--处理 模态框-->
    <div v-if="editModal">
      <Modal v-model="editModal" :title="modalTitle" :mask-closable="false">
        <Form label-position="left" :label-width="100" :model="editDutyLogData" ref="editDutyLogData" :rules="logRule" style="padding: 0 20px;">
          <Form-item label="事件名称" prop="name">
            <Input v-model="editDutyLogData.name" :disabled="showInput" />
          </Form-item>
          <Form-item label="时间" prop="time">
            <DatePicker type="datetime" :disabled="showInput" style="width: 335px" :options="dateLimit" v-model="editDutyLogData.time" :editable="false" :clearable="false"></DatePicker>
          </Form-item>
          <Form-item label="值班人" prop="staffPerson">
            <Select v-model="editDutyLogData.staff._id" :disabled="showInput" filterable>
              <Option v-for="item in todyDutyPersonList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="职务" v-if="showInput">
            <Input v-model="editDutyLogData.staff.title" :disabled="showInput" />
          </Form-item>
          <Form-item label="班组" v-if="showInput">
            <Input v-model="editDutyLogData.staff.groupName" :disabled="showInput" />
          </Form-item>
          <Form-item label="联系方式" v-if="showInput">
            <Input v-model="editDutyLogData.staff.phone" :disabled="showInput" />
          </Form-item>
          <Form-item label="事件描述" prop="detail">
            <Input type="textarea" v-model="editDutyLogData.detail"  placeholder="请输入事件描述" :disabled="showInput" />
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel" v-if="!showInput">取消</Button>
          <Button type="primary" @click="save('editDutyLogData')" v-if="!showInput" style="margin-left: 16px;">确定</Button>
          <Button type="ghost" @click="cancel" v-if="showInput">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  data() {
    const nameRule = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        return callback(new Error('不能为空'))
      } else if (/^\s+$/g.test(value)) {
        return callback(new Error('请勿输入空格'))
      } else {
        var nativecode = value.split('')
        var len = 0
        for (var i = 0; i < nativecode.length; i++) {
          var code = Number(nativecode[i].charCodeAt(0))
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
    }
    const contEmptyRule = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        return callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const personRule = (rule, value, callback) => {
      if (this.editDutyLogData.staff._id === '' || this.editDutyLogData.staff._id === undefined) {
        return callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    return {
      cantClick: true,
      tableHeight: 500,
      logRule: {
        name: [{ required: true, validator: nameRule, trigger: 'blur' }],
        time: [{ required: true, validator: contEmptyRule, trigger: 'change' }],
        detail: [{ max: 200, message: '最多 200 字符！', trigger: 'blur' }],
        staffPerson: [{ required: true, validator: personRule, trigger: 'change' }]
      },
      inSearchName: '',
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      startTime: '',
      endTime: new Date(),
      dutyLogTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          type: 'index',
          title: '序号'
        },
        {
          title: '事件名称',
          key: 'name',
          align: 'center',
          minWidth: 150
          // width: 150
        },
        {
          title: '时间',
          key: 'time',
          minWidth: 150,
          // width: 150,
          align: 'center',
          render: (h, params) => {
            var text = params.row.time
              ? this.$moment(parseInt(params.row.time) * 1000).format('YYYY-MM-DD HH:mm:ss')
              : ''
            return h('span', text)
          }
        },
        {
          title: '值班人',
          key: 'name',
          minWidth: 150,
          // width: 150,
          align: 'center',
          render: (h, params) => {
            var text = params.row.staff.name ? params.row.staff.name : ''
            return h('span', text)
          }
        },
        {
          title: '联系方式',
          key: 'phone',
          minWidth: 150,
          // width: 150,
          align: 'center',
          render: (h, params) => {
            var text = params.row.staff.phone ? params.row.staff.phone : ''
            return h('span', text)
          }
        },
        {
          title: '事件描述',
          key: 'detail',
          minWidth: 250,
          // width: 250,
          align: 'center',
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
                  title: params.row.detail
                }
              },
              params.row.detail
            )
          }
        },
        {
          title: '详情',
          key: 'config',
          minWidth: 250,
          // width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.showmessage(params.index, params.row, '详情')
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      dutyLogTableData: [],
      Inselect: [],
      showInput: false,
      editModal: false,
      editDutyLogData: {
        name: '',
        time: new Date(),
        detail: '',
        staff: {
          _id: '', // 值班人id
          title: '',
          phone: '',
          groupName: ''
        }
      },
      modalTitle: '',
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      }
    }
  },
  computed: {
    ...mapState({
      dutyLogData: ({ dutyLog }) => dutyLog.dutyLogData
    }),
    ...mapGetters(['todyDutyPersonList'])
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 120
  },
  methods: {
    ...mapActions(['getDutyLog', 'addDutyLog', 'editDutyLog', 'getDutyPerson', 'delDutyLog', 'recordLog']),
    getDutyLogData() {
      this.Inselect.length = 0
      if (this.startTime !== '' && this.endTime !== '') {
        var startTimeData = Date.parse(new Date(this.startTime)) / 1000
        var endTimeData = Date.parse(new Date(this.endTime)) / 1000
        if (startTimeData === endTimeData) {
          this.errorMsg('开始时间与结束时间不能相等')
        } else if (startTimeData >= endTimeData) {
          this.errorMsg('开始时间不能大于结束时间')
        }
      } else if (this.endTime === '') {
        this.errorMsg('结束时间不能为空')
        return
      } else {
        startTimeData = ''
        endTimeData = Date.parse(new Date()) / 1000
      }
      this.getDutyLog({
        name: this.inSearchName,
        startTime: startTimeData,
        endTime: endTimeData,
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit
      })
        .then(res => {
          this.dutyLogTableData = this.dutyLogData
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          this.Inselect.length = 0
          this.cantClick = true
        })
        .catch(err => {
          console.log(err, '获取失败')
        })
    },
    search() {
      this.getDutyLogData()
    },
    freshData() {
      this.inSearchName = ''
      this.startTime = ''
      this.endTime = new Date()
      this.Inselect = []
      this.cantClick = true
      this.getDutyLogData()
      this.successMsg('刷新成功')
    },
    dutyLogInSel(select) {
      this.Inselect = select
      if (select.length === 0) {
        this.cantClick = true
      } else {
        this.cantClick = false
      }
    },
    pageChange(n) {
      this.pageInfo.cur = n
      this.getDutyLogData()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getDutyLogData()
    },
    openAddMod() {
      this.modalTitle = '新建事件'
      this.editDutyLogData = {
        name: '',
        time: new Date(),
        detail: '',
        staff: {
          _id: this.todyDutyPersonList.length === 0 ? '' : this.todyDutyPersonList[0].value,
          title: '',
          phone: '',
          groupName: ''
        }
      }
      this.editModal = true
    },
    openEditMod() {
      if (this.Inselect.length === 1) {
        this.modalTitle = '修改事件'
        this.editDutyLogData = {
          _id: this.Inselect[0]._id,
          name: this.Inselect[0].name,
          time: this.$moment(parseInt(this.Inselect[0].time) * 1000).format('YYYY-MM-DD HH:mm:ss'),
          detail: this.Inselect[0].detail,
          staff: {
            _id: this.Inselect[0].staff._id
          }
        }
        this.editModal = true
      } else {
        this.warningMsg('请选择一项')
      }
    },
    save(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.modalTitle === '新建事件') {
            this.editDutyLogData.time = Date.parse(new Date(this.editDutyLogData.time)) / 1000

            const paramsLog = {
              logType: '操作日志',
              module: '业务管理',
              operateName: '添加值班日志',
              operateContent: '添加值班日志',
              target: this.editDutyLogData.name
            }
            this.recordLog(paramsLog)
            this.addDutyLog(this.editDutyLogData)
              .then(() => {
                this.getDutyLogData()
                this.editModal = false
              })
              .catch(err => {
                console.log(err, '新建失败')
              })
          } else if (this.modalTitle === '修改事件') {
            this.editDutyLogData.time = Date.parse(new Date(this.editDutyLogData.time)) / 1000

            const paramsLog = {
              logType: '操作日志',
              module: '业务管理',
              operateName: '修改值班日志',
              operateContent: '修改值班日志',
              target: this.editDutyLogData.name
            }
            this.recordLog(paramsLog)
            this.editDutyLog(this.editDutyLogData)
              .then(() => {
                this.getDutyLogData()
                this.editModal = false
                this.Inselect.length = 0
              })
              .catch(err => {
                console.log(err, '新建失败')
              })
          }
          this.editModal = false
        }
      })
    },
    delAlarm() {
      if (this.Inselect.length !== 0) {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确认删除吗?</p>',
          loading: true,
          onOk: () => {
            this.sureDel()
            setTimeout(() => {
              this.$Modal.remove()
            }, 0)
          }
        })
      } else {
        this.warningMsg('请至少选择一项')
      }
    },
    sureDel() {
      var allId = []
      this.Inselect.map(v => {
        allId.push(v._id)
      })
      allId = allId.join(',')

      const paramsLog = {
        logType: '操作日志',
        module: '业务管理',
        operateName: '删除值班日志',
        operateContent: '删除值班日志',
        target: this.Inselect.map(item => item.name).join(' ')
      }
      this.recordLog(paramsLog)

      this.delDutyLog(allId)
        .then(() => {
          this.getDutyLogData()
          this.Inselect.length = 0
        })
        .catch(err => {
          this.errorMsg(err)
        })
    },
    showmessage(index, rowdata) {
      this.modalTitle = '事件详情'
      this.editDutyLogData = {
        name: rowdata.name,
        time: this.$moment(parseInt(rowdata.time) * 1000).format('YYYY-MM-DD HH:mm:ss'),
        detail: rowdata.detail,
        staff: {
          _id: rowdata.staff._id,
          title: rowdata.staff.title,
          phone: rowdata.staff.phone,
          groupName: rowdata.staff.groupName
        }
      }
      this.editModal = true
    },
    cancel() {
      this.editModal = false
    }
  },
  watch: {
    modalTitle(newvalue, oldvalue) {
      if (newvalue === '事件详情') {
        this.showInput = true
      } else {
        this.showInput = false
      }
    }
  },
  created() {
    if (this.$route.query.startTime) {
      this.startTime = new Date(decodeURIComponent(this.$route.query.startTime))
    }
    if (this.$route.query.endTime) {
      this.endTime = new Date(decodeURIComponent(this.$route.query.endTime))
    }
    this.getDutyLogData()
    this.getDutyPerson()
  }
}
</script>

<style scoped>
.dutylog {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
}
.tab-content-alarm {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}
.feature-btn {
  width: 100%;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  margin: 12px 0 0 24px;
  text-align: left;
}

.feature-btn > button {
  margin-right: 15px;
  width: 100px;
}
.table-relative {
  position: relative;
  /* height: 650px; */
  margin: 0px;
  width: 100%;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
