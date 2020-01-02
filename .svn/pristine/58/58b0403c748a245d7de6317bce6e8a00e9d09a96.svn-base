import { get, post, put, remove } from 'http/base'
import { getVerifaceParamApi, setVerifaceParamApi, getVerifaceParamFaceApi, getVerifaceParamEditApi, syncLibraryApi } from '../../../http/veriface/setting.api'
const state = {
  verifaceData: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 50,
    count: 0
  },
  serverPageInfo: {
    pages: 0,
    curPage: 1,
    limit: 10,
    count: 0
  },
  verifaceParam: {
    pattern: 'face,full', // 抓拍图片 'face,full'|人脸图+全景图，'full'|人脸图
    output: 1, // 抓拍模式 1|质量模式，2|全量模式
    passby: true, // 是否开启路人库
    roi: false, // 叠加显示ROI区域,暂缓实现
    faceFrame: false, // 叠加显示人脸框，暂缓实现
    saveTime: 30, // 抓拍图片保存天数
    capacity: 1000 // 路人库容量：万
  }
}
const mutations = {
  GET_VERIFACE_RESOURCES(state, payload) {
    state.verifaceData.list = payload.data
    state.verifaceData.pages = Number(payload.headers['x-bsc-pages'])
    state.verifaceData.curPage = Number(payload.headers['x-bsc-cur'])
    state.verifaceData.count = Number(payload.headers['x-bsc-count'])
    state.verifaceData.limit = Number(payload.headers['x-bsc-limit'])
  },
  UPDATE_VERIFACE_SERVER_PAGEINFO(state, payload) {
    state.serverPageInfo.pages = Number(payload.headers['x-bsc-pages'])
    state.serverPageInfo.curPage = Number(payload.headers['x-bsc-cur'])
    state.serverPageInfo.count = Number(payload.headers['x-bsc-count'])
    state.serverPageInfo.limit = Number(payload.headers['x-bsc-limit'])
  },
  SET_VERIFACE_PARAM(state, payload) {
    if (payload === '') {
      state.verifaceParam = {
        pattern: 'face,full',
        output: 1,
        passby: true,
        roi: false,
        faceFrame: false,
        saveTime: 30,
        capacity: 1000
      }
    } else {
      state.verifaceParam = {
        pattern: payload.pattern,
        output: payload.output,
        passby: payload.passby,
        roi: payload.roi,
        faceFrame: payload.faceFrame,
        saveTime: payload.saveTime,
        capacity: payload.capacity
      }
    }
  }
}
const actions = {
  /* ************************以下是资源配置相关*************************** */
  // 获取抓拍资源列表
  getVerifaceResources({ state, commit }, query) {
    const param = {
      query: query,
      url: '/setting/resource'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('GET_VERIFACE_RESOURCES', res)
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  getVerifaceParamFace({ state, commit }, query) {
    return getVerifaceParamFaceApi(query).then(res => {
      commit('GET_VERIFACE_RESOURCES', res)
    }).catch(err => console.log(err))
  },
  // 添加抓拍资源
  addVerifaceResources({ state, commit }, body) {
    return post({
      body,
      url: '/setting/resource/distribute'
    })
  },
  /* ************************以下是服务器配置相关*************************** */
  // 添加服务器
  addVerifaceServer({ state, commit }, body) {
    return new Promise((resolve, reject) => {
      post({
        body,
        url: '/veriface/server'
      })
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 删除单个服务器
  delVerifaceServer({ state, commit }, { id }) {
    return remove({
      url: `/veriface/server/${id}`
    })
  },
  // 删除多个服务器
  delVerifaceServers({ state, commit }, ids) {
    return remove(
      {
        url: `/veriface/server/batch`
      },
      {
        headers: {
          'x-bsc-ids': ids.join(',')
        }
      }
    )
  },
  // 修改服务器
  setVerifaceServer({ state, commit }, body) {
    return put({
      body: body.data,
      url: `/veriface/server/${body.id}`
    })
  },
  // 获取服务器
  getVerifaceServer({ state, commit }, body) {
    return new Promise((resolve, reject) => {
      get({
        url: `/veriface/server`
      })
        .then(res => {
          commit('UPDATE_VERIFACE_SERVER_PAGEINFO', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取机构树
  getVerifaceSettingOrgTree({ state, commit }, body) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/org/tree',
        query: {
          type: 6
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取资源机构树
  getVerifaceTree({ state, commit }, body) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/resource/tree',
        query: {
          orgtype: 6,
          type: 0
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 移动资源到指定机构
  changeVerifaceResourceOrg({ state }, payload) {
    const param = {
      url: '/setting/resource/org',
      body: {
        oid: payload.oid
      }
    }
    const config = {
      headers: {
        'x-bsc-ids': payload.ids
      }
    }
    return new Promise((resolve, reject) => {
      put(param, config)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量解绑资源
  unbindVerifaceResource({ state }, payload) {
    const param = {
      url: `/setting/resource/unbind?type=${payload.type}`
    }
    const config = {
      headers: {
        'x-bsc-ids': payload.ids
      }
    }
    return new Promise((resolve, reject) => {
      remove(param, config)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 单个资源详情（修改）
  getSingleVerifaceResource({ commit, state }, id) {
    const param = {
      url: '/setting/resource/' + id
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          if (!res.data.precord) { res.data.precord = '' }
          if (!res.data.delayrecord) { res.data.delayrecord = '' }
          if (!res.data.keyCode) { res.data.keyCode = '' }
          resolve(res.data)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 同步底库
  syncLibraryApi({ commit, state }, id) {
    return syncLibraryApi(id)
  },
  // 资源修改保存
  saveVerifaceResourceInfo({ commit, state }, obj) {
    const param = {
      body: obj.form,
      url: '/setting/resource/' + obj.id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  getVerifaceParam({ commit }) { // 获取抓拍设置高级参数
    return getVerifaceParamApi().then(data => {
      commit('SET_VERIFACE_PARAM', data.data)
    })
  },
  setVerifaceParam({ commit }, payload) { // 设置抓拍设置高级参数
    return setVerifaceParamApi(payload).then(commit('SET_VERIFACE_PARAM', payload))
  },
  getVerifaceParamEdit({ commit }, payload) { // 获取单条资源信息（修改）
    return getVerifaceParamEditApi(payload).then((res) => {
      return res.data
    })
  }
}

export default {
  state,
  mutations,
  actions
}
