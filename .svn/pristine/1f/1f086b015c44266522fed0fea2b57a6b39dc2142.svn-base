<!--应用模式 点击报警列表中的查看按钮显示的页面-->
<template>
  <div class="mapAppInfoalarm">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">报警视频</div>
        <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
      </div>
    </div>
    <div class="mapAppInfoContent">
      <div class="infoleft">
        <alarmVideoMadel :videoParam="actionList"></alarmVideoMadel>
      </div>
      <div class="infoRight">
        <div class="infoRightTittle">报警源信息</div>
        <div class="infoRightInfo">
          <div class="infoDetail">
            <div class="infoLabel">时间</div>
            <!-- <div class="infoValue">{{new Date(parseInt(oneAlarmInData.time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')}}</div> -->
            <div class="infoValue">{{changeFormatTime(oneAlarmInData.time)}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">机构</div>
            <div class="infoValue text-ellipsis" :title="oneAlarmInData.organization">{{oneAlarmInData.organization}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">名称</div>
            <div class="infoValue text-ellipsis" :title="oneAlarmInData.name">{{oneAlarmInData.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">级别</div>
            <div class="infoValue">{{oneAlarmInData.level}}级</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">报警类型</div>
            <div class="infoValue">{{oneAlarmInData.eventTypeName}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">计数</div>
            <div class="infoValue">
              <div class="infoValueHeight">
                <bs-scroll>
                  <div class="alarmIncountItem" v-for="(item, index) in alarmIncount" :key="index" @click="countclick(item)">{{changeFormatTime(item.time)}}</div>
                  <!-- <div class="alarmIncountItem" v-for="(item, index) in alarmIncount" :key="index">{{changeFormatTime(item.time)}}</div> -->
                </bs-scroll>
              </div>
            </div>
          </div>
          <div class="infoDetail" style="margin-top:5px;display: inline-block;">
            <div class="infoLabel">选择预案</div>
            <div class="infoValue">
              <Select v-model="selectPlanModal" size="small" style="width:100px" @on-change="emSelectClick">
                <Option v-for="item in orgList" :value="item._id" :key="item._id">{{item.name}}</Option>
              </Select>
            </div>
          </div>
          <div class="infoDetailother">
            <Input v-model="mask" type="textarea" :autosize="{minRows: 1,maxRows: 1}" />
          </div>
          <div class="infoDetailother">
            <Button type="primary" @click="closeAlarm">清除报警</Button>
            <Button type="primary" @click="confirmAlarm">确认报警</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import alarmVideoMadel from 'components/video/map3Dvideo/alarmVideoMadel'
import appFireAlarm from '../../../../assets/map/app/appFireAlarm'
import appAlarm from '../../../../assets/map/app/appAlarm'
import appPatrolIpc from '../../../../assets/map/app/appPatrolIpc.js'
import STATE from '../../../../assets/map/edit/state'
import ALARMTYPE from '../../../../assets/map/app/alarmType'
import SymbolConfig from '../../../../assets/map/SymbolConfig'
export default {
  components: {
    alarmVideoMadel
  },
  data() {
    return {
      orgList: [{ name: '测试', _id: '1' }],
      mask: '',
      // 视频参数
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
      selectPlanModal: ''
    }
  },
  watch: {
    alarmInData: {
      handler(newVal, oldVal) {
        let data = JSON.parse(JSON.stringify(newVal))
        this.oneAlarmInData = data.param[0]
      },
      deep: true
    },
    fireAlarmList: {
      handler(newVal, oldVal) {
        this.alarmIncount = JSON.parse(JSON.stringify([]))
        let dataList = JSON.parse(JSON.stringify(newVal[this.alarmInData.index]))
        this.alarmIncount = JSON.parse(JSON.stringify(dataList.param))
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      alarmInData: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmCheck, // 单个报警源信息
      fireAlarmList: ({ mapAlarmData }) => mapAlarmData.fireAlarmList, // 报警消息列表列表
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      appCurrentAlarmingList: ({ mapAlarmData }) => mapAlarmData.appCurrentAlarmingList,
      appAlarmCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCheck, // 消防点位勾选状态
      appAlarmCommonCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCommonCheck,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      appMoveSingleList: ({ mobilePatrol }) => mobilePatrol.appMoveSingleList
    })
  },
  methods: {
    ...mapMutations([
      'SET_APPDETAIL_STATE',
      'SET_APPALARM_LIST',
      'SET_APPALARMING_LIST',
      'SET_APPCURRENTALARMING_LIST',
      'SET_ALLALARMPOINTFEA',
      'SET_2D_ALARMING_LIST',
      'SET_APPMOVESINGLE_LIST',
      'SET_APPPATROL_LIST'
    ]),
    ...mapActions([
      'getFirePlan',
      'confirmWarnMessages',
      'getOneMapCommAlarm',
      'getOneMapArarlList',
      'getOneMapAllPatrolList',
      'getOneFloorPatrolList'
    ]),
    changeFormatTime(time) {
      let date = new Date(parseInt(time) * 1000).toLocaleString()
      let s = date
        .replace('年', '/')
        .replace('月', '/')
        .replace('日', '')
      return s
    },
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    closeAlarm() {
      let id
      if (this.oneAlarmInData.type === 'askHelp') {
        id = this.oneAlarmInData.bondCarmerRes._id
      } else {
        id = this.oneAlarmInData.point._id // channelId
      }
      this.processAlarmingInfo(id)
      this.close()
      this.$store.commit('SET_ONEMAPALARM_DATA', this.alarmInData.index)
    },
    confirmAlarm() {
      // let id
      // if (this.oneAlarmInData.point && this.oneAlarmInData.point._id) {
      //   id = this.oneAlarmInData.point._id
      // } else if (this.oneAlarmInData.type === 'askHelp') {
      //   id = this.oneAlarmInData.bondCarmerRes._id
      // } else {
      //   id = this.oneAlarmInData.point3D._id
      // }
      // this.processAlarmingInfo(id)
      let dataList = JSON.parse(JSON.stringify(this.fireAlarmList[this.alarmInData.index]))
      dataList.param.forEach(item => {
        item.groupId = item.devIp + '|' + item.devPort + '|' + item.channel + '|' + item.eventType
      })
      this.alarmIncount = JSON.parse(JSON.stringify(dataList.param))
      this.confirmWarnMessages({
        list: this.alarmIncount,
        ackContent: this.mask
      })
        .then(() => {
          this.closeAlarm()
        })
        .catch(err => {
          console.log(err)
          this.errorMsg('确认报警失败')
        })
    },
    // 预案选择
    emSelectClick(val) {
      this.orgList.map(item => {
        if (val === item._id) {
          this.mask = item.content
        }
      })
    },
    // 计数选择(播放录像回放)
    countclick(val) {
      let data = JSON.parse(JSON.stringify(val))
      this.actionList = []
      this.oneAlarmInData = data
      if (data.actionList) {
        data.actionList.forEach(v => {
          this.actionList.push({
            ...v,
            time: data.time
          })
        })
      } else {
        this.actionList = []
      }
    },
    // 处理消防报警
    processFireAlarmingInfo(alarming, id) {
      let alarmlist = JSON.parse(JSON.stringify(this.appAlarmList))
      let isCommonAlarm = alarming.attributes.isCommonAlarm
      if (isCommonAlarm) {
        // 判断当前处理的报警点位是不是普通报警
        if (this.appAlarmCommonCheck) {
          // 点位元素中普通报警是否勾选
          this.getOneMapCommAlarm(this.activeMap)
            .then(res => {
              // let alarmObj = appFireAlarm.addAlarm(alarmlist, res, this.isAppOuter)
              // let alarmAll = alarmObj.alarmList
              // let alarmCol = appFireAlarm.deleteOrChangeStateById(alarmlist, alarmAll, id, STATE.ARMIMG)
              // alarmlist = alarmCol.alarmList
              // this.$store.commit('SET_APPALARM_LIST', alarmlist)
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$nextTick(() => {
            this.$store.commit('SET_APPALARM_LIST', [])
          })
        }
      } else {
        // 当前处理的报警点位不是普通报警时
        if (alarming.attributes.type !== 'buildalarm') {
          // 如果报警闪烁的不是楼宇
          if (this.appAlarmCheck) {
            // 点位元素中消防报警是否勾选
            this.getOneMapArarlList(this.activeMap)
              .then(res => {
                let alarmObj = appFireAlarm.addAlarm(alarmlist, res, this.isAppOuter)
                let alarmAll = alarmObj.alarmList
                let alarmCol = appFireAlarm.deleteOrChangeStateById(alarmlist, alarmAll, id, STATE.ARMIMG)
                alarmlist = alarmCol.alarmList
                this.$store.commit('SET_APPALARM_LIST', alarmlist)
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.$nextTick(() => {
              this.$store.commit('SET_APPALARM_LIST', [])
            })
          }
        }
      }
    },
    processPatrolAlarmingInfo(alarming, id) {
      let patrollist = JSON.parse(JSON.stringify(this.appPatrolList))
      if (id) {
        // 判断当前处理的报警点位是不是普通报警
        if (this.appPatrolCheck) {
          // 点位元素中普通报警是否勾选
          if (this.isAppOuter) {
            // 巡更（地图包括楼层中的，楼层中以数组形式展示）
            this.getOneMapAllPatrolList({ mapid: this.activeMap })
              .then(res => {
                this.cancelAlarmAddPatrolIpc(patrollist, res, id)
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            // 加载楼层中的巡更点位
            this.getOneFloorPatrolList(this.levelData._id)
              .then(res => {
                this.cancelAlarmAddPatrolIpc(patrollist, res, id)
              })
              .catch(err => {
                console.log(err)
              })
          }
        }
      }
    },
    // 处理巡更报警后，如果巡更点位勾选着，需要添加地图/楼层中的巡更点位
    cancelAlarmAddPatrolIpc(patrollist, res, id) {
      let patrolAll = appPatrolIpc.addStrogePatrolIpc(patrollist, res, this.isAppOuter)
      let patrolCol = appPatrolIpc.deleteOrChangeStateById(patrollist, patrolAll, id, STATE.ARMIMG)
      patrollist = patrolCol.patrolList
      this.$store.commit('SET_APPPATROL_LIST', patrollist)
    },
    // 处理报警信息
    processAlarmingInfo(id) {
      let alarminglist = JSON.parse(JSON.stringify(this.appAlarmingList))
      let currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
      let alarming = appAlarm.getFeatureById(alarminglist, id)
      if (alarming) {
        let type = alarming.attributes.alarmType
        if (type === ALARMTYPE.FIRE || type === ALARMTYPE.COMMON) {
          this.processFireAlarmingInfo(alarming, id)
        }
        if (type === ALARMTYPE.PATROL) {
          this.processPatrolAlarmingInfo(alarming, id) // 处理巡更报警
        }
      }
      alarminglist = this.deleteAlarmById(alarminglist, id)
      currentAlarmings = this.deleteAlarmById(currentAlarmings, id)
      this.$store.commit('SET_APPALARMING_LIST', alarminglist)
      this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
    },
    deleteAlarmById(features, id) {
      if (id) {
        if (features.length > 0) {
          features.forEach((feature, index) => {
            if (feature.attributes.id === id) {
              let fea = features[index]
              features.splice(index, 1)
              this.changeAlarmPointSybol(fea)
            } else if (feature.attributes.param.channelId === id) {
              let fea = features[index]
              features.splice(index, 1)
              this.changeAlarmPointSybol(fea)
            }
          })
        } else {
          features = []
        }
      }
      return features
    },
    // 清除或确认报警之后改变点位图标状态
    changeAlarmPointSybol(fea) {
      if (fea.attributes.param.type === 'commonAlarm') {
        fea.symbol = SymbolConfig.alarmPointArmSymbol
        let fealist = JSON.parse(JSON.stringify(this.appAlarmList))
        fealist.push(fea)
        this.SET_APPALARM_LIST(fealist)
      } else if (fea.attributes.param.type === 'fireAlarm') {
        fea.symbol = SymbolConfig.fireAlarmPointSymbol
        let fealist = JSON.parse(JSON.stringify(this.appAlarmList))
        fealist.push(fea)
        this.SET_APPALARM_LIST(fealist)
      } else if (fea.attributes.param.type === 'patrolAlarm') {
        fea.symbol = SymbolConfig.patrolAppSymbol
        let fealist = JSON.parse(JSON.stringify(this.appPatrolList))
        fealist.push(fea)
        this.SET_APPPATROL_LIST(fealist)
      } else if (fea.attributes.param.type === 'singleAlarm') {
        fea.symbol = SymbolConfig.singleAlarmSymbol
        let fealist = JSON.parse(JSON.stringify(this.appMoveSingleList))
        fealist.push(fea)
        this.SET_APPMOVESINGLE_LIST(fealist)
      }
    }
  },
  created() {
    this.alarmIncount = JSON.parse(JSON.stringify([]))
    let alarmInData = JSON.parse(JSON.stringify(this.alarmInData))
    let alarmInList = JSON.parse(JSON.stringify(this.fireAlarmList[alarmInData.index]))
    this.oneAlarmInData = alarmInData.param[0]
    if (this.oneAlarmInData.actionList) {
      this.actionList = this.oneAlarmInData.actionList
    } else {
      this.actionList = []
    }
    this.alarmIncount = JSON.parse(JSON.stringify(alarmInList.param))
    let alarmType = 2
    if (this.alarmInData.type !== 'fireAlarm') {
      alarmType = 1
    }
    this.getFirePlan({ page: 1, limit: 50, type: alarmType })
      .then(res => {
        let data = JSON.parse(JSON.stringify(res.data))
        this.orgList = data
        this.mask = this.orgList[0].content
        this.selectPlanModal = this.orgList[0]._id
      })
      .catch(err => {
        console.log('getFirePlan1 error: ' + err)
        this.errorMsg('预先获取预案列表')
      })
  }
}
</script>
<style scoped>
.mapAppInfoalarm {
  display: flex;
  flex-direction: column;
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  border-radius: 5px;
  width: 750px;
  height: 500px;
  z-index: 100000000;
}

.mapAppVideoTittle {
  height: 38px;
  line-height: 38px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
}

.mapAppVideoTittle .reback {
  float: left;
  margin: 0 24px;
}

.mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}

.mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}

.mapAppInfoalarm .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: #1c3053;
}

.mapAppInfoContent {
  width: 100%;
  clear: both;
  padding: 10px;
  display: flex;
  flex: 1;
  flex-direction: row;
}

.mapAppInfoContent .infoleft {
  width: 550px;
}

.mapAppInfoContent .infoRight {
  width: 200px;
}

.mapAppInfoContent .infoRight .infoRightTittle {
  height: 26px;
  line-height: 26px;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail {
  width: 100%;
  height: 26px;
  line-height: 26px;
  clear: both;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetailother {
  margin: 5px 0px;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail .infoLabel {
  width: 50px;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail .infoValue {
  width: 140px;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail .infoValue .infoValueHeight {
  width: 100%;
  height: 100px;
  border: 1px solid #444;
  padding-left: 5px;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail .infoValue .infoValueHeight .alarmIncountItem {
  cursor: pointer;
  height: 22px;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail .infoValue .infoValueHeight .alarmIncountItem:hover {
  color: #20adff;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail > div {
  float: left;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style>
.infoDetailother .ivu-input-wrapper textarea {
  min-height: 100px !important;
}
</style>
