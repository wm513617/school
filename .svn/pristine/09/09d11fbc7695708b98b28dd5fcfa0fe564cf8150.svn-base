<template>
  <div class="patrol-alarm">
    <div class="alarm-header">
      <h3 class="header">单兵报警</h3>
      <div class="alarm-select">
        <Select v-model="alarmSelect" size="small" style="">
          <Option v-for="item in alarmSelectList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </div>
    <div class="patrol-title" v-if="conversationList.length > 0 ? true: false">
      <div class="title-tabs">
        <span v-for="(tab, index) in titleTabs" class="tabNormal" @click="tabClick(tab, index)" :key="index" :class="{ tabActive:tab.active }">{{tab.title}}</span>
      </div>
    </div>
    <bs-scroll ref="scroller" style="height: calc(100% - 59px);">
      <!-- 巡更报警信息列表@click="changeAlarmList(items)" -->
      <div class="patrol-main" v-if="titleTabs[0].active">
        <div v-for="(items, indexs) in totalAlarmList" class="outer-layer" style="border-radius: 4px;" :key="indexs" >
          <div class="patrol-left" v-if="items.alarmTypeToMap === 'patrolAlarm'">
            <!--消息主体-->
            <div style="float:left;width:76%;height:100%;cursor:pointer" @click="messageMain(items)">
              <p style="float:left">
                <span><i class="font-common icon iconfont icon-fenlei"></i>{{items.type}}</span>
              </p>
              <p>
                <span style="width:42%"><i class="font-common icon iconfont icon-admin"></i>
                  <span class="senderMes" :title="items.message.sender">{{items.message.sender}}</span>
                </span>
              </p>
              <p>
                <span style="width:42%"><i class="font-common icon iconfont icon-Location"></i>
                  <span class="senderMes" :title="items.message.position" style="width: 140px">{{items.message.position}}</span>
                </span>
              </p>
              <p>
                <span><i class="font-common icon iconfont icon-shijian"></i>{{items.message.time}}</span>
              </p>
            </div>
            <div style="float:left">
              <p style="width:24%;height:77px;line-height:60px;margin:9px 0;border-left:1px solid #6f7d92">
                <span class="alarm-flashing icon iconfont animation-flicker-red" :class="items.msgType ? 'icon-repair': ''" @click="deal(items)"></span>
              </p>
            </div>
          </div>
          <div class="single-alarm-li" v-if="items.alarmTypeToMap === 'singleAlarm' || items.alarmTypeToMap === 'generalMsg'">
            <div @click="messageMain(items)" style="cursor: pointer;">
              <div class="left-img"><img class="user-img" :src="items.photo ? items.photo : soliderImg"  alt="加载失败" title="用户头像"></div>
              <ul class="left-ul">
                  <li title="报警分类"><i class="icon iconfont icon-fenlei"></i> <span>{{items.type}}</span></li>
                  <!-- <li title="联系电话"><i class="iconfont icon-dianhua default-size"></i> {{items.phone}}</li> -->
                  <li title="用户名称" class="left-li"><i class="iconfont icon-admin default-size"></i> <span>{{items.realname || items.sender}}</span></li>
                  <!-- <li title="任务完成百分比"><i class="iconfont icon-jindu" style="font-size:13px;"></i> {{items.precentage || '0%'}}</li> -->
                  <li class="left-li" :title="(items.date || items.time)"><i class="icon iconfont icon-shijian" style="font-size:13px;"></i> <span>{{items.date || items.time}}</span> </li>
              </ul>
            </div>
            <div class="right-btn">
                <i class="iconfont icon-baojing1 iconfont-btn animation-flicker-red" v-if="items.isAlarm" @click="videoCall(items)"></i>
                <i class="iconfont icon-xiaoxi1 iconfont-btn" v-else @click="viewMsg(items)"></i>
            </div>
          </div>
          <div v-if="items.alarmTypeToMap === 'talkAlarm'">
            <div style="cursor: pointer;">
              <div class="left-img"><img class="user-img" :src="items.photo ? items.photo : soliderImg"  alt="加载失败" title="用户头像"></div>
              <ul class="left-ul">
                  <li title="报警分类"><i class="icon iconfont icon-fenlei"></i> <span>{{items.type}}</span></li>
                  <li title="用户名称" class="left-li"><i class="iconfont icon-admin default-size"></i> <span>{{items.realname}}</span></li>
                  <li class="left-li" :title="items.time"><i class="icon iconfont icon-shijian" style="font-size:13px;"></i> <span>{{items.time}}</span> </li>
              </ul>
            </div>
            <div class="right-btn">
                <i class="iconfont icon-dianhua animation-flicker-green" @click="talkClick(items)" v-if="!isTalkStatus"></i>
                <i class="iconfont icon-dianhua animation-flicker-red" @click="talkClick(items)" v-else></i>
            </div>
          </div>
        </div>
      </div>
    </bs-scroll>
    <dragBoxs :modal="showAlarmModel" title="消息详情" @close="showAlarmModel=false" :isShowZoom="false">
     <!-- 消息详情 -->
     <div slot="context" class="alarm-inner">
       <div class="inner-left">
         <p class="inner-top">{{msgDetail.title}}</p>
         <PatrolVideo :width="350" :height="240" :type="patrolVideoParam.type" :url="patrolVideoParam.url"></PatrolVideo>
       </div>
       <div class="inner-right">
         <div class="inner-top">
           <div class="alarm-type"><i class='iconfont icon-fenlei' style="font-size:17px;"></i>分类： {{msgDetail.type}}</div>
           <div><i class="iconfont icon-shijian" style="font-size:17px;"></i> {{msgDetail.date}}</div>
         </div>
         <p class="inner-right-des">
           {{msgDetail.content}}
         </p>
       </div>
     </div>
     <div slot="footer">
       <div v-if="!showAlarmCall" style="text-align: center;margin-top: 10px;">
         <Button class="footer-btn" type="info" @click="confirmAlarmMsg(msgDetail.uniqueId, true)">取消</Button>
         <Button class="footer-btn" type="primary" @click="replyMsg">回复</Button>
       </div>
      </div>
   </dragBoxs>
   <msgModal :isShowMsgModal="isRelyModal" :replyUser="replyUser" @pointAlarmModal="pointAlarmChange" @senderSuccess="isSenderSuccess"></msgModal>
   <!-- <Talkback v-if="isTalkModal" :isPcToApp="false" :soldierInfo="intercomInfo" @close="talkCloseClick"></Talkback> -->
  </div>
</template>

<script>
import alarm from 'src/socket/alarm.js'
import moment from 'moment'
import msgModal from './IndividualChildren/messageReply.vue'
import confirmAlarmFun from '../../alarmFun/confirmAlarmFun.vue'
import PatrolVideo from 'components/video/PatrolVideo.vue'
// import mapApi from 'assets/3DMap/utils'
import dragBoxs from 'components/DragBoxs'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import noSoliderImg from '../../../../../static/noSolider.jpg'
export default {
  components: {
    msgModal,
    PatrolVideo,
    dragBoxs
  },
  mixins: [confirmAlarmFun],
  data() {
    return {
      showType: '',
      videoUrl: '',
      isShowMsgModal: false,
      replyUser: {
        realName: '',
        userId: ''
      },
      pointAlarm: false,
      pointAlarmData: {
        sponsor: '',
        patrolPoint: '',
        title: '',
        details: '',
        selectionPlan: '',
        remarks: '',
        pointLeader: '',
        phoneNumber: '',
        planName: '',
        date: ''
      },
      plansData: [],
      repairInfor: false,
      isDisableCancel: false,
      currDealId: '',
      msgModelType: 2, // 消息回复
      showAlarmModel: false, // 报警弹出框
      showNewsReply: false, // 消息回复
      showAlarmCall: false, // 视频通话
      videoTape: true, // 录像
      msgDetail: {},
      alarmDetail: {},
      spliceAlarm: '', // 保证弹窗关闭在删除消息
      isSingleAlarm: false, // 回复组件使用
      alarmSelectList: [{
        label: '全部',
        value: 'all'
      }, {
        label: '单兵一键报警',
        value: 'oneAlarm'
      }, {
        label: '巡更异常上报',
        value: 'unusualAlarm'
      }, {
        label: '对讲请求',
        value: 'intercomRequest'
      }, {
        label: '常规信息',
        value: 'regularAlarm'
      }],
      alarmSelect: 'all',
      isReplyMsg: false,
      titleTabs: [
        {
          title: '报警',
          active: true
        },
        {
          title: '会话',
          active: false
        }
      ],
      list: [],
      conversationList: [], // 会话列表
      msgUniqueId: false,
      modalType: '', // 弹框类型
      soliderImg: noSoliderImg,
      isTalkStatus: false
    }
  },
  computed: {
    ...mapGetters('patrol2DAlarm', ['singleAllList']),
    ...mapState({
      isRelyModal: ({ patrol2DAlarm }) => patrol2DAlarm.isRelyModal,
      singleAlarmData: ({ patrol2DAlarm }) => patrol2DAlarm.singleAlarmData,
      alarmType: ({ patrol2DAlarm }) => patrol2DAlarm.alarmType,
      patrolShow: ({ patrolAlarm }) => patrolAlarm.patrolShow,
      isAlarmSingle: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.filterState.isAlarmSingle,
      patrolId: ({ patrol2DAlarm }) => patrol2DAlarm.patrolId,
      singleId: ({ patrol2DAlarm }) => patrol2DAlarm.singleId,
      singleAlarmInDatabase: ({ patrol2DAlarm }) => patrol2DAlarm.singleAlarmInDatabase, // 从数据库中获取的报警数据
      modalStatus: ({ patrol2DAlarm }) => patrol2DAlarm.modalStatus
      // isTalkStatus: ({ patrol2DAlarm }) => patrol2DAlarm.isTalkStatus
    }),
    totalAlarmList() {
      let filterList = []
      if (this.singleAllList.length > 0) {
        switch (this.alarmSelect) {
          case 'all':
            filterList = JSON.parse(JSON.stringify(this.singleAllList.slice(0, 21)))
            break
          case 'oneAlarm':
            filterList = this.singleAllList.filter(item => {
              return item.type === '单兵一键报警'
            }).slice(0, 21)
            break
          case 'unusualAlarm':
            filterList = this.singleAllList.filter(item => {
              return item.type === '巡更异常上报'
            }).slice(0, 21)
            break
          case 'intercomRequest':
            filterList = this.singleAllList.filter(item => {
              return item.type === '视频对讲请求'
            }).slice(0, 21)
            break
          case 'regularAlarm':
            filterList = this.singleAllList.filter(item => {
              return item.type === '常规消息'
            }).slice(0, 21)
            break
        }
      }
      return filterList
    },
    patrolVideoParam() {
      return {
        url: this.msgDetail.picture ? this.msgDetail.picture : this.msgDetail.video,
        type: this.msgDetail.picture ? 'image' : 'video'
      }
    }
  },
  watch: {
    showNewsReply(val) {
      if (!val) {
        this.msgDetail = {}
      }
    },
    totalAlarmList: {
      handler: function(val) {
        if (val.length !== 0) {
          this.$emit('isUnread', true)
        } else {
          this.$emit('isUnread', false)
        }
      },
      deep: true
    },
    patrolId: {
      handler: function(val) {
        if (val) {
          for (let i = 0; i < this.list.length; i++) {
            if (val === this.list[i].uniqueId) {
              this.list.splice(i, 1)
            }
          }
        }
      },
      immediate: true
    },
    singleAllList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal.length >= 20) {
        const payload = {
          limit: 30,
          map: '2D',
          type: 'single',
          param: {
            flag: true,
            single: true,
            patrol: true,
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'IndividualPolice', payload})
      }
    }
  },
  created() {
    this.bindSocket()
    this.listScroll()
  },
  mounted() {},
  methods: {
    ...mapActions(['confirmAlarms', 'getPrearranged', 'nearestSingle', 'emergencyAction', 'confirmSingle', 'nearestSingle']),
    ...mapActions('fengMapApplyInteractive', ['changeOpenAlarmPanel']),
    ...mapActions('mapAlarm', ['getMapAlarmList']),
    ...mapMutations('patrol2DAlarm', ['SAVE_PATROL_LIST', 'GET_PATROL_TYPE', 'SAVE_PATROL_STUATES', 'SAVE_PATROL_DATA', 'SAVE_SINGLE_DATA', 'SAVE_ALL_LIST', 'SAVE_ALARM_TYPE', 'SAVE_PATROL_RELY_STUATES', 'SET_SINGLE_TOTAL', 'SAVE_PATROL_ID', 'SAVE_TALK_DATA']),
    ...mapMutations('mapAlarm', ['SET_ALARM_NEW_ONE', 'SET_CONFIRMED_NEW_ALARM', 'SET_ACTIVE_ALARM_INFO']),
    expand() {
      this.$refs.scroller.update()
    },
    tabClick(obj, index) {
      for (let tab of this.titleTabs) {
        tab.active = false
      }
      obj.active = true
    },
    // 查看消息
    viewMsg(obj) {
      if (this.patrolShow) {
        return
      }
      this.msgDetail = obj
      this.showAlarmModel = true
      this.showAlarmCall = false
      this.showNewsReply = false
      this.replyUser.realName = obj.sender
      this.replyUser.userId = obj.senderId
      this.showType = ''
      this.videoUrl = ''
    },
    // 一键报警
    videoCall(obj) {
      if (this.modalStatus) {
        return
      }
      this.SET_ACTIVE_ALARM_INFO(obj)
      this.alarmDetail = obj
      // this.showAlarmModel = true
      this.showAlarmCall = true
      this.GET_PATROL_TYPE('AttrSinglePawn')
      this.SAVE_PATROL_STUATES(true)
      this.changeOpenAlarmPanel(true)
      this.SAVE_SINGLE_DATA(obj)
      this.emergencyAction({ planId: '17' })
    },
    // 回复消息
    replyMsg(data) {
      this.msgModelType = 2
      this.isSingleAlarm = true
      this.showNewsReply = true
      this.showAlarmModel = false
      this.isReplyMsg = true
      this.modalType = 'msg'
      this.SAVE_PATROL_RELY_STUATES(true)
    },
    // 确认取消消息报警
    confirmAlarmMsg(uniqueId, isMsg) {
      this.msgUniqueId = uniqueId
      this.SAVE_ALARM_TYPE('msgData')
      if (isMsg) {
        this.showAlarmModel = false
      }
      this.confirmSingle(uniqueId).then(() => {
        if (!isMsg) {
          this.isStopCall = true
        }
        this.SAVE_PATROL_ID({uniqueId: uniqueId})
        this.successMsg('报警确认成功')
        // this.confirmAlarmData(true, uniqueId, '', 'singleAlarm') // 取消地图点位闪烁
      }).catch(err => {
        // this.errorMsg(err.response.data.message)
        console.log(err)
      })
    },
    /**
     * 接收巡更报警
     */
    receivePatrolAlarm(data) {
      console.log(data, '接收一条新报警/新报修信息')
      let result = {}
      if (data.map2D) {
        if (!this.isAlarmSingle.checked) { return }
        if (this.isAlarmSingle.alarmPatrol) {
          result = {
            isType: true,
            type: '巡更异常上报',
            alarmTypeToMap: 'patrolAlarm',
            message: {
              ...data.message,
              time: moment(data.message.date * 1000).format('YYYY-MM-DD') + ' ' + data.message.moment
            },
            msgType: data.message.type,
            uniqueId: data.uniqueId,
            _id: data._id || data.uid,
            map2D: data.map2D,
            devName: data.devName
          }
          this.SET_ALARM_NEW_ONE(result)
          this.receiveAlarmList(result)
        }
      }
    },
    // 接收单兵报警
    receiveSingleAlarm(data) {
      console.log('单兵一键报警', data)
      if (!this.isAlarmSingle.checked) { return }
      if (this.isAlarmSingle.singleOneKey) {
        data.isAlarm = true
        data.isType = false
        data.type = '单兵一键报警'
        data.alarmTypeToMap = 'singleAlarm'
        data.date = data.time
        data.map3D = data.point ? data.point : ''
        this.SET_ALARM_NEW_ONE(data)
        this.receiveAlarmList(data)
      }
    },
    // 接收单兵消息
    receiveSingleMsg(data) {
      console.log('单兵常规报警', data)
      let result = {}
      if (data.type === 0) {
        result = {
          isAlarm: false,
          content: data.content,
          date: `${this.$moment(data.date * 1000).format('YYYY-MM-DD')} ${data.moment}`,
          phone: data.phone,
          photo: data.picture, // 消息图片
          picture: data.photo, // 用户头像
          sender: data.sender, // 发送人
          senderId: data.senderId,
          title: data.title,
          type: '常规消息', // 消息类型： 0常规
          video: data.video,
          uniqueId: data.uniqueId,
          point: data.point, // 地图接口需要数组：[0]经度，[1],纬度
          isType: false,
          alarmTypeToMap: 'generalMsg'
        }
        this.receiveAlarmList(result)
      } else {
        if (!this.isAlarmSingle.checked) { return }
        if (this.isAlarmSingle.alarmPatrol) {
          result = {
            isAlarm: false,
            // type: data.type === 1 ? '报警消息' : '保修消息', // 消息类型： 1报警 || 2保修
            type: '巡更异常上报',
            msgType: data.type,
            video: data.video,
            uniqueId: data.uniqueId,
            point: data.point, // 地图接口需要数组：[0]经度，[1],纬度
            isType: true,
            message: {
              sender: data.sender, // 发送人
              senderId: data.senderId,
              content: data.content,
              time: `${this.$moment(data.date * 1000).format('YYYY-MM-DD')} ${data.moment}`,
              phone: data.phone,
              photo: data.photo ? data.photo : '', // 消息图片
              picture: data.picture, // 用户头像
              title: data.title,
              position: data.position,
              video: data.video ? data.video : ''
            },
            alarmTypeToMap: 'patrolAlarm'
          }
          this.SET_ALARM_NEW_ONE(data)
          this.receiveAlarmList(result)
        }
      }
      // console.log('单兵报警', this.singleAlarmMsg)
    },
    // 接收对讲
    receivingIntercom(data) {
      console.log('对讲信息', data)
      data.alarmTypeToMap = 'talkAlarm'
      data.type = '视频对讲请求'
      data.time = this.$moment(data.time * 1000).format('YYYY-MM-DD HH:mm:ss')
      this.SET_ALARM_NEW_ONE(data)
      this.receiveAlarmList(data)
    },
    receiveAlarmList(data) {
      this.list.push(data)
      this.SET_SINGLE_TOTAL(data)
    },
    // 去除数组指定元素
    removeEle(arr, uniqueId) {
      arr.forEach((item, index) => {
        if (item.uniqueId === uniqueId) {
          arr.splice(index, 1)
        }
      })
    },
    listScroll() {
      if (this.$refs.scroller) {
        this.$refs.scroller.update()
      }
    },
    /**
     * 确认报警后接收到的已被确认报警信息
     */
    confirmPatrolAlarm(data) {
      console.log('某条报警/报修已经被确认')
    },
    /**
     * 在弹出的巡更报警列表中
     * 点击消息主体可直接定位发生报警的闪烁模型(若该点位不在当前图层，地图会跳转并定位)
     * 同时在应急预案面板【单兵人员】发生排列变化
     */
    messageMain(item) {
      this.SET_ACTIVE_ALARM_INFO(item)
    },
    isSenderSuccess(arg) {
      this.isDisableCancel = arg
      if (this.isReplyMsg && this.msgDetail.uniqueId && this.modalType === 'msg' && !arg) {
        this.modalType = ''
        this.showAlarmModel = true
      } else if (this.isReplyMsg && this.msgDetail.uniqueId && this.modalType === 'msg' && arg) {
        this.modalType = ''
        this.showAlarmModel = true
        this.confirmAlarmMsg(this.msgDetail.uniqueId, true)
      } else if (this.modalType !== 'msg' && !arg) {
        this.showAlarmModel = false
        this.modalType = ''
        this.SAVE_PATROL_STUATES(true)
      } else if (this.modalType !== 'msg' && arg) {
        this.showAlarmModel = false
        this.modalType = ''
        this.SAVE_PATROL_STUATES(true)
      }
    },
    /**
     * 点击"处理"按钮弹出报警处理框
     */
    deal(item) {
      if (this.modalStatus) {
        return
      }
      this.SET_ACTIVE_ALARM_INFO(item)
      this.changeOpenAlarmPanel(true)
      // this.mapPositionDeal.id = item._id
      // 获取报警管理处预案
      this.plansData = []
      this.getPrearranged({ page: 1, limit: 1000 }).then(suc => {
        const warnPlanList = JSON.parse(JSON.stringify(suc.data))
        for (let i = 0; i < warnPlanList.length; i++) {
          this.pointAlarmData.selectionPlan = warnPlanList[0]._id
          this.pointAlarmData.remarks = warnPlanList[0].content
          this.pointAlarmData.planName = warnPlanList[0].name
          const obj = {
            value: warnPlanList[i]._id,
            label: warnPlanList[i].name,
            content: warnPlanList[i].content
          }
          this.plansData.push(obj)
        }
      }).catch(err => {
        console.log('getPrearranged error: ' + err)
      })
      // 赋值发起人、巡更点、标题、详情、点位负责人、电话
      this.pointAlarmData = item
      if (item.message.photo) {
        this.videoUrl = item.message.photo
        this.showType = 'image'
      } else if (item.message.video) {
        this.videoUrl = item.message.video
        this.showType = 'video'
      }
      // this.isShowMsgModal = false
      this.pointAlarm = true
      const modalData = {
        showType: this.showType,
        videoUrl: this.videoUrl,
        pointAlarmData: this.pointAlarmData
        // replyUser: this.replyUser
      }
      this.GET_PATROL_TYPE('AttrPatrol')
      this.SAVE_PATROL_STUATES(true)
      this.changeOpenAlarmPanel(true)
      this.SAVE_PATROL_DATA(modalData)
      this.emergencyAction({planId: '18'})
    },
    /**
     * 点击"回复"按钮弹出消息回复框
     */
    reply() {
      this.pointAlarm = false
      this.changeOpenAlarmPanel(false)
      this.isShowMsgModal = true
    },
    talkClick(data) {
      if (this.modalStatus) {
        return
      }
      this.isTalkStatus = true
      this.SAVE_TALK_DATA(data)
      this.SAVE_PATROL_STUATES(true)
      this.GET_PATROL_TYPE('talkAlarm')
    },
    /**
     * 点击【确认报警】警情处理完成
     */
    // confirmAlarm() {
    // },
    /**
     * 取消
     */
    cancel() {
      if (this.isDisableCancel) {
        return
      }
      this.pointAlarm = false
      this.changeOpenAlarmPanel(false)
      this.SAVE_PATROL_STUATES(true)
    },
    /**
     * 点击消息回复弹框【发送】返回至上一级(处理详情页面)
     */
    pointAlarmChange(bool) {
      this.pointAlarm = bool
      if (this.pointAlarm) {
        this.changeOpenAlarmPanel(true)
      } else {
        this.changeOpenAlarmPanel(false)
      }
      this.isShowMsgModal = !bool
      // this.SAVE_PATROL_STUATES(true)
    },
    closeDragBox() {
      this.pointAlarm = false
      this.changeOpenAlarmPanel(false)
    },
    // 对讲app挂断
    appClose(data) {
      data.type = 'talkAlarm'
      if (data.src === 'APP') {
        this.SAVE_PATROL_ID(data)
      }
    },
    bindSocket() {
      alarm.on('singlePawnMsg', this.receiveSingleMsg)
      alarm.on('singlePawn', this.receiveSingleAlarm)
      // alarm.on('patrolConfirm', this.confirmNotice)
      alarm.on('patrol', this.receivePatrolAlarm)
      alarm.on('patrolConfirm', this.confirmPatrolAlarm)
      alarm.on('intercomReceiving', this.receivingIntercom)
      alarm.on('intercomDisconnect', this.appClose)
    },
    removeSocket() {
      alarm.remove('singlePawn', this.receiveSingleAlarm)
      alarm.remove('singlePawnMsg', this.receiveSingleMsg)
      // alarm.remove('patrolConfirm', this.confirmNotice)
      alarm.remove('patrol', this.receivePatrolAlarm)
      alarm.remove('patrolConfirm', this.confirmPatrolAlarm)
      alarm.remove('intercomReceiving', this.receivingIntercom)
      alarm.remove('intercomDisconnect', this.appClose)
    }
  },
  destroyed() {
    this.$emit('isUnread', false)
    this.removeSocket()
  }
}
</script>

<style lang="less" scoped>
.patrol-alarm {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 12px;
  background-color: rgb(44, 62, 92);
  border-radius: 5px;
  .alarm-header {
    height: 38px;
    background-color: #0f2343;
    padding: 0 16px;
    .header {
      float: left;
      line-height: 38px;
      font-size: 14px;
    }
    .alarm-select {
      float: right;
      padding-top: 7px;
      width: 100px;
    }
  }
  .patrol-title {
    height: 30px;
    width: 100%;
    .title-tabs {
      text-align: center;
      .tabNormal {
        height: 30px;
        cursor: pointer;
        line-height: 45px;
        padding-right: 10px;
      }
      .tabActive {
        color: #fda54b;
      }
    }
  }
}
.outer-layer {
  width: 240px;
  height: 96px;
  margin: 16px;
  background: #5f6f86;
}
.patrol-left {
  width: 100%;
  height: 76px;
}
.patrol-left p {
  height: 33.3%;
  line-height: 23px;
  padding: 8px 0 0 10px;
}
.video-style {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  cursor: pointer;
}
.alarm-flashing {
  font-size: 26px;
  color: red;
  padding-left: 8px;
}
.alarm-icon {
  padding: 0px 16px;
}
.patrol-bottom {
  width: 100%;
  height: 30px;
  border-radius: 4px;
  background-color: #6f7d92;
  padding: 2px 0px 0px 12px;
}
.patrol-bottom p {
  float: left;
}
.font-common-style {
  color: #fff;
  padding-right: 4px;
  font-size: 16px;
}
.font-common {
  color: #fff;
  padding-right: 8px;
  font-size: 14px;
}
.header-style {
  padding-left: 16px;
  background-color: #0f2343;
  height: 38px;
  line-height: 38px;
}
.alarm-title {
  font-size: 14px;
  height: 38px;
  padding-left: 16px;
  line-height: 38px;
  font-weight: 700;
}
#single-alarm,
.single-alarm-list {
  width: 100%;
  height: 100%;
}
.single-alarm {
  position: relative;
}
.sendMsg {
  text-align: center;
  position: absolute;
  width: 32px;
  height: 32px;
  line-height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  bottom: 16px;
  right: 16px;
  opacity: 0.7;
}
.single-alarm-list {
  padding: 8px 16px;
  background: #1b3153;
}
.single-alarm-li {
  display: flex;
  height: 96px;
  // margin: 6px 0;
  background: #5f6f86;
  border-radius: 5px;
}
.left-ul {
  width: 120px;
  border-right: 1px solid rgba(151, 151, 151, 0.5);
  font-size: 12px;
  margin: 8px 0;
  float: left;
}
.left-ul li {
  line-height: 23px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.left-li {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.left-img {
  width: 40px;
  height: 40px;
  margin: 23px 12px;
  box-sizing: border-box;
  float: left;
}
.user-img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
}
.right-btn {
  flex: 1;
  text-align: center;
  line-height: 96px;
}
.alarm-inner {
  display: flex;
  width: 700px;
  height: 286px;
}
.alarm-video {
  width: 656px;
  line-height: 286px;
  text-align: center;
}
.inner-left {
  width: 350px;
  margin-right: 16px;
}
.inner-right {
  flex: 1;
}
.inner-top {
  height: 30px;
  line-height: 30px;
  margin-bottom: 16px;
  display: flex;
}
.alarm-type {
  margin-right: 20px;
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.inner-right-des {
  word-wrap: break-word;
  text-indent: 2em;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #5676a9;
  height: 240px;
}
.footer-btn {
  margin: 0 10px;
}
.iconfont-btn {
  font-size: 20px;
  cursor: pointer;
}
.default-size {
  font-size: 12px;
}
.info .omit {
  width: 75%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.outsource-info .info omit:after {
  content: '...'
}
.senderMes {
  width: 50px;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
