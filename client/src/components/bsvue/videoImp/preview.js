import common from './common'

export const open = (p, {
  streamType,
  vendor,
  ip,
  port,
  channel,
  tsPort,
  tsIp
}) => {
  const cmd = {
    streamType,
    vendor,
    session: '',
    ip,
    port,
    channel
  }
  const param = JSON.stringify({
    port: tsPort + '',
    ip: tsIp,
    cmdStr: JSON.stringify(cmd)
  })
  return p.OpenRealStreamEx(param)
}
export const stop = p => {
  return p.CloseRealStream()
}
export const isRecording = p => {
  const r = JSON.parse(p.RealIsSaving())
  return r.success ? r.bIsSaving : false
}
export const stopRecording = p => {
  return p.CloseRealSaveAs()
}
export const startRecording = (p, { path, type }) => {
  return p.RealStartSaveAs(path, type, 0)
}
export const openSpeech = (p, {
  ip,
  port,
  streamType,
  vendor,
  channel,
  tsIp,
  tsPort
}) => {
  return p.OpenSpeechEx(JSON.stringify({
    ip: tsIp,
    port: tsPort + '',
    cmdStr: JSON.stringify({
      streamType,
      vendor,
      session: '',
      ip,
      port,
      channel
    })
  }))
}
export const startSpeech = p => {
  return p.StartSpeech(false)
}
export const stopSpeech = p => {
  return p.StopSpeech()
}
export const closeSpeech = p => {
  return p.CloseSpeech()
}
export default {
  ...common,
  open,
  stop,
  isRecording,
  stopRecording,
  startRecording,
  openSpeech,
  startSpeech,
  stopSpeech,
  closeSpeech
}
