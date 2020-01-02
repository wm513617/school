const gfs = require('./gridfs.util')
const config = require('../../config')
const imageSize = require('image-size')
const { mkdirsSync } = require('./tools')
module.exports.measure = async id => {
  const stream = await gfs.readFileByIdFromGFS({ id: id })
  const fileInfo = await gfs.getFileInfoByIdFromGFS({ id: id })
  const result = fileInfo[0].filename.split('.')
  const type = result[result.length - 1]
  const dir = config.backend.fileDirs.tempDir
  mkdirsSync(dir)
  const filePath = path.join(
    dir,
    Math.random()
      .toString(36)
      .replace('.', '') +
      '.' +
      type
  )
  // 根据图片2进制流生成图片
  await new Promise((resolve, reject) => {
    const flow = stream.pipe(fs.createWriteStream(filePath))
    flow.on('finish', () => {
      resolve()
    })
  })
  const size = imageSize(filePath)
  fs.unlink(filePath, err => {
    if (err) {
      console.log(err)
    }
  })
  return size
}
