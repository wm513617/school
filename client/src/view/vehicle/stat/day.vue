<template>
  <div class='bs-main main-page-bg'>
    <div class='stat-header'>
      <div>
        <span>选择日期</span>
        <Date-picker type='date' :options="dateLimit" :value="today" @on-change="changeDate" :clearable="false" :editable="false" placeholder='选择日期'></Date-picker>
      </div>
    </div>
    <!-- 车辆出入分析 -->
    <div class='flow-box'>
      <div class='flow-echart'>
        <BSechart :options='flowOption'></BSechart>
      </div>
    </div>
    <div class='hot-box'>
      <!-- 路口流量 -->
      <div class='scatter-box'>
        <div class='scatter-echart'>
          <BSechart :options='crossOption'></BSechart>
        </div>
      </div>
      <!-- 品牌统计 -->
      <div class="brand-box">
        <div class="brand-echart">
          <BSechart :options='brandOption'></BSechart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BSechart from 'src/components/BSechart'
import { mapActions } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      today: '',
      date: '',
      selectDate: '2017-6-16',
      carInfo: null,
      flowOption: null,
      brandOption: null,
      crossOption: null,
      flowData: null
    }
  },
  created: function() {
    const moment = this.$moment
    this.today = moment(new Date()).format('YYYY-MM-DD')
    this.date = moment(new Date()).format('YYYY-MM-DD')
    this.getInOutData(moment(this.date).format('X'))
    this.getCrossData(moment(this.date).format('X'))
    this.getBrandData(moment(this.date).format('X'))
  },
  methods: {
    ...mapActions(['getStatDayFlow', 'getStatDayCross', 'getStatDayBrand']),
    getInOutData(date) {
      this.getStatDayFlow({ date: date })
        .then(data => {
          const flowData = {
            label: [],
            inData: [], // 入园
            outData: [], // 出园
            warningData: [] // 警情
          }

          this.flowData = data

          data.map(item => {
            flowData.label.push(item.hour + ':00')
            flowData.inData.push(item.inNumber || 0)
            flowData.outData.push(item.outNumber || 0)
            flowData.warningData.push(item.defenseNumber || 0)
          })

          // 车辆出入分析数据
          this.flowOption = {
            textStyle: {
              color: '#ffffff'
            },
            title: {
              text: '车辆出入分析',
              left: 20,
              textStyle: {
                fontSize: 14,
                fontWeight: 400,
                color: '#ffffff'
              }
            },
            grid: {
              left: '5%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            toolbox: {
              iconStyle: {
                normal: {
                  color: '#ffffff',
                  borderColor: '#ffffff',
                  borderWidth: 1
                }
              },
              show: true,
              right: 50,
              feature: {
                myTool1: {
                  show: true,
                  title: '导出',
                  color: '#ffffff',
                  icon:
                    'path://M750.933333 546.133333l170.666667 221.866667H759.466667l-85.333334 128H349.866667L264.533333 768H110.933333l196.266667-221.866667H213.333333L0 768l76.8 256h878.933333l68.266667-256-187.733333-221.866667z" p-id="9000" fill="#ffffff",M230.4 366.933333H426.666667V682.666667h170.666666c8.533333 0 0-315.733333 0-315.733334h196.266667L512 85.333333 230.4 366.933333z" p-id="9001" fill="#ffffff"',
                  onclick: this.exportCsv
                }
              }
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              orient: 'horizontal',
              left: 'center',
              data: ['入园', '出园', '警情'],
              textStyle: {
                color: '#ffffff'
              },
              inactiveColor: '#515151'
            },
            calculable: true,
            xAxis: [
              {
                axisLine: {
                  lineStyle: {
                    color: '#5676a9'
                  }
                },
                axisLabel: {
                  textStyle: {
                    color: '#fff'
                  }
                },
                axisTick: {
                  alignWithLabel: true
                },
                boundaryGap: false,
                name: '时间',
                nameTextStyle: {
                  color: '#ffffff'
                },
                type: 'category',
                data: [
                  '0:00',
                  '1:00',
                  '2:00',
                  '3:00',
                  '4:00',
                  '5:00',
                  '6:00',
                  '7:00',
                  '8:00',
                  '9:00',
                  '10:00',
                  '11:00',
                  '12:00',
                  '13:00',
                  '14:00',
                  '15:00',
                  '16:00',
                  '17:00',
                  '18:00',
                  '19:00',
                  '20:00',
                  '21:00',
                  '22:00',
                  '23:00'
                ]
              }
            ],
            yAxis: [
              {
                type: 'value',
                nameTextStyle: {
                  color: '#ffffff'
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
                }
              }
            ],
            series: [
              {
                name: '入园',
                type: 'line',
                smooth: true,
                data: flowData.inData,
                areaStyle: {
                  normal: {
                    color: new this.$echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(216, 244, 247, 1)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(216, 244, 247, 1)'
                        }
                      ],
                      false
                    )
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#6be6c1'
                  }
                },
                lineStyle: {
                  normal: {
                    width: 3
                  }
                }
              },
              {
                name: '出园',
                type: 'line',
                smooth: true,
                data: flowData.outData,
                areaStyle: {
                  normal: {
                    color: new this.$echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(199, 237, 250,0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(199, 237, 250,0.2)'
                        }
                      ],
                      false
                    )
                  }
                },
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#3fb1e3'
                  }
                }
              },
              {
                name: '警情',
                type: 'line',
                smooth: true,
                data: flowData.warningData,
                areaStyle: {
                  normal: {
                    color: new this.$echarts.graphic.LinearGradient(
                      0,
                      0,
                      0,
                      1,
                      [
                        {
                          offset: 0,
                          color: 'rgba(0, 165, 227,0.5)'
                        },
                        {
                          offset: 1,
                          color: 'rgba(0, 165, 227,0.2)'
                        }
                      ],
                      false
                    )
                  }
                },
                lineStyle: {
                  normal: {
                    width: 3
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#626c91'
                  }
                }
              }
            ]
          }
          // 车辆出入分析数据 结束
        })
        .catch(err => console.log(err))
    },
    getCrossData(date) {
      this.getStatDayCross({ date: date })
        .then(data => {
          const crossData = {
            crossList: [],
            dataList: []
          }
          data.map(item => {
            crossData.crossList.push(item.name)
            crossData.dataList.push({
              value: item.countAll,
              name: item.name
            })
          })
          this.crossOption = {
            color: [
              '#3fb1e3',
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
            title: {
              text: '路口流量',
              left: 24,
              textStyle: {
                fontSize: 14,
                color: '#ffffff',
                fontWeight: 400
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              left: 120,
              data: crossData.crossList,
              textStyle: {
                color: '#ffffff'
              },
              inactiveColor: '#515151'
            },
            calculable: true,
            series: [
              {
                name: '车流量',
                type: 'pie',
                radius: ['5%', '50%'],
                center: ['50%', '55%'],
                roseType: 'area',
                label: {
                  normal: {
                    textStyle: {
                      fontSize: 14
                    },
                    formatter: function(param) {
                      return param.name + ':\n' + param.value + '辆'
                    }
                  }
                },
                data: crossData.dataList
              }
            ]
          }
        })
        .catch(err => console.log(err))
    },
    getBrandData(date) {
      let self = this
      this.getStatDayBrand({ date: date })
        .then(data => {
          const brandData = {
            brandList: [],
            countList: []
          }
          data.map(item => {
            brandData.brandList.push(item.name)
            brandData.countList.push(item.countAll)
          })
          this.brandOption = {
            textStyle: {
              color: '#ffffff'
            },
            title: {
              text: '品牌统计',
              left: 50,
              textStyle: {
                fontSize: 14,
                color: '#ffffff',
                fontWeight: 400
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: '{b}:{c}辆'
            },
            grid: {
              left: '8%',
              right: '7%',
              // bottom: '5%',
              containLabel: true
            },
            xAxis: [
              {
                name: '品牌',
                type: 'category',
                data: brandData.brandList
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '数量(辆)',
                axisLabel: {
                  formatter: '{value}'
                }
              }
            ],
            series: [
              {
                name: self.date,
                type: 'bar',
                itemStyle: {
                  normal: {
                    color: '#3fb1e3'
                  },
                  emphasis: {
                    borderWidth: 3,
                    borderColor: '#ffffff'
                  }
                },
                data: brandData.countList,
                barMaxWidth: 50
              }
            ]
          }
        })
        .catch(err => console.log(err))
    },
    getCarInfo(val) {},
    getCarData(val) {},
    itemShow(val) {},
    changeDate(date) {
      const moment = this.$moment
      this.date = date
      this.getInOutData(moment(date).format('X'))
      this.getCrossData(moment(date).format('X'))
      this.getBrandData(moment(date).format('X'))
    },
    exportCsv() {
      this.$bsValidate.exportCsv(
        {
          title: ['时间', '入园数量', '出园数量', '警情数量'],
          titleForKey: ['hour', 'inNumber', 'outNumber', 'defenseNumber'],
          data: this.flowData
        },
        this.date + '出入园统计'
      )
    }
  }
}
</script>
<style lang='less' scoped>
.bs-main {
  flex-direction: column;
  background: #1c3054;
}

.stat-header {
  flex: 0 0 32px;
  align-items: center;
  padding: 16px 24px;
  > div {
    display: flex;
    flex: 0 0 40%;
    align-items: center;
    span {
      padding-right: 16px;
      font-size: 14px;
    }
  }
}

.hot-box {
  min-height: 280px;
}

.flow-box {
  flex: 1;
  display: flex;
  overflow: hidden;
  .flow-echart {
    flex: 1;
  }
  .flow-table {
    flex: 0 0 300px;
    table {
      width: 100%;
      td {
        text-align: center;
        line-height: 30px;
      }
    }
  }
}

.hot-box {
  flex: 0 0 400px;
  display: flex;
  .scatter-box {
    flex: 0 0 600px;
    display: flex;
    .scatter-echart {
      flex: 1;
    }
  }
  .brand-box {
    flex: 1;
    display: flex;
    .brand-echart {
      flex: 1;
    }
  }
}
</style>
