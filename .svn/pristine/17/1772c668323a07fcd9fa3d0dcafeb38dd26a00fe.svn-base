// 业务管理/值班管理/班组 相关接口
import $http from 'axios'

/**
 * 获取班组列表
 */
function list() {
  let params = { type: 7 }
  return $http
    .get('/business/duty/group', {
      params
    })
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 创建班组
 */
function create({ name, code, pid }) {
  let params = {
    name,
    code,
    pid,
    type: 7 // 7 指定为班组树
  }
  return $http
    .post('/business/duty/group', params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 删除班组
 */
function remove({ id }) {
  return $http
    .delete(`/business/duty/group/${id}`)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改班组
 */
function modify({ id, name, code }) {
  let params = {
    name,
    code
  }
  return $http
    .put(`/business/duty/group/${id}`, params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

export default {
  create,
  list,
  modify,
  remove
}
