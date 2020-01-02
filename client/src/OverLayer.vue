<template>
  <div class="flexView" v-show="globalConfig.beatHeartFailed" v-on:hide="show">
    <V-Mask :maskState="state" :showIframe="showIF" :show="globalConfig.beatHeartFailed" :display="message"></V-Mask>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { beatHeart } from './http/beatHeart.api.js'
import { read } from '@/store/modules/init.js'
export default {
  data() {
    return {
      state: true,
      showIF: false,
      beatHeartFailed: false,
      message: this.$t('message.diconnected'),
      show: true
    }
  },
  computed: {
    ...mapState({
      hasPluginPreview: ({ preview }) => preview.hasPlugin,
      hasPluginPlayback: ({ playback }) => playback.hasPlugin
    }),
    ...mapGetters(['loggedIn', 'inUpgrading', 'globalConfig', 'isAnonymity'])
  },
  mounted() {
    const storage = window.localStorage
    this.timer = setInterval(() => {
      if (!this.loggedIn || this.inUpgrading) {
        this.SET_BEATHEART_FAILED(false)
        return
      }
      beatHeart()
        .then(resp => {
          console.log(resp.body.result.errno)
          if (resp.body.result.errno !== '0') {
            if (
              (window.location.href === '/#/preview' ||
                window.location.href === '/#/playback') &&
              this.hasPluginPreview &&
              this.hasPluginPlayback
            ) {
              this.showIF = true
              this.state = false
            } else {
              this.showIF = false
              this.state = true
            }
            console.log('err')
            this.SET_BEATHEART_FAILED(true)
            if (!this.globalConfig.conNum) {
              storage['reConnection'] = 'reConnection'
              this.$store.commit('SET_CON_NUM', 1)
              this.$store.commit('SET_CLEAR_Num', 0)
              setTimeout(() => {
                this.logout()
                  .then(() => {
                    // this.$router.replace('/login')
                    window.location.href = '/'
                  })
                  .catch(err => {
                    console.log(err + '长时间没有连接ipc，自动退回登录界面时出现异常')
                    // this.$router.replace('/login')
                    window.location.href = '/'
                  })
              }, 3500000)
            }
          }
          this.SET_BEATHEART_FAILED(false)
          if (!this.globalConfig.clearNum) {
            console.log('进入重新登录1')
            this.$store.commit('SET_CON_NUM', 0)
            this.$store.commit('SET_CLEAR_Num', 1)
            storage.removeItem('reConnection')
            this.logout(true)
              .then(() => {
                console.log('进入重新登录2')
                var user = read()
                this.login({
                  username: user.username,
                  password: user.password,
                  anonymity: user.anonymity,
                  actor: user.anonymity ? 'anonymity' : 'web'
                })
                  .then(data => {
                    console.log('进入重新登录3')
                    var allMessage = {
                      username: data.username,
                      actor: data.actor || 'web',
                      anonymity: data.anonymity,
                      hint: data.hint,
                      resp: data.resp,
                      session: data.session,
                      password: user.password,
                      priv: data.priv
                    }
                    this.$store.commit('SET_SESSION', allMessage.session)
                    this.$store.commit('SET_USER_INFO', allMessage)
                  })
                  .catch(err => {
                    console.log(err, '重连时出现异常')
                    this.SET_BEATHEART_FAILED(true)
                  })
              })
              .catch(err => {
                console.log('doLogout failed' + err)
              })
          }
        })
        .catch(err => {
          if (
            (window.location.href === '/#/preview' ||
              window.location.href === '/#/playback') &&
            this.hasPluginPreview &&
            this.hasPluginPlayback
          ) {
            this.showIF = true
            this.state = false
          } else {
            this.showIF = false
            this.state = true
          }
          console.log(err, 'err')
          this.SET_BEATHEART_FAILED(true)
          if (!this.globalConfig.conNum) {
            storage['reConnection'] = 'reConnection'
            this.$store.commit('SET_CON_NUM', 1)
            this.$store.commit('SET_CLEAR_Num', 0)
            setTimeout(() => {
              this.logout()
                .then(() => {
                  // this.$router.replace('/login')
                  window.location.href = '/'
                })
                .catch(err => {
                  console.log(err + '长时间没有连接ipc，自动退回登录界面时出现异常')
                  // this.$router.replace('/login')
                  window.location.href = '/'
                })
            }, 3500000)
          }
        })
    }, 10000)
  },
  components: {},
  methods: {
    ...mapMutations(['SET_BEATHEART_FAILED', 'SET_SESSION', 'SET_USER_INFO']),
    ...mapActions(['login', 'logout']),
    show(e) {
      this.SET_BEATHEART_FAILED(e)
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less">
.flexView {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
