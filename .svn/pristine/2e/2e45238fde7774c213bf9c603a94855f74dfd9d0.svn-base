<template>
    <div class="recordAnalysis">
      <Row style="width: 100%" class="titleBox">
        <Col span="24">
          <div class="title">
            <div style=" display: inline-block;">
              <span>选择通道</span>
              <div class="search" style="display:inline-block;margin-left: 15px">
                <input v-model="orgTreeSearch" @focus="isExpand = true; orgTreeSearch = ''" @blur="isSelect? '': isExpand = false" @click="isExpand = !isExpand" :icon="isExpand ? 'arrow-up-b' : 'arrow-down-b'" type="text" class="input" placeholder="请输入..." ></input>
                <!--<button class="btn" @click="isExpand = !isExpand">
                  <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'" @click="isExpand = !isExpand"></Icon>
                </button>-->
                <button class="btn" @click.stop="isExpand = !isExpand; if (isExpand) { orgTreeSearch = '' }">
                  <Icon :type="isExpand ? 'arrow-up-b' : 'arrow-down-b'"></Icon>
                </button>
              </div>
              <div style="margin-left: 65px" :class="['search-tree-info', isExpand? '':'hidden']" @mouseenter.stop="isSelect = true" @mouseleave.stop="isSelect = false">
                <VTree ref="channelTrees"
                       :searchVal="orgTreeSearch"
                       :treeData="devList"
                       :options="{showInput: true}"></VTree>
              </div>
            </div>
            <div style=" display: inline-block;margin-left: 15px">
              <span style="display: inline-block;margin-right: 15px">时间段</span>
              <Date-picker :options="{
            disabledDate (date) {
              return date && date.valueOf() > Date.now()
            }
          }" v-model="dateRange" type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" :clearable="false"></Date-picker>
            </div>
            <div style=" display: inline-block;margin-left: 15px">
              <Button-group style="width: 200px;">
                <Button :class="{'active': timeFrame === 7}" type="ghost" style="width: 33.33%" @click="setDate($event, 7)">7天</Button>
                <Button :class="{'active': timeFrame === 15}" type="ghost" style="width: 33.33%" @click="setDate($event, 15)">15天</Button>
                <Button :class="{'active': timeFrame === 30}" type="ghost" style="width: 33.33%" @click="setDate($event, 30)">30天</Button>
              </Button-group>
            </div>
            <div style="margin-left: 100px; display: inline-block">
              <Button type="ghost" style="width: 90px; margin-right: 10px;" @click="getChartData('1')">统计</Button>
              <Button type="ghost" @click="exportData" :disabled="!analysisData.defenseAlarms.length && !analysisData.pedTop10.length && !analysisData.vehTop10.length && !analysisData.nonVehTop10.length"  style="width: 90px;">导出</Button>
            </div>
          </div>
        </Col>
      </Row>
      <div class="content">
        <div class="echartsBox">
          <BSechart :options="personFlow" ></BSechart>
        </div>
        <div class="echartsBox">
          <BSechart :options="motorVehicleFlow" ></BSechart>
        </div>
        <div class="echartsBox">
          <BSechart :options="unMotorVehicleFlow" ></BSechart>
        </div>
        <div class="echartsBox">
          <BSechart :options="timeAlarm" ></BSechart>
        </div>
      </div>
    </div>
</template>

<script>
import BSechart from '@src/components/BSechart'
import toTreeData from '@src/assets/js/toTreeData.js'
import {mapActions} from 'vuex'
let bodyEle
export default {
  name: 'recordAnalysis',
  data() {
    return {
      // 初始化检索通道值
      orgTreeSearch: '全部',
      isExpand: false,
      isSelect: false,
      devList: toTreeData([]),
      treeOptionNum: 0,
      dateRange: [],
      personFlow: {
        color: ['#3398DB'],
        title: {
          text: '行人流量',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }/*,
          subtext: '数据截止:' + this.$moment().format('YYYY年MM月DD日'),
          subtextStyle: {
            color: '#ffffff'
          } */
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b0}<br /> {a0}：{c0}'
        },
        textStyle: {
          color: '#ffffff'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisLabel: {
            formatter: function(valueX) {
              return valueX.slice(6)
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ffffff'
            }
          }/*,
          name: '人口（百万）',
          nameLocation: 'middle',
          nameGap: 30 */
        },
        series: [
          {
            name: '人口流量',
            type: 'bar',
            data: []
          }
        ]
      },
      motorVehicleFlow: {
        color: ['#3398DB'],
        title: {
          text: '机动车流量',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }/*,
          subtext: '数据截止:' + this.$moment().format('YYYY年MM月DD日'),
          subtextStyle: {
            color: '#ffffff'
          } */
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b0}<br /> {a0}：{c0}'
        },
        textStyle: {
          color: '#ffffff'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisLabel: {
            formatter: function(valueX) {
              return valueX.slice(6)
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ffffff'
            }
          }/*,
          name: '机动车（百万）',
          nameLocation: 'middle',
          nameGap: 30 */
        },
        series: [
          {
            name: '机动车流量',
            type: 'bar',
            data: []
          }
        ]
      },
      unMotorVehicleFlow: {
        color: ['#3398DB'],
        title: {
          text: '非机动车流量',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }/*
          subtext: '数据截止:' + this.$moment().format('YYYY年MM月DD日'),
          subtextStyle: {
            color: '#ffffff'
          } */
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '{b0}<br /> {a0}：{c0}'
        },
        textStyle: {
          color: '#ffffff'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisLabel: {
            formatter: function(valueX) {
              return valueX.slice(6)
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ffffff'
            }
          }/*,
          name: '非机动车（百万）',
          nameLocation: 'middle',
          nameGap: 30 */
        },
        series: [
          {
            name: '非机动车流量',
            type: 'bar',
            data: []
          }
        ]
      },
      timeAlarm: {
        title: {
          text: '时段布控报警统计',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }/*,
          subtext: '数据截止:' + this.$moment().format('YYYY年MM月DD日'),
          subtextStyle: {
            color: '#ffffff'
          } */
        },
        tooltip: {
          trigger: 'axis'
        },
        textStyle: {
          color: '#ffffff'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          axisLabel: {
            formatter: function(valueX) {
              return valueX.slice(6)
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#ffffff'
            }
          }/*,
          name: '人口（百万）',
          nameLocation: 'middle',
          nameGap: 30 */
        },
        series: {
          name: '时段布控报警统计',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          data: [],
          itemStyle: {normal: {
            color: '#86BAEE',
            areaStyle: {color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#86BAEE' // 0% 处的颜色
              }, {
                offset: 1, color: '#ffffff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }},
            lineStyle: {
              color: '#86BAEE' // 改变折线颜色
            }

          }
          }

        }
      },
      analysisData: {
        defenseAlarms: [],
        pedTop10: [],
        vehTop10: [],
        nonVehTop10: []
      },
      elemIF: null
      // echartHeight: '355px'
    }
  },
  components: {
    BSechart
  },
  created() {
    this.setDate('', 7)
  },
  mounted() {
    this.getVideoStructTree().then(res => {
      // 获取视频通道树
      this.devList = toTreeData([res.data])
      // this.getResData('', '1')
      this.$nextTick(() => {
        const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepIps() : {}
        this.treeOptionNum = selectTree.count // 节点数量
        bodyEle = document.getElementsByTagName('body')[0]
        bodyEle.addEventListener('click', this.listenerClick)
        this.defaultChart()
      })
    })
      .catch(err => {
        console.log('获取设备树出错', err)
      })
  },
  methods: {
    ...mapActions('videoStructuredSetting', ['getVideoStructuredParamEdit']),
    ...mapActions(['getVideoStructTree']),
    ...mapActions('videoStructuredDataRecord', ['getDataRecord', 'exportDatas']),
    defaultChart() {
      const moment = this.$moment
      let startTimeFormat = moment(this.dateRange[0]).format('YYYY-MM-DD')
      let endTimeFormat = moment(this.dateRange[1]).format('YYYY-MM-DD')
      let personArrX = []
      let personArrSeries = []
      let motorVehicleFlowArrX = []
      let motorVehicleFlowSeries = []
      let unMotorVehicleFlowArrX = []
      let unMotorVehicleFlowSeries = []
      let timeAlarmArrX = []
      let timeAlarmSeries = []
      let chooseTimes = this.getDayAll(startTimeFormat, endTimeFormat) // 获取选择的时间段数组
      for (let item of chooseTimes) { // 布控报警默认图表
        timeAlarmArrX.push(item)
        timeAlarmSeries.push(0)
      }
      for (let item of chooseTimes) { // 行人默认图表
        personArrX.push(item)
        personArrSeries.push(0)
      }
      for (let item of chooseTimes) { // 机动车默认图表
        motorVehicleFlowArrX.push(item)
        motorVehicleFlowSeries.push(0)
      }
      for (let item of chooseTimes) { // 非机动车默认图表
        unMotorVehicleFlowArrX.push(item)
        unMotorVehicleFlowSeries.push(0)
      }
      this.personFlow.xAxis.data = personArrX
      this.personFlow.series[0].data = personArrSeries
      this.motorVehicleFlow.xAxis.data = motorVehicleFlowArrX
      this.motorVehicleFlow.series[0].data = motorVehicleFlowSeries
      this.unMotorVehicleFlow.xAxis.data = unMotorVehicleFlowArrX
      this.unMotorVehicleFlow.series[0].data = unMotorVehicleFlowSeries
      this.timeAlarm.xAxis.data = timeAlarmArrX
      this.timeAlarm.series.data = timeAlarmSeries
    },
    setDate(e, n) {
      const moment = this.$moment
      const start = new Date(moment(moment().format('YYYY-MM-DD')) - 3600 * 1000 * 24 * (n - 1))
      const end = new Date(moment(moment().format('YYYY-MM-DD')))
      const dateRange = []
      dateRange[0] = start
      dateRange[1] = end
      this.dateRange = JSON.parse(JSON.stringify(dateRange))
    },
    async getChartData(type) {
      const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepIps() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) { // 全选或者默认状态
        this.getResData('', type)
      } else { // 选择部分节点
        const reqSelectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepIds().toString() : ''
        this.getResData(reqSelectTree, type)
      }
    },
    getStructureServer(id) {
      return this.getVideoStructuredParamEdit({id})
    },
    exportData() {
      this.getChartData('2')
    },
    changeCamera() { // 选择节点树
      const selectTree = this.$refs.channelTrees ? this.$refs.channelTrees.getSelectedDeepIps() : {}
      if (selectTree.name.length === 0 || selectTree.name.length === this.treeOptionNum) { // 全选或者默认状态
        return '全部'
      } else { // 选择部分节点
        return selectTree.name.join(';')
      }
    },
    listenerClick(e) {
      if (e.target.classList.contains('input') || e.target.classList.contains('item') || e.target.classList.contains('treeliBox') || e.target.classList.contains('search-tree-info') || e.target.classList.contains('search')) {
        this.isExpand = true
      } else {
        this.isExpand = false
      }
    },
    getResData(channelStr, type) { // 获取数据
      const moment = this.$moment
      let current = moment().format('YYYY-MM-DD')
      let startTime = moment(this.dateRange[0]).unix() * 1000
      let endTime = moment(this.dateRange[1]).unix() * 1000
      let startTimeFormat = moment(this.dateRange[0]).format('YYYY-MM-DD')
      let endTimeFormat = moment(this.dateRange[1]).format('YYYY-MM-DD')
      let params = {
        startTime: startTime, // moment(this.dateRange[0]).unix() * 1000,
        endTime: null, // moment(this.dateRange[1]).unix() * 1000,
        videoChannels: channelStr
      }
      if (startTime === endTime) { // 选中某一天
        // 判断是否是当天
        if (current === endTimeFormat) { // 如果是当天,获取当前时间毫秒数
          params.endTime = moment().unix() * 1000 + 999
        } else {
          params.endTime = params.startTime + 24 * 3600 * 1000 + 999
        }
      } else { // 选中的是区间
        params.endTime = endTime + 24 * 3600 * 1000 + 999
      }
      if (type === '1') { // 统计分析获取图表数据
        this.getDataRecord(params).then(res => {
          this.analysisData = JSON.parse(JSON.stringify(res.data))
          let personArrX = []
          let personArrSeries = []
          let motorVehicleFlowArrX = []
          let motorVehicleFlowSeries = []
          let unMotorVehicleFlowArrX = []
          let unMotorVehicleFlowSeries = []
          let timeAlarmArrX = []
          let timeAlarmSeries = []
          let chooseTimes = this.getDayAll(startTimeFormat, endTimeFormat) // 获取选择的时间段数组
          if (this.analysisData.defenseAlarms.length) { // 如果布控报警有数据
            this.analysisData.defenseAlarms.sort((a, b) => {
              return moment(a.time).unix() - moment(b.time).unix()
            })
            for (let item of this.analysisData.defenseAlarms) { // 布控报警
              // item.time = moment(item.time).format('YYYY-MM-DD')
              let localTime = moment(item.time).format('YYYY-MM-DD')
              timeAlarmArrX.push(localTime)
              timeAlarmSeries.push(item.count)
            }
          } else { // 布控报警没数据
            for (let item of chooseTimes) {
              timeAlarmArrX.push(item)
              timeAlarmSeries.push(0)
            }
          }
          if (this.analysisData.pedTop10.length) { // 行人流量有数据
            this.analysisData.pedTop10.sort((a, b) => {
              return moment(a.time).unix() - moment(b.time).unix()
            })
            for (let item1 of this.analysisData.pedTop10) { // 行人流量
              let localTime = moment(item1.time).format('YYYY-MM-DD')
              personArrX.push(localTime)
              personArrSeries.push(item1.count)
            }
          } else {
            for (let item of chooseTimes) {
              personArrX.push(item)
              personArrSeries.push(0)
            }
          }
          if (this.analysisData.vehTop10.length) { // 机动车流量有数据
            this.analysisData.vehTop10.sort((a, b) => {
              return moment(a.time).unix() - moment(b.time).unix()
            })
            for (let item2 of this.analysisData.vehTop10) {
              let localTime = moment(item2.time).format('YYYY-MM-DD')
              motorVehicleFlowArrX.push(localTime)
              motorVehicleFlowSeries.push(item2.count)
            }
          } else {
            for (let item of chooseTimes) {
              motorVehicleFlowArrX.push(item)
              motorVehicleFlowSeries.push(0)
            }
          }
          if (this.analysisData.nonVehTop10.length) { // 非机动车流量有数据
            this.analysisData.nonVehTop10.sort((a, b) => {
              return moment(a.time).unix() - moment(b.time).unix()
            })
            for (let item3 of this.analysisData.nonVehTop10) { // 非机动车流量
              let localTime = moment(item3.time).format('YYYY-MM-DD')
              unMotorVehicleFlowArrX.push(localTime)
              unMotorVehicleFlowSeries.push(item3.count)
            }
          } else {
            for (let item of chooseTimes) {
              unMotorVehicleFlowArrX.push(item)
              unMotorVehicleFlowSeries.push(0)
            }
          }
          this.personFlow.xAxis.data = personArrX
          this.personFlow.series[0].data = personArrSeries
          this.motorVehicleFlow.xAxis.data = motorVehicleFlowArrX
          this.motorVehicleFlow.series[0].data = motorVehicleFlowSeries
          this.unMotorVehicleFlow.xAxis.data = unMotorVehicleFlowArrX
          this.unMotorVehicleFlow.series[0].data = unMotorVehicleFlowSeries
          this.timeAlarm.xAxis.data = timeAlarmArrX
          this.timeAlarm.series.data = timeAlarmSeries
        }, err => {
          console.log(err)
        })
      } else { // 导出获取数据
        let str = []
        for (let item in params) {
          str.push(`${item}=${params[item]}`)
        }
        if (!this.elemIF) {
          this.elemIF = document.createElement('iframe')
        }
        this.elemIF.src = window.location.origin + `/api/structure/statistic/export?${str.join('&')}`
        this.elemIF.style.display = 'none'
        document.body.appendChild(this.elemIF)
      }
    },
    convertUTCTimeToLocalTime(UTCDateString) {
      if (!UTCDateString) {
        return '-'
      }
      function formatFunc(str) { // 格式化显示
        return str > 9 ? str : '0' + str
      }
      let date2 = new Date(UTCDateString) // 这步是关键
      let year = date2.getFullYear()
      let mon = formatFunc(date2.getMonth() + 1)
      let day = formatFunc(date2.getDate())
      let hour = date2.getHours()
      /* let noon = hour >= 12 ? 'PM' : 'AM'
      hour = hour >= 12 ? hour - 12 : hour
      */
      hour = formatFunc(hour)
      let min = formatFunc(date2.getMinutes())
      let dateStr = year + '-' + mon + '-' + day + ' ' + hour + ':' + min
      return dateStr
    },
    getDayAll(begin, end) { // 获取时间段每天的时间
      const moment = this.$moment
      let dateAllArr = []
      let ab = begin.split('-')
      let ae = end.split('-')
      let db = new Date()
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      let de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      let unixDb = db.getTime()
      let unixDe = de.getTime()
      for (let k = unixDb; k <= unixDe;) {
        let currentDate = new Date(parseInt(k))
        dateAllArr.push(moment(currentDate).format('YYYY-MM-DD'))
        k = k + 24 * 60 * 60 * 1000
      }
      return dateAllArr
    }
  },
  computed: {
    timeFrame() {
      const moment = this.$moment
      return (moment(this.dateRange[1]) - moment(this.dateRange[0])) / 1000 / 3600 / 24 + 1
    }
  },
  watch: {
    isExpand(val) {
      if (!val) {
        this.orgTreeSearch = this.changeCamera()
      }
    }
  }
  /* beforeDestroy() {
    bodyEle.removeEventListener('click', this.listenerClick)
  } */
}
</script>

<style scoped>
.recordAnalysis{
  /*margin-right: 16px;
  width: 100%;*/
  display: flex;
  overflow: hidden;
  flex-flow: column;
  width: 100%;
}
  .content{
    background: #1b3153;
    flex: 1 1 auto;
    display: flex;
    flex-wrap: wrap;
  }
.search .input {
  width: 400px;
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
.input:focus {
  border-color: #6badfa;
  outline: 0;
  box-shadow: 0 0 0 0 #6badfa;
}
.search .btn {
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
.search-tree-info {
  position: absolute;
  border: #4699f9 1px solid;
  border-radius: 4px;
  padding: 5px;
  margin-top: 8px;
  background-color: #1b3153;
  width: 400px;
  max-height: 372px;
  overflow-y: auto;
  z-index: 1;
}
.search-tree-info.hidden {
  display: none;
}
.echartsBox{
  flex: 1 1 auto;
  width: 50%;
  height: 344.5px;
}
  .titleBox{
    flex: 0 1 auto;
    width: 100%;
    padding-bottom: 16px;
  }
  .title{
    background: #1b3153;
    height: 72px;
    padding-top: 19px;
    padding-left: 15px;
  }
</style>
