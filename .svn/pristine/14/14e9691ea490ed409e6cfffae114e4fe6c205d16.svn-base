/**
 * 人脸识socket推送接口
 * @time:2017-7-5
 * @author: hansen
 */
const Face = require('mongoose').model('Face')
const Feature = require('mongoose').model('FaceFeaStatic')
const FaceStatistic = require('mongoose').model('FaceStatistic')
const People = require('mongoose').model('People')
const Org = require('mongoose').model('Org')
const OrgRes = require('mongoose').model('OrgRes')
const moment = require('moment')
const _ = require('lodash')
const socket = require('./face.socket')
const faceService = require('./face.service')
const CONSTANTS = require('../face.constants').FACE
const Alarm = require('../../bstar/alarm.interface')
const postal = require('postal')

// 人脸服务配置修改后加载新的配置
postal.subscribe({
  channel: 'server',
  topic: 'item.message',
  callback: () => {
    faceService.startUpOrUpdateServerCfg()
  }
})
faceService.startUpOrUpdateServerCfg()

module.exports = () => {
  // 统计园区黑名单、白名单、对比数、布控人员的数量
  setInterval(async () => {
    try {
      const date = moment().format('YYYYMMDD')
      const time = moment().toObject()
      const type = CONSTANTS.PEOPLE.UNUSUALSTATIC
      const compareTime = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
      // 获取当前时间前一小时的的统计汇总
      const statistic = await FaceStatistic.aggregate([
        {
          $match: {
            date: Number(moment(date).format('X')),
            type: { $in: type },
            granularity: CONSTANTS.GRANULARITY.HOUR,
            summary: CONSTANTS.SUMMARY.MUTILPART,
            hour: { $lte: time.hours }
          }
        },
        { $group: { _id: '$type', total: { $sum: '$statistic' } } }
      ])
      // 获取当前时间整点到现在的统计汇总(黑名单、白名单、布控人员)
      const face = []
      const current = Number(moment().format('X'))
      for (const t of _.dropRight(type)) {
        const count = await Face.countDocuments({
          type: t,
          $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
        })
        face.push({ _id: t, total: count })
      }
      // 获取当前时间整点到现在的统计汇总(抓拍系统下的陌生人)
      // const stranger = await Face.countDocuments({ type: CONSTANTS.PEOPLE.STRANGER, sys: CONSTANTS.SYS.CAPUTRUE, snapshotTime: { $gte: compareTime } })
      const stranger = await Face.countDocuments({
        type: CONSTANTS.PEOPLE.STRANGER,
        sys: CONSTANTS.SYS.CAPUTRUE,
        $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
      })
      const amount = face.reduce((sum, item) => sum + item.total, 0)
      face.push({ _id: CONSTANTS.PEOPLE.COMPARSION, total: amount + stranger })
      // 合并统计数量
      Object.keys(face).forEach(index => {
        Object.keys(statistic).forEach(key => {
          if (statistic[key]._id === face[index]._id) {
            face[index].total += statistic[key].total
          }
        })
      })
      const data = { black: 0, white: 0, attention: 0, comparsion: 0 }
      if (!_.isEmpty(face)) {
        face.map(item => {
          switch (item._id) {
            case CONSTANTS.PEOPLE.BLACK:
              data.black = item.total
              return
            case CONSTANTS.PEOPLE.WHITE:
              data.white = item.total
              return
            case CONSTANTS.PEOPLE.ATTENTION:
              data.attention = item.total
              return
            default:
              data.comparsion = item.total
          }
        })
      }
      socket.faceToday(data)
    } catch (error) {
      console.log('location: face.socket.js->统计园区黑名单、白名单、比对识别、布控人员数量')
      console.log(error)
    }
  }, 60000)
  // 统计园区员工、访客、vip、陌生人的数量
  setInterval(async () => {
    try {
      const date = moment().format('YYYYMMDD')
      const time = moment().toObject()
      const compareTime = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
      const type = CONSTANTS.PEOPLE.NORMALSTATIC
      // 获取当前时间前一小时的的统计汇总
      const statistic = await FaceStatistic.aggregate([
        {
          $match: {
            date: Number(moment(date).format('X')),
            granularity: CONSTANTS.GRANULARITY.HOUR,
            type: { $in: type },
            summary: CONSTANTS.SUMMARY.MUTILPART,
            hour: { $lte: time.hours }
          }
        },
        { $group: { _id: '$type', total: { $sum: '$statistic' } } }
      ])
      // 获取当前时间整点到现在的统计汇总(员工、访客、vip)
      const face = []
      const current = Number(moment().format('X'))
      for (const t of _.dropRight(type)) {
        // const count = await Face.countDocuments({ type: t, snapshotTime: { $gte: compareTime } })
        const count = await Face.countDocuments({
          type: t,
          $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
        })
        face.push({ _id: t, total: count })
      }
      // 获取当前时间整点到现在的统计汇总(抓拍系统下的陌生人)
      // const stranger = await Face.countDocuments({ type: CONSTANTS.PEOPLE.STRANGER, sys: CONSTANTS.SYS.PASS, snapshotTime: { $gte: compareTime } })
      const stranger = await Face.countDocuments({
        type: CONSTANTS.PEOPLE.STRANGER,
        sys: CONSTANTS.SYS.PASS,
        $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
      })

      face.push({ _id: CONSTANTS.PEOPLE.STRANGER, total: stranger })
      // 合并统计数量
      Object.keys(face).forEach(index => {
        Object.keys(statistic).forEach(key => {
          if (statistic[key]._id === face[index]._id) {
            face[index].total += statistic[key].total
          }
        })
      })
      const data = { subject: 0, vistor: 0, vip: 0, stranger: 0 }
      if (!_.isEmpty(face)) {
        face.map(item => {
          switch (item._id) {
            case CONSTANTS.PEOPLE.SUBJECT:
              data.subject = item.total
              return
            case CONSTANTS.PEOPLE.VISITOR:
              data.vistor = item.total
              return
            case CONSTANTS.PEOPLE.VIP:
              data.vip = item.total
              return
            default:
              data.stranger = item.total
          }
        })
      }
      socket.passToday(data)
    } catch (error) {
      console.log('location: face.socket.js->统计园区员工、访客、vip、陌生人的数量')
      console.log(error)
    }
  }, 60000)
  // 实时获取旷视识别人员并且推送识别人员的信息到前端y
  let [diff, off, baseSecond, cached = []] = [2, 1, Number(moment().format('X'))]
  setInterval(async () => {
    const alarm = []
    try {
      const params = { start: baseSecond - diff, end: baseSecond, size: 1000 }
      if (diff - 2 > 0) {
        diff = 2
      }
      const result = await faceService.getHistroy(params)
      if (_.isNil(result)) {
        baseSecond += 2
      } else {
        // 人脸服务器时间步调错误是进行调整
        if (params.end === result.time || params.end >= result.time) {
          baseSecond = result.time + 2
        } else if (params.end < result.time && off === 1) {
          baseSecond = result.time + 2
          off = 0
        } else if (params.end < result.time) {
          baseSecond = result.time + 2
          diff = baseSecond - params.end
        }
      }

      if (!_.isNull(result) && !_.isEmpty(result.data)) {
        // 缓存本次获取数据用于下次结果过滤相同的数据
        const human = result.data
        result.data = _.compact(human.map(item => (cached.includes(item.id) ? '' : item)))
        cached = human.map(item => item.id)
        // 获取人脸组织下的所有资源
        const orgs = await Org.find({ type: CONSTANTS.ORG.FACE }, '_id')
        const resources = await OrgRes.find({ org: { $in: _.map(orgs, '_id') } }).populate('resource')
        // 待插入到人员识别结合中的文档
        const person = []
        const statistics = {
          male: 0,
          female: 0,
          level0: 0,
          level1: 0,
          level2: 0,
          level3: 0,
          level4: 0,
          level5: 0,
          level6: 0,
          level7: 0,
          level8: 0,
          level9: 0
        }
        for (const item of result.data) {
          // 获取识别信息对应的资源
          const snapRtsp = _.result(item, 'screen.camera_address')
          const res = resources.find(key => {
            if (key.resource && key.resource.rtsp) {
              return (
                snapRtsp.indexOf(key.resource.rtsp.main.replace('rtsp://ip:port', '')) >= 0 ||
                snapRtsp.indexOf(key.resource.rtsp.sub.replace('rtsp://ip:port', '')) >= 0
              )
            }
          })
          // 资源如果不存在，那么提示错误信息。（识别系统中存在，但是人脸配置汇中不存在）
          if (!res) {
            console.log('找不到匹配的rtsp流配置，请检查人脸资源配置')
            continue
          }
          // 如果识别系统中没有用户信息，则底库中没有该人员，识别为陌生人
          if (!item.subject) {
            person.push({
              resource: res.resource._id,
              resourcePoint: item.screen.camera_position,
              gender: getGender(item.gender),
              snapshot: item.photo,
              snapshotKSTime: item.timestamp,
              snapshotTime: moment().format('X'),
              type: CONSTANTS.PEOPLE.STRANGER,
              sys: res.resource.analysisType
            })
            // 统计计算人员年龄及性别特征 （通行系统并且是入园的陌生人会计入人员特征统计）
            if (res.resource.analysisType === CONSTANTS.SYS.PASS && res.resource.passway === CONSTANTS.PASSWAY.ENTRY) {
              statistic(item, statistics)
            }
          } else {
            // 判断当前识别信息资源是否跟资源分析类型一致，如果一致入库，不一致丢弃数据
            if (res.resource.analysisType === CONSTANTS.SYS.CAPUTRUE && !_.isEqual(item.subject.title, '')) {
              // 抓拍系统
              if (Number(item.subject.title) === CONSTANTS.PEOPLE.ATTENTION) {
                // 如果是布控人员那么查找该人员的布控资源是否包含识别的资源，如果不包含则丢弃数据，包含则存储为布控类型
                const people = await People.findOne({
                  type: CONSTANTS.PEOPLE.ATTENTION,
                  status: CONSTANTS.ATTENTION.GOING,
                  username: item.subject.name,
                  visionId: item.subject_id
                })
                console.log('people', people)
                if (
                  people &&
                  people.resources.length !== 0 &&
                  people.resources.map(item => item.toString()).includes(res.resource._id.toString())
                ) {
                  alarm.push({
                    eventType: CONSTANTS.ALARM.PEOPLE,
                    devIp: res.resource.ip,
                    devPort: res.resource.port,
                    time: item.timestamp,
                    channel: res.resource.chan
                  })
                } else {
                  continue
                }
              }
            } else if (res.resource.analysisType === CONSTANTS.SYS.PASS && _.isEqual(item.subject.title, '')) {
              // 通行系统
              if (res.resource.passway === CONSTANTS.PASSWAY.ENTRY) {
                statistic(item, statistics)
              }
            } else {
              continue
            }
            person.push({
              visionId: item.subject_id,
              username: item.subject.name,
              age: Math.floor(Number(item.age)),
              gender: getGender(item.gender),
              idNumber: item.subject.remark,
              similarity: Number(item.confidence).toFixed(2),
              picture: item.subject.photos[0].url,
              resource: res.resource._id,
              resourcePoint: item.screen.camera_position,
              snapshot: item.photo,
              snapshotKSTime: item.timestamp,
              snapshotTime: moment().format('X'),
              type: Number(item.subject.title),
              sys: res.resource.analysisType
            })
          }
        }
        if (person.length > 0) {
          await Promise.all([
            Face.insertMany(person),
            Feature.update(
              { date: Number(moment(moment().format('YYYYMMDD')).format('X')) },
              { $inc: statistics },
              { upsert: true }
            )
          ])
        }
        const data = _.dropWhile(person, item => {
          return (
            item.type === CONSTANTS.PEOPLE.SUBJECT ||
            item.type === CONSTANTS.PEOPLE.VIP ||
            item.type === CONSTANTS.PEOPLE.VISITOR ||
            (item.type === CONSTANTS.PEOPLE.STRANGER && item.sys === CONSTANTS.SYS.PASS)
          )
        })
        if (data.length > 0) {
          socket.realTime(data)
        }
        // 发送报警信息到报警管理
        alarm.forEach(item => Alarm.alarmNotification(item))
      }
      // })
    } catch (error) {
      console.log('location: face.socket.js->实时推送识别人员')
      console.log(error)
    }
  }, 2000)
}
// 人员特征统计
const statistic = (item, stic) => {
  // statistic
  let level = 'level0'
  switch (parseInt(item.age).toString().length) {
    case 1:
      level = 'level0'
      break
    case 2:
      level = 'level' + item.age.toString().substr(0, 1)
      break
    default:
      level = 'level9'
      break
  }
  item.gender >= 0.5 ? stic.male++ : stic.female++
  stic[level] += 1
}
const getGender = PR => {
  return PR >= 0.5 ? CONSTANTS.GENDER.MALE : CONSTANTS.GENDER.FEMALE
}
