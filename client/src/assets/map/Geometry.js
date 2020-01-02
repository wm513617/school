/**
 * 胡红勋 2017-5-27 几何类
 * @param {*}  conf  对象类型
 */
let Geometry = function(conf) {
  let _conf = {...conf}
  this.type = _conf.type
  this.points = _conf.points
  this.toString = function() {
    return {
      type: this.type,
      points: this.points
    }
  }
}
export { Geometry }
