<template>
  <div id="carCount" class="vehicle">
    <CarDetail ref="carDetail" :show.sync="detailModal" :value="carDetail"></CarDetail>
    <div class="bs-content">
      <div class="bs-left">
        <Menu theme="dark" @on-select="itemShow" :active-name="showItem" width="100%">
          <Menu-group title="智能研判">
            <Menu-item name="轨迹分析" v-if="trajectoryAnalyze">轨迹分析</Menu-item>
            <!--<Menu-item name="碰撞分析">碰撞分析</Menu-item>
            <Menu-item name="3">......</Menu-item>-->
          </Menu-group>
        </Menu>
      </div>
      <div class="bs-main ">
        <div class="car-background">
          <div class="car-handle">
            <div class="search-box">
              <Input @on-enter="searchCar" v-model="searchText" placeholder="请输入车牌号..." style="width: 250px">
              </Input>
              <div class="date-box">
                <Date-picker :value="startTime" type="date" @on-change="changeStartTime" :options="dateLimit" :clearable="false" :editable="false" placeholder='开始日期'></Date-picker>
                <span>至</span>
                <Date-picker :value="endTime" @on-change="changeEndTime" :options="dateLimit" :clearable="false" :editable="false" type='date' placeholder='结束日期'></Date-picker>
              </div>
              <Select style="width:250px;" placeholder="点击选择布控范围" ref="scopeSelect">
                <VTree ref='analyzeVTree' :treeData="treeData" :options="options" :isSaveState='false' style="margin-left: 20px;"></VTree>
                <!-- <Tree ref="devTree" @on-check-change="scopeSelect" :data="devList" show-checkbox style="margin-left: 20px;"></Tree> -->
              </Select>
              <Button type="ghost" @click="searchCar"><i class="ivu-icon ivu-icon-ios-search"></i>&nbsp;搜索</Button>
              <Button type="ghost" @click="clearSearch"><i class="ivu-icon iconfont icon-fuwei"></i>&nbsp;复位</Button>
            </div>
          </div>
        </div>
        <div class="car-list">
          <div class="bs-table-box analyze-table">
            <Table ref="carList" :height="tableHeight" size="small" :data="carList" @on-row-click="rowClick" :columns="tableColumns" :highlight-row="true"></Table>
            <div class="table-footer">
              <div style="float: right;">
                <Page show-sizer :page-size-opts="$PageInfo.size" @on-page-size-change="pageSizeChange" :page-size="pageInfo.limit" :show-total="true" :show-elevator="true" :total="pageInfo.count" :current="pageInfo.curPage" @on-change="changePage"></Page>
              </div>
            </div>
          </div>
        </div>
        <div class="car-locus">
          <div class="car-locus-map">
            <div style="height:100%;width:100%">
              <BSMap>
                <bs-layer :id="trackLayer.id" :name="trackLayer.name" :features="vehicleTrackFeatures" :zIndex="1"></bs-layer>
                <!-- <div v-for="(item, index) of trackPoints" :key="index">
                  <bs-infowindow :position="item.posi">
                    <div :id="item.id" class="patrolDiv"></div>
                  </bs-infowindow>
                </div> -->
              </BSMap>
            </div>
          </div>
          <div class="car-locus-time">
            <div class="car-locus-info">
              <img v-if="car.image" :src="'/api/upload?id='+car.image">
              <img v-else :src="img" />
              <div class="info">
                <div class="info-item">
                  <label for="">车牌号</label>
                  <span>{{car.licence}}</span>
                </div>
                <div class="info-item">
                  <label for="">品牌</label>
                  <span>{{car.brand}}{{'-'+car.model}}</span>
                </div>
                <div class="info-item">
                  <label for="">车辆颜色</label>
                  <span>{{car.colorName}}</span>
                </div>
                <div class="info-item">
                  <label for="">车辆类型</label>
                  <span>{{car.typeName}}</span>
                </div>
                <div class="info-item">
                  <label for="">所属分类</label>
                  <span>{{car.vehicleList}}</span>
                </div>
                <div class="info-item">
                  <label for="">布控类型</label>
                  <span>{{car.defenseType}}</span>
                </div>
              </div>
            </div>
            <div class="time-line-box">
              <bs-scroll ref="scroller">
                <div @on-expand="$refs.scroller.update()" class="line-box">
                  <div v-for="(date,index) in carPassList" :key="index">
                    <div>{{$moment.unix(Number(date.date)).format('YYYY-MM-DD')}}</div>
                    <div class="date-line">
                      <div class="item-line" v-for="(item,index) in date.timeCrossList" :key="index">
                        <div class="cur-cross" v-if="item.time===car.timeStamp">
                          <span class="text-top ">{{$moment.unix(Number(item.time)).format('HH:mm:ss')}}</span>
                          <span class="text-bottom">{{item.crossName}}</span>
                          <Icon type="record"></Icon>
                        </div>
                        <div v-else>
                          <span class="text-top "> {{$moment.unix(Number(item.time)).format('HH:mm:ss')}}</span>
                          <span class="text-bottom">{{item.crossName}}</span>
                          <Icon type="record"></Icon>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </bs-scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CarDetail from './common/carDetail.vue'
import moment from 'moment'
import img1 from 'src/assets/images/mbh.png'
import BSMap from 'src/components/common/BSMap'
import layerConfig from 'src/assets/map/MapConfig.js'
import { mapState, mapGetters, mapActions } from 'vuex'
import appCarTrack from 'src/assets/map/app/appCarTrack'
export default {
  components: {
    BSMap,
    CarDetail
  },
  data() {
    return {
      vehicleTrackFeatures: [], // 车辆轨迹数组
      trackLayer: layerConfig.layers.vehicleTrack, // 车辆轨迹图层
      dateLimit: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        }
      },
      detailModal: false,
      carDetail: null,
      img: img1,
      uploadImg: '',
      modal: false,
      carPassList: [],
      selectScope: [],
      selectScopeString: '',
      NoticeData: null,
      tableHeight: 332,
      searchText: '',
      showModalTabs: '模拟轨迹',
      licence: '',
      model: false,
      searchData: {},
      searchModal: false,
      showItem: '轨迹分析',
      data1: 10,
      data2: 14,
      tableColumns: [
        {
          title: '车牌号',
          key: 'licence',
          sortable: true
        },
        {
          title: '经过时间',
          key: 'timeStamp',
          align: 'center',
          render: (h, param) => {
            let timeStamp = param.row.timeStamp
            let text = timeStamp ? this.$moment.unix(Number(timeStamp)).format('YYYY-MM-DD HH:mm:ss') : ''
            return h('span', {}, text)
          }
        },
        {
          title: '路口',
          key: 'crossName'
        },
        {
          title: '车道',
          key: 'lane'
        },
        {
          title: '品牌',
          key: 'brand'
        },
        {
          title: '型号',
          key: 'model'
        },
        {
          title: '颜色',
          key: 'colorName',
          align: 'center'
        },
        {
          title: '行车方向',
          key: 'direction'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.showCarDetail(params)
                    }
                  }
                },
                '详情'
              )
            ])
          }
        }
      ],
      car: {
        licence: '',
        color: '',
        type: '',
        manageType: '',
        brand: '',
        model: '',
        dateRang: [],
        typeName: '',
        image: ''
      },
      endTime: moment().format('YYYY-MM-DD'),
      startTime: moment().format('YYYY-MM-DD'),
      searchStartTime: '',
      searchEndTime: '',
      // 检索范围参数
      options: {
        showCheckbox: true,
        showInput: true
      },
      treeData: [],
      carList: [],
      pageInfo: {
        curPage: 1,
        count: 0,
        pages: 0,
        limit: this.$PageInfo.limit
      },
      // 权限
      trajectoryAnalyze: true
    }
  },
  computed: {
    ...mapGetters(['vehicleRecognizerole']),
    ...mapState({
      carBase({ vehicle }) {
        return vehicle.carBase
      },
      videoOrg({ vehicle }) {
        return vehicle.videoOrg
      }
    })
  },
  created() {
    this.getVideoOrg()
      .then(() => {
        this.treeData = this.$lodash.cloneDeep(this.videoOrg)
      })
      .catch(err => {
        console.log('getVideoOrg error' + err)
      })
  },
  methods: {
    ...mapActions(['searchAnalyze', 'getVehicleidentify', 'searchAnalyzeInfo', 'queryPassCar', 'getVideoOrg']),
    searchCar() {
      let re = /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/
      if (this.searchText.length && this.searchText.search(re) === -1) {
        this.$Notice.error({ title: '请输入正确的车牌号' })
      } else {
        if (new Date(this.endTime) - new Date(this.startTime) < 0) {
          this.$Notice.warning({ title: '开始日期不能大于结束日期' })
        } else {
          let data = {
            licence: this.searchText,
            startTime: moment(this.startTime).format('X'),
            endTime: moment(this.endTime).format('X')
          }
          let videoChannels = this.$refs.analyzeVTree.getSelectedDeepChannelid() || ''
          this.queryPassCar({ data: data, videoChannels: videoChannels })
            .then(res => {
              this.carList = res.data
              this.pageInfo.count = Number(res.headers['x-bsc-count'])
              this.pageInfo.curPage = Number(res.headers['x-bsc-cur'])
              this.pageInfo.pages = Number(res.headers['x-bsc-pages'])
              this.searchStartTime = data.startTime
              this.searchEndTime = data.endTime
              this.$nextTick(() => {
                if (this.$refs['carList'].$el.querySelectorAll('.ivu-table-body .ivu-table-row').length) {
                  let list = this.$refs['carList'].$el.querySelectorAll('.ivu-table-body .ivu-table-row')
                  list[0].className = 'ivu-table-row ivu-table-row-highlight ivu-table-row-hover'
                }
              })
            })
            .catch(err => console.log('error:' + err))
        }
      }
    },
    clearSearch() {
      this.searchText = ''
      this.endTime = moment().format('YYYY-MM-DD')
      this.startTime = moment().format('YYYY-MM-DD')
      this.carList = []
      this.pageInfo = {
        curPage: 1,
        count: 0,
        pages: 1,
        limit: 10
      }
      this.treeData = this.$lodash.cloneDeep(this.videoOrg)
    },
    showCarDetail(data) {
      let carData = data.row
      let infoData = {
        licence: carData.licence,
        id: carData._id,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime
      }
      this.$Loading.start()
      this.searchAnalyzeInfo(infoData)
        .then(res => {
          this.carDetail = res.data
          this.detailModal = true
        })
        .catch(err => {
          this.$Loading.error()
          this.$notice.warning({
            title: err
          })
        })
    },
    itemShow(name) {
      this.showItem = name
    },
    getCarList() {
      let data = {
        licence: this.searchText,
        startTime: moment(this.startTime).format('X'),
        endTime: moment(this.endTime).format('X'),
        page: this.pageInfo.curPage,
        limit: this.pageInfo.limit
      }
      let videoChannels = this.$refs.analyzeVTree ? this.$refs.analyzeVTree.getSelectedDeepChannelid() : []
      this.queryPassCar({
        data: data,
        videoChannels: videoChannels
      }).then(res => {
        this.carList = res.data
        this.pageInfo.count = Number(res.headers['x-bsc-count'])
        this.pageInfo.curPage = Number(res.headers['x-bsc-cur'])
      })
    },
    changePage(n) {
      this.pageInfo.curPage = n
      this.getCarList()
    },
    pageSizeChange(n) {
      this.pageInfo.limit = n
      this.pageInfo.curPage = 1
      this.getCarList()
    },
    // 展示轨迹的方法
    rowClick(data) {
      let infoData = {
        licence: data.licence,
        id: data._id,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime
      }
      this.searchAnalyzeInfo(infoData)
        .then(res => {
          let data = res.data
          this.car = data
          let dateList = []
          let mapData = {
            current: null,
            list: []
          }
          mapData.current = data
          data.list.map(item => {
            let isHas = false
            let isDevHas = false
            if (dateList.length) {
              dateList.map(unit => {
                if (item.date === unit.date) {
                  isHas = true
                }
              })
            }
            if (!isHas) {
              dateList.push({
                date: item.date,
                timeCrossList: []
              })
            }
            if (mapData.list.length) {
              mapData.list.map(unit => {
                if (item.channelid === unit.channelid) {
                  isDevHas = true
                }
              })
            }
            if (!isDevHas) {
              mapData.list.push({
                point: item.point,
                channelid: item.channelid,
                crossName: item.crossName,
                timeList: []
              })
            }
          })
          mapData.list.map(item => {
            data.list.map(temp => {
              if (item.channelid === temp.channelid) {
                item.timeList.push(temp.timeStamp)
              }
            })
          })
          dateList.map(item => {
            data.list.map(temp => {
              if (item.date === temp.date) {
                item.timeCrossList.push({
                  time: temp.timeStamp,
                  crossName: temp.crossName
                })
              }
            })
          })
          this.carPassList = dateList
          this.addVehicleTrack(mapData)
        })
        .catch(err => console.log('error:' + err))
    },
    // 加载车辆轨迹
    addVehicleTrack(mapData) {
      let objFea = appCarTrack.drawCarTrack(mapData)
      this.vehicleTrackFeatures = objFea.features
    },
    // 地图上车辆轨迹过车时间提示
    // addVechicleTrackTimeInfo(points) {
    // let pointsInfoCol = []
    // points.forEach(element => {
    //   let coods = element.geom.points.split(',')
    //   let pointInfo = {
    //     id: element.attributes.id,
    //     posi: {
    //       lon: parseFloat(coods[0]),
    //       lat: parseFloat(coods[1])
    //     }
    //   }
    //   pointsInfoCol.push(pointInfo)
    // })
    // this.trackPoints = pointsInfoCol
    // },
    changeStartTime(date) {
      this.startTime = date
    },
    changeEndTime(date) {
      this.endTime = date
    },
    scopeSelect(data) {
      this.selectScope = []
      data.forEach(item => {
        if (!item.children) {
          this.selectScope.push(item.title)
        }
      })
      this.selectScopeString = this.selectScope.join(',')
    }
  }
}
</script>
<style lang="less" scoped>
#carCount {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.manage-menu {
  border-bottom: 1px solid #ccc;
}

.bs-main {
  display: flex;
  flex-direction: column;
  position: relative;
}

.car-list {
  flex: 0 0 387px;
}

.ivu-menu-item-active {
  background: #ececec;
}

.modal-footer {
  display: flex;
  text-align: right;
  padding-right: 30px;
}

.modal-footer button {
  width: 100px;
}

.modal-left {
  flex: 1;
}

.modal-right {
  flex: 1;
  justify-content: center;
}

.search-box {
  display: flex;
  align-items: center;
  .ivu-input-group {
    top: 0px;
  }
}

.search-box > button {
  margin-left: 10px;
}

.date-box {
  display: flex;
  padding: 0 10px;
  align-items: center;
  span {
    padding: 0 5px;
  }
}

.item-line {
  position: relative;
  height: 10px;
  width: 18%;
  background: #2d8cf0;
  float: left;
  margin: 25px 0;
}

.item-line:nth-child(5n + 1) {
  margin-left: 40px;
}

.item-line:first-of-type {
  .text-top,
  .text-bottom {
    left: -25px;
  }
}

.ivu-icon-record {
  color: #ff6600;
  position: absolute;
  left: 25px;
  font-size: 20px;
  top: -5px;
}

.text-top,
.text-bottom {
  position: absolute;
  width: 100px;
  left: -25px;
  text-align: center;
}

.text-top {
  top: -20px;
}

.text-bottom {
  bottom: -20px;
}

.date-line {
  overflow: hidden;
}

.time-line-box {
  width: 100%;
  margin-top: 10px;
  flex: 1;
  overflow: hidden;
}

.ivu-icon-search {
  font-size: 30px;
  color: deepskyblue;
  cursor: pointer;
}

.car-locus {
  flex: 1;
  overflow: auto;
  display: flex;
}

.car-locus-info {
  padding: 10px;
  flex: 0 0 150px;
  display: flex;
  .info-item {
    line-height: 40px;
    float: left;
    width: 50%;
  }

  .info-item label {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px;
  }
}

.car-locus-info img {
  width: 160px;
  height: 120px;
}

.car-locus-time,
.car-locus-map {
  flex: 1 auto;
  display: flex;
  flex-direction: column;
}

.car-locus-map {
  margin-right: 5px;
  background: #1c3053;
  width: 640px;
}

.car-locus-time {
  margin-left: 10px;
  padding: 10px 20px;
  padding-left: 0px;
  background: #1c3053;
}

.cur-cross span {
  color: red;
}
.car-background {
  background: #1b3153;
}
.car-handle {
  flex: 0 0 32px;
  margin: 12px 24px;
  align-items: center;
  justify-content: space-between;
}
</style>
