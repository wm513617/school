<template>
  <!-- 追踪结果 -->
  <div v-if="openModal2">
    <Modal v-model="openModal2" title="追踪结果" width="800px" @on-cancel='cancel' :mask-closable="false" class="caseMangementModel">
      <div class="dlog-box">
        <div class="left">
          <div class="message">
            <p class="label" style="padding: 0;" :title="resultsList.name">追踪事件名称： {{ resultsList.name }}</p>
            <p>追踪摄像头列表：</p>
              <ul>
                <li v-for="(item, index) of resultsList.mapList" :key="index">
                  <p class="label" :title="item.resource.name">{{ item.resource.name }}</p>
                  <p class="time" :title="setTimeFun(item)">{{ setTimeFun(item) }}</p>
                </li>
              </ul>
            <p>追踪事件备注：</p>
            <p class="roll">{{ resultsList.mark }}</p>
          </div>
          <div class="divider" v-show="resultsList.eventId"></div>
          <div class="message" v-if="resultsList.eventId">
            <p :title="resultsList.eventId.eventCode">关联事件：{{ resultsList.eventId.eventCode }}</p>
            <p class="label" style="padding: 0;" :title="resultsList.eventId.eventName">事件名称：{{ resultsList.eventId.eventName }}</p>
            <p class="label" style="padding: 0;" :title="resultsList.eventId.person">报警人：{{ resultsList.eventId.person }}</p>
            <p :title="resultsList.eventId.phone">联系电话：{{ resultsList.eventId.phone }}</p>
            <p>事发地点：</p>
            <p class="roll">{{ resultsList.eventId.incidentAddress }}</p>
            <p>事件特征：</p>
            <p class="roll">{{ resultsList.eventId.description }}</p>
          </div>
        </div>
        <div class="right">
          <div class="top">
            <span>追踪结果</span>
            <i class="iconfont icon-xiazai" :class="downData.length ? '' : 'disabled'" @click="download" title="视频下载"></i>
            <i class="iconfont icon-play" :class="resultsList.mapList && resultsList.mapList.length ? '' : 'disabled'" @click="hopSowing" title="一键播放"></i>
          </div>
          <Timeline class="timelineStyle">
            <TimelineItem class="timelineItem" v-for="(item, index) of resultsList.mapList && resultsList.mapList" :key="index" v-show="item.startTime">
              <p class="time" :title="setTimeFun(item)">{{item.startTime ? $moment(item.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</p>
              <p v-show="item.endTime" :title="setTimeFun(item)" class="time" style="top: 20px; left: -50px;"> —— </p>
              <p v-if="item.endTime" class="time" :title="setTimeFun(item)" style="top: 40px;">{{$moment(item.endTime * 1000).format('YYYY-MM-DD HH:mm:ss') }}</p>
              <span :class="{ 'tracking_no':!item._isHighLight,  'tracking_yes':item._isHighLight }">{{ item.resource.name }}</span>
              <playbackPlugin class="videoPlugin" :isButton="false" :configuration="configuration" :defaultPane="1" ref="plugChildren" @middlePlay="(paneMark)=>{middlePlay(paneMark, item, index)}" @clickEvent="(clickType,paneMark)=>{clickEvent(clickType, paneMark, index)}"></playbackPlugin>
            </TimelineItem>
          </Timeline>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <!-- <Button type="primary" @click="cancel">确定</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import playbackPlugin from '@src/components/videoComponentsNew/playbackPlugin'
import { mapState, mapActions } from 'vuex'
import { batchDownloadVideoSegments } from '@src/components/videoComponentsNew/playback'
export default {
  name: 'trinkingResults',
  components: { playbackPlugin },
  props: {
    // 是否打开
    openModal2: {
      type: Boolean,
      default: false
    },
    // 全部参数
    resultsList: {
      type: Object,
      default: () => {
        return {
          name: '',
          mark: '',
          mapList: []
        }
      }
    }
  },
  data() {
    return {
      // 视频插件配置
      configuration: {
        progressBar: false,
        timeline: false,
        buttos: []
      },
      downData: [],
      coverTimer: {} // 图片覆盖的定时器
    }
  },
  watch: {
    resultsList: {
      handler(val) {
        this.$nextTick(() => {
          this.getPicture(val)
        })
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      parameters: ({ platform }) => platform.parameters
    })
  },
  methods: {
    ...mapActions(['getVideoConf', 'getCameraPower']),
    // 关闭弹框
    cancel() {
      this.$emit('openmoda2', false)
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
    // 一键跳播
    hopSowing() {
      if (this.resultsList.mapList.length > 0) {
        this.$router.push({
          name: 'businessCaseProcessing',
          params: {
            id: this.resultsList._id,
            name: this.resultsList.name,
            type: 'track'
          }
        })
      } else {
        this.warningMsg('该追踪事件暂无录像')
      }
    },
    // 视频播放
    async open(item, index) {
      let power = await this.getCameraPower(item.resource._id)
      if ((!power || !power.includes('playback'))) {
        return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      }
      this.downData = []
      let data = [
        {
          resId: item.resource._id,
          channel: item.resource.chan,
          startTime: item.startTime,
          endTime: item.endTime || item.startTime + 10,
          devIp: item.resource.eid.ip,
          name: item.resource.name,
          devPort: item.resource.eid.cport,
          fileName: `${this.parameters.downloadVideoPath}\\${this.resultsList.name}_${
            item.resource.name
          }_${this.$moment(item.endTime * 1000).format('YYYYMMDDHHmmss')}_${this.$moment(
            (item.endTime || item.startTime + 10) * 1000
          ).format('YYYYMMDDHHmmss')}.${this.parameters.downloadVideoType.toLowerCase()}`
        }
      ]
      await this.resultsList.mapList.map((row, i) => {
        this.stop(i)
      })
      this.$refs.plugChildren[index].openPlayback(data)
      this.$refs.plugChildren[index].videoStatusArr[0].isMiddlePlay = true
      this.downData = data
    },
    // 视频停止
    stop(index) {
      this.$refs.plugChildren[index].stop(0, true)
      this.$refs.plugChildren[index].videoStatusArr[0].isSyncPlay = true
      this.$refs.plugChildren[index].videoStatusArr[0].isMiddlePlay = true
      this.downData = []
    },
    // 时间样式设置
    setTimeFun(data) {
      let { startTime, endTime } = data
      let _text = ''
      if (startTime) {
        _text += this.$moment(startTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      if (endTime) {
        _text += ' — ' + this.$moment(endTime * 1000).format('HH:mm:ss')
      }
      return _text
    },
    // 获取最初的画面截屏
    getPicture(val) {
      val.mapList.map(async(e, i, arr) => {
        if (e.startTime) {
          let data = [
            {
              channel: e.resource.chan,
              startTime: e.startTime - 1,
              endTime: e.endTime || e.startTime + 10,
              devIp: e.resource.eid.ip || e.resource.ip,
              name: e.resource.name,
              devPort: e.resource.eid.cport,
              eventName: arr.name
            }
          ]
          await this.$refs.plugChildren[i].openPlayback(data)
          // this.$refs.plugChildren[i].playStop()
          this.monitorOpen(i)
        }
      })
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
      this.resultsList.mapList.map(value => {
        if (item._id === value._id) {
          value._isHighLight = true
        } else {
          value._isHighLight = false
        }
      })
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

<style scoped lang="less">
/deep/ .videoPlugin .ivu-timeline-item-content {
  margin-right: 25px;
}
/deep/ .videoPlugin .single-video-plugin {
  height: 100% !important;
}
.tracking_no {
  background: inherit;
  padding: 0;
}
.tracking_yes {
  background: rgb(70, 153, 249);
  padding: 0;
}
.dlog-box {
  width: 100%;
  overflow: hidden;
  display: flex;
  .left,
  .right {
    display: inline-block;
    height: 100%;
  }
  .left {
    width: 30%;
    .message {
      p {
        margin-top: 5px;
      }
      ul {
        max-height: 82px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 5px;
        }
        &::-webkit-scrollbar-track-piece {
          background-color: #14284b;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #657ca8;
          border-radius: 5px;
        }
        li + li {
          margin-top: 5px;
        }
      }
      .label {
        padding-left: 15px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .time {
        text-align: end;
        margin: 0 10px 0 0;
      }
      .roll {
        padding-left: 15px;
        max-height: 55px;
        min-height: 32px;
        overflow-x: hidden;
        overflow-y: auto;
        word-break: break-all;
        &::-webkit-scrollbar {
          width: 4px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 5px;
        }
        &::-webkit-scrollbar-track-piece {
          background-color: #14284b;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #657ca8;
          border-radius: 5px;
        }
      }
    }
    .divider {
      margin: 10px 16px;
      height: 1px;
      box-sizing: content-box;
      border-bottom: 1px solid;
    }
  }
  .right {
    width: calc(~'70% - 5px');
    margin-left: 5px;
    padding-left: 5px;
    border-left: 1px solid #0f2343;
    .top {
      span {
        margin-left: 10px;
      }
      i {
        margin: 0 5px;
        float: right;
        &::after {
          clear: both;
          content: '';
          display: block;
        }
      }
    }
    .timelineStyle {
      display: inline-block;
      margin-top: 12px;
      height: 442px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 5px;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: #14284b;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #657ca8;
        border-radius: 5px;
      }
      .timelineItem {
        position: relative;
        .time {
          position: absolute;
          left: -8px;
          transform: translateX(-100%);
        }
      }
    }
    .videoPlugin {
      width: 285px;
      height: 175px;
      margin-top: 5px;
    }
    .iconfont {
      cursor: pointer;
    }
  }
  .disabled.iconfont {
    cursor: no-drop;
    color: #ffffff80;
  }
}
// 右侧iview时间轴组件的dom 样式
/deep/ .ivu-timeline-item-tail {
  left: 155px;
  border-left: 2px solid #657ca8;
}
// 强制显示 最后一个线条
/deep/ .ivu-timeline-item:last-child .ivu-timeline-item-tail {
  display: block !important;
}
// 时间轴每个item的样式
/deep/ .ivu-timeline-item {
  margin-right: 25px !important;
  padding: 0 0 12px 150px;
}
</style>
