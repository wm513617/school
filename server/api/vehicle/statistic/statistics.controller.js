'use strict'

var VehicleIdentify = require('mongoose').model('VehicleIdentify')
var VehicleDefense = require('mongoose').model('VehicleDefense')
var Statistics = require('mongoose').model('Statistics')
var Defenserecord = require('mongoose').model('Defenserecord')
var Resource = require('mongoose').model('Resource')
var Lane = require('mongoose').model('Lane')
var Crossing = require('mongoose').model('Crossing')
var StatisticsCross = require('mongoose').model('StatisticsCross')
var Dict = require('mongoose').model('Dict')
var paging = require('../../paging')
var _ = require('lodash')

exports.index = async (ctx, next) => {
  // exports.index = async () => {
  // const startTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime() // 凌晨时间戳

  const now = new Date()
  console.log('车辆统计时间：' + now)
  const nowTime = Math.round(now.getTime() / 100000) * 100 // 当前时间戳(消除各台机器的统计时间差)
  const nowTimeHour = now.getHours() // 当前小时
  const lastHourTime = nowTime - 1 * 60 * 60 // 上一小时时间戳
  let startTime = now.setHours(0, 0, 0, 0) / 1000 // 凌晨时间戳
  // const temp = new Statistics()
  if (nowTimeHour === 0) {
    // 若是凌晨 则减去 一天的时间戳
    startTime = startTime - 24 * 60 * 60
  }
  try {
    const result = await VehicleIdentify.find({ createTime: { $gte: startTime, $lte: nowTime } }).exec() // 查询凌晨到当前识别信息
    const lastHourResult = result.filter(x => x.createTime > lastHourTime) // 上一个小时识别信息

    const dicts = await Dict.find({ type: { $in: ['vehicle', 'defenseType', 'vehicleListType'] } }).exec() // 获取字典信息
    const defenseTypes = dicts.filter(x => x.type === 'defenseType') // 获取车辆布控类型字典数据
    const dictsVehicle = dicts.filter(x => x.type === 'vehicle') // 获取车辆字典数据
    const dictsVehicleList = dicts.filter(x => x.type === 'vehicleListType') // 获取车辆黑白名单字典数据

    const dictsVehicleObj = {} // 车辆类型对象字典
    _(dictsVehicle).forEach(n => {
      dictsVehicleObj[n.code] = n.name
    })
    const dictsVehicleListObj = {} // 车辆黑白名单对象字典
    _(dictsVehicleList).forEach(n => {
      dictsVehicleListObj[n.code] = n.name
    })

    // 布防统计
    const desfenses = lastHourResult.filter(x => x.defenseType) // 当天数据过滤出含有defenseType字段的数据

    const desfensesKeyValue = _.countBy(desfenses, 'defenseType')
    const defenseTypeArr = []
    _(defenseTypes).forEach(n => {
      defenseTypeArr.push({ name: n.name, code: n.code, count: desfensesKeyValue[n.code] || 0 })
    })

    // -------------------------------根据车辆类型统计(新)------------------------------------
    const vehicleTypeTempObj = {}
    _(lastHourResult).forEach(n => {
      if (vehicleTypeTempObj[n.vehicleType]) {
        vehicleTypeTempObj[n.vehicleType]['count'] += 1
      } else {
        vehicleTypeTempObj[n.vehicleType] = {
          name: dictsVehicleObj[n.vehicleType] || '未识别',
          code: n.vehicleType,
          count: 1
        }
      }
    })
    const vehicleType = _.map(vehicleTypeTempObj)
    // -------------------------------根据车辆视频通道分析------------------------------------

    const resourceDatas = await Resource.find({ channelid: { $gte: 0 } }, '_id name channelid').exec() // 查询说有车辆的资源
    const rids = [] // 资源ID集合
    const RCict = {} // 资源和频道字典
    const CRict = {} // 频道和资源字典

    _(resourceDatas).forEach(n => {
      rids.push(n._id)
      RCict[n._id] = n.channelid
      CRict[n.channelid] = n.name
    })
    // 存储所有资源ID集合
    const lanedatas = await Lane.find({ resource: { $in: rids } })
      .populate({ path: 'pid', select: 'name _id' })
      .exec()

    const channelCross = {} // 频道和路口字典
    const channelCrossId = {} // 频道和路口Id字典

    _(lanedatas).forEach(n => {
      channelCross[RCict[n.resource]] = n.pid.name
      channelCrossId[RCict[n.resource]] = n.pid._id
    })
    // channelCross = {'8': '8号路口', '9': '9号路口'}
    const groupLastDatas = _.groupBy(lastHourResult, 'channelid')
    const channelType = []
    let crossingDatas = {}
    _.map(groupLastDatas, n => {
      const vehicleType = [] // 每个通道对应的车辆类型统计
      const vehicleGropdatas = _.groupBy(n, 'vehicleType')
      let lastImg = ''
      for (const gd in vehicleGropdatas) {
        const tempdata = vehicleGropdatas[gd]
        lastImg = _.findLast(tempdata).image
        vehicleType.push({
          name: dictsVehicleObj[tempdata[0].vehicleType],
          code: gd,
          count: tempdata.length
        })
      }
      crossingDatas = {}
      crossingDatas.channelid = n[0].channelid
      crossingDatas.count = n.length
      crossingDatas.lastImg = lastImg
      crossingDatas.name = channelCross[n[0].channelid] || '其他'
      crossingDatas.crossid = channelCrossId[n[0].channelid]
      crossingDatas.resourceName = CRict[n[0].channelid]
      crossingDatas.vehicleType = vehicleType
      channelType.push(crossingDatas)
    })
    // -------------------------------根据车辆品牌分析------------------------------------
    const brandTempObj = {}
    _(lastHourResult).forEach(n => {
      if (brandTempObj[n.brand]) {
        brandTempObj[n.brand]['count'] += 1
      } else {
        brandTempObj[n.brand] = {
          name: n.brand,
          count: 1
        }
      }
    })
    const brandType = _.map(brandTempObj)
    // -------------------------------入口车辆分类统计------------------------------------
    // const entryChennalId = (await Lane.findOne({passway: 1}).populate('resource').exec()).resource.channelid // 获取入口频道ID
    const entryChennalIds = [] // 入口频道集合
    const lanesDatas = await Lane.find({ passway: 1 })
      .populate('resource')
      .exec()
    let vcehicleListEntry = []
    if (lanesDatas.length > 0) {
      _(lanesDatas).forEach(n => {
        if (n.resource) {
          entryChennalIds.push(n.resource.channelid)
        }
      })
      const lastHourEntraResult = lastHourResult.filter(n => entryChennalIds.indexOf(n.channelid) > -1) // 获取入口车辆数据
      const entryTypeTempObj = {}

      _(lastHourEntraResult).forEach(n => {
        if (entryTypeTempObj[n.vehicleList]) {
          entryTypeTempObj[n.vehicleList]['count']++
        } else {
          entryTypeTempObj[n.vehicleList] = {
            name: dictsVehicleListObj[n.vehicleList],
            code: n.vehicleList,
            count: 1
          }
        }
      })
      vcehicleListEntry = _.map(entryTypeTempObj)
    }

    // ------------------------保存数据-----------------------------

    const temp = {
      time: nowTime,
      hour: nowTimeHour,
      date: nowTimeHour ? startTime : startTime + 24 * 60 * 60,
      count: lastHourResult.length,
      // type: tempTypeArr,
      // color: colorAll,
      vehicleType: vehicleType,
      channelType: channelType,
      brandType: brandType,
      vcehicleListEntry: vcehicleListEntry,
      defense: defenseTypeArr
    }
    await Statistics.create(temp)
    // 若是凌晨 则进行路口类统计新增
    if (nowTimeHour === 0) {
      const staticCrossTypeDatas = await getCrossingVehicleTypeOneDay([], startTime) // 获取前一天车辆分类统计的数据
      // const staticCrossTypeDatas = await getCrossingVehicleTypeOneDay([]) // 获取前一天车辆分类统计的数据
      await StatisticsCross.insertMany(staticCrossTypeDatas)
    }
  } catch (error) {}
}

/**
 * 进出口统计   -----------------------------------------------今日数据
 */
exports.getInOut = async (ctx, next) => {
  try {
    const date = ctx.query.date || new Date().setHours(0, 0, 0, 0) / 1000
    // const passwayData = await Resource.find({passway: {$in: [1, 2]}, intelligent: 3}, 'channelid passway').exec() // 获取车辆的出入口资源的通道号
    const inoutresdata = await Lane.find({ passway: { $in: [1, 2] } }, 'passway resource')
      .populate('resource')
      .exec()
    if (inoutresdata.length === 0) {
      // 若进出口未定义则直接返回0
      const nowHour = new Date().getHours()
      const result = []
      for (let i = 0; i < nowHour; i++) {
        result.push({ inNumber: 0, outNumber: 0, defenseNumber: 0, hour: i })
      }
      ctx.body = result
    } else {
      let results = await Statistics.find({ date: date }, 'time hour channelType defense').exec() // 凌晨到目前所有的统计数据(每小时统计一条数据)
      results = _.uniqBy(results, 'hour')
      const inResIds = [] // 入口资源id集合
      const outResIds = [] // 出口资源id集合

      _(inoutresdata).forEach(n => {
        if (n.passway === 1 && n.resource) {
          inResIds.push(n.resource.channelid)
        }
        if (n.passway === 2 && n.resource) {
          outResIds.push(n.resource.channelid)
        }
      })
      const resultArr = []
      let lastHour = 0
      _(results).forEach(n => {
        const tempObj = { inoutData: {}, hour: n.hour }
        const inDatas = n.channelType.filter(x => inResIds.indexOf(x.channelid) > -1)
        const outDatas = n.channelType.filter(x => outResIds.indexOf(x.channelid) > -1)
        // if (inDatas.length > 0) tempObj.inoutData.inNumber = inDatas[0].count
        // if (outDatas.length > 0) tempObj.inoutData.outNumber = outDatas[0].count
        tempObj.inoutData.inNumber = inDatas.length > 0 ? inDatas[0].count : 0
        tempObj.inoutData.outNumber = outDatas.length > 0 ? outDatas[0].count : 0
        let defenseCount = 0
        _(n.defense).forEach(x => {
          defenseCount += x.count || 0
        })
        tempObj.inoutData.defenseNumber = defenseCount
        tempObj.inoutData.hour = n.hour
        resultArr.push(tempObj)
        lastHour = n.hour > lastHour ? n.hour : lastHour
      })
      const result = [] // 填充没有字段的数据
      for (let i = 0; i < lastHour; i++) {
        result.push({
          inNumber: 0,
          outNumber: 0,
          defenseCount: 0,
          hour: i
        })
      }
      _(resultArr).forEach(n => {
        result[n.hour] = n.inoutData
      })
      ctx.body = result
    }
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 路口流量统计(前十条)  ----------------------------------------今日数据
 */
exports.getTodyCrossing = async (ctx, next) => {
  try {
    ctx.body = await getTodyDataTop(ctx, 'channelType', 10)
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 车辆品牌统计(前十条)  ----------------------------------------今日数据
 */
exports.getTodyBrand = async (ctx, next) => {
  try {
    ctx.body = await getTodyDataTop(ctx, 'brandType', 10)
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取路口流量统计   ------------------------------------------车流量统计
 */
exports.getFlow = async (ctx, next) => {
  // const startTime = ctx.query.startTime || new Date().setHours(0, 0, 0, 0) / 1000
  // const endTime = ctx.query.endTime || Math.ceil(new Date().getTime() / 1000)
  const currentDate = new Date().setHours(0, 0, 0, 0) / 1000
  const startTime = ctx.query.startTime || currentDate - 7 * 24 * 60 * 60 // 七天前
  const endTime = ctx.query.endTime || currentDate
  const compareType = ctx.query.compareType || '1'
  const searchObj = { date: {} }
  if (compareType === '1') {
    searchObj.date = { $gte: startTime, $lte: endTime }
  } else {
    searchObj.date = { $in: [startTime, endTime] }
  }
  try {
    // 按照路口分类
    // const statisticDatas = await Statistics.find({time: {$gt: startTime, $lt: endTime}}, 'date time count channelType').exec()
    // const chnennlIds = await getChnennlIdsByCrossingIds()
    // const resultGropData = getGropData(statisticDatas, 'channelType', 'count', 'time', false, {key: 'channelid', value: chnennlIds})
    // ctx.body = resultGropData
    // 改为统计所有
    const statisticDatas = await Statistics.find(searchObj, 'date count hour').exec()
    const groupDatas = _.groupBy(statisticDatas, 'date')
    const resultArr = []
    _.forIn(groupDatas, (value, key) => {
      const tempObj = {}
      let lastHour = 0 // 处理返回数组长度
      _(value).forEach(n => {
        if (!tempObj[n.hour]) {
          tempObj[n.hour] = n.count
          lastHour = n.hour > lastHour ? n.hour : lastHour
        }
      })
      tempObj['length'] = lastHour + 1
      const countArr = Array.from(tempObj, x => x || 0)
      resultArr.push({ date: key, countData: countArr })
    })
    ctx.body = resultArr
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取车辆类型数据   ------------------------------------------车流量统计
 */
exports.getVehicleType = async (ctx, next) => {
  const currentDate = new Date().setHours(0, 0, 0, 0) / 1000
  const startTime = ctx.query.startTime || currentDate - 7 * 24 * 60 * 60 // 七天前
  const endTime = ctx.query.endTime || currentDate
  const compareType = ctx.query.compareType || '1'
  const searchObj = { date: {} }
  if (compareType === '1') {
    searchObj.date = { $gte: startTime, $lte: endTime }
  } else {
    searchObj.date = { $in: [startTime, endTime] }
  }
  try {
    const tempArr = await getSomedayData(searchObj, 'vehicleType', true)
    ctx.body = tempArr
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 路口流量统计   -----------------------------------------------路口统计
 */
exports.getCrossing = async (ctx, next) => {
  const maxCrossNum = 5 // 显示路口最大数量
  const headerData = ctx.request.header['x-bsc-ids']
  let crossids = []
  if (headerData) {
    crossids = headerData.split(',') || []
  }

  const now = new Date()
  const endTime = ctx.query.endTime || Math.round(now.getTime() / 1000)
  const startTime = ctx.query.startTime || now.setHours(0, 0, 0, 0) / 1000
  let searchObj = {}
  if (ctx.query.compareType === '0') {
    searchObj = { date: { $in: [startTime, endTime] } }
  } else {
    searchObj = { date: { $gte: startTime, $lte: endTime } }
  }
  try {
    if (_.isElement(crossids)) {
      // 若传入crossid 则查询 否则查询所有入口数据
      const resultCrossing = await Crossing.find({}, '_id').exec()
      _(resultCrossing).forEach(n => {
        crossids.push(n._id)
      })
    }
    const chnennlIds = await getChnennlIdsByCrossingIds(crossids)
    const statisticDatas = await Statistics.find(searchObj, 'date hour time channelType').exec()
    // const tempObj = {}
    // const resultArr = []
    // _(statisticDatas).forEach(n => {
    //   if (!tempObj[n.time]) {
    //     tempObj[n.time] = true
    //     resultArr.push(n)
    //   }
    // })
    const resultArr = uniqueData(statisticDatas, 'time')
    const groupDatas = getGropData(resultArr, 'channelType', 'count', 'name', true, {
      key: 'channelid',
      value: chnennlIds
    })

    const mapDatas = _.map(groupDatas)
    const resultData = []
    const sortByDatas = _.sortBy(mapDatas[mapDatas.length - 1], 'count').reverse() // 最后一条数据的进项排序
    const sortByChannelIds = []
    _(sortByDatas).forEach((n, num) => {
      // 查询当前最大的路口channelid集合
      if (num < maxCrossNum) {
        sortByChannelIds.push(n.channelid)
      }
    })
    _(mapDatas).forEach(n => {
      const tempMapObj = {}
      const tempMapArr = []
      _(n).forEach(x => {
        if (_.indexOf(sortByChannelIds, x.channelid) >= 0) {
          // 若id存在 上面存在的id 的话  与路口保持一致
          tempMapArr.push(x)
        }
      })
      if (n.length > 0) {
        // 若有数据才进行统计
        tempMapObj['date'] = n[0].time
        tempMapObj['countData'] = tempMapArr
        resultData.push(tempMapObj)
      }
    })
    ctx.body = resultData
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 根据路口查询车辆分类信息
 */
exports.getCrossVechileType = async (ctx, next) => {
  const headerData = ctx.request.header['x-bsc-ids']
  let crossids = []
  if (headerData) {
    crossids = headerData.split(',') || []
  }
  const now = new Date()
  const nowDateTime = now.setHours(0, 0, 0, 0) / 1000
  const endTime = ctx.query.endTime || Math.round(now.getTime() / 1000)
  const startTime = ctx.query.startTime || nowDateTime
  try {
    let searchObj
    if (ctx.query.compareType === '0') {
      searchObj = { date: { $in: [startTime, endTime] } }
    } else {
      searchObj = { date: { $gte: startTime, $lt: endTime } }
    }
    if (crossids.length > 0) {
      searchObj['crossId'] = { $in: crossids }
    }
    const findDatas = await StatisticsCross.find(searchObj).exec()
    let resultData = []
    if (endTime < nowDateTime) {
      resultData = findDatas
    } else {
      const todayDatas = await getCrossingVehicleTypeOneDay(crossids)
      resultData = [...todayDatas, ...findDatas]
    }
    ctx.body = resultData
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 流量统计（上面的图表）   ---------------------------------------警情统计
 */
exports.getDefense = async (ctx, next) => {
  const searchObj = await getDefenseSearch(ctx)
  try {
    const DSs = await Defenserecord.find(searchObj, 'channelid date').exec()
    const rids = []
    _(DSs).forEach(n => rids.push(n.channelid)) // 获取资源id集合
    const CCObj = await getCrossingNameByChennalIds(rids) // 频道路口名称字典
    const _DSs = [] // DSs 由于多次尝试保存不进去数据，这里建立副本来使用
    _(DSs).forEach(n => {
      n = n.toObject()
      if (CCObj[n.channelid]) {
        n['crossName'] = CCObj[n.channelid]
      } // 添加路口名称
      _DSs.push(n) // 保存到副本_DSs
    })
    const gropDatas = _.groupBy(_DSs, 'date') // 按照日期分类
    const resultArr = []
    for (const gd in gropDatas) {
      // 按照日期分类统计
      const crossDatas = _.groupBy(gropDatas[gd], 'crossName') // 按照路口统计
      const crossArr = []
      for (const cd in crossDatas) {
        crossArr.push({ name: cd, count: crossDatas[cd].length }) // 组织每日--的各个路口统计数据
      }
      resultArr.push({ date: gd, countAll: gropDatas[gd].length, datas: crossArr }) // 按照频道分组，组织数据
    }
    ctx.body = resultArr
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 布防列表（下面列表）   -----------------------------------------警情统计
 */
exports.getDefenselist = async (ctx, next) => {
  const searchObj = await getDefenseSearch(ctx)
  try {
    const result = await paging.listQuery(
      Defenserecord,
      searchObj,
      'defenseType createTime channelid',
      {},
      ctx.query.page,
      '',
      ctx
    )
    const dictDatas = await Dict.find({ type: 'defenseType' }).exec() // 查询布防字典
    const dictObj = {} // 存放布防数据字典
    _(dictDatas).forEach(n => {
      dictObj[n.code] = n.name
    })
    const cids = []
    const _results = []
    _(result.results).forEach(n => {
      const tempN = n.toObject()
      cids.push(n.channelid)
      // if (n.vehicleDefense) {
      //   console.log(n.vehicleDefense.type)
      //   tempN.defenseType = dictObj[n..type] // 修改布控类型code 改为name值
      //   delete tempN.vehicleDefense
      // }
      tempN.defenseType = dictObj[n.defenseType]
      _results.push(tempN)
    })
    const CCObj = await getCrossingNameByChennalIds(cids) // 视频路口名称字典
    _(_results).forEach(x => {
      x['crossName'] = CCObj[x.channelid] // 添加路口名称
    })
    ctx.status = 200
    ctx.body = _results
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取当前车流密度较大区域  ------------------------------------------首页
 */
exports.getCurMaxZone = async (ctx, next) => {
  const date = new Date().setHours(0, 0, 0, 0) / 1000
  try {
    const channelDatas = await Statistics.find({ date: date }, 'channelType hour')
      .populate('channelType')
      .exec()
    const dataArr = [] // 将所有channelType数据展开，放入同一个数据
    const resultArr = uniqueData(channelDatas)
    _(resultArr).forEach(n => {
      _(n.channelType).forEach(x => {
        const hourStr = n.hour === 0 ? '23:00 ~ 0:00' : n.hour - 1 + ':00 ~ ' + n.hour + ':00'
        dataArr.push({ hour: hourStr, count: x.count, name: x.name, image: x.lastImg, resourceName: x.resourceName })
      })
    })
    ctx.body = _.sortBy(dataArr, 'count')
      .reverse()
      .slice(0, 7) // 排序拿到前七条数据
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取今日所有车辆类型数据（前100） -----------------------------------首页
 */
exports.getTodyVehicleType = async (ctx, next) => {
  try {
    const result = await getTodyDataTop(ctx, 'vehicleType', 8)
    ctx.body = _.map(result)
  } catch (error) {}
}

/**
 * 获取今日所有车辆黑白名单的分类数据 -----------------------------------首页
 */
exports.getEntryVehicleList = async (ctx, next) => {
  try {
    const dictDatas = await Dict.find({ type: 'vehicleListType' }).exec()
    const dictObj = {}
    _(dictDatas).forEach(n => {
      dictObj[n.code] = n.name
    })
    const date = new Date().setHours(0, 0, 0, 0) / 1000
    const vcehicleListDatas = await Statistics.find({ date: date }, 'hour vcehicleListEntry').exec()
    const uinquerDatas = uniqueData(vcehicleListDatas) // 根据小时 去重
    let tempArr = []
    _(uinquerDatas).forEach(n => {
      tempArr = [...tempArr, ...n.vcehicleListEntry]
    })
    const resultArr = []
    const gropDatas = _.groupBy(tempArr, 'code')
    for (const gd in gropDatas) {
      let count = 0
      _(gropDatas[gd]).forEach(n => {
        count += n.count
      })
      resultArr.push({ name: dictObj[gd], countAll: count })
    }
    ctx.body = resultArr
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 其他数量统计方法（出入院、布控、发现布控）
 */
exports.getSomeCount = async (ctx, next) => {
  const date = new Date().setHours(0, 0, 0, 0) / 1000
  try {
    // const inOutDatas = await Resource.find({passway: {$in: [1, 2]}, intelligent: 3}, 'passway channelid').exec() // 获取出入口资源数据]
    const defenseCount = await VehicleDefense.countDocuments({ state: 1 }).exec()
    const discoveryDefenseData = await Defenserecord.find({ date: date }, 'vehicleDefense').exec()
    const tempObj = {}
    let countData = 0
    _(discoveryDefenseData).forEach(n => {
      // 去重求和
      if (!tempObj['vehicleDefense']) {
        tempObj['vehicleDefense'] = true
        countData++
      }
    })
    const resultObj = {}
    resultObj['defenseCount'] = defenseCount
    resultObj['discoveryDefenseCount'] = countData
    const inoutresdata = await Lane.find({ passway: { $in: [1, 2] } }, 'passway resource')
      .populate('resource')
      .exec()
    // inoutresdata = []
    if (inoutresdata.length === 0) {
      // 若未指定进出口车道则直接返回0
      resultObj['inCount'] = 0
      resultObj['outCount'] = 0
      ctx.body = resultObj
    } else {
      const inoutChannelIds = [] // 存储所有 进出口的频道ID
      const inOutDict = {}
      _(inoutresdata).forEach(n => {
        if (n.resource) {
          inoutChannelIds.push(n.resource.channelid)
          inOutDict[n.resource.channelid] = n.passway
        }
      })
      const channelTypeDatas = await Statistics.find({ date: date }, 'channelType hour').exec()
      const resultArr = uniqueData(channelTypeDatas)

      let tempArr = [] // 转换为一维数组
      _(resultArr).forEach(n => {
        tempArr = [...tempArr, ...n.channelType]
      })

      if (_.isEmpty(tempArr)) {
        // 若为空 则进行复制
        resultObj['inCount'] = 0
        resultObj['outCount'] = 0
      }
      _(tempArr).forEach(n => {
        if (inoutChannelIds.indexOf(n.channelid) > -1) {
          if (inOutDict[n.channelid] === 1) {
            // 判断是否入口
            if (resultObj['inCount']) {
              resultObj['inCount'] += n.count
            } else {
              resultObj['inCount'] = n.count
            }
          } else if (inOutDict[n.channelid] === 2) {
            // 判断是否出口
            if (resultObj['outCount']) {
              resultObj['outCount'] += n.count
            } else {
              resultObj['outCount'] = n.count
            }
          }
        }
      })
      ctx.body = resultObj
    }
  } catch (error) {
    console.log(error)
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取车辆品牌的统计
 */
exports.getBrand = async (ctx, next) => {
  const startTime = ctx.query.startTime || new Date().setHours(0, 0, 0, 0) / 1000 // 默认凌晨时间戳
  const endTime = ctx.query.endTime || Math.round(new Date().getTime() / 1000) // 默认当前时间戳
  try {
    const result = await Statistics.find({ time: { $gt: startTime, $lt: endTime } }, 'brandType hour time date').exec()
    const uniqueDatas = uniqueData(result, 'hour')
    const allDatas = _.values(getGropData(uniqueDatas, 'brandType', 'count'))[0] || []
    const num = 8 // 统计前多少条数据
    // if (allDatas.length > num) {
    //   ctx.body = _.sortBy(allDatas, 'count').reverse().splice(0, num)
    // } else {
    //   ctx.body = allDatas
    // }

    const reverseData = _.sortBy(allDatas, 'count').reverse()
    let count = 0
    const data = []
    reverseData.forEach((n, key) => {
      if (key >= num) {
        count += n.count
      } else {
        data.push(n)
      }
    })
    if (num < reverseData.length) {
      data.push({ name: '其他', count: count })
    }
    ctx.body = data
  } catch (error) {
    return ctx.throw(500, { code: -1, message: error.message })
  }
}

// exports.getDefense = async (ctx, next) => {
//   ctx.query.crossid = '595b75804709ae2da00c061b'
//   // const crossid = ctx.query.crossid
//   const startTime = ctx.query.startTime || new Date().setHours(0, 0, 0, 0) / 1000
//   const endTime = ctx.query.endTime || Math.ceil(new Date().getTime() / 1000)
//   const result = await Defenserecord.find({createTime: {$gt: startTime, $lt: endTime}}).exec()
//   const tempObj = {}
//   const gropDatas = _.groupBy(result, 'date')
//   for (var g in gropDatas) {
//     tempObj[g] = {}
//     _(gropDatas[g]).forEach(n => {
//     })
//   }
//   ctx.body = _.groupBy(result, 'date')
// }

/**
 * 今日数据 车辆流量和品牌统计  前十条公用方法
 * @param {*} ctx
 * @param {*} type  // 统计分类
 * @param {*} top  // top值 (默认全部)
 */
const getTodyDataTop = async (ctx, type, top) => {
  const date = ctx.query.date || new Date().setHours(0, 0, 0, 0) / 1000
  const results = await Statistics.find({ date: date }, 'date time hour count ' + type).exec() // 获取当天所有的统计数据(每小时统计一条数据)
  const result = getStatisticTypeDatas(results, type)
  let count = 0
  const data = []
  result.forEach((n, key) => {
    if (key >= top) {
      count += n.countAll
    } else {
      data.push(n)
    }
  })
  if (top < result.length) {
    data.push({ name: '其他', countAll: count })
  }
  return data
}

/**
 *  获取多日的数据
 * @param {*} ctx
 * @param {*} type // 统计分类
 * @param {*} isCount // 是否每日统计总和
 */
const getSomedayData = async (searchObj, type, isCount) => {
  const statisticDatas = await Statistics.find(searchObj, 'date time hour count ' + type).exec()
  const gropData = _.groupBy(statisticDatas, 'date') // 根据日期分组
  const tempArr = []
  for (const gd in gropData) {
    // 遍历对象单个调用 type分类统计
    const tempObj = {}
    const st = getStatisticTypeDatas(gropData[gd], type)
    if (isCount) {
      let count = 0
      _(st).forEach(n => {
        count += n.countAll
      })
      tempObj['countAll'] = count
      tempObj['date'] = gd
    }
    tempObj['countData'] = st
    if (st.length > 0) {
      tempArr.push(tempObj)
    }
  }
  return tempArr
}

/**
 * 将普通的static数据，根据type分类统计（单日）
 * @param {*} data // 单日的statistics数据
 * @param {*} type // 分类值
 */
const getStatisticTypeDatas = (data, type) => {
  data = _.uniqBy(data, 'hour')
  let tempArr = [] // 遍历为一维数组
  _(data).forEach(n => {
    tempArr = [...tempArr, ...n[type]]
  })
  const resultArr = [] // 存储数据结果
  const gropDatas = _.groupBy(tempArr, 'name')
  for (const gd in gropDatas) {
    let count = 0
    _(gropDatas[gd]).forEach(x => {
      count += x.count
    })
    resultArr.push({ name: gd, countAll: count })
  }
  return _.sortBy(resultArr, 'countAll').reverse()
}

/**
 * 分类统计公共方法
 * @param {*} datas // 需要统计的数据
 * @param {*} property // 分类属性
 * @param {*} countStr // 统计数量字段名称
 * @param {*} orderBy // 根据某个字段进行分类,默认是：name
 * @param {*} isSum // 是否进行数据累加,默认是：true
 * @param {*} search // 检索字段 例如：{key: 'channelid', value: [8,9]} ,默认不加检索项
 */
const getGropData = (datas, property, countStr, orderBy = 'name', isSum = true, search = {}) => {
  const resultObj = {}
  const gropData = _.groupBy(datas, 'date')
  for (var y in gropData) {
    const tempObj = {}
    _(gropData[y]).forEach(x => {
      if (!_.isEmpty(x[property])) {
        _(x[property]).forEach(n => {
          let flag = true // 用来检测检索项
          if (!_.isEmpty(search) && n[search.key] && search.value.indexOf(n[search.key]) === -1) {
            flag = false
          }
          if (tempObj[n[orderBy]] && flag && isSum) {
            // 判断对象是否存在，若不存在初始化数据，若存在则累加
            tempObj[n[orderBy]][countStr] += n[countStr]
          } else if (flag) {
            // 初始化数据为当前不存在数据
            n = n.toObject()
            n['time'] = x.time
            tempObj[n[orderBy]] = n
          }
        })
      }
    })
    resultObj[y] = _.map(tempObj) // 将对象转为数组
  }
  return resultObj
}

/**
 * 根据路口id集合查询 视频频道集合
 * @param {*} crossids  // 路口Id集合
 */
const getChnennlIdsByCrossingIds = async (crossids = []) => {
  const searchObj = {}
  if (crossids.length > 0) {
    searchObj.pid = { $in: crossids }
  }
  const laneDatas = await Lane.find(searchObj)
    .populate({ path: 'resource', select: 'channelid' })
    .exec()
  const chnennlIds = []
  _(laneDatas).forEach(n => {
    if (n.resource && n.resource.channelid) {
      chnennlIds.push(n.resource.channelid)
    }
  })
  return chnennlIds
}

/**
 * 根据频道id集合，获取对应的路口名称的字典
 * @param {arry} chIds // 频道集合
 */
const getCrossingNameByChennalIds = async chIds => {
  const rids = await Resource.find({ channelid: { $in: chIds } }, '_id channelid').exec()
  const RCObje = {} // 资源频道 字典
  const ridsArr = []
  _(rids).forEach(n => {
    ridsArr.push(n._id)
    RCObje[n._id] = n.channelid
  })
  const laneDatas = await Lane.find({ resource: { $in: ridsArr } }, 'pid resource')
    .populate({ path: 'pid', select: 'name' })
    .exec()
  const CCObj = {} // 频道路口名称 字典
  _(laneDatas).forEach(n => {
    if (n.pid) {
      CCObj[RCObje[n.resource]] = n.pid.name
    }
  })
  return CCObj
}

/**
 * 进出口数据获取公共方法
 * @param {*} results // 需要分析的数据(今日或者比较日数据  )
 * @param {*} passwayData  // 通道数据
 */
// const inoutDealFun = (results, passwayData) => {
//   const resultArr = []
//   _(results).forEach(n => { // 按小时数据遍历
//     n = n.toObject()
//     let inNumber = 0
//     let outNumber = 0
//     _(n.type).forEach(x => { // 每种车辆遍历（5个）
//       if (x.channel) {
//         _(passwayData).forEach(z => { // 出入口便利（2个）
//           if (z.passway === 1) {
//             inNumber += x.channel[[z.channelid]] || 0
//           } else {
//             outNumber += x.channel[[z.channelid]] || 0
//           }
//         })
//       }
//     })
//     resultArr.push({inoutData: {inNumber: inNumber, outNumber: outNumber}, time: n.time})
//   })
//   return resultArr
// }

/**
 * 根据路口查询一天车辆各分类统计数据
 * @param {array} crossids // 路口数组
 * @param {number} date // 查询的时间戳默认当天凌晨
 */
const getCrossingVehicleTypeOneDay = async (crossids, date) => {
  const carDict = { '4': 'car', '5': 'trike', '6': 'bus', '7': 'minibus', '8': 'truck' } // 车辆类型对应字典
  date = date || new Date().setHours(0, 0, 0, 0) / 1000
  if (crossids.length > 0) {
    // 若传入crossid 则查询 否则查询所有入口数据
    const resultCrossing = await Crossing.find({}, '_id').exec()
    _(resultCrossing).forEach(n => {
      crossids.push(n._id)
    })
  }
  const chnennlIds = await getChnennlIdsByCrossingIds(crossids)
  const statisticDatas = await Statistics.find({ date: date }, 'date hour time channelType').exec()
  // console.log(statisticDatas)
  // const tempObj = {}
  // const resultArr = []
  // _(statisticDatas).forEach(n => {
  //   if (!tempObj[n.time]) {
  //     tempObj[n.time] = true
  //     resultArr.push(n)
  //   }
  // })
  const resultArr = uniqueData(statisticDatas, 'time')
  const tempTypeObj = {}

  _(resultArr).forEach(n => {
    _(n.channelType).forEach(x => {
      if (chnennlIds.indexOf(x.channelid) > -1) {
        _(x.vehicleType).forEach(y => {
          if (!tempTypeObj[x.name]) {
            tempTypeObj[x.name] = {}
            tempTypeObj[x.name]['crossName'] = x.name
            tempTypeObj[x.name]['countAll'] = 0
            tempTypeObj[x.name]['date'] = date
            tempTypeObj[x.name]['crossId'] = x.crossid
          }
          tempTypeObj[x.name]['countAll'] += y.count
          if (tempTypeObj[x.name][carDict[y.code]]) {
            tempTypeObj[x.name][carDict[y.code]] += y.count
          } else {
            tempTypeObj[x.name][carDict[y.code]] = y.count
          }
        })
      }
    })
  })
  return _.map(tempTypeObj)
}

/**
 * 获取警情处理搜索项
 * @param {*} ctx
 */

const getDefenseSearch = async ctx => {
  const startTime = ctx.query.startTime || new Date().setHours(0, 0, 0, 0) / 1000
  const endTime = ctx.query.endTime || Math.round(new Date().getTime() / 1000)
  const searchObj = { date: { $gte: startTime, $lte: endTime } }
  const defenseType = ctx.query.defenseType
  const compareType = ctx.query.compareType
  const crossIds = ctx.request.header['x-bsc-ids'] ? ctx.request.header['x-bsc-ids'].split(',') : []
  if (defenseType !== 'all') {
    searchObj['defenseType'] = defenseType
  }
  if (compareType === '1') {
    searchObj['date'] = { $gte: startTime, $lte: endTime }
  } else {
    searchObj['date'] = { $in: [startTime, endTime] }
  }
  const laneSearchObj = {}
  if (crossIds.length > 0) {
    laneSearchObj.pid = { $in: crossIds }
  }
  const laneDatas = await Lane.find(laneSearchObj, 'resource')
    .populate({ path: 'resource', select: 'channelid' })
    .exec()
  const tempChennalIds = []
  _(laneDatas).forEach(n => {
    if (n.resource && n.resource.channelid) {
      tempChennalIds.push(n.resource.channelid)
    }
  })
  searchObj['channelid'] = { $in: tempChennalIds }
  return searchObj
}

/**
 * 多次统计去重
 * @param {array} data // 统计数据
 * @param {string} type // 去重类型,默认hour
 */
const uniqueData = (data, type = 'hour') => {
  const resultArr = []
  const tempObj = {}
  _(data).forEach(n => {
    // 多个统计 去重
    if (!tempObj[n[type]]) {
      tempObj[n[type]] = true
      resultArr.push(n)
    }
  })
  return resultArr
}
