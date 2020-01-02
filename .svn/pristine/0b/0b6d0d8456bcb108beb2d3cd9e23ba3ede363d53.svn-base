import { get } from 'src/http/base'

export const getCaptureInitDataApi = () => { // 默认获取当天抓拍数据
  return get({
    url: `/structure/identify/init`
  })
}

export const getDefenseAlarmDataApi = () => { // 默认获取当天报警数据
  return get({
    url: `/structure/defense/task/alarm/init`
  })
}

export const getDefenseAlarmCountApi = (taskId) => { // 布控报警数据统计
  return get({
    url: `/structure/defense/task/alarm/todayCount`
  })
}

export const getCaptureTodayCountApi = () => { // 当天抓拍数据统计
  return get({
    url: `/structure/identify/init/count`
  })
}
