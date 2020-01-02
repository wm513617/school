import { get, post, put, remove } from 'src/http/base'

export const getCotlMageTaskApi = (param) => { // 获取布控任务列表
  return get({
    url: `/structure/defense/task?page=${param.page}&limit=${param.limit}`
  })
}

export const getOneCotlMageTaskApi = (id) => { // 获取单个布控任务
  return get({
    url: `/structure/defense/task/${id}`
  })
}

export const addCotlMageTaskApi = (param) => { // 添加布控任务
  return post({
    url: `/structure/defense/task`,
    body: param
  })
}

export const editCotlMageTaskApi = (param) => { // 修改布控任务
  return put({
    url: `/structure/defense/task/${param._id}`,
    body: param
  })
}

export const deleteCotlMageTaskApi = (taskId) => { // 删除布控任务
  return remove({
    url: `/structure/defense/task/${taskId}`
  })
}

export const uploadImageApi = (data) => { // 识别图片
  return post({
    url: `/structure/identify/picsearchDiscern`,
    body: data
  })
}