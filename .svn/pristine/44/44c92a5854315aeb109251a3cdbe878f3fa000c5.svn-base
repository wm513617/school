/*
 * @Author: lushengying
 * @Date: 2019-08-07 16:49:46
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-31 09:44:51
*/
const { fork, spawn } = require('child_process')
const mongoose = require('mongoose')
const { query } = require('../../../bstar/playback.interface')
// const FaceServer = mongoose.model('FaceServer')
// const Resource = mongoose.model('Resource')
const AlarmEvent = mongoose.model('AlarmEvent')
const tracking = mongoose.model('tracking')
class DownloadTaskController {
  constructor (max = 1, time = 600000) {
    this._process = {} // 子进程 管理
    this.task = {} // 任务
    this.processHash = {} // 任务
    this.max = max// 任务
    this.time = time// 任务
  }
  /**
   * 启动
   * @params {Object} alarmInfo
   */
  async start (alarmInfo, type, info) {
    // type 参数为需要下载打包的类型, paramsInfo为接力追踪中需要的一个query参数
    if (type === 'alarm') { // 如果是案件管理的下载
      alarmInfo._id = alarmInfo.eventCode + ''
    } else if (type === 'tracking') { // 如果是接力追踪的下载
      alarmInfo._id = alarmInfo._id + ''
    }
    this.addTask(alarmInfo)
    this.allocate(alarmInfo, type, info)
    this.foreverRun()
  }

  /**
   * 获取能否进行下载
   */
  getStatus () {
    let sum = _.keys(this.processHash).length
    let isSave = false
    if (sum < this.max) {
      isSave = true
    }
    return isSave
  }

  /**
   * 获取能否进行下载
   */
  deleteDir (path) {
    deleteall(path)
  }

  /**
   * 分配资源并启动子进程
   * @param {*} resources
   */

  allocate (alarmInfo, type, info) {
    let sum = _.keys(this.processHash).length
    if (sum < this.max) {
      for (let resourceId in this.task) {
        if (!_.get(this.processHash, `[${resourceId}]`) && sum <= this.max) {
          this.dispatchProcess(resourceId, alarmInfo, type, info)
          sum++
        }
      }
    }
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
        delete this.processHash[_.findKey(this.processHash, item => item === pid)]
        this.restart(pid)
      }
    }
  }

  // /**
  //  * 检查子进程状态是否运行，如果出现异常重启子进程
  //  */
  // run () {
  //   for (let pid of Object.keys(this._process)) {
  //     pid = Number(pid)
  //     if (this._process[pid].process.eixt) {
  //       console.log('[pid] exit')
  //       delete this._process[pid]
  //       delete this.processHash[_.findKey(this.processHash, item => item === pid)]
  //       this.restart(pid)
  //     }
  //   }
  // }

  /**
   * 重启进程，进程因为异常情况出现错误或者退出后，重启进程
   * @param {*} pid 进程id
   */
  restart (pid) {
    this.allocate()
    // for (const resourceId of Object.keys(this._resourceHash)) {
    //   if (this._resourceHash[resourceId] === pid) {
    //     resourceIds.push(resourceId)
    //   }
    // }
    // this.dispatchProcess(resourceIds)
  }

  /**
   * 调度启动子进程
   * @param {*} resources 子进程使用的资源
   */
  dispatchProcess (resources, alarmInfo, type, info) {
    // alarmInfo.caseType = type
    // alarmInfo.paramsInfo = paramsInfo
    try {
      // let workerProcess = fork(path.join(__dirname, './taskProcess.js'), { execArgv: ['--inspect=35656'] }, { env: { NODE_ENV: process.env.NODE_ENV } })
      let workerProcess = fork(path.join(__dirname, './taskProcess.js'), { env: { NODE_ENV: process.env.NODE_ENV } })
      // workerProcess.send({alarmInfo: alarmInfo, type: type, paramsInfo: paramsInfo})
      workerProcess
        .on('error', error => {
          workerProcess.eixt = true
          const resources = _.findKey(this.processHash, item => item === workerProcess.pid)
          saveError(resources, _.get(this.task[resources], 'backupType'))
          if (this._process[workerProcess.pid]) {
            delete this._process[workerProcess.pid]
          }
          if (this.processHash[_.findKey(this.processHash, item => item === workerProcess.pid)]) {
            delete this.processHash[_.findKey(this.processHash, item => item === workerProcess.pid)]
          }
          if (this.task[resources]) {
            delete this.task[resources]
          }
        })
        .on('exit', (code, signal) => {
          workerProcess.eixt = true
          const resources = _.findKey(this.processHash, item => item === workerProcess.pid)
          if (this._process[workerProcess.pid]) {
            delete this._process[workerProcess.pid]
          }
          if (this.processHash[_.findKey(this.processHash, item => item === workerProcess.pid)]) {
            delete this.processHash[_.findKey(this.processHash, item => item === workerProcess.pid)]
          }
          if (this.task[resources]) {
            delete this.task[resources]
          }
        })
        .on('message', message => {
          console.log('---------------------------进程结束，下载完成')
          this._handleMessage(message)
        })
      workerProcess.eixt = false
      this._process[workerProcess.pid] = { process: workerProcess }
      this.processHash[resources] = workerProcess.pid
      this.notifyProcessCreate(workerProcess.pid, resources, type, info)
    } catch (error) {
      console.log(error)
    }
  }
  // 处理子进程消息
  async _handleMessage (message) {
    try {
      // await AlarmEvent.updateMany({'eventCode': alarmInfo._id}, {'isSave': 2})
    } catch (err) {
      console.log('err', err)
    }
    switch (message.type) {
      case 'complete':
        complete(message)
        break
      default:
        console.log('unhandle message', message)
    }
  }

  /**
   * 主进程通知子进程创建
   * @param {*} pid  子进程id
   * @param {*} data 消息
   */
  notifyProcessCreate (pid, resources, type, info) {
    try {
      this._process[pid].process.send({ type: 'create', resources: this.task[resources], zipType: type, info: info })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * 获取录像下载地址
   */
  async recordQuery (dev, ctx) {
    const list = await Promise.all(dev.map(item => {
      query(item, ctx)
    }))
  }

  /**
   * 添加任务列表,如果已存在则退出
   * @param {*} alarm 案件
   */
  addTask (alarm) {
    const pid = _.get(this.processHash, `[${alarm._id}]`, false)
    if (pid) {
      this._process[pid].process.send({ type: 'exit' })
      delete this._process[pid]
      delete this.processHash[alarm._id]
    }
    this.task[alarm._id] = alarm
  }

  /**
   * 删除任务列表
   * @param {ObjectId} alarmId 案件id
   */
  sbuTask (alarmId) {
    if (this.task[alarmId]) {
      this._process[this.task[alarmId]].process.send({ type: 'exit' })
    }
    delete this.task[alarmId]
  }
}

DownloadTaskController.getClassInstance = function () {
  return new DownloadTaskController()
}

let singleton
module.exports.getSingleton = function () {
  if (!singleton) {
    singleton = DownloadTaskController.getClassInstance()
  }
  return singleton
}

const backupHash = {
  1: AlarmEvent, // 案件更新
  2: tracking // 追踪
}
function complete ({ completeStatus, resourcesId, backupType }) {
  const isSave = completeStatus ? 2 : 3
  console.log('====================修改数据库', resourcesId, isSave)
  if (backupType === 1) {
    backupHash[backupType].updateOne({ 'eventCode': resourcesId }, { 'isSave': isSave }).exec()
  } else {
    backupHash[backupType].updateOne({ _id: resourcesId }, { 'isSave': isSave }).exec()
  }
}

function saveError ({ resourcesId, backupType }) {
  const isSave = 3
  console.log('====================修改数据库', resourcesId, isSave)
  if (backupType === 1) {
    backupHash[backupType].updateOne({ 'eventCode': resourcesId }, { 'isSave': isSave }).exec()
  } else {
    backupHash[backupType].updateOne({ _id: resourcesId }, { 'isSave': isSave }).exec()
  }
}

function deleteall (path) {
  // var files = []
  // if (fs.existsSync(path)) {
  //   files = fs.readdirSync(path)
  //   files.forEach(function (file, index) {
  //     var curPath = path + '/' + file
  //     if (fs.statSync(curPath).isDirectory()) { // recurse
  //       deleteall(curPath)
  //     } else { // delete file
  //       fs.unlinkSync(curPath)
  //       console.log('-==============删除', curPath)
  //     }
  //   })
  //   fs.rmdirSync(path)
  // }
  if (fs.existsSync(path)) {
    let files = fs.readdirSync(path)
    for (let item of files) {
      let curPath = `${path}/${item}`
      fs.unlinkSync(curPath)
    }
    fs.rmdirSync(path)
  }
  if (fs.existsSync(`${path}.zip`)) {
    fs.unlinkSync(`${path}.zip`)
  }
}
