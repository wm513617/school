<!--应用模式 点击地图上闪烁的报警点位的气泡弹框页面  暂时没用-->
<template>
  <div class="mapAppInfoalarm">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">联动视频</div>
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
          <div class="infoRightInfoTop">
            <div class="infoDetail">
              <div class="infoLabel">时间</div>
              <div class="infoValue">{{new Date(parseInt(oneAlarmInData.time) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ')}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">机构</div>
              <div class="infoValue">{{oneAlarmInData.organization}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">名称</div>
              <div class="infoValue">{{oneAlarmInData.name}}</div>
            </div>
            <div class="infoDetail">
              <div class="infoLabel">级别</div>
              <div class="infoValue">{{oneAlarmInData.level}}级</div>
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
              <Input disabled v-model="mask" type="textarea" :autosize="{minRows: 2,maxRows: 2}" />
            </div>
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
import STATE from '../../../../assets/map/edit/state'
export default {
  components: {
    alarmVideoMadel
  },
  data() {
    return {
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
      orgList: [{ name: '测试', _id: '1' }],
      mask: '',
      selectPlanModal: ''
    }
  },
  computed: {
    ...mapState({
      alarmIngOne: ({ mapAlarmData }) => mapAlarmData.alarmIngOne, // 正在报警的消息
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      appCurrentAlarmingList: ({ mapAlarmData }) => mapAlarmData.appCurrentAlarmingList,
      appAlarmCommonCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCommonCheck,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      activeMap: ({ mapGisData }) => mapGisData.activeMap // 当前地图id
    })
  },
  watch: {
    alarmIngOne(val) {
      this.getAlarmIngOne(val)
    }
  },
  methods: {
    ...mapMutations([
      'SET_APPDETAIL_STATE',
      'SET_APPALARMING_LIST',
      'SET_APPCURRENTALARMING_LIST',
      'SET_APPALARM_LIST'
    ]),
    ...mapActions(['getFirePlan', 'confirmWarnMessages', 'getOneMapCommAlarm', 'getOneMapArarlList']),
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    closeAlarm() {
      this.close()
      // this.processAlarmingInfo(id)
    },
    getAlarmIngOne(val) {
      let data = JSON.parse(JSON.stringify(val))
      this.oneAlarmInData = data
      if (this.oneAlarmInData.actionList) {
        this.actionList = this.oneAlarmInData.actionList
      } else {
        this.actionList = []
      }
    },
    confirmAlarm() {
      // this.processAlarmingInfo(id)
      this.confirmWarnMessages({
        list: [this.alarmIngOne],
        ackContent: this.mask
      })
        .then(() => {
          this.closeAlarm()
        })
        .catch((err) => {
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
    // 处理报警信息
    processAlarmingInfo(id) {
      let alarmlist = JSON.parse(JSON.stringify(this.appAlarmList))
      let alarminglist = JSON.parse(JSON.stringify(this.appAlarmingList))
      let currentAlarmings = JSON.parse(JSON.stringify(this.appCurrentAlarmingList))
      let alarming = appFireAlarm.getFeatureById(alarminglist, id)
      if (alarming) {
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
          } else {
            alarmlist = appFireAlarm.deleteAlarmById(alarmlist, id)
            this.$store.commit('SET_APPALARM_LIST', alarmlist)
          }
        } else {
          // 点前处理的报警点位不是普通报警时
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
              alarmlist = appFireAlarm.deleteAlarmById(alarmlist, id)
              this.$store.commit('SET_APPALARM_LIST', alarmlist)
            }
          }
        }
        alarmlist = appFireAlarm.deleteAlarmById(alarmlist, id)
        this.$store.commit('SET_APPALARM_LIST', alarmlist)
        alarminglist = appFireAlarm.deleteAlarmById(alarminglist, id)
        currentAlarmings = appFireAlarm.deleteAlarmById(currentAlarmings, id)
        this.$store.commit('SET_APPALARMING_LIST', alarminglist)
        this.$store.commit('SET_APPCURRENTALARMING_LIST', currentAlarmings)
      }
    }
  },
  created() {
    this.getAlarmIngOne(this.alarmIngOne)
    this.getFirePlan({ page: 1, limit: 50 })
      .then(res => {
        let data = JSON.parse(JSON.stringify(res.data))
        this.orgList = data
        this.mask = this.orgList[0].content
        this.selectPlanModal = this.orgList[0]._id
      })
      .catch(err => {
        console.log('getFirePlan error: ' + err)
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
}

.mapAppVideoTittle {
  height: 40px;
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
}

.mapAppInfoalarm .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
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
  width: 535px;
}

.mapAppInfoContent .infoRight {
  width: 200px;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapAppInfoContent .infoRight .infoRightTittle {
  height: 26px;
  line-height: 26px;
}

.mapAppInfoContent .infoRight .infoRightInfo {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoRightInfoTop {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.mapAppInfoContent .infoRight .infoRightInfo .infoRightInfoTop .infoDetail {
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

.mapAppInfoContent .infoRight .infoRightInfo .infoDetail > div {
  float: left;
}
</style>
