// 删除数组中指定值
export function delectOf(validList, value) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      validList.splice(i, 1)
    }
  }
  return validList
}
// 为数组每一项
export function addChecked(list) {
  for (let i = 0; i < list.length; i++) {
    list[i]._checked = false
  }
  // if (list.length < 10) {
  //   var addLen = 10 - list.length
  //   for (let i = 0; i < addLen; i++) {
  //     list.push({
  //       _disabled: true,
  //       _checked: false
  //     })
  //   }
  // }
  return list
}

export class Compare {
  constructor(o = {}, n = {}) {
    this.old = o
    this.new = n
  }
  get obj() {
    let t = []
    let o = this.old
    let n = this.new
    n.forEach((v, i) => {
      let arr = Object.keys(v.conf)
      if (arr.length) {
        for (let k = 0; k < arr.length; k++) {
          if (v.conf[arr[k]] !== o[i].conf[arr[k]]) {
            t.push(v)
            break
          }
        }
      }
    })
    return t
  }
}
