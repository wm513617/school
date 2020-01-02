import areaStyle from '../../../src/view/map/style/areaStyle.js'
import {
  GeometryType
} from './GeometryType.js'
import spaceAnalysisUtil from './spaceAnalysisUtil.js'
const jsts = require('jsts')
// 区域加载管理函数 areaArr区域数组 区域样式style 区域类型type
function areaManage(areaArr, style, type) {
  let arr = []
  for (let i = 0; i < areaArr.length; i++) {
    style = JSON.parse(JSON.stringify(style))
    if (areaArr[i].style) {
      style = convertStyleToSymbol(style, areaArr[i].style)
    }
    style.textStyle.label = type.label + ':' + areaArr[i].name
    arr.push({
      geom: {
        type: GeometryType.MULTIPOLYGON,
        points: areaArr[i].loc
      },
      symbol: style,
      attributes: {
        id: areaArr[i]._id,
        type: type.value
      }
    })
  }
  return arr
}
// 位置转为字符串
function locSwitch(val, areaVal) {
  let loc = val.coods[0][0].toString()
  let locVal = JSON.parse(JSON.stringify(areaVal))
  if (locVal) {
    locVal = locVal + '|' + loc
  } else {
    locVal = loc
  }
  return locVal
}
// 组成多个多边形的左边参数
function consistMuPolyCoods(coods) {
  let val = ''
  if (coods.length > 1) {
    for (let i = 0; i < coods.length; i++) {
      if (val) {
        val = coods[i][0].toString() + '|' + val
      } else {
        val = coods[i][0].toString()
      }
    }
  } else {
    val = coods[0].toString()
  }
  return val
}
// 组成参数
function consistParam(obj) {
  let {
    id,
    loc,
    gridFeatures,
    buildFeatures,
    page,
    pageState
  } = obj
  let featureArr = null
  if (page === 'gridEditPage') {
    featureArr = gridFeatures
  } else if (page === 'buildEditPage') {
    featureArr = buildFeatures
  } else {
    return
  }
  let param = {
    loc,
    id: id,
    featureArr,
    page,
    pageModel: pageState
  }
  return param
}
// 校验区域的相交情况
function checkInterArea(obj) {
  let {
    loc,
    id,
    featureArr
  } = obj
  let newArr = []
  let newfeatureArr = newArr.concat(featureArr)
  if (id) {
    if (newfeatureArr.length > 0) {
      newfeatureArr.forEach((element, index) => {
        if (element.attributes.id === id) {
          newfeatureArr.splice(index, 1)
        }
      })
    } else {
      newfeatureArr = []
    }
  }
  let isSelfIn = isSelfInterMultiPolygon(loc)
  let isIn = isInterMultiPolygon(loc)
  let isInter = isInterBetweenMultiPolygon(loc, newfeatureArr)
  return {
    isSelfIn,
    isIn,
    isInter
  }
}
// 绘制网格或楼宇的参数
function initAreaValByPage(obj) {
  let {
    page,
    val
  } = obj
  let id = null
  let gridStyle = null
  let layerStyle = null
  let actived = val
  if (page === 'gridEditPage') {
    id = page
    gridStyle = areaStyle.gridDraw
    layerStyle = areaStyle.gridDrawEnd
  } else
  if (page === 'buildEditPage') {
    id = page
    gridStyle = areaStyle.buildDraw
    layerStyle = areaStyle.buildDrawEnd
  } else {
    id = ''
    gridStyle = null
    layerStyle = null
    actived = !val
  }
  let param = {
    id,
    gridStyle,
    layerStyle,
    actived
  }
  return param
}
// 添加/编辑楼宇时判断楼宇是否在当前网格内
function isContainerInGrid(buildLoc, gridLoc) {
  let isContainer = isContainerInPolygons(gridLoc, buildLoc)
  return isContainer
}

/**
 * 单个多边形的自相交判断
 * @param {*} feature
 */
function isSelfIntersects(points) {
  let pointArr = null
  if (!spaceAnalysisUtil.isArray(points)) {
    pointArr = points.split(',')
  }
  let paths = []
  let isInterset = false
  let arrLen = pointArr.length
  let tmpArr = []
  for (let i = 0; i < arrLen; i += 2) {
    tmpArr.push([parseFloat(pointArr[i]), parseFloat(pointArr[i + 1])])
  }
  for (let i = 0; i < tmpArr.length - 1; i++) {
    let path = tmpArr[i][0] + ',' + tmpArr[i][1] + ',' + tmpArr[i + 1][0] + ',' + tmpArr[i + 1][1]
    paths.push(path)
  }
  for (let j = 0; j < paths.length; j++) {
    for (let k = 2; k < paths.length - 1; k++) {
      let n = j + k
      if (n >= paths.length) {
        n = n % paths.length
      }
      isInterset = spaceAnalysisUtil.isInterPath(paths[j], paths[n])
      if (isInterset) {
        return isInterset
      } else {
        continue
      }
    }
    if (isInterset) {
      return isInterset
    } else {
      continue
    }
  }
  return isInterset
}
/**
 * 多面的自相交判断
 * @param {*} feature
 */
function isSelfInterMultiPolygon(loc) {
  let isInterset = false
  if (loc) {
    let polygonlist = loc.split('|')
    if (polygonlist.length > 0) {
      for (let i = 0; i < polygonlist.length; i++) {
        isInterset = isSelfIntersects(polygonlist[i])
        if (isInterset) {
          return isInterset
        } else {
          continue
        }
      }
    }
  }
  return isInterset
}
/**
 * 判断一个多面中的多个面相交判断
 * @param {*} feature
 * @param {*} featurelist
 */
function isInterMultiPolygon(loc) {
  if (!loc) {
    return
  }
  let multiArr = loc.split('|')
  let isInterset = false
  // 判断一个多面中多边形是否相交
  for (let i = 0; i < multiArr.length; i++) {
    for (let j = i + 1; j < multiArr.length; j++) {
      isInterset = spaceAnalysisUtil.isInterInPolygon(multiArr[i], multiArr[j])
      if (isInterset) {
        return isInterset
      } else {
        continue
      }
    }
  }
  // 判断该多面是否与其他多面相交
  return isInterset
}
/**
 * 与库中的多边形是否相交
 * @param {*} feature
 * @param {*} featurelist
 */
function isInterBetweenMultiPolygon(loc, featurelist) {
  if (!loc) {
    return
  }
  let featurePoly = loc.split('|')
  let isInterset = false
  if (featurelist.length > 0) {
    for (let i = 0; i < featurelist.length; i++) {
      let polygons = featurelist[i].geom.points.split('|')
      for (let j = 0; j < featurePoly.length; j++) {
        isInterset = isInterBetweenPolygon(featurePoly[j], polygons)
        if (isInterset) {
          return isInterset
        }
      }
      if (isInterset) {
        return isInterset
      }
    }
  }
  return isInterset
}
// 判断两个多边形相交
function isInterBetweenPolygon(feature, areas) {
  let isInterset = false
  for (let i = 0; i < areas.length; i++) {
    // 如果该多边形的点与其他多边形相交，则返回true。 否则继续
    isInterset = spaceAnalysisUtil.isInterInPolygon(feature, areas[i])
    if (isInterset) { // 相交
      return isInterset
    } else {
      continue
    }
  }
  return isInterset // 该值如果不为null,表示包含或与在边界上 --- 即就是相交
}
/**
 * 判断多面之间是否包含
 * @param {area} 已添加的多面
 * @param {feature} 新添加的多变
 */
function isContainerInPolygons(area, feature) {
  if (!area || !feature) {
    return
  }
  let areas = area.split('|')
  let features = feature.split('|')
  let isContain = false
  if (features.length > 0) {
    let num = 0
    for (let i = 0; i < features.length; i++) {
      isContain = isContainer(areas, features[i])
      if (!isContain) {
        return isContain
      } else {
        num = num + 1
        continue
      }
    }
    if (num === features.length) {
      return true
    }
  }
  return isContain
}

function isContainer(areas, feature) {
  let coodsArr = _.chunk(feature.split(','), 2)
  let isCon = false
  for (let i = 0; i < areas.length; i++) {
    // 如果此几何体包含指定的坐标，则返回true。 如果坐标位于几何体的边界上，则返回false。
    let num = 0
    for (let j = 0; j < coodsArr.length; j++) {
      isCon = spaceAnalysisUtil.isContainerPoint(areas[i], coodsArr[j])
      if (isCon) { // 不包含
        num = num + 1
        continue
      } else {
        break
      }
    }
    if (num === coodsArr.length) {
      return true
    } else {
      continue
    }
  }
  return isCon // 该值如果不为null,表示包含或与在边界上 --- 即就是相交
}

function changeColorFormat(color) {
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  if (color) {
    let sColor = color.toLowerCase()
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = '#'
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
        }
        sColor = sColorNew
      }
      // 处理六位的颜色值
      let sColorChange = []
      for (let j = 1; j < 7; j += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(j, j + 2)))
      }
      return 'rgb(' + sColorChange.join(',') + ')'
    } else {
      return sColor
    }
  }
}
// 构造颜色值
function transformColor(color, opcity) {
  if (color) {
    let newColor = changeColorFormat(color)
    let hasOpcity = newColor.indexOf('rgba')
    let index = newColor.lastIndexOf(',')
    let num = newColor.indexOf(')')
    let colorStr = null
    if (hasOpcity > -1) {
      colorStr = newColor.substring(0, index + 1)
      colorStr = colorStr + opcity + ')'
    } else {
      colorStr = newColor.substring(3, num)
      colorStr = 'rgba' + colorStr + ',' + opcity + ')'
    }
    return colorStr
  }
}
/**
 * 将设置或从数据库中获取的样式转换为openlayer地图需要的样式格式
 */
function convertStyleToSymbol(symbol, style) {
  let borderStyle = style.borderStyle || style.borderstyle // 边框样式
  let borderWidth = style.borderWidth || style.borderwidth // 边框宽度
  let borderColor = style.borderColor || style.bordercolor // 边框颜色
  let borderTransparency = style.borderTransparency || style.bodertransparency // 边框透明度
  let fillColor = style.fillColor || style.fillcolor // 填充颜色
  let fillColorTransparency = style.fillColorTransparency || style.fillcolortransparency // 填充透明度
  let font = style.font // 字体
  let fontColor = style.fontColor || style.fontcolor // 字体颜色
  let fontSize = style.fontSize || style.fontsize // 字体大小

  let newSymbol = JSON.parse(JSON.stringify(symbol))
  borderColor = changeColorFormat(borderColor)
  borderTransparency = borderTransparency / 100
  borderColor = transformColor(borderColor, borderTransparency)
  fillColor = changeColorFormat(fillColor)
  fillColorTransparency = fillColorTransparency / 100
  fillColor = transformColor(fillColor, fillColorTransparency)
  borderStyle = getBorderStyle(borderStyle)
  if (newSymbol) {
    newSymbol.fillColor = fillColor
    if (newSymbol.strokeStyle) {
      newSymbol.strokeStyle.lineDash = borderStyle
      newSymbol.strokeStyle.outLineColor = borderColor
      newSymbol.strokeStyle.outLineWidth = parseFloat(borderWidth) // 需要数字
    }
    if (newSymbol.textStyle) {
      newSymbol.textStyle.fontFamily = font
      newSymbol.textStyle.fillColor = fontColor
      newSymbol.textStyle.fontSize = parseFloat(fontSize) / 10
    }
  }
  return newSymbol
}

function getBorderStyle(style) {
  let symbol = null
  if (style === 'solid') {
    symbol = [1]
  }
  if (style === 'dashed') {
    symbol = [2, 4]
  }
  if (style === 'dotted') {
    symbol = [4, 6, 4]
  }
  return symbol
}
/**
 * 应用模式楼宇的半开启功能
 * @param {*} buildings
 * @param {*} obj
 */
function findBuildingByExtent(buildings, obj) {
  const reader = new jsts.io.WKTReader()
  const result = {
    flag: false,
    info: null
  }
  for (let item of buildings) {
    const wkt = spaceAnalysisUtil.stringMultiToWkt(item.loc)
    const geo = reader.read(wkt)
    const pointStr = spaceAnalysisUtil.stringPointToWkt([obj.lon, obj.lat])
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
/**
 * 获取多面多边形的范围以及中心点
 * @param {*} loc
 */
function getMultiPExtentAndCenter(loc) {
  const reader = new jsts.io.WKTReader()
  const wkt = spaceAnalysisUtil.stringMultiToWkt(loc)
  const geo = reader.read(wkt)
  const bound = geo.getBoundary()
  const point = bound.getCentroid()
  const center = point.getX() + ',' + point.getY()
  const envelope = bound.getEnvelopeInternal()
  const scope = envelope.getMinX() + ',' + envelope.getMinY() + ',' + envelope.getMaxX() + ',' + envelope.getMaxY()
  return {
    extent: scope,
    center
  }
}

export default {
  areaManage,
  transformColor,
  locSwitch,
  consistMuPolyCoods,
  consistParam,
  checkInterArea,
  initAreaValByPage,
  isContainerInGrid,
  convertStyleToSymbol,
  findBuildingByExtent,
  getMultiPExtentAndCenter
}
