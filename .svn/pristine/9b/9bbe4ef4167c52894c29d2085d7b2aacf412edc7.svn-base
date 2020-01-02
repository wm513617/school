'use strict'
const AlarmType = require('mongoose').model('alarmType')
const AlarmPlan = require('mongoose').model('alarmPlan')
const AlarmLevel = require('mongoose').model('alarmLevel')
const AlarmCfg = require('mongoose').model('alarmCfg')
const FireAlarmCfg = require('mongoose').model('fireAlarmCfg')
const AlarmTimeTemplate = require('mongoose').model('alarmTimeTemplate')
const FireAlarmConf = require('mongoose').model('fireAlarmConf')
const AlarmDelay = require('mongoose').model('alarmDelay')
const AlarmAudio = require('mongoose').model('alarmAudio')
const OrgRes = require('mongoose').model('OrgRes')
const paging = require('../../paging')
const postal = require('postal')
const { handleSysException } = require('../../../common/tools')
const AlarmDeal = require('mongoose').model('AlarmDeal')
const Sysparamters = require('mongoose').model('Sysparamters')
// const TrafficAlarmCfg = require('mongoose').model('TrafficAlarmCfg')
const Resource = require('mongoose').model('Resource')
const Device = require('mongoose').model('Device')
const Org = require('mongoose').model('Org')
const xlsx = require('node-xlsx')
const _ = require('lodash')
const MonitoryPointAlarm = mongoose.model('MonitoryPointAlarm')
const IntelligentAlarm = mongoose.model('IntelligentAlarm')
const AlarmClient = mongoose.model('alarmClient')
const TrafficLane = mongoose.model('TrafficLane')
const DeviceAlarm = mongoose.model('DeviceAlarm')
const { fireAlarmChange } = require('../../bstar/dev.interface')
const { RES_TYPE } = require('../../../common/constant')

// 报警分类
exports.getAlarmType = async ctx => {
  try {
    const data = await AlarmType.find().exec()
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.putAlarmType = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmType.findByIdAndUpdate(id, ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
// 级别配置
exports.getAllAlarmLevel = async ctx => {
  try {
    const data = await AlarmLevel.find().exec()
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.getOneAlarmLevel = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmLevel.findById(id).exec()
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.putAlarmLevel = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmLevel.findByIdAndUpdate(id, ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

// 时间模板
exports.getTimeTemplate = async ctx => {
  try {
    const data = await AlarmTimeTemplate.find().exec()
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.addTimeTemplate = async ctx => {
  try {
    const data = await AlarmTimeTemplate.create(ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.putTimeTemplate = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmTimeTemplate.findByIdAndUpdate(id, ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.delTimeTemplate = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmTimeTemplate.findByIdAndRemove(id)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

// 预案
exports.getPlan = async (ctx, next) => {
  try {
    const results = await paging.listQuery(AlarmPlan, ctx.query.search, '', { _id: -1 }, ctx.query.page, '', ctx)
    ctx.body = results.results
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.addPlan = async ctx => {
  try {
    const putData = ctx.request.body
    const check = await checkPlanUnique(putData)
    if (check) {
      ctx.status = 505
      ctx.body = {
        name: false
      }
      return
    }
    const data = await AlarmPlan.create(putData)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.putPlan = async ctx => {
  try {
    const id = ctx.params.id
    const putData = ctx.request.body
    const check = await checkPlanUnique(putData, id)
    if (check) {
      ctx.status = 505
      ctx.body = {
        name: false
      }
      return
    }
    const data = await AlarmPlan.findByIdAndUpdate(id, putData)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.delPlan = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmPlan.findByIdAndRemove(id)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

// 配置报警
exports.setUpdateAlarm = async ctx => {
  try {
    const postData = ctx.request.body
    const config = postData.config
    delete postData.config
    const id = ctx.params.id
    if (postData.actionVideo.length) {
      for (let item of postData.actionVideo) {
        if (item.cloud && item.cloud.status && !item.cloud.actionDetail) {
          const obj = {
            ctrlCmdEnum: 'gotoPreset',
            presetIndex: 1
          }
          item.cloud.actionDetail = JSON.stringify(obj)
        }
      }
    }
    const result = await AlarmCfg.findOneAndUpdate({ resource: id }, postData, { upsert: true })
    // 更新resource表actionsConfig字段为true，代表配置过,2.0新增
    let flag = false
    postData.actionRule.forEach(item => {
      // 如果联动规则4个中有一个选择了启用，status为true，则表示配置过
      if (item.status) {
        flag = true
      }
    })
    if (flag) {
      if (config === 'resource') {
        await Resource.updateOne({ _id: id }, { actionConfig: true })
      } else if (config === 'monitor') {
        await MonitoryPointAlarm.updateOne({ _id: id }, { actionConfig: true })
      } else if (config === 'intelligent') {
        await IntelligentAlarm.updateOne({ _id: id }, { actionConfig: true })
      } else if (config === 'client') {
        await AlarmClient.updateOne({ _id: id }, { actionConfig: true })
      } else if (config === 'lane') {
        await TrafficLane.updateOne({ _id: id }, { actionConfig: true })
      }
    } else {
      if (config === 'resource') {
        await Resource.updateOne({ _id: id }, { $unset: { actionConfig: '' } })
      } else if (config === 'monitor') {
        await MonitoryPointAlarm.updateOne({ _id: id }, { $unset: { actionConfig: '' } })
      } else if (config === 'intelligent') {
        await IntelligentAlarm.updateOne({ _id: id }, { $unset: { actionConfig: '' } })
      } else if (config === 'client') {
        await AlarmClient.updateOne({ _id: id }, { $unset: { actionConfig: '' } })
      } else if (config === 'lane') {
        await TrafficLane.updateOne({ _id: id }, { $unset: { actionConfig: '' } })
      }
    }
    sendNotice(ctx) // 发布通知
    ctx.body = result
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

// 根据id 获取报警配置详情
exports.getSetAlarm = async ctx => {
  try {
    const id = ctx.params.id
    const result = await AlarmCfg.findOne({ resource: id }, '-org -resource')
      .populate([
        { path: 'videoAction.resource', select: 'name' },
        { path: 'videoAction.org', select: 'name' }
      ])
      .exec()
    ctx.body = result || {}
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

// 配置消防报警
exports.setUpdateFire = async ctx => {
  try {
    const postData = ctx.request.body
    const id = ctx.params.id
    const result = await FireAlarmCfg.findOneAndUpdate({ resource: id }, postData, { upsert: true })
    sendNotice(ctx) // 发布通知
    ctx.body = result
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

// 根据id 获取消防配置详情
exports.getSetFire = async ctx => {
  try {
    const id = ctx.params.id
    const result = await FireAlarmCfg.findOne({ resource: id }).exec()
    ctx.body = result
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.getSetFireInfo = async ctx => {
  try {
    const id = ctx.params.id
    const result = await FireAlarmCfg.findOne({ resource: id })
      .populate({
        path: 'actionVideo.resource',
        select: '_id stream chan eid',
        populate: { path: 'eid', select: 'cport ip manufacturer' }
      })
      .exec()
    ctx.body = result
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.setFireConf = async ctx => {
  try {
    const data = await FireAlarmConf.update(ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.getFireConf = async ctx => {
  try {
    const data = await FireAlarmConf.findOne()
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

exports.getAudio = async ctx => {
  try {
    const results = await paging.listQuery(AlarmAudio, {}, '', { _id: -1 }, ctx.query.page, '', ctx)
    ctx.body = results
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.addAudio = async ctx => {
  try {
    const data = await AlarmAudio.create(ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.delAudio = async ctx => {
  const id = ctx.params.id
  try {
    const data = await AlarmAudio.findByIdAndRemove(id)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}
exports.putAudio = async ctx => {
  const id = ctx.params.id
  try {
    const data = await AlarmAudio.findByIdAndUpdate(id, ctx.request.body)
    sendNotice(ctx) // 发布通知
    ctx.body = data
  } catch (error) {
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 1001, message: '系统内部错误' }
    )
  }
}

const sendNotice = ctx => {
  postal.publish({
    channel: 'devices',
    topic: 'item.notice',
    data: {
      ctx: ctx,
      data: {
        module: 'alarm',
        varyData: [],
        newData: []
      }
    }
  })
}

postal.subscribe({
  channel: 'resources',
  topic: 'resource.unbind',
  callback: async data => {
    if (data.type * 1 === 0) {
      await AlarmCfg.deleteMany({ resource: { $in: data.ids } })
      await FireAlarmCfg.deleteMany({ resource: { $in: data.ids } })
    }
  }
})

const checkPlanUnique = async (obj, id = null) => {
  let result = []
  if (id) {
    result = await AlarmPlan.find({ type: obj.type, name: obj.name, _id: { $ne: id } }).exec()
  } else {
    result = await AlarmPlan.find({ type: obj.type, name: obj.name }).exec()
  }
  return result.length
}
/**
 * 增加警情处理
 * @param {*} ctx
 */
exports.addAlarmDeal = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('警情处理-添加'))
    await AlarmDeal.create(ctx.request.body)
    ctx.body = 201
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 查询警情处理
 * @param {*} ctx
 */
exports.getAlarmDeal = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('警情处理-查询'))
    const page = ctx.query.page
    const search = {}
    search.page = ctx.query.type
    const data = await paging.listQuery(AlarmDeal, search, '', { createdAt: -1 }, page, '', ctx)
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改警情处理
 * @param {*} ctx
 */
exports.updateAlarmDeal = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('警情处理-修改'))
    const id = ctx.params.id
    const obj = await AlarmDeal.findOne({ name: ctx.request.body.name, _id: { $ne: id } }).exec()
    if (obj) {
      throw new Error('用户名重复')
    }
    await AlarmDeal.findByIdAndUpdate(id, ctx.request.body)
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 删除警情处理
 * @param {*} ctx
 */
exports.deleteAlarmDeal = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('警情处理-删除'))
    const id = ctx.params.id
    await AlarmDeal.findByIdAndRemove(id)
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取系统参数
 * @param {*} ctx
 */
exports.getSysParam = async ctx => {
  try {
    const data = await Sysparamters.findOne({}, 'fireOpen alarmOpen')
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改系统参数
 * @param {*} ctx
 */
exports.updateSysParam = async ctx => {
  try {
    const id = ctx.params.id
    const obj = ctx.request.body
    await Sysparamters.findByIdAndUpdate(id, obj)
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 批量配置消防报警
 */
exports.setFirePatch = async ctx => {
  try {
    let ids = ctx.request.header['x-bsc-ids'].split(',')
    const actionWall = ctx.request.body.actionWall
    if (!actionWall.scene || !actionWall.wall) {
      delete ctx.request.body.actionWall
    }
    const data = []
    for (let id of ids) {
      ctx.request.body.resource = id
      data.push(AlarmCfg.updateOne({ resource: id }, ctx.request.body, { upsert: true }))
    }
    await Promise.all(data)
    const actionRule = ctx.request.body.actionRule
    let flag = false
    if (actionRule.length) {
      actionRule.forEach(item => {
        if (item.status) {
          flag = true
        }
      })
    }
    // 如果联动规则有一个配置了，就认为是配置过的
    if (flag) {
      await Resource.updateMany({ _id: { $in: ids } }, { actionConfig: true })
    } else {
      await Resource.updateMany({ _id: { $in: ids } }, { $unset: { actionConfig: 1 } })
    }
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 消防报警导出
 */
exports.fireExport = async ctx => {
  try {
    const reses = await Resource.find(
      { type: ctx.query.type },
      'name eid chan devloop subtype level alarmtemplate minintervaltime'
    )
      .populate([
        { path: 'eid', select: 'name' },
        { path: 'alarmtemplate', select: 'name' }
      ])
      .exec()
    // 定义表头
    const data = [
      ['消防报警名称', '所属设备', '设备回路', '防区编号', '报警子类型', '报警级别', '报警接收时间', '报警接收间隔']
    ]
    const subtypes = [
      { label: '周界保护', value: 'perimeterAlarm' },
      { label: '入侵报警', value: 'intrusionAlarm' },
      { label: '感烟', value: 'smoke' },
      { label: '感温', value: 'temperature' },
      { label: '消火栓', value: 'hydrant' },
      { label: '手报', value: 'handNewspaper' },
      { label: '报警求助', value: 'helpSeek' }
    ]
    reses.forEach(item => {
      const index = _.findIndex(subtypes, n => n.value === item.subtype)
      if (item.devloop) {
        const arr = [
          item.name,
          item.eid.name,
          item.devloop,
          item.chan,
          subtypes[index]['label'],
          item.level,
          item.alarmtemplate.name,
          item.minintervaltime
        ]
        data.push(arr)
      }
    })

    const colInfos = [{ width: 15 }, {}, {}, {}, {}, {}, {}, {}]
    const option = { '!cols': colInfos }
    const buffer = xlsx.build([{ name: '消防报警', data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const time = moment().format('YYYY-MM-DD')
    ctx.attachment('消防报警导出' + `${time}` + '.xlsx')
    ctx.body = buffer
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 消防报警导入
 */
exports.fireImport = async ctx => {
  try {
    const org = await Org.findById(ctx.query.oid).lean()
    if (org.shareType) {
      return ctx.throw(500, { code: 1019, message: '下联机构不能添加设备' })
    }
    const resDatas = xlsx.parse(ctx.request.body.files.file.path)
    const datas = resDatas[0].data
    if (_.isEmpty(datas)) {
      ctx.throw(500, '无可用数据')
    }
    // 去除表头信息
    datas.shift()
    // 查询设备和时间模板信息
    const [devices, timeTemplates] = await Promise.all([
      Device.find({ bigtype: 7 }, 'name ip')
        .lean()
        .exec(),
      AlarmTimeTemplate.find({}, 'name')
        .lean()
        .exec()
    ])
    const devMap = {}
    devices.forEach(item => {
      devMap[item.name] = [item._id + '', item.ip]
    })
    const templateMap = {}
    timeTemplates.forEach(item => {
      templateMap[item.name] = item._id + ''
    })
    // name eid chan devloop subtype level alarmtemplate minintervaltime
    const subtypes = [
      { label: '周界保护', value: 'perimeterAlarm' },
      { label: '入侵报警', value: 'intrusionAlarm' },
      { label: '感烟', value: 'smoke' },
      { label: '感温', value: 'temperature' },
      { label: '消火栓', value: 'hydrant' },
      { label: '手报', value: 'handNewspaper' },
      { label: '报警求助', value: 'helpSeek' }
    ]
    const saveDatas = []
    for (let item of datas) {
      const index = _.findIndex(subtypes, n => {
        return n.label === item[4]
      })
      if (index === -1) {
        ctx.throw(500, '报警子类型数据异常')
      }
      const resObj = {
        name: item[0],
        eid: devMap[item[1]][0],
        ip: devMap[item[1]][1],
        devloop: item[2],
        chan: item[3],
        subtype: subtypes[index]['value'],
        level: item[5],
        alarmtemplate: templateMap[item[6]],
        minintervaltime: item[7],
        orgId: ctx.query.oid,
        type: RES_TYPE.FIRE_ALARM_IN
      }
      const count = await Resource.countDocuments({ eid: resObj.eid, devloop: resObj.devloop, chan: resObj.chan })
      if (count) {
        ctx.throw(500, `设备回路${resObj.devloop}下防区编号${resObj.chan}已存在`)
      }
      saveDatas.push(resObj)
    }
    for (let i in saveDatas) {
      for (let j in saveDatas) {
        if (i === j) {
          continue
        }
        if (Number(saveDatas[i].devloop) === Number(saveDatas[j].devloop) && saveDatas[i].chan === saveDatas[j].chan) {
          ctx.throw(500, `设备回路${saveDatas[i].devloop}下防区编号${saveDatas[i].chan}已存在`)
        }
      }
    }
    const reses = await Resource.insertMany(saveDatas)
    // 向orgres表添加数据
    const rootOrg = await Org.findOne({ type: 0, isroot: true })
      .lean()
      .exec()
    const orgresData = []
    reses.forEach(item => {
      const obj = {}
      obj.resource = item._id
      obj.org = ctx.query.oid
      obj.rootorg = rootOrg._id
      orgresData.push(obj)
    })
    await OrgRes.create(orgresData)
    await fs.unlinkSync(ctx.request.body.files.file.path) // 删除上传文件
    // 导入消防主机输入防区的时候向北京发送通知
    const varyData = []
    const dids = []
    saveDatas.forEach(item => {
      dids.push(item.eid)
      const afterObj = {
        after: {
          slotNo: Number(item.devloop),
          zoneNo: item.chan
        }
      }
      varyData.push(afterObj)
    })
    const deviceArr = await Device.find({ _id: { $in: dids } }).lean() // 查询所有设备
    const newData = []
    deviceArr.forEach(item => {
      const obj = {
        devIp: item.ip,
        devPort: item.cport,
        vendor: item.manufacturer,
        type: 'create'
      }
      newData.push(obj)
    })
    const data = {
      module: 'firealarm',
      newData: newData,
      varyData: varyData
    }
    await fireAlarmChange({ ctx, data })
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
/* 获取报警延时 */
exports.getAlarmDelay = async ctx => {
  try {
    const data = await AlarmDelay.findOne()
    console.log(data)
    ctx.body = data
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.setAlarmDelay = async ctx => {
  try {
    await AlarmDelay.findOneAndUpdate({}, ctx.request.body)
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 删除解码器设备时订阅，删除解码器设备报警数据
postal.subscribe({
  channel: 'devices',
  topic: 'item.deleteDecoder',
  callback: async data => {
    const ids = data.equipment
    await DeviceAlarm.deleteMany({ eid: { $in: ids } })
  }
})
// 删除视频设备时订阅，删除监控点报警和智能报警数据
postal.subscribe({
  channel: 'devices',
  topic: 'item.deleteIPC',
  callback: async data => {
    const ids = data.equipment
    await DeviceAlarm.deleteMany({ eid: { $in: ids } })
  }
})
// 删除视频资源时订阅，删除监控点报警和智能报警数据
postal.subscribe({
  channel: 'resources',
  topic: 'array.delete',
  callback: async data => {
    const resIds = data.ids
    await Promise.all([
      IntelligentAlarm.deleteMany({ rid: { $in: resIds } }),
      MonitoryPointAlarm.deleteMany({ rid: { $in: resIds } })
    ])
  }
})
