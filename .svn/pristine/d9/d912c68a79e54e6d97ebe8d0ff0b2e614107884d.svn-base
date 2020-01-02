const net = require('net')
const NetWorker = require('./networker')
const { req } = require('../../../bstar/req')
const { tranformPromiseAll } = require('../../../../common/tools')
const Device = mongoose.model('Device')
const { passVehicleData } = require('./recordSearch.controller')
const Struct = require('python-struct')
const RESOLVE = 'resolve'
const BSPF_PACKET_FRM = 'IBcHIIIIBBBB'
// 协议头结构信息
const BSTP_HEADER = {
  mark: 0xbf9d1fdb,
  type: '0',
  channel: '0',
  device: 0,
  length: 0,
  sequence: 0,
  timestamp: 0,
  tick: 0,
  codec: '',
  resolution: '',
  frameRate: '',
  frameType: ''
}
class Hikon9600Adapter {
  constructor (time = 30000) {
    // 全局tcp实例
    this._tcpInstance = {}
    // 全局tcp链接参数
    this._tcpConnectParams = {}
    // socket连接自检间隔时间
    this.time = time
  }
  /**
   * 启动服务
   */
  async start () {
    const servers = await Device.find({ manufacturer: 'hikvision', type: 'traffic', series: '9600' }).lean()
    if (servers.length) {
      this.reset(servers)
      this.foreverRun()
    }
  }
  /**
   * 定时检查断掉的链接
   */
  foreverRun () {
    this.foreverHandle = setTimeout(() => {
      this.reconnect()
      this.foreverRun()
    }, this.time)
  }
  pack (payload) {
    payload = Buffer.from(payload)
    BSTP_HEADER.length = payload.length
    const bscpHeader = Struct.pack(
      BSPF_PACKET_FRM,
      BSTP_HEADER.mark,
      BSTP_HEADER.type,
      BSTP_HEADER.channel,
      BSTP_HEADER.device,
      BSTP_HEADER.length,
      BSTP_HEADER.sequence,
      BSTP_HEADER.timestamp,
      BSTP_HEADER.tick,
      BSTP_HEADER.codec,
      BSTP_HEADER.resolution,
      BSTP_HEADER.frameRate,
      BSTP_HEADER.frameType
    )
    return Buffer.concat([bscpHeader, payload])
  }
  /**
   * 检查系统配置并创建连接
   */
  async reset (servers) {
    await this.createTcpByResource(servers)
  }
  /**
   * 参数变化后，重置连接
   * @param {*} server
   */
  async paramMutation (server) {
    // 修改配置参数
    if (server._id) {
      this.reomoveTcpById(server._id.toString())
    }
    this.createTcpByResource([server])
  }
  /**
   * 重连已断开的socket
   */
  reconnect () {
    try {
      const tcpRes = []
      for (let id of Object.keys(this._tcpConnectParams)) {
        if (!this._tcpInstance[id]) {
          // console.log('------reconnect重连，!this._tcpInstance[id]:', !this._tcpInstance[id])
          tcpRes.push(this._tcpConnectParams[id])
        } else if (this._tcpInstance[id] && !this._tcpInstance[id].socket.connected) {
          // console.log('------reconnect重连，!this._tcpInstance[id].socket.connected:', !this._tcpInstance[id].socket.connected)
          tcpRes.push(this._tcpConnectParams[id])
        }
      }
      if (tcpRes.length) {
        this.createTcpByResource(tcpRes)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * 资源获取tcp参数及连接tcp常连接
   * @param {array} resources 抓拍机资源
   */
  async createTcpByResource (servers) {
    if (servers.length === 0) {
      return
    }
    await this.assertTcpParams(servers)
    servers.forEach(item => {
      if (item.tsIp && item.tsPort) {
        this.createTcpConnection(this._tcpConnectParams[item._id.toString()])
      }
    })
  }
  /**
   * 清除Tcp链接及参数
   * 参数为字符串清除单个链接
   * @param {string | array} id
   */
  reomoveTcpById (id) {
    try {
      this._tcpInstance[id].socket.destroy()
      delete this._tcpInstance[id]
      delete this._tcpConnectParams[id]
    } catch (error) {
      console.log(error.message)
    }
  }
  /**
   * 断开所有Tcp连接，并清理连接参数
   * @param {array | null} ids
   */
  cleanTcp (ids = []) {
    clearTimeout(this.foreverHandle)
    if (ids.length > 0) {
      ids.forEach(id => {
        if (this._tcpInstance[id]) {
          this.reomoveTcpById(id)
        }
      })
    } else {
      for (let id of Object.keys(this._tcpInstance)) {
        this.reomoveTcpById(id)
      }
    }
  }
  /**
   * 装配远程tcp地址
   * @param {array} servers 服务配置
   */
  async assertTcpParams (servers) {
    let resAddress = []
    for (const server of servers) {
      resAddress.push(
        req({
          url: '/api/ctl/picopen',
          method: 'POST',
          body: {
            devIp: server.ip,
            devPort: server.cport,
            channel: 1,
            streamType: 'pic'
          }
        })
      )
    }
    resAddress = tranformPromiseAll(resAddress)
    const tcpAddress = await Promise.all(resAddress)
    servers.forEach((server, index) => {
      if (tcpAddress[index].status === RESOLVE) {
        server.tsIp = tcpAddress[index].data.tsIp || ''
        server.tsPort = tcpAddress[index].data.tsPort || ''
        this._tcpConnectParams[server._id.toString()] = server
      } else {
        // console.log('------请求pythonDa失败，url:/api/ctl/picopen,method:post,失败原因：', tcpAddress[index].message)
        this._tcpConnectParams[server._id.toString()] = server
      }
    })
  }
  /**
   *
   * @param {*} server 服务器配置
   */
  createTcpConnection (server) {
    try {
      const instance = this._tcpInstance[server._id] || {}
      let receiver = { image: { sequence: '', data: '' }, info: { sequence: '', data: '' } }
      const socket = net
        .createConnection({ port: server.tsPort, host: server.tsIp })
        .on('connect', () => {
          console.log('------和TS服务连接成功')
          socket.connected = true
          const payload = {
            devIp: server.ip,
            devPort: server.cport,
            channel: 1,
            streamType: 'pic'
          }
          const params = this.pack(JSON.stringify(payload))
          socket.write(params)
          const networker = new NetWorker(socket, (data, header) => {
            if (header.type === 101 && header.format === '2') {
              receiver.image.data = data
              receiver.image.sequence = header.sequence
            } else if (header.type === 6) {
              receiver.info.data = JSON.parse(data.toString())
              receiver.info.sequence = header.sequence
            }
            if (receiver.image.data && receiver.info.data && receiver.info.sequence === receiver.image.sequence) {
              // console.log('------收到海康9600过车数据')
              passVehicleData(receiver.image.data, receiver.info.data)
              receiver = { image: { sequence: '', data: '' }, info: { sequence: '', data: '' } }
            }
          })
          networker.init()
        })
        .on('close', () => {
          socket.connected = false
          console.log('------tcp close')
        })
        .on('error', err => {
          console.log('------tcp error')
          console.log(err.message)
          socket.connected = false
        })
        .on('timeout', err => {
          console.log('------tcp timeout')
          console.log(err.message)
          socket.connected = false
        })
      socket.setKeepAlive(true, 15000)
      instance.socket = socket
      this._tcpInstance[server._id] = instance
    } catch (error) {
      console.log(error)
    }
  }
}
const singleton = new Hikon9600Adapter()

module.exports.getHikon9600Singleton = function () {
  return singleton
}
