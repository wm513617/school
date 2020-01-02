<template>
  <div class="bs-content" id="alarmCenter">
    <div class="bs-left">
      <div class="sidebar">
        <a>设备类型</a>
        <ul class="config-list">
          <li style="list-style:none;" v-show="$BShasPower(config.vIf)|| $BShasPower(config.vIfC)" v-for="(config,index) in configTopList" :key="index" :class="{active: config.isActive}" @click="leftTopBoxActive(config)">
            {{config.name}}
          </li>
        </ul>
        <ul class="config-list farFromTop">
          <li style="list-style:none;" v-if="$BShasPower(configBottomList[0].vIf)||$BShasPower(configBottomList[0].vIfC)" @click="isNowPathActive" :class="{active: configBottomList[0].isActive}">服务器配置</li>
        </ul>
      </div>
    </div>
    <div class="bs-mains">
      <!--接警中心-->
      <div class="haha" v-if="configTopList[0].isActive &&($BShasPower('BS-ALARMHELP-CENTER-PAGE')|| $BShasPower('BS-ALARMHELP-CENTER-CONF'))" style="text-align:center;width:100%;font-size:12px;height:100%;">
        <div class="feature-btn">
          <Button type="ghost" icon="plus" @click="openAddMod('添加接警中心')" v-if="$BShasPower('BS-ALARMHELP-CENTER-CONF')">添加</Button>
          <Button type="ghost" icon="edit" @click="openEditMod('修改接警中心')" v-if="$BShasPower('BS-ALARMHELP-CENTER-CONF')" :disabled="canUse">修改</Button>
          <Button type="ghost" icon="trash-a" @click="delAlarm" v-if="$BShasPower('BS-ALARMHELP-CENTER-CONF')" :disabled="canUse">删除</Button>
          <Button type="ghost" @click="offRing" :loading="offLoad" :disabled="centreOffring" v-if="$BShasPower('BS-ALARMHELP-CENTER-CONF')">关闭响铃</Button>
          <Input v-model="inSearchName" placeholder="按接警中心名称查询" style="width: 250px;" class="rt">
          <Button slot="append" @click="search">搜索</Button>
          </Input>
        </div>
        <div class="table-relative flex-1" style="margin-top:12px;" ref="tableBox">
          <div class="table-body">
            <Table size="small" :columns="centerTableTitle" :data="centerTableData" :height="tableHeight" @on-selection-change="alarmInSel"></Table>
          </div>
        </div>
        <div class="table-footer">
          <Page class="rt" show-sizer show-elevator show-total :page-size-opts="$PageInfo.size" :total="pageInfo.count" :page-size="pageInfo.limit" :current="pageInfo.cur" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
      </div>
      <!--报警终端-->
      <alarmTerminalPage v-if="configTopList[1].isActive"></alarmTerminalPage>
      <!--服务器配置-->
      <alarmServer v-if="configBottomList[0].isActive"></alarmServer>
    </div>
    <!--接警中心——添加、修改-->
    <div v-if="centerModelShow">
      <Modal v-model="centerModelShow" :title="centerTitle" width="500" :mask-closable="false">
        <Form label-position="left" :label-width="120" :model="centerAddData" ref="centerAddData" :rules="alarmRule"  style="padding: 0 10px;">
          <Form-item label="接警中心名称" prop="name">
            <Input v-model="centerAddData.name" />
          </Form-item>
          <Form-item label="警笛ip地址" prop="ip">
            <Input v-model="centerAddData.ip" />
          </Form-item>
          <Form-item label="警笛控制端口" prop="port" :rules="{type: 'number',required:true,trigger:'blur',validator: portRule}">
            <Input type="text" v-model="centerAddData.cport" number/>
          </Form-item>
          <Form-item label="警笛用户名" prop="username">
            <Input v-model="centerAddData.username" />
          </Form-item>
          <Form-item label="警笛密码" prop="password">
            <Input type="password" v-model="centerAddData.password" />
          </Form-item>
          <Form-item label="对讲台麦ID号" prop="talkId">
            <Input v-model="centerAddData.talkId" />
          </Form-item>
          <Form-item label="对讲台麦IP地址" prop="talkIp">
            <Input v-model="centerAddData.talkIp" />
          </Form-item>
        </Form>
        <div slot="footer">
          <Button type="ghost" @click="editCancel('centerAddData')">取消</Button>
          <Button type="primary" :loading="modelLoad" @click="editOk('centerAddData')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import allPage from './allPage.js'
import alarmServer from './alarmServer'
import alarmTerminalPage from './alarmTerminal.vue'
export default {
  name: 'alarmCenter',
  components: {
    alarmTerminalPage,
    alarmServer
  },
  mixins: [allPage],
  data() {
    return {
      canUse: true,
      centerTableTitle: [
        {
          type: 'selection',
          width: 60
        },
        {
          title: '接警中心名称',
          key: 'name',
          align: 'center',
          minWidth: 200,
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
          title: '警笛IP地址',
          key: 'ip',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            let text = ''
            if (params.row.alarmHostId.ip === '') {
              text = '...'
            } else {
              text = params.row.alarmHostId.ip
            }
            return h('span', text)
          }
        },
        {
          title: '对讲台麦IP地址',
          key: 'talkIp',
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            let text = ''
            if (params.row.talkIp === '') {
              text = '...'
            } else {
              text = params.row.talkIp
            }
            return h('span', text)
          }
        },
        {
          title: '对讲台麦ID',
          key: 'talkId',
          minWidth: 300,
          align: 'center'
        }
      ],
      centerTableData: [],
      tableHeight: 500,
      centerModelShow: false,
      centerTitle: '',
      centerAddData: {
        name: '',
        ip: '0.0.0.0',
        cport: 80,
        username: 'admin',
        password: '123456',
        talkId: '0',
        talkIp: '0.0.0.0',
        _id: ''
      },
      Inselect: [],
      inSearchName: '',
      modelLoad: false,
      offLoad: false,
      // 分页
      pageInfo: {
        cur: 1,
        count: 0,
        limit: this.$PageInfo.limit
      },
      centreOffring: true,
      inselectId: ''
    }
  },
  computed: {
    ...mapState({
      alarmCenter: ({ alarmHelps }) => alarmHelps.alarmCenter
    })
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight
  },
  methods: {
    ...mapActions(['getAlarmCenter', 'addAlarmCenter', 'editAlarmCenter', 'delAlarmCenter', 'offRingAudio']),
    getAlarmCenterData() {
      this.getAlarmCenter({ page: this.pageInfo.cur, limit: this.pageInfo.limit, name: this.inSearchName })
        .then(res => {
          this.alarmCenter && (this.centerTableData = this.alarmCenter)
          this.pageInfo.count = Number(res.headers['x-bsc-count'])
          this.Inselect = []
        })
        .catch(() => {
          this.errorMsg('获取接警中心数据失败')
        })
    },
    // 列表复选
    alarmInSel(selection) {
      this.Inselect = selection
      if (selection.length !== 0) {
        this.centreOffring = false
        this.canUse = false
      } else {
        this.centreOffring = true
        this.canUse = true
      }
    },
    // 接警中心 添加、修改、删除
    openAddMod(value) {
      this.centerTitle = value
      this.centerModelShow = true
      if (this.$refs['centerAddData']) {
        this.$refs['centerAddData'].resetFields()
      }
      this.centerAddData = {
        name: '',
        ip: '0.0.0.0',
        cport: 80,
        username: 'admin',
        password: '123456',
        talkId: '0',
        talkIp: '0.0.0.0',
        _id: ''
      }
    },
    openEditMod(value) {
      if (this.Inselect.length === 1) {
        this.centerTitle = value
        this.inselectId = this.Inselect[0]._id
        this.centerModelShow = true
        this.centerAddData = {
          name: this.Inselect[0].name,
          ip: this.Inselect[0].alarmHostId.ip,
          cport: this.Inselect[0].alarmHostId.cport,
          username: this.Inselect[0].alarmHostId.username,
          password: this.Inselect[0].alarmHostId.password,
          talkId: this.Inselect[0].talkId,
          talkIp: this.Inselect[0].talkIp,
          _id: this.Inselect[0]._id
        }
      } else {
        this.warningMsg('请选择一项')
      }
    },
    portRule(rule, value, callback) {
      let data = this.centerAddData.cport
      if (data !== '' || data !== undefined) {
        if (!Number.isInteger(data)) {
          return callback(new Error('请输入数字'))
        } else {
          if (data > 65535) {
            return callback(new Error('超出范围0-65535'))
          } else {
            return callback()
          }
        }
      } else {
        return callback(new Error('端口不能为空'))
      }
    },
    // 确认 修改，添加
    editOk(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modelLoad = true
          if (this.centerTitle === '添加接警中心') {
            this.addAlarmCenter(this.centerAddData)
              .then(() => {
                this.getAlarmCenterData()
                this.modelLoad = false
                this.centerModelShow = false
              })
              .catch(err => {
                this.modelLoad = false
                const msg = {
                  ipCport: '警笛ip或端口已添加过',
                  talkId: '对讲台麦id号已添加过',
                  talkIp: '对讲台麦ip号已添加过'
                }
                if (err.response.data) {
                  Object.keys(err.response.data).forEach(n => {
                    msg[n] && this.errorMsg(msg[n])
                  })
                }
              })
          } else if (this.centerTitle === '修改接警中心') {
            let data = {
              body: this.centerAddData,
              id: this.centerAddData._id
            }
            this.editAlarmCenter(data)
              .then(() => {
                this.getAlarmCenterData()
                this.modelLoad = false
                this.centerModelShow = false
              })
              .catch(err => {
                this.modelLoad = false
                const msg = {
                  ipCport: '警笛ip或端口已添加过',
                  talkId: '对讲台麦id号已添加过',
                  talkIp: '对讲台麦ip号已添加过'
                }
                if (err.response.data) {
                  Object.keys(err.response.data).forEach(n => {
                    msg[n] && this.errorMsg(msg[n])
                  })
                }
              })
          }
        }
      })
    },
    // 取消 添加、修改
    editCancel(name) {
      this.$refs[name].resetFields()
      this.modelLoad = false
      this.centerModelShow = false
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
      }
    },
    sureDel() {
      let idList = []
      this.Inselect.map(v => {
        idList.push(v._id)
      })
      idList = idList.join(',')
      this.delAlarmCenter(idList)
        .then(() => {
          this.getAlarmCenterData()
        })
        .catch(() => {
          this.errorMsg('删除接警中心数据失败')
        })
    },
    offRing() {
      if (this.Inselect.length === 1) {
        this.offLoad = true
        let data = {
          devInfo: {
            devIp: this.Inselect[0].alarmHostId.ip,
            devPort: this.Inselect[0].alarmHostId.cport
          },
          outputList: [{ outputNo: 1, status: 'off' }, { outputNo: 2, status: 'off' }]
        }
        this.offRingAudio(data)
          .then(() => {
            this.offLoad = false
            this.successMsg('关闭成功')
          })
          .catch(() => {
            this.offLoad = false
            this.errorMsg('关闭失败')
          })
      } else {
        this.errorMsg('请勾选一个接警中心')
      }
    },
    // 搜索
    search() {
      this.getAlarmCenterData()
    },
    pageChange(n) {
      this.pageInfo.cur = n
      this.getAlarmCenterData()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.getAlarmCenterData()
    }
  },
  watch: {},
  created() {
    if (!this.$BShasPower('BS-ALARMHELP-CENTER-PAGE') && !this.$BShasPower('BS-ALARMHELP-CENTER-CONF')) {
      this.configTopList[0].isActive = false
      if (this.$BShasPower('BS-ALARMHELP-TERMINAL-PAGE') || this.$BShasPower('BS-ALARMHELP-TERMINAL-CONF')) {
        this.configTopList[1].isActive = true
        this.$router.replace(this.configTopList[1].path)
        return
      } else if (this.$BShasPower('BS-ALARMHELP-SERVER-PAGE') || this.$BShasPower('BS-ALARMHELP-SERVER-CONF')) {
        this.configBottomList[0].isActive = true
        this.$router.replace(this.configBottomList[0].path)
      }
    }
    this.getAlarmCenterData()
    this.Inselect = []
    this.canUse = true
  }
}
</script>

<style scoped>
.sidebar {
  width: 100%;
  height: auto;
}

.sidebar > a {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background-color: #0f2243;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
  width: 300px;
}

.config-list li {
  position: relative;
  cursor: pointer;
  /*transition: all .2 ease-in-out;*/
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  border-right: 2px solid transparent;
  background: #1c3053;
  border-top: 1px solid #263e69;
  border-bottom: 1px solid #263e69;
  box-shadow: 0px -1px 2px #142441 inset;
  padding: 0 0 0 40px;
}

.config-list li:hover {
  background: #2b426b;
  color: #ffffff;
}
.haha {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  height: 100%;
}
.sidebar > .config-list > .active {
  color: #4699f9;
  border-right: 2px solid #4699f9;
  background-color: #2f497a;
  z-index: 2;
}

.bs-content {
  padding: 16px !important;
  width: 100%;
  position: relative;
  display: flex;
}

.bs-mains {
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  background: #1c3053;
  min-height: 670px;
  padding: 16px 0 0 0;
}

.lf {
  float: left;
}

.rt {
  float: right;
}

.feature-btn {
  margin: 0 24px;
  height: 32px;
  line-height: 32px;
}

.feature-btn > button {
  margin-right: 8px;
  float: left;
  width: 100px;
  height: 32px;
}

.ivu-table-column-center .ivu-btn span {
  color: #57a3f3;
  font-size: 14px;
}

.page-style {
  width: 100%;
  border-top: none;
  overflow: hidden;
  padding: 5px 12px;
  background: #244575;
  font-size: 12px;
}

.table-relative {
  position: relative;
  height: calc(100% - 74px);
  margin: 0px;
  width: 100%;
}

.table-body {
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.confirm {
  position: relative;
  height: 50px;
}

.confirm-time {
  width: 200px;
  margin-left: 20px;
}
</style>
