<!--编辑模式 点位元素功能页面-->
<template>
  <div class="mapPointHome">
    <div class="tabDetail iconfont">
      <Checkbox-group v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE')" v-model="ipcModel" class="pointClass" @on-change="devSelect">
        <div class="pointLineClass" v-for="item in devclumps" :key="item.value">
          <p class="iconCheckBox" :class="item.icon"></p>
          <Checkbox :label="item.value" :disabled="flag">{{item.label}}</Checkbox>
        </div>
      </Checkbox-group>
      <div class="pointLineClass" v-if="$BShasPower('BS-FIRE-ALARMIN')">
        <p class="iconCheckBox icon-alarm-admin"></p>
        <Checkbox :value="alarmCheck" @on-change="alarmSelect">消防点位</Checkbox>
      </div>
      <div class="pointLineClass" v-if="$BShasPower('BS-SETTING-POINT-MANAGE')">
        <p class="iconCheckBox icon-dianzixungeng"></p>
        <Checkbox :value="patrolIpc" @on-change="patrolSelect">巡更点位</Checkbox>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import editIpc from '../../../assets/map/edit/editIpc.js'
export default {
  components: {},
  data() {
    return {
      ipcModel: [], // 视频点位
      // 视频点位分类
      devclumps: [
        { label: '枪机', value: 'boltipc', icon: 'icon-qiangji1' },
        { label: '红外枪机', value: 'redBoltipc', icon: 'icon-video-gun1' },
        { label: '半球', value: 'halfBallipc', icon: 'icon-video-ball-half' },
        { label: '快球', value: 'fastBallipc', icon: 'icon-video-ball' },
        { label: '全景', value: 'allViewipc', icon: 'icon-video-pan' },
        { label: '可视域', value: 'sector', icon: 'icon-shanxing' }
      ],
      flag: false,
      alarmCheck: true, // 消防点位
      patrolIpc: true // 巡更点位
    }
  },
  computed: {
    ...mapState({
      editVedioIpcInMapList: ({ mapGisData }) => mapGisData.editVedioIpcInMapList, // 加载到地图上的视频点位数组
      editVedioSectorInMapList: ({ mapGisData }) => mapGisData.editVedioSectorInMapList, // 加载到地图上的视频点位可视域数组
      editCheckList: ({ mapVedioData }) => mapVedioData.editCheckList,
      mapEditRightPage: ({ mapPageState }) => mapPageState.mapEditRightPage,
      editPatrolInMapList: ({ patrolData }) => patrolData.editPatrolInMapList,
      editAlarmInMapList: ({ mapAlarmData }) => mapAlarmData.editAlarmInMapList,
      editAlarmCheck: ({ mapAlarmData }) => mapAlarmData.editAlarmCheck,
      editPatrolCheck: ({ patrolData }) => patrolData.editPatrolCheck,
      activeMap: ({ mapGisData }) => mapGisData.activeMap // 当前地图id
    })
  },
  watch: {
    ipcModel() {
      if (this.mapEditRightPage.page === 'videoPage' && this.mapEditRightPage.detail === 'show') {
        this.flag = true
      }
    },
    mapEditRightPage(val) {
      if (this.mapEditRightPage.page !== 'videoPage') {
        this.flag = false
      } else {
        this.flag = true
        this.$store.commit('SET_EDITVEDIOSECTOR_LIST', [])
      }
    },
    editCheckList(val) {
      this.ipcModel = JSON.parse(JSON.stringify(val))
      this.isVedioIpcShow(val)
    },
    editPatrolCheck(val) {
      this.patrolIpc = JSON.parse(JSON.stringify(val))
      this.isPatrolIpcShow(val)
    },
    editAlarmCheck(val) {
      this.alarmCheck = JSON.parse(JSON.stringify(val))
      this.isAlarmIpcShow(val)
    },
    activeMap(val) {
      this.$store.commit('SET_EDITCHECK_LIST', ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc'])
      this.$store.commit('SET_EDITPATROL_CHECK', true)
      this.$store.commit('SET_EDITALARM_CHECK', true)
    }
  },
  methods: {
    ...mapMutations([
      'SET_EDITVEDIOIPC_LIST',
      'SET_EDITVEDIOSECTOR_LIST',
      'SET_EDITCHECK_LIST',
      'SET_EDITALARM_LIST',
      'SET_PATROL_LIST',
      'SET_EDITALARM_CHECK',
      'SET_EDITPATROL_CHECK'
    ]),
    // 点位元素勾选
    devSelect(checkList) {
      this.$store.commit('SET_EDITCHECK_LIST', checkList)
      this.isVedioIpcShow(checkList)
    },
    alarmSelect(checkList) {
      this.$store.commit('SET_EDITALARM_CHECK', checkList)
      this.isAlarmIpcShow(checkList)
    },
    patrolSelect(checkList) {
      this.$store.commit('SET_EDITPATROL_CHECK', checkList)
      this.isPatrolIpcShow(checkList)
    },
    // 控制视频点位的显示隐藏
    isVedioIpcShow(checkList) {
      let vedioSectors = editIpc.checkVedioByType({
        vedioList: this.editVedioIpcInMapList,
        sectorList: this.editVedioSectorInMapList,
        checkList
      })
      this.$store.commit('SET_EDITVEDIOIPC_LIST', vedioSectors.vediolist)
      this.$store.commit('SET_EDITVEDIOSECTOR_LIST', vedioSectors.sectorlist)
    },
    // 控制消防报警点位的显示隐藏
    isAlarmIpcShow(checkList) {
      let alarms = JSON.parse(JSON.stringify(this.editAlarmInMapList))
      if (checkList) {
        this.$store.commit('SET_EDITALARM_LIST', alarms)
      } else {
        this.$store.commit('SET_EDITALARM_LIST', [])
      }
    },
    // 控制巡更点位的显示隐藏
    isPatrolIpcShow(checkList) {
      let patrols = JSON.parse(JSON.stringify(this.editPatrolInMapList))
      if (checkList) {
        this.$store.commit('SET_PATROL_LIST', patrols)
      } else {
        this.$store.commit('SET_PATROL_LIST', [])
      }
    }
  },
  mounted() {
    this.ipcModel = JSON.parse(JSON.stringify(this.editCheckList))
    this.alarmCheck = JSON.parse(JSON.stringify(this.editAlarmCheck))
    this.patrolIpc = JSON.parse(JSON.stringify(this.editPatrolCheck))
    this.isVedioIpcShow(this.editCheckList)
    this.isAlarmIpcShow(this.editAlarmCheck)
    this.isPatrolIpcShow(this.editPatrolCheck)
  }
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
