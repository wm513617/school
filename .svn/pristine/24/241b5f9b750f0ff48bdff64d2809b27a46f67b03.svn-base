/*
 * 资源相关订阅
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:57:26
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-06-26 14:09:31
 */
'use strict'
const postal = require('postal')
const { delChans, delAlarmInputs, delAlarmOutputs, delIntelligenceAlarms } = require('../../bstar/dev.interface')

// 视频通道、报警输入、报警输出删除订阅
postal.subscribe({
  channel: 'resources',
  topic: 'item.delete',
  callback: async function (data, envelope) {
    if (data && data.isreal && data.id) { // 真实删除（调用北京接口）
      await Promise.all([
        delChans({ chanIds: [data.id], ctx: data.ctx }), delAlarmInputs({ chanId: data.id, ctx: data.ctx }), delAlarmOutputs({ chanId: data.id, ctx: data.ctx })
      ])
    }
  }
})

// 智能报警、监控点报警删除订阅
postal.subscribe({
  channel: 'resources',
  topic: 'intelligencealarm.delete',
  callback: async function (data, envelope) {
    if (data && data.ids) {
      await delIntelligenceAlarms({ chanIds: data.ids, ctx: data.ctx })
    }
  }
})
