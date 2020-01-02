<template>
  <div style="width: 100%; background: #1b3153">
    <header class="config-header">110呼叫中心</header>
    <div style="padding: 20px;">
      <div class="server-config" style="position: relative">
        <h6 class="server-title">{{ serverTitle }}</h6>
        <Form :model="server" label-position="right" :label-width="86" class="conditions" :rules="callCenterValidate" ref="serverValidate">
          <FormItem label="服务器IP" class="cond-item" prop="ip">
            <Bsipv4 placeholder="请输入" v-model="server.ip" style="width:240px;"></Bsipv4>
          </FormItem>
          <FormItem label="端口" class="cond-item" prop="httpPort">
            <InputNumber
              v-model="server.httpPort"
              :max="65535"
              :min="0"
              :step="5"
              style="width:240px;"
            ></InputNumber>
          </FormItem>
          <FormItem class="cond-item" v-if="!isSave"></FormItem>
          <FormItem label="连接状态" class="cond-item" v-if="isSave">
            <span class="cond-value" v-if="serverSaveStatus">{{ server.connectState }}</span>
            <span class="cond-value" v-if="!serverSaveStatus">连接中...</span>
            <Input name="serverPassword" type="password" style="width: 0; height: 0; overflow: hidden" :readonly="true"></Input>
          </FormItem>
          <FormItem label="账号" class="cond-item" prop="userName">
            <Input
              v-model="server.userName"
              style="width:240px;"
              placeholder="请输入账号"
            ></Input>
          </FormItem>
          <FormItem label="密码" class="cond-item" prop="password">
            <Input
              v-model="server.password"
              name="serverPassword"
              type="password"
              style="width:240px;"
              placeholder="请输入密码"
            ></Input>
          </FormItem>
          <FormItem label="" class="cond-item"></FormItem>
          <FormItem label="外线前缀" class="cond-item" prop="prefix">
            <Input
              v-model="server.prefix"
              style="width:240px;"
              placeholder="请输入外线前缀"
            ></Input>
          </FormItem>
        </Form>
        <div class="save-button">
          <Button type="ghost" @click="saveServerInfo">&nbsp;保存</Button>
        </div>
      </div>
      <div>
        <h6 class="config-title">
          {{ seatitle }}
          <i v-if="server.connectState === '成功' && serverSaveStatus" class="iconfont" style="cursor: pointer; font-size: 14px" :title="modelTitle" @click="addModel(true)"> &#xe626; </i>
          <i v-if="server.connectState !== '成功' || !serverSaveStatus" class="iconfont" style="cursor: not-allowed; font-size: 14px; color: #999;" :title="addServerTip"> &#xe626; </i>
        </h6>
        <Table
          size="small"
          :columns="modelColumns"
          :data="seatList"
          :highlight-row="true"
          :height="tableHeight"
          width="800"
        ></Table>
      </div>
    </div>
    <Modal
      class="dispatch-model"
      :title="isAddModel ? modelTitle : modifyTitle"
      v-model="addDispatch"
      :mask-closable="false"
      @on-cancel="operateCancel('callCenterValidate')"
      width="600"
    >
      <Form
        :model="seat"
        :label-width="85"
        :rules="callCenterValidate"
        ref="callCenterValidate"
        label-position="left"
        style="width:355px; margin-right:20px;"
      >
        <FormItem label="坐席名称：" prop="name">
          <Input v-model="seat.name" placeholder="请输入坐席名称"></Input>
        </FormItem>
        <FormItem label="分机号： " prop="extension">
          <Input v-model="seat.extension" placeholder="请输入分机号"></Input>
        </FormItem>
        <FormItem label="坐席组名：" prop="groupName">
          <Select v-model="seat.groupName">
            <Option v-for="(item, index) in groupNames" :key="index" :value="item">{{ item }}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="operateCancel('callCenterValidate')">取消</Button>
        <Button type="primary" @click="addControlTask('callCenterValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Bsipv4 from '../../../components/BSIPV4.vue'
import { getSocket } from 'src/socket/socket.js'
export default {
  components: {
    Bsipv4
  },
  data() {
    const seatTest = (rule, value, callback) => {
      if (/\s+/g.test(value)) {
        callback(new Error('请勿输入空格'))
      } else {
        this.lenTest(value, callback, 16)
      }
    }
    const seatExtensionTest = (rule, value, callback) => {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确的数字'))
      } else {
        callback()
      }
    }
    const seatNameRepeat = (rule, value, callback) => {
      let isRepeat = false
      if (this.seatList.length > 0) {
        for (let l = 0; l < this.seatList.length; l++) {
          if (this.seatList[l].name === value) {
            if (this.isAddModel || (!this.isAddModel && this.seat._id !== this.seatList[l]._id)) {
              isRepeat = true
            }
          }
        }
      }
      if (isRepeat) {
        callback(new Error('坐席名称' + value + '已存在，请重新输入'))
      } else {
        callback()
      }
    }
    const seatExtensionRepeat = (rule, value, callback) => {
      let isRepeat = false
      if (this.seatList.length > 0) {
        for (let l = 0; l < this.seatList.length; l++) {
          if (this.seatList[l].extension === value) {
            if (this.isAddModel || (!this.isAddModel && this.seat._id !== this.seatList[l]._id)) {
              isRepeat = true
            }
          }
        }
      }
      if (isRepeat) {
        callback(new Error('分机号' + value + '已存在，请重新输入'))
      } else {
        callback()
      }
    }
    return {
      serverTitle: '服务器配置',
      seatitle: '坐席配置',
      tableHeight: '420',
      modelTitle: '添加坐席',
      modifyTitle: '修改坐席',
      addServerTip: '请先添加服务器配置并连接成功',
      isAddModel: true, // 判断坐席弹框当前是新增还是修改
      addDispatch: false, // 坐席弹框的显隐
      selectSeatName: '', // 选中的坐席名称
      isSave: false, // 判断服务器信息是否已经保存
      server: {
        ip: '...',
        httpPort: 18081,
        connectState: '',
        userName: '',
        password: '',
        prefix: ''
      },
      oldServer: {
        ip: '...',
        httpPort: null,
        connectState: ''
      },
      seat: {
        _id: '',
        name: '',
        extension: '',
        groupName: ''
      },
      modelColumns: [
        {
          key: 'name',
          width: 150,
          title: '坐席名称',
          align: 'center'
        },
        {
          title: '分机号',
          key: 'extension',
          width: 150,
          align: 'center'
        },
        {
          title: '坐席组名',
          key: 'groupName',
          width: 150,
          align: 'center'
        },
        {
          title: '坐席状态',
          key: 'status',
          width: 145,
          align: 'center'
        },
        {
          title: '操作',
          key: 'operate',
          width: 200,
          align: 'center',
          render: (h, params) => {
            let self = this
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !(params.row.status === '空闲' || !params.row.status)
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      self.backfillSeat(params.row)
                      self.addModel(false)
                    }
                  }
                },
                '编辑'
              ),
              // h(
              //   'Button',
              //   {
              //     props: {
              //       type: 'primary',
              //       size: 'small',
              //       disabled: !(params.row.status === '空闲' || !params.row.status)
              //     },
              //     style: {
              //       marginRight: '5px'
              //     },
              //     on: {
              //       click: () => {
              //         self.loginSeat(params.row)
              //         self.selectSeatName = params.row.name
              //       }
              //     }
              //   },
              //   params.row.loginStatus ? '注销' : '登录'
              // ),
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: !(params.row.status === '空闲' || !params.row.status)
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      self.$Modal.confirm({
                        title: '提示',
                        content: '<p>确认删除坐席' + params.row.name + '吗？</p>',
                        onOk: () => {
                          self.deleteSeat(params.row)
                        },
                        onCancel: () => {}
                      })
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      callCenterValidate: {
        name: [
          { type: 'string', required: true, message: '请输入坐席名称', trigger: 'blur' },
          { validator: seatTest, trigger: 'blur' },
          { validator: seatNameRepeat, trigger: 'blur' }
        ],
        extension: [
          { type: 'string', required: true, message: '请输入分机号', trigger: 'blur' },
          { validator: seatTest, trigger: 'blur' },
          { validator: seatExtensionTest, trigger: 'blur' },
          { validator: seatExtensionRepeat, trigger: 'blur' }
        ],
        groupName: [
          { type: 'string', required: true, message: '请选择坐席组名', trigger: 'blur' }
        ],
        ip: [
          { type: 'string', required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        httpPort: [
          { type: 'number', required: true, message: '请输入服务器端口', trigger: 'blur' }
        ],
        userName: [
          { type: 'string', required: true, message: '请输入账号', trigger: 'blur' },
          { validator: seatTest, trigger: 'blur' }
        ],
        password: [
          { type: 'string', required: true, message: '请输入密码', trigger: 'blur' },
          { validator: seatTest, trigger: 'blur' }
        ],
        prefix: [
          { type: 'string', required: true, message: '请输入外线前缀', trigger: 'blur' },
          { validator: seatTest, trigger: 'blur' },
          { validator: seatExtensionTest, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      seatList: ({ phone }) => phone.seatList,
      serverSaveStatus: ({ phone }) => phone.serverSaveStatus,
      groupNames: ({ phone }) => phone.groupNames,
      login: ({ phone }) => phone.login
    })
  },
  created() {
    this.getServerInfos()
    this.updateExtensionStatus()
    this.getCallServerStatus()
    this.setServerSaveStatus(true)
    this.setSeatList([])
  },
  methods: {
    ...mapActions('phone', [
      'getServerInfo',
      'postServerInfo',
      'postSeatInfo',
      'putLoginSeatInfo',
      'removeSeatInfo',
      'getSeatList',
      'postLoginSeatInfo',
      'postLoginOutSeatInfo',
      'setSeatList',
      'getSeatGroup',
      'updateExtensionStatus',
      'setServerSaveStatus'
    ]),
    showWarning(msg) {
      this.$Notice.warning({
        title: '提示',
        desc: msg,
        duration: 3
      })
    },
    /**
     * 字符长度检测
     * @method lenTest
     * @param {string} value 需要验证的字段
     */
    lenTest(value, callback, length) {
      const nativecode = value.split('')
      if (nativecode.length > length) {
        callback(new Error(`不能超过${length}个字符`))
      } else {
        callback()
      }
    },
    saveServerInfo() {
      this.$refs.serverValidate.validate(valid => {
        if (!valid) { return }
        if (this.oldServer.ip === this.server.ip && this.oldServer.httpPort === this.server.httpPort && this.oldServer.userName === this.server.userName && this.oldServer.password === this.server.password && this.oldServer.prefix === this.server.prefix && this.server.connectState === '成功') {
          return this.showWarning('服务器配置信息未做任何修改')
        }
        if (!this.serverSaveStatus) {
          return this.showWarning('服务器连接中，请稍等...')
        }
        this.setServerSaveStatus(false)
        let self = this
        const params = {
          ip: this.server.ip,
          httpPort: this.server.httpPort,
          userName: this.server.userName,
          password: this.server.password,
          prefix: this.server.prefix
        }
        this.postServerInfo(params)
          .then((result) => {
            self.successMsg('服务器配置保存成功')
            self.isSave = true
            self.oldServer.ip = self.server.ip
            self.oldServer.httpPort = self.server.httpPort
            self.oldServer.userName = self.server.userName
            self.oldServer.password = self.server.password
            self.oldServer.prefix = self.server.prefix
            self.setSeatList([])
          }).catch(err => {
            self.isSave = true
            self.setServerSaveStatus(true)
            self.server.connectState = '失败'
            self.errorMsg(err && err.response && err.response.data && err.response.data.message)
          })
      })
    },
    addModel(type) {
      // 打开添加坐席弹框
      this.isAddModel = type
      this.addDispatch = true
      this.getSeatGroup()
    },
    addControlTask(name) {
      // 坐席信息新增/修改保存
      const self = this
      this.$refs[name].validate(valid => {
        if (valid) {
          let isEdit = false
          for (let v = 0; v < self.seatList.length; v++) {
            if (self.seatList[v]._id === self.seat._id) {
              if (self.seatList[v].name !== self.seat.name || self.seatList[v].extension !== self.seat.extension || self.seatList[v].groupName !== self.seat.groupName) {
                isEdit = true
              }
            }
          }
          if (!isEdit && !self.isAddModel) {
            self.showWarning('坐席信息未做任何修改')
          } else {
            const result = this.isAddModel ? this.postSeatInfo(this.seat) : this.putLoginSeatInfo(this.seat)
            result.then((data) => {
              self.successMsg('坐席' + self.seat.name + (self.isAddModel ? '新增' : '修改') + '成功')
              self.clearSeat()
              self.getSeatLists()
              self.addDispatch = false
            }).catch(err => {
              self.errorMsg(err.response.data.message)
            })
          }
        }
      })
    },
    clearSeat() {
      // 保存时清空坐席信息
      this.seat._id = ''
      this.seat.name = ''
      this.seat.extension = ''
      this.seat.groupName = ''
      // this.seat.loginStatus = ''
    },
    backfillSeat(row) {
      // 编辑时回填坐席信息
      this.seat._id = row._id
      this.seat.name = row.name
      this.seat.extension = row.extension
      this.seat.groupName = row.groupName
      // this.seat.loginStatus = row.loginStatus
    },
    operateCancel(name) {
      // 关闭添加弹框
      this.$refs[name].resetFields()
      this.addDispatch = false
    },
    // loginSeat(row) {
    //   const self = this
    //   const result = row.loginStatus ? this.postLoginOutSeatInfo({ name: row.name, extension: row.extension, groupName: row.groupName }) : this.postLoginSeatInfo({ name: row.name, extension: row.extension, groupName: row.groupName })
    //   result.then(data => {
    //     console.log('坐席' + row.name + (row.loginStatus ? '注销成功' : '登录成功'))
    //   }).catch(err => {
    //     self.errorMsg(err.response.data.message)
    //   })
    // },
    deleteSeat(row) {
      // 删除坐席
      this.removeSeatInfo({ _id: row._id }).then((data) => {
        this.getSeatLists()
        this.successMsg('坐席' + row.name + '删除成功')
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    },
    getSeatLists() {
      this.getSeatList().then(result => {
        console.log('坐席列表获取成功')
        this.setSeatList(result.data || [])
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    },
    getServerInfos() {
      this.getServerInfo().then(result => {
        console.log('服务器信息获取成功')
        if (result && result.data && result.data._id) {
          this.oldServer.ip = this.server.ip = result.data.ip
          this.oldServer.httpPort = this.server.httpPort = result.data.httpPort
          this.oldServer.userName = this.server.userName = result.data.userName
          this.oldServer.password = this.server.password = result.data.password
          this.oldServer.prefix = this.server.prefix = result.data.prefix
          if (this.server.ip) {
            this.isSave = true
            this.setServerSaveStatus(false)
          }
        }
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    },
    getCallServerStatus() {
      const self = this
      getSocket().on('callServerStatus', (res) => {
        console.log('获取到的服务器连接状态：' + (res && res.status))
        if (!res) { return }
        if (self.server.connectState === '失败' && res.status) {
          self.getSeatLists()
        }
        self.server.connectState = res.status ? '成功' : '失败'
        self.setServerSaveStatus(true)
        if (res.status) {
          self.getSeatLists()
        }
      })
    }
  },
  watch: {
    // login: {
    //   handler: function(newValue, oldValue) {
    //     console.log(newValue)
    //     if (newValue.status) {
    //       this.successMsg('坐席' + newValue.extension + (newValue.type === 'logout' ? '注销成功' : '登录成功'))
    //       this.getSeatLists()
    //     } else {
    //       this.errorMsg(newValue.text)
    //     }
    //   },
    //   deep: true
    // }
  }
}
</script>
<style scoped>
.dispatch-model .ivu-modal {
  width: fit-content !important;
}
.server-title {
  font-size: 14px;
  line-height: 32px;
  font-weight: normal;
}
.server-config {
  width: 100%;
  height: 280px;
}
.config-header {
  width: 100%;
  font-size: 14px;
  height: 38px;
  line-height: 38px;
  background: #0f2343;
  padding: 0 0 0 20px;
}
.config-title {
  font-size: 14px;
  padding: 10px 0;
  font-weight: normal;
}
.conditions {
  width: 1080px;
}
.cond-item {
  width: 330px;
  display: inline-block;
  vertical-align: middle;
  margin: 0 20px 24px 0;
}
.save-button {
  width: 100%;
  padding: 20px 0 0 620px;
}
.connect-state {
  line-height: 32px;
}
.cond-value {
  padding: 0 0 0 10px;
  color: #fda54b;
}
.demo-spin-col{
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
</style>

<style lang="less">
#content {
  .ivu-notice {
    z-index: 999999999999 !important;
  }
  .ivu-modal-mask {
    z-index: 9999999 !important;
  }
}
</style>
