/**
 * 胡红勋 2017-7-18
 */
import {
  GeometryType
} from '../GeometryType.js'
import
SymbolConfig
  from '../SymbolConfig.js'
import moment from 'moment'

function drawTrack(obj, type = 'car') {
  let trackFeatures = []
  let lineCoods = []
  let trackPoints = []
  let current = obj.current
  let newSymbol = null
  if (type === 'people') {
    newSymbol = JSON.parse(JSON.stringify(SymbolConfig.peopleTrackSymbol))
  } else {
    newSymbol = JSON.parse(JSON.stringify(SymbolConfig.carSymbol))
  }
  if (current.point) {
    let _id = current.point._id
    let time = moment.unix(Number(current.timeStamp)).format('YYYY-MM-DD HH:mm:ss')
    let tracks = obj.list
    for (let index in tracks) {
      let track = tracks[index]
      let roadName = track.crossName
      let trackPoint = track.point
      let id = trackPoint._id
      let point = getFeatureById(trackFeatures, id)
      newSymbol.textStyle.label = time
      if (!point) {
        point = {
          geom: {
            type: GeometryType.POINT,
            points: trackPoint.loc
          },
          attributes: {
            track,
            roadName,
            trackPoint,
            time,
            id
          },
          symbol: newSymbol
        }
        trackFeatures.push(point)
        trackPoints.push(point)
        lineCoods.push(trackPoint.loc)
      }
    }
    if (lineCoods.length > 1) {
      let line = {
        geom: {
          type: GeometryType.POLYLINE,
          points: lineCoods.toString()
        },
        attributes: {
          id: _id
        },
        symbol: SymbolConfig.carTrackSymbol
      }
      trackFeatures.push(line)
    }
  }
  return {
    features: trackFeatures,
    points: trackPoints
  }
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
 * 人员轨迹
 * @param {*} obj
 */
function drawPeopleTrack(obj) {
  let trackFeatures = []
  let lineCoods = []
  let trackPoints = []
  let array = obj.trajectory
  let lineId = array[0]._id
  let newSymbol = JSON.parse(JSON.stringify(SymbolConfig.peopleTrackSymbol))
  array.forEach(element => {
    let feature = getFeatureById(trackFeatures, element._id)
    newSymbol.textStyle.label = element.snapshotTime
    if (!feature) {
      feature = {
        geom: {
          type: GeometryType.POINT,
          points: element.resource.point.loc
        },
        attributes: {
          resourcePoint: element.resourcePoint,
          snapshotTime: element.snapshotTime,
          id: element.resource.point._id,
          loc: element.resource.point.loc
        },
        symbol: newSymbol
      }
      trackFeatures.push(feature)
      trackPoints.push(feature)
      lineCoods.push(element.resource.point.loc)
    }
  })
  if (lineCoods.length > 1) {
    let line = {
      geom: {
        type: GeometryType.POLYLINE,
        points: lineCoods.toString()
      },
      attributes: {
        id: lineId
      },
      symbol: SymbolConfig.peopleLineSymbol
    }
    trackFeatures.push(line)
  }
  return {
    features: trackFeatures,
    points: trackPoints
  }
}
/**
 * 车辆轨迹
 * @param {*} obj
 */
function drawCarTrack(obj) {
  let trackFeatures = []
  let lineCoods = []
  let trackPoints = []
  let tracks = obj.current.list
  let lineId = tracks[0].date
  let newSymbol = JSON.parse(JSON.stringify(SymbolConfig.carSymbol))
  tracks.forEach(element => {
    let time = moment.unix(Number(element.timeStamp)).format('YYYY-MM-DD HH:mm:ss')
    let roadName = element.crossName
    let trackPoint = element.point
    let id = trackPoint._id
    let point = getFeatureById(trackFeatures, id)
    newSymbol.textStyle.label = time
    if (!point) {
      point = {
        geom: {
          type: GeometryType.POINT,
          points: trackPoint.loc
        },
        attributes: {
          crossName: roadName,
          time,
          id
        },
        symbol: newSymbol
      }
      trackFeatures.push(point)
      trackPoints.push(point)
      lineCoods.push(trackPoint.loc)
    }
  })
  if (lineCoods.length > 1) {
    let line = {
      geom: {
        type: GeometryType.POLYLINE,
        points: lineCoods.toString()
      },
      attributes: {
        id: lineId
      },
      symbol: SymbolConfig.carTrackSymbol
    }
    trackFeatures.push(line)
  }
  return {
    features: trackFeatures,
    points: trackPoints
  }
}
export default {
  drawTrack,
  drawCarTrack,
  drawPeopleTrack,
  getFeatureById
}
