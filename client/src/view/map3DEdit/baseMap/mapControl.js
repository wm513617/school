import mapUtils from 'assets/3DMap/mapUtil.js'
import utils from 'assets/3DMap/utils'
export default {
  methods: {
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
      // 注册键盘按下的监听
      document.addEventListener('keydown', this.handlePressKeydown)
      // 移除默认的双击事件处理
      this.context.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(this.context.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
      // 监听单击事件
      let handler = new this.context.Cesium.ScreenSpaceEventHandler(this.context.viewer.canvas)
      handler.setInputAction(this.handleLeftClick, this.context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
      // 监听拾取事件
      this.context.viewer.pickEvent.addEventListener(this.handlePickEvent)
      this.context.viewer.container.addEventListener('mouseenter', this.handleMouseEnter) // 监听鼠标移入3D地图
      this.context.viewer.container.addEventListener('mouseleave', this.handleMouseLeave) // 监听鼠标移出3D地图
      // 测试------监听视图场景请求重新渲染事件，（可用于实时监听地图移动）
      // this.context.viewer.scene.postRender.addEventListener(this.handleScenePostUpdate)
      // 添加鼠标移动事件
      handler.setInputAction(this.handleMouseMove, this.context.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
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
      if (!this.active3DChangePositionDraw) {
        // 不是3D改变位置时，拾取事件
        let pickedPrimitive = this.context.viewer.scene.pick(movement.position)
        let pickedEntity = this.context.Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined
        // 是否拾取实体--------
        if (pickedEntity) {
          console.log('单击点选空间要素：', pickedEntity)
          this.switchResourcePageByType(pickedEntity.id, pickedEntity.name) // 根据选择的实体类型切换编辑页面-------胡红勋
        }
      } else {
        // 3D改变位置时，关闭绘制
        this.set3DActiveChangePositionDraw(false)
        this.context.viewer.trackededEntity = null // 取消三维视图的选中效果
        this.context.viewer.selectedEntity = null // 取消三维视图的选中效果
      }
    },
    handlePickEvent(feature) { // 处理拾取事件
      console.log('拾取空间要素:' + feature)
      if (feature) {
        let { dataSet, dataSource, layer } = this.map3DConfig
        let layerName = layer || (dataSet + '@' + dataSource)
        let selected = true
        let layerSettings = this.layerSettingsMap.get(layerName)
        if (layerSettings && layerSettings.hasOwnProperty('selected')) {
          selected = layerSettings.selected
        }
        if (!this.active3DChangePositionDraw && selected) {
          // 不是3D改变位置时，拾取事件
          this.getOneBuildById(feature.SMID)
            .then(res => {
              this.setFeature(feature)
              this.setRightPanelShow(true)
              this.setRightPanelType('buildForm')
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          // 3D改变位置时，关闭绘制
          this.set3DActiveChangePositionDraw(false)
        }
      }
    },
    handleScenePostUpdate(scene, time) { // 处理场景渲染请求
      let lot = this.context.Cesium.Math.toDegrees(this.context.viewer.camera.positionCartographic.longitude)
      let lat = this.context.Cesium.Math.toDegrees(this.context.viewer.camera.positionCartographic.latitude)
      let altitude = this.context.viewer.camera.positionCartographic.height // 高度（单位：米）
      let heading = this.context.Cesium.Math.toDegrees(this.context.viewer.camera.heading)
      let pitch = this.context.Cesium.Math.toDegrees(this.context.viewer.camera.pitch)
      let roll = this.context.Cesium.Math.toDegrees(this.context.viewer.camera.roll)
      console.log('当前相机经度：', lot, '，纬度：', lat, '，高度：', altitude)
      console.log('当前相机方位信息：heading', heading, '，pitch：', pitch, '，roll：', roll)
    },
    handleMouseMove(movement) { // 处理鼠标移动事件
      if (!this.$store.getters['tdIndex/dbcdef'].tipCheck) { // 如果未勾选显示标签
        let pickedPrimitive = this.context.viewer.scene.pick(movement.endPosition)
        let pickedEntity = this.context.Cesium.defined(pickedPrimitive) ? pickedPrimitive.id : undefined
        var s3mlayerPick = this.getSelection()
        if (s3mlayerPick) { // 鼠标移入地面或楼宇上
          this.getOneBuildByIdWithoutUpdateState(s3mlayerPick.ID).then(res => {
            let labels = mapUtils.entitys.labels
            for (let item of labels) {
              this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
            if (res.hasOwnProperty('_id')) { // 鼠标移入已经设置楼宇信息的楼宇中（鼠标进入）
              let locValues = res.center.split(',').map(item => Number(item))
              let position = { lon: locValues[0], lat: locValues[1], height: res.height }
              if (mapUtils.entitys.labels.length === 0) {
                let labelEntity = utils.addLabel(this.context, position, res.name, res._id, mapUtils.CHANNELTYPE.building)
                mapUtils.entitys.labels.push(labelEntity)
              }
            }/* else { // 鼠标移入未设置楼宇信息的楼宇中或者地面中（鼠标离开）
              let labels = mapUtils.entitys.labels
              for (let item of labels) {
                this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
              }
              mapUtils.entitys.labels = []
            } */
            // eslint-disable-next-line handle-callback-err
          }).catch(function(err) {
            let labels = mapUtils.entitys.labels
            for (let item of labels) {
              this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          })
        } else { // 鼠标移入标注上
          if (pickedEntity) { // 鼠标移入标注上
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
            let labels = mapUtils.entitys.labels
            for (let item of labels) {
              this.context.viewer.entities.remove(item) // 实体集合中移除名称标签
            }
            mapUtils.entitys.labels = []
          }
        }
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
    async handleHoverEntity(pickedEntity, coordinats) {
      let {id, type} = {id: pickedEntity.id, type: pickedEntity.name}
      if (
        type === mapUtils.CHANNELTYPE.vedioResource || // 视频
        type === mapUtils.CHANNELTYPE.commonAlarmResource || // 普通报警
        type === mapUtils.CHANNELTYPE.fireAlarmResource || // 消防报警
        type === mapUtils.CHANNELTYPE.alarmHostResource || // 报警主机报警
        type === mapUtils.CHANNELTYPE.alarmBoxResource || // 报警箱
        type === mapUtils.CHANNELTYPE.alarmColumnResource // 报警柱
      ) {
        let resource = await this.getResourceByIdWithoutUpdateState(id)
        let locValues = resource.point3D.loc.split(',').map(item => Number(item))
        let position = { lon: coordinats[0], lat: coordinats[1], height: locValues[2] }
        if (mapUtils.entitys.labels.length === 0) {
          let labelEntity = utils.addLabel(this.$context, position, resource.name, resource._id, type)
          mapUtils.entitys.labels.push(labelEntity)
        }
      } else if (type === mapUtils.CHANNELTYPE.patrol) { // 巡更
        let resource = await this.getSinglePatrolPointWithoutUpdateState(id)
        let locValues = resource.point3D.geo.split(',').map(item => Number(item))
        let position = { lon: coordinats[0], lat: coordinats[1], height: locValues[2] }
        if (mapUtils.entitys.labels.length === 0) {
          let labelEntity = utils.addLabel(this.$context, position, resource.devName, resource._id, mapUtils.CHANNELTYPE.patrol)
          mapUtils.entitys.labels.push(labelEntity)
        }
      } else if (type === mapUtils.CHANNELTYPE.assist) { // 辅助杆
        let resource = await this.getAssistHoleByIdWithoutUpdateState(id)
        let locValues = resource.loc.split(',').map(item => Number(item))
        let position = { lon: coordinats[0], lat: coordinats[1], height: locValues[2] }
        if (mapUtils.entitys.labels.length === 0) {
          let labelEntity = utils.addLabel(this.$context, position, resource.name, resource._id, mapUtils.CHANNELTYPE.assist)
          mapUtils.entitys.labels.push(labelEntity)
        }
      }
    }
  }
}
