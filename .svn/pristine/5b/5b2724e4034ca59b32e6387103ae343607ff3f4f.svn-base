// 实时报警要素构造方法
import { GEOMETRYTYPE, MPSIGNKEY } from '../../meta/common'
import SymbolConfig from '../../SymbolConfig'
import layerConfig from 'assets/2DMap/meta/layer'
import areaTrans from './area'
import areaStyle from '../../areaStyle'

const symbol = { // 对应 SymbolConfig 中的属性
  // 普通报警(alarmInput) 报警主机(alarmZone) 消防报警 巡更报警 单兵报警 人脸报警(人像布控faceAlarm)
  alarmInput: 'alarmPointAlarmSymbol',
  alarmZone: 'alarmPointHostSymbol',
  fireAlarm: 'fireAlarmPointAlarmSymbol',
  patrolAlarm: 'patrolAlarmSymbol',
  singleAlarm: 'singleAlarmSymbol',
  // 视频点位报警(视频报警(监控点报警monitorAlarm + 重点关注focusAttention) + 智能报警(violation违章报警 + 智能报警intelligent)): 枪机、半球、快球、红外枪机、全景
  boltipc: 'boltAlarmSymbol',
  halfBallipc: 'halfBallAlarmSymbol',
  fastBallipc: 'fastBallAlarmSymbol',
  redBoltipc: 'redBoltAlarmSymbol',
  allViewipc: 'allViewAlarmSymbol',
  // 报警求助(alarmHelp): 报警柱 报警箱
  alarmBox: 'alarmBoxAlarmSymbol',
  alarmPillar: 'alarmColumnAlarmSymbol',
  // 人脸报警 faceAlarm
  faceAlarm: 'faceAlarmSymbol'
}

// 数据处理
function getItemData(item) {
  let loc
  let _id
  let style
  let isOuter
  let ids = item.alarmId || item.uniqueId || item._id // 报警Id: socket接收,alarmId,uniqueId  接口获取,_id
  let name = item.name || item.devName || item.resName || item.username || item.realname
  if (item.map2D) { // 巡更
    loc = item.map2D.geo.split(',').map(item => Number(item))
    _id = item._id
    isOuter = item.map2D.isouter
  } else if (item.point) { // 普通报警
    loc = item.point.loc || (item.point.lon && item.point.lat && (item.point.lon + ',' + item.point.lat))
    isOuter = item.point.hasOwnProperty('point') ? item.point.isouter : true
    _id = item.chanId || item.channelId || item.res
    style = item.point.style
  } else if (item.bondCarmerRes && item.bondCarmerRes.point) { // 报警求助
    loc = item.bondCarmerRes.point.loc
    isOuter = item.bondCarmerRes.point.isouter
    _id = item.bondCarmerRes._id || item.chanId
    name = item.bondCarmerRes.name
  }
  _id = _id || item._id
  return {
    loc,
    isOuter,
    ids, // 报警Id
    _id, // 资源Id
    name,
    style
  }
}

/**
 * 构造点要素
 * @param {*} item 单个报警数据
 */
function transCommonAlarmFeatures(item, opacity = 1) {
  const layer = layerConfig.alarming
  const alarmIcon = symbol[item.alarmTypeToMap]
  let symbolIcon = JSON.parse(JSON.stringify(SymbolConfig[alarmIcon]))
  if (item.symbolUrl) {
    symbolIcon.iconStyle.url = item.symbolUrl
  }
  symbolIcon.iconStyle.opacity = opacity
  const data = getItemData(item)
  if (data && data.loc) {
    let loc = data.loc
    let feature = {
      geom: {
        type: GEOMETRYTYPE.POINT,
        points: loc
      },
      attributes: {
        id: data._id, // 资源Id
        idAlarm: data.ids, // 报警Id
        type: layer.name,
        rType: layer.rType,
        loc,
        isOuter: data.isOuter,
        label: data.name,
        mapsign: item.mapsign,
        alarmType: item.alarmModelType, // 用于弹出报警详情弹窗
        isTimeout: item.isTimeout // 用于单兵超时报警，弹出面板
      },
      symbol: symbolIcon
    }
    return feature
  }
}

/**
 * 构造点位报警要素
 * @param {*} data 所有报警数据 []
 * @opacity opacity 图标不透明度
 */
function transPointAlarmFeatures(data, opacity) {
  const features = []
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.mapsign) {
      if (item.mapsign.signtype === MPSIGNKEY.point) { // 点
        features.push(transCommonAlarmFeatures(item, opacity))
      } else if (item.mapsign.signtype === MPSIGNKEY.lineString) { // 线
        if (item.point.style) {
          features.push(getLineStringFeature(item, layerConfig, opacity))
        } else {
          features.push(transCommonAlarmFeatures(item, opacity))
        }
      } else if (item.mapsign.signtype === MPSIGNKEY.polygon) { // 面
        // const areaData = getItemData(item)
        features.push(getPolygonFeature(item, 'innerArea', undefined, opacity))
      }
    } else {
      features.push(transCommonAlarmFeatures(item, opacity))
      // console.log(item, 'mapsign: null')
    }
  }
  return features
}

/**
 * 获取面要素
 * @param {*} alarm 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function getPolygonFeature(item, type, style, opacity = 1) {
  let layer
  let data
  let geoType
  let styleC
  if (type === 'innerArea') { // 楼层内显示区域
    data = getItemData(item)
    layer = layerConfig.alarming
    geoType = GEOMETRYTYPE.POLYGON
    styleC = JSON.parse(JSON.stringify(areaStyle.buildAlarmStyle))
  }
  if (type === 'buildArea') { // 楼层外楼宇区域
    data = item
    layer = layerConfig.alarmingArea
    geoType = GEOMETRYTYPE.MULTIPOLYGON
    styleC = JSON.parse(JSON.stringify(style))
  }
  styleC.fillColor = opacity === 1 ? 'rgba(255,0,0,0.5)' : 'rgba(255,0,0,0.01)'
  let feature = {
    geom: {
      type: geoType,
      points: data.loc
    },
    attributes: {
      id: data._id, // 资源Id
      idAlarm: data.ids, // 报警Id
      type: layer.name,
      rType: layer.rType, // 资源类型
      label: data.name,
      mapsign: item.mapsign,
      loc: data.loc,
      isOuter: data.isOuter,
      style: data.style,
      isAlarm: true, // 用于判断是否显示名称要素
      alarmType: type === 'buildArea' ? 'buildingAlarm' : item.alarmModelType, // 用于弹出报警详情弹窗
      isTimeout: item.isTimeout, // 用于单兵超时报警，弹出面板
      center: item.center
    },
    symbol: styleC
  }
  return feature
}

/**
 * 构造区域报警要素 楼内报警 楼宇区域闪烁
 * @param {*} areaArr 区域报警数据
 * @param {*} style 区域样式
 */
function transAreaAlarmFeatures(areaArr, style) {
  let arr = []
  for (let i = 0; i < areaArr.length; i++) {
    let area = areaArr[i]
    arr.push(getPolygonFeature(area, 'buildArea', style))
  }
  return arr
}

/**
 * 获取线要素
 * @param {*} item 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function getLineStringFeature(item, layerConfig, opacity = 1) {
  const layer = layerConfig.alarmLine
  let styleC = JSON.parse(JSON.stringify(areaStyle.buildAlarmStyle)) // 深拷贝样式
  styleC = areaTrans.convertStyleToSymbol(styleC, item.point.style)
  styleC.strokeStyle.outLineColor = 'rgba(255, 0, 0, ' + opacity + ')'
  const data = getItemData(item)
  let feature
  if (data && data.loc) {
    feature = {
      geom: {
        type: GEOMETRYTYPE.POLYLINE,
        points: data.loc
      },
      attributes: {
        id: data._id, // 资源Id
        idAlarm: data.ids, // 报警Id
        type: layer.name,
        rType: layer.rType, // 资源类型
        label: data.name,
        mapsign: item.mapsign,
        loc: data.loc,
        isOuter: data.isOuter,
        isAlarm: true, // 用于判断是否显示名称要素
        alarmType: item.alarmModelType, // 用于弹出报警详情弹窗
        isTimeout: item.isTimeout // 用于单兵超时报警，弹出面板
      },
      symbol: styleC
    }
  }
  return feature
}

export default {
  transPointAlarmFeatures,
  transAreaAlarmFeatures
}
