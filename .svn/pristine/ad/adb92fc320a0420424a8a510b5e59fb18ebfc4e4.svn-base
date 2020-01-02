// 要素绘制处理逻辑
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { RESOURCETYPE, RESICONOID, MPSIGNKEY, POINTSTATE } from 'assets/2DMap/meta/common'
import drawConfig from 'assets/2DMap/meta/draw'
import styleConfig from 'assets/2DMap/meta/style'
import areaUtil from 'assets/2DMap/areaUtil'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import highLight from 'assets/2DMap/feature/edit/highLight'
export default {
  data() {
    return {
      pointDraw: JSON.parse(JSON.stringify(drawConfig.boltipc)), // 点位绘制，默认是枪机
      lineStringDraw: JSON.parse(JSON.stringify(drawConfig.commonAlarmLine)), // 线绘制，默认是普通报警
      polygonDraw: JSON.parse(JSON.stringify(drawConfig.grid)), // 多边形绘制，默认是网格
      currentEditFeature: null,
      isDrawAreaInter: false, // 绘制区域是否相交
      isReDrawFeature: false, // 要素是否重绘
      resMapSign: null // 资源地图标志
    }
  },
  computed: {
    ...mapGetters({
      mapEditRightPage: 'mapEditRightPage', // 右侧变价面板
      pointDrawActive: 'pointDrawActive', // 点绘制状态
      lineDrawActive: 'lineDrawActive', // 线绘制状态
      areaDrawActive: 'areaDrawActive', // 区域绘制状态
      drawFeatureLoc: 'drawFeatureLoc', // 区域绘制位置
      drawFeatureStyle: 'drawFeatureStyle', // 绘制样式
      currentGrid: 'currentGrid', // 当前网格数据
      currentBuilding: 'currentBuilding', // 当前楼宇数据
      selectedTreeNode: 'selectedTreeNode', // 当前地图选中的树节点数据
      selectedPointRes: 'selectedMapPointRes', // 当前地图选中的点位资源数据
      editActive: 'featureEditActive', // 要素编辑状态
      pointIcon: 'defaultPointIcon' // 默认点位图标
    })
  },
  watch: {
    pointDrawActive(flag) { // 点位绘制是否激活
      this.updatePointDrawer(flag) // 更新点位绘制工具
    },
    lineDrawActive(flag) { // 线位绘制是否激活
      this.updateLineDrawer(flag) // 更新线绘制工具
    },
    areaDrawActive(flag) { // 区域绘制是否激活
      this.updateAreaDrawer(flag) // 更新区域绘制工具
    },
    editActive(flag) { // 要素编辑状态
      if (!flag) {
        this.currentEditFeature = null
        if (this.isDrawAreaInter) { // 绘制的区域相交时，开启区域编辑绘制工具
          this.handleEditAreaIntersect() // 处理编辑区域相交
        }
      }
    },
    drawFeatureStyle(val) { // 绘制样式变化
      if (val) {
        let style = JSON.parse(JSON.stringify(val))
        this.updateFeatureStyle(style)
      }
    },
    currentGrid: { // 当前网格数据变化
      handler(newData, oldData) {
        if (this.mapEditRightPage.page === 'gridEditPage') {
          if (newData) {
            this.handleCurrentGridChange(newData)
          } else if (oldData) {
            let nowGrid = JSON.parse(JSON.stringify(oldData))
            this.refreshCurrentGridFeature(nowGrid)
          }
        }
      },
      deep: true,
      immediate: true
    },
    currentBuilding: { // 当前楼宇数据变化
      handler(newData, oldData) {
        if (this.mapEditRightPage.page === 'buildEditPage') {
          if (newData) {
            this.handleCurrentBuildingChange(newData)
          } else if (oldData) {
            let nowBuilding = JSON.parse(JSON.stringify(oldData))
            this.refreshCurrentBuildingFeature && this.refreshCurrentBuildingFeature(nowBuilding)
          }
        }
      },
      deep: true,
      immediate: true
    },
    selectedPointRes: { // 当前选中的点位资源变化
      handler(newData, oldData) {
        this.onSelectedPointResChange(newData, oldData) // 处理选中点位资源的变化
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations([
      'SET_EDIT_RIGHT_PAGE_STATE', // 设置右侧编辑页状态
      'SET_AREA_DRAW_ACTIVE_WITHOUT_CLEAR', // 清空区域绘制状态，不清空绘制位置信息
      'SET_FEATURE_EDIT_ACTIVE_WITHOUT_CLEAR', // 清空编辑区域绘制状态，不清空绘制位置信息
      'SET_DRAW_FEATURE_LOC', // 设置区域绘制坐标
      'SET_LOCATE_FEATURES', // 设置高亮定位要素
      'SET_VIDEO_SECTOR_FEATURES', // 设置高亮定位要素
      'SET_FEATURE_EDIT_ACTIVE', // 设置要素编辑状态
      'SET_POINT_DRAW_ACTIVE', // 设置点位绘制是否是激活
      'SET_LINE_DRAW_ACTIVE', // 设置线绘制激活状态
      'SET_AREA_DRAW_ACTIVE' // 设置区域绘制是否是激活
    ]),
    ...mapActions([]),
    updateFeatureStyle(style) { // 更新区域样式
      this.polygonDraw.drawStyle = areaUtil.convertStyleToSymbol(this.polygonDraw.drawStyle, style)
      this.polygonDraw.layerStyle = areaUtil.convertStyleToSymbol(this.polygonDraw.layerStyle, style)
      this.lineStringDraw.drawStyle = areaUtil.convertStyleToSymbol(this.lineStringDraw.drawStyle, style)
      this.lineStringDraw.layerStyle = areaUtil.convertStyleToSymbol(this.lineStringDraw.layerStyle, style)
      if (this.editActive) { // 要素编辑时
        let rightPage = this.mapEditRightPage.page
        let pointPages = ['videoPage', 'alarmPage', 'alarmHelp', 'patrolEditPage', 'doorControlEditPage']
        if (pointPages.includes(rightPage) && this.selectedPointRes && this.selectedPointRes.hasOwnProperty('rType')) {
          this.updateResourceFeatureStyle(style) // 更新资源要素样式
        } else {
          this.updateAreaFeatureStyle(style) // 更新区域要素样式
        }
      }
    },
    updateResourceFeatureStyle(style) { // 更新资源要素样式
      let pointRes = JSON.parse(JSON.stringify(this.selectedPointRes))
      if (pointRes.mapsign) {
        pointRes.mapsign.signtype = this.resMapSign
        let {mapsign, rType} = pointRes
        if (mapsign.signtype !== MPSIGNKEY.point) {
          pointRes.point.style = style
          pointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : pointRes.point.loc
          if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
            this.refreshCurrentCommonAlarmFeature(pointRes)
          } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
            this.refreshCurrentFireAlarmFeature(pointRes)
          } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
            this.refreshCurrentAlarmHostFeature(pointRes)
          }
        }
      }
    },
    updateAreaFeatureStyle(style) { // 更新区域要素样式
      let rightPage = this.mapEditRightPage.page
      if (this.currentGrid && rightPage === 'gridEditPage') { // 右侧是网格编辑面板时
        let nowGrid = JSON.parse(JSON.stringify(this.currentGrid))
        nowGrid.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowGrid.loc
        nowGrid.style = style
        this.refreshCurrentGridFeature(nowGrid)
      } else if (this.isMapOuter && this.currentBuilding && rightPage === 'buildEditPage') { // 右侧是楼宇编辑面板时
        let nowBuilding = JSON.parse(JSON.stringify(this.currentBuilding))
        nowBuilding.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowBuilding.loc
        nowBuilding.style = style
        this.refreshCurrentBuildingFeature(nowBuilding)
      }
    },
    handleCurrentGridChange(data) { // 处理当前网格数据变化
      // console.log('当前网格数据变化：', data)
      let { _id, center } = data
      let centerCoordinates = center.split(',').map(item => Number(item))
      this.highLightLocateInMapCenter(_id, centerCoordinates, true)
      this.currentEditFeature = this.getFeatureById(this.gridLayer.id, _id)
      this.currentEditFeature && this.SET_FEATURE_EDIT_ACTIVE(true)
    },
    handleCurrentBuildingChange(data) { // 处理当前楼宇数据变化
      // console.log('当前楼宇数据变化：', data)
      if (this.isMapOuter && this.buildingLayer) { // 楼外地图时，定位到楼宇中心，设置当前编辑楼宇要素
        let { _id, center } = data
        let centerCoordinates = center.split(',').map(item => Number(item))
        this.highLightLocateInMapCenter(_id, centerCoordinates, true)
        this.currentEditFeature = this.getFeatureById(this.buildingLayer.id, _id)
        this.currentEditFeature && this.SET_FEATURE_EDIT_ACTIVE(true)
      }
    },
    onSelectedPointResChange(newData, oldData) { // 选择点位资源变化
      if (newData) {
        let {rType, mapsign, point} = newData
        if (mapsign) { // 有地图标识时，初始化地图标识
          this.resMapSign = mapsign.signtype
        }
        if (point) { // 点位已存在时
          this.SET_POINT_DRAW_ACTIVE(false) // 清空绘制点工具
          this.SET_LINE_DRAW_ACTIVE(false) // 清空绘制线工具
          this.SET_AREA_DRAW_ACTIVE(false) // 清空绘制面工具
          if (rType === RESOURCETYPE.video) { // 视频
          } else if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
            this.initCurrentCommonAlarmFeature(newData) // 初始化当前普通报警要素
          } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
            this.initCurrentFireAlarmFeature(newData) // 初始化当前消防报警要素
          } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
            this.initCurrentAlarmHostFeature(newData) // 初始化当前报警主机要素
          } else if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
            this.initCurrentAlarmColumnFeature(newData) // 初始化当前报警柱要素
          } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
            this.initCurrentAlarmBoxFeature(newData) // 初始化当前报警箱要素
          } else if (rType === RESOURCETYPE.patrol) { // 巡更
            this.initCurrentPatrolFeature(newData) // 初始化当前巡更要素
          } else if (rType === RESOURCETYPE.doorControl) { // 门禁
            this.initCurrentDoorControlFeature(newData) // 初始化当前门禁要素
          }
          this.highlightLocateFeature(newData)
        } else {
          this.SET_FEATURE_EDIT_ACTIVE(false) // 关闭要素编辑状态
        }
        if (oldData && oldData.point) { // 还原旧的选择点位要素
          this.revertOldSelectPointFeature(oldData)
        }
      } else if (oldData && oldData.point) {
        this.SET_LOCATE_FEATURES([])
        this.revertOldSelectPointFeature(oldData) // 还原旧的选择点位要素
      }
    },
    revertOldSelectPointFeature(oldData) { // 还原旧的选择点位要素
      let nowPointRes = JSON.parse(JSON.stringify(oldData))
      let rType = nowPointRes.rType
      if (rType === RESOURCETYPE.video) { // 视频
        this.refreshCurrentVideoFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
        this.refreshCurrentCommonAlarmFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
        this.refreshCurrentFireAlarmFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
        this.refreshCurrentAlarmHostFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
        this.refreshCurrentAlarmColumnFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
        this.refreshCurrentAlarmBoxFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.patrol) {
        this.refreshCurrentPatrolFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.doorControl) { // 门禁
        this.refreshCurrentDoorControlFeature(nowPointRes)
      }
    },
    highlightLocateFeature(data) { // 高亮点位要素
      let { _id, point, mapsign } = data
      let loc = point.geo || point.loc
      let centerCoordinates = loc.split(',').map(item => Number(item))
      if (mapsign) {
        if (mapsign.signtype === MPSIGNKEY.lineString) { // 线
          centerCoordinates = spaceUtil.getMultiLineStringCenter(loc)
        } else if (mapsign.signtype === MPSIGNKEY.polygon) { // 面
          centerCoordinates = spaceUtil.getMultiPolygonCenter(loc)
        }
      }
      if (centerCoordinates) {
        this.highLightLocateInMapCenter(_id, centerCoordinates) // 高亮定位到地图中心
      }
    },
    highLightLocateInMapCenter(id, coods, isZone = false) {
      if (isZone) { // 区域（楼宇、网格）时
        this.locateInMapCenter(coods)
      } else if (this.selectedPointRes && this.selectedTreeNode && this.selectedTreeNode.type === this.selectedPointRes.rType && this.selectedTreeNode._id === this.selectedPointRes._id) { // 选中树节点时，需要定位到地图中心
        this.locateInMapCenter(coods)
      }
      let feature = highLight.getLocateFeature(id, coods)
      this.SET_LOCATE_FEATURES([feature])
    },
    handleEditAreaIntersect() { // 处理编辑区域相交
      this.isDrawAreaInter = false
      this.SET_FEATURE_EDIT_ACTIVE_WITHOUT_CLEAR(true)
      let editPage = this.mapEditRightPage.page
      if (this.selectedPointRes && editPage === 'alarmPage') { // 报警编辑页面
        let {_id, rType, point} = this.selectedPointRes
        rType && this.refreshResourceFeature(rType) // 刷新要素资源
        let loc = this.drawFeatureLoc ? this.drawFeatureLoc : point.loc
        let centerCoordinates = spaceUtil.getMultiPolygonCenter(loc) // 获取面要素的中心点
        if (centerCoordinates) {
          this.highLightLocateInMapCenter(_id, centerCoordinates) // 高亮定位到地图中心
        }
      } else if (this.currentGrid && this.mapEditRightPage.page === 'gridEditPage') { // 网格编辑页面
        let nowGrid = JSON.parse(JSON.stringify(this.currentGrid))
        nowGrid.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowGrid.loc
        nowGrid.style = this.drawFeatureStyle ? this.drawFeatureStyle : nowGrid.style
        this.refreshCurrentGridFeature(nowGrid)
      } else if (this.currentBuilding && this.mapEditRightPage.page === 'buildEditPage') { // 楼宇编辑页面
        let nowBuilding = JSON.parse(JSON.stringify(this.currentBuilding))
        nowBuilding.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowBuilding.loc
        nowBuilding.style = this.drawFeatureStyle ? this.drawFeatureStyle : nowBuilding.style
        this.refreshCurrentBuildingFeature(nowBuilding)
      }
    },
    updateAreaDrawer(flag) { // 更新区域绘制工具
      if (flag) { // 激活绘制
        let areaDraw = this.getAreaDrawerByResource(flag)
        if (areaDraw && areaDraw.actived) {
          let style = this.drawFeatureStyle ? this.drawFeatureStyle : styleConfig.defaultArea
          areaDraw.drawStyle = areaUtil.convertStyleToSymbol(areaDraw.drawStyle, JSON.parse(JSON.stringify(style)))
          areaDraw.layerStyle = areaUtil.convertStyleToSymbol(areaDraw.layerStyle, JSON.parse(JSON.stringify(style)))
          this.polygonDraw = areaDraw
        }
        if (this.isDrawAreaInter) { // 绘制的区域相交时
          this.redrawAreaFeatureByGeom() // 重绘区域要素
        }
      } else { // 关闭绘制
        this.polygonDraw.actived = flag
        this.clearFeaturesInLayer(this.polygonDraw.id) // 清空绘制区域要素
        if (this.isDrawAreaInter) { // 绘制的区域相交时，开启区域绘制工具
          this.SET_AREA_DRAW_ACTIVE_WITHOUT_CLEAR(true)
        }
      }
    },
    getAreaDrawerByResource(flag) { // 根据资源获取区域绘制工具样式
      let rightPage = this.mapEditRightPage.page
      let areaDraw = null
      if (this.selectedPointRes && this.selectedPointRes.hasOwnProperty('rType')) {
        let {rType} = this.selectedPointRes
        if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
          areaDraw = JSON.parse(JSON.stringify(drawConfig.commonAlarmArea))
          areaDraw.actived = flag
        } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
          areaDraw = JSON.parse(JSON.stringify(drawConfig.fireAlarmArea))
          areaDraw.actived = flag
        } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
          areaDraw = JSON.parse(JSON.stringify(drawConfig.alarmHostArea))
          areaDraw.actived = flag
        }
        if (areaDraw) {
          let iconUrl = this.getTargetPointIconUrl() // 获取指定图标地址
          if (iconUrl) {
            areaDraw.drawStyle.iconStyle.url = iconUrl
          }
        }
      } else if (rightPage === 'gridEditPage') { // 右侧是网格编辑面板时
        areaDraw = JSON.parse(JSON.stringify(drawConfig.grid))
        areaDraw.actived = flag
      } else if (rightPage === 'buildEditPage') { // 右侧是楼宇编辑面板时
        areaDraw = JSON.parse(JSON.stringify(drawConfig.building))
        areaDraw.actived = flag
      }
      return areaDraw
    },
    redrawAreaFeatureByGeom() {
      this.isDrawAreaInter = false // 改变相交状态
      let polygonDrawer = null
      let polygonDrawers = this.$refs.polygonDrawer
      if (this.isMapOuter && polygonDrawers && polygonDrawers.length > 0) {
        polygonDrawer = polygonDrawers[0]
      } else {
        polygonDrawer = polygonDrawers
      }
      if (polygonDrawer && polygonDrawer.redrawFeatureByGeom) {
        // console.log('区域相交重新绘制: ', this.drawFeatureLoc)
        polygonDrawer.redrawFeatureByGeom(this.drawFeatureLoc) // 根据位置重绘区域
      }
    },
    getTargetPointIconUrl() { // 获取指定图标地址
      let iconUrl = null
      let {files, oid} = this.pointIcon
      let status = oid === RESICONOID.doorControl ? POINTSTATE.OPEN : POINTSTATE.ONLINE
      if (files && files instanceof Array) {
        for (const file of files) {
          if (file.status === status) {
            iconUrl = file.path
            break
          }
        }
      }
      return iconUrl
    },
    updateLineDrawer(flag) { // 更新线绘制工具
      if (flag) { // 激活绘制
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
          let style = this.drawFeatureStyle ? this.drawFeatureStyle : styleConfig.defaultLine
          lineDraw.drawStyle = areaUtil.convertStyleToSymbol(lineDraw.drawStyle, JSON.parse(JSON.stringify(style)))
          lineDraw.layerStyle = areaUtil.convertStyleToSymbol(lineDraw.layerStyle, JSON.parse(JSON.stringify(style)))
          this.lineStringDraw = lineDraw
        }
      } else { // 关闭绘制
        this.lineStringDraw.actived = flag
        this.clearFeaturesInLayer(this.lineStringDraw.id) // 清空绘制区域要素
      }
    },
    updatePointDrawer(flag) { // 更新点位绘制工具
      if (flag) {
        let iconDraw = this.getIconPointDraw(this.pointIcon.oid) // 获取图白哦点绘制样式
        let iconUrl = this.getTargetPointIconUrl() // 获取指定图标地址
        if (iconUrl) {
          iconDraw.drawStyle.iconStyle.url = iconUrl
        }
        iconDraw.actived = flag
        this.pointDraw = iconDraw
      } else {
        this.pointDraw.actived = flag
        this.clearFeaturesInLayer(this.pointDraw.id) // 清空绘制点位要素
      }
    },
    getIconPointDraw(oid) { // 获取点位图标绘制工具
      let iconDraw = JSON.parse(JSON.stringify(this.pointDraw))
      if (oid === RESICONOID.boltipc) { // 视频-枪机
        iconDraw = JSON.parse(JSON.stringify(drawConfig.boltipc))
      } else if (oid === RESICONOID.redBoltipc) { // 视频-红外枪机
        iconDraw = JSON.parse(JSON.stringify(drawConfig.redBoltipc))
      } else if (oid === RESICONOID.halfBallipc) { // 视频-半球
        iconDraw = JSON.parse(JSON.stringify(drawConfig.halfBallipc))
      } else if (oid === RESICONOID.fastBallipc) { // 视频-快球
        iconDraw = JSON.parse(JSON.stringify(drawConfig.fastBallipc))
      } else if (oid === RESICONOID.allViewipc) { // 视频-全景
        iconDraw = JSON.parse(JSON.stringify(drawConfig.allViewipc))
      } else if (oid === RESICONOID.commonAlarm) { // 普通报警
        iconDraw = JSON.parse(JSON.stringify(drawConfig.commonAlarm))
      } else if (oid === RESICONOID.fireAlarm) { // 消防报警
        iconDraw = JSON.parse(JSON.stringify(drawConfig.fireAlarm))
      } else if (oid === RESICONOID.alarmHost) { // 报警主机
        iconDraw = JSON.parse(JSON.stringify(drawConfig.alarmHost))
      } else if (oid === RESICONOID.alarmBox) { // 报警箱
        iconDraw = JSON.parse(JSON.stringify(drawConfig.alarmBox))
      } else if (oid === RESICONOID.alarmColumn) { // 报警柱
        iconDraw = JSON.parse(JSON.stringify(drawConfig.alarmColumn))
      } else if (oid === RESICONOID.commonPatrol) { // 巡更
        iconDraw = JSON.parse(JSON.stringify(drawConfig.patrol))
      } else if (oid === RESICONOID.doorControl) { // 门禁
        iconDraw = JSON.parse(JSON.stringify(drawConfig.doorControl))
      }
      return iconDraw
    },
    drawPolygonEnd(param) { // 多边形绘制完成
      if (this.mapEditRightPage.page === 'alarmPage') { // 报警（普通报警、消防报警、报警主机）
        this.resMapSign = MPSIGNKEY.polygon
      }
      // console.log('多边形绘制完成：', param)
      // console.log('绘制坐标记录：', JSON.parse(JSON.stringify(this.drawFeatureLoc)))
      let loc = areaUtil.locSwitch(param, this.drawFeatureLoc)
      // console.log('绘制多边形要素坐标：', loc)
      this.getAreaCheckParam(loc)
    },
    refreshResourceFeature(rType, icon) { // 刷新资源要素
      let nowPointRes = JSON.parse(JSON.stringify(this.selectedPointRes))
      if (nowPointRes.mapsign) {
        nowPointRes.mapsign.signtype = this.resMapSign
        if (nowPointRes.mapsign.signtype !== MPSIGNKEY.point) {
          nowPointRes.point.style = this.drawFeatureStyle ? this.drawFeatureStyle : nowPointRes.point.style
        }
      }
      if (rType === RESOURCETYPE.video) { // 普通报警
        if (icon && icon.oid === nowPointRes.type + '' + nowPointRes.monitortype) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentVideoFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
        if (icon && icon.oid === RESICONOID.commonAlarm) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentCommonAlarmFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
        if (icon && icon.oid === RESICONOID.fireAlarm) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentFireAlarmFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
        if (icon && icon.oid === RESICONOID.alarmHost) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentAlarmHostFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
        if (icon && icon.oid === RESICONOID.alarmColumn) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentAlarmColumnFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
        if (icon && icon.oid === RESICONOID.alarmBox) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentAlarmBoxFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.patrol) { // 巡更
        if (icon && icon.oid === RESICONOID.commonPatrol) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.geo = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.geo
        this.refreshCurrentPatrolFeature(nowPointRes)
      } else if (rType === RESOURCETYPE.doorControl) { // 门禁
        if (icon && icon.oid === RESICONOID.doorControl) { // 更换图标
          nowPointRes.point.mid = icon
        }
        nowPointRes.point.loc = this.drawFeatureLoc ? this.drawFeatureLoc : nowPointRes.point.loc
        this.refreshCurrentDoorControlFeature(nowPointRes)
      }
    },
    addResourceToMap(rType, coods) { // 添加资源到地图中
      if (rType === RESOURCETYPE.video) { // 普通报警
        this.addVideoResToMap(coods)
      } else if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
        this.addCommonAlarmResToMap(coods)
      } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
        this.addFireAlarmResToMap(coods)
      } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
        this.addAlarmHostResToMap(coods)
      } else if (rType === RESOURCETYPE.alarmColumn) { // 报警柱
        this.addAlarmColumnResToMap(coods)
      } else if (rType === RESOURCETYPE.alarmBox) { // 报警箱
        this.addAlarmBoxResToMap(coods)
      } else if (rType === RESOURCETYPE.patrol) { // 巡更
        this.addPatrolResToMap(coods)
      } else if (rType === RESOURCETYPE.doorControl) { // 门禁
        this.addDoorControlResToMap(coods)
      }
    },
    getAreaCheckParam(loc) { // 获取区域检验参数并检验
      let featureArr = this.filterFeaturesByEditPage() // 需要检测的要素数组
      let obj = { // 参数
        id: 'add',
        loc,
        featureArr
      }
      obj && this.checkInterArea(obj)
    },
    filterFeaturesByEditPage() { //  根据编辑页面过滤要素
      let featureArr = []
      let page = this.mapEditRightPage.page
      if (page === 'alarmPage') { // 报警（普通报警、消防报警、报警主机）
        if (this.selectedPointRes && this.selectedPointRes.hasOwnProperty('rType')) {
          let { rType } = this.selectedPointRes.rType
          if (rType === RESOURCETYPE.commonAlarm) { // 普通报警
            featureArr = this.commonAlarms.filter(item => item.attributes.id !== this.selectedPointRes._id)
          } else if (rType === RESOURCETYPE.fireAlarm) { // 消防报警
            featureArr = this.fireAlarms.filter(item => item.attributes.id !== this.selectedPointRes._id)
          } else if (rType === RESOURCETYPE.alarmHost) { // 报警主机
            featureArr = this.alarmHosts.filter(item => item.attributes.id !== this.selectedPointRes._id)
          }
        }
      } if (page === 'gridEditPage') { // 网格编辑
        featureArr = this.grids
        if (this.currentGrid && this.currentGrid._id) { // 编辑网格时，过滤当前网格
          featureArr = this.grids.filter(item => item.attributes.id !== this.currentGrid._id)
        }
      } else if (page === 'buildEditPage') { // 编辑网格时，过滤当前楼宇
        featureArr = this.buildings
        if (this.currentBuilding && this.currentBuilding._id) { // 编辑楼宇时，过滤当前楼宇
          featureArr = this.buildings.filter(item => item.attributes.id !== this.currentBuilding._id)
        }
      }
      // console.log('需要检验是否相交的要素列表：', JSON.parse(JSON.stringify(featureArr)))
      return featureArr
    },
    checkInterArea(obj) { // 检验区域是否相交
      const { loc, id, featureArr } = obj
      let isObj = areaUtil.checkInterArea({ loc, id, featureArr })
      if (isObj.isSelfIn || isObj.isIn || isObj.isInter) {
        this.$Notice.warning({
          title: '提示',
          desc: '区域有重叠，请重新绘制',
          duration: 2
        })
        this.isDrawAreaInter = true
        if (this.polygonDraw.actived) {
          this.SET_AREA_DRAW_ACTIVE_WITHOUT_CLEAR(false)
        } else if (this.editActive) {
          this.SET_FEATURE_EDIT_ACTIVE_WITHOUT_CLEAR(false)
        }
      } else {
        this.SET_DRAW_FEATURE_LOC(loc)
        let editPage = this.mapEditRightPage.page
        if (editPage === 'alarmPage' && this.selectedPointRes) { // 报警编辑页面，定位要素
          let {_id, point} = this.selectedPointRes
          let loc = this.drawFeatureLoc ? this.drawFeatureLoc : point.loc
          this.drawMultiPolygonEndLocate(_id, loc)
        }
      }
    },
    drawPointEnd(param) { // 点绘制完成
      // console.log('点要素绘制完成：', param)
      if (this.selectedPointRes && this.selectedPointRes.hasOwnProperty('rType')) {
        this.SET_POINT_DRAW_ACTIVE(false) // 关闭点位绘制状态
        let {coods} = param
        let rType = this.selectedPointRes.rType
        if (this.selectedPointRes.point) { // 点位已标注
          this.SET_FEATURE_EDIT_ACTIVE(true)
          this.highLightLocateInMapCenter(this.selectedPointRes._id, coods) // 高亮定位到地图中心
          this.resMapSign = MPSIGNKEY.point
          this.SET_DRAW_FEATURE_LOC(coods.toString())
          this.refreshResourceFeature(rType)
        } else {
          this.addResourceToMap(rType, coods) // 添加资源到地图中
        }
      }
    },
    editFeatureStart(coods) { // 编辑要素开始
      // console.log('编辑要素开始', coods)
      let page = this.mapEditRightPage.page
      let pointPages = ['videoPage', 'alarmPage', 'alarmHelp', 'patrolEditPage', 'doorControlEditPage']
      if (pointPages.includes(page)) {
        if (this.selectedPointRes && this.selectedPointRes.rType === RESOURCETYPE.video) {
          let videoSectors = this.matchVideoFeatureArr(this.selectedPointRes.monitortype)
          let featureArr = videoSectors.filter(item => item.attributes.id !== this.selectedPointRes._id)
          this.SET_VIDEO_SECTOR_FEATURES(featureArr)
        }
        this.SET_LOCATE_FEATURES([])
      }
    },
    editFeatureEnd(coods) { // 编辑要素结束
      // console.log('编辑要素结束', coods)
      let page = this.mapEditRightPage.page
      let areaPages = ['buildEditPage', 'gridEditPage'] // 区域页面
      if (areaPages.includes(page)) {
        this.editPolygonFeatureEnd(coods) // 编辑多边形要素结束
      } else {
        if (page === 'alarmPage' && this.selectedPointRes && this.selectedPointRes.mapsign) { // 报警页面
          let {mapsign} = this.selectedPointRes
          if (mapsign.signtype === MPSIGNKEY.lineString) { // 线
            this.editLineStringFeatureEnd(coods)
          } else if (mapsign.signtype === MPSIGNKEY.polygon) { // 面
            this.editPolygonFeatureEnd(coods) // 编辑多边形要素结束
          } else {
            this.editPointFeatureEnd(coods, this.pointIcon) // 编辑点要素结束
          }
        } else {
          this.editPointFeatureEnd(coods, this.pointIcon) // 编辑点要素结束
        }
      }
    },
    editPointFeatureEnd(coods, icon) { // 编辑点要素结束
      if (this.selectedPointRes && this.selectedPointRes._id) {
        let {_id, rType} = this.selectedPointRes
        let centerCoordinates = coods
        let coodsLoc = coods.toString()
        this.SET_DRAW_FEATURE_LOC(coodsLoc) // 设置点位绘制位置
        this.refreshResourceFeature(rType, icon)
        this.highLightLocateInMapCenter(_id, centerCoordinates) // 高亮定位要素
      }
    },
    editLineStringFeatureEnd(coods) { // 编辑线要素结束
      if (this.selectedPointRes && this.selectedPointRes._id) {
        let {_id, rType} = this.selectedPointRes
        let loc = ''
        for (const coodsItem of coods) {
          loc += coodsItem.toString() + '|'
        }
        loc = loc.substr(0, loc.length - 1)
        this.SET_DRAW_FEATURE_LOC(loc) // 设置要素位置
        this.refreshResourceFeature(rType)
        this.drawMultiLineStringEndLocate(_id, loc)
      }
    },
    editPolygonFeatureEnd(coods) { // 编辑多边形要素结束
      // console.log('编辑多边形要素结束：', coods)
      let loc = areaUtil.consistMuPolyCoods(coods)
      // console.log('多边形要素坐标：', loc)
      this.getAreaCheckParam(loc)
    },
    drawLineStringEnd(param) { // 绘制线结束
      // console.log('绘制线结束：', param)
      if (param && param.coods && this.selectedPointRes) {
        let coods = JSON.parse(JSON.stringify(param.coods))
        let loc = coods.toString()
        if (this.drawFeatureLoc) {
          loc = this.drawFeatureLoc + '|' + coods.toString()
        }
        this.resMapSign = MPSIGNKEY.lineString
        this.SET_DRAW_FEATURE_LOC(loc)
        this.drawMultiLineStringEndLocate(this.selectedPointRes._id, loc) // 面绘制完后定位
      }
    },
    drawMultiLineStringEndLocate(id, loc) { // 面绘制完后定位
      let centerCoordinates = spaceUtil.getMultiLineStringCenter(loc)
      if (centerCoordinates) {
        this.highLightLocateInMapCenter(id, centerCoordinates) // 高亮定位到地图中心
      }
    },
    drawMultiPolygonEndLocate(id, loc) { // 面绘制完后定位
      let centerCoordinates = spaceUtil.getMultiPolygonCenter(loc) // 获取面要素的中心点
      if (centerCoordinates) {
        this.highLightLocateInMapCenter(id, centerCoordinates) // 高亮定位到地图中心
      }
    }
  }
}
