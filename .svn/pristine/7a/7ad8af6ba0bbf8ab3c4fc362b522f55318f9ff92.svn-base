import { get, post, put, remove } from '../../http/base'
// 平台互联接口url
const baseUrl = '/platform'

const state = {
  locServer: {
    isGB28181: false, // 启用GB28181
    servername: '', // 本级服务器名称, 不可编辑
    serverid: '34020000001240000002', // 本级服务器ID,必填，正整数20位
    sipfield: '3402000000', // 本级SIP域，选填,正整数
    sipport: '7100', // 本级SIP端口，必填，4位正整数
    sipAuth: false, // SIP认证
    username: '', // 用户名，选填
    password: '' // 密码，选填
  },
  upServers: [
    {
      _id: 'lalala',
      serverName: '上级服务器1',
      serverAddr: '192.168.0.88',
      serverId: '2156465456616565416',
      sipport: '7100',
      sipfield: '5165165561',
      protocol: 'GB28181_2011',
      vender: 'HIK_IVMS',
      sipAuth: true,
      username: '15656156156136',
      password: '012345',
      validTime: 86400,
      heartRate: 60,
      maxTimeout: 3
    }
  ],
  downServers: [
    {
      _id: 'lalala1',
      serverName: '下级服务器1',
      serverAddr: '192.168.0.88',
      serverId: '2156465456616565416',
      sipport: '7100',
      sipfield: '5165165561',
      protocol: 'GB28181_2011',
      vender: 'HIK_IVMS',
      sipAuth: true,
      username: '15656156156136',
      password: '012345',
      validTime: 86400,
      heartRate: 60,
      maxTimeout: 3
    }
  ],
  videoLocTree: [],
  alarmLocTree: [],
  shareTrees: {}
}

const getters = {
}

const mutations = {
  UPDATE_LOCSERVER(sta, data) {
    // 如果数据格式ok，无需转换
    sta.locServer = data.sipAuth ? data : paramsAdapter(data, false, true)
  },
  UPDATE_UPSERVERS(sta, res) {
    const upServers = res.data.map(item => {
      return paramsAdapter(item, false)
    })
    sta.upServers = [...upServers]
  },
  ADD_UPSERVER(sta, res) {
    const obj = paramsAdapter(res.data, false)
    sta.upServers.push(obj)
  },
  UPDATE_UPSERVER(sta, params) {
    let index = null
    sta.upServers.map((item, i) => {
      item._id === params._id && (index = i)
    })
    index !== null && (sta.upServers.splice(index, 1, params))
  },
  DELETE_UPSERVER(sta, _id) {
    let index = null
    sta.upServers.map((item, i) => {
      item._id === _id && (index = i)
    })
    index !== null && (sta.upServers.splice(index, 1))
  },
  UPDATE_VIDEORESOURCE(sta, data) {
    sta.videoLocTree = data
  },
  UPDATE_ALARMRESOURCE(sta, data) {
    sta.alarmLocTree = data
  },
  UPDATE_DOWNSERVERS(sta, res) {
    const downServers = res.data.map(item => {
      return paramsAdapter(item, false)
    })
    sta.downServers = downServers
  },
  ADD_DOWNSERVER(sta, res) {
    const obj = paramsAdapter(res.data, false)
    sta.downServers.push(obj)
  },
  UPDATE_DOWNSERVER(sta, params) {
    let index = null
    sta.downServers.map((item, i) => {
      item._id === params._id && (index = i)
    })
    index !== null && (sta.downServers.splice(index, 1, params))
  },
  DELETE_DOWNSERVER(sta, _id) {
    let index = null
    sta.downServers.map((item, i) => {
      item._id === _id && (index = i)
    })
    index !== null && (sta.downServers.splice(index, 1))
  },
  ADD_SHARETREES(sta, {_id, res, type}) {
    const obj = sta.shareTrees
    if (obj[_id]) {
      obj[_id][type] = JSON.parse(JSON.stringify(res.data).replace(/nodeId/g, '_id').replace(/parentId/g, 'pid'))
    } else {
      obj[_id] = {}
      obj[_id][type] = JSON.parse(JSON.stringify(res.data).replace(/nodeId/g, '_id').replace(/parentId/g, 'pid'))
    }
    sta.shareTrees = { ...obj }
  }
}

const actions = {
  // 获取本级服务器配置
  getLocServer({commit}) {
    return new Promise((resolve, reject) => {
      get({
        url: baseUrl + '/server',
        query: { type: 'loc' }
      }).then(res => {
        res.data[0] && commit('UPDATE_LOCSERVER', res.data[0])
        resolve(res)
      }).catch(err => {
        console.error('getLocServer err: ', err)
        reject(err)
      })
    })
  },
  // 设置本级服务器配置
  setLocServer({commit}, params) {
    return new Promise((resolve, reject) => {
      put({
        url: baseUrl + '/server/' + params._id,
        body: Object.assign(paramsAdapter(params, true, true), {
          type: 'loc'
        })
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.error('setLocServer err: ', err)
        reject(err)
      })
    })
  },
  // 获取上级服务器列表
  getUpServers({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      get({
        url: baseUrl + '/server',
        query: { type: 'up' }
      }).then(res => {
        commit('UPDATE_UPSERVERS', res)
        resolve(res)
      }).catch(err => {
        console.error('getupServers err: ', err)
        reject(err)
      })
    })
  },
  // 添加上级服务器
  addUpServer({commit}, params) {
    return new Promise((resolve, reject) => {
      post({
        url: baseUrl + '/server',
        body: Object.assign(paramsAdapter(params), {
          type: 'up'
        })
      }).then(res => {
        commit('ADD_UPSERVER', res)
        resolve(res)
      }).catch(err => {
        console.error('addUpServer err: ', err)
        reject(err)
      })
    })
  },
  // 修改上级服务器
  editUpServer({commit}, params) {
    return new Promise((resolve, reject) => {
      put({
        url: baseUrl + '/server/' + params._id,
        body: Object.assign(paramsAdapter(params), {
          type: 'up'
        })
      }).then(res => {
        commit('UPDATE_UPSERVER', params)
        resolve(res)
      }).catch(err => {
        console.error('editUpServer err: ', err)
        reject(err)
      })
    })
  },
  // 删除上级服务器
  delUpServer({commit}, _id) {
    return new Promise((resolve, reject) => {
      remove({
        url: baseUrl + '/server/' + _id
      }).then(res => {
        commit('DELETE_UPSERVER', _id)
        resolve(res)
      }).catch(err => {
        console.error('delUpServer err: ', err)
        reject(err)
      })
    })
  },
  // 获取下级服务器列表
  getDownServers({commit}) {
    return new Promise((resolve, reject) => {
      get({
        url: baseUrl + '/server',
        query: { type: 'down' }
      }).then(res => {
        commit('UPDATE_DOWNSERVERS', res)
        resolve(res)
      }).catch(err => {
        console.error('getDownServers err: ', err)
        reject(err)
      })
    })
  },
  // 添加下级服务器
  addDownServer({commit}, params) {
    return new Promise((resolve, reject) => {
      post({
        url: baseUrl + '/server',
        body: Object.assign(paramsAdapter(params), {
          type: 'down'
        })
      }).then(res => {
        commit('ADD_DOWNSERVER', res)
        resolve(res)
      }).catch(err => {
        console.error('addDownServer err: ', err)
        reject(err)
      })
    })
  },
  // 修改下级服务器
  editDownServer({commit}, params) {
    return new Promise((resolve, reject) => {
      put({
        url: baseUrl + '/server/' + params._id,
        body: Object.assign(paramsAdapter(params), {
          type: 'down'
        })
      }).then(res => {
        commit('UPDATE_DOWNSERVER', params)
        resolve(res)
      }).catch(err => {
        console.error('editDownServer err: ', err)
        reject(err)
      })
    })
  },
  // 删除下级服务器
  delDownServer({commit}, _id) {
    return new Promise((resolve, reject) => {
      remove({
        url: baseUrl + '/server/' + _id
      }).then(res => {
        commit('DELETE_DOWNSERVER', _id)
        resolve(res)
      }).catch(err => {
        console.error('delDownServer err: ', err)
        reject(err)
      })
    })
  },
  // 获取本级video资源
  getVideoOrgResource({commit}) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/resource/tree',
        query: { type: 0 }
      }).then(res => {
        commit('UPDATE_VIDEORESOURCE', [res.data])
        resolve(res)
      }).catch(err => {
        console.error('getLocResource err: ', err)
        reject(err)
      })
    })
  },
  // 获取本级alarm资源
  getAlarmOrgResource({commit}) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/resource/tree/multi',
        query: { types: '1,9' }
      }).then(res => {
        commit('UPDATE_ALARMRESOURCE', [res.data])
        resolve(res)
      }).catch(err => {
        console.error('getAlarmResource err: ', err)
        reject(err)
      })
    })
  },
  // 上级共享资源
  shareResource({dispatch}, {_id, orgs, type}) {
    return new Promise((resolve, reject) => {
      const org = orgs.filter(v => {
        if (v.isOrg) { return true }
      }).map(v => {
        return v._id
      })
      const res = orgs.filter(v => {
        if (!v.isOrg) { return true }
      }).map(v => {
        return v._id
      })
      const params = {}
      if (type === 'video') {
        params.videoOrg = org
        params.videoRes = res
      } else {
        params.alarmOrg = org
        params.alarmRes = res
      }
      put({
        url: baseUrl + '/server/' + _id,
        body: {
          shareData: params
        }
      }).then(res => {
        dispatch('getUpServers').catch()
        resolve(res)
      }).catch(err => {
        console.error('shareResource err: ', err)
        reject(err)
      })
    })
  },
  // 获取国际机构树
  getshareTree({commit}, {_id, type}) {
    return new Promise((resolve, reject) => {
      get({
        url: `${baseUrl}/sharetree/${_id}/${type}`
      }).then(res => {
        commit('ADD_SHARETREES', {_id, res, type})
        resolve(res)
      }).catch(err => {
        console.error('getshareTree err: ', err)
        reject(err)
      })
    })
  },
  // 下联映射
  mappingTree({dispatch}, {serverId, orgId, type, orgs}) {
    return new Promise((resolve, reject) => {
      put({
        url: `${baseUrl}/sharetree/${serverId}/${orgId}/${type}`,
        body: JSON.parse(JSON.stringify(orgs).replace(/_id/g, 'nodeId').replace(/pid/g, 'parentId')).map(v => {
          delete v.isroot
          return v
        })
      }).then(res => {
        type === 'video' ? dispatch('getVideoOrgResource').catch() : dispatch('getAlarmOrgResource').catch()
        resolve(res)
      }).catch(err => {
        console.error('mappingTree err: ', err)
        reject(err)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

const paramsAdapter = (params, toServer = true, isLoc = false) => {
  const valAdapter = val => {
    switch (val) {
      case 'GB28181_2009':
        return 'GB28181-2009'
      case 'GB28181_2011':
        return 'GB28181-2011'
      case 'GB28181_2016':
        return 'GB28181-2016'
      case 'HIK_IVMS':
        return 'hikvision'
      case 'uniview':
        return 'yushi'
      // -----------------
      case 'GB28181-2009':
        return 'GB28181_2009'
      case 'GB28181-2011':
        return 'GB28181_2011'
      case 'GB28181-2016':
        return 'GB28181_2016'
      case 'hikvision':
        return 'HIK_IVMS'
      case 'yushi':
        return 'uniview'
      default:
        return val
    }
  }
  if (toServer) {
    const Sparams = isLoc ? {
      _id: params._id,
      isGB28181: params.isGB28181,
      name: params.servername,
      serverId: params.serverId,
      SIP: params.sipfield,
      port: params.sipport,
      isSIP: params.sipAuth,
      userName: params.username,
      pwd: params.password
    } : {
      _id: params._id,
      name: params.serverName,
      serverId: params.serverId,
      SIP: params.sipfield,
      isSIP: params.sipAuth,
      userName: params.username,
      pwd: params.password,
      ip: params.serverAddr,
      port: params.sipport,
      proto: valAdapter(params.protocol),
      manufacturer: valAdapter(params.vender),
      expire: params.validTime,
      headBeat: params.heartRate,
      beatTimes: params.maxTimeout,
      shareData: params.shareData
    }
    return Sparams
  } else {
    const Cparams = isLoc ? {
      _id: params._id,
      isGB28181: params.isGB28181,
      servername: params.name,
      serverId: params.serverId,
      sipfield: params.SIP,
      sipport: params.port,
      sipAuth: params.isSIP,
      username: params.userName,
      password: params.pwd
    } : {
      _id: params._id,
      serverName: params.name,
      serverAddr: params.ip,
      serverId: params.serverId,
      sipport: params.port,
      sipfield: params.SIP,
      protocol: valAdapter(params.proto),
      vender: valAdapter(params.manufacturer),
      sipAuth: params.isSIP,
      username: params.userName,
      password: params.pwd,
      validTime: params.expire,
      heartRate: params.headBeat,
      maxTimeout: params.beatTimes,
      shareData: params.shareData
    }
    return Cparams
  }
}

const addChecked = (item, arr) => {
  item.forEach(i => {
    i.checked = false
    if (arr.includes(i._id)) {
      i.checked = true
    }
    if (i.children && i.children) {
      addChecked(i.children, arr)
    }
  })
}
