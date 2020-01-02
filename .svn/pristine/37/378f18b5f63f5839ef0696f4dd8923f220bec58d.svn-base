/**
 * 设备管理读头相关逻辑
 * @time:2019-7-15
 * @author:MeiChen
 */
const readModule = require('./read.model')
const doorModule = require('./door.model')
const common = require('./common')
module.exports = {
  async asyncRead (ctx, next) { // 同步读头信息
    let serverConfig = await common.getServerConfig(1)
    let getRead = async () => {
      let options = {
        method: 'GET',
        url: `http://${serverConfig.ip}:${serverConfig.port}/api/reader/accList?pageNo=1&pageSize=1000&access_token=${serverConfig.token}`
      }
      let data = JSON.parse(await common.request(options))
      return data.data
    }
    let zktecoData = await getRead()
    let zktecoIdList = zktecoData.map((item) => {
      return item.id
    })
    let doorIdArr = zktecoData.map((item) => {
      return item.doorId
    })
    let dbDataMore = await readModule.find({ // 查询出数据库中比中控多出的数据
      'id': {
        $nin: zktecoIdList
      }
    }).lean(true)
    let removeList = dbDataMore.map((item) => {
      return item._id
    })
    await readModule.remove({'_id': {$in: removeList}})
    let doorData = await doorModule.find({'id': {$in: doorIdArr}}).lean(true)
    zktecoData.forEach((item) => {
      doorData.forEach((door) => {
        if (item.doorId === door.id) {
          item.org = door.org
          item.door_Id = door._id
        }
      })
    })
    let dbData = await readModule.find().lean(true)
    if (dbData.length) {
      dbData.forEach((db, i) => { // 求出中控与本地数据库的差集
        zktecoData.forEach((zkteco, j) => {
          if (db.id === zkteco.id) {
            zktecoData.splice(j, 1)
          }
        })
      })
    }
    await readModule.create(zktecoData)
    ctx.body = {
      code: 200,
      message: 'success'
    }
  },
  async bindCamera (ctx, next) { // 给读头绑定相机
    try {
      let data = await readModule.updateMany({'_id': {$in: ctx.request.body.id}}, {'cameraData': ctx.request.body.cameraData})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '更新数据出错' })
    }
  },
  async getReadList (ctx, next) { // 获取读头列表
    let pageSize = parseInt(ctx.query.pageSize)
    let pageNum = parseInt(ctx.query.pageNum)
    let orgIdArr = [ctx.query.orgId] // 机构ID数组
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
    findDbData.org = {
      $in: orgIdArr
    }
    function formaFn (data) {
      data.forEach((item) => {
        item.orgId = item.org._id
        item.orgName = item.org.name
        item.doorName = item.door_Id.name
        delete item.org
        delete item.door_Id
      })
      return data
    }
    try {
      let count = await readModule.countDocuments(findDbData)
      let data = await readModule.find(findDbData, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}).populate('door_Id').populate('org').populate('cameraData').sort({'_id': -1}).lean(true)
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
  }
}
