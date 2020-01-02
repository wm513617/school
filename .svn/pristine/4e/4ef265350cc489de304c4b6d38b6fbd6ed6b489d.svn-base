/* eslint-disable no-undef */
// 地图事件处理逻辑
import { mapGetters, mapActions, mapMutations } from 'vuex'
import {DEFAULTOPS, RESICONOID} from 'assets/fengMap/meta/common.js'
import {componentMountToFMPopInfoWindow} from './mountComponent'
import { getPointById, getPointType } from 'assets/fengMap/meta/pointData.js'
export default {
  data() {
    return {
      clickEventId: null, // 点击事件id
      selectedModel: null, // 选中模型
      isClickedMarker: false, // 判断当前点击的是否是自定义标注
      preClickedTimeStamp: 0, // 上次点击的时间戳
      modelSelectedColor: '#ff6633',
      modelSelectedAlpha: 0.9,
      hoverBuildingModel: null, // 悬停的楼宇模型
      hoverTimeStamp: 0,
      popMarker: null, // 悬浮窗口
      typeObj: null, // 点击当前标注的类型对象
      target: null // 记录当前点击标注
    }
  },
  methods: {
    ...mapActions('fengMapPoint', ['setFengMapResourceAttributes']), // 设置面板属性
    ...mapMutations('fengMapPoint', ['SET_FENGMAP_PANEL_STATUS']), // 设置固定状态下面板显示或隐藏
    ...mapActions('fengMap', ['getfmResourceById', 'getfmPatrolResById', 'getDoorfmPointResById', 'getfmSingleResById']),
    // 处理地图加载完成
    handleMaploadComplete(event) {
      console.log('地图加载完成！')
      this.SET_LOAD_STATUS(true) // 修改地图加载状态
      this.isLoading = false
      this.addScaleLevelController() // 添加地图放大缩小控件
      this.fengMap.setModelSelectColor(this.modelSelectedColor, this.modelSelectedAlpha)
      this.fmgroup = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
      this.initGetMapPointShow() // 获取所有点位
    },
    // 处理地图点击事件
    handleMapClickNode(event) {
      this.fengMap.setModelSelectColor(this.modelSelectedColor, this.modelSelectedAlpha)
      if (!event.nodeType) {
        if (this.selectedModel) {
          this.selectedModel.selected = false
          return
        }
      }
      if (event.domEvent.button === 0) { // 鼠标左键点击
        console.log('鼠标左键点击')
        this.handleMapLeftClick(event) // 处理地图左键点击
      } else if (event.domEvent.button === 2) { // 鼠标右键点击
        console.log('鼠标右键点击')
      }
    },
    // 处理地图左键点击
    handleMapLeftClick(event) {
      let target = event.target
      if (target) {
        switch (target.nodeType) {
          case fengmap.FMNodeType.MODEL: // 模型
            this.handleLeftClickModel(event)
            break
          case fengmap.FMNodeType.LABEL: // 文本标签
            break
          case fengmap.FMNodeType.IMAGE_MARKER: // 图片标注
          case fengmap.FMNodeType.TEXT_MARKER: // 自定义文本标注
          case fengmap.FMNodeType.POLYGON_MARKER: // 多边形
            this.handleLeftClickMarker(event) // 处理左键点击标注
            break
          case fengmap.FMNodeType.FACILITY: // 公共设施
            break
          case fengmap.FMNodeType.FLOOR: // 地面
            this.handleLeftClickGround(event) // 处理左键点击地面
            break
          default:
            break
        }
      }
    },
    // 添加标注悬浮窗口
    addPopInfoWindow(marker, {compontentType}) {
      let _t = this
      if (marker) {
        let mapCoord = marker.mapCoord
        let component = null
        // 添加绑定marker信息窗
        let ctlOpt = {
          mapCoord: {
            x: mapCoord.x,
            y: mapCoord.y,
            height: mapCoord.z + 5,
            // 设置弹框位于的楼层,当前聚焦楼层
            groupID: marker.groupID
          },
          // 设置弹框的宽度
          width: 240,
          // 设置弹框的高度px
          height: 110,
          // 设置弹框的内容，文本或html页面元素
          content: '<div id="FMPopInfoWindow"></div>',
          // 关闭回调函数
          closeCallBack: () => {
            // 信息窗点击关闭操作
            if (component) {
              this.SET_FENGMAP_PANEL_STATUS_SOLIDS(false) // 设置悬浮属性面板显隐属性
              this.popMarker = null
              component.$destroy()
              component = null
            }
          }
        }
        if (this.popMarker) {
          this.popMarker.close() // 先清除再添加
        }
        // 添加初始化弹框到地图上悬浮，并绑定marker
        this.popMarker = new fengmap.FMPopInfoWindow(_t.fengMap, ctlOpt)
        // 挂载对应的弹框内容组件并替换掉#FMPopInfoWindow元素
        component = componentMountToFMPopInfoWindow({pointsType: compontentType})
        this.SET_FENGMAP_PANEL_STATUS_SOLIDS(true) // 设置悬浮属性面板显隐属性
      }
    },
    // 处理点击模型
    handleLeftClickModel(event) {
      let target = event.target
      if (this.isClickedMarker && event.eventInfo.eventID === this.clickEventId) { // 选择自定义标注 且 事件相同时
        this.fengMap.selectNull()
        this.selectedModel && (this.selectedModel.selected = false)
        this.selectedModel = null
        this.isClickedMarker = false
        return
      }
      if (target.name && DEFAULTOPS.buildingTypeIds.includes(target.typeID)) { // 选中楼宇时
        if (this.selectedModel && this.selectedModel.FID !== target.FID) { // 当选中模型与当前选中模型不一致时
          this.selectedModel.selected = false
        }
        target.selected = true
        this.selectedModel = target
        this.handleLeftClickBuildingModel(target) // 处理点击楼宇模型
        console.log('点击选中楼宇，选中的楼宇模型：', target)
      } else {
        target.selected = false
        this.fengMap.selectNull()
      }
    },
    // 处理点击楼宇模型
    handleLeftClickBuildingModel(target) {
    },
    // 处理左键点击标注
    handleLeftClickMarker(event) {
      let target = event.target
      this.isClickedMarker = true
      if (this.clickEventId !== event.eventInfo.eventID && this.preClickedTimeStamp && event.domEvent.timeStamp - this.preClickedTimeStamp < 500) {
        console.log('我是鼠标左键双击！！！')
        this.handleLeftDBClickMarker(target) // 处理左键双击标注
      } else {
        console.log('我是鼠标左键单击！！！')
        this.handleLeftSingleClickMarker(target) // 处理左键单击标注
      }
      this.preClickedTimeStamp = event.domEvent.timeStamp // 更新之前点击的时间戳
      this.clickEventId = event.eventInfo.eventID // 更新点击的事件唯一标识
      if (this.selectedModel) {
        this.selectedModel.selected = false
        this.selectedModel = null
      }
      this.fengMap.selectNull()
      console.log('点击选中自定义标注，选中的标注：', target)
    },
    // 处理左键单击标注
    handleLeftSingleClickMarker(target) {
      this.target = target
      let pointId = getPointById(target.parent.scene.id, target.renderNode.id).channelId // 获取当前资源ID
      let pointType = getPointType(target.parent.scene.id).type // 获取当前类型
      // let videoArr = RESICONOID.videoArr
      let alarmArr = RESICONOID.alarmArr
      let alarmHelpArr = RESICONOID.alarmHelpArr
      let patrolArr = RESICONOID.patrolArr
      let doorControlArr = RESICONOID.doorControlArr
      let singleArr = RESICONOID.singleArr
      // 默认视频点位
      this.typeObj = {reqName: 'getfmResourceById', compontentType: 'AttrVideo'} // 视频、普通报警、报警主机、消防报警、报警柱、报警箱
      if (alarmArr.includes(pointType)) { // 报警大类
        this.typeObj.compontentType = 'AttrAlarm'
      } else if (alarmHelpArr.includes(pointType)) { // 报警求助大类
        this.typeObj.compontentType = 'AttrAlarmHelp'
      } else if (patrolArr.includes(pointType)) { // 巡更大类
        this.typeObj.reqName = 'getfmPatrolResById'
        this.typeObj.compontentType = 'AttrPatrol'
      } else if (doorControlArr.includes(pointType)) { // 门禁大类
        this.typeObj.reqName = 'getDoorfmPointResById'
        this.typeObj.compontentType = 'AttrDoorControl'
      } else if (singleArr.includes(pointType)) { // 单兵大类
        this.typeObj.reqName = 'getfmSingleResById'
        this.typeObj.compontentType = 'AttrSingle'
      }
      this[this.typeObj.reqName](pointId).then(res => {
        let itemPointData = JSON.parse(JSON.stringify(res))
        itemPointData.compontentType = this.typeObj.compontentType
        if (itemPointData.eid.deviceStatus) {
          if (itemPointData.status) {
            itemPointData.isOnline = true
          } else {
            itemPointData.isOnline = false
          }
        } else {
          itemPointData.isOnline = false
        }
        this.setFengMapResourceAttributes(itemPointData)
        if (this.isInfoPanelFixed) { // 固定窗口
          this.SET_FENGMAP_PANEL_STATUS(true)// 设置固定状态下面板显示或隐藏
        } else { // 悬浮窗口
          this.addPopInfoWindow(target, this.typeObj)
        }
      }, err => {
        console.log(err)
      })
    },
    // 处理左键双击标注
    handleLeftDBClickMarker(target) {
    },
    // 处理左键点击地面
    handleLeftClickGround(event) {
      if (this.isClickedMarker && event.eventInfo.eventID === this.clickEventId) { // 点击自定义标注 且 事件相同时
        return
      }
      if (this.selectedModel) { // 取消选中模型效果
        this.selectedModel.selected = false
        this.selectedModel = null
      }
      this.fengMap.selectNull()
    },
    // 处理地图缩放级别变化事件
    handleMapScaleLevelChanged(event) {
    //  console.log('handleMapScaleLevelChanged: ', event)
    },
    // 处理地图鼠标悬停事件
    handleMapHoverNode(event) {
      console.log('handleMapHoverNode: ', event)
      let target = event.target
      if (target._modelColor) {
        let targetColor = '#' + this.colorComponentToHexString(target._modelColor.r) + this.colorComponentToHexString(target._modelColor.g) + this.colorComponentToHexString(target._modelColor.b)
        let targetAlpha = target._modelAlpha
        this.fengMap.setModelSelectColor(targetColor, targetAlpha)
      }
      if (this.hoverBuildingModel && this.hoverTimeStamp === event.eventInfo.domEvent.timeStamp) {
        // console.log('选中图片标注的同时，选中楼宇！！！')
        let targetColor = '#' + this.colorComponentToHexString(this.hoverBuildingModel._modelColor.r) + this.colorComponentToHexString(this.hoverBuildingModel._modelColor.g) + this.colorComponentToHexString(this.hoverBuildingModel._modelColor.b)
        let targetAlpha = this.hoverBuildingModel._modelAlpha
        this.fengMap.setModelSelectColor(targetColor, targetAlpha)
      }
      this.hoverTimeStamp = event.eventInfo.domEvent.timeStamp
      if (target) {
        switch (target.nodeType) {
          case fengmap.FMNodeType.MODEL: // 模型
            this.handleHoverModel(event)
            break
          case fengmap.FMNodeType.LABEL: // 文本标签
            break
          case fengmap.FMNodeType.IMAGE_MARKER: // 图片标注
          case fengmap.FMNodeType.TEXT_MARKER: // 自定义文本标注
          case fengmap.FMNodeType.POLYGON_MARKER: // 多边形
            this.handleHoverMarker(event) // 处理左键点击标注
            break
          case fengmap.FMNodeType.FACILITY: // 公共设施
            break
          case fengmap.FMNodeType.FLOOR: // 地面
            break
          default:
            break
        }
      }
    },
    // 颜色分量转换成16进制字符串
    colorComponentToHexString(num) {
      let str = Math.floor(num * 255).toString(16)
      return str.length >= 2 ? str.substr(0, 2) : '0' + str
    },
    // 处理悬浮模型
    handleHoverModel(event) {
      let target = event.target
      if (target.name && DEFAULTOPS.buildingTypeIds.includes(target.typeID)) { // 选中楼宇时
        this.hoverBuildingModel = target
        this.fengMap.setModelSelectColor(this.modelSelectedColor, this.modelSelectedAlpha)
        this.handleHoverBuildingModel(target) // 处理点击楼宇模型
        console.log('悬浮选中楼宇，选中的楼宇模型：', target)
      }
    },
    // 处理楼宇模型
    handleHoverBuildingModel(event) {
    },
    // 处理悬浮自定义标注
    handleHoverMarker(event) {
      let target = event.target
      console.log('悬浮选中自定义标注，选中的标注：', target)
    },
    // 过滤不允许点击的地图元素，设置为true为允许点击，设置为false为不允许点击
    handlePickFilterFunction(event) {
      // console.log('handlePickFilterFunction: ', event)
      // 如设置点击墙模型时不高亮
      if (event.nodeType === fengmap.FMNodeType.MODEL && event.typeID === 300000) {
        return false
      }
      return true
    },
    // 过滤不允许hover的地图元素，设置为true为允许点击，设置为false为不允许点击
    handleHoverFilterFunction(event) {
      // console.log('handleHoverFilterFunction: ', event)
      // 如设置点击墙模型时不高亮
      if (event.nodeType === fengmap.FMNodeType.MODEL && event.typeID === 300000) {
        return false
      }
      return true
    }
  },
  watch: {
    isInfoPanelFixed(val) {
      if (!val && this.getShowFengMapResourceAttributesPanel) { // 右侧点击悬浮选项并且固定选项已经激活，显示悬浮面板
        this.SET_FENGMAP_PANEL_STATUS(false) // 隐藏固定右上角弹出框
        this.addPopInfoWindow(this.target, this.typeObj)// 打开悬浮窗口，并且改变悬浮属性面板显隐状态
      }
      if (val && this.getShowFengMapResourceAttributesPanelSolids) { // 右侧点击固定选项并且悬浮选项已经激活,显示固定面板
        this.SET_FENGMAP_PANEL_STATUS(true)
        this.popMarker.close()
        this.SET_FENGMAP_PANEL_STATUS_SOLIDS(false) // 设置悬浮属性面板显隐属性
      }
    }
  }
}
