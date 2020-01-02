import { get, post, put, remove } from 'src/http/base'

// 底库相关
export const getGroupList = () => {
  // 后台暂时没有返回音频字段
  return get({
    url: '/veriface/group'
  })
}

export const addGroup = params => {
  return post({
    url: '/veriface/group',
    body: params
  })
}

export const setGroup = obj => {
  return put({
    url: `/veriface/group/${obj.id}`,
    body: obj.body
  })
}

export const delGroup = id => {
  return remove({
    url: `/veriface/group/${id}`
  })
}
// 用户相关
export const getUserList = obj => {
  return get({
    url: `/veriface/user/${obj.id}?page=${obj.page}&limit=${obj.limit}`
  })
}

export const addUser = obj => {
  return post({
    url: '/veriface/user',
    body: obj
  })
}

export const setUser = obj => {
  return put({
    url: `/veriface/user/${obj.id}`,
    body: obj.body
  })
}

export const delUser = ids => {
  return remove(
    {
      url: 'veriface/user/bat'
    },
    {
      data: {
        ids: ids
      }
    }
  )
}
// 导入 veriface/user/batimg
// 导出 veriface/user/

// 头像 上传 upload/file?type=image&category=face
