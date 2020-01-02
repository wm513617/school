<template>
  <div class="chartBox">
    <div style="flex:1 0 200px">
      <BSechart style="height:100%;width:100%" :options="sexOption"></BSechart>
    </div>
    <div style="flex:1 0 250px">
      <BSechart style="height:100%;width:100%" :options="ageOption"></BSechart>
    </div>
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
      sexOption: null,
      ageOption: null,
      chartData: {
        sex: {
          serise: [{ data: ['0'], name: '男性' }, { data: ['0'], name: '女性' }]
        },
        age: {
          serise: [{ data: ['0'], name: '0-30' }, { data: ['0'], name: '30-50' }, { data: ['0'], name: '50以上' }]
        }
      }
    }
  },
  created() {
    this.getHomeHumanFeature()
      .then(res => {
        this.chartData.sex.serise = res.data[0].serise
        this.chartData.age.serise = res.data[1].serise
        this.drawChart()
      })
      .catch(err => {
        console.log('get /human/statistics/feature error:' + err)
      })
  },
  methods: {
    ...mapActions(['getHomeHumanFeature']),
    drawChart() {
      this.sexOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // legend: {
        //   orient: 'horizontal',
        //   data: ['男性', '女性'],
        //   textStyle: {
        //     color: '#fff'
        //   },
        //   bottom: '10px'
        // },
        series: [
          {
            name: '性别统计',
            type: 'pie',
            radius: '60%',
            data: [
              {
                value: this.chartData.sex.serise[0].data[0],
                name: this.chartData.sex.serise[0].name,
                itemStyle: { normal: { color: '#4bb1f3' } }
              },
              {
                value: this.chartData.sex.serise[1].data[0],
                name: this.chartData.sex.serise[1].name,
                itemStyle: { normal: { color: '#f6b35a' } }
              }
            ],
            label: {
              normal: {
                position: 'outside',
                formatter: '{b}:\n{c}人',
                textStyle: {
                  color: ''
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.ageOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // legend: {
        //   orient: 'horizontal',
        //   textStyle: {
        //     color: '#fff'
        //   },
        //   data: ['0-30', '30-50', '50以上'],
        //   bottom: '10px'
        // },
        series: [
          {
            name: '年龄统计',
            type: 'pie',
            radius: '60%',
            data: [
              {
                value: this.chartData.age.serise[0].data[0],
                name: this.chartData.age.serise[0].name,
                itemStyle: { normal: { color: '#f6b35a' } }
              },
              {
                value: this.chartData.age.serise[1].data[0],
                name: this.chartData.age.serise[1].name,
                itemStyle: { normal: { color: '#d26a69' } }
              },
              {
                value: this.chartData.age.serise[2].data[0],
                name: this.chartData.age.serise[2].name,
                itemStyle: { normal: { color: '#4bb1f3' } }
              }
            ],
            label: {
              normal: {
                position: 'outside',
                formatter: '{b}:\n{c}人',
                textStyle: {
                  color: ''
                }
              }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>
