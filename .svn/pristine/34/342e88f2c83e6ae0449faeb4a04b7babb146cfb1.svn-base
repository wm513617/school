import {
  get
} from './base'

// 机构搜索api
export const getResList = ({ types = '0', oid, seek, storeyId, mapType }) => get({
  url: `/setting/resource/search?types=${types}&oid=${oid}&seek=${seek}`,
  query: {orgtype: 0, storeyId, mapType}
})
