<template>
  <div>
    <h1>Echarts</h1>
    <Echarts :options="option">
    </Echarts>
    <echarts :options="option">
    </Echarts>
  </div>
</template>
<script>
import Echarts from '../../components/Echarts'
export default {
  components: {
    Echarts
  },
  data() {
    return {
      option: null
    }
  },
  created() {
    let self = this
    setTimeout(function() {
      self.option = {
        title: {
          text: '寝室学习氛围情况调查',
          left: 0,
          top: 10,
          textStyle: {
            fontSize: 22,
            fontFamily: 'Helvetica',
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: 'item',
          formatte: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: 30,
          top: 30,
          data: ['学习氛围差', '学习氛围一般', '学习氛围很好']
        },
        series: [
          {
            name: '寝室学习氛围',
            type: 'pie',
            radius: ['30%', '40%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 33, name: '学习氛围差' },
              { value: 68, name: '学习氛围一般' },
              { value: 7, name: '学习氛围很好' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffset: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }, 2000)
  }
}
</script>
