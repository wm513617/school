import { mapState, mapMutations } from 'vuex'
import mapUtils from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils/index.js'
import { Num } from 'docx'
export default {
  computed: {
    ...mapState({
      pointFaceNodeMap: ({ alarmThreeD }) => alarmThreeD.pointFaceNodeMap, // 人脸点位节点
      intelligentAlarmList: ({ alarmThreeD }) => alarmThreeD.intelligentAlarmList
    })
  },
  methods: {
    ...mapMutations(['SET_POINT_FACE_NODE_3D_MAP', 'DELETE_CURRENT_FACE_TRACK']),
    setMapView(perspective, scenelayer) { // 设置地图视图方位
      // 去掉地图上的商标
      let widget = this.context.viewer.cesiumWidget
      if (widget.creditContainer) {
        widget.creditContainer.style.display = 'none'
      }
      if (perspective) { // 有视角信息时，地图定位到给定视角
        this.context.viewer.camera.setView({
          destination: this.context.Cesium.Cartesian3.fromDegrees(perspective.longitude, perspective.latitude, perspective.height),
          orientation: {
            heading: this.context.Cesium.Math.toRadians(perspective.heading),
            pitch: this.context.Cesium.Math.toRadians(perspective.pitch),
            roll: this.context.Cesium.Math.toRadians(perspective.roll)
          }
        })
      } else { // 无视角信息时地图缩放到显示图层
        this.context.viewer.zoomTo(scenelayer)
      }
      // --------------------------------限制相机视角高度，超图API暂不支持----------------------
      // this.context.viewer.scene.screenSpaceCameraController.minimumZoomDistance = mapUtil.TDDEFAULTOPS.minCameraHeight // 相机的高度的最小值
      // this.context.viewer.scene.screenSpaceCameraController.maximumZoomDistance = mapUtil.TDDEFAULTOPS.maxCameraHeight // 相机高度的最大值
    },
    regMapListeners() { // 注册地图事件监听
      document.addEventListener('keydown', this.handlePressKeydown)
      // 移除默认双击事件
      this.context.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(this.context.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      let handler = new this.context.Cesium.ScreenSpaceEventHandler(this.context.viewer.canvas)
      // 监听单击事件
      handler.setInputAction(this.handleLeftClick, this.context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      // 监听双击事件
      handler.setInputAction(this.handleLeftDoubleClick, this.context.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      // 监听鼠标移动事件
      handler.setInputAction(this.handleMouseMove, this.context.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      // 监听拾取事件
      this.context.viewer.pickEvent.addEventListener(this.handlePickEvent)
      this.context.viewer.container.addEventListener('mouseenter', this.handleMouseEnter) // 监听鼠标移入3D地图
      this.context.viewer.container.addEventListener('mouseleave', this.handleMouseLeave) // 监听鼠标移出3D地图
      // 测试------监听视图场景请求重新渲染事件，（可用于实时监听地图移动）
      this.context.viewer.scene.postRender.addEventListener(this.handleScenePostUpdate)
      // this.context.viewer.clock.onTick.addEventListener(this.handleClockUpdate)
    },
    relieveMapListeners() { // 解除地图监听
      document.removeEventListener('keydown', this.handlePressKeydown) // 移除键盘按下的监听
      this.context.viewer.container.addEventListener('mouseenter', this.handleMouseEnter) // 移除鼠标移入3D地图的监听
      this.context.viewer.container.addEventListener('mouseleave', this.handleMouseLeave) // 移除鼠标移出3D地图的监听
    },
    handlePressKeydown(event) { // 处理键盘按下事件
      if (this.isFocusOn3DMap) {
        let camera = this.context.viewer.camera
        let cameraHeight = camera.positionCartographic.height
        let moveRate = cameraHeight / 100.0
        switch (event.keyCode) {
          case 87: // W - moveForward
            camera.moveForward(moveRate)
            break
          case 83: // S - moveBackward
            camera.moveBackward(moveRate)
            break
          case 81: // Q - moveUp
          case 38: // ↑ - moveUp
            camera.moveUp(moveRate)
            break
          case 69: // E - moveDown
          case 40: // ↓ - moveDown
            camera.moveDown(moveRate)
            break
          case 65: // A - moveLeft
          case 37: // ← - moveLeft
            camera.moveLeft(moveRate)
            break
          case 68: // D - moveRight
          case 39: // → - moveRight
            camera.moveRight(moveRate)
            break
          default:
            break
        }
      }
    },
    handleMouseEnter(event) { // 处理鼠标进入地图
      this.isFocusOn3DMap = true
    },
    handleMouseLeave(event) { // 处理鼠标移出地图事件
      this.isFocusOn3DMap = false
    },
    handleLeftClick(movement) { // 处理单击事件
      this.removeBuildingNameLabel() // 移除之前的楼宇名称标签
      let pickedPrimitive = this.context.viewer.scene.pick(movement.position)
      let pickedEntity = this.context.Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined
      // 是否拾取实体--------
      if (pickedEntity) {
        console.log('单击点选空间要素：', pickedEntity)
        if (pickedEntity.id.includes('deleteface_')) { // 点击删除人像报警轨迹
          // 清除头像实体  facealarm_id
          const id = pickedEntity.id.substr(pickedEntity.id.indexOf('_') + 1)
          let entity = id && utils.getEntity('facealarm_' + id, this.$context)
          entity && this.$context.viewer.entities.remove(entity)
          // 清除 X 实体(当前点击的实体pickedEntity) deleteface_id
          this.$context.viewer.entities.remove(pickedEntity)
          // 清除轨迹及数据
          console.log('清除人像报警轨迹')
          const pointFaceNodeArr = []
          for (let point = 0; point < this.pointFaceNodeMap.length; point++) {
            if (this.pointFaceNodeMap[point].id !== id) {
              pointFaceNodeArr.push(this.pointFaceNodeMap[point])
            }
          }
          // for (let alarm = 0; alarm < this.intelligentAlarmList.length; alarm++) {
          //   if (this.intelligentAlarmList[alarm].timestamp === Number(id)) {
          //     index = alarm
          //   }
          // }
          this.SET_POINT_FACE_NODE_3D_MAP(pointFaceNodeArr)
          this.DELETE_CURRENT_FACE_TRACK(id)
        } else {
          this.switchDetailPage(pickedEntity.id, pickedEntity.name)
        }
      }
    },
    handleLeftDoubleClick(movement) { // 处理双击事件
      let pickedPrimitive = this.context.viewer.scene.pick(movement.position)
      let pickedEntity = this.context.Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined
      // 是否拾取实体--------
      if (pickedEntity) {
        console.log('双击点选空间要素：', pickedEntity)
        if (pickedEntity.name === mapUtils.CHANNELTYPE.vedioResource) {
          this.addVideoPreview(pickedEntity.id)
        }
      }
    },
    handlePickEvent(feature) {
      console.log(feature)
      if (feature) {
        // 如果楼宇处于报警状态，楼宇闪烁，单击楼宇的事件处理-----
        if (this.buildIngAlarmObj[feature.SMID]) {
          this.currentSMID = feature.SMID
          this.buildIngAlarm = JSON.parse(JSON.stringify(this.buildIngAlarmObj[feature.SMID]))
          this.changeTreeData(this.buildIngAlarm)
          this.setShowBuildingAlarm(true)
        } else {
          // 楼宇如果没有报警---判断图层是否可选
          let { dataSet, dataSource, layer } = this.map3DConfig
          let layerName = layer || (dataSet + '@' + dataSource)
          let selected = true
          let layerSettings = this.layerSettingsMap.get(layerName)
          if (layerSettings && layerSettings.hasOwnProperty('selected')) {
            selected = layerSettings.selected
          }
          if (selected) { // 楼层可选时，抛出事件---显示楼宇属性面板
            this.getOneBuildById(feature.SMID).then(res => {
              this.$emit('sendEvent', { type: mapUtils.CHANNELTYPE.building, data: res })
            })
          }
        }
      }
    },
    handleMouseMove(movement) { // 处理鼠标移动事件
      if (!this.isShowName) { // 如果未勾选显示标签 | 需添加条件：地图上显示了人像轨迹追踪
        let pickedPrimitive = this.context.viewer.scene.pick(movement.endPosition)
        let pickedEntity = this.context.Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined
        if ((pickedEntity && !pickedEntity.id.includes('face')) && this.pointFaceNodeMap && this.pointFaceNodeMap.length) { // 需添加条件：地图上显示了人像轨迹追踪
          console.log('清除所有的删除轨迹的点击实体')
          for (let point of this.pointFaceNodeMap) {
            let entity = point.id && utils.getEntity('deleteface_' + point.id, this.$context)
            entity && this.$context.viewer.entities.remove(entity)
          }
          return
        }
        var s3mlayerPick = this.getSelection()

        if (s3mlayerPick) { // 鼠标移入地面或楼宇上
          this.getOneBuildByIdWithoutUpdateState(s3mlayerPick.ID).then(res => {
            let labels = mapUtils.entitys.labels
            for (let item of labels) {
              this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
            }
            //  console.log(s3mlayerPick)
            mapUtils.entitys.labels = []
            if (res.hasOwnProperty('_id')) { // 鼠标移入已经设置楼宇信息的楼宇中（鼠标进入）
              let locValues = res.center.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: res.height }
              if (mapUtils.entitys.labels.length === 0) {
                let labelEntity = utils.addLabel(this.context, position, res.name, res._id, mapUtils.CHANNELTYPE.building)
                //  mapUtils.entitys.labels = []
                mapUtils.entitys.labels.push(labelEntity)
              }
            } /* else { // 鼠标移入未设置楼宇信息的楼宇中或者地面中（鼠标离开）
              let labels = mapUtils.entitys.labels
              for (let item of labels) {
                this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
              }
              mapUtils.entitys.labels = []
            } */
            // eslint-disable-next-line handle-callback-err
          }).catch(function(err) {
            // console.log(err)
          })
        } else { // 鼠标移入标注上
          if (pickedEntity) {
            // eslint-disable-next-line no-unused-vars
            // 视图椭球体
            let ellipsoid = this.context.viewer.scene.globe.ellipsoid
            // 转换成世界坐标
            let worldPoint = this.context.viewer.camera.pickEllipsoid(movement.endPosition)
            // eslint-disable-next-line no-unused-vars
            // 鼠标经纬度高度对象
            let cartographic = ellipsoid.cartesianToCartographic(worldPoint)
            // eslint-disable-next-line no-unused-vars
            let coordinats = [this.context.Cesium.Math.toDegrees(cartographic.longitude), this.context.Cesium.Math.toDegrees(cartographic.latitude)]
            this.handleHoverEntity(pickedEntity, coordinats) // 处理鼠标悬浮实体
          } else {
            !this.isSingleHead && this.hiddenAllSingleHead()
            let labels = mapUtils.entitys.labels
            for (let item of labels) {
              this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        }
      }
    },
    hiddenAllSingleHead() {
      let realSingles = [...this.realSingleMap3D.values()] // 实时单兵数组
      for (let singleItem of realSingles) {
        const headEntity = utils.getEntity('head' + singleItem.id, this.$context)
        if (headEntity) { headEntity.show = false }
      }
    },
    getSelection() {
      var layers = this.context.viewer.scene.layers._layers.values // 获取地图点位信息
      var layerCount = layers.length
      if (layerCount > 0) {
        for (var i = 0; i < layerCount; i++) {
          var ids = layers[i].getSelection()// 获取被选中的地图点位信息集合（非标注）
          if (ids[0] !== undefined) {
            var Selection3D = {}
            Selection3D['layer'] = layers[i]
            Selection3D['ID'] = ids[0]
            return Selection3D
          }
        }
        return undefined
      } else {
        return undefined
      }
    },
    handleScenePostUpdate(scene, time) {
      if (++this.twinkleCounter > mapUtils.RESOURCESTATUS.twinkleStep) {
        this.twinkleCounter = 0
        for (const item of this.allAlarmEntities) { // 有报警实体时，改变实体状态
          let {id, existModel} = item
          if (!existModel) {
            let alarmingEntity = this.context.viewer.entities.getById(id) // 获取当前实体对象
            if (alarmingEntity) {
              alarmingEntity.model.colorBlendAmount = (alarmingEntity.model.colorBlendAmount._value === 0) ? mapUtils.RESOURCESTATUS.colorAmount : 0
            }
          }
        }
        if (this.buildingArr) { // 有楼内报警时，改变楼宇闪烁状态
          this.twinkFlag = !this.twinkFlag
        }
      }
    },
    handleClockUpdate(clock) { // 处理时钟更新
      if (this.selectedEntity && this.selectedEntity.hasOwnProperty('lng')) {
        // let cartesian3Co = this.selectedEntity.position.getValue(this.$context.Cesium.JulianDate.now())
        let cartesian3Co = this.$context.Cesium.Cartesian3.fromDegrees(
          this.selectedEntity.lng,
          this.selectedEntity.lat,
          this.selectedEntity.alt
        )
        let cartesian2Co = this.$context.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
          this.$context.viewer.scene,
          cartesian3Co
        ) // 世界坐标转换为屏幕坐标
        console.log('实体当前位置的cartesian2屏幕坐标：', cartesian2Co.toString())
        this.setSelectedEntityScreenCo(cartesian2Co) // 设置选择物体当前前位置的cartesian2屏幕坐标
      }
    },
    handleHoverEntity(pickedEntity, coordinats) { // 处理鼠标悬浮实体
      if (!this.isSingleHead && pickedEntity.name === mapUtils.CHANNELTYPE.single) { // 单兵
        let id = pickedEntity.id
        let hoverSingle = this.realSingleMap3D.get(id)
        if (hoverSingle) {
          const data = hoverSingle
          // console.log('鼠标悬浮单兵数据：', hoverSingle)
          let entity = utils.getEntity('head' + data.id, this.$context)
          if (entity) {
            entity.show = true
          } else {
            utils.addSingleHead(data, this.$context)
          }
        }
      } else { // 点位鼠标移入
        this.getSwitchFloatDetail(pickedEntity.id, pickedEntity.name, coordinats)
      }
      if (pickedEntity.id.includes('facealarm_') && pickedEntity.name === 'faceAlarm') { // 人像报警头像悬浮
        let entity = utils.getEntity('deleteface_' + pickedEntity.canvasSize.id, this.$context)
        !entity && utils.deleteHeadTrack(this.$context, pickedEntity.canvasSize)
      }
    }
  }
}
