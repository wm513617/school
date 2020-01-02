<template>
  <!-- 回放的最外层页面  -->
  <div id="play-back" class="video-pb">
    <div class="left">
      <div class="leftTop">
        <VideoMenu :synchro="synchro" ref="videoMenu" parent="playback" @changeNodeId="changeNodeId" :iconToggle="false"></VideoMenu>
      </div>
      <div class="synchro">
        <Checkbox v-model="synchro">同步回放</Checkbox>
      </div>
    </div>

    <div class="center">
      <!-- 视频窗口 -->
      <div class="video-box">
        <playback-video style="width:100%;height:100%" ref="playbackVideo" @playEnd="finishPlay" @screen="screen" @avtiveChange='avtiveChange' @changePluginData="changePluginData" @pause="pauseEvent" @resume="resumeEvent"></playback-video>
      </div>
      <!-- 时间轴 -->
      <div class="timeaxis">
        <TimeLine v-model="timelineValue" :disabled="disabledTimeline" :recordInfo="recordInfo" :showThumb="showThumb" :stepLength.sync="stepLength" :unParsedValue.sync="timelineValueUnParsed" :cutTime='cutTime' :isCut="isCut" @ondrag="dragTimeline" @changeSync="changeSync" @mouseDown="clearTimer" @thumbClick='thumbClick' @upTimeList='upTimeList' ref="timeLine"></TimeLine>
      </div>
    </div>
    <!-- 检索条件栏 -->
    <div class="right">
      <Retrieval tabVal="playBack" @sourceTypeChange='sourceTypeChange' :loading="btnLoading" @on-query="queryRecord" @playNVR="playNVR" @queryNVR="queryNVR" ref="retrieval">
        <div v-if="tagTableShow" style="margin-top:30px">
          <Table border :height="360" :columns="tagTableColumns" :data="tagTableData"></Table>
        </div>
      </Retrieval>
    </div>

  </div>
</template>

<script>
import playbackVideo from './playbackVideo.vue'
import VideoMenu from 'components/videoMenu/VideoMenu.vue'
import TimeLine from 'components/BStimeLine.vue'
import Retrieval from '../Retrieval.vue'
import hook from './requestHook'
import asyncPlay from './asyncPlay'
import syncPlay from './syncPlay'
import nvrPlay from './nvrPlay'
import nvrPlaySync from './nvrPlaySync'
import timelineCalc from './timelineCalc'
import gbPlay from './gbPlay.js'
import segment from './segmentPlay.js' // 分段回放 js
// import playbackData from '../playbackData'

import { mapState, mapMutations, mapActions } from 'vuex'

const TAG_TYPE = 2147483647
export default {
  name: 'playRecord',
  components: {
    playbackVideo,
    VideoMenu,
    Retrieval,
    TimeLine
  },
  mixins: [hook, syncPlay, asyncPlay, nvrPlay, nvrPlaySync, timelineCalc, gbPlay, segment],
  data() {
    return {
      disabledTimeline: false,
      activeData: '',
      plugins: null,
      // 是否是同步回放
      synchro: false,
      // 检索时 按钮的状态
      btnLoading: false,
      // 画面窗口个数
      showThumb: 1,
      // 时间轴一格的时间长度
      stepLength: 7200,
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
      // 时间轴准确到毫秒 值
      timelineValueUnParsed: 0,
      // 时间轴使用的数据对象
      recordInfo: [],
      // 索引 文件类型选择标记时的查询结果
      tagTableData: [],
      // 索引 文件类型选择标记时的查询后的数据结构
      tagTableColumns: [
        { type: 'index', width: 45, align: 'center' },
        { title: '标记内容', key: 'content', width: 105, align: 'center' },
        {
          title: '时间',
          render: (h, params) => {
            const time = this.tagTableData[params.index].time
            return h('span', {}, this.$moment(time * 1000).format('MM-DD HH:mm:ss'))
          },
          align: 'center',
          width: 85
        },
        {
          title: '操作',
          render: (h, params) => {
            return h(
              'Button',
              {
                props: { type: 'ghost', size: 'small' },
                on: {
                  click: () => {
                    this.playTag(params.index)
                  }
                }
              },
              '播放'
            )
          },
          align: 'center'
        }
      ],
      calendarTime: new Date(),
      isCut: false,
      sourceType: 1,
      cutTime: ''
    }
  },
  computed: {
    ...mapState({
      // 当前选中的节点
      curNode: ({ videoOrg }) => videoOrg.curNode,
      // 是否同步
      isSync: ({ playback }) => playback.isSync,
      // 视频窗口中焦点的id
      activedId: ({ playback }) => playback.activedId,
      // 检索出来的所有查询到的资源 array
      resourceList: ({ playback }) => playback.resourceList
    }),
    // 插件组件对象
    plugin() {
      return this.$refs.playbackVideo.$refs.frame
    },
    // 插件组件的所有插件
    // plugins() {
    //   return this.$refs.playbackVideo.$refs.frame.plugins
    // },
    // 操作按钮的组件引用
    buttons() {
      return this.$refs.playbackVideo
    },
    // 当前激活窗口的index
    activedIndex: {
      get() {
        return this.plugin.activedIndex
      },
      set(i) {
        this.plugin.activedIndex = i
        this.getTagTableData()
      }
    },
    // 激活窗口插件的data
    pluginData() {
      return this.$refs.playbackVideo.$refs.frame.pluginData
    },
    // 时间轴组件的引用
    timelineRef() {
      return this.$refs.timeLine
    },
    // 是否显示标记索引结果的表格
    tagTableShow() {
      return this.tagTableData.length > 1
    }
  },
  watch: {
    // resourceList数据变化后，绘制时间轴
    resourceList(l) {
      this.drawTimeline()
      this.getTagTableData()
    },
    stepLength() {
      this.drawTimeline()
    },
    synchro(s) {
      this.CHECK_SYNC(s)
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
    }
  },
  methods: {
    ...mapMutations([
      'SET_FAVID',
      'SET_ORGID',
      'SET_CURNODE',
      'CHANGE_SYNC',
      'CHANGE_ACTIVEID',
      'SET_RESOURCE',
      'CLEAR_RESOURCE',
      'CHECK_SYNC'
    ]),
    ...mapActions(['recordLog', 'getCameraPower']),
    // 画时间轴
    _drawTimeline() {
      if (this.showThumb === 1) {
        this.addSingleTimelineInfo()
      } else {
        this.addAllTimelineInfo()
      }
    },
    // 播放标记
    playTag(index) {
      const time = this.tagTableData[index].time
      this.dragTimeline(time * 1000)
    },
    // 标记列表中的数据
    getTagTableData() {
      const param = this.resourceList[this.activedIndex]
      if (param && param.isQueryTag) {
        this.tagTableData = param.tags[param.queryParam.typeName] || []
      } else {
        this.tagTableData = []
      }
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
        this.$Notice.warning({ desc: '同步回放支持的文件类型为[全部]和[定时录像]', title: '警告' })
        return
      }
      if (!this.resourceList.length) {
        return
      }
      if ((this.isSync && !bool) || (!this.isSync && bool)) {
        return
      }
      // if (this.isSync) {
      if (bool) {
        // 切换到异步
        // 关闭同步定时器  开启所有暂停的
        this.clearSyncTimer()
        this.resourceList.forEach((item, index) => {
          if (item && item.total !== 0) {
            this.openPlugin(item, this.timelineValue / 1000, index)
          }
        })
      } else {
        // 切换到同步
        this.buttons._closeSound()
        this.buttons.state.isVolumeOpen = false
        this.syncTime(this.timelineValue / 1000)
      }
      this.CHANGE_SYNC(!this.isSync)
    },
    // 添加所有的时间轴数据
    addAllTimelineInfo() {
      this.recordInfo = []
      this.resourceList.forEach((item, index) => {
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
      const index = +this.activedId.split('_')[1]
      const item = this.resourceList[index]
      if (item) {
        this.addTimelineInfo(item, index)
      } else {
        this.clearTimer()
        this.timelineRef.chengeTime(this.defaultTimelineValue)
      }
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
    // 绘制时间轴 // 传时间可重新开流 并渲染时间轴
    dragTimeline(time) {
      if (this.isSegment && this.segment.length !== 0) { // 分段回放 限制起止时间
        // 超过分段的起止时间 都跳回分段开始时间
        if (time < (this.segment[this.$refs.playbackVideo.activedIndex].startTime * 1000) || time > (this.segment[this.$refs.playbackVideo.activedIndex].endTime * 1000)) {
          time = (this.segment[this.$refs.playbackVideo.activedIndex].startTime * 1000) + 300
        }
      }
      if (this.isSync) {
        this.syncTime(time / 1000)
      } else {
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
    clearTimer() {
      clearInterval(this.timelineTimer)
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
        this.isUpTime && this.setTimelineValue()
      }, 1000)
    },
    // 获取当前播放时间
    getPluginCurtime() {
      let time = this.plugin.getPlayerCurTime()
      // console.log(this.plugin.getPlayerTime())
      time = JSON.parse(time)
      // console.log(time)
      if (time.success && time.msCur) {
        return time.msCur
      } else {
        return 0
      }
    },
    // 新加同步是否开始播放逻辑
    isSyncOpen(time) {
      this.$nextTick(() => {
        let isDrag = false
        for (let index = 0; index < this.resourceList.length; index++) {
          const element = this.resourceList[index]
          let isSyncPause = this.$refs.playbackVideo.$refs.frame.$refs.video[index].isSyncPause
          if (!isSyncPause) { continue }
          if (time >= (element.eventList[0].evtTblInfo.startTime * 1000)) {
            isDrag = true
            break
          }
        }
        if (isDrag) {
          console.log('isDrag------------')
          this.dragTimeline(time)
        }
      })
    },
    // 获取并设置时间轴的值  ---上面显示的时间
    setTimelineValue() {
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
        this.isSyncOpen(time)
      } else { // 异步回放
        if (this.plugin.pluginState.isStopped) {
          // time = this.defaultTimelineValue
        } else {
          time = this.getPluginCurtime()
        }
      }
      if (time) {
        this.$refs.timeLine.chengeTime(time)
      }
    },
    // 点击检索
    async queryRecord(param) {
      this.buttons.resetHook()
      this.CHANGE_SYNC(this.synchro)
      this.$store.commit('CHANGE_NVR', false)
      this.$refs.timeLine.clearThumbQueue()
      if (this.isSync) { // 同步回放
        const nodeList = this.getSelectedNodes().filter(item => item.eid)
        let nodes = []
        let noPower = 0
        for (let index = 0; index < nodeList.length; index++) {
          const node = nodeList[index]
          const power = await this.getCameraPower(node._id)
          if (power && power.includes('playback')) { // 权限判断
          // 停用设备不查录像
            if (Number(node.eid.deviceStatus) !== 0) {
              nodes.push(node)
            }
          } else {
            noPower++
          }
        }
        if (noPower) {
          this.$Notice.warning({ desc: `${noPower}个通道没有权限！`, title: '警告' })
        }
        if (!nodes.length) {
          this.$Notice.warning({ desc: '请选择一个摄像头！', title: '警告' })
          return
        } else if (nodes.length > 4) {
          this.$Notice.warning({ desc: '最多支持4通道同步回放', title: '警告' })
          return
        }
        if (!this.samePlatform(nodes)) {
          this.$Notice.warning({ desc: '不同平台的设备不可以同步回放！', title: '警告' })
          return
        }
        const eventType = param.eventType[0]
        if (eventType !== 'timeRecord' && eventType !== 'all') {
          this.$Notice.warning({ desc: '同步回放支持的文件类型为[全部]和[定时录像]', title: '警告' })
          return
        }
        this.queryMultiRecord(param, nodes)
      } else { // 异步回放
        if (!this.curNode.eid) {
          this.$Notice.warning({ desc: '请选择一个摄像头！', title: '警告' })
          return
        }
        // 增加停用设备无法回放
        if (Number(this.curNode.eid.deviceStatus) === 0) {
          this.$Notice.warning({ desc: '该设备已禁用！', title: '警告' })
          return
        }
        // console.log('querySingleRecord_param===>', JSON.stringify(param))
        this.querySingleRecord(param, this.curNode)
      }
    },
    /**
     * 同步回放时，判断所选设备是否属于同一平台
     */
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
    // 添加单个时间轴对象
    addTimelineInfo(param, index = this.activedIndex) {
      const eventList = param.eventList || param.recordInfo || param.recordList || []
      const tag = param.queryParam.typeName
      const catchedTimelineInfo = this.catchCalcTimeline(eventList, this.timelineValue, this.stepLength)
      const obj = {
        ...catchedTimelineInfo,
        label: param.name,
        resId: param.res + '_' + index,
        tags: []
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
        // 添加一个假的为了能出黑色的底条
        obj.timedVideo.push({
          start: 1000,
          end: 1001
        })
      }
      this.$set(this.recordInfo, index, obj)
    },
    // 播放完一段录像后的回调
    finishPlay(index) {
      if (!this.isSync && !this.isNVR) {
        // 中心异步回放
        const param = this.resourceList[index]
        // eslint-disable-next-line
        function findTime(list, time) {
          // 查询下一段录像的开始时间
          let t = 0
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (i !== list.length - 1) {
              const info = item.evtTblInfo || item
              const ninfo = list[i + 1].evtTblInfo || list[i + 1]
              if (info.startTime < time && time <= info.endTime) {
                t = info.startTime > time - 10 ? time : ninfo.startTime
                break
              } else if (info.endTime <= time && time < ninfo.startTime) {
                t = ninfo.startTime
                break
              }
            }
          }
          return t
        }
        // 如果查询的为全部录像，把当前时间作为下一段录像的开始时间，遇到没有录像的时间段，插件会自动跳转
        let curTime = JSON.parse(this.plugin.getPlayerCurTime())
        if (curTime && curTime.success && this.resourceList[index].queryParam.eventType[0] === 'all') {
          curTime = parseInt(curTime.msCur / 1000) + 1
        } else {
          curTime = null
        }
        const time = findTime(param.eventList || param.recordList, parseInt(this.timelineValue / 1000))
        if (time) {
          this.plugins[index].syncPause()
          this.openPlugin(param, time, index, curTime)
        } else {
          // 没有下一段就关闭
          this.plugins[index].stop()
          this.setResource({
            index: this.plugin.activedIndex,
            item: null
          })
        }
      }
    },
    // 打开插件播放
    openPlugin(param, time, index = this.activedIndex, curTime) {
      const plugin = this.plugins[index]
      if (!param.total && !param.queryParam.childId) {
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
      if (param.queryParam.childId) {
        // 国标设备开流  分段回放 录像段数组 格式化为  eventList
        return this.gbOpen(param, { startTime: curTime || time, endTime: findEndTime(param.recordList || param.eventList, time) }, index)
      }
      const openParam = {
        startTime: curTime || time,
        endTime: findEndTime(param.eventList, time),
        // endTime: !this.isSync ? parseInt(new Date().getTime() / 1000) : findEndTime(param.eventList, time),
        dsIp: param.dsIp,
        dsPort: param.dsPort,
        strmInfo: this.findStrmInfo(param.eventList, time) || param.eventList[0].strmInfo
      }
      plugin.syncResume(openParam, {
        id: param.res,
        ...param
      })
      this.$refs.playbackVideo.wallOpen(openParam)
      return true
    },
    pauseEvent() {
      if (this.isSync) {
        this.clearTimer()
      }
    },
    resumeEvent() {
      if (this.isSync) {
        this.changeTimeline()
      }
    },
    getSelectedNodes() {
      return this.$refs.videoMenu.getSelectedNodes()
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
      if (query.shareServer) {
        // 国标录像查询
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
    }
  },
  created() {
    this.CLEAR_RESOURCE()
    this.drawTimeline = this.$lodash.debounce(this._drawTimeline.bind(this), 200)
  },
  async mounted() {
    await this.$nextTick()
    this.plugins = this.$refs.playbackVideo.$refs.frame.plugins
  },
  beforeDestroy() {
    this.drawTimeline = null
    this.plugins = null
    this.clearTimer()
    this.SET_CURNODE('')
    this.clearSyncTimer()
    this.CLEAR_RESOURCE()
    this.plugin.stopAll()
    if (window.CollectGarbage) {
      window.CollectGarbage()
    }
  }
}
</script>

<style scoped>
#play-back {
  font-size: 12px;
  height: 100%;
  width: 100%;
  /* padding-top: 20px;
  padding-bottom: 20px; */
  /*position: relative;*/
}

#play-back::after {
  display: block;
  content: '';
  clear: both;
}

#play-back > .right {
  height: 100%;
  /* width: 340px; */
  float: left;
  /* margin: 0 12px; */
  /* overflow: auto; */
  color: #fffafa;
}

#play-back > .left {
  /* height: calc(100% - 110px); */
  /* width: 300px; */
  /* margin: 0 12px; */
  position: absolute;
  /* overflow: auto; */
  color: #fff;
  background: #1b3153;
}

#play-back .leftTop {
  height: calc(100% - 50px);
  /* overflow: auto; */
}

#play-back .synchro {
  padding: 10px;
  border-top: 1px solid rgba(58, 90, 139, 0.4);
}

#play-back > .center {
  height: 100%;
  /* width: calc(100% - 688px); */
  padding: 0;
  float: left;
  /* margin-left: 324px; */
  position: relative;
  min-width: 600px;
}

#play-back > .center .timeaxis {
  width: 100%;
  height: 170px;
  overflow: hidden;
  color: #fff;
}

#play-back > .center .video-box {
  width: 100%;
  height: calc(100% - 175px);
  position: relative;
  margin-bottom: 5px;
}
</style>
<style>
#play-back .ivu-table-cell {
  padding: 0;
  text-align: center;
}
</style>

<style lang="less">
.video-pb {
  padding: 16px 0;
  & > .left {
    width: 272px;
    margin: 0;
    height: calc(~'100% - 32px');
  }
  & > .center {
    width: calc(~'100% - 604px');
    margin-left: calc(~'272px + 16px');
  }
  & > .right {
    width: 300px;
    margin-left: 16px;
  }
}
</style>
