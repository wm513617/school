<template>
  <div class="bs-content" id="manageID">
    <div class="bs-left">
      <div class="tree-content">
      <BsOrgTree @call="clickTree" :orgType="3" orgTitle="机构" :isSetting="$BShasPower('BS-SETTING-SOLDIER-ORG')"></BsOrgTree>
      </div>
      <div class="sidebar">
        <Menu theme="dark" width="100%" @on-select="isNowPathActive" :active-name="route">
          <Menu-group title="定点报警设置">
            <Menu-item name="/soldier/manage/alarmPoint" style="text-align:left;">
              时间与偏移设置
            </Menu-item>
          </Menu-group>
        </Menu>
      </div>
    </div>
    <AlarmSteeing v-show="state"></AlarmSteeing>
    <div v-show="!state" class="bs-main" ref="tableBox">
      <div class="table-header">
        <Button class="ghost" type="ghost" v-if="$BShasPower('BS-SETTING-SOLDIER-MANAGE')" icon="plus" @click="add" :disabled="isRootOrg">添加</Button>
        <Button class="ghost" type="ghost" v-if="$BShasPower('BS-SETTING-SOLDIER-MANAGE')" icon="trash-a" @click="delModel" :disabled="isRemove">删除</Button>
        <Button class="ghost" type="ghost" icon="refresh" @click="fresh">刷新</Button>
        <div class="actions-search">
          <Input placeholder="支持按用户名、姓名、工号查询" icon="ios-search-strong" @on-click="searchList(1)" v-model="searchString" style="width: 240px">
          </Input>
        </div>
      </div>
      <div class="table-content">
        <div class="table-body">
          <Table :height="tableHeight" size="small" :highlight-row="true" :columns="columns" :data="userData.list" @on-selection-change="selectChange"></Table>
        </div>
      </div>
      <div class="table-footer">
        <div style="float: right;">
          <Page show-total show-elevator show-sizer :total="userData.count" :current="userData.curPage" :page-size='userData.limit' @on-change="changePage" :page-size-opts="$PageInfo.size" @on-page-size-change="sizeChange"></Page>
        </div>
      </div>
    </div>
    <UserModal ref="UserModal" :modalShow="modalShow" :isEdit="isEdit" :getUserList="formData" :orgActiveName="orgActiveName" @save="saveData" @cancel="cancelData"></UserModal>
    <!-- 重置密码的弹窗 -->
    <Modal :mask-closable="false" v-model="resetModal" width="360" title="重置密码" @on-cancel="cancel('infoReset')">
      <div style="display:flex;">
        <div class="modal-left">
          <Form ref="infoReset" :model="passReset" :rules="ruleValidate" :label-width="80" label-position="left">
            <Form-item label="密码" prop="pwd">
              <Input type="password" v-model.trim="passReset.pwd"></Input>
            </Form-item>
            <Form-item label="确认密码" prop="repwd">
              <Input type="password" v-model.trim="passReset.repwd"></Input>
            </Form-item>
          </Form>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="cancel('infoReset')">取消</Button>
        <Button type="primary" @click="save('infoReset')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import BsOrgTree from '../../components/DevBSorgTree.vue'
import UserModal from './modal/userModal'
import AlarmSteeing from './alarmSetting'
import { mapState, mapActions, mapMutations } from 'vuex'
import './row.css'
export default {
  components: {
    BsOrgTree,
    UserModal,
    AlarmSteeing
  },
  data() {
    // 密码
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        let reg = /^([A-Za-z0-9]){6,12}$/
        if (!reg.test(value)) {
          callback(new Error('6-12位数字或者字母'))
        } else {
          callback()
        }
      }
    }
    // 确认密码
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passReset.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      route: '',
      // 页数限制
      pageLimit: this.$PageInfo.limit,
      // 添加还是修改
      isEdit: false,
      // 弹窗显示
      modalShow: false,
      tableHeight: 435,
      // 弹窗数据
      formData: {
        pictureLogin: true,
        selectedColor: '#D0021B',
        disabledGroup: true,
        carLogin: false,
        passWordLogin: true,
        username: '',
        password: '',
        pwdCheck: '',
        realname: '',
        phone: '',
        nfc: '',
        id: '',
        position: '',
        affiliation: this.orgActiveId,
        status: '1',
        photo: '',
        period: {
          unlimited: true,
          expried: this.$moment(new Date().setMonth(new Date().getMonth() + 1)).format('YYYY-MM-DD')
          // new Date().setMonth(new Date().getMonth() + 1)
        }
      },
      columns: [
        {
          type: 'selection',
          align: 'left'
        },
        {
          title: '序号',
          align: 'left',
          type: 'index'
        },
        {
          title: '用户名称',
          key: 'username',
          align: 'left',
          ellipsis: true
        },
        {
          title: '真实姓名',
          key: 'realname',
          align: 'left',
          ellipsis: true
        },
        {
          title: '工号',
          key: 'id',
          align: 'left',
          ellipsis: true
        },
        {
          title: '状态',
          key: 'status',
          align: 'left',
          render: (h, params) => {
            let rowStatus = params.row.status === 1 ? '启用' : '禁用'
            return h('span', rowStatus)
          }
        },
        {
          title: '到期时间',
          key: 'expries',
          align: 'left',
          render: (h, params) => {
            // period: {
            //   unlimited: true,
            //   expried: new Date().setMonth(new Date().getMonth() + 1)
            // }
            let date = ''
            if (params.row.period.unlimited) {
              date = '无期限'
            } else {
              date = this.$moment(params.row.period.expried * 1000).format('YYYY-MM-DD')
            }
            return h('span', date)
          }
        },
        {
          title: '职务',
          key: 'position',
          align: 'left',
          ellipsis: true
        },
        {
          title: '机构',
          key: 'affiliation',
          align: 'left',
          render: (h, params) => {
            return h('span', params.row.affiliation.name)
          }
        },
        {
          title: '操作',
          key: 'operate',
          width: 200,
          align: 'left',
          render: (h, params) => {
            // const buttonColor = (params.row.userName === 'admin') ? true : false // 修改按钮禁用
            return h('div', [
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small',
                  disabled: !this.$BShasPower('BS-SETTING-SOLDIER-MANAGE')
                  // loading: params.row.loading
                },
                //  || !this.modPower
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params.row._id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small',
                  disabled: !this.$BShasPower('BS-SETTING-SOLDIER-MANAGE')
                },
                style: {
                  marginRight: '5px'
                },
                //  || !this.delPower
                on: {
                  click: (e) => {
                    e.stopPropagation()
                    this.checkAll = [params.row._id]
                    this.delModel()
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small',
                  disabled: !this.$BShasPower('BS-SETTING-SOLDIER-MANAGE')
                },
                on: {
                  click: () => {
                    this.openReset(params.row._id)
                  }
                }
              }, '重置密码')
            ])
          }
        }
      ],
      isRemove: true,
      checkAll: [],
      // 重置密码 窗口的显示
      resetModal: false,
      resetId: '',
      passReset: {
        pwd: '',
        repwd: ''
      },
      ruleValidate: {
        pwd: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        repwd: [
          { required: true, validator: validatePassCheck, trigger: 'change' }
          // { validator: validatePassCheck, trigger: 'change' }
        ]
      },
      searchString: '',
      isSearch: false,
      state: false
    }
  },
  computed: {
    ...mapState({
      userData: ({ sentry }) => sentry.userData,
      userDataOne: ({ sentry }) => sentry.userDataOne,
      orgActiveId: ({ orgSetting }) => orgSetting.orgActiveId,
      orgActiveName: ({ orgSetting }) => orgSetting.orgActiveName,
      isRootOrg: ({ orgSetting }) => orgSetting.isRootOrg
    })
  },
  methods: {
    ...mapActions(['addNewUserTo', 'getUserList', 'getUserOne', 'addUser', 'editUser', 'deleteUser', 'resetPassword', 'getSeekUserList', 'clearUserList']),
    clickTree() {
      this.route = ''
      this.state = false
      this.getUserData(1)
    },
    // 定点报警配置
    isNowPathActive(name) {
      this.state = true
      this.$router.replace(name)
      this.route = name
      this.clearUserList()
    },
    // 获取userList
    getUserData(num) {
      this.getUserList({
        page: num,
        limit: this.pageLimit
      }).then(() => { }).catch((err) => {
        this.errorMsg(err.response.data.message)
        console.log('getUserList error: ' + err)
      })
    },
    // 点击添加
    add() {
      this.isEdit = false
      this.modalShow = true
      this.formData = {
        selectedColor: '##D0021B',
        pictureLogin: true,
        carLogin: false,
        passWordLogin: true,
        username: '',
        password: '',
        pwdCheck: '',
        realname: '',
        phone: '',
        nfc: '',
        id: '',
        position: '',
        affiliation: this.orgActiveId,
        status: '1',
        photo: '',
        period: {
          unlimited: true,
          expried: this.$moment(new Date().setMonth(new Date().getMonth() + 1)).format('YYYY-MM-DD')
          // new Date().setMonth(new Date().getMonth() + 1)
        }
      }
    },
    delModel() {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除所选用户吗？</p>',
        onOk: () => { this.remove() },
        onCancel: () => { }
      })
    },
    // 删除
    remove() {
      this.deleteUser(this.checkAll).then((res) => {
        this.checkAll = []
        this.isRemove = true
        this.getUserData(1)
        this.successMsg('用户已删除')
      }).catch((err) => {
        this.errorMsg(err)
        console.log('deletePoint error: ' + err)
      })
    },
    // 点击修改
    edit(id) {
      this.getUserOne(id).then((res) => {
        this.isEdit = true
        this.modalShow = true
        delete this.userDataOne.createdAt
        delete this.userDataOne.updatedAt
        let userData = JSON.parse(JSON.stringify(this.userDataOne))
        // this.formData.pwdCheck = this.userDataOne.password
        // 状态,时间转换
        if (userData.period.unlimited) {
          let dataTime = this.$moment(new Date().setMonth(new Date().getMonth() + 1)).format('YYYY-MM-DD')
          userData.period.expried = dataTime
          userData.period.unlimited = true
        } else {
          let time = this.$moment(userData.period.expried * 1000).format('YYYY-MM-DD')
          userData.period.expried = time
          userData.period.unlimited = false
        }
        let status = userData.status.toString()
        userData.status = status
        this.formData = JSON.parse(JSON.stringify(userData))
      }).catch((err) => {
        // this.errorMsg(err)
        console.log('getPointOne error: ' + err)
      })
      // this.formData = JSON.parse(JSON.stringify(param.row))
    },
    // 添加及修改 的弹窗取消
    cancelData() {
      this.modalShow = false
    },
    // 添加及修改 的弹窗确定
    saveData(data, name) {
      // 状态,时间转换
      let info = JSON.parse(JSON.stringify(data))
      delete info.pwdCheck
      let status = Number(data.status)
      info.status = status
      if (data.period.unlimited) {
        delete info.period.expried
      } else {
        let dataTime = Date.parse(new Date(this.$moment(data.period.expried).format('YYYY/MM/DD HH:mm:ss'))) / 1000
        info.period.expried = dataTime
        delete info.period.unlimited
      }
      if (!this.isEdit) {
        this.addUser(info).then(() => {
          this.modalShow = false
          this.$refs['UserModal'].$refs[name].resetFields()
          this.successMsg('用户添加成功')
          this.getUserData(1)
        }).catch((err) => {
          this.errorMsg(err.response.data.message)
          console.log('add error: ' + err)
        })
      } else {
        let _id = info._id
        delete info._id
        this.editUser({ object: info, _id: _id }).then(() => {
          this.modalShow = false
          this.successMsg('用户信息修改成功')
          this.$refs['UserModal'].$refs[name].resetFields()
          this.getUserData(1)
        }).catch((err) => {
          this.errorMsg(err.response.data.message)
          console.log('edit error: ' + err)
        })
      }
    },
    // 页码改变
    changePage(n) {
      if (this.isSearch) {
        this.searchList(n)
      } else {
        this.getUserData(n)
      }
    },
    // 切换每页条数时的回调，返回切换后的每页条数
    sizeChange(size) {
      this.pageLimit = size
      this.changePage(1)
    },
    // 复选变化
    selectChange(val) {
      this.checkAll = []
      for (let item of val) {
        this.checkAll.push(item._id)
      }
      if (this.checkAll.length > 0) {
        this.isRemove = false
      } else {
        this.isRemove = true
      }
    },
    // 重置密码
    openReset(id) {
      this.resetModal = true
      this.resetId = id
    },
    cancel(name) {
      this.$refs[name].resetFields()
      this.resetModal = false
    },
    save(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.resetPassword({ object: this.passReset, id: this.resetId }).then((suc) => {
            this.resetModal = false
            this.successMsg('密码重置成功')
            this.$refs[name].resetFields()
          }).catch((err) => {
            console.log('resetPassword error: ' + err)
            this.errorMsg(err.response.data.message)
          })
        }
      })
    },
    // 刷新
    fresh() {
      this.getUserData(1)
      this.checkAll = []
      this.isRemove = true
    },
    // 搜索
    searchList(num) {
      this.isSearch = true
      this.getSeekUserList({
        page: num,
        limit: this.pageLimit,
        type: 3,
        seek: this.searchString
      }).then(() => { }).catch((err) => {
        this.errorMsg(err.response.data.message)
        console.log('getSeekUserList error: ' + err)
      })
    }
  },
  created() {
    // this.$BShasPower('BS-SOLDIER-POINT-ADD')
  },
  mounted() {
    this.tableHeight = this.$refs['tableBox'].offsetHeight - 96
  }
}
</script>

<style  scoped>
.bs-main {
  flex-direction: column;
  background: #1c3053;
}
.tree-content {
  height: 640px;
}
.sidebar {
  height: auto;
}
.table-header {
  /* margin: 10px; */
  padding: 12px 24px;
}

.table-header .ghost {
  margin-right: 8px;
  height: 32px;
}

.actions-search {
  float: right;
  /* margin-top: 9px; */
}
.table-content {
  position: relative;
  flex: 1;
}
</style>
