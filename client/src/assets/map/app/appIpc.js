import { GeometryType } from '../GeometryType.js'
import STATE from '../edit/state.js'
import SymbolConfig from '../SymbolConfig.js'
import ipcUtil from '../edit/ipcUtil.js'
import spaceAnaysisUtil from '../spaceAnalysisUtil.js'
const jsts = require('jsts')
/**
 * 加载已入库的视频点位
 * @param {*} param
 */
function addVedio(array) {
  let featurelist = []
  if (array.length > 0) {
    array.forEach(element => {
      if (element.point) {
        let node = {
          _id: element._id,
          point: element.point,
          status: element.status,
          monitortype: element.monitortype
        }
        let symbol = ipcUtil.getStorageVedioSymbolByIpcTypeAndState(node.monitortype, node.status) // 当前要添加的feature的样式
        let type = ipcUtil.getVedioTypeByIpcKey(node.monitortype)
        let coods = node.point.loc.split(',')
        let newSymbol = JSON.parse(JSON.stringify(symbol))
        newSymbol.iconStyle.rotation = node.point.angle
        let feature = {
          geom: {
            type: GeometryType.POINT,
            points: [parseFloat(coods[0]), parseFloat(coods[1])]
          },
          attributes: {
            id: node._id,
            type: type,
            state: STATE.SAVE,
            level: node.point.class,
            lon: parseFloat(coods[0]),
            lat: parseFloat(coods[1]),
            visible: true
          },
          symbol: newSymbol
        }
        featurelist.push(feature)
      }
    })
  }
  return featurelist
}
// 转换视频点位为要素数组-------开始-----
function convertVedioPointToFeatures(datas) {
  let featurelist = []
  if (datas.length > 0) {
    datas.forEach(data => {
      let symbol = ipcUtil.getStorageVedioSymbolByIpcTypeAndState(data.monitortype, data.status) // 根据点位类型以及点位状态获取点位渲染符号
      let coods = data.point ? data.point.loc : data.point3D.loc
      let feature = {
        geom: {
          type: GeometryType.POINT,
          points: coods
        },
        attributes: {
          id: data._id,
          type: data.type,
          state: STATE.SAVE,
          status: data.status
        },
        symbol: symbol
      }
      featurelist.push(feature)
    })
  }
  return featurelist
}
// 转换视频点位为要素数组-------结束-----
/**
 * 加载已入库的视频点位可视域
 * @param {*} param
 */
function addSector(array) {
  let sectorlist = []
  if (array.length > 0) {
    array.forEach(element => {
      if (element.point) {
        let node = {
          _id: element._id,
          point: element.point,
          status: element.status,
          monitortype: element.monitortype
        }
        let type = ipcUtil.getVedioTypeByIpcKey(node.monitortype)
        let coods = node.point.loc.split(',')
        let attr = {
          id: node._id,
          type: type,
          state: STATE.SAVE,
          lon: parseFloat(coods[0]),
          lat: parseFloat(coods[1]),
          level: node.point.class,
          radius: node.point.radius,
          // endAngle: node.point.viewshed + node.point.angle,
          // startAngle: 0,
          endAngle: node.point.viewshed / 2 + node.point.angle,
          startAngle: node.point.angle - node.point.viewshed / 2,
          rotation: node.point.angle,
          visible: true
        }
        let points = ipcUtil.getSectorPoints(attr)
        let sector = {
          geom: {
            type: GeometryType.POLYGON,
            points: points
          },
          attributes: attr,
          symbol: SymbolConfig.sectorLayerSymbol
        }
        sectorlist.push(sector)
      }
    })
  }
  return sectorlist
}
/**
 * 根据层级控制视频点位的显示隐藏
 * @param {*} features
 * @param {*} level
 */
function controlVedioVisibleByLevel(features, level) {
  if (features.length > 1) {
    for (let i = features.length - 1; i >= 0; i--) {
      if (features[i].attributes.visible) {
        if (level.toFixed(3) < features[i].attributes.level) {
          features.splice(i, 1)
        }
      } else {
        features.splice(i, 1)
      }
    }
  } else {
    if (features[0] && features[0].attributes.visible) {
      if (level.toFixed(3) < features[0].attributes.level) {
        features = []
      }
    } else {
      features = []
    }
  }
  return features
}
/**
 * 根据视频点位的离线、在线状态改变ipc的图标
 * @param {*} features
 * @param {*} datas
 */
function changeVedioState(features, datas) {
  let feature = null
  if (datas.length > 0) {
    datas.forEach((data, index) => {
      feature = getFeatureById(features, data[0])
      features = deleteVedioOrSectorById(features, data[0])
      feature.symbol = ipcUtil.getStorageVedioSymbolByIpcTypeAndState(feature.attributes.type, data[1])
      features.push(feature)
    })
  }
  return features
}
/**
 * 删除当前的视频点位或可视域
 * @param {*} features
 * @param {*} currentFeature
 */
function deleteVedioOrSectorById(features, id) {
  if (id) {
    if (features.length > 0) {
      features.forEach((feature, index) => {
        if (feature.attributes.id === id) {
          features.splice(index, 1)
        }
      })
    } else {
      features = []
    }
  }
  return features
}

function addHightLightIcon(coods, id) {
  let feature = null
  if (coods.length > 0) {
    feature = {
      geom: {
        type: GeometryType.POINT,
        points: coods
      },
      attributes: {
        id: id
      },
      symbol: SymbolConfig.vedioHightLightSymbol
    }
  }
  return feature
}
/**
 * 点位勾选
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} checkList
 */
function checkVedioByType(obj) {
  let { vedioList, sectorList, checkList } = obj
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let sectorCol = JSON.parse(JSON.stringify(sectorList))
  let vedioFeatures = [] // 编辑模式视频点位数组
  let sectorFeatures = [] // 编辑模式视频点位可视域数组
  let vedioInMap = []
  let sectorInMap = []
  if (checkList.length === 1 && checkList[0] === 'sector') {
    vedioFeatures = []
    sectorFeatures = []
    vedioInMap = vedioList
    sectorInMap = sectorList
  } else {
    vedioCol.forEach((feature, index, arr) => {
      let has = checkVedioOrSector(feature, checkList)
      if (has) {
        feature.attributes.visible = true
        vedioFeatures.push(feature)
      } else {
        feature.attributes.visible = false
      }
      vedioInMap.push(feature)
    })
    if (checkList.indexOf('sector') > -1) {
      sectorCol.forEach((feature, index, arr) => {
        let has = checkVedioOrSector(feature, checkList)
        if (has) {
          feature.attributes.visible = true
          sectorFeatures.push(feature)
        } else {
          feature.attributes.visible = false
        }
        sectorInMap.push(feature)
      })
    } else {
      sectorFeatures = []
      sectorCol.forEach((feature, index, arr) => {
        feature.attributes.visible = false
      })
      sectorInMap = sectorCol
    }
  }
  return {
    vediolist: vedioFeatures,
    sectorlist: sectorFeatures,
    vedioInMap,
    sectorInMap
  }
}
/**
 * 根据勾选状况判断视频点位或可视域是否在显示
 * @param {*} feature
 * @param {*} checkList
 */
function checkVedioOrSector(feature, checkList) {
  let has = false
  for (let check of checkList) {
    if (feature.attributes.type === check) {
      has = true
      break
    } else {
      continue
    }
  }
  return has
}
/**
 * 通过id找出数组中相同id的元素
 * @param {*} features 数组 视频点位
 * @param {*} id
 */
function getFeatureById(features, id) {
  let feature = null
  if (id) {
    if (features.length > 0) {
      features.forEach(fea => {
        if (fea.attributes.id === id) {
          feature = fea
        }
      })
      return feature
    }
  }
}

/**
 * 根据鼠标移动位置查询视频点位位置
 * @param {*} vedios
 */
function findVedioSectorByPosition(vedios, obj, zoom) {
  const reader = new jsts.io.WKTReader()
  const result = {
    flag: false,
    info: null
  }
  for (let item of vedios) {
    let radius = 1.5
    if (zoom < 3) {
      radius = 1.5
    }
    if (zoom >= 3) {
      radius = 0.05 * zoom
      if (radius > 1) {
        radius = 1
      }
    }
    let lon = item.attributes.lon
    let lat = item.attributes.lat
    let points = ipcUtil.getCirclePoints({
      lon,
      lat,
      radius,
      sides: 60
    })
    let circlePoints = points.toString()
    const wkt = spaceAnaysisUtil.stringPolygonToWkt(circlePoints)
    const geo = reader.read(wkt)
    const pointStr = spaceAnaysisUtil.stringPointToWkt([obj.lon, obj.lat])
    const geoPoint = reader.read(pointStr)
    const flag = geo.contains(geoPoint)
    if (flag) {
      result.flag = true
      result.info = item
      break
    }
  }
  return result
}
export default {
  convertVedioPointToFeatures,
  addVedio,
  addSector,
  changeVedioState,
  controlVedioVisibleByLevel,
  addHightLightIcon,
  // 业务
  checkVedioByType,
  findVedioSectorByPosition,
  getFeatureById
}
