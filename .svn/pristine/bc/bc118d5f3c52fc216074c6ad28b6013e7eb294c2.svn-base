<!--3D报警 点击报警列表中的查看按钮显示的页面-->
<template>
  <dragBoxs @close="closeDragBox" :title="type === 'AttrPatrol' ? '巡更异常' : '单兵报警'" :eventType="'AttrPatrol' ? 'patrol' : 'single'" modelType="2D" @changeContext="scaleModalClick" :position="position">
    <div class="modol-body" style="height: 500px; width: 880px; padding: 24px 22px" v-if="type === 'AttrPatrol'">
      <div style="float:left;width:60%">
        <PatrolVideo :width="500" :height="445" :url="videoUrl" :type="showType"></PatrolVideo>
      </div>
      <div style="float:left;width:40%" class="patrol-right">
        <p class="patrol-title">{{pointAlarmData.message.title}}</p>
        <div class="patrol-info">
          <div class="info-top">
            <p style="float:left;" class="patrol-sponsor">
              <span><i class="font-common icon iconfont icon-admin"></i>{{pointAlarmData.message.sender}}</span>
            </p>
            <p class="patrol-sponsor" style="margin-left:156px">
              <span><i class="font-common icon iconfont icon-Location"></i>{{pointAlarmData.message.position}}</span>
            </p>
            <p class="patrol-sponsor">
              <span><i class="font-common icon iconfont icon-shijian"></i>{{pointAlarmData.message.time}}</span>
            </p>
            <p class="patrol-sponsor">
              <span>{{pointAlarmData.message.content}}</span>
            </p>
          </div>
          <p style="width:100%;height:4px;border-bottom:1px solid #6f7d92"></p>
        </div>
        <div class="infoRightInfo">
          <div class="infoDetail">
            <div class="infoLabel">警情处理</div>
            <div class="infoValue">
              <Select v-model="planAlarmSelId" size="small" style="width:174px" disabled>
                <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetail" style="margin:12px 0 12px 0;display: inline-block;">
            <div class="infoLabel">警情类型</div>
            <div class="infoValue">
              <Select v-model="pointSelectionPlan" size="small" style="width:174px">
                <Option v-for="item in plansData" @click.native="selectWarnPlan(item)" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">警情信息</div>
            <div class="infoValue">
              <Input type="textarea" :autosize="{minRows: 3,maxRows: 4}" v-model="remarks"></Input>
            </div>
          </div>
        </div>
        <div class="patrol-foot">
          <Button type="ghost" style="margin-right:30px" @click="confirmAlarm('unProcess')">清除报警</Button>
          <Button style="margin-right:30px" @click="reply">回复</Button>
          <Button type="primary" @click="confirmAlarm('process')">确认</Button>
        </div>
      </div>
    </div>
    <!-- 单兵报警 -->
    <div class="alarm-inner" v-else>
      <div :class="{'alarm-video': alarmDetail.alarmTypeToMap === 'singleAlarm', 'talk-video': alarmDetail.alarmTypeToMap === 'talkAlarm'}">
        <!-- @isPlayingStatus="talkAlarmStatus" -->
        <SinglePawn :id="alarmDetail.alarmTypeToMap === 'talkAlarm' ? alarmDetail.srcId : alarmDetail.uid" :uniqueId="alarmDetail.uniqueId"  :isPcToApp="alarmDetail.alarmTypeToMap === 'singleAlarm' ? true : false" @stopCalling="closeVideoTalkba" ref="singlePawn" :isSingleAlarm="alarmDetail.alarmTypeToMap === 'talkAlarm' ? false : true"></SinglePawn>
      </div>
      <div class="infoRight" v-if="alarmDetail.alarmTypeToMap === 'singleAlarm'">
        <div class="infoRightTittle">报警源信息</div>
        <div class="infoRightInfo infoRightInfo-top">
          <div class="infoDetail">
            <div class="infoLabel">报警人</div>
            <div class="infoValue">{{alarmDetail.realname}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">报警类型</div>
            <div class="infoValue">{{alarmDetail.type}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">时间</div>
            <div class="infoValue">{{alarmDetail.time}}</div>
          </div>
        </div>
        <div class="infoRightInfo">
          <div class="infoDetail">
            <div class="infoLabel">警情处理</div>
            <div class="infoValue">
              <Select v-model="planAlarmSelId" size="small" style="width:174px" disabled>
                <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetail" style="margin:12px 0 12px 0;display: inline-block;">
            <div class="infoLabel">警情类型</div>
            <div class="infoValue">
              <Select v-model="warnType" size="small" style="width:174px" @on-change="planChange">
                <Option v-for="item in warnTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">警情信息</div>
            <div class="infoValue">
              <Input v-model="planContent" type="textarea" :autosize="{minRows: 3,maxRows: 4}"/>
            </div>
          </div>
        </div>
        <div class="foot-btn">
          <Button type="primary" @click="cleanAlarm(alarmDetail.uniqueId, 'ignore')">清除报警</Button>
          <Button type="primary" @click="cleanAlarm(alarmDetail.uniqueId, 'process')">确认报警</Button>
        </div>
      </div>
    </div>
  </dragBoxs>
</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
// import dragBoxs from 'components/DragBoxs'
import dragBoxs from 'components/dragx/Dragx.vue'
import PatrolVideo from 'components/video/PatrolVideo.vue'
import SinglePawn from 'components/video/SinglePawn'
import { setTimeout } from 'timers'
import alarm from 'src/socket/alarm.js'

export default {
  components: {
    dragBoxs,
    PatrolVideo,
    SinglePawn
  },
  props: {
    patrolModalShow: {
      type: Boolean,
      default: true
    },
    patrolData: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    patrolAlarmDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      position: {left: 655},
      videoUrl: '',
      showType: '',
      pointAlarmData: {},
      // 巡更下拉框
      pointPlanName: '',
      pointSelectionPlan: '',
      pointSelectionDeal: '',
      pointPlanContent: '',
      remarks: '',
      plansData: [],
      dealData: [],
      currDealId: '',
      isDisableCancel: false,
      actionList: [],
      alarmIncount: [],
      // 单兵下拉框
      warnType: '',
      warnTypeList: [],
      planAlarmList: [],
      planAlarmSelId: '',
      planContent: '',
      cleanModel: false,
      modelVal: '',
      showInput: true,
      mapAlarmDeal: {},
      violationType: false,
      msgModelType: 2, // 消息回复
      showAlarmModel: false, // 报警弹出框
      showNewsReply: false, // 消息回复
      showAlarmCall: false, // 视频通话
      videoTape: true, // 录像
      singleAlarmList: [], // 单兵报警
      singleAlarmMsg: [], // 单兵消息
      msgDetail: {},
      alarmDetail: {},
      spliceAlarm: '', // 保证弹窗关闭在删除消息
      isSingleAlarm: false // 回复组件使用
    }
  },
  watch: {
    patrolData: {
      handler(newVal, oldVal) {
        switch (this.type) {
          case 'AttrPatrol':
            if (this.patrolData.message) {
              this.pointAlarmData = this.patrolData
              this.currDealId = this.patrolData.uniqueId
              if (this.patrolData.message.photo) {
                this.videoUrl = this.patrolData.message.photo
                this.showType = 'image'
              } else if (this.patrolData.message.video) {
                this.videoUrl = this.patrolData.message.video
                this.showType = 'video'
              }
            } else {
              this.pointAlarmData = this.patrolData.pointAlarmData
              this.replyUser = this.patrolData.replyUser
              this.currDealId = this.patrolData.pointAlarmData.uniqueId
              this.showType = this.patrolData.showType
              this.videoUrl = this.patrolData.videoUrl ? this.patrolData.videoUrl : this.patrolData.photo
            }
            break
          case 'AttrSinglePawn':
            this.alarmDetail = this.patrolData
            this.isSingleAlarm = true
            break
          case 'talkAlarm':
            this.alarmDetail = this.patrolData
            this.isSingleAlarm = true
            break
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState({
      // patrolModalType: ({ patrolAlarm }) => patrolAlarm.patrolModalType
    }),
    ...mapGetters('fengMapApplyInteractive', ['toolsPanelActive'])
  },
  methods: {
    ...mapMutations('patrol2DAlarm', ['SAVE_PATROL_RELY_STUATES', 'SAVE_PATROL_STUATES', 'SAVE_PATROL_LIST', 'SAVE_ALARM_TYPE', 'SAVE_PATROL_ID', 'SAVE_SINGLE_ID', 'SAVE_MODAL_STATUS', 'SAVE_TALK_STUATES']),
    ...mapActions(['getPrearranged', 'getMapAlarmDealList', 'confirmAlarms', 'confirmSingle', 'updatePatrolAlarm']),
    ...mapActions('map3DApplyIX', ['changeOpenAlarmPanel']),
    // talkAlarmStatus(val) {
    //   this.SAVE_TALK_STUATES(val)
    // },
    scaleModalClick() {
      // console.log('缩小', data)
      this.SAVE_MODAL_STATUS(true)
    },
    // 获取警情处理列表
    getalarmDealList() {
      this.getMapAlarmDealList({ page: 1, limit: 100, type: 'alarm' }).then((res) => {
        let alarmDealList = []
        let fireDealList = []
        res.data.forEach(item => {
          alarmDealList.push({ label: item.name, value: item.name })
        })
        // 获取消防警情处理列表
        this.getMapAlarmDealList({ page: 1, limit: 100, type: 'fire' }).then((res) => {
          let array = []
          res.data.forEach(item => {
            fireDealList.push({ label: item.name, value: item.name })
            array.push({ label: item.name, value: item.name })
          })
          let isData = true
          if (isData) {
            if (alarmDealList.length > 0) {
              for (let i = 0; i < alarmDealList.length; i++) {
                for (let j = 0; j < array.length; j++) {
                  if (alarmDealList[i].value === array[j].value) {
                    array.splice(j, 1)
                  }
                }
              }
              isData = false
            }
          }
          if ((alarmDealList.length > 0 || array.length > 0) && !isData) {
            this.planAlarmList = alarmDealList.concat(array)
            this.planAlarmSelId = this.planAlarmList[0].value
            this.dealData = alarmDealList.concat(array)
            this.pointSelectionDeal = this.dealData[0].value
          }
        }).catch(err => {
          console.log('getFireAlarmDealList error: ', err)
          this.errorMsg('警情处理列表获取失败')
        })
      }).catch(err => {
        console.log('getFireAlarmDealList error: ', err)
        this.errorMsg('警情处理列表获取失败')
      })
    },
    // 获取警情确认列表
    getAlarmTypeList() {
      this.getPrearranged({ page: 1, limit: 100, type: 1 }).then((res) => {
        const warnPlanList = JSON.parse(JSON.stringify(res.data))
        let warnAlarmList = []
        let warnFireList = []
        warnPlanList.forEach(item => {
          warnAlarmList.push({ label: item.name, value: item._id, content: item.content })
        })
        this.getPrearranged({ page: 1, limit: 100, type: 2 }).then((res) => {
          // this.warnFirePlanList = JSON.parse(JSON.stringify(res.data))
          const warnDataList = JSON.parse(JSON.stringify(res.data))
          let array = []
          warnDataList.forEach(item => {
            warnFireList.push({ label: item.name, value: item._id, content: item.content })
            array.push({ label: item.name, value: item._id, content: item.content })
          })
          let isData = true
          if (isData) {
            if (warnAlarmList.length > 0) {
              for (let i = 0; i < warnAlarmList.length; i++) {
                for (let j = 0; j < array.length; j++) {
                  if (warnAlarmList[i].value === array[j].value) {
                    array.splice(j, 1)
                  }
                }
              }
              isData = false
            }
          }
          if ((warnAlarmList.length > 0 || array.length > 0) && !isData) {
            this.warnTypeList = warnAlarmList.concat(array)
            this.warnType = this.warnTypeList[0].value
            this.planContent = this.warnTypeList[0].content
            this.plansData = warnAlarmList.concat(array)
            this.pointSelectionPlan = this.plansData[0].value
            this.remarks = this.plansData[0].content
          }
        }).catch(err => {
          console.log('getPrearranged error: ' + err)
          this.errorMsg('警情确认列表获取失败')
        })
      }).catch(err => {
        console.log('getPrearranged error: ', err)
        this.errorMsg('警情确认列表获取失败')
      })
    },
    // 切换单兵报警警情类型
    planChange(val) {
      if (val !== '') {
        this.showInput = false
        this.warnTypeList.forEach(item => {
          if (item.value === val) {
            this.planContent = item.content
          }
        })
      } else {
        this.showInput = true
        this.planContent = ''
      }
    },
    /**
     * 切换巡更报警警情类型
     */
    selectWarnPlan(data) {
      this.pointSelectionPlan = data.value
      this.remarks = data.content
      this.pointPlanName = data.label
    },
    // 关闭巡更、单兵弹出框
    closeDragBox() {
      if (this.alarmDetail.alarmTypeToMap === 'talkAlarm') {
        this.$refs.singlePawn.closeVideo()
        this.SAVE_PATROL_ID(this.alarmDetail.srcId)
      } else if (this.alarmDetail.alarmTypeToMap === 'singleAlarm') {
        this.$refs.singlePawn.closeVideo()
      }
      setTimeout(() => {
        this.changeOpenAlarmPanel(false)
        this.$emit('closePatrolModal')
      }, 100)
    },

    // 关闭视频弹框
    closeVideoTalkba() {
      this.$emit('closePatrolModal')
    },
    /**
     * 巡更点击【确认报警】警情处理完成
     */
    confirmAlarm(data) {
      this.SAVE_ALARM_TYPE('patrol')
      let situationType = ''
      let dealState = ''
      this.plansData.forEach(item => {
        if (item.value === this.pointSelectionPlan) {
          situationType = item.label
        }
      })
      let alarmSureInfo = {
        alarmDeal: this.planAlarmSelId,
        situationType: situationType,
        alarmContent: this.remarks
      }
      if (data === 'unProcess') {
        dealState = 'unProcess'
      } else if (data === 'process') {
        dealState = 'process'
      } else {
        dealState = 'ignore'
      }
      const param = {
        id: this.currDealId,
        planDeal: this.planAlarmSelId,
        planName: situationType,
        planId: this.pointSelectionPlan,
        remark: this.remarks,
        dealState: dealState,
        ackContent: JSON.stringify(alarmSureInfo)
      }
      this.confirmAlarms(param).then(resp => {
        this.successMsg('确认报警成功')
        this.isDisableCancel = false
        this.changeOpenAlarmPanel(false)
        const payload = {
          uniqueId: this.currDealId,
          type: 'patrolAlarm'
        }
        this.SAVE_PATROL_ID(payload)
        this.closeDragBox()
      }).catch(err => {
        this.errorMsg(err.response.data.message)
        console.log('confirmAlarms error: ' + err)
      })
      this.pointAlarm = false
      this.changeOpenAlarmPanel(false)
    },
    // 单兵一键报警
    cleanAlarm(uniqueId, data) {
      this.SAVE_ALARM_TYPE('oneAlarm')
      this.closeDragBox()
      this.changeOpenAlarmPanel(false)
      // this.confirmAlarmMsg(uniqueId, true)
      // this.showAlarmModel = false
      let situationType = ''
      let dealState = ''
      this.plansData.forEach(item => {
        if (item.value === this.warnType) {
          situationType = item.label
        }
      })
      let alarmSureInfo = {
        alarmDeal: this.planAlarmSelId,
        situationType: situationType,
        alarmContent: this.planContent
      }
      if (data === 'unProcess') {
        dealState = 'unProcess'
      } else if (data === 'process') {
        dealState = 'process'
      } else {
        dealState = 'ignore'
      }
      const param = {
        id: uniqueId,
        dealState: dealState,
        ackContent: JSON.stringify(alarmSureInfo)
      }
      this.updatePatrolAlarm(param).then(resp => {
        this.successMsg('报警确认成功')
        const payload = {
          uniqueId: this.patrolData.uniqueId,
          type: 'singleAlarm'
        }
        this.SAVE_PATROL_ID(payload)
      }).catch(err => {
        this.errorMsg(err.response.data.message)
        console.log('confirmAlarms error: ' + err)
      })
    },
    /**
     * 取消
     */
    cancel() {
      this.changeOpenAlarmPanel(false)
      this.$emit('closePatrolModal')
    },
    /**
     * 点击"回复"按钮弹出消息回复框
     */
    reply() {
      this.changeOpenAlarmPanel(false)
      this.$emit('closePatrolModal')
      this.SAVE_PATROL_RELY_STUATES(true)
    },
    // 去除数组指定元素
    removeEle(arr, uniqueId) {
      arr.forEach((item, index) => {
        if (item.uniqueId === uniqueId) {
          arr.splice(index, 1)
        }
      })
    },
    // 确认报警的通知
    confirmNotice(data) {
      if (data.type === 'alarm') {
        this.spliceAlarm = data.uniqueId
      } else {
        this.removeEle(this.singleAlarmMsg, data.uniqueId)
      }
    },
    // 对讲状态
    appCloseModel(data) {
      if (data.src === 'APP' && this.alarmDetail.alarmTypeToMap === 'talkAlarm') {
        if (this.alarmDetail.alarmTypeToMap === 'talkAlarm') {
          this.$refs.singlePawn.appCloseVideo()
          // this.SAVE_PATROL_ID(this.alarmDetail.srcId)
        } else if (this.alarmDetail.alarmTypeToMap === 'singleAlarm') {
          this.$refs.singlePawn.appCloseVideo()
        }
        setTimeout(() => {
          this.changeOpenAlarmPanel(false)
          this.$emit('closePatrolModal')
        }, 100)
      }
    },
    bindSocket() {
      alarm.on('intercomDisconnect', this.appCloseModel)
    },
    removeSocket() {
      alarm.remove('intercomDisconnect', this.appCloseModel)
    }
  },
  created() {
    this.showInput = true
    this.getalarmDealList()
    this.getAlarmTypeList()
    this.bindSocket()
  },
  destroyed() {
    this.removeSocket()
  }
}
</script>
<style lang="less" scoped>
.map-app-video-pre {
  width: 795px;
}
.alarm-inner {
  display: flex;
  width: 780px;
  height: 410px;
}
.alarm-video {
  width: 68%;
  // line-height: 286px;
  text-align: center;
  padding: 10px;
}
.talk-video {
  width: 100%;
  line-height: 286px;
  text-align: center;
}
.infoRight {
  // width: 300px;
  padding-left: 5px;
  .infoRightTittle {
    height: 26px;
    line-height: 26px;
    margin: 10px 0;
  }
}
.infoRightInfo {
  height: 154px;
  .infoDetail {
    width: 100%;
    height: 26px;
    line-height: 26px;
    clear: both;
    .infoLabel {
      width: 64px;
      float: left;
    }
    .alarmHostBtn {
      width: 100%;
      float: left;
      margin: 12px 0;
    }
    .infoValue {
      float: left;
      .infoValueHeight {
        width: 100%;
        height: 100px;
        border: 1px solid #444;
        padding-left: 5px;
        .alarmIncountItem {
          cursor: pointer;
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:hover {
            color: #20adff;
          }
        }
      }
    }
  }
}
.infoRight .infoRightInfo-top {
  height: 130px;
  .infoDetail{
    height: 30px;
    line-height: 30px;
  }
}
.foot-btn {
  margin-top: 15px;
}
.foot-btn button {
  margin-right: 20px;
}
.patrol-foot {
  margin-top: 22px;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.patrol-right {
  padding-left: 20px;
  .patrol-title {
    text-align: center;
    margin: 10px 0;
  }
  .patrol-info{
    height: 196px;
    .info-top{
      height: 184px;
      .patrol-sponsor {
        height: 40px;
        line-height: 40px;
        // margin: 2px 0 15px 0;
      }
      .sponsor {
        float: left;
        margin-right: 20px;
      }
    }
  }
  .infoDetail {
    display: block;
  }
  .info-top span i {
    margin-right: 10px;
  }
}
</style>
