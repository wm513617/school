<template>
    <Modal :mask-closable="false" v-model="chartModal" title="分析比对-1号顶门内侧摄像机" width="900">
      <div class="chart-modal-content" style="width: 100%">
        <div ref="Chart" style="width: 100%; height: 400px;"></div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="closeChartModal">关闭</Button>
      </div>
    </Modal>
</template>

<script>

export default {
  name: 'analysisChart',
  data() {
    return {
      chart: null,
      chartOption: {
        title: {
          text: '设备在线情况和录像情况比对',
          subtext: '设备离线情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['离线次数']
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ['line', 'bar']
            },
            restore: {
              show: true
            },
            saveAsImage: {
              show: true
            }
          }
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          data: ['1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点']
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '蒸发量',
          type: 'bar',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 3, 0, 4, 7, 2, 2, 7, 13, 16, 3, 20, 6, 3],
          markPoint: {
            data: [{
              type: 'max',
              name: '最大值'
            }, {
              type: 'min',
              name: '最小值'
            }]
          },
          markLine: {
            data: [{
              type: 'average',
              name: '平均值'
            }]
          }
        }]
      },
      chartModal: false,
      chartWidth: 500
    }
  },
  computed: {
  },
  watch: {
  },
  updated() {
    this.$nextTick(function() {
      this.chartInit()
    })
  },
  methods: {
    chartInit() {
      let chartDom = this.$refs.Chart
      this.chart = this.$echarts.init(chartDom)
      this.chart.setOption(this.chartOption)
    },
    closeChartModal() {
      this.chartModal = false
    }
  }
}
</script>

<style scoped>
</style>
