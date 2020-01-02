<template>
  <div class="bs-main vehicle main-page-bg">
    <div class='stat-header'>
      <div>
        <span>路口统计</span>
      </div>
      <div class="dev-scope">
        <span>路口</span>
        <Select :value="cross" multiple clearable style="width:300px" @on-change="changeCross">
          <Option v-for="item in crossList" :disabled="crossDisabled" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div>
        <span>统计日期</span>
        <Date-picker :value="startTime" type="date" @on-change="changeStartTime" :options="dateLimit" :clearable="false" :editable="false" placeholder='开始日期'></Date-picker>
        <Select v-model="compareType" style="width: 80px; margin :0 20px; text-align:center">
          <Option value="1">至</Option>
          <Option value="0">对比</Option>
        </Select>
        <Date-picker :value="endTime" @on-change="changeEndTime" :options="dateLimit" :clearable="false" :editable="false" type='date' placeholder='结束日期'></Date-picker>
      </div>
      <div class="handle-button ">
        <Button type="ghost" @click="submitStat"><i class="ivu-icon iconfont icon-statistical-analysis" style="font-size:14px;"></i>&nbsp;统计</Button>
        <Button type="ghost" @click="exportCsv"><i class="ivu-icon iconfont icon-export" style="font-size:14px;"></i>&nbsp;导出</Button>
      </div>
    </div>
    <div class='flow-box'>
      <div class='flow-echart'>
        <BSechart :options='crossOption'></BSechart>
      </div>
    </div>
    <div class='hot-box'>
      <div class="bs-table-box">
        <Table :height="tableHeight" size="small" :columns="columns1" :data="curPageData" width="'100%'"></Table>
        <div class="table-footer">
          <div style="float: right;">
            <Page :show-total="true" :show-elevator="true" :total="crossData.length" :current="curPage" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
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
      compareType: '1',
      crossDisabled: false,
      columns1: [
        {
          title: '日期',
          sortable: true,
          key: 'date',
          render: (h, param) => {
            let date = param.row.date
            let text = date ? moment.unix(Number(date)).format('YYYY-MM-DD') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '路口',
          key: 'crossName'
        },
        {
          title: '车流量',
          key: 'countAll',
          sortable: true
        },
        {
          title: '小汽车',
          key: 'car',
          sortable: true
        },
        {
          title: '巴士',
          key: 'bus',
          sortable: true
        },
        {
          title: '面包车',
          key: 'minibus',
          sortable: true
        },
        {
          title: '卡车',
          key: 'truck'
        },
        {
          title: '三轮车',
          key: 'trike',
          width: 100
        }
      ],
      crossData: [],
      curPageData: [],
      tableHeight: 308,
      endTime: moment().format('YYYY-MM-DD'),
      startTime: moment()
        .subtract(7, 'd')
        .format('YYYY-MM-DD'),
      crossList: [],
      curPage: 1,
      limit: 10,
      count: 0,
      cross: [],
      crossOption: null,
      carTypeOption: {}
    }
  },
  created: function() {
    let param = {
      startTime: moment(this.startTime).format('X'),
      endTime: moment(this.endTime).format('X')
    }
    this.getAllCrossList().then(data => {
      data.map(item => {
        this.crossList.push({
          label: item.name,
          value: item._id
        })
      })
    })
    this.getCrossData(param)
    this.getCrossDataAll(param)
    this.today = moment(new Date()).format('YYYY-MM-DD')
  },
  methods: {
    ...mapActions(['getAllCrossList', 'getStatCrossData', 'getStatCrossVt']),
    getCarInfo(val) {},
    getCarData(val) {},
    getCrossData(param) {
      this.getStatCrossData(param)
        .then(data => {
          let crossList = []
          let dateList = []
          data[data.length - 1].countData.map(unit => {
            crossList.push({
              name: unit.name,
              data: [],
              type: 'bar',
              barMaxWidth: '100'
            })
          })
          data.map(item => {
            dateList.push(moment.unix(Number(item.date)).format('YYYY-MM-DD'))
            crossList.map(cross => {
              let has = false
              item.countData.map(unit => {
                if (unit.name === cross.name) {
                  cross.data.push(unit.count)
                  has = true
                }
              })
              if (!has) {
                cross.data.push(0)
              }
            })
          })
          this.crossOption = {
            textStyle: {
              color: '#fff'
            },
            // title: {
            //   text: '路口流量',
            //   textStyle: {
            //     color: '#ffffff'
            //   }
            // },
            legend: {
              y: 'top',
              data: crossList,
              textStyle: {
                color: '#fff',
                fontSize: 14
              },
              inactiveColor: '#515151'
            },
            grid: {
              x: 50,
              x2: 60,
              y: 50,
              y2: '15%'
            },
            tooltip: {
              padding: 10,
              backgroundColor: '#222',
              borderColor: '#777',
              borderWidth: 1,
              formatter: function(obj) {
                let value = obj.value
                return (
                  '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">' +
                  obj.name +
                  '--' +
                  obj.seriesName +
                  '</div> 车流量：' +
                  value +
                  '辆<br>'
                )
              }
            },
            xAxis: {
              type: 'category',
              name: '时间',
              nameGap: 16,
              // nameTextStyle: {
              //   color: '#fff',
              //   fontSize: 14
              // },
              data: dateList,
              splitLine: {
                show: false
              },
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
            yAxis: [
              {
                type: 'value',
                name: '数量(辆)',
                axisLabel: {
                  formatter: '{value}'
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
            series: crossList
          }
        })
        .catch(err => console.log('logout error' + err))
    },
    getCrossDataAll(param) {
      this.getStatCrossVt(param)
        .then(data => {
          this.crossData = data
          this.curPageData = this.crossData.slice(0, 30)
        })
        .catch(err => console.log('logout error' + err))
    },
    changePage(n) {
      this.curPageData = this.crossData.slice(30 * (n - 1), n * 30)
    },
    changeStartTime(date) {
      this.startTime = date
    },
    changeEndTime(date) {
      this.endTime = date
    },
    changeCross(value) {
      value.length > 4 ? (this.crossDisabled = true) : (this.crossDisabled = false)
      this.cross = value
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
            compareType: this.compareType,
            cross: this.cross
          }
          this.getCrossData(param)
          this.getCrossDataAll(param)
        }
      }
    },
    exportCsv() {
      this.$bsValidate.exportCsv(
        {
          title: ['日期', '路口', '车流量', '小汽车', '巴士', '面包车', '卡车', '三轮车'],
          titleForKey: ['date', 'crossName', 'countAll', 'car', 'bus', 'minibus', 'truck', 'trike'],
          data: this.crossData
        },
        '路口车流量分析表'
      )
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
  // flex: 0 0 64px;
  padding: 16px 24px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
    padding-right: 16px;
    span {
      padding-right: 16px;
      font-size: 14px;
    }
  }
}

.flow-box {
  flex: 1;
  display: flex;
  overflow: hidden;
  .flow-echart {
    flex: 1;
  }
}

.hot-box {
  // flex: 0 0 480px;
  position: relative;
  height: 348px;
}

.handle-button button {
  margin-left: 8px;
}
.dev-scope {
  padding-right: 16px;
}
</style>
