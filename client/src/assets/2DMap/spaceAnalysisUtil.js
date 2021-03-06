const jsts = require('jsts')
const _ = require('lodash')
// 字符串转wkt(多边形)
function stringLineToWkt(str) {
  let points = str.split(',')
  let ele = parseFloat(points[0]) + ' ' + parseFloat(points[1]) + ',' + parseFloat(points[2]) + ' ' + parseFloat(points[3])
  const wkt = 'LINESTRING(' + ele + ')'
  return wkt
}

function stringPointToWkt(str) {
  let ele = str[0] + ' ' + str[1]
  const wkt = 'POINT(' + ele + ')'
  return wkt
}
// 字符串转wkt(多边形)
function stringPolygonToWkt(str) {
  let wktStr = ''
  const arr = _.chunk(str.split(','), 2)
  let temp
  for (let j = 0; j < arr.length; j++) {
    temp = arr[j][0] + ' ' + arr[j][1]
    if (j < (arr.length - 1)) {
      wktStr += (temp + ',')
    }
    if (j === (arr.length - 1)) {
      wktStr += temp
    }
  }
  wktStr = 'POLYGON(' + wktStr + ')'
  return wktStr
}
// 字符串转wkt(多边形)
function stringMultiToWkt(str) {
  let wktStr = ''
  const strAreaArr = str.split('|')
  for (let i = 0; i < strAreaArr.length; i++) {
    let wktItemStr = ''
    const arr = _.chunk(strAreaArr[i].split(','), 2)
    let temp
    for (let j = 0; j < arr.length; j++) {
      temp = arr[j][0] + ' ' + arr[j][1]
      if (j < (arr.length - 1)) {
        wktItemStr += (temp + ',')
      }
      if (j === (arr.length - 1)) {
        wktItemStr += temp
      }
    }
    if (i < (strAreaArr.length - 1)) {
      wktStr += '(' + wktItemStr + '),'
    }
    if (i === (strAreaArr.length - 1)) {
      wktStr += '(' + wktItemStr + ')'
    }
  }
  const wkt = `MULTIPOLYGON(${wktStr})`
  return wkt
}
// 字符串转wkt(多线)
function stringMultiLineToWkt(str) {
  let wktStr = ''
  const strAreaArr = str.split('|')
  for (let i = 0; i < strAreaArr.length; i++) {
    let wktItemStr = ''
    const arr = _.chunk(strAreaArr[i].split(','), 2)
    let temp
    for (let j = 0; j < arr.length; j++) {
      temp = arr[j][0] + ' ' + arr[j][1]
      if (j < (arr.length - 1)) {
        wktItemStr += (temp + ',')
      }
      if (j === (arr.length - 1)) {
        wktItemStr += temp
      }
    }
    if (i < (strAreaArr.length - 1)) {
      wktStr += '(' + wktItemStr + '),'
    }
    if (i === (strAreaArr.length - 1)) {
      wktStr += '(' + wktItemStr + ')'
    }
  }
  const wkt = `MULTILINESTRING(${wktStr})`
  return wkt
}

// 判断线与线的相交情况
function isInterPath(loc1, loc2) {
  const wkt1 = stringLineToWkt(loc1)
  const wkt2 = stringLineToWkt(loc2)
  const reader = new jsts.io.WKTReader()
  const geo1 = reader.read(wkt1)
  const geo2 = reader.read(wkt2)
  let inter = geo1.intersects(geo2)
  return inter
}
// 判断面与面的相交情况
function isInterInPolygon(loc1, loc2) {
  const wkt1 = stringPolygonToWkt(loc1)
  const wkt2 = stringPolygonToWkt(loc2)
  const reader = new jsts.io.WKTReader()
  const geo1 = reader.read(wkt1)
  const geo2 = reader.read(wkt2)
  let inter = geo1.intersects(geo2)
  return inter
}

function isContainerPoint(loc1, loc2) {
  const wkt1 = stringPolygonToWkt(loc1)
  const wkt2 = stringPointToWkt(loc2)
  const reader = new jsts.io.WKTReader()
  const geo1 = reader.read(wkt1)
  const geo2 = reader.read(wkt2)
  // 测试此几何体是否在指定的几何体内。即geo1是否在geo2中
  let inter = geo2.intersects(geo1)
  return inter
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}
// 根据静态底图的范围获取到底图的中心点
function getCenterByPolygonExtent(str) {
  const arr = _.chunk(str.split(','), 2)
  const leftTop = [arr[0][0], arr[1][1]]
  const rightTop = arr[1]
  const rightBottom = [arr[1][0], arr[0][1]]
  const leftBottom = arr[0]
  const array = [leftTop, rightTop, rightBottom, leftBottom, leftTop].toString()
  const wkt = stringPolygonToWkt(array)
  const reader = new jsts.io.WKTReader()
  const geo = reader.read(wkt)
  const bound = geo.getBoundary()
  const point = bound.getCentroid()
  const center = [point.getX(), point.getY()]
  return center
}

// 获取线的中心
function getLineStringCenter(str) {
  const wkt = stringLineToWkt(str)
  const reader = new jsts.io.WKTReader()
  const geo = reader.read(wkt)
  const point = geo.getCentroid()
  const center = [point.getX(), point.getY()]
  return center
}

// 获取多线的中心
function getMultiLineStringCenter(str) {
  const wkt = stringMultiLineToWkt(str)
  const reader = new jsts.io.WKTReader()
  const geo = reader.read(wkt)
  const point = geo.getCentroid()
  const center = [point.getX(), point.getY()]
  return center
}

// 获取面的中心
function getPolygonCenter(str) {
  const wkt = stringPolygonToWkt(str)
  const reader = new jsts.io.WKTReader()
  const geo = reader.read(wkt)
  const point = geo.getBoundary().getCentroid()
  const center = [point.getX(), point.getY()]
  return center
}

// 获取多面的中心
function getMultiPolygonCenter(str) {
  const wkt = stringMultiToWkt(str)
  const reader = new jsts.io.WKTReader()
  const geo = reader.read(wkt)
  const point = geo.getBoundary().getCentroid()
  const center = [point.getX(), point.getY()]
  return center
}

export default {
  stringMultiToWkt,
  stringPointToWkt,
  stringPolygonToWkt,
  isInterPath,
  isInterInPolygon,
  isContainerPoint,
  isArray,
  getCenterByPolygonExtent,
  getLineStringCenter,
  getMultiLineStringCenter,
  getPolygonCenter,
  getMultiPolygonCenter
}
