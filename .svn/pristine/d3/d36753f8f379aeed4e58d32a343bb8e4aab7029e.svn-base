<template>
  <div id="carCount" class="vehicle" style="flex:1">
    <div class="bs-content">
      <div class="bs-left">
        <Menu theme="dark" :active-name="activeTab" @on-select="seletRoute" width="100%">
          <Menu-group title="数据统计">
            <Menu-item name="/vehicle/stat/day" v-if="oneDayData">单日数据</Menu-item>
            <Menu-item name="/vehicle/stat/flow" v-if="vehicleFlowAnalyze">车流量统计</Menu-item>
            <Menu-item name="/vehicle/stat/cross" v-if="crossingStatistics">路口统计</Menu-item>
            <Menu-item name="/vehicle/stat/warning" v-if="warningStatistics">警情统计</Menu-item>
            <Menu-item name="/vehicle/stat/pass" v-if="vehicleCross">过车查询</Menu-item>
          </Menu-group>
        </Menu>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
  },
  data() {
    return {
      oneDayData: true,
      vehicleFlowAnalyze: true,
      crossingStatistics: true,
      warningStatistics: true,
      vehicleCross: true
    }
  },
  computed: {
    ...mapGetters(['vehicleRecognizerole']),
    activeTab() {
      return this.$route.path
    }
  },
  methods: {
    seletRoute(name) {
      // console.log(name)
      // this.$route.path = name
      this.$router.replace({ path: name })
    }
  },
  beforeDestroy() {
    for (let i = this.$chartList.length; i > 0; i--) {
      this.$chartList[i - 1].dispose()
      this.$chartList[i - 1] = null
      this.$chartList.pop()
    }
  },
  created() {
    // this.oneDayData = this.vehicleRecognizerole.CompositeStatistics && this.vehicleRecognizerole.CompositeStatistics.oneDayData
    // this.vehicleFlowAnalyze = this.vehicleRecognizerole.CompositeStatistics && this.vehicleRecognizerole.CompositeStatistics.vehicleFlowAnalyze
    // this.crossingStatistics = this.vehicleRecognizerole.CompositeStatistics && this.vehicleRecognizerole.CompositeStatistics.crossingStatistics
    // this.warningStatistics = this.vehicleRecognizerole.CompositeStatistics && this.vehicleRecognizerole.CompositeStatistics.warningStatistics
    // this.vehicleCross = this.vehicleRecognizerole.CompositeStatistics && this.vehicleRecognizerole.CompositeStatistics.vehicleCross
  }
}
</script>
