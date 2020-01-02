<template>
  <div class='bs-main vehicle main-page-bg'>
    <div class='stat-header'>
      <div class="stat-total">
        <span>车流量统计</span>
      </div>
      <div>
        <span>统计日期</span>
        <Date-picker :value="startTime" @on-change="changeStartTime" type='date' :options="dateLimit" :clearable="false" :editable="false" placeholder='开始日期'></Date-picker>
        <Select v-model="compareType" style="width: 80px; margin :0 20px; text-align:center">
          <Option value="1">至</Option>
          <Option value="0">对比</Option>
        </Select>
        <Date-picker :value="today" type='date' @on-change="changeEndTime" :options="dateLimit" :clearable="false" :editable="false" placeholder='结束日期'></Date-picker>
      </div>
      <div class="handle-button">
        <Button type="ghost" @click="submitStat"><i class="ivu-icon iconfont icon-statistical-analysis" style="font-size:14px;"></i>&nbsp;统计</Button>
      </div>
    </div>
    <div class='flow-box'>
      <div class='flow-echart'>
        <BSechart :options='flowOptions'></BSechart>
      </div>
    </div>
    <div class="flow-box ">
      <BSechart :options='carTypeOption'></BSechart>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
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
      endTime: moment().format('YYYY-MM-DD'),
      startTime: moment()
        .subtract(7, 'd')
        .format('YYYY-MM-DD'),
      flowOptions: null,
      compareType: '1',
      carTypeOption: null,
      flowData: null,
      typeData: null
    }
  },
  created: function() {
    this.today = moment().format('YYYY-MM-DD')
    let param = {
      startTime: moment(this.startTime).format('X'),
      endTime: moment(this.endTime).format('X'),
      compareType: this.compareType
    }
    this.getFlowData(param)
    this.getVehicleTypeData(param)
  },
  methods: {
    ...mapActions(['getStatFlowData', 'getStatVehicleType', 'getAllCarTypeList']),
    getCarInfo(val) {},
    getFlowData(param) {
      this.getStatFlowData(param)
        .then(data => {
          this.flowData = data
          let dateList = []
          let seriesData = []
          data.map(item => {
            dateList.push(moment.unix(Number(item.date)).format('YYYY-MM-DD'))
            seriesData.push({
              name: moment.unix(Number(item.date)).format('YYYY-MM-DD'),
              type: 'line',
              smooth: true,
              data: item.countData,
              lineStyle: {
                normal: {
                  width: 3
                }
              }
            })
          })
          this.flowOptions = {
            color: [
              '#3fb1e3',
              '#e5c65a',
              '#7c7cf8',
              '#c64141',
              '#83cb71',
              '#dd702e',
              '#546570',
              '#61a0a8',
              '#7c7cf8',
              '#91d1d3'
            ],
            textStyle: {
              color: '#fff'
            },
            title: {
              text: '车流量统计',
              left: 20,
              top: 10,
              textStyle: {
                fontSize: 14,
                // fontFamily: 'Helvetica',
                fontWeight: 400,
                color: '#ffffff'
              }
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
                  onclick: this.flowExportCsv
                }
              }
            },
            grid: {
              x: 50,
              x2: 60,
              y: 70,
              y2: '10%',
              containLabel: true
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              orient: 'horizontal',
              left: 'center',
              top: 10,
              data: dateList,
              textStyle: {
                color: '#fff',
                fontSize: 14
              },
              inactiveColor: '#515151'
            },
            xAxis: {
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
              name: '时间',
              axisTick: {
                alignWithLabel: true
              },
              boundaryGap: false,
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
            },
            yAxis: {
              type: 'value',
              name: '次数',
              splitArea: { show: false },
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
            },
            series: seriesData
          }
        })
        .catch(err => console.log(err))
    },
    getVehicleTypeData(param) {
      this.getAllCarTypeList().then(carTypeList => {
        carTypeList.map(item => {
          item.countList = []
        })
        this.getStatVehicleType(param)
          .then(data => {
            this.typeData = data
            let dateList = []
            let totalData = []
            data.map(item => {
              dateList.push(moment.unix(Number(item.date)).format('YYYY-MM-DD'))
              totalData.push(item.countAll)
              item.countData.map(unit => {
                carTypeList.map(type => {
                  if (type.name === unit.name) {
                    type.countList.push(unit.countAll)
                  }
                })
              })
            })
            let serie = []
            carTypeList.map(item => {
              serie.push({
                name: item.name,
                type: 'bar',
                stack: 'one',
                barMaxWidth: '100',
                label: {
                  normal: {
                    show: true,
                    formatter: '{c}'
                  }
                },
                data: item.countList
              })
            })
            serie.push({
              name: '流量总数',
              type: 'line',
              data: totalData
            })
            this.carTypeOption = {
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
              textStyle: {
                color: '#ffffff'
              },
              title: {
                text: '车辆类型统计',
                left: 24,
                top: 10,
                textStyle: {
                  fontSize: 14,
                  // fontFamily: 'Helvetica',
                  fontWeight: 400,
                  color: '#ffffff'
                }
              },
              legend: {
                data: carTypeList,
                textStyle: {
                  color: '#ffffff'
                },
                inactiveColor: '#5d5d5d',
                top: 10
              },
              grid: {
                x: 50,
                x2: 60,
                y: 70,
                y2: '8%',
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
                    onclick: this.typeExportCsv
                  }
                }
              },
              xAxis: {
                data: dateList,
                name: '日期',
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
              tooltip: {
                padding: 10,
                backgroundColor: '#222',
                borderColor: '#777',
                borderWidth: 1,
                formatter: function(obj) {
                  if (obj.seriesType === 'bar') {
                    return `<table class="echart-table"><tr>
            <th>日期</th>
            <th>车辆类型</th>
            <th>数量</th>
            <th>总数</th>
            </tr>
            <tr style="text-align:center">
            <td>${obj.name}</td>
            <td>${obj.seriesName}</td>
            <td>${obj.value}</td>
            <td>${totalData[obj.dataIndex]}</td>
            </tr>
          </table>`
                  }
                  if (obj.seriesType === 'line') {
                    return `${obj.seriesName}:${obj.value}`
                  }
                }
              },
              yAxis: {
                type: 'value',
                name: '次数',
                splitArea: { show: false },
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
              },
              series: serie
            }
          })
          .catch(err => console.log(err))
      })
    },
    getCarData(val) {},
    changeStartTime(date) {
      this.startTime = date
    },
    changeEndTime(date) {
      this.endTime = date
    },
    submitStat() {
      let dateCount = (new Date(this.endTime) - new Date(this.startTime)) / (1000 * 3600 * 24)
      if (new Date(this.endTime) - new Date(this.startTime) < 0) {
        this.$Notice.warning({ title: '开始日期不能大于结束日期' })
      } else {
        if (dateCount > 7 && Number(this.compareType) === 1) {
          this.$Notice.warning({ title: '统计日期不能超过7天' })
        } else {
          let param = {
            startTime: moment(this.startTime).format('X'),
            endTime: moment(this.endTime).format('X'),
            compareType: this.compareType
          }
          this.getFlowData(param)
          this.getVehicleTypeData(param)
        }
      }
    },
    flowExportCsv() {
      let data = []
      console.log(this.flowData)
      this.flowData.map(item => {
        let temp = []
        temp.push(moment.unix(Number(item.date)).format('YYYY-MM-DD'))
        let newTemp = temp.concat(item.countData)
        data.push(newTemp)
      })
      let csvData = {
        title: [
          '日期\\时间',
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
        ],
        data: data
      }
      this.$bsValidate.exportCsvByArray(csvData, '车流量统计')
    },
    typeExportCsv() {
      console.log(this.typeData, 336)
      const csvData = {
        title: ['类型\\日期'],
        data: [],
        type: []
      }
      this.typeData.map(item => {
        csvData.title.push(moment.unix(Number(item.date)).format('YYYY-MM-DD'))
        item.countData.map(type => {
          csvData.type.push(type.name)
        })
      })
      csvData.type = this.$bsValidate.uniqueArray(csvData.type)
      for (let i = 0; i < csvData.type.length; i++) {
        let typeCount = []
        this.typeData.map(item => {
          item.countData.map(type => {
            if (type.name === csvData.type[i]) {
              typeCount.push(type.countAll)
            }
          })
        })
        csvData.data.push(typeCount)
      }
      csvData.data.map((item, index) => {
        item.unshift(csvData.type[index])
      })
      console.log(csvData)
      this.$bsValidate.exportCsvByArray(csvData, '车辆类型统计')
    }
  }
}
</script>
<style lang='less' scoped>
.bs-main {
  flex-direction: column;
}

.stat-header {
  display: flex;
  flex: 0 0 60px;
  align-items: center;
  .stat-total {
    margin-left: 24px;
  }
  > div {
    display: flex;
    align-items: center;
    span {
      padding-right: 16px;
      font-size: 14px;
    }
  }
}

.flow-box {
  flex: 1;
  // min-height: 400px;
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
  flex: 0 0 450px;
}

.handle-button button {
  margin-left: 20px;
}
</style>
