export default {
  isEmpty(object) {
    if (object === null || object === undefined) {
      return false
    }
    for (let i in object) {
      // 存在属性或方法，则不是空对象
      return false
      // sodino.com
    }
    return true
  },
  validatePhone(rule, value, callback) {
    if (value) {
      let telReg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
      let phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/
      let isPhone = false
      if (telReg.test(value) || phoneReg.test(value)) {
        isPhone = true
      }
      if (!isPhone) {
        callback(new Error('电话号码格式不正确'))
      }
      callback()
    } else {
      callback()
    }
  },
  IdentityCodeValid(sId) {
    let aCity = {
      11: '北京',
      12: '天津',
      13: '河北',
      14: '山西',
      15: '内蒙古',
      21: '辽宁',
      22: '吉林',
      23: '黑龙江',
      31: '上海',
      32: '江苏',
      33: '浙江',
      34: '安徽',
      35: '福建',
      36: '江西',
      37: '山东',
      41: '河南',
      42: '湖北',
      43: '湖南',
      44: '广东',
      45: '广西',
      46: '海南',
      50: '重庆',
      51: '四川',
      52: '贵州',
      53: '云南',
      54: '西藏',
      61: '陕西',
      62: '甘肃',
      63: '青海',
      64: '宁夏',
      65: '新疆',
      71: '台湾',
      81: '香港',
      82: '澳门',
      91: '国外'
    }
    let iSum = 0
    let tips = ''
    if (!/^\d{17}(\d|x)$/i.test(sId)) {
      tips = '身份证长度或格式错误'
    }
    sId = sId.replace(/x$/i, 'a')
    if (aCity[parseInt(sId.substr(0, 2))] == null) {
      tips = '身份证地区非法'
    }
    let sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2))
    let d = new Date(sBirthday.replace(/-/g, '/'))
    if (sBirthday !== d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()) {
      tips = '身份证上的出生日期非法'
    }
    for (let i = 17; i >= 0; i--) {
      iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
    }
    if (iSum % 11 !== 1) {
      tips = '身份证号非法'
    }
    // aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女");//此次还可以判断出输入的身份证号的人性别
    return tips
  },
  validateAge(rule, value, callback) {
    if (value && value.length) {
      if (!/^[0-9]*$/.test(value)) {
        callback(new Error('请输入正确的年龄'))
        return
      }
      if (value > 100) {
        callback(new Error('请输入正确的年龄'))
      } else if (value < 0) {
        callback(new Error('请输入正确的年龄'))
      }
    } else {
      callback()
    }
    callback()
  },
  // 输入框长度小于16个字符，且必输
  validateStr(rule, value, callback) {
    if (value.trim().length) {
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
        return callback(new Error('不能超过16字符'))
      } else {
        return callback()
      }
    } else {
      return callback(new Error('不能为空'))
    }
  },
  validateMsgReceiver(rule, value, callback) {
    if (value.toString().trim().length) {
      return callback()
    } else {
      return callback(new Error('不能为空'))
    }
  },
  // 输入框长度小于64个字符，且必输
  validateStr64(rule, value, callback) {
    if (value.trim().length) {
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
        return callback(new Error('不能超过64位字符'))
      } else {
        return callback()
      }
    } else {
      return callback(new Error('不能为空'))
    }
  },
  // 输入框长度小于64个字符，可不输入
  validateHasStr64(rule, value, callback) {
    if (value && value.length) {
      let nativecode = value.split('')
      let len = 0
      for (let i = 0; i < nativecode.length; i++) {
        let code = Number(nativecode[i].charCodeAt(0))
        if (code > 127) {
          len += 2
        } else {
          len++
        }
      }
      if (len > 64) {
        return callback(new Error('不能超过64位字符'))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  },
  validateStr512(rule, value, callback) {
    if (value.trim().length) {
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
        return callback(new Error('不能超过512字符'))
      } else {
        return callback()
      }
    } else {
      return callback(new Error('不能为空'))
    }
  },
  // 输入框长度小于16个字符,可不输入
  validateHasStr(rule, value, callback) {
    if (value.trim().length) {
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
        return callback(new Error('不能超过16字符'))
      } else {
        return callback()
      }
    } else {
      return callback()
    }
  },
  createCSVStr(data, _outFields) {
    let textField = '"'
    let content = ''
    let len = 0

    let n = 0

    let comma = ''

    let value = ''
    try {
      Array.forEach(_outFields, function(_field) {
        content = content + comma + _field
        comma = ','
      })

      content = content + '\r\n'
      len = data.length
      n = _outFields.length
      for (let i = 0; i < len; i++) {
        comma = ''
        for (let m = 0; m < n; m++) {
          let _field = _outFields[m]
          value = data[i][_field]
          if (!value && typeof value !== 'number') {
            value = ''
          }
          if (value && /[",\r\n]/g.test(value)) {
            value = textField + value.replace(/(")/g, '""') + textField
          }
          content = content + comma + value
          comma = ','
        }
        content = content + '\r\n'
      }
    } catch (err) {
      console.error(err)
      content = ''
    }

    return content
  },
  exportCsv(obj, flieName) {
    // title ["","",""]
    let title = obj.title
    // titleForKey ["","",""]
    let titleForKey = obj.titleForKey
    let data = obj.data
    let str = []
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      let textField = '"'
      let content = ''
      let len = 0

      let n = 0

      let comma = ''

      let value = ''
      try {
        Array.forEach(title, function(_field) {
          content = content + comma + _field
          comma = ','
        })
        content = content + '\r\n'
        len = data.length
        n = titleForKey.length
        for (let i = 0; i < len; i++) {
          comma = ''
          for (let m = 0; m < n; m++) {
            let _field = titleForKey[m]
            value = data[i][_field]
            if (!value && typeof value !== 'number') {
              value = ''
            }
            if (value && /[",\r\n]/g.test(value)) {
              value = textField + value.replace(/(")/g, '""') + textField
            }
            content = content + comma + value
            comma = ','
          }
          content = content + '\r\n'
        }
      } catch (err) {
        console.error(err)
        content = ''
      }
      let BOM = '\uFEFF'
      let csvData = new Blob([BOM + content], {
        type: 'text/csv'
      })
      navigator.msSaveBlob(csvData, flieName + '.csv')
    } else {
      str.push(obj.title.join(',') + '\n')
      for (let i = 0; i < data.length; i++) {
        let temp = []
        for (let j = 0; j < titleForKey.length; j++) {
          temp.push(data[i][titleForKey[j]])
        }
        str.push(temp.join(',') + '\n')
      }
      let uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(str.join(''))
      let downloadLink = document.createElement('a')
      downloadLink.href = uri
      downloadLink.download = flieName + '.csv'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  },
  exportCsvByArray(obj, flieName) {
    let title = obj.title
    let data = obj.data
    let content = ''
    let len = 0

    let comma = ''
    try {
      Array.forEach(title, function(_field) {
        content = content + comma + _field
        comma = ','
      })
      content = content + '\r\n'
      len = data.length
      for (let i = 0; i < len; i++) {
        console.log(data[i], 241)
        let str = data[i].join(',') + '\n'
        content += str
      }
      console.log(content)
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        let BOM = '\uFEFF'
        let csvData = new Blob([BOM + content], {
          type: 'text/csv'
        })
        navigator.msSaveBlob(csvData, flieName + '.csv')
      } else {
        let uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
        let downloadLink = document.createElement('a')
        downloadLink.href = uri
        downloadLink.download = flieName + '.csv'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    } catch (err) {
      console.error(err)
      content = ''
    }
  },
  uniqueArray(arr) {
    let res = []
    let json = {}
    for (let i = 0; i < arr.length; i++) {
      if (!json[arr[i]]) {
        res.push(arr[i])
        json[arr[i]] = 1
      }
    }
    return res
  },
  isVehicleNumber(vehicleNumber) {
    let result = false
    if (vehicleNumber.length === 7) {
      let express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
      result = express.test(vehicleNumber)
    }
    return result
  },
  getTag(arr = [], getArrPower, getArr = []) {
    if (typeof arr === 'string') {
      getArr = JSON.parse(arr).children[0].children
    } else {
      getArr = arr
    }
    if (getArr.length) {
      getArr.forEach(item => {
        if (item.tag) {
          getArrPower.push(item.tag)
        }
        if (item.children && item.children.length) {
          this.getTag(item.children, getArrPower)
        }
      })
    }
  }
}
