export const download = (url, nameFormat, complete, defeated, progress) => {
  let req = new XMLHttpRequest()
  req.open('get', url, true)
  // 监听进度事件
  req.addEventListener('progress', function(evt) {
    if (evt.lengthComputable) {
      // let percentComplete = evt.loaded / evt.total;
      progress ? progress(evt) : ''
    }
  }, false)
  req.responseType = 'blob'
  req.onreadystatechange = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        if (typeof window.chrome !== 'undefined') {
          // Chrome version
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(req.response)
          link.download = nameFormat
          link.click()
        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE version
          let blob = new Blob([req.response], { type: 'application/force-download' })
          window.navigator.msSaveBlob(blob, nameFormat)
        } else {
          // Firefox version
          let file = new File([req.response], nameFormat, { type: 'application/force-download' })
          window.open(URL.createObjectURL(file))
        }
        complete ? complete() : ''
      } else {
        // 请求失败
        defeated ? defeated() : ''
      }
    }
  }
  req.send()
}
