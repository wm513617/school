<template>
  <div class="home-staistics">
    <div class="header clearfix">
      <span>今日园区人员流动实时状态分布与统计</span>
      <div class="btn-refresh" @click="refresh">
        <Icon type="refresh"></Icon>
        <a style="font-size:14px; text-decoration:underline;margin-left:16px" @click="changeContent">{{activePeopleCount ? '返回' : '人数统计'}}</a>
      </div>
    </div>

    <Row class="content flex-1" style="padding:0 6px" v-if="!activePeopleCount">
      <Col span="14" style="height:100%">
      <div style="height:calc(100% - 60px)">
        <BSechart :options="chartOption"></BSechart>
      </div>
      <div style="height:50px;overflow:auto">
        <div class="section">
          <div class="title">入园总数
            <span class="fs-16">{{currentIn}}</span>人
          </div>
        </div>
        <div class="section">
          <div class="title">出园总数
            <span class="fs-16">{{currentOut}}</span>人
          </div>
        </div>
        <div class="section">
          <div class="title">布控总数
            <span class="dif fs-16">{{countEC}}</span>人</div>
        </div>
        <div class="section">
          <div class="title">发现布控数
            <span class="dif fs-16">{{currentEC}}</span>人</div>
        </div>
      </div>

      </Col>
      <Col span="10">
      <div class="table-title">
        <span class="title-split"></span>
        <span>当前客流密度较大区域</span>
        <span class="title-split"></span>
      </div>
      <div class="chart-table-mock">
        <div class="table-header">
          <span>时间段</span>
          <span>位置</span>
        </div>
        <div class="table-content">
          <p v-show="tableData.length === 0" class="tips">暂无数据</p>
          <bs-scroll v-show="tableData.length" ref="scroller">
            <ul @on-expand="$refs.scroller.update()">
              <li v-for="(item,index) of tableData" :key="index">
                <span>{{item.time}}</span>
                <span>
                  <p class="address" @click="showInfo($event, item.address, item.img)">{{item.address}}</p>
                </span>
              </li>
            </ul>
          </bs-scroll>
        </div>

      </div>
      <!-- <Table class="chart-table" stripe border :columns="tableColumns" :data="tableData"></Table> -->
      </Col>
    </Row>
    <div style="flex:1;display:flex; flex-direction: column;" v-if="activePeopleCount">
      <div style="flex:0 0 40px;">
        <label style="margin-left:10px">人数统计摄像机:</label>
        <Select v-model="chooseBinocularIpc" @on-change="changeIpc" style="width:200px">
          <Option v-for="item in binocularIpcList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="flex-1">
        <BSechart :options="peopleCountOption"></BSechart>
      </div>
    </div>
    <div v-if="popSwitch">
      <Modal v-model="popSwitch" :mask-closable="false" :title="addrName">
        <img style="width: 100%" :src="addrImg" />
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>
<script>
// import echarts from 'echarts'
import { mapState, mapActions } from 'vuex'
import BSechart from 'components/BSechart'
import 'components/Scroll'
export default {
  components: {
    BSechart
  },
  created() {
    this.init()
  },
  data() {
    return {
      activePeopleCount: false, // 击中了人数统计按钮
      // peopleCountOption: null, // 折线图option
      chartOption: null, // 饼图option
      chartData: {
        serise: [{ name: '', data: [''] }, { name: '', data: [''] }, { name: '', data: [''] }]
      },
      currentIn: 0,
      currentOut: 0,
      currentEC: 0,
      countEC: 0,
      max: 10000,
      popSwitch: false,
      addrName: '',
      addrImg: '',
      tableColumns: [
        {
          title: '时间段',
          key: 'time'
        },
        {
          title: '位置',
          key: 'address',
          render: (h, params) => {
            return h('span', {
              style: {
                textDecoration: 'underline',
                cursor: 'pointer',
                color: '#0092C9'
              },
              domProps: {
                innerHTML: params.row.address
              },
              on: {
                click: () => {
                  this.popSwitch = true
                  this.addrName = params.row.address
                  this.addrImg = params.row.img
                }
              }
            })
          }
        }
      ],
      tableData: [],
      // 选择的双目IPC摄像机
      chooseBinocularIpc: ''
    }
  },
  computed: {
    ...mapState({
      binocularIpcList: ({ homePage }) => homePage.binocularIpcList,
      peopleCountOption({ homePage }) {
        let data = homePage.binocularIpcData
        let chartData = {
          serise: [],
          legends: []
        }
        data.serise.map(item => {
          chartData.serise.push({
            name: item.name,
            type: 'line',
            data: item.data,
            smooth: true
          })
          chartData.legends.push(item.name)
        })

        return {
          color: [
            '#ef9559',
            '#0086d8',
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
          // color: ['#5b9bd5', '#ed7d31', '#a5a5a5', '#ffc000', '#4472c4', '#70ad47', '#577dce', '#83cb71', '#7c7cf8', '#91d1d3'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: chartData.legends,
            textStyle: {
              color: '#fff'
            },
            right: 10
          },
          grid: {
            top: '30px',
            left: '3%',
            right: '4%',
            bottom: '10px',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.label,
            axisLine: {
              lineStyle: {
                color: '#5676a9'
              }
            },
            axisLabel: {
              interval: 0,
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
          series: chartData.serise
        }
      }
    })
  },
  methods: {
    ...mapActions(['getHomeHumanOutline', 'getBinocularIpcList', 'getBinocularIpcData']),
    refresh() {
      if (this.activePeopleCount) {
        if (this.chooseBinocularIpc) {
          this.getBinocularIpcData(this.chooseBinocularIpc)
        }
      } else {
        this.init()
      }
    },
    init() {
      return new Promise((resolve, reject) => {
        this.getHomeHumanOutline()
          .then(res => {
            resolve(res)
            this.chartData.serise = this.$lodash.cloneDeep(res.data.category.serise)
            this.currentIn = res.data.outline.entry
            this.currentOut = res.data.outline.exit
            this.countEC = res.data.outline.attention
            this.currentEC = res.data.outline.find
            res.data.hotspot instanceof Array &&
              (this.tableData = res.data.hotspot.map(v => {
                return {
                  time: v.name,
                  address: v.point,
                  // img: v.image
                  img: '/static/car/dongmen.jpg'
                }
              }))
            this.drawChart()
            // this.tableData.length = 7
          })
          .catch(err => {
            reject(err)
            console.log('get /human/statistics/outline error:' + err)
          })
      })
    },
    showInfo(e, address, img) {
      this.popSwitch = true
      this.addrName = address
      this.addrImg = img
    },
    drawChart() {
      this.chartOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '人员类型',
            type: 'pie',
            radius: '68%',
            label: {
              normal: {
                position: 'outside',
                formatter: '{b}{c}人',
                textStyle: {
                  color: ''
                }
              }
            },
            data: [
              {
                value: this.chartData.serise[0].data[0],
                name: this.chartData.serise[0].name,
                itemStyle: { normal: { color: '#f6b35a' } }
              },
              {
                value: this.chartData.serise[1].data[0],
                name: this.chartData.serise[1].name,
                itemStyle: { normal: { color: '#d26a69' } }
              },
              {
                value: this.chartData.serise[2].data[0],
                name: this.chartData.serise[2].name,
                itemStyle: { normal: { color: '#4bb1f3' } }
              }
            ]
          }
        ]
      }
    },
    // Content 转换 饼图or折线
    changeContent() {
      this.activePeopleCount = !this.activePeopleCount
      if (this.activePeopleCount) {
        this.getBinocularIpcList('HFW7233X-E2').then(() => {
          if (this.binocularIpcList.length > 0) {
            this.chooseBinocularIpc = this.binocularIpcList[0].value
            this.getBinocularIpcData(this.chooseBinocularIpc)
          }
        })
      } else {
        this.init()
      }
    },
    // 选择双目IPC资源
    changeIpc(val) {
      this.getBinocularIpcData(val)
    }
  }
}
</script>

<style lang="less" scoped>
@home-table-border-color: #203864;
@home-table-bgcolor: #0f2243;
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.home-staistics {
  .content .section,
  #car-detail .section {
    padding: 0px;
  }
  .fs-16 {
    color: #fda54b;
  }
  flex: 1;
  background: #1b3153;
  display: flex;
  flex-direction: column;

  .header {
    height: 30px;
    line-height: 30px;
    padding: 0 24px;
    font-size: 14px;
    color: #fff;
    background: #0f2343;
    span {
      float: left;
    }
    .btn-refresh {
      float: right;
      cursor: pointer;
      font-size: 20px;
    }
  }
  .table-title {
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 14px;
    color: #fff;
    border-bottom: none;
    display: flex;
    justify-content: space-around;
    .title-split {
      flex: 1;
      height: 18px;
      margin: 0 3px;
      border-bottom: 1px solid #25406f;
      box-shadow: 0px -1px 0px #111d33 inset;
    }
  }
  .chart-table-mock {
    background: #254576;
    width: 100%;
    color: #ccc;
    border: 1px solid @home-table-border-color;
    .table-header {
      width: 100%;
      height: 26px;
      line-height: 26px;
      color: #fff;
      font-size: 12px;
      border-bottom: 1px solid @home-table-border-color;
      span {
        display: inline-block;
        width: 49%;
        padding-left: 12px;
        &:first-child {
          border-right: 1px solid @home-table-border-color;
        }
      }
    }
    .table-content {
      width: 100%;
      height: 120px;
      transition: all 0.5s;
      background: @home-table-bgcolor;
      .tips {
        line-height: 120px;
        text-align: center;
      }
      .mCSB_scrollTools {
        opacity: 0;
      }
      &:hover {
        .mCSB_scrollTools {
          opacity: 1;
        }
      }
      li {
        height: 26px;
        line-height: 26px;
        border-bottom: 1px solid @home-table-border-color;
        color: #fff;
        font-size: 12px;

        span {
          display: inline-block;
          height: 25px;
          overflow: hidden;
          width: 49%;
          padding-left: 12px;
          &:first-child {
            border-right: 1px solid @home-table-border-color;
          }
        }
      }
    }
    .address {
      display: inline-block;
      text-decoration: underline;
      cursor: pointer;
      color: #ef9558;
    }
  }
  .chart-table {
    color: #ccc;
    background: transparent;
    border-color: transparent !important;
    .ivu-table {
      color: #ccc;
      background: none;
      th {
        height: 26px !important;
        background: #363636 !important;
        border-color: #000 !important;
      }
      td {
        height: 26px !important;
        background: #454545 !important;
        border-color: #000 !important;
      }
      td:nth-of-type(2) {
        border-right: none;
      }
    }
    .ivu-table:before {
      width: 0;
    }
    .ivu-table:after {
      width: 0;
    }
  }
  .ivu-table-row:last-child td {
    border-bottom: none;
  }
}
</style>
