const postal = require('postal')
const Storage = require('mongoose').model('Storage')
const Record = require('mongoose').model('Record')
const Snapshot = require('mongoose').model('Snapshot')
const notice = require('../../bstar/video.interface')
const Transication = require('mongoose').model('Transication')

// 订阅资源删除信息，删除对应的配置(单个)
postal.subscribe({
  channel: 'resources',
  topic: 'item.delete',
  callback: async function (data, envelope) {
    const id = data.id
    try {
      await Promise.all([
        Storage.findOneAndRemove({ resource: id }),
        Record.findOneAndRemove({ resource: id }),
        Snapshot.findOneAndRemove({ resource: id })
      ])
      Promise.all([
        notice.info(data.ctx, { module: 'recordcfg', newData: [], varyData: [] }),
        notice.info(data.ctx, { module: 'plantimerecord', newData: [], varyData: [] }),
        notice.info(data.ctx, { module: 'planeventrecord', newData: [], varyData: [] })
      ]).catch(err => {
        console.log({ code: 4106, message: 'bstar资源配置通知接口异常' }, err)
      })
    } catch (err) {
      Transication.create({
        module: '录像管理',
        method: '删除',
        data: JSON.stringify(id),
        table: 'Storage|Record|',
        function: 'findOneAndRemove'
      })
      console.log(err)
    }
  }
})
// 订阅资源删除信息，删除对应的配置(多个)
postal.subscribe({
  channel: 'resources',
  topic: 'array.delete',
  callback: async function (data, envelope) {
    const ids = data.ids
    console.log('录像管理中同步删除的配置资源', ids)
    try {
      await Promise.all([
        Storage.remove({ resource: { $in: ids } }),
        Record.remove({ resource: { $in: ids } }),
        Snapshot.remove({ resource: { $in: ids } })
      ])
      Promise.all([
        notice.info(data.ctx, { module: 'recordcfg', newData: [], varyData: [] }),
        notice.info(data.ctx, { module: 'plantimerecord', newData: [], varyData: [] }),
        notice.info(data.ctx, { module: 'planeventrecord', newData: [], varyData: [] })
      ]).catch(err => {
        console.log({ code: 4106, message: 'bstar资源配置通知接口异常' }, err.message)
      })
    } catch (err) {
      Transication.create({
        module: '录像管理',
        method: '删除',
        data: JSON.stringify(ids),
        table: 'Storage|Record|',
        function: 'findOneAndRemove'
      })
      console.log(err)
    }
  }
})
