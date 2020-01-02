import { get, post, put, remove } from 'src/http/base'

export const getTaskList = (page, limit) => {
  return get({
    url: `veriface/defense/task?page=${page}&limit=${limit}`
  })
}

export const addTaskList = obj => {
  return post({
    url: 'veriface/defense/task',
    body: obj.body
    // {
    //   name: obj.name, // String 任务名称
    //   group: obj.group, // Array 底库
    //   always: obj.always, // Boolean 是否长期布控
    //   startTime: obj.startTime, // Number 开始时间
    //   endTime: obj.endTime, // Number 结束时间
    //   reason: obj.reason, // String 布控原因
    //   remark: obj.remark, // String 备注
    //   vaild: obj.vaild, // Boolean 是否有效
    //   point: obj.point, // Array 点位(String)
    //   pixel: obj.pixel, // Number 最小人脸像素
    //   interval: obj.interval, // Number 抓拍间隔
    //   ambiguity: obj.ambiguity, // Number 模糊度
    //   pitch: obj.pitch, // Number 俯仰角
    //   yaw: obj.yaw, // Number 偏航角
    //   roll: obj.roll // Number 翻滚角
    // }
  })
}

export const setTaskList = obj => {
  return put({
    url: `veriface/defense/task/${obj.id}`,
    body: obj.body
  })
}

export const delTaskList = obj => {
  return remove(
    {
      url: 'veriface/defense/task'
    },
    {
      data: {
        ids: obj.ids
      }
    }
  )
}

export const getVeriFaceGroup = () => {
  return get({
    url: 'veriface/group'
  })
}

export const getFacePointTree = () => {
  return get({
    url: 'veriface/defense/task/tree?orgtype=6&type=0'
  })
}

export const cancelVeriFaceGroup = obj => {
  return put({
    url: 'veriface/defense/task/patch',
    body: {
      vaild: obj.vaild,
      ids: obj.ids
    }
  })
}
