import {
  GeometryType
} from '../GeometryType.js'
import STATE from './state.js'
import ipcUtil from './ipcUtil.js'
const TYPE = 'patrol'
/**
 * 加载单个巡更点位
 * @param {*} param
 */
function addPatrolIpc(param) {
  let {
    coods,
    id,
    mapid
  } = param
  let symbol = ipcUtil.getPatrolSymbolByState(STATE.SAVE)
  let feature = {
    geom: {
      type: GeometryType.POINT,
      points: coods
    },
    attributes: {
      id,
      mapid,
      type: TYPE,
      loc: coods,
      state: STATE.SAVE
    },
    symbol
  }
  return feature
}
/**
 * 根据id删除巡更点位
 * @param {*} features
 * @param {*} id
 */
function deletePatrolById(features, id) {
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
 * 根据id获取巡更点位
 * @param {*} features
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
 * 改变巡更点位中有关位置信息的属性
 * @param {*} feature
 * @param {*} coods
 */
function changeFeatureAttrPosition(feature, coods) {
  if (feature) {
    feature.attributes.lon = coods[0]
    feature.attributes.lat = coods[1]
    feature.geom.points = coods
  } else {
    feature = null
  }
  return feature
}

/**
 * 改变巡更点位的状态以及图标
 * @param {*} currentFeature
 * @param {*} state
 */
function changePatrolState(currentFeature, state) {
  let feature = null
  if (currentFeature) {
    currentFeature.attributes.state = state
    let newSymbol = ipcUtil.getPatrolSymbolByState(state)
    newSymbol = JSON.parse(JSON.stringify(newSymbol))
    feature = {
      geom: currentFeature.geom,
      attributes: currentFeature.attributes,
      symbol: newSymbol
    }
  }
  return feature
}
/**
 * 根据属性名寻找对象
 * @param {*} features
 * @param {*} id
 */
function getFeatureByattr(features, attr, value) {
  let feature = null
  if (value) {
    if (features.length > 0) {
      features.forEach((fea) => {
        if (fea.attributes[attr] === value) {
          feature = fea
          return feature
        }
      })
      return feature
    }
  }
}
// 业务
/**
 * 加载所有的巡更点位
 * @param {*} array
 */
function addAllStrogePatrol(patrollist, array, isOuter) {
  let patrols = JSON.parse(JSON.stringify(patrollist))
  if (isOuter) {
    // 加载楼层外
    array.grid.forEach(element => {
      let patro = getFeatureByattr(patrols, 'id', element._id)
      if (!patro) {
        let feature = addPatrolIpc({
          coods: element.point ? element.point.geo : element.point3D.geo,
          id: element._id,
          mapid: element.point ? element.point.mapid : element.point3D.mapid
        })
        patrols.push(feature)
      }
    })
  } else {
    // 加载楼层中
    array.forEach(element => {
      let patro = getFeatureByattr(patrols, 'id', element._id)
      if (!patro) {
        let feature = addPatrolIpc({
          coods: element.point ? element.point.geo : element.point3D.geo,
          id: element._id,
          mapid: element.point.mapid
        })
        feature.attributes.bid = element.point.bid
        feature.attributes.sid = element.point.sid
        patrols.push(feature)
      }
    })
  }
  return patrols
}
/**
 * 加载已经入库的巡更点位
 * @param {*} obj
 */
function addPatrolToStorage(obj) {
  let {
    patrolList,
    param
  } = obj
  let patrolCol = JSON.parse(JSON.stringify(patrolList))
  let feature = getFeatureById(patrolCol, param.id)
  if (!feature) {
    let feature = addPatrolIpc(param)
    patrolCol.push(feature)
  }
  return patrolCol
}
/**
 * 加载楼层中的巡更点位
 * @param {*} obj
 */
function addFloorFeature(patrolist, array) {
  let patrolCol = JSON.parse(JSON.stringify(patrolist))
  array.forEach(element => {
    let param = {
      coods: element.point ? element.point.geo : element.point3D.geo,
      id: element._id,
      mapid: element.point ? element.point.mapid : element.point3D.mapid
    }
    patrolCol = addPatrolToStorage({
      patrolList: patrolCol,
      param
    })
  })
  return patrolCol
}

function convertPatrolPointsToFeatures(datas) {
  let features = []
  datas.forEach((data, index) => {
    let symbol = ipcUtil.getPatrolSymbolByState(STATE.SAVE)
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: data.point ? data.point.geo : data.point3D.geo
      },
      attributes: {
        id: data._id,
        type: TYPE,
        loc: data.point ? data.point.geo : data.point3D.geo,
        state: STATE.SAVE
      },
      symbol
    }
    features.push(feature)
  })
  return features
}
/**
 * 巡更点位编辑位置结束后的事件
 * @param {*} obj
 */
function modifyPositionEnd(obj) {
  let {
    currentPatrol,
    patrolList,
    coods
  } = obj
  let curPatrol = JSON.parse(JSON.stringify(currentPatrol))
  let patrolCol = JSON.parse(JSON.stringify(patrolList))
  let id = curPatrol && curPatrol.attributes.id
  patrolCol = deletePatrolById(patrolCol, id)
  curPatrol = changeFeatureAttrPosition(curPatrol, coods)
  curPatrol && patrolCol.push(curPatrol)
  return {
    patrollist: patrolCol,
    currentPatrol: curPatrol
  }
}
/**
 * 巡更点位点击事件 save->edit
 * @param {*} obj
 * @param {*} callback
 */
function patrolClickEvt(obj, callback) {
  let feature = obj && obj.feature
  if (feature) {
    let attr = obj.attributes
    if (!attr) {
      return
    }
    if (attr.type && (attr.type.indexOf('patrol') > -1)) {
      let id = attr.id
      if (attr.state === 'save') {
        callback.changeState(id)
        callback.editFeature(feature)
      }
    }
  }
}
/**
 * 根据id改变巡更点位的状态
 * @param {*} obj
 */
function changeStateById(obj) {
  let {
    currentPatrol,
    patrolList,
    id,
    state
  } = obj
  let curPatrol = JSON.parse(JSON.stringify(currentPatrol))
  let patrolCol = JSON.parse(JSON.stringify(patrolList))
  patrolCol = deletePatrolById(patrolCol, id) // 根据id删除巡更点数组中对应的元素
  curPatrol = changePatrolState(curPatrol, state) // 修改当前巡更点位的样式
  curPatrol && patrolCol.push(curPatrol)
  return {
    patrollist: patrolCol,
    currentPatrol: curPatrol
  }
}
/**
 * 保存巡更点位
 * 保存、取消按钮
 * 将edit->save
 * @param {*} obj
 */
function savePatrol(obj) {
  let {
    patrolList,
    id
  } = obj
  if (!id) {
    return patrolList
  }
  let patrolCol = JSON.parse(JSON.stringify(patrolList))
  let currentPatrol = getFeatureById(patrolCol, id)
  patrolCol = deletePatrolById(patrolCol, id)
  let patrol = changePatrolState(currentPatrol, STATE.SAVE)
  patrol && patrolCol.push(patrol)
  return patrolCol
}
/**
 * 删除巡更点位
 * @param {*} obj
 */
function deletePatrol(obj) {
  let {
    patrolList,
    id
  } = obj
  let patrolCol = JSON.parse(JSON.stringify(patrolList))
  patrolCol = deletePatrolById(patrolCol, id)
  return patrolCol
}

export default {
  convertPatrolPointsToFeatures,
  changeStateById,
  getFeatureById,
  addFloorFeature,
  // 业务
  addPatrolToStorage,
  addAllStrogePatrol,
  modifyPositionEnd,
  patrolClickEvt,
  savePatrol,
  deletePatrol
}
