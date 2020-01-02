import {
  GeometryType
} from './GeometryType.js'
import STATE from './state.js'
import mapUtil from './mapUtil.js'

/**
 * 根据id删除巡更点位
 * @param {*} features
 * @param {*} id
 */
function _deletePatrolById(features, id) {
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
function _getFeatureById(features, id) {
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
 * 改变巡更点位状态以及图标
 * @param {*} currentFeature
 * @param {*} state
 */
function changePatrolState(currentFeature, state) {
  let feature = null
  if (currentFeature) {
    currentFeature.attributes.state = state
    let newSymbol = mapUtil.getPatrolSymbolByState(state)
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
function _getFeatureByattr(features, attr, value) {
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

// 将巡更点位要素转化为要素数组----
function convertPatrolPointsToFeatures(datas, mapMode) {
  let features = []
  datas.forEach((data, index) => {
    if (data[mapMode] && data[mapMode].geo) {
      let symbol = mapUtil.getPatrolSymbolByState(STATE.SAVE)
      let feature = {
        geom: {
          type: GeometryType.POINT,
          points: data[mapMode].geo
        },
        attributes: {
          id: data._id,
          type: data.device,
          state: STATE.SAVE
        },
        symbol
      }
      features.push(feature)
    }
  })
  return features
}

export default {
  convertPatrolPointsToFeatures,
  changePatrolState,
  _deletePatrolById,
  _getFeatureById,
  _getFeatureByattr
}
