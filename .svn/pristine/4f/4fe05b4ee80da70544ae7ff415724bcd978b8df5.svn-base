<!--应用模式 右边的概况介绍页面中  警情统计页面 -->
<template>
  <div class="chartBox">
    <BSechart style="height:100%;width:100%" :options="chartOption"></BSechart>
  </div>
</template>

<script>
import BSechart from '../../../../components/BSechart'
import ALARMTYPE from '../../../../assets/map/app/alarmType'
import { mapState } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      // 应用模式，警情统计的默认数据
      commonIsShow: true,
      fireIsShow: true,
      patrolIsShow: true,
      vehicleIsShow: true,
      singleIsShow: true,
      commonAlarm: 0,
      fireAlarm: 0,
      patrolAlarm: 0,
      vehicleAlarm: 0,
      singleAlarm: 0,
      chartOption: null
    }
  },
  computed: {
    ...mapState({
      appAlarmingList: ({ mapAlarmData }) => mapAlarmData.appAlarmingList,
      appPageRight: ({ mapPageState }) => mapPageState.appPageRight
    })
  },
  watch: {
    appAlarmingList(val) {
      this.initAlarmInfoStatis()
    },
    appPageRight(val) {
      if (val === 'mapInfo') {
        this.initAlarmInfoStatis()
      }
    }
  },
  methods: {
    // 根据报警类型获取数量
    getNumByAlarmType(type) {
      let alarmingList = JSON.parse(JSON.stringify(this.appAlarmingList))
      let num = 0
      alarmingList.forEach(element => {
        if (element.attributes.alarmType === type || (element.attributes.param && element.attributes.param.eventType === type)) {
          num = num + 1
        }
      })
      return num
    },
    // 初始化警情统计图
    initAlarmInfoStatis() {
      this.commonAlarm = this.getNumByAlarmType(ALARMTYPE.COMMON)
      this.fireAlarm = this.getNumByAlarmType(ALARMTYPE.FIRE)
      this.patrolAlarm = this.getNumByAlarmType(ALARMTYPE.PATROL)
      this.vehicleAlarm = this.getNumByAlarmType(ALARMTYPE.VEHICLE)
      this.singleAlarm = this.getNumByAlarmType(ALARMTYPE.SINGLE)
      if (this.commonAlarm + '' === '0') {
        this.commonIsShow = false
      }
      if (this.fireAlarm + '' === '0') {
        this.fireIsShow = false
      }
      if (this.patrolAlarm + '' === '0') {
        this.patrolIsShow = false
      }
      if (this.vehicleAlarm + '' === '0') {
        this.vehicleIsShow = false
      }
      if (this.singleAlarm + '' === '0') {
        this.singleIsShow = false
      }
      this.chartOption = {
        textStyle: {
          color: '#fff',
          fontSize: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '10px',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [''],
          nameTextStyle: {
            padding: [10, 0, 0, 0]
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: '普通报警',
            type: 'bar',
            label: {
              normal: {
                show: this.commonIsShow,
                formatter: '{a}'
              }
            },
            data: [this.commonAlarm]
          },
          {
            name: '消防报警',
            type: 'bar',
            label: {
              normal: {
                show: this.fireIsShow,
                formatter: '{a}'
              }
            },
            data: [this.fireAlarm]
          },
          {
            name: '巡更报警',
            type: 'bar',
            label: {
              normal: {
                show: this.patrolIsShow,
                formatter: '{a}'
              }
            },
            data: [this.patrolAlarm]
          }
          // {
          //   name: '车辆报警',
          //   type: 'bar',
          //   label: {
          //     normal: {
          //       show: this.vehicleIsShow,
          //       formatter: '{a}'
          //     }
          //   },
          //   data: [this.vehicleAlarm]
          // },
          // {
          //   name: '单兵报警',
          //   type: 'bar',
          //   label: {
          //     normal: {
          //       show: this.singleIsShow,
          //       formatter: '{a}'
          //     }
          //   },
          //   data: [this.singleAlarm]
          // }
        ]
      }
    }
  },
  mounted() {
    this.initAlarmInfoStatis()
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
