<template>
  <div class="content">
    <!-- <Row>
                          <Col span="24">
                            <ul class="tabHeader clearfix">
                              <li v-for="item of sysTabList" :class="{'active': sysTabActive === item.value}" @click="sysTabActive = item.value">{{item.label}}</li>
                            </ul>
                          </Col>
                        </Row> -->
    <Row>
      <Col span="24">
      <div class="realtime-data">
        <div class="realtime-tittle">
          <span class="title-font">实时数据</span>
          <span class="time-font">{{ newDate }}</span>
        </div>
        <Row v-show="sysTabActive === 'capture'" :gutter="48" class="realtime-content">
          <Col span="6">
          <div class="realtime-card1">
            <div class="iconfont icon-comparison1 section-icon"></div>
            <div class="card-number">{{ realTimeData.comparison }}</div>
            <div class="card-name">比对识别总数</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/face/search/compare')">view more</a>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="realtime-card2">
            <div class="iconfont icon-blacklist section-icon"></div>
            <div class="card-number">{{ realTimeData.black }}</div>
            <div class="card-name">黑名单识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/face/search/compare')">view more</a>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="realtime-card3">
            <div class="iconfont icon-whitelist section-icon"></div>
            <div class="card-number">{{ realTimeData.white }}</div>
            <div class="card-name">白名单识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/face/search/compare')">view more</a>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="realtime-card4">
            <div class="iconfont icon-dispatched section-icon"></div>
            <div class="card-number">{{ realTimeData.dispatched }}</div>
            <div class="card-name">布控识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/face/search/compare')">view more</a>
            </div>
          </div>
          </Col>
        </Row>
        <Row v-show="sysTabActive === 'current'" :gutter="48" class="realtime-content">
          <Col span="6">
          <div class="realtime-card1">
            <div class="iconfont icon-yuangong section-icon"></div>
            <div class="card-number">{{ realTimeData.subject }}</div>
            <div class="card-name">员工识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/pass/search/compare')">view more</a>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="realtime-card2">
            <div class="iconfont icon-fangke section-icon"></div>
            <div class="card-number">{{ realTimeData.vistor }}</div>
            <div class="card-name">访客识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/pass/search/compare')">view more</a>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="realtime-card3">
            <div class="iconfont icon-stranger section-icon"></div>
            <div class="card-number">{{ realTimeData.stranger }}</div>
            <div class="card-name">陌生人识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/pass/search/compare')">view more</a>
            </div>
          </div>
          </Col>
          <Col span="6">
          <div class="realtime-card5">
            <div class="iconfont icon-vip section-icon"></div>
            <div class="card-number">{{ realTimeData.vip }}</div>
            <div class="card-name">VIP识别数量</div>
            <div class="card-change"></div>
            <div class="more">
              <a @click="$router.replace('/pass/search/compare')">view more</a>
            </div>
          </div>
          </Col>
        </Row>
      </div>
      <div class="cartogram">
        <ul class="tabHeader clearfix">
          <span class="title-font" style="float:left;margin-right:100px;">区间分布</span>
          <li v-show="sysTabActive === 'capture'" v-for="item of secTabListCap" :class="{'active': secTabActiveCap === item.value}" @click="secTabActiveCap = item.value">{{item.label}}</li>
          <li v-show="sysTabActive === 'current'" v-for="item of secTabListCur" :class="{'active': secTabActiveCur === item.value}" @click="secTabActiveCur = item.value">{{item.label}}</li>
        </ul>
        <div class="clearfix" style="margin: 20px 0;">
          <div style="float:right;">
            对比:
            <Date-picker :options="{
                                      disabledDate (date) {
                                        return date && date.valueOf() > Date.now() - 86400000
                                      }
                                    }" v-model="contrastDate" @on-open-change="handleDate" type="date" placeholder="对比日期" :clearable="false" style="width: 218px;display:inline-block;"></Date-picker>
          </div>
        </div>
        <BSechart style="width:100%; height:400px;" :options="chartOption"></BSechart>
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
// import moment from 'moment'
// import echarts from 'echarts'
import { mapActions, mapState } from 'vuex'
import BStabs from 'components/tabs/BStabs'
import BStabPane from 'components/tabs/BStabPane'
import BSechart from 'components/BSechart'
export default {
  components: {
    BStabs,
    BStabPane,
    BSechart
  },
  data() {
    return {
      chartOption: null,
      chart: {
        label: ['8045', '2132'],
        serise: [
          { name: '2017-06-25', data: ['8045', '2132'] },
          { name: '2017-06-27', data: ['5000', '4000'] }
        ]
      },
      realTimeData: {
        comparison: '加载中。。。',
        black: '加载中。。。',
        white: '加载中。。。',
        dispatched: '加载中。。。',
        subject: '加载中。。。',
        vistor: '加载中。。。',
        stranger: '加载中。。。',
        increased: '加载中。。。',
        total: '加载中。。。',
        vip: '加载中。。。'
      },
      sysTabActive: 'current',
      secTabActiveCap: '7',
      secTabActiveCur: '0',
      sysTabList: [
        { label: '人脸抓拍', value: 'capture' },
        { label: '人脸通行', value: 'current' }
      ],
      secTabListCap: [
        { label: '比对识别总数', value: '7' },
        { label: '黑名单识别数量', value: '3' },
        { label: '白名单识别数量', value: '4' },
        { label: '布控识别数量', value: '5' }
      ],
      secTabListCur: [
        { label: '员工识别数量', value: '0' },
        { label: '访客识别数量', value: '1' },
        { label: '陌生人识别数量', value: '6' },
        { label: 'VIP识别数量', value: '2' }
      ],
      newDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      nowDate: this.$moment().format('YYYY-MM-DD'),
      contrastDate: ''
    }
  },
  created() {
    this.getHomeHumanPassToday().then((res) => {
      const data = res.data
      this.realTimeData.increased = data.increased
      this.realTimeData.stranger = data.stranger
      this.realTimeData.subject = data.subject
      this.realTimeData.total = data.total
      this.realTimeData.vip = data.vip
      this.realTimeData.vistor = data.vistor
    }).catch(err => {
      console.log('get /human/pass/statistics/today error:' + err)
      this.$Notice.warning({
        title: '获取今日统计信息失败',
        desc: err.response.data.message,
        duration: 1
      })
    })
    this.socketFaceTodayPass()
    // 初始化图表
    this.$nextTick(() => {
      this.getChartData()
    })
    this.updateTime()
  },
  computed: {
    ...mapState({
      todayChart: state => state.face.todayChart,
      faceTodayPassData: state => state.face.faceTodayPassData
    }),
    getType() {
      if (this.sysTabActive === 'capture') {
        return this.secTabActiveCap
      } else {
        return this.secTabActiveCur
      }
    }
  },
  methods: {
    ...mapActions(['getTodayCurChart', 'getHomeHumanPassToday', 'socketFaceTodayPass']),
    updateTime() {
      this.timer = setInterval(() => {
        this.newDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      }, 1000)
    },
    drawChart() {
      this.chartOption = {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'red' // 0% 处的颜色
          }, {
            offset: 1, color: 'blue' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        grid: {
          left: '4%',
          right: '1%',
          top: 40,
          bottom: 40
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chart.serise.map(v => {
            return v.name
          }),
          textStyle: {
            color: '#fff'
          }
        },
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ['stack', 'tiled'] },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chart.label || [],
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
          }
        },
        series: [
          {
            name: (this.chart.serise[1] && this.chart.serise[1].name) || (this.chart.serise[0] && this.chart.serise[0].name),
            type: 'line',
            smooth: true,
            data: (this.chart.serise[1] && this.chart.serise[1].data) || (this.chart.serise[0] && this.chart.serise[0].data),
            itemStyle: {
              normal: {
                color: 'rgba(45, 140, 240, .9)'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(45, 140, 240, .3)'
              }
            }
          },
          {
            name: this.chart.serise.length > 1 ? this.chart.serise[0].name : '',
            type: 'line',
            smooth: true,
            data: this.chart.serise.length > 1 ? this.chart.serise[0].data : [],
            itemStyle: {
              normal: {
                color: 'rgba(255, 255, 255, .9)'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(255, 255, 255, .3)'
              }
            }
          }]
      }
    },
    getChartData() {
      const moment = this.$moment
      setTimeout(() => {
        const dateParStr = this.contrastDate ? '&contrast=' + moment(moment(Date.parse(this.contrastDate)).format('YYYY-MM-DD')) / 1000 : ''
        const paramsStr = '?type=' + this.secTabActiveCur + '&granularity=1&continuity=0' + dateParStr + '&contrast=' + moment(moment(parseInt(new Date().getTime())).format('YYYY-MM-DD')) / 1000
        this.getTodayCurChart(paramsStr).catch(err => {
          this.$Notice.warning({
            title: '获取图表数据失败',
            desc: err.response.data.message,
            duration: 1
          })
        })
      }, 0)
    },
    handleDate(flag) {
      if (!flag) {
        // 根据选择的日期获取数据
        this.getChartData()
      }
    }
  },
  watch: {
    faceTodayPassData(data) {
      this.realTimeData.increased = data.increased
      this.realTimeData.stranger = data.stranger
      this.realTimeData.subject = data.subject
      this.realTimeData.total = data.total
      this.realTimeData.vip = data.vip
      this.realTimeData.vistor = data.vistor
    },
    secTabActiveCap(val) {
      this.getChartData()
    },
    secTabActiveCur(val) {
      this.getChartData()
    },
    sysTabActive(val) {
      this.contrastDate = ''
      this.secTabActiveCap = '2'
      this.secTabActiveCur = '0'
      this.getChartData()
    },
    todayChart: {
      handler(val) {
        this.chart = this.$lodash.cloneDeep(val)
        this.drawChart()
      },
      deep: true
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden
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
    height: 34px;
    float: left;
    padding: 0 10px;
    line-height: 34px;
    font-size: 14px;
    border-top: 2px solid #0f2343;
    outline: none;
    margin-bottom: -1px;
    cursor: pointer;
    // border-right: 2px solid #0f1e3b;
    color: #8C8E98;
  }
  .active {
    color: #fff; // color: #00a5e3;
    // border-left: 2px solid #5d5d5d;
    // border-top: 2px solid #5d5d5d;
    background: #1c3054;
  }
}

.realtime-tittle {
  border-bottom: 1px solid #1C3054;
}

.title-font {
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 15px;
}

.time-font {
  font-size: 18px;
  Color: #0099FF;
  margin-left: 100px;
}

.realtime-content {
  margin-top: 15px;
}

.realtime-card1 {
  background-Color: #3fb1e3;
  height: 130px;
  position: relative;
}

.realtime-card2 {
  background-Color: #7c7cf8;
  height: 130px;
  position: relative;
}

.realtime-card3 {
  background-Color: #e5c65a;
  height: 130px;
  position: relative;
}

.realtime-card4 {
  background-Color: #83cb71;
  height: 130px;
  position: relative;
}

.realtime-card5 {
  background-Color: #777ec7;
  height: 130px;
  position: relative;
}

.realtime-card6 {
  background-Color: #6be6c1;
  height: 130px;
  position: relative;
}

.card-number {
  text-align: right;
  font-size: 24px;
  Color: #fff;
  padding: 0 10px;
  height: 36px;
  line-height: 36px;
}

.card-name,
.card-change {
  text-align: right;
  font-size: 16px;
  Color: #fff;
  padding: 0 10px;
  height: 24px;
}

.more {
  margin-top: 15px;
  text-align: left;
  font-size: 14px;
  Color: #fff;
  height: 30px;
  line-height: 30px;
  text-indent: 1em;
  background-color: rgba(255, 255, 255, .2);
  a {
    color: #fff;
    display: block;
    width: 100%;
    height: 100%;
    text-align: right;
    padding-right: 12px;
  }
}

.title-style {
  font-size: 18px;
  Color: #0099FF;
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
  bottom: -19px;
  left: 0;
  font-size: 110px;
  color: rgba(255, 255, 255, 0.1);
}
</style>
