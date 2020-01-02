<template>
  <div class="chartBox">
    <BSechart style="height:100%;width:100%" :options="chartOption"></BSechart>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BSechart from 'components/BSechart'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      chartOption: null,
      chartData: {
        label: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00'],
        serise: [
          {
            name: '入园',
            data: [2478, 1967, 2506, 2383, 2605, 2327, 993, 2238, 1163, 2336, 1770]
          },
          {
            name: '出园',
            data: [1866, 2555, 1111, 1845, 555, 888, 993, 1455, 1766, 2222, 1542]
          }
        ]
      }
    }
  },
  created() {
    this.getHomeHumanTrend()
      .then(res => {
        this.chartData.label = res.data.label.map(v => {
          return v + ':00'
        })
        this.chartData.serise = res.data.serise
        this.drawChart()
      })
      .catch(err => {
        console.log('get /human/statistics/trend error:' + err)
      })
  },
  methods: {
    ...mapActions(['getHomeHumanTrend']),
    drawChart() {
      let minY = 10
      this.chartData.serise.map(item => {
        item.data.map(count => {
          if (count > 0) {
            minY = 0
          }
        })
      })

      this.chartOption = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['入园', '出园'],
          textStyle: {
            color: '#fff'
          },
          right: 10
        },
        grid: {
          top: '30px',
          left: '3%',
          right: '4%',
          bottom: '10px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartData.label,
          axisLine: {
            lineStyle: {
              color: '#5676a9'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#5676a9'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#152848'
            }
          },
          min: minY
        },
        series: [
          {
            name: '入园',
            type: 'line',
            data: this.chartData.serise[0].data,
            itemStyle: {
              normal: {
                color: '#0086d8'
              }
            },
            markLine: {
              symbol: ['none', 'none'],
              label: {
                normal: { show: false }
              },
              lineStyle: {
                normal: {
                  color: '#fa7904',
                  width: 2,
                  type: 'solid'
                }
              },
              data: [
                {
                  yAxis: 1000
                }
              ]
            }
          },
          {
            name: '出园',
            type: 'line',
            data: this.chartData.serise[1].data,
            itemStyle: {
              normal: {
                color: '#ef9559'
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.chartBox {
  width: 100%;
  flex: 1;
  display: flex;
}
</style>
