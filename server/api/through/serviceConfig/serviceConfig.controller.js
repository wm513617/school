const configModel = require('./serviceConfig.model')
const { handleSysException } = require('../../../common/tools')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const tool = require('../../../common/tools')
const rp = require('request-promise')
const config = require('../../../../config')
const refreshToken = require('../senseTime/refreshToken')
const userController = require('../users/users.controller')
const mssql = require('mssql')
async function listQuery (schema, search, selection, sort, pageObj = {limit: 10, page: 1}, population, ctx) {
  for (var key in search) {
    if (search[key] === undefined || search[key] === '' || search[key] === null) {
      delete search[key]
    }
  }
  let onlineSearch = Object.assign({status: 1}, search)
  const [onlinecount, count, results] = await Promise.all([
    schema.countDocuments(onlineSearch).exec(),
    schema.countDocuments(search).exec(),
    schema
      .find(search, selection)
      .populate(population)
      .sort(sort)
      .skip((+pageObj.page - 1) * +pageObj.limit)
      .limit(+pageObj.limit)
      .exec()
  ])
  ctx.set({
    'X-BSC-ONLINECOUNT': onlinecount,
    'X-BSC-COUNT': count,
    'X-BSC-PAGES': Math.ceil(count / pageObj.limit),
    'X-BSC-CUR': parseInt(pageObj.page),
    'X-BSC-LIMIT': parseInt(pageObj.limit)
  })
  return {
    results: _.isEmpty(results) ? [] : results
  }
}
async function registerSense() { // 注册商汤的人员通行推送服务
  try {
    function getIPAdress () { // 获取本机IP
      const interfaces = require('os').networkInterfaces()
      for (let devName in interfaces) {
        let iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
          let alias = iface[i]
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            return alias.address
          }
        }
      }
    }
    let data = await configModel.findOne({type: 2}).lean(true)
    await refreshToken.refreshToken()
    await rp({
      method: 'POST',
      url: `http://${data.ip}:${data.port}/senseguard-oauth2/api/v1/third/register`,
      json: true,
      body: {
        pushRecordUrl: `http://${getIPAdress()}:${config.backend.port}/api/through/passage/senseguardPassage`,
        pushSwitch: 1
      },
      headers: {
        accessToken: global.senseTimeToken.token
      },
      timeout: 2000
    })
    console.log('已经注册成功', global.senseTimeToken, `http://${getIPAdress()}:${config.backend.port}/api/through/passage/senseguardPassage`)
  } catch (err) {
    throw new Error('商汤注册失败')
  }
}
async function querySql (sql, params, data) {
  let connConfig = {
    user: data.userName,
    password: data.passWord,
    server: `${data.ip}`,
    database: data.dataBase,
    connectionTimeout: 1500,
    requestTimeout: 1500,
    port: data.port,
    // options: {
    //   encrypt: true // Use this if you're on Windows Azure
    // },
    pool: {
      min: 0,
      max: 100,
      idleTimeoutMillis: 1500
    }
  }
  mssql.on('error', err => {
    console.log('SQL 链接错误', err)
    throw new Error('SQL链接错误')
  })
  let connectionPool
  let getConnection = async function () { //连接数据库
    if (!(connectionPool && connectionPool.connected)) {
      connectionPool = await mssql.connect(connConfig)
    }
    return connectionPool
  }
  await mssql.close()// close
  let pool = await getConnection()
  let request = pool.request()
  if (params) {
    for (let index in params) {
      if (typeof params[index] == 'number') {
        request.input(index, mssql.Int, params[index])
      } else if (typeof params[index] == 'string') {
        request.input(index, mssql.NVarChar, params[index])
      }
    }
  }
  let result = await request.query(sql)
  await mssql.close() // close
  return result
}
async function validationOneCard () { // 验证一卡通是否链接正常
  try {
    let data = await configModel.findOne({type: 4}).lean(true)
    let list = await querySql('SELECT TOP 1 * FROM dbo.User_Infor_Message', '', data)
    console.log('======list', list)
  } catch (err) {
    throw new Error('SQL查询错误', err)
  }
}
async function validationZkteco () { // 验证中控系统是否有效
  try {
    let data = await configModel.findOne({type: 1})
    let list = await rp({
      method: 'GET',
      url: `http://${data.ip}:${data.port}/api/device/accList?pageNo=1&pageSize=1&access_token=${data.token}`,
      timeout: 2000
    })
  } catch (err) {
    throw new Error('中控请求错误')
  }
}
module.exports = {
  async addConfig (ctx, next) { // 添加配置
    let findData = await configModel.find({'type': ctx.request.body.type})
    try {
      if (findData.length) { // 保存数据之前先校验同类型的服务是否存在
        ctx.body = {
          code: 500,
          message: '该类型的服务已经存在'
        }
      } else {
        let serviceModel = new configModel(ctx.request.body)
        let serviceData = await serviceModel.save()
        if (ctx.request.body.type === 2) { // 如果是人脸服务器则需要在创建的时候去注册商汤的人员推送
          try {
            await registerSense()
            await configModel.findByIdAndUpdate({'_id': serviceData._id}, {status: 1})
            await rp({
              method: 'GET',
              url: `http://127.0.0.1:${config.backend.port}/api/through/senseTime/getDeviceList`
            })
          } catch (err) {
            await configModel.findByIdAndUpdate({'_id': serviceData._id}, {status: 0})
            ctx.throw(500, {code: 500, message: '检测到商汤服务离线'})
          }
        } else if (ctx.request.body.type === 4) { // 如果是配置了一卡通
          try {
            await validationOneCard()
            await configModel.findByIdAndUpdate({'_id': serviceData._id}, {status: 1})
          } catch (e) {
            await configModel.findByIdAndUpdate({'_id': serviceData._id}, {status: 0})
            ctx.throw(500, {code: 500, message: '检测到一卡通服务离线'})
          }
        } else if (ctx.request.body.type === 1) { // 如果是中控的系统
          try {
            await validationZkteco()
            await configModel.findByIdAndUpdate({'_id': serviceData._id}, {status: 1})
            await rp({
              method: 'GET',
              url: `http://127.0.0.1:${config.backend.port}/api/through/zkteco/asyncGuardList`
            })
            await ({
              method: 'GET',
              url: `http://127.0.0.1:${config.backend.port}/api/through/zkteco/asyncDevicePeople`
            })
          } catch (err) {
            await configModel.findByIdAndUpdate({'_id': serviceData._id}, {status: 0})
            ctx.throw(500, {
              code: 500,
              message: '检测到中控服务离线'
            })
            // ctx.throw(500, {code: 500, message: '检测到中控服务离线'})
          }
        }
        ctx.body = {
          code: 200,
          data: serviceData,
          message: '配置成功'
        }
        if (ctx.request.body.type === 4) { // 如果是一卡通的服务，则需要去调用一卡通的数据
          userController.getOneCard()
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '服务离线或写入服务配置数据出错'})
    }
  },
  async editConfig (ctx, next) {
    try {
      let findData = await configModel.find({'type': ctx.request.body.type}).lean(true)
      let configData = {
        name: ctx.request.body.name,
        ip: ctx.request.body.ip,
        port: ctx.request.body.port,
        vendor: ctx.request.body.vendor,
        type: ctx.request.body.type,
        token: ctx.request.body.token,
        status: ctx.request.body.status,
        userName: ctx.request.body.userName,
        passWord: ctx.request.body.passWord
      }
      if (findData.length) { // 保存数据之前先校验同类型的服务是否存在
        if (findData[0]._id.toString() === ctx.request.body._id) {
          let data = await configModel.findByIdAndUpdate({'_id': ctx.request.body._id}, configData, {
            new: true,
            runValidators: true
          })
          ctx.body = {
            code: 200,
            data: data,
            message: 'success'
          }
        } else {
          ctx.body = {
            code: 200,
            message: '该类型的服务已经存在'
          }
        }
      } else {
        let data = await configModel.findByIdAndUpdate({'_id': ctx.request.body._id}, configData, {
          new: true,
          runValidators: true
        })
        ctx.body = {
          code: 200,
          data: data,
          message: 'success'
        }
      }
      if (ctx.request.body.type === 2) {
        await registerSense(ctx.request.body)
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '修改服务配置数据出错'})
    }
  },
  async getConfig (ctx, next) { // 获取服务列表
    try {
      let pageSize = parseInt(ctx.request.query.pageSize)
      let pageNum = parseInt(ctx.request.query.pageNum)
      let count = await configModel.countDocuments({})
      let findDbData = {
        type: {
          $ne: 3
        }
      }
      let query = ctx.request.query
      if (query.keyWord) { // 如果有搜索
        let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
        findDbData.$or = [
          {'name': {$regex: keyStr}}
        ]
      }
      let data = await configModel.find(findDbData, null, {
        skip: (pageNum - 1) * pageSize,
        limit: pageSize
      }).sort({'_id': -1})
      ctx.body = {
        code: 200,
        data: data,
        count: Math.ceil(count / pageSize),
        length: count,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '配置查询出错'})
    }
  },
  async deleteConfig (ctx, next) { // 删除配置，支持批量
    try {
      let data = await configModel.remove({'_id': {$in: ctx.request.body.configId}})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '删除数据出错'})
    }
  },
  async editLevelConfig (ctx, next) { // 高级参数配置
    try {
      if (parseInt(ctx.request.body.data.timeLang) > 90) {
        ctx.body = {
          code: 500,
          message: '通行记录最大仅支持保存90天的记录'
        }
      } else {
        let data = await configModel.findByIdAndUpdate({'_id': ctx.request.body._id}, ctx.request.body.data, {
          new: true,
          runValidators: true
        })
        ctx.body = {
          code: 200,
          data: data,
          message: 'success'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '高级配置更新失败'})
    }
  },
  async getLevelConfig (ctx, next) { // 获取高级参数配置
    try {
      let findData = await configModel.find({'type': 3})
      if (findData.length) { // 如果此时数据库中并没有高级配置参数，则自动创建一个默认的
        ctx.body = {
          code: 200,
          data: findData,
          message: 'success'
        }
      } else {
        let serviceModel = new configModel({'type': 3, 'source': 1, 'timeLang': 30, 'name': '高级服务配置项'})
        let serviceData = await serviceModel.save()
        ctx.body = {
          code: 200,
          data: serviceData,
          message: 'success'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '获取配置失败'})
    }
  },
  async getDeviceStatus (ctx, next) { // 获取设备管理视频资源设备状态
    try {
      ctx.set('loginfo', encodeURI('资源管理-获取资源列表'))
      if (!ctx.query.oid) {
        return ctx.throw(500, {
          code: 1003,
          message: '该机构不存在'
        })
      }
      const orginfo = await Org.findById(ctx.query.oid).exec()
      if (_.isEmpty(orginfo)) {
        return ctx.throw(500, {
          code: 1003,
          message: '该机构不存在'
        })
      }
      let allChildrenIds = [] // 该机构的所有子机构
      if (parseInt(ctx.query.never) === -1) {
        const orgs = await Org.find(
          {
            type: orginfo.type || 0
          },
          '_id name pid order'
        )
          .sort('order')
          .exec()
        allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
      }
      allChildrenIds.unshift(ctx.query.oid + '')
      let result = await OrgRes.find(
        {
          islane: false,
          org: {
            $in: allChildrenIds
          }
        },
        'resource -_id'
      ).exec()
      const _ids = _.map(result, 'resource')
      const query = {_id: {$in: _ids}}
      ctx.query.seek && (query.name = {$regex: ctx.query.seek || ''})

      const resResult = await listQuery(
        Resource,
        query,
        '',
        {createdAt: -1},
        ctx.query.page,
        {path: 'eid', populate: {path: 'oid', select: 'name'}},
        ctx
      )
      result = resResult.results
      // result = JSON.parse(JSON.stringify(result))
      // const websockets = singleton.getSocketIntance()
      // // 判断视频通道的流状态
      // for (let item of result) {
      //   item.state = !!websockets[item._id.toString()]
      // }
      ctx.body = result
    } catch (err) {
      handleSysException(err)
    }
  },
  async getServerStatus (ctx, next) {
    try {
      let server = await configModel.find({type: {$ne: 3}}).lean(true)
      for (let item of server) {
        if (item.type === 1) { // 如果是中控的系统
          try {
            await validationZkteco()
            await configModel.findByIdAndUpdate({'_id': item._id}, {status: 1})
          } catch (err) {
            await configModel.findByIdAndUpdate({'_id': item._id}, {status: 0})
            // ctx.throw(500, {code: 500, message: '检测到中控服务离线'})
          }
        } else if (item === 2) { // 如果是商汤的系统
          try {
            await registerSense(ctx.request.body)
            await configModel.findByIdAndUpdate({'_id': item._id}, {status: 1})
          } catch (err) {
            await configModel.findByIdAndUpdate({'_id': item._id}, {status: 0})
            // ctx.throw(500, {code: 500, message: '检测到商汤服务离线'})
          }
        } else if (item === 4) { // 如果是一卡通的服务
          try {
            await validationOneCard()
            await configModel.findByIdAndUpdate({'_id': item._id}, {status: 1})
          } catch (err) {
            await configModel.findByIdAndUpdate({'_id': item._id}, {status: 0})
            // ctx.throw(500, {code: 500, message: '检测到一卡通服务离线'})
          }
        }
      }
      ctx.body = {
        code: 200,
        message: '检查完成'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {code: 500, message: '检测服务状态错误'})
    }
  }
}
