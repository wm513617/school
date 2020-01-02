<template>
  <div :class="[isSingleFullscreen? 'fs2': '', `split-${showscreen}`]" class="video-plugin-box" style="height: 100%;position:relative;" v-resize="resizeFn">
    <!-- 这部分是显示器编号  无需用的不管 -->
    <bs-cover class="show-num-a" v-if="showNumber" v-model="showNumber" :style="{'margin-bottom': `${slotHeight}px`}">
      {{showNum()}}
    </bs-cover>
    <div class="show-num" v-if="showNumber" :style="{height: `calc(100% - ${slotHeight}px)`}">
      <div class="show-num-b" :style="{width: wd, height: ht}" v-for="index in showscreen" :key="index">
        <div>{{showNum(index)}}</div>
      </div>
    </div>

    <div class="no-plugin" :style="{height: slotHt, background: bgColor}" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
    </div>

    <div class="video-plugin-inBox" :style="{height: slotHt, background: bgColor}" v-if="!showDownload" style="width:100%">
      <video-plugin ref="video" v-for="index in pluginCount" :noBorder="noBorder" :pType="pluginType" :style="{width: wd, height: ht}" :toolbar="toolbar" :index="index-1" :activedIndex="activedIndex" :key="index" :class="{'hide': clazz[index-1]}" :clickInit="clickInit" @update:pluginState="updateState" @update:activedIndex="index => activedIndex = index" @on-dblclick="toggleSinglePlugin">
      </video-plugin>
    </div>
    <div v-if="showBtn">
      <div class="btnLeft" v-if="(allPage>1&&curPage!==0)||(paramAll.length > 0 && paramAll.length > showscreen)">
        <iframe v-if="(allPage>1&&curPage!==0)||(paramAll.length > 0 && paramAll.length > showscreen)"></iframe>
        <div @click="prePage">
          <i class="iconfont icon-jiantou-copy"></i>
        </div>
      </div>
      <div class="btnRight" v-if="(allPage>1&&curPage<allPage-1)||(paramAll.length > 0 && paramAll.length > showscreen)">
        <iframe v-if="(allPage>1&&curPage<allPage-1)||(paramAll.length > 0 && paramAll.length > showscreen)"></iframe>
        <div @click="nextPage">
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import VideoPlugin from './VideoPlugin.vue'
import { findIndex } from 'lodash'
import { TALK_STREAM_START } from '../../http/video.api'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import versionCheck from './pluginVersionCheck'
import { access_token } from '../../stored.js' // eslint-disable-line
export default {
  name: 'VideoFrame',
  mixins: [versionCheck],
  components: {
    VideoPlugin
  },
  props: {
    /*
      插件默认类型
    */
    pluginType: {
      type: String,
      default: 'preview'
    },
    /*
      组件最多有多少个窗口
    */
    pluginCount: {
      default: 1
    },
    /*
      组件默认显示几个窗口
    */
    defaultShowscreen: {
      default: 1
    },
    /*
      预览窗口中的按钮是否显示
    */
    toolbar: {
      default: null
    },
    /*
      点击时初始化插件窗口
      如果false的话手动调用initPlugin
    */
    clickInit: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 0
    },
    /*
      底部栏高度
    */
    slotHeight: {
      type: Number,
      default: 50
    },
    bgColor: {
      type: String,
      default: 'none'
    },
    usePage: {
      type: String,
      default: 'video'
    },
    /*
      为true时没有高亮的边框
    */
    noBorder: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      playingCount: 0,
      curPage: 0,
      clazz: [],
      paramList: [],
      timing: null,
      pluginData: {},
      paramAll: [],
      alternateI: 0,
      showscreen: this.defaultShowscreen,
      activedIndex: -1,
      showNumber: false,
      isSingleFullscreen: false,
      pluginState: {
        isPlay: false,
        isStopped: true,
        isBoost: false,
        isVolumeOpen: false,
        isRecording: false,
        isCentreRecording: false,
        isSpeech: false,
        isFrame: false,
        isPoll: false,
        isFullScreen: false,
        volumeValue: 0,
        streamType: 'main',
        speed: '1',
        scale: '自适应',
        streamId: ''
      },
      isEmpty: true
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters,
      strFilter: ({ videoOrg }) => videoOrg.strFilter,
      pollId: ({ videoOrg }) => videoOrg.pollId
    }),
    ...mapGetters(['pollingIds']),
    wd() {
      const wd = (100 / Math.sqrt(this.showscreen)).toFixed(2)
      if (this.showscreen === 3) {
        return `calc(33.3% - 4px)`
      } else if (this.showscreen === 2) {
        return `calc(49% - 4px)`
      } else {
        return `calc(${wd}% - 4px)`
      }
    },
    ht() {
      if (this.showscreen === 3) {
        return `calc(100% - 4px)`
      } else if (this.showscreen === 2) {
        return `calc(100% - 4px)`
      } else {
        return this.wd
      }
    },
    slotHt() {
      return `calc(100% - ${this.slotHeight}px)`
    },
    allPage() {
      const pluginPage = Math.ceil(this.pluginCount / this.showscreen)
      // const a2 = Math.ceil(this.paramList.length / this.showscreen)
      const playPage = Math.ceil(this.playingCount / this.showscreen)
      return playPage > pluginPage ? pluginPage : playPage
    },
    plugins() {
      return this.$refs.video
    },
    plugin() {
      return this.plugins ? this.plugins[this.activedIndex] : {}
    }
  },
  watch: {
    curPage() {
      this.togglePluginVisible()
    },
    showscreen() {
      this.togglePluginVisible()
      this.emitState()
    },
    pluginState: {
      deep: true,
      handler: function() {
        this.emitState()
      }
    },
    'pluginState.isFullScreen'(v) {
      if (!v) {
        this.setOutfullPoll()
      }
    },
    activedIndex(i) {
      this.$emit('activeChange', i)
      if (i !== -1) {
        this.emitIndex()
        this.emitState()
      }
    },
    defaultShowscreen(s) {
      this.curPage = 0
      this.showscreen = s
    },
    pluginData: {
      deep: true,
      handler: function() {
        this.$emit('changePluginData', this.pluginData)
      }
    },
    playingCount() {
      let num = this.plugins.filter(item => !item.pluginState.isStopped).length
      if (num !== this.playingCount) {
        this.playingCount = num
      }
      if (this.$parent.$refs.buttons) {
        this.$parent.$refs.buttons.playingCount = this.playingCount
      }
      this.$emit('update:playingCount', this.playingCount)
    }
  },
  methods: {
    ...mapMutations(['ADD_PLAYINGID', 'EMPTY_PLAYINGID', 'DEL_PLAYINGID', 'SET_POLLINGID', 'DEL_POLLINGID']),
    ...mapActions(['getVideoConf']),
    disablePlugin() {
      this.plugin.disablePlugin()
    },
    showNum(num) {
      let str = ''
      if (this.index < 10) {
        str += '0'
      }
      str += this.index + 1
      if (num) {
        if (num < 10) {
          str += '0'
        }
        str += num
      }
      return str
    },
    toggleShownum(isShow) {
      this.showNumber = isShow
      return isShow
    },
    initPlugin() {
      this.plugin.init = true
    },
    initPluginType(type) {
      this.activedIndex = 0
      return this.plugin.initPluginType(type)
    },
    emitState() {
      const state = Object.assign({ showscreen: this.showscreen }, this.pluginState)
      this.$emit('update:state', state)
    },
    emitIndex() {
      this.$emit('update:index', this.index)
    },
    updateState(state) {
      Object.assign(this.pluginState, state)
    },
    setPluginType(type) {
      if (this.plugin.setPluginType) {
        this.plugin.setPluginType(type)
      }
    },
    setShowscreen(num, isToggle = true) {
      this.single = null
      if (num === 1) {
        this.curPage = this.activedIndex
      } else {
        this.curPage = 0
        this.activedIndex = 0
      }
      const oldScreen = this.showscreen
      this.showscreen = num
      if (oldScreen < num) {
        this.setOutfullPoll(oldScreen)
      }
      if (this.pluginType === 'preview' && isToggle) {
        if (this.isSub()) {
          this.toggleAllSubStream('sub1')
        } else {
          this.toggleAllSubStream('main')
        }
      }
    },
    togglePluginVisible() {
      let startIndex = this.curPage * this.showscreen
      let endIndex = (this.curPage + 1) * this.showscreen
      if (endIndex > this.pluginCount) {
        startIndex -= endIndex - this.pluginCount
        endIndex = this.pluginCount
      }
      this.clazz.forEach((item, index, arr) => {
        if (index >= startIndex && index < endIndex) {
          this.$set(arr, index, false)
        } else {
          this.$set(arr, index, true)
        }
      })
    },
    toggleSinglePlugin(index) {
      this.$emit('on-dblclick')
      if (!this.single) {
        if (this.showscreen === 1) {
          return
        }
        this.single = {
          screen: this.showscreen,
          page: this.curPage
        }
        this.curPage = index
        this.showscreen = 1
        this.toggleOnlySubStream('main')
      } else {
        this.showscreen = this.single.screen
        this.curPage = this.single.page
        this.single = null
        this.setOutfullPoll()
        if (this.isSub()) {
          this.toggleOnlySubStream('sub1')
        }
      }
      this.$emit('setShowscreen', this.showscreen)
    },
    setShowmode(mode) {
      this.plugin.setShowmode(mode)
    },
    nextEmptyPlugin() {
      const index = findIndex(this.plugins, plugin => {
        return plugin.pluginState.isStopped
      })
      if (index !== -1) {
        this.activedIndex = index
      }
      return new Promise(resolve => {
        this.$nextTick(() => {
          resolve()
        })
      })
    },
    toggleOnlySubStream(flow) {
      let param = this.pluginData[this.activedIndex]
      if (this.pluginType === 'record') {
        let time = JSON.parse(this.getPlayerCurTime())
        // 添加开流开始时间
        param.startTime = parseInt(time.msCur / 1000)
      }
      if (param && this.pluginState.streamType !== flow) {
        param.streamType = flow
        this.plugins[this.activedIndex].setStream(flow)
        this.plugins[this.activedIndex].open(param).then(state => {
          if (state.state !== 0) {
            param.streamType = 'main'
            this.plugins[this.activedIndex].open(param)
          }
        })
      }
    },
    toggleAllSubStream(flow) {
      for (let index in this.pluginData) {
        let param = this.pluginData[index]
        // 只切换显示的视频码流
        if (index < this.showscreen) {
          if (param && this.plugins[index].pluginState.streamType !== flow) {
            param.streamType = flow
            this.plugins[index].setStream(flow)
            this.plugins[index].open(param).then(state => {
              if (state.state !== 0) {
                param.streamType = 'main'
                this.plugins[index].open(param)
              }
            })
          }
        }
      }
    },
    // 打开视频  param是视频对象信息
    open(param, res) {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      if (this.activedIndex === -1) {
        return
      }
      if (this.pollingIds[this.activedIndex]) {
        this.plugins[this.activedIndex].clearPollTimed()
      }
      for (const i in this.pollingIds) {
        if (this.pollingIds[i].i === this.activedIndex && this.pollingIds[i].id) {
          this.plugins[this.activedIndex].clearPollTimed()
        }
      }
      if (res) {
        this.pluginData[this.activedIndex] = res
        // this.ADD_PLAYINGID(res.id)
      } else {
        // 保存播放的信息  关闭播放时再删掉
        this.pluginData[this.activedIndex] = param
        // this.ADD_PLAYINGID(param.id)
      }
      if (res === 0) {
        this.DEL_PLAYINGID(param.id)
      }
      param = this.$lodash.cloneDeep(param)
      delete param.infos
      this.plugin.closeBackview()
      if (!res) {
        if (this.isSub()) {
          // this.toggleAllSubStream('sub1')
          param.streamType = 'sub1'
        } else {
          // this.toggleAllSubStream('main')
          param.streamType = param.streamType || 'main'
        }
      }
      return this.plugin.open(param)
    },
    assignOpen(i, param) {
      // 断线重连指定窗口开流
      console.log(i, param, 'i, param+指定窗口开流+++++++++++++++++++++++++')
      if (i >= this.showscreen * (this.curPage + 1) || i < this.curPage * this.showscreen) {
        return
      }
      if (this.plugins[i].pluginState.isPlay) {
        this.plugins[i].clearTOpen()
      } else {
        if (this.isSub()) {
          param.streamType = 'sub1'
        } else {
          param.streamType = 'main'
        }
        this.pluginData[i] = param
        this.plugins[i].open(param)
      }
    },
    changeStream(param) {
      this.pluginData[this.activedIndex] = param
      return this.plugin.open(param)
    },
    async openAll(paramList, poll, noPower) {
      if (!this.$store.getters.plugin.valid) {
        this.$Notice.warning({ title: '警告', desc: '请先下载插件，或当前浏览器不支持插件！' })
        return
      }
      await this.plugin.checkInit()
      if (!this.plugin.plugin.valid) {
        return
      }
      this.paramList = []
      this.paramAll = []
      this.stopAll(false)
      if (poll) {
        this.alternateI = 0
        this.paramAll = paramList
        this.alternateOpen()
        return
      }
      this.paramList = paramList
      paramList.forEach((param, index) => {
        if (index < this.pluginCount) {
          if (this.isSub()) {
            param.streamType = 'sub1'
          } else {
            param.streamType = 'main'
          }
          this.plugins[index].open(param, noPower)
          this.pluginData[index] = param
        }
      })
    },
    alternateOpen() {
      for (let i = 0; i < this.showscreen; i++) {
        const param = this.paramAll[i]
        if (this.isSub()) {
          param.streamType = 'sub1'
        } else {
          param.streamType = 'main'
        }
        this.plugins[i].open(param)
        this.pluginData[i] = param
      }
      this.alternateI += this.showscreen
    },
    preAlternate() {
      this.plugins.forEach(plugin => {
        // plugin.stop(false)
        plugin.quickStop()
      })
      this.pluginData = {}
      const showscreen = this.pluginState.isFullScreen ? 1 : this.showscreen
      if (showscreen === 1) {
        this.plugin.open(this.paramAll[this.alternateI])
      } else {
        for (let i = 0; i < showscreen; i++) {
          if (this.alternateI + i >= this.paramAll.length) {
            this.alternateI = 0
            return
          }
          const param = this.paramAll[this.alternateI + i]
          if (showscreen > 4) {
            param.streamType = 'sub1'
          } else {
            param.streamType = 'main'
          }
          this.plugins[i].open(param)
          this.pluginData[i] = param
        }
      }
      this.alternateI += showscreen
      if (this.alternateI >= this.paramAll.length) {
        this.alternateI = 0
      }
    },
    nextAlternate() {
      const showscreen = this.pluginState.isFullScreen ? 1 : this.showscreen
      this.alternateI -= showscreen
      this.alternateI -= showscreen
      if (this.alternateI < 0) {
        this.alternateI = 0
      }
      this.preAlternate()
    },
    prePage() {
      if (this.paramAll.length > 0) {
        this.nextAlternate()
      } else {
        this.curPage--
        this.activedIndex = this.curPage * this.showscreen
      }
    },
    nextPage() {
      if (this.paramAll.length > 0) {
        this.preAlternate()
      } else {
        this.curPage++
        this.activedIndex = this.curPage * this.showscreen
      }
    },
    timedPlay(t) {
      if (!this.plugin.plugin.valid) {
        return
      }
      if (this.paramAll.length > 0) {
        this.timing = setInterval(() => {
          if (this.paramAll.length > this.showscreen || this.pluginState.isFullScreen) {
            this.preAlternate()
          }
        }, t * 1000)
      } else {
        this.timing = setInterval(() => {
          this.curPage++
          if (this.curPage >= this.allPage) {
            this.curPage = 0
          }
        }, t * 1000)
      }
    },
    clearTimedPlay() {
      this.curPage = 0
      this.paramList = []
      this.paramAll = []
      clearInterval(this.timing)
      const arr = []
      for (const key in this.pluginData) {
        arr.push(this.pluginData[key].id)
      }
      return arr
    },
    pause() {
      this.plugin.pause()
    },
    syncPause() {
      this.plugin.syncPause()
    },
    // 带截图隐藏插件的暂停
    capPause() {
      return this.plugin.capPause()
    },
    capResume() {
      return this.plugin.capResume()
    },
    resume() {
      this.plugin.resume()
    },
    syncResume(param, res) {
      if (res) {
        this.pluginData[this.activedIndex] = res
        this.ADD_PLAYINGID(res.id)
      } else {
        this.pluginData[this.activedIndex] = param
        this.ADD_PLAYINGID(param.id)
      }
      return this.plugin.syncResume(param)
    },
    stop(isDestroyPlugin) {
      if (this.activedIndex === -1 || !this.plugins) {
        return
      }
      const data = this.pluginData[this.activedIndex]
      const id = data ? data.id : null
      this.closeSound()
      this.plugin.stop(isDestroyPlugin)
      this.plugin.clearPollTimed()
      this.DEL_PLAYINGID(id)
      delete this.pluginData[this.activedIndex]
      return id
    },
    stopAll(isDestroyPlugin) {
      if (!this.plugins) {
        return
      }
      this.paramList = []
      this.paramAll = []
      this.plugins.forEach(plugin => {
        plugin.stop(isDestroyPlugin)
        plugin.closeBackview()
        plugin.clearPollTimed()
      })
      this.EMPTY_PLAYINGID()
      this.pluginData = {}
    },
    clearTOpenAll() {
      // 清除断线重连定时器
      if (!this.plugins) {
        return
      }
      this.plugins.forEach(plugin => {
        plugin.clearTOpen()
      })
    },
    openSound() {
      this.plugins.forEach(plugin => plugin.closeSound())
      return this.plugin.openSound()
    },
    closeSound() {
      return this.plugin.closeSound()
    },
    getVolume() {
      return this.plugin.getVolume()
    },
    setVolume(value) {
      this.plugin.setVolume(value)
    },
    boost(isb) {
      this.plugin.boost(isb)
    },
    fullScreen(isFull) {
      this.plugin.fullScreen(isFull)
    },
    getCapture(param) {
      return this.plugin.getCapture(param)
    },
    setScale(value) {
      this.plugin.setScale(value)
    },
    // 截图功能
    getPicture(name) {
      this.getVideoConf() // 同步localStorage数据到本地配置
      console.log(this.getVideoConf(), 'this.getVideoConf()')
      const paramed = this.$lodash.cloneDeep(this.pluginData[this.activedIndex])
      const type = this.parameters.screenshot === 'JPG' ? 'jpg' : 'bmp'
      const picType = this.parameters.screenshot === 'JPG' ? 1 : 0
      let picName = (name || paramed.name) + '-' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
      let path = this.parameters.screenshotPath + '\\' + picName.toString()
      const state = JSON.parse(
        this.plugin.getPicture({
          path: path,
          type: picType
        })
      )
      if (state === 0) {
        this.$Notice.success({ title: '成功', desc: `截图已保存到${path}` })
      } else {
        this.$Notice.error({ title: '失败', desc: '截图保存失败！' })
      }
    },
    // 录像
    openRecording(param) {
      return this.plugin.openRecording(param)
    },
    isRecording() {
      this.plugin.isRecording()
    },
    closeRecording() {
      this.plugin.closeRecording()
    },
    // 中心录像开始
    openCentreRecord(param) {
      return this.plugin.openCentreRecord(param)
    },
    // 关闭中心录像
    stopCentreRecord() {
      this.plugin.stopCentreRecord()
    },
    NVRopen(data) {
      return this.plugin.NVRopen(data) // eslint-disable-line
    },
    gbOpen(data) {
      return this.plugin.gbOpen(data)
    },
    // 对讲和广播
    openSpeechEx(objList) {
      this.plugins.forEach(plugin => {
        plugin.stopSpeech()
        plugin.closeSpeech()
      })
      const params = {}
      params.devList = objList ? JSON.parse(JSON.stringify(objList)) : [this.pluginData[this.activedIndex]]
      params.devList = params.devList.map(item => {
        return { devIp: item.ip, port: +item.port, channel: 1, istalk: objList ? 'broadcast ' : 'talk' }
      })
      // 请求对讲或者设备广播接口
      TALK_STREAM_START(params)
        .then(res => {
          res = JSON.parse(JSON.stringify(res))
          const cmd = {
            params: {
              args: {
                token: access_token, // eslint-disable-line
                devList: params.devList.map(item => {
                  return { ip: item.devIp, port: item.port, channel: 1, isTalk: objList ? 'broadcast ' : 'talk' }
                })
              }
            }
          }
          const openState = this.plugin.openSpeechEx(
            JSON.stringify({
              ip: res.data.taIp,
              port: res.data.taPort + '',
              cmdStr: JSON.stringify(cmd)
            })
          )
          let startState = 1
          if (!openState) {
            startState = this.plugin.startSpeech()
          }
          if (!openState && !startState) {
            this.$Notice.success({ desc: objList ? '开启广播成功！' : '开启对讲成功！', title: '提示' })
          } else {
            this.$Notice.error({ title: '失败', desc: objList ? '开启广播失败！' : '开启对讲失败！' })
          }
        })
        .catch(err => {
          this.$Notice.error({ title: '失败', desc: objList ? '开启广播失败！' : '对讲请求失败！' })
          console.log(err, objList ? '广播请求失败！' : '对讲请求失败！')
        })
    },
    openSpeech(param) {
      this.plugin.openSpeech(param)
    },
    startSpeech() {
      return this.plugin.startSpeech()
    },
    stopSpeech() {
      return this.plugin.stopSpeech()
    },
    closeSpeech() {
      this.plugin.closeSpeech()
    },
    // 视频回放相关
    getPlayerTime() {
      // 起止时间
      return this.plugin.getPlayerTime()
    },
    getPlayerCurTime() {
      // 当前时间
      return this.plugin.getPlayerCurTime()
    },
    recordOpen(param) {
      return this.plugin.recordOpen(param)
    },
    // 设置播放速度
    setPlayerRate(param) {
      return this.plugin.setPlayerRate(param)
    },
    setPlayerMode(param) {
      return this.plugin.setPlayerMode(param)
    },
    // 录像下载
    recordDump(param) {
      return this.plugin.recordDump(param)
    },
    setDumpStare(param, callback) {
      return this.plugin.setDumpStare(param, callback)
    },
    stopDump(param) {
      return this.plugin.stopDump(param)
    },
    getDumpIsEnd(param) {
      return this.plugin.getDumpIsEnd(param)
    },
    // 获取图像调节
    GetPlayerPicParam(param) {
      return this.plugin.GetPlayerPicParam(param)
    },
    // 修改图像调节
    SetPlayerPicParam(param) {
      return this.plugin.SetPlayerPicParam(param)
    },
    // 切片
    getRecordSlice(param, callback) {
      return this.plugin.getRecordSlice(param, callback)
    },
    getFileBrowser(param) {
      return this.plugin.getFileBrowser(param)
    },
    getFileBrowserEx(param) {
      return this.plugin.getFileBrowserEx(param)
    },
    getDir() {
      return this.plugin.getDir()
    },
    // 设置码流
    setStream(streamType) {
      this.plugin.setStream(streamType)
    },
    setOutfullPoll(i = this.activedIndex) {
      if (this.paramAll.length <= 0) {
        return
      }
      this.alternateI -= i
      if (this.alternateI < 0) {
        this.alternateI = 0
      }
      this.preAlternate()
    },
    // 显示关闭快速云台 showPTZ = !showPTZ
    PTZClick(data) {
      this.plugin.PTZClick(data)
    },
    /**
     * 页面尺寸改变事件
     * 解决360浏览器全屏模式下keydown事件不触发问题
     */
    resizeFn() {
      if (
        !(
          document.fullscreenEnabled ||
          window.fullScreen ||
          document.webkitIsFullScreen ||
          document.msFullscreenEnabled
        ) &&
        this.$root.$el.classList.contains('fs')
      ) {
        this.escFn({ which: 27 })
      }
    },
    isSub() {
      return this.showscreen > 4 && window.localStorage.useSubStream === 'true'
    }
  },
  created() {
    if (this.index === 0) {
      this.activedIndex = 0
    }
    for (let i = 0; i < this.pluginCount; i++) {
      this.clazz.push(false)
    }
  },
  mounted() {
    this.togglePluginVisible()
    this.emitState()
    this.escFn = e => {
      if (e.which === 27 || e.keyCode === 27) {
        this.$root.$el.classList.remove('fs')
        this.$root.isFullscreen = false
        this.plugin.fs2 = false
      }
    }
    document.addEventListener('keydown', this.escFn, false)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.escFn, false)
    clearInterval(this.timing)
    this.isEmpty && this.EMPTY_PLAYINGID()
  }
}
</script>
<style lang="less" scoped>
div.hide {
  position: absolute;
  left: -9999px;
  top: -9999px;
}

.show-num {
  height: calc(~'100% - 50px');
  position: absolute;
  width: 100%;
  z-index: 0;
  color: #bfbfbf;
}

.show-num-a {
  position: absolute;
  background: #bfbfbf;
  color: #171717;
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  left: calc(~'50% - 13px');
  bottom: -13px;
  font-size: 18px;
  z-index: 2;
}

.show-num-b {
  display: inline-block;
  text-align: center;
  box-sizing: content-box;
  line-height: 25px;
  position: relative;
  border: 2px solid transparent;

  div {
    position: absolute;
    left: calc(~'50% - 13px');
    top: calc(~'50% - 13px');
  }
}

.btnLeft,
.btnRight {
  position: absolute;
  width: 30px;
  height: 40px;
  z-index: 999;
  background-color: #1f1f1f;
  top: calc(~'50% - 25px');
  margin-top: -22px;
  overflow: hidden;
  cursor: pointer;

  iframe,
  div {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border: 0 none;
  }

  div {
    z-index: 99;
    font-size: 30px;
    line-height: 30px;
    text-align: center;
  }
}

.btnRight {
  right: 0;
}

.btnLeft {
  left: 0;
}

.no-plugin {
  position: relative;

  & a {
    position: absolute;
    font-size: 24px;
    left: calc(~'50% - 120px');
    top: calc(~'50% - 18px');
    color: #00a5e3;
  }

  & .ivu-icon {
    position: absolute;
    font-size: 24px;
    left: calc(~'50% + 120px');
    top: calc(~'50% - 18px');
    margin-top: 6px;
    margin-left: 10px;
    cursor: help;
    color: #00a5e3;
  }
}
.fs #play-back .video-plugin-box .video-plugin-inBox {
  width: calc(~'100% - 4px') !important;
  position: fixed;
  left: 0;
  top: 0;
  height: calc(~'100% - 68px') !important;
  background: rgb(64, 64, 64);
  right: 0;
  z-index: 99999;
}
.fs #preview .video-plugin-box {
  position: fixed !important;
  z-index: 9999;
  height: auto !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.fs #preview .MapVideoPlayback .video-plugin-box {
  position: static !important;
  z-index: auto;
  height: calc(~'100% - 60px') !important;
  top: auto;
  bottom: auto;
  left: auto;
  right: auto;
}
.fs #preview div:not(.MapVideoPlayback) .video-plugin-box .video-plugin-inBox {
  height: 100% !important;
}
.fs #capture .video-plugin-box {
  position: fixed !important;
  z-index: 9999;
  height: auto !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.fs #capture .video-plugin-box .video-plugin-inBox {
  height: 100% !important;
}
</style>
