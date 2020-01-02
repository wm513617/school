<template>
  <div class="bs-main vehicle main-page-bg">
    <div class='stat-header'>
      <div>
        <span>警情统计</span>
      </div>
      <div>
        <span>路口</span>
        <Select :value="cross" multiple clearable style="width:150px" @on-change="changeCross">
          <Option v-for="item in crossList" :disabled="crossDisabled" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="police-type">
        <span>警情类型</span>
        <Select v-model="defenseType" :clearable="false" style="width:150px">
          <Option v-for="item in warnTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
      <div class="handle-button">
        <Button type="ghost" @click="submitStat"><i class="ivu-icon iconfont icon-statistical-analysis" style="font-size:14px;"></i>&nbsp;统计</Button>
        <Button type="ghost" @click="exportCsv"><i class="ivu-icon iconfont icon-export" style="font-size:14px;"></i>&nbsp;导出</Button>
      </div>
    </div>
    <div class='flow-box'>
      <div class='flow-echart'>
        <div v-if="!hasData" style="text-align:center;margin-top:100px;">
          暂无数据
        </div>
        <BSechart v-else :options='warningOption'>
        </BSechart>
      </div>
    </div>
    <div class='hot-box'>
      <div class="bs-table-box">
        <Table :height="tableHeight" size="small" :columns="columns1" :data="curPageData" :width="'100%'"></Table>
        <div class="table-footer">
          <div style="float: right;">
            <Page :show-total="true" :page-size="pageLimit" :show-elevator="true" :total="warningCount" :current="curPage" @on-change="changePage"></Page>
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
      crossDisabled: false,
      hasData: true,
      columns1: [
        {
          title: '日期',
          sortable: true,
          key: 'createTime',
          render: (h, param) => {
            let date = param.row.createTime
            let text = date ? moment.unix(Number(date)).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '路口',
          key: 'crossName'
        },
        {
          title: '警情类型',
          key: 'defenseType',
          width: 300
        }
      ],
      warningData: [],
      warningCount: 0,
      curPageData: [],
      pageLimit: 50,
      tableHeight: 308,
      curPage: 1,
      warnTypeList: [
        {
          value: 'all',
          label: '全部'
        }
      ],
      model8: 'all',
      defenseType: 'all',
      endTime: moment().format('YYYY-MM-DD'),
      startTime: moment()
        .subtract(7, 'd')
        .format('YYYY-MM-DD'),
      warningOption: null,
      compareType: '1',
      cross: [],
      crossList: [],
      param: {}
    }
  },
  created: function() {
    // 获取报警类型
    this.getDictType({ type: 'defenseType' })
      .then(data => {
        data.map(item => {
          this.warnTypeList.push({
            value: item.code,
            label: item.name
          })
        })
      })
      .then(err => console.log('logout error:' + err))
    // 获取所有路口
    this.getAllCrossList()
      .then(data => {
        data.map(item => {
          this.crossList.push({
            label: item.name,
            value: item._id
          })
        })
      })
      .catch(err => console.log('logout err' + err))
    this.param = {
      startTime: moment(this.startTime).format('X'),
      endTime: moment(this.endTime).format('X'),
      defenseType: this.defenseType,
      compareType: this.compareType
    }
    this.getWarningData(this.param)
    this.getDefenseList(this.param)
  },
  methods: {
    ...mapActions(['getStatWarningData', 'getAllCrossList', 'getStatDefenseList', 'getDictType']),
    getDefenseList(param) {
      this.getStatDefenseList(param)
        .then(data => {
          this.warningCount = Number(data.headers['x-bsc-count'])
          this.curPage = Number(data.headers['x-bsc-cur'])
          this.pageLimit = Number(data.headers['x-bsc-limit'])
          // this.warningData = data.data
          // this.curPageData = this.warningData.slice(0, 10)
          this.curPageData = data.data
        })
        .catch(err => console.log('logout error:' + err))
    },
    getWarningData(param) {
      this.getStatWarningData(param)
        .then(data => {
          if (!Object.keys(data).length) {
            this.hasData = false
          } else {
            this.hasData = true
            let dateList = []
            let totalData = []
            let crossList = []
            data[data.length - 1].datas.map(item => {
              crossList.push({
                name: item.name,
                data: [],
                type: 'bar',
                stack: 'one',
                barMaxWidth: 100,
                label: {
                  normal: {
                    show: true,
                    formatter: '{c}'
                  }
                }
              })
            })
            data.map(item => {
              totalData.push(item.countAll)
              dateList.push(moment.unix(Number(item.date)).format('YYYY-MM-DD'))
              crossList.map(cross => {
                let has = false
                item.datas.map(unit => {
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
            crossList.push({
              name: '警情总数',
              type: 'line',
              data: totalData
            })
            this.warningOption = {
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
              grid: {
                x: 50,
                x2: 60,
                y: 50,
                y2: '13%'
              },
              legend: {
                data: crossList,
                textStyle: {
                  color: '#ffffff'
                },
                inactiveColor: '#5d5d5d'
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
            <th>路口</th>
            <th>数量</th>
            <th>总数</th>
            </tr>
            <tr style="text-align:center">
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
              series: crossList
            }
          }
        })
        .catch(err => console.log('logout err' + err))
    },
    changeStartTime(date) {
      this.startTime = date
    },
    changeEndTime(date) {
      this.endTime = date
    },
    itemShow(val) {},
    changeCross(value) {
      value.length > 4 ? (this.crossDisabled = true) : (this.crossDisabled = false)
      this.cross = value
    },
    changePage(n) {
      this.param.page = n
      this.getStatDefenseList(this.param)
        .then(data => {
          this.warningCount = Number(data.headers['x-bsc-count'])
          this.curPage = Number(data.headers['x-bsc-cur'])
          this.curPageData = data.data
        })
        .catch(err => console.log('changePage error:' + err))
      // this.curPageData = this.warningData.slice(10 * (n - 1), n * 10)
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
            defenseType: this.defenseType,
            cross: this.cross
          }
          this.getWarningData(param)
        }
      }
    },
    exportCsv() {
      if (this.warningCount > 0) {
        this.param.page = 1
        this.param.limit = this.warningCount
        this.getStatDefenseList(this.param)
          .then(data => {
            this.downData = data.data
            // 导出
            this.$bsValidate.exportCsv(
              {
                title: ['日期', '路口', '警情类型'],
                titleForKey: ['date', 'crossName', 'defenseType'],
                data: this.downData
              },
              '路口警情分析表'
            )
          })
          .catch(err => console.log('exportCsv error:' + err))
      } else {
        // this.$Notice.warning({
        //   title: '提示',
        //   desc: '暂无数据'
        // })
      }
    }
  }
}
</script>

<style lang='less' scoped>
.bs-main {
  flex-direction: column;
  // position: relative;
}

.stat-header {
  display: flex;
  // flex: 0 0 32px;
  align-items: center;
  padding: 16px 24px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding: 0 5px;
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
  position: relative;
  height: 348px;
  // .table-footer {
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   bottom: 0;
  // }
}
.handle-button {
  margin-left: 10px;
}
.handle-button button {
  margin-right: 8px;
}
.police-type {
  margin: 0 12px;
}
</style>
