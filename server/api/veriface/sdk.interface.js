/*
 * @Author: chenkaibo
 * @Date: 2018-12-10 11:56:06
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-07 14:32:31
 */
'use strict'
const fs = require('fs')
const req = require('./req.util').req
const path = require('path')
const config = require('../../../config').backend
const VeriGroup = require('mongoose').model('VeriGroup')
const { CONTENT_TYPE } = require('../../common/constant')
const FaceServer = require('mongoose').model('FaceServer')
const URL = require('url').URL
const { tranformPromiseAll } = require('../../common/tools')

const CONSTANT = {
  RESOLVE: 'resolve',
  REJECT: 'reject'
}

/**
 * 添加单个服务器底库
 * @param {String} id  底库id
 * @param {Object} host  服务器主机
 * @param {Number} timeout 请求超时时间
 * @returns {Promise}
 */
const addServerGroup = (id, host, timeout = 5000) => {
  try {
    if (!id || !host) {
      return
    }
    const option = { uri: 'g/' + id + '/', method: 'put', host, timeout }
    return req(option)
  } catch (error) {}
}

/**
 * 添加多个服务器底库
 * @param {String} id  底库id
 * @returns {Object}
 */
const addMultiSvrGroup = async id => {
  try {
    const servers = await FaceServer.find().lean()
    let promiseList = []
    const response = { succsss: [], fail: [] }
    for (let svr of servers) {
      promiseList.push(addServerGroup(id, { ip: svr.ip, port: svr.port }))
    }
    promiseList = tranformPromiseAll(promiseList)
    const result = await Promise.all(promiseList)
    servers.forEach((item, index) => {
      if (result[index].status === CONSTANT.REJECT) {
        response.fail.push(getSyncExceptMesage(item.name, item.message))
      }
    })
    return response
  } catch (error) {}
}

/**
 * 删除单个服务器底库
 * @param {String} id  底库id
 * @param {Object} host  服务器主机
 * @param {Number} timeout 请求超时时间
 * @returns {Promise}
 */
const delServerGroup = (id, host, timeout = 3000) => {
  try {
    if (!id || !host) {
      return
    }
    const option = { uri: 'g/' + id + '/', method: 'delete', host, timeout }
    return req(option)
  } catch (error) {}
}

/**
 * 删除多个服务器底库
 * @param {String} id  底库id
 * @returns {Object}
 */
const delMultiSvrGroup = async id => {
  try {
    const servers = await FaceServer.find().lean()
    let promiseList = []
    const response = { succsss: [], fail: [] }
    for (let svr of servers) {
      promiseList.push(delServerGroup(id, { ip: svr.ip, port: svr.port }))
    }
    promiseList = tranformPromiseAll(promiseList)
    let result = await Promise.all(promiseList)
    servers.forEach((item, index) => {
      if (result[index].status === CONSTANT.REJECT) {
        response.fail.push(getSyncExceptMesage(item.name, result[index].message))
      }
    })
    return response
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 检索单个服务器底库相似图片
 * @param {String} group  底库名称
 * @param {String} imagePath  检索图片的上传路径
 * @param {Object} host 检索服务器ip、port
 * @param {String} target 识别记录检索|图片检索
 * @param {Number} similar 相似度
 * @returns {Promise}
 */
const searchByImgBuffer = async (group, imageName, imageBuffer, host, similar, limit = 1000) => {
  try {
    const type = path.extname(imageName).replace('.', '')

    // const parasms = {
    //   uri: '/search',
    //   files: [
    //     {
    //       field: 'image',
    //       file: imageBuffer,
    //       name: path.basename(imageName)
    //     }
    //   ],
    //   image: [imageBuffer, path.basename(imageName)],
    //   fileds: [
    //     { key: 'analyzes', value: 'true' },
    //     { key: 'corp', value: 'true' },
    //     { key: 'limit', value: limit },
    //     { key: 'group', value: group.join(',') }
    //   ]
    // }
    const option = {
      method: 'post',
      uri: 'search',
      host: host,
      formData: {
        analyze: 'true',
        corp: 'true',
        limit,
        group: group.join(','),
        image: {
          value: imageBuffer,
          options: {
            filename: path.basename(imageName),
            contentType: CONTENT_TYPE[type]
          }
        }
      }
    }
    const result = await req(option)
    return result
    // const result = await loadBanlacer.requestPost(parasms)
    // return result
  } catch (err) {
    console.log('searchByImgBuffer-', err.message)
    return null
  }
}

/**
 * 检索单个服务器底库相似图片
 * @param {String} group  底库名称
 * @param {String} imagePath  检索图片的上传路径
 * @param {Object} host 检索服务器ip、port
 * @param {String} target 识别记录检索|图片检索
 * @param {Number} similar 相似度
 * @returns {Promise}
 */
const searchServerImage = (group, imagePath, host, target, similar) => {
  try {
    const filePath = imagePath.indexOf('/temp/') < 0 ? getFileDiskPath(imagePath, config.fileDirs.facePasserPictureDir) : `${config.fileDirs.tempDir}/${path.basename(imagePath)}`
    const data = fs.readFileSync(filePath)
    const type = path.extname(imagePath).replace('.', '')
    const option = {
      method: 'post',
      uri: 'search',
      host: host,
      formData: {
        threshold: similar,
        limit: 1000,
        group: group,
        image: {
          value: data,
          options: {
            filename: path.basename(imagePath),
            contentType: CONTENT_TYPE[type]
          }
        }
      }
    }
    return req(option)
  } catch (err) {
    throw err
  }
}

/**
 * 检索底库相似图片方法
 * @param {String} group  底库名称
 * @param {String} imagePath  检索图片的上传路径
 * @param {String} target 识别记录检索|图片检索
 * @param {Number} similar 相似度
 * @returns {Object}
 */
const searchMultiSvrImage = async (group, imagePath, target, similar) => {
  try {
    let promiseList = []
    const response = { succsss: [], fail: [] }
    const servers = await FaceServer.find().lean()
    for (let svr of servers) {
      const host = { ip: svr.ip, port: svr.port }
      promiseList.push(searchServerImage(group, imagePath, host, target, similar))
    }
    promiseList = tranformPromiseAll(promiseList)
    const result = await Promise.all(promiseList)
    servers.forEach((item, index) => {
      if (result[index].status === CONSTANT.RESOLVE) {
        result[index].data.host = { ip: item.ip, port: item.port }
        response.succsss.push(result[index].data)
      }
    })
    return response.succsss
  } catch (error) {
    throw error
  }
}

/**
 * 上传图片到底库[图片为buffer]
 * @param {String} imagePath 本地图片id
 * @param {Buffer} imageBuffer 图片buffer
 * @param {String} group 底库名称
 * @param {Object} host 服务器主机
 * @returns {Object}
 */
const uploadImageToSDK = async (imagePath, imageBuffer, group, host) => {
  try {
    const type = path.extname(imagePath).replace('.', '')
    const option = {
      method: 'post',
      formData: {
        group: group,
        tag: imagePath,
        image: {
          value: imageBuffer,
          options: {
            filename: path.basename(imagePath),
            contentType: CONTENT_TYPE[type]
          }
        }
      }
    }
    option.uri = `g/${group}/`
    option.host = host
    const sdkData = await req(option)
    return sdkData
  } catch (error) {
    console.log('uploadImageToSDK-', error.message)
    return {}
  }
}

/**
 * 上传图片到单个服务器底库[图片为路径]
 * @param {String} imagePath  本地图片路径
 * @param {String} group  底库名称
 * @param {Object} host  服务器主机
 * @returns {Promise}
 */
const uploadServerImage = (imagePath, group, host) => {
  try {
    const filePath = `${config.fileDirs.baseDir}${imagePath.split('image').pop()}`
    const data = fs.readFileSync(filePath)
    const type = path.extname(imagePath).replace('.', '')
    const option = {
      uri: `g/${group}/`,
      host: host,
      method: 'post',
      formData: {
        group: group,
        tag: imagePath,
        image: {
          value: data,
          options: {
            filename: path.basename(imagePath),
            contentType: CONTENT_TYPE[type]
          }
        }
      }
    }
    return req(option)
  } catch (error) {
    throw error
  }
}

/**
 * 上传图片到多个服务器底库
 * @param {String} imagePath  本地图片路径
 * @param {String} group  底库名称
 * @returns {Object}
 */
const uploadMultiSvrImage = async (imagePath, group) => {
  try {
    const servers = await FaceServer.find().lean()
    let promiseList = []
    const response = { succsss: [], fail: [] }
    for (let svr of servers) {
      const host = { ip: svr.ip, port: svr.port }
      promiseList.push(uploadServerImage(imagePath, group, host))
    }
    promiseList = tranformPromiseAll(promiseList)
    const result = await Promise.all(promiseList)
    servers.forEach((item, index) => {
      if (result[index].status === CONSTANT.RESOLVE) {
        result[index].data.host = { ip: item.ip, port: item.port }
        response.succsss.push(result[index].data)
      } else {
        response.fail.push(getSyncExceptMesage(item.name, result[index].message))
      }
    })
    return response
  } catch (error) {
    throw error
  }
}

/**
 * 删除底单个服务器库图片
 * @param {String} group  底库名称
 * @param {String} imageId  底库图片Id
 * @param {Object} host 目标主机
 * @returns {Promise}
 */
const removeServerImage = (group, id, host) => {
  try {
    if (!id || !host || !group) {
      return
    }
    const option = { uri: `g/${group}/${id}`, method: 'delete', host }
    return req(option)
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 获取单个服务器库图片
 * @param {String} group  底库名称
 * @param {String} imageId  底库图片Id
 * @param {Object} host 目标主机
 * @returns {Promise}
 */
const getServerImage = (group, id, host) => {
  try {
    if (!id || !host || !group) {
      return
    }
    const option = { uri: `g/${group}/${id}`, method: 'get', host }
    return req(option)
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 删除多个服务器底库图片
 * @param {String} group  底库名称
 * @param {String} imageId  底库图片Id
 * @returns {Object}
 */
const removeMutilSvrImage = async (group, servers) => {
  try {
    let promiseList = []
    const response = { succsss: [], fail: [] }
    for (let svr of servers) {
      promiseList.push(removeServerImage(group, svr.id, svr.host))
    }
    promiseList = tranformPromiseAll(promiseList)
    const result = await Promise.all(promiseList)
    servers.forEach((item, index) => {
      if (result[index].status === CONSTANT.REJECT) {
        response.fail.push(getSyncExceptMesage(item.name, result[index].message))
      }
    })
    return response
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 删除底库图片方法
 * @param {Array} users 删除用户信息
 */
const quickRmvGroupImage = async users => {
  try {
    let promiseList = []
    const response = { fail: [] }
    for (const user of users) {
      for (let server of user.sdkImgInfos) {
        promiseList.push(removeServerImage(user.group, server.id, server.host))
      }
    }
    promiseList = tranformPromiseAll(promiseList)
    const result = await Promise.all(promiseList)
    result.forEach((item, index) => {
      if (item.status === CONSTANT.REJECT) {
        response.fail.push(getSyncExceptMesage(item.name, item.message))
      }
    })
    return response
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 修改用户底库图片
 * @param {Object} user 用户对象信息
 * @returns {Array}
 */
const updateGroupImage = async user => {
  try {
    const [uploadResult, removeResult] = await Promise.all([uploadMultiSvrImage(user.image, user.group), removeMutilSvrImage(user.group, user.sdkImgInfos)])
    user.sdkImgInfos = uploadResult.succsss.map(item => {
      return { id: item.id, host: item.host }
    })
    return { fail: [...uploadResult.fail, ...removeResult.fail] }
  } catch (error) {
    throw error
  }
}

const initVeriFace = async host => {
  const group = [
    {
      name: '路人库',
      type: 'static',
      similar: 0
    },
    {
      name: '黑名单',
      color: 'red',
      alarmAudio: '/static/face/audio/1.mp3',
      type: 'defense'
    }
  ]
  try {
    const docs = await VeriGroup.find({ name: { $in: ['路人库', '黑名单'] } }).lean()
    let promiseList = []
    if (!_.isEmpty(docs)) {
      for (const doc of docs) {
        promiseList.push(addServerGroup(doc._id.toString(), host))
      }
    } else {
      const data = await VeriGroup.create(group)
      for (const doc of data) {
        promiseList.push(addServerGroup(doc._id.toString(), host))
      }
    }
    promiseList = tranformPromiseAll(promiseList)
    await Promise.all(promiseList)
  } catch (error) {
    console.log(error.message)
  }
}

/**
 * 同步失败信息
 * @param {string} name 失败类型名称
 * @param {string} message 失败的原因
 * @returns {string} 失败信息
 */
const getSyncExceptMesage = (name = '', message = '') => {
  return `${name}同步失败，失败原因：${message}`
}
/**
 * 网络地址转换磁盘路径
 * @param {*} filePath
 * @param {*} prefix
 */
const getFileDiskPath = (filePath, prefix) => {
  const lastPath = path.basename(prefix)
  const regex = new RegExp(`.*/${lastPath}`)
  return filePath.replace(regex, prefix)
}
/**
 *  对比两张图片相似度
 * @param {*} host sdk服务器信息
 * @param {*} imagePath1 图片1路径
 * @param {*} imagePath2 图片2路径
 */
const compare = async (host, imagePath1, imagePath2) => {
  try {
    const type1 = path.extname(imagePath1).replace('.', '')
    const type2 = path.extname(imagePath2).replace('.', '')
    const option = {
      method: 'post',
      uri: 'compare',
      host: host,
      formData: {
        image1: {
          value: fs.readFileSync(imagePath1),
          options: {
            filename: path.basename(imagePath1),
            contentType: CONTENT_TYPE[type1]
          }
        },
        image2: {
          value: fs.readFileSync(imagePath2),
          options: {
            filename: path.basename(imagePath2),
            contentType: CONTENT_TYPE[type2]
          }
        }
      }
    }
    const errorResult = -1
    try {
      const result = await req(option)
      // 四舍五入取整数
      const score = result.score ? Math.round(result.score) : errorResult
      return score
    } catch (error) {
      return errorResult
    }
  } catch (error) {
    console.log('人车同检对比两张图片相似度失败', error.message)
  }
}
/**
 * 提取人脸特征值
 * @param {*} host 人脸sdk信息
 * @param {*} buffer 图片buffer
 * @param {*} fileName 图片名称如a.jpg
 */
const extractFaceFeature = async (host, buffer, fileName) => {
  try {
    const type = path.extname(fileName).replace('.', '')
    const option = {
      method: 'post',
      uri: '_extract',
      host: host,
      formData: {
        image: {
          value: buffer,
          options: {
            filename: fileName,
            contentType: CONTENT_TYPE[type]
          }
        },
        crop: 'true'
      }
    }
    const result = ''
    try {
      const result = await req(option)
      // 如果提取成功
      if (result.face) {
        return result.face.crop.image
      } else {
        // 如果提取失败
        return ''
      }
    } catch (error) {
      return result
    }
  } catch (error) {
    console.log('人车同检提取人脸特征值失败', error.message)
  }
}
module.exports = {
  updateGroupImage,
  initVeriFace,
  quickRmvGroupImage,
  uploadServerImage,
  uploadMultiSvrImage,
  uploadImageToSDK,
  delServerGroup,
  addServerGroup,
  addMultiSvrGroup,
  delMultiSvrGroup,
  searchMultiSvrImage,
  removeServerImage,
  removeMutilSvrImage,
  searchByImgBuffer,
  getServerImage,
  compare,
  extractFaceFeature
}
