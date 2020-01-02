<template>
  <div class="BSassetChart asset-chart">
    <div ref="charts" class="chart-style" :style="{ height: chartHeight + 'px' }"></div>
  </div>
</template>
<script>
export default {
  name: 'BSassetChart',
  props: {
    chartHeight: {
      type: Number,
      default: 370
    },
    chartList: {
      type: Object
    },
    isRoot: {
      type: Boolean
    }
  },
  data() {
    return {
      overProtection: [],
      sum: [],
      underWarranty: [],
      assetChart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(val) {
            return `${val[0].name}<br/>&nbsp&nbsp设备总数&nbsp:&nbsp&nbsp${val[0].data + val[1].data}<br/>&nbsp&nbsp在保数量&nbsp:&nbsp&nbsp${val[1].data}<br/>&nbsp&nbsp过保数量&nbsp:&nbsp&nbsp${val[0].data}`
          }
        },
        legend: {
          textStyle: {
            color: '#fff'
          },
          data: ['过保设备', '在保设备'],
          selectedMode: false
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['摄像机', '录像机', '报警主机', '消防主机', '报警探头', '消防探头', '报警柱', '报警箱', '闸机', '解码器', '网络键盘', '拼接控制器'],
            axisLabel: {
              color: '#fff' // 刻度标签文字颜色
            },
            axisLine: {
              lineStyle: {
                color: '#fff' // 坐标轴颜色
              }
            },
            splitLine: {
              // show: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#fff' // 刻度标签文字颜色
            },
            axisLine: {
              lineStyle: {
                color: '#fff' // 坐标轴颜色
              }
            },
            splitLine: {
              lineStyle: {
                opacity: 0.3
              }
            }
          }
        ],
        series: [
          {
            name: '过保设备',
            type: 'bar',
            // barWidth: 20,
            stack: '设备',
            itemStyle: {
              normal: {
                color: '#f19149'
              }
            },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '在保设备',
            type: 'bar',
            // barWidth: 20,
            stack: '设备',
            itemStyle: {
              normal: {
                color: '#3fb1e3'
              }
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          }
        ]
      }
    }
  },
  computed: {},
  watch: {
    chartList() {
      if (this.chartList.data) {
        this.sum = []
        this.overProtection = []
        this.underWarranty = []
        this.chartList.data.forEach((item, index) => {
          // 生成echarts图表数据 当机构不为根机构时 报警柱 报警箱 闸机 显示数量为0 数组对应索引项分别为 6 7 8
          if (!this.isRoot && (index === 6 || index === 7 || index === 8)) {
            this.sum.push(0)
            this.overProtection.push(0)
            this.underWarranty.push(0)
          } else {
            this.sum.push(item.sum)
            this.overProtection.push(item.noInsurance)
            this.underWarranty.push(item.insurance)
          }
        })
        this.option.series[0].data = this.overProtection
        this.option.series[1].data = this.underWarranty
        this.chartInit()
      }
    }
  },
  created() { },
  beforeDestroy() {
    this.assetChart.dispose()
    this.assetChart = null
  },
  methods: {
    chartInit() {
      let chartDom = this.$refs.charts
      this.assetChart = this.$echarts.init(chartDom)
      this.assetChart.setOption(this.option)
    }
  }
}
</script>

<style scoped>
.asset-chart {
  width: 100%;
  height: auto;
  padding-top: 10px;
}
.chart-style {
  width: 100%;
}
</style>
