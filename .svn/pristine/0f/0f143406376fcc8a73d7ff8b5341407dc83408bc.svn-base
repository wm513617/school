/* eslint-disable no-undef */
// 地图事件处理逻辑
import { mapState, mapMutations } from 'vuex'
import MouseTip from 'assets/fengMap/utils/mousetip/MouseTip.js'
import {DEFAULTOPS} from 'assets/fengMap/meta/common.js'
export default {
  data() {
    return {
      tooltip: null,
      mouseTips: '<p>单击绘制点位</p>',
      clickEventId: null, // 点击事件id
      selectedModel: null, // 选中模型
      isClickedMarker: false, // 判断当前是否点击的是poi
      preClickedTimeStamp: 0 // 上次点击的时间戳
    }
  },
  computed: {
    ...mapState({
      selectedFMapPointRes: ({ fengMap }) => fengMap.selectedFMapPointRes
    })
  },
  watch: {
  },
  methods: {
    ...mapMutations('fengMap', ['SET_ACTIVE_FMAP']),
    // 处理地图加载完成
    handleMaploadComplete(event) {
      console.log('地图加载完成！')
      this.fmgroup = this.fengMap.getFMGroup(this.fengMap.focusGroupID)
      this.SET_ACTIVE_FMAP('5da526ae8bd570426c912984') // 设置当前地图
      this.SET_LOAD_STATUS(true) // 修改地图加载状态
      this.isLoading = false
      // this.addScaleLevelController() // 添加地图放大缩小控件
      this.tooltip = new MouseTip(this.$el) // 构造鼠标提示工具
      this.initGetMapPointShow() // 获取所有点位
    },
    // 处理地图点击事件
    handleMapClickNode(event) {
      if (!event.nodeType) {
        if (this.selectedModel) {
          this.selectedModel.selected = false
          this.selectedModel = null
          this.fengMap.selectNull()
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
      this.changeHightLayerState(false) // 隐藏高亮图层
      if (this.pointFMDrawActive) { // 点绘制开启
        this.handleFMPointDrawEnd(event) // 处理地图点位绘制完成
      } else {
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
      }
    },
    // 处理地图点位绘制完成
    handleFMPointDrawEnd(event) {
      if (event.mapCoord) {
        let coods
        if (event.target) {
          coods = event.mapCoord.x + ',' + event.mapCoord.y + ',' + event.target.z
        } else {
          coods = event.mapCoord.x + ',' + event.mapCoord.y
        }
        this.addResourceToMap(this.selectedFMapPointRes.rType, coods)
      }
      if (this.selectedModel) {
        this.selectedModel.selected = false
        this.selectedModel = null
      }
      this.fengMap.selectNull()
    },
    // 处理点击模型
    handleLeftClickModel(event) {
      let target = event.target
      if (this.isClickedMarker && event.eventInfo.eventID === this.clickEventId) { // 选择自定义标注 且 事件相同时
        this.fengMap.selectNull()
        if (this.selectedModel) {
          this.selectedModel.selected = false
          this.selectedModel = null
        }
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
        this.selectedModel = null
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
      this.setSelectRes(target.parent.scene.id, target.renderNode.id)
    },
    // 处理左键单击标注
    handleLeftSingleClickMarker(target) {
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
      console.log('handleMapScaleLevelChanged: ', event)
    },
    // 处理地图鼠标悬停事件
    handleMapHoverNode(event) {
      console.log('handleMapHoverNode: ', event)
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
    },
    // 注册绘制点位鼠标提示
    regDrawPointMouseTip() {
      this.tooltip.msg = this.mouseTips
      this.tooltip.setVisible(true)
    },
    // 解除注册绘制点位鼠标提示
    unRegDrawPointMouseTip() {
      this.tooltip.setVisible(false) // 关闭鼠标提示
    }
  }
}
