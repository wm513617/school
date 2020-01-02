<!--应用模式 主页面-->
<template>
  <div class="mapAppComponent">
    <div v-if="loading" class="mapLoading">
      电子地图加载中...
    </div>
    <div v-else-if="mapConfigList.length === 0" class="mapLoading">
      电子地图加载失败，请联系管理员...
    </div>
    <div style="display: flex; flex: 1; flex-direction: row;" v-else>
      <div class="mapPosition mapPositionLeft" v-if="leftShow">
        <div style="width:100%;height:40px;">
          <Tabs value="mapOrganization" @on-click="tabClick">
            <TabPane label="地图结构" name="mapOrganization"></TabPane>
            <TabPane label="点位元素" name="mapPointElement"></TabPane>
          </Tabs>
        </div>
        <div class="treeClass" v-show="$BShasPower('BS-MAP-APP-GRIDBUILD-ISSHOW') && (showType === 'mapOrganization')">
          <MapApplytree></MapApplytree>
        </div>
        <div class="treeClass" v-show="showType === 'mapPointElement'">
          <mapPoint></mapPoint>
        </div>
      </div>
      <div class="mapPosition mapPositionRight">
        <div id="leftHidden" :title="leftShow ? '收起左栏':'显示左栏'" class="mapSpread" @click="leftHidden">
          <p v-if="!leftShow">
            <Icon type="ios-arrow-right"></Icon>
          </p>
          <p v-if="leftShow">
            <Icon type="ios-arrow-left"></Icon>
          </p>
        </div>
        <div id="rightHidden" :title="rightShow ? '收起右栏':'显示右栏'" :class="rightShow ? 'mapSpreadRightShow' : 'mapSpreadRightHidden'" @click="rightHidden">
          <p v-if="!rightShow">
            <Icon type="ios-arrow-left"></Icon>
          </p>
          <p v-if="rightShow">
            <Icon type="ios-arrow-right"></Icon>
          </p>
        </div>
        <div v-if="isAppOuter" class="mapPositionCenter">
          <div class="mapPositionMain">
            <div class="mapPosHeader">
              <mapAppHeader></mapAppHeader>
            </div>
            <div v-if="appFlag" class="flagClss">
              <bs-map v-for="(item, index) in mapConfigList" :key="index" v-show="activeMap === item.mapId" class="mapHome" :center="activeMapCenter || item.center" :extent="item.extent" :zoom="1" ref="mapAppContainer" :updateSize="isUpdate" @zoom="mapZoomEvt" @ready="bsMapReady"  @mousemove="mouseMoveEvt" @click="selectFeatureEvt" @postcompose="alarmTwinkEvt" :resolutions="item.resolutions" :showFullSrceen="true" :showRotate="true">
                <!-- geo蓝星 -->
                <div v-if="item.mapType === 'geoserver'">
                  <bs-wtmslayer :url="item.mapUrl" :layerName="item.layerName" :gridNames="item.gridSets" :matrixSet="item.matrixSet" :showOverView="true" :origin="item.origin"></bs-wtmslayer>
                </div>
                <!-- 超图 -->
                <div v-if="item.mapType === 'iserver'">
                  <bs-supermaplayer :url="item.mapUrl" :showOverView="true"></bs-supermaplayer>
                </div>
                <!-- 静态底图模式 -->
                <div v-if="item.mapType === 'static'">
                  <bs-staticlayer :url="item.mapUrl" :showOverView="true"></bs-staticlayer>
                </div>
                <bs-navigation></bs-navigation>
                <bs-mapTypeSwitch></bs-mapTypeSwitch>
                <div v-if="item.mapType != 'static'">
                  <bs-zoombar sytle="color:#000000;"></bs-zoombar>
                </div>
                <!--测量控件-->
                <div v-if="isMeasureShow">
                  <bs-measure :id="measureLayer.id" :name="measureLayer.name" :type="measureLayer.type" :actived.sync="measureAvtiveState"></bs-measure>
                </div>
                <!-- 统计 -->
                <bs-draw :id="statistics.id" :name="statistics.name" :type="statistics.type" :actived="statistics.actived" :layerStyle="statistics.layerStyle" :drawStyle="statistics.drawStyle" @drawend="statisticsApp"></bs-draw>
                <bs-layer :ref="gridLayer.ref" :id="gridLayer.id" :name="gridLayer.name" :features="gridAppFeatures" :type="gridLayer.type" :zIndex="1"></bs-layer>
                <bs-layer :ref="buildLayer.ref" :id="buildLayer.id" :name="buildLayer.name" :features="buildAppFeatures" :type="buildLayer.type" :zIndex="2"></bs-layer>
                <!--视频点位-->
                <bs-layer :id="sectorLayer.id" :name="sectorLayer.name" :features="sectorFeatures" :zIndex="3"></bs-layer>
                <bs-layer :id="vedioLayer.id" :name="vedioLayer.name" :features="videoIpcFeatures" :zIndex="4"></bs-layer>
                <!-- 巡更 -->
                <bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :features="patrolFeatures" :zIndex="5"></bs-layer>
                <!--巡更连线(移动单兵连线)-->
                <bs-layer :id="patrollineLayer.id" :name="patrollineLayer.name" :features="patrollineFeatures" :zIndex="6"></bs-layer>
                <!-- 消防和普通报警点位 -->
                <bs-layer :id="alarmLayer.id" :name="alarmLayer.name" :features="aralmAppFeatures" :zIndex="7"></bs-layer>
                <!-- 移动单兵 -->
                <bs-layer :id="singleLayer.id" :name="singleLayer.name" :features="singleAppFeatures" :zIndex="8"></bs-layer>
                <!-- 报警图层 -->
                <bs-layer :id="alarmingLayer.id" :name="alarmingLayer.name" :features="aralmingAppFeatures" :zIndex="9"></bs-layer>
                <!-- 弹框 -->
                <div v-if="appPageDetail">
                  <bs-infowindow :position="posi">
                    <mapAppInfo></mapAppInfo>
                  </bs-infowindow>
                </div>
              </bs-map>
            </div>
          </div>
          <div class="mapPositionMainRight" v-if="rightShow">
            <mapRightInfo></mapRightInfo>
          </div>
        </div>
        <div v-if="!isAppOuter" class="mapPositionCenter">
          <div class="mapFloorCon">
            <div class="mapFloor">
              <div class="mapFloorHeader">
                <div class="mapFloorBtn" @click="rebackOuter">返回</div>
              </div>
              <div class="mapFloorFooter">
                <!-- <bs-map class="mapHome" :center="activeMapCenter || floorData.center" :extent="floorData.extent" :zoom="floorData.zoom" ref="mapFloorContainer"  :updateSize="isUpdate" :minZoom="0" :maxZoom="30" @mousemove="queryVedio" @click="selectFeatureEvt" @zoom="mapZoomEvt" @postcompose="alarmTwinkEvt" :showFullSrceen="true" :isStaitic="true">
                  <div v-if="floorData.mapUrl">
                    <bs-staticlayer :url="floorData.mapUrl" :extent="floorData.extent"></bs-staticlayer>
                  </div>
                  <bs-layer :id="sectorLayer.id" :name="sectorLayer.name" :features="sectorFeatures" :zIndex="1"></bs-layer>
                  <bs-layer :id="vedioLayer.id" :name="vedioLayer.name" :features="videoIpcFeatures" :zIndex="2"></bs-layer>
                  <bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :features="patrolFeatures" :zIndex="3"></bs-layer>
                  <bs-layer :id="alarmLayer.id" :name="alarmLayer.name" :features="aralmAppFeatures" :zIndex="4"></bs-layer>
                  <bs-layer :id="alarmingLayer.id" :name="alarmingLayer.name" :features="aralmingAppFeatures" :zIndex="9"></bs-layer>
                  <div v-if="appPageDetail">
                    <bs-infowindow :position="posi">
                      <mapAppInfo></mapAppInfo>
                    </bs-infowindow>
                  </div>
                </bs-map> -->
                <bs-staticmap class="mapHome" :url="floorData.mapUrl" :center="floorData.center" :extent="floorData.extent" ref="mapFloorContainer" :updateSize="isUpdate" @mousemove="queryVedio" @click="selectFeatureEvt" @zoom="mapZoomEvt" @postcompose="alarmTwinkEvt">
                  <bs-layer :id="sectorLayer.id" :name="sectorLayer.name" :features="sectorFeatures" :zIndex="1"></bs-layer>
                  <bs-layer :id="vedioLayer.id" :name="vedioLayer.name" :features="videoIpcFeatures" :zIndex="2"></bs-layer>
                  <bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :features="patrolFeatures" :zIndex="3"></bs-layer>
                  <bs-layer :id="alarmLayer.id" :name="alarmLayer.name" :features="aralmAppFeatures" :zIndex="4"></bs-layer>
                  <bs-layer :id="alarmingLayer.id" :name="alarmingLayer.name" :features="aralmingAppFeatures" :zIndex="9"></bs-layer>
                  <div v-if="appPageDetail">
                    <bs-infowindow :position="posi">
                      <mapAppInfo></mapAppInfo>
                    </bs-infowindow>
                  </div>
                </bs-staticmap>
              </div>
            </div>
            <div class="mapFloorDetail" v-if="rightShow">
              <mapFloorApp></mapFloorApp>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 统计弹框 -->
    <Modal v-model="statModal" :mask-closable="false" title="资源统计" width="600">
      <div class="statBody">
        <BSechart width="550px" height="360px" :options='statChartOptions'></BSechart>
      </div>
      <div slot="footer">
        <Button type="primary" @click="statModal = false">关闭</Button>
      </div>
    </Modal>
    <!-- 巡更报警查看详情页 -->
    <alarmModal @replyClick="replyMsg" @alarmSubmit="patrolAlarmSumbit" :data="msgInfo" :modalInfoIsShow.sync="alarmInfoShow"></alarmModal>
    <!-- 收发件人 -->
    <msgModal :modalType="modalType" :replyUser="replyUser" :modalIsShow.sync="msgModel"></msgModal>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import mapPoint from './pages/mapAppPoint' // 点位元素组件
import MapApplytree from './pages/apply/mapApplytree' // 应用模式左侧栏目树
import mapAppHeader from './pages/apply/mapAppHeader' //
import layerConfig from '../../assets/map/MapConfig.js'
import mapAppInfo from './pages/mapAppInfo'
import BSechart from '../../components/BSechart'
import mapFloorApp from './pages/apply/mapFloorApp'
import mapRightInfo from './pages/apply/mapRightInfo'
import appVedioPoint from './pages/apply/vedioPoint/appVedioPoint'
import appMapArea from './pages/apply/area/appMapArea'
import appMapPatrol from './pages/apply/patrol/appMapPatrol'
import appFireCommonAlarm from './pages/apply/alarm/appFireCommonAlarm'
import appMapAlarm from './pages/apply/alarm/appMapAlarm'
import appMoveSingle from './pages/apply/moveSingle/appMoveSingle'
import msgModal from '../keepwatch/common/msgModal'
import alarmModal from '../keepwatch/common/alarmInfo'
import { getExtent } from '../../assets/map/MapUtil.js'
import appAlarm from '../../assets/map/app/appAlarm'
export default {
  components: {
    mapPoint,
    MapApplytree,
    mapAppHeader,
    mapAppInfo,
    BSechart,
    mapFloorApp,
    mapRightInfo,
    msgModal,
    alarmModal
  },
  mixins: [appVedioPoint, appMapArea, appMapAlarm, appFireCommonAlarm, appMapPatrol, appMoveSingle],
  data() {
    return {
      mapMode: 'point',
      msgInfo: null, // 巡更报警查看详情页
      alarmInfoShow: false,
      loading: true, // 地图加载状态
      leftShow: true, // left显示
      rightShow: true,
      showType: 'mapOrganization',
      appFlag: false, // 地图是否显示
      activeMapCenter: null, // 中心点
      isUpdate: false, // 更新地图大小
      measureLayer: layerConfig.layers.measure,
      isMeasureShow: false, // 测量控件
      measureAvtiveState: null, // 激活状态
      statistics: layerConfig.layers.statistic, // 统计
      gridLayer: layerConfig.layers.grid,
      gridAppFeatures: [], // 网格列表
      buildLayer: layerConfig.layers.building, //
      buildAppFeatures: [], // 楼宇列表
      vedioLayer: layerConfig.layers.videoIpc,
      videoIpcFeatures: [], // 视频点位数组,
      sectorLayer: layerConfig.layers.sector,
      sectorFeatures: [], // 点位可视域数组
      patrolLayer: layerConfig.layers.patrolIpc, // 巡更点位图层
      patrolFeatures: [], // 巡更点位图层的所有对象
      patrollineLayer: layerConfig.layers.patrolline, // 巡更连线图层
      patrollineFeatures: [], // 巡更点位连线对象
      alarmLayer: layerConfig.layers.alarmIpc, // 消防/普通报警图层
      aralmAppFeatures: [], // 报警区域列表
      alarmingLayer: layerConfig.layers.alarming, // 报警闪烁图层
      aralmingAppFeatures: [], // 正在报警的点位列表
      singleLayer: layerConfig.layers.singleIpc,
      singleAppFeatures: [],
      // 巡更点位闪烁
      patrolIconArr: [
        {
          id: '',
          posi: {
            lon: null,
            lat: null
          }
        }
      ],
      posi: { lon: null, lat: null }, // 底图或楼层中弹框位置
      floorData: {
        center: [],
        extent: [],
        zoom: 2,
        mapUrl: ''
      },
      statModal: false, // 统计弹框显隐状态
      statChartOptions: null, // 统计图
      modalType: 1,
      replyUser: {
        realName: '',
        userId: ''
      },
      msgModel: false,
      currentZoom: 2,
      alarmSymbolType: {
        commonAlarm: 'alarmPointAlarmSymbol',
        fireAlarm: 'fireAlarmPointAlarmSymbol',
        patrol_alarm: 'patrolAlarmSymbol'
      }
    }
  },
  computed: {
    ...mapState({
      activeMap: ({ mapGisData }) => mapGisData.activeMap,
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList,
      appPageDetail: ({ mapAreaData }) => mapAreaData.appPageDetail,
      sendMessageModel: ({ mapAreaData }) => mapAreaData.sendMessageModel, // 消息发送窗体
      appPageRight: ({ mapPageState }) => mapPageState.appPageRight,
      appRapidPosition: ({ mapGisData }) => mapGisData.appRapidPosition,
      measureActive: ({ mapGisData }) => mapGisData.measureActive,
      isStatic: ({ mapPageState }) => mapPageState.isStatic, // 触发统计,
      levelData: ({ mapGisData }) => mapGisData.levelData,
      isMeasure: ({ mapPageState }) => mapPageState.isMeasure, // 是否显示测距图层
      // floorDatas: ({ mapGisData }) => mapGisData.floorDatas, // 胡红勋添加
      floorId: ({ mapGisData }) => mapGisData.floorId, // 胡红勋添加
      alarmInData: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmCheck, // 单个报警源信息
      appPatrolDtailScan: ({ mapPageState }) => mapPageState.appPatrolDtailScan,
      fireAlarmList: ({ mapAlarmData }) => mapAlarmData.fireAlarmList,
      onePartrolData: ({ patrolData }) => patrolData.onePartrol // 单个巡更点位
    })
  },
  watch: {
    // 是否点击巡更消息中的查看
    appPatrolDtailScan(val) {
      if (val) {
        this.rightShow = false
      }
    },
    // 接收到报警信息
    alarmInData(val) {
      if (val.type === 'patrolAlarm' || val.type === 'singleAlarm') {
        this.alarmInfoShow = true
        console.log(val)
        if (val.type === 'patrolAlarm') {
          this.msgInfo = {
            photo: val.param[0].message.photo,
            sender: val.param[0].message.sender,
            position: val.param[0].message.position,
            creatAt: val.param[0].message.createdAt,
            title: val.param[0].message.title,
            content: val.param[0].message.content,
            moment: val.param[0].message.moment,
            senderId: val.divId,
            id: val.param[0]._id
          }
        } else {
          this.msgInfo = {
            sender: val.param[0].user.realname,
            position: val.param[0].user.position,
            photo: val.param[0].user.photo,
            creatAt: val.param[0].time,
            moment: val.param[0].message.moment,
            title: val.param[0].title || '',
            content: val.param[0].content || '',
            senderId: val.param[0].user._id,
            id: val.param[0].user._id
          }
        }
      }
    },
    // 消防点位的快速定位功能
    appRapidPosition(val) {
      if (val) {
        this.activeMapCenter = [parseFloat(val.lon), parseFloat(val.lat)]
        this.posi = val
      }
    },
    levelData(val) {
      if (val) {
        let width = 200
        let height = 100
        let layer = JSON.parse(JSON.stringify(val))
        if (layer.picture.size) {
          width = layer.picture.size.width
          height = layer.picture.size.height
        }
        this.floorData.center = layer.bid.center.split(',').map(item => Number(item))
        this.floorData.zoom = layer.class
        let floorextent = layer.bid.scope.split(',').map(item => Number(item))
        let levelExtent = getExtent(floorextent, [width, height])
        this.floorData.extent = levelExtent
        this.floorData.mapUrl = '/api/upload?id=' + layer.picture.id
        let alarmingList = JSON.parse(JSON.stringify(this.fireAlarmList))
        // console.log(alarmingList)
        // console.log(val)
        let alarmingFea = []
        if (alarmingList.length) {
          alarmingList.forEach(item => {
            if (item.param[0].point && !item.param[0].point.isouter && item.param[0].point.sid === val._id) {
              let fea = appAlarm.addAlarmingFea(item.param[0], this.alarmSymbolType[item.param[0].type])
              alarmingFea.push(fea)
            }
          })
          this.$nextTick(() => {
            this.setAppAlarmingList(alarmingFea)
            this.setAppFloorAlarmingList(alarmingFea)
            this.$refs.mapFloorContainer && this.$refs.mapFloorContainer.render()
          })
        }
      }
    },
    // 右侧伸缩栏
    appPageRight(val) {
      if (!val) {
        this.rightShow = false
      } else {
        this.rightShow = true
      }
      this.isUpdate = this.rightShow
    },
    activeMap(val) {
      this.activeMapCenter = null
      this.getAllResource(val)
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    // 是否显示测距图层
    isMeasure(val) {
      this.isMeasureShow = JSON.parse(JSON.stringify(val))
    },
    measureAvtiveState(val) {
      if (!val) {
        this.$store.commit('SET_MEASURE_ACTIVE', false) // 先关闭测距工具
      }
    },
    measureActive(val) {
      this.measureAvtiveState = JSON.parse(JSON.stringify(val))
    },
    mapConfigList(val) {
      if (val.length > 0) {
        this.loading = false
      }
    },
    // 消息窗体
    sendMessageModel(val) {
      if (val) {
        this.msgModel = JSON.parse(JSON.stringify(val))
      }
    },
    msgModel(val) {
      if (!val) {
        this.$store.commit('SET_SENDMESSAGE_STATE', val)
      }
    },
    onePartrolData(val) {
      this.posi = { lon: parseFloat(val.point.geo.split(',')[0]), lat: parseFloat(val.point.geo.split(',')[1]) }
    }
    // appPageDetail(val){
    //   console.log(val)
    // }
  },
  methods: {
    ...mapActions([
      'getOneBuild',
      'getMessageById',
      'mapReceiveWarnning',
      'getMapServerList',
      'getMapOrgTree',
      'getOneMapPoint',
      'listenDevOnline',
      'closeMapWranWebsocket',
      'getOneMapBuild',
      'setAppAlarmingList',
      'setAppFloorAlarmingList'
    ]),
    ...mapMutations([
      'SET_SENDMESSAGE_STATE',
      'SET_APPDETAIL_STATE',
      'SET_ISAPPOUTER_STATE',
      'SET_MAPSTATIC_STATE',
      'SET_MAPMEASURE_STATE',
      'SET_MAPZOOM_NUMBER',
      'SET_PATROLCONVER_DATA',
      'SET_APPALARM_TYPE',
      'SET_APPCHECK_LIST',
      'SET_APPPATROL_CHECK',
      'SET_APPCOMMONALARM_CHECK',
      'SET_APPALARM_CHECK',
      'SET_MEASURE_ACTIVE'
    ]),
    // 巡更报警查看页面中回复按钮的事件
    replyMsg(data) {
      this.modalType = 2
      this.replyUser.realName = data.sender
      this.replyUser.userId = data.senderId
      this.msgModel = true
    },
    // 巡更报警查看页面中确认报警按钮的事件
    patrolAlarmSumbit(data) {
      this.processAlarmingInfo(data.id)
      this.alarmInfoShow = false
      this.$store.commit('SET_ONEMAPALARM_DATA', JSON.parse(JSON.stringify(this.alarmInData.index)))
    },
    // center转换
    centerTurn(val) {
      const coods = val.center.split(',')
      this.activeMapCenter = [parseFloat(coods[0]), parseFloat(coods[1])]
      this.posi = { lon: parseFloat(coods[0]), lat: parseFloat(coods[1]) }
    },
    // 地图缩放级别变化时，视频点位显示或隐藏
    mapZoomEvt(obj) {
      if (obj.zoom) {
        console.log('地图缩放级别变化：', obj)
        this.currentZoom = obj.zoom
        this.$store.commit('SET_MAPZOOM_NUMBER', obj.zoom)
        this.controlVedioShowByZoom(obj.zoom)
      }
    },
    bsMapReady(param) { // 地图加载完成
      let zoom = param.map.getView().getZoom()
      this.currentZoom = zoom
      this.$store.commit('SET_MAPZOOM_NUMBER', zoom)
      this.controlVedioShowByZoom(zoom)
    },
    mouseMoveEvt(obj) {
      this.queryBuilding(obj)
      this.queryVedio(obj)
    },
    getAllResource(val) {
      let getAllPoint = this.getOneMapPoint(val)
      let getAllOrg = this.getMapOrgTree(val)
      Promise.all([getAllPoint, getAllOrg])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    selectFeatureEvt(obj) {
      if (this.isStatic || this.measureActive) {
        return
      }
      // console.log('点击选择', obj)
      // this.$store.commit('SET_APPDETAIL_STATE', '')
      let feature = obj && obj.feature
      if (feature) {
        this.posi = { lon: obj.lon, lat: obj.lat }
        let coods = obj.center
        let attr = obj.attributes
        if (!attr) {
          return
        }
        let id = attr.id
        let _id = attr._id
        if (obj.type !== 'Polygon') {
          this.posi = { lon: coods[0], lat: coods[1] }
        }
        if (attr.type.indexOf('ipc') > -1) {
          // 获取点位信息
          this.selectVdeio(id)
        } else if (attr.type === 'gridApp') {
          this.selectGridEvt(id)
        } else if (attr.type === 'buildApp') {
          this.selectBuildEvt(id)
        } else if (attr.type === 'patrol' || attr.type === 'patrol_alarm') {
          // 巡更点位编辑页面
          this.selectPatrolEvt(id)
        } else if (attr.type === 'moveSingle') {
          this.selectMobileSingleEvt(id)
        } else if (attr.type.indexOf('alarm') > -1 || attr.type === 'commonAlarm' || attr.type === 'fireAlarm') {
          if (_id) {
            this.selectAlarmEvt(attr, _id)
          } else {
            // let id = attr.param.channelId
            this.selectAlarmEvt(attr, attr.param.channelId)
          }
        } else if (attr.type === 'patrolConver') {
          this.selectPatrolConver(obj.attributes)
        } else {
          // this.$store.commit('SET_APPDETAIL_STATE', '')
          // this.posi = { lon: null, lat: null }
        }
      } else {
        return false
      }
    },
    selectPatrolConver(val) {
      this.$store.commit('SET_APPDETAIL_STATE', 'patrolConver')
      this.$store.commit('SET_PATROLCONVER_DATA', val)
      this.getOneBuild(val.bid)
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    // tab点击
    tabClick(e) {
      this.showType = e
    },
    // 左侧显示隐藏
    leftHidden() {
      this.leftShow = !this.leftShow
      this.isUpdate = !this.isUpdate
    },
    // 右侧显示隐藏
    rightHidden() {
      if (!this.rightShow && this.appPageRight === '') {
        this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'patrolList')
      }
      this.rightShow = !this.rightShow
      this.isUpdate = !this.isUpdate
    },
    // 返回
    rebackOuter() {
      this.$store.commit('SET_ISAPPOUTER_STATE', true)
      // this.showType = 'mapOrganization'
    }
  },
  created() {
    this.closeMapWranWebsocket()
    this.getMapServerList()
      .then(res => {
        this.appFlag = true
        this.getAllResource(this.activeMap)
        // 显示所有楼宇
        this.getOneMapBuild(this.activeMap)
          .then(res => {})
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log('地图信息获取失败，请联系管理员', err)
      })
  },
  mounted() {
    this.listenDevOnline()
    this.mapReceiveWarnning() // 接收消防报警消息推送
    this.$store.commit('SET_ISAPPOUTER_STATE', true)
  },
  beforeDestroy() {
    this.closeMapWranWebsocket()
    this.$store.commit('SET_APPALARMING_LIST', [])
    this.$store.commit('SET_APPDETAIL_STATE', '') // 气泡弹框回复初始化
    this.$store.commit('SET_APPALARM_TYPE', 'all')
    this.$store.commit('SET_APPCHECK_LIST', ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc'])
    this.$store.commit('SET_APPPATROL_CHECK', false)
    this.$store.commit('SET_APPCOMMONALARM_CHECK', false)
    this.$store.commit('SET_APPALARM_CHECK', false)
    this.$store.commit('GET_MAPORG_TREE', [])
    this.measureAvtiveState = JSON.parse(JSON.stringify(this.measureActive))
  }
}
</script>
<style scoped>
.mapAppComponent {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.mapAppComponent .mapLoading {
  position: relative;
  color: white;
  text-align: center;
  vertical-align: center;
  padding-top: 25%;
}
.mapAppComponent .mapHome {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.mapAppComponent .mapPositionLeft {
  background: #1c3053;
  display: flex;
  flex-direction: column;
  width: 272px;
  /* margin-right: 16px; */
}
.mapAppComponent .mapPositionLeft .treeClass {
  display: flex;
  flex: 1;
  margin-top: 8px;
}
.mapPositionRight {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.mapPositionRight .mapPosHeader {
  height: 40px;
}

.mapPositionRight .mapHome {
  flex: 1;
}

.mapAppComponent .mapPositionCenter {
  flex: 1;
  display: flex;
  flex-direction: row;
  clear: both;
}
.mapPositionCenter .mapPositionMain {
  flex: 1;
  display: flex;
  flex-direction: column;
  clear: both;
}
.mapPositionCenter .mapPositionMainRight {
  display: flex;
  flex-direction: column;
  clear: both;
  width: 300px;
  /* margin-left: 16px; */
}
.mapAppComponent .mapPositionCenter .mapFloorCon {
  flex: 1;
  display: flex;
  flex-direction: row;
  clear: both;
}
.mapAppComponent .mapPositionCenter .mapFloor {
  display: flex;
  flex: 1;
  float: left;
  height: 100%;
  flex-direction: column;
}
.mapAppComponent .mapPositionCenter .mapFloorDetail {
  float: left;
  width: 300px;
  height: 100%;
  background-color: #0f2343;
}
.mapAppComponent .mapPositionCenter .mapFloor .mapFloorHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
}
.mapAppComponent .mapPositionCenter .mapFloor .mapFloorHeader .mapFloorBtn {
  height: 40px;
  width: 60px;
  text-align: center;
  line-height: 40px;
  background-color: #1c3053;
}
.mapAppComponent .mapPositionCenter .mapFloor .mapFloorFooter {
  display: flex;
  flex: 1;
}

.mapAppComponent .mapPositionCenter .flagClss {
  display: flex;
  flex: 1;
}
.mapSpread {
  height: 85px;
  width: 16px;
  /* margin-left: -1px; */
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
.mapSpread p {
  margin-left: -11px;
}
.mapSpreadRightShow {
  height: 85px;
  width: 16px;
  cursor: pointer;
  z-index: 1000;
  position: absolute;
  display: block;
  top: 40%;
  right: 300px;
  border: 16px solid transparent;
  border-right: 16px solid #0f2343;
  color: #fff;
  line-height: 53px;
  font-size: 20px;
}
.mapSpreadRightShow p {
  margin-left: 5px;
}
.mapSpreadRightHidden {
  height: 85px;
  width: 16px;
  margin-right: -1px;
  cursor: pointer;
  z-index: 1000;
  position: absolute;
  display: block;
  top: 40%;
  right: 0px;
  border: 16px solid transparent;
  border-right: 16px solid #0f2343;
  color: #fff;
  line-height: 53px;
  font-size: 20px;
}
.mapSpreadRightHidden p {
  margin-left: 5px;
}
/* .icon-video-gun2::before {

} */
@-webkit-keyframes twinkling {
  /*透明度由0到1*/
  0% {
    opacity: 0.1;
    /*透明度为0*/
  }
  100% {
    opacity: 1;
    /*透明度为1*/
  }
}
@keyframes twinkling {
  /*透明度由0到1*/
  0% {
    opacity: 0.1;
    /*透明度为0*/
  }
  100% {
    opacity: 1;
    /*透明度为1*/
  }
}
</style>
<style>
.ol-popup {
  z-index: 4 !important;
}
</style>
