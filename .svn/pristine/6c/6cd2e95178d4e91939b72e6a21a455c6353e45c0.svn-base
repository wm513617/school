<template>
  <div class="home-staistics">
    <div class="header clearfix">
      <span>今日园区设备运行状态统计</span>
      <div v-if="limits" class="btn-refresh" @click="getParamsFun()">
        <Icon type="refresh"></Icon>
      </div>
    </div>
    <Row v-if="limits" class="content flex-1" style="padding:0 6px">
      <Col span="14" style="height:100%">
      <div style="height:calc(100% - 60px)">
        <BSechart :options="chartOption"></BSechart>
      </div>
      <div style="height:50px;overflow:auto">
        <div class="section" style="width:100%">
          <div class="title">投入使用中设备总数
            <span class="fs-16">{{total}}</span>台
          </div>
        </div>
        <div class="section ">
          <div class="title">正在运行中设备
            <span class="dif fs-16">{{online}}</span>台
          </div>
        </div>
        <div class="section">
          <div class="title">离线设备
            <span class="dif fs-16">{{offline}}</span>台
          </div>
        </div>
      </div>

      </Col>
      <Col span="10">
      <div style="width:100%">
        <div class="table-title">
          <span class="title-split"></span>
          <span>设备运行状态统计</span>
          <span class="title-split"></span>
        </div>
        <!-- <Table class="chart-table" border :columns="tableColumns" :data="dataProTable"></Table> -->
        <div class="chart-table-mock">
          <div class="table-header">
            <span>设备类型</span>
            <span>设备数量</span>
          </div>
          <div class="table-content">
            <p v-show="dataProTable.length === 0" class="tips">暂无数据</p>
            <bs-scroll v-show="dataProTable.length" ref="scroller">
              <ul @on-expand="$refs.scroller.update()">
                <li v-for="(item,index) of dataProTable" :key="index">
                  <span>{{item.name}}</span>
                  <span>{{item.value}}</span>
                  <!-- <span><p class="address" @click="showInfo($event, item.address, item.img)">{{item.address}}</p></span> -->
                </li>
              </ul>
            </bs-scroll>
          </div>
        </div>
      </div>
      </Col>
    </Row>
    <div v-else class="no-jurisdiction">
      <p>暂无权限</p>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import BSechart from '../../components/BSechart'
export default {
  components: {
    BSechart
  },
  mounted() {
    // this.limits = this.homePagerole.deviceStatistics
    if (this.limits) {
      this.getParamsFun()
    }
  },
  data() {
    return {
      chartOption: null,
      limits: true,
      dataPro: [],
      dataProTable: [],
      orgModel: '01',
      equOption: ['视频设备', '报警主机', '门禁设备', 'ip对讲', '巡更设备', '解码器', '网络键盘', '消防主机'],
      offline: 0,
      total: 0,
      online: 0,
      max: 10000,
      addrName: '',
      addrImg: '',
      tableColumns: [
        {
          title: '设备类型',
          key: 'name'
        },
        {
          title: '设备数量',
          key: 'value'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['homePagerole'])
  },
  methods: {
    ...mapActions(['getDeviceInfor']),
    getParamsFun(bol) {
      this.getDeviceInfor()
        .then(suc => {
          this.offline = suc.data.total.offline
          this.total = suc.data.total.total
          this.online = suc.data.total.online
          this.dataProTable = []
          this.dataPro = []
          var maxNum = Math.max(...suc.data.counts)
          for (let i = 0; i < suc.data.counts.length; i++) {
            this.dataProTable.push({
              value: suc.data.counts[i],
              name: this.equOption[i]
            })
            if (!maxNum || suc.data.counts[i]) {
              this.dataPro.push({
                value: suc.data.counts[i],
                name: this.equOption[i]
              })
            }
          }
          this.chartOption = {
            color: [
              '#f6b35a',
              '#e36d6d',
              '#5e8de7',
              '#6ce6c1',
              '#82cb71',
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
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '65%',
                center: ['50%', '55%'],
                itemStyle: {
                  labelLine: {
                    show: false,
                    length: 1,
                    length2: 1
                  }
                },
                label: {
                  normal: {
                    position: 'outside',
                    formatter: '{b}{c}台'
                  }
                },
                data: this.dataPro,
                startAngle: 270
              }
            ]
          }
        })
        .catch(err => {
          console.log('getDeviceInfor err' + err)
        })
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
