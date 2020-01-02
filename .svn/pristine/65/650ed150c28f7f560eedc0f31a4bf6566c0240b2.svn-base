<!--3D报警 点击报警列表中的查看按钮显示的页面-->
<template>
  <dragBoxs @close="close" :title="type === 'ManualAlarm' ? '手工报警' : '报警视频'" modelType="3D" :eventType="picType" :position="position">
    <div class="map-app-video-pre" style="width:815px;">
      <div v-if="type !== 'FaceAlarm'" class="mapAppInfoContent">
        <div class="infoleft" v-if="type === 'vioAlarm'">
          <img :src="oneAlarmInData.carImg1Base64 || oneAlarmInData.carImg2Base64 || oneAlarmInData.carImgBase64 || oneAlarmInData.carNumPicBase64 || oneAlarmInData.combinedPicBase64" alt="暂无图片">
        </div>
        <div class="infoleft" v-else>
          <alarmVideoMadel v-if="type !== 'ManualAlarm'" ref="alarmVideo" :videoParam="actionList"></alarmVideoMadel>
          <SinglePawn v-else-if="type === 'ManualAlarm' && oneAlarmInData.singlePawnId" ref="singlePawn" :id="oneAlarmInData.singlePawnId" @stopCalling="stopCalling"></SinglePawn>
          <manualAlarmVideoMadel v-else ref="alarmVideo" :buttonShow="['wall']" :videoParam="actionList" :isShowAllButton="false"></manualAlarmVideoMadel>
        </div>
        <div class="infoRight">
          <div class="infoRightTittle">报警详情</div>
          <div class="infoRightInfo">
            <!-- 手工报警 -->
            <div v-if="type === 'ManualAlarm'">
              <div class="infoDetail manual-info">
                <div class="infoLabel">时间</div>
                <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
              </div>
              <div class="infoDetail manual-info">
                <div class="infoLabel">机构</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.organization">{{oneAlarmInData.organization}}</div>
              </div>
              <div class="infoDetail manual-info">
                <div class="infoLabel">名称</div>
                <Input v-model="oneAlarmInData.name" :disabled="oneAlarmInData.isNameDisabled" size="small" style="width: 155px;" :maxlength="64"></Input>
              </div>
              <div class="infoDetail manual-info">
                <div class="infoLabel">报警类型</div>
                <div class="infoValue">手工报警</div>
              </div>
              <div class="infoDetail manual-info">
                <div class="infoLabel">级别</div>
                <div class="infoValue">
                  <Select v-model="oneAlarmInData.level" size="small" style="width:155px">
                    <Option v-for="item in alarmLevelList" :value="item.value" :key="item.value">{{item.label}}</Option>
                  </Select>
                </div>
              </div>
              <div class="infoDetail manual-info">
                <div class="infoLabel">处理状态</div>
                <div class="infoValue">未处理</div>
              </div>
            </div>
            <!-- 普通报警 消防报警 -->
            <div v-else-if="type === 'AlarmList' || type === 'FireAlarmList'">
              <div class="infoDetail">
                <div class="infoLabel">报警名称</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.name">{{oneAlarmInData.name}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">所属设备</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.srcName">{{oneAlarmInData.srcName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警子类型</div>
                <div class="infoValue" :title="oneAlarmInData.eventTypeName">{{oneAlarmInData.eventTypeName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">机构</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.organization">{{oneAlarmInData.organization}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警级别</div>
                <div class="infoValue">{{oneAlarmInData.level}}级</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警状态</div>
                <div class="infoValue">正在发生</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警时间</div>
                <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">停止时间</div>
                <div class="infoValue"></div>
              </div>
            </div>
            <!-- 重点关注 -->
            <div v-else-if="type === 'VideoAlarm' && oneAlarmInData.eventType === 'focusAttention'">
              <div class="infoDetail">
                <div class="infoLabel">报警类型</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.attentionType">{{oneAlarmInData.attentionType}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">所属设备</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.srcName">{{oneAlarmInData.srcName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">发起人</div>
                <div class="infoValue" :title="oneAlarmInData.userName">{{oneAlarmInData.userName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">机构</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.organization">{{oneAlarmInData.organization}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警级别</div>
                <div class="infoValue">{{oneAlarmInData.level}}级</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警时间</div>
                <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
              </div>
            </div>
            <!-- 报警求助 -->
            <div v-else-if="type === 'AlarmHelpList'">
              <div class="infoDetail">
                <div class="infoLabel">报警设备</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.name">{{oneAlarmInData.name}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">对讲ID</div>
                <div class="infoValue" :title="oneAlarmInData.askId">{{oneAlarmInData.askId}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警级别</div>
                <div class="infoValue">{{oneAlarmInData.level}}级</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">对讲状态</div>
                <div class="infoValue">{{oneAlarmInData.eventTypeName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警时间</div>
                <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">接听时间</div>
                <div class="infoValue"></div>
              </div>
            </div>
            <!-- 违章报警 -->
            <div v-else-if="oneAlarmInData.eventType === 'vioRetrograde' || oneAlarmInData.eventType === 'vioPark' || oneAlarmInData.eventType === 'vioTurnLeft' || oneAlarmInData.eventType === 'vioTurnRight'">
              <div class="infoDetail">
                <div class="infoLabel">报警类型</div>
                <div class="infoValue">{{oneAlarmInData.eventTypeName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">所属设备</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.srcName">{{oneAlarmInData.srcName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警级别</div>
                <div class="infoValue">{{oneAlarmInData.level}}级</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警时间</div>
                <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">车牌号码</div>
                <div class="infoValue">{{oneAlarmInData.carNum ? oneAlarmInData.carNum : ''}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">车辆类型</div>
                <div class="infoValue">{{oneAlarmInData.carType === undefined ? '' : carType[oneAlarmInData.carType]}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">行车方向</div>
                <div class="infoValue">{{oneAlarmInData.carDirect === undefined ? '' : carDirect[oneAlarmInData.carDirect]}}</div>
              </div>
            </div>
            <div v-else>
              <div class="infoDetail">
                <div class="infoLabel">报警类型</div>
                <div class="infoValue">{{oneAlarmInData.eventTypeName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">所属设备</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.srcName">{{oneAlarmInData.srcName}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">机构</div>
                <div class="infoValue text-ellipsis" :title="oneAlarmInData.organization">{{oneAlarmInData.organization}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警级别</div>
                <div class="infoValue">{{oneAlarmInData.level}}级</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警状态</div>
                <div class="infoValue">正在发生</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">报警时间</div>
                <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
              </div>
              <div class="infoDetail">
                <div class="infoLabel">停止时间</div>
                <div class="infoValue"></div>
              </div>
            </div>
            <div class="infoDetail" style="display: inline-block;">
              <div class="infoLabel">警情处理</div>
              <div class="infoValue">
                <Select v-model="planAlarmSelId" size="small" style="width:155px" :disabled="oneAlarmInData.alarmaffirm ? !oneAlarmInData.alarmaffirm.handaffirm2.status : true">
                  <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
              </div>
            </div>
            <div class="infoDetail" style="display: inline-block;">
              <div class="infoLabel">警情类型</div>
              <div class="infoValue">
                <Select v-model="planSelId" size="small" style="width:155px" @on-change="planChange">
                  <Option v-for="item in planList" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
              </div>
            </div>
            <div class="infoDetailother" style="margin-bottom: 5px;">
              <p style="margin-bottom: 8px;">警情信息</p>
              <Input v-model="planContent" type="textarea" :autosize="{minRows: 1,maxRows: 3}"/>
            </div>
            <div class="infoDetail" v-show="type !== 'ManualAlarm'">
              <p>报警主机操作</p>
              <div class="alarmHostBtn">
                <Button type="primary" @click="allMeth('protection')" :disabled="oneAlarmInData.type !== 'alarmHost'">布防</Button>
                <Button type="primary" @click="allMeth('removal')" :disabled="oneAlarmInData.type !== 'alarmHost'">撤防</Button>
                <Button type="primary" @click="allMeth('remove')" :disabled="oneAlarmInData.type !== 'alarmHost'">清除</Button>
              </div>
            </div>
            <div class="infoDetailother">
              <Button type="primary" v-show="type !== 'ManualAlarm'" @click="cleanAlarm">清除报警</Button>
              <Button type="primary" @click="confirmAlarm">确认报警</Button>
            </div>
          </div>
        </div>
      </div>
      <!-- 人像报警 弹框 -->
      <div v-else class="face-info">
        <div style="text-align:center;">
          <div class="tabs" :class="{'tabs-focus': faceTab === '1'}" @click="faceTab = '1'">报警信息</div>
          <div class="tabs" :class="{'tabs-focus': faceTab === '2'}" @click="faceTab = '2'">人员录像</div>
        </div>
        <div style="display:flex;" v-show="faceTab === '1'">
          <div class="face-info-left">
            <div class="face-info-item">
              <i class="font-common icon iconfont icon-Location"></i>{{alarmData.resName}}
            </div>
            <div class="face-img">
              <img :src="alarmData.faceImage ? alarmData.faceImage : '/static/noImg1.png'" alt="暂无图片">
              <img :src="alarmData.userImage ? alarmData.userImage : '/static/noImg1.png'" alt="暂无图片">
            </div>
            <div class="face-info-item">
              <div class="info-left">相似度</div>
              <div class="info-right">{{alarmData.similar + '%'}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">报警时间</div>
              <div class="info-right">{{changeFormatTime(alarmData.time)}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">底库信息</div>
              <div class="info-right">{{alarmData.groupName}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">人员姓名</div>
              <div class="info-right">{{alarmData.userName}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">性别</div>
              <div class="info-right">{{alarmData.gender === 1 ? '女' : alarmData.gender === 2 ? '男' : ''}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">年龄</div>
              <div class="info-right">{{alarmData.age}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">身份证号</div>
              <div class="info-right">{{alarmData.userCode}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">备注</div>
              <div class="info-right">{{alarmData.remark}}</div>
            </div>
            <div class="face-info-item">
              <div class="info-left">布控时间</div>
              <div class="info-right">{{alarmData.defenseTime}}</div>
            </div>
          </div>
          <div style="flex:1;">
            <div style="text-align:center;">
              <div style="height:32px;line-height:32px;">全景图</div>
              <img :src="alarmData.fullImage ? alarmData.fullImage : '/static/noImg1.png'" alt="暂无图片" style="width:480px; height:280px;display:block;">
            </div>
            <div style="width:225px;margin:12px 0 12px 10px;">
              <div class="item-select">
                <div class="item-label">警情处理</div>
                <div >
                  <Select v-model="planAlarmSelId" size="small" style="width:155px" :disabled="alarmData.alarmaffirm ? !alarmData.alarmaffirm.handaffirm2.status : true">
                    <Option v-for="item in planAlarmList" :value="item.value" :key="item.value">{{item.label}}</Option>
                  </Select>
                </div>
              </div>
              <div  class="item-select">
                <div class="item-label">警情类型</div>
                <div>
                  <Select v-model="planSelId" size="small" style="width:155px"  @on-change="planChange">
                    <Option v-for="item in planList" :value="item.value" :key="item.value">{{item.label}}</Option>
                  </Select>
                </div>
              </div>
              <div>
                <p style="margin-bottom: 8px;">警情信息</p>
                <Input v-model="planContent" type="textarea" :autosize="{minRows: 1,maxRows: 3}"/>
              </div>
            </div>
          </div>
        </div>
        <div v-show="faceTab === '2'">
          <div class="face-info-item"><i class="iconfont icon-Location"></i> {{alarmData.resName}}</div>
          <div class="video-back">
            <FaceBack :videoParam="backParam" :buttonShow="['screen', 'volume']" :show="faceTab === '2'" pluginHeight="500" sliderW="490px"></FaceBack>
          </div>
        </div>
        <div class="face-bottom-btn">
          <Button type="primary"  style="margin-right:20px;" @click="cleanAlarm">清除报警</Button>
          <Button type="primary" @click="confirmAlarm">确认报警</Button>
        </div>
      </div>
      <!-- 使用以下弹框避免视频插件遮挡弹框 -->
      <bs-modal v-model="cleanModel" title="提示" :width="416" :mask-closable="false" @on-ok="sureAlarm" @on-cancel="cancelAlarm">
        <div>
          <i class="ivu-icon ivu-icon-help-circled" style="color:#ff9900;font-size:36px;vertical-align:middle;margin:10px 20px 10px"></i>
          <span v-if="modelVal==='clean'">确定清除报警？</span>
          <span v-if="modelVal==='sure'">确认该报警？</span>
        </div>
      </bs-modal>
    </div>
  </dragBoxs>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import alarmVideoMadel from 'components/video/map3Dvideo/alarmVideoMadel'
import manualAlarmVideoMadel from 'components/video/map3Dvideo/MapVideoPreview.vue'
// import dragBoxs from 'components/DragBoxs'
import dragBoxs from 'components/dragx/Dragx.vue'
import confirmAlarmFun from '../../alarmFun/confirmAlarmFun'
import FaceBack from 'components/vehicleFace/videoBack'
import SinglePawn from 'components/video/SinglePawn.vue'

export default {
  components: {
    alarmVideoMadel,
    dragBoxs,
    manualAlarmVideoMadel,
    FaceBack,
    SinglePawn
  },
  props: {
    alarmData: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    alarmInputList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mixins: [confirmAlarmFun],
  data() {
    return {
      position: {left: 655},
      actionList: [],
      oneAlarmInData: {
        organization: '',
        name: '',
        level: '',
        channel: '',
        time: '',
        actionList: []
      },
      alarmIncount: [],
      planSelId: '',
      planList: [],
      planContent: '',
      cleanModel: false,
      modelVal: '',
      planAlarmList: [],
      planAlarmSelId: '',
      showSel: true,
      showInput: true,
      mapAlarmDeal: {},
      violationType: true,
      alarmLevelList: [
        {value: 1, label: '1级'},
        {value: 2, label: '2级'},
        {value: 3, label: '3级'},
        {value: 4, label: '4级'},
        {value: 5, label: '5级'},
        {value: 6, label: '6级'},
        {value: 7, label: '7级'},
        {value: 8, label: '8级'},
        {value: 9, label: '9级'}
      ],
      faceTab: '1',
      backParam: {}
    }
  },
  watch: {
    alarmData: {
      handler(newVal, oldVal) {
        if (this.type === 'FaceAlarm') {
          this.backParam = {
            devIp: newVal.resIp,
            devPort: parseInt(newVal.resPort),
            channel: newVal.resChannel,
            eventType: ['all'],
            typeName: '',
            typeContent: '',
            startTime: newVal.time - 10,
            endTime: newVal.time + 10,
            streamType: newVal.stream || 'all'
          }
          return
        }
        // 当点击查看的是同一条信息或者当前点击的报警求助信息状态发生变化
        if (oldVal && newVal.alarmId === oldVal.alarmId && (newVal.eventType === oldVal.eventType || newVal.eventType === 'askHelp' || newVal.eventType === 'acceptHelp')) {
          this.oneAlarmInData = this.alarmData
          return
        }
        this.showSel = true
        this.showInput = true
        this.oneAlarmInData = JSON.parse(JSON.stringify(this.alarmData))
        this.actionList = this.alarmData.actionList || []
        console.log(this.actionList)
        if (!this.actionList.length) { return }
        if (this.$refs.alarmVideo) {
          this.$refs.alarmVideo.stopAll()
          this.$refs.alarmVideo.open()
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['carType', 'carDirect']),
    ...mapGetters('map3DApplyIX', ['toolsPanelActive']),
    picType() {
      let val
      switch (this.type) {
        case 'ManualAlarm':
          val = 'handle'
          break
        case 'FaceAlarm':
          val = 'facealarm'
          break
        default:
          val = 'alarm'
          break
      }
      return val
    }
  },
  methods: {
    ...mapMutations(['SAVE_NORMAL_ALARM_LIST', 'SAVE_FIRE_ALARM_LIST', 'SAVE_ALARM_HELP_LIST', 'SAVE_VIDEO_ALARM_LIST', 'SAVE_INTELLIGENT_ALARM_LIST', 'SAVE_ISMODAL_SURE_OR_CLEAN']),
    ...mapActions(['getPrearranged', 'getFirePlan', 'alarmToBeSure', 'recordLog', 'getMapAlarmDealList', 'getMapAlarmDealStatus', 'protectionAction', 'removalAction', 'removeAction', 'getMapAlarmPower', 'manualAlarmToBeSure']),
    ...mapActions('map3DApplyIX', ['changeOpenAlarmPanel']),
    getalarmDealList() {
      // 获取警情处理列表
      let type = 'alarm'
      this.getMapAlarmDealList({ page: 1, limit: 1000, type }).then((res) => {
        res.data.forEach(item => {
          this.planAlarmList.push({ label: item.name, value: item.name })
          this.planAlarmSelId = this.planAlarmList[0].value
        })
      }).catch(err => {
        console.log('getMapAlarmDealList error: ' + err)
        this.errorMsg('警情处理列表获取失败')
      })
    },
    getAlarmTypeList() {
      this.getPrearranged({ page: 1, limit: 1000 }).then(suc => {
        for (let i = 0; i < suc.data.length; i++) {
          this.planList.push({
            value: suc.data[i].name,
            label: suc.data[i].name,
            content: suc.data[i].content
          })
        }
        this.planSelId = this.planList[0].value
        this.planContent = this.planList[0].content
      }).catch(err => {
        console.log('getPrearranged error: ' + err)
      })
    },
    close() {
      // 关闭弹框时 先关闭视频对讲
      if (this.type === 'ManualAlarm' && this.oneAlarmInData.singlePawnId) {
        this.$refs.singlePawn.closeVideo()
      }
      this.$emit('close')
      // this.planAlarmSelId = ''
      // this.planSelId = ''
      // this.planContent = ''
      this.showSel = true
      this.showInput = true
    },
    stopCalling() {
      this.$refs.singlePawn.isPlaying = false
    },
    changeFormatTime(time) {
      return this.$moment(parseInt(time) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    planChange(val) {
      if (val !== '') {
        this.showInput = false
        for (let i = 0; i < this.planList.length; i++) {
          if (this.planList[i].value === val) {
            this.planContent = this.planList[i].content
            break
          }
        }
      } else {
        this.showInput = true
        this.planContent = ''
      }
    },
    planAlarmChange(val) {
      if (val) {
        this.showSel = false
      } else {
        this.showSel = true
      }
    },
    cleanAlarm() {
      this.modelVal = 'clean'
      this.cleanModel = true
    },
    confirmAlarm() {
      if (!this.planContent) {
        this.warningMsg('警情信息不能为空')
        return
      }
      if (this.type === 'ManualAlarm') {
        if (!this.oneAlarmInData.name) {
          this.warningMsg('报警源信息名称不能为空')
          return
        }
      }
      this.modelVal = 'sure'
      this.cleanModel = true
    },
    sureAlarm() {
      // 手工报警确认报警
      if (this.type === 'ManualAlarm') {
        let alarmSureInfo = {
          alarmDeal: this.planAlarmSelId,
          situationType: this.planSelId,
          alarmContent: this.planContent
        }
        let params = {
          orgName: this.oneAlarmInData.organization || '',
          srcName: this.oneAlarmInData.name,
          eventType: 'manualAlarm',
          level: this.oneAlarmInData.level,
          dealState: 'process',
          devIp: this.actionList.eid ? this.actionList.eid.ip : '',
          devPort: this.actionList.eid ? this.actionList.eid.cport : '',
          channel: this.actionList.eid ? this.actionList.chan : '',
          ackContent: JSON.stringify(alarmSureInfo),
          time: this.oneAlarmInData.time,
          ackTime: Date.now() / 1000
        }
        this.manualAlarmToBeSure(params).then(res => {
          this.close()
          this.changeOpenAlarmPanel(false)
        }).catch(() => {
          this.errorMsg('确认报警失败')
        })
        this.cleanModel = false
      } else {
        // 其他类型报警确认报警
        if (this.modelVal === 'sure' && !this.alarmData.alarmPermission.alarmConfirm) {
          this.warningMsg('该报警资源无报警确认权限')
          return
        } else if (this.modelVal === 'clean' && !this.alarmData.alarmPermission.alarmClean) {
          this.warningMsg('该报警资源无报警清除权限')
          return
        }
        let alarmArr = []
        const alarmData = this.alarmData
        let alarmSureInfo
        // 1级确认还是2级确认还是自动确认
        if (!alarmData.alarmaffirm || alarmData.alarmaffirm.handaffirm.status || (alarmData.alarmaffirm.autoaffirm && alarmData.alarmaffirm.autoaffirm.status)) {
          alarmSureInfo = {
            situationType: this.planSelId,
            alarmContent: this.planContent
          }
        } else if (!alarmData.alarmaffirm.handaffirm.status && alarmData.alarmaffirm.handaffirm2.status) {
          alarmSureInfo = {
            alarmDeal: this.planAlarmSelId,
            situationType: this.planSelId,
            alarmContent: this.planContent
          }
        }
        alarmArr.push({
          _id: alarmData.alarmId,
          ackContent: JSON.stringify(alarmSureInfo),
          devIp: alarmData.devIp,
          devPort: alarmData.devPort,
          channel: alarmData.channel,
          eventType: alarmData.eventType,
          devId: alarmData.devId,
          channelId: alarmData.channelId
        })
        let text
        if (this.modelVal === 'sure') {
          alarmArr[0].ackType = 'process'
          text = '报警确认'
        } else if (this.modelVal === 'clean') {
          alarmArr[0].ackType = 'ignore'
          text = '报警清除'
        }
        this.alarmToBeSure(alarmArr)
          .then(res => {
            const param = {
              logType: '操作日志',
              module: '报警处理',
              operateName: text,
              operateContent: text,
              target: alarmData.name,
              deviceIp: alarmData.devIp
            }
            this.recordLog(param)
            this.successMsg(`${text}成功`)
            // 确认/清除 报警成功，需做报警列表该项的清除
            setTimeout(() => {
              this.modalAlarmClean()
            }, 0)
            // this.modalAlarmClean()
            this.close()
            this.changeOpenAlarmPanel(false)
          })
          .catch(err => {
            console.log('alarmToBeSure', err)
            this.warningMsg(`${text}失败`)
          })
        this.cleanModel = false
      }
    },
    cancelAlarm() {
      this.cleanModel = false
      this.modelVal = ''
    },
    // 报警主机布撤防
    allMeth(methType) {
      let ids = []
      ids.push(this.oneAlarmInData.devId)
      let deviceType = this.oneAlarmInData.manufacturer === 'guangtuo' ? 'guangtuo' : 'shike'
      switch (methType) {
        case 'protection':
          if (this.alarmData.alarmPermission.deployment) {
            this.protectionAction({
              ids: ids,
              type: 'dev',
              deviceType
            }).then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警主机布防',
                operateContent: '报警主机布防',
                target: this.alarmData.name,
                deviceIp: this.alarmData.devIp
              }
              this.recordLog(param)
              this.successMsg('布防成功！')
            }).catch(() => {
              this.errorMsg('布防失败！')
            })
          } else {
            this.warningMsg('该报警资源没有权限')
          }
          break
        case 'removal':
          if (this.alarmData.alarmPermission.disarming) {
            this.removalAction({
              ids: ids,
              type: 'dev',
              deviceType
            }).then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警主机撤防',
                operateContent: '报警主机撤防',
                target: this.alarmData.name,
                deviceIp: this.alarmData.devIp
              }
              this.recordLog(param)
              this.successMsg('撤防成功！')
            }).catch(() => {
              this.errorMsg('撤防失败！')
            })
          } else {
            this.warningMsg('该报警资源没有权限')
          }
          break
        case 'remove':
          if (this.alarmData.alarmPermission.clean) {
            this.removeAction({ ids: ids, type: 'dev', deviceType }).then(() => {
              const param = {
                logType: '操作日志',
                module: '报警处理',
                operateName: '报警主机清除',
                operateContent: '报警主机清除',
                target: this.alarmData.name,
                deviceIp: this.alarmData.devIp
              }
              this.recordLog(param)
              this.successMsg('清除成功！')
            }).catch(() => {
              this.errorMsg('清除失败！')
            })
          } else {
            this.warningMsg('该报警资源没有权限')
          }
          break
      }
    },
    modalAlarmClean(val) {
      let index = -1
      for (let i = 0; i < this.alarmInputList.length; i++) {
        const item = this.alarmInputList[i]
        if (item.alarmId === this.alarmData.alarmId) {
          index = i
        }
      }
      // 清除地图点位
      if (index !== -1) {
        this.alarmInputList.splice(index, 1)
        this.clearStoreData(this.alarmInputList)
        this.mapCleanPoint(this.alarmData)
      }
      this.SAVE_ISMODAL_SURE_OR_CLEAN(true)
    },
    clearStoreData(data) {
      switch (this.type) {
        case 'AlarmList':
          this.SAVE_NORMAL_ALARM_LIST(data)
          break
        case 'FireAlarmList':
          this.SAVE_FIRE_ALARM_LIST(data)
          break
        case 'AlarmHelpList':
          this.SAVE_ALARM_HELP_LIST(data)
          break
        case 'VideoAlarm':
          this.SAVE_VIDEO_ALARM_LIST(data)
          break
        case 'IntelligentAlarm':
        case 'FaceAlarm':
          this.SAVE_INTELLIGENT_ALARM_LIST(data)
          break
      }
    },
    /** 地图清除点位事件 */
    mapCleanPoint(data) {
      let type
      switch (this.type) {
        case 'AlarmHelpList':
          type = 'askHelpAlarm'
          break
        case 'AlarmList':
          type = data.eventType === 'alarmZone' ? 'alarmZone' : 'commonAlarm'
          break
        case 'FireAlarmList':
          type = 'fireAlarm'
          break
        case 'IntelligentAlarm':
          type = data.eventType === 'faceControl' ? 'faceAlarm' : 'intelligent'
          break
        case 'VideoAlarm':
          type = 'videoAlarm'
          break
      }
      if (data.point3D) {
        let obj = {
          pointIsouter: data.point3D.isouter,
          id: data.chanId || data.channelId,
          bcode: data.point3D.building3ds ? data.point3D.building3ds.code : '',
          type: type
        }
        // 对地图清除点位方法加try catch,免得影响报警功能
        try {
          this.confirmAlarmData(obj)
        } catch (err) {
          console.log('地图清楚点位方法错误')
        }
      }
    }
  },
  created() {
    this.planAlarmSelId = ''
    this.planSelId = ''
    this.showSel = true
    this.showInput = true
    this.getalarmDealList()
    this.getAlarmTypeList()
  }
}
</script>
<style lang="less" scoped>
.map-app-video-pre {
  width: 795px;
  padding: 15px;
}
.mapAppInfoContent {
  width: 100%;
  // height: 470px;
  display: flex;
  flex: 1;
  flex-direction: row;
  .infoleft {
    width: 550px;
  }
  .infoRight {
    width: 225px;
    .infoRightTittle {
      height: 26px;
      line-height: 26px;
    }
    .infoRightInfo {
      .infoDetail {
        width: 100%;
        height: 26px;
        line-height: 26px;
        clear: both;
        .infoLabel {
          width: 70px;
          float: left;
        }
        .alarmHostBtn {
          width: 100%;
          float: left;
          margin: 12px 0;
        }
        .infoValue {
          width: 140px;
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
      .manual-info {
        margin-bottom: 6px;
      }
      .infoDetailother {
        margin: 12px 0px;
      }
    }
  }
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.face-info {
  margin-top: -15px;
  .face-info-left {
    margin-right: 12px;
  }
  .face-img {
    display: flex;
    img {
      flex: 1;
      width: 140px;
      height: 180px;
      &:first-child {
        margin-right: 12px;
      }
    }
  }
  .face-info-item {
    height: 32px;
    line-height: 32px;
  }
  .info-left {
    width: 80px;
    margin: 10px 12px;
    display: inline-block;
  }
  .info-right {
    width: 140px;
    display: inline-block;
  }
  .item-select {
    display: flex;
    height: 32px;
    line-height: 32px;
    .item-label {
      width: 70px;
    }
  }
  .face-bottom-btn {
    margin-top: 12px;
    text-align: center;
  }
  .video-back {
    height: 430px;
    padding: 0 15px;
    margin-bottom: 52px;
  }
}
.tabs {
  width: 88px;
  height: 43px;
  line-height: 43px;
  font-size: 14px;
  box-sizing: border-box;
  color: #8597ad;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: #57a3f3;
  }
}
.tabs-focus {
  color: #fff;
  border-top: 2px solid #57a3f3;
}
</style>
<style lang="less">
.face-info {
  .ivu-tabs-bar {
    margin-bottom: 0;
    background: none;
  }
}
</style>
