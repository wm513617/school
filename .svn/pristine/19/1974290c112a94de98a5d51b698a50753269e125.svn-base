// 基本要素构造方法文件
import { GEOMETRYTYPE, POINTSTATE, VIDEOLABELLAYERMAP, MPSIGNKEY, DEFAULTOPS, RESOURCETYPE } from '../meta/common'
import StyleMeta from '../meta/style'
import layerMeta from '../meta/layer'
/**
 * 转换为名称要素
 * @param {*} arr 资源数据
 * @param {*} layerConfig 图层信息
 * @param {*} zoom 地图缩放级别
 * @param {*} isOuter 是否是楼外地图
 * @returns
 */
function transLabelFeatures(arr, layerConfig, zoom = 0, isOuter = true) {
  let labelFeatures = []
  if (arr && arr.length > 0) {
    for (let item of arr) {
      if (item.point) {
        let visible = getLabelVisible(item.point, layerConfig, zoom, isOuter)
        if (visible) {
          let geomType = getGeomTypeByMapSign(item) // 地理要素类型
          if (geomType) {
            let loc = item.point.loc || item.point.geo
            let symbol = JSON.parse(JSON.stringify(StyleMeta.pointLabel))
            symbol.textStyle.label = item.name || item.devName
            if (layerConfig.rType === RESOURCETYPE.patrol) {
              symbol.textStyle.fillColor = item.point.mapid ? DEFAULTOPS.outdoorLabelColor : DEFAULTOPS.indoorLabelColor
            } else {
              symbol.textStyle.fillColor = item.point.isouter ? DEFAULTOPS.outdoorLabelColor : DEFAULTOPS.indoorLabelColor
            }
            let feature = {
              geom: {
                type: geomType,
                points: loc
              },
              attributes: {
                id: item._id,
                type: layerConfig.name,
                rType: layerConfig.rType // 资源类型
              },
              symbol: symbol
            }
            labelFeatures.push(feature)
          }
        }
      }
    }
  }
  return labelFeatures
}

/**
 * 获取名称要素是否显示
 * @param {*} point 点位信息
 * @param {*} layerConfig 图层信息
 * @param {*} zoom 地图缩放级别
 * @param {*} isOuter 是否是楼外地图
 * @returns
 */
function getLabelVisible(point, layerConfig, zoom, isOuter) {
  let visible = true
  let [...videoLabelLayerIds] = VIDEOLABELLAYERMAP.values()
  if (videoLabelLayerIds.includes(layerConfig.id)) {
    visible = (zoom >= Math.ceil(point.class))
  } else if (layerConfig.id === layerMeta.fireAlarmLabel.id) {
    visible = (point.isouter === isOuter)
  }
  return visible
}

/**
 * 获取悬浮要素的名称要素
 * @param {*} attr 要素信息
 * @param {*} layerConfig 图层信息
 */
function getHoverLabelFeature(attr, layerConfig) {
  let geomType = getGeomTypeByMapSign(attr) // 地理要素类型
  let feature = null
  if (geomType) {
    let symbol = JSON.parse(JSON.stringify(StyleMeta.pointLabel))
    symbol.textStyle.label = attr.label
    symbol.textStyle.fillColor = attr.isOuter ? DEFAULTOPS.outdoorLabelColor : DEFAULTOPS.indoorLabelColor
    feature = {
      geom: {
        type: geomType,
        points: attr.loc
      },
      attributes: {
        id: attr.id,
        type: layerConfig.name,
        rType: layerConfig.rType // 资源类型
      },
      symbol: symbol
    }
  }
  return feature
}

/**
 * 根据地图标志获取地理要素类型
 * @param {*} attr 要素信息
 * @param {*} layerConfig 图层信息
 */
function getGeomTypeByMapSign(attr) {
  let type = GEOMETRYTYPE.POINT
  let {mapsign} = attr
  if (mapsign) {
    if (mapsign.signtype === MPSIGNKEY.lineString) { // 线
      type = GEOMETRYTYPE.MULTIPOLYLINE
    } else if (mapsign.signtype === MPSIGNKEY.polygon) { // 面
      type = GEOMETRYTYPE.MULTIPOLYGON
    }
  }
  return type
}

/**
 * 根据关键字获取报警点位状态
 * @param {*} key
 * @returns
 */
function getAlarmStateByKey(key) {
  let state = null
  switch (key) {
    case 1:
      state = POINTSTATE.ONLINE
      break
    case 0:
      state = POINTSTATE.OFFLINE
      break
    case 2:
      state = POINTSTATE.ARMIMG
      break
    case 3:
      state = POINTSTATE.UNARM
      break
    case 4:
      state = POINTSTATE.ALARMIMG
      break
  }
  return state
}

export default {
  transLabelFeatures,
  getAlarmStateByKey,
  getHoverLabelFeature
}
