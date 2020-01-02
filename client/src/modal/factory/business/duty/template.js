import _ from 'lodash'
import moment from 'moment'

class Template {
  constructor(data) {
    this._init(data)
  }
  _init(data) {
    this.number = _.get(data, 'code', null)
    this.name = _.get(data, 'name', '-')
    this.time = this._time(data)
    this.detail = this._detail(data)
    this.id = _.get(data, '_id', null)
  }
  _time(data) {
    let date = _.get(data, 'time', '-')
    if (date === '-') {
      return date
    } else {
      return moment(date).format('YYYY-MM-DD')
    }
  }
  _detail(data) {
    if (_.isArray(data.detail)) {
      return data.detail.map(item => {
        return {
          name: item.shiftName,
          startTime: item.startTime,
          endTime: item.endTime
        }
      })
    }
    return null
  }
}

export default Template
