import Notice from '../../../../src/components/notice'

export function successMsg(msg) {
  Notice.success({
    title: '提示',
    desc: msg + '成功',
    duration: 2
  })
}
// 失败提示
export function failMsg(msg) {
  Notice.error({
    title: '错误',
    desc: (msg.response && msg.response.data && msg.response.data.message) || msg.message,
    duration: 2
  })
}
// 警告提示
export function warningMsg(msg) {
  Notice.warning({
    title: '提示',
    desc: (msg.response && msg.response.data.message) || msg.message,
    duration: 2
  })
}
