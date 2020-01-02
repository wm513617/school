<template>
  <div class="content">
    <!-- <Row>
                <Col span="24">
                  <ul class="tabHeader clearfix">
                    <li v-for="item of sysTabList" :class="{'active': sysTabActive === item.value}" @click="sysTabActive = item.value">{{item.label}}</li>
                  </ul>
                </Col>
              </Row> -->
    <Form inline :label-width="20">
      <Form-item>
        <Select placeholder="点击选择机构" style="width: 200px;">
          <VTree ref="devTree" :treeData="devList" :options="{
                        showInput: true
                      }"></VTree>
        </Select>
      </Form-item>
      <Form-item label="">
        <Date-picker :options="{
                    disabledDate (date) {
                      return date && date.valueOf() > Date.now()
                    }
                  }" v-model="dateRange" type="daterange" placement="bottom-start" placeholder="选择日期" style="width: 200px" :clearable="false"></Date-picker>
      </Form-item>
      <Form-item>
        <Button-group style="width: 200px;">
          <Button :class="{'active': timeFrame === 7}" type="ghost" style="width: 33.33%" @click="setDate($event, 7)">7天</Button>
          <Button :class="{'active': timeFrame === 14}" type="ghost" style="width: 33.33%" @click="setDate($event, 14)">14天</Button>
          <Button :class="{'active': timeFrame === 30}" type="ghost" style="width: 33.33%" @click="setDate($event, 30)">30天</Button>
        </Button-group>
      </Form-item>
      <Form-item>
        <div style="margin-left: 20px;">
          <Button type="ghost" style="width: 90px; margin-right: 10px;" @click="getChartData">统计</Button>
          <Button type="ghost" style="width: 90px;">导出</Button>
        </div>
      </Form-item>
    </Form>
    <div class="cartogram">
      <Row>
        <Col span="24">
        <ul class="tabHeader clearfix">
          <span class="title-font" style="float:left;margin-right:100px;">指标详解</span>
          <li v-show="sysTabActive === 'capture'" v-for="item of secTabListCap" :class="{'active': secTabActiveCap === item.value}" @click="secTabActiveCap = item.value">{{item.label}}</li>
          <li v-show="sysTabActive === 'current'" v-for="item of secTabListCur" :class="{'active': secTabActiveCur === item.value}" @click="secTabActiveCur = item.value">{{item.label}}</li>
        </ul>
        <BSechart style="width:100%; height:400px;" :options="chartOption"></BSechart>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import BSechart from 'components/BSechart'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      chartOption: null,
      sysTabActive: 'current',
      secTabActiveCap: '7',
      secTabActiveCur: '0',
      sysTabList: [
        { label: '人脸抓拍', value: 'capture' },
        { label: '人脸通行', value: 'current' }
      ],
      secTabListCap: [
        { label: '比对识别总数', value: '7' },
        { label: '黑名单识别数量', value: '3' },
        { label: '白名单识别数量', value: '4' },
        { label: '布控识别数量', value: '5' }
      ],
      secTabListCur: [
        { label: '员工识别数量', value: '0' },
        { label: '访客识别数量', value: '1' },
        { label: '陌生人识别数量', value: '6' },
        { label: 'VIP识别数量', value: '2' }
      ],
      nowDate: this.$moment().format('YYYY-MM-DD'),
      dateRange: [],
      chart: {
        label: ['8045', '2132'],
        serise: [{ name: '2017-06-25', data: ['8045', '2132'] }]
      },
      devList: [
        {
          expand: true,
          title: '机构1',
          checked: true,
          _id: 1,
          children: [
            {
              title: '子机构 1-0',
              expand: true,
              _id: 2,
              children: [
                {
                  title: 'leaf',
                  _id: 3
                },
                {
                  title: 'leaf',
                  _id: 4
                }
              ]
            },
            {
              title: 'parent 1-1',
              expand: true,
              _id: 5,
              children: [
                {
                  title: '<span style="color: red">leaf</span>',
                  _id: 6
                }
              ]
            }
          ]
        }
      ]
    }
  },
  created() {
    this.setDate('', 7)
    // 获取人脸资源机构树
    this.getResTree(this.sysTabActive === 'current' ? '0' : '1').catch(err => {
      this.$Notice.warning({
        title: '获取人脸资源机构树失败',
        desc: err.response.data.message,
        duration: 1
      })
    })
    // 初始化图表插件获取
    this.$nextTick(() => {
      this.getChartData()
    })
  },
  methods: {
    ...mapActions(['getResTree', 'getAnalyzeCurChart', 'getAnalyzeExportData']),
    setDate(e, n) {
      const moment = this.$moment
      const start = new Date(
        moment(moment().format('YYYY-MM-DD')) - 3600 * 1000 * 24 * (n - 1)
      )
      const end = new Date(moment(moment().format('YYYY-MM-DD')))
      const dateRange = []
      dateRange[0] = start
      dateRange[1] = end
      this.dateRange = JSON.parse(JSON.stringify(dateRange))
    },
    drawChart() {
      this.chartOption = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            saveAsImage: { show: true }
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chart.label,
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: this.chart.serise.name,
            barWidth: '60%',
            type: 'bar',
            data: this.chart.serise.data
          }
        ]
      }
    },
    getChartData() {
      if (this.sysTabActive === 'capture') {
        let dateParStr = ''
        let orgStr = ''
        if (this.dateRange[0] && this.dateRange[1]) {
          dateParStr =
            '&contrast=' +
            parseInt(Date.parse(this.dateRange[0]) / 1000) +
            '&contrast=' +
            parseInt(Date.parse(this.dateRange[1]) / 1000)
          if (this.$refs.devTree.getSelectedDeepIds().length > 0) {
            orgStr = this.$refs.devTree
              .getSelectedDeepIds()
              .map(v => {
                return '&res=' + v
              })
              .join('')
          }
          const paramsStr =
            '?type=' +
            this.secTabActiveCap +
            '&granularity=2&continuity=1' +
            dateParStr +
            orgStr
          this.getAnalyzeCapChart(paramsStr).catch(() => {
            this.$Notice.error({ title: '获取数据失败', duration: 3 })
          })
        } else {
          this.$Notice.error({ title: '请选择日期绘制图表', duration: 3 })
        }
      } else {
        let dateParStr = ''
        let orgStr = ''
        if (this.dateRange[0] && this.dateRange[1]) {
          dateParStr =
            '&contrast=' +
            parseInt(Date.parse(this.dateRange[0]) / 1000) +
            '&contrast=' +
            parseInt(Date.parse(this.dateRange[1]) / 1000)
          if (this.$refs.devTree.getSelectedDeepIds().length > 0) {
            orgStr = this.$refs.devTree
              .getSelectedDeepIds()
              .map(v => {
                return '&res=' + v
              })
              .join('')
          }
          const paramsStr =
            '?type=' +
            this.secTabActiveCur +
            '&granularity=2&continuity=1' +
            dateParStr +
            orgStr
          this.getAnalyzeCurChart(paramsStr).catch(err => {
            this.$Notice.error({
              title: '获取图表数据失败',
              desc: err.response.data.message,
              duration: 1
            })
          })
        } else {
          this.$Notice.error({ title: '请选择日期绘制图表', duration: 3 })
        }
      }
    },
    exportData() {
      let dateParStr = ''
      let orgStr = ''
      dateParStr =
        'contrast=' +
        parseInt(Date.parse(this.dateRange[0]) / 1000) +
        '&contrast=' +
        parseInt(Date.parse(this.dateRange[1]) / 1000)
      if (this.$refs.devTree.getSelectedDeepIds().length > 0) {
        orgStr = this.$refs.devTree
          .getSelectedDeepIds()
          .map(v => {
            return '&res=' + v
          })
          .join('')
      }
      const paramsStr = dateParStr + orgStr + '&continuity=1&sys=pass'
      this.getAnalyzeExportData(paramsStr)
        .then(res => {
          console.log(res, 259)
          const exportData = res.data.map(item => {
            return {
              date:
                '~' + this.$moment.unix(Number(item.date)).format('YYYY-MM-DD'),
              resource: item.resource,
              attention: item.attention,
              subject: item.subject,
              vip: item.vip,
              vistor: item.vistor
            }
          })
          var csvData = {
            title: ['日期', '抓拍位置', '访客识别数', 'VIP识别数', '陌生人识别数', '员工识别数'],
            titleForKey: [
              'date',
              'resource',
              'vistor',
              'vip',
              'attention',
              'subject'
            ],
            data: exportData
          }
          console.log(csvData, 367)
          this.$bsValidate.exportCsv(csvData, '人员通行对比统计')
        })
        .catch(err => console.log(err))
    },
    dateSelected(date) { },
    tabChange(name) { }
  },
  watch: {
    secTabActiveCap(val) {
      this.getChartData()
    },
    secTabActiveCur(val) {
      this.getChartData()
    },
    sysTabActive(val) {
      this.secTabActiveCap = '2'
      this.secTabActiveCur = '0'
      this.getChartData()
      this.getResTree(
        this.sysTabActive === 'current' ? '0' : '1'
      ).catch(err => {
        this.$Notice.warning({
          title: '获取人脸资源机构树失败',
          desc: err.response.data.message,
          duration: 1
        })
      })
    },
    faceResTree: {
      handler(val) {
        this.devList = this.$lodash.cloneDeep(val)
      },
      deep: true
    },
    analyzeChart: {
      handler(val) {
        this.chart = this.$lodash.cloneDeep(val)
        this.drawChart()
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      analyzeChart: state => state.face.analyzeChart,
      faceResTree: state => state.face.faceResTree
    }),
    timeFrame() {
      const moment = this.$moment
      return (
        (moment(this.dateRange[1]) - moment(this.dateRange[0])) /
        1000 /
        3600 /
        24 +
        1
      )
    }
  }
}
</script>

<style lang="less" scoped>
.clearfix:after {
  content: '.';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.cartogram {
  position: relative;
}

.tabHeader {
  width: 100%;
  list-style: none;
  outline: none;
  background: #0f2243;
  margin-bottom: 16px;
  li {
    height: 34px;
    float: left;
    padding: 0 10px;
    line-height: 34px;
    font-size: 14px;
    border-top: 2px solid #0f2343;
    outline: none;
    margin-bottom: -1px;
    cursor: pointer;
    // border-right: 2px solid #0f1e3b;
    color: #8c8e98;
  }
  .active {
    color: #fff; // border-left: 2px solid #5d5d5d;
    // border-top: 2px solid #5d5d5d;
    background: #1c3054;
  }
}

.title-font {
  height: 34px;
  line-height: 34px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 15px;
}

.title-style {
  font-size: 18px;
  color: #0099ff;
  height: 36.8px;
  line-height: 36.8;
}

.ivu-BStabs-nav .ivu-BStabs-tab-disabled {
  font-size: 16px;
  font-weight: bold;
  color: #495060 !important;
}
</style>
