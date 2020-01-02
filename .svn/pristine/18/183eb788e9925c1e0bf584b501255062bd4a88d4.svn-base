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
        <Input v-model="searchValue"
          icon="ios-search-strong"
          placeholder="请输入..."></Input>
      </div>
      <div class="organization" :style="{height: scroll ? 'calc(100% - 90px)' : 'auto'}">
        <TreeBox ref="treebox" :iconRight="['preview']" :centerVideoIds="centerVideoIds" :searchToggle="false" :searchType="0" :resourceToggle="true" :equipmentToggle="false" :btnGroup="false" :checkBox="synchro" :iconToggle="iconToggle" :orgType="0" :resType="[0]" :equType="[0]" @clickData="handleNode" @previewData="openPreviewClick" @previewAllData="openAllPreviewClick" @checksData="checksData" @dbclickData="dblClick" @dragData="(val)=>{talk('dragData', val)}" @on-expand="expand" :searchVal="searchValue" :playingIds="playingIds" :scroll="scroll" @refreshSuc="$emit('refreshSuc')"></TreeBox>
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
            <previewPlugin ref="frame" @openBack="getOpenCamera" @stopBack="deleteCamera" :iconShow="previewIcon" :pluginIconShow="pluginIcon" :isButton="true" :panesArr="panesArr"></previewPlugin>
            <!-- <video-frame :clickInit="false"
              :pluginCount="16"
              :playingCount.sync="playingCount"
              :defaultShowscreen="4"
              :slotHeight="slotHeight"
              :state.sync="state"
              toolbar='capture'
              ref="frame"
              :bgColor="'rgb(64, 64, 64)'"></video-frame> -->
          </div>
          <!-- <VideoButtons ref="videoBtn"
            :playingCount="playingCount"
            :style="{'height': btnheight + 'px'}"></VideoButtons> -->
        </div>
        <div class="video-list">
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
                    :key="realtimeList.length - index">
                    <!-- <div class="header">
                      <span class="point"
                        :title='item.resName'>
                        {{ item.resName }}
                      </span>
                    </div> -->
                    <div class="imageWarp">
                      <!-- <img
                        :src="'/image/face/?image='+item.image"
                        @error="imgErr" @click="showDetail(item, 'passer')"/> -->
                      <img
                        :src="item.vehiclePic"
                        @error="imgErr($event, index)" @click="showDetail(item, 'passer')"/>
                    </div>
                    <!-- <div class="footer">
                      <span class="time">
                        {{ $moment.unix(item.time).format('HH:mm:ss') }}
                      </span>
                    </div> -->
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
              核验失败
              <a href="javascript:void(0)">{{checkFailNum}}</a>
              次
            </div>
            <div class="more" @click="changeRecord()">
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
                  :key="contrastList.length - index">
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
  <AlarmModal :type='type' v-if='showAlarmModal' :show='showAlarmModal' :picInfo='userDetailInfo' @close='close'></AlarmModal>
  <audio ref='audio' style="display: none" :src='audioSrc' autoplay>
  您的浏览器不支持 audio 标签。
  </audio>
</div>
</template>
<script>
// import alarm from './2981.wav'
import { mapState, mapActions, mapMutations } from 'vuex'
import TreeBox from 'components/BStreeNew/BStreeNewBox'
import videoImgBg from './videoBg'
import ContrastItem from './ContrastItem'
// import VideoButtons from 'components/BScarVideoButtons'
import AlarmModal from './AlarmModal'
import previewPlugin from 'components/videoComponentsNew/previewPlugin'
export default {
  name: 'FaceRecognition',
  components: {
    videoImgBg,
    ContrastItem,
    // VideoButtons,
    AlarmModal,
    TreeBox,
    previewPlugin
  },
  props: {
    scroll: {
      default: true
    },
    synchro: {
      default: false
    },
    iconToggle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // playVideoArr: [], // 已经播放的视频 资源IP-资源id(第三方)
      previewIcon: {
        stopAll: true,
        screenshot: true,
        volume: true,
        fullScreen: true,
        multiScreen: true
      },
      pluginIcon: {
        showBottomIcon: true, // 图标按钮条
        hidemenuIcon: true, // 隐藏
        previewStopIcon: true, // 关闭预览
        muteIcon: true, // 开启伴音
        yuntaiIcon: false, // 云台
        niaokanIcon: true, // 开启鸟瞰
        tvwallIcon: true, // 快速上墙
        quanpingfangdaIcon: true // 全屏
      },
      panesArr: [
        { value: 1, label: '单画面' },
        { value: 4, label: '四画面' },
        { value: 9, label: '九画面' },
        { value: 16, label: '十六画面' }
      ],
      activeNode: {},
      videoIndex: 1,
      audio: null, // 播放报警
      openTemp: [],
      options: {
        showOpenPreview: true,
        showSearch: true,
        showOpenAllPreview: true
      },
      searchValue: '',
      playingCount: 0,
      showscreenShow: false,
      // selectedShowscreen: 4,
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
      imgList: [],
      type: '',
      showAlarmModal: false,
      playingIds: []
    }
  },
  computed: {
    ...mapState({
      centerVideoIds: ({ videoOrg }) => videoOrg.centerVideoIds,
      peopleVehicleOrg: state => state.vehicle.peopleVehicleOrg,
      realtimeList: state => state.vehicle.realtimeList,
      contrastList: state => state.vehicle.contrastList,
      checkFailNum: state => state.vehicle.checkFailNum,
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
    searchValue(value) {
      console.log(value, 'value')
      if (this.searchValue !== '' && this.synchro) {
        this.$refs.treebox.$refs.treeSear.ischeck()
      } else {
        this.$refs.treebox.$refs.treeLazy.$refs.treeNewLazy.getCheckedNodes()
      }
    },
    // selectedShowscreen(num) {
    //   this.plugin.setShowscreen(num)
    // },
    playingCount(val) {
      if (val === 0) {
        this.CHANGE_VERIFACE_OPENARR([])
      }
      this.$refs['videoBtn'].playingCount = val
    }
  },
  methods: {
    ...mapActions([
      // 'getPeopleVehicleOrg',
      'getVehicleRealTimeData',
      'getMonitorList',
      'setDefaultSearch',
      'setImageUrl',
      'setVerifaceContrastList',
      'realTimePass',
      'peopleAndCarsMatch',
      'failCountGet'
    ]),
    ...mapMutations(['CHANGE_VERIFACE_OPENARR', 'IMAGE_ERROR', 'SET_MOREFLAG', 'SET_ORGID', 'SET_CURNODE', 'ADD_PLAYINGID', 'DEL_PLAYINGID']),
    getOpenCamera(data) {
      if (data.orgId) { data.orgId = data.orgId.split('_')[0] }
      this.playingIds.push(data.orgId)
    },
    deleteCamera(data) {
      for (let i = 0; i < this.playingIds.length; i++) {
        if (this.playingIds[i] === data.orgId) {
          this.playingIds.splice(i, 1)
          return
        }
      }
    },
    handleNode(node, o) {
      this.activeNode = node
      this.SET_ORGID(node._id)
      this.SET_CURNODE(node)
      this.$emit('changeNodeId', node._id)
    },
    setPlayParam(node) {
      let param
      param = {
        devIp: node.eid.ip,
        devPort: node.eid.cport,
        channel: node.chan,
        streamType: node.stream || 'main',
        resId: node.eid._id,
        orgId: node._id,
        cameraName: node.name
      }
      return param
    },
    // 播放预览 ---现场
    async openPreviewClick(node) {
      const param = this.setPlayParam(node)
      this.plugin.openPreview(param)
      // // 停用设备不可以预览
      // let deviceStatus = node.eid.deviceStatus !== undefined ? node.eid.deviceStatus : 1
      // if (Number(deviceStatus) === 0) {
      //   this.warningMsg('该设备已禁用！')
      //   return
      // }
      // // 是否正在轮训 如果是就关闭轮训
      // if (this.pollId) {
      //   const arr = this.plugin.clearTimedPlay()
      //   this.upPlayindId(arr)
      //   this.plugin.activedIndex = 0
      //   this.SET_POLL('')
      // }
      // // 找寻闲置窗口 如果当前没有闲置的窗口就把焦点窗口给关了
      // let index = 1
      // for (const i in this.plugin.pluginData) {
      //   index = parseInt(i) + 2
      // }
      // if (index > this.plugin.showscreen) {
      //   await this.plugin.stop()
      // } else {
      //   this.plugin.nextEmptyPlugin()
      // }
      // this.SET_CURNODE(node)
      // let param = {
      //   id: node._id,
      //   pid: node.eid._id,
      //   orgPath: orgPath,
      //   name: node.name,
      //   type: 'video',
      //   streamType: node.stream || 'main',
      //   ip: node.eid.ip,
      //   port: node.eid.cport,
      //   dport: node.eid.dport,
      //   channel: node.chan,
      //   vendor: node.eid.manufacturer,
      //   monitorType: node.monitortype
      // }
      // if (node.nodeId) {
      //   param = {
      //     ...param,
      //     gbDevId: node.nodeId,
      //     shareServer: node.shareServer
      //   }
      // }
      // // 调用播放方法
      // this.plugin.open(param)
      // this.$emit('preview')
      // // }
    },
    // 双击节点的时候也是调的openPreviewClick这个方法
    dblClick(node) {
      // 只有在预览页面采用
      this.handleNode(node)
      this.openPreviewClick(node)
    },
    // 开启全部预览
    openAllPreviewClick(node) {
      let paramlist = []
      const _loop = n => {
        n.forEach(item => {
          if (!item.children && 'eid' in item) {
            const p = this.setPlayParam(item)
            paramlist.push(p)
          }
          if (item.children && item.children.length) {
            _loop(item.children)
          }
        })
      }
      node && node.children && node.children.length && _loop(node.children)
      this.plugin.openAll(paramlist)
    },
    checksData(val) {
      return val
    },
    talk(name, val) {
      // console.log(name, val)
    },
    expand(node) {
      // this.scroll && this.$refs.scroller.update()
      this.$emit('loadMore')
    },
    /**
     * 当前节点是否正在播放
     */
    getPlayingId(item) {
      if (item.eid) {
        let id = item._id + ''
        return id && this.playingIds.includes(id.split('_')[0])
      }
      return false
    },
    /**
     * 点击更多跳转至记录查询人车同检记录
     */
    changeRecord() {
      this.$router.replace('/traffic/recordQuery')
      this.SET_MOREFLAG(true)
    },
    /**
     * 机构树刷新
     */
    refreshOrg() {
      this.searchValue = ''
      this.$refs.treebox.$refs.treeLazy.refresh()
      this.$Notice.success({
        title: '刷新成功',
        desc: '机构列表刷新成功',
        duration: 1
      })
    },
    imgErr(e, index) {
      // this.IMAGE_ERROR({ type: 'realtimeList', index: index })
      e.target.src = '/static/noImg1.png'
    },
    playPause(index) {
      let myVideo = document.getElementById('video' + String(index))
      if (myVideo.paused) {
        myVideo.play()
      } else {
        myVideo.pause()
      }
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
    /**
     * 点击展示详情弹框
     */
    showDetail(data, type, index) {
      console.log(data, '点击展示详情数据')
      // 主页面人员对比详情的弹窗 props value 值
      let item = this.$lodash.clone(data)
      this.type = type
      if (type === 'alarm') {
        item.dispose = true
        this.setVerifaceContrastList({index: index, data: item})
      }
      this.userDetailInfo = item
      this.showAlarmModal = true
      // this.BackViewShowfn()
      // const timer = setTimeout(() => {
      // this.showAlarmModal = true
      //   clearTimeout(timer)
      // }, 5)
    },
    BackViewShowfn(i, data) {
      if (!this.plugin) {
        this.showAlarmModal = true
        return
      }
      this.imgList = this.plugin.getRealPicturebyBase64()
      const timer = setTimeout(() => {
        this.count = this.plugin.checkedWmode
        this.bgactive = this.plugin.checkedPane
        this.showBackView = true
        this.videoBottom = -10000
        this.videoTop = -10000
        this.showAlarmModal = true
        clearTimeout(timer)
      }, 5)
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
    toRouter(str) {
      this.$router.replace(str)
      this.setDefaultSearch(true)
    }
  },
  created() {
    this.peopleAndCarsMatch() // 获取页面右侧报警
    this.failCountGet()
    this.realTimePass().then(() => {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.scrollOne && this.$refs.scrollOne.update()
          this.$refs.scrollTwo && this.$refs.scrollTwo.update()
        }, 500)
      })
    }) // 获取人车同检实时过车页面下方车辆图片展示
    this.getVehicleRealTimeData() // 人车同检socket接收
    /**
     * 获取交通管理中添加的TPE300服务器名称及获取到的视频通道
     */
    // this.getPeopleVehicleOrg()
    //   .then(res => {
    //   }).catch(() => {
    //     this.errorMsg('获取人车同检机构资源树失败')
    //   })
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
  updated() {
    this.$emit('on-expand')
  },
  beforeDestroy() {
    this.openTemp = []
    this.CHANGE_VERIFACE_OPENARR([])
  }
}
</script>
<style lang="less" scoped>
.video-style {
  object-fit: fill;
}
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
    align-items: center;
    background: #0f2243;
    padding: 7px 20px 7px 122px;
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
                  cursor: pointer;
                }
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
