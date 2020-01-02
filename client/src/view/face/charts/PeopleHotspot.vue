<template>
  <div class="chartBox">
    <BSechart :options="chartOption"></BSechart>
  </div>
</template>

<script>
import BSechart from '../../../components/BSechart'
import { mapState } from 'vuex'
export default {
  components: {
    BSechart
  },
  computed: {
    ...mapState({
      chartOption({ homePage }) {
        let data = homePage.intelligence.contrast
        let chartData = {
          serise: [],
          legends: []
        }
        data.serise.map(item => {
          chartData.serise.push({
            name: item.name,
            type: 'line',
            data: item.data,
            smooth: true
          })
          chartData.legends.push(item.name)
        })

        return {
          color: [
            '#ef9559',
            '#0086d8',
            '#6be6c1',
            '#626c91',
            '#56afc1',
            '#599490',
            '#777ec7',
            '#577dce',
            '#83cb71',
            '#7c7cf8',
            '#91d1d3'
          ],
          // color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47', '#577dce', '#83cb71', '#7c7cf8', '#91d1d3'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: chartData.legends,
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
            data: data.label,
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
            min: 0
          },
          series: chartData.serise
        }
      }
    })
  }
}
</script>

<style lang="less" scoped>
.chartBox {
  flex: 1;
  overflow: hidden;
}
</style>
