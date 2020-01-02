import {post, get} from '../../../http/base'
import axios from 'axios'
export function createLibrary(param) {
  return post({
    url: 'through/senseTime/createLibrary',
    body: param
  })
}

export function getPermissionGroup() {
  return get({
    url: 'through/doorPermission/getPermissionGroup'
  })
}

export function getFaceBase() {
  return get({
    url: 'through/senseTime/getFaceBase'
  })
}

// 读取身份证信息
function ajax(url) {
  return new Promise((resolve, reject) => {
    let oAjax
    if (window.XMLHttpRequest) {
      oAjax = new XMLHttpRequest()
    } else {
      oAjax = new window.ActiveXObject('Microsoft.XMLHTTP')
    }
    oAjax.open('GET', url, true)
    oAjax.setRequestHeader('Accept', 'application/json, text/plain, */*')
    oAjax.send()
    oAjax.onreadystatechange = function() {
      if (oAjax.readyState === 4) {
        if (oAjax.status === 200) {
          let str = oAjax.responseText
          str = str.replace(/\\/g, '/')
          resolve(JSON.parse(str))
        } else {
          reject(oAjax.status)
        }
      }
    }
  })
}
export function readCardMessage() {
  // return axios({
  //   method: 'get',
  //   url: 'http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1',
  //   baseURL: ''
  // })
  // axios('http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1')
  return ajax('http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1')
}

// 门禁权限设置
export function addPermissionUser(param) {
  return post({
    url: 'through/doorPermission/addPermissionUser',
    body: param
  })
}

// 人脸权限设置
export function addLibraryUser(param) {
  return post({
    url: 'through/senseTime/addLibraryUser',
    body: param
  })
}
