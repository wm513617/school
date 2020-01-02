<template>
  <div class="bs-content">
    <div class="bs-main flex-column">
      <div class="flex-1 flex">
        <div class="patrol-list flex-1 flex flex-column ">
          <div class="searchBar flex-around topBar">
            <div class="search-msg">
              <!-- 广播框选 -->
              <div>
                <Checkbox v-model="TopCheckBox" @on-change="showAllCheck"></Checkbox>
              </div>
              <!-- 邮件 -->
              <div  @click="showMessage" :class="{'msg-pointer-a': isPointer, 'msg-pointer-b': !isPointer}">
                <i title="消息发送">
                <Icon type="email" size="25"></Icon>
                </i>
              </div>
              <!-- 广播 -->
              <div @click="broadBackOpen" :class="{'msg-pointer-a': isPointer, 'msg-pointer-b': !isPointer}">
                <i title="广播发送">
                <Icon type="speakerphone" size="25"></Icon>
                </i>
              </div>
            </div>
            <div class="search-input">
              <!-- 机构筛选 -->
              <div class="search-check">
                <Select style="width:150px" clearable>
                  <Option v-for="item in orgSentryList" :value="item.value" :key="item.value" @click.native="changeOrg(item.value)">{{ item.lable}}</Option>
                </Select>
              </div>
              <div>
                <Input placeholder="请输入用户真实姓名" v-model="searchKey" @on-change='searchChange'>
                <Button v-show="!isClose" @click="searchRuningTask" slot="append" icon="ios-search"></Button>
                <Button v-show="isClose" @click="clearSearch" slot="append" icon="close-round"></Button>
                </Input>
              </div>
              <!-- 报警 -->
              <!-- <div @click="showPatrolMsg" v-show="isShowMsgIcon" :class="{'search-alarm-a': isAlarmAll,'search-alarm-b': !isAlarmAll}">
                <Icon type="android-alert" size="25"></Icon>
              </div> -->
            </div>
          </div>
          <div class="user-list flex flex-1" style="minWidth:900px;minHeight:463px">
            <div v-if="!patrolUserList.length" class="nodata-tips">
              <span>暂无数据</span>
            </div>
            <div v-for="(item,index) in patrolUserList" :key="index" :class="{'user-patrol-a': !isAllPatrol, 'isactive': item.timeOut}" class="user-patrol-border">
              <!-- <span class="user-patrol-border"></span> -->
              <div class="check-sentry" v-show="isShowAllCheck">
                <!-- <CheckboxGroup  @on-change="checkAllGroupChange(item)" v-show="isShowAllCheck" class="check-sentry"> -->
                  <Checkbox v-model="item.singleCheckBox" @on-change="checkAllGroupChange(item)"></Checkbox>
                <!-- </CheckboxGroup> -->
              </div>
              <div  v-if="patrolUserList[index].isSingleAlarm" class="single-alarm" @click="showAlarmModal(item)">
                <Icon type="ios-bell" size="30"></Icon>
              </div>
              <div class="user-org" @click="showRecordDetail(item)">
                <!-- <img :src="item.photo?'/api/upload?id='+item.photo: soliderImg" alt="人员照片"> -->
                <p>{{item.affiliation.name}}</p>
              </div>
              <div class="user-status ">
                <div class="user-status-top">
                  <!-- <div :class="{'user-message-a': item.call,'user-message-b': !item.call}" @click="talkBackOpen(item)">
                    <i title="语音对讲">
                    <Icon type="android-call" size="25"></Icon>
                    </i>
                  </div> -->
                  <div v-if="!patrolUserList[index].isSingleAlarm" :class="{'user-message-a': item.call,'user-message-b': !item.call}" @click="showAlarmVideoModal(item)">
                    <i title="视频对讲">
                    <Icon type="ios-videocam-outline" size="25"></Icon>
                    </i>
                  </div>
                </div>
                <div class="user-img" @click="showRecordDetail(item)">
                  <img :src="item.photo ? item.photo: soliderImg" alt="人员照片">
                  <span>{{item.realname}}</span>
                </div>
                <!-- <div class="percentage">{{item.precentage!= ''? item.precentage+"%":'0'}}</div>
                <div style="height:20px; overflow:hidden;">当前点位: {{item.curPoint}}</div>
                <div style="height:20px; overflow:hidden;">下一点位: {{item.nextPoint}}</div> -->
                <div class="user-point">
                  <span>
                    <Icon type="android-notifications" color="#ff784e"></Icon>{{item.alarm}}
                  </span>
                  <span>
                    <Icon type="information-circled" color="#ff0000"></Icon>{{item.alarmALL}}
                  </span>
                  <span>
                    <Icon type="android-time" color="#ff0000"></Icon>{{item.timeout}}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div ref="isShow" class="patrol-info">
            <div class="task-header">
              <div class="title-info">
                <div class="task-user">
                  <img @error="imgErr" width="100px" height="100px" :src="recordInfo.photo?recordInfo.photo:soliderImg" :alt="recordInfo.realName">
                  <div class="task-user-name">{{recordInfo.realName}}</div>
                </div>
                <div class="task-title">{{recordInfo.taskType===1?'固定模式':'自由模式'}}：{{recordInfo.taskTitle}}</div>
                <div class="task-status" v-text="recordInfo.precentage>=0?recordInfo.precentage+'%':''"></div>
              </div>
              <div class="arrow-down">
                <span @click="isArrowShow()">
                  <Icon type="ios-arrow-down" size="40" />
                </span>
              </div>
              <div class="task-search">
                <DatePicker :clearable="false" :disabled="isEnable" style="width:120px" :options="dateOptions" :value="searchData.date" type="date" @on-change="searchDateChange" placeholder="开始时间" :editable="false"></DatePicker>
                <Select v-if="elementUpdate" v-show="userTasks.length>0" v-model="curTaskId" style="width:200px">
                  <Option v-for="(item,index) in userTasks" @click.native="changeTask(item._id)" :value="item._id" :key="index">{{ item.taskTitle}}</Option>
                </Select>
                <Button v-show="false" :disabled="isEnable" type="ghost" @click="showPatrolTrack"> 巡更轨迹</Button>
              </div>
            </div>
            <div class="record-info">
              <div class="point-item" v-for="item in recordInfo.points" :key="item.index">
                <div class="point-name">
                  <span :title="item.pointName"> {{item.pointName}}</span>
                </div>
                <div class="point-time">{{item.arrivalTime||item.patrolTime}}</div>
                <div class="ivu-icon" :class="{'ivu-icon-checkmark-circled':item.status==3, // 已巡更
                'ivu-icon-information-circled':item.status===4 || item.status===6 || item.status===7,// 超时
                'ivu-icon-settings':item.status===9 || item.status===2,// 报修
                'ivu-icon-android-notifications':item.status===8 || item.status===1, // 报警
                'ivu-icon-help-circled':item.status===5 || item.status===10 // 待巡更
                }"></div>
              </div>
              <div v-if="!recordInfo._id" style="text-align:center">
                暂无数据
              </div>
            </div>
          </div>
        </div>
        <div class="patrol-msg">
          <!-- <div class="patrol-chevron" @click="closeMsg">
            <p>
              <Icon type="chevron-right" size="20"></Icon>
            </p>
          </div> -->
          <div class="msg-header">
            <TableTab :tabs="deviceTabs" @on-tab-click="deviceTabClick" :isTip="true"></TableTab>
          </div>
          <div class="msg-box" ref="msgBox">
            <Table @on-row-click="showDetail" :height="tableHeight" size="small" :highlight-row="true" ref="currentRowTable" :columns="alarmColumns"  :data="msgList"></Table>
          </div>
        </div>
      </div>
    </div>
    <div v-if="videoModal">
      <dragBoxs title="单兵视频" :mask-closable="false" @close="closeSingleVideo(singlePawnId)" :modalBorder="border" :eventType="isVideoMsg ? 'single' : 'videospeek'">
        <div class="alarm-video" v-if="isShowLocateInMap">
          <SinglePawn ref="singlePawn" :id="singlePawnId" :isPcToApp="isPcToApp" @stopCalling="closeVideoTalkback(singlePawnId)"></SinglePawn>
        </div>
        <div class="alarm-video" style="padding: 12px 6px" v-if="!isShowLocateInMap">
          <Tabs :animated="false">
            <TabPane label="位置">
              <LocateInMap style="width:508px;height:380px" type="patrol" :geo="patrolAlarmGeo"></LocateInMap>
            </TabPane>
            <TabPane label="视频">
              <SinglePawn ref="singlePawn" :id="singlePawnId" :isPcToApp="isPcToApp" :isSingleAlarm="true" :uniqueId="uniqueId" @stopCalling="closeVideoTalkback(singlePawnId)" style="width:508px;height:380px"></SinglePawn>
            </TabPane>
          </Tabs>
        </div>
        <div class="infoRight" v-show="isVideoMsg">
          <div class="infoRightTittle">报警源信息</div>
          <div class="infoRightInfo infoRightInfo-top">
            <div class="infoDetail">
              <div class="infoLabel">报警人</div>
              <div class="infoValue">{{alarmDetail.realname}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">报警类型</div>
              <div class="infoValue">单兵一键报警</div>
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
                <Select v-model="planAlarmSelId" size="small" style="width:174px">
                  <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
              </div>
            </div>
            <div class="infoDetail" style="margin:12px 0 12px 0;display: inline-block;">
              <div class="infoLabel">警情确认</div>
              <div class="infoValue">
                <Select v-model="pointSelectionPlan" size="small" style="width:174px">
                  <Option @click.native="selectWarnPlan(item)" v-for="item in warnPlanListOpt" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">警情信息</div>
              <div class="infoValue">
                <Input v-model="selectedPlan.content" type="textarea" :autosize="{minRows: 3,maxRows: 4}"/>
              </div>
            </div>
          </div>
          <div class="foot-btn">
            <Button type="primary" @click="confirmAlarm('unProcess')">清除报警</Button>
            <Button type="primary" @click="confirmAlarm('process')">确认报警</Button>
          </div>
        </div>
      </dragBoxs>
    </div>
    <broadBack :imgList="imgList" :soliderInfos="soliderInfos" v-if="isShowBroadBack" @close="broadBackClose"></broadBack>
    <!-- <talkBack :soldierImg="soldierImg" :soldierInfo="soldierInfo" :isPcToApp="isPcToApp" v-if="isShowTalkBack" @close="talkBackClose"></talkBack> -->
    <msgModal :modalType="modalType" :modalIsShow.sync="modalShow" :singleMesInfos="singleMesInfos"></msgModal>
    <msgInfoModal @notarizeClick="notarizeMsg" @replyClick="replyMsg" @confirmAlarm="confimAlarm" :data="msgInfo" @closeConventionMsg="closeConventionMsg" :modalType="modalType" :replyUserModal="replyUserModal"></msgInfoModal>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import TableTab from './common/tableTab'
import msgInfoModal from '../keepwatch/common/msgInfo'
import msgModal from '../keepwatch/common/msgModal'
import noSoliderImg from '../../../static/noSolider.jpg'
import alarm from '../../socket/alarm.js'
import SinglePawn from '../../components/video/SinglePawn'
import dragBoxs from 'components/dragx/Dragx.vue'
// import talkBack from '../../components/broadcast/Talkback'
import broadBack from '../../components/broadcast/Broadcast'
import { read } from 'src/storage/index'
import { getSocket } from 'src/socket/socket.js'
import LocateInMap from '../../components/map/LocateInMap'
export default {
  components: {
    TableTab,
    msgInfoModal,
    msgModal,
    SinglePawn,
    dragBoxs,
    // talkBack,
    broadBack,
    LocateInMap
  },
  data() {
    return {
      uniqueId: '',
      singleMesInfos: [],
      isShowLocateInMap: true,
      alarmType: '',
      patrolAlarmGeo: '',
      isPcToApp: true,
      isPointer: false,
      singleCheckBox: false,
      checkAllGroup: [],
      broadBackList: [],
      broadBackPhotoList: [],
      isShowBroadBack: false,
      imgList: [],
      soliderInfos: {
        name: '',
        id: '',
        sn: ''
      },
      soldierInfo: {
        name: '',
        org: '',
        id: '',
        sn: ''
      },
      soldierImg: '',
      isShowTalkBack: false,
      singleUniqueId: '',
      dealState: '',
      border: '1px #0a111c solid',
      isVideoMsg: true,
      selectedPlan: {
        value: '',
        label: '',
        content: ''
      },
      alarmDetail: {},
      warnPlanListOpt: [],
      pointSelectionPlan: '',
      planAlarmSelId: '',
      warnTypeList: '',
      planAlarmList: '',
      isShowAllCheck: false,
      OneCheckBox: [],
      TopCheckBox: false, // 复选框
      orgSentryList: [], // 单兵机构
      isAlarmAll: true, // 消息闪烁样式切换
      isShowMsgIcon: true, // 消息图标显示
      isAllPatrol: false, // 单兵页面样式切换
      isPatrolMsg: false, // 报警消息
      isClose: false, // 搜索显示
      unSingleAlarmList: [], // 未报警列表
      singleAlarmList: [], // 报警列表
      singlePawnId: '', // 单兵id
      videoModal: false, // 单兵视频模态框
      patrolUserList: [], // 单兵人员
      tableValue: {},
      patrolAlarmList: [], // 巡更报警
      alarmList: [], // 单兵报警
      conventionList: [], // 单兵常规
      msgList: [],
      deviceActiveTab: 0,
      deviceTabs: [
        {
          title: '异常',
          value: 0,
          disabled: false,
          active: false,
          number: 0,
          isHide: false
        },
        {
          title: '常规',
          value: 1,
          disabled: false,
          active: false,
          number: 0,
          isHide: false
        }
      ],
      elementUpdate: true,
      modalType: 1,
      replyUserModal: {
        realName: '',
        userId: ''
      },
      soliderImg: noSoliderImg,
      modalShow: false,
      msgInfoShow: false,
      alarmInfoShow: false,
      msgInfo: null,
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      tableHeight: 800,
      isEnable: true,
      searchKey: '',
      searchData: {
        date: this.$moment().format('YYYY-MM-DD'),
        userId: ''
      },
      selectTask: {},
      curTaskId: '',
      orgInfo: {
        id: '',
        name: ''
      },
      alarmColumns: [
        {
          title: '巡更点',
          key: 'position',
          width: 100,
          ellipsis: true
        },
        {
          title: '巡更人',
          key: 'sender',
          width: 100,
          ellipsis: true
        },
        {
          title: '标题',
          key: 'title',
          minWidth: 100,
          ellipsis: true
        },
        {
          title: '时间',
          key: 'creatTime',
          align: 'center',
          width: 80,
          render: (h, param) => {
            return h('span', param.row.moment)
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      recordInfo: ({ patrol }) => {
        return patrol.recordInfo
      },
      userTasks: ({ patrol }) => {
        return patrol.userTasks
      }
      // orgList: ({ patrol }) => {
      //   return patrol.orgList
      // }
    }),
    ...mapGetters([])
  },
  watch: {
    patrolAlarmList(val) {
      if (val.length === 0) {
        this.isAlarmAll = true
        this.deviceTabs[0].number = 0
      } else {
        this.isAlarmAll = false
        this.deviceTabs[0].number = 1
      }
    },
    conventionList(val) {
      if (val.length === 0) {
        this.isAlarmAll = true
        this.deviceTabs[1].number = 0
      } else {
        this.isAlarmAll = false
        this.deviceTabs[1].number = 1
      }
    },
    msgList(val) {
      if (val.length === 0) {
        // this.isAlarmAll = true
        // this.isPatrolMsg = false
        // this.isAllPatrol = false
        // this.isShowMsgIcon = true
      }
    }
  },
  created() {
    getSocket().emit('patrol:instant.message', { usrid: read('userId') })
    alarm.on('singleStatus', this.receiveSingleStatus) // 巡更App状态更新 离线 在线
    alarm.on('patrolStatus', this.receivePatrolStatus) // 巡更状态更新
    alarm.on('singlePawn', this.receiveSinglePawn) // 单兵报警
    alarm.on('patrolConfirm', this.receivePatrolConfirm) // 巡更采集消息确认
    alarm.on('singlePawnMsg', this.receiveSinglePawnMsg) // 单兵消息采集
    alarm.on('patrol', this.receivePatrolPawnMsg) // 巡更消息采集
    alarm.on('singleTimeOut', this.receivePatrolSingleTimeOut) // 单兵超时报警
    alarm.on('intercomReceiving', this.receivingIntercom) // 语音对讲
    alarm.on('intercomDisconnect', this.receiveIntercomDisconnect) // 视频对讲挂断
    this.getalarmDealList()
    this.getAlarmTypeList()
    this.PatrolUsersList()
    this.searchOrgList()
    this.getOrgTree(3)
    this.UPDATE_RECORD_INFO({})
    this.UPDATE_PAGEINFO()
    for (let item in this.deviceTabs) {
      if (this.deviceTabs[item].isHide === false) {
        this.deviceTabs[item].active = true
        this.deviceTabClick({
          index: this.deviceTabs[item].value,
          obj: this.deviceTabs[item]
        })
        return
      }
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.tableHeight = this.$refs.msgBox.clientHeight - 10
    })
  },
  beforeDestroy() {
    this.UPDATE_USER_TASKS([])
    this.UPDATE_TASK_OF_MSG([])
  },
  destroyed() {
    alarm.remove('singleStatus', this.receiveSingleStatus)
    alarm.remove('patrolStatus', this.receivePatrolStatus)
    alarm.remove('singlePawn', this.receiveSinglePawn)
    alarm.remove('patrolConfirm', this.receivePatrolConfirm)
    alarm.remove('singlePawnMsg', this.receiveSinglePawnMsg)
    alarm.remove('patrol', this.receivePatrolPawnMsg)
    alarm.remove('singleTimeOut', this.receivePatrolSingleTimeOut)
    alarm.remove('intercomReceiving', this.receivingIntercom)
    alarm.remove('intercomDisconnect', this.receiveIntercomDisconnect)
  },
  methods: {
    ...mapMutations(['UPDATE_RECORD_INFO', 'UPDATE_PAGEINFO', 'UPDATE_USER_TASKS', 'UPDATE_TASK_OF_MSG']),
    ...mapActions([
      'getOrgTree',
      'getPatrolUsers',
      'getPatrolUserTasks',
      'getRecordInfo',
      'getMsgsForTask',
      'searchRecordRuning',
      'getMessageById',
      'getSentryUserTree',
      'getMapAlarmDealList',
      'getPrearranged',
      'updateTaskMessage',
      'updatePatrolAlarm'
    ]),
    // 关闭广播对讲
    broadBackClose() {
      this.isShowBroadBack = false
    },
    // 打开广播对讲
    broadBackOpen() {
      if (!this.isPointer) {
        return
      }
      if (this.broadBackPhotoList.length <= 1) {
        this.$Notice.error({
          title: '请至少勾选两名单兵，才能开启广播'
        })
        return
      }
      this.isShowBroadBack = true
      this.imgList = this.broadBackPhotoList
      this.soliderInfos = this.soliderInfos
      console.log(this.soliderInfos, 'this.soliderInfos')
    },
    // 接收对讲
    receivingIntercom(data) {
      // this.isPcToApp = false
      // this.isShowTalkBack = true
      console.log(data, '接收到视频对讲请求')
      if (data) {
        for (let i = 0; i < this.patrolUserList.length; i++) {
          if (this.patrolUserList[i]._id === data.srcId) {
            this.patrolUserList[i].call = false
          }
        }
      }
    },
    // 关闭语音对讲
    talkBackClose() {
      this.isShowTalkBack = false
      for (let i = 0; i < this.patrolUserList.length; i++) {
        if (this.patrolUserList[i]._id === this.soldierInfo.id) {
          this.patrolUserList[i].call = true
        }
      }
    },
    // 打开语音对讲
    talkBackOpen(val) {
      this.isPcToApp = true
      this.isShowTalkBack = true
      this.soldierInfo.name = val.realname
      this.soldierInfo.id = val._id
      this.soldierInfo.org = ''
      this.soldierInfo.sn = val.sn
      this.soldierImg = val.photo
      console.log(val, '语音对讲')
    },
    // 各机构人员显示
    changeOrg(val) {
      this.searchRecordRuning({org: val}).then(res => {
        console.log(res, '机构人员筛选')
        for (let i = 0; i < res.length; i++) {
          res = Object.assign(res, (res[i].alarmALL = res[i].alarm + res[i].warranty))
          res[i].alarm = res[i].alarmSentry
          res[i].singleCheckBox = false
          res[i].timeOut = false
          res[i].call = true
        }
        this.patrolUserList = res
        this.singlePawnId = res._id
      })
    },
    // 警情确认
    confirmAlarm(data) {
      if (this.pointSelectionPlan || data === 'unProcess') {
        this.$Modal.confirm({
          title: '提示',
          content: `<p>确定执行吗？</p>`,
          onOk: () => {
            const alarmSureInfo = {
              alarmDeal: this.planAlarmSelId,
              situationType: this.selectedPlan.label,
              alarmContent: this.selectedPlan.content
            }
            if (data === 'ignore') {
              this.dealState = 'ignore'
            } else if (data === 'process') {
              this.dealState = 'process'
            } else {
              this.dealState = 'unProcess'
            }
            const param = {
              id: this.singlePawnId,
              planId: this.selectedPlan.value,
              planName: this.selectedPlan.label,
              planDeal: this.planAlarmSelId,
              remark: this.selectedPlan.content,
              dealState: this.dealState,
              ackContent: JSON.stringify(alarmSureInfo)
            }
            // this.updateTaskMessage(param)
            // .then(res => {
            this.successMsg('报警确认成功')
            this.videoModal = false
            this.closeSingleVideo(param.id)
            this.updatePatrolAlarm({
              id: this.singleUniqueId,
              dealState: this.dealState,
              ackContent: JSON.stringify(alarmSureInfo)
            }).catch(err => this.errorMsg(err.response.data.message))
            // })
            // .catch(err => this.errorMsg(err.response.data.message))
          }
        })
      } else {
        this.errorMsg('请选择警情')
      }
    },
    /**
     * 切换一键报警警情类型
     */
    selectWarnPlan(data) {
      this.selectedPlan.label = data.label
      this.selectedPlan.value = data.value
      this.selectedPlan.content = data.content
    },
    // 警情处理列表
    getalarmDealList() {
      this.getMapAlarmDealList({ page: 1, limit: 100, type: 'alarm' }).then(res => {
        let alarmDealList = []
        res.data.forEach(item => {
          alarmDealList.push({ label: item.name, value: item.name })
          this.planAlarmList = alarmDealList
        })
      }).catch(err => {
        console.log('getFireAlarmDealList error: ', err)
        this.errorMsg('警情处理列表获取失败')
      })
    },
    // 警情确认列表
    getAlarmTypeList() {
      this.getPrearranged({ page: 1, limit: 50 }).then(res => {
        let warnAlarmList = []
        res.data.forEach(item => {
          warnAlarmList.push({ label: item.name, value: item._id, content: item.content })
          this.warnPlanListOpt = warnAlarmList
        })
      }).catch(err => {
        console.log('getAlarmTypeList error: ', err)
        this.errorMsg('警情确认列表获取失败')
      })
    },
    /**
     * 单兵人员复选框群聊
     * @method checkAllGroupChange
     */
    checkAllGroupChange(val) {
      this.broadBackPhotoList = []
      let broadBackList = []
      let messsageList = []
      this.patrolUserList.map(item => {
        if (item.singleCheckBox) {
          this.broadBackPhotoList.push(item.photo)
          const singleList = {
            name: item.realname,
            id: item._id,
            sn: item.sn
          }
          const msgList = {
            realName: item.realname,
            userId: item._id
          }
          broadBackList.push(singleList)
          messsageList.push(msgList)
        }
      })
      this.soliderInfos = broadBackList
      this.singleMesInfos = messsageList
      console.log(this.singleMesInfos, '框选人员')
    },
    /**
     * 复选框勾选
     * @method showAllCheck
     */
    showAllCheck(val) {
      this.isPointer = val
      this.isShowAllCheck = val
      this.patrolUserList.map(item => {
        item.singleCheckBox = false
      })
    },
    /**
     * 下拉框机构单兵筛选
     * @method searchOrgList
     */
    searchOrgList() {
      this.getSentryUserTree().then(res => {
        res[0].children.forEach((item, index) => {
          this.orgSentryList.push({lable: item.name, value: item._id})
        })
        this.orgSentryList.unshift({lable: res[0].name, value: res[0]._id})
      })
      console.log(this.orgSentryList, 'this.orgSentryList')
    },
    /**
     * 右侧消息栏的显示
     * @method closeMsg
     */
    closeMsg() {
      this.isPatrolMsg = false
      this.isShowMsgIcon = true
      this.isAllPatrol = !this.isAllPatrol
    },
    /**
     * 报警消息显示
     * @method showPatrolMsg
     */
    showPatrolMsg() {
      this.isPatrolMsg = true
      this.isAllPatrol = !this.isAllPatrol
      this.isShowMsgIcon = false
    },
    /**
     * 搜索框内容改变
     */
    searchChange() {
      this.isClose = false
    },
    /**
     * 消息回复
     * @method showMessage
     * @param {Object} val 单兵id
     */
    showMessage(val) {
      if (!this.isPointer) {
        return
      }
      this.modalShow = true
    },
    /**
     * 巡更App状态判断
     * @method receiveSingleStatus
     * @param {Object} data 单兵APP状态
     */
    receiveSingleStatus(data) {
      if (data.status === 'online') {
        this.PatrolUsersList()
      } else {
        for (let i = 0; i < this.patrolUserList.length; i++) {
          if (this.patrolUserList[i]._id === data.userid) {
            if (data.status === 'offline') {
              this.patrolUserList.splice(i, 1)
            }
            return
          }
        }
      }
    },
    /**
     * 巡更状态更新
     * @method receivePatrolStatus
     * @param {Object} data 单兵信息
     */
    receivePatrolStatus(data) {
      console.log(data, 'receivePatrolStatus')
      for (let i = 0; i < this.patrolUserList.length; i++) {
        if (this.patrolUserList[i]._id === data._id) {
          this.patrolUserList[i].curPoint = data.currentPoint
          this.patrolUserList[i].nextPoint = data.nextPoint
          this.patrolUserList[i].alarmALL = data.warranty + data.alarm
          // this.patrolUserList[i].alarm = data.alarm
          this.patrolUserList[i].timout = data.timout
          this.patrolUserList[i].precentage = data.precentage
          this.patrolUserList[i].recordId = data.recordId
          this.getRecordInfo({id: data.recordId})
        }
      }
      this.patrolUserList.sort(this.compare('precentage'))
    },
    compare(property) {
      return function(a, b) {
        let value1 = a[property]
        let value2 = b[property]
        return value2 - value1
      }
    },
    // 单兵超时报警
    receivePatrolSingleTimeOut(data) {
      // console.log(data, '单兵超时报警')
      if (data.timeOut) {
        for (let i = 0; i < this.patrolUserList.length; i++) {
          if (this.patrolUserList[i]._id === data._id) {
            this.patrolUserList[i].timeOut = data.timeOut
          }
        }
      }
    },
    /**
     * 单兵视频模态框判断
     * @method closeSingleVideo
     * @param {Object} singlePawnId 单兵id
     */
    closeSingleVideo(singlePawnId) {
      this.$refs.singlePawn.closeVideo()
      setTimeout(() => {
        this.closeVideoTalkback(singlePawnId)
      }, 300)
    },
    closeVideoTalkback(singlePawnId) {
      console.log('=================')
      this.videoModal = false
      this.appCloseVideoTalkback(singlePawnId)
    },
    // 单兵视频对讲挂断 app端主动挂断
    receiveIntercomDisconnect(data) {
      console.log(data, this.singlePawnId, this.videoModal, '挂断信息')
      if (data.src === 'APP' && data.srcId === this.singlePawnId && this.videoModal === true) {
        this.appCloseSingleVideo(this.singlePawnId)
      }
    },
    appCloseSingleVideo(singlePawnId) {
      this.$refs.singlePawn.appCloseVideo()
      setTimeout(() => {
        this.appCloseVideoTalkback(singlePawnId)
      }, 300)
    },
    appCloseVideoTalkback(singlePawnId) {
      for (let i = 0; i < this.patrolUserList.length; i++) {
        if (this.patrolUserList[i]._id === singlePawnId) {
          this.patrolUserList[i].isSingleAlarm = false
          this.patrolUserList[i].call = true
        }
      }
    },
    showAlarmModal(val) {
      console.log(val, '一键报警')
      this.singlePawnId = val._id
      this.isPcToApp = true
      this.uniqueId = val.uniqueId
      // this.alarmDetail = val
      this.videoModal = true
      this.isVideoMsg = true
      this.isShowLocateInMap = false
    },
    showAlarmVideoModal(val) {
      console.log(val, '一键视频')
      if (val.call) {
        this.isPcToApp = true
      } else {
        this.isPcToApp = false
      }
      this.singlePawnId = val._id
      // this.alarmDetail = val
      this.videoModal = true
      this.isVideoMsg = false
      this.isShowLocateInMap = true
    },
    /**
     * 获取单兵用户列表
     * @method PatrolUsersList
     */
    PatrolUsersList() {
      this.getPatrolUsers().then(res => {
        console.log(res, '单兵列表')
        for (let i = 0; i < res.length; i++) {
          res = Object.assign(res, (res[i].alarmALL = res[i].alarm + res[i].warranty))
          res[i].alarm = res[i].alarmSentry
          res[i].singleCheckBox = false
          res[i].timeOut = false
          res[i].call = true
        }
        this.patrolUserList = res
        this.singlePawnId = res._id
        this.patrolUserList.sort(this.compare('precentage'))
      })
    },
    /**
     * 单兵报警闪烁
     * @method receiveSinglePawn
     * @param {Object} data 接收单兵报警
     */
    receiveSinglePawn(data) {
      console.log(data, '单兵一键报警')
      if (data.geo && data.geo.lon && data.geo.lat) {
        this.patrolAlarmGeo = `${data.geo.lon},${data.geo.lat}`
      } else {
        this.$Notice.warning({
          title: '未获取到经纬度'
        })
        this.patrolAlarmGeo = ''
      }
      this.alarmDetail = data
      this.singleUniqueId = data.uniqueId
      this.singleAlarmList = []
      this.unSingleAlarmList = []
      for (let i = 0; i < this.patrolUserList.length; i++) {
        if (data.uid === this.patrolUserList[i]._id) {
          this.patrolUserList[i].alarm = data.alarm
          this.patrolUserList[i].uniqueId = data.uniqueId
          this.singleAlarmList.unshift(this.patrolUserList[i])
          this.patrolUserList[i].isSingleAlarm = true
        } else {
          this.unSingleAlarmList.push(this.patrolUserList[i])
        }
      }
      this.patrolUserList = this.singleAlarmList.concat(this.unSingleAlarmList)
    },
    /**
     * 巡更采集消息 type=1报警 type=2保修
     * @method receivePatrolPawnMsg
     * @param {Object} data 接收巡更采集信息
     */
    receivePatrolPawnMsg(data) {
      console.log(data, '巡更报警')
      this.alarmType = 'patrol'
      const patrolData = JSON.parse(JSON.stringify(data.message))
      patrolData.geo = data.map2D.geo || data.map3D.geo
      this.patrolAlarmList.push(patrolData)
      this.deviceTabClick(this.tableValue)
    },
    /**
     * 单兵采集消息 type=0保修 type=1报警 type=2保修
     * @method receiveSinglePawnMsg
     * @param {Object} data 接收单兵采集信息
     */
    receiveSinglePawnMsg(data) {
      console.log(data, '单兵采集')
      this.alarmType = 'single'
      const singleData = JSON.parse(JSON.stringify(data))
      singleData.geo = `${data.geo.lon},${data.geo.lat}`
      if (singleData.type === 0) {
        this.conventionList.push(singleData)
      } else {
        this.patrolAlarmList.push(singleData)
      }
      this.deviceTabClick(this.tableValue)
    },
    /**
     * 异常 常规消息处理
     * @method notarizeMsg
     * @param {Object} id 处理消息id
     */
    notarizeMsg(id) {
      for (let i = 0; i < this.msgList.length; i++) {
        if (id === this.msgList[i]._id || this.msgList[i].uniqueId) {
          this.msgList.splice(i, 1)
        }
      }
      if (this.msgList.length === 0) {
        this.isPatrolMsg = false
        // this.isAllPatrol = false
        this.isShowMsgIcon = true
      }
    },
    closeConventionMsg(id) {
      for (let i = 0; i < this.msgList.length; i++) {
        if (id === this.msgList[i].uniqueId) {
          this.msgList.splice(i, 1)
        }
      }
      if (this.msgList.length === 0) {
        this.isPatrolMsg = false
        // this.isAllPatrol = false
        this.isShowMsgIcon = true
      }
    },
    /**
     * 消息类型表单切换 0 异常 1 常规
     * @method deviceTabClick
     * @param {Object}  data 消息类型表单切换下标
     */
    deviceTabClick(data) {
      this.tableValue = data
      this.deviceActiveTab = data.obj.value
      switch (this.deviceActiveTab) {
        case 0:
        // 异常
          this.msgList = this.patrolAlarmList.reverse()
          break
        case 1:
        // 常规
          this.msgList = this.conventionList.reverse()
          break
      }
    },
    // 是否显示下拉框
    isArrowShow() {
      this.$refs['isShow'].style.bottom = -360 + 'px'
    },
    // 确认报警
    confimAlarm(val) {
    },
    showRecordDetail(data) {
      if (data.recordId === '') {
        this.$Notice.error({
          title: '该用户没有巡更任务记录！'
        })
        this.isArrowShow()
        return
      }
      this.$refs['isShow'].style.bottom = 0 + 'px'
      this.elementUpdate = false
      this.isEnable = false
      this.curTaskId = ''
      this.searchData.userId = data._id
      let param = {
        userId: data._id,
        date: this.$moment(this.$moment().format('YYYY-MM-DD')).unix('X')
      }
      const getTasks = this.getPatrolUserTasks(param)
      const getInfo = this.getRecordInfo({ id: data.recordId }) // 单条巡更记录
      const getMsg = this.getMsgsForTask({ id: data.recordId })
      Promise.all([getTasks, getInfo, getMsg])
        .then(res => {
          this.curTaskId = res[0].data[0]._id
          this.elementUpdate = true
        })
        .catch(err => console.log(err))
    },
    searchRuningTask() {
      if (this.searchKey) {
        this.searchRecordRuning({ key: this.searchKey, org: '' }).then(res => {
          console.log(res, '搜索结果')
          for (let i = 0; i < res.length; i++) {
            res = Object.assign(res, (res[i].alarmALL = res[i].alarm + res[i].warranty))
            res[i].alarm = res[i].alarmSentry
            res[i].singleCheckBox = false
            res[i].timeOut = false
            res[i].call = true
          }
          this.patrolUserList = res
          this.singlePawnId = res._id
        })
        this.isClose = true
      } else {
        this.errorMsg('用户名不能为空！')
      }
    },
    clearSearch() {
      this.isClose = false
      this.searchKey = ''
      this.PatrolUsersList()
    },
    searchDateChange(date) {
      this.searchData.date = date
      let param = {
        userId: this.searchData.userId,
        date: this.$moment(this.searchData.date).unix('X')
      }
      this.getPatrolUserTasks(param)
        .then(res => {
          if (res.data.length > 0) {
            this.getRecordInfo({ id: res.data[0]._id })
          } else {
            this.UPDATE_RECORD_INFO({})
            this.$successMsg('暂无数据')
          }
          this.curTaskId = res.data[0]._id
        })
        .catch(err => {
          this.errorMsg('该用户没有巡更任务！')
          console.log(err)
        })
    },
    changeTask(value) {
      this.curTaskId = value
      this.getRecordInfo({ id: this.curTaskId })
      this.getMsgsForTask({ id: this.curTaskId })
    },
    showPatrolTrack() {},
    showDetail(data) {
      // this.getMessageById({ id: data._id || data.uniqueId }).then(res => {
      data.alarmType = this.alarmType
      this.msgInfo = data
      //   // this.msgInfoShow = true
      // })
    },
    replyMsg(data) {
      this.modalType = data.type
      this.replyUserModal.realName = data.sender
      this.replyUserModal.userId = data.senderId
      // this.modalShow = true
    },
    imgErr(img) {
      img.target.src = noSoliderImg
    }
  }
}
</script>

<style lang="less" scoped>
.patrol-list {
  position: relative;
  overflow: hidden;
  background: #1b3153;
  .patrol-info {
    background: #1c3053;
    overflow: hidden;
    border: 1px solid #ccc;
    position: absolute;
    bottom: -360px;
    height: 355px;
    width: 100%;
    border-radius: 4px;
    transition: all 1s;
  }
}
.user-list {
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;
  background: #1c3053;
  overflow: auto;
  align-content: flex-start;
  .user-patrol-a {
    width: calc(~'24% - 10px');
    height: calc(~'20% - 10px');
  }
  .isactive {
    border: 1px solid #ccc;
    animation: timeOUt 1s linear 180;
  }
  .user-patrol-b {
    width: calc(~'16% - 10px');
    height: calc(~'20% - 10px');
  }
  .user-patrol-border {
    border-radius: 4px;
    border: 1px solid #ccc;
    display: flex;
    min-width: 280px;
    margin: 2px 11px;
    position: relative;
  }
  @keyframes timeOUt {
  0% {
    border-color: #ff0000;
  }
  25% {
    border-color: #ff0000;
  }
  75% {
    border-color: #787b83;
  }
  100% {
    border-color: #787b83;
  }
  }
  .check-sentry {
    position: absolute;
    z-index: 3;
  }
  .user-org{
    width: 120px;
    height: 140px;
  }
  .user-org p {
    text-align: center;
    line-height: 140px;
  }
}
.single-alarm {
  width: 28px;
  height: 28px;
  animation: change 1s linear infinite;
  color: #ff784e;
  background-color: #787b83;
  border-radius: 5px;
  position: absolute;
  z-index: 5;
}
.single-alarm :hover {
  cursor: pointer;
}
@keyframes change {
  0% {
    color: #ff784e;
  }
  25% {
    color: #ff784e;
  }
  75% {
    color: #787b83;
  }
  100% {
    color: #787b83;
  }
}
.user-list-page {
  height: 40px;
  padding: 3px 10px;
  background: #244575;
}
.patrol-msg {
  flex: 0 0 400px;
  background: #1c3053;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  .patrol-chevron {
    top: 50%;
    background: #1c3053;
    position: absolute;
    z-index: 2;
  }
  .map-box {
    flex: 1;
  }
  .map-box2 {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .msg-box {
    flex: 1;
    overflow: auto;
  }
}
.user-img {
  height: 90px;
  display: flex;
  justify-content: space-around;
  margin-top: -6px;
  img {
    display: block;
    width: 50%;
    margin: -2px 4px;
    // border: 1px solid #ccc;
    border-radius: 50%;
    margin-top: -12px;
  }
  .icon-alarm-admin {
    position: absolute;
    color: orange;
    font-size: 20px;
    top: 3px;
    left: 3px;
    cursor: pointer;
  }
  span {
    display: block;
    text-align: center;
    margin-top: 28px;
    width: 50%;
  }
}
.user-status {
  margin: 10px;
  padding: 5px;
  flex: 1;
  border-radius: 6px;
  background: #787b83;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .percentage {
    text-align: center;
    color: #33ff99;
    font-size: 20px;
  }
  .user-status-top {
    display: flex;
    justify-content: flex-end;
    height: 20%;
    // .user-message {
    //   // margin-right: 15px;
    // }
    .user-all-message {
      margin-right: 15px;
    }
    .user-all-message :hover {
        cursor: pointer;
      }
  }
  .user-video {
    width: 22px;
    height: 30px;
  }
  .user-video :hover {
    cursor: pointer;
  }
  .user-message-a {
    width: 22px;
    height: 30px;
  }
  .user-message-b {
    width: 22px;
    height: 30px;
    animation: call 1s linear infinite;
    color: #ff0000;
    @keyframes call {
      0% {
        color: #ff0000;
      }
      25% {
        color: #ff0000;
      }
      75% {
        color: #787b83;
      }
      100% {
        color: #787b83;
      }
    }
  }
  .user-message-a :hover {
    cursor: pointer;
  }
  .user-message-b :hover {
    cursor: pointer;
  }
}
.user-point {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
.task-header {
  padding: 10px;
  flex: 1;
  display: flex;
  .title-info {
    flex: 33.3%;
    display: flex;
  }
  .arrow-down {
    flex: 33.3%;
    display: flex;
    justify-content: center;
    margin-top: -20px;
  }
  .arrow-down :hover {
    cursor: pointer;
  }
  .task-search {
    display: flex;
    flex: 33.3%;
    height: 32px;
    justify-content: space-between;
  }
  .task-user {
    flex: 0 0 100px;
    img {
      border-radius: 50%;
    }
    .task-user-name {
      text-align: center;
      font-size: 16px;
    }
  }
  .task-title {
    padding: 30px 10px;
    font-size: 14px;
  }
  .task-status {
    flex: 0 0 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: green;
  }
}
.record-info {
  height: 180px;
  width: 100%;
  overflow: auto;
}
.point-item {
  position: relative;
  margin-top: 50px;
  height: 5px;
  width: 100px;
  float: left;
  background: #ccc;
  .ivu-icon {
    position: absolute;
    font-size: 20px;
    left: 60px;
    top: -8px;
  }
  .ivu-icon-android-notifications {
    color: #ff784e;
  }
  .ivu-icon-checkmark-circled {
    color: #008000;
  }
  .ivu-icon-settings {
    color: #ff0000;
  }
  .ivu-icon-information-circled {
    color: #ff0000;
  }
  .ivu-icon-help-circled {
    color: #999;
  }
  .point-name {
    width: 100%;
    position: absolute;
    top: -40px;
    text-align: center;
    overflow: hidden;
    height: 20px;
  }
  .point-time {
    width: 100%;
    position: absolute;
    top: -25px;
    text-align: center;
  }
}
.nodata-tips {
  flex: 1;
  margin-bottom: 20px;
  background: #1c3053;
  position: relative;
  text-align: center;
  span {
    position: absolute;
    top: 50%;
    left: 50%;
  }
}
.topBar {
  background: #1b3153;
}
.searchBar {
  display: flex;
  background: #244575;
  height: 50px;
  margin-bottom: 8px;
  justify-content: space-between;
  .search-input {
    display: flex;
    padding: 8px;
    justify-content: flex-end;
    .search-alarm-a {
      margin: 3px 25px;
    }
    .search-alarm-b {
      margin: 3px 25px;
      animation: search 1s linear infinite;
      color: #ff0000;
    @keyframes search {
      0% {
        color: #ff0000;
      }
      25% {
        color: #ff0000;
      }
      75% {
        color: #787b83;
      }
      100% {
        color: #787b83;
      }
    }
  }
    .search-check {
      margin: 1px 24px;
    }
  }
  .search-msg {
    width: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 30px;
  }
  .msg-pointer-a :hover {
    cursor: pointer;
  }
  .msg-pointer-b :hover {
    cursor: no-drop;
  }
}
.alarm-video {
  display: flex;
  float: left;
  width: 520px;
  height: 500px;
}
.infoRight {
  float: right;
      padding: 12px 24px;
  .infoRightTittle {
    height: 26px;
    line-height: 26px;
    margin: 10px 0;
  }
  .infoRightInfo {
    height: 154px;
    .infoDetail {
      width: 100%;
      height: 26px;
      line-height: 26px;
      clear: both;
      .infoLabel {
        width: 74px;
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
}
.foot-btn {
  margin-top: 15px;
}
.foot-btn button {
  margin-left: 20px;
}
</style>

<style>
.ivu-input-group .ivu-input {
  z-index: 0 !important;
}
</style>
