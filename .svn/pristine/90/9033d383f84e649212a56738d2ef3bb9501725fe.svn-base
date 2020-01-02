<template>
  <div class="info-style userInfo">
    <div class="user-form">
      <Form ref="userValidate" :rules="userValidate" :model="formItem" label-position="left" :label-width="86" inline>
        <FormItem label="用户名" class="item-style" prop="name">
          <Input :disabled="isSuper" v-model="formItem.name" class="input-style"></Input>
        </FormItem>
        <FormItem label="密码" class="item-style">
          <Input type="password" disabled v-model="formItem.password" class="input-style"></Input>
          <Button type="ghost" class="btn-style" :disabled="isDisabled" @click="resetShow = true">重置</Button>
        </FormItem>
        <FormItem label="真实姓名" class="item-style" prop="realName">
          <Input v-model="formItem.realName" class="input-style"></Input>
        </FormItem>
        <FormItem label="角色" class="item-style" prop="role">
          <Select :disabled="isSuper" v-model="formItem.role" class="input-style">
            <Option v-for="item in roleList" :value="item._id" :key="item._id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="级别" class="item-style" prop="rank">
          <Select :disabled="isSuper" v-model="formItem.rank" class="input-style">
            <Option v-for="item in 9" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="制作Ukey" class="item-style">
          <Button :disabled="userId === ''" @click="ukeyShow = true">生成Ukey</Button>
        </FormItem>
        <FormItem label="有效期" class="item-style" style="margin-right: 44px;">
          <DatePicker :disabled="isSuper || picker" type="date" v-model="formItem.date" class="input-style"></DatePicker>
          <Checkbox :disabled="isSuper" v-model="formItem.Indefinitely" @on-change="checkChange" class="btn-style">无限期</Checkbox>
        </FormItem>
        <FormItem label="启用交接班" class="item-style">
          <Checkbox :disabled="isSuper" v-model="formItem.duty"></Checkbox>
        </FormItem>
      </Form>
    </div>
    <Button type="primary" class="save-style" :disabled="isDisabled" @click="editUserAffirm('userValidate')">保存</Button>
    <Modal :mask-closable="false" v-model="resetShow" width="450" title="重置密码" @on-cancel="resetCancel('pwdValidate')">
      <Form ref="pwdValidate" :rules="pwdValidate" :model="resetForm" label-position="left" :label-width="90">
        <FormItem label="设置密码：" prop="password">
          <Input type="password" v-model="resetForm.password"></Input>
        </FormItem>
        <FormItem label="确认密码：" prop="repeatPwd">
          <Input type="password" v-model="resetForm.repeatPwd"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="resetCancel('pwdValidate')" type="ghost">取消</Button>
        <Button @click="resetAffirm('pwdValidate')" type="primary">确认</Button>
      </div>
    </Modal>
    <Modal class="creat-modal" :mask-closable="false" v-model="ukeyShow" width="550" title="生成Ukey" @on-cancel="ukeyCancel">
      <div class="top-style">
        <Button type="ghost" @click="testUkey">检测Ukey</Button>
        <span>请确认Ukey已插入本地电脑，并可正常识别...</span>
      </div>
      <div class="list-style">
        <ul>
          <li :class="{'li-active': item.id === selUkeyId}" v-for="item in ukeyList" :key="item.name" @click="ukeySelect(item)">
            <span class="name-style">{{item.name}}</span>
            <span class="status-style">{{item.status}}</span>
          </li>
        </ul>
      </div>
      <div class="btm-style">
        <Button type="ghost" :disabled="writeState" @click="writeUkey">生成Ukey</Button>
        <Progress class="progress-style" :percent="percentNum" :stroke-width="12"></Progress>
      </div>
      <div slot="footer">
        <Button type="primary" @click="ukeyCancel">退出</Button>
      </div>
    </Modal>
    <Modal class="creat-modal" v-model="isShowUkeyModal" width="350" title="提示"  @on-ok="closeUkey" @on-cancel="openUkey">
        <p>
          本Ukey已授权，是否重新授权？
        </p>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import FormValidate from '../formValidate.js'
import '../role/role.css'
import moment from 'moment'
export default {
  name: 'userInfo',
  props: {
    userId: {
      type: String,
      default: ''
    }
  },
  mixins: [FormValidate],
  data() {
    return {
      isShowUkeyModal: false,
      resetShow: false,
      ukeyShow: false,
      isSuper: false,
      picker: false,
      writeState: true,
      isDisabled: true,
      percentNum: 0,
      roleList: [],
      formItem: {
        name: '',
        password: '',
        realName: '',
        role: '',
        rank: '',
        date: '',
        ukey: '',
        Indefinitely: false
      },
      resetForm: {
        password: '',
        repeatPwd: ''
      },
      ukeyList: [],
      selUkeyId: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: ({userManage}) => userManage.userInfo,
      roleArr: ({roleManage}) => roleManage.roleArr
    }),
    ...mapGetters(['userDetails'])
  },
  watch: {
    userId(val) {
      this.getUserDetails()
    },
    ukeyList(val) {
      this.writeState = val.length === 0
    }
  },
  created() {
    this.getRoleSol()
    this.getPolicy()
  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'editUserInfo',
      'getRoleList',
      'programmerUkey',
      'monitorUkey',
      'getkeyUser'
    ]),
    /**
     * 重置密码取消
     * @method resetCancel
     * @param {string} name 表单ref
     */
    resetCancel(name) {
      this.$refs[name].resetFields()
      this.resetShow = false
    },
    /**
     * 重置密码确认
     * @method resetAffirm
     * @param {string} name 表单ref
     */
    resetAffirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.formItem.password = this.$CryptoJS.MD5(this.resetForm.password).toString()
          let param = {
            id: this.userId,
            data: {
              name: this.formItem.name,
              pwd: this.formItem.password,
              realName: this.formItem.realName,
              exptime: this.picker ? -1 : moment(this.formItem.date).format('X'),
              level: this.formItem.rank,
              role: this.formItem.role,
              ukey: this.formItem.ukey,
              duty: this.formItem.duty ? 'yes' : 'no'
            }
          }
          this.editUserInfo(param).then(suc => {
            this.getUserDetails()
            this.successMsg('保存成功')
          }).catch(err => {
            console.log(err)
            this.errorMsg('保存失败')
          })
          this.resetShow = false
          this.resetForm = {
            password: '',
            repeatPwd: ''
          }
        } else {
          this.warningMsg('请完善用户信息')
        }
      })
    },
    /**
     * 复选框选中状态
     * @method checkChange
     * @param {Boolean} state 表单ref
     */
    checkChange(state) {
      if (state) {
        this.formItem.date = ''
        this.picker = true
      } else {
        this.picker = false
      }
    },
    /**
     * 确认修改用户
     * @method editUserAffirm
     * @param {string} name 表单ref
     */
    editUserAffirm(name) {
      this.$refs[name].validate((valid) => {
        if (valid && (this.picker || this.formItem.date)) {
          let param = {
            id: this.userId,
            data: {
              name: this.formItem.name,
              pwd: this.formItem.password,
              realName: this.formItem.realName,
              exptime: this.picker ? -1 : moment(this.formItem.date).format('X'),
              level: this.formItem.rank,
              role: this.formItem.role,
              ukey: this.formItem.ukey,
              duty: this.formItem.duty ? 'yes' : 'no'
            }
          }
          this.editUserInfo(param).then(suc => {
            this.getUserDetails()
            this.$emit('updateListData', true)
            this.successMsg('保存成功')
          }).catch(err => {
            console.log(err)
            this.errorMsg('保存失败')
          })
        } else {
          this.warningMsg('请完善用户信息')
        }
      })
    },
    /**
     * 生成Ukey取消
     * @method ukeyCancel
     */
    ukeyCancel() {
      this.ukeyShow = false
      this.ukeyList = []
      this.percentNum = 0
    },
    /**
     * 获取用户详情
     * @method getUserDetails
     */
    getUserDetails() {
      this.getUserInfo(this.userId).then(suc => {
        this.isDisabled = false
        this.formItem = this.userDetails
        this.picker = this.formItem.Indefinitely ? Boolean(1) : Boolean(0)
        this.isSuper = this.formItem.name === 'admin'
      }).catch(err => {
        this.isDisabled = true
        console.log(err)
      })
    },
    /**
     * 获取角色列表
     * @method getRoleSol
     */
    getRoleSol() {
      this.getRoleList().then(suc => {
        this.roleList = this.roleArr
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 用户删除后清空内容
     * @method deleteUser
     */
    deleteUser() {
      this.formItem = {
        name: '',
        password: '',
        realName: '',
        role: '',
        rank: '',
        date: '',
        Indefinitely: false,
        duty: false
      }
    },
    /**
     * 检测Ukey
     * @method testUkey
     */
    testUkey() {
      this.monitorUkey().then(suc => {
        this.ukeyList = []
        let keys = []
        suc.map(item => {
          keys.push(item.key)
        })
        this.getkeyUser(keys).then(res => {
          const keyUser = res.data
          suc.map(item => {
            this.ukeyList.push({
              name: keyUser[item.key] ? keyUser[item.key].name : item.id,
              status: keyUser[item.key] ? '已授权' : '未授权',
              key: item.key,
              id: item.id
            })
          })
        }).catch(err => {
          console.log('getkeyUser', err)
        })
      }).catch(err => {
        console.log('monitorUkey', err)
      })
    },
    /**
     * 写入Ukey
     * @method writeUkey
     */
    writeUkey() {
      if (this.selUkeyId && this.ukeyList) {
        this.ukeyList.map(item => {
          if (item.id === this.selUkeyId && item.status === '已授权') {
            this.isShowUkeyModal = true
            this.ukeyShow = false
          } else {
            this.programmerUkey(this.selUkeyId).then(suc => {
              this.formItem.ukey = suc[0].key
              this.percentNum = 100
            }).catch(err => {
              console.log(err)
            })
          }
        })
      } else {
        this.warningMsg('请选择要写入的Ukey')
      }
    },
    closeUkey() {
      this.programmerUkey(this.selUkeyId).then(suc => {
        this.ukeyShow = true
        this.formItem.ukey = suc[0].key
        this.percentNum = 100
      }).catch(err => {
        console.log(err)
      })
    },
    openUkey() {
      this.ukeyShow = true
    },
    /**
     * 选择Ukey
     * @method ukeySelect
     * @param {Object} item ukey信息
     */
    ukeySelect(item) {
      this.selUkeyId = item.id
    }
  }
}
</script>
<style lang="less" scoped>
.public {
  margin-left: 50px;
  color: #c42847;
}
.info-style {
  padding: 24px 50px 24px;
  .user-form {
    width: 960px;
    .item-style {
      margin-right: 120px;
      .input-style {
        width: 236px;
      }
      .btn-style {
        margin-left: 10px;
      }
    }
  }
  .save-style {
    margin-left: 727px;
  }
}
.creat-modal {
  .top-style span {
    .public;
  }
  .list-style {
    margin: 10px 0;
    height: 150px;
    border: 1px solid #fff;
    li {
      height: 26px;
      line-height: 26px;
      cursor: pointer;
      .name-style {
        display: inline-block;
        width: 40%;
        padding-left: 10px;
      }
      .status-style {
        display: inline-block;
        width: 50%;
      }
    }
    .li-active {
      background-color: #3c5073;
    }
  }
  .btm-style {
    span {
      .public;
    }
    .progress-style {
      margin-top: 10px;
    }
  }
}
</style>
