<template>
  <div class="chartBox">
    <BSechart style="height:100%;width:100%" :options="chartOption"></BSechart>
  </div>
</template>

<script>
import BSechart from '../../components/BSechart'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {

    }
  },
  created() {
    this.getIntelligenceData()
  },
  computed: {
    ...mapState({
      chartOption({ homePage }) {
        var data = homePage.intelligence.statistic
        var echartData = []
        var labels = []
        var minY = 10
        data.map(item => {
          echartData.push(item.count)
          labels.push(item.label)
          if (item.count > 0) {
            minY = 0
          }
        })
        return {
          color: ['#3fb1e3', '#6be6c1', '#626c91', '#56afc1', '#599490', '#777ec7', '#577dce', '#83cb71', '#7c7cf8', '#91d1d3'],
          textStyle: {
            color: '#ffffff'
          },
          grid: {
            left: '3%',
            right: '4%',
            top: 30,
            bottom: 20,
            containLabel: true
          },
          tooltip: {},
          xAxis: {
            data: labels,
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
          yAxis: [
            {
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
            }
          ],
          series: [{
            name: '次数',
            type: 'bar',
            data: echartData,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: true
              }
            },
            barMaxWidth: 50
          }]
        }
      }
    })
  },
  methods: {
    ...mapActions(['getIntelligenceData'])
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
