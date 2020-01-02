/*
 * @Author: chenkaibo
 * @Date: 2018-10-22 19:11:46
 * @Last Modified by: linhang
 * @Last Modified time: 2019-06-13 17:35:25
 */
'use strict'
const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const AlarmCfg = mongoose.model('alarmCfg')
const PlatformServer = mongoose.model('PlatformServer')
const { alarmArm, alarmDisarm, alarmClean, alarmBypass, alarmPass, alarmStatus, AlarmControl } = require('../../bstar/dev.interface')
class AlarmService {
  /**
   * 根据id查找设备
   * @param {*} id
   * @memberof AlarmService
   */
  async findDeviceById (id, select) {
    try {
      const devInfo = await Device.findById(id, select)
        .lean()
        .exec()
      return devInfo
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据id查找资源
   * @param {*} id
   * @memberof AlarmService
   */
  async findResourceById (id, select) {
    try {
      const resInfo = await Resource.findById(id, select)
        .lean()
        .exec()
      return resInfo
    } catch (error) {
      throw error
    }
  }
  /**
   * 根据eid查找资源
   * @param {*} id
   * @memberof AlarmService
   */
  async findResourceByQuery (query) {
    try {
      const reses = await Resource.find(query)
        .lean()
        .exec()
      return reses
    } catch (error) {
      throw error
    }
  }
  async mergeAlarmStatus (reses, result) {
    try {
      result &&
        result.length &&
        reses.forEach(res => {
          const temp = result.find(item => +item.channel === res.chan)
          temp && (res.alarmStatus = temp.status)
        })
      return reses
    } catch (error) {
      throw error
    }
  }
  /**
   *
   * 根据资源查找联动视频
   * @param {*} rid
   * @memberof AlarmService
   */
  async getActionVideoByRes (rid) {
    try {
      const alarmCfg = await AlarmCfg.findOne({ resource: rid }, 'actionVideo')
        .lean()
        .exec()
      return alarmCfg && alarmCfg.actionVideo ? alarmCfg.actionVideo : []
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取布撤防请求参数
   * @param {*} ctx
   * @returns
   * @memberof AlarmService
   */
  async getReqBody (ctx) {
    try {
      const body = {
        devInfo: {
          devIp: 'shike',
          devPort: 2302
        },
        devList: []
      }
      if (ctx.request.body.type === 'dev') {
        const devs = await Device.find({ _id: { $in: ctx.request.body.ids } }, 'ip cport').lean()
        devs.forEach(dev => {
          body.devList.push({
            devIp: dev.ip,
            devPort: dev.cport
          })
        })
      } else {
        const reses = await Resource.find({ _id: { $in: ctx.request.body.ids } }, 'ip port chan').lean()
        reses.forEach(res => {
          body.devList.push({
            devIp: res.ip,
            devPort: res.port,
            channel: res.chan
          })
        })
      }
      return body
    } catch (error) {
      throw error
    }
  }
  /**
   *电子围栏设备处理数据
   * @param {*} ctx
   * @param {*} cmdType // 0代表撤防，1代表布防，2代表旁路，3旁路恢复，5 报警清除
   */
  async getFenceBody (ctx, cmdType) {
    try {
      const body = {
        devInfo: {
          devIp: 'guangtuo',
          devPort: 2303,
          cmdType: cmdType
        },
        devList: []
      }
      const devs = await Device.find({ _id: { $in: ctx.request.body.ids } }, 'ip intranetIp intranetPort').lean()
      if (ctx.request.body.type === 'dev') {
        devs.forEach(item => {
          body.devList.push({
            paltformIp: item.intranetIp,
            paltformPort: Number(item.intranetPort),
            devIp: item.ip,
            devPort: 4999,
            channel: 0
          })
        })
      } else {
        const resources = await Resource.find({ _id: { $in: ctx.request.body.ids } }, 'ip port chan eid')
          .populate({ path: 'eid', select: 'ip intranetIp intranetPort' })
          .lean()
          .exec()
        resources.forEach(res => {
          body.devList.push({
            paltformIp: res.eid.intranetIp,
            paltformPort: Number(res.eid.intranetPort),
            devIp: res.eid.ip,
            devPort: 4999,
            channel: res.chan
          })
        })
      }
      return body
    } catch (err) {
      throw err
    }
  }
  /**
   * 布防
   * @param {*} ctx
   * @memberof AlarmService
   */
  async arm (ctx) {
    try {
      // 如果是电子围栏设备(厂商都是guangtuo)
      if (ctx.request.body.deviceType === 'guangtuo') {
        const body = await this.getFenceBody(ctx, 1)
        await AlarmControl(ctx, body)
        return
      }
      // 如果是常规报警主机
      const body = await this.getReqBody(ctx)
      await alarmArm(ctx, body)
    } catch (error) {
      throw error
    }
  }
  /**
   * 撤防
   * @param {*} ctx
   * @memberof AlarmService
   */
  async disarm (ctx) {
    try {
      // 如果是电子围栏设备(厂商都是guangtuo)
      if (ctx.request.body.deviceType === 'guangtuo') {
        const body = await this.getFenceBody(ctx, 0)
        await AlarmControl(ctx, body)
        return
      }
      const body = await this.getReqBody(ctx)
      await alarmDisarm(ctx, body)
    } catch (error) {
      throw error
    }
  }
  /**
   * 报警清除
   * @param {*} ctx
   * @memberof AlarmService
   */
  async alarmClean (ctx) {
    try {
      // 如果是电子围栏设备(厂商都是guangtuo)
      if (ctx.request.body.deviceType === 'guangtuo') {
        const body = await this.getFenceBody(ctx, 5)
        await AlarmControl(ctx, body)
        return
      }
      const body = await this.getReqBody(ctx)
      await alarmClean(ctx, body)
    } catch (error) {
      throw error
    }
  }
  /**
   * 旁路
   * @param {*} ctx
   * @memberof AlarmService
   */
  async bypass (ctx) {
    try {
      // 如果是电子围栏设备(厂商都是guangtuo)
      if (ctx.request.body.deviceType === 'guangtuo') {
        const body = await this.getFenceBody(ctx, 2)
        await AlarmControl(ctx, body)
        return
      }
      const body = await this.getReqBody(ctx)
      await alarmBypass(ctx, body)
    } catch (error) {
      throw error
    }
  }
  /**
   * 撤旁
   * @param {*} ctx
   * @memberof AlarmService
   */
  async pass (ctx) {
    try {
      // 如果是电子围栏设备(厂商都是guangtuo)
      if (ctx.request.body.deviceType === 'guangtuo') {
        const body = await this.getFenceBody(ctx, 3)
        await AlarmControl(ctx, body)
        return
      }
      const body = await this.getReqBody(ctx)
      await alarmPass(ctx, body)
    } catch (error) {
      throw error
    }
  }
  /**
   * 获取设备的布撤防状态
   * @param {*} ctx
   * @memberof AlarmService
   */
  async getDevAlarmStatus (ctx) {
    try {
      const devInfo = await this.findDeviceById(ctx.query.id, 'ip cport')
      const result = await alarmStatus(ctx, { devIp: devInfo.ip, devPort: devInfo.cport })
      return result
    } catch (error) {
      return ''
    }
  }
  /**
   * 获取通道的布撤防状态
   * @param {*} ctx
   * @memberof AlarmService
   */
  async getResAlarmStatus (ctx) {
    try {
      const devInfo = await this.findDeviceById(ctx.query.eid, 'ip cport')
      const result = await alarmStatus(ctx, { devIp: devInfo.ip, devPort: devInfo.cport })
      return result.channelStatus
    } catch (error) {
      return []
    }
  }
}
module.exports = AlarmService
