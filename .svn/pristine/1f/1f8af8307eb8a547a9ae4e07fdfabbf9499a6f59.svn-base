<template>
  <div>
    <Modal v-model="showDetailPage" title="对讲详情" :width="1015" @on-cancel="cancelPlayVideo">
      <div style="width: 100%; height: 460px; overflow: hidden;">
        <div class="modal-detail">
          <div class="detail-items">
            <header> {{ initiate.title }} </header>
            <ul>
              <li v-for="(value,key) in initiate" :key="key">
                <span class="detail-item detail-label" :title="value" v-if="key !== 'title'"> {{ value }} </span>
                <span class="detail-item" style="width: calc(100% - 95px);" :title="value" v-if="key !== 'title'"> {{ key === 'startTime' ? $moment.unix(detailData[key]).format('YYYY-MM-DD HH:mm:ss') : detailData[key] }} </span>
              </li>
              <li style="position: absolute; right: 20px; top: 35px; cursor: pointer;" :class="[currentPlayVideo === 'askCamera' ? 'disabled' : '']" @click="playVideo('askCamera')">
                <i class="icon iconfont icon-play" style="font-size: 20px; color: #33ab9f"></i>
              </li>
            </ul>
          </div>
          <div class="detail-items">
            <header> {{ receive.title }} </header>
            <ul>
              <li v-for="(value,key) in receive" :key="key">
                <span class="detail-item detail-label" :title="value" v-if="key !== 'title'"> {{ value }} </span>
                <span class="detail-item" :title="value" v-if="key !== 'title'"> {{ detailData[key] }} </span>
              </li>
              <li style="position: absolute; right: 20px; top: 35px; cursor: pointer;" :class="[currentPlayVideo === 'ackCamera' ? 'disabled' : '']" @click="playVideo('ackCamera')">
                <i class="icon iconfont icon-play" style="font-size: 20px; color: #33ab9f"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-video">
          <playbackPlugin ref="playbackPluginModal" :defaultPane="1" :configuration="configuration" @playStatus="updateState"></playbackPlugin>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'
import playbackPlugin from 'src/components/videoComponentsNew/playbackPlugin'
export default {
  components: { playbackPlugin },
  data() {
    return {
      initiate: { // 详情中发起端的label
        title: '发起端',
        askName: '发起端名称',
        askIp: '发起端IP地址',
        askId: '发起端ID号',
        startTime: '对讲时间'
      },
      receive: { // 详情中接收端的label
        title: '接收端',
        ackName: '接收端名称',
        ackIp: '接收端IP地址',
        ackId: '接收端ID号'
      },
      configuration: { // 视频播放的参数
        // progressBar: true,
        progressBar: {
          totalTime: true
        },
        // timeline: {
        //   // 时间轴配置项
        //   isMultistage: false
        // }
        timeline: false,
        buttos: ['stopAll', 'onTheWall']
      },
      showDetailPage: true // 当前modal的显示
    }
  },
  computed: {
    ...mapState({
      currentPlayVideo: ({ historyIntercom }) => historyIntercom.currentPlayVideo,
      detailData: ({ historyIntercom }) => historyIntercom.detailData,
      backParam: ({ historyIntercom }) => historyIntercom.backParam, // 查询完资源数据后组装的数组
      hisPlayVideo: ({ historyIntercom }) => historyIntercom.hisPlayVideo
    })
  },
  methods: {
    ...mapActions('historyIntercom', ['setCurrentPlayVideo', 'getIntercomResource', 'setHisPlayVideo']),
    async playVideo(cur) { // 点击播放按钮进行视频播放
      if (this.currentPlayVideo === cur) { return }
      await this.getIntercomResource({ type: 'detail', cur: cur })
      const param = _.cloneDeep(this.backParam)
      this.$refs['playbackPluginModal'].openPlayback(param)
    },
    cancelPlayVideo() { // 关闭弹框时触发
      this.$emit('cancelPlayVideo')
      this.setCurrentPlayVideo('')
      this.setHisPlayVideo('')
    },
    updateState(state) { // 视频下面的按钮点击会触发该事件，改变台麦或终端后面的播放按钮      1 暂停   2 停止    3 播放
      console.log(state)
      if (state === 1 || state === 2) {
        this.setCurrentPlayVideo('')
      } else if (state === 3) {
        this.setCurrentPlayVideo(this.hisPlayVideo)
      }
    }
  }
}
</script>

<style scoped>
  .modal-detail {
    float: left;
    width: 260px;
    height: 100%;
    overflow-y: auto;
  }
  .detail-items {
    width: 100%;
  }
  .detail-items>header {
    font-size: 16px;
    padding: 20px 0 10px 0;
    line-height: 20px;
  }
  .detail-items>ul {
    padding: 5px 20px;
    position: relative;
  }
  .detail-items>ul>li {
    line-height: 20px;
  }
  .detail-item {
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    font-size: 12px;
    line-height: 24px;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .detail-label {
    width: 90px;
  }
  .modal-video {
    float: right;
    width: calc(100% - 260px);
    height: 100%;
  }
</style>

<style lang="less">
  .ivu-modal-footer {
    display: none;
  }
  .disabled {
    cursor: not-allowed!important;
  }
  .disabled {
    i {
      color: rgba(255, 255, 255, 0.5) !important;
    }
  }
</style>
