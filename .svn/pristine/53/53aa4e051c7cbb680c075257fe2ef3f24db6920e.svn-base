const { fork } = require('child_process')
const mongoose = require('mongoose')
const FaceServer = mongoose.model('FaceServer')
const Resource = mongoose.model('Resource')
const socket = require('../sdkV3.socket')
const CONSTANT = {
  SERVER: 'server',
  TASK: 'task'
}
const CAPUTURE = ['bsr-iphk', 'bsr-iphaw']
class FaceDispatchTaskController {
  constructor (threshold = 80, time = 5000) {
    this._bindMapper = {}
    this._process = {}
    this._resourceHash = {}
    this._socketStatus = {}
    this.threshold = threshold
    this.time = time
  }
  /**
   * 启动人脸代理
   */
  async start () {
    const resources = await this.collectResource()
    this.allocate(resources)
    this.foreverRun()
  }
  /**
   * 分配资源并启动子进程
   * @param {*} resources
   */
  allocate (resources) {
    const group = _.chunk(resources, this.threshold)
    group.forEach(res => {
      this.dispatchProcess(res)
    })
  }
  /**
   * 服务检查
   */
  foreverRun () {
    this.foreverHandle = setTimeout(() => {
      this.ping()
      this.foreverRun()
    }, this.time)
  }
  /**
   * 检查子进程状态是否运行，如果出现异常重启子进程
   */
  ping () {
    for (let pid of Object.keys(this._process)) {
      pid = Number(pid)
      if (this._process[pid].process.eixt) {
        console.log('[pid] exit')
        delete this._process[pid]
        this.restart(pid)
      }
    }
  }
  /**
   * 重启进程，进程因为异常情况出现错误或者退出后，重启进程
   * @param {*} pid 进程id
   */
  restart (pid) {
    console.log('[pid] restart')
    const resourceIds = []
    for (const resourceId of Object.keys(this._resourceHash)) {
      if (this._resourceHash[resourceId] === pid) {
        resourceIds.push(resourceId)
      }
    }
    this.dispatchProcess(resourceIds)
  }
  getSocketIntance () {
    return this._socketStatus
  }
  // 重启所有子进程
  reset () {
    for (let pid of Object.keys(this._process)) {
      if (!this._process[pid].process.eixt) {
        this._process[pid].process.kill()
      }
    }
  }
  /**
   * 调度启动子进程
   * @param {*} resources 子进程使用的资源
   */
  dispatchProcess (resources) {
    let workerProcess = fork(path.join(__dirname, './taskProcess.js'), { env: { NODE_ENV: process.env.NODE_ENV } })
    // let workerProcess = fork(path.join(__dirname, './taskProcess.js'), { execArgv: ['--inspect=6632'] }, { env: { NODE_ENV: process.env.NODE_ENV } })
    workerProcess
      .on('error', error => {
        console.log('error,', error)
        workerProcess.eixt = true
      })
      .on('exit', (code, signal) => {
        console.log('exit,', code, signal)
        workerProcess.eixt = true
      })
      .on('message', message => {
        this._handleMessage(message)
      })
    workerProcess.eixt = false
    this._process[workerProcess.pid] = { capacity: 0, process: workerProcess }
    this.notifyProcessCreate(workerProcess.pid, resources)
  }
  // 处理子进程消息
  _handleMessage (message) {
    switch (message.type) {
      case 'add':
        socket.veriFaceData(message.data)
        break
      case 'notify':
        socket.veriFaceNotify(message.data)
        break
      case 'run:online':
        this._socketStatus[message.data.id] = true
        break
      case 'run:offline':
        this._socketStatus[message.data.id] = false
        break
      default:
        console.log('unhandle message', message)
    }
  }
  /**
   * 主进程通知子进程断开指定资源连接
   * @param {*} pid  子进程id
   * @param {*} data 消息
   */
  notifyProcessClean (pid, data) {
    this._process[pid].process.send({ type: 'remove', resources: data })
    this._process[pid].capacity -= data.length
    data.forEach(res => {
      delete this._resourceHash[res]
    })
  }
  /**
   * 主进程通知子进程创建指定资源连接
   * @param {*} pid  子进程id
   * @param {*} data 消息
   */
  notifyProcessCreate (pid, data) {
    this._process[pid].process.send({ type: 'create', resources: data })
    this._process[pid].capacity += data.length
    data.forEach(res => {
      this._resourceHash[res] = pid
    })
  }
  /**
   * 获取人脸服务器配置资源
   */
  async collectResource () {
    const faceServers = await FaceServer.find({}).lean()
    // 系统初始化之后，未配置人脸服务器。直接退出
    if (!faceServers.length) {
      return
    }
    let resource = []
    for (const server of faceServers) {
      const res = server.res.map(id => id.toString())
      resource = resource.concat(res)
    }
    return resource
  }
  /**
   * 子进程断开指定的资源
   * @param {array} resources 断开资源
   */
  cleanResource2Process (resources) {
    const disconnect = {}
    for (const resource of resources) {
      if (this._resourceHash[resource]) {
        if (disconnect[this._resourceHash[resource]]) {
          disconnect[this._resourceHash[resource]].push(resource)
        } else {
          disconnect[this._resourceHash[resource]] = [resource]
        }
      }
    }
    for (const pid of Object.keys(disconnect)) {
      this.notifyProcessClean(Number(pid), disconnect[pid])
    }
  }
  /**
   * 子进程连接指定的资源
   * @param {array} resources 连接资源
   */
  addResource2Process (resources) {
    let total = resources.length
    for (let pid of Object.keys(this._process)) {
      pid = Number(pid)
      const margin = this.threshold - this._process[pid].capacity
      if (margin > 0 && total > 0) {
        if (margin > total) {
          total -= total
          this.notifyProcessCreate(pid, resources)
          break
        } else {
          total -= margin
          this.notifyProcessCreate(pid, _.take(resources, margin))
        }
        resources = _.drop(resources, margin)
      }
    }
    if (total > 0) {
      this.allocate(resources)
    }
  }
  /**
   * 前端参数修改后,修改服务连接
   * @param {*} data  配置参数
   */
  async dynamicHandleSocket (data) {
    if (data.type === CONSTANT.SERVER) {
      if (data.removeResources && data.removeResources.length) {
        this.cleanResource2Process(data.removeResources)
      }
      if (data.newResources && data.newResources.length) {
        this.addResource2Process(data.newResources)
      }
    } else if (data.type === CONSTANT.TASK) {
      let resources = await Resource.find({ _id: { $in: data.removeResources } })
        .populate('eid', 'series')
        .lean()
      resources = this.splitResource(resources)
      const resourceIds = resources.stream.map(res => res._id.toString())
      if (resourceIds.length > 0) {
        this.cleanResource2Process(resourceIds)
        this.addResource2Process(resourceIds)
      }
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
}
FaceDispatchTaskController.getClassInstance = function () {
  return new FaceDispatchTaskController()
}

let singleton
module.exports.getSingleton = function () {
  if (!singleton) {
    singleton = FaceDispatchTaskController.getClassInstance()
  }
  return singleton
}
