<template>
  <div class="chartBox">
    <div style="flex:1 0 200px">
      <BSechart style="height:100%;width:100%" :options="typeOption"></BSechart>
    </div>
    <div style="flex:1 0 250px">
      <BSechart style="height:100%;width:100%" :options="brandOption"></BSechart>
    </div>
  </div>
</template>

<script>
import BSechart from '../../components/BSechart'
import { mapActions } from 'vuex'
export default {
  components: {
    BSechart
  },
  data() {
    return {
      typeOption: null,
      brandOption: null
    }
  },
  created() {
    var defaultGlobalColor = [
      '#f6b35a',
      '#e36d6d',
      '#5e8de7',
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
    ]
    this.homeGetVehicleType()
      .then(data => {
        var chartData = []
        if (data.length) {
          data.map(item => {
            chartData.push({
              value: item.countAll,
              name: item.name
            })
          })
        } else {
          chartData = [
            { name: '小汽车', value: 0 },
            { name: '巴士', value: 0 },
            { name: '三轮车', value: 0 },
            { name: '卡车', value: 0 },
            { name: '面包车', value: 0 }
          ]
        }
        this.typeOption = {
          title: {
            text: '车辆类型',
            top: 'center',
            left: 'center',
            textStyle: {
              fontSize: 10,
              fontWeight: 300,
              color: '#ffffff'
            }
          },

          color: defaultGlobalColor, // 调色盘颜色列表。
          legend: {
            bottom: 0,
            left: 'center',
            width: 500,
            itemWidth: 14,
            itemHeight: 14,
            itemBorderRadius: 8,
            textStyle: {
              // color: "#d7d7d7"
            }
          },

          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '车辆类型',
              type: 'pie',
              radius: ['30%', '50%'],
              label: {
                normal: {
                  fontSize: {
                    fontColor: '#ffffff'
                  }
                }
              },
              data: chartData
            }
          ]
        }
      })
      .catch(err => console.log('logout error:' + err))
    this.homeGetVehicleBrand()
      .then(data => {
        var chartData = []
        if (data.length) {
          data.map(item => {
            chartData.push({
              value: item.count,
              name: item.name
            })
          })
        } else {
          chartData = [
            { name: '奔驰', value: 0 },
            { name: '宝马', value: 0 },
            { name: '奥迪', value: 0 },
            { name: '丰田', value: 0 },
            { name: '别克', value: 0 },
            { name: '福特', value: 0 },
            { name: '现代', value: 0 },
            { name: '路虎', value: 0 }
          ]
        }

        this.brandOption = {
          title: {
            text: '车辆品牌',
            top: 'center',
            left: 'center',
            textStyle: {
              fontSize: 10,
              fontWeight: 300,
              color: '#ffffff'
            }
          },

          color: defaultGlobalColor, // 调色盘颜色列表。
          legend: {
            bottom: 0,
            left: 'center',
            width: 500,
            itemWidth: 14,
            itemHeight: 14,
            itemBorderRadius: 8,
            textStyle: {
              // color: "#d7d7d7"
            }
          },

          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '车辆品牌',
              type: 'pie',
              radius: ['30%', '60%'],
              itemStyle: {
                normal: {
                  // borderWidth: 2,
                  // borderColor: '#ffffff'
                }
              },
              label: {
                normal: {
                  fontSize: {
                    fontColor: '#ffffff'
                  }
                }
              },
              data: chartData
            }
          ]
        }
      })
      .catch(err => console.log('logout error:' + err))
  },
  methods: {
    ...mapActions(['homeGetVehicleType', 'homeGetVehicleBrand'])
  }
}
</script>

<style lang="less" scoped>
.chartBox {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
}
</style>
