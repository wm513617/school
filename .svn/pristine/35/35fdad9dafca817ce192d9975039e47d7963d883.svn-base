export const validateName = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  if (!value) {
    return callback(new Error('名称不能为空'))
  }
  if (value.indexOf(' ') !== -1) {
    return callback(new Error('不能输入空格'))
  }
  if (!reg.test(value)) {
    return callback(new Error('请输入不超过16位字符的内容'))
  } else {
    // Unicode编码
    let strlen = 0
    for (let i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) > 255) {
        // 如果是汉字，则字符串长度加2
        strlen += 2
      } else {
        strlen++
      }
    }
    if (strlen > 16) {
      return callback(new Error('请输入不超过16位字符的内容'))
    } else {
      return callback()
    }
  }
}

export const validateReson = (rule, value, callback) => {
  if (value === '' || !value) {
    return callback()
  }
  // Unicode编码
  let strlen = 0
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) {
      // 如果是汉字，则字符串长度加2
      strlen += 2
    } else {
      strlen++
    }
  }
  if (strlen > 64) {
    return callback(new Error('请输入不超过64位的字符'))
  } else {
    return callback()
  }
}
