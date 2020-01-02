<template>
  <div class="main-content">
    <div class="top">
      <div class="top-item">
        <span>卡口</span>
        <p class="text-box">{{organization}}</p>
        <Select v-model="organization" style="width:200px;" placeholder="">
          <v-tree ref='tree' :treeData="treeData" :options="options" @node-click="handleNode"></v-tree>
        </Select>
      </div>
      <div class="top-item">
        <span>时间段</span>
        <DatePicker type="daterange" :value="dateRange" :options="dateOptions" @on-change="dateRange = $event"></DatePicker>
      </div>
      <ButtonGroup style="margin-right: 100px;">
        <Button type="ghost" :class="{'active': timeFrame === 7}" @click="setDate(7)">7天</Button>
        <Button type="ghost" :class="{'active': timeFrame === 14}" @click="setDate(14)">14天</Button>
        <Button type="ghost" :class="{'active': timeFrame === 30}" @click="setDate(30)">30天</Button>
      </ButtonGroup>
      <Button @click="getChartData">统计</Button>
      <Button @click="exportChart">导出</Button>
    </div>
    <div class="bottom">
      <div class="chart">
        <div class="chart-box">
          <p>流量统计</p>
          <div class="chart-info">
            <BSechart style="width: 100%; height: 100%;" :options="lineOption"></BSechart>
          </div>
        </div>
      </div>
      <div class="chart">
        <div class="chart-box">
          <p>违章统计</p>
          <div class="chart-info">
            <BSechart style="width: 100%; height: 100%;" :options="barOption"></BSechart>
          </div>
        </div>
      </div>
    </div>
    <div style="flex:1;"></div>
  </div>
</template>

<script>
import BSechart from 'components/BSechart'
import { mapActions } from 'vuex'

const label = {
  normal: {
    show: true,
    position: 'top',
    formatter: '{c}',
    fontWeight: 'bold'
  }
}
export default {
  components: {
    BSechart
  },
  data() {
    return {
      treeData: [],
      orgId: '', // 机构ID
      hkDeviceIndexCode: '', // 选中设备ID
      isOrg: true, // 当前选中是否为机构
      organization: '', // 机构名称
      options: {
        moreRoot: true
      },
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      titleDate: '', // 图表标题日期
      dateRange: [], // 时间段
      dateRangeArr: [], // 表格x轴日期
      vehicleCount: [], // 车流量统计数据
      breakVehicleCount: { // 违章统计数据
        stop: [],
        speed: []
      }
    }
  },
  computed: {
    lineOption() {
      return {
        color: ['#f6b35a', '#e36d6d', '#5e8de7', '#82cb71', '#3fb1e3'],
        title: {
          text: `${this.titleDate}车流量统计`,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          left: 'center'
        },
        animation: false,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['合计'],
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: 30
        },
        grid: {
          top: '100px',
          left: 20,
          right: 50,
          bottom: '40px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.dateRangeArr,
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
        series: [
          {
            name: '合计',
            type: 'line',
            smooth: true,
            label: {
              normal: {
                show: true,
                formatter: '{c}'
              }
            },
            data: this.vehicleCount
          }
        ]
      }
    },
    barOption() {
      return {
        color: ['#5e8de7', '#82cb71', '#3fb1e3'],
        title: {
          text: `${this.titleDate}违章统计`,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['超速', '违停'],
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: 30
        },
        grid: {
          top: '100px',
          left: 20,
          right: 20,
          bottom: '40px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {show: false},
          data: this.dateRangeArr,
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
        series: [
          {
            name: '超速',
            type: 'bar',
            barGap: 0,
            label: label,
            data: this.breakVehicleCount.speed
          },
          {
            name: '违停',
            type: 'bar',
            barGap: 0,
            label: label,
            data: this.breakVehicleCount.stop
          }
        ]
      }
    },
    timeFrame() {
      const moment = this.$moment
      return (moment(this.dateRange[1]) - moment(this.dateRange[0])) / 1000 / 3600 / 24 + 1
    }
  },
  created() {
    this.getBayonetList().then(res => {
      this.treeData = [res.data]
      this.organization = this.treeData[0].name
    })
    this.setDate(7)
  },
  methods: {
    ...mapActions(['getBayonetList', 'getVehicleTotal', 'getBreakRuleVehicle']),
    handleNode(node) {
      this.organization = node.name
      if (node.isRoot) {
        this.isOrg = true
        this.orgId = ''
        this.hkDeviceIndexCode = ''
      } else if (node.isOrg) {
        this.isOrg = true
        this.orgId = node._id
        this.hkDeviceIndexCode = ''
      } else {
        this.isOrg = false
        this.orgId = ''
        this.hkDeviceIndexCode = node.devChnId
      }
      this.orgTips = ''
    },
    // 获取表格数据
    getChartData() {
      this.getVehicleFlowData()
      this.getBreakRuleVehicleData()
    },
    // 获取车流量统计图表数据
    getVehicleFlowData() {
      let dateArr = []
      let data = []
      const param = {
        start: this.dateRange[0],
        end: this.dateRange[1]
      }
      if (this.isOrg) {
        param.orgId = this.orgId
      } else {
        param.hkDeviceIndexCode = this.hkDeviceIndexCode
      }
      this.getVehicleTotal(param).then(res => {
        this.titleDate = this.dateRange.join('-')
        for (let key in res.data) {
          dateArr.push(key)
          data.push(res.data[key])
        }
        this.dateRangeArr = dateArr
        this.vehicleCount = data
      }).catch(() => {
        this.errorMsg('获取车流量统计图表数据失败')
      })
    },
    // 获取违章统计统计图表数据
    getBreakRuleVehicleData() {
      let data = {
        speed: [],
        stop: []
      }
      const param = {
        start: this.dateRange[0],
        end: this.dateRange[1]
      }
      if (this.isOrg) {
        param.orgId = this.orgId
      } else {
        param.hkDeviceIndexCode = this.hkDeviceIndexCode
      }
      this.getBreakRuleVehicle(param).then(res => {
        console.log(res.data)
        for (let key in res.data) {
          data.speed.push(res.data[key].speed)
          data.stop.push(res.data[key].stop)
        }
        this.breakVehicleCount = data
      }).catch(() => {
        this.errorMsg('获取违章统计图表数据失败')
      })
    },
    setDate(n) {
      const startTime = this.$moment(new Date().valueOf() - (n - 1) * 24 * 3600 * 1000).format('YYYY-MM-DD')
      const endTime = this.$moment(new Date()).format('YYYY-MM-DD')
      this.dateRange = [startTime, endTime]
      this.getChartData()
    },
    exportChart() {
      let elemIF = document.getElementById('dow')
      if (!elemIF) {
        elemIF = document.createElement('iframe')
        elemIF.id = 'dow'
        elemIF.style.display = 'none'
        document.body.appendChild(elemIF)
      }
      elemIF.src = window.location.origin + `/api/MotorVehicle/passVehicle/download?start=${this.dateRange[0]}&end=${this.dateRange[1]}&orgId=${this.orgId}`
    }
    // downloadChart(canvas) {
    //   const url = canvas.toDataURL('image/jpeg')
    //   /* 使用这种方式导出后缀为.jfif格式 */
    //   // const url = canvas.toDataURL('image/jpeg')
    //   // let a = document.createElement('a')
    //   // a.download = '车流量统计'
    //   // a.href = url0
    //   // document.body.appendChild(a)
    //   // a.click()
    //   // document.body.removeChild(a)
    //   let bstr = atob(url.split(',')[1]) // eslint-disable-line
    //   let n = bstr.length
    //   let u8arr = new Uint8Array(n)
    //   while (n--) {
    //     u8arr[n] = bstr.charCodeAt(n)
    //   }
    //   let blob = new Blob([u8arr], { type: 'image/jpeg;charset = utf-8' })
    //   saveAs(blob, 'image.jpeg')
    // }
  }
}
</script>

<style scoped lang='less'>
.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.top {
  height: 32px;
  margin-bottom: 24px;
  padding-left: 24px;
}
.top-item {
  float: left;
  margin-right: 100px;
  position: relative;
  span {
    display: inline-block;
    width: 60px;
  }
}
.text-box {
  position: absolute;
  left: 60px;
  font-size: 12px;
  top: 0;
  height: 32px;
  max-width: 176px;
  padding-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
  z-index: 999;
}
.bottom {
  flex: 1;
  padding: 0 24px;
  display: flex;
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
