// 时间转秒
export function toSecond(beginTime, endTime) {
  var beginSec = beginTime.split(':')[0] * 3600 + beginTime.split(':')[1] * 60 + beginTime.split(':')[2] * 1
  var endSec = endTime.split(':')[0] * 3600 + endTime.split(':')[1] * 60 + endTime.split(':')[2] * 1
  var timeSec = [beginSec, endSec]
  return timeSec
}
// 秒转时间
export function toHour(beginTime, endTime) {
  function time(sec) {
    var h = parseInt(sec / 3600)
    if (h < 10) {
      h = '0' + h
    }
    var m = parseInt((sec % 3600) / 60)
    if (m < 10) {
      m = '0' + m
    }
    var s = parseInt((sec % 3600) % 60)
    if (s < 10) {
      s = '0' + s
    }
    return h + ':' + m + ':' + s
  }
  var beginHour = time(beginTime)
  var endHour = time(endTime)
  return [beginHour, endHour]
}
