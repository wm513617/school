// 视频点位要素构造方法
import { GEOMETRYTYPE, VIDEOTYPEKEY, POINTSTATE, CAMERATYPE, MAPMODE, PROJ, DEFAULTOPS, RESICONOID } from '../../meta/common'
import SymbolConfig from '../../SymbolConfig'
import { toMercator, toWgs84 } from '@turf/projection'
import { point } from '@turf/helpers'

/**
 * 构造图标要素
 * @param {*} arr 资源数据
 * @param {*} layerConfig 图层配置信息
 * @param {*} zoom 地图缩放级别
 * @returns
 */
function transIconFeatures(arr, layerConfig, zoom, pointMode = MAPMODE.point2D) {
  let features = []
  for (const item of arr) {
    if (item[pointMode]) {
      let { _id, name, type, status, monitortype, eid, monitoryPointGenera } = item
      let point = JSON.parse(JSON.stringify(item[pointMode]))
      point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
      let isShow = (pointMode === MAPMODE.point2D) ? zoom >= Math.ceil(point.class) : true
      if (isShow) {
        let {deviceStatus} = eid
        monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
        deviceStatus = (typeof deviceStatus === 'undefined') ? 1 : deviceStatus
        let coods = point.loc.split(',').map(cood => Number(cood))
        let symbol = getIpcIconSymbol(monitoryPointGenera, monitortype, status, deviceStatus) // 获取监控图标样式
        if (point.mid) { // 有图标信息时
          let icon = point.mid
          if (icon.files && icon.files instanceof Array) {
            for (const file of icon.files) {
              if (deviceStatus) { // 启用
                if (status && file.status === POINTSTATE.ONLINE) { // 在线
                  symbol.iconStyle.url = file.path
                  break
                } else if (!status && file.status === POINTSTATE.OFFLINE) { // 离线
                  symbol.iconStyle.url = file.path
                  break
                }
              } else {
                if (file.status === POINTSTATE.UNUSE) { // 禁用
                  symbol.iconStyle.url = file.path
                  break
                }
              }
            }
          }
          if ((!icon.hasOwnProperty('isRotate') && DEFAULTOPS.rotateIpcTypes.includes(icon.oid)) || icon.isRotate) {
            symbol.iconStyle.rotation = DEFAULTOPS.ballIpcTypes.includes(Number(icon.oid.replace(RESICONOID.video, ''))) ? point.angle - DEFAULTOPS.ballIpcAdjustAngle : point.angle // 设置图标旋转
          }
        }
        let feature = {
          geom: {
            type: GEOMETRYTYPE.POINT,
            points: point.loc
          },
          attributes: {
            id: _id,
            type: layerConfig.name, // 类型
            rType: type, // 资源类型
            sRType: monitortype, // 视频资源类型（0：枪机，1：红外枪机，2：半球，3：快球，4：全景）
            monitoryPointGenera: monitoryPointGenera, // 视频业务类型（0：普通ipc，1：人脸抓拍，2：交通抓拍）
            projection: point.projection || PROJ.EPSG4326, // 要素坐标——投影坐标系
            label: name,
            loc: point.loc,
            isOuter: point.isouter,
            lon: coods[0],
            lat: coods[1],
            level: point.class,
            radius: point.radius,
            endAngle: point.viewshed / 2 + point.angle,
            startAngle: point.angle - point.viewshed / 2,
            rotation: point.angle
          },
          symbol: symbol
        }
        features.push(feature)
      }
    }
  }
  return features
}

/**
 * 获取监控图标样式
 * @param {*} monitoryPointGenera 监控点业务分类
 * @param {*} monitortype 监控类型
 * @param {*} state 状态（在线、离线）
 * @param {*} deviceStatus 设备状态（启用、禁用）
 */
function getIpcIconSymbol(monitoryPointGenera, monitortype, status, deviceStatus) {
  let symbol = null
  switch (monitoryPointGenera) {
    case CAMERATYPE.normalipc: // 普通IPC
      symbol = getSymbolByMonitortype(monitortype, status, deviceStatus)
      break
    case CAMERATYPE.verfaceipc: // 人脸抓拍
      symbol = deviceStatus ? (status ? SymbolConfig.verfaceipcOnlineSymbol : SymbolConfig.verfaceipcOfflineSymbol) : SymbolConfig.verfaceipcUnuseSymbol
      break
    case CAMERATYPE.trafficipc: // 交通抓拍
      symbol = deviceStatus ? (status ? SymbolConfig.trafficipcOnlineSymbol : SymbolConfig.trafficipcOfflineSymbol) : SymbolConfig.trafficipcUnuseSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 获取监控图标样式
 * @param {*} monitortype 监控类型
 * @param {*} state 状态
 */
function getSymbolByMonitortype(monitortype, status, deviceStatus) {
  let symbol = null
  switch (monitortype) {
    case VIDEOTYPEKEY.boltipc: // 枪机
      symbol = deviceStatus ? (status ? SymbolConfig.boltVedioOnlineSymbol : SymbolConfig.boltVedioOfflineSymbol) : SymbolConfig.boltVedioUnuseSymbol
      break
    case VIDEOTYPEKEY.halfBallipc: // 半球
      symbol = deviceStatus ? (status ? SymbolConfig.halfBallVedioOnlineSymbol : SymbolConfig.halfBallVedioOfflineSymbol) : SymbolConfig.halfBallVedioUnuseSymbol
      break
    case VIDEOTYPEKEY.fastBallipc: // 快球
      symbol = deviceStatus ? (status ? SymbolConfig.fastBallVedioOnlineSymbol : SymbolConfig.fastBallVedioOfflineSymbol) : SymbolConfig.fastBallVedioUnuseSymbol
      break
    case VIDEOTYPEKEY.allViewipc: // 全景
      symbol = deviceStatus ? (status ? SymbolConfig.allViewVedioOnlineSymbol : SymbolConfig.allViewVedioOfflineSymbol) : SymbolConfig.allViewVedioUnuseSymbol
      break
    case VIDEOTYPEKEY.redBoltipc: // 红外枪机
      symbol = deviceStatus ? (status ? SymbolConfig.redBoltVedioOnlineSymbol : SymbolConfig.redBoltVedioOfflineSymbol) : SymbolConfig.redBoltVedioUnuseSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 构造扇形覆盖域要素
 * @param {*} arr 资源数据
 * @param {*} layerConfig 图层信息
 * @param {*} zoom 地图缩放级别
 * @returns
 */
function transSectorFeatures(arr, layerConfig, zoom) {
  let features = []
  for (const item of arr) {
    if (item.point) {
      let { _id, type, point, monitortype } = item
      if (zoom >= Math.ceil(point.class)) {
        let coods = point.loc.split(',').map(cood => Number(cood))
        let attr = {
          id: _id,
          type: layerConfig.name,
          rType: type, // 资源类型
          sRType: monitortype, // 视频资源类型
          projection: point.projection || PROJ.EPSG4326, // 要素坐标——投影坐标系
          isOuter: point.isouter,
          lon: coods[0],
          lat: coods[1],
          level: point.class,
          radius: point.radius,
          endAngle: point.viewshed / 2 + point.angle,
          startAngle: point.angle - point.viewshed / 2,
          rotation: point.angle
        }
        let points = getSectorGeometryPoints(attr)
        let feature = {
          geom: {
            type: GEOMETRYTYPE.POLYGON,
            points: points
          },
          attributes: attr,
          symbol: SymbolConfig.sectorLayerSymbol
        }
        features.push(feature)
      }
    }
  }
  return features
}

/**
 * 获取悬浮要素的可视域要素
 * @param {*} attr 要素信息
 * @param {*} layerConfig 图层信息
 * @returns
 */
function getHoverSectorFeature(attr, layerConfig) {
  let attributes = {
    id: attr.id,
    projection: attr.projection || PROJ.EPSG4326, // 要素坐标——投影坐标系
    type: layerConfig.name,
    rType: layerConfig.rType, // 资源类型
    sRType: layerConfig.sRType, // 视频资源类型
    isOuter: attr.isOuter,
    lon: attr.lon,
    lat: attr.lat,
    level: attr.level,
    radius: attr.radius,
    endAngle: attr.endAngle,
    startAngle: attr.startAngle,
    rotation: attr.rotation
  }
  let points = getSectorGeometryPoints(attributes)
  let feature = {
    geom: {
      type: GEOMETRYTYPE.POLYGON,
      points: points
    },
    attributes: attributes,
    symbol: SymbolConfig.sectorLayerSymbol
  }
  return feature
}

/**
 * 获取视频覆盖区域扇形的几何点
 * @param {*} attr 资源信息
 */
function getSectorGeometryPoints(attr) {
  let points = [] // 返回点集
  let { lon, lat, radius, sides = 60, endAngle, startAngle = 0, projection } = attr
  let angle = endAngle - startAngle // 扇形角度
  let origin = projection === PROJ.EPSG4326 ? toMercator(point([lon, lat])).geometry.coordinates : [lon, lat] // 根据要素的投影坐标系进行转换
  let anglePer = angle / sides // 每个分割扇形角度
  points.push([lon, lat]) // 存入起始点
  for (let i = 0; i < sides; ++i) { // 遍历分割数量，将旋转后的点放入点集中
    let rotatedAngle = (i * anglePer + startAngle) * Math.PI / 180
    let cur = [origin[0] + radius * Math.cos(rotatedAngle), origin[1] + radius * Math.sin(rotatedAngle)] // 计算旋转点
    cur = projection === PROJ.EPSG4326 ? toWgs84(cur) : cur // 根据要素的投影坐标系进行转换
    points.push(cur)
  }
  points.push(points[0]) // 再次放入起始点，组成封闭的图形
  return points
}

export default {
  transIconFeatures,
  transSectorFeatures,
  getHoverSectorFeature
}
