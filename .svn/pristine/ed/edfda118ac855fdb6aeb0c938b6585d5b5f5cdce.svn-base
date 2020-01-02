/*
 * @Description: 视频结构化识别数据服务
 * @Author: wanglei
 * @Date: 2019-07-10 13:41:15
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-18 09:30:25
 */
'use strict'
const mongoose = require('mongoose')
const StructureServer = mongoose.model('structureserver')
const Resource = mongoose.model('Resource')
const { tranformPromiseAll } = require('../../../common/tools')
const moment = require('moment')
const rp = require('request-promise')
const axios = require('axios')
const FormData = require('form-data')
const { TypeCodeEnum } = require('../structure.enum')
const { dataDict } = require('./dataDict')

const CONSTANT = {
  RESOLVE: 'resolve',
  REJECT: 'reject'
}

// 统计当日 0 点到当前时间每种分类的结构化数量
const statisticCountIdentifyData = async () => {
  try {
    const servers = await StructureServer.find({}, 'ip port')
      .lean()
      .exec()
    let promiseList = []
    let response = {
      pedestrain: 0, // 行人
      bike: 0, // 自行车
      motorcycle: 0, // 摩托车
      car: 0, // 轿车
      tricycle: 0, // 三轮车
      bus: 0, // 大客车
      van: 0, // 面包车
      truck: 0, // 卡车
      total: 0 // 结构化目标总数
    }
    if (servers.length === 0) {
      return response
    }
    const startTime = moment()
      .startOf('day')
      .valueOf()
    const endTime = Date.now()
    for (let item of servers) {
      const options = {
        method: 'GET',
        uri: `http://${item.ip}:${item.port}/business/statistic.php`,
        body: { type: 'getMonitorStaticInfo', startTime: startTime, endTime: endTime },
        json: true
      }
      promiseList.push(rp(options))
    }
    promiseList = tranformPromiseAll(promiseList)
    const result = await Promise.all(promiseList)
    result.forEach(item => {
      if (item.status === CONSTANT.RESOLVE && item.data.errorCode === '0') {
        const countArr = item.data.data
        countArr.forEach(element => {
          switch (Number(element.code)) {
            case TypeCodeEnum.PEDESTRIAN:
              response.pedestrain += Number(element.count)
              break
            case TypeCodeEnum.BIKE:
              response.bike += Number(element.count)
              break
            case TypeCodeEnum.MOTORCYCLE:
              response.motorcycle += Number(element.count)
              break
            case TypeCodeEnum.CAR:
              response.car += Number(element.count)
              break
            case TypeCodeEnum.TRICYCLE:
              response.tricycle += Number(element.count)
              break
            case TypeCodeEnum.BUS:
              response.bus += Number(element.count)
              break
            case TypeCodeEnum.VAN:
              response.van += Number(element.count)
              break
            case TypeCodeEnum.TRUCK:
              response.truck += Number(element.count)
              break
            default:
              break
          }
        })
      }
    })
    response.total =
      response.pedestrain +
      response.bike +
      response.motorcycle +
      response.car +
      response.tricycle +
      response.bus +
      response.van +
      response.truck
    return response
  } catch (error) {
    throw Error(error)
  }
}

// sql 数据处理工厂
class InfluxSqlFactory {
  constructor () {}
  // 增加判断条件
  sqlWhere (resData) {
    console.log('查询条件：', resData)

    for (let i in resData) {
      if (_.isEmpty(resData[i])) {
        delete resData[i]
      }
    }

    let SQL = ''
    let keys = Object.keys(resData)
    SQL += ' where'
    for (let i = 0; i < keys.length; i++) {
      if (resData[keys[i]] === '') {
        continue
      }
      let values = this.manySelect(keys[i], resData[keys[i]])
      SQL += `${values}`
      SQL += ' and'
    }
    return SQL
  }

  // sqlWhere 方法调用 组装SQL语句
  manySelect (key, value) {
    // 车辆查询信息特殊处理
    if (key === 'style') {
      let valueArray = value.toString().split(';')
      if (valueArray.length === 1) {
        let str = ''
        let carType = this.parseCarCode(valueArray[0])
        if (!_.isEmpty(carType.carPattern)) {
          str += ` "carStyleName"='${carType.carPattern}'`
        } else {
          str += ` "carFamilyName"='${carType.carFamilyName}'`
          if (!_.isEmpty(carType.carBrand)) {
            str += ` and "carBrandName"='${carType.carBrand}'`
          }
        }
        return str
      } else {
        let str = ` (`
        for (let i = 0; i < valueArray.length; i++) {
          str += ' ('
          let carType = this.parseCarCode(valueArray[i])
          if (!_.isEmpty(carType.carPattern)) {
            str += ` "carStyleName"='${carType.carPattern}'`
          } else {
            str += ` "carFamilyName"='${carType.carFamilyName}'`
            if (!_.isEmpty(carType.carBrand)) {
              str += ` and "carBrandName"='${carType.carBrand}'`
            }
          }
          str += ' )'
          if (i + 1 !== valueArray.length) {
            str += ' or'
          }
        }
        return str + ' )'
      }
    }

    // 车牌信息需要 正则匹配
    if (key === 'plateLicence') {
      value = value.replace(/\*/g, '.*')
      value = value.replace(/\?/g, '.')
      return ` "${key}"=~/${value}/`
    }

    let valueArray = value.toString().split(',')
    if (valueArray.length === 1) {
      return ` "${key}"='${valueArray[0]}'`
    } else {
      let str = ` (`
      for (let i = 0; i < valueArray.length; i++) {
        str += ` "${key}"='${valueArray[i]}'`
        if (i + 1 !== valueArray.length) {
          str += ' or'
        }
      }
      return str + ' )'
    }
  }

  // 解析车辆code
  parseCarCode (carcode) {
    let valueClient = carcode.split(',')
    console.log(valueClient)
    let carData = {}
    for (let j = 0; j < valueClient.length; j++) {
      // 品牌信息
      if (j === 0) {
        carData.carFamilyName = dataDict.CarFamily[valueClient[j]].Name
      }
      // 车型信息
      else if (j === 1) {
        carData.carBrand = dataDict.CarFamily[valueClient[0]].CarBrand[valueClient[j]].Name
      }
      // 年款信息
      else if (j === 2) {
        carData.carPattern = dataDict.CarFamily[valueClient[0]].CarBrand[valueClient[1]].CarPattern[valueClient[j]].Name
      }
    }
    return carData
  }

  // 以图搜图 上传图片
  async uploadImg (form, url) {
    let res = await axios({
      method: 'POST',
      url: url + '/business/picsearchLogic.php',
      data: form,
      headers: form.getHeaders()
    })
    return res
  }

  // 以图搜图 识别图片
  async recognize (data, url) {
    let form1 = new FormData()
    form1.append('type', 'recognize')
    form1.append('imageType', 0)
    form1.append('binImageUrl', data.data.binImageUrl)
    let res = await axios({
      method: 'POST',
      url: url + '/business/picsearchLogic.php',
      data: form1,
      headers: form1.getHeaders()
    })
    return res
  }
  // 以图搜图 提交任务
  async add (data, url, startTime, endTime) {
    // 提交任务
    let form2 = new FormData()
    form2.append('type', 'add')
    if (data.data.data.pedestrainsData.length > 0) {
      // 行人
      let pedestrain = data.data.data.pedestrainsData[0]
      form2.append('objectType', pedestrain.type)
      form2.append('startTime', startTime)
      form2.append('endTime', endTime)
      form2.append('channelId', '')
      form2.append('imageUrl', data.data.binImageUrl)
      form2.append('ageCode', pedestrain.ageCode)
      form2.append('upperColorCode', pedestrain.upperColorCode)
      form2.append('sexCode', pedestrain.sexCode)
      form2.append('bagCode', pedestrain.bagCode)
      form2.append('knapsackCode', pedestrain.knapsackCode)
      form2.append('hatCode', pedestrain.hatCode)
      form2.append('bottomColorCode', pedestrain.bottomColorCode)
      form2.append('bodyRect', pedestrain.bodyRect.toString())
      form2.append('feature', pedestrain.feature)
      form2.append('orientationCode', pedestrain.orientationCode)
      form2.append('umbrellaCode', pedestrain.umbrellaCode)
      form2.append('hairCode', pedestrain.hairCode)
      form2.append('upperCode', pedestrain.upperCode)
      form2.append('bottomCode', pedestrain.bottomCode)
    } else if (data.data.data.bikesData.length > 0) {
      // 非机动车
      let bikesData = data.data.data.bikesData[0]
      form2.append('objectType', bikesData.type)
      form2.append('startTime', startTime)
      form2.append('endTime', endTime)
      form2.append('channelId', '')
      form2.append('imageUrl', data.data.binImageUrl)
      form2.append('ageCode', bikesData.persion[0].ageCode)
      form2.append('upperColorCode', bikesData.persion[0].upperColorCode)
      form2.append('sexCode', bikesData.persion[0].sexCode)
      form2.append('bagCode', bikesData.persion[0].bagCode)
      form2.append('knapsackCode', bikesData.persion[0].knapsackCode)
      form2.append('hatCode', bikesData.persion[0].hatCode)
      form2.append('bottomColorCode', bikesData.persion[0].bottomColorCode)
      form2.append('bodyRect', bikesData.bodyRect.toString())
      form2.append('feature', bikesData.feature)
      form2.append('orientationCode', bikesData.persion[0].orientationCode)
      form2.append('umbrellaCode', bikesData.persion[0].umbrellaCode)
      form2.append('hairCode', bikesData.persion[0].hairCode)
      form2.append('upperCode', bikesData.persion[0].upperCode)
      form2.append('bottomCode', bikesData.persion[0].bottomCode)
    } else if (data.data.data.vehiclesData.length > 0) {
      // 机动车
      let vehicle = data.data.data.vehiclesData[0]
      form2.append('objectType', vehicle.type)
      form2.append('startTime', startTime)
      form2.append('endTime', endTime)
      form2.append('channelId', '')
      form2.append('imageUrl', data.data.binImageUrl)
      form2.append('feature', vehicle.feature)
      form2.append('carFamily', vehicle.carFamily)
      form2.append('carPattern', vehicle.carPattern)
      form2.append('carBrand', vehicle.carBrand)
      form2.append('colorCode', vehicle.colorCode)
      form2.append('plateTypeCode', vehicle.plateLicence)
      form2.append('plateLicence', vehicle.plateLicence)
      form2.append('bodyRect', vehicle.bodyRect.toString())
      form2.append('carStyleType', vehicle.carStyleType)
      form2.append('carKindCode', 0)
      // let code = (CarKindType.find(item => item.CarKindName === vehicle.typeName)).CarKindCode
      // console.log(code.)
    }
    let res = await axios({
      method: 'POST',
      url: url + '/business/picsearchLogic.php',
      data: form2,
      headers: form2.getHeaders()
    })
    res = await this.progressRun(res, url)
    return res
  }
  // 以图搜图 结合添加任务一起使用
  progressRun (res, url) {
    return new Promise(async (resolve, reject) => {
      let count = 0
      async function _ () {
        count++
        let form3 = new FormData()
        form3.append('type', 'get')
        form3.append('taskId', parseInt(res.data.id))
        let res1 = await axios({
          method: 'POST',
          url: url + '/business/picsearchLogic.php',
          data: form3,
          headers: form3.getHeaders()
        })
        console.log(
          '以图识图任务 次数：' + count + ' 进度:' + url + ' ',
          res1.data.data.processStage,
          '/  2  服务器返回状态:',
          res1.status
        )
        if (res1.data.data.processStage === '2') {
          resolve(res1)
        } else {
          if (count === 10) {
            console.log('结构化服务器异常：' + url)
            resolve({ error: '服务器异常' })
          } else {
            setTimeout(() => {
              _()
            }, 1000)
          }
        }
      }
      _()
    })
  }

  // 以图搜图 获取结果
  async getresult (data, url, score) {
    let form4 = new FormData()
    form4.append('type', 'getresult')
    form4.append('taskId', data.data.data.taskId)
    form4.append('rows', 100) // 最大返回100条
    form4.append('start', 0)
    form4.append('score', score)
    let res = await axios({
      method: 'POST',
      url: url + '/business/picsearchLogic.php',
      data: form4,
      headers: form4.getHeaders()
    })
    return res
  }

  // 以图搜图 汇总执行
  async uploadImgAllRun (form, url, startTime, endTime, score, limit, offset) {
    let res = null
    let fromName = ''
    try {
      // 上传图片
      res = await this.uploadImg(form, url)
      // 识别图片
      res = await this.recognize(res, url)
      // 提交任务
      console.log(url, '行人数据', res.data.data.pedestrainsData.length)
      console.log(url, '非机动车', res.data.data.bikesData.length)
      console.log(url, '机动车', res.data.data.vehiclesData.length)
      let whereData = {}
      if (res.data.data.pedestrainsData.length > 0) {
        let pedestrain = res.data.data.pedestrainsData[0]
        fromName = '"pedestrains"'
        whereData.type = pedestrain.type
        whereData.ageCode = pedestrain.ageCode
        whereData.upperColorCode = pedestrain.upperColorCode
        whereData.sexCode = pedestrain.sexCode
        whereData.bagCode = pedestrain.bagCode
        whereData.hatCode = pedestrain.hatCode
        whereData.bottomColorCode = pedestrain.bottomColorCode
        whereData.orientationCode = pedestrain.orientationCode
        whereData.umbrellaCode = pedestrain.umbrellaCode
        whereData.hairCode = pedestrain.hairCode
        whereData.upperTypeCode = pedestrain.upperCode // 差别
      } else if (res.data.data.bikesData.length > 0) {
        fromName = '"nonVehicles"'
        let noVehicle = res.data.data.bikesData[0]
        whereData.type = noVehicle.type
        whereData.ageCode = noVehicle.persion[0].ageCode
        whereData.bagCode = noVehicle.persion[0].bagCode
        whereData.bottomColorCode = noVehicle.persion[0].bottomColorCode
        whereData.hairCode = noVehicle.persion[0].hairCode
        whereData.hatCode = noVehicle.persion[0].hatCode
        whereData.knapsackCode = noVehicle.persion[0].knapsackCode
        whereData.orientationCode = noVehicle.persion[0].orientationCode
        whereData.sexCode = noVehicle.persion[0].sexCode
        whereData.umbrellaCode = noVehicle.persion[0].umbrellaCode
        whereData.upperColorCode = noVehicle.persion[0].upperColorCode
      } else if (res.data.data.vehiclesData.length > 0) {
        fromName = '"vehicles"'
        let vehicle = res.data.data.vehiclesData[0]
        whereData.type = vehicle.type
        whereData.plateColorCode = vehicle.plateColorCode
        whereData.plateTypeCode = vehicle.plateTypeCode
        whereData.colorCode = vehicle.colorCode
        whereData.plateLicence = vehicle.plateLicence
        // "carFamily": "19",
        // "carPattern": "6",
        // "carBrand": "28",
        // "carStyleType": "0",
        // "plateColorCode": "2",
        // "plateTypeCode": "2",
      }
      // 提交任务
      res = await this.add(res, url, startTime, endTime)
      res = await this.getresult(res, url, score)
      console.log(`[${url}] 服务识别图像数量：${res.data.data.length}`)
      return {
        url: url,
        tableName: fromName,
        remoteCount: res.data.data.length,
        // count: influxdbData.length,
        data: res.data.data, // influxdbData  //res.data.data
        whereData: whereData
      }
    } catch (err) {
      console.log('已图搜图:错误', url, '  ', err, res.data)
      return {
        url: url,
        tableName: fromName,
        remoteCount: 0,
        data: [],
        res: res.data
      }
    }
  }

  // 以图搜图功能查询返回的数据，拼接绑定的资源 _id
  async setVideoChannelId (picsearchLogicResultItem) {
    const res = await Resource.findOne(
      {
        'videoStructure.channelId': picsearchLogicResultItem.channelId
      },
      '_id videoStructure'
    )
      .populate({ path: 'videoStructure.structureServer', select: 'ip' })
      .lean()
      .exec()
    const resId = _.get(res, '_id', '')
    picsearchLogicResultItem.videoChannel = resId + ''
    // 前端根据 resourceId 去绘制轨迹 不能删
    picsearchLogicResultItem.resourceId = resId + ''
    picsearchLogicResultItem.structServerIp = _.get(res, 'videoStructure.structureServer.ip', '')
    return this.replaceSomeFieldName(picsearchLogicResultItem)
  }

  // 结构化追踪根据 videoChannel 的参数，过滤掉不在里面的数据
  async filterVideoChannelNotExists (picsearchLogicResult, videoChannelsStr) {
    const videoChannels = videoChannelsStr.split(',')
    let result = []
    for (const item of picsearchLogicResult) {
      const res = await Resource.findOne({ 'videoStructure.channelId': item.channelId }, '_id videoStructure')
        .populate({ path: 'videoStructure.structureServer', select: 'ip' })
        .lean()
        .exec()
      const resId = _.get(res, '_id', '')
      if (!videoChannels.includes(resId + '')) {
        continue
      }
      item.videoChannel = resId + ''
      // 前端根据 resourceId 去绘制轨迹 不能删
      item.resourceId = resId + ''
      item.structServerIp = _.get(res, 'videoStructure.structureServer.ip', '')
      result.push(this.replaceSomeFieldName(item))
    }
    return result
  }

  replaceSomeFieldName (dataItem) {
    dataItem.captureTime = Number(dataItem.timestamp)
    dataItem.bigImageUrl = dataItem.imageurl
    dataItem.score = Number(dataItem.score).toFixed(2) // 相似度保留两位小数
    dataItem.smallImageUrl = dataItem.imageurl.replace('getimage', 'getimagethumb')
    if (_.isUndefined(dataItem.bodyRect) || _.isEmpty(dataItem.bodyRect)) {
      dataItem.bodyRect = dataItem.carRect || ''
    }
    dataItem.upperTypeCode = dataItem.upperCode
    dataItem.bottomTypeCode = dataItem.bottomCode
    dataItem.tagNum = dataItem.tagCode
    // 这个地方是为了在导出 excel 表时将抓拍时间显示在最前面，为什么要这样写，历史原因
    return Object.assign({ time: moment(Number(dataItem.timestamp)).format('YYYY-MM-DD HH:mm:ss') }, dataItem)
  }
}

module.exports = {
  statisticCountIdentifyData,
  InfluxSqlFactory
}
