// 地图事件处理逻辑
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { RESOURCETYPE } from 'src/assets/2DMap/meta/common'
export default {
  computed: {
    ...mapState({
      normalAlarmList: ({ mapAlarm }) => mapAlarm.normalAlarmList, // 普通报警列表
      fireAlarmList: ({ mapAlarm }) => mapAlarm.fireAlarmList, // 消防报警列表
      alarmHelpList: ({ mapAlarm }) => mapAlarm.alarmHelpList, // 报警求助列表
      videoAlarmList: ({ mapAlarm }) => mapAlarm.videoAlarmList, // 视频报警列表
      intelligentAlarmList: ({ mapAlarm }) => mapAlarm.intelligentAlarmList, // 智能报警列表
      alarmTabData: ({ mapAlarm }) => mapAlarm.alarmTabData
    }),
    ...mapGetters(['areaDrawActive']),
    ...mapGetters('patrol2DAlarm', ['singleAllList']),
    ...mapGetters('map2DApplyIX', ['isPointChoose', 'isPlatformTrack'])
  },
  methods: {
    ...mapMutations(['SET_MAP_RESOURCE_ATTRIBUTES', 'PUSH_VIDEO_DATA_LIST', 'PUSH_PLAYBACK_VIDEO_DATA_LIST', 'PUSH_SINGLE_DATA_LIST']),
    ...mapMutations('mapAlarm', ['GET_ALARM_MODAL_TYPE', 'CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'UPDATE_CURBUILD_DATA']),
    ...mapMutations('patrol2DAlarm', ['GET_PATROL_TYPE', 'SAVE_PATROL_STUATES', 'SAVE_SINGLE_DATA', 'SAVE_PATROL_DATA']),
    ...mapActions('map2DApplyIX', ['changeToolsPanelToBoxChoose', 'changeIsPointChoose']),
    ...mapActions(['setSelectedAttr', 'getCommonResourceById', 'getBuildingDataById', 'getBuildingData', 'getSingleDataById', 'getGridDataById', 'getPatrolDataById', 'updatePointVideoList', 'getCommonPointResById', 'getSinglePointById', 'setSelectedMapPointRes', 'getDoorControlPointResById', 'setSelectedTreeNode']),
    handlePointChooseHit(param) { // 处理点选选中要素
      // this.changeIsPointChoose(false) // 关闭点选
      let attr = JSON.parse(JSON.stringify(param.attributes))
      if (attr.rType === RESOURCETYPE.video) { // 视频
        this.getCommonPointResById(attr.id).then((res) => {
          let video = JSON.parse(JSON.stringify(res))
          if (res.eid.deviceStatus === 1 && res.status === 1) {
            video.ip = video.eid.ip
            video.port = video.eid.cport
            if (this.isPlatformTrack) {
              this.PUSH_PLAYBACK_VIDEO_DATA_LIST(video)
            } else {
              this.PUSH_VIDEO_DATA_LIST(video)
            }
          } else {
            this.warningMsg('该设备不在线！')
          }
          this.changeToolsPanelToBoxChoose('boxChoose')
        })
      }
      if (attr.rType === RESOURCETYPE.single) { // 单兵
        this.getSinglePointById(attr.id).then((res) => {
          this.PUSH_SINGLE_DATA_LIST(res)
          this.changeToolsPanelToBoxChoose('boxChoose')
        })
      }
    },
    handleMapClick(param) { // 处理地图单击事件
      if (this.measureMode2D.panelVisible && this.measureMode2D.isMeasure) { // 量算时 | 接力追踪模式
        return
      }
      if (this.areaDrawActive) { // 框选时
        return
      }
      if (this.isPointChoose && param.attributes) { // 点选时
        this.handlePointChooseHit(param) // 处理点选选中要素
      } else {
        if (this.isPlatformTrack) {
          this.SET_LOCATE_FEATURES([])
          if (param.attributes && param.attributes.rType !== RESOURCETYPE.building) {
            return
          }
        }
        console.log('处理地图单击事件，选中的数据：', param)
        if (param.attributes) {
          this.setSelectedTreeNode(null) // 清空设置选中的树节点
          let attr = JSON.parse(JSON.stringify(param.attributes))
          this.handleHighLightEffect(attr) // 处理高亮效果
          this.setSelectedAttr(attr)
          switch (attr.rType) {
            case RESOURCETYPE.video:
            case RESOURCETYPE.commonAlarm:
            case RESOURCETYPE.fireAlarm:
            case RESOURCETYPE.alarmHost:
            case RESOURCETYPE.alarmBox:
            case RESOURCETYPE.alarmColumn:
              this.getCommonResourceById(attr.id).then(res => {
                this.setSelectedMapPointRes(res)
              })
              break
            case RESOURCETYPE.patrol:
              this.getPatrolDataById(attr.id).then(res => {
                this.setSelectedMapPointRes(res)
              })
              break
            case RESOURCETYPE.doorControl: // 门禁
              this.getDoorControlPointResById(attr.id).then(res => {
                this.SET_MAP_RESOURCE_ATTRIBUTES({ res: {data: res}, type: RESOURCETYPE.doorControl })
                this.setSelectedMapPointRes(res)
              })
              break
            case RESOURCETYPE.single:
              this.getSingleDataById(attr.id).then(res => {
                this.setSelectedMapPointRes(res)
              })
              break
            case RESOURCETYPE.grid:
              this.getGridDataById(attr.id).then(res => {
                this.handleSelectGrid(res) // 处理选中网格
              })
              break
            case RESOURCETYPE.building:
              const arr = this.alarmTabData.filter(item => { return item.point && item.point.bid === attr.id })
              if (arr.length && !this.isPlatformTrack) {
                this.getBuildingData(attr.id).then(res => {
                  if (arr.length && !this.isPlatformTrack) {
                    this.SET_MAP_RESOURCE_ATTRIBUTES({ type: RESOURCETYPE.buildingAlarm, center: res.center })
                    this.UPDATE_CURBUILD_DATA({children: arr, id: attr.id, name: res.name, sids: res.sids})
                  }
                })
              } else {
                this.getBuildingDataById(attr.id).then(res => {
                  this.handleSelectBuilding(res) // 处理选中楼宇
                })
              }
              break
            default:
              break
          }
          switch (attr.alarmType) { // 点击报警点位的响应事件处理
            case 'AttrSinglePawn':
              if (attr.isTimeout) {
                this.getSingleDataById(attr.id).then(res => {
                  this.setSelectedMapPointRes(res)
                  this.SET_MAP_RESOURCE_ATTRIBUTES({res: {data: res, timeOut: true}, type: 'single'})
                })
              } else {
                this.checkAlarmIdGetInfo(attr, this.singleAllList)
                this.GET_PATROL_TYPE(attr.alarmType)
                this.SAVE_PATROL_STUATES(true)
              }
              break
            case 'AlarmList':
              this.checkAlarmIdGetInfo(attr, this.normalAlarmList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'VideoAlarm':
              this.checkAlarmIdGetInfo(attr, this.videoAlarmList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'IntelligentAlarm':
              this.checkAlarmIdGetInfo(attr, this.intelligentAlarmList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'vioAlarm':
              this.checkAlarmIdGetInfo(attr, this.intelligentAlarmList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'FaceAlarm':
              this.checkAlarmIdGetInfo(attr, this.intelligentAlarmList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'FireAlarmList':
              this.checkAlarmIdGetInfo(attr, this.fireAlarmList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'AlarmHelpList':
              this.checkAlarmIdGetInfo(attr, this.alarmHelpList)
              this.GET_ALARM_MODAL_TYPE(attr.alarmType)
              this.CHANGE_SHOWVIDEO(true)
              break
            case 'AttrPatrol':
              this.checkAlarmIdGetInfo(attr, this.singleAllList)
              this.GET_PATROL_TYPE(attr.alarmType)
              this.SAVE_PATROL_STUATES(true)
              break
            case 'buildingAlarm':
              if (!this.isPlatformTrack) {
                this.getBuildingData(attr.id).then(res => {
                  this.SET_MAP_RESOURCE_ATTRIBUTES({ type: RESOURCETYPE.buildingAlarm, center: attr.center })
                  const arr = this.alarmTabData.filter(item => { return item.point && item.point.bid === attr.id })
                  this.UPDATE_CURBUILD_DATA({children: arr, id: attr.id, name: res.name, sids: res.sids})
                })
              }
              break
            default:
              break
          }
        }
      }
    },
    checkAlarmIdGetInfo(attr, alarmList) {
      for (let i = 0; i < alarmList.length; i++) {
        const item = {...alarmList[i]}
        if (!attr.idAlarm) { return }
        if (attr.alarmType === 'AttrPatrol') {
          if (item && item.uniqueId === attr.idAlarm) {
            this.SAVE_PATROL_DATA(item)
          }
        } else if (attr.alarmType === 'AttrSinglePawn') {
          if (item && item.uniqueId === attr.idAlarm) {
            this.SAVE_SINGLE_DATA(item)
          }
        } else if (item && item.alarmId === attr.idAlarm) {
          this.SAVE_ITEM_ALARM_INPUT(item)
        }
      }
    },
    handleMapDBClick(param) { // 处理地图双击事件
      if (this.isPlatformTrack || (this.isPointChoose && this.areaDrawActive)) { // 点选、框选时 | 接力追踪模式
        return
      }
      if (this.measureMode2D.panelVisible && this.measureMode2D.isMeasure) { // 量算时
        return
      }
      console.log('处理地图双击事件：', param)
      if (param.attributes) {
        let attr = JSON.parse(JSON.stringify(param.attributes))
        if (attr.rType === RESOURCETYPE.video) { // 视频资源
          this.getCommonPointResById(attr.id).then(res => {
            if (res.status) { // 设备在线
              let eid = res.eid
              if (eid && (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus)) { // 设备启用
                this.updatePointVideoList(res) // 预览视频
              } else {
                this.warningMsg('该设备已禁用！')
              }
            } else {
              this.warningMsg('该设备不在线！')
            }
          })
        }
      }
    },
    handleHighLightEffect(attr) { // 处理高亮效果
      let isHighLight = false
      for (let feature of this.locateAreaFeatures) {
        if (feature.attributes) {
          let { attributes } = feature
          if (attr.rType === attributes.rType && attr.id === attributes.id) {
            isHighLight = true
          }
        }
      }
      if (!isHighLight) {
        this.SET_LOCATE_AREA_FEATURES([])
      }
    },
    handleMapZoomChange(param) { // 处理地图缩放级别变化
      if (param.zoom) {
        console.log('地图缩放级别变化：', param)
        let zoom = Math.ceil(param.zoom)
        this.setMapZoom(zoom)
      }
    },
    handkeMapMouseMove(param) { // 处理地图鼠标移动事件
      if (this.areaDrawActive || this.isPlatformTrack) { // 区域绘制时 | 接力追踪模式，不进行处理
        return
      }
      // console.log('处理地图鼠标移动事件，参数：', param)
      if (this.isMapOuter) { // 楼外地图
        this.queryBuildingByLoc(param) // 根据位置查询楼宇数据
      }
      if (param.attributes) {
        let attr = JSON.parse(JSON.stringify(param.attributes))
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
        this.clearGridHoverFeatures() // 清空网格悬浮显示要素
        if (this.isMapOuter) { // 楼外地图
          this.clearBuildingHoverFeatures() // 清空楼宇悬浮显示要素
          this.clearSingleHoverFeatures() // 清空楼宇悬浮显示要素
        }
        this.clearRealAlarmLabelFeatures() // 清除点位报警闪烁名称要素
        this.clearVideoHoverFeatures() // 清空视频悬浮显示要素
        this.clearCommonAlarmHoverFeatures() // 清空普通报警悬浮显示要素
        this.clearFireAlarmHoverFeatures() // 清空消防报警悬浮要素显示
        this.clearAlarmHostHoverFeatures() // 清空报警主机悬浮要素显示
        this.clearAlarmColumnHoverFeatures() // 清空报警柱悬浮要素
        this.clearAlarmBoxHoverFeatures() // 清空报警箱悬浮要素
        this.clearPatrolHoverFeatures() // 清空巡更悬浮要素显示
        this.clearDoorControlHoverFeatures() // 清空巡更悬浮要素显示
      }
    },
    handleOverViewMapReady(overview) { // 处理缩略图加载完成
      // console.log('处理缩略图加载完成：', overview.controlName, overview)
      let targets = document.getElementsByClassName(overview.className)
      for (let target of targets) {
        target.style.right = this.toolVisible ? '64px' : '0px'
        target.style.bottom = '0px'
      }
    }
  }
}
