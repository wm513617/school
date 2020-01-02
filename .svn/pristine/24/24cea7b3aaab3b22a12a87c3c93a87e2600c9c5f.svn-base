<template>
<div class="vehicle flex flex-1"
  style="flex-direction:column">
  <div class="bs-content">
    <div class="bs-left">
      <div class="title clearfix theme-title">
        <label>机构</label>
        <span class="right">
          <i class="iconfont icon-refresh"
            @click="refreshOrg"
            style="float:right;"></i>
        </span>
      </div>
      <div style="padding: 10px;">
        <Input v-model="searchVal"
          icon="ios-search-strong"
          placeholder="请输入..."></Input>
      </div>
      <div class="vtreeBox"
        style="height: calc(100% - 92px)">
        <bs-scroll ref="scroller">
          <VTree :treeData="faceResTree"
            :searchVal="searchVal"
            :options="{showOpenPreview: true,showOpenAllPreview: true, search: {onlyLeaf: true}}"
            @on-expand="expand"
            @loadMore="expand"
            @openPreviewClick="handlePreview"
            @node-dblclick="handlePreview"
            @openAllPreviewClick="allPreview"></VTree>
        </bs-scroll>
      </div>
    </div>
    <div class="bs-main">
      <div class="video">
        <div class="video-container">
          <videoImgBg class="videosbg"
            v-if="showBackView"
            :count="count"
            :tooltip="true"
            :active="bgactive"
            :imgList="imgList"
            :style="{height: `calc(100% - ${slotHeight}px)`}"></videoImgBg>
          <div class="videos"
            id='capture'
            :style="{bottom: videoBottom + 'px',top: videoTop + 'px'}">
            <video-frame :clickInit="false"
              :pluginCount="16"
              :playingCount.sync="playingCount"
              :defaultShowscreen="4"
              :slotHeight="slotHeight"
              :state.sync="state"
              toolbar='capture'
              ref="frame"
              :bgColor="'rgb(64, 64, 64)'"></video-frame>
          </div>
          <VideoButtons ref="videoBtn"
            :playingCount="playingCount"
            :style="{'height': btnheight + 'px'}"></VideoButtons>
        </div>
        <div class="video-list">
          <div class="title">
            <span @click='add'>实时路人</span>
            今日抓拍 <a href="javascript:void(0)" @click='toRouter("/veriface/PasserSearch/condition")'> {{strangerNumber}} </a> 次
          </div>
          <div class="pass-list">
            <div class="tips"
            v-if="realtimeList.length <= 0">
              <span>
                暂无抓拍记录
              </span>
            </div>
            <bs-scroll ref="scrollOne" style=" width: 100%;"
              v-if="realtimeList.length >0">
              <div class="pic-list" v-if="realtimeList.length > 0">
                <transition-group name="contrast-list"
                  tag="ul"
                  class="realtimeList">
                  <li v-for="(item,index) of realtimeList"
                    class="item"
                    :key="realtimeNumber - index">
                    <div class="header">
                      <span class="point"
                        :title='item.resName'>
                        {{ item.resName }}
                      </span>
                    </div>
                    <div class="imageWarp">
                      <!-- <img
                        :src="'/image/face/?image='+item.faceImage"
                        @error="imgErr" @click="showDetail(item, 'passer')"/> -->
                      <img
                        :src="item.faceImage"
                        @error="imgErr($event, index)" @click="showDetail(item, 'passer')"/>
                    </div>
                    <div class="footer">
                      <span class="time">
                        {{ $moment.unix(item.time).format('HH:mm:ss') }}
                      </span>
                    </div>
                  </li>
                </transition-group>
              </div>
            </bs-scroll>
          </div>
        </div>
      </div>
      <div class="contrast-current">
          <div class="title">
            <div>
              今日报警
              <a href="javascript:void(0)" @click='toRouter("/veriface/AlarmSearch")'>{{defenseAlarmNumber}}</a>
              次
            </div>
            <div class="more" @click="$router.replace('/veriface/AlarmSearch')">
              更多>
            </div>
          </div>
          <div class="contrastList">
            <bs-scroll ref="scrollTwo"
              v-if="contrastList.length >0">
              <transition-group name="contrast-list"
                tag="ul"
                class="contrastList">
                <li
                  v-for="(item,index) of contrastList"
                  :key="contrastNumber - index">
                  <ContrastItem :data="item" :index='index' @showDetail="showDetail(item, 'alarm', index)" />
                </li>
              </transition-group>
            </bs-scroll>
            <div class="tips"
              v-if="contrastList.length <= 0">
              <span>
                暂无报警记录
              </span>
            </div>
          </div>
        </div>
    </div>
  </div>
  <AlarmModal :type='type' v-if='showAlarmModal' :show='showAlarmModal' :picInfo='userDetailInfo' @close='close' pageType="capture"></AlarmModal>
  <audio ref='audio' style="display: none" :src='audioSrc' autoplay>
  您的浏览器不支持 audio 标签。
  </audio>
</div>
</template>
<script>
// import alarm from './2981.wav'
import { mapState, mapActions, mapMutations } from 'vuex'
import toTreeData from 'assets/js/toTreeData'
import videoImgBg from './common/videoBg'
import ContrastItem from './common/ContrastItem'
import VideoButtons from 'components/BScarVideoButtons'
import AlarmModal from './alarmsearch/AlarmModal'
export default {
  name: 'FaceRecognition',
  components: {
    videoImgBg,
    ContrastItem,
    VideoButtons,
    AlarmModal
  },
  data() {
    return {
      audio: null, // 播放报警
      faceResTree: [],
      openTemp: [],
      options: {
        showOpenPreview: true,
        showSearch: true,
        showOpenAllPreview: true
      },
      searchVal: '',
      playingCount: 0,
      showscreenShow: false,
      selectedShowscreen: 4,
      showscreenList: [1, 3, 4, 9, 16],
      hoverShowscreen: 4,
      promptFlag: false,
      promptMsg: '',
      userDetailInfo: {},
      tableDetail: {
        flag: false,
        data: {}
      },
      dispatchedList: [],
      // 视频参数
      showVideo: false,
      slotHeight: 40,
      btnheight: 100,
      state: {
        isPlay: '',
        isBoost: false,
        isVolumeOpen: false,
        isRecording: '',
        volumeValue: 0
      },
      audioSrc: '',
      showBackView: false,
      videoBottom: 60,
      videoTop: 0,
      count: 4,
      bgactive: 0,
      imgList: {},
      type: '',
      showAlarmModal: false,
      selectType: '全部'
    }
  },
  computed: {
    ...mapState({
      openArr: state => state.veriface.openDevArr,
      realtimeList: state => state.veriface.realtimeList,
      contrastList: state => state.veriface.contrastList,
      contrastMsgList: state => state.veriface.contrastMsgList,
      contrastType: state => state.veriface.contrastType,
      playingPluginIds: state => state.videoOrg.playingIds,
      faceSocketState: state => state.veriface.faceSocketState,
      strangerNumber: state => state.veriface.strangerNumber,
      defenseAlarmNumber: state => state.veriface.defenseAlarmNumber,
      realtimeNumber: state => state.veriface.realtimeNumber,
      contrastNumber: state => state.veriface.contrastNumber,
      comparisonList: state => {
        let arr = [{ label: '全部', value: '全部' }]
        state.veriface.verifaceGroup.map(item => {
          arr.push({
            label: item.name,
            value: item._id
          })
        })
        return arr
      }
    }),
    playingCameraList() {
      JSON.parse(sessionStorage.getItem('playingCameraList')) === null && sessionStorage.setItem('playingCameraList', JSON.stringify([]))
      return JSON.parse(sessionStorage.getItem('playingCameraList'))
    },
    plugin() {
      return this.$refs.frame
    },
    pluginData() {
      return this.$refs.frame.pluginData
    }
  },
  watch: {
    contrastType(val) {
      this.selectType = val
    },
    selectedShowscreen(num) {
      this.plugin.setShowscreen(num)
    },
    playingPluginIds(data) {
      let openIds = []
      let arr = []
      for (let i = 0; i < this.openTemp.length; i++) {
        const item = this.openTemp[i]
        if (this.plugin.plugins[i].pluginState.isPlay) {
          arr[i] = {...item}
          openIds.push(item.id)
        } else {
          arr[i] = null
        }
      }
      sessionStorage.setItem('playingCameraList', JSON.stringify(arr))
      let temp = this.$bsValidate.uniqueArray(openIds)
      this.CHANGE_VERIFACE_OPENARR(temp)
    },
    realtimeNumber() {
      this.$nextTick(() => {
        if (this.$refs.scrollOne) {
          this.$refs.scrollOne.update()
        }
      })
    },
    contrastNumber() {
      this.$nextTick(() => {
        if (this.$refs.scrollTwo) {
          this.$refs.scrollTwo.update()
        }
      })
      this.audioSrc = this.contrastList[0].alarmAudio
      // this.audioSrc = 'http://192.168.20.7' + this.contrastList[0].alarmAudio
      this.$refs.audio.load()
    },
    playingCount(val) {
      if (val === 0) {
        this.CHANGE_VERIFACE_OPENARR([])
      }
      this.$refs['videoBtn'].playingCount = val
    }
  },
  methods: {
    ...mapActions([
      'getVerifaceOrgTree',
      'getVeriFaceRealTimeData',
      'getVerifaceIdentify',
      'getTVList',
      'getMonitorList',
      'setDefaultSearch',
      'setImageUrl',
      'setVerifaceContrastList'
    ]),
    ...mapMutations(['CHANGE_VERIFACE_OPENARR', 'IMAGE_ERROR']),
    refreshOrg() {
      this.getVerifaceOrgTree()
        .then(res => {
          this.faceResTree = toTreeData([res.data])
          this.$Notice.success({
            title: '刷新成功',
            desc: '机构列表刷新成功',
            duration: 1
          })
        })
        .catch(err => {
          this.$Notice.warning({
            title: '获取人脸资源机构树失败',
            desc: err.response.data.message,
            duration: 1
          })
        })
    },
    add() {
      // if (this.realtimeList.length === 0) {
      //   this.realtimeList.unshift({
      //     resName: '111',
      //     faceImage: '/static/21231.png',
      //     time: '1561561651'
      //   })
      // } else {
      //   this.realtimeList = [{
      //     resName: '111',
      //     faceImage: '/static/1111.png',
      //     time: '1561561651'
      //   }, {
      //     resName: '111',
      //     faceImage: '/static/1111.png',
      //     time: '1561561651'
      //   }]
      // }
      // this.realtimeNumber++
      // this.$refs.scrollTwo.update()
      // this.$refs.scrollOne.update()
      // this.audioSrc = '/image/face?image=' + '/image/face/voice.mp3' + '&type=audio'
      // this.$refs.audio.load()
    },
    imgErr(e, index) {
      if (e.target && e.target.style) { // 获取不到图片时，设置宽高，防止其他图片位置跟随抖动
        e.target.style.width = '114px'
        e.target.style.height = '112px'
      }
      this.IMAGE_ERROR({ type: 'realtimeList', index: index })
      e.target.src = '/static/noImg1.png'
    },
    handlePreview(node) {
      const activeI = this.plugin.activedIndex
      this.plugin.nextEmptyPlugin()
      if (this.plugin.activedIndex >= this.plugin.showscreen) {
        this.plugin.activedIndex = activeI
        this.plugin.stop()
      }
      let param = {
        id: node._id,
        type: 'video',
        streamType: this.plugin.pluginState.streamType,
        ip: node.eid.ip,
        port: node.eid.cport,
        channel: node.chan,
        vendor: node.eid.manufacturer
      }
      if (node.nodeId) {
        param = {
          ...param,
          gbPlaDevIp: node.gbPlaDevIp,
          gbPlaDevPort: +node.gbPlaDevPort,
          gbDevId: node.nodeId,
          shareServer: node.shareServer
        }
      }
      this.plugin.open(param)
      this.openTemp[this.plugin.activedIndex] = param
    },
    allPreview(node) {
      let paramlist = []
      sessionStorage.setItem('playingCameraList', JSON.stringify([]))
      for (let i = 0; i < node.children.length; i++) {
        if ('eid' in node.children[i]) {
          if (!node.children[i].eid) { continue }
          let p = {
            id: node.children[i]._id,
            type: 'video',
            streamType: this.plugin.pluginState.streamType,
            ip: node.children[i].eid.ip,
            port: node.children[i].eid.cport,
            channel: node.children[i].chan,
            vendor: node.children[i].eid.manufacturer
          }
          const item = node.children[i]
          if (item.nodeId) {
            p = {
              ...p,
              gbPlaDevIp: item.gbPlaDevIp,
              gbPlaDevPort: +item.gbPlaDevPort,
              gbDevId: item.nodeId,
              shareServer: item.shareServer
            }
          }
          paramlist.push(p)
        }
      }
      if (paramlist.length > this.plugin.showscreen) {
        paramlist.splice(this.plugin.showscreen)
        this.$Notice.warning({
          desc: '无空闲窗口显示更多通道！',
          title: '警告'
        })
      }
      this.openTemp = this.$lodash.clone(paramlist)
      this.plugin.openAll(paramlist)
    },
    showDetail(data, type, index) {
      // 主页面人员对比详情的弹窗 props value 值
      let item = this.$lodash.clone(data)
      this.type = type
      if (type === 'alarm') {
        item.dispose = true
        this.setVerifaceContrastList({index: index, data: item})
      }
      this.userDetailInfo = item
      this.showAlarmModal = true
      this.BackViewShowfn()
    },
    BackViewShowfn(i, data) {
      // this.plugin.getCapture()
      this.imgList = {}
      if (!this.plugin) { return }
      this.plugin.plugins.forEach((plugin, j) => {
        if (plugin.pluginState.isStopped) {
          return
        }
        if (plugin.pluginState.isPlay) {
          this.imgList[j] = plugin.getCapture({ type: 1, quality: 5 })
        }
      })
      setTimeout(() => {
        this.count = this.plugin.showscreen
        this.bgactive = this.plugin.activedIndex
        this.showBackView = true
      }, 100)
      this.backViewObj = data
      this.videoBottom = -10000
      this.videoTop = -10000
    },
    pbClose() {
      this.showBackView = false
      this.videoBottom = 60
      this.videoTop = 0
    },
    close() {
      this.pbClose()
      this.showAlarmModal = false
    },
    expand() {
      this.$refs.scroller.update()
    },
    toRouter(str) {
      this.$router.replace(str)
      this.setDefaultSearch(true)
    }
  },
  created() {
    this.getTVList()
      .then(() => {
        this.getMonitorList()
      })
      .catch(() => {
        this.$Notice.error({
          title: '失败',
          desc: '获取电视墙信息失败'
        })
      })
    this.getVeriFaceRealTimeData()
    this.getVerifaceIdentify().then(() => {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scrollOne && this.$refs.scrollOne.update()
          this.$refs.scrollTwo && this.$refs.scrollTwo.update()
        }, 500)
      })
    })
    this.getVerifaceOrgTree()
      .then(res => {
        this.faceResTree = toTreeData([res.data])
      })
      .catch(err => this.errorMsg(err.response.data.message))
  },
  mounted() {
    setTimeout(() => {
      this.showVideo = true
    }, 0)
    this.$nextTick(() => {
      this.openTemp = this.$lodash.clone(this.playingCameraList)
      this.openTemp.forEach((element, index) => {
        if (element) {
          this.plugin.activedIndex = index
          this.plugin.open(element)
        }
      })
    })
  },
  beforeDestroy() {
    this.openTemp = []
    this.CHANGE_VERIFACE_OPENARR([])
  }
}
</script>
<style lang="less" scoped>
.vehicle {
  li {
    list-style: none;
  }
}

.bs-left {
  display: flex;
  flex-direction: column;
  // 左侧的树
  .theme-title {
    height: 38px;
    display: flex;
    align-items: center;
    background: #0f2243;
    padding: 0 20px;
    justify-content: space-between;
    .icon-refresh {
      cursor: pointer;
    }
    label {
      flex: 1;
      font-size: 14px;
      text-align: center;
    }
  }
}

.bs-main {
  display: flex;
  position: relative;
  background: transparent;
  .video {
    display: flex;
    min-width: 500px;
    flex-direction: column;
    flex-grow: 1;
    .video-container {
      position: relative;
      min-width: 500px;
      flex: 1;
    }
    .videos,
    .videosbg {
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 60px;
      top: 0;
    }
    .video-list {
      height: 170px;
      width: 100%;
      margin-top: 16px;
      background: #1c3053;
      display: flex;
      flex-direction: column;
      .title {
        line-height: 38px;
        height: 38px;
        text-align: center;
        background: #0f2243;
        position: relative;
        span {
          position: absolute;
          left: 0;
          top: 0;
          width: 100px;
          background: #1c3053;
        }
      }
      .pass-list {
        flex: 1;
        margin-top: 8px;
        position: relative;
        display: flex;
        width: calc(100%);
        overflow: hidden;
        // 实时抓拍
        .tips {
          flex: 1;
          background: #1c3053;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .pic-list {
          flex: 1;
          .realtimeList {
            width: 100%;
            padding-left: 16px;
            display: flex;
            flex-wrap: wrap;
            li {
              position: relative;
              display: inline-block;
              margin-right: 8px;
              margin-bottom: 8px;
              overflow: hidden;
              .header {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 18px;
                background-color: rgba(0, 0, 0, 0.3);
                .point {
                  display: inline-block;
                  font-size: 12px;
                  text-align: left;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
              .imageWarp {
                img {
                  height: 112px;
                  vertical-align: bottom;
                }
                img[src=""],img:not([src]){ opacity:0; }
              }
              .footer {
                position: absolute;
                left: 0;
                bottom: 0;
                display: flex;
                width: 100%;
                justify-content: space-between;
                background-color: rgba(0, 0, 0, 0.3);
                white-space: nowrap;
                flex-wrap: wrap;
                .name-group {
                  flex-grow: 1;
                  display: flex;
                  justify-content: space-around;
                }
              }
            }
          }
        }
      }
    }
  }
  .contrast-current {
    min-width: 402px;
    overflow: hidden;
    flex-direction: column;
    background: #1c3053;
    margin-left: 16px;
    display: flex;
    .contrastList {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      li {
        list-style: none;
        margin: 24px 24px 0;
        &:last-child {
          margin-bottom: 12px;
        }
      }
      .tips {
        flex: 1;
        background: #24395c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    // 右侧比对标题
    .title {
      display: flex;
      justify-content: space-between;
      background: #0f2243;
      height: 38px;
      line-height: 38px;
      padding: 0 24px;
      .more {
        cursor: pointer;
      }
      .more:hover {
        color: #4699f9;
      }
    }
  }
}
.contrast-list-enter-active {
  transition: all 0.5s;
}
.contrast-list-enter {
  opacity: 0;
}
.contrast-list-move {
  transition: transform 1s;
}
.contrast-list-leave {
  transition: transform 0s !important;
}
a {
  font-size: 20px;
  margin: 0px 5px;
  font-weight: 700;
  vertical-align: -6%;
  display: inline-block;
}
</style>
