<template>
  <!-- 案件管理结果详情弹框 -->
  <div v-if="openModal">
    <Modal v-model="modalToggle" width="1000" class="caseMangementModel" footer-hide @on-cancel="cancel" title="结果详情">
      <div class="resultDel clearboth">
        <div class="eventsDelLeft roll">
          <p><span>案件名称：</span><span>{{formData.eventName}}</span></p>
          <p><span>报警人：</span><span>{{formData.person}}</span></p>
          <p><span>性别：</span><span>{{formData.gender === 2 ? '女' : '男'}}</span></p>
          <p><span>年龄：</span><span>{{formData.age}}</span></p>
          <p><span>民族/国籍：</span><span>{{formData.nationality}}</span></p>
          <p><span>院系/单位：</span><span>{{formData.department}}</span></p>
          <p><span>住址：</span><span>{{formData.address}}</span></p>
          <p><span>联系电话：</span><span>{{formData.phone}}</span></p>
          <p><span>事发地点：</span><span>{{formData.incidentAddress}}</span></p>
          <p><span>学号：</span><span>{{formData.studentNum}}</span></p>
          <p><span>身份证号：</span><span>{{formData.identityNum}}</span></p>
          <p><span>是否调取录像：</span><span>{{formData.isRecode?'是':'否'}}</span></p>
          <p><span>案件开始时间：</span><span>{{formData.startTime ? this.$moment(formData.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
          <p><span>案件结束时间：</span><span>{{formData.endTime ? this.$moment(formData.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
          <p><span>登记时间：</span><span>{{formData.alarmTime ? this.$moment(formData.alarmTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</span></p>
          <p><span style="float:left">事件特征：</span><span>{{formData.description}}</span></p>
          <p><span style="float:left">备注：</span><span>{{formData.mark}}</span></p>
        </div>
        <div class="eventsDelRight">
          <Tabs type="card">
            <TabPane label="事件备注">
              <div class="timeLine clearboth roll">
                <span style="float: left">备注记录：</span>
                <Timeline style="display: inline-block">
                  <TimelineItem v-for="(item, index) of formData.detail" :key="index">
                    <p class="time">{{item.handleTime ? $moment(item.handleTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</p>
                    <p class="content">{{item.detail}}</p>
                  </TimelineItem>
                </Timeline>
              </div>
            </TabPane>
            <TabPane label="追踪结果">
              <div class="result-top clearboth">
                <span>追踪结果</span>
                <span class="iconfont icon-xiazai" style="float: right; margin-left: 20px;" :style="downData.length ? 'cursor: pointer;' : 'cursor:not-allowed;color: rgba(255, 255, 255, 0.5);'" @click="download" title="视频下载"></span>
                <span class="iconfont icon-play" style="float: right;" :style="videoData.length ? 'cursor: pointer;' : 'cursor:not-allowed;'" @click="jumpVideo" title="一键播放"></span>
              </div>
              <Timeline class="timeLine roll">
                <TimelineItem v-for="(item, i) of videoData" :key="i">
                  <p class="time" :class="{selected:index === i}">{{$moment(item.startTime * 1000).format('YYYY-MM-DD')}}</p>
                  <br>
                  <p class="time" :class="{selected:index === i}">{{$moment(item.startTime * 1000).format('HH:mm:ss') + ' - ' + $moment(item.endTime * 1000).format('HH:mm:ss')}}</p>
                  <p class="title content1" :title="item.name">{{item.name}}</p>
                  <p class="content1" :class="{selected:index === i}" :title="item.tagName">{{item.type === 'alarm' ? '常规标记段：' : item.type === 'track' ? '追踪标记段：' : item.type === 'structured' ? '结构化标记段：' : ''}}{{item.tagName}}</p>
                  <p class="videos">
                    <playbackPlugin ref="plugChildren" :isButton="false" :configuration="configuration" :defaultPane='1' @middlePlay="(paneMark)=>{middlePlay(paneMark, item, i)}" @clickEvent="(clickType,paneMark)=>{clickEvent(clickType, paneMark, i)}"></playbackPlugin>
                  </p>
                </TimelineItem>
              </Timeline>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import playbackPlugin from '@src/components/videoComponentsNew/playbackPlugin'
import { mapState, mapActions } from 'vuex'
import { batchDownloadVideoSegments } from '@src/components/videoComponentsNew/playback'
export default {
  components: { playbackPlugin },
  props: {
    // 是否打开
    openModal: {
      type: Boolean,
      default: false
    },
    // 传过来的参数
    formData: {
      type: Object,
      default: () => {
        return {
          address: '',
          age: '',
          alarmTime: '',
          department: '',
          description: '',
          detail: [],
          endTime: '',
          eventName: '',
          gender: 1,
          identityNum: '',
          incidentAddress: '',
          isRecode: false,
          mark: '',
          nationality: '',
          person: '',
          phone: '',
          resourceList: [],
          structuredTrack: [],
          startTime: '',
          studentNum: ''
        }
      }
    }
  },
  data() {
    return {
      videoData: [], // 追踪结果 data
      // 视频组件配置文件
      configuration: {
        progressBar: false,
        timeline: false,
        buttos: ['showmodeShow', 'stop', 'stopAll', 'onTheWall', 'xiazai', 'screenshot', 'screen', 'volume'] // 表示没有这些按钮
      },
      showFrame: false, // 是否显示iframe
      coverTimer: {}, // 图片覆盖的定时器
      downData: [], // 下载视频
      modalToggle: false,
      videoList: [], // 追踪结果 视频列表
      index: -1 // 选中项的下标
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    })
  },
  watch: {
    formData: {
      handler(val) {
        this.getData(val)
      },
      deep: true
    },
    openModal: {
      handler(val) {
        if (val) {
          this.modalToggle = val
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getVideoConf', 'getCameraPower']),
    // 数据初始化
    getData(val) {
      let _data = []
      // 案件管理
      if (val.resourceList) {
        val.resourceList.map(e => {
          e.tagTime.filter(f => f).map(f => {
            _data.push({
              resId: e.resource._id,
              channel: e.resource.chan,
              devIp: e.resource.eid.ip || e.resource.ip,
              name: e.resource.name,
              devPort: e.resource.eid.cport,
              endTime: f.endTime,
              startTime: f.startTime,
              tagName: f.tagName || '默认录像段',
              fileName: `${this.parameters.downloadVideoPath}\\${val.eventName}_${e.resource.name}_${this.$moment(f.startTime * 1000).format('YYYYMMDDHHmmss')}_${this.$moment(f.endTime * 1000).format('YYYYMMDDHHmmss')}.${this.parameters.downloadVideoType.toLowerCase()}`,
              type: 'alarm'
            })
          })
        })
      }
      // 接力追踪
      if (val.trackingInfo && val.trackingInfo.mapList) {
        let _track = this.$lodash.cloneDeep(val.trackingInfo.mapList)
        _track.sort((a, b) => a.startTime - b.startTime).map(e => {
          _data.push({
            resId: e.resource._id,
            channel: e.resource.chan,
            devIp: e.resource.eid.ip || e.resource.ip,
            name: e.resource.name,
            devPort: e.resource.eid.cport,
            startTime: e.startTime,
            endTime: e.endTime || e.startTime + 10,
            tagName: e.resource.name,
            fileName: `${this.parameters.downloadVideoPath}\\${val.eventName}_${e.resource.name}_${this.$moment(e.startTime * 1000).format('YYYYMMDDHHmmss')}_${this.$moment((e.endTime || e.startTime + 10) * 1000).format('YYYYMMDDHHmmss')}.${this.parameters.downloadVideoType.toLowerCase()}`,
            type: 'track'
          })
        })
      }
      // 结构化追踪
      if (val.structuredTrack && val.structuredTrack.length) {
        val.structuredTrack.filter(e => e.startTime < e.endTime).sort((a, b) => a.startTime - b.startTime).map((e, i) => {
          _data.push({
            resId: e.resource._id,
            channel: e.resource.chan,
            devIp: e.resource.eid.ip || e.resource.ip,
            name: e.resource.name,
            devPort: e.resource.eid.cport,
            endTime: e.endTime,
            startTime: e.startTime,
            tagName: '结构化标记' + (i + 1),
            fileName: `${this.parameters.downloadVideoPath}\\${val.eventName}_${e.resource.name}_${this.$moment(e.startTime * 1000).format('YYYYMMDDHHmmss')}_${this.$moment(e.endTime * 1000).format('YYYYMMDDHHmmss')}.${this.parameters.downloadVideoType.toLowerCase()}`,
            type: 'structured'
          })
        })
      }
      _data.sort((a, b) => a.startTime - b.startTime)
      this.videoData = this.$lodash.cloneDeep(_data)
      this.$nextTick(() => {
        this.getPicture()
        /**
         * 由于iview组件tabs的animated属性
         * true时，则为display:flex, transform 和 will-change 会影响到【视频组件】-【全屏】功能
         * false时，各TabPane为display:none，则视频插件无法获取Object标签
         * 进过考虑，进行如下修改，可使视频窗口，【全屏】功能实现
         *  */
        let _el = document.querySelector('.ivu-tabs .ivu-tabs-content-animated')
        _el.style.willChange = 'auto'
        _el.style.transform = 'none'
      })
    },
    // 确定关闭弹框
    cancel() {
      this.$emit('cancelModal', false)
    },
    // 【追踪结果】播放按钮
    async open(item, index) {
      let power = await this.getCameraPower(item.resId)
      if ((!power || !power.includes('playback'))) {
        return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      }
      this.index = index
      this.downData = []
      await this.videoData.map((e, i) => {
        this.stop(i)
      })
      await this.$refs.plugChildren[index].openPlayback([this.videoData[index]])
      this.$refs.plugChildren[index].videoStatusArr[0].isMiddlePlay = true
      this.downData.push(this.videoData[index])
    },
    // 【追踪结果】暂停按钮
    stop(index) {
      this.$refs.plugChildren[index].stop(0, true)
      this.$refs.plugChildren[index].videoStatusArr[0].isSyncPlay = true
      this.$refs.plugChildren[index].videoStatusArr[0].isMiddlePlay = true
      this.downData = []
    },
    // 下载视频
    async download() {
      if (this.downData.length === 1) {
        let power = await this.getCameraPower(this.downData[0].resId)
        if ((!power || !power.includes('download'))) {
          return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
        }
        this.getVideoConf()
        batchDownloadVideoSegments(this.downData)
          .then(res => {
            if (res[0].success === true) {
              this.warningMsg(`录像开始下载, 下载路径为:  ${this.parameters.downloadVideoPath}`)
            }
          })
          .catch(err => {
            console.log(err)
            this.errorMsg('录像下载失败，请稍后重试')
          })
      } else {
        this.warningMsg('请选择一个录像段')
      }
    },
    // 跳转至【案件处理】播放
    jumpVideo() {
      let params = {}
      if (this.formData.trackingInfo) {
        params.id = this.formData.trackingInfo._id
        params.name = this.formData.trackingInfo.name
        params.type = 'track'
      } else {
        params.id = this.formData._id
        params.name = this.formData.eventName
        params.type = 'alarm'
      }
      this.$router.push({
        name: 'businessCaseProcessing',
        params
      })
    },
    // 获取最初的画面截屏
    getPicture() {
      if (this.videoData.length) {
        this.videoData.map(async(e, i) => {
          await this.$refs.plugChildren[i].openPlayback([e])
          // this.$refs.plugChildren[i].playStop()
          this.monitorOpen(i)
        })
      }
    },
    // 监控是否开流成功
    // 只有开流成功后，才能截屏
    monitorOpen(i) {
      let _this = this
      this.coverTimer[i] = setInterval(() => {
        let _a = JSON.parse(_this.$refs.plugChildren[i].$refs.plugin[0].$refs.object.GetRecordPlayerCurTime())
        if (_a.success && _a.msCur !== 0) {
          this.$refs.plugChildren[i].$refs.plugin[0].caseProcessCover()
          clearInterval(_this.coverTimer[i])
          _this.stop(i)
        }
      }, 1000)
    },
    // 点击 画面中间播放按钮 返回值
    middlePlay(val, item, index) {
      this.open(item, index)
    },
    // 点击事件
    clickEvent(clickType, paneMark, index) {
      // 过滤防止在截图未完成时点击，则出现问题的状况
      if (!this.$refs.plugChildren[index].videoStatusArr[0].img) {
        return
      }
      // 点击图标按钮时，会触发 点击窗口事件，在为开流时，禁止触发该事件
      if (!this.$refs.plugChildren[index].videoStatusArr[0].isPlay) {
        return
      }
      // clickType：1 单击；2 双击
      if (clickType === 1) {
        this.stop(index)
      }
    }
  },
  beforeDestroy() {
    for (let i in this.coverTimer) {
      clearInterval(this.coverTimer[i])
      this.stop(i)
    }
  }
}
</script>

<style scoped>
.selected {
  color: #4699f9;
}
.caseMangementModel /deep/ .ivu-timeline-item-content {
  margin-right: 35px;
  position: relative;
}
.caseMangementModel .videos /deep/ .video-bottom {
  display: none;
}
.caseMangementModel .videos /deep/ .single-video-plugin {
  height: 100% !important;
}
.caseMangementModel /deep/ .play-time {
  display: none !important;
}
.caseMangementModel /deep/ .slide-mon {
  display: none !important;
}
.resultDel {
  padding: 0 30px;
  min-width: 900px;
}
.eventsDelLeft {
  float: left;
  width: 36%;
  font-size: 14px;
  margin-top: 12px;
  height: 627px;
  overflow-y: auto;
  margin-right: 10px;
}
.eventsDelLeft > p {
  padding-top: 15px;
}
.eventsDelLeft > p:last-child {
  padding-bottom: 15px;
}
.eventsDelLeft > p > span:first-child {
  display: inline-block;
  width: 100px;
}
.eventsDelLeft > p > span:last-child {
  display: inline-block;
  width: 200px;
  word-wrap: break-word;
}
.eventsDelRight {
  float: left;
  width: 60%;
  padding-top: 15px;
}
.eventsDelRight >>> .ivu-tabs-bar {
  margin-bottom: 0;
}
.eventsDelRight >>> .ivu-tabs-tab-active {
  border: none !important;
}

.eventsDelRight >>> .ivu-tabs-tabpane {
  border: 1px solid #0f2343;
  padding: 15px;
}
.time {
  float: left;
  margin-left: -175px;
  text-align: center;
  width: 150px;
  cursor: default;
}
.ivu-timeline-item {
  padding: 0 0 12px 150px;
}
.timeLine {
  display: inline-block;
  margin-top: 12px;
  height: 500px;
  overflow-y: auto;
  width:100%;
}
.roll::-webkit-scrollbar {
  width: 4px;
}
.roll::-webkit-scrollbar-track {
  border-radius: 5px;
}
.roll::-webkit-scrollbar-track-piece {
  background-color: #14284b;
}
.roll::-webkit-scrollbar-thumb {
  background-color: #657ca8;
  border-radius: 5px;
}
.caseMangementModel /deep/ .ivu-timeline-item-tail {
  left: 155px;
  border-left: 1px solid #5676a9;
}
.content1 {
  padding: 3px;
  cursor: default;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.title {
  position: absolute;
  top: 0;
}
.videos {
  width: 300px;
  height: 175px;
  background-color: #000;
}
.clearboth::after {
  clear: both;
  content: '';
  display: block;
}
</style>
