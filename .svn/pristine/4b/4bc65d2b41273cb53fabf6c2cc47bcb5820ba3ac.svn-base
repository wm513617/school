const fs = require('fs')
const gfs = require('../common/gridfs.util')
const path = require('path')
gfs.getFileInfoByTagFromGFS('audio', 'sys').then(data => {
  if (!data.length) {
    const filePath = path.join(__dirname, '../public/alarmAudio/')
    const audioList = fs.readdirSync(filePath)
    const promiseList = []
    audioList.forEach(n => {
      promiseList.push(gfs.uploadFileToGFS(filePath + n, n, { query: { tag: 'audio', type: 'sys' }, state: {} }))
    })
    Promise.all(promiseList)
      .then(() => {
        console.log('alarmAudio init finished')
      })
      .catch(err => {
        console.log('alarmAudio init Error:' + err)
      })
  }
})
