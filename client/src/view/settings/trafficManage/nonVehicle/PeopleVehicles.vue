<template>
    <div class="personAndCar main-page-bg bs-main">
      <Form inline :label-width="20" style="display: flex;flex: 0 0 auto">
        <Form-item>
          <div class="camera-position">
            <div class="search">
              <span>车牌号</span>&nbsp;&nbsp;
              <Input v-model="carCode" :maxlength="10" placeholder="请输入..." style="width: 180px" :class="errorBrandJudge ? 'ivu-form-item-error' : ''" />
            </div>
          </div>
        </Form-item>
        <Form-item label="">
          <span>时间段</span>&nbsp;&nbsp;
          <Date-picker :options="{
            disabledDate (date) {
              return date && date.valueOf() > Date.now()
            }
          }" :value="dateRange" type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" :clearable="false" @on-change="dateRange = $event"></Date-picker>
        </Form-item>
        <Form-item>
          <Button-group style="width: 200px;">
            <Button :class="{'active': timeFrame === 7}" type="ghost" style="width: 33.33%" @click="setDate(7)">7天</Button>
            <Button :class="{'active': timeFrame === 14}" type="ghost" style="width: 33.33%" @click="setDate(14)">14天</Button>
            <Button :class="{'active': timeFrame === 30}" type="ghost" style="width: 33.33%" @click="setDate(30)">30天</Button>
          </Button-group>
        </Form-item>
        <Form-item>
          <div style="margin-left: 20px;">
            <Button type="ghost" style="margin-right: 10px;" @click="getChartData">统计</Button>
            <Button type="ghost" @click="exportChart">导出</Button>
          </div>
        </Form-item>
      </Form>
      <div class="personAndCarEchartsBox" >
        <div class="chart">
          <div class="chart-box">
            <p>核验总量统计</p>
            <div class="chart-info">
              <BSechart style="width: 100%; height: 100%;" :options="checkTotalOptions"></BSechart>
            </div>
          </div>
        </div>
         <!-- <div class="checkTotal">
           <BSechart :options='checkTotalOptions'></BSechart>
         </div> -->
        <div class="chart">
          <div class="chart-box">
            <p>核验失败统计</p>
            <div class="chart-info">
              <BSechart style="width: 100%; height: 100%;" :options="checkFailOptions"></BSechart>
            </div>
          </div>
        </div>
        <!-- <div class="checkFail">
          <BSechart :options='checkFailOptions'></BSechart>
        </div> -->
      </div>
      <div style="flex:1;"></div>
    </div>
</template>

<script>
import BSechart from 'components/BSechart'
import { mapActions } from 'vuex'
export default {
  name: 'personAndCar',
  components: {
    BSechart
  },
  data() {
    return {
      errorBrandJudge: false,
      carCode: '', // 默认车牌号
      dateRange: [], // 默认日期对象
      dateRangeArr: [], // 默认日期对象区间内所有对象
      carNum: [], // 默认核验失败 top5
      min: 1000,
      max: 5000,
      statisticsReq: false,
      checkTotal: { // 核验总量图表数据格式
        pTotal: [],
        failed: [],
        success: [],
        total: []
      },
      failedCounts: {
        failed: [],
        success: [],
        pTotal: []
      }
    }
  },
  computed: {
    timeFrame() {
      const moment = this.$moment
      return (moment(this.dateRange[1]) - moment(this.dateRange[0])) / 1000 / 3600 / 24 + 1
    },
    checkTotalOptions() {
      return {
        color: ['#f6b35a', '#82cb71', '#5e8de7', '#e36d6d', '#3fb1e3'],
        textStyle: {
          color: '#fff'
        },
        title: {
          text: '核验总量统计',
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 30,
          data: ['全部核验次数', '核验成功次数', '核验失败次数', '提取失败次数'],
          textStyle: {
            color: '#fff'
          }
          // inactiveColor: '#515151'
        },
        grid: {
          top: '100px',
          left: 20,
          right: 50,
          bottom: '40px',
          containLabel: true
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
          type: 'category',
          data: this.dateRangeArr,
          name: '日期',
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: '数量',
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
        series: [
          {
            name: '全部核验次数',
            type: 'bar',
            stack: 'checkNum',
            data: this.checkTotal.total,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          },
          {
            name: '核验成功次数',
            type: 'bar',
            stack: 'checkNum',
            data: this.checkTotal.success,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          },
          {
            name: '核验失败次数',
            type: 'bar',
            stack: 'checkNum',
            barMaxWidth: 20,
            data: this.checkTotal.failed,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          },
          {
            name: '提取失败次数',
            type: 'bar',
            stack: 'checkNum',
            barMaxWidth: 20,
            data: this.checkTotal.pTotal,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          }
        ]
      }
    },
    checkFailOptions() {
      return {
        color: ['#82cb71', '#5e8de7', '#e36d6d', '#3fb1e3'],
        textStyle: {
          color: '#fff'
        },
        title: {
          text: '核验失败TOP5',
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          top: 30,
          data: ['核验成功次数', '核验失败次数', '提取失败次数'],
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          top: '100px',
          left: 20,
          right: 50,
          bottom: '40px',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          /** boundaryGap: [0, 0.01], */
          name: '次数',
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
          splitLine: {
            show: true,
            lineStyle: {
              color: '#152848'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: this.carNum, // 京Q 20511 、京P 06966 、京N 07N28、京A 80112、京P 28191
          // data: ['京Q 20511', '京P 06966', '京N 07N28', '京A 80112', '京P 28191'],
          axisLine: {
            lineStyle: {
              color: '#5676a9'
            }
          },
          name: '车牌号top5',
          boundaryGap: true,
          axisTick: {
            alignWithLabel: true
          },
          min: 0
        },
        series: [
          {
            name: '核验成功次数',
            type: 'bar',
            data: this.failedCounts.success, // [18203, 23489, 29034, 104970, 131744]
            barMaxWidth: 20,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          },
          {
            name: '核验失败次数',
            type: 'bar',
            data: this.failedCounts.failed, // [19325, 23438, 31000, 121594, 134141],
            barMaxWidth: 20,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          },
          {
            name: '提取失败次数',
            type: 'bar',
            data: this.failedCounts.pTotal, // [19325, 23438, 31000, 121594, 134141],
            barMaxWidth: 20,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            }
          }
        ]
      }
    }
  },
  watch: {
    carCode(newVal, oldVal) {
      this.rulesJudge(newVal, 'carNumber')
    }
  },
  created() {
    this.setDate(7)
  },
  methods: {
    ...mapActions(['getCheckTotal', 'getCheckFailed']),
    getChartData() { // 获取统计数据
      this.getTotalCountData()
      this.getFailedCountData()
    },
    // 获取 核验总量 统计数据
    getTotalCountData() {
      let dateArr = []
      let checkNum = {
        pTotal: [],
        total: [],
        success: [],
        failed: []
      }
      const param = {
        start: this.dateRange[0],
        end: this.dateRange[1],
        plateNo: this.carCode
      }
      this.getCheckTotal(param).then(res => {
        res.data.forEach(item => {
          for (let key in item) {
            dateArr.push(key)
            let val = item[key]
            for (let k in val) {
              checkNum[k].push(val[k])
            }
          }
        })
        this.dateRangeArr = dateArr
        this.checkTotal = checkNum
      }).catch((err) => {
        console.log(err)
        this.errorMsg('获取核验总量统计图表数据失败')
      })
    },
    // 获取核验失败统计图表数据
    getFailedCountData() {
      let carArr = []
      let checkNum = {
        pTotal: [],
        success: [],
        failed: []
      }
      const param = {
        start: this.dateRange[0],
        end: this.dateRange[1]
      }
      this.getCheckFailed(param).then(res => {
        res.data.forEach(item => {
          for (let key in item) {
            let val = item[key]
            carArr.unshift(key)
            for (let k in val) {
              checkNum[k].unshift(val[k])
            }
          }
        })
        this.carNum = carArr
        this.failedCounts = checkNum
      }).catch(() => {
        this.errorMsg('获取核验失败TOP5统计图表数据失败')
      })
    },
    exportChart() {
      let elemIF = document.getElementById('dow')
      if (!elemIF) {
        elemIF = document.createElement('iframe')
        elemIF.id = 'dow'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      elemIF.src = window.location.origin + `/api/MotorVehicle/peopleVehicle/download?start=${this.dateRange[0]}&end=${this.dateRange[1]}&plateNo=${this.carCode}`
    },
    rulesJudge(newval, type) {
      const nativecode = newval.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 10) {
        if (type === 'carNumber') {
          this.errorBrandJudge = true
        }
        this.$Notice.warning({
          desc: '不能超过10位字符',
          duration: 1
        })
      } else {
        if (type === 'carNumber') {
          this.errorBrandJudge = false
        }
      }
    },
    setDate(n) {
      const startTime = this.$moment(new Date().valueOf() - (n - 1) * 24 * 3600 * 1000).format('YYYY-MM-DD')
      const endTime = this.$moment(new Date()).format('YYYY-MM-DD')
      this.dateRange = [startTime, endTime]
      this.getChartData()
    }
  }
}
</script>

<style lang="less" scoped>
.personAndCar{
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0;
  height: 100%;
}
.bs-main{
  flex-direction: column;
}
.personAndCar .search .input {
  width:300px;
  display: inline-block;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #5676a9;
  border-radius: 4px;
  color: #ffffff;
  background-color: #1b3153;
  background-image: none;
  position: relative;
  cursor: text;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.personAndCar .input:focus {
  border-color: #6badfa;
  outline: 0;
  box-shadow: 0 0 0 0 #6badfa;
}
.personAndCar .search .btn {
  border: none;
  font-size: 14px;
  background: transparent;
  color: #fff;
  outline: none;
  cursor: pointer;
  position: relative;
  right: 19px;
  top: 1px;
}
.ivu-BStabs-nav .ivu-BStabs-tab-disabled {
  font-size: 16px;
  font-weight: bold;
  color: #495060 !important;
}
.ivu-form-item {
  margin-bottom: 24px;
}
.personAndCarEchartsBox{
  display: flex;
  flex: 1;
  padding: 0 24px;
  overflow: hidden;
  .checkTotal,.checkFail{
    display: flex;
    flex: 1;
  }
}
.chart {
  flex: 1;
  height: 100%;
  padding: 0 12px;
  .chart-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    p {
      height: 30px;
      font-size: 14px;
      color: #fff;
      line-height: 30px;
      background: #0f2243;
      padding-left: 24px;
    }
    .chart-info {
      flex: 1;
    }
  }
}
</style>
