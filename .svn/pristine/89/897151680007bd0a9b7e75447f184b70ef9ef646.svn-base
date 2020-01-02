import { get, post, put, remove } from './base'

export const getMapIconOrganizaApi = () => get({
  url: '/setting/icon/org'
})

export const getMapIconList = (query) => get({
  url: '/setting/icon',
  query
})

export const postIconApi = (body) => post({
  url: '/setting/icon',
  body
})

export const putIconApi = (id, body) => put({
  url: '/setting/icon/' + id,
  body
})

export const removeIconApi = arrId => {
  let _ids = arrId.join(',')
  return remove({
    url: '/setting/icon'
  }, {
    headers: {
      'x-bsc-ids': _ids
    }
  })
}

// export const getGroupIconApi = query => get({
//   url: '/setting/icon/group',
//   query
// })

export const setIconDefaultApi = (id, body) => put({
  url: '/setting/icon/' + id + '/default',
  body
})
export const setIconRotateApi = (oid, isRotate) => put({
  url: '/setting/icon/' + oid + '/rotate',
  body: {isRotate}
})
