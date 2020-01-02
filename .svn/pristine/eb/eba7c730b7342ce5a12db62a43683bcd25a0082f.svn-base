import {
  OPEN_CENTRERECORD,
  STOP_CENTRERECORD
} from 'http/video.api'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    pluginData() {
      return this.$parent.pluginData[this.index]
    }
  },
  methods: {
    ...mapMutations(['SET_CENTER_VIDEO_ID']),
    // 开启中心录像
    openCentreRecord() {
      // this.$http.get('/playback/ds?resId=' + '5ac2e1693c55f96ed59ff430').then(res => {
      this.$http.get('/playback/ds?resId=' + this.pluginData.id).then(res => {
        this.setPreviewLog('openCentreRecord') // 预览日志
        if (res && res.data.server) {
          const obj = {
            devIp: this.pluginData.ip,
            devPort: this.pluginData.port,
            channel: this.pluginData.channel,
            streamType: this.pluginData.streamType,
            mType: this.pluginData.vendor,
            eventType: 512,
            eventSrc: 0,
            // devName: 'string',
            // devId: 'string',
            // streamConnMode: 'string',
            // streamConnPort: 0,
            // tsServerId: 'string',
            dsServerId: res.data.server
          }
          OPEN_CENTRERECORD(obj).then(item => {
            if (item.data.code === 0) {
              // 中心录像开启成功 将id存起来 供机构数使用
              this.SET_CENTER_VIDEO_ID({id: this.pluginData.id, isAdd: true})
              this.pluginState.isCentreRecording = true
              this.$Notice.success({ desc: '开启中心录像成功！', title: '提示' })
            } else {
              this.$Notice.error({ desc: '开启中心录像失败' + item.data.message, title: '提示' })
            }
          }).catch(err => {
            console.log('OPEN_CENTRERECORD err', err)
            this.$Notice.error({ desc: '开启中心录像失败', title: '提示' })
          })
        } else {
          this.$Notice.warning({ desc: 'ds服务器不存在', title: '提示' })
        }
      }).catch(err => {
        console.log(err)
        this.$Notice.error({ desc: '服务器出错', title: '提示' })
      })
    },
    // 关闭中心录像
    stopCentreRecord() {
      // const obj = {
      //   devIp: this.pluginData.ip,
      //   devPort: this.pluginData.port,
      //   channel: this.pluginData.channel,
      //   mType: this.pluginData.vendor,
      //   streamType: this.pluginData.streamType
      // }
      this.setPreviewLog('stopCentreRecord') // 预览日志
      const obj = {
        devIp: this.pluginData.ip,
        devPort: this.pluginData.port,
        channel: this.pluginData.channel,
        mType: this.pluginData.vendor,
        streamType: this.pluginData.streamType,
        'eventType': 512,
        'eventSrc': 0
        // 'devName': 'string',
        // 'devId': 'string'
      }
      STOP_CENTRERECORD(obj).then(item => {
        if (item.data.code === 0) {
          // 中心录像关闭后 将id 清除
          this.SET_CENTER_VIDEO_ID({id: this.pluginData.id})
          this.pluginState.isCentreRecording = false
          this.$Notice.success({ desc: '关闭中心录像成功！', title: '提示' })
        }
      }).catch(item => {
        this.$Notice.error({ desc: '关闭中心录像失败', title: '提示' })
      })
      // this.pluginState.isCentreRecording = false
    }
  },
  mounted() {
    // this.$store.dispatch('getStorageServer', { servername: 'ds' }).then(res => res)
  }
}
