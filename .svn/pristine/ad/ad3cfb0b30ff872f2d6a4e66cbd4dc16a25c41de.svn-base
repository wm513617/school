<template src="./Detection.html"></template>

<script>
import VideoButtons from 'components/BScarVideoButtons'
import BScarMenu from 'src/components/BScarMenu'
import BSMap from 'src/components/common/BSMap'
import layerConfig from 'src/assets/map/MapConfig.js'
import editIpc from 'src/assets/map/edit/editIpc.js'
import videoImgBg from './common/videoBg'
import CarDetail from './common/carDetail.vue'
import { mapState, mapActions, mapMutations } from 'vuex'
import BasicsCtrl from 'src/view/video/preview/BasicsCtrl'
import 'src/components/Scroll'

export default {
  components: {
    BScarMenu,
    CarDetail,
    VideoButtons,
    BasicsCtrl,
    videoImgBg,
    BSMap
  },
  data() {
    return {
      carDetailInfo: {},
      vedioLayer: layerConfig.layers.videoIpc, // 车辆点位数组图层
      videoIpcFeatures: [], // 地图上有关车辆的点位数组
      mapCenter: null,
      slotHeight: 40,
      plugin: null,
      playingCount: 0,
      showList: '实时过车',
      btnheight: 100,
      searchVal: '',
      activeOrgId: '',
      openTemp: [],
      options: {
        showOpenPreview: true,
        showSearch: false,
        showOpenAllPreview: true
      },
      state: {
        isPlay: true,
        isBoost: '',
        isVolumeOpen: '',
        isRecording: '',
        volumeValue: 0
      },
      screenCell: [
        {
          label: '单画面',
          value: 1
        },
        {
          label: '2X2',
          value: 4
        },
        {
          label: '3X3',
          value: 9
        },
        {
          label: '4X4',
          value: 16
        }
      ],
      screenFous: 0,
      screenCount: 1,
      carInfo: {},
      devMap: null,
      detailModal: false,
      handleType: '云台控制',
      resultType: '过车查看',
      carListTitle: [
        {
          title: '车牌号',
          key: 'licence'
        },
        {
          title: '颜色',
          key: 'colorName'
        },
        {
          title: '品牌',
          key: 'brand'
        },
        {
          title: '类型',
          key: 'vehicleTypeName'
        },
        {
          title: '时间',
          render: (h, params) => {
            let date = params.row.timeStamp
            let text = date ? this.$moment.unix(Number(date)).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'ghost',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.row)
                    }
                  }
                },
                '查看'
              )
            ])
          }
        }
      ],
      showBackView: false,
      videoBottom: 60,
      videoTop: 0,
      count: 4,
      bgactive: 0,
      imgList: {}
    }
  },
  created: function() {
    this.getSocketRealTime()
    this.getSocketDefenseVehicle()
    this.getVideoOrg()
  },
  computed: {
    ...mapState({
      videoOrg: state => state.vehicle.videoOrg,
      socketState: state => state.vehicle.socketState,
      vehicleRealTime: state => state.vehicle.vehicleRealTime,
      carList: state => state.vehicle.vehicleDefenseRealTime,
      openArr: state => state.vehicle.openArr,
      videoConnect: state => state.vehicle.videoConnect,
      isDeployCar: state => state.vehicle.isDeployCar,
      car: state => state.vehicle.showCar,
      playingPluginIds: state => state.videoOrg.playingIds,
      editVedioIpcList: ({ mapGisData }) => mapGisData.editVedioIpcList,
      addVedioInfo: ({ mapVedioData }) => mapVedioData.addVedioInfo,
      activeMap: ({ mapGisData }) => mapGisData.activeMap
    }),
    pluginData() {
      return this.$refs.frame.pluginData
    }
  },
  mounted() {
    this.plugin = this.$refs.frame
  },
  beforeDestroy() {
    this.openTemp = []
    this.CHANGE_OPENARR([])
  },
  methods: {
    ...mapActions([
      'getVideoOrg',
      'searchAnalyzeInfo',
      'getResourceInfo',
      'getSocketRealTime',
      'getSocketDefenseVehicle',
      'getOnePoint'
    ]),
    ...mapMutations([
      'CHANGE_VIDEOCONNECT',
      'CHANGE_DEPLOYCAR',
      'CHANGE_OPENARR',
      'GETINFO_CURPASSCAR',
      'SET_MAPACTIVE_STATE',
      'SET_ADDVEDIO_INFO',
      'SET_EDITVEDIOIPC_LIST'
    ]),
    showCar(data) {
      this.car = data
    },
    handleNode(dev) {
      this.addVedioIpc(dev)
    },
    // 点击节点，加载有位置信息的点位到地图上
    addVedioIpc(node) {
      if (node.children) {
        return
      }
      this.$store.commit('SET_EDITVEDIOIPC_LIST', [])
      this.getOnePoint(node._id)
        .then(res => {
          if (node.point) {
            let param = JSON.parse(JSON.stringify(res.point))
            let coods = res.point.loc.split(',')
            this.mapCenter = [parseFloat(coods[0]), parseFloat(coods[1])]
            param.monitortype = node.monitortype
            param._id = node._id
            if (res.point.isouter) {
              // 楼层外
              if (res.point.mapId !== this.activeMap) {
                this.$store.commit('SET_MAPACTIVE_STATE', res.point.mapId)
                this.$store.commit('SET_ADDVEDIO_INFO', param)
                this.addStorageVedioAndSector(param)
              } else {
                this.addStorageVedioAndSector(param)
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 加载已入库点位
    addStorageVedioAndSector(node) {
      let vedios = editIpc.addStorageFeature({ vedioList: this.editVedioIpcList, sectorList: [], node })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedios.vediolist)
    },
    avtiveChange(i) {},
    openPreviewClick(node) {
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
      this.plugin.open(param).then(() => {
        this.openTemp.push({
          id: node._id,
          channelid: node.channelid
        })
      })
    },
    openAllPreviewClick(node) {
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
    show(car) {
      if (car._id) {
        this.searchAnalyzeInfo({ id: car._id, licence: car.licence }).then(res => {
          this.carDetailInfo = res.data
          this.BackViewShowfn()
        })
      }
    },
    tabClick(e) {
      this.resultType = e
    },
    getResult(val) {
      setTimeout(function() {}, 2000)
    },
    getMoreCars() {
      this.$router.replace({ path: '/vehicle/stat/pass' })
    },
    changeDeployCar() {
      this.CHANGE_DEPLOYCAR()
    },
    changeHandleType(e) {
      this.handleType = e
    },
    pauseConnect(e) {
      this.CHANGE_VIDEOCONNECT(!this.videoConnect)
      if (this.videoConnect) {
        e.target.innerText = '暂停接收'
      } else {
        e.target.innerText = '开始接收'
      }
    },
    BackViewShowfn(i, data) {
      this.imgList = {}
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
    expand() {
      this.$refs.scroller.update()
    }
  },
  watch: {
    // 地图上点位数组
    editVedioIpcList(features) {
      this.videoIpcFeatures = JSON.parse(JSON.stringify(features))
    },
    activeMap(val) {
      if (this.addVedioInfo) {
        this.addStorageVedioAndSector(this.addVedioInfo)
        this.$store.commit('SET_ADDVEDIO_INFO', null)
      }
    },
    resultType(val) {
      this.getResult(val)
    },
    playingPluginIds(data) {
      let ids = this.$bsValidate.uniqueArray(data)
      let openIds = []
      ids.map(id => {
        this.openTemp.map(item => {
          if (id === item.id) {
            openIds.push(item.channelid)
          }
        })
      })
      let temp = this.$bsValidate.uniqueArray(openIds)
      this.CHANGE_OPENARR(temp)
    },
    playingCount(val) {
      if (val === 0) {
        this.openTemp = []
        this.CHANGE_OPENARR([])
      }
      this.$refs['videoBtn'].playingCount = val
    }
  }
}
</script>
<style>
.vehicle .ivu-tabs-nav .ivu-tabs-tab {
  padding: 0 12px!important;
}
.vehicle .ivu-modal-body {
  padding: 24px 32px!important;
}
</style>

<style lang="less" scoped>
.layout-content {
  min-height: 100%;
  width: 100%;
  padding: 16px 0;
}
.bs-left {
  display: flex;
  flex-direction: column;
  .dev-tree {
    flex: 1 1 400px;
    width: 272px;
    overflow: auto;
  }
  .vtree {
    height: auto !important;
  }
  .channelHandle {
    flex: 0 360px;
    .ctrlScale {
      position: absolute;
      bottom: -10px;
      left: -5px;
      transform: scale(0.85, 0.85);
    }
  }
}

.bs-main {
  display: flex;
  flex-direction: column;
  position: relative;
  // 上半部分
  .video {
    flex-grow: 1;
    display: flex;
    min-width: 1250px;
    .videos {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 100px;
    }
    // 视屏右侧
    .vehicle-result {
      width: 500px;
      display: flex;
      color: #ffffff;
      margin-left: 16px;
      flex-direction: column;
      background: #1c3053;
      overflow: auto;
      .content {
        padding: 20px;
        height: 180px;
        .video-list {
          .pause-btn {
            position: absolute;
            right: 10px;
            top: -10px;
          }
        }
        .section {
          width: 50%;
          padding: 0 10px;
          float: left;
          position: relative;
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5) {
            width: 32%;
            overflow: hidden;
          }
          .title {
            text-align: center;
          }
          .count {
            width: 100%;
            height: 36px;
            overflow: hidden;
            text-align: center;
          }
          &.split:after {
            content: '';
            height: 40px;
            position: absolute;
            width: 1px;
            background: #6d788b;
            right: 0px;
            top: 5px;
          }
        }
      }
      .carInfo {
        flex: 1 0;
        display: flex;
        flex-direction: column;
      }
      // carInfo 的子元素
      .carimg {
        position: relative;
        text-align: center;
        margin: 10px;
        min-height: 350px;
        img {
          width: 100%;
          height: 360px;
          border: none;
        }
      }
      .car-type {
        position: absolute;
        right: 10px;
        top: 10px;
        padding: 0 3px;
        font-size: 16px;
        border: 1px solid #ccc;
        line-height: 40px;
        color: #ffffff;
        background: rgba(255, 255, 255, 0.4);
      }
      .result-handle {
        padding: 0 16px 16px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        button {
          margin-right: 26px;
          width: 80px;
          height: 32px;
        }
        .video-list button {
          margin-left: 10px;
        }
        .tabsHandle {
          position: absolute;
          right: 0px;
          top: 0px;
        }
      }
    }
  }
  // 下半部分
  .video-list {
    height: 174px;
    width: 100%;
    margin-top: 16px;
    background: #1c3053;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    // tab 样式
    /deep/ .ivu-tabs {
      .ivu-tabs-bar {
        margin-bottom: 0;
        .ivu-tabs-tab {
          padding-top: 5px;
          padding-bottom: 5px;
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
      // 实时过车
      .pic-list {
        flex-grow: 1;
        padding-right: 48px;
        margin-top: 6px;
        overflow: hidden;
        .carList {
          display: block;
          height: 140px;
          width: 200%;
          li {
            overflow: hidden;
            margin-right: 8px;
            display: inline-block;
            overflow: hidden;
            vertical-align: top;
            span {
              display: block;
              font-size: 24px;
              text-align: center;
            }
            img {
              height: 140px;
              vertical-align: top;
            }
          }
        }
      }
      // 布控车辆
      .pass-list-table {
        flex-grow: 1;
        margin-top: 6px;
        padding-right: 48px;
      }
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
    .pause {
      padding: 16px;
    }
  }
}

// contrastList 动画
// .contrastList-move
.contrastList-enter-active,
.contrastList-leave-active {
  transition: all 1s;
}

.contrastList-enter,
.contrastList-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.contrastList-move {
  transition: transform 1s;
}
</style>
