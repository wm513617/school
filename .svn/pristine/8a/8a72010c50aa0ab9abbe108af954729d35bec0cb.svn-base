import { get, put, post } from './base.js'
/*
 * 获取报警主机设备列表
 */
export const getAlarmMainDevicesApi = data => {
  const params = {
    query: data,
    url: '/setting/device'
  }
  return get(params)
}
/*
 * 获取报警主机报警输入列表
 */
export const getResOfDeviceByMainIdApi = data => {
  const params = {
    query: data,
    url: '/setting/alarm/resource'
  }
  return get(params)
}
/*
 * 获取报警输入资源联动视频
 */
export const getResActionApi = data => {
  const params = {
    query: data,
    url: '/setting/alarm/action'
  }
  return get(params)
}
/*
 * 布防
 */
export const protectionActionApi = data => {
  const params = {
    body: data,
    url: `/setting/alarm/arm`
  }
  return put(params)
}
/**
 *撤防
 */
export const removalActionApi = data => {
  const params = {
    body: data,
    url: `/setting/alarm/disarm`
  }
  return put(params)
}
/**
 *清除
 */
export const removeActionApi = data => {
  const params = {
    body: data,
    url: `/setting/alarm/clean`
  }
  return put(params)
}
/**
 *旁路
 */
export const branchActionApi = data => {
  const params = {
    body: data,
    url: `/setting/alarm/bypass`
  }
  return put(params)
}
/**
 *撤旁
 */
export const withdrawActionApi = data => {
  const params = {
    body: data,
    url: `/setting/alarm/pass`
  }
  return put(params)
}
/**
 *
 */
export function getAlarmDevStatus({ id = null }) {
  const params = {
    id: id
  }
  return get({
    url: '/setting/alarm/dev/status',
    query: params
  })
}
/**
 *手动获取所有报警主机及防区状态
 */
export function getAllAlarmDevStatus(payload) {
  return post({
    url: '/ctl/alarmstatus',
    body: payload
  })
}
/**
 *自动获取所有报警主机及防区状态
 */
export function getAllAlarmDevStatusAuto(payload) {
  return post({
    url: '/ctl/alarmstate',
    body: payload
  })
}
