<template>
  <div class="container">
    <Row class="bs-content">
      <div class="bs-left" v-show="leftStatus">
        <Menu theme="dark" :active-name="route" width="auto" @on-select="openPage">
          <Menu-item name="今日数据">
            今日数据
          </Menu-item>
          <Menu-item name="统计分析">
            统计分析
          </Menu-item>
        </Menu>
      </div>
      <div class="bs-left icon">
      <span class="left-icon" :style="{right: leftStatus? '-16px': '-32px'}" @click="leftStatus = !leftStatus">
        <i :class="['ivu-icon', leftStatus?'ivu-icon-ios-arrow-left': 'ivu-icon-ios-arrow-right']"></i>
      </span>
      </div>
      <div class="bs-main" v-show="route=='今日数据'">
        <div class="main-top">
          <h3>实时数据</h3>
          <h3>{{currentTimeNow}}</h3>
        </div>
        <div class="main-middle">
          <div class="middle-tabPicx">
            <div class="tabPic-count">{{todayData.passageTotal}}</div>
            <div class="tabPic-title">通行总量</div>
            <div class="tabPic-button">
              <div>
                <a  @click="$router.replace('/personnelTaffic/records')">查看更多</a>
              </div>
              <div>
                <img src="" alt="">
              </div>
            </div>
          </div>
          <div class="middle-tabPicx">
            <div class="tabPic-count">{{todayData.alarmTotal}}</div>
            <div class="tabPic-title">报警总量</div>
            <div class="tabPic-button">
              <div>
                <a  @click="$router.replace('/personnelTaffic/monitoring')">查看更多</a>
              </div>
              <div>
                <img src="" alt="">
              </div>
            </div>
          </div>
          <div class="middle-tabPicx">
            <div class="tabPic-count">{{todayData.studentsTotal}}</div>
            <div class="tabPic-title">人员总量</div>
            <div class="tabPic-button">
              <div>
                <a  @click="$router.replace('/personnelTaffic/personnelManagement')">查看更多</a>
              </div>
              <div>
                <img src="" alt="">
              </div>
            </div>
          </div>
          <div class="middle-tabPicx">
            <div class="tabPic-count">{{todayData.authCardTotal ? todayData.authCardTotal : 0}}/{{todayData.authFaceTotal ? todayData.authFaceTotal : 0}}</div>
            <div class="tabPic-title">已授权卡号/已授权人脸</div>
            <div class="tabPic-button">
              <div>
                <a  @click="$router.replace('/personnelTaffic/accessControlAuthority')">查看更多</a>
              </div>
              <div>
                <img src="" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="main-bottom">

          <div style="position: relative" class="bottom-echarts" >
            <div id="echart-1" ref="echart-1" style="width: 100%;height:100%"></div>
            <div class="btn">
              <div class="center-left">
                <Poptip   placement="left-start" width="150px">
                  <Button><span class="iconfont">&#xe73e;</span></Button>
                  <div class="api" slot="content" style="max-height:250px;overflow-y: auto;width: 100%;display: flex;flex-direction: column;align-items: center">
                       <div v-for="  (item,index) in arrKeys" style="margin: 3px 0;">
                         <Button type="primary" size="default" style="width: 100px" @click="choseHierarchy(item,index)">{{index+1+'级'}}</Button>
                       </div>
                  </div>
                </Poptip>

              </div>
            </div>
          </div>
          <div class="bottom-echarts" id="echart-2" ref="echart-2"></div>

        </div>
      </div>
      <div class="bs-main_" v-show="route=='统计分析'">
        <div class="main-top" style="margin-left:15px;">
          <Form :model="dataStatisicsParams" label-position="left" :label-width="70" style="display: flex;justify-content: flex-start;margin-top: 13px;font-size: 12px">
            <FormItem label="选择通道" style="position:relative">
              <!-- <el-input
                size="small"
                placeholder="请输入门名称"
                v-model="filterText"
                 @focus="dropTreeFuc"
                @blur="closeDropTreeFuc">
              </el-input> -->
               <!-- <div style="position:absolute;top: 45px;left: 0;z-index: 1;max-height: 350px;overflow: auto;width: 280px;font-size: 12px" v-show="isDropTree"> -->
                  <Select style="width:300px" placeholder="全部"
                filterable clearable  label-in-value v-model="keyword" @on-change="checkPosition"  @on-query-change="keywordChange">
                    <Option v-for="(opt, index) in positionList"
                  :value="opt.value"  :key="index">{{ opt.label }}</Option>
                    </Select>
               <!-- </div> -->

            </FormItem>
            <FormItem label="时间段" STYLE="margin-left: 25px">
              <DatePicker :options="optionsTime" type="datetime" style="width: 200px" v-model="dataStatisicsParams.startTime" placeholder="请选择开始时间" :editable="false" :clearable="false"></DatePicker>
              <b>至</b>
              <DatePicker :options="optionsTime" type="datetime" style="width: 200px" v-model="dataStatisicsParams.endTime" placeholder="请选择结束时间" :editable="false" :clearable="false"></DatePicker>
            </FormItem>

            <FormItem label="" STYLE="margin-left: 25px">
              <Button :size="buttonSize" type="default" @click="choseDate(7)" :class="{dateActive:isDateActive===7}">7天</Button>
              <Button :size="buttonSize" type="default" @click="choseDate(15)" :class="{dateActive:isDateActive===15}">15天</Button>
              <Button :size="buttonSize" type="default" @click="choseDate(30)" :class="{dateActive:isDateActive===30}">30天</Button>
            </FormItem>
            <FormItem label="" STYLE="margin-left: 25px" style="justify-self: right">
              <Button :size="buttonSize" type="primary"  @click="search">检索</Button>
              <Button :size="buttonSize" type="primary" @click="exportDataFuc">导出</Button>

            </FormItem>

          </Form>
        </div>
        <div class="main-bottom">
          <div class="bottom-echarts" id="echart-3" ref="echart-3"></div>
          <div class="bottom-echarts" id="echart-4" ref="echart-4"></div>
        </div>
      </div>
    </Row>
  </div>
</template>
<script>
import BStreeNewBox from '../../../components/BStreeNew/BStreeNewBox'
import TableTab from '../../settings/equipment/tableTab'
import { mapState, mapActions, mapGetters } from 'vuex'
import { JSONToExcelConvertor } from '../jsonToExcel'
export default {
  name: 'dataStatistics',
  components: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      keyword: '', // 搜索关键字
      positionList: [], // 位置数组
      isDateActive: 7, // 时间选择按钮
      setIntervalTimer: '', // 定时器
      arrKeys: [], // 按钮层
      currentTimeNow: '',
      isDropTree: false,
      treeData: [],
      filterText: '',
      buttonSize: 'default',
      route: '今日数据',
      leftStatus: true,
      todayData: {}, // 今日统计数据
      Domechart_1: '',
      Domechart_2: '',
      Domechart_3: '',
      Domechart_4: '',
      option_1: {
        backgroundColor: ['#1b3153'],
        title: {
          text: '通行量',
          textStyle: {
            fontSize: 18,
            width: '100%',
            color: ['#fff']
          },
          subtextStyle: {
            align: 'center',
            fontSize: 14,
            color: ['#fff']
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['出量', '入量'],
          textStyle: {
            color: ['#fff']
          }
        },
        calculable: true,
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 0,
            end: 100 // 初始化滚动条
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: [],
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '出量',
            type: 'bar',
            data: []
          },
          {
            name: '入量',
            type: 'bar',
            data: []
          }
        ]
      },
      option_2: {
        title: {
          text: '报警统计',
          textStyle: {
            fontSize: 18,
            width: '100%',
            color: ['#fff']
          },
          // left: 'center',
          // textAlign: 'center',
          // subtext: '全球各大城市排行',
          subtextStyle: {
            align: 'center',
            fontSize: 14,
            color: ['#fff']
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 0,
            end: 100 // 初始化滚动条
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00'
          ],
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
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            type: 'line',
            areaStyle: {}
          }
        ]
      },
      option_3: {
        title: {
          text: '通行量',
          textStyle: {
            fontSize: 18,
            width: '100%'
          },
          subtextStyle: {
            align: 'center',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['出量', '入量']
        },
        calculable: true,
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '9%',
            bottom: -5,
            start: 10,
            end: 90 // 初始化滚动条
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '出量',
            type: 'bar',
            data: []
          },
          {
            name: '入量',
            type: 'bar',
            data: []
          }
        ]
      },
      option_4: {
        title: {
          text: '报警统计',
          textStyle: {
            fontSize: 18,
            width: '100%'
          },
          subtextStyle: {
            align: 'center',
            fontSize: 14
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line',
            areaStyle: {}
          }
        ]
      },
      exportDataArr: [], // 导出
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      dataStatisicsParams: {
        address: {
          type: '',
          arr: []
        },
        startTime: '',
        endTime: ''
      }
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  // eslint-disable-next-line no-dupe-keys
  watch: {
    // 位置模糊匹配
    positionList: function(val) {
      if (this.keyword) {
        return this.positionList.filter(value => {
          return value.includes(this.keyword)
        })
      }
    }
  },
  methods: {
    ...mapActions([
      'getDoorTreeList',
      'getStatisticToday',
      'getStatisticpassData',
      'getStatisticanalyz',
      'getStatistictree',
      'getAllDevice'
    ]),
    dropTreeFuc() {
      // 打开门的树形弹窗
      this.isDropTree = true
    },
    closeDropTreeFuc() {
      // 关闭门的树形弹窗
      setTimeout(() => {
        this.isDropTree = false
      }, 300)
    },
    filterNode(value, data) {
      if (!value) { return true }
      return data.label.indexOf(value) !== -1
    },
    // 左侧导航切换
    openPage(event) {
      this.route = event
      if (event !== '今日数据') {
        this.choseDate(7)
        if (this.Domechart_1) {
          this.Domechart_1.clear()
        }
        if (this.Domechart_2) {
          this.Domechart_2.clear()
        }
        setTimeout(() => {
          this.Domechart_3 = this.$echarts.init(this.$refs['echart-3'])
          this.Domechart_4 = this.$echarts.init(this.$refs['echart-4'])
          // this.Domechart_3.setOption(this.option);
          // this.Domechart_4.setOption(this.option);
        }, 30)
        let param = JSON.parse(JSON.stringify(this.dataStatisicsParams))
        param.startTime = new Date(param.startTime).getTime()
        param.endTime = new Date(param.endTime).getTime()
        let that = this
        this.getStatisticanalyz(param).then(res => {
          if (res) {
            that.exportDataArr = this.exportTransformation(res)
            that.option_3.xAxis[0].data = []
            that.option_3.series[0].data = []
            that.option_3.series[1].data = []
            res.passData.map(item => {
              if (item.readState === 0) {
                that.option_3.xAxis[0].data.push(item.date)
                that.option_3.series[0].data.push(item.total)
              } else if (item.readState === 1) {
                that.option_3.series[1].data.push(item.total)
              }
            })
            that.option_4.xAxis.data = []
            that.option_4.series[0].data = []
            res.alarmData.map(item => {
              that.option_4.xAxis.data.push(item.date)
              that.option_4.series[0].data.push(item.total)
            })

            that.Domechart_4.setOption(this.option_4, true)
            that.Domechart_3.setOption(this.option_3, true)
          }
        })
      } else {
        this.SecondsRefresh15()
        if (this.Domechart_3) {
          this.Domechart_3.clear()
        }
        if (this.Domechart_4) {
          this.Domechart_4.clear()
        }
      }
    },
    // 时间框时间变化时回调
    optionTimeChange(event) {},
    // 点击层级
    choseHierarchy(item, index) {
      console.log(item)
      let param = []
      item.map(value => {
        let arr = []
        // arr.push(value._id);   // 第几层级的id;
        this.rollCallGetID(value, arr)
        param.push(arr)
      })
      console.log(param)
      let that = this
      this.getStatisticpassData(param).then(res => {
        if (res) {
          that.option_1.xAxis[0].data = []
          that.option_1.series[0].data = []
          that.option_1.series[1].data = []
          res.map(item => {
            that.option_1.xAxis[0].data.push(item.orgName)
            that.option_1.series[0].data.push(item.outPass)
            that.option_1.series[1].data.push(item.entryPass)
          })
          this.Domechart_1.setOption(this.option_1, true)
          console.log(that.option_1)
        }
      })
    },

    rollCallGetID(childArr, valueArr) {
      valueArr.push(childArr._id)
      if (childArr.children && childArr.children.length > 0) {
        childArr.children.map(item => {
          this.rollCallGetID(item, valueArr)
        })
      }
    },
    // 清空位置搜索框
    keywordChange(query) {
      if (query === '') {
        this.keyword = ''
      }
    },
    // 15 秒刷新一次
    SecondsRefresh15() {
      // 获取今日实时数据
      this.getStatisticToday().then(res => {
        if (res) {
          this.todayData = res
          // this.option_2.xAxis.data = [];
          // this.option_2.series[0].data=[];
          // for(var key in res.alarmData){
          //   //this.option_2.xAxis.data.push(key)
          //   this.option_2.series[0].data.push(this.todayData[key])
          // }

          res.alarmData.map(it => {
            if (it.hour) {
              this.option_2.series[0].data[it.hour] = it.total
            }
          })
          console.log(this.option_2)
          this.Domechart_2.setOption(this.option_2)
        }
      })
      if (this.arrKeys && this.arrKeys.length > 0) {
        this.choseHierarchy(this.arrKeys[0], 0)
      }
    },
    // 点击门树选择框
    handleCheckChange(event) {
      console.log(event)
      this.filterText = event.label
      this.rollCallDoorID(event)
    },
    rollCallDoorID(obj) {
      if (obj.children && obj.children.length > 0) {
        obj.children.map(item => {
          if (item.type == 'door') {
            this.dataStatisicsParams.address.push(item.id)
          } else {
            this.rollCallDoorID(item)
          }
        })
      }
    },
    // 选择默认时间
    choseDate(day) {
      this.isDateActive = day
      let currentDay = new Date().getTime()
      let befaultDay = currentDay - day * 3600 * 24 * 1000
      this.dataStatisicsParams.startTime = new Date(this.$moment(befaultDay).format('YYYY-MM-DD'))
      this.dataStatisicsParams.endTime = new Date()
      console.log(this.dataStatisicsParams)
    },
    // 位置下拉框
    checkPosition(value) {
      this.dataStatisicsParams.address.type = ''
      this.dataStatisicsParams.address.arr = []
      if (value) {
        this.addressType.forEach((item) => {
          if (item.name === value.label && item._id === value.value) {
            this.dataStatisicsParams.address.type = item.type
            this.dataStatisicsParams.address.arr.push(item._id)
          }
        })
      }
      console.log(this.dataStatisicsParams)
    },
    // 搜索数据
    search() {
      let param = JSON.parse(JSON.stringify(this.dataStatisicsParams))
      param.startTime = new Date(param.startTime).getTime()
      param.endTime = new Date(param.endTime).getTime()
      let that = this
      this.getStatisticanalyz(param).then(res => {
        if (res) {
          this.exportDataArr = this.exportTransformation(res)
          that.option_3.xAxis[0].data = []
          that.option_3.series[0].data = []
          that.option_3.series[1].data = []
          res.passData.map(item => {
            if (item.readState === 0) {
              that.option_3.xAxis[0].data.push(item.date)
              that.option_3.series[0].data.push(item.total)
            } else if (item.readState === 1) {
              that.option_3.series[1].data.push(item.total)
            }
          })
          that.option_4.xAxis.data = []
          that.option_4.series[0].data = []
          res.alarmData.map(item => {
            that.option_4.xAxis.data.push(item.date)
            that.option_4.series[0].data.push(item.total)
          })

          that.Domechart_4.setOption(that.option_4, true)
          that.Domechart_3.setOption(that.option_3, true)
        }
      })
    },
    // 获取所有设备
    getAllDeviceFuc() {
      this.getAllDevice().then(res => {
        if (res.code === 200) {
          this.addressType = res.arr
          res.arr.forEach(item => {
            this.positionList.push({
              value: item._id,
              label: item.name
            })
          })
        }
      })
    },
    // 导出
    exportDataFuc() {
      var headerData = [
        { value: '日期', type: 'date' },
        { value: '通行总量', type: 'total' },
        { value: '入量', type: 'input' },
        { value: '出量', type: 'output' },
        { value: '报警量', type: 'alarm' }
      ]

      JSONToExcelConvertor(this.exportDataArr, '通行统计', headerData)
    },
    // 导出数据转换
    exportTransformation(obj) {
      let passData = obj.passData
      let alarmData = obj.alarmData
      let ob = {}
      passData.map(item => {
        if (ob[item.date]) {
          if (item.readState === 0) {
            ob[item.date]['input'] = item.total
          } else {
            ob[item.date]['output'] = item.total
          }
        } else {
          ob[item.date] = {}
          if (item.readState === 0) {
            ob[item.date]['input'] = item.total
          } else {
            ob[item.date]['output'] = item.total
          }
        }
      })
      for (var key in ob) {
        if (ob.hasOwnProperty(key)) {
          ob[key]['total'] = ob[key].input + ob[key].output
          ob[key]['date'] = key
          ob[key]['alarm'] = 0
          alarmData.forEach(item => {
            if (item.date === key) {
              ob[key]['alarm'] = item.total
            }
          })
        }
      }
      return Object.values(ob)
    }
  },
  created() {
    this.currentTimeNow = this.$moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')
    this.getAllDeviceFuc()
    this.getDoorTreeList().then(res => {
      if (res) {
        this.treeData.push(res.data)
      }
    })
    this.SecondsRefresh15() // 初始化，以后没15s 重新获取
    this.setIntervalTimer = setInterval(() => {
      this.SecondsRefresh15()
    }, 15000)

    // 获取机构树层级
    this.getStatistictree().then(res => {
      if (res) {
        for (var item in res) {
          this.arrKeys.push(res[item])
        }
        this.choseHierarchy(this.arrKeys[0], 0)
      }
    })
  },
  mounted() {
    this.Domechart_1 = this.$echarts.init(this.$refs['echart-1'])
    this.Domechart_2 = this.$echarts.init(this.$refs['echart-2'])
  },
  beforeDestroy() {
    clearInterval(this.setIntervalTimer)
  }
}
</script>
<style scoped>
.dateActive {
  background: #1d8ce0;
}
.container {
  width: 100%;
  height: auto;
  position: relative;
  display: flex;
}

.sidebar {
  width: 100%;
  height: 100%;
}

.sidebar > a {
  display: block;
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  color: #fff;
  padding-left: 20px;
  text-align: center;
  cursor: pointer;
}

.sidebar > .active {
  background-color: #0f2243;
}

.tree-org {
  height: 100%;
}

.tree-org ul {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.tree-org ul li {
  width: 100%;
  height: 34px;
  line-height: 34px;
  text-align: left;
  padding-left: 35px;
  cursor: pointer;
}

.tree-org ul li:hover {
  color: #2d8cf0;
}

.tree-org ul li:active {
  color: #2d8cf0;
}

.config-list li {
  position: relative;
  cursor: pointer;
  border-bottom: 1px solid #5d5d5d;
  font-size: 14px;
  color: #80848f;
  border-right: 2px solid transparent;
}

.config-list li:hover {
  color: #fff;
}

.sidebar > .config-list > .active {
  color: #2d8cf0;
  border-right: 2px solid #2d8cf0;
  background-color: #444;
  z-index: 2;
}

li > div {
  padding: 14px 40px;
}

.bs-main {
  padding: 0;
  background-color: #1c3053;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.bs-main_ {
  padding: 0;
  background-color: #1c3053;
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.bs-main .main-top {
  height: 50px;
  width: 100%;
  display: flex;
  padding-left: 15px;
}

.bs-main .main-top h3 {
  padding: 15px;
}

.bs-main .main-middle {
  height: 155px;
  width: 100%;
  border-bottom: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
  padding: 15px 15px 0 0;
  display: flex;
  justify-content: flex-start;
}

.bs-main .main-middle .middle-tabPicx:nth-child(odd) {
  background: url('../../../../static/u1926.png') repeat;
}

.bs-main .main-middle .middle-tabPicx:nth-child(even) {
  background: url('../../../../static/u1933.png') repeat;
}

.bs-main .main-middle .middle-tabPicx {
  width: calc(25% - 30px);
  margin-left: 30px;
  height: 130px;
  padding-top: 15px;
  position: relative;
}

.bs-main .main-middle .middle-tabPicx .tabPic-count {
  width: 100%;
  padding-right: 15px;
  font-size: 28px;
  height: 30px;
  line-height: 30px;
  text-align: right;
}

.bs-main .main-middle .middle-tabPicx .tabPic-title {
  width: 100%;
  font-size: 16px;
  padding-right: 15px;
  height: 30px;
  line-height: 30px;
  text-align: right;
}

.bs-main .main-middle .middle-tabPicx .tabPic-button {
  width: 100%;
  height: 30px;
  line-height: 30px;
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #dddddd;
  opacity: 0.6;
  justify-content: space-between;
  padding: 0 15px;
  cursor: pointer;
  color: #fff;
}

.bs-main .main-bottom {
  flex: 1;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
}

.bs-main .main-bottom .bottom-echarts:nth-child(odd) {
  width: calc(50% - 7px);
  height: calc(50% - 7px);
  margin-right: 7px;
  margin-top: 14px;
}

.bs-main .main-bottom .bottom-echarts:nth-child(even) {
  width: calc(50% - 7px);
  height: calc(50% - 7px);
  margin-left: 7px;
  margin-top: 14px;
}

.bs-main .main-bottom .bottom-echarts {
  background: #1b3153 !important;
  min-height: 300px;
}
.bs-main_ .main-bottom {
  flex: 1;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
}

.bs-main_ .main-bottom .bottom-echarts:nth-child(odd) {
  width: calc(50% - 7px);
  height: calc(50% - 7px);
  margin-right: 7px;
  margin-top: 14px;
}

.bs-main_ .main-bottom .bottom-echarts:nth-child(even) {
  width: calc(50% - 7px);
  height: calc(50% - 7px);
  margin-left: 7px;
  margin-top: 14px;
}

.bs-main_ .main-bottom .bottom-echarts {
  background: #fff !important;
  min-height: 300px;
  position: relative;
}
.bottom-echarts .btn {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;
}
.actions-search div {
  margin-right: 5px;
}

.bs-left {
  position: relative;
  overflow: initial;
}

.bs-left.icon {
  flex: 0;
  margin-right: 0;
}

.layout-content {
  min-height: 100%;
  width: 100%;
  padding: 16px 0;
}

.layout-content-main {
  flex: 1;
  margin-bottom: 2px;
  background: #1c3054;
}

.left-icon {
  height: 85px;
  width: 16px;
  cursor: pointer;
  z-index: 1000;
  position: absolute;
  display: block;
  top: 40%;
  border: 16px solid transparent;
  border-left: 16px solid #0f2343;
  color: #fff;
  line-height: 53px;
  font-size: 20px;
}

.left-icon i {
  margin-left: -11px;
}
</style>
