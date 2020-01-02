/*
 * @Author: linhang
 * @Date: 2019-07-28 11:16:47
 * @Last Modified by: linhang
 * @Last Modified time: 2019-10-25 11:44:50
 */
const config = require('../../../../../config').backend
const { mkdirsSync, handleSysException } = require('../../../../common/tools')
const randomString = require('randomstring')
const PeopleVehicle = mongoose.model('peoplevehicle')
const MotorVehicle = mongoose.model('motorvehicle')
const FaceServer = mongoose.model('FaceServer') // 人脸服务器
const Device = mongoose.model('Device')
const { compare } = require('../../../veriface/sdk.interface')
const { extractFaceFeature } = require('../../../veriface/sdk.interface')
const VerificationScore = mongoose.model('verificationscore')
const { emitPassVehicleData, emitVehicleCheckData, emitVehicleCheckFailureData } = require('./socketio')
const jimp = require('jimp')
const req = require('./request')
/**
 * 海康TPE300实时推送过车数据,接口返回结果慢会导致服务器重复调用接口
 */
exports.realTime = async ctx => {
  setTimeout(async () => {
    await this.realTimeAsync(ctx)
  })
  ctx.body = {
    code: 0,
    errDesc: ''
  }
}
exports.realTimeAsync = async ctx => {
  try {
    const data = ctx.request.body
    // direction为0表示入场过车，1代表出场过车
    if (data && data.direction === 0 && data.dataType === 0) {
      // 时间设定
      const date = moment().format('YYYY-MM-DD')
      const nowTime = moment().format('X')
      data.date = date
      data.time = nowTime
      data.gateName = data.laneName // 车道名称
      // 过车图片写入磁盘,先从PMS服务器上获取图片buffer，然后写到磁盘
      const passVehiclePicBuffer = await getVehiclePicBuffer('ImageServer/' + data.picFilePath)
      const folderPath = path.join(config.fileDirs.passVehiclePicDir, date)
      if (!fs.existsSync(folderPath)) {
        mkdirsSync(folderPath)
      }
      const passVehiclePicPath = path.join(folderPath, `vehicle${randomString.generate(10)}${nowTime}.jpg`) // 过车图片文件命名
      fs.writeFileSync(passVehiclePicPath, passVehiclePicBuffer)
      const vehiclePicPath = `/image${passVehiclePicPath.split(config.fileDirs.baseDir).pop()}`
      data.vehiclePic = vehiclePicPath // 过车图片路径
      // 构建实时过车数据
      const passVehicleInfo = {
        time: data.time,
        plateNo: data.plateNo,
        vehiclePic: data.vehiclePic,
        gateName: data.laneName
      }
      // 查看是否有备案
      const motorVehicle = await MotorVehicle.findOne({
        plateNo: data.plateNo,
        startTime: { $lte: nowTime },
        endTime: { $gte: nowTime }
      }).lean()
      // const motorVehicle = await MotorVehicle.findOne({}).lean()
      // 如果有备案，则用人脸sdk比对备案照片和抓拍驾驶员照片
      if (motorVehicle) {
        const faceServer = await FaceServer.findOne().lean()
        // 如果已经添加了旷世人脸抓拍sdk服务器
        if (faceServer) {
          // 获取人车同检阈值
          const { score } = await VerificationScore.findOne().lean()
          if (!score) {
            throw new Error('请设置人车同检阈值分数')
          }
          data.check = true // check为true代表经过人脸服务器对比过
          // 人脸sdk服务器信息
          const host = {
            ip: faceServer.ip,
            port: faceServer.port
          }
          // 裁剪过车图片，获取驾驶员人脸照片
          const image = await jimp.read(passVehiclePicBuffer)
          const param = config.driverPicParam
          // 对裁剪图片参数进行校验
          const left =
            image.bitmap.width - param.left >= param.width ? param.left : image.bitmap.width - param.width + 50
          const top =
            image.bitmap.height - param.top >= param.height ? param.top : image.bitmap.height - param.height + 50
          const cropedImage = image.crop(left, top, param.width, param.height)
          const buffer = await cropedImage.getBufferAsync('image/jpeg')
          // 测试裁剪出来的驾驶员照片能否提取出特征值，如果能，则进行人脸对比，否则视为提取失败
          const base64Str = await extractFaceFeature(host, buffer, 'x.jpg')
          const initInfo = {
            recordName: motorVehicle.name, // 驾驶员姓名
            recordPlateNo: motorVehicle.plateNo, // 备案车牌号码
            recordDriverPic: motorVehicle.driverPic1, // 备案驾驶员照片
            recordContact: motorVehicle.tel, // 备案驾驶员联系方式
            time: data.time, // 过车时间
            plateNo: data.plateNo, // 识别车牌号
            vehiclePic: vehiclePicPath, // 过车图片
            gateName: data.laneName // 出入口名称
          }
          // 获取sdk服务器裁剪图片,如果返回''则提取失败,把裁剪后的驾驶员照片写入磁盘
          if (base64Str) {
            const passDriverPicPath = path.join(folderPath, `driver${randomString.generate(10)}${nowTime}.jpg`) // 驾驶员图片命名
            fs.writeFileSync(passDriverPicPath, Buffer.from(base64Str, 'base64')) // 驾驶员照片写入磁盘
            const driverPicPath = `/image${passDriverPicPath.split(config.fileDirs.baseDir).pop()}`
            data.driverPic = driverPicPath
            const similars = []
            // 如果备案图片1上传了
            if (motorVehicle.driverPic1) {
              const driverpic = `${config.fileDirs.baseDir}${motorVehicle.driverPic1.split('image').pop()}`
              const similar = await compare(host, passDriverPicPath, driverpic)
              similars.push(similar)
            }
            // 如果备案图片2上传了
            if (motorVehicle.driverPic2) {
              const driverpic = `${config.fileDirs.baseDir}${motorVehicle.driverPic2.split('image').pop()}`
              const similar = await compare(host, passDriverPicPath, driverpic)
              similars.push(similar)
            }
            // 如果备案图片3上传了
            if (motorVehicle.driverPic2) {
              const driverpic = `${config.fileDirs.baseDir}${motorVehicle.driverPic3.split('image').pop()}`
              const similar = await compare(host, passDriverPicPath, driverpic)
              similars.push(similar)
            }
            if (similars.length) {
              const similarValue = Math.max(...similars)
              // 如果图片对比失败，把sdk返回的驾驶员照片写入磁盘
              if (similarValue === -1) {
                data.extractSuccess = true
                data.checkResult = 0
                emitPassVehicleData(passVehicleInfo)
                await PeopleVehicle.create(Object.assign(data, initInfo))
              } else {
                // 如果图片比对成功
                if (similarValue >= score) {
                  // 匹配备案照片
                  initInfo.similar = similarValue
                  initInfo.checkResult = 1
                  initInfo.driverPic = driverPicPath
                  emitVehicleCheckData(initInfo)
                  await PeopleVehicle.create(Object.assign(data, initInfo))
                  emitPassVehicleData(passVehicleInfo)
                  ctx.body = {
                    code: 0,
                    errDesc: ''
                  }
                  return
                } else {
                  // 不匹配备案照片
                  initInfo.similar = similarValue
                  initInfo.checkResult = 2
                  initInfo.driverPic = driverPicPath
                  emitVehicleCheckData(initInfo)
                  await PeopleVehicle.create(Object.assign(data, initInfo))
                  emitPassVehicleData(passVehicleInfo)
                  ctx.body = {
                    code: 0,
                    errDesc: ''
                  }
                  return
                }
              }
            }
          } else {
            // 如果图片提取特征值失败，把裁剪后的驾驶员照片写入磁盘
            const passDriverPicPath = path.join(folderPath, `cropedDriver${randomString.generate(10)}${nowTime}.jpg`)
            fs.writeFileSync(passDriverPicPath, buffer)
            const driverPicPath = `/image${passDriverPicPath.split(config.fileDirs.baseDir).pop()}`
            data.driverPic = driverPicPath
            data.checkResult = 0
            emitPassVehicleData(passVehicleInfo)
            await PeopleVehicle.create(Object.assign(data, initInfo))
            ctx.body = {
              code: 0,
              errDesc: ''
            }
            return
          }
        } else {
          // 如果没有添加旷世人脸sdk
          emitPassVehicleData(passVehicleInfo)
          await PeopleVehicle.create(data)
          ctx.body = {
            code: 0,
            errDesc: ''
          }
          return
        }
      } else {
        // 如果没有备案
        emitPassVehicleData(passVehicleInfo)
        await PeopleVehicle.create(data)
        ctx.body = {
          code: 0,
          errDesc: ''
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}
/**
 * 进入人车同检页面实时过车显示最近的16条数据
 */
exports.historyPassVehicle = async ctx => {
  try {
    const data = await PeopleVehicle.find({}, 'time plateNo vehiclePic gateName')
      .sort({ _id: -1 })
      .limit(16)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 进入人车同检页面核验结果显示当日最近的16条数据
 */
exports.historyVehicleCheck = async ctx => {
  try {
    const date = moment().format('YYYY-MM-DD')
    const data = await PeopleVehicle.find({ date: date, checkResult: { $in: [1, 2] } })
      .sort({ _id: -1 })
      .limit(16)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 定时任务推送人车同检核验失败次数
 */
exports.VehicleCheckFailureData = async ctx => {
  try {
    const date = moment().format('YYYY-MM-DD')
    const count = await PeopleVehicle.countDocuments({ date: date, checkResult: 2 })
    emitVehicleCheckFailureData(count)
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 查询人车同检核验失败次数
 */
exports.getCheckFailCount = async ctx => {
  try {
    const date = moment().format('YYYY-MM-DD')
    const count = await PeopleVehicle.countDocuments({ date: date, checkResult: 2 })
    ctx.body = count
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取车道名称
 */
exports.getLocation = async ctx => {
  try {
    const tpeDevice = await Device.findOne(
      { manufacturer: 'hikvision', type: 'traffic', series: 'TPE300' },
      'ip cport'
    ).lean()
    if (tpeDevice) {
      const option = {
        method: 'post',
        host: {
          ip: tpeDevice.ip,
          port: tpeDevice.cport
        },
        queryStr: 'getRoadWayPage'
      }
      const data = await req(option)
      if (data.code === 0 && data.roadWay.length) {
        const roadWays = []
        data.roadWay.forEach(item => {
          roadWays.push(item.name)
        })
        ctx.body = roadWays
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
/**
 * 根据图片相对路径从PMS服务器上获取图片buffer
 * @param {*} vehiclePicPath
 */
const getVehiclePicBuffer = async vehiclePicPath => {
  try {
    const tpeDevice = await Device.findOne(
      { manufacturer: 'hikvision', type: 'traffic', series: 'TPE300' },
      'ip cport'
    ).lean()
    const option = {
      method: 'get',
      encoding: null,
      headers: {
        'Accept-Encoding': 'gzip, deflate'
      },
      host: {
        ip: tpeDevice.ip,
        port: tpeDevice.cport
      },
      queryStr: vehiclePicPath
    }
    const buffer = await req(option)
    return buffer
  } catch (error) {
    throw error
  }
}
