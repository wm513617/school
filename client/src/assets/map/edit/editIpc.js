import {
  GeometryType
} from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig.js'
import STATE from './state.js'
import ipcUtil from './ipcUtil.js'
// const IPCTYPE = {
//   boltipc: 'boltipc',
//   redBoltipc: 'redBoltipc',
//   halfBallipc: 'halfBallipc',
//   fastBallipc: 'fastBallipc',
//   allViewipc: 'allViewipc'
// }
// const SECTOR = 'sector'
/**
 * 添加点位
 * @param {*} param
 */
function addVedioIpc(param) {
  let {
    coods,
    level,
    node
  } = param
  let symbol = ipcUtil.getVedioSymbolByIpcKey(node.monitortype) // 当前要添加的feature的样式
  let type = ipcUtil.getVedioTypeByIpcKey(node.monitortype)
  let newSymbol = JSON.parse(JSON.stringify(symbol))
  newSymbol.iconStyle.rotation = 0
  let feature = {
    geom: {
      type: GeometryType.POINT,
      points: coods
    },
    attributes: {
      id: node._id,
      type: type,
      state: STATE.SAVE,
      level: level,
      lon: coods[0],
      lat: coods[1]
    },
    symbol: newSymbol
  }
  return feature
}
/**
 * 添加可视域
 * @param {*} param
 */
function addSector(param) {
  let {
    id,
    type,
    coods,
    level,
    radius,
    endAngle,
    startAngle,
    rotation
  } = param
  let loc = coods.split(',')
  let attr = {
    id,
    type,
    state: STATE.EDIT,
    lon: parseFloat(loc[0]),
    lat: parseFloat(loc[1]),
    level: level,
    radius: radius,
    endAngle: endAngle,
    startAngle: startAngle,
    rotation: rotation
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
  return sector
}
/**
 * 加载已入库的视频点位
 * @param {*} param
 */
function addAllStorageVedio(vedioSecorlist, array) {
  let featurelist = JSON.parse(JSON.stringify(vedioSecorlist))
  if (array.length > 0) {
    array.forEach(element => {
      let feature = getFeatureById(featurelist, element._id)
      if (!feature) {
        let node = {
          _id: element._id,
          point: element.point,
          status: element.status,
          monitortype: element.monitortype
        }
        let symbol = ipcUtil.getVedioSymbolByIpcKey(node.monitortype)
        let type = ipcUtil.getVedioTypeByIpcKey(node.monitortype)
        let coods = node.point.loc.split(',')
        let newSymbol = JSON.parse(JSON.stringify(symbol))
        newSymbol.iconStyle.rotation = node.point.angle
        feature = {
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

function addAllStorageSector(vedioSecorlist, array) {
  let featurelist = JSON.parse(JSON.stringify(vedioSecorlist))
  if (array.length > 0) {
    array.forEach(element => {
      let feature = getFeatureById(featurelist, element._id)
      if (!feature) {
        let type = ipcUtil.getVedioTypeByIpcKey(element.monitortype)
        let coods = element.point.loc.split(',')
        let attr = {
          id: element._id,
          type,
          state: STATE.SAVE,
          lon: parseFloat(coods[0]),
          lat: parseFloat(coods[1]),
          level: element.point.class,
          radius: element.point.radius,
          // endAngle: element.point.viewshed + element.point.angle,
          // startAngle: element.point.angle,
          endAngle: element.point.viewshed / 2 + element.point.angle,
          startAngle: element.point.angle - element.point.viewshed / 2,
          rotation: element.point.angle
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
        featurelist.push(sector)
      }
    })
  }
  return featurelist
}
/**
 * 编辑可视域
 * @param {*} sectorFeatures 数组 视频点位可视域
 * @param {*} currentSector 视频点位对象
 * @param {*} param
 */
function editSector(currentSector, param) {
  let {
    level,
    radius,
    endAngle,
    startAngle,
    rotation
  } = param
  let sector = null
  if (currentSector) {
    let attr = {
      id: currentSector.attributes.id,
      lon: currentSector.attributes.lon,
      lat: currentSector.attributes.lat,
      type: currentSector.attributes.type,
      state: currentSector.attributes.state,
      level: level,
      radius: radius,
      endAngle: endAngle,
      startAngle: startAngle,
      rotation: rotation
    }
    let points = ipcUtil.getSectorPoints(attr)
    sector = {
      geom: {
        type: GeometryType.POLYGON,
        points: points
      },
      attributes: attr,
      symbol: SymbolConfig.sectorLayerSymbol
    }
  }
  return sector
}
/**
 * 编辑视频点位（点位角度和可视层级）
 * @param {*} videoIpcFeatures
 * @param {*} currentFeature
 * @param {*} param
 */
function editVedioIpc(currentFeature, param) {
  let {
    level,
    rotation
  } = param
  let feature = null
  if (currentFeature) {
    let newSymbol = JSON.parse(JSON.stringify(currentFeature.symbol))
    newSymbol.iconStyle.rotation = rotation
    currentFeature.attributes.level = level
    feature = {
      geom: currentFeature.geom,
      attributes: currentFeature.attributes,
      symbol: newSymbol
    }
  }
  return feature
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
/**
 * 删除视频点位或可视域
 * @param {*} features
 * @param {*} currentFeature
 */
function deleteVedioOrSector(features, currentFeature) {
  if (currentFeature) {
    if (features.length > 0) {
      features.forEach((feature, index) => {
        if (feature.attributes.id === currentFeature.attributes.id) {
          features.splice(index, 1)
        }
      })
    } else {
      features = []
    }
  }
  return features
}
// 胡红勋新添加 2018-09-6
function convertPointDataToFeatures(pointDatas) {
  let features = []
  pointDatas.forEach((data, index) => {
    let symbol = ipcUtil.getVedioSymbolByIpcKey(data.monitortype) // 当前要添加的feature的样式
    let newSymbol = JSON.parse(JSON.stringify(symbol))
    newSymbol.iconStyle.rotation = data.angle
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
        monitorType: data.monitortype
      },
      symbol: newSymbol
    }
    features.push(feature)
  })
  return features
}

function addPointDataToFeatures(data, Features) {
  let featurelist = JSON.parse(JSON.stringify(Features))
  let fea = getFeatureById(featurelist, data._id)
  if (fea) {
    return
  }
  let symbol = ipcUtil.getVedioSymbolByIpcKey(data.monitortype) // 当前要添加的feature的样式
  let newSymbol = JSON.parse(JSON.stringify(symbol))
  newSymbol.iconStyle.rotation = data.angle
  let type = ipcUtil.getVedioTypeByIpcKey(data.monitortype)
  let coods = data.point.loc.split(',')
  let feature = {
    geom: {
      type: GeometryType.POINT,
      points: [parseFloat(coods[0]), parseFloat(coods[1])]
    },
    attributes: {
      id: data._id,
      type: type,
      state: STATE.SAVE,
      lon: parseFloat(coods[0]),
      lat: parseFloat(coods[1])
    },
    symbol: newSymbol
  }
  featurelist.push(feature)
  return featurelist
}
/**
 * 加载已入库的视频点位
 * @param {*} param
 */
function addSaveVedioIpc(node) {
  if (node) {
    let symbol = ipcUtil.getVedioSymbolByIpcKey(node.monitortype) // 当前要添加的feature的样式
    let newSymbol = JSON.parse(JSON.stringify(symbol))
    newSymbol.iconStyle.rotation = node.angle
    let type = ipcUtil.getVedioTypeByIpcKey(node.monitortype)
    let coods = node.loc.split(',')
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: [parseFloat(coods[0]), parseFloat(coods[1])]
      },
      attributes: {
        id: node._id,
        type: type,
        state: STATE.SAVE,
        level: node.class,
        lon: parseFloat(coods[0]),
        lat: parseFloat(coods[1])
      },
      symbol: newSymbol
    }
    return feature
  }
}
/**
 * 加载已入库的视频点位可视域
 * @param {*} param
 */
function addSaveVedioSector(node) {
  if (node) {
    let type = ipcUtil.getVedioTypeByIpcKey(node.monitortype)
    let coods = node.loc.split(',')
    let attr = {
      id: node._id,
      type: type,
      state: STATE.SAVE,
      lon: parseFloat(coods[0]),
      lat: parseFloat(coods[1]),
      level: node.class,
      radius: node.radius,
      endAngle: node.viewshed + node.angle,
      startAngle: node.angle,
      rotation: node.angle
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
    return sector
  }
}
/**
 * 通过类型获取视频点位
 * @param {*} features 数组 视频点位/可视域数组
 * @param {*} type 视频点位类型
 */
function getVedioOrSectorByType(features, type) {
  let newFeatures = features.filter((feature) => {
    return feature.attributes.type === type
  })
  return newFeatures
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
      features.forEach((fea) => {
        if (fea.attributes.id === id) {
          feature = fea
        }
      })
      return feature
    }
  }
}
/**
 * 查看某个对象是否在地图中
 * @param {*} features
 * @param {*} currentFeature
 */
function isExistInMap(features, id) {
  let array = getFeatureById(features, id)
  let isExist = false
  if (array.length === 1) {
    isExist = true
  }
  return isExist
}

function updateVedioState(vedioList, id) {
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let curVedio = getFeatureById(vedioCol, id)
  vedioCol = deleteVedioOrSectorById(vedioCol, id)
  curVedio = changeVedioOrSectorState(curVedio, STATE.EDIT)
  curVedio && vedioCol.push(curVedio)
  return vedioCol
}
/**
 * 视频点位/视频可视域 的点击事件
 * 当前操作的视频点位/可视域对象
 * @param {*} currentFeature
 */
function changeVedioOrSectorState(currentFeature, state) {
  let feature = null
  if (currentFeature) {
    currentFeature.attributes.state = state
    let newSymbol = null
    if (currentFeature.geom.type === GeometryType.POINT) {
      let symbol = null
      if (state === STATE.EDIT) {
        // 编辑状态ipc得到样式
        symbol = ipcUtil.getVedioEditSymbolByIpcKey(currentFeature.attributes.type)
      } else {
        // 保存状态ipc的样式
        symbol = ipcUtil.getVedioSymbolByIpcKey(currentFeature.attributes.type)
      }
      newSymbol = JSON.parse(JSON.stringify(symbol))
      newSymbol.iconStyle.rotation = currentFeature.symbol.iconStyle.rotation
    } else {
      newSymbol = SymbolConfig.sectorLayerSymbol
    }
    feature = {
      geom: currentFeature.geom,
      attributes: currentFeature.attributes,
      symbol: newSymbol
    }
  }
  return feature
}
/**
 * 改变点位或可视域经纬度属性的值
 * @param {*} features
 * @param {*} coods
 */
function changeFeatureAttrPosition(feature, coods) {
  if (feature) {
    feature.attributes.lon = coods[0]
    feature.attributes.lat = coods[1]
    if (feature.geom.type === GeometryType.POINT) {
      feature.geom.points = coods
    } else {
      feature.geom.points = ipcUtil.getSectorPoints(feature.attributes)
    }
  } else {
    feature = null
  }
  return feature
}
// 业务代码
/**
 * 保存按钮
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} id
 */
function saveVedioAndSector(obj) {
  let {
    vedioList,
    sectorList,
    id
  } = obj
  if (!id) {
    return {
      vediolist: vedioList,
      sectorlist: sectorList,
      sector: null
    }
  }
  let vedioCol = JSON.parse(JSON.stringify(vedioList)) // 视频点位列表
  let sectorCol = JSON.parse(JSON.stringify(sectorList)) // 可视区域列表----
  let currentVedio = getFeatureById(vedioCol, id) // 根据id获取当前视频点位
  let currentSector = getFeatureById(sectorCol, id) // 根据id获取当前可视区域
  vedioCol = deleteVedioOrSectorById(vedioCol, id) // 删除指定id的可视区域要素---
  let vedio = changeVedioOrSectorState(currentVedio, STATE.SAVE) // 更改要素状态---
  vedio && vedioCol.push(vedio)
  sectorCol = deleteVedioOrSectorById(sectorCol, id) // 根据id删除数组中的元素，并将删除后的数组返回
  let sector = changeVedioOrSectorState(currentSector, STATE.SAVE) // 更改要素状态
  if (sector) {
    sectorCol.push(sector)
  } else {
    // let attr = {
    //   id,
    //   type: currentVedio && currentVedio.attributes.type,
    //   state: STATE.SAVE,
    //   lon: currentVedio && currentVedio.attributes.lon,
    //   lat: currentVedio && currentVedio.attributes.lat,
    //   level: currentVedio && currentVedio.attributes.level,
    //   radius:50,
    //   endAngle: 45,
    //   startAngle: -45,
    //   rotation: 0
    // }
    // let points = ipcUtil.getSectorPoints(attr)
    // sector = {
    //   geom: {
    //     type: GeometryType.POLYGON,
    //     points: points
    //   },
    //   attributes: attr,
    //   symbol: SymbolConfig.sectorLayerSymbol
    // }
    // sectorCol.push(sector)
  }
  return {
    vediolist: vedioCol,
    sectorlist: sectorCol,
    sector: sector
  }
}
/**
 * 删除按钮
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} id
 */
function deleteVedioAndSector(obj) {
  let {
    vedioList,
    sectorList,
    id
  } = obj
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let sectorCol = JSON.parse(JSON.stringify(sectorList))
  vedioCol = deleteVedioOrSectorById(vedioCol, id)
  sectorCol = deleteVedioOrSectorById(sectorCol, id)
  return {
    vediolist: vedioCol,
    sectorlist: sectorCol
  }
}
/**
 * 改变照射半径、点位角度时，可视域发生变化
 * @param {*} currentSector
 * @param {*} sectorList
 * @param {*} param
 */
function editSectorRadiusOrAngle(obj) {
  let {
    currentSector,
    sectorList,
    param
  } = obj
  let curSector = JSON.parse(JSON.stringify(currentSector))
  let sectorCol = JSON.parse(JSON.stringify(sectorList))
  sectorCol = deleteVedioOrSector(sectorCol, curSector)
  let sector = editSector(curSector, param)
  sector && sectorCol.push(sector)
  return {
    sectorlist: sectorCol,
    currentSector: sector
  }
}
/**
 * 点位角度发生变化时，点位发生变化
 * @param {*} currentVedio
 * @param {*} vedioList
 * @param {*} param
 */
function editVedioAngle(obj) {
  let {
    currentVedio,
    vedioList,
    param
  } = obj
  let curVedio = JSON.parse(JSON.stringify(currentVedio))
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  vedioCol = deleteVedioOrSector(vedioCol, curVedio)
  let vedio = editVedioIpc(curVedio, param)
  vedio && vedioCol.push(vedio)
  return {
    vediolist: vedioCol,
    currentVedio: vedio
  }
}
/**
 * 加载已入库的视频点位和可视域
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} node
 */
function addStorageFeature(obj) {
  let {
    vedioList,
    sectorList,
    node
  } = obj
  if (node) {
    let vedioCol = JSON.parse(JSON.stringify(vedioList))
    let sectorCol = JSON.parse(JSON.stringify(sectorList))
    let vedio = getFeatureById(vedioCol, node._id) // 根据id获取数组中的元素----
    let sector = getFeatureById(sectorCol, node._id) // 根据id获取数组中的元素----
    if (!vedio) {
      vedio = addSaveVedioIpc(node)
      vedioCol.push(vedio)
    }
    if (!sector) {
      sector = addSaveVedioSector(node)
      sectorCol.push(sector)
    }
    return {
      vediolist: vedioCol,
      sectorlist: sectorCol,
      sector: sector
    }
  }
}
/**
 * 点击事件
 * 点击点位改变定位的状态save -> edit
 * @param {*} currentVedio
 * @param {*} currentSector
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} id
 * @param {*} state
 */
function changeStateById(obj) {
  let {
    currentVedio,
    vedioList,
    id,
    state
  } = obj
  let curVedio = JSON.parse(JSON.stringify(currentVedio))
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  vedioCol = deleteVedioOrSectorById(vedioCol, id)
  curVedio = changeVedioOrSectorState(curVedio, state)
  curVedio && vedioCol.push(curVedio)
  return {
    vediolist: vedioCol,
    currentVedio: curVedio
  }
}

/**
 * 编辑视频点位位置结束后
 * @param {*} currentVedio
 * @param {*} currentSector
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} coods
 */
function modifyPositionEnd(obj) {
  let {
    currentVedio,
    currentSector,
    vedioList,
    sectorList,
    coods
  } = obj
  let curVedio = JSON.parse(JSON.stringify(currentVedio))
  let curSector = JSON.parse(JSON.stringify(currentSector))
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let sectorCol = JSON.parse(JSON.stringify(sectorList))
  let id = curVedio && curVedio.attributes.id
  vedioCol = deleteVedioOrSectorById(vedioCol, id)
  sectorCol = deleteVedioOrSectorById(sectorCol, id)
  curVedio = changeFeatureAttrPosition(curVedio, coods)
  curSector = changeFeatureAttrPosition(curSector, coods)
  curVedio && vedioCol.push(curVedio)
  curSector && sectorCol.push(curSector)
  return {
    vediolist: vedioCol,
    sectorlist: sectorCol,
    currentVedio: curVedio,
    currentSector: curSector
  }
}
/**
 * 添加视频点位和可视域
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} param
 */
function addFeatureToStorage(obj) {
  let {
    vedioList,
    param
  } = obj
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let feature = addVedioIpc(param)
  vedioCol.push(feature)
  return vedioCol
}
/**
 * 加载楼层中所有的点位
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} array
 */
function addFloorFeature(obj) {
  let {
    vedioList,
    sectorList,
    array
  } = obj
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let sectorCol = JSON.parse(JSON.stringify(sectorList))
  if (array.length > 0) {
    array.forEach(element => {
      if (!element.mapsign) {
        let param = JSON.parse(JSON.stringify(element.point))
        param.monitortype = element.monitortype
        param._id = element._id
        let vedio = addSaveVedioIpc(param)
        let sector = addSaveVedioSector(param)
        vedioCol.push(vedio)
        sectorCol.push(sector)
      }
    })
  }
  return {
    vediolist: vedioCol,
    sectorlist: sectorCol
  }
}
/**
 * 点位勾选
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} checkList
 */
function checkVedioByType(obj) {
  let {
    vedioList,
    sectorList,
    checkList
  } = obj
  let vedioCol = JSON.parse(JSON.stringify(vedioList))
  let sectorCol = JSON.parse(JSON.stringify(sectorList))
  let vedioFeatures = [] // 编辑模式视频点位数组
  let sectorFeatures = [] // 编辑模式视频点位可视域数组
  // 如果类型只是可视区域
  if ((checkList.length === 1) && (checkList[0] === 'sector')) {
    vedioFeatures = [] // 视频点位数组设置为空数组
    sectorFeatures = [] // 可视区域数组设置为空数组
  } else {
    vedioCol.forEach((feature, index, arr) => {
      let has = checkVedioOrSector(feature, checkList)
      if (has) {
        vedioFeatures.push(feature)
      }
    })
    if (checkList.indexOf('sector') > -1) {
      sectorCol.forEach((feature, index, arr) => {
        let has = checkVedioOrSector(feature, checkList)
        if (has) {
          sectorFeatures.push(feature)
        }
      })
    } else {
      sectorFeatures = []
    }
  }
  return {
    vediolist: vedioFeatures,
    sectorlist: sectorFeatures
  }
}

function checkVedioFeatureTypeIsExistInTypes(feature, types) {
  let flag = false
  const deviceType = ipcUtil.getVedioTypeByIpcKey(feature.attributes.monitorType)
  for (let type of types) {
    if (deviceType === type) {
      flag = true
      break
    }
  }
  return flag
}
/**
 * 在已知要素类数组中获取指定类型的要素,胡红勋添加
 */
function getVedioPointFeaturesByTypes(features, types) {
  let vedioFeatures = []
  features.forEach((feature, index, arr) => {
    let isExist = checkVedioFeatureTypeIsExistInTypes(feature, types)
    if (isExist) {
      vedioFeatures.push(feature)
    }
  })
  return vedioFeatures
}
/**
 * 根据勾选状况判断视频点位或可视域是否在显示
 * @param {*} feature
 * @param {*} checkList
 */
function checkVedioOrSector(feature, types) {
  let flag = false
  for (let type of types) {
    if (feature.attributes.type === type) {
      flag = true
      break
    }
  }
  return flag
}
/**
 * 编辑模式点击事件
 * @param {*} obj
 * @param {*} callback
 */
function vedioClickEvt(obj, callback) {
  let feature = obj && obj.feature
  let type = obj && obj.type
  if (feature) {
    let attr = obj.attributes
    if (!attr) {
      return
    }
    if (attr.type && (attr.type.indexOf('ipc') > -1) && type === 'Point') {
      if (attr.type && attr.type.indexOf('ipc') > -1) {
        let id = attr.id
        if (attr.state === 'save') {
          callback.changeState(id)
          callback.editFeature(feature)
        }
      }
    }
  }
}
export default {
  updateVedioState,
  addPointDataToFeatures,
  convertPointDataToFeatures,
  getVedioPointFeaturesByTypes,
  addVedioIpc,
  addSector,
  addAllStorageVedio,
  addAllStorageSector,
  editVedioIpc,
  editSector,
  getFeatureById,
  addSaveVedioIpc,
  addSaveVedioSector,
  getVedioOrSectorByType,
  deleteVedioOrSectorById,
  deleteVedioOrSector,
  isExistInMap,
  changeVedioOrSectorState,
  changeFeatureAttrPosition,
  // 业务
  saveVedioAndSector,
  deleteVedioAndSector,
  editSectorRadiusOrAngle,
  editVedioAngle,
  addStorageFeature,
  changeStateById,
  modifyPositionEnd,
  addFeatureToStorage,
  addFloorFeature,
  checkVedioByType,
  vedioClickEvt
}
