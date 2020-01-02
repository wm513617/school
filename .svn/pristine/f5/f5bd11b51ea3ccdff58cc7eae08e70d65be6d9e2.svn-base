/**
 * 设备管理门禁设备相关逻辑
 * @time:2019-7-15
 * @author:MeiChen
 */
const usersModel = require('../users/users.model')
const guardModel = require('./guard.model')
const doorModule = require('./door.model')
const readModule = require('./read.model')
const common = require('./common')
module.exports = {
  async asyncUser (ctx, next) { // 同步用户到中控系统中
    let data = await usersModel.find()
    // http://serverIP:serverPort/api/person/add?access_token={apitoken}
    ctx.body = {
      code: 200,
      data: data,
      message: 'success'
    }
  },
  async asyncGuardList (ctx, next) { // 获取中控门禁设备列表同步到本地数据库
    let orgData = await common.initOrg(ctx) // 初始化机构
    let serverConfig = await common.getServerConfig(1)
    let getZktecoList = async () => {
      let options = {
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/api/device/accList?pageNo=1&pageSize=999&access_token=${serverConfig.token}`
      }
      let data = JSON.parse(await common.request(options))
      data.data.forEach((item) => {
        item.orgId = orgData._id
      })
      return data.data
    }
    try {
      let zktecoData = await getZktecoList()
      let zktecoIdList = zktecoData.map((item) => {
        return item.id
      })
      let dbDataMore = await guardModel.find({ // 查询出数据库中比中控多出的数据
        'id': {
          $nin: zktecoIdList
        }
      }).lean(true)
      let removeList = dbDataMore.map((item) => {
        return item._id
      })
      await guardModel.remove({'_id': {$in: removeList}})
      let dbData = await guardModel.find().lean(true)
      if (dbData.length) {
        dbData.forEach((db, i) => { // 求出中控与本地数据库的差集
          zktecoData.forEach((zkteco, j) => {
            if (db.id === zkteco.id) {
              zktecoData.splice(j, 1)
            }
          })
        })
      }
      await guardModel.create(zktecoData)
      let options = {
        method: 'GET',
        url: 'http://127.0.0.1:20000/api/through/zkteco/asyncDoor'
      }
      let data = JSON.parse(await common.request(options))
      if (data.code === 200) {
        ctx.body = {
          code: 200,
          message: 'success'
        }
      } else {
        ctx.body = {
          code: 500,
          message: '同步通道信息错误'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '读写门禁数据错误' })
    }
  },
  async guardList (ctx, next) { // 获取门禁设备列表
    let pageSize = parseInt(ctx.query.pageSize)
    let pageNum = parseInt(ctx.query.pageNum)
    let orgIdArr = [ctx.query.orgId] // 机构ID数组
    function formaFn (data) { // 格式化关联机构查询数据
      let arr = []
      data.forEach((item) => {
        item.orgName = item.orgId.name
        item.orgId = item.orgId._id
        delete item.org
        arr.push(item)
      })
      return arr
    }
    let findDbData = {}
    let query = ctx.request.query
    if (query.showChildren === 'true') { // 如果显示子机构下的数据
      orgIdArr = await common.getOrgList(ctx, query.orgId, orgIdArr)
    }
    if (query.keyWord) { // 如果有搜索
      let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
      findDbData.$or = [
        {'name': {$regex: keyStr}}
      ]
    }
    findDbData.orgId = {
      $in: orgIdArr
    }
    try {
      console.log('====查询条件是', findDbData)
      let count = await guardModel.countDocuments(findDbData)
      let data = await guardModel.find(findDbData, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}).populate('orgId').sort({'_id': -1}).lean(true)
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
  async editOrg (ctx, next) { // 修改门禁设备机构,会连同关联的门 & 读头关联机构都会修改
    try {
      await guardModel.updateMany({'_id': {$in: ctx.request.body._id}}, {'orgId': ctx.request.body.org})
      let doorData = await doorModule.find({'guardData': {$in: ctx.request.body._id}})
      let doorIdArr = doorData.map((item) => {
        return item._id
      })
      await doorModule.updateMany({'_id': {$in: doorIdArr}}, {'org': ctx.request.body.org})
      await readModule.updateMany({'door_Id': {$in: doorIdArr}}, {'org': ctx.request.body.org})
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '更新机构出错' })
    }
  }
}
