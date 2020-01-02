<template>
  <div class="alarm receive-alarm">
    <Row style="height:100%;">
      <Col span="14" style="height:100%;padding-right:16px;">
      <div class="alarm-left">
        <AlarmVideo ref="alarmvideopreview" @emergencyPlan="emergencyBtn"></AlarmVideo>
      </div>
      </Col>
      <Col span="10" style="height:100%;">
      <div class="alarm-right" style="height:100%;">
        <div class="alarm-sort">
          <TableTab ref="warningTab" :tabs="warningTabs" :isTip="true" :isAlarmDeal="isAlarmDeal"></TableTab>
          <div class="filter-style" @click="filterAlarm">过滤</div>
          <div class="alarm-table">
            <Table width="100%" height="420" :columns="warnListColumns" :data="receiveFireAlarmList" @on-row-click="clickWarnListRow" :highlight-row="true" @on-selection-change="selectWarnListRow" :row-class-name="rowClassName"></Table>
          </div>
          <div class="sure-message">
            <Col span="14">
              <p style="margin-bottom: 10px;">
                <i style="margin-right:38px;">警情处理</i>
                <Select v-model="alarmDealName" style="width:272px" :disabled="isDisableDeal">
                  <Option v-for="item in alarmDealSetList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </p>
              <p>
                <i style="margin-right:38px;">警情类型</i>
                <Select v-model="warnPlanSelect" style="width:272px">
                  <Option @click.native="selectWarnPlan" v-for="item in warnPlanListOpt" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </p>
              <p class="alarm-word">
                <i style="margin-right:38px;">警情信息</i>
                <Input style="width:272px" v-model="warnAffirmInfo" type="textarea" :rows="5" />
              </p>
              <div class="message-btn">
                <Button type="primary" :disabled="isHasConfirm" @click="clearWarnOpen">清除报警</Button>
                <Button type="primary" :disabled="isHasConfirm" @click="clickConfirmWarnMessages" :loading="modalloading">确认报警</Button>
                <Button type="primary" @click="defaultClick">恢复默认</Button>
                <div class="audioBox">
                  <audio ref="audio" v-for="(mic,index) in this.warnMusicList" :key="index" :src="mic.url" :id="'player' + mic.level" controls></audio>
                </div>
                <div>
                  <object id="pluginTTS" ref="pluginTTS" type="application/x-bsrvoicecastcontrol" WIDTH="0" HEIGHT="0"></object>
                </div>
              </div>
            </Col>
            <Col span="10">
              <p class="alarm-detail">报警详情</p>
              <!--消防报警 详情字段-->
              <ul class="detail-style" v-if="warningTabs[0].active">
                <li>
                  <i>报警名称：</i>
                  <p :title='activeWarnInfo.name'>{{ activeWarnInfo.name }}</p>
                </li>
                <li>
                  <i>报警源：</i>
                  <p :title='activeWarnInfo.srcName'>{{ activeWarnInfo.srcName }}</p>
                </li>
                <li>
                  <i>报警子类型：</i>
                  <p :title='this.alarmZoneType[activeWarnInfo.subtype]'>{{ this.alarmZoneType[activeWarnInfo.subtype] }}</p>
                </li>
                <li>
                  <i>机构：</i>
                  <p :title='activeWarnInfo.organization ? activeWarnInfo.organization: activeWarnInfo.orgName'>{{ activeWarnInfo.organization ? activeWarnInfo.organization: activeWarnInfo.orgName }}</p>
                </li>
                <li>
                  <i>报警级别：</i>
                  <p :title='activeWarnInfo.level'>{{ activeWarnInfo.level }}</p>
                </li>
                <li>
                  <i>报警状态：</i>
                  <p>{{activeWarnInfo.name === undefined ? '' : ''}}</p>
                </li>
                <li>
                  <i>报警时间：</i>
                  <p :title='activeWarnInfo.time ? $moment(parseInt(activeWarnInfo.time) * 1000).format("YYYY-MM-DD HH:mm:ss") : ""'>{{ activeWarnInfo.time ? $moment(parseInt(activeWarnInfo.time) * 1000).format('YYYY-MM-DD HH:mm:ss') : ''}}</p>
                </li>
                <li>
                  <i>停止时间：</i>
                  <p>{{ activeWarnInfo.endTime ? $moment(parseInt(activeWarnInfo.endTime) * 1000).format('YYYY-MM-DD HH:mm:ss') : '' }}</p>
                </li>
              </ul>
            </Col>
          </div>
        </div>
      </div>
      </Col>
    </Row>
    <div v-if="warnModal" class="warn-modal-clear">
      <iframe v-if="warnModal"></iframe>
      <div class="modal-mask-alert" @click='warnModal = false'></div>
      <div class="list-box">
        <div>
          <div style="position:absolute;top:30px;left:20px">
            <i class="ivu-icon ivu-icon-help-circled" style="fontSize:36px;color:#ff9900;"></i>
          </div>
          <span style="margin:40px 15px 40px 65px;display:inline-block">提示：确认清除报警吗?</span>
        </div>
        <div class="warn-modal-footer">
          <Button @click="clearWarnOk" type="primary" style="float: right;marginRight:40px">确认</Button>
          <Button @click="warnModal = false" type="ghost" style="float: right;marginRight:20px">取消</Button>
        </div>
      </div>
    </div>
    <div v-if="ttsModal">
      <iframe v-if="ttsModal"></iframe>
      <Modal v-model="ttsModal" :mask-closable="false" width="430">
        <div>
          <div style="position:absolute;top:30px;left:20px">
            <i class="ivu-icon ivu-icon-help-circled" style="fontSize:36px;color:#ff9900;"></i>
          </div>
          <a href="/static/plugin/ClientVoiceBroadcastSetup.exe" download="ClientVoiceBroadcastSetup.exe" style="margin:30px 0px 35px 70px;display:inline-block;font-size:14px;">提示:未发现TTS报警语音软件，请点击下载！</a>
        </div>
        <div slot="footer">
          <Button type="ghost" @click="ttsModal = false">取消</Button>
        </div>
      </Modal>
    </div>
    <dragBoxs :modal="isShowDrog" @close="closeDragBox" title="应急预案" :isIframe="true" :isShowZoom="false" :index="101">
      <div slot="context" class="emHome">
        <div class="emEditLeft">
          <div class="emtop">
            <div class="rmtopImg">
              <div class="buildEditImg">
                <span>选择预案</span>
                <Select style="width:158px" v-model="formName" placeholder="请选择" @on-change="changeTask">
                  <Option v-for="(item, index) in formDataList" :value="item.value" :key="index">{{item.lable}}</Option>
                </Select>
                <div class="buildImg">
                  <img v-if="emergencyData.planPhoto" @onerror="errorUrl" :src="emergencyData.planPhoto">
                </div>
              </div>
            </div>
          </div>
          <div class="emtBottom">
            <div class="emtBottomText">
              <Input readonly v-model="emergencyData.remark" type="textarea" :rows="3" :autosize="{minRows: 3, maxRows: 5}" placeholder="请输入文本信息。。。" />
            </div>
          </div>
        </div>
        <div class="emEditRight">
          <span>预案执行人</span>
          <Table height="458" width="450" size="small" :columns="emColumns" :data="emergencyData.group"></Table>
          <Button type="primary"  @click="onEmergencyBtn">确认</Button>
        </div>
      </div>
    </dragBoxs>
    <FilterAlarm v-if="filterIsShow" @getPoints="getPoints" @setCount="setCount" @setalarmFilters="setalarmFilters"></FilterAlarm>
  </div>
</template>
<script>
import FilterAlarm from './filterAlarm'
import fireAlarm from './fireAlarm.js'
import TableTab from '../settings/equipment/tableTab'
import AlarmVideo from '../warning/AlarmVideo'
import '../warning/style/warning.css'
import dragBoxs from '../../components/DragBoxs'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  components: {
    TableTab,
    AlarmVideo,
    dragBoxs,
    FilterAlarm
  },
  mixins: [fireAlarm],
  data() {
    return {
      receiveFireAlarmList: [],
      isAlarmDeal: 'alarmDealFlag',
      isDisableDeal: false,
      filterIsShow: false,
      isShowDrog: false,
      emergencyData: {
        planPhoto: '',
        remark: '',
        orgid: '',
        group: [],
        plan: '',
        planId: null
      },
      // 表单数据
      emColumns: [
        {
          title: '序号',
          key: 'name',
          minWidth: 20,
          align: 'center',
          ellipsis: true,
          type: 'index'
        },
        {
          title: '姓名',
          key: 'name',
          minWidth: 60,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.name)])
          }
        },
        {
          title: '职务',
          key: 'name',
          align: 'center',
          minWidth: 60,
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.position)])
          }
        },
        {
          title: '电话',
          key: 'name',
          minWidth: 60,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('div', [h('strong', params.row.phone)])
          }
        }
      ],
      formName: '',
      formData: [],
      formDataList: [],
      isEmergencyModal: false, // 应急预案模态框
      alarmDealName: '',
      alarmDealSetList: [],
      emergenTypeList: [
        {value: '0', lable: '3,4'},
        {value: '1', lable: '6,7'},
        {value: '2', lable: '9,10,11'},
        {value: '3', lable: '15'},
        {value: '4', lable: '13'},
        {value: '5', lable: '17,18'}
      ],
      allTvWallList: '' // 电视墙列表
    }
  },
  computed: {
    ...mapState({
      warnCounts: ({ firecontrol }) => firecontrol.fireAlarmCounts,
      warnNewData: ({ firecontrol }) => firecontrol.fireAlarmNewData,
      warningTabs: ({ firecontrol }) => firecontrol.warningTabs,
      fireAlarmData: ({ firecontrol }) => firecontrol.fireAlarmData,
      activeWarnInfo: ({ firecontrol }) => firecontrol.activeWarnInfo,
      confirmFireAlarm: ({ firecontrol }) => firecontrol.confirmFireAlarm
    })
  },
  watch: {
    fireAlarmData() {
      this.receiveFireAlarmList = JSON.parse(JSON.stringify(this.fireAlarmData)).slice(0, 100)
    }
  },
  created() {
    this.CLEAR_TAB_COUNTS()
    this.setCount()
    this.getTVList().then(res => {
      this.allTvWallList = res.data
    })
    // 3.获取报警参数及音乐列表
    this.getAlarmLevel()
      .then(suc => {
        this.warnParametersList = JSON.parse(JSON.stringify(suc.data))
        this.getFireAlarmLists().then(suc => {
          this.receiveFireAlarmList = JSON.parse(JSON.stringify(this.fireAlarmData)).slice(0, 100)
        })
        // 4.获取并设置音频文件
        this.getPoliceFile({ page: 1, limit: 100 })
          .then(suc => {
            let arr = suc.data.results
            // 5-1 创建音乐播放器列表
            for (let i = 0; i < this.warnParametersList.length; i++) {
              if (this.warnParametersList[i].policeWhistleNameID) {
                for (let r = 0; r < arr.length; r++) {
                  if (this.warnParametersList[i].policeWhistleNameID === arr[r]._id) {
                    this.warnMusicList.push({
                      status: this.warnParametersList[i].msgVoice,
                      url: '/api/upload?type=sys&id=' + arr[r].audioId,
                      time: this.warnParametersList[i].playTime,
                      level: this.warnParametersList[i].level
                    })
                  }
                }
              } else {
                this.warnMusicList.push({
                  status: this.warnParametersList[i].msgVoice,
                  url: '',
                  time: this.warnParametersList[i].playTime,
                  level: this.warnParametersList[i].level
                })
              }
            }
          })
          .catch(err => {
            console.log('getPoliceFile error: ' + err)
          })
      })
      .catch(err => {
        console.log('getAlarmLevel error: ' + err)
      })
    // 预先获取预案列表
    this.getPrearranged({ page: 1, limit: 100 })
      .then(suc => {
        this.warnPlanList = JSON.parse(JSON.stringify(suc.data))
        this.warnPlanListOpt = []
        for (let i = 0; i < this.warnPlanList.length; i++) {
          this.warnPlanListOpt.push({
            value: this.warnPlanList[i].name,
            label: this.warnPlanList[i].name
          })
        }
        this.warnPlanSelect = this.warnPlanListOpt[0].value
        this.warnAffirmInfo = this.warnPlanList[0].content
      })
      .catch(err => {
        console.log('getPrearranged error: ' + err)
      })
  },
  methods: {
    ...mapActions([
      'confirmWarnMessages',
      'getPrearranged',
      'getAlarmLevel',
      'getPoliceFile',
      'emergencyAction',
      'clearNavWarningData',
      'getFireAlarmCounts',
      'getTVList',
      'getTvWallSceneList',
      'changeCurScene',
      'getAlarmWallInfo',
      'getFireAlarmLists'
    ]),
    ...mapMutations(['SET_ACTIVE_WARN_INFO', 'SET_FIRE_ALARM_DATA', 'CLEAR_FIREALARM_VIDEOS', 'SET_INDEX', 'REDUCE_TAB_COUNTS', 'CLEAR_TAB_COUNTS']),
    rowClassName(row, index) {
      if (row.dealState === 'process' || row.dealState === 'ignore') {
        return 'demo-table-error-row'
      } else {
        return ''
      }
    },
    setCount() {
      this.getFireAlarmCounts()
    },
    setalarmFilters() {
      this.getFireAlarmLists().then(suc => {
        this.receiveFireAlarmList = JSON.parse(JSON.stringify(this.fireAlarmData)).slice(0, 100)
        this.SET_ACTIVE_WARN_INFO({})
      })
    },
    getPoints() {
      this.filterIsShow = false
    },
    filterAlarm() {
      this.filterIsShow = !this.filterIsShow
    },
    /**
     * 模态框是否显示
     * @method closeDragBox
     */
    closeDragBox() {
      this.isShowDrog = false
    },
    /**
     * 下拉框切换数据赋值
     * @method changeTabs
     * @param {String} val 预案ID
     */
    changeTask(val) {
      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i]._id === val) {
          this.emergencyData.planPhoto = this.formData[i].planPhoto
          this.emergencyData.remark = this.formData[i].remark
          this.emergencyData.group = this.formData[i].group
          this.emergencyData.plan = this.formData[i].plan
        }
      }
    },
    errorUrl(event) {
      let img = event.srcElement
      img.src = '/api/upload?id=' + this.formData.planPhoto
      img.onerror = null
    },
    emergencyType(val, lists) {
      for (const loption of lists) {
        if (loption.value === val) {
          return loption.lable
        }
      }
    },
    /**
     * 应急预案模态框判断 显示
     * @method emergencyBtn
     */
    emergencyBtn(status) {
      console.log(status, 'status')
      this.formDataList = []
      this.formData = []
      this.emergencyAction({planId: status}).then(res => {
        this.formData = JSON.parse(JSON.stringify(res.results))
        if (this.formData.length === 0) {
          this.errorMsg('请配置预案内容')
          return
        }
        this.formData.forEach((item, index) => {
          this.formDataList.push({lable: item.name, value: item._id})
        })
        this.formName = this.formDataList[0].value
        this.emergencyData.planPhoto = this.formData[0].planPhoto
        this.emergencyData.remark = this.formData[0].remark
        this.emergencyData.group = this.formData[0].group
        this.emergencyData.plan = this.formData[0].plan
        this.isShowDrog = true
      })
    },
    /**
     * 应急预案模态框判断 关闭
     * @method onEmergencyBtn
     */
    onEmergencyBtn() {
      this.isShowDrog = false
    },
    // 关闭页面 调用所有清空操作
    closeAllMethods() {
      this.SET_FIRE_ALARM_DATA([])
      this.CLEAR_FIREALARM_VIDEOS()
      // warnPlayerStop方法里做了关于页面全局变量、监听、定时器等清除操作
      this.warnPlayerStop()
      this.SET_ACTIVE_WARN_INFO({})
      if (this.warnNewData.eventType === 'fireAlarm' || this.warnNewData.eventType === 'fireFailure') {
        this.clearNavWarningData({})
      }
    },
    // 电视墙恢复默认
    defaultClick() {
      if (this.wallChannelIdList.length === 0) {
        this.warningMsg('请先选择报警信息')
        return
      }
      let actionWall
      this.getAlarmWallInfo(this.channelId).then(res => {
        if (res.data) {
          actionWall = res.data.wall
          this.allTvWallList.forEach((item, index) => {
            if (item._id === actionWall) {
              this.SET_INDEX(index)
              this.defaultScenesId = item.defaultscene
            }
          })
          this.getTVList().then(res => {
            this.getTvWallSceneList(actionWall).then(val => {
              val.data.forEach(v => {
                if (this.defaultScenesId && v._id === this.defaultScenesId) {
                  this.changeCurScene(v)
                  this.$Notice.success({
                    title: '提示',
                    desc: '恢复默认成功',
                    duration: 1
                  })
                }
              })
            })
          }).catch(err => {
            // 此action没有返回对象  如果有对象则是报错了
            if (err) {
              this.$Notice.error({
                title: '错误',
                desc: '电视墙接口获取失败',
                duration: 0
              })
            }
          })
        } else {
          this.warningMsg('该报警未配置联动电视墙')
        }
      })
    }
  },
  beforeDestroy() {
    this.closeAllMethods()
    this.alarmTitleClick = null
  }
}
</script>
<style scoped>
.alarm {
  padding: 16px 0;
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.alarm-left {
  width: 100%;
  height: calc(100% - 60px);
  background: #171717;
}

.alarm-right {
  display: flex;
  flex-direction: column;
}

h3 {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  background: #434343;
  padding-left: 10px;
  font-weight: normal;
  margin-bottom: 5px;
}

.ivu-tabs {
  height: 300px;
}

.alarm-sort {
  /* margin-top: 10px; */
  min-width: 528px;
  flex: 1;
  background: #1c3054;
  overflow: auto;
}

.alarm-table {
  margin-top: 0;
}

.sure-message {
  margin-top: 10px;
  padding: 10px;
  float: left;
  width: 100%;
  background: #1c3054;
  border-top: 10px solid #0c1b32;
  /* padding-bottom: 20px; */
}

.sure-message p {
  display: block;
}

.sure-message label {
  width: 90px;
  margin-bottom: 10px;
  margin-right: 10px;
  float: left;
}

.sure-message li button {
  width: 90px;
  margin: 0 10px 10px 0;
}

.sure-message p i {
  float: left;
  line-height: 32px;
  font-style: normal;
  margin-right: 10px;
}

.alarm-word {
  margin: 10px 0;
}

textarea.ivu-input {
  height: 115px;
}

.ivu-input {
  height: 200px;
}

.message-btn {
  overflow: hidden;
  padding: 10px 0 0 94px;
}

.message-btn p {
  overflow: hidden;
}

#warnPlayer {
  opacity: 0;
}

.warn-modal-clear {
  width: 400px;
  height: 170px;
  position: absolute;
  z-index: 999999;
  position: absolute;
  left: calc(50% - 165px);
  top: 160px;
}

.warn-modal-clear iframe,
.warn-modal-clear .list-box {
  border-radius: 5px;
  background-color: #171717;
  position: absolute;
  z-index: 3;
  font-size: 14px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 1px solid #373737;
}

.modal-mask-alert {
  position: fixed;
  min-width: 1200px;
  z-index: 1;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #171717;
  filter: alpha(Opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
}

.audioBox {
  position: fixed;
  top: 2000px;
  left: 1000px;
}
.emHome {
  display: -ms-flexbox;
  display: flex;
  overflow: auto;
  -ms-flex: 1;
  flex: 1;
  font-size: 14px;
  background: #1c3053;
  height: 668px;
  width: 900px;
  padding: 24px 22px;
}
.emHome .emEditLeft {
  display: flex;
  background: #1c3053;
  margin-right: 15px;
  flex-direction: column;
  /* justify-content: space-between; */
  width: 50%;
  max-width: 800px;
}
.emHome .emEditLeft .emtop {
  display: flex;
  flex-direction: column;
}
.emHome .emEditLeft .emtop .rmtopImg {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.emHome .emEditLeft .emtop .rmtopImg .buildEditImg {
  flex: 1;
}
.emHome .emEditLeft .emtop .rmtopImg .buildEditImg .buildImg {
  width: 412px;
  /* max-width: 800px;
  max-height: 580px; */
  border: 1px solid #5676a9;
  border-radius: 5px;
  /* min-height: 600px; */
  margin: 20px 0px;
  height: 472px;
}
.buildImg img {
  width: 410px;
  height: 470px;
  border-radius: 5px;
}
.emHome .emEditRight {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1c3053;
  margin-right: 15px;
  width: 100%;
}
.emEditRight button {
  width: 55px;
  margin-top: 50px;
  margin-left: 320px;
}
.emEditRight > span {
  margin: 16px 0px;
}
.emHome .emEditLeft .emtBottom {
  width: 412px;
}
.emtBottomText {
  flex: 1;
  color: #000;
  padding: 3px;
}
.detail-style {
  margin-left: 16px;
}
.detail-style li {
  padding-bottom: 10px;
}
.detail-style li i {
  font-style: normal;
}
.detail-style li p {
  display: inline-block;
}
.alarm-detail {
  margin-bottom:6px;
  line-height:32px;
  background-color:#244575;
  padding-left:10px;
}
.filter-style {
  width:76px;
  cursor: pointer;
  text-align: center;
  position:absolute;
  top:0;
  right:0;
  height:40px;
  line-height:40px;
}
</style>
<style>
.ivu-table .demo-table-error-row td{
    background-color: #1c3252;
    opacity: 0.55;
}
</style>
