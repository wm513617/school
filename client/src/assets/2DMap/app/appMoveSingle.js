import {
  GeometryType
} from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig'
import STATE from '../edit/state.js'
import spaceAnalysisUtil from '../spaceAnalysisUtil'
/**
 * 添加移动单兵点位
 * @param {*} singlelist
 * @param {*} array
 */
function addMoveSingleIpc(singlelist, array, currentMapExtent) {
  let singleCol = JSON.parse(JSON.stringify(singlelist))
  let extent = currentMapExtent.toString()
  array.forEach(element => {
    let feature = getFeatureById(singleCol, element.userId)
    if (!feature) {
      if (element.geo) {
        let arrExtent = extent.split(',')
        let array = [arrExtent[0], arrExtent[1], arrExtent[2], arrExtent[1], arrExtent[2], arrExtent[3], arrExtent[0], arrExtent[3], arrExtent[0], arrExtent[1]]
        let point = [element.geo.lon, element.geo.lat]
        let isExist = spaceAnalysisUtil.isContainerPoint(array.toString(), point)
        if (isExist) {
          feature = {
            geom: {
              type: GeometryType.POINT,
              points: point
            },
            attributes: {
              id: element.userId,
              type: 'moveSingle',
              loc: element.geo.lon + ',' + element.geo.lat,
              state: STATE.SAVE,
              param: element
            },
            symbol: SymbolConfig.singleSymbol
          }
          singleCol.push(feature)
        }
      }
    }
  })
  return singleCol
}
/**
 * 推送过来的单兵位置发生变化
 * @param {*} singlelist
 * @param {*} id
 */
function changeSinglePositionById(singlelist, option) {
  let singleCol = JSON.parse(JSON.stringify(singlelist))
  let param = JSON.parse(JSON.stringify(option))
  if (param) {
    let userId = param.user && param.user._id
    if (userId) {
      let single = getFeatureById(singleCol, userId)
      let loc = param.geo.lon + ',' + param.geo.lat
      if (single) {
        singleCol = deleteSingleById(singleCol, userId)
      }
      let newSingle = {
        geom: {
          type: GeometryType.POINT,
          points: loc
        },
        attributes: {
          id: param.user._id,
          type: 'moveSingle',
          loc: loc,
          state: STATE.SAVE,
          param
        },
        symbol: SymbolConfig.singleSymbol
      }
      singleCol.push(newSingle)
    }
  }
  return singleCol
}
/**
 * 根据id删除移动单兵点位
 * @param {*} features
 * @param {*} id
 */
function deleteSingleById(features, id) {
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
 * 删除正在报警的点位，加载在线状态的点位
 * @param {*} singlelist // 当前地图上所有的巡更点位
 * @param {*} singles // 数据库中所有的巡更点位
 * @param {*} id
 * @param {*} state
 */
function deleteOrChangeStateById(singlelist, singles, id, state) {
  let singleCol = JSON.parse(JSON.stringify(singlelist))
  let singlesInMap = JSON.parse(JSON.stringify(singles))
  let single = getFeatureById(singlesInMap, id)
  singleCol = deleteSingleById(singleCol, id)
  let newSingle = {}
  if (single) {
    newSingle = {
      geom: single.geom,
      attributes: single.attributes,
      symbol: SymbolConfig.singleSymbol
    }
    newSingle.attributes.state = state
    singleCol.push(newSingle)
  }
  return {
    singleList: singleCol,
    single: newSingle
  }
}
export default {
  deleteSingleById,
  getFeatureById,
  addMoveSingleIpc,
  changeSinglePositionById,
  deleteOrChangeStateById
}
