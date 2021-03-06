import axios from 'axios'
import moment from 'moment'
export const videoFilter = (result, data) => {
  try {
    if (!result.eventList.length) {
      return {eventList: []}
    }
  } catch (err) {
    return {eventList: []}
  }

  // 去掉广播对讲开始时间与结束时间相同的录像段
  result.eventList = result.eventList.filter(item => {
    return item.evtTblInfo.startTime !== item.evtTblInfo.endTime
  })
  // 录像段排序
  function compare() { // 这是比较函数
    return function(m, n) {
      var a = m.evtTblInfo.startTime
      var b = n.evtTblInfo.startTime
      return a - b // 升序
    }
  }
  result.eventList.sort(compare())

  if ((data.videoSegmentsIndex !== undefined) && result.eventList.length !== 0) {
    // 对讲只播放某段录像， videoSegmentsIndex 为对应录像段索引
    result.eventList = data.videoSegmentsIndex <= result.eventList.length ? [JSON.parse(JSON.stringify(result.eventList[data.videoSegmentsIndex]))] : []
  }

  // 默认返回录像段数组 是按时间顺序排列
  let startTime = data.startTime
  let endTime = data.endTime
  let eventList = []
  let backList = JSON.parse(JSON.stringify(result))
  try {
    for (const iterator of result.eventList) {
      // 过滤录像段 没在起始时间范围去掉
      if (iterator.evtTblInfo.endTime < startTime || iterator.evtTblInfo.startTime > endTime) { continue }
      eventList.push(JSON.parse(JSON.stringify(iterator)))
    }
    // 将录像段的起止时间改为查询的起止时间， 若第一个录像段开始时间大于查询开始时间则不修改； 若最后一个录像段的结束时间小于查询的结束时间则不修改
    if (eventList[0].evtTblInfo.startTime < startTime) {
      eventList[0].evtTblInfo.startTime = startTime
    }
    if (eventList[eventList.length - 1].evtTblInfo.endTime > endTime) {
      eventList[eventList.length - 1].evtTblInfo.endTime = endTime
    }
    backList.startTime = eventList[0].evtTblInfo.startTime
    backList.endTime = eventList[eventList.length - 1].evtTblInfo.endTime
  } catch (err) {
    console.log(err, '录像段过滤错误')
    eventList = []
  }
  backList.eventList = eventList
  return backList
}
export const checkVideoList = async(data) => {
  let obj = {
    devIp: data.devIp,
    devPort: data.devPort,
    channel: data.channel,
    eventType: data.eventType || ['all'],
    typeName: data.typeName || '',
    typeContent: data.typeContent || '',
    startTime: data.startTime,
    endTime: data.endTime,
    streamType: data.streamType || 'main',
    page: data.page || 1,
    rows: data.rows || 1000
  }
  let res
  try {
    if (data.appName !== undefined && data.webName !== undefined) {
    // 电子巡更广播对讲
      obj = {
        appName: data.appName,
        dsId: data.dsId,
        endTime: data.endTime,
        sn: data.sn,
        startTime: data.startTime,
        webName: data.webName,
        page: data.page || 1,
        rows: data.rows || 1000
      }
      res = await axios.post('record/phonequery', obj)
    } else if (data.serverId) {
      // 对讲查询和一般回放查询不同
      data.dsServerId && (obj.dsServerId = data.dsServerId)
      res = await axios.post('record/shibangquery', obj)
    } else {
      res = await axios.post('record/query', obj) // 中心回放录像查询
    }
  } catch (error) {
    return {}
  }
  return res
}
export const openPlaybackList = async(pluginDom, data, isQuery) => {
  // isQuery 是否需要查询路线段
  let res = data // 不查询直接传插件参数
  if (isQuery) {
    res = await checkVideoList(data)
    if (typeof res.data !== 'object') {
      return [{msg: '查询无录像！'}]
    }
    res = videoFilter(res.data.result || res.data, data)
    if (!res.eventList.length) {
      return [{msg: '查询无录像！'}]
    }
  }
  //   {
  //     "ip"：”192.168.1.1”,    //点分十进制
  //     "port":”3721”,         //端口
  //     "beginTime":”0”,       //开始时间
  //     "endTime"：”30”,      //结束时间
  //     "cmdStr":””           //web协议获取的开流命令字符串
  // }
  let startTime = isQuery ? res.eventList[0].evtTblInfo.startTime : data.newStartTime
  // 结束时间为录像查询的最后时间  videoFilter 方法中已将录像段的最后结束时间转成查询时间 若录像段结束时间小于查询时间 就以录像段结束时间为准
  let endTime = isQuery ? res.eventList[res.eventList.length - 1].evtTblInfo.endTime : data.eventList[data.eventList.length - 1].evtTblInfo.endTime
  let strmInfo = {}
  if (isQuery) {
    strmInfo = res.eventList[0].strmInfo
  } else {
    for (const iterator of data.eventList) {
      if (iterator.evtTblInfo.startTime < data.newStartTime < iterator.evtTblInfo.endTime) {
        strmInfo = iterator.strmInfo
      }
    }
    if (Object.keys(strmInfo).length === 0) {
      // 录像跳转  没有匹配的 录像段
      return {msg: '无可用录像段！'}
    }
  }
  let obj = {
    eventList: {
      timeInfo: {
        startTime: startTime,
        endTime: endTime
      },
      strmInfo: strmInfo
    }
  }
  const cmd = {
    params: {
      jsonrpc: '2.0',
      id: '1',
      method: 'brest',
      call: 'AV.Record.playopen',
      args: obj
    }
  }
  let param = {
    ip: isQuery ? res.dsIp : data.dsIp,
    port: 9000 + '',
    beginTime: startTime + '',
    endTime: endTime + '',
    cmdStr: JSON.stringify(cmd)
  }
  res = Object.assign(data, res)
  // res.occurrenceTime = data.occurrenceTime || ''
  // res.name = data.name || ''
  return [pluginDom.OpenRecordPlayerEx(JSON.stringify(param)), res, isQuery]
}
export const stopRecordPlay = async(pluginDom, isPlay) => {
  isPlay ? pluginDom.StartRecordPlay() : pluginDom.StopRecordPlay()
}
export const downloadVideoSegments = async(pluginDom, data, isQuery, callback) => {
  let res, startTime, endTime, strmInfo
  try {
    res = data
    if (isQuery) {
      res = await checkVideoList(data)
      console.log('res', res)
      if (res.data.result === undefined) {
        if (typeof res.data !== 'object' || res.data.eventList.length === 0) { return {success: false} }
        res = videoFilter(res.data, data)
      } else {
        if (typeof res.data !== 'object' || res.data.result.eventList.length === 0) { return {success: false} }
        res = videoFilter(res.data.result, data)
      }
      if (res.eventList.length === 0) { return {success: false} } // 没有录像段返回失败
      strmInfo = res.eventList[0].strmInfo
      startTime = res.eventList[0].evtTblInfo.startTime
      endTime = res.eventList[res.eventList.length - 1].evtTblInfo.endTime
    } else {
      strmInfo = data.eventList[0].strmInfo
      startTime = data.startTime
      endTime = data.endTime
    }
  } catch (err) {
    console.log(err)
  }
  let obj = {
    eventList: {
      timeInfo: {
        startTime: startTime,
        endTime: endTime
      },
      strmInfo: strmInfo
    }
  }
  const cmd = {
    params: {
      jsonrpc: '2.0',
      id: '1',
      method: 'brest',
      call: 'AV.Record.playopen',
      args: obj
    }
  }
  let param = {
    ip: isQuery ? res.dsIp : data.dsIp,
    port: 9000 + '',
    beginTime: startTime + '',
    fileName: data.fileName,
    endTime: endTime + '',
    cmdStr: JSON.stringify(cmd)
  }
  // return pluginDom.OpenRecordDump(JSON.stringify(param))
  const r = JSON.parse(pluginDom.OpenRecordDump(JSON.stringify(param)))
  // console.dir(callback)
  if (r.success) {
    pluginDom.SetRecordDumpNotifyCallback(r.DumpHandle, (index, DumpHandle, status) => {
      // 插件下载完成回调 完成后关闭下载
      // closeDownload(pluginDom, DumpHandle)
      pluginDom.CloseRecordDump(DumpHandle)
      callback && callback(DumpHandle)
    })
  }
  return r
}
export const batchDownloadVideoSegments = async(data, parameters, path) => {
  let dom = document.querySelector('#global-plugin')
  let arr = []
  // 批量下载名称上拼接上index
  for (let index = 0; index < data.length; index++) {
    if (!data[index].fileName) {
      data[index].fileName = `${path || parameters.downloadVideoPath}\\${data[index].name}_${moment(new Date()).format('YYYYMMDDHHmmss')}_${index}.${parameters.downloadVideoType.toLowerCase()}`
    }
    arr.push(downloadVideoSegments(dom, data[index], true))
  }
  return Promise.all(arr)
}
// 设置回放速度
export const setRecordPlayerRate = (pluginDom, { nRate, nScale }) => {
  return pluginDom.SetRecordPlayerRate(nRate, nScale)
}
// 设置播放模式
export const setRecordPlayerMode = (pluginDom, nPlayMode) => {
  // [in] nPlayMode  播放模式  0:正常模式   1:逐帧模式   2 :I帧播放
  let status = pluginDom.SetRecordPlayerMode(nPlayMode)
  if (status === 0 && nPlayMode === 1) {
    // 逐帧的时候要开始播放
    pluginDom.StartRecordPlay()
  }
}
