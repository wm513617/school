<template>
  <div class="home-staistics">
    <div class="header clearfix">
      <span>今日园区车辆流动实时状态分布与统计</span>
      <div class="btn-refresh" @click="getData">
        <Icon type="refresh"></Icon>
      </div>
    </div>

    <Row class="content flex-1" style="padding:0 6px;">
      <Col span="14" style="height:100%">
      <div style="height:calc(100% - 60px)">
        <BSechart :options="chartOption"></BSechart>
      </div>
      <div style="height:60px;overflow:auto">
        <div class="section ">
          <div class="title">入园总数
            <span class="fs-16">{{inCount}}</span>辆</div>
        </div>
        <div class="section">
          <div class="title">出园总数
            <span class="fs-16">{{outCount}}</span>辆
          </div>
        </div>
        <div class="section ">
          <div class="title">已布控数
            <span class="dif fs-16">{{defenseCount}}</span>辆
          </div>
        </div>
        <div class="section">
          <div class="title">发现布控数
            <span class="dif fs-16">{{discoveryDefenseCount}}</span>辆
          </div>
        </div>
      </div>

      </Col>
      <Col span="10">
      <div class="table-title">
        <span class="title-split"></span>
        <span>当前车流密度较大区域</span>
        <span class="title-split"></span>
      </div>

      <div class="chart-table-mock">
        <div class="table-header">
          <span>时间段</span>
          <span>位置</span>
        </div>
        <div class="table-content">
          <p v-show="tableData.length===0" class="tips">暂无数据</p>
          <bs-scroll v-show="tableData.length" ref="scroller">
            <ul @on-expand="$refs.scroller.update()" v-show="tableData.length">
              <li v-for="item of tableData" :key="item.hour">
                <span>{{item.hour}}</span>
                <span>
                  <p class="address" @click="showInfo($event, item.name, item.image)">{{item.name}}</p>
                </span>
              </li>
            </ul>
          </bs-scroll>

        </div>
      </div>

      </Col>
    </Row>
    <Modal v-model="popSwitch" :title="addrName">
      <img v-if="addrImg" style="width: 100%" :src="'/api/upload?id='+addrImg" />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
import BSechart from '../../components/BSechart'
import '../../components/Scroll.vue'
import { mapActions } from 'vuex'
export default {
  components: {
    BSechart
  },
  created() {
    this.getData()
  },
  computed: {
    stayCount: function() {
      return parseInt(this.inCount) - parseInt(this.outCount)
    }
  },
  data() {
    return {
      chartOption: null,
      inCount: 0,
      outCount: 0,
      defenseCount: 0,
      discoveryDefenseCount: 0,
      max: 10000,
      popSwitch: false,
      addrName: '',
      addrImg: '',
      tableColumns: [
        {
          title: '时间段',
          key: 'hour'
        },
        {
          title: '位置',
          key: 'name',
          render: (h, params) => {
            return h('span', {
              style: {
                textDecoration: 'underline',
                cursor: 'pointer',
                color: '#0092C9'
              },
              domProps: {
                innerHTML: params.row.name
              },
              on: {
                click: () => {
                  this.popSwitch = true
                  this.addrName = params.row.name
                  this.addrImg = params.row.image
                }
              }
            })
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    ...mapActions(['homeGetCurMaxZone', 'homeGetEntryVehicleList', 'homeGetSomeCount']),
    showInfo(e, address, img) {
      this.popSwitch = true
      this.addrName = address
      this.addrImg = img
    },
    getData() {
      this.homeGetCurMaxZone().then(data => {
        this.tableData = data
      }).catch(err => console.log('logout error:' + err))
      this.homeGetEntryVehicleList().then(data => {
        var chartData = []
        if (data.length) {
          data.map(item => {
            chartData.push({
              name: item.name || '其他',
              value: item.countAll
            })
          })
        } else {
          chartData = [
            { name: '其他', value: 0 },
            { name: '正常车辆', value: 0 },
            { name: '陌生车辆', value: 0 }
          ]
        }
        this.chartOption = {
          color: ['#6ddcbb', '#5e8de7', '#f6b35a', '#d26a69', '#4bb1f3', '#3fb1e3', '#6be6c1', '#626c91', '#56afc1', '#599490', '#777ec7', '#577dce', '#83cb71', '#7c7cf8', '#91d1d3'],
          title: {
            x: 'center',
            y: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 18,
              color: '#ffffff'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '车辆统计',
              type: 'pie',
              radius: '68%',
              labelLine: {
                show: false
              },
              label: {
                normal: {
                  position: 'outside',
                  formatter: '{b}{c}辆',
                  textStyle: {
                    color: '',
                    fontSize: 12
                  }
                }
              },
              data: chartData
            }
          ]
        }
      }).catch(err => console.log('logout error:' + err))
      this.homeGetSomeCount().then(data => {
        this.inCount = data.inCount || 0
        this.outCount = data.outCount || 0
        this.defenseCount = data.defenseCount || 0
        this.discoveryDefenseCount = data.discoveryDefenseCount || 0
      }).catch(err => console.log('logout error:' + err))
    }
  }
}
</script>
<style lang="less" scoped>
@home-table-border-color: #203864;
@home-table-bgcolor: #0f2243;
.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.home-staistics {
 flex:1;
 background: #1b3153;
 display: flex;
 flex-direction: column;
  .content .section, #car-detail .section{
    padding: 0px;
  }
  .fs-16{
   color: #fda54b;
 }
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
      height: 120px;
      width: 100%;
      transition: all .5s;
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
      color: #EF9558;
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
