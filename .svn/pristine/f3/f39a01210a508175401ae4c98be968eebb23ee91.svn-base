// TODO 统一数据请求配置
import $http from 'axios'

/**
 * 获取人员列表
 */
function listAll({ limit, page, name = '' }) {
  return $http
    .get('/business/duty/staff', {
      params: {
        limit,
        page,
        name
      }
    })
    .then(res => res)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

function getSingleListAll(oid) {
  return $http
    .get('/business/duty/securityListAll/' + oid)
    .then(res => res)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 根据班组 id 查询人员
 */
function listOfTeam({ id, limit, page, name = '' }) {
  return $http
    .get('/business/duty/org', {
      params: {
        id,
        limit,
        page,
        name
      }
    })
    .then(res => res)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 获取机构树带人员数组
 */
function listWhithTeam() {
  return $http
    .get('/business/duty/grouptree')
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 删除人员
 */
function remove(idsArr) {
  const ids = idsArr.join(',')
  return $http
    .delete('/business/duty/staff', {
      headers: {
        'x-bsc-ids': ids
      }
    })
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 创建人员
 */
function create({ code, name, group, gender, phone, department, title, address }) {
  let params = { code, name, group, gender, phone, department, title, address }
  return $http
    .post('/business/duty/staff', params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}
/**
 * 添加人员
 */
function add(body) {
  return $http
    .post('/business/duty/addstaff', body)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改人员信息
 */
function modify(id, body) {
  return $http
    .put(`/business/duty/staff/${id}`, body)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改人员所属班组
 */
function modifyTeam(params) {
  return $http
    .put('/business/duty/staffgroup', params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}
// 获取值班人员个人值班详情
function personnel(id, query) {
  return $http
    .get(`/business/duty/history/${id}`, {params: query})
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

export default {
  create,
  listAll,
  listOfTeam,
  listWhithTeam,
  modify,
  modifyTeam,
  remove,
  add,
  personnel,
  getSingleListAll
}
