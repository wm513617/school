<template src="./Capture.html"></template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import ContrastItem from './common/ContrastItem'
import VideoButtons from 'components/BScarVideoButtons'

export default {
  name: 'FaceRecognition',
  components: {
    ContrastItem,
    VideoButtons
  },
  created() {
    this.getFaceRealTimeData()
    // 获取人脸资源机构树
    this.getResTree().catch(err => {
      this.$Notice.warning({
        title: '获取人脸资源机构树失败',
        desc: err.response.data.message,
        duration: 1
      })
    })
  },
  mounted() {
    this.showVideo = true
  },
  beforeDestroy() {
    this.openTemp = []
    this.CHANGE_FACE_OPENARR([])
  },
  data() {
    return {
      openTemp: [],
      showList: '实时抓拍',
      options: {
        showOpenPreview: true,
        showSearch: true,
        showOpenAllPreview: true
      },
      searchVal: '',
      selectList: {
        comparisonList: [
          { label: '全部', value: 'all' },
          { label: '黑名单', value: 3 },
          { label: '白名单', value: 4 },
          { label: '布控', value: 5 }
        ]
      },
      playingCount: 0,
      showscreenShow: false,
      selectedShowscreen: 4,
      showscreenList: [1, 3, 4, 9, 16],
      hoverShowscreen: 4,
      promptFlag: false,
      promptMsg: '',
      tableDetail: {
        flag: false,
        data: {}
      },
      table: {
        columns: {
          contrastMsgList: [
            { type: 'index', title: '序号', width: 60, align: 'center' },
            { title: '比对时间', key: 'captureTime', minWidth: 100 },
            { title: '抓拍位置', key: 'device', minWidth: 100 },
            { title: '入库人员姓名', key: 'name', minWidth: 110 },
            { title: '性别', key: 'gender', width: 60 },
            { title: '年龄', key: 'age', width: 60 },
            { title: '身份证号', key: 'idcard', minWidth: 100 },
            { title: '类型', key: 'type', width: 60 },
            { title: '相似程度', key: 'similarity', width: 100 }
          ]
        },
        data: {
          contrastMsgList: [],
          dispatchedList: []
        },
        pageNum: {
          contrastMsgList: 1,
          dispatchedList: 1
        },
        pageColNum: {
          contrastMsgList: 2,
          dispatchedList: 5
        }
      },
      devList: [],
      selectType: 'all',
      dispatchedList: [],
      // 视频参数
      showVideo: false,
      slotHeight: 40,
      btnheight: 90,
      state: {
        isPlay: '',
        isBoost: '',
        isVolumeOpen: '',
        isRecording: '',
        volumeValue: 0
      }
    }
  },
  watch: {
    selectType(val) {
      this.CHANGE_FACE_CONTRAST_TYPE(val)
    },
    selectedShowscreen(num) {
      this.plugin.setShowscreen(num)
    },
    faceResTree: {
      handler(val) {
        this.devList = this.$lodash.cloneDeep(val)
      },
      deep: true
    },
    playingPluginIds(data) {
      const ids = this.$bsValidate.uniqueArray(data)
      let openIds = []
      ids.map(id => {
        this.openTemp.map(item => {
          if (id === item.id) {
            openIds.push(item.id)
          }
        })
      })
      let temp = this.$bsValidate.uniqueArray(openIds)
      this.CHANGE_FACE_OPENARR(temp)
    },
    playingCount(val) {
      if (val === 0) {
        this.openTemp = []
        this.CHANGE_OPENARR([])
      }
      this.$refs['videoBtn'].playingCount = val
    }
  },
  computed: {
    ...mapState({
      faceResTree: state => state.face.faceResTree,
      openArr: state => state.face.openDevArr,
      realtimeList: state => state.face.realtimeList,
      contrastList: state => state.face.contrastList,
      contrastMsgList: state => state.face.contrastMsgList,
      contrastType: state => state.face.contrastType,
      playingPluginIds: state => state.videoOrg.playingIds,
      faceSocketState: state => state.face.faceSocketState
    }),
    plugin() {
      return this.$refs.frame
    },
    pluginData() {
      return this.$refs.frame.pluginData
    }
  },
  methods: {
    ...mapActions(['getResTree', 'putRealtimeSnap', 'getFaceRealTimeData']),
    ...mapMutations(['CHANGE_FACE_OPENARR', 'CHANGE_FACE_CONTRAST_TYPE']),
    refreshOrg() {
      this.getResTree()
        .then(() => {
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
    contrastMsgListChangePage(num) {
      this.table.pageNum.contrastMsgList = num
      this.contrastMsgListPush()
    },
    imgErr(e) {
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
      this.openTemp.push({
        id: node._id,
        channelid: node.channelid
      })
    },
    allPreview(node) {
      let paramlist = []
      for (let i = 0; i < node.children.length; i++) {
        if ('eid' in node.children[i]) {
          this.openTemp.push({
            id: node.children[i]._id,
            channelid: node.children[i].channelid
          })
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
      this.plugin.openAll(paramlist)
    },
    handleTableDetail(d) {
      this.tableDetail.flag = true
      this.tableDetail.data = JSON.parse(JSON.stringify(d))
    },
    goPassHuman() {
      this.$router.replace({ path: '/face/statistics/compare' })
    },
    expand() {
      this.$refs.scroller.update()
    }
  }
}
</script>
<style lang='less' scoped>
.layout-content {
  min-height: 100%;
  width: 100%;
  padding: 16px 0;
}

.bs-left {
  display: flex;
  flex-direction: column;
  .theme-title {
    justify-content: space-between;
  }
  .title label {
    label {
      flex: 1;
    }
    .icon-refresh {
      cursor: pointer;
    }
  }
}

.bs-main {
  display: flex;
  flex-direction: column;
  position: relative;
  background: transparent;
  // 上半部分样式
  .video {
    flex-grow: 1;
    display: flex;
    min-width: 1250px;
    // 左边视频
    .videos {
      height: 100%;
      width: 100%;
      position: absolute;
      bottom: 60px;
      top: 0;
    }
    // 右边对比框
    .contrastList {
      flex: 1;
      display: flex;
      flex-direction: column;
      .tips {
        flex: 1;
        background: #24395c;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .contrast-current {
    width: 500px;
    overflow: hidden;
    flex-direction: column;
    background: #1c3053;
    margin-left: 16px;
    display: flex;
  }
  // 下半部分样式
  .video-list {
    height: 174px;
    width: 100%;
    background: #1c3053;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    flex-shrink: 0;
    // tab 样式
    /deep/ .ivu-tabs {
      .ivu-tabs-bar {
        margin-bottom: 0;
        .ivu-tabs-tab {
          padding-top: 5px;
          padding-bottom: 5px;
          padding-left: 24px;
          border-top: 0;
        }
      }
      table {
        tr {
          th {
            height: 28px;
          }
        }
      }
    }
    .passList {
      flex: 1;
      overflow: hidden;
      position: relative;
      min-height: 146px;
      display: flex;
      // 实时抓拍详情
      .pic-list {
        flex-grow: 1;
        .realtimeList {
          width: 100%;
          overflow: hidden;
          display: flex;
          li {
            flex: 0 0 10%;
            padding: 0 5px;
            position: relative;
            overflow: hidden;
            .item {
              width: 100%;
              height: 100%;
              .imageWarp {
                height: ~'calc(100% - 40px)';
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .footer {
                .time {
                  width: 60px;
                  font-size: 12px;
                  display: flex;
                  align-items: center;
                }
                .point {
                  flex: 1;
                  font-size: 12px;
                  display: flex;
                  align-items: center;
                  text-align: right;
                }
              }
            }
          }
        }
      }
      // 人员对比列表
      .pass-list-table {
        flex-grow: 1;
        margin-top: 6px;
        @media (max-width: 1600px) {
          max-width: 796px;
        }
      }
      // table 右边的框
      .row-detail {
        display: flex;
        min-width: 500px;
        margin-left: 16px;
        .transversely {
          min-height: 0;
          padding-bottom: 0;
        }
      }
      // 查看更多按钮
      .more-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        width: 28px;
        height: 80px;
        cursor: pointer;
        background: #3c5073;
        border-radius: 4px;
        transform: translateY(-50%);
        p {
          position: absolute;
          top: 50%;
          left: 50%;
          height: 4em;
          font-size: 14px;
          transform: translate(-50%, -50%);
          writing-mode: vertical-rl;
        }
      }
    }
  }
}
// iView 样式调整
.theme-title {
  height: 38px;
  border-bottom: 2px solid #24395c;
  display: flex;
  align-items: center;
  background: #0f2243;
  padding: 0 20px;
}
// ContrastItem 组件的
.passList .transversely .contrast .imageWarp {
  height: 100% !important;
  img {
    min-height: 150px !important;
  }
}
// contrastList 的动画
.contrastList-enter-active,
.contrastList-leave-active,
.contrastList-move {
  transition: all 1s;
}
.contrastList-enter,
.contrastList-leave-active {
  opacity: 0;
  transform: translateX(-30px);
}
.contrastList-leave {
  opacity: 1;
  transform: translateX(30px);
}
</style>
