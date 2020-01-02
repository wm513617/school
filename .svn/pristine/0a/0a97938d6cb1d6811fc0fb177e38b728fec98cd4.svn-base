/**
 * 设备管理认证核验机controller
 * @time:2019-11-11
 * @author:MeiChen
 */
const peopleCard = require('./peopleId.model')
const common = require('./common')
module.exports = {
  async asyncDevicePeople (ctx, next) { // 从中控系统获取认证核验机设备
    try {
      let serverConfig = await common.getServerConfig(1)
      let initOrg = await common.initOrg(ctx)
      let deviceList = JSON.parse(await common.request({
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/api/device/getPidDevice?access_token=${serverConfig.token}`
      })).data
      let deviceIdList = deviceList.map((item) => {
        item.org = initOrg._id
        return item.id
      })
      let dbDataMore = await peopleCard.find({ // 查询出数据库中比中控多出的数据
        'id': {
          $nin: deviceIdList
        }
      }).lean(true)
      let removeList = dbDataMore.map((item) => {
        return item._id
      })
      if (removeList.length) {
        await peopleCard.remove({'_id': {$in: removeList}})
      }
      let dbData = await peopleCard.find().lean(true)
      if (dbData.length) {
        dbData.forEach((db, i) => { // 求出中控与本地数据库的差集
          deviceList.forEach((zkteco, j) => {
            if (db.id === zkteco.id) {
              deviceList.splice(j, 1)
            }
          })
        })
      }
      await peopleCard.create(deviceList)
      ctx.body = {
        code: 200,
        message: 'success',
        data: deviceList
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取认证核验机失败' })
    }
  },
  async getDevicePeopleList (ctx, next) { // 获取人证核验机设备列表
    let query = ctx.request.query
    let pageSize = parseInt(query.pageSize)
    let pageNum = parseInt(query.pageNum)
    let orgIdArr = [query.orgId] // 机构ID数组
    let findDbData = {}
    if (query.showChildren === 'true') { // 如果显示子机构下的数据
      orgIdArr = await common.getOrgList(ctx, query.orgId, orgIdArr)
    }
    if (query.keyWord) { // 如果有搜索
      let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
      findDbData.$or = [
        {'name': {$regex: keyStr}}
      ]
    }
    findDbData.org = {
      $in: orgIdArr
    }
    try {
      let count = await peopleCard.countDocuments(findDbData)
      let data = await peopleCard.find(findDbData, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}).populate('org').populate('cameraData').sort({'_id': -1}).lean(true)
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
  async setDeviceStatus (ctx, next) { // 设置人证核验机进出状态
    try {
      let data = await peopleCard.updateMany({'_id': {$in: ctx.request.body.device}}, {'readerState': ctx.request.body.state})
      ctx.body = {
        code: 200,
        message: 'success',
        data: data
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '设置失败' })
    }
  },
  async deviceBindCamera (ctx, next) { // 给人证核验机器绑定相机，支持多个机器同时绑定多个相机
    try {
      let data = await peopleCard.updateMany({'_id': {$in: ctx.request.body.device}}, {'cameraData': [...ctx.request.body.cameraData]})
      ctx.body = {
        code: 200,
        message: 'success',
        data: data
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '设置失败' })
    }
  },
  async editDeviceOrg (ctx, next) { // 设置人证核验机机构,支持多设备同时移动到某一机构
    try {
      if (ctx.request.body.device.length && ctx.request.body.orgId) {
        let data = await peopleCard.updateMany({ '_id': { $in: ctx.request.body.device } }, { 'org': ctx.request.body.orgId })
        ctx.body = {
          code: 200,
          message: 'success',
          data: data
        }
      } else {
        ctx.body = {
          code: 500,
          message: '请选机构和设备'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '设置失败' })
    }
  },
  async getDevicePeopleAll (ctx, next) { // 一次性没有任何条件获取人证核验机设备
    try {
      let data = await peopleCard.find({}).lean(true)
      let arr = []
      data.forEach((item) => {
        arr.push({
          label: item.name,
          value: item.name
        })
      })
      ctx.body = {
        code: 200,
        data: arr
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '设置失败' })
    }
  }
}
