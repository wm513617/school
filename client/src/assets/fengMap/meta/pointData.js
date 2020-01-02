// import { RESICONOID } from 'assets/2DMap/meta/common'
// fengMap 参数
// const resourceType = [RESICONOID.boltipc, RESICONOID.redBoltipc, RESICONOID.halfBallipc, RESICONOID.fastBallipc, RESICONOID.allViewipc, RESICONOID.verfaceipc, RESICONOID.trafficipc, RESICONOID.doorControl, RESICONOID.commonAlarm]
const markerTypes = {
  marker: 'marker',
  label: 'label',
  sector: 'sector'
}
/**
 * pointMarkers
 * 点位marker存储
 * marker类型 'marker' 'label' 'sector'
 * 资源类型 对应 resourceType数组中的元素
 * 例 label00: [{renderNode.id: channelId},...]
 */
const pointMarkers = {}

/**
 * pointLayers 图层存储
 * sceneId 对应 点击的marker的parent._scene.id
 * type 是指设备资源的类型 对应 markerType数组中的元素
 * markerType 是指fengMap对应 的 marker类型
 * 例 sceneId: { type: '00', markerType: 'marker'}
 */
const pointLayers = {}

/**
 * 添加点位
 * @param {*} type 资源类型
 * @param {*} markerType marker类型
 * @param {*} item {id: markerId, channelId}
 */
function addPoint(markerType, type, item) {
  const markerKey = pointMarkers[markerType + type]
  if (markerKey) {
    pointMarkers[markerType + type].push(item)
  } else {
    pointMarkers[markerType + type] = [item]
  }
}

/**
 *
 *
 * @param {*} sceneId 对应添加的layer的scene.id
 * @param {*} typeObj { type: '00', markerType: 'marker'}
 * @param {*} item
 */
function addLayer(sceneId, typeObj) {
  pointLayers[sceneId] = typeObj
}

/**
 * 获取资源类型
 * @param {*} sceneId layer的scene.id
 * @returns 'marker00'
 */
function getPointType(sceneId) {
  // type资源类型, marker类型 { type: '00', markerType: 'marker'}
  return pointLayers[sceneId]
}

/**
 * 获取资源ID
 * @param {*} sceneId layer的 _scene.id
 * @param {*} id markerId
 * @returns channel 资源Id, type 资源类型
 */
function getPointById(sceneId, id) {
  let item
  let typeObj = pointLayers[sceneId]
  if (!typeObj) {
    console.log(sceneId, id)
    return
  }
  let arr = pointMarkers[typeObj.markerType + typeObj.type]
  for (let j = 0; j < arr.length; j++) {
    if (arr[j].id === id) {
      item = arr[j]
      break
    }
  }
  return {
    channelId: item.channelId,
    type: typeObj.type
  }
}

/**
 * 获取markerId
 * 删除marker用
 * @param {*} markerType marker类型
 * @param {*} type 资源类型
 * @param {*} id channelId
 * @returns markerId 资源Id
 */
function getMarkerById(markerType, type, channelId) {
  let item
  const arr = pointMarkers[markerType + type]
  if (!arr) { return }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].channelId === channelId) {
      item = arr[i]
      break
    }
  }
  return item && item.id
}

/**
 * 删除点位(pointMarkers)
 * @param {*} type 资源类型
 * @param {*} id MarkerId
 */
function deletePointById(type, id) {
  for (let j = 0; j < markerTypes.length; j++) {
    const arr = pointMarkers[markerTypes[j] + type]
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          arr.splice(i, 1)
        }
      }
    }
  }
}

export {
  addPoint,
  addLayer,
  getPointById,
  deletePointById,
  pointMarkers,
  getPointType,
  getMarkerById,
  markerTypes
}
