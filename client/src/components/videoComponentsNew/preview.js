import axios from 'axios'
export const openFlow = async(pluginDom, data) => {
  // 本级预览开流
  // {devIp: "192.168.20.36", devPort: 3721, channel: 1, streamType: "main"}
  let obj = {
    devIp: data.devIp,
    devPort: data.devPort,
    channel: data.channel,
    streamType: data.streamType || 'main'
  }
  let res
  try {
    res = await axios.post(`ctl/video?type=video&channelid=${data.resId}`, obj)
  } catch (err) {
    return err
  }
  if (res.status !== 200) { return '-1' }
  let params = {
    port: res.data.tsPort + '',
    ip: res.data.tsIp,
    cmdStr: JSON.stringify(obj)
  }
  return pluginDom.OpenRealStreamEx(JSON.stringify(params))
}
