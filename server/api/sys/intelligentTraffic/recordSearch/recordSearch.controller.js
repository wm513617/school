/*
 * @Author: linhang
 * @Date: 2019-07-31 15:55:56
 * @Last Modified by: linhang
 * @Last Modified time: 2019-10-29 11:01:01
 */
'use strict'
const { mkdirsSync, handleSysException } = require('../../../../common/tools')
const config = require('../../../../../config').backend
const randomString = require('randomstring')
const PassVehicle = mongoose.model('passvehicle')
const PeopleVehicle = mongoose.model('peoplevehicle')
const paging = require('../../../../api/paging')
const xlsx = require('node-xlsx')
const TrafficLane = mongoose.model('TrafficLane')
const Device = mongoose.model('Device')
const tool = require('../../../../common/tools')
const ThirdPartyOrg = mongoose.model('ThirdPartyOrg')
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const { transData2Tree, deleteNoChildrenOrgs } = require('../../../../common/tools')
const constant = require('./constant')
const { ORG_TYPE } = require('../../../../common/constant')

/**
 * 获取海康9600推送的实时过车数据
 */
exports.passVehicleData = async (buffer, object) => {
  try {
    if (object.type === 'traffic') {
      const data = object.data
      const time = moment(data.passTime).format('X')
      const date = moment().format('YYYY-MM-DD')
      const folder = path.join(config.fileDirs.roadVehiclePicDir, date)
      if (!fs.existsSync(folder)) {
        mkdirsSync(folder)
      }
      const vehiclePicPath = path.join(folder, `vehicle${randomString.generate(10)}${time}.jpg`)
      fs.writeFileSync(vehiclePicPath, buffer)
      const vehiclePic = `/image${vehiclePicPath.split(config.fileDirs.baseDir).pop()}`

      const hkServer = await Device.findOne(
        { manufacturer: 'hikvision', type: 'traffic', series: '9600' },
        'name'
      ).lean() // 获取海康视频服务器
      // 根据抓拍机编号查询抓拍机名称
      const device = await TrafficLane.findOne({
        sid: hkServer ? hkServer._id : mongoose.Types.ObjectId(),
        devChnId: data.cameraIndexCode
      }).lean()
      // 构建写入数据库数据
      const postData = {
        time: time,
        date: date,
        vehiclePic: vehiclePic,
        limitSpeed: Number(data.limitSpeed),
        cameraIndexCode: data.cameraIndexCode,
        vehicleType: Number(data.vehicleType),
        vehicleState: Number(data.vehicleState),
        plateType: Number(data.plateType),
        vehicleColor: Number(data.vehicleColor),
        orgName: data.orgName,
        plateInfo: data.plateInfo,
        plateColor: Number(data.plateColor),
        vehColorDepth: Number(data.vehColorDepth),
        laneId: Number(data.laneId),
        alarmAction: Number(data.alarmAction),
        passTime: data.passTime,
        orgIndex: data.orgIndex,
        vehicleSpeed: Number(data.vehicleSpeed),
        cameraName: data.objName, // 抓拍机名称
        eventType: data.event_type // 告警类型
      }
      if (device) {
        postData.deviceIp = device.devIp // 抓拍机ip
        postData.devicePort = device.devPort // 抓拍机端口号
        postData.orgId = device.deptId // 机构id
        await PassVehicle.create(postData)
      } else {
        await PassVehicle.create(postData)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/**
 * 获取过车记录
 */
exports.getVehicleRecord = async ctx => {
  try {
    const query = getVehicleRecordQuery(ctx)
    const page = ctx.query.page
    const data = await paging.listQuery(
      PassVehicle,
      query,
      'cameraName time vehicleType plateType vehicleColor vehicleSpeed vehiclePic vehicleState vehicleInfo limitSpeed plateInfo',
      { _id: -1 },
      page,
      '',
      ctx
    )
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取过车记录查询参数
 * @param {*} ctx
 */
const getVehicleRecordQuery = ctx => {
  try {
    const query = {}
    const search = ctx.query.search
    // 卡口编号
    if (search.cross) {
      query.cameraIndexCode = search.cross
    }
    // 组织id
    if (search.orgId) {
      query.orgId = search.orgId
    }
    // 车牌号码
    if (search.plateInfo) {
      query.plateInfo = { $regex: search.plateInfo }
    }
    // 车型
    if (search.vehicleType) {
      query.vehicleType = Number(search.vehicleType)
    }
    // 车辆品牌
    if (search.plateType) {
      query.plateType = Number(search.plateType)
    }
    // 车身颜色
    if (search.vehicleColor) {
      query.vehicleColor = Number(search.vehicleColor)
    }
    // 车速范围
    if (search.speedMin && search.speedMax) {
      query.vehicleSpeed = { $gte: Number(search.speedMin), $lte: Number(search.speedMax) }
    }
    // 时间
    if (search.startTime && search.endTime) {
      query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    return query
  } catch (error) {
    throw error
  }
}
/**
 * 过车记录导出,上限2万条数据
 */
exports.passVehicleExport = async ctx => {
  try {
    const query = getVehicleRecordQuery(ctx)
    const data = await PassVehicle.find(query)
      .sort({ _id: -1 })
      .limit(20000)
      .lean()
    // 定义表头
    const dataArr = [['车牌号码', '过车时间', '卡口', '车型', '车辆品牌', '车辆颜色', '车速']]
    // 将设备信息Push到sheet
    data.forEach(item => {
      const arr = [
        item.plateInfo,
        moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        item.cameraName,
        constant['vehicleType'][item.vehicleType] || constant['vehicleType']['1'],
        constant['plateType'][item.plateType],
        constant['vehicleColor'][item.vehicleColor],
        item.vehicleSpeed + 'km/h'
      ]
      dataArr.push(arr)
    })
    // 设置列样式
    const ColInfos = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 }
    ]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: '过车记录', data: dataArr }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = moment().format('YYYY-MM-DD')
    ctx.attachment('过车记录' + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 获取超速记录
 */
exports.getOverspeedRecord = async ctx => {
  try {
    const query = getOverspeedRecordQuery(ctx)
    const page = ctx.query.page
    const data = await paging.listQuery(
      PassVehicle,
      query,
      'plateInfo cameraName vehicleSpeed time vehicleState limitSpeed vehiclePic vehicleType plateType vehicleColor',
      { _id: -1 },
      page,
      '',
      ctx
    )
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取超速记录查询参数
 * @param {*} ctx
 */
const getOverspeedRecordQuery = ctx => {
  try {
    const query = {}
    const search = ctx.query.search
    // 车牌号码
    if (search.plateInfo) {
      query.plateInfo = { $regex: search.plateInfo }
    }
    // 卡口
    if (search.cross) {
      query.cameraIndexCode = search.cross
    }
    // 组织id
    if (search.orgId) {
      query.orgId = search.orgId
    }
    // 时间
    if (search.startTime && search.endTime) {
      query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    query.eventType = '1114625'
    return query
  } catch (error) {
    throw error
  }
}
/**
 * 超速记录导出,上限2万条数据
 */
exports.overspeedRecordExport = async ctx => {
  try {
    const query = getOverspeedRecordQuery(ctx)
    const data = await PassVehicle.find(query)
      .sort({ _id: -1 })
      .limit(20000)
      .lean()
    // 定义表头
    const dataArr = [['车牌号码', '卡口', '速度', '限制速度', '违章时间']]
    // 将设备信息Push到sheet
    data.forEach(item => {
      const arr = [
        item.plateInfo,
        item.cameraName,
        item.vehicleSpeed + 'km/h',
        item.limitSpeed + 'km/h',
        moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')
      ]
      dataArr.push(arr)
    })
    // 设置列样式
    const ColInfos = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: '超速记录', data: dataArr }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = moment().format('YYYY-MM-DD')
    ctx.attachment('超速记录' + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取违停记录
 */
exports.getVioParkRecord = async ctx => {
  try {
    const query = getVioParkRecordQuery(ctx)
    const page = ctx.query.page

    const data = await paging.listQuery(
      PassVehicle,
      query,
      'plateInfo cameraName vehicleSpeed limitSpeed time vehicleState vehiclePic vehicleType plateType vehicleColor',
      { _id: -1 },
      page,
      '',
      ctx
    )
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取违停记录查询参数
 * @param {*} ctx
 */
const getVioParkRecordQuery = ctx => {
  try {
    const query = {}
    const search = ctx.query.search
    // 车牌号码
    if (search.plateInfo) {
      query.plateInfo = { $regex: search.plateInfo }
    }
    // 卡口
    if (search.cross) {
      query.cameraIndexCode = search.cross
    }
    // 组织id
    if (search.orgId) {
      query.orgId = search.orgId
    }
    // 时间
    if (search.startTime && search.endTime) {
      query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    query.eventType = '1114642'
    return query
  } catch (error) {
    throw error
  }
}
/**
 * 违停记录导出,上限2万条数据
 */
exports.vioParkRecordExport = async ctx => {
  try {
    const query = getVioParkRecordQuery(ctx)
    const data = await PassVehicle.find(query)
      .sort({ _id: -1 })
      .limit(20000)
      .lean()
    // 定义表头
    const dataArr = [['车牌号码', '违停球', '违章时间']]
    // 将设备信息Push到sheet
    data.forEach(item => {
      const arr = [item.plateInfo, item.cameraName, moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss')]
      dataArr.push(arr)
    })
    // 设置列样式
    const ColInfos = [{ width: 20 }, { width: 20 }, { width: 20 }]
    const option = { '!cols': ColInfos }
    const buffer = await xlsx.build([{ name: '违停记录', data: dataArr }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = moment().format('YYYY-MM-DD')
    ctx.attachment('违停记录' + timeStr + '.xlsx')
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取人车同检记录
 */
exports.getPeopleVehicleCheckRecord = async ctx => {
  try {
    const query = getVehicleCheckRecordQuery(ctx)
    const page = ctx.query.page
    const data = await paging.listQuery(
      PeopleVehicle,
      query,
      'plateNo time gateName similar checkResult recordName recordPlateNo recordContact recordDriverPic driverPic vehiclePic',
      { _id: -1 },
      page,
      '',
      ctx
    )
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取人车同检查询参数
 * @param {*} ctx
 */
const getVehicleCheckRecordQuery = ctx => {
  try {
    const query = {}
    const search = ctx.query.search
    // 核验结果
    if (search.checkResult && search.checkResult === 'all') {
      query.checkResult = { $in: [0, 1, 2] }
    } else if (search.checkResult) {
      query.checkResult = search.checkResult
    }
    // 车牌号码
    if (search.plateInfo) {
      query.plateNo = { $regex: search.plateInfo }
    }
    // 车主姓名
    if (search.name) {
      query.recordName = { $regex: search.name }
    }
    // 位置
    if (search.gateName) {
      query.gateName = search.gateName
    }
    // 时间
    if (search.startTime && search.endTime) {
      query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    query.check = true // check为true代表人车同检过
    return query
  } catch (error) {
    throw error
  }
}
/**
 * 人车同检记录导出,上限2万条数据
 */
exports.vehicleCheckRecordExport = async ctx => {
  try {
    const query = getVehicleCheckRecordQuery(ctx)
    const data = await PeopleVehicle.find(query)
      .sort({ _id: -1 })
      .limit(20000)
      .lean()
    // 定义表头
    const dataArr = [['车牌号码', '位置', '车主姓名', '手机号码', '时间', '核验结果']]
    // 将设备信息Push到sheet
    data.forEach(item => {
      const arr = [
        item.plateNo,
        item.gateName,
        item.recordName,
        item.recordContact,
        moment(item.time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        item.checkResult === 0 ? '提取失败' : item.checkResult === 1 ? '核验成功' : '核验失败'
      ]
      dataArr.push(arr)
    })
    // 设置列样式
    const ColInfos = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: '人车同检记录', data: dataArr }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = moment().format('YYYY-MM-DD')
    ctx.attachment('人车同检记录' + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取常量数据
 */
exports.getVehicleConstant = async ctx => {
  try {
    const object = require('./constant')
    ctx.body = object
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取卡口树
 */
exports.getHkDeviceTree = async ctx => {
  try {
    // 获取海康9600视频服务器
    const hkServer = await Device.findOne({ manufacturer: 'hikvision', type: 'traffic', series: '9600' }, 'name').lean()
    // 如果没有在交通管理里边添加海康服务器
    if (!hkServer) {
      ctx.body = []
      return
    }
    // 查询服务器下的组织
    const orgs = await ThirdPartyOrg.find({ origin: hkServer._id }).lean()
    const orgIds = orgs.map(item => item.id)
    orgs.forEach(item => {
      if (item.pid === item.id) {
        delete item.pid
      }
    })
    // 查询组织下的设备
    const devices = await TrafficLane.find({ deptId: { $in: orgIds } }).lean()
    for (let dev of devices) {
      dev.name = dev.devChnName
      dev.equip = true
      for (let org of orgs) {
        org.isOrg = true
        if (org.pid === org.id && org.isroot === true) {
          delete org.pid
        }
        if (dev.deptId === org.id) {
          if (!org.children) {
            org.children = []
          }
          org.children.push(dev)
          break
        }
      }
    }
    // 海康服务器作为根节点
    const tree = tool.transData2Tree(orgs, 'id', 'pid', true)
    ctx.body = tree[0]
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取海康9600同步过来的设备列表，电子地图模块使用
 */
exports.getHik9600Device = async ctx => {
  try {
    const device = await Device.findOne({ manufacturer: 'hikvision', type: 'traffic', series: '9600' }, '_id').lean()
    if (device) {
      const laneList = await TrafficLane.find({ sid: device._id }, 'devChnId devIp devPort').lean()
      if (laneList.length) {
        const resources = await Resource.find({ type: 0 }, 'status name ip port')
          .populate({ path: 'eid', select: 'ip cport name' })
          .lean()
        if (resources.length) {
          const resArr = []
          for (let item of laneList) {
            for (let item1 of resources) {
              if (item.devIp === item1.ip && item1.port === 80) {
                item1.cameraCode = item.devChnId
                resArr.push(item1)
              }
            }
          }
          const orgs = await Org.find({ type: ORG_TYPE.LOCALE }, 'name order isroot pid').lean()
          const allOrgIds = orgs.map(item => item._id)
          const orgReses = await OrgRes.find({ islane: false, org: { $in: allOrgIds } }).lean()
          const resMap = {}
          resArr.forEach(item => {
            resMap[item._id] = item
          })
          const orgResMap = {}
          orgReses.forEach(item => {
            if (!orgResMap[item.org]) {
              orgResMap[item.org] = []
            }
            if (resMap[item.resource]) {
              orgResMap[item.org].push(resMap[item.resource])
            }
          })
          let orgArr = orgs.map(item => {
            item.isOrg = true
            item.children = orgResMap[item._id]
            return item
          })
          orgArr = deleteNoChildrenOrgs(orgArr)
          const data = transData2Tree(orgArr, '_id', 'pid', true)
          ctx.body = data[0]
        } else {
          ctx.body = {}
        }
      } else {
        ctx.body = {}
      }
    } else {
      ctx.body = {}
    }
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 电子地图模块根据抓拍机编号和时间获取过车数据绘制地图轨迹
 */
exports.getHistoryVehicleRecord = async ctx => {
  try {
    const [startTime, endTime] = [ctx.query.startTime, ctx.query.endTime]
    const query = { time: { $gte: Number(startTime), $lte: Number(endTime) } }
    const cameraIndexCodeList = ctx.query.cameraCode.split(',')
    if (cameraIndexCodeList[0] !== '') {
      query.cameraIndexCode = { $in: cameraIndexCodeList }
    }
    query.plateInfo = ctx.query.plateNumber
    const data = await PassVehicle.find(query)
      .sort({ _id: -1 })
      .lean()
    if (data.length) {
      // 查询视频资源，type=0
      const resources = await Resource.find({ type: 0, point: { $exists: true } }, 'ip port name point').lean()
      if (resources.length) {
        const resList = []
        for (let item of data) {
          for (let item1 of resources) {
            if (item.deviceIp === item1.ip && item1.port === 80) {
              const obj = {
                vehiclePic: item.vehiclePic,
                time: item.time,
                plateInfo: item.plateInfo,
                vehicleSpeed: item.vehicleSpeed,
                vehicleType: item.vehicleType,
                plateType: item.plateType,
                vehicleColor: item.vehicleColor,
                limitSpeed: item.limitSpeed
              }
              resList.push(Object.assign(item1, obj))
              break
            }
          }
        }
        ctx.body = resList
      } else {
        ctx.body = []
      }
    } else {
      ctx.body = []
    }
  } catch (error) {
    handleSysException(error)
  }
}
