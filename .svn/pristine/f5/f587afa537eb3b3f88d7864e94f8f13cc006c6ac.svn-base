'use strict'

var VehicleIdenfiy = require('mongoose').model('VehicleIdentify')
var VehicleDefense = require('mongoose').model('VehicleDefense')
var Defenserecord = require('mongoose').model('Defenserecord')
var Vehicle = require('mongoose').model('Vehicle')
var Lane = require('mongoose').model('Lane')
var Dict = require('mongoose').model('Dict')
// var ServerSetting = require('mongoose').model('ServerSetting')
// var Crossing = require('mongoose').model('Crossing')
// var Lane = require('mongoose').model('Lane')
var VehicleBrand = require('mongoose').model('VehicleBrand')
var Resource = require('mongoose').model('Resource')
var paging = require('../../paging')
var vehiclesocket = require('./vehiclesocket')
var _ = require('lodash')
var gfs = require('../../../common/gridfs.util')
var request = require('request')
/**
 * 车辆识别请求处理接口
 * 保存识别信息
 */
exports.create = async (ctx, next) => {
  try {
    const requestObj = ctx.request.body
    const vehicleIdenfiy = requestObj.detail.Vehicles
    const bikesIdenfiy = requestObj.detail.Bikes
    const pedestrainsIdenfiy = requestObj.detail.Pedestrains
    // --------------------------------车辆识别信息处理--------------------------------
    if (vehicleIdenfiy && vehicleIdenfiy.length > 0) {
      const nowTime = Math.ceil(new Date().getTime() / 1000)
      const defenseData = await VehicleDefense.find({ startTime: { $lt: nowTime }, endTime: { $gt: nowTime }, state: 1 }, 'licence type isDefenseAll videoChannels').exec() // 查询符合条的布防车牌
      const vehicleManages = await Vehicle.find({}, 'list licence').exec() // 获取车辆管理，每台车对应的分类
      // 字典组织数据
      const dictDatas = await Dict.find({ type: { $in: ['vehicleColor', 'vehicleListType', 'vehicle'] } }).exec()
      const dictVehicleColor = _(dictDatas).filter(n => n.type === 'vehicleColor')
      const dictVehicleListType = _(dictDatas).filter(n => n.type === 'vehicleListType')
      const dictVehicle = _(dictDatas).filter(n => n.type === 'vehicle')
      const dicColor = {}
      const dicListType = {}
      const dicVehicle = {}
      _(dictVehicleColor).forEach(n => { dicColor[n.code] = n.name })
      _(dictVehicleListType).forEach(n => { dicListType[n.code] = n.name })
      _(dictVehicle).forEach(n => { dicVehicle[n.code] = n.name })
      const licenceList = {} // 车牌车辆分类字典
      _(vehicleManages).forEach(n => {
        licenceList[n.licence] = n.list
      })
      for (let i = 0; i < vehicleIdenfiy.length; i++) {
        const imageObj = await gfs.uploadFileToGFSWithBase64(requestObj.imageDatas[vehicleIdenfiy[i].GUID])
        const temp = vehicleIdenfiy[i].Recognize
        // 初始化值
        const newVehicleIdenfiy = {
          channelid: requestObj.detail.VideoChannel, // 视频频道
          vehicleType: vehicleIdenfiy[i].Type, //  车辆类型
          timeStamp: Math.ceil(vehicleIdenfiy[i].Timestamp * 1 / 1000), // 抓拍时间
          image: imageObj.id, // 图片
          createTime: nowTime, // （当前时间戳）
          createDateTime: new Date().setHours(0, 0, 0, 0) / 1000, // 创建时间（小时）
          licence: '未识别',
          color: 0,
          brand: '未识别'
        }
        // 车牌赋值
        if (temp.Plate && temp.Plate.Licence) {
          // eslint-disable-next-line
          newVehicleIdenfiy.licence = temp.Plate.Licence, // 车牌
          newVehicleIdenfiy.vehicleList = licenceList[temp.Plate.Licence] || 0 // 车辆管理分类，若匹配不到，就是0（其它）
        }
        // 车身颜色赋值
        if (temp.Color && temp.Color.TopList.length > 0) { newVehicleIdenfiy['color'] = temp.Color.TopList[0].Code } // 同上（车身颜色）
        // 车辆品牌赋值
        if (temp.Brand && temp.Brand.TopList.length > 0) {
          // eslint-disable-next-line
          newVehicleIdenfiy['brand'] = temp.Brand.TopList[0].Name.split('-')[0], // 将车辆品牌信息取出来保存，便于后面查询
          newVehicleIdenfiy['model'] = temp.Brand.TopList[0].Name.split('-')[1] // 将车辆型号信息取出来保存，便于后面查询
          // 车辆品牌型号表添加数据(若不存在数据则添加数据)
          const checkBrand = await VehicleBrand.find({ brand: newVehicleIdenfiy.brand, model: newVehicleIdenfiy.model }).exec()
          if (_.isEmpty(checkBrand)) { VehicleBrand.create({ brand: newVehicleIdenfiy.brand, model: newVehicleIdenfiy.model }) }
        }
        const defenseResult = defenseData.filter((n) => n.licence === newVehicleIdenfiy.licence) // 从布控车两种查处是否包含该车牌
        if (defenseResult.length) {
          newVehicleIdenfiy['defenseType'] = defenseResult[0].type // 布控类型
        }
        const resultVechidcle = (await VehicleIdenfiy.create(newVehicleIdenfiy)).toObject()
        resultVechidcle['colorName'] = dicColor[resultVechidcle.color]
        resultVechidcle['vehicleListName'] = dicListType[resultVechidcle.vehicleList]
        resultVechidcle['vehicleTypeName'] = dicVehicle[resultVechidcle.vehicleType]
        vehiclesocket.setRealTimeData(resultVechidcle) // socket 实时过车数据
        // 若存在布控车辆并且在监控摄像头范围内 存入布控记录表
        if (defenseResult.length && (defenseResult[0].isDefenseAll || defenseResult[0].videoChannels.find(n => n === newVehicleIdenfiy.channelid * 1))) {
          await Defenserecord.create({
            vehicleIdentify: resultVechidcle._id,
            defenseType: defenseResult[0].type,
            channelid: requestObj.detail.VideoChannel
          })
          // -----监控到布防车辆处理逻辑----
          vehiclesocket.setDefense(resultVechidcle) // socket布控车辆
          const resourceData = await Resource.findOne({ channelid: requestObj.detail.VideoChannel }, 'eid').populate({ path: 'eid', select: 'ip cport' }).exec()
          request.post({
            url: require('../../../../config').backend.serviceUrl + '/api/alarm/smart',
            json: {
              eventType: 1,
              devIp: resourceData.eid.ip,
              devPort: resourceData.eid.cport,
              time: Math.ceil(vehicleIdenfiy[i].Timestamp * 1 / 1000),
              channel: resourceData.chan
            }
          }, (errors, response, body) => {
            if (errors) {
              console.log(errors)
            }
          })
        }
      }
    }
    // -------------------------------自行车或者摩托车信息处理---------------------------
    if (bikesIdenfiy && bikesIdenfiy.length > 0) {
      bikesIdenfiy.forEach(b => {
        const bikesObj = {}
        bikesObj.type = b.type
        bikesObj.channelid = requestObj.detail.VideoChannel
        bikesObj.image = requestObj.imageDatas[b.GUID]
        if (b.Persons && b.Persons > 0) {
          bikesObj.persons = getPersonsInfo(b.Persons)
        }
        vehiclesocket.setBikesRealTimeData(bikesObj)
      })
    }
    // ----------------------------------行人信息处理----------------------------------
    if (pedestrainsIdenfiy && pedestrainsIdenfiy.length > 0) {
      vehiclesocket.setPedestrainsRealTimeData(getPersonsInfo(pedestrainsIdenfiy, requestObj.imageDatas, requestObj.detail.VideoChannel))
    }
    ctx.body = {
      errorCode: '0',
      message: 'success'
    }
  } catch (err) {
    ctx.body = {
      errorCode: '1',
      message: err.message
    }
  }
}

/**
 * 处理人物公共方法（自行车、摩托车 和行人）
 * @param {*} personsDatas 人物数据
 * @param {*} imageDatas 图片数据
 * @param {*} channelid 频道号
 */
const getPersonsInfo = (personsDatas, imageDatas, channelid) => {
  const persons = []
  personsDatas.forEach(bp => {
    const rec = bp.Recognize
    const tempObj = {}
    if (bp.GUID !== 'unset_guid' && imageDatas) { tempObj.image = imageDatas[bp.GUID] }
    if (channelid) { tempObj.channelid = channelid }
    // 年龄
    if (rec.Age && rec.Age.TopList.length > 0) { tempObj.age = rec.Age.TopList[0].name }
    // 背包
    if (rec.Bag && rec.Bag.TopList.length > 0) { tempObj.bag = rec.Bag.TopList[0].name }
    // 上身颜色
    if (rec.UpperColor && rec.UpperColor.TopList.length > 0) { tempObj.upperColor = rec.UpperColor.TopList[0].name }
    // 上身类型
    if (rec.UpperType && rec.UpperType.TopList.length > 0) { tempObj.upperType = rec.UpperType.TopList[0].name }
    // 下身颜色
    if (rec.BottomColor && rec.BottomColor.TopList.length > 0) { tempObj.bottomColor = rec.BottomColor.TopList[0].name }
    // 下身类型
    if (rec.BottomType && rec.BottomType.TopList.length > 0) { tempObj.bottomType = rec.BottomType.TopList[0].name }
    // 发型
    if (rec.Hair && rec.Hair.TopList.length > 0) { tempObj.hair = rec.Hair.TopList[0].name }
    // 帽子
    if (rec.Hat && rec.Hat.TopList.length > 0) { tempObj.hat = rec.Hat.TopList[0].name }
    // 双肩包
    if (rec.Knapsack && rec.Knapsack.TopList.length > 0) { tempObj.knapsack = rec.Knapsack.TopList[0].name }
    // 方向
    if (rec.Orientation && rec.Orientation.TopList.length > 0) { tempObj.orientation = rec.Orientation.TopList[0].name }
    // 性别
    if (rec.Sex && rec.Sex.TopList.length > 0) { tempObj.sex = rec.Sex.TopList[0].name }
    // 打伞
    if (rec.Sex && rec.Umbrella.TopList.length > 0) { tempObj.umbrella = rec.Umbrella.TopList[0].name }
    // 行人分类为1
    tempObj.type = 1

    persons.push(tempObj)
  })
  return persons
}

/**
 * 获取车辆识别信息
 */
exports.index = async (ctx, next) => {
  const search = ctx.query.search
  const searchObj = {}
  if (search.id) {
    searchObj._id = search.id
  } else {
    searchObj.createDateTime = { $gte: search.startTime, $lte: search.endTime }
    const channels = ctx.request.header['x-bsc-channels']
    if (channels) { searchObj['channelid'] = { $in: channels.split(',') } }
    if (search.licence) { searchObj['licence'] = search.licence }
  }
  try {
    const vehicletypes = await Dict.find({ type: 'vehicle' }).exec()
    const vehicleColors = await Dict.find({ type: 'vehicleColor' }).exec()
    const VTDict = {}
    const VCDict = {}
    _(vehicletypes).forEach(n => {
      VTDict[n.code] = n.name
    })
    _(vehicleColors).forEach(n => {
      VCDict[n.code] = n.name
    })
    const results = await paging.listQuery(VehicleIdenfiy, searchObj, '', { _id: -1 }, ctx.query.page, '', ctx)
    const tempArr = []
    _(results.results).forEach(n => {
      const tempObj = n.toObject()
      tempObj['typeName'] = VTDict[n.vehicleType]
      tempObj['colorName'] = VCDict[n.color]
      tempArr.push(tempObj)
    })
    // 所有资源的视频通道集合
    // const channelidArr = []
    // _(results).forEach(n => {
    //   channelidArr.push(n.channelid)
    // })

    // // 根据视频通道获取资源信息
    // const resources = await Resource.find({channelid: {$in: channelidArr}}).exec()

    // const resourceIdArr = []
    // _(resources).forEach(n => {
    //   resourceIdArr.push(n._id)
    // })
    // // 根据资源获取车道信息
    // const lanes = await Lane.find({resource: {$in: resourceIdArr}}).populate('pid').exec()
    // console.log(lanes)
    // const crossingArr = []
    // _(lanes).forEach(n => {
    //   crossingArr.push(n.pid)
    // })
    // // 根据车道获取路口信息
    // const crossings = await Crossing.find({id: {$in: crossingArr}}).exec()

    ctx.body = tempArr
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取过车详情(轨迹分析)
 */
exports.info = async (ctx, next) => {
  const nowDate = new Date().setHours(0, 0, 0, 0) / 1000 // 当天凌晨时间戳
  const licence = ctx.query.licence
  const startTime = ctx.query.startTime || nowDate
  const endTime = ctx.query.endTime || nowDate
  const reqHeaders = ctx.request.header['x-bsc-res']
  const ress = reqHeaders ? reqHeaders.split(',') : [] // 查看范围（资源集合）
  const isChanAll = ctx.query.isChanAll || true
  const channelid = ctx.query.channelid // 频道id,根据频道id查询最后一辆车信息（地图报警使用）
  const id = ctx.query.id
  try {
    // 创建 颜色和车辆类型字典
    const dictDatas = await Dict.find({ type: { $in: ['vehicleColor', 'vehicle', 'defenseType', 'vehicleListType'] } }).exec()
    const colorDict = {} // 车辆颜色字典
    const vehicleTypeDict = {} // 车辆类型字典
    const defenseTypeDict = {} // 布防类型字典
    const ListTypeDict = {} // 黑白名单字典
    _(dictDatas.filter(x => x.type === 'vehicleColor')).forEach(n => {
      colorDict[n.code] = n.name
    })
    _(dictDatas.filter(x => x.type === 'vehicle')).forEach(n => {
      vehicleTypeDict[n.code] = n.name
    })
    _(dictDatas.filter(x => x.type === 'defenseType')).forEach(n => {
      defenseTypeDict[n.code] = n.name
    })
    _(dictDatas.filter(x => x.type === 'vehicleListType')).forEach(n => {
      ListTypeDict[n.code] = n.name
    })

    // 组织查询参数
    let curData = {} // 当前位置数据用于高亮显示
    const searchObj = { licence: licence, createDateTime: { $gte: startTime * 1, $lte: endTime * 1 } }
    if (id) { // 若id 存在 则查询当前数据（用于显示当前点位信息）  id 和车牌必须必选一个参数
      curData = await VehicleIdenfiy.findById(id).exec()
      searchObj.licence = curData.licence
    } else if (channelid) { // 根据频道查询最后一条数据
      const tempObj = await VehicleIdenfiy.findOne({ channelid: channelid }).sort({ _id: -1 }).exec()
      searchObj.licence = tempObj.licence
    }
    // 查询范围添加参数
    let resDatas = []
    if (isChanAll) {
      resDatas = await Resource.find({}, 'channelid').exec()
    } else if (ress.length > 0) {
      resDatas = await Resource.find({ _id: { $in: ress } }, 'channelid').exec()
    } else {
      return ctx.throw(500, { code: 2201, message: '查询布控范围' })
    }
    const searchChannelids = [] // 查询条件频道集合
    _(resDatas).forEach(n => {
      if (n.channelid) { searchChannelids.push(n.channelid) }
    })
    searchObj.channelid = { $in: searchChannelids }
    let datas = [] // 查询原始数据
    if (['未识别', '无车牌'].indexOf(licence) > -1) { // 若车牌为这两种之一的话只放回当前数据
      datas = await VehicleIdenfiy.find({ _id: id }).sort({ createTime: 1 }).exec()
    } else {
      datas = await VehicleIdenfiy.find(searchObj).sort({ createTime: 1 }).exec()
    }
    // 查询

    const channelids = [] // 总的频道结合
    _(datas).forEach(n => { // 获取 videoChannel 集合
      channelids.push(n.channelid)
    })
    // ------------------------构建频道与路口字典
    // 存储所有资源ID集合
    const resourceDatas = await Resource.find({ channelid: { $in: channelids } }, '_id name channelid').exec() // 查询说有车辆的资源
    const rids = [] // 资源ID集合
    const rdict = {} // 资源和频道字典
    const channelResID = {} // 构建频道-资源Id字典
    _(resourceDatas).forEach(n => {
      rids.push(n._id)
      rdict[n._id] = n.channelid
      channelResID[n.channelid] = n._id
    })
    const lanedatas = await Lane.find({ resource: { $in: rids } }).populate([
      { path: 'pid', select: 'name' },
      { path: 'resource' }]).exec()

    const channelCross = {}
    const newRids = [] // 过滤后配有服务器的资源ID集合
    const sourceDict = {} // 构建频道点位字典
    const channelDirect = {} // 构建频道-车型方向字典
    const channelResName = {} // 构建频道-资源名称字典

    _(lanedatas.filter(x => x.resource.hasserver)).forEach(n => {
      newRids.push(n.resource._id)
      channelCross[rdict[n.resource._id]] = n.pid.name
      sourceDict[n.resource.channelid] = n.resource.point
      channelDirect[n.resource.channelid] = n.direction
      channelResName[n.resource.channelid] = n.resource.name
    })

    // 添加布控信息
    const defenseObj = await VehicleDefense.findOne({ licence: licence }).exec()

    if (defenseObj && defenseObj.color) { defenseObj['colorName'] = colorDict[defenseObj.color] }
    if (defenseObj && defenseObj.vehicleType) { defenseObj['typeName'] = vehicleTypeDict[defenseObj.vehicleType] }

    let tempObj = {}
    _(datas).forEach((n, key) => {
      if (key === 0) {
        if (!_.isEmpty(curData)) {
          tempObj = curData.toObject()
          tempObj['point'] = sourceDict[curData.channelid] // 当前点位信息
        } else {
          tempObj = n.toObject()
          // if (curData) tempObj['point'] = sourceDict[curData.channelid] // 当前点位信息
        }
        tempObj['colorName'] = colorDict[tempObj.color]
        tempObj['typeName'] = vehicleTypeDict[tempObj.vehicleType]
        tempObj['direction'] = channelDirect[tempObj.channelid]
        tempObj['resourceName'] = channelResName[tempObj.channelid]
        tempObj['defenseType'] = defenseTypeDict[tempObj.defenseType] || ''
        tempObj['vehicleList'] = ListTypeDict[tempObj.vehicleList]
        tempObj['resourceId'] = channelResID[tempObj.channelid]
        tempObj['defenseInfo'] = defenseObj
        tempObj['crossName'] = channelCross[tempObj.channelid]
        tempObj['list'] = []
      }

      tempObj.list.push({
        channelid: n.channelid,
        crossName: channelCross[n.channelid],
        point: sourceDict[n.channelid],
        image: n.image,
        timeStamp: n.timeStamp,
        date: n.createDateTime
      })
    })
    // tempObj.list = _.map(_.groupBy(tempObj.list, 'date'))
    ctx.body = tempObj
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 实时车辆转车流量管理
 */
exports.copy2veh = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-实时过车复制到车辆管理'))
  try {
    const ids = ctx.request.header['x-bsc-ids'].split(',') || []
    const findObjs = await VehicleIdenfiy.find({ _id: { $in: ids } }).exec()
    const tempArr = []
    _(findObjs).forEach(n => {
      const tempObj = n.toObject()
      tempObj.list = ctx.request.body.type
      tempObj.type = n.vehicleType
      delete tempObj._id
      tempArr.push(tempObj)
    })
    const result = await Vehicle.create(tempArr)
    ctx.body = result
    ctx.status = 201
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}
