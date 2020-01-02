const mobileCheck = /^([0-9]|[-])+$/g // 表示只能输入数字和连接符
export const regex = { // 验证网格、楼宇名称
  name: /^[(\u4e00-\u9fa5)\w]{0,16}$/,
  mobile: mobileCheck,
  idcode: /^[A-Za-z0-9]+$/
}
export function telNumCheck(val) { // 电话号码
  let flag = false
  let pids = val
  pids.forEach(item => {
    if (item.mobile !== '') {
      let test = /^([0-9]|[-])+$/g.test(item.mobile)
      if (!test) {
        flag = true
      }
    }
  })
  return flag
}
export function telNameCheck(val) { // 负责人正则校验以及去重
  let flag = false
  let pids = val
  let nameCheck = /\s+/g
  pids.forEach(element => {
    if (nameCheck.test(element.name)) {
      flag = true
      return flag
    }
  })
  for (let i = 0; i < pids.length; i++) {
    for (let j = i + 1; j < pids.length; j++) {
      if (pids[i].name) {
        if (pids[i].name === pids[j].name) {
          flag = true
          return flag
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
