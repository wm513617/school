/*
 * @Author: zhangminbo
 * @Date: 2018-06-5 18:33:43
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-15 14:39:28
 */
'use strict'
const MongoClient = require('mongodb').MongoClient
const GridFSBucket = require('mongodb').GridFSBucket
const GridStore = require('mongodb').GridStore
const ObjectID = require('mongodb').ObjectID
const Sysparamters = require('mongoose').model('Sysparamters')
const fs = require('fs')
const path = require('path')

const config = require('../../config')

// const DB_CONN_STR = 'mongodb://bstar:4$7-2T&=Me*9w!$X@192.168.22.147/bs-security'
const DB_CONN_STR = config.backend.mongo.uri
const userName = process.env.mongoUserName
const password = Buffer.from(process.env.mongoPassword, 'base64').toString()
const DB_CONN_STR_AUTH =
  config.backend.mongo.uri.substring(0, 10) + userName + ':' + password + '@' + config.backend.mongo.uri.substring(10)

const getDbInstance = () => {
  if (global.DB) {
    return global.DB
  } else {
    global.DB = new Promise((resolve, reject) => {
      MongoClient.connect(
        DB_CONN_STR_AUTH,
        {
          useNewUrlParser: true,
          poolSize: 10,
          autoReconnect: true
        },
        (err, client) => {
          if (err) {
            MongoClient.connect(
              DB_CONN_STR,
              {
                useNewUrlParser: true,
                poolSize: 10,
                autoReconnect: true
              },
              (err, client) => {
                if (err) {
                  console.log('err:%o', err)
                  reject(new Error({ code: 4200, message: '连接失败' }))
                } else {
                  resolve(client.db(client.databaseName))
                }
              }
            )
          } else {
            resolve(client.db(client.databaseName))
          }
        }
      )
    })
    return global.DB
  }
}

const getWriteBucketName = async type => {
  if (!global.createFileConnectTime) {
    // 服务器重启全局变量失效
    global.createFileConnectTime = (await Sysparamters.findOne().exec()).creatdbtime
  }
  if (type) {
    return { prefix: type, name: type }
  } else {
    const prefix = 'file'
    return { prefix: prefix, name: prefix + global.createFileConnectTime }
  }
}

const getReadBucketName = async (db, id) => {
  const timestamp = parseInt(id.substring(0, 8), 16)
  const prefix = (await getWriteBucketName()).prefix
  const connections = await db.collections()
  const connectNames = []
  connections.forEach(n => {
    if (n.collectionName.endsWith('.files')) {
      const nameStr = n.collectionName.match(/\d{10}/)
      if (nameStr) {
        connectNames.push(nameStr[0])
      }
    }
  })
  return (
    prefix +
    connectNames
      .sort()
      .reverse()
      .find(n => n < timestamp)
  )
}

// **************************************** GridFSBucket operations************************************** */

// 上传本地文件
async function uploadFileToGFS (filepath, fileName, ctx) {
  fileName = fileName || path.basename(filepath) // 上传到临时文件目录时，文件名时乱码也没有后缀名，这里fileName取原始名称
  const db = await getDbInstance()
  const bucket = (await getWriteBucketName(ctx.query.type)).name
  return new Promise((resolve, reject) => {
    try {
      const fsBucket = new GridFSBucket(db, { bucketName: bucket })
      const readStream = fs.createReadStream(filepath)
      const uploadStream = fsBucket.openUploadStream(fileName, {
        metadata: {
          user: ctx.state.user || {},
          type: ctx.query.tag
        }
      })
      const fileId = uploadStream.id
      readStream.pipe(uploadStream)
      uploadStream.once('finish', () => {
        resolve({
          id: fileId,
          name: fileName
        })
      })
    } catch (err) {
      reject(new Error({ code: 4200, message: '上传失败' }))
    }
  })
}

/**
 * base64格式图片上传
 * @param {String} base64Str  base64字符串数据
 * @param {String} fileName  文件名
 * @param {Object} options 配置
 */
async function uploadFileToGFSWithBase64 (base64Str, fileName, options = {}) {
  GridStore.DEFAULT_ROOT_COLLECTION = options.bucketName || (await getWriteBucketName()).name // 定义connection名称
  const fileId = new ObjectID() // 创建id
  fileName = fileName || fileId + '.jpg'
  // 目前所有的base64都没有'data:image'为了提高效率 这里暂时注释掉
  // base64Str = base64Str.replace(/^data:image\/\w+;base64,/, '') // 去掉图片base64码前面部分data:image/png;base64
  const buf = Buffer.from(base64Str, 'base64')
  const db = await getDbInstance()
  try {
    let gridStore = new GridStore(db, fileId, fileName, 'w', options) // 创建新的文件
    gridStore = await gridStore.open() // 打开文件
    await gridStore.write(buf, true) // 写入文件完成之后自动关闭store
    return { id: fileId, fileName: fileName }
  } catch (error) {
    return { code: 4200, message: error.message }
  }
}

// uploadFileToGFS(path.join(__dirname, '/local.txt'), 'test1').then((fileName)=>{
//   console.log('上传成功', fileName)
// }).catch(err => {
//   console.log('上传失败', err)
// })

// 根据文件id删除文件
async function deleteFileByIdFromGFS (query) {
  const db = await getDbInstance()
  const bucket = query.type ? query.type : await getReadBucketName(db, query.id)
  return new Promise((resolve, reject) => {
    try {
      const fsBucket = new GridFSBucket(db, { bucketName: bucket })
      fsBucket.delete(ObjectID(query.id), err => {
        err ? reject(err) : resolve()
      })
    } catch (err) {
      reject(new Error({ code: 4200, message: err.message }))
    }
  })
}

// deleteFileByIdFromGFS(ObjectID('5934fa21dddb131e283b3061'), 'test1').then((res) => {
//   console.log('删除成功')
// }).catch(err => {
//   console.error('删除失败', err.message)
// })

// 根据文件id下载文件
async function downloadFileByIdFromGFS (fileId, savedPath) {
  const db = await getDbInstance()
  const bucket = await getReadBucketName(db, fileId)
  return new Promise((resolve, reject) => {
    try {
      const fsBucket = new GridFSBucket(db, { bucketName: bucket })
      const downloadStream = fsBucket.openDownloadStream(fileId)
      const writeStream = fs.createWriteStream(path.normalize(savedPath))
      downloadStream.pipe(writeStream).on('finish', () => {
        resolve()
      })
    } catch (err) {
      reject(new Error({ code: 4200, message: err.message }))
    }
  })
}

// downloadFileByIdFromGFS(ObjectID('5934f848215a5f10d083b30a'), './file1.txt', 'test1').then(() => {
//   console.log('下载成功')
// }).catch(err => {
//   console.error('下载失败', err)
// })

async function readFileByIdFromGFS (query) {
  const db = await getDbInstance()
  const bucketname = query.type ? query.type : await getReadBucketName(db, query.id)
  return new Promise((resolve, reject) => {
    try {
      const bucket = new GridFSBucket(db, { bucketName: bucketname })
      const readstream = bucket.openDownloadStream(ObjectID(query.id))
      resolve(readstream)
    } catch (err) {
      reject(new Error({ code: 4200, message: err.message }))
    }
  })
}

// 根据文件名下载文件
async function downloadFileByNameFromGFS (fileName, savedPath) {
  const db = await getDbInstance()
  const bucket = (await getWriteBucketName()).name
  return new Promise((resolve, reject) => {
    try {
      const fsBucket = new GridFSBucket(db, { bucketName: bucket })
      const downloadStream = fsBucket.openDownloadStreamByName(fileName)
      const writeStream = fs.createWriteStream(path.normalize(savedPath))
      downloadStream.pipe(writeStream).on('finish', () => {
        resolve()
      })
    } catch (err) {
      reject(new Error({ code: 4200, message: err.message }))
    }
  })
}

// downloadFileByNameFromGFS('878.txt', './878.txt', 'test1').then(() => {
//   console.log('下载成功')
// }).catch(err => {
//   console.error('下载失败', err)
// })

// 文件重命名
async function renameFileByIdFromGFS (fileId, newName) {
  const db = await getDbInstance()
  const bucket = await getReadBucketName(db, fileId)
  return new Promise((resolve, reject) => {
    try {
      const fsBucket = new GridFSBucket(db, { bucketName: bucket })
      fsBucket.rename(fileId, newName, err => {
        err ? reject(err) : resolve()
      })
    } catch (err) {
      reject(new Error({ code: 4200, message: err.message }))
    }
  })
}

// renameFileByIdFromGFS(ObjectID('5934f848215a5f10d083b30a'), 'file-local.txt', 'test1').then(() => {
//   console.log('改名成功')
// }).catch(err => {
//   console.error('改名失败', err)
// })

// 获取文件详细信息 by id
async function getFileInfoByIdFromGFS (query) {
  const db = await getDbInstance()
  const bucket = query.type ? query.type : await getReadBucketName(db, query.id)
  const FILES_COLL = `${bucket}.files`
  try {
    const filesQuery = db.collection(FILES_COLL).find({ _id: ObjectID(query.id) })
    const results = await filesQuery.toArray()
    return results
  } catch (err) {
    return { code: 4200, message: err.message }
  }
}

// 获取文件详细信息 by name
async function getFileInfoByNameFromGFS (fileName) {
  const db = await getDbInstance()
  const bucket = (await getWriteBucketName()).name
  const FILES_COLL = `${bucket}.files`
  try {
    const filesQuery = db.collection(FILES_COLL).find({ filename: fileName })
    const results = await filesQuery.toArray()
    return results
  } catch (err) {
    return { code: 4200, message: err.message }
  }
}

// 获取文件详细信息 by type
async function getFileInfoByTagFromGFS (tag, type) {
  const db = await getDbInstance()
  const bucket = type || (await getWriteBucketName()).name
  const FILES_COLL = `${bucket}.files`
  try {
    const filesQuery = db.collection(FILES_COLL).find({ 'metadata.type': tag })
    const results = await filesQuery.toArray()
    return results
  } catch (err) {
    return { code: 4200, message: err.message }
  }
}

// **************************************** GridFSBucket operations************************************** */

// **************************************** GridStore operations************************************** */

// 判断文件是否存在
async function isFileExistInGFS (fileName) {
  const db = await getDbInstance()
  const bucket = (await getWriteBucketName()).name
  try {
    const isExist = await GridStore.exist(db, fileName, bucket)
    console.log(`file is exist: ${isExist}`)
    return isExist
  } catch (err) {
    return { code: 4200, message: err.message }
  }
}

// isFileExistInGFS('file-local.txt', 'test')

// 写入string or buffer数据
async function writeDataToGFS (strOrBuffer, fileId = new ObjectID(), fileName = new Date().getTime() + '.txt') {
  const db = await getDbInstance()
  const bucket = (await getWriteBucketName()).name
  // Open a new file
  const gridStore = new GridStore(db, fileId, fileName, 'w', {
    root: bucket
  })
  try {
    await gridStore.open()
    await gridStore.write(strOrBuffer)
    await gridStore.close() // saves this file to database
  } catch (err) {
    return { code: 4200, message: err.message }
  }
}

/**
 * 根据id获取文件buffer数据
 * @param {String} fileId 文件ID 或者 选择指定数据库(对象)
 * @param {String} bucketName bucketName
 */
async function getFileBufferById (fileId) {
  let bucketName = ''
  const db = await getDbInstance()
  if (typeof fileId === 'object') {
    bucketName = fileId.type
    fileId = fileId.id
  } else {
    bucketName = await getReadBucketName(db, fileId)
  }
  // const bucketName = await getReadBucketName(db, fileId)
  const fsBucket = new GridFSBucket(db, { bucketName: bucketName })
  return new Promise((resolve, reject) => {
    try {
      const downloadStream = fsBucket.openDownloadStream(ObjectID(fileId))
      const buffers = []
      downloadStream.on('data', chunk => {
        buffers.push(chunk)
      })
      downloadStream.on('end', () => {
        resolve(Buffer.concat(buffers))
      })
    } catch (error) {
      reject(new Error({ code: 4200, message: error.message }))
    }
  })
}

// writeDataToGFS(Buffer.from('hello world!22222222222'), 'test1')

// **************************************** GridStore operations************************************** */

exports.uploadFileToGFS = uploadFileToGFS // 上传文件
exports.deleteFileByIdFromGFS = deleteFileByIdFromGFS // 删除文件
exports.downloadFileByIdFromGFS = downloadFileByIdFromGFS // 根据文件id下载文件
exports.downloadFileByNameFromGFS = downloadFileByNameFromGFS // 根据文件名称下载文件
exports.renameFileByIdFromGFS = renameFileByIdFromGFS // 重命名文件
exports.isFileExistInGFS = isFileExistInGFS // 判断文件是否已经已经存在
exports.writeDataToGFS = writeDataToGFS // 写入buffer或者string
exports.getFileInfoByIdFromGFS = getFileInfoByIdFromGFS // 获取文件信息(根据文件id)
exports.getFileInfoByNameFromGFS = getFileInfoByNameFromGFS // 获取文件信息(根据文件名称)
exports.readFileByIdFromGFS = readFileByIdFromGFS
exports.getFileInfoByTagFromGFS = getFileInfoByTagFromGFS // 根据文件类型查询文件
exports.uploadFileToGFSWithBase64 = uploadFileToGFSWithBase64 // 保存base64格式的文件
exports.getFileBufferById = getFileBufferById
