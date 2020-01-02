/*
 * @Author: linhang
 * @Date: 2018-10-19 16:53:32
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-18 18:53:10
 */
'use strict'
const mongoose = require('mongoose')
const RoleModel = mongoose.model('Role')
const UserModel = mongoose.model('User')
const secrets = require('../../../../config').backend.secrets
const Security = require('mongoose').model('Security')
const jwt = require('jsonwebtoken')
const store = require('../../../common/store')
const Strategy = mongoose.model('Strategy')
const Action = mongoose.model('Action')
const tool = require('../../../common/tools')
const Role = mongoose.model('Role')
const UserLog = mongoose.model('UserLog')
const LogDetail = mongoose.model('LogDetail')
const AlarmEvent = mongoose.model('AlarmEvent')
const DutyLog = mongoose.model('DutyLog')
const ChangeLog = mongoose.model('changeDutyLog')
const _ = require('lodash')
const paging = require('../../paging')
const moment = require('moment')
const Schema = mongoose.Schema
const getDb = require('../../../common/logdb')
const redis = require('../../../config/redis')
const xlsx = require('node-xlsx')
const AlarmLogSchema = new mongoose.Schema({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  srcName: String,
  deal: Boolean,
  level: Number,
  alarmClassifyId: {
    type: Schema.Types.ObjectId,
    ref: 'alarmType'
  },
  // 报警类型
  eventType: String,
  time: Number
})
// 1|账户，2|ukey,3|账户/ukey,4|账户&ukey
const LOGIN_TYPE = {
  TYPE_ONE: 1,
  TYPE_TWO: 2,
  TYPE_THREE: 3,
  TYPE_FOUR: 4
}
let loginData = {}
class User {
  /**
   * 用户管理首页数据
   */
  async index () {
    try {
      const [roles, users] = await Promise.all([
        await RoleModel.find({}, 'name')
          .sort({ order: 1 })
          .lean()
          .exec(),
        await UserModel.find({}, 'name role exptime order')
          .sort({ order: 1 })
          .lean()
          .exec()
      ])
      const now = moment().format('X')
      const loginUsers = await redis.keys('*user')
      users.forEach(item => {
        if (item.exptime !== -1 && item.exptime < now) {
          item.state = 'expired'
        } else if (loginUsers.includes(item._id + 'user')) {
          item.state = 'online'
        } else {
          item.state = 'offline'
        }
      })
      // users.forEach(item => {
      //   item.state = 'online'
      // })
      const root = {
        _id: '1',
        name: '用户列表'
      }
      // 给roles数组中每条数据加字段pid,指向root的_id
      for (let item of roles) {
        item.pid = '1'
      }
      for (let item of roles) {
        const children = []
        for (let i in users) {
          if (users[i].role.toString() === item._id.toString()) {
            children.push(users[i])
          }
        }
        item.children = children
      }
      root.children = roles
      return root
    } catch (err) {
      throw err
    }
  }
  /**
   * 根据id查找账户
   * @param {*} id
   */
  async findById (id) {
    try {
      const user = await UserModel.findById(id)
        .lean()
        .exec()
      return user
    } catch (err) {
      throw err
    }
  }
  /**
   * 增加用户
   * @param {*} userObj
   */
  async create (userObj) {
    try {
      const orders = await UserModel.distinct('order')
      orders.sort((a, b) => {
        return b - a
      })
      userObj.order = orders[0] + 1
      const user = await UserModel.findOne({ name: userObj.name }).exec()
      if (user) {
        throw new Error('用户名重复')
      }
      await UserModel.create(userObj)
    } catch (err) {
      throw err
    }
  }
  /**
   * 修改用户
   * @param {*} id
   * @param {*} userObj
   */
  async update (id, userObj) {
    try {
      const user = await UserModel.findOne({ name: userObj.name, _id: { $ne: id } }).exec()
      if (user) {
        throw new Error('用户名重复')
      }
      await UserModel.findByIdAndUpdate(id, userObj).exec()
    } catch (err) {
      throw err
    }
  }
  /**
   * 删除用户
   * @param {*} id
   */
  async delete (id) {
    try {
      await UserModel.findByIdAndRemove(id).exec()
    } catch (err) {
      throw err
    }
  }
  /**
   * 用户登录
   * @param {*} device
   * @param {*} postData
   */
  async login (device, postData) {
    try {
      const that = this
      const now = moment().format('X')
      if (device === 'SENTRY') {
        // 手机端登录
        let [user, isValid] = [null, false]
        if (!postData.sn) {
          return { code: 0, message: '巡更人员设备sn码没有传入' }
        }
        if (postData.nfc) {
          user = await Security.findOne({ nfc: postData.nfc }, 'name affiliation _id period status').exec()
          isValid = user
        } else {
          user = await Security.findOne(
            { username: postData.name },
            'name affiliation period status salt hashedPassword'
          ).exec()
          isValid = user && user.encryptPassword(postData.pwd, user.salt) === user.hashedPassword
        }
        if (isValid) {
          if (user.status === 2) {
            return {
              code: 0,
              msg: '该账户已经被冻结,请联系管理员!'
            }
          }

          if (!user.period.unlimited && user.period.expried + 24 * 60 * 60 < now) {
            return {
              code: 0,
              msg: '该账户已经过期,请重新登录!'
            }
          }
          const token = jwt.sign(
            { _id: user._id, username: user.username, affiliation: user.affiliation },
            secrets.session,
            { expiresIn: '1d' }
          )
          user.sn = postData.sn
          await user.save()
          return {
            username: user.username,
            userId: user._id,
            affiliation: user.affiliation,
            token: token,
            code: 200
          }
        } else {
          return {
            code: 0,
            msg: '用户名或密码错误!'
          }
        }
      } else {
        // PC端登录
        let userQuery
        const strategy = await Strategy.findOne().exec()
        // 判断账户是否被锁定
        const lockData = store.getLoginTimes(postData.name)
        if (lockData && lockData.times >= strategy.loginCount - 1) {
          store.unlockUser(postData.name, strategy.lockTime)
          return {
            code: 0,
            msg: `该账户已被锁定，请${strategy.lockTime}秒后再试！`
          }
        }
        // 账户密码登录
        let userData
        if (_.has(postData, 'name') && _.has(postData, 'pwd')) {
          userData = await UserModel.findOne({ name: postData.name, pwd: postData.pwd })
            .populate('role')
            .lean()
          if (!userData) {
            store.setLoginTimes(postData.name, strategy.lockTime * 1000)
            let loginTimes = store.getLoginTimes(postData.name)
            return {
              code: 0,
              msg: `用户名或密码错误！已经连续输错${loginTimes.times}次,连续输错${strategy.loginCount}次后,账户会被锁定${strategy.lockTime}秒!`
            }
          }
        }
        // ukey登录
        if (_.has(postData, 'key')) {
          userData = await UserModel.findOne({ ukey: postData.key })
            .populate('role')
            .lean()
          if (!userData) {
            return {
              code: 0,
              msg: '请插入可用Ukey！'
            }
          }
        }
        // 如果是admin登录，不受登录策略的限制
        if (userData.name === 'admin' && _.has(postData, 'name') && _.has(postData, 'pwd')) {
          userQuery = { name: postData.name, pwd: postData.pwd }
          const adminUser = await UserModel.findOne(userQuery).exec()
          if (adminUser) {
            // 写入用户日志
            const logObj = {
              user: userData._id,
              userName: userData.name,
              loginTime: moment().format('X'),
              ip: postData.ip
            }
            const log = await UserLog.create(logObj)
            const token = jwt.sign(
              { _id: userData._id, name: userData.name, role: userData.role._id, log: log._id, time: logObj.loginTime },
              secrets.session,
              {
                expiresIn: '1d'
              }
            )
            const authAction = await that.loadAuth(userData)
            store.clearLoginTime(postData.name)
            await redis.set(userData._id + 'user', userData._id + '')
            return {
              roleId: userData.role._id + '',
              name: userData.name,
              duty: userData.duty,
              userId: userData._id,
              token: token,
              actionTree: authAction.actionTree,
              code: 200
            }
          } else {
            store.setLoginTimes(postData.name, strategy.lockTime * 1000)
            let loginTimes = store.getLoginTimes(postData.name)
            return {
              msg: `用户名或密码错误！已经连续输错${loginTimes.times}次,连续输错${strategy.loginCount}次后,账户会被锁定${strategy.lockTime}秒！`,
              code: 0
            }
          }
        }
        // 登录类型
        const type = userData.role.loginType
        // 1|账户，2|ukey,3|账户/ukey,4|账户&ukey
        if (type === LOGIN_TYPE.TYPE_ONE) {
          // 账户密码登录方式
          if (!_.has(postData, 'name') || !_.has(postData, 'pwd')) {
            return {
              code: 0,
              msg: '请输入用户名、密码！'
            }
          }
          userQuery = { name: postData.name, pwd: postData.pwd }
        } else if (type === LOGIN_TYPE.TYPE_TWO) {
          // ukey登录方式
          if (!_.has(postData, 'key')) {
            return {
              code: 0,
              msg: '请插入Ukey！'
            }
          }
          userQuery = { ukey: postData.key }
        } else if (type === LOGIN_TYPE.TYPE_THREE) {
          // ukey/账户密码登录方式
          if (_.has(postData, 'key')) {
            userQuery = { ukey: postData.key }
          } else {
            userQuery = { name: postData.name, pwd: postData.pwd }
          }
        } else {
          // ukey+账户密码登录方式
          if (postData.key) {
            loginData.ukey = postData.key
            if (loginData.name) {
              userQuery = { ukey: loginData.ukey, name: loginData.name, pwd: loginData.pwd }
            } else {
              // 如果插入ukey之前未输入账户密码
              return {
                code: 0,
                msg: '请输入用户名、密码！'
              }
            }
          }
          if (postData.name && postData.pwd) {
            // 未插入ukey,输入错误用户名密码
            const user = await UserModel.findOne({ name: postData.name, pwd: postData.pwd })
            if (!user) {
              store.setLoginTimes(postData.name, strategy.lockTime * 1000)
              let loginTimes = store.getLoginTimes(postData.name)
              return {
                code: 0,
                msg: `用户名或密码错误！已经连续输错${loginTimes.times}次,连续输错${strategy.loginCount}次后,账户会被锁定${strategy.lockTime}秒！`
              }
            }
            if (loginData.ukey) {
              userQuery = { ukey: loginData.ukey, name: postData.name, pwd: postData.pwd }
            } else {
              // 如果输入了账户密码，未插入ukey
              loginData.name = postData.name
              loginData.pwd = postData.pwd
              return {
                code: 0,
                msg: '请插入Ukey！'
              }
            }
          }
        }
        const user = await UserModel.findOne(userQuery).exec()
        loginData = {}
        if (user) {
          if (user.exptime > -1 && user.exptime + 24 * 60 * 60 < now) {
            return {
              code: 0,
              msg: '该用户已过期,请联系管理员！'
            }
          }
          // 写入用户日志
          const logObj = {
            user: user._id,
            userName: user.name,
            loginTime: moment().format('X'),
            ip: postData.ip
          }
          const log = await UserLog.create(logObj)
          const token = jwt.sign(
            { _id: user._id, name: user.name, role: user.role + '', log: log._id, time: logObj.loginTime },
            secrets.session,
            {
              expiresIn: '1d'
            }
          )
          const authAction = await that.loadAuth(user)
          store.clearLoginTime(postData.name)
          await redis.set(user._id + 'user', user._id + '')
          return {
            roleId: user.role + '',
            name: user.name,
            duty: user.duty,
            userId: user._id,
            token: token,
            actionTree: authAction.actionTree,
            code: 200
          }
        } else {
          store.setLoginTimes(postData.name, strategy.lockTime * 1000)
          let loginTimes = store.getLoginTimes(postData.name)
          // 如果用户名密码正确，Ukey不属于该用户
          if (_.has(userQuery, 'name') && _.has(userQuery, 'pwd') && _.has(userQuery, 'ukey')) {
            const user = await UserModel.findOne({ name: postData.name, pwd: postData.pwd })
            if (!user) {
              return {
                msg: `用户名或密码错误！已经连续输错${loginTimes.times}次,连续输错${strategy.loginCount}次后,账户会被锁定${strategy.lockTime}秒！`,
                code: 0
              }
            } else {
              return {
                code: 0,
                msg: 'Ukey与该用户不匹配，请插入可用Ukey！'
              }
            }
          }
          return {
            msg: `用户名或密码错误！已经连续输错${loginTimes.times}次,连续输错${strategy.loginCount}次后,账户会被锁定${strategy.lockTime}秒！`,
            code: 0
          }
        }
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 用户退出
   * @param {*} ctx
   */
  async logout (ctx) {
    try {
      const device = ctx.request.header['x-bsc-app']
      const id = _.get(ctx.state.user, 'log')
      if (device !== 'SENTRY') {
        if (!id) {
          ctx.body = {
            code: 0,
            message: '退出错误'
          }
          return
        }
        const now = moment().format('X')
        const log = await UserLog.findById(id).lean()
        log.onlineTime = now - log.loginTime
        log.logoutTime = now
        await UserLog.findByIdAndUpdate(id, log)
      }
      // 删除redis的key
      const userId = _.get(ctx.state.user, '_id')
      await redis.del(userId + 'user')
      ctx.body = {
        code: 200,
        message: '退出成功'
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 用户测试
   * @param {*} postData
   */
  async test (postData) {
    try {
      // PC端登录
      let userQuery
      const strategy = await Strategy.findOne().exec()
      const type = strategy.loginType
      const now = moment().format('X')
      // 1|账户，2|ukey,3|账户/ukey,4|账户&ukey
      if (type === LOGIN_TYPE.TYPE_ONE) {
        if (!_.has(postData, 'name') || !_.has(postData, 'pwd')) {
          return {
            code: 0,
            msg: '当前登录方式为账户密码登录!'
          }
        }
        userQuery = { name: postData.name, pwd: postData.pwd }
      } else if (type === LOGIN_TYPE.TYPE_TWO) {
        if (!_.has(postData, 'key')) {
          return {
            code: 0,
            msg: '当前登录方式为ukey登录!'
          }
        }
        userQuery = { ukey: postData.key }
      } else if (type === LOGIN_TYPE.TYPE_THREE) {
        if (_.has(postData, 'key')) {
          userQuery = { ukey: postData.key }
        } else {
          userQuery = { name: postData.name, pwd: postData.pwd }
        }
      } else {
        if (postData.key) {
          userQuery = { ukey: postData.key }
        } else {
          userQuery = { name: postData.name, pwd: postData.pwd }
        }
      }
      const user = await UserModel.findOne(userQuery).exec()
      if (user) {
        if (user.exptime > -1 && user.exptime + 24 * 60 * 60 < now) {
          return {
            code: 0,
            msg: '该用户已过期,请联系管理员!'
          }
        }
        // 写入用户交接班日志
        postData.time = now
        await ChangeLog.create(postData)

        return {
          name: user.name,
          code: 200
        }
      } else {
        return {
          msg: '用户不存在',
          code: 0
        }
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 加载权限
   * @param {*} user
   */
  async loadAuth (user) {
    try {
      const that = this
      let authData
      if (user.name !== 'admin') {
        const userData = await UserModel.findById(user._id).exec()
        if (!userData.role) {
          return {}
        }
        const userObj = await UserModel.findById(user._id)
          .lean()
          .exec()
        const role = await RoleModel.findById(userObj.role).exec()
        const actions = await Action.find({ _id: { $in: role.actions } })
          .lean()
          .exec()
        authData = that.loadActionsAll(actions)
      } else {
        const actions = await Action.find().exec()
        if (!actions.length) {
          return {}
        }
        authData = that.loadActionsAll(actions)
      }
      return authData
    } catch (err) {
      throw err
    }
  }
  /**
   * 处理权限数据
   * @param {*} actions
   * @param {*} resourceIds
   */
  async loadActionsAll (actions) {
    try {
      const showActions = []
      const apiActions = []
      actions.forEach(n => {
        if (n.isapi) {
          apiActions.push(n)
        } else {
          showActions.push(n)
        }
      })
      showActions.sort((a, b) => b.order - a.order)
      const tree = tool.transData2Tree(JSON.parse(JSON.stringify(showActions)), '_id', 'pid')
      // 处理异常数据,组成完整的树
      const actionTree = await this.dealTree(tree, showActions)
      return {
        actions: apiActions,
        showActions: showActions,
        actionTree: actionTree
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 组成完整的树
   * @param {*} tree
   * @param {*} showActions
   */
  async dealTree (tree, showActions) {
    try {
      if (tree.length > 1) {
        tree = _.filter(tree, item => {
          return item.pid !== '0'
        })
        const actionIds = tree.map(item => item.pid)
        const actions = await Action.find({ _id: actionIds })
          .lean()
          .exec()
        showActions = actions.concat(showActions)
        tree = tool.transData2Tree(JSON.parse(JSON.stringify(showActions)), '_id', 'pid')
      }
      return tree
    } catch (err) {
      throw err
    }
  }
  /**
   * 查找用户权限
   * @param {*} id
   */
  async getUserActions (id) {
    try {
      const userObj = await User.findById(id).exec()
      const role = await Role.findById(userObj.role).exec()
      const rActions = []
      role.actions.map(n => rActions.push(n + ''))
      const userInfo = JSON.parse(JSON.stringify(userObj))
      // 把权限添加到用户对象中
      userInfo.actions = rActions
      return userInfo
    } catch (err) {
      throw err
    }
  }
  /**
   * 更新用户登录日志。如果当日没有日志创建新日志，如果有日志更新日志。
   * @param {*} id
   */
  async createUserLogin (id) {
    try {
      const userObj = await User.findById(id).exec()
      const role = await Role.findById(userObj.role).exec()
      const rActions = []
      role.actions.map(n => rActions.push(n + ''))
      const userInfo = JSON.parse(JSON.stringify(userObj))
      // 把权限添加到用户对象中
      userInfo.actions = rActions
      return userInfo
    } catch (err) {
      throw err
    }
  }
  /**
   * 查询值班用户的登录日志。
   * @param {*} id
   */
  async queryDutyUserLog (ctx) {
    try {
      const query = {}
      const paganation = ctx.query.page || ''
      const search = ctx.query.search
      if (!_.isEmpty(search.key)) {
        query.userName = { $regex: search.key }
      }
      if (!_.isEmpty(search.startTime) && !_.isEmpty(search.endTime)) {
        search.endTime = Number(search.endTime) + 24 * 60 * 60
        query.$and = [{ loginTime: { $gte: Number(search.startTime) } }, { logoutTime: { $lte: search.endTime } }]
      } else if (!_.isEmpty(search.startTime)) {
        query.loginTime = { $gte: Number(search.startTime) }
      } else if (!_.isEmpty(search.endTime)) {
        search.endTime = Number(search.endTime) + 24 * 60 * 60
        query.logoutTime = { $lte: search.endTime }
      }
      if (_.has(search, 'duty')) {
        const user = await UserModel.find({ duty: 'yes' }).lean()
        const ids = user.map(item => item._id.toString())
        query.user = { $in: ids }
      }
      if (_.has(search, 'id')) {
        query.user = search.id
      }
      const population = { path: 'user', select: 'name realName' }
      const result = await paging.listQuery(
        UserLog,
        query,
        'clientType userName loginTime logoutTime onlineTime ip',
        { createdAt: -1 },
        paganation,
        population,
        ctx
      )
      return result
    } catch (err) {
      throw err
    }
  }
  /**
   * 获取值班用户
   * @returns
   * @memberof time
   */
  async getDutyUsers (time) {
    try {
      const [users, AlarmEventCount] = await Promise.all([
        await UserModel.find({ duty: 'yes' })
          .lean()
          .exec(),
        await AlarmEvent.countDocuments({ createTime: { $gte: time } }).exec()
      ])
      let allTask = 0
      let undealTask = 0
      if (!_.isEmpty(AlarmEventCount)) {
        AlarmEventCount.forEach(item => {
          allTask++
          if (!item.close) {
            undealTask++
          }
        })
      }
      // 值班日志,报警处理
      const db = await getDb()
      const AlarmLogModel = db.model('AlarmLog', AlarmLogSchema, 'AlarmLog')
      // 普通报警
      const normalType = ['alarmInput', 'alarmZone', 'alarmGT']
      // 视频报警
      const videoType = [
        'alarmMoveSense',
        'videoMask',
        'sceneSwitch',
        'definitionAbnormal',
        'brightnessAbnormal',
        'noise',
        'colorCast',
        'signalLoss',
        'screenFreeze',
        'focusAttention'
      ]
      // 智能报警
      const intelligentType = [
        'perimeter',
        'tripwire',
        'missingObject',
        'leftObject',
        'loitering',
        'retrogradeDetection',
        'lingerDetection',
        'doubleCordon',
        'blackList',
        'whiteList',
        'dispatch',
        'areaInvade',
        'fastMove',
        'parkDetect',
        'humanAssemble',
        'objectMove',
        'vioRetrograde',
        'vioPark',
        'vioTurnLeft',
        'vioTurnRight',
        'faceControl'
      ]
      // 报警求助报警
      const alarmHelpType = ['askHelp', 'acceptHelp', 'endHelp']
      // 消防报警
      const fireAlarmType = ['fireAlarm', 'fireFailure']
      // 单兵报警
      const singleType = ['individualAlarm', 'patrolAlarm']
      // 系统异常
      const systemExceptionType = ['systemException']
      // 手工报警
      const manualAlarmType = ['manualAlarm']
      const [
        logCount,
        normalCount,
        videoCount,
        intelligentCount,
        alarmHelpCount,
        fireAlarmCount,
        singleCount,
        systemExceptionCount,
        manualAlarmCount,
        undealAlarm,
        allAlarm
      ] = await Promise.all([
        DutyLog.countDocuments({ time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: normalType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: videoType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: intelligentType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: alarmHelpType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: fireAlarmType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: singleType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: systemExceptionType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ eventType: { $in: manualAlarmType }, time: { $gte: time } }).exec(),
        AlarmLogModel.countDocuments({ time: { $gte: time }, dealState: 'unProcess' }).exec(),
        AlarmLogModel.countDocuments({ time: { $gte: time } }).exec()
      ])
      return {
        users, // 用户列表
        allTask, // 接警案件数量
        undealTask, // 未处理案件数量
        undealAlarm, // 未处理报警数量
        allAlarm, // 所有报警数量
        logCount, // 值班日志数量
        normalCount, // 普通报警数量
        videoCount, // 视频报警数量
        intelligentCount, // 智能报警数量
        alarmHelpCount, // 报警求助数量
        fireAlarmCount, // 消防报警数量
        singleCount, // 单兵报警数量
        systemExceptionCount, // 系统异常数量
        manualAlarmCount // 手工报警数量
      }
    } catch (error) {
      throw error
    }
  }
  /**
   * 系统日志查询
   * @param {*}  ctx
   */
  async getLog (ctx) {
    try {
      const search = ctx.query.search
      const paganation = ctx.query.page
      const query = {}
      if (search.startTime && search.endTime) {
        query.$and = [{ time: { $gte: Number(search.startTime) } }, { time: { $lte: Number(search.endTime) } }]
      }
      if (search.userName) {
        query.userName = { $regex: search.userName }
      }
      if (search.logType) {
        query.logType = search.logType
      }
      if (search.state) {
        query.state = search.state
      }
      if (search.operateContent) {
        query.operateContent = { $regex: search.operateContent }
      }
      if (search.target) {
        query.target = { $regex: search.target }
      }
      const result = await paging.listQuery(LogDetail, query, '', { _id: -1 }, paganation, '', ctx)
      return result.results
    } catch (err) {
      throw err
    }
  }
  /**
   * 增加系统日志
   */
  async createLog (body) {
    try {
      await LogDetail.create(body)
    } catch (err) {
      throw err
    }
  }
  /**
   * 修改密码
   * @param {*} id
   * @param {*} body
   */
  async updatePwd (id, body) {
    try {
      const user = await UserModel.findById(id).exec()
      if (user.pwd === body.oldPwd) {
        const result = await UserModel.findByIdAndUpdate(id, { pwd: body.pwd })
        return {
          code: 1,
          data: result
        }
      } else {
        return {
          code: 0,
          msg: '旧密码错误!'
        }
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 获取交接班日志
   */
  async getChangeLog (ctx) {
    try {
      const paganation = ctx.query.page
      const search = ctx.query.search
      const query = {}
      let userIds = []
      if (search.key && search.startTime && search.endTime) {
        const users = await UserModel.find({ name: { $regex: search.key } }, '_id')
        userIds = users.map(item => item._id)
        query.$and = [
          { time: { $gte: Number(search.startTime) } },
          { time: { $lte: Number(search.endTime) } },
          { $or: [{ user: { $in: userIds } }, { takeUser: { $in: userIds } }] }
        ]
      } else if (search.key) {
        const users = await UserModel.find({ name: { $regex: search.key } }, '_id')
        userIds = users.map(item => item._id)
        query.$or = [{ user: { $in: userIds } }, { takeUser: { $in: userIds } }]
      } else if (search.startTime && search.endTime) {
        query.$and = [{ time: { $gte: Number(search.startTime) } }, { time: { $lte: Number(search.endTime) } }]
      }
      const result = await paging.listQuery(ChangeLog, query, '', { createdAt: -1 }, paganation, 'user takeUser', ctx)
      ctx.body = result.results
    } catch (err) {
      throw err
    }
  }
  /**
   * 系统日志导出
   * @param {*} ctx
   */
  async logExport (ctx) {
    try {
      const search = ctx.query.search
      const query = {}
      if (search.startTime && search.endTime) {
        query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
      }
      if (search.userName) {
        query.userName = { $regex: search.userName }
      }
      if (search.logType) {
        query.logType = search.logType
      }
      if (search.state) {
        query.state = search.state
      }
      if (search.operateContent) {
        query.operateContent = { $regex: search.operateContent }
      }
      if (search.target) {
        query.target = { $regex: search.target }
      }
      const logs = await LogDetail.find(query)
        .sort({ _id: -1 })
        .lean()
        .exec()
      // 定义表头
      const data = [
        ['用户名', '时间', '用户IP', '日志类别', '模块', '操作名称', '操作内容', '操作对象', '对象IP', '状态']
      ]
      // 将设备信息Push到sheet
      logs.forEach(item => {
        const arr = [
          item.userName,
          moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss'),
          item.clientIp,
          item.logType,
          item.module,
          item.operateName,
          item.operateContent,
          item.target,
          item.deviceIp,
          item.state
        ]
        data.push(arr)
      })
      // 设置列样式
      const ColInfos = [
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 }
      ]
      const option = { '!cols': ColInfos }
      const buffer = xlsx.build([{ name: '系统日志', data }], option)
      return buffer
    } catch (error) {
      throw error
    }
  }
  /**
   * 用户日志查询
   * @param {*} ctx
   */
  async getUserLog (ctx) {
    try {
      const search = ctx.query.search
      const page = ctx.query.page
      page.limit = 100
      const query = { userName: search.name, time: { $gte: Number(search.startTime), $lte: Number(search.endTime) } }
      const result = await paging.listQuery(LogDetail, query, '', { createdAt: -1 }, page, '', ctx)
      ctx.body = result.results
    } catch (err) {
      throw err
    }
  }
  /**
   * 按照条件查询用户日志查询
   * @param {*} ctx
   */
  async getUserLogDetail (ctx) {
    try {
      const search = ctx.query.search
      const page = ctx.query.page
      let key = search.key
      const query = {
        userName: search.name,
        time: { $gte: Number(search.startTime), $lte: Number(search.endTime) }
      }
      if (key && key.substring(0, 2) === '系统') {
        key = key.substring(3)
        query.module = key
      } else if (key) {
        query.module = key
      }
      const result = await paging.listQuery(LogDetail, query, '', { createdAt: -1 }, page, '', ctx)
      ctx.body = result.results
    } catch (err) {
      throw err
    }
  }
  /**
   * 按照ukey查找用户
   * @param {*} ctx
   */
  async findByKeys (keys) {
    try {
      let userList = {}
      const result = await UserModel.find({ ukey: { $in: keys } })
      result.map(item => {
        userList[item.ukey] = {
          _id: item._id,
          name: item.name,
          ukey: item.ukey
        }
      })
      return userList
    } catch (err) {
      throw err
    }
  }

  /**
   * 获取当前全部用户
   * @param {*} ctx
   */
  async getAll (select, query) {
    try {
      const result = await UserModel.find(query, select).exec()
      return result
    } catch (err) {
      throw err
    }
  }
}
module.exports = User
