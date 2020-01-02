// 时间转秒
export function toSecond(beginTime, endTime) {
  let beginSec = beginTime.split(':')[0] * 3600 + beginTime.split(':')[1] * 60 + beginTime.split(':')[2] * 1
  let endSec = endTime.split(':')[0] * 3600 + endTime.split(':')[1] * 60 + endTime.split(':')[2] * 1
  let timeSec = [beginSec, endSec]
  return timeSec
}
// 秒转时间
export function toHour(beginTime, endTime) {
  function time(sec) {
    let h = parseInt(sec / 3600)
    if (h < 10) {
      h = '0' + h
    }
    let m = parseInt((sec % 3600) / 60)
    if (m < 10) {
      m = '0' + m
    }
    let s = parseInt((sec % 3600) % 60)
    if (s < 10) {
      s = '0' + s
    }
    return h + ':' + m + ':' + s
  }
  let beginHour = time(beginTime)
  let endHour = time(endTime)
  return [beginHour, endHour]
}
