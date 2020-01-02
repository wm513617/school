// models loading

const fs = require('fs')
const path = require('path')

const modelsPath = path.join(__dirname, '/../api') // 模型所在路径
// 路径加载函数，加载各model模型，这样直接使用mongoose.model("xxx")获取model，不必担心model路径的变化
let newPath
let stat
var count = 0
const walk = function (path) {
  fs.readdirSync(path)
    .forEach(function (file) {
      newPath = path + '/' + file
      stat = fs.statSync(newPath)
      // 如果是文件
      if (stat.isFile()) {
        if (/^(.*)model\.(js|coffee)$/.test(file)) {
          require(newPath)
          count++
        }
        // 如果是文件夹则继续遍历
      } else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(modelsPath) // 加载模型所在路径

console.log(`---------------- 总计model数：${count} ----------------`)
