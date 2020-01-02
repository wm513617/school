<template>
  <div id="app-main">
    <div class="app-wrapper">
      <div class="app-container" :class="{active: loggedIn}">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
      <n-progress parent=".app-wrapper"></n-progress>
    </div>
    <object type="application/x-webplayercontrol" style="position:fixed;top:-9999px;width:10px;height:10px" id="global-plugin"></object>
  </div>
</template>
<script>
import NProgress from './components/NProgress'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { connectAlarm } from 'src/socket/alarm.js'
import { save, read } from './storage/index.js'
import { getYourIP } from '../src/assets/js/getClientIp'
let receiveUkey
export default {
  computed: {
    ...mapGetters(['loggedIn', 'plugin']),
    ...mapState({
      downloadList: ({ playback }) => playback.downloadList
    })
  },
  components: {
    NProgress
  },
  methods: {
    ...mapActions([
      'recoverDownloadList',
      'getPlatform',
      'alarmWarning',
      'navAlarmPage',
      'fireAlarmPage',
      'monitorUkey',
      'logoutFun',
      'loginFun',
      'getvideoOrg',
      'getOpsIp',
      'getVideoConf'
    ]),
    ...mapMutations(['SET_PLUGIN', 'SET_PLAYCONF', 'SET_VIDEOCONF', 'SET_LOCALSTORAGE_FILTER', 'SET_FIRE_ALARM_FILTER']),
    pageMessage(val) {
      this.navAlarmPage(val).catch(err => {
        console.log('navAlarmPage', err)
      })
      this.fireAlarmPage(val).catch(err => {
        console.log('fireAlarmPage', err)
      })
    },
    logout() {
      this.logoutFun().then(() => {
        location.replace(location.origin + '/login')
      }).catch(err => {
        console.log('loginout err' + err.msg)
      })
    },
    /**
     * 监听ukey是否在线
     * @method getUKey
     * @param {Object} data ukey的key值
     */
    getUKey() {
      this.monitorUkey().then(res => {
        let keyIds = []
        res.map(item => {
          keyIds.push(item.id)
        })
        const isLogin = read('user.access_token')
        if (read('ukeyId') && keyIds.indexOf(read('ukeyId')) === -1 && isLogin) {
          this.logout()
          return
        }
        if (isLogin) { return }
        if (res.length < 2) {
          if (res[0].key !== '') {
            save('ukeyId', res[0].id)
            this.loginFun({ key: res[0].key }).then(data => {
              if (data.code === 200) {
                document.cookie = 'Authorization=Bearer ' + data.access_token
                this.$store.commit('SET_MAINMENU', data.actionTree)
                this.$router.replace('/navigation')
                this.getPlatform().catch((err) => {
                  console.log('this.getPlatform:' + err)
                })
              } else {
                this.$store.commit('LOGIN_TEXT', data.msg)
              }
            }).catch(err => {
              console.log(err.msg)
            })
          } else {
            this.warningMsg('Ukey未被授权')
          }
        } else {
          this.warningMsg('请插入一个可用ukey登录')
        }
      }).catch(err => {
        if (read('ukeyId')) {
          this.logout()
          console.log('monitorUkey err' + err)
        }
      })
    }
  },
  mounted() {
    getYourIP()
    this.SET_PLUGIN(this.$el.querySelector('#global-plugin'))
    this.recoverDownloadList()
    // this.getvideoOrg() // 刷新后获取一次机构树，缓解预览回放加载慢
  },
  beforeDestroy() {
    this.SET_PLUGIN(null)
    clearInterval(receiveUkey)
  },
  created() {
    if (JSON.parse(localStorage.getItem('filterState'))) {
      this.$store.commit('SET_LOCALSTORAGE_FILTER', JSON.parse(localStorage.getItem('filterState')))
    }
    if (JSON.parse(localStorage.getItem('confirmedAlarm'))) {
      this.$store.commit('SET_DEAL_STATUS', JSON.parse(localStorage.getItem('confirmedAlarm')))
    }
    if (JSON.parse(localStorage.getItem('fireFilterState'))) {
      this.SET_FIRE_ALARM_FILTER(JSON.parse(localStorage.getItem('fireFilterState')))
    }
    receiveUkey = setInterval(() => {
      this.getUKey()
    }, 10000)
    if (this.loggedIn) {
      this.getPlatform().catch(err => {
        console.log('getPlatform err:' + err)
      })
      connectAlarm()
      this.alarmWarning().catch(err => {
        console.log('alarmWarning', err)
      })
    }
    this.$nextTick(() => {
      this.getVideoConf()
    })
    // 获取新运维部署服务器ip
    this.getOpsIp()
  }
}
</script>
<style lang="less">
@import 'assets/css/variable';
@import 'assets/css/animate';
@import 'assets/fonts/iconfont.css';
@import 'assets/css/flex';
@import 'assets/css/common';

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: @color-gray;
}

::-webkit-scrollbar-button,
::-webkit-scrollbar-track {
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: @color-silver-light;
}

::-webkit-scrollbar-thumb:hover {
  background-color: @color-black-exact-light;
}

html {
  font-size: 16px;
  font-family: 'Helvetica Neue', Helvetica, Tahoma, 'PingFang SC', 'Hiragino Sans GB', 'Heiti SC', 'Microsoft YaHei',
    '微软雅黑', 'WenQuanYi Micro Hei', Arial, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
  min-width: 1598px;
  background-color: #0a111c;
}

* {
  box-sizing: border-box;
}

ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}

/**
* ::before
* ::after
box-sizing border-box */
a {
  text-decoration: none;
}

#app-main {
  display: flex;
  width: 100%;
  height: 100vh;

  .app-wrapper {
    flex: 1;
    display: flex;
    flex-flow: column;

    overflow-x hidden {
      #header {
        flex: 0 0 60px;
      }
    }

    .app-container {
      position: relative;
      flex: 1;
      display: flex;
      justify-content: center;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #0c1b32;

      &.active {
        margin: 0;
      }
    }
  }
}

.app-container > div > div {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-content {
  height: 100%;
}

.el-dropdown-link {
  cursor: pointer;
}

.car-menu {
  flex: 0 0 70px;
}

.bs-content {
  overflow: auto;
  display: flex;
  flex: 1;
  padding: 16px 0;
}

.bs-left {
  flex: 0 0 272px;
  background: #1b3153;
  margin-right: 16px;
  overflow: hidden;
  min-height: 670px;

  .ivu-menu-light.ivu-menu-vertical {
    .ivu-menu-item {
      border-bottom: 1px solid #ccc;
    }
  }
}

.bs-right {
  flex: 0 0 300px;
}

.bs-main {
  flex: 1;
  display: flex;
  min-height: 670px;
}

.bswrap {
  width: 100%;
  padding: 20px 0;
}

.vehicle {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.table-footer {
  padding: 3px 10px;
  background-color: #244575;
  border: none;
  height: 40px;
}

div.ol-popup::after {
  border-top-color: #0f2343 !important;
}

.ivu-modal-close {
  z-index: 999;
}

.ivu-modal-body {
  padding: 24px 22px;
}
.ivu-modal-footer button + button {
  margin-left: 16px;
}
.ivu-modal-footer button:first-child {
  margin-right: -3px;
}
</style>
