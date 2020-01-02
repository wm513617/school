/*
 * @Author: chenkaibo
 * @Date: 2018-07-25 09:54:53
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-09-18 10:35:03
 */

// 智能交通服务器可以看做是一种类型的设备，数据模型使用Device

'use strict'
const mongoose = require('mongoose')
const Device = mongoose.model('Device')
const TrafficLane = mongoose.model('TrafficLane')
const TrafficServerCfg = mongoose.model('TrafficServerCfg')
const ThirdPartyOrg = mongoose.model('ThirdPartyOrg')
const AlarmCfg = require('mongoose').model('alarmCfg')
const util = require('../../../common/protobuf.util')
const command = require('../../../common/command')
const traffic = require('../../bstar/traffic.interface')
const _ = require('lodash')
const pagin = require('../../paging')
const { handleSysException, transData2Tree, getChildren } = require('../../../common/tools')
const postal = require('postal')
const singleton = require('../intelligentTraffic/recordSearch/adapter').getHikon9600Singleton()
// 获取智能交通服务器信息
exports.get = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('智能交通-创建智能交通服务器配置'))
    const id = ctx.params.id
    if (!id) {
      throw new Error(500, { message: '参数不存在' })
    }
    const result = await Device.findById(id, 'name manufacturer deviceid ip cport username password series').lean()
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 添加智能交通服务器
exports.create = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('智能交通-创建智能交通服务器配置'))
    const entity = ctx.request.body
    const isOccupy = await Device.count({
      bigtype: 8,
      $or: [{ name: entity.name }, { ip: entity.ip, cport: entity.cport }, { deviceid: entity.deviceid }]
    })
    if (isOccupy) {
      ctx.throw(500, { code: 2001, message: '服务器名|ip|端口地址|编号已存在' })
    }
    entity.bigtype = 8
    entity.type = 'traffic'
    const server = await Device.create(entity)
    // 如果添加的是海康9600需要和ts服务建立tcp链接，过车数据
    if (entity.manufacturer === 'hikvision' && entity.series === '9600') {
      singleton.start()
    }
    ctx.headers['location'] = ctx.url + server._id
    ctx.status = 201
    ctx.body = ''
    postal.publish({
      channel: 'redis',
      topic: 'traffic.sync',
      data: ''
    })
  } catch (error) {
    handleSysException(error)
  }
}
// 修改智能交通服务器
exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('智能交通-修改智能交通服务器配置'))
    const entity = ctx.request.body
    const id = ctx.params.id
    const isOccupy = await Device.count({
      bigtype: 8,
      _id: { $ne: id },
      $or: [{ name: entity.name }, { ip: entity.ip, cport: entity.cport }]
    })
    if (isOccupy) {
      ctx.throw(500, { code: 2001, message: '服务器名|ip|端口地址已存在' })
    }
    await Device.findByIdAndUpdate(id, entity)
    // 如果修改的是海康9600需要和ts服务断开然后重新建立tcp链接，过车数据
    if (entity.manufacturer === 'hikvision' && entity.series === '9600') {
      singleton.cleanTcp()
      singleton.start()
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 删除智能交通服务器
exports.remove = async ctx => {
  ctx.set('loginfo', encodeURI('智能交通-删除智能交通服务器配置'))
  try {
    const id = ctx.params.id
    // 获取当前服务器的所有设备的设备id。用于报警配置删除
    const docs = await TrafficLane.find({ sid: id }, 'devChnId').lean()
    const ids = docs.map(doc => doc.devChnId)
    // 如果删除的是9600服务器，需要和ts服务断开tcp连接
    const device = await Device.findOne({ _id: id, manufacturer: 'hikvision', series: '9600' }).lean()
    if (device) {
      singleton.cleanTcp()
    }
    await Promise.all([
      AlarmCfg.deleteMany({ type: 8, spare: { $in: ids } }),
      TrafficLane.deleteMany({ sid: id }),
      ThirdPartyOrg.deleteMany({ type: id }),
      Device.findByIdAndRemove(id)
    ])
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 获取服务器地址
exports.getServerCfg = async ctx => {
  try {
    const res = await TrafficServerCfg.findOne()
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}

// 配置服务器地址
exports.editServerCfg = async ctx => {
  try {
    const res = await TrafficServerCfg.findOne().lean()
    if (res) {
      await TrafficServerCfg.findByIdAndUpdate(res._id, ctx.request.body)
    } else {
      await TrafficServerCfg.create(ctx.request.body)
    }
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 获取服务器机构下的所有车道信息
module.exports.getLaneList = async ctx => {
  try {
    let { sid, deptId, recursive = 0, key = '' } = ctx.query.search
    const query = {}
    if (!sid || !deptId) {
      throw new Error(500, { message: '参数缺失' })
    }
    query.sid = sid
    query.deptId = deptId
    key && (query.devChnName = { $regex: key })
    let ids = []
    if (parseInt(recursive)) {
      if (deptId === sid) {
        const root = await ThirdPartyOrg.findOne({ type: sid, isroot: true }).lean()
        deptId = root.id
      }
      let orgs = await ThirdPartyOrg.find({ type: sid }).lean()
      ids = getChildren(ids, orgs, deptId)
      const currentNode = orgs.find(org => org.id === deptId)
      ids.push(currentNode._id.toString())
      orgs = await ThirdPartyOrg.find({ _id: { $in: ids } }, 'id').lean()
      query.deptId = { $in: orgs.map(org => org.id) }
    }
    // 是否勾选了“只显示未配置联动”，1代表勾选，0代表未勾选
    if (Number(ctx.query.config) === 1) {
      query.actionConfig = { $exists: false }
    }
    const result = await pagin.listQuery(TrafficLane, query, '', '', ctx.query.page, '', ctx)
    ctx.status = 200
    ctx.body = result.results
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 修改车道信息
 */
exports.updateLane = async ctx => {
  try {
    const ids = ctx.headers['x-bsc-ids'].split(',')
    await TrafficLane.updateMany({ _id: { $in: ids } }, ctx.request.body)
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
  } catch (error) {
    handleSysException(error)
  }
}

// 获取服务器机构树
module.exports.index = async ctx => {
  try {
    const key = ctx.query.search.struct || 'list'
    // 为了扩展车流量统计只查询海康组织机构
    const { type } = ctx.query
    const condition = { bigtype: 8 }
    type && (condition['manufacturer'] = type)

    let result = []
    // 获取所有智能交通服务器列表
    if (key === 'list') {
      result = (await pagin.listQuery(
        Device,
        condition,
        'name manufacturer deviceid ip cport username password series',
        '',
        ctx.query.page,
        '',
        ctx
      )).results
    } else {
      const servers = await Device.find(condition).lean()
      for (const server of servers) {
        const nodeTree = await buildServerTree(server)
        result = result.concat(nodeTree)
      }
    }
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 同步智能交通服务器组织及设备
module.exports.sync = async (ctx, next) => {
  try {
    ctx.set('loginfo', encodeURI('智能交通-同步智能交通服务器设备'))
    const id = ctx.params.id
    const server = await Device.findById(id).lean()
    let tree = []
    if (server) {
      if (server.manufacturer === 'hikvision' && server.series === '9600') {
        tree = await syncHikVision9600(ctx, server)
      } else if (server.manufacturer === 'hikvision' && server.series === 'TPE300') {
        tree = await syncHikVisionTEP300(server)
      } else if (server.manufacturer === 'ytz') {
        tree = await syncYTZ(server)
      }
    }
    ctx.body = tree
  } catch (error) {
    handleSysException(error)
  }
}

// 同步厂商(海康威视TPE300)下的组织和设备
const syncHikVisionTEP300 = async server => {
  // TODO:GET HKPET300 Data
  const tree = await buildServerTree(server)
  return tree
}

// 同步厂商(海康威视9600)下的组织和设备
const syncHikVision9600 = async (ctx, server) => {
  try {
    let [organizaList = [], deviceList = []] = await getHikVison9600(ctx, server)
    const metadata = { lane: [], org: [] }
    organizaList.forEach(item => {
      metadata.org.push({
        name: item.org_name,
        id: item.i_id,
        pid: item.p_id,
        code: item.i_index_code,
        origin: server._id
      })
      const devices = _.filter(deviceList, { org_id: item.i_id })
      if (!_.isEmpty(devices)) {
        devices.forEach(dev => {
          metadata.lane.push({
            sid: server._id,
            deptParent: item.p_id,
            deptName: dev.org_name,
            deptId: dev.org_id,
            devIp: dev.devIp,
            devChnFactory: dev.manufacturer === '0' ? '海康威视' : '浙江大华',
            devChnType:
              dev.dev_type === '0'
                ? '硬盘录像机（DVR）'
                : dev.dev_type === '1'
                  ? '视频服务器（DVS)'
                  : '网络摄像机（IPC)',
            devPort: dev.devPort,
            devChnId: dev.dev_index_code,
            devChnName: dev.dev_name
          })
        })
      }
    })
    // 同步数据比对更新
    await syncDiffData(server._id.toString(), metadata)
    const tree = await buildServerTree(server)
    return tree
  } catch (error) {
    handleSysException(error)
  }
}

// 获取海康接口获取组织和设备
const getHikVison9600 = async (ctx, server) => {
  const { ip: platIp, cport: platPort } = server
  const org = await traffic.getHikVison9600Org(ctx, { platIp, platPort, orgType: 'res' })
  const device = await traffic.getHikVison9600Device(ctx, { platIp, platPort, devType: 2 })
  return [org, device]
}

// 同步英泰至接口数据的操作(原有方法)
const syncYTZ = async server => {
  try {
    const payload = { cmdBase: { devIp: server.ip, devPort: server.cport } }
    // 获取GetDoorDevInfoMA2DA proto
    const basePro = util.baseProto('GetTrafficDevInfoMA2DA')
    const structPro = util.getProtoMsg(basePro, 'CommandGeneric')
    const bufReq = util.encode(structPro, payload)
    const result = await util.tcp(bufReq, command.VMR_COMMAND_MA2DA_TRAF_GET_INFO_LIST)
    // 请求成功，解析获取解码的buffer数据
    if (result.code === 0) {
      const resPro = util.getProtoMsg(basePro, 'GetTraDevInfoResp')
      const bytes = util.decode(resPro, result.message)
      // 把buff字节转换成json对象
      const byteJson = JSON.parse(Buffer.from(bytes.traInfo, 'base64'))
      const metadata = { lane: [], org: [] }
      if (!_.isEmpty(byteJson.equipInfo)) {
        byteJson.equipInfo.forEach(item => {
          // 获取到所有的设备
          metadata.lane.push(_.assign(item, { sid: server._id.toString() }))
        })
      }
      metadata.lane.forEach(item => {
        if (!_.find(metadata.org, { id: item.deptId })) {
          metadata.org.push({
            name: item.deptName,
            id: item.deptId,
            pid: item.deptParent,
            origin: server._id
          })
        }
      })

      await syncDiffData(server._id.toString(), metadata)
      const tree = await buildServerTree(server)
      return tree
    } else {
      return []
    }
  } catch (error) {
    return []
    // handleSysException(error)
  }
}
/**
 * 同步远程服务器数据到本地。删除本地基础数据与远程删除掉的关联配置数据。
 * 保存远程同步的基础数据
 * @param {*} sid 同步的服务器的_id
 * @param {*} metadata 同步数据
 */
const syncDiffData = async (sid, metadata) => {
  let ids = await TrafficLane.find({ sid }, '_id').lean()
  ids = ids.map(item => item._id.toString())
  const [cfgs] = await Promise.all([
    AlarmCfg.find({ resource: { $in: ids } }).lean(),
    TrafficLane.deleteMany({ sid }),
    ThirdPartyOrg.deleteMany({ type: sid })
  ])

  // 移除不存在设备的报警配置并创建设备配置
  const devChnIds = metadata.lane.map(node => node.devChnId)
  const detach = cfgs
    .map(item => item.spare)
    .filter(spare => {
      if (spare) {
        return !devChnIds.includes(spare)
      }
    })
  // 组织类型为当期服务器id
  metadata.org.forEach(doc => {
    if (doc.pid === doc.id) {
      doc.isroot = true
    }
    doc.type = sid
  })
  await Promise.all([
    AlarmCfg.deleteMany({ spare: { $in: detach }, type: 8 }),
    TrafficLane.create(metadata.lane),
    ThirdPartyOrg.create(metadata.org)
  ])
}
/**
 * 生成机构树
 * @param {*} server
 */
const buildServerTree = async server => {
  const sid = server._id.toString()
  const orgs = await ThirdPartyOrg.find({ type: sid }, '-createdAt -updatedAt -__v').lean()
  if (orgs.length) {
    const root = orgs.find(org => org.isroot === true)
    root.pid = sid
    root.isroot = false
  }
  orgs.push({
    name: server.name,
    _id: server._id,
    id: server._id,
    pid: '',
    isroot: true,
    sid: sid,
    type: sid,
    series: server.series
  })
  return transData2Tree(orgs, 'id', 'pid')
}
