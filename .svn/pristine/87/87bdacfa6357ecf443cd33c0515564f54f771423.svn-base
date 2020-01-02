/**
 * 定时任务
 */

'use strict'
const schedule = require('node-schedule')
const randomString = require('randomstring')
const _ = require('lodash')
const scheduleList = []
/**
 * params: plans
 * type: Array{object} | object
 * struct:
 *    {
 *      rule: string|object
 *      opartion: function
 *    }
 *  rule refer:
 *  cron-like: '* * * * * *' second(0-59) minute(0-59) hour(0-23) day(1-31) month(1-12) day of week(0-7)
 *  not-cron-like:{second:x ,minute: x, hour: x, day: x, month: x, dayofweek: x}
 */
exports.addSchedule = function (plans) {
  const ids = []
  if (_.isArray(plans)) {
    for (const item of plans) {
      const id = randomString.generate()
      scheduleList.push({
        id,
        handle: schedule.scheduleJob(item.rule, item.operation)
      })
      ids.push(id)
    }
    return ids
  } else if (_.isObject(plans)) {
    const id = randomString.generate()
    scheduleList.push({
      id,
      handle: schedule.scheduleJob(plans.rule, plans.operation)
    })
    return id
  } else {
    return false
  }
}
exports.cancleSchedule = function (id) {
  if (_.isString(id)) {
    return scheduleList.some((item) => {
      if (item.id === id) {
        item.handle.cancle()
        return true
      }
    })
  }
}
