<script>
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import { RESOURCETYPE, MPSIGNKEY, DEFAULTOPS } from 'assets/2DMap/meta/common'
import Vue from 'vue'
import utils from 'assets/3DMap/utils/index.js'
import mapUtil from 'assets/3DMap/mapUtil.js'
import { GeometryType } from 'assets/3DMap/GeometryType.js'
import gridUtil from 'assets/3DMap/gridUtil.js'
import drawConfig from 'assets/2DMap/meta/draw'
import layerConfig from 'assets/2DMap/meta/layer'
import gridStyle from 'assets/3DMap/gridStyle'
import videoTrans from 'assets/2DMap/feature/edit/video'
import alarmTrans from 'assets/2DMap/feature/edit/alarm'
import styleConfig from 'assets/2DMap/meta/style'
import transAlarmHelp from 'assets/2DMap/feature/edit/alarmHelp'
import transPatrol from 'assets/2DMap/feature/edit/patrol'
import areaUtil from 'assets/2DMap/areaUtil'
import areaStyle from 'assets/2DMap/areaStyle'
import areaTrans from 'assets/2DMap/feature/edit/area'
import highLight from 'assets/2DMap/feature/edit/highLight'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import VideoLayer from './layer/video' // 视频要素逻辑
import alarm from './layer/alarm' // 报警要素逻辑
import alarmHelp from './layer/alarmHelp'// 报警求助要素逻辑
import grid from './layer/grid' // 网格要素逻辑
import patrol from './layer/patrol' // 巡更要素逻辑
export default {
  data() {
    return {
      dragContainerPositionLeft: 0,
      context: null, // 保存获取全局三维地图实例以及类库的变量----
      isFocusOn3DMap: true, // 鼠标焦点是否在3D视图上
      isClearTempDrawPositon: false, // 绘制三维点位的坐标位置时清除绘制的临时点
      isClearTempEditPositon: false, // 修改三维点位的坐标位置时清除绘制的临时点
      editFeature: null, // 保存要进行编辑的要素------
      floorOneData: {
        center: [],
        extent: [],
        mapUrl: ''
      },
      videoLayer: layerConfig.video, // 视频点位图层配置
      patrolLayer: layerConfig.patrol, // 巡更点图层配置
      commonAlarmLayer: layerConfig.commonAlarm, // 普通报警图层配置
      fireAlarm: layerConfig.fireAlarm, // 消防报警图层配置
      alarmHost: layerConfig.alarmHost, // 报警主机图层配置
      positionLayer: layerConfig.highLightLocateLayer, // 高亮定位图层配置
      alarmHelpLayer: layerConfig.alarmBox, // 报警求助图层配置
      gridLayer: layerConfig.grid, // 楼层内网格图层配置----
      editLayer: layerConfig.tempEditLayer, // 临时编辑要素的图层---
      pointDraw: JSON.parse(JSON.stringify(drawConfig.boltipc)), // 楼层平面地图绘制工具的相关配置
      lineStringDraw: JSON.parse(JSON.stringify(drawConfig.commonAlarmLine)), // 线绘制，默认是普通报警
      // areaDraw: JSON.parse(JSON.stringify(drawConfig.areaQuery)), // 线绘制，默认是普通报警
      gridConfig: {
        name: '网格',
        id: 'gridLayer',
        type: GeometryType.MULTIPOLYGON,
        actived: false,
        drawStyle: gridStyle.gridStartDrawStyle,
        layerStyle: gridStyle.gridDrawEndStyle
      }, // 楼层内网格绘制的控制---
      keyTypes: {},
      isDrawGridInter: false, // 绘制网格是否相交
      fireAlarmLayer: layerConfig.fireAlarm, // 消防点位图层配置
      alarmBoxLayer: layerConfig.alarmBox, // 报警求助图层配
      alarmColumnLayer: layerConfig.alarmColumn
    }
  },
  computed: {
    ...mapState({
      mapMode: ({ tdIndex }) => tdIndex.mapMode,
      floorData: ({ tdFloor }) => tdFloor.floorData,
      map3DConfig: ({ tdIndex }) => tdIndex.map3DConfig, // 地图配置-----
      is3DMapOuter: ({ tdIndex }) => tdIndex.is3DMapOuter, // 楼层平面图和三维地图切换的标识-----
      active3DDraw: ({ tdIndex }) => tdIndex.active3DDraw, // 控制三维绘制工具的启动绘制三维点位-----
      ready: ({ tdIndex }) => tdIndex.ready, // 判断三维地图是否加载成功的标识-----
      active3DChangePositionDraw: ({ tdIndex }) => tdIndex.active3DChangePositionDraw, // 控制三维绘制工具的启动以便修改模型的位置
      active2DDraw: ({ tdIndex }) => tdIndex.active2DDraw, // 控制楼层平面地图绘制工具的启动绘制二维点位--
      active2DEdit: ({ tdIndex }) => tdIndex.active2DEdit, // 控制楼层平面地图编辑工具的启动编辑二维点位---
      videoFeatureList: ({ tdPoint }) => tdPoint.videoFeatureList, // 普通视频点位
      fireAlarmFeatureList: ({ tdPoint }) => tdPoint.fireAlarmFeatureList, // 消防报警点位
      alarmHelpFeatureList: ({ tdPoint }) => tdPoint.alarmHelpFeatureList, // 报警求助点位
      patrolFeatureList: ({ tdPoint }) => tdPoint.patrolFeatureList, // 巡更点位
      alarmFeatureList: ({ tdPoint }) => tdPoint.alarmFeatureList, // 普通报警点位
      highLightFeatureList: ({ tdPoint }) => tdPoint.highLightFeatureList, // 高亮定位点位
      gridFeatureList: ({ tdPoint }) => tdPoint.gridFeatureList, // 网格列表要素
      polygonFeatureList: ({ tdPoint }) => tdPoint.polygonFeatureList, // 区域列表要素
      gridLabelFeatureList: ({ tdPoint }) => tdPoint.gridLabelFeatureList, // 网格名称要素
      treeNodeType: ({ tdPoint }) => tdPoint.treeNodeType, // 树节点类型
      mapResource: ({ tdPoint }) => tdPoint.mapResource, // 地图资源，包括通道资源，巡更资源
      rightPanelShow: ({ tdIndex }) => tdIndex.rightPanelShow,
      rightPanelType: ({ tdIndex }) => tdIndex.rightPanelType,
      mapConfigModal: ({ tdIndex }) => tdIndex.mapConfigModal,
      active2DGridDraw: ({ tdIndex }) => tdIndex.active2DGridDraw,
      active2DStringDraw: ({ tdIndex }) => tdIndex.active2DStringDraw,
      gridLoc: ({ tdFloor }) => tdFloor.gridLoc, // 楼宇内网格位置----胡红勋
      polygonLoc: ({ tdFloor }) => tdFloor.polygonLoc, // 楼宇中线/面绘制的位置坐标串 --- anli
      editGridData: ({ tdFloor }) => tdFloor.editGridData,
      editFeaturesList: ({ tdFloor }) => tdFloor.editFeaturesList,
      isEditGrid: ({ tdFloor }) => tdFloor.isEditGrid, // 是否在编辑中
      drawGridStyle: ({ tdFloor }) => tdFloor.drawGridStyle, // 绘制时的样式
      videoPreviewFlag: ({ tdIndex }) => tdIndex.videoPreviewFlag,
      active3DPoleDraw: ({ tdIndex }) => tdIndex.active3DPoleDraw, // 控制3D辅助杆绘制
      layerSettingsMap: ({ tdIndex }) => tdIndex.layerSettingsMap, // 图层设置map(key: 图层名称， value: 图层设置信息)
      pointIcon: ({ tdPoint }) => tdPoint.defaultPointIcon3D, // 默认点位图标
      selectedPointRes: ({ tdPoint }) => tdPoint.selectedPointRes, // 当前选中的点位
      mapsignType: ({ alarmThreeD }) => alarmThreeD.mapsignType
    }),
    ...mapGetters('map3DApplyIX', ['editVideoPointTag3D', 'editAlarmPointTag3D']),
    ...mapGetters('tdIndex', {isShowNameEdit: 'dbcdef'})
  },
  watch: {
    rightPanelShow(val) {
      if (val) {
        this.$refs.mapHeader.style.right = '316px'
      } else {
        this.$refs.mapHeader.style.right = '170px'
      }
    },
    videoPreviewFlag() {
      this.dragContainerPositionLeft = document.querySelector('.mapPositionCenter').offsetWidth - 600
    },
    editGridData(val) {
      // console.log('编辑网格数据：', JSON.parse(JSON.stringify(val)))
      // console.log('网格要素数据列表：', JSON.parse(JSON.stringify(this.gridFeatureList)))
      this.set2DActiveEdit(true)
    },
    active2DEdit(flag) {
      if (!flag) { // 关闭编辑绘制
        this.editFeature = null
        this.isDrawGridInter && this.handleEditGridIntersect() // 处理编辑网格相交
      }
    },
    is3DMapOuter(flag) {
      if (flag) {
        this.setGridList([]) // 清空楼层内网格数据
        this.updatePatrolResourceTree({ mapType: '3D' })
        // this.updateVedioResourceTree({ mapType: '3D' })
        this.updateAlarmHelpResourceTree({ mapType: '3D' })
        // this.updateAlarmResourceTree({ mapType: '3D' })
        this.close2DDrawer() // 关闭2D绘制工具
      } else {
        this.close3DDrawer() // 关闭3D绘制工具
        this.updatePatrolResourceTree({ floorId: this.floorData._id, mapType: '3D' })
        // this.updateVedioResourceTree({ floorId: this.floorData._id, mapType: '3D' })
        this.updateAlarmHelpResourceTree({ floorId: this.floorData._id, mapType: '3D' })
        // this.updateAlarmResourceTree({ floorId: this.floorData._id, mapType: '3D' })
      }
    },
    // 监听楼层数据的变化切换楼层地图
    floorData: {
      handler(val) {
        if (val) {
          let width = 200
          let height = 100
          let floor = JSON.parse(JSON.stringify(val))
          if (floor.picture.size) {
            width = floor.picture.size.width
            height = floor.picture.size.height
          }
          this.floorOneData.center = floor.bid.center.split(',').map(item => Number(item))
          let levelExtent = utils.getExtent(this.floorOneData.center, [width, height])
          this.floorOneData.extent = levelExtent
          this.floorOneData.mapUrl = floor.picture.path
        }
      },
      deep: true,
      immediate: true
    },
    // 楼层平面地图绘制工具激活时，鼠标在地图上的绘制图标样式----
    active2DDraw(flag) {
      this.updatePointDrawer(flag) // 更新点位绘制工具
    },
    active2DGridDraw(flag) {
      if (this.rightPanelType !== 'Map3DGrid') {
        this.updateAreaDrawer(flag) // 更新区域绘制工具
      } else {
        this.gridConfig = {
          name: '网格',
          id: 'gridLayer',
          type: GeometryType.MULTIPOLYGON,
          actived: false,
          drawStyle: gridStyle.gridStartDrawStyle,
          layerStyle: gridStyle.gridDrawEndStyle
        }
      }
    },
    active2DStringDraw(flag) {
      this.updateLineDrawerupdateLineDrawer(flag) // 更新画线绘制工具
    },
    drawGridStyle: { // 绘制样式更新
      handler(val) {
        if (val) {
          // console.log('处理网格样式变化：', val)
          let style = JSON.parse(JSON.stringify(val))
          if (!style.strokeStyle) {
            style = areaUtil.convertStyleToSymbol(this.gridConfig.drawStyle, style)
          }
          let layerStyle = JSON.parse(JSON.stringify(style))
          if (this.rightPanelType !== 'alarmEditPanel') {
            layerStyle.textStyle && delete layerStyle.textStyle // 图层样式删除文本样式
          }
          this.gridConfig.drawStyle = layerStyle // 更新区域/网格图层样式数据
          this.gridConfig.layerStyle = layerStyle // 更新区域/网格图层样式数据
          this.lineStringDraw.drawStyle = layerStyle // 更新线图层样式数据
          this.lineStringDraw.layerStyle = layerStyle // 更新线图层样式数据
          if (this.active2DEdit) { // 编辑时进入
            const rType = this.selectedPointRes && this.selectedPointRes.rType
            if (this.rightPanelType === 'alarmEditPanel' && (rType === RESOURCETYPE.commonAlarm || rType === RESOURCETYPE.fireAlarm || rType === RESOURCETYPE.alarmHost)) { // 报警（普通报警、消防报警、报警主机）
              this.uploadEditEndDatas() // 更新报警图层数据
            } else {
              this.refreshCurrentGridFeature() // 编辑绘制时更新当前网格要素
            }
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions([
      'getMap3DOneGridById',
      'getMap3DParamConfig',
      'getLayerSettingsList', // 获取图层配置信息
      'setReady',
      'getVedioChannelResource',
      'setRightPanelType',
      'getOneBuildById',
      'getOneBuildByIdWithoutUpdateState',
      'setRightPanelShow',
      'set3DActiveDraw', // 开启三维绘制工具的开启----
      'set2DActiveDraw', // 开始平面楼宇地图工具的开启---
      'set3DActiveChangePositionDraw',
      'saveOrUpdateVedioPoint', // 保存或者更新视频点位---
      'getVedioResourceOrgTree', // 更新视频点位树
      'saveOrUPdatePatrolPoint',
      'getPatrolOrgTree',
      'getAlarmResourceOrgTree',
      'getAlarmHelpOrgTree',
      'saveOrUpdateAlarmHelpPoint',
      'setPatrolList',
      'setVideoList',
      'setAlarmHelpList',
      'setAlarmList',
      'getOneFloorPatrols',
      'set2DActiveEdit',
      'getSinglePatrolPoint',
      'getSinglePatrolPointWithoutUpdateState',
      'getResourceById',
      'getResourceByIdWithoutUpdateState',
      'setMapResource',
      'getAllBuild',
      'setIsOuter',
      'set3DEditConfigModal',
      'setFeature',
      'set2DActiveGridDraw', // 激活平面楼层地图的网格绘制工具
      'getResourcePointsByChannelType',
      'getAllPatrolPoint',
      'setGridList',
      'setGridLoc',
      'setPolygonLoc',
      'setPolygonFeatureList',
      'setViewSetting',
      'setEditFeaturesList',
      'setHighLightList', // 设置2D高亮选中要素列表
      'setActive3DPoleDraw', // 设置控制3D辅助杆绘制
      'saveAssistHole', // 添加辅助杆
      'getAssistHoleList', // 获取辅助杆列表
      'getAssistHoleById', // 根据标识获取辅助杆
      'getAssistHoleByIdWithoutUpdateState', // 根据标识获取辅助杆
      'getModelSettingParams', // 获取模型设置参数
      'setSelectedPointRes'
    ]),
    ...mapMutations('map3DApplyIX', ['EDIT_VIDEO_POINT_TAG_3D', 'EDIT_ALARM_POINT_TAG_3D']),
    /* handkeMapMouseMove(param) { // 处理地图鼠标移动事件
      let {feature, attributes} = param
      if (this.active2DEdit && feature && attributes) {
        // console.log('鼠标移动到的要素信息：', JSON.parse(JSON.stringify(attributes)))
        if (this.editGridData && attributes.id === this.editGridData._id) {
          this.editFeature = feature
        }
      }
      if (!this.isShowNameEdit.tipCheck) { // 名称标签未勾选
        if (feature) { // 鼠标移入标注
          let attr = JSON.parse(JSON.stringify(attributes))
          switch (attr.rType) { // 判断要素资源
            case RESOURCETYPE.video: // 视频
              this.handleHoverVideoFeature(attr)
              break
            case RESOURCETYPE.commonAlarm: // 普通报警
              this.handleHoverCommonAlarmFeature(attr)
              break
            case RESOURCETYPE.fireAlarm: // 消防报警
              this.handleHoverFireAlarmFeature(attr)
              break
            case RESOURCETYPE.alarmHost: // 报警主机报警
              this.handleHoverAlarmHostFeature(attr)
              break
            case RESOURCETYPE.alarmBox: // 报警箱
              this.handleHoverAlarmBoxFeature(attr)
              break
            case RESOURCETYPE.alarmColumn: // 报警柱
              this.handleHoverAlarmColumnFeature(attr)
              break
            case RESOURCETYPE.patrol: // 巡更
              this.handleHoverPatrolFeature(attr)
              break
            case RESOURCETYPE.doorControl: // 门禁
              this.handleHoverDoorControlFeature(attr)
              break
            case RESOURCETYPE.single: // 单兵
              this.handleHoverSingleFeature(attr)
              break
            case RESOURCETYPE.grid: // 网格
              this.handleHoverGridFeature(attr)
              break
            case RESOURCETYPE.building: // 建筑物
              this.handleHoverBuildingFeature(attr)
              break
            case RESOURCETYPE.alarming: // 点位报警
              this.handleAlarmPointFeature(attr)
              break
            default:
              break
          }
        } else {
          this.clearVideoHoverFeatures()
          this.clearAlarmHoverFeatures()
          this.clearAlarmBoxHoverFeatures()
          this.clearAlarmColumnHoverFeatures()
          this.clearPatrolHoverFeatures()
        }
      }
    }, */
    handleEditGridIntersect() { // 处理编辑网格相交
      this.isDrawGridInter = false // 清空网格相交状态
      this.set2DActiveEdit(true) // 开启网格编辑绘制
      this.refreshCurrentGridFeature()
    },
    refreshCurrentGridFeature() { // 刷新当前网格要素
      const editReasource = this.rightPanelType === 'alarmEditPanel' ? this.mapResource : this.editGridData
      const editReasourceList = this.rightPanelType === 'alarmEditPanel' ? this.polygonFeatureList : this.gridFeatureList
      if (!editReasource) { return }
      let nowGrid = JSON.parse(JSON.stringify(editReasource))
      if (nowGrid) {
        nowGrid.loc = (this.rightPanelType === 'alarmEditPanel' ? this.polygonLoc : this.gridLoc) || nowGrid.loc || nowGrid.point3D.loc
        nowGrid.style = this.drawGridStyle || nowGrid.style || nowGrid.point3D.style
        let featureArr = editReasourceList.filter(item => item.attributes.id !== nowGrid._id)
        let feature = areaTrans.transOneFeature(nowGrid, areaStyle.gridStyleWithLabel, this.gridLayer)
        featureArr.push(feature)
        this.rightPanelType === 'alarmEditPanel' ? this.setPolygonFeatureList(featureArr) : this.setGridList(featureArr)
      }
    },
    updatePointDrawer(flag) { // 更新点位绘制工具
      if (flag) { // 开启绘制
        let iconDraw = this.getIconPointDraw(this.pointIcon.oid) // 获取图白哦点绘制样式
        let iconUrl = this.getTargetPointIconUrl() // 获取指定图标地址
        if (iconUrl) {
          iconDraw.drawStyle.iconStyle.url = iconUrl
        }
        iconDraw.actived = flag
        iconDraw.layerStyle = iconDraw.drawStyle
        this.pointDraw = iconDraw
      } else { // 关闭绘制，清空绘制
        let drawLayer = this.$refs.mapFloorContainer.getLayer(this.pointDraw.id)
        drawLayer.getSource().clear()
      }
    },
    getIconPointDraw(oid) { // 获取点位图标绘制工具
      let iconDraw = JSON.parse(JSON.stringify(this.pointDraw))
      if (oid === mapUtil.MODELOID.boltipc) { // 视频-枪机
        iconDraw = JSON.parse(JSON.stringify(drawConfig.boltipc))
      } else if (oid === mapUtil.MODELOID.redBoltipc) { // 视频-红外枪机
        iconDraw = JSON.parse(JSON.stringify(drawConfig.redBoltipc))
      } else if (oid === mapUtil.MODELOID.halfBallipc) { // 视频-半球
        iconDraw = JSON.parse(JSON.stringify(drawConfig.halfBallipc))
      } else if (oid === mapUtil.MODELOID.fastBallipc) { // 视频-快球
        iconDraw = JSON.parse(JSON.stringify(drawConfig.fastBallipc))
      } else if (oid === mapUtil.MODELOID.allViewipc) { // 视频-全景
        iconDraw = JSON.parse(JSON.stringify(drawConfig.allViewipc))
      } else if (oid === mapUtil.MODELOID.commonAlarm) { // 普通报警
        iconDraw = JSON.parse(JSON.stringify(drawConfig.commonAlarm))
      } else if (oid === mapUtil.MODELOID.fireAlarm) { // 消防报警
        iconDraw = JSON.parse(JSON.stringify(drawConfig.fireAlarm))
      } else if (oid === mapUtil.MODELOID.alarmHost) { // 报警主机
        iconDraw = JSON.parse(JSON.stringify(drawConfig.alarmHost))
      } else if (oid === mapUtil.MODELOID.alarmBox) { // 报警箱
        iconDraw = JSON.parse(JSON.stringify(drawConfig.alarmBox))
      } else if (oid === mapUtil.MODELOID.alarmColumn) { // 报警柱
        iconDraw = JSON.parse(JSON.stringify(drawConfig.alarmColumn))
      } else if (oid === mapUtil.MODELOID.commonPatrol) { // 巡更
        iconDraw = JSON.parse(JSON.stringify(drawConfig.patrol))
      }
      return iconDraw
    },
    updateLineDrawerupdateLineDrawer(flag) { // 更新线绘制工具
      if (flag) { // flag为true   激活绘制
        let lineDraw = null
        if (this.selectedPointRes && this.selectedPointRes.hasOwnProperty('rType')) {
          let {rType} = this.selectedPointRes
          if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
            lineDraw = JSON.parse(JSON.stringify(drawConfig.commonAlarmLine))
            lineDraw.actived = flag
          } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
            lineDraw = JSON.parse(JSON.stringify(drawConfig.fireAlarmLine))
            lineDraw.actived = flag
          } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
            lineDraw = JSON.parse(JSON.stringify(drawConfig.alarmHostLine))
            lineDraw.actived = flag
          }
        }
        if (lineDraw && lineDraw.actived) {
          let iconUrl = this.getTargetPointIconUrl() // 获取指定图标地址
          if (iconUrl) {
            lineDraw.drawStyle.iconStyle.url = iconUrl
          }
          let style = this.drawGridStyle || gridStyle.areaDefault // 存在保存的样式时，使用保存的样式，不存在保存的样式时，使用默认样式
          lineDraw.drawStyle = areaUtil.convertStyleToSymbol(lineDraw.drawStyle, JSON.parse(JSON.stringify(style)))
          lineDraw.layerStyle = areaUtil.convertStyleToSymbol(lineDraw.layerStyle, JSON.parse(JSON.stringify(style)))
          this.lineStringDraw = lineDraw
        }
      } else { // 关闭绘制
        let drawLayer = this.$refs.mapFloorContainer.getLayer(this.lineStringDraw.id)
        drawLayer.getSource().clear() // 清空绘制数据
        this.setPolygonFeatureList([]) // 清空绘制的线元素列表
        this.setPolygonLoc('') // 清空绘制的线元素点位信息
      }
    },
    updateAreaDrawer(flag) { // 更新区域绘制工具
      if (flag) { // 激活绘制
        let areaDraw = this.getAreaDrawerByResource(flag)
        if (areaDraw && areaDraw.actived) {
          let style = this.drawGridStyle ? this.drawGridStyle : gridStyle.areaDefault
          this.gridConfig.drawStyle = areaUtil.convertStyleToSymbol(areaDraw.drawStyle, JSON.parse(JSON.stringify(style)))
          this.gridConfig.layerStyle = areaUtil.convertStyleToSymbol(areaDraw.layerStyle, JSON.parse(JSON.stringify(style)))
          // this.polygonDraw = areaDraw
          this.gridConfig.actived = areaDraw.actived
        }
      } else { // 关闭绘制
        let drawLayer = this.$refs.mapFloorContainer.getLayer(this.gridConfig.id)
        drawLayer.getSource().clear() // 清空绘制数据
        if (this.rightPanelType === 'alarmEditPanel') { // 报警时，为区域，否在为网格
          this.setPolygonFeatureList([]) // 清空绘制的区域元素列表
          this.setPolygonLoc('') // 清空绘制的区域元素点位信息
        } else {
          this.setGridList([]) // 清空绘制的网格元素列表
          this.setGridLoc('') // 清空绘制的网格元素点位信息
        }
        this.isDrawGridInter && this.handleEditGridIntersect(true) // 当存在区域内相交或重叠元素时
      }
    },
    close2DDrawer() {
      // 关闭2D绘制工具
      this.set2DActiveDraw(false)
      this.set2DActiveEdit(false)
    },
    close3DDrawer() {
      // 关闭3D绘制工具
      this.setActive3DPoleDraw(false)
      this.set3DActiveChangePositionDraw(false)
      this.set3DActiveDraw(false)
    },
    // 地图上添加单击的方法
    mapClickEvt(obj) {
      // 网格处于编辑状态，不可点选点位----
      if (this.isEditGrid) {
        return
      }
      // this.setHighLightList([]) // 清空2D高亮选中要素列表
      let { attributes, feature } = obj
      if (feature && attributes && attributes.id && (attributes.rType || attributes.rType === 0)) {
        if (this.mapResource && this.mapResource._id === attributes.id && this.rightPanelType !== 'floorForm') { return }
        if (obj.type === GeometryType.POINT || obj.type === GeometryType.MULTIPOLYLINE || obj.type === GeometryType.MULTIPOLYGON) {
          this.editFeature = feature // 编辑控件设置要编辑的要素
          this.set2DActiveEdit(true) // 激活编辑控件
          obj.type === GeometryType.POINT ? this.highLightSelectedFeature(attributes) : this.highLightSelectedAreaFeature(attributes.id, attributes.loc) // 高亮定位在地图中心（非点时，需要计算中心点）
          this.switchResourcePageByType(attributes.id, attributes.rType) // 根据点位类型切换点位编辑页面框
          this.setSelectedPointRes(attributes) // 更新当前选中的元素
        }
      }
    },
    highLightSelectedFeature(attr) { // 高亮选中的要素
      // console.log('高亮选中的要素：', attr)
      if (attr.id && attr.loc) {
        let coods = attr.loc.split(',').map(item => Number(item))
        let feature = highLight.getLocateFeature(DEFAULTOPS.locatePre + attr.id, coods)
        this.setHighLightList([feature])
      }
    },
    handleMapMouseMove(param) { // 楼内
      // console.log('处理地图移动事件：', param)
      // 网格处于编辑状态，不可点选点位----
      if (this.isEditGrid) {
        return
      }
      let { attributes, feature } = param
      if (this.active2DEdit && feature) {
        if (attributes && this.mapResource && attributes.id === this.mapResource._id) {
          this.editFeature = feature // 编辑控件设置要编辑的要素
        }
      }
      if (!this.isShowNameEdit.tipCheck) { // 如果名称标签未勾选
        if (attributes) {
          if (attributes.hasOwnProperty('rType')) {
            switch (attributes.rType) { // 判断要素资源
              case RESOURCETYPE.video: // 视频
                this.handleHoverVideoFeature(attributes)
                break
              case RESOURCETYPE.commonAlarm: // 普通报警
                this.handleHoverCommonAlarmFeature(attributes)
                break
              case RESOURCETYPE.fireAlarm: // 消防报警
                this.handleHoverCommonAlarmFeature(attributes)
                break
              case RESOURCETYPE.alarmHost: // 报警主机报警
                this.handleHoverCommonAlarmFeature(attributes)
                break
              case RESOURCETYPE.alarmBox: // 报警箱
                this.handleHoverAlarmBoxFeature(attributes)
                break
              case RESOURCETYPE.alarmColumn: // 报警柱
                this.handleHoverAlarmColumnFeature(attributes)
                break
              case RESOURCETYPE.patrol: // 巡更
                this.handleHoverPatrolFeature(attributes)
                break
            }
          } else {
            let { id } = attributes
            let currentData = this.gridLabelFeatureList.find(item => item._id === id)
            this.handleHoverGridFeature(currentData)
            /* this.getMap3DOneGridById(id).then(res => {
              this.handleHoverGridFeature(res)
            }, err => {
              console.log(err)
            }) */
          }
        } else {
          this.clearGridHoverFeatures() // 清空网格悬浮要素
          this.clearVideoHoverFeatures() // 清空视频悬浮显示要素
          this.clearAlarmHoverFeatures() // 清空普通报警悬浮显示要素
          this.clearAlarmBoxHoverFeatures() // 清空报警箱悬浮要素
          this.clearAlarmColumnHoverFeatures() // 清空报警柱悬浮要素
          this.clearPatrolHoverFeatures() // 清空巡更悬浮要素
        }
      }
    },
    // 根据点位类型切换点位编辑页面框------胡红勋 2018-09-06
    switchResourcePageByType(id, type) {
      if (type === mapUtil.CHANNELTYPE.patrol) {
        // 巡更点位
        this.getSinglePatrolPoint(id).then(res => {
          this.setRightPanelShow(true) // 显示右侧的信息面板
          this.setRightPanelType('patrolEditPanel') // 信息面板显示巡更点位信息
        })
      } else if (type === mapUtil.CHANNELTYPE.assist) {
        // 辅助杆
        this.getAssistHoleById(id).then(res => {
          this.setRightPanelShow(true) // 显示右侧的信息面板
          this.setRightPanelType('assistEditPanel') // 信息面板显示视频点位信息
        })
      } else {
        // 其它点位
        this.getResourceById(id).then(res => {
          if (type === mapUtil.CHANNELTYPE.vedioResource) {
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('videoEditPanel') // 信息面板显示视频点位信息
          } else if (
            type === mapUtil.CHANNELTYPE.commonAlarmResource ||
            type === mapUtil.CHANNELTYPE.fireAlarmResource ||
            type === mapUtil.CHANNELTYPE.alarmHostResource
          ) {
            // 报警点位（普通报警、消防报警、普通报警）
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('alarmEditPanel') // 信息面板显示报警点位信息
          } else if (
            type === mapUtil.CHANNELTYPE.alarmColumnResource ||
            type === mapUtil.CHANNELTYPE.alarmBoxResource
          ) {
            // 报警求助点位
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('alarmHelpEditPanel') // 信息面板显示视频点位信息
          }
        })
      }
    },
    // 楼层平面地图加载完成后调用的方法----
    getMap(obj) {
      Vue.prototype.$context2D = obj
      this.addPointFeatureToMap() // 视频点位添加到楼层平面地图上
      this.addPatrolPointToMap() // 巡更点位添加到楼层平面地图上
    },
    // 绘制点位结束后调用的方法----
    drawPointFinish(res) {
      let param = {}
      if (this.is3DMapOuter) {
        this.isClearTempDrawPositon = true // 清除临时绘制的三维点位---
        this.set3DActiveDraw(false) // 关闭三维绘制工具----
        let point = res.result.object
        let loc = this.context.Cesium.Cartographic.fromCartesian(point.position)
        let longitude = this.context.Cesium.Math.toDegrees(loc.longitude)
        let latitude = this.context.Cesium.Math.toDegrees(loc.latitude)
        let height = loc.height
        param.lon = longitude
        param.lat = latitude
        param.height = height
      } else {
        this.set2DActiveDraw(false) // 关闭二维绘制工具-
        param.lon = res.coods[0]
        param.lat = res.coods[1]
      }
      if (this.active3DPoleDraw) { // 辅助杆绘制,添加辅助杆
        this.saveAssistPole(param)
        this.setActive3DPoleDraw(false) // 关闭3D辅助杆的绘制
      } else {
        if (this.treeNodeType && this.treeNodeType === mapUtil.CHANNELTYPE.patrol) { // 巡更
          if (this.is3DMapOuter) {
            this.save3DPatrolResource(param)
          } else {
            this.save2DPatrolResource(param)
          }
        } else if (this.treeNodeType === mapUtil.CHANNELTYPE.vedioResource) { // 视频
          if (this.is3DMapOuter) {
            this.save3DVedioChannelOrCommonAlarmResource(param)
          } else {
            this.save2DVedioChannelOrCommonAlarmResource(param)
          }
        } else if ( // 普通报警、消防报警，报警主机报警的保存
          this.treeNodeType === mapUtil.CHANNELTYPE.commonAlarmResource ||
          this.treeNodeType === mapUtil.CHANNELTYPE.fireAlarmResource ||
          this.treeNodeType === mapUtil.CHANNELTYPE.alarmHostResource
        ) {
          if (this.is3DMapOuter) {
            this.save3DAlarmResource(param)
          } else {
            if (this.isEditGrid) {
              this.setPolygonLoc(param.lon + ',' + param.lat)
              this.uploadEditEndDatas()
              this.refreashHightLightFeature(this.mapResource, param.lon + ',' + param.lat)
              return
            }
            this.save2DAlarmResource(param)
          }
        } else if ( // 报警柱、报警箱的保存
          this.treeNodeType === mapUtil.CHANNELTYPE.alarmBoxResource ||
          this.treeNodeType === mapUtil.CHANNELTYPE.alarmColumnResource
        ) {
          if (this.is3DMapOuter) {
            this.save3DAlarmHelpResource(param)
          } else {
            this.save2DAlarmHelpResource(param)
          }
        }
      }
    },
    // 更新视频资源树
    updateVedioResourceTree(param) {
      this.getVedioResourceOrgTree(param)
    },
    // 更新巡更资源树----
    updatePatrolResourceTree(param) {
      this.getPatrolOrgTree(param)
    },
    // 更新报警资源树----
    updateAlarmResourceTree(param) {
      this.getAlarmResourceOrgTree(param)
    },
    // 更新报警求助资源树----
    updateAlarmHelpResourceTree(param) {
      this.getAlarmHelpOrgTree(param)
    },
    saveAssistPole(obj) { // 添加辅助杆
      let assitOid = mapUtil.MODELOID.assist // 辅助模型资源标识
      this.getModelSettingParams(assitOid).then(res => { // 获取辅助模型设置参数
        if (res && res.hasOwnProperty('height') && res.height > obj.height) {
          obj.height = res.height
        }
        let point = this.initPointData() // 初始化点位数据
        point.loc = obj.lon + ',' + obj.lat + ',' + obj.height
        point.height = obj.height
        point.scale = res && res.scale ? res.scale : point.scale
        this.saveAssistHole(point).then(res => {
          this.successMsg('辅助杆添加成功')
          this.addAssistHoleModelToMap(res, this.keyTypes.pole) // 添加辅助杆模型到地图中
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('辅助杆点位添加失败：', data)
          let msg = data.message ? data.message : '辅助杆点位添加失败'
          this.errorMsg(msg)
        })
      }).catch(err => {
        console.log('获取辅助模型设置参数失败：', err)
        this.errorMsg('获取辅助模型设置参数失败')
      })
    },
    save2DVedioChannelOrCommonAlarmResource(obj) {
      let pointDataAdd = JSON.parse(JSON.stringify(this.mapResource))
      let point = this.initPointData() // 初始化点位数据
      pointDataAdd.mapsign = {signflag: true, signtype: MPSIGNKEY.point}
      point.name = this.mapResource.name // 名称
      point.loc = obj.lon + ',' + obj.lat
      point.sid = this.floorData._id // 楼层id
      point.bid = this.floorData.bid._id // 楼宇id
      // 根据模式选择点位属性----
      pointDataAdd[this.mapMode] = point
      this.saveOrUpdateVedioPoint({ _id: pointDataAdd._id, body: pointDataAdd })
        .then(res => {
          this.successMsg('点位添加成功')
          if (this.treeNodeType === mapUtil.CHANNELTYPE.vedioResource) {
            const num = this.editVideoPointTag3D + 1
            this.EDIT_VIDEO_POINT_TAG_3D(num)
          } else if (this.treeNodeType === mapUtil.CHANNELTYPE.commonAlarmResource) {
            const num = this.editAlarmPointTag3D + 1
            this.EDIT_ALARM_POINT_TAG_3D(num)
          }
          this.getResourceById(pointDataAdd._id).then(data => {
            // 更新视频点位树-----开始
            // this.updateVedioResourceTree({ floorId: this.floorData._id, mapType: '3D' })
            this.addPointFeatureToMap()
            if (this.treeNodeType === mapUtil.CHANNELTYPE.vedioResource) {
              this.setRightPanelShow(true) // 显示右侧的信息面板
              this.setRightPanelType('videoEditPanel') // 信息面板显示视频点位信息
            } else if (this.treeNodeType === mapUtil.CHANNELTYPE.commonAlarmResource) {
              this.setRightPanelShow(true) // 显示右侧的信息面板
              this.setRightPanelType('alarmEditPanel') // 信息面板显示视频点位信息
            }
          })
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('点位添加失败：', data)
          let msg = data.message ? data.message : '点位添加失败'
          this.errorMsg(msg)
        })
    },
    save3DVedioChannelOrCommonAlarmResource(obj) {
      let videoOid = mapUtil.MODELOID.video // 视频模型资源标识
      this.getModelSettingParams(videoOid).then(res => { // 获取辅助模型设置参数
        if (res && res.hasOwnProperty('height') && res.height > obj.height) {
          obj.height = res.height
        }
        let key = this.keyTypes.vedio
        if (this.treeNodeType === mapUtil.CHANNELTYPE.commonAlarmResource) {
          key = this.keyTypes.alarm
        }
        let pointDataAdd = JSON.parse(JSON.stringify(this.mapResource))
        let point = this.initPointData() // 初始化点位数据
        point.name = this.mapResource.name // 名称
        point.loc = obj.lon + ',' + obj.lat + ',' + obj.height
        point.height = obj.height
        point.scale = res && res.scale ? res.scale : point.scale
        // 根据模式选择点位属性----
        pointDataAdd[this.mapMode] = point
        // 保存点位-----
        this.saveOrUpdateVedioPoint({ _id: pointDataAdd._id, body: pointDataAdd }).then(res => {
          this.successMsg('点位添加成功')
          if (this.treeNodeType === mapUtil.CHANNELTYPE.vedioResource) {
            const num = this.editVideoPointTag3D + 1
            this.EDIT_VIDEO_POINT_TAG_3D(num)
          } else if (this.treeNodeType === mapUtil.CHANNELTYPE.commonAlarmResource) {
            const num = this.editAlarmPointTag3D + 1
            this.EDIT_ALARM_POINT_TAG_3D(num)
          }
          this.getResourceById(pointDataAdd._id).then(data => {
            // this.updateVedioResourceTree({ mapType: '3D' }) // 更新视频点位资源树
            utils.addEntitysToMap(key, [data], this.mapMode, this.context)
            if (this.treeNodeType === mapUtil.CHANNELTYPE.vedioResource) {
              this.setRightPanelShow(true) // 显示右侧的信息面板
              this.setRightPanelType('videoEditPanel') // 信息面板显示视频点位信息
            } else if (this.treeNodeType === mapUtil.CHANNELTYPE.commonAlarmResource) {
              this.setRightPanelShow(true) // 显示右侧的信息面板
              this.setRightPanelType('alarmEditPanel') // 信息面板显示视频点位信息
            }
          })
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('点位添加失败：', data)
          let msg = data.message ? data.message : '点位添加失败'
          this.errorMsg(msg)
        })
      }).catch(err => {
        console.log('获取视频模型设置参数失败：', err)
        this.errorMsg('获取视频模型设置参数失败')
      })
    },
    save2DPatrolResource(obj) {
      let partrolPoint = JSON.parse(JSON.stringify(this.mapResource))
      let point = this.initPointData() // 初始化点位数据
      point.geo = obj.lon + ',' + obj.lat
      point.sid = this.floorData._id // 楼层id
      point.bid = this.floorData.bid._id // 楼宇id
      partrolPoint[this.mapMode] = point
      // 保存巡更点-----
      this.saveOrUPdatePatrolPoint(partrolPoint)
        .then(res => {
          this.successMsg('巡更点位添加成功')
          this.getSinglePatrolPoint(partrolPoint._id).then(data => {
            this.updatePatrolResourceTree({ floorId: this.floorData._id, mapType: '3D' })
            this.addPatrolPointToMap()
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('patrolEditPanel') // 信息面板显示巡更点位信息
          })
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('巡更点位添加失败：', data)
          let msg = data.message ? data.message : '巡更点位添加失败'
          this.errorMsg(msg)
        })
    },
    save3DPatrolResource(obj) {
      let patrolOid = mapUtil.MODELOID.patrol // 巡更模型资源标识
      this.getModelSettingParams(patrolOid).then(res => { // 获取巡更模型设置参数
        if (res && res.hasOwnProperty('height') && res.height > obj.height) {
          obj.height = res.height
        }
        let partrolPoint = JSON.parse(JSON.stringify(this.mapResource))
        let point = this.initPointData() // 初始化点位数据
        point.geo = obj.lon + ',' + obj.lat + ',' + obj.height
        point.height = obj.height
        point.scale = res && res.scale ? res.scale : point.scale
        partrolPoint[this.mapMode] = point
        // 保存巡更点-----
        this.saveOrUPdatePatrolPoint(partrolPoint).then(res => {
          this.successMsg('巡更点位添加成功')
          this.getSinglePatrolPoint(partrolPoint._id).then(data => {
            this.updatePatrolResourceTree({ mapType: '3D' }) // 更新巡更资源树
            utils.addEntitysToMap(this.keyTypes.patrol, [data], this.mapMode, this.context)
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('patrolEditPanel') // 信息面板显示巡更点位信息
          })
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('巡更点位添加失败：', data)
          let msg = data.message ? data.message : '巡更点位添加失败'
          this.errorMsg(msg)
        })
      }).catch(err => {
        console.log('获取巡更模型设置参数失败：', err)
        this.errorMsg('获取巡更模型设置参数失败')
      })
    },
    save2DAlarmResource(obj) {
      let alarmPoint = JSON.parse(JSON.stringify(this.mapResource))
      alarmPoint.mapsign = {signflag: true, signtype: MPSIGNKEY.point}
      let point = this.initPointData() // 初始化点位数据
      point.name = this.mapResource.name // 名称
      point.loc = obj.lon + ',' + obj.lat
      point.sid = this.floorData._id // 楼层id
      point.bid = this.floorData.bid._id // 楼宇id
      // 设置地理信息位置--胡红勋 --2018 -09- 08
      alarmPoint[this.mapMode] = point
      this.saveOrUpdateVedioPoint({ _id: alarmPoint._id, body: alarmPoint })
        .then(res => {
          this.successMsg('报警点位添加成功')
          const num = this.editAlarmPointTag3D + 1
          this.EDIT_ALARM_POINT_TAG_3D(num)
          this.getResourceById(alarmPoint._id).then(res => {
            // this.updateAlarmResourceTree({ floorId: this.floorData._id, mapType: '3D' })
            this.addPointFeatureToMap()
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('alarmEditPanel') // 信息面板显示报警点位信息
          })
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警点位添加失败：', data)
          let msg = data.message ? data.message : '报警点位添加失败'
          this.errorMsg(msg)
        })
    },
    save3DAlarmResource(obj) {
      let alarmOid = mapUtil.MODELOID.alarm // 报警模型资源标识
      this.getModelSettingParams(alarmOid).then(res => { // 获取报警模型设置参数
        if (res && res.hasOwnProperty('height') && res.height > obj.height) {
          obj.height = res.height
        }
        let alarmPoint = JSON.parse(JSON.stringify(this.mapResource))
        let point = this.initPointData() // 初始化点位数据
        point.name = this.mapResource.name // 名称
        point.loc = obj.lon + ',' + obj.lat + ',' + obj.height
        point.height = obj.height
        point.scale = res && res.scale ? res.scale : point.scale
        alarmPoint[this.mapMode] = point
        this.saveOrUpdateVedioPoint({ _id: alarmPoint._id, body: alarmPoint }).then(res => {
          this.successMsg('报警点位添加成功')
          const num = this.editAlarmPointTag3D + 1
          this.EDIT_ALARM_POINT_TAG_3D(num)
          this.getResourceById(alarmPoint._id).then(res => {
            // this.updateAlarmResourceTree({ mapType: '3D' }) // 更新报警资源树
            utils.addEntitysToMap(this.keyTypes.alarm, [res], this.mapMode, this.context)
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('alarmEditPanel') // 信息面板显示报警点位信息
          })
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警点位添加失败：', data)
          let msg = data.message ? data.message : '报警点位添加失败'
          this.errorMsg(msg)
        })
      }).catch(err => {
        console.log('获取报警模型设置参数失败：', err)
        this.errorMsg('获取报警模型设置参数失败')
      })
    },
    save2DAlarmHelpResource(obj) {
      let alarmHelpPoint = JSON.parse(JSON.stringify(this.mapResource))
      let point = this.initPointData() // 初始化点位数据
      point.name = this.mapResource.name // 名称
      point.loc = obj.lon + ',' + obj.lat
      point.sid = this.floorData._id // 楼层id
      point.bid = this.floorData.bid._id // 楼宇id
      alarmHelpPoint[this.mapMode] = point
      this.saveOrUpdateAlarmHelpPoint({ _id: alarmHelpPoint._id, body: alarmHelpPoint })
        .then(res => {
          this.successMsg('报警求助点位添加成功')
          this.getResourceById(alarmHelpPoint._id).then(res => {
            // 更新报警求助树-----开始--
            this.updateAlarmHelpResourceTree({ floorId: this.floorData._id, mapType: '3D' })
            this.addPointFeatureToMap()
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('alarmHelpEditPanel') // 信息面板显示视频点位信息
          })
        })
        .catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警求助点位添加失败：', data)
          let msg = data.message ? data.message : '报警求助点位添加失败'
          this.errorMsg(msg)
        })
    },
    save3DAlarmHelpResource(obj) {
      let alarmHelpOid = mapUtil.MODELOID.alarmHelp // 报警求助模型资源标识
      this.getModelSettingParams(alarmHelpOid).then(res => { // 获取报警求助模型设置参数
        if (res && res.hasOwnProperty('height') && res.height > obj.height) {
          obj.height = res.height
        }
        let alarmHelpPoint = JSON.parse(JSON.stringify(this.mapResource))
        let point = this.initPointData() // 初始化点位数据
        point.name = this.mapResource.name // 名称
        point.loc = obj.lon + ',' + obj.lat + ',' + obj.height
        point.height = obj.height
        point.scale = res && res.scale ? res.scale : point.scale
        alarmHelpPoint[this.mapMode] = point
        this.saveOrUpdateAlarmHelpPoint({ _id: alarmHelpPoint._id, body: alarmHelpPoint }).then(res => {
          this.successMsg('报警求助点位添加成功')
          this.getResourceById(alarmHelpPoint._id).then(res => {
            this.updateAlarmHelpResourceTree({ mapType: '3D' }) // 更新报警求助资源树
            utils.addEntitysToMap(this.keyTypes.alarmHelp, [res], this.mapMode, this.context)
            this.setRightPanelShow(true) // 显示右侧的信息面板
            this.setRightPanelType('alarmHelpEditPanel') // 信息面板显示视频点位信息
          })
        }).catch(err => {
          let data = (err.response && err.response.data) ? err.response.data : err
          console.log('报警求助点位添加失败：', data)
          let msg = data.message ? data.message : '报警求助点位添加失败'
          this.errorMsg(msg)
        })
      }).catch(err => {
        console.log('获取报警求助模型设置参数失败：', err)
        this.errorMsg('获取报警求助模型设置参数失败')
      })
    },
    addAssistHoleModelToMap(pointId, key) { // 添加其他资源（视频、报警、报警求助）模型到地图中
      this.getAssistHoleById(pointId).then(res => {
        res.type = mapUtil.CHANNELTYPE.assist
        utils.addEntitysToMap(key, [res], this.mapMode, this.context)
        this.setRightPanelShow(true) // 显示右侧的信息面板
        this.setRightPanelType('assistEditPanel') // 信息面板显示辅助模型点位信息
      })
    },
    // 将楼层内的巡更点位添加到楼层平面地图上-----
    addPatrolPointToMap() {
      this.getOneFloorPatrols(this.floorData._id)
        .then(patrolDatas => {
          let patrols = transPatrol.transFeatures(patrolDatas, this.patrolLayer, this.mapMode)
          this.setPatrolList(patrols)
        })
        .catch(err => {
          console.log('加载楼层：', this.floorData._id, '巡更点失败：', err)
        })
    },
    // 将数据库中的所有楼层内的资源点位添加到地图上
    addPointFeatureToMap() {
      let channelTypes = mapUtil.CHANNELTYPE.vedioResource + ',' + mapUtil.CHANNELTYPE.commonAlarmResource + ',' + mapUtil.CHANNELTYPE.fireAlarmResource + ',' + mapUtil.CHANNELTYPE.alarmHostResource
      let param = { sid: this.floorData._id, channelTypes: channelTypes }
      this.getResourcePointsByChannelType(param).then(res => {
        // console.log('楼层ID：', this.floorData._id, '的所有点位数据：', res)
        let videoArr = []
        let alarmArr = []
        let alarmHelpArr = []
        let alarms = []
        res.forEach(item => {
          if (item.type === mapUtil.CHANNELTYPE.vedioResource) {
            if (item.eid && item.eid.type) {
              if (
                item.eid.type === mapUtil.CHANNELTYPE.alarmBoxResource ||
                item.eid.type === mapUtil.CHANNELTYPE.alarmColumnResource
              ) {
                // 报警求助
                alarmHelpArr.push(item)
              } else {
                // 视频
                videoArr.push(item)
              }
            }
          } else {
            // 报警
            alarmArr.push(item)
          }
        })
        if (alarmArr && alarmArr.length > 0) {
          alarmArr.forEach(item => {
            const alarmLayer = (item.type === mapUtil.CHANNELTYPE.fireAlarmResource && this.fireAlarm) || (item.type === mapUtil.CHANNELTYPE.alarmHostResource && this.alarmHost) || this.commonAlarmLayer
            const feature = alarmTrans.transOneFeature(item, alarmLayer, this.mapMode)
            alarms.push(feature)
          })
        }
        let vedios = videoTrans.transIconFeatures(videoArr, this.videoLayer, this.mapMode)
        let alarmHelps = transAlarmHelp.transFeatures(alarmHelpArr, this.alarmHelpLayer, this.mapMode)
        this.setVideoList(vedios)
        this.setAlarmList(alarms)
        this.setAlarmHelpList(alarmHelps)
      })
    },
    // 编辑要素开始时调用的方法---
    editFeatureStart(res) {
      this.setHighLightList([]) // 清空高亮要素
    },
    // 编辑要素结束时调用的方法----
    editFeatureEnd(coods) {
      // 保存面的修改后的坐标----
      if (this.isEditGrid || (this.rightPanelType === 'alarmEditPanel' && this.mapResource && this.mapResource.mapsign)) { // 修改后的保存
        let desc = '网格' // 默认为网格
        let pos = ''
        if (this.rightPanelType === 'alarmEditPanel' && this.mapResource && this.mapResource.mapsign && this.mapResource.mapsign.signtype !== 2) {
          if (this.mapsignType === 0) {
            this.setPolygonLoc(coods.toString())
            this.refreashHightLightFeature(this.mapResource, coods.toString())
          } else if (this.mapsignType === 1) {
            // 右侧面板为报警时，需要获取当前选中的为面还是线
            pos = gridUtil.consistMutiPolyLineCoods(coods)
            this.setPolygonLoc(pos) // 更新当前修改后的坐标位置信息
            this.uploadEditEndDatas() // 更新报警图层数据
            this.highLightSelectedAreaFeature(this.selectedPointRes.id, pos) // 编辑完后定位高亮元素
          }
          return
        }
        pos = gridUtil.consistMutiPolyCoods(coods)
        let featureList = JSON.parse(JSON.stringify(this.gridFeatureList)) // 获取编辑中的网格列表
        const isSelfIntersect = gridUtil.isSelfInterMultiPolygon(pos)
        const isInterIntersect = gridUtil.isInterMultiPolygon(pos)
        let isBetweenIntersect = null
        if (this.rightPanelType === 'alarmEditPanel') { // 如果当前右侧面板为报警时，则为区域
          desc = '区域'
          featureList = JSON.parse(JSON.stringify(this.polygonFeatureList)) // 获取编辑中的区域列表
        }
        if (this.editFeaturesList[0] && this.editFeaturesList[0].attributes) {
          const features = gridUtil.deleteSameGrid([...featureList], this.editFeaturesList[0])
          isBetweenIntersect = gridUtil.isInterBetweenMultiPolygon(pos, features)
        }
        if (isSelfIntersect || isInterIntersect || isBetweenIntersect) {
          this.isDrawGridInter = true // 标记网格绘制相交
          this.set2DActiveEdit(false) // 关闭编辑绘制
          this.$Notice.warning({
            title: '提示',
            desc: desc + '内的多个多边形之间有相交，请重新绘制',
            duration: 2
          })
          this.isDrawGridInter = true
          this.uploadEditEndDatas() // 更新报警图层数据
          return
        }
        if (this.rightPanelType === 'alarmEditPanel' && this.mapResource && this.mapResource.mapsign && this.mapsignType === 2) {
          // 右侧面板为报警时，需要获取当前选中的为面还是线
          this.setPolygonLoc(pos) // 更新当前修改后的坐标位置信息
          this.uploadEditEndDatas() // 更新报警图层数据
          this.highLightSelectedAreaFeature(this.selectedPointRes.id, pos) // 编辑完后定位高亮元素
        }
        return
      }
      this.updateMapPointResource(coods) // 更新地图点位资源
    },
    updateMapPointResource(coods) {
      let _pointData = JSON.parse(JSON.stringify(this.mapResource))
      const type = _pointData.type || _pointData.device
      if (type === mapUtil.CHANNELTYPE.patrol) {
        _pointData[this.mapMode].geo = coods.join(',') // 根据地图模式关联地理属性 胡红勋-0908
      } else {
        _pointData[this.mapMode].loc = coods.join(',') // 根据地图模式关联地理属性 胡红勋-0908
      }
      this.refreashHightLightFeature(_pointData, coods) // 更新高亮要素
      this.setMapResource(_pointData) // 更新点位表单坐标数据
    },
    refreashHightLightFeature(_pointData, coods) { // 刷新高亮要素
      let feature = highLight.getLocateFeature(DEFAULTOPS.locatePre + _pointData._id, coods)
      this.setHighLightList([feature])
    },
    // 改变三维模型的位置----
    changeModelPosition(res) {
      this.isClearTempEditPositon = true
      let pos = res.result.object.position
      let _pointData = JSON.parse(JSON.stringify(this.mapResource))
      const location = this.context.Cesium.Cartographic.fromCartesian(pos)
      let longitude = this.context.Cesium.Math.toDegrees(location.longitude)
      let latitude = this.context.Cesium.Math.toDegrees(location.latitude)
      let height = location.height
      const type = _pointData.device || _pointData.type
      let modelOid = mapUtil.MODELOID.assist // 模型资源标识，默认为辅助模型资源标识
      let modelTypeLabel = '辅助'
      if (typeof type !== 'undefined') {
        if (type === mapUtil.CHANNELTYPE.vedioResource) { // 视频
          if (_pointData.eid.type === mapUtil.CHANNELTYPE.alarmBoxResource || _pointData.eid.type === mapUtil.CHANNELTYPE.alarmColumnResource) { // 报警求助
            modelOid = mapUtil.MODELOID.alarmHelp
            modelTypeLabel = '报警求助'
          } else {
            modelOid = mapUtil.MODELOID.video
            modelTypeLabel = '视频'
          }
        } else if (type === mapUtil.CHANNELTYPE.commonAlarmResource || type === mapUtil.CHANNELTYPE.alarmHostResource || type === mapUtil.CHANNELTYPE.fireAlarmResource) { // 报警
          modelOid = mapUtil.MODELOID.alarm
          modelTypeLabel = '报警'
        } else if (type === mapUtil.CHANNELTYPE.alarmBoxResource || type === mapUtil.CHANNELTYPE.alarmColumnResource) { // 报警求助
          modelOid = mapUtil.MODELOID.alarmHelp
          modelTypeLabel = '报警求助'
        } else if (type === mapUtil.CHANNELTYPE.patrol) { // 巡更
          modelOid = mapUtil.MODELOID.patrol
          modelTypeLabel = '巡更'
        }
      }
      this.getModelSettingParams(modelOid).then(res => { // 获取模型设置参数
        if (res && res.hasOwnProperty('height') && res.height > height) {
          height = res.height
        }
        let point3D = _pointData[this.mapMode]
        if (typeof type !== 'undefined') {
          if (type === mapUtil.CHANNELTYPE.patrol) {
            _pointData[this.mapMode].geo = longitude + ',' + latitude + ',' + height
          } else {
            _pointData[this.mapMode].loc = longitude + ',' + latitude + ',' + height
          }
        } else {
          _pointData.loc = longitude + ',' + latitude + ',' + height
          point3D = _pointData
        }
        utils.changeEntityPosition(this.context, _pointData._id, point3D)
        this.setMapResource(_pointData) // 更新点位表单坐标数据
      }).catch(err => {
        console.log('获取' + modelTypeLabel + '模型设置参数失败：', err)
        this.errorMsg('获取' + modelTypeLabel + '模型设置参数失败')
      })
    },
    readyEvt(param) {
      this.context = param // 保存三维全局地图变量以及类库
      let scene = param.viewer.scene
      let widget = param.viewer.cesiumWidget
      let { dataSet, dataSource, dataUrl, key, mapUrl, layer, perspective } = this.map3DConfig
      try {
        let promise = scene.open(mapUrl)
        param.Cesium.when(promise, layers => {
          Vue.prototype.$context = param
          this.setReady(true) // 地图图层加载完成的标志，其他组件可以以此为标志调用地图的方法
          let layerName = layer || (dataSet + '@' + dataSource)
          let scenelayer = scene.layers.find(layerName)
          if (scenelayer) {
            // 设置拾取图层查询条件
            scenelayer.setQueryParameter({
              url: dataUrl,
              dataSourceName: dataSource,
              dataSetName: dataSet,
              keyWord: key
            })
            this.adjustSceneByLayerSettings(layerName) // 根据图层设置信息调整场景
            this.setMapView(perspective, scenelayer) // 设置地图视图方位
            this.regMapListeners() // 注册地图事件监听
            this.displayAllResourcePoint() // 显示点位实体
          }
        })
      } catch (e) {
        if (widget._showRenderLoopErrors) {
          let title = '渲染时发生错误，已停止渲染。'
          widget.showErrorPanel(title, undefined, e)
          console.log(title)
        }
      }
    },
    adjustSceneByLayerSettings(layerName) { // 根据图层设置信息调整场景
      let scene = this.context.viewer.scene
      let layers = scene._layers.layerQueue // 获取地图图层数组
      // 初始化图层选择参数
      for (let layerItem of layers) {
        layerItem.clearMemoryImmediately = false // 图层关闭释放视野之外的设置
        if (layerName === layerItem.name) {
          layerItem.selectedColor = this.context.Cesium.Color.FUCHSIA
        } else {
          layerItem.selectedColor = this.context.Cesium.Color.WHITE
        }
      }
      // 根据图层设置信息调整场景
      for (const settings of this.layerSettingsMap.values()) {
        let layer = scene.layers.find(settings.name)
        if (layer) { // 图层
          layer.selectedColor = settings.selected ? (settings.selectedColor ? this.context.Cesium.Color.fromCssColorString(settings.selectedColor) : this.context.Cesium.Color.FUCHSIA) : this.context.Cesium.Color.WHITE
          layer.hue = settings.hue
          layer.saturation = settings.saturation
          layer.brightness = settings.brightness
        } else if (settings.name === 'viewer') { // 视图
          let skyAtmosphere = scene.skyAtmosphere
          if (skyAtmosphere) {
            skyAtmosphere.hueShift = settings.hue
            skyAtmosphere.saturationShift = settings.saturation
            skyAtmosphere.brightnessShift = settings.brightness
          }
        }
      }
    },
    displayAllResourcePoint() {
      // 获取辅助杆列表
      this.getAssistHoleList()
        .then(res => {
          res.forEach(res => {
            res.type = mapUtil.CHANNELTYPE.assist
          })
          utils.addEntitysToMap(this.keyTypes.pole, res, this.mapMode, this.context)
        })
        .catch(err => {
          console.log('获取辅助杆列表数据失败：', err)
        })
      // 获取视频点位列表
      this.getResourcePointsByChannelType({
        tab: mapUtil.TABTYPE.video,
        channelTypes: mapUtil.CHANNELTYPE.vedioResource
      })
        .then(res => {
          utils.addEntitysToMap(this.keyTypes.vedio, res, this.mapMode, this.context)
        })
        .catch(err => {
          console.log(err)
        })
      // 获取报警（普通报警、消防报警、报警主机报警）点位列表
      let alarmChannelTypes = mapUtil.CHANNELTYPE.commonAlarmResource + ',' + mapUtil.CHANNELTYPE.fireAlarmResource + ',' + mapUtil.CHANNELTYPE.alarmHostResource
      this.getResourcePointsByChannelType({ channelTypes: alarmChannelTypes })
        .then(res => {
          utils.addEntitysToMap(this.keyTypes.alarm, res, this.mapMode, this.context)
        })
        .catch(err => {
          console.log(err)
        })
      // 获取报警求助（报警柱、报警箱）点位列表
      this.getResourcePointsByChannelType({
        tab: mapUtil.TABTYPE.alarmHelp,
        channelTypes: mapUtil.CHANNELTYPE.vedioResource
      })
        .then(res => {
          utils.addEntitysToMap(this.keyTypes.alarmHelp, res, this.mapMode, this.context)
        })
        .catch(err => {
          console.log(err)
        })
      // 获取巡更点位列表
      this.getAllPatrolPoint().then(res => {
        utils.addEntitysToMap(this.keyTypes.patrol, res, this.mapMode, this.context)
      })
      // 加载所有视频通道资源----------结束-----------
    },
    // 返回楼层外
    goBack() {
      if (!this.is3DMapOuter) {
        this.setHighLightList([]) // 清空高亮要素
        this.setIsOuter(true)
        this.setRightPanelType('buildingList')
        this.clearGridHoverFeatures() // 清空网格悬浮要素
        this.clearVideoHoverFeatures() // 清空视频悬浮显示要素
        this.clearAlarmHoverFeatures() // 清空普通报警悬浮显示要素
        this.clearAlarmBoxHoverFeatures() // 清空报警箱悬浮要素
        this.clearAlarmColumnHoverFeatures() // 清空报警柱悬浮要素
        this.clearPatrolHoverFeatures() // 清空巡更悬浮要素
      }
    },
    // 添加支架
    addPole() {
      this.setActive3DPoleDraw(true)
      this.set3DActiveDraw(true)
    },
    // 楼宇列表
    building() {
      if (this.rightPanelShow && this.rightPanelType === 'buildingList') {
        this.setRightPanelShow(false)
      } else {
        this.getAllBuild().then(res => {
          this.setRightPanelShow(true)
          this.setRightPanelType('buildingList')
        })
      }
    },
    // 地图配置
    mapSetting() {
      if (this.mapConfigModal) {
        this.set3DEditConfigModal(false)
      } else {
        this.set3DEditConfigModal(true)
      }
    },
    // 添加网格
    addGrid() {
      if (this.rightPanelShow && this.rightPanelType === 'Map3DGrid') {
        this.setRightPanelShow(false)
      } else {
        this.setRightPanelShow(true)
        this.setRightPanelType('Map3DGrid')
      }
    },
    drawLineStringEnd(param) { // 绘制线结束
      if (param && param.coods && this.selectedPointRes) {
        let coods = JSON.parse(JSON.stringify(param.coods))
        let loc = coods.toString()
        if (this.polygonLoc) {
          loc = this.polygonLoc + '|' + coods.toString()
        }
        // this.resMapSign = MPSIGNKEY.lineString
        this.setPolygonLoc(loc) // 保存绘制的位置
        // let gridFeature = {
        //   geom: {
        //     type: GeometryType.MULTIPOLYLINE,
        //     points: coods
        //   },
        //   attributes: {
        //     id: 'temp'
        //   },
        //   symbol: this.gridConfig.layerStyle
        // }
        // let features = [...this.polygonFeatureList]
        // let vectors = gridUtil.addFeatureToLayer(features, gridFeature)
        // this.setPolygonFeatureList(vectors)
        this.highLightSelectedAreaFeature(this.selectedPointRes.id, loc) // 线绘制完后定位高亮元素
      }
    },
    drawGridFinish(res) { // 绘制网格/区域结束
      let loc = res.coods[0][0].toString()
      const polygonList = this.rightPanelType === 'alarmEditPanel' ? JSON.parse(JSON.stringify(this.polygonFeatureList)) : JSON.parse(JSON.stringify(this.gridFeatureList)) // 右侧面板为报警时，绘制的为区域
      const isInsectorsWithExistFeatures = gridUtil.isInterBetweenMultiPolygon(loc, polygonList) // 重叠判断
      const desc = this.rightPanelType !== 'alarmEditPanel' ? '网格' : '区域' // 右侧面板为报警时，绘制的为区域
      if (isInsectorsWithExistFeatures) {
        this.$Notice.warning({
          title: '提示',
          desc: desc + '有重叠，请重新绘制',
          duration: 2
        })
        this.isDrawGridInter = true
        return this.removeFeature()
      }
      // 判断绘制的多边形是否自相交
      const isSelfIntersects = gridUtil.isSelfIntersects(loc)
      if (isSelfIntersects) {
        this.$Notice.warning({
          title: '提示',
          desc: desc + '自相交，请重新绘制',
          duration: 2
        })
        this.isDrawGridInter = true
        return this.removeFeature()
      }
      let coods = loc
      let isMutiPolygonSelfInterSects = false
      if ((this.rightPanelType === 'alarmEditPanel' && this.polygonLoc) || (this.rightPanelType !== 'alarmEditPanel' && this.gridLoc)) {
        // 判断绘制是否和已经绘制的多边形相交---
        coods = (this.rightPanelType === 'alarmEditPanel' ? this.polygonLoc : this.gridLoc) + '|' + loc
        isMutiPolygonSelfInterSects = gridUtil.isInterMultiPolygon(coods) // 多个多边形之间是否有相交
      }
      if (isMutiPolygonSelfInterSects) {
        this.$Notice.warning({
          title: '提示',
          desc: desc + '内的多个多边形之间有相交，请重新绘制',
          duration: 2
        })
        this.isDrawGridInter = true
        return this.removeFeature()
      }
      this.rightPanelType === 'alarmEditPanel' ? this.setPolygonLoc(coods) : this.setGridLoc(coods) // 保存绘制的位置------右侧面板为报警时，绘制的为区域
      console.log(desc + '绘制完成' + this.gridLoc || this.polygonLoc)
      let gridFeature = {
        geom: {
          type: GeometryType.MULTIPOLYGON,
          points: coods
        },
        attributes: {
          id: 'temp'
        },
        symbol: this.gridConfig.layerStyle
      }
      // this.selectedPointRes && gridFeature.symbol.textStyle && (gridFeature.symbol.textStyle.label = this.selectedPointRes.label)
      let features = [...polygonList]
      let vectors = gridUtil.addFeatureToLayer(features, gridFeature) // 转换图层中正常使用的数据
      this.rightPanelType === 'alarmEditPanel' ? this.setPolygonFeatureList(vectors) : this.setGridList(vectors) // 临时存储绘制的元素------右侧面板为报警时，绘制的为区域
      this.highLightSelectedAreaFeature(this.mapResource._id, coods) // 区域绘制完后定位高亮元素
    },
    removeFeature() {
      let tempFeature = null
      this.$nextTick(() => {
        let gridFeatures = this.$refs.mapFloorContainer
          .getLayer(this.gridConfig.id)
          .getSource()
          .getFeatures()
        gridFeatures.forEach(vector => {
          console.log(vector.get('attributes'))
          if (!vector.get('attributes')) {
            tempFeature = vector
          }
        })
        this.$refs.mapFloorContainer
          .getLayer(this.gridConfig.id)
          .getSource()
          .removeFeature(tempFeature)
      })
    },
    mapViewSetting() {
      console.log('视角配置')
      this.setViewSetting(true)
    },
    initPointData() {
      // 初始化点位数据---韩杰---2018-10-31 11:00:14
      let point = {
        isouter: this.is3DMapOuter, // 是否在楼层外
        principal: [{ name: '', mobile: '' }]
      }
      if (this.is3DMapOuter) {
        // 楼外3D地图时，初始化模型信息
        point.mid = '' // 模型标识
        point.scale = 1.0 // 大小
        point.height = 0 // 高度
        point.heading = 0 // 朝向角
        point.pitch = 0 // 俯仰角
        point.roll = 0 // 滚动角
      }
      return point
    }
  },
  mounted() {
    this.keyTypes = mapUtil.getKeyType() // 获取类型配置信息
    // 获取3D地图配置信息
    this.getMap3DParamConfig()
    // 获取图层设置信息
    this.getLayerSettingsList().then(res => {
      console.log('获取到的图层设置信息：', res)
    }).catch(err => {
      console.log('获取到的图层设置信息失败：', err)
    })
  },
  beforeDestroy() {
    this.setReady(false)
    this.relieveMapListeners() // 解除地图监听
    this.context && this.context.viewer.destroy()
  },
  mixins: [VideoLayer, alarm, alarmHelp, grid, patrol]
}
</script>

<style>
</style>
