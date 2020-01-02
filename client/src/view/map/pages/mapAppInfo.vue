<!--应用模式 控制各类型点位以及网格楼宇的气泡弹框的显示-->
<template>
  <div class="mapAppInfo">
    <div class="textEdit">
      <!-- 点位 -->
      <div v-if="appPageDetail === 'pointApp'">
        <mapPointApp></mapPointApp>
      </div>
      <!-- 网格 -->
      <div v-if="appPageDetail === 'gridApp'">
        <mapGridApp></mapGridApp>
      </div>
      <!-- 楼宇 -->
      <div v-if="appPageDetail === 'buildApp'">
        <mapBuildApp></mapBuildApp>
      </div>
      <!-- 工具栏报警 -->
      <div v-if="appPageDetail === 'alarmApp'">
        <mapAlarmApp></mapAlarmApp>
      </div>
      <!-- 消防报警视频-报警列表中查看按钮的详细页面 -->
      <div v-if="appPageDetail === 'alarmAppVideo'">
        <mapAlarmAppVideo></mapAlarmAppVideo>
      </div>
      <!-- 巡更报警-报警列表中查看按钮的详细页面-使用的杜文博的页面，在mapHome页面-->
      <!-- <div v-if="appPageDetail === 'alarmAppPatrol'">
      </div> -->
      <!-- 点击单兵报警信息框中的查看列表右边列表 -->
      <div v-if="appPageDetail === 'singleAppList'">
        <mobileSingle></mobileSingle>
      </div>
      <!-- 联动视频 -->
      <div v-if="appPageDetail === 'alarmAppVideoPre'">
        <alarmAppVideoPre></alarmAppVideoPre>
      </div>
      <!-- 巡更 -->
      <div v-if="appPageDetail === 'patrolApp'">
        <mapPatrolApp></mapPatrolApp>
      </div>
      <!-- 单兵 -->
      <div v-if="appPageDetail === 'moveSingleApp'">
        <mapSingleApp></mapSingleApp>
      </div>
      <!-- 巡更详细 -->
      <div v-if="appPageDetail === 'patrolConver'">
        <mapPatrolConver></mapPatrolConver>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import mapGridApp from './apply/mapGridApp'
import mapPointApp from './apply/mapPointApp'
import mapBuildApp from './apply/mapBuildApp'
import mapAlarmApp from './apply/mapAlarmApp'
import mapPatrolApp from './apply/mapPatrolApp'
import mapSingleApp from './apply/mapSingleApp'
import mapAlarmAppVideo from './apply/mapAlarmAppVideo'
import alarmAppVideoPre from './apply/alarmAppVideoPre'
import mapPatrolConver from './apply/mapPatrolConver'
import mobileSingle from './apply/mobileSingle'
export default {
  components: {
    mapGridApp,
    mapPointApp,
    mapBuildApp,
    mapAlarmApp,
    mapPatrolApp,
    mapSingleApp,
    mapAlarmAppVideo,
    mapPatrolConver,
    alarmAppVideoPre,
    mobileSingle
  },
  computed: {
    ...mapState({
      appPageDetail: ({ mapAreaData }) => mapAreaData.appPageDetail
    })
  }
}
</script>
<style scoped>
.mapAppInfo {
  color: black;
}
</style>
