<template>
  <div class="bs-content manage">
    <div class="bs-left">
      <div class="sidebar">
        <ul class="config-list">
          <li style="list-style:none;" v-show="$BShasPower(config.vIf)" v-for="(config,index) in sideBarList" :key="index" :class="{active: config.isActive}" @click="sideBarActive(config)">
            {{config.name}}
          </li>
        </ul>
      </div>
    </div>
    <div class="bs-mains">
      <div class="haha" v-if="sideBarList[0].isActive" style="text-align:center;width:100%;font-size:12px;height:100%;">
        <div class="feature-btn">
          <Button type="ghost" icon="plus" @click="openAddMod('新建事件')" v-if="$BShasPower('BS-BUSINESS-RECEIVE-CONFG')">新建</Button>
          <Button type="ghost" icon="edit" @click="openEditMod('修改事件')" :disabled="cantClick" v-if="$BShasPower('BS-BUSINESS-RECEIVE-CONFG')">修改</Button>
          <Button type="ghost" icon="trash-a" @click="delAlarm" :disabled="cantClick" v-if="$BShasPower('BS-BUSINESS-RECEIVE-CONFG')">删除</Button>
          <Button type="ghost" icon="refresh" @click="freshData" v-if="$BShasPower('BS-BUSINESS-RECEIVE-CONFG')">刷新</Button>
          <div style="text-align:right;">
            <Input v-model="inSearchName" placeholder="请输入报警人、事件名称" style="width: 200px;" />
            <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="startTime" :editable="false" :clearable="false"></DatePicker>
            <b>至</b>
            <DatePicker type="datetime" style="width: 200px" :options="dateLimit" v-model="endTime" :editable="false" :clearable="false"></DatePicker>
            <Button type="ghost" icon="ios-search" @click="search" style="margin-left:24px;">搜索</Button>
          </div>
        </div>
        <div class="table-relative flex-1" style="margin-top:12px;" ref="tableBox">
          <div class="table-body">
            <Table size="small" :columns="receiveTitle" :data="receiveData" :height="tableHeight" @on-selection-change="receiveInSel"></Table>
          </div>
        </div>
        <div class="table-footer" style="text-align:right;">
          <Page show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
      <hostory v-if="sideBarList[1].isActive"></hostory>
    </div>
    <!--添加、修改、详情 模态框-->
    <div v-if="openModal">
      <Modal v-model="openModal" :title="modalTitle" :mask-closable="false" width='550'>
        <Form label-position="left" :label-width="80" :model="modalData" ref="modalData" :rules="receiveRule" style="padding: 0 20px;">
          <Form-item label="事件编号" v-if="modalTitle==='修改事件'|| showInput" :class="{'showInputStyle':showInput}">
            <Input v-model="modalData.eventCode" disabled/>
          </Form-item>
          <Form-item label="事件名称" prop="eventName" :class="{'showInputStyle':showInput}">
            <Input v-model="modalData.eventName" :disabled="showInput" />
          </Form-item>
          <Form-item label="报警人" prop="person" :class="{'showInputStyle':showInput}">
            <Input v-model="modalData.person" :disabled="showInput" />
          </Form-item>
          <Form-item label="联系方式" prop="phone" :class="{'showInputStyle':showInput}">
            <Input v-model="modalData.phone" :disabled="showInput" />
          </Form-item>
          <Form-item label="报警时间" :class="{'showInputStyle':showInput}">
            <DatePicker type="datetime" :disabled="showInput" :options="dateLimit" v-model="modalData.alarmTimeyms" :editable="false" :clearable="false"></DatePicker>
          </Form-item>
          <Form-item label="事件来源" prop="source" :class="{'showInputStyle':showInput}">
            <Select v-model="modalData.source" :disabled="showInput">
              <Option v-for="item in originList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
          <Form-item label="记录人" prop="recordPerson" :class="{'showInputStyle':showInput}">
            <Input v-model="modalData.recordPerson" :disabled="showInput" />
          </Form-item>
          <Form-item label="联系方式" prop="recordPhone" :class="{'showInputStyle':showInput}">
            <Input v-model="modalData.recordPhone" :disabled="showInput" />
          </Form-item>
          <Form-item label="事件描述" prop="description">
            <Input type="textarea" v-model="modalData.description" placeholder="请输入事件描述" :disabled="showInput" />
          </Form-item>
          <Form-item label="当前状态" v-if="showInput">
            <Input v-model="modalData.states" :disabled="showInput" />
          </Form-item>
          <div v-if="showInput">
            <p>解决记录</p>
            <div style="width: 100%;height: 50px;text-align:center;line-height:50px" v-if="modalData.detail && modalData.detail.length===0">暂无记录</div>
            <Timeline class="businessTimelineStyle">
              <TimelineItem v-for="(item,index) in modalData.detail" :key="index">
                <span class="timespan" v-if="item.handleTime">时间：{{$moment(parseInt(item.handleTime)*1000).format('YYYY-MM-DD HH:mm:ss')}}</span>
                <span class="timespan" v-if="item.person">处理人：{{item.person}}</span>
                <span class="timespan" v-if="item.phone">联系电话：{{item.phone}}</span>
                <span class="timespan" v-if="item.detail && item.handleTime">处理详情：{{item.detail}}</span>
              </TimelineItem>
            </Timeline>
          </div>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel" v-if="!showInput">取消</Button>
          <Button type="primary" @click="modalSure('modalData')" v-if="!showInput" style="margin-left: 16px;">确定</Button>
          <Button type="primary" @click="modalSureCancel" v-if="showInput">确定</Button>
        </div>
      </Modal>
    </div>
    <!--处理 模态框-->
    <div v-if="disposeModal">
      <Modal v-model="disposeModal" title="事件处理" :mask-closable="false">
        <Form label-position="left" :label-width="100" :model="disposeData" ref="disposeData" :rules="disposeRule" style="padding: 0 20px;">
          <Form-item label="事件编号">
            <Input v-model="disposeData.eventCode" disabled/>
          </Form-item>
          <Form-item label="处理人" prop="person">
            <Input v-model="disposeData.person" />
          </Form-item>
          <Form-item label="联系方式" prop="phone">
            <Input v-model="disposeData.phone" />
          </Form-item>
          <Form-item label="处理时间" prop="handleTime">
            <DatePicker type="datetime" style="width: 300px" :options="dateLimit" v-model="disposeData.handleTime" :editable="false" :clearable="false"></DatePicker>
          </Form-item>
          <Form-item label="处理描述" prop="detail">
            <Input type="textarea" v-model="disposeData.detail" placeholder="请输入处理描述" />
          </Form-item>
          <Form-item label="是否解决">
            <Radio-group v-model="isReceive" @on-change="receiveRadio">
              <Radio label="yes">已解决</Radio>
              <Radio label="no">未解决</Radio>
            </Radio-group>
          </Form-item>
          <Form-item label="是否关闭">
            <Radio-group v-model="isClose" @on-change="closeRadio">
              <Radio label="yes">关闭</Radio>
              <Radio label="no">不关闭</Radio>
            </Radio-group>
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="cancel">取消</Button>
          <Button type="primary" @click="disposeSure('disposeData')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import hostory from './historyAlarm'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  components: { hostory },
  data() {
    const nameRule = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        return callback(new Error('不能为空'))
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
    const twentyRule = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        return callback(new Error('不能为空'))
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
        if (len > 20) {
          return callback(new Error('不能超过20位字符'))
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
    const twoHounderRule = (rule, value, callback) => {
      if (value) {
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
        if (len > 200) {
          return callback(new Error('不能超过200位字符'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      deal: null,
      cantClick: true,
      showInput: false,
      sideBarList: [
        {
          name: '接警任务',
          isActive: true,
          roleTabs: 'receive',
          vIf: 'BS-BUSINESS-RECEIVE-PAGE'
        },
        {
          name: '历史记录',
          isActive: false,
          roleTabs: 'history',
          vIf: 'BS-BUSINESS-HISTORY-PAGE'
        }
      ],
      tableHeight: 500,
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      inSearchName: '',
      startTime: '',
      endTime: new Date(),
      receiveTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '事件编号',
          key: 'eventCode',
          align: 'left',
          minWidth: 100
        },
        {
          title: '事件名称',
          key: 'eventName',
          align: 'left',
          minWidth: 150,
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
                  title: params.row.eventName
                }
              },
              params.row.eventName
            )
          }
        },
        {
          title: '报警人',
          key: 'person',
          minWidth: 150,
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
                  title: params.row.person
                }
              },
              params.row.person
            )
          }
        },
        {
          title: '联系方式',
          key: 'phone',
          minWidth: 150,
          align: 'left'
        },
        {
          title: '报警时间',
          key: 'alarmTime',
          minWidth: 150,
          align: 'left',
          render: (h, params) => {
            var text = params.row.alarmTime
              ? this.$moment(parseInt(params.row.alarmTime) * 1000).format('YYYY-MM-DD HH:mm:ss')
              : ''
            return h('span', text)
          }
        },
        {
          title: '当前状态',
          key: 'state',
          minWidth: 150,
          align: 'left',
          render: (h, params) => {
            var name = ''
            if (params.row.state === 1) {
              name = '已解决'
            } else if (params.row.state === 2) {
              name = '未解决'
            } else {
              name = ''
            }
            return h('span', name)
          }
        },
        {
          title: '事件描述',
          key: 'description',
          minWidth: 250,
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
                  title: params.row.description
                }
              },
              params.row.description
            )
          }
        },
        {
          title: '事件处理',
          key: 'config',
          minWidth: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  style: {
                    marginRight: '10px'
                  },
                  on: {
                    click: () => {
                      this.receivedispose(params.index, params.row)
                    }
                  }
                },
                '处理'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small',
                    disabled: !this.$BShasPower('BS-BUSINESS-RECEIVE-CONFG')
                  },
                  on: {
                    click: () => {
                      this.showmessage(params.index, params.row, '事件处理信息')
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      receiveData: [],
      openModal: false,
      modalTitle: '',
      modalData: {
        _id: '',
        eventCode: '',
        eventName: '',
        person: '',
        phone: '',
        alarmTimeyms: '',
        description: '',
        recordPerson: '',
        recordPhone: '',
        source: ''
      },
      originList: [{ label: '电话记录', value: '0' }, { label: '现场记录', value: '1' }],
      disposeModal: false,
      disposeData: {
        eventCode: '',
        person: '',
        phone: '',
        handleTime: '',
        detail: '',
        state: 2,
        close: false
      },
      detailData: {},
      isReceive: 'no',
      isClose: 'no',
      Inselect: [],
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      },
      fresh: false,
      searchMes: false,
      receiveRule: {
        eventName: [{ required: true, validator: nameRule, trigger: 'blur' }],
        person: [{ required: true, validator: twentyRule, trigger: 'blur' }],
        phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { validator: this.$bsValidate.validatePhone, trigger: 'blur' }
        ],
        time: [{ required: true, validator: contEmptyRule, trigger: 'change' }],
        source: [{ required: true, validator: contEmptyRule, trigger: 'change' }],
        recordPerson: [{ required: true, validator: twentyRule, trigger: 'blur' }],
        description: [{ max: 200, message: '最多 200 字符！', trigger: 'blur' }],
        recordPhone: [{ validator: this.$bsValidate.validatePhone, trigger: 'blur' }]
      },
      disposeRule: {
        person: [{ required: true, validator: twentyRule, trigger: 'blur' }],
        phone: [
          { required: true, message: '电话不能为空', trigger: 'blur' },
          { validator: this.$bsValidate.validatePhone, trigger: 'blur' }
        ],
        handleTime: [{ required: true, validator: contEmptyRule, trigger: 'change' }],
        detail: [{ max: 200, message: '最多 200 字符！', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      receiveAlarmData: ({ businessAlarm }) => businessAlarm.receiveAlarmData
    }),
    ...mapGetters([])
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 40
  },
  methods: {
    ...mapActions([
      'getBusinessAlarm',
      'addBusinessAlarm',
      'editBusinessAlarm',
      'delBusinessAlarm',
      'disposeBusinessAlarm',
      'recordLog'
    ]),
    expand() {
      this.$refs.orgFireScroll.update()
    },
    getTable() {
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
        this.searchMes = false
        return
      } else {
        startTimeData = ''
        endTimeData = Date.parse(new Date()) / 1000
      }
      this.getBusinessAlarm({
        deal: this.deal,
        name: this.inSearchName,
        startTime: startTimeData,
        endTime: endTimeData,
        page: this.pageInfo.cur,
        limit: this.pageInfo.limit
      })
        .then(res => {
          this.receiveData = this.receiveAlarmData
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          this.fresh = true
          this.searchMes = true
          this.Inselect.length = 0
          this.cantClick = true
        })
        .catch(err => {
          console.log(err, '获取失败')
          this.fresh = false
          this.searchMes = false
        })
    },
    search() {
      this.getTable()
      if (this.searchMes) {
        this.successMsg('搜索成功')
      }
    },
    freshData() {
      this.deal = null
      this.inSearchName = ''
      this.startTime = ''
      this.Inselect = []
      this.cantClick = true
      this.endTime = new Date()
      this.getTable()
      if (this.fresh) {
        this.successMsg('刷新成功')
      }
    },
    sideBarActive(config) {
      if (config.roleTabs === 'receive') {
        this.sideBarList[0].isActive = true
        this.sideBarList[1].isActive = false
        this.getTable()
      } else if (config.roleTabs === 'history') {
        this.sideBarList[0].isActive = false
        this.sideBarList[1].isActive = true
      }
    },
    openAddMod(title) {
      this.modalTitle = title
      this.modalData = {
        eventCode: '',
        eventName: '',
        person: '',
        phone: '',
        alarmTimeyms: new Date(),
        description: '',
        recordPerson: '',
        recordPhone: '',
        source: ''
      }
      this.openModal = true
    },
    openEditMod(title) {
      if (this.Inselect.length === 1) {
        this.modalTitle = title
        this.modalData = {
          eventCode: this.Inselect[0].eventCode,
          eventName: this.Inselect[0].eventName,
          person: this.Inselect[0].person,
          phone: this.Inselect[0].phone,
          description: this.Inselect[0].description,
          recordPerson: this.Inselect[0].recordPerson,
          recordPhone: this.Inselect[0].recordPhone,
          source: this.Inselect[0].source,
          alarmTimeyms: this.$moment(parseInt(this.Inselect[0].alarmTime) * 1000).format('YYYY-MM-DD HH:mm:ss'),
          _id: this.Inselect[0]._id
        }
        this.openModal = true
      } else {
        this.warningMsg('请选择一项，且不支持批量')
      }
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
        operateName: '删除接警任务',
        operateContent: '删除接警任务',
        target: this.Inselect.map(item => item.eventName).join(' '),
        deviceIp: this.Inselect.map(item => item.eventCode).join(' ')
      }
      this.recordLog(paramsLog)

      this.delBusinessAlarm(allId)
        .then(() => {
          this.getTable()
          this.Inselect.length = 0
          this.cantClick = true
        })
        .catch(err => {
          this.errorMsg(err)
        })
    },
    receiveInSel(select) {
      this.Inselect = select
      if (select.length === 0) {
        this.cantClick = true
      } else {
        this.cantClick = false
      }
    },
    modalSure(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.modalTitle === '新建事件') {
            let time = this.modalData.alarmTimeyms
            this.modalData.alarmTime = Date.parse(new Date(time)) / 1000

            const paramsLog = {
              logType: '操作日志',
              module: '业务管理',
              operateName: '新建接警任务',
              operateContent: '新建接警任务',
              target: this.modalData.eventName,
              deviceIp: this.modalData.eventCode
            }

            this.recordLog(paramsLog)
            this.addBusinessAlarm(this.modalData)
              .then(() => {
                this.getTable()
                this.openModal = false
              })
              .catch(err => {
                console.log(err, '新建失败')
              })
          } else if (this.modalTitle === '修改事件') {
            let time = this.modalData.alarmTimeyms
            this.modalData.alarmTime = Date.parse(new Date(time)) / 1000

            const paramsLog = {
              logType: '操作日志',
              module: '业务管理',
              operateName: '修改接警任务',
              operateContent: '修改接警任务',
              target: this.modalData.eventName,
              deviceIp: this.modalData.eventCode
            }
            this.recordLog(paramsLog)

            this.editBusinessAlarm(this.modalData)
              .then(() => {
                this.getTable()
                this.openModal = false
                this.Inselect.length = 0
              })
              .catch(err => {
                console.log(err, '修改失败')
              })
          } else {
            this.openModal = false
          }
        }
      })
    },
    receivedispose(index, value) {
      this.disposeModal = true
      this.detailData = value
      this.disposeData = {
        eventCode: value.eventCode,
        person: '',
        phone: '',
        handleTime: new Date(),
        detail: '',
        state: 2,
        close: false,
        eventName: value.eventName
      }
      this.isReceive = 'no'
      this.isClose = 'no'
    },
    disposeSure(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var arr = []
          arr.push({
            person: this.disposeData.person,
            phone: this.disposeData.phone,
            handleTime: Date.parse(new Date(this.disposeData.handleTime)) / 1000,
            detail: this.disposeData.detail
          })
          var data = {
            _id: this.detailData._id,
            detail: arr,
            state: this.disposeData.state,
            close: this.disposeData.close
          }
          const paramsLog = {
            logType: '操作日志',
            module: '业务管理',
            operateName: '处理接警任务',
            operateContent: '处理接警任务',
            target: this.disposeData.eventName,
            deviceIp: this.disposeData.eventCode
          }

          this.recordLog(paramsLog)
          this.disposeBusinessAlarm(data)
            .then(() => {
              this.getTable()
              this.disposeModal = false
            })
            .catch(err => {
              console.log(err, '处理操作失败')
            })
        }
      })
    },
    showmessage(index, value, title) {
      this.modalTitle = title
      value.detail = value.detail.filter(item => item && item._id)
      this.modalData = value
      if (value.createTime) {
        this.modalData.detail.unshift({ handleTime: value.createTime, detail: '创建事件' })
      }
      if (value.closeTime) {
        this.modalData.detail.push({ handleTime: value.closeTime, detail: '关闭事件' })
      }
      this.modalData.alarmTimeyms = this.$moment(parseInt(value.alarmTime) * 1000).format('YYYY-MM-DD HH:mm:ss')
      if (value.state === 1) {
        this.modalData.states = '已解决'
      } else if (value.state === 2) {
        this.modalData.states = '未解决'
      } else {
        this.modalData.states = ''
      }
      this.openModal = true
    },
    cancel() {
      if (this.$refs['modalData']) {
        this.$refs['modalData'].resetFields()
      }
      if (this.$refs['disposeData']) {
        this.$refs['disposeData'].resetFields()
      }
      this.openModal = false
      this.disposeModal = false
    },
    modalSureCancel() {
      this.openModal = false
      this.modalData = {}
    },
    receiveRadio(select) {
      if (select === 'yes') {
        this.disposeData.state = 1
      } else {
        this.disposeData.state = 2
      }
    },
    closeRadio(select) {
      if (select === 'yes') {
        this.disposeData.close = true
      } else {
        this.disposeData.close = false
      }
    },
    pageChange(n) {
      this.pageInfo.cur = n
      this.getTable()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getTable()
    }
  },
  watch: {
    modalTitle(newvalue, oldvalue) {
      if (newvalue === '事件处理信息') {
        this.showInput = true
      } else {
        this.showInput = false
      }
    }
  },
  created() {
    if (this.$route.query.alarmSureFalse) {
      this.deal = 0
    }
    if (this.$route.query.endTime) {
      this.endTime = new Date(decodeURIComponent(this.$route.query.endTime))
    }
    if (this.$route.query.startTime) {
      this.startTime = new Date(decodeURIComponent(this.$route.query.startTime))
    }
    this.Inselect.length = 0
    this.cantClick = true
    this.getTable()
  }
}
</script>

<style  scoped>
.sidebar {
  width: 100%;
  height: auto;
}
.tree-org {
  height: 600px;
  max-width: 300px;
  overflow: hidden;
}
.table-relative {
  position: relative;
  height: calc(100% - 74px);
  margin: 0px;
  width: 100%;
}
.config-list li {
  position: relative;
  cursor: pointer;
  height: 40px;
  line-height: 39px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
  /* border-bottom: 1px solid rgba(58, 90, 139, 0.4); */
  padding: 0 0 0 40px;
}

.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}

.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}

.bs-content {
  width: 100%;
  position: relative;
  display: flex;
}

.pictureStyle {
  display: inline-flex;
  width: auto;
  height: 100%;
  margin-left: 20px;
  padding: 0;
}

.bs-mains {
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  background: #1c3053;
  min-height: 670px;
  padding: 12px 0 0 0;
}
.haha {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}

.rt {
  float: right;
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
  flex: 0 0 30px;
  padding: 0 24px;
  height: 30px;
  line-height: 30px;
}

.feature-btn > button {
  margin-right: 15px;
  float: left;
  width: 100px;
}

.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}

.page-style {
  width: 100%;
  height: 42px;
  line-height: 42px;
  border-top: none;
  padding: 2px 12px;
  background: #244575;
}

.form-rule {
  margin-top: 15px;
}

.form-select {
  display: inline-block;
}

.left-select {
  margin-right: 18px;
}

.alarm-confirm {
  width: 80px;
  display: inline-block;
  vertical-align: top;
}

.confirm-way {
  display: inline-block;
}

.confirm {
  position: relative;
  height: 50px;
}

.confirm-time {
  width: 200px;
  margin-left: 20px;
}

.operation-btn {
  height: 38px;
  border-bottom: 2px solid #909090;
}

.operation-btn > div:first-child {
  font-size: 14px;
  height: 32px;
  line-height: 32px;
}

.infor-del {
  height: 40px;
  width: 100%;
  margin-top: 10px;
}

.model-table {
  width: 100%;
  overflow: auto;
  border: 1px solid #5d5d5d;
}

.transf {
  width: 100%;
  overflow: auto;
  margin-top: 0px;
  text-align: left;
}

.infor-list .ivu-table {
  width: 100%;
}

.org-tree .transf .ivu-transfer .ivu-transfer-list .ivu-transfer-list-header {
  background: #1c3053 !important;
}
.timespan {
  display: inherit;
}
.businessTimelineStyle {
  position: relative;
  top: -16px;
  left: 75px;
  width: 84%;
  height: 175px;
  overflow: auto;
  padding: 5px 20px;
  border-radius: 4px;
  border: 1px solid #5676a9;
}
.showInputStyle {
  width: 215px;
  margin-right: 14px;
  margin-left: 0px;
  display: inline-block;
}
.showInputStyle .ivu-form-item-content {
  margin-left: 62px;
}
</style>
