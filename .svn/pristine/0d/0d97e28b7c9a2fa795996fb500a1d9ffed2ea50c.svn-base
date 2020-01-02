import { rpcCall, newRpcCall } from './rpcapi'
import { read } from '../store/modules/init.js'

// 用户心跳
export const userHeartbeat = () => {
  const user = read()
  const url = '/rest/2.0/lg/auth_token?session=' + user.session
  const method = 'Security.Session.heartbeat'
  const params = {
  }
  return newRpcCall(url, method, params, false)
}
// 用户登出
export const logoutUser = () => {
  const user = read()
  const url = '/rest/2.0/lg/auth_token?session=' + user.session
  const method = 'Security.Session.logout'
  const params = {
  }
  return newRpcCall(url, method, params, false)
}
// 用户登录
export const loginUser = ({ username, password, actor }) => {
  const url = '/rest/2.0/lg/auth_token'
  const method = 'Security.Session.login'
  const params = {
    user: username,
    password,
    actor
  }
  return newRpcCall(url, method, params, false)
}
/**
 * 修改密码
 * @param {jsonObject}
*/
export const passwordEdit = ({id, oldPswd, newPswd}) => {
  const user = read()
  const url = '/rest/2.0/lg/auth_token?session=' + user.session
  const method = 'Security.Password.edit'
  const params = {
    id, oldPswd, newPswd
  }
  return newRpcCall(url, method, params, false)
}
export const couldFirstLoginTip = ({ username, password, actor, session }) => {
  const url = '/rest/2.0/lg/auth_none' + '?session=' + session
  const method = 'FirstLoginTip.getCfg'
  const params = {
    user: username,
    password,
    actor
  }
  return rpcCall(url, method, params, true)
}

export const loginUserNonesec = ({ username, password, actor }) => {
  const url = '/rest/2.0/lg/auth_none'
  const method = 'Security.Session.login'
  const params = {
    user: username,
    password,
    actor
  }
  return rpcCall(url, method, params)
}
// 用户登出
// export const logoutUser = ({ session }) => {
//   const url = '/rest/2.0/lg/auth_none'
//   const method = 'Security.Session.logout'
//   const params = {
//     session
//   }
//   return newRpcCall(url, method, params)
// }

export const userModifier = ({ username, oldPassword, newPassword, session }) => {
  const url = '/rest/2.0/lg/auth_token?session=' + session
  const method = 'Security.User.passwd'
  const params = {
    'count': 1,
    'users': [{
      'user': username,
      'oldPassword': oldPassword,
      'newPassword': newPassword
    }]
  }
  return rpcCall(url, method, params, true)
}

export const getSessionList = ({ session }) => {
  const url = '/rest/2.0/lg/auth_token?session=' + session
  const method = 'Security.Session.list'
  const params = {
  }
  return rpcCall(url, method, params, true)
}
export const doLoginErrorMsg = (err) => {
  // let erroInfo = ''
  const errObj = {
    '1000': 'auth.errorCode.1000',
    '1001': 'auth.errorCode.1001',
    '1002': 'auth.errorCode.1002',
    '1003': 'auth.errorCode.1003',
    '1004': 'auth.errorCode.1004',
    '1005': 'auth.errorCode.1005',
    '1006': 'auth.errorCode.1006',
    '1007': 'auth.errorCode.1007',
    '1008': 'auth.errorCode.1008',
    '1009': 'auth.errorCode.1009',
    '8001': 'auth.errorCode.8001',
    '8002': 'auth.errorCode.8001',
    '8003': 'auth.errorCode.8001',
    '8004': 'auth.errorCode.8001',
    '8005': 'auth.errorCode.8001',
    '8006': 'auth.errorCode.8001',
    '8007': 'auth.errorCode.8001',
    '8008': 'auth.errorCode.8001',
    '8009': 'auth.errorCode.8001',
    '8010': 'auth.errorCode.8010',
    '8011': 'auth.errorCode.8011',
    '8012': 'auth.errorCode.8012',
    '8013': 'auth.errorCode.8013',
    '8014': 'auth.errorCode.8014',
    '8015': 'auth.errorCode.8015',
    '8016': 'auth.errorCode.8016',
    '14': 'auth.errorCode.14'
  }
  if (err in errObj) {
    return errObj[err]
  }
  return 'auth.errorCode.otherUnknown'
  // return erroInfo
}
