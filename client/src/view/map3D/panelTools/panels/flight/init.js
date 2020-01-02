// 初始化数据
import mapUtil from 'assets/3DMap/mapUtil.js'
// 视角模式
export const viewModes = [
  { label: '第一视角', value: mapUtil.VIEWMODE.tracklook },
  { label: '跟随视角', value: mapUtil.VIEWMODE.followlook },
  { label: '上帝视角', value: mapUtil.VIEWMODE.overlook }
]

export let transCoorinates = {
  /**
   * 将世界坐标数组转换为经纬度高度坐标数组
   * @param {*} context 三维视图内容
   * @param {*} positions 世界坐标数组
   * @returns
   */
  worldPositionsToWSG84Arr(context, positions) {
    let coorinates = []
    for (const position of positions) {
      let cartographic = context.Cesium.Cartographic.fromCartesian(position)
      let { longitude, latitude, height } = cartographic
      longitude = context.Cesium.Math.toDegrees(longitude)
      latitude = context.Cesium.Math.toDegrees(latitude)
      let coorinate = [longitude, latitude, height]
      coorinates.push(coorinate)
    }
    return coorinates
  },
  /**
   *
   * 将经纬度高度坐标数组转换为世界坐标数组
   * @param {*} context 三维视图内容
   * @param {*} coorinates 经纬度高度坐标数组
   * @returns
   */
  WSG84ArrToWorldPositions(context, coorinates) {
    let degreesArrayHeights = [].concat.apply([], coorinates) // 将二维数组降为一维数组
    let positions = context.Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights) // 转换为世界坐标数组
    return positions
  }
}
