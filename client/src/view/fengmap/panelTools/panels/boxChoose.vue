<template>
  <div class="box-choose-panel">
    <div class="point-content">
      <div class="title">
        已选资源
      </div>
      <div class='tabs'>
        <div class='tab iconfont icon-recplayback' :class="{active: activeTab === 'video'}" @click="activeTab = 'video'" title="视频"></div>
        <div class='tab iconfont icon-danbingguanli' :class="{active: activeTab === 'single'}" @click="activeTab = 'single'" v-if="!isPlatformTrack" title="单兵"></div>
        <div class='tab iconfont icon-tongji1' :class="{active: activeTab === 'statistics'}" @click="activeTab = 'statistics'" v-if="!isPlatformTrack" title="统计"></div>
      </div>
      <div class="box-style" v-if="activeTab === 'video'">
        <div class="tools" v-if="pointList.length>0">
          <Button-group>
            <Button icon="arrow-up-c" @click="moveUp('up')" title="上移" :disabled="isChoosing"></Button>
            <Button icon="arrow-down-c" @click="moveDown('down')" title="下移" :disabled="isChoosing"></Button>
            <Button icon="trash-a" @click="deleteOne" title="删除" :disabled="isChoosing"></Button>
          </Button-group>
        </div>
          <ul class="point-list" v-if="pointList.length">
            <transition-group name="cell" tag="ul" class="container">
              <li v-for="(item, index) in pointList" :key="item._id" :class="[choosingIndex===index? 'active-li' : '', item.collect? 'video-list': '']" :style="{height: ((isPlatformTrack && item.collectTime && item.collectTime.endTime) || isPlatformTrack && item.collectTime && !item.collectTime.endTime && item.collectTime.startTime) ? '72px' : '38px' }" @click="chooseOne(index, item)">
                <span v-if="isPlatformTrack">
                  <Checkbox :value="item.checked" :disabled="!item.checked&&videoCheckedNum>=5" @on-change="chooseVideo(item.checked, index)"></Checkbox>
                  <i class="iconfont icon-qiangji" :title="item.name"></i>
                  {{item.name}}
                </span>
                <span v-else>
                  <i class="iconfont icon-qiangji"></i>
                  {{item.name}}
                </span>
                <div v-if="isPlatformTrack && item.collectTime && item.collectTime.endTime" class="collect-info context-style" :title="$moment.unix($moment(item.collectTime.endTime).unix()).format('YYYY-MM-DD HH:mm:ss')">{{$moment.unix($moment(item.collectTime.endTime).unix()).format('YYYY-MM-DD HH:mm:ss')}}</div>
                <div v-if="isPlatformTrack && item.collectTime && !item.collectTime.endTime && item.collectTime.startTime" class="collect-info context-style" :title="$moment.unix($moment(item.collectTime.startTime).unix()).format('YYYY-MM-DD HH:mm:ss')">{{$moment.unix($moment(item.collectTime.startTime).unix()).format('YYYY-MM-DD HH:mm:ss')}}</div>
              </li>
            </transition-group>
          </ul>
        <p class="notice-msg" v-else>未框选到在线启用的资源</p>
        <div class="bottom-btn">
          <Button type="default" @click="cancel" v-if="!isPlatformTrack">取消</Button>
          <Button type="primary" @click="preview" v-if="!isPlatformTrack" :disabled="pointList.length === 0">预览</Button>
          <Button type="primary" @click="relayTrack" v-if="isPlatformTrack" :disabled="pointList.length === 0">开始追踪</Button>
          <Button type="primary" v-if="isPlatformTrack" :disabled="isSaveTrackRecord" @click="keepRecords">保存记录</Button>
        </div>
      </div>
      <div class="box-style" v-if="activeTab === 'single'">
        <div class="tools" v-if="singleList.length>0">
          <Button-group>
            <Button icon="arrow-up-c" @click="moveUp('up')" title="上移" :disabled="isChoosing"></Button>
            <Button icon="arrow-down-c" @click="moveDown('down')" title="下移" :disabled="isChoosing"></Button>
            <Button icon="trash-a" @click="deleteOne" title="删除" :disabled="isChoosing"></Button>
          </Button-group>
        </div>
        <ul class="point-list" v-if="singleList.length">
            <li v-for="(item, index) in singleList" :key="item._id" @click="chooseOne(index)" :class="{'active-li':choosingIndex===index}" :title="item.name">
              {{item.username}}
            </li>
        </ul>
        <p class="notice-msg" v-else>未框选到单兵资源</p>
        <div class="bottom-btn">
          <Button type="default" @click="cancel">取消</Button>
          <Button type="primary" @click="chat" :disabled="singleList.length < 2">广播</Button>
        </div>
      </div>
      <div class="box-style" v-if="activeTab === 'statistics'">
        <section class="ele-wrap">
          <ul class="icon-left">
            <li><i class="icon iconfont icon-paisheluxiang" title="视频"></i></li>
            <li><i class="icon iconfont icon-baojing2" title="普通报警"></i></li>
            <li><i class="icon iconfont icon-xiaofangbaojing11" title="消防报警"></i></li>
            <li><i class="icon iconfont icon-baojingzhu1" title="报警柱"></i></li>
            <li><i class="icon iconfont icon-baojingxiang2" title="报警箱"></i></li>
            <li><i class="icon iconfont icon-dianzixungeng" title="巡更"></i></li>
            <li><i class="icon iconfont icon-grid" title="网格化"></i></li>
            <li><i class="icon iconfont icon-menjin" title="门禁"></i></li>
            <li><i class="icon iconfont icon-loufangdianwei" title="楼宇区域"></i></li>
            <li><i class="icon iconfont icon-yidongdanbing" title="在线单兵"></i></li>
          </ul>
          <div class="top-canvas-wrap" ref="topCanvas">
            <BSechart width="209px" :height="topCanvasHeight" :options="statisticOption"></BSechart>
          </div>
        </section>
        <div class="bottom-btn" style="justify-content:center;">
          <Button type="default" @click="cancel">关闭</Button>
        </div>
      </div>
    </div>
    <div v-if="singleList.length > 1 && isToTalk">
      <Broadcast @close="isToTalk = false" :imgList="pawnPhotos" :soliderInfos="singListInfo"></Broadcast>
    </div>
  </div>
</template>

<script>
import BSechart from 'components/BSechart'
import Broadcast from 'components/broadcast/Broadcast'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      isChoosing: false,
      pointList: [],
      singleList: [],
      showPop: false,
      activeTab: 'video',
      videoCheckedNum: 0,
      isToTalk: false,
      topCanvasHeight: ''
    }
  },
  components: {
    BSechart,
    Broadcast
  },
  methods: {
    ...mapActions([
      'setAreaDrawActive',
      'setSelect2DSingleList',
      'setMapPreviewPointList',
      'setIsSelectBoxPreview',
      'setIsSelectBoxRelayTrack',
      'setMapPlaybackPointList',
      'clearTrackVideoDataList'
    ]),
    ...mapActions('fengMapApplyInteractive', ['changeToolsPanelToBoxChoose', 'switchToolsPanel', 'setResouceChooseIndex', 'changeIsPointChoose']),
    ...mapActions(['saveTrackingRecord']),
    ...mapMutations(['PUT_PLAYBACK_POINT_LIST', 'SET_VIDEO_CHECKED_NUM']),
    chooseOne(index, item) {
      this.setResouceChooseIndex(index)
      if (this.isPlatformTrack && item) {
        this.$parent.toMapCenter(item._id)
      }
    },
    // 勾选/取消勾选
    chooseVideo(val, index) {
      if (!val) {
        // 选中
        this.videoCheckedNum++
        this.SET_VIDEO_CHECKED_NUM(this.videoCheckedNum)
      } else {
        // 取消选中
        this.videoCheckedNum--
        this.SET_VIDEO_CHECKED_NUM(this.videoCheckedNum)
      }
      this.PUT_PLAYBACK_POINT_LIST({ status: val, index }) // 修改选中项
      this.pointList[index].checked = !val
    },
    // 删除
    deleteOne() {
      if (this.activeTab === 'video') {
        if (
          this.pointList[this.choosingIndex].collectTime &&
          this.pointList[this.choosingIndex].collectTime.startTime !== undefined
        ) {
          this.$Notice.warning({ title: '警告', desc: '请先取消标记时间！！' })
        } else {
          if (this.pointList[this.choosingIndex].checked) {
            this.videoCheckedNum--
            this.SET_VIDEO_CHECKED_NUM(this.videoCheckedNum)
          }
          if (this.isPlatformTrack) {
            if (this.pointList[this.choosingIndex].checked) {
              this.pointList.splice(this.choosingIndex, 1)
              this.setMapPlaybackPointList(this.pointList)
            } else {
              this.pointList.splice(this.choosingIndex, 1)
            }
          } else {
            this.pointList.splice(this.choosingIndex, 1)
            this.setMapPreviewPointList(this.pointList)
          }
          // 将下述代码修改为上面，宋潇杉 2019-08-04
          // if (this.pointList[this.choosingIndex].checked) {
          //   this.videoCheckedNum--
          //   this.SET_VIDEO_CHECKED_NUM(this.videoCheckedNum)
          // }
          // this.pointList.splice(this.choosingIndex, 1)
          // if (this.isPlatformTrack) {
          //   this.setMapPlaybackPointList(this.pointList)
          // } else {
          //   this.setMapPreviewPointList(this.pointList)
          // }
        }
      } else {
        this.singleList.splice(this.choosingIndex, 1)
        this.setSelect2DSingleList(this.singleList)
      }
    },
    // 上移
    moveUp() {
      if (this.activeTab === 'video') {
        if (this.choosingIndex > 0) {
          let chooseingOne = this.pointList.splice(this.choosingIndex, 1)
          this.pointList.splice(this.choosingIndex - 1, 0, chooseingOne[0])
          // this.choosingIndex -= 1
          this.setResouceChooseIndex(this.choosingIndex - 1)
          if (this.isPlatformTrack) {
            this.setMapPlaybackPointList(this.pointList)
          } else {
            this.setMapPreviewPointList(this.pointList)
          }
        }
      } else {
        if (this.choosingIndex > 0) {
          let chooseingOne = this.singleList.splice(this.choosingIndex, 1)
          this.singleList.splice(this.choosingIndex - 1, 0, chooseingOne[0])
          // this.choosingIndex -= 1
          this.setResouceChooseIndex(this.choosingIndex - 1)
          this.setSelect2DSingleList(this.singleList)
        }
      }
    },
    // 下移
    moveDown() {
      if (this.activeTab === 'video') {
        if (this.choosingIndex < this.pointList.length - 1) {
          let chooseingOne = this.pointList.splice(this.choosingIndex, 1)
          this.pointList.splice(this.choosingIndex + 1, 0, chooseingOne[0])
          // this.choosingIndex += 1
          this.setResouceChooseIndex(this.choosingIndex + 1)
          if (this.isPlatformTrack) {
            this.setMapPlaybackPointList(this.pointList)
          } else {
            this.setMapPreviewPointList(this.pointList)
          }
        }
      } else {
        if (this.choosingIndex < this.singleList.length - 1) {
          let chooseingOne = this.singleList.splice(this.choosingIndex, 1)
          this.singleList.splice(this.choosingIndex + 1, 0, chooseingOne[0])
          // this.choosingIndex += 1
          this.setResouceChooseIndex(this.choosingIndex + 1)
          this.setSelect2DSingleList(this.singleList)
        }
      }
    },
    /**
     * @msg: 预览
     * @param {type}
     * @return:
     */
    preview() {
      this.changeIsPointChoose(false)
      // 过滤掉未启用的
      // console.log(this.pointList)
      let openedPointList = this.pointList.filter(item => {
        return !item.eid.hasOwnProperty('deviceStatus') || (item.eid.deviceStatus === 1 && item.status === 1)
      })
      // console.log(openedPointList)
      if (openedPointList.length) {
        this.setMapPreviewPointList(openedPointList)
        this.switchToolsPanel(false)
        this.setIsSelectBoxPreview(true)
      } else if (!this.pointList.length) {
        this.warningMsg('未框选设备！')
      } else {
        this.warningMsg('当前设备已全部禁用！')
      }
    },
    /**
     * 保存记录
     * 仅保存当前 collectTime的startTime和endTime有数据的， 且数据为[0-16]个
     * 清除session，清除vuex
     * 跳转至来时页面
     */
    keepRecords() {
      this.changeIsPointChoose(false)
      const param = this.$lodash.cloneDeep(this.showTrackInfoTabData)
      param.mapList = []
      // 过滤掉无开始标记时间的、开始标记时间大于结束标记时间的
      this.playbackPointList
        .filter(
          e =>
            e.collectTime &&
            e.collectTime.startTime &&
            (!e.collectTime.endTime || e.collectTime.endTime > e.collectTime.startTime)
        )
        .map(e => {
          if (param.mapList.length < 16) {
            let _data = {
              startTime: Math.floor(e.collectTime.startTime / 1000),
              endTime: Math.floor(e.collectTime.endTime / 1000),
              resource: e._id
            }
            if (!_data.endTime) {
              delete _data.endTime
            }
            param.mapList.push(_data)
          }
        })
      param.mapList.sort((a, b) => {
        return a.startTime > b.startTime ? 1 : -1
      })
      this.saveTrackingRecord(param)
        .then(() => {
          let openedPointList = this.pointList.filter(item => {
            return !item.eid.hasOwnProperty('deviceStatus') || (item.eid.deviceStatus === 1 && item.status === 1)
          })
          this.clearTrackVideoDataList()
          this.setIsSelectBoxRelayTrack(false)
          if (openedPointList.length) {
            let _a = JSON.parse(sessionStorage.getItem('trackEvent')).path
            sessionStorage.removeItem('trackEvent')
            location.href = location.origin + _a
          }
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('保存记录失败！')
        })
    },
    // 接力追踪【开始追踪】
    relayTrack() {
      this.changeIsPointChoose(false)
      let openedPointList = this.pointList.filter(item => {
        // 无 deviceStatus 字段（启用/停用）或有 deviceStatus 字段，且值为1，标识启用
        // status为1为在线；0为离线
        // 只有在 在线-启用-选中时，可播放
        return (
          (!item.eid.hasOwnProperty('deviceStatus') || (item.eid.deviceStatus === 1 && item.status === 1)) &&
          item.checked
        )
      })
      if (openedPointList.length) {
        this.setIsSelectBoxRelayTrack(true) // 是否打开接力追踪框选预览
        this.$emit('openRelayTrack')
      } else if (!this.videoCheckedNum) {
        this.warningMsg('请选中设备！')
      } else if (!openedPointList.length) {
        this.warningMsg('当前设备已全部禁用！')
      }
    },
    chat() {
      this.changeIsPointChoose(false)
      this.setSelect2DSingleList(this.singleList)
      this.switchToolsPanel(false)
      this.isToTalk = true
      // this.setIsSelectBoxPreview(true)
    },
    cancel() {
      this.setMapPreviewPointList([])
      this.setSelect2DSingleList([])
      this.setAreaDrawActive(false)
      this.changeToolsPanelToBoxChoose('')
      this.switchToolsPanel(false)
      this.setIsSelectBoxRelayTrack(false)
      this.setIsSelectBoxPreview(false)
      this.changeIsPointChoose(false)
    },
    setTopCanvasHeight() {
      this.$nextTick(() => {
        this.topCanvasHeight = this.$refs.topCanvas.clientHeight + 'px'
      })
    },
    getPlaybackPointList() {
      if (this.playbackPointList && this.playbackPointList.length) {
        this.pointList = JSON.parse(JSON.stringify(this.playbackPointList))
        this.pointList.map(item => {
          item.checked = item.checked ? item.checked : false
        })
      }
    }
    // refreshPointList() {
    //   this.pointList = JSON.parse(JSON.stringify(this.previewPointList))
    // }
  },
  computed: {
    ...mapState({
      previewPointList: ({ mapPoint }) => mapPoint.previewPointList,
      selectBoxSingleData: ({ mapPoint }) => mapPoint.selectBoxSingleData,
      boxStatisticOnCountsOn: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.boxStatisticOnCountsOn,
      boxStatisticOnCountsOff: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.boxStatisticOnCountsOff,
      videoCheckedNumber: ({ mapPoint }) => mapPoint.videoCheckedNum, // 视频列表选中的数量
      playbackPointList: ({ mapPoint }) => mapPoint.playbackPointList,
      showTrackInfoTabData: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.showTrackInfoTabData,
      choosingIndex: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.resouceChooseIndex
    }),
    ...mapGetters('fengMapApplyInteractive', ['toolsPanelActive', 'isPlatformTrack']),
    ...mapGetters(['isMapOuter']),
    statisticOption() {
      let resourceOn = this.boxStatisticOnCountsOn
      let resourceOff = this.boxStatisticOnCountsOff
      if (!this.isMapOuter) {
        resourceOn[0] = resourceOn[1] = 0
        resourceOff[0] = resourceOff[1] = 0
      }
      return {
        color: ['#3398DB', '#CCCCD3'],
        tooltip: {
          formatter: (param, value) => {
            if (param.dataIndex === 1 || param.dataIndex === 3 || param.dataIndex === 4) {
              param.seriesName = '数量: '
            }
            return param.seriesName + ': ' + param.value
          }
        },
        grid: {
          top: '0%',
          left: '3%',
          right: 70,
          bottom: '0.4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            show: false,
            position: 'top',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            show: false,
            data: ['', '', '', '', '', '', '', '', '', ''],
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '在线数量',
            type: 'bar',
            barWidth: '40%',
            stack: 'number',
            data: resourceOn
          },
          {
            name: '离线数量',
            type: 'bar',
            barWidth: '40%',
            stack: 'number',
            data: resourceOff,
            itemStyle: { normal: { label: { show: true, position: 'right' } } },
            label: {
              normal: {
                formatter: param => {
                  return param.value + resourceOn[param.dataIndex]
                }
              }
            }
          }
        ]
      }
    },
    pawnPhotos() {
      const arr = []
      for (let i = 0; i < this.singleList.length; i++) {
        arr.push(this.singleList[i].photo)
      }
      return arr
    },
    singListInfo() {
      const list = []
      for (let i = 0; i < this.singleList.length; i++) {
        list.push({
          name: this.singleList[i].username,
          id: this.singleList[i]._id,
          sn: this.singleList[i].sn,
          org: this.singleList[i].affiliation
        })
      }
      return list
    },
    isSaveTrackRecord() {
      const l =
        this.showTrackInfoTabData && this.showTrackInfoTabData.mapList && this.showTrackInfoTabData.mapList.length
      const m = this.playbackPointList.length
      let status = false // 不禁用
      if (typeof l === 'number' && typeof m === 'number') {
        if (l === m) {
          const mapList = this.$lodash.cloneDeep(this.showTrackInfoTabData.mapList) || []
          const pointList = this.$lodash.cloneDeep(this.playbackPointList) || []
          let tag = 0
          for (let i = 0; i < mapList.length; i++) {
            const resource = mapList[i] && mapList[i].resource
            const resourceId = resource && resource.eid && resource.eid._id
            const startTime = resource && resource.collectTime && resource.collectTime.startTime
            const endTime = resource && resource.collectTime && resource.collectTime.endTime
            let tip = 0
            for (let j = 0; j < pointList.length; j++) {
              const resourcePid = pointList[j] && pointList[j].eid && pointList[j].eid._id
              const startPtime = pointList[j] && pointList[j].collectTime && pointList[j].collectTime.startTime
              const endPtime = pointList[j] && pointList[j].collectTime && pointList[j].collectTime.endTime
              if (resourceId === resourcePid && startTime === startPtime && endTime === endPtime) {
                tip++
                tag++
                break
              }
            }
            if (tip === 0) {
              // 没有一个与当前mapList[i]相等
              break
            }
          }
          if (tag === l) {
            status = true // 禁用
          }
        }
      }
      return status
    }
  },
  watch: {
    previewPointList(val) {
      if (!this.isPlatformTrack) {
        this.pointList = val
      }
    },
    playbackPointList(val) {
      if (this.isPlatformTrack) {
        this.getPlaybackPointList()
      }
    },
    selectBoxSingleData(val) {
      this.singleList = JSON.parse(JSON.stringify(this.selectBoxSingleData))
    },
    activeTab() {
      if (this.activeTab === 'statistics') {
        this.setTopCanvasHeight()
      }
    },
    videoCheckedNumber(val) {
      this.videoCheckedNum = val
    }
  },
  mounted() {
    this.singleList = JSON.parse(JSON.stringify(this.selectBoxSingleData))
    if (this.isPlatformTrack) {
      this.getPlaybackPointList()
    } else if (this.previewPointList && this.previewPointList.length) {
      this.pointList = JSON.parse(JSON.stringify(this.previewPointList))
    }
  }
}
</script>

<style scoped lang="less">
@textleft: 24px;
@topAndBottom: 12px;
.box-choose-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: #1b3153;
  .point-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    .tabs {
      display: flex;
      justify-content: center;
      .tab {
        cursor: pointer;
        width: 20%;
        text-align: center;
        padding: 4px 0;
      }
      .active {
        border-bottom: 1px solid#4699f9;
      }
    }
    .box-style {
      display: flex;
      flex-direction: column;
      flex: 1;
      .ele-wrap {
        flex: 1;
        display: flex;
        padding: 2px 24px;
        .icon-left {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          padding-top: 7%;
          li {
            padding-left: 16px;
            width: 100%;
          }
        }
      }
      .top-canvas-wrap {
        flex: 1;
      }
    }
    .title {
      width: 100%;
      height: 38px;
      line-height: 38px;
      padding: 0 @textleft;
      background: #0f2343;
    }
    ul.point-list {
      padding: 2px @textleft;
      height: 100%;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: auto;
      .cell:nth-child(3n) {
        margin-right: 0;
      }
      .cell:nth-child(27n) {
        margin-bottom: 0;
      }
      .cell-move {
        transition: transform 1s;
      }
      .cell-leave-active {
        position: absolute;
      }
      .cell-leave-to {
        opacity: 0;
      }
      .active-li {
        background: rgb(10, 141, 184);
        color: #1b3153;
      }
      li {
        line-height: 38px;
        text-align: left;
        font-size: 12px;
        border-radius: 4px;
        padding: 0 @topAndBottom;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .icon-qiangji1 {
          font-size: 12px;
        }
        .iconfont.yishoucang {
          background-image: url(../../../../assets/images/collected.png);
          background-repeat: no-repeat;
          background-size: 13px;
          background-position-y: bottom;
          display: inline-block;
          width: 16px;
          height: 14px;
        }
        .context-style {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          line-height: 20px;
          padding-left: 40px;
        }
      }
      li:hover {
        background: lightblue;
        color: #1b3153;
        .icon-qiangji1 {
          font-size: 12px;
        }
      }
      .video-list {
        height: 57px;
        .collect-info {
          float: right;
          line-height: 12px;
          .icon-collection {
            font-size: 12px;
          }
        }
      }
    }
    .tools {
      width: 83.5%;
      margin: 8px auto;
      .ivu-poptip-popper {
        min-width: 69px !important;
      }
      .ivu-btn-group {
        width: 100% !important;
      }
      .ivu-btn-group .ivu-btn {
        padding: 0;
        width: 33.3333333%;
        height: 24px;
      }
    }
    .bottom-btn {
      display: flex;
      background: #1b3153;
      justify-content: space-around;
      padding: 10px 36px;
      button {
        display: flex;
      }
    }
    .notice-msg {
      margin: 10px auto;
    }
  }
}
</style>
