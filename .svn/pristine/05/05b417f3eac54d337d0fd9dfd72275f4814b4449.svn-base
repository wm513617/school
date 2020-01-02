import common from './common'

const stop = p => {
  return p.CloseRecordPlay()
}
const open = (p, {
  startTime,
  endTime,
  strmInfo,
  dsIp,
  dsPort
}) => {
  const obj = {
    eventList: {
      timeInfo: {
        startTime,
        endTime
      },
      strmInfo
    }
  }
  const pa = JSON.stringify({
    ip: dsIp,
    port: '9000',
    beginTime: startTime + '',
    endTime: endTime + '',
    cmdStr: JSON.stringify({
      params: {
        jsonrpc: '2.0',
        id: '1',
        method: 'brest',
        call: 'AV.Record.playopen',
        args: obj
      }
    })
  })
  return p.OpenRecordPlayerEx(pa)
}
const pause = p => {
  return p.StopRecordPlay()
}
const resume = p => {
  return p.StartRecordPlay()
}
const getRecordTime = p => {
  const r = JSON.parse(p.GetRecordPlayerTime())
  return r.success ? { start: r.msBegin, end: r.msEnd } : { start: 0, end: 0 }
}
const getCurTime = p => {
  const r = JSON.parse(p.GetRecordPlayerCurTime())
  return r.success ? r.msCur : -1
}
const setPlayerRate = (p, rate) => {
  if (rate < 1) {
    return p.SetRecordPlayerRate(1, 1 / rate)
  } else {
    return p.SetRecordPlayerRate(rate, 1)
  }
}
const setPlayerMode = (p, mode) => {
  return p.SetRecordPlayerMode(mode)
}
const download = (p, {
  startTime,
  endTime,
  strmInfo,
  dsIp,
  path
}, callback = () => {}) => {
  const cmd = {
    eventList: {
      timeInfo: {
        startTime,
        endTime
      },
      strmInfo
    }
  }
  const param = JSON.stringify({
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
        args: cmd
      }
    })
  })
  const r = JSON.parse(p.OpenRecordDump(param))
  if (r.success) {
    p.SetRecordDumpNotifyCallback(r.DumpHandle, (index, DumpHandle, status) => {
      closeDownload(p, DumpHandle)
      callback(DumpHandle)
    })
    return r.DumpHandle
  } else {
    return -1
  }
}
export const closeDownload = (p, DumpHandle) => {
  return p.CloseRecordDump(DumpHandle)
}
export const isFinishDownload = (p, DumpHandle) => {
  const r = JSON.parse(p.GetRecordDumpIsEnd(DumpHandle))
  return r.success ? r.bIsEnd : -1
}
export default {
  ...common,
  stop,
  open,
  pause,
  resume,
  getRecordTime,
  getCurTime,
  setPlayerRate,
  setPlayerMode,
  download,
  closeDownload,
  isFinishDownload
}
