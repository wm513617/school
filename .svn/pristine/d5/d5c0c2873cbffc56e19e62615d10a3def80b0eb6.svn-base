const JSZip = require('jszip')
const zip = new JSZip()
const fs = require('fs')
const config = require('../../../../config').backend
process.on('message', (user) => {
  // console.log(user, 'process.pid', process.pid) // 子进程id
  user.forEach((item) => {
    if (item.image) {
      let data = {
        name: item.name,
        sex: item.sex || 'null',
        card: item.card || 'null',
        uid: item.uid
      }
      let arr = item.image.split('/')
      let url = arr[arr.length - 1]
      let file = url.split('.')
      let fileType = file[file.length - 1] // 获取文件类型
      if (fs.existsSync(`${config.fileDirs.peopleDir}/${url}`)) { // 检查目录是否存在
        zip.file(`${data.name}_${data.sex}_${data.card}_${data.uid}.${fileType}`, fs.readFileSync(`${config.fileDirs.peopleDir}/${url}`), {base64: true})
      }
    }
  })
  zip.generateAsync({
    type: 'nodebuffer',
    // 压缩算法
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  }).then((content) => {
    let timeMS = new Date().getTime()
    let fileName = `${timeMS}.zip`
    fs.writeFile(`${config.fileDirs.peopleDir}/${fileName}`, content, function (err) { // 将zip文件写入磁盘
      if (err) {
        // fs.unlinkSync(`${config.fileDirs.peopleDir}/${fileName}`)
        console.log('压缩失败', err)
      } else {
        process.send(fileName)
      }
    })
  })
  // 如果Node.js进程是通过进程间通信产生的，那么，process.send()方法可以用来给父进程发送消息
})
