'use strict'
/**
 * auther chenkaibo
 * 数据迁移
 */
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
async function addPointName () {
  mongoose.connect('mongodb://127.0.0.1/backups', {
    db: {
      safe: true
    },
    poolSize: 20
  }) // 连接数据库
  const connection = mongoose.createConnection('mongodb://127.0.0.1/backups')
  connection.dropCollection('actions').then(() => {
    connection.dropCollection('alarmtypes').then(() => {
      connection.dropCollection('alarmlevels').then(() => {
        connection.close().then()
      })
    })
  })
  // 删除action表,alarmtype表
  const Resource = mongoose.model('Resource')
  const resources = await Resource.find({ point: { $exists: true }, 'point.name': { $in: [null] } }).exec()
  await Promise.all(resources.map(res => {
    res.point.name = res.name
    return res.save()
  }))
  await mongoose.disconnect()
}
const jsonData = {}
function loadModel () {
  const modelsPath = path.join(__dirname, '/../api') // 模型所在路径
  // 路径加载函数，加载各model模型，这样直接使用mongoose.model("xxx")获取model，不必担心model路径的变化
  let newPath
  let stat
  const walk = function (path) {
    fs.readdirSync(path)
      .forEach(function (file) {
        newPath = path + '/' + file
        stat = fs.statSync(newPath)
        // 如果是文件
        if (stat.isFile() && !/^(log|operate|system|userlogin)\.model\.(js|coffee)$/.test(file)) {
          if (/^(.*)model\.(js|coffee)$/.test(file)) {
            console.log(`load model ${file}`)
            require(newPath)
          }
          // 如果是文件夹则继续遍历
        } else if (stat.isDirectory()) {
          walk(newPath)
        }
      })
  }
  walk(modelsPath) // 加载模型所在路径
  console.log('load model finished!')
}
// 创建json文件
async function dataExportToJsonFile () {
  try {
    mongoose.connect('mongodb://127.0.0.1/backups', {
      db: {
        safe: true
      },
      poolSize: 20
    }) // 连接数据库
    const modelNames = mongoose.modelNames()
    for (var modelName of modelNames) {
      const model = mongoose.model(modelName)
      let datas
      try {
        datas = await model.find({}).exec()
      } catch (error) {
        console.log(error)
      }
      if (datas && datas.length) {
        datas = datas.map(data => {
          const dataObj = data.toObject()
          delete dataObj['__v']
          return dataObj
        })
        jsonData[modelName] = datas
      }
    }
    await mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
}
async function dataImportFromJsonFile () {
  try {
    const start = new Date().getTime()
    mongoose.connect('mongodb://127.0.0.1/bs-security', {
      db: {
        safe: true
      },
      poolSize: 20
    }) // 连接数据库
    const modelNames = mongoose.modelNames()
    // const promiseArr = modelNames.map(modelName => {
    //   const model = mongoose.model(modelName)
    //   const modelData = jsonData[modelName]
    //   if (modelData && modelData.length) {
    //     try {
    //       console.log(`insert ${JSON.stringify(jsonData[modelName])} to ${modelName}!`)
    //       return model.insertMany(jsonData[modelName])
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }
    // }).filter(item => item !== undefined)
    for (var modelName of modelNames) {
      const model = mongoose.model(modelName)
      const modelData = jsonData[modelName]
      if (modelData && modelData.length) {
        try {
          console.log(`insert ${JSON.stringify(jsonData[modelName])} to ${modelName}!`)
          await model.insertMany(jsonData[modelName])
        } catch (error) {
          console.log(error)
        }
      }
    }
    // try {
    //   await Promise.all(promiseArr)
    // } catch (error) {
    //   console.log(error)
    // }
    const end = new Date().getTime()
    console.log(end - start, '-------------time')
    await mongoose.disconnect()
  } catch (error) {
    console.log(error)
  }
}
async function exec () {
  try {
    loadModel()
    await addPointName()
    console.log('edit data finished!')
    await dataExportToJsonFile()
    console.log('export data from backups finished!')
    await dataImportFromJsonFile()
    console.log('import data to bs-security finished!')
  } catch (error) {
    console.log(error)
  }
}
exec()
