<!--应用模式 工具栏页面  -->
<template>
  <div class="mapAppHeader">
    <div class="mapAppSchool">
      <div class="appSchool" v-for="(item, index) in mapConfigList" :key="index" :class="{active: activeMap === item.mapId}" @click="mapOneApp(item)">{{item.mapName}}</div>
    </div>
    <div class="mapAppControl iconfont">
      <div class="appControl" v-if="$BShasPower('BS-MAP-APP-GRIDBUILD-ISSHOW')" :class="{'areaActive': !isCloseAllGrid}">
        <p class="icon-grid" @click="mapGridApp" title="网格区域"></p>
      </div>
      <div class="appControl" v-if="$BShasPower('BS-MAP-APP-GRIDBUILD-ISSHOW')" @click="mapBuildApp" :class="{'areaActive': !isCloseAllBuild}">
        <p class="icon-loufangdianwei" title="楼宇区域"></p>
      </div>
      <div class="appControl" v-if="$BShasPower('BS-ALARM-RECEIVE-WARNING')" @click="mapAlarmApp" :class="{'areaActive': isOpenAlarm}">
        <p class="icon-alarm-admin" title="接收报警"></p>
      </div>
      <div class="appControl" v-if="$BShasPower('BS-MAP-APPSTATISISSHOW')" @click="mapStatic" :class="{'areaActive': isStatic}">
        <p class="icon-tongji" title="统计"></p>
      </div>
      <div class="appControl" v-if="$BShasPower('BS-MAP-APPMEASUREISSHOW')" @click="mapMeasure" :class="{'areaActive': measureActive}">
        <p class="icon-ruler" title="测距"></p>
      </div>
      <div class="appControl">
        <p class="icon-zhuye" @click="rebackHome" title="返回首页"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      gridText: '网格区域',
      buildText: '楼宇区域'
    }
  },
  watch: {
    activeMap(val) {
      this.gridText = '网格区域'
      this.buildText = '楼宇区域'
      this.$store.commit('SET_CLOSEALLGRID_STATE', true)
      this.$store.commit('SET_CLOSEALLBUILD_STATE', true)
    }
  },
  computed: {
    ...mapState({
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList,
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      isCloseAllGrid: ({ mapAreaData }) => mapAreaData.isCloseAllGrid, // 是否打开所有网格
      isCloseAllBuild: ({ mapAreaData }) => mapAreaData.isCloseAllBuild, // 是否打开所有楼宇
      isMeasure: ({ mapPageState }) => mapPageState.isMeasure, // 是否显示测距图层
      measureActive: ({ mapGisData }) => mapGisData.measureActive,
      isStatic: ({ mapPageState }) => mapPageState.isStatic, // 触发统计,
      isOpenAlarm: ({ mapPageState }) => mapPageState.isOpenAlarm
    })
  },
  methods: {
    ...mapActions(['getOneMapGrid', 'getOneMapBuild']),
    ...mapMutations([
      'SET_MAPACTIVE_STATE',
      'SET_MAPSTATIC_STATE',
      'SET_CLOSEALLGRID_STATE',
      'SET_CLOSEALLBUILD_STATE',
      'SET_APPBUILD_LIST',
      'SET_MEASURE_ACTIVE'
    ]),
    mapOneApp(item) {
      this.$store.commit('SET_MAPACTIVE_STATE', item.mapId)
      // 显示所有楼宇
      this.getOneMapBuild(item.mapId)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // 获取当前地图下所有网格
    mapGridApp() {
      if (!this.isCloseAllGrid) {
        this.$store.commit('SET_CLOSEALLGRID_STATE', true)
      } else {
        // 显示所有网格
        this.getOneMapGrid(this.activeMap)
          .then(res => {
            this.$store.commit('SET_CLOSEALLGRID_STATE', false)
          })
          .catch(err => {
            console.log(err)
          })
      }
      this.pageInit()
    },
    // 获取当前地图下所有楼宇
    mapBuildApp() {
      if (!this.isCloseAllBuild) {
        this.$store.commit('SET_CLOSEALLBUILD_STATE', true)
      } else {
        // 显示所有楼宇
        this.getOneMapBuild(this.activeMap)
          .then(res => {
            this.$store.commit('SET_APPBUILD_LIST', res)
            this.$store.commit('SET_CLOSEALLBUILD_STATE', false)
          })
          .catch(err => {
            console.log(err)
          })
      }
      this.pageInit()
    },
    // 获取当前地图下所有报警消息
    mapAlarmApp() {
      if (!this.isOpenAlarm) {
        this.$store.commit('SET_ISOPEN_ALARM', true)
        this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'alarmList')
      } else {
        this.$store.commit('SET_ISOPEN_ALARM', false)
        this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'mapInfo')
      }
    },
    mapStatic() {
      if (!this.isStatic) {
        this.$store.commit('SET_MAPSTATIC_STATE', true)
      } else {
        this.$store.commit('SET_MAPSTATIC_STATE', false)
        this.$store.commit('SET_MEASURE_ACTIVE', false)
      }
      this.pageInit()
    },
    mapMeasure() {
      if (!this.measureActive) {
        this.$store.commit('SET_MAPSTATIC_STATE', false) // 关闭统计工具
        this.$store.commit('SET_MAPMEASURE_STATE', true) // 测距图层显示
        this.$store.commit('SET_MEASURE_ACTIVE', true) // 开启测距工具
      } else {
        this.$store.commit('SET_MEASURE_ACTIVE', false) // 先关闭测距工具
      }
      this.pageInit()
    },
    rebackHome() {
      this.$router.replace('/navigation')
      this.pageInit()
    },
    pageInit() {
      this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'mapInfo')
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    pageInitState() {
      this.pageInit()
      this.$store.commit('SET_MAPSTATIC_STATE', false)
      this.$store.commit('SET_MAPMEASURE_STATE', false)
      this.$store.commit('SET_ISOPEN_ALARM', false) // 关闭接受报警的工具
      this.$store.commit('SET_CLOSEALLBUILD_STATE', true)
      this.$store.commit('SET_CLOSEALLGRID_STATE', true)
    }
  },
  created() {
    this.pageInitState()
  },
  mounted() {
    this.pageInitState()
  },
  beforeDestroy() {
    this.pageInitState()
  }
}
</script>
<style scoped>
.mapAppHeader {
  clear: both;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
}
.mapAppHeader .mapAppSchool {
  float: left;
  height: 40px;
  color: #8597ad;
}
.mapAppHeader .mapAppSchool .active {
  background-color: #1c3053;
  color: #fff;
}
.mapAppHeader .mapAppSchool .appSchool {
  float: left;
  padding: 0 24px;
  color: #8597ad;
}
.mapAppHeader .mapAppSchool .appSchool:hover {
  color: #4699f9;
}
.mapAppHeader .mapAppSchool .active {
  color: #fff !important;
}
.mapAppHeader .mapAppControl {
  float: right;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
  margin-right: 35px;
}
.mapAppHeader .mapAppControl .appControl:hover,
.mapAppHeader .mapAppControl .areaActive {
  color: #4699f9;
}
.mapAppHeader .mapAppControl .appControl {
  display: inline;
  margin: 0px 10px;
  font-size: 14px;
  cursor: pointer;
}
.mapAppHeader .mapAppControl .appControl p {
  display: inline;
  font-size: 20px;
}
.back-home {
  color: #fff;
}
</style>
