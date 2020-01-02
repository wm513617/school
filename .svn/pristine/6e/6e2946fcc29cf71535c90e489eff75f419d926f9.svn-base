export const validateName = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  if (!value) {
    return callback(new Error('姓名不能为空'))
  }
  if (value.indexOf(' ') !== -1) {
    return callback(new Error('不能输入空格'))
  }
  if (!reg.test(value)) {
    return callback(new Error('请输入小于16位字符的内容'))
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
      return callback(new Error('请输入小于16位字符的内容'))
    } else {
      return callback()
    }
  }
}

export const validateReson = (rule, value, callback) => {
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  if (!reg.test(value) && value !== '') {
    return callback(new Error('请输入小于64位字符的字母和汉字'))
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
    if (strlen > 64) {
      return callback(new Error('请输入小于64位字符的字母和汉字'))
    } else {
      return callback()
    }
  }
}

export const dispatchReson = (rule, value, callback) => {
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
    return callback(new Error('请输入小于64位的字符'))
  } else {
    return callback()
  }
}

export const validateDesc = (rule, value, callback) => {
  if (value === '' || !value) {
    return callback()
  }
  let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  if (!reg.test(value) && value !== '') {
    return callback(new Error('请输入小于512位字符的字母和汉字'))
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
    if (strlen > 512) {
      return callback(new Error('请输入小于512位字符的字母和汉字'))
    } else {
      return callback()
    }
  }
}

export const dispatchDesc = (rule, value, callback) => {
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
  if (strlen > 512) {
    return callback(new Error('请输入小于512位的字符'))
  } else {
    return callback()
  }
}

export const validateFaceParam = (rule, value, callback) => {
  if (typeof value === 'number' && value >= 24 && value <= 4096) {
    return callback()
  } else {
    return callback(new Error('最小值不得低于24像素，80*80至200*200最佳'))
  }
}

export const validateInterval = (rule, value, callback) => {
  if (typeof value === 'number' && value >= 100 && value <= 2000) {
    return callback()
  } else {
    return callback(new Error('请输入100 - 2000之间的数字'))
  }
}

export const validateAmbiguity = (rule, value, callback) => {
  let reg = /^\d{0,8}\.{0,1}(\d{1,2})?$/
  if (reg.test(value) && value >= 0 && value <= 1) {
    return callback()
  } else {
    return callback(new Error('请输入0 - 1 之间的小数,最多保留两位'))
  }
}

export const validatePitch = (rule, value, callback) => {
  if (typeof value === 'number' && value >= -180 && value <= 180) {
    return callback()
  } else {
    return callback(new Error('请输入-180 - 180之间的数字'))
  }
}
export const validateGroup = (rule, value, callback) => {
  if (value === '') {
    return callback(new Error('请选择一个底库'))
  } else {
    return callback()
  }
}

export const validateIdentity = (rule, value, callback) => {
  if (value === '' || !value) {
    return callback()
  }
  let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
  if (reg.test(value) || value === '') {
    return callback()
  } else {
    return callback(new Error('身份证号不合法'))
  }
}
export const validateAge = (rule, value, callback) => {
  if (value === '' || !value) {
    return callback()
  }
  let reg = /^[0-9]*[1-9][0-9]*$/
  if ((reg.test(value) && value > 0 && value <= 100) || value === '') {
    return callback()
  } else {
    return callback(new Error('请输入正确的年龄'))
  }
}
