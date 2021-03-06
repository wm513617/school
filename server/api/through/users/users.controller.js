const usersModel = require('./users.model')
const mongoose = require('mongoose')
const exportModel = require('./exportUser.model')
const Org = mongoose.model('Org')
const permissionModel = require('../doorPermission/permission.model')
const configModel = require('../serviceConfig/serviceConfig.model')
const config = require('../../../../config').backend
const crypto = require('crypto')
const xlsx = require('node-xlsx')
const fs = require('fs')
const postal = require('postal')
const rp = require('request-promise')
const fork = require('child_process').fork
const path = require('path')
const send = require('koa-send')
const refreshToken = require('../senseTime/refreshToken')
const moment = require('moment')
const mssql = require('mssql')
// const outPut = fs.createWriteStream('./senseguard-out.log')
// const errorOutput = fs.createWriteStream('./senseguard-err.log')
// const logger = new console.Console(outPut, errorOutput)
const doorPermission = require('../doorPermission/permission.model')

async function getServerConfig (type) { // 获取服务配置对应数据
  /*
  * 参数type number类型 1 对应门禁服务器 2 对应人脸服务器
  * */
  return configModel.findOne({type: type}).lean(true)
}
postal.subscribe({ // 订阅人像认别底库修改人员信息事件
  channel: 'veriface',
  topic: 'user:update',
  callback: function (data, envelope) {
    let updata = {
      'name': data.name,
      'image': data.image
    }
    if (data.gender === '1') { // 女
      updata.sex = 2
    } else if (data.gender === '2') { // 男
      updata.sex = 1
    }
    usersModel.updateMany({'veriface': data._id}, updata, function (err, res) {
      if (err) {
        console.log('监听底库修改人员信息事件，更新用户信息失败')
      }
    })
  }
})
postal.subscribe({ // 订阅人像识别的底库的删除事件
  channel: 'veriface',
  topic: 'user:delete',
  callback: function (data, envelope) {
    data.forEach((item) => {
      usersModel.updateMany({'veriface': item}, {'veriface': ''}, function (err, res) {
        if (err) {
          console.log('监听底库删除人员信息事件，更新用户信息失败')
        }
      })
    })
  }
})
function eventEditUser (data) { // 对人像识别底库发布update事件
  postal.publish({
    channel: 'through',
    topic: 'user:update',
    data: data // {_id: 'xxxx', name: 'xxxxxx', gender: 1}
  })
}
function eventDeleteUser (data) { // 对人像识别底库发布delete事件
  postal.publish({
    channel: 'through',
    topic: 'user:delete',
    data: data // data 数组 元素为_id ['1', '2']
  })
}
/*
* 所有创建&修改&删除用户都需要与中控同步
* 若中控创建&修改&删除失败则失败
* */
async function zktecoAddUser (data) { // 给中控系统添加&编辑用户
  let serverConfig = await getServerConfig(1)
  let parameter = {
    pin: data.code,
    name: data.name,
    gender: (data.sex === 1) ? 'M' : 'F',
    cardNo: data.card || ''
  }
  if (data.failure) {
    parameter.accEndTime = data.failure
    parameter.accStartTime = moment().format('YYYY-MM-DD HH:mm:ss')
  }
  let option = {
    method: 'POST',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/api/person/add?access_token=${serverConfig.token}`,
    body: parameter,
    json: true
  }
  let result = await rp(option)
  return result
}
async function zktecoDeleteUser (data) { // 删除中控系统的用户
  let serverConfig = await getServerConfig(1)
  let option = {
    method: 'DELETE',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/api/person/delete/${data.code}?access_token=${serverConfig.token}`
  }
  let result = await rp(option)
  return result
}
async function zktecoPermissionDev (permission) { // 同步中控权限组下的信息给设备
  let serverConfig = await getServerConfig(1)
  let permissionArr = permission.split(',')
  for (let item of permissionArr) {
    let option = {
      method: 'POST',
      uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncLevel?levelIds=${item}&access_token=${serverConfig.token}`
    }
    await rp(option)
  }
}
async function zktecoAddPermission (userCode, permission, status = true) { // 给用户在中控系统中添加权限
  let serverConfig = await getServerConfig(1)
  let options = {
    method: 'POST',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncPerson?pin=${userCode}&levelIds=${permission}&access_token=${serverConfig.token}`
  }
  let result = JSON.parse(await rp(options))
  if (status) {
    await zktecoPermissionDev(permission)
  }
  return result
}
async function senseTimeDeleteUser (targetId) {
  let serverConfig = await getServerConfig(2)
  await refreshToken.refreshToken()
  let option = {
    method: 'DELETE',
    uri: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-watchlist-management/api/v1/targets/${targetId}`,
    body: {
      type: 2
    },
    headers: {
      accessToken: global.senseTimeToken.token
    },
    json: true
  }
  let result = await rp(option)
  return result
}
async function querySql (sql, params) {
  let serverConfig = await getServerConfig(4)
  let connConfig = {
    user: serverConfig.userName,
    password: serverConfig.passWord,
    server: serverConfig.ip,
    database: serverConfig.dataBase,
    connectionTimeout: 1500,
    requestTimeout: 3000000,
    port: serverConfig.port,
    // options: {
    //   encrypt: true // Use this if you're on Windows Azure
    // },
    pool: {
      min: 0,
      max: 100,
      idleTimeoutMillis: 3000000
    }
  }
  mssql.on('error', err => {
    console.log('SQL 链接错误', err)
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
async function setOneOrg () {
  let oneCardOrg = await querySql(`SELECT * FROM dbo.SYS_DEPARTMENT`, '')
  let oneCardList = oneCardOrg.recordsets[0]
  console.log('人员机构数量是', oneCardList.length)
  let dbOrg = await Org.find({type: 10}).lean(true)
  if (dbOrg.length) { // 只有当数据库中没有机构信息的时候跳过去重操作
    for (let db = 0; db < dbOrg.length; db++) {
      for (let card = 0; card < oneCardList.length; card++) {
        if (dbOrg[db].code == oneCardList[card].ID) {
          if (oneCardList[card].PARENTID != -1) {
            let parent = await Org.find({type: 10, code: oneCardList[card].PARENTID}).lean(true)
            await Org.updateMany({type: 10, 'code': dbOrg[db].code}, {'name': oneCardList[card].DEPTNAME, pid: parent[0]._id})
          }
          oneCardList.splice(card, 1)
        }
      }
    }
  }
  for (let item of oneCardList) {
    if (item.PARENTID === -1) { // 如果是一卡通中的根机构
      let org = await Org.findOne({type: 10, isroot: true}).lean(true)
      // let isHave = await Org.find({type: 10, name: item.DEPTNAME, code: item.ID}).lean(true)
      // if (!isHave.length) {
      await Org.create({
        name: item.DEPTNAME,
        type: 10,
        pid: org._id,
        code: item.ID,
        isroot: false
      })
      // }
    } else {
      let org = await Org.findOne({type: 10, code: item.PARENTID}).lean(true)
      await Org.create({
        name: item.DEPTNAME,
        type: 10,
        code: item.ID,
        pid: org._id,
        isroot: false
      })
    }
  }
  console.log('=====机构执行完毕')
}
async function getOneCardData () { // 获取一卡通的数据，并且同步
  await setOneOrg() // 首先同步机构信息
  // console.log('进入过滤人员数据的方法')
  let initPermission = await permissionModel.findOne({name: '通用权限组'}).lean(true)
  let userMsg = [] // 学生的信息
  let userList = [] // 要插入的学生数据
  let removeList = [] // 要删除的用户数据
  try {
    let oneCard = async () => {
      let user = []
      let findOneCardDB = await querySql(`select b.* from (SELECT IDSERIAL,max(IDNumber) as IDNumber FROM dbo.User_Infor_Message group by IDSERIAL) a left join dbo.User_Infor_Message b on a.IDSERIAL = b.IDSERIAL and a.IDNumber = b.IDNumber where b.MessageType in('0', '2', '3', '5', '6') order by a.IDNumber ASC`, '')
      let arr = findOneCardDB.recordsets[0]
      console.log('=========数据的length', arr.length)
      for (let i = 0; i < arr.length; i++) {
        let orgData = ''
        if (arr[i].DEPTSTR.trim() != 0) {
          orgData = await Org.findOne({'type': 10, code: `${arr[i].DEPTSTR.trim()}`}).lean(true)
        } else {
          orgData = await Org.findOne({'type': 10, isroot: true}).lean(true)
        }
        user.push({
          name: arr[0].USERNAME,
          org: orgData._id,
          type: 2,
          sex: (arr[0].SEX == 0) ? 2 : 1,
          code: arr[0].IDSERIAL,
          uid: arr[0].IDSERIAL,
          card: arr[0].CARDID.trim(),
          nationalCode: arr[0].NATCODE || '',
          permission: initPermission._id,
          isOneCard: true,
          guard: 2
        })
      }
      // let orgData = ''
      // if (!user.length) {
      //   if (arr[0].DEPTSTR.trim() != 0) {
      //     orgData = await Org.findOne({'type': 10, code: `${arr[0].DEPTSTR.trim()}`}).lean(true)
      //   } else {
      //     orgData = await Org.findOne({'type': 10, isroot: true}).lean(true)
      //   }
      //   user.push({
      //     name: arr[0].USERNAME,
      //     org: orgData._id,
      //     type: 2,
      //     sex: (arr[0].SEX == 0) ? 2 : 1,
      //     code: arr[0].IDSERIAL,
      //     uid: arr[0].IDSERIAL,
      //     card: arr[0].CARDID.trim(),
      //     nationalCode: arr[0].NATCODE || '',
      //     permission: initPermission._id,
      //     IdNumber: arr[0].IDNumber,
      //     isOneCard: true
      //   })
      // }
      // for (let i = 0; i < arr.length; i++) {
      //   let appendStatus = true
      //   let setStatus = true
      //   for (let j = 0; j < user.length; j++) {
      //     if (arr[i].IDSERIAL === user[j].u) {
      //       setStatus = false
      //       appendStatus = false
      //       if (arr[i].IDNumber > user[j].IdNumber) {
      //         let newOrgData = ''
      //         if (arr[0].DEPTSTR.trim() != 0) {
      //           newOrgData = await Org.findOne({'type': 10, code: `${arr[0].DEPTSTR.trim()}`}).lean(true)
      //         } else {
      //           newOrgData = await Org.findOne({'type': 10, isroot: true}).lean(true)
      //         }
      //         user[j].name = arr[i].USERNAME
      //         user[j].org = newOrgData._id
      //         user[j].sex = (arr[i].SEX == 0) ? 2 : 1
      //         user[j].code = arr[i].IDSERIAL
      //         user[j].uid = arr[i].IDSERIAL
      //         user[j].card = arr[i].CARDID.trim()
      //         user[j].nationalCode = arr[i].NATCODE || ''
      //       }
      //     } else {
      //       if (setStatus) {
      //         appendStatus = true
      //       }
      //     }
      //   }
      //   if (appendStatus) {
      //     let newOrgData = ''
      //     if (arr[0].DEPTSTR.trim() != 0) {
      //       newOrgData = await Org.findOne({'type': 10, code: `${arr[0].DEPTSTR.trim()}`}).lean(true)
      //     } else {
      //       newOrgData = await Org.findOne({'type': 10, isroot: true}).lean(true)
      //     }
      //     user.push({
      //       name: arr[i].USERNAME,
      //       org: newOrgData._id,
      //       type: 2,
      //       sex: (arr[i].SEX == 0) ? 2 : 1,
      //       code: arr[i].IDSERIAL,
      //       uid: arr[i].IDSERIAL,
      //       card: arr[i].CARDID.trim(),
      //       nationalCode: arr[i].NATCODE || '',
      //       permission: initPermission._id,
      //       IdNumber: arr[i].IDNumber,
      //       isOneCard: true
      //     })
      //     appendStatus = false
      //   }
      // }
      // arr.forEach((item) => {
      // let md5 = crypto.createHash('md5')
      // item.uid = md5.update(item.card, 'utf8').digest('hex')
      // item.uid = crypto.randomBytes(Math.ceil(32 / 2)).toString('hex').slice(0, 23)
      // })
      return user
    }
    let oneCardList = await oneCard()
    console.log('一卡通数据过滤完成', oneCardList.length)
    let dbData = await usersModel.find({}).lean(true)
    if (dbData.length) {
      dbData.forEach((db, i) => {
        let removeStatus = true
        oneCardList.forEach((card, j) => {
          if (db.uid === card.uid) {
            // db.name = card.name
            // db.org = card.org
            // db.code = card.code
            // // db.uid = card.uid
            // db.card = card.card
            // db.nationalCode = card.nationalCode
            removeStatus = false
            oneCardList.splice(j, 1)
          }
        })
        if (removeStatus && db.isOneCard) {
          removeList.push(db)
        }
      })
      userList = oneCardList
    } else {
      userList = oneCardList
    }
    let nationalDB = await querySql(`SELECT * FROM dbo.Nation_Ctrl`, '')
    let nationalData = nationalDB.recordsets[0]
    let removeId = removeList.map((item) => { return item._id })
    let veriFace = []
    // let serverConfig = await getServerConfig(1)
    for (let item of removeId) {
      let status = await zktecoDeleteUser(item)
      if (JSON.parse(status).code === 0) {
        if (item.image) {
          let arr = item.image.split('/')
          let url = arr[arr.length - 1]
          if (fs.existsSync(`${config.fileDirs.peopleDir}/${url}`)) {
            fs.unlinkSync(`${config.fileDirs.peopleDir}/${url}`)
          }
        }
        if (item.veriface) {
          veriFace.push(item.veriface)
        }
        if (item.faceId) {
          await senseTimeDeleteUser(item.faceId)
        }
        await usersModel.remove({'_id': item._id})
      }
    }
    if (veriFace.length) {
      eventDeleteUser(veriFace)
    }
    for (let item of userList) {
      nationalData.forEach((national) => {
        if (national.Code === item.nationalCode) {
          item.national = national.Name
        }
      })
      let status = await zktecoAddUser(item)
      console.log('=====这是中控的数据', status)
      // if (status.code === 0) {
      await zktecoAddPermission(item.code, initPermission.id)
      let userData = new usersModel(item)
      await userData.save()
      // }
      // let userData = new usersModel(item)
      // await userData.save()
    }
    // await zktecoPermissionDev(initPermission.id)
    console.log('添加成功用户数据的数量是', userList.length)
  } catch (err) {
    console.log('err获取一卡通========', err)
  }
}
async function asyncZkteco (type, list) { // 同步中控系统，添加或删除用户
  let permission = await doorPermission.find({}).lean(true)
  if (type === 'add') {
    for (let item of list) {
      try {
        let status = await zktecoAddUser(item)
        console.log('=====这是中控的数据', status)
        if (status.code === 0) {
          if (item.permissionName) {
            item.permission = []
            let setPermissionArr = []
            permission.forEach((per) => {
              item.permissionName.split(',').forEach((name) => {
                if (item.name === name) {
                  setPermissionArr.push(item.id)
                  item.permission.push(item._id)
                }
              })
            })
            await zktecoAddPermission(item.code, setPermissionArr.join(','), false)
          }
        }
      } catch (err) {
        console.log('====导入错误')
      }
    }
  } else {

  }
}
async function initOneCard () { // 初始化启动时若本地数据库没有数据则获取一卡通的数据添加到本库
  try {
    // let userLength = await usersModel.find({}).lean(true)
    let userLength = await usersModel.countDocuments({})
    if (!userLength) {
      await setOneOrg()
      let initPermission = await permissionModel.findOne({name: '通用权限组'}).lean(true)
      let oneCard = async () => {
        let user = []
        let findOneCardDB = await querySql(`select b.* from (SELECT IDSERIAL,max(IDNumber) as IDNumber FROM dbo.User_Infor_Message group by IDSERIAL) a left join dbo.User_Infor_Message b on a.IDSERIAL = b.IDSERIAL and a.IDNumber = b.IDNumber where b.MessageType in('0', '2', '3', '5', '6') order by a.IDNumber ASC`, '')
        let arr = findOneCardDB.recordsets[0]
        console.log('=========数据的length', arr.length)
        for (let i = 0; i < arr.length; i++) {
          let newOrgData = ''
          if (arr[i].DEPTSTR.trim() != 0) {
            newOrgData = await Org.findOne({'type': 10, code: `${arr[i].DEPTSTR.trim()}`}).lean(true)
          } else {
            newOrgData = await Org.findOne({'type': 10, isroot: true}).lean(true)
          }
          user.push({
            name: arr[i].USERNAME,
            org: newOrgData._id,
            type: 2,
            sex: (arr[i].SEX == 0) ? 2 : 1,
            code: arr[i].IDSERIAL,
            uid: arr[i].IDSERIAL,
            card: arr[i].CARDID.trim(),
            nationalCode: arr[i].NATCODE || '',
            permission: initPermission._id,
            IdNumber: arr[i].IDNumber,
            isOneCard: true,
            guard: 2
          })
        }
        return user
      }
      let oneCardList = await oneCard()
      console.log('一卡通数据过滤完成', oneCardList.length)
      let nationalDB = await querySql(`SELECT * FROM dbo.Nation_Ctrl`, '')
      let nationalData = nationalDB.recordsets[0]
      for (let item of oneCardList) {
        nationalData.forEach((national) => {
          if (national.Code === item.nationalCode) {
            item.national = national.Name
          }
        })
      }
      console.log('准备加入数据的', oneCardList.length)
      await usersModel.create(oneCardList)
      console.log('添加完成')
    }
  } catch (err) {
    console.log('初始化人员信息出错', err)
  }
}
initOneCard()
module.exports = {
  async getOneCardOrg () { // 从一卡通处获取相关机构信息,并写入数据库
    await setOneOrg()
  },
  async getOneCard (ctx, next) {
    await getOneCardData()
  },
  async created (ctx, next) { // 创建用户
    try {
      if (ctx.request.body.name && ctx.request.body.uid) {
        let isHave = []
        if (ctx.request.body.card) {
          isHave = await usersModel.find({$or: [{card: ctx.request.body.card}, {uid: ctx.request.body.uid}]})
        } else {
          isHave = await usersModel.find({$or: [{uid: ctx.request.body.uid}]})
        }
        if (isHave.length) {
          ctx.body = {
            code: 500,
            message: '添加失败,卡号或编号重复'
          }
        } else {
          // if (ctx.request.body.permission.length) {
          //   ctx.request.body.guard = 2
          // } else if (ctx.request.body.facePermission.length) {

          // } else if (ctx.request.body.permission.length && ctx.request.body.facePermission.length) {
          //   ctx.request.body.guard = 4
          // }
          if (ctx.request.body.permission.length) {
            ctx.request.body.guard = 2
          }
          if (ctx.request.body.facePermission.length) {
            ctx.request.body.guard = 3
          }
          if (ctx.request.body.permission.length && ctx.request.body.facePermission.length) {
            ctx.request.body.guard = 4
          }
          ctx.request.body.code = Date.now()
          let userData = new usersModel({
            name: ctx.request.body.name,
            sex: ctx.request.body.sex,
            uid: ctx.request.body.uid,
            national: ctx.request.body.national,
            phone: ctx.request.body.phone,
            type: ctx.request.body.type,
            card: ctx.request.body.card || '',
            image: ctx.request.body.url,
            org: ctx.request.body.orgId,
            codeAddress: ctx.request.body.codeAddress,
            liveAddress: ctx.request.body.liveAddress,
            failure: ctx.request.body.failure || '',
            isActivation: ctx.request.body.isActivation,
            guard: ctx.request.body.guard,
            code: ctx.request.body.code,
            isOneCard: false
          })
          let data = await userData.save()
          let status = await zktecoAddUser(ctx.request.body)
          if (status.code === 0) {
            if (ctx.request.body.permission.length) { // 如果有设置了门禁权限
              let serverConfig = await getServerConfig(1)
              ctx.request.body.guard = 4
              let permission = await permissionModel.find({'_id': {$in: ctx.request.body.permission}}).lean(true)
              let permissionId = permission.map((item) => {
                return item.id
              })
              let permissionIdStr = permissionId.join(',')
              // await rp({
              //   method: 'POST',
              //   uri: `http://${serverConfig.ip}:${serverConfig.port}/api/accLevel/syncPerson?pin=${data.uid}&levelIds=${permissionIdStr}&access_token=${serverConfig.token}`
              // })
              await zktecoAddPermission(data.code, permissionIdStr)
              if (ctx.request.body.url && ctx.request.body.facePermission.length) {
                await usersModel.updateMany({'_id': data._id}, {'$set': {'permission': ctx.request.body.permission, 'guard': 4}})
              } else {
                await usersModel.updateMany({'_id': data._id}, {'$set': {'permission': ctx.request.body.permission, 'guard': 2}})
              }
            }
            if (ctx.request.body.url && ctx.request.body.facePermission.length) { // 如果有上传人员并且设置了人脸权限，则需要给商汤人像库中创建人员
              let fileStr = ctx.request.body.url.split('/')
              let fileName = fileStr[fileStr.length - 1]
              let fileType = fileName.split('.')
              let file = fs.readFileSync(`${config.fileDirs.peopleDir}/${fileName}`)
              let base64 = Buffer.from(file, 'binary').toString('base64') // base64编码
              let base64str = `data:image/${fileType[1]};base64,${base64}`
              await refreshToken.refreshToken()
              let serverConfig = await getServerConfig(2)
              let parameter = {
                ID: ctx.request.body.uid,
                enableState: 1,
                gender: ctx.request.body.sex,
                image: base64str,
                libraryIds: ctx.request.body.facePermission,
                libraryType: (ctx.request.body.type === 2) ? 2 : 1,
                name: ctx.request.body.name,
                replace: 0,
                activationTime: moment().format('YYYY-MM-DD HH:mm:ss')
              }
              if (ctx.request.body.failure) {
                parameter.expirationTime = ctx.request.body.failure
              }
              let result = await rp({
                method: 'POST',
                uri: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-watchlist-management/api/v1/targets`,
                body: parameter,
                headers: {
                  accessToken: global.senseTimeToken.token
                },
                json: true
              })
              if (result.targetId) {
                if (ctx.request.body.permission.length) {
                  await usersModel.updateMany({'_id': data._id}, {'$set': {'faceId': result.targetId, 'facePermission': ctx.request.body.facePermission, 'guard': 4}})
                } else {
                  await usersModel.updateMany({'_id': data._id}, {'$set': {'faceId': result.targetId, 'facePermission': ctx.request.body.facePermission, 'guard': 3}})
                }
              }
            }
            ctx.body = {
              code: 200,
              message: 'success',
              data: data
            }
          } else {
            ctx.body = {
              code: 500,
              message: '第三方存储失败,可能卡号重复'
            }
          }
        }
      } else {
        ctx.body = {
          code: 500,
          message: '人员编号和姓名不能为空'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '创建失败' })
    }
  },
  async getList (ctx, next) { // 获取用户列表
    let pageSize = parseInt(ctx.query.pageSize)
    let pageNum = parseInt(ctx.query.pageNum)
    function formaFn (data) { // 格式化关联机构查询数据
      let arr = []
      data.forEach((item) => {
        item.orgName = item.org.name
        item.orgId = item.org._id
        delete item.org
        arr.push(item)
      })
      return arr
    }
    let orgIdArr = [ctx.query.orgId] // 机构ID数组
    async function getOrgList (orgId) { // 递归获取所有机构的机构ID
      try {
        let getOrgData = await Org.aggregate([{ $match: { pid: mongoose.Types.ObjectId(orgId) } }])
        if (getOrgData.length) {
          for (let i = 0; i < getOrgData.length; i++) {
            orgIdArr.push(getOrgData[i]._id)
            await getOrgList(getOrgData[i]._id)
          }
        }
      } catch (err) {
        console.log('err', err)
        ctx.throw(500, { code: 500, message: '递归格式化机构出错' })
      }
    }
    let query = ctx.request.query
    let findDbData = {}
    if (parseInt(query.guard) !== 5) { // 如果需要筛选同步状态类型
      findDbData.guard = parseInt(query.guard)
    }
    if (parseInt(query.type) !== 3) { // 如果获取的全部类型的人员
      findDbData.type = parseInt(query.type)
    }
    if (query.showChildren === 'true') { // 如果开启显示子机构下的数据
      await getOrgList(ctx.query.orgId)
    }
    if (query.keyWord) { // 如果是搜索
      let keyStr = new RegExp(query.keyWord.trim(), 'i') // 不区分大小写
      findDbData.$or = [
        {"name": {$regex: keyStr}},
        {"uid": {$regex: keyStr}}
      ]
      delete findDbData.keyWord
    }
    findDbData.org = {
      $in: orgIdArr
    }
    try {
      let count = await usersModel.countDocuments(findDbData)
      let data = await usersModel.find(findDbData, null, {skip: (pageNum - 1) * pageSize, limit: pageSize}).populate('org').sort({'_id': -1}).lean(true)
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
  async deleteUser (ctx, next) { // 删除对应用户
    /*
    * 删除用户还需在第三方也删除
    * */
    try {
      let userData = await usersModel.find({'_id': {$in: ctx.request.body.arr}}).lean(true)
      let veriFace = []
      let fail = []
      for (let item of userData) {
        let status = await zktecoDeleteUser(item)
        if (JSON.parse(status).code === 0) {
          if (item.image) {
            let arr = item.image.split('/')
            let url = arr[arr.length - 1]
            if (fs.existsSync(`${config.fileDirs.peopleDir}/${url}`)) {
              fs.unlinkSync(`${config.fileDirs.peopleDir}/${url}`)
            }
          }
          if (item.veriface) {
            veriFace.push(item.veriface)
          }
          if (item.faceId) {
            await senseTimeDeleteUser(item.faceId)
          }
          await usersModel.remove({'_id': item._id})
        } else {
          fail.push(item)
        }
      }
      eventDeleteUser(veriFace) // 对人像识别底库管理发布删除事件
      if (fail.length) {
        ctx.body = {
          code: 500,
          message: `删除失败${fail.length}人`
        }
      } else {
        ctx.body = {
          code: 200,
          message: '成功'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '删除数据出错' })
    }
  },
  async deleteOrgUser (ctx, next) { // 删除相关机构下的人员
    /*
    * 删除用户还需在第三方也删除
    * */
    try {
      let userData = await usersModel.find({'org': ctx.request.body.org}).lean(true)
      let veriFace = []
      for (let item of userData) {
        let status = await zktecoDeleteUser(item)
        if (JSON.parse(status).code === 0) {
          if (item.image) {
            let arr = item.image.split('/')
            let url = arr[arr.length - 1]
            if (fs.existsSync(`${config.fileDirs.peopleDir}/${url}`)) {
              fs.unlinkSync(`${config.fileDirs.peopleDir}/${url}`)
            }
          }
          if (item.veriface) {
            veriFace.push(item.veriface)
          }
          await usersModel.remove({'_id': item._id})
        }
      }
      eventDeleteUser(veriFace) // 对人像识别底库管理发布删除事件
      let data = await usersModel.remove({'org': ctx.request.body.org})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '删除数据出错' })
    }
  },
  async deleteAllUser (ctx, next) { // 删除全部用户
    /*
    * 删除全部用户数据，还需要在第三方同步
    * */
    try {
      let userData = await usersModel.find({}).lean(true)
      let veriFace = []
      for (let item of userData) {
        let status = await zktecoDeleteUser(item)
        if (JSON.parse(status).code === 0) {
          if (item.image) {
            let arr = item.image.split('/')
            let url = arr[arr.length - 1]
            if (fs.existsSync(`${config.fileDirs.peopleDir}/${url}`)) {
              fs.unlinkSync(`${config.fileDirs.peopleDir}/${url}`)
            }
          }
          if (item.veriface) {
            veriFace.push(item.veriface)
          }
          if (item.faceId) {
            await senseTimeDeleteUser(item.faceId)
          }
          await usersModel.remove({'_id': item._id})
        }
      }
      eventDeleteUser(veriFace) // 对人像识别底库管理发布删除事件
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '删除失败' })
    }
  },
  async edit (ctx, next) { // 编辑用户
    /*
    * 编辑用户信息，还需要在第三方也更新用户信息
    * */
    try {
      let userPermission = await usersModel.find({'_id': ctx.request.body._id}).populate('permission').lean(true)
      ctx.request.body.uid = userPermission[0].uid
      let status = await zktecoAddUser(ctx.request.body) // 首先更新中控的用户信息
      console.log('=====编辑中控用户', status, ctx.request.body)
      if (status.code === 0) {
        if (ctx.request.body.facePermission.length) {
          await refreshToken.refreshToken()
          let faceParameter = {
            ID: ctx.request.body.uid,
            enableState: 1,
            gender: ctx.request.body.sex,
            libraryIds: userPermission[0].facePermission,
            libraryType: (ctx.request.body.type === 2) ? 2 : 1,
            name: ctx.request.body.name,
            replace: 0,
            expirationTime: ctx.request.body.failure,
            activationTime: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          if (ctx.request.body.url) {
            let fileStr = ctx.request.body.url.split('/')
            let fileName = fileStr[fileStr.length - 1]
            let fileType = fileName.split('.')
            let file = fs.readFileSync(`${config.fileDirs.peopleDir}/${fileName}`)
            let base64 = Buffer.from(file, 'binary').toString('base64') // base64编码
            let base64str = `data:image/${fileType[1]};base64,${base64}`
            faceParameter.image = base64str
            let serverConfig = await getServerConfig(2)
            await rp({
              method: 'PUT',
              uri: `http://${serverConfig.ip}:${serverConfig.port}/senseguard-watchlist-management/api/v1/targets/${userPermission[0].faceId}`,
              body: faceParameter,
              headers: {
                accessToken: global.senseTimeToken.token
              },
              json: true
            })
          }
        }
        ctx.request.body.image = ctx.request.body.url
        await usersModel.findByIdAndUpdate({'_id': ctx.request.body._id}, ctx.request.body, {new: true})
        ctx.body = {
          code: 200,
          message: 'success'
        }
      } else {
        ctx.body = {
          code: 500,
          message: '第三方数据写入失败'
        }
      }
    } catch (err) {
      console.log('err==========', err)
      ctx.throw(500, { code: 500, message: '更新数据出错' })
    }
  },
  async orgModify (ctx, next) { // 修改用户机构
    try {
      let data = await usersModel.findByIdAndUpdate({'_id': ctx.request.body._id}, {org: ctx.request.body.org}, {new: true})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '更新机构出错' })
    }
  },
  async importExcel (ctx, next) { // 通过excel导入用户数据
    try {
      const userInfo = xlsx.parse(ctx.request.body.files.file.path)
      let successArr = []
      let failArr = []
      let headKey = userInfo[0].data.shift()
      let uidArr = []
      if (userInfo[0].data.length > 20000) { // 一次导入的数据不能大于两万
        ctx.body = {
          code: 500,
          message: '一次导入数据不能大于两万'
        }
      } else {
        userInfo[0].data.forEach((item) => {
          let data = {
            name: item[0] || '', // 名字
            uid: item[2] || '', // 编号
            national: item[3] || '', // 民族
            phone: item[4] || '', // 联系方式
            codeAddress: item[5] || '', // 身份证地址
            liveAddress: item[6] || '', // 居住地址
            card: item[7] || '', // 人员卡号
            orgName: item[3] || '', // 机构名称
            org: ctx.query.org, // 机构ID
            type: 2, // 人员类型
            code: Date.now()
            // permissionName: item[9] || '' // 权限名称
          }
          if (item[8]) { // 失效时间
            let time = moment(new Date(1900, 0, item[8] - 1)).unix()
            data.failure = moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
          } else {
            data.failure = ''
          }
          if (item[1] === '男') { // 性别
            data.sex = 1
          } else if (item[1] === '女') {
            data.sex = 2
          } else {
            data.sex = ''
          }
          if (data.uid && data.name) { // 人员编号 & 姓名 为必填项 如果不填写在默认该条导入失败
            successArr.push(data)
            uidArr.push(data.uid)
          } else {
            failArr.push(data)
          }
        })
        let append = successArr
        let validationId = [...new Set(uidArr)]
        let dbDataMore = await usersModel.find({ // 查询数据库中已有的数据
          'uid': {
            $in: validationId
          }
        }).lean(true)
        dbDataMore.forEach((db, i) => {
          append.forEach((card, j) => {
            if (db.uid === card.uid) {
              failArr.push(card)
              append.splice(j, 1)
            }
          })
        })
        ctx.body = {
          code: 200,
          failLength: failArr.length,
          fail: failArr,
          success: append,
          successLength: append.length,
          message: '添加成功，请等待下发至门禁系统'
        }
        fs.unlinkSync(ctx.request.body.files.file.path)
        if (append.length) {
          await usersModel.create(append)
          asyncZkteco('add', append)
          // for (let i = 0; i < append.length; i++) {
          // if (append[i].typeName === '黑名单') {
          //   append[i].type = 0
          // } else {
          //   append[i].type = 1
          // }
          // orgList.forEach((orgData) => {
          //   if (append[i].orgName === orgData.name) {
          //     append[i].org = orgData._id
          //   }
          // })
          // let status = await zktecoAddUser(append[i])
          // if (status.code === 0) {
          //   if (append[i].permissionName) {
          //     append[i].permission = []
          //     let setPermissionArr = []
          //     permission.forEach((item) => {
          //       append[i].permissionName.split(',').forEach((name) => {
          //         if (item.name === name) {
          //           setPermissionArr.push(item.id)
          //           append[i].permission.push(item._id)
          //         }
          //       })
          //     })
          //     await zktecoAddPermission(append[i].code, setPermissionArr.join(','), false)
          //   }
          //   let userData = new usersModel(append[i])
          //   await userData.save()
          // } else {
          //   failArr.push(append[i])
          //   // append.splice(i, 1)
          //   append[i].status = false
          // }
          // }
          // append.forEach((item, index) => {
          //   if (item.status === false) {
          //     append.splice(index, 1)
          //   }
          // })
        }
      }
    } catch (err) {
      console.log('err================', err)
      ctx.throw(500, { code: 500, message: '导入失败' })
    }
  },
  async batchImportUser (ctx, next) { // 解析图片之后批量添加用户
    let type = ctx.request.body.type
    let data = ctx.request.body.data
    try {
      let successArr = []
      let fileArr = []
      if (type === 'a') { // 如果是卡号匹配
        let cardArr = []
        data.forEach((item) => { // 先检验卡号是否为空，如果为空则默认为导入失败
          if (item.card) {
            cardArr.push(item)
          } else {
            fileArr.push(item)
          }
        })
        let cardIdArr = cardArr.map((item) => {
          return item.card
        })
        console.log('=====', cardIdArr)
        let dbData = await usersModel.find({ // 检查数据库中已经存在的卡号数据
          'card': {
            $in: cardIdArr
          }
        })
        if (dbData.length) {
          dbData.forEach((db, i) => { // 去除掉不存在的卡号
            cardArr.forEach((card, j) => {
              if (card.card === db.card) {
                successArr.push(card)
                cardArr.splice(j, 1)
              }
            })
          })
          // cardArr.forEach((item) => {
          //   async function updateUser () {
          //     await usersModel.updateMany({'card': item.card}, {'image': item.url})
          //   }
          //   updateUser()
          // })
          for (let item of successArr) {
            await usersModel.updateMany({'card': item.card}, {'image': item.url})
          }
        }
        fileArr = [...fileArr, ...cardArr]
      } else if (type === 'b') { // 如果是人员编号匹配
        let uidArr = []
        data.forEach((item) => {
          if (item.uid) {
            uidArr.push(item)
          } else {
            fileArr.push(item)
          }
        })
        let userIdArr = uidArr.map((item) => {
          return item.uid
        })
        let dbData = await usersModel.find({ // 检查数据库中已经存在的人员编号数据
          'uid': {
            $in: userIdArr
          }
        })
        if (dbData.length) {
          dbData.forEach((db, i) => { // 去除掉不存在的手机号
            uidArr.forEach((user, j) => {
              if (user.uid === db.uid) {
                successArr.push(user)
                uidArr.splice(j, 1)
              }
            })
          })
          fileArr = uidArr
          // successArr.forEach((item) => {
          //   async function updateUser () {
          //     await usersModel.updateMany({'phone': item.phone}, {'image': item.url})
          //   }
          //   updateUser()
          // })
          for (let item of successArr) {
            await usersModel.updateMany({'uid': item.uid}, {'image': item.url})
          }
        }
        fileArr = [...fileArr, ...uidArr]
      } else if (type === 'c') { // 如果是都不匹配
        // let orgData = await getOrg(ctx)
        let cardIdArr = []
        let uidArr = []
        data.forEach((item) => {
          if (item.name) {
            if (item.uid === 'null') { // 如果uid为null则需要自动生成
              let md5 = crypto.createHash('md5')
              item.uid = md5.update(`${item.name}${Date.now()}`, 'utf8').digest('hex')
            }
            if (item.card === 'null') { // 为避免数据库中存入null
              item.card = ''
            }
            if (item.sex === null) { // 性别不能为null 默认会转为男
              item.sex = 1
            } else {
              if (item.sex === '男') {
                item.sex = 1
              } else {
                item.sex = 2
              }
            }
            item.code = Date.now()
            uidArr.push(item.uid)
            cardIdArr.push(item.card)
            successArr.push(item)
          } else {
            fileArr.push(item)
          }
        })
        let dbDataIdHave = await usersModel.find({ // 检验人员编号和卡号的唯一性
          '$or': [
            {uid: {'$in': uidArr}},
            {card: {'$in': cardIdArr}}
          ]
        }).lean(true)
        if (dbDataIdHave.length) {
          dbDataIdHave.forEach((db, i) => {
            successArr.forEach((item, j) => {
              if (item.uid === db.uid || item.card === db.card) {
                fileArr.push(item)
                successArr.splice(j, 1)
              }
            })
          })
        }
        // let serverConfig = await getServerConfig(1)
        if (successArr.length) {
          await usersModel.create(successArr)
        }
        // for (let i = 0; i < successArr.length; i++) {
        //   successArr[i].org = ctx.request.body.orgId
        //   // let status = await zktecoDeleteUser(successArr[i])
        //   // if (status.code === 0) {
        //   let userData = new usersModel(successArr[i])
        //   await userData.save()
        //   // } else {
        //   //   fileArr.push(successArr[i])
        //   //   successArr.splice(i, 1)
        //   // }
        // }
      }
      if (type === 'c') {
        ctx.body = {
          code: 200,
          success: successArr,
          successLength: successArr.length,
          file: fileArr,
          fileLength: fileArr.length,
          message: '请等待下发至门禁系统'
        }
        await asyncZkteco('add', successArr)
      } else {
        ctx.body = {
          code: 200,
          type: type,
          success: successArr,
          successLength: successArr.length,
          file: fileArr,
          fileLength: fileArr.length
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '导入失败' })
    }
  },
  async deleteFileImage (ctx, next) { // 删除通过图片导入用户数据失败的的图片
    try {
      ctx.request.body.list.forEach((item) => {
        fs.unlinkSync(`${config.fileDirs.peopleDir}/${item}`)
      })
      ctx.body = {
        code: 200,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '删除失败' })
    }
  },
  async setUserVeriFace (ctx, next) { // 设置人像管理中对应用户的_id
    try {
      let userData = {
        veriface: ctx.request.body.veriface
      }
      let data = await usersModel.findByIdAndUpdate({'_id': ctx.request.body._id}, userData, {new: true, runValidators: true})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '更新机构出错' })
    }
  },
  async exportExcelUser (ctx, next) { // 用户导出为Excel
    let query = ctx.request.body
    let orgIdArr = [query.orgId] // 机构ID数组
    async function getOrgList(orgId) { // 递归获取所有子机构的机构ID
      try {
        let getOrgData = await Org.aggregate([{
          $match: {
            pid: mongoose.Types.ObjectId(orgId)
          }
        }])
        if (getOrgData.length) {
          for (let i = 0; i < getOrgData.length; i++) {
            orgIdArr.push(getOrgData[i]._id)
            await getOrgList(getOrgData[i]._id)
          }
        }
      } catch (err) {
        console.log('err', err)
        ctx.throw(500, {
          code: 500,
          message: '递归格式化机构出错'
        })
      }
    }
    let findDbData = {}
    if (parseInt(query.guard) !== 5) { // 如果需要筛选同步状态类型
      findDbData.guard = parseInt(query.guard)
    }
    if (parseInt(query.type) !== 3) { // 如果获取的全部类型的人员
      findDbData.type = parseInt(query.type)
    }
    if (query.showChildren === true) { // 如果开启显示子机构下的数据
      await getOrgList(query.orgId)
    }
    findDbData.org = {
      $in: orgIdArr
    }
    try {
      console.log('查询条件是', findDbData)
      let user = await usersModel.find(findDbData).populate('org').sort({'_id': -1})
      ctx.body = {
        code: 200,
        data: user,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '查询数据出错' })
    }
  },
  async zipUser (ctx, next) { // 将对应的用户图片打成ZIP包
    let query = ctx.request.body
    let orgIdArr = [query.orgId] // 机构ID数组
    async function getOrgList (orgId) { // 递归获取所有机构的机构ID
      try {
        let getOrgData = await Org.aggregate([{ $match: { pid: mongoose.Types.ObjectId(orgId) } }])
        if (getOrgData.length) {
          for (let i = 0; i < getOrgData.length; i++) {
            orgIdArr.push(getOrgData[i]._id)
            await getOrgList(getOrgData[i]._id)
          }
        }
      } catch (err) {
        console.log('err', err)
        ctx.throw(500, { code: 500, message: '递归格式化机构出错' })
      }
    }
    let findDbData = {}
    if (parseInt(query.guard) !== 5) { // 如果需要筛选同步状态类型
      findDbData.guard = parseInt(query.guard)
    }
    if (parseInt(query.type) !== 3) { // 如果获取的全部类型的人员
      findDbData.type = parseInt(query.type)
    }
    if (query.showChildren === true) { // 如果开启显示子机构下的数据
      await getOrgList(ctx.query.orgId)
    }
    try {
      let user = await usersModel.find(findDbData)
      const compute = fork(path.join(__dirname, './zipUser.js'))
      let exportData = new exportModel({
        timeMS: new Date().getTime(),
        status: false
      })
      let dbData = await exportData.save()
      compute.send(user)
      // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
      function watchFileName () {
        return new Promise((resolve, reject) => {
          compute.on('message', (name) => {
            resolve(name)
            compute.kill()
          })
        })
      }
      function watchChildren () {
        return new Promise((resolve, reject) => {
          compute.on('close', (code, signal) => {
            // console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`)
            console.log('压缩完成')
            compute.kill()
            resolve('ok')
          })
        })
      }
      let fileName = await watchFileName()
      await watchChildren()
      let data = await exportModel.findByIdAndUpdate({'_id': dbData._id}, {status: true, url: `${fileName}`}, {new: true, runValidators: true})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '查询数据出错' })
    }
  },
  async downZip (ctx, next) { // 根据文件名，下载ZIP包
    try {
      const name = ctx.params.name
      const path = `${config.fileDirs.peopleDir}/${name}`
      if (fs.existsSync(path)) { // 检查文件是否存在
        await send(ctx, path, { root: '/' })
      } else {
        ctx.body = {
          name: name,
          path: path,
          status: '文件不存在'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '下载出错' })
    }
  },
  async zipList (ctx, next) { // 获取导出用户的记录
    try {
      let data = await exportModel.find({})
      ctx.body = {
        code: 200,
        data: data,
        message: 'success'
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '获取记录失败' })
    }
  },
  async deleteZip (ctx, next) { // 删除对应zip包
    try {
      let data = await exportModel.findOne({'_id': ctx.request.body.id}).lean(true)
      let path = `${config.fileDirs.peopleDir}/${data.url}`
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
        await exportModel.remove({'_id': ctx.request.body.id})
        ctx.body = {
          code: 200,
          message: 'success'
        }
      } else {
        ctx.body = {
          code: 500,
          message: '文件不存在'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, { code: 500, message: '删除失败' })
    }
  },
  async downTemplate(ctx, next) { // 下载导入人员模版
    try {
      const name = ctx.params.name
      const PATH = path.join(__dirname, './template.xlsx')
      console.log('path', PATH)
      if (fs.existsSync(PATH)) { // 检查文件是否存在
        await send(ctx, PATH, {
          root: '/'
        })
      } else {
        ctx.body = {
          name: name,
          path: PATH,
          status: '文件不存在'
        }
      }
    } catch (err) {
      console.log('err', err)
      ctx.throw(500, {
        code: 500,
        message: '下载出错'
      })
    }
  },
  async setImage (ctx, next) {
    ctx.body = {
      code: 200
    }
    let user = await usersModel.find({}).lean(true)
    let index222 = 0
    console.log('人员数据是', user.length)
    try {
      for (let item = 0; item < user.length; item++) {
        let PATH = `${config.fileDirs.peopleDir}/${user[item].uid}.jpeg`
        if (fs.existsSync(PATH)) {
          let newData = await usersModel.findByIdAndUpdate({
            '_id': user[item]._id
          }, {
            image: `/image/peopleDir/${user[item].uid}.jpeg`
          }, {
            new: true
          })
          console.log('更新成功', index222++, newData)
        }
      }
    } catch (err) {
      console.log('======错误是', err)
    }
  }
}
