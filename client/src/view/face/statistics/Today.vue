<template src="./Today.html"></template>

<script>
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
      timer: null,
      chartOption: null,
      chart: {
        label: ['8045', '2132'],
        serise: [{ name: '2017-06-25', data: ['8045', '2132'] }, { name: '2017-06-27', data: ['5000', '4000'] }]
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
      sysTabActive: 'capture',
      secTabActiveCap: '7',
      secTabActiveCur: '0',
      sysTabList: [{ label: '人脸抓拍', value: 'capture' }, { label: '人脸通行', value: 'current' }],
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
    this.getHomeHumanToday()
      .then(res => {
        const data = res.data
        this.realTimeData.comparison = data.comparsion
        this.realTimeData.black = data.black
        this.realTimeData.white = data.white
        this.realTimeData.dispatched = data.attention
      })
      .catch(err => {
        this.$Notice.warning({
          title: '获取今日统计信息失败',
          desc: err.response.data.message,
          duration: 1
        })
      })
    this.socketFaceToday()
    // 初始化图表
    this.$nextTick(() => {
      this.getChartData()
    })
    this.timer = setInterval(this.updateTime, 10000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  computed: {
    ...mapState({
      todayChart: state => state.face.todayChart,
      faceTodayData: state => state.face.faceTodayData
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
    ...mapActions(['getTodayCapChart', 'getHomeHumanToday', 'socketFaceToday']),
    updateTime() {
      this.newDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    drawChart() {
      this.chartOption = {
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
          left: '4%',
          right: '1%',
          top: 40,
          bottom: 40
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let str = [
              `时间 :${params[0].axisValue}:00<br />`,
              `日期:${params[0].seriesName};数量:${params[0].value}`
            ].join('')
            return str
          }
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
          },
          right: 12,
          top: -7
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
            name:
              (this.chart.serise[1] && this.chart.serise[1].name) ||
              (this.chart.serise[0] && this.chart.serise[0].name),
            type: 'line',
            smooth: true,
            data:
              (this.chart.serise[1] && this.chart.serise[1].data) ||
              (this.chart.serise[0] && this.chart.serise[0].data),
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
          }
        ]
      }
    },
    getChartData() {
      const moment = this.$moment
      setTimeout(() => {
        const dateParStr = this.contrastDate
          ? '&contrast=' + moment(moment(Date.parse(this.contrastDate)).format('YYYY-MM-DD')) / 1000
          : ''
        const paramsStr =
          '?type=' +
          this.secTabActiveCap +
          '&granularity=1&continuity=0' +
          dateParStr +
          '&contrast=' +
          moment(moment(parseInt(new Date().getTime())).format('YYYY-MM-DD')) / 1000
        this.getTodayCapChart(paramsStr).catch(err => {
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
    chartOption(val) {},
    chart(val) {},
    faceTodayData(data) {
      this.realTimeData.comparison = data.comparsion
      this.realTimeData.black = data.black
      this.realTimeData.white = data.white
      this.realTimeData.dispatched = data.attention
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
    // border-right: 2px solid #0f1e3b;
    color: #8c8e98;
  }
  .active {
    color: #fff; // border-left: 2px solid #5d5d5d;
    // border-top: 2px solid #5d5d5d;
    background: #1c3054;
  }
}

.realtime-tittle {
  border-bottom: 1px solid #1c3054;
  height: 37px;
  line-height: 37px;
}

.title-font {
  font-size: 14px;
  // font-weight: bold;
  margin-left: 24px;
  line-height: 38px;
}

.time-font {
  font-size: 14px;
  color: #0099ff;
  margin-left: 100px;
}

.realtime-content {
  // margin: 48px 0;
}

.ivu-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.realtime-card1 {
  background-color: #3fb1e3;
  height: 130px;
  position: relative;
}

.realtime-card2 {
  background-color: #7c7cf8;
  height: 130px;
  position: relative;
}

.realtime-card3 {
  background-color: #e5c65a;
  height: 130px;
  position: relative;
}

.realtime-card4 {
  background-color: #83cb71;
  height: 130px;
  position: relative;
}

.realtime-card5 {
  background-color: #777ec7;
  height: 130px;
  position: relative;
}

.realtime-card6 {
  background-color: #6be6c1;
  height: 130px;
  position: relative;
}

.card-number {
  text-align: right;
  font-size: 24px;
  color: #fff;
  padding: 0 10px;
  height: 36px;
  line-height: 36px;
}

.card-name,
.card-change {
  text-align: right;
  font-size: 16px;
  color: #fff;
  padding: 0 10px;
  height: 24px;
}

.more {
  margin-top: 15px;
  text-align: left;
  font-size: 14px;
  color: #fff;
  height: 30px;
  line-height: 30px;
  text-indent: 1em;
  background-color: rgba(255, 255, 255, 0.2);
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
  bottom: -19px;
  left: 0;
  font-size: 110px;
  color: rgba(255, 255, 255, 0.1);
}
</style>
