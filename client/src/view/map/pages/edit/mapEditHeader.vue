<!--编辑模式 工具栏页面-->
<template>
  <div class="mapEditHeader">
    <div class="mapEditSchool">
      <div class="editSchool" v-for="(item, index) in mapConfigList" :key="index" :class="{active: activeMap === item.mapId}" @click="mapOneClick(item)">{{item.mapName}}</div>
    </div>
    <div class="mapEditControl iconfont">
      <div class="editControl" @click="mapSettingConfig">
        <p class="icon-zhongxindianshezhi" title="中心点重置"></p>
      </div>
      <div class="editControl" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITGRIDISSHOW')" :class="{'activeArea': mapEditRightPage === 'gridEditPage' }" @click="editGrid('gridEditPage')">
        <p class="icon-grid" title="网格区域"></p>
      </div>
      <div class="editControl" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITBUILDISSHOW')" :class="{'activeArea': mapEditRightPage === 'buildEditPage' }" @click="editBuild('buildEditPage')">
        <p class="icon-loufangdianwei" title="楼宇区域"></p>
      </div>
      <!-- <div class="editControl" @click="editCenter('centerEditPage')"><p class="icon-weizhi"></p>中心点</div> -->
      <div class="editControl" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITMAP')" @click="mapConfig">
        <p class="icon-ditupeizhi" title="配置"></p>
      </div>
      <div class="editControl">
        <p class="icon-zhuye" @click="rebackHome" title="返回首页"></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList, // 地图列表
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      mapEditRightPage: ({ mapPageState }) => mapPageState.mapEditRightPage.page // 编辑模式地图右侧页面详细
    })
  },
  methods: {
    ...mapMutations(['SET_EDITRIGHTPAGE_STATE', 'SET_MAPCONFIGMOL_STATE', 'SET_MAP_STATE', 'SET_AREA_ADD']),
    ...mapActions(['getGrid', 'getGridPaging', 'getBuild', 'getBuildPaging']),
    initPage(val) {
      if (val) {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: val, detail: 'show' })
      }
      this.$store.commit('SET_AREA_ADD', false)
    },
    // 网格化
    editGrid(val) {
      this.initPage(val)
      // 获取网格列表
      let getGeridAll = this.getGrid(this.activeMap)
      let getGeridAllPage = this.getGridPaging({ page: 1, id: this.activeMap, name: '' })
      Promise.all([getGeridAll, getGeridAllPage])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // 楼宇区域
    editBuild(val) {
      this.initPage(val)
      // 获取楼宇列表
      let getBuildAll = this.getBuild(this.activeMap)
      let getBuildPage = this.getBuildPaging({ page: 1, id: this.activeMap, name: '' })
      Promise.all([getBuildAll, getBuildPage])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // 中心点
    editCenter(val) {
      this.initPage(val)
    },
    // 地图配置
    mapConfig() {
      this.$store.commit('SET_MAPCONFIGMOL_STATE', true)
      this.initPage('')
    },
    mapSettingConfig() {
      this.$store.commit('SET_MAPSETTING_STATE', true)
    },
    // 地图
    mapOneClick(item) {
      this.initPage('gridEditPage')
      this.$store.commit('SET_MAP_STATE', item)
      let getAllGrid = this.getGrid(item.mapId)
      let getAllBuild = this.getBuild(this.activeMap)
      Promise.all([getAllGrid, getAllBuild])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    rebackHome() {
      this.$router.replace('/navigation')
    }
  }
}
</script>
<style scoped>
.mapEditHeader {
  clear: both;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
}
.mapEditHeader .mapEditSchool {
  float: left;
  height: 40px;
}
.mapEditHeader .mapEditSchool .active {
  background-color: #1c3053;
  color: #fff;
}
.mapEditHeader .mapEditSchool .editSchool {
  float: left;
  padding: 0 24px;
  color: #8597ad;
}
.mapEditHeader .mapEditSchool .editSchool:hover {
  color: #4699f9;
}
.mapEditHeader .mapEditSchool .active {
  color: #fff !important;
}
.mapEditHeader .mapEditControl {
  float: right;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
  margin-right: 35px;
}
.mapEditHeader .mapEditControl .editControl:hover,
.mapEditHeader .mapEditControl .activeArea {
  color: #4699f9;
}
.mapEditHeader .mapEditControl .editControl {
  display: inline;
  margin: 0px 10px;
  cursor: pointer;
}
.mapEditHeader .mapEditControl .editControl p {
  display: inline;
  font-size: 20px;
}
.back-home {
  color: #fff;
}
</style>
