/*
 * 视频的最底层方法 --调的插件的方法
 */
// import {
//   extend
// } from 'jquery'
import {
  AV_STREAM_START,
  AV_RECORD_LIST,
  AV_NVRRECORD_OPEN,
  getDownID,
  GB_AV_NVRRECORD_OPEN
} from 'http/video.api'

const common = {
  setVolume(plugin, vol) {
    return plugin.SetPlayerVolume(vol)
  },
  getVolume(plugin) {
    let result = plugin.GetPlayerVolume()
    result = JSON.parse(result)
    return result
  },
  getPicture(plugin, param) {
    return plugin.GetPlayerPicture(param.path, param.type)
  },
  boost(plugin) {
    return plugin.SetPlayLocalBoost()
  },
  fullScreen(plugin, isFull) {
    if (isFull) {
      return plugin.SetPlayFullScreen()
    } else {
      return plugin.SetPlayNormalScreen()
    }
  },
  getCapture(plugin, param) {
    return plugin && plugin.GetRealPicturebyBase64(param.type, param.quality)
  },
  openSound(plugin) {
    return plugin.OpenPlayerSound()
  },
  closeSound(plugin) {
    return plugin.StopPlayerSound()
  },
  setScale(plugin, type) {
    return plugin.SetPlayStretchBlt(type.w, type.h, type.auto)
  },
  getFileBrowser(plugin, param) {
    return plugin.GetFileBrowser(param.type, param.defaultName, param.file)
  },
  getFileBrowserEx(plugin, param) {
    return plugin.GetFileBrowserEx(param.type, param.defaultName, param.file, param.callback)
  },
  getDir(plugin) {
    return plugin.GetFileDirectory('请选择文件')
  },
  setTipsText(plugin, text) {
    return plugin.SetStreamPlayerToolString('IP:' + text)
  }
}

window.serverId = {}

// 预览
const previewPlugin = {
  name: 'preview',
  _openStream(param) {
    return AV_STREAM_START(param)
  },
  async open(plugin, param) {
    let suc
    let pluginParam = {}
    try {
      if (param.gbDevId) {
        let id = ''
        if (window.serverId[param.shareServer]) {
          id = window.serverId[param.shareServer]
        } else {
          const res = await getDownID(param.shareServer)
          id = res.data
          window.serverId[param.shareServer] = res.data
        }
        param.gbPlaNvrId = id.serverId
        param.gbPlaDevIp = id.ip
        param.gbPlaDevPort = id.port
        suc = await this._openStream(param)
        pluginParam.gbPlaDevIp = param.gbPlaDevIp
        pluginParam.gbPlaDevPort = param.gbPlaDevPort
        pluginParam.gbDevId = param.gbDevId
        pluginParam.gbPlaNvrId = param.gbPlaNvrId
      } else {
        suc = await this._openStream(param)
        pluginParam = {
          streamType: param.streamType || 'main',
          devIp: param.ip,
          // vendor: param.vendor,
          channel: param.channel,
          devPort: param.port + ''
        }
      }
    } catch (e) {
      return {
        open: false,
        state: null
      }
    }
    // const pluginParam = JSON.stringify({
    //   streamType: param.streamType,
    //   vendor: param.vendor,
    //   session: '11',
    //   ip: param.ip,
    //   channel: param.channel,
    //   port: param.port + ''
    // })
    pluginParam = JSON.stringify(pluginParam)
    const state = plugin.OpenRealStreamEx(
      JSON.stringify({
        port: suc.data.tsPort + '',
        ip: suc.data.tsIp,
        cmdStr: pluginParam
      })
    )
    return {
      open: true,
      state: state
    }
  },
  stop(plugin) {
    plugin.CloseRealSaveAs()
    plugin.StopSpeech()
    return plugin.CloseRealStream()
  },
  getPlayTime(plugin) {
    return plugin.GetPlayerCurTime()
  },
  openRecording(plugin, param) {
    return plugin.RealStartSaveAs(param.path, param.type, param.mode)
  },
  isRecording(plugin) {
    let result = plugin.RealIsSaving()
    if (result) {
      result = JSON.parse(result)
    }
    return result
  },
  closeRecording(plugin) {
    return plugin.CloseRealSaveAs()
  },
  openSpeech(plugin, param) {
    return plugin.OpenSpeech(param.ip, param.port, param.id, param.session)
  },
  startSpeech(plugin) {
    return plugin.StartSpeech(false)
  },
  stopSpeech(plugin) {
    return plugin.StopSpeech()
  },
  closeSpeech(plugin) {
    return plugin.CloseSpeech()
  },
  // 开启对讲或者设备广播
  openSpeechEx(plugin, param) {
    if (typeof param === 'object') {
      param = JSON.stringify(param)
    }
    return plugin.OpenSpeechEx(param)
  },
  // 修改图像调节
  async SetPlayerPicParam(plugin, param) {
    // console.log(plugin)
    // console.log(param)
    // const a = { 'Brightness': '1', 'Chroma': '1', 'Contrast': '1', 'Saturation': '1' }
    // console.log(plugin.SetPlayerPicParam(JSON.stringify(a)))
    return plugin.SetPlayerPicParam(param)
  },
  // 获取图像调节
  async GetPlayerPicParam(plugin, param) {
    plugin.SetPlayerPicEnable(true) // 暂时先注释掉
    return plugin.GetPlayerPicParam(JSON.stringify(param))
  },
  ...common
}
// extend(previewPlugin, common)

// 回放
const recordPlugin = {
  name: 'record',
  // open(plugin, param) {
  //   if (typeof param === 'object') {
  //     param = JSON.stringify(param)
  //   }
  //   return plugin.OpenRecordPlayerEx(param)
  // },
  // 开始播放录像
  async open(plugin, param) {
    const obj = {}
    obj.eventList = {}
    obj.eventList.timeInfo = {}
    obj.eventList.strmInfo = {}
    obj.eventList.timeInfo.startTime = param.startTime
    obj.eventList.timeInfo.endTime = param.endTime ? param.endTime : Date.parse(new Date()) / 1000
    obj.eventList.strmInfo = param.strmInfo
    const cmd = {
      params: {
        jsonrpc: '2.0',
        id: '1',
        method: 'brest',
        call: 'AV.Record.playopen',
        args: obj
      }
    }
    let param1 = {
      ip: param.dsIp + '',
      // port: res.data.result.dsPort + '',
      port: 9000 + '',
      beginTime: param.startTime + '',
      endTime: (param.endTime ? param.endTime : Date.parse(new Date()) / 1000) + '',
      cmdStr: JSON.stringify(cmd)
    }
    param1 = JSON.stringify(param1)
    return {
      open: true,
      state: plugin.OpenRecordPlayerEx(param1)
    }
  },
  recordOpen(plugin, param) {
    AV_RECORD_LIST({
      devIp: param.devIp,
      // devIp: param.devIp,
      channel: param.channel,
      devPort: param.devPort,
      streamType: param.streamType ? param.streamType : 'all',
      eventType: param.eventType ? param.eventType : ['all'],
      typeName: '',
      typeContent: '',
      startTime: param.startTime,
      endTime: param.endTime,
      rows: 50,
      page: 1
    })
      .then(res => {
        const obj = {}
        obj.eventList = {}
        obj.eventList.timeInfo = {}
        obj.eventList.strmInfo = {}
        obj.eventList.timeInfo.startTime = res.data.result.eventList[0].evtTblInfo.startTime
        obj.eventList.timeInfo.endTime = Date.parse(new Date()) / 1000
        // obj.eventList.timeInfo.endTime = res.data.result.eventList[0].evtTblInfo.endTime
        obj.eventList.strmInfo = res.data.result.eventList[0].strmInfo
        let params = {
          ip: res.data.result.dsIp + '',
          // port: res.data.result.dsPort + '',
          port: 9000 + '',
          beginTime: res.data.result.eventList[0].evtTblInfo.startTime + '',
          endTime: Date.parse(new Date()) / 1000 + '',
          cmdStr: JSON.stringify({
            params: {
              jsonrpc: '2.0',
              id: '1',
              method: 'brest',
              call: 'AV.Record.playopen',
              args: obj
            }
          })
        }
        params = JSON.stringify(params)
        return plugin.OpenRecordPlayerEx(params)
      })
      .catch(error => {
        return error
      })
  },
  openNVRStream(obj) {
    return AV_NVRRECORD_OPEN(obj)
  },
  // GB_AV_NVRRECORD_OPEN GB_AV_NVRRECORD_OPE
  async NVRopen(plugin, obj) { // 前端回放开流 普通回放 VideoPlugin.vue 788行调用 2019/04/04 09:34
    console.log(obj, plugin, 'kailiu')
    return new Promise(async(resolve, reject) => {
      let res
      try {
        if (obj.node.nodeId) { // 国标前端开流
          // {
          //   “gbDevIp”: “ ”,  //要回放的国标平台ip
          //   “gbDevPort”: int,  //要回放国标平台的port
          //   “gbPlatformID”: “ ”,  //国标平台id
          //   “gbDeviceID”: “ ”,  //要回放的设备id
          //   “startTime”: int,  //开始时间
          //   “endTime”: int,  //结束时间
          //   “streamType”: “main”,  //流类型
          //   “downLoad”:”FrontDownload” // 如果是下载后面的是固定的FrontDownload 这个名称 如果是回放固定是OpenPlayBack 这个字段
          // }
          let data = {}
          if (obj.recordInfo) { // 异步
            data = {
              gbDevIp: obj.recordInfo[0].data.gbDevIp,
              gbDevPort: obj.recordInfo[0].data.gbDevPort,
              gbPlatformID: obj.recordInfo[0].data.platformID,
              gbDeviceID: obj.recordInfo[0].data.gbDevId,
              startTime: obj.playInfo.sTime,
              endTime: obj.playInfo.eTime,
              streamType: 'main',
              downLoad: 'OpenPlayBack' // 回放固定字段
            }
          } else { // 同步
            data = {
              gbDevIp: obj.gbObj.gbDevIp,
              gbDevPort: obj.gbObj.gbDevPort,
              gbPlatformID: obj.gbObj.platformID,
              gbDeviceID: obj.gbObj.gbDevId,
              startTime: obj.playInfo.sTime,
              endTime: obj.playInfo.endTime,
              streamType: 'main',
              downLoad: 'OpenPlayBack' // 回放固定字段
            }
          }
          res = await GB_AV_NVRRECORD_OPEN(data)
        } else { // 普通前端开流
          res = await this.openNVRStream({
            devIp: obj.queryParam.devIp,
            devPort: obj.queryParam.devPort,
            channel: obj.queryParam.channel,
            sTime: obj.playInfo.sTime,
            eTime: obj.playInfo.eTime,
            streamType: obj.queryParam.streamType,
            streamConnPort: obj.node.eid.dport
          }).catch(err => err)
        }
        console.log(res, '回放开流')
        if (!res || !res.data) {
          const err = '开流失败！'
          reject(err)
          return
        }
        // obj.playInfo.sTime = obj.playInfo.endTime
        const pluginParam = JSON.stringify({
          streamType: obj.queryParam.streamType || obj.playInfo.streamType, // 兼容前端设备回放 同步
          vendor: obj.node.eid.manufacturer,
          session: '11',
          ip: obj.queryParam.devIp || obj.gbObj.gbDevIp,
          channel: obj.queryParam.channel || obj.playInfo.channel,
          port: obj.queryParam.devPort || obj.gbObj.gbDevPort + '',
          streamId: res.data.streamId
        })
        const openParam = JSON.stringify({
          port: res.data.TsPort + '',
          ip: res.data.TsIp,
          beginTime: obj.playInfo.sTime + '',
          endTime: (obj.playInfo.eTime || obj.playInfo.endTime) + '',
          cmdStr: pluginParam
        })
        const state = plugin.OpenRecordPlayerEx(openParam)
        resolve({
          state,
          res: res.data
        })
      } catch (e) {
        reject(e.response ? e.response.data.message : e)
      }
    })
  },
  // 国标设备开流
  async gbOpen(plugin, obj, res) {
    return new Promise(async(resolve, reject) => {
      try {
        if (!res || !res.data) {
          const err = '开流失败！'
          reject(err)
          return
        }
        const pluginParam = JSON.stringify({
          streamId: res.data.streamId
        })
        const openParam = JSON.stringify({
          port: res.data.TsPort + '',
          ip: res.data.TsIp,
          beginTime: obj.startTime + '',
          endTime: obj.endTime + '',
          cmdStr: pluginParam
        })
        resolve(plugin.OpenRecordPlayerEx(openParam))
      } catch (e) {
        reject(e.response ? e.response.data.message : e)
      }
    })
  },
  stop(plugin) {
    return plugin && plugin.CloseRecordPlay()
  },
  // 暂停之后的恢复播放
  resume(plugin) {
    return plugin.StartRecordPlay()
  },
  // 暂停
  pause(plugin) {
    return plugin.StopRecordPlay()
  },
  // 获取视频的起始和结束时间
  getPlayerTime(plugin) {
    return plugin.GetRecordPlayerTime()
  },
  // 获取当前时间
  getPlayerCurTime(plugin) {
    return plugin.GetRecordPlayerCurTime()
  },
  setPlayerRate(plugin, param) {
    return plugin.SetRecordPlayerRate(param.nRate, param.nScale)
  },
  // 逐帧播放
  setPlayerMode(plugin, param) {
    return plugin.SetRecordPlayerMode(param)
  },
  // 录像下载
  recordDump(plugin, param) {
    if (typeof param === 'object') {
      param = JSON.stringify(param)
    }
    return plugin.OpenRecordDump(param)
  },
  recordSave(plugin, {
    startTime,
    endTime,
    strmInfo,
    dsIp,
    path
  }) {
    const obj = {
      eventList: {
        timeInfo: {
          startTime: startTime,
          endTime: endTime
        },
        strmInfo: strmInfo
      }
    }
    const param = {
      ip: dsIp,
      port: '9000',
      fileName: path,
      beginTime: startTime,
      endTime: endTime,
      cmdStr: JSON.stringify({
        params: {
          jsonrpc: '2.0',
          id: '1',
          method: 'brest',
          call: 'AV.Record.playopen',
          args: obj
        }
      })
    }
    return new Promise((resolve, reject) => {
      const dump = JSON.parse(this.recordDump(plugin, param))
      if (dump.success) {
        this.setDumpStare(plugin, dump.DumpHandle, (a, b, c) => {
          this.stopDump(plugin, b)
          resolve()
          console.log('下载完成')
        })
      } else {
        const err = ''
        reject(err)
      }
    })
  },
  setDumpStare(plugin, param, callback) {
    // 设置录像下载
    return plugin.SetRecordDumpNotifyCallback(param, callback)
  },
  stopDump(plugin, param) {
    // 关闭录像下载
    return plugin.CloseRecordDump(param)
  },
  getDumpIsEnd(plugin, param) {
    // 判断下载是否完成
    return plugin.GetRecordDumpIsEnd(param)
  },
  // 录像切片
  getRecordSlice(plugin, param, callback) {
    if (typeof param === 'object') {
      param = JSON.stringify(param)
    }
    return plugin.GetRecordSlice(param, callback)
  },
  ...common
}
// extend(recordPlugin, common)

// 本地回放
const filePlugin = {
  name: 'file',
  openFile(plugin, param) {
    let result = plugin.GetFileBrowser(param.type, param.fileType, param.filter)
    result = JSON.parse(result)
    if (result.success) {
      return result.fileName
    } else {
      return result.errno
    }
  },
  open(plugin, param) {
    return plugin.OpenLocalPlayer(param.path, false)
  },
  resume(plugin) {
    return plugin.StartLocalPlay()
  },
  pause(plugin) {
    return plugin.StopLocalPlay()
  },
  stop(plugin) {
    return plugin.CloseLocalPlay()
  },
  getPlayerTime(plugin) {
    return plugin.GetLocalPlayTime()
  },
  getPlayerCurTime(plugin) {
    return plugin.GetLocalPlayCurTime()
  },
  setPlayerRate(plugin, param) {
    return plugin.LocalPlaySeek(param)
  },
  ...common
}
// extend(filePlugin, common)

const picturePlugin = {
  name: 'picture',
  open(plugin, param) {
    if (typeof param === 'object') {
      param = JSON.stringify(param)
    }
    return plugin.OpenImagePlayEx(param)
  },
  ...common
}
// extend(picturePlugin, common)

const emptyPlugin = {
  name: 'empty',
  open() {
    return {}
  },
  stop() {
    return {}
  },
  pause() {},
  resume() {},
  getCapture() {},
  fullScreen() {},
  openSound() {},
  closeSound() {},
  stopSpeech() {},
  closeSpeech() {},
  getPlayerCurTime() {}
}

export default {
  previewPlugin,
  recordPlugin,
  filePlugin,
  picturePlugin,
  emptyPlugin
}
