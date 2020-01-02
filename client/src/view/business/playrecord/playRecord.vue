<template>
  <!-- 案件处理 -->
  <div class="caseProcessing">
    <!-- 机构树 -->
    <div class="left">
      <div class="leftTop">
        <Tabs style="height:100%;" @on-click="tabClick" ref="tabs" :animated="false">
          <TabPane label="案件列表" name="caselist" style="height:100%;">
            <!-- 搜索栏 -->
            <div class="case-list-top" style="width:100%;padding:8px">
              <!-- 输入框 -->
              <Input v-model="searchCaseName" icon="android-search" placeholder="请输入案件名称" @on-click="searchCase" @on-focus="onFocus" @on-blur="onBlur"></Input>
              <!-- 搜索结果栏 -->
              <ul class="case-names" v-show="searchResultToggle && resultCaseNames.length !== 0">
                <li v-for="(item, index) in resultCaseNames" :key="index" @click="getEventDetails(item, 'case')">{{item.eventName}}</li>
              </ul>
              <div class="case-names" v-show="searchResultToggle && resultCaseNames.length === 0">
                <span class="reminder">无匹配项</span>
              </div>
            </div>
            <!-- 机构树 -->
            <div class="case-list-bottom">
              <CaseProcessingTree ref="caseTree" :treeData="caseDataTree" :type="tabPane" @close="clearData" @dblclickData="dblclickData" @saveVideo="saveVideo" :disabledSaveIcon="caseID"></CaseProcessingTree>
            </div>
          </TabPane>
          <TabPane label="追踪列表" name="tracklist" style="height:100%;">
            <!-- 输入框 -->
            <div class="case-list-top" style="width:100%;padding:8px">
              <Input v-model="searchTrackName" icon="android-search" placeholder="请输入追踪事件名称"></Input>
            </div>
            <!-- 机构树 -->
            <div class="case-list-bottom">
              <Spin size="large" class="spin" v-if="spintoogle"></Spin>
              <CaseProcessingTree ref="trackTree" v-else :treeData="trackDataTree" :search="searchTrackName" :type="tabPane" @close="clearData" @dblclickData="dblclickData" @nodeClick="nodeClick"></CaseProcessingTree>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
    <!-- 视频窗口 -->
    <div class="center">
      <!-- 视频窗口 -->
      <div class="video-box">
        <playbackVideo style="width:100%;height:100%" ref="playbackVideo" :type="tabPane" @playEnd="finishPlay" @screen="screen" @avtiveChange='avtiveChange' @changePluginData="changePluginData" @pause="pauseEvent" @resume="resumeEvent" @isCase="isCaseToggle" @clickCase="clickCase" @isStopAll="isStopAll"></playbackVideo>
      </div>
      <!-- 时间轴 -->
      <div class="timeaxis">
        <TimeLine v-model="timelineValue" :disabled="disabledTimeline" :showThumb="showThumb" :stepLength.sync="stepLength" :unParsedValue.sync="timelineValueUnParsed" :cutTime="cutTime" :isCut="isCut" @ondrag="dragTimeline" @thumbClick="thumbClick" @upTimeList="upTimeList" ref="timeLine" :recordInfo="recordInfo" @changeSync="changeSync" @tagTimeName="openTagTimeModal" @mouseDown="timelineMouseDown"></TimeLine>
      </div>
    </div>
    <!-- 右侧信息栏 -->
    <div class="right">
      <!-- 信息列表 -->
      <caseInfo :type="infoType" :infoData="InfoData"></caseInfo>
    </div>

    <!-- 确认框 -->
    <Modal v-model="confirmModal" :title="modalTitle" :width="416" :closable="false" :mask-closable="false">
      <iframe v-if="confirmModal"></iframe>
      <div class="confirmModal">
        <i class="ivu-icon ivu-icon-help-circled"></i>
        <div v-if="modalType === 'caseModal'">
          <p>是否要删除名为&nbsp;&nbsp;<span>{{deleteCaseTime.tagName === '' ? '默认录像段' : deleteCaseTime.tagName}}</span>&nbsp;&nbsp;的录像段？</p>
          <br>
          <p>起止时间为：<br><span>{{deleteCaseTime.startTime ? $moment(deleteCaseTime.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>  至  <span>{{deleteCaseTime.endTime ? $moment(deleteCaseTime.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
        </div>
        <div v-else-if="modalType === 'treeModal'">是否保存案件的录像文件？</div>
        <div v-else-if="modalType === 'tagTimeModal'" class="tagTimeModal">
          <Input v-model="tagTimeName" placeholder="请命名标记段名称..." style="width:200px;"/>
          <span>*命名不可为空</span>
        </div>
        <div v-else-if="modalType === 'severModal'">
          <p>服务器正在备份其他事件</p>
          <p>若<span>&nbsp;确定&nbsp;</span>备份当前事件</p>
          <p>服务器将取消正在备份事件</p>
        </div>
      </div>
      <div slot="footer" style="position:relative">
        <Button type="ghost" @click="cancelModal(true)" v-show="modalType !== 'tagTimeModal'">取消</Button>
        <Button type="primary" @click="saveModal">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CaseProcessingTree from '@src/components/videoMenu/caseProcessingTree.vue'
import playbackVideo from './playbackVideo.vue'
import TimeLine from './BStimeLine.vue'
import caseInfo from './caseInfo.vue'
import hook from './requestHook'
import asyncPlay from './asyncPlay'
import syncPlay from './syncPlay'
import nvrPlay from './nvrPlay'
import nvrPlaySync from './nvrPlaySync'
import timelineCalc from './timelineCalc'
import gbPlay from './gbPlay.js'
import segment from './segmentPlay.js'

import { mapState, mapMutations, mapActions } from 'vuex'
import {
  getCaseProcessing,
  getCaseParticulars,
  setVideoTime,
  getRemotedownload,
  gudgingDown,
  getCaseAlarmDetails
} from '@src/http/business/caseProcessing.api'
import { getTrackingxg, getTrackingTree } from '@src/http/business/tracking.api'
const TAG_TYPE = 2147483647
export default {
  name: 'caseProcessing',
  components: {
    playbackVideo,
    CaseProcessingTree,
    caseInfo,
    TimeLine
  },
  mixins: [hook, syncPlay, asyncPlay, nvrPlay, nvrPlaySync, timelineCalc, gbPlay, segment],
  created() {
    this.CLEAR_RESOURCE()
    this.drawTimeline = this.$lodash.debounce(this._drawTimeline.bind(this), 100) // 绘制时间轴
    this.getCase = this.$lodash.throttle(this.getCaseList, 1000)
    this.getTrack = this.$lodash.throttle(this.getTrackList, 1000)
    this.getEventDetail = this.$lodash.throttle(this._getEventDetail, 1000)
  },
  mounted() {
    // 判断是否为跳转过来的
    /**
     * 案件管理-实时按键-结果详情-追踪结果-一键播放
     * 案件管理-历史按键-结果详情-追踪结果-一键播放
     * 接力追踪-事件追踪-追踪结果-一键播放
     * 接力追踪-历史追踪-追踪结果-一键播放
     */
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.skipModal = true
      this.CHANGE_SYNC(true)
      // 判断跳转过来的事件
      this.$nextTick(() => {
        let params = this.$route.params
        // 接力追踪事件
        this.tabClick('tracklist')
        this.$refs.tabs.activeKey = 'tracklist'
        // 有一个visibility样式，在使用【activeKey】触发后不显示，只能手动设置
        let _d = document.querySelectorAll('.left .ivu-tabs .ivu-tabs-tabpane:last-child > div')
        setTimeout(() => {
          _d[0].style.visibility = 'visible'
          _d[1].style.visibility = 'visible'
        }, 500)
        let _timer = setInterval(() => {
          // 当搜索到结果后
          if (this.trackDataTree.length) {
            this.searchTrackName = params.name // 自动搜索状态
            this.getEventDetail(params.id, params.type) // 获取详情
            clearInterval(_timer)
          }
        }, 500)
      })
    }
    this.$nextTick(() => {
      // 插件组件的所有插件
      // client\src\components\video\VideoPlugin.vue
      this.plugins = this.$refs.playbackVideo.$refs.frame.plugins
    })
  },
  data() {
    return {
      tagTimeName: '', // 标记段命名
      tagTimeObj: {}, // 当前标记段数据
      disabledTimeline: false,
      activeData: '',
      plugins: null, // 视频插件
      showThumb: 1, // 画面窗口个数
      stepLength: 7200, // 时间轴一格的时间长度
      // 默认的时间轴值
      defaultTimelineValue: (() => {
        const d = new Date()
        d.setHours(12)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
      })(),
      // 时间轴的值
      timelineValue: (() => {
        const d = new Date()
        d.setHours(12)
        d.setMinutes(0)
        d.setSeconds(0)
        return d.getTime()
      })(),
      timelineValueUnParsed: 0, // 时间轴准确到毫秒 值
      recordInfo: [], // 时间轴使用的数据对象
      calendarTime: new Date(),
      isCut: false,
      cutTime: '',
      // 案件处理新增
      getCase: null,
      getTrack: null,
      InfoData: {}, // 【案件事件】/【接力追踪】信息数据
      caseDataTree: [], // 最初获取的案件处理【案件录像】数据 树的数据
      searchResultToggle: false, // 是否显示搜索列表弹窗
      searchCaseName: '', // 搜索事件的名称
      resultCaseNames: [], // 搜索事件的结果
      trackDataTree: [], // 最初获取的案件处理【案件录像】数据 树的数据
      trackEventId: '', // 当前正在播放的【接力追踪】事件的id
      searchTrackName: '', // 搜索【接力追踪】的名称
      tabPane: 'caselist', // 选中的tabPane
      infoType: 'caselist', // 信息列表 类型 caselist【案件信息】 / tracklist【追踪信息】
      caseDateTimeClick: [], // 【事件处理】点击的【事件时间】段的数据 资源id和时间段下标
      tmpData: [], // 记录当前播放的resource
      confirmModal: false, // 删除确认弹窗
      deleteCaseTime: {}, // 【事件处理】删除的事件data
      modalType: '', // 弹窗类型
      trackResData: {}, // 【接力追踪】的res参数
      isEvent: false,
      skipModal: false, // 跳转过来的
      once: true, // 给【案件处理】-【接力追踪】-【一键同步】播放初次设定使用
      modalTitle: '', // modal的title
      clickTimeLine: false,
      spintoogle: true // spin开关
    }
  },
  computed: {
    ...mapState({
      // curNode: ({ videoOrg }) => videoOrg.curNode, // 当前选中的节点
      isSync: ({ playback }) => playback.isSync, // 是否同步
      activedId: ({ playback }) => playback.activedId, // 视频窗口中焦点的_id
      resourceList: ({ playback }) => playback.resourceList, // 检索出来的所有查询到的资源 array
      caseResChecked: ({ dutyList }) => dutyList.caseResChecked, // 案件处理 选中案件镜头
      caseID: ({ dutyList }) => dutyList.caseID, // 案件处理 选中案件
      caseIndex: ({ dutyList }) => dutyList.caseIndex, // 案件处理 事件录像段下标
      caseTime: ({ playback }) => playback.caseTime, // 【事件管理】事件的开始结束时间
      caseEdit: ({ dutyList }) => dutyList.caseEdit // 【案件处理】是否可编辑
    }),
    // 插件组件对象
    plugin() {
      // client\src\components\video\VideoFrame.vue
      return this.$refs.playbackVideo.$refs.frame
    },
    // 操作按钮的组件引用
    buttons() {
      // client\src\view\business\playrecord\playRecord.vue
      return this.$refs.playbackVideo
    },
    // 当前激活窗口的index
    activedIndex: {
      get() {
        return this.plugin.activedIndex
      },
      set(i) {
        this.plugin.activedIndex = i
      }
    },
    // 激活窗口插件的data
    pluginData() {
      return this.$refs.playbackVideo.$refs.frame.pluginData
    },
    // 时间轴组件的引用
    timelineRef() {
      // client\src\view\business\playrecord\BStimeLine.vue
      return this.$refs.timeLine
    }
  },
  watch: {
    // 监听【事件】机构树输入框
    searchCaseName(val) {
      if (val) {
        this.searchResultToggle = true
        this.getCase()
      } else {
        clearInterval(this.saveStatus)
        this.searchResultToggle = false
        this.caseDataTree = []
      }
    },
    // resourceList数据变化后，绘制时间轴
    resourceList(l) {
      console.log('resourceList', this.$lodash.cloneDeep(l))
      // 当开流 && 录像无资源时（资源被事件的开始/结束时间修正过）
      // 出弹窗提醒
      let timer = setInterval(() => {
        if (!this.buttons.state.isStopped && this.resourceList.length) {
          if (!l.filter(e => e && e.eventList && e.eventList.length).length) {
            this.warningMsg('该事件起始时间内，无录像')
          }
          clearInterval(timer)
        } else if (this.buttons.state.isStopped && !this.resourceList.length) {
          clearInterval(timer)
        }
      }, 1000)
      this.drawTimeline()
    },
    stepLength() {
      this.drawTimeline()
    },
    timelineValue(t) {
      if (this.isNeedRecalcTimeline(t, this.stepLength)) {
        this.drawTimeline()
      }
    },
    // 控制焦点
    activedId(id) {
      if (id) {
        const index = id.split('_')[1]
        const _id = id.split('_')[0]
        if (index >= this.showThumb) {
          return
        }
        this.activedIndex = +index
        this.SET_FAVID(_id)
        this.SET_ORGID(_id)
        this.changeTimeline()
      }
    },
    /** 监测 是否可以编辑
     * true 暂停
     * false 恢复
     */
    caseEdit(val) {
      if (val) {
        // this.buttons.pause()
      } else {
        // this.buttons.resume()
        this.clickTimeLine = false
        this.changeTimeline()
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_CASETIME', // 设置【事件管理】事件的开始结束时间
      'CHANGE_NVR',
      'SET_FAVID',
      'SET_ORGID',
      // 'SET_CURNODE',
      'CHANGE_SYNC',
      'CHANGE_ACTIVEID',
      'SET_RESOURCE',
      'CLEAR_RESOURCE',
      // 'CHECK_SYNC',
      'SET_CASE_ID', // 设置 案件处理 选中案件
      'SET_CASE_EDIT', // 设置编辑开关
      'SET_CASE_INDEX', // 标记段的下标
      'SET_CASE_MARKING_TOOGLE'
    ]),
    ...mapActions(['recordLog', 'getCameraPower']),
    // 鼠标点击时间轴时 使定时器 return
    timelineMouseDown() {
      this.clickTimeLine = true
    },
    // 全部停止时
    isStopAll() {
      this.tmpData = []
      this.trackEventId = ''
      this.isEvent = false
      setTimeout(() => {
        for (let i = 0; i < 16; i++) {
          this.plugins[i] && this.plugins[i].caseProcessShow() // 清空遮盖
        }
      }, 500)
      this.activedIndex = 0
      this.clickTimeLine = false
      this.clearTimer()
      this.CLEAR_RESOURCE()
    },
    // 点击tab时
    tabClick(val) {
      // 点击tab时，如果开流就关流
      if (!this.buttons.state.isStopped) {
        this.buttons.stopAll(1)
      }
      this.tabPane = val
      this.infoType = val
      this.clearData()
      this.clearTimer()
      if (val === 'tracklist') {
        this.InfoData = {
          name: '',
          mark: '',
          resource: []
        }
        clearInterval(this.saveStatus)
        this.getTrack()
      } else if (val === 'caselist') {
        this.spintoogle = true
        this.InfoData = {
          eventName: '',
          person: '',
          phone: '',
          department: '',
          incidentAddress: '',
          endTime: '',
          alarmTime: '',
          description: '',
          images: []
        }
        this.trackDataTree = []
      }
    },
    // 搜索栏获得焦点时
    onFocus() {
      this.searchResultToggle = true
    },
    // 搜索栏失去焦点时
    onBlur() {
      setTimeout(() => {
        this.searchResultToggle = false
      }, 200)
    },
    // 点击搜索按钮
    searchCase() {
      if (this.tabPane === 'caselist') {
        if (this.searchCaseName) {
          this.searchResultToggle = true
          this.getCase()
        } else {
          this.searchResultToggle = false
        }
      }
    },
    // 【案件事件】输入框结果模糊查询，至搜索结果栏
    getCaseList() {
      getCaseProcessing() // 通过案件id获取指定案件树结构
        .then(res => {
          if (this.searchCaseName === '') {
            this.resultCaseNames = []
            return
          }
          this.resultCaseNames = res.data.filter(item => {
            let reg = new RegExp(this.searchCaseName)
            return reg.test(item.eventName)
          })
        })
        .catch(err => {
          this.warningMsg('案件事件列表获取失败！')
          console.log(err)
        })
    },
    // 【接力追踪】获取树数据
    getTrackList() {
      getTrackingTree()
        .then(res => {
          this.spintoogle = false
          this.trackDataTree = res.data
        })
        .catch(err => {
          this.spintoogle = false
          this.warningMsg('接力追踪事件获取失败！')
          console.log(err)
        })
    },
    // 点击【搜索结果栏】,选择事件
    getEventDetails(item, status) {
      this.searchResultToggle = false
      if (status === 'case') {
        // 【案件事件】
        this.SET_CASE_ID(item._id) // 【案件处理】，将案件的id存储到vuex中
        this.getCaseParticulars(item._id) // 获取当案件的详情
      }
    },
    // 获取【案件事件】当前案件的详情
    getCaseParticulars(val) {
      getCaseParticulars(val)
        .then(res => {
          /**
           * 由于【事件录像】的修改和删除使用同一个接口
           * 在mongo的内嵌中的内嵌清除的startTime和endTime字段
           * 会变成{_id:8645cdsadv}
           * 暂无法删除该内嵌文档的数据
           * 故在此进行过滤
           */
          this.caseDataTree = res.data
          this.InfoData = this.$lodash.cloneDeep(res.data[0].resource[0])
          this.SET_CASETIME([res.data[0].resource[0].startTime, res.data[0].resource[0].endTime])
        })
        .catch(err => {
          this.warningMsg('案件事件详情获取失败！')
          console.log(err)
        })
    },
    // 获取【追踪列表】的详情
    _getEventDetail(id, type) {
      if (type === 'alarm') {
        this.filterData(getCaseAlarmDetails(id), true)
      } else if (type === 'track') {
        this.filterData(getTrackingxg(id), false)
      }
    },
    filterData(fn, type) { // 【追踪列表】点击机构树获得的数据整理
      fn
        .then(res => {
          this.trackResData = {} // 视频数据 data
          this.InfoData = {} // 信息列表 data
          let resourceList = [] // 案件事件
          let mapList = [] // 追踪事件
          let structuredTrack = [] // 结构化追踪
          let _maxEnd = 0 // 接力追踪事件 标记段有可能无endTime，此endTime为max endTime || max startTime + 10
          let _resourceList = [] // 案件处理临时tmp
          let _mapList = [] // 接力追踪临时tmp
          let _structuredTrack = [] // 结构化追踪tmp
          let _startTime // 案件开始时间
          let _endTime // 案件结束时间
          let _s = {} // 结构化追踪tmp 数据整理
          if (type) { // 案件事件
            this.infoType = 'caselist'
            this.InfoData = {
              eventName: res.data.eventName,
              person: res.data.person,
              phone: res.data.phone,
              department: res.data.department,
              incidentAddress: res.data.incidentAddress,
              startTime: res.data.startTime,
              endTime: res.data.endTime,
              mark: res.data.mark,
              images: res.data.images
            }
            _resourceList = res.data.resourceList
            _startTime = res.data.startTime
            _endTime = res.data.endTime
            _structuredTrack = res.data.structuredTrack
            if (res.data.trackingInfo) {
              _mapList = res.data.trackingInfo.mapList.filter(f => f.startTime)
            }
          } else { // 追踪事件
            this.infoType = 'tracklist'
            this.InfoData = {
              name: res.data.name,
              mark: res.data.mark,
              resource: res.data.mapList
            }
            _mapList = res.data.mapList.filter(f => f.startTime)
            if (res.data.eventId) {
              _resourceList = res.data.eventId.resourceList
              _startTime = res.data.eventId.startTime
              _endTime = res.data.eventId.endTime
              _structuredTrack = res.data.eventId.structuredTrack
              this.InfoData.event = {
                eventName: res.data.eventId.eventName,
                person: res.data.eventId.person,
                phone: res.data.eventId.phone,
                department: res.data.eventId.department,
                incidentAddress: res.data.eventId.incidentAddress,
                startTime: res.data.eventId.startTime,
                endTime: res.data.eventId.endTime,
                description: res.data.eventId.description
              }
            }
          }
          // 获得当无endTime时的替代time
          _mapList.map(e => {
            if (_maxEnd < (e.endTime || e.startTime)) {
              _maxEnd = e.endTime || e.startTime + 10
            }
          })
          // 整理 【接力追踪】 data 格式
          _mapList.map(e => {
            mapList.push({
              ...e.resource,
              resource: e.resource._id,
              tagTime: [{ startTime: e.startTime, endTime: e.endTime || _maxEnd, tagName: '' }]
            })
          })
          // 整理 【案件事件】 data 格式
          _resourceList.map(e => {
            resourceList.push({
              ...e.resource,
              resource: e.resource._id,
              tagTime: e.tagTime.filter(f => f.startTime && f.endTime && f.startTime < f.endTime && f.startTime >= _startTime && f.endTime <= _endTime)
            })
          })
          // 整理 【结构化追踪】 data格式
          _structuredTrack.filter(f => f.startTime && f.endTime && f.startTime < f.endTime).sort((a, b) => a.startTime - b.startTime).map(e => {
            if (_s[e.resource._id]) {
              _s[e.resource._id].tagTime.push({ startTime: e.startTime, endTime: e.endTime, tagName: '' })
            } else {
              _s[e.resource._id] = {
                ...e.resource,
                resource: e.resource._id,
                tagTime: [{ startTime: e.startTime, endTime: e.endTime, tagName: '' }]
              }
            }
          })
          structuredTrack = this.$lodash.toArray(_s)

          this.trackResData = { alarm: resourceList, track: mapList, structuredTrack }
          // console.log('resourceList', resourceList)
          // console.log('mapList', mapList)
          // console.log('trackResData', this.$lodash.cloneDeep(this.trackResData))
          // console.log('InfoData', this.$lodash.cloneDeep(this.InfoData))

          // 若为跳转过来的 切换为同步 自动开流
          if (this.skipModal) {
            this.skipModal = false
            let _node = {
              level: 3,
              parent: {
                data: { id: 3 }
              }
            }
            if (this.$route.params.type === 'track') {
              _node.parent.data.id = 3 // 3,4 为接力追踪
            } else if (this.$route.params.type === 'alarm') {
              _node.parent.data.id = 5 // 5,6 为常规案件
            }
            this.dblclickData([{ ..._node }, { _id: res.data._id }])
          }
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('数据获取失败，请稍后重试')
        })
    },
    // 机构树单击
    async nodeClick(val) {
      let [node, data] = val
      if (this.tabPane === 'tracklist') {
        let type
        let _node = node
        while (_node.level > 2) {
          _node = _node.parent
          if (_node.level === 2) {
            if ([3, 4].includes(_node.data.id)) {
              type = 'track'
            } else {
              type = 'alarm'
            }
          }
        }
        if (node.level === 3) {
          await this._getEventDetail(data._id, type) // 获得详情
        } else if (node.level === 4) {
          await this._getEventDetail(node.parent.data._id, type) // 获得详情
        } else if (node.level === 5) {
          await this._getEventDetail(node.parent.parent.data._id, type) // 获得详情
        }
      }
    },
    // 案件处理 机构树 双击 播放
    async dblclickData(val) {
      let [node, data] = val
      if (this.tabPane === 'caselist') {
        // 双击的不是资源
        if (node.level !== 3) { return }
        let _t // 标记段最早的时间
        let _resourceList = node.parent.data.resourceList
        for (let item of _resourceList) {
          if (item.resource === data._id) {
            item.tagTime.map(e => {
              if (!_t || _t > e.startTime) {
                _t = e.startTime
              }
            })
            data.tagTime = item.tagTime
            break
          }
        }
        let param = {
          streamType: 'all',
          eventType: ['all'],
          typeName: '',
          typeContent: '',
          startTime: this.caseTime[0],
          endTime: this.caseTime[1],
          rows: 50,
          page: 1,
          time: _t || this.caseTime[0]
        }
        /**
         * 异步时，可重复添加
         * 同步时，不可重复添加
         */
        let _d = this.tmpData.some(e => e._id === data._id) // 是否已存在
        if (!this.isSync || !_d) {
          this.tmpData.push(data)
        }
        this.queryRecord(param, data) // 双击后先检索
        this.getCaseParticulars(this.caseID) // 获取当前全部案件名称
      } else if (this.tabPane === 'tracklist') {
        /**
         * 追踪列表模式下
         * 分【同步】/【异步】
         * 分 双击事件，将事件下所有资源开流；双击资源，将该资源开流
         * 结构如下
         * 【开流】─┬─【异步】─┬─【事件】—— 先关流 —— arr.map(e=>{this.fun(e)})
         *         │         │
         *         │         └─【资源】—— obj
         *         │         以对应【节点】的开始时间播放
         *         │
         *         └─【同步】─┬─【事件】—— 先关流 —— arr
         *                   │
         *                   └─【资源】—— arr —— 会先关闭
         *                   所有资源中重新开流，以【节点】最早的开始时间播放
         *
         * 【关流】─┬─【异步】─┬─【事件】—— 先关流 —— arr —— arr.map(e=>{this.fun(e)})
         *         │         │
         *         │         └─【资源】—— obj
         *         │         以对应【节点】的开始时间播放
         *         │
         *         └─【同步】─┬─【事件】—— 先关流 —— arr —— arr
         *                   │
         *                   └─【资源】—— arr —— 会先关闭
         *                   以所有资源中【节点】最早的开始时间播放
         *
         * ******* 不管【同步】/【异步】
         * param: {
         *  startTime: '', ---> 所有【开始标记】的最早时间
         *  endTime: '', ---> 所有【结束标记】的最晚时间 或 最晚的【开始标记】时间+10s
         *  time: '' ---> 当前播放时间   【同步】/【异步】 在【开流】/【关流】时 不同
         * }
         * tagTime: {
         *  startTime: '', ---> 紫色录像段的【开始标记】
         *  endTIme: '' ---> 紫色录像段的【结束标记】
         * }
         * 【同步】时，以所有时间的最早时间播放
         * 【异步】时，以对应【节点】的开始时间播放
         * 【标记段】外的进行遮盖
         * 无【标记段】资源禁止播放
         * 可双击【事件】，播放该事件下前16个资源               播放前先全部关流   同一事件，不修改右侧【信息列表】,不同事件，修改右侧【信息列表】
         * 可双击【标记类型】，播放该事件的该标记下前16个资源    播放前先全部关流   同一事件，不修改右侧【信息列表】,不同事件，修改右侧【信息列表】
         * 可双击【资源】，播放该资源
         */
        // 默认初次为同步播放
        if (this.once) {
          this.CHANGE_SYNC(true)
          this.once = false
        }
        this.tmpData = this.tmpData.filter(e => e)
        let _data = [] // 当前选中项
        // 筛选最小的开始时间和最大的‘结束时间’
        this.isEvent = false // 没有点击 事件
        let param = {
          streamType: 'all',
          eventType: ['all'],
          typeName: '',
          typeContent: '',
          rows: 1000,
          page: 1
        }
        if (node.level === 3) { // 事件
          if ([5, 6].includes(node.parent.data.id)) { // 双击【常规案件】事件，不播放关联的【接力追踪】案件
            _data.push(...this.trackResData.alarm, ...this.trackResData.structuredTrack)
          } else {
            _data.push(...this.trackResData.track, ...this.trackResData.alarm, ...this.trackResData.structuredTrack)
          }
          this.trackEventId = data._id
          this.isEvent = true
        } else if (node.level === 4) { // 标记段
          _data.push(...this.trackResData[data.type])
          this.trackEventId = node.parent.data._id
          this.isEvent = true
        } else if (node.level === 5) { // 资源
          _data = this.trackResData[node.parent.data.type].filter(e => e._id === data.resource._id) // 对应的标记段的resource
          this.trackEventId = node.parent.parent.data._id
        }
        if (!_data.length) {
          this.warningMsg('没有已标记的视频资源')
          return
        }
        if (node.level === 3 || node.level === 4) { // 事件 || 标记段
          await this.buttons.stopAll()
          this.tmpData = _data.slice(0, 16)
        } else if (node.level === 5) { // 资源
          if (this.tmpData.length < 16) {
            this.tmpData.push(_data[0])
          } else { // 满16个后，以选中窗口为主，确定更换哪个视频
            this.$set(this.tmpData, this.activedIndex, _data[0])
          }
        }
        // 判断镜头数量，自动进行画面分割
        if (this.tmpData.length === 1) {
          this.plugin.setShowscreen(1)
          this.showThumb = 1
        } else if (this.tmpData.length <= 4) {
          this.plugin.setShowscreen(4)
          this.showThumb = 4
        } else if (this.tmpData.length <= 9) {
          this.plugin.setShowscreen(9)
          this.showThumb = 9
        } else if (this.tmpData.length <= 16) {
          this.plugin.setShowscreen(16)
          this.showThumb = 16
        }
        // 同步状态下由this.tmpData传参
        // 异步状态下由data传参
        let _startTime
        let _endTime
        this.tmpData.map(e => { // 获取同步回放时 所有资源的max、min标记时间
          e.tagTime.map(f => {
            if (!_startTime || _startTime > f.startTime) {
              _startTime = f.startTime
            }
            if (!_endTime || _endTime < f.endTime) {
              _endTime = f.endTime
            }
          })
        })
        param.time = _startTime // 当前播放时间
        param.startTime = _startTime
        param.endTime = _endTime
        this.SET_CASETIME([_startTime, _endTime]) // 创建 拖拽时间轴的限制条件 当前所有资源的【最小标记】-【最大标记】
        if (this.isSync) { // 同步
          if (node.level === 5) { // 是资源
            this.queryRecord(param, _data[0])
          } else if (node.level === 3 || node.level === 4) { // 是事件 || 标记
            this.queryRecord(param)
          }
        } else { // 异步
          if (node.level === 5) { // 是资源
            this.queryRecord(param, _data[0])
          } else if (node.level === 3 || node.level === 4) { // 是事件 || 标记
            this.queryRecord(param)
          }
        }
      }
    },
    // 清空数据
    clearData() {
      this.clickTimeLine = false
      this.infoType = this.tabPane
      this.isEvent = false
      this.plugin.stopAll()
      this.tmpData = [] // 事件管理
      this.resultCaseNames = []
      this.InfoData = {} // 信息列表
      this.caseDataTree = [] // 事件机构树
      this.searchCaseName = '' // 搜索的事件
      this.searchTrackName = '' // 搜索的接力追踪
      this.SET_CASETIME([])
      this.SET_CASE_ID()
      if (!this.buttons.state.isStopped) {
        this.buttons.stopAll(1)
      }
    },
    // 【事件处理】点击标记的【保存】/【删除】按钮
    clickCase(val) {
      if (val === 'delete') {
        // 获得被删除的标记段data
        let _data = this.recordInfo[this.activedId.split('_')[1]].tagTime[this.caseIndex]
        this.deleteCaseTime = _data
        // 获得删除后的标记段data
        this.confirmModal = true
        this.modalType = 'caseModal'
        this.modalTitle = '标记删除确认'
      } else if (val === 'save') {
        let _v = []
        // 当前所有开流的资源的tagTime
        for (let e of this.recordInfo) {
          let _data = e.tagTime.filter(f => f && f.startTime && f.endTime && f.startTime < f.endTime)
          // 按startTime的时间从小到大排序
          _data.sort((a, b) => a.startTime - b.startTime)
          // 过滤tagTime时间段，判断是否【结束标记】不等于【开始标记】
          // 为方便绘制【事件段】，创建【开始标记】时自动创建【结束标记】，且【结束标记】与【开始标记】时间相同
          if (_data.length) {
            _v.push(setVideoTime(this.caseID, e.resId.split('_')[0], _data))
          } else {
            _v.push(setVideoTime(this.caseID, e.resId.split('_')[0], [{ startTime: this.caseTime[0], endTime: this.caseTime[1], tagName: '' }]))
          }
        }
        Promise.all(_v)
          .then(res => {
            // this.successMsg('案件录像保存成功')
            this.getCaseParticulars(this.caseID)
          })
          .catch(err => {
            // this.errorMsg('案件录像保存失败，请稍后重试')
            console.log(err)
          })
      }
    },
    // 监听点击开始、结束标记按钮
    isCaseToggle(val) {
      let _time = Math.floor(this.timelineValue / 1000)
      for (let e of this.recordInfo) {
        // 仅修改当前选中项的时间数据
        if (e.resId === this.activedId) {
          if (val === 'start') {
            // 事件段开始时间
            if (this.caseEdit) { // 编辑时
              if (_time < this.caseTime[0]) {
                // 若编辑【时间段开始时间】 < 【事件开始时间】
                this.SET_CASE_MARKING_TOOGLE(true)
                this.warningMsg('标记时间不能小于事件开始时间')
                return
              } else if (_time >= e.tagTime[this.caseIndex].endTime) {
                // 若编辑【时间段开始时间】 >= 当前【时间段结束时间】
                this.SET_CASE_MARKING_TOOGLE(true)
                this.warningMsg('标记时间不能小于录像段结束时间')
                return
              } else if (this.caseIndex && _time < e.tagTime[this.caseIndex - 1].endTime) {
                // 若编辑【时间段开始时间】 < 前一个【时间段结束时间】
                this.SET_CASE_MARKING_TOOGLE(true)
                this.warningMsg('标记时间不能小于上一个录像段结束时间')
                return
              }
              e.tagTime[this.caseIndex].startTime = _time
              this.openTagTimeModal(e)
              // this.SET_CASE_INDEX('')
              this.SET_CASE_EDIT(false)
            } else { // 创建时
              if (_time < this.caseTime[0]) {
                // 若创建【时间段开始时间】 < 【事件开始时间】
                this.SET_CASE_MARKING_TOOGLE(true)
                this.warningMsg('标记时间不能小于事件开始时间')
                return
              } else if (_time >= this.caseTime[1]) {
                // 若创建【时间段开始时间】 >= 【事件结束时间】
                this.SET_CASE_MARKING_TOOGLE(true)
                this.warningMsg('标记时间不能小于事件开始时间')
                return
              } else if (e.tagTime.length) {
                // 若创建【时间段开始时间】有重合
                for (let f of e.tagTime) {
                  // 使默认录像段自动删除
                  if (f.startTime === this.caseTime[0] && f.endTime === this.caseTime[1]) {
                    e.tagTime[0].startTime = _time
                    e.tagTime[0].endTime = _time
                    this.SET_CASE_INDEX(0)
                    return
                  } else if (f.startTime <= _time && f.endTime >= _time && f.startTime !== f.endTime) {
                    this.SET_CASE_MARKING_TOOGLE(true)
                    this.warningMsg('标记时间不能重合')
                    return
                  }
                }
              }
              e.tagTime.push({ startTime: _time, endTime: _time }) // 如果先手动删除时，走这个
            }
            if (!this.caseEdit) {
              for (let i = 0; i < e.tagTime.length; i++) {
                if (e.tagTime[i].startTime === _time) {
                  this.SET_CASE_INDEX(i)
                  break
                }
              }
            }
          } else if (val === 'end') {
            // 事件段结束时间
            if (this.caseEdit) { // 编辑时
              if (_time <= e.tagTime[this.caseIndex].startTime) {
                // 若创建【时间段结束时间】 <= 当前【时间段开始时间】
                this.SET_CASE_MARKING_TOOGLE(false)
                this.warningMsg('标记时间不能小于等于时间段开始时间')
                return
              } else if (_time <= e.tagTime[this.caseIndex].startTime) {
                // 若编辑【时间段结束时间】 <= 当前【时间段开始时间】
                this.SET_CASE_MARKING_TOOGLE(false)
                this.warningMsg('标记时间不能大于录像段开始时间')
                return
              } else if (this.caseIndex !== e.tagTime.length - 1 && _time > e.tagTime[this.caseIndex + 1].startTime) {
                // 若编辑【时间段开始时间】 < 前一个【时间段结束时间】
                this.SET_CASE_MARKING_TOOGLE(false)
                this.warningMsg('标记时间不能大于下一个录像段开始时间')
                return
              }
              e.tagTime[this.caseIndex].endTime = _time
              this.openTagTimeModal(e)
              this.SET_CASE_EDIT(false)
            } else { // 创建时
              if (_time <= e.tagTime[this.caseIndex].startTime) {
                // 若创建【时间段结束时间】 <= 当前【时间段开始时间】
                this.SET_CASE_MARKING_TOOGLE(false)
                this.warningMsg('标记时间不能小于等于时间段开始时间')
                return
              } else if (_time > this.caseTime[1]) {
                // 若创建【时间段结束时间】 > 【事件结束时间】
                this.SET_CASE_MARKING_TOOGLE(false)
                this.warningMsg('标记时间不能小于等于事件结束时间')
                return
              } else if (e.tagTime.length - 1 > this.caseIndex && _time > e.tagTime[this.caseIndex + 1].startTime) {
                // 若创建【时间段结束时间】有重合
                this.SET_CASE_MARKING_TOOGLE(false)
                this.warningMsg('标记时间不能重合')
                return
              }
              e.tagTime[this.caseIndex].endTime = _time
              this.openTagTimeModal(e)
            }
          } else if (val === 'del') {
            e.tagTime.splice(this.caseIndex, 1)
          }
          break
        }
      }
    },
    // 打开 标记段 命名弹窗
    openTagTimeModal(val) {
      /**
       * 如果是同步，就用现成方法  暂停
       * 如果是异步，就强行调用  暂停
       */
      if (!this.isSync) { // 异步
        this.buttons.plugins.map(plugin => {
          if (!plugin.pluginState.isStopped) {
            plugin.pause()
          }
        })
        this.changeTimeline()
      } else { // 同步
        this.buttons.pause()
      }
      this.tagTimeObj = this.$lodash.cloneDeep(val)
      this.tagTimeName = this.tagTimeObj.tagTime[this.caseIndex].tagName
      this.confirmModal = true
      this.modalType = 'tagTimeModal'
      this.modalTitle = '标记段命名'
    },
    // 弹窗 保存按钮
    saveModal() {
      if (this.modalType === 'caseModal') { // 【事件处理】 删除
        this.isCaseToggle('del')
        this.cancelModal()
      } else if (this.modalType === 'treeModal') { // 备份确认
        this.gudgingDown()
        this.cancelModal()
      } else if (this.modalType === 'tagTimeModal') { // 保存标记段名称
        if (!this.tagTimeName) { // 验证 不为空
          this.errorMsg('标记名不可为空')
          return
        }
        if (this.tagTimeName.length > 20) { // 长度限制
          this.errorMsg('标记名不得超过20个字符')
          return
        }
        // 验证 唯一性
        let _name = []
        this.tagTimeObj.tagTime.map((e, i) => {
          if (i !== this.caseIndex) {
            _name.push(e.tagName)
          }
        })
        if (_name.includes(this.tagTimeName)) {
          this.errorMsg('同一资源下标记名不可重复')
          return
        }
        // 保存
        this.recordInfo.forEach(e => {
          if (e.resId === this.tagTimeObj.resId) {
            e.tagTime[this.caseIndex].tagName = this.tagTimeName
          }
        })
        this.tagTimeName = ''
        this.tagTimeObj = {}
        /**
         * 如果是同步，就用现成方法
         * 如果是异步，就强行调用
         */
        if (!this.isSync) {
          this.buttons.plugins.map(plugin => {
            if (!plugin.pluginState.isStopped) {
              plugin.resume()
            }
          })
          this.cancelModal()
        } else {
          this.buttons.resume()
          this.cancelModal(true)
        }
      } else if (this.modalType === 'severModal') { // 当有正在备份的进程时
        this.getRemotedownload() // 确认kill掉当前进程
      }
    },
    // 弹窗 取消按钮
    cancelModal(val) {
      this.confirmModal = false
      this.modalType = ''
      this.modalTitle = ''
      // 取消后，取消选中状态，恢复播放
      this.SET_CASE_INDEX('')
      this.SET_CASE_EDIT(false)
      if (val) {
        this.buttons.resume()
      }
    },
    // 【案件处理】-【案件列表】保存
    saveVideo() {
      this.clickCase('save')
      this.confirmModal = true
      this.modalType = 'treeModal'
      this.modalTitle = '案件保存确认'
    },
    // 【案件处理】-【案件列表】 保存接口函数
    getRemotedownload() {
      getRemotedownload(this.caseID)
        .then(res => {
          this.successMsg('正在保存请稍后')
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('保存失败')
        })
    },
    // 判断下载状态，返回true/false
    gudgingDown() {
      gudgingDown()
        .then(res => {
          if (res.data) {
            this.getRemotedownload()
          } else {
            this.confirmModal = true
            this.modalType = 'severModal'
            this.modalTitle = '事件备份确认'
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 检索回放 支持的文件类型为[全部]和[定时录像]
    checkEventType() {
      const list = this.resourceList || []
      let valid = true
      list.forEach(item => {
        if (item && item.queryParam) {
          const eventType = item.queryParam.eventType[0]
          if (eventType !== 'timeRecord' && eventType !== 'all') {
            valid = false
          }
        }
      })
      return valid
    },
    // 切换同步异步状态
    changeSync(bool) {
      if (!this.checkEventType()) {
        this.warningMsg('同步回放支持的文件类型为[全部]和[定时录像]')
        return
      }
      if (!this.resourceList.length) {
        return
      }
      if (this.isSync && !bool) {
        return
      }
      if (bool) { // 切换到异步
        // 清空同步“复选框”选项
        // this.tmpData = []
        // 关闭同步定时器  开启所有暂停的
        this.clearSyncTimer()
        this.resourceList.forEach((item, index) => {
          if (item && item.total !== 0) {
            this.openPlugin(item, this.timelineValue / 1000, index)
          }
        })
      } else { // 切换到同步
        this.buttons._closeSound()
        this.buttons.state.isVolumeOpen = false
        this.syncTime(this.timelineValue / 1000)
      }
      this.CHANGE_SYNC(!this.isSync)
    },
    // 画时间轴
    _drawTimeline() {
      if (this.showThumb === 1) {
        this.addSingleTimelineInfo()
      } else {
        this.addAllTimelineInfo()
      }
    },
    // 添加所有的时间轴数据
    addAllTimelineInfo() {
      this.recordInfo = []
      this.resourceList.map((item, index) => {
        if (item) {
          this.addTimelineInfo(item, index)
        }
      })
    },
    // 添加单个的时间轴数据
    addSingleTimelineInfo() {
      this.recordInfo = []
      if (!this.activedId) {
        return
      }
      const index = this.activedId.split('_')[1]
      const item = this.resourceList[index]
      if (item) {
        this.addTimelineInfo(item, index)
      } else {
        this.clearTimer()
        this.timelineRef.chengeTime(this.defaultTimelineValue)
      }
    },
    // 添加时间轴对象
    addTimelineInfo(param, index = this.activedIndex) {
      /**
       * 后台获取的evenlist数据
       * 通过vuex传值至此
       * 过滤后
       * 传给recordInfo
       */
      const eventList = param.eventList || param.recordInfo || param.recordList || []
      const tag = param.queryParam.typeName
      const catchedTimelineInfo = this.catchCalcTimeline(eventList, this.timelineValue, this.stepLength)
      if (this.tabPane === 'tracklist') {
        // 隐藏非标记区域的录像段
        for (let item in catchedTimelineInfo) {
          if (catchedTimelineInfo[item].length) {
            let timedVideo = this.$lodash.cloneDeep(catchedTimelineInfo[item])
            let res = []
            timedVideo.sort((a, b) => a.start - b.start)
            timedVideo.forEach(e => {
              param.timelineMark.forEach(f => {
                if (e.start <= f.startTime * 1e3) { // 录像段开始时间 <= 标记开始时间
                  if (e.start >= f.endTime * 1e3) { return }
                  if (e.end <= f.endTime * 1e3) { // 录像段结束时间 <= 标记结束时间
                    res.push({start: f.startTime * 1e3, end: e.end})
                  } else { // 录像段结束时间 > 标记结束时间
                    res.push({start: f.startTime * 1e3, end: f.endTime * 1e3})
                  }
                } else { // 录像段开始时间 > 标记开始时间
                  if (e.end >= f.startTime * 1e3) { return }
                  if (e.end <= f.endTime * 1e3) { // 录像段结束时间 <= 标记结束时间
                    res.push({start: e.start, end: e.end})
                  } else { // 录像段结束时间 > 标记结束时间
                    res.push({start: e.start, end: f.endTime * 1e3})
                  }
                }
              })
            })
            catchedTimelineInfo[item] = this.$lodash.cloneDeep(res)
            break
          }
        }
      }
      const obj = {
        ...catchedTimelineInfo,
        label: param.name,
        resId: param.res + '_' + index,
        tags: [],
        tagTime: this.$lodash.cloneDeep(param.timelineMark) // 标记段参数
      }
      let arr
      if (param.isQueryTag) {
        arr = param.tags[tag] || []
      } else {
        arr = [].concat.apply([], Object.values(param.tags || {}))
      }
      arr.forEach(({ tag, time }) => {
        obj.tags.push({
          name: tag,
          time: time * 1000
        })
      })
      if (!obj.timedVideo.length && !obj.eventVideo.length) {
        // 当没有录像时
        // 添加一个假的为了能出黑色的底条
        obj.timedVideo.push({
          start: 1000,
          end: 1001
        })
      }
      this.$set(this.recordInfo, index, obj)
    },
    // 切换多画面
    screen(num) {
      this.showThumb = num
      if (num === 1) {
        this.addSingleTimelineInfo()
      } else {
        this.addAllTimelineInfo()
      }
    },
    // 从录像列表中找到 time 参数的  strmInfo
    findStrmInfo(infos = [], time) {
      let info = null
      for (let index = 0; index < infos.length; index++) {
        const item = infos[index]
        const timeInfo = item.evtTblInfo || item
        if (time >= timeInfo.startTime && time < timeInfo.endTime) {
          info = item.strmInfo
          break
        }
      }
      return info
    },
    // 查找下一个播放时间
    checkNextPlayingTime(time, index) {
      const infos = this.resourceList[index].eventList || this.resourceList[index].recordList
      if (this.resourceList[index].eventList) {
        const info = this.findStrmInfo(infos, time) // 获取录像播放信息
        if (info) {
          return time
        }
      }
      let stime = 0
      for (let index = 0; index < infos.length - 2; index++) {
        const item = infos[index]
        const timeInfo = item.evtTblInfo || item
        const nInfo = infos[index + 1].evtTblInfo || infos[index + 1]
        if (timeInfo.endTime < time && time <= nInfo.startTime) {
          stime = nInfo.startTime
          break
        }
      }
      return stime || time
    },
    // 绘制时间轴
    dragTimeline(time) {
      /**
       * 在此处判断time是否超过
       * 事件的开始、结束时间
       * 如果超过强行赋值
       * 见BStimeLine.vue,mu()方法
       *
       * 查找从组件获取时间的位置
       * 做判断，当到达结束时间时
       * 调用组件stop()方法
       */
      this.clickTimeLine = false
      if (this.tabPane === 'tracklist') {
        if (time < this.caseTime[0] * 1000) { // 超过开始时间
          time = this.caseTime[0] * 1000
        } else if (time > this.caseTime[1] * 1000) { // 超过结束时间
          time = this.caseTime[1] * 1000
        }
      } else {
        if (time > this.caseTime[1] * 1000) {
          // 超过结束时间
          time = this.caseTime[1] * 1000
        } else if (time < this.caseTime[0] * 1000) {
          // 超过开始时间
          time = this.caseTime[0] * 1000
        }
      }
      if (this.isSync) {
        // 同步
        this.syncTime(time / 1000)
      } else {
        // 异步
        const param = this.resourceList[this.activedIndex]
        if (param) {
          if (this.isNVR) {
            this.openNVRPlay(time / 1000)
            this.changeTimeline(true)
            this.buttons.dragHook()
          } else {
            this.plugins[this.activedIndex].syncPause()
            time = this.checkNextPlayingTime(time / 1000, this.activedIndex)
            // 查找到下一个播放录像时间，开始播放，查不到暂停
            if (time !== -1) {
              const opened = this.openPlugin(param, time)
              if (opened) {
                this.changeTimeline(true)
                this.buttons.dragHook()
              }
            } else {
              this.plugins[this.activedIndex].syncResume()
              this.plugins[this.activedIndex].resume()
              this.changeTimeline()
            }
          }
        }
      }
    },
    // 点击切片缩略图
    thumbClick(item) {
      if (item) {
        this.dragTimeline(parseInt(item.value) * 1000)
      } else {
        this.changeTimeline()
      }
    },
    // 清空定时器
    clearTimer() {
      clearInterval(this.timelineTimer)
      this.timelineTimer = null
    },
    /**
     * 切换状态时的时间轴处理
     * isDelay 是否延迟开启定时器(为了缓解时间轴跳转回跳问题)
     */
    changeTimeline(isDelay = false) {
      this.isUpTime = false
      this.clearTimer()
      setTimeout(
        () => {
          this.isUpTime = true
        },
        isDelay ? 3000 : 0
      )
      this.timelineTimer = setInterval(() => {
        if (this.clickTimeLine) { return }
        this.isUpTime && this.setTimelineValue()
        // 追踪列表的 标记段外都进行视频遮盖（不分同步、异步）
        if (this.tabPane === 'tracklist') {
          this.coverMode() // 遮盖
          // 异步 自动关流
          if (!this.isSync) { // 异步
            let changeActiveIndex = false
            this.resourceList.forEach((e, i) => {
              if (e) {
                let time = this.plugins[i].getPlayerCurTime()
                time = JSON.parse(time)
                if (time.success && time.msCur && time.msCur !== 0) {
                  if (this.$lodash.maxBy(e.timelineMark, e => e.endTime).endTime * 1000 + 600 <= time.msCur) {
                    this.plugins[i].stop()
                    this.setResource({index: i})
                    changeActiveIndex = true
                    setTimeout(() => {
                      this.plugins[i].caseProcessShow()
                    }, 500)
                  }
                }
              }
            })
            if (changeActiveIndex) {
              let num = this.resourceList.findIndex(e => e)
              if (num !== -1) {
                this.activedIndex = num
                this.CHANGE_ACTIVEID(this.resourceList[num].res + '_' + num)
              } else {
                this.isStopAll()
              }
            }
          }
        }
      }, 1000)
    },
    // 获取当前播放时间
    getPluginCurtime() {
      if (!this.resourceList[this.activedIndex]) {
        return 0
      }
      let time = this.plugin.getPlayerCurTime()
      time = JSON.parse(time)
      if (time.success && time.msCur) {
        return time.msCur
      } else {
        return 0
      }
    },
    // 获取并设置时间轴的值  ---上面显示的时间
    setTimelineValue() { // 1s调一次
      let time
      if (this.isSync) { // 同步回放
        if (this.buttons.state.isStopped) {
          time = this.defaultTimelineValue
        } else if (this.buttons.tempState ? this.buttons.tempState.isFrame : this.buttons.state.isFrame) {
          time = this.buttons.getSyncPluginTime()
        } else {
          const speeds = this.buttons.selectedSpeed.split('/')
          time = this.timelineValueUnParsed + (1000 * speeds[0]) / (speeds[1] || 1)
        }
      } else {
        time = this.getPluginCurtime() || this.defaultTimelineValue
      }
      if (time) {
        this.timelineRef.chengeTime(time)
        if (this.caseTime.length) {
        // 当前播放时间大于事件结束时间时
        // 自动关流
          if (this.tabPane === 'caselist') {
            if (time > this.caseTime[1] * 1000 + 500) {
              this.buttons.stop()
            }
          } else if (this.tabPane === 'tracklist') {
            let _maxEnd = this.caseTime[1]
            if (this.isSync) { // 同步
              if (time >= _maxEnd * 1000 + 500) {
                this.buttons.stopAll(1)
              }
            }
          }
        }
      }
    },
    // 双击后先检索
    async queryRecord(param, resData) {
      // resData 点击的是资源时有数据
      this.buttons.resetHook()
      this.CHANGE_NVR(false)
      this.timelineRef.clearThumbQueue()
      this.timelineRef.step = 0 // 时间轴时间初始强制为1h
      if (this.isSync) { // 同步回放
        const nodeList = this.tmpData
        let nodes = [] // 得到有权限、未禁用的资源
        let noPower = 0
        for (let index = 0; index < nodeList.length; index++) {
          const node = nodeList[index]
          // 权限判断
          const power = await this.getCameraPower(node._id)
          if (power && power.includes('playback')) {
            // 停用设备不查录像
            if (Number(node.eid.deviceStatus) !== 0) {
              nodes.push(node)
            }
          } else {
            noPower++
          }
        }
        if (noPower) {
          this.warningMsg(`${noPower}个通道没有权限！`)
        }
        if (!this.samePlatform(nodes)) {
          this.warningMsg('不同平台的设备不可以同步回放！')
          return
        }
        const eventType = param.eventType[0]
        if (eventType !== 'timeRecord' && eventType !== 'all') {
          this.warningMsg('同步回放支持的文件类型为[全部]和[定时录像]')
          return
        }
        await this.queryMultiRecord(param, nodes)
      } else {
        // 异步回放
        if (!this.isEvent) { // 不是事件
          // 权限判断
          const power = await this.getCameraPower(resData._id)
          if (power && power.includes('playback')) {
            // 停用设备不查录像
            if (Number(resData.eid.deviceStatus) === 0) {
              this.warningMsg('该设备已禁用！')
              return
            }
          } else {
            this.warningMsg('该通道没有权限！')
            return
          }
          if (this.tabPane === 'tracklist') {
            let _startTime = resData.tagTime.sort((a, b) => a.startTime - b.startTime)[0].startTime
            let _endTime = resData.tagTime.sort((a, b) => b.endTime - a.endTime)[0].endTime
            param.startTime = _startTime
            param.endTime = _endTime
            param.time = _startTime
          }
          // return
          this.querySingleRecord(param, resData)
        } else { // 点击的是事件
          // 当一键异步回放
          for (let item of this.tmpData) {
            const power = await this.getCameraPower(item._id)
            if (power && power.includes('playback')) {
              // 停用设备不查录像
              if (Number(item.eid.deviceStatus) === 0) {
                this.warningMsg('该设备已禁用！')
                continue
              }
            } else {
              this.warningMsg('该通道没有权限！')
              continue
            }
            if (this.tabPane === 'tracklist') {
              let _startTime = item.tagTime.sort((a, b) => a.startTime - b.startTime)[0].startTime
              let _endTime = item.tagTime.sort((a, b) => b.endTime - a.endTime)[0].endTime
              param.startTime = _startTime
              param.endTime = _endTime
              param.time = _startTime
            }
            await this.querySingleRecord(param, item)
          }
        }
      }
    },
    // 同步回放时，判断所选设备是否属于同一平台
    samePlatform(nodes) {
      const len = nodes.filter(item => item.nodeId).length
      return len === 0 || len === nodes.length
    },
    // 把标记点区筛选出来
    dealWithResult(result, data) {
      const eventList = data.eventList
      const list = []
      const tags = {}
      eventList.forEach(item => {
        const info = item.evtTblInfo
        if (info.evtType !== TAG_TYPE) {
          list.push(item)
        } else {
          const markList = info.remark.split('#')
          const tag = markList[0]
          tags[tag] = tags[tag] || []
          tags[tag].push({
            tag: tag,
            content: markList[1],
            time: info.startTime
          })
        }
      })
      const dataCp = this.$lodash.cloneDeep(data)
      dataCp.eventList = list
      dataCp.tags = tags
      Object.assign(result, dataCp)
      if (result.queryParam.eventType[0] === 'recordFlag') {
        result.isQueryTag = true
      }
    },
    findFlagResult(arr) {
      return arr.filter(item => item.evtTblInfo.evtType === 2147483647)
    },
    // 播放完一段录像后的回调
    finishPlay(index) {
      /**
       * 异步自动关流 原方法
       * 存在问题，关流时间不准确
       */
      // console.log('finishPlay', index)
      // this.plugins[index].stop()
      // this.setResource({
      //   index: index,
      //   item: null
      // })
      // console.log('resourceList', this.$lodash.cloneDeep(this.resourceList))
      // let num = this.resourceList.findIndex(e => e)
      // console.log('num', num)
      // if (num !== -1) {
      //   this.activedIndex = num
      //   this.CHANGE_ACTIVEID(this.resourceList[num].res + '_' + num)
      // } else {
      //   this.isStopAll()
      // }
    },
    // 打开插件播放
    async openPlugin(param, time, index = this.activedIndex, curTime) {
      const plugin = this.plugins[index]
      if (!param.total) {
        return false
      }
      if (this.isNVR) {
        return this.openPluginNVR(param, time, index)
      }
      function findEndTime(list, time) {
        // 查询下一段录像的结束时间
        let end = 0
        list.forEach(item => {
          const info = item.evtTblInfo || item
          if (info.startTime <= time && time < info.endTime) {
            end = info.endTime > end ? info.endTime : end
          }
        })
        return end
      }
      // 国标设备开流
      if (param.queryParam.childId) {
        return this.gbOpen(param, { startTime: curTime || time, endTime: findEndTime(param.recordList, time) }, index)
      }
      const openParam = {
        startTime: curTime || time,
        // endTime: findEndTime(param.eventList, time),
        endTime: param.endTime || param.queryTime.end,
        dsIp: param.dsIp,
        dsPort: param.dsPort,
        strmInfo: this.findStrmInfo(param.eventList, time) || param.eventList[0].strmInfo
      }
      await plugin.syncResume(openParam, {
        id: param.res,
        ...param
      })
      this.buttons.wallOpen(openParam)
      // 监测 异步回放 自动关流回调
      // console.log('监测 异步回放 自动关流')
      // if (!this.isSync) {
      //   plugin.plugin.SetStateCallback((e) => {
      //     console.log('SetStateCallback', e)
      //     setTimeout(() => { // 完全关闭后，再修改时间轴，否则会出错
      //       // this.$delete(this.tmpData, index)
      //       console.log(index)
      //       this.SET_RESOURCE({ index })
      //       // if (!this.tmpData.filter(e => e).length) {
      //       //   this.isStopAll()
      //       // }
      //     }, 500)
      //   })
      // }
      return true
    },
    // 暂停事件
    pauseEvent() {
      if (this.isSync) {
        this.clearTimer()
      }
    },
    // 恢复播放事件
    resumeEvent() {
      if (this.plugin.getPlayerCurTime()) {
        this.changeTimeline()
      }
    },
    // 焦点切换
    avtiveChange(index) {
      if (this.resourceList[index]) {
        this.activeData = this.resourceList[index]
        this.CHANGE_ACTIVEID(this.resourceList[index].res + '_' + index)
      } else {
        this.activeData = ''
      }
    },
    changeNodeId(id) {
      for (let index = 0; index < this.resourceList.length; index++) {
        const item = this.resourceList[index]
        if (item && item.res.indexOf(id) === 0) {
          this.avtiveChange(index)
          break
        }
      }
    },
    changePluginData(data) {},
    // 更新录像列表
    upTimeList(str, end) {
      if (this.isNVR) {
        return
      }
      if (this.isSync) {
        this.resourceList.forEach((i, index) => {
          this.upQueryTimeList(index, str, end)
        })
      } else {
        const index = +this.activedId.split('_')[1]
        this.upQueryTimeList(index, str, end)
      }
    },
    // 更新时间轴上的数据段
    upQueryTimeList(index, str, end) {
      const item = this.resourceList[index]
      if (!item) {
        return
      }
      const res = this.$lodash.cloneDeep(item)
      const query = res.queryParam
      const queryTime = res.queryTime
      if (str < queryTime.str) {
        query.startTime = str - 12 * 60 * 60
        query.endTime = queryTime.str
        queryTime.str = query.startTime
      } else if (end > queryTime.end) {
        query.startTime = queryTime.end
        query.endTime = end + 12 * 60 * 60
        queryTime.end = query.endTime
      } else {
        return
      }
      // 国标录像查询
      if (query.shareServer) {
        this.gbQuerySingle(query)
          .then(result => {
            this.concatResource({
              index,
              item: result.data,
              query
            })
          })
          .catch(err => err)
      } else {
        this.extraQuery(query, index)
          .then(result => {
            this.concatResource({
              index,
              item: result.data.result,
              query
            })
          })
          .catch(err => {
            console.error('more query error', err)
          })
      }
    },
    // 开流调用函数
    setPlayLog({ ip, name }) {
      const param = {
        logType: '操作日志',
        module: '录像回放',
        operateName: '录像回放',
        operateContent: `开始录像回放`,
        target: name,
        deviceIp: ip
      }
      this.recordLog(param)
    },
    sourceTypeChange(val) {
      this.sourceType = val
    },
    // 遮盖模式
    coverMode() {
      if (this.buttons.state.isStopped) { return }
      let _t = Math.floor(this.timelineValue / 1000)
      this.resourceList.map((e, i) => {
        if (e) {
          // 判断是否可以显示
          let show = false
          for (let f of e.timelineMark) {
            if (f.startTime - 2 < _t && (!f.endTime || _t < f.endTime)) {
              show = true
              break
            }
          }
          if (show) {
            if (this.plugins[i].isCapPause) {
              // console.log('可以显示')
              // console.log(e.resource)
              this.plugins[i].caseProcessShow()
            }
          } else {
            if (!this.plugins[i].isCapPause) {
              // console.log('需要遮盖')
              // console.log(e.resource)
              // 如果是未遮盖状态，就给他遮盖；如果是遮盖状态，就不刷新遮盖图片
              this.plugins[i].caseProcessCover()
              // 关声音
              // this.plugins[i].closeSound()
            }
          }
        }
      })
      /**
       * 遮盖模式
       * 所在页面 client\src\components\video\VideoPlugin.vue
       * 第8-9行
       * 普通遮盖使用第9行
       * 截屏遮盖使用第8行
       * 使用 client\src\components\video\mixins\capturePause.js 中的方法(有方法，未测试)
       * 普通遮盖 和 截图遮盖 使用的 v-if 变量不同
       */
    }
  },
  beforeDestroy() {
    this.activedIndex = 0
    this.spintoogle = true
    this.tmpData = [] // 事件管理
    this.trackDataTree = []
    this.drawTimeline = null
    this.getCase = null
    this.getTrack = null
    this.plugins = null
    this.clearTimer()
    // this.SET_CURNODE('')
    clearInterval(this.saveStatus)
    this.clearSyncTimer()
    this.CLEAR_RESOURCE()
    this.plugin.stopAll()
    this.clearData()
    if (window.CollectGarbage) {
      window.CollectGarbage()
    }
  }
}
</script>

<style lang="less" scoped>
  // 视频窗口全屏
  #app-main.fs .caseProcessing .center > .video-box /deep/ .video-plugin-box > .video-plugin-inBox {
    position: fixed;
    height: ~'calc(100% - 100px)' !important;
    z-index: 9999;
    margin: 0;
    padding: 0;
    margin-left: -288px;
    margin-top: -86px;
  }
  .caseProcessing {
    font-size: 12px;
    height: 100%;
    width: 100%;
    padding: 16px 0;
    & > .left {
      position: absolute;
      color: #fff;
      background: #1b3153;
      width: 272px;
      margin: 0;
      height: calc(~'100% - 32px');
      .leftTop {
        // height: calc(~'100% - 50px');
        height: 100%;
        position: relative;
        & /deep/ .ivu-tabs-content.ivu-tabs-content-animated {
          height: calc(~'100% - 42px');
        }
        & /deep/ .ivu-tabs-content {
          height: calc(~'100% - 42px');
        }
        // 搜索栏
        .case-list-top {
          height: 48px;
          z-index: 99;
          position: absolute;
          // top: 8px;
          .case-names {
            background-color: rgb(28, 48, 84);
            height: 120px;
            overflow: auto;
            width: 100%;
            border: 1px solid #5676a9;
            padding: 0 8px 0 8px;
            position: relative;
            .reminder {
              color: #ccc;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            li:hover {
              background: #2a436a;
            }
            li {
              cursor: pointer;
              height: 24px;
              line-height: 24px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        // 机构树
        .case-list-bottom {
          width: 100%;
          position: relative;
          top: 56px;
          height: calc(~'100% - 73px');
          padding: 0 8px 0 8px;
          .spin {
            display: flex;
            justify-content: center;
          }
        }
      }
    }
    & > .right {
      height: 100%;
      float: left;
      color: #fffafa;
      width: 300px;
      margin-left: 16px;
    }
    & > .center {
      height: 100%;
      padding: 0;
      float: left;
      position: relative;
      width: calc(~'100% - 604px');
      min-width: 600px;
      margin-left: 288px;
      .video-box {
        width: 100%;
        height: calc(~'100% - 175px');
        position: relative;
        margin-bottom: 5px;
      }
      .timeaxis {
        width: 100%;
        height: 170px;
        overflow: hidden;
        color: #fff;
      }
    }
    &::after {
      display: block;
      content: '';
      clear: both;
    }
  }
  .confirmModal {
    display: flex;
    i {
      color: #ff9900;
      font-size: 36px;
      margin: 10px 20px 10px;
    }
    div {
      margin-left: 20px;
      margin-top: 10px;
      vertical-align: middle;
    }
    span {
      color: #be2e2e;
      font-weight: bold;
      word-break: break-all;
    }
    p {
      padding-bottom: 5px;
    }
    .tagTimeModal {
      span {
        display: inline-block;
        margin-left: 20px;
        margin-top: 5px;
      }
    }
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
</style>
