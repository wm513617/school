<template>
  <div id="carCount vehicle" style="flex:1">

    <div class="bs-content">
      <div class="bs-left">
        <Menu theme="dark" mode="vertical" active-name="单日数据" width="100%" @on-select="itemShow" class="manage-menu">
          <Menu-item name="单日数据">单日数据</Menu-item>
          <Menu-item name="车流量统计">车流量统计</Menu-item>
          <Menu-item name="路口统计">路口统计</Menu-item>
          <Menu-item name="警情统计">警情统计</Menu-item>
        </Menu>
      </div>
      <div class="bsmain">
        <div style="width:400px;height:400px;float:left">
          <BSechart :options="option">
          </BSechart>
        </div>
        <div style="width:500px;height:400px;float:left">
          <BSechart :options="option2">
          </BSechart>
        </div>
        <div style="width:600px;height:400px;float:left">
          <BSechart :options="option3">
          </BSechart>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import BSechart from '../../components/BSechart'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      carInfo: null,
      option: null,
      option2: null,
      option3: null,
      timer: null
    }
  },
  created() {
    let self = this
    this.timer = setTimeout(self.drawChart, 1000)
  },
  methods: {
    drawChart() {
      self.option = {
        color: ['#E0468C', '#CC91BC', '#CC91BC', '#546570', '#c4ccd3'],
        title: {
          text: '车辆出入统计',
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
          formatter: '{a}<br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          left: 30,
          top: 50,
          data: ['入园车辆', '出园车辆']
        },
        series: [
          {
            name: '车辆出入统计',
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
              },
              normal: {
                textStyle: {
                  fontSize: 14
                },
                formatter: function(param) {
                  return param.name + ':\n' + Math.round(param.value)
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: [{ value: 33, name: '出园车辆' }, { value: 68, name: '入园车辆' }],
            itemStyle: {
              normal: {
                borderWidth: 4,
                borderColor: '#ffffff'
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffset: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      self.option2 = {
        title: {
          text: '车辆出入分析',
          left: 0,
          top: 10,
          textStyle: {
            fontSize: 22,
            fontFamily: 'Helvetica',
            fontWeight: 400
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'horizontal',
          left: 30,
          top: 50,
          data: ['Pantene', 'Rejoice', 'Ziyuan', 'Clear', 'Loreal']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Pantene',
            type: 'line',
            smooth: true,
            data: [67, 63, 60, 65, 62, 60, 73, 78, 77, 68, 68, 69]
          },
          {
            name: 'Rejoice',
            type: 'line',
            smooth: true,
            data: [51, 49, 50, 50, 53, 53, 53, 54, 60, 50, 52, 52]
          },
          {
            name: 'Ziyuan',
            type: 'line',
            smooth: true,
            data: [52, 59, 71, 76, 91, 97, 99, 94, 83, 73, 89, 85]
          },
          {
            name: 'Clear',
            type: 'line',
            smooth: true,
            data: [47, 48, 49, 71, 102, 73, 69, 54, 51, 51, 55, 54]
          },
          {
            name: 'Loreal',
            type: 'line',
            smooth: true,
            data: [22, 111, 43, 11, 99, 76]
          }
        ]
      }
      self.option3 = {
        title: {
          text: '南丁格尔玫瑰图',
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
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
        },
        calculable: true,
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [30, 110],
            center: ['50%', '50%'],
            roseType: 'area',
            label: {
              normal: {
                textStyle: {
                  fontSize: 14
                },
                formatter: function(param) {
                  return param.name + ':\n' + Math.round(param.value)
                }
              }
            },
            data: [
              { value: 10, name: 'rose1' },
              { value: 5, name: 'rose2' },
              { value: 15, name: 'rose3' },
              { value: 25, name: 'rose4' },
              { value: 20, name: 'rose5' },
              { value: 35, name: 'rose6' },
              { value: 30, name: 'rose7' },
              { value: 40, name: 'rose8' }
            ]
          }
        ]
      }
    },
    getCarInfo(val) {},
    getCarData(val) {
      console.log(val, 22222222222)
    }
  },
  beforeDestroy() {
    this.timer = null
    this.drawChart = null
  }
}
</script >
<style scoped>
.bsleft {
  padding: 20px;
}

.car-menu .ivu-menu-horizontal .ivu-menu-item {
  z-index: 0 !important;
}
</style>
