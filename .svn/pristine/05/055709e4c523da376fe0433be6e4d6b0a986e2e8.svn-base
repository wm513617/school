/**
 * 地图应用模式---工具类方法---胡红勋-2017-7-12
 */
import
gridmanager
  from './appGrid.js'
import
buildmanager
  from './appBuild.js'
import {
  getGeom
} from '../GeometryUtil/GeometryUtil.js'
import {
  GeometryType
} from '../GeometryType.js'

function initResource() {
  gridmanager.clearLayerResource()
  buildmanager.clearLayerResource()
}

function getExtentByCoods(coods) {
  let geom = getGeom({
    type: GeometryType.POLYGON,
    points: coods
  })
  let bounds = geom.getBounds()
  return bounds
}
export default {
  initResource: initResource,
  getExtentByCoods: getExtentByCoods
}
