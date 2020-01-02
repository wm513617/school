/**
 * 数据类型判断 huhongxun 2017-5-27
 */
export const VariableTypes = {

  _type: Object.prototype.toString,

  /**
   * 判断是否为对象类型
   */
  isObject: function(obj) {
    return obj ? this._type.call(obj) === '[object Object]' : false
  },
  /**
   * 判断是否为空对象
   */
  isEmptyObject: function(obj) {
    for (let elem in obj) {
      return false
    }
    return true
  },
  /**
   * 判断是否为Undefined
   */
  isUndefined: function(obj) {
    return typeof obj === 'undefined'
  },

  /**
   * 判断是否为数组
   */
  isArray: function(obj) {
    return this._type.call(obj) === '[object Array]'
  },

  /**
   * 判断是否为字符串
   */
  isString: function(obj) {
    return this._type.call(obj) === '[object String]'
  },

  /**
   * 判断是否为数字
   */
  isNumeric: function(obj) {
    return this._type.call(obj) === '[object Number]'
  },

  /**
   * 判断是否为布尔类型
   */
  isBoolean: function(obj) {
    return this._type.call(obj) === '[object Boolean]'
  },

  /**
   * 判断是否为正则类型
   */
  isReg: function(obj) {
    return this._type.call(obj) === '[object Regexp]'
  },

  /**
   * 判断是否为日期类型
   */
  isDate: function(obj) {
    return this._type.call(obj) === '[object Date]'
  },

  /**
   * 判断是否为函数类型
   */
  isFunc: function(obj) {
    return this._type.call(obj) === '[object Function]'
  },

  /**
   * 判断是否为Null类型
   */
  isNull: function(obj) {
    return obj === null
  }
}
export function generateID(len, seed = '') {
  let idLen = len ? (len < 12 ? 12 : len) : 12
  let idSeed = seed
  let randomSeed = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
  let randomStr = ''
  while (randomStr.length < idLen) {
    randomStr += randomSeed.substr(Math.ceil(Math.random() * 62), 1)
  }
  return idSeed + randomStr
}
// arr1经纬度数组、arr2区域宽高
export function getExtent(arr1, arr2) {
  // hw 区域宽高比
  let hw = (arr2[0] / arr2[1]).toFixed(8)
  // h区域高、w区域宽
  let w = arr1[2] - arr1[0]
  let h = arr1[3] - arr1[1]
  console.log('w' + w)
  console.log('h' + h)
  let newArr = []
  let distance = 0
  // h区域高、w区域宽
  if (arr1[2] > arr1[0]) {
    let w = arr1[2] - arr1[0]
    let h = arr1[3] - arr1[1]
    console.log('w' + w)
    console.log('h' + h)
    if (w / h < hw) {
      distance = h - w / hw
      newArr = [arr1[0], arr1[1] + distance / 2, arr1[2], arr1[3] - distance / 2]
    } else {
      distance = h * hw - w
      newArr = [arr1[0] - distance / 2, arr1[1], arr1[2] + distance / 2, arr1[3]]
    }
  } else {
    let w = arr1[0] - arr1[2]
    let h = arr1[1] - arr1[3]
    console.log('w' + w)
    console.log('h' + h)
    if (w / h < hw) {
      distance = h - w / hw
      newArr = [arr1[2], arr1[3] + distance / 2, arr1[0], arr1[1] - distance / 2]
    } else {
      distance = h * hw - w
      newArr = [arr1[2] - distance / 2, arr1[3], arr1[0] + distance / 2, arr1[1]]
    }
  }
  return newArr
}
