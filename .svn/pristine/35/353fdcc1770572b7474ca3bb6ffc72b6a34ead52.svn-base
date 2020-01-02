/* eslint-disable camelcase */
/**
 * 树统一接口
 * @time:2019-03-25
 * @author:weishuang
 */
// 组织 orgs -> 设备 devices -> 资源 resources
const Org = mongoose.model('Org')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
const ResProperty = mongoose.model('ResProperty')
const Role = mongoose.model('Role')
const postal = require('postal')
let roleOrg = {} // 存放所有角色的非空机构id
let rolePersonnelTrafficOrg = {} // 存放所有角色人员通行非空机构id
const treeClidren = async (ctx, isLoad = true) => {
  // type为0表示现场机构类型
  let equtype = ctx.query.equtype
    ? ctx.query.equtype.split(',').map(item => {
      return Number(item)
    })
    : [0]
  let restype = ctx.query.restype
    ? ctx.query.restype.split(',').map(item => {
      return Number(item)
    })
    : [0]
  // 分三种情况 1.只显示机构 2.显示机构和资源 3.显示机构设备资源
  // 如果equipment为true则表示是机构设备资源树
  if (ctx.query.equipment === 'true') {
    // 如果有eid则表示点击的是设备节点，直接查找资源
    if (ctx.query.eid) {
      // 机构-设备-资源树 现实的是 未分配的资源
      // 先查询已分配的资源
      let selectDistributionId = [
        { $lookup: { from: 'resources', localField: 'resource', foreignField: '_id', as: 'resources' } },
        { $match: { 'resources.eid': mongoose.Types.ObjectId(ctx.query.eid), 'resources.type': { $in: restype } } },
        { $project: { resource: 1 } }
      ]
      let distributionId = await OrgRes.aggregate(selectDistributionId)
      distributionId = distributionId.map(item => {
        return mongoose.Types.ObjectId(item.resource)
      }) // 分配过的id
      // 根据权限获取资源,管理员默认拥有所有资源
      const roleId = ctx.state.user.role
      let matchObj = { $and: [{ type: { $in: restype } }, { eid: mongoose.Types.ObjectId(ctx.query.eid) }, { _id: { $nin: distributionId } }] }
      if (roleId !== '5be27279e74ee9376c681111') {
        const resourceIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
        matchObj.$and.push({ _id: { $in: resourceIds } })
      }
      let selectRes = [{ $match: matchObj }, { $addFields: { tierType: 'res' } }]
      const data = await Resource.aggregate(selectRes)
      return data
    } else {
      // 没有eid表示点击的是机构节点，查机构下对应的机构和设备
      let selectEqu = [
        { $match: { $and: [{ oid: mongoose.Types.ObjectId(ctx.query.oid) }, { bigtype: { $in: equtype } }] } },
        { $addFields: { equip: true, tierType: 'equ' } } // equip字段 是报警处理 用来判断是设备还是机构的字段 tierType是新写的 拦截载用来判断是设备还是在资源的字段
      ]
      let [org, dev] = await Promise.all([treeOrg(ctx), Device.aggregate(selectEqu)])
      // return await Device.aggregate(selectEqu)
      if (isLoad) {
        return [...org, ...dev]
      } else {
        return {
          org: org,
          res: dev
        }
      }
    }
  } else if (ctx.query.resource === 'true') {
    // 如果resource为true则表示是机构设备资源树
    // 查询当前登录用户的资源权限
    const roleId = ctx.state.user.role
    // // 如果是超级管理员拥有所有资源权限
    let matchObj = { 'resources.type': { $in: restype } }
    if (roleId !== '5be27279e74ee9376c681111') {
      const resourceIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      matchObj = { 'resources.type': { $in: restype }, 'resources._id': { $in: resourceIds } }
    }
    // 地图应用 机构资源树 只显示 应用过的 （有 point 字段） 并且符合 mapId
    let filtrationMapId = {}
    let filtrationAbout = {}
    if (ctx.query.mapType === '2D') { // 地图2d过滤
      if (ctx.query.mapId) {
        filtrationMapId['resources.point.mapId'] = mongoose.Types.ObjectId(ctx.query.mapId)
      }
      // 地图 楼内 楼外过滤
      if (ctx.query.storeyId) {
        if (Number(ctx.query.storeyId) === 1) {
          filtrationAbout['$nor'] = [ { 'resources.point.isouter': false } ]
        } else {
          filtrationAbout['$or'] = [ { $and: [{ 'resources.point.isouter': false }, { 'resources.point.sid': mongoose.Types.ObjectId(ctx.query.storeyId) }] }, { 'resources.point': { $exists: false } } ]
        }
      }
    }
    // 地图3d过滤
    if (ctx.query.mapType === '3D') {
      if (ctx.query.storeyId) {
        if (Number(ctx.query.storeyId) === 1) {
          filtrationAbout['$nor'] = [ { 'resources.point3D.isouter': false } ]
        } else {
          filtrationAbout['$or'] = [ { $and: [{ 'resources.point3D.isouter': false }, { 'resources.point3D.sid': mongoose.Types.ObjectId(ctx.query.storeyId) }] }, { 'resources.point3D': { $exists: false } } ]
        }
      }
    }

    // 地图过滤报警箱报警柱
    let filtrationEidType = {}
    if (ctx.query.mapType) {
      // 地图机构树不要报警箱上的针孔摄像头
      filtrationEidType['eid.type'] = { $nin: ['alarmBox', 'alarmPillar'] }
    }
    // 显示资源
    let selectRes = [
      { $match: { org: mongoose.Types.ObjectId(ctx.query.oid) } },
      { $lookup: { from: 'resources', localField: 'resource', foreignField: '_id', as: 'resources' } },
      { $match: matchObj },
      { $match: filtrationMapId }, // 地图过滤
      { $match: filtrationAbout }, // 地图过滤
      { $lookup: { from: 'devices', localField: 'resources.eid', foreignField: '_id', as: 'eid' } },
      { $match: filtrationEidType },
      {
        $project: {
          'tierType': 1,
          'resources.monitoryPointGenera': 1,
          'resources.gbPlaDevIp': 1,
          'resources.gbPlaDevPort': 1,
          'resources.type': 1,
          'resources.point': 1,
          'resources.point3D': 1,
          'resources.mapsign': 1,
          'resources.shareServer': 1,
          'resources.nodeId': 1,
          'resources.name': 1,
          'resources._id': 1,
          'resources.gbDevId': 1,
          'resources.chan': 1,
          'resources.gbParentDevId': 1,
          'resources.monitortype': 1,
          'resources.pinyin': 1,
          'resources.status': 1,
          'resources.stream': 1,
          'eid.ip': 1,
          'eid.cport': 1,
          'eid.dport': 1,
          'eid.manufacturer': 1,
          'eid.name': 1,
          'eid.type': 1,
          'eid._id': 1,
          'eid.deviceStatus': 1,
          'eid.status': 1
        }
      }
    ]
    let [org, res] = await Promise.all([treeOrg(ctx), OrgRes.aggregate(selectRes)])
    res = res.filter(item => {
      // 20.7 数据库 有 没有设备的资源
      if (item.eid.length) {
        return true
      } else {
        return false
      }
    })
    res = res.map(item => {
      return {
        monitoryPointGenera: item.resources[0].monitoryPointGenera,
        mapsign: item.resources[0].mapsign,
        point: item.resources[0].point,
        point3D: item.resources[0].point3D,
        type: item.resources[0].type,
        tierType: 'res',
        chan: item.resources[0].chan,
        eid: {
          cport: item.eid[0].cport,
          dport: item.eid[0].dport,
          ip: item.eid[0].ip,
          manufacturer: item.eid[0].manufacturer,
          name: item.eid[0].name,
          type: item.eid[0].type,
          status: item.eid[0].status,
          deviceStatus: item.eid[0].deviceStatus,
          _id: item.eid[0]._id
        },
        gbDevId: item.resources[0].gbDevId,
        gbParentDevId: item.resources[0].gbParentDevId,
        gbPlaDevIp: item.resources[0].gbPlaDevIp,
        gbPlaDevPort: item.resources[0].gbPlaDevPort,
        monitortype: item.resources[0].monitortype,
        name: item.resources[0].name,
        pinyin: item.resources[0].pinyin,
        status: item.resources[0].status,
        stream: item.resources[0].stream,
        shareServer: item.resources[0].shareServer,
        nodeId: item.resources[0].nodeId,
        _id: item.resources[0]._id
      }
    })
    if (isLoad) {
      return [...org, ...res]
    } else {
      return {
        org,
        res
      }
    }
  } else {
    // 机构树，只显示机构
    const data = await treeOrg(ctx)
    if (isLoad) {
      return data
    } else {
      return {
        org: data,
        res: []
      }
    }
  }
}
const treeOrg = async (ctx) => {
  // 获取机构下的机构
  let orgIds = roleOrg[ctx.state.user.role] || []
  if (ctx.query.oid) {
    let matchOrg = {
      pid: mongoose.Types.ObjectId(ctx.query.oid)
    }
    if (ctx.query.resource) {
      matchOrg._id = { $nin: orgIds.map(item => mongoose.Types.ObjectId(item)) }
    }

    let personnelTraffic = {}
    // 人员通行权限过滤
    if (Number(ctx.query.orgtype) === 10) {
      const roleId = ctx.state.user.role
      if (roleId !== '5be27279e74ee9376c681111' && rolePersonnelTrafficOrg[roleId]) {
        personnelTraffic = { _id: { $in: rolePersonnelTrafficOrg[roleId].map(item => mongoose.Types.ObjectId(item)) } }
      }
    }

    let selectOrg = [
      // 为了让前端机构树显示箭头
      // { $match: { pid: mongoose.Types.ObjectId(ctx.query.oid), _id: { $nin: orgIds.map(item => mongoose.Types.ObjectId(item)) } } },
      { $match: matchOrg },
      { $match: personnelTraffic }, // 人员通行机构显示权限过滤
      { $addFields: { tierType: 'org' } }, // 为了让前端机构树显示箭头
      { $sort: { order: 1 } },
      { $project: { isroot: 1, code: 1, name: 1, order: 1, pid: 1, pinyin: 1, _id: 1, children: 1, tierType: 1 } }
    ]
    const data = await Org.aggregate(selectOrg)
    return data
  }
}
exports.getOneTree = async ctx => {
  try {
    /**
     * 返回机构下的 机构 设备 资源 （按类型）
     * tierType: org 是机构， equ 是设备
     * @param {*}
     * @returns
     */

    if (!ctx.query.oid && !ctx.query.eid) {
      // 首次获取机构树只返回根机构信息
      let selectOrg = [
        { $match: { $and: [{ type: Number(ctx.query.orgtype) }, { isroot: true }] } },
        { $addFields: { tierType: 'org' } },
        { $project: { isroot: 1, code: 1, name: 1, order: 1, pid: 1, pinyin: 1, _id: 1, children: 1, tierType: 1 } }
      ]
      const data = await Org.aggregate(selectOrg)
      ctx.body = data
    } else {
      // 非首次请求获取机构下的数据
      const data = await treeClidren(ctx)
      ctx.body = data
    }
  } catch (err) {
    console.log('机构树获取失败：' + err)
    ctx.throw(500, { code: 1010, message: '机构树获取失败', err: err })
  }
}
exports.getOneTreeSeek = async ctx => {
  if (ctx.query.orgseek !== undefined) {
    let personnelTraffic = {}
    // 人员通行权限过滤
    if (Number(ctx.query.orgtype) === 10) {
      const roleId = ctx.state.user.role
      if (roleId !== '5be27279e74ee9376c681111' && rolePersonnelTrafficOrg[roleId]) {
        personnelTraffic = { _id: { $in: rolePersonnelTrafficOrg[roleId].map(item => mongoose.Types.ObjectId(item)) } }
      }
    }
    // 搜索机构  按名称搜索
    let selectOrg = [
      { $match: { $and: [{ type: Number(ctx.query.orgtype) }] } },
      { $match: personnelTraffic }, // 人员通行机构显示权限过滤
      { $match: { $or: [{ name: { $regex: ctx.query.orgseek + '' || '' } }] } },
      { $addFields: { tierType: 'org' } },
      {
        $project: {
          isroot: 1,
          code: 1,
          name: 1,
          order: 1,
          pid: 1,
          pinyin: 1,
          _id: 1,
          children: 1,
          tierType: 1,
          type: 1
        }
      }
    ]
    ctx.body = await Org.aggregate(selectOrg)
  }
  if (ctx.query.resseek !== undefined) {
    let restype = ctx.query.restype
      ? ctx.query.restype.split(',').map(item => {
        return Number(item)
      })
      : [0] // 默认查资源类型 为 0
    // 查询权限
    const roleId = ctx.state.user.role
    let matchObj = { 'resources.type': { $in: restype } }
    // 如果是管理员，默认拥有所有权限
    if (roleId !== '5be27279e74ee9376c681111') {
      const resourceIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      matchObj['resources._id'] = { $in: resourceIds }
    }
    // 地图应用 机构资源树 只显示 应用过的 （有 point 字段） 并且符合 mapId
    let filtrationMapId = {}
    let filtrationAbout = {}
    if (ctx.query.mapType === '2D') { // 地图2d过滤
      if (ctx.query.mapId) {
        filtrationMapId['resources.point.mapId'] = mongoose.Types.ObjectId(ctx.query.mapId)
      }
      // 地图 楼内 楼外过滤
      if (ctx.query.storeyId) {
        if (Number(ctx.query.storeyId) === 1) {
          filtrationAbout['$nor'] = [ { 'resources.point.isouter': false } ]
        } else {
          filtrationAbout['$or'] = [ { $and: [{ 'resources.point.isouter': false }, { 'resources.point.sid': mongoose.Types.ObjectId(ctx.query.storeyId) }] }, { 'resources.point': { $exists: false } } ]
        }
      }
    }
    // 地图3d过滤
    if (ctx.query.mapType === '3D') {
      if (ctx.query.storeyId) {
        if (Number(ctx.query.storeyId) === 1) {
          filtrationAbout['$nor'] = [ { 'resources.point3D.isouter': false } ]
        } else {
          filtrationAbout['$or'] = [ { $and: [{ 'resources.point3D.isouter': false }, { 'resources.point3D.sid': mongoose.Types.ObjectId(ctx.query.storeyId) }] }, { 'resources.point3D': { $exists: false } } ]
        }
      }
    }
    let filtrationEidType = {}
    if (ctx.query.mapType) {
      // 地图机构树不要报警箱上的针孔摄像头
      filtrationEidType['eid.type'] = { $nin: ['alarmBox', 'alarmPillar'] }
    }
    let selectRes = [
      { $lookup: { from: 'orgs', localField: 'org', foreignField: '_id', as: 'org' } },
      { $match: { 'org.type': Number(ctx.query.orgtype || 0) } },
      { $lookup: { from: 'resources', localField: 'resource', foreignField: '_id', as: 'resources' } },
      { $match: matchObj },
      { $match: filtrationMapId }, // 地图过滤
      { $match: filtrationAbout }, // 地图过滤
      {
        $match: {
          $or: [{ 'resources.name': { $regex: ctx.query.resseek + '' || '' } }, { 'resources.ip': { $regex: ctx.query.resseek + '' || '' } }]
        }
      },
      { $addFields: { tierType: 'res' } },
      { $lookup: { from: 'devices', localField: 'resources.eid', foreignField: '_id', as: 'eid' } },
      { $match: filtrationEidType },
      {
        $project: {
          'tierType': 1,
          'resources.monitoryPointGenera': 1,
          'resources.gbPlaDevIp': 1,
          'resources.gbPlaDevPort': 1,
          'resources.type': 1,
          'resources.point': 1,
          'resources.point3D': 1,
          'resources.mapsign': 1,
          'resources.shareServer': 1,
          'resources.nodeId': 1,
          'resources.name': 1,
          'resources._id': 1,
          'resources.gbDevId': 1,
          'resources.chan': 1,
          'resources.gbParentDevId': 1,
          'resources.monitortype': 1,
          'resources.pinyin': 1,
          'resources.status': 1,
          'resources.stream': 1,
          'eid.ip': 1,
          'eid.cport': 1,
          'eid.dport': 1,
          'eid.manufacturer': 1,
          'eid.name': 1,
          'eid.type': 1,
          'eid._id': 1,
          'eid.deviceStatus': 1,
          'eid.status': 1
        }
      }
    ]
    let res = await OrgRes.aggregate(selectRes)
    res = res.filter(item => {
      // 20.7 数据库 有 没有设备的资源
      if (item.eid.length) {
        return true
      } else {
        return false
      }
    })
    res = res.map(item => {
      if (!item.eid.length) {
        return null
      }
      return {
        monitoryPointGenera: item.resources[0].monitoryPointGenera,
        mapsign: item.resources[0].mapsign,
        point: item.resources[0].point,
        point3D: item.resources[0].point3D,
        type: item.resources[0].type,
        tierType: 'res',
        chan: item.resources[0].chan,
        eid: {
          cport: item.eid[0].cport,
          dport: item.eid[0].dport,
          ip: item.eid[0].ip,
          manufacturer: item.eid[0].manufacturer,
          name: item.eid[0].name,
          type: item.eid[0].type,
          status: item.eid[0].status,
          deviceStatus: item.eid[0].deviceStatus,
          _id: item.eid[0]._id
        },
        gbDevId: item.resources[0].gbDevId,
        gbParentDevId: item.resources[0].gbParentDevId,
        gbPlaDevIp: item.resources[0].gbPlaDevIp,
        gbPlaDevPort: item.resources[0].gbPlaDevPort,
        monitortype: item.resources[0].monitortype,
        name: item.resources[0].name,
        pinyin: item.resources[0].pinyin,
        status: item.resources[0].status,
        stream: item.resources[0].stream,
        shareServer: item.resources[0].shareServer,
        nodeId: item.resources[0].nodeId,
        _id: item.resources[0]._id
      }
    })
    ctx.body = res
  }
}
exports.getOneChildNod = async ctx => {
  // 获取该机构下所有的机构和资源
  try {
    let orgTree = {}
    let orgId = []
    let resourceId = []
    let getChild = async (oid, orgTree) => {
      ctx.query.oid = oid
      let firstFloorRes = await treeClidren(ctx, false)
      orgId = [...orgId, ...firstFloorRes.org.map(item => { return item._id })]
      resourceId = [...resourceId, ...firstFloorRes.res.map(item => { return item._id })]
      orgTree.children = [...firstFloorRes.org, ...firstFloorRes.res]
      if (firstFloorRes.org.length !== 0) {
        for (const iterator of firstFloorRes.org) {
          if (iterator.tierType === 'org') {
            await getChild(iterator._id, iterator)
          }
        }
      }
    }
    let oid = ctx.query.oid
    if (!oid) {
      ctx.throw(500, { code: 1019, message: '请传入正确oid' })
    }
    await getChild(oid, orgTree)
    ctx.body = {
      tree: orgTree.children,
      orgId,
      resourceId
    }
  } catch (err) {
    ctx.throw(500, { code: 1010, message: '机构树获取失败', err: err })
    console.log('机构树获取失败：' + err)
  }
}
exports.updateRoleOrg = async (role) => {
  delete roleOrg[role]
  filterEmptyOrg(role)
}
let filtrationPolrId = async (role) => {
  let resIds = await ResProperty.distinct('resource', { role: role, type: 0, 'properties.0': { $exists: true } })
  let existOrgIdsSelect = [
    { $match: { 'resource': { $in: resIds.map(item => mongoose.Types.ObjectId(item)) } } },
    { $lookup: { from: 'orgs', localField: 'org', foreignField: '_id', as: 'orgs' } },
    { $match: { 'orgs.type': 0 } },
    { $project: { 'org': 1, 'orgs.pid': 1 } }
  ]
  let [existOrgIds, orgIds] = await Promise.all([OrgRes.aggregate(existOrgIdsSelect), Org.distinct('_id', { type: 0, isroot: false })])
  let existOrgObj = {}
  existOrgIds.map(item => {
    existOrgObj[item.org] = item.org
    existOrgObj[item.orgs[0].pid] = item.orgs[0].pid
  })
  let emptyOrgIds = []
  for (const id of orgIds) {
    if (!existOrgObj[id]) {
      emptyOrgIds.push(id)
    }
  }
  try {
    for (const iterator of emptyOrgIds) {
      // 递归确定改机构下是否有资源
      let recursionOrg = async (orgId) => {
        let orgResSelect = {
          org: orgId
        }
        if (String(role) !== '5be27279e74ee9376c681111') {
          orgResSelect.resource = { $in: resIds.map(item => mongoose.Types.ObjectId(item)) }
        }
        let selectOrg = [
          { $match: orgResSelect },
          { $lookup: { from: 'resources', localField: 'resource', foreignField: '_id', as: 'resources' } },
          { $match: { 'resources.type': 0 } },
          { $limit: 1 },
          { $project: { _id: 1 } }
        ]
        let [sonOrg, sonRes] = await Promise.all([Org.find({pid: orgId}).lean(), OrgRes.aggregate(selectOrg)])
        if (sonRes.length !== 0) {
          return true
        }
        if (sonOrg.length === 0) {
          return false
        }
        for (const orgObj of sonOrg) {
          let status = await recursionOrg(orgObj._id)
          if (status) {
            return true
          }
        }
        return false
      }

      let isEmpty = await recursionOrg(iterator)
      if (!isEmpty) {
        // 确实是个空机构啊
        if (!roleOrg[role]) {
          roleOrg[role] = []
        }
        if (!roleOrg[role].includes(iterator)) {
          roleOrg[String(role)].push(iterator)
        }
      }
    }
  } catch (err) {
  }
}
// 过滤所有角色的空机构
const filterEmptyOrg = async (role) => {
  try {
    if (role) {
      filtrationPolrId(role)
    } else {
      let roleIds = await Role.find({}, '_id').lean()
      for (const role of roleIds) {
        filtrationPolrId(role._id)
      }
    }
  } catch (err) {
  }
}
filterEmptyOrg()

// 过滤人员通行空机构
const filterPersonnelTrafficOrg = async (role) => {
  let filterFun = async (role) => {
    const data = await ResProperty.distinct('resource', { role: role, type: 6, properties: { $elemMatch: { $eq: 'show' } } })
    let orgs = await Org.find({ _id: { $in: data } }, 'pid')
    let orgPids = []
    let selectOrgParent = async (id) => {
      let org = await Org.findOne({ _id: id })
      if (org) {
        orgPids.push(org._id)
      } else {
        return
      }
      if (!org.isroot) {
        await selectOrgParent(org.pid)
      }
    }
    for (const iterator of orgs) {
      await selectOrgParent(iterator.pid)
    }
    rolePersonnelTrafficOrg[String(role)] = [...data, ...orgPids]
  }

  if (role) {
    filterFun(role)
  } else {
    let roleIds = await Role.find({}, '_id').lean()
    for (const role of roleIds) {
      filterFun(role._id)
    }
  }
}

filterPersonnelTrafficOrg()

// 某个角色资源权限修改后，空机构缓存
postal.subscribe({
  channel: 'role',
  topic: 'role.update',
  callback: async data => {
    delete roleOrg[data.roleId]
    filterEmptyOrg(data.roleId)
    filterPersonnelTrafficOrg(data.roleId)
  }
})
// 资源分配改变后 更新机构
postal.subscribe({
  channel: 'resource',
  topic: 'org.update',
  callback: async data => {
    delete roleOrg[data.roleId]
    filterEmptyOrg(data.roleId)
  }
})
