<template>
  <div class="video-bottom video-buttons">
    <div class="video-bottom-left">

      <div class="realbtn iconfont icon-preview-stopall" :class="{disable: !playingCount}" @click="stopPreview" title="关闭全部预览"></div>
      <div class="realbtn iconfont icon-screenshot" :class="{'disable' :!state.isPlay||isPoll}" @click="getCapture" title="截图"></div>
      <div class="realbtn iconfont icon-recplayback" :class="[state.isPlay? '': 'disable', isPoll ? 'disable' : '']" title="录像" @mouseenter="showVideotape = true" @mouseleave="showVideotape = false">
        <ul v-show="showVideotape&&state.isPlay&&!isPoll" class="recplayback" style="width:178px;">
          <i class="triangle"></i>
          <li v-for="(item, i) in videotapeList" @click="openRecording(item)" :class="{active: isEnter, disable: item.display}" :key="i">{{item.label}}</li>
        </ul>
      </div>
      <div class="realbtn iconfont icon-focusing" :class="{'disable' :!state.isPlay||isPoll,'icon-niaokan':state.isBoost,'icon-nk-close':!state.isBoost}" :title="state.isBoost? '关闭鸟瞰':'开启鸟瞰'" @click="boost"></div>
      <div class="realbtn iconfont" :class="[state.isPlay&&!state.streamId ? '': 'disable',isPoll ? 'disable' : '', !state.isSpeech ? 'icon-shipinleiduijiangjinyong' : 'icon-shipinlei-duijiang']" title="对讲" @mouseenter="showIntercom = true" @mouseleave="showIntercom = false">
        <ul v-show="showIntercom&&state.isPlay&&!isPoll&&!state.streamId" class="intercom" style="width:140px;">
          <i class="triangle"></i>
          <li v-for="(item, i) in intercomList" @click="intercomClick(item)" :class="{active: isEnter, disable: item.display}" :key="i">{{item.label}}</li>
        </ul>
      </div>
      <div class="realbtn iconfont icon-focus" :class="{'disable' :!state.isPlay||state.streamId}" @click="openFocusState" title="重点关注"></div>
      <div class="realbtn iconfont icon-collection" :class="{'disable' :!state.isPlay||isPoll}" @click="quickCollection" title="组合收藏"></div>
      <div class="realbtn iconfont icon-more" :class="[state.isPlay? '': 'disable',isPoll?'disable':'']" title="高级功能" @mouseenter="showAdv = true" @mouseleave="showAdv = false">
        <ul v-show="showAdv&&state.isPlay&&!isPoll" class="iconmore" style="width:178px;">
          <i class="triangle"></i>
          <li v-for="(item, i) in advList" @click="advClick(item)" @mouseenter="item.value === '快速上墙'?showTowall=true:showTowall=false" :class="{active: isEnter}" :key="i">
            {{item.label}}
            <div v-show="showTowall&&item.value === '快速上墙'" class="showTowall">
              <iframe style="margin-left:-50%;"></iframe>
              <QuickToWall :camera="cameraId"></QuickToWall>
            </div>

          </li>
        </ul>
      </div>

      <div @mouseenter="showVolume = true" @mouseleave="showVolume = false" style="display:inline-block;">
        <div class="realbtn iconfont" :class="[!state.isPlay||isPoll ? 'disable': '', !state.isVolumeOpen ? 'icon-mute': 'icon-volume']" title="音量"  @click="soundOpen"></div>
        <div class="slider-box" style="width:120px;display:inline-block;" :style="{opacity: (showVolume||isDragging)&&state.isPlay?1:0 }">
          <slider color="#20a1ff" :range="true" :size="100" :minValue='0' @change="setVolume" @on-mousedown="isDragging=true" @on-mouseup="isDragging=false" :disabled="!state.isVolumeOpen" v-model="volume">
          </slider>
        </div>
      </div>
    </div>

    <div class="video-bottom-right">
      <div class="realbtn iconfont icon-stream-set" :class="{'disable' :!state.isPlay||isPoll}" title="码流切换" @mouseenter="(showStream = true)&&(hoverStream=state.streamType)" @mouseleave="showStream = false">
        <ul v-show="showStream&&state.isPlay&&!isPoll" class="stream-set" style="width:240px;">
          <i class="triangle"></i>
          <li v-for="(item, i) in streamList" :class="{active: item.value === hoverStream}" @mouseover="hoverStream=item.value" @click="changeStream(item.value)" :key="i">{{item.label}}</li>
        </ul>
      </div>

      <div class="realbtn iconfont icon-display-scale" :class="{'disable' :!state.isPlay||isPoll}" title="显示模式" @mouseenter="(showPattern = true)&&(hoverPattern = state.scale)" @mouseleave="showPattern = false">
        <ul v-show="showPattern&&state.isPlay&&!isPoll" class="display-scale" style="width:153px;">
          <i class="triangle"></i>
          <li v-for="(item, i) in patternList" :class="{active: hoverPattern == item.label}" @mouseover="hoverPattern=item.label" @click="setScale(item)" :key="i">{{item.label}}</li>
        </ul>
      </div>

      <div class="realbtn iconfont icon-multi-screen" title="页面分割" @mouseenter="(showFrame = true)&&(hoverScreen=plugin.showscreen)" @mouseleave="showFrame = false">
        <ul v-show="showFrame" class="multi-screen">
          <i class="triangle"></i>
          <li v-for="(item, i) in frameList" @mouseover="hoverScreen=item.value" :class="{active: hoverScreen==item.value}" @click='changeFrame(item)' :key="i">{{item.label}}
            <i v-if="i < 2" class="ivu-icon ivu-icon-arrow-down-b" @click.stop="showSubChek=!showSubChek"></i>
          </li>
          <li><Checkbox v-show="showFrame&&showSubChek&&plugin.showscreen > 4" class="sub-stream-check" v-model="useSubStream">子码流预览</Checkbox></li>
        </ul>
      </div>

      <div class="realbtn iconfont icon-full-screen" @click="fullscreen" :class="{'disable' : playingCount === 0}" title="全屏"></div>

    </div>

    <div class="selectFav" v-if="openselectFav" @click.stop>
      <iframe></iframe>
      <div class="selectFavBox">
        <div class="header">
          <div class="title">选择收藏夹</div>
          <div class="flag" @click='cancel'>
            <Icon type="close"></Icon>
          </div>
        </div>

        <div class="content">
          <div class="item">
            <table>收藏夹</table>
            <bsr-select :options="favoritesList" v-model="favoritesName" style="width:180px;float:left;"></bsr-select>
          </div>

          <div class="item" v-if="favoritesName == 'add'">
            <table>新建收藏夹</table>
            <Input v-model="nowName" placeholder="请输入..." style="width: 180px;float:left;" class='editInput' />
          </div>
        </div>
        <Button type="primary" @click='save' class="save">保存</Button>
      </div>
    </div>

    <bs-modal v-model="confirmModal" title="提示" :width="416" :mask-closable="false" @on-ok="stopAll" @on-cancel="confirmModal=false">
      <!-- <iframe></iframe> -->
      <div>
        <i class="ivu-icon ivu-icon-help-circled" style="color:#ff9900;font-size:36px;vertical-align:middle;margin:10px 20px 10px"></i>确定要关闭全部预览吗?
      </div>
    </bs-modal>

    <!--重点关注  -->
    <bs-modal v-model="openFocus" title="重点关注信息" :width="520" class="focus" :closable='false' :mask-closable="false" @on-ok="focusSave" @on-cancel="focusClose">
      <iframe></iframe>
      <div style="position:relative">
        <div v-if="showConfig">
          <span style="float:right;cursor: pointer;margin: -15px 50px 0 0" @mousedown='(openFocusSet = true) && (showConfig = false)'>
            <span>
              <i class="iconfont icon-setting"></i>&nbsp;&nbsp;配置</span>
          </span>
        </div>
        <div class="item">
          <table>发起人</table>
          <Input v-model="atteObj.userName" disabled style="width: 280px;float:left;" class='editInput' />
        </div>
        <div class="item">
          <table>镜头名称</table>
          <Input v-model="atteObj.ipcName" disabled style="width: 280px;float:left;" class='editInput' />
        </div>
        <div class="item">
          <table>位置</table>
          <Input v-model="atteObj.devLocal" disabled style="width: 280px;float:left;" class='editInput' />
        </div>
        <div class="item">
          <table>关注类别</table>
          <VSelect v-model="atteObj.attentionType" :options="allEventTypes" :maxHeight=160 id="selectType" style="width: 280px;height:32px;float:left"></VSelect>
        </div>
        <div class="item">
          <table>&nbsp;</table>
          <VSelect class="select-from" v-model="atteObj.addFollowType" :valival="getEye" :options="eventTypes" :placeholder="isVSelectFocus?'':'新增关注类型'" :clearSearchOnSelect="false" :isStream="true" :integarte="true" :maxHeight=160 :editable="true" id="selectType1" style="width: 280px;float:left" @search:blur="vselectBlur" @search:focus="isVSelectFocus=true"></VSelect>
          <i class="iconfont icon-add" style="margin-left:15px;" @click="addEyesType" ></i>
          <i class="iconfont icon-delete" style="margin-left:10px;" @click="deleteEyesType" :style="{color:disDel?'#aaa':'#fff',cursor: disDel?'not-allowed':'pointer'}"></i>
        </div>
        <div class="item" style="height: 100px;">
          <table>&nbsp;</table>
          <Input v-model="atteObj.attentionContent" :placeholder="isInputFocus?'':'关注内容描述'" @on-focus="isInputFocus=true" @on-blur="isInputFocus=false" type="textarea" style="width:280px; float:left;" class='editInput' />
        </div>

        <div class="item checked">
          <table>&nbsp;</table>
          <!-- message -->
          <Checkbox v-model="atteObj.message.Alarm">&nbsp;发送报警信息</Checkbox>
        </div>
        <!-- 产品要求，先行注释 短信/邮件 -->
        <!-- <div class="item checked">
          <table>&nbsp;</table>
          <Checkbox v-model="atteObj.message.Msg">&nbsp;发送短信信息</Checkbox>
        </div>
        <div class="item checked">
          <table>&nbsp;</table>
          <Checkbox v-model="atteObj.message.Email">&nbsp;发送邮件信息</Checkbox>
        </div> -->

        <div class="setting" v-show="openFocusSet">
          <Form ref="setting" :model="atteObj.setting" :rules="ruleValidate" :label-width="100" label-position="left">
            <Form-item label="录像时长" prop="recordTime">
              <Input v-model="atteObj.setting.recordTime" placeholder="请输入" style="width:280px" />
            </Form-item>
            <Form-item label="提醒级别" prop="level">
              <Select v-model="atteObj.setting.level" style="width:280px;float:left;">
                <Option v-for="(item, i) in levels" :value="item.value" :key="i">{{ item.label }}</Option>
              </Select>
            </Form-item>
          </form>
          <div class="item">
            <span style="float:right;">
              <Button type="ghost" @click="focusSettingClose">取消</Button>
              <Button type="primary" @click="focusSettingConfirm">确定</Button>
            </span>
          </div>
        </div>
      </div>
      <!-- <div slot="footer" style="position:relative">
        <Button type="ghost" @click="focusClose">取消</Button>
        <Button type="primary" @click="focusSave">确定</Button>
      </div> -->
    </bs-modal>
    <ShuttleTree :groupData="groupData" @editSave="seveTree" :openShuttleTree="openShuttleTree"></ShuttleTree>
  </div>
</template>

<script>
import Slider from 'components/Slider'
import { mapState, mapActions, mapMutations } from 'vuex'
import QuickToWall from '../tvwall/QuickToWall'
import ShuttleTree from 'components/videoMenu/ShuttleTree'
import { read } from 'src/storage/index'
import { SET_FOCUS } from 'http/video.api'

export default {
  components: { Slider, QuickToWall, ShuttleTree },
  props: {},
  data() {
    const recordTimeNumber = (rule, value, callback) => {
      // const re = /[0-9]/
      // const values = value + ''
      // let count = 0
      // values.split('').map(item => {
      //   if (!re.test(item)) {
      //     count++
      //   }
      // })
      // if (count > 0) {
      //   return callback(new Error('请输入有效数字'))
      // }
      const re = /^[1-9][0-9]?$/
      if (!re.test(value)) {
        return callback(new Error('请输入有效数字'))
      }
      if (value < 1 || value > 30) {
        return callback(new Error('请输入范围：1-30'))
      }
      callback()
    }
    return {
      isVSelectFocus: false,
      isInputFocus: false,
      playingCount: 0,
      isEnter: false,
      hoverScreen: '',
      hoverStream: '',
      hoverPattern: '',
      isDragging: false,
      showPreviewOpen: false,
      showVideotape: false,
      showIntercom: false,
      showStream: false,
      useSubStream: true,
      showSubChek: false,
      streamList: [
        { label: '主码流', value: 'main' },
        { label: '子码流', value: 'sub1' },
        { label: '第三码流', value: 'sub2' }
      ],
      showPattern: false,
      patternList: [
        { label: '自适应', value: { w: 0, h: 0, auto: false } },
        { label: '原比例', value: { w: 1, h: 1, auto: true } }
      ],
      showFrame: false,
      frameList: [
        { label: '16画面', value: 16 },
        { label: '9画面', value: 9 },
        { label: '4画面', value: 4 },
        { label: '单画面', value: 1 }
      ],
      volume: 50, // 音量
      showTowall: false,
      picType: 0,
      showVolume: false,
      openselectFav: false,
      favoritesList: [],
      confirmModal: false,
      favoritesName: '',
      nowName: '',
      recordpath: '',
      isSpeech: false,
      showAdv: false,
      advList: [
        { value: '快速上墙', label: '快速上墙' },
        { value: '快速回放', label: '快速回放' }
        // 需求要求，本期先把设备广播注释掉，后面需要只需要把本行放开即可  功能接口都已经成功 目前缺少按钮双态
        // { value: '设备广播', label: '设备广播' }
      ],
      openFocus: false,
      openFocusSet: false,
      // initiator: '',
      // 存储重点关注中所有说句
      atteObj: {
        // 发起人
        userName: '',
        // 镜头名字
        ipcName: '',
        // 位置
        devLocal: '',
        // 关注类别
        attentionType: '违规操作',
        // 新增关注类型
        addFollowType: '',
        // 关注内容描述
        attentionContent: '',
        // 消息
        message: {
          // 报警
          Alarm: true,
          // 短信
          Msg: false,
          // 邮件
          Email: false
        },
        // 设置
        setting: {
          // 录像时长
          recordTime: 5,
          // 提醒级别
          level: 1
        }
      },
      // eventTypes: [
      //   { label: '违规操作', value: '违规操作', noDelete: true },
      //   { label: '异常情况', value: '异常情况', noDelete: true },
      //   { label: '用户脱岗', value: '用户脱岗', noDelete: true },
      //   { label: '对讲异常', value: '对讲异常', noDelete: true },
      //   { label: '镜头异常', value: '镜头异常', noDelete: true }
      //   // { label: '自定义', value: '自定义' }
      // ],
      eventTypes: [
        // { label: '自定义', value: '自定义' }
      ],
      cameraId: '',
      levels: [
        { label: 1, value: 1 },
        { label: 2, value: 2 },
        { label: 3, value: 3 },
        { label: 4, value: 4 },
        { label: 5, value: 5 },
        { label: 6, value: 6 },
        { label: 7, value: 7 },
        { label: 8, value: 8 },
        { label: 9, value: 9 }
      ],
      //  打开设备广播 穿梭树
      openShuttleTree: false,
      // 穿梭框右边的
      groupData: [],
      addedEye: '',
      // 重点关注中两个框的验证
      ruleValidate: {
        recordTime: [{ required: true, validator: recordTimeNumber, trigger: 'change' }]
      },
      disDel: false,
      showConfig: true // 显示配置
    }
  },
  computed: {
    ...mapState({
      curNode: ({ videoOrg }) => videoOrg.curNode,
      parameters: ({ platform }) => platform.parameters,
      strFilter: ({ videoOrg }) => videoOrg.strFilter,
      favData: ({ videoOrg }) => videoOrg.favData,
      pollId: ({ videoOrg }) => videoOrg.pollId
    }),
    plugin() {
      return this.$parent.$refs.frame
    },
    // 获取当前父级中视频组件的状态
    state() {
      return this.$parent.state
    },
    videotapeList() {
      return [
        { value: '本地录像', label: this.localPlayer },
        { value: '中心录像', label: this.centrePlayer, display: this.state.streamId }
      ]
    },
    intercomList() {
      return [
        { label: this.state.isSpeech ? '关闭对讲' : '对讲', value: '对讲' },
        { label: 'IP对讲', value: 'IP对讲', display: true }
      ]
    },
    isPoll() {
      if (this.pollId) {
        return true
      } else if (this.state.isPoll) {
        return true
      }
      return false
    },
    localPlayer() {
      return this.state.isRecording ? '关闭录像' : '本地录像'
    },
    // centreRecording
    centrePlayer() {
      return this.state.isCentreRecording ? '关闭录像' : '中心录像'
    },
    allEventTypes() {
      return [
        ...this.eventTypes,
        { label: '违规操作', value: '违规操作', noDelete: true },
        { label: '异常情况', value: '异常情况', noDelete: true },
        { label: '用户脱岗', value: '用户脱岗', noDelete: true },
        { label: '对讲异常', value: '对讲异常', noDelete: true },
        { label: '镜头异常', value: '镜头异常', noDelete: true }
      ]
    }
  },
  watch: {
    'state.volumeValue'(v) {
      this.volume = v
    },
    showTowall(s) {
      if (s) {
        this.cameraId = this.activeResource().id
      }
    },
    useSubStream(s) {
      window.localStorage.useSubStream = s
    }
  },
  methods: {
    ...mapActions(['addFavorites', 'setFavorites', 'recordLog', 'getVideoConf']),
    ...mapMutations(['SET_POLL']),
    previewOpen(val) {
      // 预览
      // if (!this.isValid) return
      if (val.value === 'open') {
        // this.plugin.open()   //  缺参数
      } else if (val.value === 'stop') {
        this.plugin.stop()
      } else if (val.value === 'stopAll') {
        this.plugin.stopAll()
      }
    },
    activeResource() {
      return this.plugin.pluginData[this.plugin.activedIndex]
    },
    stopPreview() {
      if (!this.playingCount) {
        return
      }
      this.confirmModal = true
    },
    stopAll() {
      if (!this.plugin) {
        return
      }
      this.plugin.stopAll()
      this.plugin.clearTOpenAll()
      this.confirmModal = false
      if (this.pollId) {
        this.plugin.clearTimedPlay()
        this.SET_POLL('')
      }
      this.plugin.activedIndex = 0
      this.plugin.curPage = 0
    },
    soundOpen() {
      // 伴音
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      if (!this.state.isVolumeOpen) {
        this.plugin.openSound()
        this.plugin.setVolume(50)
        this.plugin.getVolume()
        if (this.state.isSpeech) {
          this.intercomClick({ label: this.state.isSpeech ? '关闭对讲' : '对讲', value: '对讲' })
        }
      }
      if (this.state.isVolumeOpen) {
        this.plugin.closeSound()
      }
    },
    setVolume(v) {
      // 设置音量
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      this.plugin.setVolume(v)
      this.plugin.getCapture()
    },
    getCapture() {
      // 抓图
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      this.plugin.getPicture()
    },
    boost() {
      // 鸟瞰
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      this.plugin.boost()
    },
    setScale(val) {
      // 模式
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      this.state.scale = val.label
      this.plugin.setScale(val.value)
    },
    changeStream(streamType) {
      // 码流
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      if (this.state.streamType === streamType) {
        return
      }
      this.plugin.setStream(streamType)
      // 切换码流前的一系列操作
      if (this.state.scale !== '自适应') {
        this.setScale(this.patternList[0])
      }
      if (this.state.isVolumeOpen) {
        this.plugin.closeSound()
      }
      if (this.state.isRecording) {
        this.plugin.closeRecording()
      }
      if (this.state.isSpeech) {
        this.intercomClick()
      }
      if (this.state.isBoost) {
        this.boost()
      }
      // 判断如果切换码流时正在进行中心录像就将其关闭
      if (this.state.isCentreRecording) {
        this.plugin.stopCentreRecord()
      }

      const param = this.plugin.pluginData[this.plugin.activedIndex]
      param.streamType = streamType
      this.plugin.changeStream(param)
    },
    changeFrame(val) {
      // 多画面
      this.plugin.setShowscreen(val.value)
    },
    fullscreen() {
      // 全屏
      if (this.playingCount === 0) {
        return
      }
      if (this.$root.isFullscreen) {
        this.exitFullscreen()
        this.$root.$el.classList.remove('fs')
        this.plugin.isSingleFullscreen = false
      } else {
        this.requestFullscreen()
        this.$root.$el.classList.add('fs')
        this.plugin.isSingleFullscreen = false
      }
    },
    openRecording(val) {
      // 录像
      if (val.value === '本地录像') {
        // 判断如果正在进行中心录像就将其关闭
        if (this.state.isCentreRecording) {
          this.plugin.stopCentreRecord()
        }
        if (!this.state.isPlay || this.isPoll) {
          return
        }
        if (!this.state.isRecording) {
          this.getVideoConf() // 同步localStorage数据到本地配置
          const type = this.parameters.videotape === 'BSR' ? 'bsr' : 'avi'
          let fileName =
            this.activeResource().name + '-' + this.$moment(new Date()).format('YYYYMMDDHHmmss') + '.' + type
          this.recordpath = this.parameters.localVideoPath + '\\' + fileName.toString()
          const param = {
            path: this.recordpath,
            type: this.parameters.videotape === 'BSR' ? 4 : 6,
            mode: 0
          }
          const pathState = this.plugin.openRecording(param)
          if (pathState) {
            this.$Notice.error({ title: '失败', desc: '录像保存位置出错！' })
            return
          }
        }
        if (this.state.isRecording) {
          this.plugin.closeRecording()
          this.$Notice.success({ title: '成功', desc: '录像已保存到' + this.recordpath })
          this.recordpath = ''
        }
      }
      if (val.value === '中心录像') {
        if (this.state.streamId) {
          return
        }
        // console.log('this.state.isCentreRecording=>', this.state.isCentreRecording)
        if (this.state.isCentreRecording) {
          this.plugin.stopCentreRecord()
        } else {
          // 判断如果正在进行本地录像就将其关闭
          if (this.state.isRecording) {
            this.plugin.closeRecording()
          }
          this.plugin.openCentreRecord()
        }
      }
    },
    // 收藏
    quickCollection() {
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      this.openselectFav = true
      for (const i in this.favData) {
        this.favoritesList.push({
          label: this.favData[i].name,
          value: i
        })
      }
      this.favoritesList.push({
        label: '新建收藏夹',
        value: 'add'
      })
      this.favoritesName = 'add'
    },
    cancel() {
      this.favoritesName = ''
      this.favoritesList = []
      this.openselectFav = false
      this.nowName = ''
    },
    save() {
      // 未添加收藏的设备
      const pluginData = this.plugin.pluginData
      if (this.favoritesName === 'add') {
        if (this.nowName) {
          if (this.nowName.length > 26) {
            this.warningMsg('收藏夹名字不能超过26个字符')
            return
          }
          let ids = []
          for (const i in pluginData) {
            if (pluginData[i].id) {
              ids.push(pluginData[i].id.split('_')[0])
            }
          }
          ids = this.$lodash.uniq(ids)
          var temp = { name: this.nowName, ids: ids }
          this.addFavorites(temp)
            .then(res => {
              this.successMsg('收藏成功！')
            })
            .catch(error => {
              if (error.response) {
                this.errorMsg(error.response.data.message)
              } else {
                this.errorMsg('收藏失败！')
              }
            })
        } else {
          this.warningMsg('请输入新建收藏夹名称')
          return
        }
      } else {
        var obj = this.$lodash.cloneDeep(this.favData[this.favoritesName])
        obj.resources = []
        for (const i in obj.children) {
          obj.resources.push(obj.children[i]._id.split('_')[0])
        }
        for (const i in pluginData) {
          if (pluginData[i].id) {
            obj.resources.push(pluginData[i].id.split('_')[0])
          }
        }
        obj.resources = this.$lodash.uniq(obj.resources)
        delete obj.children
        this.setFavorites(obj)
          .then(res => {
            this.successMsg('收藏成功！')
          })
          .catch(error => {
            if (error.response) {
              this.errorMsg(error.response.data.message)
            } else {
              this.errorMsg('收藏失败！')
            }
            console.log(error)
          })
      }
      this.cancel()
    },
    // 点击高级功能
    advClick(item) {
      if (item.label === '设备广播') {
        this.openShuttleTree = true
        console.log('*************************************', item)
      } else if (item.label === '快速回放') {
        this.plugin.plugin.nowDateSave()
        this.plugin.plugin.celerityPlayback()
      }
    },
    intercomClick(item) {
      if (this.state.streamId) {
        return
      }
      this.isSpeech = this.state.isSpeech
      if (item.value === 'IP对讲') {
        return
      }
      if (!this.state.isPlay || this.isPoll) {
        return
      }
      if (this.state.isSpeech) {
        this.plugin.stopSpeech()
        this.plugin.closeSpeech()
      } else {
        if (this.state.isVolumeOpen) {
          this.plugin.closeSound()
        }
        this.plugin.openSpeechEx()
      }
    },
    openFocusSetClick() {
      this.openFocusSet = true
    },
    // 保存设备广播穿梭树
    seveTree(tree) {
      if (tree.length > 0) {
        this.plugin.openSpeechEx(
          tree.map(item => {
            return {
              ip: item.eid.ip,
              port: item.eid.cport,
              channel: item.chan
            }
          })
        )
      }
    },
    // 关闭重点关注弹框
    focusClose() {
      this.openFocus = false
      // 重置所有输入
      this.atteObj = {
        // 发起人
        userName: '',
        // 镜头名字
        ipcName: '',
        // 位置
        devLocal: '',
        // 关注类别
        attentionType: '违规操作',
        // 关注内容描述
        attentionContent: '',
        // 消息
        message: {
          // 报警
          Alarm: true,
          // 短信
          Msg: false,
          // 邮件
          Email: false
        },
        // 设置
        setting: {
          // 录像时长
          recordTime: 5,
          // 提醒级别
          level: 1
        }
      }
    },
    // 关闭重点关注设置弹框
    focusSettingClose() {
      this.showConfig = true
      this.openFocusSet = false
      this.atteObj.setting.level = 1
    },
    // 确定
    focusSettingConfirm() {
      this.$refs.setting.validate(valid => {
        if (valid) {
          this.showConfig = true
          this.openFocusSet = false
        } else {
          this.$Notice.warning({ desc: '录像时长范围为1~30分钟！', title: '警告' })
        }
      })
    },
    // 保存重点关注的弹框
    focusSave() {
      let arr = []
      for (let i in this.atteObj.message) {
        if (this.atteObj.message[i]) {
          arr.push(i)
        }
      }
      const obj = {
        devIp: this.activeResource().ip,
        devPort: this.activeResource().port,
        channel: this.activeResource().channel,
        mType: this.activeResource().monitorType,
        streamType: this.activeResource().streamType,
        attentionType: this.atteObj.attentionType.value || this.atteObj.attentionType,
        userName: this.atteObj.userName,
        level: this.atteObj.setting.level,
        ipcName: this.atteObj.ipcName,
        devLocal: this.atteObj.devLocal,
        attentionContent: this.atteObj.attentionContent,
        sendMsg: arr,
        recordTime: this.atteObj.setting.recordTime * 60
      }
      // console.log('focusSave', obj)
      const param = {
        logType: '操作日志',
        module: '现场视频',
        operateName: '重点关注',
        operateContent: `重点关注`,
        target: this.atteObj.ipcName,
        deviceIp: this.activeResource().ip
      }
      this.recordLog(param)
      SET_FOCUS(obj)
        .then(item => {
          this.focusClose()
          this.$Notice.success({ title: '成功', desc: '关注成功' })
        })
        .catch(() => {
          this.$Notice.error({ title: '失败', desc: '关注失败！' })
        })
    },
    // 打开重点关注弹框
    openFocusState() {
      if (!this.state.isPlay || this.state.streamId) {
        return
      }
      this.atteObj.userName = read('user.username')
      this.atteObj.ipcName = this.activeResource().name
      this.atteObj.devLocal = this.activeResource().orgPath
      this.atteObj.addFollowType = ''
      this.openFocus = true
      this.showConfig = true
      this.openFocusSet = false
    },
    getEye(val) {
      this.addedEye = val
      this.disDel = this.eventTypes.filter(item => item.noDelete && item.value === val).length > 0
      if (val) {
        return val.toString()
      }
    },
    vselectBlur() {
      this.isVSelectFocus = false
    },
    addEyesType() {
      // 新增关注类型eventTypes
      if (this.addedEye) {
        let tip = 0
        this.allEventTypes.forEach((index, i) => {
          if (index.value === this.addedEye && !tip) {
            this.$Notice.error({ title: '失败', desc: '添加项已经存在！' })
            tip = 1
          }
        })
        if (!tip) {
          this.eventTypes.push({
            label: this.addedEye,
            value: this.addedEye
          })
          this.$Notice.success({ title: '成功', desc: '添加类别成功' })
        }
      }
      this.addedEye = ''
      this.atteObj.addFollowType = ''
    },
    deleteEyesType() {
      // 删除关注类型
      if (this.disDel) {
        return
      }
      if (this.addedEye) {
        let ix = -1
        let noDel = false
        this.eventTypes.forEach((index, i) => {
          if (index.value === this.addedEye) {
            ix = i
            noDel = index.noDelete
          }
        })
        if (noDel) {
          return
        }
        if (ix === -1) {
          this.addedEye = ''
          this.$Notice.info({ title: '提示', desc: '该类别不存在！' })
          return
        }
        this.eventTypes.splice(ix, 1)
        this.addedEye = ''
        this.atteObj.addFollowType = ''
      } else {
        this.addedEye = ''
        this.atteObj.addFollowType = ''
      }
    }
  },
  created() {
    const _this = this
    this.$on('editCancel', function() {
      _this.openShuttleTree = false
    })
    if (window.localStorage.useSubStream === undefined) {
      window.localStorage.useSubStream = true
    }
    this.useSubStream = window.localStorage.useSubStream === 'true'
    this.unload = () => {
      // 判断如果正在进行中心录像就将其关闭
      if (this.state.isCentreRecording) {
        this.plugin.stopCentreRecord()
      }
    }
    window.onbeforeunload = this.unload
  },
  beforeDestroy() {
    window.onbeforeunload = this.unload = null
    this.stopAll()
  }
}
</script>

<style>
#selectType .dropdown-toggle,
#selectType1 .dropdown-toggle {
  height: 32px;
}
#selectType .form-control,
#selectType1 .form-control {
  height: 32px;
}
#selectType .selected-tag,
#selectType1 .selected-tag {
  height: 31px;
  line-height: 31px;
  margin-left: 5px;
}
#selectType.v-select .open-indicator,
#selectType1.v-select .open-indicator {
  top: 13px;
}
.editInput textarea {
  resize: none;
  height: 80px;
}
#selectType1 ::-webkit-input-placeholder {
  color: #aaa;
}
.item ::-webkit-input-placeholder {
  color: #aaa;
}
</style>
<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
}
.ivu-checkbox-wrapper {
  margin-right: 0 !important;
}
.video-bottom {
  height: 40px;
  width: 100%;
  padding: 0;
  position: absolute;
  bottom: 0px;
  background: #1b3153;
  font-size: 12px;
}

.video-bottom .video-bottom-left {
  float: left;
  height: 100%;
  padding-left: 5px;
}

.video-bottom .video-bottom-right {
  float: right;
  height: 100%;
  padding-right: 5px;
}
.video-bottom .ivu-icon-arrow-down-b {
  background: none;
  transform: none;
  font-style: normal;
  right: -3px;
  left: auto;
  bottom: -2px;
}
.video-bottom .realbtn {
  color: #cfd7e6;
  display: inline-block;
  position: relative;
  cursor: pointer;
  font-size: 20px;
  padding: 0 11px;
  margin-top: 14px;
}
.sub-stream-check {
  position: absolute;
  width: 100px;
  bottom: 20px;
  right: 162px;
  height: 40px;
  line-height: 40px;
  padding-right: 20px;
  z-index: 99;
  color: #fff;
}

.video-bottom .realbtn.disable,
.video-bottom .realbtn.disable:hover {
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}
.video-bottom .realbtn:hover {
  color: #fda54b;
}
.video-bottom .realbtn:active {
  color: #c47019;
}

.video-bottom .showTowall {
  position: absolute;
  list-style: none;
  background-color: #1b3153;
  color: #fff;
  border: 1px solid #00a5e3;
  border-radius: 0 0 3px 3px;
  text-align: center;
  bottom: 30px;
  z-index: 99999;
  left: calc(50% + 26px);
  transform: translate(-50%, 0);
}
.video-bottom ul {
  z-index: 99999;
  position: absolute;
  list-style: none;
  bottom: -4px;
  color: #fffafa;
  text-align: center;
  background: #335589;
  height: 40px;
  padding: 0 12px;
  margin-right: 25px;
  border-radius: 4px;
}
.multi-screen {
  left: -304px;
}
.stream-set {
  left: -244px;
}
.display-scale {
  left: -158px;
}
.multi-screen .triangle {
  left: 293px;
}
.stream-set .triangle {
  left: 233px;
}
.display-scale .triangle {
  left: 146px;
}
.video-bottom-left ul .triangle {
  left: -7px;
}
.video-bottom-left ul {
  left: 46px;
}

.video-bottom ul li {
  position: relative;
  z-index: 199999999;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  margin-top: 10px;
  display: inline-block;
  padding: 0 14px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.video-bottom ul li:last-child {
  border-right: 0;
}

.video-bottom ul li.active,
.video-bottom ul li:hover {
  color: #fa8a3b;
}
.video-bottom ul li.disable,
.video-bottom ul li.disable:hover {
  color: #878282;
  cursor: not-allowed;
}

.video-bottom ul .triangle {
  display: block;
  position: absolute;
  background: #335589;
  width: 14px;
  height: 14px;
  transform: rotate(45deg);
  top: 13px;
}

iframe {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}

.selectFav {
  color: #fff;
  width: 310px;
  height: 210px;
  position: absolute;
  background: #1b3153;
  top: 50vh;
  left: 50vw;
  margin-left: -500px;
  margin-top: -1000px;
  z-index: 9999999;
}
iframe,
.selectFavBox {
  background-color: transparent;
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 0 none;
}
.header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #0f2343;
  padding: 0 10px;
  margin-bottom: 10px;
  background: #0f2343;
}
.header .title {
  float: left;
}
.header .flag {
  float: right;
  cursor: pointer;
}
.selectFav .content {
  padding: 0;
}
.content div.item {
  padding: 10px 15px;
  width: 100%;
  height: 50px;
}
.content div.item table {
  width: 75px;
  line-height: 32px;
  float: left;
}
.save {
  position: absolute;
  right: 20px;
  bottom: 12px;
}

.focus div.item {
  padding: 10px;
  width: 100%;
  height: 50px;
}
.focus div.checked {
  padding: 0px;
  height: 36px;
}
.focus div.item table {
  width: 75px;
  line-height: 32px;
  float: left;
}
.focus div.checked table {
  width: 80px;
}
.focus div.item i {
  cursor: pointer;
}

.focus .setting {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99999999;
  background: #1b3153;
}
li.ivu-select-item {
  padding: 7px 16px;
}
.multi-screen {
  width: 300px;
}
.multi-screen i {
  bottom: 20px;
  left: 182px;
}
.stream-set i,
.display-scale i,
.recplayback i,
.intercom i {
  bottom: 20px;
  left: 140px;
}
.iconmore i {
  bottom: 20px;
  left: 162px;
}
</style>
