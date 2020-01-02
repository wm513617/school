<template>
  <div class="flightContainer">
    <div class="flightTitle">
      <span>飞行漫游</span>
      <i v-if="subPage === 'routeList'" class="iconfont icon-large add-btn" title="添加路线" @click.stop="goToRouteEdit(true)"></i>
      <i v-if="subPage !== 'routeList'" class="iconfont icon-large icon-previous-page" title="返回路线列表" @click.stop="goBack()"></i>
      <i v-if="subPage === 'routeEdit'" class="iconfont icon-large icon-preview" title="飞行预览" @click.stop="travelFlyingRoute()"></i>
    </div>
    <div class="flightContent" v-if="subPage === 'routeList'">
      <Table size="small" border :columns="columns" :data="routes"></Table>
    </div>
    <route-edit ref="routeEdit" class="flightContent" v-else-if="subPage === 'routeEdit'" :isAdd='isAdd' :selectedRoute="selectedRoute" @backToList="editToRouteList" @dataChange="routeEditDataChange"></route-edit>
    <route-detail class="flightContent" v-else-if="subPage === 'routeDetail'" :selectedRoute="selectedRoute" :geoMarker="geoMarker"></route-detail>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { transCoorinates } from './flight/init'
import RouteEdit from './flight/RouteEdit'
import RouteDetail from './flight/RouteDetail'
import FlyingTrack from './flight/FlyingTrack'
export default {
  name: 'Flight',
  components: { RouteEdit, RouteDetail },
  data() {
    return {
      subPage: 'routeList', // routeList(路线列表)、routeEdit(路线编辑)、routeDetail(路线详情)
      detailPrePage: 'routeList',
      isAdd: true, // 编辑页是否是添加数据
      flyingTrack: null, // 飞行轨迹
      selectedRoute: null,
      routes: [],
      columns: [
        {
          title: '路线名称',
          key: 'name',
          align: 'center',
          width: 100,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                {
                  attrs: {
                    title: '飞行'
                  },
                  class: {
                    'iconfont': true,
                    'icon-feihang': true
                  },
                  style: {
                    padding: '5px',
                    fontWeight: 'bold'
                  },
                  on: {
                    click: () => {
                      console.log('点击了飞行：', params)
                      this.selectedRoute = params.row
                      this.travelFlyingRoute() // 飞行路线漫游
                    }
                  }
                }
              ),
              h(
                'span',
                {
                  attrs: {
                    title: '编辑'
                  },
                  class: {
                    'iconfont': true,
                    'icon-edit2': true
                  },
                  style: {
                    padding: '5px',
                    fontWeight: 'bold'
                  },
                  on: {
                    click: () => {
                      console.log('点击了编辑：', params)
                      this.selectedRoute = params.row
                      this.goToRouteEdit(false) // 飞行路线漫游
                    }
                  }
                }
              ),
              h(
                'span',
                {
                  attrs: {
                    title: '删除'
                  },
                  class: {
                    'iconfont': true,
                    'icon-delete': true
                  },
                  style: {
                    padding: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('点击了删除：', params)
                      this.deleteFlyingRoute(params)
                    }
                  }
                }
              )
            ])
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      ready: ({ tdIndex }) => tdIndex.ready, // 三维地图是否加载完成的标识----
      mapMode: ({ tdIndex }) => tdIndex.mapMode, // 地图模式----
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter
    }),
    ...mapGetters('map3DApplyIX', ['isShowToolsPanel', 'toolsPanelActive']),
    geoMarker() {
      let geoMarker = { coordinate: {}, routeLength: 0, passedLength: 0 }
      if (this.flyingTrack) {
        geoMarker.coordinate = this.flyingTrack.geoLocation
        geoMarker.routeLength = this.flyingTrack.routeLength
        geoMarker.passedLength = this.flyingTrack.passedLength
      }
      return geoMarker
    }

  },
  watch: {
    subPage(newVal) { // 监听地图资源变化
      if (newVal === 'routeList') {
        this.selectedRoute = null // 清空之前选择的路线
      }
      if (newVal !== 'routeDetail') {
        this.flyingTrack && this.flyingTrack.clear()
      }
    },
    isShowToolsPanel(flag) {
      if (!flag) {
        this.flyingTrack && this.flyingTrack.clear() // 清空飞行绘制
        this.subPage = 'routeList'
      }
    },
    toolsPanelActive(newVal) {
      if (this.toolsPanelActive !== 'Flight') {
        this.flyingTrack && this.flyingTrack.clear() // 清空飞行绘制
        this.subPage = 'routeList'
      }
    }
  },
  beforeDestroy() {
    this.flyingTrack && this.flyingTrack.clear()
  },
  methods: {
    ...mapActions(['getAllFlights', 'deleteOneFilght']),
    goToRouteEdit(flag) { // 进入路线编辑页
      this.isAdd = flag
      this.subPage = 'routeEdit'
    },
    editToRouteList(param) { // 路线编辑返回到路线列表
      this.getFlights()
      // if (param && param.route) {
      // }
      this.subPage = 'routeList'
    },
    travelFlyingRoute() { // 飞行路线漫游
      if (this.selectedRoute && this.selectedRoute.coordinates) {
        let coordinates = this.selectedRoute.coordinates
        if (coordinates.length > 0) {
          let positions = transCoorinates.WSG84ArrToWorldPositions(this.$context, coordinates)
          this.flyingTrack = this.flyingTrack || new FlyingTrack(this.$context)
          this.flyingTrack.flyingRoute(positions, this.selectedRoute) // 飞行漫游
        }
        this.detailPrePage = this.subPage
        this.subPage = 'routeDetail'
      }
    },
    goBack() { // 返回上一步
      if (this.subPage === 'routeEdit') {
        this.editToRouteList()
      } else if (this.subPage === 'routeDetail') { // 飞行路线详情
        this.isAdd = false
        this.subPage = this.detailPrePage
      }
      this.resetTravelFlying() // 重置飞行
    },
    resetTravelFlying() { // 重置飞行
      let clock = this.$context.viewer.clock
      clock.shouldAnimate = true
      if (clock.currentTime.secondsOfDay >= clock.stopTime.secondsOfDay) {
        clock.currentTime = clock.startTime
      }
    },
    routeEditDataChange(data) { // 路线数据改变
      this.selectedRoute = data.route
      this.drawRouteTrack() // 绘制飞行路线
    },
    drawRouteTrack() { // 重绘飞行路线
      if (this.selectedRoute && this.selectedRoute.coordinates) {
        this.flyingTrack && this.flyingTrack.clear()
        if (this.selectedRoute.coordinates.length > 0) {
          let positions = transCoorinates.WSG84ArrToWorldPositions(this.$context, this.selectedRoute.coordinates)
          this.flyingTrack = this.flyingTrack || new FlyingTrack(this.$context)
          this.flyingTrack.drawFlyingTrack(positions)
        }
      }
    },
    deleteFlyingRoute(param) { // 删除飞行路线
      console.log(param)
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除该路线吗？</p>',
        onOk: () => {
          this.deleteOneFilght(param.row._id)
            .then(res => {
              this.getFlights()
              this.$Notice.success({
                title: '删除路线成功！',
                desc: ''
              })
            })
            .catch(err => {
              console.log(err.response)
              this.$Notice.error({
                title: '删除路线失败！',
                desc: err.response.data.message
              })
            })
        }
      })
    },
    getFlights() {
      this.getAllFlights().then(res => {
        this.routes = res
      }).catch(err => {
        this.errorMsg(err.response.data.message)
      })
    }
  },
  mounted() {
    this.getFlights()
  }
}
</script>
<style scoped>
.flightContainer {
  width: 100%;
  height: 100%;
  background: #1b3153;
}
/* 标题样式 */
.flightTitle {
  background: #0f2343;
  padding: 0 16px;
  height: 38px;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.flightTitle span {
  height: 38px;
  line-height: 38px;
  float: left;
}
.flightTitle i {
  height: 38px;
  line-height: 38px;
  float: right;
  margin: 0 5px;
}
.flightContent {
  width: 100%;
  padding: 12px 24px;
  height: calc(100% - 24px);
}
</style>
