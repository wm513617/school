<template>
<div class="content">
  <Row>
    <Col span="24">
    <div class="realtime-data">
      <div class="realtime-tittle">
        <span class="title-font">实时数据</span>
        <span class="time-font">{{ newDate }}</span>
      </div>
      <Row :gutter="36"
        class="realtime-content">
        <Col span="6"
          class="card-left">
        <div class="realtime-card4">
          <div class="iconfont icon-dispatched section-icon"></div>
          <div class="card-number">{{ todayData.passbyCount }}</div>
          <div class="card-name">路人识别总量</div>
          <div class="more">
            <a @click="toRoute('/veriface/PasserSearch/condition')">查看更多</a>
          </div>
        </div>
        </Col>
        <Col span="6"
          class="card-midd">
        <div class="realtime-card1">
          <div class="iconfont icon-comparison1 section-icon"></div>
          <div class="card-number">{{ todayData.alarmCount }}</div>
          <div class="card-name">布控报警数量</div>
          <div class="more">
            <a @click="toRoute('/veriface/AlarmSearch')">查看更多</a>
          </div>
        </div>
        </Col>
        <Col span="6"
          class="card-midd">
        <div class="realtime-card2">
          <div class="iconfont icon-blacklist section-icon"></div>
          <div class="card-number">{{ todayData.userCount }}</div>
          <div class="card-name">底库人员数量</div>
          <div class="more">
            <a @click="toRoute('/veriface/Manage')">查看更多</a>
          </div>
        </div>
        </Col>
        <Col span="6"
          class="card-right">
        <div class="realtime-card3">
          <div class="iconfont icon-whitelist section-icon"></div>
          <div class="card-number">{{todayData.onlineFaceRes + '/' + todayData.faceResCount}}</div>
          <div class="card-name">人脸相机在线情况</div>
          <div class="more">
            <a @click="toRoute('/setting/veriface/org')">查看更多</a>
          </div>
        </div>
        </Col>
      </Row>
    </div>
    <div class="cartogram">
      <div class="tabHeader clearfix">
        <span class="title-font"
          style="float:left;margin-right:100px;">区间分布</span>
      </div>
      <BSechart style="width:50%; height:400px;float:left;"
        :options="passbyChartOption"></BSechart>
      <BSechart style="width:50%; height:400px;float:left;"
        :options="alarmChartOption"></BSechart>
      <div style="width:100%">
        <div style="width:50%;float:left;text-align: center;font-size: 20px;">今日路人识别量</div>
        <div style="width:50%;float:left;text-align: center;font-size: 20px;">今日布控报警量</div>
      </div>
    </div>
    </Col>
  </Row>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BSechart from 'components/BSechart'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      alarmChartOption: null,
      passbyChartOption: null,
      newDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      nowDate: this.$moment().format('YYYY-MM-DD'),
      todayChartData: [
        {
          date: this.$moment().format('YYYY-MM-DD'),
          hourData: [],
          label: [1, 2, 3, 4, 5, 6, 7]
        }
      ],
      timer: null,
      groupList: [
        {
          id: '1',
          name: '路人识别量'
        },
        {
          id: '2',
          name: '布控报警量'
        }
      ],
      statTodayActive: '1'
    }
  },
  created() {
    this.socketVerifaceToday()
    this.getVerifaceStatisticToday().then(() => {
      this.drawChart()
    })
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  computed: {
    ...mapState({
      todayData: state => state.veriface.todayData,
      todayAlarmData: state => state.veriface.todayAlarmData,
      todayPassbyData: state => state.veriface.todayPassbyData
    })
  },
  methods: {
    ...mapActions(['getVerifaceStatisticToday', 'socketVerifaceToday', 'setDefaultSearch']),
    changeActive(item) {
      this.statTodayActive = item.id
      this.drawChart()
    },
    updateTime() {
      this.newDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    drawChart() {
      const alarmChartSeries = []
      const passbyChartSeries = []
      const colorList = [
        {
          color: '#83CB71',
          areaColor: 'rgba(131, 203, 113, .3)'
        },
        {
          color: 'rgba(229, 198,90, .9)',
          areaColor: 'rgba(229, 198, 90, .3)'
        }
      ]
      const chartDataAlarm = JSON.parse(JSON.stringify(this.todayChartData))
      const chartDataPassby = JSON.parse(JSON.stringify(this.todayChartData))

      chartDataAlarm.map((item, index) => {
        alarmChartSeries.push({
          name: item.date,
          type: 'line',
          smooth: true,
          data: this.todayAlarmData,
          label: {
            formatter: '{ a }:{ b }'
          },
          itemStyle: {
            normal: {
              color: colorList[index].color
            }
          },
          areaStyle: {
            normal: {
              color: colorList[index].areaColor
            }
          }
        })
      })
      chartDataPassby.map((item, index) => {
        passbyChartSeries.push({
          name: item.date,
          type: 'line',
          smooth: true,
          data: this.todayPassbyData,
          label: {
            formatter: '{ a }:{ b }'
          },
          itemStyle: {
            normal: {
              color: colorList[index].color
            }
          },
          areaStyle: {
            normal: {
              color: colorList[index].areaColor
            }
          }
        })
      })
      this.alarmChartOption = {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        },
        grid: {
          left: '80px',
          right: '20px',
          top: 40,
          bottom: 40
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params, callback) => {
            let title = params.length ? `时间 :${params[0].axisValue}:00<br />` : ''
            let allData = []
            params.map(item => {
              allData.push(`日期:${item.seriesName};数量:${item.data}`)
            })
            let str = title + allData.join('<br />')
            return str
          }
        },
        legend: {
          data: this.todayChartData.map(v => {
            return v.date
          }),
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          min: this.chartMinY
        },
        series: alarmChartSeries
      }
      this.passbyChartOption = {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'red' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'blue' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        },
        grid: {
          left: '80px',
          right: '20px',
          top: 40,
          bottom: 40
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params, callback) => {
            let title = params.length ? `时间 :${params[0].axisValue}:00<br />` : ''
            let allData = []
            params.map(item => {
              allData.push(`日期:${item.seriesName};数量:${item.data}`)
            })
            let str = title + allData.join('<br />')
            return str
          }
        },
        legend: {
          data: this.todayChartData.map(v => {
            return v.date
          }),
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          min: this.chartMinY
        },
        series: passbyChartSeries
      }
    },
    toRoute(str) {
      this.$router.replace(str)
      if (str === '/veriface/PasserSearch/condition' || str === '/veriface/AlarmSearch') {
        this.setDefaultSearch(true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  flex: 1;
  padding: 0;
}
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.cartogram {
  margin-top: 15px;
  position: relative;
}

.tabHeader {
  width: 100%;
  list-style: none;
  outline: none;
  background: #0f2243;
  li {
    height: 38px;
    float: left;
    padding: 0 10px;
    line-height: 38px;
    font-size: 14px;
    border-top: 2px solid #0f2343;
    outline: none;
    margin-bottom: -1px;
    cursor: pointer;
    color: #8c8e98;
  }
  .active {
    color: #fff;
    border-top: 2px solid #0f2243;
    background: #1c3054;
  }
}

.realtime-tittle {
  border-bottom: 1px solid #1c3054;
  height: 38px;
  line-height: 38px;
  background: #0f2243;
}

.title-font {
  height: 38px;
  line-height: 38px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 15px;
}

.time-font {
  font-size: 18px;
  color: #0099ff;
  margin-left: 100px;
}

.realtime-content {
  margin-top: 15px;
  margin-left: 0 !important;
  margin-right: 0 !important;
  .card-left {
    padding-left: 16px !important;
    padding-right: 12px !important;
  }
  .card-midd {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
  .card-right {
    padding-left: 12px !important;
    padding-right: 16px !important;
  }
}

.realtime-card1 {
  background-color: #3fb1e3;
  height: 167px;
  position: relative;
  overflow: hidden;
}

.realtime-card2 {
  background-color: #7c7cf8;
  height: 167px;
  position: relative;
  overflow: hidden;
}

.realtime-card3 {
  background-color: #e5c65a;
  height: 167px;
  position: relative;
  overflow: hidden;
}

.realtime-card4 {
  background-color: #e7505a;
  height: 167px;
  position: relative;
  overflow: hidden;
}

.realtime-card5 {
  background-color: #777ec7;
  height: 167px;
  position: relative;
}

.realtime-card6 {
  background-color: #6be6c1;
  height: 167px;
  position: relative;
}

.card-number {
  text-align: left;
  margin: 24px 0 0 24px;
  font-size: 50px;
  color: #fff;
  height: 45px;
  line-height: 45px;
}
.card-name,
.card-change {
  text-align: left;
  font-size: 16px;
  color: #fff;
  margin: 24px 0 0 24px;
  height: 24px;
}

.more {
  text-align: right;
  position: relative;
  font-size: 14px;
  color: #fff;
  overflow: hidden;
  padding: 12px 24px 12px 0;
  height: 50px;
  a {
    color: #fff;
    z-index: 10;
  }
}

.title-style {
  font-size: 18px;
  color: #0099ff;
  height: 36.8px;
  line-height: 36.8;
}

.ivu-BStabs-nav .ivu-BStabs-tab-disabled {
  font-size: 16px;
  font-weight: bold;
  color: #495060 !important;
}

.date-compare {
  padding: 5px 50px;
  height: 32px;
  position: relative;
}

.date-control {
  width: 200px;
  position: absolute;
  right: 50px;
  top: 0;
}

.section-icon {
  position: absolute;
  bottom: 27px;
  right: 27px;
  font-size: 95px;
  color: rgba(255, 255, 255, 0.1);
}
</style>
