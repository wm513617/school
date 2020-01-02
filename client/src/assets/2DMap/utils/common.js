// 工具方法类
function getType(obj) {
  var type = Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)[1]
  if (type === 'string' && typeof obj === 'object') {
    return 'object'
  } // Let "new String('')" return 'object'
  if (obj === null) {
    return 'null'
  } // PhantomJS has type "DOMWindow" for null
  if (obj === undefined) {
    return 'undefined'
  } // PhantomJS has type "DOMWindow" for undefined
  return type
}

export {
  getType
}
