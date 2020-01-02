/**
模型预览组件js脚本
*/
import utils from 'assets/3DMap/utils/index.js'
import mapUtil from 'assets/3DMap/mapUtil.js'
export default {
  methods: {
    getCenterCoordinats() { // 获取视图中心点的经纬度坐标数组
      let { Cesium, viewer } = this.$refs.tdMap
      let canvas = viewer.scene.canvas // 场景的画布
      let ellipsoid = viewer.scene.globe.ellipsoid // 视图的椭球体
      let car2_center = new Cesium.Cartesian2(canvas.width / 2.0, canvas.height / 2.0) // canvas中心屏幕坐标（Cartesian2）
      let car3_center = viewer.camera.pickEllipsoid(car2_center) // 中心点世界坐标（Cartesian3）
      let cartographic = ellipsoid.cartesianToCartographic(car3_center) // 经纬度高度对象
      let coordinats = [ Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude) ]
      return coordinats
    },
    addEntitiesByOid(model, location) { // 根据资源类型添加实体
      let { oid, scale } = model
      if (mapUtil.MODELOID.videoArr.includes(oid)) { // 视频 0-3态（在线、离线offline、报警alarm、停用 stopped）
        let onlineLocation = utils.getMovedLocation(location, 0, 0) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.online, onlineLocation, scale)
        let offlineLocation = utils.getMovedLocation(location, 0, mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.offline, offlineLocation, scale)
        let alarmLocation = utils.getMovedLocation(location, 0, 2 * mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.alarm, alarmLocation, scale)
        let stoppedLocation = utils.getMovedLocation(location, 0, 3 * mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.unuse, stoppedLocation, scale)
      } else if (mapUtil.MODELOID.alarmArr.includes(oid)) { // 报警 1-3态（在线online、报警alarm、停用stopped）
        let onlineLocation = utils.getMovedLocation(location, 0, 0) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.online, onlineLocation, scale)
        let alarmLocation = utils.getMovedLocation(location, 0, mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.alarm, alarmLocation, scale)
        let stoppedLocation = utils.getMovedLocation(location, 0, 2 * mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.unuse, stoppedLocation, scale)
      } else if (mapUtil.MODELOID.alarmHelpArr.includes(oid)) { // 报警求助 13-3态（在线online、报警alarm、停用stopped）
        let onlineLocation = utils.getMovedLocation(location, 0, 0) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.online, onlineLocation)
        let alarmLocation = utils.getMovedLocation(location, 0, mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.alarm, alarmLocation)
        let stoppedLocation = utils.getMovedLocation(location, 0, 2 * mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.unuse, stoppedLocation)
      } else if (mapUtil.MODELOID.patrolArr.includes(oid)) { // 巡更 14-2态（在线online、报警alarm）
        let onlineLocation = utils.getMovedLocation(location, 0, 0) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.online, onlineLocation, scale)
        let alarmLocation = utils.getMovedLocation(location, 0, mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.alarm, alarmLocation, scale)
      } else if (mapUtil.MODELOID.singleArr.includes(oid)) { // 单兵 15-2态（在线online、报警alarm）
        let onlineLocation = utils.getMovedLocation(location, 0, 0) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.online, onlineLocation, scale)
        let alarmLocation = utils.getMovedLocation(location, 0, mapUtil.RESOURCESTATUS.deltaXStep) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.alarm, alarmLocation, scale)
      } else if (mapUtil.MODELOID.assistArr.includes(oid)) { // 辅助 16-1态(在线online)
        let onlineLocation = utils.getMovedLocation(location, 0, 0) // 获取经纬度坐标位置
        this.addEntityByStatus(model, mapUtil.RESOURCESTATUS.online, onlineLocation, scale)
      }
    },
    addEntityByStatus(model, status, location, scale = 1.0) { // 根据状态添加实体
      let { Cesium, viewer } = this.$refs.tdMap
      let { files, brightness, height } = model
      let existModel = false // 记录是否存在给定状态的模型
      let onlineModel = null // 在线模型的地址
      let position = Cesium.Cartesian3.fromDegrees(location[0], location[1], height)
      for (const file of files) {
        if (file.status === mapUtil.RESOURCESTATUS.online) {
          onlineModel = file.path
        }
        if (file.status === status && file.path) {
          existModel = true
          let colorParam = utils.getModelExtraColorParam(Cesium, brightness) // 获取模型附加颜色参数
          let entity = viewer.entities.add({ // 向视图中添加实体
            existModel: existModel,
            position: position, // 位置
            model: { // 模型
              uri: file.path, // 地址
              minimumPixelSize: 10,
              maximumScale: 128,
              scale: scale,
              color: colorParam.color, // 模型渲染色
              colorBlendMode: Cesium.ColorBlendMode.MIX, // 模型颜色渲染的方式
              colorBlendAmount: colorParam.amount // 颜色数量
            }
          })
          this.modelEntities.push(entity)
          break
        }
      }
      if (!existModel && onlineModel) { // 不存在给定状态模型且有在线模型时
        let statusColor = utils.getModelExtraColorParamByStatus(Cesium, status) // 获取模型附加颜色参数
        let entity = viewer.entities.add({ // 向视图中添加实体
          existModel: existModel,
          position: position, // 位置
          model: { // 模型
            uri: onlineModel, // 地址
            minimumPixelSize: 10,
            maximumScale: 128,
            scale: scale,
            color: statusColor.color, // 模型渲染色
            colorBlendMode: statusColor.mode, // 模型颜色渲染的方式
            colorBlendAmount: statusColor.amount // 颜色数量
          }
        })
        this.modelEntities.push(entity)
        if (status === mapUtil.RESOURCESTATUS.alarm) {
          this.alarmingEntities.push(entity)
        }
      }
    },
    handleScenePostRender(scene, time) { // 处理视图场景更新
      if (this.twinkleCounter > mapUtil.RESOURCESTATUS.twinkleStep) {
        this.twinkleCounter = 0
        for (let alarmingEntity of this.alarmingEntities) { // 遍历报警实体，更改附着颜色实现报警闪烁的效果
          alarmingEntity.model.colorBlendAmount = (alarmingEntity.model.colorBlendAmount._value === 0) ? mapUtil.RESOURCESTATUS.colorAmount : 0
        }
      } else {
        this.twinkleCounter++
      }
    }
  }
}
