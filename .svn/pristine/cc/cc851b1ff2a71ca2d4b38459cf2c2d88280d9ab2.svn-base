<template>
    <div class="todayData">
      <div class="title" >
        <Row>
          <Col span="24">
            <p class="title-text">
              <span style="font-size: 16px;font-weight: bold;display: inline-block;margin-left: 30px">实时数据</span>
              <span style="display: inline-block;margin-left: 100px;font-size: 18px;color: #0099ff;">{{newDate}}</span>
            </p>
          </Col>
          <div class="title-type">
            <Col span="6">
              <div class="title-tag-targetTotal">
                <p>
                  <span>{{todayData.todayCount?formatCount(todayData.todayCount.structCount,3):0}}</span>
                  <br>
                  <span>结构化目标总数</span>
                </p>
                <div class="more" @click="$router.replace('/structure/integratedQuery')">
                  <p>查看更多</p>
                  <p>>>></p>
                </div>
              </div>
            </Col>
            <Col span="6">
              <div class="title-tag-alarm" >
                <p>
                  <span>{{todayData.todayCount?formatCount(todayData.todayCount.alarmCount,3):0}}</span>
                  <br>
                  <span>布控报警数量</span>
                </p>
                <div class="more" @click="toRouter()">
                  <p>查看更多</p>
                  <p>>>></p>
                </div>
              </div>
            </Col>
            <Col span="6">
              <div class="title-tag-task">
                <p>
                  <span>{{todayData.todayCount?formatCount(todayData.todayCount.taskCount,3):0}}</span>
                  <br>
                  <span>布控任务数量</span>
                </p>
                <div class="more" @click="$router.replace('/structure/controlManage')">
                  <p>查看更多</p>
                  <p>>>></p>
                </div>
              </div>
            </Col>
            <Col span="6">
              <div class="title-tag-carma">
                <p>
                  <span>{{todayData.todayCount?formatCount(todayData.todayCount.onlineCount,3):0}}/{{todayData.todayCount?formatCount((todayData.todayCount.offlineCount + todayData.todayCount.onlineCount),3):0}}</span>
                  <br>
                  <span>结构化相机在线情况</span>
                </p>
                <div class="more"  @click="$router.replace('/setting/structure')">
                  <p>查看更多</p>
                  <p>>>></p>
                </div>
              </div>
            </Col>
          </div>
        </Row>
      </div>
      <div class="content">
        <div class="echartsBox">
          <BSechart :options="personFlow"  ></BSechart>
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
import {mapActions, mapMutations} from 'vuex'
import { getSocket } from '../../../socket/socket.js'
export default {
  name: 'todayData',
  components: {
    BSechart
  },
  data() {
    return {
      newDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      timer: null,
      personFlow: {
        color: ['#3398DB'],
        title: {
          text: '行人流量',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }/*,
          subtext: this.$moment().format('YYYY年MM月DD日'),
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
              let valueText = ''
              if (valueX.length > 5) {
                valueText = valueX.slice(0, 5) + '...'
              } else {
                valueText = valueX
              }
              return valueText
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
          }
          /* name: '人口（百万）',
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
          }
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
              let valueText = ''
              if (valueX.length > 5) {
                valueText = valueX.slice(0, 5) + '...'
              } else {
                valueText = valueX
              }
              return valueText
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
          }
          /* name: '机动车（百万）',
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
          }/*,
          subtext: this.$moment().format('YYYY年MM月DD日'),
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
              let valueText = ''
              if (valueX.length > 5) {
                valueText = valueX.slice(0, 5) + '...'
              } else {
                valueText = valueX
              }
              return valueText
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
          }
          /* name: '非机动车（百万）',
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
          subtext: this.$moment().format('YYYY年MM月DD日'),
          subtextStyle: {
            color: '#ffffff'
          } */
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const moment = this.$moment
            let dateToday = moment().format('YYYY-MM-DD') // 日期
            let currentTime = params[0].name + ':00'// 时间
            let currentVal = params[0].value // 值
            return '日期：' + dateToday + '<br/>' + '时间：' + currentTime + '<br/>' + '布控报警数量：' + currentVal
          }
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
          }
          /* name: '人口（百万）',
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
      todayData: {}, // 今日数据
      echartHeight: '100%'
    }
  },
  created() {
    this.timer = setInterval(this.updateTime, 1000)
    /* if (this.checkBrowser() === 'chrome') {
      this.echartHeight = '275px'
    } else if (this.checkBrowser() === '360') {
      this.echartHeight = '100%'
    } */
    this.getIntResData()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    ...mapActions('videoStructuredDataRecord', ['getDataRecord', 'getDataToday']),
    ...mapMutations({alarmSearch: 'SET_DEFAULT_STRUCT_ALARM_SEARCH'}),
    updateTime() {
      this.newDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    },
    formatCount(s, n) {
      n = n > 0 && n <= 20 ? n : 2
      // eslint-disable-next-line no-useless-escape
      s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
      let l = s.split('.')[0].split('').reverse()
      let r = s.split('.')[1]
      let t = ''
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
      }
      return t.split('').reverse().join('')
      // + '.' + r
    },
    getResData(data) {
      const moment = this.$moment
      this.todayData = JSON.parse(JSON.stringify(data))
      let personArrX = []
      let personArrSeries = []
      let motorVehicleFlowArrX = []
      let motorVehicleFlowSeries = []
      let unMotorVehicleFlowArrX = []
      let unMotorVehicleFlowSeries = []
      let timeAlarmArrX = [] // 初始化布控报警X轴坐标
      let timeAlarmSeries = []
      for (let item1 of this.todayData.pedTop10) { // 行人流量
        personArrX.push(item1.channelName)
        personArrSeries.push(item1.count)
      }
      for (let item2 of this.todayData.vehTop10) { // 机动车流量
        motorVehicleFlowArrX.push(item2.channelName)
        motorVehicleFlowSeries.push(item2.count)
      }
      for (let item3 of this.todayData.nonVehTop10) { // 非机动车流量
        unMotorVehicleFlowArrX.push(item3.channelName)
        unMotorVehicleFlowSeries.push(item3.count)
      }
      // 初始化时间段数据
      for (let i = 0; i < 24; i++) {
        let obj = {
          time: i + '',
          count: 0
        }
        timeAlarmArrX.push(obj)
      }
      // 根据返回时间数据匹配对应时间段数据
      timeAlarmArrX.forEach((item1, index1) => {
        this.todayData.defenseAlarms.forEach((item) => {
          let localTime = moment(item.time).format('H')
          if (item1.time === localTime) {
            item1.count = item.count
          }
        })
      })
      // 时间段从1-24
      let timeShift = timeAlarmArrX.shift()
      timeShift.time = '24'
      timeAlarmArrX.push(timeShift)
      timeAlarmArrX.forEach((item, index) => {
        timeAlarmArrX.splice(index, 1, item.time)
        timeAlarmSeries.push(item.count)
      })
      this.personFlow.xAxis.data = personArrX
      this.personFlow.series[0].data = personArrSeries
      this.motorVehicleFlow.xAxis.data = motorVehicleFlowArrX
      this.motorVehicleFlow.series[0].data = motorVehicleFlowSeries
      this.unMotorVehicleFlow.xAxis.data = unMotorVehicleFlowArrX
      this.unMotorVehicleFlow.series[0].data = unMotorVehicleFlowSeries
      this.timeAlarm.xAxis.data = timeAlarmArrX
      this.timeAlarm.series.data = timeAlarmSeries
    },
    // 行人流量
    getPedestrianSocket(data) {
      let personArrX = []
      let personArrSeries = []
      let pedestrianData = JSON.parse(JSON.stringify(data))
      for (let item1 of pedestrianData) { // 行人流量
        personArrX.push(item1.channelName)
        personArrSeries.push(item1.count)
      }
      this.personFlow.xAxis.data = personArrX
      this.personFlow.series[0].data = personArrSeries
    },
    // 机动车流量
    geVehicleSocket(data) {
      let motorVehicleFlowArrX = []
      let motorVehicleFlowSeries = []
      let vehicleData = JSON.parse(JSON.stringify(data))
      for (let item2 of vehicleData) { // 机动车流量
        motorVehicleFlowArrX.push(item2.channelName)
        motorVehicleFlowSeries.push(item2.count)
      }
      this.motorVehicleFlow.xAxis.data = motorVehicleFlowArrX
      this.motorVehicleFlow.series[0].data = motorVehicleFlowSeries
    },

    // 非机动车流量
    getNoVehicleSocket(data) {
      let unMotorVehicleFlowArrX = []
      let unMotorVehicleFlowSeries = []
      let novehicleData = JSON.parse(JSON.stringify(data))
      for (let item3 of novehicleData) { // 非机动车流量
        unMotorVehicleFlowArrX.push(item3.channelName)
        unMotorVehicleFlowSeries.push(item3.count)
      }
      this.unMotorVehicleFlow.xAxis.data = unMotorVehicleFlowArrX
      this.unMotorVehicleFlow.series[0].data = unMotorVehicleFlowSeries
    },
    // 时段布控报警数量
    getDefenseAlarmSocket(data) {
      const moment = this.$moment
      let timeAlarmArrX = [] // 初始化布控报警X轴坐标
      let timeAlarmSeries = []
      let timeAlarmData = JSON.parse(JSON.stringify(data))
      // 初始化时间段数据
      for (let i = 0; i < 24; i++) {
        let obj = {
          time: i + '',
          count: 0
        }
        timeAlarmArrX.push(obj)
      }
      // 根据返回时间数据匹配对应时间段数据
      timeAlarmArrX.forEach((item1, index1) => {
        timeAlarmData.forEach((item) => {
          let localTime = moment(item.time).format('H')
          if (item1.time === localTime) {
            item1.count = item.count
          }
        })
      })
      // 时间段从1-24
      let timeShift = timeAlarmArrX.shift()
      timeShift.time = '24'
      timeAlarmArrX.push(timeShift)
      timeAlarmArrX.forEach((item, index) => {
        timeAlarmArrX.splice(index, 1, item.time)
        timeAlarmSeries.push(item.count)
      })
      this.timeAlarm.xAxis.data = timeAlarmArrX
      this.timeAlarm.series.data = timeAlarmSeries
    },
    getIntResData() {
      this.getDataToday().then((res) => {
        this.getResData(res.data)
        /* setTimeout(()=>{

        },) */
        getSocket().on('structureStatistic:today.count', data => {
          this.todayData.todayCount = {...data}
        })
        // 行人流量
        getSocket().on('pedestrianFlowTop10:today.count', data => {
          // console.log('行人流量',data)
          this.getPedestrianSocket(data)
        })
        // 机动车流量
        getSocket().on('vehicleFlowTop10:today.count', data => {
          // console.log('机动车流量',data)
          this.geVehicleSocket(data)
        })
        // 非机动车流量
        getSocket().on('noVehicleFlowTop10:today.count', data => {
          // console.log('非机动车流量',JSON.stringify(data))
          this.getNoVehicleSocket(data)
        })
        // 时段布控报警数量
        getSocket().on('defenseAlarmTimeSlot:today.count', data => {
          // console.log('时段布控报警数量',data)
          this.getDefenseAlarmSocket(data)
        })
      }, (err) => {
        console.log(err)
      })
    },
    toRouter() {
      this.alarmSearch(true)
      this.$router.replace('/structure/alarmSearch')
    },
    checkBrowser() {
      let ua = navigator.userAgent.toLocaleLowerCase()
      let browserType = null
      if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
        browserType = 'IE'
        //  let browserVersion = ua.match(/msie ([\d.]+)/) != null ? ua.match(/msie ([\d.]+)/)[1] : ua.match(/rv:([\d.]+)/)[1]
      } else if (ua.match(/firefox/) != null) {
        browserType = 'fireFox'
      } else if (ua.match(/ubrowser/) != null) {
        browserType = 'UC'
      } else if (ua.match(/opera/) != null) {
        browserType = 'opera'
      } else if (ua.match(/bidubrowser/) != null) {
        browserType = 'baidu'
      } else if (ua.match(/metasr/) != null) {
        browserType = 'sougou'
      } else if (ua.match(/tencenttraveler/) != null || ua.match(/qqbrowse/) != null) {
        browserType = 'QQ'
      } else if (ua.match(/maxthon/) != null) {
        browserType = 'aoyou'
      } else if (ua.match(/chrome/) != null) {
        let is360 = this._mime('type', 'application/vnd.chromium.remoting-viewer')
        if (is360) {
          browserType = '360'
        } else {
          browserType = 'chrome'
        }
      } else if (ua.match(/safari/) != null) {
        browserType = 'Safari'
      }
      return browserType
    },
    _mime(option, value) {
      let mimeTypes = navigator.mimeTypes
      for (let mt in mimeTypes) {
        if (mimeTypes[mt][option] === value) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style scoped>
  .todayData{
    display: flex;
    overflow: hidden;
    flex-flow: column;
    width: 100%;
  }
  .title{
    flex: 0 1 auto;
    width: 100%;
    padding-bottom: 16px;
  }
.title-text{
  border-bottom: 1px solid #1c3054;
  height: 38px;
  line-height: 38px;
  background: #0f2243;
}
  .title-tag-targetTotal,.title-tag-alarm,.title-tag-task,.title-tag-carma{
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    height: 118px;
    width: 90%;
    margin: 0 auto;
  }
  .title-tag-targetTotal{
    background-image: url("../../../../static/image/videoStructuredDataRecord/targetTotal.png");
  }
  .title-tag-alarm{
    background-image: url("../../../../static/image/videoStructuredDataRecord/alarm.png");
  }
  .title-tag-task{
    background-image: url("../../../../static/image/videoStructuredDataRecord/task.png");
  }
  .title-tag-carma{
    background-image: url("../../../../static/image/videoStructuredDataRecord/carma.png");
  }
  .title-tag-targetTotal>p,.title-tag-alarm>p,.title-tag-task>p,.title-tag-carma>p{
    text-align: right;
    padding-right: 15px;
    padding-top: 11px;
  }
  .title-tag-targetTotal>p>span:first-child,.title-tag-alarm>p>span:first-child,.title-tag-task>p>span:first-child,.title-tag-carma>p>span:first-child{
    font-weight: bold;
    font-size: 24px;
  }
  .title-tag-targetTotal>p>span:last-child,.title-tag-alarm>p>span:last-child,.title-tag-task>p>span:last-child,.title-tag-carma>p>span:last-child{
    font-weight: bold;
    font-size: 20px;
  }
  .title-tag-targetTotal>div, .title-tag-alarm>div, .title-tag-task>div, .title-tag-carma>div{
    width: 100%;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    font-family: "Microsoft YaHei";
    background: rgba(255,255,255,.3);
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 5px;
  }
  .title-tag-targetTotal>div>p:first-child,.title-tag-alarm>div>p:first-child,.title-tag-task>div>p:first-child,.title-tag-carma>div>p:first-child{
    float: left;
  }
  .title-tag-targetTotal>div>p:last-child, .title-tag-alarm>div>p:last-child, .title-tag-task>div>p:last-child, .title-tag-carma>div>p:last-child{
    float: right;
  }

  .more{
    cursor: pointer;
  }
  .title-type{
    float: left;
    width: 100%;
    height: 158px;
    background: #1b3153;
   padding: 20px 0;
  }
  .content{
    background: #1b3153;
    flex: 1 1 auto;
    display: flex;
    flex-wrap: wrap;
  }
  .echartsBox{
    flex: 1 1 auto;
    width: 50%;
    height: 282.5px;
  }
</style>
