<template>
  <div class="bs-main main-page-bg">
    <div style="flex:1;">
      <Tabs :animated="false" :value="headline[0]" @on-click="tickTabs">
        <Tab-pane v-if="recordPath" label="存储路径" name="store"></Tab-pane>
        <Tab-pane v-if="recordTimer" label="定时录像计划" name="timing"></Tab-pane>
        <Tab-pane v-if="eventRecord" label="事件录像计划" name="incident"></Tab-pane>
        <Tab-pane v-if="screenshotPlan" label="抓图计划" name="capture"></Tab-pane>
      </Tabs>
      <store :resetData="defaultsStore" v-if="monmentVideoTabs === 'store'"></store>
      <timing :resetData="defaultsTiming" v-if="monmentVideoTabs === 'timing'"></timing>
      <incident :resetData="defaultsIncident" v-if="monmentVideoTabs === 'incident'"></incident>
      <capture :resetData="defaultsCapture" v-if="monmentVideoTabs === 'capture'"></capture>
    </div>
  </div>
</template>
<script>
import capture from './videoPane/capture.vue'
import incident from './videoPane/incident.vue'
import store from './videoPane/store.vue'
import { mapGetters, mapActions } from 'vuex'
import timing from './videoPane/timing.vue'
export default {
  name: 'videoControl',
  components: {
    capture,
    incident,
    store,
    timing
  },
  data() {
    return {
      headline: [],
      screenshotPlan: this.$BShasPower('BS-SETTING-VIDEO-PRINTSCREEN'),
      recordPath: this.$BShasPower('BS-SETTING-VIDEO-PATH'),
      recordTimer: this.$BShasPower('BS-SETTING-VIDEO-TIMING'),
      eventRecord: this.$BShasPower('BS-SETTING-VIDEO-EVENT'),
      // 计划模板列表获取
      planNameList: [],
      // 表格上面的下拉框数据重置、搜索清空
      defaultsStore: {
        sonFlag: false,
        fillvalue: '',
        storeServer: '',
        storePath: ''
      },
      defaultsTiming: {
        sonFlag: false,
        openState: '',
        codeStream: '',
        codePlan: '',
        fillvalue: ''
      },
      defaultsIncident: {
        sonFlag: false,
        openState: '',
        codeStream: '',
        codePlan: '',
        fillvalue: ''
      },
      defaultsCapture: {
        sonFlag: false,
        openState: '',
        timeGap: '',
        eventsGap: '',
        fillvalue: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sysConfrole', 'monmentVideoTabs'])
  },
  methods: {
    ...mapActions(['setDeviceIsUpdate', 'getplanName']),
    tickTabs(name) {
      this.$store.commit('SET_VIDEO_TABS', name)
      // 表格上面的下拉框数据重置、搜索清空
      this.defaultsStore = {
        sonFlag: false,
        fillvalue: '',
        storeServer: '',
        storePath: ''
      }
      //  openState: 'disabled',
      //   codeStream: 'main',
      //   codePlan: this.planNameList[0]._id,
      this.defaultsTiming = {
        sonFlag: false,
        openState: '',
        codeStream: '',
        codePlan: '',
        fillvalue: ''
      }
      this.defaultsIncident = {
        sonFlag: false,
        openState: '',
        codeStream: '',
        codePlan: '',
        fillvalue: ''
      }
      this.defaultsCapture = {
        sonFlag: false,
        openState: '',
        timeGap: '',
        eventsGap: '',
        fillvalue: ''
      }
    }
  },
  created() {
    this.getplanName().then((suc) => {
      this.planNameList = suc.data
      // this.defaultsTiming.codePlan = planNameList[0]._id
      // this.defaultsIncident.codePlan = planNameList[0]._id
      // this.defaultsCapture.timeGap = planNameList[0]._id
      // this.defaultsCapture.eventsGap = planNameList[0]._id
    }).catch((err) => {
      console.log('get plan err:' + err)
    })
    if (this.recordPath) {
      this.headline.push('store')
    }
    if (this.recordTimer) {
      this.headline.push('timing')
    }
    if (this.eventRecord) {
      this.headline.push('incident')
    }
    if (this.screenshotPlan) {
      this.headline.push('capture')
    }
    this.$store.commit('SET_VIDEO_TABS', this.headline[0])
    this.setDeviceIsUpdate()
  }
}
</script>
<style lang="less" scoped>
.show-box {
  width: 100%;
}
</style>
