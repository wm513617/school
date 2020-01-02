/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:55
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-05 10:22:00
 */
'use strict'

const mongoose = require('mongoose')
const VeriUser = mongoose.model('VeriUser')
const JSZip = require('jszip')
const config = require('../../../../config').backend
const { handleSysException } = require('../../../common/tools')
const paging = require('../../paging')
const sdkInterface = require('../sdk.interface')
const regex = require('../../regex')
const path = require('path')
const fs = require('fs')
const postal = require('postal')

exports.index = async ctx => {
  const search = ctx.query.search // defenseStatus 布控状态
  search.group = ctx.params.group
  if (search.defenseStatus === '0' || !search.defenseStatus) {
    delete search.defenseStatus
  }
  try {
    if (search.name || search.remark) {
      if (search.name) {
        search.name = new RegExp(decodeURIComponent(search.name))
      }
      if (search.remark) {
        search.remark = new RegExp(decodeURIComponent(search.remark))
      }
      delete search.image
    } else if (search.image) {
      const searchData = await sdkInterface.searchGroupImage(search.group, search.image)
      if (searchData.length) {
        // 服务器有多个这里取值第一个
        const photos = searchData[0].groups[0].photos
        const ids = []
        photos.forEach(n => {
          n.score > (search.similar || 50) && ids.push(n.tag)
        })
        search.image = {
          $in: ids
        }
      }
      delete search.name
      delete search.remark
    }
    delete search.similar
    const results = await paging.listQuery(
      VeriUser,
      search,
      '',
      {
        _id: 1
      },
      ctx.query.page,
      '',
      ctx
    )
    ctx.body = results.results
  } catch (error) {
    handleSysException(error)
  }
}

exports.userInfo = async ctx => {
  const id = ctx.params.id
  try {
    const user = await VeriUser.findById(id).exec()
    ctx.body = user
  } catch (error) {
    handleSysException(error)
  }
}

exports.add = async ctx => {
  let postData = ctx.request.body
  const group = ctx.request.body.group
  try {
    if (postData.code) {
      const isExist = await VeriUser.countDocuments({ code: postData.code }).exec()
      if (isExist) {
        ctx.throw(500, { code: 0, message: '身份证号不能相同' })
      }
    }
    const isUploadImage = postData.image.indexOf('face/user') > 0
    if (!isUploadImage) {
      const src = path.resolve(`${config.fileDirs.baseDir}${postData.image.split('image').pop()}`)
      const dest = path.resolve(`${config.fileDirs.faceUserPictureDir}/${postData.image.split('/').pop()}`)
      const readStream = fs.createReadStream(src)
      const writeStream = fs.createWriteStream(dest)
      readStream.pipe(writeStream)
      await new Promise((resolve, reject) => {
        writeStream
          .on('close', () => {
            resolve()
          })
          .on('error', () => {
            reject(new Error('找不到图片'))
          })
      })
      postData.image = `/image/face/user/${dest.split(path.sep).pop()}`
    }
    const result = await sdkInterface.uploadMultiSvrImage(postData.image, group)
    if (result.fail.length) {
      ctx.throw(500, { code: 0, message: 'sdk服务器同步失败' })
    }
    postData.sdkImgInfos = []
    if (result.succsss.length) {
      result.succsss.forEach(item => {
        postData.sdkImgInfos.push({
          id: item.id,
          host: item.host
        })
      })
    }
    const doc = await VeriUser.create(postData)
    ctx.status = 201
    ctx.headers['location'] = ctx.url + '/' + doc._id.toString()
    result._id = doc._id.toString()
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

exports.delBat = async ctx => {
  const ids = ctx.request.body.ids
  try {
    const results = await removeUserDoc(ids)
    postal.publish({ topic: 'user:delete', channel: 'veriface', data: ids })
    ctx.body = results
  } catch (error) {
    handleSysException(error)
  }
}

const removeUserDoc = async ids => {
  try {
    const users = await VeriUser.find({ _id: { $in: ids } }, 'image sdkImgInfos group').lean()
    const results = await sdkInterface.quickRmvGroupImage(users)
    const userImages = users.map(item => item.image)
    await VeriUser.deleteMany({ _id: { $in: ids } })
    // 删除用户图片
    userImages.forEach(img => {
      fs.unlink(`${config.fileDirs.faceUserPictureDir}/${path.basename(img)}`, err => {
        if (err) {
          console.log(err.message)
        }
      })
    })
    return results
  } catch (error) {
    handleSysException(error)
  }
}

exports.update = async ctx => {
  let user = ctx.request.body
  const id = ctx.params.id
  try {
    let result
    const [isExist, staleUser] = await Promise.all([VeriUser.countDocuments({ code: user.code, _id: { $ne: id } }).lean(), VeriUser.findById(id).lean()])
    if (user.code && isExist) {
      ctx.throw(500, { code: 0, message: '身份证号已经存在' })
    }
    if (staleUser.image !== user.image) {
      user.sdkImgInfos = staleUser.sdkImgInfos
      result = await sdkInterface.updateGroupImage(user) // 更新地库图片
      fs.unlink(`${config.fileDirs.faceUserPictureDir}/${path.basename(staleUser.image)}`, err => {
        if (err) {
          console.log(err.message)
        }
      })
    }
    await VeriUser.findByIdAndUpdate(id, user)
    postal.publish({ topic: 'user:update', channel: 'veriface', data: user })
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 批量导如
 * @param {*} ctx
 */
exports.batImg = async ctx => {
  try {
    const postData = ctx.request.body
    const otherParams = postData.fields.discernType.split(',')
    const userInfo = postData.files.file.origin.split('.')[0].split('_')
    if (userInfo.length !== 4) {
      ctx.throw(500, { code: 0, message: '图片名称有误' })
    }
    if (userInfo[2] && userInfo[2] !== 'null' && otherParams.includes('code')) {
      // if (!regex.idcode.test(userInfo[2])) {
      //   ctx.throw(500, { code: 0, message: '身份证号码有误' })
      // }
      const isExist = await VeriUser.countDocuments({ code: userInfo[2] }).exec()
      if (isExist) {
        ctx.throw(500, { code: 0, message: '身份证号不能相同' })
      }
    }
    const imagePath = `/image/face/user/${postData.files.file.name}`
    const groupImg = await sdkInterface.uploadMultiSvrImage(imagePath, postData.fields.group)
    const userObj = {
      name: userInfo[0],
      image: imagePath,
      group: postData.fields.group,
      sdkImgInfos: groupImg.succsss.map(item => {
        return { id: item.id, host: item.host }
      })
    }

    if (userInfo[1] && userInfo[1] !== 'null' && otherParams.includes('gender')) {
      userObj.gender = userInfo[1] === '女' ? 1 : 2
    }
    if (userInfo[2] && userInfo[2] !== 'null' && otherParams.includes('code')) {
      userObj.code = userInfo[2]
    }
    if (userInfo[3] && userInfo[3] !== 'null' && otherParams.includes('remark')) {
      userObj.remark = userInfo[3]
    }
    await VeriUser.create(userObj)
    ctx.status = 200
    ctx.body = groupImg
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 导出数据
 * @param {*} ctx
 */

exports.exportData = async ctx => {
  try {
    const ids = ctx.query.ids ? decodeURIComponent(ctx.query.ids).split(',') : []
    const userDatas = await VeriUser.find({
      _id: {
        $in: ids
      }
    })
      .lean()
      .exec()
    const zip = new JSZip()
    const zipFolder = zip.folder(`底库人员_${new Date().toLocaleDateString()}`)
    for (let fileObj of userDatas) {
      if (fileObj['image']) {
        const bufferdata = fs.readFileSync(`${config.fileDirs.baseDir}${fileObj.image.split('image').pop()}`)
        zipFolder.file(`${fileObj.name}_${fileObj.gender === '1' ? '女' : fileObj.gender === '2' ? '男' : 'null'}_${fileObj.code || 'null'}_${fileObj.remark || 'null'}.jpg`, bufferdata, {
          base64: false
        })
      }
    }
    ctx.type = 'application/x-zip-compressed'
    ctx.attachment(`底库人员_${new Date().toLocaleDateString()}.zip`)
    ctx.body = await zip.generateAsync({
      type: 'nodebuffer'
    })
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 根据布控时间修改布控状态
 * @param {*} data 用户数据
 */
const updateDefenseStatus = data => {
  if (data.defenseStatus === '4') {
    return data
  }
  const now = Math.ceil(new Date().getTime() / 1000)
  if (!data.startTime || now < data.startTime) {
    data.defenseStatus = '1'
  } else if (data.startTime < now && now < data.endTime) {
    data.defenseStatus = '2'
  } else {
    data.defenseStatus = '3'
  }
  return data
}

/**
 * 更新用户状态（用于定时修改用户状态）
 */
exports.updateSDKUserState = async () => {
  const users = await VeriUser.find({ endTime: { $exists: true }, defenseStatus: { $in: ['1', '2'] } }).exec()
  const datas = []
  users.map(x => x.defenseStatus !== updateDefenseStatus(x).defenseStatus && datas.push(x))
  VeriUser.create(datas)
}

// 人员通行添加到底库人员发生信息同步变更
postal.subscribe({
  topic: 'user:update',
  channel: 'through',
  callback: async function (data) {
    try {
      await VeriUser.findByIdAndUpdate(data._id, data)
    } catch (error) {
      console.log(error.message)
    }
  }
})
// 人员通行添加到底库人员发生信息同步删除
postal.subscribe({
  topic: 'user:delete',
  channel: 'through',
  callback: async function (data) {
    await removeUserDoc(data)
  }
})
