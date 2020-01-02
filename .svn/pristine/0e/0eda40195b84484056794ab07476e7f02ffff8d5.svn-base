<template>
  <div class="count-wrap">
    <main class="main-wrap">
      <header class="top-wrap">
        <h3 class="header">{{attrName}}</h3>
      </header>
      <p class="title" style="background:none;">元素统计</p>
      <section class="ele-wrap">
        <ul class="icon-left">
          <li><i class="icon iconfont icon-paisheluxiang" title="视频"></i></li>
          <li><i class="icon iconfont icon-baojing2" title="普通报警"></i></li>
          <li><i class="icon iconfont icon-xiaofangbaojing11" title="消防报警"></i></li>
          <li><i class="icon iconfont icon-baojingzhu1" title="报警柱"></i></li>
          <li><i class="icon iconfont icon-baojingxiang2" title="报警箱"></i></li>
          <li><i class="icon iconfont icon-dianzixungeng" title="巡更"></i></li>
          <li><i class="icon iconfont icon-yidongdanbing" title="在线单兵"></i></li>
          <li><i class="icon iconfont icon-loufangdianwei" title="楼宇区域"></i></li>
          <li><i class="icon iconfont icon-grid" title="网格化"></i></li>
        </ul>
        <div class="top-canvas-wrap" ref="topCanvas">
          <BSechart :height="topCanvasHeight" width="238px" :options="topChartOption"></BSechart>
        </div>
      </section>
      <p class="title">警情统计</p>
      <section class="bottom-canvas-wrap">
        <BSechart height="180px" width="258px" :options="bottomChartOption"></BSechart>
      </section>
      <div class="icon-bottom">
        <ul>
          <li>
            <i class="icon iconfont icon-baojing2" title="普通报警"></i>
          </li>
          <li>
            <i class="icon iconfont icon-shipinbaojing" title="视频报警"></i>
          </li>
          <li>
            <i class="icon iconfont icon-zhinengbaojing" title="智能报警"></i>
          </li>
          <li>
            <i class="icon iconfont icon-xiaofangbaojing11" title="消防报警"></i>
          </li>
          <li>
            <i class="icon iconfont icon-baojingqiuzhu1" title="报警求助报警"></i>
          </li>
          <li>
            <i class="icon iconfont icon-yidongdanbing" title="单兵报警"></i>
          </li>
          <li>
            <i class="icon iconfont icon-shougongbaojing1" title="手工报警"></i>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script>
import BSechart from 'components/BSechart'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      topCanvasHeight: ''
    }
  },
  computed: {
    ...mapState({
      bottomCanvasData: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.bottomCanvasData,
      mapStatisticOnCount: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.mapStatisticOnCount,
      mapStatisticOffCount: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.mapStatisticOffCount,
      activeMapConfig: ({ mapIndex }) => mapIndex.activeMapConfig,
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes,
      isGridStatistic: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.isGridStatistic
    }),
    ...mapGetters('fengMapApplyInteractive', ['toolsPanelActive']),
    topChartOption() {
      return {
        color: ['#3398DB', '#CCCCD3'],
        tooltip: {
          formatter: (param, value) => {
            if (param.dataIndex === 1 || param.dataIndex === 0) {
              param.seriesName = '数量: '
            }
            return param.seriesName + ': ' + param.value
          }
        },
        grid: {
          top: '0%',
          left: '3%',
          right: 70,
          bottom: '0.4%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            show: false,
            position: 'top',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            show: false,
            data: ['', '', '', '', '', '', '', '', ''],
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '在线数量',
            type: 'bar',
            barWidth: '40%',
            stack: 'number',
            data: this.mapStatisticOnCount
          }, {
            name: '离线数量',
            type: 'bar',
            barWidth: '40%',
            stack: 'number',
            data: this.mapStatisticOffCount,
            itemStyle: { normal: { label: { show: true, position: 'right' } } },
            label: {
              normal: {
                formatter: (param) => {
                  return param.value + this.mapStatisticOnCount[param.dataIndex]
                }
              }
            }
          }
        ]
      }
    },
    bottomChartOption() {
      return {
        color: ['#f00'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '22',
          right: '22',
          width: 228,
          bottom: '2%',
          containLabel: false
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            data: ['', '', '', '', '', '', ''],
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
            show: false,
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            barWidth: '35%',
            data: this.bottomCanvasData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#fff',
                    fontSize: 16
                  }
                }
              }
            }
          }
        ]
      }
    },
    attrName() {
      if (this.isGridStatistic) {
        return this.attrInfo.name
      } else {
        return this.activeMapConfig.mapName
      }
    }
  },
  watch: {
    toolsPanelActive(val) {
      if (val === 'MapCount') {
        this.setTopCanvasHeight()
      }
    },
    isGridStatistic(val) {
      if (val) {
        this.setTopCanvasHeight()
      }
    }
  },
  methods: {
    setTopCanvasHeight() {
      this.$nextTick(() => {
        this.topCanvasHeight = this.$refs.topCanvas.clientHeight + 'px'
      })
    }
  },
  mounted() {},
  created() {
    if (this.toolsPanelActive === 'MapCount' || this.isGridStatistic) {
      this.setTopCanvasHeight()
    }
  }
}
</script>

<style scoped lang="less">
.count-wrap {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 12px;
  background-color: rgb(44, 62, 92);
}
.main-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .top-wrap {
    height: 38px;
    background-color: #0f2343;
    padding: 0 16px;
    .header {
      float: left;
      line-height: 38px;
      font-size: 14px;
    }
  }
  .title {
    padding: 8px 16px;
    background-color: #0f2343;
  }
  .ele-wrap {
    flex: 1;
    display: flex;
    .icon-left {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding-top: 7%;
      li {
        padding-left: 16px;
        width: 100%;
      }
    }
  }
  .top-canvas-wrap {
    flex: 1;
  }
  .bottom-canvas-wrap {
    height: 180px;
    width: 100%;
  }
  .icon-bottom {
    text-align: center;
    padding: 0 22px 16px;
    ul {
      display: flex;
      li {
        width: 33px;
        display: block;
      }
    }
  }
}
</style>
