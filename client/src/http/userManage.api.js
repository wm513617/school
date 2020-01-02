import { get, post, put, remove } from './base'
import { read } from '../storage/index'

// 安全策略
export const getSafePolicyApi = () => get({
  url: '/setting/strategy'
})

export const editSafePolicyApi = param => put({
  url: '/setting/strategy',
  body: param
})

// 权限分配
export const getActionApi = () => get({
  url: '/setting/action'
})

export const addActionApi = param => post({
  url: '/setting/action',
  body: param
})

export const delActionApi = param => remove({
  url: `/setting/action/${param}`
})

export const modifyActionApi = param => put({
  url: `/setting/action/${param.id}`,
  body: param.body
})

// 角色管理
export const getRoleListApi = () => get({
  url: '/setting/role'
})

export const addRoleApi = param => post({
  url: '/setting/role',
  body: param
})

export const getRoleInfoApi = param => get({
  url: `/setting/role/${param}`
})

export const editRoleInfoApi = param => put({
  url: `/setting/role/${param._id}`,
  body: param
})

export const delRoleApi = param => remove({
  url: `/setting/role/${param}`
})

export const getModuleApi = () => get({
  url: '/setting/role/auth'
})

export const getChannelApi = () => get({
  url: '/setting/device/channeltree',
  query: {
    orgtype: 0,
    bigtype: 0,
    channeltype: 0,
    isUserManage: 'yes'
  }
})

export const searchChannelApi = param => get({
  url: '/setting/resource/searchRes',
  query: {...param}
})

export const getAssignApi = param => get({
  url: '/setting/role/assign',
  query: param
})

export const getAlarmDeviceApi = param => get({
  url: '/setting/resource/distributiontreeforalarm',
  query: param
})

export const getFireDeviceApi = param => get({
  url: '/setting/resource/distributiontree',
  query: param
})

// 获取报警求助 树
export const getHelpDeviceApi = () => get({
  url: 'setting/resource/alarmhelptree'
})

export const getTvWallApi = () => get({
  url: `setting/role/wall`
})

// 用户管理
export const getUserDetailApi = param => get({
  url: '/setting/user/detail',
  query: {
    name: param.name,
    startTime: param.startTime,
    endTime: param.endTime,
    key: param.key,
    limit: param.limit,
    page: param.page
  }
})

export const getUserListApi = () => get({
  url: '/setting/user'
})

export const addUserApi = param => post({
  url: '/setting/user',
  body: param
})

export const getUserInfoApi = param => get({
  url: `/setting/user/${param}`
})

export const editUserInfoApi = param => put({
  url: `/setting/user/${param.id}`,
  body: param.data
})

export const delUserApi = param => remove({
  url: `/setting/user/${param}`
})

export const getUserLogApi = param => get({
  url: '/setting/user/duty',
  query: {
    id: param.id,
    startTime: param.startTime,
    endTime: param.endTime,
    limit: param.limit,
    page: param.page
  }
})

export const editPwdApi = param => put({
  url: `/setting/user/pwd/${param.id}`,
  body: param.data
})

export const getmoduleListApi = () => get({
  url: 'setting/role/module'
})

export const moveNodeApi = param => put({
  url: `/setting/role/updown/${param.activeId}`,
  body: {
    id: param.replaceId,
    type: param.type
  }
})

export const searchUkeysApi = param => get({
  url: 'setting/user/ukeys',
  headers: {
    'x-bsc-keys': param.join()
  }
})

export const getFaceDeviceTreeApi = data => {
  const param = {
    url: 'setting/resource/faceTree'
  }
  return get(param)
}

export const getPassStockTreeApi = data => {
  const param = {
    url: 'setting/role/passManage'
  }
  return get(param)
}

export const searchPassGroupApi = data => {
  const param = {
    url: 'setting/role/passGroup',
    query: data
  }
  return get(param)
}

export const getFireDeviceTreeApi = data => {
  const param = {
    url: 'setting/resource/fireAlarmTree'
  }
  return get(param)
}
