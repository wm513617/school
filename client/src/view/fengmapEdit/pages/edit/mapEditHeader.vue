<!--编辑模式 工具栏页面-->
<template>
  <div class="mapEditHeader">
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
      <div class="editControl" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITCONTACTISSHOW')" :class="{'activeArea': mapEditRightPage === 'gridContactPage' }" @click="editContact('contactEditPage')">
        <p class="icon-user-info" title="通讯录"></p>
      </div>
      <div class="editControl" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITMAP')" @click="mapConfig">
        <p class="icon-ditupeizhi" title="地图服务配置"></p>
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
      isMapOuter: ({ mapIndex }) => mapIndex.isMapOuter, // 地图是否是楼内
      activeMap: ({ mapIndex }) => mapIndex.activeMapConfig._id, // 当前地图id
      mapEditRightPage: ({ mapIndex }) => mapIndex.mapEditRightPage.page, // 编辑模式地图右侧页面详细
      currentFloor: ({ mapArea }) => mapArea.currentFloor // 编辑模式地图右侧页面详细
    })
  },
  methods: {
    ...mapMutations(['SET_EDIT_RIGHT_PAGE_STATE', 'SET_MAP_CONFIG_MOL_STATE', 'SET_MAP_STATE', 'SET_AREA_DRAW_ACTIVE', 'SET_LOCATE_FEATURES', 'SET_FEATURE_EDIT_ACTIVE']),
    ...mapActions(['loadGridsByMapId', 'loadGridsByFloorId', 'getGridPagingApi', 'getGridPagingByFloorId', 'getBuild', 'getBuildPaging', 'setActiveMapConfig']),
    ...mapActions('fengMap', ['changeFMeditRightPage']),
    initPage(val) {
      if (val) {
        this.changeFMeditRightPage({ page: val, detail: 'show' })
      } else {
        this.changeFMeditRightPage({ page: '', detail: 'show' })
      }
      // this.$store.commit('SET_AREA_ADD', false)
      this.SET_AREA_DRAW_ACTIVE(false) // 关闭区域绘制
      this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑
      this.SET_LOCATE_FEATURES([]) // 清空高亮定位要素
    },
    // 网格化
    editGrid(val) {
      if (this.mapEditRightPage === 'gridEditPage') {
        this.initPage()
        return
      }
      this.initPage(val)
      // 获取网格列表
      let getGeridAll = null
      let getGeridAllPage = null
      if (this.isMapOuter) {
        getGeridAll = this.loadGridsByMapId(this.activeMap)
        getGeridAllPage = this.getGridPagingApi({ page: 1, id: this.activeMap, name: '' })
      } else if (this.currentFloor && this.currentFloor._id) {
        getGeridAll = this.loadGridsByFloorId(this.currentFloor._id)
        getGeridAllPage = this.getGridPagingByFloorId({ page: 1, id: this.currentFloor._id, name: '' })
      }
      if (getGeridAll && getGeridAllPage) {
        Promise.all([getGeridAll, getGeridAllPage])
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      }
    },
    // 楼宇区域
    editBuild(val) {
      if (this.mapEditRightPage === 'buildEditPage') {
        this.initPage()
        return
      }
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
    editContact(val) {
      if (this.mapEditRightPage === 'contactEditPage') {
        this.initPage()
        return
      }
      this.initPage(val)
    },
    // 中心点
    editCenter(val) {
      this.initPage(val)
    },
    // 地图配置
    mapConfig() {
      this.SET_MAP_CONFIG_MOL_STATE(true)
      this.initPage('')
    },
    mapSettingConfig() {
      this.initPage()
      this.$store.commit('SET_MAP_SET_TING_STATE', true)
    },
    rebackHome() {
      this.setActiveMapConfig(null)
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
  border-radius: 4px;
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
  border-radius: 4px;
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
