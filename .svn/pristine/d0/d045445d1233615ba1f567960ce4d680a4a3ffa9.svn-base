<template>
  <div style="width: 100%; height: 100%;">
    <div class="mains-right">
        <div class="total-box">查询统计</div>
        <div style="padding-left: 24px;height:30px;font-size:14px;line-height:30px;">查询次数{{checkedTotal}}次</div>
        <div style="padding-left: 24px;margin: 12px 0;">
          <div style="position:relative;margin-right:12px;display:inline-block;">
            <p class="text-box">{{organization}}</p>
            <Select v-model="organization" style="width:200px;" :placeholder="orgTips">
              <v-tree ref='tree' :treeData="treeData" :options="options" @node-click="handleNode" :activeId="agencyId" />
            </Select>
          </div>
          <div style="position:relative;margin-right:12px;display:inline-block;">
            <p class="text-box">{{soldier}}</p>
            <Select v-model="soldier" style="width:200px;" :placeholder="soldierTips">
              <v-tree ref='tree' :treeData="panelList" :options="options" @node-click="handleNodeSoldier" :activeId="soldierId"/>
            </Select>
          </div>
          <Select v-model="startTime" placeholder="开始时间" style="width:100px" clearable @on-clear="clearTime">
            <Option v-for="item in startTimeList" :disabled="endTime ? item.value > endTime : false" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select> -
          <Select v-model="endTime" placeholder="结束时间" :disabled="hasStartTime" style="width:100px" clearable @on-clear="clearTime">
            <Option v-for="item in endTimeList" :disabled="item.value < startTime" :key="item.value" :value="item.value">{{item.label}}</Option>
          </Select>
          <Button type="ghost" icon="search" style="margin-left:8px;" @click="getCheckCount">统计</Button>
        </div>
        <div class="mains-right-box">
            <BSechart style="width: 100%; height: 100%;" :options="lineOption"></BSechart>
        </div>
      </div>
      <div class="mains-left">
        <div class="total-box">备案电动车{{total}}辆</div>
        <div class="chart-box">
          <p>占比统计</p>
          <div class="chart-info">
            <BSechart style="width: 100%; height: 100%;" :options="pieOption"></BSechart>
          </div>
        </div>
        <div class="chart-box">
          <p>今日备案</p>
          <div class="chart-info">
            <BSechart style="width: 100%; height: 100%;" :options="barOption"></BSechart>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import BSechart from 'components/BSechart'
import { mapActions } from 'vuex'
const color = ['#f6b35a', '#e36d6d', '#5e8de7', '#82cb71', '#3fb1e3']
const idList = [ '职工', '学生', '外聘', '家属', '其他' ]
export default {
  components: {
    BSechart
  },
  data() {
    return {
      organization: '',
      soldier: '',
      agencyId: '',
      soldierId: '',
      panelList: [],
      treeData: [],
      orgTips: '请选择机构',
      soldierTips: '请选择单兵人员',
      total: 0, // 备案总数
      vehicleData: [{name: '职工', value: 0}, {name: '学生', value: 0}, {name: '外聘', value: 0}, {name: '家属', value: 0}, {name: '其他', value: 0}],
      todayRecord: [],
      startTime: 0,
      endTime: Number(this.$moment(Date.now()).format('HH:mm:ss').split(':')[0]),
      checkedCount: {
        serise: []
      }, // 查询次数数据
      checkedTotal: 0,
      options: {
        showFolder: true
      },
      idTypes: {
        teacher: '职工',
        student: '学生',
        outTeacher: '外聘',
        family: '家属',
        other: '其他'
      }
    }
  },
  computed: {
    pieOption() {
      return {
        color: color,
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'bottom',
          data: idList,
          textStyle: {
            color: '#fff'
          }
        },
        series: [
          {
            name: '占比统计',
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              normal: {
                fontSize: 14
              }
            },
            data: this.vehicleData
          }
        ]
      }
    },
    barOption() {
      return {
        textStyle: {
          color: '#fff'
        },
        xAxis: {
          type: 'value',
          splitNumber: 6,
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
        yAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#5676a9'
            }
          },
          data: ['其他', '家属', '外聘', '学生', '职工']
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}'
        },
        series: [{
          type: 'bar',
          barWidth: '10%',
          data: this.todayRecord
        }]
      }
    },
    lineOption() {
      let chartData = []
      this.checkedCount.serise.forEach(item => {
        chartData.push({
          name: this.idTypes[item.name],
          type: 'line',
          smooth: true,
          data: item.data
        })
      })
      return {
        color: color,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['职工', '学生', '外聘', '家属', '其他'],
          textStyle: {
            color: '#fff'
          },
          left: 'center',
          top: 'bottom',
          bottom: 10
        },
        grid: {
          top: '100px',
          left: 0,
          right: '20px',
          bottom: '40px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.checkedCount.lable,
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
        series: chartData
      }
    },
    startTimeList() {
      let arr = []
      for (let i = 0; i < 24; i++) {
        arr.push({label: i < 10 ? ('0' + i + ':00:00') : ('' + i + ':00:00'), value: i})
      }
      return arr
    },
    endTimeList() {
      let arr = []
      for (let i = 0; i < 25; i++) {
        arr.push({label: i < 10 ? ('0' + i + ':00:00') : ('' + i + ':00:00'), value: i})
      }
      return arr
    },
    hasStartTime() {
      return !(this.startTime + '')
    }
  },
  created() {
    this.getOrgTree(9).then(res => {
      this.treeData = [res.data]
      this.handleNode(res.data)
    }).catch(err => {
      console.log(err, '机构树获取失败')
    })
    this.getSentryUserTree().then(res => {
      this.panelList = res
      this.handleNodeSoldier(res[0])
    })
    this.getNonVehicleRecond()
    this.getCheckCount()
  },
  methods: {
    ...mapActions(['getOrgTree', 'getSentryUserTree', 'getNonVehicleCount', 'getNonVehicleCheck']),
    handleNode(node) {
      this.organization = node.name
      if (node.isroot) {
        this.agencyId = ''
      } else {
        this.agencyId = node._id
      }
      this.orgTips = ''
    },
    handleNodeSoldier(node) {
      if (node.isroot) {
        this.soldierId = ''
        this.soldier = node.name
      } else if (node.affiliation) {
        this.soldierId = node._id
        this.soldier = node.name
      }
      this.soldierTips = ''
    },
    getNonVehicleRecond() {
      this.getNonVehicleCount().then(res => {
        console.log(res, '备案统计')
        let arr = []
        let todayArr = []
        this.total = res.data.total || 0
        for (let i = 0; i < 5; i++) {
          arr.push({value: res.data.groupTotal[i] || 0, name: idList[i]})
          todayArr.push({
            name: idList[4 - i],
            value: res.data.todayTotal[4 - i] || 0,
            itemStyle: {
              normal: {
                color: color[4 - i]
              }
            }
          })
        }
        this.vehicleData = arr
        this.todayRecord = todayArr
      }).catch(() => {
        this.warningMsg('获取非机动车备案统计数量失败')
      })
    },
    getCheckCount() {
      const param = {
        orgId: this.agencyId,
        deviceId: this.soldierId,
        start: this.startTime || 0,
        end: this.endTime || Number(this.$moment(Date.now()).format('HH:mm:ss').split(':')[0])
      }
      this.getNonVehicleCheck(param).then(res => {
        this.checkedCount = res.data.data
        this.checkedTotal = res.data.total
      }).catch(() => {
        this.warningMsg('获取扫码统计次数失败')
      })
    },
    clearTime() {
      this.startTime = ''
      this.endTime = ''
    }
  }
}
</script>

<style scoped lang='less'>
.mains-left {
  width: 40%;
  height: 100%;
  margin-left: -100%;
  float: left;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
}
.mains-right {
  width: 100%;
  height: 100%;
  padding-left: 40%;
  float: left;
  padding-right: 24px;
  display: flex;
  flex-direction: column;
  .mains-right-box {
    flex: 1;
    padding: 0 24px;
  }
}
.total-box {
  font-size: 20px;
  margin-bottom: 12px;
}
.chart-box {
  flex: 1;
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
.text-box {
  position: absolute;
  left: 0;
  font-size: 12px;
  top: 0;
  height: 32px;
  max-width: 176px;
  padding-left: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
  z-index: 999;
}
</style>
