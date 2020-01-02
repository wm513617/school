<template>
<div class="vehicle flex flex-1">
  <div class="bs-content">
    <div style="display: flex; height: calc(100% - 170px); min-height: 500px;">
      <div class="bs-left">
        <div class="title clearfix theme-title">
          <label>机构</label>
          <span class="right">
            <i class="iconfont icon-refresh" @click="refreshOrg" style="float:right;"></i>
          </span>
        </div>
        <div style="padding: 10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
        </div>
        <div class="vtreeBox" style="height: calc(100% - 92px)">
          <bs-scroll ref="scroller">
            <VTree :treeData="structTree" :searchVal="searchVal" :options="{showOpenPreview: true,showOpenAllPreview: true, search: {onlyLeaf: true}}" @on-expand="expand" @loadMore="expand" @openPreviewClick="handlePreview" @node-dblclick="handlePreview" @openAllPreviewClick="allPreview"></VTree>
          </bs-scroll>
        </div>
      </div>
      <div class="bs-main">
        <div class="video">
          <div class="video-container">
            <!-- 当显示详情窗口时,插件隐藏，视频以抓图显示 -->
            <videoImgBg class="videosbg" v-if="showBackView" :count="count" :tooltip="true" :active="bgactive" :imgList="imgList" :style="{height: `calc(100% - ${slotHeight}px)`}"></videoImgBg>
            <div class="videos" id='capture' :style="{bottom: videoBottom + 'px',top: videoTop + 'px'}">
              <previewPlugin ref="frame" @openBack="getOpenCamera" @stopBack="deleteCamera" :iconShow="previewIcon" :isButton="true" :panesArr="panesArr"></previewPlugin>
            </div>
          </div>
        </div>
        <div class="contrast-current">
          <div class="title">
            <div>
              今日报警
              <a href="javascript:void(0)" @click='toRouter("/structure/alarmSearch")'>{{structDefeAlarmCount}}</a>
              次
            </div>
            <div class="more" @click="$router.replace('/structure/alarmSearch')">
              更多>
            </div>
          </div>
          <div class="contrastList">
            <bs-scroll ref="scrollTwo" v-if="structAlarmList.length >0">
              <transition-group name="contrast-list" tag="ul" class="contrastList">
                <li v-for="(item,index) of structAlarmList" :key="structAlarmList.length - index">
                  <ContrastItem :data="item" :index='index' @showDetail="showDetail(item, 'alarm', index)" />
                </li>
              </transition-group>
            </bs-scroll>
            <div class="tips" v-if="structAlarmList.length <= 0">
              <span>
                暂无报警记录
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="video-list">
      <div class="title">
        <div class="statistic-title" v-for="(item, index) in statictisNumbers" :key="index" @click="toSearch(item)">
          <i :class="['iconfont', item.icon]"></i>
          <span class='title-sign'>{{item.name}}</span>
          <span class="title-number">{{item.number}}</span>
        </div>
      </div>
      <div class="two-list-box">
        <div class="pass-list">
          <div class="tips" v-if="personCapList.length <= 0">
            <span>
              暂无抓拍记录
            </span>
          </div>
          <bs-scroll ref="scrollOne" v-if="personCapList.length >0">
            <div class="pic-list" v-if="personCapList.length > 0">
              <transition-group name="capture-list" tag="ul" class="captureList">
                <li v-for="(item,index) of personCapList" class="item" :key="personCapList.length - index">
                  <div class="header">
                    <span class="point" :title='item.channelName'>
                      {{ item.channelName }}
                    </span>
                  </div>
                  <div class="imageWarp">
                    <img :src="item.smallImageUrl"  @error="imgErr($event, index)" @click="showDetail(item, 'passer')"/>
                  </div>
                  <div class="footer">
                    <span class="time">
                      {{ $moment.unix($moment(Number(item.captureTime)).unix()).format('HH:mm:ss') }}
                    </span>
                  </div>
                </li>
              </transition-group>
            </div>
          </bs-scroll>
        </div>
        <div class="list-nothing"></div>
        <div class="pass-list">
          <div class="tips" v-if="carCapList.length <= 0">
            <span>
              暂无抓拍记录
            </span>
          </div>
          <bs-scroll ref="scrollOne" v-if="carCapList.length >0">
            <div class="pic-list" v-if="carCapList.length > 0">
              <transition-group name="capture-list" tag="ul" class="captureList">
                <li v-for="(item,index) of carCapList" class="item" :key="carCapList.length - index">
                  <div class="header">
                    <span class="point" :title='item.channelName'>
                      {{ item.channelName }}
                    </span>
                  </div>
                  <div class="imageWarp">
                    <img :src="item.smallImageUrl"  @error="imgErr($event, index)" @click="showDetail(item, 'passer')"/>
                  </div>
                  <div class="footer">
                    <span class="time">
                      {{ $moment.unix($moment(Number(item.captureTime)).unix()).format('HH:mm:ss') }}
                    </span>
                  </div>
                </li>
              </transition-group>
            </div>
          </bs-scroll>
        </div>
      </div>
    </div>
  </div>
  <StructInfo :type='type' v-if='showInfoModal' :show='showInfoModal' :info='oneStripInfo' @close='close'></StructInfo>
  <audio ref='audio' style="display: none" src='../../../static/face/audio/1.mp3' :autoplay="audio">
  您的浏览器不支持 audio 标签。
  </audio>
</div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import toTreeData from 'assets/js/toTreeData'
import videoImgBg from './common/videoBg'
import ContrastItem from './common/ContrastItem'
import StructInfo from './common/StructInfo'
import alarm from 'src/socket/alarm.js'
import previewPlugin from 'components/videoComponentsNew/previewPlugin'
import _ from 'lodash'
let db
export default {
  name: 'CaptureRealtime',
  components: {
    videoImgBg,
    ContrastItem,
    StructInfo,
    previewPlugin
  },
  data() {
    return {
      audio: false,
      structTree: [],
      searchVal: '',
      oneStripInfo: {},
      // 视频参数
      slotHeight: 62,
      // 视频换成图片相关
      showBackView: false,
      videoBottom: 0,
      videoTop: 0,
      count: 4,
      bgactive: 0,
      imgList: [],
      type: '', // 详情窗口
      showInfoModal: false,
      captureCounts: {}, // 实时抓拍统计数量
      statictisNumbers: [],
      playVideoArr: [], // 已经播放的视频 资源IP-资源id(第三方)
      previewIcon: {
        stop: true,
        stopAll: true,
        screenshot: true,
        volume: true,
        fullScreen: true,
        multiScreen: true
      },
      panesArr: [
        { value: 1, label: '单画面' },
        { value: 4, label: '四画面' },
        { value: 9, label: '九画面' },
        { value: 16, label: '十六画面' }
      ]
    }
  },
  computed: {
    ...mapState({
      personCapList: ({ videoStructured }) => videoStructured.personCapList,
      carCapList: ({ videoStructured }) => videoStructured.carCapList,
      structAlarmList: ({ videoStructured }) => videoStructured.structAlarmList,
      structDefeAlarmCount: ({ videoStructured }) => videoStructured.structDefeAlarmCount,
      videoStructuredParam: ({videoStructuredSetting}) => videoStructuredSetting.videoStructuredParam
    }),
    plugin() {
      return this.$refs.frame
    }
  },
  watch: {
    structDefeAlarmCount() {
      this.audio = true
      this.$refs.audio.load()
    },
    captureCounts: {
      handler() {
        this.setStatictisNumbers()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'getVideoStructTree',
      'setStructContrastList',
      'getVeriFaceRealTimeData',
      'changeRealtimeCounts',
      'saveStructAlarmData',
      'getCaptureInitData',
      'getDefenseAlarmData',
      'getDefenseAlarmCount',
      'getCaptureTodayCount'
    ]),
    ...mapActions('videoStructuredSetting', ['getVideoStructuredParam']),
    ...mapMutations(['CHANGE_VERIFACE_OPENARR', 'SET_SEARCH_TYPE', 'SET_DEFAULT_STRUCT_ALARM_SEARCH', 'UPDATE_PERSON_CAP_LIST', 'ADD_PLAYINGID', 'EMPTY_PLAYINGID', 'DEL_PLAYINGID', 'UPDATE_CAR_CAP_LIST']),
    refreshOrg() {
      this.getVideoStructTree().then(res => {
        this.structTree = toTreeData([res.data])
        this.$Notice.success({
          title: '刷新成功',
          desc: '机构列表刷新成功',
          duration: 1
        })
      }).catch(err => {
        this.$Notice.warning({
          title: '获取视频结构化资源失败',
          desc: err.response.data.message,
          duration: 1
        })
      })
    },
    imgErr(e, index) {
      e.target.src = '/static/noImg1.png'
    },
    setPlayParam(node) {
      let param
      if (this.videoStructuredParam.isStartVideoCode) {
        param = {
          devIp: node.eid.ip,
          rtmp: node.videoStructure && node.videoStructure.rtmp,
          orgId: node._id,
          cameraName: node.name,
          monitortype: node.monitortype
        }
      } else {
        param = {
          devIp: node.eid.ip,
          devPort: node.eid.cport,
          channel: node.chan,
          streamType: node.stream || 'main',
          resId: node.eid._id,
          orgId: node._id,
          cameraName: node.name,
          monitortype: node.monitortype
        }
      }
      return param
    },
    handlePreview(node) {
      const param = this.setPlayParam(node)
      this.plugin.openPreview(param)
    },
    allPreview(node) {
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
    showDetail(data, type, index) {
      // 主页面人员对比详情的弹窗 props value 值
      let item = this.$lodash.clone(data)
      this.type = type
      if (type === 'alarm') {
        item.dispose = true
        this.setStructContrastList({index: index, data: item})
      }
      this.oneStripInfo = item
      // 先换视频再出弹窗
      if (!this.videoStructuredParam.isStartVideoCode) {
        this.BackViewShowfn()
      } else {
        this.showInfoModal = true
      }
    },
    BackViewShowfn(i, data) {
      if (!this.plugin) {
        this.showInfoModal = true
        return
      }
      this.imgList = this.plugin.getRealPicturebyBase64()
      const timer = setTimeout(() => {
        this.count = this.plugin.checkedWmode
        this.bgactive = this.plugin.checkedPane
        this.showBackView = true
        this.videoBottom = -10000
        this.videoTop = -10000
        this.showInfoModal = true
        clearTimeout(timer)
      }, 10)
    },
    pbClose() {
      this.showBackView = false
      this.videoBottom = 0
      this.videoTop = 0
    },
    close() {
      if (!this.videoStructuredParam.isStartVideoCode) {
        this.pbClose()
      }
      this.showInfoModal = false
    },
    expand() {
      this.$refs.scroller.update()
    },
    toRouter(str) {
      this.$router.replace(str)
      this.SET_DEFAULT_STRUCT_ALARM_SEARCH(true)
    },
    changeRealtimeCounts(data) {
      const obj = {
        1: 'pedestrain',
        2: 'bike',
        3: 'motorcycle',
        4: 'car',
        5: 'tricycle',
        6: 'bus',
        7: 'van',
        8: 'truck'
      }
      const key = obj[parseInt(data.type)]
      this.captureCounts[key] = this.captureCounts[key] ? this.captureCounts[key] : 0
      this.captureCounts[key] += 1
    },
    toSearch(item) {
      this.SET_SEARCH_TYPE(item.type)
      this.toRouter('/structure/integratedQuery')
    },
    getOpenCamera(data) {
      this.ADD_PLAYINGID(data.orgId) // 播放的资源 树节点 颜色蔚蓝色
      if (this.playVideoArr.indexOf(data.orgId) === -1) { // 已播放的视频可以接收实时数据
        this.playVideoArr.push(data.orgId)
      }
    },
    deleteCamera(data) {
      this.DEL_PLAYINGID(data.orgId)
      const index = this.$lodash.findIndex(this.playVideoArr, (item) => { return data.orgId === item.orgId })
      this.playVideoArr.splice(index, 1)
    },
    receviceIdentify(data) {
      this.changeRealtimeCounts(data)
      if (this.playVideoArr.includes(data.videoChannel)) {
      // 1-8 对应 行人-自行车-摩托车-轿车-三轮车-大客车-面包车-卡车
        const arr = [1, 2, 3, 5]
        if (arr.includes(parseInt(data.type))) {
          this.UPDATE_PERSON_CAP_LIST(data)
        } else {
          this.UPDATE_CAR_CAP_LIST(data)
        }
      }
    },
    setStatictisNumbers() {
      this.statictisNumbers = [
        {
          name: '行人',
          icon: 'icon-hangren',
          number: this.captureCounts.pedestrain ? this.captureCounts.pedestrain : 0,
          type: 1
        },
        {
          name: '摩托车',
          icon: 'icon-icon-test1',
          number: this.captureCounts.motorcycle ? this.captureCounts.motorcycle : 0,
          type: 3
        },
        {
          name: '三轮车',
          icon: 'icon-sanlunche',
          number: this.captureCounts.tricycle ? this.captureCounts.tricycle : 0,
          type: 5
        },
        {
          name: '自行车',
          icon: 'icon-icon-test2',
          number: this.captureCounts.bike ? this.captureCounts.bike : 0,
          type: 2
        },
        {
          name: '大客车',
          icon: 'icon-dakeche',
          number: this.captureCounts.bus ? this.captureCounts.bus : 0,
          type: 6
        },
        {
          name: '轿车',
          icon: 'icon-jiaoche',
          number: this.captureCounts.car ? this.captureCounts.car : 0,
          type: 4
        },
        {
          name: '面包车',
          icon: 'icon-icon-test3',
          number: this.captureCounts.van ? this.captureCounts.van : 0,
          type: 7
        },
        {
          name: '卡车',
          icon: 'icon-qiache',
          number: this.captureCounts.truck ? this.captureCounts.truck : 0,
          type: 8
        }
      ]
    },
    // indexedDB保存数据
    saveDataToIndexedDB(type) {
      var captureRealtimeData = window.indexedDB.open('carDB', 2)
      captureRealtimeData.onsuccess = event => {
        db = event.target.result
        if (type === 'update') {
          this.updateCaptureRealtimeData()
        } else if (type === 'read') {
          this.readCaptureRealtimeData()
        }
        console.log('打开[carDB]数据库成功')
      }
      captureRealtimeData.onerror = event => {
        console.log('数据库[carDB]打开报错')
      }
    },
    // indexedDB更新数据
    updateCaptureRealtimeData() {
      let transaction = db.transaction(['CaptureRealtimeData'], 'readwrite')
      let objectStore = transaction.objectStore('CaptureRealtimeData')
      let captureCountData = _.cloneDeep(this.captureCounts)
      captureCountData.id = 1
      var request = objectStore.put(captureCountData)// put()方法自动更新了主键为1的记录
      request.onsuccess = data => {
        console.log('更新数据成功')
      }
      request.onerror = err => {
        console.log('更新数据失败' + err)
      }
    },
    // indexedDB读取数据
    readCaptureRealtimeData() {
      if (db.objectStoreNames.contains('CaptureRealtimeData')) { // 判断CaptureRealtimeData这张表格是否存在
        let transaction = db.transaction('CaptureRealtimeData')
        let objectStore = transaction.objectStore('CaptureRealtimeData')
        let request = objectStore.get(1)// objectStore.get()方法用于读取数据，参数是主键的值。
        request.onerror = err => {
          console.log('数据读取失败' + err)
        }
        request.onsuccess = data => {
          if (data && data.target && data.target.result) {
            delete data.target.result.id
            this.captureCounts = _.cloneDeep(data.target.result)
          } else {
            console.log('未获得数据记录')
          }
        }
      }
    },
    async initIndexedDB() {
      if (!db) {
        this.saveDataToIndexedDB('read')
      } else {
        this.readCaptureRealtimeData()
      }
    }
  },
  created() {
    this.initIndexedDB()
    // 实时抓拍数量统计、抓拍报警数量统计
    this.getDefenseAlarmCount()
    this.getCaptureTodayCount().then((data) => {
      if (data) { this.captureCounts = data }
    }).catch(err => console.log(err))
    this.getVideoStructTree().then(res => {
      this.structTree = toTreeData([res.data])
    }).catch(err => this.errorMsg(err.response.data.message))
    this.getVideoStructuredParam() // 获取配置参数
    // 获取就近时间的抓拍记录和报警记录
    this.getCaptureInitData()
    this.getDefenseAlarmData()
  },
  mounted() {
    // 接收socket 实时抓拍数据、抓拍报警数据
    alarm.on('structureIdentify', this.receviceIdentify)
    alarm.on('structurAlarmData', this.saveStructAlarmData)
  },
  beforeDestroy() {
    this.EMPTY_PLAYINGID()
    alarm.remove('structureIdentify', this.receviceIdentify)
    alarm.remove('structurAlarmData', this.saveStructAlarmData)
    console.log('退出实时结构化')
    if (!db) {
      this.saveDataToIndexedDB('update')
    } else {
      this.updateCaptureRealtimeData()
    }
  }
}
</script>
<style lang="less" scoped>
.vehicle {
  li {
    list-style: none;
  }
}
.bs-content {
  flex-direction: column;
  .video-list {
    height: 178px;
    width: 100%;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    .title {
      height: 38px;
      text-align: center;
      background: #1c3053;
      display: flex;
      justify-content: space-around;
      .statistic-title {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        span, i {
          display: block;
          height: 38px;
          line-height: 38px;
        }
        .iconfont {
          font-size: 28px;
          margin-right: 5px;
        }
        .title-sign {
          margin-right: 15px;
        }
      }
    }
    .two-list-box {
      width: 100%;
      height: ~'calc(100% - 38px)';
      display: flex;
    }
    .list-nothing {
      width: 6px;
      height: 100%;
    }
    .pass-list {
      margin-top: 5px;
      width: ~'calc(50% - 3px)';
      overflow: hidden;
      background: #1c3053;
      padding: 10px 0 5px;
      // 实时抓拍
      .tips {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
      .pic-list {
        flex: 1;
        .captureList {
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
            transition: all .8s;
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
              cursor: pointer;
              img {
                height: 112px;
                vertical-align: bottom;
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
.bs-left {
  display: flex;
  flex-direction: column;
  min-height: 500px;
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
  min-height: 500px;
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
  }
  .contrast-current {
    min-width: 350px;
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
        background-color: #1c3053;
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
.capture-list-enter, .capture-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
