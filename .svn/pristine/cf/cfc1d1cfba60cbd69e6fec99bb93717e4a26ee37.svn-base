let handlerDis = null
export function setMeasureHandle(context) {
  if (!handlerDis) {
    handlerDis = new context.Cesium.MeasureHandler(context.viewer, context.Cesium.MeasureMode.Distance, 0)
    handlerDis.measureEvt.addEventListener(function(result) {
      let dis = Number(result.distance)
      let distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm'
      handlerDis.disLabel.text = '距离:' + distance
      // handlerDis.deactivate()
    })
    handlerDis.activate()
  }
}
export function deactive() {
  handlerDis.deactive()
  handlerDis.clear()
}
