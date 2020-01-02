/**
 * 网格绘制中，判断网格是否自相交，和数据中的数据是否相交，多个面的网格是否相交，数据库中的网格如何转化为要素等---胡红勋
 */
import {
  GeometryType
} from './GeometryType.js'
import spaceAnalysisUtil from './spaceAnalysisUtil.js'

function convertGridDatasToFeatures(areaArr, status) {
  let features = []
  for (let i = 0; i < areaArr.length; i++) {
    let style = null
    if (areaArr[i].style) {
      style = convertStyleToSymbol(areaArr[i].style)
    }
    if (status) {
      style.textStyle.label = '网格:' + areaArr[i].name
    }
    features.push({
      geom: {
        type: GeometryType.MULTIPOLYGON,
        points: areaArr[i].loc
      },
      symbol: style,
      attributes: {
        id: areaArr[i]._id,
        type: 'grid'
      }
    })
  }
  return features
}

// 组成多个多边形的左边参数
function consistMutiPolyCoods(coods) {
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

// 组成多条线的左边参数
function consistMutiPolyLineCoods(coods) {
  let val = ''
  if (coods.length > 1) {
    for (let i = 0; i < coods.length; i++) {
      if (val) {
        val = coods[i].toString() + '|' + val
      } else {
        val = coods[i].toString()
      }
    }
  } else {
    val = coods[0].toString()
  }
  return val
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
 * 多个多边形的自相交判断
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
 * 判断一个多面中的多边形是否存在相交----
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
  // let coodsArr = _.chunk(feature.split(','), 2)
  // let isCon = false
  // for (let i = 0; i < areas.length; i++) {
  //   // 如果此几何体包含指定的坐标，则返回true。 如果坐标位于几何体的边界上，则返回false。
  //   let num = 0
  //   for (let j = 0; j < coodsArr.length; j++) {
  //     isCon = spaceAnalysisUtil.isContainerPoint(areas[i], coodsArr[j])
  //     if (isCon) { // 不包含
  //       num = num + 1
  //       continue
  //     } else {
  //       break
  //     }
  //   }
  //   if (num === coodsArr.length) {
  //     return true
  //   } else {
  //     continue
  //   }
  // }
  // return isCon // 该值如果不为null,表示包含或与在边界上 --- 即就是相交
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

/* 十六进制颜色值和透明度转换为rgba()格式 */
function colorTranformToRgba(color, opacity) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = color.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i++) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    let sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    let _opacity = opacity / 100
    return 'rgba(' + sColorChange.join(',') + ',' + _opacity + ')'
  }
}

/* rgba格式转换为十六进制颜色值和透明度 */
function rgbaTranformToColor(color) {
  const reg = /^[rR][gG][Bb][Aa]?[(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[)]{1}$/g
  if (reg.test(color)) {
    let rgb = color.split(',')
    let r = parseInt(rgb[0].split('(')[1])
    let g = parseInt(rgb[1])
    let b = parseInt(rgb[2].split(')')[0])
    let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    let opacity = rgb[3].split(')')[0] * 100
    return {
      hex,
      opacity
    }
  }
}

function _deleteResourceById(features, id) {
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

function addFeatureToLayer(features, feature) {
  _deleteResourceById(features, feature.attributes.id)
  features.push(feature)
  return features
}

function deleteSameGrid(features, feature) {
  return _deleteResourceById(features, feature.attributes.id)
}

/**
 * 将设置或从数据库中获取的样式转换为openlayer地图需要的样式格式
 */
function convertStyleToSymbol(style) {
  let {
    borderStyle,
    borderWidth,
    borderColor,
    borderTransparency,
    fillColor,
    fillColorTransparency,
    fontColor,
    fontSize
  } = style
  let symbol = {
    strokeStyle: {},
    textStyle: {},
    fillColor: ''
  }
  borderColor = changeColorFormat(borderColor) // 将16进制颜色值转化为rgb格式颜色值
  borderTransparency = borderTransparency / 100 // 边框透明度----
  borderColor = transformColor(borderColor, borderTransparency) // 根据边框颜色以及透明度获取边框颜色的rgb值
  fillColor = changeColorFormat(fillColor) // 将填充色的颜色值从16进制修改为rgb格式-----
  fillColorTransparency = fillColorTransparency / 100 // 填充色的透明度
  fillColor = transformColor(fillColor, fillColorTransparency) // 填充色的颜色以及透明度获取填充色---
  borderStyle = _getBorderStyle(borderStyle) // 获取边框样式-----
  symbol.fillColor = fillColor
  symbol.strokeStyle.lineDash = borderStyle
  symbol.strokeStyle.outLineColor = borderColor
  symbol.strokeStyle.outLineWidth = parseFloat(borderWidth) // 需要数字
  symbol.textStyle.fillColor = fontColor
  symbol.textStyle.fontSize = parseFloat(fontSize) / 10
  return symbol
}
function _getBorderStyle(style) {
  let bordSytle = null
  if (style === 'solid') {
    bordSytle = [1]
  }
  if (style === 'dashed') {
    bordSytle = [2, 4]
  }
  if (style === 'dotted') {
    bordSytle = [4, 6, 4]
  }
  return bordSytle
}
export default {
  convertGridDatasToFeatures,
  transformColor,
  checkInterArea,
  convertStyleToSymbol,
  rgbaTranformToColor,
  colorTranformToRgba,
  addFeatureToLayer,
  consistMutiPolyCoods,
  consistMutiPolyLineCoods,
  isInterBetweenMultiPolygon,
  isSelfIntersects,
  isInterMultiPolygon,
  isSelfInterMultiPolygon,
  deleteSameGrid,
  isContainerInPolygons
}
