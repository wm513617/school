<template>
  <div class="chartBox">
    <BSechart style="height:100%;width:100%" :options="chartOption"></BSechart>
  </div>
</template>

<script>
import BSechart from '../../components/BSechart'
import { mapActions } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      chartOption: null
    }
  },
  created() {
    this.getStatDayFlow({ date: this.$moment(this.$moment().format('YYYY-MM-DD')).format('X') }).then(data => {
      var chartData = {
        label: [],
        inData: [],
        outData: []
      }
      var minY = 10
      data.map(item => {
        chartData.label.push(item.hour + ':00')
        chartData.inData.push(item.inNumber)
        chartData.outData.push(item.outNumber)
        if (item.inNumber > 0 || item.outNumber > 0) {
          minY = 0
        }
      })
      this.chartOption = {
        color: ['#3fb1e3', '#6be6c1', '#626c91', '#56afc1', '#599490', '#777ec7', '#577dce', '#83cb71', '#7c7cf8', '#91d1d3'],
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: '30px',
          left: '3%',
          right: '4%',
          bottom: '10px',
          containLabel: true
        },
        legend: {
          data: ['入园', '出园'],
          textStyle: {
            color: '#fff'
          },
          right: 10
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartData.label,
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
            data: chartData.inData,
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
                  color: '#E36D6D',
                  width: 2,
                  type: 'solid'
                }
              },
              data: [{
                name: '入园警戒线',
                yAxis: 5000
              }]
            }
          },
          {
            name: '出园',
            type: 'line',
            data: chartData.outData,
            itemStyle: {
              normal: {
                color: '#ef9559'
              }
            }
          }
        ]
      }
    }).catch(err => console.log('logout error:' + err))
  },
  methods: {
    ...mapActions(['getStatDayFlow'])
  }
}
</script>

<style lang="less" scoped>
.chartBox {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
