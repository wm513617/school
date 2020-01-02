
/**
 * 若 传入的是 DOM Element 则进行回调
 * 若不是 则抛出异常
 * @param {Element} obj 元素对象
 * @param {Funciton} calback 正常回调
 * @Error obj instanceof Element === false 抛出异常
 */
function ElementCall(obj, calback) {
  if (isElement(obj)) {
    return calback()
  }
  throw new Error('parameter [obj] is not DOM Element')
}

/**
 * 验证 class 是否存在
 * @param {Element} obj 元素对象
 */
export function isElement(obj) {
  return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType))
}
/**
 * 验证 class 是否存在
 * @param {Element} obj 元素对象
 * @param {String} value class选择器名
 */
export function existClass(obj, value) {
  return ElementCall(obj, () => {
    return new RegExp(value).test(obj.className)
  })
}

/**
 * 若 当前 class 不存在，则追加
 * @param {Element} obj 元素对象
 * @param {String} value class选择器名
 */
export function appentClass(obj, value) {
  ElementCall(obj, () => {
    if (existClass(obj, value) === false) {
      obj.className += ' ' + value
    }
  })
}

/**
 * 若 当前 class 存在，则移除
 * @param {Element} obj 元素对象
 * @param {String} value class选择器名
 */
export function removeClass(obj, value) {
  ElementCall(obj, () => {
    if (existClass(obj, value)) {
      obj.className = obj.className.replace(value, ' ')
      obj.className = obj.className.replace(/\s{2,}/, ' ')
    }
  })
}

/**
 * 获取 style 对象属性[value] 的值
 * @param {Element} obj 元素对象
 * @param {String} value style 对象属性名
 * @param {Boolean} unit 是否要单位 默认 false
 */
export function getStyle(obj, value, unit = false) {
  return ElementCall(obj, () => {
    const content = window.getComputedStyle(obj)[value]

    return unit ? content : Number(content.replace(/[^0-9\\.]/g, ''))
  })
}

/**
 * 获取 Event Target Element
 * @param {*} event
 */
export function eventTarget(event = window.event) {
  // currentTarget
  return event.currentTarget || event.srcElement
}
