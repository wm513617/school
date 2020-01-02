import axios from 'axios'

const callServer = (url, method, data = {}, params = {}) => {
  return axios.request({
    url,
    method,
    data,
    params
  })
}

export default callServer
