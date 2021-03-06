const common = require('../zkteco/common')
const faceModule = require('./senseTime.model')
const refreshToken = require('./refreshToken')
const usersModel = require('../users/users.model')
const config = require('../../../../config').backend
const configModel = require('../serviceConfig/serviceConfig.model')
const ResProperty = mongoose.model('ResProperty')
const { ROLE_ID } = require('../../../common/constant')
async function initToken () {
  // 初始化刷新一次商汤的tokeng
  let senseConfig = await configModel.findOne({ type: 2 }).lean(true)
  if (senseConfig !== null) {
    console.log('======已经执行初始化token')
    await refreshToken.refreshToken()
  }
}
initToken()
module.exports = {
  async asyncDevice (ctx, next) {
    // 同步商汤设备数据
    let orgData = await common.initOrg(ctx) // 初始化机构
    let getSenseList = async () => {
      let serverConfig = await common.getServerConfig(2)
      await refreshToken.refreshToken()
      let listStr = await common.request({
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-device-management/api/v1/devices?page=1&size=999`,
        headers: {
          accessToken: global.senseTimeToken.token
        }
      })
      let list = JSON.parse(listStr)
      for (let item of list.data) {
        item.org = orgData._id
        item.deviceState = 2
        let userLength = await common.request({
          method: 'GET',
          url: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-device-management/api/v1/devices/${item.deviceId}`,
          headers: {
            accessToken: global.senseTimeToken.token
          }
        })
        item.userLength = JSON.parse(userLength).userCount
      }
      return list.data
    }
    try {
      let senseData = await getSenseList()
      let senseIdList = senseData.map(item => {
        return item.ID
      })
      let dbDataMore = await faceModule
        .find({
          // 查询出数据库中比商汤多出的数据
          id: {
            $nin: senseIdList
          }
        })
        .lean(true)
      let removeList = dbDataMore.map(item => {
        return item._id
      })
      await faceModule.remove({ _id: { $in: removeList } })
      let dbData = await faceModule.find().lean(true)
      if (dbData.length) {
        dbData.forEach((db, i) => {
          // 求出商汤与本地数据库的差集
          senseData.forEach((zkteco, j) => {
            if (db.id === zkteco.id) {
              senseData.splice(j, 1)
            }
          })
        })
      }
      console.log('======', senseData[0])
      await faceModule.create(senseData)
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '读写人脸识别机数据错误' })
    }
  },
  async editFaceOrg (ctx, next) {
    // 编辑人脸识别机绑定的机构信息
    try {
      let data = await faceModule.updateMany({ _id: { $in: ctx.request.body._id } }, { org: ctx.request.body.org })
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '修改人脸识别机机构错误' })
    }
  },
  async bindCamera (ctx, next) {
    // 人脸识别机绑定相机
    try {
      let data = await faceModule.updateMany(
        { _id: { $in: ctx.request.body.id } },
        { cameraData: ctx.request.body.cameraData }
      )
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '绑定相机错误' })
    }
  },
  async getDeviceList (ctx, next) {
    // 获取人脸识别机列表
    let pageSize = parseInt(ctx.query.pageSize)
    let pageNum = parseInt(ctx.query.pageNum)
    let orgIdArr = [ctx.query.orgId] // 机构ID数组
    let findDbData = {}
    let query = ctx.request.query
    if (query.showChildren === 'true') {
      // 如果显示子机构下的数据
      orgIdArr = await common.getOrgList(ctx, query.orgId, orgIdArr)
    }
    if (query.keyWord) {
      // 如果有搜索
      let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
      findDbData.$or = [{ deviceName: { $regex: keyStr } }]
    }
    findDbData.org = {
      $in: orgIdArr
    }
    function formaFn (data) {
      let arr = []
      data.forEach(item => {
        item.orgName = item.org.name
        item.orgId = item.org._id
        delete item.org
        arr.push(item)
      })
      return arr
    }
    try {
      let count = await faceModule.countDocuments(findDbData)
      let data = await faceModule
        .find(findDbData, null, { skip: (pageNum - 1) * pageSize, limit: pageSize })
        .populate('org')
        .populate('cameraData')
        .sort({ _id: -1 })
        .lean(true)
      let formatting = formaFn(data)
      ctx.body = {
        code: 200,
        data: formatting,
        count: Math.ceil(count / pageSize),
        length: count,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取数据失败' })
    }
  },
  async getLiveCount (ctx, next) {
    // 获取商汤人脸识别机的在线离线数量
    try {
      let online = await faceModule.countDocuments({ accessState: 1 })
      let offline = await faceModule.countDocuments({ accessState: 0 })
      ctx.body = {
        code: 200,
        online: online,
        offline: offline,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取数据失败' })
    }
  },
  async setDeviceState (ctx, next) {
    // 设置人脸识别机进出状态
    try {
      let arr = ctx.request.body.arr
      for (let item of arr) {
        await faceModule.findByIdAndUpdate({ _id: item }, { deviceState: ctx.request.body.state }, { new: false })
      }
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '设置失败' })
    }
  },
  async getFaceBase (ctx, next) {
    // 获取商汤人像库列表
    let serverConfig = await common.getServerConfig(2)
    await refreshToken.refreshToken()
    try {
      let libraries = await common.request({
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-watchlist-management/api/v1/libraries`,
        headers: {
          accessToken: global.senseTimeToken.token
        }
      })
      // 进行权限过滤
      if (libraries) {
        const data = JSON.parse(libraries)
        const roleId = ctx.state.user.role
        if (roleId !== ROLE_ID) {
          const ids = await ResProperty.distinct('id', {
            role: roleId,
            type: 6,
            properties: { $elemMatch: { $eq: 'show' }, $size: 1 }
          })
          if (data.whitelists && data.whitelists.length) {
            data.whitelists = data.whitelists.filter(item => ids.includes(item.libraryId + ''))
          }
          if (data.blacklists && data.blacklists.length) {
            data.blacklists = data.blacklists.filter(item => ids.includes(item.libraryId + ''))
          }
        }
        ctx.body = {
          code: 200,
          list: data
        }
        return
      }
      ctx.body = {
        code: 200,
        list: {}
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '设置失败' })
    }
  },
  async createLibrary (ctx, next) {
    // 创建商汤的人像库
    let serverConfig = await common.getServerConfig(2)
    await refreshToken.refreshToken()
    try {
      let libraries = await common.request({
        method: 'POST',
        uri: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-watchlist-management/api/v1/libraries`,
        headers: {
          accessToken: global.senseTimeToken.token
        },
        body: {
          type: ctx.request.body.type === 1 || ctx.request.body.type === 2 ? 1 : 2,
          name: ctx.request.body.name,
          extractFeature: ctx.request.body.extractFeature
        },
        json: true
      })
      ctx.body = {
        code: 200,
        list: libraries
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '创建人像库失败' })
    }
  },
  async addLibraryUser (ctx, next) {
    // 给对应人像库中添加人像信息,支持多人同时添加多个库
    let serverConfig = await common.getServerConfig(2)
    let userData = []
    if (ctx.request.body.userId === 'all') {
      userData = await usersModel.find({})
    } else {
      userData = await usersModel.find({ _id: { $in: ctx.request.body.userId } })
    }
    let successArr = []
    let fileArr = []
    await refreshToken.getToken()
    try {
      for (let item of userData) {
        if (item.image && item.failure) {
          let fileStr = item.image.split('/')
          let fileName = fileStr[fileStr.length - 1]
          let fileType = fileName.split('.')
          let file = fs.readFileSync(`${config.fileDirs.peopleDir}/${fileName}`)
          let base64 = Buffer.from(file, 'binary').toString('base64') // base64编码
          let base64str = `data:image/${fileType[1]};base64,${base64}`
          let parameter = {
            ID: item.code,
            enableState: 1,
            gender: item.sex,
            image: base64str,
            libraryIds: ctx.request.body.permissionId,
            libraryType: item.type === 2 ? 2 : 1,
            name: item.name,
            replace: 0,
            expirationTime: item.failure,
            activationTime: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          let result = await common.request({
            method: 'POST',
            uri: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-watchlist-management/api/v1/targets`,
            body: parameter,
            headers: {
              accessToken: global.senseTimeToken.token
            },
            json: true
          })
          if (result.targetId) {
            successArr.push(item)
            await usersModel.updateMany(
              { _id: item._id },
              { $set: { faceId: result.targetId, facePermission: ctx.request.body.permissionId } }
            )
          }
        } else {
          fileArr.push(item)
        }
      }
      ctx.body = {
        code: 200,
        message: 'success',
        successLength: successArr.length,
        file: fileArr.length
      }
    } catch (err) {
      console.log('err=========', err)
      ctx.throw(500, { code: 500, message: '人像库添加人员失败' })
    }
  }
}
