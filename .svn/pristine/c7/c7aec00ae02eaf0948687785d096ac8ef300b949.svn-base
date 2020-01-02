<template>
  <div class="noue-box">
    <!-- <div class="header" :style="{fontStyle:fontItalic,backgroundColor:uploadColor,fontWeight:fontRegular}">
      <div class="header-box">
        <img class="logo-img" :src="imgIfoLogo" alt="">
        <div class="row-line"></div>
        <p class="log-text">{{imgIfoName}}</p>
      </div>
      <div class="userinfo">
        <Dropdown @on-click="clickItem" trigger="click" style="margin-left: 20px">
          <span style="fontSize:30px" class="icon iconfont icon-admin"></span>
          <DropdownMenu slot="list">
            <DropdownItem name="change">&nbsp;&nbsp;&nbsp;修改密码</DropdownItem>
            <DropdownItem name="exit">&nbsp;&nbsp;&nbsp;退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div> -->
    <theme></theme>
    <div class="body">
      <div class="body-bac">
        <div class="profession-box" v-if="mainMenu[0] && mainMenu[0].children && mainMenu[0].children.length">
          <div class="profession-title">
            <div class="title-box1">
              <div class="line-top"></div>
              <div class="line-bottom"></div>
            </div>
            <div class="title-box2">
              <div class="line-top"></div>
              <div class="line-bottom"></div>
            </div>
            <h1>{{mainMenu[0].name}}</h1>
          </div>
          <div class="profession-content" align="center" @mouseenter.stop="showAplia = true" @mouseleave.stop="showAplia = false">
            <div :class="['profession-content-icon', showAplia ? (curAppPage === 0 ? 'disabled' : '') : 'disabled']">
              <i class="iconfont icon-jiantou-copy icon-left" @click="aplicationLeft"></i>
            </div>
            <div class="profession-content-box" align="left">
              <div class="list-item" v-for="menu in applicationArr[curAppPage]" :key="menu.tag">
                <div :class="{'selectcolor': momentCheck === menu.tag}" class="pic-item" @click="checkmenue(menu)">
                  <i class="icon iconfont" :class="[menu.icon]"></i>
                </div>
                <p :class="{'selecttext': momentCheck === menu.tag}">{{menu.name}}</p>
              </div>
            </div>
            <div :class="['profession-content-icon', showAplia ? (curAppPage >= applicationArr.length - 1 ? 'disabled' : '') : 'disabled']">
              <i class="iconfont icon-jiantou icon-right"  @click="aplicationRight"></i>
            </div>
          </div>
        </div>
        <div class="profession-box2" v-if="mainMenu[1] && mainMenu[1].children && mainMenu[1].children.length">
          <div class="profession-title">
            <div class="title-box1">
              <div class="line-top"></div>
              <div class="line-bottom"></div>
            </div>
            <div class="title-box2">
              <div class="line-top"></div>
              <div class="line-bottom"></div>
            </div>
            <h1>{{mainMenu[1].name}}</h1>
          </div>
          <div class="profession-content" align="center"  @mouseenter.stop="showSetting = true" @mouseleave.stop="showSetting = false">
            <div :class="['profession-content-icon', showSetting ? (curSetPage === 0 ? 'disabled' : '') : 'disabled']">
              <i class="iconfont icon-jiantou-copy icon-left" @click="settingLeft"></i>
            </div>
            <div class="profession-content-box" align="left">
              <div class="list-item" v-for="nenukey in settingArr[curSetPage]" :key="nenukey.tag">
                <div class="pic-item" :class="{'selectcolor': momentCheck === nenukey.tag}" @click="checkmenue(nenukey)">
                  <i class="icon iconfont" :class="[nenukey.icon]"></i>
                </div>
                <p :class="{'selecttext': momentCheck === nenukey.value}">{{nenukey.name}}</p>
              </div>
            </div>
            <div :class="['profession-content-icon', showSetting ? (curSetPage >= settingArr.length - 1 ? 'disabled' : '') : 'disabled']">
              <i class="iconfont icon-jiantou icon-right"  @click="settingRight"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="modalflag==='change'" class="pull-down-password pull-down-change">
      <div class="modal-mask-alert" @click='modalflag = ""'></div>
      <div class="list-box">
        <div class="password-header">
          <span style="padding:10px;display:inline-block">修改密码</span>
          <span @click='modalflag = ""' class="password-close" style="float:right;cursor:pointer;padding:10px;display:inline-block">
            <Icon type="close-round"></Icon>
          </span>
        </div>
        <div class="password-body">
          <Form :rules="password.rules" ref="password" label-position="top" :model="password.form">
            <Form-item label="旧密码" prop="oldPassword">
              <Input type="password" placeholder="请输入旧密码" v-model="password.form.oldPassword"></Input>
            </Form-item>
            <Form-item label="新密码" prop="password">
              <Input type="password" placeholder="请输入新密码" v-model="password.form.password"></Input>
            </Form-item>
            <div style="margin-bottom:15px;width:458px">
              <verify-password :password="password.form.password"></verify-password>
            </div>
            <Form-item label="密码确认" prop="confirmPassword">
              <Input type="password" placeholder="请输入新密码" v-model="password.form.confirmPassword"></Input>
            </Form-item>
          </Form>
        </div>
        <div class="password-footer">
          <Button style="float:right;margin:5px 50px 30px 0;width:100px" @click.native="changePassword" type="primary">保存</Button>
          <Button style="float:right;margin:5px 15px 30px 0;width:100px" @click.native="doLogout" type="ghost">返回登录</Button>
        </div>
      </div>
    </div> -->
    <modPwd :showModal="modalflag==='change'" @closeAlert="modalflag = ''" @doLogout="doLogout">
    </modPwd>
    <div v-if="modalflag==='exit'" class="pull-down-password pull-down-exit">
      <div class="modal-mask-alert" @click='modalflag = ""'></div>
      <div class="list-box">
        <div class="password-body">
          <div style="position:absolute;top:35px;left:20px">
            <i class="ivu-icon ivu-icon-help-circled" style="fontSize:36px;color:#ff9900;"></i>
          </div>
          <span style="margin:15px 15px 15px 45px;display:inline-block">提示：请确认是否退出本系统？确认退出前请保存正在编辑的内容</span>
        </div>
        <div class="password-footer">
          <Button @click="doLogout" type="primary" style="float: right;marginRight:40px">确认</Button>
          <Button @click="modalflag = ''" type="ghost" style="float: right;marginRight:20px">取消</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import VerifyPassword from '../../components/VerifyPassword.vue'
import { mapGetters, mapActions, mapState } from 'vuex'
import modPwd from 'components/navigation/modPwd.vue'
import theme from 'components/navigation/theme'
import {MAPMODE} from 'assets/2DMap/meta/common.js'
// import { setTimeout } from 'timers'
// import { read } from '../../storage/index.js'
export default {
  components: {
    // VerifyPassword,
    modPwd,
    theme
  },
  data() {
    const oldPasswordFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        callback()
      }
    }
    const passwordFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        callback()
      }
    }
    const confirmPasswordFun = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次确认新密码'))
      } else {
        callback()
      }
    }
    const triggerFun = (rule, value, callback) => {
      if (value !== this.password.form.password) {
        callback(new Error('两次输入密码不一致，请重试！'))
      } else {
        callback()
      }
    }
    return {
      fontWeight: 'normal',
      fontItalic: 'normal',
      fontRegular: 'Regular',
      uploadColor: '#1c3054',
      modalflag: '',
      mapType: '',
      momentCheck: 'realVideo',
      imgIfoLogo: '/static/image/home/logoMenu.png',
      imgIfoName: '校园监控综合管理平台',
      change: false,
      exit: false,
      password: {
        visible: false,
        form: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        },
        rules: {
          oldPassword: [{
            required: true, validator: oldPasswordFun, trigger: 'blur'
          }],
          password: [{
            required: true, validator: passwordFun, trigger: 'blur'
          }],
          confirmPassword: [{
            required: true, validator: confirmPasswordFun, trigger: 'blur'
          }, {
            trigger: 'blur', validator: triggerFun
          }]
        }
      },
      curAppPage: 0,
      curSetPage: 0,
      showAplia: false,
      showSetting: false
    }
  },
  computed: {
    ...mapGetters(['getmenuList', 'getsysmenu', 'momentmunuList', 'getMenuStyle', 'styleState']),
    ...mapState({
      mainMenu: ({ user }) => { return user.mainMenu },
      opsHost: ({ opsManage }) => { return opsManage.opsHost }
    }),
    applicationArr() {
      var result = []
      if (this.mainMenu && this.mainMenu[0] && this.mainMenu[0].children) {
        for (var i = 0; i < this.mainMenu[0].children.length; i += 18) {
          result.push(this.mainMenu[0].children.slice(i, i + 18))
        }
      }
      return result
    },
    settingArr() {
      var result = []
      if (this.mainMenu && this.mainMenu[1] && this.mainMenu[1].children) {
        for (var i = 0; i < this.mainMenu[1].children.length; i += 18) {
          result.push(this.mainMenu[1].children.slice(i, i + 18))
        }
      }
      return result
    }
  },
  watch: {
    getMenuStyle: {
      deep: true,
      handler(newInfo) {
        this.fontWeight = this.getMenuStyle.fontWeight || this.fontWeight
        this.fontItalic = this.getMenuStyle.fontItalic || this.fontItalic
        this.fontRegular = this.getMenuStyle.fontRegular || this.fontRegular
        this.uploadColor = this.getMenuStyle.uploadColor || this.uploadColor
        this.imgIfoLogo = this.getMenuStyle.uploadLogoPicture || '/static/image/home/logoMenu.png'
        // this.imgIfoLogo = '/static/image/home/logoMenu.png'
        this.imgIfoName = this.getMenuStyle.name || '校园监控综合管理平台'
      }
    }
  },
  methods: {
    ...mapActions(['setMenueList', 'logoutFun', 'getPlatform', 'getMainMenu', 'getTwoImensionalInfo']),
    checkmenue(item) {
      // console.log('导航页点击菜单项：', item)
      // 运维跳转到新运维
      if (item.url === '/ops/deviceMonitor' || item.url === '/settings/ops') {
        if (!this.opsHost) {
          this.warningMsg('请配置运维地址！')
          return
        }
      }
      this.momentCheck = item.tag
      const data = { children: item.children, item: item.tag }
      // 对地图模块特殊处理，根据系统参数2/3D配置设置点击地图模块的跳转路径
      this.setMenueList(data).then(() => {
        if (item.tag === '/map/module') { // 地图应用
          this.getTwoImensionalInfo().then(res => { // 获取2D/3D默认配置
            if (res.mapType) {
              let mapMode = res.mapType.default ? res.mapType.default : MAPMODE.mode2D
              let url = '/map/' + mapMode
              if (mapMode === MAPMODE.mode3D) {
                let map3DType = res.mapType.map3DType ? res.mapType.map3DType : MAPMODE.mapType3D.superMap
                let menu3D = item.children.find(child => { return child.url === url })
                if (menu3D.children && menu3D.children.length) {
                  url = menu3D.children.find(child => { return child.name === map3DType }).url
                }
              }
              this.$router.replace({ path: url })
            }
          })
        } else if (item.tag === '/mapEdit') { // 地图编辑
          this.getTwoImensionalInfo().then(res => { // 获取2D/3D默认配置
            if (res.mapType) {
              let mapMode = res.mapType.default ? res.mapType.default : MAPMODE.mode2D
              let url = '/mapEdit/' + mapMode
              if (mapMode === MAPMODE.mode3D) {
                let map3DType = res.mapType.map3DType ? res.mapType.map3DType : MAPMODE.mapType3D.superMap
                let menu3D = item.children.find(child => { return child.url === url })
                if (menu3D.children && menu3D.children.length) {
                  url = menu3D.children.find(child => { return child.name === map3DType }).url
                }
              }
              this.$router.replace({ path: url })
            }
          })
        } else if (item.tag === '/map/fengmap' || item.tag === '/mapEdit/fengmap') {
          this.$router.replace({ path: item.url })
        } else {
          this.$router.replace({ path: item.children[0].url })
        }
      }).catch((err) => {
        console.log('set menulist err' + err)
      })
    },
    clickItem(name) {
      this.modalflag = name
    },
    doLogout() {
      this.logoutFun().then(() => {
        this.$router.replace('/login')
        this.pullDownFlag = false
      }).catch((err) => {
        console.log('loginout err' + err)
      })
    },
    changePassword() {
      this.$refs.password.validate(valid => {
        if (valid) {
          this.password.visible = false
          // userResource.changePassword({ id: this.userId }, this.password.form).then(res => {
          //   this.$notify.success(this.$t('header._password.afterChange'))
          //   this.password.visible = false
          //   setTimeout(() => {
          //     this.doLogout()
          //   }, 2000)
          // }).catch((err) => {
          //   console.log('changePassword err' + err)
          // })
        }
      })
    },
    aplicationLeft() {
      this.curAppPage > 0 ? this.curAppPage -= 1 : this.curAppPage = 0
    },
    aplicationRight() {
      if (this.applicationArr.length) {
        this.curAppPage < this.applicationArr.length - 1 ? this.curAppPage += 1 : this.curAppPage = this.applicationArr.length - 1
      }
    },
    settingLeft() {
      this.curSetPage > 0 ? this.curSetPage -= 1 : this.curSetPage = 0
    },
    settingRight() {
      if (this.settingArr.length) {
        this.curSetPage < this.settingArr.length - 1 ? this.curSetPage += 1 : this.curSetPage = this.settingArr.length - 1
      }
    }
  },
  created() {
    this.getMainMenu()
    if (this.styleState) {
      this.fontWeight = this.getMenuStyle.fontWeight || this.fontWeight
      this.fontItalic = this.getMenuStyle.fontItalic || this.fontItalic
      this.fontRegular = this.getMenuStyle.fontRegular || this.fontRegular
      this.uploadColor = this.getMenuStyle.uploadColor || this.uploadColor
      this.imgIfoLogo = this.getMenuStyle.uploadLogoPicture || '/static/image/home/logoMenu.png'
      // this.imgIfoLogo = '/static/image/home/logoMenu.png'
      this.imgIfoName = this.getMenuStyle.name || '校园监控综合管理平台'
    }
    if (this.momentmunuList.item) {
      this.momentCheck = this.momentmunuList.item
    }
  },
  deactivated() {
    this.momentCheck = ''
  }
}
</script>
<style scoped>
.noue-box .ivu-dropdown-item:hover {
  background: #657ca8 !important;
  color: #fff !important;
}

.noue-box .ivu-select-dropdown {
  border: #446294 1px solid;
}

.noue-box .selectcolor {
  color: #fff !important;
  background: #f27e32 !important;
}

.noue-box .selecttext {
  color: #f27e32 !important;
}

.noue-box .list-item p {
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
}
.noue-box .profession-content {
  flex: 1;
  display: flex;
  justify-content: center;
}
@media screen and (max-width: 1700px) {
  .noue-box .profession-content-box {
    width: 1000px;
  }
  .noue-box .list-item {
    width: 11.1%;
    height: 130px;
    display: inline-block;
    text-align: center;
  }
  .noue-box .pic-item {
    border-radius: 10px;
    text-align: center;
    padding-top: 5px;
    display: inline-block;
    width: 60px;
    height: 60px;
    color: #12223f;
    background: #5676a9;
    cursor: pointer;
  }
  .noue-box .pic-item i {
    font-size: 36px;
  }
  .noue-box .profession-content .profession-content-icon {
    height: 215px;
  }
}
@media screen and (min-width: 1700px) {
  .noue-box .profession-content-box {
    width: 70%;
  }
  .noue-box .list-item {
    width: 11.1%;
    height: 160px;
    display: inline-block;
    text-align: center;
  }
  .noue-box .pic-item {
    border-radius: 10px;
    text-align: center;
    padding-top: 5px;
    display: inline-block;
    width: 80px;
    height: 80px;
    color: #12223f;
    background: #5676a9;
    cursor: pointer;
  }
  .noue-box .pic-item i {
    font-size: 48px;
  }
  .noue-box .profession-content .profession-content-icon {
    height: 275px;
  }
}

.noue-box .profession-content .profession-content-icon {
  width: 27px;
  display: flex;
  background-color: #0f1e3d4f;
  align-items: center;
  justify-content: center;
}

.noue-box .profession-content .profession-content-icon > .iconfont {
  font-size: 30px;
  align-self: center;
  cursor: pointer;
}

.noue-box .profession-content .profession-content-icon.disabled {
  visibility: hidden;
}

.noue-box .line-top {
  height: 2px;
  background: linear-gradient(0deg, #2e4876, #12223f);
}

.noue-box .line-bottom {
  height: 2px;
  background: linear-gradient(0deg, #324d78, #5676a9);
}

.noue-box .profession-box {
  height: 50%;
  width: 100%;
  padding: 40px 60px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.noue-box .profession-box2 {
  height: 50%;
  width: 100%;
  padding: 0 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.noue-box .title-box1 {
  height: 50px;
  padding: 15px 0 15px 400px;
  width: 42%;
  float: left;
  top: 75px;
}

.noue-box .title-box2 {
  height: 50px;
  padding: 15px 400px 15px 0;
  width: 42%;
  float: right;
  top: 75px;
}

.noue-box .body {
  height: calc(100% - 60px);
  min-height: 700px;
}

.noue-box .profession-title {
  padding-top: 0px;
  margin: 0 0 8px 0px;
  height: 50px;
}

.noue-box .body-bac {
  height: 100%;
  width: 100%;
  overflow: auto;
  background-size: 100% 100%;
  background-image: url('/static/image/home/bg_menu.png');
}

.noue-box .row-line {
  width: 0px;
  width: 3px;
  background: #fff;
  height: 30px;
  margin: 0 10px;
  float: left;
  margin-top: 20px;
}

/* .noue-box .header-box {
  height: 70px;
  line-height: 70px;
  float: left;
} */

.noue-box .userinfo {
  cursor: pointer;
  margin-right: 50px;
  height: 70px;
  line-height: 70px;
  float: right;
  font-size: 30px;
}

.noue-box .log-text {
  color: #fff;
  float: left;
  font-size: 24px;
  letter-spacing: 8px;
}

/* .noue-box .header {
  position: relative;
  top: 0px;
  padding: 30px;
  background-size: 100% 100%;
} */

.noue-box .logo-img {
  /* height: 63px;
  width: 441px; */
  height: 25px;
  width: 200px;
  float: left;
}

.noue-box .pull-down-password {
  position: absolute;
  z-index: 999999;
  position: absolute;
  left: calc(50% - 165px);
  top: 70px;
  margin: 0;
}

.noue-box .pull-down-exit {
  width: 400px;
  height: 170px;
}

.noue-box .pull-down-password .list-box {
  border-radius: 5px;
  background-color: #1c3053;
  position: absolute;
  z-index: 3;
  font-size: 14px;
  width: 100%;
  /* height: 100%; */
  top: 0;
  left: 0;
  border: 1px solid #0f1e3d;
}

.noue-box .pull-down-change {
  width: 500px;
  height: 400px;
}

.noue-box .modal-mask-alert {
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

.noue-box .list-box {
  z-index: 9999;
  background-color: transparent;
  position: absolute;
  z-index: 3;
  font-size: 14px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #0f1e3d;
}

/* .noue-box .password-header {
  width: 100%;
  height: 50px;
  font-size: 16px;
  color: #fff;
  background-color: #0f2343;
} */

.noue-box .password-body {
  margin: 20px;
}
</style>
