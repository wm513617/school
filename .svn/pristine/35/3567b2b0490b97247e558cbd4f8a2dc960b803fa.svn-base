import { newRpcCall, rpcGet } from './rpcapi'
import { read } from '../store/modules/init'
import { getPluginIp } from 'src/plugin/webPlugin.js'
const URL = key => '/rest/2.0/' + key + '/auth_token?session=' + read().session
const DOWNLOADURL = key => 'http://' + getPluginIp() + ':9002/rest/2.0/' + key + '/auth_token?session=' + read().session

// 打开视频流
export const AV_STREAM_START = params => newRpcCall(URL('ma'), 'AV.Stream.start', params)

// 关闭视频流-扩展协议
export const AV_STREAM_STOP = params => newRpcCall(URL('ma'), 'AV.Stream.stop', params)

// 手动开始录像
export const AV_RECORD_START = params => newRpcCall(URL('ma'), 'AV.Record.start', params)

// 手动结束录像
export const AV_RECORD_STOP = params => newRpcCall(URL('ma'), 'AV.Record.stop', params)

// 录像查询
export const AV_RECORD_LIST = params => newRpcCall(URL('ma'), 'AV.Record.list', params)

// 停止录像回放
export const AV_RECORD_PLAYCLOSE = params => newRpcCall(URL('ds'), 'AV.Record.playClose', params)

// 下载录像
export const AV_RECORD_DOWNLOAD = params => rpcGet(DOWNLOADURL('vmr'), 'download', params)

// 获取报警信息
export const ALERT_ALARM_GETALLALARM = param => newRpcCall(URL('ns'), 'Alert.Alarm.getAllAlarm', param)

// 日志查询
export const SYSTEM_LOG_QUERY = params => newRpcCall(URL('lg'), 'System.Log.query', params)

// 获取通道列表
export const SYSTEM_CHANNEL_LIST = () => newRpcCall(URL('ma'), 'System.channel.list', {})

// 遍历设备
export const SYSTEM_DEV_LIST = () => newRpcCall(URL('lg'), 'System.Dev.list', {})

// 获取前端设备参数
export const DEVICE_CONFIG_GET = params => newRpcCall(URL('ma'), 'Device.config.get', params)

// 设置前端设备参数
export const DEVICE_CONFIG_SET = params => newRpcCall(URL('ma'), 'Device.config.set', params)
// 日志类别获取
export const SYSTEM_LOG_GETTYPE = () => newRpcCall(URL('lg'), 'System.Log.getType', {})
// 获取所有用户
export const SECURITY_USERPRI_LIST = () => newRpcCall(URL('lg'), 'Security.UserPri.list', {})
// 打开对讲
export const TALK_STREAM_START = param => newRpcCall(URL('ma'), 'Talk.Stream.start', param)
// 关闭对讲
export const TALK_STREAM_STOP = param => newRpcCall(URL('ma'), 'Talk.Stream.stop', param)
