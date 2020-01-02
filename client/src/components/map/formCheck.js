const mobileCheck = /^([0-9]|[-])+$/g // 表示只能输入数字和连接符
export const regex = { // 验证网格、楼宇名称
  name: /^[(\u4e00-\u9fa5)\w]{0,16}$/,
  mobile: mobileCheck,
  idcode: /^[A-Za-z0-9]+$/
}
export function telNumCheck(val) { // 电话号码
  let flag = false
  for (let index = 0; index < val.length; index++) {
    let item = val[index]
    if (item.mobile !== '') {
      let test = /^([0-9]|[-])+$/g.test(item.mobile)
      if (!test) {
        flag = true
        break
      }
    }
  }
  return flag
}
export function peoplePhoneLengthCheck(val, length) {
  let pids = val
  let flag = false
  let attr = null
  for (let i = 0; i < pids.length; i++) {
    let strlength = pids[i].mobile.replace(/[\u0391-\uFFE5]/g, 'aa').length
    if (strlength > length) {
      flag = true
      attr = {
        flag,
        index: i + 1
      }
      return attr
    }
  }
  if (!flag) {
    attr = {
      flag
    }
  }
  return attr
}
export function telNameCheck(val) { // 负责人正则校验以及去重
  let flag = false
  let nameCheck = /\s+/g
  for (let index = 0; index < val.length; index++) {
    let element = val[index]
    if (nameCheck.test(element.name)) {
      flag = true
      break
    }
  }
  for (let i = 0; i < val.length; i++) {
    for (let j = i + 1; j < val.length; j++) {
      if (val[i].name) {
        if (val[i].name === val[j].name) {
          flag = true
          break
        }
      }
    }
  }
  return flag
}
export function peopleNameLengthCheck(val) {
  let pids = val
  let flag = false
  let attr = null
  for (let i = 0; i < pids.length; i++) {
    let strlength = pids[i].name.replace(/[\u0391-\uFFE5]/g, 'aa').length
    if (strlength > 16) {
      flag = true
      attr = {
        flag,
        index: i + 1
      }
      return attr
    }
  }
  if (!flag) {
    attr = {
      flag
    }
  }
  return attr
}
export function isInvalidPrincipal(val) { // 校验联系人是否不合法
  let back = {flag: false}
  let result = peopleNameLengthCheck(val)
  if (result.flag) {
    back = {flag: true, msg: '第' + result.index + '个负责人长度超过16个字符'}
    return back
  } else {
    let isNameRepeat = telNameCheck(val)
    if (isNameRepeat) {
      back = {flag: true, msg: '负责人重复'}
      return back
    }
  }
  let flag = telNumCheck(val)
  if (flag) {
    back = {flag: true, msg: '联系方式输入有误，仅支持数字和(-)'}
    return back
  } else {
    let phoneCheck = peoplePhoneLengthCheck(val)
    if (phoneCheck.flag) {
      back = {flag: true, msg: '第' + phoneCheck.index + '个联系方式长度超过18个字符'}
      return back
    }
  }
  return back
}
