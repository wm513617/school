/**
 * 解析维护人员的配置文件，把配置信息挂载到系统中
 */
const fs = require('fs')
const regx = {
  section: /^\s*\[\s*([\w]*)\s*\]\s*$/,
  param: /^\s*([\w-]+)=\s*(.*)\s*$/
}
exports.parse = path => {
  const result = {}
  var content
  try {
    content = fs.readFileSync(path, 'utf-8')
  } catch (e) {
    console.log('fs.readFileSync exception:' + e)
    return {}
  }
  const lines = content.split(/\n\r|\n|\r/)
  lines.forEach(item => {
    if (regx.param.test(item)) {
      const param = item.match(regx.param)
      result[param[1]] = param[2]
    }
  })
  return result
}
