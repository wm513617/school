<template>
<div>
  <Modal v-model="modalShow" :width='737' :mask-closable="false" :closable='false'
  @mousedown.stop @mouseup.stop class="Vmodel" id='selectBoxVideo'>
    <p slot="header" class="select-video-title">
      <span>选框镜头</span>
      <span class="select-video-title-close iconfont icon-error" title="关闭" @click.stop='close'>
      </span>
    </p>
    <div class="select-video-body" v-if="!showDownload && modalShow">
      <bs-video :pluginCOM="plugin" :count="5" :styles="styles"
      @dblclick="switchStyle" @update:state="updateState" ref="bsvideo">
      </bs-video>
    </div>
    <div class="no-plugin" :style="{height: '325px', background: 'rgb(64, 64, 64)'}" v-if="showDownload">
      <a :href="pluginDownloadUrl" target="_blank">{{showTips}}</a>
      <Icon type="help-circled" title="安装后仍然提示?" @click.native="showHelp" />
    </div>
    <div slot="footer" class="footer">
      <Page v-if='modalShow' :total="videoList.length" :show-total='true' :page-size='5' @on-change='pageChange'/>
      <div class="realbtn iconfont icon-full-screen" :class="{'disable': !state.isPlay}" @click="debounceFullScreen" title="全屏"></div>
      <div class="quick-to-wall-box" @click="(state.isPlay===true)&&(showTowall=true)">
        <i class="icon iconfont icon-tv-wall" title="快速上墙" :class="{'disable': !state.isPlay}"></i>
        <!-- <div class="showTowall"  v-show="showTowall&&state.isPlay">
          <iframe></iframe>
          <QuickToWall class="quickToWall" ref="toWall" :width="400" :height="225" :camera="cameraId"></QuickToWall>
        </div> -->
      </div>
    </div>
  </Modal>
  <!-- 上墙弹框 -->
  <Modal id="quickTowall" v-model="showTowall" title="快速上墙" :mask-closable="false" :transition-names="[]">
    <iframe v-if="showTowall" style="z-index:0"></iframe>
    <QuickToWall v-if="showTowall" style="margin:0 auto" :camera="cameraId"></QuickToWall>
    <div slot="footer" style="position:relative">
      <Button type="ghost" @click="showTowall=false">关闭</Button>
    </div>
  </Modal>
</div>
</template>
<script>
import plugin from 'components/video/new/plugin.vue'
import QuickToWall from '../../../video/tvwall/QuickToWall'
import versionCheck from 'components/video/pluginVersionCheck'
import { mapState, mapActions } from 'vuex'
let videoPlugin
export default {
  components: {
    QuickToWall
  },
  mixins: [versionCheck],
  data() {
    const styleLarge = {
      width: '588px',
      height: '345px',
      left: '0px',
      top: 0
    }
    const styleSmall = {
      width: '100px',
      height: '84px',
      right: '-165px'
    }
    return {
      plugin,
      state: {
        isPlay: false,
        isStopped: true
      },
      styles: [
        styleLarge,
        {
          ...styleSmall,
          top: 0
        },
        {
          ...styleSmall,
          top: '87px'
        },
        {
          ...styleSmall,
          top: '174px'
        },
        {
          ...styleSmall,
          top: '261px'
        }
      ],
      mainIndex: 0,
      isPreview: true,
      page: 1,
      usePage: 'video',
      videoList: [],
      modalShow: false,
      showTowall: false,
      debounceFullScreen: this.$lodash.debounce(this.fullscreen, 300)
    }
  },
  computed: {
    ...mapState({
      isBoxChoosePreView: ({ tdPoint }) => tdPoint.isBoxChoosePreView
    }),
    videoParam() { // 计算需要播放的镜头
      return this.videoList.slice((this.page - 1) * 5, this.page * 5)
    },
    cameraId() {
      return this.videoParam[this.mainIndex] ? this.videoParam[this.mainIndex]._id : ''
    }
  },
  watch: {
    videoParam(val) {
      setTimeout(() => {
        if (val.length) {
          videoPlugin = this.getPlugin(0)
          this.open()
        }
      }, 500)
    },
    modalShow(val) {
      if (val) {
        this.page = 1
        this.getTVList().then(() => {
          this.getMonitorList()
        }).catch(() => {
          this.$Notice.error({
            title: '失败',
            desc: '获取电视墙信息失败'
          })
        })
      }
    },
    isBoxChoosePreView(val) {
      console.log(val, 'modalShow')
      this.modalShow = val
    }
  },
  methods: {
    ...mapActions(['getTVList', 'getMonitorList', 'openWall']),
    switchStyle(index) { // 大小视频窗口切换
      if (index === this.mainIndex) {
        return
      }
      const temp = this.styles[this.mainIndex]
      this.$set(this.styles, this.mainIndex, this.styles[index])
      this.$set(this.styles, index, temp)
      this.mainIndex = index
      videoPlugin = this.getPlugin(this.mainIndex)
      this.updateState(this.mainIndex, videoPlugin.pluginState)
    },
    getPlugin(index) { // 获取插件
      return this.$refs.bsvideo.getCOM(index)
    },
    updateState(index, s) { // 更新参数状态
      if (index === this.mainIndex) {
        Object.assign(this.state, s)
      }
    },
    openModal(val) {
      this.videoList = val
      this.modalShow = true
    },
    // 预览
    open() {
      this.mainIndex = 0
      this.stopAll()
      this.isPreview = true
      const list = [...this.videoParam]
      list.forEach((node, i) => {
        if (i < 5) {
          let param = {
            id: node._id || '',
            orgPath: node.orgPath || '',
            name: node.name || '',
            type: 'video',
            streamType: node.stream,
            ip: node.ip,
            port: node.port,
            channel: node.chan
          }
          if (node.nodeId) { // 国标开流
            param = {
              ...param,
              gbDevId: node.nodeId,
              shareServer: node.shareServer
            }
          }
          videoPlugin = this.getPlugin(i)
          videoPlugin.previewOpen(param)
        }
      })
      videoPlugin = this.getPlugin(this.mainIndex)
    },
    stopAll() { // 停止全部
      for (let i = 0; i < 5; i++) {
        if (this.getPlugin(i).plugin) {
          this.getPlugin(i).previewStop()
        }
      }
    },
    pageChange(val) { // 切换页码
      this.switchStyle(0)
      this.page = val
    },
    close() {
      this.switchStyle(0)
      this.modalShow = false
      this.videoList = []
      this.$emit('close')
    },
    fullscreen() {
      videoPlugin.fullScreen()
    }
  },
  mounted() {
  },
  beforeDestroy() {
    videoPlugin = null
  }
}
</script>
<style>
#quickTowall .ivu-modal {
  width: fit-content !important;
}
</style>

<style scoped lang='less'>
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
#selectBoxVideo {
  width: 575px;
}
#selectBoxVideo .select-video-title {
  color: #fff;
  display: flex;
  justify-content: space-between;
}
#selectBoxVideo .footer {
  display: flex;
  justify-content: flex-end;
}
.quick-to-wall-box {
  position: relative;
  text-align: center;
  margin-left: 12px;
  line-height: 32px;
}
.icon-full-screen:hover,
.quick-to-wall-box:hover i {
  color: #fda548;
}
#selectBoxVideo .quick-to-wall {
  margin-left: 24px;
}
#selectBoxVideo .select-video-title-close {
  cursor: pointer;
}
#selectBoxVideo .select-video-body {
  height: 350px;
}
.ivu-modal-body {
  padding: 12px 24px;
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
.showTowall {
  position: absolute;
  list-style: none;
  bottom: 26px;
  left: -385px;
  background-color: #1b3153;
  color: #fff;
  border: 1px solid #00a5e3;
  border-radius: 0 0 3px 3px;
  text-align: center;
}
.disable {
  color: #878282 !important;
}
.realbtn {
  line-height: 32px;
  margin-left: 12px;
}
</style>
