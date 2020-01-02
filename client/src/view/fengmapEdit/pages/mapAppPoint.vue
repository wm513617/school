<!--应用模式 点位元素功能页面-->
<template>
  <div class="mapPointHome">
    <div class="tabDetail iconfont">
      <Checkbox-group v-model="ipcModel" class="pointClass" @on-change="devSelect" v-if="$BShasPower('BS-MAP-APP-VEDIO-POINT')">
        <div class="pointLineClass" v-for="item in devclumps" :key="item.value">
          <p class="iconCheckBox" :class="item.icon"></p>
          <Checkbox :label="item.value" :disabled="item.disabled" :indeterminate="item.indeterminate">{{item.label}}</Checkbox>
        </div>
      </Checkbox-group>
      <div class="pointLineClass" v-if="$BShasPower('BS-MAP-APP-FIRE-POINT')">
        <p class="iconCheckBox icon-alarm-admin"></p>
        <Checkbox v-model="alarmPoint" @on-change="alarmSelect">消防报警</Checkbox>
      </div>
      <div class="pointLineClass" v-if="$BShasPower('BS-MAP-APP-COMMONALARM-POINT')">
        <p class="iconCheckBox icon-baojing2"></p>
        <Checkbox v-model="commonAlarm" @on-change="commonAlarmSelect">普通报警</Checkbox>
      </div>
      <div class="pointLineClass" v-if="$BShasPower('BS-MAP-APP-PATROL-POINT')">
        <p class="iconCheckBox icon-dianzixungeng"></p>
        <Checkbox v-model="patrolModel" @on-change="patrolChange">巡更点位</Checkbox>
      </div>
      <div class="pointLineClass" v-if="$BShasPower('BS-MAP-APP-SINGLE-POINT')">
        <p class="iconCheckBox icon-yidongdanbing"></p>
        <Checkbox v-model="singlePawnModel" @on-change="singlePawnChange">移动单兵</Checkbox>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appIpc from '../../../assets/map/app/appIpc.js'
import appFireAlarm from '../../../assets/map/app/appFireAlarm'
export default {
  components: {},
  data() {
    return {
      ipcModel: [], // 视频点位
      // 视频点位分类
      devclumps: [
        { label: '枪机', value: 'boltipc', indeterminate: false, icon: 'icon-qiangji1', disabled: false },
        { label: '红外枪机', value: 'redBoltipc', indeterminate: false, icon: 'icon-video-gun1', disabled: false },
        { label: '半球', value: 'halfBallipc', indeterminate: false, icon: 'icon-video-ball-half', disabled: false },
        { label: '快球', value: 'fastBallipc', indeterminate: false, icon: 'icon-video-ball', disabled: false },
        { label: '全景', value: 'allViewipc', indeterminate: false, icon: 'icon-video-pan', disabled: false },
        { label: '可视域', value: 'sector', indeterminate: true, icon: 'icon-shanxing', disabled: false }
      ],
      alarmPoint: false, // 消防报警
      commonAlarm: false, // 普通报警
      patrolModel: false, // 巡更点位
      singlePawnModel: false // 移动单兵
    }
  },
  computed: {
    ...mapState({
      appVedioIpcInMapList: ({ mapVedioData }) => mapVedioData.appVedioIpcInMapList, // 加载到地图上的视频点位数组
      appVedioSectorInMapList: ({ mapVedioData }) => mapVedioData.appVedioSectorInMapList, // 加载到地图上的视频点位可视域数组
      mapZoom: ({ mapVedioData }) => mapVedioData.mapZoom,
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter,
      appCheckList: ({ mapVedioData }) => mapVedioData.appCheckList,
      appAlarmCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCheck,
      appPatrolCheck: ({ patrolData }) => patrolData.appPatrolCheck,
      appMoveSingleCheck: ({ mobilePatrol }) => mobilePatrol.appMoveSingleCheck,
      appAlarmCommonCheck: ({ mapAlarmData }) => mapAlarmData.appAlarmCommonCheck,
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      appCommonAlarmList: ({ mapAlarmData }) => mapAlarmData.appCommonAlarmList,
      appAlarmInMapList: ({ mapAlarmData }) => mapAlarmData.appAlarmInMapList,
      floorCommonAlarmList: ({ mapAlarmData }) => mapAlarmData.floorCommonAlarmList,
      levelData: ({ mapGisData }) => mapGisData.levelData,
      appPageDetail: ({ mapAreaData }) => mapAreaData.appPageDetail
    })
  },
  watch: {
    isAppOuter(val) {
      let arr = ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc']
      this.$store.commit('SET_APPMOVESINGLE_CHECK', false)
      this.$store.commit('SET_APPCOMMONALARM_CHECK', false)
      this.$store.commit('SET_APPALARM_CHECK', false)
      this.$store.commit('SET_APPPATROL_CHECK', false)
      this.$store.commit('SET_APPCHECK_LIST', arr)
      this.singlePawnModel = false
      this.initCheckList()
      this.alarmSelect(this.alarmPoint)
      this.commonAlarmSelect(this.commonAlarm)
      this.patrolChange(this.patrolModel)
      this.singlePawnChange(false)
    },
    appAlarmCheck(val) {
      this.alarmPoint = JSON.parse(JSON.stringify(val))
      // this.alarmSelect(val)
    },
    appAlarmCommonCheck(val) {
      this.commonAlarm = JSON.parse(JSON.stringify(val))
      // this.commonAlarmSelect(val)
    },
    appPatrolCheck(val) {
      this.patrolModel = JSON.parse(JSON.stringify(val))
      this.patrolChange(val)
    },
    appMoveSingleCheck(val) {
      this.singlePawnChange(val)
    },
    activeMap(val) {
      this.$store.commit('SET_APPCHECK_LIST', ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc'])
      this.$store.commit('SET_APPPATROL_CHECK', false)
      this.$store.commit('SET_APPALARM_CHECK', false)
      this.$store.commit('SET_APPCOMMONALARM_CHECK', false)
    },
    appCheckList(val) {
      this.ipcModel = JSON.parse(JSON.stringify(val))
      if (val.length > 1) {
        this.idDisabledSectorCheck(false)
      } else {
        if (val.length === 1) {
          if (val[0] === 'sector') {
            this.idDisabledSectorCheck(true)
          } else {
            this.idDisabledSectorCheck(false)
          }
        }
        if (val.length === 0) {
          this.idDisabledSectorCheck(true)
        }
      }
      this.devSelect(val)
    }
  },
  methods: {
    ...mapActions([
      'getMobilePatrol',
      'getOneMapPatrolList',
      'getOneMapArarlList',
      'getOneMapAllPatrolList',
      'getOneMapCommAlarm',
      'getOneFloorCommonAlarm',
      'getOneFloorPatrolList'
    ]),
    ...mapMutations([
      'SET_APPVEDIOIPC_LIST', // 编辑模式视频点位数组
      'SET_APPVEDIOSECTOR_LIST', // 编辑模式视频点位可视域数组
      'SET_APPVEDIOIPCINMAP_LIST',
      'SET_APPVEDIOSECTORINMAP_LIST',
      'SET_APPCHECK_LIST',
      'GET_ONEMAPALARMLIST_LIST',
      'SET_MAPAPPRIGHT_PAGE', // 应用模式右侧页面切换
      'SET_APPALARM_CHECK',
      'SET_APPPATROL_CHECK',
      'SET_APPCOMMONALARM_CHECK',
      'SET_APPALARM_LIST',
      'SET_APPPATROL_LIST',
      'SET_APPDETAIL_STATE'
    ]),
    initCheckList() {
      this.ipcModel = JSON.parse(JSON.stringify(this.appCheckList))
      this.patrolModel = JSON.parse(JSON.stringify(this.appPatrolCheck))
      this.alarmPoint = JSON.parse(JSON.stringify(this.appAlarmCheck))
      this.commonAlarm = JSON.parse(JSON.stringify(this.appAlarmCommonCheck))
    },
    // 禁止选择可视域选项
    idDisabledSectorCheck(flag) {
      this.devclumps.forEach(element => {
        if (element.value === 'sector') {
          element.disabled = flag
        }
      })
    },
    // 点位元素勾选
    devSelect(checkList) {
      this.$store.commit('SET_APPCHECK_LIST', checkList)
      if (checkList.length > 0) {
        if (this.appPageDetail === 'alarmApp') {
          this.$store.commit('SET_APPDETAIL_STATE', '') // 关闭气泡弹框
        }
        this.commonAlarm = false
        let alarmlist = appFireAlarm.deleteCommonAlarmFromLayer(this.appAlarmList, this.appCommonAlarmList)
        this.$store.commit('SET_APPALARM_LIST', alarmlist)
      }
      if (checkList.indexOf('sector') > -1) {
        this.devclumps.forEach(element => {
          if (element.value === 'sector') {
            element.indeterminate = false
          }
        })
      } else {
        this.devclumps.forEach(element => {
          if (element.value === 'sector') {
            element.indeterminate = true
          }
        })
      }
      let vedioSectors = appIpc.checkVedioByType({
        vedioList: this.appVedioIpcInMapList,
        sectorList: this.appVedioSectorInMapList,
        checkList
      })
      let zoom = Math.ceil(this.$context2D.map.getView().getZoom())
      let vediolist = appIpc.controlVedioVisibleByLevel(vedioSectors.vediolist, zoom)
      let sectorlist = appIpc.controlVedioVisibleByLevel(vedioSectors.sectorlist, zoom)
      this.$store.commit('SET_APPVEDIOIPC_LIST', vediolist)
      this.$store.commit('SET_APPVEDIOSECTOR_LIST', sectorlist)
      this.$store.commit('SET_APPVEDIOIPCINMAP_LIST', vedioSectors.vedioInMap)
      this.$store.commit('SET_APPVEDIOSECTORINMAP_LIST', vedioSectors.sectorInMap)
    },
    // 巡更点位
    patrolChange(val) {
      this.$store.commit('SET_APPPATROL_CHECK', val)
      if (val) {
        if (this.isAppOuter) {
          // this.getOneMapPatrolList({ mapid: this.activeMap, orgid: '' })
          //   .then(res => {})
          //   .catch(err => {
          //     console.log(err)
          //   })
          // 巡更（地图包括楼层中的，楼层中以数组形式展示）
          this.getOneMapAllPatrolList({ mapid: this.activeMap })
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        } else {
          this.getOneFloorPatrolList(this.levelData._id)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        }
      } else {
        this.$store.commit('SET_APPPATROL_LIST', [])
        this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'mapInfo')
        this.$store.commit('SET_APPDETAIL_STATE', '')
      }
    },
    // 移动单兵
    singlePawnChange(val) {
      this.$store.commit('SET_APPMOVESINGLE_CHECK', val)
      if (val) {
        this.getMobilePatrol({ name: '', orgId: '' })
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$store.commit('SET_APPMOVESINGLE_LIST', [])
        this.$store.commit('SET_APPDETAIL_STATE', '')
      }
    },
    // 消防报警
    alarmSelect(val) {
      this.$store.commit('SET_APPALARM_CHECK', val)
      if (val) {
        this.getOneMapArarlList(this.activeMap)
          .then(res => {
            console.log(res, 'fire')
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        let alarmlist = appFireAlarm.deleteCommonAlarmFromLayer(this.appAlarmList, this.appAlarmInMapList)
        this.$store.commit('SET_APPALARM_LIST', alarmlist)
        this.$store.commit('GET_ONEMAPALARMLIST_LIST', [])
        this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'mapInfo')
        this.$store.commit('SET_APPDETAIL_STATE', '')
      }
    },
    // 普通报警
    commonAlarmSelect(val) {
      this.$store.commit('SET_APPCOMMONALARM_CHECK', val)
      if (val) {
        if (this.appPageDetail === 'pointApp') {
          this.$store.commit('SET_APPDETAIL_STATE', '') // 关闭气泡弹框
        }
        this.$store.commit('SET_APPCHECK_LIST', [])
        this.$store.commit('SET_APPVEDIOIPC_LIST', [])
        this.$store.commit('SET_APPVEDIOSECTOR_LIST', [])
        if (this.isAppOuter) {
          this.getOneMapCommAlarm(this.activeMap)
            .then(res => {
              console.log(res, 'res')
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          // 获取当前楼层的所有普通报警
          this.getOneFloorCommonAlarm(this.levelData._id)
            .then(res => {})
            .catch(err => {
              console.log(err)
            })
        }
      } else {
        let alarmlist = appFireAlarm.deleteCommonAlarmFromLayer(this.appAlarmList, this.appCommonAlarmList)
        this.$store.commit('SET_APPALARM_LIST', alarmlist)
      }
    }
  },
  mounted() {
    this.initCheckList()
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.mapPointHome {
  width: 100%;
  height: 100%;
  padding: 10px;
}

.mapPointHome .tabDetail .pointClass {
  border-bottom: 1px dashed #0a111c;
}
.mapPointHome .mapPointHomeTittle {
  height: 30px;
  margin-left: 30px;
}
.pointLineClass {
  height: 30px;
  line-height: 30px;
  display: inherit;
  padding-left: 30px;
  cursor: pointer;
}
.pointLineClass:hover {
  color: #20adff;
}
.pointLineClass .iconCheckBox {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  display: inline-block;
  margin-right: 5px;
  font-size: 18px;
}
.icon-qiangji1::before {
  font-size: 22px !important;
}
</style>
