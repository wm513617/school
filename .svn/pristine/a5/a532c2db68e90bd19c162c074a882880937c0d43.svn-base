
require('../api/map/storey/storey.model')
require('../api/sys/setting/sysparamters.model')
const mongoose = require('mongoose')
mongoose.connect('mongodb://192.168.20.51/bs-security')
const gfs = require('../common/gridfs.util')
const { mkdirsSync } = require('../common/tools')
const config = require('../../config').backend
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const Storey = mongoose.model('Storey')
const imageSize = require('image-size')
async function addPicSize () {
  try {
    const storeys = await Storey.find({}).exec()
    for (var storey of storeys) {
      if (!_.isEmpty(storey._doc.picture.size)) {
        const picId = storey.picture.id
        const stream = await gfs.readFileByIdFromGFS({ id: picId })
        const fileInfo = await gfs.getFileInfoByIdFromGFS({ id: picId })
        const result = fileInfo[0].filename.split('.')
        const type = result[result.length - 1]
        const dir = config.backend.fileDirs.tempDir
        mkdirsSync(dir)
        const filePath = path.join(dir, Math.random().toString(36).replace('.', '') + '.' + type)
        // 根据图片2进制流生成图片
        await new Promise((resolve, reject) => {
          const flow = stream.pipe(fs.createWriteStream(filePath))
          flow.on('finish', () => {
            resolve()
          })
        })
        const picSize = imageSize(fs.readFileSync(filePath))
        storey.picture.size = picSize
        storey.save()
      }
    }
  } catch (error) {
    console.log(error)
  }
}
addPicSize().then(() => { process.exit(1) }).catch()
