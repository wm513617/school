import $http from 'axios'

/**
 * 获取排班计划列表
 */
function list({ limit, page, name = '' }) {
  return $http
    .get('/business/duty/plan', {
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
 * 增加计划
 */
function create(body) {
  return $http
    .post('/business/duty/plan', body)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改排班计划时查询班组带人员
 */
function getTeamWithPersonnal() {
  return $http
    .get('/business/duty/planstaff')
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改计划
 */
function modify(body) {
  return $http
    .put(`/business/duty/plan/${body._id}`, body)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 删除计划
 */
function remove(idsArr) {
  const ids = idsArr.join(',')
  return $http
    .delete('/business/duty/plan', {
      headers: {
        'x-bsc-ids': ids
      }
    })
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

/**
 * 修改值班计划详情中的人员
 * @param id 是修改的那一行人员的 id
 *      修改某人员时需要传入整行的数据
 */
function modifyPersonnel({ planId, detail, name }) {
  let params = {
    name,
    detail
  }
  return $http
    .put(`/business/duty/plan/${planId}`, params)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err.response.data)
    })
}

export default {
  list,
  create,
  getTeamWithPersonnal,
  modify,
  remove,
  modifyPersonnel
}
