export const alarmIntervalRule = (rule, value, callback) => {
  let r = /^\+?[0-9][0-9]*$/
  if (value === '') {
    return callback(new Error('不能为空'))
  }
  if (r.test(value) || Number(value) === 0) {
    if (Number(value) > 7200) {
      return callback(new Error('范围0s-7200s'))
    } else {
      callback()
    }
  } else {
    return callback(new Error('请输入有效数字'))
  }
}
export function numberValidate(min, max) {
  return (rule, value, callback) => {
    let r = /^\+?[0-9][0-9]*$/
    if (value === '') {
      return callback(new Error('不能为空'))
    }
    if (r.test(value) || Number(value) === 0) {
      if (Number(value) > max || Number(value) < min) {
        return callback(new Error(`范围${min}-${max}`))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入有效数字'))
    }
  }
}
