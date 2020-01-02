/*
 * @Author: hansen.liuhao
 * @Date: 2019-01-25 10:22:34
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-18 18:59:17
 */
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const Version = mongoose.model(
  'Version',
  new mongoose.Schema(
    {
      version: String
    },
    { timestamps: true }
  )
)

/**
 * 数据模型变动，升级数据库数据
 */
const databaseUpgrade = async () => {
  let doc = await Version.findOne().lean()
  if (!doc) {
    doc = await Version.create({ version: '1.0.0' })
  }
  let version = `version-${doc.version}`
  let flag = false
  try {
    const upgradeDirectory = path.resolve(__dirname, './')
    const files = fs.readdirSync(upgradeDirectory)
    const upgradeDir = files.filter(fileName => {
      const stat = fs.statSync(path.resolve(upgradeDirectory, `./${fileName}`))
      if (stat.isDirectory && fileName > version) {
        return fileName
      }
    })
    for (const dirName of upgradeDir) {
      if (flag) {
        break
      }
      const files = fs.readdirSync(`${upgradeDirectory}/${dirName}`)
      for (const file of files) {
        const { upgrade } = require(path.resolve(`${upgradeDirectory}/${dirName}/${file}`))
        try {
          await upgrade()
        } catch (err) {
          flag = true
          break
        }
      }
      if (!flag) {
        version = dirName.split('-').pop()
      }
    }
    await Version.updateOne({}, { version: version.split('-').pop() })
  } catch (error) {
    await Version.updateOne({}, { version })
    console.log('data upgrade cause error, message ', error.message)
    process.exit(1)
  }
}
module.exports.databaseUpgrade = databaseUpgrade
