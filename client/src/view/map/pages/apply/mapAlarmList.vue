<!--应用模式 点击工具栏报警按钮显示的报警列表页面  -->
<template>
  <div :class="alarmDivClass">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="reback">消息列表</div>
        <div class="detail">
          <Select v-model="org" size="small" style="width:100px" @on-change="getOneAlarmType" :disabled="isActiveAlarmList">
            <Option v-for="item in orgList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <div class="infoTop">
      <bs-scroll ref="scroller">
        <transition-group v-if="mapAlarmList.length >= 0" name="contrastList" tag="div" class="contrastList">
          <div class="infoHome" v-for="(item, index) in mapAlarmList" :key="item._id">
            <!-- 普通报警，消防报警 -->
            <div v-if="item.type === 'commonAlarm' || item.type === 'fireAlarm'">
              <Badge :count="item.param.length" overflow-count="10">
                <div class="infoTopLeft">
                  <div class="infoTopLeftMain">
                    <!-- 报警点位名称 -->
                    <div class="infoTopItemLeft" :title="item.name">{{item.name}}</div>
                    <!-- 报警时间 -->
                    <!--<div class="infoTopItemRight" :title="new Date(parseInt(item.param[0].time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')">{{new Date(parseInt(item.param[0].time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')}}</div>-->
                    <div class="infoTopItemRight" :title="changeFormatTime(item.param[0].time)">{{changeFormatTime(item.param[0].time) }}</div>
                  </div>
                  <div class="infoTopLeftMain">
                    <!-- 报警区域 -->
                    <div class="infoTopItemLeft" :title="item.param[0].organization">{{item.param[0].organization}}</div>
                    <!-- 报警级别 -->
                    <div class="infoTopItemRight">{{item.param[0].level}}级</div>
                  </div>
                </div>
                <div class="infoTopRight">
                  <div class="infoTopRightBtn" @click="ignoreSingoneModel(item, index)" :disabled="isActiveAlarmList">忽略</div>
                  <div class="infoTopRightBtn" @click="openSingone(item, index)" :disabled="isActiveAlarmList">查看</div>
                </div>
              </Badge>
            </div>
            <!-- 单兵报警 -->
            <div v-if="item.type === 'singleAlarm'">
              <Badge :count="item.param.length" overflow-count="10">
                <div class="infoTopLeft">
                  <div class="infoTopLeftMain">
                    <!-- 报警点位名称 -->
                    <div class="infoTopItemLeft" :title="item.name">{{item.name}}</div>
                    <!-- 报警时间 -->
                    <div class="infoTopItemRight" :title="item.param[0].time">{{item.param[0].time}}</div>
                  </div>
                  <div class="infoTopLeftMain">
                    <!-- 报警区域 -->
                    <div class="infoTopItemLeft" :title="item.param[0].user.position">{{item.param[0].user.position}}</div>
                    <!-- 报警级别 -->
                    <!-- <div class="infoTopItemRight">{{item.param[0].level}}级</div> -->
                  </div>
                </div>
                <div class="infoTopRight">
                  <div class="infoTopRightBtn" @click="ignoreSingoneModel(item, index)" :disabled="isActiveAlarmList">忽略</div>
                  <div class="infoTopRightBtn" @click="openSingone(item, index)" :disabled="isActiveAlarmList">查看</div>
                </div>
              </Badge>
            </div>
            <div v-if="item.type === 'patrolAlarm'">
              <Badge :count="item.param.length" overflow-count="10">
                <div class="infoTopLeft">
                  <div class="infoTopLeftMain">
                    <!-- 报警点位名称 -->
                    <div class="infoTopItemLeft" :title="item.name">{{item.name}}</div>
                    <!-- 报警时间 -->
                    <div class="infoTopItemRight" :title="$moment(item.param[0].message.updatedAt).format('YYYY-MM-DD HH:mm')">{{$moment(item.param[0].message.updatedAt).format('YYYY-MM-DD HH:mm')}}</div>
                  </div>
                  <div class="infoTopLeftMain">
                    <!-- 报警区域 -->
                    <div class="infoTopItemLeft" :title="item.param[0].message.position">{{item.param[0].message.position}}</div>
                    <!-- 报警级别 -->
                    <!-- <div class="infoTopItemRight">{{item.param[0].level}}级</div> -->
                  </div>
                </div>
                <div class="infoTopRight">
                  <div class="infoTopRightBtn" @click="ignoreSingoneModel(item, index)" :disabled="isActiveAlarmList">忽略</div>
                  <div class="infoTopRightBtn" @click="openSingone(item, index)" :disabled="isActiveAlarmList">查看</div>
                </div>
              </Badge>
            </div>
            <div v-if="item.type === 'askHelp'">
              <Badge :count="item.param.length" overflow-count="10">
                <div class="infoTopLeft">
                  <div class="infoTopLeftMain">
                    <!-- 报警点位名称 -->
                    <div class="infoTopItemLeft" :title="item.name">{{item.name}}</div>
                    <!-- 报警时间 -->
                    <div class="infoTopItemRight" :title="$moment(item.param[0].bondCarmerRes.updatedAt).format('YYYY-MM-DD HH:mm')">{{$moment(item.param[0].bondCarmerRes.updatedAt).format('YYYY-MM-DD HH:mm')}}</div>
                  </div>
                  <div class="infoTopLeftMain">
                    <!-- 报警区域 -->
                    <div class="infoTopItemLeft" :title="item.param[0].organization">{{item.param[0].organization}}</div>
                    <!-- 报警级别 -->
                    <!-- <div class="infoTopItemRight">{{item.param[0].level}}级</div> -->
                  </div>
                </div>
                <div class="infoTopRight">
                  <div class="infoTopRightBtn" @click="ignoreSingoneModel(item, index)" :disabled="isActiveAlarmList">忽略</div>
                  <div class="infoTopRightBtn" @click="openSingone(item, index)" :disabled="isActiveAlarmList">查看</div>
                </div>
              </Badge>
            </div>
          </div>
        </transition-group>
      </bs-scroll>
    </div>
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">
          <Checkbox v-model="single" :disabled="isActiveAlarmList">暂停接收</Checkbox>
        </div>
      </div>
    </div>
    <Modal title="提示" v-model="confirmModel" :mask-closable="false" @on-ok="confirm" @on-cancel="cancel" width='366'>
      <p>确定忽略请求？</p>
    </Modal>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appFireAlarm from '../../../../assets/map/app/appFireAlarm'
import appAlarm from '../../../../assets/map/app/appAlarm'
import STATE from '../../../../assets/map/edit/state'
import ALARMTYPE from '../../../../assets/map/app/alarmType'
import appPatrolIpc from '../../../../assets/map/app/appPatrolIpc.js'
import appMoveSingle from '../../../../assets/map/app/appMoveSingle.js'
export default {
  data() {
    return {
      alarmDivClass: 'mapAppInfo',
      isActiveAlarmList: false,
      org: 'all',
      orgList: [
        { label: '全部', value: 'all' },
        // {label: '人员布控', value: '2'},
        // {label: '车辆布控', value: '3'},
        { label: '普通报警', value: 'commonAlarm' },
        { label: '消防报警', value: 'fireAlarm' },
        { label: '巡更报警', value: 'patrolAlarm' }
      ],
      mapAlarmList: [],
      single: false,
      SingoneVal: null,
      SingoneIndex: 0,
      confirmModel: false
    }
  },
  computed: {
    ...mapState({
      fireAlarmList: ({ mapAlarmData }) => mapAlarmData.fireAlarmList, // 报警消息列表列表
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      appAlarmCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCheck, // 消防点位勾选状态
      appAlarmCommonCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCommonCheck,
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      appCurrentAlarmingList: ({ mapAlarmData }) => mapAlarmData.appCurrentAlarmingList,
      appPatrolList: ({ patrolData }) => patrolData.appPatrolList,
      appPatrolCheck: ({ patrolData }) => patrolData.appPatrolCheck,
      appPageDetail: ({ mapAreaData }) => mapAreaData.appPageDetail,
      appMoveSingleList: ({ mobilePatrol }) => mobilePatrol.appMoveSingleList,
      appMoveSingleCheck: ({ mobilePatrol }) => mobilePatrol.appMoveSingleCheck,
      currentMapExtent: ({ mapGisData }) => mapGisData.currentMapExtent
    })
  },
  watch: {
    // 报警列表的遮罩效果
    appPageDetail(val) {
      if (val === 'alarmAppVideo' || val === 'patrolList') {
        this.isActiveAlarmList = true
        this.alarmDivClass = 'mapAppInfoIsActive'
      } else {
        this.isActiveAlarmList = false
        this.alarmDivClass = 'mapAppInfo'
      }
    },
    single(val) {
      if (val) {
        this.$store.commit('SET_APPALARM_TYPE', 'stopReceive')
      } else {
        this.$store.commit('SET_APPALARM_TYPE', this.org)
      }
    },
    fireAlarmList: {
      handler(newVal, oldVal) {
        this.mapAlarmList = JSON.parse(JSON.stringify([]))
        this.mapAlarmList = JSON.parse(JSON.stringify(newVal))
        this.clearAlarming()
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'getMobilePatrol',
      'mapReceiveWarnning',
      'getOneMapArarlList',
      'getOneMapCommAlarm',
      'getOneMapAllPatrolList',
      'getOneFloorPatrolList'
    ]),
    ...mapMutations([
      'GET_ONEMAPALARM_DATA',
      'SET_APPALARM_LIST',
      'SET_ONEMAPALARM_DATA',
      'SET_APPALARMING_LIST',
      'SET_APPCURRENTALARMING_LIST',
      'SET_APPALARM_TYPE',
      'SET_APPPATROL_LIST'
    ]),
    changeFormatTime(time) {
      let date = new Date(parseInt(time) * 1000).toLocaleString()
      let s = date
        .replace('年', '/')
        .replace('月', '/')
        .replace('日', '')
        .replace('下午', '')
        .replace('上午', '')
      return s
    },
    // 清除所有正在闪烁的点位
    clearAlarming() {
      if (this.fireAlarmList.length === 0) {
        let alarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
        alarmings.forEach(element => {
          let id = element.attributes.id
          this.processAlarmingInfo(id)
        })
      }
    },
    openSingone(val, index) {
      val.index = index
      this.$store.commit('GET_ONEMAPALARM_DATA', JSON.parse(JSON.stringify(val)))
    },
    confirm() {
      this.ignoreSingone(this.SingoneVal, this.SingoneIndex)
    },
    cancel() {
      this.SingoneVal = null
      this.SingoneIndex = 0
      this.confirmModel = false
    },
    ignoreSingoneModel(val, index) {
      this.SingoneVal = val
      this.SingoneIndex = index
      this.confirmModel = true
    },
    ignoreSingone(val, index) {
      this.$store.commit('SET_ONEMAPALARM_DATA', JSON.parse(JSON.stringify(index)))
      let id = null
      if (val.param[0].point) {
        if (val.param[0].point._id) {
          id = val.param[0].point._id
        } else {
          id = val.param[0].user._id
        }
      } else if (val.param[0].point3D) {
        if (val.param[0].point3D._id) {
          id = val.param[0].point3D._id
        } else {
          id = val.param[0].user._id
        }
      } else if (val.param[0]._id) {
        id = val.param[0]._id
      } else if (val.param[0].bondCarmerRes) {
        id = val.param[0].bondCarmerRes._id
      } else {
        id = val.param[0].user._id
      }
      this.processAlarmingInfo(id)
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
              let alarmObj = appFireAlarm.addAlarm(alarmlist, res, this.isAppOuter)
              let alarmAll = alarmObj.alarmList
              let alarmCol = appFireAlarm.deleteOrChangeStateById(alarmlist, alarmAll, id, STATE.ARMIMG)
              alarmlist = alarmCol.alarmList
              this.$store.commit('SET_APPALARM_LIST', alarmlist)
            })
            .catch(err => {
              console.log(err)
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
    // 处理巡更报警
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
    // 处理单兵报警
    processSingleAlarmimngInfo(alarming, id) {
      let singlelist = JSON.parse(JSON.stringify(this.appMoveSingleList))
      if (id) {
        if (this.appMoveSingleCheck) {
          this.getMobilePatrol({ name: '', orgId: '' })
            .then(res => {
              let patrolAll = appMoveSingle.addMoveSingleIpc(singlelist, res, this.currentMapExtent)
              let patrolCol = appMoveSingle.deleteOrChangeStateById(singlelist, patrolAll, id, STATE.ARMIMG)
              singlelist = patrolCol.singleList
              this.$store.commit('SET_APPMOVESINGLE_LIST', singlelist)
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
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
        if (type === ALARMTYPE.SINGLE) {
          this.processSingleAlarmimngInfo(alarming, id) // 处理单兵报警
        }
      }
      alarminglist = appAlarm.deleteAlarmById(alarminglist, id)
      currentAlarmings = appAlarm.deleteAlarmById(currentAlarmings, id)
      this.$store.commit('SET_APPALARMING_LIST', alarminglist)
      this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
    },
    // 获取报警类型
    getOneAlarmType(val) {
      this.$store.commit('SET_APPALARM_TYPE', val)
      let selectAlarmList = []
      if (val === 'all') {
        this.mapAlarmList = this.fireAlarmList
      } else {
        this.fireAlarmList.forEach(element => {
          if (element.type === val) {
            selectAlarmList.push(element)
          }
        })
        this.mapAlarmList = selectAlarmList
      }
    }
  },
  created() {
    this.$store.commit('SET_APPALARM_TYPE', 'all')
  },
  mounted() {
    this.mapAlarmList = JSON.parse(JSON.stringify([]))
    this.mapAlarmList = JSON.parse(JSON.stringify(this.fireAlarmList))
    // 报警列表的遮罩效果
    if (this.appPageDetail === 'alarmAppVideo') {
      this.isActiveAlarmList = true
      this.alarmDivClass = 'mapAppInfoIsActive'
    } else {
      this.isActiveAlarmList = false
      this.alarmDivClass = 'mapAppInfo'
    }
  }
}
</script>
<style scoped>
.mapAppInfo,
.mapAppInfo .infoTop {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}

.mapAppInfo {
  color: #fff;
  font-size: 12px;
  background-color: rgb(44, 62, 92);
  width: 300px;
  border-radius: 5px;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapAppInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: #1c3053;
}

/*警列表的遮罩效果*/

.mapAppInfoIsActive {
  width: 300px;
  border-radius: 5px;
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  color: #fff;
  background-color: rgb(118, 120, 122);
  position: absolute;
  z-index: 2;
  opacity: 0.3;
}

.mapAppVideoTittle {
  height: 38px;
  line-height: 38px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
}

.mapAppVideoTittle .reback {
  float: left;
  margin: 0 24px;
}

.mapAppVideoTittle .detail {
  float: right;
  margin: 0 10px;
  cursor: pointer;
}

.infoTop {
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: rgba(28, 48, 83, 0.6);
}

.infoButtom {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #0f2343;
  clear: both;
  padding: 0px 10px;
}

.infoButtom .infoButtomLeft {
  float: left;
}

.infoButtom .infoButtomRight {
  float: right;
}

.infoTop .infoHome {
  clear: both;
  display: block;
  background-color: rgba(15, 35, 67, 1);
  border-radius: 5px;
  height: 54px;
  width: 280px;
  margin: 15px 10px;
}

.infoTop .infoTopLeft {
  float: left;
  width: 205px;
}

.infoTop .infoTopLeft .infoTopLeftMain {
  clear: both;
  height: 26px;
  line-height: 26px;
  display: block;
  width: 205px;
  padding: 0 10px;
  cursor: pointer;
}

.infoTopLeftMain .patrolIcon {
  float: left;
  width: 70px;
  font-size: 12px;
}

.infoTopLeftMain .patrolNum {
  padding: 0px 3px;
  display: inline-block;
}

.infoTopLeftMain .patrolNumChOne {
  color: #33cc00;
}

.infoTopLeftMain .patrolNumChTwo {
  color: #ff9900;
}

.infoTopLeftMain .patrolNumChThree {
  color: #ff3300;
}

.infoTop .infoTopLeft .infoTopLeftMain .infoTopItemLeft {
  float: left;
  width: 84px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.infoTop .infoTopLeft .infoTopLeftMain .infoTopItemRight {
  /* float: right; */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.infoTop .infoTopRight {
  float: left;
  width: 40px;
  height: 54px;
  text-align: center;
  border-left: 1px solid #ccc;
  cursor: default;
}

.infoTop .infoTopRight .infoTopRightBtn {
  height: 26px;
  line-height: 26px;
}

.mapAppVideoTittle .detail:hover,
.infoTop .infoTopRight .infoTopRightBtn:hover {
  color: #20adff;
}

.demo-badge {
  width: 42px;
  height: 42px;
  background: #eee;
  border-radius: 6px;
  display: inline-block;
}

.contrastList-enter-active,
.contrastList-leave-active,
.contrastList-move {
  transition: all 1s;
}

.contrastList-enter,
.contrastList-leave-active {
  opacity: 0;
  transform: translateX(-30px);
}

.contrastList-leave {
  opacity: 1;
  transform: translateX(30px);
}

.contrastList {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
