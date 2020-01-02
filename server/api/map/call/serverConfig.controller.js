/*
 * @Author: linhang
 * @Date: 2019-07-15 16:51:33
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-16 15:02:38
 */
'use strict'
const { handleSysException } = require('../../../common/tools')
const Server = mongoose.model('serverconfig')
const Telephone = mongoose.model('telephone')
const { emitServerStatus, emitExtensionStatus } = require('./socketio')
const req = require('./request')

/**
 * 获取服务器信息
 */
exports.getServer = async ctx => {
  try {
    const server = await Server.findOne({ type: 'callCenter' }).lean()
    ctx.body = server
    ctx.status = 200
    // 测试服务器连接,调用获取坐席列表接口
    setTimeout(() => {
      testConnection(server)
    }, 500)
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 新增或者修改服务器
 */
exports.createOrUpdateServer = async ctx => {
  try {
    const data = ctx.request.body
    const server = await Server.findOne({ type: 'callCenter' }).lean()
    if (server) {
      await Server.findOneAndUpdate({ type: 'callCenter' }, data)
    } else {
      await Server.create(data)
    }
    ctx.status = 200
    setTimeout(() => {
      testConnection(data)
    }, 500)
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 测试服务器连接
 * @param {*} server
 */
const testConnection = async server => {
  try {
    const options = {
      option: {
        ip: server.ip,
        port: server.httpPort,
        queryStr: `agents.do?username=${server.userName}&password=${server.password}`
      }
    }
    // 获取请求头认证信息
    const auth = getAuth(server)
    let statusObj
    try {
      const resObj = await req(options, auth)
      if (resObj.success === true) {
        statusObj = { status: true }
      } else {
        statusObj = { status: false }
      }
    } catch (error) {
      statusObj = { status: false }
    }
    // 推送服务器连接状态
    console.log('------推送服务器连接状态', JSON.stringify(statusObj))
    emitServerStatus(statusObj)
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取服务器已登录坐席列表
 * @param {*} server
 */
const getOnlineTelephones = async server => {
  try {
    const options = {
      option: {
        ip: server.ip,
        port: server.httpPort,
        queryStr: `agents.do?username=${server.userName}&password=${server.password}`
      }
    }
    const auth = getAuth(server)
    const resObj = await req(options, auth)
    return resObj
  } catch (error) {
    throw error
  }
}
/**
 * 定时任务每隔2s获取一次坐席状态
 */
exports.getPhoneStatus = async () => {
  try {
    const [server, telephones] = await Promise.all([Server.findOne({ type: 'callCenter' }), Telephone.find().lean()])
    if (server && telephones.length > 0) {
      const resObj = await getOnlineTelephones(server)
      if (resObj.success === true && resObj.root.length > 0) {
        const extensionStatus = []
        for (let item of telephones) {
          const obj = {
            extension: item.extension,
            status: ''
          }
          for (let n of resObj.root) {
            if (item.extension === n.extension) {
              obj.status = n.status
              break
            }
          }
          extensionStatus.push(obj)
        }
        emitExtensionStatus(extensionStatus)
      }
    }
  } catch (error) {
    // console.log('每隔2s获取一次坐席状态失败')
    throw error
  }
}
/**
 * 获取坐席列表
 */
exports.getTelephones = async ctx => {
  try {
    const [server, telephones] = await Promise.all([Server.findOne({ type: 'callCenter' }), Telephone.find().lean()])
    if (server && telephones.length > 0) {
      const resObj = await getOnlineTelephones(server)
      if (resObj.success === true && resObj.root.length > 0) {
        for (let item of telephones) {
          item.status = ''
          item.loginStatus = false
          for (let n of resObj.root) {
            if (item.extension === n.extension) {
              item.status = n.status
              item.loginStatus = true
              break
            }
          }
        }
        ctx.body = telephones
        return
      } else {
        ctx.body = telephones
        return
      }
    }
    ctx.body = []
  } catch (error) {
    if (error.name === 'StatusCodeError') {
      error.message = '获取坐席列表失败'
      handleSysException(error)
    } else {
      handleSysException(error)
    }
  }
}
/**
 * 增加坐席
 */
exports.createTelephone = async ctx => {
  try {
    const data = ctx.request.body
    const [phoneExtension, phoneName] = await Promise.all([
      Telephone.findOne({ extension: data.extension }).lean(),
      Telephone.findOne({ name: data.name }).lean()
    ])
    if (phoneExtension) {
      throw new Error('座席分机号已存在')
    }
    if (phoneName) {
      throw new Error('座席名称已存在')
    }
    await Telephone.create(data)
    ctx.status = 201
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改坐席
 */
exports.updateTelephone = async ctx => {
  try {
    const data = ctx.request.body
    const id = ctx.params.id
    const [phoneExtension, phoneName] = await Promise.all([
      Telephone.findOne({
        _id: { $ne: mongoose.Types.ObjectId(id) },
        extension: data.extension
      }).lean(),
      Telephone.findOne({ _id: { $ne: mongoose.Types.ObjectId(id) }, name: data.name }).lean()
    ])
    if (phoneExtension) {
      throw new Error('座席分机号已存在')
    }
    if (phoneName) {
      throw new Error('座席名称已存在')
    }
    await Telephone.findByIdAndUpdate(id, data)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 删除坐席
 */
exports.deleteTelephone = async ctx => {
  try {
    await Telephone.findByIdAndDelete(ctx.params.id)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 拨号http
 */
exports.dial = async ctx => {
  try {
    const data = ctx.request.body
    const server = await Server.findOne({ type: 'callCenter' }).lean()
    let prefixNumber = ''
    if (ctx.request.body.prefix === '1') {
      prefixNumber = server.prefix
    } else if (ctx.request.body.prefix === '2') {
      prefixNumber = server.prefix.substring(0, 1)
    }
    const options = {
      option: {
        ip: server.ip,
        port: server.httpPort,
        queryStr: `extensionDial.do?username=${server.userName}&passwd=${server.password}&extension=${data.extension}&dialString=${prefixNumber}${data.phone}`
      }
    }
    const auth = getAuth(server)
    const res = await req(options, auth)
    const resArr = res.split('<br />')
    const status = resArr[2].split(':')[1]
    const resultText = resArr[3].split(':')[1]
    const resObj = {
      status,
      resultText
    }
    console.log('--------------拨号返回状态：', JSON.stringify(resObj))
    if (resObj.status === 'false') {
      throw new Error(`${resObj.resultText}`)
    }
    ctx.body = resObj
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 挂断http
 */
exports.hangup = async ctx => {
  try {
    const data = ctx.request.body
    const server = await Server.findOne({ type: 'callCenter' }).lean()
    const options = {
      option: {
        ip: server.ip,
        port: server.httpPort,
        queryStr: `extensionHangup.do?username=${server.userName}&passwd=${server.password}&extension=${data.extension}`
      }
    }
    const auth = getAuth(server)
    const res = await req(options, auth)
    const resArr = res.split('<br />')
    const status = resArr[2].split(':')[1]
    const resultText = resArr[3].split(':')[1]
    const resObj = {
      status,
      resultText
    }
    console.log('--------------挂断返回状态：', JSON.stringify(resObj))
    if (resObj.status === 'false') {
      throw new Error(`${resObj.resultText}`)
    }
    ctx.body = resObj
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 获取坐席组名列表
 */
exports.getQueueNames = async ctx => {
  try {
    const server = await Server.findOne({ type: 'callCenter' }).lean()
    const options = {
      option: {
        ip: server.ip,
        port: server.httpPort,
        queryStr: `queues.do?username=${server.userName}&password=${server.password}`
      }
    }
    // 获取请求头信息
    const auth = getAuth(server)
    const resObj = await req(options, auth)
    const names = []
    if (resObj.success === true && resObj.root.length) {
      resObj.root.forEach(item => {
        names.push(item.name)
      })
      ctx.body = names
      return
    }
    ctx.body = []
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 转换base64认证头信息
 * @param {*} server
 */
const getAuth = server => {
  const str = server.userName + ':' + server.password
  const base64Str = Buffer.from(str).toString('base64')
  return 'Basic ' + base64Str
}
