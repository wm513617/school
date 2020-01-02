/**
 * 胡红勋 2017-5-27
 * @param {*} geo  几何位置
 * @param {*} symbol  样式
 * @param {*} attributes 属性
 */
let Graphic = function(geo, symbol, attributes = null) {
  this.geo = geo
  this.symbol = symbol
  this.attributes = attributes
}
export { Graphic }
