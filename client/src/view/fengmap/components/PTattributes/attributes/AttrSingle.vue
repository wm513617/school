<template>
  <div class="attr-video attr-panel">
    <header>
      <span class="status">
        <Icon type="ios-timer-outline"></Icon>
        <span style="color: green;">{{precentage || 0}}%</span>
      </span>
      <Icon class="btn" type="ios-videocam" @click.native="openVideo" title="视频对讲" style="margin-right: 30px"></Icon>
      <span class="btn iconfont icon-guijifenxi" style="font-size: 20px;margin: -2px 5px 0px 0px;" :class="{'active': isOpenTrack}" @click="changeSingleRealTrackStatus" title="短期轨迹"></span>
      <i class="btn icon iconfont icon-shougongbaojing1" :style="{cursor: showVideo ? 'not-allowed' : 'pointer', marginRight: '10px', 'font-size': '22px'}" @click="openSingleVideo" title="手工报警"></i>
    </header>
    <section class="main">
      <ul class="info-list">
        <li v-if="attrInfo.name">
          <span class="label">姓名</span>
          <span class="value" :title="attrInfo.name">{{attrInfo.name}}</span>
        </li>
        <li v-if="orgName">
          <span class="label">机构</span>
          <span class="value" :title="orgName">{{orgName}}</span>
        </li>
        <li v-if="attrInfo.post">
          <span class="label">职务</span>
          <span class="value" :title="attrInfo.post">{{attrInfo.post}}</span>
        </li>
        <li v-if="attrInfo.jobNum">
          <span class="label">工号</span>
          <span class="value" :title="attrInfo.jobNum">{{attrInfo.jobNum}}</span>
        </li>
        <li v-if="attrInfo.telContacts">
          <span class="label">电话</span>
          <span class="value" style="width: 60%" :title="attrInfo.telContacts">{{attrInfo.telContacts}}</span>
          <Icon class="icon iconfont icon-phone" v-if="attrInfo.telContacts" :title="isCall && selectedMobile === attrInfo.telContacts ? '挂断电话' : '拨打电话'" @click="querySeatList" :style="{cursor: isCall && selectedMobile !== attrInfo.telContacts ? 'not-allowed' : 'pointer'}" :id="attrInfo.telContacts" :class="isCall && selectedMobile === attrInfo.telContacts ? 'icon-guaduan phone-down':'icon-dianhua'"/>
        </li>
      </ul>
      <img :src="imageUrl" :class="{'alarm': attrInfo.timeOut}" @error="imgErr">
    </section>
    <div v-if="videoModal">
      <dragBoxs title="单兵视频" :mask-closable="false" @close="closeSinglePawn" eventType="videospeek">
        <div style="width:700px;height:465px; padding:15px 15px 5px;">
          <SinglePawn ref="singlePawn" :id="singlePawnId" @stopCalling="stopCalling"></SinglePawn>
        </div>
      </dragBoxs>
    </div>
    <div v-if="isToTalk">
      <Talkback :isPcToApp="true" @close="isToTalk = false" :soldierImg="attrInfo.photo" :soldierInfo="singleInfo"></Talkback>
    </div>
  </div>
</template>
<script>
import { getSocket } from 'src/socket/socket.js'
import { read } from 'src/storage/index.js'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import SinglePawn from 'components/video/SinglePawn'
import Talkback from 'components/broadcast/Talkback'
import dragBoxs from 'components/dragx/Dragx.vue'
import AttrInfo from './AttrInfo'
import seatListFun from '../../../panelTools/seatModel/seatListFun'
import { setTimeout } from 'timers'
import { DEFAULTOPS } from 'assets/2DMap/meta/common'
export default {
  mixins: [AttrInfo, seatListFun],
  components: {
    SinglePawn,
    Talkback,
    dragBoxs
  },
  data() {
    return {
      precentage: 0,
      videoModal: false,
      singlePawnId: '',
      replyUser: '', // 接收用户
      showChat: false,
      sendValue: '', // 发送内容
      senderId: read('userId'),
      orgName: '', // 机构名称
      msgArry: [
      ],
      singleData: {
        percent: 0,
        name: '',
        org: '',
        post: '',
        jobNum: '',
        photo: '',
        telContacts: ''
      },
      isSend: false, // 是否发送
      isToTalk: false,
      isImageError: false
    }
  },
  computed: {
    ...mapState({
      showVideo: ({ mapAlarm }) => mapAlarm.showVideo,
      singleTimeoutList: ({ mapAlarm }) => mapAlarm.singleTimeoutList
    }),
    ...mapGetters('fengMapPoint', {
      attrInfo: 'getFengMapResourceAttributes'
    }),
    ...mapGetters(['realSingleMap2D', 'realSingles2D']),
    isOpenTrack() {
      let flag = false
      for (const realSingle of this.realSingles2D) {
        if (this.attrInfo._id === realSingle.id) {
          flag = realSingle.isOpenTrack
          break
        }
      }
      return flag
    },
    singleInfo() {
      return {
        name: this.attrInfo.name,
        org: this.attrInfo.org,
        sn: this.attrInfo.sn,
        id: this.attrInfo._id
      }
    },
    imageUrl() {
      if (this.isImageError || !this.attrInfo.photo) {
        return DEFAULTOPS.singleHeadImg
      } else {
        return this.attrInfo.photo
      }
    }
  },
  watch: {
    attrInfo(val) {
      if (val) {
        console.log('单兵信息：', val)
        for (let i = 0; i < this.singleTimeoutList.length; i++) {
          if (val._id === this.singleTimeoutList[i]._id) {
            this.CHANGE_SINGLE_TIMEOUT_ALARM_STATUS(this.singleTimeoutList[i].timeOut)
          }
        }
        val.org && this.getsinglePawnOrgName(val.org)
        this.msgArry = []
        this.getPatrolUsers().then(res => {
          for (const key in res) {
            const element = res[key]
            if (element._id === this.attrInfo._id) {
              this.precentage = element.precentage
              continue
            }
          }
        })
        // this.singleData = JSON.parse(JSON.stringify(this.attrInfo))
        // this.singlePawn(val)
      }
    }
  },
  methods: {
    imgErr() { // 单兵头像加载失败
      this.isImageError = true
    },
    ...mapActions('fengMapApplyInteractive', ['singleSendMssage']),
    ...mapActions(['getRecordInfo', 'getPatrolUsers', 'changeSingleRealTrackState2D', 'getOrgInfoById']),
    ...mapMutations('mapAlarm', ['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'GET_ALARM_MODAL_TYPE']),
    ...mapMutations(['CHANGE_SINGLE_TIMEOUT_ALARM_STATUS']),
    getsinglePawnOrgName(orgId) { // 获取单兵机构的名称
      let param = {id: orgId}
      this.getOrgInfoById(param).then(res => {
        this.orgName = res.name
      })
    },
    singlePawn(data) {
      this.singleData = JSON.parse(JSON.stringify(this.attrInfo))
      this.getRecordInfo({ id: data._id }).then(suc => {
        this.singleData.percent = suc.data.precentage || ''
      }).catch(err => {
        console.log(err)
      })
    },
    changeSingleRealTrackStatus() { // 改变单兵实时轨迹显示状态
      // this.changeSingleRealTrackState2D(this.attrInfo._id)
      console.log('短期轨迹')
    },
    openVideo() {
      this.videoModal = true
      this.singlePawnId = this.attrInfo._id
    },
    listScroll() {
      if (this.$refs.scroller) {
        this.$refs.scroller.update()
      }
    },
    // 发送消息
    sendMsg() {
      if (this.isSend) { return }
      if (this.sendValue === '' || this.sendValue.replace(/\s+/g, '') === '') {
        this.sendValue = ''
        return this.$Notice.warning({ title: '警告', desc: '消息不能为空' })
      }
      this.isSend = true
      this.singleSendMssage({
        source: 'pc', // 消息来源
        sender: this.senderId, // 消息发送者
        receiver: this.attrInfo._id, // 消息接收者
        playload: this.sendValue // 消息内容
      }).then(() => {
        this.msgArry.push({
          value: this.sendValue,
          isSend: true,
          date: this.$moment(new Date()).format('YYYY-MM-DD-HH:mm:ss')
        })
        this.sendValue = ''
        this.isSend = false
      }).catch(err => {
        this.isSend = false
        this.$Notice.error({ title: '失败', desc: err.response.data.message })
      })
    },
    // 接收消息回调
    receiveMsg(data) {
      if (this.attrInfo._id === data.sender) {
        this.msgArry.push({
          value: data.playload,
          isSend: false,
          date: data.time
        })
      }
    },
    openSingleVideo() {
      if (this.showVideo) { return }
      const info = {
        time: Date.now() / 1000,
        organization: this.orgName,
        name: this.attrInfo.name,
        level: 1,
        eventTypeName: '手工报警',
        actionList: {},
        singlePawnId: this.attrInfo._id,
        isNameDisabled: true,
        alarmaffirm: {
          handaffirm: {
            status: false
          },
          handaffirm2: {
            status: true
          }
        }
      }
      this.CHANGE_SHOWVIDEO(true)
      this.GET_ALARM_MODAL_TYPE('ManualAlarm')
      this.SAVE_ITEM_ALARM_INPUT(info)
    },
    closeSinglePawn() {
      this.$refs.singlePawn.closeVideo()
      setTimeout(() => {
        this.videoModal = false
      }, 0)
    },
    stopCalling() {
      this.$refs.singlePawn.isPlaying = false
    }
  },
  mounted() {
    this.attrInfo.org && this.getsinglePawnOrgName(this.attrInfo.org)
    const socket = getSocket()
    socket.emit('patrol:instant.message', { usrid: read('userId') })
    socket.on('server:instant.message', msg => {
      this.receiveMsg(msg)
    })
    this.getPatrolUsers().then(res => {
      for (const key in res) {
        const element = res[key]
        if (element._id === this.attrInfo._id) {
          this.precentage = element.precentage
          console.log(this.precentage, 'precentage')
          continue
        }
      }
    })
  }
}
</script>
<style lang="less" scoped>
  @import url(./style.less);
  .chat-icon {
    cursor: pointer;
    float: right;
    margin-right: 20px;
  }
  .chatRoom {
    height: 400px;
    padding: 0 10px;
  }
  .send-user {
    text-align: center;
    padding: 10px 0;
    border-bottom: 1px solid #fff;
  }
  .msgDetail {
    width: 70%;
    padding: 10px;
    cursor: pointer;
    float: left;
  }
  .send-msg {
    float: right;
    text-align: right;
    color: #0f0;
    word-break: break-all;
  }
  .send-msg-box {
    display: flex;
  }
  .attr-panel .main {
    min-height: 90px;
  }
  .main {
    position: relative;
  }
  .main .info-list .label{
    width: 15% !important;
  }
  .main .info-list .value{
    width: 50% !important;
  }
  img {
    height: 64px;
    width: 64px;
    border-radius: 50%;
    position: absolute;
    right: 10px;
    top: 10px;
  }
  img.alarm {
    animation: bordertwin 1s 180;
  }
  .alarm-video {
    width: 656px;
    height: 403px;
    text-align: center;
  }
  @keyframes bordertwin {
    0% {
      border: 2px solid transparent;
    }
    25% {
      border: 2px solid red;
    }
    50% {
      border: 2px solid transparent;
    }
    100% {
      border: 2px solid red;
    }
  }
  .icon-phone {
    width: 10%;
    font-size: 12px;
    cursor: pointer;
  }
  .phone-down {
    color: red;
  }
</style>
