<template>
  <content-module name="dashboard">
    <div class='dashboard-container'>
      <div class='top-container'>
        <Row :gutter="20" style="flex:1">
          <Col span="8" class="chart-item">
          <PeopleActual />
          </Col>
          <Col span="8" class="chart-item">
          <VehicleTimeReal></VehicleTimeReal>
          </Col>
          <Col span="8" class="chart-item">
          <equip></equip>
          </Col>
        </Row>
      </div>
      <div class='bottom-container'>
        <p class="borrom-title">
          <span>今日园区数据分析</span>

          </span>
        </p>
        <Row :gutter="20">
          <Col span="8">
          <div class="bottom-box">
            <p class="bottom-word">人员流动趋势分析图</p>
            <PeopleTrend v-if="refresh" />
          </div>
          </Col>
          <Col span="8">
          <div class="bottom-box">
            <p class="bottom-word">人员特征分析图</p>
            <PeopleFeature v-if="refresh" />
          </div>
          </Col>
          <Col span="8">
          <div class="bottom-box">
            <p class="bottom-word">人员热点分析</p>
            <PeopleHotspot v-if="refresh" />
          </div>
          </Col>
        </Row>
        <Row :gutter="20" style="flex:1;">
          <Col span="8" class="chart-item">
          <div class="bottom-box">
            <p class="bottom-word">车辆流动趋势分析图</p>
            <VehicleFlow v-if="refresh"></VehicleFlow>
          </div>
          </Col>
          <Col span="8" class="chart-item">
          <div class="bottom-box">
            <p class="bottom-word">车辆特征分析图</p>
            <VehicleType v-if="refresh"></VehicleType>
          </div>
          </Col>
          <Col span="8" class="chart-item">
          <div class="bottom-box">
            <p class="bottom-word">智能事件监测分析</p>
            <WarningChart v-if="refresh"></WarningChart>
          </div>
          </Col>
        </Row>
      </div>
    </div>
  </content-module>
</template>

<script>
import PeopleActual from '../face/charts/PeopleActual'
import PeopleTrend from '../face/charts/PeopleTrend'
import PeopleFeature from '../face/charts/PeopleFeature'
import PeopleHotspot from '../face/charts/PeopleHotspot'
import Equip from './Equip'
import VehicleTimeReal from './VehicleTimeReal'
import VehicleFlow from './VehicleFlow'
import VehicleType from './VehicleType'
import WarningChart from './WarningChart'
export default {
  components: {
    PeopleActual,
    PeopleTrend,
    PeopleFeature,
    PeopleHotspot,
    Equip,
    VehicleTimeReal,
    VehicleFlow,
    VehicleType,
    WarningChart
  },
  data() {
    return {
      refresh: true
    }
  },
  created() { },
  beforeDestroy() {
    for (var i = this.$chartList.length; i > 0; i--) {
      this.$chartList[i - 1].clear()
      this.$chartList[i - 1].dispose()
      this.$chartList[i - 1] = null
      this.$chartList.pop()
    }
    if (window.CollectGarbage) {
      window.CollectGarbage()
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  min-width: 1580px;
  min-height: 700px;
  padding: 16px 0;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-container .ivu-table table {
  border-collapse: collapse;
}

.dashboard-container .top-container {
  width: 100%;
  min-width: 1280px;
  height: 35%;
  overflow: hidden;
  // flex: 0 0 350px;
  padding-bottom: 10px;
  display: flex;
}

.top-container .ivu-row {
  flex: 1;
}

.ivu-row .ivu-col.ivu-col-span-8 {
  height: 100%;
  margin-left: 0px;
}

.ivu-col.ivu-col-span-8 .top-box {
  // min-width: 300px;
  // height: 340px;
  background-color: #1b3153; // border: 1px solid rgba(201, 201, 201, 1);
}

.dashboard-container .bottom-container {
  width: 100%;
  min-width: 1280px; // border: 1px solid rgba(201, 201, 201, 1);
  box-shadow: none;
  // padding-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bottom-container .borrom-title {
  padding-left: 10px;
  height: 36px;
  font-size: 18px;
  color: #fff;
  line-height: 36px;
  text-align: center;
}

.bottom-container .borrom-title span {
  position: relative;
}

.bottom-container .borrom-title span::before {
  content: '';
  width: 400px;
  height: 2px;
  border-top: 2px solid #000;
  border-bottom: 2px solid #111c31;
  position: absolute;
  left: -410px;
  top: 10px;
}

.bottom-container .borrom-title span::after {
  content: '';
  width: 400px;
  height: 0px;
  border-top: 2px solid #000;
  border-bottom: 2px solid #111c31;
  position: absolute;
  right: -410px;
  top: 10px;
}

.bottom-container .bottom-box {
  flex: 1;
  margin: 8px 0 5px 0;
  display: flex;
  flex-direction: column;
  background-color: #1b3153; // border: 1px solid rgba(201, 201, 201, 1);
}

.bottom-box .bottom-word {
  height: 30px;
 padding-left: 24px;
  font-size: 14px;
  color: #fff;
  line-height: 30px;
  background: #0f2243;
}

.bottom-container .ivu-row {
  flex: 1;
  overflow: auto;
}

.bottom-container .ivu-row .ivu-col.ivu-col-span-8 {
  height: 100%;
  display: flex;
}

.ivu-col.ivu-col-span-8 .top-box:hover,
.bottom-container:hover {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
  -moz-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
  -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
}

.chart-item {
  flex: 1 0 500px;
  display: flex;
  flex-direction: column;
  .bottom-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    p {
      background: #0f2243;
    }
  }
}
</style>
