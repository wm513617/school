<template>
  <div class="login-wrapper" v-if="!loggedIn">
    <img class="row main" :src="imgIfobac" @error="bacImgErr" />
    <div class="iconsBg">
      <div class="form-opacity">
        <div class="form-opacity-middle">
          <div class="logo-box" :style="{textAlign:'center'}">
            <img class="logo-style" :src="imgIfoLogo" />
          </div>
          <div class="text-box" :style="{textAlign:'center'}">
            <h1>{{imgIfoName}}</h1>
          </div>
        </div>
        <div class="login-form" :class="{error: loginError}">
          <div class="form-word">
            <p>
              <i>用户登录</i>
              <!--<i style="color:#999">UserLogin</i>-->
            </p>
          </div>
          <Form ref="form" style="width:400px;" :model="form" @submit.native.prevent="onSubmit">
            <div class="login-style" style="border-bottom: 1px solid #ccc">
              <div style="padding: 15px 0 0 20px">
                <i class="icon iconfont icon-admin"></i>
                <Form-item prop="username">
                  <Input type="text" @on-focus="reminder=false" v-model="form.username" placeholder="请输入登录账户">
                  </Input>
                </Form-item>
              </div>
            </div>
            <div class="login-style">
              <div style="padding: 15px 0 0 20px">
                <i class="icon iconfont icon-password"></i>
                <Form-item prop="password">
                  <Input type="password" @on-focus="reminder=false" v-model="form.password" placeholder="请输入登录密码">
                  </Input>
                </Form-item>
              </div>
            </div>
            <Form-item>
              <Button class="login-button" html-type="submit" :loading="loading" type="primary">{{$t('login.button')}}</Button>
            </Form-item>
          </Form>
        </div>
        <span v-if="reminder" class="reminder-title">{{reminderText}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import './login.css'
import { mapState, mapGetters, mapActions } from 'vuex'
import locales from 'locales/login'
import doorControlJSON from 'assets/2DMap/meta/doorcontrol.json'
export default {
  locales,
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      imgIfoName: '',
      imgIfobac: '',
      imgIfoLogo: '',
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { validator: validatePass, trigger: 'change' },
          { validator: validatePass, trigger: 'blur' }
        ],
        password: [
          { validator: validatePassCheck, trigger: 'change' },
          { validator: validatePassCheck, trigger: 'blur' }
        ]
      },
      reminderText: '',
      reminder: false,
      loading: false,
      loginError: false
    }
  },
  computed: {
    ...mapState({
      loginText: ({user}) => user.loginText
    }),
    ...mapGetters(['loggedIn'])
  },
  watch: {
    loginText(val) {
      this.reminder = true
      this.reminderText = val
    }
  },
  methods: {
    ...mapActions(['loginFun', 'getLoginImg', 'getPlatform']),
    bacImgErr(e) {
      e.target.src = '/static/image/home/login.png'
    },
    onSubmit() {
      if (this.form.username === '' || this.form.password === '') {
        this.reminderText = '请插入Ukey或输入用户名、密码。'
        this.reminder = true
        this.loading = false
      } else {
        this.loginFun({
          name: this.form.username.replace(/(^\s*)|(\s*$)/g, ''),
          pwd: this.$CryptoJS.MD5(this.form.password.replace(/(^\s*)|(\s*$)/g, '')).toString()
        }).then((data) => {
          this.loading = true
          if (data.code) {
            if (data.code === 505) {
            } else if (data.code === 200) {
              // ---------------------------------------添加门禁假数据到localStorage中-----------------------------------------
              let dcTree = window.localStorage.getItem('dcTree')
              if (!dcTree) {
                window.localStorage.setItem('dcTree', JSON.stringify(doorControlJSON))
              }
              // --------------------------------------------------------------------------------
              document.cookie = 'Authorization=Bearer ' + data.access_token
              this.$store.commit('SET_MAINMENU', data.actionTree)
              this.$router.replace('/navigation')
              this.getPlatform().then((suc) => {
              }).catch((err) => {
                console.log('this.getPlatform:' + err)
              })
            }
          } else {
            this.reminderText = data.msg
            this.reminder = true
            this.loading = false
          }
        }).catch((err) => {
          this.reminderText = '登录服务出错'
          this.reminder = true
          console.log('login err:' + err)
          this.loading = false
          this.loginError = true
          setTimeout(() => {
            this.loginError = false
          }, 500)
        })
      }
    }
  },
  created() {
    this.getLoginImg().then((suc) => {
      this.imgIfoLogo = suc.data.logo || '/static/image/home/logoMenu.png'
      this.imgIfobac = suc.data.loginimg || '/static/image/home/login_bg.png'
      this.imgIfoName = suc.data.name || '校园监控综合管理平台'
    }
    ).catch(err => {
      this.imgIfoLogo = '/static/image/home/logoMenu.png'
      this.imgIfobac = '/static/image/home/login_bg.png'
      this.imgIfoName = '校园监控综合管理平台'
      console.log('get loging theme err:' + err)
    })
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/variable';

@input-width: 15rem;

.reminder-title {
  float: left;
  margin-top: 6px;
  color: #ed3f14;
  font-size: 14px;
}

.logo-style {
  width: 367px;
  height: 52px;
}

.login-wrapper {
  align-self: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.remind-box {
  font-size: 16px;
  height: 30px;
  margin: 40px 0 40px 60px;
}

.main {
  height: 100%;
  width: 100%;
}

.form-opacity {
  width: 360px;
  height: 270px;
  position: absolute;
  // left: calc(~'50% - 165px');
  // top: calc(~'45% - 130px');
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.logo-box {
  width: 460px;
  padding: 10px 0;
}

.text-box {
  width: 460px;
  padding-bottom: 20px;
}

.save-pass {
  margin-bottom: 10px;
}

.bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: 100%;

  > h1 {
    position: relative;
    margin: 0 0 1rem;
    text-align: center;
    z-index: 1;
  }

  > form {
    width: @input-width;
    margin: 0 auto;

    .el-input__inner {
      color: @color-black-exact-light;
      border-color: @color-silver-light;
      background-color: transparent;

      &:focus {
        color: @color-black;
        border-color: @color-black;
      }
    }
  }
}
.login-button {
  width: 100%;

  &.error {
    animation: shake 0.5s;
  }
}

.logo {
  height: 26px;
  width: 300px;
}

.form-opacity .ivu-input-group-prepend {
  height: 30px;
}

.form-opacity .ivu-input {
  height: 30px;
}

.login-form {
  overflow: hidden;
  width: 400px;
  height: 330px;
  background: #fff;
  border-radius: 10px;

  .form-word {
    height: 100px;
    color: #000;
    border-bottom: 1px solid #ccc;
  }

  .form-word p {
    padding: 0 0 0 20px;
    line-height: 100px;
  }

  .form-word p i {
    float: left;
    font-style: normal;
    padding-right: 10px;
    font-size: 16px;
  }

  .login-input {
    height: 85px;
    border-bottom: 1px solid #000;
  }

  .login-btn {
    height: 60px;
    background: #0284d7;
  }

  .ivu-btn {
    height: 60px;
    width: 400px;
    background: #3f6789;
  }

  .ivu-btn-primary:hover {
    background-color: #5680b3;
  }

  .ivu-btn:hover {
    background: #52afeb;
    color: #ffffff;
  }
}

.login-style {
  height: 85px;
}

.login-style i {
  display: block;
  width: 20px;
  height: 20px;
  color: #999;
  margin-bottom: 10px;
}
.form-opacity-middle {
  position: absolute;
  top: -46%;
  left: -9%;
}
</style>
