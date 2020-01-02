<template>
  <div v-if="showModal" id="showModal" class="pull-down-password pull-down-change">
    <iframe v-if="showModal"></iframe>
    <div class="modal-mask-alert"></div>
    <div class="list-box">
      <div class="password-header">
        <span style="padding:10px;display:inline-block">修改密码</span>
        <span @click='closeAlert' class="password-close" style="float:right;cursor:pointer;padding:10px;display:inline-block">
          <Icon type="close-round"></Icon>
        </span>
      </div>
      <div class="password-body">
        <Form :rules="pwdValidate" ref="pwdValidate" label-position="top" :model="resetForm">
          <Form-item label="旧密码" prop="oldPassword">
            <Input type="password" placeholder="请输入旧密码" v-model.trim="resetForm.oldPassword" :maxlength="16"></Input>
          </Form-item>
          <Form-item label="新密码" prop="password">
            <Input type="password" placeholder="请输入新密码" v-model.trim="resetForm.password" :maxlength="16"></Input>
          </Form-item>
          <div style="margin-bottom:15px;width:458px">
            <verify-password :password="resetForm.password"></verify-password>
          </div>
          <Form-item label="密码确认" prop="repeatPwd">
            <Input type="password" placeholder="请输入新密码" v-model.trim="resetForm.repeatPwd" :maxlength="16"></Input>
          </Form-item>
          <Form-item>
            <Button style="float:right;margin:5px 50px 30px 0;width:100px" ref="changeButton" @click.native="changePassword" type="primary">保存</Button>
            <Button style="float:right;margin:5px 15px 30px 0;width:100px" @click.native="goLogin" type="ghost">返回登录</Button>
          </Form-item>
        </Form>
      </div>
      <!-- <div class="password-footer">
        <Button style="float:right;margin:5px 50px 30px 0;width:100px" @click.native="changePassword" type="primary">保存</Button>
        <Button style="float:right;margin:5px 15px 30px 0;width:100px" @click.native="doLogout" type="ghost">返回登录</Button>
      </div> -->
    </div>
  </div>
</template>
<script>
import './theme.css'
import VerifyPassword from '../VerifyPassword.vue'
import { read } from '../../storage/index.js'
import { mapState, mapActions } from 'vuex'
import FormValidate from '../../view/settings/user/formValidate.js'
// import { runMain } from 'module';
export default {
  components: {
    VerifyPassword
  },
  mixins: [FormValidate],
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resetForm: {
        oldPassword: '',
        password: '',
        repeatPwd: ''
      },
      loginUserId: read('userId'),
      userInfor: {}
    }
  },
  computed: {
    ...mapState({
      userMessage: ({ userManage }) => userManage.userMessage
    })
  },
  created() {
    this.getPolicy()
  },
  methods: {
    ...mapActions(['getUserInfor', 'setUserInfor', 'editPwd']),
    goLogin() {
      this.closeAlert()
      this.doLogout()
    },
    changePassword() {
      const obj = {
        data: {
          oldPwd: this.$CryptoJS.MD5(this.resetForm.oldPassword).toString(),
          pwd: this.$CryptoJS.MD5(this.resetForm.password).toString()
        },
        id: read('userId')
      }
      this.$refs.pwdValidate.validate((valid) => {
        if (valid) {
          this.editPwd(obj).then(res => {
            // console.log('修改密码===》', res)
            if (res.data.code === 1) {
              this.$Notice.success({ title: '提示', desc: '修改成功！' })
              this.closeAlert()
              this.doLogout()
            } else {
              this.$Notice.error({ title: '失败', desc: res.data.msg })
              // this.closeAlert()
            }
          }).catch(err => {
            console.log('修改密码错误了===>', err)
          })
        } else {
          console.log('验证失败!')
        }
      })
    },
    // 关闭弹框
    closeAlert() {
      this.resetForm = {
        oldPassword: '',
        password: '',
        repeatPwd: ''
      }
      this.$emit('closeAlert')
    },
    // 退出登录
    doLogout() {
      this.$emit('doLogout')
    }
  }
}
</script>
<style lang='less' scoped>
.modal-mask-alert {
  position: fixed;
  min-width: 1200px;
  z-index: 1;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0f1e3d;
  filter: alpha(Opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
}
.pull-down-change {
  width: 500px;
  height: 400px;
}

.pull-down-password {
  position: absolute;
  z-index: 999999;
  position: absolute;
  left: calc(50%);
  margin-left: -165px;
  top: 160px;
}

.pull-down-password iframe,
.pull-down-password .list-box {
  border-radius: 5px;
  background-color: #1c3053;
  position: absolute;
  z-index: 3;
  font-size: 14px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #0f1e3d;
}

.password-header {
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #fff;
  background-color: #0f2343;
}
.pull-down-edition {
  position: absolute;
  z-index: 999999;
  top: 70px;
  right: 225px;
  height: 83px;
  width: 210px;
}

.pull-down-edition .list-box {
  padding: 10px;
  z-index: 2;
  background-color: #3c5073;
  position: absolute;
  z-index: 3;
  font-size: 12px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #3c5073;
  border-radius: 5px;
}

.theme-container {
  min-width: 1400px;
  height: 72px;
  position: relative;
  z-index: 9998;
}

.password-body{
  margin: 20px;
}
</style>
