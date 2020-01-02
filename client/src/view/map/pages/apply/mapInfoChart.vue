<!--应用模式 右边的概况介绍页面中  地图概要的统计图 -->
<template>
  <div class="chartBox">
    <BSechart style="height:100%;width:100%" :options="chartOption"></BSechart>
  </div>
</template>

<script>
import BSechart from '../../../../components/BSechart'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {}
  },
  created() {},
  computed: {
    ...mapState({
      chartOption({ mapAreaData }) {
        let echartData = JSON.parse(JSON.stringify(mapAreaData.allZone))
        let seriesGridShow = true
        let seriesBuildShow = true
        let seriesOnlineIpcShow = true
        let seriesOfflineIpcShow = true
        let seriesOnlineFireShow = true
        let seriesOfflineFireShow = true
        if (echartData.grid + '' === '0') {
          seriesGridShow = false
        }
        if (echartData.building + '' === '0') {
          seriesBuildShow = false
        }
        if (echartData.ipc.ipcOnline + '' === '0') {
          seriesOnlineIpcShow = false
        }
        if (echartData.ipc.ipcOffline + '' === '0') {
          seriesOfflineIpcShow = false
        }
        if (echartData.fireAlarm.fireOnline + '' === '0') {
          seriesOnlineFireShow = false
        }
        if (echartData.fireAlarm.fireOffline + '' === '0') {
          seriesOfflineFireShow = false
        }
        return {
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
            minInterval: 1,
            splitLine: {
              // 分隔线
              show: true, // 默认显示，属性show控制显示与否
              // onGap: null,
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#3a5a8b66'],
                width: 1,
                type: 'solid'
              }
            }
          },
          series: [
            {
              name: '在线设备',
              type: 'bar',
              stack: 'ipc',
              label: {
                normal: {
                  show: seriesOnlineIpcShow,
                  formatter: '{a}'
                }
              },
              data: [echartData.ipc.ipcOnline]
            },
            {
              name: '离线设备',
              type: 'bar',
              stack: 'ipc',
              label: {
                normal: {
                  show: seriesOfflineIpcShow,
                  formatter: '{a}'
                }
              },
              data: [echartData.ipc.ipcOffline]
            },
            {
              name: '在线消防设备',
              type: 'bar',
              stack: 'alarmIpc',
              label: {
                normal: {
                  show: seriesOnlineFireShow,
                  formatter: '{a}'
                }
              },
              data: [echartData.fireAlarm.fireOnline]
            },
            {
              name: '离线消防设备',
              type: 'bar',
              stack: 'alarmIpc',
              label: {
                normal: {
                  show: seriesOfflineFireShow,
                  formatter: '{a}'
                }
              },
              data: [echartData.fireAlarm.fireOffline]
            },
            {
              name: '楼宇',
              type: 'bar',
              label: {
                normal: {
                  show: seriesBuildShow,
                  formatter: '{a}'
                }
              },
              data: [echartData.building]
            },
            {
              name: '网格',
              type: 'bar',
              label: {
                normal: {
                  show: seriesGridShow,
                  formatter: '{a}'
                }
              },
              data: [echartData.grid]
            }
          ]
        }
      },
      activeMap: ({ mapGisData }) => mapGisData.activeMap
    })
  },
  methods: {
    ...mapActions(['getAllZone'])
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
