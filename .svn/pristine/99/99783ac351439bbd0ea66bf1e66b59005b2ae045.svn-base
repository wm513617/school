<template>
  <div id="time-line" @mouseleave="mu">
    <div class="calendar">
      <span class="calendar-text">{{now}}</span>
    </div>
    <div class="content" @mousedown="md" @mouseup="mu" @mouseleave="canMove = false;isCuting = false" @mousemove="mm">
      <!--时间轴-->
      <div style="width: calc(100% - 90px);margin-left:90px;overflow: hidden;" class="timeLine" ref="timeLine">
        <div class="time-list" :style="{width: (width * 25 / 12) + 'px',marginLeft: offsetLeft + 'px'}">
          <div class="item" :key="i" :style="{width: width/12 + 'px'}" v-for="(item, i) in thumbTimeList">{{item.time}}</div>
        </div>
      </div>
      <div class="channelName" style="position: absolute;left:15px;">通道名称</div>
      <!--刻度条、中界限-->
      <div class="bg-line" :style="{backgroundPositionX: offsetLeft + width/24 + 'px'}">
        <!-- 绘制刻度 -->
        <div class="scaleBox" style="width: 100%;height:10px;overflow: hidden;float: left;">
          <div class="scaleInbox" :style="{width: (width * 25 / 12) + 'px',marginLeft: offsetLeft - width/60 *1.5 + 'px'}">
            <div class="scale" :class="{'center': i%5 === 0}" :key="i" :style="{width: width/60 + 'px'}" v-for="i in 125"></div>
          </div>
        </div>

        <div class="pointer">
          <div class="pointer-line"></div>
        </div>
      </div>

      <!--进度条-->
      <bs-scroll class="color-line-box" height="100px">
        <div>
          <div class="color-lines" v-for="(option, i) in recordOptions" :key="i" :class="{'active': activedId === option.resId }" @click="lineClick($event,option.resId)" @mouseleave="leaveLine">
            <span class="line-title" :title="option.label">{{option.label}}</span>
            <div class="color-line" :class="{'no-content': !(option.timedOptions.length || option.eventOptions.length)}" @mousemove="lineHover($event, i)">

              <div class="timed-line" v-for="item in option.timedOptions" :key="item.id" :style="{width: item.width + 'px', left: item.position + 'px'}"></div>
              <div class="event-line" v-for="item in option.eventOptions" :key="item.id" :style="{width: item.width + 'px', left: item.position + 'px'}"></div>
              <!-- 手动录像 -->
              <div class="manual-line" v-for="item in option.manualOptions" :key="item.id" :style="{width: item.width + 'px', left: item.position + 'px'}"></div>
              <div class="tags" v-for="(item, index) in option.tags" :key="100000+index" :title="item.name" :style="{left: item.timedPosition + 'px'}" @click="$emit('ondrag', item.time)"></div>
              <!-- 剪切选择条 -->
              <div class="cut-line" :style="{width: cutDate.width  + 'px', left: cutDate.position + 'px'}" v-if="isCut&&activedId === option.resId">
                <span class="cut-left"></span>
                <span class="cut-right"></span>
              </div>
            </div>

            <span style="position: absolute;bottom:-5px" :style="{left: cutDate.cutTimeLeft + 'px'}" v-if="isCut&&activedId === option.resId">{{cutDate.cutTime}}</span>

          </div>
        </div>
      </bs-scroll>

      <!--缩略图框-->
      <div style="width: calc(100% - 90px);margin-left:90px;overflow: hidden;position: absolute;bottom:0;" v-if="!isNVR && (showThumb === 1) && (recordInfo.length > 0) && isReveal" class="thumbTime">
        <div class="time-list" :style="{width: (width * 25 / 12) + 'px',marginLeft: offsetLeft + 'px'}">
          <div class="" :key="i" :style="{width: width/12 + 'px',height:'64px',border:'1px solid #203863', background: '#0f2243',float:'left'}" v-for="(item, i) in thumbTimeList" @click="thumbClick(item)" @mousemove="thumbHover($event, item, i)" @mouseleave="leaveThumb">
            <img :src="item.thumbUrl" alt="" style="width:100%;height:100%;">
          </div>
        </div>
      </div>

      <!-- 鼠标移入时间轴快照 -->
      <div class="snap" :style="{left: snapLeft + 'px',bottom:snapTop +'px'}" v-if="showSnap">
        <Spin size="large" fix v-if="spinShow&&!snapUrl"></Spin>
        <span style="line-height: 90px;color:#000;" v-if="!spinShow&&!snapUrl">加载失败</span>
        <img style="width:100%;height:100%;" :src="snapUrl" v-if="snapUrl"/>
      </div>

      <!-- 鼠标移入切片快照 -->
      <div class="thumbSnap" :style="{left: thumbSnapLeft +'px'}" v-if="showThumbSnap&&thumbSnapUrl">
        <img style="width:100%;height:100%;" :src="thumbSnapUrl"/>
      </div>

    </div>
    <div class="signs">
      <div class="event-video video">
        <span class="text">事件录像</span>
        <span class="color"></span>
      </div>
      <div class="timed-video video">
        <span class="text">定时录像</span>
        <span class="color"></span>
      </div>
      <div class="manual-video video">
        <span class="text">手工录像</span>
        <span class="color"></span>
      </div>
    </div>
    <div class="zoom">
      <div class="zoom-out iconfont icon icon-large" :class="{'disabled': step === steps.length - 1}" @click="zoomIn"></div>
      <div style="float:left;font-size:12px;width:28px;color: #a0a0a0;">{{spacing[step]}}</div>
      <div class="zoom-in iconfont icon icon-small" :class="{'disabled': step === 0}" @click="zoomOut"></div>
    </div>
    <!-- <div class="switch active" :class="{disabled: isNVR}" @click="$emit(isNVR? '' : 'changeSync')">{{isSync?'切换异步回放':'切换同步回放'}}
    </div> -->
    <div class="switch active" :class="{disabled: isNVR}" v-if="!isNVR">
      <div :class="{active:!isSync}" @click="$emit(isNVR? '' : 'changeSync', true)">异步回放</div>
      <div :class="{active:isSync}" @click="$emit(isNVR? '' : 'changeSync', false)">同步回放</div>
    </div>
    <!-- 切片开关- - 预留备用 -->
    <!-- <i-switch v-model="isReveal " @on-change="loadThumb" class="thumbSwitch" title="显示切片" v-if="!isNVR && (showThumb === 1) && (recordInfo.length > 0)"></i-switch> -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'BStimeline',
  components: {},
  props: {
    recordInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: Number,
      default: () => {
        const date = new Date()
        date.setHours(12)
        date.setMinutes(0)
        date.setSeconds(0)
        return parseInt(date.getTime() / 1000) * 1000
      }
    },
    canForward: {
      type: Boolean,
      default: true
    },
    showThumb: {
      default: 4
    },
    disabled: {
      default: false
    },
    isCut: {
      type: Boolean,
      default: false
    },
    cutTime: {
      default: ''
    }
  },
  data() {
    return {
      initTime: 0,
      level: 6,
      // levels: [24, 12, 6, 3, 1, 0.5, 0.2], // 6-0.1 3-0.05-15
      width: 0,
      canMove: false,
      startPosition: 0,
      rangeTime: 0,
      activeline: 0,
      thumbTimeList: [],
      steps: [5, 60, 150, 300, 900, 1800, 3600, 7200],
      step: 7,
      spacing: ['1m', '12m', '30m', '1h', '3h', '6h', '12h', '24h'],
      offsetLeft: '',
      isMoved: false, // 标识是否移动过
      showSnap: false, // 是否显示鼠标移入时间轴快照
      moveTimer: null,
      disTimer: null,
      snapUrl: '',
      snapLeft: -500,
      snapTop: 0,
      showThumbSnap: false, // 是否显示鼠标移入切片快照
      thumbSnapUrl: '',
      thumbSnapLeft: -500,
      // isReveal: true, // 是否加载切片
      spinShow: false, // 是否显示时间轴切片加载动画
      thumpQueue: [], // 切片请求队列
      isGetThumbing: false, // 是否正在获取切片
      getThumbTimer: null,
      isCuting: false,
      cutType: '',
      cutDate: {}
    }
  },
  computed: {
    ...mapGetters(['plugins']),
    ...mapState({
      isSync: ({ playback }) => playback.isSync,
      activedId: ({ playback }) => playback.activedId,
      resourceList: ({ playback }) => playback.resourceList,
      isNVR: ({ playback }) => playback.isNVR,
      playbackSliceToogle: ({ platform }) => platform.parameters.playbackSlice // 回放切片开关
    }),
    time12() {
      const date = new Date()
      date.setHours(12)
      date.setMinutes(0)
      date.setSeconds(0)
      return parseInt(date.getTime() / 1000) * 1000
    },
    stepLength() {
      return this.steps[this.step]
    },
    scale() {
      return (this.steps[this.step] * 12 * 1000) / this.width
    },
    bgStart() {
      return this.time - (this.steps[this.step] / 2) * 12 * 1000
    },
    recordOptions() {
      return this.recordInfo
        .filter(item => item)
        .map(({ eventVideo, timedVideo, manualVideo, label, resId, tags }) => {
          return {
            eventOptions: eventVideo.map(({ start, end }, index) => ({
              ...this.getPosition(start, end),
              id: 'e' + resId + index
            })),
            timedOptions: timedVideo.map(({ start, end }, index) => ({
              ...this.getPosition(start, end),
              id: 't' + resId + index
            })),
            // 新添加的手工录像
            manualOptions: manualVideo.map(({ start, end }, index) => ({
              ...this.getPosition(start, end),
              id: 'm' + resId + index
            })),
            label,
            resId,
            tags: (tags || []).map(({ time, name }) => {
              time -= time % 1000
              return { name, timedPosition: (time - this.bgStart) / this.scale, time }
            })
          }
        })
    },
    time() {
      const time = parseInt((this.initTime + this.rangeTime) / 1000) * 1000
      this.$emit('input', time)
      return time
    },
    now() {
      const date = new Date(this.time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const secondes = date.getSeconds()
      return `${this.addZero(year)}-${this.addZero(month)}-${this.addZero(day)} ${this.addZero(hours)}:${this.addZero(
        minutes
      )}:${this.addZero(secondes)}`
    },
    isReveal() { // 是否加载切片
      return this.playbackSliceToogle === '开'
    }
  },
  watch: {
    value(newValue) {
      if (this.canMove) {
        return
      }
      this.rangeTime = newValue - this.time12
    },
    offsetLeft() {
      if (this.offsetLeft < (-this.width * 12.5) / 12) {
        this.offsetLeft += this.width / 2
        this.thumbTimeList.splice(0, 6)
        const b = this.thumbTimeList[this.thumbTimeList.length - 1].value
        !this.isNVR && this.showThumb === 1 && this.thumbFn(this.thumbTimeList[this.thumbTimeList.length - 1]) // 解决拖拽时 中间会漏一张切片，原因未知
        for (let i = 1; i < 7; i++) {
          const a = b + this.steps[this.step] * i
          const obj = { time: this.toTime(a * 1000), value: a }
          !this.isNVR && this.showThumb === 1 && this.thumbFn(obj)
          this.thumbTimeList.push(obj)
        }
        this.$emit('upTimeList', this.thumbTimeList[0].value, this.thumbTimeList[23].value)
      }
      if (this.offsetLeft > (-this.width * 0.5) / 12) {
        this.offsetLeft -= this.width / 2
        this.thumbTimeList.splice(18, 6)
        const d = this.thumbTimeList[0].value
        for (let j = 1; j < 7; j++) {
          const c = d - this.steps[this.step] * j
          const obj = { time: this.toTime(c * 1000), value: c }
          !this.isNVR && this.showThumb === 1 && this.thumbFn(obj)
          this.thumbTimeList.unshift(obj)
        }
        this.$emit('upTimeList', this.thumbTimeList[0].value, this.thumbTimeList[23].value)
      }
    },
    showThumb(num) {
      if (num === 1) {
        this.initTimeList()
      } else {
        this.initTimeList(this.time, true)
        this.clearThumbQueue() // 清除未请求的切片
      }
    },
    // thumbTimeList() {
    //   this.upThumb()
    // },
    stepLength(a) {
      this.$emit('update:stepLength', a)
    },
    cutTime(a) {
      if (this.cutTime) {
        this.cutDate.startTime = a
        this.cutDate.endTime = a + this.steps[this.step]
        this.upCurDate()
        console.log(this.steps[this.step], ' 888888888888')
      }
    }
  },
  methods: {
    ...mapMutations(['CHANGE_ACTIVEID']),
    getPosition(start, end) {
      start -= start % 1000
      end -= end % 1000
      let position = (start - this.bgStart) / this.scale
      let width = (end - start) / this.scale
      // 如果宽度大于了5000 其他超出部分没有意义，所以把宽度和left值都去掉了多余部分
      // if (width > 5000) {
      //   const dv = width - 5000
      //   width -= dv
      //   if (position < -5000) {
      //     position += dv
      //   }
      // }
      return { position, width }
    },
    addZero(n) {
      return n.toString().length < 2 ? '0' + n : '' + n
    },
    md(e) {
      if (this.isCut) {
        this.lineDown(e)
        return
      }
      if (this.recordInfo.length <= 0) {
        return
      }
      if (this.disabled) {
        return
      }
      this.leaveLine() // 鼠标按下清除鼠标移入时间轴或切片显示
      this.leaveThumb()
      this.startPosition = e.clientX - (e.clientX % (this.width / this.steps[this.step] / 12))
      this.canMove = true
      this.$emit('mouseDown')
    },
    mm(e) {
      if (this.isCut) {
        this.lineMove(e)
        return
      }
      if (this.canMove) {
        const endPosition = e.clientX - (e.clientX % (this.width / this.steps[this.step] / 12))
        const rangePosition = endPosition - this.startPosition
        if (!this.canForward && rangePosition < 0) {
          return
        }
        this.isMoved = true
        this.startPosition = endPosition
        this.rangeTime -= rangePosition * this.scale
        // -----------------------------------
        this.offsetLeft += rangePosition
      }
    },
    mu(e) {
      if (this.isCut) {
        this.lineUp()
        return
      }
      if (this.recordInfo.length <= 0) {
        return
      }
      this.canMove = false
      if (this.isMoved) {
        this.$emit('ondrag', this.time)
        setTimeout(() => {
          this.isMoved = false
          this.getThumbQueue(this.thumpQueue.pop()) // 鼠标抬起，请求拖拽过程中未加载的切片
        }, 0)
      }
      // this.initTimeList(null, true)
    },
    lineClick(e, id) {
      if (this.isCut) {
        return
      }
      if (this.activedId && id === this.activedId && !this.isMoved) {
        // const p = -(e.layerX - this.width / 2)
        const place = -(e.screenX - 380 - this.width / 2)
        this.rangeTime -= place * this.scale
        // -----------------------------------
        this.offsetLeft += place
        this.$emit('ondrag', this.time)
      } else {
        if (this.isMoved) {
          return
        }
        this.CHANGE_ACTIVEID(id)
      }
    },
    zoomOut() {
      if (this.step === 0) {
        return
      }
      this.step--
      this.initTimeList()
      this.upCurDate()
    },
    zoomIn() {
      if (this.step === this.steps.length - 1) {
        return
      }
      this.step++
      this.initTimeList()
      this.upCurDate()
    },
    toTime(time) {
      const date = new Date(time)
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const secondes = date.getSeconds()
      return `${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(secondes)}`
    },
    initTimeList(t, upThumb) {
      this.thumbTimeList = []
      let nowtime
      if (t) {
        nowtime = t / 1000 - ((t / 1000) % this.steps[this.step])
        this.rangeTime = t - this.time12
      } else {
        nowtime = this.time / 1000 - ((this.time / 1000) % this.steps[this.step])
      }
      for (let i = 12; i > 0; i--) {
        const a = nowtime - this.steps[this.step] * i
        // const b = (nowtime - this.steps[this.step] * (i - 1))
        this.thumbTimeList.push({ time: this.toTime(a * 1000), value: a })
      }
      for (let i = 0; i < 12; i++) {
        const a = nowtime + this.steps[this.step] * i
        // const b = (nowtime + this.steps[this.step] * (i + 1))
        this.thumbTimeList.push({ time: this.toTime(a * 1000), value: a })
      }
      this.upLeft()
      this.$emit('upTimeList', this.thumbTimeList[0].value, this.thumbTimeList[23].value)
      if (upThumb) {
        return
      }
      this.upThumb()
    },
    upLeft() {
      // if (this.step !== 0) {
      this.offsetLeft = -(
        (this.width * 6.5) / 12 +
        ((this.time / 1000) % this.steps[this.step]) * (this.width / this.steps[this.step] / 12)
      )
      // } else {
      //   this.offsetLeft = -this.width * 6.5 / 12
      // }
    },
    chengeTime(t) {
      this.$emit('update:unParsedValue', t)
      t -= t % 1000
      if (t / 1000 < this.thumbTimeList[0].value || t / 1000 > this.thumbTimeList[23].value) {
        this.initTimeList(t)
      }
      // this.rangeTime += t   initTime
      // this.offsetLeft -= t / this.scale
      this.offsetLeft -= (t - this.time) / this.scale
      this.rangeTime = t - this.initTime
      // this.rangeTime += t - this.time
    },
    /**
     * 切片请求
     * startTime 开始时间
     * endTime 结束时间
     * callback 插件请求回调
     * index 时间轴索引，默认为0
     * 每次请求先放入队列中
     */
    getThumb(startTime, endTime, callback, index, bool) {
      if (this.$root.isFullscreen) {
        return
      }
      if (this.activedId) {
        // const index = this.activedId.split('_')[1]
        const item = this.resourceList[index || 0]
        const res = item || {}
        // 下联设备切片获取暂时返回
        if (!res.total || res.queryParam.childId) {
          return
        }
        const obj = {}
        obj.eventList = {}
        obj.eventList.timeInfo = {}
        obj.eventList.strmInfo = {}
        obj.eventList.timeInfo.startTime = startTime + ''
        obj.eventList.timeInfo.endTime = endTime + ''
        obj.eventList.strmInfo = res.eventList[0].strmInfo
        const param = {
          ip: res.dsIp,
          // port: res.dsPort,
          port: 9000 + '',
          beginTime: startTime + '',
          endTime: endTime + '',
          cmdStr: JSON.stringify({
            params: {
              jsonrpc: '2.0',
              id: '1',
              method: 'brest',
              call: 'AV.Record.playopen',
              args: obj
            }
          })
        }
        // this.$parent.plugin.getRecordSlice(param, callback)
        if (bool) {
          this.thumpQueue.unshift({ param, callback })
        } else {
          this.thumpQueue.push({ param, callback })
        }
        if (!this.isGetThumbing) {
          !this.canMove && this.getThumbQueue(this.thumpQueue.shift())
        }
      }
      // this.$parent.plugin.getRecordSlice(this.$parent.plugin.pluginData[0].param, callback)
    },
    /**
     * 切片请求队列
     * 多张切片依次请求，在上一张切片请求回调中请求下一张，或500毫秒没有收到上一张切片返回请求下一张
     */
    getThumbQueue(param) {
      if (this.canMove) {
        return
      } // 拖拽过程中不在请求切片
      if (!param) {
        this.isGetThumbing = false
        return
      }
      this.isGetThumbing = true
      clearTimeout(this.getThumbTimer)
      // 切片请求插件由页面播放插件改为全局插件
      // this.$parent.plugin.getRecordSlice(param.param, (state, url) => {
      this.plugins.GetRecordSlice(JSON.stringify(param.param), (state, url) => {
        param.callback(state, url)
        !this.canMove && this.getThumbQueue(this.thumpQueue.shift())
        clearTimeout(this.getThumbTimer)
      })
      this.getThumbTimer = setTimeout(() => {
        !this.canMove && this.getThumbQueue(this.thumpQueue.shift())
      }, 500)
    },
    /**
     * 清除切片请求队列
     */
    clearThumbQueue() {
      clearTimeout(this.getThumbTimer)
      this.thumpQueue = []
    },
    /**
     * 是否需要请求切片
     * time 请求切片的时间点
     * index 时间轴索引，默认值0
     */
    isGetTumb(time, index) {
      const data = this.recordInfo[index || 0]
      if (!data) {
        return
      }
      const step = (this.steps[this.step] * 1000) / 2
      function compare(d) {
        for (let i = 0; i < d.length; i++) {
          if (time > d[i].start - step && time < d[i].end + step) {
            return true
          }
        }
        return false
      }
      return compare(data.eventVideo) || compare(data.timedVideo) || compare(data.manualVideo)
    },
    _upThumb() {
      if (!this.isNVR && this.recordInfo.length > 0 && this.showThumb === 1 && this.isReveal) {
        this.thumbTimeList.forEach((item, i) => {
          this.thumbFn(item)
        })
      }
    },
    thumbFn(item) {
      if (this.isGetTumb(item.value * 1000)) {
        let num = 0
        const callback = (state, url) => {
          item.thumbUrl = url
          if (!url && num < 2) {
            this.getThumb(item.value, item.value + this.steps[this.step], callback)
            num++
          }
        }
        this.getThumb(item.value, item.value + this.steps[this.step], callback)
      }
    },
    thumbClick(item) {
      if (this.isCut) {
        return
      }
      if (item.thumbUrl) {
        this.$emit('thumbClick', item)
      } else {
        this.$emit('thumbClick', false)
      }
    },
    /**
     * 鼠标移入line
     * e 事件对象
     * index 鼠标移入时间轴的索引
     */
    lineHover(e, index) {
      if (this.canMove) {
        return
      }
      if (this.isCut) {
        return
      }
      const item = this.resourceList[index || 0]
      // 下联设备切片获取暂时返回
      if (item.queryParam.childId) {
        return
      }
      // 多通道已经实现，暂时不显示
      if (this.isNVR || this.showThumb !== 1) {
        return
      }
      const left = e.screenX - 380
      if (this.snapLeft - 10 > left || this.snapLeft + 10 < left) {
        this.leaveLine()
      }
      let num = 0
      if (this.moveTimer) {
        return
      }
      this.moveTimer = setTimeout(() => {
        this.spinShow = true
        this.snapLeft = left
        this.snapTop = window.screen.height - e.screenY - 40
        // const place = -(e.layerX - this.width / 2)
        const place = -(left - 45 - this.width / 2)
        const rangeTime = this.rangeTime - place * this.scale
        const time = parseInt((this.initTime + rangeTime) / 1000)
        if (this.isGetTumb(time * 1000, index)) {
          this.showSnap = true
          const callback = (state, url) => {
            this.snapUrl = url
            this.spinShow = false
            if (!url && num < 2) {
              this.getThumb(time - 10, time + 10, callback, index, true)
              num++
            }
          }
          this.getThumb(time - 10, time + 10, callback, index, true)
        }
        this.moveTimer = null
        clearTimeout(this.disTimer)
        this.disTimer = setTimeout(() => {
          this.showSnap = false
        }, 5000)
      }, 300)
    },
    /**
     * 鼠标移出line
     */
    leaveLine() {
      this.showSnap = false
      this.spinShow = false
      this.snapLeft = -500
      this.snapUrl = ''
      clearTimeout(this.moveTimer)
      this.moveTimer = null
    },
    /**
     * 手动加载切片
     */
    loadThumb(bool) {
      if (bool) {
        this.upThumb()
      }
    },
    /**
     * 鼠标移入切片
     */
    thumbHover(e, item, i) {
      if (this.isCut) {
        return
      }
      if (!item.thumbUrl) {
        return
      }
      this.showThumbSnap = true
      this.thumbSnapLeft = (this.width / 12) * (i + 1) + this.offsetLeft - 100
      this.thumbSnapUrl = item.thumbUrl
      clearTimeout(this.disTimer)
      this.disTimer = setTimeout(() => {
        this.leaveThumb()
      }, 3000)
    },
    /**
     * 鼠标移出切片
     */
    leaveThumb() {
      this.showThumbSnap = false
      this.thumbSnapLeft = -500
      this.thumbSnapUrl = ''
    },
    // 剪切初始化
    initCut() {
      this.isCuting = false
      this.cutType = ''
      this.cutDate = {}
    },
    // 计算时间轴某点的时间(精确到秒)
    getDotTime(e) {
      // 380 为时间轴开始位置距离屏幕左侧距离
      const left = e.screenX - 380
      const place = -(left - this.width / 2)
      const rangeTime = this.rangeTime - place * this.scale
      return parseInt((this.initTime + rangeTime) / 1000)
    },
    // 剪切时间轴鼠标按下
    lineDown(e) {
      if (!this.isCut) {
        return
      }
      const time = this.getDotTime(e)
      if (e.target.className === 'cut-left') {
        this.cutType = 'left'
      } else if (e.target.className === 'cut-right') {
        this.cutType = 'right'
      } else if (e.target.className === 'cut-line') {
        this.cutType = 'cutMove'
        this.cutDate.moveTime = time
      } else {
        this.cutType = 'initCut'
        this.initCut()
        this.cutDate.startTime = time
      }
      this.isCuting = true
    },
    // 剪切时间轴鼠标移动
    lineMove(e) {
      if (!this.isCuting) {
        return
      }
      const time = this.getDotTime(e)
      if (this.cutType === 'cutMove') {
        this.cutDate.startTime += time - this.cutDate.moveTime
        this.cutDate.endTime += time - this.cutDate.moveTime
        this.cutDate.moveTime = time
      } else if (this.cutType === 'left') {
        this.cutDate.startTime = time
      } else if (time > this.cutDate.startTime) {
        this.cutDate.endTime = time
      } else {
        this.cutDate.endTime = this.cutDate.startTime
        this.cutDate.startTime = time
      }
      this.upCurDate()
      this.cutDate.cutTimeLeft = e.clientX - 288
    },
    // 剪切时间轴鼠标抬起
    lineUp() {
      this.isCuting = false
      this.cutType = ''
    },
    // 更新剪切对象数据
    upCurDate() {
      if (!this.isCut) {
        return
      }
      this.cutDate = {
        ...this.cutDate,
        ...this.getPosition(this.cutDate.startTime * 1000, this.cutDate.endTime * 1000),
        cutTime: `剪切段：${this.toTime(this.cutDate.startTime * 1000)}--${this.toTime(this.cutDate.endTime * 1000)}`
      }
      this.cutDate.cutTimeLeft = this.cutDate.position > 0 ? this.cutDate.position + 90 : 90
    }
  },
  created() {
    this.initTime = this.time12
    this.rangeTime = this.value - this.time12
    this.upThumb = this.$lodash.debounce(this._upThumb.bind(this), 2000)
  },
  async mounted() {
    // const box = document.getElementById('time-line')
    // this.width = box.offsetWidth - 70
    await this.$nextTick()
    // const box = document.getElementById('timeLine')
    // const box = this.$el.querySelector('#timeLine')
    const box = this.$refs.timeLine
    this.width = box.offsetWidth
    this.upLeft()
    this.resizefun = e => {
      setTimeout(() => {
        this.width = box.offsetWidth
        this.upLeft()
        this.initTimeList()
      }, 200)
    }
    window.addEventListener('resize', this.resizefun)
    // document.addEventListener('keydown', this.resizefun)
    this.initTimeList()
  },
  beforeDestroy() {
    this.upThumb = null
    this.thumbTimeList = []
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style scoped>
#time-line {
  width: 100%;
  box-sizing: border-box;
  /*border-top: 2px solid #fcb595;*/
  user-select: none;
  background-color: rgb(12, 27, 50);
  position: absolute;
}

.calendar {
  height: 14px;
  width: calc(100% - 90px);
  margin-top: 9px;
  margin-left: 90px;
  text-align: center;
}

.calendar .calendar-text {
  font-size: 14px;
  line-height: 16px;
  width: 165px;
  margin: 0 auto;
}

.content {
  width: 100%;
  margin: 0 auto;
  /*margin: 0 10px 0 100px;*/
  height: 138px;
  margin-top: 9px;
  cursor: pointer;
  overflow: hidden;
  background: #1c3053;
  padding: 0;
}

.content .time-list {
  height: 20px;
  font-size: 12px;
  margin-top: 5px;
  position: relative;
}
.color-lines {
  box-sizing: border-box;
  border: 1px solid transparent;
  height: 24px;
}
.color-lines.active {
  border: 1px solid #00a5e3;
}
/*.color-lines.active .color-line {
  border:1px solid #00a5e3;
}*/
.content .time-list .item {
  text-align: center;
  display: inline-block;
}

.content .bg-line {
  width: calc(100% - 90px);
  margin-left: 90px;
  height: 10px;
  margin-top: -5px;
  background-repeat: repeat-x;
  background-size: 100% 100%;
  background: rgba(255, 255, 255, 0.24);
}

.content .bg-line .scale {
  height: 5px;
  float: left;
  border-left: 1px solid #000;
  margin-top: 6px;
}
.content .bg-line .scale.center {
  height: 8px;
  margin-top: 2px;
}

.content .bg-line .pointer {
  width: 9px;
  height: 13px;
  margin: 0 auto;
  background-color: #f78930;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  position: relative;
  z-index: 99999;
}

.content .bg-line .pointer .pointer-line {
  width: 1px;
  height: 110px;
  background-color: #f78930;
  margin: 9px auto 0 auto;
}

.content .color-line-box {
  width: 100%;
  height: 85px;
  overflow-y: visible;
  overflow-x: hidden;
}
.content .line-title {
  display: inline-block;
  width: 85px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content .color-line {
  display: inline-block;
  width: calc(100% - 90px);
  /*margin-left: 90px;*/
  /*margin-top: 9px;*/
  height: 6px;
  background-color: #3b5074;
  position: relative;
  overflow: hidden;
  margin-bottom: 6px;
}

.content .color-line div {
  height: 6px;
  position: absolute;
  top: 0;
}

/* .content .color-line .blue-line {
  background-color: #1fa0fe;
}

.content .color-line .red-line {
  background-color: #fc6e30;
  z-index: 2;
}

.content .color-line .green-line {
  background-color: green;
  z-index: 1;
} */
.content .color-line .manual-line {
  background-color: #e6c821;
  z-index: 2;
}

.content .color-line .timed-line {
  background-color: #32e184;
  z-index: 1;
}

.content .color-line .event-line {
  background-color: #fc6e30;
  z-index: 3;
}

.content .color-line .tags {
  border: 3px solid #cc3333;
  border-radius: 3px;
  top: -1px;
  z-index: 4;
}
.content .color-line .cut-line {
  background-color: rgba(40, 127, 224, 0.7);
  z-index: 5;
}

.cut-line span {
  position: absolute;
  height: 100%;
  width: 6px;
  border: 1px solid transparent;
}

.cut-line > span:hover {
  cursor: e-resize;
}

.cut-right {
  right: -3px;
}
.cut-left {
  left: -3px;
}

.thumb {
  width: calc(100% - 90px);
  margin-left: 90px;
  height: 50px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
}
.thumb ul {
  height: 50px;
}
.thumb ul li {
  height: 50px;
  float: left;
  border: 1px solid red;
}

.signs {
  position: absolute;
  top: 10px;
  right: 60px;
}

.signs .video {
  float: left;
  height: 12px;
  margin-right: 20px;
}

.signs .video span {
  float: left;
  font-size: 12px;
  line-height: 12px;
}

.signs .video span.color {
  width: 20px;
  height: 6px;
  margin: 3px 0 3px 10px;
}

.signs .event-video span.color {
  background-color: #fc6e30;
}

.signs .timed-video span.color {
  background-color: #32e184;
}

.signs .manual-video span.color {
  background-color: #e6c821;
}

.signs .no-video span.color {
  background-color: #e5e5e5;
}

.zoom {
  width: 60px;
  height: 16px;
  position: absolute;
  top: 8px;
  right: 8px;
}

.zoom div {
  width: 16px;
  font-size: 16px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
}

.zoom div.iconfont:hover {
  color: #20a1ff;
}

.zoom div:first-child {
  float: left;
}

.zoom div:last-child {
  float: right;
}

.no-content {
  height: 0 !important;
}

.disabled,
.zoom .disabled:hover {
  color: #a0a0a0;
}

.switch {
  width: 132px;
  height: 22px;
  position: absolute;
  top: 6px;
  left: 5px;
  text-align: center;
  line-height: 22px;
  cursor: pointer;
  overflow: hidden;
  color: #fff;
  background: #0f2343;
  box-sizing: border-box;
  border: 1px solid rgb(40, 127, 224);
  border-radius: 3px;
}
.switch.disabled {
  color: #9298a4;
  cursor: not-allowed;
}
.switch > div {
  width: 65px;
  height: 22px;
  float: left;
}
.switch > div.active {
  background: rgb(40, 127, 224);
}
#app-main.fs #time-line {
  position: fixed;
  bottom: 0;
  left: 350px;
  right: 20px;
  width: auto;
  z-index: 9;
}
#app-main.fs #time-line .content {
  height: 68px;
}
#app-main.fs #time-line .color-lines {
  display: none;
}
#app-main.fs #time-line .color-lines.active {
  display: block;
}
#app-main.fs #time-line .switch,
#app-main.fs #time-line .snap,
#app-main.fs #time-line .thumbSwitch,
#app-main.fs #time-line .thumbTime {
  display: none;
}

#app-main.fs #time-line .zoom {
  left: 10px;
  top: 38px;
}

.snap {
  position: absolute;
  width: 160px;
  height: 90px;
  /* top: -20px; */
  z-index: 9999999;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}
.thumbSnap {
  position: absolute;
  width: 256px;
  height: 144px;
  top: -45px;
  z-index: 9999999;
}

.thumbSwitch {
  position: absolute;
  top: 5px;
  left: 150px;
}
</style>
<style>
#time-line .ivu-switch {
  border: 1px solid #535f77;
  background-color: #535f77;
}
#time-line .ivu-switch-checked {
  border-color: #4699f9;
  background-color: #4699f9;
}
</style>
