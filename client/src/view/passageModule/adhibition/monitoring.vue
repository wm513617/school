<template>
  <div class="monitor">
    <div class="main">
      <div class="main-left">
        <div class="main-left-title">
          <label style="font-size:14px;">机构</label>
          <span class="right"><i class="iconfont icon-refresh" @click="refreshOrg" style="float:right;"></i></span>
        </div>
        <div style="padding: 10px;">
          <Input v-model="searchVal" icon="ios-search-strong" placeholder="请输入..."></Input>
        </div>
        <div class="vtreeBox" style="height: calc(100% - 92px)">
          <!-- <bs-scroll ref="scroller"> -->
          <TreeBox ref="treebox" :searchToggle="false" :searchType="0" :resourceToggle="true" :playingIds="openVideoArray"
                   :equipmentToggle="false" :btnGroup="false" :orgType="11" :resType="[0]" :equType="[0]"
                   @previewData="openPreviewClick" @dbclickData="dblClick" @on-expand="expand"
                   :searchVal="searchVal" @previewAllData="previewAllDataClick"></TreeBox>
          <!-- </bs-scroll> -->
        </div>
      </div>
      <div class="main-con">
        <previewPlugin ref='plugin' :iconShow="videoConfig" @stopBack="stopVideo" @stopPreviewALL="stopPreviewALL" @openBack="openVideoCallback"
                       :panesArr="monitoringPanesArr"></previewPlugin>
        <div class="passNum">

        </div>
      </div>
      <div class="main-right">
        <div class="main-con-title">
          <div class="left">今日报警<span style='font-size: 16px;'>{{alarmTotalCount}}</span>次</div>
          <!--<a class="right">更多 ></a>-->
        </div>
        <div class="right-con">
          <div class="con-item" v-for='(item,index) in blackCurrentListPeoson' :key="index">
            <div class="item-dress"><i class="icon iconfont">&#xe72e;</i>{{item.addressName}}</div>
            <div class="item-con">
              <div class="item-left" @click='contrastDetails(index,item)'>
                <img :src="item.image" alt="">
              </div>
              <div class="item-right">
                <span class="name"><i class="icon iconfont">&#xe771;</i>{{item.name}}</span>
                <span class="type"><i
                  class="icon iconfont">&#xe68b;</i>{{typeof item.org == 'object' ? item.org.name : item.orgName}}</span>
                <span class="time"><i
                  class="icon iconfont">&#xe762;</i>{{new Date(item.createdTimeMs).toLocaleString('chinese', { hour12: false })}}</span>
                <!--<span class="time"><i class="icon iconfont">&#xe762;</i>{{this.$moment(item.eventTime).format('YYYY-MM-DD HH:mm:ss')}}</span>-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="monitor-bottom">
      <div class="bottom-left">
        <!--@mousedown="mouseScrollDown" @mouseup="mouseScrollUp"-->
        <div class="img-box" ref="ismouseDownCurse"
             @mousemove="mouseScrollMove">
          <div class="image" v-for='(item,index) in whiteCurrentListPeoson' @click='captureDetails(index,item)' :key="index">
            <div class="title dress">{{item.addressName}}</div>
            <div style="width:100%;height:100%;position:absolute;top:0;left:0">
              <img :src="item.image" alt="">
            </div>
            <div class="title name">{{item.name}}</div>
          </div>
        </div>
      </div>
      <!--<div class="bottom-right">-->
        <!--&lt;!&ndash;<div class="img-box" ref="ismouseDownCurseRight" @mousedown="mouseScrollDown" @mouseup="mouseScrollUp" @mousemove="mouseScrollMove">&ndash;&gt;-->
        <!--&lt;!&ndash;<div class="image" v-for='(item,index) in whiteCurrentListPeoson' @click='captureDetails(index,item)'   >&ndash;&gt;-->
        <!--&lt;!&ndash;<div class="title dress">{{item.addressName}}</div>&ndash;&gt;-->
        <!--&lt;!&ndash;<div style="width:100%;height:100%;position:absolute;top:0;left:0" >&ndash;&gt;-->
        <!--&lt;!&ndash;<img :src="item.image" alt=""   >&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--&lt;!&ndash;<div class="title name">{{item.name}}</div>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--</div>-->
    </div>
    <!--    <iframe src="" frameborder="0">-->

    <!--    </iframe>-->

    <bs-modal v-model="modal1" title="事件详情" :width="'50%'" class="focus" :closable='false' :mask-closable="false"
              @on-ok="focusSave" @on-cancel="focusClose">
      <iframe v-if="modal1"></iframe>
      <div style="position:relative" v-if="modelVideoMsg">
        <div class="model-main" >
          <div class="main-left">
            <div class="row">
              <i class="icon iconfont">&#xe72e;</i>
              <span>{{modelVideoMsg.addressName}}</span>
            </div>
            <div class="row" style='width: 110px; height: 140px;background:#ccc;padding:0;margin-bottom:15px;'>
              <!--              <img v-if="whiteCurrentListPeoson[this.passagePeosonIndex.left]" :src="whiteCurrentListPeoson[this.passagePeosonIndex.left].user.image" alt="" style="width: 100%;height: 100%">-->
              <!--              <div style="position:absolute;right:10px;bottom:10px">-->
              <!--                <i class="icon iconfont icon-enlarge" style="cursor: pointer"></i>-->
              <!--              </div>-->

              <picturePreview
                              :url="modelVideoMsg.image"
                              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
                              :isBodyShow="false"
                              @preview_x="isPreviewFuc"

              ></picturePreview>
            </div>
            <div class="row">
              <label for="">认证方式：</label>
              <span>{{modelVideoMsg.validator}}</span>
            </div>
            <div class="row">
              <label for="">时间：</label>
              <span
                 >{{$moment(new Date(modelVideoMsg.createdTimeMs)).format('YYYY-MM-DD hh:mm:ss')}}</span>
            </div>
            <div class="row">
              <label for="">姓名：</label>
              <span>{{modelVideoMsg.name}}</span>
            </div>
            <div class="row">
              <label for="">性别：</label>
              <span>{{modelVideoMsg.sex === 1 ? '男' : (modelVideoMsg.sex === 2 ?'女' : '')}}</span>
            </div>
            <div class="row">
              <label for="">手机号码：</label>
              <span>{{modelVideoMsg.phone}}</span>
            </div>
            <div class="row">
              <label for="">人员卡号：</label>
              <span>{{modelVideoMsg.card}}</span>
            </div>
            <div class="row">
              <label for="">人员编码：</label>
              <span>{{modelVideoMsg.uid}}</span>
            </div>
            <div class="row">
              <label for="">所属组织：</label>
              <span>{{modelVideoMsg.org ? modelVideoMsg.org.name : ''}}</span>
            </div>
          </div>
          <div class="main-right">
            <div v-show="backVidowShow" style="width: 100%;height:100%;">
              <playback-plugin :configuration="configuration" :defaultPane='number1'
                               ref="pluginChildrenMonitoring"></playback-plugin>
            </div>

          </div>
        </div>
      </div>

    </bs-modal>
    <bs-modal v-model="modal2" title="事件详情" :width="'50%'" class="focus" :closable='false' :mask-closable="false"
              @on-ok="focusSave" @on-cancel="focusClose">
      <div class="model-main" v-if="modelVideoMsg">
        <div class="main-left">
          <div class="dress">
            <i class="icon iconfont">&#xe72e;</i>{{modelVideoMsg.addressName}}
          </div>
          <div class="contrast">
            <div>
              <picturePreview
                              :url="modelVideoMsg.image"
                              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
                              :isBodyShow="false"
                              @preview_x="isPreviewFuc"

              ></picturePreview>
            </div>
            <div>
              <picturePreview v-if="modelVideoMsg.right"
                              :url="modelVideoMsg.image"
                              :imgStyle="{
                              width:'100%',
                              height:'100%'
                              }"
                              :isBodyShow="false"
                              @preview_x="isPreviewFuc"

              ></picturePreview>
            </div>
          </div>
          <div class="row">
            <label for="">验证方式：</label>
            <span>{{modelVideoMsg.validator}}</span>
          </div>
          <div class="row">
            <label for="">人员卡号：</label>
            <span>{{modelVideoMsg.card}}</span>
          </div>
          <div class="row">
            <label for="">时间：</label>
            <!--<span>{{blackCurrentListPeoson[passagePeosonIndex.right].date}}</span>-->
            <span>{{$moment(new Date(modelVideoMsg.createdTimeMs)).format('YYYY-MM-DD hh:mm:ss')}}</span>
          </div>
          <div class="row">
            <label for="">人员编码：</label>
            <span>{{modelVideoMsg.uid}}</span>
          </div>
          <div class="row">
            <label for="">姓名：</label>
            <span>{{modelVideoMsg.name}}</span>
          </div>
          <div class="row">
            <label for="">人员类型</label>
            <span>{{modelVideoMsg.type === 2 ?'白名单': (modelVideoMsg.type === 1 ? '灰名单':'黑名单')}}</span>
          </div>
          <div class="row">
            <label for="">性别：</label>
            <span>{{modelVideoMsg.sex === 2 ? '女' : (modelVideoMsg.sex === 1 ? '男' : '')}}</span>
          </div>
          <div class="row">
            <label for="">所属组织：</label>
            <span>{{modelVideoMsg.org ? modelVideoMsg.org.name : ''}}</span>
          </div>
          <div class="row">
            <label for="">手机号码：</label>
            <span>{{modelVideoMsg.phone}}</span>
          </div>
        </div>
        <div class="main-right">
          <div v-show="backVidowShow" style="width: 100%;height:100%;">
            <playback-plugin :configuration="configuration" :defaultPane='number1'
                             ref="pluginChildrenMonitoringBlack"></playback-plugin>
          </div>
        </div>
        <!--<div class="main-bottom">-->
        <!--</div>-->
      </div>
    </bs-modal>

  </div>
</template>
<script>
import TreeBox from '../../../components/BStreeNew/BStreeNewBox'
import playbackPlugin from '../../../components/videoComponentsNew/playbackPlugin'
import previewPlugin from '../../../components/videoComponentsNew/previewPlugin'
import picturePreview from '../picturePreview'
import {mapState, mapActions, mapGetters} from 'vuex'

export default {
  components: {
    TreeBox,
    previewPlugin,
    picturePreview,
    playbackPlugin
  },
  data() {
    return {
      modelVideoMsg: '', // 弹出框信息
      backVidowShow: true,
      number1: 1,
      configuration: {
        progressBar: {
          totalTime: true
        },
        timeline: false,
        buttos: ['stopAll']
      },
      openVideoArray: [], // 记录已开流成功的的通道id;
      timer: '',
      mouseCurse: false, // 判断鼠标按下和click 事件
      isScroll: false, // 是否可以移动
      scrollBottomLeft: null, // 左下角滚动条
      scrollBottomRight: null, // 右下角滚动条
      scrollBottomLeftMouse: null, // 左下角滚动条

      modal1: false,
      modal2: false,
      passagePeosonIndex: { // 点击底部照片的index
        left: 0,
        right: 0
      },
      searchVal: '',
      expand: '',
      checksData: [],
      videoConfig: {
        stopAll: true,
        stop: true,
        screenshot: true,
        speech: true,
        volume: true,
        fullScreen: true,
        multiScreen: true
      },
      monitoringPanesArr: [
        {value: 1, label: '单画面'},
        {value: 4, label: '四画面'},
        // { value: 5, label: '五画面' },
        {value: 9, label: '九画面'},
        {value: 16, label: '十六画面'}
      ]
    }
  },
  computed: {
    ...mapState(
      {
        whiteCurrentListPeoson: ({monitoringStatus}) => monitoringStatus.whiteCurrentListPeoson,
        blackCurrentListPeoson: ({monitoringStatus}) => monitoringStatus.blackCurrentListPeoson,
        // grayCurrentListPeoson: ({monitoringStatus}) => monitoringStatus.grayCurrentListPeoson,
        alarmTotalCount: ({monitoringStatus}) => monitoringStatus.alarmTotalCount

      }
    ),
    ...mapGetters(['accessToken']),
    backVidowShow_: function() {
      return this.backVidowShow
    }
  },
  methods: {
    ...mapActions([
      'currentNewList',
      'getSocketList', // socket实时获取数据
      'findVieoMessage',
      'dataSocket',
      'refreshToken',
      'closeSocket'

    ]),
    isPreviewFuc(event) {
      // this.$refs.pluginChildrenMonitoring.stop(undefined,true)
      this.backVidowShow = event

      console.log(this.backVidowShow)
    },
    focusClose() {
      this.modal1 = false
      this.modal2 = false
      this.modelVideoMsg = ''
    },
    focusSave() {
      this.modal1 = false
      this.modal2 = false
      this.modelVideoMsg = ''
    },
    captureDetails(index, item) {
      this.modelVideoMsg = JSON.parse(JSON.stringify(item))
      //        this.refreshToken().then(res=>{
      //          let token = res.data.token;
      //          let str = item.currentUrl;
      //          let i = str.lastIndexOf('/');
      //          let src = str.substring(0,i)
      //          let srcUrl = src+'/'+token;
      //          this.modelVideoMsg.currentUrl = srcUrl;
      //        });
      let firstList = []
      // clearTimeout(this.timer)
      //    this.isScroll = false //不能在滚动了
      //        if (this.mouseCurse) {
      //
      //        } else {
      //          this.modal1 = true;
      //          this.passagePeosonIndex.left = index;
      //          this.passagePeosonIndex.right = index;
      //          this.mouseCurse = false
      //
      //        }

      this.modal1 = true
      //        this.passagePeosonIndex.left = index;
      //        this.passagePeosonIndex.right = index;
      //        this.mouseCurse = false
      let cameraId = item.camera
      let that = this
      this.findVieoMessage({camera: cameraId}).then(res => {
        // 把参数发送给视频组件
        firstList.push({
          channel: res.data[0].chan,
          startTime: Math.floor(item.createdTimeMs / 1000) - 60,
          endTime: Math.floor(item.createdTimeMs / 1000) + 60,
          devIp: res.data[0].ip,
          name: res.data[0].name,
          devPort: res.data[0].port,
          streamType: 'main',
          resId: cameraId[0]
        })
        console.log(firstList[0].endTime - firstList[0].startTime)
        that.$refs.pluginChildrenMonitoring.openPlayback(firstList)
      })
    },
    contrastDetails(index, item) {
      let firstList = []
      this.modal2 = true
      let cameraId = item.camera
      this.modelVideoMsg = JSON.parse(JSON.stringify(item))
      let that = this
      this.findVieoMessage({camera: cameraId}).then(res => {
        // 把参数发送给视频组件
        firstList.push({
          channel: res.data[0].chan,
          startTime: Math.floor(item.createdTimeMs / 1000) - 60,
          endTime: Math.floor(item.createdTimeMs / 1000) + 60,
          devIp: res.data[0].ip,
          name: res.data[0].name,
          devPort: res.data[0].port,
          streamType: 'main',
          resId: cameraId[0]
        })
        console.log(firstList[0].endTime - firstList[0].startTime)
        that.$refs.pluginChildrenMonitoringBlack.openPlayback(firstList)
      })
    },
    // 刷新机构树
    refreshOrg() {
    },
    handlePreview() {
    },
    allPreview() {
    },
    openPreviewClick(item) {
      const data = {
        devIp: item.eid.ip,
        devPort: item.eid.cport,
        channel: item.chan,
        streamType: item.stream,
        resId: item._id
      }
      this.$refs.plugin.openPreview(data)
    },
    previewAllDataClick(value) {
      let arr = value.children
      arr.map(item => {
        const data = {
          devIp: item.eid.ip,
          devPort: item.eid.cport,
          channel: item.chan,
          streamType: item.stream,
          resId: item._id
        }
        this.$refs.plugin.openPreview(data)
      })
    },
    dblClick(item) {
      const data = {
        devIp: item.eid.ip,
        devPort: item.eid.cport,
        channel: item.chan,
        streamType: item.stream,
        resId: item._id
      }
      this.$refs.plugin.openPreview(data)
    },
    // 关闭所有预览
    stopPreviewALL(e) {
      this.openVideoArray = []
    },
    // 关闭视频回调
    stopVideo(event) {
      this.closeSocket()
      for (var i = 0; i < this.openVideoArray.length; i++) {
        if (this.openVideoArray[i] === event.resId) {
          this.openVideoArray.splice(i, 1)
          this.dataSocket(this.openVideoArray)
          break // id可能重复，删除掉一个后跳出循环
        }
      }
    },
    // 开流后的回调
    openVideoCallback(event) {
      this.openVideoArray.push(event.resId)
      this.dataSocket(this.openVideoArray)
    },
    // 底部相册鼠标按下时
    mouseScrollDown(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.mouseCurse = true
      }, 200)
      // console.log(e)
      if (
        e.target.parentElement.parentElement.parentElement.parentElement.className === 'bottom-left' || e.target.parentElement.parentElement.parentElement.className === 'bottom-left' || e.target.parentElement.parentElement.className === 'bottom-left' ||
          e.target.parentElement.className === 'bottom-left'
      ) {
        this.scrollBottomLeft = this.$refs.ismouseDownCurse.scrollLeft
      } else if (
        e.target.parentElement.parentElement.parentElement.parentElement.className === 'bottom-right' || e.target.parentElement.parentElement.parentElement.className === 'bottom-right' || e.target.parentElement.parentElement.className === 'bottom-right' ||
          e.target.parentElement.className === 'bottom-right'
      ) {
        this.scrollBottomRight = this.$refs.ismouseDownCurseRight.scrollLeft
      }
      this.scrollBottomLeftMouse = e.clientX
      this.isScroll = true
      this.mouseCurse = false
    },
    // 鼠标移动时
    mouseScrollMove(e) {
      if (this.isScroll) {
        if (this.scrollBottomLeft > -1) {
          if (

            e.target.parentElement.parentElement.parentElement.parentElement.className === 'bottom-left' || e.target.parentElement.parentElement.parentElement.className === 'bottom-left' || e.target.parentElement.parentElement.className === 'bottom-left' ||
              e.target.parentElement.className === 'bottom-left'
          ) {
            this.$refs.ismouseDownCurse.scrollLeft = this.scrollBottomLeft - (e.clientX - this.scrollBottomLeftMouse)
          } else if (
            e.target.parentElement.parentElement.parentElement.parentElement.className === 'bottom-right' || e.target.parentElement.parentElement.parentElement.className === 'bottom-right' || e.target.parentElement.parentElement.className === 'bottom-right' ||
              e.target.parentElement.className === 'bottom-right'
          ) {
            this.$refs.ismouseDownCurseRight.scrollLeft =
                this.scrollBottomRight - (e.clientX - this.scrollBottomLeftMouse)
          }
        } else {

        }
      }
      // console.log(this.$refs.ismouseDownCurse.scrollLeft)
    },
    // 底部相册鼠标抬起时
    mouseScrollUp() {
      this.isScroll = false
    }
  },
  created() {
    this.currentNewList({size: 16}).then(res => {
      if (res) {
        console.log(res)
      }
    })
  },
  mounted() {
    // 页面加载后websocket 监听启动
    this.getSocketList([]).then(res => {

    })
  },
  destroyed() {
    this.dataSocket([])
    this.closeSocket()
  }
}
</script>

<style lang='less' scoped>
  ::-webkit-scrollbar-thumb {
    /*background: none;*/
  }

  ::-webkit-scrollbar {
    background: none;
  }

  .monitor {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 16px 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    flex-direction: column;
    .main {
      flex: 1;
      display: flex;
      .main-left {
        width: 272px;
        height: 100%;
        margin-right: 16px;
        background: #1b3153;
        .main-left-title {
          width: 100%;
          height: 38px;
          padding: 0 20px;
          background: #0f2243;
          text-align: center;
          line-height: 38px;
          font-size: 14px;
        }
      }
      .main-con {
        flex: 1;
        background: #1b3153;
      }
      .main-right {
        width: 402px;
        height: 100%;
        margin-left: 16px;
        background: #1b3153;
        .main-con-title {
          width: 100%;
          height: 38px;
          background: #0f2243;
          padding: 0 20px;
          line-height: 38px;
          .left {
            float: left;
            color: #fff;
            span {
              color: #449cf6;
              padding: 0 5px;
            }
          }
          .right {
            float: right;
            color: #fff;
          }
          .right:hover {
            color: #449cf6;
          }
        }
        .right-con {
          width: 100%;
          height: ~'calc(100% - 38px)';
          padding: 10px;
          overflow-y: auto;
          .con-item {
            width: 100%;
            height: 180px;
            border: 1px solid #449cf6;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            i {
              padding: 0 10px;
            }
            .item-dress {
              width: 100%;
              padding: 10px 20px;
            }
            .item-con {
              flex: 1;
              display: flex;
              .item-left {
                width: 150px;
                height: 100%;
                padding: 8px 24px;
                // background: #ccc;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              .item-right {
                flex: 1;
                span {
                  display: block;
                  width: 100%;
                  padding: 8px;
                  padding-left: 10px;
                }
              }
            }
          }
        }
      }
    }
    .monitor-bottom {
      height: 150px;
      width: 100%;
      margin-top: 16px;
      display: flex;
      .bottom-left {
        flex: 1;
        margin-right: 16px;
        background: #1b3153;

        position: relative;
      }
      .img-box {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        position: absolute;
        white-space: nowrap;
        cursor: pointer;
        height: 100%;
        padding: 8px;
      }
      .bottom-right {
        flex: 1;
        background: #1b3153;
        overflow-x: auto;
        position: relative;
      }
      .image {
        width: 115px;
        height: 100%;
        background: #ccc;

        display: inline-block;
        margin: 0 5px;
        position: relative;
        .title {
          position: absolute;
          width: 100%;
          z-index: 10;
          height: 15px;
          text-align: center;
          line-height: 15px;
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0.5;
        }
        .dress {
          top: 0;
        }
        .name {
          bottom: 0;
        }
        img {
          width: 115px;
          height: 100%;
        }
      }
    }
  }

  .ivu-modal-body .model-main {
    width: 100%;
    height: 470px;
    display: flex;
    .main-left {
      width: 250px;
      float: left;
      padding-right: 10px;
      .contrast {
        width: 100%;
        height: 150px;
        display: flex;
        padding-bottom: 10px;
        justify-content: space-between;
        div {
          width: 48%;
          height: 100%;
        }
        img {
          width: 45%;
          height: 100%;
        }
      }
    }
    .main-right {
     // width: 570px;
      //height: 300px;
      flex: 1;
      background: #ccc;
      // float: left;
    }
    .row {
      padding-bottom: 15px;
      label {
        width: 100px;
        display: inline-block;
      }
    }
  }

  .ivu-modal-body .model2-main {
    width: 100%;
    height: 550px;
    .dress {
      width: 100%;
      padding-bottom: 15px;
    }
    .main-top {
      width: 100%;
      height: 400px;
      .main-image {
        width: 250px;
        height: 100%;
        float: left;
        .contrast {
          width: 100%;
          height: 150px;
          display: flex;
          div {
            width: 100%;
            height: 100%;
          }
          img {
            width: 50%;
            height: 100%;
          }
        }
        .image {
          width: 100%;
          height: 250px;
          background: red;
        }
      }
      .main-video {
        float: left;
        width: 570px;
        height: 100%;
        background: #ccc;
      }
    }
    .main-bottom {
      .row {
        float: left;
        width: 50%;
        padding-bottom: 15px;
        label {
          width: 100px;
          display: inline-block;
        }
      }
    }
  }

  .mouseDownCurse {
    cursor: grab !important;
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
</style>
