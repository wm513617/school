const permissionModel = require('./permission.model')
const usersModel = require('../users/users.model')
const configModel = require('../serviceConfig/serviceConfig.model')
const rp = require('request-promise')
const ResProperty = mongoose.model('ResProperty')
const { ROLE_ID } = require('../../../common/constant')
async function getServerConfig (type) {
  // 获取服务配置对应数据
  /*
   * 参数type number类型 1 对应门禁服务器 2 对应人脸服务器
   * */
  return configModel.findOne({ type: type }).lean(true)
}
/*
 * 所有给用户添加权限都需要与中控同步
 * 若中控添加成功并且下发权限到设备成功则成功，反之则失败
 * */
async function zktecoAddPermission (userId, permission) {
  // 给用户在中控系统中添加权限
  let serverConfig = await getServerConfig(1)
  let options = {
    method: 'POST',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncPerson?pin=${userId}&levelIds=${permission}&access_token=${serverConfig.token}`
  }
  let result = JSON.parse(await rp(options))
  return result
}
async function zktecoPermissionDev (permission) {
  // 同步中控权限组下的信息给设备
  let serverConfig = await getServerConfig(1)
  let option = {
    method: 'POST',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncLevel?levelIds=${permission}&access_token=${serverConfig.token}`
  }
  let result = JSON.parse(await rp(option))
  return result
}
async function zktecoDeletePermission (userId, permission) {
  // 删除用户在中控系统中的权限
  let serverConfig = await getServerConfig(1)
  let deleteOptions = {
    method: 'POST',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/deleteLevel?pin=${userId}&levelIds=${permission}&access_token=${serverConfig.token}`
  }
  let result = JSON.parse(await rp(deleteOptions))
  return result
}
module.exports = {
  async asyncPermission (ctx, next) {
    // 从中控系统中同步权限组
    async function getPermission () {
      let serverConfig = await getServerConfig(1)
      let option = {
        method: 'GET',
        uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/list?access_token=${serverConfig.token}&pageNo=1&pageSize=10000`
      }
      let data = await rp(option)
      return JSON.parse(data).data
    }
    try {
      let zktecoData = await getPermission()
      let zktecoIdList = zktecoData.map(item => {
        return item.id
      })
      let dbDataMore = await permissionModel
        .find({
          // 查询出数据库中比中控多出的数据
          id: {
            $nin: zktecoIdList
          }
        })
        .lean(true)
      let removeList = dbDataMore.map(item => {
        return item._id
      })
      await permissionModel.remove({ _id: { $in: removeList } })
      let dbData = await permissionModel.find({}).lean(true)
      if (dbData.length) {
        dbData.forEach((db, i) => {
          // 求出中控与本地数据库的差集
          zktecoData.forEach((zkteco, j) => {
            if (db.id === zkteco.id) {
              zktecoData.splice(j, 1)
            }
          })
        })
      }
      await permissionModel.create(zktecoData)
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '读写门禁权限失败' })
    }
  },
  async getPermissionGroup (ctx, next) {
    try {
      // 获取门禁权限组
      // 首先进行权限过滤
      const roleId = ctx.state.user.role
      let query = {}
      if (roleId !== ROLE_ID) {
        const _ids = await ResProperty.distinct('resource', {
          role: roleId,
          type: 6,
          properties: { $elemMatch: { $eq: 'show' }, $size: 1 }
        })
        query = { _id: { $in: _ids } }
      }
      let data = await permissionModel.find(query).lean()
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '权限组失败' })
    }
  },
  async getPermissionUser (ctx, next) {
    // 获取对应权限组关系的用户
    let query = ctx.request.query
    let pageSize = parseInt(query.pageSize)
    let pageNum = parseInt(query.pageNum)
    let findDbData = {}
    if (query.type === 'have') {
      // 是否有该权限组
      findDbData.permission = query.permissionId
    } else if (query.type === 'not') {
      findDbData.permission = {
        $nin: [query.permissionId]
      }
    }
    if (query.keyWord) {
      // 如果是搜索
      let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
      findDbData.$or = [{ name: { $regex: keyStr } }, { uid: { $regex: keyStr } }, { card: { $regex: keyStr } }]
      delete findDbData.keyWord
    }
    try {
      let count = await usersModel.countDocuments(findDbData)
      let data = await usersModel
        .find(findDbData, null, { skip: (pageNum - 1) * pageSize, limit: pageSize })
        .populate('org')
        .sort({ _id: -1 })
        .lean(true)
      ctx.body = {
        code: 200,
        data: data,
        count: Math.ceil(count / pageSize),
        length: count,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取数据失败' })
    }
  },
  async addPermissionUser (ctx, next) {
    // 按用户添加权限组,支持多用户同时添加多权限
    let failure = []
    try {
      let userData = []
      if (ctx.request.body.userId === 'all') {
        // 如果是全部的用户则全查
        userData = await usersModel.find({}).lean(true)
      } else {
        userData = await usersModel.find({ _id: { $in: ctx.request.body.userId } }).lean(true)
      }
      let permission = await permissionModel.find({ _id: { $in: ctx.request.body.permissionId } }).lean(true)
      for (let item of userData) {
        let permissionId = permission.map(item => {
          return item.id
        })
        let permissionStr = permissionId.join(',')
        let status = await zktecoAddPermission(item.code, permissionStr)
        if (status.code === 0) {
          await usersModel.updateMany({ _id: item._id }, { $set: { permission: ctx.request.body.permissionId } })
        } else {
          failure.push(item)
        }
      }
      await zktecoPermissionDev(permission.id)
      ctx.body = {
        code: 200,
        success:
          ctx.request.body.userId === 'all'
            ? ctx.request.body.userId.length
            : ctx.request.body.userId.length - failure.length,
        failure: failure.length,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '修改失败' })
    }
  },
  async addPermissionGroup (ctx, next) {
    // 按机构给用户添加权限组
    /*
     * 在设置完成之后，需要检测该机构下用户是否给中控添加过
     * 若没有，则需要创建，若有则不用
     * 然后给对应的人员添加权限
     * */
    try {
      let failure = []
      let serverConfig = await getServerConfig(1)
      let userData = await usersModel.find({ org: { $in: ctx.request.body.org } }).lean(true)
      let permission = await permissionModel.findOne({ _id: ctx.request.body.permissionId }).lean(true)
      for (let item of userData) {
        let permissionData = await permissionModel.find({ _id: { $in: item.permission } }).lean(true)
        let permissionId = permissionData.map(item => {
          return item.id
        })
        let permissionStr = [...permissionId, permission.id].join(',')
        // let options = {
        //   method: 'POST',
        //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncPerson?pin=${item.uid}&levelIds=${permissionStr}&access_token=${serverConfig.token}`
        // }
        // let status = JSON.parse(await rp(options))
        let status = await zktecoAddPermission(item.code, permissionStr)
        if (status.code === 0) {
          await usersModel.updateMany({ _id: item._id }, { $addToSet: { permission: ctx.request.body.permissionId } })
        } else {
          failure.push(item)
        }
      }
      // let option = {
      //   method: 'POST',
      //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncLevel?levelIds=${permission.id}&access_token=${serverConfig.token}`
      // }
      // await rp(option)
      await zktecoPermissionDev(permission.id)
      ctx.body = {
        code: 200,
        success: userData.length - failure.length,
        failure: failure.length,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '修改失败' })
    }
  },
  async movePermissionUser (ctx, next) {
    // 移动用户权限组
    /*
     * 移动实际上是删除用户的A权限，然后添加B权限
     * 需要调用第三方接口完成
     * */
    try {
      let failure = []
      // let serverConfig = await getServerConfig(1)
      let userData = await usersModel.find({ _id: { $in: ctx.request.body.userId } }).lean(true)
      let newPermission = await permissionModel.findOne({ _id: ctx.request.body.permissionNewId }).lean(true)
      let oldPermission = await permissionModel.findOne({ _id: ctx.request.body.permissionOldId }).lean(true)
      for (let item of userData) {
        // let deleteOptions = {
        //   method: 'POST',
        //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/deleteLevel?pin=${item.uid}&levelIds=${oldPermission.id}&access_token=${serverConfig.token}`
        // }
        // let deleteStatus = JSON.parse(await rp(deleteOptions))
        let deleteStatus = await zktecoDeletePermission(item.code, oldPermission)
        let permissionData = await permissionModel.find({ _id: { $in: item.permission } }).lean(true)
        let permissionId = [newPermission.id]
        permissionData.forEach(item => {
          if (item.id !== oldPermission.id) {
            permissionId.push(item.id)
          }
        })
        let permissionStr = permissionId.join(',')
        // let newOptions = {
        //   method: 'POST',
        //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncPerson?pin=${item.uid}&levelIds=${permissionStr}&access_token=${serverConfig.token}`
        // }
        // let addStatus = JSON.parse(await rp(newOptions))
        let addStatus = await zktecoAddPermission(item.code, permissionStr)
        if (addStatus.code === 0 && deleteStatus.code === 0) {
          await usersModel.updateMany({ _id: item._id }, { $pull: { permission: ctx.request.body.permissionOldId } })
          await usersModel.updateMany(
            { _id: item._id },
            { $addToSet: { permission: ctx.request.body.permissionNewId } }
          )
        } else {
          failure.push(item)
        }
      }
      // let asyncNewOption = {
      //   method: 'POST',
      //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncLevel?levelIds=${newPermission.id}&access_token=${serverConfig.token}`
      // }
      // let asyncOldOption = {
      //   method: 'POST',
      //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncLevel?levelIds=${oldPermission.id}&access_token=${serverConfig.token}`
      // }
      // await rp(asyncNewOption)
      // await rp(asyncOldOption)
      await zktecoPermissionDev(newPermission.id)
      await zktecoPermissionDev(oldPermission.id)
      ctx.body = {
        code: 200,
        success: userData.length - failure.length,
        failure: failure.length,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '修改失败' })
    }
  },
  async deletePermissionUser (ctx, next) {
    // 删除人员与权限组的关系，支持多用户同时删除多权限
    /*
     * 还需要调用中控API删除对应人员的权限
     * */
    try {
      let failure = []
      let userData = await usersModel.find({ _id: { $in: ctx.request.body.userId } }).lean(true)
      let permission = await permissionModel.findOne({ _id: ctx.request.body.permissionId }).lean(true)
      for (let item of userData) {
        let status = await zktecoDeletePermission(item.code, permission.id)
        if (status.code === 0) {
          await usersModel.updateMany({ _id: item._id }, { $pull: { permission: ctx.request.body.permissionId } })
        } else {
          failure.push(item)
        }
      }
      await zktecoPermissionDev(permission.id)
      ctx.body = {
        code: 200,
        success: ctx.request.body.userId.length - failure.length,
        failure: failure.length,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '解除失败' })
    }
  },
  async asyncDoorPermission (ctx, next) {
    // 同步权限组和设备间关系，对应门禁权限 同步按钮
    /*
     * 此处需要调用中控 同步权限组下的信息给设备 API
     * */
    // let serverConfig = await getServerConfig(1)
    let permission = await permissionModel.find({}).lean(true)
    for (let item of permission) {
      // let option = {
      //   method: 'POST',
      //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncLevel?levelIds=${item.id}&access_token=${serverConfig.token}`
      // }
      // await rp(option)
      await zktecoPermissionDev(item.id)
    }
    ctx.body = {
      code: 200
    }
  },
  async deleteAllPermission (ctx, next) {
    // 删除全部权限，并解除所有用户间的关系
    /*
     * 删除全部权限之后还需要和中控系统做同步
     * */
    let permissionData = await permissionModel.find({}).lean(true)
    try {
      for (let item of permissionData) {
        let userList = await usersModel.find({ permission: item._id }).lean(true)
        for (let user of userList) {
          let status = await zktecoDeletePermission(user.code, item.id)
          if (status.code === 0) {
            await usersModel.updateMany({ _id: user._id }, { $pull: { permission: item._id } })
          }
        }
      }
      await permissionModel.remove({})
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '删除失败' })
    }
  }
}
