export default {
  // 端口0-65535
  dePort(rule, value, callback) {
    let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
    if (rule.field !== 'adapterPort') {
      if (value === '') {
        return callback(new Error('不可以为空'))
      }
      if (r.test(value)) {
        if (Number(value) > 65535) {
          return callback(new Error('超过最大值'))
        } else {
          callback()
        }
      } else {
        return callback(new Error('请输入有效数字'))
      }
    } else {
      if (value !== '') {
        if (r.test(value)) {
          if (Number(value) > 65535) {
            return callback(new Error('超过最大值'))
          } else {
            callback()
          }
        } else {
          return callback(new Error('请输入有效数字'))
        }
      } else {
        callback()
      }
    }
  },
  // 0-512
  deIpcount(rule, value, callback) {
    let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
    // if (value === '' || value === null || value === undefined) {
    //   callback()
    // }
    if (r.test(value)) {
      if (Number(value) > 512) {
        return callback(new Error('超过最大值'))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入有效数字'))
    }
  },
  // 0-256
  deDefent(rule, value, callback) {
    let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
    if (value === '' || value === null || value === undefined) {
      callback()
    }
    if (r.test(value)) {
      if (Number(value) > 256) {
        return callback(new Error('超过最大值'))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入有效数字'))
    }
  },
  // 0-64
  deTalkcount(rule, value, callback) {
    // if (['decodecount'].includes(rule.field)) {
    //   if (value === '') {
    //     return callback(new Error('不能为空'))
    //   }
    // }
    let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
    if (value === '' || value === null || value === undefined) {
      callback()
    }
    if (r.test(value)) {
      if (Number(value) > 64) {
        return callback(new Error('超过最大值'))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入有效数字'))
    }
  },
  cport(rule, value, callback) {
    if (value === '') {
      return callback(new Error('不能为空'))
    }
    let r = /(^[1-9]([0-9]*)$|^[1-9]$)/
    if (value === '' || value === null || value === undefined) {
      callback()
    }
    if (r.test(value)) {
      if (Number(value) > 64) {
        return callback(new Error('超过最大值'))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入有效数字'))
    }
  },
  // 不可以输入空格
  noSpace(rule, value, callback) {
    let r = /\s+/g
    if (r.test(value)) {
      return callback(new Error('不可以输入空格！'))
    } else {
      callback()
    }
  },
  // 64位字符
  verifyName(rule, value, callback) {
    if (!value) { return callback(new Error('不可以为空')) }
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
      callback()
    }
  },
  // 128位字符
  verifyResName(rule, value, callback) {
    if (value === '') {
      return callback(new Error('名称不能为空'))
    } else {
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
      if (len > 128) {
        return callback(new Error('不能超过128位字符'))
      } else {
        callback()
      }
    }
  },
  // 最大延时 最小间隔 300-7200  默认300
  maxDelayRule(rule, value, callback) {
    let r = /(^[1-9]([0-9]*)$|^[0-9]$)/
    if (value === '') {
      return callback(new Error('不能为空'))
    }
    if (r.test(value)) {
      if (Number(value) > 7200) {
        return callback(new Error('最大值7200'))
      } else if (Number(value) < 0) {
        return callback(new Error('最小值0'))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入有效数字'))
    }
  },
  alarmTesponseTime(rule, value, callback) {
    if (value === '' || value === undefined) {
      return callback(new Error('不能为空'))
    }
    if (!isNaN(Number(value))) {
      if (Number(value) > 300) {
        return callback(new Error('最大值300'))
      } else if (Number(value) < 0) {
        return callback(new Error('最小值0'))
      } else {
        callback()
      }
    } else {
      return callback(new Error('请输入0-300'))
    }
  },
  // IP地址不能为空
  IpNoEmpty(rule, value, callback) {
    if (value === '0.0.0.0') {
      return callback(new Error('请输入合法的IP地址'))
    } else {
      callback()
    }
  }
}
