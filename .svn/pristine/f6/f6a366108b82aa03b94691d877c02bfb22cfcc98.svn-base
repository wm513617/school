let tempPoints = []
let tempEntities = []
let handler = null
let context = null
// 清除销毁单击事件
function clearEffects() {
  if (handler != null) {
    handler.destroy()
  }
}
// 设置上下文
function setContext(_context) {
  context = _context
}
// 设置各种操作模式
function setMode(mode) {
  if (mode === 'drawPloy') {
    tempPoints = []
    handler = new context.Cesium.ScreenSpaceEventHandler(context.viewer.scene.canvas)
    handler.setInputAction(function(click) {
      let cartesian = context.viewer.camera.pickEllipsoid(click.position, context.viewer.scene.globe.ellipsoid)
      if (cartesian) {
        let cartographic = context.Cesium.Cartographic.fromCartesian(cartesian)
        let longitudeString = context.Cesium.Math.toDegrees(cartographic.longitude)
        let latitudeString = context.Cesium.Math.toDegrees(cartographic.latitude)
        tempPoints.push({
          lon: longitudeString,
          lat: latitudeString
        })
        let tempLength = tempPoints.length
        drawPoint(tempPoints[tempPoints.length - 1]) // 绘制点-------
        if (tempLength > 1) {
          drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true)
        }
      }
    }, context.Cesium.ScreenSpaceEventType.LEFT_CLICK) // 添加鼠标左键单击事件

    handler.setInputAction(function(click) {
      let cartesian = context.viewer.camera.pickEllipsoid(click.position, context.viewer.scene.globe.ellipsoid)
      if (cartesian) {
        let tempLength = tempPoints.length
        if (tempLength < 3) {
          alert('请选择3个以上的点再执行闭合操作命令')
        } else {
          drawLine(tempPoints[0], tempPoints[tempPoints.length - 1], true) // 画线
          drawPoly(tempPoints) // 画面
          let ent = context.viewer.entities.add({
            position: context.Cesium.Cartesian3.fromDegrees(((tempPoints[0].lon + (tempPoints[tempPoints.length - 1].lon + tempPoints[tempPoints.length - 2].lon) / 2) / 2),
              ((tempPoints[0].lat + (tempPoints[tempPoints.length - 1].lat + tempPoints[tempPoints.length - 2].lat) / 2) / 2)),
            label: {
              text: SphericalPolygonAreaMeters(tempPoints).toFixed(1) + '㎡',
              font: '22px Helvetica',
              fillColor: context.Cesium.Color.BLACK
            }
          })
          tempEntities.push(ent)
          tempPoints = []
          clearEffects()
        }
      }
    }, context.Cesium.ScreenSpaceEventType.RIGHT_CLICK) // 添加鼠标右键单击事件
  } else if (mode === 'drawLine') {
    tempPoints = []
    handler = new context.Cesium.ScreenSpaceEventHandler(context.viewer.scene.canvas)
    handler.setInputAction(function(click) {
      let cartesian = context.viewer.camera.pickEllipsoid(click.position, context.viewer.scene.globe.ellipsoid)
      if (cartesian) {
        let cartographic = context.Cesium.Cartographic.fromCartesian(cartesian)
        let longitudeString = context.Cesium.Math.toDegrees(cartographic.longitude)
        let latitudeString = context.Cesium.Math.toDegrees(cartographic.latitude)
        let height = cartographic.height
        tempPoints.push({
          lon: longitudeString,
          lat: latitudeString,
          height
        })
        let tempLength = tempPoints.length
        drawPoint(tempPoints[tempPoints.length - 1])
        if (tempLength > 1) {
          drawLine(tempPoints[tempPoints.length - 2], tempPoints[tempPoints.length - 1], true)
        }
      }
    }, context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.setInputAction(function(click) {
      tempPoints = []
      clearEffects()
    }, context.Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
}
// 绘制点-----
function drawPoint(point) {
  let entity = context.viewer.entities.add({
    position: context.Cesium.Cartesian3.fromDegrees(point.lon, point.lat, point.height),
    label: {
      text: '',
      font: '22px Helvetica'
    },
    point: {
      pixelSize: 15,
      color: context.Cesium.Color.CHARTREUSE
    }
  })
  tempEntities.push(entity)
}

function drawLine(point1, point2, showDistance) {
  let entity = context.viewer.entities.add({
    polyline: {
      positions: [context.Cesium.Cartesian3.fromDegrees(point1.lon, point1.lat, point1.height), context.Cesium.Cartesian3.fromDegrees(point2.lon, point2.lat, point2.height)],
      width: 10.0,
      material: new context.Cesium.PolylineGlowMaterialProperty({
        color: context.Cesium.Color.CHARTREUSE.withAlpha(0.5)
      })
    }
  })
  tempEntities.push(entity)
  if (showDistance) {
    let w = Math.abs(point1.lon - point2.lon)
    let h = Math.abs(point1.lat - point2.lat)
    let offsetV = w >= h ? 0.0005 : 0
    let offsetH = w < h ? 0.001 : 0
    let distance = getFlatternDistance(point1.lat, point1.lon, point2.lat, point2.lon)
    entity = context.viewer.entities.add({
      position: context.Cesium.Cartesian3.fromDegrees(((point1.lon + point2.lon) / 2) + offsetH,
        ((point1.lat + point2.lat) / 2) + offsetV),
      label: {
        text: distance.toFixed(1) + 'm',
        font: '22px Helvetica',
        fillColor: context.Cesium.Color.WHITE
      }
    })
    tempEntities.push(entity)
  }
}

// 添加面实体-------
function drawPoly(points) {
  let pArray = []
  for (let i = 0; i < points.length; i++) {
    pArray.push(points[i].lon)
    pArray.push(points[i].lat)
  }
  let entity = context.viewer.entities.add({
    polygon: {
      hierarchy: new context.Cesium.PolygonHierarchy(context.Cesium.Cartesian3.fromDegreesArray(pArray)),
      material: context.Cesium.Color.CHARTREUSE.withAlpha(0.5)
    }
  })
  tempEntities.push(entity)
}

// 计算两点间距离
function getFlatternDistance(lat1, lng1, lat2, lng2) {
  let EARTH_RADIUS = 6378137.0 // 单位M
  let PI = Math.PI

  function getRad(d) {
    return d * PI / 180.0
  }
  let f = getRad((lat1 + lat2) / 2)
  let g = getRad((lat1 - lat2) / 2)
  let l = getRad((lng1 - lng2) / 2)

  let sg = Math.sin(g)
  let sl = Math.sin(l)
  let sf = Math.sin(f)

  let s, c, w, r, d, h1, h2
  let a = EARTH_RADIUS
  let fl = 1 / 298.257

  sg = sg * sg
  sl = sl * sl
  sf = sf * sf

  s = sg * (1 - sl) + (1 - sf) * sl
  c = (1 - sg) * (1 - sl) + sf * sl

  w = Math.atan(Math.sqrt(s / c))
  r = Math.sqrt(s * c) / w
  d = 2 * w * a
  h1 = (3 * r - 1) / 2 / c
  h2 = (3 * r + 1) / 2 / s

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}

// 计算多边形面积
let earthRadiusMeters = 6371000.0
let radiansPerDegree = Math.PI / 180.0
let degreesPerRadian = 180.0 / Math.PI

function SphericalPolygonAreaMeters(points) {
  let totalAngle = 0
  for (let i = 0; i < points.length; i++) {
    let j = (i + 1) % points.length
    let k = (i + 2) % points.length
    totalAngle += Angle(points[i], points[j], points[k])
  }
  let planarTotalAngle = (points.length - 2) * 180.0
  let sphericalExcess = totalAngle - planarTotalAngle
  if (sphericalExcess > 420.0) {
    totalAngle = points.length * 360.0 - totalAngle
    sphericalExcess = totalAngle - planarTotalAngle
  } else if (sphericalExcess > 300.0 && sphericalExcess < 420.0) {
    sphericalExcess = Math.abs(360.0 - sphericalExcess)
  }
  return sphericalExcess * radiansPerDegree * earthRadiusMeters * earthRadiusMeters
}

/* 角度 */
function Angle(p1, p2, p3) {
  let bearing21 = Bearing(p2, p1)
  let bearing23 = Bearing(p2, p3)
  let angle = bearing21 - bearing23
  if (angle < 0) {
    angle += 360
  }
  return angle
}
/* 方向 */
function Bearing(from, to) {
  let lat1 = from.lat * radiansPerDegree
  let lon1 = from.lon * radiansPerDegree
  let lat2 = to.lat * radiansPerDegree
  let lon2 = to.lon * radiansPerDegree
  let angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2))
  if (angle < 0) {
    angle += Math.PI * 2.0
  }
  angle = angle * degreesPerRadian
  return angle
}
/**
 * 清除地图痕迹
 */
function clearDrawingBoard() {
  let primitives = context.viewer.entities
  for (let i = 0; i < tempEntities.length; i++) {
    primitives.remove(tempEntities[i])
  }
  tempEntities = []
  clearEffects()
}

function measureDistance() {
  let tooltip = document.getElementById('toolTip')
  handler = new context.Cesium.ScreenSpaceEventHandler(context.viewer.scene.canvas)
  let isDraw = true
  let entities = []
  let polylinePath = []
  let billboards = context.viewer.scene.primitives.add(new context.Cesium.BillboardCollection())
  createPolyline()
  handler.setInputAction(function(movement) {
    let position = context.viewer.scene.pickPosition(movement.endPosition)
    // 将笛卡尔坐标转化为经纬度坐标
    let cartographic = context.Cesium.Cartographic.fromCartesian(position)

    if (cartographic) {
      // 海拔
      let height = cartographic.height
      let longitude = context.Cesium.Math.toDegrees(cartographic.longitude)
      let latitude = context.Cesium.Math.toDegrees(cartographic.latitude)
      // 地理坐标（弧度）转经纬度坐标
      let point = context.Cesium.Cartesian3.fromDegreesArrayHeights([longitude, latitude, height])[0]
      if (isDraw) {
        tooltip.style.left = movement.endPosition.x + 10 + 'px'
        tooltip.style.top = movement.endPosition.y + 20 + 'px'
        tooltip.style.display = 'block'
        if (polylinePath.length < 1) {
          return
        }
        polylinePath.push(point)
        context.viewer.entities.getById('measureline').polyline.positions = polylinePath
        context.viewer.entities.getById('measureline').polyline.show = true
        // 如果贴地线未定义---
        // if (!context.Cesium.defined(polylineEntity)) {
        //   polylinePath.push(point)
        //   polylineEntity = createPolyline(polylinePath)
        // } else {
        //   polylineEntity.polyline.positions._value.pop()
        //   polylineEntity.polyline.positions._value.push(point)
        //   console.log('鼠标在地图上移动时添加点时多线长度：' + polylineEntity.polyline.positions._value.length)
        // }
        if (polylinePath.length >= 1) {
          // if (polylineEntity && polylineEntity.polyline) {
          //   // let distance = getDistance(polylineEntity.path)
          //   let distance = 1.0
          //   tooltip.innerHTML = '<p>长度：' + distance + '</p><p>双击确定终点</p>'
          // }
        }
      }
    }
  }, context.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  handler.setInputAction(function(movement) {
    let position = context.viewer.scene.pickPosition(movement.position)
    // 将笛卡尔坐标转化为经纬度坐标
    let cartographic = context.Cesium.Cartographic.fromCartesian(position)
    if (cartographic) {
      let height = cartographic.height
      let longitude = context.Cesium.Math.toDegrees(cartographic.longitude)
      let latitude = context.Cesium.Math.toDegrees(cartographic.latitude)
      // 地理坐标（弧度）转经纬度坐标
      let point = context.Cesium.Cartesian3.fromDegreesArrayHeights([longitude, latitude, height])[0]
      if (isDraw) {
        // polylinePath.push(cartographic);
        polylinePath.push(point)
        let tempLength = polylinePath.length
        console.log('点数组元素长度:' + tempLength)
        // if (tempLength > 1) {
        //   if (polylineEntity) {
        //     polylineEntity.polyline.positions._value.pop()
        //     polylineEntity.polyline.positions._value.push(point)
        //     console.log('单击地图添加点时多线长度：' + polylineEntity.polyline.positions._value.length)
        //   } else {
        //     // polylineEntity = createPolyline(polylinePath)
        //   }
        // }
        // if (polylineEntity)
        //   polylineEntity.polyline.positions._value.push(point)
        // console.log('单击地图添加点时多线长度：' + polylineEntity.polyline.positions._value.length)
        //  SurfaceLine(cartographic)
        // let text = "起点"
        // if (polylineEntity) {
        //   // text = getDistance(polylineEntity.path)
        // }
        // entities.push(context.viewer.entities.add({
        //   position: point,
        //   point: {
        //     show: true,
        //     color: context.Cesium.Color.SKYBLUE,
        //     pixelSize: 3,
        //     outlineColor: context.Cesium.Color.YELLOW,
        //     outlineWidth: 1
        //   },
        //   label: {
        //     text: text,
        //     font: '12px sans-serif',
        //     style: context.Cesium.LabelStyle.FILL,
        //     outlineWidth: 1,
        //     fillColor: context.Cesium.Color.WHITE,
        //     showBackground: false,
        //     backgroundColor: context.Cesium.Color.ORANGE.withAlpha(0.6),
        //     horizontalOrigin: context.Cesium.HorizontalOrigin.LEFT,
        //     pixelOffset: new context.Cesium.Cartesian2(5.0, -20.0),
        //   }
        // }))
      }
    }
  }, context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler.setInputAction(function() {
    handler.removeInputAction(context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler.removeInputAction(context.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    // handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    // cesium.cesiumViewer.zoomTo(polyline.lineEntity);
    context.viewer.trackedEntity = undefined
    isDraw = false
    // cesium.cesiumViewer.scene.globe.depthTestAgainstTerrain = false;
    let billboard = billboards.add({
      show: true,
      id: 'measureTool',
      position: polylinePath[polylinePath.length - 1],
      pixelOffset: new context.Cesium.Cartesian2(0.0, 20),
      eyeOffset: new context.Cesium.Cartesian3(0.0, 0.0, 0.0),
      horizontalOrigin: context.Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: context.Cesium.VerticalOrigin.CENTER,
      scale: 1.0,
      image: '/static/arrow.png',
      color: new context.Cesium.Color(1.0, 1.0, 1.0, 1.0)
    })

    tooltip.style.display = 'none'
    // 关闭按钮执行事件
    handler.setInputAction(function(movement) {
      let pickedObjects = {}
      pickedObjects = context.viewer.scene.drillPick(movement.position)
      if (context.Cesium.defined(pickedObjects)) {
        for (let i = 0; i < pickedObjects.length; i++) {
          if (pickedObjects[i].primitive === billboard) {
            // context.Cesium.cesiumViewer.entities.remove(polyline.lineEntity)
            for (let j = 0; j < entities.length; j++) {
              context.viewer.entities.remove(entities[j])
            }
            entities = []
            billboards.remove(billboard)
            polylinePath = []
            //  polylineEntity = undefined
            handler.removeInputAction(context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
          }
        }
      }
    }, context.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }, context.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}

function createPolyline() {
  let entity = context.viewer.entities.add({
    id: 'measureline',
    polyline: {
      show: false,
      width: 5.0,
      material: new context.Cesium.PolylineGlowMaterialProperty({
        color: context.Cesium.Color.RED
      })
    }
  })
  return entity
}

export default {
  clearEffects,
  setContext,
  setMode,
  measureDistance,
  clearDrawingBoard
}
