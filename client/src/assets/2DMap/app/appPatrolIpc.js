import {
  GeometryType
} from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig'
import STATE from '../edit/state.js'
import ipcUtil from '../edit/ipcUtil.js'
// import paData from '../../../store/modules/map/patrol/paData'
import {
  generateID
} from '../MapUtil.js'

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
    symbol: SymbolConfig.patrolAppSymbol
  }
  return feature
}
// 将巡更点位数据转换为地图要素--胡红勋添加
function convertPatrolPointToFeature(datas) {
  let patrols = []
  datas.forEach(data => {
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: data.point ? data.point.geo : data.point3D.geo
      },
      attributes: {
        id: data._id,
        type: data.device,
        state: STATE.SAVE
      },
      symbol: SymbolConfig.patrolAppSymbol
    }
    feature.attributes.bid = data.point ? data.point.bid : data.point3D.bid
    feature.attributes.sid = data.point ? data.point.sid : data.point3D.sid
    patrols.push(feature)
  })
  return patrols
}
/**
 * 加载所有的巡更点位
 * @param {*} array
 */
function addStrogePatrolIpc(patrollist, array, isOuter) {
  let patrols = JSON.parse(JSON.stringify(patrollist))
  if (isOuter) {
    // 加载楼层外
    array.grid.forEach(element => {
      let patro = getFeatureByattr(patrols, 'id', element._id)
      if (!patro) {
        let feature = addPatrolIpc({
          coods: element.point.geo ? element.point.geo : element.point3d.geo,
          id: element._id,
          mapid: element.point.mapid ? element.point.mapid : element.point3d.mapid
        })
        patrols.push(feature)
      }
    })
    // 加载楼层中的汇聚
    array.building.forEach(element => {
      let patro = getFeatureByattr(patrols, 'bid', element.bid)
      if (!patro) {
        let feature = addFloorConverPatrol({
          bid: element.bid,
          binfo: element.binfo,
          store: element.store
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
          coods: element.point.geo ? element.point.geo : element.point3d.geo,
          id: element._id,
          mapid: element.point.mapid
        })
        feature.attributes.bid = element.point.bid ? element.point.bid : element.point3D.bid
        feature.attributes.sid = element.point.sid ? element.point.sid : element.point3D.sid
        patrols.push(feature)
      }
    })
  }
  return patrols
}

function addFloorConverPatrol(param) {
  let {
    bid,
    binfo,
    store
  } = param
  let feature = {
    geom: {
      type: GeometryType.POINT,
      points: binfo.center
    },
    attributes: {
      id: bid,
      bid,
      binfo,
      type: 'patrolConver',
      state: STATE.SAVE,
      store
    },
    symbol: SymbolConfig.patrolFloorSymbol
  }
  return feature
}

/**
 * 将巡更的点连成一条线
 * @param {*} array
 */
function connectPatrolIpc(patrollist, paData) {
  // function connectPatrolIpc(patrollist) {
  let patrols = JSON.parse(JSON.stringify(patrollist))
  let array = paData.points
  let loc = ''
  let lineArray = []
  array.forEach((element, index) => {
    if (element.geo) {
      if (index === array.length - 1) {
        loc = loc + element.geo
      } else {
        loc = loc + element.geo + ','
      }
      let pointSymbol = ipcUtil.getPatrolSymbolByStatusInApp(element.status)
      let point = {
        geom: {
          points: element.geo,
          type: GeometryType.POINT
        },
        attributes: {
          id: element.pointId,
          name: element.pointName,
          status: element.status,
          lineid: paData._id
        },
        symbol: pointSymbol
      }
      patrols.push(point)
      let lonlat = element.geo.split(',')
      let pointloc = [parseFloat(lonlat[0]), parseFloat(lonlat[1])]
      lineArray.push(pointloc)
    }
  })
  loc = loc.substring(0, loc.length - 1)
  let pointLength = loc.split(',').length
  if (pointLength > 2) {
    patrols = addArrowIcon(patrols, lineArray, paData._id)
    let feature = {
      geom: {
        points: loc,
        type: GeometryType.POLYLINE
      },
      attributes: {
        id: paData._id
      },
      symbol: SymbolConfig.patrolLineSymbol
    }
    patrols.push(feature)
  }
  return patrols
}
/**
 * 加载巡更点位连线时加箭头
 * @param {*} patrols
 * @param {*} lineArray
 */
function addArrowIcon(patrols, lineArray, lineid) {
  for (let i = 0; i < lineArray.length - 1; i++) {
    let arrowid = generateID()
    let dx = lineArray[i + 1][0] - lineArray[i][0]
    let dy = lineArray[i + 1][1] - lineArray[i][1]
    let rotation = Math.atan2(dy, dx)
    let newsymbol = JSON.parse(JSON.stringify(SymbolConfig.arrowSymbol))
    // newsymbol.iconStyle.rotation = parseFloat((-rotation).toFixed(2))
    newsymbol.iconStyle.rotation = (rotation) * 180 / Math.PI
    let arrow = {
      geom: {
        points: lineArray[i + 1],
        type: GeometryType.POINT
      },
      attributes: {
        id: arrowid,
        loc: lineArray[i + 1][0] + ',' + lineArray[i + 1][1],
        lineid
      },
      symbol: newsymbol
    }
    patrols.push(arrow)
  }
  // let arrowid = generateID()
  // let length = lineArray.length
  // let dx = lineArray[length - 1][0] - lineArray[length - 2][0]
  // let dy = lineArray[length - 1][1] - lineArray[length - 2][1]
  // let rotation = Math.atan2(dy, dx)
  // let newsymbol = JSON.parse(JSON.stringify(SymbolConfig.arrowSymbol))
  // newsymbol.iconStyle.rotation = rotation * 180 / Math.PI
  // let arrow = {
  //   geom: {
  //     points: lineArray[length - 1],
  //     type: GeometryType.POINT
  //   },
  //   attributes: {
  //     id: arrowid,
  //     loc: lineArray[length - 1][0] + ',' + lineArray[length - 1][1],
  //     lineid
  //   },
  //   symbol: newsymbol
  // }
  // patrols.push(arrow)
  return patrols
}

// 删除数组中元素属性id等于id的元素------
function deleteElementById(array, id) {
  array.forEach((element, index) => {
    if (element.id === id) {
      array.splice(index, 1)
    }
  })
  return array
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
/**
 * 删除正在报警的点位，加载在线状态的点位
 * @param {*} patrollist // 当前地图上所有的巡更点位
 * @param {*} patrols // 数据库中所有的巡更点位
 * @param {*} id
 * @param {*} state
 */
function deleteOrChangeStateById(patrollist, patrols, id, state) {
  let patrolCol = JSON.parse(JSON.stringify(patrollist))
  let patrolsInMap = JSON.parse(JSON.stringify(patrols))
  let patrol = getFeatureById(patrolsInMap, id)
  patrolCol = deleteAlarmById(patrolCol, id)
  let type = patrol.geom.type
  let symbol = SymbolConfig.patrolAppSymbol
  if (type === 'patrolConver') {
    symbol = SymbolConfig.patrolFloorSymbol
  }
  let newPatrol = {
    geom: patrol.geom,
    attributes: patrol.attributes,
    symbol
  }
  newPatrol.attributes.state = state
  patrolCol.push(newPatrol)
  return {
    patrolList: patrolCol,
    patrol: newPatrol
  }
}
/**
 * 通过id找出数组中相同id的元素
 * @param {*} features 数组 移动单兵
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
 * 根据id删除巡更点位要素数组------
 * @param {*} features
 * @param {*} id
 */
function deleteAlarmById(features, id) {
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
export default {
  convertPatrolPointToFeature,
  getFeatureById,
  deleteAlarmById,
  addStrogePatrolIpc,
  connectPatrolIpc,
  deleteElementById,
  getFeatureByattr,
  deleteOrChangeStateById
}
