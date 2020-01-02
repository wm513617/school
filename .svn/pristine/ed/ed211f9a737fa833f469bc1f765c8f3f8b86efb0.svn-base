/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:24:14
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-08 19:12:54
 */
const mongoose = require('mongoose')
const FaceServer = mongoose.model('FaceServer')
const FaceParameter = mongoose.model('FaceParameter')
const DefenseTask = mongoose.model('DefenseTask')
const Resource = mongoose.model('Resource')
const WebSocket = require('ws')
const url = require('url')
const queryString = require('querystring')
const rq = require('../../bstar/req')
const net = require('net')
const moment = require('moment')
const config = require('../../../../config').backend
const Struct = require('python-struct')
const NetWorker = require('./networkReceiver')
const { tranformPromiseAll } = require('../../../common/tools')
const plant = require('./faceProcessingPlant')
const _ = require('lodash')

const CONSTANT = {
  RUN: 'run',
  STOP: 'stop',
  SERVER: 'server',
  TASK: 'task',
  RESOLVE: 'resolve',
  REJECT: 'reject'
}

const CAPUTURE = ['bsr-iphk', 'bsr-iphaw']

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

/**
 * 人像抓拍SDK-V3版本适配类
 * 提供socket接口分析参数、链接、数据收取功能
 *
 */
exports.SDKFaceV3Adapter = class SDKFaceV3Adapter {
  constructor (time = 30000) {
    // 全局socket实例
    this._socketInstance = {}
    // 全局tcp实例
    this._tcpInstance = {}
    // 全局socket链接参数
    this._connectParams = {}
    // 全局tcp链接参数
    this._tcpConnectParams = {}
    // socket连接自检间隔时间
    this.time = time
    // SDK服务运行状态
    this.status = CONSTANT.STOP
    // SDK服务器组
    this.server = []
  }
  /**
   * 启动SDK服务
   */
  run (resource) {
    if (this.status !== CONSTANT.RUN) {
      this.status = CONSTANT.RUN
      this.reset(resource)
      this.foreverRun()
    }
  }
  /**
   * 停止SDK服务
   */
  stop () {
    if (this.status !== CONSTANT.STOP) {
      this.cleanSocket()
      this.cleanTcp()
      clearTimeout(this.foreverHandle)
      this.status = CONSTANT.STOP
    }
  }
  /**
   * 定时检查断掉的链接
   */
  foreverRun () {
    this.foreverHandle = setTimeout(() => {
      this.ping()
      this.reconnect()
      this.foreverRun()
    }, this.time)
  }
  /**
   * 重连已断开的socket
   */
  reconnect () {
    try {
      for (let id in this._socketInstance) {
        if (!this._socketInstance[id].websockt.connected) {
          this.createWSConnection(this._connectParams[id])
        }
      }
      const tcpRes = []
      for (let id in this._tcpConnectParams) {
        if (!this._tcpInstance[id] || !this._tcpInstance[id].socket.connected) {
          tcpRes.push(this._tcpConnectParams[id])
        }
      }
      this.createTcpByResource(tcpRes)
    } catch (error) {
      console.log(error.message)
    }
  }
  /**
   * 通过ws ping协议测试socket实例是否断开
   */
  ping () {
    try {
      for (let id in this._socketInstance) {
        if (this._socketInstance[id].websockt.connected) {
          this._socketInstance[id].websockt.ping()
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  /**
   * 清除socket链接及参数
   * 参数为字符串清除单个链接
   * @param {string | array} id
   */
  reomoveWebsocketById (id) {
    try {
      this._socketInstance[id].websockt.terminate()
      delete this._socketInstance[id]
      delete this._connectParams[id]
    } catch (error) {
      console.log(error.message)
    }
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
   * 断开所有websocket连接，并清理连接参数
   * @param {array | null} ids
   */
  cleanSocket (ids = []) {
    if (ids.length > 0) {
      ids.forEach(id => {
        if (this._socketInstance[id]) {
          this.reomoveWebsocketById(id)
        }
      })
    } else {
      for (let id of Object.keys(this._socketInstance)) {
        this.reomoveWebsocketById(id)
      }
    }
  }
  /**
   * 断开所有Tcp连接，并清理连接参数
   * @param {array | null} ids
   */
  cleanTcp (ids = []) {
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
   * 全局所有链接重置
   */
  async reset (config) {
    // 断开所有的socket链接
    this.cleanSocket()
    // 断开所有的tcp链接
    this.cleanTcp()

    await this.reconfig(config)
    // await this.resourceWrapper()
  }
  /**
   * 资源部包装并创建连接
   * @param {*} resourceIds 待创建连接的资源
   */
  async resourceWrapper (resourceIds) {
    const faceServers = await FaceServer.find()
      .populate({
        path: 'res',
        populate: { path: 'eid', select: 'series' }
      })
      .lean()
    // 获取服务器中分配的视频通道，并配置rtsp地址及socket目标地址
    let [streamRes, captureRes] = [[], []]
    for (let server of faceServers) {
      const bindResource = []
      let resource
      for (const id of resourceIds) {
        resource = _.find(server.res, res => res._id.toString() === id)
        if (resource) {
          bindResource.push(resource)
        }
      }
      let resourceSet = this.splitResource(bindResource)
      if (resourceSet.stream.length > 0) {
        const resources = this.adjustResProperty(resourceSet.stream, server)
        streamRes = streamRes.concat(resources)
      }
      if (resourceSet.capture.length > 0) {
        const resources = this.adjustResProperty(resourceSet.capture, server, 'capture')
        captureRes = captureRes.concat(resources)
      }
    }
    // 视频通道配置连接参数，并开启socket链接
    await this.createWebsocketByResource(streamRes)
    // 抓拍机配置tcp连接
    await this.createTcpByResource(captureRes)
  }
  /**
   * 由资源参数确定链接
   * @param {array} resources 资源
   */
  async createWebsocketByResource (resources) {
    await this.assertWebsocktParams(resources)
    resources.forEach(item => {
      this.createWSConnection(this._connectParams[item._id.toString()])
    })
  }
  /**
   * 使用高级配置参数及布控管理抓拍配置对应的视频通道参数
   * @param {array} resources 服务器中分配的视频通道
   */
  async assertWebsocktParams (resources) {
    try {
      const now = moment().unix()
      const [faceParameter, defenseTasks] = await Promise.all([
        FaceParameter.findOne().lean(),
        DefenseTask.find().lean()
      ])
      // 系统默认的配置参数
      const cameraCfg = config.veriface.cameraCfg
      const defaultCameraCfg = {
        threshold: `${cameraCfg.roll},${cameraCfg.yaw},${cameraCfg.pitch},${cameraCfg.ambiguity}`,
        facemin: cameraCfg.pixel,
        interval: cameraCfg.interval
        // group: passerGroupId
      }
      resources.forEach(res => {
        const query = {
          analyze: true,
          crop: faceParameter ? faceParameter.pattern : 'face',
          url: res.rtsp[res.stream]
            .replace('ip', res.rtspIp)
            .replace('port', '554')
            .replace(/'/g, '')
            .replace('rtsp', 'rtspt')
        }
        Object.assign(query, defaultCameraCfg)
        // 视频通道如果在布控是使用，则使用布控管理中的链接参数，否则只是用默认参数
        for (const task of defenseTasks) {
          if (task.vaild) {
            if (task.always || (now >= task.startTime && now <= task.endTime)) {
              if (task.points.map(item => item + '').includes(res._id + '')) {
                query.threshold = `${task.cameraCfg.roll},${task.cameraCfg.yaw},${task.cameraCfg.pitch},${task.cameraCfg.ambiguity}`
                if (task.groups) {
                  query.group = task.groups.map(item => item + '').join(',')
                }
                query.facemin = task.cameraCfg.pixel
                query.interval = task.cameraCfg.interval
                break
              }
            }
          }
        }
        res.verifaceUrl = `${res.serverUrl}/video?${queryString.stringify(query)}` // eslint-disable-line
        this._connectParams[res._id.toString()] = res
      })
    } catch (error) {
      console.log(error)
    }
  }
  /**
   * 根据链接参数，创建socket实例
   * @param {object} 资源通道信息
   */
  createWSConnection (resource) {
    const instance = this._socketInstance[resource._id.toString()] || {}
    try {
      const websockt = new WebSocket(resource.verifaceUrl || '')
      websockt.on('message', async function (data) {
        const address = {
          ip: url.parse(websockt.url).hostname,
          port: url.parse(websockt.url).port
        }
        await plant.streamIdntify(data, resource, address)
      })
      websockt.on('open', function () {
        websockt.connected = true
        process.send({ type: 'run:online', data: { id: resource._id.toString() } })
      })
      websockt.on('error', function (error) {
        websockt.connected = false
        process.send({ type: 'run:offline', data: { id: resource._id.toString() } })
        console.error('%s error', resource._id.toString(), error.message)
      })
      websockt.on('close', function (error) {
        websockt.connected = false
        process.send({ type: 'run:offline', data: { id: resource._id.toString() } })
        console.error('%s close', resource._id.toString(), error.message)
      })
      instance.websockt = websockt
      this._socketInstance[resource._id.toString()] = instance
    } catch (error) {
      console.warn('SDKsocketErr:', error.message)
    }
  }
  /**
   * 抓拍机资源获取tcp参数及连接tcp常连接
   * @param {array} resources 抓拍机资源
   */
  async createTcpByResource (resources) {
    if (resources.length === 0) {
      return
    }
    await this.assertTcpParams(resources)
    resources.forEach(item => {
      if (item.tsIp && item.tsPort) {
        this.createTcpConnection(this._tcpConnectParams[item._id.toString()])
      } else {
        console.log('%s 获取 tsIp & tsPort 失败', item.name)
      }
    })
  }
  /**
   * 装配抓拍机远程tcp地址
   * @param {array} resources 抓拍机资源
   */
  async assertTcpParams (resources) {
    let resAddress = []
    for (const resource of resources) {
      resAddress.push(
        rq
          .req({
            url: '/api/ctl/picopen',
            method: 'POST',
            body: {
              devIp: resource.ip,
              devPort: resource.port,
              channel: resource.chan,
              streamType: 'pic'
            }
          })
          .catch(err => console.log(err.message))
      )
    }
    resAddress = tranformPromiseAll(resAddress)
    const tcpAddress = await Promise.all(resAddress)
    resources.forEach((res, index) => {
      if (tcpAddress[index].status === CONSTANT.RESOLVE) {
        res.tsIp = _.get(tcpAddress[index].data, 'tsIp')
        res.tsPort = _.get(tcpAddress[index].data, 'tsPort')
        this._tcpConnectParams[res._id.toString()] = res
      } else {
        this._tcpConnectParams[res._id.toString()] = res
      }
    })
  }
  /**
   * 创建抓拍机资源的tcp长连接,并处理获取的图片
   * @param {object} resource 抓拍机资源
   */
  async createTcpConnection (resource) {
    const resourceId = resource._id.toString()
    const instance = this._tcpInstance[resourceId] || {}
    const tcpParms = this._tcpConnectParams[resourceId]
    tcpParms.round = { full: { image: '', sequence: '' }, face: { image: '', sequence: '' } }
    const socket = net
      .createConnection({ port: resource.tsPort, host: resource.tsIp })
      .on('connect', () => {
        socket.connected = true
        process.send({ type: 'run:online', data: { id: resourceId } })
        const payload = {
          devIp: resource.ip,
          devPort: resource.port,
          channel: resource.chan,
          streamType: 'pic'
        }
        const params = this.pack(JSON.stringify(payload))
        socket.write(params)
        const networker = new NetWorker(socket, (data, extraInfo) => {
          if (extraInfo.format === 0) {
            tcpParms.round.full.image = data
            tcpParms.round.full.sequence = extraInfo.sequence
          } else {
            tcpParms.round.face.image = data
            tcpParms.round.face.sequence = extraInfo.sequence
          }
          if (
            tcpParms.round.face.image &&
            tcpParms.round.full.image &&
            tcpParms.round.face.sequence === tcpParms.round.full.sequence
          ) {
            plant.captureIdentify(tcpParms.round.full.image, tcpParms.round.face.image, resource)
            tcpParms.round = { full: { image: '', sequence: '' }, face: { image: '', sequence: '' } }
          }
        })
        networker.init()
      })
      .on('close', () => {
        socket.connected = false
        process.send({ type: 'run:offline', data: { id: resourceId } })
        console.error('%s close', this._tcpConnectParams[resourceId].name)
      })
      .on('error', err => {
        socket.connected = false
        process.send({ type: 'run:offline', data: { id: resourceId } })
        console.error('%s error', this._tcpConnectParams[resourceId].name, err.message)
      })
      .on('timeout', () => {
        socket.connected = false
        process.send({ type: 'run:offline', data: { id: resourceId } })
        console.error('%s timeout', this._tcpConnectParams[resourceId].name)
      })
    socket.setKeepAlive(true, 15000)
    instance.socket = socket
    this._tcpInstance[resourceId] = instance
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
   * 配置资源连接
   * @param {*} data  配置参数
   */
  async reconfig (data) {
    if (data.resources.length === 0) {
      return
    }
    if (data.type === 'create') {
      await this.resourceWrapper(data.resources)
    } else if (data.type === 'remove') {
      // 断开已经连接的socket
      let resources = await Resource.find({ _id: { $in: data.resources } })
        .populate('eid', 'series')
        .lean()
      let resource = this.splitResource(resources)
      resource.capture.length > 0 && this.cleanTcp(resource.capture.map(item => item._id.toString()))
      resource.stream.length > 0 && this.cleanSocket(resource.stream.map(item => item._id.toString()))
    }
  }

  /**
   * 区分资源资源类型
   * @param {array} resources
   */
  splitResource (resources) {
    const res = { capture: [], stream: [] }
    resources.map(resource => {
      if (resource.eid && resource.eid.series && CAPUTURE.includes(resource.eid.series.toLowerCase())) {
        res.capture.push(resource)
      } else {
        res.stream.push(resource)
      }
    })
    return res
  }
  /**
   * 资源增加服务属性，用户socket建立映射到不同人脸服务器
   * @param {array} resIds 视频通道id
   * @param {object} server 服务器配置
   */
  adjustResProperty (resources, server, mode = 'stream') {
    resources = resources.map(item => {
      if (mode === 'stream') {
        item.serverUrl = `ws://${server.ip}:${server.port}`
        item.rtspIp = server.rtspIp
        return item
      } else {
        item.serverIp = server.ip
        item.serverPort = server.port
        return item
      }
    })
    return resources
  }
}
