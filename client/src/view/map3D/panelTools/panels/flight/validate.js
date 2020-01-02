export const validateTitle = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入路线名称'))
  }
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
    return callback(new Error('不得超过64个字符'))
  } else {
    return callback()
  }
}

export const validateDes = (rule, value, callback) => {
  let strlen = 0
  for (let i = 0; i < value.length; i++) {
    if (value.charCodeAt(i) > 255) {
      // 如果是汉字，则字符串长度加2
      strlen += 2
    } else {
      strlen++
    }
  }
  if (strlen > 100) {
    return callback(new Error('不得超过100个字符'))
  } else {
    return callback()
  }
}
