<template>
    <div class="duty-time">
        <div class="time-header">
            <div class="row">
                <label for="">选择值班人员：</label>
                <Select v-model="watchkeeper" style="width:200px">
                    <Option v-for="item in watchkeeperList" :value="item._id" :key="item._id">{{ item.realname }}</Option>
                </Select>
            </div>
            <div class="row">
                <label for="">选择值班时间：</label>
                <DatePicker type="date" v-model="statrTime" placeholder="请选择时间" style="width: 200px"></DatePicker>
                <span>-</span>
                <DatePicker type="date" v-model="endTime" placeholder="请选择时间" style="width: 200px"></DatePicker>
            </div>
            <div class="row">
                <Button icon="search" style="margin-right: 8px" @click='search'>查询</Button>
                <Button class="ivu-btn" @click='derive'>导出</Button>
            </div>
        </div>
        <h2 class="time-title">
            该时间段值班总时长为：{{hour}}小时{{minute}}分
        </h2>
        <div class="time-content">
            <div class="myChartDom" ref='myChartDom'></div>
            <div class="table">
                <div class="table-box">
                    <div class="table-row">
                        <Table :columns="columns1" :data="data1" ref='table'></Table>
                    </div>
                    <div class="table-row">
                        <Table :columns="columns2" :data="data2"></Table>
                    </div>
                    <div class="table-row">
                        <Table :columns="columns3" :data="data3"></Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import personnelApi from 'src/modal/api/business/duty/personnel.js'
export default {
  data() {
    return {
      watchkeeper: '',
      statrTime: new Date(),
      endTime: new Date(),
      hour: 0,
      minute: 0,
      watchkeeperList: [],
      option: {
        color: ['#00FF00'],
        xAxis: {
          name: '值班日期',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        tooltip: {},
        legend: {},
        yAxis: {
          name: '值班时长（h）',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [{
          name: '值班时长',
          type: 'bar',
          barWidth: '20%',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          },
          data: []
        }]
      },
      columns1: [
        {
          title: '日期',
          key: 'date',
          width: 110
        },
        {
          title: '值班时长（h)',
          key: 'duration',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.duration
                }
              },
              params.row.duration
            )
          }
        },
        {
          title: '值班时间',
          key: 'time',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.time
                }
              },
              params.row.time
            )
          }
        }
      ],
      data1: [],
      columns2: [
        {
          title: '日期',
          key: 'date',
          width: 110
        },
        {
          title: '值班时长（h)',
          key: 'duration',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.duration
                }
              },
              params.row.duration
            )
          }
        },
        {
          title: '值班时间',
          key: 'time',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.time
                }
              },
              params.row.time
            )
          }
        }
      ],
      data2: [],
      columns3: [
        {
          title: '日期',
          key: 'date',
          width: 110
        },
        {
          title: '值班时长（h)',
          key: 'duration',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.duration
                }
              },
              params.row.duration
            )
          }
        },
        {
          title: '值班时间',
          key: 'time',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                },
                domProps: {
                  title: params.row.time
                }
              },
              params.row.time
            )
          }
        }
      ],
      data3: [],
      data7: [],
      columns7: [
        {
          title: '日期',
          key: 'date'
        },
        {
          title: '值班时长（h)',
          key: 'duration'
        },
        {
          title: '值班时间',
          key: 'time'
        }
      ],
      myChartDom: ''
    }
  },
  created() {
    let params = {
      limit: 99999,
      page: 1
    }
    personnelApi.listAll(params).then(res => {
      this.watchkeeperList = res.data
      this.watchkeeper = this.watchkeeperList[0]._id
    })
  },
  mounted() {
    this.myChartDom = this.$echarts.init(this.$refs.myChartDom)
    this.search()
    // this.myChartDom.setOption(this.option)
  },
  methods: {
    search() {
      this.data1 = []
      this.data2 = []
      this.data3 = []
      let query = {
        starttime: this.$moment(this.statrTime).valueOf(),
        endtime: this.$moment(this.endTime).valueOf()
      }
      personnelApi.personnel(this.watchkeeper, query).then(res => {
        console.log(res, '45545456555555')
        let arrNum = []
        let arrDate = []
        let totalTime = 0
        res.forEach((item, index) => {
          totalTime += item.timeSum
          arrNum.push((item.timeSum / 3600000).toFixed(2))
          arrDate.push(this.$moment(item.date).format('MM-DD'))
          let duration = ''
          let time = ''
          item.template.forEach((v, n) => {
            duration += Math.trunc(v.timeSum / 36000) / 100 + '、'
            time += v.startTime + '-' + v.endTime + '、'
          })
          duration = duration.slice(0, -1)
          time = time.slice(0, -1)
          this.data7.push({
            date: this.$moment(item.date).format('MM-DD'),
            duration: duration,
            time: time
          })
          if (index % 3 === 0) {
            this.data1.push({
              date: this.$moment(item.date).format('MM-DD'),
              duration: duration,
              time: time
            })
          } else if (index % 3 === 1) {
            this.data2.push({
              date: this.$moment(item.date).format('MM-DD'),
              duration: duration,
              time: time
            })
          } else if (index % 3 === 2) {
            this.data3.push({
              date: this.$moment(item.date).format('MM-DD'),
              duration: duration,
              time: time
            })
          }
        })
        this.hour = Math.trunc(totalTime / 3600000)
        this.minute = Math.trunc((totalTime / 3600000 - this.hour) * 60)
        this.option.series[0].data = arrNum
        this.option.xAxis.data = arrDate
        this.myChartDom.setOption(this.option, true)
      })
    },
    derive() {
      this.$refs.table.exportCsv({
        filename: 'Custom data',
        columns: this.columns7,
        data: this.data7
      })
    }
  }
}
</script>

<style lang='less' scoped>
.duty-time{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #1b3153;
    .time-header{
        padding: 12px 24px;
        width: 100%;
        .row{
            margin-right: 8px;
            display: inline-block;
        }
    }
    .time-title{
        width: 100%;
        padding: 12px 24px;
        background: #244575;
        font-size: 14px;
    }
    .time-content{
        width: 100%;
        flex: 1;
        .myChartDom{
            width: 100%;
            height: 60%;
            color: #fff;
        }
        .table{
            width: 100%;
            height: 40%;
            overflow-y: auto;
            position: relative;
            .table-box{
                width: 100%;
                position: absolute;
                .table-row{
                    width: 33%;
                    float: left;
                }
            }
        }
    }
}
</style>
