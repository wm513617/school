<!--编辑模式 控制各类型点位以及网格楼宇右边编辑框的显示-->
<template>
  <div class="mapEditInfo">
    <div class="textEdit">
      <!--视频点位编辑-->
      <div class="textEditDiv" v-if="$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && (mapEditRightPage === 'videoPage')">
        <mapVideoPointEdit></mapVideoPointEdit>
      </div>
      <!-- 报警点位编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-FIRE-ALARMIN') && (mapEditRightPage === 'alarmPage')">
        <mapAlarmPointEdit></mapAlarmPointEdit>
      </div>
      <!-- 报警求助编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-FIRE-ALARMIN') && (mapEditRightPage === 'alarmHelp')">
        <mapAlarmHelpEdit></mapAlarmHelpEdit>
      </div>
      <!-- 网格编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITGRIDISSHOW') && (mapEditRightPage === 'gridEditPage')">
        <mapGridEdit></mapGridEdit>
      </div>
      <!-- 楼宇编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITBUILDISSHOW') && (mapEditRightPage === 'buildEditPage')">
        <mapBuildEdit></mapBuildEdit>
      </div>
      <!-- 楼层编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITBUILDISSHOW') && (mapEditRightPage === 'floorEditPage')">
        <mapFloorEdit></mapFloorEdit>
      </div>
      <!-- 中心点编辑 -->
      <div class="textEditDiv" v-if="mapEditRightPage === 'centerEditPage'">
        <mapCenterPointEdit></mapCenterPointEdit>
      </div>
      <!-- 巡更点位编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-SETTING-POINT-MANAGE') && (mapEditRightPage === 'patrolEditPage')">
        <mapPatrolEdit></mapPatrolEdit>
      </div>
      <!-- 门禁点位编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-SETTING-POINT-MANAGE') && (mapEditRightPage === 'doorControlEditPage')">
        <mapDoorControlEdit></mapDoorControlEdit>
      </div>
      <!-- 通讯录编辑 -->
      <div class="textEditDiv" v-if="$BShasPower('BS-MAPHOMEEDIT-EDITCONTACTISSHOW') && (mapEditRightPage === 'contactEditPage')">
        <mapContactEdit></mapContactEdit>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import mapVideoPointEdit from './edit/mapVideoPointEdit'
import mapAlarmPointEdit from './edit/mapAlarmPointEdit'
import mapAlarmHelpEdit from './edit/mapAlarmHelpEdit'
import mapGridEdit from './edit/mapGridEdit'
import mapBuildEdit from './edit/mapBuildEdit'
import mapFloorEdit from './edit/mapFloorEdit'
import mapCenterPointEdit from './edit/mapCenterPointEdit'
import mapPatrolEdit from './edit/mapPatrolEdit'
import mapDoorControlEdit from './edit/mapDoorControlEdit'
import mapContactEdit from './edit/mapContactEdit'
export default {
  components: {
    mapVideoPointEdit,
    mapAlarmPointEdit,
    mapAlarmHelpEdit,
    mapGridEdit,
    mapBuildEdit,
    mapFloorEdit,
    mapCenterPointEdit,
    mapPatrolEdit,
    mapDoorControlEdit,
    mapContactEdit
  },
  computed: {
    ...mapState({
      // 编辑模式地图右侧页面详细
      mapEditRightPage: ({ mapIndex }) => mapIndex.mapEditRightPage.page
    })
  }
}
</script>
<style scoped>
.mapEditInfo {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.textEdit {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.textEditDiv {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.infoTittle {
  width: 100%;
  padding: 5px 10px;
}
.infoTittle .infoNode {
  display: inline;
  margin: 0px 10px;
}
.infoTittle .infoNode.infoNodeI {
  padding: 10px;
}
</style>
