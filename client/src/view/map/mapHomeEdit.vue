<!--编辑模式 主页面-->
<template>
  <div class="MapComponent">
    <mapSetting v-if='mapSettingMol'/>
    <div v-if="mapLoading" class="mapLoading">
      电子地图加载中...
    </div>
    <mapConfig v-else-if="mapConfigList.length === 0"/>
    <div class="mapPositionLeftMain" v-else>
      <div v-if="mapConfigMol">
        <mapConfig></mapConfig>
      </div>
      <div class="mapPositionLeft" v-show='leftShow'>
        <Tabs value="mapOrganization" @on-click="tabClick">
          <TabPane label="机构设备" name="mapOrganization"></TabPane>
          <TabPane label="点位元素" name="mapPointElement"></TabPane>
        </Tabs>
        <div v-if="showType==='mapOrganization'" class="mapPositionLeftClass">
          <MapEdittree></MapEdittree>
        </div>
        <div v-if="showType==='mapPointElement'" class="mapPositionLeftClass">
          <mapPoint></mapPoint>
        </div>
      </div>
      <div class="mapPositionRight">
        <div id="leftHidden" :title="leftShow ? '收起左栏':'显示左栏'" class="mapSpread" @click="leftHidden">
          <p v-if="!leftShow">
            <Icon type="ios-arrow-right"></Icon>
          </p>
          <p v-if="leftShow">
            <Icon type="ios-arrow-left"></Icon>
          </p>
        </div>
        <div class="mapPosContent">
          <!-- 楼层外 -->
          <div v-if="isOuter" class="mapPositionCenter">
            <div class="mapPosHeader">
              <mapEditHeader></mapEditHeader>
            </div>
            <div v-if="flag" class="flagClss">
              <bs-map v-for="(item, index) in mapConfigList" :key="index" v-if="activeMap === item.mapId" :resolutions="item.resolutions" class="mapHome" :center="activeMapCenter || item.center" :extent="item.extent" ref="mapEditContainer" :updateSize="isUpdate" :zoom="1" @click="mapClickEvt" :showFullSrceen="true" :showRotate="true">
                <!-- geo -->
                <div v-if="item.mapType==='geoserver'">
                  <bs-wtmslayer :url="item.mapUrl" :layerName="item.layerName" :gridNames="item.gridSets" :matrixSet="item.matrixSet" :showOverView="true" :origin="item.origin"></bs-wtmslayer>
                </div>
                <!-- 超图 -->
                <div v-if="item.mapType==='iserver'">
                  <bs-supermaplayer :url="item.mapUrl" :showOverView="false"></bs-supermaplayer>
                </div>
                <!-- 静态底图模式 -->
                <div v-if="item.mapType==='static'">
                  <bs-staticlayer :url="item.mapUrl" :showOverView="true"></bs-staticlayer>
                </div>
                <bs-navigation></bs-navigation>
                <!-- <bs-compass></bs-compass> -->
                <bs-mapTypeSwitch></bs-mapTypeSwitch>
                <div v-if="item.mapType != 'static'">
                  <bs-zoombar sytle="color:#000000;"></bs-zoombar>
                </div>
                <!-- 区域绘制开始 -->
                <!-- 绘制区域 -->
                <bs-draw :id="mapArea.id" :name="mapArea.name" :type="mapArea.type" :actived="mapArea.actived" :drawStyle='mapArea.gridStyle' :layerStyle='mapArea.layerStyle' @drawend="addArea"></bs-draw>
                <!-- 网格图层 -->
                <bs-layer :ref="gridLayer.ref" :id="gridLayer.id" :name="gridLayer.name" :features="gridFeatures" :type="gridLayer.type" :zIndex="1"></bs-layer>
                <!-- 楼宇图层 -->
                <bs-layer :ref="buildLayer.ref" :id="buildLayer.id" :name="buildLayer.name" :features="buildFeatures" :type="buildLayer.type" :zIndex="2"></bs-layer>
                <!-- 临时编辑图层 -->
                <bs-layer ref="edit" :id="editLayer.id" :features="editFeatures" :name="editLayer.name" :type="editLayer.type" :zIndex="3"></bs-layer>
                <!--视频点位-->
                <bs-layer :id="sectorLayer.id" :name="sectorLayer.name" :features="sectorFeatures" :zIndex="4"></bs-layer>
                <bs-layer :id="vedioLayer.id" :name="vedioLayer.name" :features="videoIpcFeatures" :zIndex="5"></bs-layer>
                <bs-draw :id="videoIpc.id" :name="videoIpc.name" :type="videoIpc.type" :actived="editVedioDraw" :drawStyle='videoIpc.drawIpcStyle' @drawend="addVedioIpc"></bs-draw>
                <!-- 报警点位 -->
                <bs-layer :id="alarmLayer.id" :name="alarmLayer.name" :features="editAlarmFeatures" :zIndex="6"></bs-layer>
                <bs-draw :id="alarmIpc.id" :name="alarmIpc.name" :type="alarmIpc.type" :actived="editAlarmDraw" :drawStyle='alarmIpc.drawIpcStyle' @drawend="addAlarmIpc"></bs-draw>
                <!-- 巡更 -->
                <bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :features="editPatrolList" :zIndex="7"></bs-layer>
                <bs-draw :id="patrolIpc.id" :name="patrolIpc.name" :type="patrolIpc.type" :actived="editPatrolDraw " :drawStyle='patrolIpc.drawIpcStyle' @drawend="addPatrolIpc"></bs-draw>
                <!-- 编辑控件 -->
                <bs-edit :actived="editActive" :features="editControlFeature" @modifystart="modifyStart" @modifyend="modifyEnd"></bs-edit>
                <!-- 高亮图层 -->
                <bs-layer :id="positionLayer.id" :name="positionLayer.name" :features="hightLightFeatures" :zIndex="7"></bs-layer>
              </bs-map>
              <!-- 弹窗 -->
              <dragContainer v-if="editPageDetail" selectAreaClassName='mapAppVideoTittle' :position="{left: dragContainerPositionLeft, top: 0}">
                <mapEditInfoWindow></mapEditInfoWindow>
              </dragContainer>
            </div>
          </div>
          <!-- 楼层内 -->
          <div v-if="!isOuter" class="mapPositionCenter">
            <div class="mapFloorHeader">
              <div class="mapFloorBtn" @click="rebackOuter">返回</div>
            </div>
            <div class="mapFloorFooter ">
              <bs-map class="mapHome" :center="activeMapCenter || floorData.center" :extent="floorData.extent" ref="mapFloorContainer" :zoom="floorData.zoom" :updateSize="isUpdate" @zoom="mapZoomEvt" @click="mapClickEvt" :showFullSrceen="true">
                <!-- <bs-map class="mapHome " :isStaitic="true " :center="floorData.center " :extent="floorData.extent " ref="mapFloorContainer " :zoom="floorData.zoom " :minZoom="1 " :maxZoom="30 " :updateSize="isUpdate " @zoom="mapZoomEvt " @click="mapClickEvt " :showFullSrceen="true "> -->
                <bs-staticlayer :url="floorData.mapUrl" :extent="floorData.extent"></bs-staticlayer>
                <bs-layer :id="sectorLayer.id" :name="sectorLayer.name" :features="sectorFeatures" :zIndex="1"></bs-layer>
                <bs-layer :id="vedioLayer.id" :name="vedioLayer.name" :features="videoIpcFeatures" :zIndex="2"></bs-layer>
                <bs-draw :id="videoIpc.id" :name="videoIpc.name" :type="videoIpc.type" :actived="editVedioDraw" :drawStyle='videoIpc.drawIpcStyle' @drawend="addVedioIpc"></bs-draw>
                <!-- 报警点位 -->
                <bs-layer :id="alarmLayer.id" :name="alarmLayer.name" :features="editAlarmFeatures" :zIndex="3"></bs-layer>
                <bs-draw :id="alarmIpc.id" :name="alarmIpc.name" :type="alarmIpc.type" :actived="editAlarmDraw" :drawStyle='alarmIpc.drawIpcStyle' @drawend="addAlarmIpc"></bs-draw>
                <!-- 巡更 -->
                <bs-layer :id="patrolLayer.id" :name="patrolLayer.name" :features="editPatrolList" :zIndex="4"></bs-layer>
                <bs-draw :id="patrolIpc.id" :name="patrolIpc.name" :type="patrolIpc.type" :actived="editPatrolDraw" :drawStyle='patrolIpc.drawIpcStyle' @drawend="addPatrolIpc"></bs-draw>
                <bs-edit :actived="editActive" :features="editControlFeature" @modifystart="modifyStart" @modifyend="modifyEnd"></bs-edit>
                <!-- 高亮图层 -->
                <bs-layer :id="positionLayer.id" :name="positionLayer.name" :features="hightLightFeatures" :zIndex="7"></bs-layer>
                <!-- 弹框 -->
                <dragContainer v-if="editPageDetail" selectAreaClassName='mapAppVideoTittle' :position="{left: dragContainerPositionLeft, top: 0}">
                  <mapEditInfoWindow></mapEditInfoWindow>
                </dragContainer>
              </bs-map>
            </div>
          </div>
          <div v-if="mapEditRightPage && isShowRight" class="mapPosRight">
            <mapEditInfo></mapEditInfo>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import MapEdittree from './pages/edit/MapEdittree'
import mapPoint from './pages/mapPoint'
import mapEditInfo from './pages/mapEditInfo'
import mapEditHeader from './pages/edit/mapEditHeader'
import mapConfig from './pages/edit/mapConfig'
import mapSetting from './pages/edit/mapSetting'
import layerConfig from '../../assets/map/MapConfig.js'
import hightLight from '../../assets/map/edit/addhightLight.js'
import mapEditInfoWindow from './pages/mapEditInfoWindow'
import mapAlarm from './pages/edit/alarm/mapAlarm'
import mapVedioPoint from './pages/edit/vedioPoint/mapVedioPoint'
import mapArea from './pages/edit/area/mapArea'
import mapPatrilPoint from './pages/edit/patrol/mapPatrolPoint'
import dragContainer from 'components/drag/DragContainer.vue'
import { getExtent } from '../../assets/map/MapUtil.js'
export default {
  components: {
    mapPoint,
    MapEdittree,
    mapEditInfo,
    mapEditHeader,
    mapConfig,
    mapEditInfoWindow,
    mapSetting,
    dragContainer
  },
  mixins: [mapAlarm, mapVedioPoint, mapArea, mapPatrilPoint],
  data() {
    return {
      dragContainerPositionLeft: 0,
      mapLoading: true,
      leftShow: true, // left显示
      showType: 'mapOrganization',
      flag: true,
      activeMapCenter: null,
      isUpdate: false,
      mapArea: layerConfig.layers.areaDraw,
      gridLayer: layerConfig.layers.grid,
      gridFeatures: [], // 网格
      buildLayer: layerConfig.layers.building,
      buildFeatures: [], // 楼宇
      editLayer: layerConfig.layers.edit,
      editFeatures: [],
      vedioLayer: layerConfig.layers.videoIpc,
      videoIpcFeatures: [], // 视频点位图层的所有对象
      sectorLayer: layerConfig.layers.sector,
      sectorFeatures: [], // 可视域图层的所有对象
      videoIpc: layerConfig.layers.vedioDraw,
      alarmLayer: layerConfig.layers.alarmIpc,
      editAlarmFeatures: [],
      alarmIpc: layerConfig.layers.alarmDraw,
      patrolLayer: layerConfig.layers.patrolIpc,
      patrolIpc: layerConfig.layers.patrolDraw,
      positionLayer: layerConfig.layers.positionHighLightLayer,
      hightLightFeatures: [],
      editActive: false,
      editControlFeature: null, // 编辑控件
      posi: { lon: '', lat: '' },
      floorData: {
        center: [],
        extent: [],
        zoom: 16,
        mapUrl: ''
      },
      currentNode: null // 当前操作的节点
    }
  },
  computed: {
    ...mapState({
      // 编辑模式地图右侧页面详细
      mapEditRightPage: ({ mapPageState }) => mapPageState.mapEditRightPage.page,
      editVedioDraw: ({ mapVedioData }) => mapVedioData.editVedioDraw, // 添加点位绘制控件
      mapConfigMol: ({ mapPageState }) => mapPageState.mapConfigMol,
      addVedioNodeInfo: ({ mapGisData }) => mapGisData.addVedioNodeInfo, // 添加点位时的节点信息,
      mapConfigList: ({ mapGisData }) => mapGisData.mapConfigList, // 地图列表
      editCurrentVedioFeature: ({ mapGisData }) => mapGisData.editCurrentVedioFeature, // 当前编辑的视频对象数组
      modifyActive: ({ mapPageState }) => mapPageState.modifyActive, // 地图编辑点位位置的控件
      detail: ({ mapPageState }) => mapPageState.mapEditRightPage.detail,
      isOuter: ({ mapAreaData }) => mapAreaData.isOuter, // 楼层内还是楼层外
      levelData: ({ mapGisData }) => mapGisData.levelData, // 单个楼层信息
      activeMap: ({ mapGisData }) => mapGisData.activeMap, // 当前地图id
      editPageDetail: ({ mapAreaData }) => mapAreaData.editPageDetail,
      pointData: ({ mapGisData }) => mapGisData.pointData,
      editAlarmDraw: ({ mapAlarmData }) => mapAlarmData.editAlarmDraw,
      editAlarmList: ({ mapAlarmData }) => mapAlarmData.editAlarmList,
      editCurrentAlarm: ({ mapAlarmData }) => mapAlarmData.editCurrentAlarm,
      isTriggerClickEvt: ({ mapVedioData }) => mapVedioData.isTriggerClickEvt,
      editPatrolDraw: ({ patrolData }) => patrolData.editPatrolDraw,
      editPatrolList: ({ patrolData }) => patrolData.editPatrolList,
      editCurrentPatrol: ({ patrolData }) => patrolData.editCurrentPatrol,
      addAlarmInfo: ({ mapAlarmData }) => mapAlarmData.addAlarmInfo,
      addVedioInfo: ({ mapVedioData }) => mapVedioData.addVedioInfo,
      addPatrolInfo: ({ patrolData }) => patrolData.addPatrolInfo,
      editFloorZoom: ({ mapGisData }) => mapGisData.editFloorZoom,
      editIsOneLevel: ({ mapGisData }) => mapGisData.editIsOneLevel,
      hightLightList: ({ mapGisData }) => mapGisData.hightLightList,
      buildData: ({ mapGisData }) => mapGisData.buildData, // 单个楼宇信息
      mapSettingMol: ({ mapPageState }) => mapPageState.mapSettingMol,
      isDrawArea: ({ mapAreaData }) => mapAreaData.isDrawArea, // 区域绘制
      mapCenter: ({ mapGisData }) => mapGisData.activeMapCenter // 获取地图中心点重置设置的中心点--胡红勋-2018-06-28
    }),
    isShowRight() {
      // return (this.$BShasPower('BS-MAPHOMEEDIT-EDITGRIDISSHOW')
      //   || this.$BShasPower('BS-MAPHOMEEDIT-EDITBUILDISSHOW')
      //   || (this.$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && (this.mapEditRightPage === 'videoPage'))
      //   || (this.$BShasPower('BS-FIRE-ALARMIN') && (this.mapEditRightPage === 'alarmPage'))
      //   || (this.mapEditRightPage === 'centerEditPage'))
      let b1 = this.$BShasPower('BS-SETTING-RESOURCE-VIDEO-MANAGE') && this.mapEditRightPage === 'videoPage'
      let b2 = this.$BShasPower('BS-FIRE-ALARMIN') && this.mapEditRightPage === 'alarmPage'
      let b3 = this.$BShasPower('BS-MAPHOMEEDIT-EDITGRIDISSHOW') && this.mapEditRightPage === 'gridEditPage'
      let b4 = this.$BShasPower('BS-MAPHOMEEDIT-EDITBUILDISSHOW') && this.mapEditRightPage === 'floorEditPage'
      let b5 = this.$BShasPower('BS-MAPHOMEEDIT-EDITBUILDISSHOW') && this.mapEditRightPage === 'buildEditPage'
      let b6 = this.$BShasPower('BS-SETTING-POINT-MANAGE') && this.mapEditRightPage === 'patrolEditPage'
      return b1 || b2 || b3 || b4 || b5 || b6
    }
  },
  watch: {
    editPageDetail() {
      this.dragContainerPositionLeft = document.querySelector('.mapPositionCenter').offsetWidth - 600
    },
    mapEditRightPage(val) {
      this.isUpdate = this.mapEditRightPage && this.isShowRight
    },
    'mapCenter.time'(val) {
      if (this.mapCenter[this.activeMap] && this.mapCenter[this.activeMap].center) {
        this.activeMapCenter = this.mapCenter[this.activeMap].center
      }
    },
    hightLightList(val) {
      this.hightLightFeatures = JSON.parse(JSON.stringify(val))
    },
    editFloorZoom(val) {
      let level = JSON.parse(JSON.stringify(val))
      this.$refs.mapFloorContainer.setLevel(level)
    },
    // 添加点位时的节点信息
    addVedioNodeInfo(node) {
      if (node) {
        this.currentNode = JSON.parse(JSON.stringify(node))
        let loc = ''
        let id = ''
        if (node.point) {
          if (node.type === 'patrol') {
            loc = node.point.geo
            id = node._id
          } else {
            loc = node.point.loc
            id = node.point._id
          }
          let coods = loc.split(',')
          this.activeMapCenter = [parseFloat(coods[0]), parseFloat(coods[1])] // 视频点位居中
          // 当是点位的编辑页面时，清空高亮图层
          let hightLights = []
          if (this.mapEditRightPage === 'videoPage') {
            hightLights = []
          } else {
            hightLights = hightLight.addHightLightIcon(id, this.activeMapCenter)
          }
          this.$store.commit('SET_EDITHIGHTLIGHT_LIST', hightLights)
        }
      }
    },
    isTriggerClickEvt(flag) {
      // 当编辑模式节点的点击事件触发时
      this.isHideCurrentVedioSector()
      this.editCurrentVedioFeature && this.changeVedioState()
      this.editCurrentAlarm && this.changeAlarmState()
      this.editCurrentPatrol && this.changePatrolState()
      this.$store.commit('SET_MODIFYACTIVE_STATE', false) // 关闭编辑控件
      this.editControlFeature = null
      this.$store.commit('SET_AREA_ADD', false) // 关闭绘制区域的控件
      if (this.isOuter) {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示网格列表
      } else {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'floorEditPage', detail: 'show' }) // 隐藏点位编辑弹框，显示楼宇编辑页面
      }
      if (flag) {
        this.$store.commit('SET_ISTRIGGERCLICKEVT_STATE', false)
      }
    },
    // 地图编辑点位位置的控件
    modifyActive(active) {
      this.editActive = JSON.parse(JSON.stringify(active))
      if (!this.editActive) {
        this.editControlFeature = null
      }
    },
    detail(val) {
      if (val === 'show') {
        this.editActive = false
        this.editControlFeature = null
        this.editFeatures = []
      }
    },
    // 点击节点视频点位获取视频点位，居中
    pointData(val) {
      if (val.point) {
        let loc = val.point.loc
        let id = val.point._id
        // 当是点位的编辑页面时，清空高亮图层
        let hightLights = []
        if (this.mapEditRightPage === 'videoPage') {
          hightLights = []
        } else {
          hightLights = hightLight.addHightLightIcon(id, loc)
        }
        this.$store.commit('SET_EDITHIGHTLIGHT_LIST', hightLights)
      }
    },
    mapConfigList(val) {
      if (val.length >= 0) {
        this.mapLoading = false
      }
    },
    levelData(data) {
      this.activeMapCenter = null
      let val = JSON.parse(JSON.stringify(data))
      let levelCenter = val.bid.center.split(',').map(item => Number(item))
      let levelExtent = val.bid.scope.split(',').map(item => Number(item))
      let width = 200
      let height = 100
      if (val.picture.size) {
        width = val.picture.size.width
        height = val.picture.size.height
      }
      levelExtent = getExtent(levelExtent, [width, height])
      this.floorData.center = levelCenter
      this.floorData.extent = levelExtent
      this.floorData.mapUrl = '/api/upload?id=' + val.picture.id
      this.floorData.zoom = val.class
      let oneFloorResources = this.getFloorResources(val._id) // 获取当前楼层的所有视频资源
      let oneFloorCommon = this.getOneFloorCommonAlarm(val._id) // 获取当前楼层的所有普通报警
      let oneFloorPatrol = this.getOneFloorPatrolList(val._id) // 获取当前楼层的所有巡更点位
      let oneFloorAlarm = this.getOneFloorArarlList(val._id) // 获取当前楼层的所有报警
      Promise.all([oneFloorResources, oneFloorPatrol, oneFloorCommon, oneFloorAlarm])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    },
    isOuter(val) {
      this.clearVedioAndEditFeature()
      this.hightLightFeatures = []
      if (val) {
        if (this.buildData) {
          this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'buildEditPage', detail: 'edit' })
        } else {
          this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
        }
        this.$store.commit('SET_ISOUTER_STATE', true)
        // 加载当前地图上所有的视频、报警、巡更点位
        this.addCurrentMapAllIpc(this.activeMap)
      }
    },
    activeMap(val) {
      this.activeMapCenter = null
      this.getAllResource(val)
      if (this.isOuter) {
        this.clearVedioAndEditFeature()
        // 加载当前地图上所有的视频、报警、巡更点位
        this.addCurrentMapAllIpc(val)
        this.addVedioOrAlarmOrPatrol()
      }
    },
    // 电子底图配置页面
    mapConfigMol(val) {
      if (!val) {
        // this.getAllResource(this.activeMap)
      }
    }
  },
  methods: {
    ...mapActions([
      'getOneFloorCommonAlarm',
      'getFloorResources',
      'getOneFloorPatrolList',
      'getOneFloorArarlList',
      'getOneMapPoint',
      'getOneMapArarlList',
      'this.',
      'getAlarmOrg',
      'getMapServerList',
      'getResourceOrg',
      'getGrid',
      'getBuild',
      'getGridPaging',
      'getPatrolPoint',
      'getOneMapAllPatrolList',
      'getOneBuild',
      'getOneMapCommAlarm'
    ]),
    ...mapMutations([
      'SET_MAPCONFIGMOL_STATE',
      'SET_ISTRIGGERCLICKEVT_STATE', // 编辑模式节点的点击事件是否触发
      'SET_EDITRIGHTPAGE_STATE',
      'SET_ISOUTER_STATE', // 楼层内外控制
      'SET_EDITDETAIL_STATE',
      'SET_AREA_ADD',
      'SET_MODIFYACTIVE_STATE',
      'SET_EDITALARM_LIST',
      'SET_EDITALARMINMAP_LIST',
      'SET_EDITCURRENT_ALARM',
      'SET_PATROL_LIST',
      'SET_PATROLINMAP_LIST',
      'SET_CURRENT_PATROL',
      'SET_ADDALARM_INFO',
      'SET_ADDVEDIO_INFO',
      'SET_ADDPATROL_INFO',
      'SET_EDITCHECK_LIST',
      'SET_EDITALARM_CHECK',
      'SET_EDITPATROL_CHECK',
      'SET_EDITMAP_ZOOM',
      'SET_EDITHIGHTLIGHT_LIST'
    ]),
    // 点击节点进入楼层中定位点位
    addVedioOrAlarmOrPatrol() {
      // 点击节点加载已入库的报警点位
      let loc = null
      let id = null
      let hightLights = []
      if (this.addAlarmInfo) {
        this.addStoreAlarmIpc(this.addAlarmInfo)
        loc = this.addAlarmInfo.node.point.loc
        id = this.addAlarmInfo.node.point._id
        let coods = loc.split(',')
        if (coods.length > 2) {
          loc = coods[2] + ',' + coods[3]
        }
        hightLights = hightLight.addHightLightIcon(id, loc)
        this.$store.commit('SET_ADDALARM_INFO', null)
      }
      if (this.addVedioInfo) {
        this.addStorageVedioAndSector(this.addVedioInfo)
        loc = this.addVedioInfo.loc
        id = this.addVedioInfo._id
        hightLights = hightLight.addHightLightIcon(id, loc)
        this.$store.commit('SET_ADDVEDIO_INFO', null)
      }
      if (this.addPatrolInfo) {
        this.addStorePatrol(this.addPatrolInfo)
        loc = this.addPatrolInfo.coods
        id = this.addPatrolInfo.id
        hightLights = hightLight.addHightLightIcon(id, loc)
        this.$store.commit('SET_ADDPATROL_INFO', null)
      }
      this.$store.commit('SET_EDITHIGHTLIGHT_LIST', hightLights)
    },
    mapZoomEvt(obj) {
      if (obj.zoom) {
        console.log('地图缩放级别变化：', obj)
        this.$store.commit('SET_EDITMAP_ZOOM', obj.zoom)
      }
    },
    tabClick(e) {
      this.showType = e
    },
    leftHidden() {
      this.isUpdate = this.leftShow
      this.leftShow = !this.leftShow
    },
    // 地图点击事件
    mapClickEvt(obj) {
      // this.editCurrentVedioFeature && this.changeVedioState()
      // this.editCurrentAlarm && this.changeAlarmState()
      // this.editCurrentPatrol && this.changePatrolState()
      let feature = obj && obj.feature
      if (feature && !this.isDrawArea) {
        this.posi = { lon: null, lat: null }
        let coods = obj.center
        let attr = obj.attributes
        if (!attr) {
          return
        }
        if (obj.type !== 'Polygon') {
          this.$store.commit('SET_EDITDETAIL_STATE', '') // 关闭视频点位的录像回放弹框
          this.posi = { lon: coods[0], lat: coods[1] }
        }
        if (attr.type.indexOf('ipc') > -1) {
          // 获取点位信息
          this.selectVedio(obj)
        } else if (attr.type === 'patrol') {
          // 巡更点位编辑页面
          this.selectPatrol(obj)
        } else if (attr.type.indexOf('alarm') > -1) {
          this.selectAlarm(obj) // 点击报警元素
        }
      } else {
        return false
      }
    },
    modifyStart(coods) {
      this.vedioIpcModifyStart(coods)
    },
    modifyEnd(coods) {
      if (this.editCurrentVedioFeature) {
        this.vedioModifyEndEvt(coods)
      } else if (this.editCurrentAlarm) {
        this.alarmModifyEndEvt(coods)
      } else if (this.editCurrentPatrol) {
        this.patrolModifyEndEvt(coods)
      } else {
        this.areaModifyEndEvt(coods)
      }
    },
    // 清空视频点位以及编辑对象
    clearVedioAndEditFeature() {
      this.editControlFeature = null
      this.commitVediosAndSectors([], [])
      this.commitCurrentVedioAndSector(null, null)
      this.$store.commit('SET_EDITVEDIOSECTORINMAP_LIST', [])
      this.$store.commit('SET_EDITALARM_LIST', []) // 清理报警点位
      this.$store.commit('SET_EDITALARMINMAP_LIST', [])
      this.$store.commit('SET_EDITCURRENT_ALARM', null)
      this.$store.commit('SET_PATROL_LIST', []) // 清理巡更点位
      this.$store.commit('SET_PATROLINMAP_LIST', [])
      this.$store.commit('SET_CURRENT_PATROL', null)
      this.editFeature = null
    },
    // 返回楼层外
    rebackOuter() {
      this.getResourceOrg()
      this.getAlarmOrg()
      this.getPatrolPoint()
      this.clearVedioAndEditFeature()
      this.$store.commit('SET_ADDVEDIO_INFO', null)
      this.$store.commit('SET_ADDALARM_INFO', null)
      this.$store.commit('SET_ADDPATROL_INFO', null)
      this.$store.commit('SET_ISOUTER_STATE', true)
      if (this.mapEditRightPage === 'floorEditPage') {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'buildEditPage', detail: 'edit' })
        this.getOneBuild(this.buildData._id)
          .then(res => {
            this.getLevel(res._id)
              .then(res => {})
              .catch(err => {
                console.log(err)
              })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
      }
      this.activeMapCenter = null
    },
    getAllResource(val) {
      this.clearVedioIpcFromMap()
      this.clearPatrolFromMap()
      this.clearAlarmFromMap()
      let getAllGrid = this.getGrid(val)
      let getAllGridPaging = this.getGridPaging({ page: 1, id: val, name: '' })
      let getAllBuild = this.getBuild(val)
      let getAllRes = this.getResourceOrg()
      let getAllAlarmRes = this.getAlarmOrg()
      let getAllPatrol = this.getPatrolPoint()
      let getAllVedio = this.getOneMapPoint(val) // 获取当前地图所有的视频点位
      let getAllCommon = this.getOneMapCommAlarm(val)
      let getAllAlarm = this.getOneMapArarlList(val) // 获取当前地图所有的报警点位
      let getAllPatrollist = this.getOneMapAllPatrolList({ mapid: val }) // 获取当前地图所有的巡更点位
      Promise.all([
        getAllGrid,
        getAllBuild,
        getAllRes,
        getAllAlarmRes,
        getAllGridPaging,
        getAllPatrol,
        getAllVedio,
        getAllCommon,
        getAllAlarm,
        getAllPatrollist
      ])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
        .catch(err => {
          console.log(err)
        })
    },
    initPage() {
      this.getMapServerList()
        .then(ress => {
          if (ress.length > 0) {
            this.flag = true
            this.getAllResource(this.activeMap) // 初始化，添加默认地图的资源
            this.$store.commit('SET_MAPCONFIGMOL_STATE', false)
          } else {
            this.$store.commit('SET_MAPCONFIGMOL_STATE', true)
          }
        })
        .catch(errr => {
          console.log(errr)
          this.$store.commit('SET_MAPCONFIGMOL_STATE', true)
        })
      this.$store.commit('SET_EDITDETAIL_STATE', '')
    },
    addCurrentMapAllIpc(val) {
      // 加载当前地图上所有的视频、报警、巡更点位
      let getAllVedio = this.getOneMapPoint(val) // 获取当前地图所有的视频点位
      let getAllAlarm = this.getOneMapArarlList(val) // 获取当前地图所有的报警点位
      let getAllPatrol = this.getOneMapAllPatrolList({ mapid: val }) // 获取当前地图所有的巡更点位
      let getAllCommon = this.getOneMapCommAlarm(val)
      Promise.all([getAllVedio, getAllAlarm, getAllCommon, getAllPatrol])
        .then(res => {})
        .catch(err => {
          console.log(err)
        })
    }
    // // 监听地图配置右侧是否显示
    // showRightCharge(val) {
    //   console.log('监听地图配置右侧是否显示===>', val)
    // }
  },
  mounted() {
    this.$store.commit('SET_EDITRIGHTPAGE_STATE', { page: 'gridEditPage', detail: 'show' })
    this.$store.commit('SET_ISOUTER_STATE', true)
    this.initPage()
  },
  beforeDestroy() {
    this.$store.commit('SET_ACTIVE_MAP_CENTER', {}) // 将地图中心对像置空---胡红勋-201806-28
    this.$store.commit('SET_EDITCHECK_LIST', ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc'])
    this.$store.commit('SET_EDITALARM_CHECK', true)
    this.$store.commit('SET_EDITPATROL_CHECK', true)
    this.clearPatrolFromMap()
    this.$store.commit('SET_FLOORDATAS_NULL', [])
    this.$store.commit('SET_EDITDETAIL_STATE', '') // 关闭视频点位的录像回放弹框
  }
}
</script>
<style lang="less" scoped>
.MapComponent {
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}
.MapComponent .mapLoading {
  /* display: flex;
  flex: 1; */
  position: relative;
  color: white;
  text-align: center;
  vertical-align: center;
  padding-top: 25%;
}

.MapComponent .mapHome {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}
.MapComponent .mapPositionLeftMain {
  display: flex;
  flex: 1;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.MapComponent .mapPositionLeftMain .mapPositionLeft {
  display: flex;
  flex: 0 0 272px;
  background: #1c3053;
  flex-direction: column;
}
.MapComponent .mapPositionLeft .mapPositionLeftClass {
  display: flex;
  flex: 1;
  background: #1c3053;
  flex-direction: column;
}
.MapComponent .mapPositionRight {
  flex: 1;
  display: flex;
}

.MapComponent .mapPositionRight .mapPosHeader {
  height: 40px;
  width: 100%;
}

.mapPosContent {
  clear: both;
  position: relative;
  display: flex;
  flex: 1;
}

.mapPosContent .mapPositionCenter {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.MapComponent .mapPositionCenter .mapFloorHeader {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-align: center;
  background-color: #0f2343;
  cursor: default;
}

.MapComponent .mapPositionCenter .mapFloorHeader .mapFloorBtn {
  height: 40px;
  width: 60px;
  text-align: center;
  line-height: 40px;
  background-color: #1c3053;
}

.MapComponent .mapPositionCenter .mapFloorFooter {
  display: flex;
  flex: 1;
}

.MapComponent .mapPositionCenter .flagClss {
  position: relative;
  display: flex;
  flex: 1;
}

.MapComponent .mapPositionCenter .mapHome {
  flex: 1;
}

.MapComponent .mapPosContent .mapPosRight {
  flex: 0 0 300px;
  background: #1b3153;
  display: flex;
  /* margin-left: 16px; */
}

.mapEditTittle {
  width: 100%;
  height: 40px;
}

.mapEditTittle > ul {
  width: 100%;
  height: 40px;
  line-height: 36px;
  font-size: 14px;
  text-align: center;
  /* background: #1b3153; */
}

.mapEditTittle > ul li {
  width: 33.333%;
  float: left;
  cursor: pointer;
  height: 36px;
  background: #0f2343;
  border-right: 1px solid rgb(16, 27, 49);
  list-style: none;
}

.mapEditTittle > ul li:first-child {
  border-radius: 4px 0px 0px 4px;
}

.mapEditTittle > ul li:last-child {
  border-radius: 0px 4px 4px 0px;
}

.mapEditTittle > ul li.active {
  background: #1b3153;
}

.mapSpread {
  height: 85px;
  width: 16px;
  // margin-left: -1px;
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
.ol-popup {
  z-index: 4 !important;
}
</style>
