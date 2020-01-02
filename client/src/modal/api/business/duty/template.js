import $http from 'axios'

/**
 * 获取排班模板列表
 */
function list({ limit, page, name = '' }) {
  return $http
    .get('/business/duty/template', {
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

/**
 * 添加排班模板
 * TODO 把参数加一下
 */
function create(params) {
  return $http
    .post('/business/duty/template', params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改模板
 */
function modify({ code, name, time, id, detail }) {
  let params = {
    code,
    name,
    time,
    detail
  }
  return $http
    .put(`/business/duty/template/${id}`, params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 *  删除模板
 */
function remove(idsArr) {
  const ids = idsArr.join(',')
  return $http
    .delete('/business/duty/template', {
      headers: {
        'x-bsc-ids': ids
      }
    })
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

export default {
  list,
  create,
  modify,
  remove
}
