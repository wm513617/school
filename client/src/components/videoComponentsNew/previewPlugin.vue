<template>
  <div class="video-plugin">
    <div class="no-plugin" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <Icon type="help-circled" style="color:#57A3F3;margin:10px" title="安装后仍然提示?" @click.native="showHelp" />
    </div>
    <div class="single-video-plugin" ref="singleVideo" :style="{ height: isButton ? 'calc(100% - 56px)' : '100%' }" v-if="!showDownload">
      <plugin ref="plugin" style="padding: 1px" v-for="(item, index) in defaultTotalPane" :key="index" :paneMark="index" :isMaximize="isMaximize" :defaultPane="defaultPane" :style="[pluginSize[index % checkedWmode], hidden(index), active(index)]" :singleStatus="videoStatusArr[index]" @clickEvent="clickEvent" @updateStatus="updateStatus" :pluginIconShow='pluginIconShow'></plugin>
      <plugin style="background: #888" :style="[pluginSize[(item + defaultTotalPane - 1) % checkedWmode]]" v-for="item in nullDiv" :key="item + defaultTotalPane"></plugin>
    </div>
    <div class="video-bottom" v-if="isButton">
      <div class="left">
        <!-- <button @click="stopPreview(checkedPane)">停止</button> -->
        <!-- <button @click="stopPreviewALL">全部停止</button> -->
        <!-- <i class="icon iconfont" :class="[selectedObj.isPlay? 'icon-pause': 'icon-play']" :title="[selectedObj.isPlay? '暂停': '播放']" @click="playStop"></i> -->
        <i class="icon iconfont icon-preview-stopall" :class="{'disable': isPlayPluginInfo.length===0}" title="关闭全部预览" @click="stopPreviewALL" v-if="iconShow.stopAll"></i>
        <i class="icon iconfont icon-preview-stop" :class="{'disable': !selectedObj.isPlay}" title="关闭预览" @click="stopPreview(checkedPane)" v-if="iconShow.stop"></i>
        <i class="icon iconfont icon-screenshot" :class="{'disable': !selectedObj.isPlay}" title="截图" @click="getCapture" v-if="iconShow.screenshot"></i>
        <i class="icon iconfont icon-shipinleiduijiangjinyong" :class="{'disable': !selectedObj.isPlay}" title="对讲" v-if="iconShow.speech"></i>
        <i class="icon iconfont" :class="[selectedObj.showVolume&&selectedObj.isPlay? 'icon-volume': 'icon-mute', !selectedObj.isPlay? 'disable': '']" title="音量调节" @click="volumeSwitch" v-if="iconShow.volume"></i>
        <div style="width:120px;display:inline-block;vertical-align:top;line-height:45px" v-if="selectedObj.showVolume">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' v-model="selectedObj.volumeValue" @change="changeVolume"></slider>
        </div>
      </div>
      <div class="right">
        <i title="上一屏" class="icon iconfont icon-jiantou-copy" :class="{'disable': curPage===1}" @click="prePage" v-if="iconShow.panePage"></i>
        <div style="display: inline-block;" v-if="iconShow.panePageNum">
          <span>{{curPage}}</span>&nbsp;
          <span>/</span>&nbsp;
          <span>{{totalPage}}</span>&nbsp;
        </div>
        <i title="下一屏" class="icon iconfont icon-jiantou" :class="{'disable': curPage===totalPage}" style="position: relative;bottom: 2px;" @click="nextPage" v-if="iconShow.panePage"></i>
        <div class="dp-con" @mouseenter="showmodeShow=true" @mouseleave="showmodeShow=false" v-if="iconShow.multiScreen">
          <ul v-show="showmodeShow">
            <li v-for="mode in panesArr" :key='mode.value' @click="clickCheckedWmode(mode)" :class="{active: mode.value===checkedWmode}">{{mode.label}}</li>
            <i></i>
          </ul>
          <i class="icon iconfont icon-multi-screen" title="画面分割"></i>
        </div>
        <i class="icon iconfont icon-full-screen" :class="{'disable': !selectedObj.isPlay}" title="全屏" @click="fullScreen" v-if="iconShow.fullScreen"></i>
        <i class="icon iconfont icon-tv-wall" :class="{'disable': !selectedObj.isPlay}" title="快速上墙" @click="toWallBtn()" v-if="iconShow.tvWall"></i>
      </div>
    </div>
    <Modal class="quickTowall" v-model="showWall" title="快速上墙" :mask-closable="false" :transition-names="[]">
      <iframe v-if="showWall" style="z-index:0;position: absolute;border: 0 none;top: 0;left: 0; width: 100%; height: 100%;"></iframe>
      <QuickToWall v-if="showWall" style="position:relative;" :camera="selectedObj.source.resId"></QuickToWall>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="showWall=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import plugin from './plugin'
import { openFlow } from './preview'
import Slider from 'components/Slider'
import QuickToWall from 'view/video/tvwall/QuickToWall'
import pluginVersionCheck from '../video/pluginVersionCheck'
export default {
  components: {
    plugin,
    Slider,
    QuickToWall
  },
  mixins: [pluginVersionCheck],
  props: {
    panesArr: {
      // 窗格配置选项
      type: Array,
      default: () => [
        { value: 1, label: '单画面' },
        { value: 4, label: '四画面' },
        { value: 5, label: '五画面' },
        { value: 9, label: '九画面' },
        { value: 16, label: '十六画面' }
      ]
    },
    isButton: {
      // 视频窗下方总按钮条
      type: Boolean,
      default: true
    },
    defaultPane: {
      // 默认显示窗格数量
      type: Number,
      default: 4
    },
    defaultTotalPane: {
      // 默认总窗格数量
      type: Number,
      default: 16
    },
    iconShow: {
      // 对应图标是否显示
      type: Object,
      default: () => {
        return {
          stopAll: false, // 关闭全部预览
          stop: false, // 关闭单个预览
          screenshot: false, // 截图
          speech: false, // 对讲
          volume: false, // 音量调节
          fullScreen: false, // 全屏
          multiScreen: false, // 画面分割
          panePage: false, // 上一屏、下一屏
          panePageNum: false, // 当前屏页码
          tvWall: false // 快速上墙
        }
      }
    },
    pluginIconShow: {
      // 单个插件内图标是否显示
      type: Object,
      default: () => {
        return {
          showBottomIcon: true, // 图标按钮条
          hidemenuIcon: true, // 隐藏
          previewStopIcon: true, // 关闭预览
          muteIcon: true, // 开启伴音
          yuntaiIcon: true, // 云台
          niaokanIcon: true, // 开启鸟瞰
          tvwallIcon: true, // 快速上墙
          quanpingfangdaIcon: true // 全屏
        }
      }
    }
  },
  computed: {
    pluginSize() {
      // 各个视频框大小数组
      let arr = []
      if ([1, 4, 9, 16].includes(this.checkedWmode)) {
        let pWidth = `${100 / Math.sqrt(this.checkedWmode)}%`
        for (let index = 0; index < this.checkedWmode; index++) {
          if (this.isMaximize && index === this.checkedPane % this.checkedWmode) {
            arr.push({ width: '100%', height: '100%' })
          } else if (this.isMaximize && index !== this.checkedPane % this.checkedWmode) {
            arr.push({ width: pWidth, height: pWidth, position: 'absolute', left: '-9999px', top: '-9999px' })
          } else {
            arr.push({ width: pWidth, height: pWidth })
          }
        }
      } else if (this.checkedWmode === 5) {
        if (this.isMaximize) {
          arr = [
            { left: '-9999px', top: '-9999px', width: '80%', height: '100%', position: 'absolute' },
            { left: '-9999px', top: '-9999px', width: '20%', height: '25%', position: 'absolute' },
            { left: '-9999px', top: '-9999px', width: '20%', height: '25%', position: 'absolute' },
            { left: '-9999px', top: '-9999px', width: '20%', height: '25%', position: 'absolute' },
            { left: '-9999px', top: '-9999px', width: '20%', height: '25%', position: 'absolute' }
          ]
          arr[this.checkedPane % this.checkedWmode] = {
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            position: 'absolute'
          }
        } else {
          arr = [
            { left: 0, top: 0, width: '80%', height: '100%', position: 'absolute' },
            { left: '80%', top: 0, width: '20%', height: '25%', position: 'absolute' },
            { left: '80%', top: '25%', width: '20%', height: '25%', position: 'absolute' },
            { left: '80%', top: '50%', width: '20%', height: '25%', position: 'absolute' },
            { left: '80%', top: '75%', width: '20%', height: '25%', position: 'absolute' }
          ]
        }
      }
      return arr
    },
    selectedObj() {
      return this.videoStatusArr[this.checkedPane]
    },
    totalPage() {
      // 总页数
      return Math.ceil(this.videoPageData.length / this.checkedWmode) < 1
        ? 1
        : Math.ceil(this.videoPageData.length / this.checkedWmode)
    },
    nullDiv() {
      // 最后一页补窗格数
      return this.curPage * this.checkedWmode - this.defaultTotalPane > 0
        ? this.curPage * this.checkedWmode - this.defaultTotalPane
        : 0
    },
    isPlayPluginInfo() {
      // 正在播放的预览信息
      let sourceList = this.videoStatusArr.filter(item => item.isPlay)
      return sourceList
    }
  },
  data() {
    return {
      isPlay: false,
      checkedPane: 0, // 当前选中视频框的index
      showmodeShow: false, // 窗格配置显示
      checkedWmode: this.defaultPane, // 当前窗格数量
      isMaximize: false, // 单画面(双击)
      videoStatusArr: [],
      curPage: 1, // 当前页
      videoPageData: [], // 分页播放数据
      showWall: false // 显示快速上墙弹窗
    }
  },
  created() {
    this.initializeArr()
    this.videoPage()
  },
  mounted() {},
  methods: {
    ...mapActions(['getMonitorList', 'getTVList']),
    hidden(index) {
      // 隐藏窗格
      if (
        this.isMaximize
          ? index !== this.checkedPane
          : index > this.checkedWmode * this.curPage - 1 || index < this.checkedWmode * (this.curPage - 1)
      ) {
        return { position: 'absolute', left: '-9999px', top: '-9999px' }
      }
    },
    active(index) {
      // 选中窗格
      if (this.checkedPane === index) {
        return { 'border-color': '#4699f9' }
      }
    },
    prePage() {
      // 上一屏
      if (this.curPage > 1) {
        this.isMaximize = false
        this.curPage--
        this.checkedPane = (this.curPage - 1) * this.checkedWmode
      } else {
        return
      }
      for (let index = this.checkedPane; index < this.curPage * this.checkedWmode; index++) {
        // 打开当前屏预览
        if (this.videoPageData[index]) {
          this.openPreview(this.videoPageData[index])
        }
      }
      if (this.curPage < this.totalPage) {
        // 关闭上一屏预览
        for (let index = this.curPage * this.checkedWmode; index < (this.curPage + 1) * this.checkedWmode; index++) {
          if (this.videoStatusArr[index] && this.videoStatusArr[index].isPlay) {
            this.stopPreview(index, true)
          }
        }
      }
    },
    nextPage() {
      // 下一屏
      if (this.curPage < this.totalPage) {
        this.isMaximize = false
        this.checkedPane = this.curPage * this.checkedWmode
        this.curPage++
      } else {
        return
      }
      for (let index = this.checkedPane; index < this.curPage * this.checkedWmode; index++) {
        // 打开当前屏预览
        if (this.videoPageData[index]) {
          this.openPreview(this.videoPageData[index])
        }
      }
      if (this.curPage > 1) {
        // 关闭上一屏预览
        for (
          let index = (this.curPage - 2) * this.checkedWmode;
          index < (this.curPage - 1) * this.checkedWmode;
          index++
        ) {
          if (this.videoStatusArr[index] && this.videoStatusArr[index].isPlay) {
            this.stopPreview(index, true)
          }
        }
      }
    },
    pluginDom(index) {
      // 返回指定窗格的 object dom
      return index === undefined
        ? this.$refs.plugin[this.findFreePane()].$refs.object
        : this.$refs.plugin[index].$refs.object
    },
    initializeArr() {
      // 初始化窗格状态数组
      let arr = []
      for (let index = 0; index < this.defaultTotalPane; index++) {
        let obj = {
          isPlugin: true,
          playStatus: false,
          isButton: false,
          isPlay: false,
          isBoost: false,
          showVolume: false,
          volumeValue: 50
        }
        arr.push(obj)
      }
      this.videoStatusArr = arr
    },
    async clickCheckedWmode(mode) {
      // 画面切换将选中项及是否单画面置为初始值
      if (this.checkedWmode === mode.value) {
        return
      }
      for (let index = 0; index < this.defaultTotalPane; index++) {
        await this.stopPreview(index, true)
      }
      let obj = document.querySelector('.single-video-plugin')
      obj.style.opacity = '0'
      this.checkedWmode = mode.value
      this.isMaximize = false
      this.checkedPane = 0
      this.curPage = 1
      setTimeout(() => {
        obj.style.opacity = '1'
      }, 800)
      for (let index = 0; index < this.checkedWmode; index++) {
        if (this.videoPageData[index]) {
          await this.openPreview(this.videoPageData[index])
        }
      }
    },
    // className(index) {
    //   // plugin 类名逻辑
    //   let obj = {}
    //   obj.hide = this.isMaximize ? index !== this.checkedPane : index + 1 > this.checkedWmode
    //   obj.active = this.checkedPane === index
    //   return obj
    // },
    playStop() {
      // 播放停止
      // this.isPlay = !this.isPlay
      // let obj = {
      //   devIp: '192.168.20.36',
      //   devPort: 3721,
      //   channel: 1,
      //   streamType: 'main',
      //   resId: '5c26d593cc13923fd8aa59e4',
      //   cameraName: '镜头名称'
      // }
      // let obj = {rtmp: 'rtmp://58.200.131.2:1935/livetv/hunantv'}
      let arr = [
        // { rtmp: 'rtmp://58.200.131.2:1935/livetv/hunantv' },
        {
          devIp: '192.168.20.36',
          devPort: 3721,
          channel: 1,
          streamType: 'main',
          resId: '5c26d593cc13923fd8aa59e4',
          cameraName: '镜头名称'
        },
        {
          devIp: '192.168.20.36',
          devPort: 3721,
          channel: 1,
          streamType: 'main',
          resId: '5c26d593cc13923fd8aa59e4',
          cameraName: '镜头名称'
        }
      ]
      // for (let index = 0; index < 5; index++) {
      //   arr.push(JSON.parse(JSON.stringify(obj)))
      // }
      // this.openPreview({ rtmp: 'rtmp://58.200.131.2:1935/livetv/hunantv' })
      // this.openPreview(obj)
      this.openAll(arr)
    },
    clickEvent(index, clickType, paneMark) {
      // 返回参数 index：插件窗格号 clicktype：单机还是双击
      // 点击事件
      if (this.selectedObj.fullScreen) {
        return
      }
      this.checkedPane = paneMark
      if (clickType === 2) {
        let obj = document.querySelector('.single-video-plugin')
        obj.style.opacity = '0'
        this.isMaximize = this.checkedWmode !== 1 && !this.isMaximize // 单窗格不允许切换单画面
        setTimeout(() => {
          obj.style.opacity = '1'
        }, 800)
      }
    },
    updateStatus(index, obj, type) {
      // 跟新视频窗格上的功能条
      if (type === 'isButton') {
        this.videoStatusArr.forEach(element => {
          element.isButton = false
        })
      }
      // 子组件更新状态数组
      for (const key in obj) {
        this.videoStatusArr[index][key] = obj[key]
      }
    },
    findFreePane() {
      // 找出空闲窗格返回窗格索引
      for (let index = (this.curPage - 1) * this.checkedWmode; index < this.curPage * this.checkedWmode; index++) {
        if (!this.videoStatusArr[index].isPlay) {
          return index
        }
      }
      return this.checkedPane
    },
    getRealPicturebyBase64(nImgType = 1, nJpgQuality = 100) {
      // [in] nImgType     需要抓取的图片类型 1:jpg 0:bmp
      // [in] nJpgQuality    当抓取为jpg时的图片质量 1-100
      // 抓图保存成Base64数据
      let arr = []
      for (let index = 0; index < this.checkedWmode; index++) {
        let dom = this.pluginDom(index)
        dom ? arr.push(dom.GetRealPicturebyBase64(nImgType, nJpgQuality)) : arr.push('')
      }
      return arr
    },
    getCapture() {
      // 截图
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].getCapture()
      // if (this.selectedObj.isPlugin) {
      //   // 判断是插件的截图
      //   this.$refs.plugin[this.checkedPane].getCapture()
      // }
    },
    volumeSwitch() {
      // 音量开关
      if (!this.selectedObj.isPlay) {
        return
      }
      if (this.selectedObj.showVolume) {
        this.$refs.plugin[this.checkedPane].closeSound()
      } else {
        for (let index = 0; index < this.defaultTotalPane; index++) {
          // 关闭所有音量
          if (this.videoStatusArr[index].showVolume) {
            this.$refs.plugin[index].closeSound()
          }
        }
        this.$refs.plugin[this.checkedPane].openSound()
        this.$refs.plugin[this.checkedPane].setSoundValue(50)
        let soundStatue = this.$refs.plugin[this.checkedPane].getSoundValue()
        if (soundStatue.success) {
          let objVolumeValue = { volumeValue: soundStatue.Volume }
          this.updateStatus(this.checkedPane, objVolumeValue)
        } else {
          this.$Notice.warning({ title: '警告', desc: '音量获取失败！' })
        }
      }
    },
    changeVolume(v) {
      if (!this.selectedObj.isPlay) {
        return
      }
      this.$refs.plugin[this.checkedPane].setSoundValue(v)
    },
    fullScreen() {
      // 全屏
      this.$refs.plugin[this.checkedPane].fullScreen()
    },
    toWallBtn() {
      // 上墙
      if (!this.selectedObj.isPlay) {
        return
      }
      this.getTVList().then(() => {
        this.getMonitorList()
      })
      this.showWall = true
    },
    async stopPreviewALL(isDom) {
      // 关闭全部预览
      // isDom 是true 就不销毁 object 标签
      this.videoPageData = []
      for (let index = 0; index < this.videoStatusArr.length; index++) {
        await this.stopPreview(index, isDom)
        this.$refs.plugin[index].clearTOpen()
      }
      this.curPage = 1
      this.checkedPane = 0
      this.$emit('stopPreviewALL')
    },
    async stopPreview(index, isDom) {
      const element = this.videoStatusArr[index]
      if (!element.source) {
        return
      }
      let elementSource = JSON.parse(JSON.stringify(element.source))
      let obj = { isPlay: false, playStatus: false, isBoost: false, source: '' }
      if (!element.isPlugin) {
        // rtmp 停止
        this.$refs.plugin[index].stopRtmp()
      }
      if (element.isPlay && element.isPlugin) {
        // 有播放在关闭
        if (isDom) {
          obj.playStatus = true
        }
        let dom = this.pluginDom(index)
        dom && dom.CloseRealStream()
        this.$refs.plugin[index].showPTZ = false
        this.updateStatus(index, obj)
      }
      if (elementSource) {
        this.$emit('stopBack', elementSource)
      }
      if (!isDom) {
        this.videoPageData[index] = ''
      }
    },
    async openAll(data) {
      // 全部预览
      await this.stopPreviewALL(true)
      this.curPage = 1
      this.checkedPane = 0
      if (data.length > this.defaultTotalPane) {
        this.$Notice.warning({ title: '警告', desc: '无空闲窗口显示更多通道！' })
      }
      this.videoPageData = data
      for (let index = 0; index < this.checkedWmode; index++) {
        if (data[index]) {
          await this.openPreview(data[index])
        }
      }
    },
    async openPreview(data) {
      let videoData = JSON.parse(JSON.stringify(data))
      // videoData.streamType = this.checkedWmode >= 9 ? 'sub1' : 'main'
      let index = this.findFreePane()
      this.checkedPane = index
      if (this.selectedObj.isPlay) {
        this.$Notice.warning({ title: '警告', desc: '无空闲窗口显示更多通道！' })
        return
      }
      // 预览方法抛出
      if (data.hasOwnProperty('rtmp')) {
        // data = {rtmp: 'rtmp://58.200.131.2:1935/livetv/hunantv'}
        this.$refs.plugin[index].openRtmp(videoData.rtmp)
        this.updateStatus(index, { source: videoData })
        this.$emit('openBack', videoData)
        return
      }
      // 校园平台插件预览
      // --------------start-----------
      //  data = {
      //   devIp: data.devIp,
      //   devPort: data.devPort,
      //   channel: data.channel,
      //   streamType: data.streamType || 'main',
      //   resId: 资源id,
      //   cameraName: 镜头名称
      // }
      this.updateStatus(index, { isPlugin: true, playStatus: true, isButton: false, isPlay: false })
      this.$nextTick(async() => {
        let status = await openFlow(this.pluginDom(index), videoData)
        if (status !== 0) {
          this.errorMsg('开流失败！')
          this.updateStatus(index, { isPlay: false })
          return
        }
        this.$refs.plugin[index].clearTOpen()
        this.updateStatus(index, { source: videoData })
        this.videoPageData[index] = videoData
        this.$emit('openBack', videoData)
      })
      this.updateStatus(index, { isPlay: true }) // $nextTick 是异步 先改成播放状态
      // --------------end-----------
    },
    async openIndexPreview(data, index) { // 断线重连指定窗口预览
      console.log(data, index, '断线重连开始预览++++++++++++++++')
      let videoData = JSON.parse(JSON.stringify(data))
      this.updateStatus(index, { isPlugin: true, playStatus: true, isPlay: false })
      this.$nextTick(async() => {
        let status = await openFlow(this.pluginDom(index), videoData)
        if (status === 0) {
          this.$refs.plugin[index].clearTOpen()
          this.updateStatus(index, { isPlay: true, source: videoData })
          this.videoPageData[index] = videoData
          this.$emit('openBack', videoData)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.video-plugin {
  background-color: #404040;
  width: 100%;
  height: 100%;
  .no-plugin {
    font-size: 24px;
    text-align: center;
    padding: 20% 40%;
    height: calc(~'100% - 56px');
  }
  .single-video-plugin {
    position: relative;
    overflow: hidden;
    // padding: 1px;
    width: 100%;
    font-size: 0px;
    .shade-iframe {
      width: 100%;
      height: 100%;
      background-color: #404040;
      border: 0px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
    }
    // .hide {
    //   position: absolute;
    //   left: 9999px;
    //   top: -9999px;
    //   z-index: 999;
    // }
    .maximize {
      width: 100% !important;
      height: 100%;
    }
    // .active {
    //   border-color: #4699f9;
    // }
  }
  .video-bottom {
    width: 100%;
    height: 56px;
    background-color: #1b3153;
    .left,
    .right {
      float: left;
      width: 50%;
      height: 100%;
      line-height: 56px;
    }
    i {
      padding: 0 8px;
      cursor: pointer;
      font-size: 20px;
    }
    .right {
      text-align: right;
      span {
        font-size: 18px;
      }
      .dp-con {
        position: relative;
        display: inline-block;
        ul {
          position: relative;
          display: inline-block;
          background-color: #335589;
          list-style: none;
          bottom: 3px;
          color: snow;
          text-align: center;
          line-height: 40px;
          padding: 0 6px;
          border-radius: 4px;
          i {
            display: block;
            position: absolute;
            background: #335589;
            width: 14px;
            height: 14px;
            transform: rotate(45deg);
            top: 13px;
            right: -7px;
          }
          li {
            // float: left;
            display: inline-block;
            line-height: 40px;
            padding: 0 8px;
            border-right: 1px solid hsla(0, 0%, 100%, 0.1);
          }
          .active {
            color: #fda54b;
          }
        }
        li:hover {
          color: #fda54b;
          cursor: pointer;
          margin: 2px 0;
        }
      }
    }
    .disable,
    .disable:hover {
      color: #878282;
      cursor: not-allowed;
    }
  }
}
</style>
<style>
.quickTowall .ivu-modal {
  width: fit-content !important;
}
</style>
