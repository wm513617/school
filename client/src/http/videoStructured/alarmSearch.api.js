import { post } from 'src/http/base'

export const searchStructAlarmApi = (param) => { // 报警检索
  return post({
    url: `/structure/identify/alarmQuery?limit=${param.limit}&page=${param.page}`,
    body: param.data
  })
}
