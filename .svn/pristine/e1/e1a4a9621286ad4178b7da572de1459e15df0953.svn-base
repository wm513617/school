import {
  AV_RECORD_LIST
} from 'http/video.api'

let timer = false
export default {
  data() {
    return {
      // 快速回放
      isReviewOpen: false,
      // 当前时间
      nowDate: 0,
      // 获取回放的当前时间
      VnowTime: 0,
      // 开始回放插件的初始时间
      VstarTime: 0,
      // 开始回放插件的结束时间
      VendTime: 0,
      // 码流图标
      backViewStreamIcon: ['icon-stream-set', 'icon-stream2'],
      backViewStreamIcons: ['main', 'sub1'],
      streamIconCount: 0,
      // 快速回放的间隔时间
      BACKTIME: 60000,
      // 从当前时间开始回放的参数对象
      playBackObj: {},
      // 进度条偏移量
      backPlan: 0
    }
  },
  methods: {
    // 点击快速回放时将当前时间保存
    nowDateSave() {
      const result = JSON.parse(this.APIs.previewPlugin.getPlayTime(this.plugin))
      if (result.success === true) { this.nowDate = result.msCur }
    },
    // 快速回放
    celerityPlayback(streamType) {
      if (!this.power || !this.power.includes('playback')) {
        this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        return
      }
      const pluginDate = this.$parent.pluginData[this.$parent.activedIndex]
      if (pluginDate.gbDevId) {
        // 下联设备回放
        return this.celerityPlaybackGb(pluginDate, streamType)
      }
      this.backViewData = {
        eid: {
          ip: this.$parent.pluginData[this.$parent.activedIndex].ip,
          cport: this.$parent.pluginData[this.$parent.activedIndex].port
        },
        chan: this.$parent.pluginData[this.$parent.activedIndex].channel
      }
      // this.isReviewOpen = true
      // this.stop()
      const obj = {
        devIp: this.$parent.pluginData[this.$parent.activedIndex].ip,
        // devIp: param.devIp,
        channel: this.$parent.pluginData[this.$parent.activedIndex].channel,
        devPort: this.$parent.pluginData[this.$parent.activedIndex].port,
        streamType: streamType,
        eventType: ['all'],
        typeName: '',
        typeContent: '',
        startTime: parseInt((this.nowDate - this.BACKTIME) / 1000),
        endTime: parseInt(this.nowDate / 1000),
        rows: 50,
        page: 1
      }
      this.recordOpens(this.plugin, obj, (blea) => {
        if (blea) {
          this.pluginState.isStopped = false
          const objs = {
            ...this.playBackObj,
            startTime: parseInt((this.nowDate - this.BACKTIME) / 1000)
          }
          this.APIs.recordPlugin.open(this.plugin, objs).then(v => {
            const item = JSON.parse(this.APIs.recordPlugin.getPlayerTime(this.plugin))
            if (v.open && v.state === 0) {
              if (item.success) {
                this.VstarTime = item.msBegin
                this.VendTime = item.msEnd
                this.reviewButton.isPlay = true
              }
            }
            this.upDateTime()
          })
        }
      })
    },
    // 下联设备回放
    async celerityPlaybackGb(param, streamType) {
      this.serverId = await this.getPlatformID(param.shareServer)
      let queryParam = {
        recordType: 'all',
        gbPlaDevIp: this.serverId.ip, // 设备ip,
        gbPlaDevPort: this.serverId.port, // 设备端口,
        parentId: this.serverId.serverId, // 国标平台id,
        childId: param.gbDevId, // 国标设备id,
        streamType: streamType || 'main',
        channel: param.chan,
        startTime: parseInt((this.nowDate - this.BACKTIME) / 1000),
        endTime: parseInt(this.nowDate / 1000)
      }
      this.gbQueryRecordList(queryParam).then(async res => {
        if (res.data.result === 'error' || res.data.total === 0) {
          this.$Notice.warning({ title: '提示', desc: '查询无录像！' })
        } else {
          this.isReviewOpen = true
          this.stop(false)
          this.playBackObj = {
            ...queryParam
          }
          const res = await this.gbRecordOpen(this.playBackObj).catch(err => err)
          const state = await this.APIs.recordPlugin.gbOpen(this.plugin, this.playBackObj, res)
          const item = JSON.parse(this.APIs.recordPlugin.getPlayerTime(this.plugin))
          if (state === 0) {
            this.pluginState.isStopped = false
            this.pluginState.isPlay = true
            if (item.success) {
              this.VstarTime = item.msBegin
              this.VendTime = item.msEnd
              this.reviewButton.isPlay = true
            }
            this.upDateTime()
          }
        }
      }).catch(err => {
        this.$Notice.error({ title: '提示', desc: '查询无录像！' })
        console.log(err)
      })
    },
    // 从快速回放返回现场
    backViewBack() {
      // 清除获取视频时间的定制器
      clearInterval(timer)
      // 将码流选择还原
      this.streamIconCount = 0
      // 按钮切换
      this.isReviewOpen = false
      // this.APIs.recordPlugin.stop(this.plugin)
      // this.APIs.previewPlugin.open(this.plugin, obj)
      this.$parent.open(this.$parent.pluginData[this.$parent.activedIndex], 0)
    },
    closeBackview() {
      // 清除获取视频时间的定制器
      clearInterval(timer)
      // 将码流选择还原
      this.streamIconCount = 0
      // 按钮切换
      this.isReviewOpen = false
      this.init = false
    },
    // 开始和暂停
    backViewStop() {
      if (this.reviewButton.isPlay) {
        this.APIs.recordPlugin.pause(this.plugin)
        // 清除获取视频时间的定制器
        clearInterval(timer)
      } else {
        this.APIs.recordPlugin.resume(this.plugin)
        this.upDateTime()
      }
      this.reviewButton.isPlay = !this.reviewButton.isPlay
    },
    // 点击快速回放中的码流按钮
    selStream() {
      this.streamIconCount = (++this.streamIconCount) % this.backViewStreamIcon.length
      this.celerityPlayback(this.backViewStreamIcons[this.streamIconCount])
    },
    // 拖动快速回放进度条
    backMousehange(tiem) {
      this.backPlan = tiem
      const objs = {
        ...this.playBackObj,
        startTime: parseInt((this.nowDate - this.BACKTIME + tiem) / 1000)
      }
      if (objs.childId) {
        this.gbOpen(objs, false)
      } else {
        this.APIs.recordPlugin.open(this.plugin, objs)
      }
    },
    // 按下进度条
    backMousedown() {
      // 清除获取视频时间的定制器
      clearInterval(timer)
    },
    // 抬起进度条
    backMouseup() {
      this.upDateTime()
    },
    // 将API中的方法摘出来
    recordOpens(plugin, param, callback) {
      AV_RECORD_LIST({
        devIp: param.devIp,
        // devIp: param.devIp,
        channel: param.channel,
        devPort: param.devPort,
        streamType: param.streamType ? param.streamType : 'main',
        eventType: param.eventType ? param.eventType : ['all'],
        typeName: '',
        typeContent: '',
        startTime: param.startTime,
        endTime: param.endTime,
        rows: 50,
        page: 1
      }).then(res => {
        console.log('recordOpens', res.data.result)
        if (res.data.result.eventList.length > 0) {
          // 有录像才关闭预览，否则直接提示
          this.isReviewOpen = true
          this.stop(false)
          this.init = false
          this.init = true
          this.playBackObj = {
            strmInfo: res.data.result.eventList[0].strmInfo,
            dsIp: res.data.result.dsIp,
            endTime: parseInt(this.nowDate / 1000)
          }
          callback(true) // eslint-disable-line
        } else {
          // this.backViewBack()
          this.$Notice.warning({
            title: '提示',
            desc: '查询无录像！'
          })
        }
      }).catch(error => {
        console.log('recordOpens err', error)
        this.$Notice.error({
          title: '提示',
          desc: '查询错误！'
        })
        return error
      })
    },
    // 快速回放 下载视频
    downBackVideo() {
      const type = this.$parent.parameters.videotape === 'BSR' ? 'bsr' : 'avi'
      const file = this.$parent.strFilter[type]
      const res = JSON.parse(this.APIs.recordPlugin.getFileBrowser(this.plugin, {
        type: 0,
        defaultName: type,
        file
      }))
      let path = ''
      if (res.success) {
        path = res.fileName
      } else {
        // this.$Notice.error({ title: '失败', desc: '获取保存位置出错！' })
        return
      }

      const objs = {
        ...this.playBackObj,
        startTime: parseInt((this.nowDate - this.BACKTIME) / 1000),
        path
      }
      this.APIs.recordPlugin.recordSave(this.plugin, objs).then(item => {
        this.$Notice.success({
          title: '成功',
          desc: '下载成功！'
        })
      }).catch(item => {
        this.$Notice.error({
          title: '失败',
          desc: '下载失败！'
        })
      })
    },
    //  定时获取当前视频中的时间
    upDateTime() {
      // const nowTime = this.APIs.recordPlugin.getPlayerCurTime(this.plugin)
      const _this = this
      timer = setInterval(() => {
        _this.VnowTime = JSON.parse(_this.APIs.recordPlugin.getPlayerCurTime(_this.plugin)).msCur
        _this.backPlan = (_this.VendTime - _this.VstarTime) / _this.BACKTIME * (_this.VnowTime - _this.VstarTime)
        if (_this.VnowTime >= _this.VendTime) { clearInterval(timer) }
      }, 1000)
    },
    newFullScreen() {
      if (this.$root.isFullscreen) {
        this.exitFullscreen()
        this.$root.$el.classList.remove('fs')
        this.fs2 = false
        this.$parent.isSingleFullscreen = false
        this.$root.isFullscreen = false
      } else {
        this.$root.$el.classList.add('fs')
        this.fs2 = true
        this.requestFullscreen()
        this.$parent.isSingleFullscreen = true
        this.$root.isFullscreen = true
      }
    }
  },
  beforeDestroy() {
    clearInterval(timer)
  }
}
