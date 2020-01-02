const _ = require('lodash')
const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
const RtspServer = mongoose.model('RtspServer')
class Rtsp {
  constructor () {
    this._init()
  }
  _init () {
    const _this = this
    RtspServer.findOne({}, 'rtspcount', (err, rtspServer) => {
      if (err) { console.log(err) }
      // if (_.isEmpty(rtspServer)) return
      Resource.find({ type: 0 }, 'rtsp.main', (err, docs) => {
        if (err) { console.log(err) }
        docs = _.map(docs, 'rtsp.main')
        const usedIds = [] // 已经使用的rtsp id标识
        let tmp = null
        docs.forEach(item => {
          if (item && item.indexOf('=') !== -1) {
            tmp = item.split('=').pop()
            usedIds.indexOf(parseInt(tmp)) === -1 && usedIds.push(parseInt(tmp))
          }
        })
        // let unusedIds = _.fill(Array(rtspServer.rtspcount), 0) // 可以使用的rtsp id标识
        let unusedIds = _.fill(Array(10000), 0) // 可以使用的rtsp id标识
        unusedIds.forEach((item, index) => {
          unusedIds[index] = ++index
        })
        unusedIds = _.sortBy(_.remove(unusedIds, n => {
          return usedIds.indexOf(n) === -1
        }), n => {
          return n
        })
        _this.unusedIds = unusedIds
      })
    })
  }
  getUnusedIds () {
    return this.unusedIds.shift()
  }
  setUnusedIds (id) {
    if (this.unusedIds.indexOf(id) === -1) { this.unusedIds.push(id) }
    this.unusedIds = _.sortBy(this.unusedIds, n => {
      return n
    })
  }
}

module.exports = Rtsp
