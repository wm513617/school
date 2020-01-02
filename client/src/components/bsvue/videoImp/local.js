import common from './common'
export const open = (plugin, path) => {
  return plugin.OpenLocalPlayer(path, false)
}
export const stop = plugin => {
  return plugin.CloseLocalPlay()
}
export const resume = plugin => {
  return plugin.StartLocalPlay()
}
export const pause = plugin => {
  return plugin.StopLocalPlay()
}
export const getFileTime = p => {
  const r = JSON.parse(p.GetLocalPlayTime())
  return r.success ? { start: r.msBegin, end: r.msEnd } : { start: 0, end: 0 }
}
export const getCurTime = p => {
  const r = JSON.parse(p.GetLocalPlayCurTime())
  console.log(r)
  return r.success ? r.msCur : -1
}
export default {
  ...common,
  open,
  stop,
  resume,
  pause,
  getFileTime,
  getCurTime
}
