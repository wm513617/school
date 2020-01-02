<!--应用模式 控制右边页面的显示 -->
<template>
  <div class="mapEditInfo">
    <div class="textEdit">
      <!-- 地图概况 -->
      <div v-if="appPageRight === 'mapInfo'">
        <mapInfo></mapInfo>
      </div>
      <!-- 巡更列表 -->
      <div v-if="appPageRight === 'patrolList'">
        <mapPatrolList></mapPatrolList>
      </div>
      <!-- 报警列表 -->
      <div v-if="appPageRight === 'alarmList'">
        <mapAlarmList></mapAlarmList>
      </div>
      <!-- 移动单兵 -->
      <div v-if="appPageRight === 'mobileSingle'">
        <mobileSingle></mobileSingle>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import mapPatrolList from './mapPatrolList'
import mapAlarmList from './mapAlarmList'
import mapInfo from './mapInfo'
import mobileSingle from './mobileSingle'
export default {
  components: {
    mapPatrolList,
    mapAlarmList,
    mapInfo,
    mobileSingle
  },
  computed: {
    ...mapState({
      appPageRight: ({ mapPageState }) => mapPageState.appPageRight
    })
  }
}
</script>
<style scoped>
.mapEditInfo,
.mapEditInfo .textEdit,
.mapEditInfo .textEdit > div {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
